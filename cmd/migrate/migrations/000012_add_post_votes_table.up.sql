CREATE TABLE IF NOT EXISTS post_votes (
    post_id int REFERENCES posts (id) ON DELETE CASCADE,
    user_id int REFERENCES users (id) ON DELETE CASCADE,
    value int NOT NULL CHECK(value IN (1, 0, -1)),
    PRIMARY KEY (post_id, user_id)
);