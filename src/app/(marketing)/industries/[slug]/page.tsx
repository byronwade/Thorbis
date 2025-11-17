import { notFound } from "next/navigation";
import Script from "next/script";

import { IndustryPage } from "@/components/marketing/industry-page";
import { getAllIndustries, getIndustryBySlug } from "@/lib/marketing/industries";
import {
	generateBreadcrumbStructuredData,
	generateFAQStructuredData,
	generateMetadata as generateSEOMetadata,
	generateServiceStructuredData,
	siteUrl,
} from "@/lib/seo/metadata";

type IndustryPageProps = {
	params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
	return getAllIndustries().map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: IndustryPageProps) {
	const { slug } = await params;
	const industry = getIndustryBySlug(slug);

	if (!industry) {
		return {};
	}

	return generateSEOMetadata({
		title: industry.seo.title,
		section: "Industries",
		description: industry.seo.description,
		path: `/industries/${industry.slug}`,
		image: industry.seo.image,
		keywords: industry.seo.keywords,
	});
}

export default async function IndustryDetailPage({ params }: IndustryPageProps) {
	const { slug } = await params;
	const industry = getIndustryBySlug(slug);

	if (!industry) {
		notFound();
	}

	const faqStructuredData = generateFAQStructuredData(industry.faq);
	const serviceStructuredData = generateServiceStructuredData({
		name: `${industry.name} Software`,
		description: industry.seo.description,
		areaServed: ["United States", "Canada"],
		offers: [
			{
				price: "Custom",
				currency: "USD",
				description: "Thorbis industry deployment tailored to your operation.",
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
							{ name: "Industries", url: `${siteUrl}/industries` },
							{
								name: industry.name,
								url: `${siteUrl}/industries/${industry.slug}`,
							},
						])
					),
				}}
				id="industry-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceStructuredData),
				}}
				id="industry-service-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqStructuredData),
				}}
				id="industry-faq-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<IndustryPage industry={industry} />
			</div>
		</>
	);
}
