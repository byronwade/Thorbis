-- ============================================================================
-- Add Purchase Order feature flags to company_settings
-- ============================================================================

ALTER TABLE company_settings
ADD COLUMN IF NOT EXISTS po_system_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS po_system_last_enabled_at TIMESTAMPTZ;

COMMENT ON COLUMN company_settings.po_system_enabled IS 'Whether the purchase order system is enabled for the company';
COMMENT ON COLUMN company_settings.po_system_last_enabled_at IS 'Timestamp of the last time the purchase order system state changed';

