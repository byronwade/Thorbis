import {
	ArrowRight,
	Building2,
	Calendar,
	Heart,
	Lightbulb,
	Shield,
	Target,
	Users,
} from "lucide-react";
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
		icon: Users,
	},
	{
		title: "Automation with empathy",
		description:
			"AI should empower humans. We design automation to remove drudgery while enhancing the customer experience.",
		icon: Heart,
	},
	{
		title: "Measure outcomes, not features",
		description:
			"Every release is tied to customer metrics—faster booking, higher close rates, lower DSO—not vanity checklists.",
		icon: Target,
	},
	{
		title: "Secure and dependable",
		description:
			"We treat customer data like our own. SOC 2 aligned processes, encryption, and 99.9%+ uptime are baked into our culture.",
		icon: Shield,
	},
];

const HISTORY = [
	{
		year: "2019",
		milestone: "Thorbis founded to modernize trade operations",
		detail:
			"Our founding team met while building software for national HVAC brands. We set out to give every contractor enterprise-grade tools.",
		icon: Lightbulb,
	},
	{
		year: "2021",
		milestone: "Launched AI call handling and mobile workflows",
		detail:
			"Thorbis AI Assistant answered the first customer call, and the mobile app delivered offline checklists to 5,000 technicians.",
		icon: Building2,
	},
	{
		year: "2023",
		milestone: "Expanded to multi-location and enterprise customers",
		detail:
			"Support for complex org structures, role-based permissions, and inter-branch reporting arrived with our Growth tier.",
		icon: Users,
	},
	{
		year: "2024",
		milestone: "Introduced marketing automation & analytics suite",
		detail:
			"Service businesses finally tied campaigns, proposals, and revenue together—no third-party tools required.",
		icon: Target,
	},
];

const TEAM_STATS = [
	{
		stat: "25+",
		label: "Team Members",
		description: "Distributed across North America",
	},
	{
		stat: "150+",
		label: "Years Combined Experience",
		description: "In field service technology",
	},
	{
		stat: "100%",
		label: "Remote-First",
		description: "Work from anywhere culture",
	},
	{
		stat: "4",
		label: "Quarterly Onsites",
		description: "Team building & customer discovery",
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
			<div className="container mx-auto space-y-20 px-4 py-16 sm:px-6 lg:px-8">
				{/* Hero Section - Enhanced with gradient */}
				<section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 sm:p-12 lg:p-16">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />

					<div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
						<div className="space-y-6">
							<Badge className="px-4 py-1.5 font-medium tracking-wide uppercase bg-primary/10 text-primary">
								Our mission
							</Badge>
							<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
								Powering the world's most trusted service companies
							</h1>
							<p className="text-muted-foreground text-lg leading-relaxed sm:text-xl">
								Thorbis builds software that helps home service and commercial
								trades deliver elite customer experiences. From the first phone
								call to final invoice, we use AI and automation to remove friction
								and let people focus on what matters—delighting customers.
							</p>
							<div className="border-border/50 flex flex-wrap items-center gap-6 border-t pt-6">
								<div className="flex items-center gap-2">
									<span className="text-primary font-semibold">$200/month</span>
									<span className="text-muted-foreground text-sm">base subscription</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-primary font-semibold">Unlimited</span>
									<span className="text-muted-foreground text-sm">users included</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-primary font-semibold">Zero</span>
									<span className="text-muted-foreground text-sm">lock-in</span>
								</div>
							</div>
							<div className="flex flex-wrap gap-3">
								<Button asChild className="group" size="lg">
									<Link href="/waitlist">
										Join Waitlist
										<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
									</Link>
								</Button>
								<Button asChild size="lg" variant="outline">
									<Link href="/careers">Join Our Team</Link>
								</Button>
							</div>
						</div>
						<div className="relative hidden h-[400px] rounded-3xl border overflow-hidden lg:block">
							<Image
								alt="Thorbis team collaborating"
								className="object-cover"
								fill
								priority
								sizes="540px"
								src="https://images.unsplash.com/photo-1523419409543-0c1df022bdd1?auto=format&fit=crop&w=1600&q=80"
							/>
						</div>
					</div>
				</section>

				{/* Values Section - Enhanced */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							Our Values
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							What we believe
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							These principles guide every decision we make, from product development to customer support.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						{VALUES.map((value) => {
							const Icon = value.icon;
							return (
								<Card
									className="border-2 transition-all hover:shadow-lg hover:border-primary/30 bg-gradient-to-br from-background to-muted/20"
									key={value.title}
								>
									<CardHeader>
										<div className="flex items-center gap-4">
											<div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
												<Icon className="size-6 text-primary" />
											</div>
											<CardTitle className="text-xl">{value.title}</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<CardDescription className="text-base leading-relaxed">
											{value.description}
										</CardDescription>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				{/* History Section - Enhanced Timeline */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							Our Journey
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Our story
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							From founding to today, we've been on a mission to transform how service companies operate.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						{HISTORY.map((entry, index) => {
							const Icon = entry.icon;
							const colors = [
								"from-blue-500/10 to-cyan-500/10 border-blue-500/30",
								"from-violet-500/10 to-purple-500/10 border-violet-500/30",
								"from-emerald-500/10 to-green-500/10 border-emerald-500/30",
								"from-orange-500/10 to-amber-500/10 border-orange-500/30",
							];
							const textColors = [
								"text-blue-600 dark:text-blue-400",
								"text-violet-600 dark:text-violet-400",
								"text-emerald-600 dark:text-emerald-400",
								"text-orange-600 dark:text-orange-400",
							];
							const bgColors = [
								"bg-blue-500/10",
								"bg-violet-500/10",
								"bg-emerald-500/10",
								"bg-orange-500/10",
							];
							return (
								<div
									className={`rounded-2xl border-2 bg-gradient-to-br p-6 transition-all hover:shadow-lg ${colors[index]}`}
									key={entry.year}
								>
									<div className="flex items-center gap-4 mb-4">
										<div className={`flex size-12 items-center justify-center rounded-xl ${bgColors[index]}`}>
											<Icon className={`size-6 ${textColors[index]}`} />
										</div>
										<div>
											<p className={`text-sm font-bold uppercase ${textColors[index]}`}>
												{entry.year}
											</p>
											<h3 className="text-lg font-semibold">{entry.milestone}</h3>
										</div>
									</div>
									<p className="text-muted-foreground text-sm leading-relaxed">
										{entry.detail}
									</p>
								</div>
							);
						})}
					</div>
				</section>

				{/* Team Stats Section - Enhanced */}
				<section className="space-y-8">
					<div className="text-center max-w-3xl mx-auto">
						<Badge className="mb-4" variant="secondary">
							The Team
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Who we are
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							We're a team of operators, engineers, and customer advocates who've spent our careers
							building software for service businesses. We know the pain of missed calls, scheduling chaos,
							and late payments—because we've lived it.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
						{TEAM_STATS.map((item) => (
							<Card
								className="text-center border-2 hover:border-primary/30 transition-all hover:shadow-lg bg-gradient-to-br from-primary/5 to-transparent"
								key={item.label}
							>
								<CardHeader className="pb-2">
									<CardTitle className="text-primary text-5xl font-bold">
										{item.stat}
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-1">
									<p className="text-foreground text-lg font-semibold">
										{item.label}
									</p>
									<p className="text-muted-foreground text-sm">
										{item.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* CTA Section - Enhanced */}
				<section className="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-10 text-center">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />

					<div className="relative space-y-6 max-w-3xl mx-auto">
						<div className="flex items-center justify-center gap-2">
							<Calendar className="size-5 text-primary" />
							<span className="text-muted-foreground text-sm font-medium">
								Quarterly onsites focused on customer empathy
							</span>
						</div>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Ready to join our mission?
						</h2>
						<p className="text-muted-foreground text-lg">
							Thorbis operates as a distributed-first company with teammates
							across North America. We're always looking for passionate people who
							want to help service businesses thrive.
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							<Button asChild className="group" size="lg">
								<Link href="/waitlist">
									Join Waitlist
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/careers">View Open Positions</Link>
							</Button>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
