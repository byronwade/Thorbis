import Link from "next/link";
import Script from "next/script";
import { ArrowRight, LayoutGrid, Rocket } from "lucide-react";

import { getMarketingIcon } from "@/components/marketing/marketing-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getFeatureBySlug } from "@/lib/marketing/features";
import type { MarketingValueProp } from "@/lib/marketing/types";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";
import { cn } from "@/lib/utils";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const solutionsKeywords = generateSemanticKeywords("solutions");

export const metadata = generateSEOMetadata({
	title: "Solutions for Service Businesses",
	section: "Solutions",
	description:
		"Explore Thorbis solutions for AI call handling, dispatch, field mobility, CRM, payments, and customer experience. Every page ties into SEO-friendly deep dives for trades operators.",
	path: "/solutions",
	keywords: [
		"field service solutions",
		"contractor software modules",
		"thorbis solutions",
		"service business software",
		"field service management solutions",
		"service business tools",
		...solutionsKeywords.slice(0, 5),
	],
});

type SolutionGroupConfig = {
	heading: string;
	description: string;
	features: {
		slug: string;
		label: string;
		highlight?: string;
	}[];
};

type SolutionGroupConfigWithStyle = SolutionGroupConfig & {
	gradient: string;
	accentColor: string;
	icon: string;
};

const SOLUTION_GROUPS: SolutionGroupConfigWithStyle[] = [
	{
		heading: "Automation & AI",
		description:
			"Book every opportunity and run lifecycle campaigns without adding headcount.",
		gradient: "from-violet-600/20 via-purple-500/10 to-transparent dark:from-violet-500/30 dark:via-purple-500/15",
		accentColor: "text-violet-600 dark:text-violet-400",
		icon: "bot",
		features: [
			{ slug: "ai-assistant", label: "AI Assistant", highlight: "24/7 intake" },
			{
				slug: "marketing",
				label: "Marketing Automation",
				highlight: "Lifecycle journeys",
			},
		],
	},
	{
		heading: "Operations Control",
		description:
			"Dispatch, CRM, and mobile tools that keep office and field teams perfectly in sync.",
		gradient: "from-blue-600/20 via-indigo-500/10 to-transparent dark:from-blue-500/30 dark:via-indigo-500/15",
		accentColor: "text-blue-600 dark:text-blue-400",
		icon: "layout-dashboard",
		features: [
			{
				slug: "scheduling",
				label: "Scheduling & Dispatch",
				highlight: "Smart board",
			},
			{ slug: "mobile-app", label: "Mobile Field App", highlight: "Offline" },
			{ slug: "crm", label: "CRM & Sales", highlight: "Account insights" },
		],
	},
	{
		heading: "Revenue & Finance",
		description:
			"Invoice faster, sync with accounting, and protect cash flow in one workspace.",
		gradient: "from-emerald-600/20 via-teal-500/10 to-transparent dark:from-emerald-500/30 dark:via-teal-500/15",
		accentColor: "text-emerald-600 dark:text-emerald-400",
		icon: "wallet",
		features: [
			{
				slug: "invoicing",
				label: "Invoicing & Payments",
				highlight: "0% processing",
			},
			{
				slug: "quickbooks",
				label: "QuickBooks Sync",
				highlight: "Two-way data",
			},
		],
	},
	{
		heading: "Customer Experience",
		description:
			"Give homeowners and commercial clients a premium digital journey from booking to payment.",
		gradient: "from-rose-600/20 via-pink-500/10 to-transparent dark:from-rose-500/30 dark:via-pink-500/15",
		accentColor: "text-rose-600 dark:text-rose-400",
		icon: "users",
		features: [
			{
				slug: "customer-portal",
				label: "Customer Portal",
				highlight: "Self-service",
			},
			{
				slug: "online-booking",
				label: "Online Booking",
				highlight: "Instant scheduling",
			},
		],
	},
];

type ResourceLink = {
	label: string;
	href: string;
	description: string;
	icon: string;
	category: "Learning" | "Tools" | "Support" | "Community";
};

const RESOURCE_LINKS: ResourceLink[] = [
	{
		label: "Blog",
		href: "/blog",
		description: "Field-tested growth playbooks and product updates.",
		icon: "file-text",
		category: "Learning",
	},
	{
		label: "Case Studies",
		href: "/case-studies",
		description: "Deep dives on dispatch cleanups and cash acceleration.",
		icon: "clipboard-check",
		category: "Learning",
	},
	{
		label: "Webinars & Events",
		href: "/webinars",
		description: "Live and on-demand sessions with trade operators.",
		icon: "calendar",
		category: "Learning",
	},
	{
		label: "Integrations Directory",
		href: "/integrations",
		description: "Connect CRMs, accounting, and marketing stacks.",
		icon: "link",
		category: "Tools",
	},
	{
		label: "ROI Calculator",
		href: "/roi",
		description: "Model savings from AI intake, routing, and faster cash.",
		icon: "calculator",
		category: "Tools",
	},
	{
		label: "Templates & Tools",
		href: "/templates",
		description: "Download proposal packs, call scripts, and SOPs.",
		icon: "download",
		category: "Tools",
	},
	{
		label: "Free Tools Library",
		href: "/free-tools",
		description: "Calculators, checklists, and benchmarking utilities.",
		icon: "library",
		category: "Tools",
	},
	{
		label: "Help Center",
		href: "/help",
		description: "Step-by-step product guides and troubleshooting.",
		icon: "graduation-cap",
		category: "Support",
	},
	{
		label: "API Documentation",
		href: "/api-docs",
		description: "Extend Thorbis with custom workflows and reporting.",
		icon: "settings",
		category: "Support",
	},
	{
		label: "System Status",
		href: "/status",
		description: "Live uptime and incident history for every service.",
		icon: "gauge",
		category: "Support",
	},
	{
		label: "Community Forum",
		href: "/community",
		description: "Trade operators swap best practices and automations.",
		icon: "users",
		category: "Community",
	},
	{
		label: "Reviews & Testimonials",
		href: "/reviews",
		description: "Hear from HVAC, plumbing, electrical, and roofing teams.",
		icon: "trophy",
		category: "Community",
	},
] as const;

const COMPANY_LINKS = [
	{ label: "About Us", href: "/about" },
	{ label: "Pricing", href: "/pricing" },
	{ label: "Careers", href: "/careers" },
	{ label: "Partners", href: "/partners" },
	{ label: "Press & Media", href: "/press" },
	{ label: "Join Waitlist", href: "/waitlist" },
	{ label: "Implementation & Success", href: "/implementation" },
	{ label: "Security", href: "/security" },
] as const;

type SolutionFeature = {
	slug: string;
	label: string;
	highlight?: string;
	heroTitle: string;
	summary: string;
	heroEyebrow?: string;
	valueProps?: MarketingValueProp[];
};

function buildSolutionGroups(): {
	heading: string;
	description: string;
	gradient: string;
	accentColor: string;
	icon: string;
	features: SolutionFeature[];
}[] {
	return SOLUTION_GROUPS.map((group) => {
		const features = group.features.reduce<SolutionFeature[]>((acc, item) => {
			const feature = getFeatureBySlug(item.slug);
			if (!feature) {
				return acc;
			}

			acc.push({
				slug: feature.slug,
				label: item.label,
				highlight: item.highlight,
				heroTitle: feature.heroTitle,
				heroEyebrow: feature.heroEyebrow,
				summary: feature.summary,
				valueProps: feature.valueProps,
			});

			return acc;
		}, []);

		return {
			heading: group.heading,
			description: group.description,
			gradient: group.gradient,
			accentColor: group.accentColor,
			icon: group.icon,
			features,
		};
	}).filter((group) => group.features.length > 0);
}

export default function SolutionsOverviewPage() {
	const solutionGroups = buildSolutionGroups();

	const itemListStructuredData = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: solutionGroups
			.flatMap((group) => group.features)
			.map((feature, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: feature.label,
				url: `${siteUrl}/features/${feature.slug}`,
			})),
	};

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Solutions", url: `${siteUrl}/solutions` },
						]),
					),
				}}
				id="solutions-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(itemListStructuredData),
				}}
				id="solutions-item-list-ld"
				type="application/ld+json"
			/>
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				{/* Enhanced Hero Section */}
				<section className="relative mx-auto mb-20 overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 sm:p-12 lg:p-16">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
					<header className="relative mx-auto max-w-3xl text-center">
						<Badge className="mb-4 bg-primary/10 text-primary" variant="secondary">
							Thorbis Solutions
						</Badge>
						<div className="mb-6 flex justify-center">
							<div className="bg-primary/10 text-primary rounded-full p-4">
								<LayoutGrid className="size-8" />
							</div>
						</div>
						<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
							Everything you need to run a modern service business
						</h1>
						<p className="text-muted-foreground mt-6 text-lg leading-relaxed sm:text-xl">
							Explore our complete platform solutions designed for field service
							operators. From AI-powered intake to seamless payments, each module
							works together to help you grow faster and serve customers better.
						</p>
						<div className="mt-8 flex flex-wrap justify-center gap-3">
							<Button asChild size="lg" className="group">
								<Link href="/waitlist">
									Join Waitlist
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/pricing">View Pricing</Link>
							</Button>
						</div>
					</header>
				</section>

				<div className="space-y-16">
					{solutionGroups.map((group) => {
						const GroupIcon = getMarketingIcon(group.icon);
						// Map accent colors to background colors
						const bgColorMap: Record<string, string> = {
							"text-violet-600 dark:text-violet-400":
								"bg-violet-500/10 dark:bg-violet-500/10",
							"text-blue-600 dark:text-blue-400":
								"bg-blue-500/10 dark:bg-blue-500/10",
							"text-emerald-600 dark:text-emerald-400":
								"bg-emerald-500/10 dark:bg-emerald-500/10",
							"text-rose-600 dark:text-rose-400":
								"bg-rose-500/10 dark:bg-rose-500/10",
						};
						const bgColor = bgColorMap[group.accentColor] || "bg-primary/10";
						return (
							<section key={group.heading}>
								<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
									<div className="flex items-center gap-4">
										<div className={cn("rounded-lg p-3", bgColor)}>
											<GroupIcon className={cn("size-6", group.accentColor)} />
										</div>
										<div>
											<p
												className={cn(
													"text-sm font-semibold tracking-wide uppercase",
													group.accentColor,
												)}
											>
												{group.heading}
											</p>
											<h2 className="text-foreground mt-1 text-2xl font-semibold">
												{group.description}
											</h2>
										</div>
									</div>
									<Link
										className={cn(
											"text-sm font-semibold underline underline-offset-4 transition-colors hover:opacity-80",
											group.accentColor,
										)}
										href="/features"
									>
										Browse all features →
									</Link>
								</div>

								<div className="grid gap-6 md:grid-cols-2">
									{group.features.map((feature) => {
										const FeatureIcon = getMarketingIcon(
											feature.valueProps?.[0]?.icon ?? "sparkles",
										);
										return (
											<Card
												className={cn(
													"group relative flex h-full flex-col justify-between overflow-hidden border transition-all hover:shadow-lg",
													`bg-gradient-to-br ${group.gradient}`,
													"border-border/70 hover:border-primary/40",
												)}
												key={feature.slug}
											>
												<CardHeader className="space-y-4">
													<div className="flex items-start justify-between">
														<div className="flex flex-wrap items-center gap-2">
															<Badge variant="outline">{feature.label}</Badge>
															{feature.highlight ? (
																<span
																	className={cn(
																		"rounded-full px-3 py-1 text-xs font-semibold",
																		bgColor,
																		group.accentColor,
																	)}
																>
																	{feature.highlight}
																</span>
															) : null}
														</div>
														<div
															className={cn(
																"rounded-lg p-2 opacity-60 transition-opacity group-hover:opacity-100",
																bgColor,
															)}
														>
															<FeatureIcon
																className={cn("size-5", group.accentColor)}
															/>
														</div>
													</div>
													{feature.heroEyebrow ? (
														<p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
															{feature.heroEyebrow}
														</p>
													) : null}
													<CardTitle className="text-2xl">
														{feature.heroTitle}
													</CardTitle>
													<CardDescription className="text-base">
														{feature.summary}
													</CardDescription>
												</CardHeader>
												<CardContent className="flex flex-col gap-5">
													{feature.valueProps && feature.valueProps.length > 0 ? (
														<ul className="text-muted-foreground space-y-2.5 text-sm">
															{feature.valueProps.slice(0, 2).map((value) => (
																<li className="flex gap-2.5" key={value.title}>
																	<span
																		className={cn(
																			"mt-1 font-semibold",
																			group.accentColor,
																		)}
																	>
																		•
																	</span>
																	<span>
																		<span className="font-semibold">
																			{value.title}:{" "}
																		</span>
																		{value.description}
																	</span>
																</li>
															))}
														</ul>
													) : null}
													<div className="flex flex-wrap gap-3">
														<Button asChild className="group/btn">
															<Link href={`/features/${feature.slug}`}>
																Explore {feature.label}
																<ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
															</Link>
														</Button>
														<Button asChild variant="ghost">
															<Link href="/waitlist">Join Waitlist</Link>
														</Button>
													</div>
												</CardContent>
											</Card>
										);
									})}
								</div>
							</section>
						);
					})}
				</div>

				<section className="relative mt-20 overflow-hidden rounded-3xl border bg-gradient-to-br from-blue-600/10 via-indigo-500/5 to-transparent p-8 sm:p-12 lg:p-16">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-blue-500/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-indigo-500/5 blur-3xl" />
					<div className="relative mx-auto max-w-3xl text-center">
						<Badge className="mb-4 bg-blue-500/10 text-blue-700 dark:text-blue-300">
							Switch Programs
						</Badge>
						<div className="mb-6 flex justify-center">
							<div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full p-4">
								<Rocket className="size-8" />
							</div>
						</div>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Moving from ServiceTitan or Housecall Pro?
						</h2>
						<p className="text-muted-foreground mt-4 text-lg leading-relaxed">
							Our white-glove team migrates your data, recreates automations, and
							enables Dispatch AI in under 24 hours. Keep your workflows, drop the
							bloat, and save 60-70% on monthly costs.
						</p>
						<div className="mt-8 flex flex-wrap justify-center gap-3">
							<Button asChild size="lg" className="group">
								<Link href="/switch">
									Switch to Thorbis
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/vs/servicetitan">Compare ServiceTitan</Link>
							</Button>
						</div>
					</div>
				</section>

				<section className="mt-20">
					<div className="mx-auto mb-12 max-w-3xl text-center">
						<Badge className="mb-4" variant="secondary">
							Resource Library
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight">
							Everything your team needs to get started
						</h2>
						<p className="text-muted-foreground mt-3 text-lg leading-relaxed">
							Explore guides, tools, and resources designed to help you make the
							right decision and succeed with Thorbis.
						</p>
					</div>
					{(() => {
						const categories = [
							"Learning",
							"Tools",
							"Support",
							"Community",
						] as const;
						return (
							<div className="space-y-12">
								{categories.map((category) => {
									const categoryResources = RESOURCE_LINKS.filter(
										(resource) => resource.category === category,
									);
									if (categoryResources.length === 0) return null;
									return (
										<div key={category}>
											<h3 className="text-primary mb-4 text-lg font-semibold">
												{category}
											</h3>
											<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
												{categoryResources.map((item) => {
													const ResourceIcon = getMarketingIcon(item.icon);
													return (
														<Link
															className="group border-border/60 bg-card/70 hover:border-primary/60 rounded-2xl border p-5 transition-all hover:shadow-lg hover:shadow-primary/5"
															href={item.href}
															key={item.href}
														>
															<div className="mb-3 flex items-center gap-3">
																<div className="bg-primary/10 text-primary rounded-lg p-2 transition-transform group-hover:scale-110">
																	<ResourceIcon className="size-5" />
																</div>
																<p className="text-foreground text-base font-semibold">
																	{item.label}
																</p>
															</div>
															<p className="text-muted-foreground text-sm leading-relaxed">
																{item.description}
															</p>
														</Link>
													);
												})}
											</div>
										</div>
									);
								})}
							</div>
						);
					})()}
				</section>

				<section className="mt-20">
					<div className="mx-auto mb-12 max-w-3xl text-center">
						<Badge className="mb-4" variant="secondary">
							Company & Trust
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight">
							Learn about the team behind Thorbis
						</h2>
						<p className="text-muted-foreground mt-3 text-lg leading-relaxed">
							Explore our company, pricing, careers, and security resources that
							buyers, partners, and analysts need to make informed decisions.
						</p>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{COMPANY_LINKS.map((item) => (
							<Link
								className="group border-border/60 bg-background hover:border-primary/60 rounded-2xl border p-5 text-left transition-all hover:shadow-lg hover:shadow-primary/5"
								href={item.href}
								key={item.href}
							>
								<p className="text-foreground text-base font-semibold transition-colors group-hover:text-primary">
									{item.label}
								</p>
								<p className="text-muted-foreground mt-2 flex items-center gap-1 text-sm">
									Learn more
									<ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
								</p>
							</Link>
						))}
					</div>
				</section>

				<section className="relative mt-20 overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-10 sm:p-12 lg:p-16 text-center">
					<div className="absolute top-0 right-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
					<div className="relative mx-auto max-w-2xl">
						<Badge className="mb-4 bg-primary/10 text-primary" variant="secondary">
							Ready to get started?
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Join the waitlist or schedule a demo
						</h2>
						<p className="text-muted-foreground mt-4 text-lg leading-relaxed">
							Thorbis is $200/month base plus usage, unlimited users, and data
							exports whenever you like. No contracts, no surprise add-ons.
						</p>
						<div className="mt-8 flex flex-wrap justify-center gap-3">
							<Button asChild size="lg" className="group">
								<Link href="/waitlist">
									Join Waitlist
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">Contact Sales</Link>
							</Button>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
