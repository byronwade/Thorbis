-- Setup Byron Wade as test customer for bulk email testing
-- Run this in Supabase SQL Editor

-- Step 1: Find or create Byron Wade customer
DO $$
DECLARE
  v_customer_id UUID;
  v_company_id UUID;
BEGIN
  -- Get the first company (you can change this to your specific company)
  SELECT id INTO v_company_id FROM companies LIMIT 1;
  
  -- Check if Byron Wade customer exists
  SELECT id INTO v_customer_id 
  FROM customers 
  WHERE email = 'bcw1995@gmail.com';
  
  -- If doesn't exist, create it
  IF v_customer_id IS NULL THEN
    INSERT INTO customers (
      company_id,
      first_name,
      last_name,
      email,
      phone,
      status
    ) VALUES (
      v_company_id,
      'Byron',
      'Wade',
      'bcw1995@gmail.com',
      '+1-555-0123',
      'active'
    )
    RETURNING id INTO v_customer_id;
    
    RAISE NOTICE 'Created new customer Byron Wade with ID: %', v_customer_id;
  ELSE
    -- Update existing customer to ensure email is correct
    UPDATE customers 
    SET 
      email = 'bcw1995@gmail.com',
      first_name = 'Byron',
      last_name = 'Wade',
      status = 'active'
    WHERE id = v_customer_id;
    
    RAISE NOTICE 'Updated existing customer Byron Wade with ID: %', v_customer_id;
  END IF;
  
  -- Step 2: Link 10 draft/pending invoices to this customer
  UPDATE invoices
  SET customer_id = v_customer_id
  WHERE customer_id IS NULL
    AND status IN ('draft', 'pending')
    AND deleted_at IS NULL
    AND archived_at IS NULL
  LIMIT 10;
  
  -- Get count of invoices linked
  RAISE NOTICE 'Linked invoices to Byron Wade. Total invoices for this customer: %', 
    (SELECT COUNT(*) FROM invoices WHERE customer_id = v_customer_id);
    
  -- Show the invoices
  RAISE NOTICE 'Invoice details:';
  PERFORM invoice_number, status, total_amount, created_at
  FROM invoices 
  WHERE customer_id = v_customer_id
  ORDER BY created_at DESC
  LIMIT 10;
  
END $$;

-- Verify the setup
SELECT 
  c.id,
  c.first_name,
  c.last_name,
  c.email,
  c.company_name,
  c.status,
  COUNT(i.id) as invoice_count
FROM customers c
LEFT JOIN invoices i ON i.customer_id = c.id AND i.deleted_at IS NULL
WHERE c.email = 'bcw1995@gmail.com'
GROUP BY c.id, c.first_name, c.last_name, c.email, c.company_name, c.status;

-- Show invoices for Byron Wade
SELECT 
  invoice_number,
  status,
  total_amount / 100.0 as amount_dollars,
  created_at,
  due_date
FROM invoices
WHERE customer_id = (SELECT id FROM customers WHERE email = 'bcw1995@gmail.com')
  AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 10;

