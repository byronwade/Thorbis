import {
	ArrowRight,
	Bot,
	Calculator,
	Clock,
	DollarSign,
	Download,
	Layers,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";

import { RoiCalculator } from "@/components/marketing/roi-calculator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	generateBreadcrumbStructuredData,
	generateFAQStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";
import { createHowToSchema } from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const roiKeywords = generateSemanticKeywords("roi calculator");

export const metadata = generateSEOMetadata({
	title: "ROI Calculator for Field Service Teams",
	section: "Resources",
	description:
		"Estimate the ROI of switching to Thorbis. Calculate labor savings, revenue lift, and net impact with AI automation, streamlined dispatch, and better close rates.",
	path: "/roi",
	keywords: [
		"field service roi calculator",
		"servicetitan roi alternative",
		"thorbis savings estimate",
		"field service management roi",
		"calculate software roi",
		...roiKeywords.slice(0, 5),
	],
});

const FAQS = [
	{
		question: "Is the ROI calculator customizable for my business?",
		answer:
			"Yes. Update technician count, job volume, ticket size, and time savings. We use conservative assumptions based on averages from Thorbis customers.",
	},
	{
		question: "What costs should I include when comparing platforms?",
		answer:
			"Consider software subscriptions, payment fees, manual labor time, add-ons for AI or marketing, and lost revenue from missed opportunities or slow follow-up.",
	},
	{
		question: "Can I share the ROI model with stakeholders?",
		answer:
			"Export the estimate as a CSV and share it with your team. Once you create an account, our success team can tailor forecasts using your real usage data.",
	},
	{
		question: "How accurate is the projected revenue lift?",
		answer:
			"Estimates stem from median customer improvements after enabling AI booking, automated follow-up, and better dispatch utilization. Your results may vary, but the calculator stays conservative.",
	},
];

const BENEFIT_CARDS = [
	{
		title: "AI drives higher close rates",
		description:
			"Thorbis AI assistant books more jobs after hours and keeps leads warm with automated follow-up, improving conversion by 5-12%.",
		icon: Bot,
		color: "from-violet-500/10 to-purple-500/10 border-violet-500/30",
		iconBg: "bg-violet-500/10",
		iconColor: "text-violet-600 dark:text-violet-400",
	},
	{
		title: "Dispatch and technician efficiency",
		description:
			"Streamlined scheduling, mobile workflows, and digital checklists reduce job cycle time, freeing crews for more revenue work.",
		icon: Clock,
		color: "from-blue-500/10 to-cyan-500/10 border-blue-500/30",
		iconBg: "bg-blue-500/10",
		iconColor: "text-blue-600 dark:text-blue-400",
	},
	{
		title: "Consolidate point solutions",
		description:
			"Replace add-on SMS tools, marketing drip apps, and manual spreadsheets—Thorbis bundles communications, portal, and analytics.",
		icon: Layers,
		color: "from-emerald-500/10 to-green-500/10 border-emerald-500/30",
		iconBg: "bg-emerald-500/10",
		iconColor: "text-emerald-600 dark:text-emerald-400",
	},
];

const howToSchema = createHowToSchema({
	name: "How to calculate Thorbis ROI",
	steps: [
		{
			name: "Enter current operations data",
			text: "Add your technician count, jobs per day, average ticket, and existing software costs.",
		},
		{
			name: "Estimate efficiency gains",
			text: "Use realistic minutes saved per job and expected close rate improvements from Thorbis automations.",
		},
		{
			name: "Review savings and revenue lift",
			text: "See monthly and annual impact across labor savings, revenue lift, and net ROI after platform cost.",
		},
		{
			name: "Export and validate",
			text: "Download the CSV to share with leadership or request a bespoke ROI session with Thorbis experts.",
		},
	],
	supplies: ["Technician roster", "Average ticket data", "Software invoices"],
	totalTime: "PT5M",
});

const breadcrumbLd = generateBreadcrumbStructuredData([
	{ name: "Home", url: siteUrl },
	{ name: "ROI Calculator", url: `${siteUrl}/roi` },
]);

const faqLd = generateFAQStructuredData(FAQS);

export default function RoiPage() {
	return (
		<>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
				id="roi-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
				id="roi-howto-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
				id="roi-faq-ld"
				type="application/ld+json"
			/>

			<div className="container mx-auto space-y-20 px-4 py-16 sm:px-6 lg:px-8">
				{/* Hero Section */}
				<section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-green-600/20 via-background to-emerald-500/5 p-8 sm:p-12 lg:p-16">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-green-500/10 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-emerald-500/10 blur-3xl" />

					<div className="mx-auto max-w-4xl space-y-6 text-center">
						<Badge className="px-4 py-1.5 font-medium tracking-wide uppercase bg-green-500/10 text-green-600 dark:text-green-400">
							<Calculator className="mr-2 size-4" />
							ROI Calculator
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
							Quantify the ROI of switching to Thorbis
						</h1>
						<p className="text-muted-foreground text-lg leading-relaxed sm:text-xl">
							Use your real numbers to project labor savings, net-new revenue,
							and net ROI after Thorbis replaces your legacy field service
							stack. Thorbis pricing starts at $200/month with pay-as-you-go
							usage—no per-user fees and absolutely no lock-in.
						</p>
						<div className="border-border/50 flex flex-wrap items-center justify-center gap-6 border-t pt-6">
							<div className="flex items-center gap-2">
								<DollarSign className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">
									See actual savings
								</span>
							</div>
							<div className="flex items-center gap-2">
								<TrendingUp className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">
									Project revenue lift
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Download className="size-5 text-green-600 dark:text-green-400" />
								<span className="text-muted-foreground text-sm">
									Export to share
								</span>
							</div>
						</div>
						<div className="flex flex-wrap justify-center gap-3">
							<Button asChild className="group" size="lg">
								<Link href="/waitlist">
									Join Waitlist
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/switch">Explore migration program</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Calculator Section */}
				<section>
					<RoiCalculator />
				</section>

				{/* Benefits Section */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							Why ROI Improves
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Where the savings come from
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Three key areas where Thorbis delivers measurable impact.
						</p>
					</div>
					<div className="grid gap-6 lg:grid-cols-3">
						{BENEFIT_CARDS.map((item) => {
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
										<CardTitle className="text-lg">{item.title}</CardTitle>
									</CardHeader>
									<CardContent className="text-muted-foreground text-sm leading-relaxed">
										{item.description}
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* CTA Section */}
				<section className="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-10 text-center">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />

					<div className="relative space-y-6 max-w-3xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Share your ROI analysis with stakeholders
						</h2>
						<p className="text-muted-foreground text-lg">
							Export the numbers and pair them with our migration plan to prove
							the case for change.
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							<Button asChild className="group" size="lg">
								<Link href="/templates?tag=migration">
									Download migration checklist
									<Download className="ml-2 size-4" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/vs">Compare Thorbis with your current system</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* FAQ Section */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							FAQ
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							ROI Calculator Questions
						</h2>
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
				</section>
			</div>
		</>
	);
}
