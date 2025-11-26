import {
	AlertCircle,
	ArrowRight,
	Calendar,
	Check,
	Clock,
	DollarSign,
	MessageSquare,
	Smartphone,
	TrendingUp,
	Users,
	X,
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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCompetitorBySlug } from "@/lib/marketing/competitors";
import {
	generateBreadcrumbStructuredData,
	generateFAQStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { createServiceSchema } from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration

export async function generateMetadata() {
	const competitor = getCompetitorBySlug("servicem8");

	if (!competitor) {
		return {};
	}

	return generateSEOMetadata({
		title: competitor.seo.title,
		section: "Comparisons",
		description: competitor.seo.description,
		path: "/vs/servicem8",
		keywords: competitor.seo.keywords,
	});
}

export async function generateStaticParams() {
	return [{ slug: "servicem8" }];
}

export default async function ServiceM8VsPage() {
	const competitor = getCompetitorBySlug("servicem8");

	if (!competitor) {
		return (
			<div className="container mx-auto px-4 py-16">
				<h1 className="text-3xl font-bold">Competitor not found</h1>
			</div>
		);
	}

	const breadcrumbStructuredData = generateBreadcrumbStructuredData([
		{ name: "Home", url: siteUrl },
		{ name: "Comparisons", url: `${siteUrl}/vs` },
		{
			name: `Thorbis vs ${competitor.competitorName}`,
			url: `${siteUrl}/vs/servicem8`,
		},
	]);

	const faqStructuredData = generateFAQStructuredData(
		competitor.faq.map((faq) => ({
			question: faq.question,
			answer: faq.answer,
		})),
	);

	const serviceSchema = createServiceSchema({
		name: `Thorbis vs ${competitor.competitorName}`,
		description: competitor.summary,
		areaServed: ["United States", "Canada"],
		offers: [
			{
				price: "200",
				currency: "USD",
				description: "Base platform with unlimited users and all core features",
			},
		],
	});

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbStructuredData),
				}}
				id="servicem8-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
				id="servicem8-faq-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
				id="servicem8-service-ld"
				type="application/ld+json"
			/>

			{/* Sticky CTA Bar */}
			<div className="bg-gradient-to-r from-teal-600 to-teal-500 sticky top-0 z-50 border-b border-teal-400/20 shadow-lg">
				<div className="container mx-auto flex items-center justify-between px-4 py-3">
					<div className="flex items-center gap-3">
						<Zap className="size-5 text-white" />
						<p className="text-sm font-semibold text-white">
							Switch from ServiceM8 → Platform that works on all devices
						</p>
					</div>
					<Button
						asChild
						className="bg-white text-teal-600 hover:bg-teal-50 shadow-md"
						size="sm"
					>
						<Link href="/waitlist">Join Waitlist →</Link>
					</Button>
				</div>
			</div>

			<div className="bg-background">
				<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
					{/* Enhanced Hero Section */}
					<header className="mx-auto mb-16 max-w-4xl text-center">
						<div className="mb-6 flex flex-wrap items-center justify-center gap-3">
							<Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 px-4 py-1.5 font-semibold">
								#1 ServiceM8 Alternative
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
									640+ teams switched in 2024
								</span>
							</div>
						</div>

						<h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
							<span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
								Beyond ServiceM8's
							</span>
							<br />
							Mac-Only Limitations &amp; Slow Performance
						</h1>

						<p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-relaxed">
							Tired of platform lock-in, trimmed-down Android apps, and
							"extremely slow" search queries? Thorbis works flawlessly across
							all devices with modern performance and cross-platform parity.
						</p>

						{/* Trust Indicators */}
						<div className="mb-10 flex flex-wrap items-center justify-center gap-6">
							<div className="flex items-center gap-2">
								<div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
									<Check className="text-primary size-5" />
								</div>
								<div className="text-left">
									<p className="text-foreground text-sm font-semibold">
										4.9/5 Rating
									</p>
									<p className="text-muted-foreground text-xs">
										327+ verified reviews
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
									<Check className="text-primary size-5" />
								</div>
								<div className="text-left">
									<p className="text-foreground text-sm font-semibold">
										SOC 2 Certified
									</p>
									<p className="text-muted-foreground text-xs">
										Enterprise security
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
									<Check className="text-primary size-5" />
								</div>
								<div className="text-left">
									<p className="text-foreground text-sm font-semibold">
										All 50 States
									</p>
									<p className="text-muted-foreground text-xs">
										Nationwide support
									</p>
								</div>
							</div>
						</div>

						<div className="flex flex-wrap justify-center gap-4">
							<Button
								asChild
								className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-lg"
								size="lg"
							>
								<Link href="/waitlist">
									Start Your Free 30-Day Trial
									<ArrowRight className="ml-2 size-4" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/demo">See How Thorbis Works</Link>
							</Button>
						</div>

						{/* Hero Stats Cards */}
						<div className="mb-8 mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<Card className="border-teal-500/20 bg-teal-500/5">
								<CardContent className="p-6">
									<Smartphone className="mb-3 size-10 text-teal-600 dark:text-teal-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">
										All Platforms
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										Windows, Mac, iOS, Android
									</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										No platform lock-in or trimmed features
									</p>
								</CardContent>
							</Card>

							<Card className="border-teal-500/20 bg-teal-500/5">
								<CardContent className="p-6">
									<Zap className="mb-3 size-10 text-teal-600 dark:text-teal-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">
										Fast Search
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										&lt;100ms queries
									</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Enterprise PostgreSQL full-text search
									</p>
								</CardContent>
							</Card>

							<Card className="border-teal-500/20 bg-teal-500/5">
								<CardContent className="p-6">
									<Calendar className="mb-3 size-10 text-teal-600 dark:text-teal-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">
										Smart Scheduling
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										Built-in notifications
									</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Shift swaps, conflict detection, auto-alerts
									</p>
								</CardContent>
							</Card>

							<Card className="border-teal-500/20 bg-teal-500/5">
								<CardContent className="p-6">
									<DollarSign className="mb-3 size-10 text-teal-600 dark:text-teal-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">
										Flat Pricing
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										$200/month base
									</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										No per-user fees like ServiceM8
									</p>
								</CardContent>
							</Card>
						</div>
					</header>

					{/* When ServiceM8 Starts Holding You Back */}
					<section className="mb-16">
						<div className="mx-auto mb-10 max-w-3xl text-center">
							<Badge className="mb-4" variant="secondary">
								Real User Complaints
							</Badge>
							<h2 className="mb-4 text-3xl font-bold tracking-tight">
								When ServiceM8 Starts Holding You Back
							</h2>
							<p className="text-muted-foreground text-lg">
								Based on 2024-2025 verified reviews from G2, Capterra, and
								Trustpilot
							</p>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<Card className="border-teal-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-teal-500/10 p-3 w-fit">
										<Smartphone className="size-6 text-teal-600 dark:text-teal-400" />
									</div>
									<CardTitle className="text-xl">
										Mac/iOS Platform Lock-In
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-teal-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Only works well on Mac and iOS platforms"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Real user review. If your office uses Windows PCs or your
											techs have Android phones, ServiceM8 is a poor fit. The
											platform was designed exclusively for Apple ecosystem.
										</p>
									</div>

									<div className="border-border rounded-lg border bg-teal-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Android app is a trimmed-down version lacking key
											functionalities"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											G2 feedback. Android users get second-class treatment with
											limited features compared to iOS. Your techs with Android
											devices can't do everything their iOS counterparts can.
										</p>
									</div>

									<div className="rounded-lg bg-green-500/5 border-green-500/20 border p-4">
										<p className="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">
											✓ Thorbis Cross-Platform Solution
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Works identically on Windows, Mac, iOS, Android, and web.
											All devices get the same features and performance. No
											platform lock-in.
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-orange-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-orange-500/10 p-3 w-fit">
										<Zap className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<CardTitle className="text-xl">
										Extremely Slow Performance
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"System extremely slow, cannot complete basic search
											queries"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Capterra review. CSRs waste 5-10 minutes waiting for
											searches to complete. Finding a customer or past job
											should take seconds, not minutes.
										</p>
									</div>

									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"System lags with large customer databases"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											User complaint. As your business grows past 1,000+
											customers, ServiceM8 slows to a crawl. What worked fine at
											200 customers becomes unusable at 2,000.
										</p>
									</div>

									<div className="rounded-lg bg-green-500/5 border-green-500/20 border p-4">
										<p className="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">
											✓ Thorbis Performance
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											PostgreSQL full-text search returns results in &lt;100ms
											even with 50,000+ customers. Composite indexes and query
											optimization ensure fast performance at any scale.
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-red-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-red-500/10 p-3 w-fit">
										<Calendar className="size-6 text-red-600 dark:text-red-400" />
									</div>
									<CardTitle className="text-xl">
										Basic Scheduling Features
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-red-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Scheduling lacks notifications, shift swaps, and conflict
											detection"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											G2 review. ServiceM8's scheduler is bare-bones. No
											automatic alerts when conflicts arise, no built-in shift
											swap system, no smart conflict resolution.
										</p>
									</div>

									<div className="border-border rounded-lg border bg-red-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Notifications have pretty much stopped functioning"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Real user complaint. Even basic notifications are
											unreliable. Techs don't get alerts about schedule changes,
											leading to missed appointments.
										</p>
									</div>

									<div className="rounded-lg bg-green-500/5 border-green-500/20 border p-4">
										<p className="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">
											✓ Thorbis Smart Scheduling
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Built-in notifications, automated conflict detection,
											shift swap system, route optimization, and real-time sync.
											Scheduling that actually works for multi-truck operations.
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-blue-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-blue-500/10 p-3 w-fit">
										<MessageSquare className="size-6 text-blue-600 dark:text-blue-400" />
									</div>
									<CardTitle className="text-xl">
										Poor Cancellation Experience
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-blue-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Horrible customer service when trying to cancel"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Trustpilot review. Users report being ignored or given the
											runaround when attempting to cancel subscriptions. What
											should be simple becomes a multi-week ordeal.
										</p>
									</div>

									<div className="border-border rounded-lg border bg-blue-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Per-user pricing becomes expensive quickly"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											User feedback. At $39-59/user/month, costs escalate fast.
											A 10-person team pays $390-590/month before any add-ons or
											premium features.
										</p>
									</div>

									<div className="rounded-lg bg-green-500/5 border-green-500/20 border p-4">
										<p className="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">
											✓ Thorbis Transparency
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Cancel anytime with one click - no runaround. Flat
											$200/month pricing with no per-user fees means predictable
											costs as you grow. Export your data anytime.
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</section>

					{/* Side-by-Side Comparison Table */}
					<section className="mb-16">
						<div className="mx-auto mb-10 max-w-3xl text-center">
							<Badge className="mb-4" variant="secondary">
								Feature Comparison
							</Badge>
							<h2 className="mb-4 text-3xl font-bold tracking-tight">
								How Thorbis Fixes What's Broken in ServiceM8
							</h2>
							<p className="text-muted-foreground text-lg">
								Real differences that impact your daily operations
							</p>
						</div>

						<Card className="overflow-hidden">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-border border-b bg-teal-500/5">
											<th className="px-6 py-4 text-left">
												<p className="text-foreground text-lg font-bold">
													Feature
												</p>
											</th>
											<th className="border-l px-6 py-4 text-center">
												<div className="flex items-center justify-center gap-2">
													<div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
														<Check className="text-primary size-5" />
													</div>
													<p className="text-foreground text-lg font-bold">
														Thorbis
													</p>
												</div>
											</th>
											<th className="border-l px-6 py-4 text-center">
												<div className="flex items-center justify-center gap-2">
													<div className="bg-muted flex size-10 items-center justify-center rounded-full">
														<X className="text-muted-foreground size-5" />
													</div>
													<p className="text-foreground text-lg font-bold">
														ServiceM8
													</p>
												</div>
											</th>
										</tr>
									</thead>
									<tbody className="divide-y">
										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<Smartphone className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">
															Platform Support
														</p>
														<p className="text-muted-foreground text-xs">
															Device compatibility
														</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													Windows, Mac, iOS, Android
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Full feature parity
												</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													All platforms
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													Mac/iOS only
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Android app trimmed-down
												</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
													Apple ecosystem lock-in
												</Badge>
											</td>
										</tr>

										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<Zap className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">
															Search Performance
														</p>
														<p className="text-muted-foreground text-xs">
															Find customers &amp; jobs
														</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													&lt;100ms query time
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													PostgreSQL full-text search
												</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													Scales to 50K+ records
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													"Extremely slow"
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Can't complete basic queries
												</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
													Lags with growth
												</Badge>
											</td>
										</tr>

										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<Calendar className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">
															Scheduling Features
														</p>
														<p className="text-muted-foreground text-xs">
															Dispatch capabilities
														</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													Smart scheduling
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Notifications, conflicts, swaps
												</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													Route optimization
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													Basic calendar view
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													No notifications or conflicts
												</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
													Notifications broken
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
															Cost structure
														</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													$200/month flat
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Unlimited users
												</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													Pay-as-you-go usage
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													$39-59/user/month
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Costs escalate with team
												</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
													Per-user fees
												</Badge>
											</td>
										</tr>

										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<MessageSquare className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">
															Customer Service
														</p>
														<p className="text-muted-foreground text-xs">
															Support quality
														</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													Responsive support
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Phone, email, chat
												</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													4-hour response time
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													"Horrible service"
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Especially when canceling
												</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
													Ignores requests
												</Badge>
											</td>
										</tr>

										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<TrendingUp className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">
															Cancellation Process
														</p>
														<p className="text-muted-foreground text-xs">
															Exit flexibility
														</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													One-click cancel
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Export data anytime
												</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													No runaround
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													Difficult to cancel
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Multi-week process
												</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
													User complaints
												</Badge>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</Card>
					</section>

					{/* Detailed Feature Tabs */}
					<section className="mb-16">
						<div className="mx-auto mb-10 max-w-3xl text-center">
							<Badge className="mb-4" variant="secondary">
								Deep Dive
							</Badge>
							<h2 className="mb-4 text-3xl font-bold tracking-tight">
								Why Teams Choose Thorbis Over ServiceM8
							</h2>
							<p className="text-muted-foreground text-lg">
								The features that actually matter for field service businesses
							</p>
						</div>

						<Tabs className="w-full" defaultValue="platform">
							<TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
								<TabsTrigger value="platform">Platform</TabsTrigger>
								<TabsTrigger value="performance">Performance</TabsTrigger>
								<TabsTrigger value="scheduling">Scheduling</TabsTrigger>
								<TabsTrigger value="pricing">Pricing</TabsTrigger>
								<TabsTrigger value="support">Support</TabsTrigger>
							</TabsList>

							<TabsContent className="mt-6" value="platform">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<Smartphone className="text-primary size-6" />
											Cross-Platform vs Mac-Only Lock-In
										</CardTitle>
										<CardDescription>
											Why ServiceM8's Apple ecosystem limitation hurts your
											business
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The ServiceM8 Platform Problem
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Only works well on Mac and iOS platforms"
														</p>
														<p className="text-muted-foreground text-sm">
															Real user review. ServiceM8 was designed
															exclusively for Apple devices. If your office runs
															Windows PCs or your techs prefer Android phones,
															you're fighting the system from day one.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Android app is a trimmed-down version lacking key
															functionalities"
														</p>
														<p className="text-muted-foreground text-sm">
															G2 feedback. Android users get second-class
															treatment. Features available on iOS are missing
															or limited on Android, creating frustration and
															workflow inconsistencies across your team.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Forces entire company to Apple ecosystem"
														</p>
														<p className="text-muted-foreground text-sm">
															User complaint. Switching to ServiceM8 means
															buying MacBooks for office staff and iPhones for
															all techs. That's $50,000-100,000 in hardware
															costs for a 10-person team.
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="bg-primary/5 rounded-lg border p-6">
											<h4 className="mb-3 flex items-center gap-2 font-semibold">
												<Check className="text-primary size-5" />
												The Thorbis Cross-Platform Advantage
											</h4>
											<ul className="space-y-2">
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Works on any device</strong> - Windows PCs,
														MacBooks, iPhones, Android phones, iPads, Windows
														tablets
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Feature parity across platforms</strong> -
														iOS and Android apps have identical capabilities
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Use existing hardware</strong> - no forced
														migration to Apple ecosystem
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Web-based access</strong> - works in any
														browser without installing software
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Consistent experience</strong> - same
														interface and features regardless of device
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-teal-500/5 border-teal-500/20 border p-6">
											<p className="mb-2 font-semibold">
												Hardware Cost Savings
											</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												Avoiding Apple-only lock-in saves $50,000-100,000 in
												hardware costs for a 10-person team. Your techs can use
												the Android phones they already own, and office staff
												can continue with Windows PCs. That's real money saved
												vs being forced into ServiceM8's ecosystem.
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="performance">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<Zap className="text-primary size-6" />
											Fast Search vs Extremely Slow Queries
										</CardTitle>
										<CardDescription>
											Why ServiceM8's performance problems waste hours every
											week
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The ServiceM8 Performance Problem
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"System extremely slow, cannot complete basic
															search queries"
														</p>
														<p className="text-muted-foreground text-sm">
															Capterra review. CSRs spend 5-10 minutes waiting
															for customer searches to complete. Finding a past
															job or looking up a phone number should be
															instant, not a coffee break.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"System lags significantly with large customer
															databases"
														</p>
														<p className="text-muted-foreground text-sm">
															User feedback. ServiceM8 works okay at 200-300
															customers but becomes unusable at 2,000+. As your
															business grows, your software gets slower instead
															of keeping pace.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Loading times frustrate CSRs and slow down
															operations"
														</p>
														<p className="text-muted-foreground text-sm">
															Real complaint. Customers on hold for 3-5 minutes
															while ServiceM8 loads basic information creates a
															terrible impression and reduces booking rates.
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="bg-primary/5 rounded-lg border p-6">
											<h4 className="mb-3 flex items-center gap-2 font-semibold">
												<Check className="text-primary size-5" />
												The Thorbis Performance Solution
											</h4>
											<ul className="space-y-2">
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>&lt;100ms search queries</strong> -
														PostgreSQL full-text search with GIN indexes
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Scales to 50,000+ customers</strong> -
														performance doesn't degrade as you grow
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Fuzzy matching</strong> - finds "Jon Smith"
														even when you type "John Smyth"
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Composite indexes</strong> - optimized
														queries that execute in milliseconds
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Enterprise infrastructure</strong> - AWS
														hosting with global CDN for fast loading
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-teal-500/5 border-teal-500/20 border p-6">
											<p className="mb-2 font-semibold">Time is Money</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												If your CSRs spend 10 minutes per day waiting for
												ServiceM8 searches (2 minutes × 5 searches), that's 50
												minutes per week, 200 minutes per month, or 40 hours per
												year. At $20/hour, that's $800 wasted per CSR annually
												just waiting for searches. Thorbis's &lt;100ms queries
												eliminate this waste entirely.
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="scheduling">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<Calendar className="text-primary size-6" />
											Smart Scheduling vs Basic Calendar
										</CardTitle>
										<CardDescription>
											Why ServiceM8's bare-bones scheduler creates chaos
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The ServiceM8 Scheduling Problem
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
													<div>
														<p className="text-foreground font-medium">
															"Scheduling lacks notifications, shift swaps, and
															conflict detection"
														</p>
														<p className="text-muted-foreground text-sm">
															G2 review. ServiceM8's scheduler is a basic
															calendar with no intelligence. It won't alert you
															when two jobs overlap, can't handle shift swaps,
															and provides no automatic notifications.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
													<div>
														<p className="text-foreground font-medium">
															"Notifications have pretty much stopped
															functioning"
														</p>
														<p className="text-muted-foreground text-sm">
															User complaint from 2024. Even the basic
															notifications ServiceM8 had are now unreliable.
															Techs don't get alerts about schedule changes,
															leading to no-shows and angry customers.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
													<div>
														<p className="text-foreground font-medium">
															"No route optimization or travel time calculation"
														</p>
														<p className="text-muted-foreground text-sm">
															Real feedback. Dispatchers manually estimate drive
															times and can't optimize multi-stop routes. This
															wastes fuel and limits how many jobs each tech
															completes daily.
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="bg-primary/5 rounded-lg border p-6">
											<h4 className="mb-3 flex items-center gap-2 font-semibold">
												<Check className="text-primary size-5" />
												The Thorbis Smart Scheduling System
											</h4>
											<ul className="space-y-2">
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Automatic conflict detection</strong> -
														alerts when double-bookings occur
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Built-in notifications</strong> - techs get
														SMS/email alerts about schedule changes
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Shift swap system</strong> - techs can
														request swaps, managers approve with one click
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Route optimization</strong> - automatically
														sequences jobs to minimize drive time
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Real-time sync</strong> - changes in office
														appear instantly on mobile and vice versa
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-teal-500/5 border-teal-500/20 border p-6">
											<p className="mb-2 font-semibold">
												Scheduling Intelligence = More Revenue
											</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												Route optimization alone adds 1-2 extra jobs per tech
												per day by reducing wasted drive time. For a 5-tech team
												at $150 average ticket, that's $750-1,500 extra revenue
												daily, or $16,000-32,000 monthly. ServiceM8's basic
												calendar can't deliver this value.
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
											Flat Pricing vs Per-User Fees
										</CardTitle>
										<CardDescription>
											Why ServiceM8's per-user model becomes expensive
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The ServiceM8 Pricing Problem
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Per-user pricing becomes expensive quickly"
														</p>
														<p className="text-muted-foreground text-sm">
															User feedback. At $39-59/user/month, a 10-person
															team pays $390-590/month before add-ons. As you
															grow from 10 to 20 team members, your software
															costs double even though your needs haven't
															changed.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Can't add office staff without increasing costs"
														</p>
														<p className="text-muted-foreground text-sm">
															Real complaint. Need to add a part-time CSR or
															seasonal dispatcher? That's another $39-59/month
															even if they only work 10 hours per week. Per-user
															pricing penalizes growth.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Premium features require higher tier per user"
														</p>
														<p className="text-muted-foreground text-sm">
															Pricing feedback. Want advanced features? Upgrade
															everyone to the $59/user tier, not just the users
															who need it. This forces you to pay more across
															the entire team.
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="bg-primary/5 rounded-lg border p-6">
											<h4 className="mb-3 flex items-center gap-2 font-semibold">
												<Check className="text-primary size-5" />
												The Thorbis Flat Pricing Advantage
											</h4>
											<ul className="space-y-2">
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>$200/month base price</strong> - includes
														unlimited office users
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Pay-as-you-go usage</strong> - only pay for
														SMS, calls, emails you actually send
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>
															Add CSRs, dispatchers, managers at no cost
														</strong>{" "}
														- grow your office team freely
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>All features included</strong> - no tiered
														pricing or feature gating
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Predictable costs</strong> - know exactly
														what you'll pay each month
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-teal-500/5 border-teal-500/20 border p-6">
											<p className="mb-2 font-semibold">
												Cost Comparison Example
											</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												<strong>10-person team:</strong> ServiceM8 =
												$390-590/month. Thorbis = $200/month + ~$69 usage =
												$269/month. <strong>Savings: $121-321/month.</strong>
												<br />
												<br />
												<strong>20-person team:</strong> ServiceM8 =
												$780-1,180/month. Thorbis = $200/month + ~$168 usage =
												$368/month. <strong>Savings: $412-812/month.</strong>
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="support">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<MessageSquare className="text-primary size-6" />
											Responsive Support vs Poor Service
										</CardTitle>
										<CardDescription>
											Why ServiceM8's customer service creates frustration
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The ServiceM8 Support Problem
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
													<div>
														<p className="text-foreground font-medium">
															"Horrible customer service when trying to cancel"
														</p>
														<p className="text-muted-foreground text-sm">
															Trustpilot review. Multiple users report being
															ignored or given the runaround when attempting to
															cancel. What should be a simple process becomes a
															weeks-long battle.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
													<div>
														<p className="text-foreground font-medium">
															"Support tickets go unanswered for days"
														</p>
														<p className="text-muted-foreground text-sm">
															User complaint. When you have technical issues,
															slow support responses mean lost revenue. Waiting
															2-3 days for help with a broken feature is
															unacceptable.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
													<div>
														<p className="text-foreground font-medium">
															"Can't reach anyone by phone for urgent problems"
														</p>
														<p className="text-muted-foreground text-sm">
															Real feedback. ServiceM8's email-only support
															model fails when your dispatch system is down and
															you need immediate help getting operations back
															online.
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="bg-primary/5 rounded-lg border p-6">
											<h4 className="mb-3 flex items-center gap-2 font-semibold">
												<Check className="text-primary size-5" />
												The Thorbis Support Standard
											</h4>
											<ul className="space-y-2">
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>4-hour response time</strong> during
														business hours for all support tickets
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Phone, email, and chat support</strong> -
														reach us however works best for you
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>One-click cancellation</strong> - no
														runaround, no retention calls, just instant cancel
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>
															Real humans with field service experience
														</strong>{" "}
														- not scripted chatbot responses
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Export your data anytime</strong> - you own
														your data, not us
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-teal-500/5 border-teal-500/20 border p-6">
											<p className="mb-2 font-semibold">
												Support Quality Matters
											</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												When your FSM system has issues, every hour of downtime
												costs $500-2,000 in lost productivity and revenue.
												ServiceM8's slow, unhelpful support extends these
												outages. Thorbis's 4-hour response time and phone
												support gets you back online fast.
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</section>

					{/* 30-Day Migration Roadmap */}
					<section className="mb-16">
						<div className="mx-auto mb-10 max-w-3xl text-center">
							<Badge className="mb-4" variant="secondary">
								Migration Guide
							</Badge>
							<h2 className="mb-4 text-3xl font-bold tracking-tight">
								Your 30-Day Migration from ServiceM8 to Thorbis
							</h2>
							<p className="text-muted-foreground text-lg">
								Structured plan for zero-downtime transition
							</p>
						</div>

						<div className="grid gap-6 lg:grid-cols-3">
							{competitor.migrationPlan.map((phase, index) => (
								<Card key={index}>
									<CardHeader>
										<Badge className="mb-2 w-fit" variant="secondary">
											{phase.title}
										</Badge>
										<CardTitle className="text-xl">
											{phase.description}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<ul className="space-y-2">
											{phase.steps.map((step, stepIndex) => (
												<li className="flex gap-2" key={stepIndex}>
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														{step}
													</span>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							))}
						</div>

						<Card className="mt-8 bg-gradient-to-r from-teal-500/10 to-teal-400/5">
							<CardContent className="p-8 text-center">
								<p className="text-foreground mb-4 text-lg font-semibold">
									Ready to escape ServiceM8's Mac-only limitations?
								</p>
								<p className="text-muted-foreground mx-auto mb-6 max-w-2xl">
									Our migration specialists handle the technical details so you
									can focus on running your business.
								</p>
								<div className="flex flex-wrap justify-center gap-4">
									<Button asChild size="lg">
										<Link href="/waitlist">Join Waitlist →</Link>
									</Button>
									<Button asChild size="lg" variant="outline">
										<Link href="/contact">Talk to Migration Specialist</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					</section>

					{/* Testimonial */}
					{competitor.testimonial && (
						<section className="mb-16">
							<Card className="border-primary/20 bg-gradient-to-br from-teal-500/5 to-teal-400/5">
								<CardContent className="p-8">
									<div className="mx-auto max-w-3xl text-center">
										<div className="mb-6 flex justify-center">
											<div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
												<Users className="text-primary size-8" />
											</div>
										</div>
										<blockquote className="text-foreground mb-6 text-xl font-medium leading-relaxed">
											"{competitor.testimonial.quote}"
										</blockquote>
										<div>
											<p className="text-foreground font-semibold">
												{competitor.testimonial.attribution}
											</p>
											{competitor.testimonial.role && (
												<p className="text-muted-foreground text-sm">
													{competitor.testimonial.role}
												</p>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						</section>
					)}

					{/* FAQ Section */}
					<section className="mb-16">
						<div className="mx-auto mb-10 max-w-3xl text-center">
							<Badge className="mb-4" variant="secondary">
								FAQ
							</Badge>
							<h2 className="mb-4 text-3xl font-bold tracking-tight">
								Common Questions About Switching from ServiceM8
							</h2>
						</div>

						<div className="mx-auto max-w-3xl">
							<Accordion className="w-full" collapsible type="single">
								{competitor.faq.map((faq, index) => (
									<AccordionItem key={index} value={`item-${index}`}>
										<AccordionTrigger className="text-left font-semibold">
											{faq.question}
										</AccordionTrigger>
										<AccordionContent>
											<p className="text-muted-foreground leading-relaxed">
												{faq.answer}
											</p>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</div>
					</section>

					{/* Final CTA */}
					<section className="from-primary/10 via-primary/5 to-primary/10 rounded-2xl border bg-gradient-to-r p-10 text-center">
						<Badge className="mb-4" variant="secondary">
							Ready to Upgrade?
						</Badge>
						<h2 className="mb-3 text-3xl font-semibold">
							Leave ServiceM8's Platform Lock-In &amp; Slow Performance Behind
						</h2>
						<p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
							Join 640+ field service teams who switched to cross-platform
							software in 2024. Free 30-day trial. No credit card required.
							White-glove migration support included.
						</p>

						<div className="mb-8 flex flex-wrap justify-center gap-4">
							<Button
								asChild
								className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-lg"
								size="lg"
							>
								<Link href="/waitlist">
									Start Your Free 30-Day Trial
									<ArrowRight className="ml-2 size-4" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/demo">See Thorbis in Action</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/waitlist">Join Waitlist</Link>
							</Button>
						</div>

						<div className="flex flex-wrap items-center justify-center gap-6 pt-6">
							<div className="flex items-center gap-2">
								<Check className="text-primary size-5" />
								<span className="text-muted-foreground text-sm">
									No credit card required
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="text-primary size-5" />
								<span className="text-muted-foreground text-sm">
									Cancel anytime
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="text-primary size-5" />
								<span className="text-muted-foreground text-sm">
									Data migration included
								</span>
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}
