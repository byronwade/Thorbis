-- Ensure inbound routes are properly configured for @biezru.resend.app domain
-- This migration ensures all routes are enabled and accessible for the webhook handler

-- Verify routes exist for the company (2b88a305-0ecd-4bff-9898-b166cc7937c4)
-- If routes don't exist, create them

DO $$
DECLARE
    company_uuid UUID := '2b88a305-0ecd-4bff-9898-b166cc7937c4';
    route_addresses TEXT[] := ARRAY[
        '@biezru.resend.app',
        'support@biezru.resend.app',
        'sales@biezru.resend.app',
        'contact@biezru.resend.app',
        'test@biezru.resend.app'
    ];
    route_name TEXT;
    current_route_address TEXT;
    route_id UUID;
BEGIN
    FOREACH current_route_address IN ARRAY route_addresses
    LOOP
        -- Set route name based on address
        IF current_route_address = '@biezru.resend.app' THEN
            route_name := 'Catch-all for @biezru.resend.app';
        ELSIF current_route_address = 'support@biezru.resend.app' THEN
            route_name := 'Support Email';
        ELSIF current_route_address = 'sales@biezru.resend.app' THEN
            route_name := 'Sales Email';
        ELSIF current_route_address = 'contact@biezru.resend.app' THEN
            route_name := 'Contact Email';
        ELSIF current_route_address = 'test@biezru.resend.app' THEN
            route_name := 'Test Email';
        ELSE
            route_name := 'Route for ' || current_route_address;
        END IF;

        -- Check if route already exists
        SELECT id INTO route_id
        FROM communication_email_inbound_routes
        WHERE route_address = current_route_address
          AND company_id = company_uuid;

        -- If route doesn't exist, create it
        IF route_id IS NULL THEN
            INSERT INTO communication_email_inbound_routes (
                company_id,
                route_address,
                name,
                enabled,
                created_at,
                updated_at
            ) VALUES (
                company_uuid,
                current_route_address,
                route_name,
                true,
                NOW(),
                NOW()
            )
            ON CONFLICT (route_address) DO UPDATE
            SET 
                company_id = EXCLUDED.company_id,
                enabled = true,
                updated_at = NOW();
            
            RAISE NOTICE 'Created route: % for company %', current_route_address, company_uuid;
        ELSE
            -- Ensure route is enabled
            UPDATE communication_email_inbound_routes
            SET 
                enabled = true,
                updated_at = NOW()
            WHERE id = route_id;
            
            RAISE NOTICE 'Route already exists and is enabled: %', current_route_address;
        END IF;
    END LOOP;
END $$;

-- Create index to optimize route lookups (if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_inbound_routes_lookup 
ON communication_email_inbound_routes(route_address, enabled)
WHERE enabled = true;

-- Verify all routes are enabled and accessible
DO $$
DECLARE
    route_count INTEGER;
    enabled_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO route_count
    FROM communication_email_inbound_routes
    WHERE company_id = '2b88a305-0ecd-4bff-9898-b166cc7937c4'
      AND route_address LIKE '%biezru.resend.app%';

    SELECT COUNT(*) INTO enabled_count
    FROM communication_email_inbound_routes
    WHERE company_id = '2b88a305-0ecd-4bff-9898-b166cc7937c4'
      AND route_address LIKE '%biezru.resend.app%'
      AND enabled = true;

    RAISE NOTICE 'Total routes for @biezru.resend.app: %', route_count;
    RAISE NOTICE 'Enabled routes: %', enabled_count;
END $$;

