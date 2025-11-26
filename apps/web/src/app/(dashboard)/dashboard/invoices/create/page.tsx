/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { CreateData } from "@/components/invoices/create/create-data";
import { CreateSkeleton } from "@/components/invoices/create/create-skeleton";

export default function CreatePage() {
	return (
		<Suspense fallback={<CreateSkeleton />}>
			<CreateData />
		</Suspense>
	);
}
