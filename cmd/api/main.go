package main

import (
	"log"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/skiba-mateusz/communiverse/internal/db"
	"github.com/skiba-mateusz/communiverse/internal/env"
	"github.com/skiba-mateusz/communiverse/internal/mailer"
	"github.com/skiba-mateusz/communiverse/internal/store"
	"go.uber.org/zap"
)

const (
	version = "0.0.1"
)

func main() {
	cfg := config{
		addr:        env.GetString("PORT", ":8080"),
		env:         env.GetString("ENV", "development"),
		frontendURL: env.GetString("FRONTED_URL", "http://localhost:5173"),
		db: dbConfig{
			addr:         env.GetString("DB_ADDR", "postgres://admin:adminpassword@localhost/communiverse?sslmode=disable"),
			maxOpenConns: env.GetInt("DB_MAX_OPEN_CONNS", 30),
			maxIdleConns: env.GetInt("DB_MAX_IDLE_CONNS", 30),
			maxIdleTime:  env.GetString("DB_MAX_IDLE_TIME", "15m"),
		},
		mail: mailConfig{
			exp:       time.Hour * 24 * 3,
			fromEmail: env.GetString("FROM_EMAIL", ""),
			sendGrid: sendGridConfig{
				apiKey: env.GetString("SENDGRID_API_KEY", ""),
			},
		},
	}

	logger := zap.Must(zap.NewProduction()).Sugar()
	defer logger.Sync()

	db, err := db.New(
		cfg.db.addr,
		cfg.db.maxOpenConns,
		cfg.db.maxIdleConns,
		cfg.db.maxIdleTime,
	)
	if err != nil {
		logger.Fatal(err)
	}

	logger.Info("database connection pool established")

	store := store.NewStorage(db)
	mailer := mailer.NewSendGrid(cfg.mail.sendGrid.apiKey, cfg.mail.fromEmail)

	app := &application{
		config: cfg,
		logger: logger,
		store:  store,
		mailer: mailer,
	}

	mux := app.mount()
	log.Fatal(app.run(mux))
}
