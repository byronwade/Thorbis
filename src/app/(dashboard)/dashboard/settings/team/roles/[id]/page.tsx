import { getRoleDetails } from "@/actions/team";
import RoleDetailClient from "./role-detail-client";

interface RoleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoleDetailPage({ params }: RoleDetailPageProps) {
  const { id } = await params;

  if (id === "new") {
    return (
      <RoleDetailClient
        initialRole={{
          name: "",
          description: "",
          color: "#3b82f6",
          permissions: [],
          isSystem: false,
        }}
        mode="create"
      />
    );
  }

  const result = await getRoleDetails(id);

  if (!(result.success && result.data)) {
    throw new Error(result.error ?? "Failed to load role");
  }

  return (
    <RoleDetailClient
      initialRole={{
        id: result.data.id,
        name: result.data.name,
        description: result.data.description ?? "",
        color: result.data.color ?? "#3b82f6",
        permissions: result.data.permissions,
        isSystem: result.data.is_system,
      }}
      mode="edit"
    />
  );
}
