package store

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	"github.com/lib/pq"
)

type BasePost struct {
	ID          int64            `json:"id"`
	Title       string           `json:"title"`
	Content     string           `json:"content"`
	Slug        string           `json:"slug"`
	Tags        []string         `json:"tags"`
	CommunityID int64            `json:"communityID"`
	UserID      int64            `json:"authorID"`
	NumComments int              `json:"numComments"`
	Votes       int              `json:"votes"`
	UserVote    int              `json:"userVote"`
	CreatedAt   string           `json:"createdAt"`
}

type PostSummary struct {
	BasePost
	Community   CommunityOverview `json:"community"`
	User        UserOverview      `json:"author"`
}

type PostDetails struct {
	BasePost
	Community   CommunitySummary `json:"community"`
	User        UserSummary      `json:"author"`
}

type PostStore struct {
	db *sql.DB
}

func (s *PostStore) Create(ctx context.Context, post *PostDetails) error {
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

func (s *PostStore) GetBySlug(ctx context.Context, slug string, userID int64) (*PostDetails, error) {
	query := `
		SELECT 
			p.id, p.title, p.content, p.tags, p.slug, p.user_id, p.community_id, p.created_at,
			c.id, c.name, c.description, c.slug, c.thumbnail_id, c.created_at,
			COALESCE(r.id, -1),
			COALESCE(r.name, 'Visitor'), 
			COALESCE(r.level, 0),
			COALESCE(tm.num_members, 0) AS num_members,
			u.id, u.name, u.username, u.bio, u.avatar_id, u.created_at,
			COALESCE(COUNT(cm.id), 0) AS num_comments,
			COALESCE(tv.total_votes, 0) AS votes,
			COALESCE(uv.user_vote, 0) AS user_vote
		FROM 
		    posts p  
		INNER JOIN  
		    communities c ON c.id = p.community_id
		INNER JOIN 
		    users u ON u.id = p.user_id
		LEFT JOIN 
		    comments cm ON cm.post_id = p.id
		LEFT JOIN 
		    user_communities uc ON uc.community_id = c.id AND uc.user_id = $1
		LEFT JOIN 
		    roles r ON r.id = uc.role_id
		LEFT JOIN 
		    (SELECT community_id, count(user_id) AS num_members FROM user_communities GROUP BY community_id) tm ON tm.community_id = c.id
		LEFT JOIN 
		    (SELECT post_id, SUM(value) AS total_votes FROM post_votes GROUP BY post_id) tv ON tv.post_id = p.id
		LEFT JOIN
		    (SELECT post_id, value AS user_vote FROM post_votes WHERE user_id = $1) uv ON uv.post_id = p.id
		WHERE p.slug = $2
		GROUP BY 
		    p.id, p.title, p.content, p.tags, p.slug, p.user_id, p.community_id, p.created_at,
			c.id, c.name, c.slug, c.user_id, c.created_at,
			u.id, u.name, u.username, u.bio, u.created_at,
			r.id, r.name, r.level,
			tm.num_members, tv.total_votes, uv.user_vote
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	post := PostDetails{}

	err := s.db.QueryRowContext(ctx, query, userID, slug).Scan(
		&post.ID,
		&post.Title,
		&post.Content,
		pq.Array(&post.Tags),
		&post.Slug,
		&post.UserID,
		&post.CommunityID,
		&post.CreatedAt,
		&post.Community.ID,
		&post.Community.Name,
		&post.Community.Description,
		&post.Community.Slug,
		&post.Community.ThumbnailID,
		&post.Community.CreatedAt,
		&post.Community.Role.ID,
		&post.Community.Role.Name,
		&post.Community.Role.Level,
		&post.Community.NumMembers,
		&post.User.ID,
		&post.User.Name,
		&post.User.Username,
		&post.User.Bio,
		&post.User.AvatarID,
		&post.User.CreatedAt,
		&post.NumComments,
		&post.Votes,
		&post.UserVote,
	)
	if err != nil {
		return nil, err
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

func (s *PostStore) Update(ctx context.Context, post *PostDetails) error {
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

func (s *PostStore) GetCommunityPosts(ctx context.Context, communityID, userID int64, q PaginatedPostsQuery) ([]PostSummary, Meta, error) {
	return s.fetchPosts(ctx, userID, &communityID, q, false)
}

func (s *PostStore) GetAll(ctx context.Context, userID int64, q PaginatedPostsQuery) ([]PostSummary, Meta, error) {
	return s.fetchPosts(ctx, userID, nil, q, false)
}

func (s *PostStore) GetUserFeed(ctx context.Context, userID int64, q PaginatedPostsQuery) ([]PostSummary, Meta, error) {
	return s.fetchPosts(ctx, userID, nil, q, true)
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

func (s *PostStore) fetchPosts(ctx context.Context, userID int64, communityID *int64, q PaginatedPostsQuery, isFeed bool) ([]PostSummary, Meta, error) {
	var queryBuilder strings.Builder
	queryBuilder.WriteString(`
		SELECT 
			p.id, p.title, p.content, p.tags, p.slug, p.user_id, p.community_id, p.created_at,
			c.id, c.name, c.slug, c.thumbnail_id,
			u.id, u.name, u.username, u.avatar_id,
			COALESCE(COUNT(cm.id), 0) AS num_comments,
			COALESCE(tv.total_votes, 0) AS votes,
			COALESCE(uv.user_vote, 0) AS user_vote,
			COUNT(*) OVER() AS total
		FROM 
			posts p
		INNER JOIN 
			communities c ON c.id = p.community_id
		INNER JOIN 
			users u ON u.id = p.user_id
		LEFT JOIN
			user_communities uc ON uc.community_id = c.id AND uc.user_id = $1
		LEFT JOIN
			comments cm ON cm.post_id = p.id
		LEFT JOIN 
		    (SELECT post_id, SUM(value) AS total_votes FROM post_votes GROUP BY post_id) tv ON tv.post_id = p.id
		LEFT JOIN
		    (SELECT post_id, value AS user_vote FROM post_votes WHERE user_id = $1) uv ON uv.post_id = p.id
		WHERE 
			(p.title ILIKE '%' || $2 || '%' OR p.content ILIKE '%' || $2 || '%')
	`)

	args := []any{userID, q.Search}

	timeMap := map[string]string{
		"today": "1 day",
		"week": "1 week",
		"month": "1 month",
		"year": "1 year",
	}
	if timeInterval, ok := timeMap[q.Time]; ok {
		queryBuilder.WriteString(`
			AND (p.created_at >= NOW() - INTERVAL '`+  timeInterval +`')
		`)
	}

	if communityID != nil {
		queryBuilder.WriteString(`
			AND c.id = $3
		`)
		args = append(args, *communityID)
	}

	if isFeed {
		queryBuilder.WriteString(`
			AND uc.user_id IS NOT NULL
		`)
	} 

	queryBuilder.WriteString(`
		GROUP BY 
	    	p.id, p.title, p.content, p.tags, p.slug, p.user_id, p.community_id, p.created_at,  
	    	c.id, c.name, c.slug, c.thumbnail_id, 
	    	u.id, u.name, u.username, u.avatar_id,
			tv.total_votes, uv.user_vote
	`)

	viewFields := map[string]string{
		"latest": "p.created_at",
		"top": "votes",
		"discussed": "num_comments",
	}
	if viewField, ok := viewFields[q.View]; ok {
		queryBuilder.WriteString(`
			ORDER BY ` + viewField + ` ` + q.Sort + ` 
		`)
	}

	queryBuilder.WriteString(`LIMIT $` + fmt.Sprint(len(args) + 1) + ` OFFSET $` + fmt.Sprint(len(args) + 2))
	args = append(args, q.Limit, q.Offset)

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	posts := []PostSummary{}
	var totalCount int

	rows, err := s.db.QueryContext(ctx, queryBuilder.String(), args...)
	if err != nil {
		return posts, Meta{}, err
	}

	for rows.Next() {
		post := PostSummary{}

		if err = rows.Scan(
			&post.ID,
			&post.Title,
			&post.Content,
			pq.Array(&post.Tags),
			&post.Slug,
			&post.UserID,
			&post.CommunityID,
			&post.CreatedAt,
			&post.Community.ID,
			&post.Community.Name,
			&post.Community.Slug,
			&post.Community.ThumbnailID,
			&post.User.ID,
			&post.User.Name,
			&post.User.Username,
			&post.User.AvatarID,
			&post.NumComments,
			&post.Votes,
			&post.UserVote,
			&totalCount,
		); err != nil {
			return posts, Meta{}, err
		}

		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		return posts, Meta{}, err
	}

	meta := Meta{
		TotalCount: totalCount,
		TotalPages: (totalCount + q.Limit - 1) / q.Limit,
		CurrentPage: q.Offset / q.Limit + 1,
		Offset: q.Offset,
		Limit: q.Limit,
	}

	return posts, meta, nil
}
