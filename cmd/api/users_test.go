package main

import (
	"net/http"
	"testing"
)

func TestGetUser(t *testing.T) {
	app := newTestApplication(t)
	mux := app.mount()

	testToken, err := app.authenticator.GenerateToken(nil)
	if err != nil {
		t.Fatal(err)
	}

	t.Run("should not allow unauthenticated requests", func(t *testing.T) {
		req, err := http.NewRequest(http.MethodGet, "/v1/users/test", nil)
		if err != nil {
			t.Fatal(err)
		}

		rr := executeRequest(mux, req)

		checResponseCode(t, http.StatusUnauthorized, rr.Code)
	})

	t.Run("should allow authenticated requests", func(t *testing.T) {
		req, err := http.NewRequest(http.MethodGet, "/v1/users/test", nil)
		if err != nil {
			t.Fatal(err)
		}

		req.Header.Set("Authorization", "Bearer "+testToken)

		rr := executeRequest(mux, req)

		checResponseCode(t, http.StatusOK, rr.Code)
	})

	t.Run("should return 404 for non-existing user", func(t *testing.T) {
		req, err := http.NewRequest(http.MethodGet, "/v1/users/non-existing", nil)
		if err != nil {
			t.Fatal(err)
		}

		req.Header.Set("Authorization", "Bearer "+testToken)

		rr := executeRequest(mux, req)

		checResponseCode(t, http.StatusNotFound, rr.Code)
	})
}
