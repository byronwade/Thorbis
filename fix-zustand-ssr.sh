#!/bin/bash

# Fix Zustand SSR Issues - Add skipHydration to all persisted stores
# This allows Next.js to generate static pages without hydration errors

echo "🔧 Adding skipHydration to Zustand stores..."

stores=(
  "src/lib/stores/job-creation-store.ts"
  "src/lib/stores/call-preferences-store.ts"
  "src/lib/stores/customers-store.ts"
  "src/lib/stores/equipment-store.ts"
  "src/lib/stores/invoice-layout-store.ts"
  "src/lib/stores/payments-store.ts"
  "src/lib/stores/pricebook-store.ts"
  "src/lib/stores/job-details-layout-store.ts"
  "src/lib/stores/activity-timeline-store.ts"
  "src/lib/stores/reporting-store.ts"
  "src/lib/stores/role-store.ts"
)

for store in "${stores[@]}"; do
  if [ -f "$store" ]; then
    # Check if skipHydration already exists
    if grep -q "skipHydration" "$store"; then
      echo "✓ $store already has skipHydration"
    else
      echo "→ Adding skipHydration to $store"

      # Add skipHydration: true before the closing brace of persist options
      # Look for patterns like:
      #   {
      #     name: "...",
      #     ...
      #   }
      # And add skipHydration: true before the closing }

      # This uses a more robust approach - find the persist config block
      # and add skipHydration before its closing brace
      sed -i '' '/persist(/,/^[[:space:]]*}[[:space:]]*)/{
        /^[[:space:]]*}[[:space:]]*)/i\
        // PERFORMANCE: Skip hydration to prevent SSR mismatches\
        // Allows Next.js to generate static pages without Zustand errors\
        skipHydration: true,
      }' "$store"

      echo "✓ Updated $store"
    fi
  else
    echo "✗ File not found: $store"
  fi
done

echo ""
echo "✅ Zustand SSR fixes complete!"
echo "Now you can remove output: 'standalone' from next.config.ts"
