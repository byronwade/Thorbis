-- Add missing columns to communication_email_inbound_routes
-- These columns are referenced in the application code but were missing from the original migration

ALTER TABLE communication_email_inbound_routes 
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT true;

-- Note: status column already exists in the original migration (line 27)
-- If it doesn't exist, uncomment the following line:
-- ALTER TABLE communication_email_inbound_routes ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- Update existing rows to have a default name
UPDATE communication_email_inbound_routes 
SET name = 'Inbound route for ' || route_address 
WHERE name IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN communication_email_inbound_routes.name IS 'Human-readable name for the inbound route';
COMMENT ON COLUMN communication_email_inbound_routes.enabled IS 'Whether this route is active and should receive emails';
