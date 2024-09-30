package main

import (
	"net/http"

	"github.com/skiba-mateusz/communiverse/internal/store"
)

func (app *application) getUserFeed(w http.ResponseWriter, r *http.Request) {
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

	userID := 704 // TODO: replace after auth

	posts, err := app.store.Posts.GetUserFeed(r.Context(), int64(userID), query)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := jsonResponse(w, http.StatusOK, posts); err != nil {
		app.internalServerError(w, r, err)
	}
}
