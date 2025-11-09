-- Make property_id nullable in jobs table
-- Properties are linked to customers, so when a customer is removed, the property should also be removed
ALTER TABLE jobs
ALTER COLUMN property_id DROP NOT NULL;

