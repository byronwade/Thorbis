-- Add test contracts data for the first company
-- This migration adds sample contracts linked to existing estimates/invoices

DO $$
DECLARE
  v_company_id UUID;
  v_estimate_id UUID;
  v_invoice_id UUID;
  v_customer_id UUID;
BEGIN
  -- Get the first company
  SELECT id INTO v_company_id FROM companies LIMIT 1;
  
  IF v_company_id IS NULL THEN
    RAISE NOTICE 'No companies found, skipping test data';
    RETURN;
  END IF;

  -- Get first estimate
  SELECT id, customer_id INTO v_estimate_id, v_customer_id 
  FROM estimates 
  WHERE company_id = v_company_id 
  AND deleted_at IS NULL 
  LIMIT 1;

  -- Get first invoice if no estimate
  IF v_estimate_id IS NULL THEN
    SELECT id, customer_id INTO v_invoice_id, v_customer_id 
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





