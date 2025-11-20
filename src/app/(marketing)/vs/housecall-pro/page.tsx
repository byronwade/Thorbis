import { ArrowRight, Check, TrendingUp, Calendar, Sparkles, BarChart3, Building } from "lucide-react";
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
	const competitor = getCompetitorBySlug("housecall-pro");
	if (!competitor) return {};

	return generateSEOMetadata({
		title: competitor.seo.title,
		section: "Comparisons",
		description: competitor.seo.description,
		path: "/vs/housecall-pro",
		keywords: competitor.seo.keywords,
	});
}

export default async function HousecallProPage() {
	const competitor = getCompetitorBySlug("housecall-pro");
	if (!competitor) return null;

	const faqStructuredData = generateFAQStructuredData(competitor.faq);
	const serviceStructuredData = generateServiceStructuredData({
		name: `${competitor.competitorName} Alternative`,
		description: competitor.summary,
		offers: [
			{
				price: "200",
				currency: "USD",
				description: "Enterprise features at startup pricing",
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
								url: `${siteUrl}/vs/housecall-pro`,
							},
						]),
					),
				}}
				id="housecallpro-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceStructuredData),
				}}
				id="housecallpro-service-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqStructuredData),
				}}
				id="housecallpro-faq-ld"
				type="application/ld+json"
			/>

			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				{/* Hero - Housecall Pro Growth Focus */}
				<section className="from-blue-500/10 via-background to-blue-500/5 relative mb-20 overflow-hidden rounded-3xl border bg-gradient-to-br p-8 sm:p-12 lg:p-16">
					<div className="bg-blue-500/5 absolute top-0 right-0 -z-10 size-96 rounded-full blur-3xl" />

					<div className="relative mx-auto max-w-5xl">
						<div className="mb-6 flex flex-wrap items-center gap-4">
							<Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-1.5 font-semibold">
								The Natural Upgrade
							</Badge>
							<div className="flex items-center gap-2 text-green-600 dark:text-green-400">
								<TrendingUp className="size-5" />
								<span className="font-bold">Ready to scale beyond 5 trucks</span>
							</div>
						</div>

						<h1 className="text-5xl font-bold tracking-tight text-balance lg:text-7xl">
							Graduate From Housecall Pro to Enterprise Tools
						</h1>

						<p className="text-muted-foreground mt-6 text-xl leading-relaxed text-balance sm:text-2xl">
							Housecall Pro is perfect for starting out. Thorbis is where you grow up. Get{" "}
							<span className="text-foreground font-semibold">enterprise dispatch</span>,{" "}
							<span className="text-foreground font-semibold">native AI automation</span>, and{" "}
							<span className="text-foreground font-semibold">job costing</span> without sacrificing simplicity.
						</p>

						<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<Card className="border-blue-500/20 bg-blue-500/5">
								<CardContent className="p-4">
									<Calendar className="mb-2 size-8 text-blue-600 dark:text-blue-400" />
									<p className="text-foreground font-bold">Calendar → Dispatch</p>
									<p className="text-muted-foreground text-sm">Handle 500+ techs</p>
								</CardContent>
							</Card>
							<Card className="border-blue-500/20 bg-blue-500/5">
								<CardContent className="p-4">
									<Sparkles className="mb-2 size-8 text-blue-600 dark:text-blue-400" />
									<p className="text-foreground font-bold">Manual → AI</p>
									<p className="text-muted-foreground text-sm">35% less coordination</p>
								</CardContent>
							</Card>
							<Card className="border-blue-500/20 bg-blue-500/5">
								<CardContent className="p-4">
									<BarChart3 className="mb-2 size-8 text-blue-600 dark:text-blue-400" />
									<p className="text-foreground font-bold">Basic → Advanced</p>
									<p className="text-muted-foreground text-sm">True job profitability</p>
								</CardContent>
							</Card>
							<Card className="border-blue-500/20 bg-blue-500/5">
								<CardContent className="p-4">
									<Building className="mb-2 size-8 text-blue-600 dark:text-blue-400" />
									<p className="text-foreground font-bold">1 → 50 Locations</p>
									<p className="text-muted-foreground text-sm">Native multi-location</p>
								</CardContent>
							</Card>
						</div>

						<div className="mt-8 flex flex-col gap-4 sm:flex-row">
							<Button asChild className="group" size="lg">
								<Link href="/register">
									See your upgrade path
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">Talk to growth teams</Link>
							</Button>
						</div>

						<div className="border-border/50 mt-8 flex flex-wrap gap-6 border-t pt-6">
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">Keep the simplicity you love</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">Gain enterprise power</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">30-day migration</span>
							</div>
						</div>
					</div>
				</section>

				{/* When You Outgrow Housecall Pro */}
				<section className="mb-20">
					<div className="mx-auto max-w-4xl space-y-6">
						<div className="text-center">
							<h2 className="text-3xl font-bold">Signs You've Outgrown Housecall Pro</h2>
							<p className="text-muted-foreground mt-2">You're not alone—most teams hit these walls around 5-10 technicians</p>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<Card>
								<CardContent className="p-6">
									<div className="mb-4 rounded-full bg-orange-500/10 p-3 w-fit">
										<Calendar className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<h3 className="text-lg font-bold">Calendar Scheduling Struggles</h3>
									<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
										Calendar view works great for 5 techs, but gets chaotic with 12-truck operations. No capacity planning, crew management, or
										advanced routing.
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6">
									<div className="mb-4 rounded-full bg-orange-500/10 p-3 w-fit">
										<Sparkles className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<h3 className="text-lg font-bold">Missing AI Automation</h3>
									<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
										Still manually booking calls, coordinating schedules, sending follow-ups. Users report needing Zapier for basic automations
										that should be built-in.
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6">
									<div className="mb-4 rounded-full bg-orange-500/10 p-3 w-fit">
										<BarChart3 className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<h3 className="text-lg font-bold">Limited Job Costing</h3>
									<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
										Can see revenue but not true profitability. No granular analysis per job, tech, or customer. Rely on spreadsheets to
										understand margins.
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6">
									<div className="mb-4 rounded-full bg-orange-500/10 p-3 w-fit">
										<Building className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<h3 className="text-lg font-bold">Single-Location Design</h3>
									<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
										"Outgrew it when we opened location #2." No location-specific dispatch, pricebooks, or reporting. Managing multiple branches
										requires workarounds.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* What You Get With Thorbis */}
				<section className="mb-20 rounded-2xl border-2 border-green-500/20 bg-green-500/5 p-8">
					<div className="mx-auto max-w-4xl">
						<h2 className="text-3xl font-bold">What Changes When You Upgrade</h2>
						<p className="text-muted-foreground mt-2">Everything Housecall Pro should have built for scaling teams</p>

						<div className="mt-8 space-y-6">
							{competitor.thorbisAdvantages.map((advantage, index) => (
								<div className="flex items-start gap-4" key={advantage.title}>
									<div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold">
										{index + 1}
									</div>
									<div className="space-y-1">
										<h3 className="text-lg font-bold">{advantage.title}</h3>
										<p className="text-muted-foreground text-sm leading-relaxed">{advantage.description}</p>
									</div>
								</div>
							))}
						</div>
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

				{/* Pricing Comparison */}
				<section className="mb-20">
					<div className="mx-auto max-w-4xl">
						<h2 className="text-center text-3xl font-bold">Often Costs Less, Delivers More</h2>
						<p className="text-muted-foreground mt-2 text-center">Why pay per-user fees when you can pay for results?</p>

						<div className="mt-8 grid gap-6 md:grid-cols-2">
							<Card className="border-2 border-red-500/20">
								<CardContent className="p-6">
									<Badge className="mb-4 bg-red-500/10 text-red-600 dark:text-red-400">Housecall Pro</Badge>
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="text-muted-foreground text-sm">Base pricing</span>
											<span className="text-foreground font-semibold">$169-$499/mo</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground text-sm">Per-user fees</span>
											<span className="text-foreground font-semibold">Increases with team</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground text-sm">AI features</span>
											<span className="text-red-600 dark:text-red-400 font-semibold">Not native</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground text-sm">Advanced features</span>
											<span className="text-red-600 dark:text-red-400 font-semibold">Higher tiers only</span>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="border-2 border-green-500/20 bg-green-500/5">
								<CardContent className="p-6">
									<Badge className="mb-4 bg-green-500/10 text-green-600 dark:text-green-400">Thorbis</Badge>
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="text-muted-foreground text-sm">Base pricing</span>
											<span className="text-foreground font-semibold">$200/mo</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground text-sm">Office users</span>
											<span className="text-green-600 dark:text-green-400 font-semibold">Unlimited free</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground text-sm">AI automation</span>
											<span className="text-green-600 dark:text-green-400 font-semibold">All included</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground text-sm">Typical all-in</span>
											<span className="text-foreground font-semibold">$350-800/mo</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Final CTA */}
				<section className="from-primary/10 via-background to-primary/5 rounded-3xl border-2 bg-gradient-to-br p-12 text-center">
					<div className="mx-auto max-w-3xl space-y-6">
						<h2 className="text-4xl font-bold">Time to Grow Up?</h2>
						<p className="text-muted-foreground text-lg">
							Housecall Pro helped you start. Thorbis will help you scale. Keep what works, gain what's missing.
						</p>

						<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
							<Button asChild className="group" size="lg">
								<Link href="/register">
									Start your upgrade
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">Compare features</Link>
							</Button>
						</div>

						<div className="flex flex-wrap justify-center gap-6 pt-6">
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">Data migrates perfectly</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">Team loves the upgrade</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">30-day go-live</span>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
