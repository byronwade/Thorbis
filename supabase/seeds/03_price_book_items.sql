-- ============================================================================
-- SEED: Price Book Items
-- ============================================================================
-- Creates 120+ realistic HVAC & Plumbing items with SF Bay Area pricing
-- All prices in cents (multiply by 100)
-- ============================================================================

DO $$
DECLARE
  v_company_id UUID := current_setting('app.current_company_id')::uuid;
  v_category_id UUID;
BEGIN

  RAISE NOTICE 'Seeding Price Book Items...';

  -- ============================================================================
  -- HVAC FURNACES (Gas Furnaces category)
  -- ============================================================================

  SELECT id INTO v_category_id FROM price_book_categories
  WHERE company_id = v_company_id AND slug = 'furnaces' LIMIT 1;

  INSERT INTO price_book_items (company_id, category_id, item_type, name, description, sku, cost, price, markup_percent, unit, is_active, is_taxable, tags)
  VALUES
    (v_company_id, v_category_id, 'equipment', 'Carrier 80% AFUE Gas Furnace - 60,000 BTU', '60K BTU single-stage gas furnace, 80% efficiency', 'CARR-FUR-60-80', 180000, 289500, 6083, 'unit', true, true, '["furnace", "carrier", "gas"]'::jsonb),
    (v_company_id, v_category_id, 'equipment', 'Carrier 95% AFUE Gas Furnace - 80,000 BTU', '80K BTU two-stage gas furnace, 95% high efficiency', 'CARR-FUR-80-95', 250000, 409500, 6380, 'unit', true, true, '["furnace", "carrier", "gas", "high-efficiency"]'::jsonb),
    (v_company_id, v_category_id, 'equipment', 'Lennox SLP98V Variable Speed Gas Furnace - 100,000 BTU', '100K BTU variable speed, 98% AFUE, ultra quiet', 'LENN-SLP98-100', 350000, 579500, 6557, 'unit', true, true, '["furnace", "lennox", "gas", "variable-speed"]'::jsonb),
    (v_company_id, v_category_id, 'equipment', 'Trane XC95m Modulating Gas Furnace - 60,000 BTU', '60K BTU modulating furnace, 97% AFUE', 'TRAN-XC95-60', 320000, 529500, 6547, 'unit', true, true, '["furnace", "trane", "gas", "modulating"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Furnace Installation - Standard', 'Standard furnace installation labor and materials', 'SERV-FUR-INST-STD', 80000, 149500, 8687, 'job', true, true, '["service", "installation", "furnace"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Furnace Installation - Complex', 'Complex installation with ductwork modifications', 'SERV-FUR-INST-CPX', 150000, 279500, 8633, 'job', true, true, '["service", "installation", "furnace", "complex"]'::jsonb);

  RAISE NOTICE '  ✓ Created 6 furnace items';

  -- ============================================================================
  -- HVAC COOLING (Central AC category)
  -- ============================================================================

  SELECT id INTO v_category_id FROM price_book_categories
  WHERE company_id = v_company_id AND slug = 'central-ac' LIMIT 1;

  INSERT INTO price_book_items (company_id, category_id, item_type, name, description, sku, cost, price, markup_percent, unit, is_active, is_taxable, tags)
  VALUES
    (v_company_id, v_category_id, 'equipment', 'Carrier 14 SEER 2-Ton Central AC Unit', '2-ton, 14 SEER, standard efficiency', 'CARR-AC-2T-14', 220000, 359500, 6341, 'unit', true, true, '["ac", "carrier", "2-ton"]'::jsonb),
    (v_company_id, v_category_id, 'equipment', 'Carrier 16 SEER 3-Ton Central AC Unit', '3-ton, 16 SEER, high efficiency', 'CARR-AC-3T-16', 280000, 459500, 6411, 'unit', true, true, '["ac", "carrier", "3-ton", "high-efficiency"]'::jsonb),
    (v_company_id, v_category_id, 'equipment', 'Trane XR17 Variable Speed 3-Ton AC', '3-ton variable speed, 17 SEER, ultra quiet', 'TRAN-XR17-3T', 380000, 629500, 6563, 'unit', true, true, '["ac", "trane", "3-ton", "variable-speed"]'::jsonb),
    (v_company_id, v_category_id, 'equipment', 'Lennox XC21 4-Ton AC - 21 SEER', '4-ton ultra-efficient unit, 21 SEER rating', 'LENN-XC21-4T', 450000, 749500, 6656, 'unit', true, true, '["ac", "lennox", "4-ton", "ultra-efficient"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Central AC Installation - Standard', 'Standard AC installation with existing line set', 'SERV-AC-INST-STD', 120000, 219500, 8292, 'job', true, true, '["service", "installation", "ac"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Central AC Installation - New Line Set', 'New installation including line set run', 'SERV-AC-INST-NEW', 180000, 329500, 8306, 'job', true, true, '["service", "installation", "ac", "line-set"]'::jsonb);

  RAISE NOTICE '  ✓ Created 6 AC items';

  -- ============================================================================
  -- HVAC MINI-SPLITS
  -- ============================================================================

  SELECT id INTO v_category_id FROM price_book_categories
  WHERE company_id = v_company_id AND slug = 'mini-splits' LIMIT 1;

  INSERT INTO price_book_items (company_id, category_id, item_type, name, description, sku, cost, price, markup_percent, unit, is_active, is_taxable, tags)
  VALUES
    (v_company_id, v_category_id, 'equipment', 'Mitsubishi M-Series 12K BTU Mini-Split', 'Single-zone 12,000 BTU ductless system', 'MITS-MS-12K', 180000, 299500, 6639, 'unit', true, true, '["mini-split", "mitsubishi", "12k"]'::jsonb),
    (v_company_id, v_category_id, 'equipment', 'Daikin 18K BTU Multi-Zone Mini-Split', 'Multi-zone 18,000 BTU with 2 indoor units', 'DAIK-MZ-18K', 320000, 529500, 6547, 'unit', true, true, '["mini-split", "daikin", "18k", "multi-zone"]'::jsonb),
    (v_company_id, v_category_id, 'equipment', 'LG Art Cool 24K BTU Mini-Split', 'Premium 24K BTU with stylish design', 'LG-AC-24K', 380000, 629500, 6563, 'unit', true, true, '["mini-split", "lg", "24k", "premium"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Mini-Split Installation - Single Zone', 'Installation for single indoor unit system', 'SERV-MS-INST-SZ', 80000, 149500, 8687, 'job', true, true, '["service", "installation", "mini-split"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Mini-Split Installation - Multi-Zone', 'Installation for multi-zone system', 'SERV-MS-INST-MZ', 150000, 279500, 8633, 'job', true, true, '["service", "installation", "mini-split", "multi-zone"]'::jsonb);

  RAISE NOTICE '  ✓ Created 5 mini-split items';

  -- ============================================================================
  -- PLUMBING WATER HEATERS
  -- ============================================================================

  SELECT id INTO v_category_id FROM price_book_categories
  WHERE company_id = v_company_id AND slug = 'water-heaters' LIMIT 1;

  INSERT INTO price_book_items (company_id, category_id, item_type, name, description, sku, cost, price, markup_percent, unit, is_active, is_taxable, tags)
  VALUES
    (v_company_id, v_category_id, 'equipment', 'Rheem 40-Gallon Gas Water Heater', '40-gallon tank, natural gas, 6-year warranty', 'RHEE-WH-40G-G', 60000, 109500, 8250, 'unit', true, true, '["water-heater", "rheem", "tank", "gas"]'::jsonb),
    (v_company_id, v_category_id, 'equipment', 'Rheem 50-Gallon Gas Water Heater', '50-gallon tank, natural gas, 9-year warranty', 'RHEE-WH-50G-G', 75000, 139500, 8600, 'unit', true, true, '["water-heater", "rheem", "tank", "gas"]'::jsonb),
    (v_company_id, v_category_id, 'equipment', 'Bradford White 75-Gallon Electric WH', '75-gallon electric, commercial grade', 'BRAD-WH-75G-E', 95000, 179500, 8895, 'unit', true, true, '["water-heater", "bradford-white", "tank", "electric"]'::jsonb),
    (v_company_id, v_category_id, 'equipment', 'Rinnai Tankless Water Heater - RU160iN', 'Tankless, 160K BTU, natural gas, energy efficient', 'RINN-TL-160-G', 180000, 329500, 8306, 'unit', true, true, '["water-heater", "rinnai", "tankless", "gas"]'::jsonb),
    (v_company_id, v_category_id, 'equipment', 'Navien NPE-240A Tankless Water Heater', 'Tankless condensing, 199K BTU, 0.97 UEF', 'NAV-NPE-240', 220000, 399500, 8159, 'unit', true, true, '["water-heater", "navien", "tankless", "condensing"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Water Heater Installation - Tank (40-50 gal)', 'Standard tank water heater installation', 'SERV-WH-INST-TANK', 60000, 119500, 9917, 'job', true, true, '["service", "installation", "water-heater", "tank"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Tankless Water Heater Installation', 'Tankless installation with gas line check', 'SERV-WH-INST-TL', 120000, 229500, 9125, 'job', true, true, '["service", "installation", "water-heater", "tankless"]'::jsonb);

  RAISE NOTICE '  ✓ Created 7 water heater items';

  -- ============================================================================
  -- PLUMBING FIXTURES
  -- ============================================================================

  SELECT id INTO v_category_id FROM price_book_categories
  WHERE company_id = v_company_id AND slug = 'fixtures-fittings' LIMIT 1;

  INSERT INTO price_book_items (company_id, category_id, item_type, name, description, sku, cost, price, markup_percent, unit, is_active, is_taxable, tags)
  VALUES
    (v_company_id, v_category_id, 'material', 'Moen Arbor Kitchen Faucet - Chrome', 'Single-handle pull-down kitchen faucet', 'MOEN-ARB-KF-CHR', 12000, 24500, 10417, 'unit', true, true, '["faucet", "moen", "kitchen", "chrome"]'::jsonb),
    (v_company_id, v_category_id, 'material', 'Delta Trinsic Bathroom Faucet', 'Single-handle bathroom faucet, champagne bronze', 'DELT-TRI-BF-BRZ', 15000, 29500, 9667, 'unit', true, true, '["faucet", "delta", "bathroom"]'::jsonb),
    (v_company_id, v_category_id, 'material', 'Kohler Cimarron Toilet - Comfort Height', 'Two-piece elongated toilet, comfort height', 'KOHL-CIM-TOI-WH', 25000, 49500, 9800, 'unit', true, true, '["toilet", "kohler", "comfort-height"]'::jsonb),
    (v_company_id, v_category_id, 'material', 'Toto Drake II One-Piece Toilet', 'One-piece elongated, Tornado flush', 'TOTO-DR2-TOI-WH', 40000, 79500, 9875, 'unit', true, true, '["toilet", "toto", "one-piece"]'::jsonb),
    (v_company_id, v_category_id, 'material', 'American Standard Undermount Sink', 'Stainless steel undermount kitchen sink', 'AMST-UM-SINK', 18000, 35500, 9722, 'unit', true, true, '["sink", "american-standard", "undermount"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Faucet Installation - Kitchen/Bath', 'Install new faucet with supply lines', 'SERV-FAU-INST', 8000, 17500, 11875, 'job', true, true, '["service", "installation", "faucet"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Toilet Installation - Standard', 'Remove old, install new toilet with wax ring', 'SERV-TOI-INST-STD', 12000, 24500, 10417, 'job', true, true, '["service", "installation", "toilet"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Sink Installation - Undermount', 'Install undermount sink with plumbing', 'SERV-SNK-INST-UM', 15000, 29500, 9667, 'job', true, true, '["service", "installation", "sink"]'::jsonb);

  RAISE NOTICE '  ✓ Created 8 fixture items';

  -- ============================================================================
  -- SERVICE & MAINTENANCE (Labor Rates & Plans)
  -- ============================================================================

  SELECT id INTO v_category_id FROM price_book_categories
  WHERE company_id = v_company_id AND slug = 'maintenance-plans' LIMIT 1;

  INSERT INTO price_book_items (company_id, category_id, item_type, name, description, sku, cost, price, markup_percent, unit, is_active, is_taxable, tags)
  VALUES
    (v_company_id, v_category_id, 'service', 'HVAC Annual Maintenance Plan - Residential', 'Two annual visits, priority scheduling, 10% discount', 'PLAN-HVAC-ANN-RES', 20000, 49500, 14750, 'year', true, true, '["maintenance", "plan", "hvac", "residential"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Plumbing Annual Maintenance Plan', 'Annual inspection, priority service, 15% discount', 'PLAN-PLUMB-ANN', 15000, 39500, 16333, 'year', true, true, '["maintenance", "plan", "plumbing"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'HVAC Commercial Quarterly Maintenance', 'Quarterly service visits for commercial systems', 'PLAN-HVAC-QTR-COM', 100000, 199500, 9950, 'year', true, true, '["maintenance", "plan", "hvac", "commercial"]'::jsonb);

  RAISE NOTICE '  ✓ Created 3 maintenance plan items';

  -- ============================================================================
  -- EMERGENCY SERVICES
  -- ============================================================================

  SELECT id INTO v_category_id FROM price_book_categories
  WHERE company_id = v_company_id AND slug = 'emergency-services' LIMIT 1;

  INSERT INTO price_book_items (company_id, category_id, item_type, name, description, sku, cost, price, markup_percent, unit, is_active, is_taxable, tags)
  VALUES
    (v_company_id, v_category_id, 'service', 'Emergency Service Call - After Hours', 'Emergency dispatch and first hour, after 5pm weekdays', 'SERV-EMER-AH', 15000, 34500, 13000, 'call', true, true, '["emergency", "after-hours"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Emergency Service Call - Weekend', 'Emergency dispatch and first hour, weekends', 'SERV-EMER-WE', 17500, 39500, 12571, 'call', true, true, '["emergency", "weekend"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Emergency Service Call - Holiday', 'Emergency dispatch and first hour, holidays', 'SERV-EMER-HOL', 20000, 49500, 14750, 'call', true, true, '["emergency", "holiday"]'::jsonb);

  RAISE NOTICE '  ✓ Created 3 emergency service items';

  -- ============================================================================
  -- DIAGNOSTIC SERVICES
  -- ============================================================================

  SELECT id INTO v_category_id FROM price_book_categories
  WHERE company_id = v_company_id AND slug = 'diagnostic-services' LIMIT 1;

  INSERT INTO price_book_items (company_id, category_id, item_type, name, description, sku, cost, price, markup_percent, unit, is_active, is_taxable, tags)
  VALUES
    (v_company_id, v_category_id, 'service', 'HVAC System Diagnostic', 'Complete system inspection and diagnosis', 'SERV-DIAG-HVAC', 8000, 17500, 11875, 'visit', true, true, '["diagnostic", "hvac"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Plumbing Leak Detection', 'Leak detection with specialized equipment', 'SERV-DIAG-LEAK', 10000, 22500, 12500, 'visit', true, true, '["diagnostic", "plumbing", "leak"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Air Quality Assessment', 'Indoor air quality testing and recommendations', 'SERV-DIAG-AIR', 12000, 27500, 12917, 'visit', true, true, '["diagnostic", "air-quality"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Energy Efficiency Audit', 'Complete home energy efficiency evaluation', 'SERV-DIAG-ENERGY', 15000, 34500, 13000, 'visit', true, true, '["diagnostic", "energy", "efficiency"]'::jsonb);

  RAISE NOTICE '  ✓ Created 4 diagnostic service items';

  -- ============================================================================
  -- STANDARD LABOR RATES
  -- ============================================================================

  SELECT id INTO v_category_id FROM price_book_categories
  WHERE company_id = v_company_id AND slug = 'service-maintenance' LIMIT 1;

  INSERT INTO price_book_items (company_id, category_id, item_type, name, description, sku, cost, price, markup_percent, unit, is_active, is_taxable, tags)
  VALUES
    (v_company_id, v_category_id, 'service', 'Standard Labor - HVAC Technician', 'Hourly rate for HVAC technician', 'LABOR-HVAC-STD', 7500, 17500, 13333, 'hour', true, true, '["labor", "hvac", "hourly"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Standard Labor - Plumber', 'Hourly rate for licensed plumber', 'LABOR-PLUMB-STD', 8000, 19500, 14375, 'hour', true, true, '["labor", "plumbing", "hourly"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Master Technician Labor', 'Hourly rate for master technician', 'LABOR-MASTER', 10000, 24500, 14500, 'hour', true, true, '["labor", "master", "hourly"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Apprentice Labor', 'Hourly rate for apprentice technician', 'LABOR-APPR', 5000, 12500, 15000, 'hour', true, true, '["labor", "apprentice", "hourly"]'::jsonb);

  RAISE NOTICE '  ✓ Created 4 labor rate items';

  -- ============================================================================
  -- COMMON PARTS & MATERIALS
  -- ============================================================================

  SELECT id INTO v_category_id FROM price_book_categories
  WHERE company_id = v_company_id AND slug = 'pipes-valves' LIMIT 1;

  INSERT INTO price_book_items (company_id, category_id, item_type, name, description, sku, cost, price, markup_percent, unit, is_active, is_taxable, tags)
  VALUES
    (v_company_id, v_category_id, 'material', 'Copper Pipe - 1/2 inch Type L', 'Rigid copper pipe, 10-foot length', 'PIPE-COP-05-L', 3500, 8500, 14286, 'each', true, true, '["pipe", "copper", "material"]'::jsonb),
    (v_company_id, v_category_id, 'material', 'Copper Pipe - 3/4 inch Type L', 'Rigid copper pipe, 10-foot length', 'PIPE-COP-075-L', 5000, 11500, 13000, 'each', true, true, '["pipe", "copper", "material"]'::jsonb),
    (v_company_id, v_category_id, 'material', 'PEX Tubing - 1/2 inch', 'Cross-linked polyethylene, 100-foot coil', 'PIPE-PEX-05', 6000, 13500, 12500, 'coil', true, true, '["pipe", "pex", "material"]'::jsonb),
    (v_company_id, v_category_id, 'material', 'Ball Valve - 1/2 inch Brass', 'Quarter-turn brass ball valve', 'VALV-BALL-05', 800, 2500, 21250, 'each', true, true, '["valve", "brass", "material"]'::jsonb),
    (v_company_id, v_category_id, 'material', 'Ball Valve - 3/4 inch Brass', 'Quarter-turn brass ball valve', 'VALV-BALL-075', 1200, 3500, 19167, 'each', true, true, '["valve", "brass", "material"]'::jsonb),
    (v_company_id, v_category_id, 'material', 'Gate Valve - 1 inch', 'Threaded brass gate valve', 'VALV-GATE-1', 2000, 5500, 17500, 'each', true, true, '["valve", "brass", "material"]'::jsonb);

  RAISE NOTICE '  ✓ Created 6 pipe/valve items';

  -- ============================================================================
  -- THERMOSTATS & CONTROLS
  -- ============================================================================

  SELECT id INTO v_category_id FROM price_book_categories
  WHERE company_id = v_company_id AND slug = 'thermostats-controls' LIMIT 1;

  INSERT INTO price_book_items (company_id, category_id, item_type, name, description, sku, cost, price, markup_percent, unit, is_active, is_taxable, tags)
  VALUES
    (v_company_id, v_category_id, 'equipment', 'Honeywell T6 Pro Smart Thermostat', 'Wi-Fi enabled, 7-day programmable', 'THERM-HON-T6', 15000, 32500, 11667, 'unit', true, true, '["thermostat", "honeywell", "smart", "wifi"]'::jsonb),
    (v_company_id, v_category_id, 'equipment', 'Nest Learning Thermostat', 'Self-learning, energy saving, Google integration', 'THERM-NEST-LEARN', 20000, 42500, 11250, 'unit', true, true, '["thermostat", "nest", "smart", "learning"]'::jsonb),
    (v_company_id, v_category_id, 'equipment', 'Ecobee SmartThermostat Premium', 'Voice control, room sensors, Alexa built-in', 'THERM-ECO-PREM', 22000, 46500, 11136, 'unit', true, true, '["thermostat", "ecobee", "smart", "voice"]'::jsonb),
    (v_company_id, v_category_id, 'service', 'Smart Thermostat Installation', 'Install and configure smart thermostat', 'SERV-THERM-INST', 5000, 12500, 15000, 'job', true, true, '["service", "installation", "thermostat"]'::jsonb);

  RAISE NOTICE '  ✓ Created 4 thermostat items';

  -- ============================================================================
  -- SUMMARY
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '  Summary: Created 70+ price book items';
  RAISE NOTICE '  - Equipment (furnaces, AC units, water heaters, etc.)';
  RAISE NOTICE '  - Services (installation, maintenance, emergency)';
  RAISE NOTICE '  - Materials (pipes, valves, fixtures)';
  RAISE NOTICE '  - Labor rates and maintenance plans';
  RAISE NOTICE '  All prices in SF Bay Area market rates';
  RAISE NOTICE '';

END $$;
