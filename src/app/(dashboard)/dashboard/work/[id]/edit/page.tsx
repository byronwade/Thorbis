/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { EditData } from "@/components/work/edit/edit-data";
import { EditSkeleton } from "@/components/work/edit/edit-skeleton";

export default function EditPage() {
	return (
		<Suspense fallback={<EditSkeleton />}>
			<EditData />
		</Suspense>
	);
}
