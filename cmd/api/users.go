package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/skiba-mateusz/communiverse/internal/store"
)

type userKey string

const (
	userCtx userKey = "user"
)

func (app *application) getCurrentUserFeedHandler(w http.ResponseWriter, r *http.Request) {
	query := store.PaginatedPostsQuery{
		Limit:  10,
		Offset: 0,
		Sort:   "desc",
	}

	query, err := query.Parse(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(query); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := getUserFromContext(r)

	posts, err := app.store.Posts.GetUserFeed(r.Context(), user.ID, query)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := jsonResponse(w, http.StatusOK, posts); err != nil {
		app.internalServerError(w, r, err)
	}
}

func (app *application) activateUserHandler(w http.ResponseWriter, r *http.Request) {
	token := chi.URLParam(r, "token")

	err := app.store.Users.Activate(r.Context(), token)
	if err != nil {
		switch err {
		case store.ErrNotFound:
			app.badRequestResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (app *application) deleteCurrentUserHandler(w http.ResponseWriter, r *http.Request) {
	user := getUserFromContext(r)

	if err := app.store.Users.Delete(r.Context(), user.ID); err != nil {
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

type UpdateUserPayload struct {
	Name     *string `json:"name" validate:"omitempty,min=3,max=100"`
	Username *string `json:"username" validate:"omitempty,min=3,max=100"`
	Bio      *string `json:"bio" validate:"omitempty,min=8,max=100"`
}

func (app *application) updateCurrentUserHandler(w http.ResponseWriter, r *http.Request) {
	var payload UpdateUserPayload

	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := getUserFromContext(r)

	if payload.Name != nil {
		user.Name = *payload.Name
	}
	if payload.Username != nil {
		user.Username = *payload.Username
	}
	if payload.Bio != nil {
		user.Bio = *payload.Bio
	}

	if err := app.store.Users.Update(r.Context(), user); err != nil {
		switch err {
		case store.ErrNotFound:
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := jsonResponse(w, http.StatusOK, user); err != nil {
		app.internalServerError(w, r, err)
	}
}

func (app *application) getUserHandler(w http.ResponseWriter, r *http.Request) {
	username := chi.URLParam(r, "username")

	ctx := r.Context()

	user, err := app.store.Users.GetByUsername(ctx, username)
	if err != nil {
		switch err {
		case store.ErrNotFound:
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := jsonResponse(w, http.StatusOK, user); err != nil {
		app.internalServerError(w, r, err)
	}
}

func (app *application) getCurrentUserHandler(w http.ResponseWriter, r *http.Request) {
	user := getUserFromContext(r)

	if err := jsonResponse(w, http.StatusOK, user); err != nil {
		app.internalServerError(w, r, err)
	}
}

func getUserFromContext(r *http.Request) *store.User {
	user := r.Context().Value(userCtx).(*store.User)
	return user
}
