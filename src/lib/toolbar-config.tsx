import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { CommunicationToolbarActions } from "@/components/communication/communication-toolbar-actions";
import { CustomersToolbarActions } from "@/components/customers/customers-toolbar-actions";
import { ScheduleToolbarActions } from "@/components/schedule/schedule-toolbar-actions";
import { ShopToolbarActions } from "@/components/shop/shop-toolbar-actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InvoiceToolbarActions } from "@/components/work/invoice-toolbar-actions";
import { JobDetailsToolbarActions } from "@/components/work/job-details-toolbar-actions";
import { PriceBookItemToolbarActions } from "@/components/work/pricebook-item-toolbar-actions";
import { PriceBookToolbarActions } from "@/components/work/pricebook-toolbar-actions";
import { PurchaseOrderToolbarActions } from "@/components/work/purchase-order-toolbar-actions";
import { WorkToolbarActions } from "@/components/work/work-toolbar-actions";

type ToolbarConfig = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  showSearch?: boolean;
};

/**
 * Toolbar configurations for different routes
 * Match the most specific route first
 */
export const toolbarConfigs: Record<string, ToolbarConfig> = {
  // Communication routes - uses Zustand store for context-aware actions
  "/dashboard/communication": {
    title: "Communications",
    actions: <CommunicationToolbarActions />,
  },

  // Default dashboard
  "/dashboard": {
    title: "Dashboard",
  },

  // Add more route configs as needed
  "/dashboard/work": {
    title: "Job Flow",
    subtitle: "81 total jobs today",
    actions: <WorkToolbarActions />,
  },
  "/dashboard/work/schedule": {
    title: "Schedule",
    actions: <ScheduleToolbarActions />,
  },
  "/dashboard/work/invoices": {
    title: "Invoices",
    subtitle: "Create, track, and manage customer invoices",
  },
  "/dashboard/work/estimates": {
    title: "Estimates",
    subtitle: "Create and manage customer estimates",
  },
  "/dashboard/work/contracts": {
    title: "Contracts",
    subtitle: "Manage service contracts and agreements",
  },
  "/dashboard/work/pricebook": {
    title: "Price Book",
    subtitle: "Manage services and materials pricing",
    actions: <PriceBookToolbarActions />,
  },
  "/dashboard/work/purchase-orders": {
    title: "Purchase Orders",
    subtitle: "Manage material orders and vendor purchases",
    actions: <PurchaseOrderToolbarActions />,
  },
  "/dashboard/customers": {
    title: "Customers",
    subtitle: "Manage customer relationships and contacts",
    actions: <CustomersToolbarActions />,
  },
  "/dashboard/finances": {
    title: "Finances",
  },
  "/dashboard/marketing": {
    title: "Marketing",
  },
  "/dashboard/automation": {
    title: "Automation",
  },
  "/dashboard/reports": {
    title: "Reports",
  },
  "/dashboard/ai": {
    title: "AI Assistant",
  },
  "/dashboard/settings": {
    title: "Settings",
  },
  "/dashboard/shop": {
    title: "Thorbis Shop",
    subtitle: "Essential tools and supplies for your business",
    actions: <ShopToolbarActions />,
  },
};

// Regex patterns for route matching
// Match only job detail pages with numeric/UUID IDs, not page names like "invoices", "schedule", etc.
// This prevents the job details toolbar from showing on other work pages
const JOB_DETAILS_PATTERN =
  /^\/dashboard\/work\/(?!invoices|schedule|pricebook|estimates|contracts|purchase-orders|maintenance-plans|service-agreements|tickets|materials|equipment)([^/]+)$/;
const PRODUCT_DETAILS_PATTERN = /^\/dashboard\/shop\/([^/]+)$/;
const INVOICE_DETAILS_PATTERN = /^\/dashboard\/work\/invoices\/([^/]+)$/;
const PURCHASE_ORDER_DETAILS_PATTERN = /^\/dashboard\/work\/purchase-orders\/([^/]+)$/;
const PRICEBOOK_DETAILS_PATTERN =
  /^\/dashboard\/work\/pricebook\/(?!new)([^/]+)$/;
const PRICEBOOK_NEW_PATTERN = /^\/dashboard\/work\/pricebook\/new$/;

/**
 * Get toolbar config for a given route path
 * Returns undefined if no config found (toolbar will show default layout)
 */
export function getToolbarConfig(pathname: string): ToolbarConfig | undefined {
  // Check for price book new page pattern: /dashboard/work/pricebook/new
  const pricebookNewMatch = pathname.match(PRICEBOOK_NEW_PATTERN);
  if (pricebookNewMatch) {
    return {
      title: "Add New Item",
      subtitle:
        "Create a new service, material, or package for your price book",
      actions: (
        <Button asChild size="sm" variant="ghost">
          <Link href="/dashboard/work/pricebook">
            <ArrowLeft className="mr-2 size-4" />
            Back to Price Book
          </Link>
        </Button>
      ),
    };
  }

  // Check for price book details page pattern: /dashboard/work/pricebook/[id]
  const pricebookDetailsMatch = pathname.match(PRICEBOOK_DETAILS_PATTERN);
  if (pricebookDetailsMatch) {
    return {
      title: "Price Book Item",
      subtitle: "View and manage price book item details",
      actions: (
        <>
          <Button asChild size="sm" variant="ghost">
            <Link href="/dashboard/work/pricebook">
              <ArrowLeft className="mr-2 size-4" />
              Back to Price Book
            </Link>
          </Button>
          <Separator className="h-6" orientation="vertical" />
          <PriceBookItemToolbarActions />
        </>
      ),
    };
  }

  // Check for purchase order details page pattern: /dashboard/work/purchase-orders/[id]
  const purchaseOrderDetailsMatch = pathname.match(PURCHASE_ORDER_DETAILS_PATTERN);
  if (purchaseOrderDetailsMatch) {
    return {
      title: "Purchase Order Details",
      actions: (
        <>
          <Button asChild size="sm" variant="ghost">
            <Link href="/dashboard/work/purchase-orders">
              <ArrowLeft className="mr-2 size-4" />
              Back to Purchase Orders
            </Link>
          </Button>
        </>
      ),
    };
  }

  // Check for invoice details page pattern: /dashboard/work/invoices/[id]
  const invoiceDetailsMatch = pathname.match(INVOICE_DETAILS_PATTERN);
  if (invoiceDetailsMatch) {
    return {
      title: "Invoice Details",
      actions: (
        <>
          <Button asChild size="sm" variant="ghost">
            <Link href="/dashboard/work/invoices">
              <ArrowLeft className="mr-2 size-4" />
              Back to Invoices
            </Link>
          </Button>
          <Separator className="h-6" orientation="vertical" />
          <InvoiceToolbarActions />
        </>
      ),
    };
  }

  // Check for product details page pattern: /dashboard/shop/[id]
  const productDetailsMatch = pathname.match(PRODUCT_DETAILS_PATTERN);
  if (productDetailsMatch) {
    const productId = productDetailsMatch[1];
    return {
      title: "Product Details",
      actions: (
        <>
          <Button asChild size="sm" variant="ghost">
            <Link href="/dashboard/shop">
              <ArrowLeft className="mr-2 size-4" />
              Back to Shop
            </Link>
          </Button>
          <ShopToolbarActions />
        </>
      ),
    };
  }

  // Check for job details page pattern: /dashboard/work/[id]
  const jobDetailsMatch = pathname.match(JOB_DETAILS_PATTERN);
  if (jobDetailsMatch) {
    return {
      title: "Job Details",
      actions: (
        <>
          <Button asChild size="sm" variant="ghost">
            <Link href="/dashboard/work">
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Link>
          </Button>
          <Separator className="h-6" orientation="vertical" />
          <JobDetailsToolbarActions />
        </>
      ),
    };
  }

  // Try exact match first
  if (toolbarConfigs[pathname]) {
    return toolbarConfigs[pathname];
  }

  // Try to match parent routes by removing trailing segments
  const segments = pathname.split("/").filter(Boolean);
  while (segments.length > 0) {
    const path = `/${segments.join("/")}`;
    if (toolbarConfigs[path]) {
      return toolbarConfigs[path];
    }
    segments.pop();
  }

  return;
}
