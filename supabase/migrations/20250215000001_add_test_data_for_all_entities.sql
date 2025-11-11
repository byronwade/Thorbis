-- Add comprehensive test data for all entities
-- This migration adds sample data for appointments, payments, equipment, maintenance plans, and service agreements

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
      address,
      city,
      state,
      zip_code,
      created_at,
      updated_at
    ) VALUES (
      v_company_id,
      v_customer_id,
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
    price,
    billing_frequency,
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
    360000, -- $3,600.00
    'annually',
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
    120000, -- $1,200.00
    'annually',
    'draft',
    NOW(),
    NOW()
  )
  ON CONFLICT (plan_number) DO NOTHING;

  RAISE NOTICE 'Test data added successfully for all entities';
END $$;





