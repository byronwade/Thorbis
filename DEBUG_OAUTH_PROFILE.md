# Debugging OAuth Profile Completion Issue

## Issue
User `bcw1995@gmail.com` keeps seeing the "Complete your profile" page even though they claim to have an active account.

## What I Changed

### 1. Added Error Checking to `completeProfile` Action
**File:** `src/actions/auth.ts`

- Added proper error checking to the database update
- Added console logging to see what data is being saved
- Will now show specific error messages if the update fails

### 2. Added Logging to OAuth Callback
**File:** `src/app/auth/callback/route.ts`

- Logs what profile data is found in the database
- Shows whether phone/name are present or missing
- Logs the decision to redirect to complete-profile or dashboard

### 3. Added Logging to Complete Profile Page
**File:** `src/app/(auth)/complete-profile/page.tsx`

- Logs the user's profile data when the page loads
- Shows what fields are missing
- Logs when redirecting to dashboard vs showing form

## How to Debug

### Step 1: Check Vercel Logs
1. Go to Vercel dashboard
2. Navigate to your project logs
3. Sign in with Google as `bcw1995@gmail.com`
4. Look for these log entries:

```
📋 OAuth Callback - Profile check: {
  userId: "...",
  email: "bcw1995@gmail.com",
  hasProfile: true/false,
  phone: "..." or "MISSING",
  name: "..." or "MISSING",
  isComplete: true/false
}
```

### Step 2: Check Complete Profile Page Logs
If you're redirected to `/complete-profile`, look for:

```
📋 Complete Profile Page - User data: {
  userId: "...",
  email: "bcw1995@gmail.com",
  hasProfile: true/false,
  phone: "..." or "MISSING",
  name: "..." or "MISSING",
  avatar: "..." or "MISSING",
  isComplete: true/false
}
```

### Step 3: Fill Out the Form
If you see the form:
1. Fill in the phone number field
2. Submit the form
3. Look for this log entry:

```
✅ Profile updated for user ...: {"name":"...","phone":"...","avatar":"..."}
```

## Possible Root Causes

### Cause 1: Phone Number Not Saved
**Symptom:** Logs show `phone: "MISSING"` every time you log in

**Solution:** The phone number isn't being saved to the database. Check:
- Is there a Row Level Security (RLS) policy blocking the update?
- Is the `public.users` table missing the `phone` column?
- Is the service role key configured correctly?

### Cause 2: User Has Multiple Records
**Symptom:** Logs show `profileError: "Multiple rows returned"`

**Solution:** The user has duplicate records in the `public.users` table. Need to:
1. Find all records for `bcw1995@gmail.com`
2. Merge or delete duplicates
3. Keep only one record

### Cause 3: RLS Policy Blocking Read
**Symptom:** Logs show `profileError: "..." ` or `hasProfile: false`

**Solution:** The RLS policy on `public.users` is preventing the read. Check:
- Does the user have permission to read their own record?
- Is the service role key being used correctly?

### Cause 4: Stale Session/Cache
**Symptom:** Phone is saved but still redirected to complete-profile

**Solution:** Browser cache or session is stale. Try:
1. Clear browser cookies for `thorbis.com`
2. Sign out completely
3. Sign in again with Google

## Quick Fix Script

If you want to manually set the phone number for this user, run this SQL in Supabase:

```sql
-- Check current state
SELECT id, email, name, phone, avatar 
FROM public.users 
WHERE email = 'bcw1995@gmail.com';

-- If phone is missing, update it
UPDATE public.users 
SET phone = '8314280176'  -- Your actual phone number
WHERE email = 'bcw1995@gmail.com' 
  AND (phone IS NULL OR phone = '');

-- Verify the update
SELECT id, email, name, phone, avatar 
FROM public.users 
WHERE email = 'bcw1995@gmail.com';
```

## Next Steps

1. **Deploy these changes** to Vercel
2. **Sign in with Google** as `bcw1995@gmail.com`
3. **Check Vercel logs** for the debug output
4. **Share the logs** with me so I can see what's happening

The logs will tell us exactly why you're being redirected to the complete-profile page!

