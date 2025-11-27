"use client";

/**
 * AI Suggestions Dropdown
 *
 * Displays AI-generated suggestions in a dropdown/popover.
 * Used with form fields to show suggestion options.
 *
 * Features:
 * - Keyboard navigation
 * - Loading skeleton
 * - Error state
 * - Click to select
 */

import { AlertCircle, Check, Loader2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Suggestion } from "@/hooks/use-ai-suggestion";

type AISuggestionsDropdownProps = {
	/** Suggestions to display */
	suggestions: Suggestion[];
	/** Loading state */
	isLoading?: boolean;
	/** Error message */
	error?: string | null;
	/** Callback when suggestion is selected */
	onSelect: (suggestion: Suggestion) => void;
	/** Callback to trigger generation */
	onGenerate?: () => void;
	/** Whether the dropdown is open */
	open?: boolean;
	/** Callback when open state changes */
	onOpenChange?: (open: boolean) => void;
	/** Trigger element */
	trigger?: React.ReactNode;
	/** Placeholder text when no suggestions */
	placeholder?: string;
	/** Additional className */
	className?: string;
	/** Align popover */
	align?: "start" | "center" | "end";
	/** Side of trigger to show popover */
	side?: "top" | "right" | "bottom" | "left";
};

export function AISuggestionsDropdown({
	suggestions,
	isLoading = false,
	error = null,
	onSelect,
	onGenerate,
	open,
	onOpenChange,
	trigger,
	placeholder = "No suggestions available",
	className,
	align = "start",
	side = "bottom",
}: AISuggestionsDropdownProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const listRef = useRef<HTMLDivElement>(null);

	// Reset selection when suggestions change
	useEffect(() => {
		setSelectedIndex(0);
	}, [suggestions]);

	// Handle keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (suggestions.length === 0) return;

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev < suggestions.length - 1 ? prev + 1 : prev,
				);
				break;
			case "ArrowUp":
				e.preventDefault();
				setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
				break;
			case "Enter":
				e.preventDefault();
				if (suggestions[selectedIndex]) {
					onSelect(suggestions[selectedIndex]);
				}
				break;
			case "Escape":
				e.preventDefault();
				onOpenChange?.(false);
				break;
		}
	};

	const defaultTrigger = (
		<Button
			type="button"
			variant="outline"
			size="sm"
			className="h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
			onClick={onGenerate}
		>
			{isLoading ? (
				<Loader2 className="h-3.5 w-3.5 animate-spin" />
			) : (
				<Sparkles className="h-3.5 w-3.5" />
			)}
			<span className="hidden sm:inline">AI Suggest</span>
		</Button>
	);

	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>{trigger || defaultTrigger}</PopoverTrigger>
			<PopoverContent
				className={cn("w-80 p-0", className)}
				align={align}
				side={side}
				onKeyDown={handleKeyDown}
			>
				<div className="border-b px-3 py-2">
					<div className="flex items-center gap-2 text-sm font-medium">
						<Sparkles className="h-4 w-4 text-primary" />
						AI Suggestions
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
				) : suggestions.length === 0 ? (
					<div className="px-3 py-8 text-center text-sm text-muted-foreground">
						{placeholder}
					</div>
				) : (
					<ScrollArea className="max-h-60">
						<div ref={listRef} className="p-1">
							{suggestions.map((suggestion, index) => (
								<button
									key={suggestion.id}
									type="button"
									onClick={() => onSelect(suggestion)}
									className={cn(
										"w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
										"hover:bg-accent hover:text-accent-foreground",
										"focus:outline-none focus:bg-accent focus:text-accent-foreground",
										index === selectedIndex && "bg-accent text-accent-foreground",
									)}
								>
									<div className="flex items-start gap-2">
										<Check
											className={cn(
												"mt-0.5 h-4 w-4 shrink-0",
												index === selectedIndex
													? "text-primary"
													: "text-transparent",
											)}
										/>
										<span className="flex-1">{suggestion.text}</span>
									</div>
									{suggestion.confidence !== undefined && (
										<div className="mt-1 ml-6 text-xs text-muted-foreground">
											{suggestion.confidence}% confidence
										</div>
									)}
								</button>
							))}
						</div>
					</ScrollArea>
				)}

				{!isLoading && suggestions.length > 0 && onGenerate && (
					<div className="border-t p-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="w-full text-muted-foreground"
							onClick={onGenerate}
						>
							<Sparkles className="mr-2 h-3.5 w-3.5" />
							Regenerate
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
