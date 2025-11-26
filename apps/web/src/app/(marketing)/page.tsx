import Script from "next/script";
import { LinearHomepage } from "@/components/marketing/linear-homepage";
import { createSpeakableSchema } from "@/lib/seo/advanced-schemas";
import { SEO_URLS } from "@/lib/seo/config";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";
import {
	createItemListSchema,
	createOrganizationSchema,
	createProductSchema,
	createReviewAggregateSchema,
	createWebsiteSchema,
} from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration
// This page is fully static - no dynamic data, database queries, or user-specific content
// Next.js will statically generate this at build time for instant loading in production

// Generate semantic keywords for better AI understanding
const primaryKeyword = "field service management";
const semanticKeywords = generateSemanticKeywords(primaryKeyword);

export const metadata = generateSEOMetadata({
	title: "Field Service Management Software - $200/mo",
	description:
		"AI-powered field service management at $200/month. Smart scheduling, automated invoicing, customer portal, and mobile app for service businesses. 60-80% less than ServiceTitan.",
	path: "/",
	imageAlt: "Thorbis field service management platform dashboard",
	keywords: [
		primaryKeyword,
		...semanticKeywords.slice(0, 10), // Top 10 semantic keywords
		"business management software",
		"HVAC software",
		"plumbing software",
		"electrical contractor software",
	],
});

export default function Home() {
	// Product Schema - Critical for Google Shopping and AI Overviews
	const productSchema = createProductSchema({
		name: "Thorbis Field Service Management Platform",
		description:
			"Complete field service management software with AI-powered scheduling, automated invoicing, customer portal, and mobile app. Starting at $200/month with pay-as-you-go pricing.",
		offers: {
			price: "200",
			priceCurrency: "USD",
			availability: "InStock",
			url: `${SEO_URLS.site}/pricing`,
			billingInterval: "MONTH",
			priceValidUntil: "2025-12-31",
		},
		aggregateRating: {
			ratingValue: 4.9,
			reviewCount: 327,
			bestRating: 5,
		},
		image: `${SEO_URLS.site}/og-image.png`,
		category: "BusinessApplication",
	});

	// ItemList Schema - Key Features for AI understanding
	const featuresListSchema = createItemListSchema({
		name: "Thorbis Core Features",
		description: "Complete feature set for field service businesses",
		items: [
			{
				name: "Smart Scheduling & Dispatch",
				url: `${SEO_URLS.site}/features/scheduling`,
				description:
					"AI-powered scheduling with route optimization and automated dispatch",
				image: `${SEO_URLS.site}/images/scheduling.png`,
			},
			{
				name: "Automated Invoicing",
				url: `${SEO_URLS.site}/features/invoicing`,
				description:
					"Generate, send, and track invoices automatically with payment processing",
				image: `${SEO_URLS.site}/images/invoicing.png`,
			},
			{
				name: "Customer Relationship Management",
				url: `${SEO_URLS.site}/features/crm`,
				description:
					"Complete customer database with history, notes, and communication tracking",
				image: `${SEO_URLS.site}/images/crm.png`,
			},
			{
				name: "Customer Portal",
				url: `${SEO_URLS.site}/features/customer-portal`,
				description:
					"Self-service portal for customers to book, pay, and track jobs",
				image: `${SEO_URLS.site}/images/portal.png`,
			},
			{
				name: "Mobile App",
				url: `${SEO_URLS.site}/features/mobile-app`,
				description: "Native iOS and Android apps for technicians in the field",
				image: `${SEO_URLS.site}/images/mobile.png`,
			},
			{
				name: "AI Assistant",
				url: `${SEO_URLS.site}/features/ai-assistant`,
				description:
					"AI-powered phone answering and customer support automation",
				image: `${SEO_URLS.site}/images/ai.png`,
			},
		],
	});

	// Speakable Schema - Voice search optimization
	// Targets key sections for Google Assistant, Alexa, Siri
	const speakableSchema = createSpeakableSchema([
		"[data-speakable='hero']",
		"[data-speakable='intro']",
		"[data-speakable='value-prop']",
	]);

	return (
		<>
			{/* Organization and WebSite Structured Data */}
			<Script
				id="thorbis-organization-schema"
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(
					createOrganizationSchema({
						sameAs: [
							"https://www.linkedin.com/company/thorbis",
							"https://twitter.com/thorbis",
						],
					}),
				)}
			</Script>
			<Script
				id="thorbis-website-schema"
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(createWebsiteSchema())}
			</Script>

			{/* Product Schema - For Google Shopping & AI Overviews */}
			<Script
				id="thorbis-product-schema"
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(productSchema)}
			</Script>

			{/* ItemList Schema - Features for AI understanding */}
			<Script
				id="thorbis-features-list-schema"
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(featuresListSchema)}
			</Script>

			{/* Review Aggregate Schema */}
			<Script
				id="thorbis-review-schema"
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(
					createReviewAggregateSchema({
						item: {
							name: "Thorbis Field Management Platform",
							url: SEO_URLS.site,
							type: "SoftwareApplication",
						},
						ratingValue: 4.9,
						reviewCount: 327,
					}),
				)}
			</Script>

			{/* Speakable Schema - Voice search optimization */}
			<Script
				id="thorbis-speakable-schema"
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(speakableSchema)}
			</Script>

			<LinearHomepage />
		</>
	);
}
