# Telnyx Platform Setup Guide

**One-time setup required before automated verification will work**

---

## Why This Setup is Required

To enable ServiceTitan-style automated verification (where customers never visit Telnyx Portal), **YOUR platform's Telnyx account** must complete Level 2 verification first. This is a federal compliance requirement enforced by The Campaign Registry (TCR).

**ServiceTitan, Jobber, and similar platforms all completed this step** - it's required for ANY ISV (Independent Service Vendor) that wants to programmatically create 10DLC brands for their customers.

---

## Current Error

```
Telnyx 403: You have not completed the verifications required to perform this action.
Check the 'verifications' tab under 'account' on the portal for more information.
```

**This error will persist until Level 2 verification is complete.**

---

## One-Time Platform Setup (Required)

### Step 1: Access Telnyx Portal

**Who**: Platform owner/administrator only
**When**: Once, before any customers can use automated verification
**URL**: https://portal.telnyx.com

1. Log in to Telnyx Portal with platform account credentials
2. Navigate to: **Account Settings → Verifications**

### Step 2: Complete Level 1 Verification (if not already done)

**Requirements**:
- Valid email address
- Phone number
- Payment method on file

**Process**:
- Fill out basic account information
- Verify email and phone number
- Add payment method (credit card)
- Usually instant approval

### Step 3: Complete Level 2 Verification

**This is the critical step that enables 10DLC API access.**

**Prerequisites**:
- ✅ Level 1 verification complete
- ✅ Contact number added in Account Settings → Profile
- ✅ Company name added in Account Settings → Profile
- ✅ Payment method on file

**Process**:
1. Go to **Account Settings → Verifications**
2. Expand the **"Level 2"** section
3. Fill out the verification form with YOUR platform's business information:
   - Company legal name
   - Business address (must match official records)
   - Tax ID (EIN for US businesses)
   - Business registration documents (optional but speeds up approval)
   - Primary contact information
4. Click **"Request Level 2 Verification"**

**Timeline**: Up to **48 hours** for approval (often faster)

**Note**: Only organization owners can access this section.

---

## After Level 2 Verification is Approved

Once approved, you will be able to:

✅ **Create 10DLC brands via API** for your customers
✅ **Create campaigns via API** for customer phone numbers
✅ **Submit toll-free verification via API** programmatically
✅ **Enable ServiceTitan-style automated verification** in your platform

**No further manual steps required** - all verification happens programmatically!

---

## How Automated Verification Works After Setup

### For Your Customers (Once Platform is Verified)

**Your customer's experience**:
1. Signs up on **YOUR platform** (not Telnyx)
2. Provides business info during onboarding (EIN, address, etc.)
3. Clicks **"Submit Verification"** button
4. **Your platform automatically**:
   - Creates a 10DLC brand in TCR (via Telnyx API)
   - Creates a campaign for that brand
   - Submits toll-free verification (if toll-free numbers)
   - Sends confirmation email
5. Customer **never visits Telnyx Portal**

**Timeline**:
- **10DLC (regular numbers)**: Instant approval (< 1 minute)
- **Toll-Free numbers**: 5-7 business days

### Platform Architecture (After Level 2 Verification)

```
┌─────────────────────────────────────────────────────────────┐
│ YOUR PLATFORM (One Telnyx Account - Level 2 Verified)      │
│                                                             │
│  Customer A                Customer B                       │
│  ├─ Brand A (Unique EIN)   ├─ Brand B (Unique EIN)        │
│  ├─ Campaign A             ├─ Campaign B                   │
│  └─ Numbers: +1234...      └─ Numbers: +1567...            │
│                                                             │
│  All created via Telnyx API automatically                  │
└─────────────────────────────────────────────────────────────┘
```

**Key Points**:
- **One Telnyx account** (yours) serves all customers
- **Separate brand per customer** (each with unique EIN)
- **Programmatic creation** via API (no manual steps)
- **Federal compliance** maintained (TCR registration)

---

## What Gets Created Per Customer

When a customer submits verification through your platform:

### For Regular (10DLC) Numbers

**Via Telnyx API** (instant):
1. **Brand Registration** with The Campaign Registry (TCR)
   - Uses customer's business info (EIN, name, address)
   - Costs $4 (one-time TCR fee, passed through)
   - Approval: Instant (< 1 minute)
2. **Campaign Creation** for that brand
   - Standard use case: "Customer Support" or "Marketing"
   - Links to the brand
   - Approval: Instant
3. **Number Association** to campaign
   - Customer's phone numbers attached to campaign
   - Enables SMS/MMS immediately

### For Toll-Free Numbers

**Via Telnyx API** (5-7 days):
1. **Verification Request Submission**
   - Business information
   - Use case description
   - Message samples
   - Timeline: 5 business days or less
2. **Approval Notification** (webhook or polling)
   - Platform receives approval notification
   - Sends email to customer
   - Enables SMS/MMS automatically

---

## Testing the Setup

### Before Level 2 Verification (Current State)

**Expected Behavior**:
```
❌ 10DLC brand creation: 403 Forbidden
❌ 10DLC campaign creation: 403 Forbidden
✅ Toll-free verification: Works! (API submission succeeds)
```

**What You Can Test**:
- Toll-free verification submission (works without Level 2)
- Email notifications (works)
- Database updates (works)
- UI flow (works)

**What Will Fail**:
- Creating 10DLC brands via API (403 error)
- Creating campaigns via API (403 error)
- Sending SMS via regular numbers (not verified)

### After Level 2 Verification (Future State)

**Expected Behavior**:
```
✅ 10DLC brand creation: Instant approval
✅ 10DLC campaign creation: Instant approval
✅ Toll-free verification: 5-7 day approval
✅ Full automated flow: Works end-to-end
```

**Test with a Real Company**:
1. Go to `/test-telnyx-setup`
2. Click "Run Full Setup"
3. Verify all steps complete successfully
4. Check database for brand_id, campaign_id, verification_request_id
5. Send test SMS (10DLC numbers work immediately)
6. Wait 5-7 days for toll-free approval

---

## Cost Breakdown

### One-Time Platform Costs

**Telnyx Account Setup**: Free
**Level 1 Verification**: Free
**Level 2 Verification**: Free

### Per-Customer Costs (Pass-Through)

**10DLC Brand Registration**: $4 (one-time, TCR fee)
**10DLC Campaign Registration**: Free
**Toll-Free Verification**: Free
**Phone Number Usage**: Standard Telnyx rates (SMS/MMS/Voice)

**Recommended Pricing Strategy**:
- Include $4 brand fee in onboarding or monthly subscription
- Or charge one-time "SMS Setup Fee" of $5-10
- ServiceTitan likely bundles this into their pricing

---

## Frequently Asked Questions

### Q: Why do I need Level 2 verification if ServiceTitan customers don't?

**A**: ServiceTitan **already completed** Level 2 verification for their platform. You only need to do this **once** for your entire platform, not for each customer.

### Q: Can I skip Level 2 verification and just use toll-free?

**A**: Yes, but:
- Toll-free numbers cost more per message
- Toll-free requires 5-7 day approval
- 10DLC numbers are instant and cheaper
- Most competitors offer both options

**Recommendation**: Complete Level 2 verification to offer the best experience.

### Q: How long does Level 2 verification take?

**A**: Up to 48 hours, but often approved within a few hours. Have your business documents ready to speed up the process.

### Q: What if my Level 2 verification is rejected?

**A**: Contact Telnyx support with your rejection reason. Common issues:
- Business address doesn't match official records
- EIN doesn't match company name
- Missing business registration documents

Provide official documents (Articles of Incorporation, IRS EIN confirmation) to resolve.

### Q: Do I need a separate Telnyx account per customer?

**A**: No! That's the beauty of the ISV model. **One Telnyx account** (yours) creates separate brands for each customer via API. ServiceTitan uses the same approach.

### Q: What about compliance and liability?

**A**: Each customer's brand registration includes their business information and EIN, maintaining compliance. **Your platform** facilitates registration, but **each customer** is responsible for their messaging practices. This is identical to ServiceTitan's model.

---

## Checklist: Before Launching Automated Verification

**Platform Prerequisites** (one-time):
- [ ] Telnyx account created
- [ ] Payment method added
- [ ] Level 1 verification complete
- [ ] Company name and contact number in Account Settings
- [ ] Level 2 verification submitted
- [ ] Level 2 verification approved (wait up to 48 hours)
- [ ] Test 10DLC brand creation via API (verify no 403 error)
- [ ] Test toll-free verification submission via API
- [ ] Webhook configured for toll-free approval notifications

**Code Prerequisites** (already implemented):
- [x] Email notification system (Resend + React Email)
- [x] Database schema (phone_numbers, company_telnyx_settings)
- [x] Server action: `submitAutomatedVerification()`
- [x] Telnyx API functions (10DLC + toll-free)
- [x] Error handling and validation
- [x] Test pages for verification flow

**Once Level 2 is approved, you're ready to launch!**

---

## Next Steps

### 1. Submit Level 2 Verification (Now)

**Action**: Platform owner logs into Telnyx Portal and submits Level 2 verification request

**Timeline**: Up to 48 hours for approval

**Documentation**: Keep approval email for records

### 2. Test After Approval

**Test Page**: `/test-telnyx-setup`

**Expected Result**:
- ✅ Company data validated
- ✅ Telnyx settings configured
- ✅ Phone numbers found
- ✅ 10DLC brand created (instant)
- ✅ 10DLC campaign created (instant)
- ✅ Numbers attached to campaign
- ✅ Test SMS sent successfully

### 3. Monitor First Real Customers

**What to Watch**:
- Brand registration success rate
- Campaign approval times
- Toll-free verification submission success
- Email delivery success
- Customer feedback on UX

**Database Queries** to monitor:
```sql
-- Count successful brand registrations
SELECT COUNT(*) FROM company_telnyx_settings WHERE ten_dlc_brand_id IS NOT NULL;

-- Count pending toll-free verifications
SELECT COUNT(*) FROM company_telnyx_settings WHERE toll_free_verification_status = 'pending';

-- Check for errors
SELECT * FROM company_telnyx_settings WHERE ten_dlc_brand_id IS NULL AND created_at > NOW() - INTERVAL '7 days';
```

### 4. Set Up Monitoring (Recommended)

**Webhook for Toll-Free Approvals**:
- Endpoint: `/api/webhooks/telnyx/verification-status`
- Events: `toll_free.verification.approved`, `toll_free.verification.rejected`
- Action: Send "Verification Complete" email automatically

**Email Logs Monitoring**:
- Check `email_logs` table daily
- Alert on failed email sends
- Retry failed emails manually if needed

---

## Support Resources

**Telnyx Support**:
- Portal: https://portal.telnyx.com
- Support Portal: https://support.telnyx.com
- API Docs: https://developers.telnyx.com/docs/v2/messaging

**Platform Documentation**:
- `/AUTOMATED_VERIFICATION.md` - How automated verification works
- `/EMAIL_NOTIFICATIONS.md` - Email notification system
- `/src/actions/ten-dlc-registration.ts` - Core verification logic
- `/src/lib/telnyx/ten-dlc.ts` - Telnyx API functions

---

## Summary

✅ **Level 2 verification is required** - This is the blocker causing the 403 error
✅ **One-time manual step** - Platform owner completes this once
✅ **48-hour timeline** - Approval typically within 48 hours
✅ **After approval** - All verification happens automatically via API
✅ **ServiceTitan did this too** - Same process for all ISV platforms
✅ **Worth the effort** - Enables professional, seamless customer experience

**Once Level 2 is approved, your platform will match ServiceTitan's automation capabilities.**

---

**Created**: 2025-11-18
**Status**: Awaiting Level 2 Verification Approval
**Next Action**: Platform owner submits Level 2 verification in Telnyx Portal
