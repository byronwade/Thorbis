"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CommunicationListSkeleton({
	count = 5,
	className,
}: {
	count?: number;
	className?: string;
}) {
	return (
		<div className={cn("space-y-2 px-2", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={i}
					className="flex items-start gap-3 rounded-lg p-2 hover:bg-accent/50 transition-colors"
				>
					<Skeleton className="h-10 w-10 rounded-full shrink-0" />
					<div className="flex-1 space-y-2 min-w-0">
						<div className="flex items-center justify-between gap-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-16" />
						</div>
						<Skeleton className="h-3 w-full max-w-[80%]" />
						<Skeleton className="h-3 w-full max-w-[60%]" />
					</div>
				</div>
			))}
		</div>
	);
}

export function CommunicationDetailSkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<div className={cn("space-y-4 p-4", className)}>
			{/* Header */}
			<div className="space-y-3">
				<Skeleton className="h-8 w-3/4" />
				<div className="flex items-center gap-3">
					<Skeleton className="h-10 w-10 rounded-md shrink-0" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-48" />
						<Skeleton className="h-3 w-64" />
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="space-y-3 pt-4">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-4/5" />
			</div>
		</div>
	);
}

export function SmsConversationSkeleton({
	count = 3,
	className,
}: {
	count?: number;
	className?: string;
}) {
	return (
		<div className={cn("space-y-4 p-4", className)}>
			{Array.from({ length: count }).map((_, i) => {
				const isOutbound = i % 2 === 0;
				return (
					<div
						key={i}
						className={cn(
							"flex gap-2",
							isOutbound ? "flex-row-reverse" : "flex-row",
						)}
					>
						{isOutbound ? null : <Skeleton className="h-9 w-9 rounded-full shrink-0" />}
						<div
							className={cn(
								"flex flex-col max-w-[75%]",
								isOutbound ? "items-end" : "items-start",
							)}
						>
							<Skeleton
								className={cn(
									"h-12 rounded-2xl",
									isOutbound ? "w-32" : "w-40",
								)}
							/>
							<Skeleton className="h-3 w-12 mt-1" />
						</div>
						{isOutbound ? <Skeleton className="h-9 w-9 rounded-full shrink-0" /> : null}
					</div>
				);
			})}
		</div>
	);
}

export function TeamsChannelSkeleton({
	count = 5,
	className,
}: {
	count?: number;
	className?: string;
}) {
	return (
		<div className={cn("space-y-2 p-4", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="flex gap-2">
					<Skeleton className="h-9 w-9 rounded-md shrink-0" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-16 rounded-2xl w-full max-w-[75%]" />
					</div>
				</div>
			))}
		</div>
	);
}

