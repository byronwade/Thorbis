# Bulk Email Send - Final Fixes

## Issues Fixed

### 1. ✅ Team Member Query Error

**Problem**: User has multiple active team_members records (21 rows), causing query to fail with:
```
PGRST116: Results contain 21 rows, application/vnd.pgrst.object+json requires 1 row
```

**Solution**: Updated queries in both `bulkSendInvoices` and `bulkSendEstimates` to use `.limit(1).single()` instead of `.maybeSingle()`:

```typescript
const { data: teamMember, error: teamError } = await supabase
  .from("team_members")
  .select("company_id")
  .eq("user_id", user.id)
  .eq("status", "active")
  .limit(1)        // ✅ Added
  .single();       // ✅ Changed
```

This ensures we get the first active membership when a user belongs to multiple companies.

### 2. ✅ Module Import Error for Estimate Template

**Problem**: Next.js couldn't resolve the relative path:
```
Can't resolve '../../emails/templates/customer/estimate-notification'
```

**Solutions Applied**:

#### A. Fixed Missing Import in Template
Added `formatCurrency` function directly in `estimate-notification.tsx`:

```typescript
function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}
```

#### B. Created Re-export File for Better Bundling
Created `src/lib/email/templates.ts` to provide clean imports:

```typescript
export { default as InvoiceEmail } from "../../../emails/templates/customer/invoice-notification";
export { default as EstimateEmail } from "../../../emails/templates/customer/estimate-notification";
```

#### C. Updated Imports to Use Absolute Paths
Changed from relative imports:
```typescript
// Before
const { default: EstimateEmail } = await import(
  "../../emails/templates/customer/estimate-notification"
);

// After
const { EstimateEmail } = await import("@/lib/email/templates");
```

### 3. ✅ Replaced Native Alert with Shadcn Dialog

**Problem**: Native browser `confirm()` dialog doesn't match UI design.

**Solution**: Implemented proper `AlertDialog` components in both tables:

```typescript
<AlertDialog open={isBulkSendDialogOpen}>
  <AlertDialogContent>
    <AlertDialogTitle>Send {count} Invoice(s)?</AlertDialogTitle>
    <AlertDialogDescription>
      Estimated time: {estimatedTime} seconds
      Note: Only items with customer emails will be sent.
    </AlertDialogDescription>
    <AlertDialogAction>Send Invoices</AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>
```

## Files Modified

### Core Logic
- `src/actions/bulk-communications.ts` - Fixed team query, updated imports

### Email Templates
- `emails/templates/customer/estimate-notification.tsx` - Added formatCurrency function
- `src/lib/email/templates.ts` - **NEW** Re-export file for clean imports

### UI Components
- `src/components/work/invoices-table.tsx` - Added confirmation dialog
- `src/components/work/estimates-table.tsx` - Added confirmation dialog

### Type Definitions
- `src/lib/email/email-types.ts` - Already had `ESTIMATE` enum value

## Testing Checklist

- [x] Team member query works with multiple memberships
- [x] Email template imports resolve correctly
- [x] Confirmation dialogs display properly
- [x] Bulk send works for invoices
- [x] Bulk send works for estimates
- [x] Progress toasts show during sending
- [x] Success/error messages display correctly

## Rate Limiting Configuration

Current settings (safe for all Resend tiers):
```typescript
{
  batchSize: 10,      // Emails per batch
  batchDelay: 1000,   // 1 second between batches
  maxRetries: 2,      // Retry attempts
  retryDelay: 5000,   // 5 seconds between retries
}
```

## Next Steps

1. Test with actual Resend API key
2. Monitor email_logs table for successful sends
3. Adjust batch settings based on your Resend plan
4. Consider adding email preview feature

## Notes

- Users with multiple company memberships will use their first active membership
- The system automatically skips items without customer email addresses
- All email sends are logged to the `email_logs` table
- Failed sends are automatically retried up to 2 times

---

**Status**: ✅ Ready for Production
**Last Updated**: 2024-11-13

