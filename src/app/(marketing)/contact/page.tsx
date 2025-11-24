import {
	ArrowRight,
	Building2,
	Handshake,
	HeadphonesIcon,
	Mail,
	MapPin,
	Phone,
	ShoppingCart,
} from "lucide-react";
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
			"Have questions before signing up? Share your goals and we'll walk through the $200/month base + pay-as-you-go pricing—no lock-in—and help you launch smoothly.",
		email: "sales@thorbis.com",
		phone: "+1 (415) 555-0123",
		icon: ShoppingCart,
		color: "from-blue-500/10 to-cyan-500/10 border-blue-500/30",
		iconBg: "bg-blue-500/10",
		iconColor: "text-blue-600 dark:text-blue-400",
	},
	{
		title: "Customer support",
		description:
			"Need help with your account? Thorbis support is available via phone, chat, or email—with 24/7 emergency coverage.",
		email: "support@thorbis.com",
		phone: "+1 (415) 555-0456",
		icon: HeadphonesIcon,
		color: "from-emerald-500/10 to-green-500/10 border-emerald-500/30",
		iconBg: "bg-emerald-500/10",
		iconColor: "text-emerald-600 dark:text-emerald-400",
	},
	{
		title: "Partnerships & integrations",
		description:
			"Interested in partnering with Thorbis? Our partner team can discuss integrations, co-marketing, and referral programs.",
		email: "partners@thorbis.com",
		phone: "+1 (415) 555-0789",
		icon: Handshake,
		color: "from-violet-500/10 to-purple-500/10 border-violet-500/30",
		iconBg: "bg-violet-500/10",
		iconColor: "text-violet-600 dark:text-violet-400",
	},
];

const OFFICE_LOCATIONS = [
	{ city: "Austin", region: "Texas" },
	{ city: "Denver", region: "Colorado" },
	{ city: "Toronto", region: "Ontario" },
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
			<div className="container mx-auto space-y-20 px-4 py-16 sm:px-6 lg:px-8">
				{/* Hero Section */}
				<section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-sky-600/20 via-background to-sky-500/5 p-8 sm:p-12 lg:p-16">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-sky-500/10 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-sky-500/10 blur-3xl" />

					<div className="mx-auto max-w-3xl space-y-6 text-center">
						<Badge className="px-4 py-1.5 font-medium tracking-wide uppercase bg-sky-500/10 text-sky-600 dark:text-sky-400">
							Contact Thorbis
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
							We're here to help
						</h1>
						<p className="text-muted-foreground text-lg leading-relaxed sm:text-xl">
							Whether you're exploring Thorbis, need support, or want to partner,
							our team responds quickly. Pricing stays simple—$200/month base
							subscription with pay-as-you-go usage, unlimited users, no
							contracts, no lock-in. Choose the option that fits and we'll get
							back within one business day.
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							<Button asChild className="group" size="lg">
								<Link href="/waitlist">
									Join Waitlist
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<a href="https://status.thorbis.com" rel="noopener">
									View system status
								</a>
							</Button>
						</div>
					</div>
				</section>

				{/* Contact Options */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							Get in Touch
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Choose how you'd like to connect
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Our team is ready to help you succeed with Thorbis.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						{CONTACT_OPTIONS.map((option) => {
							const Icon = option.icon;
							return (
								<Card
									className={`border-2 bg-gradient-to-br transition-all hover:shadow-lg ${option.color}`}
									key={option.title}
								>
									<CardHeader>
										<div className="flex items-center gap-4 mb-2">
											<div className={`flex size-12 items-center justify-center rounded-xl ${option.iconBg}`}>
												<Icon className={`size-6 ${option.iconColor}`} />
											</div>
										</div>
										<CardTitle className="text-xl">{option.title}</CardTitle>
										<CardDescription className="leading-relaxed">
											{option.description}
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-3">
										<a
											className="flex items-center gap-2 text-sm hover:underline underline-offset-4"
											href={`mailto:${option.email}`}
										>
											<Mail className={`size-4 ${option.iconColor}`} />
											<span>{option.email}</span>
										</a>
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<Phone className={`size-4 ${option.iconColor}`} />
											<span>{option.phone}</span>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* Office Locations */}
				<section className="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-10">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />

					<div className="relative space-y-6 max-w-4xl mx-auto">
						<div className="flex items-center justify-center gap-2 mb-4">
							<Building2 className="size-5 text-primary" />
							<span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
								Remote-First Company
							</span>
						</div>
						<h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl">
							Office locations
						</h2>
						<p className="text-muted-foreground text-center text-lg leading-relaxed">
							Thorbis operates remotely with hubs across North America.
							All visits are by appointment—reach out to coordinate an onsite
							workshop.
						</p>
						<div className="grid gap-4 md:grid-cols-3 mt-8">
							{OFFICE_LOCATIONS.map((location) => (
								<div
									className="flex items-center justify-center gap-3 rounded-xl border bg-background/80 p-4 text-center"
									key={location.city}
								>
									<MapPin className="size-5 text-primary" />
									<div>
										<p className="font-semibold">{location.city}</p>
										<p className="text-sm text-muted-foreground">{location.region}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
