# Bulk Email Sending Guide

## Overview

The bulk email sending feature allows you to send multiple invoices or estimates to customers via email safely, with built-in protections against Resend API rate limits and errors.

## Features

### 🛡️ Rate Limiting Protection

- **Batch Processing**: Emails are sent in small batches (default: 10 emails per batch)
- **Controlled Delays**: 1-second delay between batches to respect API limits
- **Automatic Retry**: Failed emails are automatically retried up to 2 times
- **Individual Error Handling**: Each email's success/failure is tracked independently

### 📊 Progress Tracking

- **Real-time Feedback**: Loading toast shows progress during sending
- **Detailed Results**: Shows count of successful, failed, and skipped emails
- **Error Reporting**: Clear error messages for each failure

### 🔒 Safety Features

- **Authentication Required**: Only authenticated users can send bulk emails
- **Company Validation**: Emails can only be sent for invoices/estimates in user's company
- **Email Validation**: Automatically skips items without customer email addresses
- **Confirmation Dialog**: User must confirm before sending with estimated time

## Architecture

### Components

1. **`bulk-email-sender.ts`**
   - Core bulk sending logic
   - Rate limiting implementation
   - Progress tracking
   - Retry logic

2. **`bulk-communications.ts`**
   - Server actions for invoices and estimates
   - Database queries and validation
   - Status updates after sending

3. **DataTables** (`invoices-table.tsx`, `estimates-table.tsx`)
   - UI integration
   - User confirmation dialogs
   - Toast notifications

## Usage

### For Users

1. **Select Items**: Check the boxes next to invoices/estimates to send
2. **Click Send Button**: Click the "Send" button in the bulk actions toolbar
3. **Confirm**: Review the confirmation dialog showing:
   - Number of items to send
   - Estimated time
   - Notice about email requirements
4. **Wait**: Watch the progress toast as emails are sent
5. **Review Results**: See success/failure counts in final toast

### For Developers

#### Send Invoices

```typescript
import { bulkSendInvoices } from "@/actions/bulk-communications";

const result = await bulkSendInvoices(
  ["inv_123", "inv_456", "inv_789"],
  {
    batchSize: 10,      // Emails per batch
    batchDelay: 1000,   // Milliseconds between batches
    maxRetries: 2,      // Retry attempts per email
    retryDelay: 5000,   // Milliseconds between retries
  }
);

console.log(`Sent ${result.results?.successful} of ${result.results?.total}`);
```

#### Send Estimates

```typescript
import { bulkSendEstimates } from "@/actions/bulk-communications";

const result = await bulkSendEstimates(
  ["est_123", "est_456"],
  {
    batchSize: 5,
    batchDelay: 2000,
  }
);
```

## Resend Rate Limits

### Free Tier

- **Daily Limit**: 100 emails/day
- **Rate Limit**: 1 email/second
- **Monthly Limit**: 3,000 emails/month

### Paid Tiers

- **Pro**: 50,000 emails/month, higher rate limits
- **Enterprise**: Custom limits

### How We Handle Limits

1. **Conservative Defaults**: 10 emails per batch, 1-second delays
2. **Configurable**: Can adjust batch size and delays based on plan
3. **Error Handling**: Catches rate limit errors and retries
4. **Logging**: All emails logged to database for tracking

## Configuration

### Adjust for Your Resend Plan

Edit the batch configuration in your datatable files:

```typescript
// For Free Tier (conservative)
{
  batchSize: 5,
  batchDelay: 2000, // 2 seconds
}

// For Pro Tier (faster)
{
  batchSize: 20,
  batchDelay: 500, // 0.5 seconds
}

// For Enterprise (fastest)
{
  batchSize: 50,
  batchDelay: 100, // 0.1 seconds
}
```

### Environment Variables

Required environment variables:

```env
RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME="Your Company"
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Error Handling

### Common Errors

#### "Email service not configured"

**Cause**: Missing `RESEND_API_KEY` environment variable

**Solution**: Add the API key to your `.env.local` file

#### "Customer has no email address"

**Cause**: Selected invoice/estimate has no customer email

**Solution**: Items without emails are automatically skipped

#### "Rate limit exceeded"

**Cause**: Sent too many emails too quickly

**Solution**: 
- Increase `batchDelay` value
- Decrease `batchSize` value
- Wait a few minutes and retry

#### "Failed to send after retries"

**Cause**: Network error, invalid email, or API error

**Solution**: 
- Check email address is valid
- Check Resend API status
- Review email logs in database

## Database Logging

All email attempts are logged to the `email_logs` table:

```sql
SELECT 
  to,
  subject,
  status,
  error_message,
  sent_at,
  retry_count
FROM email_logs
WHERE created_at > NOW() - INTERVAL '1 day'
ORDER BY created_at DESC;
```

### Retry Queue

Failed emails with `status = 'failed'` can be retried:

```typescript
// Get failed emails that need retry
const { data: failedEmails } = await supabase
  .from("email_logs")
  .select("*")
  .eq("status", "failed")
  .lt("retry_count", "max_retries")
  .lt("next_retry_at", new Date().toISOString());

// Retry failed emails
// ... implement retry logic
```

## Performance

### Estimated Times

With default settings (10 emails/batch, 1-second delay):

| Emails | Estimated Time |
|--------|---------------|
| 10     | ~6 seconds    |
| 25     | ~15 seconds   |
| 50     | ~30 seconds   |
| 100    | ~1 minute     |
| 500    | ~5 minutes    |

### Optimization Tips

1. **Batch at Off-Peak Times**: Send large batches during low-traffic periods
2. **Monitor Logs**: Check email_logs table for patterns of failures
3. **Upgrade Plan**: Consider upgrading Resend plan for higher limits
4. **Use Templates**: Pre-render email templates for faster sending

## Testing

### Development Mode

In development (`NODE_ENV=development`), emails are logged instead of sent:

```
📧 [DEV MODE] Email would be sent:
  To: customer@example.com
  Subject: Invoice INV-001
  Template: invoice
```

### Test Email Configuration

```typescript
import { testEmailConfiguration } from "@/lib/email/email-sender";

const result = await testEmailConfiguration("your-email@example.com");
console.log(result.success ? "✅ Configured" : `❌ ${result.error}`);
```

### Manual Testing

1. Create test invoices/estimates with your email
2. Select a small batch (2-3 items)
3. Click "Send" and confirm
4. Check your inbox for emails
5. Verify all emails received

## Monitoring

### Success Rate

Track success rate in your database:

```sql
SELECT 
  COUNT(*) FILTER (WHERE status = 'sent') * 100.0 / COUNT(*) as success_rate,
  COUNT(*) FILTER (WHERE status = 'sent') as successful,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  COUNT(*) as total
FROM email_logs
WHERE created_at > NOW() - INTERVAL '7 days';
```

### Resend Dashboard

Monitor your usage in the Resend dashboard:

- View sent emails
- Check bounce rates
- Monitor API usage
- Review error logs

## Best Practices

### ✅ Do

- Test with small batches first
- Monitor the email_logs table
- Use appropriate delays for your plan
- Validate customer emails before sending
- Provide clear feedback to users
- Handle errors gracefully

### ❌ Don't

- Send to all customers at once without testing
- Use aggressive batch sizes on free tier
- Ignore failed email logs
- Skip user confirmation dialogs
- Send without validating email addresses
- Retry immediately after failures

## Troubleshooting

### Issue: Emails Not Sending

1. Check `RESEND_API_KEY` is set
2. Verify API key is valid in Resend dashboard
3. Check email_logs table for errors
4. Confirm customer emails are valid
5. Test with `testEmailConfiguration()`

### Issue: Slow Sending

1. Check batch configuration
2. Verify network connection
3. Monitor Resend API status
4. Review server logs for bottlenecks

### Issue: High Failure Rate

1. Review email_logs error messages
2. Check email template rendering
3. Verify FROM email is verified in Resend
4. Check for invalid customer emails
5. Monitor Resend API status

## Support

For issues with:

- **Bulk Sending Logic**: Check this documentation
- **Resend API**: Contact Resend support
- **Email Templates**: See `/emails/templates` directory
- **Database Issues**: Check Supabase logs

## Updates

Last Updated: 2025-11-12

Version: 1.0.0

