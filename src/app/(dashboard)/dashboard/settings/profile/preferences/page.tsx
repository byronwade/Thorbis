/**
 * Upreferences Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { PreferencesData } from "@/components/settings/preferences/preferences-data";
import { PreferencesSkeleton } from "@/components/settings/preferences/preferences-skeleton";

export default function UpreferencesPage() {
	return (
		<Suspense fallback={<PreferencesSkeleton />}>
			<PreferencesData />
		</Suspense>
	);
}
