import Script from "next/script";
import { ModernHomepage } from "@/components/home/modern-homepage";
import { SEO_URLS } from "@/lib/seo/config";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { createOrganizationSchema, createReviewAggregateSchema, createWebsiteSchema } from "@/lib/seo/structured-data";

export const metadata = generateSEOMetadata({
	title: "Modern Business Management Platform",
	description:
		"Thorbis is the $100/month pay-as-you-go platform built for service companies. Manage customers, jobs, invoices, equipment, and more with our all-in-one solution.",
	path: "/",
	imageAlt: "Thorbis platform dashboard preview",
	keywords: [
		"business management",
		"field service management",
		"service company software",
		"customer management",
		"job scheduling",
		"invoice management",
		"service business software",
	],
});

export default function Home() {
	return (
		<>
			{/* Organization and WebSite Structured Data */}
			<Script id="thorbis-organization-schema" strategy="afterInteractive" type="application/ld+json">
				{JSON.stringify(
					createOrganizationSchema({
						sameAs: ["https://www.linkedin.com/company/thorbis", "https://twitter.com/thorbis"],
					})
				)}
			</Script>
			<Script id="thorbis-website-schema" strategy="afterInteractive" type="application/ld+json">
				{JSON.stringify(createWebsiteSchema())}
			</Script>
			<Script id="thorbis-review-schema" strategy="afterInteractive" type="application/ld+json">
				{JSON.stringify(
					createReviewAggregateSchema({
						item: {
							name: "Thorbis Field Management Platform",
							url: SEO_URLS.site,
							type: "SoftwareApplication",
						},
						ratingValue: 4.9,
						reviewCount: 327,
					})
				)}
			</Script>
			<ModernHomepage />
		</>
	);
}
