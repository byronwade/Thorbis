"use client";

/**
 * Welcome Step - Path Selection & Expectations Setting
 *
 * First impression matters! This step:
 * - Welcomes the user warmly
 * - Asks about team size to personalize the journey
 * - Sets expectations for time commitment
 * - Creates excitement about what they'll accomplish
 */

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	useOnboardingStore,
	type OnboardingPath,
	INDUSTRIES,
} from "@/lib/onboarding/onboarding-store";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	User,
	Users,
	Building2,
	Building,
	CheckCircle2,
	Clock,
	Sparkles,
	ArrowRight,
	Zap,
} from "lucide-react";

const PATH_OPTIONS: {
	id: OnboardingPath;
	title: string;
	description: string;
	teamSize: string;
	icon: React.ElementType;
	estimatedTime: string;
	features: string[];
}[] = [
	{
		id: "solo",
		title: "Solo Operator",
		description: "Just me running the show",
		teamSize: "1 person",
		icon: User,
		estimatedTime: "~10 min",
		features: ["Quick setup", "Essential features", "Mobile-first"],
	},
	{
		id: "small",
		title: "Small Team",
		description: "A few people working together",
		teamSize: "2-5 people",
		icon: Users,
		estimatedTime: "~15 min",
		features: ["Team scheduling", "Basic permissions", "Shared inbox"],
	},
	{
		id: "growing",
		title: "Growing Business",
		description: "Multiple techs and office staff",
		teamSize: "6-20 people",
		icon: Building2,
		estimatedTime: "~25 min",
		features: ["Advanced scheduling", "Role management", "Reporting"],
	},
	{
		id: "enterprise",
		title: "Enterprise",
		description: "Large operation with departments",
		teamSize: "20+ people",
		icon: Building,
		estimatedTime: "~30 min + support",
		features: ["Full customization", "Dedicated support", "Data migration"],
	},
];

export function WelcomeStep() {
	const { data, updateData } = useOnboardingStore();

	return (
		<div className="space-y-8 max-w-3xl mx-auto">
			{/* Hero Section */}
			<div className="text-center space-y-4">
				<div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
					<Sparkles className="h-4 w-4" />
					<span className="text-sm font-medium">Welcome to Thorbis</span>
				</div>
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					Let's get your business running
				</h1>
				<p className="text-lg text-muted-foreground max-w-xl mx-auto">
					In just a few minutes, you'll be ready to schedule jobs, send invoices,
					and grow your business. Let's start with some basics.
				</p>
			</div>

			{/* Team Size Selection */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">How big is your team?</h2>
					<span className="text-sm text-muted-foreground">
						This helps us personalize your setup
					</span>
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					{PATH_OPTIONS.map((option) => {
						const Icon = option.icon;
						const isSelected = data.path === option.id;

						return (
							<button
								key={option.id}
								type="button"
								onClick={() => updateData({ path: option.id, teamSize: option.teamSize })}
								className={cn(
									"relative flex flex-col items-start gap-3 rounded-xl p-5 text-left transition-all",
									isSelected
										? "bg-primary/10 ring-2 ring-primary"
										: "bg-muted/30 hover:bg-muted/50"
								)}
							>
								{isSelected && (
									<div className="absolute top-3 right-3">
										<CheckCircle2 className="h-5 w-5 text-primary" />
									</div>
								)}

								<div className="flex items-center gap-3">
									<div className={cn(
										"flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
										isSelected
											? "bg-primary text-primary-foreground"
											: "bg-muted"
									)}>
										<Icon className="h-6 w-6" />
									</div>
									<div>
										<p className="font-semibold">{option.title}</p>
										<p className="text-sm text-muted-foreground">{option.description}</p>
									</div>
								</div>

								<div className="flex items-center gap-4 text-xs text-muted-foreground">
									<span className="flex items-center gap-1">
										<Users className="h-3 w-3" />
										{option.teamSize}
									</span>
									<span className="flex items-center gap-1">
										<Clock className="h-3 w-3" />
										{option.estimatedTime}
									</span>
								</div>

								<div className="flex flex-wrap gap-1.5">
									{option.features.map((feature) => (
										<Badge key={feature} variant="secondary" className="text-xs">
											{feature}
										</Badge>
									))}
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Industry Selection */}
			<div className="space-y-3">
				<h2 className="text-lg font-semibold">What's your trade?</h2>
				<Select
					value={data.industry}
					onValueChange={(v) => updateData({ industry: v })}
				>
					<SelectTrigger className="w-full sm:w-[300px]">
						<SelectValue placeholder="Select your industry" />
					</SelectTrigger>
					<SelectContent>
						{INDUSTRIES.map((industry) => (
							<SelectItem key={industry.value} value={industry.value}>
								{industry.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<p className="text-sm text-muted-foreground">
					This helps us suggest relevant services and templates
				</p>
			</div>

			{/* What You'll Accomplish */}
			{data.path && (
				<div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 space-y-4">
					<div className="flex items-center gap-2">
						<Zap className="h-5 w-5 text-primary" />
						<h3 className="font-semibold">What you'll accomplish today</h3>
					</div>
					<div className="grid gap-3 sm:grid-cols-2">
						{[
							"Set up your company profile",
							"Configure communication channels",
							"Add your services & pricing",
							"Invite team members",
							"Connect payment processing",
							"Send your first invoice",
						].map((item, i) => (
							<div key={i} className="flex items-center gap-2 text-sm">
								<div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
									{i + 1}
								</div>
								<span>{item}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
