/**
 * Settings > Customers Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Settings cards/content stream in (100-200ms)
 */

import { Suspense } from "react";
import { CustomersSettingsData } from "@/components/settings/customers/customers-settings-data";
import { CustomersSettingsShell } from "@/components/settings/customers/customers-settings-shell";
import { CustomersSettingsSkeleton } from "@/components/settings/customers/customers-settings-skeleton";

export default function CustomersSettingsPage() {
	return (
		<CustomersSettingsShell>
			<Suspense fallback={<CustomersSettingsSkeleton />}>
				<CustomersSettingsData />
			</Suspense>
		</CustomersSettingsShell>
	);
}
