# Email Automation Overview

Thorbis provisions per-company email infrastructure automatically so every tenant receives dedicated DNS, sending reputation, and inbound routing.

## Components

- **Sending Domains** – Backed by Resend. Each company owns a domain entry (`communication_email_domains`) with the DNS records required for SPF, DKIM, and return-path validation.
- **Inbound Routes** – Unique addresses per company stored in `communication_email_inbound_routes`. Customer replies and direct inbound emails are posted to `/api/webhooks/resend`, which writes to the `communications` table and stores attachments in the `email-attachments` storage bucket.
- **Events** – Delivery, open, and bounce telemetry are saved to `communication_email_events` and hydrate communication timelines.

## Automation Flow

1. During onboarding, Thorbis extracts the company website domain (if provided) and automatically calls the Resend Domains API.
2. DNS instructions appear on the Communications → Email settings page with copy-ready record values.
3. Inbound routing is pre-provisioned using the pattern `company-{id}@${RESEND_INBOUND_DOMAIN}` or can be enabled with a single click.
4. The email settings page also exposes manual controls to refresh/verify DNS and force inbound provisioning if needed.

## Required Environment Variables

```
RESEND_API_KEY=...
RESEND_WEBHOOK_SECRET=...
RESEND_INBOUND_DOMAIN=inbound.thorbis.com
NEXT_PUBLIC_SITE_URL=https://app.thorbis.com
```

## Buckets / Tables

- `communication_email_domains`
- `communication_email_inbound_routes`
- `communication_email_events`
- Storage bucket: `email-attachments`

Keep this document updated when adding new automation steps or changing DNS requirements.

