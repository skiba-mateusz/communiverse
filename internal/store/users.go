package store

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
	"time"

	"golang.org/x/crypto/bcrypt"
)

var (
	ErrDuplicateUsername = fmt.Errorf("user with that email already exists")
	ErrDuplicateEmail    = fmt.Errorf("user with that username already exists")
)

type User struct {
	ID        int64    `json:"id"`
	Name      string   `json:"name"`
	Username  string   `json:"username"`
	Email     string   `json:"email,omitempty"`
	Password  Password `json:"-"`
	Bio       string   `json:"bio,omitempty"`
	IsActive  bool     `json:"-"`
	CreatedAt string   `json:"createdAt,omitempty"`
}

type UserWithToken struct {
	*User
	Token string `json:"token"`
}

type Password struct {
	Text string
	Hash []byte
}

func (p *Password) Set(text string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(text), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	p.Text = text
	p.Hash = hash

	return nil
}

type UserStore struct {
	db *sql.DB
}

func (s *UserStore) Create(ctx context.Context, tx *sql.Tx, user *User) error {
	query := `
		INSERT INTO 
			users (name, username, email, password) 
		VALUES 
			($1, $2, $3, $4)
		RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := tx.QueryRowContext(
		ctx,
		query,
		user.Name,
		user.Username,
		user.Email,
		user.Password.Hash,
	).Scan(
		&user.ID,
		&user.CreatedAt,
	)
	if err != nil {
		switch {
		case err.Error() == `pq: duplicate key value violates unique constraint "users_email_key"`:
			return ErrDuplicateUsername
		case err.Error() == `pq: duplicate key value violates unique constraint "users_username_key"`:
			return ErrDuplicateUsername
		default:
			return err
		}
	}

	return nil
}

func (s *UserStore) GetByUsername(ctx context.Context, username string) (*User, error) {
	query := `SELECT id, name, username, email, bio, is_active, created_at FROM users WHERE username = $1 AND is_active = true`

	return s.fetchUser(ctx, query, username)
}

func (s *UserStore) GetByID(ctx context.Context, id int64) (*User, error) {
	query := `SELECT id, name, username, email, bio, is_active, created_at FROM users WHERE id = $1`

	return s.fetchUser(ctx, query, id)
}

func (s *UserStore) Delete(ctx context.Context, id int64) error {
	query := `DELETE FROM users WHERE id = $1`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	res, err := s.db.ExecContext(ctx, query, id)
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

func (s *UserStore) Update(ctx context.Context, user *User) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		return s.update(ctx, tx, user)
	})
}

func (s *UserStore) CreateAndInvite(ctx context.Context, user *User, token string, invitationExp time.Duration) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		if err := s.Create(ctx, tx, user); err != nil {
			return err
		}

		return s.createUserInvitation(ctx, tx, token, invitationExp, user.ID)
	})
}

func (s *UserStore) Activate(ctx context.Context, token string) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		user, err := s.getUserFromInvitation(ctx, tx, token)
		if err != nil {
			return err
		}

		user.IsActive = true
		if err := s.update(ctx, tx, user); err != nil {
			return err
		}

		return s.deleteUserInvitation(ctx, tx, user.ID)
	})
}

func (s *UserStore) fetchUser(ctx context.Context, query string, args ...interface{}) (*User, error) {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	user := &User{}

	if err := s.db.QueryRowContext(ctx, query, args...).Scan(
		&user.ID,
		&user.Name,
		&user.Username,
		&user.Email,
		&user.Bio,
		&user.IsActive,
		&user.CreatedAt,
	); err != nil {
		switch err {
		case sql.ErrNoRows:
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	return user, nil
}

func (s *UserStore) update(ctx context.Context, tx *sql.Tx, user *User) error {
	query := `UPDATE users SET name = $1, username = $2, email = $3, bio = $4, is_active = $5 WHERE id = $6`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	_, err := tx.ExecContext(ctx, query, user.Name, user.Username, user.Email, user.Bio, user.IsActive, user.ID)
	if err != nil {
		return err
	}

	return nil
}

func (s *UserStore) deleteUserInvitation(ctx context.Context, tx *sql.Tx, userID int64) error {
	query := `DELETE FROM user_invitations WHERE user_id = $1`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	_, err := tx.ExecContext(ctx, query, userID)
	if err != nil {
		return err
	}

	return nil
}

func (s *UserStore) getUserFromInvitation(ctx context.Context, tx *sql.Tx, token string) (*User, error) {
	query := `
		SELECT u.id, u.name, u.username, u.email, u.is_active, u.created_at
		FROM users u
		INNER JOIN user_invitations ui ON ui.user_id = u.id
		WHERE token = $1 AND ui.expiry > $2
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	hash := sha256.Sum256([]byte(token))
	hashToken := hex.EncodeToString(hash[:])

	user := &User{}
	err := tx.QueryRowContext(ctx, query, hashToken, time.Now()).Scan(
		&user.ID,
		&user.Name,
		&user.Username,
		&user.Email,
		&user.IsActive,
		&user.CreatedAt,
	)
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	return user, nil
}

func (s *UserStore) createUserInvitation(ctx context.Context, tx *sql.Tx, token string, exp time.Duration, userID int64) error {
	query := `INSERT INTO user_invitations (token, user_id, expiry) VALUES($1, $2, $3)`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	_, err := tx.ExecContext(
		ctx,
		query,
		token,
		userID,
		time.Now().Add(exp),
	)
	if err != nil {
		return err
	}

	return nil
}
