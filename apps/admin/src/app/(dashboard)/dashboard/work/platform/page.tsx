import { Suspense } from "react";
import { getMaintenanceMode } from "@/actions/platform";
import { PlatformSettings } from "@/components/work/platform-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Platform Settings Page
 *
 * Manage platform settings including maintenance mode and feature flags.
 */
async function PlatformSettingsData() {
	const result = await getMaintenanceMode();

	if (result.error) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{result.error || "Failed to load platform settings"}
				</p>
			</div>
		);
	}

	return (
		<PlatformSettings
			maintenanceMode={result.enabled ? { enabled: true, message: result.message || "" } : { enabled: false, message: "" }}
		/>
	);
}

export default function PlatformSettingsPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
				<p className="text-muted-foreground text-sm">
					Manage platform settings, feature flags, and maintenance mode
				</p>
			</div>
			<Suspense fallback={<PlatformSettingsSkeleton />}>
				<PlatformSettingsData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton for platform settings
 */
function PlatformSettingsSkeleton() {
	return (
		<div className="space-y-6">
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-6 w-48 mb-4" />
					<Skeleton className="h-24 w-full" />
				</CardContent>
			</Card>
		</div>
	);
}

