# OAuth Redirect URI Mismatch - Fix Guide

**Error**: `Error 400: redirect_uri_mismatch`
**Status**: ⚠️ NEEDS CONFIGURATION

---

## ❌ The Problem

When you click "Login with Google", you get:

```
Access blocked: Thorbis's request is invalid

Error 400: redirect_uri_mismatch
```

**Why?** The redirect URI that Supabase is sending to Google doesn't match the authorized redirect URIs in your Google Cloud Console.

---

## ✅ The Fix (5 Minutes)

### Step 1: Get Your Supabase Redirect URI

Your Supabase OAuth callback URL is:

```
https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback
```

This is what Supabase sends to Google when initiating OAuth.

### Step 2: Update Google Cloud Console

1. **Go to Google Cloud Console**:
   - https://console.cloud.google.com/apis/credentials

2. **Find Your OAuth 2.0 Client ID**:
   - Look for: `YOUR_CLIENT_ID.apps.googleusercontent.com`
   - Click on it to edit

3. **Scroll to "Authorized redirect URIs"**

4. **Add This Exact URI** (must match exactly):
   ```
   https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback
   ```

5. **Also Add** (for development - optional):
   ```
   http://localhost:3000/auth/callback
   ```

6. **Scroll to "Authorized JavaScript origins"**

7. **Add These URIs**:
   ```
   https://togejqdwggezkxahomeh.supabase.co
   http://localhost:3000
   ```

8. **Click "SAVE"** at the bottom

9. **Wait 5-10 minutes** for Google to propagate changes

---

## 🧪 Test After Fixing

### After 5-10 Minutes:

1. Go to: http://localhost:3000/login
2. Click "Login with Google"
3. Should now work! ✅

### Expected Flow:

1. Click "Login with Google"
2. Redirect to Google consent screen
3. See your app name: "Thorbis"
4. Approve permissions
5. Redirect to your custom branded `/auth-processing` page
6. Auto-redirect to `/dashboard`
7. Logged in successfully ✅

---

## 📋 Checklist

Use this checklist to verify your Google Cloud Console configuration:

### OAuth 2.0 Client ID Settings

- [ ] **Client ID**: `YOUR_CLIENT_ID.apps.googleusercontent.com`
- [ ] **Client Secret**: `YOUR_CLIENT_SECRET`

### Authorized Redirect URIs (Must Include)

- [ ] `https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback` ← **CRITICAL**
- [ ] `http://localhost:3000/auth/callback` (optional, for local testing)

### Authorized JavaScript Origins (Must Include)

- [ ] `https://togejqdwggezkxahomeh.supabase.co` ← **CRITICAL**
- [ ] `http://localhost:3000` (optional, for local testing)

### OAuth Consent Screen

- [ ] **App name**: Set to "Thorbis"
- [ ] **User support email**: Your email
- [ ] **Developer contact email**: Your email
- [ ] **Scopes**: Email and profile (basic)

---

## 🔍 Common Mistakes

### ❌ Wrong Redirect URI

**Wrong**:
```
https://togejqdwggezkxahomeh.supabase.co/auth/callback  ❌ Missing /v1/
http://togejqdwggezkxahomeh.supabase.co/auth/v1/callback  ❌ HTTP instead of HTTPS
https://supabase.co/auth/v1/callback  ❌ Wrong domain
```

**Correct**:
```
https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback  ✅
```

### ❌ Trailing Slashes

Make sure there's NO trailing slash:

**Wrong**:
```
https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback/  ❌
```

**Correct**:
```
https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback  ✅
```

### ❌ Copy-Paste Errors

- No extra spaces before or after the URI
- Must be exact match (case-sensitive)
- Must include `https://` prefix

---

## 📸 Visual Guide

### Google Cloud Console - Where to Add URIs

```
┌─────────────────────────────────────────────────┐
│  OAuth 2.0 Client ID                            │
├─────────────────────────────────────────────────┤
│                                                 │
│  Application type: Web application              │
│                                                 │
│  Name: [Your OAuth Client Name]                 │
│                                                 │
│  Authorized JavaScript origins                  │
│  ┌─────────────────────────────────────────┐   │
│  │ https://togejqdwggezkxahomeh.supabase.co│   │
│  │ http://localhost:3000                    │   │
│  └─────────────────────────────────────────┘   │
│  + Add URI                                      │
│                                                 │
│  Authorized redirect URIs                       │
│  ┌─────────────────────────────────────────┐   │
│  │ https://togejqdwggezkxahomeh.supabase.co│   │
│  │ /auth/v1/callback                        │   │
│  │                                          │   │
│  │ http://localhost:3000/auth/callback      │   │
│  └─────────────────────────────────────────┘   │
│  + Add URI                                      │
│                                                 │
│  [SAVE]  [CANCEL]                               │
└─────────────────────────────────────────────────┘
```

---

## 🆘 Still Not Working?

### If error persists after 10 minutes:

1. **Double-check the URI** - Must match EXACTLY
2. **Clear browser cache** - Old OAuth tokens might be cached
3. **Try incognito mode** - Eliminates cache issues
4. **Check Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard/project/togejqdwggezkxahomeh
   - Go to: Authentication → Providers → Google
   - Verify it's enabled and credentials are correct

5. **Verify in Google Cloud Console**:
   - OAuth consent screen is published (not in testing mode)
   - Your email is added as a test user (if in testing mode)

### Debug Steps

**Check what URI Supabase is sending**:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "Login with Google"
4. Look at the redirect URL
5. Check the `redirect_uri` parameter
6. It should be: `https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback`

---

## 📚 Related Documentation

- `GOOGLE_OAUTH_IMPLEMENTATION.md` - Complete OAuth implementation
- `SUPABASE_OAUTH_SETUP.md` - Step-by-step Supabase setup
- `OAUTH_CALLBACK_FIX.md` - Build error resolution

---

## 🎯 Quick Reference

**Your Supabase Project**: `togejqdwggezkxahomeh`

**Supabase OAuth Callback**:
```
https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback
```

**Google OAuth Client ID**:
```
YOUR_CLIENT_ID.apps.googleusercontent.com
```

**What to Add to Google Cloud Console**:

1. **Authorized redirect URIs**:
   - `https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback`

2. **Authorized JavaScript origins**:
   - `https://togejqdwggezkxahomeh.supabase.co`

---

**Status**: ⚠️ Requires Google Cloud Console Configuration
**Time to Fix**: 5 minutes + 5-10 minute propagation delay
**Difficulty**: Easy - Just adding URIs to Google Cloud Console
