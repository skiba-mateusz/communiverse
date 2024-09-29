CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  content text NOT NULL,
  user_id int NOT NULL REFERENCES users (id),
  post_id int NOT NULL REFERENCES posts (id),
  parent_id int REFERENCES comments (id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);