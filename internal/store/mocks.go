package store

import (
	"context"
	"database/sql"
	"time"
)

func NewMockStore() Storage {
	return Storage{
		Users: &MockUserStore{},
	}
}

type MockUserStore struct {
}

func (m *MockUserStore) Create(ctx context.Context, tx *sql.Tx, ud *UserDetails) error {
	return nil
}

func (m *MockUserStore) GetByUsername(ctx context.Context, username string) (*UserSummary, error) {
	if username == "test" {
		return &UserSummary{}, nil
	}
	return nil, ErrNotFound
}

func (m *MockUserStore) GetByID(ctx context.Context, id int64) (*UserDetails, error) {
	return &UserDetails{}, nil
}

func (m *MockUserStore) GetByEmail(ctx context.Context, email string) (*UserDetails, error) {
	return &UserDetails{}, nil
}

func (m *MockUserStore) Delete(ctx context.Context, id int64) error {
	return nil
}

func (m *MockUserStore) Update(ctx context.Context, ud *UserDetails) error {
	return nil
}

func (m *MockUserStore) CreateAndInvite(ctx context.Context, ud *UserDetails, token string, exp time.Duration) error {
	return nil
}

func (m *MockUserStore) Activate(ctx context.Context, token string) error {
	return nil
}

func (m *MockUserStore) CreatePasswordReset(ctx context.Context, email string, exp time.Duration, id int64) error {
	return nil
}

func (m *MockUserStore) ResetPassword(ctx context.Context, token string, password []byte) error {
	return nil
}
