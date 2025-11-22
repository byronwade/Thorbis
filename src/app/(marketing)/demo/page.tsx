
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
	},
	{
		title: "Import data & configure essentials",
		description:
			"Use guided import templates for customers, jobs, equipment, and pricebooks. Thorbis automates defaults so you can begin immediately.",
	},
	{
		title: "Invite your team & launch",
		description:
			"Bring dispatchers, technicians, and admins into a shared workspace. Built-in training resources help everyone get productive fast.",
	},
];

const ONBOARDING_RESOURCES = [
	{
		title: "Migration checklist",
		description:
			"Step-by-step guide covering exports, data cleanup, and go-live validation.",
		href: "/templates?tag=migration",
		cta: "Download checklist",
	},
	{
		title: "Implementation playbook",
		description:
			"Understand the 45-day rollout process that Thorbis success teams follow with new customers.",
		href: "/implementation",
		cta: "View playbook",
	},
	{
		title: "Knowledge base",
		description:
			"Read detailed guides for configuring scheduling, AI assistant, payments, and reporting.",
		href: "/kb",
		cta: "Browse articles",
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
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<section className="mx-auto max-w-3xl space-y-6 text-center">
					<Badge className="tracking-wide uppercase" variant="secondary">
						Self-serve signup
					</Badge>
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
						Spin up your Thorbis account today
					</h1>
					<p className="text-muted-foreground text-lg leading-relaxed">
						Choose your plan, invite your team, and start automating operations
						without waiting for a sales call. Thorbis costs $200/month for the
						base platform with pay-as-you-go usage—unlimited users, no
						contracts, no lock-in.
					</p>
					<div className="flex flex-wrap justify-center gap-3">
						<Button asChild size="lg">
							<Link href="/waitlist">Join Waitlist</Link>
						</Button>
						<Button asChild size="lg" variant="outline">
							<Link href="/pricing">Review pricing</Link>
						</Button>
					</div>
				</section>

				<section className="mt-16 space-y-6">
					<h2 className="text-center text-2xl font-semibold">
						Three simple steps
					</h2>
					<div className="grid gap-6 md:grid-cols-3">
						{GET_STARTED_STEPS.map((step) => (
							<Card className="bg-muted/40" key={step.title}>
								<CardHeader>
									<CardTitle className="text-lg">{step.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground text-sm leading-relaxed">
										{step.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section className="mt-16 space-y-6">
					<h2 className="text-center text-2xl font-semibold">
						Resources to guide your rollout
					</h2>
					<div className="grid gap-6 md:grid-cols-3">
						{ONBOARDING_RESOURCES.map((resource) => (
							<Card key={resource.title}>
								<CardHeader>
									<CardTitle className="text-lg">{resource.title}</CardTitle>
								</CardHeader>
								<CardContent className="text-muted-foreground space-y-4 text-sm leading-relaxed">
									<p>{resource.description}</p>
									<Button asChild variant="outline">
										<Link href={resource.href}>{resource.cta}</Link>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section className="bg-primary/10 mt-16 rounded-3xl border p-10 text-center">
					<p className="text-muted-foreground text-lg">
						Already a customer? Visit the Help Center for training resources,
						live webinars, and office hours with our success team.
					</p>
					<Button asChild className="mt-6" variant="secondary">
						<Link href="/help">Visit the Help Center</Link>
					</Button>
				</section>
			</div>
		</>
	);
}
