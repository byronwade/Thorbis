# ⚡ Partial Prerendering (PPR) Architecture

## 🎯 Goal: 5-20ms Page Loads with Real-Time Data

## What is PPR?

**Partial Prerendering** is Next.js's revolutionary approach that combines:
- **Static Shell** (instant load, 5-20ms)
- **Dynamic Content** (streamed in real-time)

Instead of choosing between static or dynamic, PPR gives you **both**!

```
┌─────────────────────────────────────────────────────────────┐
│ Static Shell (Instant - 5-20ms)                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ • Layout                                                 │ │
│ │ • Navigation                                             │ │
│ │ • Sidebar                                                │ │
│ │ • Toolbar                                                │ │
│ │ • Loading skeletons                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Dynamic Content (Streamed - 100-300ms)                  │ │
│ │ • User-specific data                                     │ │
│ │ • Real-time stats                                        │ │
│ │ • Database queries                                       │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ PPR Architecture for Dashboard

### Current Architecture (Slow)
```typescript
// ❌ Everything is dynamic - 4-6 second load
export default async function DashboardPage() {
  const data = await fetchAllData(); // Blocks entire page!
  return <Dashboard data={data} />;
}
```

### PPR Architecture (Fast)
```typescript
// ✅ Static shell + dynamic content - 5-20ms initial, 100-300ms complete
export const experimental_ppr = true;

export default function DashboardPage() {
  return (
    <DashboardShell> {/* Static - instant! */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats /> {/* Dynamic - streamed */}
      </Suspense>
      
      <Suspense fallback={<JobsSkeleton />}>
        <JobsList /> {/* Dynamic - streamed */}
      </Suspense>
    </DashboardShell>
  );
}
```

---

## 📁 File Structure

```
src/app/(dashboard)/
├── layout.tsx                    # Static shell (instant)
├── dashboard/
│   ├── page.tsx                  # PPR enabled
│   ├── loading.tsx               # Fallback UI
│   └── components/
│       ├── dashboard-shell.tsx   # Static (instant)
│       ├── dashboard-stats.tsx   # Dynamic (async)
│       └── dashboard-skeleton.tsx # Loading state
└── work/
    ├── invoices/
    │   ├── page.tsx              # PPR enabled
    │   ├── loading.tsx           # Fallback UI
    │   └── components/
    │       ├── invoices-shell.tsx   # Static (instant)
    │       ├── invoices-table.tsx   # Dynamic (async)
    │       └── invoices-skeleton.tsx # Loading state
```

---

## 🔧 Implementation

### 1. Enable PPR in Next.js Config

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    ppr: true, // Enable Partial Prerendering
  },
};

export default nextConfig;
```

### 2. Dashboard Page with PPR

```typescript
// src/app/(dashboard)/dashboard/page.tsx
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardJobs } from "@/components/dashboard/dashboard-jobs";
import { DashboardSchedule } from "@/components/dashboard/dashboard-schedule";
import { StatsSkeleton } from "@/components/dashboard/skeletons";

// Enable PPR for this page
export const experimental_ppr = true;

export default function DashboardPage() {
  return (
    <DashboardShell> {/* Static - renders instantly */}
      {/* Each section streams independently */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats /> {/* Async server component */}
      </Suspense>

      <div className="grid grid-cols-2 gap-6">
        <Suspense fallback={<div>Loading jobs...</div>}>
          <DashboardJobs /> {/* Async server component */}
        </Suspense>

        <Suspense fallback={<div>Loading schedule...</div>}>
          <DashboardSchedule /> {/* Async server component */}
        </Suspense>
      </div>
    </DashboardShell>
  );
}
```

### 3. Static Shell Component

```typescript
// src/components/dashboard/dashboard-shell.tsx
import type { ReactNode } from "react";

type DashboardShellProps = {
  children: ReactNode;
};

// Pure server component - no data fetching
// This renders instantly and is cached at the edge
export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mission Control</h1>
          <p className="text-muted-foreground">
            Real-time overview of your operations
          </p>
        </div>
      </div>

      {/* Dynamic content slots */}
      {children}
    </div>
  );
}
```

### 4. Dynamic Stats Component

```typescript
// src/components/dashboard/dashboard-stats.tsx
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getMissionControlData } from "@/lib/dashboard/mission-control-data";
import { StatusPipeline } from "@/components/ui/status-pipeline";

// Async server component - fetches data
// This streams in after the shell renders
export async function DashboardStats() {
  const companyId = await getActiveCompanyId();
  const data = companyId ? await getMissionControlData(companyId) : null;

  if (!data) {
    return <div>No data available</div>;
  }

  const stats = [
    {
      label: "Revenue Today",
      value: `$${(data.metrics.revenueToday / 100).toLocaleString()}`,
      change: 12.4,
      changeLabel: "vs yesterday",
    },
    {
      label: "Jobs in Progress",
      value: data.metrics.jobsInProgress,
      change: 0,
      changeLabel: "active now",
    },
    // ... more stats
  ];

  return <StatusPipeline stats={stats} />;
}
```

### 5. Loading Skeleton

```typescript
// src/components/dashboard/skeletons.tsx
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border bg-card p-6">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="mt-2 h-8 w-32 rounded bg-muted" />
          <div className="mt-2 h-3 w-20 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
```

---

## 🚀 Invoices Page with PPR

```typescript
// src/app/(dashboard)/dashboard/work/invoices/page.tsx
import { Suspense } from "react";
import { InvoicesShell } from "@/components/work/invoices-shell";
import { InvoicesStats } from "@/components/work/invoices-stats";
import { InvoicesTable } from "@/components/work/invoices-table";
import { InvoicesSkeleton } from "@/components/work/invoices-skeleton";

export const experimental_ppr = true;

export default function InvoicesPage() {
  return (
    <InvoicesShell> {/* Static - instant */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <InvoicesStats /> {/* Dynamic - streamed */}
      </Suspense>

      <Suspense fallback={<InvoicesSkeleton />}>
        <InvoicesTable /> {/* Dynamic - streamed */}
      </Suspense>
    </InvoicesShell>
  );
}
```

```typescript
// src/components/work/invoices-stats.tsx
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function InvoicesStats() {
  const companyId = await getActiveCompanyId();
  const supabase = await createClient();

  // Fetch only aggregated stats (fast!)
  const { data } = await supabase
    .from("invoices")
    .select("status, total_amount, paid_amount")
    .eq("company_id", companyId)
    .is("deleted_at", null);

  // Calculate stats
  const stats = calculateStats(data);

  return <StatusPipeline stats={stats} />;
}
```

```typescript
// src/components/work/invoices-table.tsx
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function InvoicesTable() {
  const companyId = await getActiveCompanyId();
  const supabase = await createClient();

  // Fetch only recent invoices (100 records)
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(100);

  return <InvoicesTableClient invoices={invoices} />;
}
```

---

## 🎯 Performance Comparison

### Without PPR (Current)
```
User clicks link
  ↓
Wait for auth check (200ms)
  ↓
Wait for data fetch (2-4s)
  ↓
Page renders (4-6s total)
```

### With PPR (Optimized)
```
User clicks link
  ↓
Static shell renders instantly (5-20ms) ⚡
  ↓
Auth check + data fetch in parallel (200ms)
  ↓
Content streams in (100-300ms)
  ↓
Complete page (300-500ms total) ⚡⚡⚡
```

---

## 📊 Expected Performance

| Metric | Without PPR | With PPR | Improvement |
|--------|-------------|----------|-------------|
| **Time to First Byte** | 200-500ms | 5-20ms | **10-100x faster** |
| **First Contentful Paint** | 4-6s | 5-20ms | **200-1200x faster** |
| **Largest Contentful Paint** | 4-6s | 100-300ms | **13-60x faster** |
| **Time to Interactive** | 4-6s | 300-500ms | **8-20x faster** |

---

## 🔥 Advanced Patterns

### 1. Progressive Enhancement

```typescript
// Load critical data first, then enhance
export default function DashboardPage() {
  return (
    <DashboardShell>
      {/* Critical data - loads first */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Less critical - loads after */}
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardCharts />
      </Suspense>

      {/* Least critical - loads last */}
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardActivity />
      </Suspense>
    </DashboardShell>
  );
}
```

### 2. Parallel Streaming

```typescript
// Multiple sections stream in parallel
export default function WorkPage() {
  return (
    <WorkShell>
      <div className="grid grid-cols-3 gap-6">
        {/* All three stream in parallel */}
        <Suspense fallback={<Skeleton />}>
          <JobsSection />
        </Suspense>

        <Suspense fallback={<Skeleton />}>
          <InvoicesSection />
        </Suspense>

        <Suspense fallback={<Skeleton />}>
          <ScheduleSection />
        </Suspense>
      </div>
    </WorkShell>
  );
}
```

### 3. Nested Suspense

```typescript
// Fine-grained streaming control
export default function InvoicesPage() {
  return (
    <InvoicesShell>
      <Suspense fallback={<StatsSkeleton />}>
        <InvoicesStats />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <InvoicesTable>
          {/* Nested suspense for table rows */}
          <Suspense fallback={<RowSkeleton />}>
            <InvoiceRows />
          </Suspense>
        </InvoicesTable>
      </Suspense>
    </InvoicesShell>
  );
}
```

---

## 🎨 Loading States

### Beautiful Skeletons

```typescript
// src/components/ui/skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  );
}

// Usage
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-8 w-32" />
          <Skeleton className="mt-2 h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
```

---

## 🔧 Migration Plan

### Phase 1: Enable PPR (5 minutes)
```typescript
// next.config.ts
export default {
  experimental: {
    ppr: true,
  },
};
```

### Phase 2: Split Components (1-2 hours)
1. Extract static shells
2. Make data-fetching components async
3. Add Suspense boundaries

### Phase 3: Add Skeletons (1 hour)
1. Create skeleton components
2. Match exact layout of real components
3. Add smooth animations

### Phase 4: Test & Optimize (30 minutes)
1. Test all pages
2. Measure performance
3. Adjust Suspense boundaries

---

## 📈 Benefits

### For Users
- ⚡ **Instant page loads** (5-20ms)
- 🎨 **Beautiful loading states**
- 🚀 **Progressive enhancement**
- 📱 **Better mobile experience**

### For Developers
- 🧩 **Simpler code** (no caching complexity)
- 🔄 **Real-time data** (no stale cache)
- 🎯 **Fine-grained control** (Suspense boundaries)
- 🐛 **Easier debugging** (clear data flow)

### For Business
- 💰 **Lower server costs** (static shells cached at edge)
- 📊 **Better SEO** (instant first paint)
- 😊 **Higher conversion** (faster = more sales)
- 🌍 **Global performance** (edge caching)

---

## 🎯 Summary

**Without PPR:**
- ❌ 4-6 second page loads
- ❌ Complex caching logic
- ❌ Stale data issues
- ❌ Poor perceived performance

**With PPR:**
- ✅ 5-20ms initial load
- ✅ Real-time data
- ✅ Simple code
- ✅ Amazing UX

**PPR is the future of Next.js - and it's available now!** 🚀

---

## 📚 Resources

- [Next.js PPR Docs](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [Streaming SSR](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)

