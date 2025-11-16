/**
 * Knowledge Base RSS Feed
 *
 * RSS feed for all published articles
 */

import { getKBArticles } from "@/actions/kb";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thorbis.com";
const siteName = "Thorbis";

export async function GET() {
	const result = await getKBArticles({ limit: 50 });

	const articles = result.success && result.articles ? result.articles : [];

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName} Knowledge Base</title>
    <description>Latest articles and guides from ${siteName}</description>
    <link>${siteUrl}/kb</link>
    <atom:link href="${siteUrl}/kb/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${articles
			.map((article) => {
				const pubDate = article.published_at
					? new Date(String(article.published_at)).toUTCString()
					: new Date().toUTCString();
				const url = `${siteUrl}/kb/${article.category.slug}/${article.slug}`;

				return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.excerpt || ""}]]></description>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${article.category.title}]]></category>
      ${article.tags
				?.map(
					(tag) =>
						`<category><![CDATA[${String((tag as { name?: string }).name || "")}]]></category>`,
				)
				.join("\n      ")}
    </item>`;
			})
			.join("\n")}
  </channel>
</rss>`;

	return new Response(rss, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
		},
	});
}
