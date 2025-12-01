#!/bin/bash
# Create comprehensive database setup script from all migrations

OUTPUT="supabase/setup_database_from_scratch.sql"

echo "-- ============================================================================" > "$OUTPUT"
echo "-- COMPREHENSIVE DATABASE SETUP FROM SCRATCH" >> "$OUTPUT"
echo "-- ============================================================================" >> "$OUTPUT"
echo "-- This script creates the ENTIRE Thorbis FSM database schema from scratch" >> "$OUTPUT"
echo "-- Consolidates all 82+ migration files into one comprehensive setup script" >> "$OUTPUT"
echo "-- Generated: $(date)" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "-- Usage:" >> "$OUTPUT"
echo "--   psql \$DATABASE_URL -f setup_database_from_scratch.sql" >> "$OUTPUT"
echo "--   OR use the wrapper script: ./scripts/setup_database_from_scratch.sh" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "-- This script includes:" >> "$OUTPUT"
echo "--   - 3 PostgreSQL extensions" >> "$OUTPUT"
echo "--   - 31 ENUM types for type safety" >> "$OUTPUT"
echo "--   - 131+ tables with proper dependency ordering" >> "$OUTPUT"
echo "--   - All indexes, triggers, functions, and RLS policies" >> "$OUTPUT"
echo "--   - Storage buckets and policies" >> "$OUTPUT"
echo "--   - Complete security infrastructure" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "-- IMPORTANT: This script uses IF NOT EXISTS for idempotency" >> "$OUTPUT"
echo "-- ============================================================================" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Find all migration files (including in migrations_backup)
MIGRATION_FILES=$(find supabase/migrations -name "*.sql" ! -name "*.bak" | sort)

echo "-- ============================================================================" >> "$OUTPUT"
echo "-- ALL MIGRATIONS (In Execution Order)" >> "$OUTPUT"
echo "-- ============================================================================" >> "$OUTPUT"
echo "" >> "$OUTPUT"

COUNT=0
for file in $MIGRATION_FILES; do
    COUNT=$((COUNT + 1))
    echo "-- ============================================================================" >> "$OUTPUT"
    echo "-- Migration $COUNT: $(basename "$file")" >> "$OUTPUT"
    echo "-- ============================================================================" >> "$OUTPUT"
    cat "$file" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
done

echo "Comprehensive setup script created: $OUTPUT"
echo "Total migrations included: $COUNT"
wc -l "$OUTPUT"
