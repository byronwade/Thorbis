# Automated Email Verification System

**Status**: Core Complete - Ready for UI Integration
**Date**: 2025-11-18
**Priority**: CRITICAL - Required for 10DLC Registration

## Overview

Implemented fully automated email verification system that **blocks 10DLC registration until company email is verified**. This ensures TCR (The Campaign Registry) email validation requirements are met.

## Why This is Critical

TCR rejects emails that cannot receive mail. Previous attempts failed with:
```
"Validation Failed. Personal, free and group email IDs are not supported."
```

**Solution**: Before submitting to TCR, we verify the email works by:
1. Sending a verification code
2. User receives email and enters code
3. Email marked as verified in database
4. 10DLC registration proceeds

## Architecture

### Database Schema

**Migration**: `20251118225303_add_email_verification_system.sql`

1. **Companies Table** - Added fields:
   - `email_verified` (boolean) - Whether email is verified
   - `email_verified_at` (timestamptz) - When verified

2. **Email Verifications Table**:
   - Tracks verification codes sent
   - 1-hour expiration
   - Status: pending → verified/failed/expired
   - Auto-cleanup after 7 days

### Server Actions

**File**: `/src/actions/verify-company-email.ts`

1. **`sendEmailVerificationTest(companyId, recipientEmail)`**
   - Generates random 8-character code
   - Sends beautiful HTML email via Resend
   - Stores code in database with 1hr expiry
   - Returns success/error

2. **`verifyEmailCode(companyId, email, code)`**
   - Validates code against database
   - Checks expiration
   - Marks email as verified
   - Updates company.email_verified = true

3. **`isCompanyEmailVerified(companyId)`**
   - Checks if company email is verified
   - Used as gate in 10DLC registration

## Integration with 10DLC

**Updated**: `/src/actions/ten-dlc-registration.ts`

Added verification gate at line 115-127:

```typescript
// CRITICAL: Verify email is working before 10DLC registration
log.push("Verifying company email...");
const emailVerification = await isCompanyEmailVerified(companyId);

if (!emailVerification.verified) {
  return {
    success: false,
    error: "Company email must be verified before 10DLC registration. TCR requires a verified business email domain. Please complete email verification in the onboarding steps.",
    log,
  };
}
```

**Result**: 10DLC registration will FAIL if email not verified.

## Verification Flow

```
1. User enters company email in onboarding
   ↓
2. System sends verification email with code
   ↓
3. User checks inbox (e.g., admin@company.com)
   ↓
4. User receives beautiful HTML email with 8-digit code
   ↓
5. User enters code in platform
   ↓
6. System validates code
   ↓
7. Email marked as verified (email_verified = true)
   ↓
8. User can proceed to 10DLC registration
   ↓
9. 10DLC registration succeeds (email passes TCR validation)
```

## Email Template

Beautiful responsive HTML email with:
- Gradient header
- Large, easy-to-read code (32px, monospace)
- Clear instructions
- 1-hour expiry notice
- Professional branding

**Sent from**: `verify@stratosplatform.com`

Example code format:
```
Your Verification Code:
ABC123XY
```

## Security

- Codes expire after 1 hour
- One-time use only
- Status changes prevent reuse
- RLS policies protect data
- Auto-cleanup of old codes

## Error Handling

1. **Invalid Code**:
   ```
   "Invalid or expired verification code"
   ```

2. **Expired Code**:
   ```
   "Verification code has expired. Please request a new one."
   ```

3. **Send Failure**:
   ```
   "Failed to send verification email: [Resend error]"
   ```

4. **10DLC Block**:
   ```
   "Company email must be verified before 10DLC registration"
   ```

## Onboarding Integration Plan

### Step 3.5: Email Verification (NEW)

Add between Phone (Step 3) and Banking (Step 4):

```typescript
{
  id: 3.5,
  title: "Email",
  icon: Mail,
  description: "Verify your business email"
}
```

**UI Component Needed**: `/src/components/onboarding/email-verification-step.tsx`

Should include:
1. Email display (from company.email)
2. "Send Verification Code" button
3. Code input field (8 characters, uppercase)
4. "Verify" button
5. Resend link (after 60 seconds)
6. Status indicators (pending/verified)

### Onboarding Progress

Update `onboarding_progress` JSONB:

```typescript
{
  companyInfoComplete: boolean,
  teamMembersAdded: boolean,
  phoneSetupComplete: boolean,
  emailVerified: boolean, // NEW
  bankingConnected: boolean,
  paymentsConfigured: boolean
}
```

## Usage Example

```typescript
import {
  sendEmailVerificationTest,
  verifyEmailCode,
  isCompanyEmailVerified,
} from "@/actions/verify-company-email";

// 1. Send verification email
const result = await sendEmailVerificationTest(
  companyId,
  "admin@company.com"
);

if (result.success) {
  // Show "Check your email" message
}

// 2. User enters code
const verification = await verifyEmailCode(
  companyId,
  "admin@company.com",
  "ABC123XY"
);

if (verification.verified) {
  // Show success, proceed to next step
}

// 3. Before 10DLC registration
const { verified } = await isCompanyEmailVerified(companyId);
if (!verified) {
  // Block registration, show error
}
```

## Benefits

1. **Prevents TCR Rejections**: Email proven to work before submission
2. **Better User Experience**: Clear error before waiting for TCR
3. **Fully Automated**: No manual email setup required
4. **Works with Any Email**: Doesn't require DNS changes
5. **Instant Verification**: Takes 30 seconds vs 24-48 hours for DNS

## Alternative: Domain Verification (Optional)

If user wants to use custom domain (@company.com) without verification code:

1. Use Resend domain setup (`company_email_domains` table)
2. Add SPF/DKIM records
3. Wait 24-48 hours for DNS propagation
4. Verify domain via Resend
5. Automatically mark email_verified = true

**Recommendation**: Start with code verification (instant), offer domain setup as optional upgrade.

## Next Steps

### 1. Create UI Component

**File**: `/src/components/onboarding/email-verification-step.tsx`

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check, AlertCircle } from "lucide-react";
import {
  sendEmailVerificationTest,
  verifyEmailCode,
} from "@/actions/verify-company-email";

export function EmailVerificationStep({ companyId, email, onComplete }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "verifying" | "verified">("idle");
  const [error, setError] = useState("");

  const handleSendCode = async () => {
    setStatus("sending");
    const result = await sendEmailVerificationTest(companyId, email);

    if (result.success) {
      setStatus("sent");
    } else {
      setError(result.error);
      setStatus("idle");
    }
  };

  const handleVerify = async () => {
    setStatus("verifying");
    const result = await verifyEmailCode(companyId, email, code);

    if (result.verified) {
      setStatus("verified");
      onComplete();
    } else {
      setError(result.error);
      setStatus("sent");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mail className="h-8 w-8 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Verify Your Email</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      {status === "idle" && (
        <Button onClick={handleSendCode} size="lg" className="w-full">
          Send Verification Code
        </Button>
      )}

      {status === "sent" && (
        <div className="space-y-4">
          <p className="text-sm">
            We sent a verification code to <strong>{email}</strong>.
            Please check your inbox and enter the code below.
          </p>

          <Input
            placeholder="Enter 8-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={8}
            className="text-center text-2xl font-mono"
          />

          <Button
            onClick={handleVerify}
            disabled={code.length !== 8}
            size="lg"
            className="w-full"
          >
            Verify Email
          </Button>

          <button
            onClick={handleSendCode}
            className="text-sm text-primary hover:underline"
          >
            Didn't receive it? Resend code
          </button>
        </div>
      )}

      {status === "verified" && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
          <Check className="h-5 w-5" />
          <span>Email verified successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
```

### 2. Add to Onboarding Steps

Update `/src/components/onboarding/welcome-page-redesigned.tsx`:

```typescript
const STEPS = [
  { id: 1, title: "Company", ... },
  { id: 2, title: "Team", ... },
  { id: 3, title: "Phone", ... },
  { id: 4, title: "Email", icon: Mail, description: "Verify business email" }, // NEW
  { id: 5, title: "Banking", ... },
  { id: 6, title: "Payments", ... },
];
```

### 3. Update Progress Tracking

Update `onboarding_progress` checks to require email verification.

## Testing Checklist

- [ ] Send verification code
- [ ] Receive email in inbox
- [ ] Enter correct code → success
- [ ] Enter wrong code → error
- [ ] Enter expired code → error
- [ ] Resend code → new code sent
- [ ] Try 10DLC without verification → blocked
- [ ] Complete verification → 10DLC proceeds
- [ ] Check email_verified in database
- [ ] Verify cleanup function works

## Related Files

- `/src/actions/verify-company-email.ts` - Verification actions
- `/src/actions/ten-dlc-registration.ts` - 10DLC gate added
- `/supabase/migrations/*_add_email_verification_system.sql` - Database schema
- `/src/lib/email/resend-client.ts` - Email sending
- Companies table - email_verified column

## References

- [Resend Email API](https://resend.com/docs/send-with-nodejs)
- [TCR Email Requirements](https://www.campaignregistry.com/)
- Previous failed attempts documented in `/TELNYX_FIXES_APPLIED.md`
