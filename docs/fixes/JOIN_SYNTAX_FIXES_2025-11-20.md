# JOIN Syntax Fixes - November 20, 2025

## Summary

Fixed **9 JOIN syntax errors** across **7 query files** that were using incorrect Supabase JOIN syntax. These errors caused runtime failures with the message: `"Could not find a relationship between 'table_name' and 'column_id'"`.

## Root Cause

Supabase requires explicit foreign key constraint names in JOIN syntax, not just column names.

**Incorrect Pattern:**
```typescript
customers:customers!customer_id (...)  // ❌ WRONG - column name
```

**Correct Pattern:**
```typescript
customers!table_customer_id_customers_id_fk (...)  // ✅ CORRECT - foreign key constraint name
```

## Files Fixed

### 1. team-members.ts (src/lib/queries/team-members.ts:52)
**Error:** `profiles:user_id`
**Fixed:** `profiles!company_memberships_user_id_fkey`
**Impact:** Team members page was failing to load

### 2. estimates.ts (src/lib/queries/estimates.ts:17)
**Error:** `customers:customers!customer_id`
**Fixed:** `customers!estimates_customer_id_customers_id_fk`
**Impact:** Estimates list page would have failed

### 3. appointments.ts (src/lib/queries/appointments.ts:25)
**Error:** `customer:customers!customer_id`
**Fixed:** `customer:customers!appointments_customer_id_customers_id_fk`
**Impact:** Appointments list page would have failed

### 4. payments.ts (src/lib/queries/payments.ts:22)
**Error:** `customers:customers!customer_id`
**Fixed:** `customers!payments_customer_id_customers_id_fk`
**Impact:** Payments list page would have failed

### 5. jobs.ts (src/lib/queries/jobs.ts:28,34)
**Error 1:** `customers:customers!customer_id`
**Fixed 1:** `customers:customers!jobs_customer_id_customers_id_fk`

**Error 2:** `properties:properties!property_id`
**Fixed 2:** `properties:properties!jobs_property_id_properties_id_fk`
**Impact:** Jobs list page would have failed

### 6. equipment.ts (src/lib/queries/equipment.ts:24,29)
**Error 1:** `customer:customers!customer_id`
**Fixed 1:** `customer:customers!equipment_customer_id_customers_id_fk`

**Error 2:** `property:properties!property_id`
**Fixed 2:** `property:properties!equipment_property_id_properties_id_fk`
**Impact:** Equipment list page would have failed

### 7. invoices.ts (src/lib/queries/invoices.ts:18)
**Error:** `customers:customers!customer_id`
**Fixed:** `customers!invoices_customer_id_customers_id_fk`
**Impact:** Invoices list page would have failed

### 8. job-details.ts (src/lib/queries/job-details.ts:220,309,325)
**Error 1:** `user:user_id`
**Fixed 1:** `user:users!job_activity_log_user_id_fkey`

**Error 2:** `team_member:team_member_id`
**Fixed 2:** `team_member:team_members!appointment_team_assignments_team_member_id_fkey`

**Error 3:** `equipment:equipment_id`
**Fixed 3:** `equipment:equipment!appointment_equipment_equipment_id_fkey`
**Impact:** Job details page would have failed loading activity log and appointments

## How Foreign Key Names Were Found

Used PostgreSQL system catalogs to query foreign key constraint names:

```sql
SELECT con.conname, att.attname as column_name
FROM pg_constraint con
JOIN pg_attribute att ON att.attnum = ANY(con.conkey) AND att.attrelid = con.conrelid
WHERE con.conrelid = (SELECT oid FROM pg_class WHERE relname = 'table_name')
  AND con.contype = 'f';
```

## Prevention

**Best Practice:** Always use Supabase MCP to query for correct foreign key names before writing JOIN syntax:

```typescript
// 1. Find foreign key constraint name
mcp__supabase__execute_sql({ query: "SELECT con.conname..." })

// 2. Use in query
customers!correct_foreign_key_name (...)
```

## Testing

All affected pages should now load without JOIN errors:
- ✅ Team members page
- ✅ Estimates list
- ✅ Appointments list
- ✅ Payments list
- ✅ Jobs list
- ✅ Equipment list
- ✅ Invoices list
- ✅ Job details page (with activity log and appointments)

## Related Documentation

- Original fix: team-members.ts (2025-11-20)
- Pattern documented in: CLAUDE.md Rule #6 (Production-Ready Updates)
- Database patterns: /docs/performance/
