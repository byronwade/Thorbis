# Gmail Integration Setup (Multi-Tenant)

This guide explains how to set up Gmail as an email provider option for companies in a multi-tenant environment.

## Overview

Stratos supports three email provider options per company (tenant):

1. **Managed** (Default) - Resend (primary) with Postmark (fallback) - High deliverability, company branding
2. **Gmail** - Company connects their own Gmail account for sending
3. **Disabled** - Email is completely disabled for the company

This is a **company-level** setting, meaning all team members of a company share the same email provider configuration. Only company admins or owners can change these settings.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                 Multi-Tenant Email Provider Selection            │
├─────────────────────────────────────────────────────────────────┤
│  Company Preference Check:                                       │
│    ├─ If preference = "disabled"                                 │
│    │   └─ Return error (email disabled for this company)         │
│    │                                                             │
│    ├─ If preference = "gmail" AND company tokens valid           │
│    │   └─ Send via Gmail API                                     │
│    │       └─ On failure → Fall through to managed               │
│    │                                                             │
│    └─ If preference = "managed" OR Gmail unavailable             │
│        └─ Send via Resend                                        │
│            └─ On failure → Try Postmark                          │
│                └─ On failure → Return error                      │
└─────────────────────────────────────────────────────────────────┘
```

## Prerequisites

### Google Cloud Console Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Note your project ID

2. **Enable Gmail API**
   - Go to APIs & Services → Library
   - Search for "Gmail API"
   - Click Enable

3. **Configure OAuth Consent Screen**
   - Go to APIs & Services → OAuth consent screen
   - Choose "External" user type (for production)
   - Fill in required fields:
     - App name: Your app name
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes:
     - `https://www.googleapis.com/auth/gmail.send`
     - `https://www.googleapis.com/auth/userinfo.email`
     - `https://www.googleapis.com/auth/userinfo.profile`
   - Add test users (while in testing mode)

4. **Create OAuth 2.0 Credentials**
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Stratos Gmail Integration"
   - Authorized redirect URIs:
     - Development: `http://localhost:3000/api/gmail/callback`
     - Production: `https://yourdomain.com/api/gmail/callback`
   - Copy the Client ID and Client Secret

## Environment Variables

Add these to your `.env.local` (development) or production environment:

```bash
# ============================================================================
# EMAIL SERVICE (GMAIL - COMPANY OPTION)
# ============================================================================
# Gmail integration allows companies to send from their own Gmail
# instead of the managed providers (Resend/Postmark)

# Google OAuth credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# App URL for OAuth redirect
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Note**: Without `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, the Gmail option will be automatically hidden in company settings.

## Database Schema

### Tables

**`company_gmail_tokens`** - Stores OAuth tokens for each company:
- `company_id` - Foreign key to companies table
- `gmail_email` - The Gmail address being used
- `gmail_display_name` - Display name from Google
- `access_token` - OAuth access token
- `refresh_token` - OAuth refresh token
- `token_expires_at` - When access token expires
- `is_valid` - Whether tokens are valid
- `scopes` - Granted OAuth scopes
- `connected_by` - User ID who connected Gmail
- `connected_by_name` - Name of user who connected

**`companies.email_provider`** - Enum column with values:
- `'managed'` - Use Resend/Postmark (default)
- `'gmail'` - Use company's connected Gmail
- `'disabled'` - Email is disabled

### RLS Policies

Only company admins/owners can manage Gmail tokens:
```sql
CREATE POLICY "Company admins can manage gmail tokens"
    ON company_gmail_tokens
    FOR ALL
    USING (
        company_id IN (
            SELECT company_id FROM team_members
            WHERE user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );
```

## Company Flow

### Connecting Gmail

1. Company admin navigates to Settings → Email
2. Admin clicks "Connect Gmail"
3. Admin is redirected to Google OAuth consent screen
4. Admin grants permission for gmail.send scope
5. Google redirects back to `/api/gmail/callback`
6. Tokens are stored in `company_gmail_tokens`
7. Company preference is set to "gmail"
8. Admin is redirected to settings with success message

### Disconnecting Gmail

1. Admin clicks "Disconnect Gmail"
2. `disconnectCompanyGmailAction()` is called
3. Tokens are deleted from database
4. Token is revoked with Google (best effort)
5. Company preference is reset to "managed"

### Sending Emails

When `sendEmailWithFallback()` is called with a `companyId`:

1. Check company's `email_provider` preference
2. If "disabled":
   - Return error immediately
3. If "gmail" and valid tokens exist:
   - Refresh token if needed
   - Send via Gmail API
   - If fails, fall through to managed
4. If "managed" or Gmail unavailable:
   - Try Resend
   - If fails, try Postmark
   - If both fail, return error

## Rate Limits

| Account Type | Daily Limit |
|--------------|-------------|
| Consumer Gmail | 100 emails/day |
| Google Workspace | 2,000 emails/day |
| Per-minute | 100 messages |

## Token Refresh

- Access tokens expire after 1 hour
- System automatically refreshes tokens 5 minutes before expiration
- Refresh tokens are long-lived (6 months if unused)
- If refresh fails, company admin must reconnect Gmail

## Security Considerations

1. **Token Storage**
   - Tokens stored in Supabase with RLS
   - Only company admins/owners can access
   - Service role used for token refresh jobs

2. **State Parameter**
   - OAuth state contains base64 encoded JSON with companyId, userId, userName
   - Verified in callback handler (CSRF protection)

3. **Scope Verification**
   - Callback verifies gmail.send scope was granted
   - Rejects if admin didn't grant all permissions

4. **Role Verification**
   - Callback verifies user is admin/owner of the company
   - Prevents unauthorized connections

## API Reference

### Server Actions

```typescript
// Get current company status
const status = await getCompanyEmailProviderStatus();
// Returns: { preference, gmailConnected, gmailEmail, gmailConnectedBy, ... }

// Update company preference
await updateCompanyEmailProviderPreference("gmail");
await updateCompanyEmailProviderPreference("managed");
await updateCompanyEmailProviderPreference("disabled");

// Get connect URL (redirect admin here)
const { url } = await getCompanyGmailConnectUrl();

// Disconnect Gmail
await disconnectCompanyGmailAction();

// Check if Gmail integration is available
const { available } = await isGmailIntegrationAvailable();

// Verify connection (makes real API call)
const result = await verifyCompanyGmailConnection();
```

### Gmail Client Functions

```typescript
// Send email via company Gmail
const result = await sendCompanyGmailEmail(companyId, {
  to: "recipient@example.com",
  subject: "Hello",
  html: "<p>Email body</p>",
});

// Check health
const health = await checkCompanyGmailHealth(companyId, true);

// Get/refresh company tokens
const tokens = await getCompanyGmailTokens(companyId);

// Get company provider preference
const preference = await getCompanyEmailProvider(companyId);
```

### Email Provider Usage

```typescript
import { sendEmailWithFallback } from "@/lib/email/email-provider";

// Send with company context (multi-tenant)
const result = await sendEmailWithFallback({
  to: "customer@example.com",
  subject: "Invoice",
  html: "<p>Your invoice is attached</p>",
  companyId: "company-uuid-here", // Required for multi-tenant
});

if (result.success) {
  console.log(`Sent via ${result.provider}, ID: ${result.messageId}`);
} else {
  console.error(`Failed: ${result.error}`);
}
```

## Troubleshooting

### "No refresh token received"

This happens when the user has previously granted access. Solutions:
- User revokes access at myaccount.google.com/permissions
- Admin reconnects Gmail
- The OAuth URL uses `prompt: "consent"` to force refresh token

### "Gmail send failed" after working

Token may have expired or been revoked:
- Check `is_valid` column in company_gmail_tokens
- Admin may need to reconnect Gmail

### "Missing gmail.send scope"

Admin didn't grant all permissions:
- Admin needs to disconnect and reconnect
- Ensure all checkboxes are checked on consent screen

### "Not authenticated or not an admin/owner"

Only company admins/owners can manage Gmail settings:
- Check user's role in team_members table
- User must have `role = 'owner'` or `role = 'admin'`

## Files Reference

| File | Description |
|------|-------------|
| `src/lib/email/gmail-client.ts` | Company-level Gmail API client |
| `src/lib/email/email-provider.ts` | Multi-tenant provider abstraction |
| `src/actions/settings/email-provider.ts` | Server actions for settings |
| `src/app/api/gmail/callback/route.ts` | OAuth callback handler |

## Future Enhancements

1. **Email Templates** - Allow using company templates with Gmail
2. **Sending Limits** - Track and enforce rate limits per company
3. **Multiple Gmail Accounts** - Support connecting multiple accounts per company
4. **Gmail Read Access** - Allow reading/syncing Gmail inbox
5. **Calendar Integration** - Schedule emails using Google Calendar
