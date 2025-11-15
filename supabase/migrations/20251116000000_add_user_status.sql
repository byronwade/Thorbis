-- Add status field to users table
-- This allows users to set their availability status (online, available, busy)

-- Create enum type for user status
CREATE TYPE user_status AS ENUM ('online', 'available', 'busy');

-- Add status column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS status user_status DEFAULT 'online' NOT NULL;

-- Add index for faster status queries
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Add comment explaining the status field
COMMENT ON COLUMN users.status IS 'User availability status: online (default), available (ready for work), busy (do not disturb)';

-- Update existing users to have default 'online' status
UPDATE users SET status = 'online' WHERE status IS NULL;

