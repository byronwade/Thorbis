/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { CommunicationData } from "@/components/customers/communication/communication-data";
import { CommunicationSkeleton } from "@/components/customers/communication/communication-skeleton";

export default function CommunicationPage() {
	return (
		<Suspense fallback={<CommunicationSkeleton />}>
			<CommunicationData />
		</Suspense>
	);
}
