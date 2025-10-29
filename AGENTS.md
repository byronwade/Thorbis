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
Add `"use client"` only when absolutely necessary (interactivity, hooks, browser APIs)
Minimize client bundle size - extract smallest possible interactive parts to client comps
Use Server Components for all data fetching by default
Use Server Actions for mutations vs API routes when possible
Implement streaming with Suspense boundaries for slow data
Use dynamic imports for code splitting heavy client comps
Always use `next/image` with width, height, and proper optimization
Implement proper error boundaries in app directory
Use `force-cache` or `revalidate` strategies appropriately in fetch calls
Keep client bundles under 200KB gzipped
Prefetch critical resources and optimize fonts
Use edge runtime for API routes when possible
Never fetch data in useEffect - use Server Components or React Query
Memoize expensive computations with useMemo
Memoize callbacks with useCallback when passed to child comps
Use React.memo for comps that render frequently with same props
Implement progressive rendering with nested Suspense boundaries
Use Tailwind @apply sparingly - prefer utility classes
Always support dark mode with dark: prefixes
Validate all user input server-side with Zod schemas
Enable RLS policies on ALL Supabase tables
Never trust client input - validate and sanitize server-side
Use parameterized queries only - no string concatenation
Implement rate limiting on all API routes
Store secrets in env vars, never commit .env files
Use NEXT_PUBLIC_ prefix only for truly public env vars
Use HTTP-only secure cookies for session management
Implement CSRF protection for forms
Sanitize all user-generated content before rendering
Log security events but never expose sensitive info in errors
Use service role key only in secure server environments
Validate session server-side for protected routes
Use middleware for auth protection and redirects
Enable CSP headers in next.config.js
Hash passwords with bcrypt, never store plain text
Implement email confirmation for new users
Use secure password reset flows with time-limited tokens
Never expose database errors to client
Validate file uploads (type, size, content)
Implement proper CORS policies
Use HTTPS in production always
Audit dependencies regularly for vulnerabilities
Follow principle of least privilege for database access
Enable SQL injection protection with RLS and parameterized queries
Implement XSS protection by escaping HTML
Use proper authentication flow with Supabase auth.getUser()
Never use auth.getSession() alone for server-side auth
Validate JWT tokens server-side
Implement proper session refresh logic
Use secure, random tokens for sensitive operations
Add proper TypeScript types to all functions and components
Use strict TypeScript mode always
Avoid any type - use unknown if type truly unknown
Define interfaces for all props and API responses
Use type inference where possible to reduce verbosity
Export types separately with export type
Use discriminated unions for complex state
Prefer composition over inheritance
Keep functions small and focused (single responsibility)
Use Zod for runtime validation and type inference
Add JSDoc comments for public APIs
Structure imports: React/Next → 3rd party → internal → relative → types
Keep files under 300 lines - split when larger
Use kebab-case for file names except components (PascalCase)
Name files descriptively - avoid generic names like utils.ts
Colocate related files (component + test + types)
Use barrel exports (index.ts) sparingly to avoid bundle bloat
Extract magic numbers and strings to constants
Use descriptive variable names - avoid abbreviations
Write self-documenting code - comments explain why not what
Test all critical paths with unit and integration tests
Use React Testing Library for component tests
Use Playwright for E2E tests
Aim for 80% code coverage minimum
Test error states and edge cases
Mock external dependencies in tests
Write tests that test behavior not implementation
Use descriptive test names that explain expected behavior
Implement proper loading states with skeletons
Show optimistic updates for better perceived performance
Implement proper error handling with user-friendly messages
Use semantic HTML elements for accessibility
Maintain proper heading hierarchy (h1 → h6)
Add alt text to all images
Include ARIA labels where needed
Support keyboard navigation
Ensure 4.5:1 color contrast ratio
Add focus indicators to interactive elements
Test with screen readers
Support reduced motion preferences
Make forms accessible with proper labels and error messages
Use proper button types (button, submit, reset)
Add loading and disabled states to buttons
Implement proper form validation with clear error messages
Use React Hook Form for complex forms
Validate forms on both client and server
Show validation errors inline
Prevent double submissions with disabled state
Use proper input types (email, tel, url, etc.)
Implement autocomplete attributes
Add proper CSRF protection to forms
Use Server Actions for form submissions
Monitor Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
Use Vercel Analytics and Speed Insights
Implement error tracking (Sentry, LogRocket, etc.)
Log performance metrics
Monitor API response times
Track conversion funnels
Implement proper observability
Use Next.js built-in performance profiling
Optimize images with blur placeholders
Implement lazy loading for below-fold content
Use proper cache headers
Minimize CLS with proper image dimensions
Optimize LCP by prioritizing hero images
Reduce JavaScript execution time
Minimize main thread work
Use web workers for heavy computations
Implement service workers for offline support
Use proper loading strategies (eager, lazy, prefetch)
Minimize bundle size by tree-shaking unused code
Use compression (gzip, brotli)
Implement CDN for static assets
Use proper database indexes
Optimize database queries (avoid N+1 problems)
Use connection pooling
Implement caching strategies (Redis, in-memory)
Use proper pagination for large datasets
Implement infinite scroll or load more patterns
Avoid over-fetching data - fetch only what's needed
Use proper SQL query optimization
Implement database query monitoring
Use read replicas for read-heavy workloads
Implement proper backup strategies
Use database migrations for schema changes
Never run dev servers or builds without explicit permission
Ask before executing destructive operations
Follow existing project patterns and conventions
Use consistent code formatting with Prettier
Use ESLint for code quality
Set up Git hooks with Husky for pre-commit checks
Use conventional commits for commit messages
Keep commits small and focused
Write descriptive commit messages
Use feature branches and pull requests
Require code reviews before merging
Use proper Git workflow (main, develop, feature branches)
Tag releases with semantic versioning
Keep main branch always deployable
Use CI/CD for automated testing and deployment
Run linting and tests in CI pipeline
Implement preview deployments for PRs
Use environment-specific configs
Implement proper rollback strategies
Monitor deployments for errors
Use feature flags for gradual rollouts
Implement blue-green deployments
Use proper logging and monitoring in production
Set up alerts for critical errors
Implement health checks and readiness probes
Use proper resource limits and autoscaling
Implement proper database backup and recovery
Use proper security headers in production
Implement rate limiting and DDoS protection
Use WAF for additional security
Regularly update dependencies
Monitor for security vulnerabilities
Implement proper incident response procedures
**NEVER use React Context for state management - ALWAYS use Zustand**
Store all Zustand stores in `/src/lib/stores/` directory
Name stores by feature domain: `[feature]-store.ts` (e.g., `communication-store.ts`, `schedule-store.ts`)
One store per feature - keep stores focused and small
Use TypeScript types for all store state and actions
Use shallow selectors to prevent unnecessary re-renders: `const value = useStore((state) => state.value)`
No provider wrappers needed - import stores directly in components
Keep store files under 100 lines when possible
Document store purpose and state shape with JSDoc comments
Use `set` and `get` functions for state updates
Use immer middleware for complex nested state updates
Use persist middleware for localStorage persistence when needed
Use devtools middleware in development for debugging
Group related actions together in the store
Use descriptive action names that indicate what they do
Avoid circular dependencies between stores
Use computed values with selectors, not stored derived state
Reset store state on logout or session end
Test stores independently from components
Use Zustand for: UI state, form state, filters, view preferences, cached data
Exception: Built-in Next.js contexts (ThemeProvider, etc.) are allowed
Exception: Third-party library contexts are allowed when no alternative exists
Benefits: Smaller bundle size, better performance, no provider hell, simpler code
Anti-pattern: Creating Context + Provider when Zustand would work better
Anti-pattern: Props drilling when state should be in a store
Anti-pattern: Multiple useState calls that should be unified in a store