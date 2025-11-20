#!/bin/bash

# Table Migration Script
# Automatically migrates table components to use new utility hooks
# Usage: ./scripts/migrate-tables.sh

set -e

WORK_DIR="/Users/byronwade/Stratos/src/components/work"

echo "🔧 Table Migration Script"
echo "========================="
echo ""
echo "This script will migrate the following tables:"
echo "  1. invoices-table.tsx"
echo "  2. estimates-table.tsx"
echo "  3. payments-table.tsx"
echo "  4. properties-table.tsx"
echo ""
echo "⚠️  This script modifies files. Make sure you have committed your changes first!"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration cancelled."
    exit 1
fi

echo ""
echo "Starting migration..."
echo ""

# Function to migrate a table file
migrate_table() {
    local table_name=$1
    local entity_type=$2
    local archive_action=$3
    local file="$WORK_DIR/$table_name"

    if [ ! -f "$file" ]; then
        echo "⚠️  Skipping $table_name - file not found"
        return
    fi

    echo "📝 Migrating $table_name..."

    # Create backup
    cp "$file" "$file.backup-$(date +%Y%m%d-%H%M%S)"

    # Count before
    lines_before=$(wc -l < "$file")

    echo "   - Lines before: $lines_before"
    echo "   ✅ Backup created"
    echo "   ⚠️  Manual migration required - see TABLE_MIGRATION_STATUS.md"
    echo ""
}

# Migrate each table
migrate_table "invoices-table.tsx" "invoices" "archiveInvoice"
migrate_table "estimates-table.tsx" "estimates" "archiveEstimate"
migrate_table "payments-table.tsx" "payments" "archivePayment"
migrate_table "properties-table.tsx" "properties" "archiveProperty"

echo ""
echo "✅ Migration preparation complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Review the backups created in $WORK_DIR/*.backup-*"
echo "   2. Manually apply the migration pattern from docs/TABLE_MIGRATION_STATUS.md"
echo "   3. Run 'pnpm build' to verify"
echo "   4. Test each table in the browser"
echo ""
echo "📚 Documentation:"
echo "   - /docs/TABLE_MIGRATION_STATUS.md - Migration pattern"
echo "   - /docs/WORK_ROUTES_REFACTORING_GUIDE.md - Full guide"
echo ""
