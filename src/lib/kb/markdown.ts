/**
 * Markdown Parser for Knowledge Base
 *
 * Parses markdown files with frontmatter and converts to HTML
 * Uses remark and rehype for processing
 */

import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { KBArticleFrontmatter } from "./types";

/**
 * Parse markdown file with frontmatter
 */
export function parseMarkdown(
  content: string
): { frontmatter: KBArticleFrontmatter; content: string } {
  const { data, content: markdownContent } = matter(content);

  // Validate and normalize frontmatter
  const frontmatter: KBArticleFrontmatter = {
    title: data.title || "",
    slug: data.slug || "",
    excerpt: data.excerpt,
    category: data.category || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    featured: data.featured ?? false,
    published: data.published ?? false,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    author: data.author,
    featuredImage: data.featuredImage,
    relatedArticles: Array.isArray(data.relatedArticles)
      ? data.relatedArticles
      : [],
    seo: data.seo || {},
  };

  return {
    frontmatter,
    content: markdownContent.trim(),
  };
}

/**
 * Convert markdown to HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const { unified } = await import("unified");
  const { default: remarkParse } = await import("remark-parse");
  const { default: remarkRehype } = await import("remark-rehype");
  const { default: rehypeStringify } = await import("rehype-stringify");

  const result = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkGfm) // GitHub Flavored Markdown (tables, strikethrough, etc.)
    .use(remarkRehype, { allowDangerousHtml: true }) // Transform remark to rehype
    .use(rehypeRaw) // Allow raw HTML
    .use(rehypeSanitize, {
      // Sanitize HTML for security
      tagNames: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "a",
        "ul",
        "ol",
        "li",
        "blockquote",
        "code",
        "pre",
        "strong",
        "em",
        "img",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "hr",
        "br",
        "div",
        "span",
      ],
      attributes: {
        a: ["href", "title"],
        img: ["src", "alt", "title", "width", "height"],
        code: ["class"],
        pre: ["class"],
      },
    })
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypeAutolinkHeadings, {
      // Add anchor links to headings
      behavior: "wrap",
      properties: {
        className: ["anchor-link"],
        ariaHidden: true,
      },
    })
    .use(rehypeStringify) // Convert to HTML string
    .process(markdown);

  return String(result);
}

/**
 * Extract table of contents from HTML
 */
export function extractTableOfContents(html: string): Array<{
  id: string;
  text: string;
  level: number;
}> {
  const headingRegex = /<h([1-6])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h[1-6]>/g;
  const toc: Array<{ id: string; text: string; level: number }> = [];

  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1] || "1", 10);
    const id = match[2] || "";
    // Strip HTML tags from text
    const text = match[3]?.replace(/<[^>]*>/g, "").trim() || "";

    if (id && text) {
      toc.push({ id, text, level });
    }
  }

  return toc;
}


