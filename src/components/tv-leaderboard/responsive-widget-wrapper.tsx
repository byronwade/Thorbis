/**
 * Responsive Widget Wrapper
 *
 * Provides container query support for intelligent widget scaling.
 * Widgets adapt to their own size, not the viewport size.
 *
 * Breakpoints (based on height priority):
 * - full: >400px height (complete UI)
 * - comfortable: 200-400px height (simplified UI)
 * - compact: 120-200px height (minimal UI)
 * - tiny: <120px height (raw data only)
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ResponsiveStage = "full" | "comfortable" | "compact" | "tiny";

type ResponsiveWidgetWrapperProps = {
	children: ReactNode;
	className?: string;
	stage?: ResponsiveStage; // Optional: force specific stage for testing
};

export function ResponsiveWidgetWrapper({
	children,
	className,
	stage,
}: ResponsiveWidgetWrapperProps) {
	return (
		<div
			className={cn(
				"bg-background relative h-full w-full rounded-lg border shadow-sm",
				"@container", // Enable container queries
				className
			)}
			data-stage={stage}
		>
			{children}
		</div>
	);
}

/**
 * Responsive content container with intelligent padding
 * Padding scales based on container size
 */
export function ResponsiveContent({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				// Fluid padding using container queries
				"h-full w-full",
				"@[400px]:p-6", // Full stage
				"@[200px]:@[400px]:p-4", // Comfortable stage
				"@[120px]:@[200px]:p-3", // Compact stage
				"p-2", // Tiny stage (default)
				className
			)}
		>
			{children}
		</div>
	);
}

/**
 * Responsive text that scales smoothly with container
 */
export function ResponsiveText({
	children,
	variant = "body",
	className,
}: {
	children: ReactNode;
	variant?: "display" | "title" | "body" | "caption";
	className?: string;
}) {
	const variantClasses = {
		// Using clamp() for fluid typography
		display: "text-[clamp(2rem,8cqh,4rem)] font-bold leading-tight",
		title: "text-[clamp(0.875rem,4cqh,1.5rem)] font-semibold",
		body: "text-[clamp(0.75rem,3cqh,1rem)]",
		caption: "text-[clamp(0.625rem,2.5cqh,0.875rem)] text-muted-foreground",
	};

	return <div className={cn(variantClasses[variant], className)}>{children}</div>;
}

/**
 * Responsive icon that scales with container
 */
export function ResponsiveIcon({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				// Icon scales from 3cqh (tiny) to 8cqh (full)
				"flex shrink-0 items-center justify-center",
				"[&>svg]:size-[clamp(1rem,6cqh,2rem)]",
				className
			)}
		>
			{children}
		</div>
	);
}

/**
 * Conditional rendering based on container size
 * Uses CSS to show/hide content at specific breakpoints
 */
export function ShowAt({
	stage,
	children,
}: {
	stage: "full" | "comfortable" | "compact" | "tiny" | "full-comfortable" | "comfortable-compact";
	children: ReactNode;
}) {
	const stageClasses = {
		full: "hidden @[400px]:block",
		comfortable: "hidden @[200px]:block @[400px]:hidden",
		compact: "hidden @[120px]:block @[200px]:hidden",
		tiny: "block @[120px]:hidden",
		"full-comfortable": "hidden @[200px]:block",
		"comfortable-compact": "hidden @[120px]:block @[400px]:hidden",
	};

	return <div className={stageClasses[stage]}>{children}</div>;
}

/**
 * Responsive grid that adapts column count to container size
 */
export function ResponsiveGrid({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"grid gap-2",
				// Adaptive columns based on width
				"grid-cols-1", // Tiny (default)
				"@[200px]:grid-cols-2", // Compact+
				"@[400px]:grid-cols-3", // Full
				// Adaptive gap
				"@[200px]:gap-3",
				"@[400px]:gap-4",
				className
			)}
		>
			{children}
		</div>
	);
}

/**
 * Responsive flex layout that switches direction based on size
 */
export function ResponsiveFlex({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex gap-2",
				// Column on tiny, row on larger
				"flex-col @[200px]:flex-row @[200px]:items-center",
				"@[200px]:gap-3",
				className
			)}
		>
			{children}
		</div>
	);
}
