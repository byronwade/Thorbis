import { getDepartments, getRoles } from "@/actions/team";
import InviteMembersClient from "./invite-client";

export default async function InviteMemberPage() {
  const [rolesResult, departmentsResult] = await Promise.all([
    getRoles(),
    getDepartments(),
  ]);

  if (!rolesResult.success) {
    throw new Error(rolesResult.error ?? "Failed to load roles");
  }

  if (!departmentsResult.success) {
    throw new Error(departmentsResult.error ?? "Failed to load departments");
  }

  return (
    <InviteMembersClient
      departments={departmentsResult.data ?? []}
      roles={rolesResult.data ?? []}
    />
  );
}
