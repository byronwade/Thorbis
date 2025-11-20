# Supabase Index Advisor Guide

**Using Index Advisor to optimize database query performance**

Last Updated: 2025-11-20

---

## Overview

The Index Advisor extension analyzes SQL queries and recommends indexes that could improve performance. It uses hypothetical indexes (via `hypopg`) to test index effectiveness without actually creating them.

**Enabled Extensions:**
- `index_advisor` - Query analysis and index recommendations
- `hypopg` - Hypothetical index testing

---

## Basic Usage

### Analyze a Single Query

```sql
SELECT * FROM index_advisor('
  SELECT * FROM customers
  WHERE company_id = $1
  AND status = $2
  ORDER BY created_at DESC
');
```

**Output Example:**
```
startup_cost_before | startup_cost_after | index_statements
-------------------+--------------------+------------------
1000.00            | 50.00              | CREATE INDEX idx_customers_company_status_created ON customers(company_id, status, created_at DESC);
```

**Interpretation:**
- `startup_cost_before`: Current query cost (1000.00)
- `startup_cost_after`: Projected cost with recommended index (50.00)
- `index_statements`: SQL to create the recommended index
- **Improvement**: 20x faster with recommended index

---

## Analyzing Slow Queries

### Find Slow Queries with pg_stat_statements

```sql
-- Get top 10 slowest queries
SELECT
  query,
  calls,
  mean_exec_time::numeric(10,2) as avg_ms,
  total_exec_time::numeric(10,2) as total_ms,
  (index_advisor(query)).*
FROM pg_stat_statements
WHERE mean_exec_time > 1000  -- Queries taking > 1 second
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**Output:**
```
query                          | calls | avg_ms  | total_ms | startup_cost_before | startup_cost_after | index_statements
-------------------------------|-------|---------|----------|---------------------|--------------------|-----------------
SELECT * FROM jobs WHERE...   | 1523  | 2341.45 | 3565348  | 5000.00             | 120.00             | CREATE INDEX ...
SELECT * FROM invoices WHERE..| 891   | 1876.23 | 1672521  | 3200.00             | 95.00              | CREATE INDEX ...
```

---

## Testing Hypothetical Indexes

Before creating an index, test its effectiveness using `hypopg`:

### Step 1: Create Hypothetical Index

```sql
SELECT * FROM hypopg_create_index(
  'CREATE INDEX ON customers(company_id, status, created_at DESC)'
);
```

**Output:**
```
indexrelid | indexname
-----------+------------------
123456     | <123456>btree_customers
```

### Step 2: Run EXPLAIN to See Impact

```sql
EXPLAIN ANALYZE
SELECT * FROM customers
WHERE company_id = 'xxx'
  AND status = 'active'
ORDER BY created_at DESC
LIMIT 50;
```

**Look for:**
```
Index Scan using <123456>btree_customers on customers  (cost=0.42..8.44 rows=1 width=123)
```

If the hypothetical index appears in the query plan, it will be used!

### Step 3: Clean Up Hypothetical Indexes

```sql
-- Drop all hypothetical indexes
SELECT * FROM hypopg_reset();
```

---

## Batch Analysis for All Major Tables

### Analyze All Customer Queries

```sql
WITH customer_queries AS (
  SELECT
    'customers' as table_name,
    'list_page' as query_name,
    'SELECT * FROM customers WHERE company_id = $1 ORDER BY created_at DESC LIMIT 50' as query
  UNION ALL
  SELECT
    'customers',
    'search',
    'SELECT * FROM customers WHERE company_id = $1 AND (display_name ILIKE $2 OR email ILIKE $2) LIMIT 50'
  UNION ALL
  SELECT
    'customers',
    'filter_status',
    'SELECT * FROM customers WHERE company_id = $1 AND status = $2 ORDER BY created_at DESC LIMIT 50'
)
SELECT
  table_name,
  query_name,
  (index_advisor(query)).*
FROM customer_queries;
```

### Analyze All Job Queries

```sql
WITH job_queries AS (
  SELECT
    'jobs' as table_name,
    'list_page' as query_name,
    'SELECT * FROM jobs WHERE company_id = $1 ORDER BY scheduled_start DESC LIMIT 50' as query
  UNION ALL
  SELECT
    'jobs',
    'by_status',
    'SELECT * FROM jobs WHERE company_id = $1 AND status = $2 ORDER BY scheduled_start DESC LIMIT 50'
  UNION ALL
  SELECT
    'jobs',
    'by_customer',
    'SELECT * FROM jobs WHERE customer_id = $1 AND deleted_at IS NULL ORDER BY scheduled_start DESC'
)
SELECT
  table_name,
  query_name,
  (index_advisor(query)).*
FROM job_queries;
```

---

## Common Query Patterns to Analyze

### 1. List Pages with Pagination

```sql
SELECT * FROM index_advisor('
  SELECT * FROM invoices
  WHERE company_id = $1
    AND deleted_at IS NULL
  ORDER BY created_at DESC
  LIMIT 50 OFFSET 0
');
```

**Expected Recommendation:**
```sql
CREATE INDEX idx_invoices_company_created
ON invoices(company_id, created_at DESC)
WHERE deleted_at IS NULL;
```

### 2. Filtered Lists

```sql
SELECT * FROM index_advisor('
  SELECT * FROM jobs
  WHERE company_id = $1
    AND status = $2
    AND deleted_at IS NULL
  ORDER BY scheduled_start DESC
  LIMIT 50
');
```

**Expected Recommendation:**
```sql
CREATE INDEX idx_jobs_company_status_scheduled
ON jobs(company_id, status, scheduled_start DESC)
WHERE deleted_at IS NULL;
```

### 3. Search Queries

```sql
SELECT * FROM index_advisor('
  SELECT * FROM customers
  WHERE company_id = $1
    AND (display_name ILIKE $2 OR email ILIKE $2)
    AND deleted_at IS NULL
  LIMIT 50
');
```

**Expected Recommendation:**
```sql
CREATE INDEX idx_customers_company_gin_search
ON customers USING GIN(company_id, (display_name || email) gin_trgm_ops)
WHERE deleted_at IS NULL;
```

### 4. Join Queries

```sql
SELECT * FROM index_advisor('
  SELECT j.*, c.display_name
  FROM jobs j
  JOIN customers c ON c.id = j.customer_id
  WHERE j.company_id = $1
    AND j.status = $2
  ORDER BY j.scheduled_start DESC
  LIMIT 50
');
```

---

## Integration with Existing Optimizations

### Verify Composite Indexes from Phase 1.2

```sql
-- Check if our composite indexes are being used
SELECT * FROM index_advisor('
  SELECT * FROM customers
  WHERE company_id = $1
    AND deleted_at IS NULL
  ORDER BY created_at DESC
  LIMIT 50
');
```

**Expected Result:**
- `startup_cost_before`: High (~1000)
- `startup_cost_after`: Low (~50)
- `index_statements`: Empty or "Index already exists"

If the index advisor recommends a new index, our existing composite indexes might not be optimal!

### Verify RLS Function Optimization from Phase 1.3

```sql
-- Test query with RLS policy
SELECT * FROM index_advisor('
  SELECT * FROM customers
  WHERE company_id = ANY(get_user_company_ids())
    AND deleted_at IS NULL
  ORDER BY created_at DESC
  LIMIT 50
');
```

Should use our `idx_customers_company_created` index.

---

## Performance Metrics

### Before Index Advisor

- Manual index creation based on experience
- Trial-and-error approach
- Potential for missing critical indexes
- Risk of creating unused indexes

### After Index Advisor

- Data-driven index recommendations
- Test indexes before creating (hypopg)
- Identify composite index opportunities
- Validate existing optimization work

**Performance Impact:**
- Helps maintain 50-100x query improvements
- Identifies missing indexes after schema changes
- Validates index effectiveness

---

## Best Practices

### 1. Regular Analysis

```bash
# Run weekly analysis of slow queries
SELECT
  query,
  calls,
  mean_exec_time,
  (index_advisor(query)).*
FROM pg_stat_statements
WHERE mean_exec_time > 1000
ORDER BY mean_exec_time DESC
LIMIT 20;
```

### 2. Test Before Creating

Always use `hypopg` to test index effectiveness before creating:

```sql
-- Test
SELECT * FROM hypopg_create_index('CREATE INDEX ...');
EXPLAIN ANALYZE <your query>;

-- Clean up
SELECT * FROM hypopg_reset();
```

### 3. Monitor Index Usage

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### 4. Remove Unused Indexes

```sql
-- Find indexes never used
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan = 0
  AND indexname NOT LIKE '%pkey'
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## Troubleshooting

### Issue: Index Advisor Returns Empty Results

**Problem:** No index recommendations returned

**Causes:**
1. Query already has optimal indexes
2. Query is too complex for advisor
3. Query has no WHERE/ORDER BY clauses

**Solution:**
```sql
-- Check existing indexes
SELECT * FROM pg_indexes WHERE tablename = 'customers';

-- Test with simpler query
SELECT * FROM index_advisor('SELECT * FROM customers WHERE company_id = $1');
```

### Issue: Recommended Index Seems Wrong

**Problem:** Advisor recommends index that doesn't match query pattern

**Causes:**
1. Query has placeholders ($1, $2) with unknown selectivity
2. Table statistics are stale

**Solution:**
```sql
-- Update table statistics
ANALYZE customers;

-- Re-run index advisor
SELECT * FROM index_advisor('...');
```

### Issue: Hypothetical Index Not Used in EXPLAIN

**Problem:** Created hypothetical index but EXPLAIN doesn't show it

**Causes:**
1. Query planner prefers sequential scan (table too small)
2. Index doesn't match query pattern
3. Wrong index type (btree vs GIN)

**Solution:**
```sql
-- Force index usage for testing
SET enable_seqscan = off;
EXPLAIN ANALYZE <your query>;
SET enable_seqscan = on;
```

---

## Related Documentation

- [Composite Indexes Migration](/supabase/migrations/20251120000000_add_composite_performance_indexes.sql)
- [RLS Policy Optimization](/supabase/migrations/20251120000001_optimize_rls_policies.sql)
- [Database Performance Guide](/docs/performance/database-optimization.md)
- [PostgreSQL Index Documentation](https://www.postgresql.org/docs/current/indexes.html)
- [hypopg Documentation](https://hypopg.readthedocs.io/)

---

## Summary

**Index Advisor Status:** ✅ Enabled

**Extensions:**
- `index_advisor` - Query analysis
- `hypopg` - Hypothetical index testing

**Key Benefits:**
- Automated index recommendations
- Test indexes before creating
- Validate existing optimizations
- Identify missing composite indexes

**Next Steps:**
1. Run weekly analysis of slow queries
2. Test recommended indexes with hypopg
3. Create indexes that show 10x+ improvement
4. Monitor index usage and remove unused indexes

---

**Last Updated:** 2025-11-20
**Maintained By:** Stratos Engineering Team
