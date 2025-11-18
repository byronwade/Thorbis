# Telnyx Account Verification System

Complete guide to the Telnyx account verification workflow and 10DLC registration process.

---

## Overview

The Telnyx verification system guides users through the mandatory account verification process required before they can use 10DLC business messaging. This system provides real-time status updates and automated setup after verification is complete.

## Why Verification is Required

### Legal Requirements

The **TRACED Act** (Telephone Robocall Abuse Criminal Enforcement and Deterrence Act) is a federal law that requires:

1. **Manual Identity Verification** - Human reviewers must validate identity documents
2. **Business Verification** - Companies must prove legitimate business ownership
3. **Anti-Fraud Measures** - Prevents automated spam/robocall operations
4. **Compliance Monitoring** - Ongoing audits by The Campaign Registry

### Cannot Be Automated

**Critical**: Steps 1-2 (account verification) CANNOT be automated because:

- Federal regulations require manual document review
- Telnyx compliance teams must validate documents
- The Campaign Registry enforces strict anti-fraud measures
- AI/automation is prohibited for identity verification

**Can Be Automated**: Steps 3-7 (after verification) are fully automated by our platform.

---

## Verification Levels

### Level 1: Identity Verification

**Purpose**: Verify the identity of the account owner

**Required Documents**:
- Valid government-issued photo ID (Driver's License, Passport, State ID)
- Payment method (credit card or bank account)
- Phone number verification
- Email verification
- Business address confirmation

**Timeline**: 1-2 business days after document submission

**Where to Complete**: https://portal.telnyx.com/#/app/account/public-profile

### Level 2: Business Verification

**Purpose**: Verify legitimate business ownership (required for 10DLC)

**Required Documents**:
- **IRS EIN Confirmation Letter** (CP 575 or 147C form) - [Download from IRS](https://www.irs.gov/)
- **Business License** OR **Articles of Incorporation**
- **Proof of Business Address**:
  - Recent utility bill (electric, gas, water)
  - Business lease agreement
  - Property tax bill
- **Tax Documents**:
  - Completed W-9 form
  - Recent business tax return (1120, 1065, etc.)
- **Business Owner ID** (same person as Level 1)

**Timeline**: 2-5 business days after document submission

**Where to Complete**: https://portal.telnyx.com/#/app/account/verifications

---

## Complete Workflow (7 Steps)

### Step 1: Level 1 Verification (Manual - 1-2 Days)

**Actions Required**:
1. Visit Telnyx Portal
2. Navigate to Account → Public Profile
3. Upload government-issued ID
4. Add payment method
5. Verify phone number and email
6. Confirm business address

**Status**: ⏳ Waiting for Telnyx review

**Cannot Automate**: Manual document review required by law

---

### Step 2: Level 2 Verification (Manual - 2-5 Days)

**Actions Required**:
1. Visit Telnyx Portal
2. Navigate to Account → Verifications
3. Upload:
   - IRS EIN Letter (CP 575 or 147C)
   - Business License or Articles of Incorporation
   - Proof of address (utility bill/lease)
   - W-9 or tax return
   - Business owner ID

**Status**: ⏳ Waiting for Telnyx compliance review

**Cannot Automate**: Federal regulations require manual review

---

### Step 3: Create 10DLC Brand (Automated - Instant)

**What Happens**:
- Platform automatically creates 10DLC brand with The Campaign Registry
- Uses company data from database:
  - Company name, EIN, phone, address
  - Business vertical (determined from industry)
  - Contact information

**Status**: ✅ Automated via platform

**Code**: `src/actions/ten-dlc-registration.ts` → `registerCompanyFor10DLC()`

**API**: `POST /10dlc/brand` (Telnyx)

---

### Step 4: Submit to Campaign Registry (Automated - Instant)

**What Happens**:
- Brand is submitted to The Campaign Registry for approval
- Registry validates brand data
- Creates unique Brand ID

**Status**: ✅ Automated by Telnyx

**Timeline**: Instant approval for most businesses

---

### Step 5: Create Messaging Campaign (Automated - Instant)

**What Happens**:
- Platform creates 10DLC campaign for the approved brand
- Campaign defines:
  - Use case: MIXED (most flexible)
  - Message flow description
  - Opt-in/opt-out keywords
  - Sample messages

**Status**: ✅ Automated via platform

**Code**: `src/actions/ten-dlc-registration.ts` → `registerCompanyFor10DLC()`

**API**: `POST /10dlc/campaignBuilder` (Telnyx)

---

### Step 6: Campaign Registry Approval (Automated - Instant)

**What Happens**:
- The Campaign Registry approves the campaign
- Campaign assigned unique Campaign ID
- Phone numbers can now be attached

**Status**: ✅ Automated by Telnyx

**Timeline**: Instant for standard campaigns

---

### Step 7: Attach Phone Numbers (Automated - Instant)

**What Happens**:
- Platform attaches all company phone numbers to the approved campaign
- Numbers are now authorized for A2P messaging
- Business SMS sending is enabled

**Status**: ✅ Automated via platform

**Code**: `src/actions/ten-dlc-registration.ts` → `registerCompanyFor10DLC()`

**API**: `POST /messaging_profiles/{id}/phone_numbers` (Telnyx)

---

## Architecture

### File Structure

```
src/
├── lib/
│   └── telnyx/
│       ├── account-verification.ts    # Verification status checking
│       ├── ten-dlc.ts                  # 10DLC API integration
│       └── api.ts                      # Base Telnyx API client
├── actions/
│   └── ten-dlc-registration.ts         # Server actions for automation
├── components/
│   └── settings/
│       └── telnyx-verification-status.tsx  # Real-time status component
└── app/
    └── (dashboard)/
        └── settings/
            └── telnyx-verification/
                └── page.tsx             # Verification guide page
```

### Key Components

#### 1. Account Verification Checker (`account-verification.ts`)

**Purpose**: Check current verification level via Telnyx API

**Methods**:
- `checkAccountVerificationStatus()` - Query Telnyx for verification level
- `getVerificationRequirements()` - Return required documents by level
- `getNextSteps()` - Generate step-by-step action items

**API Strategy**:
```typescript
// Try direct verification endpoint
GET /account/verifications

// Fallback: Infer from 10DLC access
GET /10dlc/brand
// - 403 error = Level 1 complete, Level 2 pending
// - 200 success = Level 2 complete
// - Other error = No verification
```

#### 2. Real-Time Status Component (`telnyx-verification-status.tsx`)

**Purpose**: Display live verification status and guide users

**Features**:
- Real-time status polling
- Progress indicators for each level
- Dynamic next steps based on current state
- Required documents checklist
- Refresh button for status updates

**State Management**:
```typescript
const [data, setData] = useState<VerificationData | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**API Call**:
```typescript
const result = await checkTelnyxVerificationStatus();
// Calls server action which checks Telnyx API
```

#### 3. Automated Registration (`ten-dlc-registration.ts`)

**Purpose**: Automated 10DLC setup after verification complete

**Flow**:
```typescript
export async function registerCompanyFor10DLC(companyId: string) {
  // 1. Fetch company data
  const company = await supabase.from('companies').select('*').eq('id', companyId).single();

  // 2. Create 10DLC brand
  const brandResult = await createTenDlcBrand({
    displayName: company.name,
    companyName: company.name,
    ein: company.ein,
    phone: company.phone,
    street: company.address,
    // ... more fields
  });

  // 3. Create 10DLC campaign
  const campaignResult = await createTenDlcCampaign({
    brandId: brandResult.id,
    usecase: "MIXED",
    description: `Business messaging for ${company.name}`,
    // ... more fields
  });

  // 4. Attach phone numbers
  for (const phoneNumber of phoneNumbers) {
    await attachNumberToCampaign(phoneNumber.id, campaignResult.campaignId);
  }

  // 5. Update database
  await supabase.from('company_telnyx_settings')
    .update({
      ten_dlc_brand_id: brandResult.id,
      ten_dlc_campaign_id: campaignResult.campaignId,
      ten_dlc_status: 'active'
    })
    .eq('company_id', companyId);
}
```

---

## User Experience

### Initial State (Not Verified)

**What User Sees**:
```
┌─────────────────────────────────────────┐
│ Verification Status                     │
│ [🔴 Not Verified]        [Refresh]     │
├─────────────────────────────────────────┤
│ Progress Overview:                      │
│ [⏰ Level 1] [⏰ Level 2] [⏰ 10DLC]    │
│                                         │
│ ⚠️ Estimated Completion: 7 days        │
│                                         │
│ Requirements Remaining:                 │
│ • Complete Level 1 verification         │
│ • Complete Level 2 verification         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Next Steps                              │
├─────────────────────────────────────────┤
│ [1] Complete Level 1 Verification       │
│     Visit Telnyx Portal → Account       │
│     [Open Portal]                       │
└─────────────────────────────────────────┘
```

**User Actions**:
1. Click "Open Portal"
2. Complete Level 1 verification
3. Return to platform and click "Refresh"

---

### Level 1 Complete (Waiting for Level 2)

**What User Sees**:
```
┌─────────────────────────────────────────┐
│ Verification Status                     │
│ [🔵 Level 1 Complete]    [Refresh]     │
├─────────────────────────────────────────┤
│ Progress Overview:                      │
│ [✅ Level 1] [⏰ Level 2] [⏰ 10DLC]    │
│                                         │
│ ⚠️ Estimated Completion: 5 days        │
│                                         │
│ Requirements Remaining:                 │
│ • Complete Level 2 verification         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Next Steps                              │
├─────────────────────────────────────────┤
│ [1] Complete Level 2 Verification       │
│     Upload business documents           │
│     [Open Portal]                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Level 2 Requirements                    │
├─────────────────────────────────────────┤
│ ○ IRS EIN Confirmation Letter           │
│ ○ Business License                      │
│ ○ Proof of Business Address             │
│ ○ Tax documents (W-9)                   │
└─────────────────────────────────────────┘
```

**User Actions**:
1. Gather required documents
2. Click "Open Portal"
3. Upload documents to Telnyx
4. Wait 2-5 business days
5. Return to platform and click "Refresh"

---

### Level 2 Complete (Ready for Automation)

**What User Sees**:
```
┌─────────────────────────────────────────┐
│ Verification Status                     │
│ [🟢 Level 2 Complete]    [Refresh]     │
├─────────────────────────────────────────┤
│ Progress Overview:                      │
│ [✅ Level 1] [✅ Level 2] [✅ 10DLC]    │
│                                         │
│ ✅ Verification Complete!               │
│ Your account is fully verified.         │
│ You can now proceed with automated      │
│ 10DLC brand and campaign setup.         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Next Steps                              │
├─────────────────────────────────────────┤
│ [1] Create 10DLC Brand & Campaign       │
│     Run automated setup (fully auto)    │
│     [Continue →]                        │
└─────────────────────────────────────────┘
```

**User Actions**:
1. Click "Continue"
2. Platform automatically:
   - Creates 10DLC brand
   - Creates 10DLC campaign
   - Attaches phone numbers
3. Setup complete in < 1 minute
4. Business SMS sending enabled immediately

---

## Error Handling

### Verification Rejected

**Scenario**: Telnyx rejects verification documents

**What Happens**:
1. Telnyx sends email with rejection reason:
   - "Document quality too low"
   - "Information mismatch"
   - "Missing required documents"
2. User sees status still showing as pending
3. User clicks "Refresh" to see updated requirements

**Resolution**:
1. Address issues mentioned in Telnyx email
2. Re-upload corrected documents
3. Wait for new review (1-2 days)

### 10DLC Registration Fails

**Scenario**: User tries to create brand before Level 2 complete

**Error Shown**:
```
Failed to create 10DLC brand: Telnyx 403: You have not completed
the verifications required to perform this action. Check the
'verifications' tab under 'account' on the portal for more information.
```

**What System Does**:
1. Detects 403 error in `registerCompanyFor10DLC()`
2. Returns error with clear instructions
3. Redirects user to verification page
4. Shows current verification status
5. Guides user through remaining steps

**Code**:
```typescript
// In sendTextMessage() - auto-retry with 10DLC registration
if (result.error?.includes("10DLC") || result.error?.includes("403")) {
  const registrationResult = await registerCompanyFor10DLC(params.companyId);

  if (!registrationResult.success) {
    return {
      success: false,
      error: `10DLC registration failed: ${registrationResult.error}`
    };
  }

  // Retry SMS send
  const retryResult = await sendSMS({...});
}
```

---

## Testing Verification Flow

### Local Testing (Development)

**Note**: Cannot fully test verification locally - requires real Telnyx account

**What Can Be Tested**:
1. ✅ UI components (status display, step indicators)
2. ✅ Error handling (mock 403 errors)
3. ✅ Document checklist display
4. ✅ Next steps generation
5. ❌ Actual verification status (requires Telnyx API)

**Mock Data for Testing**:
```typescript
// Test Level 1 pending
const mockData = {
  currentLevel: "none",
  isLevel1Complete: false,
  isLevel2Complete: false,
  canCreate10DLC: false,
  requirementsRemaining: ["Complete Level 1 verification"],
  estimatedCompletionDays: 7
};

// Test Level 2 pending
const mockData = {
  currentLevel: "level_1",
  isLevel1Complete: true,
  isLevel2Complete: false,
  canCreate10DLC: false,
  requirementsRemaining: ["Complete Level 2 verification"],
  estimatedCompletionDays: 5
};

// Test verified
const mockData = {
  currentLevel: "level_2",
  isLevel1Complete: true,
  isLevel2Complete: true,
  canCreate10DLC: true,
  requirementsRemaining: [],
  estimatedCompletionDays: undefined
};
```

### Production Testing

**Real Verification Flow**:
1. Create fresh Telnyx account
2. Navigate to `/dashboard/settings/telnyx-verification`
3. Follow UI prompts to complete Level 1
4. Upload Level 2 documents
5. Wait for approval (2-7 days)
6. Click "Refresh" to see status update
7. Run automated setup when ready
8. Verify 10DLC brand/campaign created

**Expected Timeline**:
- Level 1 submission → approval: 1-2 days
- Level 2 submission → approval: 2-5 days
- Automated setup: < 1 minute
- Total: 3-7 business days

---

## Costs

### Verification Costs

- **Level 1 Verification**: FREE
- **Level 2 Verification**: FREE

### 10DLC Costs

- **Brand Registration**: $4 one-time (paid to The Campaign Registry)
- **Campaign Fee**: $10/month (paid to The Campaign Registry)
- **SMS Messages**: ~$0.0075 per message (paid to Telnyx)

**Note**: Fees are industry-standard and required by The Campaign Registry, not our platform.

---

## Troubleshooting

### "Verification status not updating"

**Cause**: API caching or delay in Telnyx system

**Solution**:
1. Click "Refresh" button
2. Wait 5 minutes and refresh again
3. Check Telnyx Portal directly for status
4. Contact Telnyx support if status mismatch persists

### "Documents rejected"

**Cause**: Poor quality, mismatch, or missing information

**Solution**:
1. Check rejection email from Telnyx for specific reasons
2. Re-scan documents at higher quality (300+ DPI)
3. Ensure name on ID matches Telnyx account name
4. Verify all required documents are included
5. Resubmit through Telnyx Portal

### "Can't create 10DLC brand"

**Cause**: Level 2 verification not complete

**Solution**:
1. Visit `/dashboard/settings/telnyx-verification`
2. Check current verification level
3. Complete any remaining requirements
4. Wait for Telnyx approval
5. Retry automated setup after verified

### "SMS still failing after 10DLC setup"

**Cause**: Campaign not fully approved or phone number not attached

**Solution**:
1. Check `company_telnyx_settings.ten_dlc_status` = 'active'
2. Verify phone numbers attached to campaign in Telnyx Portal
3. Check Telnyx logs for error details
4. Contact Telnyx support if campaign stuck in pending

---

## Future Enhancements

### Planned Features

1. **Auto-refresh**: Poll verification status every 30 seconds when pending
2. **Email Notifications**: Alert user when verification approved
3. **Document Upload**: Allow document upload directly in platform
4. **Progress Persistence**: Save verification progress in database
5. **Multi-company Support**: Handle multiple companies per user account
6. **Verification History**: Log all verification attempts and status changes

### Potential Improvements

1. **Webhook Integration**: Receive real-time updates from Telnyx
2. **Document Validation**: Pre-validate documents before upload
3. **Inline Help**: Tooltips and examples for each document type
4. **Mobile Support**: Optimize for mobile document capture
5. **Batch Processing**: Handle multiple accounts simultaneously

---

## Summary

The Telnyx verification system provides a complete workflow for:

✅ **Checking verification status** - Real-time API queries
✅ **Guiding users through manual steps** - Clear instructions and document checklists
✅ **Automating post-verification setup** - 10DLC brand/campaign creation
✅ **Handling errors gracefully** - Clear error messages and recovery steps
✅ **Providing transparency** - FAQ and timeline expectations

**Key Principle**: Manual verification (Steps 1-2) cannot be automated due to federal law. Everything after verification (Steps 3-7) is fully automated by our platform.

**User Benefit**: Users complete verification once, and the platform handles all subsequent setup automatically, reducing time from 1+ hour manual work to < 1 minute automated setup.

---

For questions or issues, refer to:
- Telnyx Support: https://support.telnyx.com/
- The Campaign Registry: https://www.campaignregistry.com/
- This platform's verification page: `/dashboard/settings/telnyx-verification`
