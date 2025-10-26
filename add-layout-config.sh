#!/bin/bash

# Script to add usePageLayout hook to all dashboard pages that don't have it
# This ensures consistent layout configuration across all pages

# Pages to skip (already configured)
SKIP_PAGES=(
  "src/app/(dashboard)/dashboard/page.tsx"
  "src/app/(dashboard)/dashboard/communication/page.tsx"
  "src/app/(dashboard)/dashboard/ai/page.tsx"
  "src/app/(dashboard)/dashboard/test-full-width/page.tsx"
  "src/app/(dashboard)/dashboard/test-layout/page.tsx"
)

# Function to check if page should be skipped
should_skip() {
  local file=$1
  for skip in "${SKIP_PAGES[@]}"; do
    if [[ "$file" == *"$skip"* ]]; then
      return 0
    fi
  done
  return 1
}

# Function to check if file already has usePageLayout
has_use_page_layout() {
  local file=$1
  grep -q "usePageLayout" "$file"
  return $?
}

# Function to check if file has "use client" directive
has_use_client() {
  local file=$1
  head -n 5 "$file" | grep -q '"use client"'
  return $?
}

# Function to add usePageLayout to a file
add_layout_config() {
  local file=$1

  echo "Processing: $file"

  # Check if already has usePageLayout
  if has_use_page_layout "$file"; then
    echo "  ✓ Already has usePageLayout"
    return
  fi

  # Create backup
  cp "$file" "$file.bak"

  # Check if file has "use client" directive
  if has_use_client "$file"; then
    # Add import after existing imports
    # Find the last import line
    last_import_line=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)

    # Add the import after the last import
    sed -i "" "${last_import_line}a\\
import { usePageLayout } from \"@/hooks/use-page-layout\";
" "$file"
  else
    # Add "use client" and import at the top
    # Find first non-empty line
    first_line=$(grep -n "^[^[:space:]]" "$file" | head -1 | cut -d: -f1)

    # Insert "use client" and import before first line
    sed -i "" "${first_line}i\\
\"use client\";\\

" "$file"

    # Now add import after any existing imports or after "use client"
    last_import_line=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)
    if [ -n "$last_import_line" ]; then
      sed -i "" "${last_import_line}a\\
import { usePageLayout } from \"@/hooks/use-page-layout\";
" "$file"
    else
      # No imports, add after "use client"
      sed -i "" "2a\\
\\
import { usePageLayout } from \"@/hooks/use-page-layout\";
" "$file"
    fi
  fi

  # Find the default export function
  function_line=$(grep -n "^export default function" "$file" | head -1 | cut -d: -f1)

  if [ -z "$function_line" ]; then
    echo "  ✗ Could not find export default function"
    mv "$file.bak" "$file"
    return
  fi

  # Add usePageLayout call after the function declaration
  # Find the opening brace of the function
  next_line=$((function_line + 1))

  # Insert usePageLayout configuration
  sed -i "" "${next_line}i\\
  usePageLayout({\\
    maxWidth: \"7xl\",\\
    padding: \"md\",\\
    gap: \"md\",\\
    showToolbar: true,\\
    showSidebar: true,\\
  });\\

" "$file"

  # Remove backup if successful
  rm "$file.bak"
  echo "  ✓ Added usePageLayout configuration"
}

# Find all page.tsx files in dashboard
echo "Finding all dashboard pages..."
page_files=$(find src/app/\(dashboard\)/dashboard -name "page.tsx" -type f)

count=0
processed=0

for file in $page_files; do
  count=$((count + 1))

  if should_skip "$file"; then
    echo "Skipping: $file (already configured)"
    continue
  fi

  add_layout_config "$file"
  processed=$((processed + 1))
done

echo ""
echo "Summary:"
echo "  Total pages found: $count"
echo "  Pages processed: $processed"
echo "  Pages skipped: $((count - processed))"
