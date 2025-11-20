# Resend Multi-Tenant Email Domain Setup

**Status**: Foundation Complete - Ready for UI Integration
**Date**: 2025-11-18

## Overview

Implemented automated company email domain setup using Resend's multi-tenant API. Each company can now register their own domain for sending emails through the platform.

## Architecture

### Database Schema

Created `company_email_domains` table with:
- Company relationship (multi-tenant isolation)
- Domain management (name, Resend ID, status)
- DNS record storage (SPF, DKIM, DMARC)
- Regional configuration (us-east-1, eu-west-1, etc.)
- Sending/receiving capabilities
- Verification timestamps

**Migration**: `20251118225303_create_company_email_domains.sql`

### Server Actions

Created `/src/actions/company-email-domains.ts` with:

1. **`setupCompanyEmailDomain()`**
   - Validates domain format
   - Creates domain in Resend API
   - Stores in database
   - Returns DNS records for verification

2. **`syncDomainVerificationStatus()`**
   - Polls Resend API for verification status
   - Updates database with latest status
   - Tracks verification timestamp

3. **`triggerDomainVerification()`**
   - Manually triggers verification check
   - Updates status to "verifying"

4. **`deleteCompanyEmailDomain()`**
   - Removes from Resend API
   - Deletes from database

5. **`getCompanyEmailDomains()`**
   - Lists all domains for a company

### Existing Infrastructure

**Resend API Client** (`/src/lib/email/resend-domains.ts`):
- `createResendDomain()`
- `getResendDomain()`
- `verifyResendDomain()`
- `deleteResendDomain()`
- Webhook signature verification

**Cron Sync** (`/src/app/api/cron/resend-domain-sync/route.ts`):
- Auto-syncs pending domains
- Updates verification status
- Already implemented

## DNS Records Required

When a domain is created, Resend returns DNS records that must be added:

1. **SPF Record** (TXT)
   - Authorizes Resend IPs to send email
   - Example: `v=spf1 include:amazonses.com ~all`

2. **DKIM Record** (TXT)
   - Public key for email authentication
   - Example: `resend._domainkey IN TXT "p=MIGfMA0GCS..."`

3. **DMARC Record** (TXT) - Optional but recommended
   - Email authentication policy
   - Example: `v=DMARC1; p=none; rua=mailto:dmarc@company.com`

## Verification Flow

```
1. User submits domain (e.g., "mycompany.com")
   ↓
2. System creates domain in Resend
   ↓
3. Resend returns DNS records
   ↓
4. UI displays records for user to add
   ↓
5. User adds records to their DNS
   ↓
6. User clicks "Verify Domain"
   ↓
7. System calls Resend verification API
   ↓
8. Resend checks DNS records
   ↓
9. Status updates to "verified" or "failed"
   ↓
10. Cron job syncs status every hour
```

## Integration Points

### Onboarding Flow

**Planned**: Add as Step 3.5 (between Phone and Banking)

```typescript
{
  id: 3.5,
  title: "Email Domain",
  icon: Mail,
  description: "Setup your company email"
}
```

**Component Needed**: `/src/components/onboarding/email-domain-step.tsx`

Should include:
- Domain input field
- DNS record display
- Verification status
- "Verify Now" button
- "Skip for now" option

### Settings Page

**Planned**: `/dashboard/settings/email-domains`

Should display:
- List of all domains
- Verification status
- DNS records
- Add new domain button
- Delete domain option

## Resend API Limits

- **Free Tier**: 100 emails/day, 3,000 emails/month
- **Pro Tier**: $20/month for 50,000 emails
- **Domains**: Unlimited domains per account
- **Verification**: Typically takes 24-48 hours

## Security

### RLS Policies

```sql
-- Users can view their company's domains
SELECT: team_members.company_id matches domain.company_id

-- Only admins/owners can manage domains
INSERT/UPDATE/DELETE: team_members.role IN ('owner', 'admin')
```

### API Key Management

- Resend API key stored in `.env.local` as `RESEND_API_KEY`
- Webhook secret as `RESEND_WEBHOOK_SECRET`
- Service role used for automated sync

## Next Steps

1. **Create Email Domain Onboarding Step**
   - Component: `/src/components/onboarding/email-domain-step.tsx`
   - Add to welcome-page-redesigned.tsx
   - Update step numbering (shift Banking/Payments to 4/5)

2. **Create DNS Record Display Component**
   - Component: `/src/components/email/dns-record-display.tsx`
   - Copy-to-clipboard buttons
   - Verification instructions
   - Status indicators

3. **Add to Settings**
   - Page: `/src/app/(dashboard)/dashboard/settings/email-domains/page.tsx`
   - List view with status
   - Add/delete domain flows

4. **Update Onboarding Progress Tracking**
   - Add `emailDomainSetup` to onboarding_progress JSONB
   - Update completion criteria

5. **Testing**
   - Test domain creation
   - Test verification flow
   - Test deletion
   - Test cron sync

## Example Usage

```typescript
// In onboarding component
import { setupCompanyEmailDomain, syncDomainVerificationStatus } from "@/actions/company-email-domains";

// Setup domain
const result = await setupCompanyEmailDomain(
  companyId,
  "mycompany.com"
);

if (result.success) {
  // Display DNS records from result.data.dnsRecords
  console.log("Add these DNS records:", result.data.dnsRecords);
}

// Check verification
const status = await syncDomainVerificationStatus(domainId);
if (status.data.verified) {
  console.log("Domain verified!");
}
```

## Benefits

1. **Professional Emails**: Companies send from their own domain
2. **Better Deliverability**: SPF/DKIM/DMARC improve inbox placement
3. **Brand Trust**: Emails come from @company.com, not @platform.com
4. **Compliance**: Meets email authentication requirements
5. **10DLC Support**: Verified email domain helps with 10DLC registration

## Related Files

- `/src/actions/company-email-domains.ts` - Server actions
- `/src/lib/email/resend-domains.ts` - Resend API client
- `/src/app/api/cron/resend-domain-sync/route.ts` - Auto-sync cron
- `/supabase/migrations/20251118225303_create_company_email_domains.sql` - Database schema

## References

- [Resend API Documentation](https://resend.com/docs/api-reference/domains)
- [Resend Multi-Tenant Guide](https://resend.com/blog/multiple-teams)
- [DNS Record Types](https://resend.com/docs/dashboard/domains/introduction)
