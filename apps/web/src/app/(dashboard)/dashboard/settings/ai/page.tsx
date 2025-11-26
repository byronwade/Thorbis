/**
 * AI Settings Page
 * Configure AI agent permissions, capabilities, and behavior
 */

import { Suspense } from "react";
import { AISettingsData } from "@/components/settings/ai/ai-settings-data";
import { AISettingsSkeleton } from "@/components/settings/ai/ai-settings-skeleton";

export default function AISettingsPage() {
	return (
		<Suspense fallback={<AISettingsSkeleton />}>
			<AISettingsData />
		</Suspense>
	);
}
