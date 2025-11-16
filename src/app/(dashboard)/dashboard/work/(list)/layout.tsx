import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";
import { WorkToolbarActions } from "@/components/work/work-toolbar-actions";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Work List Pages Layout - Server Component
 *
 * This layout applies ONLY to the main work page at /dashboard/work
 * Detail pages (like /dashboard/work/[id]) have their own layouts
 *
 * Performance: Pure server component, no client JS needed
 */
export default function WorkListLayout({ children }: { children: ReactNode }) {
  const config: UnifiedLayoutConfig = {
    structure: {
      maxWidth: "full",
      padding: "none",
      gap: "none",
      fixedHeight: true,
      variant: "default",
      background: "default",
      insetPadding: "none",
    },
    header: {
      show: true,
    },
    toolbar: {
      show: true,
      title: "Job Flow",
      subtitle: "81 total jobs today",
      actions: <WorkToolbarActions />,
    },
    sidebar: {
      show: true,
      variant: "standard",
    },
  };

  return (
    <SectionLayout config={config} pathname="/dashboard/work">
      {children}
    </SectionLayout>
  );
}
