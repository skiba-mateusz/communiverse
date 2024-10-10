package main

import (
	"net/http"

	"github.com/skiba-mateusz/communiverse/internal/store"
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

	comment := &store.Comment{
		Content: payload.Content,
		PostID:  post.ID,
		UserID:  user.ID,
		User:    &store.User{},
	}

	if err := app.store.Comments.Create(ctx, comment); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	comment.User.Username = user.Username
	comment.User.ID = user.ID

	if err := jsonResponse(w, http.StatusCreated, comment); err != nil {
		app.internalServerError(w, r, err)
	}
}
