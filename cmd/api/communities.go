package main

import (
	"bytes"
	"context"
	"fmt"
	"github.com/google/uuid"
	"github.com/nfnt/resize"
	"image"
	"image/jpeg"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/skiba-mateusz/communiverse/internal/store"
)

type communityKey string

const (
	communityCtx communityKey = "community"
)

type CreateCommunityPayload struct {
	Name        string `json:"name" validate:"required,min=8,max=100"`
	Description string `json:"description" validate:"required,min=32,max=255"`
}

func (app *application) createCommunityHandler(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(5 << 20); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	payload := CreateCommunityPayload{
		Name:        r.FormValue("name"),
		Description: r.FormValue("description"),
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	ctx := r.Context()

	file, _, err := r.FormFile("thumbnail")
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	defer file.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	resizedImg := resize.Resize(400, 225, img, resize.Lanczos3)

	buf := new(bytes.Buffer)

	if err = jpeg.Encode(buf, resizedImg, nil); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	id := uuid.New().String()
	key := fmt.Sprintf("thumbnails/%s.jpg", id)

	if err = app.uploader.UploadFile(ctx, buf.Bytes(), key); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	slug, err := app.store.Common.GenerateUniqueSlug(ctx, payload.Name, "communities")
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	user := getUserFromContext(r)

	community := &store.CommunityDetails{
		Name:        payload.Name,
		Description: payload.Description,
		Slug:        slug,
		ThumbnailID: id,
		UserID:      user.ID,
		IsMember:    true,
	}

	if err := app.store.Communities.Create(ctx, community); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := jsonResponse(w, http.StatusCreated, community); err != nil {
		app.internalServerError(w, r, err)
	}
}

func (app *application) getCommunityHandler(w http.ResponseWriter, r *http.Request) {
	community := getCommunityFromContext(r)

	if err := jsonResponse(w, http.StatusOK, community); err != nil {
		app.internalServerError(w, r, err)
	}
}

func (app *application) getCommunityThumbnailHandler(w http.ResponseWriter, r *http.Request) {
	community := getCommunityFromContext(r)

	key := fmt.Sprintf("thumbnails/%s.jpg", community.ThumbnailID)

	file, err := app.uploader.DownloadFile(r.Context(), key)
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

func (app *application) deleteCommunityHandler(w http.ResponseWriter, r *http.Request) {
	community := getCommunityFromContext(r)

	ctx := r.Context()

	if err := app.store.Communities.Delete(ctx, community.ID); err != nil {
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

type UpdateCommunityPayload struct {
	Name        *string `json:"name" validate:"omitempty,min=8,max=100"`
	Description *string `json:"description" validate:"omitempty,min=32,max=255"`
}

func (app *application) updateCommunityHandler(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(5 << 20); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	payload := UpdateCommunityPayload{
		Name:        getStringPointer(r.FormValue("name")),
		Description: getStringPointer(r.FormValue("description")),
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	community := getCommunityFromContext(r)
	ctx := r.Context()

	if payload.Name != nil {
		community.Name = *payload.Name

		slug, err := app.store.Common.GenerateUniqueSlug(ctx, *payload.Name, "communities")
		if err != nil {
			app.internalServerError(w, r, err)
			return
		}

		community.Slug = slug
	}
	if payload.Description != nil {
		community.Description = *payload.Description
	}

	file, _, err := r.FormFile("thumbnail")
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

		resizedImg := resize.Resize(400, 225, img, resize.Lanczos3)

		buf := new(bytes.Buffer)

		if err = jpeg.Encode(buf, resizedImg, nil); err != nil {
			app.internalServerError(w, r, err)
			return
		}

		id := uuid.New().String()
		key := fmt.Sprintf("thumbnails/%s.jpg", id)

		if err = app.uploader.UploadFile(ctx, buf.Bytes(), key); err != nil {
			app.internalServerError(w, r, err)
			return
		}

		community.ThumbnailID = id
	}

	if err := app.store.Communities.Update(ctx, community); err != nil {
		switch err {
		case store.ErrNotFound:
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := jsonResponse(w, http.StatusOK, community); err != nil {
		app.internalServerError(w, r, err)
	}
}

func (app *application) joinCommunityHandler(w http.ResponseWriter, r *http.Request) {
	community := getCommunityFromContext(r)

	user := getUserFromContext(r)

	if err := app.store.Communities.Join(r.Context(), community.ID, user.ID); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (app *application) leaveCommunityHandler(w http.ResponseWriter, r *http.Request) {
	community := getCommunityFromContext(r)

	user := getUserFromContext(r)

	if user.ID == community.UserID {
		return
	}

	if err := app.store.Communities.Leave(r.Context(), community.ID, user.ID); err != nil {
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

func (app *application) getCommunitiesHandler(w http.ResponseWriter, r *http.Request) {
	query := store.PaginatedCommunitiesQuery{
		Limit:  10,
		Offset: 0,
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

	communities, err := app.store.Communities.GetAll(r.Context(), user.ID, query)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := jsonResponse(w, http.StatusOK, communities); err != nil {
		app.internalServerError(w, r, err)
	}
}

func (app *application) communityContextMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		slug := chi.URLParam(r, "communitySlug")

		ctx := r.Context()

		user := getUserFromContext(r)

		community, err := app.store.Communities.GetBySlug(ctx, slug, user.ID)
		if err != nil {
			switch err {
			case store.ErrNotFound:
				app.notFoundResponse(w, r, err)
			default:
				app.internalServerError(w, r, err)
			}
			return
		}

		ctx = context.WithValue(ctx, communityCtx, community)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func getCommunityFromContext(r *http.Request) *store.CommunityDetails {
	community := r.Context().Value(communityCtx).(*store.CommunityDetails)
	return community
}
