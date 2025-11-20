
import Image from "next/image";
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
	generateOrganizationStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const aboutKeywords = generateSemanticKeywords("about");

export const metadata = generateSEOMetadata({
	title: "About Thorbis",
	description:
		"Thorbis builds AI-powered tools that help service companies deliver five-star customer experiences. Meet the team and values behind the platform.",
	path: "/about",
	section: "Company",
	keywords: [
		"about thorbis",
		"thorbis leadership",
		"thorbis mission",
		"field service software team",
		"thorbis company",
		"who is thorbis",
		...aboutKeywords.slice(0, 5),
	],
});

const VALUES = [
	{
		title: "Operators first",
		description:
			"We build alongside the dispatchers, technicians, and leaders who rely on Thorbis daily. Advisory councils drive every roadmap decision.",
	},
	{
		title: "Automation with empathy",
		description:
			"AI should empower humans. We design automation to remove drudgery while enhancing the customer experience.",
	},
	{
		title: "Measure outcomes, not features",
		description:
			"Every release is tied to customer metrics—faster booking, higher close rates, lower DSO—not vanity checklists.",
	},
	{
		title: "Secure and dependable",
		description:
			"We treat customer data like our own. SOC 2 aligned processes, encryption, and 99.9%+ uptime are baked into our culture.",
	},
];

const HISTORY = [
	{
		year: "2019",
		milestone: "Thorbis founded to modernize trade operations",
		detail:
			"Our founding team met while building software for national HVAC brands. We set out to give every contractor enterprise-grade tools.",
	},
	{
		year: "2021",
		milestone: "Launched AI call handling and mobile workflows",
		detail:
			"Thorbis AI Assistant answered the first customer call, and the mobile app delivered offline checklists to 5,000 technicians.",
	},
	{
		year: "2023",
		milestone: "Expanded to multi-location and enterprise customers",
		detail:
			"Support for complex org structures, role-based permissions, and inter-branch reporting arrived with our Growth tier.",
	},
	{
		year: "2024",
		milestone: "Introduced marketing automation & analytics suite",
		detail:
			"Service businesses finally tied campaigns, proposals, and revenue together—no third-party tools required.",
	},
];

const LEADERSHIP = [
	{
		name: "Amelia Grant",
		role: "CEO & Co-founder",
		bio: "Former COO at a national HVAC brand. Amelia obsesses over building software that makes dispatchers and technicians faster, not busier.",
		image:
			"https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
	},
	{
		name: "Noah Patel",
		role: "CTO & Co-founder",
		bio: "Led engineering teams at high-growth SaaS companies. Noah champions resilient infrastructure and developer velocity.",
		image:
			"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
	},
	{
		name: "Sofia Hernandez",
		role: "Head of Product",
		bio: "Sofia spent a decade shipping field service software. She runs product discovery, research, and our customer advisory councils.",
		image:
			"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
	},
	{
		name: "Ethan Brooks",
		role: "Head of Customer Experience",
		bio: "Ethan built success teams for trade-tech start-ups. He leads onboarding, enablement, and Thorbis University.",
		image:
			"https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
	},
];

export default function AboutPage() {
	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "About", url: `${siteUrl}/about` },
						]),
					),
				}}
				id="about-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateOrganizationStructuredData({
							name: "Thorbis",
							contactEmail: "press@thorbis.com",
						}),
					),
				}}
				id="about-organization-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<section className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
					<div className="space-y-6">
						<Badge className="tracking-wide uppercase" variant="secondary">
							Our mission
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
							Powering the world’s most trusted service companies
						</h1>
						<p className="text-muted-foreground text-lg leading-relaxed">
							Thorbis builds software that helps home service and commercial
							trades deliver elite customer experiences. From the first phone
							call to final invoice, we use AI and automation to remove friction
							and let people focus on what matters— delighting customers.
							Pricing stays transparent: $200/month base subscription with
							pay-as-you-go usage, unlimited users, and zero lock-in.
						</p>
						<div className="flex flex-wrap gap-3">
							<Button asChild>
								<Link href="/register">Create your account</Link>
							</Button>
							<Button asChild variant="outline">
								<a href="/careers">Join Thorbis</a>
							</Button>
						</div>
					</div>
					<div className="relative h-[340px] rounded-3xl border">
						<Image
							alt="Thorbis team collaborating"
							className="object-cover"
							fill
							priority
							sizes="540px"
							src="https://images.unsplash.com/photo-1523419409543-0c1df022bdd1?auto=format&fit=crop&w=1600&q=80"
						/>
					</div>
				</section>

				<section className="mt-16 space-y-8">
					<h2 className="text-2xl font-semibold">What we believe</h2>
					<div className="grid gap-6 md:grid-cols-2">
						{VALUES.map((value) => (
							<Card key={value.title}>
								<CardHeader>
									<CardTitle>{value.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="leading-relaxed">
										{value.description}
									</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section className="mt-16 space-y-6">
					<h2 className="text-2xl font-semibold">Our story</h2>
					<div className="grid gap-6 md:grid-cols-2">
						{HISTORY.map((entry) => (
							<div
								className="bg-muted/10 rounded-2xl border p-6"
								key={entry.year}
							>
								<p className="text-primary text-sm font-semibold uppercase">
									{entry.year}
								</p>
								<h3 className="text-lg font-semibold">{entry.milestone}</h3>
								<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
									{entry.detail}
								</p>
							</div>
						))}
					</div>
				</section>

				<section className="mt-16 space-y-6">
					<h2 className="text-2xl font-semibold">Leadership</h2>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
						{LEADERSHIP.map((leader) => (
							<Card className="overflow-hidden text-center" key={leader.name}>
								<div className="relative h-48 w-full">
									<Image
										alt={leader.name}
										className="object-cover"
										fill
										sizes="240px"
										src={leader.image}
									/>
								</div>
								<CardHeader>
									<CardTitle>{leader.name}</CardTitle>
									<CardDescription>{leader.role}</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground text-sm leading-relaxed">
										{leader.bio}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section className="bg-secondary/10 mt-16 rounded-3xl border p-10 text-center">
					<p className="text-muted-foreground text-lg">
						Thorbis operates as a distributed-first company with teammates
						across North America. We host quarterly onsites focused on customer
						empathy, product discovery, and celebrating wins. Interested in
						joining us?
					</p>
					<Button asChild className="mt-6">
						<a href="/careers">Explore opportunities</a>
					</Button>
				</section>
			</div>
		</>
	);
}
