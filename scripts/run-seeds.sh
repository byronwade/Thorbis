#!/bin/bash

# Database Seeding Script for Remote Supabase
# Usage: ./scripts/run-seeds.sh

set -e

echo "========================================"
echo "🌱 Thorbis Database Seeding"
echo "========================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found"
    exit 1
fi

# Load environment variables from .env.local
set -a
source <(grep -v '^#' .env.local | sed -e 's/\r$//' -e '/^$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/='\1'/g")
set +a

# Check for DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not found in .env.local"
    echo "Please add DATABASE_URL to your .env.local file"
    echo "Get it from: Supabase Dashboard > Project Settings > Database > Connection string > URI"
    exit 1
fi

echo "✅ Found database connection"
echo ""

# Create a combined seed file
echo "📦 Preparing seed files..."
TEMP_SEED="/tmp/thorbis_combined_seed.sql"

# Start with the main seed DO block (user/company setup)
cat supabase/seed.sql | sed -n '1,/^-- IMPORT ALL SEED FILES/p' > "$TEMP_SEED"

# Append all seed files
for seed_file in \
    supabase/seeds/02_price_book_categories.sql \
    supabase/seeds/03_price_book_items.sql \
    supabase/seeds/04_tags.sql \
    supabase/seeds/05_customers.sql \
    supabase/seeds/06_properties.sql \
    supabase/seeds/07_equipment.sql \
    supabase/seeds/08_service_plans.sql \
    supabase/seeds/09_jobs.sql \
    supabase/seeds/10_estimates.sql \
    supabase/seeds/11_invoices.sql \
    supabase/seeds/12_payments.sql \
    supabase/seeds/13_schedules.sql \
    supabase/seeds/14_communications.sql \
    supabase/seeds/15_inventory.sql; do
    if [ -f "$seed_file" ]; then
        echo "  📄 Adding $(basename $seed_file)"
        echo "" >> "$TEMP_SEED"
        echo "-- ============================================================================" >> "$TEMP_SEED"
        echo "-- $(basename $seed_file)" >> "$TEMP_SEED"
        echo "-- ============================================================================" >> "$TEMP_SEED"
        cat "$seed_file" >> "$TEMP_SEED"
    else
        echo "  ⚠️  Warning: $seed_file not found, skipping"
    fi
done

# Add completion message
cat >> "$TEMP_SEED" << 'EOF'

-- ============================================================================
-- COMPLETION
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Seed Complete! 🎉';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Your Thorbis database is ready to use';
  RAISE NOTICE 'Company: Thorbis HVAC & Plumbing Services';
  RAISE NOTICE '========================================';
END $$;
EOF

echo ""
echo "📡 Connecting to Supabase..."
echo ""

# Run the combined seed file
psql "$DATABASE_URL" -f "$TEMP_SEED"

# Clean up
rm "$TEMP_SEED"

echo ""
echo "=========================================="
echo "🎉 Seeding Complete!"
echo "=========================================="
echo "Your database has been seeded with:"
echo "  • Your company (Thorbis HVAC & Plumbing)"
echo "  • 20 customers"
echo "  • 40 jobs"
echo "  • 30 invoices"
echo "  • 34 schedules"
echo "  • And much more!"
echo "=========================================="
