CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    level int NOT NULL DEFAULT 0
);

INSERT INTO roles (name, level)
VALUES
    ('staff', 4),
    ('admin', 3),
    ('member', 2),
    ('user', 1);

ALTER TABLE IF EXISTS users
ADD COLUMN role_id INT REFERENCES roles(id) DEFAULT 1;

UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'user');

ALTER TABLE users
ALTER COLUMN role_id DROP DEFAULT;

ALTER TABLE users
ALTER COLUMN role_id SET NOT NULL;

ALTER TABLE IF EXISTS user_communities
ADD COLUMN role_id INT REFERENCES roles(id) DEFAULT 2;

UPDATE user_communities
SET role_id = (SELECT id FROM roles WHERE name = 'member');

UPDATE user_communities uc
SET role_id = (
    SELECT id FROM roles WHERE name = 'admin'
)
WHERE uc.user_id IN (
    SELECT c.user_id
    FROM communities c
    WHERE c.id = uc.community_id AND c.user_id = uc.user_id
);

ALTER TABLE user_communities
ALTER COLUMN role_id DROP DEFAULT;

ALTER TABLE user_communities
ALTER COLUMN role_id SET NOT NULL;