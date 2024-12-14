package main

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"image/jpeg"
	"net/http"

	"github.com/disintegration/imaging"
	"github.com/google/uuid"

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

	resizedImg := imaging.Fill(img, 400, 225, imaging.Center, imaging.Lanczos)

	buf := new(bytes.Buffer)

	if err = jpeg.Encode(buf, resizedImg, nil); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	thumbnailID := uuid.New().String()
	key := fmt.Sprintf("thumbnails/%s", thumbnailID)

	if err = app.uploader.UploadFile(ctx, buf.Bytes(), key, "image/jpeg"); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	slug, err := app.store.Common.GenerateUniqueSlug(ctx, payload.Name, "communities")
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	user := getUserFromContext(r)

	thumbnailURL := app.generateAssetURL(thumbnailID, "thumbnails")

	community := &store.CommunityDetails{
		BaseCommunity: store.BaseCommunity{
			Name:         payload.Name,
			Slug:         slug,
			ThumbnailID:  thumbnailID,
			ThumbnailURL: thumbnailURL,
		},
		Description:  payload.Description,
		UserID:       user.ID,
	}

	if err = app.store.Communities.Create(ctx, community); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err = jsonResponse(w, http.StatusCreated, community); err != nil {
		app.internalServerError(w, r, err)
	}
}

func (app *application) getCommunityHandler(w http.ResponseWriter, r *http.Request) {
	community := getCommunityFromContext(r)

	if err := jsonResponse(w, http.StatusOK, community); err != nil {
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

		resizedImg := imaging.Fill(img, 400, 225, imaging.Center, imaging.Lanczos)

		buf := new(bytes.Buffer)

		if err = jpeg.Encode(buf, resizedImg, nil); err != nil {
			app.internalServerError(w, r, err)
			return
		}

		thumbnailID := uuid.New().String()
		key := fmt.Sprintf("thumbnails/%s", thumbnailID)

		if err = app.uploader.UploadFile(ctx, buf.Bytes(), key, "image/jpeg"); err != nil {
			app.internalServerError(w, r, err)
			return
		}

		community.ThumbnailID = thumbnailID
		community.ThumbnailURL = app.generateAssetURL(thumbnailID, "thumbnails")
	}

	if err = app.store.Communities.Update(ctx, community); err != nil {
		switch err {
		case store.ErrNotFound:
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err = jsonResponse(w, http.StatusOK, community); err != nil {
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

	for _, community := range communities {
		community.ThumbnailURL = app.generateAssetURL(community.ThumbnailID, "thumbnails")
	}

	if err = jsonResponse(w, http.StatusOK, communities); err != nil {
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

		community.ThumbnailURL = app.generateAssetURL(community.ThumbnailID, "thumbnails")
		community.User.AvatarURL = app.generateAssetURL(community.User.AvatarID, "avatars")

		ctx = context.WithValue(ctx, communityCtx, community)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func getCommunityFromContext(r *http.Request) *store.CommunityDetails {
	community := r.Context().Value(communityCtx).(*store.CommunityDetails)
	return community
}
