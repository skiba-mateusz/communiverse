package main

import (
	"context"
	"github.com/go-chi/chi/v5"
	"github.com/skiba-mateusz/communiverse/internal/store"
	"net/http"
	"strconv"
)

type commentKey string

var (
	commentCtx commentKey = "comment"
)

type CreateCommentPayload struct {
	Content string `json:"content" validate:"required,min=8,max=1000"`
}

func (app *application) createCommentHandler(w http.ResponseWriter, r *http.Request) {
	var payload CreateCommentPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	post := getPostFromContext(r)
	user := getUserFromContext(r)
	ctx := r.Context()

	comment := &store.CommentDetails{
		Content: payload.Content,
		PostID:  post.ID,
		UserID:  user.ID,
		User: store.UserOverview{
			ID:       user.ID,
			Name:     user.Name,
			Username: user.Username,
		},
	}

	if err := app.store.Comments.Create(ctx, comment); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	comment.User.Name = user.Name
	comment.User.Username = user.Username
	comment.User.ID = user.ID

	if err := jsonResponse(w, http.StatusCreated, comment); err != nil {
		app.internalServerError(w, r, err)
	}
}

type VoteCommentPayload struct {
	Value *int `json:"value" validate:"required,min=-1,max=1"`
}

func (app *application) voteCommentHandler(w http.ResponseWriter, r *http.Request) {
	var payload VoteCommentPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := getUserFromContext(r)
	comment := getCommentFromContext(r)

	if err := app.store.Comments.Vote(r.Context(), *payload.Value, comment.ID, user.ID); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (app *application) commentContextMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil {
			app.internalServerError(w, r, err)
			return
		}

		ctx := r.Context()

		comment, err := app.store.Comments.GetByID(ctx, id)
		if err != nil {
			switch err {
			case store.ErrNotFound:
				app.notFoundResponse(w, r, err)
			default:
				app.internalServerError(w, r, err)
			}
			return
		}

		ctx = context.WithValue(ctx, commentCtx, comment)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func getCommentFromContext(r *http.Request) *store.CommentSummary {
	comment := r.Context().Value(commentCtx).(*store.CommentSummary)
	return comment
}
