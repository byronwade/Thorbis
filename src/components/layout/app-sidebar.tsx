"use client";

import {
  AudioWaveform,
  BarChart,
  Calendar,
  Command,
  DollarSign,
  GalleryVerticalEnd,
  Home,
  Inbox,
  Mail,
  Megaphone,
  MessageSquare,
  Phone,
  Settings,
  Sparkles,
  Ticket,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLayoutConfig } from "@/components/layout/layout-config-provider";
import { NavChatHistory } from "@/components/layout/nav-chat-history";
import { NavFlexible } from "@/components/layout/nav-flexible";
import { NavGrouped } from "@/components/layout/nav-grouped";
import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useChatStore } from "@/lib/store/chat-store";

// Navigation sections for each route
const navigationSections = {
  today: [
    {
      title: "Today",
      url: "/dashboard",
      icon: Home,
    },
  ],
  communication: [
    {
      title: "Unified Inbox",
      url: "/dashboard/communication",
      icon: Inbox,
    },
    {
      title: "Company Email",
      url: "/dashboard/communication/email",
      icon: Mail,
    },
    {
      title: "Phone System",
      url: "/dashboard/communication/calls",
      icon: Phone,
    },
    {
      title: "Text Messages",
      url: "/dashboard/communication/sms",
      icon: MessageSquare,
    },
    {
      title: "Support Tickets",
      url: "/dashboard/communication/tickets",
      icon: Ticket,
    },
  ],
  work: [
    {
      title: "Work Overview",
      url: "/dashboard/work",
      icon: Wrench,
    },
    {
      title: "Jobs",
      url: "/dashboard/work/jobs",
    },
    {
      title: "Estimates",
      url: "/dashboard/work/estimates",
    },
    {
      title: "Service Tickets",
      url: "/dashboard/work/tickets",
    },
  ],
  schedule: [
    {
      title: "Today's Schedule",
      url: "/dashboard/schedule",
      icon: Calendar,
    },
    {
      title: "Dispatch Board",
      url: "/dashboard/schedule/dispatch",
    },
    {
      title: "Technicians",
      url: "/dashboard/schedule/technicians",
    },
    {
      title: "Route Planning",
      url: "/dashboard/schedule/routes",
    },
    {
      title: "Time Tracking",
      url: "/dashboard/schedule/time",
    },
    {
      title: "Availability",
      url: "/dashboard/schedule/availability",
    },
  ],
  customers: [
    {
      title: "Customer Database",
      url: "/dashboard/customers",
      icon: Users,
    },
    {
      title: "Profiles",
      url: "/dashboard/customers/profiles",
    },
    {
      title: "Service History",
      url: "/dashboard/customers/history",
    },
    {
      title: "Communication",
      url: "/dashboard/customers/communication",
    },
    {
      title: "Reviews & Feedback",
      url: "/dashboard/customers/feedback",
    },
    {
      title: "Portal",
      url: "/dashboard/customers/portal",
    },
  ],
  finance: [
    {
      title: "Financial Dashboard",
      url: "/dashboard/finance",
      icon: DollarSign,
    },
    {
      title: "Invoicing",
      url: "/dashboard/finance/invoicing",
    },
    {
      title: "Payments",
      url: "/dashboard/finance/payments",
    },
    {
      title: "Expenses",
      url: "/dashboard/finance/expenses",
    },
    {
      title: "Payroll",
      url: "/dashboard/finance/payroll",
    },
    {
      title: "Chart of Accounts",
      url: "/dashboard/finance/chart-of-accounts",
    },
    {
      title: "General Ledger",
      url: "/dashboard/finance/general-ledger",
    },
    {
      title: "Accounts Receivable",
      url: "/dashboard/finance/accounts-receivable",
    },
    {
      title: "Accounts Payable",
      url: "/dashboard/finance/accounts-payable",
    },
    {
      title: "Bank Reconciliation",
      url: "/dashboard/finance/bank-reconciliation",
    },
    {
      title: "Journal Entries",
      url: "/dashboard/finance/journal-entries",
    },
    {
      title: "QuickBooks",
      url: "/dashboard/finance/quickbooks",
    },
    {
      title: "Tax",
      url: "/dashboard/finance/tax",
    },
    {
      title: "Budget",
      url: "/dashboard/finance/budget",
    },
  ],
  reports: [
    {
      title: "Business Analytics",
      url: "/dashboard/reports",
      icon: BarChart,
    },
    {
      title: "Performance",
      url: "/dashboard/reports/performance",
    },
    {
      title: "Financial Reports",
      url: "/dashboard/reports/financial",
    },
    {
      title: "Operational Reports",
      url: "/dashboard/reports/operational",
    },
    {
      title: "Customer Reports",
      url: "/dashboard/reports/customers",
    },
    {
      title: "Technician Reports",
      url: "/dashboard/reports/technicians",
    },
    {
      title: "Custom Reports",
      url: "/dashboard/reports/custom",
    },
  ],
  marketing: [
    {
      title: "Lead Management",
      url: "/dashboard/marketing",
      icon: Megaphone,
    },
    {
      title: "Review Management",
      url: "/dashboard/marketing/reviews",
    },
    {
      title: "Marketing Campaigns",
      url: "/dashboard/marketing/campaigns",
    },
    {
      title: "Customer Outreach",
      url: "/dashboard/marketing/outreach",
    },
  ],
  automation: [
    {
      title: "Automation Overview",
      url: "/dashboard/automation",
      icon: Zap,
    },
    {
      title: "Workflows",
      url: "/dashboard/automation/workflows",
    },
    {
      title: "Rules",
      url: "/dashboard/automation/rules",
    },
    {
      title: "Templates",
      url: "/dashboard/automation/templates",
    },
  ],
  ai: [
    {
      label: "AI Assistant",
      items: [
        {
          title: "Stratos Assistant",
          url: "/dashboard/ai",
          icon: Sparkles,
        },
        {
          title: "Search Chats",
          url: "/dashboard/ai/search",
        },
        {
          title: "AI Library",
          url: "/dashboard/ai/library",
        },
        {
          title: "Codex",
          url: "/dashboard/ai/codex",
        },
      ],
    },
    {
      label: "AI Tools",
      items: [
        {
          title: "Smart Suggestions",
          url: "/dashboard/ai/suggestions",
        },
        {
          title: "Automation Rules",
          url: "/dashboard/ai/automation",
        },
        {
          title: "AI Analytics",
          url: "/dashboard/ai/analytics",
        },
      ],
    },
  ],
  settings: [
    {
      label: undefined,
      items: [
        {
          title: "Overview",
          url: "/dashboard/settings",
          icon: Settings,
        },
      ],
    },
    {
      label: "Account",
      items: [
        {
          title: "Personal Info",
          url: "/dashboard/settings/profile/personal",
        },
        {
          title: "Security",
          url: "/dashboard/settings/profile/security",
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/profile/notifications",
        },
        {
          title: "Preferences",
          url: "/dashboard/settings/profile/preferences",
        },
      ],
    },
    {
      label: "Company",
      items: [
        {
          title: "Company Profile",
          url: "/dashboard/settings/company",
        },
        {
          title: "Billing",
          url: "/dashboard/settings/billing",
        },
        {
          title: "Team & Permissions",
          url: "/dashboard/settings/team",
        },
      ],
    },
    {
      label: "Operations",
      items: [
        {
          title: "Booking",
          url: "/dashboard/settings/booking",
        },
        {
          title: "Jobs",
          url: "/dashboard/settings/jobs",
        },
        {
          title: "Customer Intake",
          url: "/dashboard/settings/customer-intake",
        },
        {
          title: "Customer Portal",
          url: "/dashboard/settings/customer-portal",
        },
      ],
    },
    {
      label: "Financial",
      items: [
        {
          title: "Invoices",
          url: "/dashboard/settings/invoices",
        },
        {
          title: "Estimates",
          url: "/dashboard/settings/estimates",
        },
        {
          title: "Price Book",
          url: "/dashboard/settings/pricebook",
        },
        {
          title: "Service Plans",
          url: "/dashboard/settings/service-plans",
        },
        {
          title: "Payroll",
          url: "/dashboard/settings/payroll",
          items: [
            {
              title: "Overview",
              url: "/dashboard/settings/payroll",
            },
            {
              title: "Commission",
              url: "/dashboard/settings/payroll/commission",
            },
            {
              title: "Materials",
              url: "/dashboard/settings/payroll/materials",
            },
            {
              title: "Callbacks",
              url: "/dashboard/settings/payroll/callbacks",
            },
            {
              title: "Bonuses",
              url: "/dashboard/settings/payroll/bonuses",
            },
            {
              title: "Overtime",
              url: "/dashboard/settings/payroll/overtime",
            },
            {
              title: "Deductions",
              url: "/dashboard/settings/payroll/deductions",
            },
            {
              title: "Schedule",
              url: "/dashboard/settings/payroll/schedule",
            },
          ],
        },
      ],
    },
    {
      label: "Marketing",
      items: [
        {
          title: "Marketing Center",
          url: "/dashboard/settings/marketing",
        },
        {
          title: "Communications",
          url: "/dashboard/settings/communications",
        },
      ],
    },
    {
      label: "Data & Tools",
      items: [
        {
          title: "Checklists",
          url: "/dashboard/settings/checklists",
        },
        {
          title: "Job Fields",
          url: "/dashboard/settings/job-fields",
        },
        {
          title: "Tags",
          url: "/dashboard/settings/tags",
        },
        {
          title: "Lead Sources",
          url: "/dashboard/settings/lead-sources",
        },
      ],
    },
    {
      label: "Integrations",
      items: [
        {
          title: "Integration Hub",
          url: "/dashboard/settings/integrations",
        },
        {
          title: "QuickBooks",
          url: "/dashboard/settings/quickbooks",
        },
      ],
    },
  ],
};

// Function to determine current section based on pathname
function getCurrentSection(pathname: string): keyof typeof navigationSections {
  if (pathname === "/dashboard") {
    return "today";
  }
  if (pathname.startsWith("/dashboard/communication")) {
    return "communication";
  }
  if (pathname.startsWith("/dashboard/work")) {
    return "work";
  }
  if (pathname.startsWith("/dashboard/schedule")) {
    return "schedule";
  }
  if (pathname.startsWith("/dashboard/customers")) {
    return "customers";
  }
  if (pathname.startsWith("/dashboard/finance")) {
    return "finance";
  }
  if (pathname.startsWith("/dashboard/reports")) {
    return "reports";
  }
  if (pathname.startsWith("/dashboard/marketing")) {
    return "marketing";
  }
  if (pathname.startsWith("/dashboard/automation")) {
    return "automation";
  }
  if (pathname.startsWith("/dashboard/ai")) {
    return "ai";
  }
  if (pathname.startsWith("/dashboard/settings")) {
    return "settings";
  }

  return "today";
}

// Sample data for team switcher and user
const sampleData = {
  user: {
    name: "John Smith",
    email: "john@example.com",
    avatar: "/placeholder-avatar.jpg",
  },
  teams: [
    {
      name: "Stratos FSM",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Demo Company",
      logo: AudioWaveform,
      plan: "Pro",
    },
    {
      name: "Test Business",
      logo: Command,
      plan: "Free",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const currentSection = getCurrentSection(pathname);
  const navItems = navigationSections[currentSection];
  const [showWhatsNew, setShowWhatsNew] = useState(true);
  const { config: layoutConfig } = useLayoutConfig();

  // Chat store for AI section
  const { cleanupDuplicateChats } = useChatStore();

  // Clean up any duplicate chats on mount
  useEffect(() => {
    cleanupDuplicateChats();
  }, [cleanupDuplicateChats]);

  const isAISection = currentSection === "ai";

  // Use grouped navigation for settings and ai sections
  const useGroupedNav =
    currentSection === "settings" || currentSection === "ai";

  // Check if page has custom sidebar config
  const hasCustomConfig = layoutConfig.sidebar !== undefined;
  const sidebarConfig = layoutConfig.sidebar;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sampleData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {hasCustomConfig ? (
          // Use custom page configuration from layout
          <NavFlexible
            config={sidebarConfig}
            groups={sidebarConfig?.groups}
            items={sidebarConfig?.items}
          />
        ) : useGroupedNav ? (
          // Use default grouped navigation
          <NavGrouped groups={navItems as any} />
        ) : (
          // Use default main navigation
          <NavMain items={navItems as any} />
        )}

        {/* Chat History for AI section */}
        {isAISection && !hasCustomConfig && <NavChatHistory />}
      </SidebarContent>
      <SidebarFooter>
        {showWhatsNew && (
          <div className="group relative flex flex-col gap-2 overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-4 transition-all hover:border-primary/30 hover:shadow-md">
            <Link className="absolute inset-0 z-0" href="/changelog" />
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">What's New</span>
                  <span className="text-muted-foreground text-xs">
                    Version 2.1.0
                  </span>
                </div>
              </div>
              <button
                aria-label="Dismiss"
                className="relative z-20 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background/50 hover:text-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  setShowWhatsNew(false);
                }}
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="relative z-10 text-muted-foreground text-xs leading-relaxed">
              Check out the latest features, improvements, and bug fixes.
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        )}
        <NavUser user={sampleData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
