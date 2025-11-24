# Reply-To Email Architecture

## Critical Rule

**Reply-to addresses ALWAYS use the platform subdomain (`mail.thorbis.com`), regardless of which email provider or sending method is used.**

## The Rule Applies To ALL Email Providers

### 1. Platform Subdomain (Resend/Postmark)
**FROM:** `notifications@acme-plumbing.mail.thorbis.com`
**REPLY-TO:** `support@acme-plumbing.mail.thorbis.com`

### 2. Custom Domain
**FROM:** `notifications@acme-plumbing.com` (customer's custom domain)
**REPLY-TO:** `support@acme-plumbing.mail.thorbis.com` (platform subdomain)

### 3. Gmail Integration
**FROM:** `john@gmail.com` (personal Gmail)
**REPLY-TO:** `support@acme-plumbing.mail.thorbis.com` (platform subdomain)

---

## Why This Architecture?

1. **Centralized Inbox**: All customer replies go to one place per company
2. **No Custom Domain Replies**: Prevents replies from going to domains companies may not monitor
3. **No Personal Email Replies**: Gmail users don't get flooded with customer replies
4. **Per-Company Isolation**: Each company has their own branded reply-to subdomain
5. **User Control**: Companies can customize the reply-to prefix (support@, help@, team@, etc.)

---

## Database Schema

Reply-to configuration is stored in `company_email_domains` table:

```sql
-- Each company has one or more email domains
company_email_domains (
  id uuid PRIMARY KEY,
  company_id uuid REFERENCES companies(id),
  domain_name text,  -- e.g., "acme-plumbing.mail.thorbis.com"
  is_platform_subdomain boolean,  -- true for mail.thorbis.com, false for custom
  reply_to_email text,  -- e.g., "support@acme-plumbing.mail.thorbis.com"
  status text,  -- "verified", "pending", "failed"
  sending_enabled boolean,
  -- ... other fields
)
```

**Key Fields:**
- `is_platform_subdomain`: `true` for platform subdomains, `false` for custom domains
- `reply_to_email`: Configurable reply-to address (optional)
- Default if null: `support@{company-subdomain}.mail.thorbis.com`

---

## Implementation Details

### 1. Main Email Sender (`/src/lib/email/email-sender.ts`)

```typescript
// Lines 154-178
if (companyId) {
  activeDomain = await getCompanyActiveDomain(companyId);

  // Set reply-to from company's platform domain configuration
  if (activeDomain.replyToEmail) {
    companyReplyTo = activeDomain.replyToEmail;
  } else {
    // Default to support@{company-domain}
    companyReplyTo = `support@${activeDomain.domain}`;
  }
}

// Priority: Explicit override → Company config → Default
const finalReplyTo = replyTo || companyReplyTo || undefined;
```

**Modified Functions:**
- `sendEmail()`: Updated to fetch and apply company's reply-to from database
- `getCompanyActiveDomain()`: Now returns `replyToEmail` field (line 183-207 in rate-limiter.ts)

### 2. Gmail Integration (`/src/lib/email/gmail-client.ts`)

Gmail client receives reply-to from the main email sender:

```typescript
// Line 435-457
export async function sendCompanyGmailEmail(
  companyId: string,
  emailData: GmailEmailData  // Contains replyTo from email-sender.ts
): Promise<GmailSendResult>
```

The reply-to is passed through from `email-sender.ts` → `email-provider.ts` → `gmail-client.ts`, ensuring Gmail emails also use the platform subdomain.

### 3. Company Domain Sender (`/src/lib/email/company-domain-sender.ts`)

For custom domains, we fetch the platform subdomain separately:

```typescript
// Lines 75-104: New function
async function getCompanyPlatformReplyTo(
  companyId: string
): Promise<string | null> {
  // Fetch the platform subdomain (is_platform_subdomain = true)
  const { data: platformDomain } = await supabase
    .from("company_email_domains")
    .select("domain_name, reply_to_email")
    .eq("company_id", companyId)
    .eq("is_platform_subdomain", true)
    .eq("status", "verified")
    .maybeSingle();

  // Use configured reply-to or default to support@
  return platformDomain.reply_to_email || `support@${platformDomain.domain_name}`;
}

// Lines 170-174: Usage in sendCompanyEmail
const platformReplyTo = await getCompanyPlatformReplyTo(companyId);
const replyToAddress = replyTo || platformReplyTo || fallback;
```

### 4. Bulk Email Sender (`/src/lib/email/bulk-email-sender.ts`)

Uses `sendEmail()` under the hood, so automatically inherits the reply-to logic.

### 5. Email Provider Layer (`/src/lib/email/email-provider.ts`)

Passes reply-to through to all providers (Resend, Postmark, Gmail):

```typescript
// Line 349: Gmail
replyTo: options.replyTo,

// Line 314: Postmark
replyTo: options.replyTo,

// Line 264: Resend
replyTo: options.replyTo,
```

---

## Configuration Priority

Reply-to is determined in this order:

1. **Explicit Override**: If `replyTo` parameter is passed to `sendEmail()`
2. **Database Config**: `company_email_domains.reply_to_email` (if set)
3. **Default**: `support@{company-slug}.mail.thorbis.com`

---

## User-Facing Configuration

### Onboarding
During onboarding, companies can:
- Set their preferred reply-to prefix (support@, help@, team@, etc.)
- Choose to accept the default (support@)

### Settings Page (Future)
Companies can update their reply-to address:
- Available prefixes: support@, help@, replies@, team@, info@
- Always constrained to their platform subdomain
- Stored in `company_email_domains.reply_to_email`

### Team Member Creation (Future)
When creating team members, companies can optionally:
- Create email addresses for team members (e.g., `john@acme-plumbing.mail.thorbis.com`)
- These can be used as FROM addresses or reply-to addresses
- All constrained to the platform subdomain

---

## Testing Scenarios

### Test 1: Platform Subdomain → Platform Subdomain
```typescript
FROM: notifications@acme-plumbing.mail.thorbis.com
REPLY-TO: support@acme-plumbing.mail.thorbis.com
✅ Both use platform subdomain
```

### Test 2: Custom Domain → Platform Subdomain
```typescript
FROM: notifications@acme-plumbing.com (custom)
REPLY-TO: support@acme-plumbing.mail.thorbis.com (platform)
✅ Reply-to uses platform, not custom
```

### Test 3: Gmail → Platform Subdomain
```typescript
FROM: john@gmail.com (personal)
REPLY-TO: support@acme-plumbing.mail.thorbis.com (platform)
✅ Reply-to uses platform, not Gmail
```

### Test 4: No Configuration → Default
```typescript
FROM: notifications@acme-plumbing.mail.thorbis.com
REPLY-TO: support@acme-plumbing.mail.thorbis.com (default)
✅ Automatically defaults to support@
```

### Test 5: Custom Reply-To Prefix
```typescript
Database: reply_to_email = "help@acme-plumbing.mail.thorbis.com"
FROM: notifications@acme-plumbing.mail.thorbis.com
REPLY-TO: help@acme-plumbing.mail.thorbis.com
✅ Uses custom prefix from database
```

---

## Environment Variables

```bash
# .env.local or .env.example
PLATFORM_EMAIL_DOMAIN="mail.thorbis.com"
```

This is used by `generatePlatformSubdomain()` to create company subdomains:
```typescript
const platformDomain = process.env.PLATFORM_EMAIL_DOMAIN || "mail.stratos.app";
return `${sanitized}.${platformDomain}`;
// Result: acme-plumbing.mail.thorbis.com
```

---

## Files Modified

### Core Email Files
1. `/src/lib/email/email-sender.ts` - Main sending logic updated (lines 121-185)
2. `/src/lib/email/rate-limiter.ts` - Added `replyToEmail` to return type (line 189)
3. `/src/lib/email/company-domain-sender.ts` - New function `getCompanyPlatformReplyTo()` (lines 75-104)

### Gmail Integration
4. `/src/lib/email/gmail-client.ts` - Already passes through reply-to correctly (line 457)
5. `/src/lib/email/email-provider.ts` - Passes reply-to to all providers (lines 264, 314, 349)

### Documentation
6. `.env.example` - Updated with reply-to documentation (lines 141-146)
7. `.env.local` - Set PLATFORM_EMAIL_DOMAIN (line 126)

### Type Definitions
8. `/src/lib/email/email-types.ts` - Updated JSDoc for `replyTo` parameter (line 252)

---

## Migration Notes

**Existing Data:**
- No database migration needed - `reply_to_email` field already exists
- Existing companies will use default `support@{company}.mail.thorbis.com`
- Companies can update via settings UI (when built)

**Backwards Compatibility:**
- All existing email sending continues to work
- If `reply_to_email` is null, defaults to support@
- Explicit `replyTo` parameter still works (for overrides)

---

## Security Considerations

1. **SPF/DKIM Alignment**: Reply-to doesn't need to match FROM for SPF/DKIM
2. **DMARC**: Reply-to not evaluated by DMARC policies
3. **User Safety**: Prevents replies going to unmonitored custom domains
4. **Spam Prevention**: Centralized reply addresses help build reputation

---

## Future Enhancements

### Phase 1: Settings UI
- Add "Reply-To Configuration" section in Email Settings
- Allow companies to select reply-to prefix
- Show preview: `{prefix}@company-slug.mail.thorbis.com`

### Phase 2: Team Member Emails
- When creating team members, option to create email address
- Format: `{firstname}@company-slug.mail.thorbis.com`
- Can be used as FROM or reply-to for personalized emails
- Stored in `team_members.email` field

### Phase 3: Routing (Optional)
- Set up inbound email routing with Resend
- Forward replies to team members or shared inbox
- Email-to-ticket conversion

---

## Support & Troubleshooting

### Issue: Replies going to wrong address
**Check:**
1. `company_email_domains.reply_to_email` in database
2. Is `is_platform_subdomain = true` domain verified?
3. Are there multiple domains? (Should prefer platform)

### Issue: Custom domain replies blocked
**Expected behavior!** Custom domains should NEVER be used for reply-to.

### Issue: Gmail replies going to sender
**Expected behavior!** Personal Gmail should NEVER receive customer replies.

---

## Related Documentation

- `/docs/email/EMAIL_SYSTEM_ARCHITECTURE.md` - Overall email system
- `/docs/email/CUSTOM_DOMAIN_SETUP.md` - Custom domain configuration
- `/docs/email/GMAIL_INTEGRATION.md` - Gmail OAuth setup
- `/src/lib/stores/README.md` - State management patterns
