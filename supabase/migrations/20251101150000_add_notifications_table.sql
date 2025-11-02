-- =====================================================================================
-- Notifications System Migration
-- =====================================================================================
-- This migration creates the core notifications table for in-app notifications
-- and sets up proper Row Level Security (RLS) policies.
--
-- Tables:
--   - notifications: Stores all in-app notifications for users
--
-- Security:
--   - RLS enabled on all tables
--   - Users can only see their own notifications
--   - Service role can create notifications for any user
-- =====================================================================================

-- =====================================================================================
-- Create notifications table
-- =====================================================================================

CREATE TABLE IF NOT EXISTS notifications (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User and company relationships
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Notification content
  type TEXT NOT NULL CHECK (type IN ('message', 'alert', 'payment', 'job', 'team', 'system')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Read status
  read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,

  -- Optional action
  action_url TEXT,
  action_label TEXT,

  -- Additional metadata (JSON for flexibility)
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Indexes for common queries
  CONSTRAINT notifications_user_company_check CHECK (user_id IS NOT NULL AND company_id IS NOT NULL)
);

-- =====================================================================================
-- Create indexes for performance
-- =====================================================================================

-- Index for fetching user's notifications (most common query)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Index for company-wide notifications
CREATE INDEX IF NOT EXISTS idx_notifications_company_id ON notifications(company_id);

-- Index for filtering by read status
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Composite index for fetching unread notifications for a user (very common)
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;

-- Index for sorting by creation date (most recent first)
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Composite index for user's notifications ordered by date
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);

-- Index for notification type (for filtering)
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Index for notification priority (for filtering)
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);

-- =====================================================================================
-- Enable Row Level Security (RLS)
-- =====================================================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================================================
-- RLS Policies for notifications table
-- =====================================================================================

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
  );

-- Policy: Users can update their own notifications (mark as read, etc.)
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
  )
  WITH CHECK (
    auth.uid() = user_id
  );

-- Policy: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id
  );

-- Policy: Service role can insert notifications for any user (for system-generated notifications)
CREATE POLICY "Service role can insert notifications"
  ON notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: Authenticated users can insert notifications (for manual triggers)
-- This allows users to create notifications programmatically
CREATE POLICY "Authenticated users can insert notifications for their company"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User must belong to the company via team_members table
    company_id IN (
      SELECT tm.company_id
      FROM team_members tm
      WHERE tm.user_id = auth.uid()
      AND tm.status = 'active'
    )
  );

-- =====================================================================================
-- Create trigger to update updated_at timestamp
-- =====================================================================================

CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- =====================================================================================
-- Create trigger to set read_at timestamp when notification is marked as read
-- =====================================================================================

CREATE OR REPLACE FUNCTION update_notifications_read_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set read_at if read changed from false to true
  IF NEW.read = true AND (OLD.read = false OR OLD.read IS NULL) THEN
    NEW.read_at = NOW();
  END IF;

  -- If unmarking as read, clear read_at
  IF NEW.read = false AND OLD.read = true THEN
    NEW.read_at = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notifications_read_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  WHEN (NEW.read IS DISTINCT FROM OLD.read)
  EXECUTE FUNCTION update_notifications_read_at();

-- =====================================================================================
-- Create function to mark all user's notifications as read (bulk operation)
-- =====================================================================================

CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE notifications
  SET
    read = true,
    read_at = NOW(),
    updated_at = NOW()
  WHERE
    user_id = p_user_id
    AND read = false;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION mark_all_notifications_read(UUID) TO authenticated;

-- =====================================================================================
-- Create function to get unread notification count for a user
-- =====================================================================================

CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO unread_count
  FROM notifications
  WHERE
    user_id = p_user_id
    AND read = false;

  RETURN COALESCE(unread_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_unread_notification_count(UUID) TO authenticated;

-- =====================================================================================
-- Create function to clean up old read notifications (older than 90 days)
-- This can be called periodically via a cron job
-- =====================================================================================

CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notifications
  WHERE
    read = true
    AND read_at < (NOW() - INTERVAL '90 days');

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service role only (for cron jobs)
GRANT EXECUTE ON FUNCTION cleanup_old_notifications() TO service_role;

-- =====================================================================================
-- Add comments for documentation
-- =====================================================================================

COMMENT ON TABLE notifications IS 'Stores in-app notifications for users';
COMMENT ON COLUMN notifications.id IS 'Unique identifier for the notification';
COMMENT ON COLUMN notifications.user_id IS 'User who will receive the notification';
COMMENT ON COLUMN notifications.company_id IS 'Company context for the notification';
COMMENT ON COLUMN notifications.type IS 'Type of notification: message, alert, payment, job, team, system';
COMMENT ON COLUMN notifications.priority IS 'Priority level: low, medium, high, urgent';
COMMENT ON COLUMN notifications.title IS 'Notification title (short)';
COMMENT ON COLUMN notifications.message IS 'Notification message (detailed)';
COMMENT ON COLUMN notifications.read IS 'Whether the notification has been read';
COMMENT ON COLUMN notifications.read_at IS 'Timestamp when notification was marked as read';
COMMENT ON COLUMN notifications.action_url IS 'Optional URL for notification action button';
COMMENT ON COLUMN notifications.action_label IS 'Optional label for notification action button';
COMMENT ON COLUMN notifications.metadata IS 'Additional metadata in JSON format';
COMMENT ON COLUMN notifications.created_at IS 'Timestamp when notification was created';
COMMENT ON COLUMN notifications.updated_at IS 'Timestamp when notification was last updated';
