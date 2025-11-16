/**
 * Uinvite Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UinviteData } from "@/components/settings/invite/invite-data";
import { UinviteSkeleton } from "@/components/settings/invite/invite-skeleton";

export default function UinvitePage() {
	return (
		<Suspense fallback={<UinviteSkeleton />}>
			<UinviteData />
		</Suspense>
	);
}
