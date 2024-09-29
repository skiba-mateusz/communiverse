package store

import (
	"context"
	"database/sql"
)

type Comment struct {
	ID        int64  `json:"id"`
	Content   string `json:"content"`
	PostID    int64  `josn:"postID"`
	Post      Post   `json:"post"`
	UserID    int64  `json:"userID"`
	User      User   `json:"user"`
	CreatedAt string `json:"createdAt"`
}

type CommentStore struct {
	db *sql.DB
}

func (s *CommentStore) Create(ctx context.Context, comment *Comment) error {
	query := `
		INSERT INTO comments (content, user_id, post_id) 
		VALUES ($1, $2, $3) RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := s.db.QueryRowContext(
		ctx,
		query,
		comment.Content,
		comment.UserID,
		comment.PostID,
	).Scan(
		&comment.ID,
		&comment.CreatedAt,
	)
	if err != nil {
		return err
	}

	return nil
}

func (s *CommentStore) GetByPostID(ctx context.Context, postID int64) ([]Comment, error) {
	query := `
		SELECT 
			c.id, c.content, c.user_id, c.post_id, c.created_at, 
			u.username
		FROM comments c
		INNER JOIN users u ON c.user_id = u.id
		WHERE c.post_id = $1 
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var comments []Comment

	rows, err := s.db.QueryContext(
		ctx,
		query,
		postID,
	)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var comment Comment

		if err := rows.Scan(
			&comment.ID,
			&comment.Content,
			&comment.UserID,
			&comment.PostID,
			&comment.CreatedAt,
			&comment.User.Username,
		); err != nil {
			return nil, err
		}

		comments = append(comments, comment)
	}

	return comments, nil
}
