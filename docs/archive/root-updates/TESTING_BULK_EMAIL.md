# Testing Bulk Email Send Feature

## Setup Instructions

### 1. Configure Test Customer

Run this SQL in your Supabase SQL Editor:

```sql
-- Find/Create Byron Wade customer and link invoices
-- See: scripts/setup-test-customer.sql
```

Or use the Supabase dashboard to:

1. **Navigate to**: Supabase Dashboard → SQL Editor
2. **Run**: `scripts/setup-test-customer.sql`
3. **Verify**: Check that customer `bcw1995@gmail.com` exists with invoices

### 2. Manual Setup (Alternative)

If you prefer to do it manually:

**Create/Update Customer:**
1. Go to: Supabase Dashboard → Table Editor → `customers`
2. Find or create customer with:
   - First Name: `Byron`
   - Last Name: `Wade`
   - Email: `bcw1995@gmail.com`
   - Status: `active`
3. Copy the customer `id`

**Link Invoices:**
1. Go to: Supabase Dashboard → Table Editor → `invoices`
2. Filter: `status` = `draft` OR `pending`
3. Select 5-10 invoices
4. Update `customer_id` to the Byron Wade customer ID
5. Save changes

### 3. Test Bulk Email Send

1. **Navigate to**: `/dashboard/work/invoices`
2. **Filter**: Show only invoices for Byron Wade (search "Byron")
3. **Select**: Check 2-3 invoices
4. **Click**: "Send" button in bulk actions toolbar
5. **Confirm**: Review the dialog showing:
   - Number of invoices (e.g., "Send 3 Invoice(s)?")
   - Estimated time
   - Email notice
6. **Click**: "Send Invoices" button

### 4. Expected Behavior

**During Send:**
- ✅ Dialog closes
- ✅ Loading toast appears: "Sending 3 invoice(s)..."
- ✅ Takes ~3-5 seconds for 3 invoices

**After Send:**
- ✅ Success toast: "Successfully sent 3 invoices"
- ✅ Page reloads
- ✅ Invoice status updates to "sent"
- ✅ `sent_at` timestamp is set

**In Development Mode:**
Console logs should show:
```
📧 [DEV MODE] Email would be sent:
  To: bcw1995@gmail.com
  Subject: Invoice INV-202511-XXXX
  Template: invoice
```

**In Production Mode:**
- Email is sent via Resend
- Check email_logs table for records
- Check bcw1995@gmail.com inbox

### 5. Verify Results

**Check Email Logs:**
```sql
SELECT 
  to,
  subject,
  status,
  sent_at,
  error_message
FROM email_logs
WHERE to = 'bcw1995@gmail.com'
ORDER BY created_at DESC
LIMIT 10;
```

**Check Invoice Status:**
```sql
SELECT 
  invoice_number,
  status,
  sent_at,
  customer_id
FROM invoices
WHERE customer_id = (
  SELECT id FROM customers WHERE email = 'bcw1995@gmail.com'
)
ORDER BY sent_at DESC
LIMIT 10;
```

## Troubleshooting

### Issue: "No valid invoices to send"

**Cause**: Selected invoices don't have customer email
**Fix**: Verify customer has email set:
```sql
SELECT id, first_name, last_name, email 
FROM customers 
WHERE email = 'bcw1995@gmail.com';
```

### Issue: "You must be part of a company"

**Cause**: User not in active team_members
**Fix**: Already fixed - uses `.limit(1)` for multiple memberships

### Issue: Emails not arriving

**Development Mode:**
- Emails are logged, not sent
- Check console for "DEV MODE" messages

**Production Mode:**
- Check `RESEND_API_KEY` is set
- Check Resend dashboard for sends
- Check email_logs table for errors
- Verify email isn't in spam

### Issue: "Module not found" errors

**Cause**: Email template import issue
**Fix**: Already fixed - using `@/lib/email/templates` re-exports

## Test Checklist

- [ ] Customer Byron Wade exists with email bcw1995@gmail.com
- [ ] Customer is linked to 5-10 test invoices
- [ ] Invoices have status "draft" or "pending"
- [ ] Can navigate to /dashboard/work/invoices
- [ ] Can see and select invoices
- [ ] Bulk "Send" button appears when items selected
- [ ] Confirmation dialog shows correct count
- [ ] Dialog shows estimated time
- [ ] "Send Invoices" button works
- [ ] Loading toast appears
- [ ] Success/error toast appears after completion
- [ ] Invoice status updates (in production)
- [ ] sent_at timestamp is set (in production)
- [ ] Email appears in inbox (in production with Resend)

## Rate Limiting Test

To test rate limiting with larger batches:

1. Link 25 invoices to Byron Wade
2. Select all 25 invoices
3. Click "Send"
4. Observe:
   - Batch 1: Invoices 1-10 (0s delay)
   - 1 second delay
   - Batch 2: Invoices 11-20 (1s delay)
   - 1 second delay
   - Batch 3: Invoices 21-25 (2s delay)
   - Total time: ~15-20 seconds

## Production Testing

**Before testing in production:**

1. ✅ Ensure `RESEND_API_KEY` is set
2. ✅ Verify `RESEND_FROM_EMAIL` is set
3. ✅ Confirm email domain is verified in Resend
4. ✅ Check Resend plan limits (100/day for free tier)
5. ✅ Use your own email for initial tests
6. ✅ Start with 1-2 emails before bulk testing

## Additional Test Scenarios

### Test Estimates

1. Link estimates to Byron Wade customer
2. Go to `/dashboard/work/estimates`
3. Select and send estimates
4. Verify estimate template is used

### Test Mixed Status

1. Select mix of draft and pending invoices
2. Both should send successfully

### Test No Email Address

1. Create invoice with customer that has no email
2. Select it with other valid invoices
3. Verify it's skipped with warning message

### Test Multiple Customers

1. Link some invoices to different customers
2. Select invoices from multiple customers
3. Verify each gets their own email

## Success Criteria

✅ All selected invoices with customer emails are sent
✅ Clear feedback on success/failure/skipped
✅ No rate limit errors from Resend
✅ Emails arrive in inbox (production)
✅ Invoice status updates correctly
✅ Error handling works for failed sends

---

**Last Updated**: 2024-11-13
**Status**: Ready for Testing

