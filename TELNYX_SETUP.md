# Telnyx Automated Setup Guide

## Quick Start - One Button Setup

Visit: **`/test-telnyx-setup`**

Click: **"🚀 Run Full Setup"**

This will automatically:
1. ✅ Validate company data (EIN, address, contact info)
2. ✅ Check Telnyx settings (messaging profile, call control app)
3. ✅ Verify phone numbers are active
4. ✅ Register 10DLC brand with The Campaign Registry
5. ✅ Create and approve messaging campaign
6. ✅ Attach all phone numbers to campaign
7. ✅ Send test SMS to verify everything works

**Total time: 1-2 minutes** (most time is waiting for 10DLC approval)

---

## What Was Implemented

### 1. Real-Time Message Status Tracking

**Files Created:**
- `/src/hooks/use-message-status.ts` - Hook that polls Telnyx API for delivery status
- `/src/components/communication/message-delivery-status.tsx` - Status badge component
- `/src/components/communication/sms-view.tsx` - Updated with delivery status column

**Features:**
- Polls every 3 seconds until delivered/failed
- Color-coded badges:
  - 🔵 Blue = Sent
  - 🟢 Green = Delivered
  - 🔴 Red = Failed
  - ⚪ Gray = Queued
- Shows loading spinner while polling
- Stops automatically when terminal state reached

### 2. Automated 10DLC Registration

**Files Created:**
- `/src/actions/ten-dlc-registration.ts` - Complete registration flow
- `/src/app/test-10dlc-register/page.tsx` - Manual registration UI
- `/src/app/test-telnyx-setup/page.tsx` - **ONE-BUTTON SETUP (use this!)**

**Files Modified:**
- `/src/actions/telnyx.ts` - Auto-registers on 10DLC errors

**Features:**
- Automatic brand creation with company EIN
- Campaign creation with opt-in/opt-out handling
- Approval polling (waits up to 60 seconds)
- Phone number attachment
- Database updates
- Retry logic on SMS failures

### 3. Setup Validation APIs

**API Routes Created:**
- `/api/telnyx/validate-company` - Checks company data completeness
- `/api/telnyx/check-settings` - Verifies Telnyx configuration
- `/api/telnyx/check-phones` - Lists active phone numbers
- `/api/telnyx/send-test-sms` - Sends test message

---

## Test Pages Available

| Page | Purpose | When to Use |
|------|---------|-------------|
| `/test-telnyx-setup` | **ONE-BUTTON FULL SETUP** | **START HERE!** |
| `/test-telnyx-config` | Check configuration | Verify settings |
| `/test-telnyx-send` | Send SMS manually | Test messaging |
| `/test-telnyx-debug` | Step-by-step diagnostics | Troubleshooting |
| `/test-telnyx-status` | Check message status | Track delivery |
| `/test-10dlc-register` | Manual 10DLC registration | If auto-reg fails |

---

## How It Works

### Automatic 10DLC Registration Flow

```
User sends SMS
    ↓
Telnyx returns "Not 10DLC registered" error
    ↓
System automatically:
    1. Creates brand with company EIN + business info
    2. Waits for brand approval (polls every 5s, max 60s)
    3. Creates mixed-use campaign with opt-in/opt-out
    4. Waits for campaign approval
    5. Attaches all phone numbers to campaign
    6. Saves brand ID and campaign ID to database
    7. Retries original SMS send
    ↓
Message delivered successfully!
```

### Real-Time Status Tracking

```
SMS sent → telnyx_message_id saved → Badge component renders
    ↓
Badge polls /api/telnyx/message-status every 3 seconds
    ↓
Status updates: queued → sent → delivered
    ↓
Polling stops when terminal state reached
```

---

## Database Schema Updates

### Tables Modified

**`communications`**
- Added: `telnyx_message_id` (for status polling)
- Added: `sent_at` (timestamp)
- Added: `delivered_at` (timestamp)
- Added: `failed_at` (timestamp)

**`company_telnyx_settings`**
- Existing: `ten_dlc_brand_id` (now auto-populated)
- Existing: `ten_dlc_campaign_id` (now auto-populated)

---

## Configuration Requirements

### Required Company Data (for 10DLC)
- ✅ Company name
- ✅ EIN (Employer Identification Number)
- ✅ Street address, city, state, ZIP
- ✅ Primary contact: first name, last name, email, phone
- ✅ Business type (optional - defaults to Professional Services)
- ✅ Website (optional)

### Required Telnyx Settings
- ✅ Messaging profile ID
- ✅ Call control application ID
- ✅ Default outbound phone number
- ✅ Active phone numbers with SMS capability

### Required Environment Variables
- ✅ `TELNYX_API_KEY` - Your Telnyx API key
- ✅ `NEXT_PUBLIC_SITE_URL` - Public URL for webhooks

---

## Troubleshooting

### "Company data is incomplete"
→ Go to `/test-telnyx-setup` - it will show which fields are missing
→ Update company record in database with required fields

### "Approval pending"
→ Brand/campaign approval typically takes 1-5 minutes
→ Run setup again after a few minutes
→ Check Telnyx dashboard for approval status

### "Test SMS failed"
→ Check `/test-telnyx-debug` for detailed error logs
→ Verify phone number is active and has SMS capability
→ Confirm 10DLC campaign is approved

### "Phone number not found"
→ Company needs at least one phone number provisioned
→ Run `ensureCompanyTelnyxSetup()` to provision numbers

---

## Next Steps After Setup

1. **Test SMS**: Visit `/test-telnyx-send` and send a test message
2. **View Communications**: Go to `/dashboard/communication` to see all messages
3. **Check Status**: Use `/test-telnyx-status` to track delivery
4. **Production Use**: SMS sending is now fully automated - just call `sendTextMessage()`

---

## Technical Details

### 10DLC Campaign Configuration

**Usecase**: MIXED (covers most business needs)

**Sample Messages**:
- "Your appointment is confirmed for tomorrow at 2 PM."
- "Thank you for your payment. Receipt: #12345"
- "Reminder: Service scheduled for next week."

**Opt-In Keywords**: START, YES, SUBSCRIBE

**Opt-Out Keywords**: STOP, END, UNSUBSCRIBE, CANCEL, QUIT

**Opt-In Message**: "You are now subscribed to messages from [Company]. Reply STOP to unsubscribe."

**Opt-Out Message**: "You have been unsubscribed from [Company] messages. Reply START to resubscribe."

### Vertical Mapping

Business types are automatically mapped to 10DLC verticals:
- Healthcare → HEALTHCARE
- Finance/Banking → FINANCIAL_SERVICES
- Insurance → INSURANCE
- Real Estate → REAL_ESTATE
- Retail/Ecommerce → RETAIL
- Restaurant/Food → RESTAURANT
- Education → EDUCATION
- Technology/Software → TECHNOLOGY
- Nonprofit/Charity → NON_PROFIT
- **Default (Plumbing, HVAC, etc.) → PROFESSIONAL_SERVICES**

---

## Support

If you encounter issues:

1. Check the setup page logs (expand "Registration Log")
2. Review error messages in test pages
3. Verify all required fields are populated
4. Contact Telnyx support if brand/campaign is rejected

**Test Plumbing Company ID**: `2b88a305-0ecd-4bff-9898-b166cc7937c4`
