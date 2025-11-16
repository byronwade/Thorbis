"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";
import { PropertiesToolbarActions } from "@/components/properties/properties-toolbar-actions";
import { AppointmentsToolbarActions } from "@/components/work/appointments-toolbar-actions";
import { ContractToolbarActions } from "@/components/work/contract-toolbar-actions";
import { EstimateToolbarActions } from "@/components/work/estimate-toolbar-actions";
import { InvoicesListToolbarActions } from "@/components/work/invoices-list-toolbar-actions";
import { MaintenancePlanToolbarActions } from "@/components/work/maintenance-plan-toolbar-actions";
import { PaymentsToolbarActions } from "@/components/work/payments-toolbar-actions";
import { PriceBookToolbarActions } from "@/components/work/pricebook-toolbar-actions";
import { PurchaseOrderToolbarActions } from "@/components/work/purchase-order-toolbar-actions";
import { ServiceAgreementToolbarActions } from "@/components/work/service-agreement-toolbar-actions";
import { TeamToolbarActions } from "@/components/work/team-toolbar-actions";
import { VendorToolbarActions } from "@/components/work/vendor-toolbar-actions";
import { WorkToolbarActions } from "@/components/work/work-toolbar-actions";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

type WorkSectionLayoutProps = {
  children: ReactNode;
};

/**
 * Work Section Layout - Client Component
 *
 * Conditionally applies work section layout based on current pathname.
 * Only applies to list pages, not detail pages.
 *
 * This is a client component because we need usePathname() to determine
 * which layout to apply based on the current route.
 */
export function WorkSectionLayout({ children }: WorkSectionLayoutProps) {
  const pathname = usePathname() ?? "";

  // Define list pages that should get the work layout with sidebar
  const listPageConfigs: Record<string, UnifiedLayoutConfig> = {
    "/dashboard/work": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Job Flow",
        subtitle: "81 total jobs today",
        actions: <WorkToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
    "/dashboard/work/invoices": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Invoices",
        subtitle: "Create, track, and manage customer invoices",
        actions: <InvoicesListToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
    "/dashboard/work/appointments": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Appointments",
        subtitle: "Manage customer appointments and schedules",
        actions: <AppointmentsToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
    "/dashboard/work/estimates": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Estimates",
        subtitle: "Create and manage project estimates and quotes",
        actions: <EstimateToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
    "/dashboard/work/payments": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Payments",
        subtitle: "Track and manage customer payments",
        actions: <PaymentsToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
    "/dashboard/work/contracts": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Contracts",
        subtitle: "Create and manage digital contracts and agreements",
        actions: <ContractToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
    "/dashboard/work/maintenance-plans": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Maintenance Plans",
        subtitle: "Manage recurring maintenance contracts and schedules",
        actions: <MaintenancePlanToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
    "/dashboard/work/service-agreements": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Service Agreements",
        subtitle: "Manage customer service contracts and warranties",
        actions: <ServiceAgreementToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
    "/dashboard/work/vendors": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Vendors",
        subtitle: "Manage suppliers you can assign to purchase orders",
        actions: <VendorToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
    "/dashboard/work/pricebook": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Price Book",
        subtitle: "Manage your service catalog and pricing",
        actions: <PriceBookToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
    "/dashboard/work/team": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Team",
        subtitle: "Manage your team members and permissions",
        actions: <TeamToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
    "/dashboard/work/purchase-orders": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Purchase Orders",
        subtitle: "Manage purchase orders and inventory",
        actions: <PurchaseOrderToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
    "/dashboard/work/properties": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Properties",
        subtitle: "Manage customer properties and service locations",
        actions: <PropertiesToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
    "/dashboard/work/materials": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Materials",
        subtitle: "Manage materials and supplies",
        actions: <WorkToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
    "/dashboard/work/equipment": {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
        variant: "default",
        background: "default",
        insetPadding: "none",
      },
      header: { show: true },
      toolbar: {
        show: true,
        title: "Equipment",
        subtitle: "Manage company equipment and assets",
        actions: <WorkToolbarActions />,
      },
      sidebar: { show: true, variant: "standard" },
    },
  };

  // Check if current pathname matches a list page
  const config = listPageConfigs[pathname];

  // If it's a list page, apply the layout
  if (config) {
    return (
      <SectionLayout config={config} pathname={pathname}>
        {children}
      </SectionLayout>
    );
  }

  // Otherwise, just render children (detail pages have their own layouts)
  return <>{children}</>;
}
