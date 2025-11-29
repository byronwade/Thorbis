# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

- **Monorepo name**: `stratos-monorepo`
- **Package manager**: `pnpm` (with Turborepo)
- **Apps**:
  - `apps/web` – main customer-facing app (Next.js 16.0.4, React 19)
  - `apps/admin` – internal admin app (Next.js 16.0.1, React 19)
- **Shared packages** (imported as `@stratos/*`): `auth`, `database`, `ui`, `shared`, `config`
- Primary documentation lives in `docs/` (see `docs/README.md` for the index).
- Authoritative AI/agent rules live in `docs/AGENTS.md` and `.claude/CLAUDE.md`. Treat those as higher precedence than this file when they conflict.

## High-Level Architecture

### 1. Web App (`apps/web`)

**Purpose**: Main field service management product ("Thorbis"), including scheduling, CRM, communications, billing, and analytics.

**Key structure (big picture):
- `apps/web/src/app/` – Next App Router (routes, layouts, route groups, API routes)
  - Route groups such as `(dashboard)` and `(marketing)` separate authenticated vs public surfaces.
  - Uses `proxy.ts` **at app root** (`apps/web/proxy.ts`) for Next 16+ auth/routing instead of `middleware.ts`.
- `apps/web/src/components/`
  - `layout/` – shared layout infrastructure (e.g. `AppToolbar`, `AppSidebar`, `WorkPageLayout`, navigation shell). **Reuse these instead of building new page chrome.**
  - `ui/` – shadcn/ui primitives and low-level UI building blocks.
  - `features/` – feature-specific components organized by domain (customers, jobs, billing, etc.).
- `apps/web/src/lib/`
  - `queries/` – server-side data access utilities, typically wrapped in `React.cache()` for deduped fetching across Server Components.
  - `stores/` – **Zustand-only** state stores (see `apps/web/src/lib/stores/README.md`). One focused store per feature; no React Context for app state.
  - `search/` – PostgreSQL full-text + trigram search helpers (tsvector + `ts_rank`), used for entity search and global search.
  - `supabase/` – Supabase client wiring and helpers (service client vs RLS-protected client).
  - `utils/`, `analytics/`, `billing/`, etc. – cross-cutting utilities.
- `apps/web/src/actions/` – Next.js **Server Actions** for mutations and multi-step workflows; these are the preferred way to handle form submissions and authenticated writes.
- `apps/web/src/hooks/` – client-only React hooks.
- `apps/web/src/types/` – shared TypeScript types.
- `apps/web/src/test/` – Vitest setup lives at least in `src/test/setup.ts` (referenced from `vitest.config.mts`).

**Data & state patterns:**
- **Server Components first**: render data in Server Components wherever possible; add `"use client"` only for interactive islands, hooks, or browser APIs.
- **Data fetching**: prefer server-side queries via `apps/web/src/lib/queries/*` using `React.cache()`; avoid fetching in `useEffect`.
- **State management**: all cross-component state goes through Zustand stores in `apps/web/src/lib/stores/`; React Context for app state is explicitly disallowed.
- **Search**: use the full-text search helpers in `apps/web/src/lib/search/full-text-search.ts` and related utilities, which assume Supabase/Postgres search vector columns and ranking.
- **Security**: database access is expected to respect RLS; high-level security and Supabase rules are documented in `docs/AGENTS.md` and `docs/database/*`.

### 2. Admin App (`apps/admin`)

**Purpose**: Internal admin and support tooling (company management, support sessions, analytics, "view-as" behavior, etc.). Only target this app when a feature is admin-only.

**Structure highlights:**
- `apps/admin/src/app/` – App Router for admin-specific pages.
- `apps/admin/src/components/` – admin-only UI and layout.
- `apps/admin/src/lib/` – admin utilities and Zustand stores.
- `apps/admin/src/middleware.ts` – legacy middleware-based auth/routing (admin only; web app uses `proxy.ts`).

### 3. Shared Packages (`packages/*`)

Used by both apps via workspace imports like `@stratos/ui`:
- `packages/ui` – reusable UI components shared across apps.
- `packages/auth` – authentication helpers and Supabase-auth integration.
- `packages/database` – database client and generated types; test aliasing in Vitest points back here.
- `packages/shared` – shared business logic and utilities.
- `packages/config` – shared configuration.

Prefer implementing cross-app concerns here instead of duplicating logic inside `apps/web` and `apps/admin`.

### 4. Documentation & Scripts

- `docs/README.md` – entry point for all documentation. Key sub-areas:
  - `docs/architecture/` – overall system and layout architecture.
  - `docs/performance/` & `docs/optimization/` – performance budgets, bundle size targets, and optimization strategies.
  - `docs/database/` – Supabase/Drizzle notes, assessments, and quick starts.
  - `docs/status/` & `docs/troubleshooting/` – implementation status and known issues.
- `docs/AGENTS.md` – very large, authoritative rule set for linting, performance, security, Supabase usage, and MCP tools.
- `.claude/CLAUDE.md` – higher-level AI development guidelines with an accurate monorepo map and concrete examples.
- `.cursor/rules/*.mdc` – additional lint/style and architecture guidance that is already enforced by tooling; prefer aligning with these rather than re-inventing patterns.
- `scripts/` – utility scripts organized by domain:
  - `scripts/database/` – seeding, RLS application, DB checks.
  - `scripts/setup/` – Stripe and billing setup, webhook registration.
  - `scripts/migration/` – one-off codebase migrations (ISR, settings wiring, etc.).
  - `scripts/testing/` – manual integration checks (e.g. Stripe payment test).
  - `scripts/cleanup/`, `scripts/maintenance/` – cleanup and maintenance helpers.

Use `pnpm tsx` (for `.ts`) or `node`/`bash`/`pwsh` as described in `scripts/README.md` when you need to run these scripts.

## Commands & Workflows

### 1. Root (Monorepo) Commands

Run these from the repo root:

- **Dev**
  - `pnpm dev` – run all apps in dev mode via Turborepo.
  - `pnpm dev:web` – dev server for `apps/web` only.
  - `pnpm dev:admin` – dev server for `apps/admin` only.
- **Build**
  - `pnpm build` – build all apps and packages.
  - `pnpm build:web` – build `apps/web` only.
  - `pnpm build:admin` – build `apps/admin` only.
- **Quality**
  - `pnpm lint` – lint all workspaces.
  - `pnpm typecheck` – typecheck all workspaces.
- **Maintenance**
  - `pnpm clean` – Turborepo clean + remove root `node_modules`.
  - `pnpm format` / `pnpm format:check` – Prettier formatting.

> From `docs/AGENTS.md`: avoid starting dev servers or running heavy builds automatically. Prefer suggesting these commands and only executing them when the user explicitly asks.

### 2. Web App (`apps/web`) Commands

Run from `apps/web` when working specifically on the main app:

- **Dev & Build**
  - `pnpm dev` – Next dev server (port 3000 by default).
  - `pnpm dev:clean` – delete `.next` then start the dev server (useful after big dependency or branch changes).
  - `pnpm build` – production build (Next.js, with increased memory via `NODE_OPTIONS`).
  - `pnpm build:analyze` – production build with bundle analyzer enabled.
- **Quality**
  - `pnpm lint` – run Next/ESLint.
  - `pnpm lint:fix` – lint with `--fix`.
  - `pnpm typecheck` – TypeScript `tsc --noEmit` for the web app.
- **Tests (Vitest)**
  - `pnpm test` – run Vitest in watch/interactive mode.
  - `pnpm test:run` – run the full Vitest suite once (CI-style).
  - `pnpm test:coverage` – run tests with coverage (limited to key lib areas per `vitest.config.mts`).

**Running a single test or subset (Vitest):**
- By file path (relative to `apps/web`):
  - `pnpm test src/lib/billing/invoices.test.ts` – run a single test file.
- By test name pattern:
  - `pnpm test src/lib/billing/invoices.test.ts -t "creates invoice with tax"`

Vitest is configured in `apps/web/vitest.config.mts` to:
- Look for tests under `src/**/*.test.ts` and `src/**/*.test.tsx`.
- Use the `node` test environment with global APIs.
- Use `apps/web/src/test/setup.ts` as a shared test setup file.
- Provide coverage reports for key billing and analytics libraries.

### 3. Admin App (`apps/admin`) Commands

Run from `apps/admin` when working on the admin surface:

- `pnpm dev` – admin dev server on **port 3001**.
- `pnpm build` – production build of the admin app.
- `pnpm start` – start the built admin app on port 3001.
- `pnpm lint` – Next/ESLint for admin.
- `pnpm typecheck` – TypeScript `tsc --noEmit` for admin.

There is currently no dedicated Jest/Vitest config in `apps/admin`; most tests live under `apps/web`.

### 4. Scripts

See `scripts/README.md` for detailed usage. Common patterns:

- **Database seeding / checks** (from repo root):
  - `pnpm tsx scripts/database/seed-database.ts`
  - `pnpm tsx scripts/database/check-duplicate-memberships.ts`
- **Stripe and billing setup**:
  - `pnpm tsx scripts/setup/setup-billing-portal.ts`
  - `pnpm tsx scripts/setup/setup-stripe-webhooks.ts`
- **Migration and refactors**:
  - `node scripts/migration/add-isr-to-remaining-pages.js`
  - `bash scripts/migration/fix-zustand-ssr.sh`
- **Testing helpers**:
  - `pnpm tsx scripts/testing/test-stripe-payment.ts`

Confirm environment variables and Supabase/Stripe credentials are configured before running any of these.

## Project-Specific Rules for Agents

These summarize the most important rules from `docs/AGENTS.md`, `.claude/CLAUDE.md`, and `.cursor/rules/*`. When in doubt, go read those files directly.

### 1. Next.js & React Patterns

- **Next.js 16 async APIs**: `cookies()` and `headers()` must be `await`-ed; route `params` and `searchParams` are often `Promise`-wrapped and must be awaited in App Router components (see `.claude/CLAUDE.md` examples).
- Prefer **Server Components** by default; use Client Components only when you truly need interactivity, hooks, or browser APIs.
- Use **Server Actions** for form submissions and data mutations instead of ad-hoc API routes where possible.
- Web app routing/auth uses `apps/web/proxy.ts` instead of `middleware.ts`; admin app still uses `apps/admin/src/middleware.ts`.

### 2. State Management

- **Do not introduce new React Context providers** for application or domain state.
- Use **Zustand** stores under `apps/web/src/lib/stores/` (and `apps/admin/src/lib/stores/` for admin) following the feature-based, one-store-per-domain pattern.
- Stores should be small, typed, and focused; use selectors to avoid unnecessary re-renders.

### 3. Data, Database, and Supabase

- Treat Supabase/Postgres as the source of truth; RLS must remain enabled and correct on all tables.
- For **schema changes**, follow the Supabase MCP flow from `docs/AGENTS.md` / `.claude/CLAUDE.md` instead of hand-editing SQL:
  - `mcp__supabase__apply_migration` → `mcp__supabase__generate_typescript_types` → `mcp__supabase__get_advisors` → update code → update docs.
- For **search**, prefer the full-text + trigram utilities in `apps/web/src/lib/search/` (which assume `search_vector` columns and `ts_rank` ordering) instead of writing ad-hoc `ILIKE` queries.

### 4. UI & Components

- Reuse existing layout and shell components from `apps/web/src/components/layout/` (e.g. `AppToolbar`, `WorkPageLayout`, `AppSidebar`, `AppHeader`) rather than rebuilding toolbars, headers, and sidebars from scratch.
- Before adding new primitive UI components, prefer shadcn/ui and shared components from `@stratos/ui`.
- The `.cursor/rules` and `docs/AGENTS.md` files encode an extensive set of accessibility and styling rules (ARIA, tabIndex, button types, Tailwind usage, etc.). New components should naturally conform to these; consult those files if you see lints you don’t recognize.

### 5. Performance & Security Expectations

- Client bundles should remain small; aggressively prefer Server Components, streaming (`Suspense`), and code splitting (dynamic imports) as already demonstrated in `docs/` and `.claude/CLAUDE.md`.
- Follow the database performance patterns in `.claude/CLAUDE.md` and `docs/performance/` (composite indexes, LIMIT clauses, eliminating N+1, using `React.cache()` for deduped queries).
- All user input must be validated server-side (usually with Zod) and respect RLS; **never** rely solely on client-side validation.

### 6. Operational Constraints for Warp

- `docs/AGENTS.md` explicitly instructs agents **not to run dev servers or heavy builds without explicit user permission**. In Warp, prefer to:
  - Suggest `pnpm dev`, `pnpm build`, etc., instead of running them unprompted.
  - Only execute long-running or potentially disruptive commands when the user asks you to.
- Treat all changes as production-critical: when modifying features that touch data, consider whether schema, RLS, types, and docs also need to be updated and call this out to the user.

---

Use this file to get oriented, but always cross-check details in `docs/AGENTS.md`, `.claude/CLAUDE.md`, and the `docs/` subtree when making non-trivial architectural or data-related changes.
