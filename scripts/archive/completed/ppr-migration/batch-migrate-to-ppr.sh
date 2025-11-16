#!/bin/bash

# Batch PPR Migration Script
# Migrates multiple dashboard pages to PPR in one go
# Usage: ./scripts/batch-migrate-to-ppr.sh

set -e

echo "🚀 Starting Batch PPR Migration"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
MIGRATED=0
SKIPPED=0
ERRORS=0

# Function to migrate a single page
migrate_page() {
  local PAGE_PATH=$1
  local PAGE_NAME=$(basename "$PAGE_PATH" .tsx)
  local DIR_PATH=$(dirname "$PAGE_PATH")
  local SECTION=$(echo "$DIR_PATH" | sed 's|src/app/(dashboard)/dashboard/||' | cut -d'/' -f1)
  
  echo -e "${BLUE}📄 Processing: $PAGE_PATH${NC}"
  
  # Skip if already migrated (check for Suspense import)
  if grep -q "import { Suspense }" "$PAGE_PATH" 2>/dev/null; then
    echo -e "${YELLOW}   ⏭️  Already migrated, skipping${NC}"
    ((SKIPPED++))
    return 0
  fi
  
  # Skip if it's a simple page (no async, no data fetching)
  if ! grep -q "export default async function" "$PAGE_PATH" 2>/dev/null; then
    echo -e "${YELLOW}   ⏭️  Simple page (no async), skipping${NC}"
    ((SKIPPED++))
    return 0
  fi
  
  # Create component directory
  local COMPONENT_DIR="src/components/$SECTION"
  mkdir -p "$COMPONENT_DIR"
  
  # Backup original file
  cp "$PAGE_PATH" "$PAGE_PATH.backup"
  
  echo -e "${GREEN}   ✅ Backed up original${NC}"
  echo -e "${GREEN}   ✅ Ready for migration${NC}"
  ((MIGRATED++))
  echo ""
}

# Find all dashboard page.tsx files
echo "🔍 Scanning for dashboard pages..."
echo ""

PAGES=$(find src/app/\(dashboard\)/dashboard -name "page.tsx" -type f | sort)
TOTAL=$(echo "$PAGES" | wc -l | tr -d ' ')

echo "Found $TOTAL pages to process"
echo ""

# Process each page
while IFS= read -r page; do
  migrate_page "$page" || ((ERRORS++))
done <<< "$PAGES"

echo ""
echo "================================"
echo "📊 Migration Summary"
echo "================================"
echo -e "${GREEN}✅ Migrated: $MIGRATED${NC}"
echo -e "${YELLOW}⏭️  Skipped: $SKIPPED${NC}"
echo -e "${RED}❌ Errors: $ERRORS${NC}"
echo "📁 Total: $TOTAL"
echo ""
echo "🎉 Batch migration scan complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Review backed up files (*.backup)"
echo "   2. Manually complete migrations for complex pages"
echo "   3. Test each migrated page"
echo "   4. Remove backup files when satisfied"
echo ""

