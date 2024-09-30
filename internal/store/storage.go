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
		Create(context.Context, *Community) error
		GetBySlug(context.Context, string, int64) (*Community, error)
		Delete(context.Context, string) error
		Update(context.Context, *Community) error
		Join(context.Context, int64, int64) error
		Leave(context.Context, int64, int64) error
	}
	Posts interface {
		Create(context.Context, *Post) error
		GetBySlug(context.Context, string) (*Post, error)
		Delete(context.Context, string) error
		Update(context.Context, *Post) error
	}
	Comments interface {
		Create(context.Context, *Comment) error
		GetByPostID(context.Context, int64) ([]Comment, error)
	}
	Users interface {
		Create(context.Context, *User) error
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
