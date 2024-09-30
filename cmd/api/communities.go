package main

import (
	"context"
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
	var payload CreateCommunityPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	ctx := r.Context()

	slug, err := app.store.Common.GenerateUniqueSlug(ctx, payload.Name, "communities")
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	community := &store.Community{
		Name:        payload.Name,
		Description: payload.Description,
		Slug:        slug,
		UserID:      1,
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

func (app *application) deleteCommunityHandler(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "communitySlug")

	ctx := r.Context()

	if err := app.store.Communities.Delete(ctx, slug); err != nil {
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
	community := getCommunityFromContext(r)

	var payload UpdateCommunityPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

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

	userID := 1 // TODO: repalce after auth

	if err := app.store.Communities.Join(r.Context(), community.ID, int64(userID)); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (app *application) leaveCommunityHandler(w http.ResponseWriter, r *http.Request) {
	community := getCommunityFromContext(r)

	userID := 1 // TODO: repalce after auth

	if userID == int(community.UserID) {
		return
	}

	if err := app.store.Communities.Leave(r.Context(), community.ID, int64(userID)); err != nil {
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
		Limit:  5,
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

	communities, err := app.store.Communities.GetCommunities(r.Context(), query)
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

		userID := 1 // TODO: replace after auth

		community, err := app.store.Communities.GetBySlug(ctx, slug, int64(userID))
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

func getCommunityFromContext(r *http.Request) *store.CommunityWithMembership {
	community := r.Context().Value(communityCtx).(*store.CommunityWithMembership)
	return community
}
