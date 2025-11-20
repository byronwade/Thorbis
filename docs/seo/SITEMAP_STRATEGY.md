# XML Sitemap Optimization Strategy

**Last Updated:** 2025-11-20
**Status:** Active - Well Optimized

---

## Overview

XML sitemaps help search engines discover and understand your content hierarchy. For Thorbis, sitemaps are critical for:
- **AI Crawlers** - Guide AI bots to important content
- **Index Coverage** - Ensure all pages are indexed
- **Priority Signals** - Indicate most important pages
- **Update Frequency** - Signal when to recrawl

**Current Status:** ✅ 2 active sitemaps with proper priority/changefreq tags

---

## 1. Current Sitemap Architecture

### Sitemap Index Structure

```
https://thorbis.com/sitemap.xml            (Main sitemap index)
├── https://thorbis.com/kb/sitemap.xml     (Knowledge Base sitemap)
└── (Future) /blog/sitemap.xml             (Blog sitemap)
```

### Main Sitemap (`/sitemap.ts`)

**Location:** `/src/app/sitemap.ts`

**Covers:**
- Homepage
- Core marketing pages (Features, Pricing, Industries, Comparisons)
- Company pages (About, Careers, Press, Partners)
- Resource pages (KB, Blog, Templates, Webinars)
- Legal pages (Privacy, Terms, Security, GDPR)
- Utility pages (Site-map, Status, API Docs)

**Total URLs:** ~58 static pages

**Status:** ✅ Well-optimized with priority, changefreq, lastModified

### Knowledge Base Sitemap (`/kb/sitemap.ts`)

**Location:** `/src/app/(marketing)/kb/sitemap.ts`

**Covers:**
- KB homepage
- All categories (parent + children)
- All published articles

**Total URLs:** Dynamic (~100-500 articles)

**Status:** ✅ Dynamic generation from database

---

## 2. Priority & ChangeFreq Strategy

### Priority Scale (0.0 - 1.0)

| Priority | Pages | Rationale |
|----------|-------|-----------|
| 1.0 | Homepage, KB Homepage | Highest authority, most traffic |
| 0.9 | Pricing, Features Hub | High conversion pages |
| 0.8 | Feature Pages, KB Categories | Core product pages |
| 0.7 | Industries Hub, Blog, KB Articles (featured) | Important content hubs |
| 0.6 | Solutions, Comparisons, Resources | Supporting content |
| 0.5 | Company, Community, Support | Lower priority pages |
| 0.4 | Status, Site-map | Utility pages |
| 0.3 | Legal pages | Lowest priority |

### ChangeFreq Guidelines

| Frequency | Pages | Update Pattern |
|-----------|-------|----------------|
| `daily` | Homepage, KB Homepage, Blog | Fresh content added daily |
| `weekly` | Pricing, KB Articles, Reviews | Updated 1-4x per month |
| `monthly` | Features, Industries, Resources | Updated quarterly |
| `yearly` | Legal pages | Rarely change |

---

## 3. Sitemap Best Practices (Current Implementation)

### ✅ Already Implemented

1. **Dynamic Generation** - KB sitemap pulls from database
2. **Priority Weighting** - All pages have appropriate priority
3. **ChangeFreq Hints** - Realistic update frequency
4. **LastModified Timestamps** - Actual modification dates
5. **Featured Content** - KB articles marked as featured get higher priority
6. **Robots.txt References** - Both sitemaps listed in robots.txt

### Code Example (Current Implementation)

```typescript
// src/app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return [
    {
      url: "https://thorbis.com",
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://thorbis.com/pricing",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // ... more entries
  ];
}
```

---

## 4. Sitemap Enhancements (Recommended)

### 4.1 Add Blog Sitemap (If Blog is Active)

**Create:** `/src/app/(marketing)/blog/sitemap.ts`

```typescript
import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/actions/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts({ limit: 1000 });

  return posts.map((post) => ({
    url: `https://thorbis.com/blog/${post.slug}`,
    lastModified: post.updated_at || post.published_at,
    changeFrequency: "monthly" as const,
    priority: post.featured ? 0.9 : 0.7,
  }));
}
```

### 4.2 Add Industry Pages to Main Sitemap

**Update:** `/src/app/sitemap.ts`

```typescript
const industries = [
  "hvac", "plumbing", "electrical", "landscaping",
  "pest-control", "garage-door", "roofing", "cleaning",
  "locksmith", "appliance-repair", "handyman", "painting", "carpet-cleaning"
];

const industryEntries = industries.map(slug => ({
  url: `https://thorbis.com/industries/${slug}`,
  lastModified: lastWeek,
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));
```

### 4.3 Add Comparison Pages to Main Sitemap

```typescript
const competitors = [
  "servicetitan", "housecall-pro", "jobber",
  "fieldedge", "servicem8", "workiz", "joblogic", "servicefusion"
];

const comparisonEntries = competitors.map(slug => ({
  url: `https://thorbis.com/vs/${slug}`,
  lastModified: lastMonth,
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));
```

### 4.4 Image Sitemap (Optional)

**Create:** `/src/app/image-sitemap.xml/route.ts`

```typescript
export async function GET() {
  const images = [
    {
      loc: "https://thorbis.com/images/features-scheduling.jpg",
      caption: "Drag-and-drop scheduling calendar",
      title: "Thorbis Scheduling Feature"
    },
    // ... more images
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${images.map(img => `
        <url>
          <loc>https://thorbis.com/features/scheduling</loc>
          <image:image>
            <image:loc>${img.loc}</image:loc>
            <image:caption>${img.caption}</image:caption>
            <image:title>${img.title}</image:title>
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

## 5. Sitemap Index (Multi-Sitemap Setup)

### When You Have Multiple Sitemaps

**Create:** `/src/app/sitemap-index.xml/route.ts`

```typescript
export async function GET() {
  const sitemaps = [
    { loc: "https://thorbis.com/sitemap.xml", lastmod: new Date() },
    { loc: "https://thorbis.com/kb/sitemap.xml", lastmod: new Date() },
    { loc: "https://thorbis.com/blog/sitemap.xml", lastmod: new Date() },
    { loc: "https://thorbis.com/image-sitemap.xml", lastmod: new Date() },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemaps.map(sitemap => `
        <sitemap>
          <loc>${sitemap.loc}</loc>
          <lastmod>${sitemap.lastmod.toISOString()}</lastmod>
        </sitemap>
      `).join('')}
    </sitemapindex>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" }
  });
}
```

**Update robots.txt:**

```
Sitemap: https://thorbis.com/sitemap-index.xml
```

---

## 6. Sitemap Submission & Monitoring

### Google Search Console

1. **Submit Sitemap:**
   - Go to https://search.google.com/search-console
   - Navigate to Sitemaps
   - Add sitemap URL: `https://thorbis.com/sitemap.xml`
   - Add KB sitemap: `https://thorbis.com/kb/sitemap.xml`

2. **Monitor Coverage:**
   - Check "Discovered - not indexed" pages
   - Fix issues with priority/canonical tags
   - Ensure all important pages are indexed

### Bing Webmaster Tools

1. **Submit Sitemap:**
   - Go to https://www.bing.com/webmasters
   - Navigate to Sitemaps
   - Add both sitemaps

### Validation

**Test Sitemaps:**
```bash
# Validate XML
curl https://thorbis.com/sitemap.xml | xmllint --format -

# Check sitemap accessibility
curl -I https://thorbis.com/sitemap.xml
# Should return: Content-Type: application/xml
```

---

## 7. Common Sitemap Mistakes to Avoid

### ❌ Mistakes

1. **Including noindex pages** - Don't include pages with `robots: { index: false }`
2. **Wrong priority scale** - Don't set everything to 1.0
3. **Stale lastModified** - Don't use static dates
4. **Too many URLs** - Max 50,000 per sitemap (use sitemap index)
5. **Redirect URLs** - Don't include pages that redirect
6. **Parameter URLs** - Avoid ?utm_source, ?ref, etc.
7. **4xx/5xx URLs** - Test all URLs before adding

### ✅ Best Practices

1. **Dynamic generation** - Pull from database/CMS
2. **Realistic priorities** - Match actual page importance
3. **Accurate dates** - Use actual modification timestamps
4. **Sitemap index** - Split large sitemaps (> 10,000 URLs)
5. **Canonical URLs** - Only include canonical versions
6. **Monitor regularly** - Check GSC coverage weekly

---

## 8. Advanced Sitemap Features

### 8.1 Alternate Language Links (hreflang)

If you add multi-language support:

```typescript
{
  url: "https://thorbis.com/pricing",
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.9,
  alternates: {
    languages: {
      es: "https://thorbis.com/es/pricing",
      fr: "https://thorbis.com/fr/pricing",
    }
  }
}
```

### 8.2 Video Sitemap (If Adding Video Content)

```xml
<url>
  <loc>https://thorbis.com/demo</loc>
  <video:video>
    <video:thumbnail_loc>https://thorbis.com/images/demo-thumb.jpg</video:thumbnail_loc>
    <video:title>Thorbis Product Demo</video:title>
    <video:description>See how Thorbis manages field service operations</video:description>
    <video:content_loc>https://thorbis.com/videos/demo.mp4</video:content_loc>
    <video:duration>300</video:duration>
    <video:publication_date>2025-01-01</video:publication_date>
  </video:video>
</url>
```

### 8.3 News Sitemap (If Publishing Daily News)

```xml
<url>
  <loc>https://thorbis.com/blog/latest-update</loc>
  <news:news>
    <news:publication>
      <news:name>Thorbis Blog</news:name>
      <news:language>en</news:language>
    </news:publication>
    <news:publication_date>2025-01-20</news:publication_date>
    <news:title>New AI Features Launched</news:title>
  </news:news>
</url>
```

---

## 9. Sitemap Performance Metrics

### Key Metrics to Track

| Metric | Target | Tool |
|--------|--------|------|
| Sitemap Indexed | 100% | Google Search Console |
| Crawl Errors | 0 | GSC > Coverage |
| Avg. Crawl Delay | < 1s | Server logs |
| Sitemap Size | < 10MB | File size check |
| URLs per Sitemap | < 50,000 | Count check |
| Fetch Success | 100% | GSC > Sitemaps |

### Monitoring Checklist

- [ ] Sitemap submitted to Google Search Console
- [ ] Sitemap submitted to Bing Webmaster Tools
- [ ] All URLs return 200 status codes
- [ ] No redirect chains in sitemap
- [ ] No duplicate URLs across sitemaps
- [ ] lastModified dates are accurate
- [ ] Priority values are appropriate
- [ ] ChangeFreq matches actual update pattern

---

## 10. Implementation Checklist

### Phase 1: Current Sitemap Optimization (Week 1)

- [x] Main sitemap with priority/changefreq ✅
- [x] KB sitemap with dynamic generation ✅
- [x] Both sitemaps in robots.txt ✅
- [ ] Add all 13 industry pages to main sitemap
- [ ] Add all 8 comparison pages to main sitemap
- [ ] Verify all URLs return 200 status

### Phase 2: Blog Sitemap (Week 2)

- [ ] Create blog sitemap (if blog is active)
- [ ] Add dynamic generation from blog database
- [ ] Implement featured post priority (0.9 vs 0.7)
- [ ] Add to robots.txt

### Phase 3: Sitemap Index (Week 3)

- [ ] Create sitemap index if > 3 sitemaps
- [ ] Update robots.txt to reference index
- [ ] Submit index to search consoles

### Phase 4: Advanced Features (Month 2)

- [ ] Image sitemap (optional)
- [ ] Video sitemap (if adding videos)
- [ ] Alternate language links (if going multilingual)

### Phase 5: Monitoring (Ongoing)

- [ ] Weekly GSC coverage checks
- [ ] Monthly sitemap validation
- [ ] Quarterly priority review
- [ ] Update lastModified when content changes

---

## 11. Troubleshooting

### Issue: Sitemap Not Indexed

**Causes:**
- Sitemap not submitted to GSC
- Robots.txt blocking sitemap
- Sitemap returns 404 or 500 error
- Invalid XML format

**Solutions:**
```bash
# Test sitemap accessibility
curl -I https://thorbis.com/sitemap.xml

# Validate XML
curl https://thorbis.com/sitemap.xml | xmllint --format -

# Check robots.txt
curl https://thorbis.com/robots.txt | grep Sitemap
```

### Issue: Pages Discovered but Not Indexed

**Causes:**
- Low priority in sitemap
- Poor content quality
- Duplicate content
- Noindex tag present

**Solutions:**
- Increase priority to 0.7+
- Improve content quality
- Add canonical tags
- Remove noindex if unintentional

---

## 12. Action Items Summary

### Immediate (This Week)
1. ✅ Review current sitemap implementation
2. ✅ Document sitemap strategy
3. ⏳ Add industry pages to main sitemap
4. ⏳ Add comparison pages to main sitemap
5. ⏳ Test all sitemap URLs return 200

### Short-Term (Next 2 Weeks)
1. Create blog sitemap (if blog active)
2. Submit all sitemaps to GSC and Bing
3. Monitor coverage in search consoles
4. Fix any crawl errors

### Long-Term (Next Month)
1. Implement sitemap index if needed
2. Add image sitemap (optional)
3. Set up automated sitemap testing
4. Create sitemap update notifications

---

**Conclusion:**

Thorbis already has a **well-optimized sitemap infrastructure** with:
- ✅ Proper priority weighting
- ✅ Realistic changefreq hints
- ✅ Accurate lastModified timestamps
- ✅ Dynamic KB sitemap generation
- ✅ Both sitemaps referenced in robots.txt

**Next steps:**
1. Add industry and comparison page entries
2. Create blog sitemap if blog is active
3. Submit to search consoles and monitor coverage
4. Consider image sitemap for enhanced image search visibility
