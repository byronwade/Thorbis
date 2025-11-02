-- ============================================================================
-- SEED: Inventory
-- ============================================================================
-- Creates 20 inventory items for parts and materials tracking
-- ============================================================================

DO $$
DECLARE
  v_company_id UUID := current_setting('app.current_company_id')::uuid;

BEGIN

  RAISE NOTICE 'Seeding Inventory...';

  -- ============================================================================
  -- HVAC PARTS INVENTORY
  -- ============================================================================

  INSERT INTO inventory_items (
    company_id, item_number, name, description, category, unit,
    quantity_on_hand, reorder_point, reorder_quantity,
    unit_cost, unit_price,
    supplier, supplier_sku, location, notes
  ) VALUES
    -- Filters
    (v_company_id, 'INV-0001', '16x25x1 MERV 8 Filter',
     'Standard 1-inch pleated air filter, MERV 8 rating',
     'filters', 'each', 45, 20, 40,
     285, 595,
     'FilterBuy', 'AFB16251M8', 'Warehouse - Shelf A1',
     'Most common residential size. High turnover item.'),

    (v_company_id, 'INV-0002', '20x20x1 MERV 11 Filter',
     'High-efficiency 1-inch pleated filter, MERV 11 rating',
     'filters', 'each', 28, 15, 30,
     385, 795,
     'FilterBuy', 'AFB20201M11', 'Warehouse - Shelf A1',
     'Premium filter for allergy customers.'),

    (v_company_id, 'INV-0003', '16x20x4 MERV 13 Filter',
     '4-inch media filter, MERV 13 rating for high-efficiency systems',
     'filters', 'each', 12, 8, 20,
     1285, 2495,
     'Honeywell', 'FC100A1011', 'Warehouse - Shelf A2',
     'For high-end HVAC systems. Lasts 6-12 months.'),

    -- Refrigerants
    (v_company_id, 'INV-0004', 'R-410A Refrigerant (25 lb)',
     'R-410A refrigerant cylinder, 25 lb capacity',
     'refrigerants', 'cylinder', 8, 3, 6,
     15000, 32500,
     'Johnstone Supply', 'R410A-25', 'Warehouse - Locked Cage',
     'EPA certified required. Track usage carefully. Prices fluctuate.'),

    (v_company_id, 'INV-0005', 'R-22 Refrigerant (30 lb)',
     'R-22 refrigerant cylinder for older systems, 30 lb',
     'refrigerants', 'cylinder', 3, 2, 4,
     35000, 72500,
     'Johnstone Supply', 'R22-30', 'Warehouse - Locked Cage',
     'DISCONTINUED - only for servicing old systems. Expensive.'),

    -- Thermostats
    (v_company_id, 'INV-0006', 'Honeywell T6 Pro Thermostat',
     'Programmable digital thermostat, universal compatibility',
     'controls', 'each', 15, 8, 15,
     5500, 12500,
     'Honeywell', 'TH6320U2008', 'Warehouse - Shelf B1',
     'Budget-friendly option for basic systems.'),

    (v_company_id, 'INV-0007', 'Nest Learning Thermostat (3rd Gen)',
     'Smart WiFi thermostat with learning capability',
     'controls', 'each', 8, 5, 10,
     18500, 34900,
     'Google', 'T3007ES', 'Warehouse - Shelf B1',
     'Popular smart thermostat. Good upsell item.'),

    (v_company_id, 'INV-0008', 'Ecobee SmartThermostat with Voice',
     'Smart thermostat with Alexa built-in, room sensor included',
     'controls', 'each', 6, 4, 8,
     19500, 37900,
     'Ecobee', 'EB-STATE5-01', 'Warehouse - Shelf B1',
     'Premium option. Includes room sensor.'),

    -- Ignitors and Sensors
    (v_company_id, 'INV-0009', 'Universal Hot Surface Ignitor',
     'Universal replacement ignitor for most gas furnaces',
     'ignition', 'each', 12, 6, 15,
     1200, 3850,
     'White-Rodgers', '767A-371', 'Van Stock',
     'Critical part - always keep in stock. Fast failure item.'),

    (v_company_id, 'INV-0010', 'Flame Sensor Rod',
     'Flame sensor rod for gas furnaces, universal fit',
     'ignition', 'each', 8, 5, 10,
     850, 2950,
     'Honeywell', 'Q340A1066', 'Van Stock',
     'Common failure point. Quick replacement part.'),

    -- Capacitors
    (v_company_id, 'INV-0011', '45/5 MFD Dual Run Capacitor',
     'Dual run capacitor 45/5 MFD, 370V - most common size',
     'electrical', 'each', 20, 10, 20,
     1250, 4500,
     'Turbo', '45+5/370', 'Van Stock',
     'Most common capacitor size. Stock multiple in van.'),

    (v_company_id, 'INV-0012', '40/5 MFD Dual Run Capacitor',
     'Dual run capacitor 40/5 MFD, 370V',
     'electrical', 'each', 15, 8, 15,
     1250, 4500,
     'Turbo', '40+5/370', 'Van Stock',
     'Second most common size. Van stock item.'),

    (v_company_id, 'INV-0013', '35/5 MFD Dual Run Capacitor',
     'Dual run capacitor 35/5 MFD, 370V',
     'electrical', 'each', 12, 6, 12,
     1250, 4500,
     'Turbo', '35+5/370', 'Van Stock',
     'Stock for smaller systems.');

  -- ============================================================================
  -- PLUMBING PARTS INVENTORY
  -- ============================================================================

  INSERT INTO inventory_items (
    company_id, item_number, name, description, category, unit,
    quantity_on_hand, reorder_point, reorder_quantity,
    unit_cost, unit_price,
    supplier, supplier_sku, location, notes
  ) VALUES
    -- Water Heater Parts
    (v_company_id, 'INV-0014', 'Water Heater Anode Rod - 44"',
     'Magnesium anode rod for standard water heaters, 44 inch',
     'water_heater', 'each', 6, 4, 8,
     1850, 4950,
     'Bradford White', 'BW-AR-44', 'Warehouse - Shelf C1',
     'Extends water heater life. Recommend during maintenance.'),

    (v_company_id, 'INV-0015', 'Water Heater T&P Relief Valve',
     'Temperature and pressure relief valve, 3/4 inch',
     'water_heater', 'each', 8, 5, 10,
     1250, 3850,
     'Watts', 'LF210-3/4', 'Van Stock',
     'Safety device - critical part. Replace if leaking.'),

    (v_company_id, 'INV-0016', 'Water Heater Elements - 4500W',
     'Electric water heater heating element, 4500W',
     'water_heater', 'each', 10, 6, 12,
     1150, 3250,
     'Camco', '02112', 'Warehouse - Shelf C1',
     'For electric water heaters. Keep in stock.'),

    -- Faucet Parts
    (v_company_id, 'INV-0017', 'Delta Faucet Cartridge RP19804',
     'Replacement cartridge for Delta Monitor showers',
     'faucets', 'each', 6, 4, 8,
     2850, 6950,
     'Delta', 'RP19804', 'Van Stock',
     'Very common Delta part. Van stock essential.'),

    (v_company_id, 'INV-0018', 'Moen 1225 Cartridge',
     'Replacement cartridge for Moen single-handle faucets',
     'faucets', 'each', 8, 5, 10,
     1950, 5450,
     'Moen', '1225', 'Van Stock',
     'One of most common faucet parts. Always stock.'),

    -- Drain Supplies
    (v_company_id, 'INV-0019', 'Toilet Wax Ring with Flange',
     'Standard wax ring with plastic flange for toilet installation',
     'drains', 'each', 15, 8, 20,
     285, 895,
     'Oatey', '31190', 'Van Stock',
     'Inexpensive, always keep stocked.'),

    (v_company_id, 'INV-0020', 'Garbage Disposal Mounting Kit',
     'Universal mounting hardware for garbage disposal installation',
     'drains', 'each', 4, 2, 6,
     850, 2450,
     'InSinkErator', 'MTGKIT', 'Warehouse - Shelf C2',
     'For disposal installations and replacements.');

  RAISE NOTICE '  ✓ Created 20 inventory items';

  -- ============================================================================
  -- SUMMARY
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '  Inventory Summary by Category:';
  RAISE NOTICE '  - Filters: 3 items (85 units total)';
  RAISE NOTICE '  - Refrigerants: 2 items (11 cylinders)';
  RAISE NOTICE '  - Controls/Thermostats: 3 items (29 units)';
  RAISE NOTICE '  - Ignition Parts: 2 items (20 units)';
  RAISE NOTICE '  - Electrical/Capacitors: 3 items (47 units)';
  RAISE NOTICE '  - Water Heater Parts: 3 items (24 units)';
  RAISE NOTICE '  - Faucet Parts: 2 items (14 units)';
  RAISE NOTICE '  - Drain Supplies: 2 items (19 units)';
  RAISE NOTICE '';
  RAISE NOTICE '  Total Inventory Value: ~$15,000';
  RAISE NOTICE '  Van Stock Items: 10 critical fast-moving parts';
  RAISE NOTICE '  Warehouse Items: 10 items for installations';
  RAISE NOTICE '';
  RAISE NOTICE '  Reorder Alerts:';
  RAISE NOTICE '  - R-22 Refrigerant: LOW (3 cylinders, reorder at 2)';
  RAISE NOTICE '  - 20x20x1 MERV 11 Filters: OK (28 units)';
  RAISE NOTICE '  - All other items: Adequate stock levels';
  RAISE NOTICE '';

END $$;
