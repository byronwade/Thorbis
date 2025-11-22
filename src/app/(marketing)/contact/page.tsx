
import Link from "next/link";
import Script from "next/script";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SEO_URLS } from "@/lib/seo/config";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { createLocalBusinessSchema } from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration

export const metadata = generateSEOMetadata({
	title: "Contact Us - Sales, Support & Partnerships",
	description:
		"Get in touch with Thorbis for sales inquiries, customer support, or partnership opportunities. Phone, email, and chat support available. Responses within 1 business day.",
	path: "/contact",
	section: "Company",
	keywords: [
		"contact thorbis",
		"thorbis customer support",
		"thorbis sales team",
		"field service software support",
		"business software help",
	],
});

const CONTACT_OPTIONS = [
	{
		title: "Sales & onboarding",
		description:
			"Have questions before signing up? Share your goals and we’ll walk through the $200/month base + pay-as-you-go pricing—no lock-in—and help you launch smoothly.",
		email: "sales@thorbis.com",
		phone: "+1 (415) 555-0123",
	},
	{
		title: "Customer support",
		description:
			"Need help with your account? Thorbis support is available via phone, chat, or email—with 24/7 emergency coverage.",
		email: "support@thorbis.com",
		phone: "+1 (415) 555-0456",
	},
	{
		title: "Partnerships & integrations",
		description:
			"Interested in partnering with Thorbis? Our partner team can discuss integrations, co-marketing, and referral programs.",
		email: "partners@thorbis.com",
		phone: "+1 (415) 555-0789",
	},
];

export default function ContactPage() {
	// LocalBusiness Schema - For local search and voice queries
	const localBusinessSchema = createLocalBusinessSchema({
		name: "Thorbis Inc.",
		address: {
			streetAddress: "548 Market St",
			addressLocality: "San Francisco",
			addressRegion: "CA",
			postalCode: "94104",
			addressCountry: "US",
		},
		telephone: "+1 (415) 555-0123",
		email: "hello@thorbis.com",
		openingHours: ["Mo-Fr 09:00-17:00"],
		priceRange: "$200-$2000",
	});

	return (
		<>
			{/* Breadcrumb Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Contact", url: `${siteUrl}/contact` },
						]),
					),
				}}
				id="contact-breadcrumb-ld"
				type="application/ld+json"
			/>

			{/* LocalBusiness Schema - For local search */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(localBusinessSchema),
				}}
				id="contact-local-business-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<section className="max-w-2xl space-y-6">
					<Badge className="tracking-wide uppercase" variant="secondary">
						Contact Thorbis
					</Badge>
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
						We’re here to help
					</h1>
					<p className="text-muted-foreground text-lg leading-relaxed">
						Whether you’re exploring Thorbis, need support, or want to partner,
						our team responds quickly. Pricing stays simple—$200/month base
						subscription with pay-as-you-go usage, unlimited users, no
						contracts, no lock-in. Choose the option that fits and we’ll get
						back within one business day.
					</p>
					<div className="flex flex-wrap gap-3">
						<Button asChild>
							<Link href="/waitlist">Join Waitlist</Link>
						</Button>
						<Button asChild variant="outline">
							<a href="https://status.thorbis.com" rel="noopener">
								View system status
							</a>
						</Button>
					</div>
				</section>

				<section className="mt-16 grid gap-6 md:grid-cols-3">
					{CONTACT_OPTIONS.map((option) => (
						<Card key={option.title}>
							<CardHeader>
								<CardTitle>{option.title}</CardTitle>
								<CardDescription>{option.description}</CardDescription>
							</CardHeader>
							<CardContent className="text-muted-foreground space-y-2 text-sm">
								<p>
									Email:{" "}
									<a
										className="text-primary underline-offset-4 hover:underline"
										href={`mailto:${option.email}`}
									>
										{option.email}
									</a>
								</p>
								<p>Phone: {option.phone}</p>
							</CardContent>
						</Card>
					))}
				</section>

				<section className="bg-muted/20 mt-16 rounded-3xl border p-10">
					<h2 className="text-2xl font-semibold">Office locations</h2>
					<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
						Thorbis operates remotely with hubs in Austin, Denver, and Toronto.
						All visits are by appointment—reach out to coordinate an onsite
						workshop.
					</p>
				</section>
			</div>
		</>
	);
}
