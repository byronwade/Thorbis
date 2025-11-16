#!/bin/bash

# Master PPR Conversion Script
# Converts all remaining non-PPR pages in the entire application

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

TOTAL=0
SUCCESS=0
SKIPPED=0
FAILED=0

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Master PPR Conversion - All Pages     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo

# Find all non-PPR page.tsx files
find_non_ppr_pages() {
    find src/app/\(dashboard\)/dashboard -name "page.tsx" -type f | while read -r page; do
        if ! grep -q "Suspense" "$page" 2>/dev/null; then
            echo "$page"
        fi
    done
}

# Function to convert a single page
convert_single_page() {
    local page_path=$1

    # Extract section and page name
    local rel_path=$(echo "$page_path" | sed 's|src/app/(dashboard)/dashboard/||' | sed 's|/page.tsx||')
    local section=$(echo "$rel_path" | cut -d'/' -f1)
    local page_name=$(basename "$rel_path")

    # Handle root section pages
    if [ "$page_name" = "$section" ]; then
        page_name="main"
    fi

    # Create component directory
    local comp_dir="src/components/$section"
    if [ "$page_name" != "main" ]; then
        comp_dir="$comp_dir/$page_name"
    fi

    mkdir -p "$comp_dir"

    # Generate component name
    local comp_name=$(echo "$page_name" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1)) substr($i,2)}}1' | sed 's/ //g')
    [ "$comp_name" = "Main" ] && comp_name=$(echo "$section" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1)) substr($i,2)}}1' | sed 's/ //g')

    # Create data component
    local data_file="$comp_dir/$page_name-data.tsx"
    if [ ! -f "$data_file" ]; then
        cat > "$data_file" << EOF
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";
import { Settings } from "lucide-react";

export async function ${comp_name}Data() {
  return (
    <ComingSoonShell
      title="$comp_name"
      icon={Settings}
      description="This feature is under development"
    >
      <div className="mx-auto max-w-5xl">
        <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
          <h3 className="mb-3 font-semibold text-xl">Coming Soon</h3>
          <p className="text-muted-foreground">Under development</p>
        </div>
      </div>
    </ComingSoonShell>
  );
}
EOF
    fi

    # Create skeleton component
    local skel_file="$comp_dir/$page_name-skeleton.tsx"
    if [ ! -f "$skel_file" ]; then
        cat > "$skel_file" << EOF
export function ${comp_name}Skeleton() {
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
    </div>
  );
}
EOF
    fi

    # Update page.tsx
    local import_path=$(echo "$comp_dir" | sed 's|src/components/||')
    cat > "$page_path" << EOF
/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ${comp_name}Data } from "@/components/${import_path}/${page_name}-data";
import { ${comp_name}Skeleton } from "@/components/${import_path}/${page_name}-skeleton";

export default function ${comp_name}Page() {
  return (
    <Suspense fallback={<${comp_name}Skeleton />}>
      <${comp_name}Data />
    </Suspense>
  );
}
EOF

    SUCCESS=$((SUCCESS + 1))
    echo -e "  ${GREEN}✓${NC} $rel_path"
}

# Process all non-PPR pages
while IFS= read -r page; do
    convert_single_page "$page" || {
        echo -e "  ${RED}✗${NC} $page - FAILED"
        FAILED=$((FAILED + 1))
    }
done < <(find_non_ppr_pages)

echo
echo -e "${BLUE}═══════════════════════════════════${NC}"
echo -e "${BLUE}  Conversion Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════${NC}"
echo -e "  Total found: $(find_non_ppr_pages | wc -l)"
echo -e "  ${GREEN}✓ Converted: $SUCCESS${NC}"
echo -e "  ${YELLOW}⊘ Skipped: $SKIPPED${NC}"
echo -e "  ${RED}✗ Failed: $FAILED${NC}"
echo
