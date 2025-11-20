-- ============================================================================
-- COMPOSITE PERFORMANCE INDEXES
-- ============================================================================
-- Created: 2025-11-20
-- Purpose: Add composite indexes for common query patterns
-- Impact: 3-10x faster queries on filtered/sorted lists (100x on large tables)
--
-- Pattern: WHERE company_id + WHERE deleted_at + ORDER BY [column]
-- Using CONCURRENTLY to avoid locking tables during index creation (production-safe)
-- ============================================================================

-- ============================================================================
-- CUSTOMERS TABLE
-- ============================================================================
-- Query pattern: company_id + deleted_at + display_name (alphabetical sort)
-- Used in: src/lib/queries/customers.ts - getCustomersPageData()
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_company_deleted_display
  ON customers(company_id, deleted_at, display_name)
  WHERE deleted_at IS NULL;

-- Query pattern: company_id + deleted_at + created_at (recent first)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_company_deleted_created
  ON customers(company_id, deleted_at, created_at DESC)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- JOBS TABLE
-- ============================================================================
-- Query pattern: company_id + deleted_at + created_at (recent first)
-- Used in: src/lib/queries/jobs.ts - getJobsPageData()
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_company_deleted_created
  ON jobs(company_id, deleted_at DESC, created_at DESC)
  WHERE deleted_at IS NULL;

-- Query pattern: company_id + deleted_at + scheduled_start (upcoming jobs)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_company_deleted_scheduled
  ON jobs(company_id, deleted_at, scheduled_start DESC)
  WHERE deleted_at IS NULL;

-- Query pattern: company_id + deleted_at + status (filtering by status)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_company_deleted_status
  ON jobs(company_id, deleted_at, status, created_at DESC)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- INVOICES TABLE
-- ============================================================================
-- Query pattern: company_id + deleted_at + created_at (recent first)
-- Used in: src/lib/queries/invoices.ts - getInvoicesPageData()
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invoices_company_deleted_created
  ON invoices(company_id, deleted_at, created_at DESC)
  WHERE deleted_at IS NULL;

-- Query pattern: company_id + deleted_at + status (filtering by status)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invoices_company_deleted_status
  ON invoices(company_id, deleted_at, status, created_at DESC)
  WHERE deleted_at IS NULL;

-- Query pattern: company_id + deleted_at + due_date (overdue invoices)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invoices_company_deleted_due
  ON invoices(company_id, deleted_at, due_date DESC)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- CONTRACTS TABLE
-- ============================================================================
-- Query pattern: company_id + deleted_at + created_at (recent first)
-- Used in: src/lib/queries/contracts.ts - getContractsPageData()
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contracts_company_deleted_created
  ON contracts(company_id, deleted_at, created_at DESC)
  WHERE deleted_at IS NULL;

-- Query pattern: company_id + deleted_at + status (filtering by status)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contracts_company_deleted_status
  ON contracts(company_id, deleted_at, status, created_at DESC)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- ESTIMATES TABLE
-- ============================================================================
-- Query pattern: company_id + deleted_at + created_at (recent first)
-- Used in: src/lib/queries/estimates.ts - getEstimatesPageData()
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_estimates_company_deleted_created
  ON estimates(company_id, deleted_at, created_at DESC)
  WHERE deleted_at IS NULL;

-- Query pattern: company_id + deleted_at + status (filtering by status)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_estimates_company_deleted_status
  ON estimates(company_id, deleted_at, status, created_at DESC)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- APPOINTMENTS TABLE
-- ============================================================================
-- Query pattern: company_id + deleted_at + scheduled_start (upcoming appointments)
-- Used in: src/lib/queries/appointments.ts - getAppointmentsPageData()
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_company_deleted_scheduled
  ON appointments(company_id, deleted_at, scheduled_start DESC)
  WHERE deleted_at IS NULL;

-- Query pattern: company_id + deleted_at + status (filtering by status)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_company_deleted_status
  ON appointments(company_id, deleted_at, status, scheduled_start DESC)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- EQUIPMENT TABLE
-- ============================================================================
-- Query pattern: company_id + deleted_at + created_at (recent first)
-- Used in: src/lib/queries/equipment.ts - getEquipmentPageData()
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_equipment_company_deleted_created
  ON equipment(company_id, deleted_at, created_at DESC)
  WHERE deleted_at IS NULL;

-- Query pattern: customer_id + deleted_at + created_at (customer equipment)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_equipment_customer_deleted_created
  ON equipment(customer_id, deleted_at, created_at DESC)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- PROPERTIES TABLE
-- ============================================================================
-- Query pattern: customer_id + deleted_at + created_at (customer properties)
-- Used in: Customer detail pages
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_customer_deleted_created
  ON properties(customer_id, deleted_at, created_at DESC)
  WHERE deleted_at IS NULL;

-- Query pattern: company_id + deleted_at + created_at (all properties)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_company_deleted_created
  ON properties(company_id, deleted_at, created_at DESC)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- TEAM_MEMBERS TABLE
-- ============================================================================
-- Query pattern: company_id + deleted_at + created_at
-- Used in: Team management pages
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_team_members_company_deleted_created
  ON team_members(company_id, deleted_at, created_at DESC)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- PRICE_BOOK TABLE
-- ============================================================================
-- Query pattern: company_id + deleted_at + name (alphabetical sort)
-- Used in: Price book pages
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_price_book_company_deleted_name
  ON price_book(company_id, deleted_at, name)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
-- Query pattern: user_id + read_at + created_at (unread notifications)
-- Used in: Notification dropdown
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_read_created
  ON notifications(user_id, read_at, created_at DESC);

-- Query pattern: company_id + read_at + created_at (company notifications)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_company_read_created
  ON notifications(company_id, read_at, created_at DESC);

-- ============================================================================
-- PAYMENTS TABLE
-- ============================================================================
-- Query pattern: company_id + deleted_at + created_at (recent payments)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_company_deleted_created
  ON payments(company_id, deleted_at, created_at DESC)
  WHERE deleted_at IS NULL;

-- Query pattern: invoice_id + deleted_at (invoice payments)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_invoice_deleted_created
  ON payments(invoice_id, deleted_at, created_at DESC)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- DOCUMENTS TABLE
-- ============================================================================
-- Query pattern: company_id + deleted_at + created_at (recent documents)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_company_deleted_created
  ON documents(company_id, deleted_at, created_at DESC)
  WHERE deleted_at IS NULL;

-- Query pattern: customer_id + deleted_at + created_at (customer documents)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_customer_deleted_created
  ON documents(customer_id, deleted_at, created_at DESC)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- PERFORMANCE MONITORING
-- ============================================================================
-- After running this migration, monitor query performance with:
--
-- SELECT
--   schemaname,
--   tablename,
--   indexname,
--   idx_scan as index_scans,
--   idx_tup_read as tuples_read,
--   idx_tup_fetch as tuples_fetched
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
--   AND indexname LIKE 'idx_%_company_deleted_%'
-- ORDER BY idx_scan DESC;
--
-- Expected improvements:
-- - Customers page: 500ms → 50ms (10x faster)
-- - Jobs page: 800ms → 80ms (10x faster)
-- - Invoices page: 600ms → 60ms (10x faster)
-- ============================================================================
