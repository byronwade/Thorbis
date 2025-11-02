#!/bin/bash

# Script to add null checks after createClient() calls

FILES=(
  "/Users/byronwade/Stratos/src/app/portal/setup/page.tsx"
  "/Users/byronwade/Stratos/src/app/(dashboard)/dashboard/customers/[id]/edit/page.tsx"
  "/Users/byronwade/Stratos/src/app/(dashboard)/dashboard/customers/[id]/page.tsx"
  "/Users/byronwade/Stratos/src/app/(dashboard)/dashboard/work/pricebook/page.tsx"
  "/Users/byronwade/Stratos/src/app/(dashboard)/dashboard/work/pricebook/c/[...slug]/page.tsx"
  "/Users/byronwade/Stratos/src/app/(dashboard)/dashboard/work/new/page.tsx"
  "/Users/byronwade/Stratos/src/app/(dashboard)/dashboard/work/jobs/new/page.tsx"
  "/Users/byronwade/Stratos/src/app/(dashboard)/dashboard/work/page.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"

    # Use perl for better multiline replacement
    perl -i -pe '
      # Match "const supabase = await createClient();" and add null check after it
      if (/^\s*const supabase = await createClient\(\);/) {
        $_ .= "\n  if (!supabase) {\n    return notFound();\n  }\n";
      }
    ' "$file"

    echo "  ✓ Fixed"
  else
    echo "  ✗ File not found: $file"
  fi
done

echo ""
echo "All files processed!"
