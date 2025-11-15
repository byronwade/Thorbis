import { getRoles } from "@/actions/team";
import RolesPageClient from "./roles-client";

export const revalidate = 3600;

export default async function RolesPage() {
  const result = await getRoles();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load roles");
  }

  return <RolesPageClient roles={result.data ?? []} />;
}
