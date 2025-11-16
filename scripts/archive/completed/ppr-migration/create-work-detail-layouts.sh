#!/bin/bash

# Script to create missing detail page layouts for work section
# These layouts ensure detail pages don't show sidebars

echo "🔧 Creating missing work detail page layouts..."
echo ""

# Define the detail pages that need layouts
DETAIL_PAGES=(
  "appointments:Appointments:AppointmentDetailToolbar"
  "contracts:Contracts:ContractDetailToolbar"
  "equipment:Equipment:EquipmentDetailToolbar"
  "estimates:Estimates:EstimateDetailToolbar"
  "maintenance-plans:Maintenance Plans:MaintenancePlanDetailToolbar"
  "materials:Materials:MaterialDetailToolbar"
  "payments:Payments:PaymentDetailToolbar"
  "pricebook:Price Book:PriceBookDetailToolbar"
  "properties:Properties:PropertyDetailToolbar"
  "purchase-orders:Purchase Orders:PurchaseOrderDetailToolbar"
  "service-agreements:Service Agreements:ServiceAgreementDetailToolbar"
  "team:Team:TeamMemberDetailToolbar"
  "vendors:Vendors:VendorDetailToolbar"
)

for entry in "${DETAIL_PAGES[@]}"; do
  IFS=':' read -r slug title toolbar <<< "$entry"
  
  LAYOUT_DIR="src/app/(dashboard)/dashboard/work/${slug}/[id]"
  LAYOUT_FILE="${LAYOUT_DIR}/layout.tsx"
  
  if [ -f "$LAYOUT_FILE" ]; then
    echo "✅ ${slug} - layout already exists"
    continue
  fi
  
  if [ ! -d "$LAYOUT_DIR" ]; then
    echo "⚠️  ${slug} - directory doesn't exist, skipping"
    continue
  fi
  
  echo "📝 Creating layout for ${slug}..."
  
  # Create the layout file
  cat > "$LAYOUT_FILE" << EOF
import type { ReactNode } from "react";
import { DetailBackButton } from "@/components/layout/detail-back-button";
import { SectionLayout } from "@/components/layout/section-layout";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * ${title} Detail Layout - Server Component
 *
 * This layout applies to /dashboard/work/${slug}/[id]
 * Shows detail page with back button, no sidebars
 *
 * Performance: Pure server component, no client JS needed
 */
export default function ${title//[ -]/}DetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  const config: UnifiedLayoutConfig = {
    structure: {
      maxWidth: "7xl",
      padding: "lg",
      gap: "none",
      fixedHeight: false,
      variant: "detail",
      background: "default",
      insetPadding: "none",
    },
    header: {
      show: true,
    },
    toolbar: {
      show: true,
      back: <DetailBackButton href="/dashboard/work/${slug}" label="${title}" />,
      // TODO: Create ${toolbar} component
      // actions: <${toolbar} />,
    },
    sidebar: {
      show: false,
    },
  };

  return (
    <SectionLayout config={config} pathname="/dashboard/work/${slug}/[id]">
      {children}
    </SectionLayout>
  );
}
EOF
  
  echo "✅ Created ${LAYOUT_FILE}"
done

echo ""
echo "🎉 Done! All detail page layouts created."
echo ""
echo "📝 Note: Some layouts have TODO comments for toolbar actions."
echo "   These can be implemented as needed."

