
import { notFound } from "next/navigation";
import Script from "next/script";

import { CompetitorPage } from "@/components/marketing/competitor-page";
import {
	getAllCompetitors,
	getCompetitorBySlug,
} from "@/lib/marketing/competitors";
import {
	generateBreadcrumbStructuredData,
	generateFAQStructuredData,
	generateMetadata as generateSEOMetadata,
	generateServiceStructuredData,
	siteUrl,
} from "@/lib/seo/metadata";

// Note: Caching is controlled by next.config.ts cacheLife configuration

type CompetitorPageProps = {
	params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
	return getAllCompetitors().map((competitor) => ({ slug: competitor.slug }));
}

export async function generateMetadata({ params }: CompetitorPageProps) {
	const { slug } = await params;
	const competitor = getCompetitorBySlug(slug);

	if (!competitor) {
		return {};
	}

	return generateSEOMetadata({
		title: competitor.seo.title,
		section: "Comparisons",
		description: competitor.seo.description,
		path: `/vs/${competitor.slug}`,
		keywords: competitor.seo.keywords,
	});
}

export default async function CompetitorDetailPage({
	params,
}: CompetitorPageProps) {
	const { slug } = await params;
	const competitor = getCompetitorBySlug(slug);

	if (!competitor) {
		notFound();
	}

	const faqStructuredData = generateFAQStructuredData(competitor.faq);
	const serviceStructuredData = generateServiceStructuredData({
		name: `${competitor.competitorName} Alternative`,
		description: competitor.summary,
		offers: [
			{
				price: "Custom",
				currency: "USD",
				description:
					"AI-powered field management platform tailored to your team.",
			},
		],
	});

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Comparisons", url: `${siteUrl}/vs` },
							{
								name: `Thorbis vs ${competitor.competitorName}`,
								url: `${siteUrl}/vs/${competitor.slug}`,
							},
						]),
					),
				}}
				id="comparison-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceStructuredData),
				}}
				id="comparison-service-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqStructuredData),
				}}
				id="comparison-faq-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<CompetitorPage competitor={competitor} />
			</div>
		</>
	);
}
