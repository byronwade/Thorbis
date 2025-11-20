# Image Optimization Guide for Maximum SEO Visibility

**Last Updated:** 2025-11-20
**Status:** Active Implementation

---

## Overview

Image optimization is critical for:
- **AI Image Search** - 28% of Google searches are for images
- **Page Speed** - Images are typically 50-70% of page weight
- **Voice Search** - AI assistants read image alt text
- **Accessibility** - Screen readers require descriptive alt text
- **User Experience** - Fast-loading, high-quality images

**Target:** All images < 100KB with proper alt text and lazy loading.

---

## 1. Image Performance Audit

### Current Implementation Status

#### ✅ Already Using Next.js Image Component

```typescript
// Good - Using next/image
import Image from "next/image";

<Image
  src="/hero-image.jpg"
  alt="Field service technician using Thorbis mobile app"
  width={1200}
  height={630}
  priority // Above-the-fold images
/>
```

**Benefits:**
- Automatic WebP/AVIF conversion
- Responsive image sizing
- Lazy loading by default
- Blur placeholder support

#### ⚠️ Audit Required

**Action:** Run full image audit across all pages

```bash
# Find all image usage in codebase
grep -r "<img" src/app/ src/components/

# Expected: Should return 0 results (all should use <Image />)
```

---

## 2. Image Formats & Compression

### Recommended Format Priority

1. **AVIF** (Best compression, modern browsers)
   - 50% smaller than WebP
   - Supported by Chrome, Edge, Firefox, Safari 16+
   - Fallback to WebP automatically via Next.js

2. **WebP** (Great compression, wide support)
   - 30% smaller than JPEG
   - Supported by all modern browsers
   - Automatic via Next.js Image component

3. **JPEG/PNG** (Fallback only)
   - Use for legacy browser support
   - Next.js automatically generates

### Compression Guidelines

| Image Type | Format | Max Size | Quality | Use Case |
|------------|--------|----------|---------|----------|
| Hero Images | AVIF/WebP | 150KB | 85% | Homepage, feature pages |
| Feature Screenshots | AVIF/WebP | 100KB | 80% | Product demonstrations |
| OG Images | JPEG | 200KB | 90% | Social media sharing |
| Icons/Logos | SVG | 10KB | - | UI elements, brand assets |
| Thumbnails | AVIF/WebP | 20KB | 75% | Blog cards, KB previews |
| Team Photos | AVIF/WebP | 80KB | 85% | About page, author bios |

---

## 3. Alt Text Best Practices

### AI-Optimized Alt Text Formula

**Pattern:** `[Subject] + [Action] + [Context] + [Brand]`

#### ✅ Good Alt Text (AI-Friendly)

```typescript
// Feature page hero
alt="HVAC technician scheduling jobs on Thorbis mobile app dashboard"

// Screenshot
alt="Thorbis invoice management interface showing payment tracking and automation"

// Team photo
alt="Sarah Johnson, Senior Product Manager at Thorbis, field service software expert"

// Blog featured image
alt="Field service dispatcher managing technician routes with Thorbis scheduling software"
```

#### ❌ Bad Alt Text (Avoid)

```typescript
// Too generic
alt="Dashboard"
alt="Screenshot"
alt="Image 1"

// Keyword stuffing
alt="field service management software FSM tools HVAC plumbing scheduling invoicing best software"

// Empty
alt=""  // Only use for purely decorative images
```

### Alt Text Guidelines

1. **Length:** 125-150 characters (optimal for screen readers)
2. **Keywords:** Include 1-2 target keywords naturally
3. **Descriptive:** Explain what's happening in the image
4. **Context:** Connect to page content
5. **Brand:** Include "Thorbis" for product screenshots

---

## 4. Semantic File Naming

### File Naming Convention

**Pattern:** `{page}-{subject}-{modifier}.{ext}`

#### ✅ Good File Names

```
homepage-hero-field-technician-mobile-app.jpg
features-scheduling-calendar-view-drag-drop.webp
industries-hvac-technician-installing-thermostat.avif
blog-invoice-automation-payment-tracking.jpg
og-image-ai-assistant-24-7-call-handling.jpg
```

#### ❌ Bad File Names

```
IMG_1234.jpg
screenshot.png
image-final-v2-FINAL.jpg
photo.webp
untitled.jpg
```

### Benefits

- **SEO:** File names appear in image search
- **AI Understanding:** Helps AI categorize images
- **Organization:** Easy to find and manage
- **Accessibility:** Screen readers may read file names

---

## 5. Responsive Images Strategy

### Next.js Image Sizes Configuration

```typescript
// next.config.ts
export default {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
  }
}
```

### Responsive Image Patterns

#### Hero Images (Full Width)

```typescript
<Image
  src="/homepage-hero.jpg"
  alt="Field service management platform for HVAC, plumbing, and electrical contractors"
  fill
  sizes="100vw"
  priority
  className="object-cover"
  quality={85}
/>
```

#### Feature Screenshots (Constrained Width)

```typescript
<Image
  src="/features-scheduling-calendar.jpg"
  alt="Thorbis drag-and-drop scheduling calendar with technician availability"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={80}
/>
```

#### Blog Thumbnails (Fixed Size)

```typescript
<Image
  src="/blog-invoice-automation-thumbnail.jpg"
  alt="Invoice automation guide for field service businesses"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"
  quality={75}
/>
```

---

## 6. Image Schema Markup

### ImageObject Schema

Add to product pages, features, blog posts:

```typescript
import Script from "next/script";

const imageSchema = {
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "url": "https://thorbis.com/images/features-ai-assistant.jpg",
  "contentUrl": "https://thorbis.com/images/features-ai-assistant.jpg",
  "caption": "Thorbis AI Assistant handling customer calls 24/7",
  "description": "Screenshot of Thorbis AI-powered phone assistant managing incoming customer calls, scheduling appointments, and answering questions",
  "name": "Thorbis AI Assistant Interface",
  "creator": {
    "@type": "Organization",
    "name": "Thorbis"
  },
  "copyrightHolder": {
    "@type": "Organization",
    "name": "Thorbis, Inc."
  },
  "copyrightYear": "2025",
  "license": "https://thorbis.com/terms"
};

<Script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }}
/>
```

---

## 7. Open Graph Images (Social Sharing)

### OG Image Requirements

**Dimensions:**
- **Facebook/LinkedIn:** 1200x630px (1.91:1 ratio)
- **Twitter:** 1200x630px (summary_large_image)
- **Pinterest:** 1000x1500px (2:3 ratio - optional)

**File Size:** < 200KB (8MB max, but smaller is better)

**Format:** JPEG or PNG (JPEG recommended for photos)

### Dynamic OG Images

```typescript
// src/app/og-image/route.tsx
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Thorbis";
  const description = searchParams.get("description") || "";

  return new ImageResponse(
    (
      <div style={{
        fontSize: 60,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        padding: "40px",
      }}>
        <div style={{ maxWidth: "1000px" }}>
          <h1 style={{ fontSize: 80, margin: 0 }}>{title}</h1>
          <p style={{ fontSize: 40, opacity: 0.9 }}>{description}</p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```

**Usage:**

```typescript
// In metadata
export const metadata = {
  openGraph: {
    images: [
      {
        url: `/og-image?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
        width: 1200,
        height: 630,
      }
    ]
  }
}
```

---

## 8. Image CDN & Caching

### Next.js Image Optimization (Vercel)

**Current Setup:** ✅ Automatic via Vercel deployment

**Benefits:**
- Global CDN with 100+ edge locations
- Automatic format conversion (AVIF, WebP)
- Device-specific image sizing
- 1-year browser caching
- On-demand image optimization

### Cache Headers

```typescript
// next.config.ts
export default {
  images: {
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.thorbis.com',
        pathname: '/**',
      },
    ],
  }
}
```

---

## 9. Image Loading Strategies

### Priority Loading (Above-the-Fold)

```typescript
// Homepage hero - loads immediately
<Image
  src="/homepage-hero.jpg"
  alt="..."
  priority
  fill
/>
```

### Lazy Loading (Below-the-Fold)

```typescript
// Feature screenshots - loads when scrolled into view
<Image
  src="/features-screenshot.jpg"
  alt="..."
  loading="lazy" // Default behavior
  width={1200}
  height={800}
/>
```

### Blur Placeholder

```typescript
// Blog post images - show blur while loading
<Image
  src="/blog-featured-image.jpg"
  alt="..."
  width={1200}
  height={630}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Base64 blur
/>
```

---

## 10. Image Audit Checklist

### Automated Audit

```bash
# 1. Find all <img> tags (should be 0)
grep -r "<img" src/app/ src/components/

# 2. Find all Image components without alt text
grep -r "<Image" src/ | grep -v "alt="

# 3. Find large images (> 200KB)
find public/images -type f -size +200k

# 4. Check image formats
find public/images -type f | grep -E "\.(jpg|jpeg|png|gif)$"
```

### Manual Audit

- [ ] All images use `<Image />` component
- [ ] All images have descriptive alt text
- [ ] Hero images use `priority` prop
- [ ] Below-fold images use lazy loading
- [ ] All images < 200KB (except OG images)
- [ ] Semantic file naming convention
- [ ] Open Graph images are 1200x630px
- [ ] Image schema added to key pages
- [ ] Responsive sizes configured
- [ ] AVIF/WebP formats enabled

---

## 11. Image SEO Best Practices

### For AI Image Search

1. **Structured Data**
   - Add ImageObject schema to product images
   - Include caption, description, creator
   - Add license and copyright info

2. **Image Sitemaps**
   - Create dedicated image sitemap
   - Include all marketing images
   - Add image:caption and image:title

3. **Context**
   - Surround images with relevant text
   - Use descriptive headings
   - Add figure captions

### Image Sitemap (Optional Enhancement)

```typescript
// src/app/image-sitemap.xml/route.ts
export async function GET() {
  const images = [
    {
      loc: "https://thorbis.com/images/features-scheduling.jpg",
      caption: "Drag-and-drop scheduling calendar with technician availability",
      title: "Thorbis Scheduling Feature",
      license: "https://thorbis.com/terms"
    },
    // ... more images
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${images.map(img => `
        <url>
          <loc>${img.loc}</loc>
          <image:image>
            <image:loc>${img.loc}</image:loc>
            <image:caption>${img.caption}</image:caption>
            <image:title>${img.title}</image:title>
            <image:license>${img.license}</image:license>
          </image:image>
        </url>
      `).join('')}
    </urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" }
  });
}
```

---

## 12. Implementation Timeline

### Phase 1: Audit (Week 1)

- [ ] Run automated image audit
- [ ] Identify all <img> tags to convert to <Image />
- [ ] Check alt text quality on all images
- [ ] Measure current page speed scores

### Phase 2: Optimization (Week 2)

- [ ] Convert all <img> tags to <Image />
- [ ] Update all alt text with AI-optimized descriptions
- [ ] Rename image files with semantic naming
- [ ] Compress large images (> 200KB)

### Phase 3: Enhancement (Week 3)

- [ ] Add ImageObject schema to key pages
- [ ] Implement blur placeholders for blog images
- [ ] Create dynamic OG image generator
- [ ] Set up image sitemap (optional)

### Phase 4: Monitoring (Ongoing)

- [ ] Track Core Web Vitals (LCP, CLS)
- [ ] Monitor image search impressions (Google Search Console)
- [ ] A/B test different image styles
- [ ] Update images quarterly

---

## 13. Performance Targets

| Metric | Current | Target | Impact |
|--------|---------|--------|--------|
| Largest Contentful Paint (LCP) | TBD | < 2.5s | ⭐⭐⭐ |
| Cumulative Layout Shift (CLS) | TBD | < 0.1 | ⭐⭐⭐ |
| First Input Delay (FID) | TBD | < 100ms | ⭐⭐ |
| Total Page Weight | TBD | < 1MB | ⭐⭐⭐ |
| Image Weight % | TBD | < 40% | ⭐⭐ |
| Images Using next/image | TBD | 100% | ⭐⭐⭐ |
| Images with Alt Text | TBD | 100% | ⭐⭐⭐ |
| AVIF/WebP Adoption | TBD | 100% | ⭐⭐ |

---

## 14. Tools & Resources

### Audit Tools

- **Google PageSpeed Insights** - https://pagespeed.web.dev/
- **WebPageTest** - https://www.webpagetest.org/
- **Chrome DevTools** - Lighthouse audit
- **Screaming Frog** - Image audit crawler
- **ImageOptim** - Batch image compression

### Compression Tools

- **Squoosh** - https://squoosh.app/ (WebP/AVIF conversion)
- **TinyPNG** - https://tinypng.com/ (Smart compression)
- **ImageOptim** - https://imageoptim.com/ (Mac app)
- **ShortPixel** - https://shortpixel.com/ (Bulk optimization)

### Testing Tools

- **Google Rich Results Test** - Test structured data
- **Facebook Sharing Debugger** - Test OG images
- **Twitter Card Validator** - Test Twitter cards
- **LinkedIn Post Inspector** - Test LinkedIn sharing

---

## 15. Action Items Summary

### Immediate (This Week)
1. ✅ Document image optimization guidelines
2. ⏳ Run automated image audit
3. ⏳ Identify priority pages for optimization
4. ⏳ Create image naming convention template

### Short-Term (Next 2 Weeks)
1. Convert all <img> tags to <Image />
2. Update alt text on all images
3. Compress large images
4. Implement blur placeholders

### Long-Term (Next Month)
1. Add ImageObject schema to key pages
2. Create dynamic OG image generator
3. Set up image sitemap
4. Implement automated image optimization pipeline

---

**Next Steps:**
1. Run full image audit across site
2. Prioritize optimization work
3. Assign development resources
4. Track performance improvements
5. Iterate based on Core Web Vitals data
