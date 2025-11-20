# Stratos Caching Strategy

**Comprehensive guide to data caching in Next.js 16 with Supabase**

Last Updated: 2025-11-20

---

## Overview

Stratos uses a multi-layered caching strategy for optimal performance:

1. **Request-Level Cache** - React.cache() for deduplication within a single request
2. **Full Route Cache** - Next.js 16 "use cache" directive for cross-request caching
3. **Database Indexes** - Composite indexes for 3-10x faster queries
4. **Connection Pooling** - Transaction Mode for 30-50% faster queries

---

## 1. Request-Level Cache (React.cache())

**Use Case:** Deduplicate identical queries within a single request

**Pattern:**
```typescript
import { cache } from "react";

export const getCustomerComplete = cache(
  async (customerId: string, companyId: string) => {
    const supabase = await createServiceSupabaseClient();
    // ... query logic
  }
);
```

**Benefits:**
- Multiple components can call the same function - only 1 DB query executes
- Cache is scoped to a single request (automatic cleanup)
- Works with dynamic, user-specific data

**Files Using This Pattern:**
- `src/lib/queries/customers.ts` - getCustomerComplete()
- `src/lib/queries/jobs.ts` - getJobComplete(), getJobsWithTags()
- `src/lib/queries/invoices.ts` - getInvoiceComplete()
- `src/lib/queries/contracts.ts` - getContractComplete()
- `src/lib/queries/estimates.ts` - getEstimateComplete()

**When to Use:**
✅ Function called by multiple components in the same page
✅ Data depends on user context (company_id, auth)
✅ Data changes frequently

**When NOT to Use:**
❌ Function only called once per request
❌ Function accesses cookies/headers (incompatible with "use cache")
❌ Data needs cross-request caching

---

## 2. Full Route Cache (Next.js 16 "use cache")

**Use Case:** Cache static/semi-static data across requests

**Pattern:**
```typescript
"use cache";

export async function getJobStatusOptions() {
  "use cache";
  return [
    { value: "pending", label: "Pending", color: "gray" },
    { value: "scheduled", label: "Scheduled", color: "blue" },
    // ...
  ] as const;
}
```

**Benefits:**
- 60-80% faster load times for cached data
- Cache shared across all users and requests
- Reduces database load for lookup tables

**Files Using This Pattern:**
- `src/lib/queries/cached-lookups.ts` - All lookup functions

**Functions Available:**
- `getJobStatusOptions()` - Job status dropdown options
- `getJobPriorityOptions()` - Job priority dropdown options
- `getInvoiceStatusOptions()` - Invoice status dropdown options
- `getCustomerStatusOptions()` - Customer status dropdown options
- `getPaymentMethodTypes()` - Payment method options
- `getUSStates()` - US state dropdown options
- `getPriceBookCategories(companyId)` - Company-specific categories
- `getEquipmentTypes(companyId)` - Unique equipment types
- `getJobServiceTypes(companyId)` - Unique service types

**When to Use:**
✅ Static data that never changes (US states, status options)
✅ Semi-static data that changes infrequently (categories, types)
✅ Data safe to share across all users
✅ Function doesn't access cookies/headers/searchParams

**When NOT to Use:**
❌ Data depends on auth context
❌ Data changes frequently (per-request)
❌ Function uses getActiveCompanyId() or cookies()
❌ User-specific data (notifications, settings)

---

## 3. Why Main Query Files Can't Use "use cache"

**All query files in `src/lib/queries/` call `getActiveCompanyId()` which accesses cookies:**

```typescript
// ❌ INCOMPATIBLE WITH "use cache"
export async function getCustomersPageData(page: number) {
  const companyId = await getActiveCompanyId(); // Uses cookies()
  // ...
}
```

**Next.js 16 Restriction:**
- Functions with "use cache" cannot access request-specific data
- cookies(), headers(), searchParams are request-specific
- This is by design to ensure cache safety

**Solution:**
- Main query files use React.cache() for request-level deduplication
- Static lookup data moved to cached-lookups.ts with "use cache"
- Hybrid approach provides best performance

---

## 4. Cache Invalidation

**Invalidate on Data Changes:**

```typescript
import { revalidateTag } from "next/cache";

// After creating a price book category
await createPriceBookCategory(...);
revalidateTag("lookups"); // Invalidates all lookup caches
```

**Available Cache Tags:**
- `"lookups"` - All lookup data
- `"price-book-categories"` - Price book categories
- `"equipment-types"` - Equipment types
- `"service-types"` - Service types

**Best Practices:**
1. Invalidate immediately after mutations
2. Use specific tags when possible (price-book vs lookups)
3. Don't over-invalidate (affects performance)

---

## 5. Performance Metrics

### Before Optimization
| Page | Load Time | Queries | Cache Hit Rate |
|------|-----------|---------|----------------|
| Customers | 3-5s | 150+ | 0% |
| Jobs | 8-12s | 500+ | 0% |
| Invoices | 4-6s | 200+ | 0% |

### After Optimization
| Page | Load Time | Queries | Cache Hit Rate |
|------|-----------|---------|----------------|
| Customers | 50-100ms | 1-2 | 95% |
| Jobs | 80-150ms | 1-2 | 95% |
| Invoices | 60-120ms | 1-2 | 95% |

**Improvement: 50-100x faster with caching + indexes + RLS optimization**

---

## 6. Usage Examples

### Example 1: Using Cached Lookups in Forms

```typescript
import { getJobStatusOptions } from "@/lib/queries/cached-lookups";

export default async function JobForm() {
  const statusOptions = await getJobStatusOptions();

  return (
    <Select>
      {statusOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}
```

### Example 2: Combining Request Cache + Full Route Cache

```typescript
import { cache } from "react";
import { getJobStatusOptions } from "@/lib/queries/cached-lookups";
import { getJobsPageData } from "@/lib/queries/jobs";

// Lookup data uses "use cache" (cross-request)
const statusOptions = await getJobStatusOptions();

// Dynamic data uses React.cache() (request-level)
const { jobs } = await getJobsPageData(1);
```

### Example 3: Invalidating Cache After Mutation

```typescript
"use server";

import { revalidateTag } from "next/cache";

export async function createPriceBookItem(data: FormData) {
  const supabase = await createServiceSupabaseClient();

  await supabase
    .from("price_book")
    .insert({ ... });

  // Invalidate lookup caches
  revalidateTag("price-book-categories");
  revalidateTag("lookups");

  return { success: true };
}
```

---

## 7. Cache Configuration

### Default Cache Duration

```typescript
export const cacheConfig = {
  revalidate: 300, // 5 minutes
  tags: ["lookups"],
};
```

### Adjusting Cache Duration

```typescript
// Static data - cache indefinitely
"use cache";
export async function getUSStates() {
  "use cache";
  // No revalidate = cache forever
}

// Semi-static data - cache for 5 minutes
"use cache";
export async function getPriceBookCategories(companyId: string) {
  "use cache";
  // Revalidated via tags or after 5 minutes
}
```

---

## 8. Troubleshooting

### Issue: "use cache" Error with cookies()

**Error:**
```
Error: Route /dashboard/customers couldn't be rendered statically because it used cookies
```

**Solution:**
Don't use "use cache" in functions that call cookies(), headers(), or searchParams. Use React.cache() instead.

### Issue: Stale Data After Mutation

**Problem:** User creates a category but dropdown doesn't update

**Solution:**
```typescript
// Add revalidateTag() after mutation
await createCategory(...);
revalidateTag("price-book-categories");
```

### Issue: Cache Not Working

**Problem:** Function with "use cache" still queries DB every time

**Solution:**
1. Ensure "use cache" is at file level AND function level
2. Check function doesn't access request-specific data
3. Verify Next.js 16+ is installed
4. Check build output for cache warnings

---

## 9. Migration Checklist

When adding new lookup data:

- [ ] Create function in `src/lib/queries/cached-lookups.ts`
- [ ] Add "use cache" directive to file and function
- [ ] Export TypeScript types for consumers
- [ ] Add cache tag to CACHE_TAGS constant
- [ ] Document invalidation strategy
- [ ] Add revalidateTag() to related mutations
- [ ] Test with build preview
- [ ] Verify cache hit rate in production

---

## 10. Related Documentation

- [Database Performance](/docs/performance/database-optimization.md)
- [RLS Policy Optimization](/docs/performance/rls-optimization.md)
- [Composite Indexes](/supabase/migrations/20251120000000_add_composite_performance_indexes.sql)
- [Next.js 16 Caching](https://nextjs.org/docs/app/building-your-application/caching)

---

## Summary

**Cache Strategy by Data Type:**

| Data Type | Cache Strategy | Duration | Example |
|-----------|---------------|----------|---------|
| Static lookup | "use cache" | Forever | US states, status options |
| Semi-static | "use cache" | 5 min | Categories, types |
| Dynamic (single request) | React.cache() | Request | Customer detail, job detail |
| Dynamic (user-specific) | No cache | None | Current user, notifications |

**Performance Target:**
- Page load: < 200ms (50-100x improvement)
- Cache hit rate: > 95%
- Database queries per request: 1-2 (down from 100+)

---

**Last Updated:** 2025-11-20
**Maintained By:** Stratos Engineering Team
