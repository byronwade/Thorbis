import Script from "next/script";
import { generateBreadcrumbStructuredData, generateMetadata as generateSEOMetadata, siteUrl } from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
	title: "Thorbis Cookie Policy",
	description:
		"Understand how Thorbis uses cookies and similar technologies on our websites and apps. Manage your preferences.",
	path: "/cookies",
	section: "Legal",
	keywords: ["thorbis cookies", "thorbis cookie policy", "thorbis tracking technologies"],
});

const SECTIONS = [
	{
		heading: "1. What are cookies?",
		body: `Cookies are small text files stored on your device that help Thorbis deliver a secure,
    personalized experience. We use first-party and third-party cookies for analytics,
    support, and marketing.`,
	},
	{
		heading: "2. Types of cookies we use",
		body: `Essential cookies enable login, security, and core product features. Analytics cookies
    help us improve the platform. Marketing cookies personalize campaigns and measure
    effectiveness. You can opt out of non-essential cookies at any time.`,
	},
	{
		heading: "3. Managing preferences",
		body: `Use the cookie banner or visit thorbis.com/cookie-settings to adjust preferences.
    Most browsers also allow you to block or delete cookies. Disabling essential cookies may
    impact product functionality.`,
	},
	{
		heading: "4. Updates",
		body: `We update this policy as features evolve. The effective date will always reflect the
    latest version. Questions? Email privacy@thorbis.com.`,
	},
];

export default function CookiesPage() {
	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Cookie Policy", url: `${siteUrl}/cookies` },
						])
					),
				}}
				id="cookies-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="mb-10 space-y-4">
					<h1 className="font-bold text-4xl tracking-tight sm:text-5xl">Thorbis Cookie Policy</h1>
					<p className="text-muted-foreground">
						Effective date: January 1, 2025. We explain how cookies support security, analytics, and personalization
						across Thorbis experiences.
					</p>
				</header>
				<article className="space-y-8">
					{SECTIONS.map((section) => (
						<section className="space-y-2" key={section.heading}>
							<h2 className="font-semibold text-xl">{section.heading}</h2>
							<p className="whitespace-pre-line text-muted-foreground leading-relaxed">{section.body}</p>
						</section>
					))}
				</article>
			</div>
		</>
	);
}
