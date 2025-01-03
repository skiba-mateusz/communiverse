package store

import (
	"context"
	"database/sql"
)

type BaseCommunity struct {
	ID           int64  `json:"id"`
	Name         string `json:"name"`
	Slug         string `json:"slug"`
	ThumbnailID  string `json:"thumbgnailID"`
	ThumbnailURL string `json:"thumbnailURL"`
}

type CommunityOverview struct {
	BaseCommunity
}

type CommunitySummary struct {
	BaseCommunity
	Description  string `json:"description"`
	Role         Role   `json:"role"`
	NumMembers   int    `json:"numMembers"`
	CreatedAt    string `json:"createdAt"`
}

type CommunityDetails struct {
	BaseCommunity
	Description  string      `json:"description"`
	UserID       int64       `json:"creatorID"`
	User         UserSummary `json:"creator"`
	Role         Role        `json:"role"`
	CreatedAt    string      `json:"createdAt"`
	NumMembers   int         `json:"numMembers"`
	NumPosts     int         `json:"numPosts"`
}

type CommunityStore struct {
	db *sql.DB
}

func (s *CommunityStore) Create(ctx context.Context, community *CommunityDetails) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		if err := s.create(ctx, tx, community); err != nil {
			return err
		}

		if err := s.join(ctx, tx, community.ID, community.UserID, community.Role.Name); err != nil {
			return err
		}

		return nil
	})
}

func (s *CommunityStore) GetBySlug(ctx context.Context, slug string, userID int64) (*CommunityDetails, error) {
	query := `
		SELECT 
			c.id, c.name, c.description, c.slug, thumbnail_id, c.user_id, c.created_at,
			u.id, u.name, u.username, u.bio, u.avatar_id, u.created_at,
			COALESCE(r.id, -1),
			COALESCE(r.name, 'Visitor'), 
			COALESCE(r.level, 0),
			COALESCE(COUNT(DISTINCT uc.user_id), 0) AS num_members,
			COALESCE(COUNT(DISTINCT p.id), 0) AS num_posts
		FROM 
			communities c
		INNER JOIN 
			users u ON u.id = c.user_id
		LEFT JOIN
			user_communities uc_user ON uc_user.community_id = c.id AND uc_user.user_id = $1
		LEFT JOIN 
			roles r ON r.id = uc_user.role_id
		LEFT JOIN 
			user_communities uc ON uc.community_id = c.id
		LEFT JOIN 
			posts p ON p.community_id = c.id
		WHERE 
			c.slug = $2
		GROUP BY 
		    c.id, c.name, c.description, c.slug, c.user_id, c.created_at, 
		    u.id, u.name, u.username, u.bio, u.created_at,
		    r.id, r.name, r.level
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var community CommunityDetails

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
		&community.ThumbnailID,
		&community.UserID,
		&community.CreatedAt,
		&community.User.ID,
		&community.User.Name,
		&community.User.Username,
		&community.User.Bio,
		&community.User.AvatarID,
		&community.User.CreatedAt,
		&community.Role.ID,
		&community.Role.Name,
		&community.Role.Level,
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

func (s *CommunityStore) Update(ctx context.Context, community *CommunityDetails) error {
	query := `
		UPDATE communities
		SET name = $1, description = $2, slug = $3, thumbnail_id = $4
		WHERE id = $5
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	res, err := s.db.ExecContext(
		ctx,
		query,
		community.Name,
		community.Description,
		community.Slug,
		community.ThumbnailID,
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

func (s *CommunityStore) Join(ctx context.Context, communityID, userID int64, roleName string) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		if err := s.join(ctx, tx, communityID, userID, roleName); err != nil {
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

func (s *CommunityStore) GetAll(ctx context.Context, userID int64, q PaginatedCommunitiesQuery) ([]CommunitySummary, error) {
	query := `
		SELECT 
			c.id, c.name, c.description, c.slug, c.thumbnail_id, c.created_at,
			COALESCE(r.id, -1),
			COALESCE(r.name, 'Visitor'), 
			COALESCE(r.level, 0),
			COALESCE(COUNT(DISTINCT uc.user_id), 0) AS num_members
		FROM
			communities c
		LEFT JOIN 
			user_communities uc_user ON uc_user.community_id = c.id AND uc_user.user_id = $1
		LEFT JOIN 
			roles r ON r.id = uc_user.role_id
		LEFT JOIN 
			user_communities uc ON uc.community_id = c.id
		LEFT JOIN 
			posts p ON p.community_id = c.id
		WHERE 
			c.name ILIKE '%' || $2 || '%' OR c.description ILIKE '%' || $2 || '%'
		GROUP BY 
		    c.id, c.name, c.description, c.slug, c.user_id, c.created_at,
		    r.id, r.name, r.level
		ORDER BY 
		    num_members DESC
		LIMIT $3 OFFSET $4
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	communities := []CommunitySummary{}

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
		var community CommunitySummary

		if err := rows.Scan(
			&community.ID,
			&community.Name,
			&community.Description,
			&community.Slug,
			&community.ThumbnailID,
			&community.CreatedAt,
			&community.Role.ID,
			&community.Role.Name,
			&community.Role.Level,
			&community.NumMembers,
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

func (s *CommunityStore) GetUserCommunities(ctx context.Context, userID int64, q PaginatedCommunitiesQuery) ([]CommunityOverview, error) {
	query := `
		SELECT 
			c.id, c.name, c.slug, c.thumbnail_id
		FROM
			communities c
		LEFT JOIN 
			user_communities uc ON uc.community_id = c.id AND uc.user_id = $1
		WHERE 
		    uc.user_id IS NOT NULL
		ORDER BY 
		    c.name DESC
		LIMIT $2 OFFSET $3
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	communities := []CommunityOverview{}

	rows, err := s.db.QueryContext(
		ctx,
		query,
		userID,
		q.Limit,
		q.Offset,
	)
	if err != nil {
		return communities, err
	}
	defer rows.Close()

	for rows.Next() {
		var community CommunityOverview

		if err = rows.Scan(
			&community.ID,
			&community.Name,
			&community.Slug,
			&community.ThumbnailID,
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

func (s *CommunityStore) create(ctx context.Context, tx *sql.Tx, community *CommunityDetails) error {
	query := `
	INSERT INTO communities (name, description, slug, thumbnail_id, user_id)
	VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at
`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := tx.QueryRowContext(
		ctx,
		query,
		community.Name,
		community.Description,
		community.Slug,
		community.ThumbnailID,
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

func (s *CommunityStore) join(ctx context.Context, tx *sql.Tx, communityID, userID int64, roleName string) error {
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
		INSERT INTO user_communities (user_id, community_id, role_id) 
		VALUES ($1, $2, (SELECT id FROM roles WHERE name = $3))
	`

	_, err = tx.ExecContext(
		ctx,
		joinQuery,
		userID,
		communityID,
		roleName,
	)
	if err != nil {
		return err
	}

	return nil
}
