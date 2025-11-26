"use client";

/**
 * Welcome Step - Clean, Minimal Path Selection
 *
 * Features:
 * - Team size selection with visual cards
 * - Industry selection with tailored recommendations
 * - "How did you hear about us?" tracking
 * - Industry-specific insights to build confidence
 */

import {
	ArrowRight,
	Building,
	Building2,
	Calendar,
	Check,
	Clock,
	Phone,
	Shield,
	Sparkles,
	TrendingUp,
	User,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	INDUSTRIES,
	type OnboardingPath,
	useOnboardingStore,
} from "@/lib/onboarding/onboarding-store";
import { cn } from "@/lib/utils";

// Industry-specific insights to show after selection
const INDUSTRY_INSIGHTS: Record<string, { title: string; bullets: string[] }> =
	{
		hvac: {
			title: "HVAC businesses like yours typically see",
			bullets: [
				"40% faster dispatch with GPS tracking",
				"25% more jobs completed per day",
				"Automated seasonal maintenance reminders",
			],
		},
		plumbing: {
			title: "Plumbing companies using Thorbis report",
			bullets: [
				"60% faster quote turnaround",
				"Emergency job prioritization features",
				"Photo documentation for warranty claims",
			],
		},
		electrical: {
			title: "Electrical contractors benefit from",
			bullets: [
				"Permit tracking integration",
				"Code compliance checklists",
				"Multi-location job management",
			],
		},
		roofing: {
			title: "Roofing companies love our",
			bullets: [
				"Weather-based scheduling",
				"Aerial measurement integration",
				"Storm damage documentation",
			],
		},
		landscaping: {
			title: "Landscaping businesses enjoy",
			bullets: [
				"Recurring service scheduling",
				"Seasonal crew management",
				"Property photo timelines",
			],
		},
		cleaning: {
			title: "Cleaning services see results with",
			bullets: [
				"Recurring appointment automation",
				"Checklist-based job completion",
				"Customer key/code management",
			],
		},
		"pest-control": {
			title: "Pest control companies benefit from",
			bullets: [
				"Treatment history tracking",
				"Regulatory compliance reports",
				"Automated follow-up scheduling",
			],
		},
		appliance: {
			title: "Appliance repair pros love",
			bullets: [
				"Parts inventory tracking",
				"Warranty lookup integration",
				"Model-specific repair guides",
			],
		},
		"garage-door": {
			title: "Garage door companies see",
			bullets: [
				"Quick quote generation",
				"Spring life tracking",
				"Before/after photo documentation",
			],
		},
		locksmith: {
			title: "Locksmiths benefit from",
			bullets: [
				"Emergency dispatch priority",
				"Key code secure storage",
				"Vehicle VIN lookup",
			],
		},
		"general-contractor": {
			title: "General contractors appreciate",
			bullets: [
				"Subcontractor management",
				"Project milestone tracking",
				"Change order documentation",
			],
		},
		other: {
			title: "Service businesses using Thorbis see",
			bullets: [
				"50% reduction in scheduling conflicts",
				"30% faster payment collection",
				"Happier customers with automated updates",
			],
		},
	};

// Referral sources for tracking
const REFERRAL_SOURCES = [
	{ value: "google", label: "Google Search" },
	{ value: "facebook", label: "Facebook/Instagram" },
	{ value: "linkedin", label: "LinkedIn" },
	{ value: "youtube", label: "YouTube" },
	{ value: "podcast", label: "Podcast" },
	{ value: "friend", label: "Friend or Colleague" },
	{ value: "conference", label: "Trade Show/Conference" },
	{ value: "review-site", label: "Review Site (G2, Capterra)" },
	{ value: "other", label: "Other" },
];

const PATH_OPTIONS: {
	id: OnboardingPath;
	title: string;
	subtitle: string;
	icon: React.ElementType;
}[] = [
	{
		id: "solo",
		title: "Solo",
		subtitle: "Just me",
		icon: User,
	},
	{
		id: "small",
		title: "Small Team",
		subtitle: "2-5 people",
		icon: Users,
	},
	{
		id: "growing",
		title: "Growing",
		subtitle: "6-20 people",
		icon: Building2,
	},
	{
		id: "enterprise",
		title: "Enterprise",
		subtitle: "20+ people",
		icon: Building,
	},
];

export function WelcomeStep() {
	const { data, updateData } = useOnboardingStore();

	const industryInsight = data.industry
		? INDUSTRY_INSIGHTS[data.industry]
		: null;

	return (
		<div className="space-y-10">
			{/* Hero */}
			<div className="text-center space-y-3">
				<h1 className="text-3xl font-semibold tracking-tight">
					Welcome to Thorbis
				</h1>
				<p className="text-muted-foreground text-lg max-w-md mx-auto">
					Let's personalize your setup. This only takes a few minutes.
				</p>
			</div>

			{/* Team Size */}
			<div className="space-y-4">
				<label className="text-sm font-medium text-muted-foreground">
					How big is your team?
				</label>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					{PATH_OPTIONS.map((option) => {
						const Icon = option.icon;
						const isSelected = data.path === option.id;

						return (
							<button
								key={option.id}
								type="button"
								onClick={() =>
									updateData({ path: option.id, teamSize: option.subtitle })
								}
								className={cn(
									"relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
									isSelected
										? "border-primary bg-primary/5"
										: "border-transparent bg-muted/40 hover:bg-muted/60",
								)}
							>
								{isSelected && (
									<div className="absolute top-2 right-2">
										<Check className="h-4 w-4 text-primary" />
									</div>
								)}
								<div
									className={cn(
										"flex h-10 w-10 items-center justify-center rounded-full",
										isSelected
											? "bg-primary text-primary-foreground"
											: "bg-muted",
									)}
								>
									<Icon className="h-5 w-5" />
								</div>
								<div className="text-center">
									<p className="font-medium text-sm">{option.title}</p>
									<p className="text-xs text-muted-foreground">
										{option.subtitle}
									</p>
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Industry */}
			<div className="space-y-4">
				<label className="text-sm font-medium text-muted-foreground">
					What industry are you in?
				</label>
				<Select
					value={data.industry}
					onValueChange={(v) => updateData({ industry: v })}
				>
					<SelectTrigger className="w-full max-w-xs">
						<SelectValue placeholder="Select your trade" />
					</SelectTrigger>
					<SelectContent>
						{INDUSTRIES.map((industry) => (
							<SelectItem key={industry.value} value={industry.value}>
								{industry.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Industry-specific insights */}
				{industryInsight && (
					<div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div className="flex items-start gap-3">
							<div className="p-2 rounded-full bg-primary/10">
								<Sparkles className="h-4 w-4 text-primary" />
							</div>
							<div className="space-y-2">
								<p className="text-sm font-medium">{industryInsight.title}</p>
								<ul className="space-y-1">
									{industryInsight.bullets.map((bullet, i) => (
										<li
											key={i}
											className="text-sm text-muted-foreground flex items-center gap-2"
										>
											<Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
											{bullet}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				)}

				{!industryInsight && (
					<p className="text-sm text-muted-foreground">
						We'll customize templates and suggestions for your trade.
					</p>
				)}
			</div>

			{/* Referral Source */}
			<div className="space-y-4">
				<label className="text-sm font-medium text-muted-foreground">
					How did you hear about us?{" "}
					<span className="text-muted-foreground/60">(optional)</span>
				</label>
				<Select
					value={data.referralSource || ""}
					onValueChange={(v) => updateData({ referralSource: v })}
				>
					<SelectTrigger className="w-full max-w-xs">
						<SelectValue placeholder="Select an option" />
					</SelectTrigger>
					<SelectContent>
						{REFERRAL_SOURCES.map((source) => (
							<SelectItem key={source.value} value={source.value}>
								{source.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Quick Stats - Build confidence */}
			<div className="pt-4 border-t">
				<div className="grid grid-cols-3 gap-4 text-center">
					<div className="space-y-1">
						<div className="flex items-center justify-center gap-1 text-muted-foreground">
							<Clock className="h-4 w-4" />
						</div>
						<p className="text-2xl font-semibold">5 min</p>
						<p className="text-xs text-muted-foreground">Setup time</p>
					</div>
					<div className="space-y-1">
						<div className="flex items-center justify-center gap-1 text-muted-foreground">
							<TrendingUp className="h-4 w-4" />
						</div>
						<p className="text-2xl font-semibold">10K+</p>
						<p className="text-xs text-muted-foreground">Active businesses</p>
					</div>
					<div className="space-y-1">
						<div className="flex items-center justify-center gap-1 text-muted-foreground">
							<Shield className="h-4 w-4" />
						</div>
						<p className="text-2xl font-semibold">14 days</p>
						<p className="text-xs text-muted-foreground">Free trial</p>
					</div>
				</div>
			</div>

			{/* Assisted Onboarding CTA */}
			<div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 p-5">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
					<div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 shrink-0">
						<Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
					</div>
					<div className="flex-1 space-y-1">
						<h3 className="font-semibold text-blue-900 dark:text-blue-100">
							Want help getting set up?
						</h3>
						<p className="text-sm text-blue-700 dark:text-blue-300">
							Schedule a free 30-minute call with our onboarding team. We'll
							help you migrate data, configure settings, and get your team
							trained.
						</p>
					</div>
					<Button
						variant="outline"
						className="shrink-0 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900"
						onClick={() =>
							window.open("https://calendly.com/thorbis/onboarding", "_blank")
						}
					>
						<Calendar className="h-4 w-4 mr-2" />
						Schedule Call
						<ArrowRight className="h-4 w-4 ml-2" />
					</Button>
				</div>
			</div>
		</div>
	);
}
