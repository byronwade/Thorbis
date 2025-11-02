-- ============================================================================
-- SEED: Equipment
-- ============================================================================
-- Creates 50 equipment items across customer properties
-- Mix of HVAC, plumbing, and electrical equipment
-- ============================================================================

DO $$
DECLARE
  v_company_id UUID := current_setting('app.current_company_id')::uuid;
  v_customer_id UUID;
  v_property_id UUID;
  v_equipment_counter INTEGER := 0;
BEGIN

  RAISE NOTICE 'Seeding Equipment...';

  -- ============================================================================
  -- Helper: Get customer and property IDs
  -- ============================================================================

  -- Sarah Chen - Pacific Heights (3 zones)
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'sarah.chen@gmail.com' AND p.property_number = 'PROP-2025-001'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, last_service_date, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-001', 'Main Floor Furnace', 'hvac', 'Furnace', 'Carrier', 'Performance 96', 'C96-12345-2018', '2018-11-15'::date, 'Basement - Main Floor Zone', 'active', 'good', '2024-10-15'::date, '96 AFUE gas furnace. 80K BTU. Serves main floor.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-002', 'Upper Floor Furnace', 'hvac', 'Furnace', 'Carrier', 'Performance 96', 'C96-12346-2018', '2018-11-15'::date, 'Basement - Upper Floor Zone', 'active', 'good', '2024-10-15'::date, '96 AFUE gas furnace. 60K BTU. Serves upper floor.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-003', 'Central AC Unit', 'hvac', 'Air Conditioning', 'Carrier', 'Infinity 18', 'CAC-78901-2019', '2019-05-10'::date, 'Side Yard', 'active', 'excellent', '2024-09-20'::date, '18 SEER central AC. 3-ton capacity.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-004', 'Water Heater', 'plumbing', 'Water Heater', 'Rheem', 'Professional Classic', 'WH-50G-45678', '2020-03-22'::date, 'Basement', 'active', 'excellent', '2024-08-10'::date, '50-gallon natural gas. 9-year warranty.');

  v_equipment_counter := v_equipment_counter + 4;

  -- Emily Martinez - Rockridge (3 zones)
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'emily.m@protonmail.com'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, last_service_date, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-005', 'Zone 1 Heat Pump', 'hvac', 'Heat Pump', 'Lennox', 'XP17', 'LP-23456-2017', '2017-08-12'::date, 'Front Yard', 'active', 'fair', '2024-09-05'::date, '17 SEER heat pump. Shows signs of wear. Monitor closely.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-006', 'Zone 2 Heat Pump', 'hvac', 'Heat Pump', 'Lennox', 'XP17', 'LP-23457-2017', '2017-08-12'::date, 'Back Yard', 'active', 'fair', '2024-09-05'::date, '17 SEER heat pump. Same age as Zone 1.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-007', 'Tankless Water Heater', 'plumbing', 'Water Heater', 'Rinnai', 'RU160iN', 'TL-98765', '2021-06-18'::date, 'Utility Room', 'active', 'excellent', '2024-07-22'::date, 'Natural gas tankless. 160K BTU. Energy efficient.');

  v_equipment_counter := v_equipment_counter + 3;

  -- Amanda Lee - Menlo Park Estate (Multiple systems)
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'amanda.lee@icloud.com'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, last_service_date, warranty_expiration, is_under_warranty, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-008', 'Main House HVAC - Carrier Infinity', 'hvac', 'Central AC', 'Carrier', 'Infinity 21', 'CAC-99999-2023', '2023-04-15'::date, 'Side of House', 'active', 'excellent', '2024-10-01'::date, '2033-04-15'::date, true, 'Top-of-line 21 SEER system. Under 10-year parts warranty.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-009', 'Guest House Mini-Split', 'hvac', 'Mini-Split', 'Mitsubishi', 'M-Series', 'MS-12K-55555', '2023-06-20'::date, 'Guest House', 'active', 'excellent', '2024-09-15'::date, '2033-06-20'::date, true, '12K BTU ductless. Guest house heating/cooling.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-010', 'Pool Heater', 'plumbing', 'Pool Equipment', 'Pentair', 'MasterTemp 400', 'PH-44444', '2022-05-10'::date, 'Pool Equipment Room', 'active', 'good', '2024-06-15'::date, NULL, false, '400K BTU natural gas pool heater.');

  v_equipment_counter := v_equipment_counter + 3;

  -- Robert Williams - Sunset District (Old furnace)
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'bob.williams@gmail.com'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, last_service_date, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-011', 'Original 1960s Furnace', 'hvac', 'Furnace', 'Unknown', 'Unknown', NULL, '1965-01-01'::date, 'Basement', 'active', 'poor', '2024-11-10'::date, 'Very old furnace. Frequent repairs needed. Recommend replacement.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-012', 'Water Heater', 'plumbing', 'Water Heater', 'Bradford White', '40T6', 'BW-11111', '2015-03-20'::date, 'Basement', 'active', 'fair', '2024-06-10'::date, '40-gallon electric. Nearing end of life.');

  v_equipment_counter := v_equipment_counter + 2;

  -- James Anderson - New HVAC (2024)
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'j.anderson@gmail.com'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, warranty_expiration, is_under_warranty, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-013', 'New Carrier System 2024', 'hvac', 'Complete System', 'Carrier', 'Comfort Series', 'CS-2024-88888', '2024-02-15'::date, 'Side Yard', 'active', 'excellent', '2034-02-15'::date, true, 'Brand new Carrier Comfort 16 SEER system. Installed by us. Under warranty.');

  v_equipment_counter := v_equipment_counter + 1;

  -- Lisa Nguyen - Recent AC replacement
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'lisa.nguyen@yahoo.com'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, warranty_expiration, is_under_warranty, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-014', 'Trane XR14 AC Unit', 'hvac', 'Air Conditioning', 'Trane', 'XR14', 'TR-2024-77777', '2024-08-10'::date, 'Side Yard', 'active', 'excellent', '2034-08-10'::date, true, '14 SEER 3-ton AC. Recently installed by us. Customer very satisfied.');

  v_equipment_counter := v_equipment_counter + 1;

  -- Daniel Kim - Mini-splits throughout
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'daniel.kim@gmail.com'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, last_service_date, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-015', 'Living Room Mini-Split', 'hvac', 'Mini-Split', 'Daikin', 'Multi-Zone', 'DK-18K-11111', '2021-09-15'::date, 'Living Room', 'active', 'good', '2024-08-20'::date, 'Part of multi-zone system. 9K BTU indoor unit.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-016', 'Bedroom Mini-Split', 'hvac', 'Mini-Split', 'Daikin', 'Multi-Zone', 'DK-18K-11112', '2021-09-15'::date, 'Master Bedroom', 'active', 'good', '2024-08-20'::date, 'Part of multi-zone system. 9K BTU indoor unit.');

  v_equipment_counter := v_equipment_counter + 2;

  -- Steven White - High-rise condo
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'steven.white@gmail.com'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, last_service_date, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-017', 'PTAC Unit - Living Room', 'hvac', 'PTAC', 'Friedrich', 'Uni-Fit', 'FR-12K-99999', '2019-07-20'::date, 'Living Room', 'active', 'fair', '2024-09-10'::date, 'Packaged terminal AC. Common in high-rises. Building standard unit.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-018', 'Tankless Water Heater', 'plumbing', 'Water Heater', 'Navien', 'NPE-240A', 'NV-240-88888', '2020-04-15'::date, 'Utility Closet', 'active', 'excellent', '2024-07-05'::date, 'Condensing tankless. Very efficient.');

  v_equipment_counter := v_equipment_counter + 2;

  -- ============================================================================
  -- COMMERCIAL EQUIPMENT
  -- ============================================================================

  -- TechStart Ventures - Large office
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'rachel.green@techstart.com'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, last_service_date, service_interval_days, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-019', 'Rooftop Unit RTU-1', 'hvac', 'Rooftop Unit', 'Trane', 'Precedent', 'RTU-COM-11111', '2018-03-15'::date, 'Roof - Zone 1', 'active', 'good', '2024-10-20'::date, 90, 'Commercial RTU. 15-ton capacity. Quarterly maintenance.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-020', 'Rooftop Unit RTU-2', 'hvac', 'Rooftop Unit', 'Trane', 'Precedent', 'RTU-COM-11112', '2018-03-15'::date, 'Roof - Zone 2', 'active', 'good', '2024-10-20'::date, 90, 'Commercial RTU. 15-ton capacity. Quarterly maintenance.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-021', 'Server Room AC', 'hvac', 'Precision AC', 'Liebert', 'DataMate', 'LI-5TON-99999', '2019-06-10'::date, 'Server Room', 'active', 'excellent', '2024-11-15'::date, 30, 'Critical cooling. 24/7 operation. Monthly inspection required.');

  v_equipment_counter := v_equipment_counter + 3;

  -- Office Complex (Multiple RTUs)
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'michael@theofficecomplex.com' AND p.property_number = 'PROP-2025-020'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, last_service_date, service_interval_days, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-022', 'RTU North-1', 'hvac', 'Rooftop Unit', 'Carrier', 'AquaEdge', 'CAR-RTU-22222', '2016-05-20'::date, 'Roof North Side', 'active', 'fair', '2024-09-25'::date, 90, '20-ton unit. Aging but functional. Monitor for replacement.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-023', 'RTU North-2', 'hvac', 'Rooftop Unit', 'Carrier', 'AquaEdge', 'CAR-RTU-22223', '2016-05-20'::date, 'Roof North Side', 'active', 'fair', '2024-09-25'::date, 90, '20-ton unit. Same age as North-1.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-024', 'Boiler System', 'hvac', 'Boiler', 'Weil-McLain', 'Commercial', 'WM-BOIL-55555', '2015-11-10'::date, 'Mechanical Room', 'active', 'good', '2024-10-05'::date, 180, 'Natural gas boiler. Semi-annual service.');

  v_equipment_counter := v_equipment_counter + 3;

  -- Restaurant - Kitchen equipment critical
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'pam@riversiderestaurants.com' AND p.property_number = 'PROP-2025-023'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, last_service_date, service_interval_days, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-025', 'Kitchen Exhaust Hood', 'hvac', 'Exhaust System', 'CaptiveAire', 'Commercial Hood', 'CA-HOOD-99999', '2019-08-15'::date, 'Kitchen', 'active', 'good', '2024-11-01'::date, 90, 'Commercial kitchen hood. Quarterly cleaning required. Health code compliance.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-026', 'Walk-in Cooler', 'hvac', 'Refrigeration', 'Kolpak', 'KF8', 'KP-WIC-77777', '2019-08-15'::date, 'Kitchen', 'active', 'good', '2024-10-15'::date, 90, 'Walk-in cooler. Critical for food safety. Priority service.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-027', 'Dining Room HVAC', 'hvac', 'Split System', 'Trane', 'Commercial', 'TR-COM-33333', '2019-08-15'::date, 'Dining Room', 'active', 'good', '2024-09-20'::date, 90, 'Customer comfort critical. High BTU for kitchen heat offset.');

  v_equipment_counter := v_equipment_counter + 3;

  -- Warehouse - Large climate control
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'dwight@schrutefarms.com'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, last_service_date, service_interval_days, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-028', 'Warehouse HVAC Zone 1', 'hvac', 'Rooftop Unit', 'Carrier', 'WeatherMaster', 'CAR-WM-44444', '2017-04-10'::date, 'Roof - Zone 1', 'active', 'good', '2024-10-10'::date, 120, '30-ton commercial unit. Climate-controlled storage.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-029', 'Warehouse HVAC Zone 2', 'hvac', 'Rooftop Unit', 'Carrier', 'WeatherMaster', 'CAR-WM-44445', '2017-04-10'::date, 'Roof - Zone 2', 'active', 'good', '2024-10-10'::date, 120, '30-ton commercial unit. Climate-controlled storage.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-030', 'Warehouse HVAC Zone 3', 'hvac', 'Rooftop Unit', 'Carrier', 'WeatherMaster', 'CAR-WM-44446', '2017-04-10'::date, 'Roof - Zone 3', 'active', 'fair', '2024-10-10'::date, 120, '30-ton commercial unit. Some wear, monitor closely.');

  v_equipment_counter := v_equipment_counter + 3;

  -- Medical Center - Critical systems
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'amartin@martinmedical.com'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, warranty_expiration, is_under_warranty, last_service_date, service_interval_days, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-031', 'Medical HVAC Main', 'hvac', 'Rooftop Unit', 'Trane', 'Voyager', 'TR-VOY-66666', '2022-06-15'::date, 'Roof', 'active', 'excellent', '2032-06-15'::date, true, '2024-11-01'::date, 30, 'Critical medical facility HVAC. 25-ton unit. Monthly maintenance. Backup system available.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-032', 'Medical HVAC Backup', 'hvac', 'Rooftop Unit', 'Trane', 'Voyager', 'TR-VOY-66667', '2022-06-15'::date, 'Roof', 'active', 'excellent', '2032-06-15'::date, true, '2024-11-01'::date, 30, 'Backup HVAC system. Automatic switchover. Tested monthly.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-033', 'Air Filtration System', 'hvac', 'Air Purification', 'IQAir', 'CleanRoom', 'IQ-CR-88888', '2022-06-15'::date, 'Mechanical Room', 'active', 'excellent', '2025-06-15'::date, true, '2024-11-01'::date, 30, 'HEPA filtration. Critical for patient safety. Filter changes quarterly.');

  v_equipment_counter := v_equipment_counter + 3;

  -- Fitness Club - Heavy load
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'oscar@martinezfitness.com'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, last_service_date, service_interval_days, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-034', 'Gym Floor HVAC-1', 'hvac', 'Rooftop Unit', 'Lennox', 'Energence', 'LEN-ENER-11111', '2020-02-10'::date, 'Roof - Main Floor', 'active', 'good', '2024-09-15'::date, 60, 'Heavy cooling load from equipment and occupants. 20-ton unit.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-035', 'Gym Floor HVAC-2', 'hvac', 'Rooftop Unit', 'Lennox', 'Energence', 'LEN-ENER-11112', '2020-02-10'::date, 'Roof - Main Floor', 'active', 'good', '2024-09-15'::date, 60, 'Second unit for main floor. Heavy load.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-036', 'Locker Room Exhaust', 'hvac', 'Exhaust System', 'Greenheck', 'Commercial', 'GH-EXH-22222', '2020-02-10'::date, 'Locker Rooms', 'active', 'good', '2024-09-15'::date, 90, 'Locker room ventilation. Critical for air quality.');

  v_equipment_counter := v_equipment_counter + 3;

  -- Hotel - Multiple systems
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'stanley@hudsonhotels.com'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, last_service_date, service_interval_days, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-037', 'Hotel Chiller System', 'hvac', 'Chiller', 'York', 'YK Millennium', 'YK-CHILL-33333', '2015-09-20'::date, 'Mechanical Room', 'active', 'fair', '2024-10-25'::date, 90, 'Central chiller. 150-ton capacity. Aging but maintained well.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-038', 'Hotel Boiler 1', 'plumbing', 'Boiler', 'Lochinvar', 'Crest', 'LO-BOIL-44444', '2016-10-15'::date, 'Boiler Room', 'active', 'good', '2024-10-25'::date, 180, 'Primary boiler. Natural gas. Semi-annual service.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-039', 'Hotel Boiler 2', 'plumbing', 'Boiler', 'Lochinvar', 'Crest', 'LO-BOIL-44445', '2016-10-15'::date, 'Boiler Room', 'active', 'good', '2024-10-25'::date, 180, 'Backup boiler. Natural gas. Redundancy for 24/7 operation.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-040', 'Domestic Water Heater', 'plumbing', 'Water Heater', 'Bradford White', 'eF Series', 'BW-EF-55555', '2017-03-10'::date, 'Mechanical Room', 'active', 'good', '2024-08-10'::date, 180, 'Commercial water heater. 100-gallon. High recovery rate.');

  v_equipment_counter := v_equipment_counter + 4;

  -- Retail Center - Central system
  SELECT c.id, p.id INTO v_customer_id, v_property_id
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id AND c.email = 'kevin@maloneretail.com'
  LIMIT 1;

  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, serial_number, install_date, location, status, condition, last_service_date, service_interval_days, notes)
  VALUES
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-041', 'Mall HVAC Central Unit', 'hvac', 'Rooftop Unit', 'Carrier', 'AquaSnap', 'CAR-AS-66666', '2014-07-15'::date, 'Roof', 'active', 'fair', '2024-08-20'::date, 90, 'Central HVAC serves 8 tenant spaces. Aging system. Consider replacement planning.'),
    (v_company_id, v_customer_id, v_property_id, 'EQ-2025-042', 'Mall Makeup Air Unit', 'hvac', 'Makeup Air', 'Carrier', 'Commercial', 'CAR-MAU-77777', '2014-07-15'::date, 'Roof', 'active', 'fair', '2024-08-20'::date, 90, 'Makeup air for tenant exhaust. Same age as main unit.');

  v_equipment_counter := v_equipment_counter + 2;

  -- Add some standard residential equipment for remaining customers (simplified)
  INSERT INTO equipment (company_id, customer_id, property_id, equipment_number, name, type, category, manufacturer, model, install_date, location, status, condition, notes)
  SELECT
    v_company_id,
    c.id,
    p.id,
    'EQ-2025-' || LPAD((ROW_NUMBER() OVER() + 42)::text, 3, '0'),
    'Standard HVAC System',
    'hvac',
    'Split System',
    'Carrier',
    'Comfort Series',
    ('2018-01-01'::date + (ROW_NUMBER() OVER() * INTERVAL '100 days'))::date,
    'Side Yard',
    'active',
    'good',
    'Standard residential split system.'
  FROM customers c
  INNER JOIN properties p ON p.customer_id = c.id
  WHERE c.company_id = v_company_id
    AND c.type = 'residential'
    AND NOT EXISTS (
      SELECT 1 FROM equipment e WHERE e.customer_id = c.id
    )
  LIMIT 8;

  v_equipment_counter := v_equipment_counter + 8;

  -- ============================================================================
  -- SUMMARY
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '  Summary: Created % equipment items', v_equipment_counter;
  RAISE NOTICE '  - Mix of residential and commercial equipment';
  RAISE NOTICE '  - Various ages and conditions';
  RAISE NOTICE '  - Service histories included';
  RAISE NOTICE '';

END $$;
