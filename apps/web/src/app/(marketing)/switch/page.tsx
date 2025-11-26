import {
	ArrowRight,
	Calendar,
	CheckCircle,
	ClipboardCheck,
	Database,
	FileCheck,
	GraduationCap,
	Rocket,
	Settings,
	Users,
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
import { getAllCompetitors } from "@/lib/marketing/competitors";
import {
	generateBreadcrumbStructuredData,
	generateFAQStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";
import { createHowToSchema } from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const switchKeywords = generateSemanticKeywords("migration");

export const metadata = generateSEOMetadata({
	title: "Switch to Thorbis Migration Center",
	section: "Migration",
	description:
		"Plan your move from ServiceTitan, Housecall Pro, Jobber, and other field service tools. Explore Thorbis migration timelines, checklists, and ROI wins.",
	path: "/switch",
	keywords: [
		"switch to thorbis",
		"servicetitan migration",
		"housecall pro upgrade",
		"jobber alternative",
		"migrate to thorbis",
		"switch field service software",
		...switchKeywords.slice(0, 5),
	],
});

const FAQS = [
	{
		question: "How long does a typical Thorbis migration take?",
		answer:
			"Most teams go live within 30-45 days. We handle data cleanup, import, configuration, and training to minimize internal lift.",
	},
	{
		question: "Which systems can Thorbis migrate from?",
		answer:
			"We offer guided migrations from ServiceTitan, Housecall Pro, Jobber, FieldEdge, Workiz, ServiceM8, and spreadsheets. Custom migrations are available for additional tools.",
	},
	{
		question: "What support do we receive during the migration?",
		answer:
			"Each project includes a migration engineer, solution architect, and success manager. We provide parallel environment testing, live cutover support, and post-launch optimization.",
	},
	{
		question: "Can we keep running our existing system during migration?",
		answer:
			"Yes. We run Thorbis in parallel while you validate data. Once ready, we schedule a cutover window to ensure no jobs are missed.",
	},
];

const MIGRATION_BENEFITS = [
	{
		title: "Data migration handled for you",
		description:
			"Thorbis engineers export, clean, and import your customers, jobs, pricebooks, and memberships—no spreadsheets or manual re-entry.",
		icon: Database,
		color: "from-blue-500/10 to-cyan-500/10 border-blue-500/30",
		iconBg: "bg-blue-500/10",
		iconColor: "text-blue-600 dark:text-blue-400",
	},
	{
		title: "Workflow redesign included",
		description:
			"Solution architects map current processes and apply AI-enabled best practices so your team adopts Thorbis quickly.",
		icon: Settings,
		color: "from-violet-500/10 to-purple-500/10 border-violet-500/30",
		iconBg: "bg-violet-500/10",
		iconColor: "text-violet-600 dark:text-violet-400",
	},
	{
		title: "Role-based enablement",
		description:
			"Dispatchers, technicians, finance, and leadership receive tailored training, playbooks, and live office hours.",
		icon: GraduationCap,
		color: "from-emerald-500/10 to-green-500/10 border-emerald-500/30",
		iconBg: "bg-emerald-500/10",
		iconColor: "text-emerald-600 dark:text-emerald-400",
	},
];

const TIMELINE_STEPS = [
	{
		week: "Week 1-2",
		title: "Kickoff & Data Audit",
		description:
			"Kickoff, data exports, and configuration workshops. Thorbis builds your environment while reconciling data.",
		icon: ClipboardCheck,
	},
	{
		week: "Week 3",
		title: "Workflow Testing",
		description:
			"Workflow testing in a staging environment, plus dispatcher and technician training with live feedback.",
		icon: Settings,
	},
	{
		week: "Week 4",
		title: "Final Prep",
		description:
			"Final data sync, go-live planning, and customer communications.",
		icon: FileCheck,
	},
	{
		week: "Week 5-6",
		title: "Launch & Optimize",
		description:
			"Cutover weekend, daily huddles, KPI tracking, and optimization sessions with Thorbis success coaches.",
		icon: Rocket,
	},
];

const howToSchema = createHowToSchema({
	name: "Switch to Thorbis in 45 Days",
	description:
		"Step-by-step plan to migrate your field service operations from legacy platforms to Thorbis.",
	steps: [
		{
			name: "Kickoff & data audit",
			text: "Meet the migration team, gather exports from your current system, and align on goals.",
		},
		{
			name: "Configuration & workflow design",
			text: "Thorbis configures dispatch, automations, and integrations while importing cleaned data.",
		},
		{
			name: "Role-based training",
			text: "Dispatchers, technicians, finance, and leadership complete live enablement sessions.",
		},
		{
			name: "Cutover weekend",
			text: "Run a final validation, switch your team to Thorbis, and monitor KPIs with our specialists.",
		},
	],
	supplies: ["Data export templates", "Migration checklist", "Training agenda"],
	totalTime: "P45D",
});

const breadcrumbLd = generateBreadcrumbStructuredData([
	{ name: "Home", url: siteUrl },
	{ name: "Switch to Thorbis", url: `${siteUrl}/switch` },
]);

const faqLd = generateFAQStructuredData(FAQS);

export default function SwitchToThorbisPage() {
	const competitorComparisons = getAllCompetitors()
		.filter((competitor) =>
			["servicetitan", "housecall-pro", "jobber"].includes(competitor.slug),
		)
		.slice(0, 3);

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
				id="switch-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
				id="switch-howto-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
				id="switch-faq-ld"
				type="application/ld+json"
			/>

			<div className="container mx-auto space-y-20 px-4 py-16 sm:px-6 lg:px-8">
				{/* Hero Section */}
				<section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-orange-600/20 via-background to-amber-500/5 p-8 sm:p-12 lg:p-16">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-orange-500/10 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-amber-500/10 blur-3xl" />

					<div className="mx-auto max-w-4xl space-y-6 text-center">
						<Badge className="px-4 py-1.5 font-medium tracking-wide uppercase bg-orange-500/10 text-orange-600 dark:text-orange-400">
							<Calendar className="mr-2 size-4" />
							Migration Program
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
							Switch to Thorbis with a guided 45-day migration program
						</h1>
						<p className="text-muted-foreground text-lg leading-relaxed sm:text-xl">
							We migrate data, re-engineer workflows, and train your team while
							you stay focused on customers. Compare migration paths from
							ServiceTitan, Housecall Pro, Jobber, and more knowing pricing is
							just $200/month base with pay-as-you-go usage, unlimited users,
							and no lock-in.
						</p>
						<div className="border-border/50 flex flex-wrap items-center justify-center gap-6 border-t pt-6">
							<div className="flex items-center gap-2">
								<CheckCircle className="size-5 text-orange-600 dark:text-orange-400" />
								<span className="text-muted-foreground text-sm">
									45-day go-live
								</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="size-5 text-orange-600 dark:text-orange-400" />
								<span className="text-muted-foreground text-sm">
									Dedicated migration team
								</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="size-5 text-orange-600 dark:text-orange-400" />
								<span className="text-muted-foreground text-sm">
									Zero data loss
								</span>
							</div>
						</div>
						<div className="flex flex-wrap items-center justify-center gap-4">
							<Button asChild className="group" size="lg">
								<Link href="/waitlist">
									Join Waitlist
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/templates?tag=migration">Download checklist</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Benefits Section */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							What's Included
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Full-service migration support
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Everything you need to switch platforms without disrupting
							operations.
						</p>
					</div>
					<div className="grid gap-6 lg:grid-cols-3">
						{MIGRATION_BENEFITS.map((item) => {
							const Icon = item.icon;
							return (
								<Card
									className={`border-2 bg-gradient-to-br transition-all hover:shadow-lg ${item.color}`}
									key={item.title}
								>
									<CardHeader>
										<div
											className={`flex size-12 items-center justify-center rounded-xl mb-3 ${item.iconBg}`}
										>
											<Icon className={`size-6 ${item.iconColor}`} />
										</div>
										<CardTitle>{item.title}</CardTitle>
									</CardHeader>
									<CardContent className="text-muted-foreground leading-relaxed">
										{item.description}
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* Competitor Comparisons */}
				<section className="space-y-8">
					<div className="mx-auto max-w-3xl text-center">
						<Badge className="mb-4" variant="secondary">
							Compare Platforms
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Choose your starting point
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Explore detailed comparison guides for the platforms contractors
							most often replace with Thorbis.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						{competitorComparisons.map((comparison) => (
							<Card
								className="h-full border-2 hover:border-primary/30 transition-all hover:shadow-lg"
								key={comparison.slug}
							>
								<CardHeader>
									<CardTitle className="text-xl">
										Thorbis vs {comparison.competitorName}
									</CardTitle>
									<CardDescription>{comparison.summary}</CardDescription>
								</CardHeader>
								<CardContent className="flex flex-col gap-3">
									<ul className="text-muted-foreground space-y-2 text-sm">
										{comparison.thorbisAdvantages.slice(0, 3).map((value) => (
											<li className="leading-relaxed" key={value.title}>
												<span className="text-foreground font-semibold">
													{value.title}:
												</span>{" "}
												{value.description}
											</li>
										))}
									</ul>
									<Button asChild variant="outline">
										<Link href={`/vs/${comparison.slug}`}>
											Compare with {comparison.competitorName}
										</Link>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* Timeline Section */}
				<section className="space-y-8">
					<div className="mx-auto max-w-3xl text-center">
						<Badge className="mb-4" variant="secondary">
							45-Day Timeline
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Your migration roadmap
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							A guided playbook designed to minimize downtime and accelerate
							ROI.
						</p>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{TIMELINE_STEPS.map((step, index) => {
							const Icon = step.icon;
							const colors = [
								"from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
								"from-violet-500/10 to-purple-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400",
								"from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
								"from-emerald-500/10 to-green-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
							];
							const bgColors = [
								"bg-blue-500/10",
								"bg-violet-500/10",
								"bg-amber-500/10",
								"bg-emerald-500/10",
							];
							const textColors = [
								"text-blue-600 dark:text-blue-400",
								"text-violet-600 dark:text-violet-400",
								"text-amber-600 dark:text-amber-400",
								"text-emerald-600 dark:text-emerald-400",
							];
							return (
								<div
									className={`rounded-2xl border-2 bg-gradient-to-br p-6 transition-all hover:shadow-lg ${colors[index]}`}
									key={step.week}
								>
									<div
										className={`flex size-12 items-center justify-center rounded-xl mb-4 ${bgColors[index]}`}
									>
										<Icon className={`size-6 ${textColors[index]}`} />
									</div>
									<p
										className={`text-sm font-bold uppercase mb-1 ${textColors[index]}`}
									>
										{step.week}
									</p>
									<h3 className="text-lg font-semibold mb-2">{step.title}</h3>
									<p className="text-muted-foreground text-sm leading-relaxed">
										{step.description}
									</p>
								</div>
							);
						})}
					</div>
				</section>

				{/* Deliverables Section */}
				<section className="grid gap-8 lg:grid-cols-2">
					<Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5">
						<CardHeader>
							<CardTitle className="text-2xl">Migration deliverables</CardTitle>
							<CardDescription>
								Every engagement includes the following assets and checkpoints.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-3">
								{[
									"Dedicated migration engineer & success manager",
									"Data cleanup and validation reports",
									"Configuration of automations, AI assistant, and portal",
									"Role-based training decks & recorded sessions",
									"Post-launch KPI dashboard & optimization plan",
								].map((item) => (
									<li className="flex items-start gap-3" key={item}>
										<CheckCircle className="size-5 text-primary mt-0.5 shrink-0" />
										<span className="text-muted-foreground text-sm leading-relaxed">
											{item}
										</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
					<Card className="border-2 hover:border-primary/30 transition-all">
						<CardHeader>
							<div className="flex items-center gap-2 mb-2">
								<Users className="size-5 text-primary" />
								<span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
									Customer Success
								</span>
							</div>
							<CardTitle className="text-2xl">Your migration team</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								You'll work with dedicated specialists who understand field
								service operations:
							</p>
							<ul className="text-muted-foreground space-y-2 text-sm">
								<li>• Migration Engineer - handles data and configuration</li>
								<li>
									• Solution Architect - designs workflows and automations
								</li>
								<li>• Success Manager - ensures adoption and KPI tracking</li>
								<li>• AI Strategist - optimizes assistant and automations</li>
							</ul>
						</CardContent>
					</Card>
				</section>

				{/* FAQ Section */}
				<section className="space-y-8">
					<div className="mx-auto max-w-3xl space-y-4 text-center">
						<Badge className="mb-4" variant="secondary">
							FAQ
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Migration FAQ
						</h2>
						<p className="text-muted-foreground text-lg">
							Answers to the most common questions contractors ask when planning
							their move to Thorbis.
						</p>
					</div>
					<div className="mx-auto max-w-4xl grid gap-4 md:grid-cols-2">
						{FAQS.map((faq) => (
							<Card
								className="border-2 hover:border-primary/30 transition-all hover:shadow-lg"
								key={faq.question}
							>
								<CardHeader>
									<CardTitle className="text-lg">{faq.question}</CardTitle>
								</CardHeader>
								<CardContent className="text-muted-foreground text-sm leading-relaxed">
									{faq.answer}
								</CardContent>
							</Card>
						))}
					</div>
					<div className="flex flex-wrap justify-center gap-3">
						<Button asChild className="group" size="lg">
							<Link href="/waitlist">
								Join Waitlist
								<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline">
							<Link href="/templates?tag=migration">Migration Checklist</Link>
						</Button>
					</div>
				</section>
			</div>
		</>
	);
}
