import { cn } from "@stratos/ui";
import { Loader2 } from "lucide-react";

/**
 * Spinner - Inline loading indicator
 *
 * Use for inline/button loading states where a full skeleton would be inappropriate.
 * For full-page loading, use skeleton components from @/components/ui/skeletons
 *
 * @example
 * ```tsx
 * <Button disabled={isLoading}>
 *   {isLoading && <Spinner size="sm" />}
 *   Submit
 * </Button>
 * ```
 */

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export type SpinnerProps = {
	size?: SpinnerSize;
	className?: string;
	/** Screen reader text (defaults to "Loading...") */
	srText?: string;
};

const sizeClasses: Record<SpinnerSize, string> = {
	xs: "h-3 w-3",
	sm: "h-4 w-4",
	md: "h-6 w-6",
	lg: "h-8 w-8",
	xl: "h-12 w-12",
};

export function Spinner({
	size = "md",
	className,
	srText = "Loading...",
}: SpinnerProps) {
	return (
		<>
			<Loader2
				className={cn("animate-spin", sizeClasses[size], className)}
				aria-hidden="true"
			/>
			<span className="sr-only">{srText}</span>
		</>
	);
}

/**
 * SpinnerOverlay - Full-page/container loading overlay
 *
 * Use when you need to block interaction during loading.
 * Shows a centered spinner over the content.
 *
 * @example
 * ```tsx
 * {isLoading && <SpinnerOverlay />}
 * ```
 */
export function SpinnerOverlay({ text = "Loading..." }: { text?: string }) {
	return (
		<div className="bg-background/80 backdrop-blur-sm absolute inset-0 z-50 flex items-center justify-center">
			<div className="flex flex-col items-center gap-3">
				<Spinner size="lg" />
				<p className="text-muted-foreground text-sm font-medium">{text}</p>
			</div>
		</div>
	);
}
