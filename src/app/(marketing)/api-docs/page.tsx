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
	generateFAQStructuredData,
	generateMetadata as generateSEOMetadata,
	generateServiceStructuredData,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const apiKeywords = generateSemanticKeywords("api documentation");

export const metadata = generateSEOMetadata({
	title: "Thorbis API Documentation",
	description:
		"Build on the Thorbis platform with secure REST and GraphQL APIs. Access authentication guides, webhooks, and developer tooling.",
	path: "/api-docs",
	section: "Resources",
	keywords: [
		"thorbis api",
		"thorbis developer docs",
		"field service api",
		"thorbis webhooks",
		"api documentation",
		"developer api",
		...apiKeywords.slice(0, 5),
	],
});

const FAQ_DATA = [
	{
		question: "Where can I access the Thorbis API reference?",
		answer:
			"Visit developer.thorbis.com for the full OpenAPI specification, SDK downloads, and interactive console.",
	},
	{
		question: "How do I authenticate?",
		answer:
			"Thorbis uses OAuth 2.0 with client credentials. Create an integration in the Thorbis dashboard to generate client ID and secret.",
	},
	{
		question: "Does Thorbis support webhooks?",
		answer:
			"Yes. Subscribe to events like job.created, invoice.updated, or customer.signed for near real-time updates.",
	},
];

const RESOURCES = [
	{
		title: "Quickstart Guide",
		description:
			"Spin up a Thorbis API client in under 10 minutes with sample requests and Postman collections.",
		action: {
			label: "View quickstart",
			href: "https://developer.thorbis.com/quickstart",
		},
	},
	{
		title: "Authentication Reference",
		description:
			"Learn how to generate OAuth tokens, refresh credentials, and scope access for your integrations.",
		action: {
			label: "Read auth guide",
			href: "https://developer.thorbis.com/authentication",
		},
	},
	{
		title: "Webhooks & Events",
		description:
			"Subscribe to job lifecycle, payment, and scheduling events. Includes retry policies and signing secrets.",
		action: {
			label: "Browse events",
			href: "https://developer.thorbis.com/webhooks",
		},
	},
];

export default function ApiDocsPage() {
	const breadcrumbLd = generateBreadcrumbStructuredData([
		{ name: "Home", url: siteUrl },
		{ name: "API Documentation", url: `${siteUrl}/api-docs` },
	]);

	const serviceLd = generateServiceStructuredData({
		name: "Thorbis Developer Platform",
		description:
			"REST and GraphQL APIs for connecting Thorbis with CRMs, ERPs, analytics platforms, and internal tools.",
		serviceType: "Field Service API",
	});

	const faqLd = generateFAQStructuredData(FAQ_DATA);

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
				id="api-docs-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
				id="api-docs-service-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
				id="api-docs-faq-ld"
				type="application/ld+json"
			/>

			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="max-w-3xl space-y-6">
					<Badge className="tracking-wide uppercase" variant="secondary">
						Developer Platform
					</Badge>
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
						Thorbis API Documentation
					</h1>
					<p className="text-muted-foreground text-lg leading-relaxed">
						Build integrations that automate workflows, surface analytics, and
						keep your tech stack in sync. Thorbis provides secure REST and
						GraphQL endpoints with robust webhooks and SDK support.
					</p>
					<div className="flex flex-wrap gap-3">
						<Button asChild size="lg">
							<a
								href="https://developer.thorbis.com"
								rel="noopener"
								target="_blank"
							>
								Open developer portal
							</a>
						</Button>
						<Button asChild size="lg" variant="outline">
							<a
								href="mailto:partners@thorbis.com?subject=Thorbis%20API%20Access"
								rel="noopener"
								target="_blank"
							>
								Request sandbox keys
							</a>
						</Button>
					</div>
				</header>

				<section className="mt-16 space-y-6">
					<h2 className="text-2xl font-semibold">Start shipping faster</h2>
					<div className="grid gap-6 md:grid-cols-3">
						{RESOURCES.map((resource) => (
							<Card key={resource.title}>
								<CardHeader>
									<CardTitle>{resource.title}</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<CardDescription className="leading-relaxed">
										{resource.description}
									</CardDescription>
									<Button asChild variant="outline">
										<a
											href={resource.action.href}
											rel="noopener"
											target="_blank"
										>
											{resource.action.label}
										</a>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section className="mt-16 space-y-4">
					<h2 className="text-2xl font-semibold">Key capabilities</h2>
					<ul className="text-muted-foreground space-y-2 text-sm leading-relaxed">
						<li>
							• Comprehensive REST endpoints for customers, jobs, schedules,
							invoices, payments, and equipment.
						</li>
						<li>
							• Real-time webhooks with configurable retry policies and signing
							secrets for verification.
						</li>
						<li>
							• SDKs for TypeScript, Python, and Go plus OpenAPI specs for
							generated clients.
						</li>
						<li>
							• Robust rate limits, audit logging, and scoped OAuth permissions
							to keep integrations secure.
						</li>
					</ul>
				</section>

				<section className="mt-16 space-y-4">
					<h2 className="text-2xl font-semibold">Frequently asked questions</h2>
					<div className="grid gap-4 md:grid-cols-3">
						{FAQ_DATA.map((item) => (
							<Card key={item.question}>
								<CardHeader>
									<CardTitle className="text-base">{item.question}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-sm leading-relaxed">
										{item.answer}
									</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			</div>
		</>
	);
}
