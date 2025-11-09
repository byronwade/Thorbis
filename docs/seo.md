# Thorbis SEO Playbook

This document describes how we keep Thorbis marketing surfaces optimised for search and discoverability. Use it as a checklist whenever you introduce a new page or change existing metadata.

## Architecture Overview

- **Core config:** `src/lib/seo/config.ts` centralises brand names, canonical URL helpers, title builders, and share image utilities. Do not duplicate these values elsewhere.
- **Metadata generator:** `src/lib/seo/metadata.ts` exposes `generateMetadata` which every marketing page uses to produce consistent meta tags (title, Open Graph, Twitter, hreflang slots).
- **Structured data builders:** `src/lib/seo/structured-data.ts` exports JSON‑LD factories covering Organisation, Website, Product/Software, Service, Article, HowTo, FAQ, Breadcrumb, and AggregateRating schemas. These are consumed with `<Script type="application/ld+json">` on each route.
- **Sitemap + robots:** `next-sitemap.config.mjs` multiplies our sitemaps (static pages, knowledge base Markdown, feeds) and writes them to `public/seo/`. `src/app/robots.ts` points crawlers to every sitemap entry.

## Adding or Updating a Marketing Page

1. **Metadata**
   - Import `generateMetadata` from `@/lib/seo/metadata`.
   - Provide an unbranded `title`, rich `description`, canonical `path`, and optionally `section`, `imageAlt`, `languageAlternates`, or `keywords`.
   - Keep the title page-specific—`generateMetadata` automatically applies the `| Thorbis` suffix.

2. **Structured data**
   - Use the appropriate builder(s) from `@/lib/seo/structured-data`.
   - Render via Next.js `<Script strategy="afterInteractive" type="application/ld+json">` to avoid inline `dangerouslySetInnerHTML`.
   - Include Breadcrumb schema for every detail view and, when relevant, add HowTo or FAQ blocks for rich results.

3. **Accessibility & consistency**
   - Match copy and naming conventions with `SEO_BRAND`, `buildTitle`, and helper utilities.
   - Keep icons decorative by setting `aria-hidden="true"` on SVGs used purely for presentation.

## Validating the SEO Toolchain

### Structured Data Type Check

Run the automated schema validator to ensure our builders produce JSON‑LD compliant with [`schema-dts`](https://github.com/google/schema-dts).

```bash
pnpm run seo:validate
```

The script lives at `scripts/validate-structured-data.ts` and will fail the build if required `@context`/`@type` fields are missing.

### Sitemap Generation

1. Populate `.env` with `NEXT_PUBLIC_SITE_URL` (defaults to `https://thorbis.com`).
2. Execute:

```bash
pnpm run sitemap
```

This command:

- Reads Markdown from `content/kb/**`
- Generates grouped XML files under `public/seo/` with image metadata and priorities
- Respects exclusions (`/contracts/sign/*`, downloads, APIs)

The following sitemap endpoints are advertised through `robots.txt`:

- `${SITE_URL}/sitemap.xml` (dynamic Next route)
- `${SITE_URL}/seo/thorbis-sitemap.xml` (generated index)
- `${SITE_URL}/kb/sitemap.xml` (dynamic knowledge base sitemap)
- `${SITE_URL}/feed` (RSS)

## Pre-deploy Checklist

- ☐ Run `pnpm run seo:validate`
- ☐ Regenerate static sitemaps with `pnpm run sitemap`
- ☐ Spot-check new pages in Google's [Rich Results Test](https://search.google.com/test/rich-results)
- ☐ Verify metadata using the browser's Inspect tool (title, description, canonical, OG tags)

By following this playbook every customer-facing surface will remain synchronised, fast to crawl, and ready to outrank legacy field service providers.

