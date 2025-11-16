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
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
	title: "Contact Thorbis",
	description:
		"Connect with Thorbis sales, support, or partnerships. Our team responds within one business day.",
	path: "/contact",
	section: "Company",
	keywords: [
		"contact thorbis",
		"thorbis support",
		"thorbis sales",
		"thorbis partnerships",
	],
});

const CONTACT_OPTIONS = [
	{
		title: "Sales & onboarding",
		description:
			"Have questions before signing up? Share your goals and we’ll walk through the $100/month base + pay-as-you-go pricing—no lock-in—and help you launch smoothly.",
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
	return (
		<>
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
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<section className="max-w-2xl space-y-6">
					<Badge className="uppercase tracking-wide" variant="secondary">
						Contact Thorbis
					</Badge>
					<h1 className="font-bold text-4xl tracking-tight sm:text-5xl">
						We’re here to help
					</h1>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Whether you’re exploring Thorbis, need support, or want to partner,
						our team responds quickly. Pricing stays simple—$100/month base
						subscription with pay-as-you-go usage, unlimited users, no
						contracts, no lock-in. Choose the option that fits and we’ll get
						back within one business day.
					</p>
					<div className="flex flex-wrap gap-3">
						<Button asChild>
							<Link href="/register">Create your account</Link>
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
							<CardContent className="space-y-2 text-muted-foreground text-sm">
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

				<section className="mt-16 rounded-3xl border bg-muted/20 p-10">
					<h2 className="font-semibold text-2xl">Office locations</h2>
					<p className="mt-2 text-muted-foreground text-sm leading-relaxed">
						Thorbis operates remotely with hubs in Austin, Denver, and Toronto.
						All visits are by appointment—reach out to coordinate an onsite
						workshop.
					</p>
				</section>
			</div>
		</>
	);
}
