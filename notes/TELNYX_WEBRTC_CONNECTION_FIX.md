# Telnyx WebRTC Connection Issue - Diagnostic & Fix

## ✅ Tests Completed

### Test Results:
1. ✅ **TELNYX_API_KEY** - Configured and valid
2. ✅ **Credential Generation** - Working successfully
3. ✅ **STUN/TURN Servers** - Configured correctly
4. ⚠️  **WebRTC Connection** - NOT connecting

---

## 🔍 Root Cause

The credentials are generating successfully, but the **Telnyx WebRTC SDK is rejecting the connection**. This indicates the issue is NOT with your API key, but with how your **Telnyx account is configured for WebRTC**.

### The Problem:
The credentials generated via the REST API (`/v2/credential_connections`) do **NOT include critical fields** needed for WebRTC:
- ❌ Missing: `realm` (should be `sip.telnyx.com`)
- ❌ Missing: `sip_uri` (should be `sip:username@sip.telnyx.com`)
- ❌ Missing: Proper connection profile assignment

---

## 🔧 Solution: Create a Proper SIP Connection

You need to create a **dedicated SIP Connection for WebRTC** in the Telnyx Portal.

### Step 1: Create SIP Connection in Telnyx Portal

1. **Log into Telnyx Portal**: https://portal.telnyx.com

2. **Navigate to**: Voice → Connections

3. **Click**: "Create Connection" → "SIP Connection"

4. **Configure the SIP Connection:**
   ```
   Connection Name: WebRTC Calling
   Connection Type: SIP
   Authentication: Credential-based
   ✅ Enable WebRTC: YES (CRITICAL!)
   ✅ Tech Prefix Enabled: NO
   ```

5. **Create Credentials:**
   ```
   Username: webrtc_production
   Password: [Generate a strong 32-character password]
   ```
   
   **IMPORTANT:** Save these credentials - you'll need them!

6. **Configure Connection Settings:**
   ```
   Inbound: Enabled
   Outbound: Enabled
   Codecs: G722, PCMU, PCMA (default is fine)
   DTMF: RFC 2833
   ```

7. **Save the Connection** and note the **Connection ID**

### Step 2: Assign Phone Numbers to the Connection

1. **Navigate to**: Numbers → My Numbers

2. **For each phone number** you want to use:
   - Click on the number
   - Under "Connection", select your new "WebRTC Calling" connection
   - Save

### Step 3: Update Your Environment Variables

Add these to your `.env.local` file:

```bash
# Telnyx WebRTC Static Credentials
TELNYX_WEBRTC_USERNAME=webrtc_production
TELNYX_WEBRTC_PASSWORD=your-32-char-password-here
TELNYX_WEBRTC_CONNECTION_ID=your-connection-id-here
```

### Step 4: Update the Code to Use Static Credentials

We need to modify the `getWebRTCCredentials()` function to use these static credentials instead of generating temporary ones.

---

## 📝 Code Changes Needed

### File: `/src/actions/telnyx.ts`

**Current approach** (generating temporary credentials):
```typescript
export async function getWebRTCCredentials() {
  const { generateWebRTCToken } = await import("@/lib/telnyx/webrtc");
  const result = await generateWebRTCToken({
    username: user.email || user.id,
    ttl: 86_400,
  });
  // ... this doesn't include realm/sip_uri
}
```

**New approach** (use static credentials):
```typescript
export async function getWebRTCCredentials() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Service unavailable" };
    }

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    // Use static credentials from environment
    const username = process.env.TELNYX_WEBRTC_USERNAME;
    const password = process.env.TELNYX_WEBRTC_PASSWORD;

    if (!username || !password) {
      return {
        success: false,
        error: "TELNYX_WEBRTC_USERNAME or TELNYX_WEBRTC_PASSWORD not configured",
      };
    }

    const credential: WebRTCCredential = {
      username,
      password,
      expires_at: Date.now() + 86400 * 1000, // 24 hours from now
      realm: "sip.telnyx.com",
      sip_uri: `sip:${username}@sip.telnyx.com`,
      stun_servers: [
        "stun:stun.telnyx.com:3478",
        "stun:stun.telnyx.com:3479",
      ],
      turn_servers: [
        {
          urls: [
            "turn:turn.telnyx.com:3478?transport=udp",
            "turn:turn.telnyx.com:3478?transport=tcp",
          ],
          username,
          credential: password,
        },
      ],
    };

    return {
      success: true,
      credential,
    };
  } catch (error) {
    console.error("Error getting WebRTC credentials:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get WebRTC credentials",
    };
  }
}
```

---

## 🚀 Implementation Steps

### 1. Set up Telnyx SIP Connection (see Step 1-2 above)

### 2. Add environment variables (see Step 3 above)

### 3. Update the code (I'll do this for you)

### 4. Restart your dev server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 5. Test the connection
- Open the app in your browser
- Open the phone dropdown
- Check the console for:
  ```
  [useTelnyxWebRTC] ✅ Telnyx WebRTC client ready!
  ```

---

## 🔍 Why This Fix Works

### The Problem with Dynamic Credentials:
The `/v2/credential_connections` API endpoint creates credentials, but they:
- ❌ Don't include proper realm information
- ❌ Don't automatically link to a WebRTC-enabled connection
- ❌ Are temporary and need to be recreated frequently
- ❌ Don't have proper SIP configuration

### The Solution with Static Credentials:
Static credentials from a SIP Connection:
- ✅ Include proper realm (`sip.telnyx.com`)
- ✅ Include proper SIP URI format
- ✅ Are linked to a WebRTC-enabled connection
- ✅ Are permanent (don't expire)
- ✅ Have proper SIP configuration and codecs

---

## 🎯 Expected Results

After implementing this fix, you should see:

### In Browser Console:
```
[PhoneDropdown] Loading WebRTC credentials...
[PhoneDropdown] Credentials result: { success: true, credential: {...} }
[PhoneDropdown] Setting credentials: { 
  username: "webrtc_production", 
  hasPassword: true 
}
[useTelnyxWebRTC] Attempting to connect... { 
  username: "webrtc_production", 
  hasPassword: true 
}
[useTelnyxWebRTC] Client initialized, calling connect...
[useTelnyxWebRTC] ✅ Telnyx WebRTC client ready!
✅ Status: Ready to make calls
```

### In the UI:
- ✅ Phone dropdown opens successfully
- ✅ Green "Ready" indicator shows
- ✅ "Start Call" button is enabled
- ✅ You can enter phone numbers and make calls

---

## 📋 Quick Checklist

Before implementing, verify you have:

- [ ] Telnyx Portal access (https://portal.telnyx.com)
- [ ] At least one phone number in your Telnyx account
- [ ] Ability to create SIP connections in Telnyx
- [ ] Access to modify `.env.local` file
- [ ] Can restart the dev server

---

## ❓ FAQ

### Q: Why can't we use dynamic credentials?
**A:** The Telnyx REST API for creating credentials doesn't set up the full SIP configuration needed for WebRTC. It's designed for programmatic credential management, not for real-time calling.

### Q: Will this work for multiple users?
**A:** Yes! All users in your app will share these WebRTC credentials. The `from` number identifies the call, not the credentials.

### Q: Is this secure?
**A:** Yes, as long as:
1. The credentials are stored in `.env.local` (not committed to git)
2. You use a strong 32+ character password
3. You enable HTTPS in production

### Q: What if I need per-user credentials?
**A:** For per-user credentials, you'd need to:
1. Create a SIP connection per user (expensive and complex)
2. Or use Telnyx's Client SDK with user-specific tokens
3. The static credential approach is simpler and recommended for most use cases

---

## 🆘 Still Not Working?

If it still doesn't work after following these steps, check:

1. **Browser Console** - Look for specific error messages
2. **Network Tab** - Filter by "telnyx" and check for 401/403 errors
3. **Telnyx Portal** - Verify the SIP connection shows "Active"
4. **Phone Numbers** - Ensure they're assigned to the SIP connection
5. **Firewall** - Corporate firewalls often block WebRTC (UDP ports)

### Next Steps:
1. Share the browser console output
2. Share any error messages from the Network tab
3. Confirm the SIP connection status in Telnyx Portal

---

## ✅ Status

- [x] Diagnosed the issue
- [x] Identified root cause
- [x] Provided step-by-step solution
- [ ] Waiting for Telnyx SIP connection creation
- [ ] Waiting for environment variable configuration
- [ ] Ready to implement code changes

