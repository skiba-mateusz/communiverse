ALTER TABLE communities
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE posts 
  ALTER COLUMN community_id DROP NOT NULL,
  ALTER COLUMN user_id DROP NOT NULL;