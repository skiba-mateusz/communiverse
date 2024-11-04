package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"github.com/skiba-mateusz/communiverse/internal/store"
	"net/http"
	"strconv"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func (app *application) tokenAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			app.unauthorizedResponse(w, r, fmt.Errorf("authorization header is missing"))
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 && parts[0] != "Bearer" {
			app.unauthorizedResponse(w, r, fmt.Errorf("authorization header is malformed"))
			return
		}

		token := parts[1]
		jwtToken, err := app.authenticator.ValidateToken(token)
		if err != nil {
			app.unauthorizedResponse(w, r, err)
			return
		}

		claims, _ := jwtToken.Claims.(jwt.MapClaims)

		userID, err := strconv.ParseInt(fmt.Sprintf("%.f", claims["sub"]), 10, 64)
		if err != nil {
			app.unauthorizedResponse(w, r, err)
			return
		}

		ctx := r.Context()

		user, err := app.store.Users.GetByID(ctx, userID)
		if err != nil {
			app.unauthorizedResponse(w, r, err)
			return
		}

		ctx = context.WithValue(ctx, userCtx, user)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (app *application) basicAuthMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authorizationHeader := r.Header.Get("Authorization")
			if authorizationHeader == "" {
				app.unauthorizedBasicResponse(w, r, fmt.Errorf("authorization header is missing"))
				return
			}

			parts := strings.Split(authorizationHeader, " ")
			if len(parts) != 2 && parts[0] != "Basic" {
				app.unauthorizedBasicResponse(w, r, fmt.Errorf("authorization header is malformed"))
				return
			}

			decoded, err := base64.StdEncoding.DecodeString(parts[1])
			if err != nil {
				app.unauthorizedBasicResponse(w, r, err)
				return
			}

			user := app.config.auth.basic.user
			password := app.config.auth.basic.password

			creds := strings.SplitN(string(decoded), ":", 2)
			if len(creds) != 2 || creds[0] != user || creds[1] != password {
				app.unauthorizedBasicResponse(w, r, fmt.Errorf("invalid credentials"))
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func (app *application) checkPostOwnership(requiredRole string, next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		post := getPostFromContext(r)
		user := getUserFromContext(r)

		if app.isOwnerOrHasRole(w, r, ownershipContext{
			resourceOwnerID: post.UserID,
			userID:          user.ID,
			communityRole:   post.Community.Role,
			userRole:        user.Role,
			requiredRole:    requiredRole,
		}) {
			next.ServeHTTP(w, r)
		}
	})
}

func (app *application) checkCommunityOwnership(requiredRole string, next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		community := getCommunityFromContext(r)
		user := getUserFromContext(r)

		if app.isOwnerOrHasRole(w, r, ownershipContext{
			resourceOwnerID: community.UserID,
			userID:          user.ID,
			communityRole:   community.Role,
			userRole:        user.Role,
			requiredRole:    requiredRole,
		}) {
			next.ServeHTTP(w, r)
		}
	})
}

func (app *application) checkCommentOwnership(requiredRole string, next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		comment := getCommentFromContext(r)
		user := getUserFromContext(r)
		community := getCommunityFromContext(r)

		if app.isOwnerOrHasRole(w, r, ownershipContext{
			resourceOwnerID: comment.UserID,
			userID:          user.ID,
			communityRole:   community.Role,
			userRole:        user.Role,
			requiredRole:    requiredRole,
		}) {
			next.ServeHTTP(w, r)
		}
	})
}

func (app *application) authorizeWithOwnership(requiredRole, resourceType string, next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := getUserFromContext(r)
		community := getCommunityFromContext(r)

		isOwner := false

		switch resourceType {
		case "community":
			if community.UserID == user.ID {
				isOwner = true
			}
		case "post":
			post := getPostFromContext(r)
			if post.UserID == user.ID {
				isOwner = true
			}
		case "comment":
			comment := getCommentFromContext(r)
			if comment.UserID == user.ID {
				isOwner = true
			}
		default:
			app.badRequestResponse(w, r, fmt.Errorf("unknown resource type"))
			return
		}

		ctx := r.Context()

		hasCommunityRole := false
		if community.Role.ID != -1 {
			allowed, err := app.checkRole(ctx, community.Role, requiredRole)
			if err != nil {
				app.internalServerError(w, r, err)
				return
			}
			hasCommunityRole = allowed
		}

		hasGlobalRole := false
		allowed, err := app.checkRole(ctx, user.Role, requiredRole)
		if err != nil {
			app.internalServerError(w, r, err)
			return
		}
		hasGlobalRole = allowed

		if isOwner || hasCommunityRole || hasGlobalRole {
			next.ServeHTTP(w, r)
			return
		}

		app.forbiddenResponse(w, r)
	})
}

type ownershipContext struct {
	resourceOwnerID int64
	userID          int64
	communityRole   store.Role
	userRole        store.Role
	requiredRole    string
}

func (app *application) isOwnerOrHasRole(w http.ResponseWriter, r *http.Request, ownership ownershipContext) bool {
	if ownership.resourceOwnerID == ownership.userID {
		return true
	}

	if allowed, err := app.checkRole(r.Context(), ownership.communityRole, ownership.requiredRole); err != nil {
		app.internalServerError(w, r, err)
		return false
	} else if allowed {
		return true
	}

	if allowed, err := app.checkRole(r.Context(), ownership.userRole, ownership.requiredRole); err != nil {
		app.internalServerError(w, r, err)
		return false
	} else if allowed {
		return true
	}

	app.forbiddenResponse(w, r)
	return false
}

func (app *application) checkCommunityMembership(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		community := getCommunityFromContext(r)

		if allowed, err := app.checkRole(r.Context(), community.Role, "member"); err != nil {
			app.internalServerError(w, r, err)
			return
		} else if allowed {
			next.ServeHTTP(w, r)
			return
		}

		app.forbiddenResponse(w, r)
	})
}

func (app *application) checkRole(ctx context.Context, role store.Role, roleName string) (bool, error) {
	r, err := app.store.Roles.GetByName(ctx, roleName)
	if err != nil {
		return false, err
	}

	return role.Level >= r.Level, nil
}
