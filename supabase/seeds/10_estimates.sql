-- ============================================================================
-- SEED: Estimates
-- ============================================================================
-- Creates 15 estimates with realistic SF Bay Area pricing
-- ============================================================================

DO $$
DECLARE
  v_company_id UUID := current_setting('app.current_company_id')::uuid;
  v_user_id UUID := current_setting('app.current_user_id')::uuid;

  -- Customer IDs
  v_sarah_chen_id UUID;
  v_robert_williams_id UUID;
  v_amanda_lee_id UUID;
  v_jennifer_thompson_id UUID;
  v_kevin_chang_id UUID;
  v_james_kim_id UUID;
  v_maria_santos_id UUID;
  v_rachel_green_id UUID;
  v_david_park_id UUID;
  v_office_complex_id UUID;
  v_warehouse_id UUID;
  v_fitness_id UUID;

  -- Property IDs
  v_amanda_estate UUID;

  -- Price book item IDs
  v_carrier_furnace_80k UUID;
  v_lennox_ac_3ton UUID;
  v_rheem_water_heater UUID;

  v_estimate_number INTEGER := 1;

BEGIN

  RAISE NOTICE 'Seeding Estimates...';

  -- ============================================================================
  -- FETCH CUSTOMER IDS
  -- ============================================================================

  SELECT id INTO v_sarah_chen_id FROM customers WHERE email = 'sarah.chen@gmail.com';
  SELECT id INTO v_robert_williams_id FROM customers WHERE email = 'robert.williams@gmail.com';
  SELECT id INTO v_amanda_lee_id FROM customers WHERE email = 'amanda.lee@gmail.com';
  SELECT id INTO v_jennifer_thompson_id FROM customers WHERE email = 'jennifer.thompson@gmail.com';
  SELECT id INTO v_kevin_chang_id FROM customers WHERE email = 'kevin.chang@gmail.com';
  SELECT id INTO v_james_kim_id FROM customers WHERE email = 'james.kim@yahoo.com';
  SELECT id INTO v_maria_santos_id FROM customers WHERE email = 'maria.santos@gmail.com';
  SELECT id INTO v_rachel_green_id FROM customers WHERE email = 'rachel.green@gmail.com';
  SELECT id INTO v_david_park_id FROM customers WHERE email = 'david.park@gmail.com';
  SELECT id INTO v_office_complex_id FROM customers WHERE email = 'management@marinoffices.com';
  SELECT id INTO v_warehouse_id FROM customers WHERE email = 'operations@baywidelogistics.com';
  SELECT id INTO v_fitness_id FROM customers WHERE email = 'management@fitnessfirst.com';

  -- Get property
  SELECT id INTO v_amanda_estate FROM properties WHERE customer_id = v_amanda_lee_id LIMIT 1;

  -- ============================================================================
  -- APPROVED ESTIMATES (converted to jobs)
  -- ============================================================================

  -- Estimate 1: Amanda's zoned system (approved - now in progress as job)
  INSERT INTO estimates (
    company_id, customer_id, property_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    approved_at, approved_by,
    internal_notes
  ) VALUES (
    v_company_id, v_amanda_lee_id, v_amanda_estate,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Install 4-Zone HVAC System',
    'Complete HVAC system replacement for estate property. Two Trane 3-ton heat pumps (96 AFUE), new ductwork throughout, 4 zones with smart thermostats, old system removal and disposal.',
    'approved',
    2850000, 242250, 3092250,
    '2024-12-31'::date,
    v_user_id,
    '2024-11-15 14:30:00'::timestamp,
    v_user_id,
    'Large project. Customer approved premium Trane equipment. Installation scheduled Dec 2-6. 50% deposit received. Project in progress.'
  );
  v_estimate_number := v_estimate_number + 1;

  -- Estimate 2: Kevin's tankless water heater (approved - scheduled)
  INSERT INTO estimates (
    company_id, customer_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    approved_at, approved_by,
    internal_notes
  ) VALUES (
    v_company_id, v_kevin_chang_id,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Install Rinnai Tankless Water Heater',
    'Replace existing 50-gallon tank water heater with Rinnai RU199iN tankless unit (199,000 BTU). Includes gas line upgrade to 3/4", new venting, digital controller, installation, permit, and disposal of old unit.',
    'approved',
    385000, 32725, 417725,
    '2024-12-31'::date,
    v_user_id,
    '2024-11-25 10:15:00'::timestamp,
    v_user_id,
    'Customer excited about energy savings. Approved full proposal. Gas line needs upgrade - included in price. Permit applied for. Installation scheduled in 10 days.'
  );
  v_estimate_number := v_estimate_number + 1;

  -- Estimate 3: Office complex economizer repair (approved)
  INSERT INTO estimates (
    company_id, customer_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    approved_at, approved_by,
    internal_notes
  ) VALUES (
    v_company_id, v_office_complex_id,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Repair RTU-3 Economizer',
    'Repair failed economizer on rooftop unit #3. Replace economizer actuator, controller, and sensors. Recalibrate system for optimal free cooling operation.',
    'approved',
    185000, 15725, 200725,
    '2024-12-15'::date,
    v_user_id,
    '2024-11-28 16:45:00'::timestamp,
    v_user_id,
    'Found during energy audit diagnostic. Customer approved immediately - wants to reduce cooling costs. Will save ~$2,000/year in energy. Parts ordered, awaiting delivery.'
  );
  v_estimate_number := v_estimate_number + 1;

  -- ============================================================================
  -- PENDING ESTIMATES (awaiting customer decision)
  -- ============================================================================

  -- Estimate 4: Robert's furnace replacement (pending - customer considering)
  INSERT INTO estimates (
    company_id, customer_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    sent_at,
    internal_notes
  ) VALUES (
    v_company_id, v_robert_williams_id,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Replace Aging Furnace - Safety Priority',
    'URGENT: Replace unsafe 1960s furnace with new Carrier 96 AFUE 80,000 BTU gas furnace. Includes new thermostat, code-compliant venting, installation, permit, old furnace removal. Current furnace has cracked heat exchanger - carbon monoxide risk.',
    'pending',
    485000, 41225, 526225,
    '2025-01-15'::date,
    v_user_id,
    '2024-11-05 15:30:00'::timestamp,
    'CRITICAL - Safety issue. Customer''s old furnace is dangerous. Provided 3 options (80%, 90%, 95% AFUE). This is mid-range 96% option. Customer budget-conscious. Following up weekly. May offer financing.'
  );
  v_estimate_number := v_estimate_number + 1;

  -- Estimate 5: Commercial warehouse HVAC zones
  INSERT INTO estimates (
    company_id, customer_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    sent_at,
    internal_notes
  ) VALUES (
    v_company_id, v_warehouse_id,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Add Zone Control to Warehouse HVAC',
    'Install zone dampers and controls for 3 existing rooftop units. Create 6 temperature zones (office, break room, 4 warehouse sections). Reduce energy waste by heating/cooling only occupied areas.',
    'pending',
    1250000, 106250, 1356250,
    '2025-01-31'::date,
    v_user_id,
    '2024-11-18 11:00:00'::timestamp,
    'Large commercial project. Customer concerned about heating empty warehouse areas. ROI is 3-4 years in energy savings. Waiting on approval from corporate. Follow up scheduled Dec 15.'
  );
  v_estimate_number := v_estimate_number + 1;

  -- Estimate 6: Sarah's wine cellar cooling
  INSERT INTO estimates (
    company_id, customer_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    sent_at,
    internal_notes
  ) VALUES (
    v_company_id, v_sarah_chen_id,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Install Wine Cellar Cooling System',
    'Install dedicated cooling system for new 500-bottle wine cellar. WhisperKOOL 4000 through-wall unit, humidity control, temperature monitoring with alerts, professional installation.',
    'pending',
    425000, 36125, 461125,
    '2025-01-20'::date,
    v_user_id,
    '2024-11-22 14:00:00'::timestamp,
    'VIP customer. New wine cellar under construction. Temperature must be 55-58°F with 60-70% humidity. Customer wants best system - not price shopping. Awaiting cellar completion date.'
  );
  v_estimate_number := v_estimate_number + 1;

  -- Estimate 7: Fitness club locker room ventilation
  INSERT INTO estimates (
    company_id, customer_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    sent_at,
    internal_notes
  ) VALUES (
    v_company_id, v_fitness_id,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Upgrade Locker Room Ventilation',
    'Enhance locker room exhaust ventilation. Install 2 additional exhaust fans (800 CFM each), upgraded ductwork, motion sensors for automatic operation, humidity controls.',
    'pending',
    185000, 15725, 200725,
    '2024-12-31'::date,
    v_user_id,
    '2024-11-20 09:30:00'::timestamp,
    'Member complaints about locker room odors and humidity. Current system inadequate. Proposal sent to facility manager. Budget available but needs board approval. Decision expected by year end.'
  );
  v_estimate_number := v_estimate_number + 1;

  -- Estimate 8: Residential radiant floor heating
  INSERT INTO estimates (
    company_id, customer_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    sent_at,
    internal_notes
  ) VALUES (
    v_company_id, v_jennifer_thompson_id,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Install Radiant Floor Heating - Master Bath',
    'Install electric radiant floor heating in master bathroom remodel (120 sq ft). Includes heating mat, programmable thermostat, installation, electrical work.',
    'pending',
    325000, 27625, 352625,
    '2025-02-01'::date,
    v_user_id,
    '2024-11-26 13:15:00'::timestamp,
    'Part of larger bathroom remodel. Customer wants heated floors. Coordinating with general contractor. Installation window is January. Waiting on remodel schedule confirmation.'
  );
  v_estimate_number := v_estimate_number + 1;

  -- ============================================================================
  -- DECLINED ESTIMATES
  -- ============================================================================

  -- Estimate 9: Whole house generator (too expensive)
  INSERT INTO estimates (
    company_id, customer_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    sent_at,
    declined_at,
    declined_reason,
    internal_notes
  ) VALUES (
    v_company_id, v_david_park_id,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Install Whole House Backup Generator',
    'Install Generac 22kW standby generator with automatic transfer switch. Natural gas powered, covers entire house, professional installation, permit included.',
    'declined',
    1850000, 157250, 2007250,
    '2024-11-30'::date,
    v_user_id,
    '2024-10-15 10:00:00'::timestamp,
    '2024-10-28 14:20:00'::timestamp,
    'Customer decided system is too expensive. Purchased portable generator instead.',
    'Customer inquired after power outage. Price shock when seeing estimate. Opted for $1,200 portable generator from Costco. Can revisit if future outages.'
  );
  v_estimate_number := v_estimate_number + 1;

  -- Estimate 10: Mini-split addition (customer moved)
  INSERT INTO estimates (
    company_id, customer_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    sent_at,
    declined_at,
    declined_reason,
    internal_notes
  ) VALUES (
    v_company_id, v_james_kim_id,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Add Mini-Split to Home Office',
    'Install Mitsubishi 12,000 BTU mini-split for converted garage home office. Includes outdoor unit, indoor wall unit, installation, electrical work.',
    'declined',
    425000, 36125, 461125,
    '2024-10-31'::date,
    v_user_id,
    '2024-09-15 11:00:00'::timestamp,
    '2024-10-05 09:00:00'::timestamp,
    'Customer relocated for new job. No longer needs system.',
    'Customer very interested initially. Accepted new job out of state. Put house on market. Lost opportunity due to relocation.'
  );
  v_estimate_number := v_estimate_number + 1;

  -- Estimate 11: Commercial kitchen hood (went with another contractor)
  INSERT INTO estimates (
    company_id, customer_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    sent_at,
    declined_at,
    declined_reason,
    internal_notes
  ) VALUES (
    v_company_id, v_fitness_id,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Replace Kitchen Exhaust Hood - Cafe',
    'Replace aging exhaust hood in cafe kitchen. New code-compliant hood with fire suppression, make-up air system, ductwork modifications.',
    'declined',
    2850000, 242250, 3092250,
    '2024-11-15'::date,
    v_user_id,
    '2024-10-20 14:30:00'::timestamp,
    '2024-11-10 10:45:00'::timestamp,
    'Customer selected competitor with lower bid.',
    'Competitive bid situation. Our price was $3,500 higher. Customer went with lowest bidder. We could have matched but questionable profit. Let it go.'
  );
  v_estimate_number := v_estimate_number + 1;

  -- ============================================================================
  -- DRAFT ESTIMATES (not yet sent)
  -- ============================================================================

  -- Estimate 12: Ductless mini-split for addition
  INSERT INTO estimates (
    company_id, customer_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    internal_notes
  ) VALUES (
    v_company_id, v_rachel_green_id,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Multi-Zone Mini-Split for New Addition',
    'Install Mitsubishi multi-zone system for 800 sq ft addition. 1 outdoor unit (24,000 BTU), 2 indoor units (12K living room, 9K bedroom), installation, electrical.',
    'draft',
    625000, 53125, 678125,
    '2025-01-31'::date,
    v_user_id,
    'Site visit completed. Measurements taken. Customer''s addition under construction. Estimate ready to send once framing inspection passes. Expecting to send in 2 weeks.'
  );
  v_estimate_number := v_estimate_number + 1;

  -- Estimate 13: Commercial boiler replacement
  INSERT INTO estimates (
    company_id, customer_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    internal_notes
  ) VALUES (
    v_company_id, v_office_complex_id,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Replace Aging Boiler System',
    'Replace 25-year-old boiler with new high-efficiency condensing boiler (300,000 BTU). Includes removal, installation, new piping, controls upgrade, permit.',
    'draft',
    3500000, 297500, 3797500,
    '2025-02-28'::date,
    v_user_id,
    'Large project. Current boiler still functional but inefficient. Planned replacement for spring 2025. Estimate in draft - awaiting budget approval cycle. Will present in January board meeting.'
  );
  v_estimate_number := v_estimate_number + 1;

  -- Estimate 14: Residential air purification
  INSERT INTO estimates (
    company_id, customer_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    internal_notes
  ) VALUES (
    v_company_id, v_maria_santos_id,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Whole House Air Purification System',
    'Install Aprilaire 5000 whole-house air purifier with HEPA filtration. Integrates with existing HVAC system. Removes allergens, smoke, odors, viruses.',
    'draft',
    185000, 15725, 200725,
    '2025-01-15'::date,
    v_user_id,
    'Customer has allergies, interested in better air quality. Need to schedule follow-up site visit to confirm existing system compatibility. Draft estimate based on phone consultation.'
  );
  v_estimate_number := v_estimate_number + 1;

  -- Estimate 15: Sewer line repair
  INSERT INTO estimates (
    company_id, customer_id,
    estimate_number, title, description, status,
    subtotal, tax, total,
    valid_until, created_by,
    internal_notes
  ) VALUES (
    v_company_id, v_david_park_id,
    'EST-2024-' || LPAD(v_estimate_number::text, 4, '0'),
    'Trenchless Sewer Line Repair',
    'Repair damaged sewer line using trenchless pipe lining method. Camera inspection, cleaning, epoxy pipe lining (40 linear feet), no excavation required.',
    'draft',
    725000, 61625, 786625,
    '2025-01-10'::date,
    v_user_id,
    'Customer experiencing slow drains throughout house. Camera inspection scheduled for next week. Estimate is preliminary based on typical 40-ft residential main. May adjust after inspection.'
  );
  v_estimate_number := v_estimate_number + 1;

  RAISE NOTICE '  ✓ Created 15 estimates';

  -- ============================================================================
  -- SUMMARY
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '  Estimate Status Summary:';
  RAISE NOTICE '  - 3 Approved ($3,710,700 - converted to jobs)';
  RAISE NOTICE '  - 5 Pending ($2,890,925 - awaiting decision)';
  RAISE NOTICE '  - 3 Declined ($5,560,500 - lost opportunities)';
  RAISE NOTICE '  - 4 Draft ($5,463,475 - not yet sent)';
  RAISE NOTICE '';
  RAISE NOTICE '  Pending Pipeline Value: $2.89M';
  RAISE NOTICE '  Average Estimate Value: $1,178,680';
  RAISE NOTICE '';

END $$;
