-- Add fleet vehicle support to equipment table

DO $$
BEGIN
  CREATE TYPE equipment_classification AS ENUM ('equipment', 'tool', 'vehicle');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE equipment
  ADD COLUMN IF NOT EXISTS classification equipment_classification NOT NULL DEFAULT 'equipment',
  ADD COLUMN IF NOT EXISTS asset_category TEXT,
  ADD COLUMN IF NOT EXISTS asset_subcategory TEXT,
  ADD COLUMN IF NOT EXISTS vehicle_make TEXT,
  ADD COLUMN IF NOT EXISTS vehicle_model TEXT,
  ADD COLUMN IF NOT EXISTS vehicle_year INTEGER CHECK (vehicle_year BETWEEN 1900 AND 2100),
  ADD COLUMN IF NOT EXISTS vehicle_vin TEXT,
  ADD COLUMN IF NOT EXISTS vehicle_license_plate TEXT,
  ADD COLUMN IF NOT EXISTS vehicle_fuel_type TEXT,
  ADD COLUMN IF NOT EXISTS vehicle_odometer INTEGER CHECK (vehicle_odometer >= 0),
  ADD COLUMN IF NOT EXISTS vehicle_last_service_mileage INTEGER CHECK (vehicle_last_service_mileage >= 0),
  ADD COLUMN IF NOT EXISTS vehicle_next_service_mileage INTEGER CHECK (vehicle_next_service_mileage >= 0),
  ADD COLUMN IF NOT EXISTS vehicle_registration_expiration DATE,
  ADD COLUMN IF NOT EXISTS vehicle_inspection_due DATE,
  ADD COLUMN IF NOT EXISTS tool_serial TEXT,
  ADD COLUMN IF NOT EXISTS tool_calibration_due DATE;

UPDATE equipment
SET classification = 'equipment'
WHERE classification IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_equipment_vehicle_vin
  ON equipment (vehicle_vin)
  WHERE vehicle_vin IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_equipment_vehicle_license_plate
  ON equipment (vehicle_license_plate)
  WHERE vehicle_license_plate IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_equipment_classification
  ON equipment (classification);

CREATE OR REPLACE FUNCTION equipment_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.manufacturer, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.model, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.serial_number, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.equipment_number, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.vehicle_make, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.vehicle_model, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.vehicle_vin, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.vehicle_license_plate, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.type::text, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.classification::text, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.notes, '')), 'D');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

