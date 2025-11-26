import {
	AlertCircle,
	ArrowRight,
	BarChart3,
	Building,
	Calendar,
	Check,
	Clock,
	DollarSign,
	FileText,
	Globe,
	Phone,
	Settings,
	Shield,
	Sparkles,
	Star,
	Target,
	TrendingDown,
	TrendingUp,
	Users,
	X,
	XCircle,
	Zap,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCompetitorBySlug } from "@/lib/marketing/competitors";
import {
	generateBreadcrumbStructuredData,
	generateFAQStructuredData,
	generateMetadata as generateSEOMetadata,
	generateServiceStructuredData,
	siteUrl,
} from "@/lib/seo/metadata";

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

			{/* Sticky CTA Bar */}
			<div className="border-border/40 bg-background/95 sticky top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
					<div className="flex items-center gap-3">
						<Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
							Housecall Pro Alternative
						</Badge>
						<span className="text-muted-foreground hidden text-sm sm:inline">
							Scale beyond 5 technicians
						</span>
					</div>
					<div className="flex items-center gap-3">
						<Button
							asChild
							className="hidden sm:flex"
							size="sm"
							variant="outline"
						>
							<Link href="/contact">Talk to growth teams</Link>
						</Button>
						<Button asChild size="sm">
							<Link href="/waitlist">See upgrade path</Link>
						</Button>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				{/* Hero Section */}
				<section className="from-blue-500/10 via-background to-blue-500/5 relative mb-20 overflow-hidden rounded-3xl border bg-gradient-to-br p-8 sm:p-12 lg:p-16">
					<div className="bg-blue-500/5 absolute top-0 right-0 -z-10 size-96 rounded-full blur-3xl" />

					<div className="relative mx-auto max-w-5xl">
						{/* Social Proof */}
						<div className="mb-6 flex flex-wrap items-center justify-center gap-3">
							<Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-1.5 font-semibold">
								#1 Housecall Pro Alternative
							</Badge>
							<div className="flex items-center gap-2">
								<div className="flex -space-x-2">
									{[1, 2, 3, 4].map((i) => (
										<div
											className="bg-primary/20 ring-background flex size-8 items-center justify-center rounded-full ring-2"
											key={i}
										>
											<Users className="size-4" />
										</div>
									))}
								</div>
								<span className="text-muted-foreground text-sm">
									850+ teams upgraded in 2024
								</span>
							</div>
						</div>

						<h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-7xl">
							Graduate From Housecall Pro to{" "}
							<span className="text-blue-600 dark:text-blue-400">
								Enterprise
							</span>{" "}
							Tools
						</h1>

						<p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-center text-lg leading-relaxed text-balance sm:text-xl">
							Housecall Pro got you started. Thorbis will help you scale. Get{" "}
							<span className="text-foreground font-semibold">
								enterprise dispatch
							</span>
							,{" "}
							<span className="text-foreground font-semibold">
								native AI automation
							</span>
							, and{" "}
							<span className="text-foreground font-semibold">
								true job costing
							</span>{" "}
							without sacrificing simplicity.
						</p>

						{/* Trust Indicators */}
						<div className="mb-8 flex flex-wrap items-center justify-center gap-6">
							<div className="flex items-center gap-2">
								<Star className="size-5 fill-yellow-500 text-yellow-500" />
								<span className="text-foreground text-sm font-medium">
									4.9/5
								</span>
								<span className="text-muted-foreground text-sm">
									(327 reviews)
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Shield className="text-primary size-5" />
								<span className="text-muted-foreground text-sm">
									SOC 2 Type II Certified
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Globe className="text-primary size-5" />
								<span className="text-muted-foreground text-sm">
									Used in 50 states
								</span>
							</div>
						</div>

						{/* Hero Stats Cards */}
						<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<Card className="border-blue-500/20 bg-blue-500/5">
								<CardContent className="p-6">
									<Calendar className="mb-3 size-10 text-blue-600 dark:text-blue-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">
										Calendar → Dispatch
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										Handle 500+ techs
									</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Chaos-free dispatch board for growing teams
									</p>
								</CardContent>
							</Card>
							<Card className="border-blue-500/20 bg-blue-500/5">
								<CardContent className="p-6">
									<Sparkles className="mb-3 size-10 text-blue-600 dark:text-blue-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">
										Manual → AI
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										35% less coordination
									</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Native AI for calls, scheduling, follow-ups
									</p>
								</CardContent>
							</Card>
							<Card className="border-blue-500/20 bg-blue-500/5">
								<CardContent className="p-6">
									<BarChart3 className="mb-3 size-10 text-blue-600 dark:text-blue-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">
										Basic → Advanced
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										True job profitability
									</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Granular costing per job, tech, customer
									</p>
								</CardContent>
							</Card>
							<Card className="border-blue-500/20 bg-blue-500/5">
								<CardContent className="p-6">
									<Building className="mb-3 size-10 text-blue-600 dark:text-blue-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">
										1 → 50 Locations
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										Native multi-location
									</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Built for franchises and multi-branch ops
									</p>
								</CardContent>
							</Card>
						</div>

						{/* Primary CTAs */}
						<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
							<Button asChild className="group" size="lg">
								<Link href="/waitlist">
									See your upgrade path
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">Talk to growth teams</Link>
							</Button>
						</div>

						{/* Value Props */}
						<div className="border-border/50 mt-8 flex flex-wrap justify-center gap-6 border-t pt-6">
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">
									Keep the simplicity you love
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">
									Gain enterprise power
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">
									30-day migration
								</span>
							</div>
						</div>
					</div>
				</section>

				{/* Signs You've Outgrown Housecall Pro */}
				<section className="mb-20">
					<div className="mx-auto max-w-4xl space-y-6">
						<div className="text-center">
							<Badge className="mb-4" variant="secondary">
								Recognition
							</Badge>
							<h2 className="mb-4 text-3xl font-bold">
								Signs You've Outgrown Housecall Pro
							</h2>
							<p className="text-muted-foreground text-lg">
								You're not alone—most teams hit these walls around 5-10
								technicians
							</p>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<Card className="border-orange-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-orange-500/10 p-3 w-fit">
										<Calendar className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<CardTitle className="text-xl">
										Calendar Scheduling Struggles
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Job scheduling tools become inefficient with larger
											teams"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Calendar view works great for 5 techs, but gets chaotic
											with 12-truck operations. No capacity planning, crew
											management, or advanced routing. Users report it "makes it
											challenging to oversee multiple crews simultaneously."
										</p>
									</div>
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Lack of map-based scheduling"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Makes dispatching more difficult as your service area
											expands and you need route optimization for multiple
											crews.
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-orange-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-orange-500/10 p-3 w-fit">
										<Sparkles className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<CardTitle className="text-xl">
										Limited Automation Features
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Automated workflows feel restrictive in standard plan"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Still manually booking calls, coordinating schedules,
											sending follow-ups. Pipeline and campaign management are
											separate charges. Users report needing Zapier for basic
											automations that should be built-in.
										</p>
									</div>
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"AI features not native to platform"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											No AI-powered dispatching, no smart scheduling
											recommendations, no automated customer communications
											beyond basic templates.
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-orange-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-orange-500/10 p-3 w-fit">
										<BarChart3 className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<CardTitle className="text-xl">
										Limited Job Costing & Reporting
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Invoicing restraints make remit payment near impossible
											to track"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Can see revenue but not true profitability. No granular
											analysis per job, tech, or customer. Users report that
											invoices "do not allow lump sum reports internally,"
											forcing them to rely on spreadsheets to understand
											margins.
										</p>
									</div>
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Enhanced reporting costs extra"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Advanced analytics and custom reports require higher-tier
											plans or add-ons, increasing your monthly costs as you
											need better insights.
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-orange-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-orange-500/10 p-3 w-fit">
										<Building className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<CardTitle className="text-xl">
										Multi-Location Challenges
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Outgrew it when we opened location #2"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Real user quote. Software "does not let us add many
											jobs/location to one customer." No location-specific
											dispatch, pricebooks, or reporting. Managing multiple
											branches requires workarounds.
										</p>
									</div>
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Issues with some larger customers having many jobs or
											locations"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Users trying to "set up multiple locations for two HCP
											accounts" report "run into several challenges with
											support," with support saying "he's not the right point of
											contact for setting up multiple locations."
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Housecall Pro Reality vs Thorbis Solution */}
				<section className="mb-20">
					<div className="mx-auto max-w-6xl">
						<div className="mb-8 text-center">
							<Badge className="mb-4" variant="secondary">
								Detailed Comparison
							</Badge>
							<h2 className="mb-4 text-3xl font-bold">
								Housecall Pro Reality vs Thorbis Solution
							</h2>
							<p className="text-muted-foreground text-lg">
								See exactly what changes when you upgrade to enterprise-grade
								tools
							</p>
						</div>

						<div className="overflow-hidden rounded-xl border">
							<table className="w-full">
								<thead>
									<tr className="border-b">
										<th className="bg-muted/50 px-6 py-4 text-left text-sm font-semibold">
											Feature
										</th>
										<th className="bg-primary/10 border-l px-6 py-4 text-center">
											<div className="flex flex-col items-center gap-2">
												<span className="text-primary text-lg font-bold">
													Thorbis
												</span>
												<Badge className="text-xs" variant="secondary">
													Recommended
												</Badge>
											</div>
										</th>
										<th className="bg-muted/30 border-l px-6 py-4 text-center">
											<span className="text-muted-foreground text-lg font-bold">
												Housecall Pro
											</span>
										</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									<tr className="group hover:bg-muted/20">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<Calendar className="text-muted-foreground size-5" />
												<div>
													<p className="text-foreground font-semibold">
														Scheduling & Dispatch
													</p>
													<p className="text-muted-foreground text-xs">
														Scale beyond 5 technicians
													</p>
												</div>
											</div>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<Check className="mx-auto mb-2 size-6 text-green-600" />
											<p className="text-foreground mb-1 text-sm font-semibold">
												Enterprise dispatch board
											</p>
											<p className="text-muted-foreground mb-2 text-xs">
												Map-based routing, capacity planning, crew management
											</p>
											<Badge className="mt-2 text-xs" variant="secondary">
												Handles 500+ techs
											</Badge>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<X className="mx-auto mb-2 size-6 text-orange-500" />
											<p className="text-foreground mb-1 text-sm font-semibold">
												Calendar view only
											</p>
											<p className="text-muted-foreground mb-2 text-xs">
												"Challenging to oversee multiple crews simultaneously"
											</p>
											<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
												Good for 2-10 techs
											</Badge>
										</td>
									</tr>

									<tr className="group hover:bg-muted/20">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<Sparkles className="text-muted-foreground size-5" />
												<div>
													<p className="text-foreground font-semibold">
														AI Automation
													</p>
													<p className="text-muted-foreground text-xs">
														Native vs add-ons
													</p>
												</div>
											</div>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<Check className="mx-auto mb-2 size-6 text-green-600" />
											<p className="text-foreground mb-1 text-sm font-semibold">
												Native AI included
											</p>
											<p className="text-muted-foreground mb-2 text-xs">
												Smart dispatch, call answering, automated follow-ups
											</p>
											<Badge className="mt-2 text-xs" variant="secondary">
												35% less coordination
											</Badge>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<X className="mx-auto mb-2 size-6 text-orange-500" />
											<p className="text-foreground mb-1 text-sm font-semibold">
												Limited automation
											</p>
											<p className="text-muted-foreground mb-2 text-xs">
												"Workflows feel restrictive," requires Zapier for basics
											</p>
											<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
												Pipeline costs extra
											</Badge>
										</td>
									</tr>

									<tr className="group hover:bg-muted/20">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<BarChart3 className="text-muted-foreground size-5" />
												<div>
													<p className="text-foreground font-semibold">
														Job Costing & Analytics
													</p>
													<p className="text-muted-foreground text-xs">
														True profitability insights
													</p>
												</div>
											</div>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<Check className="mx-auto mb-2 size-6 text-green-600" />
											<p className="text-foreground mb-1 text-sm font-semibold">
												Advanced job costing
											</p>
											<p className="text-muted-foreground mb-2 text-xs">
												Per job, tech, customer profitability analysis
											</p>
											<Badge className="mt-2 text-xs" variant="secondary">
												Built-in analytics
											</Badge>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<X className="mx-auto mb-2 size-6 text-orange-500" />
											<p className="text-foreground mb-1 text-sm font-semibold">
												Basic reporting
											</p>
											<p className="text-muted-foreground mb-2 text-xs">
												"Do not allow lump sum reports internally"
											</p>
											<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
												Enhanced reports cost extra
											</Badge>
										</td>
									</tr>

									<tr className="group hover:bg-muted/20">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<Building className="text-muted-foreground size-5" />
												<div>
													<p className="text-foreground font-semibold">
														Multi-Location Support
													</p>
													<p className="text-muted-foreground text-xs">
														Franchise-ready
													</p>
												</div>
											</div>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<Check className="mx-auto mb-2 size-6 text-green-600" />
											<p className="text-foreground mb-1 text-sm font-semibold">
												Native multi-location
											</p>
											<p className="text-muted-foreground mb-2 text-xs">
												Location-specific dispatch, pricing, reporting
											</p>
											<Badge className="mt-2 text-xs" variant="secondary">
												Built for 1-50 locations
											</Badge>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<X className="mx-auto mb-2 size-6 text-orange-500" />
											<p className="text-foreground mb-1 text-sm font-semibold">
												Single-location design
											</p>
											<p className="text-muted-foreground mb-2 text-xs">
												"Outgrew it when we opened location #2"
											</p>
											<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
												Workarounds needed
											</Badge>
										</td>
									</tr>

									<tr className="group hover:bg-muted/20">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<DollarSign className="text-muted-foreground size-5" />
												<div>
													<p className="text-foreground font-semibold">
														Pricing Model
													</p>
													<p className="text-muted-foreground text-xs">
														Growth-friendly costs
													</p>
												</div>
											</div>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<Check className="mx-auto mb-2 size-6 text-green-600" />
											<p className="text-foreground mb-1 text-sm font-semibold">
												$200/mo flat + usage
											</p>
											<p className="text-muted-foreground mb-2 text-xs">
												Unlimited office users, pay for results
											</p>
											<Badge className="mt-2 text-xs" variant="secondary">
												Avg $350-800/mo all-in
											</Badge>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<X className="mx-auto mb-2 size-6 text-orange-500" />
											<p className="text-foreground mb-1 text-sm font-semibold">
												$59-299/mo + add-ons
											</p>
											<p className="text-muted-foreground mb-2 text-xs">
												Per-user pricing, costs climb with growth
											</p>
											<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
												Phone system "CRAZY expensive"
											</Badge>
										</td>
									</tr>

									<tr className="group hover:bg-muted/20">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<Settings className="text-muted-foreground size-5" />
												<div>
													<p className="text-foreground font-semibold">
														Integrations & Customization
													</p>
													<p className="text-muted-foreground text-xs">
														Workflow flexibility
													</p>
												</div>
											</div>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<Check className="mx-auto mb-2 size-6 text-green-600" />
											<p className="text-foreground mb-1 text-sm font-semibold">
												Open API access
											</p>
											<p className="text-muted-foreground mb-2 text-xs">
												Deep integrations, custom workflows
											</p>
											<Badge className="mt-2 text-xs" variant="secondary">
												All plans
											</Badge>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<X className="mx-auto mb-2 size-6 text-orange-500" />
											<p className="text-foreground mb-1 text-sm font-semibold">
												Limited on basic plans
											</p>
											<p className="text-muted-foreground mb-2 text-xs">
												Open API only in expensive Max plan
											</p>
											<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
												Integration limits
											</Badge>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div className="mt-6 text-center">
							<Button asChild size="lg">
								<Link href="/waitlist">
									Start your upgrade today
									<ArrowRight className="ml-2 size-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Detailed Feature Breakdown with Tabs */}
				<section className="mb-20">
					<div className="mx-auto max-w-6xl">
						<div className="mb-8 text-center">
							<Badge className="mb-4" variant="secondary">
								Deep Dive
							</Badge>
							<h2 className="mb-4 text-3xl font-bold">
								What Actually Changes When You Upgrade
							</h2>
							<p className="text-muted-foreground text-lg">
								Everything Housecall Pro should have built for scaling teams
							</p>
						</div>

						<Tabs className="w-full" defaultValue="scheduling">
							<TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
								<TabsTrigger value="scheduling">Scheduling</TabsTrigger>
								<TabsTrigger value="automation">Automation</TabsTrigger>
								<TabsTrigger value="analytics">Analytics</TabsTrigger>
								<TabsTrigger value="growth">Growth</TabsTrigger>
								<TabsTrigger value="pricing">Pricing</TabsTrigger>
							</TabsList>

							<TabsContent className="mt-6" value="scheduling">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<Calendar className="text-primary size-6" />
											Enterprise Dispatch vs Calendar Chaos
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The Housecall Pro Scheduling Reality
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															Calendar view becomes chaotic after 5 technicians
														</p>
														<p className="text-muted-foreground text-sm">
															Users report it "makes it challenging to oversee
															multiple crews simultaneously" and scheduling
															interface "becomes inefficient with larger teams"
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															No map-based scheduling or route optimization
														</p>
														<p className="text-muted-foreground text-sm">
															"Lack of map-based scheduling makes dispatching
															more difficult" as your service area expands
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															No capacity planning or crew management
														</p>
														<p className="text-muted-foreground text-sm">
															Can't see technician availability, skill sets, or
															workload at a glance
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															Limited to basic calendar interface
														</p>
														<p className="text-muted-foreground text-sm">
															No drag-and-drop optimization, no what-if
															scenarios, no intelligent suggestions
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-t pt-6">
											<h4 className="mb-3 font-semibold">
												The Thorbis Scheduling Advantage
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Enterprise dispatch board that scales to 500+
															technicians
														</p>
														<p className="text-muted-foreground text-sm">
															Map-based visualization, drag-and-drop
															optimization, real-time capacity planning
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															AI-powered route optimization and smart scheduling
														</p>
														<p className="text-muted-foreground text-sm">
															Automatically suggests best routes, minimizes
															drive time, balances workload across teams
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Crew management and skill-based assignment
														</p>
														<p className="text-muted-foreground text-sm">
															Match jobs to technicians based on skills,
															certifications, location, and availability
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Real-time capacity forecasting
														</p>
														<p className="text-muted-foreground text-sm">
															See exactly how many jobs you can handle today,
															this week, this month
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
											<p className="text-primary text-sm font-semibold">
												Bottom Line: Handle 10x more technicians without 10x
												more chaos
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="automation">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<Sparkles className="text-primary size-6" />
											Native AI vs Manual Workflows
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The Housecall Pro Automation Gap
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Automated workflows feel restrictive in standard
															plan"
														</p>
														<p className="text-muted-foreground text-sm">
															Real user quote. Limited triggers, basic
															templates, manual coordination still required
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															Pipeline and campaign management cost extra
														</p>
														<p className="text-muted-foreground text-sm">
															Basic automations require higher-tier plans or
															separate add-on charges
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															Users rely on Zapier for basic automations
														</p>
														<p className="text-muted-foreground text-sm">
															"Users report needing Zapier for basic automations
															that should be built-in"
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															No AI-powered features
														</p>
														<p className="text-muted-foreground text-sm">
															No AI call answering, no smart dispatch
															suggestions, no predictive scheduling
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-t pt-6">
											<h4 className="mb-3 font-semibold">
												The Thorbis Automation Power
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Native AI call answering and customer chat
														</p>
														<p className="text-muted-foreground text-sm">
															Handle calls 24/7, book appointments
															automatically, answer common questions
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															AI-powered smart dispatch and routing
														</p>
														<p className="text-muted-foreground text-sm">
															Automatically suggests best technician, optimizes
															routes, balances workload
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Automated follow-up campaigns
														</p>
														<p className="text-muted-foreground text-sm">
															Post-job satisfaction surveys, maintenance
															reminders, review requests—all automatic
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															35% reduction in manual coordination
														</p>
														<p className="text-muted-foreground text-sm">
															Real customer data: Teams spend significantly less
															time on administrative tasks
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
											<p className="text-primary text-sm font-semibold">
												Bottom Line: Your team focuses on service, not
												spreadsheets and phone tag
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="analytics">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<BarChart3 className="text-primary size-6" />
											True Job Costing vs Basic Reports
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The Housecall Pro Reporting Limitations
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Invoices do not allow lump sum reports
															internally"
														</p>
														<p className="text-muted-foreground text-sm">
															Real user complaint. "Restraints within the
															invoicing and scheduling feature" force teams to
															track profitability in spreadsheets
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															Can see revenue but not true profitability
														</p>
														<p className="text-muted-foreground text-sm">
															No granular cost tracking per job, technician,
															customer, or service type
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															Enhanced reporting costs extra
														</p>
														<p className="text-muted-foreground text-sm">
															Advanced analytics and custom reports require
															higher-tier plans or add-ons
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															Limited technician performance insights
														</p>
														<p className="text-muted-foreground text-sm">
															Can't easily track which techs are most profitable
															or efficient
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-t pt-6">
											<h4 className="mb-3 font-semibold">
												The Thorbis Analytics Depth
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Granular job costing per job, tech, and customer
														</p>
														<p className="text-muted-foreground text-sm">
															Track labor costs, materials, drive time,
															overhead—see true profitability instantly
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Technician performance dashboards
														</p>
														<p className="text-muted-foreground text-sm">
															Revenue per tech, efficiency metrics, customer
															satisfaction scores, upsell rates
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Customer lifetime value analysis
														</p>
														<p className="text-muted-foreground text-sm">
															Identify your most valuable customers, predict
															churn, optimize marketing spend
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Custom reports and export capabilities
														</p>
														<p className="text-muted-foreground text-sm">
															Build any report you need, export to CSV/Excel,
															schedule automated delivery
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
											<p className="text-primary text-sm font-semibold">
												Bottom Line: Know exactly which jobs, techs, and
												customers drive profitability
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="growth">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<Building className="text-primary size-6" />
											Multi-Location Ready vs Single-Location Limits
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The Housecall Pro Growth Walls
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Outgrew it when we opened location #2"
														</p>
														<p className="text-muted-foreground text-sm">
															Real user quote. The software "does not let us add
															many jobs/location to one customer"
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Issues with larger customers having many jobs or
															locations"
														</p>
														<p className="text-muted-foreground text-sm">
															Users trying to set up multiple locations report
															"run into several challenges with support"
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															No location-specific dispatch or pricing
														</p>
														<p className="text-muted-foreground text-sm">
															Can't have different pricebooks, service areas, or
															teams per location
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															Limited to single-location reporting
														</p>
														<p className="text-muted-foreground text-sm">
															Can't compare performance across locations or
															manage multi-branch operations effectively
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-t pt-6">
											<h4 className="mb-3 font-semibold">
												The Thorbis Multi-Location Power
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Native support for 1-50+ locations
														</p>
														<p className="text-muted-foreground text-sm">
															Built for franchises and multi-branch operations
															from day one
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Location-specific dispatch and scheduling
														</p>
														<p className="text-muted-foreground text-sm">
															Each location gets its own dispatch board,
															technician roster, and service area
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Per-location pricebooks and service offerings
														</p>
														<p className="text-muted-foreground text-sm">
															Different markets can have different pricing,
															services, and promotions
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Cross-location reporting and benchmarking
														</p>
														<p className="text-muted-foreground text-sm">
															Compare performance, share best practices, manage
															corporate-wide operations
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
											<p className="text-primary text-sm font-semibold">
												Bottom Line: Open location #2 without switching software
												or workarounds
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="pricing">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<DollarSign className="text-primary size-6" />
											Growth-Friendly Pricing vs Rising Costs
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The Housecall Pro Cost Reality
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															$59-299/month base depending on user count
														</p>
														<p className="text-muted-foreground text-sm">
															Basic plan: $59/mo (1 user). Professional: $149/mo
															(3 users). Max: $299/mo (8 users)
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															Phone system add-on "CRAZY expensive"
														</p>
														<p className="text-muted-foreground text-sm">
															Real user quote. Phone features only available as
															expensive add-on
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															Pipeline and campaign management cost extra
														</p>
														<p className="text-muted-foreground text-sm">
															Marketing automation features require additional
															charges beyond base subscription
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															Credit card processing: 2.9% + 30¢, Bank: 1%
														</p>
														<p className="text-muted-foreground text-sm">
															Higher than industry average, adds up quickly as
															you process more payments
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-t pt-6">
											<h4 className="mb-3 font-semibold">
												The Thorbis Pricing Promise
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															$200/month flat base fee with unlimited office
															users
														</p>
														<p className="text-muted-foreground text-sm">
															Add unlimited CSRs, dispatchers, managers at no
															extra cost
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Pay-as-you-go for AI and usage features
														</p>
														<p className="text-muted-foreground text-sm">
															Only pay for what you use: Emails $0.0003, SMS
															$0.024, Calls $0.012-0.03/min
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															All core features included
														</p>
														<p className="text-muted-foreground text-sm">
															Scheduling, dispatch, invoicing, CRM, customer
															portal, mobile app—no add-ons needed
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">
															Typical all-in cost: $350-800/month
														</p>
														<p className="text-muted-foreground text-sm">
															Small teams (3 techs): $269/mo. Medium (7 techs):
															$368/mo. Large (30 techs): $1,063/mo
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
											<p className="text-primary text-sm font-semibold">
												Bottom Line: Predictable costs that don't explode as you
												grow
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</section>

				{/* Migration Path */}
				<section className="mb-20">
					<div className="mx-auto max-w-4xl">
						<div className="mb-8 text-center">
							<Badge className="mb-4" variant="secondary">
								Implementation
							</Badge>
							<h2 className="mb-4 text-3xl font-bold">
								Your 30-Day Migration Path
							</h2>
							<p className="text-muted-foreground text-lg">
								Smooth transition without disrupting your operations
							</p>
						</div>

						<div className="grid gap-6 md:grid-cols-3">
							<Card>
								<CardHeader>
									<div className="mb-3 flex items-center justify-between">
										<Badge>Phase 1</Badge>
										<Clock className="text-primary size-5" />
									</div>
									<CardTitle>Days 1-10: Setup & Import</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">
											Data migration from Housecall Pro (customers, jobs,
											invoices)
										</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">
											Team accounts and permission setup
										</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">
											Pricebook and service catalog configuration
										</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">
											Integration setup (QuickBooks, payment processing)
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<div className="mb-3 flex items-center justify-between">
										<Badge>Phase 2</Badge>
										<Users className="text-primary size-5" />
									</div>
									<CardTitle>Days 11-20: Training & Testing</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">
											Office staff training (CSRs, dispatchers, managers)
										</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">
											Technician mobile app training
										</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">
											Test workflows with real jobs (parallel with HCP)
										</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">
											Customer portal and communication testing
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<div className="mb-3 flex items-center justify-between">
										<Badge>Phase 3</Badge>
										<Zap className="text-primary size-5" />
									</div>
									<CardTitle>Days 21-30: Go Live</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">
											Switch all new jobs to Thorbis
										</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">
											Monitor performance and address questions
										</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">
											Optimize workflows based on team feedback
										</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">
											Full Housecall Pro retirement (save on subscription)
										</p>
									</div>
								</CardContent>
							</Card>
						</div>

						<div className="mt-8 text-center">
							<Button asChild size="lg">
								<Link href="/contact">
									Start your migration
									<ArrowRight className="ml-2 size-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Testimonial */}
				{competitor.testimonial && (
					<section className="from-primary/10 via-primary/5 to-background mb-20 rounded-3xl border-2 bg-gradient-to-br p-12 text-center">
						<div className="mx-auto max-w-3xl">
							<div className="mb-4 flex justify-center gap-1">
								{[1, 2, 3, 4, 5].map((i) => (
									<Star
										className="size-6 fill-yellow-500 text-yellow-500"
										key={i}
									/>
								))}
							</div>
							<div className="text-primary mb-6 text-6xl">"</div>
							<blockquote className="text-foreground mb-6 text-2xl font-semibold leading-relaxed">
								{competitor.testimonial.quote}
							</blockquote>
							<footer className="space-y-2">
								<p className="text-foreground font-bold">
									{competitor.testimonial.attribution}
								</p>
								{competitor.testimonial.role && (
									<p className="text-muted-foreground">
										{competitor.testimonial.role}
									</p>
								)}
							</footer>
						</div>
					</section>
				)}

				{/* FAQ Section */}
				<section className="mb-20">
					<div className="mx-auto max-w-3xl">
						<div className="mb-8 text-center">
							<Badge className="mb-4" variant="secondary">
								Questions
							</Badge>
							<h2 className="mb-4 text-3xl font-bold">
								Frequently Asked Questions
							</h2>
							<p className="text-muted-foreground text-lg">
								Everything you need to know about switching from Housecall Pro
							</p>
						</div>

						<Accordion className="w-full" collapsible type="single">
							{competitor.faq.map((faq, index) => (
								<AccordionItem key={faq.question} value={`item-${index}`}>
									<AccordionTrigger className="text-left">
										{faq.question}
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground leading-relaxed">
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</section>

				{/* Final CTA */}
				<section className="from-primary/10 via-background to-primary/5 rounded-3xl border-2 bg-gradient-to-br p-12 text-center">
					<div className="mx-auto max-w-3xl space-y-6">
						<Badge className="mb-4" variant="secondary">
							Ready to Upgrade?
						</Badge>
						<h2 className="text-4xl font-bold">
							Time to Graduate to Enterprise
						</h2>
						<p className="text-muted-foreground text-lg">
							Housecall Pro got you started. Thorbis will help you scale. Keep
							the simplicity you love, gain the power you need.
						</p>

						<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
							<Button asChild className="group" size="lg">
								<Link href="/waitlist">
									Start your upgrade
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">Compare all features</Link>
							</Button>
						</div>

						<div className="flex flex-wrap justify-center gap-6 pt-6">
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">
									Data migrates perfectly
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">
									Team loves the upgrade
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">
									30-day go-live
								</span>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
