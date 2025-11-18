# Onboarding Flow with Telnyx Verification

Complete guide to the updated onboarding process that includes Telnyx account verification.

---

## Overview

The onboarding flow now includes a mandatory **Telnyx Verification** step to ensure users are aware of the verification requirements before they can send business text messages. This step can be skipped during initial setup, but users are clearly informed they won't be able to send SMS/MMS until verification is complete.

---

## Updated Onboarding Steps

### Step 1: Company Information ✅

**Required**: Yes

**What User Provides**:
- Company name
- Industry
- Company size
- Phone number
- Address (street, city, state, zip)
- Website (optional)
- Tax ID/EIN

**Duration**: 2-3 minutes

**Next**: Automatically proceeds to Step 2

---

### Step 2: Team Members ✅

**Required**: Yes (at least current user)

**What User Provides**:
- Team member information (name, email, role, phone)
- Current user is auto-added as owner
- Option to add additional team members
- Bulk upload via CSV (optional)

**Duration**: 1-5 minutes

**Next**: Automatically proceeds to Step 3

---

### Step 3: Bank Account Connection ✅

**Required**: Yes

**What Happens**:
- User connects bank account via Plaid
- Bank-level security (256-bit encryption)
- Used for payment processing and invoicing
- Can add multiple accounts

**Duration**: 2-3 minutes

**Next**: Automatically proceeds to Step 4

---

### Step 4: Telnyx Verification (NEW) ⚠️

**Required**: No (can skip, but required before sending messages)

**What User Sees**:

```
┌─────────────────────────────────────────────────────────┐
│ ⚠️ Verification Required Before Sending Messages       │
│                                                         │
│ Federal law (TRACED Act) requires account              │
│ verification before you can send business text         │
│ messages. This is a one-time process.                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Telnyx Account Verification                            │
│ 🔴 Not Verified                    [Refresh Status]    │
├─────────────────────────────────────────────────────────┤
│ Progress:                                               │
│ [⏰ Level 1] [⏰ Level 2] [⏰ SMS Enabled]              │
│   1-2 days    2-5 days                                 │
│                                                         │
│ ⏰ Expected Timeline: 7 business days                  │
│                                                         │
│ ⚠️ You cannot send text messages until verification   │
│    is complete. This is a federal requirement.         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ What You Need to Do:                                   │
├─────────────────────────────────────────────────────────┤
│ [1] Complete Level 1 Verification                      │
│     Visit Telnyx Portal → Account → Public Profile     │
│     Upload ID, add payment method, verify contact      │
│     [Open Telnyx Portal]                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Need Help with Verification?                           │
│ • Contact Telnyx Support: support.telnyx.com           │
│ • Check status in Telnyx Portal                        │
│ • Review our detailed verification guide               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ What You'll Get After Verification                     │
│ ✓ Business SMS/MMS                                     │
│ ✓ Voice Calls                                          │
│ ✓ Read Receipts (RCS)                                  │
│ ✓ Two-Way Messaging                                    │
└─────────────────────────────────────────────────────────┘

Note: You can complete verification later, but you won't
be able to send text messages until it's done.

[Skip for Now (I'll Complete This Later)]  [Complete Setup]
```

**User Options**:
1. **Skip for Now** - Proceeds to payment, can complete verification later
2. **Complete Setup** - Proceeds to payment (verification happens async)

**Duration**:
- Immediate (if skipping)
- 3-7 business days (if completing verification)

**Next**: Proceeds to payment/subscription setup

---

## Key Messages to Users

### During Onboarding

**Critical Messages**:

1. **Verification Required Alert** (Top of Step 4):
   ```
   ⚠️ Verification Required Before Sending Messages

   Federal law (TRACED Act) requires account verification
   before you can send business text messages. This is a
   one-time process.
   ```

2. **Timeline Warning**:
   ```
   ⏰ Expected Timeline: 3-7 business days

   You cannot send text messages until verification is
   complete. This is a federal requirement, not a platform
   limitation.
   ```

3. **What's Required**:
   - Clear breakdown of Level 1 and Level 2 requirements
   - Estimated time for each level (1-2 days, 2-5 days)
   - Direct links to Telnyx Portal

4. **Help & Support**:
   - Telnyx Support link: https://support.telnyx.com/
   - Link to platform verification guide
   - Contact information if stuck

5. **Skip Option**:
   ```
   Note: You can complete verification later, but you won't
   be able to send text messages until it's done.

   [Skip for Now (I'll Complete This Later)]
   ```

### After Onboarding (If Verification Skipped)

**Where Users Can Complete Verification**:
- `/dashboard/settings/telnyx-verification` - Dedicated verification page
- Navigation: Settings → Integrations → Telnyx Verification

**Reminders**:
- Dashboard banner: "Complete Telnyx verification to enable messaging"
- SMS send attempts show clear error: "Verification required to send messages"
- Link to verification page in error messages

---

## User Journey Examples

### Scenario 1: User Completes Verification During Onboarding

**Timeline**: ~10 minutes onboarding + 3-7 days verification

1. **Step 1-3**: Fill company info, add team, connect bank (8 minutes)
2. **Step 4**: See Telnyx verification requirement
3. **Action**: Click "Open Telnyx Portal"
4. **Telnyx Portal**: Complete Level 1 verification (upload ID, payment)
5. **Return to Platform**: Click "Refresh Status"
6. **See**: "Level 1 pending review (1-2 days)"
7. **Action**: Click "Skip for Now" to complete onboarding
8. **Result**: Onboarding complete, verification pending
9. **2 Days Later**: Level 1 approved, upload Level 2 docs
10. **5 Days Later**: Level 2 approved, SMS enabled automatically

**User Experience**:
- ✅ Clear expectations set upfront
- ✅ Can complete onboarding immediately
- ✅ SMS enabled automatically when verification completes
- ✅ No surprises about wait times

---

### Scenario 2: User Skips Verification During Onboarding

**Timeline**: ~10 minutes onboarding

1. **Step 1-3**: Fill company info, add team, connect bank (8 minutes)
2. **Step 4**: See Telnyx verification requirement
3. **Action**: Read requirements, decide to complete later
4. **Action**: Click "Skip for Now"
5. **Result**: Onboarding complete, no verification started

**Later**: User tries to send SMS
6. **Error**: "Telnyx 403: You have not completed the verifications required"
7. **Action**: Click link to `/dashboard/settings/telnyx-verification`
8. **Guided Flow**: Follow verification steps
9. **3-7 Days**: Verification completes
10. **SMS Enabled**: Can now send messages

**User Experience**:
- ✅ Not blocked from completing onboarding
- ✅ Clear error message when trying to send SMS
- ✅ Easy access to verification guide
- ✅ Can complete at their own pace

---

### Scenario 3: User Already Verified (Returning User)

**Timeline**: ~10 minutes onboarding

1. **Step 1-3**: Fill company info, add team, connect bank (8 minutes)
2. **Step 4**: See Telnyx verification status check
3. **Auto-detect**: System checks Telnyx API
4. **Result**: "✅ Level 2 Complete - SMS Enabled"
5. **Display**:
   ```
   ✅ Verification Complete!
   Your account is fully verified. The automated 10DLC
   setup will run automatically when you click "Complete
   Setup" below. This takes less than 1 minute.
   ```
6. **Action**: Click "Complete Setup"
7. **Auto-run**: 10DLC brand/campaign creation (< 1 minute)
8. **Result**: SMS enabled immediately

**User Experience**:
- ✅ No duplicate verification required
- ✅ Automatic detection of verified status
- ✅ Immediate SMS access
- ✅ Seamless onboarding experience

---

## Technical Implementation

### Files Modified

1. **`/src/components/onboarding/welcome-page-client.tsx`**
   - Added Step 4 (Telnyx Verification)
   - Updated STEPS array to include messaging step
   - Modified handleNext() to handle step 4
   - Changed button text for step 4

2. **`/src/components/onboarding/telnyx-verification-step.tsx`** (NEW)
   - Real-time verification status checking
   - Progress indicators for Level 1, Level 2, SMS
   - Next steps with direct links
   - Help & support section
   - Features available after verification
   - Skip option

### User Flow Logic

```typescript
// Step 4 in welcome-page-client.tsx
{currentStep === 4 && companyId && (
  <TelnyxVerificationStep
    companyId={companyId}
    onSkip={() => {
      // User chooses to complete later
      router.push("/dashboard");
    }}
    onComplete={() => {
      // Auto-called when verification detected as complete
      handleNext(); // Proceeds to payment
    }}
  />
)}

// handleNext() for step 4
else if (currentStep === 4) {
  // Save progress
  await saveStepProgress(4, {
    telnyxVerification: "skipped",
    completed: true,
  });

  // Proceed to payment (verification is async)
  await handlePayment();
}
```

### Status Checking

**Real-Time API Check**:
```typescript
// TelnyxVerificationStep component
const fetchStatus = async () => {
  const result = await checkTelnyxVerificationStatus();

  if (result.success && result.data) {
    setData(result.data);

    // Auto-complete if Level 2 is done
    if (result.data.canCreate10DLC && onComplete) {
      setTimeout(() => {
        onComplete(); // Triggers automatic completion
      }, 2000);
    }
  }
};
```

**Auto-Refresh**:
- User can click "Refresh Status" button anytime
- Component polls on mount
- Updates progress indicators in real-time

---

## Error Handling

### During Onboarding

**If Status Check Fails**:
```
❌ Error Checking Verification Status
Failed to check verification status

[Try Again]
```

**Action**: User can retry or skip and complete later

### After Onboarding

**If User Tries to Send SMS Without Verification**:
```
Failed to send SMS: Telnyx 403: You have not completed
the verifications required to perform this action.

Complete verification at Settings → Telnyx Verification
[Go to Verification]
```

**Action**: Link directs to verification guide

---

## Benefits of This Approach

### For Users

✅ **Clear Expectations**
- Know upfront that messaging requires verification
- Understand timeline (3-7 business days)
- No surprises when trying to send SMS

✅ **Flexible Completion**
- Can skip during onboarding
- Complete at their own pace
- Not blocked from using other features

✅ **Guided Process**
- Step-by-step instructions
- Direct links to Telnyx Portal
- Help & support readily available

✅ **Automatic Detection**
- Returning users with verification skip this step
- Status updates automatically
- SMS enabled immediately when verification completes

### For Platform

✅ **Reduced Support Tickets**
- Users know why they can't send SMS
- Clear documentation and guidance
- Telnyx support contact readily available

✅ **Better Conversion**
- Users can complete onboarding immediately
- Verification doesn't block setup
- SMS enabled automatically when ready

✅ **Compliance**
- Federal requirements clearly communicated
- Users informed of legal obligations
- Proper verification workflow enforced

---

## Testing

### Test Onboarding Flow

1. **New User (Not Verified)**:
   - Complete steps 1-3
   - See verification requirements at step 4
   - Verify timeline warnings displayed
   - Verify help links work
   - Click "Skip for Now"
   - Confirm redirected to dashboard
   - Try to send SMS → verify error message
   - Click verification link → verify guide loads

2. **Existing User (Level 1 Complete)**:
   - Complete steps 1-3
   - Verify status shows "Level 1 Complete"
   - Verify Level 2 requirements displayed
   - Verify estimated time shown (5 days)
   - Click "Refresh Status" → verify no errors

3. **Verified User (Level 2 Complete)**:
   - Complete steps 1-3
   - Verify status shows "Level 2 Complete"
   - Verify success message displayed
   - Click "Complete Setup"
   - Verify 10DLC setup runs automatically
   - Verify SMS enabled immediately

### Test Error Cases

1. **Status Check Fails**:
   - Mock API error
   - Verify error alert displayed
   - Verify "Try Again" button works
   - Verify user can still skip

2. **Telnyx API Down**:
   - Mock timeout
   - Verify error message clear
   - Verify skip option still available

---

## Documentation Links

- **For Users**: `/dashboard/settings/telnyx-verification`
- **Technical Docs**: `/TELNYX_VERIFICATION.md`
- **Summary**: `/TELNYX_VERIFICATION_SUMMARY.md`
- **Telnyx Support**: https://support.telnyx.com/

---

## Summary

The updated onboarding flow:

✅ **Informs users upfront** about Telnyx verification requirements
✅ **Sets clear expectations** about 3-7 day timeline
✅ **Allows flexible completion** - skip during onboarding, complete later
✅ **Provides comprehensive guidance** - step-by-step instructions, links, support
✅ **Handles all scenarios** - new users, partially verified, fully verified
✅ **Enables automatic completion** - SMS enabled immediately when verification completes
✅ **Improves user experience** - no surprises, clear communication, helpful errors

**Result**: Users are fully aware of verification requirements, timelines, and support options before committing to the platform.
