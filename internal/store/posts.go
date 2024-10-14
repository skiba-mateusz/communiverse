package store

import (
	"context"
	"database/sql"
	"github.com/lib/pq"
)

type Post struct {
	ID          int64      `json:"id"`
	Title       string     `json:"title"`
	Content     string     `json:"content"`
	Slug        string     `json:"slug"`
	Tags        []string   `json:"tags"`
	Comments    []Comment  `json:"comments"`
	NumComments int        `json:"numComments"`
	CommunityID int64      `json:"communityID"`
	Community   *Community `josn:"community,omitempty"`
	UserID      int64      `json:"userID"`
	User        *User      `json:"user,omitempty"`
	Votes       int        `json:"votes"`
	UserVote    int        `json:"userVote"`
	CreatedAt   string     `json:"createdAt"`
}

type PostStore struct {
	db *sql.DB
}

func (s *PostStore) Create(ctx context.Context, post *Post) error {
	query := `
		INSERT INTO posts (title, content, slug, tags, community_id, user_id)
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := s.db.QueryRowContext(
		ctx,
		query,
		post.Title,
		post.Content,
		post.Slug,
		pq.Array(post.Tags),
		post.CommunityID,
		post.UserID,
	).Scan(
		&post.ID,
		&post.CreatedAt,
	)
	if err != nil {
		return err
	}

	return nil
}

func (s *PostStore) GetBySlug(ctx context.Context, slug string, userID int64) (*Post, error) {
	query := `
		SELECT 
			p.id, p.title, p.content, p.slug, p.tags, p.user_id, p.community_id, p.created_at,
			u.id, u.name, u.username, u.bio,
			COALESCE(COUNT(DISTINCT c.id), 0) AS num_comments,
			COALESCE((SELECT SUM(value) FROM post_votes WHERE post_id = p.id), 0) AS votes,
			COALESCE(pv_user.value, 0) AS user_vote
		FROM 
		    posts p  
		INNER JOIN 
		    users u ON u.id = p.user_id
		LEFT JOIN 
		    comments c ON c.post_id = p.id
		LEFT JOIN post_votes pv_user ON pv_user.post_id = p.id AND pv_user.user_id = $1
		WHERE p.slug = $2
		GROUP BY p.id, u.id, pv_user.value
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var post Post
	post.User = &User{}

	err := s.db.QueryRowContext(
		ctx,
		query,
		userID,
		slug,
	).Scan(
		&post.ID,
		&post.Title,
		&post.Content,
		&post.Slug,
		pq.Array(&post.Tags),
		&post.UserID,
		&post.CommunityID,
		&post.CreatedAt,
		&post.User.ID,
		&post.User.Name,
		&post.User.Username,
		&post.User.Bio,
		&post.NumComments,
		&post.Votes,
		&post.UserVote,
	)
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	return &post, nil
}

func (s *PostStore) Delete(ctx context.Context, id int64) error {
	query := `DELETE FROM posts WHERE id = $1`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	res, err := s.db.ExecContext(
		ctx,
		query,
		id,
	)
	if err != nil {
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return ErrNotFound
	}

	return nil
}

func (s *PostStore) Update(ctx context.Context, post *Post) error {
	query := `
		UPDATE posts SET title = $1, content = $2, tags = $3, slug = $4 WHERE id = $5
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	res, err := s.db.ExecContext(
		ctx,
		query,
		post.Title,
		post.Content,
		pq.Array(post.Tags),
		post.Slug,
		post.ID,
	)
	if err != nil {
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return ErrNotFound
	}

	return nil
}

func (s *PostStore) GetCommunityPosts(ctx context.Context, communityID, userID int64, q PaginatedPostsQuery) ([]Post, error) {
	query := `
		SELECT
			p.id, p.title, p.tags, p.slug, p.user_id, p.community_id, p.created_at,
			c.id, c.name, c.slug, c.user_id,			
			u.id, u.name, u.username,
			COALESCE(COUNT(DISTINCT cm.id), 0) AS num_comments,
			COALESCE(vote_totals.total_votes, 0) AS votes,
			COALESCE(pv_user.value, 0) AS user_vote
		FROM 
			posts p
		INNER JOIN 
			communities c ON c.id = p.community_id
		INNER JOIN
			users u ON u.id = p.user_id
		LEFT JOIN
			comments cm ON cm.post_id = p.id
		LEFT JOIN 
			(SELECT post_id, SUM(value) AS total_votes 
			 FROM post_votes
			 GROUP BY post_id) AS vote_totals ON vote_totals.post_id = p.id
		LEFT JOIN 
			post_votes pv_user ON pv_user.post_id = p.id AND pv_user.user_id = $1
		WHERE
			c.id = $2 AND
			(p.title ILIKE '%' || $3 || '%' OR p.content ILIKE '%' || $3 || '%')
		GROUP BY p.id, u.id, c.id, pv_user.value, vote_totals.total_votes
		ORDER BY p.created_at ` + q.Sort + `
		LIMIT $4 OFFSET $5
	`

	posts, err := s.fetchPosts(ctx, query, userID, communityID, q.Search, q.Limit, q.Offset)
	if err != nil {
		return []Post{}, err
	}

	for i := range posts {
		posts[i].Community = nil
	}

	return posts, nil
}

func (s *PostStore) GetPosts(ctx context.Context, userID int64, q PaginatedPostsQuery) ([]Post, error) {
	query := `
		SELECT
			p.id, p.title, p.tags, p.slug, p.user_id, p.community_id, p.created_at,
			c.id, c.name, c.slug, c.user_id,
			u.id, u.name, u.username,
			COALESCE(COUNT(DISTINCT cm.id), 0) AS num_comments,
			COALESCE(vote_totals.total_votes, 0) AS votes,
			COALESCE(pv_user.value, 0) AS user_vote
		FROM 
			posts p
		INNER JOIN 
			communities c ON c.id = p.community_id
		INNER JOIN
			users u ON u.id = p.user_id
		LEFT JOIN
			comments cm ON cm.post_id = p.id
		LEFT JOIN 
			(SELECT post_id, SUM(value) AS total_votes 
			 FROM post_votes
			 GROUP BY post_id) AS vote_totals ON vote_totals.post_id = p.id
		LEFT JOIN 
			post_votes pv_user ON pv_user.post_id = p.id AND pv_user.user_id = $1
		WHERE
			(p.title ILIKE '%' || $2 || '%' OR p.content ILIKE '%' || $2 || '%')
		GROUP BY p.id, u.id, c.id, pv_user.value, vote_totals.total_votes
		ORDER BY p.created_at ` + q.Sort + `
		LIMIT $3 OFFSET $4
	`
	return s.fetchPosts(ctx, query, userID, q.Search, q.Limit, q.Offset)
}

func (s *PostStore) GetUserFeed(ctx context.Context, userID int64, q PaginatedPostsQuery) ([]Post, error) {
	query := `
		SELECT 
			p.id, p.title, p.tags, p.slug, p.user_id, p.community_id, p.created_at,
			c.id, c.name, c.slug, c.user_id,
			u.id, u.name, u.username,
			COALESCE(COUNT(DISTINCT cm.id), 0) AS num_comments,
			COALESCE(vote_totals.total_votes, 0) AS votes,
			COALESCE(pv_user.value, 0) AS user_vote
		FROM 
			posts p
		INNER JOIN 
			communities c ON c.id = p.community_id
		INNER JOIN 
			users u ON u.id = p.user_id
		INNER JOIN
			user_communities uc ON uc.community_id = p.community_id AND uc.user_id = $1
		LEFT JOIN
			comments cm ON cm.post_id = p.id
		LEFT JOIN 
			(SELECT post_id, SUM(value) AS total_votes 
			 FROM post_votes
			 GROUP BY post_id) AS vote_totals ON vote_totals.post_id = p.id
		LEFT JOIN 
			post_votes pv_user ON pv_user.post_id = p.id AND pv_user.user_id = $1
		WHERE 
			(p.title ILIKE '%' || $2 || '%' OR p.content ILIKE '%' || $2 || '%')
		GROUP BY p.id, c.id, u.id, pv_user.value, vote_totals.total_votes
		ORDER BY p.created_at ` + q.Sort + `
		LIMIT $3 OFFSET $4
	`

	return s.fetchPosts(ctx, query, userID, q.Search, q.Limit, q.Offset)
}

func (s *PostStore) Vote(ctx context.Context, value int, postID, userID int64) error {
	query := `
		INSERT INTO post_votes (post_id, user_id, value) 
		VALUES ($1, $2, $3)
		ON CONFLICT (post_id, user_id)
		DO UPDATE SET value = EXCLUDED.value
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	_, err := s.db.ExecContext(ctx, query, postID, userID, value)
	if err != nil {
		return err
	}

	return nil
}

func (s *PostStore) fetchPosts(ctx context.Context, query string, args ...interface{}) ([]Post, error) {
	posts := []Post{}

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	rows, err := s.db.QueryContext(
		ctx,
		query,
		args...,
	)
	if err != nil {
		return posts, err
	}
	defer rows.Close()

	for rows.Next() {
		var post Post

		post.User = &User{}
		post.Community = &Community{}
		post.Comments = []Comment{}

		if err := rows.Scan(
			&post.ID,
			&post.Title,
			pq.Array(&post.Tags),
			&post.Slug,
			&post.UserID,
			&post.CommunityID,
			&post.CreatedAt,
			&post.Community.ID,
			&post.Community.Name,
			&post.Community.Slug,
			&post.Community.UserID,
			&post.User.ID,
			&post.User.Name,
			&post.User.Username,
			&post.NumComments,
			&post.Votes,
			&post.UserVote,
		); err != nil {
			return posts, err
		}

		posts = append(posts, post)
	}

	if err := rows.Err(); err != nil {
		return posts, err
	}

	return posts, nil
}
