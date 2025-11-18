# Schedules → Appointments Migration Plan

**Status**: PENDING APPROVAL
**Created**: 2025-11-17
**Risk Level**: HIGH (Destructive database changes + ~24 file modifications)

---

## Executive Summary

Currently, the application has **two separate tables** for scheduling data:

1. **`schedules` table** (29 rows, 24 active appointments)
   - This is the **ACTUAL source of truth**
   - Contains all appointment data with rich scheduling features
   - Powers the UI, stats, and all scheduling functionality
   - Has 47 columns including recurrence, reminders, cancellation tracking, etc.

2. **`appointments` table** (8,370 rows, recently generated test data)
   - Different schema with 26 columns
   - NOT used by any production code currently
   - Was populated with test data but isn't read by the UI

**The Problem**: Code and UI reference both tables inconsistently, leading to confusion and potential bugs.

**The Solution**: Consolidate to a single `appointments` table as the source of truth.

---

## Current State Analysis

### Database Tables

#### `schedules` Table (SOURCE OF TRUTH)
- **Row count**: 29 total (25 appointments, 4 other types)
- **Active appointments**: 24 (excluding deleted)
- **Schema**: 47 columns with advanced features:
  - Recurrence support (is_recurring, recurrence_rule, parent_schedule_id)
  - Reminder system (reminder_sent, reminder_sent_at, reminder_method)
  - Cancellation tracking (cancelled_at, cancelled_by, cancellation_reason)
  - Rescheduling links (rescheduled_from_id, rescheduled_to_id)
  - Soft deletes (deleted_at, deleted_by, archived_at)
  - Multiple time tracking (start_time, end_time, actual_start_time, actual_end_time)

#### `appointments` Table (TEST DATA)
- **Row count**: 8,370 (all test data from generation script)
- **Schema**: 26 columns - simpler structure
- **Status**: Not referenced by production code
- **Foreign keys**: Links to users.id (not team_members.id)

### Code References

**Files querying `schedules` table**: 14 files
- `src/lib/queries/appointments.ts` (ironically named!)
- `src/lib/schedule-data.ts`
- `src/lib/dashboard/mission-control-data.ts`
- `src/hooks/use-customer-360.ts`
- `src/components/work/maintenance-plans/maintenance-plan-detail-data.tsx`
- `src/components/work/contracts/contract-detail-data.tsx`
- `src/components/work/appointments/appointment-detail-data.tsx`
- `src/components/properties/property-details/property-detail-data.tsx`
- `src/components/customers/customer-detail-data.tsx`
- `src/components/appointments/appointment-detail-data.tsx`
- `src/actions/schedules.ts`
- `src/actions/schedule-assignments.ts`
- `src/actions/call-customer-data.ts`
- `src/actions/appointments.ts`

**Files with TypeScript `schedules` types**: 10 files
- `src/types/supabase.ts`
- `src/lib/schedule-data.ts`
- `src/lib/offline/sync-queue.ts`
- `src/lib/offline/indexed-db.ts`
- `src/components/work/team-details/team-schedule-table.tsx`
- `src/components/work/team-details/team-member-page-content.tsx`
- `src/components/work/job-details/sections/job-schedules.tsx`
- `src/components/properties/property-details/property-page-content.tsx`
- `src/actions/schedule.ts`
- `src/actions/payment-plans.ts`

---

## Migration Strategy Options

### Option A: Drop & Rename (RECOMMENDED)

**Advantages**:
- Preserves ALL existing data (29 schedules records)
- Keeps advanced scheduling features (recurrence, reminders, etc.)
- Minimal data loss (only test data in appointments)
- Faster migration (no data copying)

**Disadvantages**:
- Loses 8,370 test appointment rows (not used in production)
- Requires database downtime during rename

**Steps**:
1. Backup entire database
2. Drop empty `appointments` table (loses test data)
3. Rename `schedules` → `appointments`
4. Recreate indexes, constraints, RLS policies with new name
5. Regenerate TypeScript types
6. Update ~24 code files to reference `appointments`
7. Test all scheduling features

---

### Option B: Merge Schemas (COMPLEX)

**Advantages**:
- Could preserve test data if needed
- More reversible (can keep both tables during transition)

**Disadvantages**:
- Complex schema alignment (47 columns vs 26 columns)
- Data transformation required
- Longer migration time
- Higher risk of data corruption
- Need to maintain compatibility layer

**Steps**:
1. Analyze schema differences in detail
2. Add missing columns to one table or the other
3. Write data migration scripts
4. Copy/merge data with transformations
5. Create compatibility views
6. Gradual code cutover
7. Eventually drop old table

---

### Option C: Keep Both (NOT RECOMMENDED)

**Advantages**:
- No breaking changes

**Disadvantages**:
- Continued confusion about which table to use
- Duplicate code and maintenance burden
- Risk of data inconsistency
- Doesn't solve the original problem

---

## Recommended Approach: Option A (Drop & Rename)

### Phase 1: Pre-Migration Preparation

**1. Backup Database**
```sql
-- Create full database backup
-- (Use Supabase dashboard or pg_dump)
```

**2. Document Current RLS Policies**
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'schedules';
```

**3. Document Current Indexes**
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'schedules';
```

**4. Document Current Constraints**
```sql
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'schedules'::regclass;
```

---

### Phase 2: Database Migration

**1. Drop Empty Appointments Table**
```sql
-- ⚠️ WARNING: This deletes 8,370 test rows
DROP TABLE IF EXISTS appointments CASCADE;
```

**2. Rename Schedules to Appointments**
```sql
-- Rename the table
ALTER TABLE schedules RENAME TO appointments;

-- Rename sequences (if any)
ALTER SEQUENCE IF EXISTS schedules_id_seq RENAME TO appointments_id_seq;
```

**3. Recreate Indexes** (with new table name)
```sql
-- Example - actual indexes will vary
CREATE INDEX idx_appointments_company_customer
  ON appointments(company_id, customer_id);

CREATE INDEX idx_appointments_start_time
  ON appointments(start_time)
  WHERE deleted_at IS NULL;

-- Add more indexes as documented in Phase 1
```

**4. Recreate RLS Policies**
```sql
-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Recreate policies (example - actual policies will vary)
CREATE POLICY "Users can view appointments in their companies"
  ON appointments FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Add more policies as documented in Phase 1
```

**5. Update Foreign Key References**
```sql
-- Find tables that reference schedules
SELECT
  tc.table_name,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'schedules';

-- Update each foreign key constraint (if any)
```

---

### Phase 3: Code Migration

**1. Regenerate TypeScript Types**
```bash
pnpm supabase gen types typescript --schema public > src/types/supabase.ts
```

**2. Update Database Queries** (14 files)

Find/replace pattern:
```typescript
// BEFORE
.from("schedules")

// AFTER
.from("appointments")
```

**3. Update Type References** (10 files)

Find/replace pattern:
```typescript
// BEFORE
Database["public"]["Tables"]["schedules"]["Row"]

// AFTER
Database["public"]["Tables"]["appointments"]["Row"]
```

**4. Rename Files/Variables** (for clarity)
```bash
# Rename schedule-related files to appointment-related
mv src/actions/schedules.ts src/actions/appointments-legacy.ts
mv src/lib/schedule-data.ts src/lib/appointment-data.ts
```

**5. Update Imports**
```typescript
// BEFORE
import { getScheduleData } from "@/lib/schedule-data";

// AFTER
import { getAppointmentData } from "@/lib/appointment-data";
```

---

### Phase 4: Testing & Verification

**1. Verify Data Integrity**
```sql
-- Count should match original schedules count (29)
SELECT COUNT(*) FROM appointments;

-- Verify appointment type filtering still works
SELECT COUNT(*) FROM appointments WHERE type = 'appointment';

-- Check all foreign keys resolve
SELECT COUNT(*) FROM appointments a
LEFT JOIN customers c ON c.id = a.customer_id
WHERE c.id IS NULL;
-- Should return 0
```

**2. Test Critical User Flows**
- [ ] View appointments list page
- [ ] Create new appointment
- [ ] Edit existing appointment
- [ ] Delete/archive appointment
- [ ] View appointment in customer details
- [ ] View appointment in property details
- [ ] View team member schedule
- [ ] Mission control dashboard loads appointments
- [ ] Offline sync works with appointments
- [ ] Appointment stats display correctly

**3. Run Build & TypeScript Check**
```bash
pnpm build
# Should complete with no type errors
```

**4. Test Queries**
```typescript
// Test basic query
const { data, error } = await supabase
  .from("appointments")
  .select("*")
  .eq("type", "appointment")
  .is("deleted_at", null);

console.log(`Found ${data?.length} active appointments`);
```

---

## Rollback Plan

If migration fails, rollback steps:

**1. Restore from Backup**
```sql
-- Use Supabase dashboard or pg_restore
-- Restore to point-in-time before migration started
```

**2. Revert Code Changes**
```bash
git revert <migration-commit-hash>
pnpm install
```

**3. Regenerate Types**
```bash
pnpm supabase gen types typescript --schema public > src/types/supabase.ts
```

---

## Impact Assessment

### High Risk Areas

1. **Offline Sync** (`src/lib/offline/`)
   - IndexedDB stores reference schedules table
   - Sync queue processes schedules changes
   - **Risk**: Offline data could be lost or corrupted

2. **Mission Control Dashboard** (`src/lib/dashboard/mission-control-data.ts`)
   - Central hub for scheduling data
   - **Risk**: Dashboard could break entirely

3. **Customer 360 View** (`src/hooks/use-customer-360.ts`)
   - Shows all customer schedules/appointments
   - **Risk**: Customer details page could fail

4. **Team Member Schedules** (`src/components/work/team-details/`)
   - Shows technician assignments
   - **Risk**: Team scheduling could break

### Medium Risk Areas

- Appointment detail pages
- Property schedule views
- Contract/maintenance plan scheduling
- Call customer data integration

### Low Risk Areas

- Stats and analytics (can be recalculated)
- Search functionality (can be reindexed)

---

## Migration Checklist

### Pre-Migration
- [ ] **CRITICAL**: Backup entire Supabase database
- [ ] Document all RLS policies on schedules table
- [ ] Document all indexes on schedules table
- [ ] Document all foreign key constraints
- [ ] Notify team of migration window
- [ ] Set up staging environment for testing

### Migration
- [ ] Drop appointments table (loses test data)
- [ ] Rename schedules → appointments
- [ ] Recreate all indexes with new name
- [ ] Recreate all RLS policies
- [ ] Verify foreign key constraints updated
- [ ] Regenerate TypeScript types

### Post-Migration
- [ ] Update all .from("schedules") calls (14 files)
- [ ] Update all type references (10 files)
- [ ] Rename files for clarity
- [ ] Run TypeScript build (zero errors)
- [ ] Test all critical user flows
- [ ] Verify data integrity queries
- [ ] Test offline sync functionality
- [ ] Monitor production for errors

---

## Estimated Timeline

- **Phase 1 (Preparation)**: 2-3 hours
- **Phase 2 (Database Migration)**: 30 minutes
- **Phase 3 (Code Migration)**: 3-4 hours
- **Phase 4 (Testing)**: 2-3 hours

**Total**: 8-11 hours of work

---

## Decision Required

**Before proceeding, please confirm**:

1. ✅ Okay to lose 8,370 test appointment rows in current appointments table?
2. ✅ Okay to rename schedules table to appointments?
3. ✅ Okay with ~8-11 hour migration effort?
4. ✅ Database backup is current and tested?
5. ✅ Team is aware of potential downtime?

**Alternative**: If you want to preserve test data or need a less destructive approach, we can proceed with Option B (Merge Schemas) instead, but it will take 2-3x longer.

---

## Questions to Answer

1. **Do we need the test appointment data** (8,370 rows), or can we regenerate after migration?
2. **What's our maintenance window**? Can we take the app offline for 1-2 hours?
3. **Should we migrate in staging first**, or go directly to production?
4. **Do we need a gradual rollout**, or can we do it all at once?
5. **Are there any custom integrations** or external services that query schedules directly?

---

## Next Steps

Once you approve this plan:

1. I'll create a backup of the current database
2. Run the migration in a staging environment first
3. Test all critical flows
4. Document any issues found
5. Present updated plan based on staging results
6. Execute production migration with your approval

**Please review and provide approval or feedback before I proceed.**
