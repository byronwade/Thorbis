-- Add lat and lon columns to properties table for geocoding/enrichment
-- This allows properties to store coordinates so enrichment doesn't need to geocode every time
ALTER TABLE properties
ADD COLUMN lat DOUBLE PRECISION,
ADD COLUMN lon DOUBLE PRECISION;

-- Add index for geospatial queries
CREATE INDEX idx_properties_coordinates ON properties(lat, lon);

-- Add comment to columns
COMMENT ON COLUMN properties.lat IS 'Latitude coordinate for geocoding and property enrichment services';
COMMENT ON COLUMN properties.lon IS 'Longitude coordinate for geocoding and property enrichment services';

