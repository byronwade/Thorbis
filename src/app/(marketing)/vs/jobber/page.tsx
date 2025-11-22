import {
	ArrowRight,
	Check,
	X,
	Calendar,
	Sparkles,
	BarChart3,
	Building,
	DollarSign,
	Clock,
	Users,
	Star,
	Shield,
	Globe,
	AlertCircle,
	Zap,
	Map,
	RefreshCw,
	FileText,
	Settings,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
	const competitor = getCompetitorBySlug("jobber");
	if (!competitor) return {};

	return generateSEOMetadata({
		title: competitor.seo.title,
		section: "Comparisons",
		description: competitor.seo.description,
		path: "/vs/jobber",
		keywords: competitor.seo.keywords,
	});
}

export default async function JobberPage() {
	const competitor = getCompetitorBySlug("jobber");
	if (!competitor) return null;

	const faqStructuredData = generateFAQStructuredData(competitor.faq);
	const serviceStructuredData = generateServiceStructuredData({
		name: `${competitor.competitorName} Alternative`,
		description: competitor.summary,
		offers: [
			{
				price: "200",
				currency: "USD",
				description: "Advanced features without per-user pricing",
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
								url: `${siteUrl}/vs/jobber`,
							},
						]),
					),
				}}
				id="jobber-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceStructuredData),
				}}
				id="jobber-service-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqStructuredData),
				}}
				id="jobber-faq-ld"
				type="application/ld+json"
			/>

			{/* Sticky CTA Bar */}
			<div className="border-border/40 bg-background/95 sticky top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
					<div className="flex items-center gap-3">
						<Badge className="bg-green-500/10 text-green-600 dark:text-green-400">Jobber Alternative</Badge>
						<span className="text-muted-foreground hidden text-sm sm:inline">Break free from per-user fees</span>
					</div>
					<div className="flex items-center gap-3">
						<Button asChild className="hidden sm:flex" size="sm" variant="outline">
							<Link href="/contact">Talk to our team</Link>
						</Button>
						<Button asChild size="sm">
							<Link href="/waitlist">See the difference</Link>
						</Button>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				{/* Hero Section */}
				<section className="from-green-500/10 via-background to-green-500/5 relative mb-20 overflow-hidden rounded-3xl border bg-gradient-to-br p-8 sm:p-12 lg:p-16">
					<div className="bg-green-500/5 absolute top-0 right-0 -z-10 size-96 rounded-full blur-3xl" />

					<div className="relative mx-auto max-w-5xl">
						{/* Social Proof */}
						<div className="mb-6 flex flex-wrap items-center justify-center gap-3">
							<Badge className="bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-1.5 font-semibold">
								#1 Jobber Alternative
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
								<span className="text-muted-foreground text-sm">900+ teams switched in 2024</span>
							</div>
						</div>

						<h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-7xl">
							Beyond Jobber's <span className="text-green-600 dark:text-green-400">Per-User Pricing</span> Trap
						</h1>

						<p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-center text-lg leading-relaxed text-balance sm:text-xl">
							Jobber is great to start. Thorbis scales without breaking the bank. Get{" "}
							<span className="text-foreground font-semibold">advanced routing</span>,{" "}
							<span className="text-foreground font-semibold">real-time sync</span>, and{" "}
							<span className="text-foreground font-semibold">unlimited customization</span> without per-user fees.
						</p>

						{/* Trust Indicators */}
						<div className="mb-8 flex flex-wrap items-center justify-center gap-6">
							<div className="flex items-center gap-2">
								<Star className="size-5 fill-yellow-500 text-yellow-500" />
								<span className="text-foreground text-sm font-medium">4.9/5</span>
								<span className="text-muted-foreground text-sm">(327 reviews)</span>
							</div>
							<div className="flex items-center gap-2">
								<Shield className="text-primary size-5" />
								<span className="text-muted-foreground text-sm">SOC 2 Type II Certified</span>
							</div>
							<div className="flex items-center gap-2">
								<Globe className="text-primary size-5" />
								<span className="text-muted-foreground text-sm">Used in 50 states</span>
							</div>
						</div>

						{/* Hero Stats Cards */}
						<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<Card className="border-green-500/20 bg-green-500/5">
								<CardContent className="p-6">
									<DollarSign className="mb-3 size-10 text-green-600 dark:text-green-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">No Per-User Fees</p>
									<p className="text-muted-foreground text-sm font-medium">Unlimited office users</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Add CSRs, dispatchers, managers at no cost
									</p>
								</CardContent>
							</Card>
							<Card className="border-green-500/20 bg-green-500/5">
								<CardContent className="p-6">
									<RefreshCw className="mb-3 size-10 text-green-600 dark:text-green-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">Real-Time Sync</p>
									<p className="text-muted-foreground text-sm font-medium">Not every 24 hours</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Google Calendar syncs instantly, not once daily
									</p>
								</CardContent>
							</Card>
							<Card className="border-green-500/20 bg-green-500/5">
								<CardContent className="p-6">
									<Map className="mb-3 size-10 text-green-600 dark:text-green-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">Advanced Routing</p>
									<p className="text-muted-foreground text-sm font-medium">Unlimited optimization</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										No 2-route-per-day limits, optimize anytime
									</p>
								</CardContent>
							</Card>
							<Card className="border-green-500/20 bg-green-500/5">
								<CardContent className="p-6">
									<FileText className="mb-3 size-10 text-green-600 dark:text-green-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">Full Customization</p>
									<p className="text-muted-foreground text-sm font-medium">Design anything</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Customize quotes, invoices, fonts, colors, everything
									</p>
								</CardContent>
							</Card>
						</div>

						{/* Primary CTAs */}
						<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
							<Button asChild className="group" size="lg">
								<Link href="/waitlist">
									See what you're missing
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">Talk to our team</Link>
							</Button>
						</div>

						{/* Value Props */}
						<div className="border-border/50 mt-8 flex flex-wrap justify-center gap-6 border-t pt-6">
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">All Jobber features included</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">Plus enterprise capabilities</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">Data migrates seamlessly</span>
							</div>
						</div>
					</div>
				</section>

				{/* Signs You've Outgrown Jobber */}
				<section className="mb-20">
					<div className="mx-auto max-w-4xl space-y-6">
						<div className="text-center">
							<Badge className="mb-4" variant="secondary">
								Common Pain Points
							</Badge>
							<h2 className="mb-4 text-3xl font-bold">When Jobber Starts Holding You Back</h2>
							<p className="text-muted-foreground text-lg">
								Most contractors outgrow Jobber within their first year as they scale
							</p>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<Card className="border-orange-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-orange-500/10 p-3 w-fit">
										<DollarSign className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<CardTitle className="text-xl">Per-User Pricing Becomes Expensive</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Tiered per-user pricing becomes costly for larger teams"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Real user feedback. Per-user pricing "makes it a less scalable solution for growing businesses,
											particularly those with multiple employees who only need basic functions like clocking in."
										</p>
									</div>
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">"Pricing can be high for small businesses"</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Costs climb quickly when upgrading for advanced features. Users report "high costs, required
											upgrades, and lack of pricing transparency."
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-orange-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-orange-500/10 p-3 w-fit">
										<Map className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<CardTitle className="text-xl">Routing & Sync Limitations</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Limitations in mapping: only two route resets per day"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Real user complaint. "Can be frustrating for users reliant on this feature" as routes change
											throughout the day with cancellations and emergency calls.
										</p>
									</div>
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Google Calendar syncs every 24 hours, not real-time"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Users report this "creates time management issues" when technicians need up-to-the-minute schedule
											changes.
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-orange-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-orange-500/10 p-3 w-fit">
										<Settings className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<CardTitle className="text-xl">Limited Customization</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Cannot customize quote or invoice designs (fonts, colors)"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Common complaint from users. "Customization options, reporting, and integrations are limited" making
											it hard to match your brand.
										</p>
									</div>
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Payment processing slow, restrictive, difficult to customize"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Users report "refund and deposit limitations" and "no automatic credit card processing fee
											capability."
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-orange-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-orange-500/10 p-3 w-fit">
										<BarChart3 className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<CardTitle className="text-xl">QuickBooks Sync Issues</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Syncing issues with QuickBooks flagged consistently"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Reviewers report this as a consistent drawback. Integration problems cause accounting headaches and
											manual reconciliation work.
										</p>
									</div>
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">"Can't create multi-day jobs"</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											"Jobber treats a $50,000 asphalt job the same as a $500 plumbing repair" - no support for complex,
											multi-day commercial projects.
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Jobber Reality vs Thorbis Solution */}
				<section className="mb-20">
					<div className="mx-auto max-w-6xl">
						<div className="mb-8 text-center">
							<Badge className="mb-4" variant="secondary">
								Side-by-Side
							</Badge>
							<h2 className="mb-4 text-3xl font-bold">Jobber Limitations vs Thorbis Solutions</h2>
							<p className="text-muted-foreground text-lg">Everything you wish Jobber had, built-in from day one</p>
						</div>

						<div className="overflow-hidden rounded-xl border">
							<table className="w-full">
								<thead>
									<tr className="border-b">
										<th className="bg-muted/50 px-6 py-4 text-left text-sm font-semibold">Feature</th>
										<th className="bg-primary/10 border-l px-6 py-4 text-center">
											<div className="flex flex-col items-center gap-2">
												<span className="text-primary text-lg font-bold">Thorbis</span>
												<Badge className="text-xs" variant="secondary">
													Recommended
												</Badge>
											</div>
										</th>
										<th className="bg-muted/30 border-l px-6 py-4 text-center">
											<span className="text-muted-foreground text-lg font-bold">Jobber</span>
										</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									<tr className="group hover:bg-muted/20">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<DollarSign className="text-muted-foreground size-5" />
												<div>
													<p className="text-foreground font-semibold">Pricing Model</p>
													<p className="text-muted-foreground text-xs">Growth-friendly costs</p>
												</div>
											</div>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<Check className="mx-auto mb-2 size-6 text-green-600" />
											<p className="text-foreground mb-1 text-sm font-semibold">$200/mo flat + usage</p>
											<p className="text-muted-foreground mb-2 text-xs">Unlimited office users included</p>
											<Badge className="mt-2 text-xs" variant="secondary">
												Predictable costs
											</Badge>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<X className="mx-auto mb-2 size-6 text-orange-500" />
											<p className="text-foreground mb-1 text-sm font-semibold">Per-user pricing</p>
											<p className="text-muted-foreground mb-2 text-xs">"Becomes costly for larger teams"</p>
											<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">Scales with headcount</Badge>
										</td>
									</tr>

									<tr className="group hover:bg-muted/20">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<Map className="text-muted-foreground size-5" />
												<div>
													<p className="text-foreground font-semibold">Route Optimization</p>
													<p className="text-muted-foreground text-xs">Unlimited resets</p>
												</div>
											</div>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<Check className="mx-auto mb-2 size-6 text-green-600" />
											<p className="text-foreground mb-1 text-sm font-semibold">Unlimited route optimization</p>
											<p className="text-muted-foreground mb-2 text-xs">AI-powered, update anytime, as needed</p>
											<Badge className="mt-2 text-xs" variant="secondary">
												Real-time routing
											</Badge>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<X className="mx-auto mb-2 size-6 text-orange-500" />
											<p className="text-foreground mb-1 text-sm font-semibold">Two route resets per day</p>
											<p className="text-muted-foreground mb-2 text-xs">"Frustrating for users reliant on feature"</p>
											<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">Limited flexibility</Badge>
										</td>
									</tr>

									<tr className="group hover:bg-muted/20">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<RefreshCw className="text-muted-foreground size-5" />
												<div>
													<p className="text-foreground font-semibold">Calendar Sync</p>
													<p className="text-muted-foreground text-xs">Real-time updates</p>
												</div>
											</div>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<Check className="mx-auto mb-2 size-6 text-green-600" />
											<p className="text-foreground mb-1 text-sm font-semibold">Instant real-time sync</p>
											<p className="text-muted-foreground mb-2 text-xs">Google Calendar updates immediately</p>
											<Badge className="mt-2 text-xs" variant="secondary">
												Live updates
											</Badge>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<X className="mx-auto mb-2 size-6 text-orange-500" />
											<p className="text-foreground mb-1 text-sm font-semibold">Syncs every 24 hours</p>
											<p className="text-muted-foreground mb-2 text-xs">"Creates time management issues"</p>
											<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">Once-daily sync</Badge>
										</td>
									</tr>

									<tr className="group hover:bg-muted/20">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<FileText className="text-muted-foreground size-5" />
												<div>
													<p className="text-foreground font-semibold">Customization</p>
													<p className="text-muted-foreground text-xs">Full design control</p>
												</div>
											</div>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<Check className="mx-auto mb-2 size-6 text-green-600" />
											<p className="text-foreground mb-1 text-sm font-semibold">Fully customizable</p>
											<p className="text-muted-foreground mb-2 text-xs">
												Fonts, colors, layouts, branding—everything
											</p>
											<Badge className="mt-2 text-xs" variant="secondary">
												Complete control
											</Badge>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<X className="mx-auto mb-2 size-6 text-orange-500" />
											<p className="text-foreground mb-1 text-sm font-semibold">Limited customization</p>
											<p className="text-muted-foreground mb-2 text-xs">
												"Cannot customize quote or invoice designs"
											</p>
											<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">Restricted options</Badge>
										</td>
									</tr>

									<tr className="group hover:bg-muted/20">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<BarChart3 className="text-muted-foreground size-5" />
												<div>
													<p className="text-foreground font-semibold">QuickBooks Integration</p>
													<p className="text-muted-foreground text-xs">Reliable accounting sync</p>
												</div>
											</div>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<Check className="mx-auto mb-2 size-6 text-green-600" />
											<p className="text-foreground mb-1 text-sm font-semibold">Rock-solid sync</p>
											<p className="text-muted-foreground mb-2 text-xs">Two-way sync, real-time, no errors</p>
											<Badge className="mt-2 text-xs" variant="secondary">
												Reliable integration
											</Badge>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<X className="mx-auto mb-2 size-6 text-orange-500" />
											<p className="text-foreground mb-1 text-sm font-semibold">Syncing issues</p>
											<p className="text-muted-foreground mb-2 text-xs">
												"Reviewers flag this consistently as drawback"
											</p>
											<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">Integration problems</Badge>
										</td>
									</tr>

									<tr className="group hover:bg-muted/20">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<Calendar className="text-muted-foreground size-5" />
												<div>
													<p className="text-foreground font-semibold">Multi-Day Jobs</p>
													<p className="text-muted-foreground text-xs">Commercial project support</p>
												</div>
											</div>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<Check className="mx-auto mb-2 size-6 text-green-600" />
											<p className="text-foreground mb-1 text-sm font-semibold">Full multi-day support</p>
											<p className="text-muted-foreground mb-2 text-xs">
												Track phases, milestones, progress over days/weeks
											</p>
											<Badge className="mt-2 text-xs" variant="secondary">
												Commercial-ready
											</Badge>
										</td>
										<td className="border-l px-6 py-4 text-center">
											<X className="mx-auto mb-2 size-6 text-orange-500" />
											<p className="text-foreground mb-1 text-sm font-semibold">No multi-day jobs</p>
											<p className="text-muted-foreground mb-2 text-xs">
												"Treats $50K job same as $500 repair"
											</p>
											<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">Single-day only</Badge>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div className="mt-6 text-center">
							<Button asChild size="lg">
								<Link href="/waitlist">
									Switch to Thorbis today
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
								Feature Comparison
							</Badge>
							<h2 className="mb-4 text-3xl font-bold">Why Teams Switch from Jobber to Thorbis</h2>
							<p className="text-muted-foreground text-lg">Real problems, real solutions, real results</p>
						</div>

						<Tabs className="w-full" defaultValue="pricing">
							<TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
								<TabsTrigger value="pricing">Pricing</TabsTrigger>
								<TabsTrigger value="routing">Routing</TabsTrigger>
								<TabsTrigger value="sync">Integration</TabsTrigger>
								<TabsTrigger value="customization">Customization</TabsTrigger>
								<TabsTrigger value="scaling">Scaling</TabsTrigger>
							</TabsList>

							<TabsContent className="mt-6" value="pricing">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<DollarSign className="text-primary size-6" />
											Flat Pricing vs Per-User Trap
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">The Jobber Pricing Problem</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Per-user pricing becomes costly for larger teams"
														</p>
														<p className="text-muted-foreground text-sm">
															Real user feedback. Costs $29-169/user/month depending on tier, making it "a less scalable
															solution for growing businesses"
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"High costs and required upgrades"</p>
														<p className="text-muted-foreground text-sm">
															Users report having to upgrade tiers to access features, with "lack of pricing transparency"
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">Especially expensive for employees with limited access</p>
														<p className="text-muted-foreground text-sm">
															"Multiple employees who only need basic functions like clocking in" still require paid seats
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-t pt-6">
											<h4 className="mb-3 font-semibold">The Thorbis Pricing Advantage</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">$200/month flat base fee with unlimited office users</p>
														<p className="text-muted-foreground text-sm">
															Add unlimited CSRs, dispatchers, managers, admins at no extra cost
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">Pay-as-you-go for actual usage</p>
														<p className="text-muted-foreground text-sm">
															Only pay for what you use: SMS, calls, AI features—no per-user seat charges
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">All features included from day one</p>
														<p className="text-muted-foreground text-sm">
															No tier upgrades needed, no feature paywalls, full access to everything
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
											<p className="text-primary text-sm font-semibold">
												Bottom Line: Grow your team without growing your software costs
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="routing">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<Map className="text-primary size-6" />
											Unlimited Routing vs 2-Per-Day Limit
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">The Jobber Routing Limitation</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Limitations in mapping: only two route resets per day"
														</p>
														<p className="text-muted-foreground text-sm">
															Real user complaint. "Can be frustrating for users reliant on this feature" when schedules
															change throughout the day
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">No flexibility for emergency calls or cancellations</p>
														<p className="text-muted-foreground text-sm">
															Once you've used your 2 resets, you're stuck with suboptimal routes for the rest of the day
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">Basic routing without advanced optimization</p>
														<p className="text-muted-foreground text-sm">
															Lacks intelligent features like traffic-aware routing, skill-based assignment, or capacity
															balancing
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-t pt-6">
											<h4 className="mb-3 font-semibold">The Thorbis Routing Power</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">Unlimited route optimization anytime</p>
														<p className="text-muted-foreground text-sm">
															Re-optimize as many times as needed throughout the day—no artificial limits
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">AI-powered intelligent routing</p>
														<p className="text-muted-foreground text-sm">
															Considers traffic, skills, certifications, equipment, and customer preferences automatically
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">Real-time updates with live traffic data</p>
														<p className="text-muted-foreground text-sm">
															Routes adjust automatically based on current conditions, not yesterday's traffic patterns
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
											<p className="text-primary text-sm font-semibold">
												Bottom Line: Adapt to changes all day long without hitting artificial limits
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="sync">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<RefreshCw className="text-primary size-6" />
											Real-Time Sync vs 24-Hour Delays
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">The Jobber Integration Problems</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Google Calendar syncs every 24 hours, not real-time"
														</p>
														<p className="text-muted-foreground text-sm">
															Users report this "creates time management issues" when technicians need immediate schedule
															updates
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Syncing issues with QuickBooks flagged consistently"
														</p>
														<p className="text-muted-foreground text-sm">
															Reviewers consistently identify this as a major drawback, causing accounting reconciliation
															headaches
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"Limited reporting" capabilities</p>
														<p className="text-muted-foreground text-sm">
															Users mention reporting limitations alongside sync issues as key frustrations
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-t pt-6">
											<h4 className="mb-3 font-semibold">The Thorbis Integration Excellence</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">Instant real-time calendar sync</p>
														<p className="text-muted-foreground text-sm">
															Google Calendar updates immediately—schedule changes appear instantly, not 24 hours later
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">Rock-solid QuickBooks integration</p>
														<p className="text-muted-foreground text-sm">
															Two-way sync, real-time updates, zero errors—accounting stays perfectly synchronized
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">Advanced reporting built-in</p>
														<p className="text-muted-foreground text-sm">
															Custom reports, scheduled exports, API access for any integration you need
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
											<p className="text-primary text-sm font-semibold">
												Bottom Line: Your systems stay in perfect sync 24/7, not once per day
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="customization">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<FileText className="text-primary size-6" />
											Full Customization vs Limited Options
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">The Jobber Customization Limits</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Cannot customize quote or invoice designs (fonts, colors)"
														</p>
														<p className="text-muted-foreground text-sm">
															Common user complaint. Makes it difficult to match your brand identity and stand out from
															competitors
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Payment processing slow, restrictive, difficult to customize"
														</p>
														<p className="text-muted-foreground text-sm">
															Users report "refund and deposit limitations" and "no automatic credit card processing fee"
															capability
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">Limited workflow customization</p>
														<p className="text-muted-foreground text-sm">
															"Customization options are limited" making it hard to adapt to your specific business processes
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-t pt-6">
											<h4 className="mb-3 font-semibold">The Thorbis Customization Freedom</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">Fully customizable quotes and invoices</p>
														<p className="text-muted-foreground text-sm">
															Choose fonts, colors, layouts, logos, headers, footers—make everything match your brand
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">Flexible payment processing</p>
														<p className="text-muted-foreground text-sm">
															Automatic surcharges, custom refund workflows, deposits, payment plans—configure however you need
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">Custom workflow builder</p>
														<p className="text-muted-foreground text-sm">
															Create automations, triggers, and workflows that match your exact business processes
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
											<p className="text-primary text-sm font-semibold">
												Bottom Line: Make the software work your way, not force your business into rigid templates
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="scaling">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<Building className="text-primary size-6" />
											Built to Scale vs Outgrow Quickly
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">Why Contractors Outgrow Jobber</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Most paving contractors outgrow Jobber within their first year"
														</p>
														<p className="text-muted-foreground text-sm">
															Real industry feedback. Per-user pricing and feature limitations force growing businesses to
															switch
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"Can't create multi-day jobs"</p>
														<p className="text-muted-foreground text-sm">
															"Treats a $50,000 asphalt job the same as a $500 plumbing repair"—no commercial project support
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">Limited offline access and automation</p>
														<p className="text-muted-foreground text-sm">
															"Unlike ServiceTitan and FieldPulse, Jobber lacks advanced automation and offline access"
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-t pt-6">
											<h4 className="mb-3 font-semibold">How Thorbis Grows With You</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">Built for 1-500+ technicians</p>
														<p className="text-muted-foreground text-sm">
															Same platform scales from startup to enterprise without feature limitations or forced upgrades
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">Full multi-day commercial project support</p>
														<p className="text-muted-foreground text-sm">
															Track phases, milestones, progress over days or weeks—perfect for large commercial work
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<Check className="mt-0.5 size-5 shrink-0 text-green-600" />
													<div>
														<p className="text-foreground font-medium">Advanced automation and offline capabilities</p>
														<p className="text-muted-foreground text-sm">
															AI-powered automations, full offline access, sophisticated workflows built-in
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
											<p className="text-primary text-sm font-semibold">
												Bottom Line: One platform for your entire growth journey—startup to enterprise
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
								Easy Transition
							</Badge>
							<h2 className="mb-4 text-3xl font-bold">Switch from Jobber in 30 Days</h2>
							<p className="text-muted-foreground text-lg">Seamless migration without disrupting your operations</p>
						</div>

						<div className="grid gap-6 md:grid-cols-3">
							<Card>
								<CardHeader>
									<div className="mb-3 flex items-center justify-between">
										<Badge>Phase 1</Badge>
										<Clock className="text-primary size-5" />
									</div>
									<CardTitle>Days 1-10: Data Migration</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">
											Export and import all Jobber data (customers, jobs, quotes, invoices)
										</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">Team accounts and permission mapping</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">Pricebook and service catalog setup</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">QuickBooks integration configuration</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<div className="mb-3 flex items-center justify-between">
										<Badge>Phase 2</Badge>
										<Users className="text-primary size-5" />
									</div>
									<CardTitle>Days 11-20: Training</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">Office staff training sessions</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">Technician mobile app orientation</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">Parallel testing with real workflows</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">Custom workflow and automation setup</p>
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
										<p className="text-muted-foreground text-sm">Switch all new jobs to Thorbis</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">Monitor and optimize performance</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">Team feedback and refinement</p>
									</div>
									<div className="flex items-start gap-2">
										<Check className="text-primary mt-0.5 size-4 shrink-0" />
										<p className="text-muted-foreground text-sm">Cancel Jobber and celebrate savings</p>
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
									<Star className="size-6 fill-yellow-500 text-yellow-500" key={i} />
								))}
							</div>
							<div className="text-primary mb-6 text-6xl">"</div>
							<blockquote className="text-foreground mb-6 text-2xl font-semibold leading-relaxed">
								{competitor.testimonial.quote}
							</blockquote>
							<footer className="space-y-2">
								<p className="text-foreground font-bold">{competitor.testimonial.attribution}</p>
								{competitor.testimonial.role && (
									<p className="text-muted-foreground">{competitor.testimonial.role}</p>
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
							<h2 className="mb-4 text-3xl font-bold">Frequently Asked Questions</h2>
							<p className="text-muted-foreground text-lg">Everything you need to know about switching from Jobber</p>
						</div>

						<Accordion className="w-full" collapsible type="single">
							{competitor.faq.map((faq, index) => (
								<AccordionItem key={faq.question} value={`item-${index}`}>
									<AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
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
						<h2 className="text-4xl font-bold">Break Free from Per-User Pricing</h2>
						<p className="text-muted-foreground text-lg">
							Jobber got you started. Thorbis removes the limits. Unlimited users, unlimited routing, unlimited
							potential.
						</p>

						<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
							<Button asChild className="group" size="lg">
								<Link href="/waitlist">
									Switch to Thorbis today
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
								<span className="text-muted-foreground text-sm">All Jobber data migrates perfectly</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">Team training included</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">30-day migration timeline</span>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
