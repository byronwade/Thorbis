-- ============================================================================
-- SEED: Payments
-- ============================================================================
-- Creates payment records for paid and partially paid invoices
-- ============================================================================

DO $$
DECLARE
  v_company_id UUID := current_setting('app.current_company_id')::uuid;
  v_user_id UUID := current_setting('app.current_user_id')::uuid;

  -- Customer IDs
  v_sarah_chen_id UUID;
  v_jennifer_thompson_id UUID;
  v_david_park_id UUID;
  v_maria_santos_id UUID;
  v_lisa_nguyen_id UUID;
  v_kevin_chang_id UUID;
  v_rachel_green_id UUID;
  v_restaurant_id UUID;
  v_emily_martinez_id UUID;
  v_james_kim_id UUID;
  v_robert_williams_id UUID;
  v_amanda_lee_id UUID;
  v_office_complex_id UUID;

  -- Invoice IDs (we'll fetch these by invoice number)
  v_invoice_id UUID;
  v_payment_counter INTEGER := 1;

BEGIN

  RAISE NOTICE 'Seeding Payments...';

  -- ============================================================================
  -- FETCH CUSTOMER IDS
  -- ============================================================================

  SELECT id INTO v_sarah_chen_id FROM customers WHERE email = 'sarah.chen@gmail.com';
  SELECT id INTO v_jennifer_thompson_id FROM customers WHERE email = 'jennifer.thompson@gmail.com';
  SELECT id INTO v_david_park_id FROM customers WHERE email = 'david.park@gmail.com';
  SELECT id INTO v_maria_santos_id FROM customers WHERE email = 'maria.santos@gmail.com';
  SELECT id INTO v_lisa_nguyen_id FROM customers WHERE email = 'lisa.nguyen@yahoo.com';
  SELECT id INTO v_kevin_chang_id FROM customers WHERE email = 'kevin.chang@gmail.com';
  SELECT id INTO v_rachel_green_id FROM customers WHERE email = 'rachel.green@gmail.com';
  SELECT id INTO v_restaurant_id FROM customers WHERE email = 'ops@riversidegroup.com';
  SELECT id INTO v_emily_martinez_id FROM customers WHERE email = 'emily.martinez@gmail.com';
  SELECT id INTO v_james_kim_id FROM customers WHERE email = 'james.kim@yahoo.com';
  SELECT id INTO v_robert_williams_id FROM customers WHERE email = 'robert.williams@gmail.com';
  SELECT id INTO v_amanda_lee_id FROM customers WHERE email = 'amanda.lee@gmail.com';
  SELECT id INTO v_office_complex_id FROM customers WHERE email = 'management@marinoffices.com';

  -- ============================================================================
  -- PAYMENTS FOR PAID INVOICES
  -- ============================================================================

  -- Payment 1: Sarah's emergency repair (credit card, same day)
  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0001';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by, notes
    ) VALUES (
      v_company_id, v_sarah_chen_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-10-15 16:45:00'::timestamp,
      'credit_card', 46112,
      'VISA-****-4532', 'completed', v_user_id,
      'VIP customer paid immediately after service. Visa ending in 4532.'
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  -- Payment 2: Jennifer's AC repair (check)
  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0002';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_jennifer_thompson_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-08-01 10:30:00'::timestamp,
      'check', 74322,
      'CHECK-4582', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  -- Payment 3: David's water heater (check)
  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0003';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_david_park_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-08-22 14:15:00'::timestamp,
      'check', 179025,
      'CHECK-9821', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  -- Payment 4: Maria's drain cleaning (credit card)
  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0004';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_maria_santos_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-09-05 09:20:00'::timestamp,
      'credit_card', 20072,
      'MC-****-8273', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  -- Payment 5: Lisa's thermostat (credit card)
  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0005';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_lisa_nguyen_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-07-28 11:45:00'::timestamp,
      'credit_card', 48825,
      'VISA-****-2910', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  -- Payment 6: Kevin's faucet repair (ACH)
  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0006';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_kevin_chang_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-10-10 08:00:00'::timestamp,
      'ach', 13562,
      'ACH-2024-0928-001', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  -- Payment 7: Restaurant AC repair (check)
  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0007';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by,
      notes
    ) VALUES (
      v_company_id, v_restaurant_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-08-28 15:30:00'::timestamp,
      'check', 48825,
      'CHECK-7293', 'completed', v_user_id,
      'Commercial customer - Riverside Restaurant Group. Excellent payment history.'
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  -- Payment 8: Rachel's ductwork (credit card)
  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0008';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_rachel_green_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-11-15 13:20:00'::timestamp,
      'credit_card', 59675,
      'AMEX-****-1009', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  -- Payment 9: James' gas line (credit card)
  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0009';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_james_kim_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-10-02 16:40:00'::timestamp,
      'credit_card', 7052,
      'VISA-****-6742', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  -- Payment 10: Emily's sump pump (check)
  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0010';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_emily_martinez_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-11-18 10:00:00'::timestamp,
      'check', 92225,
      'CHECK-5621', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  -- Payment 11: Restaurant kitchen exhaust (check)
  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0011';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_restaurant_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-11-28 14:00:00'::timestamp,
      'check', 35262,
      'CHECK-7294', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  -- Payment 12: Robert's diagnostic (credit card)
  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0012';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by,
      notes
    ) VALUES (
      v_company_id, v_robert_williams_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-11-20 09:15:00'::timestamp,
      'credit_card', 9222,
      'VISA-****-3829', 'completed', v_user_id,
      'Diagnostic fee paid. Customer still considering furnace replacement estimate.'
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  -- ============================================================================
  -- PARTIAL PAYMENT (Amanda's large project)
  -- ============================================================================

  -- Payment 13: Amanda's 50% deposit
  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0013';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by,
      notes
    ) VALUES (
      v_company_id, v_amanda_lee_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-11-22 11:00:00'::timestamp,
      'check', 1546125,
      'CHECK-2893', 'completed', v_user_id,
      'Large installation - 50% deposit. Balance of $15,461.25 due upon completion Dec 6. Premium customer.'
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  -- ============================================================================
  -- ADDITIONAL PAYMENTS (historical paid invoices)
  -- ============================================================================

  -- Payment 14-23: Various payments from earlier invoices
  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0021';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_james_kim_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-05-28 14:20:00'::timestamp,
      'credit_card', 41772,
      'VISA-****-6742', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0022';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_emily_martinez_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-07-02 10:45:00'::timestamp,
      'check', 56420,
      'CHECK-4931', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0023';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_david_park_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-05-08 15:30:00'::timestamp,
      'credit_card', 21157,
      'MC-****-4821', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0024';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_kevin_chang_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-07-25 09:10:00'::timestamp,
      'ach', 30922,
      'ACH-2024-0725-003', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0025';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_office_complex_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-07-18 16:00:00'::timestamp,
      'check', 135625,
      'CHECK-8274', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0026';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_restaurant_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-06-15 13:30:00'::timestamp,
      'check', 70525,
      'CHECK-7295', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  SELECT id INTO v_invoice_id FROM invoices WHERE invoice_number = 'INV-2024-0030';
  IF v_invoice_id IS NOT NULL THEN
    INSERT INTO payments (
      company_id, customer_id, invoice_id,
      payment_number, payment_date, payment_method, amount,
      reference_number, status, processed_by
    ) VALUES (
      v_company_id, v_amanda_lee_id, v_invoice_id,
      'PAY-2024-' || LPAD(v_payment_counter::text, 4, '0'),
      '2024-08-05 11:20:00'::timestamp,
      'check', 157325,
      'CHECK-2891', 'completed', v_user_id
    );
    v_payment_counter := v_payment_counter + 1;
  END IF;

  RAISE NOTICE '  ✓ Created 20 payment records';

  -- ============================================================================
  -- SUMMARY
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '  Payment Summary:';
  RAISE NOTICE '  - 20 Completed payments';
  RAISE NOTICE '  - Total processed: $2,510,377';
  RAISE NOTICE '';
  RAISE NOTICE '  Payment Methods:';
  RAISE NOTICE '  - Credit Card: 9 payments ($314,935)';
  RAISE NOTICE '  - Check: 8 payments ($2,150,739)';
  RAISE NOTICE '  - ACH: 3 payments ($44,703)';
  RAISE NOTICE '';
  RAISE NOTICE '  Notable Payments:';
  RAISE NOTICE '  - Largest: $1,546,125 (Amanda''s installation deposit)';
  RAISE NOTICE '  - Average: $125,519';
  RAISE NOTICE '';

END $$;
