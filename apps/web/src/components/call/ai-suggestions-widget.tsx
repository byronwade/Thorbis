"use client";

/**
 * AI Suggestions Widget
 *
 * Displays AI-powered suggestions for next best actions during a call.
 * Analyzes transcript and customer context to recommend actions.
 *
 * Suggestions include:
 * - Create emergency job (detected urgency)
 * - Schedule maintenance (detected need)
 * - Offer payment plan (outstanding balance)
 * - Apply discount (unhappy customer)
 * - Escalate to manager (complex issue)
 */

import {
	AlertTriangle,
	ArrowRight,
	BadgePercent,
	Briefcase,
	Calendar,
	CheckCircle2,
	CreditCard,
	Lightbulb,
	Loader2,
	MessageSquare,
	Phone,
	RefreshCw,
	Sparkles,
	ThumbsDown,
	UserCog,
	X,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type SuggestionType =
	| "emergency_job"
	| "schedule_maintenance"
	| "take_payment"
	| "offer_discount"
	| "escalate"
	| "send_quote"
	| "book_callback"
	| "upsell"
	| "retention_offer"
	| "verify_info";

type Suggestion = {
	id: string;
	type: SuggestionType;
	title: string;
	description: string;
	reason: string;
	confidence: number; // 0-100
	priority: "high" | "medium" | "low";
	action: () => void;
	dismissed?: boolean;
};

type AISuggestionsWidgetProps = {
	suggestions: Suggestion[];
	isAnalyzing?: boolean;
	onRefresh?: () => void;
	onDismiss?: (suggestionId: string) => void;
	onAccept?: (suggestion: Suggestion) => void;
	className?: string;
	compact?: boolean;
};

const suggestionConfig: Record<
	SuggestionType,
	{
		icon: React.ElementType;
		color: string;
		bgColor: string;
		borderColor: string;
	}
> = {
	emergency_job: {
		icon: Zap,
		color: "text-destructive",
		bgColor: "bg-destructive/10",
		borderColor: "border-destructive/30",
	},
	schedule_maintenance: {
		icon: Calendar,
		color: "text-primary",
		bgColor: "bg-primary/10",
		borderColor: "border-primary/30",
	},
	take_payment: {
		icon: CreditCard,
		color: "text-success",
		bgColor: "bg-success/10",
		borderColor: "border-success/30",
	},
	offer_discount: {
		icon: BadgePercent,
		color: "text-warning",
		bgColor: "bg-warning/10",
		borderColor: "border-warning/30",
	},
	escalate: {
		icon: UserCog,
		color: "text-orange-500",
		bgColor: "bg-orange-500/10",
		borderColor: "border-orange-500/30",
	},
	send_quote: {
		icon: MessageSquare,
		color: "text-primary",
		bgColor: "bg-primary/10",
		borderColor: "border-primary/30",
	},
	book_callback: {
		icon: Phone,
		color: "text-muted-foreground",
		bgColor: "bg-muted",
		borderColor: "border-muted",
	},
	upsell: {
		icon: Briefcase,
		color: "text-success",
		bgColor: "bg-success/10",
		borderColor: "border-success/30",
	},
	retention_offer: {
		icon: ThumbsDown,
		color: "text-warning",
		bgColor: "bg-warning/10",
		borderColor: "border-warning/30",
	},
	verify_info: {
		icon: CheckCircle2,
		color: "text-muted-foreground",
		bgColor: "bg-muted",
		borderColor: "border-muted",
	},
};

const priorityOrder = { high: 0, medium: 1, low: 2 };

export function AISuggestionsWidget({
	suggestions,
	isAnalyzing = false,
	onRefresh,
	onDismiss,
	onAccept,
	className,
	compact = false,
}: AISuggestionsWidgetProps) {
	const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

	// Filter and sort suggestions
	const visibleSuggestions = suggestions
		.filter((s) => !dismissedIds.has(s.id) && !s.dismissed)
		.sort((a, b) => {
			// Sort by priority first, then by confidence
			const priorityDiff =
				priorityOrder[a.priority] - priorityOrder[b.priority];
			if (priorityDiff !== 0) return priorityDiff;
			return b.confidence - a.confidence;
		})
		.slice(0, compact ? 2 : 4); // Show fewer in compact mode

	const handleDismiss = (suggestionId: string) => {
		setDismissedIds((prev) => new Set([...prev, suggestionId]));
		onDismiss?.(suggestionId);
	};

	const handleAccept = (suggestion: Suggestion) => {
		suggestion.action();
		onAccept?.(suggestion);
		handleDismiss(suggestion.id);
	};

	if (visibleSuggestions.length === 0 && !isAnalyzing) {
		return null;
	}

	return (
		<TooltipProvider delayDuration={300}>
			<div
				className={cn(
					"overflow-hidden rounded-xl border shadow-sm",
					"bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5",
					"border-violet-500/20",
					className,
				)}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-violet-500/10 px-4 py-2">
					<div className="flex items-center gap-2">
						<div className="rounded-full bg-violet-500/10 p-1.5">
							<Sparkles className="h-3.5 w-3.5 text-violet-500" />
						</div>
						<span className="text-sm font-semibold">AI Suggestions</span>
						{isAnalyzing && (
							<Badge
								variant="outline"
								className="gap-1 border-violet-500/30 text-[10px] text-violet-500"
							>
								<Loader2 className="h-2.5 w-2.5 animate-spin" />
								Analyzing...
							</Badge>
						)}
					</div>
					{onRefresh && (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className="h-7 w-7"
									onClick={onRefresh}
									size="icon"
									variant="ghost"
									disabled={isAnalyzing}
								>
									<RefreshCw
										className={cn("h-3.5 w-3.5", isAnalyzing && "animate-spin")}
									/>
								</Button>
							</TooltipTrigger>
							<TooltipContent>Refresh suggestions</TooltipContent>
						</Tooltip>
					)}
				</div>

				{/* Suggestions List */}
				<div className="space-y-2 p-3">
					{visibleSuggestions.map((suggestion) => {
						const config = suggestionConfig[suggestion.type];
						const Icon = config.icon;

						return (
							<div
								className={cn(
									"group relative rounded-lg border p-3 transition-all",
									config.bgColor,
									config.borderColor,
									"hover:shadow-md",
								)}
								key={suggestion.id}
							>
								<div className="flex items-start gap-3">
									{/* Icon */}
									<div
										className={cn("mt-0.5 rounded-full p-2", config.bgColor)}
									>
										<Icon className={cn("h-4 w-4", config.color)} />
									</div>

									{/* Content */}
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2">
											<h4 className={cn("text-sm font-semibold", config.color)}>
												{suggestion.title}
											</h4>
											{suggestion.priority === "high" && (
												<Badge
													variant="outline"
													className="border-destructive/50 bg-destructive/10 text-[10px] text-destructive"
												>
													Urgent
												</Badge>
											)}
											<span className="text-muted-foreground ml-auto text-[10px]">
												{suggestion.confidence}% confident
											</span>
										</div>
										<p className="text-muted-foreground mt-0.5 text-xs">
											{suggestion.description}
										</p>
										{!compact && (
											<p className="mt-1 text-[10px] italic opacity-70">
												<Lightbulb className="mr-1 inline h-3 w-3" />
												{suggestion.reason}
											</p>
										)}

										{/* Action buttons */}
										<div className="mt-2 flex items-center gap-2">
											<Button
												className={cn("h-7 gap-1 text-xs", config.color)}
												onClick={() => handleAccept(suggestion)}
												size="sm"
												variant="outline"
											>
												{suggestion.title.split(" ")[0]}
												<ArrowRight className="h-3 w-3" />
											</Button>
											<Button
												className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
												onClick={() => handleDismiss(suggestion.id)}
												size="icon"
												variant="ghost"
											>
												<X className="h-3 w-3" />
											</Button>
										</div>
									</div>
								</div>
							</div>
						);
					})}

					{/* Loading state */}
					{isAnalyzing && visibleSuggestions.length === 0 && (
						<div className="flex items-center justify-center py-6">
							<div className="text-center">
								<Loader2 className="mx-auto h-6 w-6 animate-spin text-violet-500" />
								<p className="text-muted-foreground mt-2 text-xs">
									Analyzing conversation...
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Footer hint */}
				{visibleSuggestions.length > 0 && (
					<div className="border-t border-violet-500/10 px-3 py-2">
						<p className="text-muted-foreground/60 text-center text-[10px]">
							Suggestions based on transcript analysis and customer history
						</p>
					</div>
				)}
			</div>
		</TooltipProvider>
	);
}

/**
 * Generate mock suggestions based on context
 * In production, this would call an AI service
 */
export function generateMockSuggestions(context: {
	hasOutstandingBalance?: boolean;
	balanceAmount?: number;
	customerSentiment?: "positive" | "neutral" | "negative";
	mentionedIssue?: string;
	isEmergency?: boolean;
	isMaintenanceDue?: boolean;
	isAtRisk?: boolean;
}): Suggestion[] {
	const suggestions: Suggestion[] = [];

	if (context.isEmergency) {
		suggestions.push({
			id: "emergency_job",
			type: "emergency_job",
			title: "Create Emergency Job",
			description:
				"Customer mentioned urgent issue requiring immediate attention",
			reason: "Detected keywords: 'leak', 'flooding', 'no heat', 'emergency'",
			confidence: 95,
			priority: "high",
			action: () => console.log("Creating emergency job..."),
		});
	}

	if (context.hasOutstandingBalance && context.balanceAmount) {
		suggestions.push({
			id: "take_payment",
			type: "take_payment",
			title: "Offer Payment",
			description: `Outstanding balance of $${context.balanceAmount.toLocaleString()}`,
			reason: "Customer has unpaid invoices - good opportunity to collect",
			confidence: 80,
			priority: "medium",
			action: () => console.log("Opening payment..."),
		});
	}

	if (context.customerSentiment === "negative") {
		suggestions.push({
			id: "offer_discount",
			type: "offer_discount",
			title: "Consider Discount",
			description:
				"Customer seems frustrated - consider offering a goodwill discount",
			reason: "Detected negative sentiment in conversation",
			confidence: 75,
			priority: "medium",
			action: () => console.log("Applying discount..."),
		});
	}

	if (context.isAtRisk) {
		suggestions.push({
			id: "retention_offer",
			type: "retention_offer",
			title: "Retention Offer",
			description: "Customer at risk of churning - offer loyalty incentive",
			reason: "Multiple cancelled appointments detected",
			confidence: 70,
			priority: "medium",
			action: () => console.log("Showing retention offers..."),
		});
	}

	if (context.isMaintenanceDue) {
		suggestions.push({
			id: "schedule_maintenance",
			type: "schedule_maintenance",
			title: "Schedule Maintenance",
			description: "Annual maintenance is due for this customer",
			reason: "Last maintenance was over 12 months ago",
			confidence: 85,
			priority: "low",
			action: () => console.log("Opening scheduler..."),
		});
	}

	return suggestions;
}
