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
		GetBySlug(context.Context, string) (*Community, error)
		Delete(context.Context, string) error
		Update(context.Context, *Community) error
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
		Common: &CommonStore{
			db: db,
		},
	}
}
