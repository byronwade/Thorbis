#!/bin/bash

# Fix dynamic route pages that were incorrectly migrated
# Usage: ./scripts/fix-dynamic-routes.sh

set -e

echo "🔧 Fixing dynamic route pages..."
echo ""

FIXED=0
ERRORS=0

# Find all pages with dynamic routes that have backups
PAGES=$(find src/app/\(dashboard\)/dashboard -name "page.tsx.backup" -path "*\[*\]*" 2>/dev/null || echo "")

if [ -z "$PAGES" ]; then
  echo "No dynamic route pages with backups found"
  exit 0
fi

while IFS= read -r backup; do
  original="${backup%.backup}"
  
  echo "📄 Restoring: $original"
  
  # Restore from backup
  if [ -f "$backup" ]; then
    cp "$backup" "$original"
    echo "   ✅ Restored from backup"
    ((FIXED++))
  else
    echo "   ❌ Backup not found"
    ((ERRORS++))
  fi
done <<< "$PAGES"

echo ""
echo "✅ Fixed: $FIXED"
echo "❌ Errors: $ERRORS"
echo ""
echo "🎉 Dynamic routes restored!"

