# Welcome Page Routing Fix

## Issue
The `/dashboard/welcome` (onboarding) page was showing for **all users**, even those with existing active companies. It should only show for:
1. **New users** without any companies
2. **Existing users** explicitly creating a new company

## Solution

### 1. Updated `/dashboard/welcome` Page Logic
**File:** `src/app/(dashboard)/dashboard/welcome/page.tsx`

- Added `searchParams` to accept `?new=true` query parameter
- Added redirect logic: If user has an active company AND is NOT creating a new one → Redirect to `/dashboard`
- Allows access when `?new=true` is present (user is adding a new company)

```typescript
// Check if user is explicitly creating a new company
const params = await searchParams;
const isCreatingNewCompany = params.new === "true";

// If user has an active company and is NOT explicitly creating a new one,
// redirect them to the main dashboard
if (hasActiveCompany && !isCreatingNewCompany && activeCompanyId) {
  console.log(`✅ User has active company - redirecting to dashboard`);
  redirect("/dashboard");
}
```

### 2. Updated OAuth Callback Redirect
**File:** `src/app/auth/callback/route.ts`

- After successful OAuth login, checks if user has an active company
- **Has company** → Redirect to `/dashboard`
- **No company** → Redirect to `/dashboard/welcome` (onboarding)

```typescript
// Check if user has an active company to determine redirect
const { data: hasCompany } = await supabase
  .from("team_members")
  .select("company_id")
  .eq("user_id", data.user.id)
  .eq("status", "active")
  .limit(1)
  .maybeSingle();

const redirectPath = hasCompany ? "/dashboard" : "/dashboard/welcome";
```

### 3. Updated Complete Profile Redirect
**File:** `src/actions/auth.ts` - `completeProfile` action

- After completing profile (post-OAuth), checks if user has an active company
- **Has company** → Redirect to `/dashboard`
- **No company** → Redirect to `/dashboard/welcome` (onboarding)

```typescript
// Check if user has an active company to determine redirect
const { data: hasCompany } = await adminClient
  .from("team_members")
  .select("company_id")
  .eq("user_id", userId)
  .eq("status", "active")
  .limit(1)
  .maybeSingle();

const redirectPath = hasCompany ? "/dashboard" : "/dashboard/welcome";
redirect(redirectPath);
```

### 4. Updated "Add New Company" Links
Added `?new=true` parameter to all links that create a new company:

**Files Updated:**
- `src/components/onboarding/onboarding-header-client.tsx` - Company switcher dropdown
- `src/components/layout/user-menu.tsx` - User menu dropdown
- `src/app/(dashboard)/dashboard/settings/subscriptions/page.tsx` - Add Organization button

**Before:**
```tsx
<Link href="/dashboard/welcome">Add new business</Link>
```

**After:**
```tsx
<Link href="/dashboard/welcome?new=true">Add new business</Link>
```

## User Flows

### Flow 1: New User Signs Up
```
1. Sign up with email/password or OAuth
2. Complete profile (if needed)
3. Redirect to /dashboard/welcome (no companies)
4. Complete onboarding
5. Redirect to /dashboard
```

### Flow 2: Existing User Logs In
```
1. Sign in with email/password or OAuth
2. Check: Has active company? YES
3. Redirect to /dashboard (their last active company)
4. User sees their dashboard immediately ✅
```

### Flow 3: Existing User Adds New Company
```
1. User is on /dashboard
2. Clicks "Add new business" in company switcher
3. Redirects to /dashboard/welcome?new=true
4. Onboarding page allows access (isCreatingNewCompany = true)
5. Complete onboarding for new company
6. Redirect to /dashboard with new company active
```

### Flow 4: Existing User Tries to Access Welcome Directly
```
1. User navigates to /dashboard/welcome (no ?new=true)
2. Check: Has active company? YES
3. Redirect to /dashboard ✅
4. User cannot accidentally re-enter onboarding
```

## Benefits

1. ✅ **Better UX** - Existing users go straight to their dashboard
2. ✅ **No confusion** - Users don't see onboarding unless they need it
3. ✅ **Multi-company support** - Users can still add new companies via `?new=true`
4. ✅ **Proper routing** - OAuth and profile completion redirect to the right place
5. ✅ **Prevents loops** - Users can't get stuck in onboarding

## Testing Checklist

- [ ] New user signs up → Goes to `/dashboard/welcome`
- [ ] New user completes onboarding → Goes to `/dashboard`
- [ ] Existing user logs in → Goes to `/dashboard` (skips welcome)
- [ ] Existing user clicks "Add new business" → Goes to `/dashboard/welcome?new=true`
- [ ] Existing user completes new company onboarding → Goes to `/dashboard` with new company
- [ ] Existing user tries to access `/dashboard/welcome` directly → Redirected to `/dashboard`
- [ ] OAuth login (new user) → Goes to `/dashboard/welcome`
- [ ] OAuth login (existing user) → Goes to `/dashboard`
- [ ] Complete profile (new user) → Goes to `/dashboard/welcome`
- [ ] Complete profile (existing user) → Goes to `/dashboard`

## Related Files

- `/src/app/(dashboard)/dashboard/welcome/page.tsx` - Welcome page with redirect logic
- `/src/app/auth/callback/route.ts` - OAuth callback with smart redirects
- `/src/actions/auth.ts` - Complete profile action with smart redirects
- `/src/components/onboarding/onboarding-header-client.tsx` - Company switcher
- `/src/components/layout/user-menu.tsx` - User menu
- `/src/app/(dashboard)/dashboard/settings/subscriptions/page.tsx` - Subscriptions page

