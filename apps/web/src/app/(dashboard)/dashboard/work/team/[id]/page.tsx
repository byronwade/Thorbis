/**
 * Work Team Member Detail Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Team member data streams in (100-400ms)
 *
 * This mirrors the root team member detail page but lives under
 * `/dashboard/work/team/[id]` so links from the Work > Team table
 * resolve correctly and use the work section detail layout.
 */

import { Suspense } from "react";
import { TeamMemberDetailData } from "@/components/team/team-member-detail-data";
import { TeamMemberDetailShell } from "@/components/team/team-member-detail-shell";
import { TeamMemberDetailSkeleton } from "@/components/team/team-member-detail-skeleton";

export default async function WorkTeamMemberDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: teamMemberId } = await params;

	return (
		<TeamMemberDetailShell>
			<Suspense fallback={<TeamMemberDetailSkeleton />}>
				<TeamMemberDetailData teamMemberId={teamMemberId} />
			</Suspense>
		</TeamMemberDetailShell>
	);
}
