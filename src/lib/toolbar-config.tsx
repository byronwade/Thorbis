import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { CommunicationToolbarActions } from "@/components/communication/communication-toolbar-actions";
import { ScheduleToolbarActions } from "@/components/schedule/schedule-toolbar-actions";
import { ShopToolbarActions } from "@/components/shop/shop-toolbar-actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InvoiceToolbarActions } from "@/components/work/invoice-toolbar-actions";
import { JobDetailsToolbarActions } from "@/components/work/job-details-toolbar-actions";
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
  "/dashboard/customers": {
    title: "Customers",
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
const JOB_DETAILS_PATTERN = /^\/dashboard\/work\/([^/]+)$/;
const PRODUCT_DETAILS_PATTERN = /^\/dashboard\/shop\/([^/]+)$/;
const INVOICE_DETAILS_PATTERN = /^\/dashboard\/work\/invoices\/([^/]+)$/;

/**
 * Get toolbar config for a given route path
 * Returns undefined if no config found (toolbar will show default layout)
 */
export function getToolbarConfig(pathname: string): ToolbarConfig | undefined {
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
