import { ArrowRight, Check, TrendingDown, DollarSign, Zap, Users, Clock } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	generateBreadcrumbStructuredData,
	generateFAQStructuredData,
	generateMetadata as generateSEOMetadata,
	generateServiceStructuredData,
	siteUrl,
} from "@/lib/seo/metadata";
import { getCompetitorBySlug } from "@/lib/marketing/competitors";

// Note: Caching is controlled by next.config.ts cacheLife configuration

export async function generateMetadata() {
	const competitor = getCompetitorBySlug("servicetitan");
	if (!competitor) return {};

	return generateSEOMetadata({
		title: competitor.seo.title,
		section: "Comparisons",
		description: competitor.seo.description,
		path: "/vs/servicetitan",
		keywords: competitor.seo.keywords,
	});
}

export default async function ServiceTitanPage() {
	const competitor = getCompetitorBySlug("servicetitan");
	if (!competitor) return null;

	const faqStructuredData = generateFAQStructuredData(competitor.faq);
	const serviceStructuredData = generateServiceStructuredData({
		name: `${competitor.competitorName} Alternative`,
		description: competitor.summary,
		offers: [
			{
				price: "200",
				currency: "USD",
				description: "Base platform with transparent pricing",
			},
		],
	});

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Comparisons", url: `${siteUrl}/vs` },
							{
								name: `Thorbis vs ${competitor.competitorName}`,
								url: `${siteUrl}/vs/servicetitan`,
							},
						]),
					),
				}}
				id="servicetitan-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceStructuredData),
				}}
				id="servicetitan-service-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqStructuredData),
				}}
				id="servicetitan-faq-ld"
				type="application/ld+json"
			/>

			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				{/* Hero - ServiceTitan Specific */}
				<section className="from-red-500/10 via-background to-red-500/5 relative mb-20 overflow-hidden rounded-3xl border bg-gradient-to-br p-8 sm:p-12 lg:p-16">
					<div className="bg-red-500/5 absolute top-0 right-0 -z-10 size-96 rounded-full blur-3xl" />

					<div className="relative mx-auto max-w-5xl">
						<div className="mb-6 flex items-center gap-4">
							<Badge className="bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-1.5 font-semibold">
								Enterprise Alternative
							</Badge>
							<div className="flex items-center gap-2 text-green-600 dark:text-green-400">
								<TrendingDown className="size-5" />
								<span className="font-bold">Save $250K+ annually</span>
							</div>
						</div>

						<h1 className="text-5xl font-bold tracking-tight text-balance lg:text-7xl">
							Escape ServiceTitan's Hidden Fees &amp; Lock-In
						</h1>

						<p className="text-muted-foreground mt-6 text-xl leading-relaxed text-balance sm:text-2xl">
							Real ServiceTitan customers report paying <span className="text-foreground font-semibold">$353,000/year</span> with{" "}
							<span className="text-foreground font-semibold">$5,276 unauthorized charges</span> for "free" features. Thorbis delivers enterprise
							capabilities at <span className="text-foreground font-semibold">$200/month base</span> with no surprises.
						</p>

						<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<Card className="border-red-500/20 bg-red-500/5">
								<CardContent className="p-4">
									<DollarSign className="mb-2 size-8 text-red-500" />
									<p className="text-foreground text-2xl font-bold">$353K</p>
									<p className="text-muted-foreground text-sm">Reported annual cost</p>
								</CardContent>
							</Card>
							<Card className="border-red-500/20 bg-red-500/5">
								<CardContent className="p-4">
									<Clock className="mb-2 size-8 text-red-500" />
									<p className="text-foreground text-2xl font-bold">4-6 mo</p>
									<p className="text-muted-foreground text-sm">Onboarding chaos</p>
								</CardContent>
							</Card>
							<Card className="border-green-500/20 bg-green-500/5">
								<CardContent className="p-4">
									<Zap className="mb-2 size-8 text-green-600 dark:text-green-400" />
									<p className="text-foreground text-2xl font-bold">30-45d</p>
									<p className="text-muted-foreground text-sm">Thorbis migration</p>
								</CardContent>
							</Card>
							<Card className="border-green-500/20 bg-green-500/5">
								<CardContent className="p-4">
									<Users className="mb-2 size-8 text-green-600 dark:text-green-400" />
									<p className="text-foreground text-2xl font-bold">70-85%</p>
									<p className="text-muted-foreground text-sm">Cost savings</p>
								</CardContent>
							</Card>
						</div>

						<div className="mt-8 flex flex-col gap-4 sm:flex-row">
							<Button asChild className="group" size="lg">
								<Link href="/register">
									Get your cost analysis
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">Talk to ServiceTitan refugees</Link>
							</Button>
						</div>

						<div className="border-border/50 mt-8 flex flex-wrap gap-6 border-t pt-6">
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">No unauthorized charges</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">No $23K termination fees</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">No multi-year prison</span>
							</div>
						</div>
					</div>
				</section>

				{/* The ServiceTitan Reality - Problem Agitation */}
				<section className="mb-20 rounded-2xl border-2 border-red-500/20 bg-red-500/5 p-8">
					<div className="mx-auto max-w-4xl">
						<h2 className="text-3xl font-bold">The ServiceTitan Reality Check</h2>
						<p className="text-muted-foreground mt-2">Real user complaints from BBB and review sites</p>

						<div className="mt-8 grid gap-6 md:grid-cols-2">
							<Card className="border-red-500/20">
								<CardContent className="p-6">
									<div className="mb-4 rounded-full bg-red-500/10 p-3 w-fit">
										<DollarSign className="size-6 text-red-500" />
									</div>
									<h3 className="text-lg font-bold">Hidden Fees &amp; Unauthorized Charges</h3>
									<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
										"$5,276 unauthorized Marketing Pro charge before launch." "Thousands in unexplained fees." "$353,000 annual cost" for
										mid-size team.
									</p>
								</CardContent>
							</Card>

							<Card className="border-red-500/20">
								<CardContent className="p-6">
									<div className="mb-4 rounded-full bg-red-500/10 p-3 w-fit">
										<Clock className="size-6 text-red-500" />
									</div>
									<h3 className="text-lg font-bold">Painful Onboarding</h3>
									<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
										"Onboarding was chaotic." "4-6 months to go live." "NEVER BEEN ONBOARDED after paying for 1 year."
									</p>
								</CardContent>
							</Card>

							<Card className="border-red-500/20">
								<CardContent className="p-6">
									<div className="mb-4 rounded-full bg-red-500/10 p-3 w-fit">
										<Users className="size-6 text-red-500" />
									</div>
									<h3 className="text-lg font-bold">Worst Customer Service</h3>
									<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
										"Absolutely the worst customer service I've ever had." "Weeks without resolution." 31 BBB complaints in 3 years.
									</p>
								</CardContent>
							</Card>

							<Card className="border-red-500/20">
								<CardContent className="p-6">
									<div className="mb-4 rounded-full bg-red-500/10 p-3 w-fit">
										<Zap className="size-6 text-red-500" />
									</div>
									<h3 className="text-lg font-bold">Contract Prison</h3>
									<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
										"$23,842 termination fee." "Multi-year contracts with auto-renewal traps." "Held hostage by contract."
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Thorbis Solution - Benefits */}
				<section className="mb-20">
					<div className="mx-auto max-w-4xl space-y-8">
						<div className="text-center">
							<h2 className="text-3xl font-bold">Why ServiceTitan Teams Switch to Thorbis</h2>
							<p className="text-muted-foreground mt-2">Enterprise power without the pain</p>
						</div>

						{competitor.thorbisAdvantages.map((advantage, index) => (
							<Card
								className="hover:border-primary/30 border-2 transition-all hover:shadow-lg"
								key={advantage.title}
							>
								<CardContent className="p-8">
									<div className="flex items-start gap-6">
										<div className="bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold">
											{index + 1}
										</div>
										<div className="space-y-2">
											<h3 className="text-xl font-bold">{advantage.title}</h3>
											<p className="text-muted-foreground leading-relaxed">{advantage.description}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* Testimonial */}
				{competitor.testimonial && (
					<section className="from-primary/10 via-primary/5 to-background mb-20 rounded-3xl border-2 bg-gradient-to-br p-12 text-center">
						<div className="mx-auto max-w-3xl">
							<div className="text-primary mb-6 text-6xl">"</div>
							<blockquote className="text-foreground text-2xl font-semibold leading-relaxed">
								{competitor.testimonial.quote}
							</blockquote>
							<footer className="mt-6 space-y-2">
								<p className="text-foreground font-bold">{competitor.testimonial.attribution}</p>
								{competitor.testimonial.role && <p className="text-muted-foreground">{competitor.testimonial.role}</p>}
							</footer>
						</div>
					</section>
				)}

				{/* Final CTA */}
				<section className="from-primary/10 via-background to-primary/5 rounded-3xl border-2 bg-gradient-to-br p-12 text-center">
					<div className="mx-auto max-w-3xl space-y-6">
						<h2 className="text-4xl font-bold">Stop Paying ServiceTitan's Hidden Fees</h2>
						<p className="text-muted-foreground text-lg">
							Join the hundreds of contractors who've escaped ServiceTitan's pricing chaos for transparent, predictable costs.
						</p>

						<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
							<Button asChild className="group" size="lg">
								<Link href="/register">
									Calculate your savings
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">Get migration timeline</Link>
							</Button>
						</div>

						<div className="flex flex-wrap justify-center gap-6 pt-6">
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">30-45 day migration</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">No data loss</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">Zero downtime</span>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
