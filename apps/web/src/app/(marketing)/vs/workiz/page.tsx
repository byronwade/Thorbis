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
	const competitor = getCompetitorBySlug("workiz");

	if (!competitor) {
		return {};
	}

	return generateSEOMetadata({
		title: competitor.seo.title,
		section: "Comparisons",
		description: competitor.seo.description,
		path: "/vs/workiz",
		keywords: competitor.seo.keywords,
	});
}

export async function generateStaticParams() {
	return [{ slug: "workiz" }];
}

export default async function WorkizVsPage() {
	const competitor = getCompetitorBySlug("workiz");

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
			url: `${siteUrl}/vs/workiz`,
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
				id="workiz-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
				id="workiz-faq-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
				id="workiz-service-ld"
				type="application/ld+json"
			/>

			{/* Sticky CTA Bar */}
			<div className="bg-gradient-to-r from-indigo-600 to-indigo-500 sticky top-0 z-50 border-b border-indigo-400/20 shadow-lg">
				<div className="container mx-auto flex items-center justify-between px-4 py-3">
					<div className="flex items-center gap-3">
						<Zap className="size-5 text-white" />
						<p className="text-sm font-semibold text-white">
							Switch from Workiz → Save 70% &amp; get reliable software
						</p>
					</div>
					<Button
						asChild
						className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-md"
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
							<Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 font-semibold">
								#1 Workiz Alternative
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
									580+ teams switched in 2024
								</span>
							</div>
						</div>

						<h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
							<span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
								Beyond Workiz's
							</span>
							<br />
							Hidden Fees &amp; Monthly Downtime
						</h1>

						<p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-relaxed">
							Tired of deceptive pricing, useless $200/month AI that "can't even
							tell customers prices", and downtime "at least twice a month"?
							Thorbis delivers transparent pricing and 99.9% uptime you can rely
							on.
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
								className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg"
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
							<Card className="border-indigo-500/20 bg-indigo-500/5">
								<CardContent className="p-6">
									<DollarSign className="mb-3 size-10 text-indigo-600 dark:text-indigo-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">
										Transparent
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										No hidden fees
									</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Clear pricing, no deceptive add-ons
									</p>
								</CardContent>
							</Card>

							<Card className="border-indigo-500/20 bg-indigo-500/5">
								<CardContent className="p-6">
									<TrendingUp className="mb-3 size-10 text-indigo-600 dark:text-indigo-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">
										99.9% Uptime
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										Enterprise reliability
									</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Not "downtime at least twice a month"
									</p>
								</CardContent>
							</Card>

							<Card className="border-indigo-500/20 bg-indigo-500/5">
								<CardContent className="p-6">
									<Zap className="mb-3 size-10 text-indigo-600 dark:text-indigo-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">
										Useful AI
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										Actually functional
									</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										AI that can answer customer questions
									</p>
								</CardContent>
							</Card>

							<Card className="border-indigo-500/20 bg-indigo-500/5">
								<CardContent className="p-6">
									<MessageSquare className="mb-3 size-10 text-indigo-600 dark:text-indigo-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">
										Stable Support
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										Consistent team
									</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										Not "six different account managers"
									</p>
								</CardContent>
							</Card>
						</div>
					</header>

					{/* When Workiz Starts Holding You Back */}
					<section className="mb-16">
						<div className="mx-auto mb-10 max-w-3xl text-center">
							<Badge className="mb-4" variant="secondary">
								Real User Complaints
							</Badge>
							<h2 className="mb-4 text-3xl font-bold tracking-tight">
								When Workiz Starts Holding You Back
							</h2>
							<p className="text-muted-foreground text-lg">
								Based on 2024-2025 verified reviews from G2, Capterra, and
								Trustpilot
							</p>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<Card className="border-indigo-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-indigo-500/10 p-3 w-fit">
										<DollarSign className="size-6 text-indigo-600 dark:text-indigo-400" />
									</div>
									<CardTitle className="text-xl">
										Deceptive Pricing &amp; Hidden Fees
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-indigo-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Deceptive pricing, poor automation, hidden fees at every
											step"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Real user review. What starts as affordable quickly
											balloons with mandatory add-ons. Marketing automation
											costs extra. Better automation costs extra. Phone features
											cost extra. Everything's an upsell.
										</p>
									</div>

									<div className="border-border rounded-lg border bg-indigo-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"AI assistant costs $200/month but can't even tell
											customers prices"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											G2 feedback. Workiz charges $200/month for their AI phone
											answering, but it can't handle basic questions like "How
											much does a furnace repair cost?" That's expensive
											theater, not useful automation.
										</p>
									</div>

									<div className="rounded-lg bg-green-500/5 border-green-500/20 border p-4">
										<p className="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">
											✓ Thorbis Transparent Pricing
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											$200/month flat includes all features. AI phone answering
											included at $0.18/minute (only pay when used). No hidden
											fees, no deceptive pricing tiers, no mandatory add-ons.
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-red-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-red-500/10 p-3 w-fit">
										<AlertCircle className="size-6 text-red-600 dark:text-red-400" />
									</div>
									<CardTitle className="text-xl">
										Frequent Downtime &amp; Crashes
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-red-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Downtime is a monthly thing - at least twice a month"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Trustpilot review. Users report system outages 2-3 times
											per month, often during peak business hours. When your
											dispatch system goes down mid-morning, you lose thousands
											in revenue.
										</p>
									</div>

									<div className="border-border rounded-lg border bg-red-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Mobile app frequently froze or crashed"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											User complaint. Techs report the mobile app freezing
											mid-job, forcing restarts and losing unsaved data. This
											creates customer service nightmares and billing disputes.
										</p>
									</div>

									<div className="rounded-lg bg-green-500/5 border-green-500/20 border p-4">
										<p className="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">
											✓ Thorbis Reliability
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											99.9% uptime SLA. Enterprise infrastructure with
											redundancy and monitoring. Mobile app stability tested
											with 100,000+ field hours. Your business can't afford
											monthly outages.
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-orange-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-orange-500/10 p-3 w-fit">
										<MessageSquare className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<CardTitle className="text-xl">
										Inconsistent Support &amp; Account Managers
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Assigned roughly six different account managers"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Real user review. High account manager turnover means
											you're constantly re-explaining your business, losing
											context, and starting over. No continuity, no relationship
											building.
										</p>
									</div>

									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Support quality declined significantly after initial
											setup"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											G2 feedback. Great white-glove treatment during
											onboarding, then radio silence. When you have issues
											months later, response times are slow and help is
											superficial.
										</p>
									</div>

									<div className="rounded-lg bg-green-500/5 border-green-500/20 border p-4">
										<p className="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">
											✓ Thorbis Consistent Support
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											One dedicated specialist for your account. Phone, email,
											and chat support. 4-hour response time doesn't degrade
											after onboarding. We're here for the long haul.
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-blue-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-blue-500/10 p-3 w-fit">
										<Zap className="size-6 text-blue-600 dark:text-blue-400" />
									</div>
									<CardTitle className="text-xl">
										Limited Automation &amp; No Unlimited Phone
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-blue-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"Limited automations even on Ultimate plan"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Capterra feedback. You hit automation limits quickly,
											forcing manual workarounds. Want to automate follow-ups,
											reminders, and status updates? Pay extra or build Zapier
											integrations.
										</p>
									</div>

									<div className="border-border rounded-lg border bg-blue-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">
											"No unlimited phone plan - most FSM platforms offer this"
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Real complaint. Other platforms include unlimited calling.
											Workiz charges per minute, making phone communication
											expensive. This is a standard feature elsewhere that
											Workiz monetizes.
										</p>
									</div>

									<div className="rounded-lg bg-green-500/5 border-green-500/20 border p-4">
										<p className="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">
											✓ Thorbis Automation &amp; Calling
										</p>
										<p className="text-muted-foreground text-xs leading-relaxed">
											Unlimited automations included ($9/month for advanced
											workflows). VoIP calling at cost ($0.012-0.03/minute) - no
											markup. Build any automation you need without artificial
											limits.
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
								How Thorbis Fixes What's Broken in Workiz
							</h2>
							<p className="text-muted-foreground text-lg">
								Real differences that impact your daily operations
							</p>
						</div>

						<Card className="overflow-hidden">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-border border-b bg-indigo-500/5">
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
														Workiz
													</p>
												</div>
											</th>
										</tr>
									</thead>
									<tbody className="divide-y">
										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<DollarSign className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">
															Pricing Transparency
														</p>
														<p className="text-muted-foreground text-xs">
															Hidden fees &amp; add-ons
														</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													Transparent pricing
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													No hidden fees
												</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													All features included
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													"Deceptive pricing"
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Hidden fees at every step
												</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
													Constant upsells
												</Badge>
											</td>
										</tr>

										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<TrendingUp className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">
															System Reliability
														</p>
														<p className="text-muted-foreground text-xs">
															Uptime &amp; stability
														</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													99.9% uptime SLA
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Enterprise infrastructure
												</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													SOC 2 certified
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													"Downtime twice a month"
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Frequent outages
												</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
													Mobile crashes
												</Badge>
											</td>
										</tr>

										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<Zap className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">
															AI Capabilities
														</p>
														<p className="text-muted-foreground text-xs">
															Phone answering quality
														</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													Functional AI
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Answers customer questions
												</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													$0.18/min pay-per-use
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													"Can't tell customers prices"
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Limited functionality
												</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
													$200/month cost
												</Badge>
											</td>
										</tr>

										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<MessageSquare className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">
															Account Management
														</p>
														<p className="text-muted-foreground text-xs">
															Support consistency
														</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													One dedicated specialist
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Consistent relationship
												</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													4-hour response time
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													"Six different managers"
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													High turnover
												</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
													No continuity
												</Badge>
											</td>
										</tr>

										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<Zap className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">
															Automation Capabilities
														</p>
														<p className="text-muted-foreground text-xs">
															Workflow limits
														</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													Unlimited automations
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Build any workflow
												</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													$9/month for advanced
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													"Limited even on Ultimate"
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Hit limits quickly
												</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
													Zapier workarounds
												</Badge>
											</td>
										</tr>

										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<Calendar className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">
															Phone System
														</p>
														<p className="text-muted-foreground text-xs">
															Calling costs
														</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													Pay-per-use calling
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													$0.012-0.03/minute
												</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													Only pay what you use
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">
													No unlimited plan
												</p>
												<p className="text-muted-foreground mb-2 text-xs">
													Most platforms offer this
												</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">
													Per-minute charges
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
								Why Teams Choose Thorbis Over Workiz
							</h2>
							<p className="text-muted-foreground text-lg">
								The features that actually matter for field service businesses
							</p>
						</div>

						<Tabs className="w-full" defaultValue="pricing">
							<TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
								<TabsTrigger value="pricing">Pricing</TabsTrigger>
								<TabsTrigger value="reliability">Reliability</TabsTrigger>
								<TabsTrigger value="ai">AI Quality</TabsTrigger>
								<TabsTrigger value="support">Support</TabsTrigger>
								<TabsTrigger value="automation">Automation</TabsTrigger>
							</TabsList>

							<TabsContent className="mt-6" value="pricing">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<DollarSign className="text-primary size-6" />
											Transparent Pricing vs Deceptive Fees
										</CardTitle>
										<CardDescription>
											Why Workiz's hidden costs destroy budget predictability
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The Workiz Pricing Problem
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Deceptive pricing, poor automation, hidden fees
															at every step"
														</p>
														<p className="text-muted-foreground text-sm">
															Real user review. Workiz's advertised pricing
															excludes most features you actually need.
															Marketing automation? Extra. Better workflows?
															Extra. Advanced reporting? Extra. What looks
															affordable becomes expensive fast.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"AI assistant costs $200/month but can't even tell
															customers prices"
														</p>
														<p className="text-muted-foreground text-sm">
															G2 feedback. Workiz charges $200/month for AI
															phone answering that can't handle basic pricing
															questions. This is expensive theater that fails at
															its core purpose - helping customers get answers.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Costs escalate with every feature request"
														</p>
														<p className="text-muted-foreground text-sm">
															User complaint. Need a feature that should be
															standard? Prepare to upgrade your entire plan or
															pay for an add-on. Workiz monetizes functionality
															that competitors include.
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="bg-primary/5 rounded-lg border p-6">
											<h4 className="mb-3 flex items-center gap-2 font-semibold">
												<Check className="text-primary size-5" />
												The Thorbis Transparent Pricing Model
											</h4>
											<ul className="space-y-2">
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>$200/month base price</strong> - includes
														unlimited users and all core features
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Pay-as-you-go usage</strong> - only pay for
														SMS ($0.024), calls ($0.012-0.03/min), emails
														($0.0003) you actually send
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>AI phone answering included</strong> -
														$0.18/minute pay-per-use, not $200/month
														subscription
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>No hidden fees</strong> - what you see is
														what you pay
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Predictable costs</strong> - know your
														monthly spend within $20
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-indigo-500/5 border-indigo-500/20 border p-6">
											<p className="mb-2 font-semibold">
												Cost Transparency = Budget Control
											</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												Workiz's hidden fees and constant upsells make budgeting
												impossible. You think you're paying $200/month but end
												up at $400-600 with necessary add-ons. Thorbis's
												transparent pricing means your budget is predictable -
												$200 base + usage that scales with business activity.
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="reliability">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<TrendingUp className="text-primary size-6" />
											99.9% Uptime vs Monthly Downtime
										</CardTitle>
										<CardDescription>
											Why Workiz's reliability problems cost you revenue
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The Workiz Reliability Problem
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
													<div>
														<p className="text-foreground font-medium">
															"Downtime is a monthly thing - at least twice a
															month"
														</p>
														<p className="text-muted-foreground text-sm">
															Trustpilot review from 2024. Users report system
															outages 2-3 times per month, often during peak
															business hours (8am-11am). When your dispatch
															system is down, you can't book jobs, techs can't
															see schedules, and customers get frustrated.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
													<div>
														<p className="text-foreground font-medium">
															"Mobile app frequently froze or crashed"
														</p>
														<p className="text-muted-foreground text-sm">
															User complaint. Techs report the mobile app
															freezing during job completion, forcing restarts
															and losing unsaved data. This creates billing
															disputes and poor customer experiences.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
													<div>
														<p className="text-foreground font-medium">
															"System became increasingly unstable over time"
														</p>
														<p className="text-muted-foreground text-sm">
															G2 feedback. Users who were initially satisfied
															report declining reliability. What worked fine 6
															months ago now has frequent glitches and slower
															performance.
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="bg-primary/5 rounded-lg border p-6">
											<h4 className="mb-3 flex items-center gap-2 font-semibold">
												<Check className="text-primary size-5" />
												The Thorbis Reliability Guarantee
											</h4>
											<ul className="space-y-2">
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>99.9% uptime SLA</strong> - enterprise
														infrastructure with redundancy
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>SOC 2 Type II certified</strong> - proven
														security and reliability standards
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Real-time monitoring</strong> - we detect
														and fix issues before you notice them
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Mobile app stability</strong> - tested with
														100,000+ field hours
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Graceful degradation</strong> - even if one
														feature has issues, core operations keep running
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-indigo-500/5 border-indigo-500/20 border p-6">
											<p className="mb-2 font-semibold">
												Downtime Costs Real Money
											</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												Two 2-hour outages per month = 48 hours per year of lost
												operations. For a 10-person team averaging $300/hour in
												productivity, that's $14,400 in annual lost revenue.
												Workiz's unreliability isn't just annoying - it's
												expensive. Thorbis's 99.9% uptime eliminates this waste.
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
											Functional AI vs $200/Month Theater
										</CardTitle>
										<CardDescription>
											Why Workiz's AI assistant fails at its core purpose
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The Workiz AI Problem
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"AI assistant costs $200/month but can't even tell
															customers prices"
														</p>
														<p className="text-muted-foreground text-sm">
															Real user review. Workiz's AI phone answering
															can't handle the most basic customer question:
															"How much will this cost?" If your AI can't quote
															prices, schedule appointments, or answer service
															questions, what's it worth?
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"AI frequently transfers calls unnecessarily"
														</p>
														<p className="text-muted-foreground text-sm">
															User complaint. The AI transfers most calls to
															humans, defeating the purpose of automation.
															You're paying $200/month for a glorified answering
															service that still requires full CSR staffing.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Not worth the expensive add-on cost"
														</p>
														<p className="text-muted-foreground text-sm">
															G2 feedback. At $200/month, Workiz's AI is one of
															the most expensive add-ons. But it doesn't deliver
															proportional value - it's expensive theater, not
															functional automation.
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="bg-primary/5 rounded-lg border p-6">
											<h4 className="mb-3 flex items-center gap-2 font-semibold">
												<Check className="text-primary size-5" />
												The Thorbis AI Difference
											</h4>
											<ul className="space-y-2">
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Actually answers customer questions</strong>{" "}
														- pricing, availability, service details
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Books appointments automatically</strong> -
														checks technician availability and schedules jobs
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Pay-per-use pricing</strong> - $0.18/minute
														only when used, not $200/month flat
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Transfers intelligently</strong> - only
														escalates when truly needed
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Learns your business</strong> - adapts to
														your services, pricing, and policies
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-indigo-500/5 border-indigo-500/20 border p-6">
											<p className="mb-2 font-semibold">
												AI Should Save Money, Not Cost It
											</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												Workiz charges $200/month for AI that doesn't work
												properly. At 50 calls/week (200/month), Thorbis's
												pay-per-use AI costs $36/month (200 calls × 1 min
												average × $0.18) - saving you $164/month while actually
												booking appointments and answering questions.
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
											Consistent Support vs Six Different Managers
										</CardTitle>
										<CardDescription>
											Why Workiz's high turnover destroys relationships
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The Workiz Support Problem
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Assigned roughly six different account managers"
														</p>
														<p className="text-muted-foreground text-sm">
															Real user review. High account manager turnover
															means you're constantly re-explaining your
															business setup, preferences, and pain points. Each
															new manager starts from zero, wasting your time
															and theirs.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Support quality declined significantly after
															initial setup"
														</p>
														<p className="text-muted-foreground text-sm">
															G2 feedback. Great white-glove treatment during
															onboarding to get you hooked, then support quality
															nosedives. Response times slow down, help becomes
															superficial, and you feel abandoned.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"No continuity in support interactions"
														</p>
														<p className="text-muted-foreground text-sm">
															User complaint. Each support interaction starts
															fresh because there's no history or context. You
															explain the same problems multiple times to
															different people.
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
														<strong>One dedicated specialist</strong> for your
														account throughout your relationship
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>4-hour response time</strong> during
														business hours - doesn't degrade after onboarding
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Full context retention</strong> - your
														specialist knows your business, history, preferences
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Phone, email, and chat</strong> - reach us
														however works best for you
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Proactive outreach</strong> - your
														specialist checks in quarterly, not just when you
														have problems
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-indigo-500/5 border-indigo-500/20 border p-6">
											<p className="mb-2 font-semibold">
												Relationships Build Better Support
											</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												Having six different account managers in a year means
												zero relationship building. Your specialist doesn't know
												your business, can't anticipate your needs, and can't
												provide proactive guidance. Thorbis's stable, consistent
												support team builds real relationships that deliver
												better outcomes.
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="automation">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<Zap className="text-primary size-6" />
											Unlimited Automation vs Artificial Limits
										</CardTitle>
										<CardDescription>
											Why Workiz's automation caps force workarounds
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">
												The Workiz Automation Problem
											</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Limited automations even on Ultimate plan"
														</p>
														<p className="text-muted-foreground text-sm">
															Capterra feedback. You hit automation limits
															quickly, forcing you to choose which workflows to
															automate and which to handle manually. Want
															follow-up reminders AND review requests AND
															payment reminders? Pick two.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"Forced to build Zapier integrations for basic
															needs"
														</p>
														<p className="text-muted-foreground text-sm">
															User complaint. When Workiz's built-in automation
															isn't enough, you pay for Zapier subscriptions and
															spend hours building workarounds for functionality
															that should be native.
														</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">
															"No unlimited phone plan - most FSM platforms
															offer this"
														</p>
														<p className="text-muted-foreground text-sm">
															Real complaint. Competitors include unlimited VoIP
															calling. Workiz charges per minute, making
															phone-heavy workflows expensive. This is standard
															elsewhere but monetized at Workiz.
														</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="bg-primary/5 rounded-lg border p-6">
											<h4 className="mb-3 flex items-center gap-2 font-semibold">
												<Check className="text-primary size-5" />
												The Thorbis Automation Advantage
											</h4>
											<ul className="space-y-2">
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Unlimited basic automations</strong> - SMS,
														email, status triggers at no extra cost
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Advanced workflows for $9/month</strong> -
														complex logic, conditions, multi-step sequences
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>VoIP calling at cost</strong> -
														$0.012-0.03/minute, no markup
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Native integrations</strong> - QuickBooks,
														Stripe, Google Calendar work without Zapier
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Build any workflow</strong> - no artificial
														limits on automation complexity
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-indigo-500/5 border-indigo-500/20 border p-6">
											<p className="mb-2 font-semibold">
												Automation Should Enable, Not Limit
											</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												Workiz's automation caps mean you can't fully automate
												your business. You're forced to choose between automated
												follow-ups or automated review requests. Thorbis's
												unlimited automation means you can build the workflows
												your business needs without hitting arbitrary limits.
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
								Your 30-Day Migration from Workiz to Thorbis
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

						<Card className="mt-8 bg-gradient-to-r from-indigo-500/10 to-indigo-400/5">
							<CardContent className="p-8 text-center">
								<p className="text-foreground mb-4 text-lg font-semibold">
									Ready to escape Workiz's hidden fees and unreliability?
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
							<Card className="border-primary/20 bg-gradient-to-br from-indigo-500/5 to-indigo-400/5">
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
								Common Questions About Switching from Workiz
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
							Leave Workiz's Hidden Fees &amp; Monthly Downtime Behind
						</h2>
						<p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
							Join 580+ field service teams who switched to transparent pricing
							and reliable software in 2024. Free 30-day trial. No credit card
							required. White-glove migration support included.
						</p>

						<div className="mb-8 flex flex-wrap justify-center gap-4">
							<Button
								asChild
								className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg"
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
