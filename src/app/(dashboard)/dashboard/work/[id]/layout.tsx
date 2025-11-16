import type { ReactNode } from "react";
import { DetailBackButton } from "@/components/layout/detail-back-button";
import { SectionLayout } from "@/components/layout/section-layout";
import { JobDetailToolbarWrapper } from "@/components/work/job-details/job-detail-toolbar-wrapper";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Job Detail Layout - Server Component
 *
 * This layout applies to /dashboard/work/[id] (job detail pages)
 * Shows detail page with back button, no sidebars
 *
 * Performance: Pure server component, no client JS needed
 */
export default function JobDetailLayout({ children }: { children: ReactNode }) {
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
      back: <DetailBackButton href="/dashboard/work" label="Jobs" />,
      actions: <JobDetailToolbarWrapper />,
    },
    sidebar: {
      show: false,
    },
  };

  return (
    <SectionLayout config={config} pathname="/dashboard/work/[id]">
      {children}
    </SectionLayout>
  );
}
