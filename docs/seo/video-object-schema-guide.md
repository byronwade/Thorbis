# VideoObject Schema Implementation Guide

## Overview

VideoObject schema is **critical for 2025 SEO** - videos are **50x more likely** to appear in AI-generated responses (Google AI Overviews, ChatGPT, Perplexity) compared to text-only content.

## Why VideoObject Schema Matters

### AI Search Optimization
- **Google AI Overviews**: Prioritizes video content with proper schema
- **SGE (Search Generative Experience)**: Video snippets appear in AI summaries
- **Voice Search**: Video transcripts are used for voice assistant responses
- **Featured Snippets**: Videos with schema have higher placement rates

### SEO Benefits
- 50x higher likelihood of appearing in AI responses
- Enhanced search result appearance (video thumbnails)
- Higher click-through rates (CTR)
- Better user engagement metrics
- Improved content discoverability

## When to Use VideoObject Schema

### Product Demos
- Feature walkthroughs
- Setup tutorials
- Use case demonstrations

### Educational Content
- How-to videos
- Training materials
- Webinar recordings

### Marketing Content
- Customer testimonials (video format)
- Product announcements
- Company overview videos

### Support Content
- Troubleshooting guides
- FAQ videos
- Quick tips

## Implementation

### 1. Basic Implementation

```typescript
import Script from "next/script";
import { createVideoObjectSchema } from "@/lib/seo/advanced-schemas";

export default function FeaturePage() {
  const videoSchema = createVideoObjectSchema({
    name: "Thorbis Scheduling Feature Demo",
    description: "See how Thorbis AI-powered scheduling optimizes routes and increases efficiency by 40%. Complete walkthrough of drag-and-drop scheduling board, route optimization, and technician assignment.",
    thumbnailUrl: "https://thorbis.com/videos/thumbnails/scheduling-demo.jpg",
    uploadDate: "2025-01-15",
    contentUrl: "https://thorbis.com/videos/scheduling-demo.mp4",
    embedUrl: "https://www.youtube.com/embed/XXXXX",
    duration: "PT2M30S", // 2 minutes 30 seconds
    transcript: "Full transcript of the video content for AI understanding...",
    keywords: [
      "field service scheduling",
      "route optimization",
      "dispatch automation",
      "AI scheduling"
    ]
  });

  return (
    <>
      {/* VideoObject Schema */}
      <Script
        id="video-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(videoSchema)}
      </Script>

      {/* Your page content with embedded video */}
      <div>
        <h1>Scheduling Feature Demo</h1>
        <video src="/videos/scheduling-demo.mp4" controls>
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
}
```

### 2. YouTube Embed Implementation

```typescript
const videoSchema = createVideoObjectSchema({
  name: "Customer Portal Setup - 5 Minutes",
  description: "Quick setup guide for the Thorbis customer portal. Learn how to enable self-service booking, payment processing, and service history access for your customers.",
  thumbnailUrl: "https://img.youtube.com/vi/XXXXX/maxresdefault.jpg",
  uploadDate: "2025-01-20",
  embedUrl: "https://www.youtube.com/embed/XXXXX",
  duration: "PT5M",
  keywords: [
    "customer portal setup",
    "self-service booking",
    "online payments",
    "customer experience"
  ]
});
```

### 3. Multiple Videos on One Page

```typescript
// For pages with multiple videos, create an array of schemas
const videoSchemas = [
  createVideoObjectSchema({
    name: "Part 1: Getting Started",
    description: "Introduction to Thorbis platform...",
    thumbnailUrl: "/videos/thumbnails/part-1.jpg",
    uploadDate: "2025-01-15",
    contentUrl: "/videos/getting-started.mp4",
    duration: "PT3M"
  }),
  createVideoObjectSchema({
    name: "Part 2: Advanced Features",
    description: "Deep dive into AI automation...",
    thumbnailUrl: "/videos/thumbnails/part-2.jpg",
    uploadDate: "2025-01-16",
    contentUrl: "/videos/advanced-features.mp4",
    duration: "PT5M30S"
  })
];

// Render multiple video schemas
return (
  <>
    {videoSchemas.map((schema, index) => (
      <Script
        key={`video-schema-${index}`}
        id={`video-schema-${index}`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(schema)}
      </Script>
    ))}
  </>
);
```

## Best Practices

### 1. Duration Format (ISO 8601)
Always use ISO 8601 duration format:
- `PT1M30S` = 1 minute 30 seconds
- `PT5M` = 5 minutes
- `PT1H` = 1 hour
- `PT1H30M` = 1 hour 30 minutes

### 2. Transcript Optimization
- **Include full transcript** for maximum AI understanding
- Use natural language (how people actually speak)
- Include key terms and semantic variations
- Format for readability (AI can parse better)

Example:
```typescript
transcript: "In this demo, we'll show you how Thorbis AI-powered scheduling works. The system automatically assigns jobs to technicians based on their location, skills, and availability. You'll see how drag-and-drop scheduling makes it easy to adjust appointments, and how route optimization reduces drive time by 30 percent. Let's start with the scheduling board..."
```

### 3. Thumbnail Quality
- **Minimum**: 1280x720px (720p)
- **Recommended**: 1920x1080px (1080p)
- Use engaging, descriptive thumbnails
- Include text overlay for clarity

### 4. Upload Date
- Use actual upload date (not future dates)
- Format: `YYYY-MM-DD`
- Keep updated for relevance

### 5. Keywords
- 4-8 relevant keywords
- Match user search intent
- Include semantic variations
- Align with video content

### 6. Content URL vs Embed URL
- **contentUrl**: Direct link to video file (`.mp4`, `.webm`)
- **embedUrl**: Embed player URL (YouTube, Vimeo)
- Include both when available for maximum compatibility

## Schema Validation

### Google Rich Results Test
Test your VideoObject schema:
1. Visit: https://search.google.com/test/rich-results
2. Enter page URL or paste schema JSON
3. Verify all required fields are present
4. Check for warnings or errors

### Schema.org Validator
Additional validation:
1. Visit: https://validator.schema.org/
2. Paste page URL
3. Review VideoObject markup
4. Fix any issues reported

## Priority Pages for VideoObject Schema

### High Priority (Implement First)
1. **Homepage** - Platform overview video
2. **Features Pages** - Feature demo videos
3. **Getting Started** - Onboarding walkthrough
4. **Pricing** - Pricing explanation video

### Medium Priority
1. **Industry Pages** - Industry-specific demos
2. **Case Studies** - Customer success stories (video)
3. **Help Center** - Tutorial videos
4. **Blog Posts** - Embedded how-to videos

### Future Additions
1. **Webinar Recordings**
2. **Product Update Videos**
3. **Training Series**
4. **Customer Testimonials (Video)**

## Video Production Recommendations

### For Maximum SEO Impact

#### Duration
- **Ideal**: 2-5 minutes
- **Minimum**: 1 minute (too short = less value)
- **Maximum**: 10 minutes (attention span)

#### Content Structure
1. **First 15 seconds**: Hook (what will they learn?)
2. **Middle**: Core content (demo, tutorial, explanation)
3. **Last 15 seconds**: Call to action (try it, learn more)

#### Technical Specs
- **Resolution**: Minimum 720p, recommended 1080p
- **Format**: MP4 (H.264 codec) for web
- **Audio**: Clear, professional (bad audio = low engagement)
- **Captions**: Always include (accessibility + SEO)

## Monitoring and Analytics

### Key Metrics to Track

1. **Search Console**
   - Video snippet impressions
   - Click-through rate (CTR)
   - Average position for video queries

2. **Google Analytics**
   - Video play rate
   - Average watch time
   - Completion rate
   - Traffic source (organic search, AI overview, etc.)

3. **AI Search Visibility**
   - Google AI Overviews appearances
   - Featured snippet placements
   - Voice search results (if trackable)

## Example Implementation Checklist

When adding a new video to a page:

- [ ] Video uploaded and accessible (public URL)
- [ ] Thumbnail created (min 1280x720px)
- [ ] Transcript written (full text of video)
- [ ] Duration calculated (ISO 8601 format)
- [ ] Keywords researched (4-8 relevant terms)
- [ ] VideoObject schema created
- [ ] Schema added to page
- [ ] Schema validated (Rich Results Test)
- [ ] Page deployed
- [ ] Sitemap updated (if applicable)
- [ ] Search Console submission requested

## Common Mistakes to Avoid

### ❌ Don't
- Use placeholder thumbnails
- Omit transcript (critical for AI)
- Use incorrect duration format
- Skip keyword optimization
- Use private/restricted video URLs
- Forget to update upload date

### ✅ Do
- Include full, accurate transcript
- Use high-quality thumbnails
- Test schema before deployment
- Update schema when video changes
- Monitor performance in Search Console
- Keep content relevant and up-to-date

## Future Enhancements

### Planned Additions
1. **Video Series Schema** - Link related videos
2. **Clip Markup** - Highlight key moments
3. **Live Stream Schema** - For webinars
4. **Chapter Markers** - Improve navigation

### AI Search Evolution
Stay updated on:
- New schema properties from schema.org
- Google's evolving AI Overview requirements
- Bing Chat integration patterns
- Voice search optimization trends

## Resources

### Official Documentation
- Schema.org VideoObject: https://schema.org/VideoObject
- Google Video Best Practices: https://developers.google.com/search/docs/appearance/structured-data/video
- ISO 8601 Duration: https://en.wikipedia.org/wiki/ISO_8601#Durations

### Tools
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Markup Validator: https://validator.schema.org/
- YouTube Thumbnail Generator: Built-in YouTube feature

### Internal Resources
- VideoObject Schema Function: `/src/lib/seo/advanced-schemas.ts`
- Example Implementation: This guide (above)
- SEO Configuration: `/src/lib/seo/config.ts`

---

**Last Updated**: 2025-01-XX
**Maintainer**: SEO Team
**Status**: Ready for implementation
