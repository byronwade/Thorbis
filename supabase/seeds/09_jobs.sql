-- ============================================================================
-- SEED: Jobs
-- ============================================================================
-- Creates 40 jobs with realistic progression and pricing
-- ============================================================================

DO $$
DECLARE
  v_company_id UUID := current_setting('app.current_company_id')::uuid;
  v_user_id UUID := current_setting('app.current_user_id')::uuid;

  -- Customer IDs
  v_sarah_chen_id UUID;
  v_michael_rodriguez_id UUID;
  v_jennifer_thompson_id UUID;
  v_emily_martinez_id UUID;
  v_amanda_lee_id UUID;
  v_robert_williams_id UUID;
  v_david_park_id UUID;
  v_lisa_nguyen_id UUID;
  v_james_kim_id UUID;
  v_maria_santos_id UUID;
  v_kevin_chang_id UUID;
  v_rachel_green_id UUID;
  v_techstart_id UUID;
  v_office_complex_id UUID;
  v_restaurant_id UUID;
  v_medical_center_id UUID;

  -- Property IDs
  v_sarah_pacific_heights UUID;
  v_michael_noe_valley UUID;
  v_jennifer_palo_alto UUID;
  v_techstart_office UUID;
  v_restaurant_main UUID;

  -- Equipment IDs (for service history)
  v_sarah_main_furnace UUID;
  v_michael_furnace UUID;
  v_robert_old_furnace UUID;

  -- Job counter
  v_job_number INTEGER := 1;
  v_job_id UUID;

BEGIN

  RAISE NOTICE 'Seeding Jobs...';

  -- ============================================================================
  -- FETCH CUSTOMER AND PROPERTY IDS
  -- ============================================================================

  SELECT id INTO v_sarah_chen_id FROM customers WHERE email = 'sarah.chen@gmail.com';
  SELECT id INTO v_michael_rodriguez_id FROM customers WHERE email = 'michael.rodriguez@gmail.com';
  SELECT id INTO v_jennifer_thompson_id FROM customers WHERE email = 'jennifer.thompson@gmail.com';
  SELECT id INTO v_emily_martinez_id FROM customers WHERE email = 'emily.martinez@gmail.com';
  SELECT id INTO v_amanda_lee_id FROM customers WHERE email = 'amanda.lee@gmail.com';
  SELECT id INTO v_robert_williams_id FROM customers WHERE email = 'robert.williams@gmail.com';
  SELECT id INTO v_david_park_id FROM customers WHERE email = 'david.park@gmail.com';
  SELECT id INTO v_lisa_nguyen_id FROM customers WHERE email = 'lisa.nguyen@yahoo.com';
  SELECT id INTO v_james_kim_id FROM customers WHERE email = 'james.kim@yahoo.com';
  SELECT id INTO v_maria_santos_id FROM customers WHERE email = 'maria.santos@gmail.com';
  SELECT id INTO v_kevin_chang_id FROM customers WHERE email = 'kevin.chang@gmail.com';
  SELECT id INTO v_rachel_green_id FROM customers WHERE email = 'rachel.green@gmail.com';
  SELECT id INTO v_techstart_id FROM customers WHERE email = 'facilities@techstart.io';
  SELECT id INTO v_office_complex_id FROM customers WHERE email = 'management@marinoffices.com';
  SELECT id INTO v_restaurant_id FROM customers WHERE email = 'ops@riversidegroup.com';
  SELECT id INTO v_medical_center_id FROM customers WHERE email = 'facilities@bayhealthcenter.org';

  -- Get some property IDs
  SELECT id INTO v_sarah_pacific_heights FROM properties WHERE customer_id = v_sarah_chen_id AND is_primary = true;
  SELECT id INTO v_michael_noe_valley FROM properties WHERE customer_id = v_michael_rodriguez_id LIMIT 1;
  SELECT id INTO v_jennifer_palo_alto FROM properties WHERE customer_id = v_jennifer_thompson_id AND is_primary = true;
  SELECT id INTO v_techstart_office FROM properties WHERE customer_id = v_techstart_id LIMIT 1;
  SELECT id INTO v_restaurant_main FROM properties WHERE customer_id = v_restaurant_id AND name LIKE '%Main%' LIMIT 1;

  -- Get some equipment IDs for service history
  SELECT id INTO v_sarah_main_furnace FROM equipment WHERE customer_id = v_sarah_chen_id AND name = 'Main Floor Furnace' LIMIT 1;
  SELECT id INTO v_michael_furnace FROM equipment WHERE customer_id = v_michael_rodriguez_id AND type = 'hvac' LIMIT 1;
  SELECT id INTO v_robert_old_furnace FROM equipment WHERE customer_id = v_robert_williams_id LIMIT 1;

  -- ============================================================================
  -- COMPLETED JOBS (25 jobs - oldest to most recent)
  -- ============================================================================

  -- Job 1: Emergency repair (3 months ago)
  INSERT INTO jobs (
    company_id, customer_id, property_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_sarah_chen_id, v_sarah_pacific_heights,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'repair', 'completed',
    'Emergency - No Heat Main Floor',
    'Customer reports main floor heating system not working. Temperature outside is 42°F. VIP customer - priority response.',
    'urgent',
    'phone',
    '2024-10-15 14:00:00'::timestamp,
    '2024-10-15 17:00:00'::timestamp,
    '2024-10-15 14:15:00'::timestamp,
    '2024-10-15 16:30:00'::timestamp,
    v_user_id, v_user_id,
    42500, 3612, 46112, 0,
    '["emergency", "vip-customer", "first-time-fix"]'::jsonb,
    'Issue: Failed igniter on Carrier furnace. Replaced igniter and tested full heating cycle. System operational. Customer very satisfied with quick response.'
  ) RETURNING id INTO v_job_id;
  v_job_number := v_job_number + 1;

  -- Link to equipment
  UPDATE equipment SET last_service_date = '2024-10-15'::date WHERE id = v_sarah_main_furnace;

  -- Job 2: Annual maintenance (2 months ago)
  INSERT INTO jobs (
    company_id, customer_id, property_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_michael_rodriguez_id, v_michael_noe_valley,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'maintenance', 'completed',
    'Fall Heating Tune-Up',
    'Service plan visit: Fall heating system maintenance and inspection per annual plan.',
    'normal',
    'service_plan',
    '2024-09-15 09:00:00'::timestamp,
    '2024-09-15 11:00:00'::timestamp,
    '2024-09-15 09:10:00'::timestamp,
    '2024-09-15 10:45:00'::timestamp,
    v_user_id, v_user_id,
    0, 0, 0, 0, -- Covered under service plan
    '["service-plan"]'::jsonb,
    'Routine maintenance completed. Filter replaced. All systems operational. No issues found. Recommended customer consider humidifier for winter months.'
  );
  v_job_number := v_job_number + 1;

  -- Job 3: AC repair (4 months ago - summer)
  INSERT INTO jobs (
    company_id, customer_id, property_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_jennifer_thompson_id, v_jennifer_palo_alto,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'repair', 'completed',
    'AC Not Cooling - Upstairs Zone',
    'Upstairs AC not cooling properly. Temperature differential of 10 degrees between floors.',
    'high',
    'email',
    '2024-07-22 13:00:00'::timestamp,
    '2024-07-22 16:00:00'::timestamp,
    '2024-07-22 13:15:00'::timestamp,
    '2024-07-22 15:45:00'::timestamp,
    v_user_id, v_user_id,
    68500, 5822, 74322, 0,
    '["first-time-fix"]'::jsonb,
    'Found low refrigerant due to small leak in evaporator coil. Added 2 lbs R-410A refrigerant. System cooling properly. Recommended monitoring, may need coil replacement in future if leak worsens.'
  );
  v_job_number := v_job_number + 1;

  -- Job 4: Water heater installation
  INSERT INTO jobs (
    company_id, customer_id, property_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_david_park_id, NULL,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'installation', 'completed',
    'Replace 40-Gallon Gas Water Heater',
    'Replace failing 12-year-old water heater. Customer reports rust in hot water and slow recovery time.',
    'high',
    'phone',
    '2024-08-05 08:00:00'::timestamp,
    '2024-08-05 14:00:00'::timestamp,
    '2024-08-05 08:20:00'::timestamp,
    '2024-08-05 13:30:00'::timestamp,
    v_user_id, v_user_id,
    165000, 14025, 179025, 0,
    '[]'::jsonb,
    'Removed old 40-gal gas water heater. Installed new Bradford White 40-gal 40,000 BTU natural gas unit. Updated venting to current code. Installed expansion tank. Tested all connections. Pulled permit #BLD2024-08932.'
  );
  v_job_number := v_job_number + 1;

  -- Job 5: Commercial quarterly maintenance
  INSERT INTO jobs (
    company_id, customer_id, property_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_techstart_id, v_techstart_office,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'maintenance', 'completed',
    'Q3 Quarterly HVAC Maintenance - TechStart',
    'Quarterly maintenance for 3 rooftop units including critical server room AC per service plan.',
    'high',
    'service_plan',
    '2024-09-10 07:00:00'::timestamp,
    '2024-09-10 12:00:00'::timestamp,
    '2024-09-10 07:00:00'::timestamp,
    '2024-09-10 11:30:00'::timestamp,
    v_user_id, v_user_id,
    0, 0, 0, 0,
    '["service-plan", "commercial"]'::jsonb,
    'All 3 RTUs serviced. Server room AC running perfectly - critical for operations. Replaced filters on all units. Checked refrigerant levels. All systems operational. Next quarterly service: December 2024.'
  );
  v_job_number := v_job_number + 1;

  -- Job 6-15: More completed jobs (mix of residential and commercial)

  -- Drain cleaning
  INSERT INTO jobs (
    company_id, customer_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    internal_notes
  ) VALUES (
    v_company_id, v_maria_santos_id,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'repair', 'completed',
    'Kitchen Sink Slow Drain',
    'Kitchen sink draining very slowly. Customer suspects grease buildup.',
    'normal',
    'online',
    '2024-08-20 10:00:00'::timestamp,
    '2024-08-20 12:00:00'::timestamp,
    '2024-08-20 10:15:00'::timestamp,
    '2024-08-20 11:30:00'::timestamp,
    v_user_id, v_user_id,
    18500, 1572, 20072, 0,
    'Snaked kitchen drain. Removed grease buildup. Drain flowing properly. Educated customer on proper disposal of cooking grease.'
  );
  v_job_number := v_job_number + 1;

  -- Thermostat upgrade
  INSERT INTO jobs (
    company_id, customer_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_lisa_nguyen_id,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'installation', 'completed',
    'Install Smart Thermostat',
    'Replace old mechanical thermostat with Nest Learning Thermostat for better efficiency.',
    'low',
    'phone',
    '2024-07-15 13:00:00'::timestamp,
    '2024-07-15 15:00:00'::timestamp,
    '2024-07-15 13:10:00'::timestamp,
    '2024-07-15 14:30'::timestamp,
    v_user_id, v_user_id,
    45000, 3825, 48825, 0,
    '[]'::jsonb,
    'Installed Nest Learning Thermostat 3rd Gen. Configured WiFi and mobile app. Programmed basic schedule per customer preferences. Customer pleased with upgrade.'
  );
  v_job_number := v_job_number + 1;

  -- Leak repair
  INSERT INTO jobs (
    company_id, customer_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_kevin_chang_id,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'repair', 'completed',
    'Bathroom Faucet Leak',
    'Master bathroom faucet dripping constantly. Customer estimates 1 gallon per day waste.',
    'normal',
    'online',
    '2024-09-25 09:00:00'::timestamp,
    '2024-09-25 11:00:00'::timestamp,
    '2024-09-25 09:05:00'::timestamp,
    '2024-09-25 10:20:00'::timestamp,
    v_user_id, v_user_id,
    12500, 1062, 13562, 0,
    '[]'::jsonb,
    'Replaced worn cartridge in Delta faucet. Leak stopped. Checked other fixtures while on site - all OK.'
  );
  v_job_number := v_job_number + 1;

  -- Commercial AC repair
  INSERT INTO jobs (
    company_id, customer_id, property_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_restaurant_id, v_restaurant_main,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'repair', 'completed',
    'Dining Room AC Not Working',
    'Main dining room AC unit not running. Outside temp 85°F - urgent for lunch service.',
    'urgent',
    'phone',
    '2024-08-12 10:00:00'::timestamp,
    '2024-08-12 13:00:00'::timestamp,
    '2024-08-12 10:30:00'::timestamp,
    '2024-08-12 12:15:00'::timestamp,
    v_user_id, v_user_id,
    45000, 3825, 48825, 0,
    '["emergency", "commercial", "first-time-fix"]'::jsonb,
    'Found tripped breaker due to dirty condenser coils. Reset breaker, cleaned coils. System operational before lunch service. Recommended quarterly maintenance plan to prevent future issues.'
  );
  v_job_number := v_job_number + 1;

  -- Spring AC tune-up
  INSERT INTO jobs (
    company_id, customer_id, property_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_sarah_chen_id, v_sarah_pacific_heights,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'maintenance', 'completed',
    'Spring AC Tune-Up - All 3 Zones',
    'Annual spring cooling system maintenance for all 3 HVAC zones per premium service plan.',
    'normal',
    'service_plan',
    '2024-05-20 09:00:00'::timestamp,
    '2024-05-20 14:00:00'::timestamp,
    '2024-05-20 09:00:00'::timestamp,
    '2024-05-20 13:30:00'::timestamp,
    v_user_id, v_user_id,
    0, 0, 0, 0,
    '["service-plan", "vip-customer"]'::jsonb,
    'Comprehensive maintenance on all 3 zones (main floor, upper floor, master suite). Cleaned coils, checked refrigerant levels, replaced filters. All systems ready for summer. VIP customer - excellent equipment condition.'
  );
  v_job_number := v_job_number + 1;

  -- Furnace replacement estimate follow-up
  INSERT INTO jobs (
    company_id, customer_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_robert_williams_id,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'diagnostic', 'completed',
    'Furnace Diagnostic - High Gas Bills',
    'Customer reports gas bills doubled this winter. Furnace is original to 1960s home.',
    'normal',
    'phone',
    '2024-11-05 13:00:00'::timestamp,
    '2024-11-05 15:00:00'::timestamp,
    '2024-11-05 13:10:00'::timestamp,
    '2024-11-05 14:45:00'::timestamp,
    v_user_id, v_user_id,
    8500, 722, 9222, 0,
    '["follow-up"]'::jsonb,
    'Performed combustion analysis. Old furnace only 65% efficient (modern units are 95%). Heat exchanger has minor cracks - safety concern. Strongly recommended replacement. Provided estimate EST-2024-0012. Customer considering options.'
  );
  v_job_number := v_job_number + 1;

  UPDATE equipment SET condition = 'poor', notes = 'Furnace failing - see diagnostic job. Replacement recommended.' WHERE id = v_robert_old_furnace;

  -- Ductwork sealing
  INSERT INTO jobs (
    company_id, customer_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    internal_notes
  ) VALUES (
    v_company_id, v_rachel_green_id,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'repair', 'completed',
    'Duct Sealing - Air Leaks in Attic',
    'Customer reports uneven heating and cooling. Some rooms much warmer/cooler than others.',
    'normal',
    'email',
    '2024-10-28 09:00:00'::timestamp,
    '2024-10-28 13:00:00'::timestamp,
    '2024-10-28 09:15:00'::timestamp,
    '2024-10-28 12:45:00'::timestamp,
    v_user_id, v_user_id,
    55000, 4675, 59675, 0,
    'Found significant air leaks in attic ductwork. Sealed all joints with mastic. Insulated exposed ducts. Customer should see 15-20% improvement in efficiency and better temperature balance.'
  );
  v_job_number := v_job_number + 1;

  -- Gas line inspection
  INSERT INTO jobs (
    company_id, customer_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    internal_notes
  ) VALUES (
    v_company_id, v_james_kim_id,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'inspection', 'completed',
    'Gas Line Inspection for Range Installation',
    'Customer installing new gas range. Needs gas line inspected and possibly upgraded.',
    'normal',
    'online',
    '2024-09-18 10:00:00'::timestamp,
    '2024-09-18 12:00:00'::timestamp,
    '2024-09-18 10:10:00'::timestamp,
    '2024-09-18 11:30:00'::timestamp,
    v_user_id, v_user_id,
    6500, 552, 7052, 0,
    'Existing 1/2" gas line adequate for new range (60,000 BTU). Pressure tested line - no leaks. Installed new shutoff valve. Ready for range installation.'
  );
  v_job_number := v_job_number + 1;

  -- Sump pump
  INSERT INTO jobs (
    company_id, customer_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_emily_martinez_id,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'installation', 'completed',
    'Install Sump Pump - Basement',
    'Customer reports occasional water in basement during heavy rain. Installing sump pump for protection.',
    'high',
    'phone',
    '2024-10-30 08:00:00'::timestamp,
    '2024-10-30 13:00:00'::timestamp,
    '2024-10-30 08:20:00'::timestamp,
    '2024-10-30 13:10:00'::timestamp,
    v_user_id, v_user_id,
    85000, 7225, 92225, 0,
    '[]'::jsonb,
    'Installed Zoeller M53 1/3 HP sump pump with battery backup. Dug sump pit, installed pump and discharge pipe. Tested system. Customer pleased with backup power feature for peace of mind.'
  );
  v_job_number := v_job_number + 1;

  -- Commercial kitchen exhaust
  INSERT INTO jobs (
    company_id, customer_id, property_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, completed_by,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_restaurant_id, v_restaurant_main,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'repair', 'completed',
    'Kitchen Exhaust Fan Noisy',
    'Kitchen exhaust fan making loud grinding noise. Affecting kitchen staff.',
    'high',
    'phone',
    '2024-11-12 07:00:00'::timestamp,
    '2024-11-12 10:00:00'::timestamp,
    '2024-11-12 07:15:00'::timestamp,
    '2024-11-12 09:30:00'::timestamp,
    v_user_id, v_user_id,
    32500, 2762, 35262, 0,
    '["commercial"]'::jsonb,
    'Replaced worn bearings in exhaust fan motor. Cleaned and balanced fan blades. Fan running quietly. Scheduled before restaurant opening to minimize disruption.'
  );
  v_job_number := v_job_number + 1;

  -- ============================================================================
  -- IN PROGRESS JOBS (3 jobs)
  -- ============================================================================

  -- Major installation in progress
  INSERT INTO jobs (
    company_id, customer_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start,
    assigned_to,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_amanda_lee_id,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'installation', 'in_progress',
    'Install Zoned HVAC System - Estate',
    'Large installation: Replace aging HVAC with new 4-zone system. 2 high-efficiency heat pumps, new ductwork, smart thermostats.',
    'normal',
    'estimate_converted',
    '2024-12-02 08:00:00'::timestamp,
    '2024-12-06 17:00:00'::timestamp,
    '2024-12-02 08:00:00'::timestamp,
    v_user_id,
    2850000, 242250, 3092250, 3092250,
    '[]'::jsonb,
    'Day 3 of 5. Both heat pumps installed on exterior. New ductwork 70% complete. Electrical work tomorrow. On schedule for Friday completion. Customer very pleased with progress.'
  );
  v_job_number := v_job_number + 1;

  -- Diagnostic in progress
  INSERT INTO jobs (
    company_id, customer_id, property_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start,
    assigned_to,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_office_complex_id, NULL,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'diagnostic', 'in_progress',
    'Investigate High Energy Bills',
    'Building manager reports energy costs up 30% vs last year. Investigating HVAC efficiency.',
    'normal',
    'phone',
    '2024-12-04 09:00:00'::timestamp,
    '2024-12-04 15:00:00'::timestamp,
    '2024-12-04 09:15:00'::timestamp,
    v_user_id,
    15000, 1275, 16275, 16275,
    '["commercial"]'::jsonb,
    'Day 1: Inspecting all 4 RTUs. Found RTU-3 has failed economizer - running on mechanical cooling even in mild weather. Will provide estimate for economizer repair. Continuing diagnostic.'
  );
  v_job_number := v_job_number + 1;

  -- Waiting for parts
  INSERT INTO jobs (
    company_id, customer_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end, actual_start,
    assigned_to,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_jennifer_thompson_id,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'repair', 'in_progress',
    'Heat Pump Compressor Replacement',
    'Heat pump compressor failed. Under manufacturer warranty. Waiting for warranty part.',
    'high',
    'phone',
    '2024-11-20 09:00:00'::timestamp,
    '2024-11-20 14:00:00'::timestamp,
    NULL,
    v_user_id,
    95000, 8075, 103075, 103075,
    '["parts-order", "warranty"]'::jsonb,
    'Diagnosed failed compressor. Part covered under Trane warranty. Ordered part #COMP-XR16-024. ETA Dec 6. Will schedule installation when part arrives. Customer has backup heating.'
  );
  v_job_number := v_job_number + 1;

  -- ============================================================================
  -- SCHEDULED JOBS (12 upcoming jobs)
  -- ============================================================================

  -- Tomorrow
  INSERT INTO jobs (
    company_id, customer_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end,
    assigned_to,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_michael_rodriguez_id,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'repair', 'scheduled',
    'Thermostat Not Responding',
    'Customer reports thermostat display blank. Checked batteries - not the issue. Possible wiring problem.',
    'normal',
    'phone',
    (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours')::timestamp,
    (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '12 hours')::timestamp,
    v_user_id,
    12500, 1062, 13562, 13562,
    '[]'::jsonb,
    'Scheduled for tomorrow morning. Likely transformer or loose wire. Parts on truck.'
  );
  v_job_number := v_job_number + 1;

  -- Day after tomorrow
  INSERT INTO jobs (
    company_id, customer_id, property_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end,
    assigned_to,
    subtotal, tax, total, balance,
    tags, internal_notes
  ) VALUES (
    v_company_id, v_techstart_id, v_techstart_office,
    'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
    'maintenance', 'scheduled',
    'Q4 Quarterly HVAC Maintenance',
    'Quarterly maintenance for all RTUs per premium service plan. Critical server room AC check.',
    'high',
    'service_plan',
    (CURRENT_DATE + INTERVAL '2 days' + INTERVAL '7 hours')::timestamp,
    (CURRENT_DATE + INTERVAL '2 days' + INTERVAL '12 hours')::timestamp,
    v_user_id,
    0, 0, 0, 0,
    '["service-plan", "commercial"]'::jsonb,
    'Quarterly service. Must complete before 12pm. Server room AC is mission-critical.'
  );
  v_job_number := v_job_number + 1;

  -- Next week - various jobs
  INSERT INTO jobs (
    company_id, customer_id, job_number, job_type, status,
    title, description, priority, source,
    scheduled_start, scheduled_end,
    assigned_to,
    balance,
    internal_notes
  ) VALUES
    (v_company_id, v_lisa_nguyen_id, 'JOB-2024-' || LPAD(v_job_number::text, 4, '0'),
     'maintenance', 'scheduled', 'Fall Heating Tune-Up',
     'Service plan visit: Annual fall heating maintenance.',
     'normal', 'service_plan',
     (CURRENT_DATE + INTERVAL '5 days' + INTERVAL '9 hours')::timestamp,
     (CURRENT_DATE + INTERVAL '5 days' + INTERVAL '11 hours')::timestamp,
     v_user_id, 0,
     'Service plan visit. Customer home after 3pm only.'),

    (v_company_id, v_david_park_id, 'JOB-2024-' || LPAD((v_job_number + 1)::text, 4, '0'),
     'inspection', 'scheduled', 'Annual Plumbing Inspection',
     'Service plan visit: Annual plumbing system inspection per Plumbing Protection Plan.',
     'normal', 'service_plan',
     (CURRENT_DATE + INTERVAL '7 days' + INTERVAL '10 hours')::timestamp,
     (CURRENT_DATE + INTERVAL '7 days' + INTERVAL '12 hours')::timestamp,
     v_user_id, 0,
     'Plumbing plan member. Focus on older pipes - customer concerned about leaks.'),

    (v_company_id, v_maria_santos_id, 'JOB-2024-' || LPAD((v_job_number + 2)::text, 4, '0'),
     'repair', 'scheduled', 'Garbage Disposal Jammed',
     'Kitchen garbage disposal not working. Makes humming sound but won''t turn.',
     'normal', 'online',
     (CURRENT_DATE + INTERVAL '8 days' + INTERVAL '13 hours')::timestamp,
     (CURRENT_DATE + INTERVAL '8 days' + INTERVAL '15 hours')::timestamp,
     v_user_id, 8500,
     'Likely foreign object in disposal. May need replacement if motor damaged.'),

    (v_company_id, v_kevin_chang_id, 'JOB-2024-' || LPAD((v_job_number + 3)::text, 4, '0'),
     'installation', 'scheduled', 'Install Tankless Water Heater',
     'Customer wants to replace tank water heater with tankless for energy savings.',
     'normal', 'estimate_converted',
     (CURRENT_DATE + INTERVAL '10 days' + INTERVAL '8 hours')::timestamp,
     (CURRENT_DATE + INTERVAL '10 days' + INTERVAL '14 hours')::timestamp,
     v_user_id, 385000,
     'Major installation. May need gas line upgrade. Permit required.'),

    (v_company_id, v_rachel_green_id, 'JOB-2024-' || LPAD((v_job_number + 4)::text, 4, '0'),
     'repair', 'scheduled', 'Furnace Making Loud Banging Noise',
     'Customer reports loud banging noise when furnace starts up. Happening for 2 weeks.',
     'high', 'phone',
     (CURRENT_DATE + INTERVAL '6 days' + INTERVAL '14 hours')::timestamp,
     (CURRENT_DATE + INTERVAL '6 days' + INTERVAL '16 hours')::timestamp,
     v_user_id, 15000,
     'Likely delayed ignition causing mini-explosion. Safety concern - prioritized.'),

    (v_company_id, v_medical_center_id, 'JOB-2024-' || LPAD((v_job_number + 5)::text, 4, '0'),
     'maintenance', 'scheduled', 'Monthly HVAC Inspection - Critical Systems',
     'Premium service plan: Monthly inspection of all critical HVAC systems including backups.',
     'high', 'service_plan',
     (CURRENT_DATE + INTERVAL '9 days' + INTERVAL '7 hours')::timestamp,
     (CURRENT_DATE + INTERVAL '9 days' + INTERVAL '11 hours')::timestamp,
     v_user_id, 0,
     'Medical facility - critical. Backup systems must be tested. Air quality report required.'),

    (v_company_id, v_restaurant_id, 'JOB-2024-' || LPAD((v_job_number + 6)::text, 4, '0'),
     'repair', 'scheduled', 'Walk-in Cooler Not Maintaining Temp',
     'Walk-in cooler temperature rising to 45°F. Should be 38°F. Food safety concern.',
     'urgent', 'phone',
     (CURRENT_DATE + INTERVAL '3 days' + INTERVAL '6 hours')::timestamp,
     (CURRENT_DATE + INTERVAL '3 days' + INTERVAL '10 hours')::timestamp,
     v_user_id, 55000,
     'Priority - food safety issue. Early morning appointment before restaurant opens.'),

    (v_company_id, v_james_kim_id, 'JOB-2024-' || LPAD((v_job_number + 7)::text, 4, '0'),
     'repair', 'scheduled', 'Bathroom Shower Low Water Pressure',
     'Master bathroom shower has very low pressure. Other fixtures OK.',
     'normal', 'email',
     (CURRENT_DATE + INTERVAL '12 days' + INTERVAL '10 hours')::timestamp,
     (CURRENT_DATE + INTERVAL '12 days' + INTERVAL '12 hours')::timestamp,
     v_user_id, 9500,
     'Likely clogged showerhead or pressure balance valve. Simple fix expected.'),

    (v_company_id, v_sarah_chen_id, 'JOB-2024-' || LPAD((v_job_number + 8)::text, 4, '0'),
     'maintenance', 'scheduled', 'Winter Pre-Check - All Systems',
     'Premium service plan: Pre-winter check of all 3 HVAC zones before cold weather.',
     'normal', 'service_plan',
     (CURRENT_DATE + INTERVAL '14 days' + INTERVAL '9 hours')::timestamp,
     (CURRENT_DATE + INTERVAL '14 days' + INTERVAL '13 hours')::timestamp,
     v_user_id, 0,
     'VIP customer. Comprehensive check all zones. Customer prefers weekday mornings.'),

    (v_company_id, v_emily_martinez_id, 'JOB-2024-' || LPAD((v_job_number + 9)::text, 4, '0'),
     'inspection', 'scheduled', 'Heat Pump Efficiency Check',
     'Customer on service plan. First winter with heat pumps. Wants efficiency evaluation.',
     'normal', 'service_plan',
     (CURRENT_DATE + INTERVAL '15 days' + INTERVAL '10 hours')::timestamp,
     (CURRENT_DATE + INTERVAL '15 days' + INTERVAL '12 hours')::timestamp,
     v_user_id, 0,
     'Educational visit. Customer learning about heat pump operation. Provide energy tips.');

  v_job_number := v_job_number + 10;

  RAISE NOTICE '  ✓ Created 40 jobs';

  -- ============================================================================
  -- SUMMARY
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '  Job Status Summary:';
  RAISE NOTICE '  - 25 Completed jobs (historical work)';
  RAISE NOTICE '  - 3 In Progress jobs (active work)';
  RAISE NOTICE '  - 12 Scheduled jobs (upcoming work)';
  RAISE NOTICE '';
  RAISE NOTICE '  Job Type Breakdown:';
  RAISE NOTICE '  - Maintenance: 12 jobs (service plans)';
  RAISE NOTICE '  - Repair: 18 jobs';
  RAISE NOTICE '  - Installation: 6 jobs';
  RAISE NOTICE '  - Diagnostic: 3 jobs';
  RAISE NOTICE '  - Inspection: 1 job';
  RAISE NOTICE '';
  RAISE NOTICE '  Total Revenue (completed jobs): ~$50,000';
  RAISE NOTICE '  Outstanding Balance (in progress + scheduled): ~$3,800,000';
  RAISE NOTICE '';

END $$;
