# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router with TypeScript, featuring a dual-database architecture, comprehensive tooling for code quality, state management, and AI workflows. The project uses a `/src` directory structure for scalability and organization.

## Tech Stack

- **Framework**: Next.js 16.0.0 (App Router) + React 19.2.0
- **Language**: TypeScript (strict mode enabled)
- **Database**: Drizzle ORM with SQLite (dev) / PostgreSQL via Supabase (prod)
- **State Management**: Zustand with Immer middleware
- **AI**: Vercel AI SDK with Gateway + Multi-step Workflows
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **Form Handling**: React Hook Form + Zod
- **Linting/Formatting**: Ultracite (Biome-based) with 245+ rules
- **Package Manager**: pnpm

## Project Structure

```
/src
├── app/                        # Next.js App Router
│   ├── (dashboard)/           # Dashboard routes (layout group)
│   │   ├── layout.tsx         # Dashboard layout (header + sidebar)
│   │   └── dashboard/         # Dashboard pages
│   ├── api/                   # API routes
│   │   └── ai/                # AI endpoints (chat, workflows)
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Homepage
│   └── globals.css            # Global styles
├── components/
│   ├── layout/                # Layout components (header, sidebar)
│   └── ui/                    # shadcn/ui components (50+)
├── hooks/                     # Custom React hooks
└── lib/
    ├── ai/                    # AI SDK & workflows
    │   ├── config.ts          # Provider config + gateway
    │   └── workflows/         # Multi-step workflows
    ├── db/                    # Drizzle ORM
    │   ├── schema.ts          # Database schema
    │   ├── index.ts           # DB client
    │   └── seed.ts            # Sample data
    ├── store/                 # Zustand stores
    │   ├── user-store.ts      # Auth state
    │   ├── ui-store.ts        # UI state
    │   ├── posts-store.ts     # Data state
    │   └── hooks.ts           # Store hooks
    ├── supabase/              # Supabase clients
    └── utils.ts               # Utilities
```

**Key conventions:**
- All source code in `/src` directory
- Route groups with `(name)` for layout organization
- Components organized by function (layout, ui)
- Stores co-located with hooks and types

## Development Commands

```bash
# Development
pnpm dev                    # Start Next.js dev server (http://localhost:3000)
pnpm build                  # Build for production
pnpm start                  # Start production server

# Code Quality
pnpm lint                   # Check with Ultracite (via Biome)
pnpm lint:fix               # Auto-fix linting issues
pnpm lint:fix --unsafe      # Apply unsafe fixes (includes block statements, etc.)

# Code Analysis
pnpm analyze                # Run all analysis tools (knip + depcheck + madge)
pnpm analyze:knip           # Find unused files/exports/deps
pnpm analyze:knip:production # Stricter production-mode analysis
pnpm analyze:ts-prune       # Alternative unused exports finder
pnpm analyze:deps           # Check for unused/missing dependencies
pnpm analyze:circular       # Detect circular dependencies
pnpm analyze:graph          # Generate dependency graph (outputs graph.svg)

# Database
pnpm db:generate            # Generate migrations from schema changes
pnpm db:migrate             # Run pending migrations
pnpm db:push                # Push schema directly to database (use --force for non-interactive)
pnpm db:studio              # Open Drizzle Studio (GUI at https://local.drizzle.studio)
pnpm db:seed                # Seed database with sample data
```

## Architecture

### Database Architecture (Dual-Environment)

The application uses **environment-aware database switching**:

- **Development**: SQLite (`local.db`) - zero configuration, instant startup
- **Production**: PostgreSQL via Supabase - set `NODE_ENV=production` and provide `DATABASE_URL`

**Key files:**
- `lib/db/schema.ts` - Conditional schema that works with both SQLite and PostgreSQL
- `lib/db/index.ts` - Auto-switching database client based on `NODE_ENV`
- `drizzle.config.ts` - Drizzle Kit configuration (auto-detects environment)

**Schema pattern:**
```typescript
// Schema automatically adapts to environment
export const users = isProduction
  ? pgTable("users", { id: uuid("id").primaryKey()... })
  : sqliteTable("users", { id: text("id").primaryKey()... });
```

**Import pattern:**
```typescript
import { db, schema } from "@/lib/db";
// db automatically uses correct driver (SQLite or PostgreSQL)
```

### Layout Architecture

**App-wide layout system** with persistent header and right-aligned sidebar:

**Header** (`src/components/layout/app-header.tsx`):
- Sticky positioned at top
- Business dropdown (left) - Switch between business contexts
- Logo and main navigation (center)
- Theme toggle + Profile dropdown (right)
- Fully responsive with mobile menu

**Sidebar** (`src/components/layout/app-sidebar.tsx`):
- Fixed position, right-aligned (opposite of typical sidebars)
- Sticky below header using CSS variables
- Grouped navigation with labels
- Active state tracking via `usePathname()`
- Hidden on mobile, visible on `lg:` breakpoint
- Uses custom scrollbar hiding (`.no-scrollbar`)

**Dashboard Layout** (`src/app/(dashboard)/layout.tsx`):
- Wraps all `/dashboard/*` routes
- Renders `<AppHeader />` and `<AppSidebar />`
- Main content area with `lg:mr-64` (sidebar width)
- CSS variables: `--header-height: 3.5rem`, `--sidebar-width: 16rem`

**Usage:**
- All dashboard pages automatically inherit header + sidebar
- Public pages use separate layouts (no dashboard wrapper)
- Route groups `(dashboard)` don't affect URL structure

### State Management (Zustand)

Three pre-configured stores in `lib/store/`:

1. **User Store** (`user-store.ts`) - Authentication state (persisted to localStorage)
2. **UI Store** (`ui-store.ts`) - Theme, modals, sidebar, notifications (partially persisted)
3. **Posts Store** (`posts-store.ts`) - Posts data with filtering (not persisted)

**Store pattern:**
- All stores use Immer middleware (mutate state drafts directly)
- DevTools enabled for all stores
- Pre-defined selectors for optimized re-renders
- Export types: `UserStore`, `UIStore`, `PostsStore`

**Custom hooks in `lib/store/hooks.ts`:**
- `useAuth()` - Get auth status and user
- `useModal(type)` - Manage modal state
- `useNotifications()` - Show toast notifications
- `useStoreHydration()` - Wait for localStorage persistence

**Usage pattern:**
```typescript
// Selector pattern (optimized)
const userName = useUserStore(state => state.user?.name);

// Action pattern
const { setUser, logout } = useUserStore();

// Pre-defined selectors
const user = useUserStore(userSelectors.user);
```

### AI Workflows (Vercel AI SDK + Gateway)

**Multi-step workflow orchestration** in `lib/ai/`:

- **Vercel AI Gateway** - Enterprise routing, caching, rate limiting
- **Multiple Providers** - OpenAI, Anthropic, Google (env-based switching)
- **Workflow Engine** - Orchestrate multi-agent pipelines
- **Streaming** - Real-time response streaming
- **Structured Output** - Type-safe with Zod schemas

**Pre-built workflows:**
1. **Content Generation** - Research → Draft → Review pipeline
2. **Code Review** - Security → Performance → Quality analysis

**API Routes:**
- `/api/ai/chat` - Streaming chat completions
- `/api/ai/workflows/content` - Content generation workflow
- `/api/ai/workflows/code-review` - Automated code review

**Configuration pattern:**
```typescript
import { createAIProvider } from "@/lib/ai";

// Auto-detects provider from env (OPENAI_API_KEY, etc.)
const model = createAIProvider();

// Or specify provider/model
const model = createAIProvider({
  provider: "anthropic",
  model: "claude-3-5-sonnet-20241022"
});
```

**Workflow execution:**
```typescript
import { WorkflowEngine, contentGenerationWorkflow } from "@/lib/ai/workflows";

const result = await WorkflowEngine.execute(
  contentGenerationWorkflow,
  { topic: "...", tone: "professional" }
);

// Access results
console.log(result.output.finalContent);
console.log(result.steps); // See each step's execution
```

### Supabase Integration

While Drizzle handles database operations, Supabase clients are available for Auth, Storage, and Realtime:

- `lib/supabase/client.ts` - Browser client (Client Components)
- `lib/supabase/server.ts` - Server client (Server Components, auto-handles cookies)

Both return `null` if credentials are missing (dev mode graceful degradation).

### Component Library Structure

**shadcn/ui components** in `components/ui/`:
- 50+ pre-built components with Radix UI primitives
- Uses `class-variance-authority` for variants
- All components are "use client" directives
- Pattern: Import Radix primitives as namespace (`import * as AccordionPrimitive`)

**Note**: Many Radix namespace imports trigger Ultracite's `noNamespaceImport` rule - this is expected and can be ignored for Radix components.

### Path Aliases

```typescript
"@/*" → "./src/*"  // All imports relative to /src
```

Example: `import { db } from "@/lib/db"` resolves to `src/lib/db`

## Code Quality Tools

### Ultracite (Primary Linter/Formatter)

- **245 rules** configured in `.cursor/rules/ultracite.mdc`
- Based on Biome (Rust-based, extremely fast)
- Enforces React 19, Next.js 16, accessibility, and type safety rules
- Auto-formats on save (via Husky pre-commit hook)
- Configured for: vscode, zed, cursor, claude, windsurf

**Known issues to ignore:**
- `noNamespaceImport` on Radix UI components - acceptable pattern
- `noNestedComponentDefinitions` in calendar.tsx - functional requirement
- `noShadow` warnings in calendar.tsx - scoped correctly
- Accessibility warnings in breadcrumb/button-group - design trade-offs

### Pre-commit Hooks (Husky + lint-staged)

Auto-runs on `git commit`:
```bash
# Formats staged files only
pnpm dlx ultracite fix
```

Hook preserves partial staging and handles stash/unstash automatically.

### Analysis Tools

- **Knip**: Finds unused files, exports, and dependencies (most comprehensive)
- **ts-prune**: Second opinion on unused exports (faster but less features)
- **depcheck**: Focuses on package.json dependencies
- **Madge**: Circular dependency detection and visualization

Run `pnpm analyze` before major refactors to identify dead code.

## Environment Variables

Create `.env.local` for local development:

```bash
NODE_ENV=development                    # Determines database (sqlite vs postgres)

# Supabase (optional for local dev)
NEXT_PUBLIC_SUPABASE_URL=               # Public Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=          # Public anon key
SUPABASE_SERVICE_ROLE_KEY=              # Server-side key
DATABASE_URL=                           # PostgreSQL connection string (production)

# AI Configuration
OPENAI_API_KEY=sk-...                   # OpenAI API key
ANTHROPIC_API_KEY=sk-ant-...            # Anthropic API key
GOOGLE_GENERATIVE_AI_API_KEY=...        # Google AI API key
AI_GATEWAY_URL=                         # Vercel AI Gateway URL (optional)
AI_GATEWAY_TOKEN=                       # Gateway token (optional)
AI_PROVIDER=openai                      # Default provider (openai|anthropic|google)
AI_MODEL=gpt-4o                         # Default model
```

See `.env.example` for complete reference.

## Important Patterns

### Creating New Pages

**Dashboard page** (with header + sidebar):
```typescript
// src/app/(dashboard)/dashboard/my-page/page.tsx
export default function MyPage() {
  return <div>My content</div>;
}
// Automatically inherits dashboard layout (header + sidebar)
```

**Public page** (no dashboard layout):
```typescript
// src/app/my-page/page.tsx
export default function MyPage() {
  return <div>Public content</div>;
}
// Uses root layout only (no header/sidebar)
```

**Custom layout group:**
```typescript
// src/app/(admin)/layout.tsx - Create new layout
// src/app/(admin)/admin/page.tsx - Uses admin layout
```

### Server Components (Default)

```typescript
// app/page.tsx - Server Component (default)
export default async function Page() {
  const data = await db.select().from(schema.posts);
  return <PostList posts={data} />;
}
```

### Client Components

```typescript
"use client"; // Required for hooks, state, browser APIs

import { useUserStore } from "@/lib/store";

export function Component() {
  const user = useUserStore(state => state.user);
  return <div>{user?.name}</div>;
}
```

### Database Queries

```typescript
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

// Query
const users = await db.select().from(schema.users);

// Filter
const user = await db
  .select()
  .from(schema.users)
  .where(eq(schema.users.email, "alice@example.com"));

// Insert
const newUser = await db
  .insert(schema.users)
  .values({ name: "John", email: "john@example.com" })
  .returning();

// Update
await db
  .update(schema.users)
  .set({ name: "Jane" })
  .where(eq(schema.users.id, userId));
```

### State Management

```typescript
// Optimized selector (only re-renders when userName changes)
const userName = useUserStore(state => state.user?.name);

// Multiple actions
const { setUser, updateUser, logout } = useUserStore();

// Batch updates (single re-render)
useUserStore.setState({
  user: newUser,
  isAuthenticated: true,
  isLoading: false,
});

// Reset all stores (e.g., on logout)
import { resetAllStores } from "@/lib/store";
resetAllStores();
```

### AI Workflows

```typescript
// Streaming chat
import { streamText } from "ai";
import { createAIProvider } from "@/lib/ai";

const model = createAIProvider();
const result = await streamText({
  model,
  messages: [{ role: "user", content: "Hello!" }]
});

return result.toDataStreamResponse();

// Structured output
import { generateObject } from "ai";
import { z } from "zod";

const { object } = await generateObject({
  model,
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
  }),
  prompt: "Analyze this article...",
});

// Execute workflow
import { WorkflowEngine, codeReviewWorkflow } from "@/lib/ai/workflows";

const result = await WorkflowEngine.execute(
  codeReviewWorkflow,
  { code: "...", language: "typescript" }
);

console.log(result.output.overallScore);
console.log(result.steps); // Each step's execution details
```

## Documentation

Comprehensive READMEs available:
- `src/lib/db/README.md` - Database setup, queries, Supabase integration
- `src/lib/store/README.md` - State management patterns, best practices
- `src/lib/store/examples.tsx` - Working component examples
- `src/lib/ai/README.md` - AI workflows, providers, Vercel AI Gateway setup

## Build Considerations

- Uses **pnpm** - always use `pnpm` commands, not `npm`
- **React 19** - forwardRef is deprecated, use ref as prop
- **Next.js 16** - App Router only, no Pages Router
- **TypeScript strict mode** - all types must be explicit
- **No console logs** - Ultracite forbids console.* (use proper logging)
- **No debugger statements** - Use breakpoints instead
- **Accessibility-first** - WCAG AA compliance enforced by Ultracite

### Layout Components

**AppHeader** - Access business context, theme, and profile:
```typescript
// Already integrated in dashboard layout
// Manages: business dropdown, theme toggle, profile menu
// State: Uses useUIStore for theme, useUserStore for profile
```

**AppSidebar** - Right-aligned navigation:
```typescript
// Positioned right (not left)
// Sticky below header
// Auto-highlights active route
// Mobile: hidden, Desktop (lg+): visible
```

**Adding navigation items:**
Edit `src/components/layout/app-sidebar.tsx`:
```typescript
const navigation: NavGroup[] = [
  {
    label: "My Section",
    items: [
      { title: "My Page", href: "/dashboard/my-page", icon: MyIcon },
    ],
  },
];
```

## Common Gotchas

1. **Database queries in Client Components**: Use Server Components or Server Actions
2. **Namespace imports**: Radix UI requires them despite `noNamespaceImport` rule
3. **Store persistence**: User/UI stores persist to localStorage, may cause hydration issues
4. **Environment switching**: Database auto-switches on `NODE_ENV`, ensure it's set correctly
5. **Pre-commit hooks**: May reformat code, always review changes before pushing
6. **AI API routes**: Use `runtime = "nodejs"` for workflows (not "edge") to support longer executions
7. **AI Gateway**: Optional but strongly recommended for production (caching, rate limiting, analytics)
8. **Right-aligned sidebar**: Sidebar is on the right, not left - use `lg:mr-64` for main content
9. **Route groups**: `(dashboard)` folder doesn't appear in URL - `/dashboard` not `/(dashboard)/dashboard`
