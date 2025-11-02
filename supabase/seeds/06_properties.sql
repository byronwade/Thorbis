-- ============================================================================
-- SEED: Properties
-- ============================================================================
-- Creates 30 properties linked to customers
-- Mix of single-family homes, multi-unit buildings, and commercial spaces
-- ============================================================================

DO $$
DECLARE
  v_company_id UUID := current_setting('app.current_company_id')::uuid;
  v_customer_id UUID;
  v_property_counter INTEGER := 0;
BEGIN

  RAISE NOTICE 'Seeding Properties...';

  -- ============================================================================
  -- RESIDENTIAL PROPERTIES (Sarah Chen - 3 properties)
  -- ============================================================================

  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'sarah.chen@gmail.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-001', 'Pacific Heights Residence', 'single_family', '2847 Pacific Heights Ave', 'San Francisco', 'CA', '94123', 'USA', true, 'Primary residence. Victorian home with 3 HVAC zones.'),
    (v_company_id, v_customer_id, 'PROP-2025-002', 'Napa Valley Vacation Home', 'single_family', '456 Vineyard Lane', 'Napa', 'CA', '94558', 'USA', false, 'Vacation property. Seasonal use. Smart home system installed.'),
    (v_company_id, v_customer_id, 'PROP-2025-003', 'Investment Property - Marina', 'multi_unit', '789 Marina Blvd', 'San Francisco', 'CA', '94123', 'USA', false, 'Rental property. 2-unit building. Tenants contact directly for service.');

  v_property_counter := v_property_counter + 3;
  RAISE NOTICE '  ✓ Created 3 properties for Sarah Chen';

  -- ============================================================================
  -- RESIDENTIAL PROPERTIES (Single properties for other residential customers)
  -- ============================================================================

  -- Michael Rodriguez
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'mrodriguez@yahoo.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-004', 'Noe Valley Victorian', 'single_family', '1234 Noe Valley Street, Apt 3B', 'San Francisco', 'CA', '94114', 'USA', true, '1920s Victorian. Original radiator heating system. Needs regular maintenance.');

  -- Jennifer Thompson
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'jennifer.thompson@outlook.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-005', 'Palo Alto New Construction', 'single_family', '892 Middlefield Road', 'Palo Alto', 'CA', '94301', 'USA', true, 'Built 2023. High-efficiency HVAC. Smart thermostats throughout.');

  -- David Park (2 rental properties)
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'david.park@gmail.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-006', 'Winchester Rental - Unit A', 'multi_unit', '5678 Winchester Blvd, Unit A', 'San Jose', 'CA', '95128', 'USA', true, 'Rental property. Tenant: Smith family. Window AC units.'),
    (v_company_id, v_customer_id, 'PROP-2025-007', 'Winchester Rental - Unit B', 'multi_unit', '5678 Winchester Blvd, Unit B', 'San Jose', 'CA', '95128', 'USA', false, 'Rental property. Tenant: Johnson family. Central HVAC.');

  -- Emily Martinez
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'emily.m@protonmail.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-008', 'Rockridge Historic Home', 'single_family', '3421 College Avenue', 'Oakland', 'CA', '94618', 'USA', true, 'Craftsman home, 1910. 3 HVAC zones. Original plumbing upgraded 2020.');

  -- Robert Williams
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'bob.williams@gmail.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-009', 'Sunset District Home', 'single_family', '789 Sunset Boulevard', 'San Francisco', 'CA', '94122', 'USA', true, 'Near Golden Gate Park. 1960s furnace. Needs replacement soon.');

  -- Amanda Lee
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'amanda.lee@icloud.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-010', 'Menlo Park Estate', 'single_family', '2156 Sand Hill Road', 'Menlo Park', 'CA', '94025', 'USA', true, 'Large estate. 5 bedrooms, 4 baths. Multiple HVAC systems. Pool heater.');

  -- James Anderson
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'j.anderson@gmail.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-011', 'Divisadero Remodel', 'single_family', '1567 Divisadero Street', 'San Francisco', 'CA', '94115', 'USA', true, 'Recently remodeled. New Carrier HVAC installed 2024.');

  -- Lisa Nguyen
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'lisa.nguyen@yahoo.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-012', 'San Jose Starter Home', 'single_family', '4523 Meridian Avenue', 'San Jose', 'CA', '95124', 'USA', true, 'First-time homebuyer. Standard split system AC.');

  -- Christopher Davis
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'chris.davis@gmail.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-013', 'Berkeley Bungalow', 'single_family', '2890 Telegraph Avenue', 'Berkeley', 'CA', '94705', 'USA', true, '1940s bungalow. Interested in energy efficiency upgrades.');

  -- Maria Garcia
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'maria.garcia@hotmail.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-014', 'Mission District Family Home', 'single_family', '3678 Mission Street', 'San Francisco', 'CA', '94110', 'USA', true, 'Multi-generational home. 2 HVAC units. Service plan member.');

  -- Daniel Kim
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'daniel.kim@gmail.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-015', 'Redwood City Modern', 'single_family', '1245 El Camino Real', 'Redwood City', 'CA', '94063', 'USA', true, 'Modern design. Nest thermostats. High-efficiency mini-split systems.');

  -- Patricia Brown
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'pbrown@aol.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-016', 'Oakland Broadway Apartment', 'condo', '5234 Broadway', 'Oakland', 'CA', '94612', 'USA', true, 'Senior living. Fixed income. Handle with care regarding costs.');

  -- Steven White
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'steven.white@gmail.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-017', 'Marina High-Rise Condo', 'condo', '2456 Chestnut Street, Unit 2801', 'San Francisco', 'CA', '94123', 'USA', true, 'High-rise condo. Building management must be notified. Concierge access required.');

  -- Nancy Taylor
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'nancy.taylor@gmail.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-018', 'Almaden Suburban Home', 'single_family', '6789 Almaden Expressway', 'San Jose', 'CA', '95123', 'USA', true, 'Standard suburban home. Split AC system. No special requirements.');

  v_property_counter := v_property_counter + 15;
  RAISE NOTICE '  ✓ Created 15 residential properties';

  -- ============================================================================
  -- COMMERCIAL PROPERTIES
  -- ============================================================================

  -- TechStart Ventures
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'rachel.green@techstart.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, square_footage, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-019', 'TechStart HQ - FiDi', 'office', '100 Montgomery Street, Suite 2500', 'San Francisco', 'CA', '94104', 'USA', 25000, true, '25th floor. 6 HVAC zones. Server room requires 24/7 cooling.');

  -- The Office Complex LLC (2 buildings)
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'michael@theofficecomplex.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, square_footage, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-020', 'Office Complex North', 'office', '2500 Sand Hill Road', 'Menlo Park', 'CA', '94025', 'USA', 50000, true, 'Multi-tenant office. 4 rooftop units. Elevator mechanical room.'),
    (v_company_id, v_customer_id, 'PROP-2025-021', 'Office Complex South', 'office', '2600 Sand Hill Road', 'Menlo Park', 'CA', '94025', 'USA', 35000, false, 'Newer building. Variable speed chillers. More energy efficient.');

  -- Halpert Properties (Multiple locations)
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'jim@halpertproperties.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, square_footage, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-022', 'Market Street Office Tower', 'office', '456 Market Street', 'San Francisco', 'CA', '94105', 'USA', 45000, true, 'Main property. 8-story building. Central chiller plant.');

  -- Riverside Restaurant Group (3 locations)
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'pam@riversiderestaurants.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, square_footage, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-023', 'Riverside Grill - Oakland', 'restaurant', '789 Embarcadero', 'Oakland', 'CA', '94607', 'USA', 4500, true, 'Full-service restaurant. Heavy kitchen exhaust. Hood cleaning quarterly.'),
    (v_company_id, v_customer_id, 'PROP-2025-024', 'Riverside Café - Berkeley', 'restaurant', '1234 Shattuck Ave', 'Berkeley', 'CA', '94709', 'USA', 3200, false, 'Smaller location. Walk-in cooler. Standard HVAC.'),
    (v_company_id, v_customer_id, 'PROP-2025-025', 'Riverside Bistro - SF', 'restaurant', '567 Union Street', 'San Francisco', 'CA', '94133', 'USA', 3800, false, 'North Beach location. Outdoor dining. Patio heaters.');

  -- Schrute Farms Storage
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'dwight@schrutefarms.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, square_footage, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-026', 'Schrute Warehouse Facility', 'warehouse', '1500 Industrial Parkway', 'San Jose', 'CA', '95131', 'USA', 85000, true, 'Climate-controlled storage. Multiple zones for temp-sensitive units.');

  -- Martin Medical Center
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'amartin@martinmedical.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, square_footage, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-027', 'Martin Medical Clinic', 'medical', '2000 Page Mill Road', 'Palo Alto', 'CA', '94304', 'USA', 12000, true, 'Medical facility. Critical HVAC - backup systems required. Air filtration important.');

  -- Malone Retail Centers
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'kevin@maloneretail.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, square_footage, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-028', 'Cesar Chavez Shopping Center', 'retail', '3400 Cesar Chavez Street', 'San Francisco', 'CA', '94110', 'USA', 32000, true, 'Strip mall. 8 tenant spaces. Central HVAC serves all units.');

  -- Martinez Fitness Club
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'oscar@martinezfitness.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, square_footage, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-029', 'Martinez Fitness - Oakland', 'gym', '4567 Broadway', 'Oakland', 'CA', '94611', 'USA', 15000, true, '24/7 gym. Heavy cooling load. Locker room ventilation critical.');

  -- Hudson Hotel Group
  SELECT id INTO v_customer_id FROM customers
  WHERE company_id = v_company_id AND email = 'stanley@hudsonhotels.com' LIMIT 1;

  INSERT INTO properties (company_id, customer_id, property_number, name, type, address, city, state, zip_code, country, square_footage, is_primary, notes)
  VALUES
    (v_company_id, v_customer_id, 'PROP-2025-030', 'Hudson Boutique Hotel', 'hotel', '500 Geary Street', 'San Francisco', 'CA', '94102', 'USA', 28000, true, '80-room boutique hotel. Multiple boilers. Guest comfort is priority. Emergency service 24/7.');

  v_property_counter := v_property_counter + 12;
  RAISE NOTICE '  ✓ Created 12 commercial properties';

  -- ============================================================================
  -- SUMMARY
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '  Summary: Created % properties', v_property_counter;
  RAISE NOTICE '  - 18 Residential properties';
  RAISE NOTICE '  - 12 Commercial properties';
  RAISE NOTICE '  - Linked to existing customers';
  RAISE NOTICE '';

END $$;
