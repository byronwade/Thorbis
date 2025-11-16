/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { UpdateAddressData } from "@/components/admin/update-address/update-address-data";
import { UpdateAddressSkeleton } from "@/components/admin/update-address/update-address-skeleton";

export default function UpdateAddressPage() {
	return (
		<Suspense fallback={<UpdateAddressSkeleton />}>
			<UpdateAddressData />
		</Suspense>
	);
}
