-- =====================================================================================
-- Notifications Seed Data
-- =====================================================================================
-- This file creates sample notifications for testing the notifications system
--
-- Usage:
--   Run this after setting up a test user to populate their notifications
--   Replace the user_id and company_id values with actual IDs from your database
-- =====================================================================================

-- IMPORTANT: Update these variables with actual user_id and company_id from your database
-- You can get these by running:
--   SELECT id FROM users LIMIT 1;
--   SELECT company_id FROM team_members WHERE user_id = '<your-user-id>' LIMIT 1;

DO $$
DECLARE
  test_user_id UUID;
  test_company_id UUID;
BEGIN
  -- Get the first user (you may want to specify a particular user)
  SELECT id INTO test_user_id FROM users LIMIT 1;

  -- Get the user's company
  SELECT company_id INTO test_company_id FROM team_members
  WHERE user_id = test_user_id AND status = 'active' LIMIT 1;

  -- Only insert if we found a user and company
  IF test_user_id IS NOT NULL AND test_company_id IS NOT NULL THEN

    -- Insert sample notifications
    INSERT INTO notifications (
      user_id,
      company_id,
      type,
      priority,
      title,
      message,
      read,
      action_url,
      action_label,
      metadata,
      created_at
    ) VALUES
    -- Recent payment notification (unread, high priority)
    (
      test_user_id,
      test_company_id,
      'payment',
      'high',
      'Payment Received',
      'Payment of $2,450 received from John''s HVAC Inc.',
      false,
      '/dashboard/finance/invoices',
      'View Invoice',
      '{"amount": 2450, "customer": "John''s HVAC Inc.", "invoice_id": "INV-001"}'::jsonb,
      NOW() - INTERVAL '5 minutes'
    ),

    -- Urgent job assignment (unread, urgent priority)
    (
      test_user_id,
      test_company_id,
      'job',
      'urgent',
      'Urgent Job Assignment',
      'Emergency service call assigned to you at 123 Main St.',
      false,
      '/dashboard/work',
      'View Job',
      '{"job_id": "JOB-123", "address": "123 Main St", "type": "emergency"}'::jsonb,
      NOW() - INTERVAL '15 minutes'
    ),

    -- New message (unread, medium priority)
    (
      test_user_id,
      test_company_id,
      'message',
      'medium',
      'New Message from Sarah Chen',
      'Can you provide an update on the HVAC installation project?',
      false,
      '/dashboard/communication',
      'Reply',
      '{"from": "Sarah Chen", "message_id": "MSG-789"}'::jsonb,
      NOW() - INTERVAL '30 minutes'
    ),

    -- Team member added (read, low priority)
    (
      test_user_id,
      test_company_id,
      'team',
      'low',
      'New Team Member',
      'Mike Johnson has joined your team as a technician.',
      true,
      '/dashboard/settings/team',
      'View Team',
      '{"member_name": "Mike Johnson", "role": "technician"}'::jsonb,
      NOW() - INTERVAL '2 hours'
    ),

    -- Equipment maintenance alert (read, high priority)
    (
      test_user_id,
      test_company_id,
      'alert',
      'high',
      'Equipment Maintenance Due',
      '3 vehicles require scheduled maintenance this week.',
      true,
      '/dashboard/work/equipment',
      'View Equipment',
      '{"vehicle_count": 3, "due_date": "2025-11-08"}'::jsonb,
      NOW() - INTERVAL '4 hours'
    ),

    -- System update (read, low priority)
    (
      test_user_id,
      test_company_id,
      'system',
      'low',
      'System Update Available',
      'New features and improvements are ready to install.',
      true,
      '/changelog',
      'View Changes',
      '{"version": "2.1.0", "features": ["Dark mode", "Performance improvements"]}'::jsonb,
      NOW() - INTERVAL '1 day'
    ),

    -- Invoice reminder (unread, medium priority)
    (
      test_user_id,
      test_company_id,
      'payment',
      'medium',
      'Invoice Payment Reminder',
      'Invoice #INV-456 payment is due in 3 days ($1,250.00).',
      false,
      '/dashboard/finance/invoices',
      'View Invoice',
      '{"invoice_id": "INV-456", "amount": 1250, "due_days": 3}'::jsonb,
      NOW() - INTERVAL '6 hours'
    ),

    -- Job completed (read, low priority)
    (
      test_user_id,
      test_company_id,
      'job',
      'low',
      'Job Completed',
      'Installation job at 456 Oak Ave has been marked as complete.',
      true,
      '/dashboard/work',
      'View Job',
      '{"job_id": "JOB-456", "address": "456 Oak Ave", "status": "completed"}'::jsonb,
      NOW() - INTERVAL '1 day'
    ),

    -- Schedule conflict (unread, high priority)
    (
      test_user_id,
      test_company_id,
      'alert',
      'high',
      'Schedule Conflict Detected',
      'You have overlapping appointments scheduled for tomorrow.',
      false,
      '/dashboard/work/schedule',
      'View Schedule',
      '{"conflict_date": "2025-11-02", "jobs_affected": 2}'::jsonb,
      NOW() - INTERVAL '1 hour'
    ),

    -- Customer review (unread, medium priority)
    (
      test_user_id,
      test_company_id,
      'message',
      'medium',
      'New Customer Review',
      'Sarah Martinez left a 5-star review for your recent service.',
      false,
      '/dashboard/customers',
      'View Review',
      '{"customer": "Sarah Martinez", "rating": 5, "job_id": "JOB-789"}'::jsonb,
      NOW() - INTERVAL '3 hours'
    );

    RAISE NOTICE 'Successfully inserted 10 sample notifications for user % in company %', test_user_id, test_company_id;
  ELSE
    RAISE EXCEPTION 'Could not find a valid user and company to create notifications for';
  END IF;
END $$;

-- =====================================================================================
-- Verify inserted data
-- =====================================================================================

-- Show the count of notifications per type
SELECT
  type,
  priority,
  read,
  COUNT(*) as count
FROM notifications
GROUP BY type, priority, read
ORDER BY type, priority, read;

-- Show recent notifications
SELECT
  type,
  priority,
  title,
  read,
  created_at
FROM notifications
ORDER BY created_at DESC
LIMIT 10;
