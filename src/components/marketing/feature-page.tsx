import Image from "next/image";
import Link from "next/link";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
	FeatureDesignVariant,
	MarketingFeatureContent,
} from "@/lib/marketing/types";
import { cn } from "@/lib/utils";
import {
	Bot,
	Brain,
	Calculator,
	Calendar,
	CircleDollarSign,
	Cog,
	FileText,
	LayoutGrid,
	Link2,
	MapPin,
	Megaphone,
	Package,
	Smartphone,
	Users,
	Wallet,
} from "lucide-react";
import { getMarketingIcon } from "./marketing-icons";

type FeaturePageProps = {
	feature: MarketingFeatureContent;
};

const variantConfig: Record<
	FeatureDesignVariant,
	{
		heroGradient: string;
		accentColor: string;
		secondaryColor: string;
		icon: React.ReactNode;
		cardStyle: string;
		badgeStyle: string;
		statsStyle: string;
		testimonialStyle: string;
		valueCardStyle: string;
	}
> = {
	neural: {
		heroGradient:
			"from-violet-600/20 via-purple-500/10 to-transparent dark:from-violet-500/30 dark:via-purple-500/15",
		accentColor: "text-violet-600 dark:text-violet-400",
		secondaryColor: "bg-violet-500/10 border-violet-500/20",
		icon: <Brain className="size-8" />,
		cardStyle:
			"border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-purple-500/5",
		badgeStyle: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
		statsStyle:
			"bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-violet-500/15 via-purple-500/10 to-violet-500/15 border-violet-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5 hover:from-violet-500/10 hover:to-purple-500/10",
	},
	connected: {
		heroGradient:
			"from-blue-600/20 via-indigo-500/10 to-transparent dark:from-blue-500/30 dark:via-indigo-500/15",
		accentColor: "text-blue-600 dark:text-blue-400",
		secondaryColor: "bg-blue-500/10 border-blue-500/20",
		icon: <Link2 className="size-8" />,
		cardStyle:
			"border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-indigo-500/5",
		badgeStyle: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
		statsStyle:
			"bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-blue-500/15 border-blue-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 hover:from-blue-500/10 hover:to-indigo-500/10",
	},
	calendar: {
		heroGradient:
			"from-teal-600/20 via-cyan-500/10 to-transparent dark:from-teal-500/30 dark:via-cyan-500/15",
		accentColor: "text-teal-600 dark:text-teal-400",
		secondaryColor: "bg-teal-500/10 border-teal-500/20",
		icon: <Calendar className="size-8" />,
		cardStyle:
			"border-teal-500/30 bg-gradient-to-br from-teal-500/5 to-cyan-500/5",
		badgeStyle: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
		statsStyle:
			"bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-teal-500/15 via-cyan-500/10 to-teal-500/15 border-teal-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-teal-500/5 via-transparent to-cyan-500/5 hover:from-teal-500/10 hover:to-cyan-500/10",
	},
	vibrant: {
		heroGradient:
			"from-orange-600/20 via-amber-500/10 to-transparent dark:from-orange-500/30 dark:via-amber-500/15",
		accentColor: "text-orange-600 dark:text-orange-400",
		secondaryColor: "bg-orange-500/10 border-orange-500/20",
		icon: <Megaphone className="size-8" />,
		cardStyle:
			"border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-amber-500/5",
		badgeStyle: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
		statsStyle:
			"bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-500/15 border-orange-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5 hover:from-orange-500/10 hover:to-amber-500/10",
	},
	gateway: {
		heroGradient:
			"from-indigo-600/20 via-blue-500/10 to-transparent dark:from-indigo-500/30 dark:via-blue-500/15",
		accentColor: "text-indigo-600 dark:text-indigo-400",
		secondaryColor: "bg-indigo-500/10 border-indigo-500/20",
		icon: <LayoutGrid className="size-8" />,
		cardStyle:
			"border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-blue-500/5",
		badgeStyle: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
		statsStyle:
			"bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-indigo-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-indigo-500/15 via-blue-500/10 to-indigo-500/15 border-indigo-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-indigo-500/5 via-transparent to-blue-500/5 hover:from-indigo-500/10 hover:to-blue-500/10",
	},
	grid: {
		heroGradient:
			"from-emerald-600/20 via-green-500/10 to-transparent dark:from-emerald-500/30 dark:via-green-500/15",
		accentColor: "text-emerald-600 dark:text-emerald-400",
		secondaryColor: "bg-emerald-500/10 border-emerald-500/20",
		icon: <LayoutGrid className="size-8" />,
		cardStyle:
			"border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-green-500/5",
		badgeStyle: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
		statsStyle:
			"bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-emerald-500/15 via-green-500/10 to-emerald-500/15 border-emerald-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5 hover:from-emerald-500/10 hover:to-green-500/10",
	},
	compact: {
		heroGradient:
			"from-cyan-600/20 via-sky-500/10 to-transparent dark:from-cyan-500/30 dark:via-sky-500/15",
		accentColor: "text-cyan-600 dark:text-cyan-400",
		secondaryColor: "bg-cyan-500/10 border-cyan-500/20",
		icon: <Smartphone className="size-8" />,
		cardStyle:
			"border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-sky-500/5",
		badgeStyle: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
		statsStyle:
			"bg-gradient-to-br from-cyan-500/10 to-sky-500/10 border-cyan-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-cyan-500/15 via-sky-500/10 to-cyan-500/15 border-cyan-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-cyan-500/5 via-transparent to-sky-500/5 hover:from-cyan-500/10 hover:to-sky-500/10",
	},
	path: {
		heroGradient:
			"from-rose-600/20 via-pink-500/10 to-transparent dark:from-rose-500/30 dark:via-pink-500/15",
		accentColor: "text-rose-600 dark:text-rose-400",
		secondaryColor: "bg-rose-500/10 border-rose-500/20",
		icon: <MapPin className="size-8" />,
		cardStyle:
			"border-rose-500/30 bg-gradient-to-br from-rose-500/5 to-pink-500/5",
		badgeStyle: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
		statsStyle:
			"bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-rose-500/15 border-rose-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-rose-500/5 via-transparent to-pink-500/5 hover:from-rose-500/10 hover:to-pink-500/10",
	},
	storage: {
		heroGradient:
			"from-amber-600/20 via-yellow-500/10 to-transparent dark:from-amber-500/30 dark:via-yellow-500/15",
		accentColor: "text-amber-600 dark:text-amber-400",
		secondaryColor: "bg-amber-500/10 border-amber-500/20",
		icon: <Package className="size-8" />,
		cardStyle:
			"border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-yellow-500/5",
		badgeStyle: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
		statsStyle:
			"bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border-amber-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/5 hover:from-amber-500/10 hover:to-yellow-500/10",
	},
	collective: {
		heroGradient:
			"from-violet-600/20 via-fuchsia-500/10 to-transparent dark:from-violet-500/30 dark:via-fuchsia-500/15",
		accentColor: "text-violet-600 dark:text-violet-400",
		secondaryColor: "bg-violet-500/10 border-violet-500/20",
		icon: <Users className="size-8" />,
		cardStyle:
			"border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5",
		badgeStyle: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
		statsStyle:
			"bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-violet-500/15 border-violet-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 hover:from-violet-500/10 hover:to-fuchsia-500/10",
	},
	ledger: {
		heroGradient:
			"from-green-600/20 via-emerald-500/10 to-transparent dark:from-green-500/30 dark:via-emerald-500/15",
		accentColor: "text-green-600 dark:text-green-400",
		secondaryColor: "bg-green-500/10 border-green-500/20",
		icon: <Wallet className="size-8" />,
		cardStyle:
			"border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5",
		badgeStyle: "bg-green-500/10 text-green-700 dark:text-green-300",
		statsStyle:
			"bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-green-500/15 via-emerald-500/10 to-green-500/15 border-green-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 hover:from-green-500/10 hover:to-emerald-500/10",
	},
	sync: {
		heroGradient:
			"from-sky-600/20 via-blue-500/10 to-transparent dark:from-sky-500/30 dark:via-blue-500/15",
		accentColor: "text-sky-600 dark:text-sky-400",
		secondaryColor: "bg-sky-500/10 border-sky-500/20",
		icon: <Link2 className="size-8" />,
		cardStyle:
			"border-sky-500/30 bg-gradient-to-br from-sky-500/5 to-blue-500/5",
		badgeStyle: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
		statsStyle:
			"bg-gradient-to-br from-sky-500/10 to-blue-500/10 border-sky-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-sky-500/15 border-sky-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-sky-500/5 via-transparent to-blue-500/5 hover:from-sky-500/10 hover:to-blue-500/10",
	},
	proposal: {
		heroGradient:
			"from-fuchsia-600/20 via-pink-500/10 to-transparent dark:from-fuchsia-500/30 dark:via-pink-500/15",
		accentColor: "text-fuchsia-600 dark:text-fuchsia-400",
		secondaryColor: "bg-fuchsia-500/10 border-fuchsia-500/20",
		icon: <FileText className="size-8" />,
		cardStyle:
			"border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/5 to-pink-500/5",
		badgeStyle: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
		statsStyle:
			"bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 border-fuchsia-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-fuchsia-500/15 via-pink-500/10 to-fuchsia-500/15 border-fuchsia-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-fuchsia-500/5 via-transparent to-pink-500/5 hover:from-fuchsia-500/10 hover:to-pink-500/10",
	},
	growth: {
		heroGradient:
			"from-emerald-600/20 via-teal-500/10 to-transparent dark:from-emerald-500/30 dark:via-teal-500/15",
		accentColor: "text-emerald-600 dark:text-emerald-400",
		secondaryColor: "bg-emerald-500/10 border-emerald-500/20",
		icon: <CircleDollarSign className="size-8" />,
		cardStyle:
			"border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-teal-500/5",
		badgeStyle: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
		statsStyle:
			"bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border-emerald-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 hover:from-emerald-500/10 hover:to-teal-500/10",
	},
	calculate: {
		heroGradient:
			"from-slate-600/20 via-zinc-500/10 to-transparent dark:from-slate-500/30 dark:via-zinc-500/15",
		accentColor: "text-slate-600 dark:text-slate-400",
		secondaryColor: "bg-slate-500/10 border-slate-500/20",
		icon: <Calculator className="size-8" />,
		cardStyle:
			"border-slate-500/30 bg-gradient-to-br from-slate-500/5 to-zinc-500/5",
		badgeStyle: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
		statsStyle:
			"bg-gradient-to-br from-slate-500/10 to-zinc-500/10 border-slate-500/20",
		testimonialStyle:
			"bg-gradient-to-r from-slate-500/15 via-zinc-500/10 to-slate-500/15 border-slate-500/30",
		valueCardStyle:
			"bg-gradient-to-br from-slate-500/5 via-transparent to-zinc-500/5 hover:from-slate-500/10 hover:to-zinc-500/10",
	},
};

// Decorative pattern for certain variants
function DecorativePattern({ variant }: { variant: FeatureDesignVariant }) {
	if (variant === "neural") {
		return (
			<svg
				aria-hidden="true"
				className="absolute right-0 top-0 h-64 w-64 opacity-10 dark:opacity-20"
			>
				<defs>
					<pattern
						height="40"
						id="neural-pattern"
						patternUnits="userSpaceOnUse"
						width="40"
					>
						<circle cx="20" cy="20" fill="currentColor" r="2" />
						<line
							stroke="currentColor"
							strokeWidth="0.5"
							x1="20"
							x2="40"
							y1="20"
							y2="0"
						/>
						<line
							stroke="currentColor"
							strokeWidth="0.5"
							x1="20"
							x2="40"
							y1="20"
							y2="40"
						/>
						<line
							stroke="currentColor"
							strokeWidth="0.5"
							x1="20"
							x2="0"
							y1="20"
							y2="0"
						/>
					</pattern>
				</defs>
				<rect fill="url(#neural-pattern)" height="100%" width="100%" />
			</svg>
		);
	}

	if (variant === "grid") {
		return (
			<svg
				aria-hidden="true"
				className="absolute right-0 top-0 h-64 w-64 opacity-10 dark:opacity-20"
			>
				<defs>
					<pattern
						height="20"
						id="grid-pattern"
						patternUnits="userSpaceOnUse"
						width="20"
					>
						<rect
							fill="none"
							height="20"
							stroke="currentColor"
							strokeWidth="0.5"
							width="20"
						/>
					</pattern>
				</defs>
				<rect fill="url(#grid-pattern)" height="100%" width="100%" />
			</svg>
		);
	}

	if (variant === "path") {
		return (
			<svg
				aria-hidden="true"
				className="absolute right-0 top-0 h-64 w-64 opacity-10 dark:opacity-20"
			>
				<path
					d="M0 32 Q 80 0, 160 32 T 320 32"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
				<path
					d="M0 64 Q 80 32, 160 64 T 320 64"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
				<path
					d="M0 96 Q 80 64, 160 96 T 320 96"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
				<circle cx="80" cy="32" fill="currentColor" r="4" />
				<circle cx="160" cy="64" fill="currentColor" r="4" />
				<circle cx="240" cy="96" fill="currentColor" r="4" />
			</svg>
		);
	}

	if (variant === "connected") {
		return (
			<svg
				aria-hidden="true"
				className="absolute right-0 top-0 h-64 w-64 opacity-10 dark:opacity-20"
			>
				<circle cx="64" cy="64" fill="currentColor" r="8" />
				<circle cx="128" cy="32" fill="currentColor" r="6" />
				<circle cx="192" cy="80" fill="currentColor" r="10" />
				<circle cx="96" cy="128" fill="currentColor" r="6" />
				<circle cx="160" cy="144" fill="currentColor" r="8" />
				<line
					stroke="currentColor"
					strokeWidth="1"
					x1="64"
					x2="128"
					y1="64"
					y2="32"
				/>
				<line
					stroke="currentColor"
					strokeWidth="1"
					x1="128"
					x2="192"
					y1="32"
					y2="80"
				/>
				<line
					stroke="currentColor"
					strokeWidth="1"
					x1="64"
					x2="96"
					y1="64"
					y2="128"
				/>
				<line
					stroke="currentColor"
					strokeWidth="1"
					x1="96"
					x2="160"
					y1="128"
					y2="144"
				/>
				<line
					stroke="currentColor"
					strokeWidth="1"
					x1="192"
					x2="160"
					y1="80"
					y2="144"
				/>
			</svg>
		);
	}

	return null;
}

export function FeaturePage({ feature }: FeaturePageProps) {
	const config = variantConfig[feature.designVariant];

	return (
		<div className="space-y-16">
			{/* Hero Section */}
			<section
				className={cn(
					"relative overflow-hidden rounded-3xl border bg-gradient-to-br",
					config.heroGradient,
				)}
			>
				<DecorativePattern variant={feature.designVariant} />
				<div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
					<div className="relative z-10 space-y-6 px-6 py-10 sm:px-10 lg:px-16">
						<Badge className={cn("tracking-wide uppercase", config.badgeStyle)}>
							{feature.heroEyebrow}
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
							{feature.heroTitle}
						</h1>
						<p className="text-muted-foreground text-lg leading-relaxed">
							{feature.heroDescription}
						</p>
						<div className="flex flex-wrap gap-3">
							<Button asChild size="lg">
								<Link href={feature.primaryCta.href}>
									{feature.primaryCta.label}
								</Link>
							</Button>
							{feature.secondaryCta ? (
								<Button asChild size="lg" variant="outline">
									<Link href={feature.secondaryCta.href}>
										{feature.secondaryCta.label}
									</Link>
								</Button>
							) : null}
						</div>
					</div>
					<div className="relative hidden h-full min-h-[320px] lg:block">
						{feature.heroImage ? (
							<Image
								alt={feature.heroTitle}
								className="object-cover"
								fill
								priority
								sizes="480px"
								src={feature.heroImage}
							/>
						) : (
							<div
								className={cn(
									"absolute inset-0 flex items-center justify-center",
									config.secondaryColor,
								)}
							>
								<span className={cn("opacity-50", config.accentColor)}>
									{config.icon}
								</span>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Summary & Pain Points */}
			<section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
				<div className={cn("rounded-2xl border p-8", config.cardStyle)}>
					<div className={cn("mb-4", config.accentColor)}>{config.icon}</div>
					<h2 className="text-xl font-semibold">Why teams choose Thorbis</h2>
					<p className="text-muted-foreground mt-4 leading-relaxed">
						{feature.summary}
					</p>
				</div>
				<div className="bg-background rounded-2xl border p-8">
					<h3 className="text-lg font-semibold">Top challenges solved</h3>
					<ul className="text-muted-foreground mt-4 space-y-3">
						{feature.painPoints.map((pain) => (
							<li className="flex gap-3" key={pain}>
								<span className={cn("mt-1 font-bold", config.accentColor)}>
									&bull;
								</span>
								<span>{pain}</span>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* Value Props */}
			<section className="space-y-6">
				<h2 className="text-2xl font-semibold">What's included</h2>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{feature.valueProps.map((prop) => {
						const Icon = getMarketingIcon(prop.icon);
						return (
							<div
								className={cn(
									"rounded-2xl border p-6 transition-all duration-300",
									config.valueCardStyle,
								)}
								key={prop.title}
							>
								<Icon
									aria-hidden="true"
									className={cn("mb-4 size-8", config.accentColor)}
								/>
								<h3 className="text-lg font-semibold">{prop.title}</h3>
								<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
									{prop.description}
								</p>
							</div>
						);
					})}
				</div>
			</section>

			{/* Workflows & Stats */}
			<section className="grid gap-8 lg:grid-cols-2">
				<div className={cn("rounded-2xl border p-8", config.cardStyle)}>
					<h2 className="text-2xl font-semibold">Key workflows</h2>
					<div className="mt-4 space-y-6">
						{feature.workflows.map((workflow) => (
							<div className="space-y-2" key={workflow.title}>
								<h3 className="text-lg font-semibold">{workflow.title}</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									{workflow.description}
								</p>
								{workflow.steps ? (
									<ul className="text-muted-foreground list-decimal space-y-1 pl-4 text-sm">
										{workflow.steps.map((step) => (
											<li key={step}>{step}</li>
										))}
									</ul>
								) : null}
							</div>
						))}
					</div>
				</div>
				<div className={cn("rounded-2xl border p-8", config.statsStyle)}>
					<h2 className="text-2xl font-semibold">Performance impact</h2>
					<dl className="mt-4 grid gap-4 sm:grid-cols-2">
						{feature.stats.map((stat) => (
							<div
								className="bg-background/80 rounded-xl border p-4"
								key={stat.label}
							>
								<dt className="text-muted-foreground text-sm font-medium">
									{stat.label}
								</dt>
								<dd className={cn("text-2xl font-semibold", config.accentColor)}>
									{stat.value}
								</dd>
								<p className="text-muted-foreground mt-1 text-xs">
									{stat.description}
								</p>
							</div>
						))}
					</dl>
					{feature.integrations?.length ? (
						<div className="mt-6">
							<p className="text-muted-foreground text-sm font-medium">
								Works with your existing tools
							</p>
							<div className="mt-2 flex flex-wrap gap-2">
								{feature.integrations.map((integration) => (
									<Badge
										className={config.badgeStyle}
										key={integration}
										variant="outline"
									>
										{integration}
									</Badge>
								))}
							</div>
						</div>
					) : null}
				</div>
			</section>

			{/* Testimonial */}
			{feature.testimonial ? (
				<section
					className={cn(
						"rounded-3xl border p-10 text-center",
						config.testimonialStyle,
					)}
				>
					<p className={cn("text-2xl font-semibold", config.accentColor)}>
						"{feature.testimonial.quote}"
					</p>
					<p className="text-muted-foreground mt-4">
						&mdash; {feature.testimonial.attribution}
						{feature.testimonial.role ? `, ${feature.testimonial.role}` : null}
					</p>
				</section>
			) : null}

			{/* FAQ */}
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold">Frequently asked questions</h2>
				<Accordion className="w-full" collapsible type="single">
					{feature.faq.map((item, index) => (
						<AccordionItem key={item.question} value={`faq-${index}`}>
							<AccordionTrigger className="text-left">
								{item.question}
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground text-sm leading-relaxed">
								{item.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</section>
		</div>
	);
}
