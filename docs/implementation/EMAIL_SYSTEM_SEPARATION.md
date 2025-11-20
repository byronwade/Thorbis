# Email System Separation Guide

**Two Independent Email Systems - Thorbis vs Company Branded**

## Overview

The platform has **two completely separate email systems** with different layouts, senders, and purposes:

### 1. Thorbis Platform Emails (System/Internal)
**From**: `noreply@thorbis.com`, `support@thorbis.com`, etc.
**Layout**: `BaseLayout` (Thorbis branding)
**Used for**: Platform operations, account management, system notifications

### 2. Company Branded Emails (Customer-Facing)
**From**: `invoices@mail.acmeplumbing.com`, `estimates@mail.acmeplumbing.com`, etc.
**Layout**: `CompanyLayout` (company branding)
**Used for**: Customer communications, invoices, estimates, job notifications

---

## Email System #1: Thorbis Platform Emails

### Purpose
Platform operations and account management that come FROM Thorbis.

### Layout File
`/emails/layouts/base-layout.tsx`

### Features
- ✅ Thorbis Electric Blue branding
- ✅ Thorbis logo from CDN
- ✅ Thorbis support links
- ✅ Full-width clean design
- ✅ Footer with Thorbis info

### Example Templates Using BaseLayout

**Auth Emails** (`/emails/templates/auth/`):
- `email-verification.tsx` - Email verification codes
- `magic-link.tsx` - Magic link login
- `password-reset.tsx` - Password reset
- `password-changed.tsx` - Password change notification
- `welcome.tsx` - Welcome to Thorbis

**Team Emails** (`/emails/templates/team/`):
- `invitation.tsx` - Team member invitations

**Onboarding** (`/emails/templates/onboarding/`):
- `verification-submitted.tsx` - 10DLC verification submitted
- `verification-complete.tsx` - 10DLC verification complete

### Sender Configuration
```typescript
// Use Thorbis domain
await resend.emails.send({
  from: "Thorbis <noreply@thorbis.com>",
  to: user.email,
  subject: "Welcome to Thorbis",
  react: <Welcome user={user} />
});
```

---

## Email System #2: Company Branded Emails

### Purpose
Customer-facing communications that come FROM the company (not Thorbis).

### Layout File
`/emails/layouts/company-layout.tsx`

### Features
- ✅ Company name/logo
- ✅ Company primary color
- ✅ Company contact info
- ✅ Company address
- ✅ "Powered by Thorbis" footer (optional)

### Example Templates Using CompanyLayout

**Customer Emails** (`/emails/templates/customer/`):
- `invoice-notification.tsx` - Invoice sent to customer
- `estimate-notification.tsx` - Estimate sent to customer
- `portal-invitation.tsx` - Customer portal invite
- `review-request.tsx` - Request for review
- `service-reminder.tsx` - Service reminders
- `welcome-customer.tsx` - Welcome new customer

**Job Emails** (`/emails/templates/jobs/`):
- `job-confirmation.tsx` - Job scheduled confirmation
- `appointment-reminder.tsx` - Appointment reminders
- `tech-en-route.tsx` - Tech is on the way
- `job-complete.tsx` - Job completion notification

**Billing** (`/emails/templates/billing/`):
- `invoice-sent.tsx` - Invoice notifications
- `estimate-sent.tsx` - Estimate notifications
- `payment-received.tsx` - Payment confirmations
- `payment-reminder.tsx` - Payment reminders

### Sender Configuration
```typescript
// Use company domain (from sendCompanyEmail)
import { sendCompanyEmail } from "@/lib/email/company-domain-sender";

await sendCompanyEmail({
  companyId: company.id,
  companyName: "ACME Plumbing",
  type: "invoice", // Uses invoices@mail.acmeplumbing.com
  to: customer.email,
  subject: "Invoice #1234",
  html: await renderEmail(InvoiceNotification, { ... }),
});
```

---

## Decision Matrix: Which Email System?

### Use Thorbis Platform Emails When:
- [ ] User is signing up / logging in
- [ ] User is resetting password
- [ ] User is verifying email
- [ ] Team member is being invited to Thorbis
- [ ] Platform maintenance notification
- [ ] Account-level notification
- [ ] 10DLC verification status updates
- [ ] Billing/subscription for Thorbis platform itself

**Rule**: If it's about the **user's Thorbis account**, use BaseLayout + Thorbis domain

### Use Company Branded Emails When:
- [ ] Sending invoice to customer
- [ ] Sending estimate to customer
- [ ] Job confirmation to customer
- [ ] Appointment reminder to customer
- [ ] Payment receipt to customer
- [ ] Review request to customer
- [ ] Customer portal invitation
- [ ] Any communication to the **company's customers**

**Rule**: If it's from the **company to their customers**, use CompanyLayout + company domain

---

## Implementation Examples

### Example 1: Password Reset (Thorbis Email)
```typescript
// /src/actions/auth.ts
import { BaseLayout } from "@/emails/layouts/base-layout";
import { PasswordReset } from "@/emails/templates/auth/password-reset";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordReset(email: string, resetLink: string) {
  await resend.emails.send({
    from: "Thorbis <noreply@thorbis.com>", // Thorbis domain
    to: email,
    subject: "Reset Your Password",
    react: <PasswordReset resetLink={resetLink} />
  });
}
```

**Customer sees:**
```
From: Thorbis <noreply@thorbis.com>
Subject: Reset Your Password

[Thorbis branding - Electric Blue header with Thorbis logo]
```

### Example 2: Invoice to Customer (Company Email)
```typescript
// /src/actions/invoices.ts
import { sendCompanyEmail } from "@/lib/email/company-domain-sender";
import { InvoiceNotification } from "@/emails/templates/customer/invoice-notification";
import { render } from "@react-email/render";

export async function sendInvoiceEmail(invoice: Invoice, company: Company, customer: Customer) {
  const html = await render(
    <InvoiceNotification
      invoice={invoice}
      customer={customer}
      company={company}
    />
  );

  await sendCompanyEmail({
    companyId: company.id,
    companyName: company.name,
    type: "invoice", // Uses invoices@mail.acmeplumbing.com
    to: customer.email,
    subject: `Invoice #${invoice.number} from ${company.name}`,
    html,
  });
}
```

**Customer sees:**
```
From: ACME Plumbing <invoices@mail.acmeplumbing.com>
Subject: Invoice #1234 from ACME Plumbing

[ACME Plumbing branding - Company color header with company logo]
[Footer: ACME Plumbing contact info + "Powered by Thorbis"]
```

---

## Email Address Patterns

### Thorbis Platform Emails
```
noreply@thorbis.com          - System notifications
support@thorbis.com          - Support emails
team@thorbis.com             - Team invitations
billing@thorbis.com          - Thorbis billing/subscriptions
```

### Company Branded Emails
```
invoices@mail.acmeplumbing.com      - Invoices
estimates@mail.acmeplumbing.com     - Estimates
notifications@mail.acmeplumbing.com - General notifications
reminders@mail.acmeplumbing.com     - Appointment reminders
office@mail.acmeplumbing.com        - General company emails
```

**Note**: Subdomain (mail.) is REQUIRED for company emails to prevent SPF conflicts.

---

## Current Implementation Status

### ✅ Implemented
- [x] Two separate layouts (BaseLayout + CompanyLayout)
- [x] Email templates for both systems
- [x] Company domain sender (`sendCompanyEmail()`)
- [x] Database schema for company email domains
- [x] Subdomain enforcement (safety)
- [x] Resend API integration

### 🚧 Needs Migration
Some existing code may still be using direct Resend calls instead of the proper email system. Need to audit:

1. **Find all Resend.send() calls:**
   ```bash
   grep -r "resend.emails.send" src/
   ```

2. **Replace with appropriate system:**
   - If platform email → Keep using `resend.emails.send()` with `from: "Thorbis <...@thorbis.com>"`
   - If company email → Use `sendCompanyEmail()` instead

3. **Ensure correct template:**
   - Platform emails should import and use templates with `BaseLayout`
   - Company emails should import and use templates with `CompanyLayout`

---

## Key Files Reference

**Email Layouts:**
- `/emails/layouts/base-layout.tsx` - Thorbis branding
- `/emails/layouts/company-layout.tsx` - Company branding

**Email Senders:**
- Direct `resend.emails.send()` - For Thorbis platform emails
- `/src/lib/email/company-domain-sender.ts` - For company branded emails

**Email Templates:**
- `/emails/templates/auth/*` - Thorbis platform (BaseLayout)
- `/emails/templates/customer/*` - Company branded (CompanyLayout)
- `/emails/templates/jobs/*` - Company branded (CompanyLayout)
- `/emails/templates/billing/*` - Company branded (CompanyLayout)
- `/emails/templates/team/*` - Thorbis platform (BaseLayout)
- `/emails/templates/onboarding/*` - Thorbis platform (BaseLayout)

**Email Domain Setup:**
- `/src/actions/company-email-domains.ts` - Domain management
- `/src/lib/email/company-domain-sender.ts` - Company email sender

---

## Testing Checklist

### Test Thorbis Emails
- [ ] Send password reset → Should come from `noreply@thorbis.com`
- [ ] Send team invitation → Should have Thorbis branding
- [ ] Send welcome email → Should have Electric Blue header

### Test Company Emails
- [ ] Send invoice → Should come from `invoices@mail.company.com`
- [ ] Send estimate → Should have company logo/colors
- [ ] Send job confirmation → Should show company contact info
- [ ] Footer shows "Powered by Thorbis" (optional)

---

## Migration Guide for Existing Code

**Before (direct Resend for customer emails - WRONG):**
```typescript
await resend.emails.send({
  from: "noreply@thorbis.com", // ❌ WRONG - customer sees Thorbis
  to: customer.email,
  subject: "Invoice",
  html: invoiceHtml,
});
```

**After (company branded - CORRECT):**
```typescript
await sendCompanyEmail({
  companyId: company.id,
  companyName: company.name,
  type: "invoice",
  to: customer.email,
  subject: `Invoice #${invoice.number}`,
  html: await render(<InvoiceNotification ... />),
});
```

---

**Summary**: You have TWO email systems working side-by-side. Thorbis platform emails (account stuff) vs Company branded emails (customer communications). Both use different layouts, different senders, and different branding!
