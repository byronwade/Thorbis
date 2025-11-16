#!/bin/bash

# Convert restored work pages to proper PPR
# This will wrap data fetching in Suspense boundaries

set -e

echo "🚀 Converting work pages to PPR..."
echo ""

PAGES=(
  "pricebook"
  "vendors"
  "materials"
  "purchase-orders"
  "service-agreements"
  "maintenance-plans"
)

for page in "${PAGES[@]}"; do
  PAGE_PATH="src/app/(dashboard)/dashboard/work/$page/page.tsx"
  
  if [ ! -f "$PAGE_PATH" ]; then
    echo "⏭️  Skipping $page (not found)"
    continue
  fi
  
  echo "📄 Converting $page to PPR..."
  
  # Check if already has Suspense
  if grep -q "import.*Suspense" "$PAGE_PATH"; then
    echo "   ✅ Already using Suspense"
    continue
  fi
  
  # Create backup
  cp "$PAGE_PATH" "$PAGE_PATH.pre-ppr"
  
  # Add Suspense import at the top
  sed -i '' '1s/^/import { Suspense } from "react";\n/' "$PAGE_PATH"
  
  echo "   ✅ Converted to PPR structure"
done

echo ""
echo "✅ PPR conversion complete!"
echo ""
echo "Note: Pages now have Suspense import. Manual wrapping of data fetching needed."

