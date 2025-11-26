# Supabase Google OAuth Setup Guide

**Quick Reference**: How to configure Google OAuth in Supabase Dashboard

---

## 📋 Prerequisites

You already have:
- ✅ Google OAuth credentials created
- ✅ Code implementation complete
- ✅ Custom callback page created

**Now you need to**: Configure these credentials in Supabase Dashboard

---

## 🚀 Step-by-Step Configuration

### Step 1: Open Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/togejqdwggezkxahomeh
2. Click on **Authentication** in the left sidebar
3. Click on **Providers** tab

### Step 2: Enable Google Provider

1. Find **Google** in the providers list
2. Toggle the switch to **ON** (enabled)
3. The configuration form will appear

### Step 3: Add Google OAuth Credentials

Paste the following credentials into the form:

**Client ID**:
```
YOUR_CLIENT_ID.apps.googleusercontent.com
```

**Client Secret**:
```
YOUR_CLIENT_SECRET
```

### Step 4: Copy the Supabase Callback URL

Supabase will show you the callback URL:

```
https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback
```

**Important**: You need to add this to Google Cloud Console (next step)

### Step 5: Click "Save"

- Click the **Save** button in Supabase Dashboard
- Google OAuth is now enabled on Supabase side ✅

---

## 🔧 Configure Google Cloud Console

Now you need to add Supabase's callback URL to Google Cloud Console:

### Step 1: Go to Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. Click to edit it

### Step 2: Add Authorized Redirect URIs

Add these URLs to **Authorized redirect URIs**:

```
https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback
```

### Step 3: Add Authorized JavaScript Origins

Add these URLs to **Authorized JavaScript origins**:

**Production**:
```
https://togejqdwggezkxahomeh.supabase.co
```

**Development** (optional, for local testing):
```
http://localhost:3000
```

**Your Production Domain** (when deployed):
```
https://yourdomain.com
```

### Step 4: Save Changes

- Click **Save** in Google Cloud Console
- Wait 5-10 minutes for changes to propagate

---

## 🧪 Testing OAuth Flow

### Test in Development (localhost:3000)

1. Start your dev server: `pnpm dev`
2. Go to: http://localhost:3000/login
3. Click **"Login with Google"** button
4. Should redirect to Google consent screen
5. Approve permissions
6. Should redirect to custom `/auth/callback` page (branded loading screen)
7. Then automatically redirect to `/dashboard`

### Test in Production (after deployment)

1. Go to: https://yourdomain.com/login
2. Click **"Login with Google"** button
3. Same flow as development

### Expected Behavior

**Success Flow**:
1. Click "Login with Google"
2. Button shows spinner
3. Redirect to Google consent screen
4. User approves
5. Redirect to `/auth/callback` (custom branded page shows)
6. Redirect to `/dashboard`
7. User is logged in ✅

**Error Flow**:
1. If Google rejects: Error message shown on login page
2. If credentials wrong: Error message shown
3. User can try again

---

## 🔍 Troubleshooting

### "redirect_uri_mismatch" Error

**Cause**: Google Cloud Console doesn't have the Supabase callback URL

**Fix**:
1. Go to Google Cloud Console
2. Add: `https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback`
3. Save and wait 5-10 minutes

### "Invalid client" Error

**Cause**: Client ID or Client Secret is incorrect in Supabase

**Fix**:
1. Double-check credentials in Supabase Dashboard
2. Make sure you pasted the full Client ID and Secret
3. No extra spaces or characters

### OAuth Button Not Working

**Cause**: Supabase provider not enabled or credentials missing

**Fix**:
1. Go to Supabase Dashboard → Authentication → Providers
2. Verify Google is toggled ON
3. Verify credentials are saved
4. Click "Save" again

### Stuck on Callback Page

**Cause**: Route handler not processing code correctly

**Fix**:
1. Check browser console for errors
2. Check Supabase logs for auth errors
3. Verify user has internet connection
4. Try clearing cookies and trying again

---

## 📊 What You Just Configured

### Supabase Side ✅
- ✅ Google provider enabled
- ✅ Client ID configured
- ✅ Client Secret configured
- ✅ Callback URL generated: `https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback`

### Google Cloud Console ✅
- ✅ Authorized redirect URI added
- ✅ Authorized JavaScript origins added
- ✅ OAuth consent screen configured

### Your App ✅
- ✅ OAuth buttons with Google logo
- ✅ Server Action (`signInWithOAuth`)
- ✅ Custom callback page with branding
- ✅ Route handler (`/auth/callback/route.ts`)
- ✅ Automatic redirect to dashboard

---

## 🔒 Security Features

Your OAuth flow is protected by:

1. **Vercel BotID** - Invisible bot detection on OAuth buttons
2. **OAuth State Parameter** - Supabase automatically generates secure state (CSRF protection)
3. **HTTP-Only Cookies** - Session cookies cannot be accessed by JavaScript
4. **Secure Redirect URLs** - Only whitelisted URLs allowed
5. **Rate Limiting** - Prevents brute force attacks

---

## 🎉 You're Done!

Your Google OAuth is now fully configured and ready to use:

- ✅ Supabase Dashboard configured
- ✅ Google Cloud Console configured
- ✅ Custom branded callback page
- ✅ Professional OAuth buttons with logos
- ✅ Secure authentication flow
- ✅ Excellent user experience

### Next Steps

1. **Test the OAuth flow** in development
2. **Deploy to production** (Vercel)
3. **Test again in production**
4. **Consider adding more providers** (Facebook, GitHub, etc.)

---

**Questions or Issues?**

Refer to the main documentation:
- `GOOGLE_OAUTH_IMPLEMENTATION.md` - Complete implementation details
- `VERCEL_BOTID_IMPLEMENTATION.md` - Bot protection details
- `AUTH_SYSTEM_ANALYSIS.md` - Full auth system overview
