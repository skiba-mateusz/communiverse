package main

import (
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/skiba-mateusz/communiverse/internal/store"
)

type postKey string

const (
	postCtx postKey = "post"
)

type CreatePostPayload struct {
	Title   string   `json:"title" validate:"required,min=8,max=100"`
	Content string   `json:"content" validate:"required,min=100,max=2500"`
	Tags    []string `json:"tags" validate:"required"`
}

func (app *application) createPostHandler(w http.ResponseWriter, r *http.Request) {
	var payload CreatePostPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	community := getCommunityFromContext(r)

	ctx := r.Context()

	slug, err := app.store.Common.GenerateUniqueSlug(ctx, payload.Title, "posts")
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	user := getUserFromContext(r)

	post := &store.PostDetails{
		BasePost: store.BasePost{
			Title:       payload.Title,
			Slug:        slug,
			Tags:        payload.Tags,
			CommunityID: community.ID,
			UserID:      user.ID,
			Content:     payload.Content,
		},
	}

	if err = app.store.Posts.Create(ctx, post); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err = jsonResponse(w, http.StatusCreated, post); err != nil {
		app.internalServerError(w, r, err)
	}
}

func (app *application) getPostHandler(w http.ResponseWriter, r *http.Request) {
	post := getPostFromContext(r)

	if err := jsonResponse(w, http.StatusOK, post); err != nil {
		app.internalServerError(w, r, err)
	}
}

func (app *application) deletePostHandler(w http.ResponseWriter, r *http.Request) {
	post := getPostFromContext(r)

	ctx := r.Context()

	if err := app.store.Posts.Delete(ctx, post.ID); err != nil {
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

type UpdatePostPayload struct {
	Title   *string   `json:"title" validate:"omitempty,min=8,max=100"`
	Content *string   `json:"content" validate:"omitempty,min=32,max=1000"`
	Tags    *[]string `json:"tags" validate:"omitempty"`
}

func (app *application) updatePostHandler(w http.ResponseWriter, r *http.Request) {
	var payload UpdatePostPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	post := getPostFromContext(r)
	ctx := r.Context()

	if payload.Title != nil {
		post.Title = *payload.Title

		slug, err := app.store.Common.GenerateUniqueSlug(ctx, *payload.Title, "posts")
		if err != nil {
			app.internalServerError(w, r, err)
			return
		}

		post.Slug = slug
	}
	if payload.Content != nil {
		post.Content = *payload.Content
	}
	if payload.Tags != nil {
		post.Tags = *payload.Tags
	}

	if err := app.store.Posts.Update(ctx, post); err != nil {
		switch err {
		case store.ErrNotFound:
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := jsonResponse(w, http.StatusOK, post); err != nil {
		app.internalServerError(w, r, err)
	}
}

func (app *application) getCommunityPostsHandler(w http.ResponseWriter, r *http.Request) {
	query := store.PaginatedPostsQuery{
		Limit:  10,
		Offset: 0,
		Time: "all-time",
		View:   "newest",
		Sort: "desc",
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

	community := getCommunityFromContext(r)
	user := getUserFromContext(r)

	posts, meta, err := app.store.Posts.GetCommunityPosts(r.Context(), community.ID, user.ID, query)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	for i := range posts {
		posts[i].Community.ThumbnailURL = app.generateAssetURL(posts[i].Community.ThumbnailID, "thumbnails")
		posts[i].User.AvatarURL = app.generateAssetURL(posts[i].User.AvatarID, "avatars")
	}

	response := PaginatedPostsResponse{
		Items: posts,
		Meta: meta,
	}

	if err = jsonResponse(w, http.StatusOK, response); err != nil {
		app.internalServerError(w, r, err)
	}
}

type PaginatedPostsResponse struct {
	Items []store.PostSummary `json:"items"`
	Meta store.Meta `json:"meta"` 
}

func (app *application) getPostsHandler(w http.ResponseWriter, r *http.Request) {
	query := store.PaginatedPostsQuery{
		Limit:  10,
		Offset: 0,
		Time: "all-time",
		View:   "creation",
		Sort: "desc",
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

	posts, meta, err := app.store.Posts.GetAll(r.Context(), user.ID, query)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	for i := range posts {
		posts[i].Community.ThumbnailURL = app.generateAssetURL(posts[i].Community.ThumbnailID, "thumbnails")
		posts[i].User.AvatarURL = app.generateAssetURL(posts[i].User.AvatarID, "avatars")
	}

	response := PaginatedPostsResponse{
		Items: posts,
		Meta: meta,
	}

	if err = jsonResponse(w, http.StatusOK, response); err != nil {
		app.internalServerError(w, r, err)
	}
}

type VotePostPayload struct {
	Value *int `json:"value" validate:"required,min=-1,max=1"`
}

func (app *application) votePostHandler(w http.ResponseWriter, r *http.Request) {
	var payload VotePostPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := getUserFromContext(r)
	post := getPostFromContext(r)

	if err := app.store.Posts.Vote(r.Context(), *payload.Value, post.ID, user.ID); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (app *application) postContextMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		slug := chi.URLParam(r, "postSlug")
		user := getUserFromContext(r)
		ctx := r.Context()

		post, err := app.store.Posts.GetBySlug(ctx, slug, user.ID)
		if err != nil {
			switch err {
			case store.ErrNotFound:
				app.notFoundResponse(w, r, err)
			default:
				app.internalServerError(w, r, err)
			}
			return
		}

		post.Community.ThumbnailURL = app.generateAssetURL(post.Community.ThumbnailID, "thumbnails")
		post.User.AvatarURL = app.generateAssetURL(post.User.AvatarID, "avatars")

		ctx = context.WithValue(ctx, postCtx, post)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func getPostFromContext(r *http.Request) *store.PostDetails {
	post := r.Context().Value(postCtx).(*store.PostDetails)
	return post
}
