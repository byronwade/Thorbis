-- ============================================================================
-- SEED: Invoices
-- ============================================================================
-- Creates 30 invoices for completed and in-progress jobs
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

  -- Job IDs (we'll fetch these)
  v_sarah_emergency_job UUID;
  v_jennifer_ac_repair_job UUID;
  v_david_water_heater_job UUID;

  v_invoice_number INTEGER := 1;
  v_invoice_id UUID;

BEGIN

  RAISE NOTICE 'Seeding Invoices...';

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
  SELECT id INTO v_james_kim_id FROM customers WHERE email = 'james.kim@yahoo.com';
  SELECT id INTO v_maria_santos_id FROM customers WHERE email = 'maria.santos@gmail.com';
  SELECT id INTO v_kevin_chang_id FROM customers WHERE email = 'kevin.chang@gmail.com';
  SELECT id INTO v_rachel_green_id FROM customers WHERE email = 'rachel.green@gmail.com';
  SELECT id INTO v_techstart_id FROM customers WHERE email = 'facilities@techstart.io';
  SELECT id INTO v_office_complex_id FROM customers WHERE email = 'management@marinoffices.com';
  SELECT id INTO v_restaurant_id FROM customers WHERE email = 'ops@riversidegroup.com';
  SELECT id INTO v_medical_center_id FROM customers WHERE email = 'facilities@bayhealthcenter.org';

  -- ============================================================================
  -- PAID INVOICES (older, paid in full)
  -- ============================================================================

  -- Invoice 1: Sarah's emergency repair (paid immediately)
  INSERT INTO invoices (
    company_id, customer_id, job_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms, payment_method,
    notes
  ) VALUES (
    v_company_id, v_sarah_chen_id, NULL,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'paid', '2024-10-15'::date, '2024-11-14'::date,
    42500, 3612, 46112, 46112, 0,
    'due_on_receipt',
    'credit_card',
    'Emergency repair - furnace igniter replacement. VIP customer paid immediately upon completion.'
  ) RETURNING id INTO v_invoice_id;
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 2: Jennifer's AC repair (paid)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms, payment_method,
    notes
  ) VALUES (
    v_company_id, v_jennifer_thompson_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'paid', '2024-07-22'::date, '2024-08-21'::date,
    68500, 5822, 74322, 74322, 0,
    'net_30',
    'check',
    'AC refrigerant recharge - upstairs zone. Paid by check within 10 days.'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 3: David's water heater installation (paid)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms, payment_method,
    notes
  ) VALUES (
    v_company_id, v_david_park_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'paid', '2024-08-05'::date, '2024-09-04'::date,
    165000, 14025, 179025, 179025, 0,
    'net_30',
    'check',
    '40-gallon gas water heater replacement. Permit included. Paid in full.'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 4: Maria's drain cleaning (paid)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms, payment_method
  ) VALUES (
    v_company_id, v_maria_santos_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'paid', '2024-08-20'::date, '2024-09-19'::date,
    18500, 1572, 20072, 20072, 0,
    'net_30',
    'credit_card'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 5: Lisa's smart thermostat (paid)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms, payment_method
  ) VALUES (
    v_company_id, v_lisa_nguyen_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'paid', '2024-07-15'::date, '2024-08-14'::date,
    45000, 3825, 48825, 48825, 0,
    'net_30',
    'credit_card'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 6: Kevin's bathroom faucet repair (paid)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms, payment_method
  ) VALUES (
    v_company_id, v_kevin_chang_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'paid', '2024-09-25'::date, '2024-10-25'::date,
    12500, 1062, 13562, 13562, 0,
    'net_30',
    'ach'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 7: Restaurant AC repair (paid)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms, payment_method,
    notes
  ) VALUES (
    v_company_id, v_restaurant_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'paid', '2024-08-12'::date, '2024-09-11'::date,
    45000, 3825, 48825, 48825, 0,
    'net_30',
    'check',
    'Emergency dining room AC repair. Commercial customer - paid promptly.'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 8: Rachel's ductwork sealing (paid)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms, payment_method
  ) VALUES (
    v_company_id, v_rachel_green_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'paid', '2024-10-28'::date, '2024-11-27'::date,
    55000, 4675, 59675, 59675, 0,
    'net_30',
    'credit_card'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 9: James' gas line inspection (paid)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms, payment_method
  ) VALUES (
    v_company_id, v_james_kim_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'paid', '2024-09-18'::date, '2024-10-18'::date,
    6500, 552, 7052, 7052, 0,
    'net_30',
    'credit_card'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 10: Emily's sump pump installation (paid)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms, payment_method
  ) VALUES (
    v_company_id, v_emily_martinez_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'paid', '2024-10-30'::date, '2024-11-29'::date,
    85000, 7225, 92225, 92225, 0,
    'net_30',
    'check'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 11: Restaurant kitchen exhaust repair (paid)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms, payment_method
  ) VALUES (
    v_company_id, v_restaurant_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'paid', '2024-11-12'::date, '2024-12-12'::date,
    32500, 2762, 35262, 35262, 0,
    'net_30',
    'check'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 12: Robert's diagnostic (paid)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms, payment_method,
    notes
  ) VALUES (
    v_company_id, v_robert_williams_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'paid', '2024-11-05'::date, '2024-12-05'::date,
    8500, 722, 9222, 9222, 0,
    'net_30',
    'credit_card',
    'Furnace diagnostic and combustion analysis. Customer paid but concerned about replacement cost.'
  );
  v_invoice_number := v_invoice_number + 1;

  -- ============================================================================
  -- PARTIAL PAYMENT INVOICES (recent, partially paid)
  -- ============================================================================

  -- Invoice 13: Amanda's zoned system - 50% deposit received
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms, payment_method,
    notes
  ) VALUES (
    v_company_id, v_amanda_lee_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'partial', '2024-11-20'::date, '2024-12-06'::date,
    2850000, 242250, 3092250, 1546125, 1546125,
    'custom',
    'check',
    'Large installation project. 50% deposit received upfront. Balance due upon completion (Dec 6). VIP customer.'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 14: TechStart quarterly maintenance (partial - net 30 in progress)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms, payment_method,
    notes
  ) VALUES (
    v_company_id, v_techstart_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'partial', '2024-09-10'::date, '2024-10-10'::date,
    0, 0, 0, 0, 0,
    'net_30',
    NULL,
    'Quarterly maintenance - covered under service plan. $0 invoice for record keeping. Premium plan customer.'
  );
  v_invoice_number := v_invoice_number + 1;

  -- ============================================================================
  -- OUTSTANDING INVOICES (sent, awaiting payment)
  -- ============================================================================

  -- Invoice 15: Office complex diagnostic (outstanding - within terms)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms,
    notes
  ) VALUES (
    v_company_id, v_office_complex_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'sent', '2024-12-04'::date, '2025-01-03'::date,
    15000, 1275, 16275, 0, 16275,
    'net_30',
    'Energy audit diagnostic - in progress. Invoice sent, payment expected per normal terms. Commercial customer with good payment history.'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 16: Sarah's spring maintenance (outstanding - will pay)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms,
    notes
  ) VALUES (
    v_company_id, v_sarah_chen_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'sent', '2024-05-20'::date, '2024-06-19'::date,
    0, 0, 0, 0, 0,
    'due_on_receipt',
    'Premium service plan - spring AC tune-up for all 3 zones. $0 invoice. VIP customer.'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 17: Michael's fall maintenance (outstanding - service plan)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms
  ) VALUES (
    v_company_id, v_michael_rodriguez_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'sent', '2024-09-15'::date, '2024-10-15'::date,
    0, 0, 0, 0, 0,
    'due_on_receipt'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 18: Jennifer's heat pump repair (waiting for parts)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms,
    notes
  ) VALUES (
    v_company_id, v_jennifer_thompson_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'draft', '2024-11-20'::date, '2024-12-20'::date,
    95000, 8075, 103075, 0, 103075,
    'net_30',
    'Compressor replacement - warranty part. Invoice in draft, will send after installation complete. Awaiting part delivery.'
  );
  v_invoice_number := v_invoice_number + 1;

  -- ============================================================================
  -- OVERDUE INVOICES (past due date)
  -- ============================================================================

  -- Invoice 19: Small residential repair - 15 days overdue
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms,
    notes
  ) VALUES (
    v_company_id, v_maria_santos_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'overdue', '2024-10-20'::date, '2024-11-19'::date,
    22500, 1912, 24412, 0, 24412,
    'net_30',
    'Toilet repair. 15 days overdue. First follow-up sent. Customer usually pays, likely oversight.'
  );
  v_invoice_number := v_invoice_number + 1;

  -- Invoice 20: Small job - 30 days overdue (problem account)
  INSERT INTO invoices (
    company_id, customer_id,
    invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance,
    payment_terms,
    notes
  ) VALUES (
    v_company_id, v_rachel_green_id,
    'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
    'overdue', '2024-09-28'::date, '2024-10-28'::date,
    15500, 1317, 16817, 0, 16817,
    'net_30',
    'Leaky faucet repair. 30+ days overdue. Multiple follow-ups sent. Customer not responding. May need collections.'
  );
  v_invoice_number := v_invoice_number + 1;

  -- ============================================================================
  -- ADDITIONAL PAID INVOICES (fill out history)
  -- ============================================================================

  -- More paid invoices from earlier this year
  INSERT INTO invoices (
    company_id, customer_id, invoice_number, status, invoice_date, due_date,
    subtotal, tax, total, amount_paid, balance, payment_terms, payment_method
  ) VALUES
    (v_company_id, v_james_kim_id, 'INV-2024-' || LPAD(v_invoice_number::text, 4, '0'),
     'paid', '2024-05-10'::date, '2024-06-09'::date,
     38500, 3272, 41772, 41772, 0, 'net_30', 'credit_card'),

    (v_company_id, v_emily_martinez_id, 'INV-2024-' || LPAD((v_invoice_number + 1)::text, 4, '0'),
     'paid', '2024-06-15'::date, '2024-07-15'::date,
     52000, 4420, 56420, 56420, 0, 'net_30', 'check'),

    (v_company_id, v_david_park_id, 'INV-2024-' || LPAD((v_invoice_number + 2)::text, 4, '0'),
     'paid', '2024-04-20'::date, '2024-05-20'::date,
     19500, 1657, 21157, 21157, 0, 'net_30', 'credit_card'),

    (v_company_id, v_kevin_chang_id, 'INV-2024-' || LPAD((v_invoice_number + 3)::text, 4, '0'),
     'paid', '2024-07-08'::date, '2024-08-07'::date,
     28500, 2422, 30922, 30922, 0, 'net_30', 'ach'),

    (v_company_id, v_office_complex_id, 'INV-2024-' || LPAD((v_invoice_number + 4)::text, 4, '0'),
     'paid', '2024-06-30'::date, '2024-07-30'::date,
     125000, 10625, 135625, 135625, 0, 'net_30', 'check'),

    (v_company_id, v_restaurant_id, 'INV-2024-' || LPAD((v_invoice_number + 5)::text, 4, '0'),
     'paid', '2024-05-22'::date, '2024-06-21'::date,
     65000, 5525, 70525, 70525, 0, 'net_30', 'check'),

    (v_company_id, v_medical_center_id, 'INV-2024-' || LPAD((v_invoice_number + 6)::text, 4, '0'),
     'paid', '2024-08-15'::date, '2024-10-14'::date, -- Net 60
     0, 0, 0, 0, 0, 'net_60', NULL),

    (v_company_id, v_techstart_id, 'INV-2024-' || LPAD((v_invoice_number + 7)::text, 4, '0'),
     'paid', '2024-06-10'::date, '2024-07-10'::date,
     0, 0, 0, 0, 0, 'net_30', NULL),

    (v_company_id, v_lisa_nguyen_id, 'INV-2024-' || LPAD((v_invoice_number + 8)::text, 4, '0'),
     'paid', '2024-08-20'::date, '2024-09-19'::date,
     0, 0, 0, 0, 0, 'net_30', 'credit_card'),

    (v_company_id, v_amanda_lee_id, 'INV-2024-' || LPAD((v_invoice_number + 9)::text, 4, '0'),
     'paid', '2024-07-15'::date, '2024-08-14'::date,
     145000, 12325, 157325, 157325, 0, 'net_30', 'check');

  v_invoice_number := v_invoice_number + 10;

  RAISE NOTICE '  ✓ Created 30 invoices';

  -- ============================================================================
  -- SUMMARY
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '  Invoice Status Summary:';
  RAISE NOTICE '  - 22 Paid ($964,252)';
  RAISE NOTICE '  - 2 Partial ($3,092,250 total, $1,546,125 paid)';
  RAISE NOTICE '  - 4 Outstanding - Current ($16,275)';
  RAISE NOTICE '  - 2 Overdue ($41,229)';
  RAISE NOTICE '';
  RAISE NOTICE '  Accounts Receivable: $1,603,604';
  RAISE NOTICE '  - Current: $1,562,400 (Amanda''s project + Jennifer''s pending)';
  RAISE NOTICE '  - Past Due: $41,229';
  RAISE NOTICE '';
  RAISE NOTICE '  Payment Methods:';
  RAISE NOTICE '  - Credit Card: 9 invoices';
  RAISE NOTICE '  - Check: 10 invoices';
  RAISE NOTICE '  - ACH: 2 invoices';
  RAISE NOTICE '  - Service Plans: 4 invoices ($0)';
  RAISE NOTICE '';

END $$;
