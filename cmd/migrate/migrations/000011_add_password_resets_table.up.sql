CREATE TABLE IF NOT EXISTS password_resets (
    token bytea PRIMARY KEY,
    user_id int NOT NULL REFERENCES users (id),
    expiry TIMESTAMP WITH TIME ZONE
);