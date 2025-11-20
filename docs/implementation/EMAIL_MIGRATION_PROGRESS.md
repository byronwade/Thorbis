# Email Migration Progress

**Last Updated**: 2025-11-18
**Status**: 🟡 In Progress (2/10 files migrated)

---

## Migration Summary

### ✅ Completed (2 files)

1. **`/src/actions/payments/process-invoice-payment.ts`** ✅
   - **Email Type**: Company branded (customer payment receipts)
   - **Template**: `PaymentReceivedEmail` (CompanyLayout)
   - **Changes**:
     - Replaced `sendEmail()` with `sendCompanyBrandedEmail()`
     - Updated template import and props
     - Uses company domain: `notifications@mail.company.com`
     - Fixed template to use CompanyLayout instead of BaseLayout
   - **Tested**: ⏳ Pending

2. **`/src/actions/team-invitations.ts`** ✅
   - **Email Type**: Platform (Thorbis team invitations)
   - **Template**: `TeamInvitationEmail` (BaseLayout)
   - **Changes**:
     - Replaced `sendEmail()` with `sendPlatformEmail()`
     - Updated 2 email send calls
     - Uses Thorbis domain: `noreply@thorbis.com`
   - **Tested**: ⏳ Pending

### 🚧 Remaining (8 files)

#### High Priority - Customer Facing
3. **`/src/actions/invoices.ts`** - Invoice notifications
   - Status: Not started
   - Email Type: Company branded
   - Sender: `invoices@mail.company.com`

4. **`/src/actions/estimates.ts`** - Estimate notifications
   - Status: Not started
   - Email Type: Company branded
   - Sender: `estimates@mail.company.com`

5. **`/src/actions/jobs.ts`** - Job confirmations
   - Status: Not started
   - Email Type: Company branded
   - Sender: `notifications@mail.company.com`

#### Medium Priority - Platform
6. **`/src/actions/team.ts`** - Team notifications
   - Status: Not started
   - Email Type: Platform
   - Sender: `noreply@thorbis.com`

7. **`/src/actions/auth.ts`** - Auth emails
   - Status: Not started
   - Email Type: Platform
   - Sender: `noreply@thorbis.com`

#### Low Priority - General
8. **`/src/actions/communications.ts`** - General communications
   - Status: Not started
   - Email Type: TBD

9. **`/src/actions/customers.ts`** - Customer portal
   - Status: Not started
   - Email Type: Company branded
   - Sender: `notifications@mail.company.com`

10. **`/src/actions/emails.ts`** - Generic emails
    - Status: Not started
    - Email Type: TBD

---

## Template Updates

### ✅ Migrated Templates

1. **`/emails/templates/billing/payment-received.tsx`** ✅
   - Changed from `BaseLayout` → `CompanyLayout`
   - Added `company` prop requirement
   - Updated footer contact to use company email
   - **Before**: Thorbis branding (wrong for customer email)
   - **After**: Company branding (correct)

### 🚧 Templates Needing Review

**Customer Templates** (should use CompanyLayout):
- `/emails/templates/customer/invoice-notification.tsx`
- `/emails/templates/customer/estimate-notification.tsx`
- `/emails/templates/customer/portal-invitation.tsx`
- `/emails/templates/customer/review-request.tsx`
- `/emails/templates/customer/service-reminder.tsx`
- `/emails/templates/customer/welcome-customer.tsx`

**Job Templates** (should use CompanyLayout):
- `/emails/templates/jobs/job-confirmation.tsx`
- `/emails/templates/jobs/appointment-reminder.tsx`
- `/emails/templates/jobs/tech-en-route.tsx`
- `/emails/templates/jobs/job-complete.tsx`

**Billing Templates** (should use CompanyLayout):
- `/emails/templates/billing/invoice-sent.tsx`
- `/emails/templates/billing/estimate-sent.tsx`
- `/emails/templates/billing/payment-reminder.tsx`

**Platform Templates** (should use BaseLayout - already correct):
- `/emails/templates/auth/*` ✅
- `/emails/templates/team/*` ✅
- `/emails/templates/onboarding/*` ✅

---

## Code Changes Summary

### Pattern for Company Branded Emails

**Before:**
```typescript
import { sendEmail } from "@/lib/email/email-sender";

await sendEmail({
  to: customer.email,
  subject: "Payment Received",
  template: <PaymentReceivedEmail ... />,
  templateType: "payment-received",
  companyId: company.id // Didn't actually work
});
```

**After:**
```typescript
import { sendCompanyBrandedEmail } from "@/lib/email/email-router";

await sendCompanyBrandedEmail({
  companyId: company.id,
  companyName: company.name,
  to: customer.email,
  subject: "Payment Received",
  template: <PaymentReceivedEmail company={...} ... />,
  templateType: "billing-payment-received",
  emailType: "notification" // Determines sender address
});
```

### Pattern for Platform Emails

**Before:**
```typescript
import { sendEmail } from "@/lib/email/email-sender";

await sendEmail({
  to: user.email,
  subject: "Team Invitation",
  template: <TeamInvitationEmail ... />,
  templateType: EmailTemplate.TEAM_INVITATION
});
```

**After:**
```typescript
import { sendPlatformEmail } from "@/lib/email/email-router";

await sendPlatformEmail({
  to: user.email,
  subject: "Team Invitation",
  template: <TeamInvitationEmail ... />,
  templateType: "team-invitation"
});
```

---

## Testing Checklist

### ✅ Infrastructure Tests (Complete)
- [x] Email router created
- [x] Company email sender functional
- [x] Platform email sender functional
- [x] Database schema ready
- [x] Templates organized

### 🚧 Integration Tests (Pending)

**Payment Confirmation (Migrated)**:
- [ ] Test payment completion flow
- [ ] Verify email sent from `company@mail.company.com`
- [ ] Check CompanyLayout renders correctly
- [ ] Confirm receipt link works
- [ ] Test error handling if domain not verified

**Team Invitations (Migrated)**:
- [ ] Test invitation sending
- [ ] Verify email sent from `noreply@thorbis.com`
- [ ] Check BaseLayout renders correctly
- [ ] Confirm magic link works
- [ ] Test invitation expiry

**Unmigrated Features**:
- [ ] Invoice sending (not yet migrated)
- [ ] Estimate sending (not yet migrated)
- [ ] Job notifications (not yet migrated)
- [ ] Auth emails (not yet migrated)

---

## Next Steps

### Immediate (Today)
1. ✅ Migrate payment confirmation email
2. ✅ Migrate team invitation emails
3. 🚧 Update invoice/estimate emails
4. ⏳ Test payment + team invitation flows

### Short-term (This Week)
1. Migrate remaining customer-facing emails
2. Test all migrated features end-to-end
3. Update email templates to use correct layouts
4. Document edge cases and error handling

### Medium-term (Next Week)
1. Migrate platform emails (auth)
2. Clean up old email code
3. Add monitoring/logging
4. Create onboarding UI for email domain setup

---

## Breaking Changes

### ⚠️ Email Domain Required

**Impact**: Companies MUST verify email domain before sending customer emails

**Affected Features**:
- ✅ Payment confirmations (migrated - will fail if domain not verified)
- ⏳ Invoices (not migrated yet)
- ⏳ Estimates (not migrated yet)
- ⏳ Job notifications (not migrated yet)

**Migration Plan**:
1. Add email domain setup to onboarding (Step 3.5)
2. Show banner for existing companies without domain
3. Provide clear error messages when domain not verified

---

## Progress Tracking

| Category | Total | Migrated | Remaining | Progress |
|----------|-------|----------|-----------|----------|
| Customer-facing | 5 | 1 | 4 | 20% |
| Platform | 3 | 1 | 2 | 33% |
| General | 2 | 0 | 2 | 0% |
| **Total** | **10** | **2** | **8** | **20%** |

---

## Known Issues

1. **Email domain verification required**
   - Companies without verified domains cannot send customer emails
   - Need to add onboarding step + migration notification

2. **Template layout inconsistency**
   - Some customer templates still use BaseLayout (Thorbis branding)
   - Need to audit and update to CompanyLayout

3. **Missing company data in some flows**
   - Some actions may not fetch company info needed for branding
   - May need to update queries to include company details

---

## Files Modified

### Core Email System
- ✅ `/src/lib/email/email-router.ts` - Created
- ✅ `/src/lib/email/email-sender.ts` - Updated for new table
- ✅ `/src/lib/email/company-domain-sender.ts` - Created

### Actions (Server Functions)
- ✅ `/src/actions/payments/process-invoice-payment.ts` - Migrated
- ✅ `/src/actions/team-invitations.ts` - Migrated

### Email Templates
- ✅ `/emails/templates/billing/payment-received.tsx` - Updated to CompanyLayout

### Documentation
- ✅ `EMAIL_SEPARATION_COMPLETE.md` - Implementation summary
- ✅ `EMAIL_MIGRATION_GUIDE.md` - Developer guide
- ✅ `EMAIL_SYSTEM_SEPARATION.md` - Architecture overview
- ✅ `EMAIL_MIGRATION_PROGRESS.md` - This file

---

**Last Updated**: 2025-11-18
**Next Review**: After completing invoice/estimate migrations
