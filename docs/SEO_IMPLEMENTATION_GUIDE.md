# SEO Implementation Guide - 2025 Best Practices

> **Complete guide to implementing world-class SEO for Thorbis marketing pages**
>
> Based on latest research: Google AI Overviews, Core Web Vitals 2025, E-E-A-T signals

---

## 📊 Current SEO Status

### ✅ What's Already Implemented

1. **Server-Side Rendering (SSR)**
   - ✅ All marketing pages are Server Components
   - ✅ No `"use client"` directives in page routes
   - ✅ Fast initial page load (< 2s target)

2. **Core Web Vitals Optimization**
   - ✅ Next.js 16+ with Turbopack for fast builds
   - ✅ Image optimization with `next/image` (AVIF, WebP)
   - ✅ Bundle optimization (tree-shaking, code splitting)
   - ✅ Cache Components enabled

3. **Existing Structured Data**
   - ✅ Organization schema
   - ✅ Website schema with search action
   - ✅ Breadcrumb schema
   - ✅ FAQ schema
   - ✅ SoftwareApplication schema
   - ✅ Service schema
   - ✅ Article schema
   - ✅ HowTo schema
   - ✅ Review/AggregateRating schema

4. **Metadata**
   - ✅ Comprehensive Open Graph tags
   - ✅ Twitter Card support
   - ✅ Canonical URLs
   - ✅ robots meta tags
   - ✅ Language alternates support

---

## 🆕 New SEO Features (Added 2025)

### 1. Advanced Schema Types

**Location:** `/src/lib/seo/advanced-schemas.ts`

#### VideoObject Schema
For demo videos, tutorials, product showcases:

```typescript
import { createVideoObjectSchema } from "@/lib/seo/advanced-schemas";

const videoSchema = createVideoObjectSchema({
  name: "Thorbis Platform Demo",
  description: "5-minute walkthrough of the Thorbis field service platform",
  thumbnailUrl: "https://thorbis.com/images/demo-thumbnail.jpg",
  uploadDate: "2025-01-15",
  contentUrl: "https://thorbis.com/videos/demo.mp4",
  duration: "PT5M30S", // 5 minutes 30 seconds
  transcript: "Full video transcript here...",
  keywords: ["field service software", "demo", "tutorial"],
});
```

**Why it matters:**
- Videos are 50x more likely to appear in AI Overviews
- Google can extract key moments from transcript
- Better visibility in video search results

#### Product Schema
For pricing page and product pages:

```typescript
import { createProductSchema } from "@/lib/seo/advanced-schemas";

const productSchema = createProductSchema({
  name: "Thorbis Field Management Platform",
  description: "Complete business management for service companies",
  offers: {
    price: "200",
    priceCurrency: "USD",
    availability: "InStock",
    billingInterval: "MONTH",
  },
  aggregateRating: {
    ratingValue: 4.9,
    reviewCount: 327,
    bestRating: 5,
  },
  image: "https://thorbis.com/og-image.png",
  category: "BusinessApplication",
});
```

**Why it matters:**
- Appears in Google Shopping results
- Shows pricing in search results
- Displays star ratings in SERPs
- Critical for AI Overview product mentions

#### ItemList Schema
For feature lists, comparison pages, navigation:

```typescript
import { createItemListSchema } from "@/lib/seo/advanced-schemas";

const itemListSchema = createItemListSchema({
  name: "Thorbis Key Features",
  description: "Complete feature list for field service management",
  items: [
    {
      name: "Smart Scheduling",
      url: "https://thorbis.com/features/scheduling",
      description: "AI-powered dispatch and route optimization",
      image: "https://thorbis.com/images/scheduling.png",
    },
    {
      name: "Invoice Management",
      url: "https://thorbis.com/features/invoicing",
      description: "Automated invoicing and payment processing",
    },
    // ... more items
  ],
});
```

**Why it matters:**
- Helps AI understand page structure
- Can appear as rich results (carousel)
- Improves internal linking signals

#### LocalBusiness Schema
For multi-location support or office locations:

```typescript
import { createLocalBusinessSchema } from "@/lib/seo/advanced-schemas";

const localSchema = createLocalBusinessSchema({
  name: "Thorbis HQ",
  address: {
    streetAddress: "123 Main St",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    postalCode: "94102",
    addressCountry: "US",
  },
  telephone: "+1-555-0100",
  email: "hello@thorbis.com",
  openingHours: ["Mo-Fr 09:00-17:00"],
  priceRange: "$200-$2000",
  latitude: 37.7749,
  longitude: -122.4194,
});
```

**Why it matters:**
- Appears in local search results
- Shows on Google Maps
- Critical for "near me" queries
- Voice search optimization

#### Course/Tutorial Schema
For knowledge base articles and tutorials:

```typescript
import { createCourseSchema } from "@/lib/seo/advanced-schemas";

const courseSchema = createCourseSchema({
  name: "Getting Started with Thorbis",
  description: "Complete onboarding course for new users",
  provider: "Thorbis",
  url: "https://thorbis.com/kb/getting-started",
  hasCourseInstance: [
    {
      courseMode: "online",
    },
  ],
});
```

**Why it matters:**
- Appears in Google's education features
- Better for tutorial/guide content than Article schema
- Helps with "how to" queries

#### Person Schema (E-E-A-T)
For author profiles and expert content:

```typescript
import { createPersonSchema } from "@/lib/seo/advanced-schemas";

const personSchema = createPersonSchema({
  name: "John Doe",
  jobTitle: "CTO, Thorbis",
  description: "20+ years in field service technology",
  expertise: [
    "Field Service Management",
    "Software Architecture",
    "Business Process Automation",
  ],
  sameAs: [
    "https://twitter.com/johndoe",
    "https://linkedin.com/in/johndoe",
  ],
  award: ["Best Field Service Innovation 2024"],
});
```

**Why it matters:**
- Builds E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness)
- Critical for "Your Money or Your Life" (YMYL) content
- Google's AI prioritizes expert-authored content

#### QAPage Schema
For Q&A content (better than FAQ for specific questions):

```typescript
import { createQAPageSchema } from "@/lib/seo/advanced-schemas";

const qaSchema = createQAPageSchema({
  question: {
    name: "How much does Thorbis cost?",
    text: "What is the pricing structure for the Thorbis platform?",
    dateCreated: "2025-01-15",
    author: "John Doe",
  },
  acceptedAnswer: {
    text: "Thorbis costs $200/month base fee plus pay-as-you-go usage. Small businesses typically pay $250-300/month total.",
    dateCreated: "2025-01-15",
    upvoteCount: 42,
    author: "Thorbis Support",
  },
});
```

**Why it matters:**
- Better than FAQ for detailed Q&A
- Appears in "People also ask" boxes
- Voice search optimization

---

### 2. Semantic SEO & AI Optimization

**Location:** `/src/lib/seo/semantic-seo.ts`

#### Semantic Keyword Generation

```typescript
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";

const keywords = generateSemanticKeywords("field service management");
// Returns: [
//   "service management software",
//   "field service automation",
//   "work order management",
//   "dispatch software",
//   ...
// ]
```

**Use in metadata:**

```typescript
export const metadata = generateMetadata({
  title: "Field Service Management",
  description: "...",
  keywords: [
    "field service management",
    ...generateSemanticKeywords("field service management"),
  ],
});
```

#### AI Overview Optimization

```typescript
import { generateAIOverviewMetadata } from "@/lib/seo/semantic-seo";

const aiMetadata = generateAIOverviewMetadata({
  quickAnswer: "Thorbis: $200/mo field service software with AI",
  detailedAnswer:
    "Thorbis is a complete field service management platform starting at $200/month. It includes scheduling, invoicing, CRM, and AI-powered dispatch for service businesses.",
  bulletPoints: [
    "Smart scheduling with AI dispatch",
    "Automated invoicing and payments",
    "Customer portal and communication",
    "Mobile app for technicians",
  ],
  relatedQuestions: [
    "How does Thorbis compare to ServiceTitan?",
    "What features are included in the base plan?",
    "Is there a mobile app?",
  ],
});
```

**Why it matters:**
- Optimizes for Google AI Overviews (SGE)
- Increases chances of appearing in AI-generated responses
- ChatGPT, Perplexity, and other AI search engines can cite your content

#### Voice Search Optimization

```typescript
import { generateVoiceSearchVariants } from "@/lib/seo/semantic-seo";

const variants = generateVoiceSearchVariants("field service software");
// Returns: [
//   "what is field service software",
//   "how does field service software work",
//   "why use field service software",
//   "field service software cost",
//   "best field service software",
//   "field service software near me",
//   ...
// ]
```

**Use in content:**
Include these question variants as H2/H3 headings in your content.

#### AI-Optimized Meta Descriptions

```typescript
import { generateAIOptimizedMetaDescription } from "@/lib/seo/semantic-seo";

const description = generateAIOptimizedMetaDescription(
  "field service management software",
  "Streamline your service business operations",
  "Start free trial"
);
// Returns: "Streamline your service business operations with field service management software. Includes service management software. Start free trial"
```

#### E-E-A-T Signal Metadata

```typescript
import { generateEEATMetadata } from "@/lib/seo/semantic-seo";

const eeatMeta = generateEEATMetadata({
  author: {
    name: "John Doe",
    expertise: ["Field Service", "Business Software"],
    credentials: "MBA, 20+ years experience",
    bio: "CTO at Thorbis with 20 years in field service technology",
  },
  reviewedBy: {
    name: "Jane Smith",
    credentials: "Senior Product Manager, Field Service Expert",
  },
  publishedDate: "2025-01-15",
  lastReviewed: "2025-01-20",
});
```

#### Content Quality Scoring

```typescript
import { calculateContentQualityScore } from "@/lib/seo/semantic-seo";

const qualityScore = calculateContentQualityScore({
  wordCount: 2000,
  readingTime: 8,
  lastUpdated: "2025-01-15",
  freshness: "current",
  citations: 5,
  multimedia: {
    images: 10,
    videos: 2,
    infographics: 1,
  },
  interactivity: {
    forms: 1,
    calculators: 1,
    demos: 1,
  },
});
// Returns: 95 (out of 100)
```

---

### 3. Robots.txt Optimization

**Location:** `/public/robots.txt`

Features:
- ✅ Allow AI crawlers (GPTBot, Claude-Web, PerplexityBot, etc.)
- ✅ Optimized crawl delays
- ✅ Sitemap references
- ✅ Block malicious bots
- ✅ Separate rules for Google, Bing, AI crawlers

**Key sections:**

```
# AI Crawlers - Allow for AI training and search
User-agent: GPTBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

# Sitemaps
Sitemap: https://thorbis.com/sitemap.xml
Sitemap: https://thorbis.com/kb/sitemap.xml
```

---

### 4. XML Sitemap Optimization

**Location:** `/src/app/sitemap.ts`

Features:
- ✅ Priority weighting (1.0 for homepage → 0.3 for legal)
- ✅ Change frequency hints
- ✅ Last modified timestamps
- ✅ Organized by content type

**Priority levels:**
- 1.0: Homepage
- 0.9: Pricing, main features
- 0.8: Feature pages
- 0.7: Industry pages, blog, KB
- 0.6: Solutions, resources
- 0.5: Company pages
- 0.3: Legal pages

---

## 🚀 Implementation Checklist

### For New Marketing Pages

- [ ] Use Server Component (no `"use client"`)
- [ ] Add comprehensive metadata via `generateMetadata()`
- [ ] Include appropriate structured data schemas
- [ ] Use semantic HTML5 elements
- [ ] Optimize images with `next/image`
- [ ] Add breadcrumb navigation
- [ ] Include FAQ section if applicable
- [ ] Add to sitemap.ts
- [ ] Test with Google Rich Results Test
- [ ] Verify Core Web Vitals

### Example: New Feature Page

```typescript
// src/app/(marketing)/features/new-feature/page.tsx
import Script from "next/script";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  createBreadcrumbSchema,
  createFAQSchema,
  createItemListSchema,
  createServiceSchema,
} from "@/lib/seo/structured-data";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";

export const metadata = generateSEOMetadata({
  title: "New Feature",
  section: "Features",
  description: "Description optimized for AI Overviews...",
  path: "/features/new-feature",
  keywords: [
    "new feature",
    ...generateSemanticKeywords("new feature"),
  ],
});

export default async function NewFeaturePage() {
  // Breadcrumbs
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", url: "https://thorbis.com" },
    { name: "Features", url: "https://thorbis.com/features" },
    { name: "New Feature", url: "https://thorbis.com/features/new-feature" },
  ]);

  // Service schema
  const serviceSchema = createServiceSchema({
    name: "New Feature Service",
    description: "...",
    offers: [
      {
        price: "200",
        currency: "USD",
        description: "Included in base plan",
      },
    ],
  });

  // FAQ schema
  const faqSchema = createFAQSchema([
    {
      question: "What is this feature?",
      answer: "Detailed answer...",
    },
  ]);

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs),
        }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main>
        <h1>New Feature</h1>
        {/* Content */}
      </main>
    </>
  );
}
```

---

## 📈 SEO Testing Tools

### Google Tools
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Search Console](https://search.google.com/search-console)

### Schema Validation
- [Schema.org Validator](https://validator.schema.org/)
- [Google Structured Data Testing Tool](https://developers.google.com/search/docs/appearance/structured-data)

### Core Web Vitals
- [Web.dev Measure](https://web.dev/measure/)
- [Chrome DevTools Lighthouse](chrome://extensions/)

---

## 🎯 2025 SEO Priorities

1. **AI Overview Optimization** (Highest Priority)
   - Quick, concise answers (40-60 chars)
   - Detailed explanations (2-3 sentences)
   - Bullet points for key features
   - Structured data for all content types

2. **E-E-A-T Signals** (Critical)
   - Author expertise and credentials
   - Review dates and freshness
   - Citations and sources
   - Expert reviews

3. **Core Web Vitals** (Required)
   - INP < 200ms
   - LCP < 2.5s
   - CLS < 0.1

4. **Voice Search** (Growing)
   - Natural language content
   - Question-based headings
   - LocalBusiness schema
   - Speakable schema

5. **Semantic Search** (Essential)
   - LSI keywords
   - Topic clustering
   - Internal linking
   - Content depth (1500-2500 words)

---

## 📚 Resources

- [Google AI Features Documentation](https://developers.google.com/search/docs/appearance/ai-features)
- [Next.js SEO Guide](https://nextjs.org/learn/seo)
- [Core Web Vitals 2025](https://web.dev/vitals/)
- [Schema.org Documentation](https://schema.org/docs/documents.html)

---

## 🔄 Maintenance

### Monthly Tasks
- [ ] Update sitemap with new pages
- [ ] Review Core Web Vitals metrics
- [ ] Check Google Search Console for errors
- [ ] Update content freshness dates
- [ ] Validate structured data

### Quarterly Tasks
- [ ] Audit all schemas with Rich Results Test
- [ ] Review and update E-E-A-T signals
- [ ] Analyze AI Overview appearances
- [ ] Update semantic keywords
- [ ] Content quality audit

---

**Last Updated:** January 2025
**Version:** 1.0
**Author:** SEO Team

For questions or updates, see `/docs/SEO_IMPLEMENTATION_GUIDE.md`
