# Email Notifications for Onboarding Verification

**Complete guide to the automated email notification system for Telnyx verification during onboarding.**

---

## Overview

The email notification system sends two automated emails during the onboarding verification process:

1. **Verification Submitted Email** - Sent immediately after user submits verification
2. **Verification Complete Email** - Sent when toll-free verification is approved (future implementation)

This provides a professional, ServiceTitan-style experience where users are kept informed throughout the verification process.

---

## Email Flow

### Scenario 1: User has both toll-free and regular (10DLC) numbers

**Timeline**: Immediate → 5-7 days

1. **User submits verification** (Onboarding Step 4)
2. **Email 1 sent immediately**: "Verification Submitted"
   - ✅ Confirms 10DLC numbers are ready (instant approval)
   - ⏰ Explains toll-free numbers need 5-7 days
   - Shows both timeline cards in email
3. **5-7 days later**: Toll-free verification approved
4. **Email 2 sent** (future): "Verification Complete"
   - 🎉 Confirms all numbers are ready
   - Provides quick start guide
   - Links to messaging dashboard

### Scenario 2: User has only 10DLC numbers

**Timeline**: Immediate

1. **User submits verification** (Onboarding Step 4)
2. **Email 1 sent immediately**: "Verification Submitted"
   - ✅ Confirms 10DLC numbers are ready (instant approval)
   - No toll-free mention
3. **No Email 2 needed** - Everything is already approved

### Scenario 3: User has only toll-free numbers

**Timeline**: Immediate → 5-7 days

1. **User submits verification** (Onboarding Step 4)
2. **Email 1 sent immediately**: "Verification Submitted"
   - ⏰ Explains toll-free numbers need 5-7 days
   - No 10DLC mention
3. **5-7 days later**: Toll-free verification approved
4. **Email 2 sent** (future): "Verification Complete"
   - 🎉 Confirms toll-free numbers are ready

---

## Technical Implementation

### Email Templates

**Location**: `/emails/templates/onboarding/`

1. **verification-submitted.tsx** - First email template
   - Responsive design
   - Timeline cards (green for 10DLC, amber for toll-free)
   - What to expect section
   - Support contact info
   - Federal compliance note

2. **verification-complete.tsx** - Second email template (for future use)
   - Celebration design
   - Features list (SMS/MMS, two-way messaging, etc.)
   - Quick start guide
   - CTA to messaging dashboard

### Email Types

**Location**: `/src/lib/email/email-types.ts`

**New Types Added**:
```typescript
export interface VerificationSubmittedProps extends BaseEmailProps {
  companyName: string;
  contactName: string;
  hasTollFreeNumbers: boolean;
  has10DLCNumbers: boolean;
  tollFreeCount?: number;
  dlcCount?: number;
  dashboardUrl: string;
}

export interface VerificationCompleteProps extends BaseEmailProps {
  companyName: string;
  contactName: string;
  verificationTypes: string[]; // ["toll-free", "10dlc"]
  dashboardUrl: string;
  messagingUrl: string;
}

// Email template enum additions:
VERIFICATION_SUBMITTED = "verification-submitted",
VERIFICATION_COMPLETE = "verification-complete",
```

### Email Sending Utilities

**Location**: `/src/lib/email/verification-emails.ts`

**Functions**:

```typescript
export async function sendVerificationSubmittedEmail(
  companyId: string,
  recipientEmail: string,
  context: {
    hasTollFreeNumbers: boolean;
    has10DLCNumbers: boolean;
    tollFreeCount?: number;
    dlcCount?: number;
  }
): Promise<EmailSendResult>
```

**What it does**:
1. Fetches company name from database
2. Fetches contact name (company owner) from database
3. Builds dashboard URL
4. Renders email template with React Email
5. Sends via Resend
6. Logs to `email_logs` table

```typescript
export async function sendVerificationCompleteEmail(
  companyId: string,
  recipientEmail: string,
  verificationTypes: string[]
): Promise<EmailSendResult>
```

**What it does**:
1. Fetches company details
2. Fetches contact name
3. Builds dashboard and messaging URLs
4. Renders completion email template
5. Sends via Resend with celebration subject line

### Integration Points

**Location**: `/src/actions/ten-dlc-registration.ts`

**Function**: `submitAutomatedVerification()`

**Email Sending Logic** (lines 605-623):
```typescript
// 5. Send verification submitted email
// Note: Don't block the response if email fails - verification was successful
if (company.email) {
  try {
    await sendVerificationSubmittedEmail(
      companyId,
      company.email,
      {
        hasTollFreeNumbers: tollFreeNumbers.length > 0,
        has10DLCNumbers: dlcNumbers.length > 0,
        tollFreeCount: tollFreeNumbers.length,
        dlcCount: dlcNumbers.length,
      }
    );
  } catch (emailError) {
    // Log but don't fail - email is non-critical
    console.error("Failed to send verification email:", emailError);
  }
}
```

**Key Design Decision**: Email sending is **non-blocking**
- If email fails, verification still succeeds
- Email is logged to console for debugging
- User experience is not degraded by email service issues

---

## Email Content Breakdown

### Email 1: Verification Submitted

**Subject**: `Messaging Verification Submitted - [Company Name]`

**Preview Text**: `Your messaging verification has been submitted successfully`

**Structure**:
1. **Header**: "Verification Submitted Successfully!" (H1)
2. **Greeting**: "Hi [Contact Name],"
3. **Success Message**: Confirms submission received
4. **Timeline Cards**:
   - Green card for 10DLC (if applicable): "✅ 10DLC Registration Complete"
   - Amber card for toll-free (if applicable): "⏰ Toll-Free Verification Pending"
5. **What to Expect Section**: Bulleted list explaining next steps
6. **CTA Button**: "Go to Dashboard"
7. **Support Note**: Contact info with support email link
8. **Footer Note**: Federal compliance explanation

**Design Features**:
- Responsive layout (600px max width)
- Thorbis Electric Blue branding
- Card-based timeline visualization
- Clear typography hierarchy
- Mobile-friendly spacing

### Email 2: Verification Complete (Future)

**Subject**: `🎉 Messaging Approved - [Company Name]`

**Preview Text**: `Your business messaging is now fully enabled!`

**Structure**:
1. **Header**: "🎉 Your Messaging is Live!" (H1)
2. **Greeting**: "Hi [Contact Name],"
3. **Success Message**: Confirms approval
4. **Success Card**: Large green celebration card
5. **Features List**: What you can do now (SMS/MMS, two-way messaging, etc.)
6. **Quick Start Guide**: 3-step getting started guide
7. **CTA Buttons**:
   - Primary: "Open Messaging Dashboard"
   - Secondary: "Back to Main Dashboard"
8. **Support Note**: Links to docs and support
9. **Footer Note**: Campaign Registry confirmation

**Design Features**:
- Celebration-focused design
- Actionable quick start guide
- Multiple CTAs for different user paths
- Educational content about features

---

## Email Service Configuration

### Resend Configuration

**Required Environment Variables**:
```bash
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_NAME="Thorbis"
RESEND_FROM_EMAIL="noreply@thorbis.com"
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://app.your-domain.com
```

**Client Setup**: `/src/lib/email/resend-client.ts`

**Features**:
- Singleton Resend client instance
- Development mode support (logs instead of sending)
- Environment-based from address
- Automatic fallback to default sender

**Development Mode**:
- If `RESEND_API_KEY` is not configured, emails are logged to console
- Allows testing without Resend account
- Returns mock success response

---

## Database Integration

### Email Logs Table

**Table**: `email_logs`

**Columns**:
- `id` - UUID
- `to` - Recipient email (or comma-separated list)
- `from` - Sender email
- `subject` - Email subject line
- `html_body` - Rendered HTML content
- `status` - `sent`, `failed`, or `pending`
- `message_id` - Resend message ID (for tracking)
- `error_message` - Error details if failed
- `metadata` - JSON with template type, tags, etc.
- `sent_at` - Timestamp when sent
- `retry_count` - Number of retry attempts
- `max_retries` - Maximum retry attempts (default: 3)
- `next_retry_at` - When to retry if failed
- `created_at` - Record creation time

**Logging Behavior**:
- **Success**: Logs sent email with `message_id`
- **Failure**: Logs failed email with `error_message` and retry info
- Non-blocking: Email sending success/failure doesn't affect verification

---

## Testing the Email System

### Manual Testing

1. **Set up Resend API key** (optional - can test in dev mode):
   ```bash
   RESEND_API_KEY=your_key_here
   ```

2. **Complete onboarding with verification**:
   - Go through Steps 1-3 (Company, Team, Banking)
   - Reach Step 4 (Messaging Verification)
   - Click "Submit Verification"

3. **Check email delivery**:
   - If Resend is configured: Check recipient inbox
   - If dev mode: Check server console logs

4. **Verify email content**:
   - Correct company name
   - Correct contact name
   - Accurate phone number counts
   - Correct timeline cards displayed
   - Working dashboard link

### Email Preview System

**Location**: `/src/app/emails/preview/[template]/page.tsx`

**Usage**:
```
http://localhost:3000/emails/preview/verification-submitted
http://localhost:3000/emails/preview/verification-complete
```

**Features**:
- Live preview of email templates
- Test data for development
- No need to trigger actual verification

### Unit Testing Checklist

- [ ] Email sent when `company.email` exists
- [ ] Email not sent when `company.email` is null
- [ ] Email failure doesn't block verification success
- [ ] Correct template type logged (`VERIFICATION_SUBMITTED`)
- [ ] Company name fetched correctly
- [ ] Contact name defaults to "there" if not found
- [ ] Phone number counts are accurate
- [ ] Timeline cards match phone number types

---

## Future Enhancements

### Webhook for Email 2: Verification Complete

**Current Gap**: Email 2 is not automatically sent when toll-free verification is approved

**Solution**: Implement Telnyx webhook to detect approval

**Implementation Steps**:

1. **Create webhook endpoint**: `/api/webhooks/telnyx/verification-status`

```typescript
// /src/app/api/webhooks/telnyx/verification-status/route.ts
export async function POST(request: Request) {
  const payload = await request.json();

  if (payload.data.event_type === 'toll_free.verification.approved') {
    const requestId = payload.data.payload.id;

    // Find company by toll_free_verification_request_id
    const { data: settings } = await supabase
      .from('company_telnyx_settings')
      .select('company_id')
      .eq('toll_free_verification_request_id', requestId)
      .single();

    if (settings) {
      // Send verification complete email
      await sendVerificationCompleteEmail(
        settings.company_id,
        companyEmail, // fetch from company record
        ['toll-free']
      );

      // Update status in database
      await supabase
        .from('company_telnyx_settings')
        .update({
          toll_free_verification_status: 'approved',
          toll_free_verification_approved_at: new Date().toISOString(),
        })
        .eq('company_id', settings.company_id);
    }
  }

  return new Response('OK', { status: 200 });
}
```

2. **Register webhook in Telnyx Portal**:
   - URL: `https://your-domain.com/api/webhooks/telnyx/verification-status`
   - Events: `toll_free.verification.approved`, `toll_free.verification.rejected`

3. **Verify webhook signature** (security):
   - Use Telnyx webhook signature verification
   - Reject unsigned requests

4. **Handle rejection case**:
   - Send different email if verification is rejected
   - Provide next steps for resubmission

### Alternative: Polling

**If webhooks are not available**:

```typescript
// Background job that runs every 6 hours
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
      // Send completion email
      await sendVerificationCompleteEmail(
        setting.company_id,
        companyEmail,
        ['toll-free']
      );

      // Update database
      await supabase
        .from('company_telnyx_settings')
        .update({ toll_free_verification_status: 'approved' })
        .eq('company_id', setting.company_id);
    }
  }
}
```

**Schedule**: Run via cron job or Next.js scheduled function

---

## Troubleshooting

### Email Not Sending

**Check**:
1. Is `RESEND_API_KEY` configured?
2. Is `company.email` set in database?
3. Check server console for error logs
4. Check `email_logs` table for failed attempts

**Common Issues**:
- Missing environment variable → Dev mode logs only
- Invalid recipient email → Validation error
- Resend API error → Check API key and from address
- Company email null → Email skipped silently

### Email Sent But Not Received

**Check**:
1. Check spam/junk folder
2. Verify sender domain is configured in Resend
3. Check Resend dashboard for delivery status
4. Verify recipient email is correct in `email_logs`

**Resend Domain Verification**:
- Add DNS records for custom domain
- Verify domain in Resend dashboard
- Use verified domain in `RESEND_FROM_EMAIL`

### Email Template Not Rendering

**Check**:
1. React Email components imported correctly
2. All props provided to template
3. Check browser console (if using preview)
4. Verify template file exists at correct path

**Debug**:
- Use email preview system at `/emails/preview/[template]`
- Check React Email render errors in server console
- Validate props match template interface

---

## Summary

✅ **Email 1 (Verification Submitted)**: Fully implemented and integrated
- Sends immediately after verification submission
- Provides timeline expectations (instant 10DLC, 5-7 days toll-free)
- Non-blocking - doesn't fail verification if email fails
- Logged to database for tracking

⏳ **Email 2 (Verification Complete)**: Template created, webhook pending
- Template ready to use
- Webhook implementation needed for automatic sending
- Alternative: polling-based status check

**User Experience**:
- Professional ServiceTitan-style communication
- Users never leave platform
- Clear expectations set upfront
- Celebration when complete

**Technical Benefits**:
- Type-safe email sending
- Database logging for debugging
- Resend integration with fallback
- React Email for maintainable templates
- Non-blocking for reliability

---

## Next Steps

1. ✅ **Email 1 Implemented** - Test in staging environment
2. ⏳ **Implement Webhook** - For Email 2 automation
3. ⏳ **Test End-to-End** - Submit real verification and wait 5-7 days
4. ⏳ **Monitor Logs** - Check `email_logs` table for issues
5. ⏳ **User Feedback** - Gather feedback on email clarity and helpfulness

---

**Last Updated**: 2025-11-18
**Version**: 1.0
**Status**: Email 1 Complete, Email 2 Template Ready
