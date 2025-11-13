-- Add test contracts data for the first company
-- This migration adds sample contracts linked to existing estimates/invoices

DO $$
DECLARE
  v_company_id UUID;
  v_estimate_id UUID;
  v_invoice_id UUID;
BEGIN
  -- Get the first company
  SELECT id INTO v_company_id FROM companies LIMIT 1;
  
  IF v_company_id IS NULL THEN
    RAISE NOTICE 'No companies found, skipping test data';
    RETURN;
  END IF;

  -- Get first estimate
  SELECT id INTO v_estimate_id 
  FROM estimates 
  WHERE company_id = v_company_id 
  AND deleted_at IS NULL 
  LIMIT 1;

  -- Get first invoice if no estimate
  IF v_estimate_id IS NULL THEN
    SELECT id INTO v_invoice_id 
    FROM invoices 
    WHERE company_id = v_company_id 
    AND deleted_at IS NULL 
    LIMIT 1;
  END IF;

  -- Only proceed if we have at least an estimate or invoice
  IF v_estimate_id IS NULL AND v_invoice_id IS NULL THEN
    RAISE NOTICE 'No estimates or invoices found, skipping test contracts';
    RETURN;
  END IF;

  -- Insert test contracts
  INSERT INTO contracts (
    company_id,
    contract_number,
    title,
    description,
    content,
    contract_type,
    status,
    estimate_id,
    invoice_id,
    valid_from,
    expires_at,
    signer_name,
    signer_email,
    signer_title,
    signer_company,
    terms,
    notes,
    sent_at,
    viewed_at,
    signed_at,
    signer_ip_address,
    created_at,
    updated_at
  ) VALUES
  -- Signed contract
  (
    v_company_id,
    'CNT-2025-001',
    'HVAC Service Agreement',
    'Annual service and maintenance agreement for HVAC systems',
    'This Service Agreement is entered into on January 1, 2025 between Thorbis Service Company and Customer.

SERVICES TO BE PROVIDED:

1. Quarterly HVAC system inspections and maintenance
2. Priority emergency service response
3. Filter replacements and cleaning
4. System performance optimization
5. Annual efficiency reports

PAYMENT TERMS:

- Annual fee: $2,400 (payable quarterly at $600)
- Emergency service calls included (2 per year)
- Additional service calls billed at standard rates

DURATION:

- This agreement is valid from January 1, 2025 to December 31, 2025
- Automatically renews unless cancelled 30 days before end date

TERMINATION:

- Either party may terminate with 30 days written notice
- Full refund for unused quarters if cancelled by provider
- Pro-rated refund if cancelled by customer

By signing below, both parties agree to these terms and conditions.',
    'service',
    'signed',
    v_estimate_id,
    v_invoice_id,
    '2025-01-01'::date,
    '2026-01-01'::date,
    'John Smith',
    'john@example.com',
    'Facilities Manager',
    'Customer Company',
    'Standard terms and conditions apply as per company policy.',
    'Customer requested quarterly reminders for scheduled maintenance.',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day',
    '192.168.1.1',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '1 day'
  ),
  -- Draft contract
  (
    v_company_id,
    'CNT-2025-002',
    'Plumbing Maintenance Contract',
    'Monthly plumbing maintenance and inspection service',
    'This Maintenance Contract covers monthly plumbing inspections and preventive maintenance services.

SERVICES INCLUDED:
- Monthly inspection of all plumbing fixtures
- Drain cleaning and maintenance
- Leak detection and repair
- Water heater service
- Emergency response within 2 hours

TERMS:
- Monthly fee: $150
- Contract duration: 12 months
- Auto-renewal unless cancelled 30 days prior',
    'maintenance',
    'draft',
    v_estimate_id,
    v_invoice_id,
    NULL,
    NULL,
    NULL,
    'customer@example.com',
    NULL,
    NULL,
    NULL,
    'Draft contract pending customer review.',
    NULL,
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  -- Sent contract
  (
    v_company_id,
    'CNT-2025-003',
    'Electrical Service Agreement',
    'Annual electrical system maintenance and safety inspections',
    'This Electrical Service Agreement provides comprehensive electrical system maintenance and safety inspections.

SERVICES:
- Annual electrical safety inspection
- Panel maintenance and upgrades
- GFCI and AFCI testing
- Code compliance review
- Priority emergency service

PAYMENT:
- Annual fee: $1,800
- Payment due upon signing
- 10% discount for multi-year agreements',
    'service',
    'sent',
    v_estimate_id,
    v_invoice_id,
    '2025-02-01'::date,
    '2026-02-01'::date,
    'Jane Doe',
    'jane@example.com',
    'Operations Manager',
    'Customer Company',
    'All work performed to local electrical code standards.',
    'Customer prefers morning appointments.',
    NOW() - INTERVAL '1 day',
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 day'
  )
  ON CONFLICT (contract_number) DO NOTHING;

  RAISE NOTICE 'Test contracts added successfully';
END $$;

-- Add comprehensive test data for all entities
DO $$
DECLARE
  v_company_id UUID;
  v_user_id UUID;
  v_customer_id UUID;
  v_property_id UUID;
  v_job_id UUID;
  v_estimate_id UUID;
  v_invoice_id UUID;
BEGIN
  -- Get the first company
  SELECT id INTO v_company_id FROM companies LIMIT 1;
  
  IF v_company_id IS NULL THEN
    RAISE NOTICE 'No companies found, skipping test data';
    RETURN;
  END IF;

  -- Get first user
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  -- Get or create a test customer
  SELECT id INTO v_customer_id FROM customers WHERE company_id = v_company_id LIMIT 1;
  
  IF v_customer_id IS NULL THEN
    INSERT INTO customers (
      company_id,
      first_name,
      last_name,
      display_name,
      email,
      phone,
      created_at,
      updated_at
    ) VALUES (
      v_company_id,
      'John',
      'Doe',
      'John Doe',
      'john.doe@example.com',
      '555-0100',
      NOW(),
      NOW()
    ) RETURNING id INTO v_customer_id;
  END IF;

  -- Get or create a test property
  SELECT id INTO v_property_id FROM properties WHERE customer_id = v_customer_id LIMIT 1;
  
  IF v_property_id IS NULL THEN
    INSERT INTO properties (
      company_id,
      customer_id,
      name,
      address,
      city,
      state,
      zip_code,
      created_at,
      updated_at
    ) VALUES (
      v_company_id,
      v_customer_id,
      'Main Property',
      '123 Main Street',
      'Springfield',
      'IL',
      '62701',
      NOW(),
      NOW()
    ) RETURNING id INTO v_property_id;
  END IF;

  -- Get first job
  SELECT id INTO v_job_id FROM jobs WHERE company_id = v_company_id LIMIT 1;

  -- Get first estimate
  SELECT id INTO v_estimate_id FROM estimates WHERE company_id = v_company_id LIMIT 1;

  -- Get first invoice
  SELECT id INTO v_invoice_id FROM invoices WHERE company_id = v_company_id LIMIT 1;

  -- Add test appointments (schedules with type='appointment')
  INSERT INTO schedules (
    company_id,
    customer_id,
    property_id,
    job_id,
    type,
    title,
    description,
    start_time,
    end_time,
    duration,
    status,
    assigned_to,
    created_at,
    updated_at
  ) VALUES
  (
    v_company_id,
    v_customer_id,
    v_property_id,
    v_job_id,
    'appointment',
    'HVAC System Inspection',
    'Annual HVAC system inspection and maintenance',
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '2 days' + INTERVAL '2 hours',
    120, -- 2 hours = 120 minutes
    'scheduled',
    v_user_id,
    NOW(),
    NOW()
  ),
  (
    v_company_id,
    v_customer_id,
    v_property_id,
    v_job_id,
    'appointment',
    'Plumbing Repair',
    'Fix leaking faucet in kitchen',
    NOW() + INTERVAL '5 days',
    NOW() + INTERVAL '5 days' + INTERVAL '1 hour',
    60, -- 1 hour = 60 minutes
    'confirmed',
    v_user_id,
    NOW(),
    NOW()
  ),
  (
    v_company_id,
    v_customer_id,
    v_property_id,
    v_job_id,
    'appointment',
    'Electrical Safety Check',
    'Annual electrical safety inspection',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days' + INTERVAL '3 hours',
    180, -- 3 hours = 180 minutes
    'scheduled',
    v_user_id,
    NOW(),
    NOW()
  )
  ON CONFLICT DO NOTHING;

  -- Add test payments
  INSERT INTO payments (
    company_id,
    customer_id,
    invoice_id,
    job_id,
    payment_number,
    amount,
    payment_method,
    status,
    processed_at,
    created_at,
    updated_at
  ) VALUES
  (
    v_company_id,
    v_customer_id,
    v_invoice_id,
    v_job_id,
    'PAY-2025-001',
    240000, -- $2,400.00
    'credit_card',
    'completed',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    v_company_id,
    v_customer_id,
    v_invoice_id,
    v_job_id,
    'PAY-2025-002',
    150000, -- $1,500.00
    'ach',
    'processing',
    NULL,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ),
  (
    v_company_id,
    v_customer_id,
    v_invoice_id,
    v_job_id,
    'PAY-2025-003',
    85000, -- $850.00
    'check',
    'pending',
    NULL,
    NOW(),
    NOW()
  )
  ON CONFLICT (payment_number) DO NOTHING;

  -- Add test equipment
  INSERT INTO equipment (
    company_id,
    customer_id,
    property_id,
    equipment_number,
    name,
    type,
    manufacturer,
    model,
    serial_number,
    install_date,
    status,
    condition,
    created_at,
    updated_at
  ) VALUES
  (
    v_company_id,
    v_customer_id,
    v_property_id,
    'EQ-2025-001',
    'HVAC Unit - Main Floor',
    'hvac',
    'Carrier',
    'Infinity 19VS',
    'SN123456789',
    NOW() - INTERVAL '2 years',
    'active',
    'good',
    NOW() - INTERVAL '2 years',
    NOW()
  ),
  (
    v_company_id,
    v_customer_id,
    v_property_id,
    'EQ-2025-002',
    'Water Heater',
    'water_heater',
    'Rheem',
    'Performance Plus 50',
    'SN987654321',
    NOW() - INTERVAL '1 year',
    'active',
    'excellent',
    NOW() - INTERVAL '1 year',
    NOW()
  ),
  (
    v_company_id,
    v_customer_id,
    v_property_id,
    'EQ-2025-003',
    'Electrical Panel',
    'electrical',
    'Square D',
    'QO Load Center',
    'SN456789123',
    NOW() - INTERVAL '5 years',
    'active',
    'fair',
    NOW() - INTERVAL '5 years',
    NOW()
  )
  ON CONFLICT (equipment_number) DO NOTHING;

  -- Add test maintenance plans (service_plans with type='preventive')
  INSERT INTO service_plans (
    company_id,
    customer_id,
    property_id,
    plan_number,
    name,
    description,
    type,
    frequency,
    visits_per_term,
    start_date,
    end_date,
    next_service_due,
    price,
    billing_frequency,
    included_services,
    status,
    created_at,
    updated_at
  ) VALUES
  (
    v_company_id,
    v_customer_id,
    v_property_id,
    'MP-2025-001',
    'HVAC Annual Maintenance Plan',
    'Comprehensive annual HVAC maintenance and inspection',
    'preventive',
    'quarterly',
    4,
    NOW() - INTERVAL '3 months',
    NOW() + INTERVAL '9 months',
    NOW() + INTERVAL '1 month',
    240000, -- $2,400.00
    'annually',
    '["HVAC Inspection", "Filter Replacement", "System Cleaning", "Performance Check"]'::jsonb,
    'active',
    NOW() - INTERVAL '3 months',
    NOW()
  ),
  (
    v_company_id,
    v_customer_id,
    v_property_id,
    'MP-2025-002',
    'Plumbing Maintenance Plan',
    'Monthly plumbing inspection and maintenance',
    'preventive',
    'monthly',
    12,
    NOW() - INTERVAL '2 months',
    NOW() + INTERVAL '10 months',
    NOW() + INTERVAL '2 weeks',
    180000, -- $1,800.00
    'annually',
    '["Plumbing Inspection", "Drain Cleaning", "Leak Detection", "Fixture Maintenance"]'::jsonb,
    'active',
    NOW() - INTERVAL '2 months',
    NOW()
  )
  ON CONFLICT (plan_number) DO NOTHING;

  -- Add test service agreements (service_plans with type='contract')
  INSERT INTO service_plans (
    company_id,
    customer_id,
    property_id,
    plan_number,
    name,
    description,
    type,
    frequency,
    visits_per_term,
    start_date,
    end_date,
    next_service_due,
    price,
    billing_frequency,
    included_services,
    status,
    created_at,
    updated_at
  ) VALUES
  (
    v_company_id,
    v_customer_id,
    v_property_id,
    'SA-2025-001',
    'Comprehensive Service Agreement',
    'Full-service maintenance agreement covering all systems',
    'contract',
    'monthly',
    12,
    NOW() - INTERVAL '1 month',
    NOW() + INTERVAL '11 months',
    NOW() + INTERVAL '1 month',
    360000, -- $3,600.00
    'annually',
    '["HVAC Maintenance", "Plumbing Maintenance", "Electrical Inspection", "General Repairs"]'::jsonb,
    'active',
    NOW() - INTERVAL '1 month',
    NOW()
  ),
  (
    v_company_id,
    v_customer_id,
    v_property_id,
    'SA-2025-002',
    'Emergency Service Agreement',
    'Priority emergency response service agreement',
    'contract',
    'annually',
    1,
    NOW(),
    NOW() + INTERVAL '1 year',
    NOW() + INTERVAL '1 year',
    120000, -- $1,200.00
    'annually',
    '["Emergency Response", "24/7 Support", "Priority Scheduling"]'::jsonb,
    'draft',
    NOW(),
    NOW()
  )
  ON CONFLICT (plan_number) DO NOTHING;

  RAISE NOTICE 'Test data added successfully for all entities';
END $$;

