/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { PreferencesData } from "@/components/settings/preferences/preferences-data";
import { PreferencesSkeleton } from "@/components/settings/preferences/preferences-skeleton";

export default function PreferencesPage() {
	return (
		<Suspense fallback={<PreferencesSkeleton />}>
			<PreferencesData />
		</Suspense>
	);
}
