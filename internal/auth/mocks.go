package auth

import (
	"github.com/golang-jwt/jwt/v5"
	"time"
)

type TestAuthenticator struct{}

var (
	secret     = "test"
	testClaims = jwt.MapClaims{
		"aud": "test-aud",
		"iss": "test-aud",
		"sub": int64(42),
		"exp": time.Now().Add(time.Hour).Unix(),
	}
)

func (a *TestAuthenticator) GenerateToken(claims jwt.Claims) (string, error) {
	return jwt.NewWithClaims(jwt.SigningMethodHS256, testClaims).SignedString([]byte(secret))
}

func (a *TestAuthenticator) ValidateToken(token string) (*jwt.Token, error) {
	return jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
}
