import type { ReactNode } from "react";
import { DetailBackButton } from "@/components/layout/detail-back-button";
import { SectionLayout } from "@/components/layout/section-layout";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Payments Detail Layout - Server Component
 *
 * This layout applies to /dashboard/work/payments/[id]
 * Shows detail page with back button, no sidebars
 *
 * Performance: Pure server component, no client JS needed
 */
export default function PaymentsDetailLayout({
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
        <DetailBackButton href="/dashboard/work/payments" label="Payments" />
      ),
      // TODO: Create PaymentDetailToolbar component
      // actions: <PaymentDetailToolbar />,
    },
    sidebar: {
      show: false,
    },
  };

  return (
    <SectionLayout config={config} pathname="/dashboard/work/payments/[id]">
      {children}
    </SectionLayout>
  );
}
