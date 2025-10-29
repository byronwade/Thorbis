import {
  ArrowLeft,
  Edit,
  Filter,
  Mail,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommunicationToolbarActions } from "@/components/communication/communication-toolbar-actions";
import { ScheduleToolbarActions } from "@/components/schedule/schedule-toolbar-actions";
import { WorkToolbarActions } from "@/components/work/work-toolbar-actions";
import { ShopToolbarActions } from "@/components/shop/shop-toolbar-actions";

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

/**
 * Get toolbar config for a given route path
 * Returns undefined if no config found (toolbar will show default layout)
 */
export function getToolbarConfig(pathname: string): ToolbarConfig | undefined {
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
    const jobId = jobDetailsMatch[1];
    return {
      title: "Job Details",
      actions: (
        <>
          <Button asChild size="sm" variant="ghost">
            <Link href="/dashboard/work">
              <ArrowLeft className="mr-2 size-4" />
              Back to Jobs
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href={`/dashboard/work/${jobId}/edit`}>
              <Edit className="mr-2 size-4" />
              Edit
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 size-4" />
                Edit Job
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 size-4" />
                Create Invoice
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 size-4" />
                Create Estimate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                Delete Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
