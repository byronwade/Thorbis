-- ============================================================================
-- ADD ADDRESS FIELDS TO COMPANIES TABLE
-- ============================================================================
-- Migration: 20251111000001_add_address_fields_to_companies
-- Description: Adds city, state, zip_code, lat, and lon columns to companies
--              table for proper address storage and geocoding
-- Date: 2025-11-11
-- ============================================================================

-- Add city, state, and zip_code columns to companies table
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Add latitude and longitude columns for geocoding (if not already present)
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS lat DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS lon DECIMAL(11, 8);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_city ON companies(city) WHERE city IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_companies_state ON companies(state) WHERE state IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_companies_zip_code ON companies(zip_code) WHERE zip_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_companies_location ON companies(lat, lon) WHERE lat IS NOT NULL AND lon IS NOT NULL;

-- Add comments
COMMENT ON COLUMN companies.city IS 'City where the company is located';
COMMENT ON COLUMN companies.state IS 'State where the company is located';
COMMENT ON COLUMN companies.zip_code IS 'ZIP/postal code where the company is located';
COMMENT ON COLUMN companies.lat IS 'Latitude coordinate for geocoding';
COMMENT ON COLUMN companies.lon IS 'Longitude coordinate for geocoding';

