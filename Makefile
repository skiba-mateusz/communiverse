include .env

MIGRATIONS_PATH = cmd/migrate/migrations

migration: 
	@migrate create -ext sql -dir $(MIGRATIONS_PATH) -seq $(filter-out $@, $(MAKECMDGOALS))

migrate-up: 
	@migrate -database $(DB_ADDR) -path $(MIGRATIONS_PATH) up

migrate-down:
	@migrate -database $(DB_ADDR) -path $(MIGRATIONS_PATH) down

seed:
	@go run ./cmd/migrate/seed/main.go