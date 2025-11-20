"use cache";
export const cacheLife = "static";

import Script from "next/script";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const termsKeywords = generateSemanticKeywords("terms of service");

export const metadata = generateSEOMetadata({
	title: "Thorbis Terms of Service",
	description:
		"Read the Thorbis terms of service governing use of the platform, subscription commitments, and support obligations.",
	path: "/terms",
	section: "Legal",
	keywords: [
		"thorbis terms",
		"thorbis agreement",
		"field service software terms",
		"terms of service",
		"service agreement",
		...termsKeywords.slice(0, 5),
	],
});

const SECTIONS = [
	{
		heading: "1. Agreement",
		body: `These Terms of Service (“Terms”) govern your use of Thorbis products and services.
    By subscribing, you agree to these Terms on behalf of your organization. These Terms
    incorporate the order form, privacy policy, and applicable data processing agreements.`,
	},
	{
		heading: "2. Subscription & fees",
		body: `Subscriptions renew automatically unless otherwise stated on the order form. Fees are
    invoiced annually or monthly in advance. You are responsible for applicable taxes. Late
    payments may incur finance charges or suspension.`,
	},
	{
		heading: "3. Acceptable use",
		body: `You agree not to misuse Thorbis for unlawful activities, reverse engineer the software,
    or attempt to access other customers’ data. Thorbis may suspend access for violations
    after providing notice.`,
	},
	{
		heading: "4. Data ownership",
		body: `You retain ownership of your data. Thorbis processes data solely to provide the services.
    Upon termination, you may export data within 30 days. Afterwards Thorbis deletes or
    anonymizes customer data, subject to legal retention requirements.`,
	},
	{
		heading: "5. Confidentiality & security",
		body: `Both parties agree to protect confidential information. Thorbis implements industry-standard
    security measures and will notify you of any incident affecting your data.`,
	},
	{
		heading: "6. Warranties & disclaimers",
		body: `Thorbis warrants it will provide services in a professional manner. Except as stated, the
    services are provided “as is” without additional warranties. Thorbis’ total liability is
    limited to fees paid in the prior twelve months.`,
	},
	{
		heading: "7. Termination",
		body: `Either party may terminate the agreement for breach if not cured within 30 days of notice.
    You may also terminate for convenience as outlined in the order form. Upon termination,
    you remain responsible for outstanding fees.`,
	},
	{
		heading: "8. Governing law",
		body: `These Terms are governed by the laws of the State of Texas, USA, without regard to conflict
    of law principles. Disputes will be resolved in state or federal courts located in Austin, TX.`,
	},
	{
		heading: "9. Contact",
		body: "Questions about these Terms? Contact legal@thorbis.com.",
	},
];

export default function TermsPage() {
	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Terms of Service", url: `${siteUrl}/terms` },
						]),
					),
				}}
				id="terms-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="mb-10 space-y-4">
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
						Thorbis Terms of Service
					</h1>
					<p className="text-muted-foreground">
						Effective date: January 1, 2025. These Terms outline customer
						responsibilities and Thorbis obligations. Please review carefully.
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
