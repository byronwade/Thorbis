-- Add archive support across all major entities
-- Soft delete pattern: archived_at timestamp indicates when item was archived

-- Team Members
ALTER TABLE team_members
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_team_members_archived_at ON team_members(archived_at);
COMMENT ON COLUMN team_members.archived_at IS 'Timestamp when team member was archived (soft delete)';

-- Customers
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_customers_archived_at ON customers(archived_at);
COMMENT ON COLUMN customers.archived_at IS 'Timestamp when customer was archived (soft delete)';

-- Jobs
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_jobs_archived_at ON jobs(archived_at);
COMMENT ON COLUMN jobs.archived_at IS 'Timestamp when job was archived (soft delete)';

-- Equipment
ALTER TABLE equipment
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_equipment_archived_at ON equipment(archived_at);
COMMENT ON COLUMN equipment.archived_at IS 'Timestamp when equipment was archived (soft delete)';

-- Invoices
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_invoices_archived_at ON invoices(archived_at);
COMMENT ON COLUMN invoices.archived_at IS 'Timestamp when invoice was archived (soft delete)';

-- Estimates
ALTER TABLE estimates
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_estimates_archived_at ON estimates(archived_at);
COMMENT ON COLUMN estimates.archived_at IS 'Timestamp when estimate was archived (soft delete)';

-- Contracts
ALTER TABLE contracts
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_contracts_archived_at ON contracts(archived_at);
COMMENT ON COLUMN contracts.archived_at IS 'Timestamp when contract was archived (soft delete)';

-- Purchase Orders
ALTER TABLE purchase_orders
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_purchase_orders_archived_at ON purchase_orders(archived_at);
COMMENT ON COLUMN purchase_orders.archived_at IS 'Timestamp when purchase order was archived (soft delete)';

-- Service Agreements
ALTER TABLE service_agreements
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_service_agreements_archived_at ON service_agreements(archived_at);
COMMENT ON COLUMN service_agreements.archived_at IS 'Timestamp when service agreement was archived (soft delete)';

-- Maintenance Plans
ALTER TABLE maintenance_plans
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_maintenance_plans_archived_at ON maintenance_plans(archived_at);
COMMENT ON COLUMN maintenance_plans.archived_at IS 'Timestamp when maintenance plan was archived (soft delete)';

-- Appointments
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_appointments_archived_at ON appointments(archived_at);
COMMENT ON COLUMN appointments.archived_at IS 'Timestamp when appointment was archived (soft delete)';

-- Add activity log types for archive/restore operations
DO $$
BEGIN
    -- Note: This assumes activity_logs.action_type uses text or varchar
    -- If it uses an enum, you'll need to add these values to the enum first
    -- Example: ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'team_member_archived';
END $$;

COMMENT ON TABLE team_members IS 'Team members with soft delete support via archived_at';
COMMENT ON TABLE customers IS 'Customers with soft delete support via archived_at';
COMMENT ON TABLE jobs IS 'Jobs with soft delete support via archived_at';
COMMENT ON TABLE equipment IS 'Equipment with soft delete support via archived_at';
COMMENT ON TABLE invoices IS 'Invoices with soft delete support via archived_at';
COMMENT ON TABLE estimates IS 'Estimates with soft delete support via archived_at';
COMMENT ON TABLE contracts IS 'Contracts with soft delete support via archived_at';
COMMENT ON TABLE purchase_orders IS 'Purchase orders with soft delete support via archived_at';
COMMENT ON TABLE service_agreements IS 'Service agreements with soft delete support via archived_at';
COMMENT ON TABLE maintenance_plans IS 'Maintenance plans with soft delete support via archived_at';
COMMENT ON TABLE appointments IS 'Appointments with soft delete support via archived_at';
