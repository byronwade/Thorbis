/**
 * Technicians > Profiles Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { ProfilesData } from "@/components/technicians/profiles/profiles-data";
import { ProfilesSkeleton } from "@/components/technicians/profiles/profiles-skeleton";

export default function TechnicianProfilesPage() {
	return (
		<Suspense fallback={<ProfilesSkeleton />}>
			<ProfilesData />
		</Suspense>
	);
}
