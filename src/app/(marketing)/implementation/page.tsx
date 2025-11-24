import {
	ArrowRight,
	BookOpen,
	Calendar,
	CheckCircle,
	ClipboardCheck,
	GraduationCap,
	HeadphonesIcon,
	MapPin,
	MessageSquare,
	Quote,
	Rocket,
	Settings,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	generateBreadcrumbStructuredData,
	generateFAQStructuredData,
	generateMetadata as generateSEOMetadata,
	generateServiceStructuredData,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";
import { createHowToSchema } from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const implementationKeywords = generateSemanticKeywords("implementation");

export const metadata = generateSEOMetadata({
	title: "Thorbis Implementation & Customer Success",
	section: "Implementation",
	description:
		"Accelerate time-to-value with dedicated migration engineers, AI configuration, and role-based training. Explore onboarding phases and support tiers.",
	path: "/implementation",
	keywords: [
		"thorbis implementation",
		"field service onboarding",
		"customer success program thorbis",
		"software implementation",
		"onboarding process",
		"migration services",
		...implementationKeywords.slice(0, 5),
	],
});

const PHASES = [
	{
		title: "Discovery & blueprint",
		description:
			"We audit current systems, export data, and map workflows to Thorbis modules. The output is a tailored implementation blueprint.",
		bullets: [
			"Kickoff meeting with stakeholders",
			"Data audit & export collection",
			"Success metrics & KPI alignment",
		],
		icon: MapPin,
		color: "from-blue-500/10 to-cyan-500/10 border-blue-500/30",
		iconBg: "bg-blue-500/10",
		iconColor: "text-blue-600 dark:text-blue-400",
	},
	{
		title: "Configuration & validation",
		description:
			"Thorbis configures dispatch boards, automations, and integrations while cleaning data. Teams validate in a parallel environment.",
		bullets: [
			"Technician, dispatcher, and finance configuration",
			"AI assistant scripts, portal branding, and automations",
			"Staging environment walkthrough & acceptance",
		],
		icon: Settings,
		color: "from-violet-500/10 to-purple-500/10 border-violet-500/30",
		iconBg: "bg-violet-500/10",
		iconColor: "text-violet-600 dark:text-violet-400",
	},
	{
		title: "Launch & optimization",
		description:
			"Cutover weekend support, role-based training, and KPI monitoring ensure adoption. Success coaches guide optimization.",
		bullets: [
			"Live go-live bridge & daily huddles",
			"Post-launch KPI dashboard reviews",
			"Quarterly business reviews & roadmap alignment",
		],
		icon: Rocket,
		color: "from-emerald-500/10 to-green-500/10 border-emerald-500/30",
		iconBg: "bg-emerald-500/10",
		iconColor: "text-emerald-600 dark:text-emerald-400",
	},
];

const RESOURCES = [
	{
		title: "Help Center",
		description:
			"Step-by-step guides covering configuration, workflows, and best practices.",
		href: "/kb",
		icon: BookOpen,
		color: "from-blue-500/10 to-cyan-500/10 border-blue-500/30",
		iconBg: "bg-blue-500/10",
		iconColor: "text-blue-600 dark:text-blue-400",
	},
	{
		title: "Thorbis University",
		description:
			"Role-based training paths with quizzes and certifications.",
		href: "/templates?tag=training",
		icon: GraduationCap,
		color: "from-violet-500/10 to-purple-500/10 border-violet-500/30",
		iconBg: "bg-violet-500/10",
		iconColor: "text-violet-600 dark:text-violet-400",
	},
	{
		title: "Live office hours",
		description:
			"Weekly drop-in sessions with success managers and solution architects.",
		href: "/webinars",
		icon: Calendar,
		color: "from-emerald-500/10 to-green-500/10 border-emerald-500/30",
		iconBg: "bg-emerald-500/10",
		iconColor: "text-emerald-600 dark:text-emerald-400",
	},
	{
		title: "Community Forum",
		description:
			"Share playbooks, ask peers, and access customer-only templates.",
		href: "/community",
		icon: Users,
		color: "from-amber-500/10 to-orange-500/10 border-amber-500/30",
		iconBg: "bg-amber-500/10",
		iconColor: "text-amber-600 dark:text-amber-400",
	},
];

const SUPPORT_PACKAGES = [
	{
		name: "Launch Essentials",
		description:
			"Included with every plan. Guided migration, go-live support, and success manager check-ins for the first 60 days.",
		features: [
			"Dedicated migration engineer",
			"Thorbis university training portal",
			"Bi-weekly success calls (first 2 months)",
		],
		color: "from-blue-500/10 to-cyan-500/10 border-blue-500/30",
		iconBg: "bg-blue-500/10",
		iconColor: "text-blue-600 dark:text-blue-400",
		icon: ClipboardCheck,
		badge: "Included",
	},
	{
		name: "Growth Accelerator",
		description:
			"For teams scaling multi-location operations or adopting advanced automations. Adds change management and analytics coaching.",
		features: [
			"In-depth process redesign workshops",
			"Custom dashboard configuration",
			"Monthly adoption & revenue reviews",
		],
		color: "from-violet-500/10 to-purple-500/10 border-violet-500/30",
		iconBg: "bg-violet-500/10",
		iconColor: "text-violet-600 dark:text-violet-400",
		icon: Zap,
		badge: "Popular",
	},
	{
		name: "Enterprise Elite",
		description:
			"White-glove program with 24/7 support, sandbox environments, and embedded Thorbis specialists.",
		features: [
			"Quarterly onsite optimization sessions",
			"Executive sponsor & named product liaison",
			"Advanced security & integration reviews",
		],
		color: "from-amber-500/10 to-orange-500/10 border-amber-500/30",
		iconBg: "bg-amber-500/10",
		iconColor: "text-amber-600 dark:text-amber-400",
		icon: HeadphonesIcon,
		badge: "Enterprise",
	},
];

const KPI_TARGETS = [
	{ metric: "Go-live readiness", value: "30 days", description: "Checklist completed" },
	{ metric: "Dispatch adoption", value: ">90%", description: "Within first week" },
	{ metric: "AI assistant", value: "40%", description: "Handling calls by week six" },
	{ metric: "Portal activation", value: ">60%", description: "After training campaign" },
];

const FAQS = [
	{
		question: "How long does implementation take?",
		answer:
			"Most contractors launch in 45 days or less. Complex, multi-brand deployments may expand to 60 days with phased rollouts.",
	},
	{
		question: "Who is on the Thorbis implementation team?",
		answer:
			"You'll work with a migration engineer, solution architect, customer success manager, and optional AI strategist depending on your plan.",
	},
	{
		question: "Do you offer onsite training?",
		answer:
			"Yes. Growth Accelerator and Enterprise Elite packages include optional onsite workshops for dispatchers, techs, and leadership.",
	},
	{
		question: "How are integrations handled?",
		answer:
			"Thorbis implementation includes QuickBooks, payment processors, and core integrations. Additional systems leverage our open API or partner network.",
	},
];

const breadcrumbLd = generateBreadcrumbStructuredData([
	{ name: "Home", url: siteUrl },
	{ name: "Implementation", url: `${siteUrl}/implementation` },
]);

const howToLd = createHowToSchema({
	name: "Thorbis Implementation Playbook",
	description:
		"Three-phase process to migrate, train, and optimize your field service team on Thorbis.",
	steps: PHASES.map((phase, index) => ({
		name: phase.title,
		text: phase.description,
		position: index + 1,
	})),
	supplies: ["Data exports", "Process documentation", "Training roster"],
	totalTime: "P45D",
});

const faqLd = generateFAQStructuredData(FAQS);

const serviceLd = generateServiceStructuredData({
	name: "Thorbis Implementation & Success",
	description:
		"Guided migration and customer success program for field service contractors adopting Thorbis.",
	serviceType: "ImplementationService",
	offers: [
		{
			price: "Included",
			currency: "USD",
			description: "Launch Essentials included with all Thorbis plans.",
		},
		{
			price: "Custom",
			currency: "USD",
			description:
				"Growth Accelerator and Enterprise Elite tailored to your roadmap.",
		},
	],
});

export default function ImplementationPage() {
	return (
		<>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
				id="implementation-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
				id="implementation-howto-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
				id="implementation-faq-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
				id="implementation-service-ld"
				type="application/ld+json"
			/>

			<div className="container mx-auto space-y-20 px-4 py-16 sm:px-6 lg:px-8">
				{/* Hero Section */}
				<section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-cyan-600/20 via-background to-teal-500/5 p-8 sm:p-12 lg:p-16">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-cyan-500/10 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-teal-500/10 blur-3xl" />

					<div className="mx-auto max-w-3xl space-y-6 text-center">
						<Badge className="px-4 py-1.5 font-medium tracking-wide uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
							<Rocket className="mr-2 size-4" />
							Implementation & Success
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
							Launch Thorbis in 45 days with migration experts by your side
						</h1>
						<p className="text-muted-foreground text-lg leading-relaxed sm:text-xl">
							Dedicated migration engineers, AI strategists, and customer success
							coaches guide your team from day-one planning to long-term
							optimization. Implementation is included in the $200/month base
							subscription with pay-as-you-go usage—no surprise onboarding fees
							and no lock-in.
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							<Button asChild className="group" size="lg">
								<Link href="/waitlist">
									Join Waitlist
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/switch">Explore migration center</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Phases Section */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							Onboarding Blueprint
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Three-phase onboarding blueprint
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							A proven implementation methodology honed with hundreds of
							contractors moving from ServiceTitan, Housecall Pro, Jobber, and
							custom tools.
						</p>
					</div>
					<div className="grid gap-6 lg:grid-cols-3">
						{PHASES.map((phase, index) => {
							const Icon = phase.icon;
							return (
								<Card
									className={`h-full border-2 bg-gradient-to-br transition-all hover:shadow-lg ${phase.color}`}
									key={phase.title}
								>
									<CardHeader className="space-y-3">
										<div className="flex items-center gap-3">
											<div className={`flex size-12 items-center justify-center rounded-xl ${phase.iconBg}`}>
												<Icon className={`size-6 ${phase.iconColor}`} />
											</div>
											<Badge variant="secondary" className="text-xs">
												Phase {index + 1}
											</Badge>
										</div>
										<CardTitle className="text-xl">{phase.title}</CardTitle>
										<p className="text-muted-foreground text-sm leading-relaxed">
											{phase.description}
										</p>
									</CardHeader>
									<CardContent>
										<ul className="space-y-2">
											{phase.bullets.map((bullet) => (
												<li className="flex items-start gap-2 text-sm" key={bullet}>
													<CheckCircle className={`size-4 shrink-0 mt-0.5 ${phase.iconColor}`} />
													<span className="text-muted-foreground">{bullet}</span>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* Resources Section */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							Training & Resources
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Enablement resources for every role
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Technicians, dispatchers, finance, and leadership receive
							tailored instruction through live sessions and on-demand
							content.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
						{RESOURCES.map((resource) => {
							const Icon = resource.icon;
							return (
								<Card
									className={`h-full border-2 bg-gradient-to-br transition-all hover:shadow-lg ${resource.color}`}
									key={resource.title}
								>
									<CardHeader className="space-y-3">
										<div className={`flex size-12 items-center justify-center rounded-xl ${resource.iconBg}`}>
											<Icon className={`size-6 ${resource.iconColor}`} />
										</div>
										<CardTitle className="text-lg">{resource.title}</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<p className="text-muted-foreground text-sm leading-relaxed">
											{resource.description}
										</p>
										<Button asChild variant="outline" className="w-full group">
											<Link href={resource.href}>
												Explore
												<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
											</Link>
										</Button>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* Support Packages Section */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							Success Packages
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Success packages designed for every growth stage
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Choose the support level that matches your expansion plans. All
							packages include proactive guidance and metrics reviews.
						</p>
					</div>
					<div className="grid gap-6 lg:grid-cols-3">
						{SUPPORT_PACKAGES.map((pkg) => {
							const Icon = pkg.icon;
							return (
								<Card
									className={`h-full flex flex-col border-2 bg-gradient-to-br transition-all hover:shadow-lg ${pkg.color}`}
									key={pkg.name}
								>
									<CardHeader>
										<div className="flex items-center justify-between mb-3">
											<div className={`flex size-12 items-center justify-center rounded-xl ${pkg.iconBg}`}>
												<Icon className={`size-6 ${pkg.iconColor}`} />
											</div>
											<Badge variant="secondary" className="text-xs">
												{pkg.badge}
											</Badge>
										</div>
										<CardTitle className="text-xl">{pkg.name}</CardTitle>
									</CardHeader>
									<CardContent className="flex flex-1 flex-col justify-between space-y-4">
										<p className="text-muted-foreground text-sm leading-relaxed">
											{pkg.description}
										</p>
										<div className="space-y-2 pt-4 border-t border-border/50">
											{pkg.features.map((feature) => (
												<div className="flex items-start gap-2 text-sm" key={feature}>
													<CheckCircle className={`size-4 shrink-0 mt-0.5 ${pkg.iconColor}`} />
													<span className="text-muted-foreground">{feature}</span>
												</div>
											))}
										</div>
										<Button asChild variant="outline" className="w-full group mt-4">
											<Link href="/waitlist">
												Get started
												<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
											</Link>
										</Button>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* Testimonial & KPIs Section */}
				<section className="grid gap-6 lg:grid-cols-2">
					<Card className="relative overflow-hidden border-2 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border-cyan-500/30">
						<div className="absolute top-4 right-4 opacity-10">
							<Quote className="size-24 text-cyan-600" />
						</div>
						<CardContent className="flex h-full flex-col justify-center space-y-6 p-8">
							<div className="flex items-center gap-2">
								<MessageSquare className="size-5 text-cyan-600 dark:text-cyan-400" />
								<span className="text-cyan-600 dark:text-cyan-400 text-sm font-medium tracking-wide uppercase">
									Customer spotlight
								</span>
							</div>
							<p className="text-2xl font-semibold leading-relaxed">
								"Thorbis migrated our multi-branch ServiceTitan deployment in
								42 days. Dispatchers were live day one, and AI booking added
								11% more jobs in the first month."
							</p>
							<p className="text-muted-foreground">
								— Leslie Warren, COO, Elevate Mechanical
							</p>
						</CardContent>
					</Card>
					<Card className="border-2 hover:border-primary/30 transition-all hover:shadow-lg">
						<CardHeader>
							<Badge className="w-fit mb-2" variant="secondary">
								Success Metrics
							</Badge>
							<CardTitle className="text-xl">
								Implementation KPI targets
							</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-2 gap-4">
							{KPI_TARGETS.map((kpi) => (
								<div
									className="rounded-xl border bg-muted/30 p-4 text-center"
									key={kpi.metric}
								>
									<p className="text-2xl font-bold text-primary">{kpi.value}</p>
									<p className="text-sm font-medium">{kpi.metric}</p>
									<p className="text-muted-foreground text-xs mt-1">{kpi.description}</p>
								</div>
							))}
						</CardContent>
					</Card>
				</section>

				{/* FAQ Section */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							FAQ
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Implementation FAQ
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

				{/* CTA Section */}
				<section className="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-10 text-center">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />

					<div className="relative space-y-6 max-w-3xl mx-auto">
						<div className="flex items-center justify-center gap-2">
							<Rocket className="size-5 text-primary" />
							<span className="text-muted-foreground text-sm font-medium">
								Launch in 45 days or less
							</span>
						</div>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Ready to start your implementation?
						</h2>
						<p className="text-muted-foreground text-lg">
							Join the waitlist and our team will reach out to discuss your
							migration timeline and success goals.
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							<Button asChild className="group" size="lg">
								<Link href="/waitlist">
									Start implementation planning
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/free-tools">Download rollout templates</Link>
							</Button>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
