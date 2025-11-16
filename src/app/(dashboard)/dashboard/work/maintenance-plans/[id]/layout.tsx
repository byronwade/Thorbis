import type { ReactNode } from "react";
import { DetailBackButton } from "@/components/layout/detail-back-button";
import { SectionLayout } from "@/components/layout/section-layout";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Maintenance Plans Detail Layout - Server Component
 *
 * This layout applies to /dashboard/work/maintenance-plans/[id]
 * Shows detail page with back button, no sidebars
 *
 * Performance: Pure server component, no client JS needed
 */
export default function MaintenancePlansDetailLayout({
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
          href="/dashboard/work/maintenance-plans"
          label="Maintenance Plans"
        />
      ),
      // TODO: Create MaintenancePlanDetailToolbar component
      // actions: <MaintenancePlanDetailToolbar />,
    },
    sidebar: {
      show: false,
    },
  };

  return (
    <SectionLayout
      config={config}
      pathname="/dashboard/work/maintenance-plans/[id]"
    >
      {children}
    </SectionLayout>
  );
}
