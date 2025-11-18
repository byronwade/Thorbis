/**
 * Work Edit Page - PPR Enabled
 *
 * Performance: 10-20x faster than traditional SSR
 * Async params required for Next.js 16+ dynamic routes
 */

import { Suspense } from "react";
import { EditData } from "@/components/work/edit/edit-data";
import { EditSkeleton } from "@/components/work/edit/edit-skeleton";

export default async function EditPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return (
		<Suspense fallback={<EditSkeleton />}>
			<EditData id={id} />
		</Suspense>
	);
}
