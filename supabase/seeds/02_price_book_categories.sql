-- ============================================================================
-- SEED: Price Book Categories
-- ============================================================================
-- Creates a comprehensive category hierarchy for HVAC & Plumbing services
-- Uses materialized path pattern for efficient tree queries
-- ============================================================================

DO $$
DECLARE
  v_company_id UUID := current_setting('app.current_company_id')::uuid;

  -- Root categories
  v_hvac_id UUID;
  v_plumbing_id UUID;
  v_electrical_id UUID;
  v_service_id UUID;

  -- HVAC subcategories
  v_heating_id UUID;
  v_cooling_id UUID;
  v_ventilation_id UUID;
  v_ductwork_id UUID;
  v_thermostats_id UUID;

  -- Heating sub-subcategories
  v_furnaces_id UUID;
  v_heat_pumps_id UUID;
  v_boilers_id UUID;

  -- Cooling sub-subcategories
  v_central_ac_id UUID;
  v_mini_splits_id UUID;
  v_window_units_id UUID;

  -- Plumbing subcategories
  v_water_heaters_id UUID;
  v_fixtures_id UUID;
  v_pipes_id UUID;
  v_drains_id UUID;
  v_gas_lines_id UUID;

BEGIN

  RAISE NOTICE 'Seeding Price Book Categories...';

  -- ============================================================================
  -- ROOT CATEGORIES (Level 0)
  -- ============================================================================

  -- HVAC
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'HVAC',
    'hvac',
    'Heating, Ventilation, and Air Conditioning systems and services',
    NULL,
    '',
    0,
    1,
    'wind',
    '#FF6B6B',
    true,
    0,
    0
  ) RETURNING id INTO v_hvac_id;

  -- Plumbing
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Plumbing',
    'plumbing',
    'Water supply, drainage, and gas line services',
    NULL,
    '',
    0,
    2,
    'droplet',
    '#4ECDC4',
    true,
    0,
    0
  ) RETURNING id INTO v_plumbing_id;

  -- Electrical
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Electrical',
    'electrical',
    'Electrical systems and repairs',
    NULL,
    '',
    0,
    3,
    'zap',
    '#FFE66D',
    true,
    0,
    0
  ) RETURNING id INTO v_electrical_id;

  -- Service & Maintenance
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Service & Maintenance',
    'service-maintenance',
    'Regular maintenance and service plans',
    NULL,
    '',
    0,
    4,
    'wrench',
    '#95E1D3',
    true,
    0,
    0
  ) RETURNING id INTO v_service_id;

  RAISE NOTICE '  ✓ Created 4 root categories';

  -- ============================================================================
  -- HVAC SUBCATEGORIES (Level 1)
  -- ============================================================================

  -- Heating
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Heating',
    'heating',
    'Furnaces, boilers, and heat pumps',
    v_hvac_id,
    v_hvac_id::text,
    1,
    1,
    'flame',
    '#FF8B94',
    true,
    0,
    0
  ) RETURNING id INTO v_heating_id;

  -- Cooling
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Cooling',
    'cooling',
    'Air conditioning systems and equipment',
    v_hvac_id,
    v_hvac_id::text,
    1,
    2,
    'snowflake',
    '#A8DADC',
    true,
    0,
    0
  ) RETURNING id INTO v_cooling_id;

  -- Ventilation
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Ventilation',
    'ventilation',
    'Air circulation and ventilation systems',
    v_hvac_id,
    v_hvac_id::text,
    1,
    3,
    'airplay',
    '#C7CEEA',
    true,
    0,
    0
  ) RETURNING id INTO v_ventilation_id;

  -- Ductwork
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Ductwork',
    'ductwork',
    'Ducts, vents, and ductwork components',
    v_hvac_id,
    v_hvac_id::text,
    1,
    4,
    'package',
    '#FFDAB9',
    true,
    0,
    0
  ) RETURNING id INTO v_ductwork_id;

  -- Thermostats & Controls
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Thermostats & Controls',
    'thermostats-controls',
    'Smart thermostats and control systems',
    v_hvac_id,
    v_hvac_id::text,
    1,
    5,
    'cpu',
    '#B8B8FF',
    true,
    0,
    0
  ) RETURNING id INTO v_thermostats_id;

  RAISE NOTICE '  ✓ Created 5 HVAC subcategories';

  -- ============================================================================
  -- HEATING SUB-SUBCATEGORIES (Level 2)
  -- ============================================================================

  -- Furnaces
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Furnaces',
    'furnaces',
    'Gas, electric, and oil furnaces',
    v_heating_id,
    v_hvac_id::text || '.' || v_heating_id::text,
    2,
    1,
    'flame',
    '#FF6B6B',
    true,
    0,
    0
  ) RETURNING id INTO v_furnaces_id;

  -- Heat Pumps
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Heat Pumps',
    'heat-pumps',
    'Air source and geothermal heat pumps',
    v_heating_id,
    v_hvac_id::text || '.' || v_heating_id::text,
    2,
    2,
    'repeat',
    '#FF8B94',
    true,
    0,
    0
  ) RETURNING id INTO v_heat_pumps_id;

  -- Boilers
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Boilers',
    'boilers',
    'Hot water and steam boilers',
    v_heating_id,
    v_hvac_id::text || '.' || v_heating_id::text,
    2,
    3,
    'droplet',
    '#FFA07A',
    true,
    0,
    0
  ) RETURNING id INTO v_boilers_id;

  RAISE NOTICE '  ✓ Created 3 heating sub-subcategories';

  -- ============================================================================
  -- COOLING SUB-SUBCATEGORIES (Level 2)
  -- ============================================================================

  -- Central Air Conditioning
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Central Air Conditioning',
    'central-ac',
    'Central AC systems and split systems',
    v_cooling_id,
    v_hvac_id::text || '.' || v_cooling_id::text,
    2,
    1,
    'home',
    '#87CEEB',
    true,
    0,
    0
  ) RETURNING id INTO v_central_ac_id;

  -- Ductless Mini-Splits
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Ductless Mini-Splits',
    'mini-splits',
    'Ductless heating and cooling systems',
    v_cooling_id,
    v_hvac_id::text || '.' || v_cooling_id::text,
    2,
    2,
    'box',
    '#B0E0E6',
    true,
    0,
    0
  ) RETURNING id INTO v_mini_splits_id;

  -- Window & Portable Units
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Window & Portable Units',
    'window-portable',
    'Window AC units and portable air conditioners',
    v_cooling_id,
    v_hvac_id::text || '.' || v_cooling_id::text,
    2,
    3,
    'grid',
    '#ADD8E6',
    true,
    0,
    0
  ) RETURNING id INTO v_window_units_id;

  RAISE NOTICE '  ✓ Created 3 cooling sub-subcategories';

  -- ============================================================================
  -- PLUMBING SUBCATEGORIES (Level 1)
  -- ============================================================================

  -- Water Heaters
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Water Heaters',
    'water-heaters',
    'Tank and tankless water heaters',
    v_plumbing_id,
    v_plumbing_id::text,
    1,
    1,
    'droplet',
    '#FF6F61',
    true,
    0,
    0
  ) RETURNING id INTO v_water_heaters_id;

  -- Fixtures & Fittings
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Fixtures & Fittings',
    'fixtures-fittings',
    'Faucets, sinks, toilets, and fixtures',
    v_plumbing_id,
    v_plumbing_id::text,
    1,
    2,
    'droplet',
    '#6BB6FF',
    true,
    0,
    0
  ) RETURNING id INTO v_fixtures_id;

  -- Pipes & Valves
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Pipes & Valves',
    'pipes-valves',
    'Piping materials and valve systems',
    v_plumbing_id,
    v_plumbing_id::text,
    1,
    3,
    'share-2',
    '#4ECDC4',
    true,
    0,
    0
  ) RETURNING id INTO v_pipes_id;

  -- Drains & Sewers
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Drains & Sewers',
    'drains-sewers',
    'Drain cleaning and sewer services',
    v_plumbing_id,
    v_plumbing_id::text,
    1,
    4,
    'delete',
    '#556B2F',
    true,
    0,
    0
  ) RETURNING id INTO v_drains_id;

  -- Gas Lines
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Gas Lines',
    'gas-lines',
    'Gas line installation and repair',
    v_plumbing_id,
    v_plumbing_id::text,
    1,
    5,
    'alert-circle',
    '#FFA500',
    true,
    0,
    0
  ) RETURNING id INTO v_gas_lines_id;

  RAISE NOTICE '  ✓ Created 5 plumbing subcategories';

  -- ============================================================================
  -- ELECTRICAL SUBCATEGORIES (Level 1)
  -- ============================================================================

  -- Electrical Panels
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Electrical Panels',
    'electrical-panels',
    'Circuit breaker panels and electrical boxes',
    v_electrical_id,
    v_electrical_id::text,
    1,
    1,
    'server',
    '#FFD700',
    true,
    0,
    0
  );

  -- Outlets & Switches
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Outlets & Switches',
    'outlets-switches',
    'Electrical outlets, switches, and receptacles',
    v_electrical_id,
    v_electrical_id::text,
    1,
    2,
    'toggle-left',
    '#FFE66D',
    true,
    0,
    0
  );

  -- Lighting
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Lighting',
    'lighting',
    'Light fixtures and installation',
    v_electrical_id,
    v_electrical_id::text,
    1,
    3,
    'sun',
    '#FFB347',
    true,
    0,
    0
  );

  RAISE NOTICE '  ✓ Created 3 electrical subcategories';

  -- ============================================================================
  -- SERVICE & MAINTENANCE SUBCATEGORIES (Level 1)
  -- ============================================================================

  -- Annual Maintenance Plans
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Maintenance Plans',
    'maintenance-plans',
    'Annual service and maintenance agreements',
    v_service_id,
    v_service_id::text,
    1,
    1,
    'calendar',
    '#90EE90',
    true,
    0,
    0
  );

  -- Emergency Services
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Emergency Services',
    'emergency-services',
    'After-hours and emergency call-outs',
    v_service_id,
    v_service_id::text,
    1,
    2,
    'alert-triangle',
    '#FF4444',
    true,
    0,
    0
  );

  -- Diagnostic Services
  INSERT INTO price_book_categories (
    company_id, name, slug, description, parent_id, path, level,
    sort_order, icon, color, is_active, item_count, descendant_item_count
  ) VALUES (
    v_company_id,
    'Diagnostic Services',
    'diagnostic-services',
    'System inspection and diagnostics',
    v_service_id,
    v_service_id::text,
    1,
    3,
    'search',
    '#87CEEB',
    true,
    0,
    0
  );

  RAISE NOTICE '  ✓ Created 3 service subcategories';

  -- ============================================================================
  -- SUMMARY
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '  Summary: Created 30+ price book categories';
  RAISE NOTICE '  - 4 root categories';
  RAISE NOTICE '  - 16 level-1 subcategories';
  RAISE NOTICE '  - 6 level-2 sub-subcategories';
  RAISE NOTICE '';

END $$;
