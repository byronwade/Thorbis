import { Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { getMarketingIcon } from "@/components/marketing/marketing-icons";
import { PricingBadge } from "@/components/marketing/pricing-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getAllIndustries } from "@/lib/marketing/industries";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";
import { createFAQSchema, createItemListSchema } from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const industriesKeywords = generateSemanticKeywords("industries");

export const metadata = generateSEOMetadata({
	title: "Industries Powered by Thorbis",
	section: "Platform",
	description:
		"Thorbis helps HVAC, plumbing, electrical, cleaning, and other service businesses deliver world-class operations. Explore industry-specific playbooks and best practices.",
	path: "/industries",
	keywords: [
		"field service industries",
		"thorbis industries",
		"service business software by industry",
		"hvac software",
		"plumbing software",
		"electrical contractor software",
		...industriesKeywords.slice(0, 5),
	],
});

export default function IndustriesOverviewPage() {
	const industries = getAllIndustries();

	// ItemList Schema - All industries
	const industriesListSchema = createItemListSchema({
		name: "Industries Served by Thorbis",
		description:
			"Complete list of service industries supported by Thorbis field service management software",
		items: industries.map((industry) => ({
			name: industry.name,
			url: `${siteUrl}/industries/${industry.slug}`,
			description: industry.summary,
		})),
	});

	// FAQ Schema - Industry-specific questions
	const faqSchema = createFAQSchema([
		{
			question: "What industries does Thorbis support?",
			answer:
				"Thorbis supports 12+ service industries including HVAC, plumbing, electrical, landscaping, pool service, pest control, cleaning, roofing, garage door, appliance repair, locksmith, and general contracting. Each industry gets tailored workflows, automations, and reporting.",
		},
		{
			question: "Does Thorbis have industry-specific features?",
			answer:
				"Yes. Thorbis includes industry-specific playbooks with pre-built workflows, job templates, pricing guides, and compliance checklists. HVAC techs get refrigerant tracking, plumbers get permit management, and landscapers get recurring route optimization.",
		},
		{
			question: "Is the pricing the same for all industries?",
			answer:
				"Yes. Every industry gets the same transparent pricing: $200/month base fee with pay-as-you-go usage. No per-user fees, no per-technician fees, and no long-term contracts required.",
		},
		{
			question: "Can I customize Thorbis for my specific trade?",
			answer:
				"Absolutely. While Thorbis comes with industry-specific defaults, you can customize job types, service forms, pricing, and workflows to match your exact business processes.",
		},
	]);

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Industries", url: `${siteUrl}/industries` },
						]),
					),
				}}
				id="industries-breadcrumb-ld"
				type="application/ld+json"
			/>

			{/* Industries List Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(industriesListSchema),
				}}
				id="industries-list-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>

			{/* FAQ Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqSchema),
				}}
				id="industries-faq-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>
			<div className="bg-background">
				<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
					{/* Enhanced Hero Section */}
					<header className="mx-auto mb-16 max-w-4xl text-center">
						<Badge className="mb-6 bg-primary/10 text-primary dark:text-primary px-4 py-1.5 font-semibold">
							Built for Service Leaders
						</Badge>
						<h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
							<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
								Industry Expertise
							</span>
							<br />
							Included with Every Deployment
						</h1>
						<p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-relaxed">
							Whether you respond to emergency plumbing calls or run recurring landscaping routes, Thorbis adapts to your playbooks with proven workflows, automations, and reporting. Every industry gets the same transparent pricing—$200/month base plus pay-as-you-go usage.
						</p>

						<div className="mb-10 flex flex-wrap items-center justify-center gap-6">
							<div className="flex items-center gap-2">
								<div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
									<Check className="text-primary size-5" />
								</div>
								<div className="text-left">
									<p className="text-foreground text-sm font-semibold">$200/Month Base</p>
									<p className="text-muted-foreground text-xs">Unlimited users</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
									<Check className="text-primary size-5" />
								</div>
								<div className="text-left">
									<p className="text-foreground text-sm font-semibold">No Lock-In</p>
									<p className="text-muted-foreground text-xs">Cancel anytime</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
									<Check className="text-primary size-5" />
								</div>
								<div className="text-left">
									<p className="text-foreground text-sm font-semibold">12+ Industries</p>
									<p className="text-muted-foreground text-xs">Proven playbooks</p>
								</div>
							</div>
						</div>

						<div className="flex flex-wrap justify-center gap-4">
							<Button asChild className="bg-gradient-to-r from-primary to-primary/80 shadow-lg" size="lg">
								<Link href="/waitlist">
									Join Waitlist
									<ChevronRight className="ml-2 size-4" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/case-studies">View Customer Stories</Link>
							</Button>
						</div>
					</header>

					{/* Industry Cards Grid */}
					<section className="mb-16">
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{industries.map((industry) => {
								const Icon = getMarketingIcon(
									industry.valueProps[0]?.icon ?? "sparkles",
								);
								return (
									<Card
										className="border-primary/10 group relative flex h-full flex-col justify-between overflow-hidden transition-all hover:shadow-xl hover:border-primary/30"
										key={industry.slug}
									>
										{/* Gradient overlay on hover */}
										<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

										<CardHeader className="relative space-y-4">
											<div className="flex items-start justify-between">
												<div className="bg-primary/10 group-hover:bg-primary/20 flex size-14 items-center justify-center rounded-xl transition-colors">
													<Icon aria-hidden="true" className="text-primary size-7" />
												</div>
												<Badge className="bg-primary/10 text-primary" variant="secondary">
													{industry.name}
												</Badge>
											</div>
											<CardTitle className="text-2xl group-hover:text-primary transition-colors">
												{industry.heroTitle}
											</CardTitle>
											<CardDescription className="line-clamp-2">
												{industry.summary}
											</CardDescription>
										</CardHeader>
										<CardContent className="relative flex flex-col gap-4">
											<div>
												<p className="text-muted-foreground mb-2 text-sm font-semibold">
													Specialties We Support
												</p>
												<div className="flex flex-wrap gap-2">
													{industry.fieldTypes.slice(0, 3).map((type) => (
														<Badge key={type} variant="outline" className="text-xs">
															{type}
														</Badge>
													))}
												</div>
											</div>
											<div className="bg-primary/5 rounded-lg border border-primary/10 p-3">
												<p className="text-foreground text-sm font-semibold">
													{industry.stats[0]?.label}
												</p>
												<p className="text-primary text-2xl font-bold">
													{industry.stats[0]?.value}
												</p>
												<p className="text-muted-foreground text-xs">
													{industry.stats[0]?.description}
												</p>
											</div>
											<Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
												<Link href={`/industries/${industry.slug}`}>
													Explore {industry.name}
													<ChevronRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
												</Link>
											</Button>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</section>

					{/* Final CTA Section */}
					<section className="from-primary/10 via-primary/5 to-primary/10 rounded-2xl border bg-gradient-to-r p-10 text-center">
						<Badge className="mb-4" variant="secondary">
							Ready to Get Started?
						</Badge>
						<h2 className="mb-3 text-3xl font-semibold">
							Join Field Service Teams Across 12+ Industries
						</h2>
						<p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
							No matter your industry, Thorbis delivers the tools, automations, and insights you need to grow. $200/month base with unlimited users.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Button asChild size="lg">
								<Link href="/waitlist">
									Join Waitlist
									<ChevronRight className="ml-2 size-4" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/pricing">View Pricing</Link>
							</Button>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}
