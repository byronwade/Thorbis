/**
 * MonthlyView - Lazy Loaded Wrapper
 *
 * Performance optimization:
 * - Dynamically imports the full 882-line monthly calendar view (~20KB)
 * - Only loads when user switches to "Month" view mode
 * - Shows skeleton loading state while importing
 * - Reduces initial schedule page bundle
 */

"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const MonthlyView = dynamic(
	() => import("./monthly-view").then((mod) => ({ default: mod.MonthlyView })),
	{
		loading: () => (
			<div className="flex h-full w-full flex-col gap-4 p-4">
				<div className="grid grid-cols-7 gap-2">
					{Array.from({ length: 35 }).map((_, i) => (
						<Skeleton key={i} className="aspect-square w-full" />
					))}
				</div>
			</div>
		),
		ssr: false, // Calendar view requires browser environment
	},
);

export function MonthlyViewLazy() {
	return <MonthlyView />;
}
