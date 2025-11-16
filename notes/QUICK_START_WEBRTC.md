# 🚀 Quick Start: Fix Telnyx WebRTC Calling

## ✅ What's Been Done

1. ✅ Diagnosed the issue - API credentials work, but WebRTC needs proper SIP connection
2. ✅ Created test script to verify configuration
3. ✅ Updated code to support static WebRTC credentials
4. ✅ Added fallback to dynamic credentials

---

## 🎯 What You Need To Do

### Option 1: Quick Fix (5 minutes) - Recommended

**Step 1:** Create SIP Connection in Telnyx Portal

1. Go to: https://portal.telnyx.com
2. Navigate to: **Voice → Connections**
3. Click: **"Create Connection"**
4. Select: **"SIP Connection"**
5. Fill in:
   - Connection Name: `WebRTC Calling`
   - ✅ **Enable WebRTC**: YES (CRITICAL!)
   - Authentication: Credential-based

6. Create credentials:
   - Username: `webrtc_production`
   - Password: [Click "Generate" to create a strong password]
   - **SAVE THESE CREDENTIALS!** You'll need them in the next step.

7. Click **"Create Connection"**

8. Assign your phone numbers to this connection:
   - Go to: **Numbers → My Numbers**
   - Click on each number
   - Change "Connection" to "WebRTC Calling"
   - Save

**Step 2:** Add credentials to your `.env.local` file

```bash
# Add these two lines to your .env.local file:
TELNYX_WEBRTC_USERNAME=webrtc_production
TELNYX_WEBRTC_PASSWORD=paste-the-generated-password-here
```

**Step 3:** Restart your dev server

```bash
# Stop the current server (Ctrl+C or Cmd+C)
# Then start it again:
npm run dev
```

**Step 4:** Test the connection

1. Open your app: http://localhost:3000
2. Click the phone icon
3. Check the browser console - you should see:
   ```
   [getWebRTCCredentials] Using static credentials
   [useTelnyxWebRTC] ✅ Telnyx WebRTC client ready!
   ```

4. The status should show green "Ready"
5. Try making a test call!

---

### Option 2: Alternative - Use Dynamic Credentials (Not Recommended)

If you can't create a SIP connection (maybe account permissions), the code will automatically fall back to dynamic credentials. However, these may not work reliably because they lack proper SIP configuration.

**Symptoms of dynamic credentials not working:**
- Console shows: "Dynamic credentials may not work without proper SIP connection"
- Connection fails with WebRTC errors
- Status shows "Error" or stays on "Connecting"

**If this happens, you MUST use Option 1 above.**

---

## 🔍 Troubleshooting

### Problem: "TELNYX_WEBRTC_USERNAME or TELNYX_WEBRTC_PASSWORD not configured"

**Solution:** You haven't added the environment variables yet. Follow Step 2 above.

---

### Problem: Still showing "Connecting..." and never connects

**Check these:**

1. **Browser Console** - Look for error messages
   ```
   Press F12 → Console tab
   ```

2. **Verify credentials in Telnyx Portal**
   - Go to: Voice → Connections → WebRTC Calling
   - Check that it shows "Active"
   - Verify the username matches your `.env.local`

3. **Check phone number assignment**
   - Go to: Numbers → My Numbers
   - Each number should show "WebRTC Calling" as the connection

4. **Firewall/Network**
   - Corporate firewalls often block WebRTC
   - Try from a different network (home internet, phone hotspot)
   - Check if UDP ports 3478-3479 are open

---

### Problem: "Invalid credentials" or authentication error

**Solution:**

1. **Verify password** - Make sure you copied it correctly
2. **Check for extra spaces** - No spaces before/after the credentials
3. **Regenerate password** in Telnyx Portal if needed

---

### Problem: Can dial but no audio

**Solution:**

1. **Check microphone permissions** - Browser should ask for mic access
2. **Check audio devices** - Make sure speakers/headphones are connected
3. **Check codec support** - Some browsers need specific codecs enabled

---

## 📊 Expected Console Output

### ✅ Success (What you want to see):

```
[PhoneDropdown] Loading WebRTC credentials...
[getWebRTCCredentials] Using static credentials
[PhoneDropdown] Credentials result: { success: true, credential: {...} }
[PhoneDropdown] Setting credentials: { username: "webrtc_production", hasPassword: true }
[useTelnyxWebRTC] Attempting to connect... { username: "webrtc_production", hasPassword: true }
SDK version: 2.25.2
[useTelnyxWebRTC] Client initialized, calling connect...
[useTelnyxWebRTC] ✅ Telnyx WebRTC client ready!
[PhoneDropdown] WebRTC state: { isConnected: true, isConnecting: false, ... }
```

### ❌ Failure (Dynamic credentials, doesn't work):

```
[getWebRTCCredentials] Static credentials not found, generating dynamic credentials
[getWebRTCCredentials] ⚠️  Note: Dynamic credentials may not work without proper SIP connection
[generateWebRTCToken] Starting credential generation for: user@example.com
[useTelnyxWebRTC] ❌ Telnyx WebRTC error: [error object]
```

---

## 🆘 Still Need Help?

If you're still having issues, please share:

1. **Console output** - All logs from opening the phone dropdown
2. **Network tab** - Filter by "telnyx" and show any 401/403 errors
3. **Telnyx Portal screenshots** - Show the SIP connection settings
4. **Environment check** - Run this command:
   ```bash
   # Check if variables are set (won't show values)
   cat .env.local | grep TELNYX_WEBRTC
   ```

---

## 📚 Detailed Documentation

For more detailed information, see:
- `/Users/byronwade/Stratos/TELNYX_WEBRTC_CONNECTION_FIX.md` - Full diagnostic and explanation
- `/Users/byronwade/Stratos/WEBRTC_DEBUGGING_GUIDE.md` - Debugging guide
- `/Users/byronwade/Stratos/TELNYX_WEBRTC_SETUP_GUIDE.md` - Original setup guide

---

## ✅ Checklist

Before asking for help, make sure you've done these:

- [ ] Created SIP Connection in Telnyx Portal with WebRTC enabled
- [ ] Added `TELNYX_WEBRTC_USERNAME` to `.env.local`
- [ ] Added `TELNYX_WEBRTC_PASSWORD` to `.env.local`
- [ ] Assigned phone numbers to the SIP connection
- [ ] Restarted dev server after adding environment variables
- [ ] Checked browser console for error messages
- [ ] Tried from a different network (to rule out firewall issues)
- [ ] Verified SIP connection shows "Active" in Telnyx Portal

---

**TL;DR: Create a SIP connection in Telnyx Portal, add the credentials to .env.local, restart server. It should work!**

