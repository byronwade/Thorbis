import { SEO_BRAND, SEO_URLS } from "@/lib/seo/config";

/**
 * RSS Feed Route
 *
 * Generates an RSS 2.0 feed for the blog.
 * Accessible at /feed
 *
 * Benefits:
 * - Blog content syndication
 * - SEO authority signals
 * - Automated content discovery by aggregators
 * - Podcast apps can discover content
 */

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

type BlogPost = {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	updatedAt?: string;
	author?: string;
	category?: string;
	tags?: string[];
};

// TODO: Replace with actual blog data fetching
async function getBlogPosts(): Promise<BlogPost[]> {
	// This should fetch from your CMS or database
	// For now, returning sample structure
	return [
		{
			slug: "field-service-management-guide-2025",
			title: "The Complete Guide to Field Service Management in 2025",
			description:
				"Learn how modern field service businesses are using AI, automation, and mobile technology to grow revenue and reduce costs.",
			publishedAt: "2025-01-15T09:00:00Z",
			author: "Thorbis Team",
			category: "Guides",
			tags: ["field service", "management", "2025"],
		},
		{
			slug: "hvac-scheduling-best-practices",
			title: "HVAC Scheduling Best Practices: Maximize Technician Efficiency",
			description:
				"Discover proven scheduling strategies that help HVAC contractors complete more jobs per day while reducing drive time.",
			publishedAt: "2025-01-10T09:00:00Z",
			author: "Thorbis Team",
			category: "HVAC",
			tags: ["hvac", "scheduling", "efficiency"],
		},
		{
			slug: "invoice-faster-get-paid-faster",
			title: "Invoice Faster, Get Paid Faster: Field Service Billing Tips",
			description:
				"Stop leaving money on the table. Learn how to invoice on-site and reduce your average payment time from weeks to days.",
			publishedAt: "2025-01-05T09:00:00Z",
			author: "Thorbis Team",
			category: "Business",
			tags: ["invoicing", "payments", "cash flow"],
		},
	];
}

function escapeXml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function generateRssItem(post: BlogPost): string {
	const postUrl = `${SEO_URLS.site}/blog/${post.slug}`;

	return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      ${post.author ? `<author>hello@thorbis.com (${escapeXml(post.author)})</author>` : ""}
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
      ${post.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ") || ""}
    </item>`;
}

function generateRssFeed(posts: BlogPost[]): string {
	const now = new Date().toUTCString();

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SEO_BRAND.company)} Blog</title>
    <link>${SEO_URLS.site}/blog</link>
    <description>Tips, trends, and insights for growing your field service business. Learn about scheduling, invoicing, CRM, and AI-powered automation.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${SEO_URLS.site}/feed" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SEO_URLS.site}/logo.png</url>
      <title>${escapeXml(SEO_BRAND.company)} Blog</title>
      <link>${SEO_URLS.site}/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
    <copyright>Copyright ${new Date().getFullYear()} ${escapeXml(SEO_BRAND.company)}. All rights reserved.</copyright>
    <managingEditor>hello@thorbis.com (${escapeXml(SEO_BRAND.company)} Team)</managingEditor>
    <webMaster>hello@thorbis.com (${escapeXml(SEO_BRAND.company)} Team)</webMaster>
    <category>Technology</category>
    <category>Business</category>
    <category>Field Service</category>
    <generator>Next.js</generator>
    ${posts.map(generateRssItem).join("\n")}
  </channel>
</rss>`;
}

export async function GET() {
	const posts = await getBlogPosts();
	const feed = generateRssFeed(posts);

	return new Response(feed, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
		},
	});
}
