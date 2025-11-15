import { getDepartments } from "@/actions/team";
import { DepartmentsClient } from "./departments-client";

export default async function DepartmentsPage() {
  const result = await getDepartments();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load departments");
  }

  const departments = result.data ?? [];

  return <DepartmentsClient initialDepartments={departments} />;
}
