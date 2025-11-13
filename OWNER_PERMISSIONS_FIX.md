# Owner Permissions Fix - Complete Guide

## 🎯 Problem
Company owners were hitting permission errors ("You must be part of a company") when trying to perform actions like archiving jobs. This happened because the authorization system was only checking the `team_members` table, without recognizing that owners should **ALWAYS** have full access.

## ✅ What Was Fixed

### 1. **TypeScript Authorization Layer** ✅ COMPLETE
**File:** `src/lib/auth/authorization.ts`

- **`requireCompanyMembership()`**: Now checks if user is company owner FIRST before checking team_members
- **`requirePermission()`**: Owners automatically have all permissions
- **`requireAllPermissions()`**: Owners bypass permission checks
- **`requireAnyPermission()`**: Owners bypass permission checks

**Result:** All TypeScript actions now recognize owners and give them full access.

### 2. **Database RPC Functions** 🔄 NEEDS MANUAL APPLICATION
**File:** `supabase/migrations/20250213000000_fix_owner_permissions.sql`

The migration updates these database functions to check `companies.owner_id` FIRST:
- `has_role()` - Owners have all roles
- `has_any_role()` - Owners have all roles
- `get_user_role()` - Returns 'owner' for company owners
- `has_permission()` - Owners have all permissions
- `has_company_access()` - New helper function

**Result:** Database-level permission checks will also recognize owners.

## 📋 Manual Steps Required

### Step 1: Apply Database Migration

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/togejqdwggezkxahomeh/sql/new

2. **Copy Migration SQL:**
   - Open: `supabase/migrations/20250213000000_fix_owner_permissions.sql`
   - Copy the entire contents

3. **Execute Migration:**
   - Paste into the SQL Editor
   - Click "Run" button
   - Wait for "Success" confirmation

4. **Verify Functions Were Updated:**
   ```sql
   -- Run this query to verify:
   SELECT 
     routine_name,
     routine_definition 
   FROM information_schema.routines 
   WHERE routine_name IN (
     'has_role', 
     'has_any_role', 
     'get_user_role', 
     'has_permission',
     'has_company_access'
   )
   AND routine_schema = 'public';
   ```

### Step 2: Restart Your Dev Server

After applying the migration, restart your development server to ensure all changes are loaded:

```bash
# Stop current server (Ctrl+C)
pnpm dev
```

### Step 3: Test Owner Access

Try the action that was failing (archiving a job):

1. Navigate to your jobs list
2. Try to archive a job
3. **Expected Result:** ✅ Job archives successfully without permission errors

## 🔍 How It Works Now

### Before Fix:
```
User Action → Check team_members → Not found/inactive → ❌ ERROR
```

### After Fix:
```
User Action → Check companies.owner_id → Is Owner? → ✅ FULL ACCESS
             → Not Owner? → Check team_members → Apply role permissions
```

## 🛡️ What This Fixes

✅ **Archive Operations** - Owners can archive any entity (jobs, invoices, etc.)
✅ **Update Operations** - Owners can update any record
✅ **Delete Operations** - Owners can delete any record
✅ **Permission Checks** - Owners bypass all permission checks
✅ **Role Checks** - Owners are considered to have all roles
✅ **Company Access** - Owners always have access to their company

## 🧪 Test Cases to Verify

After applying the migration, test these scenarios:

1. **Archive Job** ✓
   - Go to jobs page
   - Select a job
   - Click "Archive"
   - Should succeed without errors

2. **Archive Invoice** ✓
   - Go to invoices page
   - Select an invoice
   - Click "Archive"
   - Should succeed

3. **Bulk Archive** ✓
   - Select multiple items
   - Click "Bulk Archive"
   - Should succeed

4. **Team Member Management** ✓
   - Go to team page
   - Try adding/editing team members
   - Should have full access

5. **Settings Access** ✓
   - Navigate to all settings pages
   - Should have access to everything

## 📝 Technical Details

### Authorization Flow

**1. TypeScript Layer (Server Actions)**
```typescript
// src/lib/auth/authorization.ts
export async function requireCompanyMembership() {
  // FIRST: Check if user is owner
  const { data: ownedCompany } = await supabase
    .from("companies")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (ownedCompany) {
    return {
      companyId: ownedCompany.id,
      roleName: "Owner",
      permissions: [], // Implicit full access
    };
  }

  // SECOND: Check team_members for regular members
  // ... existing logic ...
}
```

**2. Database Layer (RPC Functions)**
```sql
-- supabase/migrations/20250213000000_fix_owner_permissions.sql
CREATE OR REPLACE FUNCTION has_permission(...)
RETURNS BOOLEAN AS $$
BEGIN
  -- FIRST: Check if user is the company owner
  IF EXISTS (
    SELECT 1 FROM companies
    WHERE id = company_uuid
    AND owner_id = user_uuid
  ) THEN
    RETURN TRUE;  -- Owners have ALL permissions
  END IF;

  -- SECOND: Check team_members permissions
  -- ... existing logic ...
END;
$$;
```

### What Makes Owners Special

Owners are different from all other roles (including Admin):

1. **Checked via `companies.owner_id`** - Not dependent on team_members table
2. **Cannot be disabled** - Always have access to their company
3. **Cannot be deleted** - Protected at database level
4. **Have ALL permissions implicitly** - Don't need explicit permission grants
5. **Have ALL roles implicitly** - Considered to have every role

## 🚨 Important Notes

1. **Only ONE owner per company** - The `companies.owner_id` field
2. **Owners are protected** - Cannot be archived/deactivated/deleted
3. **Transfer ownership** - Use dedicated ownership transfer function (if implemented)
4. **Team member record optional** - Owners don't NEED a team_members record to have access

## 🔐 Security Implications

This change is **SECURE** because:

1. ✅ Owner is determined by `companies.owner_id` (immutable foreign key)
2. ✅ Only authenticated users can be owners (auth.uid())
3. ✅ Owners can only access their OWN company's data (RLS still applies)
4. ✅ Supabase RLS policies still enforce company_id matching
5. ✅ Server-side checks prevent unauthorized access

This change is **NECESSARY** because:

1. ✅ Owners created their company - they should have full control
2. ✅ Team member status shouldn't affect owner access
3. ✅ Prevents owners from being locked out of their own company
4. ✅ Matches expected behavior (owners = full access)

## 📊 Impact Summary

**Files Modified:**
- ✅ `src/lib/auth/authorization.ts` - TypeScript authorization layer
- 🔄 `supabase/migrations/20250213000000_fix_owner_permissions.sql` - Database functions

**Actions Affected:**
- ✅ All archive actions (jobs, invoices, customers, etc.)
- ✅ All update actions
- ✅ All delete actions
- ✅ All permission checks
- ✅ Team management actions

**Testing Required:**
- 🧪 Archive operations
- 🧪 Bulk operations
- 🧪 Settings access
- 🧪 Team management
- 🧪 Data access controls

---

## 🎉 Next Steps

1. ✅ TypeScript changes are already applied
2. 🔄 Apply the SQL migration (see Step 1 above)
3. 🔄 Restart dev server
4. 🧪 Test owner access (see test cases above)
5. ✅ Enjoy full owner privileges!

---

**Questions?** The authorization system now prioritizes owner status above all else. If you're still hitting permission errors after applying the migration, check:
1. Is the user's ID in `companies.owner_id`?
2. Was the migration applied successfully?
3. Are there any console errors?

