#!/bin/bash
# ============================================================================
# COMPREHENSIVE DATABASE SETUP SCRIPT - WEB APPLICATION
# ============================================================================
# This script sets up the entire database from scratch using the comprehensive
# SQL file that consolidates all 82+ migration files.
#
# Usage:
#   DATABASE_URL="postgres://..." ./scripts/setup_database_from_scratch.sh
#
# Or with Supabase CLI:
#   ./scripts/setup_database_from_scratch.sh
#
# The setup creates 131+ tables, 200+ indexes, RLS policies, and all necessary
# database objects from the comprehensive setup script.
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SETUP_SQL="$PROJECT_ROOT/supabase/setup_database_from_scratch.sql"

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}COMPREHENSIVE DATABASE SETUP - THORBIS FSM${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

# Check if SQL file exists
if [ ! -f "$SETUP_SQL" ]; then
    echo -e "${RED}ERROR: Comprehensive setup SQL file not found!${NC}"
    echo "Expected location: $SETUP_SQL"
    echo ""
    echo "Please ensure the file exists. You may need to run:"
    echo "  ./scripts/create_comprehensive_setup.sh"
    exit 1
fi

echo -e "${GREEN}✓${NC} Found comprehensive setup SQL file: $(basename "$SETUP_SQL")"
SQL_SIZE=$(wc -l < "$SETUP_SQL" | tr -d ' ')
echo -e "${GREEN}✓${NC} File size: $SQL_SIZE lines"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}DATABASE_URL not set. Using Supabase CLI...${NC}"
    echo ""
    
    # Check if supabase CLI is available
    if ! command -v supabase &> /dev/null; then
        echo -e "${RED}ERROR: Supabase CLI not found!${NC}"
        echo ""
        echo "Please either:"
        echo "  1. Install Supabase CLI: https://supabase.com/docs/guides/cli"
        echo "  2. Set DATABASE_URL environment variable for direct psql connection"
        exit 1
    fi
    
    echo -e "${BLUE}Resetting database with Supabase CLI...${NC}"
    echo "This will drop all existing data and recreate the schema."
    echo ""
    read -p "Continue? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 0
    fi
    
    # Use Supabase CLI to reset and apply migrations
    cd "$PROJECT_ROOT"
    if [ -d "supabase" ]; then
        echo ""
        echo -e "${BLUE}Running: supabase db reset${NC}"
        supabase db reset
    else
        echo -e "${RED}ERROR: supabase directory not found!${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}✓${NC} Database reset complete!"
    echo ""
    echo "Note: Supabase CLI runs migrations in order. To use the comprehensive"
    echo "setup script directly, set DATABASE_URL and run this script again."
    
else
    echo -e "${BLUE}Running migrations against: ${DATABASE_URL%%@*}@...${NC}"
    echo ""
    
    # Extract connection info (without password)
    DB_INFO=$(echo "$DATABASE_URL" | sed 's/:[^:@]*@/:***@/')
    echo "Target database: $DB_INFO"
    echo ""
    
    # Check if psql is available
    if ! command -v psql &> /dev/null; then
        echo -e "${RED}ERROR: psql not found!${NC}"
        echo ""
        echo "Please install PostgreSQL client tools:"
        echo "  macOS: brew install postgresql"
        echo "  Ubuntu: sudo apt-get install postgresql-client"
        exit 1
    fi
    
    echo -e "${YELLOW}WARNING: This will apply the comprehensive schema to the database.${NC}"
    echo "Make sure you have a backup if this is a production database!"
    echo ""
    read -p "Continue? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 0
    fi
    
    echo ""
    echo -e "${BLUE}Executing comprehensive setup SQL...${NC}"
    echo "This may take a few minutes for large schemas..."
    echo ""
    
    # Run the comprehensive SQL file
    if psql "$DATABASE_URL" -f "$SETUP_SQL" -v ON_ERROR_STOP=1; then
        echo ""
        echo -e "${GREEN}✓${NC} Database setup completed successfully!"
    else
        echo ""
        echo -e "${RED}✗${NC} Database setup failed!"
        echo "Check the error messages above for details."
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}============================================================================${NC}"
echo -e "${GREEN}DATABASE SETUP COMPLETE${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""
echo "Your database now includes:"
echo "  • All 131+ tables"
echo "  • All ENUMs and extensions"
echo "  • All indexes, triggers, and functions"
echo "  • All RLS policies"
echo "  • Storage buckets and configurations"
echo ""
echo "You can verify the setup by running:"
echo "  psql \$DATABASE_URL -c \"\\dt\"  # List all tables"
echo "  psql \$DATABASE_URL -c \"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';\""
echo ""


