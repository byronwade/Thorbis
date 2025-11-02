# Debug OAuth - Live Testing Instructions

**Status**: Ready to debug
**Date**: 2025-10-31

---

## 🎯 What We Know

**Error**: "An unexpected error occurred" when clicking "Login with Google"
**URL**: `http://localhost:3000/login`
**What's happening**: Exception being thrown in OAuth function

---

## 📋 Steps to Debug (Do This Now)

### Step 1: Open Browser Console

1. Go to: http://localhost:3000/login
2. Press **F12** to open DevTools
3. Click **Console** tab
4. Make sure "Preserve log" is checked ☑️

### Step 2: Click "Login with Google"

1. Click the "Login with Google" button
2. Watch the Console tab

### Step 3: Look for These Log Messages

You should see:

```javascript
🔵 Calling signInWithOAuth for provider: google
🔵 signInWithOAuth result: { ... }
```

**OR** if there's an error:

```javascript
❌ Caught exception in handleOAuthLogin: Error: ...
Error details: ...
```

---

## 🔍 What to Tell Me

After you click "Login with Google", copy and paste:

1. **Everything from the Console** (all the 🔵 and ❌ messages)
2. **The browser URL** (should still be `http://localhost:3000/login`)
3. **Any red error messages**

---

## 🎯 Most Likely Issues

### Issue 1: Supabase Not Configured

If you see:
```
❌ Supabase client not initialized
```

**Fix**: Check environment variables in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://togejqdwggezkxahomeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Issue 2: Google Provider Not Enabled in Supabase

If you see:
```
❌ OAuth error from Supabase: Provider not enabled
```

**Fix**:
1. Go to: https://supabase.com/dashboard/project/togejqdwggezkxahomeh
2. Navigate to: Authentication → Providers
3. Toggle **Google** provider ON
4. Add credentials:
   - Client ID: `YOUR_CLIENT_ID.apps.googleusercontent.com`
   - Client Secret: `YOUR_CLIENT_SECRET`
5. Click "Save"

### Issue 3: Invalid Credentials

If you see:
```
❌ OAuth error: Invalid client credentials
```

**Fix**: Double-check credentials in Supabase Dashboard match exactly

### Issue 4: Network Error

If you see:
```
❌ Failed to fetch
```

**Fix**: Check internet connection and Supabase status

---

## 🛠️ Quick Checks

### Check 1: Environment Variables

```bash
# Run this in terminal
cat .env.local | grep SUPABASE
```

Should show:
```
NEXT_PUBLIC_SUPABASE_URL=https://togejqdwggezkxahomeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Check 2: Dev Server Running

Make sure dev server is running:
```bash
pnpm dev
```

Should see:
```
✓ Starting...
✓ Ready in 2.5s
○ Compiling / ...
✓ Compiled / in 1.5s
```

### Check 3: Supabase Project Active

Go to: https://supabase.com/dashboard/project/togejqdwggezkxahomeh

Should see **green "Active"** status

---

## 📸 What Logs Look Like

### Success (What We Want to See)

```javascript
🔵 Calling signInWithOAuth for provider: google
🔵 signInWithOAuth result: { success: true }
// Then redirects to Google
```

### Error (What We're Debugging)

```javascript
🔵 Calling signInWithOAuth for provider: google
❌ Caught exception in handleOAuthLogin: Error: [actual error message]
Error details: [error message] [stack trace]
```

---

## 🎯 Next Steps Based on Logs

### If you see: "Supabase client not initialized"

Problem: Environment variables not loaded

**Fix**:
1. Check `.env.local` exists
2. Restart dev server: `pnpm dev`
3. Hard refresh browser: Ctrl+Shift+R

### If you see: "Provider not enabled"

Problem: Google OAuth not enabled in Supabase

**Fix**: Follow "Issue 2" above

### If you see: "redirect_uri_mismatch"

Problem: Google Cloud Console needs redirect URI

**Fix**: See `/docs/OAUTH_REDIRECT_URI_FIX.md`

### If you see: "Invalid credentials"

Problem: Wrong Client ID or Secret

**Fix**: Double-check Supabase Dashboard credentials

---

## 🆘 If Still Stuck

Send me:

1. **Full console output** (copy all 🔵 and ❌ messages)
2. **Contents of `.env.local`** (hide the anon key if sharing publicly)
3. **Screenshot of error**

---

## 📚 Related Docs

- `/docs/SUPABASE_OAUTH_SETUP.md` - Complete Supabase setup
- `/docs/OAUTH_REDIRECT_URI_FIX.md` - Fix redirect_uri_mismatch
- `/docs/OAUTH_TROUBLESHOOTING_COMPLETE.md` - All possible errors

---

**Remember**: Check the browser console! The logs will tell us exactly what's wrong. 🔍
