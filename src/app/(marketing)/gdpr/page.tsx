
import Script from "next/script";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const gdprKeywords = generateSemanticKeywords("gdpr");

export const metadata = generateSEOMetadata({
	title: "Thorbis GDPR Commitment",
	description:
		"Review Thorbis GDPR compliance, data processing agreements, and how we support EU data subjects.",
	path: "/gdpr",
	section: "Legal",
	keywords: [
		"thorbis gdpr",
		"thorbis dpa",
		"thorbis data protection",
		"eu compliance",
		"data processing agreement",
		...gdprKeywords.slice(0, 5),
	],
});

const SECTIONS = [
	{
		heading: "Lawful basis & data minimization",
		body: `Thorbis processes personal data only under lawful bases (contract, consent,
    legitimate interest). We collect the minimum data required to deliver our services
    and retain it only as long as necessary.`,
	},
	{
		heading: "Data subject rights",
		body: `EU data subjects may request access, rectification, deletion, portability, or restriction
    of their data. Submit requests to privacy@thorbis.com. We respond within 30 days.`,
	},
	{
		heading: "Subprocessors & SCCs",
		body: `Thorbis leverages vetted subprocessors who sign Data Processing Agreements and Standard
    Contractual Clauses. View the subprocessors list at thorbis.com/legal/subprocessors.`,
	},
	{
		heading: "Data residency",
		body: `Thorbis stores data in the United States by default and offers EU data residency upon
    request for customers with EU operations.`,
	},
	{
		heading: "Contact details",
		body: `Data Protection Officer: privacy@thorbis.com. Postal address: Thorbis, Inc., 123 Market Street,
    Suite 500, Austin, TX 78701.`,
	},
];

export default function GDPRPage() {
	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "GDPR", url: `${siteUrl}/gdpr` },
						]),
					),
				}}
				id="gdpr-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="mb-10 space-y-4">
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
						Thorbis & GDPR
					</h1>
					<p className="text-muted-foreground">
						Thorbis is committed to meeting GDPR requirements and empowering
						customers with transparency and control over personal data.
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
