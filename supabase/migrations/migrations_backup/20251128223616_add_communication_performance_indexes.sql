-- Performance indexes for communications table queries
-- These composite indexes optimize common query patterns in the communication inbox

-- Index for filtering communications by company, deleted status, channel, and creation time
-- Used in: getCommunications, getCommunicationsAction
CREATE INDEX IF NOT EXISTS idx_communications_company_deleted_channel_created
ON communications(company_id, deleted_at, channel, created_at DESC)
WHERE deleted_at IS NULL;

-- Index for filtering by company, mailbox owner, archived status, and creation time
-- Used for: Personal inbox queries
CREATE INDEX IF NOT EXISTS idx_communications_company_mailbox_archived_created
ON communications(company_id, mailbox_owner_id, is_archived, created_at DESC)
WHERE deleted_at IS NULL;

-- Index for filtering by company, assigned user, status, and creation time
-- Used for: Assigned communications queries
CREATE INDEX IF NOT EXISTS idx_communications_company_assigned_status_created
ON communications(company_id, assigned_to, status, created_at DESC)
WHERE deleted_at IS NULL AND assigned_to IS NOT NULL;

-- Index for filtering by company, type, direction, and creation time
-- Used for: Type-filtered queries (email, SMS, call, voicemail)
CREATE INDEX IF NOT EXISTS idx_communications_company_type_direction_created
ON communications(company_id, type, direction, created_at DESC)
WHERE deleted_at IS NULL;

-- Index for searching communications by subject, body, from_address, to_address
-- Used for: Search queries
CREATE INDEX IF NOT EXISTS idx_communications_search_text
ON communications(company_id, created_at DESC)
WHERE deleted_at IS NULL;

-- Add GIN index for tags JSONB column to support fast tag filtering
-- Used for: Starred folder, team channel filtering
CREATE INDEX IF NOT EXISTS idx_communications_tags_gin
ON communications USING GIN(tags)
WHERE deleted_at IS NULL AND tags IS NOT NULL;

-- Composite index for team channel queries
-- Used for: Teams channel message queries
CREATE INDEX IF NOT EXISTS idx_communications_team_channels
ON communications(company_id, channel, type, created_at ASC)
WHERE deleted_at IS NULL AND channel = 'teams' AND type = 'sms';

-- Index for visibility scope and category filtering
-- Used for: Permission-based filtering
CREATE INDEX IF NOT EXISTS idx_communications_visibility_category
ON communications(company_id, visibility_scope, category, created_at DESC)
WHERE deleted_at IS NULL;


