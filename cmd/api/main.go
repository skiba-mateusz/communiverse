package main

import (
	"log"

	_ "github.com/joho/godotenv/autoload"
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
	}

	logger := zap.Must(zap.NewProduction()).Sugar()
	defer logger.Sync()

	app := &application{
		config: cfg,
		logger: logger,
	}

	mux := app.mount()
	log.Fatal(app.run(mux))
}
