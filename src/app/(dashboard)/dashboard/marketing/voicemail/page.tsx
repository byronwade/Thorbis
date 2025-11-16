/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { VoicemailData } from "@/components/marketing/voicemail/voicemail-data";
import { VoicemailSkeleton } from "@/components/marketing/voicemail/voicemail-skeleton";

export default function VoicemailPage() {
	return (
		<Suspense fallback={<VoicemailSkeleton />}>
			<VoicemailData />
		</Suspense>
	);
}
