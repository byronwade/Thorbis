# Property Data Research: Free & Low-Cost Options

## 🎯 Reality Check

**No comprehensive property data API is completely free with zero configuration.** Property data is expensive to compile and maintain. However, here are the best options:

---

## ✅ RECOMMENDED: Best Free Tier APIs

### 1. **RentCast API** (formerly Realty Mole)
- **Free Tier**: 50 API calls/month
- **Data**: Property details, valuations, rental estimates, owner info, tax assessments
- **Coverage**: 140,000+ properties nationwide
- **Setup**: Sign up, get API key (takes 2 minutes)
- **URL**: https://rentcast.io/api
- **Verdict**: ⭐⭐⭐⭐⭐ Best value for small operations

### 2. **Realie Property Data API**
- **Free Tier**: Limited free tier, no credit card required
- **Data**: 180M parcels, sourced from municipal records
- **Coverage**: Full USA coverage
- **Setup**: Sign up, instant API key
- **URL**: https://realie.ai
- **Verdict**: ⭐⭐⭐⭐ Good backup option

### 3. **RealEstateAPI.com**
- **Free Tier**: 1,000 requests/month
- **Data**: 157M properties, parcel, building, owner, tax, mortgage
- **Coverage**: USA nationwide
- **Setup**: Sign up for API key
- **URL**: https://realestateapi.com
- **Verdict**: ⭐⭐⭐⭐ Generous free tier

### 4. **HasData Real Estate APIs**
- **Free Tier**: 1,000 requests/month
- **Data**: Property listings, agent info, market trends
- **Coverage**: USA nationwide
- **Setup**: Sign up for API key
- **URL**: https://hasdata.com
- **Verdict**: ⭐⭐⭐ Good for market data

---

## 🆓 TRULY FREE (No API Key) Options

### 1. **OpenStreetMap (OSM) via Overpass API**
- **Cost**: Completely free forever
- **Data Available**:
  - ✅ Building footprints (geometry)
  - ✅ Building height (if tagged)
  - ✅ Building type (residential, commercial, etc.)
  - ✅ Address (if tagged)
  - ❌ NO: Owner info, tax data, sale history, valuations
- **Setup**: No API key needed
- **Rate Limit**: "Reasonable use" (~10,000 queries/day)
- **Verdict**: ⭐⭐⭐ Good for basic building data, limited property info

**Sample Query:**
```
[out:json];
(
  way["building"](around:100,34.5,-84.4);
  node["building"](around:100,34.5,-84.4);
);
out body;
```

### 2. **US Census Bureau - American Community Survey (ACS)**
- **Cost**: Completely free forever
- **Data Available**:
  - ✅ Median home values by census tract
  - ✅ Owner-occupied vs renter-occupied rates
  - ✅ Median household income by area
  - ❌ NO: Individual property data
- **Setup**: No API key needed (but recommended for higher limits)
- **Verdict**: ⭐⭐⭐ Good for neighborhood demographics, not property-specific

### 3. **County Assessor Public Records**
- **Cost**: Free (public records)
- **Data Available**:
  - ✅ Property tax assessments
  - ✅ Owner names
  - ✅ Sale history
  - ✅ Square footage, lot size, bedrooms/bathrooms
- **Challenge**: No standardized API, varies by county
- **Options**:
  - Manual scraping (legal but technically challenging)
  - Use aggregators like Realie (which already does this)
- **Verdict**: ⭐⭐ Best data, worst access

---

## 🚫 AVOID: Limited Trial APIs

### ❌ Attom Data API
- **Problem**: Free tier is only 30 days
- **After trial**: $500+/month

### ❌ CoreLogic
- **Problem**: Enterprise only, expensive

### ❌ Zillow API
- **Problem**: Discontinued for most use cases (2021)
- **Status**: Only available for specific approved partners

---

## 💡 RECOMMENDED STRATEGY

### **Hybrid Approach (Best Results)**

**Tier 1: Always Free (No Keys)**
1. OpenStreetMap - Building footprints & basic info
2. Census ACS - Neighborhood demographics
3. Already using: FCC Census, FEMA flood zones

**Tier 2: Optional Free Tier APIs**
1. RentCast (50/month) - For detailed property data when needed
2. Cache aggressively (30-90 days)
3. Prioritize high-value jobs

**Tier 3: User-Provided Data**
1. Let users manually enter property details
2. Build internal database over time
3. Use ML to estimate missing data

---

## 📊 Data Coverage Comparison

| Source | Building Info | Tax Data | Valuations | Owner Info | Free Tier | API Key |
|--------|--------------|----------|------------|------------|-----------|---------|
| **RentCast** | ✅ Good | ✅ Good | ✅ Excellent | ✅ Good | 50/month | Required |
| **Realie** | ✅ Excellent | ✅ Excellent | ❌ No | ✅ Good | Limited | Required |
| **RealEstateAPI** | ✅ Good | ✅ Good | ✅ Good | ✅ Good | 1000/month | Required |
| **OpenStreetMap** | ⚠️ Basic | ❌ No | ❌ No | ❌ No | Unlimited | None |
| **Census ACS** | ❌ No | ❌ No | ⚠️ Area avg | ❌ No | Unlimited | None |
| **County Records** | ✅ Excellent | ✅ Excellent | ⚠️ Varies | ✅ Good | Unlimited | None |

---

## 🎯 FINAL RECOMMENDATION

### **For Your Use Case (Field Service Software):**

**Primary Option: RentCast API**
- **Why**: Best free tier (50/month is 1-2 property lookups per day)
- **Caching**: With 30-day cache, 50 requests = 1500 effective lookups
- **Cost to scale**: $99/month for 1,000 requests (very reasonable)
- **Setup time**: 5 minutes

**Supplement With:**
- OpenStreetMap for building footprints (visual context)
- Census data for neighborhood income/values (already doing this)
- Keep Attom as optional for power users willing to pay

**Implementation:**
```typescript
// Priority order
1. Check cache (30-day TTL)
2. Try RentCast API (50/month free tier)
3. Fallback to OpenStreetMap (building footprints only)
4. Show "Limited data" message + option to add Attom key
```

---

## 🔄 Migration Plan

1. **Phase 1** (Immediate): Remove Attom requirement
2. **Phase 2** (This week): Add RentCast integration
3. **Phase 3** (Optional): Add OpenStreetMap building data
4. **Phase 4** (Future): Consider county scraper for high-volume users

---

## 📝 Notes

- Property data is inherently expensive because it's compiled from thousands of county sources
- "Free" usually means "free tier" not "unlimited free"
- Most legitimate services require at least an API key for tracking
- Completely free + comprehensive + no config = doesn't exist for property data
- The alternatives are: pay for data, accept limited free tiers, or scrape (complex)

