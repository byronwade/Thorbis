import Script from "next/script";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
	title: "Thorbis Accessibility Statement",
	description:
		"Learn about Thorbis’ commitment to accessibility and how to report issues or request accommodations.",
	path: "/accessibility",
	section: "Legal",
	keywords: [
		"thorbis accessibility",
		"accessible field service software",
		"thorbis ada compliance",
	],
});

const SECTIONS = [
	{
		heading: "Commitment",
		body: `Thorbis is committed to providing accessible products and experiences for all users.
    Our goal is to comply with WCAG 2.1 AA guidelines across web and mobile interfaces.`,
	},
	{
		heading: "Continuous improvement",
		body: `We partner with accessibility experts, conduct audits, and include accessibility checks
    in our design and development process. Feedback from customers is essential to improving.`,
	},
	{
		heading: "Request assistance",
		body: `If you encounter accessibility barriers or need accommodations, email accessibility@thorbis.com
    or call +1 (415) 555-0134. We respond within one business day.`,
	},
];

export default function AccessibilityPage() {
	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Accessibility", url: `${siteUrl}/accessibility` },
						]),
					),
				}}
				id="accessibility-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="mb-10 space-y-4">
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
						Accessibility Statement
					</h1>
					<p className="text-muted-foreground">
						Thorbis strives to deliver inclusive experiences across our platform
						and customer touchpoints. Accessibility is an ongoing priority.
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
