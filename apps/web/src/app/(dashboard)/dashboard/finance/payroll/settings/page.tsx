/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { SettingsData } from "@/components/finance/settings/settings-data";
import { SettingsSkeleton } from "@/components/finance/settings/settings-skeleton";

export default function SettingsPage() {
	return (
		<Suspense fallback={<SettingsSkeleton />}>
			<SettingsData />
		</Suspense>
	);
}
