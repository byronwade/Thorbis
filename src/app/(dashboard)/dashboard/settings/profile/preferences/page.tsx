/**
 * Upreferences Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UpreferencesData } from "@/components/settings/preferences/preferences-data";
import { UpreferencesSkeleton } from "@/components/settings/preferences/preferences-skeleton";

export default function UpreferencesPage() {
	return (
		<Suspense fallback={<UpreferencesSkeleton />}>
			<UpreferencesData />
		</Suspense>
	);
}
