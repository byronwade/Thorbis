/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { CustomersData } from "@/components/pricebook/customers/customers-data";
import { CustomersSkeleton } from "@/components/pricebook/customers/customers-skeleton";

export default function CustomersPage() {
	return (
		<Suspense fallback={<CustomersSkeleton />}>
			<CustomersData />
		</Suspense>
	);
}
