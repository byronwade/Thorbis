Concise rules for building accessible, fast, delightful UIs Use MUST/SHOULD/NEVER to guide decisions

## Interactions

- Keyboard
  - MUST: Full keyboard support per [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)
  - MUST: Visible focus rings (`:focus-visible`; group with `:focus-within`)
  - MUST: Manage focus (trap, move, and return) per APG patterns
- Targets & input
  - MUST: Hit target ≥24px (mobile ≥44px) If visual <24px, expand hit area
  - MUST: Mobile `<input>` font-size ≥16px or set:
    ```html
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
    ```
  - NEVER: Disable browser zoom
  - MUST: `touch-action: manipulation` to prevent double-tap zoom; set `-webkit-tap-highlight-color` to match design
- Inputs & forms (behavior)
  - MUST: Hydration-safe inputs (no lost focus/value)
  - NEVER: Block paste in `<input>/<textarea>`
  - MUST: Loading buttons show spinner and keep original label
  - MUST: Enter submits focused text input In `<textarea>`, ⌘/Ctrl+Enter submits; Enter adds newline
  - MUST: Keep submit enabled until request starts; then disable, show spinner, use idempotency key
  - MUST: Don’t block typing; accept free text and validate after
  - MUST: Allow submitting incomplete forms to surface validation
  - MUST: Errors inline next to fields; on submit, focus first error
  - MUST: `autocomplete` + meaningful `name`; correct `type` and `inputmode`
  - SHOULD: Disable spellcheck for emails/codes/usernames
  - SHOULD: Placeholders end with ellipsis and show example pattern (eg, `+1 (123) 456-7890`, `sk-012345…`)
  - MUST: Warn on unsaved changes before navigation
  - MUST: Compatible with password managers & 2FA; allow pasting one-time codes
  - MUST: Trim values to handle text expansion trailing spaces
  - MUST: No dead zones on checkboxes/radios; label+control share one generous hit target
- State & navigation
  - MUST: URL reflects state (deep-link filters/tabs/pagination/expanded panels) Prefer libs like [nuqs](https://nuqs.dev)
  - MUST: Back/Forward restores scroll
  - MUST: Links are links—use `<a>/<Link>` for navigation (support Cmd/Ctrl/middle-click)
- Feedback
  - SHOULD: Optimistic UI; reconcile on response; on failure show error and rollback or offer Undo
  - MUST: Confirm destructive actions or provide Undo window
  - MUST: Use polite `aria-live` for toasts/inline validation
  - SHOULD: Ellipsis (`…`) for options that open follow-ups (eg, "Rename…") and loading states (eg, "Loading…", "Saving…", "Generating…")
- Touch/drag/scroll
  - MUST: Design forgiving interactions (generous targets, clear affordances; avoid finickiness)
  - MUST: Delay first tooltip in a group; subsequent peers no delay
  - MUST: Intentional `overscroll-behavior: contain` in modals/drawers
  - MUST: During drag, disable text selection and set `inert` on dragged element/containers
  - MUST: No “dead-looking” interactive zones—if it looks clickable, it is
- Autofocus
  - SHOULD: Autofocus on desktop when there’s a single primary input; rarely on mobile (to avoid layout shift)

## Animation

- MUST: Honor `prefers-reduced-motion` (provide reduced variant)
- SHOULD: Prefer CSS > Web Animations API > JS libraries
- MUST: Animate compositor-friendly props (`transform`, `opacity`); avoid layout/repaint props (`top/left/width/height`)
- SHOULD: Animate only to clarify cause/effect or add deliberate delight
- SHOULD: Choose easing to match the change (size/distance/trigger)
- MUST: Animations are interruptible and input-driven (avoid autoplay)
- MUST: Correct `transform-origin` (motion starts where it “physically” should)

## Layout

- SHOULD: Optical alignment; adjust by ±1px when perception beats geometry
- MUST: Deliberate alignment to grid/baseline/edges/optical centers—no accidental placement
- SHOULD: Balance icon/text lockups (stroke/weight/size/spacing/color)
- MUST: Verify mobile, laptop, ultra-wide (simulate ultra-wide at 50% zoom)
- MUST: Respect safe areas (use env(safe-area-inset-*))
- MUST: Avoid unwanted scrollbars; fix overflows
- Spacing scale
  - MUST: Use consistent spacing scale: gap-1.5 (6px), gap-2 (8px), gap-3 (12px), gap-4 (16px), gap-6 (24px)
  - MUST: Container padding: px-4 py-3 (mobile) → md:px-6 (desktop) for standard pages
  - SHOULD: Use gap utilities for spacing between related elements (not margin)
  - MUST: Consistent button group spacing: gap-1.5 for related buttons
- Typography hierarchy
  - MUST: Page titles: `font-semibold text-base md:text-lg` (16px → 18px)
  - MUST: Subtitles: `text-muted-foreground text-sm` (14px)
  - MUST: Button labels: `font-medium text-sm` (14px)
  - MUST: Badge text: `font-medium text-xs` (12px)
  - MUST: Menu items: `text-sm` (14px)
- Responsive breakpoints
  - MUST: Mobile-first approach: design for mobile, enhance for desktop
  - MUST: Use Tailwind breakpoints consistently: `md:` (768px+), `lg:` (1024px+), `xl:` (1280px+)
  - SHOULD: Progressive disclosure: hide secondary actions on mobile, show on desktop
  - MUST: Test at 375px (mobile), 768px (tablet), 1280px (desktop), 1920px (large)

## Content & Accessibility

- SHOULD: Inline help first; tooltips last resort
- MUST: Skeletons mirror final content to avoid layout shift
- SHOULD: Prefer skeleton loaders over loading indicators for content loading; use loading indicators only for stateful/interactive components (buttons, form submissions, etc.)
- MUST: `<title>` matches current context
- MUST: No dead ends; always offer next step/recovery
- MUST: Design empty/sparse/dense/error states
- Error handling
  - MUST: Error boundaries catch runtime errors; show user-friendly fallback UI
  - SHOULD: Error messages are actionable (not just "Something went wrong")
  - MUST: Log errors for debugging; never expose sensitive error details in production UI
  - MUST: Provide "Try again" or recovery path from error states
- SHOULD: Curly quotes (“ ”); avoid widows/orphans
- MUST: Tabular numbers for comparisons (`font-variant-numeric: tabular-nums` or a mono like Geist Mono)
- MUST: Redundant status cues (not color-only); icons have text labels
- MUST: Don’t ship the schema—visuals may omit labels but accessible names still exist
- MUST: Use the ellipsis character `…` (not ``)
- MUST: `scroll-margin-top` on headings for anchored links; include a “Skip to content” link; hierarchical `<h1–h6>`
- MUST: Resilient to user-generated content (short/avg/very long)
- MUST: Locale-aware dates/times/numbers/currency
- MUST: Accurate names (`aria-label`), decorative elements `aria-hidden`, verify in the Accessibility Tree
- MUST: Icon-only buttons have descriptive `aria-label`
- MUST: Prefer native semantics (`button`, `a`, `label`, `table`) before ARIA
- SHOULD: Right-clicking the nav logo surfaces brand assets
- MUST: Use non-breaking spaces to glue terms: `10&nbsp;MB`, `⌘&nbsp;+&nbsp;K`, `Vercel&nbsp;SDK`

## Component Organization

- File naming
  - MUST: Use `-client.tsx` suffix for client components (eg, `kpi-card-client.tsx`, `unified-inbox-page-client.tsx`)
  - SHOULD: Extract minimal client parts; keep main component as server component
  - MUST: Co-locate related components (server + client variants in same directory)
- Component structure
  - MUST: Server components by default; add `"use client"` only when needed
  - SHOULD: Extract interactive parts into separate `-client.tsx` files
  - MUST: Keep client component boundaries small and focused

## Component Patterns

- Component composition
  - SHOULD: Use standardized layout components (StandardPageLayout, ListPageLayout, DetailPageLayout)
  - MUST: Consistent toolbar patterns across detail pages (back button, status, actions, menu)
  - SHOULD: Reuse standardized UI patterns from design system
- State management
  - SHOULD: Use Zustand for shared client state; keep server state on server
  - MUST: Optimistic UI updates for mutations; reconcile on response
  - SHOULD: Virtualize large lists (100+ items) for performance

## Performance

- SHOULD: Test iOS Low Power Mode and macOS Safari
- MUST: Measure reliably (disable extensions that skew runtime)
- MUST: Track and minimize re-renders (React DevTools/React Scan)
- MUST: Profile with CPU/network throttling
- MUST: Batch layout reads/writes; avoid unnecessary reflows/repaints
- MUST: Mutations (`POST/PATCH/DELETE`) target <500 ms
- SHOULD: Prefer uncontrolled inputs; make controlled loops cheap (keystroke cost)
- MUST: Virtualize large lists (eg, `virtua`)
- MUST: Preload only above-the-fold images; lazy-load the rest
- MUST: Prevent CLS from images (explicit dimensions or reserved space)

## Design

- SHOULD: Layered shadows (ambient + direct)
- SHOULD: Crisp edges via semi-transparent borders + shadows
- SHOULD: Nested radii: child ≤ parent; concentric
- SHOULD: Hue consistency: tint borders/shadows/text toward bg hue
- MUST: Accessible charts (color-blind-friendly palettes)
- MUST: Meet contrast—prefer [APCA](https://apcacontrast.com/) over WCAG 2
- MUST: Increase contrast on `:hover/:active/:focus`
- SHOULD: Match browser UI to bg
- SHOULD: Avoid gradient banding (use masks when needed)
- Icons
  - MUST: Consistent icon sizes: size-4 (16px) for buttons, size-3.5 (14px) for menu items, size-5 (20px) for headers
  - MUST: Icon-only buttons have descriptive `aria-label`
  - SHOULD: Use lucide-react icons consistently across the app
- Visual hierarchy
  - MUST: Consistent use of muted colors for secondary content (`text-muted-foreground`)
  - SHOULD: Use semantic color tokens (primary, destructive, success, warning) instead of raw colors
