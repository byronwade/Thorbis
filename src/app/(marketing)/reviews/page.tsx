
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
import { createReviewAggregateSchema } from "@/lib/seo/structured-data";

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
	},
	{
		quote:
			"AI call handling and automatic follow-up saved the equivalent of two coordinators. Customers notice the difference immediately.",
		name: "Jeremy Park",
		role: "Founder, HomeHero Plumbing",
	},
	{
		quote:
			"Thorbis let us scale from two crews to six without adding office staff. Reporting, inventory, and marketing are finally under one roof.",
		name: "Ellie Martin",
		role: "Owner, ShineBright Cleaning",
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

			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="mx-auto max-w-4xl space-y-6 text-center">
					<Badge className="tracking-wide uppercase" variant="secondary">
						Social Proof
					</Badge>
					<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
						Thorbis earns 4.9/5 stars for AI automation and dispatch excellence
					</h1>
					<p className="text-muted-foreground text-lg leading-relaxed">
						Contractors choose Thorbis for transparent pricing, fast
						implementation, and AI-powered workflows. Every customer pays the
						same $200/month base with pay-as-you-go usage—no per-user surprises.
					</p>
					<div className="flex flex-wrap justify-center gap-3">
						<Button asChild size="lg">
							<Link href="/register">Create your account</Link>
						</Button>
						<Button asChild size="lg" variant="outline">
							<Link href="/case-studies">Read case studies</Link>
						</Button>
					</div>
				</header>

				<main className="mt-16 space-y-20">
					<section className="grid gap-6 md:grid-cols-3">
						{[
							{
								score: "4.9",
								label: "Overall rating",
								subtext: "Average across G2, Capterra, and Google Reviews.",
							},
							{
								score: "98%",
								label: "Support satisfaction",
								subtext:
									"Teams praise dedicated success managers and fast responses.",
							},
							{
								score: "6 weeks",
								label: "Average go-live",
								subtext:
									"From contract to production across multi-location contractors.",
							},
						].map((stat) => (
							<Card className="bg-primary/5" key={stat.label}>
								<CardContent className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
									<span className="text-primary text-5xl font-bold">
										{stat.score}
									</span>
									<p className="text-base font-semibold">{stat.label}</p>
									<p className="text-muted-foreground text-sm">
										{stat.subtext}
									</p>
								</CardContent>
							</Card>
						))}
					</section>

					<section className="space-y-6">
						<div className="mx-auto max-w-3xl space-y-3 text-center">
							<h2 className="text-3xl font-semibold">
								What customers say about Thorbis
							</h2>
							<p className="text-muted-foreground">
								A sampling of the feedback we hear from field service operators
								who replaced legacy tools.
							</p>
						</div>
						<div className="grid gap-6 md:grid-cols-3">
							{TESTIMONIALS.map((testimonial) => (
								<Card key={testimonial.quote}>
									<CardContent className="flex h-full flex-col justify-between gap-4 py-8">
										<p className="text-muted-foreground leading-relaxed">
											“{testimonial.quote}”
										</p>
										<div className="space-y-1 text-sm">
											<p className="text-foreground font-semibold">
												{testimonial.name}
											</p>
											<p className="text-muted-foreground">
												{testimonial.role}
											</p>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</section>

					<section className="space-y-6">
						<div className="mx-auto max-w-3xl space-y-3 text-center">
							<h2 className="text-3xl font-semibold">
								Platform badges & ratings
							</h2>
							<p className="text-muted-foreground">
								Verified reviews from trusted directories. Thorbis leads in ease
								of use, support, and ROI.
							</p>
						</div>
						<div className="grid gap-6 md:grid-cols-3">
							{[
								{
									platform: "G2",
									rating: "4.9 / 5",
									description: "High Performer in Field Service Management.",
									href: "https://www.g2.com/products/thorbis/reviews",
								},
								{
									platform: "Capterra",
									rating: "4.8 / 5",
									description:
										"Best ease of use award for mid-market contractors.",
									href: "https://www.capterra.com/p/Thorbis/",
								},
								{
									platform: "Google Reviews",
									rating: "4.9 / 5",
									description: "Customer praise for AI automation and support.",
									href: "https://www.google.com/search?q=thorbis+reviews",
								},
							].map((listing) => (
								<Card className="text-center" key={listing.platform}>
									<CardHeader>
										<Badge className="mx-auto w-fit" variant="secondary">
											{listing.platform}
										</Badge>
										<CardTitle className="text-2xl">{listing.rating}</CardTitle>
									</CardHeader>
									<CardContent className="text-muted-foreground space-y-4 text-sm leading-relaxed">
										<p>{listing.description}</p>
										<Button asChild variant="outline">
											<Link href={listing.href} rel="noopener" target="_blank">
												Read {listing.platform} reviews
											</Link>
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					</section>

					<section className="space-y-6">
						<div className="mx-auto max-w-3xl space-y-3 text-center">
							<h2 className="text-3xl font-semibold">
								Explore proof by industry
							</h2>
							<p className="text-muted-foreground">
								Dive deeper into stories from contractors like you, complete
								with KPI improvements and AI adoption stats.
							</p>
						</div>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
							{[
								{
									label: "HVAC success stories",
									href: "/case-studies?industry=hvac",
								},
								{
									label: "Plumbing upgrades",
									href: "/case-studies?industry=plumbing",
								},
								{
									label: "Electrical growth playbooks",
									href: "/case-studies?industry=electrical",
								},
								{
									label: "Cleaning & recurring services",
									href: "/case-studies?industry=cleaning",
								},
							].map((item) => (
								<Card className="bg-muted/40" key={item.label}>
									<CardContent className="flex h-full flex-col items-start justify-between gap-4 py-6">
										<p className="text-base font-semibold">{item.label}</p>
										<Button asChild variant="ghost">
											<Link href={item.href}>View stories →</Link>
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					</section>

					<section className="mx-auto max-w-4xl space-y-4 text-center">
						<h2 className="text-3xl font-semibold">Reviews FAQ</h2>
						<div className="grid gap-4 md:grid-cols-3">
							{FAQS.map((faq) => (
								<Card key={faq.question}>
									<CardHeader>
										<CardTitle className="text-base">{faq.question}</CardTitle>
									</CardHeader>
									<CardContent className="text-muted-foreground text-sm leading-relaxed">
										{faq.answer}
									</CardContent>
								</Card>
							))}
						</div>
						<div className="flex flex-wrap justify-center gap-3">
							<Button asChild>
								<Link href="/register">Get started now</Link>
							</Button>
							<Button asChild variant="outline">
								<Link href="/switch">Plan your migration</Link>
							</Button>
						</div>
					</section>
				</main>
			</div>
		</>
	);
}
