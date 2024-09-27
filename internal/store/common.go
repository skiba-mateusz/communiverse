package store

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/gosimple/slug"
)

type CommonStore struct {
	db *sql.DB
}

func (s *CommonStore) GenerateUniqueSlug(ctx context.Context, input, table string) (string, error) {
	baseSlug := slug.Make(input)
	slug := baseSlug
	suffix := 1

	for {
		ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)

		exists, err := func() (bool, error) {
			defer cancel()

			query := fmt.Sprintf("SELECT EXISTS(SELECT 1 FROM %s WHERE slug = $1)", table)
			var exists bool

			if err := s.db.QueryRowContext(ctx, query, slug).Scan(&exists); err != nil {
				return false, err
			}

			return exists, nil
		}()

		if err != nil {
			return "", err
		}

		if !exists {
			break
		}

		slug = fmt.Sprintf("%s-%d", baseSlug, suffix)
		suffix++
	}

	return slug, nil
}
