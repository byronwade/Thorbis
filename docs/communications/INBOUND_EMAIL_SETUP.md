# Inbound Email Setup Guide

This guide explains how to set up and configure inbound email receiving using Resend in your Thorbis application.

## Overview

The inbound email system allows your application to receive emails sent to your configured domains and display them in the communication dashboard. This uses Resend's inbound email functionality with webhooks.

## Architecture

```
Email Sent → Resend SMTP Server → Webhook → Your App → Database → UI Display
```

1. **Email Reception**: Resend receives emails at configured domains
2. **Webhook Notification**: Resend sends a webhook with email metadata
3. **Content Fetching**: Your app fetches full email content and attachments from Resend API
4. **Storage**: Email stored in communications table with attachments in Supabase Storage
5. **Display**: Emails shown in communication dashboard with HTML rendering

## Prerequisites

### Environment Variables

Ensure these are configured in your `.env.local`:

```bash
RESEND_API_KEY=your_resend_api_key
RESEND_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Database Tables

The system uses these tables (automatically created via migrations):

- `communications` - Stores email content and metadata
- `communication_email_inbound_routes` - Maps email addresses to companies
- `email_logs` - Tracks email sending operations
- `email_attachments` - Supabase Storage bucket for attachments

## Setup Steps

### 1. Get Your Resend Domain

1. Go to [Resend Emails Dashboard](https://resend.com/emails)
2. Select the "Receiving" tab
3. Click the three dots menu → "Receiving address"
4. Copy your domain (format: `abc123.resend.app`)

### 2. Configure Webhook

1. Go to [Resend Webhooks](https://resend.com/webhooks)
2. Click "Add Webhook"
3. Configure:
   - **URL**: `https://yourdomain.com/api/webhooks/resend`
   - **Event Type**: `email.received`
4. Click "Add"

### 3. Test the Setup

Run the setup script to verify configuration:

```bash
npm run tsx scripts/setup-inbound-email.ts
```

Test the webhook endpoint:

```bash
npm run tsx scripts/test-webhook.ts
```

### 4. Send a Test Email

Send an email to any address at your Resend domain:

```
To: test@yourdomain.resend.app
Subject: Test Email
Body: This is a test email
```

The email should appear in your communication dashboard within a few seconds.

## Company-Specific Routes

For production use, configure specific email addresses for different purposes:

### Via API

```typescript
import { createInboundRoute } from "@/actions/settings/communications";

await createInboundRoute(new FormData({
  routeAddress: "support@yourdomain.com",
  name: "Customer Support",
  description: "Handle customer support emails",
  enabled: true,
}));
```

### Via Settings UI

1. Go to Settings → Communications → Email
2. Add inbound routes for specific email addresses
3. Each route can be assigned to different teams or purposes

## Webhook Processing

### Payload Structure

The webhook sends this payload for `email.received` events:

```json
{
  "type": "email.received",
  "created_at": "2024-02-22T23:41:12.126Z",
  "data": {
    "email_id": "unique-email-id",
    "subject": "Email Subject",
    "from": [{"email": "sender@example.com", "name": "Sender Name"}],
    "to": [{"email": "recipient@yourdomain.com"}],
    "created_at": "2024-02-22T23:41:11.894719+00:00",
    "attachments": [
      {
        "id": "attachment-id",
        "filename": "document.pdf",
        "content_type": "application/pdf"
      }
    ]
  }
}
```

### Processing Flow

1. **Webhook Validation**: Verify Svix signature
2. **Route Lookup**: Find company for destination email
3. **Content Fetching**: Call Resend API for full email content
4. **Attachment Download**: Fetch and store attachments
5. **Database Storage**: Store email in communications table
6. **Real-time Updates**: Notify connected clients

## Security

### Webhook Verification

All webhooks are verified using Svix signatures:

```typescript
// Headers required:
svix-id: "webhook-id"
svix-timestamp: "timestamp"
svix-signature: "v1,signature"
```

### Attachment Handling

- Attachments are downloaded from Resend API
- Stored securely in Supabase Storage
- File paths include company ID for isolation
- Content-Type validation prevents malicious uploads

## Troubleshooting

### Webhook Not Receiving Emails

1. Check webhook URL is accessible: `curl https://yourdomain.com/api/webhooks/resend`
2. Verify webhook secret matches environment variable
3. Check Resend dashboard for webhook delivery status
4. Test with the webhook test script

### Emails Not Appearing in Dashboard

1. Verify inbound route exists for the destination email
2. Check database for communications records
3. Look for errors in webhook processing logs
4. Ensure company ID is correctly set in routes

### Attachment Issues

1. Check Supabase Storage bucket `email-attachments` exists
2. Verify storage permissions allow uploads
3. Check file size limits (Resend allows large attachments)
4. Look for errors in attachment processing logs

## Advanced Configuration

### Custom Domains

For production, use custom domains instead of Resend's subdomain:

1. Add MX records pointing to Resend's SMTP servers
2. Configure domain in Resend dashboard
3. Update inbound routes to use custom domain addresses

### Multiple Routes per Company

Configure multiple email addresses for different purposes:

```
support@yourdomain.com → Support team
sales@yourdomain.com → Sales team
billing@yourdomain.com → Finance team
```

### Email Forwarding

Set up rules to forward emails from existing email providers to Resend addresses.

## Monitoring

### Dashboard Metrics

- Total emails received
- Emails by route/destination
- Attachment storage usage
- Processing success/failure rates

### Logs

Check these logs for issues:

- Webhook processing logs in your app
- Resend dashboard webhook delivery logs
- Database query logs for communication inserts

## API Reference

### Webhook Endpoints

- `POST /api/webhooks/resend` - Main webhook handler

### Email Actions

- `getEmailsAction()` - Fetch company emails
- `getEmailStatsAction()` - Get email statistics
- `createInboundRoute()` - Create email routes
- `getInboundRoutes()` - List company routes

### Resend API Calls

- `getReceivedEmail(emailId)` - Fetch full email content
- `listReceivedEmailAttachments(emailId)` - List attachments
- `getReceivedEmailAttachment(emailId, attachmentId)` - Download attachment

## Performance Considerations

- Webhooks are processed asynchronously
- Large attachments are streamed to avoid memory issues
- Database queries use proper indexing
- Real-time updates use Supabase subscriptions

## Support

For issues with inbound email setup:

1. Check the setup script output
2. Review webhook delivery logs in Resend dashboard
3. Test with the webhook test script
4. Check application logs for processing errors

The system is designed to be reliable and handle high volumes of inbound emails while maintaining security and performance.



