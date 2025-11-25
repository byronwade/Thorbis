# Loading States Guide

**Comprehensive guide to implementing consistent loading states across the Stratos application.**

## Table of Contents

1. [Overview](#overview)
2. [Loading State Types](#loading-state-types)
3. [Implementation Patterns](#implementation-patterns)
4. [Component Reference](#component-reference)
5. [Best Practices](#best-practices)
6. [Examples](#examples)

---

## Overview

Stratos uses a standardized loading state system to provide:
- **Consistent UX** across all pages and components
- **No layout shifts** (skeleton dimensions match actual content)
- **Fast perceived performance** (instant skeleton rendering)
- **Accessibility** (proper ARIA labels and screen reader text)

### Core Principles

1. **Use skeletons for structural loading** (pages, tables, forms)
2. **Use spinners for inline loading** (buttons, small updates)
3. **Match skeleton dimensions to actual content** (prevent layout shift)
4. **Always provide screen reader feedback** (sr-only text or ARIA)

---

## Loading State Types

### 1. Page-Level Loading (Next.js loading.tsx)

**When to use:** Full page navigation, initial page load

**Location:** `/app/(dashboard)/dashboard/[route]/loading.tsx`

```tsx
// /app/(dashboard)/dashboard/work/invoices/loading.tsx
import { DataTableListSkeleton } from "@/components/ui/skeletons";

export default function InvoicesLoading() {
  return <DataTableListSkeleton />;
}
```

**Benefits:**
- Automatic Next.js 16 integration
- Instant skeleton display
- Streaming SSR support
- No code in page component

### 2. Component-Level Loading (Suspense Boundaries)

**When to use:** Slow data fetching, async components

```tsx
import { Suspense } from "react";
import { ChartSkeleton } from "@/components/ui/skeletons";

export default function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <SlowChart />
    </Suspense>
  );
}
```

### 3. Inline Loading (Spinners)

**When to use:** Button states, small updates, background operations

```tsx
import { Spinner } from "@/components/ui/spinner";

<Button disabled={isLoading}>
  {isLoading && <Spinner size="sm" />}
  Submit
</Button>
```

### 4. Overlay Loading (Blocking Operations)

**When to use:** File uploads, critical operations that block interaction

```tsx
import { SpinnerOverlay } from "@/components/ui/spinner";

{isUploading && <SpinnerOverlay text="Uploading files..." />}
```

---

## Implementation Patterns

### Pattern 1: List/Table Pages

**Use Case:** Jobs, Invoices, Customers, any table view

```tsx
// /app/(dashboard)/dashboard/work/jobs/loading.tsx
import { DataTableListSkeleton } from "@/components/ui/skeletons";

export default function JobsLoading() {
  return <DataTableListSkeleton rowCount={10} />;
}
```

**Options:**
- `rowCount`: Number of skeleton rows (default: 10)
- `showHeader`: Show page title/actions (default: true)
- `showSearchBar`: Show search input skeleton (default: false)

### Pattern 2: Detail Pages

**Use Case:** Job details, Customer profile, Invoice view

```tsx
// /app/(dashboard)/dashboard/work/jobs/[id]/loading.tsx
import { WorkDetailSkeleton } from "@/components/ui/skeletons";

export default function JobDetailsLoading() {
  return <WorkDetailSkeleton />;
}
```

**Options:**
- `showStats`: Stats bar at top (default: true)
- `leftSections`: Left column sections (default: 3)
- `rightSections`: Right column sections (default: 3)
- `showTabs`: Bottom tab interface (default: true)

### Pattern 3: Dashboard/Analytics

**Use Case:** Dashboards with KPIs and charts

```tsx
import { DashboardSkeleton } from "@/components/ui/skeletons";

export default function AnalyticsLoading() {
  return <DashboardSkeleton />;
}
```

### Pattern 4: Form Dialogs

**Use Case:** Modal forms, dialog forms

```tsx
import { FormSkeleton } from "@/components/ui/skeletons";

<Dialog>
  <DialogContent>
    {isLoading ? (
      <FormSkeleton fields={5} />
    ) : (
      <CreateInvoiceForm />
    )}
  </DialogContent>
</Dialog>
```

### Pattern 5: Card Grids

**Use Case:** Product grids, image galleries, card layouts

```tsx
import { CardListSkeleton } from "@/components/ui/skeletons";

{isLoading ? (
  <CardListSkeleton cards={9} columns={3} />
) : (
  <ProductGrid products={products} />
)}
```

---

## Component Reference

### Skeleton Components

**Location:** `/src/components/ui/skeletons.tsx`

#### DataTableListSkeleton

```tsx
<DataTableListSkeleton
  rowCount={10}
  showHeader={true}
  showSearchBar={false}
/>
```

#### WorkDetailSkeleton

```tsx
<WorkDetailSkeleton
  showStats={true}
  leftSections={3}
  rightSections={3}
  showTabs={true}
/>
```

#### DashboardSkeleton

```tsx
<DashboardSkeleton />
```

#### FormSkeleton

```tsx
<FormSkeleton
  fields={4}
  showActions={true}
/>
```

#### CardListSkeleton

```tsx
<CardListSkeleton
  cards={6}
  columns={3}
/>
```

#### PageHeaderSkeleton

```tsx
<PageHeaderSkeleton />
```

#### KPICardSkeleton

```tsx
<KPICardSkeleton />
```

#### ChartSkeleton

```tsx
<ChartSkeleton height="h-[300px]" />
```

#### TableSkeleton

```tsx
<TableSkeleton rows={5} />
```

### Spinner Components

**Location:** `/src/components/ui/spinner.tsx`

#### Spinner

```tsx
<Spinner
  size="sm" // xs | sm | md | lg | xl
  srText="Loading data..."
/>
```

#### SpinnerOverlay

```tsx
<SpinnerOverlay text="Processing..." />
```

---

## Best Practices

### ✅ DO

1. **Match skeleton dimensions to content**
   ```tsx
   // If your table shows 50 rows per page
   <DataTableListSkeleton rowCount={50} />
   ```

2. **Use loading.tsx for route segments**
   ```tsx
   // /app/invoices/loading.tsx
   export default function Loading() {
     return <DataTableListSkeleton />;
   }
   ```

3. **Provide screen reader feedback**
   ```tsx
   <Spinner srText="Saving invoice..." />
   ```

4. **Use Suspense for async components**
   ```tsx
   <Suspense fallback={<ChartSkeleton />}>
     <AsyncChart />
   </Suspense>
   ```

5. **Disable interactive elements during loading**
   ```tsx
   <Button disabled={isLoading}>
     {isLoading && <Spinner size="sm" />}
     Submit
   </Button>
   ```

### ❌ DON'T

1. **Don't use spinners for structural content**
   ```tsx
   // ❌ WRONG
   {isLoading ? <Spinner /> : <DataTable />}

   // ✅ CORRECT
   {isLoading ? <DataTableListSkeleton /> : <DataTable />}
   ```

2. **Don't create custom skeletons without checking existing ones**
   ```tsx
   // ❌ WRONG - duplicates existing component
   function MyTableSkeleton() { ... }

   // ✅ CORRECT - use existing
   <DataTableListSkeleton />
   ```

3. **Don't forget accessibility**
   ```tsx
   // ❌ WRONG
   <Loader2 className="animate-spin" />

   // ✅ CORRECT
   <Spinner srText="Loading data..." />
   ```

4. **Don't block without overlay**
   ```tsx
   // ❌ WRONG - users can still click
   {isLoading && <Spinner />}

   // ✅ CORRECT - blocks interaction
   {isLoading && <SpinnerOverlay />}
   ```

5. **Don't use loading states for instant operations**
   ```tsx
   // ❌ WRONG - unnecessary for <50ms operations
   const [show, setShow] = useState(false);
   setShow(prev => !prev); // Instant, no loading needed

   // ✅ CORRECT - use for async operations
   const [isLoading, setIsLoading] = useState(false);
   await api.createInvoice(); // Network request
   ```

---

## Examples

### Example 1: Table Page with Next.js Loading

```tsx
// /app/(dashboard)/dashboard/work/invoices/page.tsx
export default async function InvoicesPage() {
  const invoices = await getInvoices();
  return <InvoicesTable invoices={invoices} />;
}

// /app/(dashboard)/dashboard/work/invoices/loading.tsx
import { DataTableListSkeleton } from "@/components/ui/skeletons";

export default function InvoicesLoading() {
  return <DataTableListSkeleton />;
}
```

### Example 2: Form with Submit Button

```tsx
"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function CreateInvoiceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createInvoice(formData);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Spinner size="sm" />}
        Create Invoice
      </Button>
    </form>
  );
}
```

### Example 3: Dashboard with Suspense

```tsx
import { Suspense } from "react";
import {
  DashboardSkeleton,
  ChartSkeleton,
  TableSkeleton
} from "@/components/ui/skeletons";

export default function Dashboard() {
  return (
    <div>
      <Suspense fallback={<DashboardSkeleton />}>
        <QuickStats />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-3">
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />
        </Suspense>

        <Suspense fallback={<TableSkeleton rows={5} />}>
          <RecentJobs />
        </Suspense>
      </div>
    </div>
  );
}
```

### Example 4: File Upload with Overlay

```tsx
"use client";

import { useState } from "react";
import { SpinnerOverlay } from "@/components/ui/spinner";

export function FileUploadForm() {
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload(files) {
    setIsUploading(true);
    try {
      await uploadFiles(files);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="relative">
      {isUploading && <SpinnerOverlay text="Uploading files..." />}

      <input type="file" onChange={handleUpload} />
    </div>
  );
}
```

### Example 5: Detail Page with Custom Skeleton

```tsx
// /app/(dashboard)/dashboard/work/jobs/[id]/page.tsx
export default async function JobDetailsPage({ params }) {
  const { id } = await params;
  const job = await getJob(id);

  return <JobDetails job={job} />;
}

// /app/(dashboard)/dashboard/work/jobs/[id]/loading.tsx
import { WorkDetailSkeleton } from "@/components/ui/skeletons";

export default function JobDetailsLoading() {
  return (
    <WorkDetailSkeleton
      showStats={true}
      leftSections={4}
      rightSections={2}
      showTabs={true}
    />
  );
}
```

---

## Migration Checklist

If you're adding loading states to an existing component:

- [ ] Identify loading type (page/component/inline/overlay)
- [ ] Choose appropriate skeleton component
- [ ] Create loading.tsx for route segments
- [ ] Add Suspense boundaries for async components
- [ ] Replace custom loaders with standard components
- [ ] Test skeleton matches content dimensions
- [ ] Verify screen reader announces loading state
- [ ] Test with slow network (DevTools throttling)
- [ ] Confirm no layout shifts on load

---

## Related Documentation

- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [Skeleton Component API](/src/components/ui/skeleton.tsx)
- [Spinner Component API](/src/components/ui/spinner.tsx)

---

**Version:** 1.0
**Last Updated:** 2025-11-24
**Maintainer:** Development Team
