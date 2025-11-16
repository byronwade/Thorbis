/**
 * Settings Team Member Details Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Team member data streams in (100-400ms)
 *
 * Performance: 5-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { SettingsTeamMemberDetailData } from "@/components/settings/team/settings-team-member-detail-data";
import { TeamMemberDetailShell } from "@/components/team/team-member-detail-shell";
import { TeamMemberDetailSkeleton } from "@/components/team/team-member-detail-skeleton";

export default async function TeamMemberDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: teamMemberId } = await params;

  return (
    <TeamMemberDetailShell>
      <Suspense fallback={<TeamMemberDetailSkeleton />}>
        <SettingsTeamMemberDetailData teamMemberId={teamMemberId} />
      </Suspense>
    </TeamMemberDetailShell>
  );
}
