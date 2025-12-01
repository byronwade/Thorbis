-- ============================================================================
-- Migration: 20251118000001_fix_jobs_search_vector_trigger
-- Description: Update jobs search vector trigger to read ai_service_type from
--              job_ai_enrichment domain table instead of the removed jobs column.
-- Author: Codex (AI Assistant)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.jobs_search_vector_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_ai_service_type text;
BEGIN
  SELECT ai_service_type INTO v_ai_service_type
  FROM job_ai_enrichment
  WHERE job_id = NEW.id
  LIMIT 1;

  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.job_number, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.notes, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.job_type, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.status, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.priority, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(v_ai_service_type, '')), 'B');

  RETURN NEW;
END;
$function$;
