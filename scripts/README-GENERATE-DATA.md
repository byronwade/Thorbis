# Test Data Generation Scripts

Scripts for generating test data to demonstrate performance optimizations.

---

## 📋 Available Scripts

### 1. Generate Invoices & Payments

**File:** `scripts/generate-invoices-payments.ts`

**What it does:**
- Generates 1,000 invoices with random amounts ($500 - $10,000)
- Creates 5-10 payments per invoice (randomly)
- All payments properly linked to their invoices
- Invoice statuses: paid, partial, sent (random distribution)
- Payment methods: cash, check, credit card, ACH, etc.
- Realistic dates (within last 90 days)

**Usage:**

```bash
# Make sure you have environment variables set
# NEXT_PUBLIC_SUPABASE_URL
# SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)

tsx scripts/generate-invoices-payments.ts
```

**Output:**
```
🚀 Starting invoice and payment generation...

📋 Fetching company and customer data...
✅ Using company: 123e4567-e89b-12d3-a456-426614174000
✅ Found 50 customers

📝 Generating 1000 invoices...
   Generated 100/1000 invoices...
   Generated 200/1000 invoices...
   ...
✅ Generated 1000 invoices
✅ Generated 7542 payments

💾 Inserting invoices into database...
   Inserted 100/1000 invoices...
   ...
✅ All invoices inserted

💾 Inserting payments into database...
   Inserted 100/7542 payments...
   ...
✅ All payments inserted

📊 Generation Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Invoices created:        1,000
✅ Payments created:        7,542
✅ Avg payments/invoice:    7.5
💰 Total invoice amount:    $5,234,567
💰 Total payments made:     $4,123,456
💰 Total amount paid:       $4,123,456

📈 Invoice Status Breakdown:
   Paid:        623 (62.3%)
   Partial:     254 (25.4%)
   Sent:        123 (12.3%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Generation complete!

💡 Test your tables at:
   - /dashboard/invoices
   - /dashboard/payments
   - Check virtualization with 1,000+ rows!
```

---

## 🎯 Why Generate Test Data?

### 1. Performance Testing

Test virtualization features with realistic datasets:
- **1,000 invoices** - Tests auto-virtualization trigger
- **7,000+ payments** - Tests smooth scrolling with large datasets
- Verify 60fps scrolling performance

### 2. UI/UX Testing

Ensure UI handles large datasets gracefully:
- Search/filter performance
- Bulk actions on many items
- Pagination vs virtualization
- Loading states

### 3. Database Performance

Test database queries with realistic data volumes:
- Query performance with indexes
- Join performance (invoices + payments)
- RLS policy performance
- Full-text search

---

## 🔧 Configuration

Edit the constants in `generate-invoices-payments.ts`:

```typescript
// Number of invoices to generate
const TOTAL_INVOICES = 1000;

// Payments per invoice
const MIN_PAYMENTS_PER_INVOICE = 5;
const MAX_PAYMENTS_PER_INVOICE = 10;

// Invoice amounts (in cents)
const MIN_INVOICE_AMOUNT = 50000;  // $500
const MAX_INVOICE_AMOUNT = 1000000; // $10,000
```

---

## 🧪 Testing Checklist

After running the script:

### 1. Test Invoices Table

✅ Visit `/dashboard/invoices`
- Verify table loads quickly (<100ms)
- Check pagination indicator shows "1,000 rows (virtualized)"
- Scroll rapidly - should be smooth 60fps
- Search for specific invoice - instant results
- Select multiple rows - bulk actions work

### 2. Test Payments Table

✅ Visit `/dashboard/payments`
- Verify 7,000+ payments load instantly
- Virtual scrolling active
- Filter by invoice - shows related payments
- Test bulk actions on selected payments

### 3. Test Performance

✅ Open Chrome DevTools → Performance
- Record while scrolling
- Check FPS (should be 60)
- Check memory usage (should be low ~5-10MB)
- No long tasks >50ms

### 4. Test Search/Filter

✅ Search functionality
- Search invoices by number - instant
- Filter by status - fast
- Filter by customer - works
- Filter by date range - efficient

---

## 🔒 Safety Features

### Batch Insertion
- Inserts data in batches of 100
- Prevents payload size errors
- Shows progress during insertion

### Error Handling
- Validates Supabase credentials
- Checks for company and customers
- Rolls back on errors
- Clear error messages

### Data Validation
- Invoice numbers unique
- Payment numbers unique
- Amounts always positive
- Payments sum correctly to invoices
- Foreign keys valid

---

## 🧹 Cleanup

### Delete Generated Data

If you want to remove the test data:

```sql
-- Delete test payments (generated today)
DELETE FROM payments 
WHERE created_at >= CURRENT_DATE;

-- Delete test invoices (generated today)
DELETE FROM invoices 
WHERE created_at >= CURRENT_DATE;

-- Or delete by invoice number pattern
DELETE FROM payments 
WHERE invoice_id IN (
  SELECT id FROM invoices 
  WHERE invoice_number LIKE 'INV-2024%'
);

DELETE FROM invoices 
WHERE invoice_number LIKE 'INV-2024%';
```

**WARNING:** Always backup your database before running delete operations!

---

## 📊 Expected Results

### Database Tables

**Before Script:**
```
invoices:  10 rows
payments:  25 rows
```

**After Script:**
```
invoices:  1,010 rows
payments:  7,567 rows
```

### UI Performance

**Invoices Table:**
- Initial load: <100ms
- Scrolling: 60fps smooth
- Search: Instant results
- Memory: ~5MB

**Payments Table:**
- Initial load: <100ms
- Scrolling: 60fps smooth
- Filter by invoice: Fast
- Memory: ~10MB

---

## 💡 Pro Tips

### Tip 1: Adjust Dataset Size

For smaller/larger tests:

```typescript
// Small test (quick)
const TOTAL_INVOICES = 100;

// Medium test (realistic)
const TOTAL_INVOICES = 1000;

// Large test (stress test)
const TOTAL_INVOICES = 5000;
```

### Tip 2: Test Different Scenarios

Run multiple times with different configs:

```bash
# Test 1: Many small invoices
MIN_INVOICE_AMOUNT = 10000  # $100
MAX_INVOICE_AMOUNT = 50000  # $500

# Test 2: Few large invoices
MIN_INVOICE_AMOUNT = 1000000  # $10,000
MAX_INVOICE_AMOUNT = 5000000  # $50,000
```

### Tip 3: Monitor Performance

```bash
# Before running
npm run analyze:bundle

# After running
# Check /dashboard/invoices performance in Chrome DevTools
```

---

## 🚀 Next Steps

1. **Run the script** to generate test data
2. **Test the tables** in your dashboard
3. **Verify virtualization** is working
4. **Check performance** with DevTools
5. **Cleanup** test data when done

---

## 📚 Related Documentation

- **Virtualization Guide:** `docs/LARGE_DATASET_OPTIMIZATION.md`
- **Quick Reference:** `docs/DATATABLE_QUICK_REFERENCE.md`
- **Update Announcement:** `docs/VIRTUALIZATION_UPDATE.md`
- **Live Examples:** `/dashboard/examples/large-data-tables`

---

**Happy Testing! 🎉**

