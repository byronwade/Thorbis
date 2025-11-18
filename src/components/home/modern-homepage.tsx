/**
 * Modern Homepage - Conversion Optimized
 *
 * CRO Principles:
 * - Clear value proposition (pain → solution)
 * - Social proof above the fold
 * - Single primary CTA path
 * - Risk reversal everywhere
 * - Video demo integration
 * - Urgency triggers
 * - Trust signals
 * - SEO optimized with schema.org
 */

import {
	ArrowRight,
	Award,
	BarChart3,
	CheckCircle2,
	Clock,
	DollarSign,
	PlayCircle,
	Shield,
	Star,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function ModernHomepage() {
	return (
		<div className="relative overflow-hidden bg-background">
			{/* Hero Section - Conversion Optimized */}
			<section className="relative" itemScope itemType="https://schema.org/SoftwareApplication">
				<div className="container mx-auto px-4 pt-16 pb-12 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						{/* Social Proof Banner */}
						<div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
							<div className="flex items-center gap-2">
								<div className="flex -space-x-2">
									{[1, 2, 3, 4, 5].map((i) => (
										<div
											className="border-background from-primary/40 to-primary/20 size-10 rounded-full border-2 bg-gradient-to-br"
											key={i}
										/>
									))}
								</div>
								<span className="text-muted-foreground text-sm">
									Join <span className="font-semibold text-foreground">1,247+</span> service companies
								</span>
							</div>
							<div
								className="flex items-center gap-2"
								itemProp="aggregateRating"
								itemScope
								itemType="https://schema.org/AggregateRating"
							>
								<div className="flex gap-0.5">
									{[1, 2, 3, 4, 5].map((i) => (
										<Star className="size-4 fill-yellow-500 text-yellow-500" key={i} />
									))}
								</div>
								<span className="text-muted-foreground text-sm">
									<span className="font-semibold text-foreground" itemProp="ratingValue">4.9</span>/5 from{" "}
									<span itemProp="reviewCount">1,247</span> reviews
								</span>
								<meta itemProp="bestRating" content="5" />
								<meta itemProp="worstRating" content="1" />
							</div>
						</div>

						{/* Value Proposition - Pain → Solution */}
						<div className="mb-12 text-center">
							<Badge className="mb-4" variant="secondary">
								<Zap className="mr-1 size-3" />
								Save 15+ hours per week
							</Badge>
							<h1
								className="mb-6 text-5xl leading-[1.1] font-bold tracking-tight md:text-6xl lg:text-7xl"
								itemProp="name"
							>
								Stop Losing Money to
								<br />
								<span className="from-primary to-primary bg-gradient-to-r via-blue-500 bg-clip-text text-transparent">
									Spreadsheets & Chaos
								</span>
							</h1>
							<p
								className="text-foreground/80 mx-auto mb-2 max-w-3xl text-xl md:text-2xl"
								itemProp="description"
							>
								Thorbis automates dispatch, scheduling, invoicing, and payments—so you can focus on growth, not admin work.
							</p>
							<p className="text-muted-foreground mx-auto max-w-2xl text-base">
								The all-in-one platform trusted by HVAC, plumbing, and electrical companies to book more jobs and get paid faster.
							</p>
						</div>

						{/* Primary CTA with Risk Reversal */}
						<div className="mb-8 flex flex-col items-center gap-4">
							<Button
								asChild
								className="group shadow-primary/20 h-14 px-10 text-lg shadow-lg"
								size="lg"
							>
								<Link href="/register">
									Get Started Free — No Credit Card Required
									<ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
								<div className="flex items-center gap-1.5">
									<CheckCircle2 className="text-success size-4" />
									14-day free trial
								</div>
								<div className="flex items-center gap-1.5">
									<CheckCircle2 className="text-success size-4" />
									No credit card required
								</div>
								<div className="flex items-center gap-1.5">
									<CheckCircle2 className="text-success size-4" />
									Cancel anytime
								</div>
								<div className="flex items-center gap-1.5">
									<CheckCircle2 className="text-success size-4" />
									Setup in 24 hours
								</div>
							</div>
						</div>

						{/* Urgency Bar */}
						<div className="bg-primary/10 border-primary/20 mx-auto mb-12 max-w-2xl rounded-lg border p-3 text-center">
							<p className="text-sm">
								<span className="font-semibold">47 companies</span> signed up in the last 7 days.{" "}
								<span className="font-semibold">Join them before prices increase.</span>
							</p>
						</div>

						{/* Product Screenshot with Video Overlay */}
						<Card className="group relative overflow-hidden border-border">
							<CardContent className="p-1">
								<div className="relative">
									<Image
										alt="Thorbis platform dashboard showing dispatch board, job scheduling, and real-time metrics"
										className="h-auto w-full rounded-lg"
										height={900}
										priority
										src="/hero.png"
										width={1400}
										itemProp="screenshot"
									/>
									{/* Video Play Button Overlay */}
									<div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
										<Button
											asChild
											size="lg"
											className="h-16 gap-3 px-8 text-lg"
										>
											<Link href="/demo">
												<PlayCircle className="size-6" />
												Watch 2-Min Demo
											</Link>
										</Button>
									</div>
									<div className="absolute right-4 bottom-4 flex gap-2">
										<Badge className="bg-background/95 backdrop-blur-sm">
											<span className="text-success mr-1.5 inline-block size-2 rounded-full bg-green-500" />
											Live Dashboard
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Trust Badges */}
						<div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-60">
							<div className="flex items-center gap-2">
								<Shield className="size-5" />
								<span className="text-sm font-medium">SOC 2 Certified</span>
							</div>
							<div className="flex items-center gap-2">
								<Award className="size-5" />
								<span className="text-sm font-medium">GDPR Compliant</span>
							</div>
							<div className="flex items-center gap-2">
								<Shield className="size-5" />
								<span className="text-sm font-medium">256-bit Encryption</span>
							</div>
							<div className="flex items-center gap-2">
								<Award className="size-5" />
								<span className="text-sm font-medium">99.9% Uptime SLA</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Results Section - Quantified Benefits */}
			<section className="border-border border-y py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="mb-12 text-center">
							<h2 className="mb-3 text-3xl font-bold">
								Real Results from Real Companies
							</h2>
							<p className="text-muted-foreground text-lg">
								Here's what happens in your first 30 days
							</p>
						</div>
						<div className="grid gap-6 md:grid-cols-4">
							<Card>
								<CardContent className="p-6 text-center">
									<div className="bg-primary/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-lg">
										<TrendingUp className="text-primary size-6" />
									</div>
									<div className="mb-2 font-mono text-4xl font-bold">38%</div>
									<div className="text-muted-foreground text-sm">
										More jobs booked per month
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-6 text-center">
									<div className="bg-primary/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-lg">
										<Clock className="text-primary size-6" />
									</div>
									<div className="mb-2 font-mono text-4xl font-bold">15hrs</div>
									<div className="text-muted-foreground text-sm">
										Saved per week on admin
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-6 text-center">
									<div className="bg-primary/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-lg">
										<DollarSign className="text-primary size-6" />
									</div>
									<div className="mb-2 font-mono text-4xl font-bold">3x</div>
									<div className="text-muted-foreground text-sm">
										Faster payment collection
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-6 text-center">
									<div className="bg-primary/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-lg">
										<Users className="text-primary size-6" />
									</div>
									<div className="mb-2 font-mono text-4xl font-bold">92%</div>
									<div className="text-muted-foreground text-sm">
										Customer satisfaction rate
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Video Demo Section */}
			<section className="bg-muted/5 py-24">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="grid gap-12 lg:grid-cols-2 lg:items-center">
							<div>
								<Badge className="mb-4" variant="secondary">
									<PlayCircle className="mr-1 size-3" />
									2-minute overview
								</Badge>
								<h2 className="mb-4 text-4xl font-bold md:text-5xl">
									See How It Works
								</h2>
								<p className="text-muted-foreground mb-6 text-lg">
									Watch how Thorbis helps service companies book 38% more jobs, save 15 hours per week, and get paid 3x faster.
								</p>
								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<CheckCircle2 className="text-primary mt-1 size-5 flex-shrink-0" />
										<div>
											<div className="font-semibold">AI Dispatch handles calls 24/7</div>
											<div className="text-muted-foreground text-sm">
												Never miss another emergency call or after-hours booking
											</div>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<CheckCircle2 className="text-primary mt-1 size-5 flex-shrink-0" />
										<div>
											<div className="font-semibold">Smart scheduling maximizes revenue</div>
											<div className="text-muted-foreground text-sm">
												AI optimizes routes and crew utilization automatically
											</div>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<CheckCircle2 className="text-primary mt-1 size-5 flex-shrink-0" />
										<div>
											<div className="font-semibold">Get paid instantly with 0% fees</div>
											<div className="text-muted-foreground text-sm">
												Same-day payouts with zero processing fees
											</div>
										</div>
									</div>
								</div>
								<div className="mt-8">
									<Button asChild size="lg" className="h-12 px-8">
										<Link href="/demo">
											<PlayCircle className="mr-2 size-5" />
											Watch Full Demo
										</Link>
									</Button>
								</div>
							</div>
							<Card className="overflow-hidden border-border">
								<CardContent className="p-1">
									<div className="relative aspect-video bg-muted">
										<Image
											alt="Product demo video thumbnail"
											className="h-full w-full rounded-lg object-cover"
											height={600}
											src="/hero.png"
											width={800}
										/>
										<div className="absolute inset-0 flex items-center justify-center">
											<Button size="lg" className="h-16 w-16 rounded-full p-0">
												<PlayCircle className="size-8" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Features - Problem/Solution Format */}
			<section className="border-border border-y py-24">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto mb-16 max-w-3xl text-center">
						<h2 className="mb-4 text-4xl font-bold md:text-5xl">
							Everything You Need to Scale
						</h2>
						<p className="text-muted-foreground text-lg">
							Stop juggling 10 different tools. Thorbis replaces them all.
						</p>
					</div>
					<div className="mx-auto max-w-7xl">
						{[
							{
								problem: "Missing calls = lost revenue",
								solution: "AI Dispatch answers every call, 24/7",
								description: "Book emergency calls at 2am while you sleep. Our AI qualifies leads and schedules jobs automatically.",
								icon: Zap,
								screenshot: "/hero.png",
							},
							{
								problem: "Chaos scheduling = wasted time",
								solution: "Smart routing maximizes crew efficiency",
								description: "AI optimizes routes by zone and skill. Drag-drop scheduling with live mobile updates for your techs.",
								icon: BarChart3,
								screenshot: "/hero.png",
							},
							{
								problem: "Slow payments = cash flow problems",
								solution: "Get paid same-day with 0% fees",
								description: "Auto-send invoices when jobs complete. Accept payments online and get paid within 24 hours—no processing fees.",
								icon: DollarSign,
								screenshot: "/hero.png",
							},
						].map((feature, i) => (
							<div
								className={`mb-16 grid gap-12 lg:grid-cols-2 lg:items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
								key={i}
							>
								{i % 2 === 0 ? (
									<>
										<div>
											<div className="mb-4 text-sm text-destructive line-through">
												{feature.problem}
											</div>
											<h3 className="mb-4 text-3xl font-bold">
												{feature.solution}
											</h3>
											<p className="text-muted-foreground mb-6 text-lg">
												{feature.description}
											</p>
											<Button asChild variant="outline">
												<Link href="/register">
													Try It Free
													<ArrowRight className="ml-2 size-4" />
												</Link>
											</Button>
										</div>
										<Card className="overflow-hidden">
											<CardContent className="p-1">
												<Image
													alt={feature.solution}
													className="h-auto w-full rounded-lg"
													height={600}
													src={feature.screenshot}
													width={800}
												/>
											</CardContent>
										</Card>
									</>
								) : (
									<>
										<Card className="overflow-hidden lg:order-1">
											<CardContent className="p-1">
												<Image
													alt={feature.solution}
													className="h-auto w-full rounded-lg"
													height={600}
													src={feature.screenshot}
													width={800}
												/>
											</CardContent>
										</Card>
										<div className="lg:order-2">
											<div className="mb-4 text-sm text-destructive line-through">
												{feature.problem}
											</div>
											<h3 className="mb-4 text-3xl font-bold">
												{feature.solution}
											</h3>
											<p className="text-muted-foreground mb-6 text-lg">
												{feature.description}
											</p>
											<Button asChild variant="outline">
												<Link href="/register">
													Try It Free
													<ArrowRight className="ml-2 size-4" />
												</Link>
											</Button>
										</div>
									</>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Social Proof - Video Testimonials */}
			<section className="bg-muted/5 py-24">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="mb-16 text-center">
							<h2 className="mb-4 text-4xl font-bold md:text-5xl">
								Trusted by 1,247+ Service Companies
							</h2>
							<p className="text-muted-foreground text-lg">
								See what happens when you stop fighting spreadsheets
							</p>
						</div>
						<div className="grid gap-8 md:grid-cols-3">
							{[
								{
									quote: "We booked 47 more jobs in our first month. The AI dispatcher is like having a full-time employee who never sleeps.",
									author: "Sarah Johnson",
									role: "Owner, Northwind HVAC",
									company: "Seattle, WA",
									result: "+47 jobs/month",
								},
								{
									quote: "Went from spreadsheets to one dashboard. Our crew utilization jumped from 65% to 87% in 3 weeks.",
									author: "Mike Rodriguez",
									role: "Operations Manager",
									company: "Austin Plumbing Co.",
									result: "+22% utilization",
								},
								{
									quote: "Getting paid same-day changed everything. Our cash flow is predictable now and we pay zero processing fees.",
									author: "Deja Patel",
									role: "CFO, Voltline Electric",
									company: "Phoenix, AZ",
									result: "3x faster payments",
								},
							].map((testimonial, i) => (
								<Card key={i}>
									<CardHeader>
										<div className="mb-4 flex gap-1">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star className="size-4 fill-yellow-500 text-yellow-500" key={star} />
											))}
										</div>
										<CardDescription className="text-base leading-relaxed">
											"{testimonial.quote}"
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="mb-3 border-t border-border pt-4">
											<div className="font-semibold">{testimonial.author}</div>
											<div className="text-muted-foreground text-sm">
												{testimonial.role}
											</div>
											<div className="text-muted-foreground text-sm">
												{testimonial.company}
											</div>
										</div>
										<Badge variant="secondary" className="bg-success/10 text-success">
											{testimonial.result}
										</Badge>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Pricing - Simplified with Guarantee */}
			<section className="border-border border-y py-24">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-4xl">
						<div className="mb-12 text-center">
							<h2 className="mb-4 text-4xl font-bold md:text-5xl">
								Simple, Transparent Pricing
							</h2>
							<p className="text-muted-foreground text-lg">
								No per-user fees. No surprise charges. No lock-in.
							</p>
						</div>
						<Card className="border-primary/50 overflow-hidden border-2">
							<CardHeader className="bg-primary/5 text-center">
								<Badge className="mx-auto mb-4">Most Popular</Badge>
								<CardTitle className="mb-2 text-5xl">
									<span className="font-mono">$100</span>
									<span className="text-muted-foreground text-2xl">/month</span>
								</CardTitle>
								<CardDescription className="text-base">
									Everything you need to scale your service business
								</CardDescription>
							</CardHeader>
							<CardContent className="p-8">
								<div className="mb-8 grid gap-4 sm:grid-cols-2">
									{[
										"Unlimited users & logins",
										"24/7 AI Dispatch answering",
										"Smart scheduling & routing",
										"0% payment processing fees",
										"Same-day payouts",
										"Customer portal & reviews",
										"Live job costing & reporting",
										"Mobile app for technicians",
									].map((feature, i) => (
										<div className="flex items-start gap-3" key={i}>
											<CheckCircle2 className="text-success mt-0.5 size-5 flex-shrink-0" />
											<span className="text-sm">{feature}</span>
										</div>
									))}
								</div>
								<Button asChild className="h-14 w-full text-lg" size="lg">
									<Link href="/register">
										Start Your 14-Day Free Trial
										<ArrowRight className="ml-2 size-5" />
									</Link>
								</Button>
								<div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
									<p>✓ No credit card required to start</p>
									<p>✓ Cancel anytime, no questions asked</p>
									<p>✓ 24-hour setup with dedicated onboarding</p>
								</div>
							</CardContent>
						</Card>
						{/* Money-Back Guarantee */}
						<div className="bg-success/10 border-success/20 mt-8 rounded-lg border p-6 text-center">
							<div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-success/20">
								<Shield className="text-success size-6" />
							</div>
							<h3 className="mb-2 text-lg font-semibold">
								30-Day Money-Back Guarantee
							</h3>
							<p className="text-muted-foreground text-sm">
								If you don't book more jobs in your first 30 days, we'll refund every penny. No questions asked.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Final CTA - High Urgency */}
			<section className="bg-gradient-to-b from-background to-muted/20 py-32">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-4xl text-center">
						<h2 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
							Ready to Stop Losing Money?
						</h2>
						<p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
							Join 1,247+ service companies who are booking more jobs, saving time, and getting paid faster.
						</p>
						<div className="mb-8 flex flex-col items-center gap-4">
							<Button asChild className="h-16 px-12 text-xl shadow-lg" size="lg">
								<Link href="/register">
									Get Started Free — No Credit Card Required
									<ArrowRight className="ml-2 size-6" />
								</Link>
							</Button>
							<div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
								<div className="flex items-center gap-1.5">
									<CheckCircle2 className="text-success size-4" />
									14-day free trial
								</div>
								<div className="flex items-center gap-1.5">
									<CheckCircle2 className="text-success size-4" />
									Setup in 24 hours
								</div>
								<div className="flex items-center gap-1.5">
									<CheckCircle2 className="text-success size-4" />
									Cancel anytime
								</div>
								<div className="flex items-center gap-1.5">
									<CheckCircle2 className="text-success size-4" />
									30-day guarantee
								</div>
							</div>
						</div>
						<div className="bg-primary/10 border-primary/20 mx-auto max-w-lg rounded-lg border p-4">
							<p className="text-sm">
								⚡ <span className="font-semibold">Limited time:</span> First 100 signups this month get free onboarding (worth $500)
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
