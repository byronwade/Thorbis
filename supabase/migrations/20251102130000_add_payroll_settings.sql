-- ============================================================================
-- PAYROLL SETTINGS MIGRATION
-- Field Service Management - Technician Payroll System
-- ============================================================================

-- ============================================================================
-- OVERTIME SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS payroll_overtime_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Overtime Rules
  overtime_enabled BOOLEAN DEFAULT true,
  daily_threshold_hours DECIMAL(4,2) DEFAULT 8.00,
  weekly_threshold_hours DECIMAL(4,2) DEFAULT 40.00,
  consecutive_days_threshold INTEGER DEFAULT 7,

  -- Rate Multipliers
  daily_overtime_multiplier DECIMAL(4,2) DEFAULT 1.5,
  weekly_overtime_multiplier DECIMAL(4,2) DEFAULT 1.5,
  double_time_multiplier DECIMAL(4,2) DEFAULT 2.0,

  -- Double Time Rules
  double_time_enabled BOOLEAN DEFAULT false,
  double_time_after_hours DECIMAL(4,2) DEFAULT 12.00,
  double_time_on_seventh_day BOOLEAN DEFAULT false,

  -- Holiday & Weekend Rules
  weekend_overtime_enabled BOOLEAN DEFAULT false,
  saturday_multiplier DECIMAL(4,2) DEFAULT 1.5,
  sunday_multiplier DECIMAL(4,2) DEFAULT 2.0,
  holiday_multiplier DECIMAL(4,2) DEFAULT 2.5,

  -- Approval & Tracking
  require_overtime_approval BOOLEAN DEFAULT true,
  auto_calculate_overtime BOOLEAN DEFAULT true,
  track_by_job BOOLEAN DEFAULT true,
  track_by_day BOOLEAN DEFAULT true,

  -- Notifications
  notify_approaching_overtime BOOLEAN DEFAULT true,
  overtime_threshold_notification_hours DECIMAL(4,2) DEFAULT 7.50,
  notify_managers_on_overtime BOOLEAN DEFAULT true,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),

  UNIQUE(company_id)
);

-- ============================================================================
-- BONUS SETTINGS & RULES
-- ============================================================================

CREATE TABLE IF NOT EXISTS payroll_bonus_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Bonus Details
  bonus_name VARCHAR(255) NOT NULL,
  bonus_type VARCHAR(50) NOT NULL CHECK (bonus_type IN (
    'performance', 'completion', 'customer_satisfaction',
    'referral', 'safety', 'revenue_target', 'custom'
  )),
  description TEXT,
  is_active BOOLEAN DEFAULT true,

  -- Amount Configuration
  amount_type VARCHAR(50) NOT NULL CHECK (amount_type IN ('fixed', 'percentage', 'tiered')),
  fixed_amount DECIMAL(10,2),
  percentage_of VARCHAR(50) CHECK (percentage_of IN ('job_revenue', 'job_profit', 'base_pay', 'null')),
  percentage_value DECIMAL(5,2),

  -- Eligibility
  eligible_roles JSONB DEFAULT '[]', -- Array of role IDs
  eligible_departments JSONB DEFAULT '[]', -- Array of department IDs
  min_jobs_completed INTEGER,
  min_revenue_generated DECIMAL(10,2),
  min_customer_rating DECIMAL(3,2),

  -- Timing
  payout_frequency VARCHAR(50) DEFAULT 'per_job' CHECK (payout_frequency IN (
    'per_job', 'weekly', 'biweekly', 'monthly', 'quarterly', 'annually'
  )),
  payout_delay_days INTEGER DEFAULT 0,
  effective_start_date DATE,
  effective_end_date DATE,

  -- Conditions (JSONB for complex rules)
  conditions JSONB DEFAULT '{}',

  -- Audit
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- Bonus Tiers (for tiered bonuses)
CREATE TABLE IF NOT EXISTS payroll_bonus_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bonus_rule_id UUID NOT NULL REFERENCES payroll_bonus_rules(id) ON DELETE CASCADE,

  tier_level INTEGER NOT NULL,
  min_value DECIMAL(10,2) NOT NULL,
  max_value DECIMAL(10,2),
  bonus_amount DECIMAL(10,2) NOT NULL,

  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(bonus_rule_id, tier_level)
);

-- ============================================================================
-- CALLBACK PAY SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS payroll_callback_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- General Settings
  callbacks_enabled BOOLEAN DEFAULT true,
  auto_detect_callbacks BOOLEAN DEFAULT true,

  -- Callback Definition
  callback_window_start TIME DEFAULT '18:00:00',
  callback_window_end TIME DEFAULT '06:00:00',
  include_weekends BOOLEAN DEFAULT true,
  include_holidays BOOLEAN DEFAULT true,

  -- Rate Configuration
  rate_type VARCHAR(50) DEFAULT 'multiplier' CHECK (rate_type IN ('multiplier', 'fixed', 'hourly')),
  after_hours_multiplier DECIMAL(4,2) DEFAULT 1.5,
  weekend_multiplier DECIMAL(4,2) DEFAULT 1.75,
  holiday_multiplier DECIMAL(4,2) DEFAULT 2.0,
  emergency_multiplier DECIMAL(4,2) DEFAULT 2.5,

  fixed_callback_rate DECIMAL(10,2),
  hourly_callback_rate DECIMAL(10,2),

  -- Minimum Guarantees
  minimum_callback_hours DECIMAL(4,2) DEFAULT 2.00,
  minimum_callback_pay DECIMAL(10,2),

  -- Response Time Bonuses
  response_time_bonus_enabled BOOLEAN DEFAULT false,
  response_time_threshold_minutes INTEGER DEFAULT 30,
  response_time_bonus_amount DECIMAL(10,2),

  -- Approval & Tracking
  require_callback_approval BOOLEAN DEFAULT true,
  require_customer_confirmation BOOLEAN DEFAULT false,
  track_response_time BOOLEAN DEFAULT true,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),

  UNIQUE(company_id)
);

-- ============================================================================
-- COMMISSION SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS payroll_commission_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Commission Details
  rule_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,

  -- Commission Basis
  commission_basis VARCHAR(50) NOT NULL CHECK (commission_basis IN (
    'job_revenue', 'job_profit', 'product_sales',
    'service_agreement_sales', 'membership_sales', 'upsells'
  )),

  -- Rate Type
  rate_type VARCHAR(50) NOT NULL CHECK (rate_type IN ('flat_percentage', 'tiered', 'progressive')),
  flat_percentage DECIMAL(5,2),

  -- Eligibility
  eligible_roles JSONB DEFAULT '[]',
  eligible_departments JSONB DEFAULT '[]',
  eligible_job_types JSONB DEFAULT '[]',
  min_job_value DECIMAL(10,2),

  -- Payment Terms
  payout_frequency VARCHAR(50) DEFAULT 'monthly' CHECK (payout_frequency IN (
    'per_job', 'weekly', 'biweekly', 'monthly', 'quarterly'
  )),
  payout_timing VARCHAR(50) DEFAULT 'on_payment' CHECK (payout_timing IN (
    'on_job_completion', 'on_invoice', 'on_payment', 'on_full_payment'
  )),

  -- Splits & Overrides
  allow_commission_splits BOOLEAN DEFAULT true,
  primary_technician_percentage DECIMAL(5,2) DEFAULT 100.00,

  -- Conditions
  conditions JSONB DEFAULT '{}',
  effective_start_date DATE,
  effective_end_date DATE,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- Commission Tiers
CREATE TABLE IF NOT EXISTS payroll_commission_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_rule_id UUID NOT NULL REFERENCES payroll_commission_rules(id) ON DELETE CASCADE,

  tier_level INTEGER NOT NULL,
  min_amount DECIMAL(10,2) NOT NULL,
  max_amount DECIMAL(10,2),
  commission_percentage DECIMAL(5,2) NOT NULL,

  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(commission_rule_id, tier_level)
);

-- ============================================================================
-- PAYROLL DEDUCTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS payroll_deduction_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Deduction Details
  deduction_name VARCHAR(255) NOT NULL,
  deduction_category VARCHAR(50) NOT NULL CHECK (deduction_category IN (
    'health_insurance', 'dental_insurance', 'vision_insurance',
    'life_insurance', 'disability_insurance', '401k', 'retirement',
    'hsa', 'fsa', 'garnishment', 'child_support', 'tax_levy',
    'uniform', 'tools', 'advance_repayment', 'custom'
  )),
  description TEXT,
  is_active BOOLEAN DEFAULT true,

  -- Amount Configuration
  amount_type VARCHAR(50) NOT NULL CHECK (amount_type IN ('fixed', 'percentage')),
  fixed_amount DECIMAL(10,2),
  percentage_of_gross DECIMAL(5,2),

  -- Limits
  min_amount DECIMAL(10,2),
  max_amount DECIMAL(10,2),
  annual_limit DECIMAL(10,2),

  -- Frequency
  deduction_frequency VARCHAR(50) DEFAULT 'per_paycheck' CHECK (deduction_frequency IN (
    'per_paycheck', 'weekly', 'biweekly', 'monthly', 'quarterly', 'annually', 'one_time'
  )),

  -- Tax Treatment
  pre_tax BOOLEAN DEFAULT false,
  affects_overtime_calculation BOOLEAN DEFAULT false,

  -- Eligibility
  eligible_roles JSONB DEFAULT '[]',
  requires_enrollment BOOLEAN DEFAULT true,

  -- Legal
  is_court_ordered BOOLEAN DEFAULT false,
  priority_order INTEGER DEFAULT 100,

  -- Timing
  effective_start_date DATE,
  effective_end_date DATE,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- Employee Deduction Enrollments
CREATE TABLE IF NOT EXISTS payroll_employee_deductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deduction_type_id UUID NOT NULL REFERENCES payroll_deduction_types(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,

  -- Override amounts (if different from default)
  override_amount DECIMAL(10,2),
  override_percentage DECIMAL(5,2),

  -- Status
  is_active BOOLEAN DEFAULT true,
  enrollment_date DATE NOT NULL,
  termination_date DATE,

  -- Tracking
  total_deducted_to_date DECIMAL(10,2) DEFAULT 0.00,
  remaining_balance DECIMAL(10,2),

  -- Audit
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(deduction_type_id, team_member_id)
);

-- ============================================================================
-- MATERIAL DEDUCTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS payroll_material_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- General Settings
  material_tracking_enabled BOOLEAN DEFAULT true,
  deduct_from_pay BOOLEAN DEFAULT false,

  -- Deduction Rules
  deduction_basis VARCHAR(50) DEFAULT 'cost' CHECK (deduction_basis IN ('cost', 'retail', 'custom')),
  markup_for_deduction DECIMAL(5,2) DEFAULT 0.00,

  -- Limits & Thresholds
  max_deduction_per_paycheck_percentage DECIMAL(5,2) DEFAULT 25.00,
  max_deduction_per_paycheck_amount DECIMAL(10,2),
  require_approval_over_amount DECIMAL(10,2) DEFAULT 100.00,

  -- Accountability
  require_material_acknowledgment BOOLEAN DEFAULT true,
  require_photo_evidence BOOLEAN DEFAULT false,
  track_wastage BOOLEAN DEFAULT true,

  -- Categories Subject to Deduction
  deductible_categories JSONB DEFAULT '["parts", "materials", "consumables"]',

  -- Notifications
  notify_technician_on_deduction BOOLEAN DEFAULT true,
  notify_manager_on_high_usage BOOLEAN DEFAULT true,
  high_usage_threshold_amount DECIMAL(10,2) DEFAULT 500.00,

  -- Repayment Terms
  allow_payment_plans BOOLEAN DEFAULT true,
  default_payment_plan_weeks INTEGER DEFAULT 4,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),

  UNIQUE(company_id)
);

-- ============================================================================
-- PAYROLL SCHEDULE SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS payroll_schedule_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Schedule Type
  payroll_frequency VARCHAR(50) NOT NULL DEFAULT 'biweekly' CHECK (payroll_frequency IN (
    'weekly', 'biweekly', 'semi_monthly', 'monthly'
  )),

  -- Weekly Settings
  weekly_pay_day VARCHAR(20) CHECK (weekly_pay_day IN (
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday'
  )),

  -- Biweekly Settings
  biweekly_start_date DATE,

  -- Semi-Monthly Settings
  semi_monthly_first_day INTEGER CHECK (semi_monthly_first_day BETWEEN 1 AND 28),
  semi_monthly_second_day INTEGER CHECK (semi_monthly_second_day BETWEEN 1 AND 28),

  -- Monthly Settings
  monthly_pay_day INTEGER CHECK (monthly_pay_day BETWEEN 1 AND 28),

  -- Pay Period
  pay_period_end_day VARCHAR(20) DEFAULT 'sunday',
  days_in_arrears INTEGER DEFAULT 0, -- How many days after period end is pay day

  -- Processing
  auto_process_payroll BOOLEAN DEFAULT false,
  require_manager_approval BOOLEAN DEFAULT true,
  require_finance_approval BOOLEAN DEFAULT true,
  approval_deadline_days INTEGER DEFAULT 2,

  -- Time Tracking
  time_tracking_method VARCHAR(50) DEFAULT 'clock_in_out' CHECK (time_tracking_method IN (
    'clock_in_out', 'job_based', 'manual_entry', 'gps_verified'
  )),
  round_time_to_nearest_minutes INTEGER DEFAULT 15,

  -- Overtime Calculation
  overtime_calculation_period VARCHAR(50) DEFAULT 'weekly' CHECK (overtime_calculation_period IN (
    'daily', 'weekly', 'pay_period'
  )),

  -- Holiday Pay
  paid_holidays_enabled BOOLEAN DEFAULT true,
  holiday_pay_rate_multiplier DECIMAL(4,2) DEFAULT 1.00,

  -- PTO Accrual
  pto_accrual_enabled BOOLEAN DEFAULT true,
  pto_accrual_rate_hours_per_pay_period DECIMAL(4,2) DEFAULT 3.08,
  pto_max_accrual_hours DECIMAL(6,2) DEFAULT 120.00,

  -- Notifications
  notify_team_before_payroll_days INTEGER DEFAULT 3,
  notify_on_timesheet_approval BOOLEAN DEFAULT true,
  notify_on_payroll_processed BOOLEAN DEFAULT true,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),

  UNIQUE(company_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_payroll_overtime_company ON payroll_overtime_settings(company_id);
CREATE INDEX idx_payroll_bonus_rules_company ON payroll_bonus_rules(company_id);
CREATE INDEX idx_payroll_bonus_rules_active ON payroll_bonus_rules(company_id, is_active);
CREATE INDEX idx_payroll_callback_settings_company ON payroll_callback_settings(company_id);
CREATE INDEX idx_payroll_commission_rules_company ON payroll_commission_rules(company_id);
CREATE INDEX idx_payroll_commission_rules_active ON payroll_commission_rules(company_id, is_active);
CREATE INDEX idx_payroll_deduction_types_company ON payroll_deduction_types(company_id);
CREATE INDEX idx_payroll_deduction_types_active ON payroll_deduction_types(company_id, is_active);
CREATE INDEX idx_payroll_employee_deductions_member ON payroll_employee_deductions(team_member_id);
CREATE INDEX idx_payroll_employee_deductions_active ON payroll_employee_deductions(team_member_id, is_active);
CREATE INDEX idx_payroll_material_settings_company ON payroll_material_settings(company_id);
CREATE INDEX idx_payroll_schedule_settings_company ON payroll_schedule_settings(company_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE payroll_overtime_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_bonus_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_bonus_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_callback_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_commission_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_commission_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_deduction_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_employee_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_material_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_schedule_settings ENABLE ROW LEVEL SECURITY;

-- Overtime Settings Policies
CREATE POLICY "Users can view overtime settings for their company"
  ON payroll_overtime_settings FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Managers can manage overtime settings"
  ON payroll_overtime_settings FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('owner', 'admin', 'manager')
    )
  );

-- Bonus Rules Policies
CREATE POLICY "Users can view bonus rules for their company"
  ON payroll_bonus_rules FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Managers can manage bonus rules"
  ON payroll_bonus_rules FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('owner', 'admin', 'manager')
    )
  );

-- Bonus Tiers Policies
CREATE POLICY "Users can view bonus tiers for their company"
  ON payroll_bonus_tiers FOR SELECT
  USING (
    bonus_rule_id IN (
      SELECT id FROM payroll_bonus_rules
      WHERE company_id IN (
        SELECT company_id FROM team_members
        WHERE user_id = auth.uid() AND status = 'active'
      )
    )
  );

CREATE POLICY "Managers can manage bonus tiers"
  ON payroll_bonus_tiers FOR ALL
  USING (
    bonus_rule_id IN (
      SELECT id FROM payroll_bonus_rules
      WHERE company_id IN (
        SELECT company_id FROM team_members
        WHERE user_id = auth.uid()
          AND status = 'active'
          AND role IN ('owner', 'admin', 'manager')
      )
    )
  );

-- Callback Settings Policies
CREATE POLICY "Users can view callback settings for their company"
  ON payroll_callback_settings FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Managers can manage callback settings"
  ON payroll_callback_settings FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('owner', 'admin', 'manager')
    )
  );

-- Commission Rules Policies
CREATE POLICY "Users can view commission rules for their company"
  ON payroll_commission_rules FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Managers can manage commission rules"
  ON payroll_commission_rules FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('owner', 'admin', 'manager')
    )
  );

-- Commission Tiers Policies
CREATE POLICY "Users can view commission tiers for their company"
  ON payroll_commission_tiers FOR SELECT
  USING (
    commission_rule_id IN (
      SELECT id FROM payroll_commission_rules
      WHERE company_id IN (
        SELECT company_id FROM team_members
        WHERE user_id = auth.uid() AND status = 'active'
      )
    )
  );

CREATE POLICY "Managers can manage commission tiers"
  ON payroll_commission_tiers FOR ALL
  USING (
    commission_rule_id IN (
      SELECT id FROM payroll_commission_rules
      WHERE company_id IN (
        SELECT company_id FROM team_members
        WHERE user_id = auth.uid()
          AND status = 'active'
          AND role IN ('owner', 'admin', 'manager')
      )
    )
  );

-- Deduction Types Policies
CREATE POLICY "Users can view deduction types for their company"
  ON payroll_deduction_types FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Managers can manage deduction types"
  ON payroll_deduction_types FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('owner', 'admin', 'manager')
    )
  );

-- Employee Deductions Policies
CREATE POLICY "Users can view their own deductions"
  ON payroll_employee_deductions FOR SELECT
  USING (
    team_member_id IN (
      SELECT id FROM team_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can view all employee deductions"
  ON payroll_employee_deductions FOR SELECT
  USING (
    team_member_id IN (
      SELECT id FROM team_members
      WHERE company_id IN (
        SELECT company_id FROM team_members
        WHERE user_id = auth.uid()
          AND status = 'active'
          AND role IN ('owner', 'admin', 'manager')
      )
    )
  );

CREATE POLICY "Managers can manage employee deductions"
  ON payroll_employee_deductions FOR INSERT
  USING (
    team_member_id IN (
      SELECT id FROM team_members
      WHERE company_id IN (
        SELECT company_id FROM team_members
        WHERE user_id = auth.uid()
          AND status = 'active'
          AND role IN ('owner', 'admin', 'manager')
      )
    )
  );

CREATE POLICY "Managers can update employee deductions"
  ON payroll_employee_deductions FOR UPDATE
  USING (
    team_member_id IN (
      SELECT id FROM team_members
      WHERE company_id IN (
        SELECT company_id FROM team_members
        WHERE user_id = auth.uid()
          AND status = 'active'
          AND role IN ('owner', 'admin', 'manager')
      )
    )
  );

-- Material Settings Policies
CREATE POLICY "Users can view material settings for their company"
  ON payroll_material_settings FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Managers can manage material settings"
  ON payroll_material_settings FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('owner', 'admin', 'manager')
    )
  );

-- Payroll Schedule Policies
CREATE POLICY "Users can view payroll schedule for their company"
  ON payroll_schedule_settings FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Managers can manage payroll schedule"
  ON payroll_schedule_settings FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('owner', 'admin', 'manager')
    )
  );

-- ============================================================================
-- AUDIT TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payroll_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_overtime_settings_updated_at
  BEFORE UPDATE ON payroll_overtime_settings
  FOR EACH ROW EXECUTE FUNCTION update_payroll_updated_at();

CREATE TRIGGER update_bonus_rules_updated_at
  BEFORE UPDATE ON payroll_bonus_rules
  FOR EACH ROW EXECUTE FUNCTION update_payroll_updated_at();

CREATE TRIGGER update_callback_settings_updated_at
  BEFORE UPDATE ON payroll_callback_settings
  FOR EACH ROW EXECUTE FUNCTION update_payroll_updated_at();

CREATE TRIGGER update_commission_rules_updated_at
  BEFORE UPDATE ON payroll_commission_rules
  FOR EACH ROW EXECUTE FUNCTION update_payroll_updated_at();

CREATE TRIGGER update_deduction_types_updated_at
  BEFORE UPDATE ON payroll_deduction_types
  FOR EACH ROW EXECUTE FUNCTION update_payroll_updated_at();

CREATE TRIGGER update_employee_deductions_updated_at
  BEFORE UPDATE ON payroll_employee_deductions
  FOR EACH ROW EXECUTE FUNCTION update_payroll_updated_at();

CREATE TRIGGER update_material_settings_updated_at
  BEFORE UPDATE ON payroll_material_settings
  FOR EACH ROW EXECUTE FUNCTION update_payroll_updated_at();

CREATE TRIGGER update_schedule_settings_updated_at
  BEFORE UPDATE ON payroll_schedule_settings
  FOR EACH ROW EXECUTE FUNCTION update_payroll_updated_at();
