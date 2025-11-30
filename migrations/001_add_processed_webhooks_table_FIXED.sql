-- Webhook Event Deduplication Table
-- 
-- This table tracks processed webhook events to prevent duplicate processing
-- when providers (Stripe, SendGrid, etc.) retry webhook deliveries.

CREATE TABLE IF NOT EXISTS processed_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure we never process the same event twice
  CONSTRAINT unique_webhook_event UNIQUE (provider, event_id)
);

-- Index for fast lookups when checking if event was processed
CREATE INDEX IF NOT EXISTS idx_processed_webhooks_provider_event
  ON processed_webhooks(provider, event_id);

-- Index for cleanup queries (optional, for removing old entries)
CREATE INDEX IF NOT EXISTS idx_processed_webhooks_processed_at
  ON processed_webhooks(processed_at);

-- Add RLS (Row Level Security)
ALTER TABLE processed_webhooks ENABLE ROW LEVEL SECURITY;

-- Policy: Block all access from anon/authenticated users
-- Service role bypasses RLS automatically, so it can still access this table
-- This ensures webhook tracking is only accessible via service role
CREATE POLICY "Service role only" ON processed_webhooks
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- How to use:
-- ===========
-- The webhook-deduplication.ts utility will:
-- 1. Check if (provider, event_id) exists in this table
-- 2. If exists: skip processing (return cached response)
-- 3. If not exists: process webhook and insert record

