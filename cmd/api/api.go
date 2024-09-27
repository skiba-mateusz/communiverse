package main

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/skiba-mateusz/communiverse/internal/store"
	"go.uber.org/zap"
)

type application struct {
	config config
	logger *zap.SugaredLogger
	store  store.Storage
}

type config struct {
	addr string
	env  string
	db   dbConfig
}

type dbConfig struct {
	addr         string
	maxOpenConns int
	maxIdleConns int
	maxIdleTime  string
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

			r.Route("/{communitySlug}", func(r chi.Router) {
				r.Use(app.communityContextMiddleware)

				r.Get("/", app.getCommunityHandler)
				r.Delete("/", app.deleteCommunityHandler)
				r.Patch("/", app.updateCommunityHandler)
			})
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