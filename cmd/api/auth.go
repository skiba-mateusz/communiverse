package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/skiba-mateusz/communiverse/internal/mailer"
	"github.com/skiba-mateusz/communiverse/internal/store"
)

type RegisterUserPayload struct {
	Name     string `json:"name" validate:"required,min=3,max=100"`
	Username string `json:"username" validate:"required,min=3,max=100"`
	Email    string `json:"email" validate:"required,email,max=100"`
	Password string `json:"password" validate:"required,min=6,max=100"`
}

func (app *application) registerUserHandler(w http.ResponseWriter, r *http.Request) {
	var payload RegisterUserPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := &store.UserDetails{
		BaseUser: store.BaseUser{
			Name:     payload.Name,
			Username: payload.Username,
		},
		Email:    payload.Email,
		Role: store.Role{
			Name: "user",
		},
	}

	if err := user.Password.Set(payload.Password); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	ctx := r.Context()
	plainToken, hashToken := generateTokenAndHash()

	if err := app.store.Users.CreateAndInvite(ctx, user, hashToken, app.config.mail.exp); err != nil {
		switch err {
		case store.ErrDuplicateEmail:
			app.badRequestResponse(w, r, err)
		case store.ErrDuplicateUsername:
			app.badRequestResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	activationURL := fmt.Sprintf("%s/auth/confirm/%s", app.config.frontendURL, plainToken)

	vars := struct {
		Username      string
		ActivationURL string
	}{
		Username:      user.Username,
		ActivationURL: activationURL,
	}

	isProd := app.config.env == "production"

	statusCode, err := app.mailer.Send(mailer.InviteUserTemplate, user.Username, user.Email, vars, !isProd)
	if err != nil {
		app.logger.Errorw("error sending invitation email", "error", err)

		if err := app.store.Users.Delete(ctx, user.ID); err != nil {
			app.logger.Errorw("error deleting user", "error", err)
		}

		app.internalServerError(w, r, err)
		return
	}

	app.logger.Infow("invitation email sent", "status code", statusCode)

	if err := jsonResponse(w, http.StatusCreated, user); err != nil {
		app.internalServerError(w, r, err)
	}
}

type LoginUserPayload struct {
	Email    string `json:"email" validate:"required,email,max=100"`
	Password string `json:"password" validate:"required,min=6,max=100"`
}

func (app *application) loginUserHandler(w http.ResponseWriter, r *http.Request) {
	var payload LoginUserPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	ctx := r.Context()

	user, err := app.store.Users.GetByEmail(ctx, payload.Email)
	if err != nil {
		switch err {
		case store.ErrNotFound:
			app.specificUnauthorizedResponse(w, r, fmt.Errorf("invalid email or password"))
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if !user.IsActive {
		app.specificUnauthorizedResponse(w, r, fmt.Errorf("account not activated, check your email address"))
		return
	}

	if !user.Password.Matches(payload.Password) {
		app.specificUnauthorizedResponse(w, r, fmt.Errorf("invalid email or password"))
		return
	}

	token, err := app.authenticator.GenerateToken(jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(app.config.auth.token.exp).Unix(),
		"iat": time.Now().Unix(),
		"nbf": time.Now().Unix(),
		"iss": app.config.auth.token.iss,
		"aud": app.config.auth.token.iss,
	})
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := jsonResponse(w, http.StatusOK, token); err != nil {
		app.internalServerError(w, r, err)
	}
}

type ForgotPasswordPayload struct {
	Email string `json:"email" validate:"required,email,max=100"`
}

func (app *application) forgotPasswordHandler(w http.ResponseWriter, r *http.Request) {
	var payload ForgotPasswordPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	ctx := r.Context()

	user, err := app.store.Users.GetByEmail(ctx, payload.Email)
	if err != nil {
		app.logger.Errorw("error finding user for password reset", "error", err)
		if err != store.ErrNotFound {
			app.internalServerError(w, r, err)
		}
		return
	}

	plainToken, hashToken := generateTokenAndHash()

	if err = app.store.Users.CreatePasswordReset(ctx, hashToken, app.config.mail.exp, user.ID); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	resetURL := fmt.Sprintf("%s/auth/reset-password/%s", app.config.frontendURL, plainToken)

	vars := struct {
		Username string
		ResetURL string
	}{
		Username: user.Username,
		ResetURL: resetURL,
	}

	isProd := app.config.env == "production"

	statusCode, err := app.mailer.Send(mailer.ForgotPasswordTemplate, user.Username, user.Email, vars, !isProd)
	if err != nil {
		app.logger.Errorw("error sending forgot password email", "error", err)
		return
	}

	app.logger.Infow("forgot password email sent", "status code", statusCode)

	w.WriteHeader(http.StatusNoContent)
}

type ResetPasswordPayload struct {
	Password string `json:"password" validate:"required,min=6,max=100"`
}

func (app *application) resetPasswordHandler(w http.ResponseWriter, r *http.Request) {
	var payload ResetPasswordPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := &store.UserDetails{}
	if err := user.Password.Set(payload.Password); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	token := chi.URLParam(r, "token")

	if err := app.store.Users.ResetPassword(r.Context(), token, user.Password.Hash); err != nil {
		switch err {
		case store.ErrNotFound:
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func generateTokenAndHash() (string, string) {
	plainToken := uuid.New().String()
	hash := sha256.Sum256([]byte(plainToken))
	hashToken := hex.EncodeToString(hash[:])
	return plainToken, hashToken
}
