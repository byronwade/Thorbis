# Ready to Test - Organization Creation & Billing

**Date:** November 1, 2025
**Status:** Ready for testing in development

---

## ✅ What's Been Fixed

### 1. RLS Security Issues - FIXED ✅
**Problem:** Users couldn't create organizations due to RLS policy violations
**Solution:** Server action now uses Supabase service role client to bypass RLS
**Status:** Code deployed and ready to test

### 2. Pricing Transparency - COMPLETE ✅
**Enhancement:** Organization creation wizard now shows complete pricing breakdown
**What's New:**
- Base subscription: $100/month clearly displayed
- All 11 usage-based charges listed with prices
- Example monthly bill calculation
- Clear pay-as-you-go messaging

### 3. Stripe Integration - COMPLETE ✅
**Features:**
- Automatic checkout session creation
- Proper handling of first vs additional organizations
- Billing portal access
- Subscription management

---

## 🧪 How to Test

### Test 1: Create Your First Organization

1. **Navigate to Organization Creation**
   ```
   http://localhost:3000/dashboard/settings/organizations/new
   ```

2. **Fill Out the Form**
   - Organization Name: "Test HVAC Company"
   - Industry: "HVAC"
   - Review the pricing details (should show full breakdown)
   - Click "Create Organization"

3. **Expected Behavior**
   - ✅ Organization should be created successfully (no RLS errors)
   - ✅ You should be redirected to Stripe checkout
   - ✅ Stripe checkout should show $100/month base plan

4. **What to Watch For**
   - ❌ If you see "Failed to create organization" - check server logs
   - ❌ If you see "Failed to add user to organization" - RLS fix may not be applied
   - ❌ If checkout doesn't load - check Stripe API keys

### Test 2: Pricing Display

1. **Check the Wizard**
   - Navigate to organization creation page
   - Scroll down to "Pricing Details" card

2. **Verify Display Shows**
   - ✅ Base Subscription: $100/mo
   - ✅ Usage-Based Charges section with all 11 items:
     - Team Members: $5.00/user
     - Customer Invoices: $0.15/invoice
     - Price Quotes: $0.10/quote
     - SMS Messages: $0.02/text
     - Emails: $0.005/email
     - Video Call Minutes: $0.05/minute
     - Phone Call Minutes: $0.02/minute
     - File Storage: $0.50/GB
     - Payments Collected: $0.29/payment
     - Automated Workflows: $0.10/workflow
     - API Calls: $0.001/call
   - ✅ Example Monthly Bill showing $144/mo

### Test 3: Create Additional Organization (If You Have One)

1. **Prerequisites**
   - You must already have one organization created
   - The first organization should have an active subscription

2. **Create Second Organization**
   - Navigate to organization creation again
   - Fill out form for second organization
   - Should see warning about $100/month charge for additional org
   - Must check acknowledgment box
   - Create organization

3. **Expected Behavior**
   - ✅ Warning banner displays about additional organization pricing
   - ✅ Acknowledgment checkbox is required
   - ✅ Stripe checkout shows $200/month (base + additional org)

### Test 4: Stripe Checkout (Test Mode)

**Note:** You'll need a Stripe test card to complete this

1. **When Redirected to Stripe**
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any postal code

2. **Complete Payment**
   - Fill in test card details
   - Click "Subscribe"

3. **Expected Behavior**
   - ✅ Payment should succeed
   - ✅ Redirected back to `/dashboard/settings/billing`
   - ⚠️ Database may not update yet (webhook needs production URL)

---

## 🔍 What to Check in Server Logs

### Successful Organization Creation
```
Creating organization: Test HVAC Company
Organization created with ID: [uuid]
User added as team member with Owner role
Company settings created
```

### Successful Stripe Checkout
```
Creating checkout session for company: [uuid]
Stripe customer ID: cus_...
Checkout session created: cs_...
Redirecting to: https://checkout.stripe.com/...
```

### Errors to Watch For

**RLS Error (Should be fixed):**
```
❌ new row violates row-level security policy for table "companies"
```
If you see this, the service role client fix may not be applied.

**Stripe API Error:**
```
❌ Stripe API error: Invalid API Key provided
```
Check that `STRIPE_SECRET_KEY` is set correctly in `.env.local`

**Missing Environment Variable:**
```
❌ Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY
```
Ensure all environment variables are set.

---

## 🛠️ Troubleshooting

### Organization Creation Fails

**Error:** "Failed to create organization"

**Steps:**
1. Check terminal/server logs for detailed error
2. Verify `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
3. Restart dev server to reload environment variables
4. Try again with different organization name

**Still failing?**
- Check if you're logged in
- Verify user has valid session
- Check Supabase connection

### Stripe Checkout Doesn't Load

**Error:** Redirect fails or shows error page

**Steps:**
1. Verify `STRIPE_SECRET_KEY` in `.env.local`
2. Check `STRIPE_PRICE_ID_BASE_PLAN` exists and is correct
3. Look in Stripe dashboard → Payments → Checkout Sessions
4. Check server logs for Stripe API errors

**Common Issues:**
- Invalid API key (test vs live mode mismatch)
- Missing price ID
- Invalid price ID (product not active)

### Pricing Details Not Showing

**Issue:** Wizard doesn't show pricing breakdown

**Steps:**
1. Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+R)
2. Clear browser cache
3. Check if component file was saved correctly
4. Restart dev server

---

## 📋 Testing Checklist

### Organization Creation
- [ ] Can access organization creation page
- [ ] Form validates required fields
- [ ] Can enter organization name
- [ ] Can select industry
- [ ] Pricing details display correctly
- [ ] Can click "Create Organization" button
- [ ] Organization creates without errors
- [ ] No RLS policy violation errors
- [ ] Redirects to Stripe checkout

### Pricing Display
- [ ] "Pricing Details" card visible
- [ ] Base subscription shows $100/month
- [ ] All 11 usage items listed with correct prices
- [ ] Example bill shows $144/month calculation
- [ ] Pay-as-you-go explanation visible

### Stripe Integration
- [ ] Redirects to Stripe checkout page
- [ ] Checkout shows correct plan price
- [ ] Can enter test card details
- [ ] Payment processes successfully
- [ ] Redirects back to application

### Additional Organization (If Applicable)
- [ ] Warning banner shows for additional org
- [ ] Acknowledgment checkbox required
- [ ] Checkout shows $200/month ($100 base + $100 additional)

---

## 📊 Expected Results

### Database Changes After Organization Creation

**companies table:**
```sql
INSERT INTO companies (
  id,
  name,
  slug,
  owner_id,
  created_at
) VALUES (
  '[uuid]',
  'Test HVAC Company',
  'test-hvac-company',
  '[user_id]',
  NOW()
);
```

**team_members table:**
```sql
INSERT INTO team_members (
  company_id,
  user_id,
  role_id,
  status
) VALUES (
  '[company_id]',
  '[user_id]',
  '[owner_role_id]',
  'active'
);
```

**company_settings table:**
```sql
INSERT INTO company_settings (
  company_id,
  hours_of_operation
) VALUES (
  '[company_id]',
  '{"monday": {"open": "09:00", "close": "17:00"}, ...}'
);
```

### Stripe Records Created

**Customer:**
- New Stripe customer created if doesn't exist
- Customer ID saved to `users.stripe_customer_id`

**Checkout Session:**
- Session created with organization metadata
- Success URL points to billing page
- Cancel URL points to organization creation

---

## 🚫 Known Limitations (Development)

### Webhooks Not Working Yet
**Why:** Webhooks require publicly accessible HTTPS URL
**Impact:** Database won't update automatically after payment
**Solution:** Will be fixed in production deployment

### Manual Database Updates Needed
After completing Stripe checkout in development:
1. Find the subscription ID in Stripe dashboard
2. Manually update the companies table:
   ```sql
   UPDATE companies
   SET stripe_subscription_id = 'sub_...',
       stripe_subscription_status = 'active'
   WHERE id = '[company_id]';
   ```

### Test Card Only
Must use Stripe test cards in development:
- `4242 4242 4242 4242` - Succeeds
- `4000 0000 0000 0002` - Decline
- `4000 0000 0000 9995` - Insufficient funds

---

## ✅ Success Criteria

### Test Passed If:
1. ✅ Organization creates without RLS errors
2. ✅ User sees complete pricing breakdown
3. ✅ Redirects to Stripe checkout successfully
4. ✅ Can complete test payment in Stripe
5. ✅ Redirects back to application after payment

### Test Failed If:
1. ❌ RLS policy violation errors
2. ❌ Pricing details missing or incorrect
3. ❌ Stripe checkout fails to load
4. ❌ Payment processing errors
5. ❌ Redirect loop or error page

---

## 📞 Next Steps After Testing

### If Tests Pass ✅
1. Commit all changes to git
2. Deploy to production
3. Configure webhook endpoint
4. Test complete flow in production
5. Monitor for errors

### If Tests Fail ❌
1. Document the exact error message
2. Check server logs for details
3. Verify environment variables
4. Check database connection
5. Review recent code changes

---

## 🎯 Production Deployment Next

Once development testing is complete:

1. **Deploy to Production**
   - All code is ready
   - Environment variables documented
   - Database migrations applied

2. **Configure Webhook** (5 minutes)
   ```bash
   npx tsx scripts/setup-stripe-webhooks.ts
   ```

3. **Test in Production**
   - Create real organization
   - Complete real payment (can cancel immediately)
   - Verify webhook fires
   - Check database updates

---

**Ready to test!** 🚀

Try creating an organization and let me know if you encounter any issues.
