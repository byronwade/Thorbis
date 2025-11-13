/**
 * Generate 1,000 Invoices with 5-10 Linked Payments (SQL Version)
 * 
 * This SQL script generates test data directly in PostgreSQL:
 * - 1,000 invoices with random amounts ($500-$10,000)
 * - 5-10 payments per invoice (random)
 * - All payments properly linked with correct totals
 * - Fast bulk insertion using PostgreSQL (completes in seconds!)
 * 
 * Usage:
 * 1. Via Supabase MCP Server (recommended):
 *    Use mcp_supabase_execute_sql tool
 * 
 * 2. Via Supabase SQL Editor:
 *    Copy and paste this entire script
 * 
 * 3. Via psql:
 *    psql -h your-db-host -U postgres -d postgres -f scripts/generate-invoices-payments.sql
 * 
 * Generated Data:
 * - ~1,000 invoices (60% paid, 30% partial, 10% sent)
 * - ~7,000 payments (average 7-8 per paid/partial invoice)
 * - ~$5M in total invoices
 * - ~$4M in payments (matching invoice paid_amounts exactly!)
 */

-- ============================================================================
-- Step 1: Create temporary table for customers (for random selection)
-- ============================================================================

CREATE TEMP TABLE temp_customers AS
SELECT id FROM customers LIMIT 100;

-- ============================================================================
-- Step 2: Generate Invoices
-- ============================================================================

WITH invoice_data AS (
  SELECT 
    gen_random_uuid() as id,
    (SELECT id FROM companies LIMIT 1) as company_id,
    (SELECT id FROM temp_customers ORDER BY random() LIMIT 1) as customer_id,
    'INV-' || to_char(CURRENT_DATE, 'YYYYMM') || '-' || lpad(i::text, 4, '0') as invoice_number,
    'Service Invoice #' || i as title,
    'Professional services rendered for project ' || i as description,
    (50000 + floor(random() * 950000))::integer as total_amount,
    floor((50000 + floor(random() * 950000)) / 1.08)::integer as subtotal,
    0 as discount_amount,
    CURRENT_DATE + interval '30 days' as due_date,
    'Net 30 days' as terms,
    CURRENT_TIMESTAMP - (random() * interval '90 days') as created_at,
    CURRENT_TIMESTAMP - (random() * interval '60 days') as sent_at,
    CURRENT_TIMESTAMP - (random() * interval '50 days') as viewed_at,
    CASE 
      WHEN random() < 0.62 THEN 'paid'
      WHEN random() < 0.87 THEN 'partial'
      ELSE 'sent'
    END as status
  FROM generate_series(1, 1000) as i
)
INSERT INTO invoices (
  id, company_id, customer_id, invoice_number, title, description,
  status, subtotal, tax_amount, discount_amount,
  total_amount, paid_amount, balance_amount,
  due_date, terms, line_items, sent_at, viewed_at, paid_at,
  created_at, updated_at
)
SELECT 
  id, company_id, customer_id, invoice_number, title, description,
  status, subtotal,
  (total_amount - subtotal) as tax_amount,
  discount_amount, total_amount,
  CASE 
    WHEN status = 'paid' THEN total_amount
    WHEN status = 'partial' THEN floor(total_amount * (0.5 + random() * 0.4))::integer
    ELSE 0
  END as paid_amount,
  CASE 
    WHEN status = 'paid' THEN 0
    WHEN status = 'partial' THEN total_amount - floor(total_amount * (0.5 + random() * 0.4))::integer
    ELSE total_amount
  END as balance_amount,
  due_date, terms,
  json_build_array(
    json_build_object(
      'description', 'Professional Services',
      'quantity', 1,
      'unit_price', subtotal / 100.0,
      'amount', subtotal / 100.0
    )
  ) as line_items,
  sent_at, viewed_at,
  CASE WHEN status = 'paid' THEN CURRENT_TIMESTAMP - (random() * interval '30 days') ELSE NULL END as paid_at,
  created_at, created_at as updated_at
FROM invoice_data;

-- ============================================================================
-- Step 3: Generate Payments for Each Invoice (with correct amount splitting)
-- ============================================================================

WITH invoice_list AS (
  SELECT 
    i.id as invoice_id,
    i.company_id,
    i.customer_id,
    i.invoice_number,
    i.paid_amount,
    i.created_at,
    (5 + floor(random() * 6))::integer as num_payments
  FROM invoices i
  WHERE i.invoice_number LIKE 'INV-' || to_char(CURRENT_DATE, 'YYYYMM') || '%'
    AND i.status IN ('paid', 'partial')
    AND i.paid_amount > 0
),
payment_splits AS (
  SELECT 
    il.*,
    generate_series(1, il.num_payments) as payment_num
  FROM invoice_list il
),
payment_percentages AS (
  SELECT 
    ps.*,
    CASE 
      WHEN ps.payment_num = ps.num_payments 
      THEN 1.0
      ELSE 0.10 + (random() * 0.25)
    END as pct
  FROM payment_splits ps
),
payment_amounts_cumulative AS (
  SELECT 
    pp.*,
    SUM(pp.pct) OVER (PARTITION BY pp.invoice_id ORDER BY pp.payment_num) as cumulative_pct,
    SUM(pp.pct) OVER (PARTITION BY pp.invoice_id) as total_pct
  FROM payment_percentages pp
),
payment_amounts_final AS (
  SELECT 
    pac.*,
    CASE 
      WHEN pac.payment_num = pac.num_payments 
      THEN pac.paid_amount - COALESCE(
        SUM(floor((pac.pct / pac.total_pct) * pac.paid_amount)) OVER (
          PARTITION BY pac.invoice_id 
          ORDER BY pac.payment_num 
          ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
        ), 
        0
      )
      ELSE floor((pac.pct / pac.total_pct) * pac.paid_amount)
    END as payment_amount
  FROM payment_amounts_cumulative pac
)
INSERT INTO payments (
  id, company_id, customer_id, invoice_id,
  payment_number, reference_number, amount,
  payment_method, payment_type, status,
  card_brand, card_last4,
  processor_name, processor_transaction_id,
  processor_fee, net_amount,
  receipt_number, receipt_emailed,
  processed_at, completed_at, created_at, updated_at
)
SELECT 
  gen_random_uuid() as id,
  paf.company_id,
  paf.customer_id,
  paf.invoice_id,
  'PAY-' || to_char(CURRENT_DATE, 'YYYYMM') || '-' || substring(paf.invoice_number from 13) || '-' || lpad(paf.payment_num::text, 2, '0') as payment_number,
  'REF-' || substring(paf.invoice_number from 13) || '-' || lpad(paf.payment_num::text, 2, '0') as reference_number,
  GREATEST(paf.payment_amount, 100) as amount,
  (ARRAY['cash', 'check', 'credit_card', 'debit_card', 'ach', 'wire', 'venmo', 'paypal'])[floor(random() * 8 + 1)::int] as payment_method,
  'payment' as payment_type,
  (ARRAY['completed', 'completed', 'completed', 'completed', 'processing'])[floor(random() * 5 + 1)::int] as status,
  CASE WHEN random() > 0.6 THEN (ARRAY['visa', 'mastercard', 'amex', 'discover'])[floor(random() * 4 + 1)::int]::text ELSE NULL END as card_brand,
  CASE WHEN random() > 0.6 THEN lpad((floor(random() * 9000 + 1000))::text, 4, '0') ELSE NULL END as card_last4,
  'stripe' as processor_name,
  'txn_' || substring(gen_random_uuid()::text from 1 for 24) as processor_transaction_id,
  floor(GREATEST(paf.payment_amount, 100) * 0.029 + 30)::integer as processor_fee,
  GREATEST(paf.payment_amount, 100) - floor(GREATEST(paf.payment_amount, 100) * 0.029 + 30)::integer as net_amount,
  'RCPT-' || substring(paf.invoice_number from 13) || '-' || lpad(paf.payment_num::text, 2, '0') as receipt_number,
  true as receipt_emailed,
  paf.created_at + (paf.payment_num * interval '3 days') + (random() * interval '2 days') as processed_at,
  paf.created_at + (paf.payment_num * interval '3 days') + (random() * interval '3 days') as completed_at,
  paf.created_at + (paf.payment_num * interval '2 days') + (random() * interval '2 days') as created_at,
  paf.created_at + (paf.payment_num * interval '2 days') + (random() * interval '2 days') as updated_at
FROM payment_amounts_final paf
WHERE paf.payment_amount > 0
ORDER BY paf.invoice_id, paf.payment_num;

-- ============================================================================
-- Step 4: Clean up
-- ============================================================================

DROP TABLE IF EXISTS temp_customers;

-- ============================================================================
-- Step 5: Show Summary Statistics
-- ============================================================================

WITH stats AS (
  SELECT 'Invoices Created' as metric, COUNT(*)::text as value, 1 as sort_order
  FROM invoices
  WHERE invoice_number LIKE 'INV-' || to_char(CURRENT_DATE, 'YYYYMM') || '%'
  
  UNION ALL
  
  SELECT 'Paid Invoices' as metric, COUNT(*)::text as value, 2 as sort_order
  FROM invoices
  WHERE invoice_number LIKE 'INV-' || to_char(CURRENT_DATE, 'YYYYMM') || '%' AND status = 'paid'
  
  UNION ALL
  
  SELECT 'Partial Invoices' as metric, COUNT(*)::text as value, 3 as sort_order
  FROM invoices
  WHERE invoice_number LIKE 'INV-' || to_char(CURRENT_DATE, 'YYYYMM') || '%' AND status = 'partial'
  
  UNION ALL
  
  SELECT 'Sent Invoices' as metric, COUNT(*)::text as value, 4 as sort_order
  FROM invoices
  WHERE invoice_number LIKE 'INV-' || to_char(CURRENT_DATE, 'YYYYMM') || '%' AND status = 'sent'
  
  UNION ALL
  
  SELECT 'Payments Created' as metric, COUNT(*)::text as value, 5 as sort_order
  FROM payments
  WHERE payment_number LIKE 'PAY-' || to_char(CURRENT_DATE, 'YYYYMM') || '%'
  
  UNION ALL
  
  SELECT 'Total Invoice Amount' as metric, '$' || to_char(SUM(total_amount) / 100.0, 'FM999,999,999.00') as value, 6 as sort_order
  FROM invoices
  WHERE invoice_number LIKE 'INV-' || to_char(CURRENT_DATE, 'YYYYMM') || '%'
  
  UNION ALL
  
  SELECT 'Total Paid Amount' as metric, '$' || to_char(SUM(paid_amount) / 100.0, 'FM999,999,999.00') as value, 7 as sort_order
  FROM invoices
  WHERE invoice_number LIKE 'INV-' || to_char(CURRENT_DATE, 'YYYYMM') || '%'
  
  UNION ALL
  
  SELECT 'Total Payment Amount' as metric, '$' || to_char(SUM(amount) / 100.0, 'FM999,999,999.00') as value, 8 as sort_order
  FROM payments
  WHERE payment_number LIKE 'PAY-' || to_char(CURRENT_DATE, 'YYYYMM') || '%'
  
  UNION ALL
  
  SELECT 'Avg Payments per Invoice' as metric,
    to_char(
      CASE 
        WHEN COUNT(DISTINCT invoice_id) > 0 
        THEN COUNT(*)::numeric / COUNT(DISTINCT invoice_id)
        ELSE 0 
      END,
      'FM999.9'
    ) as value,
    9 as sort_order
  FROM payments
  WHERE payment_number LIKE 'PAY-' || to_char(CURRENT_DATE, 'YYYYMM') || '%'
)
SELECT 
  metric as "📊 Metric",
  value as "Value"
FROM stats 
ORDER BY sort_order;

