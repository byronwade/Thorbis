# Invoice Archive Fix

## Issue
The archive functionality on the invoices page was not working. When users tried to archive invoices, nothing happened.

## Root Cause

### Issue 1: Invalid Status Value
The `archiveInvoice` action in `src/actions/invoices.ts` was attempting to set `status: "archived"` on the invoice record. However, the database schema constraint for the `invoices.status` column only allows these values:
- `draft`
- `sent`
- `viewed`
- `partial`
- `paid`
- `overdue`
- `cancelled`

The status `archived` is NOT in the allowed values, causing the database update to fail silently due to the CHECK constraint violation.

### Issue 2: Company Access Query Failing
The action was also using a direct query to `team_members` table to get the company_id:
```typescript
const { data: teamMember } = await supabase
  .from("team_members")
  .select("company_id")
  .eq("user_id", user.id)
  .single();
```

This query was failing or returning null, causing the error "You must be part of a company". This could be due to:
- RLS policies blocking the query
- Multiple team memberships causing `.single()` to fail
- Missing team_members record

## Solution
Removed the `status: "archived"` from the update operation in `archiveInvoice`. The archived state is now correctly determined by the `archived_at` timestamp column, not by the status field.

### Changes Made

1. **src/actions/invoices.ts**
   
   **Status Fix (Line 860-866):**
   - Removed `status: "archived"` from the update query
   - Added a comment explaining that `archived_at` indicates the archived state
   - The invoice retains its original status (`draft`, `sent`, `paid`, etc.)
   
   **Company Access Fix:**
   - Added import for `getActiveCompanyId` from `@/lib/auth/company-context`
   - Replaced direct `team_members` query with `getActiveCompanyId()` helper function
   - This function properly handles:
     - Multiple company memberships
     - Cookie-based active company selection
     - RLS policy compatibility
     - Fallback to first available company
   - Applied fix to both `archiveInvoice()` and `restoreInvoice()` functions

2. **src/components/work/invoices-table.tsx**
   - Added `toast` notifications for user feedback
   - Added error handling for both single and bulk archive operations
   - Users now see success/error messages when archiving invoices
   - Better error handling with try-catch blocks
   - **UX Improvements:**
     - Hide "Archive Invoice" option for paid invoices in the dropdown menu
     - Bulk archive now filters out paid invoices automatically
     - Shows warning if user tries to bulk archive paid invoices
     - Clear messaging: "X paid invoices cannot be archived. Only archiving Y invoices."

3. **Error Message Improvements**
   - Changed from: "Cannot archive paid invoices. Paid invoices must be retained for records."
   - Changed to: "This invoice has been paid and cannot be archived. Paid invoices must be kept for tax and legal compliance."
   - More user-friendly and explains WHY paid invoices can't be archived

## How Archive Works Now

When an invoice is archived:
- `archived_at` is set to the current timestamp
- `deleted_at` is set to the current timestamp
- `deleted_by` is set to the user's ID
- `permanent_delete_scheduled_at` is set to 90 days from now
- **Status remains unchanged** (e.g., if it was "draft", it stays "draft")

The invoice list page filters out archived invoices by checking `archived_at IS NULL`, so archived invoices won't appear in the main list.

## Testing
To test the fix:
1. Navigate to `/dashboard/work/invoices`
2. Click on the actions menu (three dots) for any invoice
3. Select "Archive Invoice"
4. Confirm the action
5. You should see a success toast notification
6. The invoice should disappear from the list
7. You can find it in the archive: `/dashboard/settings/archive`

## Business Rules
- **Paid invoices CANNOT be archived** (for tax and legal compliance)
  - The "Archive Invoice" option is hidden for paid invoices
  - If a paid invoice is included in bulk selection, it's automatically filtered out
  - Users see a clear warning message if they try to archive paid invoices
- All other invoices (draft, sent, viewed, partial, overdue, cancelled) can be archived
- Archived invoices can be restored within 90 days
- After 90 days, archived invoices are permanently deleted

## Related Files
- `src/actions/invoices.ts` - Server action for archiving
- `src/components/work/invoices-table.tsx` - UI component with archive buttons
- `supabase/migrations/20250131000003_add_jobs_and_work_tables.sql` - Schema definition

