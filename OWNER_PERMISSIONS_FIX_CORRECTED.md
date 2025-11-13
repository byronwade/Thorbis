# Owner Permissions Fix - CORRECTED Architecture

## 🎯 Problem
Company owners were hitting permission errors ("You must be part of a company") when trying to perform actions like archiving jobs.

## ✅ CORRECT Architecture

**Owners ARE in the `team_members` table**, but when checking permissions, we verify if that team member IS the company owner (by checking `companies.owner_id`). If they are, they get full access to everything.

```
Authorization Flow:
1. Check if user is in team_members (status = 'active')
2. Join with companies table to check if user_id = owner_id
3. If YES → Grant full access (all permissions, all roles)
4. If NO → Apply normal role-based permissions
```

## 🔧 What Was Fixed

### 1. TypeScript Authorization Layer ✅
**File:** `src/lib/auth/authorization.ts`

```typescript
export async function requireCompanyMembership(): Promise<CompanyMembership> {
  // Get team membership (includes owners)
  const { data: membership } = await supabase
    .from("team_members")
    .select("...")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  // Check if this team member IS the company owner
  const { data: company } = await supabase
    .from("companies")
    .select("owner_id")
    .eq("id", membership.company_id)
    .single();

  const isOwner = company?.owner_id === user.id;

  return {
    // ... membership data
    roleName: isOwner ? "Owner" : membership.role,
    permissions: isOwner ? [] : membership.permissions, // Empty = full access
  };
}
```

**Key Points:**
- ✅ Owners MUST have a `team_members` record
- ✅ Permission functions check if `roleName === "Owner"`
- ✅ Owners get full access via empty permissions array (implicit all)

### 2. Database RPC Functions 🔄
**File:** `supabase/migrations/20250213000000_fix_owner_permissions.sql`

All permission functions now JOIN `team_members` with `companies` and check:

```sql
CREATE OR REPLACE FUNCTION has_permission(...)
RETURNS BOOLEAN AS $$
DECLARE
  is_owner BOOLEAN;
BEGIN
  -- Join team_members with companies
  SELECT (c.owner_id = user_uuid) INTO is_owner
  FROM team_members tm
  JOIN companies c ON c.id = tm.company_id
  WHERE tm.user_id = user_uuid
  AND tm.company_id = company_uuid
  AND tm.status = 'active';

  -- Team members who ARE the owner get full access
  IF is_owner THEN
    RETURN TRUE;
  END IF;

  -- Regular permission checks...
END;
$$;
```

**Updated Functions:**
- `has_role()` - Owners have all roles
- `has_any_role()` - Owners have all roles  
- `get_user_role()` - Returns 'owner' for owners
- `has_permission()` - Owners have all permissions
- `has_company_access()` - Checks team_members (simplified)

## 📋 Apply the Migration

### Step 1: Copy the SQL
```bash
cat supabase/migrations/20250213000000_fix_owner_permissions.sql
```

### Step 2: Open Supabase SQL Editor
https://supabase.com/dashboard/project/togejqdwggezkxahomeh/sql/new

### Step 3: Paste and Run
1. Paste the entire SQL
2. Click "Run"
3. Wait for success message

### Step 4: Verify Functions
```sql
-- Test that functions were updated correctly
SELECT 
  routine_name,
  SUBSTRING(routine_definition, 1, 100) as definition_preview
FROM information_schema.routines 
WHERE routine_name IN (
  'has_role', 
  'has_any_role', 
  'get_user_role', 
  'has_permission'
)
AND routine_schema = 'public'
ORDER BY routine_name;
```

You should see functions that check `is_owner` variable.

### Step 5: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
pnpm dev
```

### Step 6: Test
Try archiving a job - it should work now!

## 🏗️ Why This Architecture?

### ✅ Benefits
1. **Data Consistency** - All users accessing company are in `team_members`
2. **Activity Tracking** - Owner actions are logged through team_members
3. **Single Source of Truth** - team_members is the main membership table
4. **Clean Code** - Single permission check path for everyone
5. **Scalable** - Easy to add more privilege levels if needed

### ✅ Security
- Owners determined by immutable `companies.owner_id` foreign key
- Only authenticated users can be owners
- RLS policies still enforce company_id matching
- Server-side checks prevent unauthorized access

## 🧪 Test Checklist

After applying the migration, verify:

- [ ] **Archive Job** - Select a job and archive it
- [ ] **Archive Invoice** - Select an invoice and archive it  
- [ ] **Bulk Archive** - Select multiple items and bulk archive
- [ ] **Update Records** - Edit jobs, customers, etc.
- [ ] **Team Management** - Add/edit/remove team members
- [ ] **Settings Access** - Navigate to all settings pages
- [ ] **View Reports** - Access financial and performance reports

All should work without permission errors!

## 📊 Authorization Logic

### Before Fix
```
Action → Check team_members → Get role → Check permissions → May fail if role missing
```

### After Fix
```
Action → Check team_members → Is user the owner?
  ├─ YES → Full access ✅
  └─ NO → Check role → Check permissions
```

## 🔍 Debugging

If you still see permission errors:

1. **Check team_members record:**
```sql
SELECT * FROM team_members 
WHERE user_id = 'YOUR_USER_ID' 
AND status = 'active';
```

2. **Check if you're the owner:**
```sql
SELECT 
  c.id as company_id,
  c.owner_id,
  (c.owner_id = 'YOUR_USER_ID') as is_owner
FROM companies c
WHERE c.id = 'YOUR_COMPANY_ID';
```

3. **Test permission function:**
```sql
SELECT has_permission(
  'YOUR_USER_ID'::uuid,
  'delete_jobs',
  'YOUR_COMPANY_ID'::uuid
);
-- Should return TRUE for owners
```

## 🎯 Summary

**Architecture:** Owners are in `team_members`, but get elevated privileges when we detect `user_id = companies.owner_id`

**Benefits:**
- ✅ Consistent data model
- ✅ Owner activity tracking  
- ✅ Full access for owners
- ✅ Clean permission logic
- ✅ Secure and scalable

**Action Required:**
1. Apply SQL migration (one-time)
2. Restart dev server
3. Test owner access

---

**Status:** 
- ✅ TypeScript changes: Applied
- 🔄 SQL migration: Needs manual application
- 🧪 Testing: Required after migration

