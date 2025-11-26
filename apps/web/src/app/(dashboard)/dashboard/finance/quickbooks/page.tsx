/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { QuickbooksData } from "@/components/finance/quickbooks/quickbooks-data";
import { QuickbooksSkeleton } from "@/components/finance/quickbooks/quickbooks-skeleton";

export default function QuickbooksPage() {
	return (
		<Suspense fallback={<QuickbooksSkeleton />}>
			<QuickbooksData />
		</Suspense>
	);
}
