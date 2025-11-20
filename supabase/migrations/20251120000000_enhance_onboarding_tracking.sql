-- Enhanced Onboarding Tracking Migration
-- Creates tables and columns for comprehensive onboarding flow

-- ============================================================================
-- 1. Extend companies table with branding and onboarding fields
-- ============================================================================

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS onboarding_step_completed JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS onboarding_completion_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS brand_primary_color VARCHAR(7) DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS brand_secondary_color VARCHAR(7) DEFAULT '#1e40af',
ADD COLUMN IF NOT EXISTS brand_accent_color VARCHAR(7) DEFAULT '#60a5fa',
ADD COLUMN IF NOT EXISTS brand_font VARCHAR(50) DEFAULT 'inter',
ADD COLUMN IF NOT EXISTS logo_square_url TEXT,
ADD COLUMN IF NOT EXISTS business_timezone VARCHAR(100) DEFAULT 'America/New_York';

-- Add indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_companies_onboarding_completion
  ON companies(onboarding_completion_percentage)
  WHERE onboarding_completed_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_companies_onboarding_completed
  ON companies(onboarding_completed_at)
  WHERE onboarding_completed_at IS NOT NULL;

-- ============================================================================
-- 2. Create onboarding_step_data table for detailed step tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS onboarding_step_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL CHECK (step_number >= 1 AND step_number <= 20),
  step_name VARCHAR(100) NOT NULL,
  step_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ,
  skipped BOOLEAN DEFAULT false,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_company_step UNIQUE(company_id, step_number)
);

-- Indexes for onboarding_step_data
CREATE INDEX idx_onboarding_step_company
  ON onboarding_step_data(company_id);

CREATE INDEX idx_onboarding_step_completion
  ON onboarding_step_data(company_id, completed_at)
  WHERE completed_at IS NOT NULL;

CREATE INDEX idx_onboarding_step_skipped
  ON onboarding_step_data(company_id, skipped)
  WHERE skipped = true;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_onboarding_step_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_onboarding_step_updated_at
  BEFORE UPDATE ON onboarding_step_data
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_step_updated_at();

-- ============================================================================
-- 3. Create business_hours table
-- ============================================================================

CREATE TABLE IF NOT EXISTS business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN (
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  )),
  is_open BOOLEAN DEFAULT true,
  open_time TIME,
  close_time TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_company_day UNIQUE(company_id, day_of_week)
);

CREATE INDEX idx_business_hours_company
  ON business_hours(company_id);

CREATE INDEX idx_business_hours_open_days
  ON business_hours(company_id, day_of_week)
  WHERE is_open = true;

-- Updated_at trigger
CREATE TRIGGER trigger_update_business_hours_updated_at
  BEFORE UPDATE ON business_hours
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_step_updated_at();

-- ============================================================================
-- 4. Create after_hours_settings table
-- ============================================================================

CREATE TABLE IF NOT EXISTS after_hours_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT false,
  message TEXT,
  voicemail_enabled BOOLEAN DEFAULT true,
  voicemail_greeting TEXT,
  emergency_number VARCHAR(20),
  emergency_enabled BOOLEAN DEFAULT false,
  auto_reply_sms_enabled BOOLEAN DEFAULT false,
  auto_reply_sms_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_company_after_hours UNIQUE(company_id)
);

CREATE INDEX idx_after_hours_company
  ON after_hours_settings(company_id);

-- Updated_at trigger
CREATE TRIGGER trigger_update_after_hours_updated_at
  BEFORE UPDATE ON after_hours_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_step_updated_at();

-- ============================================================================
-- 5. Create business_verification table
-- ============================================================================

CREATE TABLE IF NOT EXISTS business_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- EIN Verification
  ein_verified BOOLEAN DEFAULT false,
  ein_verified_at TIMESTAMPTZ,
  ein_verification_method VARCHAR(50),

  -- Address Verification
  address_verified BOOLEAN DEFAULT false,
  address_verified_at TIMESTAMPTZ,
  address_verification_method VARCHAR(50),
  usps_verification_data JSONB,

  -- License Verification
  license_verified BOOLEAN DEFAULT false,
  license_verified_at TIMESTAMPTZ,
  license_verification_method VARCHAR(50),
  license_number VARCHAR(100),
  license_state VARCHAR(2),
  license_expiration DATE,

  -- Insurance Verification
  insurance_verified BOOLEAN DEFAULT false,
  insurance_verified_at TIMESTAMPTZ,
  general_liability_carrier VARCHAR(200),
  general_liability_policy VARCHAR(100),
  general_liability_coverage DECIMAL(12,2),
  general_liability_expiration DATE,
  workers_comp_carrier VARCHAR(200),
  workers_comp_policy VARCHAR(100),
  workers_comp_expiration DATE,

  -- Bank Account Verification
  bank_account_verified BOOLEAN DEFAULT false,
  bank_account_verified_at TIMESTAMPTZ,
  bank_verification_method VARCHAR(50),

  -- Documents
  articles_of_incorporation_url TEXT,
  w9_form_url TEXT,
  insurance_certificate_url TEXT,
  contractor_license_url TEXT,

  -- Overall Status
  overall_status VARCHAR(20) DEFAULT 'pending' CHECK (
    overall_status IN ('pending', 'partial', 'verified', 'failed')
  ),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_company_verification UNIQUE(company_id)
);

CREATE INDEX idx_business_verification_company
  ON business_verification(company_id);

CREATE INDEX idx_business_verification_status
  ON business_verification(overall_status);

-- Updated_at trigger
CREATE TRIGGER trigger_update_business_verification_updated_at
  BEFORE UPDATE ON business_verification
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_step_updated_at();

-- ============================================================================
-- 6. Create ten_dlc_registration table
-- ============================================================================

CREATE TABLE IF NOT EXISTS ten_dlc_registration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Brand Registration
  brand_id VARCHAR(100),
  brand_name VARCHAR(200),
  brand_status VARCHAR(20) DEFAULT 'pending' CHECK (
    brand_status IN ('pending', 'reviewing', 'approved', 'rejected', 'suspended')
  ),
  brand_score INTEGER CHECK (brand_score >= 0 AND brand_score <= 100),
  brand_registered_at TIMESTAMPTZ,
  brand_approved_at TIMESTAMPTZ,

  -- Campaign Registration
  campaign_id VARCHAR(100),
  campaign_use_case VARCHAR(50),
  campaign_status VARCHAR(20) DEFAULT 'pending' CHECK (
    campaign_status IN ('pending', 'reviewing', 'approved', 'rejected', 'suspended')
  ),
  campaign_registered_at TIMESTAMPTZ,
  campaign_approved_at TIMESTAMPTZ,

  -- Throughput & Limits
  daily_limit INTEGER,
  per_minute_limit INTEGER,

  -- Carrier Fees (per message)
  att_fee DECIMAL(6,4),
  tmobile_fee DECIMAL(6,4),
  verizon_fee DECIMAL(6,4),

  -- TCR Data
  tcr_brand_id VARCHAR(100),
  tcr_campaign_id VARCHAR(100),

  -- Registration Data
  registration_data JSONB,

  -- Rejection Info
  rejection_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_company_ten_dlc UNIQUE(company_id)
);

CREATE INDEX idx_ten_dlc_company
  ON ten_dlc_registration(company_id);

CREATE INDEX idx_ten_dlc_brand_status
  ON ten_dlc_registration(brand_status);

CREATE INDEX idx_ten_dlc_campaign_status
  ON ten_dlc_registration(campaign_status);

-- Updated_at trigger
CREATE TRIGGER trigger_update_ten_dlc_updated_at
  BEFORE UPDATE ON ten_dlc_registration
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_step_updated_at();

-- ============================================================================
-- 7. Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE onboarding_step_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE after_hours_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE ten_dlc_registration ENABLE ROW LEVEL SECURITY;

-- Helper function to check company membership
CREATE OR REPLACE FUNCTION user_has_company_access(p_company_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.company_id = p_company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- onboarding_step_data policies
CREATE POLICY "Company members can view onboarding steps"
  ON onboarding_step_data
  FOR SELECT
  USING (user_has_company_access(company_id));

CREATE POLICY "Company members can insert onboarding steps"
  ON onboarding_step_data
  FOR INSERT
  WITH CHECK (user_has_company_access(company_id));

CREATE POLICY "Company members can update onboarding steps"
  ON onboarding_step_data
  FOR UPDATE
  USING (user_has_company_access(company_id))
  WITH CHECK (user_has_company_access(company_id));

CREATE POLICY "Company members can delete onboarding steps"
  ON onboarding_step_data
  FOR DELETE
  USING (user_has_company_access(company_id));

-- business_hours policies
CREATE POLICY "Company members can manage business hours"
  ON business_hours
  FOR ALL
  USING (user_has_company_access(company_id))
  WITH CHECK (user_has_company_access(company_id));

-- after_hours_settings policies
CREATE POLICY "Company members can manage after hours settings"
  ON after_hours_settings
  FOR ALL
  USING (user_has_company_access(company_id))
  WITH CHECK (user_has_company_access(company_id));

-- business_verification policies
CREATE POLICY "Company members can view business verification"
  ON business_verification
  FOR SELECT
  USING (user_has_company_access(company_id));

CREATE POLICY "Company members can update business verification"
  ON business_verification
  FOR ALL
  USING (user_has_company_access(company_id))
  WITH CHECK (user_has_company_access(company_id));

-- ten_dlc_registration policies
CREATE POLICY "Company members can view 10-DLC registration"
  ON ten_dlc_registration
  FOR SELECT
  USING (user_has_company_access(company_id));

CREATE POLICY "Company members can manage 10-DLC registration"
  ON ten_dlc_registration
  FOR ALL
  USING (user_has_company_access(company_id))
  WITH CHECK (user_has_company_access(company_id));

-- ============================================================================
-- 8. Helper Functions
-- ============================================================================

-- Function to calculate onboarding completion percentage
CREATE OR REPLACE FUNCTION calculate_onboarding_completion(p_company_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_completed_steps INTEGER;
  v_total_steps INTEGER := 12; -- Total number of onboarding steps
  v_percentage INTEGER;
BEGIN
  -- Count completed steps
  SELECT COUNT(*)
  INTO v_completed_steps
  FROM onboarding_step_data
  WHERE company_id = p_company_id
    AND completed_at IS NOT NULL
    AND skipped = false;

  -- Calculate percentage
  v_percentage := ROUND((v_completed_steps::DECIMAL / v_total_steps) * 100);

  -- Update companies table
  UPDATE companies
  SET onboarding_completion_percentage = v_percentage
  WHERE id = p_company_id;

  RETURN v_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark onboarding as complete
CREATE OR REPLACE FUNCTION complete_onboarding(p_company_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_percentage INTEGER;
BEGIN
  -- Calculate completion percentage
  v_percentage := calculate_onboarding_completion(p_company_id);

  -- Only complete if at least 75% done
  IF v_percentage >= 75 THEN
    UPDATE companies
    SET
      onboarding_completed_at = NOW(),
      onboarding_completion_percentage = 100
    WHERE id = p_company_id
      AND onboarding_completed_at IS NULL;

    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 9. Seed default business hours for existing companies
-- ============================================================================

-- Insert default business hours for companies that don't have them yet
INSERT INTO business_hours (company_id, day_of_week, is_open, open_time, close_time)
SELECT
  c.id,
  day,
  CASE
    WHEN day IN ('saturday', 'sunday') THEN false
    ELSE true
  END,
  CASE
    WHEN day IN ('saturday', 'sunday') THEN NULL
    ELSE '09:00'::TIME
  END,
  CASE
    WHEN day IN ('saturday', 'sunday') THEN NULL
    ELSE '17:00'::TIME
  END
FROM companies c
CROSS JOIN (
  VALUES ('monday'), ('tuesday'), ('wednesday'), ('thursday'),
         ('friday'), ('saturday'), ('sunday')
) AS days(day)
WHERE NOT EXISTS (
  SELECT 1 FROM business_hours bh
  WHERE bh.company_id = c.id AND bh.day_of_week = day
)
ON CONFLICT (company_id, day_of_week) DO NOTHING;

-- ============================================================================
-- 10. Comments for documentation
-- ============================================================================

COMMENT ON TABLE onboarding_step_data IS 'Tracks detailed progress through onboarding steps including data saved at each step';
COMMENT ON TABLE business_hours IS 'Stores weekly operating hours for each company';
COMMENT ON TABLE after_hours_settings IS 'Configuration for after-hours behavior (voicemail, emergency, auto-reply)';
COMMENT ON TABLE business_verification IS 'Tracks business verification status including EIN, address, license, insurance, and documents';
COMMENT ON TABLE ten_dlc_registration IS '10-DLC (Application-to-Person) SMS registration with The Campaign Registry for carrier compliance';

COMMENT ON COLUMN companies.onboarding_step_completed IS 'JSONB map of completed steps {step1: true, step2: false, ...}';
COMMENT ON COLUMN companies.onboarding_completion_percentage IS 'Calculated percentage of onboarding completion (0-100)';
COMMENT ON COLUMN companies.brand_primary_color IS 'Primary brand color in hex format (#RRGGBB)';
COMMENT ON COLUMN companies.brand_secondary_color IS 'Secondary brand color in hex format (#RRGGBB)';
COMMENT ON COLUMN companies.brand_accent_color IS 'Accent brand color in hex format (#RRGGBB)';
COMMENT ON COLUMN companies.brand_font IS 'Selected font family (inter, roboto, montserrat, lato, playfair)';
COMMENT ON COLUMN companies.logo_square_url IS 'Square variant of logo for favicons and mobile apps';
COMMENT ON COLUMN companies.business_timezone IS 'IANA timezone identifier (e.g., America/New_York)';

-- ============================================================================
-- Migration Complete
-- ============================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
