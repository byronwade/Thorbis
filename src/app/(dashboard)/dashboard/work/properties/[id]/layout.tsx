import type { ReactNode } from "react";
import { DetailBackButton } from "@/components/layout/detail-back-button";
import { SectionLayout } from "@/components/layout/section-layout";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Properties Detail Layout - Server Component
 *
 * This layout applies to /dashboard/work/properties/[id]
 * Shows detail page with back button, no sidebars
 *
 * Performance: Pure server component, no client JS needed
 */
export default function PropertiesDetailLayout({
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
      back: (
        <DetailBackButton
          href="/dashboard/work/properties"
          label="Properties"
        />
      ),
      // TODO: Create PropertyDetailToolbar component
      // actions: <PropertyDetailToolbar />,
    },
    sidebar: {
      show: false,
    },
  };

  return (
    <SectionLayout config={config} pathname="/dashboard/work/properties/[id]">
      {children}
    </SectionLayout>
  );
}
