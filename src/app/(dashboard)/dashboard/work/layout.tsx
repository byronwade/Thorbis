import { Suspense, type ReactNode } from "react";
import { WorkSectionLayout } from "@/components/layout/work-section-layout";

/**
 * Work Section Layout - Server Component Wrapper
 *
 * This layout applies to all routes under /dashboard/work/*
 * It delegates to WorkSectionLayout which conditionally applies
 * the work layout only to list pages, not detail pages.
 *
 * Detail pages (like /dashboard/work/[id]) have their own nested layouts.
 *
 * IMPORTANT: Wraps children in Suspense to prevent React boundary errors
 * when passing async Server Components through Client Component boundaries.
 */
export default function WorkLayout({ children }: { children: ReactNode }) {
	return (
		<WorkSectionLayout>
			<Suspense fallback={<div className="p-4">Loading...</div>}>
				{children}
			</Suspense>
		</WorkSectionLayout>
	);
}
