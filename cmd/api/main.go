package main

import (
	"github.com/skiba-mateusz/communiverse/internal/uploader"
	"log"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/skiba-mateusz/communiverse/internal/auth"
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
		auth: authConfig{
			basic: basicConfig{
				user:     env.GetString("AUTH_BASIC_USER", "admin"),
				password: env.GetString("AUTH_BASIC_PASSWORD", "admin"),
			},
			token: tokenConfig{
				secret: env.GetString("AUTH_TOKEN_SECRET", "secret"),
				exp:    time.Hour * 24 * 3,
				iss:    "Communiverse",
			},
		},
		upload: uploadConfig{
			bucket:        env.GetString("UPLOAD_BUCKET", "communiverse-storage"),
			cloudFrontURL: env.GetString("CLOUDFRONT_URL", ""),
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
	authenticator := auth.NewJWTAuthenticator(
		cfg.auth.token.secret,
		cfg.auth.token.iss,
		cfg.auth.token.iss,
	)
	uploader, err := uploader.NewS3Uploader(cfg.upload.bucket)
	if err != nil {
		logger.Fatal(err)
	}

	app := &application{
		config:        cfg,
		logger:        logger,
		store:         store,
		mailer:        mailer,
		authenticator: authenticator,
		uploader:      uploader,
	}

	mux := app.mount()
	log.Fatal(app.run(mux))
}
