# Credit Card Visual Components

## Overview

Beautiful, realistic credit card displays for payment methods with brand-specific styling, ACH/bank account visualization, and interactive features.

## Components

### CreditCardVisual

**File**: `src/components/ui/credit-card-visual.tsx`

A visual representation of credit cards and bank accounts with:
- Brand-specific colors and gradients (Visa, Mastercard, Amex, Discover)
- Realistic card elements (EMV chip, contactless icon, brand logos)
- Masked card numbers with proper spacing
- Cardholder name and expiration date
- Default and verified badges
- ACH/Bank account visualization

### PaymentMethodCard

**File**: `src/components/customers/payment-method-card.tsx`

A wrapper component that displays payment methods with:
- Visual credit card or bank account display
- Hover-activated action buttons
- Set default and remove functionality
- Smooth transitions and animations

## Credit Card Types

### Visa
- **Colors**: Blue gradient (from-blue-600 via-blue-700 to-indigo-900)
- **Logo**: "VISA" text
- **Chip**: Gold gradient
- **Text**: White

### Mastercard
- **Colors**: Dark gradient (from-slate-800 via-slate-900 to-black)
- **Logo**: Red and amber circles
- **Chip**: Gold gradient
- **Text**: White

### American Express (Amex)
- **Colors**: Teal/Blue gradient (from-teal-600 via-blue-700 to-indigo-800)
- **Logo**: "AMERICAN EXPRESS" badge
- **Chip**: Gold gradient
- **Text**: White

### Discover
- **Colors**: Orange gradient (from-orange-500 via-orange-600 to-orange-700)
- **Logo**: "DISCOVER" badge
- **Chip**: Gold gradient
- **Text**: White

### Default (Unknown brands)
- **Colors**: Slate gradient (from-slate-700 via-slate-800 to-slate-900)
- **Chip**: Gold gradient
- **Text**: White

## ACH/Bank Account Visual

**Type**: `type="ach"` or `type="bank"`

Features:
- Building icon with primary color
- Account type (Checking/Savings)
- Bank name
- Masked account number
- Verified badge
- Nickname display
- Border-based design (not card-like)

## Usage

### Basic Credit Card

```typescript
import { CreditCardVisual } from "@/components/ui/credit-card-visual";

<CreditCardVisual
  type="card"
  brand="visa"
  last4="4242"
  expMonth={12}
  expYear={2025}
  cardholderName="JOHN DOE"
  isDefault={true}
  isVerified={true}
/>
```

### Bank Account

```typescript
<CreditCardVisual
  type="ach"
  last4="6789"
  bankName="Chase Bank"
  accountType="checking"
  isDefault={true}
  isVerified={true}
/>
```

### With PaymentMethodCard (Interactive)

```typescript
import { PaymentMethodCard } from "@/components/customers/payment-method-card";

<PaymentMethodCard
  id="pm_123"
  type="card"
  card_brand="mastercard"
  card_last4="8888"
  card_exp_month={6}
  card_exp_year={2026}
  cardholder_name="JANE SMITH"
  is_default={false}
  is_verified={true}
  nickname="Business Card"
  onSetDefault={() => console.log("Set default")}
  onRemove={() => console.log("Remove")}
/>
```

## Props

### CreditCardVisual Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"card" \| "ach" \| "bank"` | `"card"` | Payment method type |
| `brand` | `string` | `"default"` | Card brand (visa, mastercard, amex, discover) |
| `last4` | `string` | **Required** | Last 4 digits |
| `expMonth` | `number` | - | Expiration month (1-12) |
| `expYear` | `number` | - | Expiration year |
| `cardholderName` | `string` | `"CARD HOLDER"` | Cardholder name |
| `isDefault` | `boolean` | `false` | Show default badge |
| `isVerified` | `boolean` | `false` | Show verified badge |
| `nickname` | `string` | - | Optional nickname |
| `bankName` | `string` | `"Bank Account"` | Bank name (for ACH) |
| `accountType` | `"checking" \| "savings"` | `"checking"` | Account type (for ACH) |
| `className` | `string` | - | Additional CSS classes |

### PaymentMethodCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **Required** | Payment method ID |
| `type` | `"card" \| "ach" \| "bank"` | `"card"` | Payment method type |
| `card_brand` | `string` | - | Card brand |
| `card_last4` | `string` | **Required** | Last 4 digits |
| `card_exp_month` | `number` | - | Expiration month |
| `card_exp_year` | `number` | - | Expiration year |
| `cardholder_name` | `string` | - | Cardholder name |
| `bank_name` | `string` | - | Bank name |
| `account_type` | `"checking" \| "savings"` | - | Account type |
| `is_default` | `boolean` | `false` | Is default payment method |
| `nickname` | `string` | - | Optional nickname |
| `is_verified` | `boolean` | `false` | Is verified |
| `onSetDefault` | `() => void` | - | Set as default callback |
| `onRemove` | `() => void` | - | Remove callback |
| `disabled` | `boolean` | `false` | Disable actions |

## Features

### Visual Elements

#### EMV Chip
- 3x3 grid of rounded rectangles
- Gold gradient background
- Realistic metallic appearance
- Shadow for depth

#### Contactless Icon
- Rotated WiFi icon
- Semi-transparent
- Positioned near chip

#### Card Number
- Monospace font for authenticity
- Masked with bullet points (••••)
- Last 4 digits prominent
- Proper spacing between groups

#### Brand Logos
- **Visa**: Large italic text
- **Mastercard**: Overlapping circles
- **Amex**: Badge with full name
- **Discover**: Badge with brand name

#### Background
- Gradient specific to each brand
- Radial gradient overlays for depth
- Subtle lighting effects
- Professional finish

### Interactive Features

#### Hover Effects
- Shadow intensifies
- Subtle scale animation (via parent)
- Action buttons fade in
- Smooth transitions

#### Action Buttons
- Hidden by default
- Show on hover
- Set as default (if not default)
- Remove payment method
- Confirmation on remove

#### Badges
- **Default**: Primary color with check icon
- **Verified**: BadgeCheck icon
- Positioned appropriately per card type

## Layout & Grid

### Customer Page Layout

```typescript
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {paymentMethods.map(method => (
    <PaymentMethodCard key={method.id} {...method} />
  ))}
</div>
```

**Breakpoints**:
- Mobile: 1 column (full width)
- Small (sm: 640px+): 2 columns
- Large (lg: 1024px+): 3 columns

### Card Aspect Ratio

All cards maintain a **1.586:1** aspect ratio (standard credit card dimensions):
- Width: 100% of container
- Height: Auto-calculated to maintain ratio
- Responsive on all screens

## Styling

### Card Dimensions
- **Aspect Ratio**: 1.586:1 (like real credit cards)
- **Border Radius**: `rounded-xl` (0.75rem)
- **Padding**: `p-6` (1.5rem)
- **Shadow**: `shadow-lg` with `hover:shadow-xl`

### Typography
- **Card Number**: `text-xl tracking-wider font-mono`
- **Cardholder**: `text-sm uppercase tracking-wide`
- **Expiration**: `text-sm tracking-wide font-mono`
- **Labels**: `text-[10px] uppercase tracking-wide opacity-70`

### Colors
- Each brand has custom gradients
- Text is white for contrast
- Chip is gold gradient
- Badges use theme colors

## Accessibility

### WCAG Compliance
- ✅ Proper color contrast ratios
- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ Screen reader friendly

### Features
- **Title attributes**: Hover tooltips for verified badges
- **Aria labels**: (can be added for better screen reader support)
- **Keyboard focus**: Visible focus indicators on buttons
- **Touch targets**: Minimum 44x44px for mobile

## Examples

### Example 1: Visa Card with All Features

```typescript
<PaymentMethodCard
  id="pm_visa_001"
  type="card"
  card_brand="visa"
  card_last4="4242"
  card_exp_month={12}
  card_exp_year={2025}
  cardholder_name="JOHN DOE"
  is_default={true}
  is_verified={true}
  nickname="Personal"
  onSetDefault={() => {}}
  onRemove={() => {}}
/>
```

### Example 2: Mastercard (Not Default)

```typescript
<PaymentMethodCard
  id="pm_mc_002"
  type="card"
  card_brand="mastercard"
  card_last4="8888"
  card_exp_month={6}
  card_exp_year={2026}
  cardholder_name="JANE SMITH"
  is_default={false}
  is_verified={true}
  onSetDefault={() => console.log("Set as default")}
  onRemove={() => console.log("Remove card")}
/>
```

### Example 3: American Express

```typescript
<PaymentMethodCard
  id="pm_amex_003"
  type="card"
  card_brand="amex"
  card_last4="1005"
  card_exp_month={3}
  card_exp_year={2027}
  cardholder_name="ROBERT JOHNSON"
  is_default={false}
  is_verified={false}
  nickname="Business Expenses"
  onSetDefault={() => {}}
  onRemove={() => {}}
/>
```

### Example 4: Checking Account (ACH)

```typescript
<PaymentMethodCard
  id="pm_ach_004"
  type="ach"
  card_last4="6789"
  bank_name="Chase Bank"
  account_type="checking"
  is_default={false}
  is_verified={true}
  nickname="Main Account"
  onSetDefault={() => {}}
  onRemove={() => {}}
/>
```

### Example 5: Savings Account

```typescript
<PaymentMethodCard
  id="pm_bank_005"
  type="bank"
  card_last4="1234"
  bank_name="Bank of America"
  account_type="savings"
  is_default={false}
  is_verified={true}
  onSetDefault={() => {}}
  onRemove={() => {}}
/>
```

## Implementation on Customer Page

**File**: `src/components/customers/customer-page-content.tsx`

```typescript
{
  id: "payment-methods",
  title: "Payment Methods",
  icon: <CreditCard className="size-4" />,
  count: paymentMethods.length,
  actions: (
    <Button size="sm" variant="outline">
      <Plus className="mr-2 h-4 w-4" /> Add Payment Method
    </Button>
  ),
  content: (
    <UnifiedAccordionContent>
      {paymentMethods.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.map((method: any) => {
            const type = method.type === "ach" || method.type === "bank" 
              ? method.type 
              : "card";
            
            return (
              <PaymentMethodCard
                key={method.id}
                id={method.id}
                type={type}
                card_brand={method.brand}
                card_last4={method.last4}
                card_exp_month={method.exp_month}
                card_exp_year={method.exp_year}
                cardholder_name={method.name}
                bank_name={method.bank_name}
                account_type={method.account_type}
                is_default={method.is_default}
                is_verified={method.is_verified}
                nickname={method.nickname}
                onSetDefault={() => handleSetDefault(method.id)}
                onRemove={() => handleRemove(method.id)}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState />
      )}
    </UnifiedAccordionContent>
  ),
}
```

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

### Optimizations
- **CSS transforms** for smooth hover effects
- **No JavaScript animations** - pure CSS
- **Minimal DOM nodes** - efficient rendering
- **No heavy images** - CSS gradients and SVG icons

### Rendering
- Server-side rendered (RSC compatible)
- No hydration issues
- Fast initial paint
- Smooth transitions

## Future Enhancements

Potential additions:
- [ ] Flip animation to show CVV on back
- [ ] NFC/tap-to-pay animation
- [ ] More card brands (JCB, Diners, UnionPay)
- [ ] Customizable gradient themes
- [ ] Animation on mount (slide in, fade in)
- [ ] Loading skeleton state
- [ ] Card expiration warning badge

## Related Documentation

- **Payment Method Card**: `src/components/customers/payment-method-card.tsx`
- **Customer Page**: `src/components/customers/customer-page-content.tsx`
- **Billing Info Block**: `src/components/customers/editor-blocks/billing-info-block.tsx`
- **Unified Accordion**: `docs/DATATABLE-IN-ACCORDIONS.md`
- **Mobile Optimization**: `docs/MOBILE-OPTIMIZATION.md`

## Summary

✅ **Beautiful visuals** - Brand-specific gradients and logos  
✅ **Realistic design** - EMV chip, contactless, proper spacing  
✅ **ACH support** - Bank account visualization  
✅ **Interactive** - Hover actions, smooth animations  
✅ **Responsive** - Works on all screen sizes  
✅ **Accessible** - WCAG compliant  
✅ **Performant** - CSS-based, no heavy assets  

**Result**: Professional, Apple Pay-style credit card displays that make payment methods look beautiful! 💳✨

