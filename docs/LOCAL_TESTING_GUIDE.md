# Local Testing Guide - Telnyx VoIP Integration

**How to test Telnyx webhooks and calling on localhost**

---

## 🚀 Quick Start (5 Minutes)

### Option 1: ngrok (Recommended for Testing)

#### Step 1: Install ngrok
```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com/download
```

#### Step 2: Start Your Dev Server
```bash
cd /Users/byronwade/Thorbis
pnpm dev
# Server running at http://localhost:3000
```

#### Step 3: Start ngrok Tunnel
```bash
# In a NEW terminal window
ngrok http 3000

# Output will show:
# Forwarding: https://abc123.ngrok.io -> http://localhost:3000
#
# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

#### Step 4: Configure Telnyx
```bash
1. Go to: https://portal.telnyx.com
2. Navigate to: Numbers → My Numbers
3. Click on: +1-831-428-0176
4. Under "Messaging & Voice Settings"
5. Set "Webhook URL" to: https://abc123.ngrok.io/api/webhooks/telnyx
6. Click "Save"
```

#### Step 5: Optional - Skip Signature Verification
```bash
# Add to .env.local for easier local testing
echo "TELNYX_SKIP_SIGNATURE_VERIFICATION=true" >> .env.local

# Restart Next.js
pnpm dev
```

#### Step 6: Make a Test Call
```bash
# From your phone (831-430-6011):
1. Call: +1-831-428-0176
2. Watch the terminals for webhook events
```

---

## 📊 What You'll See

### Terminal 1 (Next.js) - Expected Output:
```bash
🔔 Received Telnyx webhook: call.initiated
📦 Payload: {
  "data": {
    "event_type": "call.initiated",
    "payload": {
      "call_control_id": "v2:abc123...",
      "from": "+18314306011",
      "to": "+18314280176",
      "direction": "incoming"
    }
  }
}
⚠️  Skipping signature verification (development mode)
📞 Incoming call from +18314306011 to +18314280176
📱 Call Control ID: v2:abc123...
🏢 Company ID: 550e8400-e29b-41d4-a716-446655440000
✅ Call saved to database

🔔 Received Telnyx webhook: call.answered
✅ Call answered: v2:abc123...

🔔 Received Telnyx webhook: call.hangup
✅ Call ended: v2:abc123..., duration: 45s
```

### Terminal 2 (ngrok) - Request Log:
```bash
HTTP Requests
─────────────────────────────────────────────────────
POST /api/webhooks/telnyx    200 OK
POST /api/webhooks/telnyx    200 OK
POST /api/webhooks/telnyx    200 OK
```

### Browser - What Should Happen:
```bash
1. Incoming call popup appears in browser
2. Shows caller: +1 (831) 430-6011
3. Click "Answer" button
4. Audio connects via WebRTC
5. You can talk to the caller
6. Controls work (mute, hold, keypad, end)
```

---

## 🔧 Troubleshooting

### Problem: No Popup Appears

**Check 1: Is WebRTC Connected?**
```bash
# Open browser console (F12)
# Look for:
"Telnyx WebRTC client ready"

# If you see errors:
"Failed to connect to Telnyx WebRTC"
# → Check your Telnyx API key in .env.local
```

**Check 2: Are Webhooks Reaching Your Server?**
```bash
# Look in Next.js terminal for:
🔔 Received Telnyx webhook: call.initiated

# If you DON'T see this:
# → Check ngrok is running
# → Check Telnyx webhook URL is correct
# → Check ngrok terminal shows POST request
```

**Check 3: Is Phone Number in Database?**
```bash
# If you see:
🏢 Company ID: NOT FOUND - Check phone_numbers table

# Solution: Add phone number to database
# Go to Supabase → phone_numbers table
# Insert row with:
# - phone_number: +18314280176
# - company_id: [your company id]
```

### Problem: Webhook Returns 401 Unauthorized

**Solution: Skip signature verification locally**
```bash
# Add to .env.local
TELNYX_SKIP_SIGNATURE_VERIFICATION=true

# Restart dev server
pnpm dev
```

### Problem: ngrok URL Keeps Changing

**Solution 1: Use ngrok static domain (free)**
```bash
# Sign up at ngrok.com
ngrok config add-authtoken YOUR_AUTH_TOKEN

# Start with static domain
ngrok http 3000 --domain=your-static-subdomain.ngrok-free.app
```

**Solution 2: Use Cloudflare Tunnel**
```bash
# See section below
```

### Problem: "Microphone Permission Denied"

**Solution:**
```bash
# In browser:
1. Click lock icon in address bar
2. Allow microphone permission
3. Refresh page
4. Try call again
```

---

## 🌐 Alternative: Cloudflare Tunnel (Better for Regular Testing)

**Pros**: Same URL every time, faster setup after first time

### One-Time Setup
```bash
# Install
brew install cloudflare/cloudflare/cloudflared

# Login
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create thorbis-local

# Note the tunnel ID from output
```

### Create Config File
```bash
# Create config
mkdir -p ~/.cloudflared
cat > ~/.cloudflared/config.yml <<EOF
url: http://localhost:3000
tunnel: YOUR_TUNNEL_ID_HERE
credentials-file: ~/.cloudflared/YOUR_TUNNEL_ID_HERE.json
EOF
```

### Setup DNS (One-Time)
```bash
# If you have a domain (e.g., yourdomain.com)
cloudflared tunnel route dns thorbis-local dev.yourdomain.com

# Now you have permanent URL: https://dev.yourdomain.com
```

### Daily Usage
```bash
# Terminal 1: Start Next.js
pnpm dev

# Terminal 2: Start tunnel
cloudflared tunnel run thorbis-local

# Configure Telnyx webhook to:
# https://dev.yourdomain.com/api/webhooks/telnyx
# (Only need to do this ONCE!)
```

---

## 🧪 Testing Checklist

### Basic Call Test
- [ ] Start dev server (`pnpm dev`)
- [ ] Start ngrok (`ngrok http 3000`)
- [ ] Update Telnyx webhook URL
- [ ] Call +1-831-428-0176 from your phone
- [ ] See webhook logs in terminal
- [ ] See popup appear in browser
- [ ] Click "Answer"
- [ ] Hear caller's voice
- [ ] Speak and caller hears you
- [ ] Click "End" to hangup

### Call Controls Test
- [ ] Click "Mute" - caller can't hear you
- [ ] Click "Unmute" - caller can hear you again
- [ ] Click "Hold" - caller hears hold music
- [ ] Click "Resume" - call continues
- [ ] Click "Keypad" button
- [ ] Press digits on keypad
- [ ] Hear DTMF tones
- [ ] Drag widget around screen
- [ ] Click expand/collapse
- [ ] Widget shows correct call duration

### Database Test
- [ ] Call completes successfully
- [ ] Check Supabase `communications` table
- [ ] New row exists with:
  - `from_phone`: +18314306011
  - `to_phone`: +18314280176
  - `direction`: inbound
  - `status`: sent (after hangup)
  - `call_duration`: correct number of seconds

### Usage Dashboard Test
- [ ] Navigate to /dashboard/settings/communications/usage
- [ ] See call appear in metrics
- [ ] Call minutes counter increases
- [ ] Cost calculation is accurate ($0.012/min)
- [ ] Usage chart shows call
- [ ] Export CSV includes call

---

## 🔐 Security Notes

### Development Mode
```bash
# .env.local (LOCAL TESTING ONLY)
TELNYX_SKIP_SIGNATURE_VERIFICATION=true  # ⚠️ ONLY for local dev
NODE_ENV=development
```

### Production Mode
```bash
# .env.production (DEPLOYED VERSION)
# Remove TELNYX_SKIP_SIGNATURE_VERIFICATION
# Signature verification will be ENFORCED
NODE_ENV=production
```

**WARNING**: NEVER deploy with `TELNYX_SKIP_SIGNATURE_VERIFICATION=true`

---

## 📝 Environment Variables Needed

```bash
# .env.local (create if missing)
NEXT_PUBLIC_TELNYX_API_KEY=KEY019A41E297EC8A9AFC81AC403AE45A10_...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional for easier local testing
TELNYX_SKIP_SIGNATURE_VERIFICATION=true
```

---

## 🎯 Next Steps After Local Testing Works

1. **Test with real phone number** ✅ (you're doing this now!)
2. **Deploy to Vercel/production**
3. **Update Telnyx webhook to production URL**
4. **Remove TELNYX_SKIP_SIGNATURE_VERIFICATION**
5. **Test in production**

---

## 🆘 Getting Help

### Check Logs
```bash
# Next.js logs
# Look in terminal where you ran `pnpm dev`

# ngrok logs
# Look in terminal where you ran `ngrok http 3000`
# Or visit: http://localhost:4040 (ngrok web UI)

# Browser logs
# Open DevTools (F12) → Console tab
```

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "No incoming call popup" | Check WebRTC credentials loaded |
| "Can't hear caller" | Check microphone permissions |
| "Caller can't hear me" | Check browser mic is unmuted |
| "401 Unauthorized webhook" | Enable `TELNYX_SKIP_SIGNATURE_VERIFICATION=true` |
| "Company ID not found" | Add phone number to database |
| "ngrok URL changed" | Update Telnyx webhook URL |

---

**Built for easy local development and testing of Telnyx VoIP integration.**
