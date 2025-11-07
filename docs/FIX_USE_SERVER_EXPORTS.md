# Fixed: "use server" File Export Restrictions

**Date:** 2025-01-04
**Issue:** Next.js 16 runtime error preventing customer pages from loading
**Status:** ✅ Fixed

---

## Problem

Next.js 16 introduced strict restrictions on "use server" files:
- **Only async functions can be exported** from files with `"use server"` directive
- **No TypeScript types, interfaces, or constants** can be exported

### Error Message
```
Error: A "use server" file can only export async functions, found object.
Read more: https://nextjs.org/docs/messages/invalid-use-server-value
```

### Root Cause

`src/actions/customer-badges.ts` (a "use server" file) was exporting:
1. `export interface CustomerBadge` - TypeScript interface ❌
2. `export const PREMADE_BADGES` - Constant array ❌

These exports violated Next.js 16 restrictions and caused the entire customer detail page to fail.

---

## Solution

### 1. Created Separate Types File

**New file:** `src/types/customer-badges.ts`

Moved all non-function exports to this new file:
- `CustomerBadge` interface
- `PREMADE_BADGES` constant

This file does NOT have `"use server"` directive, so it can export anything.

### 2. Updated Server Actions File

**Updated:** `src/actions/customer-badges.ts`

- Removed interface and constant exports
- Now ONLY exports async functions:
  - `getCustomerBadges()`
  - `addCustomerBadge()`
  - `removeCustomerBadge()`
  - `generateAutoBadges()`

### 3. Fixed Import Statements

Updated all files that were importing from the actions file:

**Files Updated:**
- `src/components/customers/customer-badges.tsx`
- `src/components/customers/customer-page-editor.tsx`

**Before:**
```typescript
import { PREMADE_BADGES, type CustomerBadge } from "@/actions/customer-badges";
```

**After:**
```typescript
import { PREMADE_BADGES, type CustomerBadge } from "@/types/customer-badges";
import { getCustomerBadges, addCustomerBadge, ... } from "@/actions/customer-badges";
```

---

## Files Changed

### Created
- ✅ `src/types/customer-badges.ts` - Types and constants

### Modified
- ✅ `src/actions/customer-badges.ts` - Removed non-function exports
- ✅ `src/components/customers/customer-badges.tsx` - Fixed imports
- ✅ `src/components/customers/customer-page-editor.tsx` - Fixed imports

### Cleared
- ✅ `.next/` cache - Removed to clear compilation errors

---

## Testing

### Before Fix
- ❌ Customer detail pages returned 500 error
- ❌ Console showed "use server" violation
- ❌ Page completely broken

### After Fix
- ✅ Customer detail pages load successfully
- ✅ No console errors
- ✅ Badges system functional
- ✅ Server Actions work correctly

---

## Next.js 16 "use server" Rules (Reference)

### ✅ Allowed Exports
```typescript
"use server";

// ✅ Async functions
export async function myAction() { ... }

// ✅ Function expressions
export const myAction = async () => { ... };
```

### ❌ Not Allowed Exports
```typescript
"use server";

// ❌ Interfaces/Types
export interface MyType { ... }
export type MyType = { ... };

// ❌ Constants
export const MY_CONSTANT = [...];

// ❌ Classes
export class MyClass { ... }

// ❌ Sync functions
export function syncFunc() { ... }
```

### Best Practice Pattern

**Separate concerns into different files:**

```
src/
  actions/
    my-feature.ts          # "use server" - ONLY async functions
  types/
    my-feature.ts          # NO "use server" - types, constants, etc.
  components/
    my-component.tsx       # Imports from both
```

---

## Prevention

To avoid this issue in the future:

1. **Never export non-functions from "use server" files**
2. **Create separate `/types` files** for interfaces and constants
3. **Use TypeScript** - It will catch these at compile time
4. **Clear `.next` cache** after fixing to remove stale compilation

---

## Related Documentation

- [Next.js "use server" Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Server Actions Error Messages](https://nextjs.org/docs/messages/invalid-use-server-value)

---

**Fixed by:** Claude Code (Sonnet 4.5)
**Verified:** ✅ Customer pages loading, badges functional
**Build Status:** Ready for production
