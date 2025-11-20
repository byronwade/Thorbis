"use client";

import {
	CheckCircle2,
	Circle,
	Clock,
	Lightbulb,
	Sparkles,
	Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export type FeatureStatus = "planned" | "in-progress" | "completed";

export type Feature = {
	id: string;
	title: string;
	description: string;
	status: FeatureStatus;
	priority?: "low" | "medium" | "high";
	estimatedDate?: string;
};

type FeatureRoadmapProps = {
	title?: string;
	description?: string;
	features: Feature[];
	showProgress?: boolean;
};

const statusConfig = {
	planned: {
		icon: Circle,
		label: "Planned",
		variant: "secondary" as const,
		color: "text-muted-foreground",
	},
	"in-progress": {
		icon: Clock,
		label: "In Progress",
		variant: "default" as const,
		color: "text-primary",
	},
	completed: {
		icon: CheckCircle2,
		label: "Completed",
		variant: "outline" as const,
		color: "text-green-600",
	},
};

const priorityConfig = {
	low: {
		label: "Low Priority",
		color: "text-muted-foreground",
	},
	medium: {
		label: "Medium Priority",
		color: "text-orange-600",
	},
	high: {
		label: "High Priority",
		color: "text-red-600",
	},
};

export function FeatureRoadmap({
	title = "Feature Roadmap",
	description = "See what we're building next to make your experience even better",
	features,
	showProgress = true,
}: FeatureRoadmapProps) {
	const completedCount = features.filter(
		(f) => f.status === "completed",
	).length;
	const inProgressCount = features.filter(
		(f) => f.status === "in-progress",
	).length;
	const totalCount = features.length;
	const progressPercentage =
		totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

	return (
		<Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-start gap-3">
						<div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
							<Sparkles className="size-5" />
						</div>
						<div>
							<CardTitle className="flex items-center gap-2">
								{title}
								{inProgressCount > 0 && (
									<Badge className="h-5 px-1.5 text-xs" variant="default">
										{inProgressCount} Active
									</Badge>
								)}
							</CardTitle>
							<CardDescription className="mt-1">{description}</CardDescription>
						</div>
					</div>

					{showProgress && totalCount > 0 && (
						<div className="text-muted-foreground min-w-[100px] text-right text-sm">
							<div className="font-semibold">
								{completedCount} of {totalCount}
							</div>
							<div className="text-xs">Completed</div>
						</div>
					)}
				</div>

				{showProgress && totalCount > 0 && (
					<div className="mt-4">
						<Progress className="h-2" value={progressPercentage} />
					</div>
				)}
			</CardHeader>

			<CardContent>
				<div className="space-y-3">
					{features.map((feature) => {
						const status = statusConfig[feature.status];
						const StatusIcon = status.icon;
						const priority = feature.priority
							? priorityConfig[feature.priority]
							: null;

						return (
							<div
								key={feature.id}
								className="hover:bg-accent/50 group rounded-lg border border-transparent p-3 transition-all hover:border-border"
							>
								<div className="flex items-start gap-3">
									<div className={`${status.color} mt-0.5`}>
										<StatusIcon className="size-5" />
									</div>
									<div className="min-w-0 flex-1">
										<div className="mb-1 flex items-center gap-2">
											<h4 className="font-semibold text-sm">{feature.title}</h4>
											<Badge
												className="h-5 flex-shrink-0 text-xs"
												variant={status.variant}
											>
												{status.label}
											</Badge>
											{priority && (
												<span
													className={`${priority.color} flex-shrink-0 text-xs font-medium`}
												>
													{priority.label}
												</span>
											)}
										</div>
										<p className="text-muted-foreground text-sm leading-relaxed">
											{feature.description}
										</p>
										{feature.estimatedDate && (
											<div className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs">
												<Target className="size-3" />
												<span>Target: {feature.estimatedDate}</span>
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{features.length === 0 && (
					<div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
						<Lightbulb className="mb-3 size-10 opacity-50" />
						<p className="text-sm">No features planned yet. Check back soon!</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
