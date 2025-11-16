# Complete OAuth Troubleshooting Guide

**Last Updated**: 2025-10-31
**Status**: Comprehensive troubleshooting for all OAuth issues

---

## 🔍 Common Issues & Solutions

### Issue 1: Error 400: redirect_uri_mismatch

**Error Message**:
```
Access blocked: Thorbis's request is invalid
Error 400: redirect_uri_mismatch
```

**Cause**: Google Cloud Console doesn't have the Supabase redirect URI

**Solution**: Add redirect URI to Google Cloud Console

#### Step-by-Step Fix:

1. **Go to Google Cloud Console**:
   - https://console.cloud.google.com/apis/credentials

2. **Find Your OAuth 2.0 Client ID**:
   - Look for: `117851824976-pdugr7pr13jr4jf4iparjrm7l42lqn1c`
   - Click on it to edit

3. **Scroll to "Authorized redirect URIs"**

4. **Click "ADD URI"**

5. **Paste This EXACT URI** (no spaces, no trailing slash):
   ```
   https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback
   ```

6. **Scroll to "Authorized JavaScript origins"**

7. **Click "ADD URI"** and add:
   ```
   https://togejqdwggezkxahomeh.supabase.co
   ```

8. **Add localhost for testing**:
   ```
   http://localhost:3000
   ```

9. **Click "SAVE"** at the bottom

10. **Wait 5-10 minutes** for Google to propagate changes

11. **Test again** - Clear browser cache first!

---

### Issue 2: Error 401: invalid_client

**Error Message**:
```
Error 401: invalid_client
```

**Cause**: Client ID or Client Secret is incorrect in Supabase

**Solution**: Verify credentials in Supabase Dashboard

#### Step-by-Step Fix:

1. **Go to Supabase Dashboard**:
   - https://supabase.com/dashboard/project/togejqdwggezkxahomeh
   - Navigate to: Authentication → Providers

2. **Click on Google provider**

3. **Verify Client ID is EXACTLY**:
   ```
   YOUR_CLIENT_ID.apps.googleusercontent.com
   ```

4. **Verify Client Secret is EXACTLY**:
   ```
   YOUR_CLIENT_SECRET
   ```

5. **Make sure Google provider is ENABLED** (toggle ON)

6. **Click "Save"**

7. **Test again**

---

### Issue 3: Infinite Redirect Loop

**Symptoms**:
- Page keeps redirecting
- Never reaches dashboard
- Stuck on `/auth-processing` page

**Cause**: Session not being set properly

**Solution**: Check Supabase cookies and session

#### Step-by-Step Fix:

1. **Open Browser DevTools**:
   - Press F12
   - Go to "Application" tab
   - Click "Cookies" in left sidebar

2. **Check for Supabase cookies**:
   - Should see cookies like: `sb-togejqdwggezkxahomeh-auth-token`
   - If missing, session isn't being created

3. **Clear all cookies**:
   - Right-click on domain → Clear
   - Close DevTools

4. **Check Supabase Logs**:
   - Go to: https://supabase.com/dashboard/project/togejqdwggezkxahomeh
   - Navigate to: Logs → Auth Logs
   - Look for errors during OAuth flow

5. **Verify environment variables** in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://togejqdwggezkxahomeh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

6. **Test again**

---

### Issue 4: "Google hasn't verified this app"

**Warning Message**:
```
Google hasn't verified this app
This app hasn't been verified by Google yet.
```

**Cause**: OAuth app is in testing mode

**Solution**: This is NORMAL for development - just click "Continue"

#### What to Do:

1. **Click "Advanced" link** at the bottom
2. **Click "Go to Thorbis (unsafe)"**
3. **Approve permissions**

This warning is expected during development. To remove it:

1. **Publish OAuth Consent Screen**:
   - Go to: https://console.cloud.google.com/apis/credentials/consent
   - Click "PUBLISH APP"
   - Submit for verification (takes days/weeks)

OR

2. **Add test users** (keeps it in testing mode):
   - Go to: https://console.cloud.google.com/apis/credentials/consent
   - Scroll to "Test users"
   - Add your email addresses
   - No warning for test users

---

### Issue 5: "Access blocked: This app's request is invalid"

**Error Message**:
```
Access blocked: This app's request is invalid
The OAuth client was not found
```

**Cause**: Google OAuth Client doesn't exist or was deleted

**Solution**: Verify OAuth Client exists

#### Step-by-Step Fix:

1. **Go to Google Cloud Console**:
   - https://console.cloud.google.com/apis/credentials

2. **Check if you see**:
   - Client ID: `117851824976-pdugr7pr13jr4jf4iparjrm7l42lqn1c`

3. **If missing**: OAuth client was deleted
   - You'll need to create a new one
   - Update Client ID and Secret in Supabase

4. **If present**: Click to edit and verify redirect URIs

---

### Issue 6: Console Errors (Harmless)

**Messages You Can Ignore**:

```javascript
// ✅ IGNORE - Just a suggestion
Download the React DevTools for a better development experience

// ✅ IGNORE - This is good! HMR working
[HMR] connected

// ✅ IGNORE - Navigating to Google (this is correct!)
Navigated to https://accounts.google.com/o/oauth2/v2/auth?...
```

**Messages That Matter**:

```javascript
// ❌ ACTION NEEDED - Supabase error
AuthApiError: Invalid login credentials

// ❌ ACTION NEEDED - Network error
Failed to fetch

// ❌ ACTION NEEDED - CORS error
Access to fetch blocked by CORS policy
```

---

### Issue 7: Nothing Happens When Clicking Button

**Symptoms**:
- Click "Login with Google"
- Button shows spinner
- Nothing happens
- No redirect

**Cause**: Supabase client not initialized or network error

**Solution**: Check browser console for errors

#### Step-by-Step Fix:

1. **Open Browser Console** (F12)

2. **Click "Login with Google"**

3. **Check for errors**:
   - `Supabase client not initialized` → Environment variables wrong
   - `Failed to fetch` → Network issue
   - `CORS error` → Supabase configuration issue

4. **Verify Supabase is running**:
   - Go to: https://supabase.com/dashboard/project/togejqdwggezkxahomeh
   - Should say "Active" (green)

5. **Check environment variables**:
   ```bash
   cat .env.local | grep SUPABASE
   ```

   Should show:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://togejqdwggezkxahomeh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

6. **Restart dev server**:
   ```bash
   pnpm dev
   ```

---

### Issue 8: "User already registered" Error

**Error Message**:
```
User already registered
```

**Cause**: Trying to sign up with email that already exists

**Solution**: Use login instead of signup, or use password reset

#### Options:

1. **Use Login Instead**:
   - Go to `/login` page
   - Click "Login with Google"
   - Uses existing account

2. **Reset Password** (if using email/password):
   - Click "Forgot password?"
   - Enter email
   - Check email for reset link

3. **Delete Account** (if needed):
   - Go to Supabase Dashboard
   - Navigate to: Authentication → Users
   - Find user and delete

---

## 🧪 Complete Test Checklist

Use this checklist to verify everything is working:

### Pre-Test Setup

- [ ] **Google Cloud Console configured**:
  - [ ] Redirect URI added: `https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback`
  - [ ] JavaScript origin added: `https://togejqdwggezkxahomeh.supabase.co`
  - [ ] Localhost added: `http://localhost:3000`
  - [ ] Changes saved
  - [ ] Waited 10+ minutes

- [ ] **Supabase Dashboard configured**:
  - [ ] Google provider enabled
  - [ ] Client ID entered correctly
  - [ ] Client Secret entered correctly
  - [ ] Changes saved

- [ ] **Environment variables correct**:
  - [ ] `.env.local` exists
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` set
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
  - [ ] `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

- [ ] **Dev server running**:
  - [ ] `pnpm dev` executed
  - [ ] No build errors
  - [ ] Server listening on port 3000

### Test Flow

- [ ] **Navigate to login page**:
  - [ ] Go to: http://localhost:3000/login
  - [ ] Page loads without errors

- [ ] **Click "Login with Google"**:
  - [ ] Button shows Google logo
  - [ ] Button shows spinner on click
  - [ ] Redirects to Google consent screen

- [ ] **Google consent screen**:
  - [ ] Shows app name "Thorbis"
  - [ ] Shows email and profile scopes
  - [ ] Can select Google account

- [ ] **Approve permissions**:
  - [ ] Click "Continue" or "Allow"
  - [ ] No error 400 or 401

- [ ] **Callback processing**:
  - [ ] Redirects to `/auth-processing` page
  - [ ] Shows Thorbis logo
  - [ ] Shows loading spinner
  - [ ] Shows progress steps

- [ ] **Dashboard redirect**:
  - [ ] Automatically redirects to `/dashboard`
  - [ ] Within 1-3 seconds
  - [ ] No infinite loop

- [ ] **Logged in state**:
  - [ ] Dashboard page loads
  - [ ] User info visible
  - [ ] Can access protected routes

### Post-Test Verification

- [ ] **Check browser cookies**:
  - [ ] Supabase auth cookies set
  - [ ] `sb-togejqdwggezkxahomeh-auth-token` exists

- [ ] **Check Supabase Dashboard**:
  - [ ] Go to: Authentication → Users
  - [ ] New user created (if first time)
  - [ ] Provider shows as "google"

- [ ] **Test logout**:
  - [ ] Click logout button
  - [ ] Redirects to login page
  - [ ] Cookies cleared

---

## 🔧 Debug Tools

### Check OAuth Flow in DevTools

1. **Open Network Tab** (F12 → Network)

2. **Click "Login with Google"**

3. **Look for these requests**:
   ```
   ✅ POST /api/auth/signin (Status: 200)
   ✅ GET https://accounts.google.com/o/oauth2/v2/auth (Status: 302)
   ✅ GET /auth/callback?code=... (Status: 302)
   ✅ GET /auth-processing (Status: 200)
   ✅ GET /dashboard (Status: 200)
   ```

4. **Check redirect parameters**:
   - Click on Google OAuth request
   - Look at "Query String Parameters"
   - Verify `redirect_uri` matches what's in Google Console

### Check Supabase Logs

1. **Go to Supabase Dashboard**:
   - https://supabase.com/dashboard/project/togejqdwggezkxahomeh

2. **Navigate to Logs → Auth Logs**

3. **Look for**:
   ```
   ✅ "OAuth login initiated"
   ✅ "OAuth callback received"
   ✅ "User signed in"
   ❌ "Invalid credentials"
   ❌ "OAuth error"
   ```

### Check Environment Variables

```bash
# Run this in project root
echo "Supabase URL: $NEXT_PUBLIC_SUPABASE_URL"
echo "Site URL: $NEXT_PUBLIC_SITE_URL"

# Should output:
# Supabase URL: https://togejqdwggezkxahomeh.supabase.co
# Site URL: http://localhost:3000
```

---

## 📚 Quick Reference

### Your Configuration

**Supabase Project**: `togejqdwggezkxahomeh`

**Supabase URL**:
```
https://togejqdwggezkxahomeh.supabase.co
```

**OAuth Callback**:
```
https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback
```

**Google Client ID**:
```
YOUR_CLIENT_ID.apps.googleusercontent.com
```

**Google Client Secret**:
```
YOUR_CLIENT_SECRET
```

### Important URLs

**Google Cloud Console**:
- https://console.cloud.google.com/apis/credentials

**Supabase Dashboard**:
- https://supabase.com/dashboard/project/togejqdwggezkxahomeh

**OAuth Consent Screen**:
- https://console.cloud.google.com/apis/credentials/consent

---

## 🆘 Still Having Issues?

### Provide This Information:

1. **Exact error message** (screenshot or text)
2. **Browser console output** (F12 → Console tab)
3. **Network tab** (F12 → Network → filter by "auth")
4. **Which step fails**:
   - Button click?
   - Google redirect?
   - Callback processing?
   - Dashboard redirect?

### Common Solutions:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Try incognito mode** (Ctrl+Shift+N)
3. **Wait 10 minutes** after Google Cloud Console changes
4. **Restart dev server** (`pnpm dev`)
5. **Check Supabase is active** (Dashboard should show green)

---

**Remember**: Console warnings like "React DevTools" and "HMR connected" are NORMAL and can be ignored!
