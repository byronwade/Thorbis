-- ============================================================================
-- Job Equipment & Materials Tracking
-- Created: 2025-02-07
-- Description: Links jobs to customer equipment serviced and materials used
-- ============================================================================

-- Job Equipment Junction Table
-- Links jobs to equipment that was serviced/installed/inspected
CREATE TABLE IF NOT EXISTS job_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  
  -- Service details
  service_type TEXT NOT NULL DEFAULT 'maintenance', -- 'installation' | 'repair' | 'maintenance' | 'inspection' | 'replacement'
  work_performed TEXT, -- What was done to this equipment
  
  -- Parts & Materials used on this equipment
  parts_cost INTEGER DEFAULT 0, -- In cents
  labor_cost INTEGER DEFAULT 0, -- In cents
  
  -- Condition assessment
  condition_before TEXT, -- 'excellent' | 'good' | 'fair' | 'poor' | 'failed'
  condition_after TEXT,
  
  -- Service notes
  technician_notes TEXT,
  customer_notes TEXT,
  
  -- Recommendations
  recommendations TEXT[], -- Array of recommendations
  follow_up_needed BOOLEAN DEFAULT FALSE,
  follow_up_date TIMESTAMPTZ,
  
  -- Photos
  before_photos JSONB, -- Array of photo URLs
  after_photos JSONB, -- Array of photo URLs
  
  -- Warranty
  warranty_work BOOLEAN DEFAULT FALSE,
  warranty_claim_number TEXT,
  
  -- Timestamps
  serviced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Indexes for performance
  CONSTRAINT unique_job_equipment UNIQUE(job_id, equipment_id)
);

CREATE INDEX idx_job_equipment_job_id ON job_equipment(job_id);
CREATE INDEX idx_job_equipment_equipment_id ON job_equipment(equipment_id);
CREATE INDEX idx_job_equipment_company_id ON job_equipment(company_id);
CREATE INDEX idx_job_equipment_service_type ON job_equipment(service_type);

-- Add RLS policies
ALTER TABLE job_equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view job equipment for their company"
  ON job_equipment FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert job equipment for their company"
  ON job_equipment FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update job equipment for their company"
  ON job_equipment FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete job equipment for their company"
  ON job_equipment FOR DELETE
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- Job Materials Table
-- Tracks materials/parts used on a job (pulled from inventory or purchased)
-- ============================================================================

CREATE TABLE IF NOT EXISTS job_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  
  -- Link to equipment if material was used on specific equipment
  job_equipment_id UUID REFERENCES job_equipment(id) ON DELETE SET NULL,
  
  -- Link to pricebook/inventory item (if exists)
  price_book_item_id UUID REFERENCES price_book_items(id) ON DELETE RESTRICT,
  inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
  
  -- Material details (if not in pricebook)
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  
  -- Quantity and units
  quantity DECIMAL(10,3) NOT NULL DEFAULT 1,
  unit_of_measure TEXT DEFAULT 'each', -- 'each' | 'ft' | 'lb' | 'gal' | 'box' | etc
  
  -- Pricing
  unit_cost INTEGER DEFAULT 0, -- In cents - cost to company
  unit_price INTEGER DEFAULT 0, -- In cents - price to customer
  total_cost INTEGER GENERATED ALWAYS AS (CAST(quantity * unit_cost AS INTEGER)) STORED,
  total_price INTEGER GENERATED ALWAYS AS (CAST(quantity * unit_price AS INTEGER)) STORED,
  markup_percentage DECIMAL(5,2), -- Markup %
  
  -- Source
  source TEXT DEFAULT 'inventory', -- 'inventory' | 'purchased' | 'customer_supplied'
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
  
  -- Billing
  billable BOOLEAN DEFAULT TRUE,
  billed BOOLEAN DEFAULT FALSE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  
  -- Technician who used it
  used_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_job_materials_job_id ON job_materials(job_id);
CREATE INDEX idx_job_materials_job_equipment_id ON job_materials(job_equipment_id);
CREATE INDEX idx_job_materials_company_id ON job_materials(company_id);
CREATE INDEX idx_job_materials_price_book_item_id ON job_materials(price_book_item_id);
CREATE INDEX idx_job_materials_invoice_id ON job_materials(invoice_id);

-- Add RLS policies
ALTER TABLE job_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view job materials for their company"
  ON job_materials FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert job materials for their company"
  ON job_materials FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update job materials for their company"
  ON job_materials FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete job materials for their company"
  ON job_materials FOR DELETE
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- Update equipment table to track service history better
-- ============================================================================

-- Add trigger to update equipment's last service date when job_equipment is added
CREATE OR REPLACE FUNCTION update_equipment_last_service()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE equipment
  SET 
    last_service_date = NEW.serviced_at,
    last_service_job_id = NEW.job_id,
    updated_at = NOW()
  WHERE id = NEW.equipment_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_equipment_last_service
  AFTER INSERT ON job_equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_equipment_last_service();

-- ============================================================================
-- Views for easier querying
-- ============================================================================

-- View: Equipment with latest service info
CREATE OR REPLACE VIEW equipment_with_service_info AS
SELECT 
  e.*,
  je.service_type as last_service_type,
  je.work_performed as last_work_performed,
  je.condition_after as current_condition,
  je.recommendations as last_recommendations,
  je.follow_up_needed,
  je.follow_up_date,
  COUNT(DISTINCT je2.id) as total_service_count
FROM equipment e
LEFT JOIN job_equipment je ON e.last_service_job_id = je.job_id AND e.id = je.equipment_id
LEFT JOIN job_equipment je2 ON e.id = je2.equipment_id
GROUP BY e.id, je.service_type, je.work_performed, je.condition_after, je.recommendations, je.follow_up_needed, je.follow_up_date;

-- View: Job costing summary
CREATE OR REPLACE VIEW job_costing_summary AS
SELECT 
  j.id as job_id,
  j.company_id,
  -- Labor costs (from time entries)
  COALESCE(SUM(EXTRACT(EPOCH FROM (te.end_time - te.start_time)) / 3600 * COALESCE(u.hourly_rate, 0)), 0) as labor_cost,
  -- Materials costs
  COALESCE(SUM(jm.total_cost), 0) as materials_cost,
  -- Total cost
  COALESCE(SUM(EXTRACT(EPOCH FROM (te.end_time - te.start_time)) / 3600 * COALESCE(u.hourly_rate, 0)), 0) + 
  COALESCE(SUM(jm.total_cost), 0) as total_cost,
  -- Revenue
  COALESCE((SELECT SUM(total) FROM invoices WHERE job_id = j.id), 0) as total_revenue,
  -- Profit
  COALESCE((SELECT SUM(total) FROM invoices WHERE job_id = j.id), 0) - 
  (COALESCE(SUM(EXTRACT(EPOCH FROM (te.end_time - te.start_time)) / 3600 * COALESCE(u.hourly_rate, 0)), 0) + 
   COALESCE(SUM(jm.total_cost), 0)) as profit,
  -- Material count
  COUNT(DISTINCT jm.id) as material_count,
  -- Labor hours
  COALESCE(SUM(EXTRACT(EPOCH FROM (te.end_time - te.start_time)) / 3600), 0) as total_hours
FROM jobs j
LEFT JOIN time_entries te ON j.id = te.job_id
LEFT JOIN users u ON te.user_id = u.id
LEFT JOIN job_materials jm ON j.id = jm.job_id
GROUP BY j.id, j.company_id;

COMMENT ON TABLE job_equipment IS 'Junction table linking jobs to customer equipment that was serviced/installed/inspected';
COMMENT ON TABLE job_materials IS 'Materials and parts used on jobs with cost tracking';
COMMENT ON VIEW equipment_with_service_info IS 'Equipment enriched with latest service information';
COMMENT ON VIEW job_costing_summary IS 'Real-time job costing including labor and materials';

