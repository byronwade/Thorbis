# Email Domain Safety Guide

**Priority**: CRITICAL - Prevent Breaking Customer Email
**Date**: 2025-11-18

## The Problem

If a company already uses their domain for email (Google Workspace, Microsoft 365, etc.), adding our DNS records to the **main domain** could **break their existing email system**.

## Why This Happens

### SPF Record Conflict

**SPF Rule**: Only ONE SPF record allowed per domain.

**Example Conflict**:
```
Domain: acmeplumbing.com

Their existing SPF (Google Workspace):
TXT: v=spf1 include:_spf.google.com ~all

Our SPF (Resend):
TXT: v=spf1 include:amazonses.com ~all

❌ CONFLICT: Both can't coexist on the same domain!
Adding ours breaks their Google Workspace email.
```

### DKIM Record Conflict

Multiple DKIM records can coexist, but:
- Confusing for customers
- Risk of overwriting existing records
- Hard to troubleshoot

### MX Record Risk

If they accidentally modify MX records while adding our TXT records:
- **Email stops working completely**
- They won't receive any emails
- Critical business disruption

## The Safe Solution: Mandatory Subdomain

### Always Use a Dedicated Subdomain

```
✅ SAFE:
Company domain: acmeplumbing.com
Their existing email: office@acmeplumbing.com (Google Workspace - untouched)
Our subdomain: mail.acmeplumbing.com (completely separate)

Platform sends from:
- invoices@mail.acmeplumbing.com
- reminders@mail.acmeplumbing.com
- estimates@mail.acmeplumbing.com

NO CONFLICT - Different DNS zones!
```

### How Subdomains Solve This

**Separate DNS Zones**:
```
Zone: acmeplumbing.com
  MX: google.com (their email)
  SPF: v=spf1 include:_spf.google.com ~all (their SPF)
  DKIM: google._domainkey (their DKIM)

Zone: mail.acmeplumbing.com (our subdomain)
  SPF: v=spf1 include:amazonses.com ~all (our SPF)
  DKIM: resend._domainkey (our DKIM)

✅ Both work independently!
```

## Updated Implementation

### 1. Make Subdomain Mandatory

**NEVER allow main domain setup**:

```typescript
// ❌ OLD (DANGEROUS)
setupCompanyEmailDomain(companyId, "acmeplumbing.com", ""); // No subdomain

// ✅ NEW (SAFE)
setupCompanyEmailDomain(companyId, "acmeplumbing.com", "mail"); // Required
```

### 2. Subdomain Options

**Recommended subdomains** (customer chooses):
- `mail.company.com` (recommended)
- `notifications.company.com`
- `messages.company.com`
- `platform.company.com`
- `app.company.com`

**Never use**:
- Main domain (no subdomain)
- `email.company.com` (might conflict with email services)
- `smtp.company.com` (might conflict with SMTP)

### 3. Safety Checks Before Setup

```typescript
async function validateDomainSafety(domain: string, subdomain: string) {
  // 1. Require subdomain
  if (!subdomain) {
    return {
      safe: false,
      error: "Subdomain required for safety. Main domain setup not allowed."
    };
  }

  // 2. Check for existing email setup (optional but helpful)
  const mxRecords = await dns.resolveMx(domain);

  if (mxRecords.length > 0) {
    // They have email configured
    return {
      safe: true,
      warning: `We detected you have email configured on ${domain}. We'll use ${subdomain}.${domain} which won't affect your existing email.`,
      hasExistingEmail: true
    };
  }

  return { safe: true };
}
```

### 4. User Communication

**During Onboarding**:

```
┌────────────────────────────────────────────┐
│ Email Domain Setup                         │
├────────────────────────────────────────────┤
│                                            │
│ What's your company domain?                │
│ [acmeplumbing.com]                         │
│                                            │
│ Choose a subdomain for platform emails:    │
│ • mail (recommended)                       │
│ • notifications                            │
│ • messages                                 │
│ • custom: [_______]                        │
│                                            │
│ ℹ️ We'll use: mail.acmeplumbing.com       │
│                                            │
│ This won't affect your existing email     │
│ (office@acmeplumbing.com will keep working)│
│                                            │
│ Platform emails will send from:            │
│ invoices@mail.acmeplumbing.com             │
│                                            │
│ [Continue]                                 │
└────────────────────────────────────────────┘
```

**DNS Instructions**:

```
┌────────────────────────────────────────────┐
│ Add These DNS Records                      │
├────────────────────────────────────────────┤
│                                            │
│ ⚠️ IMPORTANT: These records are for        │
│ mail.acmeplumbing.com (subdomain only)     │
│                                            │
│ Your existing email won't be affected.     │
│                                            │
│ ──────────────────────────────────────────│
│                                            │
│ Record 1: SPF (TXT)                        │
│ Host: mail.acmeplumbing.com                │
│ Value: v=spf1 include:amazonses.com ~all   │
│ [Copy] ✓                                   │
│                                            │
│ Record 2: DKIM (TXT)                       │
│ Host: resend._domainkey.mail.acmeplumbing..│
│ Value: p=MIGfMA0GCS...                     │
│ [Copy] ✓                                   │
│                                            │
│ ──────────────────────────────────────────│
│                                            │
│ ❓ Common Questions:                       │
│                                            │
│ Q: Will this break my existing email?      │
│ A: No! These records are for the subdomain │
│    mail.acmeplumbing.com only. Your        │
│    office@acmeplumbing.com will work fine. │
│                                            │
│ Q: What if I use Google Workspace/Office365│
│ A: No problem! The subdomain is separate.  │
│                                            │
│ [Need Help?] [Continue]                    │
└────────────────────────────────────────────┘
```

## Database Schema Updates

**Make subdomain required**:

```sql
ALTER TABLE company_email_domains
  ALTER COLUMN subdomain SET NOT NULL,
  ALTER COLUMN subdomain SET DEFAULT 'mail';

-- Add constraint to prevent empty subdomain
ALTER TABLE company_email_domains
  ADD CONSTRAINT subdomain_required CHECK (subdomain IS NOT NULL AND subdomain != '');

COMMENT ON COLUMN company_email_domains.subdomain IS
  'REQUIRED subdomain for safety (e.g., "mail"). Main domain setup not allowed to prevent conflicts with existing email systems.';
```

## Code Updates

### Enforce Subdomain Requirement

```typescript
// /src/actions/company-email-domains.ts

export async function setupCompanyEmailDomain(
  companyId: string,
  domainName: string,
  subdomain: string = "mail" // Default but still required
): Promise<ActionResult> {
  // 1. Validate subdomain is provided
  if (!subdomain || subdomain.trim() === "") {
    return {
      success: false,
      error: "Subdomain is required for safety. We recommend 'mail' (e.g., mail.company.com) to avoid conflicts with your existing email system."
    };
  }

  // 2. Validate subdomain format
  const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i;
  if (!subdomainRegex.test(subdomain)) {
    return {
      success: false,
      error: "Invalid subdomain. Use only letters, numbers, and hyphens."
    };
  }

  // 3. Prevent risky subdomains
  const riskySubdomains = ["email", "smtp", "mail-server", "mx", "imap", "pop"];
  if (riskySubdomains.includes(subdomain.toLowerCase())) {
    return {
      success: false,
      error: `Subdomain '${subdomain}' might conflict with email services. Please choose a different name like 'mail', 'notifications', or 'messages'.`
    };
  }

  // 4. Check for existing email (helpful warning)
  const hasExistingEmail = await checkForExistingEmail(domainName);

  const fullDomain = `${subdomain}.${domainName}`;

  // 5. Create domain in Resend
  const resendResult = await createResendDomain(fullDomain);

  // ... rest of implementation
}
```

### Helper Function

```typescript
async function checkForExistingEmail(domain: string): Promise<boolean> {
  try {
    const dns = require('dns').promises;
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch {
    // DNS lookup failed or no MX records
    return false;
  }
}
```

## Testing Scenarios

### Scenario 1: Google Workspace User

**Setup**:
- Domain: acmeplumbing.com
- Existing email: office@acmeplumbing.com (Google Workspace)
- MX records: google.com
- SPF: v=spf1 include:_spf.google.com ~all

**Our Setup**:
- Subdomain: mail.acmeplumbing.com
- Platform sends from: invoices@mail.acmeplumbing.com
- SPF: v=spf1 include:amazonses.com ~all (on subdomain)

**Result**: ✅ No conflict - both work independently

### Scenario 2: Microsoft 365 User

**Setup**:
- Domain: hvacpro.com
- Existing email: team@hvacpro.com (Microsoft 365)
- MX records: outlook.com
- SPF: v=spf1 include:spf.protection.outlook.com ~all

**Our Setup**:
- Subdomain: notifications.hvacpro.com
- Platform sends from: reminders@notifications.hvacpro.com
- SPF: v=spf1 include:amazonses.com ~all (on subdomain)

**Result**: ✅ No conflict

### Scenario 3: No Existing Email

**Setup**:
- Domain: newplumbing.com
- No existing email setup
- No MX records

**Our Setup**:
- Subdomain: mail.newplumbing.com
- Platform sends from: invoices@mail.newplumbing.com

**Result**: ✅ Works perfectly, ready to expand later

## Migration Plan

### Existing Companies

If we already set up any domains **without** subdomains:

1. **Audit**: Find all domains without subdomains
   ```sql
   SELECT * FROM company_email_domains
   WHERE subdomain IS NULL OR subdomain = '';
   ```

2. **Contact**: Email affected companies
   ```
   Subject: Action Required: Update Your Email Domain

   We're updating your email domain setup for better compatibility
   with your existing email system.

   Current: invoices@company.com
   New: invoices@mail.company.com

   This ensures our platform emails won't interfere with your
   office@company.com email.

   Action required: Please add these new DNS records...
   ```

3. **Grace Period**: 14 days to add new subdomain records

4. **Cutover**: Switch to subdomain sending

### New Companies

- Subdomain required in onboarding
- Cannot proceed without subdomain
- Clear explanation of safety

## Support Documentation

### FAQ

**Q: Why do I need a subdomain?**
A: For safety! If you use Google Workspace or Microsoft 365 for office@company.com, adding our DNS records to the main domain could break your existing email. The subdomain (mail.company.com) is completely separate and safe.

**Q: Will customers see the subdomain?**
A: Yes, emails will come from invoices@mail.company.com. This is industry standard - even ServiceTitan uses sending subdomains.

**Q: Can I use my main domain?**
A: No, for your safety. We require a subdomain to prevent conflicts with your existing email system.

**Q: What subdomain should I use?**
A: We recommend "mail" (mail.company.com). Other good options: "notifications", "messages", "app".

**Q: Will this affect my office@company.com email?**
A: No! The subdomain is completely separate. Your existing email will continue working exactly as before.

## Next Steps

1. ✅ Enforce subdomain requirement in code
2. ✅ Update database schema to require subdomain
3. ✅ Add DNS safety checks
4. ✅ Create clear user warnings
5. ✅ Update documentation
6. ✅ Test with Google Workspace/Microsoft 365
7. ✅ Create video tutorial showing subdomain is safe

## Summary

**The Rule**: ALWAYS use a subdomain, NEVER the main domain.

**Why**: Prevents breaking existing email systems.

**Result**: Safe, professional, no conflicts.
