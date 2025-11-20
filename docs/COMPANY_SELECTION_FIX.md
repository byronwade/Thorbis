# Company Selection Bug Fix

**Date**: November 20, 2024
**Issue**: User bcw1995@gmail.com redirected to onboarding instead of dashboard
**Root Cause**: System selecting incomplete company instead of completed company

---

## Problem Description

User bcw1995@gmail.com is owner of "Test Plumbing Company" with completed onboarding, but kept getting redirected to the welcome/onboarding page with message "You don't have access to this company".

### Root Cause

User has TWO companies:
1. **"ercre"** (company_id: `bfce9354-518a-4044-bb72-01186785c31f`)
   - Onboarding: **NOT completed** (`onboarding_completed_at: NULL`)
   - Status: Active, not deleted

2. **"Test Plumbing Company"** (company_id: `2b88a305-0ecd-4bff-9898-b166cc7937c4`)
   - Onboarding: **COMPLETED** (`onboarding_completed_at: 2025-11-08 04:10:19.701+00`)
   - Status: Active, not deleted

The `getActiveCompanyId()` function in `/src/lib/auth/company-context.ts` falls back to the **first available company** from `getUserCompanies()`, which was returning companies in arbitrary order (likely by creation date). This meant "ercre" was selected instead of "Test Plumbing Company".

The welcome page logic then detected an incomplete company and prevented redirect to dashboard.

---

## Solution

Modified `/src/lib/auth/company-context.ts` in the `getUserCompanies()` function to:

1. **Fetch `onboarding_completed_at`** from companies table
2. **Sort companies by completion status**:
   - Completed companies first
   - Incomplete companies last
   - Alphabetical by name within each group

### Code Changes

```typescript
// BEFORE (line 151-176)
const { data: memberships } = await supabase
  .from("company_memberships")
  .select(`
    company_id,
    companies!inner (
      id,
      name,
      logo,
      deleted_at
    )
  `)
  .eq("user_id", user.id)
  .eq("status", "active")
  .is("companies.deleted_at", null);

if (!memberships) {
  return [];
}

return memberships.map((m: any) => ({
  id: m.companies.id,
  name: m.companies.name,
  logo: m.companies.logo,
}));

// AFTER (line 151-191)
const { data: memberships } = await supabase
  .from("company_memberships")
  .select(`
    company_id,
    companies!inner (
      id,
      name,
      logo,
      deleted_at,
      onboarding_completed_at
    )
  `)
  .eq("user_id", user.id)
  .eq("status", "active")
  .is("companies.deleted_at", null);

if (!memberships) {
  return [];
}

// Sort companies: prioritize completed onboarding over incomplete
const sorted = memberships.sort((a: any, b: any) => {
  const aCompleted = !!a.companies.onboarding_completed_at;
  const bCompleted = !!b.companies.onboarding_completed_at;

  // Completed companies first
  if (aCompleted && !bCompleted) return -1;
  if (!aCompleted && bCompleted) return 1;

  // Then by name alphabetically
  return a.companies.name.localeCompare(b.companies.name);
});

return sorted.map((m: any) => ({
  id: m.companies.id,
  name: m.companies.name,
  logo: m.companies.logo,
}));
```

---

## Quick Fix (Temporary)

Created debug page at `/test-switch-company` that manually sets active company to Test Plumbing Company.

**Usage**:
1. Navigate to `http://localhost:3000/test-switch-company`
2. Will set cookie and redirect to `/dashboard`

**File**: `/src/app/test-switch-company/page.tsx`

---

## Testing

### Test Case 1: User with Multiple Companies
**Setup**: User has both completed and incomplete companies
**Expected**: System selects completed company as default
**Result**: ✅ PASS

### Test Case 2: User with Only Incomplete Companies
**Setup**: User has only incomplete companies
**Expected**: System selects first alphabetically
**Result**: ✅ PASS (unchanged behavior)

### Test Case 3: User with Only Completed Companies
**Setup**: User has multiple completed companies
**Expected**: System selects first alphabetically
**Result**: ✅ PASS

---

## Impact

### Files Changed
- `/src/lib/auth/company-context.ts` - Modified `getUserCompanies()` function

### Files Created
- `/src/app/test-switch-company/page.tsx` - Debug helper page
- `/docs/COMPANY_SELECTION_FIX.md` - This document

### Breaking Changes
None - purely additive sorting logic

### Performance Impact
Minimal - added client-side array sort (negligible with < 100 companies per user)

---

## Future Improvements

1. **Company Switcher UI**: Add visual indicator showing which companies have completed onboarding
2. **Archive Incomplete**: Add UI flow to archive/delete incomplete companies
3. **Onboarding Progress**: Show completion percentage in company switcher
4. **Default Company Setting**: Allow users to manually set default company

---

## Related Documentation

- `/docs/ONBOARDING_ENHANCEMENT_COMPLETE.md` - Enhanced onboarding system
- `/src/lib/auth/company-context.ts` - Company context management
- `/src/components/onboarding/welcome-data.tsx` - Onboarding redirect logic
