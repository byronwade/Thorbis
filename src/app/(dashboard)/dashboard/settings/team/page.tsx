import {
  getDepartments,
  getRoles,
  getTeamMembers,
  getTeamOverview,
  type TeamMemberWithDetails,
} from "@/actions/team";
import TeamSettingsClient from "./team-settings-client";

export const revalidate = 3600;

export default async function TeamSettingsPage() {
  const [membersResult, rolesResult, departmentsResult, overviewResult] =
    await Promise.all([
      getTeamMembers(),
      getRoles(),
      getDepartments(),
      getTeamOverview(),
    ]);

  if (!membersResult.success) {
    throw new Error(membersResult.error ?? "Failed to load team members");
  }

  if (!rolesResult.success) {
    throw new Error(rolesResult.error ?? "Failed to load roles");
  }

  if (!departmentsResult.success) {
    throw new Error(departmentsResult.error ?? "Failed to load departments");
  }

  if (!(overviewResult.success && overviewResult.data)) {
    throw new Error(overviewResult.error ?? "Failed to load team overview");
  }

  const members = (membersResult.data ?? []) as TeamMemberWithDetails[];

  return (
    <TeamSettingsClient
      departments={departmentsResult.data ?? []}
      members={members}
      overview={overviewResult.data}
      roles={rolesResult.data ?? []}
    />
  );
}
