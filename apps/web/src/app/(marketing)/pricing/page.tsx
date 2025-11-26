import Script from "next/script";
import { ModernPricing } from "@/components/pricing/modern-pricing";
import { SEO_URLS } from "@/lib/seo/config";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";
import {
	createFAQSchema,
	createProductSchema,
	createReviewAggregateSchema,
	createServiceSchema,
	createSoftwareApplicationSchema,
} from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration
// Marketing content uses the "default" cache profile (15 min revalidation)

// Generate semantic keywords for pricing context
const pricingKeywords = generateSemanticKeywords("field service management");

export const metadata = generateSEOMetadata({
	title: "Pricing - $200/mo Field Service Software",
	section: "Plans",
	description:
		"Transparent field service management pricing at $200/month base + pay-as-you-go. No per-user fees, no contracts. Save 70-85% vs ServiceTitan, Housecall Pro, and Jobber.",
	path: "/pricing",
	imageAlt: "Thorbis pricing comparison - $200/month vs competitors",
	keywords: [
		"field service management pricing",
		"service software cost",
		"no per user fees",
		"pay as you go pricing",
		...pricingKeywords.slice(0, 8),
		"vs ServiceTitan pricing",
		"vs Housecall Pro pricing",
		"affordable field service software",
	],
});

export default function PricingPage() {
	// Product Schema - Enhanced for AI Overviews
	const productSchema = createProductSchema({
		name: "Thorbis Field Service Management Platform",
		description:
			"Pay-as-you-go field service management software. $200/month base fee includes unlimited users, scheduling, invoicing, CRM, mobile app, and customer portal. Additional AI features billed by usage.",
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

	// FAQ Schema - Common pricing questions for AI Overviews
	const faqSchema = createFAQSchema([
		{
			question: "How much does Thorbis cost?",
			answer:
				"Thorbis costs $200/month base fee with pay-as-you-go usage pricing. This includes unlimited users, scheduling, invoicing, CRM, mobile app, and customer portal. Small teams (3 techs) typically pay $269/month total, medium teams (7 techs) pay $368/month, large teams (30 techs) pay $1,063/month, and enterprises (100+ techs) pay $3,897/month depending on usage.",
		},
		{
			question: "Are there per-user fees?",
			answer:
				"No, Thorbis has no per-user fees. Add unlimited team members at no extra cost. You only pay the $200/month base fee plus usage for features like emails ($0.0003 each), text messages ($0.024 each), phone calls ($0.012-0.03/minute), AI assistance ($0.15-0.18 per use), and storage ($0.27/GB).",
		},
		{
			question: "What's included in the $200/month base price?",
			answer:
				"The base price includes scheduling, dispatch, invoicing, payments, CRM, customer portal, mobile app, estimates, contracts, equipment tracking, inventory management, and unlimited users. All core business features are included.",
		},
		{
			question: "How does Thorbis pricing compare to ServiceTitan?",
			answer:
				"Thorbis is 70-85% less expensive than ServiceTitan. ServiceTitan costs $259+ per technician per month ($3,108/year minimum), while Thorbis costs $200/month flat plus usage, typically totaling $269-$3,897/month for most businesses regardless of team size.",
		},
		{
			question: "Is there a contract or commitment?",
			answer:
				"No long-term contracts required. Thorbis offers annual agreements with monthly payment options, and you can cancel anytime. No early termination fees or hidden costs.",
		},
		{
			question: "What are the usage-based costs?",
			answer:
				"All usage is charged at cost + 200% markup: Emails $0.0003 each, Text messages $0.024 each, Incoming calls $0.012/minute, Outgoing calls $0.03/minute, AI chat $0.15 per conversation, AI phone answering $0.18/minute, Photo storage $0.27/GB uploaded, and Automation $9/month.",
		},
	]);

	return (
		<>
			{/* Product Schema - Primary pricing information */}
			<Script
				id="pricing-product-schema"
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(productSchema)}
			</Script>

			{/* FAQ Schema - Common pricing questions */}
			<Script
				id="pricing-faq-schema"
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(faqSchema)}
			</Script>

			{/* SoftwareApplication Schema */}
			<Script
				id="pricing-software-schema"
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(
					createSoftwareApplicationSchema({
						price: {
							amount: "200",
							currency: "USD",
							billingInterval: "MONTH",
						},
						rating: {
							ratingValue: "4.9",
							reviewCount: "327",
							bestRating: "5",
						},
						operatingSystems: ["Web", "iOS", "Android"],
					}),
				)}
			</Script>

			{/* Service Schema - Pricing tiers */}
			<Script
				id="pricing-service-schema"
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(
					createServiceSchema({
						name: "Thorbis Field Management Platform",
						description:
							"Comprehensive business management solution for service companies including customer management, job scheduling, invoicing, and more.",
						areaServed: ["United States", "Canada"],
						offers: [
							{
								price: "200",
								currency: "USD",
								description:
									"Base platform – unlimited users with all core features",
							},
						],
					}),
				)}
			</Script>

			{/* Review Aggregate Schema */}
			<Script
				id="pricing-review-schema"
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(
					createReviewAggregateSchema({
						item: {
							name: "Thorbis Field Management Platform",
							url: `${SEO_URLS.site}/pricing`,
							type: "SoftwareApplication",
						},
						ratingValue: 4.9,
						reviewCount: 327,
					}),
				)}
			</Script>

			<ModernPricing />
		</>
	);
}
