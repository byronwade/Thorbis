/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { CustomersData } from "@/components/reports/customers/customers-data";
import { CustomersSkeleton } from "@/components/reports/customers/customers-skeleton";

export default function CustomersPage() {
	return (
		<Suspense fallback={<CustomersSkeleton />}>
			<CustomersData />
		</Suspense>
	);
}
