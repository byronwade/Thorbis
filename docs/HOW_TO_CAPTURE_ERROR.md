# How to Capture Fast Redirect Errors

**Problem**: Error appears then immediately redirects
**Solution**: Preserve browser log to see the error

---

## 🎯 Quick Fix - Preserve Log

### Method 1: Preserve Log in Chrome/Edge

1. **Open DevTools** (F12)

2. **Go to Console tab**

3. **Check "Preserve log"** checkbox:
   ```
   ┌─────────────────────────────────────┐
   │ Console                             │
   │ ☑ Preserve log  [Filter] [Clear]   │  ← Check this!
   └─────────────────────────────────────┘
   ```

4. **Click "Login with Google"**

5. **Error will stay in console** even after redirect

6. **Take screenshot** or copy the error

---

## 🔍 Method 2: Network Tab (Catch Redirect)

1. **Open DevTools** (F12)

2. **Go to Network tab**

3. **Check "Preserve log"**:
   ```
   ┌─────────────────────────────────────┐
   │ Network                             │
   │ ☑ Preserve log  [Filter]            │  ← Check this!
   └─────────────────────────────────────┘
   ```

4. **Click "Login with Google"**

5. **Look for red/failed requests**

6. **Click on the failed request**

7. **Check "Response" tab** for error message

---

## 🎥 Method 3: Record Network Activity

1. **Open DevTools** (F12)

2. **Go to Network tab**

3. **Click red record button** (if not already recording)

4. **Click "Login with Google"**

5. **Let it redirect**

6. **Scroll through Network log** to find errors

7. **Look for Status codes**:
   - `400` = Bad Request
   - `401` = Unauthorized
   - `403` = Forbidden
   - `404` = Not Found
   - `500` = Server Error

---

## 📋 What to Look For

### In Console Tab

Look for error messages like:

```javascript
❌ AuthApiError: Invalid credentials
❌ Error 400: redirect_uri_mismatch
❌ Error 401: invalid_client
❌ Failed to fetch
❌ CORS error
```

### In Network Tab

Look for requests with red status codes:

```
Name                          Status    Type
────────────────────────────────────────────
signin                        200       fetch  ✅
auth/callback                 302       redirect  ✅
https://accounts.google.com   400       redirect  ❌
```

---

## 🐛 Common Fast Errors

### Error 400: redirect_uri_mismatch

**What you might see**:
```
Access blocked: Thorbis's request is invalid
Error 400: redirect_uri_mismatch
```

**Quick fix**:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Add to Authorized redirect URIs:
   ```
   https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback
   ```
3. Save and wait 10 minutes

### Error 401: invalid_client

**What you might see**:
```
Error 401: invalid_client
```

**Quick fix**:
1. Go to Supabase Dashboard
2. Check Google OAuth credentials are correct
3. Re-save them

### Infinite redirect loop

**What you might see**:
- `/auth-processing` → `/auth-processing` → `/auth-processing` (looping)

**Quick fix**:
1. Clear browser cookies
2. Check Supabase session is being created

---

## 🎯 Step-by-Step Debug Process

### 1. Enable Preserve Log

```
DevTools → Console → ☑ Preserve log
DevTools → Network → ☑ Preserve log
```

### 2. Clear Logs

```
Console: Click "Clear console" 🗑️
Network: Click "Clear" 🗑️
```

### 3. Start Fresh

```
1. Close all browser tabs
2. Open new incognito window (Ctrl+Shift+N)
3. Open DevTools (F12)
4. Check "Preserve log" in both Console and Network
5. Go to http://localhost:3000/login
```

### 4. Trigger Error

```
1. Click "Login with Google"
2. Watch Console and Network tabs
3. Don't close DevTools!
```

### 5. Capture Information

```
Console tab:
- Screenshot any red error messages
- Copy error text

Network tab:
- Find request with status 400/401/500
- Click on it
- Check "Response" tab
- Screenshot or copy error
```

---

## 📸 What to Send Me

Once you capture the error, send:

1. **Screenshot of Console** with error
2. **Screenshot of Network tab** showing failed request
3. **Text of error message** (if you can copy it)

Example:
```
Console:
Error 400: redirect_uri_mismatch
The redirect URI in the request: https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback
does not match the ones authorized for the OAuth client.

Network:
GET https://accounts.google.com/o/oauth2/v2/auth
Status: 400
```

---

## 💡 Pro Tip: Slow Down the Redirect

If you want to see the error page without it redirecting, you can:

### Temporarily Disable JavaScript

1. **Open DevTools** (F12)
2. **Press Ctrl+Shift+P** (Command palette)
3. **Type**: "Disable JavaScript"
4. **Select**: "Disable JavaScript"
5. **Click "Login with Google"**
6. **Error page will show but won't redirect**
7. **Take screenshot**
8. **Re-enable JavaScript** when done

---

## 🔍 Most Likely Error

Based on what you described, you're probably getting:

```
Error 400: redirect_uri_mismatch
```

This means you need to add the redirect URI to Google Cloud Console:

**Quick Fix**:
1. https://console.cloud.google.com/apis/credentials
2. Find OAuth client: `117851824976-pdugr7pr13jr4jf4iparjrm7l42lqn1c`
3. Add to Authorized redirect URIs:
   ```
   https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback
   ```
4. Add to Authorized JavaScript origins:
   ```
   https://togejqdwggezkxahomeh.supabase.co
   http://localhost:3000
   ```
5. Click "SAVE"
6. Wait 10 minutes
7. Try again

---

**Try Method 1 (Preserve Log) first - it's the easiest way to capture fast errors!**
