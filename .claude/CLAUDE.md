# Thorbis Project Guidelines

## 🚀 NEXT.JS 16+ REQUIREMENTS

**This project uses Next.js 16.0.0 with React 19. ALL code must follow Next.js 16+ patterns.**

### Breaking Changes from Next.js 14/15
1. **Async Request APIs** - `cookies()`, `headers()`, `params`, `searchParams` are now async
2. **Dynamic Route Segments** - All route params must be awaited
3. **React 19 Features** - Use latest React patterns (ref as prop, actions)
4. **Proxy Pattern** - Use `proxy.ts` instead of `middleware.ts` for auth/routing (security best practice)

### Required Patterns

#### ✅ Async cookies() - REQUIRED
```typescript
// ✅ CORRECT - Next.js 16+
import { cookies } from "next/headers";

export async function myFunction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
}

// ❌ WRONG - Next.js 14/15 pattern
const cookieStore = cookies(); // This will fail in Next.js 16
```

#### ✅ Async headers() - REQUIRED
```typescript
// ✅ CORRECT - Next.js 16+
import { headers } from "next/headers";

export async function myFunction() {
  const headersList = await headers();
  const referer = headersList.get("referer");
}

// ❌ WRONG - Next.js 14/15 pattern
const headersList = headers(); // This will fail in Next.js 16
```

#### ✅ Async params - REQUIRED
```typescript
// ✅ CORRECT - Next.js 16+
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>ID: {id}</div>;
}

// ❌ WRONG - Next.js 14/15 pattern
export default function Page({ params }: { params: { id: string } }) {
  return <div>ID: {params.id}</div>; // This will fail in Next.js 16
}
```

#### ✅ Async searchParams - REQUIRED
```typescript
// ✅ CORRECT - Next.js 16+
export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const { query } = await searchParams;
  return <div>Search: {query}</div>;
}

// ❌ WRONG - Next.js 14/15 pattern
export default function Page({ searchParams }: { searchParams: { query?: string } }) {
  return <div>Search: {searchParams.query}</div>; // This will fail in Next.js 16
}
```

#### ✅ React 19 - ref as prop
```typescript
// ✅ CORRECT - React 19
function MyInput({ ref }: { ref: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} />;
}

// ❌ WRONG - React 18 pattern
const MyInput = React.forwardRef<HTMLInputElement>((props, ref) => {
  return <input ref={ref} />;
});
```

#### ✅ Proxy Pattern (Next.js 16+) - REQUIRED for Auth/Routing
```typescript
// ✅ CORRECT - Next.js 16+ proxy.ts
// proxy.ts (root level)
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Handle auth, redirects, session refresh
  // Runs on Node.js runtime (not Edge)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

// ❌ WRONG - Next.js 14/15 middleware.ts pattern
// middleware.ts (deprecated, security risks)
export async function middleware(request: NextRequest) {
  // This pattern is deprecated in Next.js 16
}
```

**Why proxy.ts?**
- **Security**: Fixes critical CVE where `x-middleware-subrequest` header could bypass all auth checks
- **Clarity**: Explicitly shows network boundary and Node.js runtime
- **Best Practice**: Vercel recommends NOT relying on middleware.ts for security/auth anymore
- **Migration**: Use codemod: `npx @next/codemod@latest middleware-to-proxy`

**Important Security Notes:**
- NEVER rely solely on proxy.ts for authorization
- ALWAYS validate auth in Server Actions and API routes
- Use proxy.ts ONLY for lightweight interception (redirects, session refresh)
- Implement proper Row Level Security (RLS) in Supabase

---

## 📚 REQUIRED CONTEXT

**IMPORTANT: ALWAYS reference and apply the complete linting rules from [AGENTS.md](../AGENTS.md) before writing any code.**

The AGENTS.md file contains 436 comprehensive linting rules covering:
- Accessibility (ARIA, WCAG compliance)
- TypeScript/JavaScript best practices
- React/Next.js patterns
- Security guidelines
- Performance optimization
- Testing standards
- CSS/Styling conventions

**Never skip this reference.** All code must comply with these rules in addition to the critical rules below.

---

## 🎯 CRITICAL RULES (NEVER BREAK)

1. **SERVER COMPONENTS FIRST - ALWAYS**
   - Default to Server Components for ALL new components
   - Only add `"use client"` when absolutely necessary (hooks, events, browser APIs)
   - Extract minimal interactive parts to separate client components
   - Question: "Can this be a Server Component?" before using client
   - Target: 65%+ Server Components (currently achieved)

2. **PERFORMANCE IS NON-NEGOTIABLE**
   - Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1
   - Keep client bundles under 200KB gzipped
   - Zero tolerance for unnecessary JavaScript to client
   - Use dynamic imports for code splitting
   - Run `pnpm analyze:bundle` regularly to track bundle sizes
   - Wrap slow components in `<Suspense>` for streaming
   - Use ISR (`export const revalidate = N`) for static pages

3. **SECURITY BY DEFAULT**
   - Supabase RLS on ALL tables - no exceptions
   - Validate all input server-side with Zod
   - Never trust client input
   - Use parameterized queries only
   - Use Server Actions for form submissions (not client-side state)
   - **Use proxy.ts (NOT middleware.ts)** - Next.js 16+ security best practice
   - NEVER rely solely on proxy.ts for auth - always validate in Server Actions/API routes
   - Use proxy.ts ONLY for lightweight redirects and session refresh

4. **STATE MANAGEMENT - ZUSTAND ONLY**
   - **NEVER use React Context** - always use Zustand for state management
   - Keep stores extremely well organized in `/src/lib/stores/`
   - One store per feature domain (e.g., `communication-store.ts`, `schedule-store.ts`)
   - Use shallow selectors to prevent unnecessary re-renders
   - No provider wrappers needed - direct imports only
   - Benefits: Lighter bundle, better performance, cleaner code
   - Exception: Built-in Next.js contexts (ThemeProvider, etc.) are allowed

5. **EXTEND EXISTING INFRASTRUCTURE - MANDATORY**
   - **CRITICAL: ALWAYS check for existing components before creating new ones**
   - **NEVER create duplicate infrastructure** (toolbars, layouts, tables, forms, etc.)
   - This project has established patterns that MUST be reused and extended

   ### Component Discovery Process (REQUIRED BEFORE ANY NEW COMPONENT)
   1. Search for similar components in the codebase first
   2. Review existing implementations in the same feature area
   3. Check `/src/components/layout/` for shared infrastructure
   4. Look at similar pages for established patterns
   5. Only create new components if NO existing solution exists

   ### Key Infrastructure Components (ALWAYS REUSE)
   - **AppToolbar** (`src/components/layout/app-toolbar.tsx`) - Universal toolbar for all pages
   - **AppHeader** (`src/components/layout/app-header.tsx`) - Page headers with breadcrumbs
   - **WorkPageLayout** (`src/components/work/work-page-layout.tsx`) - Standard page layout
   - **FullWidthDatatable** (`src/components/ui/full-width-datatable.tsx`) - Tables
   - **NavGrouped** (`src/components/layout/nav-grouped.tsx`) - Sidebar navigation
   - **AppSidebar** (`src/components/layout/app-sidebar.tsx`) - Main sidebar structure

   ### Examples of WRONG vs RIGHT Approach

   ❌ **WRONG - Creating New Toolbar:**
   ```typescript
   // contracts/page.tsx
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

   ✅ **RIGHT - Using Existing AppToolbar:**
   ```typescript
   // contracts/page.tsx
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
   ```

   ❌ **WRONG - Creating Custom Layout:**
   ```typescript
   export default function NewPage() {
     return (
       <div className="p-8">
         <div className="mb-4">
           <h1 className="text-2xl font-bold">Title</h1>
         </div>
         <div className="bg-white rounded-lg p-6">
           <Content />
         </div>
       </div>
     );
   }
   ```

   ✅ **RIGHT - Using WorkPageLayout:**
   ```typescript
   import { WorkPageLayout } from "@/components/work/work-page-layout";

   export default function NewPage() {
     return (
       <WorkPageLayout title="Title">
         <Content />
       </WorkPageLayout>
     );
   }
   ```

   ### Why This Matters
   - **Consistency**: Users expect the same UX patterns across all pages
   - **Maintainability**: One component to update vs dozens of duplicates
   - **Performance**: Shared components are already optimized and bundled
   - **Quality**: Existing components have been tested and refined
   - **Speed**: Extending is faster than building from scratch

   ### Enforcement
   - Before creating ANY new component, ask: "Does something like this already exist?"
   - Search the codebase using Grep/Glob for similar patterns
   - Review at least 2-3 similar pages in the same feature area
   - Consistency is MORE important than individual creativity
   - When in doubt, extend existing components rather than creating new ones

## 📋 Linting Rules

Avoid `accessKey` attr and distracting els
No `aria-hidden="true"` on focusable els
No ARIA roles, states, props on unsupported els
Use `scope` prop only on `<th>` els
No non-interactive ARIA roles on interactive els
Label els need text and associated input
No event handlers on non-interactive els
No interactive ARIA roles on non-interactive els
No `tabIndex` on non-interactive els
No positive integers on `tabIndex` prop
No `image`, `picture`, or `photo` in img alt props
No explicit role matching implicit role
Valid role attrs on static, visible els w/ click handlers
Use `title` el for `svg` els
Provide meaningful alt text for all els requiring it
Anchors need accessible content
Assign `tabIndex` to non-interactive els w/ `aria-activedescendant`
Include all required ARIA attrs for els w/ ARIA roles
Use valid ARIA props for the el's role
Use `type` attr on `button` els
Make els w/ interactive roles and handlers focusable
Heading els need accessible content
Add `lang` attr to `html` el
Use `title` attr on `iframe` els
Pair `onClick` w/ `onKeyUp`, `onKeyDown`, or `onKeyPress`
Pair `onMouseOver`/`onMouseOut` w/ `onFocus`/`onBlur`
Add caption tracks to audio and video els
Use semantic els vs role attrs
All anchors must be valid and navigable
Use valid, non-abstract ARIA props, roles, states, and values
Use valid values for `autocomplete` attr
Use correct ISO language codes in `lang` attr
Include generic font family in font families
No consecutive spaces in regex literals
Avoid `arguments`, comma op, and primitive type aliases
No empty type params in type aliases and interfaces
Keep fns under Cognitive Complexity limit
Limit nesting depth of `describe()` in tests
No unnecessary boolean casts or callbacks on `flatMap`
Use `for...of` vs `Array.forEach`
No classes w/ only static members
No `this` and `super` in static contexts
No unnecessary catch clauses, ctors, `continue`, escape sequences in regex literals, fragments, labels, or nested blocks
No empty exports
No renaming imports, exports, or destructured assignments to same name
No unnecessary string/template literal concatenation or useless cases in switch stmts, `this` aliasing, or `String.raw` without escape sequences
Use simpler alternatives to ternary ops if possible
No `any` or `unknown` as type constraints or initializing vars to `undefined`
Avoid `void` op
Use arrow fns vs function exprs
Use `Date.now()` for milliseconds since Unix Epoch
Use `.flatMap()` vs `map().flat()`
Use `indexOf`/`lastIndexOf` vs `findIndex`/`findLastIndex` for simple lookups
Use literal property access vs computed property access
Use binary, octal, or hex literals vs `parseInt()`
Use concise optional chains vs chained logical exprs
Use regex literals vs `RegExp` ctor
Use base 10 or underscore separators for number literal object member names
Remove redundant terms from logical exprs
Use `while` loops vs `for` loops if initializer and update aren't needed
No reassigning `const` vars or constant exprs in conditions
No `Math.min`/`Math.max` to clamp values where result is constant
No return values from ctors or setters
No empty character classes in regex literals or destructuring patterns
No `__dirname` and `__filename` in global scope
No calling global object props as fns or declaring fns and `var` accessible outside their block
Instantiate builtins correctly
Use `super()` correctly in classes
Use standard direction values for linear gradient fns
Use valid named grid areas in CSS Grid Layouts
Use `@import` at-rules in valid positions
No vars and params before their decl
Include `var` fn for CSS vars
No `\8` and `\9` escape sequences in strings
No literal numbers that lose precision, configured els, or assigning where both sides are same
Compare string case modifications w/ compliant values
No lexical decls in switch clauses or undeclared vars
No unknown CSS value fns, media feature names, props, pseudo-class/pseudo-element selectors, type selectors, or units
No unmatchable An+B selectors or unreachable code
Call `super()` exactly once before accessing `this` in ctors
No control flow stmts in `finally` blocks
No optional chaining where `undefined` is not allowed
No unused fn params, imports, labels, private class members, or vars
No return values from fns w/ return type `void`
Specify all dependencies correctly in React hooks and names for GraphQL operations
Call React hooks from top level of component fns
Use `isNaN()` when checking for NaN
Use `{ type: "json" }` for JSON module imports
Use radix arg w/ `parseInt()`
Start JSDoc comment lines w/ single asterisk
Move `for` loop counters in right direction
Compare `typeof` exprs to valid values
Include `yield` in generator fns
No importing deprecated exports, duplicate dependencies, or Promises where they're likely a mistake
No non-null assertions after optional chaining or shadowing vars from outer scope
No expr stmts that aren't fn calls or assignments or useless `undefined`
Add `href` attr to `<a>` els and `width`/`height` attrs to `<img>` els
Use consistent arrow fn bodies and either `interface` or `type` consistently
Specify deletion date w/ `@deprecated` directive
Make switch-case stmts exhaustive and limit number of fn params
Sort CSS utility classes
No spread syntax on accumulators, barrel files, `delete` op, dynamic namespace import access, namespace imports, or duplicate polyfills from Polyfill.io
Use `preconnect` attr w/ Google Fonts
Declare regex literals at top level
Add `rel="noopener"` when using `target="_blank"`
No dangerous JSX props
No both `children` and `dangerouslySetInnerHTML` props
No global `eval()`
No callbacks in async tests and hooks, TS enums, exporting imported vars, type annotations for vars initialized w/ literals, magic numbers without named constants, or TS namespaces
No negating `if` conditions when there's an `else` clause, nested ternary exprs, non-null assertions (`!`), reassigning fn params, parameter props in class ctors, specified global var names, importing specified modules, or specified user-defined types
No constants where value is upper-case version of name, template literals without interpolation or special chars, `else` blocks when `if` block breaks early, yoda exprs, or `Array` ctors
Use `String.slice()` vs `String.substr()` and `String.substring()`
Use `as const` vs literal type annotations and `at()` vs integer index access
Follow curly brace conventions
Use `else if` vs nested `if` in `else` clauses and single `if` vs nested `if` clauses
Use `T[]` vs `Array<T>`
Use `new` for all builtins except `String`, `Number`, and `Boolean`
Use consistent accessibility modifiers on class props and methods
Declare object literals consistently
Use `const` for vars only assigned once
Put default and optional fn params last
Include `default` clause in switch stmts
Specify reason arg w/ `@deprecated` directive
Explicitly initialize each enum member value
Use `**` op vs `Math.pow`
Use `export type` and `import type` for types
Use kebab-case, ASCII filenames
Use `for...of` vs `for` loops w/ array index access
Use `<>...</>` vs `<Fragment>...</Fragment>`
Capitalize all enum values
Place getters and setters for same prop adjacent
Use literal values for all enum members
Use `node:assert/strict` vs `node:assert`
Use `node:` protocol for Node.js builtin modules
Use `Number` props vs global ones
Use numeric separators in numeric literals
Use object spread vs `Object.assign()` for new objects
Mark members `readonly` if never modified outside ctor
No extra closing tags for comps without children
Use assignment op shorthand
Use fn types vs object types w/ call signatures
Add description param to `Symbol()`
Use template literals vs string concatenation
Use `new` when throwing an error
No throwing non-`Error` values
Use `String.trimStart()`/`String.trimEnd()` vs `String.trimLeft()`/`String.trimRight()`
No overload signatures that can be unified
No lower specificity selectors after higher specificity selectors
No `@value` rule in CSS modules
No `alert`, `confirm`, and `prompt`
Use standard constants vs approximated literals
No assigning in exprs
No async fns as Promise executors
No `!` pattern in first position of `files.includes`
No bitwise ops
No reassigning exceptions in catch clauses
No reassigning class members
No inserting comments as text nodes
No comparing against `-0`
No labeled stmts that aren't loops
No `void` type outside generic or return types
No `console`
No TS const enums
No exprs where op doesn't affect value
No control chars in regex literals
No `debugger`
No assigning directly to `document.cookie`
Use `===` and `!==`
No duplicate `@import` rules, case labels, class members, custom props, conditions in if-else-if chains, GraphQL fields, font family names, object keys, fn param names, decl block props, keyframe selectors, or describe hooks
No empty CSS blocks, block stmts, static blocks, or interfaces
No letting vars evolve into `any` type through reassignments
No `any` type
No `export` or `module.exports` in test files
No misusing non-null assertion op (`!`)
No fallthrough in switch clauses
No focused or disabled tests
No reassigning fn decls
No assigning to native objects and read-only global vars
Use `Number.isFinite` and `Number.isNaN` vs global `isFinite` and `isNaN`
No implicit `any` type on var decls
No assigning to imported bindings
No `!important` within keyframe decls
No irregular whitespace chars
No labels that share name w/ var
No chars made w/ multiple code points in char classes
Use `new` and `constructor` properly
Place assertion fns inside `it()` fn calls
No shorthand assign when var appears on both sides
No octal escape sequences in strings
No `Object.prototype` builtins directly
No `quickfix.biome` in editor settings
No redeclaring vars, fns, classes, and types in same scope
No redundant `use strict`
No comparing where both sides are same
No shadowing restricted names
No shorthand props that override related longhand props
No sparse arrays
No template literal placeholder syntax in regular strings
No `then` prop
No `@ts-ignore` directive
No `let` or `var` vars that are read but never assigned
No unknown at-rules
No merging interface and class decls unsafely
No unsafe negation (`!`)
No unnecessary escapes in strings or useless backreferences in regex literals
No `var`
No `with` stmts
No separating overload signatures
Use `await` in async fns
Use correct syntax for ignoring folders in config
Put default clauses in switch stmts last
Pass message value when creating built-in errors
Return value from get methods
Use recommended display strategy w/ Google Fonts
Include `if` stmt in for-in loops
Use `Array.isArray()` vs `instanceof Array`
Return consistent values in iterable callbacks
Use `namespace` keyword vs `module` keyword
Use digits arg w/ `Number#toFixed()`
Use static `Response` methods vs `new Response()`
Use `use strict` directive in script files
No passing children as props. Nest children between opening and closing tags
No defining comps inside other comps
No reassigning props in React comps
No using return value from `ReactDOM.render()`
No adding children to void els like `<img>` and `<br>`
Specify all dependencies correctly in React hooks
Call React hooks from top level of comp fns only
Add `key` prop to els in iterables
No legacy `React.forwardRef`. Use ref as prop instead (React 19+)
Use fn comps vs class comps
No array indices as keys
No duplicate props in JSX
No semicolons that change JSX el semantics
No async client comps. Use server comps for async operations
Use Next.js `<Image>` comp vs `<img>` el
Use Next.js `next/head` or App Router metadata API vs `<head>` el
No importing `next/document` in page files
No importing `next/head` in `_document.tsx`. Use `<Head>` from `next/document` instead

---

## 🚀 PERFORMANCE PATTERNS (REQUIRED)

### 1. Server Components Pattern
```typescript
// ✅ GOOD - Server Component (default)
import { KPICard } from "@/components/dashboard/kpi-card";

export default function DashboardPage() {
  return <KPICard title="Revenue" value="$10k" />;
}

// ❌ BAD - Unnecessary Client Component
"use client";
export default function DashboardPage() { /* ... */ }
```

### 2. Client Component Extraction
```typescript
// ✅ GOOD - Extract only interactive part
// tooltip-wrapper.tsx
"use client";
export function TooltipWrapper({ children, content }: Props) {
  return <Tooltip>{children}</Tooltip>;
}

// kpi-card.tsx (Server Component)
export function KPICard() {
  return (
    <Card>
      <TooltipWrapper content="Info">
        <Icon />
      </TooltipWrapper>
    </Card>
  );
}
```

### 3. Streaming with Suspense
```typescript
// ✅ GOOD - Wrap slow components in Suspense
import { Suspense } from "react";
import { ChartSkeleton } from "@/components/ui/skeletons";

export default function Page() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <SlowChart />
    </Suspense>
  );
}
```

### 4. Zustand State Management Pattern
```typescript
// ✅ GOOD - Zustand Store
// src/lib/stores/communication-store.ts
import { create } from "zustand";

type CommunicationStore = {
  activeFilter: "all" | "email" | "sms";
  setActiveFilter: (filter: "all" | "email" | "sms") => void;
  messages: Message[];
  addMessage: (message: Message) => void;
};

export const useCommunicationStore = create<CommunicationStore>((set) => ({
  activeFilter: "all",
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
}));

// Usage in component (automatic re-render only when activeFilter changes)
"use client";
import { useCommunicationStore } from "@/lib/stores/communication-store";

export function CommunicationToolbar() {
  const activeFilter = useCommunicationStore((state) => state.activeFilter);
  const setActiveFilter = useCommunicationStore((state) => state.setActiveFilter);

  return <button onClick={() => setActiveFilter("email")}>Email</button>;
}

// ❌ BAD - React Context (NEVER USE)
const CommunicationContext = createContext();
export function CommunicationProvider({ children }) {
  const [activeFilter, setActiveFilter] = useState("all");
  return (
    <CommunicationContext.Provider value={{ activeFilter, setActiveFilter }}>
      {children}
    </CommunicationContext.Provider>
  );
}
```

### 5. Server Actions for Forms
```typescript
// ✅ GOOD - Server Action
// actions/settings.ts
"use server";
export async function updateSettings(formData: FormData) {
  const data = settingsSchema.parse({
    name: formData.get("name"),
  });
  // Save to DB
  revalidatePath("/settings");
  return { success: true };
}

// page.tsx
import { updateSettings } from "@/actions/settings";

<form action={updateSettings}>
  <input name="name" />
  <button type="submit">Save</button>
</form>

// ❌ BAD - Client-side state
"use client";
const [data, setData] = useState({});
<form onSubmit={(e) => { /* manual fetch */ }}>
```

### 6. ISR for Static Content
```typescript
// ✅ GOOD - Revalidate every 5 minutes
export const revalidate = 300;

export default function ReportsPage() {
  // Static page regenerated every 5 minutes
  return <Reports />;
}
```

### 7. Loading States
```typescript
// ✅ GOOD - Create loading.tsx for automatic streaming
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
}
```

---

## 📦 PROJECT STRUCTURE

### Current Architecture Stats
- **Total Pages**: 206
- **Server Components**: 134 (65%)
- **Client Components**: 72 (35% - only where needed)
- **Build Time**: ~10 seconds
- **Bundle Analysis**: Configured with `@next/bundle-analyzer`

### Component Organization
```
src/
├── actions/              # Server Actions (form handling)
│   ├── settings.ts
│   └── customers.ts
├── app/
│   └── (dashboard)/
│       └── dashboard/
│           ├── page.tsx       # Server Component
│           ├── loading.tsx    # Streaming UI
│           └── [...]/
├── components/
│   ├── ui/
│   │   ├── skeletons.tsx     # Loading states
│   │   └── client-timestamp.tsx  # Client wrapper
│   └── dashboard/
│       ├── kpi-card.tsx          # Server Component
│       └── kpi-card-client.tsx   # Client wrapper
├── lib/
│   ├── stores/           # Zustand stores (ORGANIZED BY FEATURE)
│   │   ├── communication-store.ts
│   │   ├── schedule-store.ts
│   │   ├── work-store.ts
│   │   └── user-store.ts
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utility functions
```

---

## 🛠️ DEVELOPMENT COMMANDS

### Performance Analysis
```bash
# Analyze bundle sizes (shows in build logs)
pnpm analyze:bundle

# Run all code analysis
pnpm analyze

# Check dependencies
pnpm analyze:deps

# Find circular dependencies
pnpm analyze:circular
```

### Development
```bash
# Start dev server (Turbopack enabled)
pnpm dev

# Build for production
pnpm build

# Lint and fix code
pnpm lint:fix
```

---

## ✅ CODE REVIEW CHECKLIST

Before committing code, verify:

### Infrastructure & Patterns
- [ ] **Did you search for existing components before creating new ones?**
- [ ] **Are you using AppToolbar instead of custom toolbars?**
- [ ] **Are you using WorkPageLayout or similar existing layouts?**
- [ ] **Are you extending existing patterns instead of creating duplicates?**
- [ ] Did you review 2-3 similar pages for established patterns?

### Performance & Architecture
- [ ] Is this a Server Component? (if yes, no `"use client"`)
- [ ] If Client Component, is it absolutely necessary?
- [ ] Are slow components wrapped in `<Suspense>`?
- [ ] Does the form use Server Actions instead of client state?
- [ ] **Is state management using Zustand (NOT React Context)?**
- [ ] Are Zustand stores organized in `/src/lib/stores/`?
- [ ] Are shallow selectors used to prevent unnecessary re-renders?
- [ ] Is static content using ISR (`export const revalidate`)?

### Quality & Best Practices
- [ ] Are images using `next/image` (not `<img>`)?
- [ ] Is bundle size monitored (`pnpm analyze:bundle`)?
- [ ] Does JSDoc explain the component type and optimizations?
- [ ] Are all hooks dependencies specified correctly?
- [ ] Is input validated server-side with Zod?
- [ ] Does the code follow existing naming and structure conventions?

---

## 🎨 COMPONENT TEMPLATES

### Server Component Template
```typescript
/**
 * [Component Name] - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 */

export default function ComponentName() {
  // Server-side data fetching
  const data = await fetchData();

  return (
    <div>
      {/* Static content */}
    </div>
  );
}
```

### Client Component Template
```typescript
"use client";

/**
 * [Component Name] - Client Component
 *
 * Client-side features:
 * - [List specific reasons for client component]
 * - Example: Interactive tooltips, state management
 */

import { useState } from "react";

export function ComponentName() {
  const [state, setState] = useState();

  return (
    <div>
      {/* Interactive content */}
    </div>
  );
}
```

### Server Action Template
```typescript
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  // Define schema
});

export async function actionName(formData: FormData) {
  try {
    const data = schema.parse({
      field: formData.get("field"),
    });

    // Save to database

    revalidatePath("/path");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error"
      };
    }
    return { success: false, error: "Operation failed" };
  }
}
```

### Zustand Store Template
```typescript
/**
 * [Feature] Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 * - Organized in /src/lib/stores/ directory
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Define store state type
type FeatureStore = {
  // State
  items: Item[];
  selectedId: string | null;
  isLoading: boolean;

  // Actions
  setItems: (items: Item[]) => void;
  selectItem: (id: string) => void;
  clearSelection: () => void;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  reset: () => void;
};

// Initial state
const initialState = {
  items: [],
  selectedId: null,
  isLoading: false,
};

// Create store
export const useFeatureStore = create<FeatureStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setItems: (items) => set({ items }),

        selectItem: (id) => set({ selectedId: id }),

        clearSelection: () => set({ selectedId: null }),

        addItem: (item) => set((state) => ({
          items: [...state.items, item]
        })),

        removeItem: (id) => set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        })),

        reset: () => set(initialState),
      }),
      {
        name: "feature-storage", // localStorage key
        partialize: (state) => ({ items: state.items }), // Only persist items
      }
    ),
    { name: "FeatureStore" } // DevTools name
  )
);

// Usage in component
"use client";
import { useFeatureStore } from "@/lib/stores/feature-store";

export function MyComponent() {
  // Selective subscription - only re-renders when selectedId changes
  const selectedId = useFeatureStore((state) => state.selectedId);
  const selectItem = useFeatureStore((state) => state.selectItem);

  return <button onClick={() => selectItem("123")}>Select</button>;
}
```

### Proxy Template (Next.js 16+)
```typescript
/**
 * Next.js 16+ Proxy - Auth & Route Protection
 *
 * SECURITY CRITICAL:
 * - Use proxy.ts (NOT middleware.ts) in Next.js 16+
 * - NEVER rely solely on proxy for authorization
 * - ALWAYS validate auth in Server Actions and API routes
 * - Use RLS (Row Level Security) in Supabase
 *
 * Performance:
 * - Runs on Node.js runtime (not Edge)
 * - Lightweight session refresh only
 * - Minimal overhead on protected routes
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Allow requests if Supabase not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();

  // Protected routes
  const protectedPaths = ["/dashboard"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Auth pages
  const authPaths = ["/login", "/signup", "/auth"];
  const isAuthPath = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect unauthenticated users to login
  if (isProtectedPath && !session) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users to dashboard
  if (isAuthPath && session) {
    const redirectTo = request.nextUrl.searchParams.get("redirectTo");
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = redirectTo || "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

---

## 📈 PERFORMANCE MONITORING

### Metrics to Track
1. **Bundle Size**: Run `pnpm analyze:bundle` before major releases
2. **Build Time**: Should stay under 15 seconds
3. **Server Components %**: Target 65%+ (currently achieved)
4. **Core Web Vitals**: Monitor in production
   - LCP (Largest Contentful Paint) < 2.5s
   - FID (First Input Delay) < 100ms
   - CLS (Cumulative Layout Shift) < 0.1

### Bundle Analysis
- Reports saved to `.next/analyze/client.html` and `.next/analyze/server.html`
- Check for unexpected large dependencies
- Look for duplicate code across chunks
- Verify tree-shaking is working

---

## 🔄 VERSION HISTORY

- **v2.2** - Next.js 16 Proxy Pattern & Security Update (2025-11-02)
  - **BREAKING**: Migrated from middleware.ts to proxy.ts (Next.js 16+ requirement)
  - Added comprehensive proxy.ts documentation and template
  - Updated security guidelines to reflect CVE fix (x-middleware-subrequest bypass)
  - Emphasized NEVER relying solely on proxy for authorization
  - Added "Why proxy.ts?" section explaining security benefits
  - Updated all examples to use Next.js 16+ patterns
  - Added codemod migration instructions

- **v2.1** - Enhanced Component Reuse Guidelines (2025-10-29)
  - Strengthened "Extend Existing Infrastructure" rule (Critical Rule #5)
  - Added Component Discovery Process with 5-step checklist
  - Documented key infrastructure components (AppToolbar, WorkPageLayout, etc.)
  - Added WRONG vs RIGHT code examples for common patterns
  - Enhanced Code Review Checklist with infrastructure checks
  - Emphasized consistency over creativity for better maintainability

- **v2.0** - Advanced Performance Optimizations (2025-01-XX)
  - Converted 65% of pages to Server Components
  - Added Server Actions for forms
  - Implemented Streaming with Suspense
  - Added ISR for static pages
  - Configured bundle analysis
  - Created skeleton loading states

- **v1.0** - Initial comprehensive configuration (2025-10-07)
  - Established core rules and standards
  - Defined Next.js and Supabase best practices
  - Added coding conventions and testing standards
