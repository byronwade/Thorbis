
import { notFound } from "next/navigation";
import Script from "next/script";

import { IntegrationPage } from "@/components/marketing/integration-page";
import {
	getAllIntegrations,
	getIntegrationBySlug,
	getRelatedIntegrations,
} from "@/lib/marketing/integrations";
import {
	generateBreadcrumbStructuredData,
	generateFAQStructuredData,
	generateMetadata as generateSEOMetadata,
	generateServiceStructuredData,
	siteUrl,
} from "@/lib/seo/metadata";

// Note: Caching is controlled by next.config.ts cacheLife configuration

type IntegrationPageProps = {
	params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
	return getAllIntegrations().map((integration) => ({
		slug: integration.slug,
	}));
}

export async function generateMetadata({ params }: IntegrationPageProps) {
	const { slug } = await params;
	const integration = getIntegrationBySlug(slug);

	if (!integration) {
		return {};
	}

	return generateSEOMetadata({
		title: integration.seo.title,
		section: "Integrations",
		description: integration.seo.description,
		path: `/integrations/${integration.slug}`,
		image: integration.seo.image,
		keywords: integration.seo.keywords,
	});
}

export default async function IntegrationDetailPage({
	params,
}: IntegrationPageProps) {
	const { slug } = await params;
	const integration = getIntegrationBySlug(slug);

	if (!integration) {
		notFound();
	}

	const related = getRelatedIntegrations(slug);

	const breadcrumbLd = generateBreadcrumbStructuredData([
		{ name: "Home", url: siteUrl },
		{ name: "Integrations", url: `${siteUrl}/integrations` },
		{
			name: integration.name,
			url: `${siteUrl}/integrations/${integration.slug}`,
		},
	]);

	const serviceLd = generateServiceStructuredData({
		name: `${integration.name} Integration`,
		description: integration.summary,
		serviceType: "SoftwareIntegration",
		offers: [
			{
				price: "Included",
				currency: "USD",
				description: "Available on Thorbis Growth plan and above.",
			},
		],
	});

	const faqLd = generateFAQStructuredData(integration.faq);

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
				id="integration-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
				id="integration-service-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
				id="integration-faq-ld"
				type="application/ld+json"
			/>

			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<IntegrationPage integration={integration} related={related} />
			</div>
		</>
	);
}
