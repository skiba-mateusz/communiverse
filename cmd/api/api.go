package main

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/skiba-mateusz/communiverse/internal/mailer"
	"github.com/skiba-mateusz/communiverse/internal/store"
	"go.uber.org/zap"
)

type application struct {
	config config
	logger *zap.SugaredLogger
	store  store.Storage
	mailer mailer.Client
}

type config struct {
	addr        string
	env         string
	frontendURL string
	db          dbConfig
	mail        mailConfig
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

func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(middleware.Timeout(60 * time.Second))

	r.Route("/v1", func(r chi.Router) {
		r.Get("/health", app.healthHandler)

		r.Route("/communities", func(r chi.Router) {
			r.Post("/", app.createCommunityHandler)
			r.Get("/", app.getCommunitiesHandler)

			r.Route("/{communitySlug}", func(r chi.Router) {
				r.Use(app.communityContextMiddleware)

				r.Get("/", app.getCommunityHandler)
				r.Delete("/", app.deleteCommunityHandler)
				r.Patch("/", app.updateCommunityHandler)

				r.Post("/join", app.joinCommunityHandler)
				r.Delete("/leave", app.leaveCommunityHandler)

				r.Route("/posts", func(r chi.Router) {
					r.Get("/", app.getCommunityPostsHandler)
					r.Post("/", app.createPostHandler)
				})
			})
		})

		r.Route("/posts", func(r chi.Router) {
			r.Get("/", app.getPostsHandler)

			r.Route("/{postSlug}", func(r chi.Router) {
				r.Use(app.postContextMiddleware)

				r.Get("/", app.getPostHandler)
				r.Delete("/", app.deletePostHandler)
				r.Patch("/", app.updatePostHandler)

				r.Route("/comments", func(r chi.Router) {
					r.Post("/", app.createCommentHandler)
				})
			})
		})

		r.Route("/users", func(r chi.Router) {
			r.Put("/activate/{token}", app.activateUserHandler)

			r.Route("/{username}", func(r chi.Router) {
				r.Use(app.userContextMiddleware)

				r.Get("/", app.getUserHandler)
				r.Delete("/", app.deleteUserHandler)
				r.Patch("/", app.updateUserHandler)
			})

			r.Get("/feed", app.getUserFeedHandler)
		})

		r.Route("/auth", func(r chi.Router) {
			r.Post("/register", app.registerUserHandler)
		})
	})

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
