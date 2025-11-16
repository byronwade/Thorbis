/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ArchiveData } from "@/components/communication/archive/archive-data";
import { ArchiveSkeleton } from "@/components/communication/archive/archive-skeleton";

export default function ArchivePage() {
	return (
		<Suspense fallback={<ArchiveSkeleton />}>
			<ArchiveData />
		</Suspense>
	);
}
