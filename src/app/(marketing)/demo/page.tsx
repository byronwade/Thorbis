import {
	ArrowRight,
	BookOpen,
	CheckCircle,
	FileCheck,
	Rocket,
	Settings,
	Users,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const getStartedKeywords = generateSemanticKeywords("get started");

export const metadata = generateSEOMetadata({
	title: "Get Started with Thorbis",
	description:
		"Create your Thorbis account in minutes. Choose a plan, invite your team, and start automating operations without waiting for a sales call.",
	path: "/demo",
	section: "Company",
	keywords: [
		"thorbis signup",
		"start thorbis trial",
		"thorbis onboarding",
		"create account",
		"free trial",
		"sign up",
		...getStartedKeywords.slice(0, 5),
	],
});

const GET_STARTED_STEPS = [
	{
		title: "Create your workspace",
		description:
			"Sign up with your business email, choose a plan, and secure your account. No scheduling or back-and-forth required.",
		icon: Rocket,
	},
	{
		title: "Import data & configure essentials",
		description:
			"Use guided import templates for customers, jobs, equipment, and pricebooks. Thorbis automates defaults so you can begin immediately.",
		icon: Settings,
	},
	{
		title: "Invite your team & launch",
		description:
			"Bring dispatchers, technicians, and admins into a shared workspace. Built-in training resources help everyone get productive fast.",
		icon: Users,
	},
];

const ONBOARDING_RESOURCES = [
	{
		title: "Migration checklist",
		description:
			"Step-by-step guide covering exports, data cleanup, and go-live validation.",
		href: "/templates?tag=migration",
		cta: "Download checklist",
		icon: FileCheck,
	},
	{
		title: "Implementation playbook",
		description:
			"Understand the 45-day rollout process that Thorbis success teams follow with new customers.",
		href: "/implementation",
		cta: "View playbook",
		icon: BookOpen,
	},
	{
		title: "Knowledge base",
		description:
			"Read detailed guides for configuring scheduling, AI assistant, payments, and reporting.",
		href: "/kb",
		cta: "Browse articles",
		icon: BookOpen,
	},
];

export default function DemoPage() {
	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Get Started", url: `${siteUrl}/demo` },
						]),
					),
				}}
				id="demo-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto space-y-20 px-4 py-16 sm:px-6 lg:px-8">
				{/* Hero Section - Enhanced with gradient */}
				<section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-emerald-600/20 via-background to-emerald-500/5 p-8 sm:p-12 lg:p-16">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-emerald-500/10 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-emerald-500/10 blur-3xl" />

					<div className="mx-auto max-w-3xl space-y-6 text-center">
						<Badge className="px-4 py-1.5 font-medium tracking-wide uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
							Self-serve signup
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
							Spin up your Thorbis account today
						</h1>
						<p className="text-muted-foreground text-lg leading-relaxed sm:text-xl">
							Choose your plan, invite your team, and start automating operations
							without waiting for a sales call. Thorbis costs $200/month for the
							base platform with pay-as-you-go usage—unlimited users, no
							contracts, no lock-in.
						</p>
						<div className="border-border/50 flex flex-wrap items-center justify-center gap-6 border-t pt-6">
							<div className="flex items-center gap-2">
								<CheckCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
								<span className="text-muted-foreground text-sm">No credit card required</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
								<span className="text-muted-foreground text-sm">14-day free trial</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
								<span className="text-muted-foreground text-sm">Cancel anytime</span>
							</div>
						</div>
						<div className="flex flex-wrap justify-center gap-3">
							<Button asChild className="group" size="lg">
								<Link href="/waitlist">
									Join Waitlist
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/pricing">Review pricing</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Steps Section - Enhanced */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							Simple Onboarding
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Three simple steps to get started
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Go from signup to scheduling jobs in minutes, not weeks.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						{GET_STARTED_STEPS.map((step, index) => {
							const Icon = step.icon;
							const colors = [
								"from-emerald-500/10 to-green-500/10 border-emerald-500/30",
								"from-blue-500/10 to-cyan-500/10 border-blue-500/30",
								"from-violet-500/10 to-purple-500/10 border-violet-500/30",
							];
							const textColors = [
								"text-emerald-600 dark:text-emerald-400",
								"text-blue-600 dark:text-blue-400",
								"text-violet-600 dark:text-violet-400",
							];
							const bgColors = [
								"bg-emerald-500/10",
								"bg-blue-500/10",
								"bg-violet-500/10",
							];
							return (
								<Card
									className={`border-2 bg-gradient-to-br transition-all hover:shadow-lg ${colors[index]}`}
									key={step.title}
								>
									<CardHeader>
										<div className="flex items-center gap-4 mb-2">
											<div className={`flex size-12 items-center justify-center rounded-xl ${bgColors[index]}`}>
												<Icon className={`size-6 ${textColors[index]}`} />
											</div>
											<span className={`text-2xl font-bold ${textColors[index]}`}>
												{index + 1}
											</span>
										</div>
										<CardTitle className="text-xl">{step.title}</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground text-sm leading-relaxed">
											{step.description}
										</p>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* Resources Section - Enhanced */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							Resources
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Resources to guide your rollout
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Everything you need to launch successfully.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						{ONBOARDING_RESOURCES.map((resource) => {
							const Icon = resource.icon;
							return (
								<Card
									className="border-2 transition-all hover:shadow-lg hover:border-primary/30"
									key={resource.title}
								>
									<CardHeader>
										<div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
											<Icon className="size-6 text-primary" />
										</div>
										<CardTitle className="text-lg">{resource.title}</CardTitle>
									</CardHeader>
									<CardContent className="text-muted-foreground space-y-4 text-sm leading-relaxed">
										<p>{resource.description}</p>
										<Button asChild variant="outline">
											<Link href={resource.href}>{resource.cta}</Link>
										</Button>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* CTA Section - Enhanced */}
				<section className="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-10 text-center">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />

					<div className="relative space-y-6 max-w-3xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Already a customer?
						</h2>
						<p className="text-muted-foreground text-lg">
							Visit the Help Center for training resources,
							live webinars, and office hours with our success team.
						</p>
						<Button asChild size="lg" variant="secondary">
							<Link href="/help">Visit the Help Center</Link>
						</Button>
					</div>
				</section>
			</div>
		</>
	);
}
