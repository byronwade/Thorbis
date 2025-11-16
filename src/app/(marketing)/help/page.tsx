import Link from "next/link";
import Script from "next/script";
import { getKBArticles, getKBCategories } from "@/actions/kb";
import { BlogCard } from "@/components/content/blog-card";
import { ResourceCard } from "@/components/content/resource-card";
import { KBArticleCard } from "@/components/kb/kb-article-card";
import { KBSearch } from "@/components/kb/kb-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogPosts, getResourceItems } from "@/lib/content";
import {
	generateBreadcrumbStructuredData,
	generateFAQStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
	title: "Help Center",
	section: "Support",
	description:
		"Access quick answers, in-depth guides, and live trainings to get the most out of Thorbis. Contact support or explore our knowledge base.",
	path: "/help",
	keywords: ["thorbis help center", "thorbis support", "thorbis documentation", "thorbis contact"],
});

export default async function HelpCenterPage() {
	const [
		categoriesResult,
		featuredArticlesResult,
		trendingArticlesResult,
		blogResult,
		webinarsResult,
		caseStudiesResult,
	] = await Promise.all([
		getKBCategories(),
		getKBArticles({ featured: true, limit: 4 }),
		getKBArticles({ limit: 6 }),
		getBlogPosts({ limit: 3 }),
		getResourceItems({ type: "webinar", limit: 3 }),
		getResourceItems({ type: "case_study", limit: 3 }),
	]);

	const categories = categoriesResult.success ? (categoriesResult.categories ?? []) : [];
	const featuredArticles =
		featuredArticlesResult.success && featuredArticlesResult.articles ? featuredArticlesResult.articles : [];
	const trendingArticlesRaw =
		trendingArticlesResult.success && trendingArticlesResult.articles ? trendingArticlesResult.articles : [];
	const featuredIds = new Set(featuredArticles.map((article) => article.id));
	const trendingArticles = trendingArticlesRaw.filter((article) => !featuredIds.has(article.id)).slice(0, 4);

	const blogPosts = blogResult.data;
	const webinars = webinarsResult.data;
	const caseStudies = caseStudiesResult.data;

	const faqStructuredData = generateFAQStructuredData([
		{
			question: "How do I get started with Thorbis?",
			answer:
				"Visit the onboarding section of our knowledge base for guided setup checklists, or request a personalised launch call from the support team.",
		},
		{
			question: "Where can I train new technicians?",
			answer:
				"Use the Thorbis mobile onboarding templates available in the Help Center and register for monthly webinars covering technician best practices.",
		},
		{
			question: "How do I contact Thorbis support?",
			answer:
				"Open the in-app support panel, email support@thorbis.com, or submit a ticket from this Help Center. Our team responds within one business day.",
		},
	]);

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Help Center", url: `${siteUrl}/help` },
						])
					),
				}}
				id="help-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqStructuredData),
				}}
				id="help-faq-ld"
				type="application/ld+json"
			/>

			<div className="bg-background">
				<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
					<header className="mx-auto mb-14 max-w-3xl text-center">
						<span className="mb-4 inline-flex items-center rounded-full border border-border px-3 py-1 font-semibold text-primary text-xs uppercase tracking-wide">
							Help Center
						</span>
						<h1 className="mb-4 font-bold text-4xl tracking-tight sm:text-5xl">
							Everything you need to succeed with Thorbis
						</h1>
						<p className="text-lg text-muted-foreground">
							Search our knowledge base, explore upcoming trainings, and reach the support team in one place. Every plan
							includes Help Center access with the $100/month base subscription, pay-as-you-go usage, and no lock-in.
						</p>
						<div className="mt-8">
							<KBSearch showButton />
						</div>
					</header>

					<section className="mb-16 grid gap-6 lg:grid-cols-3">
						<div className="rounded-2xl border bg-muted/20 p-8">
							<h2 className="mb-3 font-semibold text-xl">Contact support</h2>
							<p className="text-muted-foreground text-sm leading-relaxed">
								Need direct assistance? The Thorbis support team responds within one business day.
							</p>
							<div className="mt-6 flex flex-col gap-3">
								<Button asChild>
									<Link href="/contact">Submit a ticket</Link>
								</Button>
								<Button asChild variant="outline">
									<Link href="mailto:support@thorbis.com">Email support@thorbis.com</Link>
								</Button>
							</div>
						</div>
						<div className="rounded-2xl border bg-muted/20 p-8">
							<h2 className="mb-3 font-semibold text-xl">Onboard your team</h2>
							<p className="text-muted-foreground text-sm leading-relaxed">
								Follow step-by-step launch checklists for office staff and field technicians.
							</p>
							<div className="mt-6 flex flex-col gap-3">
								<Button asChild variant="outline">
									<Link href="/kb/getting-started/welcome">Start the quick-start guide</Link>
								</Button>
								<Button asChild variant="outline">
									<Link href="/webinars">Join a live onboarding webinar</Link>
								</Button>
							</div>
						</div>
						<div className="rounded-2xl border bg-muted/20 p-8">
							<h2 className="mb-3 font-semibold text-xl">Stay in the loop</h2>
							<p className="text-muted-foreground text-sm leading-relaxed">
								Receive product updates, new templates, and training invites twice a month.
							</p>
							<div className="mt-6 flex flex-col gap-3">
								<Button asChild>
									<Link href="/blog">Read product updates</Link>
								</Button>
								<Button asChild variant="outline">
									<Link href="/webinars">Browse upcoming sessions</Link>
								</Button>
							</div>
						</div>
					</section>

					<section className="mb-16">
						<div className="mb-6 flex items-center justify-between gap-4">
							<h2 className="font-semibold text-2xl">Popular knowledge base articles</h2>
							<Button asChild variant="ghost">
								<Link href="/kb">View all articles</Link>
							</Button>
						</div>
						{featuredArticles.length ? (
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
								{featuredArticles.map((article) => (
									<KBArticleCard article={article} featured key={article.id} />
								))}
							</div>
						) : (
							<p className="rounded-xl border border-dashed bg-muted/20 p-6 text-center text-muted-foreground">
								Articles will appear here once published.
							</p>
						)}
					</section>

					{trendingArticles.length ? (
						<section className="mb-16">
							<div className="mb-6 flex items-center justify-between gap-4">
								<h2 className="font-semibold text-2xl">Trending help articles</h2>
								<Button asChild variant="ghost">
									<Link href="/kb">Search knowledge base</Link>
								</Button>
							</div>
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
								{trendingArticles.map((article) => (
									<KBArticleCard article={article} key={article.id} />
								))}
							</div>
						</section>
					) : null}

					<section className="mb-16">
						<div className="mb-6 flex items-center justify-between gap-4">
							<h2 className="font-semibold text-2xl">Browse by category</h2>
							<Button asChild variant="ghost">
								<Link href="/kb">Explore knowledge base</Link>
							</Button>
						</div>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{categories.slice(0, 6).map((category) => (
								<Link
									className="group rounded-xl border bg-muted/10 p-6 transition-colors hover:border-primary hover:bg-primary/5"
									href={`/kb/${category.slug}`}
									key={category.id}
								>
									<div className="flex items-start gap-3">
										<div className="rounded-full bg-primary/10 p-2 text-primary">{"📘"}</div>
										<div>
											<h3 className="font-semibold text-lg">{String(category.title)}</h3>
											{category.description ? (
												<p className="text-muted-foreground text-sm">{String(category.description)}</p>
											) : null}
										</div>
									</div>
								</Link>
							))}
						</div>
					</section>

					<section className="mb-16">
						<div className="mb-6 flex items-center justify-between gap-4">
							<h2 className="font-semibold text-2xl">Latest from the Thorbis blog</h2>
							<Button asChild variant="ghost">
								<Link href="/blog">Visit blog</Link>
							</Button>
						</div>
						{blogPosts.length ? (
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{blogPosts.map((post) => (
									<BlogCard key={post.id} post={post} />
								))}
							</div>
						) : (
							<p className="rounded-xl border border-dashed bg-muted/20 p-6 text-center text-muted-foreground">
								Blog posts will appear here soon.
							</p>
						)}
					</section>

					<section className="mb-16 grid gap-8 lg:grid-cols-2">
						<div>
							<div className="mb-6 flex items-center justify-between gap-4">
								<h2 className="font-semibold text-2xl">Upcoming trainings</h2>
								<Button asChild variant="ghost">
									<Link href="/webinars">All webinars</Link>
								</Button>
							</div>
							{webinars.length ? (
								<div className="grid gap-6">
									{webinars.map((item) => (
										<ResourceCard item={item} key={item.id} />
									))}
								</div>
							) : (
								<p className="rounded-xl border border-dashed bg-muted/20 p-6 text-muted-foreground">
									Live sessions are being scheduled. Check back soon or join the newsletter for updates.
								</p>
							)}
						</div>

						<div>
							<div className="mb-6 flex items-center justify-between gap-4">
								<h2 className="font-semibold text-2xl">Customer success stories</h2>
								<Button asChild variant="ghost">
									<Link href="/case-studies">View case studies</Link>
								</Button>
							</div>
							{caseStudies.length ? (
								<div className="grid gap-6">
									{caseStudies.map((item) => (
										<ResourceCard item={item} key={item.id} />
									))}
								</div>
							) : (
								<p className="rounded-xl border border-dashed bg-muted/20 p-6 text-muted-foreground">
									Case studies are coming soon. In the meantime, create your account to explore how teams like yours use
									Thorbis.
								</p>
							)}
						</div>
					</section>

					<section className="rounded-2xl border bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-10 text-center">
						<Badge className="mb-4" variant="secondary">
							Need extra help?
						</Badge>
						<h2 className="mb-3 font-semibold text-3xl">We’re here for your entire team</h2>
						<p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
							Thorbis specialists can review your workflows, build custom reports, and train new hires. Let us know how
							we can assist.
						</p>
						<Button asChild size="lg">
							<Link href="/contact">Connect with Thorbis support</Link>
						</Button>
					</section>
				</div>
			</div>
		</>
	);
}
