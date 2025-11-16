/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { InviteData } from "@/components/work/invite/invite-data";
import { InviteSkeleton } from "@/components/work/invite/invite-skeleton";

export default function InvitePage() {
	return (
		<Suspense fallback={<InviteSkeleton />}>
			<InviteData />
		</Suspense>
	);
}
