#!/bin/bash
# ============================================================================
# COMPREHENSIVE DATABASE SETUP SCRIPT - WEB APPLICATION
# ============================================================================
# Description: Creates the entire Thorbis database schema from scratch
# Usage: Run all migrations in order from supabase/migrations directory
# 
# This script consolidates all 81 migration files into proper execution order.
# It handles:
# - Extensions
# - Functions/Triggers
# - Enums
# - Tables (with proper dependency ordering)
# - Indexes
# - RLS Policies
# - Constraints
#
# IMPORTANT: This script assumes you have a Supabase project set up.
# Run this against your Supabase database using:
#   psql <DATABASE_URL> -f setup_database_complete.sh
#
# Or use Supabase CLI:
#   supabase db reset (will run all migrations in order)
# ============================================================================

set -e  # Exit on error

echo "============================================================================"
echo "THORBIS DATABASE SETUP - WEB APPLICATION"
echo "============================================================================"
echo "This script will create all tables, indexes, triggers, and RLS policies"
echo "from the 81 migration files in supabase/migrations"
echo ""
echo "Starting database setup..."
echo "============================================================================"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MIGRATIONS_DIR="$SCRIPT_DIR/supabase/migrations"

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "ERROR: Migrations directory not found at $MIGRATIONS_DIR"
    exit 1
fi

# Count migration files
MIGRATION_COUNT=$(ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | wc -l)
echo "Found $MIGRATION_COUNT migration files"
echo ""

# If DATABASE_URL is not set, use supabase CLI
if [ -z "$DATABASE_URL" ]; then
    echo "DATABASE_URL not set. Using Supabase CLI..."
    echo ""
    echo "Running: supabase db reset"
    echo ""
    
    # Check if supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        echo "ERROR: Supabase CLI not found. Please install it first:"
        echo "  npm install -g supabase"
        echo ""
        echo "Or set DATABASE_URL environment variable to run migrations directly with psql"
        exit 1
    fi
    
    # Run supabase db reset which will apply all migrations in order
    supabase db reset
    
else
    echo "Running migrations against $DATABASE_URL"
    echo ""
    
    # Check if psql is installed
    if ! command -v psql &> /dev/null; then
        echo "ERROR: psql not found. Please install PostgreSQL client tools"
        exit 1
    fi
    
    # Run each migration file in order
    for migration_file in $(ls -1 "$MIGRATIONS_DIR"/*.sql | sort); do
        filename=$(basename "$migration_file")
        echo "Running migration: $filename"
        psql "$DATABASE_URL" -f "$migration_file" -v ON_ERROR_STOP=1
        
        if [ $? -eq 0 ]; then
            echo "  ✓ Success"
        else
            echo "  ✗ Failed"
            echo "ERROR: Migration failed at $filename"
            exit 1
        fi
    done
    
fi

echo ""
echo "============================================================================"
echo "DATABASE SETUP COMPLETE!"
echo "============================================================================"
echo ""
echo "All tables, indexes, triggers, and RLS policies have been created."
echo ""
echo "You can now run the seed file to populate test data:"
echo "  psql $DATABASE_URL -f supabase/seed.sql"
echo "  OR"
echo "  supabase db seed"
echo ""
echo "============================================================================"
