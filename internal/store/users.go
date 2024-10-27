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
	ErrDuplicateUsername = fmt.Errorf("user with that username already exists")
	ErrDuplicateEmail    = fmt.Errorf("user with that email already exists")
)

type UserOverview struct {
	ID       int64  `json:"id"`
	Name     string `json:"name"`
	Username string `json:"username"`
}

type UserSummary struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	Username  string `json:"username"`
	Bio       string `json:"bio"`
	AvatarID  string `json:"avatar_id"`
	CreatedAt string `json:"createdAt"`
}

type UserDetails struct {
	ID        int64    `json:"id"`
	Name      string   `json:"name"`
	Username  string   `json:"username"`
	Bio       string   `json:"bio"`
	Email     string   `json:"email"`
	AvatarID  string   `json:"avatar_id"`
	Password  Password `json:"-"`
	IsActive  bool     `json:"IsActive"`
	CreatedAt string   `json:"createdAt"`
}

type Password struct {
	Hash []byte
}

func (p *Password) Set(text string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(text), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	p.Hash = hash
	return nil
}

func (p *Password) Matches(text string) bool {
	return bcrypt.CompareHashAndPassword([]byte(p.Hash), []byte(text)) == nil
}

type UserStore struct {
	db *sql.DB
}

func (s *UserStore) Create(ctx context.Context, tx *sql.Tx, user *UserDetails) error {
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
			return ErrDuplicateEmail
		case err.Error() == `pq: duplicate key value violates unique constraint "users_username_key"`:
			return ErrDuplicateUsername
		default:
			return err
		}
	}

	return nil
}

func (s *UserStore) GetByUsername(ctx context.Context, username string) (*UserSummary, error) {
	query := `SELECT id, name, username, bio, avatar_id, created_at FROM users WHERE username = $1 AND is_active = true`

	user := &UserSummary{}
	if err := s.fetchUser(
		ctx,
		query,
		[]any{username},
		[]any{&user.ID, &user.Name, &user.Username, &user.Bio, &user.AvatarID, &user.CreatedAt},
	); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserStore) GetByID(ctx context.Context, id int64) (*UserDetails, error) {
	query := `SELECT id, name, username, email, bio, avatar_id, is_active, created_at FROM users WHERE id = $1 AND is_active = true`

	user := &UserDetails{}
	if err := s.fetchUser(
		ctx,
		query,
		[]any{id},
		[]any{&user.ID, &user.Name, &user.Username, &user.Email, &user.Bio, &user.AvatarID, &user.IsActive, &user.CreatedAt},
	); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserStore) GetByEmail(ctx context.Context, email string) (*UserDetails, error) {
	query := `SELECT id, name, username, password, email, is_active, created_at FROM users WHERE email = $1`

	user := &UserDetails{}
	if err := s.fetchUser(
		ctx,
		query,
		[]any{email},
		[]any{&user.ID, &user.Name, &user.Username, &user.Password.Hash, &user.Email, &user.IsActive, &user.CreatedAt},
	); err != nil {
		return nil, err
	}

	return user, nil
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

func (s *UserStore) Update(ctx context.Context, user *UserDetails) error {
	query := `UPDATE users SET name = $1, username = $2, bio = $3, avatar_id = $4 WHERE id = $5`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	_, err := s.db.ExecContext(ctx, query, user.Name, user.Username, user.Bio, user.AvatarID, user.ID)
	if err != nil {
		return err
	}

	return nil
}

func (s *UserStore) CreateAndInvite(ctx context.Context, user *UserDetails, token string, invitationExp time.Duration) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		if err := s.Create(ctx, tx, user); err != nil {
			return err
		}

		return s.createInvitation(ctx, tx, token, invitationExp, user.ID)
	})
}

func (s *UserStore) Activate(ctx context.Context, token string) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		user, err := s.getUserFromInvitation(ctx, tx, token)
		if err != nil {
			return err
		}

		if err := s.updateActivationStatus(ctx, tx, true, user.ID); err != nil {
			return err
		}

		return s.deleteUserInvitation(ctx, tx, user.ID)
	})
}

func (s *UserStore) CreatePasswordReset(ctx context.Context, token string, exp time.Duration, userID int64) error {
	query := `INSERT INTO password_resets (token, user_id, expiry) VALUES($1, $2, $3)`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	_, err := s.db.ExecContext(ctx, query, token, userID, time.Now().Add(exp))
	if err != nil {
		return err
	}

	return nil
}

func (s *UserStore) ResetPassword(ctx context.Context, token string, password []byte) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		user, err := s.getUserFromPasswordReset(ctx, token, tx)
		if err != nil {
			return err
		}

		if err = s.updatePassword(ctx, password, user.ID, tx); err != nil {
			return err
		}

		return s.deletePasswordReset(ctx, tx, user.ID)
	})
}

func (s *UserStore) getUserFromPasswordReset(ctx context.Context, token string, tx *sql.Tx) (*UserDetails, error) {
	query := `
		SELECT u.id, u.name, u.username, email
		FROM users u
		INNER JOIN password_resets pr ON pr.user_id = u.id
		WHERE pr.token = $1 AND expiry > $2
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	hash := sha256.Sum256([]byte(token))
	hashToken := hex.EncodeToString(hash[:])

	user := &UserDetails{}
	err := tx.QueryRowContext(ctx, query, hashToken, time.Now()).Scan(&user.ID, &user.Name, &user.Username, &user.Email)
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

func (s *UserStore) updatePassword(ctx context.Context, password []byte, userID int64, tx *sql.Tx) error {
	query := `UPDATE users SET password = $1 WHERE id = $2`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	_, err := tx.ExecContext(ctx, query, password, userID)
	if err != nil {
		return err
	}

	return nil
}

func (s *UserStore) deletePasswordReset(ctx context.Context, tx *sql.Tx, userID int64) error {
	query := `DELETE FROM password_resets WHERE user_id = $1`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	_, err := tx.ExecContext(ctx, query, userID)
	if err != nil {
		return err
	}

	return nil
}

func (s *UserStore) fetchUser(ctx context.Context, query string, args []any, destArgs []any) error {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	if err := s.db.QueryRowContext(ctx, query, args...).Scan(destArgs...); err != nil {
		switch err {
		case sql.ErrNoRows:
			return ErrNotFound
		default:
			return err
		}
	}

	return nil
}

func (s *UserStore) updateActivationStatus(ctx context.Context, tx *sql.Tx, status bool, userID int64) error {
	query := `UPDATE users SET is_active = $1 WHERE id = $2`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	_, err := tx.ExecContext(ctx, query, status, userID)
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

func (s *UserStore) getUserFromInvitation(ctx context.Context, tx *sql.Tx, token string) (*UserDetails, error) {
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

	user := &UserDetails{}
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

func (s *UserStore) createInvitation(ctx context.Context, tx *sql.Tx, token string, exp time.Duration, userID int64) error {
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
