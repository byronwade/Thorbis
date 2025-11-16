#!/bin/bash

# PPR Component Generator
# Generates data, skeleton, and updates page.tsx for PPR conversion

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to create coming-soon data component
create_coming_soon_data() {
    local component_path=$1
    local title=$2
    local icon=$3
    local description=$4

    cat > "$component_path" << 'DATAEOF'
/**
 * TITLE_PLACEHOLDER Data - Async Server Component
 *
 * Displays TITLE_PLACEHOLDER content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern.
 */

import { ComingSoonShell } from "@/components/ui/coming-soon-shell";
import { ICON_PLACEHOLDER } from "lucide-react";

export async function COMPONENT_NAME_PLACEHOLDERData() {
  return (
    <ComingSoonShell
      title="TITLE_PLACEHOLDER"
      icon={ICON_PLACEHOLDER}
      description="DESCRIPTION_PLACEHOLDER"
    >
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
          <h3 className="mb-3 font-semibold text-xl">Coming Soon</h3>
          <p className="mb-6 text-muted-foreground">
            This feature is under development
          </p>
        </div>
      </div>
    </ComingSoonShell>
  );
}
DATAEOF

    # Replace placeholders
    sed -i '' "s/TITLE_PLACEHOLDER/$title/g" "$component_path"
    sed -i '' "s/ICON_PLACEHOLDER/$icon/g" "$component_path"
    sed -i '' "s/DESCRIPTION_PLACEHOLDER/$description/g" "$component_path"
    sed -i '' "s/COMPONENT_NAME_PLACEHOLDER/$(basename $(dirname $component_path) | sed 's/-//g' | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')/g" "$component_path"
}

# Function to create skeleton component
create_skeleton() {
    local skeleton_path=$1
    local component_name=$2

    cat > "$skeleton_path" << 'SKELEOF'
/**
 * COMPONENT_NAME_PLACEHOLDER Skeleton - Loading State
 */

export function COMPONENT_NAME_PLACEHOLDERSkeleton() {
  return (
    <div className="relative space-y-10 py-8 md:py-12">
      <div className="flex justify-center">
        <div className="h-9 w-32 animate-pulse rounded-full bg-muted" />
      </div>

      <div className="flex justify-center">
        <div className="size-24 animate-pulse rounded-full bg-muted" />
      </div>

      <div className="mx-auto max-w-3xl space-y-3 text-center">
        <div className="mx-auto h-12 w-96 animate-pulse rounded bg-muted" />
        <div className="mx-auto h-6 w-full max-w-2xl animate-pulse rounded bg-muted" />
      </div>

      <div className="mx-auto max-w-5xl space-y-8 pt-4">
        <div className="rounded-lg border bg-card p-8 text-center">
          <div className="mx-auto mb-3 h-7 w-48 animate-pulse rounded bg-muted" />
          <div className="mx-auto mb-6 h-5 w-64 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <div className="h-4 w-80 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
SKELEOF

    sed -i '' "s/COMPONENT_NAME_PLACEHOLDER/$component_name/g" "$skeleton_path"
}

# Function to update page.tsx
update_page() {
    local page_path=$1
    local component_name=$2
    local import_path=$3

    cat > "$page_path" << PAGEEOF
/**
 * $component_name Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { ${component_name}Data } from "@/components/${import_path}/${import_path}-data";
import { ${component_name}Skeleton } from "@/components/${import_path}/${import_path}-skeleton";

export default function ${component_name}Page() {
  return (
    <Suspense fallback={<${component_name}Skeleton />}>
      <${component_name}Data />
    </Suspense>
  );
}
PAGEEOF
}

echo -e "${BLUE}PPR Component Generator${NC}"
echo -e "This script will generate data and skeleton components for PPR conversion"
echo

# Example usage
if [ $# -eq 0 ]; then
    echo "Usage: ./generate-ppr-components.sh <section> <page> <title> <icon> <description>"
    echo
    echo "Example:"
    echo "  ./generate-ppr-components.sh finance accounting 'Accounting' 'Calculator' 'Complete accounting management system'"
    exit 1
fi

SECTION=$1
PAGE=$2
TITLE=$3
ICON=$4
DESCRIPTION=$5

# Create component directory
COMPONENT_DIR="src/components/$SECTION/$PAGE"
mkdir -p "$COMPONENT_DIR"

# Generate files
echo -e "${GREEN}Creating components for $SECTION/$PAGE...${NC}"

create_coming_soon_data "$COMPONENT_DIR/${PAGE}-data.tsx" "$TITLE" "$ICON" "$DESCRIPTION"
echo "  ✅ Created ${PAGE}-data.tsx"

COMPONENT_NAME=$(echo $PAGE | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1)) substr($i,2)}}1' | sed 's/ //g')
create_skeleton "$COMPONENT_DIR/${PAGE}-skeleton.tsx" "$COMPONENT_NAME"
echo "  ✅ Created ${PAGE}-skeleton.tsx"

# Update page.tsx
PAGE_FILE="src/app/(dashboard)/dashboard/$SECTION/$PAGE/page.tsx"
if [ -f "$PAGE_FILE" ]; then
    update_page "$PAGE_FILE" "$COMPONENT_NAME" "$SECTION/$PAGE"
    echo "  ✅ Updated page.tsx"
fi

echo -e "${GREEN}Done!${NC}"
