"use client";

/**
 * AI Assist Button
 *
 * A sparkle button that triggers AI suggestions.
 * Can be placed next to any form field to provide AI assistance.
 *
 * Features:
 * - Loading state with spinner
 * - Tooltip with description
 * - Configurable size and appearance
 */

import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type AIAssistButtonProps = {
	/** Click handler */
	onClick: () => void;
	/** Loading state */
	isLoading?: boolean;
	/** Disabled state */
	disabled?: boolean;
	/** Tooltip text */
	tooltip?: string;
	/** Button size */
	size?: "xs" | "sm" | "default";
	/** Additional className */
	className?: string;
	/** Show label text */
	showLabel?: boolean;
	/** Custom label */
	label?: string;
};

export function AIAssistButton({
	onClick,
	isLoading = false,
	disabled = false,
	tooltip = "Get AI suggestions",
	size = "sm",
	className,
	showLabel = false,
	label = "AI",
}: AIAssistButtonProps) {
	const sizeClasses = {
		xs: "h-6 w-6 p-0",
		sm: "h-8 px-2",
		default: "h-9 px-3",
	};

	const iconSizes = {
		xs: "h-3 w-3",
		sm: "h-3.5 w-3.5",
		default: "h-4 w-4",
	};

	const button = (
		<Button
			type="button"
			variant="outline"
			size="sm"
			onClick={onClick}
			disabled={disabled || isLoading}
			className={cn(
				sizeClasses[size],
				"gap-1.5 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary",
				className,
			)}
		>
			{isLoading ? (
				<Loader2 className={cn(iconSizes[size], "animate-spin")} />
			) : (
				<Sparkles className={iconSizes[size]} />
			)}
			{showLabel && <span className="text-xs font-medium">{label}</span>}
		</Button>
	);

	if (tooltip && !showLabel) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>{button}</TooltipTrigger>
					<TooltipContent>
						<p>{tooltip}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return button;
}
