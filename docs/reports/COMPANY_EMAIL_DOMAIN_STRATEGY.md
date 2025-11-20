# Company Email Domain Strategy

**Date**: 2025-11-18
**Priority**: CRITICAL - Core Platform Requirement

## Executive Summary

ALL customer communication (invoices, estimates, appointment reminders, marketing) MUST come from company-branded domains to:
1. Build customer trust and brand recognition
2. Improve email deliverability (reduce spam)
3. Meet 10DLC email verification requirements
4. Match industry standards (ServiceTitan, Housecall Pro)

## How Industry Leaders Do It

### ServiceTitan
- Uses **shared sending domains** (servicetitanmail.io, stsend4.io) with pre-configured SPF/DKIM/DMARC
- Offers **custom domain setup** with support team assistance
- Requires proper authentication before sending

### Housecall Pro
- Similar approach with domain authentication
- Sends from company-branded addresses
- Full SPF/DKIM/DMARC compliance

### Common Pattern
Both platforms send emails FROM company domains (e.g., `noreply@company.com` or `invoices@company.com`) to build trust and improve deliverability.

## Our Implementation Options

### Option 1: Subdomain Delegation (RECOMMENDED)
**Example**: `mail.company.com` or `notifications.company.com`

**How it works**:
1. Company adds DNS records for subdomain
2. Resend manages ALL email for that subdomain
3. Platform sends as `invoices@mail.company.com`

**Pros**:
- ✅ Company-branded (company.com in address)
- ✅ Full control over subdomain
- ✅ Easy DNS setup (3-4 records)
- ✅ Better deliverability than shared domains
- ✅ Meets 10DLC requirements

**Cons**:
- ❌ Requires DNS access
- ❌ 24-48 hour DNS propagation
- ❌ Users see subdomain in email address

**DNS Records Required**:
```
mail.company.com TXT "v=spf1 include:amazonses.com ~all"
resend._domainkey.mail.company.com TXT "p=MIGfMA0GCS..."
_dmarc.mail.company.com TXT "v=DMARC1; p=none;"
```

### Option 2: Full Domain Delegation
**Example**: `company.com`

**How it works**:
1. Company adds DNS records to main domain
2. Resend manages email for entire domain
3. Platform sends as `invoices@company.com`

**Pros**:
- ✅ Clean email addresses (no subdomain)
- ✅ Maximum brand trust
- ✅ Professional appearance

**Cons**:
- ❌ Can conflict with existing email (Gmail, Microsoft 365)
- ❌ More complex DNS setup
- ❌ Higher risk if misconfigured

**Not Recommended**: Most companies already use their main domain for employee email (Gmail/Outlook).

### Option 3: Shared Platform Domain
**Example**: `company-name@stratosplatform.com`

**How it works**:
1. No DNS setup required
2. Platform owns domain
3. Sends as `companyname@stratosplatform.com`

**Pros**:
- ✅ Zero setup required
- ✅ Instant activation
- ✅ No DNS knowledge needed

**Cons**:
- ❌ Not company-branded
- ❌ Lower trust ("why is my plumber emailing from Stratos?")
- ❌ Worse deliverability
- ❌ Doesn't meet 10DLC requirements
- ❌ Unprofessional

**Not Recommended**: Defeats the purpose of company branding.

## Recommended Implementation

### Phase 1: Subdomain Delegation (Mandatory)

**Setup Flow**:
```
1. Onboarding asks: "What domain does your company use?"
   User enters: "acmeplumbing.com"

2. System suggests: "mail.acmeplumbing.com"
   (or let user choose: notifications/emails/messages.acmeplumbing.com)

3. System creates domain in Resend
   Returns DNS records to add

4. Show user friendly DNS instructions:
   "Add these 3 records to your DNS (GoDaddy, Cloudflare, etc.)"

5. User adds records

6. User clicks "Verify Domain"

7. System checks DNS via Resend API

8. ✅ Domain verified → invoices send from invoices@mail.acmeplumbing.com
```

### Phase 2: Enhanced Features (Optional)

1. **Multiple Sending Addresses**:
   - `invoices@mail.company.com` - Invoices
   - `estimates@mail.company.com` - Estimates
   - `reminders@mail.company.com` - Appointments
   - `notifications@mail.company.com` - General updates

2. **Reply-To Management**:
   - Set Reply-To to company's real email (office@company.com)
   - Customers reply to main company email, not subdomain

3. **Bounce Handling**:
   - Resend webhooks notify of bounces
   - Auto-update customer email status

4. **Domain Health Monitoring**:
   - Daily DNS checks
   - Alert if SPF/DKIM broken
   - Auto-revalidate domains

## Updated Database Schema

```sql
ALTER TABLE company_email_domains
  ADD COLUMN subdomain text, -- e.g., "mail" or "notifications"
  ADD COLUMN sending_addresses jsonb DEFAULT '[]'::jsonb, -- Multiple from addresses
  ADD COLUMN reply_to_email text, -- Company's real email for replies
  ADD COLUMN bounce_rate decimal,
  ADD COLUMN last_health_check timestamptz;

-- Example sending_addresses:
[
  { "type": "invoices", "email": "invoices@mail.company.com" },
  { "type": "estimates", "email": "estimates@mail.company.com" },
  { "type": "reminders", "email": "reminders@mail.company.com" }
]
```

## Email Sending Updates

### Current (WRONG):
```typescript
await resend.emails.send({
  from: "Stratos <noreply@stratosplatform.com>", // Platform domain
  to: customer.email,
  subject: "Invoice #1234",
  html: invoiceHtml,
});
```

### Updated (CORRECT):
```typescript
// Get company's verified domain
const domain = await getVerifiedCompanyDomain(companyId);

if (!domain?.verified) {
  throw new Error("Company domain not verified");
}

await resend.emails.send({
  from: `${company.name} <invoices@${domain.full_domain}>`, // mail.company.com
  replyTo: company.email, // office@company.com
  to: customer.email,
  subject: "Invoice #1234",
  html: invoiceHtml,
});
```

## 10DLC Integration

Update 10DLC registration to use verified domain email:

```typescript
// BEFORE: Check email_verified (code verification)
// AFTER: Check company_email_domains.status = 'verified'

const { data: domain } = await supabase
  .from("company_email_domains")
  .select("*")
  .eq("company_id", companyId)
  .eq("status", "verified")
  .single();

if (!domain) {
  return {
    success: false,
    error: "Domain verification required for 10DLC. Please verify your email domain first.",
  };
}

// Use domain email for TCR
const contactEmail = `admin@${domain.full_domain}`;
```

## Onboarding Flow Updates

### Step 3.5: Email Domain Setup (MANDATORY)

```typescript
{
  id: 3.5,
  title: "Email Domain",
  icon: Mail,
  description: "Setup company email sending",
  required: true, // Cannot skip
}
```

**UI Components**:

1. **Domain Input**:
   ```
   "What's your company domain?"
   [acmeplumbing.com] → "We'll use mail.acmeplumbing.com"
   ```

2. **DNS Instructions**:
   ```
   "Add these 3 DNS records to your domain:"

   ┌─────────────────────────────────────────────┐
   │ Record Type: TXT                             │
   │ Host: mail.acmeplumbing.com                  │
   │ Value: v=spf1 include:amazonses.com ~all     │
   │ [Copy]                                       │
   └─────────────────────────────────────────────┘

   [Show video tutorial] [Contact support]
   ```

3. **Verification Status**:
   ```
   ⏳ Checking DNS records...
   ✅ Domain verified! Emails will send from mail.acmeplumbing.com
   ```

4. **Skip Option** (with warning):
   ```
   ⚠️  Skip for now?
   You won't be able to:
   - Send invoices or estimates
   - Use automated messaging
   - Complete 10DLC registration

   [Setup Later] [Continue Setup]
   ```

## Benefits

1. **Professional Branding**:
   - Customers see emails from `@company.com`, not `@platform.com`
   - Builds trust and brand recognition

2. **Better Deliverability**:
   - SPF/DKIM/DMARC authentication reduces spam
   - Higher inbox placement rates

3. **10DLC Compliance**:
   - Verified email domain passes TCR validation
   - No more "personal/free email" rejections

4. **Industry Standard**:
   - Matches ServiceTitan, Housecall Pro approach
   - Expected by professional field service companies

5. **Centralized Management**:
   - One place to manage all company email sending
   - Easy to monitor deliverability and bounces

## Migration Plan

### Existing Companies
1. Email notification: "Action Required: Verify Your Email Domain"
2. Dashboard banner with setup link
3. 30-day grace period before blocking email sends
4. Support team helps with DNS setup

### New Companies
1. Mandatory onboarding step
2. Cannot complete onboarding without domain verification
3. Built-in DNS tutorials and support

## Cost Analysis

**Resend Pricing**:
- Free: 100 emails/day, 3,000/month
- Pro: $20/month for 50,000 emails
- Business: Custom pricing for higher volume

**Unlimited Domains**: No extra cost per domain

**Typical Company**:
- 50 customers × 5 emails/month = 250 emails
- Well within free tier initially
- Upgrade to Pro as business grows

## Implementation Checklist

- [x] Database schema created (`company_email_domains`)
- [x] Resend API integration (`/src/lib/email/resend-domains.ts`)
- [x] Server actions (`/src/actions/company-email-domains.ts`)
- [x] Cron sync for verification status
- [ ] Update email sending to use company domains
- [ ] Add subdomain suggestion logic
- [ ] Create DNS instruction UI components
- [ ] Add to onboarding as mandatory step
- [ ] Update 10DLC to require domain verification
- [ ] Create migration plan for existing companies
- [ ] Add domain health monitoring
- [ ] Create support documentation

## Next Steps

1. **Create Helper Function**: Get company's verified domain for email sending
2. **Update All Email Sends**: Use company domain instead of platform domain
3. **Add Subdomain Logic**: Auto-suggest `mail.company.com`
4. **Build UI Components**: DNS instructions with copy buttons
5. **Make Mandatory**: Add to onboarding as required step
6. **10DLC Integration**: Use domain email for TCR registration

## References

- [Resend Domain Management](https://resend.com/docs/api-reference/domains)
- [Subdomain Delegation Best Practices](https://dmarcian.com/soboo-full-sub-domain-delegation/)
- [ServiceTitan Email Authentication](https://community.servicetitan.com/t5/Marketing-Pro/New-Google-amp-Yahoo-Requirements-for-Email-Senders-in-2024/ta-p/44119)
- [SPF/DKIM/DMARC Guide](https://dmarcly.com/blog/how-to-implement-dmarc-dkim-spf-to-stop-email-spoofing-phishing-the-definitive-guide)
