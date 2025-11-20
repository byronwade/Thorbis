# Additional Performance Optimization Opportunities

**Post-Phase 3 Performance Audit - Remaining Optimizations**

Date: 2025-11-20

---

## Executive Summary

After completing the 3-phase performance optimization (50-100x improvements), this audit identifies **5 additional optimization opportunities** that could further improve performance by **10-20%**.

**Priority:** Medium (Optional enhancements)
**Estimated Impact:** 10-20% additional performance gain
**Estimated Effort:** 2-4 hours

---

## 1. Add React.cache() to Missing Query Files 🔴 HIGH PRIORITY

### Issue

**Files Missing React.cache():**
- `src/lib/queries/materials.ts`
- `src/lib/queries/team-members.ts`

**Impact:** Without React.cache(), if multiple components call the same query function in a single request, it executes multiple database queries instead of deduplicating.

**Example Problem:**
```typescript
// Page.tsx
const materials = await getMaterialsPageData(1);

// MaterialsStats.tsx (same request)
const materials = await getMaterialsPageData(1);

// ❌ CURRENT: 2 database queries
// ✅ WITH React.cache(): 1 database query
```

### Solution

**Add React.cache() wrapper to both files:**

```typescript
// src/lib/queries/materials.ts
import { cache } from "react";

export const getMaterialsPageData = cache(
  async (
    page: number,
    pageSize: number = MATERIALS_PAGE_SIZE,
    companyIdOverride?: string,
  ): Promise<MaterialsPageResult> => {
    // ... existing implementation
  }
);

// src/lib/queries/team-members.ts
import { cache } from "react";

export const getTeamMembersPageData = cache(
  async (
    page: number,
    pageSize: number = TEAM_MEMBERS_PAGE_SIZE,
    searchQuery = "",
    companyIdOverride?: string,
    archiveFilter: ArchiveFilter = "active",
  ): Promise<TeamMembersPageResult> => {
    // ... existing implementation
  }
);
```

**Performance Gain:** 50-100ms saved per duplicate query
**Effort:** 5 minutes

---

## 2. Optimize Team Members N+1 Pattern 🟡 MEDIUM PRIORITY

### Issue

**File:** `src/lib/queries/team-members.ts:133-159`

**Current Implementation:**
1. Query `company_memberships` table (1 query)
2. Extract unique user IDs
3. Query `profiles` table separately (1 additional query)
4. Manually join in JavaScript

**Problem:** Secondary N+1 pattern - two separate queries instead of a JOIN.

### Solution

**Option A: Use JOIN in Original Query (Preferred)**

```typescript
const TEAM_MEMBERS_SELECT = `
  id,
  user_id,
  company_id,
  role,
  // ... other fields
  profiles!team_members_user_id_profiles_id_fk (
    id,
    email,
    full_name,
    avatar_url,
    phone
  )
`;

export const getTeamMembersPageData = cache(
  async (...params): Promise<TeamMembersPageResult> => {
    const query = supabase
      .from("company_memberships")
      .select(TEAM_MEMBERS_SELECT, { count: "exact" })
      .eq("company_id", companyId)
      // ... filters

    const { data, error, count } = await query;

    // No secondary query needed - profiles already joined
    return {
      teamMembers: data ?? [],
      totalCount: count ?? 0,
    };
  }
);
```

**Option B: Create RPC Function (Like customers)**

```sql
CREATE OR REPLACE FUNCTION get_team_members_rpc(
  p_company_id UUID,
  p_page INTEGER DEFAULT 1,
  p_page_size INTEGER DEFAULT 50,
  p_search_query TEXT DEFAULT NULL,
  p_archive_filter TEXT DEFAULT 'active'
)
RETURNS TABLE(...) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cm.*,
    jsonb_build_object(
      'id', p.id,
      'email', p.email,
      'full_name', p.full_name,
      'avatar_url', p.avatar_url,
      'phone', p.phone
    ) as user_profile
  FROM company_memberships cm
  LEFT JOIN profiles p ON p.id = cm.user_id
  WHERE cm.company_id = p_company_id
    AND cm.deleted_at IS NULL
    -- filters
  ORDER BY cm.created_at DESC
  LIMIT p_page_size
  OFFSET (p_page - 1) * p_page_size;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
```

**Performance Gain:** 2 queries → 1 query (50-100ms saved)
**Effort:** 15-30 minutes

---

## 3. Add Aggressive Prefetch to Primary Navigation 🟢 LOW PRIORITY

### Issue

**File:** `src/components/layout/nav-main.tsx`, `src/components/layout/nav-grouped.tsx`

**Current:** Uses default viewport-based prefetch
**Opportunity:** Add aggressive prefetch to always-visible primary navigation

### Solution

```typescript
// src/components/layout/nav-main.tsx
<Link
  href="/dashboard"
  prefetch={true}  // Aggressive prefetch for critical paths
>
  Dashboard
</Link>

// Apply to top 5-10 most-used navigation items:
// - Dashboard
// - Customers
// - Work (jobs/invoices)
// - Schedule
// - Settings
```

**Performance Gain:** 200ms → 0-10ms navigation (90-95% faster for primary routes)
**Effort:** 10 minutes

**Note:** Only add to top 5-10 most-used routes to avoid bandwidth waste.

---

## 4. Optimize Images (8 instances) 🟡 MEDIUM PRIORITY

### Issue

**8 images still using `<img>` tags instead of Next.js `<Image>`:**

```
src/app/(marketing)/contracts/sign/[id]/page.tsx:146
src/app/(auth)/accept-invitation/page.tsx:270
src/components/schedule/team-avatar-manager.tsx:38
src/components/work/job-enrichment-panel.tsx:629
src/components/work/job-enrichment-panel.tsx:650
src/components/work/job-enrichment-panel.tsx:699
src/components/communication/messages/client/conversation/message-input-v2.tsx:294
src/components/communication/messages/client/conversation/message-bubble.tsx:152
```

**Problem:** Missing Next.js automatic optimizations:
- No WebP/AVIF conversion
- No lazy loading
- No responsive sizing
- No blur placeholder

### Solution

**Replace `<img>` with `<Image>` from next/image:**

```typescript
// Before
<img src="/logo.png" alt="Logo" className="h-12 w-12" />

// After
import Image from "next/image";

<Image
  src="/logo.png"
  alt="Logo"
  width={48}
  height={48}
  className="h-12 w-12"
  loading="lazy"
/>
```

**Performance Gain:**
- 30-50% smaller file sizes (WebP/AVIF)
- Lazy loading (only load visible images)
- Faster LCP (Largest Contentful Paint)

**Effort:** 20 minutes (8 files)

---

## 5. Implement Web Vitals Monitoring 🟢 LOW PRIORITY

### Issue

**Current State:** No active monitoring of Core Web Vitals (CLS, FID, LCP, FCP, TTFB)

**Impact:** Cannot track performance regressions or validate optimizations in production.

### Solution

**Add web-vitals reporting to app:**

```typescript
// src/app/layout.tsx or instrumentation.ts
import { onCLS, onFID, onLCP, onFCP, onTTFB } from "web-vitals";

function sendToAnalytics(metric: Metric) {
  // Send to your analytics service
  const body = JSON.stringify(metric);
  const url = "/api/analytics";

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: "POST", keepalive: true });
  }
}

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
```

**Create API endpoint:**

```typescript
// src/app/api/analytics/route.ts
export async function POST(request: Request) {
  const metric = await request.json();

  // Store in database or send to monitoring service
  // (Vercel Analytics, Google Analytics, etc.)

  return new Response("OK", { status: 200 });
}
```

**Performance Gain:** No direct gain, but enables:
- Tracking performance over time
- Identifying regressions
- A/B testing optimizations
- User experience monitoring

**Effort:** 30 minutes

**Integration Options:**
- Vercel Analytics (built-in, free)
- Google Analytics 4 (free)
- Sentry Performance Monitoring (paid)
- Custom database storage

---

## Priority Summary

### High Priority (Immediate - ~20 minutes)

1. ✅ **Add React.cache() to materials.ts and team-members.ts**
   - Impact: Prevents duplicate queries in same request
   - Effort: 5 minutes
   - Risk: None (pure optimization)

2. ✅ **Optimize team-members N+1 pattern**
   - Impact: 50-100ms saved per team page load
   - Effort: 15-30 minutes
   - Risk: Low (test query results match)

### Medium Priority (Next Week - ~20 minutes)

3. **Replace 8 `<img>` tags with Next.js `<Image>`**
   - Impact: 30-50% smaller image sizes, lazy loading
   - Effort: 20 minutes
   - Risk: None (measure dimensions first)

### Low Priority (Optional - ~40 minutes)

4. **Add aggressive prefetch to primary navigation**
   - Impact: 200ms → 10ms for primary routes
   - Effort: 10 minutes
   - Risk: Slight bandwidth increase

5. **Implement Web Vitals monitoring**
   - Impact: Performance tracking/regression detection
   - Effort: 30 minutes
   - Risk: None (monitoring only)

---

## Implementation Order

**Recommended sequence for maximum impact with minimum effort:**

1. **React.cache() wrapper** (5 min) - Immediate, zero risk
2. **Team members JOIN optimization** (15-30 min) - High impact, low risk
3. **Image optimization** (20 min) - Significant user-facing improvement
4. **Navigation prefetch** (10 min) - Quick UX win
5. **Web Vitals monitoring** (30 min) - Long-term benefit

**Total Effort:** 1.5-2 hours
**Total Impact:** 10-20% additional performance improvement

---

## Metrics Targets

**After these optimizations:**

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Team members page load | 100-200ms | 50-100ms | 50% faster |
| Materials page load | 100-200ms | 50-100ms | 50% faster |
| Image load time | 300-500ms | 100-200ms | 60-70% faster |
| Primary navigation | 50ms | 0-10ms | 80-95% faster |
| Core Web Vitals | Unknown | 95+ score | Baseline established |

---

## Long-Term Recommendations

**Future optimizations to consider (next quarter):**

1. **Edge Caching (Vercel Edge)**
   - Deploy static assets to global CDN
   - Reduce latency for international users
   - Effort: 2-4 hours

2. **Service Worker (Offline Support)**
   - Cache pages for offline viewing
   - Instant page loads from cache
   - Effort: 4-8 hours

3. **Database Connection Pooling Tuning**
   - Analyze pg_stat_statements for slow queries
   - Fine-tune pool size and connection limits
   - Effort: 2-4 hours

4. **Advanced Suspense Boundaries**
   - More granular loading states
   - Stream sections independently
   - Effort: 4-8 hours

5. **React 19 Features**
   - Use new `use()` hook for async data
   - Implement Server Actions improvements
   - Effort: 8-16 hours (requires React 19 stable)

---

## Conclusion

The 3-phase optimization achieved **50-100x performance improvements**. These 5 additional optimizations can provide another **10-20% gain** with minimal effort (~2 hours total).

**Recommended Action:**
- Implement high-priority items immediately (20 minutes)
- Schedule medium-priority items for next sprint (20 minutes)
- Consider low-priority items as optional enhancements (40 minutes)

**Status:** ✅ Audit Complete
**Next Review:** After implementing high/medium priority items

---

**Last Updated:** 2025-11-20
**Maintained By:** Stratos Engineering Team
