
import { Calendar, Clock, Share2, Tag as TagIcon, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { BlogCard } from "@/components/content/blog-card";
import { MarkdownContent } from "@/components/content/markdown-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content";
import { buildShareImageUrl } from "@/lib/seo/config";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { createArticleSchema } from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration

type BlogArticlePageProps = {
	params: Promise<{ slug: string }>;
};

function formatDate(input?: string | null) {
	if (!input) {
		return null;
	}
	const date = new Date(input);
	if (Number.isNaN(date.getTime())) {
		return null;
	}
	return date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

export async function generateMetadata({ params }: BlogArticlePageProps) {
	const { slug } = await params;
	const post = await getBlogPostBySlug(slug);

	if (!post) {
		return {};
	}

	const title = post.seoTitle ?? post.title;
	const description =
		post.seoDescription ??
		post.excerpt ??
		`Learn how leading service teams grow with Thorbis in ${post.title}.`;

	return generateSEOMetadata({
		title,
		section: "Blog",
		description,
		path: `/blog/${post.slug}`,
		image: post.heroImageUrl ?? undefined,
		imageAlt: title,
		type: "article",
		publishedTime: post.publishedAt ?? undefined,
		modifiedTime: post.updatedAt ?? post.publishedAt ?? undefined,
		authors: post.author?.name ? [post.author.name] : undefined,
		tags: post.tags.map((tag) => tag.name),
		keywords: post.seoKeywords ?? post.tags.map((tag) => tag.slug),
		canonical: post.canonicalUrl ?? undefined,
	});
}

export default async function BlogArticlePage({
	params,
}: BlogArticlePageProps) {
	const { slug } = await params;
	const post = await getBlogPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const relatedResult = await getBlogPosts({
		categorySlug: post.category?.slug,
		limit: 4,
	});
	const relatedPosts = relatedResult.data
		.filter((item) => item.slug !== post.slug)
		.slice(0, 3);

	const publishedLabel = formatDate(post.publishedAt);
	const updatedLabel =
		post.updatedAt && post.updatedAt !== post.publishedAt
			? formatDate(post.updatedAt)
			: null;
	const wordCount = post.content.split(/\s+/).filter(Boolean).length;
	const readTimeISO =
		post.readingTime > 0 ? `PT${post.readingTime}M` : undefined;

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						createArticleSchema({
							title: post.title,
							description:
								post.seoDescription ?? post.excerpt ?? "Thorbis blog article",
							url: `${siteUrl}/blog/${post.slug}`,
							image: post.heroImageUrl ?? buildShareImageUrl(),
							publishedTime: post.publishedAt ?? undefined,
							modifiedTime: post.updatedAt ?? post.publishedAt ?? undefined,
							authorName: post.author?.name,
							tags: post.tags.map((tag) => tag.name),
							section: post.category?.name ?? "Blog",
							wordCount,
							estimatedReadTime: readTimeISO,
						}),
					),
				}}
				id="blog-article-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Blog", url: `${siteUrl}/blog` },
							{ name: post.title, url: `${siteUrl}/blog/${post.slug}` },
						]),
					),
				}}
				id="blog-article-breadcrumb-ld"
				type="application/ld+json"
			/>

			<article className="bg-background">
				<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
					<nav className="text-muted-foreground mb-10 flex items-center gap-2 text-sm">
						<Link className="hover:text-foreground transition-colors" href="/">
							Home
						</Link>
						<span aria-hidden="true">/</span>
						<Link
							className="hover:text-foreground transition-colors"
							href="/blog"
						>
							Blog
						</Link>
						<span aria-hidden="true">/</span>
						<span className="text-foreground">{post.title}</span>
					</nav>

					<header className="mx-auto mb-12 max-w-3xl text-center">
						<div className="text-primary mb-4 flex flex-wrap justify-center gap-2 text-xs font-medium tracking-wide uppercase">
							{post.category?.name ? (
								<Badge variant="outline">{post.category.name}</Badge>
							) : null}
							{post.featured ? (
								<Badge variant="secondary">Featured</Badge>
							) : null}
							{post.pinned ? (
								<Badge variant="secondary">Spotlight</Badge>
							) : null}
						</div>

						<h1 className="mb-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
							{post.title}
						</h1>
						{post.excerpt ? (
							<p className="text-muted-foreground text-lg">{post.excerpt}</p>
						) : null}

						<div className="text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
							{post.author?.name ? (
								<span className="inline-flex items-center gap-1">
									<User aria-hidden="true" className="size-4" />
									{post.author.name}
								</span>
							) : null}
							{publishedLabel ? (
								<span className="inline-flex items-center gap-1">
									<Calendar aria-hidden="true" className="size-4" />
									<time dateTime={post.publishedAt ?? undefined}>
										{publishedLabel}
									</time>
								</span>
							) : null}
							{post.readingTime > 0 ? (
								<span className="inline-flex items-center gap-1">
									<Clock aria-hidden="true" className="size-4" />
									{post.readingTime} min read
								</span>
							) : null}
							{updatedLabel ? (
								<span aria-label="Last updated on">{updatedLabel}</span>
							) : null}
						</div>
					</header>

					{post.heroImageUrl ? (
						<div className="relative mx-auto mb-12 aspect-video max-w-5xl overflow-hidden rounded-2xl border">
							<Image
								alt={post.seoTitle ?? post.title}
								className="object-cover"
								fill
								priority
								sizes="(max-width: 768px) 100vw, 960px"
								src={post.heroImageUrl}
							/>
						</div>
					) : null}

					<div className="mx-auto max-w-3xl space-y-10">
						<MarkdownContent content={post.content} />

						{post.tags.length ? (
							<section className="bg-muted/20 flex flex-wrap items-center gap-3 rounded-xl border p-6">
								<h2 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
									Tags
								</h2>
								<div className="flex flex-wrap gap-2">
									{post.tags.map((tag) => (
										<Link
											className="border-border hover:border-primary hover:text-primary inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors"
											href={`/blog?tag=${tag.slug}`}
											key={tag.id}
										>
											<TagIcon aria-hidden="true" className="size-3" />#
											{tag.name}
										</Link>
									))}
								</div>
							</section>
						) : null}

						<footer className="bg-muted/20 flex flex-col gap-6 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between">
							<div className="space-y-1">
								<p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
									Share this article
								</p>
								<p className="text-muted-foreground text-sm">
									Help another operator level up their team with Thorbis.
								</p>
							</div>
							<div className="flex flex-wrap gap-3">
								<Button asChild size="sm" variant="outline">
									<Link
										aria-label="Share on LinkedIn"
										href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${siteUrl}/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
										rel="noopener"
										target="_blank"
									>
										<Share2 aria-hidden="true" className="size-4" />
										LinkedIn
									</Link>
								</Button>
								<Button asChild size="sm" variant="outline">
									<Link
										aria-label="Share on X"
										href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${siteUrl}/blog/${post.slug}`)}&text=${encodeURIComponent(post.title)}`}
										rel="noopener"
										target="_blank"
									>
										<Share2 aria-hidden="true" className="size-4" />X (Twitter)
									</Link>
								</Button>
							</div>
						</footer>
					</div>
				</div>
			</article>

			<section className="bg-muted/30 border-t py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-8 flex items-center justify-between gap-4">
						<div>
							<h2 className="text-2xl font-semibold">More for you</h2>
							<p className="text-muted-foreground text-sm">
								Continue exploring strategies from the Thorbis team.
							</p>
						</div>
						<Button asChild variant="ghost">
							<Link href="/blog">Browse all articles</Link>
						</Button>
					</div>
					{relatedPosts.length ? (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{relatedPosts.map((related) => (
								<BlogCard key={related.id} post={related} />
							))}
						</div>
					) : (
						<p className="bg-background/60 text-muted-foreground rounded-xl border border-dashed p-6">
							We&apos;re crafting more stories in this category. Check back
							soon.
						</p>
					)}
				</div>
			</section>
		</>
	);
}
