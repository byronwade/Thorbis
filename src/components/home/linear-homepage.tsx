/**
 * Linear-Inspired Homepage - Thorbis Service Business Platform
 *
 * Design Principles:
 * - Dark-first aesthetic with sophisticated gradients
 * - Product-led storytelling with feature showcases
 * - Multiple content sections like Linear
 * - Thorbis Electric Blue (221 73% 56%) throughout
 * - Clean typography with generous whitespace
 * - Service business focused content
 */

import type { LucideIcon } from "lucide-react";
import {
	ArrowRight,
	Calendar,
	CheckCircle2,
	Clock,
	DollarSign,
	FileText,
	Hammer,
	MapPin,
	MessageSquare,
	Smartphone,
	Sparkles,
	TrendingUp,
	Users,
	Wrench,
	Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const keyFeatures = [
	{
		title: "Smart Scheduling",
		description:
			"Drag-and-drop scheduling with real-time availability. AI suggests optimal routes and time slots based on location, skills, and job requirements.",
		icon: Calendar,
		gradient: "from-blue-500/20 to-primary/20",
	},
	{
		title: "Mobile Field App",
		description:
			"Complete jobs, capture photos, collect signatures, and accept payments—all from a mobile device that works offline.",
		icon: Smartphone,
		gradient: "from-purple-500/20 to-primary/20",
	},
	{
		title: "AI-Powered Dispatch",
		description:
			"Intelligent routing that optimizes drive time and maximizes revenue. The system learns from your business patterns.",
		icon: Sparkles,
		gradient: "from-primary/20 to-cyan-500/20",
	},
	{
		title: "Instant Invoicing",
		description:
			"Generate professional invoices in seconds. Accept payments on-site with same-day funding. No more chasing down payments.",
		icon: FileText,
		gradient: "from-green-500/20 to-primary/20",
	},
	{
		title: "Customer Portal",
		description:
			"Give customers 24/7 access to service history, invoices, and scheduling. Reduce support calls and improve satisfaction.",
		icon: Users,
		gradient: "from-orange-500/20 to-primary/20",
	},
	{
		title: "Equipment Tracking",
		description:
			"Track equipment maintenance, warranties, and service history. Never miss a preventive maintenance opportunity.",
		icon: Wrench,
		gradient: "from-red-500/20 to-primary/20",
	},
] as const;

const workflows = [
	{
		step: "01",
		title: "Lead comes in",
		description:
			"Phone call, web form, or customer portal booking—every lead automatically routes to your CRM. AI scores urgency and potential value, so you know which to prioritize.",
		features: [
			"Automatic lead capture",
			"AI urgency scoring",
			"Customer history lookup",
			"Smart routing rules",
		],
	},
	{
		step: "02",
		title: "Schedule in seconds",
		description:
			"Drag and drop to schedule. The system automatically accounts for drive time between jobs, technician skills, parts availability, and customer preferences.",
		features: [
			"Real-time availability",
			"Automatic route optimization",
			"Skills-based assignment",
			"Customer notifications",
		],
	},
	{
		step: "03",
		title: "Execute in the field",
		description:
			"Technicians get complete job details on their mobile device: customer history, equipment records, parts needed, and custom checklists. Work offline, sync when connected.",
		features: [
			"Offline-first mobile app",
			"Digital checklists",
			"Photo capture",
			"Electronic signatures",
		],
	},
	{
		step: "04",
		title: "Get paid same-day",
		description:
			"Invoice generated automatically from job completion. Accept payment on-site via card, ACH, or send via text/email. Funds hit your account the same day.",
		features: [
			"Same-day funding",
			"Multiple payment methods",
			"Automatic reminders",
			"Payment plans available",
		],
	},
] as const;

const stats = [
	{ value: "42%", label: "More jobs per technician", icon: TrendingUp },
	{ value: "3hrs", label: "Saved on admin daily", icon: Clock },
	{ value: "2.5x", label: "Faster invoice payment", icon: DollarSign },
	{ value: "98%", label: "Mobile app adoption", icon: Smartphone },
] as const;

const industries = [
	{ name: "HVAC", icon: Wrench },
	{ name: "Plumbing", icon: Wrench },
	{ name: "Electrical", icon: Zap },
	{ name: "Landscaping", icon: Hammer },
	{ name: "Pool Service", icon: Wrench },
	{ name: "Pest Control", icon: Hammer },
] as const;

export function LinearHomepage() {
	return (
		<div className="relative min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative overflow-hidden border-b border-border/40">
				{/* Background Effects */}
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/8 blur-[140px]" />
					<div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
					<div className="absolute right-1/4 top-2/3 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[130px]" />
				</div>

				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex min-h-[90vh] flex-col items-center justify-center py-20 text-center">
						{/* Announcement Badge */}
						<Badge
							variant="outline"
							className="mb-8 border-primary/30 bg-primary/5 text-primary"
						>
							<Sparkles className="mr-2 size-3" />
							Now with AI-Powered Dispatch & Route Optimization
						</Badge>

						{/* Main Headline */}
						<h1 className="mb-6 max-w-5xl text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
							Thorbis is a purpose-built tool
							<br />
							for{" "}
							<span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
								running service businesses
							</span>
						</h1>

						{/* Subheadline */}
						<p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
							The all-in-one platform for HVAC, plumbing, electrical, and field
							service companies. Schedule jobs, dispatch teams, and get paid—all
							from one dashboard.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col items-center gap-4 sm:flex-row">
							<Button
								asChild
								size="lg"
								className="h-12 bg-primary px-8 text-base font-medium text-primary-foreground hover:bg-primary/90"
							>
								<Link href="/register">
									Start Free Trial
									<ArrowRight className="ml-2 size-4" />
								</Link>
							</Button>
							<Button
								asChild
								variant="ghost"
								size="lg"
								className="h-12 px-8 text-base font-medium text-muted-foreground hover:text-foreground"
							>
								<Link href="/demo">Watch Demo</Link>
							</Button>
						</div>

						{/* Trust Indicators */}
						<div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-primary" />
								<span>14-day free trial</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-primary" />
								<span>No credit card required</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-primary" />
								<span>Cancel anytime</span>
							</div>
						</div>

						{/* Industries Served */}
						<div className="mt-16">
							<p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
								Trusted by field service teams
							</p>
							<div className="flex flex-wrap items-center justify-center gap-6">
								{industries.map((industry) => (
									<div
										key={industry.name}
										className="flex items-center gap-2 text-sm text-muted-foreground"
									>
										<industry.icon className="size-4" />
										<span>{industry.name}</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Hero Product Image */}
					<div className="relative pb-20">
						<div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/50">
							<div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-blue-500/5 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
							<div className="aspect-[16/10] bg-muted/20">
								{/* Product screenshot will go here */}
								<div className="flex size-full items-center justify-center text-muted-foreground">
									<Calendar className="size-16 opacity-20" />
								</div>
							</div>
						</div>
						{/* Floating UI Element */}
						<div className="absolute top-8 right-8 hidden rounded-lg border border-border/40 bg-card/95 p-4 backdrop-blur-md md:block">
							<div className="flex items-center gap-3">
								<div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
									<CheckCircle2 className="size-5" />
								</div>
								<div>
									<p className="text-sm font-medium">Job Completed</p>
									<p className="text-xs text-muted-foreground">
										HVAC Repair - $450
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Why We're Different Section - Prominent placement after hero */}
			<section className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-4xl text-center">
						<Badge
							variant="outline"
							className="mb-6 border-primary/30 bg-primary/10 text-primary"
						>
							<Zap className="mr-2 size-3" />
							Why Service Businesses Choose Thorbis
						</Badge>
						<h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
							No Sales Pressure. No Lock-Ins.
							<br />
							Just Software That Works.
						</h2>
						<p className="mb-12 text-lg text-muted-foreground">
							Unlike traditional FSM companies, we believe in letting our
							product speak for itself. Try it, love it, or leave—no hard
							feelings, no contracts, no hassle.
						</p>

						<div className="grid gap-6 text-left sm:grid-cols-2">
							<DifferentiatorCard
								icon={Users}
								title="No Pushy Sales Teams"
								description="Try the full platform yourself. No demos, no sales calls unless you want one. Self-service signup takes 60 seconds."
							/>
							<DifferentiatorCard
								icon={CheckCircle2}
								title="No Contracts or Lock-Ins"
								description="Cancel anytime with one click. Keep your data. We earn your business every single month, not through contracts."
							/>
							<DifferentiatorCard
								icon={Zap}
								title="5-Minute Intelligent Setup"
								description="Smart onboarding form asks the right questions for your business. No lengthy operational assessments or expensive consultants."
							/>
							<DifferentiatorCard
								icon={MessageSquare}
								title="Top-Tier Support Included"
								description="Real humans respond in under 2 hours. We help with anything—setup, training, or custom workflows. No extra support tiers."
							/>
						</div>

						<div className="mt-12 rounded-lg border border-primary/30 bg-card/50 p-6 backdrop-blur-sm">
							<div className="flex items-start gap-4 text-left">
								<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Sparkles className="size-5" />
								</div>
								<div>
									<h3 className="mb-2 text-lg font-semibold">
										We Actually Listen & Fix Things
									</h3>
									<p className="text-sm leading-relaxed text-muted-foreground">
										Found a bug? Need a feature? We build what service
										businesses actually need. Our roadmap is driven by user
										feedback, not enterprise sales quotas. Most requests ship
										within 2-4 weeks.
									</p>
								</div>
							</div>
						</div>

						<div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-primary" />
								<span>Setup in 5 minutes</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-primary" />
								<span>Running jobs same day</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-primary" />
								<span>Export your data anytime</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-primary" />
								<span>Cancel with one click</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="border-b border-border/40 py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
						{stats.map((stat) => (
							<StatCard key={stat.label} {...stat} />
						))}
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="border-b border-border/40 py-32">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-20 text-center">
						<h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
							Made for modern service teams
						</h2>
						<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
							Everything you need to run a profitable field service business in
							one beautifully-designed platform.
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{keyFeatures.map((feature) => (
							<FeatureCard key={feature.title} {...feature} />
						))}
					</div>
				</div>
			</section>

			{/* Workflow Showcase - Linear Style */}
			<section className="border-b border-border/40 py-32">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-20 text-center">
						<Badge variant="outline" className="mb-4 border-primary/30">
							How it works
						</Badge>
						<h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
							Set the product direction
						</h2>
						<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
							From lead to payment, Thorbis streamlines every step of your
							service workflow.
						</p>
					</div>

					<div className="mx-auto max-w-6xl space-y-32">
						{workflows.map((workflow, index) => (
							<WorkflowSection
								key={workflow.step}
								{...workflow}
								reverse={index % 2 !== 0}
							/>
						))}
					</div>
				</div>
			</section>

			{/* Issue Tracking Style Section */}
			<section className="border-b border-border/40 py-32">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid items-center gap-16 lg:grid-cols-2">
						<div>
							<Badge variant="outline" className="mb-4 border-primary/30">
								Issue tracking you'll enjoy using
							</Badge>
							<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
								Track every job like
								<br />a precision operation
							</h2>
							<p className="mb-8 text-lg leading-relaxed text-muted-foreground">
								From emergency calls to scheduled maintenance, every job is
								tracked with military precision. Know exactly where your team
								is, what they're working on, and when they'll finish.
							</p>
							<ul className="space-y-4">
								<FeatureListItem
									icon={MapPin}
									title="Real-time GPS tracking"
									description="See your entire team on a live map"
								/>
								<FeatureListItem
									icon={MessageSquare}
									title="Two-way communication"
									description="Chat with techs without phone tag"
								/>
								<FeatureListItem
									icon={CheckCircle2}
									title="Automated updates"
									description="Customers get real-time status updates"
								/>
							</ul>
						</div>
						<div className="relative">
							<div className="overflow-hidden rounded-xl border border-border/40 bg-card/50">
								<div className="aspect-[4/3] bg-muted/20">
									{/* Job tracking screenshot */}
									<div className="flex size-full items-center justify-center">
										<MapPin className="size-16 text-muted-foreground opacity-20" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Collaborate Across Tools Section */}
			<section className="border-b border-border/40 py-32">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid items-center gap-16 lg:grid-cols-2">
						<div className="order-2 lg:order-1">
							<div className="overflow-hidden rounded-xl border border-border/40 bg-card/50">
								<div className="aspect-[4/3] bg-muted/20">
									{/* Communication screenshot */}
									<div className="flex size-full items-center justify-center">
										<MessageSquare className="size-16 text-muted-foreground opacity-20" />
									</div>
								</div>
							</div>
						</div>
						<div className="order-1 lg:order-2">
							<Badge variant="outline" className="mb-4 border-primary/30">
								Collaborate across tools and teams
							</Badge>
							<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
								Built on strong
								<br />
								foundations
							</h2>
							<p className="mb-8 text-lg leading-relaxed text-muted-foreground">
								Connect with QuickBooks, integrate with your existing tools, and
								give your team a single source of truth. No more switching
								between apps.
							</p>
							<div className="grid gap-6 sm:grid-cols-2">
								<IntegrationCard
									title="QuickBooks Sync"
									description="Two-way sync with your accounting software"
								/>
								<IntegrationCard
									title="Stripe Payments"
									description="Accept payments anywhere, anytime"
								/>
								<IntegrationCard
									title="Google Calendar"
									description="Sync schedules with your calendar"
								/>
								<IntegrationCard
									title="Zapier"
									description="Connect to 1000+ apps"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Performance Metrics */}
			<section className="border-b border-border/40 py-32">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-4xl text-center">
						<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
							Built on strong foundations
						</h2>
						<p className="mb-16 text-lg text-muted-foreground">
							Thorbis is designed from the ground up to be fast, reliable, and
							scalable. We obsess over performance so you don't have to.
						</p>

						<div className="grid gap-8 md:grid-cols-3">
							<MetricCard
								value="< 200ms"
								label="Average API response"
								description="Instant feedback on every action"
							/>
							<MetricCard
								value="99.9%"
								label="Uptime SLA"
								description="Always available when you need it"
							/>
							<MetricCard
								value="< 1.5s"
								label="Page load time"
								description="Optimized for speed"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="py-32">
				<div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl">
						<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
							Plan the present.
							<br />
							Build the future.
						</h2>
						<p className="mb-10 text-lg leading-relaxed text-muted-foreground md:text-xl">
							Join hundreds of field service teams running their entire business
							on Thorbis. Start your free trial today.
						</p>
						<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
							<Button
								asChild
								size="lg"
								className="h-12 bg-primary px-8 text-base font-medium text-primary-foreground hover:bg-primary/90"
							>
								<Link href="/register">
									Start Free Trial
									<ArrowRight className="ml-2 size-4" />
								</Link>
							</Button>
							<Button
								asChild
								variant="ghost"
								size="lg"
								className="h-12 px-8 text-base font-medium text-muted-foreground hover:text-foreground"
							>
								<Link href="/contact">Talk to Sales</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

// --- Subcomponents ---

function FeatureCard({
	icon: Icon,
	title,
	description,
	gradient,
}: {
	icon: LucideIcon;
	title: string;
	description: string;
	gradient: string;
}) {
	return (
		<div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/50 p-8 transition-all hover:border-primary/30">
			<div
				className={cn(
					"absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
					gradient,
				)}
			/>
			<div className="relative">
				<div className="mb-5 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
					<Icon className="size-6" />
				</div>
				<h3 className="mb-3 text-xl font-semibold">{title}</h3>
				<p className="text-sm leading-relaxed text-muted-foreground">
					{description}
				</p>
			</div>
		</div>
	);
}

function WorkflowSection({
	step,
	title,
	description,
	features,
	reverse = false,
}: {
	step: string;
	title: string;
	description: string;
	features: readonly string[];
	reverse?: boolean;
}) {
	return (
		<div
			className={cn(
				"grid items-center gap-12 lg:grid-cols-2",
				reverse && "lg:grid-flow-dense",
			)}
		>
			<div className={cn(reverse && "lg:col-start-2")}>
				<div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
					{step}
				</div>
				<h3 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
					{title}
				</h3>
				<p className="mb-8 text-lg leading-relaxed text-muted-foreground">
					{description}
				</p>
				<ul className="space-y-3">
					{features.map((feature) => (
						<li key={feature} className="flex items-center gap-3 text-sm">
							<CheckCircle2 className="size-4 shrink-0 text-primary" />
							<span className="text-muted-foreground">{feature}</span>
						</li>
					))}
				</ul>
			</div>
			<div className={cn(reverse && "lg:col-start-1")}>
				<div className="overflow-hidden rounded-xl border border-border/40 bg-card/50">
					<div className="aspect-[4/3] bg-muted/20">
						{/* Workflow screenshot placeholder */}
						<div className="flex size-full items-center justify-center">
							<span className="text-6xl font-bold text-muted-foreground opacity-10">
								{step}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function StatCard({
	value,
	label,
	icon: Icon,
}: {
	value: string;
	label: string;
	icon: LucideIcon;
}) {
	return (
		<div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/50 p-8 text-center transition-all hover:border-primary/30">
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
			<div className="relative">
				<div className="mb-4 flex items-center justify-center">
					<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<Icon className="size-6" />
					</div>
				</div>
				<div className="mb-2 text-4xl font-bold">{value}</div>
				<div className="text-sm text-muted-foreground">{label}</div>
			</div>
		</div>
	);
}

function MetricCard({
	value,
	label,
	description,
}: {
	value: string;
	label: string;
	description: string;
}) {
	return (
		<div className="rounded-xl border border-border/40 bg-card/50 p-6 text-center">
			<div className="mb-2 text-3xl font-bold text-primary">{value}</div>
			<div className="mb-2 text-sm font-medium">{label}</div>
			<div className="text-xs text-muted-foreground">{description}</div>
		</div>
	);
}

function FeatureListItem({
	icon: Icon,
	title,
	description,
}: {
	icon: LucideIcon;
	title: string;
	description: string;
}) {
	return (
		<li className="flex gap-4">
			<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
				<Icon className="size-5" />
			</div>
			<div>
				<p className="font-medium">{title}</p>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
		</li>
	);
}

function IntegrationCard({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="rounded-lg border border-border/40 bg-card/50 p-4">
			<p className="mb-1 text-sm font-medium">{title}</p>
			<p className="text-xs text-muted-foreground">{description}</p>
		</div>
	);
}

function DifferentiatorCard({
	icon: Icon,
	title,
	description,
}: {
	icon: LucideIcon;
	title: string;
	description: string;
}) {
	return (
		<div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card">
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
			<div className="relative">
				<div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
					<Icon className="size-5" />
				</div>
				<h3 className="mb-2 text-lg font-semibold">{title}</h3>
				<p className="text-sm leading-relaxed text-muted-foreground">
					{description}
				</p>
			</div>
		</div>
	);
}
