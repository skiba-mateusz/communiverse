package store

import (
	"context"
	"database/sql"
)

type Community struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Slug        string `json:"slug"`
	UserID      int64  `json:"userID"`
	User        *User  `json:"user,omitempty"`
	CreatedAt   string `json:"createdAt"`
}

type CommunityStore struct {
	db *sql.DB
}

func (s *CommunityStore) Create(ctx context.Context, community *Community) error {
	query := `
		INSERT INTO communities (name, description, slug, user_id)
		VALUES ($1, $2, $3, $4) RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := s.db.QueryRowContext(
		ctx,
		query,
		community.Name,
		community.Description,
		community.Slug,
		community.UserID,
	).Scan(
		&community.ID,
		&community.CreatedAt,
	)
	if err != nil {
		return err
	}

	return nil
}

func (s *CommunityStore) GetBySlug(ctx context.Context, slug string) (*Community, error) {
	query := `
		SELECT id, name, description, slug, user_id, created_at
		FROM communities
		WHERE slug = $1
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var community Community

	err := s.db.QueryRowContext(
		ctx,
		query,
		slug,
	).Scan(
		&community.ID,
		&community.Name,
		&community.Description,
		&community.Slug,
		&community.UserID,
		&community.CreatedAt,
	)
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	return &community, nil
}

func (s *CommunityStore) Delete(ctx context.Context, slug string) error {
	query := `DELETE FROM communities WHERE slug = $1`

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

func (s *CommunityStore) Update(ctx context.Context, community *Community) error {
	query := `
		UPDATE communities
		SET name = $1, description = $2, slug = $3
		WHERE id = $4
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	res, err := s.db.ExecContext(
		ctx,
		query,
		community.Name,
		community.Description,
		community.Slug,
		community.ID,
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
