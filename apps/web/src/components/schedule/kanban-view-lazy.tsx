/**
 * KanbanView - Lazy Loaded Wrapper
 *
 * Performance optimization:
 * - Dynamically imports the full kanban view component (~15KB)
 * - Only loads when user switches to "Week" view mode
 * - Shows skeleton loading state while importing
 * - Reduces initial schedule page bundle
 */

"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const KanbanView = dynamic(
	() => import("./kanban-view").then((mod) => ({ default: mod.KanbanView })),
	{
		loading: () => (
			<div className="flex h-full w-full gap-4 p-4">
				{Array.from({ length: 7 }).map((_, i) => (
					<div key={i} className="flex flex-1 flex-col gap-2">
						<Skeleton className="h-8 w-full" />
						<Skeleton className="h-32 w-full" />
						<Skeleton className="h-32 w-full" />
					</div>
				))}
			</div>
		),
		ssr: false, // Kanban DnD requires browser environment
	},
);

export function KanbanViewLazy() {
	return <KanbanView />;
}
