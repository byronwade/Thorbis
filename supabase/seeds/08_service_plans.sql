-- ============================================================================
-- SEED: Service Plans
-- ============================================================================
-- Creates maintenance plans that customers can subscribe to
-- ============================================================================

DO $$
DECLARE
  v_company_id UUID := current_setting('app.current_company_id')::uuid;

  -- Customer IDs (we'll need to fetch these)
  v_sarah_chen_id UUID;
  v_michael_rodriguez_id UUID;
  v_jennifer_thompson_id UUID;
  v_emily_martinez_id UUID;
  v_amanda_lee_id UUID;
  v_robert_williams_id UUID;
  v_david_park_id UUID;
  v_lisa_nguyen_id UUID;

  -- Commercial customers
  v_techstart_id UUID;
  v_office_complex_id UUID;
  v_restaurant_id UUID;
  v_medical_center_id UUID;

  -- Plan template IDs
  v_residential_hvac_plan_id UUID;
  v_premium_hvac_plan_id UUID;
  v_plumbing_plan_id UUID;
  v_combined_plan_id UUID;
  v_commercial_hvac_plan_id UUID;
  v_commercial_premium_plan_id UUID;

BEGIN

  RAISE NOTICE 'Seeding Service Plans...';

  -- ============================================================================
  -- FETCH CUSTOMER IDS
  -- ============================================================================

  SELECT id INTO v_sarah_chen_id FROM customers WHERE email = 'sarah.chen@gmail.com';
  SELECT id INTO v_michael_rodriguez_id FROM customers WHERE email = 'michael.rodriguez@gmail.com';
  SELECT id INTO v_jennifer_thompson_id FROM customers WHERE email = 'jennifer.thompson@gmail.com';
  SELECT id INTO v_emily_martinez_id FROM customers WHERE email = 'emily.martinez@gmail.com';
  SELECT id INTO v_amanda_lee_id FROM customers WHERE email = 'amanda.lee@gmail.com';
  SELECT id INTO v_robert_williams_id FROM customers WHERE email = 'robert.williams@gmail.com';
  SELECT id INTO v_david_park_id FROM customers WHERE email = 'david.park@gmail.com';
  SELECT id INTO v_lisa_nguyen_id FROM customers WHERE email = 'lisa.nguyen@yahoo.com';

  SELECT id INTO v_techstart_id FROM customers WHERE email = 'facilities@techstart.io';
  SELECT id INTO v_office_complex_id FROM customers WHERE email = 'management@marinoffices.com';
  SELECT id INTO v_restaurant_id FROM customers WHERE email = 'ops@riversidegroup.com';
  SELECT id INTO v_medical_center_id FROM customers WHERE email = 'facilities@bayhealthcenter.org';

  -- ============================================================================
  -- PLAN TEMPLATES (define available service plan types)
  -- ============================================================================

  INSERT INTO service_plan_templates (
    company_id,
    name,
    description,
    plan_type,
    pricing_model,
    price,
    billing_frequency,
    visits_per_year,
    visit_types,
    included_services,
    excluded_services,
    terms_and_conditions,
    is_active,
    is_featured,
    sort_order
  ) VALUES
    -- Residential HVAC Standard Plan
    (
      v_company_id,
      'Residential HVAC Maintenance Plan',
      'Bi-annual heating and cooling system maintenance to keep your home comfort systems running efficiently year-round.',
      'maintenance',
      'annual',
      29900, -- $299/year
      'annual',
      2,
      '["spring_cooling_tune_up", "fall_heating_tune_up"]'::jsonb,
      '["Filter replacement", "System inspection", "Refrigerant check", "Electrical connections check", "Thermostat calibration", "Condensate drain cleaning", "10% discount on repairs"]'::jsonb,
      '["Emergency service", "Parts and materials", "Major repairs", "System replacement"]'::jsonb,
      'Plan covers up to 2 HVAC systems per household. Additional systems $99/year each. 10% discount on all repairs. Priority scheduling. Plan renews annually. 30-day cancellation notice required.',
      true,
      true,
      1
    ),

    -- Premium Residential Plan
    (
      v_company_id,
      'Premium Home Comfort Plan',
      'Comprehensive year-round maintenance for HVAC, plumbing, and water heaters with priority service and enhanced discounts.',
      'comprehensive',
      'annual',
      59900, -- $599/year
      'annual',
      3,
      '["spring_cooling_tune_up", "fall_heating_tune_up", "plumbing_inspection"]'::jsonb,
      '["All services from Standard Plan", "Annual water heater flush", "Plumbing system inspection", "Leak detection", "Drain cleaning (1 per year)", "15% discount on all repairs", "No service call fees"]'::jsonb,
      '["Emergency service outside plan visits", "Major system replacement", "Remodeling work"]'::jsonb,
      'Covers up to 2 HVAC systems, 1 water heater, and residential plumbing. Priority response within 24 hours. Plan renews annually.',
      true,
      true,
      2
    ),

    -- Plumbing Only Plan
    (
      v_company_id,
      'Plumbing Protection Plan',
      'Annual plumbing system maintenance and inspection to prevent costly repairs and water damage.',
      'maintenance',
      'annual',
      19900, -- $199/year
      'annual',
      1,
      '["annual_plumbing_inspection"]'::jsonb,
      '["Complete plumbing inspection", "Water pressure test", "Leak detection", "Water heater inspection", "Drain cleaning (1 per year)", "10% discount on repairs"]'::jsonb,
      '["Emergency service", "Fixture replacement", "Repiping", "Sewer line work"]'::jsonb,
      'Covers residential plumbing system inspection and basic preventive maintenance. Priority scheduling for members.',
      true,
      false,
      3
    ),

    -- Combined HVAC + Plumbing
    (
      v_company_id,
      'Total Home Care Plan',
      'Ultimate protection for your home systems - HVAC, plumbing, and water heaters with maximum discounts and priority service.',
      'comprehensive',
      'monthly',
      7900, -- $79/month ($948/year)
      'monthly',
      4,
      '["spring_cooling_tune_up", "fall_heating_tune_up", "plumbing_inspection", "water_heater_service"]'::jsonb,
      '["All HVAC maintenance", "All plumbing maintenance", "Water heater service", "Emergency service included (2 per year)", "20% discount on all repairs", "No service call fees", "Priority scheduling"]'::jsonb,
      '["Major system replacement", "Remodeling work"]'::jsonb,
      'Most comprehensive coverage. Includes 2 emergency service calls per year at no additional charge. Priority response within 4 hours. Monthly payment option available.',
      true,
      true,
      4
    ),

    -- Commercial HVAC Standard
    (
      v_company_id,
      'Commercial HVAC Maintenance Plan',
      'Quarterly maintenance for commercial heating and cooling systems to ensure optimal performance and minimal downtime.',
      'maintenance',
      'annual',
      149900, -- $1,499/year
      'annual',
      4,
      '["quarterly_hvac_maintenance"]'::jsonb,
      '["Quarterly system inspection", "Filter replacement", "Refrigerant check", "Belt inspection and adjustment", "Motor lubrication", "Controls calibration", "15% discount on repairs", "After-hours emergency available"]'::jsonb,
      '["Emergency service fees", "Major equipment replacement", "Refrigerant recharge", "Compressor replacement"]'::jsonb,
      'Covers up to 3 rooftop units or equivalent tonnage. Additional units priced separately. Business hours priority scheduling. Quarterly maintenance reports provided.',
      true,
      true,
      5
    ),

    -- Commercial Premium
    (
      v_company_id,
      'Commercial Premium Care Plan',
      'Comprehensive monthly maintenance for commercial properties with critical HVAC needs and 24/7 priority support.',
      'comprehensive',
      'monthly',
      39900, -- $399/month ($4,788/year)
      'monthly',
      12,
      '["monthly_hvac_inspection", "quarterly_deep_maintenance"]'::jsonb,
      '["Monthly inspections", "Quarterly deep maintenance", "Emergency service included (unlimited)", "20% discount on all repairs", "24/7 priority response", "No service call fees", "Detailed monthly reports", "Energy efficiency analysis"]'::jsonb,
      '["Major equipment replacement"]'::jsonb,
      'Best for mission-critical facilities. Includes unlimited emergency service. 2-hour response time guarantee 24/7. Covers up to 5 rooftop units. Monthly invoicing.',
      true,
      true,
      6
    )
  RETURNING id INTO v_residential_hvac_plan_id;

  -- Get other plan IDs
  SELECT id INTO v_premium_hvac_plan_id FROM service_plan_templates WHERE name = 'Premium Home Comfort Plan';
  SELECT id INTO v_plumbing_plan_id FROM service_plan_templates WHERE name = 'Plumbing Protection Plan';
  SELECT id INTO v_combined_plan_id FROM service_plan_templates WHERE name = 'Total Home Care Plan';
  SELECT id INTO v_commercial_hvac_plan_id FROM service_plan_templates WHERE name = 'Commercial HVAC Maintenance Plan';
  SELECT id INTO v_commercial_premium_plan_id FROM service_plan_templates WHERE name = 'Commercial Premium Care Plan';

  RAISE NOTICE '  ✓ Created 6 service plan templates';

  -- ============================================================================
  -- CUSTOMER SUBSCRIPTIONS (active service plans)
  -- ============================================================================

  -- Sarah Chen - Premium Plan (VIP customer with 3 properties)
  INSERT INTO service_plan_subscriptions (
    company_id,
    customer_id,
    plan_template_id,
    plan_name,
    status,
    start_date,
    next_billing_date,
    price,
    billing_frequency,
    visits_remaining,
    last_visit_date,
    next_visit_date,
    auto_renew,
    payment_method_id,
    notes
  ) VALUES (
    v_company_id,
    v_sarah_chen_id,
    v_premium_hvac_plan_id,
    'Premium Home Comfort Plan',
    'active',
    '2023-03-15'::date,
    '2025-03-15'::date,
    59900,
    'annual',
    1, -- 1 visit remaining this year
    '2024-10-20'::date,
    '2025-02-15'::date,
    true,
    NULL,
    'VIP customer. Covers Pacific Heights residence (3 HVAC zones). Customer prefers morning appointments. Has been on plan for 2 years.'
  );

  -- Michael Rodriguez - Standard HVAC Plan
  INSERT INTO service_plan_subscriptions (
    company_id,
    customer_id,
    plan_template_id,
    plan_name,
    status,
    start_date,
    next_billing_date,
    price,
    billing_frequency,
    visits_remaining,
    last_visit_date,
    next_visit_date,
    auto_renew,
    notes
  ) VALUES (
    v_company_id,
    v_michael_rodriguez_id,
    v_residential_hvac_plan_id,
    'Residential HVAC Maintenance Plan',
    'active',
    '2024-05-01'::date,
    '2025-05-01'::date,
    29900,
    'annual',
    1,
    '2024-09-15'::date,
    '2025-03-01'::date,
    true,
    'Noe Valley Victorian. Single HVAC system. Customer works from home, flexible scheduling.'
  );

  -- Jennifer Thompson - Premium Plan (Palo Alto, 2 properties)
  INSERT INTO service_plan_subscriptions (
    company_id,
    customer_id,
    plan_template_id,
    plan_name,
    status,
    start_date,
    next_billing_date,
    price,
    billing_frequency,
    visits_remaining,
    last_visit_date,
    next_visit_date,
    auto_renew,
    notes
  ) VALUES (
    v_company_id,
    v_jennifer_thompson_id,
    v_premium_hvac_plan_id,
    'Premium Home Comfort Plan',
    'active',
    '2024-01-10'::date,
    '2025-01-10'::date,
    59900,
    'annual',
    2,
    '2024-05-20'::date,
    '2025-01-15'::date,
    true,
    'Covers both Palo Alto properties. Prefers coordinated service on same day for both homes.'
  );

  -- Emily Martinez - Standard HVAC Plan (heat pumps)
  INSERT INTO service_plan_subscriptions (
    company_id,
    customer_id,
    plan_template_id,
    plan_name,
    status,
    start_date,
    next_billing_date,
    price,
    billing_frequency,
    visits_remaining,
    last_visit_date,
    next_visit_date,
    auto_renew,
    notes
  ) VALUES (
    v_company_id,
    v_emily_martinez_id,
    v_residential_hvac_plan_id,
    'Residential HVAC Maintenance Plan',
    'active',
    '2024-08-01'::date,
    '2025-08-01'::date,
    29900,
    'annual',
    2,
    NULL, -- New customer, first visit pending
    '2025-01-10'::date,
    true,
    'Heat pump systems. New plan member as of August 2024. Customer interested in energy efficiency tips.'
  );

  -- Amanda Lee - Total Home Care Plan (estate, high-end)
  INSERT INTO service_plan_subscriptions (
    company_id,
    customer_id,
    plan_template_id,
    plan_name,
    status,
    start_date,
    next_billing_date,
    price,
    billing_frequency,
    visits_remaining,
    last_visit_date,
    next_visit_date,
    auto_renew,
    payment_method_id,
    notes
  ) VALUES (
    v_company_id,
    v_amanda_lee_id,
    v_combined_plan_id,
    'Total Home Care Plan',
    'active',
    '2023-06-01'::date,
    '2025-02-01'::date,
    7900,
    'monthly',
    3, -- 3 visits remaining this cycle
    '2024-11-10'::date,
    '2025-01-20'::date,
    true,
    NULL,
    'Hillsborough estate. Premium customer. Multiple high-end systems under warranty. Monthly payment plan. Property manager coordinates all service.'
  );

  -- David Park - Plumbing Protection Plan
  INSERT INTO service_plan_subscriptions (
    company_id,
    customer_id,
    plan_template_id,
    plan_name,
    status,
    start_date,
    next_billing_date,
    price,
    billing_frequency,
    visits_remaining,
    last_visit_date,
    next_visit_date,
    auto_renew,
    notes
  ) VALUES (
    v_company_id,
    v_david_park_id,
    v_plumbing_plan_id,
    'Plumbing Protection Plan',
    'active',
    '2024-07-01'::date,
    '2025-07-01'::date,
    19900,
    'annual',
    1,
    NULL,
    '2025-02-01'::date,
    true,
    'Older home with original plumbing. Customer concerned about pipe condition. Annual inspection due.'
  );

  -- Lisa Nguyen - Standard HVAC Plan
  INSERT INTO service_plan_subscriptions (
    company_id,
    customer_id,
    plan_template_id,
    plan_name,
    status,
    start_date,
    next_billing_date,
    price,
    billing_frequency,
    visits_remaining,
    last_visit_date,
    next_visit_date,
    auto_renew,
    notes
  ) VALUES (
    v_company_id,
    v_lisa_nguyen_id,
    v_residential_hvac_plan_id,
    'Residential HVAC Maintenance Plan',
    'active',
    '2024-04-15'::date,
    '2025-04-15'::date,
    29900,
    'annual',
    1,
    '2024-08-20'::date,
    '2025-03-15'::date,
    true,
    'Daly City home. Standard service plan. Customer very satisfied with service.'
  );

  -- ============================================================================
  -- COMMERCIAL SUBSCRIPTIONS
  -- ============================================================================

  -- TechStart Ventures - Commercial Premium (24/7 coverage for server room)
  INSERT INTO service_plan_subscriptions (
    company_id,
    customer_id,
    plan_template_id,
    plan_name,
    status,
    start_date,
    next_billing_date,
    price,
    billing_frequency,
    visits_remaining,
    last_visit_date,
    next_visit_date,
    auto_renew,
    payment_method_id,
    notes
  ) VALUES (
    v_company_id,
    v_techstart_id,
    v_commercial_premium_plan_id,
    'Commercial Premium Care Plan',
    'active',
    '2024-01-01'::date,
    '2025-02-01'::date,
    39900,
    'monthly',
    11, -- 11 monthly visits remaining this year
    '2024-12-15'::date,
    '2025-01-15'::date,
    true,
    NULL,
    'Critical coverage for server room HVAC. Covers 3 rooftop units. Monthly inspections required. 24/7 emergency contact: facilities@techstart.io. Net 30 payment terms.'
  );

  -- Office Complex - Commercial HVAC Standard
  INSERT INTO service_plan_subscriptions (
    company_id,
    customer_id,
    plan_template_id,
    plan_name,
    status,
    start_date,
    next_billing_date,
    price,
    billing_frequency,
    visits_remaining,
    last_visit_date,
    next_visit_date,
    auto_renew,
    notes
  ) VALUES (
    v_company_id,
    v_office_complex_id,
    v_commercial_hvac_plan_id,
    'Commercial HVAC Maintenance Plan',
    'active',
    '2023-09-01'::date,
    '2025-09-01'::date,
    149900,
    'annual',
    2, -- 2 quarterly visits remaining
    '2024-10-05'::date,
    '2025-01-05'::date,
    true,
    'Marina office building. 4 RTUs covered under plan. Quarterly maintenance schedule. Building manager must be present for all service.'
  );

  -- Medical Center - Commercial Premium (critical facility)
  INSERT INTO service_plan_subscriptions (
    company_id,
    customer_id,
    plan_template_id,
    plan_name,
    status,
    start_date,
    next_billing_date,
    price,
    billing_frequency,
    visits_remaining,
    last_visit_date,
    next_visit_date,
    auto_renew,
    payment_method_id,
    notes
  ) VALUES (
    v_company_id,
    v_medical_center_id,
    v_commercial_premium_plan_id,
    'Commercial Premium Care Plan',
    'active',
    '2023-03-01'::date,
    '2025-02-01'::date,
    39900,
    'monthly',
    11,
    '2024-12-10'::date,
    '2025-01-10'::date,
    true,
    NULL,
    'Critical medical facility. 5 HVAC systems including backup. Monthly inspections mandatory. Air quality testing included. Emergency response required within 2 hours. Net 60 payment terms.'
  );

  RAISE NOTICE '  ✓ Created 10 customer service plan subscriptions';

  -- ============================================================================
  -- SUMMARY
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '  Summary:';
  RAISE NOTICE '  - 6 Service plan templates (3 residential, 2 commercial, 1 combined)';
  RAISE NOTICE '  - 10 Active customer subscriptions';
  RAISE NOTICE '    * 7 Residential plans ($199-$948/year)';
  RAISE NOTICE '    * 3 Commercial plans ($1,499-$4,788/year)';
  RAISE NOTICE '  - Total annual recurring revenue: ~$13,000';
  RAISE NOTICE '';

END $$;
