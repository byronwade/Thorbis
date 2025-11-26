import Link from "next/link";
import Script from "next/script";
import { getMarketingIcon } from "@/components/marketing/marketing-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getAllFeatures } from "@/lib/marketing/features";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";
import {
	createFAQSchema,
	createItemListSchema,
} from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration

// Semantic keywords for features
const featureKeywords = generateSemanticKeywords("field service management");

export const metadata = generateSEOMetadata({
	title: "Complete Field Service Features - Scheduling, Invoicing, CRM & More",
	section: "Platform",
	description:
		"Complete field service management features: AI scheduling, automated invoicing, mobile app, customer portal, CRM, inventory, and equipment tracking. All-in-one platform for service businesses.",
	path: "/features",
	keywords: [
		"field service management features",
		"scheduling software",
		"invoice automation",
		"mobile field service app",
		...featureKeywords.slice(0, 8),
	],
});

export default function FeaturesOverviewPage() {
	const features = getAllFeatures();

	// ItemList Schema - All features for AI understanding
	const featuresListSchema = createItemListSchema({
		name: "Thorbis Field Service Management Features",
		description: "Complete list of features in the Thorbis platform",
		items: features.map((feature) => ({
			name: feature.name,
			url: `${siteUrl}/features/${feature.slug}`,
			description: feature.summary,
		})),
	});

	// FAQ Schema - Common feature questions
	const faqSchema = createFAQSchema([
		{
			question: "What features are included in Thorbis?",
			answer:
				"Thorbis includes smart scheduling with AI-powered dispatch, automated invoicing with same-day payments, CRM for customer management, mobile app for field technicians, customer self-service portal, equipment and inventory tracking, estimates and contracts, and marketing automation—all in one platform.",
		},
		{
			question: "Is there a mobile app for technicians?",
			answer:
				"Yes. Thorbis includes native iOS and Android apps that work offline. Technicians can view job details, capture photos, collect signatures, process payments, and sync when connected. The app is included in the $200/month base price.",
		},
		{
			question: "Does Thorbis have AI features?",
			answer:
				"Yes. Thorbis includes AI-powered scheduling that optimizes routes and assigns the right technician. AI phone answering handles customer calls 24/7. AI chat assists customers and staff with common questions. AI features are billed at pay-as-you-go rates.",
		},
		{
			question: "Can customers book and pay online?",
			answer:
				"Absolutely. The customer portal allows your customers to request service, view appointment times, approve estimates, sign contracts, pay invoices, and see their service history—all without calling your office.",
		},
	]);

	return (
		<>
			{/* Breadcrumb Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Features", url: `${siteUrl}/features` },
						]),
					),
				}}
				id="features-breadcrumb-ld"
				type="application/ld+json"
			/>

			{/* ItemList Schema - All features */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(featuresListSchema),
				}}
				id="features-list-ld"
				type="application/ld+json"
			/>

			{/* FAQ Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqSchema),
				}}
				id="features-faq-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="mx-auto mb-14 max-w-3xl text-center">
					<span className="border-border text-primary mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
						Thorbis Platform
					</span>
					<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
						Everything you need to run a modern service company
					</h1>
					<p className="text-muted-foreground mt-4 text-lg">
						Select a module to explore deep-dive pages for dispatching, CRM,
						inventory, mobile workflows, and more. Build a connected tech stack
						designed for high-growth field operations with transparent
						pricing—$200/month base plus pay-as-you-go usage, unlimited users,
						and no lock-in contracts.
					</p>
					<div className="mt-6 flex flex-wrap justify-center gap-3">
						<Button asChild>
							<Link href="/waitlist">Join Waitlist</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/pricing">Review pricing</Link>
						</Button>
					</div>
				</header>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{features.map((feature) => {
						const Icon = getMarketingIcon(
							feature.valueProps[0]?.icon ?? "sparkles",
						);
						return (
							<Card
								className="flex h-full flex-col justify-between transition-shadow hover:shadow-md"
								key={feature.slug}
							>
								<CardHeader className="space-y-4">
									<div className="text-primary flex items-center gap-3">
										<Icon aria-hidden="true" className="size-8" />
										<Badge variant="secondary">{feature.name}</Badge>
									</div>
									<CardTitle className="text-2xl">
										{feature.heroTitle}
									</CardTitle>
									<CardDescription>{feature.summary}</CardDescription>
								</CardHeader>
								<CardContent className="flex flex-col gap-4">
									<div>
										<p className="text-muted-foreground text-sm font-medium">
											Common challenges solved
										</p>
										<ul className="text-muted-foreground mt-2 space-y-1 text-sm">
											{feature.painPoints.slice(0, 3).map((pain) => (
												<li className="flex gap-2" key={pain}>
													<span className="text-primary mt-1">•</span>
													<span>{pain}</span>
												</li>
											))}
										</ul>
									</div>
									<div>
										<p className="text-muted-foreground text-sm font-medium">
											Highlighted capability
										</p>
										<p className="text-muted-foreground text-sm">
											{feature.valueProps[0]?.title}
										</p>
									</div>
									<Button asChild>
										<Link href={`/features/${feature.slug}`}>
											Explore {feature.name}
										</Link>
									</Button>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</>
	);
}
