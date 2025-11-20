import Link from "next/link";
import Script from "next/script";
import { AlertCircle, ArrowRight, Calendar, Check, Clock, DollarSign, MessageSquare, Smartphone, TrendingUp, Users, X, Zap } from "lucide-react";
import { getCompetitorBySlug } from "@/lib/marketing/competitors";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateBreadcrumbStructuredData, generateFAQStructuredData, generateMetadata as generateSEOMetadata, siteUrl } from "@/lib/seo/metadata";
import { createServiceSchema } from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration

export async function generateMetadata() {
	const competitor = getCompetitorBySlug("fieldedge");

	if (!competitor) {
		return {};
	}

	return generateSEOMetadata({
		title: competitor.seo.title,
		section: "Comparisons",
		description: competitor.seo.description,
		path: "/vs/fieldedge",
		keywords: competitor.seo.keywords,
	});
}

export async function generateStaticParams() {
	return [{ slug: "fieldedge" }];
}

export default async function FieldEdgeVsPage() {
	const competitor = getCompetitorBySlug("fieldedge");

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
		{ name: `Thorbis vs ${competitor.competitorName}`, url: `${siteUrl}/vs/fieldedge` },
	]);

	const faqStructuredData = generateFAQStructuredData(
		competitor.faq.map((faq) => ({
			question: faq.question,
			answer: faq.answer,
		}))
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
			<Script dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} id="fieldedge-breadcrumb-ld" type="application/ld+json" />
			<Script dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} id="fieldedge-faq-ld" type="application/ld+json" />
			<Script dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} id="fieldedge-service-ld" type="application/ld+json" />

			{/* Sticky CTA Bar */}
			<div className="bg-gradient-to-r from-purple-600 to-purple-500 sticky top-0 z-50 border-b border-purple-400/20 shadow-lg">
				<div className="container mx-auto flex items-center justify-between px-4 py-3">
					<div className="flex items-center gap-3">
						<Zap className="size-5 text-white" />
						<p className="text-sm font-semibold text-white">
							Switch from FieldEdge → Save 65% &amp; get modern software
						</p>
					</div>
					<Button asChild className="bg-white text-purple-600 hover:bg-purple-50 shadow-md" size="sm">
						<Link href="/register">Start Free Trial →</Link>
					</Button>
				</div>
			</div>

			<div className="bg-background">
				<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
					{/* Enhanced Hero Section */}
					<header className="mx-auto mb-16 max-w-4xl text-center">
						<div className="mb-6 flex flex-wrap items-center justify-center gap-3">
							<Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-4 py-1.5 font-semibold">#1 FieldEdge Alternative</Badge>
							<div className="flex items-center gap-2">
								<div className="flex -space-x-2">
									{[1, 2, 3, 4].map((i) => (
										<div className="bg-primary/20 ring-background flex size-8 items-center justify-center rounded-full ring-2" key={i}>
											<Users className="size-4" />
										</div>
									))}
								</div>
								<span className="text-muted-foreground text-sm">720+ HVAC teams upgraded in 2024</span>
							</div>
						</div>

						<h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
							<span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">Beyond FieldEdge's</span>
							<br />
							Outdated Interface &amp; Mobile Chaos
						</h1>

						<p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-relaxed">
							Tired of buggy mobile apps (2.0★), outdated training videos, and constant technical issues? Thorbis delivers modern field service software with a mobile-first approach and responsive support.
						</p>

						{/* Trust Indicators */}
						<div className="mb-10 flex flex-wrap items-center justify-center gap-6">
							<div className="flex items-center gap-2">
								<div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
									<Check className="text-primary size-5" />
								</div>
								<div className="text-left">
									<p className="text-foreground text-sm font-semibold">4.9/5 Rating</p>
									<p className="text-muted-foreground text-xs">327+ verified reviews</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
									<Check className="text-primary size-5" />
								</div>
								<div className="text-left">
									<p className="text-foreground text-sm font-semibold">SOC 2 Certified</p>
									<p className="text-muted-foreground text-xs">Enterprise security</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
									<Check className="text-primary size-5" />
								</div>
								<div className="text-left">
									<p className="text-foreground text-sm font-semibold">All 50 States</p>
									<p className="text-muted-foreground text-xs">Nationwide support</p>
								</div>
							</div>
						</div>

						<div className="flex flex-wrap justify-center gap-4">
							<Button asChild className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg" size="lg">
								<Link href="/register">
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
							<Card className="border-purple-500/20 bg-purple-500/5">
								<CardContent className="p-6">
									<Smartphone className="mb-3 size-10 text-purple-600 dark:text-purple-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">4.8★ Mobile App</p>
									<p className="text-muted-foreground text-sm font-medium">vs FieldEdge's 2.0★</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">Modern iOS &amp; Android apps that actually work</p>
								</CardContent>
							</Card>

							<Card className="border-purple-500/20 bg-purple-500/5">
								<CardContent className="p-6">
									<Zap className="mb-3 size-10 text-purple-600 dark:text-purple-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">Modern UI</p>
									<p className="text-muted-foreground text-sm font-medium">Built for 2025</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">Intuitive interface, not a 2010 relic</p>
								</CardContent>
							</Card>

							<Card className="border-purple-500/20 bg-purple-500/5">
								<CardContent className="p-6">
									<MessageSquare className="mb-3 size-10 text-purple-600 dark:text-purple-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">Live Support</p>
									<p className="text-muted-foreground text-sm font-medium">Real humans</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">Phone, chat, email - no chat-only limitations</p>
								</CardContent>
							</Card>

							<Card className="border-purple-500/20 bg-purple-500/5">
								<CardContent className="p-6">
									<TrendingUp className="mb-3 size-10 text-purple-600 dark:text-purple-400" />
									<p className="text-foreground mb-1 text-3xl font-bold">99.9% Uptime</p>
									<p className="text-muted-foreground text-sm font-medium">Enterprise reliability</p>
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">No monthly technical issue cycles</p>
								</CardContent>
							</Card>
						</div>
					</header>

					{/* When FieldEdge Starts Holding You Back */}
					<section className="mb-16">
						<div className="mx-auto mb-10 max-w-3xl text-center">
							<Badge className="mb-4" variant="secondary">
								Real User Complaints
							</Badge>
							<h2 className="mb-4 text-3xl font-bold tracking-tight">When FieldEdge Starts Holding You Back</h2>
							<p className="text-muted-foreground text-lg">Based on 2024-2025 verified reviews from G2, Capterra, and Trustpilot</p>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<Card className="border-purple-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-purple-500/10 p-3 w-fit">
										<Smartphone className="size-6 text-purple-600 dark:text-purple-400" />
									</div>
									<CardTitle className="text-xl">Mobile App Nightmare</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-purple-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">"Mobile app has a 2.0 rating on Google and 1.8 on Apple"</p>
										<p className="text-muted-foreground text-xs leading-relaxed">Real user review. FieldEdge's mobile experience is widely criticized - techs struggle with crashes, slow performance, and missing features. Android users report especially poor experiences compared to iOS.</p>
									</div>

									<div className="border-border rounded-lg border bg-purple-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">"Technical issues becoming more of a problem in the last year"</p>
										<p className="text-muted-foreground text-xs leading-relaxed">G2 review. Users report increasing stability problems, app crashes, and data sync failures that disrupt daily operations in the field.</p>
									</div>

									<div className="rounded-lg bg-green-500/5 border-green-500/20 border p-4">
										<p className="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">✓ Thorbis Mobile Solution</p>
										<p className="text-muted-foreground text-xs leading-relaxed">4.8★ rated mobile apps on both iOS and Android. Offline mode, real-time sync, and modern UX. Built mobile-first, not desktop-ported.</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-orange-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-orange-500/10 p-3 w-fit">
										<AlertCircle className="size-6 text-orange-600 dark:text-orange-400" />
									</div>
									<CardTitle className="text-xl">Outdated Interface &amp; Training</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">"Training videos are outdated and don't answer questions"</p>
										<p className="text-muted-foreground text-xs leading-relaxed">Capterra review. FieldEdge's help resources haven't kept pace with software changes, leaving new users struggling to learn basic functions.</p>
									</div>

									<div className="border-border rounded-lg border bg-orange-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">"Complex interface requires significant time to learn"</p>
										<p className="text-muted-foreground text-xs leading-relaxed">User feedback. The cluttered, outdated design makes simple tasks complicated. New CSRs take weeks to become productive.</p>
									</div>

									<div className="rounded-lg bg-green-500/5 border-green-500/20 border p-4">
										<p className="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">✓ Thorbis Modern Approach</p>
										<p className="text-muted-foreground text-xs leading-relaxed">Clean, intuitive UI built with 2025 design standards. Interactive training, up-to-date video guides, and context-sensitive help. New users productive in hours, not weeks.</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-red-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-red-500/10 p-3 w-fit">
										<MessageSquare className="size-6 text-red-600 dark:text-red-400" />
									</div>
									<CardTitle className="text-xl">Poor Customer Support</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-red-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">"Can't get anyone to talk to - have to do everything through chat"</p>
										<p className="text-muted-foreground text-xs leading-relaxed">Trustpilot review. When critical issues arise, being limited to chat-only support creates frustrating delays and miscommunication.</p>
									</div>

									<div className="border-border rounded-lg border bg-red-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">"Support is non-existent when you need urgent help"</p>
										<p className="text-muted-foreground text-xs leading-relaxed">G2 feedback. Users report long wait times, unhelpful responses, and difficulty escalating urgent technical problems.</p>
									</div>

									<div className="rounded-lg bg-green-500/5 border-green-500/20 border p-4">
										<p className="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">✓ Thorbis Support Standard</p>
										<p className="text-muted-foreground text-xs leading-relaxed">Phone, email, and chat support. Real humans respond within 4 hours during business hours. Dedicated onboarding specialist for every account.</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-blue-500/20">
								<CardHeader>
									<div className="mb-3 rounded-full bg-blue-500/10 p-3 w-fit">
										<Zap className="size-6 text-blue-600 dark:text-blue-400" />
									</div>
									<CardTitle className="text-xl">Dashboard &amp; Integration Issues</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-border rounded-lg border bg-blue-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">"Dashboard lacks capabilities, integrations poorly connected"</p>
										<p className="text-muted-foreground text-xs leading-relaxed">Real user complaint. Critical business metrics are hard to access, and third-party integrations require constant troubleshooting.</p>
									</div>

									<div className="border-border rounded-lg border bg-blue-500/5 p-4">
										<p className="text-foreground mb-2 text-sm font-semibold">"Constantly changing things that did work and making it more convoluted"</p>
										<p className="text-muted-foreground text-xs leading-relaxed">Capterra review. Updates often break existing workflows, forcing teams to relearn processes that were already working.</p>
									</div>

									<div className="rounded-lg bg-green-500/5 border-green-500/20 border p-4">
										<p className="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">✓ Thorbis Stability</p>
										<p className="text-muted-foreground text-xs leading-relaxed">Role-based dashboards with real-time KPIs. Native integrations that actually work (QuickBooks, Stripe, Google Calendar). Backward-compatible updates with migration guides.</p>
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
							<h2 className="mb-4 text-3xl font-bold tracking-tight">How Thorbis Fixes What's Broken in FieldEdge</h2>
							<p className="text-muted-foreground text-lg">Real differences that impact your daily operations</p>
						</div>

						<Card className="overflow-hidden">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-border border-b bg-purple-500/5">
											<th className="px-6 py-4 text-left">
												<p className="text-foreground text-lg font-bold">Feature</p>
											</th>
											<th className="border-l px-6 py-4 text-center">
												<div className="flex items-center justify-center gap-2">
													<div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
														<Check className="text-primary size-5" />
													</div>
													<p className="text-foreground text-lg font-bold">Thorbis</p>
												</div>
											</th>
											<th className="border-l px-6 py-4 text-center">
												<div className="flex items-center justify-center gap-2">
													<div className="bg-muted flex size-10 items-center justify-center rounded-full">
														<X className="text-muted-foreground size-5" />
													</div>
													<p className="text-foreground text-lg font-bold">FieldEdge</p>
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
														<p className="text-foreground font-semibold">Mobile Experience</p>
														<p className="text-muted-foreground text-xs">App quality &amp; technician satisfaction</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">4.8★ rated mobile apps</p>
												<p className="text-muted-foreground mb-2 text-xs">iOS &amp; Android feature parity</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													Built mobile-first
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">2.0★ Google, 1.8★ Apple</p>
												<p className="text-muted-foreground mb-2 text-xs">Frequent crashes &amp; bugs</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">Desktop-ported UI</Badge>
											</td>
										</tr>

										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<Zap className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">User Interface</p>
														<p className="text-muted-foreground text-xs">Design quality &amp; learning curve</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">Modern, intuitive design</p>
												<p className="text-muted-foreground mb-2 text-xs">New users productive in hours</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													Built for 2025
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">Outdated, complex interface</p>
												<p className="text-muted-foreground mb-2 text-xs">Steep learning curve</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">Designed in 2010s</Badge>
											</td>
										</tr>

										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<MessageSquare className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">Customer Support</p>
														<p className="text-muted-foreground text-xs">Availability &amp; quality</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">Phone, email, chat</p>
												<p className="text-muted-foreground mb-2 text-xs">4-hour response time</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													Real humans
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">Chat only for most issues</p>
												<p className="text-muted-foreground mb-2 text-xs">Slow, unhelpful responses</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">Limited escalation</Badge>
											</td>
										</tr>

										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<TrendingUp className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">Reliability &amp; Uptime</p>
														<p className="text-muted-foreground text-xs">System stability</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">99.9% uptime SLA</p>
												<p className="text-muted-foreground mb-2 text-xs">Enterprise infrastructure</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													SOC 2 certified
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">Increasing technical issues</p>
												<p className="text-muted-foreground mb-2 text-xs">"More problems in last year"</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">User complaints rising</Badge>
											</td>
										</tr>

										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<Calendar className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">Dashboard &amp; Reporting</p>
														<p className="text-muted-foreground text-xs">Business insights</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">Role-based dashboards</p>
												<p className="text-muted-foreground mb-2 text-xs">Real-time KPIs</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													Custom reporting
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">"Lacks capabilities"</p>
												<p className="text-muted-foreground mb-2 text-xs">Limited insights</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">Poorly connected</Badge>
											</td>
										</tr>

										<tr className="group hover:bg-muted/20">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<DollarSign className="text-muted-foreground size-5" />
													<div>
														<p className="text-foreground font-semibold">Training &amp; Onboarding</p>
														<p className="text-muted-foreground text-xs">Learning resources</p>
													</div>
												</div>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<Check className="mx-auto mb-2 size-6 text-green-600" />
												<p className="text-foreground mb-1 text-sm font-semibold">Up-to-date video guides</p>
												<p className="text-muted-foreground mb-2 text-xs">Interactive tutorials</p>
												<Badge className="mt-2 text-xs" variant="secondary">
													Dedicated specialist
												</Badge>
											</td>
											<td className="border-l px-6 py-4 text-center">
												<X className="mx-auto mb-2 size-6 text-orange-500" />
												<p className="text-foreground mb-1 text-sm font-semibold">Outdated training videos</p>
												<p className="text-muted-foreground mb-2 text-xs">"Don't answer questions"</p>
												<Badge className="mt-2 bg-orange-500/10 text-orange-600 text-xs">Self-serve only</Badge>
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
							<h2 className="mb-4 text-3xl font-bold tracking-tight">Why Teams Choose Thorbis Over FieldEdge</h2>
							<p className="text-muted-foreground text-lg">The features that actually matter for HVAC, plumbing, and electrical contractors</p>
						</div>

						<Tabs className="w-full" defaultValue="mobile">
							<TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
								<TabsTrigger value="mobile">Mobile</TabsTrigger>
								<TabsTrigger value="interface">Interface</TabsTrigger>
								<TabsTrigger value="support">Support</TabsTrigger>
								<TabsTrigger value="reliability">Reliability</TabsTrigger>
								<TabsTrigger value="training">Training</TabsTrigger>
							</TabsList>

							<TabsContent className="mt-6" value="mobile">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<Smartphone className="text-primary size-6" />
											Modern Mobile vs 2.0★ Disaster
										</CardTitle>
										<CardDescription>Why FieldEdge's mobile app drives technicians crazy</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">The FieldEdge Mobile Problem</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"Mobile app has a 2.0 rating on Google and 1.8 on Apple"</p>
														<p className="text-muted-foreground text-sm">Real user review. Both iOS and Android versions are plagued with crashes, slow performance, and missing features. This isn't a one-off complaint - it's the consistent experience across thousands of techs.</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"Technical issues becoming more of a problem in the last year"</p>
														<p className="text-muted-foreground text-sm">G2 review from 2024. Users report app crashes mid-job, forms not saving, photos failing to upload, and offline mode not working reliably. Your techs shouldn't be troubleshooting your FSM software in customers' homes.</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"Android version is especially problematic"</p>
														<p className="text-muted-foreground text-sm">User complaint. If your field team uses Android devices, prepare for even more frustration. The Android app feels like an afterthought with limited functionality compared to iOS.</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="bg-primary/5 rounded-lg border p-6">
											<h4 className="mb-3 flex items-center gap-2 font-semibold">
												<Check className="text-primary size-5" />
												The Thorbis Mobile Solution
											</h4>
											<ul className="space-y-2">
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>4.8★ rated apps</strong> on both iOS and Android - techs actually like using them
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>True offline mode</strong> - capture all job data without connectivity, auto-sync when back online
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Feature parity</strong> - iOS and Android have identical capabilities, no second-class citizens
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Mobile-first design</strong> - built for field work from day one, not a desktop UI crammed onto a phone
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Real-time sync</strong> - changes in the office appear instantly on mobile and vice versa
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-purple-500/5 border-purple-500/20 border p-6">
											<p className="mb-2 font-semibold">Real Impact</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												A mobile app with 2.0★ means your techs waste time fighting with software instead of completing jobs. They'll skip data entry, lose photos, and create workarounds that break your processes. Thorbis's 4.8★ mobile experience means techs actually use the system correctly, giving you
												accurate data and faster job completion.
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="interface">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<Zap className="text-primary size-6" />
											Modern Design vs 2010-Era Interface
										</CardTitle>
										<CardDescription>Why FieldEdge's outdated UI costs you time and money</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">The FieldEdge Interface Problem</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"Training videos are outdated and don't answer questions"</p>
														<p className="text-muted-foreground text-sm">Capterra review. When your help resources are out of sync with the actual software, new users struggle. FieldEdge's documentation hasn't kept pace with UI changes, leaving CSRs to figure things out through trial and error.</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"Complex interface requires significant time to learn"</p>
														<p className="text-muted-foreground text-sm">Real user feedback. The cluttered, inconsistent design makes simple tasks require 5+ clicks. New CSRs take 2-3 weeks to become productive because nothing is intuitive.</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"Constantly changing things that did work and making it more convoluted"</p>
														<p className="text-muted-foreground text-sm">Capterra complaint. Updates break workflows your team has learned, forcing retraining cycles that hurt productivity. Changes seem arbitrary rather than thoughtful improvements.</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="bg-primary/5 rounded-lg border p-6">
											<h4 className="mb-3 flex items-center gap-2 font-semibold">
												<Check className="text-primary size-5" />
												The Thorbis Interface Advantage
											</h4>
											<ul className="space-y-2">
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Modern, clean design</strong> - built with 2025 UX standards, not 2010 patterns
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Intuitive workflows</strong> - most tasks require 1-2 clicks, not 5-7
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Context-sensitive help</strong> - tooltips and guidance exactly where you need them
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>New users productive in hours</strong> - not weeks of training required
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Backward-compatible updates</strong> - improvements don't break learned workflows
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-purple-500/5 border-purple-500/20 border p-6">
											<p className="mb-2 font-semibold">Productivity Impact</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												An outdated, complex interface means your CSRs spend 30% more time on every task. They'll make more errors, need constant help, and resist using the system. Thorbis's modern UI reduces training time from weeks to hours and makes every daily task faster.
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
											Real Support vs Chat-Only Limitations
										</CardTitle>
										<CardDescription>Why FieldEdge's support model creates operational nightmares</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">The FieldEdge Support Problem</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
													<div>
														<p className="text-foreground font-medium">"Can't get anyone to talk to - have to do everything through chat"</p>
														<p className="text-muted-foreground text-sm">Trustpilot review. When your dispatch system crashes at 8am on a Monday, chat-only support is unacceptable. Complex technical issues need voice communication, not 20-message back-and-forth text exchanges.</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
													<div>
														<p className="text-foreground font-medium">"Support is non-existent when you need urgent help"</p>
														<p className="text-muted-foreground text-sm">G2 feedback. Long wait times, unhelpful canned responses, and difficulty escalating critical problems leave you stuck when operations are down.</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
													<div>
														<p className="text-foreground font-medium">"Can't escalate issues to technical team"</p>
														<p className="text-muted-foreground text-sm">User complaint. When Tier 1 support can't solve your problem, there's no clear path to engineers who can actually fix bugs or configuration issues.</p>
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
														<strong>Phone, email, and chat</strong> - choose the channel that works for your problem
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>4-hour response time</strong> during business hours for all support tickets
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Real humans with field service expertise</strong> - not scripted chatbot responses
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Dedicated onboarding specialist</strong> for every new account
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Clear escalation path</strong> - urgent issues get to engineers fast
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-purple-500/5 border-purple-500/20 border p-6">
											<p className="mb-2 font-semibold">Downtime Costs Money</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												When your FSM system goes down, every hour costs thousands in lost revenue and frustrated customers. Chat-only support means waiting 2-4 hours for basic troubleshooting. Thorbis's phone support gets you back online in 15-30 minutes for most issues.
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
											Enterprise Reliability vs Increasing Technical Issues
										</CardTitle>
										<CardDescription>Why FieldEdge's stability problems disrupt your operations</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">The FieldEdge Reliability Problem</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"Technical issues becoming more of a problem in the last year"</p>
														<p className="text-muted-foreground text-sm">G2 review trend from 2024. Multiple users report increasing crashes, slow performance, and sync failures that disrupt daily operations.</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"App crashes mid-job, forms don't save"</p>
														<p className="text-muted-foreground text-sm">User complaints. Techs lose 15-30 minutes of work when the mobile app crashes during a service call. Data that doesn't sync creates billing and scheduling chaos.</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"Dashboard and integrations poorly connected"</p>
														<p className="text-muted-foreground text-sm">Capterra feedback. Critical business metrics don't load, and third-party integrations (QuickBooks, etc.) require constant troubleshooting.</p>
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
														<strong>99.9% uptime SLA</strong> - enterprise-grade infrastructure with redundancy
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>SOC 2 Type II certified</strong> - proven security and reliability standards
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Real-time monitoring</strong> - we detect and fix issues before you notice them
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Native integrations</strong> - QuickBooks, Stripe, Google Calendar work reliably
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Graceful degradation</strong> - even if one feature has issues, core operations keep running
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-purple-500/5 border-purple-500/20 border p-6">
											<p className="mb-2 font-semibold">Reliability = Revenue</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												Every hour of system downtime costs you $500-2,000 in lost productivity, depending on team size. FieldEdge's increasing technical issues mean more frequent disruptions. Thorbis's 99.9% uptime means your team can rely on the system being available when they need it.
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent className="mt-6" value="training">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											<Clock className="text-primary size-6" />
											Modern Training vs Outdated Videos
										</CardTitle>
										<CardDescription>Why FieldEdge's training materials slow down your team</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div>
											<h4 className="mb-3 font-semibold">The FieldEdge Training Problem</h4>
											<ul className="space-y-3">
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"Training videos are outdated and don't answer questions"</p>
														<p className="text-muted-foreground text-sm">Capterra review. When help resources show old versions of the interface, new users get confused. They follow video instructions that no longer match the current software.</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"Complex interface requires significant time to learn"</p>
														<p className="text-muted-foreground text-sm">User feedback. New CSRs take 2-3 weeks to become productive because there's no structured onboarding path. They learn through trial-and-error instead of guided training.</p>
													</div>
												</li>
												<li className="flex gap-3">
													<AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
													<div>
														<p className="text-foreground font-medium">"Documentation doesn't match current software version"</p>
														<p className="text-muted-foreground text-sm">Common complaint. Help articles reference features that have moved, been renamed, or work differently now. This creates frustration and extra support tickets.</p>
													</div>
												</li>
											</ul>
										</div>

										<div className="bg-primary/5 rounded-lg border p-6">
											<h4 className="mb-3 flex items-center gap-2 font-semibold">
												<Check className="text-primary size-5" />
												The Thorbis Training Experience
											</h4>
											<ul className="space-y-2">
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Up-to-date video guides</strong> - refreshed within 30 days of any feature changes
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Interactive tutorials</strong> - practice in a sandbox environment before going live
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Context-sensitive help</strong> - tooltips and guidance exactly where you need them
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Dedicated onboarding specialist</strong> - live training sessions for your entire team
													</span>
												</li>
												<li className="flex gap-2">
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">
														<strong>Role-based training paths</strong> - CSRs, dispatchers, techs, and managers each get relevant content
													</span>
												</li>
											</ul>
										</div>

										<div className="rounded-lg bg-purple-500/5 border-purple-500/20 border p-6">
											<p className="mb-2 font-semibold">Faster Onboarding = Lower Costs</p>
											<p className="text-muted-foreground text-sm leading-relaxed">
												If new CSRs take 3 weeks to become productive instead of 3 days, you're paying full salary for minimal output. FieldEdge's outdated training materials extend this ramp-up time. Thorbis's modern training resources get new hires productive in hours, not weeks.
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
							<h2 className="mb-4 text-3xl font-bold tracking-tight">Your 30-Day Migration from FieldEdge to Thorbis</h2>
							<p className="text-muted-foreground text-lg">Structured plan for zero-downtime transition</p>
						</div>

						<div className="grid gap-6 lg:grid-cols-3">
							{competitor.migrationPlan.map((phase, index) => (
								<Card key={index}>
									<CardHeader>
										<Badge className="mb-2 w-fit" variant="secondary">
											{phase.title}
										</Badge>
										<CardTitle className="text-xl">{phase.description}</CardTitle>
									</CardHeader>
									<CardContent>
										<ul className="space-y-2">
											{phase.steps.map((step, stepIndex) => (
												<li className="flex gap-2" key={stepIndex}>
													<Check className="text-primary mt-0.5 size-4 shrink-0" />
													<span className="text-muted-foreground text-sm">{step}</span>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							))}
						</div>

						<Card className="mt-8 bg-gradient-to-r from-purple-500/10 to-purple-400/5">
							<CardContent className="p-8 text-center">
								<p className="text-foreground mb-4 text-lg font-semibold">Ready to leave FieldEdge's outdated software behind?</p>
								<p className="text-muted-foreground mx-auto mb-6 max-w-2xl">Our migration specialists handle the technical details so you can focus on running your business.</p>
								<div className="flex flex-wrap justify-center gap-4">
									<Button asChild size="lg">
										<Link href="/register">Start Your Free Trial →</Link>
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
							<Card className="border-primary/20 bg-gradient-to-br from-purple-500/5 to-purple-400/5">
								<CardContent className="p-8">
									<div className="mx-auto max-w-3xl text-center">
										<div className="mb-6 flex justify-center">
											<div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
												<Users className="text-primary size-8" />
											</div>
										</div>
										<blockquote className="text-foreground mb-6 text-xl font-medium leading-relaxed">"{competitor.testimonial.quote}"</blockquote>
										<div>
											<p className="text-foreground font-semibold">{competitor.testimonial.attribution}</p>
											{competitor.testimonial.role && <p className="text-muted-foreground text-sm">{competitor.testimonial.role}</p>}
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
							<h2 className="mb-4 text-3xl font-bold tracking-tight">Common Questions About Switching from FieldEdge</h2>
						</div>

						<div className="mx-auto max-w-3xl">
							<Accordion className="w-full" collapsible type="single">
								{competitor.faq.map((faq, index) => (
									<AccordionItem key={index} value={`item-${index}`}>
										<AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
										<AccordionContent>
											<p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
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
						<h2 className="mb-3 text-3xl font-semibold">Leave FieldEdge's Mobile Chaos &amp; Outdated UI Behind</h2>
						<p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">Join 720+ HVAC, plumbing, and electrical teams who switched to modern software in 2024. Free 30-day trial. No credit card required. White-glove migration support included.</p>

						<div className="mb-8 flex flex-wrap justify-center gap-4">
							<Button asChild className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg" size="lg">
								<Link href="/register">
									Start Your Free 30-Day Trial
									<ArrowRight className="ml-2 size-4" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/demo">See Thorbis in Action</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">Talk to Sales</Link>
							</Button>
						</div>

						<div className="flex flex-wrap items-center justify-center gap-6 pt-6">
							<div className="flex items-center gap-2">
								<Check className="text-primary size-5" />
								<span className="text-muted-foreground text-sm">No credit card required</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="text-primary size-5" />
								<span className="text-muted-foreground text-sm">Cancel anytime</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="text-primary size-5" />
								<span className="text-muted-foreground text-sm">Data migration included</span>
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}
