package main

import (
	"log"

	"github.com/skiba-mateusz/communiverse/internal/db"
	"github.com/skiba-mateusz/communiverse/internal/env"
	"github.com/skiba-mateusz/communiverse/internal/store"
)

func main() {
	addr := env.GetString("DB_ADDR", "postgres://admin:adminpassword@localhost:5432/communiverse?sslmode=disable")
	dbConn, err := db.New(addr, 3, 3, "1m")
	if err != nil {
		log.Fatal(err)
	}

	store := store.NewStorage(dbConn)

	db.Seed(store, dbConn)
}
