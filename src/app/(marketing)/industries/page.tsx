import Link from "next/link";
import Script from "next/script";
import { getMarketingIcon } from "@/components/marketing/marketing-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllIndustries } from "@/lib/marketing/industries";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
	title: "Industries Powered by Thorbis",
	section: "Platform",
	description:
		"Thorbis helps HVAC, plumbing, electrical, cleaning, and other service businesses deliver world-class operations. Explore industry-specific playbooks and best practices.",
	path: "/industries",
	keywords: [
		"field service industries",
		"thorbis industries",
		"service business software by industry",
	],
});

export default function IndustriesOverviewPage() {
	const industries = getAllIndustries();

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Industries", url: `${siteUrl}/industries` },
						])
					),
				}}
				id="industries-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="mx-auto mb-14 max-w-3xl text-center">
					<span className="border-border text-secondary mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
						Built for service leaders
					</span>
					<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
						Industry expertise included with every Thorbis deployment
					</h1>
					<p className="text-muted-foreground mt-4 text-lg">
						Whether you respond to emergency plumbing calls or run recurring landscaping routes,
						Thorbis adapts to your playbooks with proven workflows, automations, and reporting.
						Every industry gets the same transparent pricing—$100/month base plus pay-as-you-go
						usage, unlimited users, and no lock-in contracts.
					</p>
					<div className="mt-6 flex flex-wrap justify-center gap-3">
						<Button asChild>
							<Link href="/register">Create your account</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/case-studies">View customer stories</Link>
						</Button>
					</div>
				</header>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{industries.map((industry) => {
						const Icon = getMarketingIcon(industry.valueProps[0]?.icon ?? "sparkles");
						return (
							<Card
								className="flex h-full flex-col justify-between transition-shadow hover:shadow-md"
								key={industry.slug}
							>
								<CardHeader className="space-y-4">
									<div className="text-secondary flex items-center gap-3">
										<Icon aria-hidden="true" className="size-8" />
										<Badge variant="outline">{industry.name}</Badge>
									</div>
									<CardTitle className="text-2xl">{industry.heroTitle}</CardTitle>
									<CardDescription>{industry.summary}</CardDescription>
								</CardHeader>
								<CardContent className="flex flex-col gap-4">
									<div>
										<p className="text-muted-foreground text-sm font-medium">
											Specialities we support
										</p>
										<div className="mt-2 flex flex-wrap gap-2">
											{industry.fieldTypes.slice(0, 3).map((type) => (
												<Badge key={type} variant="secondary">
													{type}
												</Badge>
											))}
										</div>
									</div>
									<div>
										<p className="text-muted-foreground text-sm font-medium">Sample results</p>
										<p className="text-muted-foreground text-sm">
											{industry.stats[0]?.label}: {industry.stats[0]?.value}
										</p>
									</div>
									<Button asChild>
										<Link href={`/industries/${industry.slug}`}>Explore {industry.name}</Link>
									</Button>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</>
	);
}
