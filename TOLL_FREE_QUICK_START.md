# Toll-Free Quick Start Guide

**Get text messaging working in 5-7 days with ZERO platform setup required**

---

## Why Toll-Free is the Default

✅ **Works immediately** - No Level 2 verification needed
✅ **Fully automated** - Submit via API, no manual steps
✅ **5-7 day approval** - Faster than manual verification
✅ **Professional** - Customers recognize toll-free numbers
✅ **Customer-friendly** - Free for customers to call/text

**Recommendation**: Start with toll-free numbers, add 10DLC later if needed.

---

## How It Works

### 1. Customer Onboarding

**During Step 1 (Company Information)**:
- Customer provides business info (name, EIN, address)
- No Telnyx Portal visit required
- All collected through YOUR platform

**During Step 4 (Enable Messaging)**:
- Customer clicks "Submit Verification"
- YOUR platform automatically submits to Telnyx
- Toll-free verification request created instantly

### 2. Verification Timeline

**Immediate (< 1 second)**:
- ✅ Verification request submitted to Telnyx
- ✅ Email sent to customer with timeline
- ✅ Database updated with request ID

**5-7 Business Days**:
- ⏰ Telnyx/carriers review submission
- ⏰ Automated approval process
- ✅ Approval notification (via webhook or polling)
- ✅ Email sent to customer
- ✅ SMS/MMS automatically enabled

### 3. Customer Experience

**What customer sees**:
1. "Submit Verification" button in onboarding
2. Success message: "Toll-free verification submitted - Approval in 5-7 days"
3. Email confirmation with timeline
4. (5-7 days later) Email: "Your messaging is live!"
5. Start sending SMS/MMS immediately after approval

**What customer DOESN'T see**:
- ❌ Telnyx Portal
- ❌ Manual verification steps
- ❌ Complex setup process
- ❌ Technical jargon

---

## Toll-Free vs 10DLC Comparison

| Feature | Toll-Free | 10DLC (Local Numbers) |
|---------|-----------|----------------------|
| **Platform Setup** | None required | Level 2 verification (48 hours) |
| **Approval Time** | 5-7 business days | Instant (< 1 minute) |
| **Cost per Message** | $0.0075 - $0.0150 | $0.0050 - $0.0075 |
| **Customer Recognition** | High (800/888/877/etc) | Medium (local area code) |
| **Works Immediately** | ✅ Yes | ❌ No (needs Level 2) |
| **Recommended For** | **Initial launch** | After Level 2 complete |

**Bottom Line**: Use toll-free to launch quickly, add 10DLC later for cost savings.

---

## Current Test Company Setup

**Test Plumbing Company** now has:
- ✅ 1 toll-free number: `+1 (877) 355-4398`
- ✅ 1 local number: `+1 (831) 428-0176`

**What will happen when you run `/test-telnyx-setup`**:
1. ✅ Toll-free verification submits successfully
2. ⚠️ 10DLC registration fails (403 error - expected until Level 2)
3. ✅ Overall result: **Success** (toll-free is enough!)

**Expected output**:
```
✅ Toll-free verification submitted (1 number) - Approval in 5-7 business days
⚠️ 10DLC requires Level 2 verification (see /TELNYX_PLATFORM_SETUP.md). Toll-free verification will proceed.
```

---

## How to Test Toll-Free Verification

### Option 1: Test Page (Easiest)

1. Navigate to `/test-telnyx-setup`
2. Click "Run Full Setup"
3. Watch the steps complete
4. Verify toll-free submission succeeds

**Expected Steps**:
- ✅ Step 1: Company data validated
- ✅ Step 2: Telnyx settings configured
- ✅ Step 3: Phone numbers verified
- ✅ Step 4: Toll-free verification submitted
- ⚠️ Step 5: 10DLC registration (skip - not needed)
- ✅ Step 6: Email notification sent

### Option 2: Onboarding Flow

1. Complete onboarding Steps 1-3
2. Reach Step 4 (Enable Messaging)
3. Click "Submit Verification"
4. Verify success message and email

### Option 3: Direct API Call

```typescript
import { submitAutomatedVerification } from "@/actions/ten-dlc-registration";

const result = await submitAutomatedVerification("company-id-here");

if (result.success) {
  console.log("Toll-free verification submitted!");
  console.log("Request ID:", result.tollFreeRequestId);
} else {
  console.error("Error:", result.error);
}
```

---

## What Happens After Submission

### Database Updates

**`company_telnyx_settings` table**:
```sql
toll_free_verification_request_id: "req_abc123..."
toll_free_verification_status: "pending"
toll_free_verification_submitted_at: "2025-11-18T12:00:00Z"
```

**Query to check status**:
```sql
SELECT
  toll_free_verification_request_id,
  toll_free_verification_status,
  toll_free_verification_submitted_at
FROM company_telnyx_settings
WHERE company_id = 'your-company-id';
```

### Email Sent

**Subject**: "Messaging Verification Submitted - [Company Name]"

**Content**:
- ✅ Toll-free verification submitted
- ⏰ Approval timeline: 5-7 business days
- 📧 Email notification when approved
- 🔗 Link to dashboard

### Telnyx API Call

**Endpoint**: `POST /v2/messaging_tollfree/verification/requests`

**Full URL**: `https://api.telnyx.com/v2/messaging_tollfree/verification/requests`

**Payload** (automatically built from company data):
```json
{
  "businessName": "Test Plumbing Company",
  "corporateWebsite": "https://testplumbing.com",
  "businessAddr1": "123 Main St",
  "businessCity": "Chicago",
  "businessState": "Illinois",
  "businessZip": "60601",
  "businessContactFirstName": "Admin",
  "businessContactLastName": "User",
  "businessContactEmail": "contact@testplumbing.com",
  "businessContactPhone": "+18005551234",
  "phoneNumbers": [
    { "phoneNumber": "+18773554398" }
  ],
  "useCase": "Customer Support",
  "useCaseSummary": "Plumbing business communications...",
  "productionMessageContent": "Hi! This is Test Plumbing Company...",
  "messageVolume": "10000",
  "optInWorkflow": "Customers opt-in during service booking...",
  "businessRegistrationNumber": "12-3456789",
  "businessRegistrationType": "EIN",
  "businessRegistrationCountry": "US",
  "entityType": "PRIVATE_PROFIT"
}
```

---

## Monitoring Verification Status

### Option 1: Webhook (Recommended)

**Set up webhook** to receive approval notification:

```typescript
// /app/api/webhooks/telnyx/verification-status/route.ts
export async function POST(request: Request) {
  const payload = await request.json();

  if (payload.data.event_type === 'toll_free.verification.approved') {
    const requestId = payload.data.payload.id;

    // Find company
    const { data: settings } = await supabase
      .from('company_telnyx_settings')
      .select('company_id')
      .eq('toll_free_verification_request_id', requestId)
      .single();

    if (settings) {
      // Send "Verification Complete" email
      await sendVerificationCompleteEmail(
        settings.company_id,
        companyEmail,
        ['toll-free']
      );

      // Update status
      await supabase
        .from('company_telnyx_settings')
        .update({
          toll_free_verification_status: 'approved',
          toll_free_verification_approved_at: new Date().toISOString()
        })
        .eq('company_id', settings.company_id);
    }
  }

  return new Response('OK', { status: 200 });
}
```

**Register in Telnyx Portal**:
- URL: `https://your-domain.com/api/webhooks/telnyx/verification-status`
- Events: `toll_free.verification.approved`, `toll_free.verification.rejected`

### Option 2: Polling (Alternative)

**Background job** that runs every 6 hours:

```typescript
export async function checkPendingVerifications() {
  const { data: pending } = await supabase
    .from('company_telnyx_settings')
    .select('company_id, toll_free_verification_request_id')
    .eq('toll_free_verification_status', 'pending')
    .not('toll_free_verification_request_id', 'is', null);

  for (const setting of pending) {
    const status = await getTollFreeVerificationStatus(
      setting.toll_free_verification_request_id
    );

    if (status.data?.status === 'approved') {
      // Send email and update database
    }
  }
}
```

---

## Troubleshooting

### "No phone numbers found"

**Cause**: Company has no phone numbers in database

**Solution**: Add a toll-free number first
```sql
INSERT INTO phone_numbers (
  company_id, phone_number, formatted_number,
  country_code, number_type, status, features
) VALUES (
  'company-id',
  '+18773554398',
  '(877) 355-4398',
  'US',
  'toll-free',
  'active',
  '["voice", "sms", "mms"]'::jsonb
);
```

### "Company EIN is required"

**Cause**: Company record missing EIN (Tax ID)

**Solution**: Add EIN in Step 1 of onboarding
```sql
UPDATE companies
SET ein = '12-3456789'
WHERE id = 'company-id';
```

### "Address is incomplete"

**Cause**: Missing address fields (address, city, state, zip)

**Solution**: Complete all address fields in Step 1

### Toll-free verification rejected

**Cause**: Usually business info doesn't match official records

**Solution**:
1. Check rejection reason in Telnyx Portal
2. Verify EIN matches business name
3. Ensure address matches official business registration
4. Resubmit with corrected information

---

## Production Deployment

### Before Launch

1. ✅ Resend API key configured (`RESEND_API_KEY`)
2. ✅ Telnyx API key configured (`TELNYX_API_KEY`)
3. ✅ Email templates tested
4. ✅ Database schema deployed
5. ✅ Test verification submission with real company data
6. ⏳ Set up webhook for approval notifications (optional but recommended)

### After Launch

**Monitor these metrics**:
```sql
-- Verification submission rate
SELECT
  DATE(created_at) as date,
  COUNT(*) as submissions
FROM company_telnyx_settings
WHERE toll_free_verification_request_id IS NOT NULL
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Approval rate
SELECT
  toll_free_verification_status,
  COUNT(*) as count
FROM company_telnyx_settings
WHERE toll_free_verification_request_id IS NOT NULL
GROUP BY toll_free_verification_status;

-- Average approval time
SELECT
  AVG(
    EXTRACT(EPOCH FROM (toll_free_verification_approved_at - toll_free_verification_submitted_at)) / 86400
  ) as avg_days
FROM company_telnyx_settings
WHERE toll_free_verification_status = 'approved';
```

---

## Adding 10DLC Later (Optional)

**When you're ready** (after completing Level 2 verification):

1. Complete Level 2 verification (see `/TELNYX_PLATFORM_SETUP.md`)
2. Code already supports 10DLC - no changes needed
3. Customers with local numbers get instant approval
4. Customers with toll-free get 5-7 day approval
5. Both work seamlessly together

**Dual-mode benefits**:
- Toll-free: High recognition, customer-friendly
- 10DLC: Lower cost, instant approval
- Customer gets best of both worlds

---

## Summary

✅ **Toll-free is the default** - Works immediately without Level 2 verification
✅ **Fully automated** - Submit via API, no manual steps
✅ **5-7 day approval** - Fast enough for most use cases
✅ **Professional** - Toll-free numbers recognized by customers
✅ **Test company ready** - Has toll-free number for testing

**Next Steps**:
1. Test toll-free verification at `/test-telnyx-setup`
2. Verify email notification sent
3. Check database for request ID
4. (Optional) Set up webhook for approval notification
5. (Optional) Complete Level 2 verification for 10DLC support

**Ready to launch with toll-free messaging!**

---

**Created**: 2025-11-18
**Status**: Toll-Free Default Implementation Complete
**Test Company**: Has toll-free number ready for testing
