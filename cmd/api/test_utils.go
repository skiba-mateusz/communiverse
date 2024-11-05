package main

import (
	"github.com/skiba-mateusz/communiverse/internal/auth"
	"github.com/skiba-mateusz/communiverse/internal/store"
	"go.uber.org/zap"
	"net/http"
	"net/http/httptest"
	"testing"
)

func newTestApplication(t *testing.T) *application {
	t.Helper()

	logger := zap.NewNop().Sugar()
	mockStore := store.NewMockStore()
	testAuthenticator := &auth.TestAuthenticator{}

	return &application{
		logger:        logger,
		store:         mockStore,
		authenticator: testAuthenticator,
	}
}

func executeRequest(mux http.Handler, req *http.Request) *httptest.ResponseRecorder {
	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	return rr
}

func checResponseCode(t *testing.T, expected, actual int) {
	t.Helper()

	if expected != actual {
		t.Errorf("expected status %d, got %d", expected, actual)
	}
}
