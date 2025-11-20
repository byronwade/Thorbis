# Email System Migration Guide

**Migrating from mixed email sending to separated Thorbis vs Company email systems**

## Overview

We have **two email systems** that must be kept separate:

1. **Thorbis Platform Emails** - Account management, auth, team features
2. **Company Branded Emails** - Customer communications, invoices, estimates

This guide shows how to migrate existing code to use the correct system.

---

## Quick Reference

### Thorbis Platform Emails (System)
**When**: User account operations, team management, platform notifications
**From**: `noreply@thorbis.com`, `support@thorbis.com`
**Layout**: `BaseLayout` (Thorbis Electric Blue)
**Function**: `sendPlatformEmail()` or `routeEmail({ category: "platform" })`

### Company Branded Emails (Customer-Facing)
**When**: Customer communications, invoices, estimates, job notifications
**From**: `invoices@mail.company.com`, `notifications@mail.company.com`
**Layout**: `CompanyLayout` (Company branding)
**Function**: `sendCompanyBrandedEmail()` or `routeEmail({ category: "company" })`

---

## Migration Steps

### Step 1: Import the Email Router

Replace old imports:
```typescript
// ❌ OLD
import { sendEmail } from "@/lib/email/email-sender";

// ✅ NEW
import { sendPlatformEmail, sendCompanyBrandedEmail } from "@/lib/email/email-router";
```

### Step 2: Determine Email Category

Ask yourself: **Who is this email for?**

- **Thorbis user** (account holder) → Platform email
- **Company's customer** → Company email

### Step 3: Update Email Calls

#### Example 1: Password Reset (Platform Email)

**Before:**
```typescript
import { sendEmail } from "@/lib/email/email-sender";
import { PasswordReset } from "@/emails/templates/auth/password-reset";

await sendEmail({
  to: user.email,
  subject: "Reset Your Password",
  template: <PasswordReset resetLink={link} />,
  templateType: "password-reset"
});
```

**After:**
```typescript
import { sendPlatformEmail } from "@/lib/email/email-router";
import { PasswordReset } from "@/emails/templates/auth/password-reset";

await sendPlatformEmail({
  to: user.email,
  subject: "Reset Your Password",
  template: <PasswordReset resetLink={link} />,
  templateType: "auth-password-reset"
});
```

**Result**: Email sent from `noreply@thorbis.com` with Thorbis branding

#### Example 2: Invoice to Customer (Company Email)

**Before:**
```typescript
import { sendEmail } from "@/lib/email/email-sender";
import { InvoiceNotification } from "@/emails/templates/customer/invoice-notification";

await sendEmail({
  to: customer.email,
  subject: `Invoice #${invoice.number}`,
  template: <InvoiceNotification invoice={invoice} />,
  templateType: "invoice",
  companyId: company.id // Tried to set company but still used wrong sender
});
```

**After:**
```typescript
import { sendCompanyBrandedEmail } from "@/lib/email/email-router";
import { InvoiceNotification } from "@/emails/templates/customer/invoice-notification";

await sendCompanyBrandedEmail({
  companyId: company.id,
  companyName: company.name,
  to: customer.email,
  subject: `Invoice #${invoice.number} from ${company.name}`,
  template: <InvoiceNotification invoice={invoice} customer={customer} company={company} />,
  templateType: "customer-invoice",
  emailType: "invoice" // Uses invoices@mail.company.com
});
```

**Result**: Email sent from `ACME Plumbing <invoices@mail.acmeplumbing.com>` with company branding

---

## Email Type Reference

### Platform Email Templates

Located in `/emails/templates/`:

**Auth** (`/auth/`):
- `email-verification.tsx` → `templateType: "auth-verification"`
- `magic-link.tsx` → `templateType: "auth-magic-link"`
- `password-reset.tsx` → `templateType: "auth-password-reset"`
- `password-changed.tsx` → `templateType: "auth-password-changed"`
- `welcome.tsx` → `templateType: "auth-welcome"`

**Team** (`/team/`):
- `invitation.tsx` → `templateType: "team-invitation"`

**Onboarding** (`/onboarding/`):
- `verification-submitted.tsx` → `templateType: "onboarding-verification-submitted"`
- `verification-complete.tsx` → `templateType: "onboarding-verification-complete"`

### Company Email Templates

**Customer** (`/customer/`):
- `invoice-notification.tsx` → `templateType: "customer-invoice"`, `emailType: "invoice"`
- `estimate-notification.tsx` → `templateType: "customer-estimate"`, `emailType: "estimate"`
- `portal-invitation.tsx` → `templateType: "customer-portal-invitation"`
- `review-request.tsx` → `templateType: "customer-review-request"`
- `service-reminder.tsx` → `templateType: "customer-service-reminder"`, `emailType: "reminder"`
- `welcome-customer.tsx` → `templateType: "customer-welcome"`

**Jobs** (`/jobs/`):
- `job-confirmation.tsx` → `templateType: "job-confirmation"`
- `appointment-reminder.tsx` → `templateType: "job-appointment-reminder"`, `emailType: "reminder"`
- `tech-en-route.tsx` → `templateType: "job-tech-en-route"`
- `job-complete.tsx` → `templateType: "job-complete"`

**Billing** (`/billing/`):
- `invoice-sent.tsx` → `templateType: "billing-invoice-sent"`, `emailType: "invoice"`
- `estimate-sent.tsx` → `templateType: "billing-estimate-sent"`, `emailType: "estimate"`
- `payment-received.tsx` → `templateType: "billing-payment-received"`
- `payment-reminder.tsx` → `templateType: "billing-payment-reminder"`, `emailType: "reminder"`

---

## Migration Checklist by File

### ✅ Already Migrated
- `/src/lib/email/company-domain-sender.ts` - Uses company domains
- `/src/actions/verify-company-email.ts` - Platform email (verification codes)

### 🔄 Files to Migrate

**High Priority (Customer-Facing)**:
- [ ] `/src/actions/invoices.ts` - Send invoices to customers
- [ ] `/src/actions/estimates.ts` - Send estimates to customers
- [ ] `/src/actions/jobs.ts` - Send job notifications to customers
- [ ] `/src/actions/payments/process-invoice-payment.ts` - Payment confirmations

**Medium Priority (Team/User Management)**:
- [ ] `/src/actions/team-invitations.ts` - Team invitations
- [ ] `/src/actions/team.ts` - Team notifications
- [ ] `/src/actions/auth.ts` - Auth emails

**Low Priority (General)**:
- [ ] `/src/actions/communications.ts` - General communications
- [ ] `/src/actions/customers.ts` - Customer portal invitations
- [ ] `/src/actions/emails.ts` - Generic email actions
- [ ] `/src/lib/email/verification-emails.ts` - Verification emails
- [ ] `/src/app/api/notifications/test/route.ts` - Test notifications
- [ ] `/src/components/invoices/invoice-options-sidebar.tsx` - Invoice actions

---

## Code Examples

### Example 1: Team Invitation (Platform)

**File**: `/src/actions/team-invitations.ts`

**Before:**
```typescript
await sendEmail({
  to: invitation.email,
  subject: `You've been invited to join ${company.name} on Thorbis`,
  template: <TeamInvitation invitation={invitation} company={company} />,
  templateType: "invitation"
});
```

**After:**
```typescript
await sendPlatformEmail({
  to: invitation.email,
  subject: `You've been invited to join ${company.name} on Thorbis`,
  template: <TeamInvitation invitation={invitation} company={company} />,
  templateType: "team-invitation"
});
```

### Example 2: Job Confirmation (Company)

**File**: `/src/actions/jobs.ts`

**Before:**
```typescript
await sendEmail({
  to: customer.email,
  subject: `Job Scheduled - ${job.title}`,
  template: <JobConfirmation job={job} customer={customer} />,
  templateType: "notification",
  companyId: job.company_id
});
```

**After:**
```typescript
await sendCompanyBrandedEmail({
  companyId: job.company_id,
  companyName: company.name,
  to: customer.email,
  subject: `Job Scheduled - ${job.title}`,
  template: <JobConfirmation job={job} customer={customer} company={company} />,
  templateType: "job-confirmation",
  emailType: "notification"
});
```

### Example 3: Payment Confirmation (Company)

**File**: `/src/actions/payments/process-invoice-payment.ts`

**Before:**
```typescript
await sendEmail({
  to: customer.email,
  subject: `Payment Received - Invoice #${invoice.number}`,
  template: <PaymentReceived payment={payment} invoice={invoice} />,
  templateType: "notification"
});
```

**After:**
```typescript
await sendCompanyBrandedEmail({
  companyId: invoice.company_id,
  companyName: company.name,
  to: customer.email,
  subject: `Payment Received - Invoice #${invoice.number}`,
  template: <PaymentReceived payment={payment} invoice={invoice} company={company} />,
  templateType: "billing-payment-received",
  emailType: "notification"
});
```

---

## Email Type to Sender Mapping

When using `sendCompanyBrandedEmail()`, the `emailType` parameter determines the sender:

| emailType | Sender Address |
|-----------|----------------|
| `invoice` | `invoices@mail.company.com` |
| `estimate` | `estimates@mail.company.com` |
| `reminder` | `reminders@mail.company.com` |
| `notification` | `notifications@mail.company.com` |
| `marketing` | `marketing@mail.company.com` |
| `general` | `general@mail.company.com` |

**Custom addresses** can be configured in `company_email_domains.sending_addresses` JSONB column.

---

## Testing Strategy

### 1. Unit Tests

Test that emails use correct sender:

```typescript
import { routeEmail } from "@/lib/email/email-router";

describe("Email Routing", () => {
  it("uses Thorbis domain for platform emails", async () => {
    const result = await routeEmail({
      category: "platform",
      to: "user@example.com",
      subject: "Test",
      template: <TestEmail />,
      templateType: "auth-welcome"
    });

    expect(result.from).toContain("thorbis.com");
  });

  it("uses company domain for customer emails", async () => {
    const result = await routeEmail({
      category: "company",
      companyId: "xxx",
      companyName: "ACME",
      to: "customer@example.com",
      subject: "Test",
      template: <TestEmail />,
      templateType: "customer-invoice",
      emailType: "invoice"
    });

    expect(result.from).toContain("@mail.");
  });
});
```

### 2. Manual Testing

**Platform Email Test**:
1. Trigger password reset
2. Check email received from `noreply@thorbis.com`
3. Verify Thorbis Electric Blue branding

**Company Email Test**:
1. Send test invoice
2. Check email received from `invoices@mail.company.com`
3. Verify company logo and branding

---

## Rollout Plan

### Phase 1: Core Customer Communications (Week 1)
- [ ] Migrate invoice emails
- [ ] Migrate estimate emails
- [ ] Migrate payment confirmation emails
- [ ] Test with real customers (soft launch)

### Phase 2: Job Notifications (Week 2)
- [ ] Migrate job confirmation emails
- [ ] Migrate appointment reminders
- [ ] Migrate tech en-route notifications
- [ ] Test with scheduling

### Phase 3: Platform Emails (Week 3)
- [ ] Migrate auth emails (password reset, verification)
- [ ] Migrate team invitations
- [ ] Test user onboarding flow

### Phase 4: Cleanup (Week 4)
- [ ] Remove old email functions
- [ ] Update documentation
- [ ] Archive legacy code

---

## FAQ

**Q: What if a company doesn't have a verified domain?**
A: The system will throw an error. Companies MUST verify their email domain before sending customer emails. This ensures deliverability and prevents spam.

**Q: Can we still send emails during domain verification?**
A: No. Domain verification is required before any company emails can be sent. This is by design to prevent deliverability issues.

**Q: What about existing companies without domains?**
A: They need to complete the email domain setup in the onboarding flow. Until then, they cannot send customer emails.

**Q: Will this break existing functionality?**
A: Yes, temporarily. Companies without verified domains cannot send customer emails. This is intentional - we're preventing email deliverability issues and spam complaints.

**Q: Can companies use their main domain instead of subdomain?**
A: No. Subdomain is REQUIRED to prevent SPF/DKIM conflicts with existing email providers (Google Workspace, Microsoft 365, etc.).

---

## Support & Resources

- **Email Router**: `/src/lib/email/email-router.ts`
- **Company Sender**: `/src/lib/email/company-domain-sender.ts`
- **Email Templates**: `/emails/templates/`
- **Layouts**: `/emails/layouts/`
- **Migration Status**: Check `EMAIL_SYSTEM_SEPARATION.md`

**Need Help?**: Create an issue or ask in #engineering-email channel.
