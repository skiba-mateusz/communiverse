package main

import (
	"log"

	_ "github.com/joho/godotenv/autoload"
	"github.com/skiba-mateusz/communiverse/internal/db"
	"github.com/skiba-mateusz/communiverse/internal/env"
	"go.uber.org/zap"
)

const (
	version = "0.0.1"
)

func main() {
	cfg := config{
		addr: env.GetString("PORT", ":8080"),
		env:  env.GetString("ENV", "development"),
		db: dbConfig{
			addr:         env.GetString("DB_ADDR", "postgres://admin:adminpassword@localhost/communiverse?sslmode=disable"),
			maxOpenConns: env.GetInt("DB_MAX_OPEN_CONNS", 30),
			maxIdleConns: env.GetInt("DB_MAX_IDLE_CONNS", 30),
			maxIdleTime:  env.GetString("DB_MAX_IDLE_TIME", "15m"),
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

	app := &application{
		config: cfg,
		logger: logger,
		db:     db,
	}

	mux := app.mount()
	log.Fatal(app.run(mux))
}
