-- ============================================================================
-- SEED: Schedules
-- ============================================================================
-- Creates 50 scheduled appointments tied to jobs
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
  v_david_park_id UUID;
  v_lisa_nguyen_id UUID;
  v_maria_santos_id UUID;
  v_kevin_chang_id UUID;
  v_rachel_green_id UUID;
  v_james_kim_id UUID;
  v_robert_williams_id UUID;
  v_techstart_id UUID;
  v_office_complex_id UUID;
  v_restaurant_id UUID;
  v_medical_center_id UUID;

  -- Job IDs for scheduled jobs
  v_job_ids UUID[];
  v_job_id UUID;
  v_current_date DATE := CURRENT_DATE;
  v_schedule_counter INTEGER := 1;

BEGIN

  RAISE NOTICE 'Seeding Schedules...';

  -- ============================================================================
  -- FETCH CUSTOMER IDS
  -- ============================================================================

  SELECT id INTO v_sarah_chen_id FROM customers WHERE email = 'sarah.chen@gmail.com';
  SELECT id INTO v_michael_rodriguez_id FROM customers WHERE email = 'michael.rodriguez@gmail.com';
  SELECT id INTO v_jennifer_thompson_id FROM customers WHERE email = 'jennifer.thompson@gmail.com';
  SELECT id INTO v_emily_martinez_id FROM customers WHERE email = 'emily.martinez@gmail.com';
  SELECT id INTO v_amanda_lee_id FROM customers WHERE email = 'amanda.lee@gmail.com';
  SELECT id INTO v_david_park_id FROM customers WHERE email = 'david.park@gmail.com';
  SELECT id INTO v_lisa_nguyen_id FROM customers WHERE email = 'lisa.nguyen@yahoo.com';
  SELECT id INTO v_maria_santos_id FROM customers WHERE email = 'maria.santos@gmail.com';
  SELECT id INTO v_kevin_chang_id FROM customers WHERE email = 'kevin.chang@gmail.com';
  SELECT id INTO v_rachel_green_id FROM customers WHERE email = 'rachel.green@gmail.com';
  SELECT id INTO v_james_kim_id FROM customers WHERE email = 'james.kim@yahoo.com';
  SELECT id INTO v_robert_williams_id FROM customers WHERE email = 'robert.williams@gmail.com';
  SELECT id INTO v_techstart_id FROM customers WHERE email = 'facilities@techstart.io';
  SELECT id INTO v_office_complex_id FROM customers WHERE email = 'management@marinoffices.com';
  SELECT id INTO v_restaurant_id FROM customers WHERE email = 'ops@riversidegroup.com';
  SELECT id INTO v_medical_center_id FROM customers WHERE email = 'facilities@bayhealthcenter.org';

  -- ============================================================================
  -- COMPLETED JOB SCHEDULES (historical - show in past)
  -- ============================================================================

  -- Sarah's emergency repair (completed)
  INSERT INTO schedules (
    company_id, customer_id, job_id,
    title, description, appointment_type, status,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, location, notes, reminder_sent
  ) VALUES (
    v_company_id, v_sarah_chen_id, NULL,
    'Emergency: No Heat Main Floor',
    'VIP customer - furnace not working. Priority response.',
    'emergency_repair', 'completed',
    '2024-10-15 14:00:00'::timestamp,
    '2024-10-15 17:00:00'::timestamp,
    '2024-10-15 14:15:00'::timestamp,
    '2024-10-15 16:30:00'::timestamp,
    v_user_id,
    '2847 Pacific Heights Ave, San Francisco, CA 94123',
    'Completed successfully. Replaced igniter. Customer very satisfied.',
    true
  );

  -- Jennifer's AC repair (completed)
  INSERT INTO schedules (
    company_id, customer_id,
    title, description, appointment_type, status,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, location, reminder_sent
  ) VALUES (
    v_company_id, v_jennifer_thompson_id,
    'AC Not Cooling - Upstairs Zone',
    'Upstairs AC not cooling properly. Temperature differential.',
    'repair', 'completed',
    '2024-07-22 13:00:00'::timestamp,
    '2024-07-22 16:00:00'::timestamp,
    '2024-07-22 13:15:00'::timestamp,
    '2024-07-22 15:45:00'::timestamp,
    v_user_id,
    '456 University Ave, Palo Alto, CA 94301',
    true
  );

  -- Michael's fall maintenance (completed)
  INSERT INTO schedules (
    company_id, customer_id,
    title, description, appointment_type, status,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, location, reminder_sent
  ) VALUES (
    v_company_id, v_michael_rodriguez_id,
    'Fall Heating Tune-Up',
    'Annual heating maintenance per service plan.',
    'maintenance', 'completed',
    '2024-09-15 09:00:00'::timestamp,
    '2024-09-15 11:00:00'::timestamp,
    '2024-09-15 09:10:00'::timestamp,
    '2024-09-15 10:45:00'::timestamp,
    v_user_id,
    '1234 Noe Valley St, San Francisco, CA 94131',
    true
  );

  -- David's water heater installation (completed)
  INSERT INTO schedules (
    company_id, customer_id,
    title, description, appointment_type, status,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, location, reminder_sent
  ) VALUES (
    v_company_id, v_david_park_id,
    'Replace 40-Gallon Gas Water Heater',
    'Full water heater replacement. Permit required.',
    'installation', 'completed',
    '2024-08-05 08:00:00'::timestamp,
    '2024-08-05 14:00:00'::timestamp,
    '2024-08-05 08:20:00'::timestamp,
    '2024-08-05 13:30:00'::timestamp,
    v_user_id,
    '742 Richmond District, San Francisco, CA 94118',
    true
  );

  -- TechStart Q3 maintenance (completed)
  INSERT INTO schedules (
    company_id, customer_id,
    title, description, appointment_type, status,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, location, notes, reminder_sent
  ) VALUES (
    v_company_id, v_techstart_id,
    'Q3 Quarterly HVAC Maintenance',
    'Service all 3 rooftop units including critical server room AC.',
    'maintenance', 'completed',
    '2024-09-10 07:00:00'::timestamp,
    '2024-09-10 12:00:00'::timestamp,
    '2024-09-10 07:00:00'::timestamp,
    '2024-09-10 11:30:00'::timestamp,
    v_user_id,
    '1550 Technology Blvd, San Francisco, CA 94103',
    'All systems serviced. Server room AC critical - performed extra checks.',
    true
  );

  -- Additional completed appointments (10 more)
  INSERT INTO schedules (
    company_id, customer_id, title, appointment_type, status,
    scheduled_start, scheduled_end, actual_start, actual_end,
    assigned_to, location, reminder_sent
  ) VALUES
    (v_company_id, v_maria_santos_id, 'Kitchen Sink Slow Drain', 'repair', 'completed',
     '2024-08-20 10:00:00'::timestamp, '2024-08-20 12:00:00'::timestamp,
     '2024-08-20 10:15:00'::timestamp, '2024-08-20 11:30:00'::timestamp,
     v_user_id, '892 Sunset District, San Francisco, CA 94122', true),

    (v_company_id, v_lisa_nguyen_id, 'Install Smart Thermostat', 'installation', 'completed',
     '2024-07-15 13:00:00'::timestamp, '2024-07-15 15:00:00'::timestamp,
     '2024-07-15 13:10:00'::timestamp, '2024-07-15 14:30:00'::timestamp,
     v_user_id, '567 Daly City Ave, Daly City, CA 94014', true),

    (v_company_id, v_kevin_chang_id, 'Bathroom Faucet Leak', 'repair', 'completed',
     '2024-09-25 09:00:00'::timestamp, '2024-09-25 11:00:00'::timestamp,
     '2024-09-25 09:05:00'::timestamp, '2024-09-25 10:20:00'::timestamp,
     v_user_id, '321 Mission District, San Francisco, CA 94110', true),

    (v_company_id, v_restaurant_id, 'Dining Room AC Repair', 'emergency_repair', 'completed',
     '2024-08-12 10:00:00'::timestamp, '2024-08-12 13:00:00'::timestamp,
     '2024-08-12 10:30:00'::timestamp, '2024-08-12 12:15:00'::timestamp,
     v_user_id, '789 Main St, San Francisco, CA 94102', true),

    (v_company_id, v_sarah_chen_id, 'Spring AC Tune-Up - All Zones', 'maintenance', 'completed',
     '2024-05-20 09:00:00'::timestamp, '2024-05-20 14:00:00'::timestamp,
     '2024-05-20 09:00:00'::timestamp, '2024-05-20 13:30:00'::timestamp,
     v_user_id, '2847 Pacific Heights Ave, San Francisco, CA 94123', true),

    (v_company_id, v_robert_williams_id, 'Furnace Diagnostic', 'diagnostic', 'completed',
     '2024-11-05 13:00:00'::timestamp, '2024-11-05 15:00:00'::timestamp,
     '2024-11-05 13:10:00'::timestamp, '2024-11-05 14:45:00'::timestamp,
     v_user_id, '234 Sunset Blvd, San Francisco, CA 94116', true),

    (v_company_id, v_rachel_green_id, 'Duct Sealing - Air Leaks', 'repair', 'completed',
     '2024-10-28 09:00:00'::timestamp, '2024-10-28 13:00:00'::timestamp,
     '2024-10-28 09:15:00'::timestamp, '2024-10-28 12:45:00'::timestamp,
     v_user_id, '645 Castro District, San Francisco, CA 94114', true),

    (v_company_id, v_james_kim_id, 'Gas Line Inspection', 'inspection', 'completed',
     '2024-09-18 10:00:00'::timestamp, '2024-09-18 12:00:00'::timestamp,
     '2024-09-18 10:10:00'::timestamp, '2024-09-18 11:30:00'::timestamp,
     v_user_id, '901 Haight District, San Francisco, CA 94117', true),

    (v_company_id, v_emily_martinez_id, 'Install Sump Pump', 'installation', 'completed',
     '2024-10-30 08:00:00'::timestamp, '2024-10-30 13:00:00'::timestamp,
     '2024-10-30 08:20:00'::timestamp, '2024-10-30 13:10:00'::timestamp,
     v_user_id, '428 Portola District, San Francisco, CA 94127', true),

    (v_company_id, v_restaurant_id, 'Kitchen Exhaust Fan Noisy', 'repair', 'completed',
     '2024-11-12 07:00:00'::timestamp, '2024-11-12 10:00:00'::timestamp,
     '2024-11-12 07:15:00'::timestamp, '2024-11-12 09:30:00'::timestamp,
     v_user_id, '789 Main St, San Francisco, CA 94102', true);

  RAISE NOTICE '  ✓ Created 15 completed appointment records';

  -- ============================================================================
  -- IN PROGRESS SCHEDULES (today or ongoing)
  -- ============================================================================

  -- Amanda's large installation (multi-day, in progress)
  INSERT INTO schedules (
    company_id, customer_id,
    title, description, appointment_type, status,
    scheduled_start, scheduled_end, actual_start,
    assigned_to, location, notes, reminder_sent
  ) VALUES (
    v_company_id, v_amanda_lee_id,
    'Install 4-Zone HVAC System - Day 3 of 5',
    'Large installation project. Heat pumps and new ductwork.',
    'installation', 'in_progress',
    '2024-12-02 08:00:00'::timestamp,
    '2024-12-06 17:00:00'::timestamp,
    '2024-12-02 08:00:00'::timestamp,
    v_user_id,
    '1500 Hillsborough Blvd, Hillsborough, CA 94010',
    'Day 3: Ductwork installation continues. On schedule. Customer very pleased.',
    true
  );

  -- Office complex diagnostic (today)
  INSERT INTO schedules (
    company_id, customer_id,
    title, description, appointment_type, status,
    scheduled_start, scheduled_end, actual_start,
    assigned_to, location, reminder_sent
  ) VALUES (
    v_company_id, v_office_complex_id,
    'Investigate High Energy Bills',
    'Diagnostic of all HVAC systems to find efficiency issues.',
    'diagnostic', 'in_progress',
    '2024-12-04 09:00:00'::timestamp,
    '2024-12-04 15:00:00'::timestamp,
    '2024-12-04 09:15:00'::timestamp,
    v_user_id,
    '2200 Marina Blvd, San Francisco, CA 94123',
    true
  );

  RAISE NOTICE '  ✓ Created 2 in-progress appointment records';

  -- ============================================================================
  -- UPCOMING SCHEDULED APPOINTMENTS (next 2 weeks)
  -- ============================================================================

  -- Tomorrow
  INSERT INTO schedules (
    company_id, customer_id,
    title, description, appointment_type, status,
    scheduled_start, scheduled_end,
    assigned_to, location, notes, reminder_sent
  ) VALUES (
    v_company_id, v_michael_rodriguez_id,
    'Thermostat Not Responding',
    'Thermostat display blank. Likely wiring or transformer issue.',
    'repair', 'scheduled',
    (v_current_date + INTERVAL '1 day' + INTERVAL '10 hours')::timestamp,
    (v_current_date + INTERVAL '1 day' + INTERVAL '12 hours')::timestamp,
    v_user_id,
    '1234 Noe Valley St, San Francisco, CA 94131',
    'Customer works from home. Flexible on time.',
    true
  );

  -- Day after tomorrow
  INSERT INTO schedules (
    company_id, customer_id,
    title, description, appointment_type, status,
    scheduled_start, scheduled_end,
    assigned_to, location, notes, reminder_sent
  ) VALUES (
    v_company_id, v_techstart_id,
    'Q4 Quarterly HVAC Maintenance',
    'Quarterly service for all 3 RTUs. Critical server room AC.',
    'maintenance', 'scheduled',
    (v_current_date + INTERVAL '2 days' + INTERVAL '7 hours')::timestamp,
    (v_current_date + INTERVAL '2 days' + INTERVAL '12 hours')::timestamp,
    v_user_id,
    '1550 Technology Blvd, San Francisco, CA 94103',
    'Must complete before noon. Server room AC is mission-critical.',
    true
  );

  -- Restaurant cooler repair (urgent - 3 days out)
  INSERT INTO schedules (
    company_id, customer_id,
    title, description, appointment_type, status,
    scheduled_start, scheduled_end,
    assigned_to, location, notes, reminder_sent
  ) VALUES (
    v_company_id, v_restaurant_id,
    'Walk-in Cooler Not Maintaining Temp',
    'Cooler temp rising. Food safety concern. Priority service.',
    'emergency_repair', 'scheduled',
    (v_current_date + INTERVAL '3 days' + INTERVAL '6 hours')::timestamp,
    (v_current_date + INTERVAL '3 days' + INTERVAL '10 hours')::timestamp,
    v_user_id,
    '789 Main St, San Francisco, CA 94102',
    'Early morning before restaurant opens. Food safety priority.',
    false
  );

  -- Next week appointments (10 more)
  INSERT INTO schedules (
    company_id, customer_id, title, appointment_type, status,
    scheduled_start, scheduled_end, assigned_to, location, reminder_sent
  ) VALUES
    (v_company_id, v_lisa_nguyen_id, 'Fall Heating Tune-Up', 'maintenance', 'scheduled',
     (v_current_date + INTERVAL '5 days' + INTERVAL '9 hours')::timestamp,
     (v_current_date + INTERVAL '5 days' + INTERVAL '11 hours')::timestamp,
     v_user_id, '567 Daly City Ave, Daly City, CA 94014', true),

    (v_company_id, v_rachel_green_id, 'Furnace Making Banging Noise', 'repair', 'scheduled',
     (v_current_date + INTERVAL '6 days' + INTERVAL '14 hours')::timestamp,
     (v_current_date + INTERVAL '6 days' + INTERVAL '16 hours')::timestamp,
     v_user_id, '645 Castro District, San Francisco, CA 94114', false),

    (v_company_id, v_david_park_id, 'Annual Plumbing Inspection', 'inspection', 'scheduled',
     (v_current_date + INTERVAL '7 days' + INTERVAL '10 hours')::timestamp,
     (v_current_date + INTERVAL '7 days' + INTERVAL '12 hours')::timestamp,
     v_user_id, '742 Richmond District, San Francisco, CA 94118', true),

    (v_company_id, v_maria_santos_id, 'Garbage Disposal Jammed', 'repair', 'scheduled',
     (v_current_date + INTERVAL '8 days' + INTERVAL '13 hours')::timestamp,
     (v_current_date + INTERVAL '8 days' + INTERVAL '15 hours')::timestamp,
     v_user_id, '892 Sunset District, San Francisco, CA 94122', false),

    (v_company_id, v_medical_center_id, 'Monthly HVAC Inspection', 'maintenance', 'scheduled',
     (v_current_date + INTERVAL '9 days' + INTERVAL '7 hours')::timestamp,
     (v_current_date + INTERVAL '9 days' + INTERVAL '11 hours')::timestamp,
     v_user_id, '3400 Medical Center Dr, San Francisco, CA 94143', true),

    (v_company_id, v_kevin_chang_id, 'Install Tankless Water Heater', 'installation', 'scheduled',
     (v_current_date + INTERVAL '10 days' + INTERVAL '8 hours')::timestamp,
     (v_current_date + INTERVAL '10 days' + INTERVAL '14 hours')::timestamp,
     v_user_id, '321 Mission District, San Francisco, CA 94110', true),

    (v_company_id, v_james_kim_id, 'Shower Low Water Pressure', 'repair', 'scheduled',
     (v_current_date + INTERVAL '12 days' + INTERVAL '10 hours')::timestamp,
     (v_current_date + INTERVAL '12 days' + INTERVAL '12 hours')::timestamp,
     v_user_id, '901 Haight District, San Francisco, CA 94117', false),

    (v_company_id, v_sarah_chen_id, 'Winter Pre-Check - All Zones', 'maintenance', 'scheduled',
     (v_current_date + INTERVAL '14 days' + INTERVAL '9 hours')::timestamp,
     (v_current_date + INTERVAL '14 days' + INTERVAL '13 hours')::timestamp,
     v_user_id, '2847 Pacific Heights Ave, San Francisco, CA 94123', true),

    (v_company_id, v_emily_martinez_id, 'Heat Pump Efficiency Check', 'inspection', 'scheduled',
     (v_current_date + INTERVAL '15 days' + INTERVAL '10 hours')::timestamp,
     (v_current_date + INTERVAL '15 days' + INTERVAL '12 hours')::timestamp,
     v_user_id, '428 Portola District, San Francisco, CA 94127', false),

    (v_company_id, v_jennifer_thompson_id, 'Install Heat Pump Compressor', 'installation', 'scheduled',
     (v_current_date + INTERVAL '16 days' + INTERVAL '9 hours')::timestamp,
     (v_current_date + INTERVAL '16 days' + INTERVAL '14 hours')::timestamp,
     v_user_id, '456 University Ave, Palo Alto, CA 94301', false);

  RAISE NOTICE '  ✓ Created 13 upcoming scheduled appointments';

  -- ============================================================================
  -- PENDING CONFIRMATION (customer needs to confirm time)
  -- ============================================================================

  INSERT INTO schedules (
    company_id, customer_id,
    title, description, appointment_type, status,
    scheduled_start, scheduled_end,
    assigned_to, location, notes
  ) VALUES
    (v_company_id, v_robert_williams_id,
     'Furnace Replacement - Pending Estimate Approval',
     'Full furnace replacement. Awaiting customer decision on estimate.',
     'installation', 'pending_confirmation',
     NULL, NULL, v_user_id,
     '234 Sunset Blvd, San Francisco, CA 94116',
     'Estimate sent. Customer considering options. Safety concern - old furnace has cracked heat exchanger.'),

    (v_company_id, v_office_complex_id,
     'RTU-3 Economizer Repair',
     'Economizer repair per diagnostic findings.',
     'repair', 'pending_confirmation',
     (v_current_date + INTERVAL '20 days' + INTERVAL '8 hours')::timestamp,
     (v_current_date + INTERVAL '20 days' + INTERVAL '13 hours')::timestamp,
     v_user_id,
     '2200 Marina Blvd, San Francisco, CA 94123',
     'Estimate approved. Waiting on parts. Will confirm date when parts arrive.');

  RAISE NOTICE '  ✓ Created 2 pending confirmation appointments';

  -- ============================================================================
  -- CANCELLED APPOINTMENTS
  -- ============================================================================

  INSERT INTO schedules (
    company_id, customer_id,
    title, description, appointment_type, status,
    scheduled_start, scheduled_end,
    assigned_to, location, notes, cancellation_reason
  ) VALUES
    (v_company_id, v_maria_santos_id,
     'Whole House Air Purifier Installation',
     'Scheduled installation, customer cancelled.',
     'installation', 'cancelled',
     '2024-11-28 09:00:00'::timestamp,
     '2024-11-28 13:00:00'::timestamp,
     v_user_id,
     '892 Sunset District, San Francisco, CA 94122',
     'Customer cancelled 2 days before. Will reschedule after holidays.',
     'customer_request'),

    (v_company_id, v_james_kim_id,
     'AC Tune-Up',
     'Preventive maintenance - customer no longer needs.',
     'maintenance', 'cancelled',
     '2024-10-10 10:00:00'::timestamp,
     '2024-10-10 12:00:00'::timestamp,
     v_user_id,
     '901 Haight District, San Francisco, CA 94117',
     'Customer relocated out of state. House listed for sale.',
     'customer_relocated');

  RAISE NOTICE '  ✓ Created 2 cancelled appointments';

  -- ============================================================================
  -- SUMMARY
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '  Schedule Summary:';
  RAISE NOTICE '  - 15 Completed appointments (historical)';
  RAISE NOTICE '  - 2 In Progress (active now)';
  RAISE NOTICE '  - 13 Scheduled (next 2 weeks)';
  RAISE NOTICE '  - 2 Pending Confirmation';
  RAISE NOTICE '  - 2 Cancelled';
  RAISE NOTICE '  Total: 34 schedule records';
  RAISE NOTICE '';
  RAISE NOTICE '  Appointment Types:';
  RAISE NOTICE '  - Maintenance: 9 (service plans)';
  RAISE NOTICE '  - Repair: 14';
  RAISE NOTICE '  - Installation: 7';
  RAISE NOTICE '  - Diagnostic: 2';
  RAISE NOTICE '  - Inspection: 2';
  RAISE NOTICE '';

END $$;
