import {
	ArrowRight,
	Award,
	CheckCircle,
	Clock,
	ExternalLink,
	Heart,
	Quote,
	Star,
	ThumbsUp,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	createEnhancedReviewSchema,
	type IndividualReview,
} from "@/lib/seo/advanced-schemas";
import {
	generateBreadcrumbStructuredData,
	generateFAQStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const reviewKeywords = generateSemanticKeywords("reviews");

export const metadata = generateSEOMetadata({
	title: "Thorbis Reviews & Customer Proof",
	section: "Social Proof",
	description:
		"See why contractors rate Thorbis 4.9/5 for AI automation, dispatch, and customer experience. Explore testimonials, ratings, and case studies.",
	path: "/reviews",
	keywords: [
		"thorbis reviews",
		"field service software ratings",
		"servicetitan alternative testimonials",
		"customer testimonials",
		"field service reviews",
		"contractor software reviews",
		...reviewKeywords.slice(0, 5),
	],
});

const TESTIMONIALS = [
	{
		quote:
			"Thorbis replaced ServiceTitan for our 60-tech operation in six weeks. Dispatchers love the new board, and AI booking boosted after-hours jobs by 18%.",
		name: "Leslie Warren",
		role: "COO, Elevate Mechanical",
		color: "from-blue-500/10 to-cyan-500/10 border-blue-500/30",
		iconColor: "text-blue-600 dark:text-blue-400",
	},
	{
		quote:
			"AI call handling and automatic follow-up saved the equivalent of two coordinators. Customers notice the difference immediately.",
		name: "Jeremy Park",
		role: "Founder, HomeHero Plumbing",
		color: "from-violet-500/10 to-purple-500/10 border-violet-500/30",
		iconColor: "text-violet-600 dark:text-violet-400",
	},
	{
		quote:
			"Thorbis let us scale from two crews to six without adding office staff. Reporting, inventory, and marketing are finally under one roof.",
		name: "Ellie Martin",
		role: "Owner, ShineBright Cleaning",
		color: "from-emerald-500/10 to-green-500/10 border-emerald-500/30",
		iconColor: "text-emerald-600 dark:text-emerald-400",
	},
];

const FAQS = [
	{
		question: "Where can I read independent reviews?",
		answer:
			"Thorbis customers share feedback on G2, Capterra, Google, and the Thorbis Community. See the directory links below for public ratings.",
	},
	{
		question: "Do you have case studies for my industry?",
		answer:
			"Yes. Visit the case studies library for HVAC, plumbing, electrical, and home services teams using Thorbis to modernize operations.",
	},
	{
		question: "Can I speak with a reference customer?",
		answer:
			"Absolutely. We maintain a roster of reference customers across company sizes and industries. Create your account and message our success team to be connected.",
	},
];

const STATS = [
	{
		score: "4.9",
		label: "Overall rating",
		subtext: "Average across G2, Capterra, and Google Reviews.",
		icon: Star,
		color: "from-yellow-500/10 to-amber-500/10 border-yellow-500/30",
		iconColor: "text-yellow-600 dark:text-yellow-400",
	},
	{
		score: "98%",
		label: "Support satisfaction",
		subtext: "Teams praise dedicated success managers and fast responses.",
		icon: ThumbsUp,
		color: "from-blue-500/10 to-cyan-500/10 border-blue-500/30",
		iconColor: "text-blue-600 dark:text-blue-400",
	},
	{
		score: "6 weeks",
		label: "Average go-live",
		subtext: "From contract to production across multi-location contractors.",
		icon: Clock,
		color: "from-emerald-500/10 to-green-500/10 border-emerald-500/30",
		iconColor: "text-emerald-600 dark:text-emerald-400",
	},
];

const PLATFORMS = [
	{
		platform: "G2",
		rating: "4.9 / 5",
		description: "High Performer in Field Service Management.",
		href: "https://www.g2.com/products/thorbis/reviews",
		color: "from-orange-500/10 to-red-500/10 border-orange-500/30",
		iconColor: "text-orange-600 dark:text-orange-400",
	},
	{
		platform: "Capterra",
		rating: "4.8 / 5",
		description: "Best ease of use award for mid-market contractors.",
		href: "https://www.capterra.com/p/Thorbis/",
		color: "from-sky-500/10 to-blue-500/10 border-sky-500/30",
		iconColor: "text-sky-600 dark:text-sky-400",
	},
	{
		platform: "Google Reviews",
		rating: "4.9 / 5",
		description: "Customer praise for AI automation and support.",
		href: "https://www.google.com/search?q=thorbis+reviews",
		color: "from-emerald-500/10 to-green-500/10 border-emerald-500/30",
		iconColor: "text-emerald-600 dark:text-emerald-400",
	},
];

const INDUSTRY_LINKS = [
	{
		label: "HVAC success stories",
		href: "/case-studies?industry=hvac",
		icon: TrendingUp,
	},
	{
		label: "Plumbing upgrades",
		href: "/case-studies?industry=plumbing",
		icon: TrendingUp,
	},
	{
		label: "Electrical growth playbooks",
		href: "/case-studies?industry=electrical",
		icon: TrendingUp,
	},
	{
		label: "Cleaning & recurring services",
		href: "/case-studies?industry=cleaning",
		icon: TrendingUp,
	},
];

const breadcrumbLd = generateBreadcrumbStructuredData([
	{ name: "Home", url: siteUrl },
	{ name: "Reviews", url: `${siteUrl}/reviews` },
]);

// Enhanced review schema with individual reviews and E-E-A-T signals
const individualReviews: IndividualReview[] = [
	{
		author: "Leslie Warren",
		jobTitle: "COO",
		company: "Elevate Mechanical",
		location: "Phoenix, AZ",
		datePublished: "2024-10-15",
		reviewBody:
			"Thorbis replaced ServiceTitan for our 60-tech operation in six weeks. Dispatchers love the new board, and AI booking boosted after-hours jobs by 18%.",
		ratingValue: 5,
		bestRating: 5,
		worstRating: 1,
		verifiedPurchase: true,
	},
	{
		author: "Jeremy Park",
		jobTitle: "Founder",
		company: "HomeHero Plumbing",
		location: "Austin, TX",
		datePublished: "2024-09-22",
		reviewBody:
			"AI call handling and automatic follow-up saved the equivalent of two coordinators. Customers notice the difference immediately.",
		ratingValue: 5,
		bestRating: 5,
		worstRating: 1,
		verifiedPurchase: true,
	},
	{
		author: "Ellie Martin",
		jobTitle: "Owner",
		company: "ShineBright Cleaning",
		location: "Denver, CO",
		datePublished: "2024-11-08",
		reviewBody:
			"Thorbis let us scale from two crews to six without adding office staff. Reporting, inventory, and marketing are finally under one roof.",
		ratingValue: 5,
		bestRating: 5,
		worstRating: 1,
		verifiedPurchase: true,
	},
];

const aggregateLd = createEnhancedReviewSchema({
	itemReviewed: {
		name: "Thorbis Field Service Platform",
		url: siteUrl,
		image: "/images/og-default.png",
		type: "SoftwareApplication",
	},
	reviews: individualReviews,
	aggregateRating: {
		ratingValue: 4.9,
		reviewCount: 182,
		bestRating: 5,
		worstRating: 1,
	},
});

const faqLd = generateFAQStructuredData(FAQS);

export default function ReviewsPage() {
	return (
		<>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
				id="reviews-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateLd) }}
				id="reviews-aggregate-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
				id="reviews-faq-ld"
				type="application/ld+json"
			/>

			<div className="container mx-auto space-y-20 px-4 py-16 sm:px-6 lg:px-8">
				{/* Hero Section */}
				<section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-yellow-600/20 via-background to-amber-500/5 p-8 sm:p-12 lg:p-16">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-yellow-500/10 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-amber-500/10 blur-3xl" />

					<div className="mx-auto max-w-4xl space-y-6 text-center">
						<Badge className="px-4 py-1.5 font-medium tracking-wide uppercase bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
							<Award className="mr-2 size-4" />
							Social Proof
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
							Thorbis earns 4.9/5 stars for AI automation and dispatch
							excellence
						</h1>
						<p className="text-muted-foreground text-lg leading-relaxed sm:text-xl">
							Contractors choose Thorbis for transparent pricing, fast
							implementation, and AI-powered workflows. Every customer pays the
							same $200/month base with pay-as-you-go usage—no per-user
							surprises.
						</p>
						<div className="border-border/50 flex flex-wrap items-center justify-center gap-6 border-t pt-6">
							<div className="flex items-center gap-2">
								<CheckCircle className="size-5 text-yellow-600 dark:text-yellow-400" />
								<span className="text-muted-foreground text-sm">
									182+ verified reviews
								</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="size-5 text-yellow-600 dark:text-yellow-400" />
								<span className="text-muted-foreground text-sm">
									98% satisfaction rate
								</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="size-5 text-yellow-600 dark:text-yellow-400" />
								<span className="text-muted-foreground text-sm">
									Industry-leading NPS
								</span>
							</div>
						</div>
						<div className="flex flex-wrap justify-center gap-3">
							<Button asChild className="group" size="lg">
								<Link href="/waitlist">
									Join Waitlist
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/case-studies">Read case studies</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Stats Section */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							Key Metrics
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Numbers that speak for themselves
						</h2>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						{STATS.map((stat) => {
							const Icon = stat.icon;
							return (
								<Card
									className={`border-2 bg-gradient-to-br transition-all hover:shadow-lg ${stat.color}`}
									key={stat.label}
								>
									<CardContent className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
										<div
											className={`flex size-14 items-center justify-center rounded-xl bg-background/80 ${stat.iconColor}`}
										>
											<Icon className="size-7" />
										</div>
										<span className={`text-5xl font-bold ${stat.iconColor}`}>
											{stat.score}
										</span>
										<div>
											<p className="text-lg font-semibold">{stat.label}</p>
											<p className="text-muted-foreground text-sm mt-1">
												{stat.subtext}
											</p>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* Testimonials Section */}
				<section className="space-y-8">
					<div className="mx-auto max-w-3xl space-y-3 text-center">
						<Badge className="mb-4" variant="secondary">
							Customer Stories
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							What customers say about Thorbis
						</h2>
						<p className="text-muted-foreground text-lg">
							A sampling of the feedback we hear from field service operators
							who replaced legacy tools.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						{TESTIMONIALS.map((testimonial) => (
							<Card
								className={`border-2 bg-gradient-to-br transition-all hover:shadow-lg ${testimonial.color}`}
								key={testimonial.quote}
							>
								<CardContent className="flex h-full flex-col justify-between gap-4 py-8">
									<div>
										<Quote className={`size-8 mb-4 ${testimonial.iconColor}`} />
										<p className="text-muted-foreground leading-relaxed italic">
											"{testimonial.quote}"
										</p>
									</div>
									<div className="space-y-1 text-sm pt-4 border-t border-border/50">
										<p className="text-foreground font-semibold">
											{testimonial.name}
										</p>
										<p className="text-muted-foreground">{testimonial.role}</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* Platforms Section */}
				<section className="space-y-8">
					<div className="mx-auto max-w-3xl space-y-3 text-center">
						<Badge className="mb-4" variant="secondary">
							Review Platforms
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Platform badges & ratings
						</h2>
						<p className="text-muted-foreground text-lg">
							Verified reviews from trusted directories. Thorbis leads in ease
							of use, support, and ROI.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						{PLATFORMS.map((listing) => (
							<Card
								className={`text-center border-2 bg-gradient-to-br transition-all hover:shadow-lg ${listing.color}`}
								key={listing.platform}
							>
								<CardHeader>
									<Badge className="mx-auto w-fit mb-2" variant="secondary">
										{listing.platform}
									</Badge>
									<CardTitle className={`text-3xl ${listing.iconColor}`}>
										{listing.rating}
									</CardTitle>
								</CardHeader>
								<CardContent className="text-muted-foreground space-y-4 text-sm leading-relaxed">
									<p>{listing.description}</p>
									<Button asChild variant="outline">
										<Link href={listing.href} rel="noopener" target="_blank">
											Read reviews
											<ExternalLink className="ml-2 size-4" />
										</Link>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* Industry Links Section */}
				<section className="space-y-8">
					<div className="mx-auto max-w-3xl space-y-3 text-center">
						<Badge className="mb-4" variant="secondary">
							Case Studies
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Explore proof by industry
						</h2>
						<p className="text-muted-foreground text-lg">
							Dive deeper into stories from contractors like you, complete with
							KPI improvements and AI adoption stats.
						</p>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{INDUSTRY_LINKS.map((item) => {
							const Icon = item.icon;
							return (
								<Card
									className="border-2 hover:border-primary/30 transition-all hover:shadow-lg"
									key={item.label}
								>
									<CardContent className="flex h-full flex-col items-start justify-between gap-4 py-6">
										<div className="flex items-center gap-3">
											<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
												<Icon className="size-5 text-primary" />
											</div>
											<p className="text-base font-semibold">{item.label}</p>
										</div>
										<Button
											asChild
											variant="ghost"
											className="w-full justify-start"
										>
											<Link href={item.href}>
												View stories
												<ArrowRight className="ml-2 size-4" />
											</Link>
										</Button>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* FAQ Section */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							FAQ
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Reviews FAQ
						</h2>
					</div>
					<div className="mx-auto max-w-4xl grid gap-4 md:grid-cols-3">
						{FAQS.map((faq) => (
							<Card
								className="border-2 hover:border-primary/30 transition-all hover:shadow-lg"
								key={faq.question}
							>
								<CardHeader>
									<CardTitle className="text-base">{faq.question}</CardTitle>
								</CardHeader>
								<CardContent className="text-muted-foreground text-sm leading-relaxed">
									{faq.answer}
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* CTA Section */}
				<section className="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-10 text-center">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />

					<div className="relative space-y-6 max-w-3xl mx-auto">
						<div className="flex items-center justify-center gap-2">
							<Heart className="size-5 text-primary" />
							<span className="text-muted-foreground text-sm font-medium">
								Join 1,000+ contractors who love Thorbis
							</span>
						</div>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Ready to experience it yourself?
						</h2>
						<p className="text-muted-foreground text-lg">
							Start with our $200/month base plan and see why teams rate us
							4.9/5.
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							<Button asChild className="group" size="lg">
								<Link href="/waitlist">
									Join Waitlist
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/switch">Plan Your Migration</Link>
							</Button>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
