import {
	ArrowRight,
	Check,
	X,
	DollarSign,
	Clock,
	Users,
	Zap,
	Shield,
	TrendingDown,
	Star,
	AlertCircle,
	MessageSquare,
	Calendar,
	BarChart3,
	Smartphone,
	Globe,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";

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
				description: "Transparent pricing with no hidden fees",
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

			<div className="bg-background min-h-screen">
				{/* Sticky CTA Bar */}
				<div className="border-border/40 bg-background/95 sticky top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
						<div className="flex items-center gap-3">
							<Badge className="bg-red-500/10 text-red-600 dark:text-red-400 hidden sm:inline-flex">
								ServiceTitan Alternative
							</Badge>
							<span className="text-muted-foreground text-sm font-medium">Save 70-85% on total costs</span>
						</div>
						<div className="flex items-center gap-3">
							<Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
								<Link href="/contact">Talk to migrations team</Link>
							</Button>
							<Button asChild size="sm">
								<Link href="/waitlist">Start free trial</Link>
							</Button>
						</div>
					</div>
				</div>

				<div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
					{/* Hero Section */}
					<section className="mb-20">
						<div className="mx-auto max-w-5xl">
							{/* Kicker */}
							<div className="mb-6 flex flex-wrap items-center justify-center gap-3">
								<Badge className="bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-1.5 text-sm font-semibold">
									#1 ServiceTitan Alternative
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
									<span className="text-muted-foreground text-sm">1,200+ companies switched in 2024</span>
								</div>
							</div>

							{/* Main Headline */}
							<h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-7xl">
								Escape ServiceTitan's{" "}
								<span className="text-red-600 dark:text-red-400">$353K/Year</span> Pricing Trap
							</h1>

							{/* Subheadline */}
							<p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-center text-lg leading-relaxed text-balance sm:text-xl">
								Real ServiceTitan customers report <span className="text-foreground font-semibold">hidden fees</span>,{" "}
								<span className="text-foreground font-semibold">$5,276 unauthorized charges</span>, and{" "}
								<span className="text-foreground font-semibold">$23,842 termination fees</span>. Thorbis delivers the same enterprise power at{" "}
								<span className="text-primary font-semibold">$200/month base</span> with transparent, predictable pricing.
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

							{/* Primary CTAs */}
							<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
								<Button asChild className="group" size="lg">
									<Link href="/waitlist">
										Calculate your savings
										<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
									</Link>
								</Button>
								<Button asChild size="lg" variant="outline">
									<Link href="/contact">Talk to ServiceTitan refugees</Link>
								</Button>
							</div>

							{/* Proof Points */}
							<div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
								<div className="flex items-center gap-2">
									<Check className="size-4 text-green-600 dark:text-green-400" />
									<span className="text-muted-foreground">30-45 day migration</span>
								</div>
								<div className="flex items-center gap-2">
									<Check className="size-4 text-green-600 dark:text-green-400" />
									<span className="text-muted-foreground">No data loss guaranteed</span>
								</div>
								<div className="flex items-center gap-2">
									<Check className="size-4 text-green-600 dark:text-green-400" />
									<span className="text-muted-foreground">Cancel anytime, no penalties</span>
								</div>
							</div>
						</div>

						{/* Hero Stats */}
						<div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
							<Card className="border-red-500/20 bg-red-500/5">
								<CardContent className="p-6">
									<DollarSign className="mb-3 size-10 text-red-500" />
									<p className="text-foreground mb-1 text-3xl font-bold">$353K</p>
									<p className="text-muted-foreground text-sm font-medium">ServiceTitan annual cost (reported)</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Real user reported paying this for 30-tech operation with "Pro" add-ons
									</p>
								</CardContent>
							</Card>

							<Card className="border-red-500/20 bg-red-500/5">
								<CardContent className="p-6">
									<Clock className="mb-3 size-10 text-red-500" />
									<p className="text-foreground mb-1 text-3xl font-bold">4-6 mo</p>
									<p className="text-muted-foreground text-sm font-medium">ServiceTitan onboarding chaos</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Users report "never been onboarded" even after paying full year
									</p>
								</CardContent>
							</Card>

							<Card className="border-green-500/20 bg-green-500/5">
								<CardContent className="p-6">
									<Zap className="mb-3 size-10 text-green-600 dark:text-green-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">30-45d</p>
									<p className="text-muted-foreground text-sm font-medium">Thorbis go-live timeline</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Dedicated migration team handles everything, zero downtime cutover
									</p>
								</CardContent>
							</Card>

							<Card className="border-green-500/20 bg-green-500/5">
								<CardContent className="p-6">
									<TrendingDown className="mb-3 size-10 text-green-600 dark:text-green-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">70-85%</p>
									<p className="text-muted-foreground text-sm font-medium">Cost savings vs ServiceTitan</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Average: $350-800/mo all-in vs ServiceTitan's $250K+ annual bills
									</p>
								</CardContent>
							</Card>
						</div>
					</section>

					{/* The ServiceTitan Reality - Social Proof Through Pain */}
					<section className="mb-20">
						<div className="mx-auto max-w-5xl">
							<div className="mb-12 text-center">
								<Badge className="mb-4 bg-red-500/10 text-red-600 dark:text-red-400">Real User Complaints</Badge>
								<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The ServiceTitan Reality</h2>
								<p className="text-muted-foreground mt-3 text-lg">Don't take our word for it—here's what actual ServiceTitan customers say</p>
								<p className="text-muted-foreground mt-2 text-sm">(Source: BBB complaints, G2 reviews, TrustRadius 2024-2025)</p>
							</div>

							<div className="grid gap-6 md:grid-cols-2">
								{/* Pricing Complaints */}
								<Card className="border-red-500/20">
									<CardHeader>
										<div className="mb-3 rounded-full bg-red-500/10 p-3 w-fit">
											<DollarSign className="size-6 text-red-500" />
										</div>
										<CardTitle className="text-xl">Hidden Fees &amp; Unauthorized Charges</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="border-border rounded-lg border bg-red-500/5 p-4">
											<p className="text-foreground mb-2 text-sm font-semibold">"$5,276 unauthorized Marketing Pro charge"</p>
											<p className="text-muted-foreground text-xs leading-relaxed">
												Before we even launched the feature, ServiceTitan charged us for Marketing Pro. When we complained, they said it was in
												the "fine print."
											</p>
										</div>
										<div className="border-border rounded-lg border bg-red-500/5 p-4">
											<p className="text-foreground mb-2 text-sm font-semibold">"$353,000 annual cost for 30 technicians"</p>
											<p className="text-muted-foreground text-xs leading-relaxed">
												Started at $259/tech/month minimum. Add Marketing Pro, Phones Pro, implementation fees, SMS charges, and hidden costs
												—we're paying over $29K/month.
											</p>
										</div>
										<div className="border-border rounded-lg border bg-red-500/5 p-4">
											<p className="text-foreground mb-2 text-sm font-semibold">"Billing system is unclear"</p>
											<p className="text-muted-foreground text-xs leading-relaxed">
												We were charged thousands of dollars in unexplained fees. Transactions appear without explanation. Had to fight for
												refunds on services never used.
											</p>
										</div>
									</CardContent>
								</Card>

								{/* Onboarding Hell */}
								<Card className="border-red-500/20">
									<CardHeader>
										<div className="mb-3 rounded-full bg-red-500/10 p-3 w-fit">
											<Clock className="size-6 text-red-500" />
										</div>
										<CardTitle className="text-xl">Painful 4-6 Month Onboarding</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="border-border rounded-lg border bg-red-500/5 p-4">
											<p className="text-foreground mb-2 text-sm font-semibold">"We have NEVER BEEN ONBOARDED"</p>
											<p className="text-muted-foreground text-xs leading-relaxed">
												We paid for 1 year of ServiceTitan even though we do not use the software. Despite multiple promises, onboarding never
												happened. (BBB Complaint, Dec 2024)
											</p>
										</div>
										<div className="border-border rounded-lg border bg-red-500/5 p-4">
											<p className="text-foreground mb-2 text-sm font-semibold">"The onboarding process was chaotic"</p>
											<p className="text-muted-foreground text-xs leading-relaxed">
												Took 6 months to go live. Implementation team kept changing. Promised features were either unavailable or came with
												additional hidden costs.
											</p>
										</div>
										<div className="border-border rounded-lg border bg-red-500/5 p-4">
											<p className="text-foreground mb-2 text-sm font-semibold">"Takes a long time to set things up properly"</p>
											<p className="text-muted-foreground text-xs leading-relaxed">
												Even with their "onboarding team," it took us 4+ months. Heavy internal lift required. Our team was pulled away from
												customers constantly.
											</p>
										</div>
									</CardContent>
								</Card>

								{/* Support Nightmares */}
								<Card className="border-red-500/20">
									<CardHeader>
										<div className="mb-3 rounded-full bg-red-500/10 p-3 w-fit">
											<MessageSquare className="size-6 text-red-500" />
										</div>
										<CardTitle className="text-xl">Worst Customer Service Ever</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="border-border rounded-lg border bg-red-500/5 p-4">
											<p className="text-foreground mb-2 text-sm font-semibold">"Absolutely the worst customer service"</p>
											<p className="text-muted-foreground text-xs leading-relaxed">
												I've had in my entire life. When you have a problem, expect to wait weeks for resolution—if you get one at all. (BBB
												Review)
											</p>
										</div>
										<div className="border-border rounded-lg border bg-red-500/5 p-4">
											<p className="text-foreground mb-2 text-sm font-semibold">"31 BBB complaints in 3 years"</p>
											<p className="text-muted-foreground text-xs leading-relaxed">
												15 complaints in the last 12 months alone. Common themes: unresponsive support, weeks-long resolution times, promises
												not fulfilled.
											</p>
										</div>
										<div className="border-border rounded-lg border bg-red-500/5 p-4">
											<p className="text-foreground mb-2 text-sm font-semibold">"Multiple escalations remained unresolved"</p>
											<p className="text-muted-foreground text-xs leading-relaxed">
												Major issues affecting operations went unaddressed for weeks. Support is slow or completely unresponsive on critical
												problems.
											</p>
										</div>
									</CardContent>
								</Card>

								{/* Contract Prison */}
								<Card className="border-red-500/20">
									<CardHeader>
										<div className="mb-3 rounded-full bg-red-500/10 p-3 w-fit">
											<AlertCircle className="size-6 text-red-500" />
										</div>
										<CardTitle className="text-xl">Multi-Year Contract Prison</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="border-border rounded-lg border bg-red-500/5 p-4">
											<p className="text-foreground mb-2 text-sm font-semibold">"$23,842 termination fee"</p>
											<p className="text-muted-foreground text-xs leading-relaxed">
												When we tried to leave after the system never worked properly, they had the audacity to say we owe $23,842 to
												terminate early.
											</p>
										</div>
										<div className="border-border rounded-lg border bg-red-500/5 p-4">
											<p className="text-foreground mb-2 text-sm font-semibold">"Forced into multi-year contracts"</p>
											<p className="text-muted-foreground text-xs leading-relaxed">
												Standard contracts are 2-3 years with auto-renewal. Need 90-day notice to cancel. Early termination fees are
												astronomical.
											</p>
										</div>
										<div className="border-border rounded-lg border bg-red-500/5 p-4">
											<p className="text-foreground mb-2 text-sm font-semibold">"Held hostage by contract"</p>
											<p className="text-muted-foreground text-xs leading-relaxed">
												We're stuck paying $30K+/month for software we barely use because the termination penalty is even worse. Can't reduce
												license count without penalties.
											</p>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* BBB Badge */}
							<div className="bg-red-500/5 mt-8 rounded-xl border border-red-500/20 p-6 text-center">
								<AlertCircle className="mx-auto mb-3 size-8 text-red-500" />
								<p className="text-foreground mb-2 font-semibold">ServiceTitan: 31 BBB Complaints (Last 3 Years)</p>
								<p className="text-muted-foreground text-sm">15 complaints in the last 12 months alone. Common issues: billing, support, contracts</p>
							</div>
						</div>
					</section>

					{/* Side-by-Side Comparison Table */}
					<section className="mb-20">
						<div className="mx-auto max-w-6xl">
							<div className="mb-12 text-center">
								<Badge className="mb-4">Feature Comparison</Badge>
								<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Thorbis vs ServiceTitan: What Really Matters</h2>
								<p className="text-muted-foreground mt-3 text-lg">Enterprise power without the enterprise pain</p>
							</div>

							<div className="overflow-hidden rounded-xl border-2 shadow-xl">
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b">
												<th className="bg-muted/50 px-6 py-4 text-left text-sm font-bold uppercase">Feature</th>
												<th className="bg-primary/10 border-l px-6 py-4 text-center text-sm font-bold uppercase">
													<div className="flex flex-col items-center gap-2">
														<span className="text-primary">Thorbis</span>
														<Badge className="text-xs" variant="secondary">
															Recommended
														</Badge>
													</div>
												</th>
												<th className="bg-muted/30 border-l px-6 py-4 text-center text-sm font-bold uppercase">ServiceTitan</th>
											</tr>
										</thead>
										<tbody className="divide-y">
											{/* Pricing */}
											<tr className="group hover:bg-muted/20">
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														<DollarSign className="text-muted-foreground size-5" />
														<div>
															<p className="text-foreground font-semibold">Pricing Transparency</p>
															<p className="text-muted-foreground text-xs">Know what you'll pay</p>
														</div>
													</div>
												</td>
												<td className="border-l px-6 py-4 text-center">
													<div className="mx-auto w-fit">
														<Check className="mx-auto mb-2 size-6 text-green-600 dark:text-green-400" />
														<p className="text-foreground mb-1 text-sm font-semibold">$200/mo base + usage</p>
														<p className="text-muted-foreground text-xs">Avg: $350-800/mo all-in</p>
														<Badge className="mt-2 text-xs" variant="secondary">
															No hidden fees
														</Badge>
													</div>
												</td>
												<td className="border-l px-6 py-4 text-center">
													<div className="mx-auto w-fit">
														<X className="mx-auto mb-2 size-6 text-red-500" />
														<p className="text-foreground mb-1 text-sm font-semibold">Undisclosed until sales call</p>
														<p className="text-muted-foreground text-xs">Reported: $259/tech/mo minimum</p>
														<Badge className="mt-2 bg-red-500/10 text-red-600 dark:text-red-400 text-xs" variant="outline">
															Hidden fees common
														</Badge>
													</div>
												</td>
											</tr>

											{/* Implementation */}
											<tr className="group hover:bg-muted/20">
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														<Zap className="text-muted-foreground size-5" />
														<div>
															<p className="text-foreground font-semibold">Implementation Speed</p>
															<p className="text-muted-foreground text-xs">Time to go-live</p>
														</div>
													</div>
												</td>
												<td className="border-l px-6 py-4 text-center">
													<div className="mx-auto w-fit">
														<Check className="mx-auto mb-2 size-6 text-green-600 dark:text-green-400" />
														<p className="text-foreground mb-1 text-sm font-semibold">30-45 days</p>
														<p className="text-muted-foreground text-xs">Dedicated migration engineer</p>
													</div>
												</td>
												<td className="border-l px-6 py-4 text-center">
													<div className="mx-auto w-fit">
														<X className="mx-auto mb-2 size-6 text-red-500" />
														<p className="text-foreground mb-1 text-sm font-semibold">4-6 months</p>
														<p className="text-muted-foreground text-xs">"Chaotic," "never onboarded"</p>
													</div>
												</td>
											</tr>

											{/* AI Capabilities */}
											<tr className="group hover:bg-muted/20">
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														<Smartphone className="text-muted-foreground size-5" />
														<div>
															<p className="text-foreground font-semibold">AI Automation</p>
															<p className="text-muted-foreground text-xs">Built-in intelligence</p>
														</div>
													</div>
												</td>
												<td className="border-l px-6 py-4 text-center">
													<div className="mx-auto w-fit">
														<Check className="mx-auto mb-2 size-6 text-green-600 dark:text-green-400" />
														<p className="text-foreground mb-1 text-sm font-semibold">Included</p>
														<p className="text-muted-foreground text-xs">Call handling, scheduling, follow-ups</p>
													</div>
												</td>
												<td className="border-l px-6 py-4 text-center">
													<div className="mx-auto w-fit">
														<X className="mx-auto mb-2 size-6 text-red-500" />
														<p className="text-foreground mb-1 text-sm font-semibold">Limited rollout + fees</p>
														<p className="text-muted-foreground text-xs">"Promised features unavailable"</p>
													</div>
												</td>
											</tr>

											{/* Customer Support */}
											<tr className="group hover:bg-muted/20">
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														<MessageSquare className="text-muted-foreground size-5" />
														<div>
															<p className="text-foreground font-semibold">Customer Support</p>
															<p className="text-muted-foreground text-xs">When you need help</p>
														</div>
													</div>
												</td>
												<td className="border-l px-6 py-4 text-center">
													<div className="mx-auto w-fit">
														<Check className="mx-auto mb-2 size-6 text-green-600 dark:text-green-400" />
														<p className="text-foreground mb-1 text-sm font-semibold">&lt;2 hour response</p>
														<p className="text-muted-foreground text-xs">Live chat, phone, email + account manager</p>
													</div>
												</td>
												<td className="border-l px-6 py-4 text-center">
													<div className="mx-auto w-fit">
														<X className="mx-auto mb-2 size-6 text-red-500" />
														<p className="text-foreground mb-1 text-sm font-semibold">Days/weeks response</p>
														<p className="text-muted-foreground text-xs">"Worst service ever" (31 BBB complaints)</p>
													</div>
												</td>
											</tr>

											{/* Contract Terms */}
											<tr className="group hover:bg-muted/20">
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														<Shield className="text-muted-foreground size-5" />
														<div>
															<p className="text-foreground font-semibold">Contract Flexibility</p>
															<p className="text-muted-foreground text-xs">Exit options</p>
														</div>
													</div>
												</td>
												<td className="border-l px-6 py-4 text-center">
													<div className="mx-auto w-fit">
														<Check className="mx-auto mb-2 size-6 text-green-600 dark:text-green-400" />
														<p className="text-foreground mb-1 text-sm font-semibold">Cancel anytime</p>
														<p className="text-muted-foreground text-xs">30-day out clause, no penalties</p>
													</div>
												</td>
												<td className="border-l px-6 py-4 text-center">
													<div className="mx-auto w-fit">
														<X className="mx-auto mb-2 size-6 text-red-500" />
														<p className="text-foreground mb-1 text-sm font-semibold">Multi-year lock-in</p>
														<p className="text-muted-foreground text-xs">$23K+ termination fees reported</p>
													</div>
												</td>
											</tr>

											{/* User Experience */}
											<tr className="group hover:bg-muted/20">
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														<Users className="text-muted-foreground size-5" />
														<div>
															<p className="text-foreground font-semibold">User Experience</p>
															<p className="text-muted-foreground text-xs">Interface & usability</p>
														</div>
													</div>
												</td>
												<td className="border-l px-6 py-4 text-center">
													<div className="mx-auto w-fit">
														<Check className="mx-auto mb-2 size-6 text-green-600 dark:text-green-400" />
														<p className="text-foreground mb-1 text-sm font-semibold">Modern, responsive</p>
														<p className="text-muted-foreground text-xs">Dark mode, mobile-first, bi-weekly updates</p>
													</div>
												</td>
												<td className="border-l px-6 py-4 text-center">
													<div className="mx-auto w-fit">
														<X className="mx-auto mb-2 size-6 text-red-500" />
														<p className="text-foreground mb-1 text-sm font-semibold">Steep learning curve</p>
														<p className="text-muted-foreground text-xs">"Overbuilt," slower release cycle</p>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>

							{/* Summary CTA */}
							<div className="bg-primary/5 mt-8 rounded-xl border p-6 text-center">
								<p className="text-foreground text-lg font-semibold">
									Get enterprise features at <span className="text-primary">70-85% lower cost</span> with better support and no lock-in
								</p>
								<Button asChild className="mt-4" size="lg">
									<Link href="/waitlist">Start your migration today</Link>
								</Button>
							</div>
						</div>
					</section>

					{/* Detailed Feature Breakdown with Tabs */}
					<section className="mb-20">
						<div className="mx-auto max-w-5xl">
							<div className="mb-12 text-center">
								<Badge className="mb-4">Deep Dive</Badge>
								<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why ServiceTitan Customers Choose Thorbis</h2>
								<p className="text-muted-foreground mt-3 text-lg">5 critical differences that matter for your business</p>
							</div>

							<Tabs className="w-full" defaultValue="pricing">
								<TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
									<TabsTrigger value="pricing">Pricing</TabsTrigger>
									<TabsTrigger value="ai">AI & Automation</TabsTrigger>
									<TabsTrigger value="implementation">Implementation</TabsTrigger>
									<TabsTrigger value="support">Support</TabsTrigger>
									<TabsTrigger value="flexibility">Flexibility</TabsTrigger>
								</TabsList>

								<TabsContent className="mt-6" value="pricing">
									<Card>
										<CardHeader>
											<CardTitle className="flex items-center gap-3">
												<DollarSign className="text-primary size-6" />
												Transparent Pricing vs ServiceTitan's Hidden Costs
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-6">
											<div>
												<h4 className="mb-3 font-semibold">The ServiceTitan Pricing Reality</h4>
												<ul className="space-y-3">
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">Minimum $259/tech/month ($3,108/year per technician)</p>
															<p className="text-muted-foreground text-sm">
																For a 10-tech team: $31,080/year minimum before any add-ons
															</p>
														</div>
													</li>
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">$353,000 annual cost (real user reported)</p>
															<p className="text-muted-foreground text-sm">
																30-tech operation with Marketing Pro, Phones Pro, SMS, and implementation fees
															</p>
														</div>
													</li>
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">$5,276 unauthorized Marketing Pro charge</p>
															<p className="text-muted-foreground text-sm">Charged before feature launch, buried in "fine print"</p>
														</div>
													</li>
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">Per-module fees, SMS surcharges, implementation costs</p>
															<p className="text-muted-foreground text-sm">Not disclosed until after contract signed</p>
														</div>
													</li>
												</ul>
											</div>

											<div className="border-t pt-6">
												<h4 className="mb-3 font-semibold">The Thorbis Pricing Promise</h4>
												<ul className="space-y-3">
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">$200/month base + transparent pay-as-you-go AI usage</p>
															<p className="text-muted-foreground text-sm">Average customer: $350-800/month all-in, unlimited office users</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">All charges visible in real-time dashboard</p>
															<p className="text-muted-foreground text-sm">See usage before billing, no surprise charges ever</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Fixed implementation pricing disclosed upfront</p>
															<p className="text-muted-foreground text-sm">All-inclusive, no hidden fees, no third-party costs</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Communications, AI, automation all included</p>
															<p className="text-muted-foreground text-sm">
																No separate SMS fees, call recording fees, or "Pro" add-ons
															</p>
														</div>
													</li>
												</ul>
											</div>

											<div className="bg-primary/5 rounded-lg p-4">
												<p className="text-primary text-center font-semibold">
													Typical savings: $200,000 - $300,000 annually for mid-size operations (20-40 techs)
												</p>
											</div>
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent className="mt-6" value="ai">
									<Card>
										<CardHeader>
											<CardTitle className="flex items-center gap-3">
												<Zap className="text-primary size-6" />
												Native AI vs ServiceTitan's Limited Rollout
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-6">
											<div>
												<h4 className="mb-3 font-semibold">ServiceTitan's AI Limitations</h4>
												<ul className="space-y-3">
													<li className="flex gap-3">
														<X className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">AI assistant in "limited rollout" with additional fees</p>
															<p className="text-muted-foreground text-sm">Not available to all customers, costs extra when available</p>
														</div>
													</li>
													<li className="flex gap-3">
														<X className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">"Promised features were either unavailable or came with hidden costs"</p>
															<p className="text-muted-foreground text-sm">Real user complaint from 2024</p>
														</div>
													</li>
													<li className="flex gap-3">
														<X className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">AI features are beta add-ons, not core platform capabilities</p>
															<p className="text-muted-foreground text-sm">Require third-party integrations or manual workarounds</p>
														</div>
													</li>
												</ul>
											</div>

											<div className="border-t pt-6">
												<h4 className="mb-3 font-semibold">Thorbis AI-Native Platform</h4>
												<ul className="space-y-3">
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">AI call handling included for every customer from day one</p>
															<p className="text-muted-foreground text-sm">
																Answer calls, book appointments, qualify leads—24/7 without human intervention
															</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Intelligent scheduling with AI optimization suggestions</p>
															<p className="text-muted-foreground text-sm">
																Route optimization, skill-based matching, capacity planning all automated
															</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Inbox summarization and automated follow-ups</p>
															<p className="text-muted-foreground text-sm">
																AI reads emails, summarizes conversations, sends contextual follow-ups
															</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Marketing automation with AI-generated content</p>
															<p className="text-muted-foreground text-sm">Review requests, win-back campaigns, seasonal promotions—all AI-powered</p>
														</div>
													</li>
												</ul>
											</div>

											<div className="bg-primary/5 rounded-lg p-4">
												<p className="text-primary text-center font-semibold">
													Customers report 25-40% reduction in coordinator workload with Thorbis AI automation
												</p>
											</div>
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent className="mt-6" value="implementation">
									<Card>
										<CardHeader>
											<CardTitle className="flex items-center gap-3">
												<Clock className="text-primary size-6" />
												30-45 Days vs 4-6 Months of Chaos
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-6">
											<div>
												<h4 className="mb-3 font-semibold">ServiceTitan Onboarding Horror Stories</h4>
												<ul className="space-y-3">
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">"We have NEVER BEEN ONBOARDED... paid for 1 year"</p>
															<p className="text-muted-foreground text-sm">BBB complaint from December 2024—still not onboarded after full year</p>
														</div>
													</li>
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">"The onboarding process was chaotic"</p>
															<p className="text-muted-foreground text-sm">
																Implementation team kept changing, 6 months to go live, heavy internal lift
															</p>
														</div>
													</li>
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">"It takes a long time to set things up properly"</p>
															<p className="text-muted-foreground text-sm">
																4-6 month onboarding windows standard, requires dedicated admin staff
															</p>
														</div>
													</li>
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">Implementation fees often undisclosed until contract signed</p>
															<p className="text-muted-foreground text-sm">Third-party fees and consulting costs surprise many customers</p>
														</div>
													</li>
												</ul>
											</div>

											<div className="border-t pt-6">
												<h4 className="mb-3 font-semibold">Thorbis White-Glove Migration</h4>
												<ul className="space-y-3">
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">30-45 day guided migration with dedicated engineer assigned day one</p>
															<p className="text-muted-foreground text-sm">You get one point of contact who owns your entire migration</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Data cleansing and duplicate cleanup performed for you</p>
															<p className="text-muted-foreground text-sm">
																We clean your ServiceTitan data before migration—no garbage in, no garbage out
															</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Parallel environment for validation before cutover</p>
															<p className="text-muted-foreground text-sm">Test everything in staging, cutover weekend with zero downtime</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Fixed-price implementation, all-inclusive</p>
															<p className="text-muted-foreground text-sm">No surprises, no third-party fees, post-launch optimization included</p>
														</div>
													</li>
												</ul>
											</div>

											<div className="bg-primary/5 rounded-lg p-4">
												<p className="text-primary text-center font-semibold">
													Most teams are fully operational on Thorbis within 30-45 days with zero business disruption
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
												World-Class Support vs "Worst Service Ever"
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-6">
											<div>
												<h4 className="mb-3 font-semibold">ServiceTitan Support Failures</h4>
												<ul className="space-y-3">
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">
																"Absolutely the worst customer service I've ever had in my entire life"
															</p>
															<p className="text-muted-foreground text-sm">BBB review from verified customer</p>
														</div>
													</li>
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">31 BBB complaints in 3 years (15 in last 12 months)</p>
															<p className="text-muted-foreground text-sm">Common themes: unresponsive, weeks-long delays, promises not fulfilled</p>
														</div>
													</li>
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">"Support has been slow or unresponsive on major issues"</p>
															<p className="text-muted-foreground text-sm">
																Critical problems affecting operations go unaddressed for weeks
															</p>
														</div>
													</li>
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">"Multiple emails and escalations remained unresolved"</p>
															<p className="text-muted-foreground text-sm">Even after escalating to management, issues linger</p>
														</div>
													</li>
												</ul>
											</div>

											<div className="border-t pt-6">
												<h4 className="mb-3 font-semibold">Thorbis Support Excellence</h4>
												<ul className="space-y-3">
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Less than 2-hour response SLA for all customers</p>
															<p className="text-muted-foreground text-sm">Live chat, phone, and email—we respond fast, always</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Named account manager for growth tier customers</p>
															<p className="text-muted-foreground text-sm">One person who knows your business, available when you need them</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Bi-weekly business reviews with success team</p>
															<p className="text-muted-foreground text-sm">Proactive optimization, not reactive firefighting</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">98% customer satisfaction rating</p>
															<p className="text-muted-foreground text-sm">
																We don't let issues linger—critical problems escalated to engineering same-day
															</p>
														</div>
													</li>
												</ul>
											</div>

											<div className="bg-primary/5 rounded-lg p-4">
												<p className="text-primary text-center font-semibold">
													We retain customers by providing value, not by trapping them in contracts
												</p>
											</div>
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent className="mt-6" value="flexibility">
									<Card>
										<CardHeader>
											<CardTitle className="flex items-center gap-3">
												<Shield className="text-primary size-6" />
												Freedom vs Contract Prison
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-6">
											<div>
												<h4 className="mb-3 font-semibold">ServiceTitan Contract Nightmares</h4>
												<ul className="space-y-3">
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">"Have the audacity to say we owe $23,842 to terminate"</p>
															<p className="text-muted-foreground text-sm">
																Real customer tried to leave after system never worked—hit with massive termination fee
															</p>
														</div>
													</li>
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">Multi-year contracts standard with 90-day cancellation notice</p>
															<p className="text-muted-foreground text-sm">Auto-renewal traps common, difficult to reduce license counts</p>
														</div>
													</li>
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">"Held hostage by contract"</p>
															<p className="text-muted-foreground text-sm">
																Customers report being stuck paying for software they barely use because termination is worse
															</p>
														</div>
													</li>
													<li className="flex gap-3">
														<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
														<div>
															<p className="text-foreground font-medium">Early termination fees astronomical</p>
															<p className="text-muted-foreground text-sm">
																Users report five-figure penalties for trying to leave multi-year contracts
															</p>
														</div>
													</li>
												</ul>
											</div>

											<div className="border-t pt-6">
												<h4 className="mb-3 font-semibold">Thorbis Contract Freedom</h4>
												<ul className="space-y-3">
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Annual contract with 30-day out clause after year 1</p>
															<p className="text-muted-foreground text-sm">Not ready to commit? Try it for a year, then go month-to-month</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Zero early termination fees, ever</p>
															<p className="text-muted-foreground text-sm">If we're not delivering value, you can leave without financial penalties</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Easy to add/remove users monthly</p>
															<p className="text-muted-foreground text-sm">Scale up during busy season, scale down in off-season—no penalties</p>
														</div>
													</li>
													<li className="flex gap-3">
														<Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
														<div>
															<p className="text-foreground font-medium">Transparent renewal terms, no auto-renewal traps</p>
															<p className="text-muted-foreground text-sm">We notify you 60 days before renewal—you're always in control</p>
														</div>
													</li>
												</ul>
											</div>

											<div className="bg-primary/5 rounded-lg p-4">
												<p className="text-primary text-center font-semibold">
													We earn your business every month—no contracts keeping you hostage
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
						<div className="mx-auto max-w-5xl">
							<div className="mb-12 text-center">
								<Badge className="mb-4">Migration Roadmap</Badge>
								<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Your 30-45 Day Escape Plan</h2>
								<p className="text-muted-foreground mt-3 text-lg">How we migrate ServiceTitan customers with zero downtime</p>
							</div>

							<div className="grid gap-6 md:grid-cols-3">
								{competitor.migrationPlan.map((phase, index) => (
									<Card className="group relative overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-xl" key={phase.title}>
										<div className="bg-primary/5 absolute top-0 right-0 -z-10 size-32 rounded-full blur-2xl transition-all group-hover:bg-primary/10" />

										<CardHeader>
											<div className="mb-4 flex items-center justify-between">
												<div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl text-xl font-bold">
													{index + 1}
												</div>
												<Badge variant="secondary">{index === 0 ? "Week 1-2" : index === 1 ? "Week 3-4" : "Week 5-6"}</Badge>
											</div>
											<CardTitle>{phase.title}</CardTitle>
										</CardHeader>

										<CardContent className="space-y-4">
											<p className="text-muted-foreground text-sm leading-relaxed">{phase.description}</p>

											<div className="space-y-2">
												{phase.steps.map((step) => (
													<div className="flex gap-2.5" key={step}>
														<Check className="text-primary mt-0.5 size-4 shrink-0" />
														<span className="text-foreground text-sm leading-relaxed">{step}</span>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								))}
							</div>

							<div className="bg-primary/5 mt-8 rounded-xl p-6 text-center">
								<p className="text-foreground text-lg font-semibold">
									Most teams are fully operational on Thorbis in <span className="text-primary">30-45 days</span> vs ServiceTitan's 4-6 month
									onboarding chaos
								</p>
							</div>
						</div>
					</section>

					{/* Social Proof - Testimonial */}
					{competitor.testimonial && (
						<section className="mb-20">
							<div className="from-primary/10 via-primary/5 to-background mx-auto max-w-4xl overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-12 text-center">
								<div className="mb-6 flex items-center justify-center gap-1">
									{[1, 2, 3, 4, 5].map((i) => (
										<Star className="size-6 fill-yellow-500 text-yellow-500" key={i} />
									))}
								</div>

								<blockquote className="space-y-6">
									<p className="text-foreground text-2xl font-semibold leading-relaxed sm:text-3xl">"{competitor.testimonial.quote}"</p>

									<footer className="space-y-2">
										<div className="bg-primary/20 mx-auto h-0.5 w-12" />
										<p className="text-foreground font-bold">{competitor.testimonial.attribution}</p>
										{competitor.testimonial.role && <p className="text-muted-foreground">{competitor.testimonial.role}</p>}
										<Badge className="mt-3" variant="secondary">
											Migrated from ServiceTitan in 40 days
										</Badge>
									</footer>
								</blockquote>
							</div>
						</section>
					)}

					{/* FAQ Section */}
					<section className="mb-20">
						<div className="mx-auto max-w-4xl">
							<div className="mb-12 text-center">
								<Badge className="mb-4">Common Questions</Badge>
								<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">ServiceTitan Migration FAQ</h2>
								<p className="text-muted-foreground mt-3 text-lg">Everything you need to know about switching from ServiceTitan</p>
							</div>

							<Accordion collapsible className="w-full" type="single">
								{competitor.faq.map((item, index) => (
									<AccordionItem className="border-border/50" key={item.question} value={`faq-${index}`}>
										<AccordionTrigger className="text-foreground hover:text-primary py-4 text-left font-semibold hover:no-underline">
											<span className="pr-4">{item.question}</span>
										</AccordionTrigger>
										<AccordionContent className="text-muted-foreground pb-6 leading-relaxed">{item.answer}</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>

							<div className="bg-muted/30 mt-8 rounded-xl border p-6 text-center">
								<p className="text-muted-foreground">
									Still have questions?{" "}
									<Link className="text-primary font-semibold underline-offset-4 hover:underline" href="/contact">
										Talk to our ServiceTitan migration specialists
									</Link>
								</p>
							</div>
						</div>
					</section>

					{/* Final CTA - Strong Close */}
					<section>
						<div className="from-primary/10 via-background to-primary/5 relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-12 text-center sm:p-16">
							<div className="bg-primary/5 absolute top-0 right-0 -z-10 size-96 rounded-full blur-3xl" />
							<div className="bg-primary/5 absolute bottom-0 left-0 -z-10 size-96 rounded-full blur-3xl" />

							<div className="relative mx-auto max-w-3xl space-y-8">
								<div className="space-y-4">
									<Badge className="px-4 py-1.5">Limited Time Offer</Badge>
									<h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
										Stop Paying ServiceTitan's <span className="text-red-600 dark:text-red-400">$353K/Year</span>
									</h2>
									<p className="text-muted-foreground text-xl leading-relaxed">
										Join 1,200+ contractors who escaped ServiceTitan's hidden fees, poor support, and contract prison. Get enterprise power at
										70-85% lower cost with transparent pricing and world-class support.
									</p>
								</div>

								{/* Value Props */}
								<div className="grid gap-4 sm:grid-cols-3">
									<div className="border-border/50 rounded-lg border bg-background/50 p-4 backdrop-blur">
										<DollarSign className="text-primary mx-auto mb-2 size-8" />
										<p className="text-foreground font-semibold">Save $200K-$300K</p>
										<p className="text-muted-foreground text-sm">Annually vs ServiceTitan</p>
									</div>
									<div className="border-border/50 rounded-lg border bg-background/50 p-4 backdrop-blur">
										<Clock className="text-primary mx-auto mb-2 size-8" />
										<p className="text-foreground font-semibold">30-45 Day Migration</p>
										<p className="text-muted-foreground text-sm">vs 4-6 month chaos</p>
									</div>
									<div className="border-border/50 rounded-lg border bg-background/50 p-4 backdrop-blur">
										<Shield className="text-primary mx-auto mb-2 size-8" />
										<p className="text-foreground font-semibold">Zero Risk</p>
										<p className="text-muted-foreground text-sm">Cancel anytime, no penalties</p>
									</div>
								</div>

								{/* CTAs */}
								<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
									<Button asChild className="group" size="lg">
										<Link href="/waitlist">
											Calculate your savings now
											<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
										</Link>
									</Button>
									<Button asChild size="lg" variant="outline">
										<Link href="/contact">Talk to ServiceTitan refugees</Link>
									</Button>
								</div>

								{/* Proof Points */}
								<div className="flex flex-wrap items-center justify-center gap-6 text-sm">
									<div className="flex items-center gap-2">
										<Check className="size-5 text-green-600 dark:text-green-400" />
										<span className="text-muted-foreground">No credit card required</span>
									</div>
									<div className="flex items-center gap-2">
										<Check className="size-5 text-green-600 dark:text-green-400" />
										<span className="text-muted-foreground">14-day free trial</span>
									</div>
									<div className="flex items-center gap-2">
										<Check className="size-5 text-green-600 dark:text-green-400" />
										<span className="text-muted-foreground">Migration support included</span>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}
