# Unified Public Layout System

**Complete guide to the unified layout system for all public-facing pages (marketing, auth, documentation, legal).**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Page Variants](#page-variants)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Adding New Pages](#adding-new-pages)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)

---

## Overview

The Unified Public Layout System provides a centralized, type-safe way to manage layouts for all public pages. Instead of manually configuring headers, footers, sidebars, and content containers on each page, layouts are automatically determined by route patterns.

### Benefits

- **Single Source of Truth**: All layout configuration in one file
- **Type-Safe**: Comprehensive TypeScript types prevent errors
- **Consistent UX**: Ensures uniform layout patterns across all pages
- **Easy to Maintain**: Add new pages by adding a single rule
- **No Duplication**: No more duplicated header/footer code
- **SEO Optimized**: Proper meta tags and structured data per page type

### Key Files

```
src/
├── lib/layout/
│   └── unified-public-layout-config.tsx  # All layout rules and configuration
├── components/layout/
│   └── public-layout-wrapper.tsx         # Client component that renders layouts
├── components/hero/
│   └── marketing-header.tsx              # Header with variant support
└── components/layout/
    └── footer.tsx                        # Footer with variant support
```

---

## Architecture

### How It Works

1. **Route Matching**: When a page loads, `PublicLayoutWrapper` uses `usePathname()` to get the current route
2. **Configuration Lookup**: Calls `getPublicLayoutConfig(pathname)` to find the matching layout rule
3. **Priority-Based**: Rules are sorted by priority (highest first), first match wins
4. **Render Layout**: Renders the appropriate variant with correct header/footer/content structure

### Flow Diagram

```
User navigates to /pricing
  ↓
PublicLayoutWrapper (client component)
  ↓
getPublicLayoutConfig("/pricing")
  ↓
Matches PRICING pattern (priority 68)
  ↓
Returns: variant="wide", header={default}, footer={default}
  ↓
Renders wide layout with full header/footer
```

---

## Page Variants

### 1. **hero** - Full-Width Hero Pages

**Use For**: Homepage, major landing pages

**Structure**:
- Header: Transparent (becomes solid on scroll)
- Content: Full-width, no padding
- Footer: Full footer

**Example Pages**:
- Homepage (/)

```typescript
variant: "hero"
header: { variant: "transparent", showCTA: true }
content: { maxWidth: "full", padding: "none" }
```

### 2. **standard** - Container-Width Content

**Use For**: Most marketing pages

**Structure**:
- Header: Default with CTA
- Content: 7xl max-width container
- Footer: Full footer

**Example Pages**:
- Features (/features)
- About (/about)
- Contact (/contact)
- Industries (/industries/hvac)

```typescript
variant: "standard"
header: { variant: "default", showCTA: true }
content: { maxWidth: "7xl", padding: "md" }
```

### 3. **wide** - Wider Container

**Use For**: Pages with complex UIs, tables, calculators

**Structure**:
- Header: Default with CTA
- Content: screen-xl max-width
- Footer: Full footer

**Example Pages**:
- Pricing (/pricing)
- ROI Calculator (/roi)
- Comparisons (/vs/servicetitan)

```typescript
variant: "wide"
header: { variant: "default", showCTA: true }
content: { maxWidth: "screen-xl", padding: "md" }
```

### 4. **documentation** - Sidebar + Content

**Use For**: Documentation pages, knowledge base articles

**Structure**:
- Header: Default with CTA
- Sidebar: Collapsible navigation (left)
- Content: screen-2xl max-width
- Footer: Full footer

**Example Pages**:
- KB Articles (/kb/getting-started/installation)
- KB Categories (/kb/getting-started)
- API Docs (/api-docs/authentication)

```typescript
variant: "documentation"
header: { variant: "default", showCTA: true }
sidebar: { show: true, type: "kb", position: "left" }
content: { maxWidth: "screen-2xl", padding: "none" }
```

### 5. **minimal** - Simple Centered Content

**Use For**: Legal pages, simple informational pages

**Structure**:
- Header: Minimal (logo only, no CTA)
- Content: 3xl max-width container
- Footer: Minimal footer (reduced links)

**Example Pages**:
- Terms of Service (/terms)
- Privacy Policy (/privacy)
- Cookie Policy (/cookies)
- GDPR (/gdpr)

```typescript
variant: "minimal"
header: { variant: "minimal", showCTA: false }
footer: { variant: "minimal" }
content: { maxWidth: "3xl", padding: "md" }
```

### 6. **auth-centered** - Centered Auth Form

**Use For**: Login, register, password reset

**Structure**:
- Header: None
- Content: Centered form with gradient background
- Footer: None

**Example Pages**:
- Login (/login)
- Register (/register)
- Forgot Password (/forgot-password)

```typescript
variant: "auth-centered"
header: { show: false }
footer: { show: false }
content: {
  maxWidth: "xl",
  background: "gradient",
  minHeight: "screen"
}
```

### 7. **auth-wizard** - Full-Screen Stepped Flow

**Use For**: Multi-step onboarding flows

**Structure**:
- Header: None
- Content: Full-width, full-height
- Footer: None

**Example Pages**:
- (Reserved for future onboarding wizard)

```typescript
variant: "auth-wizard"
header: { show: false }
footer: { show: false }
content: { maxWidth: "full", minHeight: "screen" }
```

### 8. **auth-verification** - Simple Centered Message

**Use For**: Email verification, auth callbacks, success messages

**Structure**:
- Header: None
- Content: Centered message (narrower than auth-centered)
- Footer: None

**Example Pages**:
- Email Verification (/verify-email)
- Auth Callback (/auth/callback)

```typescript
variant: "auth-verification"
header: { show: false }
footer: { show: false }
content: {
  maxWidth: "2xl",
  background: "gradient",
  minHeight: "screen"
}
```

### 9. **embedded** - No Chrome

**Use For**: Embedded widgets, contract signing, iframes

**Structure**:
- Header: None
- Content: Full-width, transparent background
- Footer: None

**Example Pages**:
- Contract Signing (/contracts/sign/[id])

```typescript
variant: "embedded"
header: { show: false }
footer: { show: false }
content: {
  maxWidth: "full",
  background: "transparent",
  minHeight: "screen"
}
```

### 10. **status** - Minimal Status Page

**Use For**: System status pages

**Structure**:
- Header: Minimal
- Content: Standard width
- Footer: Minimal footer

**Example Pages**:
- System Status (/status)

```typescript
variant: "status"
header: { variant: "minimal", showCTA: false }
footer: { variant: "minimal" }
content: { maxWidth: "7xl", padding: "md" }
```

---

## Configuration

### Location

All layout rules are defined in:
```
/src/lib/layout/unified-public-layout-config.tsx
```

### Rule Structure

Each rule consists of:

```typescript
{
  pattern: /^\/pricing$/,           // RegExp to match route
  config: {
    variant: "wide",                // Page variant
    header: {                       // Header configuration
      show: true,
      variant: "default",
      showCTA: true,
    },
    footer: {                       // Footer configuration
      show: true,
      variant: "default",
    },
    content: {                      // Content area configuration
      maxWidth: "screen-xl",
      padding: "md",
      paddingY: "lg",
      background: "default",
      minHeight: "none",
    },
  },
  priority: 68,                     // Higher = checked first
  description: "Pricing - wide layout for calculator",
}
```

### Priority System

Rules are matched by priority (highest first):

- **100+**: Special pages (embedded, status, TV mode)
- **90-99**: Auth pages
- **80-89**: Documentation pages
- **70-79**: Legal pages
- **60-69**: Key landing pages (home, pricing)
- **50-59**: Feature pages
- **40-49**: Comparison pages
- **30-39**: Company pages
- **20-29**: Other pages

---

## Usage Examples

### Example 1: Standard Marketing Page

No configuration needed! Just create the page:

```typescript
// app/(marketing)/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Thorbis</h1>
      <p>We're building the future of field service management...</p>
    </div>
  );
}
```

The page automatically gets:
- Default header with CTA
- 7xl max-width container
- Full footer
- Proper padding

### Example 2: Legal Page (Minimal Layout)

```typescript
// app/(marketing)/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <article className="prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: January 2025</p>
      {/* Content automatically centered in 3xl container */}
    </article>
  );
}
```

Automatically gets:
- Minimal header (no CTA button)
- 3xl max-width (narrower for readability)
- Minimal footer
- Optimized for long-form content

### Example 3: Documentation Page with Sidebar

```typescript
// app/(marketing)/kb/getting-started/page.tsx
export default function GettingStartedPage() {
  return (
    <div>
      <h1>Getting Started</h1>
      <p>Welcome to Thorbis...</p>
      {/* KBSidebar automatically rendered on left */}
    </div>
  );
}
```

Automatically gets:
- KB sidebar on left
- Documentation layout
- Proper content width
- Full header/footer

---

## Adding New Pages

### Step 1: Determine Variant

Choose the appropriate variant based on your page type:
- Simple content page? → **standard**
- Legal/policy page? → **minimal**
- Complex UI/calculator? → **wide**
- Documentation? → **documentation**
- Auth form? → **auth-centered**

### Step 2: Add Route Pattern

In `unified-public-layout-config.tsx`, add to `PUBLIC_ROUTE_PATTERNS`:

```typescript
export const PUBLIC_ROUTE_PATTERNS = {
  // ... existing patterns
  MY_NEW_PAGE: /^\/my-new-page$/,
} as const;
```

### Step 3: Add Layout Rule

In the same file, add to `PUBLIC_LAYOUT_RULES`:

```typescript
{
  pattern: PUBLIC_ROUTE_PATTERNS.MY_NEW_PAGE,
  config: {
    variant: "standard",              // Choose variant
    header: DEFAULT_HEADER,           // Or customize
    footer: DEFAULT_FOOTER,           // Or customize
    content: STANDARD_CONTENT,        // Or customize
  },
  priority: 50,                       // Set priority
  description: "My new page - standard layout",
},
```

### Step 4: Create Page Component

```typescript
// app/(marketing)/my-new-page/page.tsx
export default function MyNewPage() {
  return (
    <div>
      <h1>My New Page</h1>
      {/* Content here - layout handled automatically */}
    </div>
  );
}
```

**That's it!** No need to manually add headers, footers, or containers.

---

## Best Practices

### 1. Use Existing Variants

Before creating custom configuration, check if an existing variant fits your needs. The 10 predefined variants cover 95% of use cases.

### 2. Consistent Priorities

Follow the priority ranges:
- **100+**: Truly exceptional pages only
- **90-99**: All auth pages
- **80-89**: All documentation
- **70-79**: Legal pages
- **60-69**: Key landing pages
- **50 and below**: Everything else

### 3. Reuse Content Configs

Use the predefined content configs when possible:
- `HERO_CONTENT`
- `STANDARD_CONTENT`
- `WIDE_CONTENT`
- `DOCUMENTATION_CONTENT`
- `MINIMAL_CONTENT`
- `AUTH_CENTERED_CONTENT`

### 4. Test Multiple Screen Sizes

All variants are responsive, but test:
- Mobile (375px)
- Tablet (768px)
- Desktop (1280px)
- Large Desktop (1920px)

### 5. Document Custom Rules

Always add a `description` to your layout rules:

```typescript
{
  pattern: /^\/my-page$/,
  config: { /* ... */ },
  priority: 50,
  description: "My page - explains why custom config needed",
}
```

---

## Migration Guide

### Migrating Existing Pages

#### Before (Manual Layout)

```typescript
// Old way - duplicated code
import { MarketingHeader } from "@/components/hero/marketing-header";
import { Footer } from "@/components/layout/footer";

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <h1>Features</h1>
          {/* Content */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

#### After (Unified Layout)

```typescript
// New way - automatic layout
export default function FeaturesPage() {
  return (
    <div>
      <h1>Features</h1>
      {/* Content - layout handled automatically */}
    </div>
  );
}
```

Layout is automatically applied by the parent `(marketing)` layout which uses `PublicLayoutWrapper`.

### Migration Checklist

- [ ] Remove manual header/footer imports
- [ ] Remove manual container/padding classes
- [ ] Add route pattern to `PUBLIC_ROUTE_PATTERNS`
- [ ] Add layout rule to `PUBLIC_LAYOUT_RULES`
- [ ] Test responsive behavior
- [ ] Verify header/footer variants are correct
- [ ] Check page loads without errors

---

## Troubleshooting

### Issue: Page shows wrong layout

**Solution**: Check priority. Higher priority rules are matched first. Ensure your pattern is specific enough and priority is set correctly.

### Issue: Content overflows or has wrong width

**Solution**: Check the `maxWidth` setting in your content config. Use `full` for full-width, or container sizes like `7xl`, `screen-xl` for constrained width.

### Issue: Header shows on auth page

**Solution**: Verify your auth page pattern matches correctly and has `header: { show: false }` in config.

### Issue: Sidebar doesn't appear

**Solution**: Ensure `sidebar: { show: true, type: "kb" }` is in config and the page route matches a documentation variant rule.

---

## Related Documentation

- [Dashboard Layout System](./LAYOUT-SYSTEM.md) - For authenticated dashboard pages
- [Component Architecture](./COMPONENT-ARCHITECTURE.md) - Overall component patterns
- [Next.js 16 Guidelines](../CLAUDE.md) - Project-wide Next.js 16+ patterns

---

## Version History

- **v1.0** (2025-01-11) - Initial unified public layout system
  - 10 page variants
  - 60+ pre-configured routes
  - Header/footer variant support
  - Full TypeScript types
  - Automatic route-based configuration
