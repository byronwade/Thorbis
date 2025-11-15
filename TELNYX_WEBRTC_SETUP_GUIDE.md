# Telnyx WebRTC Setup Guide

## Current Status

✅ **Working:**
- Credentials are being created successfully
- Username sanitization works
- Unique names with timestamps prevent conflicts

❌ **Not Working:**
- WebRTC SDK rejects the credentials with "Connection error"

---

## The Problem

The Telnyx WebRTC SDK is rejecting the credentials we're creating via the REST API. This suggests the **Telnyx account might not be configured for WebRTC calling**.

---

## Solution: Configure Telnyx for WebRTC

### Option 1: Use TeXML Application (Recommended)

Telnyx WebRTC requires a **TeXML Application** to handle calls. Here's how to set it up:

#### Step 1: Create a TeXML Application

1. **Log into Telnyx Portal**: https://portal.telnyx.com
2. **Go to**: Voice → TeXML Applications
3. **Click**: "Create TeXML Application"
4. **Configure**:
   - **Name**: "WebRTC Calling App"
   - **Inbound**: Enable
   - **Outbound**: Enable
   - **Voice URL**: (optional - can use for call handling)
   - **Enable WebRTC**: ✅ Check this box

#### Step 2: Link Phone Numbers

1. **Go to**: Numbers → My Numbers
2. **Select your phone numbers**
3. **Connection Type**: TeXML Application
4. **TeXML Application**: Select the app you created

#### Step 3: Update Code to Use Connection ID

Instead of creating temporary credentials, we should use a **static SIP connection**.

---

### Option 2: Use SIP Connection (Alternative)

If TeXML doesn't work, try using a static SIP connection:

#### Step 1: Create SIP Connection

1. **Log into Telnyx Portal**: https://portal.telnyx.com
2. **Go to**: Voice → Connections
3. **Click**: "Create Connection"
4. **Select**: "SIP Connection"
5. **Configure**:
   - **Name**: "WebRTC SIP Connection"
   - **Username**: Choose a static username (e.g., `webrtc_user`)
   - **Password**: Generate a secure password
   - **IP Authentication**: Disabled (use credential auth)
   - **WebRTC Enabled**: ✅ Check this

#### Step 2: Note the Credentials

Save these somewhere secure:
```
Username: webrtc_user
Password: <your-generated-password>
Connection ID: <connection-id>
```

#### Step 3: Update Environment Variables

Add to `.env.local`:
```bash
TELNYX_WEBRTC_USERNAME=webrtc_user
TELNYX_WEBRTC_PASSWORD=your-password-here
TELNYX_WEBRTC_CONNECTION_ID=your-connection-id
```

#### Step 4: Update Code

Instead of generating credentials dynamically, use the static ones:

```typescript
// In src/actions/telnyx.ts - getWebRTCCredentials()
export async function getWebRTCCredentials() {
  // Use static credentials from environment
  const credential: WebRTCCredential = {
    username: process.env.TELNYX_WEBRTC_USERNAME!,
    password: process.env.TELNYX_WEBRTC_PASSWORD!,
    expires_at: Date.now() + 86400 * 1000, // 24 hours
    realm: "sip.telnyx.com",
    sip_uri: `sip:${process.env.TELNYX_WEBRTC_USERNAME}@sip.telnyx.com`,
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
        username: process.env.TELNYX_WEBRTC_USERNAME!,
        credential: process.env.TELNYX_WEBRTC_PASSWORD!,
      },
    ],
  };

  return {
    success: true,
    credential,
  };
}
```

---

## Quick Check: What's Your Current Setup?

Run these checks in the Telnyx Portal:

### Check 1: Do you have a TeXML Application?
- Go to: Voice → TeXML Applications
- **Expected**: At least one application with "WebRTC Enabled"
- **If not**: Create one following Option 1 above

### Check 2: Do you have a SIP Connection?
- Go to: Voice → Connections
- **Expected**: At least one connection with "WebRTC Enabled"
- **If not**: Create one following Option 2 above

### Check 3: Are your phone numbers configured?
- Go to: Numbers → My Numbers
- **Expected**: Numbers linked to either TeXML App or SIP Connection
- **If not**: Link them to your connection

---

## Debug: See the Actual Error

**Refresh your browser** and check the console for this new log:

```
[useTelnyxWebRTC] ❌ Error details: {
  message: "...",
  error: { ... },
  code: "...",
  full: "..."
}
```

**Share this error message with me** - it will tell us exactly what Telnyx is rejecting!

---

## Common Errors & Solutions

### Error: "Invalid credentials"
**Cause**: Credentials aren't linked to a valid connection  
**Fix**: Create a SIP Connection or TeXML Application (see above)

### Error: "Connection not found"
**Cause**: No WebRTC-enabled connection in account  
**Fix**: Enable WebRTC on an existing connection or create new one

### Error: "Authentication failed"
**Cause**: Wrong username/password or expired credentials  
**Fix**: Use static credentials (Option 2) instead of dynamic ones

### Error: "No connection"
**Cause**: Telnyx account not set up for WebRTC  
**Fix**: Complete the setup steps above

---

## Next Steps

1. **Check the error details** in browser console
2. **Share the error** with me
3. **Check your Telnyx account** - Do you have WebRTC configured?
4. **Let me know** which option you want to use (TeXML or SIP)
5. **I'll help** update the code accordingly

---

## Questions to Answer

1. Do you already have a Telnyx TeXML Application?
2. Do you have a SIP Connection with WebRTC enabled?
3. What does the new "Error details" log show?
4. Which approach do you prefer: TeXML or Static SIP credentials?

Once I know these answers, I can update the code to work with your Telnyx setup! 🚀

