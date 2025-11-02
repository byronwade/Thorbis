# Google Pay & Apple Pay Implementation Guide

Complete implementation for accepting Google Pay and Apple Pay through Stripe with the ability to save payment methods as defaults.

## 📋 Overview

This implementation provides:
- ✅ Apple Pay and Google Pay acceptance
- ✅ Save payment methods for future use
- ✅ Set default payment methods
- ✅ Separate defaults for one-time vs subscription payments
- ✅ Payment method management UI
- ✅ Server-side validation and security
- ✅ RLS policies for data protection

## 🏗️ Architecture

### Components

1. **Express Checkout Element** (`src/components/billing/express-checkout-element.tsx`)
   - One-click payment buttons (Apple Pay, Google Pay, Link, PayPal, etc.)
   - Automatic wallet detection
   - Saves payment methods after successful payment
   - Client Component (requires Stripe.js)

2. **Payment Methods List** (`src/components/billing/payment-methods-list.tsx`)
   - Displays saved payment methods
   - Set/unset default payment methods
   - Remove payment methods
   - Delete confirmation dialogs
   - Client Component (interactive)

3. **Payment Methods Page** (`src/app/(dashboard)/dashboard/settings/billing/payment-methods/page.tsx`)
   - Settings page for managing payment methods
   - Server Component (optimal performance)
   - Uses Suspense for streaming UI

### Server Actions

Located in `src/actions/payment-methods.ts`:

- `savePaymentMethod()` - Save a new payment method
- `setDefaultPaymentMethod()` - Set default payment method
- `removePaymentMethod()` - Remove a payment method
- `getPaymentMethods()` - Fetch all payment methods

### API Routes

1. **Create Payment Intent** (`/api/payments/create-intent`)
   - Creates Stripe PaymentIntent
   - Handles customer creation
   - Supports setup_future_usage for saving cards

2. **Save Payment Method** (`/api/payments/save-method`)
   - Saves payment method to database
   - Attaches to Stripe customer
   - Updates default payment method

### Database Schema

Migration: `supabase/migrations/20251101130000_add_payment_methods.sql`

**payment_methods table:**
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key to users)
- stripe_payment_method_id (TEXT, unique)
- type (TEXT: card, apple_pay, google_pay, etc.)
- brand (TEXT: visa, mastercard, etc.)
- last4 (TEXT)
- exp_month (INTEGER)
- exp_year (INTEGER)
- wallet_type (TEXT: apple_pay, google_pay, etc.)
- display_name (TEXT)
- is_default (BOOLEAN)
- is_default_for_subscription (BOOLEAN)
- billing_details (JSONB)
- allow_redisplay (TEXT: always, limited, unspecified)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

**Key Features:**
- Unique constraint ensures only one default per user
- Triggers automatically unset other defaults when setting new default
- RLS policies restrict access to user's own payment methods
- Indexes for optimal query performance

## 🚀 Setup Instructions

### 1. Run Database Migration

```bash
# Apply the payment methods migration
pnpm supabase db push

# Or if using migrations directly
psql $DATABASE_URL < supabase/migrations/20251101130000_add_payment_methods.sql
```

### 2. Configure Stripe

#### Enable Payment Methods
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/settings/payment_methods)
2. Enable the following payment methods:
   - Cards (required for Apple Pay/Google Pay)
   - Link (optional)
   - PayPal (optional)
   - Amazon Pay (optional)
   - Klarna (optional)

#### Apple Pay Setup
1. Register your domain:
   - Go to [Payment Method Domain Registration](https://dashboard.stripe.com/settings/payment_methods/apple_pay)
   - Add your domain (both development and production)
   - Download verification file
   - Place at `public/.well-known/apple-developer-merchantid-domain-association`

2. For mobile apps:
   - Create Apple Merchant ID
   - Generate Apple Pay certificate
   - Upload to Stripe Dashboard
   - See [Apple Pay Setup Guide](https://docs.stripe.com/apple-pay)

#### Google Pay Setup
No additional setup required - Google Pay works automatically when you:
- Enable cards in your payment methods settings
- Use HTTPS in development and production
- Use supported browsers

### 3. Environment Variables

Add to `.env.local`:

```bash
# Stripe Keys (already configured)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# No additional variables needed
```

### 4. Install Dependencies

All required dependencies are already installed:
- `@stripe/stripe-js` - Stripe.js loader
- `@stripe/react-stripe-js` - React components
- `stripe` - Server-side SDK

## 💻 Usage Examples

### Basic Express Checkout

```tsx
import { ExpressCheckoutElement } from "@/components/billing/express-checkout-element";

export function CheckoutPage() {
  return (
    <ExpressCheckoutElement
      amount={1000} // $10.00
      currency="usd"
      setupFutureUsage="off_session" // Save for future use
      onPaymentComplete={(paymentMethodId) => {
        console.log("Payment complete:", paymentMethodId);
      }}
      onPaymentError={(error) => {
        console.error("Payment error:", error);
      }}
    />
  );
}
```

### With Shipping Collection

```tsx
<ExpressCheckoutElement
  amount={5000} // $50.00
  currency="usd"
  collectShipping={true}
  shippingOptions={[
    {
      id: "standard",
      label: "Standard Shipping",
      detail: "5-7 business days",
      amount: 500, // $5.00
    },
    {
      id: "express",
      label: "Express Shipping",
      detail: "2-3 business days",
      amount: 1500, // $15.00
    },
  ]}
  setupFutureUsage="on_session"
/>
```

### Payment Methods Management

```tsx
import { PaymentMethodsList } from "@/components/billing/payment-methods-list";
import { getPaymentMethods } from "@/actions/payment-methods";

export default async function BillingPage() {
  const { paymentMethods } = await getPaymentMethods();

  return (
    <PaymentMethodsList
      paymentMethods={paymentMethods}
      onSetDefault={async (id) => {
        // Server action handles the update
      }}
      onRemove={async (id) => {
        // Server action handles the deletion
      }}
    />
  );
}
```

### Server Action Usage

```tsx
"use server";

import { savePaymentMethod, setDefaultPaymentMethod } from "@/actions/payment-methods";

// Save a payment method
export async function handleSavePayment(formData: FormData) {
  const result = await savePaymentMethod(formData);
  if (result.success) {
    console.log("Payment method saved!");
  }
}

// Set as default
export async function handleSetDefault(paymentMethodId: string) {
  const formData = new FormData();
  formData.append("paymentMethodId", paymentMethodId);
  formData.append("forSubscription", "false");

  const result = await setDefaultPaymentMethod(formData);
  if (result.success) {
    console.log("Default payment method updated!");
  }
}
```

## 🧪 Testing

### Test Cards

Use Stripe test cards to test different scenarios:

| Card Number | Scenario |
|------------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0025 0000 3155` | Requires authentication |
| `4000 0000 0000 9995` | Declined |

### Testing Apple Pay

1. Use Safari on macOS or iOS
2. Have a card added to Wallet
3. Use test mode in Stripe Dashboard
4. Domain must be registered and verified

### Testing Google Pay

1. Use Chrome, Edge, or supported browser
2. Have a card added to Google Pay
3. Use HTTPS (required)
4. Test mode works automatically

### Test Flow

1. **Add Payment Method:**
   ```bash
   # Navigate to payment methods page
   /dashboard/settings/billing/payment-methods

   # Click "Add Payment Method"
   # Select Apple Pay or Google Pay
   # Complete the payment
   ```

2. **Verify Saved:**
   - Check payment method appears in list
   - Verify correct details (last4, brand, etc.)
   - Check default badge if applicable

3. **Set as Default:**
   - Click "Set as default" button
   - Verify badge updates
   - Check only one default exists

4. **Remove Payment Method:**
   - Click remove button
   - Confirm deletion
   - Verify removed from list

## 🔒 Security Considerations

### RLS Policies

All payment methods are protected by Row Level Security:
- Users can only view their own payment methods
- Users can only modify their own payment methods
- Users can only delete their own payment methods

### Stripe Security

- All Stripe API calls are server-side only
- Payment method IDs are stored, not card numbers
- Billing details encrypted by Stripe
- PCI compliance handled by Stripe

### Best Practices

1. **Never expose Stripe secret key** - Use environment variables
2. **Validate all inputs** - Use Zod schemas server-side
3. **Use RLS policies** - Enforce data access control
4. **Limit stored data** - Only store necessary information
5. **Audit logs** - Track payment method changes

## 📊 Database Queries

### Get User's Payment Methods
```sql
SELECT * FROM payment_methods
WHERE user_id = auth.uid()
ORDER BY is_default DESC, created_at DESC;
```

### Get Default Payment Method
```sql
SELECT * FROM payment_methods
WHERE user_id = auth.uid()
  AND is_default = TRUE
LIMIT 1;
```

### Get Default Subscription Payment Method
```sql
SELECT * FROM payment_methods
WHERE user_id = auth.uid()
  AND is_default_for_subscription = TRUE
LIMIT 1;
```

## 🔄 Webhook Integration

To handle Stripe webhooks for payment method updates:

```typescript
// src/app/api/webhooks/stripe/route.ts
import { stripe } from "@/lib/stripe/server";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  const event = stripe.webhooks.constructEvent(
    body,
    sig!,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case "payment_method.attached":
      // Handle payment method attached to customer
      break;

    case "payment_method.detached":
      // Handle payment method removed from customer
      break;

    case "customer.updated":
      // Handle default payment method change
      break;
  }

  return new Response(null, { status: 200 });
}
```

## 🎨 Customization

### Styling Express Checkout Element

```tsx
<ExpressCheckoutElement
  amount={1000}
  currency="usd"
  // Customize appearance
  appearance={{
    theme: "stripe",
    variables: {
      colorPrimary: "#0066ff",
      borderRadius: "8px",
    },
  }}
  // Customize button theme
  buttonTheme={{
    applePay: "black", // or "white", "white-outline"
    googlePay: "black", // or "white"
  }}
  // Customize button height
  buttonHeight={48}
/>
```

### Custom Payment Method Display

```tsx
// Custom formatting for payment method names
function formatPaymentMethod(method: PaymentMethod): string {
  if (method.walletType === "apple_pay") {
    return `🍎 Apple Pay (${method.brand} •••• ${method.last4})`;
  }
  if (method.walletType === "google_pay") {
    return `G Google Pay (${method.brand} •••• ${method.last4})`;
  }
  return `${method.brand?.toUpperCase()} •••• ${method.last4}`;
}
```

## 📱 Mobile Support

The implementation works seamlessly on mobile:

- **iOS:** Apple Pay in Safari
- **Android:** Google Pay in Chrome/supported browsers
- **Responsive:** All components are mobile-friendly
- **Touch-optimized:** Buttons sized for mobile interaction

## 🚨 Troubleshooting

### Apple Pay Not Showing

**Check:**
1. Using Safari or supported browser
2. Domain registered in Stripe Dashboard
3. HTTPS enabled (required)
4. Card added to Apple Wallet
5. Verification file accessible

### Google Pay Not Showing

**Check:**
1. Using Chrome or supported browser
2. HTTPS enabled (required)
3. Card added to Google Pay
4. Correct country/currency combination

### Payment Method Not Saving

**Check:**
1. `setupFutureUsage` parameter set
2. User authenticated
3. Stripe customer created
4. Database migration applied
5. RLS policies enabled

### Default Not Updating

**Check:**
1. Database trigger exists
2. User has permission
3. Payment method belongs to user
4. No database constraints violated

## 📚 Additional Resources

- [Stripe Express Checkout Element Docs](https://docs.stripe.com/elements/express-checkout-element)
- [Apple Pay Integration Guide](https://docs.stripe.com/apple-pay)
- [Google Pay Integration Guide](https://docs.stripe.com/google-pay)
- [Saving Payment Methods](https://docs.stripe.com/payments/save-during-payment)
- [Payment Method Types](https://docs.stripe.com/api/payment_methods/object#payment_method_object-type)

## ✅ Checklist

Before going live:

- [ ] Database migration applied
- [ ] RLS policies enabled
- [ ] Stripe payment methods enabled
- [ ] Apple Pay domain registered
- [ ] HTTPS configured
- [ ] Environment variables set
- [ ] Webhooks configured
- [ ] Test payments completed
- [ ] Error handling tested
- [ ] Security audit performed

## 🆘 Support

For issues or questions:
1. Check Stripe Dashboard for errors
2. Review browser console for warnings
3. Check Supabase logs for database errors
4. Verify environment variables
5. Test with Stripe test mode first

## 📝 License

This implementation follows the project's existing license.
