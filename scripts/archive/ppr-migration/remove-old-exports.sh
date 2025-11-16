#!/bin/bash

# Script to remove incompatible Next.js exports for cacheComponents
# These exports are incompatible with Next.js 16's cacheComponents feature

echo "🔧 Removing incompatible Next.js route segment config exports..."
echo ""

# Count files before
BEFORE_COUNT=$(grep -r "export const \(dynamic\|revalidate\|runtime\|fetchCache\)" src/app --include="*.tsx" --include="*.ts" | wc -l)
echo "📊 Found $BEFORE_COUNT incompatible exports"
echo ""

# Remove dynamic exports
echo "🗑️  Removing 'export const dynamic' statements..."
find src/app -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' '/^export const dynamic = /d' {} \;

# Remove revalidate exports
echo "🗑️  Removing 'export const revalidate' statements..."
find src/app -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' '/^export const revalidate = /d' {} \;

# Remove runtime exports (from API routes)
echo "🗑️  Removing 'export const runtime' statements..."
find src/app -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' '/^export const runtime = /d' {} \;

# Remove fetchCache exports
echo "🗑️  Removing 'export const fetchCache' statements..."
find src/app -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' '/^export const fetchCache = /d' {} \;

# Count files after
AFTER_COUNT=$(grep -r "export const \(dynamic\|revalidate\|runtime\|fetchCache\)" src/app --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)

echo ""
echo "✅ Cleanup complete!"
echo "📊 Removed $(($BEFORE_COUNT - $AFTER_COUNT)) incompatible exports"
echo ""

if [ $AFTER_COUNT -gt 0 ]; then
  echo "⚠️  Warning: $AFTER_COUNT exports still remain (may be in comments or complex statements)"
  echo "   Run this to see them:"
  echo "   grep -r \"export const \(dynamic\|revalidate\|runtime\|fetchCache\)\" src/app --include=\"*.tsx\" --include=\"*.ts\""
else
  echo "🎉 All incompatible exports removed!"
fi

echo ""
echo "📝 Note: With cacheComponents enabled, caching is handled automatically."
echo "   No manual cache configuration is needed per page."

