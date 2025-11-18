import Link from "next/link";
import Script from "next/script";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
	title: "Thorbis HTML Sitemap",
	description:
		"Browse Thorbis marketing, product, and support pages from a single sitemap.",
	path: "/sitemap",
	section: "Company",
	keywords: [
		"thorbis sitemap",
		"thorbis site map",
		"field service software pages",
	],
});

const LINK_SECTIONS = [
	{
		heading: "Product",
		links: [
			{ label: "Features overview", href: "/features" },
			{ label: "AI Assistant", href: "/features/ai-assistant" },
			{ label: "CRM", href: "/features/crm" },
			{ label: "Scheduling & dispatch", href: "/features/scheduling" },
			{ label: "Technician mobile", href: "/features/mobile-app" },
			{ label: "Invoicing & payments", href: "/features/invoicing" },
		],
	},
	{
		heading: "Industries",
		links: [
			{ label: "HVAC", href: "/industries/hvac" },
			{ label: "Plumbing", href: "/industries/plumbing" },
			{ label: "Electrical", href: "/industries/electrical" },
			{ label: "Landscaping", href: "/industries/landscaping" },
			{ label: "Pest Control", href: "/industries/pest-control" },
			{ label: "Garage Door", href: "/industries/garage-door" },
		],
	},
	{
		heading: "Comparisons",
		links: [
			{ label: "Thorbis vs ServiceTitan", href: "/vs/servicetitan" },
			{ label: "Thorbis vs Housecall Pro", href: "/vs/housecall-pro" },
			{ label: "Thorbis vs Jobber", href: "/vs/jobber" },
			{ label: "Thorbis vs FieldEdge", href: "/vs/fieldedge" },
			{ label: "Thorbis vs ServiceM8", href: "/vs/servicem8" },
			{ label: "Thorbis vs Workiz", href: "/vs/workiz" },
		],
	},
	{
		heading: "Company",
		links: [
			{ label: "About", href: "/about" },
			{ label: "Careers", href: "/careers" },
			{ label: "Partners", href: "/partners" },
			{ label: "Press", href: "/press" },
			{ label: "Contact", href: "/contact" },
			{ label: "Security", href: "/security" },
		],
	},
	{
		heading: "Resources",
		links: [
			{ label: "Blog", href: "/blog" },
			{ label: "Help Center", href: "/help" },
			{ label: "Case Studies", href: "/case-studies" },
			{ label: "Webinars", href: "/webinars" },
			{ label: "Templates", href: "/templates" },
			{ label: "Knowledge Base Feed", href: "/kb/feed" },
		],
	},
	{
		heading: "Legal",
		links: [
			{ label: "Privacy Policy", href: "/privacy" },
			{ label: "Terms of Service", href: "/terms" },
			{ label: "Cookie Policy", href: "/cookies" },
			{ label: "GDPR Commitment", href: "/gdpr" },
			{ label: "Accessibility", href: "/accessibility" },
		],
	},
];

export default function SitemapPage() {
	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Sitemap", url: `${siteUrl}/sitemap` },
						]),
					),
				}}
				id="sitemap-breadcrumb-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="mb-10 space-y-4">
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
						Thorbis Sitemap
					</h1>
					<p className="text-muted-foreground">
						Quickly browse major Thorbis pages. For XML sitemaps used by search
						engines, visit /kb/sitemap.xml and /seo/thorbis-sitemap.xml.
					</p>
				</header>
				<div className="grid gap-8 md:grid-cols-3">
					{LINK_SECTIONS.map((section) => (
						<section className="space-y-3" key={section.heading}>
							<h2 className="text-lg font-semibold">{section.heading}</h2>
							<ul className="text-muted-foreground space-y-2 text-sm">
								{section.links.map((link) => (
									<li key={link.href}>
										<Link
											className="text-primary underline-offset-4 hover:underline"
											href={link.href}
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			</div>
		</>
	);
}
