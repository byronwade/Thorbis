"use client";

/**
 * AI Price Recommend Button
 *
 * A button that triggers AI price recommendation and shows results in a popover.
 * Can be placed next to price input fields.
 *
 * Features:
 * - Shows suggested price with confidence
 * - Displays price range and market position
 * - One-click to apply suggested price
 */

import { AlertCircle, Check, DollarSign, Loader2, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	type PriceRecommendationContext,
	useAIPriceRecommendation,
} from "@/hooks/use-ai-price-recommendation";
import { cn } from "@/lib/utils";

type AIPriceRecommendButtonProps = {
	/** Context for generating recommendation */
	context: PriceRecommendationContext;
	/** Callback when price is accepted */
	onAccept: (price: number) => void;
	/** Disabled state */
	disabled?: boolean;
	/** Button size */
	size?: "xs" | "sm" | "default";
	/** Additional className */
	className?: string;
};

export function AIPriceRecommendButton({
	context,
	onAccept,
	disabled = false,
	size = "sm",
	className,
}: AIPriceRecommendButtonProps) {
	const [open, setOpen] = useState(false);
	const { recommendation, isLoading, error, getRecommendation, clear } =
		useAIPriceRecommendation();

	const handleOpenChange = useCallback(
		(newOpen: boolean) => {
			setOpen(newOpen);
			if (!newOpen) {
				clear();
			}
		},
		[clear],
	);

	const handleGetRecommendation = useCallback(async () => {
		setOpen(true);
		await getRecommendation(context);
	}, [getRecommendation, context]);

	const handleAccept = useCallback(() => {
		if (recommendation) {
			onAccept(recommendation.suggestedPrice);
			setOpen(false);
			clear();
		}
	}, [recommendation, onAccept, clear]);

	const sizeClasses = {
		xs: "h-6 w-6 p-0",
		sm: "h-8 w-8 p-0",
		default: "h-9 w-9 p-0",
	};

	const iconSizes = {
		xs: "h-3 w-3",
		sm: "h-3.5 w-3.5",
		default: "h-4 w-4",
	};

	const marketPositionColors = {
		budget: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
		"mid-market":
			"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
		premium:
			"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
	};

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<PopoverTrigger asChild>
							<Button
								type="button"
								variant="outline"
								onClick={handleGetRecommendation}
								disabled={disabled || isLoading || !context.serviceName?.trim()}
								className={cn(
									sizeClasses[size],
									"border-primary/30 text-primary hover:bg-primary/10 hover:text-primary",
									className,
								)}
							>
								{isLoading ? (
									<Loader2 className={cn(iconSizes[size], "animate-spin")} />
								) : (
									<Sparkles className={iconSizes[size]} />
								)}
							</Button>
						</PopoverTrigger>
					</TooltipTrigger>
					<TooltipContent>
						<p>Get AI price recommendation</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<PopoverContent className="w-72 p-0" align="end">
				<div className="border-b px-3 py-2">
					<div className="flex items-center gap-2 text-sm font-medium">
						<DollarSign className="h-4 w-4 text-primary" />
						AI Price Recommendation
					</div>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : error ? (
					<div className="flex items-center gap-2 px-3 py-4 text-sm text-destructive">
						<AlertCircle className="h-4 w-4 shrink-0" />
						<span>{error}</span>
					</div>
				) : recommendation ? (
					<div className="p-3 space-y-3">
						{/* Suggested Price */}
						<div className="text-center">
							<p className="text-xs text-muted-foreground mb-1">
								Suggested Price
							</p>
							<p className="text-3xl font-bold text-primary">
								${recommendation.suggestedPrice.toFixed(2)}
							</p>
							<div className="flex items-center justify-center gap-2 mt-1">
								<Badge
									variant="outline"
									className={marketPositionColors[recommendation.marketPosition]}
								>
									{recommendation.marketPosition}
								</Badge>
								<span className="text-xs text-muted-foreground">
									{recommendation.confidence}% confidence
								</span>
							</div>
						</div>

						{/* Price Range */}
						<div className="bg-muted/50 rounded-md p-2 text-center">
							<p className="text-xs text-muted-foreground">Typical Range</p>
							<p className="text-sm font-medium">
								${recommendation.priceRange.low.toFixed(2)} - $
								{recommendation.priceRange.high.toFixed(2)}
							</p>
						</div>

						{/* Reasoning */}
						<p className="text-xs text-muted-foreground leading-relaxed">
							{recommendation.reasoning}
						</p>

						{/* Actions */}
						<div className="flex gap-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="flex-1"
								onClick={() => handleOpenChange(false)}
							>
								Cancel
							</Button>
							<Button
								type="button"
								size="sm"
								className="flex-1"
								onClick={handleAccept}
							>
								<Check className="mr-1 h-3.5 w-3.5" />
								Apply
							</Button>
						</div>
					</div>
				) : (
					<div className="px-3 py-8 text-center text-sm text-muted-foreground">
						Enter a service name to get a price recommendation
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
