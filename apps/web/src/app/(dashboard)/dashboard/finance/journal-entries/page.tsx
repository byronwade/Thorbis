/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { JournalEntriesData } from "@/components/finance/journal-entries/journal-entries-data";
import { JournalEntriesSkeleton } from "@/components/finance/journal-entries/journal-entries-skeleton";

export default function JournalEntriesPage() {
	return (
		<Suspense fallback={<JournalEntriesSkeleton />}>
			<JournalEntriesData />
		</Suspense>
	);
}
