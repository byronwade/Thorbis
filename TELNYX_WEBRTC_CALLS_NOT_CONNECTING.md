# Telnyx WebRTC Calls Not Connecting Fix

## ✅ **What I Fixed:**

### **Issue 1: Account Limit Reached (FIXED)**
```
"You may only have 5 Credential Connection(s) at your account level."
```

**Problem**: Every page refresh was creating new credentials with unique timestamps, quickly filling up your account limit.

**Solution**: Updated `src/lib/telnyx/webrtc.ts` to:
1. **List existing credentials** before creating new ones
2. **Delete old credentials** that match the current user
3. **Reuse the same username** (no timestamp) since old ones are cleaned up first

This ensures you'll only have **one credential per user** at any time.

---

### **Issue 2: Calls End Immediately (NEEDS INVESTIGATION)**
```
[PhoneDropdown] WebRTC call ended: {state: 'ended'}
```

**Problem**: WebRTC connects successfully, but calls end within 1-2 seconds without ever ringing your phone.

**Likely Causes**:
1. ⚠️ **Phone number routing not configured** - Your Telnyx phone number might not be set up to handle WebRTC calls
2. ⚠️ **No outbound voice profile** - Outbound calls might not have a route configured
3. ⚠️ **Connection mismatch** - The credential connection we create might not be linked to your phone numbers

---

## 🔍 **Next Steps: Get Call End Reason**

I've added detailed error logging to see **WHY** calls are ending.

### **Step 1: Refresh & Make a Test Call**

1. **Hard refresh** your browser (Ctrl+Shift+R or Cmd+Shift+R)
2. **Make a test call** to any number
3. **Check the console** for this NEW log:

```
[useTelnyxWebRTC] ❌ Call ended! {
  state: "destroy" or "hangup",
  cause: "...",           ← THIS IS KEY
  causeCode: "...",       ← THIS TOO
  remoteSDP: "present" or "missing",
  full: { ... }
}
```

**Share this log with me** - the `cause` and `causeCode` will tell us exactly why the call is failing!

---

## 🔧 **Likely Telnyx Account Fixes**

Based on similar issues, here are the most common causes and fixes:

### **Fix 1: Link Phone Number to Credential Connection**

Your phone numbers need to be **linked to a Call Control Application** that uses credential authentication.

#### **Option A: Use Call Control Application (Recommended)**

1. **Log into Telnyx Portal**: https://portal.telnyx.com
2. **Go to**: Voice → Call Control Applications
3. **Create or Edit Application**:
   - **Webhook URL**: `https://your-app.vercel.app/api/webhooks/telnyx` (your webhook endpoint)
   - **Authentication**: Enable "Credential Authentication"
   - **Credentials**: Link to your credential connection
4. **Link Phone Numbers**:
   - Go to: Numbers → My Numbers
   - Select your numbers
   - **Connection Type**: Call Control Application
   - **Application**: Select the app you configured

#### **Option B: Use SIP Connection**

1. **Go to**: Voice → Connections → Create Connection
2. **Select**: "SIP Connection"
3. **Configure**:
   - **Name**: "WebRTC SIP Connection"
   - **Credential Auth**: Enable
   - **WebRTC**: Enable ✅
   - **Outbound Voice Profile**: Create or select one
4. **Link Phone Numbers** to this connection

---

### **Fix 2: Configure Outbound Voice Profile**

Outbound calls need a voice profile to know how to route calls.

1. **Go to**: Voice → Outbound Voice Profiles
2. **Create Profile** (if you don't have one):
   - **Name**: "Default Outbound"
   - **Traffic Type**: "On-net (Telnyx to Telnyx)"
   - **Save**
3. **Link to Connection**:
   - Go to your Call Control Application or SIP Connection
   - Set **Outbound Voice Profile**: Select the profile you created

---

### **Fix 3: Verify Number Capabilities**

Make sure your phone number can receive calls:

1. **Go to**: Numbers → My Numbers
2. **Click your number**
3. **Check**:
   - **Voice Enabled**: ✅
   - **SMS Enabled**: ✅ (if needed)
   - **Connection**: Should show your Call Control App or SIP Connection

---

## 📋 **Testing Checklist**

After making changes in Telnyx Portal:

- [ ] Refresh browser (Ctrl+Shift+R)
- [ ] Check console - credentials should be created (only 1, not 5!)
- [ ] WebRTC shows "Ready" (✅ green checkmark)
- [ ] Make a test call
- [ ] **Check console for call end reason**
- [ ] Share the `cause` and `causeCode` with me

---

## 🐛 **Common Error Messages & Solutions**

### **Error: "NORMAL_CLEARING" or causeCode: 16**
**Meaning**: Call was rejected by Telnyx (no route configured)  
**Fix**: Link phone numbers to Call Control Application (Fix 1)

### **Error**: "NO_USER_RESPONSE" or causeCode: 18
**Meaning**: Call timed out waiting for answer  
**Fix**: Check outbound voice profile configuration (Fix 2)

### **Error**: "CALL_REJECTED" or causeCode: 21
**Meaning**: Destination rejected the call  
**Fix**: Verify destination number is valid and can receive calls

### **Error**: "NO_ROUTE_DESTINATION" or causeCode: 3
**Meaning**: No route configured for outbound calls  
**Fix**: Configure Outbound Voice Profile (Fix 2)

---

## 💡 **What Should Happen (Normal Flow)**

```
1. [useTelnyxWebRTC] ✅ Telnyx WebRTC client ready!
2. User clicks "Call" button
3. [useTelnyxWebRTC] 🔔 Call update: { state: "new" }
4. [useTelnyxWebRTC] 🔔 Call update: { state: "trying" }
5. [useTelnyxWebRTC] 🔔 Call update: { state: "ringing" } ← Your phone should ring here!
6. [useTelnyxWebRTC] 🔔 Call update: { state: "active" }   ← Call connected!
7. ... call in progress ...
8. [useTelnyxWebRTC] 🔔 Call update: { state: "hangup" }
```

**If calls end at step 3-4**, it means Telnyx rejected the call before routing it.

---

## 🚨 **Priority Action**

1. **Refresh browser and make a test call**
2. **Find this log** in console:
   ```
   [useTelnyxWebRTC] ❌ Call ended! { cause: "...", causeCode: "..." }
   ```
3. **Share the `cause` and `causeCode` with me**

Once I see the error code, I can tell you **exactly** which Telnyx setting to fix! 🎯

