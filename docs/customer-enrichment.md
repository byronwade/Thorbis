# Customer Data Enrichment

Complete guide to the customer data enrichment feature that integrates external APIs to provide comprehensive customer intelligence.

## Overview

The Customer Data Enrichment system automatically enriches customer profiles with data from multiple external sources:

- **Person Data**: Job titles, company information, professional background
- **Business Data**: Reviews, ratings, business hours, registration information
- **Social Profiles**: LinkedIn, Twitter, Facebook profiles
- **Property Data**: Property values, permits, zoning information

## Features

### ✅ Implemented

- Multi-provider enrichment (, Hunter.io, , Google Places, etc.)
- Hybrid caching strategy (7-day TTL by default)
- Usage tracking and tier-based limits
- Premium feature gating
- Automatic enrichment on customer detail view
- Manual refresh capability
- RLS-secured data storage
- Confidence scoring
- Error handling and fallbacks

### 🎯 Tier Limits

| Tier | Enrichments/Month | Features | Price |
|------|-------------------|----------|-------|
| **Free** | 50 | Basic person + business data | $0 |
| **Pro** | 500 | + Social profiles + property data | $49/mo |
| **Enterprise** | Unlimited | + Real-time updates + priority support | $199/mo |

## Architecture

### Services

```
src/lib/services/
├── customer-enrichment.ts      # Main orchestrator
├── person-enrichment.ts        # , Hunter.io, ├── business-enrichment.ts      # Google Places, OpenCorporates
├── social-enrichment.ts        # LinkedIn, Twitter, Facebook
└── property-enrichment.ts      # Attom Data, CoreLogic
```

### Server Actions

```
src/actions/customer-enrichment.ts
├── enrichCustomerData()        # Trigger enrichment
├── getEnrichmentData()         # Get cached data
├── refreshEnrichment()         # Force refresh
├── checkEnrichmentQuota()      # Check limits
└── updateEnrichmentTier()      # Admin: Change tier
```

### API Routes

```
/api/customers/[id]/enrich
├── GET    # Retrieve cached enrichment
└── POST   # Trigger new enrichment

/api/customers/[id]/enrich/refresh
└── POST   # Force refresh enrichment

/api/enrichment/usage
└── GET    # Get usage statistics
```

### Database Tables

```sql
-- Stores enriched data with caching
customer_enrichment_data (
  id, customer_id, data_type, source,
  enrichment_data (JSONB), confidence_score,
  cached_at, expires_at, status
)

-- Tracks usage for billing
customer_enrichment_usage (
  id, company_id, month_year,
  enrichments_count, enrichments_limit,
  api_costs, tier
)
```

## Usage

### In Customer Detail Page

The enrichment panel is automatically loaded on customer detail pages:

```tsx
// In page.tsx (Server Component)
import { getEnrichmentData } from "@/actions/customer-enrichment";

const enrichmentResult = await getEnrichmentData(customerId);
const enrichmentData = enrichmentResult.success ? enrichmentResult.data : null;

// Pass to client component
<CustomerPageEditorWrapper
  enrichmentData={enrichmentData}
  // ... other props
/>
```

### Programmatic Usage

```typescript
import { enrichCustomerData } from "@/actions/customer-enrichment";

// Enrich a customer
const result = await enrichCustomerData(customerId, false);

if (result.success) {
  const { person, business, social, properties } = result.data;
  
  // Person data
  console.log(person.jobTitle, person.company);
  
  // Business data
  console.log(business.rating, business.reviewCount);
  
  // Social profiles
  console.log(social.profiles.linkedin?.url);
  
  // Property data
  console.log(properties[0].ownership.marketValue);
}
```

### Check Quota

```typescript
import { checkEnrichmentQuota } from "@/actions/customer-enrichment";

const quota = await checkEnrichmentQuota();

if (quota.success) {
  console.log(`Used: ${quota.data.current}/${quota.data.limit || '∞'}`);
  console.log(`Can enrich: ${quota.data.canEnrich}`);
  console.log(`Tier: ${quota.data.tier}`);
}
```

## Environment Variables

```bash
# Person Enrichment APIs
=your_clearbit_key
HUNTER_API_KEY=your_hunter_key
=your_fullcontact_key

# Business Intelligence APIs
GOOGLE_PLACES_API_KEY=your_google_key
OPENCORPORATES_API_KEY=your_opencorporates_key

# Social Media APIs
RAPIDAPI_KEY=your_rapidapi_key
TWITTER_BEARER_TOKEN=your_twitter_token
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_secret

# Property Data APIs (already configured)
ATTOM_API_KEY=your_attom_key
CORELOGIC_API_KEY=your_corelogic_key

# Feature Flags
ENABLE_CUSTOMER_ENRICHMENT=true
ENRICHMENT_CACHE_TTL=604800  # 7 days in seconds
```

## API Provider Setup

### 1.  (Person Data)

1. Sign up at [clearbit.com](https://clearbit.com)
2. Get API key from dashboard
3. Add to `.env.local`: `=sk_...`
4. Free tier: 50 lookups/month

### 2. Hunter.io (Email Verification)

1. Sign up at [hunter.io](https://hunter.io)
2. Get API key from settings
3. Add to `.env.local`: `HUNTER_API_KEY=...`
4. Free tier: 25 searches/month

### 3.  (Person Enrichment)

1. Sign up at [fullcontact.com](https://www.fullcontact.com)
2. Get API key from developer portal
3. Add to `.env.local`: `=...`
4. Free tier: 100 lookups/month

### 4. Google Places (Business Data)

1. Enable Google Places API in Google Cloud Console
2. Create API key
3. Add to `.env.local`: `GOOGLE_PLACES_API_KEY=...`
4. Free tier: $200 credit/month

### 5. OpenCorporates (Company Registry)

1. Sign up at [opencorporates.com](https://opencorporates.com)
2. Optional: Get API key for higher rate limits
3. Add to `.env.local`: `OPENCORPORATES_API_KEY=...`
4. Free tier: 500 requests/day

## UI Components

### CustomerEnrichmentPanel

Full enrichment panel showing all available data:

```tsx
import { CustomerEnrichmentPanel } from "@/components/customers/customer-enrichment-panel";

<CustomerEnrichmentPanel
  customerId={customerId}
  initialData={enrichmentData}
/>
```

### EnrichmentPreviewCard

Compact preview for lists and tables:

```tsx
import { EnrichmentPreviewCard } from "@/components/customers/enrichment-preview-card";

<EnrichmentPreviewCard
  enrichmentData={enrichmentData}
  compact={true}
/>
```

### EnrichmentUpsell

Usage tracking and upgrade prompts:

```tsx
import { EnrichmentUpsell } from "@/components/customers/enrichment-upsell";

<EnrichmentUpsell
  currentTier="free"
  usageCount={25}
  usageLimit={50}
  showFullFeatures={false}
/>
```

## Database Functions

### Check Quota

```sql
SELECT can_enrich_customer('company-id-here');
-- Returns: true/false
```

### Increment Usage

```sql
SELECT increment_enrichment_usage('company-id-here', 10);
-- Increments counter and tracks $0.10 API cost
-- Returns: true if under limit, false if exceeded
```

### Get Statistics

```sql
SELECT * FROM get_enrichment_stats('company-id-here');
-- Returns last 12 months of usage data
```

## Caching Strategy

### Default Behavior

1. **First view**: Check cache → Enrich if missing/expired → Store with 7-day TTL
2. **Subsequent views**: Return cached data if not expired
3. **Manual refresh**: Force new enrichment, reset TTL

### Cache TTL by Tier

- **Free**: 7 days
- **Pro**: 1 day (configurable)
- **Enterprise**: Real-time (always fresh)

### Implementation

```typescript
const cacheTTL = {
  free: 7 * 24 * 60 * 60 * 1000,      // 7 days
  pro: 1 * 24 * 60 * 60 * 1000,       // 1 day
  enterprise: 0                         // No cache (always fresh)
};

customerEnrichmentService.setCacheTTL(cacheTTL[tier]);
```

## Error Handling

### Graceful Degradation

If enrichment fails, the system:

1. Tries next provider in fallback chain
2. Returns partial data if any source succeeds
3. Displays basic customer data if all fail
4. Logs errors for monitoring

### Provider Fallback Order

**Person Data**:  →  → Hunter.io
**Business Data**: Google Places → OpenCorporates
**Social Data**: LinkedIn → Twitter → Facebook

### Example

```typescript
try {
  const enrichment = await enrichCustomerData(customerId);
  if (enrichment.success) {
    // Use enriched data
  } else {
    // Show basic customer data
    console.error(enrichment.error);
  }
} catch (error) {
  // Handle unexpected errors
  console.error("Enrichment failed:", error);
}
```

## Security

### Row Level Security (RLS)

All enrichment data is protected by RLS policies:

- Users can only view/edit enrichment for customers in their company
- Enforced at database level
- No way to bypass even with direct API access

### Data Privacy

- Enrichment data is stored encrypted at rest
- API keys are server-side only (never exposed to client)
- Personal data follows GDPR/privacy regulations
- Customers can request data deletion

### Rate Limiting

- Per-company monthly limits enforced
- API providers have their own rate limits
- Automatic retry with exponential backoff

## Testing

### Run Tests

```bash
# Unit tests
pnpm test src/lib/services/__tests__/customer-enrichment.test.ts

# Integration tests
pnpm test src/actions/__tests__/customer-enrichment.test.ts

# All enrichment tests
pnpm test --testPathPattern=enrichment
```

### Mock Data

Tests use mock API responses for consistency:

```typescript
jest.mock("../person-enrichment");

(personEnrichmentService.enrichPerson as jest.Mock).mockResolvedValue({
  email: "test@example.com",
  jobTitle: "Software Engineer",
  // ... mock data
});
```

## Monitoring

### Key Metrics

- **Enrichment success rate**: % of successful enrichments
- **API latency**: Time to complete enrichment
- **Cache hit rate**: % of requests served from cache
- **Cost per enrichment**: Average API cost
- **Usage by tier**: Enrichments used per plan

### Logging

All enrichment operations are logged:

```typescript
console.log(`Enriching customer ${customerId}`);
console.log(`Enrichment result:`, enrichment);
console.error(`Failed to enrich property:`, error);
```

## Troubleshooting

### No enrichment data returned

**Causes**:
- API keys not configured
- Customer data incomplete (missing email/address)
- All providers failed
- Network issues

**Solutions**:
1. Check environment variables
2. Verify API keys are valid
3. Check API provider status pages
4. Review error logs

### Enrichment limit reached

**Causes**:
- Monthly limit exceeded for tier
- Usage counter not reset

**Solutions**:
1. Upgrade to higher tier
2. Wait for next month
3. Check usage: `SELECT * FROM customer_enrichment_usage`

### Stale enrichment data

**Causes**:
- Cache not expired yet
- Auto-refresh not triggered

**Solutions**:
1. Manual refresh via UI
2. Lower cache TTL for tier
3. Force refresh: `refreshEnrichment(customerId)`

## Future Enhancements

### Planned Features

- [ ] Webhook-based real-time updates
- [ ] ML-based data quality scoring
- [ ] Custom data source integrations
- [ ] Bulk enrichment API
- [ ] Enrichment scheduling
- [ ] Historical data tracking
- [ ] Export enrichment reports
- [ ] API cost optimization

### Roadmap

**Q2 2025**: Webhook updates, ML scoring
**Q3 2025**: Custom integrations, bulk API
**Q4 2025**: Historical tracking, reports

## Support

For issues or questions:

- Check logs in `/dashboard/settings/logs`
- Review usage in `/dashboard/settings/subscriptions`
- Contact support for API issues
- File bug reports with enrichment ID

## License

Proprietary - Internal Use Only

