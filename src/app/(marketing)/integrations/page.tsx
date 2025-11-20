"use cache";
export const cacheLife = "marketing";

import Script from "next/script";
import { Suspense } from "react";

import { IntegrationCard } from "@/components/marketing/integration-card";
import { Badge } from "@/components/ui/badge";
import { getAllIntegrations } from "@/lib/marketing/integrations";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const integrationKeywords = generateSemanticKeywords("integrations");

export const metadata = generateSEOMetadata({
	title: "Thorbis Integrations Directory",
	section: "Integrations",
	description:
		"Connect Thorbis with accounting, payments, automation, and analytics tools. Explore native integrations for QuickBooks, Stripe, Zapier, and more.",
	path: "/integrations",
	keywords: [
		"thorbis integrations",
		"field service integrations",
		"quickbooks field service integration",
		"software integrations",
		"api integrations",
		"third-party integrations",
		...integrationKeywords.slice(0, 5),
	],
});

export default async function IntegrationsPage() {
	const integrations = getAllIntegrations();
	const categories = [
		...new Set(integrations.flatMap((integration) => integration.categories)),
	].sort();

	const breadcrumbLd = generateBreadcrumbStructuredData([
		{ name: "Home", url: siteUrl },
		{ name: "Integrations", url: `${siteUrl}/integrations` },
	]);

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
				id="integrations-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="mx-auto mb-14 max-w-3xl space-y-6 text-center">
					<Badge className="tracking-wide uppercase" variant="secondary">
						Integrations Ecosystem
					</Badge>
					<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
						Connect Thorbis to the tools that run your business
					</h1>
					<p className="text-muted-foreground text-lg leading-relaxed">
						Thorbis integrates with leading accounting, payments, marketing, and
						automation platforms. Browse verified integrations and discover new
						ways to streamline back-office work—all included in the $200/month
						base subscription with pay-as-you-go usage and no lock-in.
					</p>
				</header>

				<section className="mb-12 space-y-4 text-center">
					<h2 className="text-lg font-semibold">
						Popular integration categories
					</h2>
					<div className="flex flex-wrap justify-center gap-2">
						{categories.map((category) => (
							<Badge key={category} variant="outline">
								{category}
							</Badge>
						))}
					</div>
				</section>

				<Suspense
					fallback={<div className="text-center">Loading integrations…</div>}
				>
					<section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{integrations.map((integration) => (
							<IntegrationCard
								integration={integration}
								key={integration.slug}
							/>
						))}
					</section>
				</Suspense>
			</div>
		</>
	);
}
