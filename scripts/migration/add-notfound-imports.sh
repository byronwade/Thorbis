#!/bin/bash

# Add notFound import to files that need it

FILES=(
  "/Users/byronwade/Thorbis/src/app/portal/setup/page.tsx"
  "/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/pricebook/page.tsx"
  "/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/new/page.tsx"
  "/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/jobs/new/page.tsx"
  "/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/page.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Adding notFound import to: $file"

    # Check if file has any next/navigation import
    if grep -q "from ['\"]next/navigation['\"]" "$file"; then
      # Add notFound to existing next/navigation import
      perl -i -pe 's/(import\s+\{)([^}]+)(\}\s+from\s+["\x27]next\/navigation["\x27])/$1$2, notFound$3/ unless \/notFound/' "$file"
    else
      # Add new import line after the first import
      perl -i -pe 'if (!$done && /^import\s/) { $_ .= "import { notFound } from \"next/navigation\";\n"; $done = 1; }' "$file"
    fi

    echo "  ✓ Added"
  fi
done

echo ""
echo "All imports added!"
