# WebRTC Calling Debug Guide

## Current Issue
Button is disabled and calls cannot be made.

## Debug Steps

### Step 1: Open Browser Console
1. Open your browser's developer tools (F12 or Right Click → Inspect)
2. Go to the **Console** tab
3. Click on the phone icon in your app to open the phone dropdown

### Step 2: Check the Console Logs

You should see a sequence of logs like this:

#### ✅ **GOOD** - Expected Flow:

```
[PhoneDropdown] Loading WebRTC credentials...
[PhoneDropdown] Credentials result: { success: true, credential: {...} }
[PhoneDropdown] Setting credentials: { username: "user@example.com", hasPassword: true }
[PhoneDropdown] Credential loading complete
[useTelnyxWebRTC] Mount effect, autoConnect: true
[useTelnyxWebRTC] Auto-connecting...
[useTelnyxWebRTC] Attempting to connect... { username: "user@example.com", hasPassword: true }
[useTelnyxWebRTC] Client initialized, calling connect...
[useTelnyxWebRTC] Connect method called, waiting for ready event...
[useTelnyxWebRTC] ✅ Telnyx WebRTC client ready!
[PhoneDropdown] WebRTC state: { isConnected: true, isConnecting: false, connectionError: null, ... }
[PhoneDropdown] Call button state: { canCall: true, ... }
```

#### ❌ **BAD** - Possible Error Patterns:

**Pattern 1: Credential Generation Failed**
```
[PhoneDropdown] Loading WebRTC credentials...
[generateWebRTCToken] Starting credential generation for: user@example.com
[generateWebRTCToken] ❌ TELNYX_API_KEY is not configured
[PhoneDropdown] Failed to load WebRTC credentials: TELNYX_API_KEY is not configured
```
**FIX**: Add `TELNYX_API_KEY` to your `.env.local` file

---

**Pattern 2: Telnyx API Rejection**
```
[generateWebRTCToken] API response status: 401
[generateWebRTCToken] ❌ Primary endpoint failed: {"errors":[{"code":"unauthorized",...}]}
[generateWebRTCToken] Trying alternative endpoint...
[generateWebRTCToken] Alternative endpoint response: 401
[generateWebRTCToken] ❌ Alternative endpoint also failed: ...
```
**FIX**: Check that your Telnyx API key is valid and has WebRTC permissions

---

**Pattern 3: Connection Failed**
```
[useTelnyxWebRTC] Attempting to connect... { username: "...", hasPassword: true }
[useTelnyxWebRTC] Client initialized, calling connect...
[useTelnyxWebRTC] ❌ Telnyx socket error: {...}
[useTelnyxWebRTC] ❌ Telnyx WebRTC error: Connection timeout
```
**FIX**: Check network/firewall settings, verify Telnyx WebRTC is configured

---

**Pattern 4: Missing Company Phones**
```
[PhoneDropdown] Call button state: {
  canCall: false,
  hasToNumber: true,
  hasFromNumber: false,  ⚠️ Problem!
  companyPhonesCount: 0,  ⚠️ Problem!
  isWebRTCConnected: true,
  isLoadingWebRTC: false
}
```
**FIX**: Add phone numbers to your company in the dashboard settings

---

### Step 3: Check Button Conditions

When you open the phone dropdown and enter a number, check this log:

```
[PhoneDropdown] Call button state: {
  canCall: false,  ← Should be true
  hasToNumber: true/false,
  hasFromNumber: true/false,
  companyPhonesCount: 0,
  isWebRTCConnected: true/false,
  isLoadingWebRTC: false
}
```

**For the button to be enabled, ALL of these must be TRUE:**
- ✅ `hasToNumber: true` - You entered a phone number
- ✅ `hasFromNumber: true` - A "from" number is selected
- ✅ `companyPhonesCount > 0` - Company has phone numbers
- ✅ `isWebRTCConnected: true` - WebRTC is connected
- ✅ `isLoadingWebRTC: false` - Credentials finished loading

---

### Step 4: Visual Status Indicator

Look at the phone dropdown UI - it shows the connection status:

- 🟢 **Green "Ready"** = Connected and ready to call ✅
- 🟡 **Yellow "Connecting..."** = Still establishing connection ⏳
- 🔴 **Red "Error"** = Connection failed (hover for details) ❌
- ⚪ **Gray "Disconnected"** = Not connected ⚠️

If you don't see green "Ready", the button will be disabled.

---

## Common Issues & Solutions

### Issue 1: No TELNYX_API_KEY

**Error:**
```
[generateWebRTCToken] ❌ TELNYX_API_KEY is not configured
```

**Solution:**
```bash
# Add to .env.local
TELNYX_API_KEY=KEYxxxxxxxxxxxxxxxxxxxx
```

---

### Issue 2: API Returns 401 Unauthorized

**Error:**
```
[generateWebRTCToken] API response status: 401
```

**Solution:**
1. Verify API key is correct
2. Check API key has WebRTC permissions in Telnyx portal
3. Ensure you're using a production API key (not test key)

---

### Issue 3: No Company Phones

**Error:**
```
companyPhonesCount: 0
hasFromNumber: false
```

**Solution:**
1. Go to Dashboard → Settings → Phone Numbers
2. Purchase or port phone numbers to your Telnyx account
3. Refresh the page

---

### Issue 4: WebRTC Won't Connect

**Error:**
```
[useTelnyxWebRTC] ❌ Telnyx WebRTC error: Connection timeout
```

**Solutions:**
1. **Check Telnyx WebRTC Setup:**
   - Log into Telnyx portal
   - Go to Voice → TeXML Applications
   - Verify you have a WebRTC-enabled connection

2. **Check Browser Permissions:**
   - Browser must support WebRTC
   - Allow microphone access when prompted

3. **Check Network:**
   - Firewall might be blocking WebSocket connections
   - Try from a different network
   - Check if corporate firewall blocks WebRTC

4. **Verify Credentials:**
   - Credentials should have valid username and password
   - Check logs for credential content (password should not be empty)

---

## Step 5: Share Console Output

If the issue persists, please share:

1. **All console logs** from opening the phone dropdown
2. **Network tab** filtered by "telnyx.com" to see API calls
3. **Current values** from the "Call button state" log
4. **Status indicator** you see (Ready/Connecting/Error/Disconnected)

---

## Quick Test Checklist

Run through this checklist:

- [ ] `TELNYX_API_KEY` is set in `.env.local`
- [ ] Restarted dev server after adding API key
- [ ] Browser console shows no errors
- [ ] Status indicator shows green "Ready"
- [ ] Company has phone numbers added
- [ ] Phone number is entered in the field
- [ ] "From" number is selected in dropdown
- [ ] Logs show `isWebRTCConnected: true`
- [ ] Logs show `canCall: true`

---

## Next Steps

1. Open phone dropdown
2. Check browser console
3. Look for red ❌ error messages
4. Share the console output here
5. I'll help identify the specific issue

The extensive logging will tell us exactly where the problem is!

