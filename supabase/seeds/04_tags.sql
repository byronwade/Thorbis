-- ============================================================================
-- SEED: Tags
-- ============================================================================
-- Creates system and custom tags for categorization
-- ============================================================================

DO $$
DECLARE
  v_company_id UUID := current_setting('app.current_company_id')::uuid;
BEGIN

  RAISE NOTICE 'Seeding Tags...';

  -- ============================================================================
  -- CUSTOMER TAGS
  -- ============================================================================

  INSERT INTO tags (company_id, name, slug, description, category, color, icon, is_system, is_active)
  VALUES
    (v_company_id, 'VIP Customer', 'vip-customer', 'High-value customer requiring priority service', 'customer', '#FFD700', 'star', false, true),
    (v_company_id, 'Commercial', 'commercial', 'Commercial customer account', 'customer', '#4ECDC4', 'briefcase', true, true),
    (v_company_id, 'Residential', 'residential', 'Residential customer account', 'customer', '#95E1D3', 'home', true, true),
    (v_company_id, 'New Customer', 'new-customer', 'Recently onboarded customer', 'customer', '#A8E6CF', 'user-plus', false, true),
    (v_company_id, 'Payment Issues', 'payment-issues', 'Customer with payment history issues', 'customer', '#FF6B6B', 'alert-circle', false, true),
    (v_company_id, 'Service Plan Member', 'service-plan', 'Customer with active maintenance plan', 'customer', '#90EE90', 'calendar-check', false, true);

  RAISE NOTICE '  ✓ Created 6 customer tags';

  -- ============================================================================
  -- JOB TAGS
  -- ============================================================================

  INSERT INTO tags (company_id, name, slug, description, category, color, icon, is_system, is_active)
  VALUES
    (v_company_id, 'Emergency', 'emergency', 'Emergency service call', 'job', '#FF4444', 'alert-triangle', true, true),
    (v_company_id, 'Warranty Work', 'warranty', 'Work covered under warranty', 'job', '#87CEEB', 'shield', false, true),
    (v_company_id, 'Follow-up Required', 'follow-up', 'Job requires follow-up visit', 'job', '#FFA500', 'clock', false, true),
    (v_company_id, 'Parts on Order', 'parts-order', 'Waiting for parts to arrive', 'job', '#FFE66D', 'package', false, true),
    (v_company_id, 'Change Order', 'change-order', 'Scope changed from original estimate', 'job', '#C7CEEA', 'edit', false, true),
    (v_company_id, 'First-Time Fix', 'first-time-fix', 'Completed on first visit', 'job', '#90EE90', 'check-circle', false, true),
    (v_company_id, 'Complex Job', 'complex', 'Requires specialized skills or equipment', 'job', '#9B59B6', 'tool', false, true);

  RAISE NOTICE '  ✓ Created 7 job tags';

  -- ============================================================================
  -- EQUIPMENT TAGS
  -- ============================================================================

  INSERT INTO tags (company_id, name, slug, description, category, color, icon, is_system, is_active)
  VALUES
    (v_company_id, 'Under Warranty', 'under-warranty', 'Equipment still under manufacturer warranty', 'equipment', '#87CEEB', 'shield-check', false, true),
    (v_company_id, 'End of Life', 'end-of-life', 'Equipment nearing replacement age', 'equipment', '#FF6B6B', 'alert-octagon', false, true),
    (v_company_id, 'High Efficiency', 'high-efficiency', 'High efficiency equipment', 'equipment', '#90EE90', 'trending-up', false, true),
    (v_company_id, 'Requires Monitoring', 'requires-monitoring', 'Equipment needs regular monitoring', 'equipment', '#FFA500', 'eye', false, true);

  RAISE NOTICE '  ✓ Created 4 equipment tags';

  -- ============================================================================
  -- GENERAL/STATUS TAGS
  -- ============================================================================

  INSERT INTO tags (company_id, name, slug, description, category, color, icon, is_system, is_active)
  VALUES
    (v_company_id, 'Urgent', 'urgent', 'Requires immediate attention', 'priority', '#FF4444', 'zap', true, true),
    (v_company_id, 'High Priority', 'high-priority', 'High priority item', 'priority', '#FFA500', 'arrow-up', true, true),
    (v_company_id, 'Normal Priority', 'normal-priority', 'Standard priority', 'priority', '#87CEEB', 'minus', true, true),
    (v_company_id, 'Low Priority', 'low-priority', 'Can be scheduled flexibly', 'priority', '#95E1D3', 'arrow-down', true, true),
    (v_company_id, 'Completed', 'completed', 'Work completed', 'status', '#90EE90', 'check-circle', true, true),
    (v_company_id, 'In Progress', 'in-progress', 'Work in progress', 'status', '#FFE66D', 'loader', true, true),
    (v_company_id, 'On Hold', 'on-hold', 'Temporarily paused', 'status', '#C7CEEA', 'pause-circle', true, true),
    (v_company_id, 'Cancelled', 'cancelled', 'Work cancelled', 'status', '#808080', 'x-circle', true, true);

  RAISE NOTICE '  ✓ Created 8 general/status tags';

  -- ============================================================================
  -- COMMUNICATION TAGS
  -- ============================================================================

  INSERT INTO tags (company_id, name, slug, description, category, color, icon, is_system, is_active)
  VALUES
    (v_company_id, 'Needs Response', 'needs-response', 'Communication requires response', 'general', '#FF6B6B', 'message-circle', false, true),
    (v_company_id, 'Follow-up', 'follow-up-comm', 'Follow-up communication', 'general', '#FFA500', 'corner-down-right', false, true),
    (v_company_id, 'Important', 'important', 'Important communication', 'general', '#FFD700', 'star', false, true);

  RAISE NOTICE '  ✓ Created 3 communication tags';

  -- ============================================================================
  -- SUMMARY
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '  Summary: Created 28 tags across categories';
  RAISE NOTICE '  - 6 Customer tags';
  RAISE NOTICE '  - 7 Job tags';
  RAISE NOTICE '  - 4 Equipment tags';
  RAISE NOTICE '  - 8 Priority/Status tags';
  RAISE NOTICE '  - 3 Communication tags';
  RAISE NOTICE '';

END $$;
