import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, Shield, Zap, Droplets, Leaf, Thermometer, Wrench, Home, Lock, Settings, Brush } from "lucide-react";
import { RelatedContent } from "@/components/seo/related-content";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { IndustryDesignVariant, MarketingIndustryContent } from "@/lib/marketing/types";
import { getRelatedIndustries } from "@/lib/seo/content-recommendations";
import { getMarketingIcon } from "./marketing-icons";
import { cn } from "@/lib/utils";

type IndustryPageProps = {
	industry: MarketingIndustryContent;
};

// Design variant configurations
const variantConfig: Record<IndustryDesignVariant, {
	heroGradient: string;
	accentColor: string;
	secondaryColor: string;
	icon: React.ReactNode;
	pattern: string;
	cardStyle: string;
	badgeStyle: string;
	statsLayout: "grid" | "horizontal" | "stacked" | "circular";
	testimonialStyle: string;
}> = {
	thermal: {
		heroGradient: "from-blue-600/20 via-cyan-500/10 to-orange-500/10",
		accentColor: "text-blue-500",
		secondaryColor: "bg-blue-500/10",
		icon: <Thermometer className="size-6" />,
		pattern: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]",
		cardStyle: "border-blue-500/20 hover:border-blue-500/40",
		badgeStyle: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400",
		statsLayout: "grid",
		testimonialStyle: "from-blue-500/10 via-cyan-500/5 to-orange-500/10",
	},
	flow: {
		heroGradient: "from-sky-500/20 via-blue-400/10 to-teal-500/10",
		accentColor: "text-sky-500",
		secondaryColor: "bg-sky-500/10",
		icon: <Droplets className="size-6" />,
		pattern: "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))]",
		cardStyle: "border-sky-500/20 hover:border-sky-500/40 rounded-3xl",
		badgeStyle: "bg-gradient-to-r from-sky-500/20 to-blue-500/20 text-sky-600 dark:text-sky-400",
		statsLayout: "horizontal",
		testimonialStyle: "from-sky-500/10 via-blue-400/5 to-teal-500/10",
	},
	circuit: {
		heroGradient: "from-yellow-500/20 via-amber-400/10 to-orange-500/10",
		accentColor: "text-yellow-500",
		secondaryColor: "bg-yellow-500/10",
		icon: <Zap className="size-6" />,
		pattern: "bg-[linear-gradient(to_right,_var(--tw-gradient-stops))]",
		cardStyle: "border-yellow-500/20 hover:border-yellow-500/40 rounded-none",
		badgeStyle: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-600 dark:text-yellow-400",
		statsLayout: "stacked",
		testimonialStyle: "from-yellow-500/10 via-amber-400/5 to-orange-500/10",
	},
	versatile: {
		heroGradient: "from-violet-500/20 via-purple-400/10 to-fuchsia-500/10",
		accentColor: "text-violet-500",
		secondaryColor: "bg-violet-500/10",
		icon: <Wrench className="size-6" />,
		pattern: "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]",
		cardStyle: "border-violet-500/20 hover:border-violet-500/40",
		badgeStyle: "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-600 dark:text-violet-400",
		statsLayout: "grid",
		testimonialStyle: "from-violet-500/10 via-purple-400/5 to-fuchsia-500/10",
	},
	organic: {
		heroGradient: "from-green-500/20 via-emerald-400/10 to-lime-500/10",
		accentColor: "text-green-500",
		secondaryColor: "bg-green-500/10",
		icon: <Leaf className="size-6" />,
		pattern: "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))]",
		cardStyle: "border-green-500/20 hover:border-green-500/40 rounded-[2rem]",
		badgeStyle: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400",
		statsLayout: "circular",
		testimonialStyle: "from-green-500/10 via-emerald-400/5 to-lime-500/10",
	},
	aquatic: {
		heroGradient: "from-cyan-500/20 via-teal-400/10 to-blue-500/10",
		accentColor: "text-cyan-500",
		secondaryColor: "bg-cyan-500/10",
		icon: <Droplets className="size-6" />,
		pattern: "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))]",
		cardStyle: "border-cyan-500/20 hover:border-cyan-500/40 rounded-2xl",
		badgeStyle: "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-600 dark:text-cyan-400",
		statsLayout: "horizontal",
		testimonialStyle: "from-cyan-500/10 via-teal-400/5 to-blue-500/10",
	},
	shield: {
		heroGradient: "from-red-500/20 via-rose-400/10 to-orange-500/10",
		accentColor: "text-red-500",
		secondaryColor: "bg-red-500/10",
		icon: <Shield className="size-6" />,
		pattern: "bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))]",
		cardStyle: "border-red-500/20 hover:border-red-500/40",
		badgeStyle: "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-600 dark:text-red-400",
		statsLayout: "stacked",
		testimonialStyle: "from-red-500/10 via-rose-400/5 to-orange-500/10",
	},
	technical: {
		heroGradient: "from-slate-500/20 via-gray-400/10 to-zinc-500/10",
		accentColor: "text-slate-500",
		secondaryColor: "bg-slate-500/10",
		icon: <Settings className="size-6" />,
		pattern: "bg-[linear-gradient(135deg,_var(--tw-gradient-stops))]",
		cardStyle: "border-slate-500/20 hover:border-slate-500/40 rounded-lg",
		badgeStyle: "bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-600 dark:text-slate-400",
		statsLayout: "grid",
		testimonialStyle: "from-slate-500/10 via-gray-400/5 to-zinc-500/10",
	},
	elevated: {
		heroGradient: "from-stone-500/20 via-amber-400/10 to-orange-500/10",
		accentColor: "text-stone-600 dark:text-stone-400",
		secondaryColor: "bg-stone-500/10",
		icon: <Home className="size-6" />,
		pattern: "bg-[linear-gradient(to_top,_var(--tw-gradient-stops))]",
		cardStyle: "border-stone-500/20 hover:border-stone-500/40 clip-path-[polygon(0_0,100%_5%,100%_100%,0_95%)]",
		badgeStyle: "bg-gradient-to-r from-stone-500/20 to-amber-500/20 text-stone-600 dark:text-stone-400",
		statsLayout: "stacked",
		testimonialStyle: "from-stone-500/10 via-amber-400/5 to-orange-500/10",
	},
	pristine: {
		heroGradient: "from-indigo-500/10 via-purple-400/5 to-pink-500/10",
		accentColor: "text-indigo-500",
		secondaryColor: "bg-indigo-500/10",
		icon: <Sparkles className="size-6" />,
		pattern: "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]",
		cardStyle: "border-indigo-500/20 hover:border-indigo-500/40 shadow-sm",
		badgeStyle: "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 dark:text-indigo-400",
		statsLayout: "horizontal",
		testimonialStyle: "from-indigo-500/10 via-purple-400/5 to-pink-500/10",
	},
	secure: {
		heroGradient: "from-zinc-700/30 via-slate-600/20 to-neutral-500/10",
		accentColor: "text-zinc-400",
		secondaryColor: "bg-zinc-500/10",
		icon: <Lock className="size-6" />,
		pattern: "bg-[conic-gradient(at_center,_var(--tw-gradient-stops))]",
		cardStyle: "border-zinc-500/30 hover:border-zinc-400/50 bg-zinc-900/5 dark:bg-zinc-100/5",
		badgeStyle: "bg-gradient-to-r from-zinc-600/30 to-slate-600/30 text-zinc-200 dark:text-zinc-300",
		statsLayout: "stacked",
		testimonialStyle: "from-zinc-700/20 via-slate-600/10 to-neutral-500/10",
	},
	industrial: {
		heroGradient: "from-neutral-500/20 via-stone-400/10 to-zinc-500/10",
		accentColor: "text-neutral-500",
		secondaryColor: "bg-neutral-500/10",
		icon: <Home className="size-6" />,
		pattern: "bg-[repeating-linear-gradient(45deg,_var(--tw-gradient-stops))]",
		cardStyle: "border-neutral-500/20 hover:border-neutral-500/40 rounded-sm",
		badgeStyle: "bg-gradient-to-r from-neutral-500/20 to-stone-500/20 text-neutral-600 dark:text-neutral-400",
		statsLayout: "grid",
		testimonialStyle: "from-neutral-500/10 via-stone-400/5 to-zinc-500/10",
	},
};

// Stats display components for different layouts
function GridStats({ stats, accentColor }: { stats: MarketingIndustryContent["stats"]; accentColor: string }) {
	return (
		<div className="grid grid-cols-2 gap-4">
			{stats.map((stat) => (
				<div
					className="bg-background rounded-xl border p-4 shadow-sm transition-all hover:shadow-md"
					key={stat.label}
				>
					<p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
						{stat.label}
					</p>
					<p className={cn("my-1 text-3xl font-bold", accentColor)}>
						{stat.value}
					</p>
					<p className="text-muted-foreground text-xs leading-relaxed">
						{stat.description}
					</p>
				</div>
			))}
		</div>
	);
}

function HorizontalStats({ stats, accentColor }: { stats: MarketingIndustryContent["stats"]; accentColor: string }) {
	return (
		<div className="space-y-3">
			{stats.map((stat) => (
				<div
					className="bg-background flex items-center gap-4 rounded-2xl border p-4 shadow-sm"
					key={stat.label}
				>
					<div className={cn("text-4xl font-bold", accentColor)}>
						{stat.value}
					</div>
					<div className="flex-1">
						<p className="font-semibold">{stat.label}</p>
						<p className="text-muted-foreground text-sm">{stat.description}</p>
					</div>
				</div>
			))}
		</div>
	);
}

function StackedStats({ stats, accentColor }: { stats: MarketingIndustryContent["stats"]; accentColor: string }) {
	return (
		<div className="space-y-4">
			{stats.map((stat, index) => (
				<div
					className="bg-background relative overflow-hidden rounded-lg border p-4 shadow-sm"
					key={stat.label}
				>
					<div className="absolute -right-4 -top-4 text-7xl font-black opacity-5">
						{index + 1}
					</div>
					<p className={cn("text-4xl font-bold", accentColor)}>
						{stat.value}
					</p>
					<p className="mt-1 font-semibold">{stat.label}</p>
					<p className="text-muted-foreground mt-1 text-sm">{stat.description}</p>
				</div>
			))}
		</div>
	);
}

function CircularStats({ stats, accentColor }: { stats: MarketingIndustryContent["stats"]; accentColor: string }) {
	return (
		<div className="grid grid-cols-2 gap-6">
			{stats.map((stat) => (
				<div
					className="bg-background flex flex-col items-center rounded-full border p-6 text-center shadow-sm aspect-square justify-center"
					key={stat.label}
				>
					<p className={cn("text-3xl font-bold", accentColor)}>
						{stat.value}
					</p>
					<p className="mt-1 text-sm font-semibold">{stat.label}</p>
					<p className="text-muted-foreground mt-1 text-xs leading-tight line-clamp-2">
						{stat.description}
					</p>
				</div>
			))}
		</div>
	);
}

export function IndustryPage({ industry }: IndustryPageProps) {
	const config = variantConfig[industry.designVariant];

	const renderStats = () => {
		switch (config.statsLayout) {
			case "horizontal":
				return <HorizontalStats stats={industry.stats} accentColor={config.accentColor} />;
			case "stacked":
				return <StackedStats stats={industry.stats} accentColor={config.accentColor} />;
			case "circular":
				return <CircularStats stats={industry.stats} accentColor={config.accentColor} />;
			default:
				return <GridStats stats={industry.stats} accentColor={config.accentColor} />;
		}
	};

	return (
		<div className="space-y-16">
			{/* Variant-Specific Hero Section */}
			<section className={cn(
				"relative overflow-hidden rounded-3xl border",
				`bg-gradient-to-br ${config.heroGradient}`,
				config.pattern
			)}>
				{/* Decorative background elements based on variant */}
				<div className="absolute inset-0 overflow-hidden">
					{industry.designVariant === "circuit" && (
						<div className="absolute inset-0 opacity-5">
							<svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
								<defs>
									<pattern id="circuit" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
										<path d="M0 25h50M25 0v50" stroke="currentColor" strokeWidth="1" fill="none" />
										<circle cx="25" cy="25" r="3" fill="currentColor" />
									</pattern>
								</defs>
								<rect width="100%" height="100%" fill="url(#circuit)" />
							</svg>
						</div>
					)}
					{industry.designVariant === "flow" && (
						<div className="absolute inset-0 opacity-10">
							<svg className="h-full w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
								<path fill="currentColor" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
							</svg>
						</div>
					)}
					{industry.designVariant === "organic" && (
						<div className="absolute -bottom-10 -right-10 opacity-10">
							<Leaf className="size-96" />
						</div>
					)}
					{industry.designVariant === "secure" && (
						<div className="absolute right-10 top-10 opacity-10">
							<Lock className="size-48" />
						</div>
					)}
				</div>

				<div className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
					<div className="space-y-6 px-6 py-12 sm:px-10 lg:px-16">
						<Badge className={cn("px-4 py-1.5 font-semibold", config.badgeStyle)}>
							{industry.heroEyebrow}
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
							{industry.heroTitle}
						</h1>
						<p className="text-muted-foreground text-lg leading-relaxed">
							{industry.heroDescription}
						</p>
						<div className="flex flex-wrap gap-3">
							<Button asChild size="lg" className="shadow-lg">
								<Link href={industry.primaryCta.href}>
									{industry.primaryCta.label}
									<ArrowRight className="ml-2 size-4" />
								</Link>
							</Button>
							{industry.secondaryCta ? (
								<Button asChild size="lg" variant="outline">
									<Link href={industry.secondaryCta.href}>
										{industry.secondaryCta.label}
									</Link>
								</Button>
							) : null}
						</div>
						<div className="flex flex-wrap gap-2">
							{industry.fieldTypes.map((type) => (
								<Badge key={type} variant="secondary" className={config.badgeStyle}>
									{type}
								</Badge>
							))}
						</div>
					</div>
					<div className="relative hidden h-full min-h-[400px] lg:block">
						{industry.heroImage ? (
							<Image
								alt={industry.heroTitle}
								className="object-cover"
								fill
								priority
								sizes="480px"
								src={industry.heroImage}
							/>
						) : (
							<div className={cn("absolute inset-0 flex items-center justify-center", config.secondaryColor)}>
								<div className={config.accentColor}>
									{config.icon}
								</div>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Summary and Pain Points - Variant Styled */}
			<section className="grid gap-8 lg:grid-cols-2">
				<Card className={cn("transition-all", config.cardStyle)}>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-2xl">
							<div className={cn("flex size-10 items-center justify-center rounded-lg", config.secondaryColor)}>
								<Check className={cn("size-5", config.accentColor)} />
							</div>
							Operate with Confidence
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground leading-relaxed">
							{industry.summary}
						</p>
					</CardContent>
				</Card>

				<Card className="border-orange-500/20 transition-all hover:border-orange-500/40">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-2xl">
							<div className="bg-orange-500/10 flex size-10 items-center justify-center rounded-lg">
								<svg className="size-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
							</div>
							Industry Challenges
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-3">
							{industry.painPoints.map((pain) => (
								<li className="flex gap-3" key={pain}>
									<div className="bg-orange-500/10 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
										<span className="text-orange-600 dark:text-orange-400 text-xs">!</span>
									</div>
									<span className="text-muted-foreground text-sm leading-relaxed">{pain}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</section>

			{/* Value Propositions - Variant Grid Layout */}
			<section className="space-y-8">
				<div className="text-center">
					<Badge className={cn("mb-4", config.badgeStyle)}>
						Capabilities
					</Badge>
					<h2 className="text-3xl font-bold tracking-tight">Tailored to Your Industry</h2>
					<p className="text-muted-foreground mx-auto mt-2 max-w-2xl">
						Purpose-built features that solve {industry.name.toLowerCase()} challenges
					</p>
				</div>
				<div className={cn(
					"grid gap-6",
					industry.designVariant === "circuit" ? "md:grid-cols-2 lg:grid-cols-4" :
					industry.designVariant === "organic" ? "md:grid-cols-2" :
					"md:grid-cols-2 lg:grid-cols-3"
				)}>
					{industry.valueProps.map((prop, index) => {
						const Icon = getMarketingIcon(prop.icon);
						return (
							<Card
								className={cn(
									"group relative overflow-hidden transition-all hover:shadow-lg",
									config.cardStyle,
									industry.designVariant === "stacked" && index === 0 && "md:col-span-2"
								)}
								key={prop.title}
							>
								<div className={cn(
									"absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
									`bg-gradient-to-br ${config.heroGradient}`
								)} />
								<CardHeader className="relative">
									<div className={cn(
										"mb-4 flex size-12 items-center justify-center rounded-xl transition-colors",
										config.secondaryColor,
										"group-hover:scale-110"
									)}>
										<Icon
											aria-hidden="true"
											className={cn("size-6", config.accentColor)}
										/>
									</div>
									<CardTitle className="text-lg">{prop.title}</CardTitle>
								</CardHeader>
								<CardContent className="relative">
									<CardDescription className="text-sm leading-relaxed">
										{prop.description}
									</CardDescription>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>

			{/* Playbook and Stats - Variant Layout */}
			<section className={cn(
				"grid gap-8",
				config.statsLayout === "horizontal" ? "lg:grid-cols-[1fr_400px]" : "lg:grid-cols-2"
			)}>
				<Card className={cn("transition-all", config.cardStyle)}>
					<CardHeader>
						<Badge className={cn("mb-2 w-fit", config.badgeStyle)}>
							Best Practices
						</Badge>
						<CardTitle className="text-2xl">Playbook Highlights</CardTitle>
						<CardDescription>
							Proven workflows from successful {industry.name.toLowerCase()}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{industry.playbook.map((item, index) => (
								<div className="space-y-2" key={item.title}>
									<div className="flex items-start gap-3">
										<div className={cn(
											"flex size-8 shrink-0 items-center justify-center rounded-lg",
											config.secondaryColor
										)}>
											<span className={cn("text-sm font-bold", config.accentColor)}>{index + 1}</span>
										</div>
										<div>
											<h3 className="text-foreground font-semibold">{item.title}</h3>
											<p className="text-muted-foreground mt-1 text-sm leading-relaxed">
												{item.description}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className={cn(
					"transition-all",
					`bg-gradient-to-br ${config.heroGradient}`,
					config.cardStyle
				)}>
					<CardHeader>
						<Badge className={cn("mb-2 w-fit", config.badgeStyle)}>
							Real Results
						</Badge>
						<CardTitle className="text-2xl">Proven Outcomes</CardTitle>
						<CardDescription>
							Average improvements across {industry.name.toLowerCase()}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{renderStats()}
					</CardContent>
				</Card>
			</section>

			{/* Testimonial - Variant Styled */}
			{industry.testimonial ? (
				<section className={cn(
					"relative overflow-hidden rounded-3xl border p-12",
					`bg-gradient-to-r ${config.testimonialStyle}`
				)}>
					<div className={cn("absolute right-8 top-8 text-8xl opacity-10", config.accentColor)}>
						&ldquo;
					</div>
					<div className="relative mx-auto max-w-3xl text-center">
						<div className="mb-6 flex justify-center">
							<div className={cn("flex size-16 items-center justify-center rounded-full", config.secondaryColor)}>
								<div className={config.accentColor}>
									{config.icon}
								</div>
							</div>
						</div>
						<blockquote className="text-foreground mb-6 text-2xl font-medium leading-relaxed">
							&ldquo;{industry.testimonial.quote}&rdquo;
						</blockquote>
						<div>
							<p className="text-foreground font-semibold">{industry.testimonial.attribution}</p>
							{industry.testimonial.role && (
								<p className="text-muted-foreground text-sm">{industry.testimonial.role}</p>
							)}
						</div>
					</div>
				</section>
			) : null}

			{/* Related Industries */}
			<RelatedContent
				title="Explore Other Industries"
				description="See how Thorbis serves other service industries"
				items={getRelatedIndustries(industry.slug, 3)}
				variant="grid"
				showDescription={true}
			/>

			{/* FAQ Section - Variant Styled */}
			<section className="space-y-6">
				<div className="text-center">
					<Badge className={cn("mb-4", config.badgeStyle)}>
						FAQ
					</Badge>
					<h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
					<p className="text-muted-foreground mx-auto mt-2 max-w-2xl">
						Common questions about Thorbis for {industry.name.toLowerCase()}
					</p>
				</div>
				<div className="mx-auto max-w-3xl">
					<Accordion className="w-full" collapsible type="single">
						{industry.faq.map((item, index) => (
							<AccordionItem
								key={item.question}
								value={`industry-faq-${index}`}
								className={cn(
									"border-b",
									industry.designVariant === "circuit" && "border-dashed"
								)}
							>
								<AccordionTrigger className="text-left font-semibold">
									{item.question}
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground leading-relaxed">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</section>

			{/* Final CTA - Variant Styled */}
			<section className={cn(
				"rounded-2xl border p-10 text-center",
				`bg-gradient-to-r ${config.heroGradient}`
			)}>
				<Badge className={cn("mb-4", config.badgeStyle)}>
					Ready to Get Started?
				</Badge>
				<h2 className="mb-3 text-3xl font-semibold">
					Join {industry.name} Teams Using Thorbis
				</h2>
				<p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
					$200/month base with unlimited users. No per-technician fees. No long-term contracts.
				</p>
				<div className="mb-8 flex flex-wrap justify-center gap-4">
					<Button asChild className="shadow-lg" size="lg">
						<Link href="/waitlist">
							Join Waitlist
							<ArrowRight className="ml-2 size-4" />
						</Link>
					</Button>
					<Button asChild size="lg" variant="outline">
						<Link href="/pricing">View Pricing</Link>
					</Button>
				</div>
				<div className="flex flex-wrap items-center justify-center gap-6 pt-6">
					<div className="flex items-center gap-2">
						<Check className={cn("size-5", config.accentColor)} />
						<span className="text-muted-foreground text-sm">$200/mo base price</span>
					</div>
					<div className="flex items-center gap-2">
						<Check className={cn("size-5", config.accentColor)} />
						<span className="text-muted-foreground text-sm">Unlimited users</span>
					</div>
					<div className="flex items-center gap-2">
						<Check className={cn("size-5", config.accentColor)} />
						<span className="text-muted-foreground text-sm">No contracts</span>
					</div>
				</div>
			</section>
		</div>
	);
}
