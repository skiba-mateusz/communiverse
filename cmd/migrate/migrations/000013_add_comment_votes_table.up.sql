CREATE TABLE IF NOT EXISTS comment_votes (
    comment_id int REFERENCES comments (id) ON DELETE CASCADE,
    user_id int REFERENCES users (id) ON DELETE CASCADE,
    value int NOT NULL CHECK(value IN (1, 0, -1)),
    PRIMARY KEY (comment_id, user_id)
);