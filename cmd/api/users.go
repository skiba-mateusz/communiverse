package main

import (
	"bytes"
	"fmt"
	"github.com/disintegration/imaging"
	"github.com/google/uuid"
	"image"
	"image/jpeg"
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

	if err = Validate.Struct(query); err != nil {
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

func (app *application) getCurrentUserCommunitiesHandler(w http.ResponseWriter, r *http.Request) {
	query := store.PaginatedCommunitiesQuery{
		Limit:  10,
		Offset: 0,
	}

	query, err := query.Parse(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err = Validate.Struct(query); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := getUserFromContext(r)

	communities, err := app.store.Communities.GetUserCommunities(r.Context(), user.ID, query)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err = jsonResponse(w, http.StatusOK, communities); err != nil {
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
	err := r.ParseMultipartForm(5 << 20)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	payload := UpdateUserPayload{
		Name:     getStringPointer(r.FormValue("name")),
		Username: getStringPointer(r.FormValue("username")),
		Bio:      getStringPointer(r.FormValue("bio")),
	}

	if err = Validate.Struct(payload); err != nil {
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

	ctx := r.Context()

	file, _, err := r.FormFile("avatar")
	if err != nil && err != http.ErrMissingFile {
		app.badRequestResponse(w, r, err)
		return
	}
	if err == nil {
		defer file.Close()

		img, _, err := image.Decode(file)
		if err != nil {
			app.internalServerError(w, r, err)
			return
		}

		resizedImg := imaging.Fill(img, 256, 256, imaging.Center, imaging.Lanczos)

		buf := new(bytes.Buffer)
		if err = jpeg.Encode(buf, resizedImg, nil); err != nil {
			app.internalServerError(w, r, err)
			return
		}

		id := uuid.New().String()
		key := fmt.Sprintf("avatars/%s.jpg", id)

		if err = app.uploader.UploadFile(ctx, buf.Bytes(), key); err != nil {
			app.internalServerError(w, r, err)
			return
		}

		user.AvatarID = id
	}

	if err = app.store.Users.Update(ctx, user); err != nil {
		switch err {
		case store.ErrNotFound:
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err = jsonResponse(w, http.StatusOK, user); err != nil {
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

func (app *application) getUserAvatarHandler(w http.ResponseWriter, r *http.Request) {
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

	key := fmt.Sprintf("avatars/%s.jpg", user.AvatarID)

	file, err := app.uploader.DownloadFile(ctx, key)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	w.Header().Set("Content-Type", "image/jpeg")
	w.WriteHeader(http.StatusOK)
	if _, err = w.Write(file); err != nil {
		app.internalServerError(w, r, err)
	}
}

func (app *application) getCurrentUserHandler(w http.ResponseWriter, r *http.Request) {
	user := getUserFromContext(r)

	if err := jsonResponse(w, http.StatusOK, user); err != nil {
		app.internalServerError(w, r, err)
	}
}

func getUserFromContext(r *http.Request) *store.UserDetails {
	user := r.Context().Value(userCtx).(*store.UserDetails)
	return user
}

func getStringPointer(value string) *string {
	if value == "" {
		return nil
	}
	return &value
}
