package store

import (
	"context"
	"database/sql"
)

type RoleStore struct {
	db *sql.DB
}

type Role struct {
	ID    int64  `json:"id"`
	Name  string `json:"name"`
	Level string `json:"level"`
}

func (s *RoleStore) GetByName(ctx context.Context, name string) (*Role, error) {
	query := `SELECT id, name, level FROM roles WHERE name = $1`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	role := &Role{}
	err := s.db.QueryRowContext(ctx, query, name).Scan(&role.ID, &role.Name, &role.Level)
	if err != nil {
		return nil, err
	}

	return role, nil
}

func (s *RoleStore) GetCommunityRole(ctx context.Context, userID, communityID int64) (*Role, error) {
	query := `
		SELECT r.id, r.name, r.level 
		FROM roles r
		INNER JOIN user_communities uc ON uc.role_id = r.id
		WHERE uc.user_id = $1 AND uc.community_id = $2
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	role := &Role{}
	err := s.db.QueryRowContext(ctx, query, userID, communityID).Scan(&role.ID, &role.Name, &role.Level)
	if err != nil {
		return nil, err
	}

	return role, nil
}
