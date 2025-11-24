"use client";

/**
 * Welcome Step - Clean, Minimal Path Selection
 */

import { cn } from "@/lib/utils";
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
import { User, Users, Building2, Building, Check } from "lucide-react";

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

	return (
		<div className="space-y-12">
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
					Team size
				</label>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					{PATH_OPTIONS.map((option) => {
						const Icon = option.icon;
						const isSelected = data.path === option.id;

						return (
							<button
								key={option.id}
								type="button"
								onClick={() => updateData({ path: option.id, teamSize: option.subtitle })}
								className={cn(
									"relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
									isSelected
										? "border-primary bg-primary/5"
										: "border-transparent bg-muted/40 hover:bg-muted/60"
								)}
							>
								{isSelected && (
									<div className="absolute top-2 right-2">
										<Check className="h-4 w-4 text-primary" />
									</div>
								)}
								<div className={cn(
									"flex h-10 w-10 items-center justify-center rounded-full",
									isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
								)}>
									<Icon className="h-5 w-5" />
								</div>
								<div className="text-center">
									<p className="font-medium text-sm">{option.title}</p>
									<p className="text-xs text-muted-foreground">{option.subtitle}</p>
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Industry */}
			<div className="space-y-4">
				<label className="text-sm font-medium text-muted-foreground">
					Industry
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
				<p className="text-sm text-muted-foreground">
					We'll customize templates and suggestions for your trade.
				</p>
			</div>
		</div>
	);
}
