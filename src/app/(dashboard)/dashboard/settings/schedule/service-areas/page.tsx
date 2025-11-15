import { getServiceAreas } from "@/actions/settings";
import ServiceAreasClient from "./service-areas-client";

export default async function ServiceAreasSettingsPage() {
  const result = await getServiceAreas();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load service areas");
  }

  return <ServiceAreasClient initialAreas={result.data ?? []} />;
}
