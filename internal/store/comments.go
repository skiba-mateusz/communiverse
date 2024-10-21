package store

import (
	"context"
	"database/sql"
)

type Comment struct {
	ID        int64        `json:"id"`
	Content   string       `json:"content"`
	PostID    int64        `json:"postID"`
	UserID    int64        `json:"authorID"`
	User      UserOverview `json:"author"`
	CreatedAt string       `json:"createdAt"`
	NumVotes  int          `json:"numVotes"`
	UserVote  int          `json:"userVote"`
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
			COALESCE(SUM(cv.value), 0) AS num_votes,
			COALESCE(uv.value, 0) AS user_vote
		FROM comments c
		INNER JOIN users u ON c.user_id = u.id
		LEFT JOIN comment_votes cv ON cv.comment_id = c.id
		LEFT JOIN comment_votes uv ON uv.comment_id = c.id AND uv.user_id = $1
		WHERE c.post_id = $2
		GROUP BY 
			c.id, c.content, c.user_id, c.post_id, c.created_at, 
			u.id, u.name, u.username, u.bio, u.created_at,
			uv.value
		ORDER BY c.created_at DESC
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
		comment.User = UserOverview{}

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
