
import Link from "next/link";
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
import { getAllCompetitors } from "@/lib/marketing/competitors";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";
import { createItemListSchema } from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const comparisonKeywords = generateSemanticKeywords("alternatives");

export const metadata = generateSEOMetadata({
	title: "Thorbis vs Legacy Platforms",
	section: "Comparisons",
	description:
		"Compare Thorbis against ServiceTitan, Housecall Pro, Jobber, FieldEdge, ServiceM8, and Workiz. Learn how Thorbis delivers AI-led operations with predictable pricing.",
	path: "/vs",
	keywords: [
		"servicetitan alternative",
		"housecall pro alternative",
		"jobber alternative",
		"fieldedge alternative",
		"field service management comparison",
		"best servicetitan alternative",
		...comparisonKeywords.slice(0, 5),
	],
});

export default function CompetitorOverviewPage() {
	const competitors = getAllCompetitors();

	// ItemList Schema - All competitor comparisons
	const competitorsListSchema = createItemListSchema({
		name: "Thorbis Platform Comparisons",
		description:
			"Detailed comparisons between Thorbis and popular field service management platforms",
		items: competitors.map((competitor) => ({
			name: `Thorbis vs ${competitor.competitorName}`,
			url: `${siteUrl}/vs/${competitor.slug}`,
			description: competitor.summary,
		})),
	});

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Comparisons", url: `${siteUrl}/vs` },
						]),
					),
				}}
				id="competitor-breadcrumb-ld"
				type="application/ld+json"
			/>

			{/* Competitors List Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(competitorsListSchema),
				}}
				id="competitors-list-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="mx-auto mb-14 max-w-3xl text-center">
					<span className="border-border text-primary mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
						Competitive Intelligence
					</span>
					<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
						Choose a partner built for the next decade of field service
					</h1>
					<p className="text-muted-foreground mt-4 text-lg">
						Thorbis delivers AI-powered automation, transparent pricing, and
						rapid innovation. Explore detailed head-to-head comparisons to
						decide if now is the right time to upgrade. Switching means a flat
						$200/month base subscription with pay-as-you-go usage—no per-user
						fees and no lock-in contracts.
					</p>
					<div className="mt-6 flex flex-wrap justify-center gap-3">
						<Button asChild>
							<Link href="/waitlist">Join Waitlist</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/pricing">View Pricing</Link>
						</Button>
					</div>
				</header>

				<div className="grid gap-6 md:grid-cols-2">
					{competitors.map((competitor) => (
						<Card
							className="flex h-full flex-col justify-between transition-shadow hover:shadow-md"
							key={competitor.slug}
						>
							<CardHeader className="space-y-4">
								<div className="text-primary flex items-center gap-3">
									<Badge variant="secondary">{competitor.competitorName}</Badge>
									<span className="text-muted-foreground text-sm">
										vs Thorbis
									</span>
								</div>
								<CardTitle className="text-2xl">
									{competitor.heroTitle}
								</CardTitle>
								<CardDescription>{competitor.summary}</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-4">
								<div>
									<p className="text-muted-foreground text-sm font-medium">
										Ideal for teams who:
									</p>
									<ul className="text-muted-foreground mt-2 space-y-1 text-sm">
										{competitor.idealCustomerProfile.slice(0, 2).map((item) => (
											<li className="flex gap-2" key={item}>
												<span className="text-primary mt-1">•</span>
												<span>{item}</span>
											</li>
										))}
									</ul>
								</div>
								<Button asChild>
									<Link href={`/vs/${competitor.slug}`}>
										Compare with {competitor.competitorName}
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</>
	);
}
