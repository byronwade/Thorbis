/**
 * Voicemail Settings Page
 *
 * Configure voicemail settings:
 * - Custom greeting (upload or text-to-speech)
 * - Notification preferences
 * - Voicemail box settings
 * - Transcription options
 */

import { Suspense } from "react";
import { AppToolbar } from "@/components/layout/app-toolbar";
import { VoicemailSettings } from "@/components/telephony/voicemail-settings";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
	title: "Voicemail Settings | Communications",
	subtitle: "Configure voicemail greetings, notifications, and settings",
};

export default function VoicemailSettingsPage() {
	return (
		<div className="flex h-full flex-col">
			{/* Page Header */}
			<AppToolbar config={{ show: true, title: "Voicemail Settings" }} />

			{/* Content */}
			<div className="flex-1 overflow-auto p-6">
				<Suspense fallback={<VoicemailSettingsSkeleton />}>
					<VoicemailSettings />
				</Suspense>
			</div>
		</div>
	);
}

function VoicemailSettingsSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-48 w-full" />
			<Skeleton className="h-32 w-full" />
			<Skeleton className="h-40 w-full" />
		</div>
	);
}
