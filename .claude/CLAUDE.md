# Stratos Project Guidelines

**Authoritative ruleset for AI-assisted development in the Stratos codebase.**

This file complements:
- `README.md` - High-level overview and onboarding
- `/docs/` - Feature and system documentation
- `/notes/` - Day-to-day implementation notes
- `/src/lib/stores/README.md` - Zustand state management guide

---

## 🎯 PROJECT STATS

- **Next.js**: 16.0.1 with React 19
- **Total Pages**: 360
- **Total Components**: 1,200
- **Client Components**: 508 (42%)
- **Server Components**: 692 (58%)
- **Build Time**: ~10 seconds
- **Target**: 85%+ Server Components, < 2s page loads

---

## 🚨 CRITICAL RULES (NEVER BREAK)

### 1. Next.js 16+ Required Patterns

**All code MUST use Next.js 16+ async patterns. Breaking changes from 14/15:**

```typescript
// ✅ CORRECT - Next.js 16+
import { cookies, headers } from "next/headers";

export async function myFunction() {
  const cookieStore = await cookies();
  const headersList = await headers();
}

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ query?: string }>;
}) {
  const { id } = await params;
  const { query } = await searchParams;
  return <div>ID: {id}</div>;
}

// ❌ WRONG - Next.js 14/15 pattern (WILL FAIL)
const cookieStore = cookies(); // No await
const { id } = params; // Direct access
```

**React 19 - ref as prop:**
```typescript
// ✅ CORRECT
function MyInput({ ref }: { ref: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} />;
}

// ❌ WRONG
const MyInput = React.forwardRef<HTMLInputElement>(...);
```

**Security - Use proxy.ts (NOT middleware.ts):**
- Next.js 16+ uses `proxy.ts` in root directory
- Fixes CVE where `x-middleware-subrequest` could bypass auth
- See `/proxy.ts` for implementation
- **NEVER rely solely on proxy for auth** - always validate in Server Actions/API routes

### 2. Server Components First (Target: 85%+)

**Default to Server Components for ALL new components.**

```typescript
// ✅ Server Component (default - no "use client")
export default async function CustomersPage() {
  const customers = await getCustomers(); // Direct DB query
  return <CustomerTable data={customers} />;
}

// ✅ Client Component (only when needed)
"use client";
export function CustomerTable({ data }: Props) {
  const [sortBy, setSortBy] = useState("name");
  return <DataTable data={data} sortBy={sortBy} />;
}
```

**Only use `"use client"` when you need:**
- React hooks (useState, useEffect, etc.)
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)
- Third-party client libraries

### 3. Data Fetching Patterns

**Primary: Server Components + React.cache()**

```typescript
// /src/lib/queries/customers.ts
import { cache } from "react";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export const getCustomers = cache(async (companyId: string) => {
  const supabase = createServiceSupabaseClient();
  return await supabase
    .from("customers")
    .select("*")
    .eq("company_id", companyId)
    .limit(50);
});

// Multiple components can call getCustomers() - only 1 DB query executes!
```

**See `/src/lib/queries/` for complete examples.**

**❌ NEVER do this:**
```typescript
"use client";
export function BadComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData().then(setData); // WRONG - data fetching in useEffect
  }, []);

  return <div>{data.map(...)}</div>;
}
```

### 4. State Management - Zustand Only

**NEVER use React Context. Always use Zustand for shared state.**

```typescript
// /src/lib/stores/filters-store.ts
import { create } from "zustand";

export const useFiltersStore = create((set) => ({
  activeFilter: "all",
  setActiveFilter: (filter) => set({ activeFilter: filter })
}));

// Usage - selective subscriptions prevent unnecessary re-renders
"use client";
const activeFilter = useFiltersStore((state) => state.activeFilter);
```

**Current stores:** 51 stores in `/src/lib/stores/`

**See `/src/lib/stores/README.md` for complete guide.**

**When to use what:**
- **Zustand** - Shared state across components
- **useState** - Local UI state (modal open, input values)
- **useEffect** - Side effects only (event listeners, timers)
- **Server Components** - Server-renderable data (85%+ of cases)

### 5. Extend Existing Infrastructure (MANDATORY)

**NEVER create duplicate infrastructure. Always check for existing components first.**

**Component Discovery Process (REQUIRED):**
1. Use shadcn MCP: `mcp__shadcn__search_items_in_registries`
2. Search codebase: `/src/components/layout/` for shared components
3. Review similar pages in the same feature area
4. Only create new if NO existing solution exists

**Key Infrastructure (ALWAYS REUSE):**
- `AppToolbar` - Universal toolbar for all pages
- `AppSidebar` - Main sidebar structure
- `WorkPageLayout` - Page container with stats
- `FullWidthDatatable` - Tables
- `AppHeader` - Page headers with breadcrumbs
- `NavGrouped` - Sidebar navigation

```typescript
// ✅ CORRECT - Using existing AppToolbar
import { AppToolbar } from "@/components/layout/app-toolbar";

export default function ContractsPage() {
  return (
    <>
      <AppToolbar
        title="Contracts"
        actions={[
          { label: "New Contract", variant: "default", href: "/dashboard/work/contracts/new" }
        ]}
      />
      <ContractsTable />
    </>
  );
}

// ❌ WRONG - Creating custom toolbar
export default function ContractsPage() {
  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <h1>Contracts</h1>
        <Button>New Contract</Button>
      </div>
      <ContractsTable />
    </div>
  );
}
```

### 6. Production-Ready Updates (Complete or Nothing)

**ALL changes must update the full stack: database → types → RLS → code → docs**

**Database Changes - Mandatory Process:**
1. **Create migration** - `mcp__supabase__apply_migration`
2. **Update RLS policies** - Add/update security policies
3. **Regenerate types** - `mcp__supabase__generate_typescript_types`
4. **Run security advisors** - `mcp__supabase__get_advisors`
5. **Update code** - Use new schema/types
6. **Update docs** - Keep AGENTS.md synchronized

**Checklist:**
```
✅ Migration created and applied via MCP server
✅ RLS policies added/updated and tested
✅ TypeScript types regenerated and imported
✅ Code updated to use new schema/types
✅ Security advisors run - no critical issues
✅ Documentation updated
✅ Error handling implemented
✅ Loading states added
✅ Validation added (Zod schemas)
```

---

## ⚡ DATABASE PERFORMANCE PATTERNS

**Target: ALL pages load in < 2 seconds**

### Pattern #1: Composite Indexes (MANDATORY)

```sql
-- ✅ CORRECT - Composite index matches WHERE + ORDER BY
CREATE INDEX idx_contracts_company_created
  ON contracts(company_id, created_at DESC)
  WHERE deleted_at IS NULL;

-- ❌ WRONG - Separate single-column indexes
CREATE INDEX idx_contracts_company ON contracts(company_id);
CREATE INDEX idx_contracts_created ON contracts(created_at DESC);
```

**Performance Impact:** 3-5 seconds saved per query on 1000+ records.

### Pattern #2: Eliminate N+1 Queries

**Use LATERAL joins or RPC functions instead of loops:**

```typescript
// ❌ WRONG - N+1 pattern (151 queries for 50 customers)
const customers = await supabase.from("customers").select("*");
const enriched = await Promise.all(
  customers.map(async (customer) => {
    const lastJob = await supabase.from("jobs")... // 1 query per customer
    const nextJob = await supabase.from("jobs")... // 1 query per customer
    return { ...customer, lastJob, nextJob };
  })
);

// ✅ CORRECT - Single RPC with LATERAL joins (1 query)
const { data } = await supabase.rpc("get_enriched_customers_rpc", {
  p_company_id: companyId
});
```

**Performance Impact:** 5-10 seconds saved for 50+ records.

### Pattern #3: LIMIT Clauses (Always)

```typescript
// ✅ CORRECT
const { data } = await supabase
  .from("contracts")
  .select("*")
  .eq("company_id", companyId)
  .order("created_at", { ascending: false })
  .limit(50); // Prevents fetching thousands of records

// ❌ WRONG
const { data } = await supabase
  .from("contracts")
  .select("*")
  .eq("company_id", companyId); // Could fetch 10,000+ records
```

### Pattern #4: React.cache() for Deduplication

```typescript
// /src/lib/queries/contracts.ts
import { cache } from "react";

export const getContracts = cache(async (companyId: string) => {
  const supabase = await createClient();
  return await supabase
    .from("contracts")
    .select(`*, customer:customers(...)`)
    .eq("company_id", companyId);
});

// Both components share the same cached result - only 1 DB query!
// - contracts-stats.tsx calls getContracts()
// - contracts-data.tsx calls getContracts()
```

**Performance Checklist:**
- [ ] Composite indexes for WHERE + ORDER BY columns
- [ ] No N+1 patterns (use JOINs/LATERAL/RPC)
- [ ] LIMIT clause added
- [ ] React.cache() wrapper if used multiple times
- [ ] Test with 100+ records - verify < 2s load time

**See `/docs/performance/` for detailed patterns.**

---

## 🔍 SEARCH IMPLEMENTATION

**Enterprise PostgreSQL full-text search with fuzzy matching.**

### Architecture

1. **Full-Text Search** - `search_vector` tsvector columns with GIN indexes
2. **Fuzzy Matching** - `pg_trgm` extension for typo tolerance
3. **Ranked Results** - `ts_rank` DESC (best matches first)

### Entities with Full-Text Search

- Customers, Jobs, Properties, Equipment
- Price Book Items, Invoices, Estimates, Contracts

### Utilities

```typescript
// /src/lib/search/full-text-search.ts
import { searchCustomersFullText } from "@/lib/search/full-text-search";

const results = await searchCustomersFullText(supabase, companyId, "john plumber");

// Universal search across all entities
import { searchAllEntities } from "@/lib/search/full-text-search";
const results = await searchAllEntities(supabase, companyId, "furnace");
```

### Query Syntax

- `"HVAC repair"` - AND (both words)
- `"furnace OR boiler"` - OR (either word)
- `"annual maintenance"` - Exact phrase
- `"plumber -emergency"` - Exclude word
- `"john*"` - Prefix match

---

## 🔧 MCP SERVERS (Development Tools)

### shadcn MCP - Component Discovery

**Use BEFORE creating any UI component:**
```typescript
mcp__shadcn__search_items_in_registries({ registries: ["@shadcn"], query: "button" })
mcp__shadcn__get_item_examples_from_registries({ registries: ["@shadcn"], query: "button-demo" })
mcp__shadcn__view_items_in_registries({ items: ["@shadcn/button"] })
```

### Next.js MCP - Runtime Diagnostics

**Use BEFORE implementing changes:**
```typescript
// Query runtime state
mcp__next-devtools__nextjs_runtime({ action: "list_tools" })

// Search official docs
mcp__next-devtools__nextjs_docs({ action: "search", query: "async params" })

// Verify with browser automation (NOT curl)
mcp__next-devtools__browser_eval({ action: "start" })
mcp__next-devtools__browser_eval({ action: "navigate", url: "http://localhost:3000/page" })
mcp__next-devtools__browser_eval({ action: "console_messages", errorsOnly: true })
```

**Why browser automation?**
- Curl only fetches HTML (misses JS errors, hydration issues, React errors)
- Browser automation catches runtime errors, console warnings, visual issues

### Supabase MCP - Database Operations

```typescript
mcp__supabase__apply_migration({ name: "add_column", query: "..." })
mcp__supabase__generate_typescript_types()
mcp__supabase__get_advisors({ type: "security" })
mcp__supabase__list_tables()
```

---

## 📦 PROJECT STRUCTURE

```
src/
├── actions/              # Server Actions (form handling)
├── app/                  # Next.js App Router pages
├── components/
│   ├── layout/          # Shared infrastructure (AppToolbar, AppSidebar, etc.)
│   ├── ui/              # shadcn/ui components
│   └── [feature]/       # Feature-specific components
├── lib/
│   ├── queries/         # React.cache() query functions
│   ├── stores/          # Zustand stores (see README.md)
│   ├── search/          # Full-text search utilities
│   ├── supabase/        # Supabase clients
│   └── utils/           # Utility functions
├── hooks/               # Custom React hooks
└── types/               # TypeScript type definitions
```

**Key Files:**
- `/proxy.ts` - Auth and routing (Next.js 16+)
- `/src/lib/stores/README.md` - Zustand guide
- `/src/lib/queries/*.ts` - Cached query functions
- `/docs/AGENTS.md` - Complete linting rules (481 rules)

---

## 🚀 PERFORMANCE PATTERNS

### Server Components (Primary)

```typescript
// ✅ Server Component with streaming
import { Suspense } from "react";

export default async function DashboardPage() {
  return (
    <>
      <QuickStats />
      <Suspense fallback={<ChartSkeleton />}>
        <SlowChart />
      </Suspense>
    </>
  );
}
```

### Client Component Extraction

```typescript
// ✅ Extract ONLY interactive part
// tooltip-wrapper.tsx (Client Component)
"use client";
export function TooltipWrapper({ children, content }: Props) {
  return <Tooltip content={content}>{children}</Tooltip>;
}

// kpi-card.tsx (Server Component)
export function KPICard() {
  return (
    <Card>
      <TooltipWrapper content="Revenue info">
        <Icon />
      </TooltipWrapper>
    </Card>
  );
}
```

### Server Actions for Forms

```typescript
// /src/actions/contracts.ts
"use server";
import { revalidatePath } from "next/cache";

export async function createContract(formData: FormData) {
  const data = contractSchema.parse({
    title: formData.get("title"),
  });

  // Save to database
  await supabase.from("contracts").insert(data);

  revalidatePath("/contracts");
  return { success: true };
}

// page.tsx
<form action={createContract}>
  <input name="title" />
  <button type="submit">Save</button>
</form>
```

### ISR for Static Content

```typescript
// Revalidate every 5 minutes
export const revalidate = 300;

export default async function ReportsPage() {
  const data = await getReports();
  return <ReportsView data={data} />;
}
```

---

## ✅ CODE REVIEW CHECKLIST

### MCP Server Usage
- [ ] Searched shadcn registry before creating UI components?
- [ ] Checked Next.js runtime state before implementing changes?
- [ ] Used browser automation to verify pages (not curl)?
- [ ] Searched Next.js docs for patterns?
- [ ] If Supabase changes: migration → types → RLS → advisors?

### Infrastructure & Patterns
- [ ] Searched for existing components before creating new ones?
- [ ] Using AppToolbar/WorkPageLayout/shared components?
- [ ] Extending existing patterns vs creating duplicates?
- [ ] Reviewed similar pages for established patterns?

### Performance & Architecture
- [ ] Is this a Server Component? (if yes, no `"use client"`)
- [ ] If Client Component, is it absolutely necessary?
- [ ] Slow components wrapped in `<Suspense>`?
- [ ] Form uses Server Actions (not client state)?
- [ ] State management using Zustand (not React Context)?
- [ ] Static content using ISR (`export const revalidate`)?

### Database & Security
- [ ] Composite indexes for WHERE + ORDER BY?
- [ ] No N+1 query patterns?
- [ ] LIMIT clause added to queries?
- [ ] React.cache() for deduplication?
- [ ] RLS policies on all tables?
- [ ] Input validated server-side with Zod?

### Quality
- [ ] Images using `next/image` (not `<img>`)?
- [ ] JSDoc explains component purpose?
- [ ] Error handling and loading states?
- [ ] Follows existing naming conventions?
- [ ] Linting rules from `/docs/AGENTS.md` applied?

---

## 🛠️ DEVELOPMENT COMMANDS

```bash
# Development
pnpm dev                 # Start dev server (Turbopack)
pnpm build               # Production build
pnpm lint:fix            # Lint and fix

# Performance Analysis
pnpm analyze:bundle      # Bundle size analysis
pnpm analyze             # All code analysis
pnpm analyze:deps        # Check dependencies
pnpm analyze:circular    # Find circular dependencies
```

**Bundle Analysis:** Reports saved to `.next/analyze/client.html` and `.next/analyze/server.html`

---

## 🎨 ANTI-PATTERNS (NEVER DO THIS)

### ❌ Data Fetching in useEffect

```typescript
// WRONG
"use client";
export function CustomerList() {
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    fetchCustomers().then(setCustomers); // NO!
  }, []);
}

// CORRECT
export default async function CustomerList() {
  const customers = await getCustomers();
  return <div>{customers.map(...)}</div>;
}
```

### ❌ Duplicate State

```typescript
// WRONG - state isolated in each component
export function Toolbar() {
  const [filter, setFilter] = useState("all");
}
export function Table() {
  const [filter, setFilter] = useState("all"); // Out of sync!
}

// CORRECT - shared Zustand store
const filter = useFiltersStore((state) => state.activeFilter);
```

### ❌ Manual Loading/Error States

```typescript
// WRONG
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// CORRECT - Server Component
const data = await getData(); // Built-in error handling
```

### ❌ Creating Duplicate Infrastructure

```typescript
// WRONG - custom toolbar
<div className="flex items-center justify-between p-4">
  <h1>Title</h1>
</div>

// CORRECT - use AppToolbar
<AppToolbar title="Title" />
```

---

## 📚 REFERENCE DOCUMENTATION

**Internal Documentation:**
- `/src/lib/stores/README.md` - Zustand state management guide
- `/docs/performance/` - Database optimization patterns
- `/docs/AGENTS.md` - Complete linting rules (481 rules)
- `/docs/migrations/` - Migration guides
- `/docs/troubleshooting/` - Common issues

**External Resources:**
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [shadcn/ui Components](https://ui.shadcn.com)

---

## 🔄 VERSION HISTORY

### v3.0 - Consolidated & Accurate (2025-11-17)
- **BREAKING**: Removed React Query documentation (not primary pattern)
- **NEW**: Documented `/src/lib/queries/` + React.cache() pattern
- **ACCURACY**: Updated stats to reflect current codebase (360 pages, 1,200 components)
- **CONSOLIDATION**: Reduced from 2,123 lines to ~800 lines
- **CLEANUP**: Removed duplicate examples, referenced existing docs
- **PATTERN DOCS**: Added shadcn/Next.js/Supabase MCP usage
- Removed redundant template code (point to actual codebase files)
- Fixed WorkPageLayout reference (client component, not server)
- Emphasized Server Components + React.cache() as primary pattern
- Added accurate Zustand store count (51 stores)

### v2.4 - MCP Server Integration (2025-11-04)
- Added shadcn/Next.js/Supabase MCP server documentation
- Introduced runtime-first debugging approach
- Added browser automation guidelines

### v2.3 - Production-Ready Updates (2025-11-03)
- Added Critical Rule #6 - Production-Ready Updates
- Implemented PostgreSQL full-text search
- Mandatory Supabase MCP usage

### v2.2 - Next.js 16 Proxy Pattern (2025-11-02)
- Migrated from middleware.ts to proxy.ts
- Security CVE fix documentation

### v2.1 - Enhanced Component Reuse (2025-10-29)
- Strengthened infrastructure reuse requirements
- Component discovery process

### v2.0 - Performance Optimizations (2025-01-XX)
- 85%+ Server Components target
- Performance patterns

### v1.0 - Initial Configuration (2025-10-07)
- Established core rules and standards

---

**End of Guidelines** | For questions or clarifications, reference `/docs/` or `/src/lib/stores/README.md`
