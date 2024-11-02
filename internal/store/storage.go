package store

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

var (
	QueryTimeoutDuration = time.Second * 5
	ErrNotFound          = fmt.Errorf("resource not found")
)

type Storage struct {
	Communities interface {
		Create(context.Context, *CommunityDetails) error
		GetBySlug(context.Context, string, int64) (*CommunityDetails, error)
		Delete(context.Context, int64) error
		Update(context.Context, *CommunityDetails) error
		Join(context.Context, int64, int64) error
		Leave(context.Context, int64, int64) error
		GetAll(context.Context, int64, PaginatedCommunitiesQuery) ([]CommunitySummary, error)
		GetUserCommunities(context.Context, int64, PaginatedCommunitiesQuery) ([]CommunityOverview, error)
	}
	Posts interface {
		Create(context.Context, *PostDetails) error
		GetBySlug(context.Context, string, int64) (*PostDetails, error)
		Delete(context.Context, int64) error
		Update(context.Context, *PostDetails) error
		GetCommunityPosts(context.Context, int64, int64, PaginatedPostsQuery) ([]PostSummary, error)
		GetAll(context.Context, int64, PaginatedPostsQuery) ([]PostSummary, error)
		GetUserFeed(context.Context, int64, PaginatedPostsQuery) ([]PostSummary, error)
		Vote(context.Context, int, int64, int64) error
	}
	Comments interface {
		Create(context.Context, *Comment) error
		GetByID(context.Context, int64, int64) (*Comment, error)
		Update(context.Context, *Comment) error
		Delete(context.Context, int64) error
		GetByPostID(context.Context, int64, int64) ([]Comment, error)
		Vote(context.Context, int, int64, int64) error
	}
	Users interface {
		Create(context.Context, *sql.Tx, *UserDetails) error
		GetByUsername(context.Context, string) (*UserSummary, error)
		GetByID(context.Context, int64) (*UserDetails, error)
		GetByEmail(context.Context, string) (*UserDetails, error)
		Delete(context.Context, int64) error
		Update(context.Context, *UserDetails) error
		CreateAndInvite(context.Context, *UserDetails, string, time.Duration) error
		Activate(context.Context, string) error
		CreatePasswordReset(context.Context, string, time.Duration, int64) error
		ResetPassword(context.Context, string, []byte) error
	}
	Roles interface {
		GetGlobalByName(context.Context, string) (*Role, error)
	}
	Common interface {
		GenerateUniqueSlug(context.Context, string, string) (string, error)
	}
}

func NewStorage(db *sql.DB) Storage {
	return Storage{
		Communities: &CommunityStore{
			db: db,
		},
		Posts: &PostStore{
			db: db,
		},
		Comments: &CommentStore{
			db: db,
		},
		Users: &UserStore{
			db: db,
		},
		Roles: &RoleStore{
			db: db,
		},
		Common: &CommonStore{
			db: db,
		},
	}
}

func withTx(ctx context.Context, db *sql.DB, fn func(tx *sql.Tx) error) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	if err := fn(tx); err != nil {
		_ = tx.Rollback()
		return err
	}

	return tx.Commit()
}
