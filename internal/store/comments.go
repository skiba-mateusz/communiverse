package store

import (
	"context"
	"database/sql"
)

type Comment struct {
	ID        int64  `json:"id"`
	Content   string `json:"content"`
	PostID    int64  `json:"postID"`
	Post      *Post  `json:"post,omitempty"`
	UserID    int64  `json:"userID"`
	User      *User  `json:"user,omitempty"`
	NumVotes  int    `json:"numVotes"`
	UserVote  int    `json:"userVote"`
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

func (s *CommentStore) GetByPostID(ctx context.Context, postID, userID int64) ([]Comment, error) {
	query := `
		SELECT 
			c.id, c.content, c.user_id, c.post_id, c.created_at, 
			u.id, u.name, u.username,
			COALESCE(SUM(DISTINCT cv.value), 0) AS num_votes,
			COALESCE(cv_user.value, 0) AS user_vote
		FROM comments c
		INNER JOIN users u ON c.user_id = u.id
		LEFT JOIN comment_votes cv ON cv.comment_id = c.id
		LEFT JOIN comment_votes cv_user ON cv_user.comment_id = c.id AND cv_user.user_id = $1
		WHERE c.post_id = $2
		GROUP BY c.id, u.id, cv_user.value
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	comments := []Comment{}

	rows, err := s.db.QueryContext(
		ctx,
		query,
		userID,
		postID,
	)
	if err != nil {
		return comments, err
	}
	defer rows.Close()

	for rows.Next() {
		var comment Comment
		comment.User = &User{}

		if err := rows.Scan(
			&comment.ID,
			&comment.Content,
			&comment.UserID,
			&comment.PostID,
			&comment.CreatedAt,
			&comment.User.ID,
			&comment.User.Name,
			&comment.User.Username,
			&comment.NumVotes,
			&comment.UserVote,
		); err != nil {
			return comments, err
		}

		comments = append(comments, comment)
	}

	if err := rows.Err(); err != nil {
		return comments, err
	}

	return comments, nil
}

func (s *CommentStore) Vote(ctx context.Context, value int, commentID, userID int64) error {
	query := `
		INSERT INTO comment_votes (comment_id, user_id, value) 
		VALUES ($1, $2, $3)
		ON CONFLICT (comment_id, user_id) DO UPDATE	
		SET value = EXCLUDED.value
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	_, err := s.db.ExecContext(ctx, query, commentID, userID, value)
	if err != nil {
		return err
	}

	return nil
}
