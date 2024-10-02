CREATE TABLE IF NOT EXISTS user_invitations (
  token bytea PRIMARY KEY,
  user_id int NOT NULL REFERENCES users (id),
  expiry TIMESTAMP WITH TIME ZONE NOT NULL
);