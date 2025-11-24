import {
	ArrowRight,
	Bot,
	Code2,
	Handshake,
	Link2,
	Megaphone,
	Network,
	Puzzle,
	Users,
	Zap,
} from "lucide-react";
import Script from "next/script";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const partnersKeywords = generateSemanticKeywords("partners");

export const metadata = generateSEOMetadata({
	title: "Thorbis Partner Program",
	description:
		"Partner with Thorbis to deliver automation-driven success for service companies. Explore solution, integration, and referral partnerships.",
	path: "/partners",
	section: "Company",
	keywords: [
		"thorbis partners",
		"thorbis integrations",
		"service software partner program",
		"thorbis api partners",
		"become a thorbis partner",
		...partnersKeywords.slice(0, 5),
	],
});

const PARTNER_TYPES = [
	{
		title: "Solution partners",
		description:
			"Consultancies and agencies that implement, optimize, and operate Thorbis on behalf of joint customers. Receive enablement, co-marketing, and revenue share.",
		icon: Users,
		color: "from-blue-500/10 to-cyan-500/10 border-blue-500/30",
		iconBg: "bg-blue-500/10",
		iconColor: "text-blue-600 dark:text-blue-400",
		benefits: ["Co-marketing support", "Revenue share", "Dedicated partner manager"],
	},
	{
		title: "Integration partners",
		description:
			"Software vendors that connect into Thorbis via our APIs to deliver seamless workflows across accounting, financing, marketing, and field operations.",
		icon: Puzzle,
		color: "from-violet-500/10 to-purple-500/10 border-violet-500/30",
		iconBg: "bg-violet-500/10",
		iconColor: "text-violet-600 dark:text-violet-400",
		benefits: ["API access & sandbox", "Joint go-to-market", "Technical support"],
	},
	{
		title: "Referral partners",
		description:
			"Organizations that recommend Thorbis to service companies, from distributors to training providers. Earn referral incentives and early roadmap access.",
		icon: Megaphone,
		color: "from-emerald-500/10 to-green-500/10 border-emerald-500/30",
		iconBg: "bg-emerald-500/10",
		iconColor: "text-emerald-600 dark:text-emerald-400",
		benefits: ["Referral commissions", "Early roadmap access", "Partner badge"],
	},
];

const INTEGRATIONS = [
	{ name: "QuickBooks Online & Desktop", icon: Link2 },
	{ name: "Stripe, Authorize.net, Sunbit, GreenSky", icon: Link2 },
	{ name: "HubSpot, Mailchimp, ActiveCampaign", icon: Link2 },
	{ name: "Google Ads, Meta Ads, CallRail", icon: Link2 },
	{ name: "Fleetio, Verizon Connect, Samsara", icon: Link2 },
	{ name: "Notion, Slack, Zapier, Workato", icon: Link2 },
];

const PARTNER_BENEFITS = [
	{
		title: "Open APIs & SDKs",
		description: "Build deep, reliable connections with comprehensive documentation.",
		icon: Code2,
	},
	{
		title: "Sandbox environment",
		description: "Test your integrations in a dedicated development environment.",
		icon: Bot,
	},
	{
		title: "Partner portal",
		description: "Access training, resources, and co-marketing assets.",
		icon: Network,
	},
	{
		title: "Dedicated support",
		description: "Technical and business support from our partner team.",
		icon: Zap,
	},
];

export default function PartnersPage() {
	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Partners", url: `${siteUrl}/partners` },
						]),
					),
				}}
				id="partners-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto space-y-20 px-4 py-16 sm:px-6 lg:px-8">
				{/* Hero Section */}
				<section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-teal-600/20 via-background to-cyan-500/5 p-8 sm:p-12 lg:p-16">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-teal-500/10 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-cyan-500/10 blur-3xl" />

					<div className="mx-auto max-w-3xl space-y-6 text-center">
						<Badge className="px-4 py-1.5 font-medium tracking-wide uppercase bg-teal-500/10 text-teal-600 dark:text-teal-400">
							<Handshake className="mr-2 size-4" />
							Partner with Thorbis
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
							Help service companies unlock AI-driven growth
						</h1>
						<p className="text-muted-foreground text-lg leading-relaxed sm:text-xl">
							Thorbis partners expand what's possible for contractors. Join our
							ecosystem to deliver AI-enabled workflows, seamless integrations,
							and consultative expertise that accelerate customer outcomes.
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							<Button asChild className="group" size="lg">
								<a href="mailto:partners@thorbis.com">
									Apply to become a partner
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</a>
							</Button>
							<Button asChild size="lg" variant="outline">
								<a href="/press">Access partner resources</a>
							</Button>
						</div>
					</div>
				</section>

				{/* Partner Types Section */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							Partnership Types
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Choose the partnership that fits
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Multiple paths to grow with Thorbis and deliver value to contractors.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						{PARTNER_TYPES.map((partner) => {
							const Icon = partner.icon;
							return (
								<Card
									className={`h-full border-2 bg-gradient-to-br transition-all hover:shadow-lg ${partner.color}`}
									key={partner.title}
								>
									<CardHeader>
										<div className={`flex size-12 items-center justify-center rounded-xl mb-3 ${partner.iconBg}`}>
											<Icon className={`size-6 ${partner.iconColor}`} />
										</div>
										<CardTitle className="text-xl">{partner.title}</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<CardDescription className="leading-relaxed text-base">
											{partner.description}
										</CardDescription>
										<div className="pt-4 border-t border-border/50 space-y-2">
											{partner.benefits.map((benefit) => (
												<div className="flex items-center gap-2 text-sm" key={benefit}>
													<div className={`size-1.5 rounded-full ${partner.iconBg.replace('/10', '')}`} />
													<span className="text-muted-foreground">{benefit}</span>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* Partner Benefits */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							Developer Platform
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Build on the Thorbis platform
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Everything you need to create powerful integrations.
						</p>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{PARTNER_BENEFITS.map((benefit) => {
							const Icon = benefit.icon;
							return (
								<Card className="border-2 hover:border-primary/30 transition-all hover:shadow-lg" key={benefit.title}>
									<CardContent className="py-6 space-y-3">
										<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
											<Icon className="size-5 text-primary" />
										</div>
										<h3 className="font-semibold">{benefit.title}</h3>
										<p className="text-muted-foreground text-sm leading-relaxed">
											{benefit.description}
										</p>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* Integrations Section */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							Ecosystem
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Integrations our customers rely on
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Thorbis integrates with the systems contractors depend on. Our open
							APIs and SDKs let you build deep, reliable connections.
						</p>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{INTEGRATIONS.map((integration) => {
							const Icon = integration.icon;
							return (
								<Card
									className="border-2 hover:border-primary/30 transition-all hover:shadow-lg"
									key={integration.name}
								>
									<CardContent className="flex items-center gap-4 py-5">
										<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
											<Icon className="size-5 text-primary" />
										</div>
										<span className="text-sm font-medium">{integration.name}</span>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* CTA Section */}
				<section className="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-10 text-center">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />

					<div className="relative space-y-6 max-w-3xl mx-auto">
						<div className="flex items-center justify-center gap-2">
							<Code2 className="size-5 text-primary" />
							<span className="text-muted-foreground text-sm font-medium">
								Developer-first platform
							</span>
						</div>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Ready to build on Thorbis?
						</h2>
						<p className="text-muted-foreground text-lg">
							Request access to our developer portal, API documentation, and
							sandbox environment.
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							<Button asChild className="group" size="lg">
								<a href="mailto:partners@thorbis.com?subject=Thorbis%20Developer%20Access">
									Request developer access
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</a>
							</Button>
							<Button asChild size="lg" variant="outline">
								<a href="mailto:partners@thorbis.com">
									Contact partner team
								</a>
							</Button>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
