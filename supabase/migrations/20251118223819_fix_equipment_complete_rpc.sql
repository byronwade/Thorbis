-- Fix get_equipment_complete RPC function
-- Previous version had incorrect column names (equipment_type instead of type)
-- and was missing many equipment fields
-- This version uses JSONB concatenation to avoid 100-argument limit

CREATE OR REPLACE FUNCTION public.get_equipment_complete(p_equipment_id UUID, p_company_id UUID)
RETURNS TABLE (
  equipment_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Build base object
    jsonb_build_object(
      'id', e.id,
      'company_id', e.company_id,
      'customer_id', e.customer_id,
      'property_id', e.property_id,
      'equipment_number', e.equipment_number,
      'name', e.name,
      'type', e.type,
      'category', e.category,
      'classification', e.classification,
      'asset_category', e.asset_category,
      'asset_subcategory', e.asset_subcategory,
      'manufacturer', e.manufacturer,
      'model', e.model,
      'serial_number', e.serial_number,
      'model_year', e.model_year,
      'capacity', e.capacity,
      'efficiency', e.efficiency,
      'fuel_type', e.fuel_type,
      'location', e.location,
      'condition', e.condition,
      'status', e.status,
      'notes', e.notes,
      'customer_notes', e.customer_notes,
      'metadata', e.metadata,
      'photos', e.photos,
      'documents', e.documents,
      'created_at', e.created_at,
      'updated_at', e.updated_at,
      'archived_at', e.archived_at,
      'deleted_at', e.deleted_at,
      'deleted_by', e.deleted_by
    ) ||
    -- Installation info
    jsonb_build_object(
      'install_date', e.install_date,
      'installed_by', e.installed_by,
      'install_job_id', e.install_job_id
    ) ||
    -- Warranty info
    jsonb_build_object(
      'warranty_expiration', e.warranty_expiration,
      'warranty_provider', e.warranty_provider,
      'warranty_notes', e.warranty_notes,
      'is_under_warranty', e.is_under_warranty
    ) ||
    -- Service tracking
    jsonb_build_object(
      'last_service_date', e.last_service_date,
      'last_service_job_id', e.last_service_job_id,
      'next_service_due', e.next_service_due,
      'service_interval_days', e.service_interval_days,
      'service_plan_id', e.service_plan_id,
      'maintenance_plan_id', e.service_plan_id,
      'total_service_count', e.total_service_count,
      'total_service_cost', e.total_service_cost,
      'average_service_cost', e.average_service_cost
    ) ||
    -- Replacement tracking
    jsonb_build_object(
      'replaced_date', e.replaced_date,
      'replaced_by_equipment_id', e.replaced_by_equipment_id
    ) ||
    -- Vehicle-specific fields
    jsonb_build_object(
      'vehicle_make', e.vehicle_make,
      'vehicle_model', e.vehicle_model,
      'vehicle_year', e.vehicle_year,
      'vehicle_vin', e.vehicle_vin,
      'vehicle_license_plate', e.vehicle_license_plate,
      'vehicle_fuel_type', e.vehicle_fuel_type,
      'vehicle_odometer', e.vehicle_odometer,
      'vehicle_last_service_mileage', e.vehicle_last_service_mileage,
      'vehicle_next_service_mileage', e.vehicle_next_service_mileage,
      'vehicle_registration_expiration', e.vehicle_registration_expiration,
      'vehicle_inspection_due', e.vehicle_inspection_due
    ) ||
    -- Tool-specific fields
    jsonb_build_object(
      'tool_serial', e.tool_serial,
      'tool_calibration_due', e.tool_calibration_due
    ) ||
    -- Tags from junction table
    jsonb_build_object(
      'equipment_tags', equipment_tags_lateral.equipment_tags_data
    ) AS equipment_data
  FROM public.equipment e

  -- Equipment Tags with nested tag data
  LEFT JOIN LATERAL (
    SELECT json_agg(
      json_build_object(
        'id', t.id,
        'name', t.name,
        'slug', t.slug,
        'color', t.color,
        'category', t.category,
        'icon', t.icon,
        'added_at', et.added_at
      ) ORDER BY et.added_at DESC
    ) AS equipment_tags_data
    FROM public.equipment_tags et
    LEFT JOIN public.tags t ON et.tag_id = t.id
    WHERE et.equipment_id = e.id
  ) equipment_tags_lateral ON TRUE

  WHERE e.id = p_equipment_id
    AND e.company_id = p_company_id
    AND e.deleted_at IS NULL;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_equipment_complete(UUID, UUID) TO authenticated;

COMMENT ON FUNCTION public.get_equipment_complete IS 'Fetches complete equipment data including all fields and tags from equipment_tags junction table';
