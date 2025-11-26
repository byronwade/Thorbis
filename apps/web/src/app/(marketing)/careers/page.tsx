import {
	ArrowRight,
	BookOpen,
	Briefcase,
	Building2,
	Calendar,
	Globe,
	GraduationCap,
	Heart,
	MapPin,
	Sparkles,
	Users,
} from "lucide-react";
import Script from "next/script";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
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
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const careersKeywords = generateSemanticKeywords("careers");

export const metadata = generateSEOMetadata({
	title: "Careers at Thorbis",
	description:
		"Join Thorbis and build software that powers modern trades. Explore open roles across engineering, product, customer experience, and go-to-market.",
	path: "/careers",
	section: "Company",
	keywords: [
		"thorbis careers",
		"field service software jobs",
		"thorbis hiring",
		"thorbis jobs",
		"work at thorbis",
		"remote tech jobs",
		...careersKeywords.slice(0, 5),
	],
});

const BENEFITS = [
	{
		title: "Remote-first with intentional onsite time",
		description:
			"Work from wherever you're most productive. Quarterly onsites hosted in rotating cities focus on strategy, empathy interviews, and team bonding.",
		icon: Globe,
		color: "from-blue-500/10 to-cyan-500/10 border-blue-500/30",
		iconBg: "bg-blue-500/10",
		iconColor: "text-blue-600 dark:text-blue-400",
	},
	{
		title: "Comprehensive health & wellness",
		description:
			"Competitive medical, dental, and vision coverage plus monthly wellness stipends and access to mental health resources.",
		icon: Heart,
		color: "from-rose-500/10 to-pink-500/10 border-rose-500/30",
		iconBg: "bg-rose-500/10",
		iconColor: "text-rose-600 dark:text-rose-400",
	},
	{
		title: "Flexible PTO & recharge weeks",
		description:
			"Minimum of three weeks PTO plus two company-wide recharge weeks. We trust you to balance impact with rest.",
		icon: Calendar,
		color: "from-emerald-500/10 to-green-500/10 border-emerald-500/30",
		iconBg: "bg-emerald-500/10",
		iconColor: "text-emerald-600 dark:text-emerald-400",
	},
	{
		title: "Learning & development budget",
		description:
			"Annual allowance for courses, conferences, and certifications. Managers partner with you on growth plans.",
		icon: GraduationCap,
		color: "from-violet-500/10 to-purple-500/10 border-violet-500/30",
		iconBg: "bg-violet-500/10",
		iconColor: "text-violet-600 dark:text-violet-400",
	},
];

const OPEN_ROLES = [
	{
		title: "Senior Backend Engineer, AI Platform",
		location: "Remote – North America",
		description:
			"Help build Thorbis' AI workflow engine, integrating LLM capabilities with dispatcher and technician experiences.",
		department: "Engineering",
		color: "from-violet-500/10 to-purple-500/10 border-violet-500/30",
		iconColor: "text-violet-600 dark:text-violet-400",
	},
	{
		title: "Product Designer, Operations Workflows",
		location: "Remote – North America",
		description:
			"Design intuitive experiences for dispatchers, coordinators, and field teams. You'll lead discovery with our customer councils.",
		department: "Design",
		color: "from-pink-500/10 to-rose-500/10 border-pink-500/30",
		iconColor: "text-pink-600 dark:text-pink-400",
	},
	{
		title: "Implementation Specialist",
		location: "Remote – United States",
		description:
			"Guide new customers through migration, configuration, and training. Ideal candidates have trade operations experience.",
		department: "Customer Success",
		color: "from-emerald-500/10 to-green-500/10 border-emerald-500/30",
		iconColor: "text-emerald-600 dark:text-emerald-400",
	},
	{
		title: "Account Executive, Mid-Market",
		location: "Remote – United States",
		description:
			"Partner with fast-growing contractors evaluating Thorbis. You'll own discovery, demos, and ROI storytelling.",
		department: "Sales",
		color: "from-blue-500/10 to-cyan-500/10 border-blue-500/30",
		iconColor: "text-blue-600 dark:text-blue-400",
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
			"At this time we're hiring in the United States and Canada without visa sponsorship. We revisit sponsorship options annually as we scale.",
	},
];

const TEAM_STATS = [
	{ value: "25+", label: "Team Members" },
	{ value: "100%", label: "Remote-First" },
	{ value: "4", label: "Quarterly Onsites" },
	{ value: "150+", label: "Years Combined Experience" },
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
						]),
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
			<div className="container mx-auto space-y-20 px-4 py-16 sm:px-6 lg:px-8">
				{/* Hero Section */}
				<section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-indigo-600/20 via-background to-violet-500/5 p-8 sm:p-12 lg:p-16">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-indigo-500/10 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-violet-500/10 blur-3xl" />

					<div className="mx-auto max-w-3xl space-y-6 text-center">
						<Badge className="px-4 py-1.5 font-medium tracking-wide uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
							<Sparkles className="mr-2 size-4" />
							Build the future of service operations
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
							We're assembling a team of builders obsessed with the trades
						</h1>
						<p className="text-muted-foreground text-lg leading-relaxed sm:text-xl">
							Thorbis hires curious, mission-driven people who love solving
							real-world problems for dispatchers, technicians, and operators.
							We work fast, ship thoughtfully, and measure impact by the
							outcomes our customers achieve.
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							<Button asChild className="group" size="lg">
								<a href="mailto:careers@thorbis.com">
									Introduce yourself
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</a>
							</Button>
							<Button asChild size="lg" variant="outline">
								<a href="/about">Meet the team</a>
							</Button>
						</div>
					</div>
				</section>

				{/* Team Stats */}
				<section className="grid gap-4 md:grid-cols-4">
					{TEAM_STATS.map((stat) => (
						<Card
							className="text-center border-2 hover:border-primary/30 transition-all hover:shadow-lg bg-gradient-to-br from-primary/5 to-transparent"
							key={stat.label}
						>
							<CardContent className="py-8">
								<p className="text-4xl font-bold text-primary">{stat.value}</p>
								<p className="text-muted-foreground text-sm mt-2">
									{stat.label}
								</p>
							</CardContent>
						</Card>
					))}
				</section>

				{/* Benefits Section */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							Benefits & Culture
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							How we take care of our team
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							We believe great work comes from happy, healthy, and supported
							people.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						{BENEFITS.map((benefit) => {
							const Icon = benefit.icon;
							return (
								<Card
									className={`border-2 bg-gradient-to-br transition-all hover:shadow-lg ${benefit.color}`}
									key={benefit.title}
								>
									<CardHeader>
										<div className="flex items-center gap-4">
											<div
												className={`flex size-12 items-center justify-center rounded-xl ${benefit.iconBg}`}
											>
												<Icon className={`size-6 ${benefit.iconColor}`} />
											</div>
											<CardTitle className="text-xl">{benefit.title}</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<CardDescription className="leading-relaxed text-base">
											{benefit.description}
										</CardDescription>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* Open Roles Section */}
				<section className="space-y-8">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<Badge className="mb-4" variant="secondary">
								<Briefcase className="mr-2 size-4" />
								Open Roles
							</Badge>
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
								Join our growing team
							</h2>
						</div>
						<Button asChild variant="outline">
							<a href="mailto:careers@thorbis.com">
								Submit a general application
							</a>
						</Button>
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						{OPEN_ROLES.map((role) => (
							<Card
								className={`h-full border-2 bg-gradient-to-br transition-all hover:shadow-lg ${role.color}`}
								key={role.title}
							>
								<CardHeader>
									<div className="flex items-center gap-2 mb-2">
										<Badge variant="secondary" className="text-xs">
											{role.department}
										</Badge>
									</div>
									<CardTitle className="text-xl">{role.title}</CardTitle>
									<CardDescription className="flex items-center gap-2">
										<MapPin className={`size-4 ${role.iconColor}`} />
										{role.location}
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-muted-foreground text-sm leading-relaxed">
										{role.description}
									</p>
									<Button asChild className="w-full">
										<a href="mailto:careers@thorbis.com?subject=Application%20for%20Thorbis%20Role">
											Apply via email
											<ArrowRight className="ml-2 size-4" />
										</a>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* FAQ Section */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							FAQ
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Frequently asked questions
						</h2>
					</div>
					<div className="mx-auto max-w-3xl">
						<Accordion collapsible type="single" className="space-y-4">
							{FAQ.map((item, index) => (
								<AccordionItem
									className="border-2 rounded-xl px-6 data-[state=open]:border-primary/30"
									key={item.question}
									value={`careers-faq-${index}`}
								>
									<AccordionTrigger className="text-left hover:no-underline py-4">
										<span className="font-semibold">{item.question}</span>
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
										{item.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</section>

				{/* CTA Section */}
				<section className="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-10 text-center">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />

					<div className="relative space-y-6 max-w-3xl mx-auto">
						<div className="flex items-center justify-center gap-2">
							<Users className="size-5 text-primary" />
							<span className="text-muted-foreground text-sm font-medium">
								Remote-first across North America
							</span>
						</div>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Don't see the perfect role?
						</h2>
						<p className="text-muted-foreground text-lg">
							We hire exceptional people across product, design, engineering,
							customer experience, and go-to-market. Tell us how you want to
							make an impact.
						</p>
						<Button asChild className="group" size="lg">
							<a href="mailto:careers@thorbis.com">
								Send us your story
								<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
							</a>
						</Button>
					</div>
				</section>
			</div>
		</>
	);
}
