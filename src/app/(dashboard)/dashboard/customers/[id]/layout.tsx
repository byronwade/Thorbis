import type { ReactNode } from "react";
import { CustomerDetailToolbar } from "@/components/customers/customer-detail-toolbar";
import { DetailBackButton } from "@/components/layout/detail-back-button";
import { SectionLayout } from "@/components/layout/section-layout";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Customer Detail Layout - Server Component
 *
 * This layout applies to /dashboard/customers/[id]
 * Shows detail page with back button, no sidebars
 */
export default function CustomerDetailLayout({
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
      back: <DetailBackButton href="/dashboard/customers" label="Customers" />,
      actions: <CustomerDetailToolbar />,
    },
    sidebar: {
      show: false,
    },
  };

  return (
    <SectionLayout config={config} pathname="/dashboard/customers/[id]">
      {children}
    </SectionLayout>
  );
}
