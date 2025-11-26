"use client";

/**
 * Call Window Skeleton Components
 *
 * Loading skeletons for all call window components.
 * Provides visual feedback while data loads and prevents layout shift.
 */

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Customer Stats Bar Skeleton
 */
export function CustomerStatsBarSkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<div
			className={cn(
				"bg-card/80 sticky top-0 z-10 border-b backdrop-blur-sm",
				className,
			)}
		>
			<div className="grid grid-cols-5 divide-x">
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className="flex flex-col items-center justify-center gap-1.5 p-3"
					>
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-3 w-8" />
					</div>
				))}
			</div>
		</div>
	);
}

/**
 * Customer Alert Banner Skeleton
 */
export function CustomerAlertBannerSkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<div className={cn("space-y-2", className)}>
			<div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
				<Skeleton className="h-8 w-8 rounded-full" />
				<div className="flex-1 space-y-2">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-3 w-48" />
				</div>
			</div>
		</div>
	);
}

/**
 * Quick Actions Panel Skeleton
 */
export function QuickActionsPanelSkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<div className={cn("space-y-3", className)}>
			<div className="flex items-center justify-between">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-6 w-16" />
			</div>
			<div className="grid grid-cols-3 gap-2">
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton key={i} className="h-16 rounded-lg" />
				))}
			</div>
		</div>
	);
}

/**
 * Previous Call Summary Skeleton
 */
export function PreviousCallSummarySkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<div className={cn("rounded-xl border bg-muted/30 p-4", className)}>
			<div className="flex items-center gap-3">
				<Skeleton className="h-10 w-10 rounded-full" />
				<div className="flex-1 space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-3 w-32" />
				</div>
				<Skeleton className="h-5 w-16 rounded-full" />
			</div>
		</div>
	);
}

/**
 * AI Suggestions Widget Skeleton
 */
export function AISuggestionsWidgetSkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<div
			className={cn(
				"overflow-hidden rounded-xl border border-violet-500/20",
				"bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5",
				className,
			)}
		>
			<div className="flex items-center justify-between border-b border-violet-500/10 px-4 py-2">
				<div className="flex items-center gap-2">
					<Skeleton className="h-6 w-6 rounded-full" />
					<Skeleton className="h-4 w-24" />
				</div>
			</div>
			<div className="space-y-2 p-3">
				{Array.from({ length: 2 }).map((_, i) => (
					<div key={i} className="rounded-lg border bg-card/50 p-3">
						<div className="flex items-start gap-3">
							<Skeleton className="h-8 w-8 rounded-full" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-3 w-48" />
								<Skeleton className="h-7 w-20 rounded" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

/**
 * Sentiment Indicator Skeleton
 */
export function SentimentIndicatorSkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<div className={cn("rounded-xl border bg-muted/30 p-4", className)}>
			<div className="flex items-center gap-4">
				<Skeleton className="h-14 w-14 rounded-full" />
				<div className="flex-1 space-y-2">
					<Skeleton className="h-5 w-24" />
					<Skeleton className="h-3 w-32" />
				</div>
			</div>
			<div className="mt-4 space-y-2">
				<Skeleton className="h-2 w-full rounded-full" />
				<div className="flex justify-between">
					<Skeleton className="h-3 w-16" />
					<Skeleton className="h-3 w-12" />
					<Skeleton className="h-3 w-12" />
				</div>
			</div>
		</div>
	);
}

/**
 * Extracted Info Panel Skeleton
 */
export function ExtractedInfoPanelSkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<div
			className={cn(
				"overflow-hidden rounded-xl border border-emerald-500/20",
				"bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5",
				className,
			)}
		>
			<div className="flex items-center justify-between border-b border-emerald-500/10 px-4 py-2">
				<div className="flex items-center gap-2">
					<Skeleton className="h-6 w-6 rounded-full" />
					<Skeleton className="h-4 w-24" />
				</div>
				<Skeleton className="h-5 w-12 rounded-full" />
			</div>
			<div className="space-y-3 p-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="space-y-1.5">
						<div className="flex items-center gap-1.5">
							<Skeleton className="h-5 w-5 rounded" />
							<Skeleton className="h-3 w-16" />
						</div>
						<div className="ml-6 space-y-1">
							<Skeleton className="h-8 w-full rounded-lg" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

/**
 * Smart Call Notes Skeleton
 */
export function SmartCallNotesSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn("rounded-xl border bg-card", className)}>
			<div className="flex items-center justify-between border-b px-4 py-2">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-20" />
				</div>
				<div className="flex items-center gap-1">
					<Skeleton className="h-7 w-16 rounded" />
					<Skeleton className="h-7 w-7 rounded" />
					<Skeleton className="h-7 w-7 rounded" />
				</div>
			</div>
			<Skeleton className="m-3 h-[150px] rounded" />
			<div className="flex items-center justify-between border-t px-3 py-1.5">
				<Skeleton className="h-3 w-24" />
				<Skeleton className="h-3 w-16" />
			</div>
		</div>
	);
}

/**
 * Transcript Panel Skeleton
 */
export function TranscriptPanelSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn("rounded-xl border bg-card", className)}>
			<div className="flex items-center justify-between border-b px-4 py-3">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-28" />
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-8 rounded" />
					<Skeleton className="h-8 w-8 rounded" />
				</div>
			</div>
			<div className="border-b p-3">
				<Skeleton className="h-9 w-full rounded" />
			</div>
			<div className="space-y-3 p-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className={cn(
							"rounded-lg border p-3",
							i % 2 === 0 ? "ml-0 mr-8" : "ml-8 mr-0",
						)}
					>
						<div className="mb-2 flex items-center justify-between">
							<Skeleton className="h-3 w-12" />
							<Skeleton className="h-3 w-16" />
						</div>
						<Skeleton className="h-4 w-full" />
						<Skeleton className="mt-1 h-4 w-3/4" />
					</div>
				))}
			</div>
		</div>
	);
}

/**
 * Customer Sidebar Skeleton
 */
export function CustomerSidebarSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn("flex h-full flex-col", className)}>
			<CustomerStatsBarSkeleton />
			<div className="flex-1 space-y-4 overflow-hidden p-4">
				<CustomerAlertBannerSkeleton />
				<PreviousCallSummarySkeleton />
				<div className="rounded-xl border bg-card p-4">
					<QuickActionsPanelSkeleton />
				</div>
				<div className="rounded-xl border bg-card p-4">
					<div className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<div className="flex gap-1.5">
							<Skeleton className="h-6 w-12 rounded-full" />
							<Skeleton className="h-6 w-16 rounded-full" />
							<Skeleton className="h-6 w-14 rounded-full" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Full Call Window Skeleton
 */
export function CallWindowSkeleton() {
	return (
		<div className="flex h-screen flex-col bg-background">
			{/* Toolbar Skeleton */}
			<div className="flex items-center justify-between border-b px-6 py-3">
				<div className="flex items-center gap-3">
					<Skeleton className="h-11 w-11 rounded-full" />
					<div className="space-y-1">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-3 w-24" />
					</div>
				</div>
				<div className="flex items-center gap-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-10 w-10 rounded-full" />
					))}
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-6 w-20 rounded-full" />
					<Skeleton className="h-8 w-8 rounded" />
				</div>
			</div>

			{/* Main Content Skeleton */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left Panel */}
				<div className="flex w-[35%] flex-col border-r">
					<TranscriptPanelSkeleton className="flex-1" />
				</div>

				{/* Right Panel */}
				<div className="w-[65%]">
					<CustomerSidebarSkeleton className="h-full" />
				</div>
			</div>
		</div>
	);
}
