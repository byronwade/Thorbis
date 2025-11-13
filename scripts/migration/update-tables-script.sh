#!/bin/bash

# Script to add archive import pattern to table files
# This adds the useArchiveStore import to each table component

FILES=(
  "/Users/byronwade/Stratos/src/components/work/estimates-table.tsx"
  "/Users/byronwade/Stratos/src/components/work/payments-table.tsx"
  "/Users/byronwade/Stratos/src/components/work/contracts-table.tsx"
  "/Users/byronwade/Stratos/src/components/work/equipment-table.tsx"
  "/Users/byronwade/Stratos/src/components/work/materials-table.tsx"
  "/Users/byronwade/Stratos/src/components/work/maintenance-plans-table.tsx"
  "/Users/byronwade/Stratos/src/components/work/service-agreements-table.tsx"
  "/Users/byronwade/Stratos/src/components/work/purchase-orders-table.tsx"
  "/Users/byronwade/Stratos/src/components/work/teams-table.tsx"
  "/Users/byronwade/Stratos/src/components/customers/customers-table.tsx"
  "/Users/byronwade/Stratos/src/components/customers/properties-table.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    # Check if already has the import
    if ! grep -q "useArchiveStore" "$file"; then
      echo "  → Adding useArchiveStore import"
      # This will be done manually with Claude's Edit tool
    else
      echo "  → Already has useArchiveStore import"
    fi
  else
    echo "SKIP: $file does not exist"
  fi
done

echo "Script complete - use Claude Edit tool to apply changes"
