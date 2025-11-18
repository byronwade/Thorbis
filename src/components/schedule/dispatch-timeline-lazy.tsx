/**
 * DispatchTimeline - Lazy Loaded Wrapper
 *
 * Performance optimization:
 * - Dynamically imports the full 1638-line dispatch timeline component (~35KB)
 * - Only loads when user switches to "Day" view mode
 * - Shows skeleton loading state while importing
 * - Reduces initial schedule page bundle significantly
 */

"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const DispatchTimeline = dynamic(
	() =>
		import("./dispatch-timeline").then((mod) => ({
			default: mod.DispatchTimeline,
		})),
	{
		loading: () => (
			<div className="flex h-full w-full flex-col gap-4 p-4">
				<div className="flex gap-2">
					<Skeleton className="h-10 w-32" />
					<Skeleton className="h-10 w-32" />
					<Skeleton className="h-10 flex-1" />
				</div>
				<Skeleton className="h-full w-full" />
			</div>
		),
		ssr: false, // Complex timeline requires browser environment
	},
);

export function DispatchTimelineLazy() {
	return <DispatchTimeline />;
}
