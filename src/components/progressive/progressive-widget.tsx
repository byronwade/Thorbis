/**
 * Progressive Widget Component
 *
 * Dashboard widget component that loads data on-demand when it becomes visible
 * in the viewport. Uses Intersection Observer for automatic loading.
 *
 * Perfect for Customer/Property 360° views with multiple widgets.
 *
 * Usage:
 * <ProgressiveWidget
 *   title="Recent Jobs"
 *   loadData={(isVisible) => useProgressiveData(
 *     ["customer-jobs", customerId],
 *     () => supabase.from("jobs").select("*").eq("customer_id", customerId),
 *     { enabled: isVisible }
 *   )}
 * >
 *   {({ data, isLoading }) => (
 *     isLoading ? <WidgetSkeleton /> : <JobsList jobs={data} />
 *   )}
 * </ProgressiveWidget>
 */

"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ProgressiveWidgetProps = {
	title: string;
	description?: string;
	children: ReactNode | ((props: { isVisible: boolean }) => ReactNode);
	icon?: ReactNode;
	badge?: string | number;
	className?: string;
	/**
	 * Root margin for intersection observer
	 * Default: "100px" (load when widget is 100px from viewport)
	 */
	rootMargin?: string;
	/**
	 * Whether to load immediately without waiting for visibility
	 * Default: false
	 */
	loadImmediately?: boolean;
};

export function ProgressiveWidget({
	title,
	description,
	children,
	icon,
	badge,
	className,
	rootMargin = "100px",
	loadImmediately = false,
}: ProgressiveWidgetProps) {
	const [isVisible, setIsVisible] = useState(loadImmediately);
	const widgetRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (loadImmediately) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setIsVisible(true);
					// Once visible, we don't need to observe anymore
					observer.disconnect();
				}
			},
			{
				rootMargin,
				threshold: 0.1,
			}
		);

		if (widgetRef.current) {
			observer.observe(widgetRef.current);
		}

		return () => observer.disconnect();
	}, [loadImmediately, rootMargin]);

	return (
		<Card ref={widgetRef} className={className}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						{icon}
						<CardTitle className="text-lg">{title}</CardTitle>
					</div>
					{badge && (
						<span className="bg-muted rounded-full px-2 py-0.5 text-xs font-medium">{badge}</span>
					)}
				</div>
				{description && <p className="text-muted-foreground text-sm">{description}</p>}
			</CardHeader>
			<CardContent>
				{typeof children === "function" ? children({ isVisible }) : children}
			</CardContent>
		</Card>
	);
}

/**
 * Widget Skeleton Component
 * Standard loading skeleton for widgets
 */
export function WidgetSkeleton({ rows = 3 }: { rows?: number }) {
	return (
		<div className="space-y-3">
			{Array.from({ length: rows }).map((_, i) => (
				<Skeleton key={i} className="h-16 w-full" />
			))}
		</div>
	);
}
