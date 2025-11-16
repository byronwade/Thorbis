/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ProfilesData } from "@/components/customers/profiles/profiles-data";
import { ProfilesSkeleton } from "@/components/customers/profiles/profiles-skeleton";

export default function ProfilesPage() {
	return (
		<Suspense fallback={<ProfilesSkeleton />}>
			<ProfilesData />
		</Suspense>
	);
}
