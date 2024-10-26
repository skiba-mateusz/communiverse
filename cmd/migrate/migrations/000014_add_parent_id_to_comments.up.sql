ALTER TABLE comments
ADD COLUMN parent_id int REFERENCES comments (id) ON DELETE CASCADE;