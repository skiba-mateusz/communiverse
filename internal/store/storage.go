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
	ErrConflict          = fmt.Errorf("resource already exists")
)

type Storage struct {
	Communities interface {
		Create(context.Context, *Community) error
		GetBySlug(context.Context, string, int64) (*CommunityWithMembership, error)
		Delete(context.Context, int64) error
		Update(context.Context, *CommunityWithMembership) error
		Join(context.Context, int64, int64) error
		Leave(context.Context, int64, int64) error
		GetCommunities(context.Context, int64, PaginatedCommunitiesQuery) ([]CommunityWithMembership, error)
	}
	Posts interface {
		Create(context.Context, *Post) error
		GetBySlug(context.Context, string, int64) (*Post, error)
		Delete(context.Context, int64) error
		Update(context.Context, *Post) error
		GetCommunityPosts(context.Context, int64, int64, PaginatedPostsQuery) ([]Post, error)
		GetPosts(context.Context, int64, PaginatedPostsQuery) ([]Post, error)
		GetUserFeed(context.Context, int64, PaginatedPostsQuery) ([]Post, error)
		Vote(context.Context, int, int64, int64) error
	}
	Comments interface {
		Create(context.Context, *Comment) error
		GetByPostID(context.Context, int64, int64) ([]Comment, error)
		Vote(context.Context, int, int64, int64) error
	}
	Users interface {
		Create(context.Context, *sql.Tx, *User) error
		GetByUsername(context.Context, string) (*User, error)
		GetByID(context.Context, int64) (*User, error)
		GetByEmail(context.Context, string) (*User, error)
		Delete(context.Context, int64) error
		Update(context.Context, *User) error
		CreateAndInvite(context.Context, *User, string, time.Duration) error
		CreateInvitation(context.Context, string, time.Duration, int64) error
		Activate(context.Context, string) error
		CreatePasswordReset(context.Context, string, time.Duration, int64) error
		ResetPassword(context.Context, string, []byte) error
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
