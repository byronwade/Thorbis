#!/bin/bash

# Script to migrate work detail pages to PPR
# Usage: ./scripts/migrate-work-page-to-ppr.sh <page-name>
# Example: ./scripts/migrate-work-page-to-ppr.sh contracts

set -e

PAGE_NAME=$1

if [ -z "$PAGE_NAME" ]; then
  echo "Usage: ./scripts/migrate-work-page-to-ppr.sh <page-name>"
  echo "Example: ./scripts/migrate-work-page-to-ppr.sh contracts"
  exit 1
fi

# Convert to PascalCase for component names
PAGE_NAME_PASCAL=$(echo "$PAGE_NAME" | sed -r 's/(^|-)([a-z])/\U\2/g')

echo "🚀 Migrating $PAGE_NAME to PPR..."
echo "   Component prefix: $PAGE_NAME_PASCAL"

# Create component directory
COMPONENT_DIR="src/components/work/$PAGE_NAME"
mkdir -p "$COMPONENT_DIR"

echo "✅ Created directory: $COMPONENT_DIR"

# Create stats component
cat > "$COMPONENT_DIR/${PAGE_NAME}-stats.tsx" << 'EOF'
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

  if (!supabase) {
    return notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    return notFound();
  }

  // TODO: Add stats fetching logic here
  const stats: StatCard[] = [];

  return <StatusPipeline compact stats={stats} />;
}
EOF

# Replace placeholder with actual component name
sed -i '' "s/Stats/${PAGE_NAME_PASCAL}Stats/g" "$COMPONENT_DIR/${PAGE_NAME}-stats.tsx"

echo "✅ Created: ${PAGE_NAME}-stats.tsx"

# Create data component
cat > "$COMPONENT_DIR/${PAGE_NAME}-data.tsx" << 'EOF'
import { notFound } from "next/navigation";
import { WorkDataView } from "@/components/work/work-data-view";
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

  if (!supabase) {
    return notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    return notFound();
  }

  // TODO: Add data fetching logic here
  const items: any[] = [];

  return (
    <WorkDataView
      kanban={<div>Kanban view</div>}
      section="section-name"
      table={<div>Table view</div>}
    />
  );
}
EOF

# Replace placeholder with actual component name
sed -i '' "s/Data/${PAGE_NAME_PASCAL}Data/g" "$COMPONENT_DIR/${PAGE_NAME}-data.tsx"

echo "✅ Created: ${PAGE_NAME}-data.tsx"

# Create skeleton component
cat > "$COMPONENT_DIR/${PAGE_NAME}-skeleton.tsx" << 'EOF'
/**
 * Skeleton Component - Loading Skeleton
 *
 * Displays while data is loading.
 * Provides visual feedback during streaming.
 */
export function Skeleton() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Content skeleton */}
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
EOF

# Replace placeholder with actual component name
sed -i '' "s/Skeleton/${PAGE_NAME_PASCAL}Skeleton/g" "$COMPONENT_DIR/${PAGE_NAME}-skeleton.tsx"

echo "✅ Created: ${PAGE_NAME}-skeleton.tsx"

echo ""
echo "🎉 PPR components created successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Move data fetching logic from page.tsx to ${PAGE_NAME}-stats.tsx and ${PAGE_NAME}-data.tsx"
echo "   2. Update page.tsx to use Suspense with the new components"
echo "   3. Test the page to ensure it works correctly"
echo ""
echo "📄 Template page.tsx:"
echo ""
cat << 'TEMPLATE'
/**
 * Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Table/Kanban streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { Stats } from "@/components/work/PAGE_NAME/PAGE_NAME-stats";
import { Data } from "@/components/work/PAGE_NAME/PAGE_NAME-data";
import { Skeleton } from "@/components/work/PAGE_NAME/PAGE_NAME-skeleton";

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      {/* Stats - Streams in first */}
      <Suspense fallback={<div className="h-24 animate-pulse rounded bg-muted" />}>
        <Stats />
      </Suspense>

      {/* Table/Kanban - Streams in second */}
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<Skeleton />}>
          <Data />
        </Suspense>
      </div>
    </div>
  );
}
TEMPLATE

echo ""

