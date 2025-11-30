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

-- Add RLS (Row Level Security) if using Supabase
ALTER TABLE processed_webhooks ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can insert/read webhook events
-- This table is for internal webhook tracking, not exposed to users
CREATE POLICY "Service role only" ON processed_webhooks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Optional: Cleanup cron job to remove old processed webhooks (keeps table size manageable)
-- Run this via pg_cron or as a scheduled job
-- 
-- DELETE FROM processed_webhooks
-- WHERE processed_at < NOW() - INTERVAL '90 days';

-- How to use:
-- ===========
-- The webhook-deduplication.ts utility will:
-- 1. Check if (provider, event_id) exists in this table
-- 2. If exists: skip processing (return cached response)
-- 3. If not exists: process webhook and insert record
