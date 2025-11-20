"use cache";
export const cacheLife = "marketingWeekly";

import Link from "next/link";
import Script from "next/script";
import { BlogCard } from "@/components/content/blog-card";
import { Button } from "@/components/ui/button";
import {
	getBlogAuthors,
	getBlogCategories,
	getBlogPosts,
	getBlogTags,
} from "@/lib/content";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";
import { cn } from "@/lib/utils";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const PAGE_SIZE = 9;

const blogKeywords = generateSemanticKeywords("blog");

export const metadata = generateSEOMetadata({
	title: "Blog",
	section: "Resources",
	description:
		"Explore Thorbis guides, product updates, and playbooks designed to help field service operators grow with confidence.",
	path: "/blog",
	keywords: [
		"field service blog",
		"operations playbooks",
		"product updates",
		"service business growth",
		"field service tips",
		"contractor growth strategies",
		...blogKeywords.slice(0, 5),
	],
});

type BlogPageProps = {
	searchParams?: {
		category?: string;
		tag?: string;
		page?: string;
	};
};

function buildQuery({
	category,
	tag,
	page,
}: {
	category?: string;
	tag?: string;
	page?: number;
}) {
	const params = new URLSearchParams();
	if (category) {
		params.set("category", category);
	}
	if (tag) {
		params.set("tag", tag);
	}
	if (page && page > 1) {
		params.set("page", String(page));
	}
	const query = params.toString();
	return query ? `/blog?${query}` : "/blog";
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
	const categorySlug = searchParams?.category;
	const tagSlug = searchParams?.tag;
	const currentPage = Math.max(
		1,
		Number.parseInt(searchParams?.page ?? "1", 10) || 1,
	);

	const [featuredResult, postsResult, categories, tags, authors] =
		await Promise.all([
			getBlogPosts({ featured: true, limit: 3 }),
			getBlogPosts({
				categorySlug,
				tagSlug,
				limit: PAGE_SIZE,
				page: currentPage,
			}),
			getBlogCategories(),
			getBlogTags(),
			getBlogAuthors(),
		]);

	const featuredPosts = featuredResult.data;
	const posts = postsResult.data.filter(
		(post) => !featuredPosts.some((featured) => featured.id === post.id),
	);
	const totalPages = Math.max(
		1,
		Math.ceil(postsResult.total / Math.max(1, PAGE_SIZE)),
	);
	const hasFilters = Boolean(categorySlug || tagSlug);

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Blog", url: `${siteUrl}/blog` },
						]),
					),
				}}
				id="blog-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="mx-auto mb-16 max-w-3xl text-center">
					<span className="border-border text-primary mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
						Resources Hub
					</span>
					<h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
						Field Service Growth Library
					</h1>
					<p className="text-muted-foreground text-lg">
						Stay ahead with tactical playbooks, product updates, and stories
						from operators scaling with Thorbis. Every article is written with
						hands-on insights from our customer success and product teams.
					</p>
				</header>

				<section className="mb-12 space-y-6">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<h2 className="text-xl font-semibold">Browse by Category</h2>
						{hasFilters ? (
							<Button asChild variant="ghost">
								<Link href="/blog">Clear filters</Link>
							</Button>
						) : null}
					</div>
					<div className="flex flex-wrap gap-3">
						<Button
							asChild
							size="sm"
							variant={hasFilters ? "outline" : "secondary"}
						>
							<Link href="/blog">All topics</Link>
						</Button>
						{categories.map((category) => {
							const isActive = categorySlug === category.slug;
							return (
								<Button
									asChild
									key={category.id}
									size="sm"
									variant={isActive ? "secondary" : "outline"}
								>
									<Link
										href={buildQuery({ category: category.slug, tag: tagSlug })}
									>
										{category.name}
									</Link>
								</Button>
							);
						})}
					</div>
					{tags.length ? (
						<div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
							<span className="text-foreground font-medium">
								Trending tags:
							</span>
							{tags.slice(0, 6).map((tag) => {
								const isActive = tagSlug === tag.slug;
								return (
									<Link
										className={cn(
											"inline-flex items-center rounded-full border px-3 py-1 transition-colors",
											isActive
												? "border-primary bg-primary/10 text-primary"
												: "border-border hover:border-primary hover:text-primary",
										)}
										href={buildQuery({ tag: tag.slug, category: categorySlug })}
										key={tag.id}
									>
										#{tag.name}
									</Link>
								);
							})}
						</div>
					) : null}
				</section>

				{featuredPosts.length ? (
					<section className="mb-16">
						<div className="mb-6 flex items-center justify-between gap-4">
							<h2 className="text-2xl font-semibold">Featured insights</h2>
							<span className="text-muted-foreground text-sm">
								Curated by the Thorbis content team
							</span>
						</div>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{featuredPosts.map((post, index) => (
								<BlogCard
									key={post.id}
									post={post}
									showImage
									variant={index === 0 ? "default" : "default"}
								/>
							))}
						</div>
					</section>
				) : null}

				<section className="space-y-6">
					<div className="flex items-center justify-between gap-4">
						<h2 className="text-2xl font-semibold">
							{hasFilters ? "Articles filtered for you" : "Latest articles"}
						</h2>
						<span className="text-muted-foreground text-sm">
							{postsResult.total}{" "}
							{postsResult.total === 1 ? "article" : "articles"} from{" "}
							{authors.length}{" "}
							{authors.length === 1 ? "author" : "Thorbis experts"}
						</span>
					</div>

					{posts.length ? (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{posts.map((post) => (
								<BlogCard key={post.id} post={post} />
							))}
						</div>
					) : (
						<div className="bg-muted/20 rounded-xl border border-dashed p-12 text-center">
							<h3 className="mb-3 text-xl font-semibold">No articles yet</h3>
							<p className="text-muted-foreground">
								We&apos;re actively writing on this topic. Try a different
								filter or explore our knowledge base.
							</p>
							<div className="mt-6 flex justify-center gap-3">
								<Button asChild>
									<Link href="/kb">Visit the knowledge base</Link>
								</Button>
								<Button asChild variant="outline">
									<Link href="/contact">Talk to our team</Link>
								</Button>
							</div>
						</div>
					)}

					{totalPages > 1 ? (
						<nav className="flex items-center justify-between gap-4 pt-4">
							<Button
								asChild
								disabled={currentPage <= 1}
								size="sm"
								variant="outline"
							>
								<Link
									aria-disabled={currentPage <= 1}
									href={
										currentPage <= 1
											? buildQuery({
													category: categorySlug,
													tag: tagSlug,
													page: 1,
												})
											: buildQuery({
													category: categorySlug,
													tag: tagSlug,
													page: currentPage - 1,
												})
									}
								>
									Previous
								</Link>
							</Button>
							<p className="text-muted-foreground text-sm">
								Page {currentPage} of {totalPages}
							</p>
							<Button
								asChild
								disabled={currentPage >= totalPages}
								size="sm"
								variant="outline"
							>
								<Link
									aria-disabled={currentPage >= totalPages}
									href={
										currentPage >= totalPages
											? buildQuery({
													category: categorySlug,
													tag: tagSlug,
													page: totalPages,
												})
											: buildQuery({
													category: categorySlug,
													tag: tagSlug,
													page: currentPage + 1,
												})
									}
								>
									Next
								</Link>
							</Button>
						</nav>
					) : null}
				</section>
			</div>
		</>
	);
}
