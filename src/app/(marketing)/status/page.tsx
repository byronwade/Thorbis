"use cache";
export const cacheLife = "static";

import Script from "next/script";

import { Button } from "@/components/ui/button";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const statusKeywords = generateSemanticKeywords("status");

export const metadata = generateSEOMetadata({
	title: "Thorbis System Status",
	description:
		"View real-time uptime information for Thorbis services, APIs, and integrations.",
	path: "/status",
	section: "Company",
	keywords: [
		"thorbis status",
		"thorbis uptime",
		"thorbis service status",
		"system status",
		"service uptime",
		"system health",
		...statusKeywords.slice(0, 5),
	],
});

export default function StatusPage() {
	const statusUrl = "https://status.thorbis.com";

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "System Status", url: `${siteUrl}/status` },
						]),
					),
				}}
				id="status-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
					Thorbis System Status
				</h1>
				<p className="text-muted-foreground mt-4 text-lg">
					We monitor uptime and incident history for the Thorbis platform. Visit
					our status page for real-time updates.
				</p>
				<Button asChild className="mt-6" size="lg" variant="secondary">
					<a href={statusUrl} rel="noopener" target="_blank">
						Open status.thorbis.com
					</a>
				</Button>
			</div>
		</>
	);
}
