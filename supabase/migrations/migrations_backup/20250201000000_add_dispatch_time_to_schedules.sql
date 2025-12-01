-- Add dispatch_time field to schedules table for tracking when appointments are dispatched
ALTER TABLE schedules 
ADD COLUMN IF NOT EXISTS dispatch_time TIMESTAMPTZ;

-- Add comment
COMMENT ON COLUMN schedules.dispatch_time IS 'Timestamp when the appointment was dispatched/assigned to technician';

-- Create index for dispatch_time queries
CREATE INDEX IF NOT EXISTS idx_schedules_dispatch_time ON schedules(dispatch_time) WHERE dispatch_time IS NOT NULL;

