# Payrix Payment Processing Setup

Complete setup guide for integrating Payrix payment processing into Thorbis.

## Overview

Payrix is the payment processor used by ServiceTitan and other field service platforms. It's designed for:
- Large commercial invoices ($10K-$100K+)
- B2B transactions with Level 2/Level 3 processing
- ACH payments for large invoices (cheaper than cards)
- Recurring billing for maintenance plans

## Why Payrix vs Stripe

| Feature | Payrix | Stripe |
|---------|--------|--------|
| Large invoices | ✅ Optimized | ❌ High fees |
| Commercial cards | ✅ Level 2/3 data | ❌ Standard rates |
| ACH processing | ✅ Low cost | ❌ Higher fees |
| B2B focus | ✅ Yes | ❌ B2C focus |
| Recurring billing | ✅ Built-in | ✅ Built-in |
| Field service | ✅ Industry-specific | ❌ Generic |

## Environment Variables

Add these to your `.env.local` file:

```bash
# Payrix API Configuration
PAYRIX_API_URL=https://api.payrix.com
PAYRIX_API_KEY=your_api_key_here
PAYRIX_PARTNER_ID=your_partner_id_here

# For testing/sandbox
# PAYRIX_API_URL=https://api-test.payrix.com
```

### Getting API Credentials

1. **Sign up for Payrix Partner Account**
   - Visit: https://www.payrix.com/partners
   - Contact: partners@payrix.com
   - Request: Partner API access

2. **Get API Key**
   - Login to Payrix Partner Portal
   - Navigate to: Settings → API Keys
   - Generate new API key
   - Copy and save securely

3. **Get Partner ID**
   - Found in Partner Portal dashboard
   - Usually starts with `part_`

## Database Schema

The migration has already been applied:

```sql
-- Table: payrix_merchant_accounts
-- Migration: add_payrix_merchant_accounts
```

### Key Fields

- `payrix_entity_id` - Payrix entity identifier
- `payrix_merchant_id` - Merchant account ID
- `status` - Boarding status (pending, submitted, approved, etc.)
- `owner_ssn_encrypted` - Encrypted SSN (masked in DB)
- `mcc_code` - Merchant Category Code (industry)

## Merchant Boarding Flow

### Step 1: User Completes Onboarding

User fills out Step 5 (Payment Processing) with:
- Business details (years in business, volume estimates)
- Owner information (name, SSN, DOB, address)
- Payment methods (cards, ACH, recurring)
- Bank account for payouts

### Step 2: Submit to Payrix API

```typescript
import { submitPayrixMerchantBoarding } from "@/actions/payrix";

const result = await submitPayrixMerchantBoarding({
  companyId: "uuid",
  yearsInBusiness: 5,
  businessDescription: "HVAC installation and repair",
  averageTicketAmount: 500,
  highestTicketAmount: 15000,
  estimatedMonthlyVolume: 50000,
  // ... owner info
  // ... payment methods
  // ... bank account
});
```

### Step 3: Payrix Reviews Application

- **Automated approval**: 1-3 hours (low risk)
- **Manual review**: 1-3 business days (higher risk/volume)
- **Status updates**: Via webhook or polling

### Step 4: Merchant Activated

Once approved:
- Merchant can accept payments
- Funds settle to bank account
- Dashboard shows transaction history

## MCC Codes (Merchant Category Codes)

Industry-specific codes for field service:

```typescript
{
  HVAC: "1711",              // Heating, Plumbing, A/C
  PLUMBING: "1711",
  ELECTRICAL: "1731",
  PEST_CONTROL: "7342",
  LOCKSMITH: "7699",
  APPLIANCE_REPAIR: "7623",
  GARAGE_DOOR: "1799",
  LANDSCAPING: "0780",
  POOL_SERVICE: "7699",
  CLEANING: "7349",
  ROOFING: "1761",
  CARPENTRY: "1751",
  PAINTING: "1721",
  GENERAL_CONTRACTOR: "1520"
}
```

## Testing

### Sandbox Mode

Use test API URL and credentials:

```bash
PAYRIX_API_URL=https://api-test.payrix.com
PAYRIX_API_KEY=test_key_here
```

### Test Data

- **Test SSN**: 123-45-6789
- **Test Bank**: Routing: 021000021, Account: 1234567890
- **Test Cards**: Use Payrix test card numbers

## Security

### SSN Encryption

SSNs are:
1. Encrypted by Payrix during transmission
2. Stored masked in database (`***-**-****`)
3. Never logged or displayed in full

### PCI Compliance

- No card data stored in our database
- All payment processing via Payrix
- Payrix handles PCI compliance

## API Reference

### Submit Merchant Boarding

```typescript
POST /api/payrix/merchant-boarding

Body: {
  companyId: string;
  yearsInBusiness: number;
  businessDescription: string;
  averageTicketAmount: number;
  highestTicketAmount: number;
  estimatedMonthlyVolume: number;
  ownerFullName: string;
  ownerSSN: string;
  ownerDOB: string; // YYYY-MM-DD
  ownerHomeAddress: string;
  ownerCity: string;
  ownerState: string; // 2-letter code
  ownerZip: string;
  ownerOwnershipPercentage: number; // 25-100
  ownerTitle: string;
  acceptsCreditCards: boolean;
  acceptsDebitCards: boolean;
  acceptsACH: boolean;
  acceptsRecurring: boolean;
  bankAccountNumber: string;
  bankRoutingNumber: string;
  bankAccountType: "checking" | "savings";
}

Response: {
  success: boolean;
  merchantId?: string;
  status?: string;
  error?: string;
}
```

### Check Merchant Status

```typescript
GET /api/payrix/merchant-status?companyId=uuid

Response: {
  success: boolean;
  data?: {
    status: string;
    boardingStatus: string;
    active: boolean;
  };
  error?: string;
}
```

## Troubleshooting

### Application Rejected

Common reasons:
- Invalid SSN or business information
- High risk industry
- Poor credit history
- Missing required documents

**Solution**: Contact Payrix support with merchant ID

### Status Not Updating

**Solution**: Call `checkPayrixMerchantStatus()` to sync

### API Errors

- **401 Unauthorized**: Check API key
- **400 Bad Request**: Validate all required fields
- **500 Server Error**: Contact Payrix support

## Support

### Payrix Support

- **Email**: support@payrix.com
- **Phone**: 1-844-479-7491
- **Portal**: https://support.payrix.com
- **Documentation**: https://resource.payrix.com

### Internal Support

- **File**: `/docs/PAYRIX_SETUP.md` (this file)
- **Code**: `/src/lib/payrix/api.ts`
- **Actions**: `/src/actions/payrix.ts`
- **Component**: `/src/components/onboarding/payrix-step.tsx`

## Next Steps

1. ✅ Get Payrix API credentials
2. ✅ Add environment variables
3. ✅ Test onboarding flow
4. ✅ Implement payment collection (future)
5. ✅ Add transaction reporting (future)

---

**Last Updated**: 2025-01-18
**Status**: Complete - Ready for testing
