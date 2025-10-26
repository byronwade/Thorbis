import { Filter, Mail, Plus, Search } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ToolbarConfig = {
  title: string;
  actions?: ReactNode;
  showSearch?: boolean;
};

/**
 * Toolbar configurations for different routes
 * Match the most specific route first
 */
export const toolbarConfigs: Record<string, ToolbarConfig> = {
  // Communication routes
  "/dashboard/communication": {
    title: "Communications",
    actions: (
      <>
        <Button size="sm" variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        <Button size="sm">
          <Mail className="mr-2 h-4 w-4" />
          Compose
        </Button>
      </>
    ),
  },
  "/dashboard/communication/email": {
    title: "Company Email",
    actions: (
      <>
        <Button size="sm" variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        <Button size="sm">
          <Mail className="mr-2 h-4 w-4" />
          Compose
        </Button>
      </>
    ),
  },
  "/dashboard/communication/calls": {
    title: "Phone System",
    actions: (
      <Button size="sm">
        <Plus className="mr-2 h-4 w-4" />
        New Call
      </Button>
    ),
  },
  "/dashboard/communication/sms": {
    title: "Text Messages",
    actions: (
      <>
        <Button size="sm" variant="outline">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </>
    ),
  },
  "/dashboard/communication/tickets": {
    title: "Support Tickets",
    actions: (
      <Button size="sm">
        <Plus className="mr-2 h-4 w-4" />
        New Ticket
      </Button>
    ),
  },

  // Default dashboard
  "/dashboard": {
    title: "Dashboard",
  },

  // Add more route configs as needed
  "/dashboard/work": {
    title: "Work",
  },
  "/dashboard/schedule": {
    title: "Schedule",
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
};

/**
 * Get toolbar config for a given route path
 * Returns undefined if no config found (toolbar will show default layout)
 */
export function getToolbarConfig(pathname: string): ToolbarConfig | undefined {
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
