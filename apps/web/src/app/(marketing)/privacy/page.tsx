import Script from "next/script";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const privacyKeywords = generateSemanticKeywords("privacy policy");

export const metadata = generateSEOMetadata({
	title: "Thorbis Privacy Policy",
	description:
		"Learn how Thorbis collects, uses, and protects personal data. Review GDPR compliance, data retention, and contact details.",
	path: "/privacy",
	section: "Legal",
	keywords: [
		"thorbis privacy policy",
		"thorbis data protection",
		"field service privacy compliance",
		"gdpr compliance",
		"data privacy",
		...privacyKeywords.slice(0, 5),
	],
});

const SECTIONS = [
	{
		heading: "1. Overview",
		body: `Thorbis, Inc. (“Thorbis”, “we”, “our”) provides software that helps service
    companies manage operations. This Privacy Policy explains how we collect, process,
    and protect personal information when customers, prospects, and users interact with
    our websites, products, and services.`,
	},
	{
		heading: "2. Information we collect",
		body: `We collect information you provide directly (account creation, support tickets,
    marketing opt-ins) and data generated while using Thorbis (job records, communications,
    integrations). We also use cookies and similar technologies to understand product usage
    and improve the experience.`,
	},
	{
		heading: "3. How we use information",
		body: `Thorbis uses collected data to deliver and improve services, provide support,
    personalize experiences, send relevant communications, and meet legal obligations.
    We never sell customer data and only process it according to contractual terms.`,
	},
	{
		heading: "4. Sharing & subprocessors",
		body: `We share data with trusted subprocessors who enable our platform (hosting,
    analytics, communications). Subprocessors must comply with strict confidentiality,
    security, and GDPR requirements. View the current list at thorbis.com/legal/subprocessors.`,
	},
	{
		heading: "5. Data retention & deletion",
		body: `Customer data is retained for the duration of the contract and deleted or anonymized
    within 60 days of termination unless legal obligations require otherwise. Customers may
    export data at any time and request deletion of personal information.`,
	},
	{
		heading: "6. International transfers",
		body: `Thorbis stores data in the United States and offers EU data residency upon request.
    When data is transferred internationally, we rely on Standard Contractual Clauses and
    additional safeguards to protect personal information.`,
	},
	{
		heading: "7. Your rights",
		body: `Depending on your jurisdiction, you may request access, correction, deletion, or
    restriction of your personal data. Submit privacy requests to privacy@thorbis.com
    and we will respond within applicable timelines.`,
	},
	{
		heading: "8. Contact us",
		body: `For privacy questions or requests, email privacy@thorbis.com or write to Thorbis, Inc.,
    123 Market Street, Suite 500, Austin, TX 78701.`,
	},
];

export default function PrivacyPage() {
	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Privacy Policy", url: `${siteUrl}/privacy` },
						]),
					),
				}}
				id="privacy-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="mb-10 space-y-4">
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
						Thorbis Privacy Policy
					</h1>
					<p className="text-muted-foreground">
						Effective date: January 1, 2025. Thorbis is committed to protecting
						your data and empowering you with transparency and control.
					</p>
				</header>
				<article className="space-y-8">
					{SECTIONS.map((section) => (
						<section className="space-y-2" key={section.heading}>
							<h2 className="text-xl font-semibold">{section.heading}</h2>
							<p className="text-muted-foreground leading-relaxed whitespace-pre-line">
								{section.body}
							</p>
						</section>
					))}
				</article>
			</div>
		</>
	);
}
