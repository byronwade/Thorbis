"use cache";
export const cacheLife = "marketingWeekly";

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
	},
	{
		title: "Integration partners",
		description:
			"Software vendors that connect into Thorbis via our APIs to deliver seamless workflows across accounting, financing, marketing, and field operations.",
	},
	{
		title: "Referral partners",
		description:
			"Organizations that recommend Thorbis to service companies, from distributors to training providers. Earn referral incentives and early roadmap access.",
	},
];

const INTEGRATIONS = [
	"QuickBooks Online & Desktop",
	"Stripe, Authorize.net, Sunbit, GreenSky",
	"HubSpot, Mailchimp, ActiveCampaign",
	"Google Ads, Meta Ads, CallRail",
	"Fleetio, Verizon Connect, Samsara",
	"Notion, Slack, Zapier, Workato",
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
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<section className="max-w-3xl space-y-6">
					<Badge className="tracking-wide uppercase" variant="secondary">
						Partner with Thorbis
					</Badge>
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
						Help service companies unlock AI-driven growth
					</h1>
					<p className="text-muted-foreground text-lg leading-relaxed">
						Thorbis partners expand what’s possible for contractors. Join our
						ecosystem to deliver AI-enabled workflows, seamless integrations,
						and consultative expertise that accelerate customer outcomes.
					</p>
					<div className="flex flex-wrap gap-3">
						<Button asChild>
							<a href="mailto:partners@thorbis.com">
								Apply to become a partner
							</a>
						</Button>
						<Button asChild variant="outline">
							<a href="/press">Access partner resources</a>
						</Button>
					</div>
				</section>

				<section className="mt-16 space-y-6">
					<h2 className="text-2xl font-semibold">
						Choose the partnership that fits
					</h2>
					<div className="grid gap-6 md:grid-cols-3">
						{PARTNER_TYPES.map((partner) => (
							<Card key={partner.title}>
								<CardHeader>
									<CardTitle>{partner.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="leading-relaxed">
										{partner.description}
									</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section className="mt-16 space-y-4">
					<h2 className="text-2xl font-semibold">
						Integrations our customers rely on
					</h2>
					<p className="text-muted-foreground text-sm">
						Thorbis integrates with the systems contractors depend on. Our open
						APIs and SDKs let you build deep, reliable connections.
					</p>
					<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
						{INTEGRATIONS.map((integration) => (
							<div
								className="bg-muted/20 text-muted-foreground rounded-xl border p-4 text-sm"
								key={integration}
							>
								{integration}
							</div>
						))}
					</div>
				</section>

				<section className="bg-primary/10 mt-16 rounded-3xl border p-10 text-center">
					<p className="text-muted-foreground text-lg">
						Interested in building on the Thorbis platform? Request access to
						our developer portal, API documentation, and sandbox environment.
					</p>
					<Button asChild className="mt-6" variant="secondary">
						<a href="mailto:partners@thorbis.com?subject=Thorbis%20Developer%20Access">
							Request developer access
						</a>
					</Button>
				</section>
			</div>
		</>
	);
}
