# OAuth Profile Completion Flow

## Overview

When users sign up or log in with Google OAuth, they may be missing required information (like phone number) that we need for the platform to function properly. This document describes the profile completion flow that ensures all users have the necessary data.

## Flow Diagram

```
User clicks "Sign in with Google"
           ↓
Google OAuth authentication
           ↓
Supabase authenticates user
    ├─ Existing user → Sign in
    └─ New user → Create account
           ↓
Redirect to /auth/callback
           ↓
Check if profile is complete
    ├─ YES → Redirect to /dashboard/welcome
    └─ NO  → Redirect to /complete-profile
              ↓
         User fills in missing fields:
         - Phone number (required)
         - Full name (if missing)
         - Profile photo (optional)
              ↓
         Submit form
              ↓
         Update user profile & metadata
              ↓
         Redirect to /dashboard/welcome
```

## Required Fields

After OAuth login, we check if the user has:

1. **Phone number** - Required for:
   - SMS notifications
   - MFA codes
   - Dispatch alerts
   - Emergency contact

2. **Full name** - Required for:
   - Profile display
   - Team member identification
   - Communication personalization

## Implementation Details

### 1. Auth Callback Route (`/app/auth/callback/route.ts`)

After successful OAuth authentication, we check if the user profile is complete:

```typescript
// Check if user profile is complete
if (data.user) {
  const { data: profile } = await supabase
    .from("users")
    .select("phone, name")
    .eq("id", data.user.id)
    .single();

  // If missing required fields, redirect to complete profile
  if (!profile?.phone || !profile?.name) {
    return NextResponse.redirect(
      `${requestUrl.origin}/complete-profile`
    );
  }
}
```

### 2. Complete Profile Page (`/app/(auth)/complete-profile/page.tsx`)

Server component that:
- Checks authentication status
- Fetches existing user data
- Determines which fields are missing
- Redirects to dashboard if profile is already complete

### 3. Complete Profile Form (`/components/features/auth/complete-profile-form.tsx`)

Client component that:
- Shows only missing required fields
- Provides helpful context for each field
- Validates phone number format
- Supports optional avatar upload
- Matches the design of login/register pages

### 4. Complete Profile Action (`/actions/auth.ts`)

Server action that:
- Validates input data
- Normalizes phone number
- Uploads avatar to Supabase Storage (if provided)
- Updates `public.users` table
- Updates `auth.users` metadata
- Redirects to onboarding

## User Experience

### For Existing Users (Returning)

Users who already have an account with complete profile:
1. Click "Sign in with Google"
2. Authenticate with Google
3. Supabase recognizes existing account and signs them in
4. Immediately redirected to dashboard

### For Existing Users with Incomplete Profile

Users who created an account but didn't complete their profile:
1. Click "Sign in with Google"
2. Authenticate with Google
3. Supabase signs them in
4. Redirected to `/complete-profile` to fill in missing fields
5. Complete profile and continue to dashboard

### For New Users with Complete Google Profile

If Google provides name and phone number:
1. Click "Sign in with Google"
2. Authenticate with Google
3. Supabase creates new account
4. Immediately redirected to dashboard/onboarding

### For New Users with Incomplete Google Profile

If Google doesn't provide phone number:
1. Click "Sign in with Google"
2. Authenticate with Google
3. Supabase creates new account
4. Redirected to `/complete-profile`
5. See friendly message: "We need a few more details to get your account set up"
6. Fill in missing information:
   - Phone number (with helpful text: "We'll text urgent dispatch alerts and MFA codes here")
   - Optionally upload profile photo
7. Click "Continue to Thorbis"
8. Redirected to onboarding where company details are collected

## Phone Number Validation

### Client-Side
- Input pattern: `^[0-9+()\\s-]{10,}$`
- Input mode: `tel` (shows numeric keyboard on mobile)
- Helper text explains why we need it

### Server-Side
- Strip all non-numeric characters
- Ensure at least 10 digits
- Store normalized format in database

## Security Considerations

1. **Authentication Required** - Page checks for valid session
2. **Service Role for Updates** - Uses service role client to bypass RLS
3. **Input Validation** - Server-side validation of all fields
4. **Avatar Upload** - Size limit (5MB) and type validation (JPG, PNG, WebP)

## Database Schema

### `public.users` Table

Required columns:
- `id` (uuid) - Primary key, references auth.users
- `name` (text) - User's full name
- `phone` (text) - Normalized phone number
- `avatar` (text) - URL to profile image (optional)

### `auth.users.user_metadata`

Synced metadata:
- `name` - User's full name
- `phone` - Phone number
- `avatarUrl` - Avatar URL (optional)

**Note:** Company name is collected during the onboarding flow, not in profile completion.

## Testing Checklist

- [ ] OAuth login with complete Google profile → Direct to dashboard
- [ ] OAuth login without phone → Redirect to complete-profile
- [ ] Complete profile form validates phone number
- [ ] Complete profile form uploads avatar successfully
- [ ] Complete profile updates both users table and auth metadata
- [ ] Complete profile redirects to dashboard after submission
- [ ] Direct access to /complete-profile when already complete → Redirect to dashboard
- [ ] Direct access to /complete-profile when not authenticated → Redirect to login

## Future Enhancements

1. **Phone Verification** - Send SMS verification code to confirm phone number
2. **Import from Google** - Try to fetch additional data from Google APIs
3. **Social Profiles** - Allow importing from LinkedIn, etc.
4. **Smart Defaults** - Pre-populate fields from Google profile data when available

## Related Files

- `/src/app/(auth)/complete-profile/page.tsx` - Server component
- `/src/components/features/auth/complete-profile-form.tsx` - Client form
- `/src/actions/auth.ts` - `completeProfile()` server action
- `/src/app/auth/callback/route.ts` - OAuth callback with profile check
- `/src/lib/storage/upload.ts` - Avatar upload utilities

## Support

If users have issues completing their profile:
1. Check Supabase logs for errors
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is configured
3. Check Storage bucket permissions for avatars
4. Verify RLS policies on `users` table

