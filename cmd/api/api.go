package main

import (
	"net/http"
	"time"

	"github.com/go-chi/cors"
	"github.com/skiba-mateusz/communiverse/internal/env"
	"github.com/skiba-mateusz/communiverse/internal/uploader"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/skiba-mateusz/communiverse/internal/auth"
	"github.com/skiba-mateusz/communiverse/internal/mailer"
	"github.com/skiba-mateusz/communiverse/internal/store"
	"go.uber.org/zap"
)

type application struct {
	config        config
	logger        *zap.SugaredLogger
	store         store.Storage
	mailer        mailer.Client
	authenticator auth.Authenticator
	uploader      uploader.Client
}

type config struct {
	addr        string
	env         string
	frontendURL string
	db          dbConfig
	mail        mailConfig
	auth        authConfig
	upload      uploadConfig
}

type dbConfig struct {
	addr         string
	maxOpenConns int
	maxIdleConns int
	maxIdleTime  string
}

type mailConfig struct {
	exp       time.Duration
	fromEmail string
	sendGrid  sendGridConfig
}

type sendGridConfig struct {
	apiKey string
}

type authConfig struct {
	basic basicConfig
	token tokenConfig
}

type basicConfig struct {
	user     string
	password string
}

type tokenConfig struct {
	secret string
	exp    time.Duration
	iss    string
}

type uploadConfig struct {
	bucket        string
	cloudFrontURL string
}

func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{env.GetString("FRONTEND_URL", "http://localhost:5173")},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	r.Use(middleware.Timeout(60 * time.Second))

	r.Route("/v1", func(r chi.Router) {
		r.With(app.basicAuthMiddleware()).Get("/health", app.healthHandler)

		r.Mount("/communities", app.communityRoutes())
		r.Mount("/posts", app.postRoutes())
		r.Mount("/users", app.userRoutes())
		r.Mount("/auth", app.authRoutes())
	})

	return r
}

func (app *application) communityRoutes() http.Handler {
	r := chi.NewRouter()

	r.Use(app.tokenAuthMiddleware)

	r.Post("/", app.createCommunityHandler)
	r.Get("/", app.getCommunitiesHandler)

	r.Route("/{communitySlug}", func(r chi.Router) {
		r.Use(app.communityContextMiddleware)

		r.Get("/", app.getCommunityHandler)
		r.Delete("/", app.authorizeWithOwnership("admin", "community", app.deleteCommunityHandler))
		r.Patch("/", app.authorizeWithOwnership("admin", "community", app.updateCommunityHandler))

		r.Post("/join", app.joinCommunityHandler)
		r.Delete("/leave", app.leaveCommunityHandler)

		r.Mount("/posts", app.communityPostRoutes())
	})

	return r
}

func (app *application) communityPostRoutes() http.Handler {
	r := chi.NewRouter()

	r.Get("/", app.getCommunityPostsHandler)
	r.Post("/", app.authorizeWithOwnership("member", "community", app.createPostHandler))

	r.Route("/{postSlug}", func(r chi.Router) {
		r.Use(app.postContextMiddleware)

		r.Get("/", app.getPostHandler)
		r.Delete("/", app.authorizeWithOwnership("admin", "post", app.deletePostHandler))
		r.Patch("/", app.authorizeWithOwnership("admin", "post", app.updatePostHandler))
		r.Put("/vote", app.votePostHandler)

		r.Mount("/comments", app.postCommentRoutes())
	})

	return r
}

func (app *application) postRoutes() http.Handler {
	r := chi.NewRouter()

	r.Use(app.tokenAuthMiddleware)

	r.Get("/", app.getPostsHandler)

	return r
}

func (app *application) postCommentRoutes() http.Handler {
	r := chi.NewRouter()

	r.Get("/", app.getCommentsHandler)
	r.Post("/", app.authorizeWithOwnership("member", "post", app.createCommentHandler))

	r.Route("/{id}", func(r chi.Router) {
		r.Use(app.commentContextMiddleware)

		r.Patch("/", app.authorizeWithOwnership("admin", "comment", app.updateCommentHandler))
		r.Delete("/", app.authorizeWithOwnership("admin", "comment", app.deleteCommentHandler))
		r.Put("/vote", app.voteCommentHandler)
	})

	return r
}

func (app *application) userRoutes() http.Handler {
	r := chi.NewRouter()

	r.Put("/activate/{token}", app.activateUserHandler)

	r.Group(func(r chi.Router) {
		r.Use(app.tokenAuthMiddleware)

		r.Route("/me", func(r chi.Router)  {
			r.Get("/", app.getCurrentUserHandler)
			r.Get("/feed", app.getCurrentUserFeedHandler)
			r.Get("/communities", app.getCurrentUserCommunitiesHandler)
			r.Delete("/", app.deleteCurrentUserHandler)
			r.Patch("/", app.updateCurrentUserHandler)
		})

		r.Route("/{username}", func(r chi.Router) {
			r.Get("/", app.getUserHandler)
		})
	})

	return r
}

func (app *application) authRoutes() http.Handler {
	r := chi.NewRouter()

	r.Post("/register", app.registerUserHandler)
	r.Post("/login", app.loginUserHandler)
	r.Post("/forgot-password", app.forgotPasswordHandler)
	r.Put("/reset-password/{token}", app.resetPasswordHandler)

	return r
}

func (app *application) run(mux http.Handler) error {
	srv := &http.Server{
		Addr:         app.config.addr,
		Handler:      mux,
		WriteTimeout: time.Second * 30,
		ReadTimeout:  time.Second * 10,
		IdleTimeout:  time.Minute,
	}

	app.logger.Infow("server is listening", "addr", app.config.addr, "env", app.config.env)

	return srv.ListenAndServe()
}
