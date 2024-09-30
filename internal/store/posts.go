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
	CommunityID int64      `json:"communityID"`
	Community   *Community `josn:"community,omitempty"`
	UserID      int64      `json:"userID"`
	User        *User      `json:"user,omitempty"`
	CreatedAt   string     `json:"createdAt"`
}

type PostWithMetadata struct {
	Post
	CommentsCount int `json:"commentsCount"`
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

func (s *PostStore) GetBySlug(ctx context.Context, slug string) (*Post, error) {
	query := `
		SELECT 
			p.id, p.title, p.content, p.slug, p.tags, p.user_id, p.community_id, p.created_at,
			u.id, u.username
		FROM posts p 
		INNER JOIN users u ON u.id = p.user_id
		WHERE p.slug = $1
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var post Post
	post.User = &User{}

	err := s.db.QueryRowContext(
		ctx,
		query,
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
		&post.User.Username,
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

func (s *PostStore) Delete(ctx context.Context, slug string) error {
	query := `DELETE FROM posts WHERE slug = $1`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	res, err := s.db.ExecContext(
		ctx,
		query,
		slug,
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

func (s *PostStore) GetCommunityPosts(ctx context.Context, communityID int64, q PaginatedCommunityPostsQuery) ([]PostWithMetadata, error) {
	query := `
		SELECT
			p.id, p.title, p.content, p.tags, p.slug, p.user_id, p.community_id, p.created_at,
			u.id, u.username,
			COUNT(cm.id) AS comments_count
		FROM 
			posts p
		INNER JOIN 
			communities c ON c.id = p.community_id
		INNER JOIN
			users u ON u.id = p.user_id
		LEFT JOIN
			comments cm ON cm.post_id = p.id
		WHERE
			c.id = $1 AND
			(p.title ILIKE '%' || $2 || '%' OR p.content ILIKE '%' || $2 || '%')
		GROUP BY p.id, u.id
		ORDER BY p.created_at ` + q.Sort + `
		LIMIT $3 OFFSET $4
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	posts := []PostWithMetadata{}
	rows, err := s.db.QueryContext(
		ctx,
		query,
		communityID,
		q.Search,
		q.Limit,
		q.Offset,
	)
	if err != nil {
		return posts, err
	}
	defer rows.Close()

	for rows.Next() {
		var post PostWithMetadata
		post.User = &User{}

		if err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.Content,
			pq.Array(&post.Tags),
			&post.Slug,
			&post.UserID,
			&post.CommunityID,
			&post.CreatedAt,
			&post.User.ID,
			&post.User.Username,
			&post.CommentsCount,
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
