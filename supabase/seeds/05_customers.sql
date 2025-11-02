-- ============================================================================
-- SEED: Customers
-- ============================================================================
-- Creates 25 realistic customers (15 residential, 10 commercial)
-- SF Bay Area locations with realistic contact information
-- ============================================================================

DO $$
DECLARE
  v_company_id UUID := current_setting('app.current_company_id')::uuid;
  v_user_id UUID := current_setting('app.current_user_id')::uuid;
BEGIN

  RAISE NOTICE 'Seeding Customers...';

  -- ============================================================================
  -- RESIDENTIAL CUSTOMERS (15)
  -- ============================================================================

  INSERT INTO customers (
    company_id, type, first_name, last_name, display_name,
    email, phone, secondary_phone,
    address, address2, city, state, zip_code, country,
    source, preferred_contact_method, status, tags,
    communication_preferences,
    total_revenue, total_jobs, total_invoices,
    average_job_value, outstanding_balance,
    portal_enabled, notes, internal_notes
  )
  VALUES
    -- VIP Residential Customers
    (v_company_id, 'residential', 'Sarah', 'Chen', 'Sarah Chen',
     'sarah.chen@gmail.com', '(415) 555-0101', '(415) 555-0102',
     '2847 Pacific Heights Ave', NULL, 'San Francisco', 'CA', '94123', 'USA',
     'referral', 'email', 'active', '["vip-customer", "service-plan"]'::jsonb,
     '{"email": true, "sms": true, "phone": true, "marketing": true}'::jsonb,
     284500, 8, 8, 35562, 0,
     true, 'Long-time customer, owns 3 properties in SF. Always books maintenance plans.', 'Excellent payment history. Refer friends regularly.'),

    (v_company_id, 'residential', 'Michael', 'Rodriguez', 'Michael Rodriguez',
     'mrodriguez@yahoo.com', '(415) 555-0103', NULL,
     '1234 Noe Valley Street', 'Apt 3B', 'San Francisco', 'CA', '94114', 'USA',
     'google', 'phone', 'active', '["service-plan"]'::jsonb,
     '{"email": true, "sms": false, "phone": true, "marketing": false}'::jsonb,
     175000, 5, 5, 35000, 0,
     false, 'Victorian home with original heating system. Prefers phone calls.', 'Concerned about energy efficiency.'),

    (v_company_id, 'residential', 'Jennifer', 'Thompson', 'Jennifer Thompson',
     'jennifer.thompson@outlook.com', '(650) 555-0201', '(650) 555-0202',
     '892 Middlefield Road', NULL, 'Palo Alto', 'CA', '94301', 'USA',
     'yelp', 'email', 'active', '["new-customer"]'::jsonb,
     '{"email": true, "sms": true, "phone": false, "marketing": true}'::jsonb,
     125000, 2, 2, 62500, 0,
     true, 'New construction home. Tech-savvy, prefers email/text.', 'Interested in smart home integration.'),

    (v_company_id, 'residential', 'David', 'Park', 'David Park',
     'david.park@gmail.com', '(408) 555-0301', NULL,
     '5678 Winchester Blvd', NULL, 'San Jose', 'CA', '95128', 'USA',
     'referral', 'sms', 'active', '[]'::jsonb,
     '{"email": true, "sms": true, "phone": true, "marketing": true}'::jsonb,
     89500, 3, 3, 29833, 0,
     false, 'Rental property owner. Has 2 units that need regular maintenance.', 'Cash payment preferred.'),

    (v_company_id, 'residential', 'Emily', 'Martinez', 'Emily Martinez',
     'emily.m@protonmail.com', '(510) 555-0401', '(510) 555-0402',
     '3421 College Avenue', NULL, 'Oakland', 'CA', '94618', 'USA',
     'direct', 'email', 'active', '["vip-customer"]'::jsonb,
     '{"email": true, "sms": false, "phone": false, "marketing": true}'::jsonb,
     295000, 9, 9, 32778, 0,
     true, 'Historic home in Rockridge. Multiple HVAC zones. Very detail-oriented.', 'Environmentally conscious, asks about eco-friendly options.'),

    (v_company_id, 'residential', 'Robert', 'Williams', 'Robert Williams',
     'bob.williams@gmail.com', '(415) 555-0501', NULL,
     '789 Sunset Boulevard', NULL, 'San Francisco', 'CA', '94122', 'USA',
     'google', 'phone', 'active', '[]'::jsonb,
     '{"email": false, "sms": true, "phone": true, "marketing": false}'::jsonb,
     65000, 2, 2, 32500, 0,
     false, 'Older home near Golden Gate Park. Furnace needs frequent service.', 'Retired, home most days.'),

    (v_company_id, 'residential', 'Amanda', 'Lee', 'Amanda Lee',
     'amanda.lee@icloud.com', '(650) 555-0601', '(650) 555-0602',
     '2156 Sand Hill Road', NULL, 'Menlo Park', 'CA', '94025', 'USA',
     'facebook', 'email', 'active', '["service-plan", "vip-customer"]'::jsonb,
     '{"email": true, "sms": true, "phone": true, "marketing": true}'::jsonb,
     425000, 12, 12, 35417, 0,
     true, 'Large estate home. High-end equipment. Very responsive to communications.', 'Excellent relationship. Christmas bonuses.'),

    (v_company_id, 'residential', 'James', 'Anderson', 'James Anderson',
     'j.anderson@gmail.com', '(415) 555-0701', NULL,
     '1567 Divisadero Street', NULL, 'San Francisco', 'CA', '94115', 'USA',
     'referral', 'email', 'active', '[]'::jsonb,
     '{"email": true, "sms": true, "phone": false, "marketing": true}'::jsonb,
     145000, 4, 4, 36250, 0,
     false, 'Recently remodeled home. New HVAC system installed last year.', 'Referral from Sarah Chen.'),

    (v_company_id, 'residential', 'Lisa', 'Nguyen', 'Lisa Nguyen',
     'lisa.nguyen@yahoo.com', '(408) 555-0801', '(408) 555-0802',
     '4523 Meridian Avenue', NULL, 'San Jose', 'CA', '95124', 'USA',
     'yelp', 'phone', 'active', '["new-customer"]'::jsonb,
     '{"email": true, "sms": false, "phone": true, "marketing": false}'::jsonb,
     45000, 1, 1, 45000, 0,
     false, 'New customer. AC replacement completed recently.', 'First-time homeowner, learning about maintenance.'),

    (v_company_id, 'residential', 'Christopher', 'Davis', 'Christopher Davis',
     'chris.davis@gmail.com', '(510) 555-0901', NULL,
     '2890 Telegraph Avenue', NULL, 'Berkeley', 'CA', '94705', 'USA',
     'google', 'email', 'active', '[]'::jsonb,
     '{"email": true, "sms": true, "phone": false, "marketing": true}'::jsonb,
     98500, 3, 3, 32833, 0,
     true, 'Older Berkeley home. Interested in upgrading to more efficient systems.', 'Works from home, flexible scheduling.'),

    (v_company_id, 'residential', 'Maria', 'Garcia', 'Maria Garcia',
     'maria.garcia@hotmail.com', '(415) 555-1001', '(415) 555-1002',
     '3678 Mission Street', NULL, 'San Francisco', 'CA', '94110', 'USA',
     'referral', 'phone', 'active', '["service-plan"]'::jsonb,
     '{"email": false, "sms": true, "phone": true, "marketing": false}'::jsonb,
     155000, 5, 5, 31000, 0,
     false, 'Family home. Prefers Spanish communication when possible.', 'Multiple family members may be present during service.'),

    (v_company_id, 'residential', 'Daniel', 'Kim', 'Daniel Kim',
     'daniel.kim@gmail.com', '(650) 555-1101', NULL,
     '1245 El Camino Real', NULL, 'Redwood City', 'CA', '94063', 'USA',
     'direct', 'email', 'active', '[]'::jsonb,
     '{"email": true, "sms": true, "phone": false, "marketing": true}'::jsonb,
     72000, 2, 2, 36000, 0,
     true, 'Tech industry professional. Very responsive to email. Appreciates detailed explanations.', 'Likes photos and documentation of work.'),

    (v_company_id, 'residential', 'Patricia', 'Brown', 'Patricia Brown',
     'pbrown@aol.com', '(510) 555-1201', NULL,
     '5234 Broadway', NULL, 'Oakland', 'CA', '94612', 'USA',
     'yelp', 'phone', 'active', '["payment-issues"]'::jsonb,
     '{"email": true, "sms": false, "phone": true, "marketing": false}'::jsonb,
     115000, 4, 5, 28750, 28500,
     false, 'Senior citizen, fixed income. Request payment plans when necessary.', 'Late payment on last invoice. Follow up required.'),

    (v_company_id, 'residential', 'Steven', 'White', 'Steven White',
     'steven.white@gmail.com', '(415) 555-1301', '(415) 555-1302',
     '2456 Chestnut Street', NULL, 'San Francisco', 'CA', '94123', 'USA',
     'google', 'email', 'active', '["vip-customer"]'::jsonb,
     '{"email": true, "sms": true, "phone": true, "marketing": true}'::jsonb,
     385000, 11, 11, 35000, 0,
     true, 'Marina District condo. High-rise building with specific access requirements.', 'Great tipper. Building management contact required for access.'),

    (v_company_id, 'residential', 'Nancy', 'Taylor', 'Nancy Taylor',
     'nancy.taylor@gmail.com', '(408) 555-1401', NULL,
     '6789 Almaden Expressway', NULL, 'San Jose', 'CA', '95123', 'USA',
     'referral', 'email', 'active', '[]'::jsonb,
     '{"email": true, "sms": true, "phone": false, "marketing": true}'::jsonb,
     58000, 2, 2, 29000, 0,
     false, 'Suburban home. Standard split system. Straightforward service needs.', 'Referred by David Park.');

  RAISE NOTICE '  ✓ Created 15 residential customers';

  -- ============================================================================
  -- COMMERCIAL CUSTOMERS (10)
  -- ============================================================================

  INSERT INTO customers (
    company_id, type, first_name, last_name, company_name, display_name,
    email, phone, secondary_phone,
    address, address2, city, state, zip_code, country,
    source, preferred_contact_method, status, tags,
    communication_preferences,
    billing_email, payment_terms, credit_limit,
    total_revenue, total_jobs, total_invoices,
    average_job_value, outstanding_balance,
    portal_enabled, notes, internal_notes
  )
  VALUES
    -- Large Commercial Accounts
    (v_company_id, 'commercial', 'Rachel', 'Green', 'TechStart Ventures', 'TechStart Ventures',
     'rachel.green@techstart.com', '(415) 555-2001', '(415) 555-2002',
     '100 Montgomery Street', 'Suite 2500', 'San Francisco', 'CA', '94104', 'USA',
     'direct', 'email', 'active', '["commercial", "vip-customer", "service-plan"]'::jsonb,
     '{"email": true, "sms": false, "phone": true, "marketing": true}'::jsonb,
     'ap@techstart.com', 'net_30', 5000000,
     945000, 18, 18, 52500, 0,
     true, '25,000 sq ft office space. Multiple HVAC zones. Quarterly maintenance contract.', 'Facility Manager: Rachel Green. Building engineer onsite M-F. Priority customer.'),

    (v_company_id, 'commercial', 'Michael', 'Scott', 'The Office Complex LLC', 'The Office Complex LLC',
     'michael@theofficecomplex.com', '(650) 555-2101', NULL,
     '2500 Sand Hill Road', NULL, 'Menlo Park', 'CA', '94025', 'USA',
     'referral', 'email', 'active', '["commercial", "service-plan"]'::jsonb,
     '{"email": true, "sms": false, "phone": true, "marketing": false}'::jsonb,
     'accounting@theofficecomplex.com', 'net_30', 3000000,
     675000, 15, 15, 45000, 0,
     true, 'Multi-tenant office building. 50,000 sq ft. Rooftop HVAC units.', 'Works with multiple vendors. Competitive on pricing.'),

    (v_company_id, 'commercial', 'Jim', 'Halpert', 'Halpert Properties', 'Halpert Properties',
     'jim@halpertproperties.com', '(415) 555-2201', '(415) 555-2202',
     '456 Market Street', NULL, 'San Francisco', 'CA', '94105', 'USA',
     'direct', 'phone', 'active', '["commercial", "vip-customer"]'::jsonb,
     '{"email": true, "sms": true, "phone": true, "marketing": true}'::jsonb,
     'billing@halpertproperties.com', 'net_15', 2000000,
     525000, 12, 12, 43750, 0,
     true, 'Property management company. 8 commercial properties in portfolio.', 'Jim is hands-on. Responds quickly. Excellent relationship.'),

    (v_company_id, 'commercial', 'Pam', 'Beesly', 'Riverside Restaurant Group', 'Riverside Restaurant Group',
     'pam@riversiderestaurants.com', '(510) 555-2301', NULL,
     '789 Embarcadero', NULL, 'Oakland', 'CA', '94607', 'USA',
     'yelp', 'email', 'active', '["commercial"]'::jsonb,
     '{"email": true, "sms": false, "phone": false, "marketing": false}'::jsonb,
     'pam@riversiderestaurants.com', 'due_on_receipt', 0,
     385000, 14, 14, 27500, 0,
     false, 'Restaurant chain - 3 locations. Kitchen exhaust and HVAC critical. After-hours service sometimes needed.', 'Health code compliance is priority. Quick turnaround essential.'),

    (v_company_id, 'commercial', 'Dwight', 'Schrute', 'Schrute Farms Storage', 'Schrute Farms Storage',
     'dwight@schrutefarms.com', '(408) 555-2401', '(408) 555-2402',
     '1500 Industrial Parkway', NULL, 'San Jose', 'CA', '95131', 'USA',
     'google', 'phone', 'active', '["commercial", "service-plan"]'::jsonb,
     '{"email": false, "sms": false, "phone": true, "marketing": false}'::jsonb,
     'dwight@schrutefarms.com', 'net_30', 1000000,
     445000, 10, 10, 44500, 0,
     false, 'Large warehouse facility. Climate control for storage units. Prefers phone communication.', 'Very detail-oriented. Expects thorough explanations.'),

    (v_company_id, 'commercial', 'Angela', 'Martin', 'Martin Medical Center', 'Martin Medical Center',
     'amartin@martinmedical.com', '(650) 555-2501', '(650) 555-2502',
     '2000 Page Mill Road', NULL, 'Palo Alto', 'CA', '94304', 'USA',
     'referral', 'email', 'active', '["commercial", "vip-customer"]'::jsonb,
     '{"email": true, "sms": false, "phone": true, "marketing": false}'::jsonb,
     'accounting@martinmedical.com', 'net_30', 2500000,
     625000, 13, 13, 48077, 0,
     true, 'Medical clinic. Strict temperature control requirements. HVAC cannot fail. Backup systems in place.', 'Healthcare facility - highest priority for emergency calls. Premium rates apply.'),

    (v_company_id, 'commercial', 'Kevin', 'Malone', 'Malone Retail Centers', 'Malone Retail Centers',
     'kevin@maloneretail.com', '(415) 555-2601', NULL,
     '3400 Cesar Chavez Street', NULL, 'San Francisco', 'CA', '94110', 'USA',
     'direct', 'email', 'active', '["commercial"]'::jsonb,
     '{"email": true, "sms": true, "phone": false, "marketing": true}'::jsonb,
     'ap@maloneretail.com', 'net_60', 1500000,
     295000, 8, 8, 36875, 59000,
     true, 'Shopping center with multiple tenant spaces. Central HVAC system. Slow payer - net 60 terms.', 'Invoice immediately. Follow up on payments. Currently 59k outstanding.'),

    (v_company_id, 'commercial', 'Oscar', 'Martinez', 'Martinez Fitness Club', 'Martinez Fitness Club',
     'oscar@martinezfitness.com', '(510) 555-2701', '(510) 555-2702',
     '4567 Broadway', NULL, 'Oakland', 'CA', '94611', 'USA',
     'facebook', 'phone', 'active', '["commercial", "new-customer"]'::jsonb,
     '{"email": true, "sms": true, "phone": true, "marketing": true}'::jsonb,
     'oscar@martinezfitness.com', 'net_15', 750000,
     125000, 2, 2, 62500, 0,
     false, 'Gym facility. Heavy HVAC load. Needs reliable cooling year-round.', 'New customer. Recently switched from competitor due to service issues.'),

    (v_company_id, 'commercial', 'Stanley', 'Hudson', 'Hudson Hotel Group', 'Hudson Hotel Group',
     'stanley@hudsonhotels.com', '(415) 555-2801', NULL,
     '500 Geary Street', NULL, 'San Francisco', 'CA', '94102', 'USA',
     'referral', 'email', 'active', '["commercial", "service-plan", "vip-customer"]'::jsonb,
     '{"email": true, "sms": false, "phone": true, "marketing": false}'::jsonb,
     'facilities@hudsonhotels.com', 'net_30', 4000000,
     825000, 16, 16, 51563, 0,
     true, 'Boutique hotel. 80 rooms. Multiple boilers and chillers. 24/7 operation. Emergency service contract.', 'Stanley is maintenance director. Very organized. Monthly maintenance schedule established.'),

    (v_company_id, 'commercial', 'Phyllis', 'Vance', 'Vance Refrigeration Inc', 'Vance Refrigeration Inc',
     'phyllis@vancerefrig.com', '(408) 555-2901', '(408) 555-2902',
     '6000 Hellyer Avenue', NULL, 'San Jose', 'CA', '95138', 'USA',
     'google', 'email', 'active', '["commercial"]'::jsonb,
     '{"email": true, "sms": false, "phone": true, "marketing": true}'::jsonb,
     'ap@vancerefrig.com', 'net_30', 2000000,
     475000, 11, 11, 43182, 0,
     true, 'Industrial facility. Large refrigeration systems. Specialized commercial HVAC.', 'Refrigeration company - knows HVAC well. Appreciates technical expertise.');

  RAISE NOTICE '  ✓ Created 10 commercial customers';

  -- ============================================================================
  -- SUMMARY
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '  Summary: Created 25 customers';
  RAISE NOTICE '  - 15 Residential customers';
  RAISE NOTICE '  - 10 Commercial customers';
  RAISE NOTICE '  - Mix of new, regular, and VIP customers';
  RAISE NOTICE '  - Realistic SF Bay Area locations';
  RAISE NOTICE '  - Various communication preferences';
  RAISE NOTICE '';

END $$;
