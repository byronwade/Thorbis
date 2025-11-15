import type { Database } from "@/types/supabase";

export type ServiceAreaRecord =
  Database["public"]["Tables"]["schedule_service_areas"]["Row"];

export type ServiceAreaForm = {
  id: string;
  areaName: string;
  areaType: "zip_code" | "radius" | "polygon" | "city" | "state";
  zipCodes: string;
  radiusMiles: number | null;
  serviceFee: number;
  minimumJobAmount: number | null;
  estimatedTravelTimeMinutes: number | null;
  centerLat: number | null;
  centerLng: number | null;
  polygonCoordinates: string;
  isActive: boolean;
};

export function mapServiceAreaRows(
  rows: ServiceAreaRecord[]
): ServiceAreaForm[] {
  if (!rows?.length) {
    return [];
  }

  return rows.map((row) => ({
    id: row.id,
    areaName: row.area_name ?? "",
    areaType: (row.area_type as ServiceAreaForm["areaType"]) ?? "zip_code",
    zipCodes: Array.isArray(row.zip_codes) ? row.zip_codes.join(", ") : "",
    radiusMiles: row.radius_miles ?? null,
    serviceFee: row.service_fee ?? 0,
    minimumJobAmount: row.minimum_job_amount ?? null,
    estimatedTravelTimeMinutes: row.estimated_travel_time_minutes ?? null,
    centerLat: row.center_lat ?? null,
    centerLng: row.center_lng ?? null,
    polygonCoordinates: row.polygon_coordinates
      ? JSON.stringify(row.polygon_coordinates)
      : "",
    isActive: row.is_active ?? true,
  }));
}

export function buildServiceAreaFormData(area: ServiceAreaForm): FormData {
  const formData = new FormData();
  formData.append("areaName", area.areaName);
  formData.append("areaType", area.areaType);
  if (area.zipCodes) {
    formData.append("zipCodes", area.zipCodes);
  }
  if (area.radiusMiles !== null) {
    formData.append("radiusMiles", area.radiusMiles.toString());
  }
  if (area.centerLat !== null) {
    formData.append("centerLat", area.centerLat.toString());
  }
  if (area.centerLng !== null) {
    formData.append("centerLng", area.centerLng.toString());
  }
  if (area.polygonCoordinates) {
    formData.append("polygonCoordinates", area.polygonCoordinates);
  }
  formData.append("serviceFee", area.serviceFee.toString());
  if (area.minimumJobAmount !== null) {
    formData.append("minimumJobAmount", area.minimumJobAmount.toString());
  }
  if (area.estimatedTravelTimeMinutes !== null) {
    formData.append(
      "estimatedTravelTimeMinutes",
      area.estimatedTravelTimeMinutes.toString()
    );
  }
  formData.append("isActive", area.isActive.toString());
  return formData;
}
