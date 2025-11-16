#!/bin/bash

# Auto-migrate a page to PPR by analyzing its structure
# Usage: ./scripts/auto-migrate-page.sh <page-path>
# Example: ./scripts/auto-migrate-page.sh src/app/(dashboard)/dashboard/work/equipment/page.tsx

set -e

PAGE_PATH=$1

if [ -z "$PAGE_PATH" ]; then
  echo "Usage: ./scripts/auto-migrate-page.sh <page-path>"
  echo "Example: ./scripts/auto-migrate-page.sh src/app/(dashboard)/dashboard/work/equipment/page.tsx"
  exit 1
fi

if [ ! -f "$PAGE_PATH" ]; then
  echo "Error: File not found: $PAGE_PATH"
  exit 1
fi

# Extract page info
PAGE_NAME=$(basename "$(dirname "$PAGE_PATH")")
DIR_PATH=$(dirname "$PAGE_PATH")
SECTION=$(echo "$DIR_PATH" | sed 's|src/app/(dashboard)/dashboard/||' | cut -d'/' -f1)

# Convert to PascalCase
PAGE_NAME_PASCAL=$(echo "$PAGE_NAME" | sed -r 's/(^|-|_)([a-z])/\U\2/g')

echo "🚀 Auto-migrating: $PAGE_NAME"
echo "   Section: $SECTION"
echo "   Component: $PAGE_NAME_PASCAL"
echo ""

# Check if already migrated
if grep -q "import { Suspense }" "$PAGE_PATH"; then
  echo "✅ Already migrated!"
  exit 0
fi

# Check if it's async
if ! grep -q "export default async function" "$PAGE_PATH"; then
  echo "⏭️  Simple page (no async), no migration needed"
  exit 0
fi

# Create component directory
COMPONENT_DIR="src/components/$SECTION/$PAGE_NAME"
mkdir -p "$COMPONENT_DIR"

echo "📁 Created: $COMPONENT_DIR"

# Backup original
cp "$PAGE_PATH" "$PAGE_PATH.backup"
echo "💾 Backed up: $PAGE_PATH.backup"

# Extract the page content (everything between function and return)
PAGE_CONTENT=$(sed -n '/export default async function/,/^}/p' "$PAGE_PATH")

# Check if page has stats (StatusPipeline or StatCard)
HAS_STATS=$(echo "$PAGE_CONTENT" | grep -c "StatusPipeline\|StatCard" || true)

if [ "$HAS_STATS" -gt 0 ]; then
  echo "📊 Detected stats component"
  
  # Create stats component
  cat > "$COMPONENT_DIR/${PAGE_NAME}-stats.tsx" << 'STATSEOF'
import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Stats Component - Async Server Component
 *
 * Fetches and displays statistics.
 * This streams in first, before the table/kanban.
 */
export async function Stats() {
  const supabase = await createClient();
  if (!supabase) return notFound();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return notFound();
  
  const activeCompanyId = await getActiveCompanyId();
  if (!activeCompanyId) return notFound();
  
  // TODO: Add stats fetching logic from original page
  const stats: StatCard[] = [];
  
  return <StatusPipeline compact stats={stats} />;
}
STATSEOF
  
  # Replace placeholder
  sed -i '' "s/Stats/${PAGE_NAME_PASCAL}Stats/g" "$COMPONENT_DIR/${PAGE_NAME}-stats.tsx"
  echo "   ✅ Created: ${PAGE_NAME}-stats.tsx"
fi

# Create data component
cat > "$COMPONENT_DIR/${PAGE_NAME}-data.tsx" << 'DATAEOF'
import { notFound } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Data Component - Async Server Component
 *
 * Fetches and displays main content.
 * This streams in after the stats render.
 */
export async function Data() {
  const supabase = await createClient();
  if (!supabase) return notFound();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return notFound();
  
  const activeCompanyId = await getActiveCompanyId();
  if (!activeCompanyId) return notFound();
  
  // TODO: Add data fetching logic from original page
  
  return (
    <div>
      {/* TODO: Add UI components from original page */}
    </div>
  );
}
DATAEOF

sed -i '' "s/Data/${PAGE_NAME_PASCAL}Data/g" "$COMPONENT_DIR/${PAGE_NAME}-data.tsx"
echo "   ✅ Created: ${PAGE_NAME}-data.tsx"

# Create skeleton
cat > "$COMPONENT_DIR/${PAGE_NAME}-skeleton.tsx" << 'SKELEOF'
/**
 * Skeleton Component - Loading Skeleton
 *
 * Displays while data is loading.
 */
export function Skeleton() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
SKELEOF

sed -i '' "s/Skeleton/${PAGE_NAME_PASCAL}Skeleton/g" "$COMPONENT_DIR/${PAGE_NAME}-skeleton.tsx"
echo "   ✅ Created: ${PAGE_NAME}-skeleton.tsx"

echo ""
echo "🎉 Components created!"
echo ""
echo "📝 Next steps:"
echo "   1. Move data fetching logic from $PAGE_PATH to the new components"
echo "   2. Update $PAGE_PATH to use Suspense pattern"
echo "   3. Test the page"
echo ""
echo "📄 Suggested page.tsx structure:"
echo ""
cat << 'PAGEEOF'
import { Suspense } from "react";
import { Stats } from "@/components/SECTION/PAGE_NAME/PAGE_NAME-stats";
import { Data } from "@/components/SECTION/PAGE_NAME/PAGE_NAME-data";
import { Skeleton } from "@/components/SECTION/PAGE_NAME/PAGE_NAME-skeleton";

export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="h-24 animate-pulse rounded bg-muted" />}>
        <Stats />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <Data />
      </Suspense>
    </>
  );
}
PAGEEOF

echo ""

