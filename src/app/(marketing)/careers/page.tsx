import Script from "next/script";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateBreadcrumbStructuredData, generateMetadata as generateSEOMetadata, siteUrl } from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
	title: "Careers at Thorbis",
	description:
		"Join Thorbis and build software that powers modern trades. Explore open roles across engineering, product, customer experience, and go-to-market.",
	path: "/careers",
	section: "Company",
	keywords: ["thorbis careers", "field service software jobs", "thorbis hiring"],
});

const BENEFITS = [
	{
		title: "Remote-first with intentional onsite time",
		description:
			"Work from wherever you’re most productive. Quarterly onsites hosted in rotating cities focus on strategy, empathy interviews, and team bonding.",
	},
	{
		title: "Comprehensive health & wellness",
		description:
			"Competitive medical, dental, and vision coverage plus monthly wellness stipends and access to mental health resources.",
	},
	{
		title: "Flexible PTO & recharge weeks",
		description:
			"Minimum of three weeks PTO plus two company-wide recharge weeks. We trust you to balance impact with rest.",
	},
	{
		title: "Learning & development budget",
		description:
			"Annual allowance for courses, conferences, and certifications. Managers partner with you on growth plans.",
	},
];

const OPEN_ROLES = [
	{
		title: "Senior Backend Engineer, AI Platform",
		location: "Remote – North America",
		description:
			"Help build Thorbis’ AI workflow engine, integrating LLM capabilities with dispatcher and technician experiences.",
	},
	{
		title: "Product Designer, Operations Workflows",
		location: "Remote – North America",
		description:
			"Design intuitive experiences for dispatchers, coordinators, and field teams. You’ll lead discovery with our customer councils.",
	},
	{
		title: "Implementation Specialist",
		location: "Remote – United States",
		description:
			"Guide new customers through migration, configuration, and training. Ideal candidates have trade operations experience.",
	},
	{
		title: "Account Executive, Mid-Market",
		location: "Remote – United States",
		description:
			"Partner with fast-growing contractors evaluating Thorbis. You’ll own discovery, demos, and ROI storytelling.",
	},
];

const FAQ = [
	{
		question: "Where is the Thorbis team located?",
		answer:
			"Thorbis is remote-first across the United States and Canada. We organize quarterly onsites for strategic planning and customer research.",
	},
	{
		question: "What does the interview process look like?",
		answer:
			"Most roles include an initial conversation, role-specific interview, collaborative exercise, and culture conversation. We keep the process transparent and efficient.",
	},
	{
		question: "Do you sponsor visas?",
		answer:
			"At this time we’re hiring in the United States and Canada without visa sponsorship. We revisit sponsorship options annually as we scale.",
	},
];

const JOB_POSTING_JSON = OPEN_ROLES.map((role) => ({
	"@context": "https://schema.org",
	"@type": "JobPosting",
	title: role.title,
	description: role.description,
	datePosted: new Date("2025-02-01").toISOString(),
	validThrough: new Date("2025-12-31").toISOString(),
	employmentType: "FULL_TIME",
	jobLocationType: "TELECOMMUTE",
	applicantLocationRequirements: {
		"@type": "Country",
		name: "United States",
	},
	hiringOrganization: {
		"@type": "Organization",
		name: "Thorbis",
		sameAs: siteUrl,
		email: "careers@thorbis.com",
	},
}));

export default function CareersPage() {
	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Careers", url: `${siteUrl}/careers` },
						])
					),
				}}
				id="careers-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(JOB_POSTING_JSON),
				}}
				id="careers-jobposting-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<section className="max-w-3xl space-y-6">
					<Badge className="uppercase tracking-wide" variant="secondary">
						Build the future of service operations
					</Badge>
					<h1 className="font-bold text-4xl tracking-tight sm:text-5xl">
						We’re assembling a team of builders obsessed with the trades
					</h1>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Thorbis hires curious, mission-driven people who love solving real-world problems for dispatchers,
						technicians, and operators. We work fast, ship thoughtfully, and measure impact by the outcomes our
						customers achieve.
					</p>
					<div className="flex flex-wrap gap-3">
						<Button asChild>
							<a href="mailto:careers@thorbis.com">Introduce yourself</a>
						</Button>
						<Button asChild variant="outline">
							<a href="/about">Meet the team</a>
						</Button>
					</div>
				</section>

				<section className="mt-16 space-y-6">
					<h2 className="font-semibold text-2xl">Benefits & culture</h2>
					<div className="grid gap-6 md:grid-cols-2">
						{BENEFITS.map((benefit) => (
							<Card key={benefit.title}>
								<CardHeader>
									<CardTitle>{benefit.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="leading-relaxed">{benefit.description}</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section className="mt-16 space-y-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<h2 className="font-semibold text-2xl">Open roles</h2>
						<Button asChild variant="outline">
							<a href="mailto:careers@thorbis.com">Submit a general application</a>
						</Button>
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						{OPEN_ROLES.map((role) => (
							<Card className="h-full" key={role.title}>
								<CardHeader>
									<CardTitle>{role.title}</CardTitle>
									<CardDescription>{role.location}</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground text-sm leading-relaxed">{role.description}</p>
									<Button asChild className="mt-4">
										<a href="mailto:careers@thorbis.com?subject=Application%20for%20Thorbis%20Role">Apply via email</a>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section className="mt-16 space-y-4">
					<h2 className="font-semibold text-2xl">Frequently asked questions</h2>
					<Accordion collapsible type="single">
						{FAQ.map((item, index) => (
							<AccordionItem key={item.question} value={`careers-faq-${index}`}>
								<AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
								<AccordionContent className="text-muted-foreground text-sm leading-relaxed">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</section>

				<section className="mt-16 rounded-3xl border bg-primary/10 p-10 text-center">
					<p className="text-lg text-muted-foreground">
						Don’t see the perfect role? We hire exceptional people across product, design, engineering, customer
						experience, and go-to-market. Tell us how you want to make an impact.
					</p>
					<Button asChild className="mt-6">
						<a href="mailto:careers@thorbis.com">Send us your story</a>
					</Button>
				</section>
			</div>
		</>
	);
}
