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
	NumMembers  int    `json:"numMembers"`
	NumPosts    int    `json:"numPosts"`
	CreatedAt   string `json:"createdAt"`
}

type CommunityWithMembership struct {
	Community
	IsMember bool `json:"isMember"`
}

type CommunityStore struct {
	db *sql.DB
}

func (s *CommunityStore) Create(ctx context.Context, community *Community) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		if err := s.create(ctx, tx, community); err != nil {
			return err
		}

		if err := s.join(ctx, tx, community.ID, community.UserID); err != nil {
			return err
		}

		return nil
	})
}

func (s *CommunityStore) GetBySlug(ctx context.Context, slug string, userID int64) (*CommunityWithMembership, error) {
	query := `
		SELECT 
			c.id, c.name, c.description, c.slug, c.user_id, c.created_at,
			uc_user.user_id IS NOT NULL AS is_member,
			COALESCE(COUNT(DISTINCT uc.user_id), 0) AS num_members,
			COALESCE(COUNT(DISTINCT p.id), 0) AS num_posts
		FROM 
			communities c
		LEFT JOIN 
			user_communities uc_user ON uc_user.community_id = c.id AND uc_user.user_id = $1  
		LEFT JOIN 
			user_communities uc ON uc.community_id = c.id
		LEFT JOIN 
			posts p ON p.community_id = c.id
		WHERE 
			c.slug = $2
		GROUP BY 
		    c.id, c.name, c.description, c.slug, c.user_id, c.created_at, uc_user.user_id
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var community CommunityWithMembership

	err := s.db.QueryRowContext(
		ctx,
		query,
		userID,
		slug,
	).Scan(
		&community.ID,
		&community.Name,
		&community.Description,
		&community.Slug,
		&community.UserID,
		&community.CreatedAt,
		&community.IsMember,
		&community.NumMembers,
		&community.NumPosts,
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

func (s *CommunityStore) Delete(ctx context.Context, id int64) error {
	query := `DELETE FROM communities WHERE id = $1`

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

func (s *CommunityStore) Update(ctx context.Context, community *CommunityWithMembership) error {
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

func (s *CommunityStore) Join(ctx context.Context, communityID, userID int64) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		if err := s.join(ctx, tx, communityID, userID); err != nil {
			return err
		}

		return nil
	})
}

func (s *CommunityStore) Leave(ctx context.Context, communityID, userID int64) error {
	query := `DELETE FROM user_communities WHERE user_id = $1 AND community_id = $2`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	res, err := s.db.ExecContext(
		ctx,
		query,
		userID,
		communityID,
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

func (s *CommunityStore) GetCommunities(ctx context.Context, userID int64, q PaginatedCommunitiesQuery) ([]CommunityWithMembership, error) {
	query := `
		SELECT 
			c.id, c.name, c.description, c.slug, c.user_id, c.created_at,
			uc_user.user_id IS NOT NULL AS is_member,
			COALESCE(COUNT(DISTINCT uc.user_id), 0) AS num_members,
			COALESCE(COUNT(DISTINCT p.id), 0) AS num_posts
		FROM
			communities c
		LEFT JOIN 
			user_communities uc_user ON uc_user.community_id = c.id AND uc_user.user_id = $1  
		LEFT JOIN 
			user_communities uc ON uc.community_id = c.id
		LEFT JOIN 
			posts p ON p.community_id = c.id
		WHERE 
			c.name ILIKE '%' || $2 || '%' OR c.description ILIKE '%' || $2 || '%'
		GROUP BY 
		    c.id, c.name, c.description, c.slug, c.user_id, c.created_at, uc_user.user_id
		ORDER BY 
		    num_members DESC
		LIMIT $3 OFFSET $4
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	communities := []CommunityWithMembership{}

	rows, err := s.db.QueryContext(
		ctx,
		query,
		userID,
		q.Search,
		q.Limit,
		q.Offset,
	)
	if err != nil {
		return communities, err
	}
	defer rows.Close()

	for rows.Next() {
		var community CommunityWithMembership

		if err := rows.Scan(
			&community.ID,
			&community.Name,
			&community.Description,
			&community.Slug,
			&community.UserID,
			&community.CreatedAt,
			&community.IsMember,
			&community.NumMembers,
			&community.NumPosts,
		); err != nil {
			return communities, err
		}

		communities = append(communities, community)
	}

	if err = rows.Err(); err != nil {
		return communities, err
	}

	return communities, nil
}

func (s *CommunityStore) create(ctx context.Context, tx *sql.Tx, community *Community) error {
	query := `
	INSERT INTO communities (name, description, slug, user_id)
	VALUES ($1, $2, $3, $4) RETURNING id, created_at
`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := tx.QueryRowContext(
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

func (s *CommunityStore) join(ctx context.Context, tx *sql.Tx, communityID, userID int64) error {
	existsQuery := `
		SELECT EXISTS (
			SELECT 1 FROM user_communities WHERE user_id = $1 AND community_id = $2
		)	
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var exists bool

	err := tx.QueryRowContext(
		ctx,
		existsQuery,
		userID,
		communityID,
	).Scan(&exists)
	if err != nil {
		return err
	}

	if exists {
		return nil
	}

	joinQuery := `
		INSERT INTO user_communities (user_id, community_id) 
		VALUES ($1, $2)
	`

	_, err = tx.ExecContext(
		ctx,
		joinQuery,
		userID,
		communityID,
	)
	if err != nil {
		return err
	}

	return nil
}
