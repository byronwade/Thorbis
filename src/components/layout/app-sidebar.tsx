"use client";

import {
  ArrowLeft,
  AudioWaveform,
  BarChart,
  BookOpen,
  Box,
  Bug,
  Calendar,
  Camera,
  ClipboardList,
  Command,
  DollarSign,
  FileText,
  GalleryVerticalEnd,
  Hash,
  Home,
  Inbox,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Package,
  Paperclip,
  Phone,
  Receipt,
  Settings,
  ShieldCheck,
  Sparkles,
  Ticket,
  User,
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
    {
      title: "Company Feed",
      url: "/dashboard/communication/feed",
      icon: Hash,
    },
  ],
  work: [
    {
      label: "Work Management",
      items: [
        {
          title: "Jobs",
          url: "/dashboard/work",
          icon: ClipboardList,
        },
        {
          title: "Customers",
          url: "/dashboard/customers",
          icon: Users,
        },
      ],
    },
    {
      label: "Financial Documents",
      items: [
        {
          title: "Invoices",
          url: "/dashboard/work/invoices",
          icon: FileText,
        },
        {
          title: "Estimates",
          url: "/dashboard/work/estimates",
          icon: FileText,
        },
        {
          title: "Purchase Orders",
          url: "/dashboard/work/purchase-orders",
          icon: Receipt,
        },
      ],
    },
    {
      label: "Service Management",
      items: [
        {
          title: "Maintenance Plans",
          url: "/dashboard/work/maintenance-plans",
          icon: Wrench,
        },
        {
          title: "Service Agreements",
          url: "/dashboard/work/service-agreements",
          icon: ShieldCheck,
        },
        {
          title: "Service Tickets",
          url: "/dashboard/work/tickets",
          icon: Ticket,
        },
      ],
    },
    {
      label: "Company Resources",
      items: [
        {
          title: "Price Book",
          url: "/dashboard/work/pricebook",
          icon: BookOpen,
          items: [
            {
              title: "Services",
              url: "/dashboard/work/pricebook?tab=services",
            },
            {
              title: "Materials",
              url: "/dashboard/work/pricebook?tab=materials",
            },
          ],
        },
        {
          title: "Materials Inventory",
          url: "/dashboard/work/materials",
          icon: Box,
        },
        {
          title: "Equipment & Tools",
          url: "/dashboard/work/equipment",
          icon: Package,
        },
      ],
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
      label: undefined,
      items: [
        {
          title: "Back to Work",
          url: "/dashboard/work",
          icon: ArrowLeft,
        },
      ],
    },
    {
      label: "Customers",
      items: [
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
      label: "Communication",
      items: [
        {
          title: "Communications",
          url: "/dashboard/settings/communications",
          items: [
            {
              title: "Overview",
              url: "/dashboard/settings/communications",
            },
            {
              title: "Email",
              url: "/dashboard/settings/communications/email",
            },
            {
              title: "SMS & Text",
              url: "/dashboard/settings/communications/sms",
            },
            {
              title: "Phone & Voice",
              url: "/dashboard/settings/communications/phone",
            },
            {
              title: "Notifications",
              url: "/dashboard/settings/communications/notifications",
            },
            {
              title: "Templates",
              url: "/dashboard/settings/communications/templates",
            },
          ],
        },
        {
          title: "Company Feed",
          url: "/dashboard/settings/company-feed",
        },
      ],
    },
    {
      label: "Work",
      items: [
        {
          title: "Jobs",
          url: "/dashboard/settings/jobs",
        },
        {
          title: "Customer Intake",
          url: "/dashboard/settings/customer-intake",
        },
        {
          title: "Booking",
          url: "/dashboard/settings/booking",
        },
        {
          title: "Checklists",
          url: "/dashboard/settings/checklists",
        },
        {
          title: "Job Fields",
          url: "/dashboard/settings/job-fields",
        },
      ],
    },
    {
      label: "Schedule",
      items: [
        {
          title: "Schedule Settings",
          url: "/dashboard/settings/schedule",
          items: [
            {
              title: "Overview",
              url: "/dashboard/settings/schedule",
            },
            {
              title: "Calendar Settings",
              url: "/dashboard/settings/schedule/calendar",
            },
            {
              title: "Availability",
              url: "/dashboard/settings/schedule/availability",
            },
            {
              title: "Service Areas",
              url: "/dashboard/settings/schedule/service-areas",
            },
            {
              title: "Dispatch Rules",
              url: "/dashboard/settings/schedule/dispatch",
            },
            {
              title: "Team Scheduling",
              url: "/dashboard/settings/schedule/team",
            },
          ],
        },
      ],
    },
    {
      label: "Customers",
      items: [
        {
          title: "Customer Settings",
          url: "/dashboard/settings/customers",
          items: [
            {
              title: "Overview",
              url: "/dashboard/settings/customers",
            },
            {
              title: "Preferences",
              url: "/dashboard/settings/customers/preferences",
            },
            {
              title: "Loyalty & Rewards",
              url: "/dashboard/settings/customers/loyalty",
            },
            {
              title: "Notifications",
              url: "/dashboard/settings/customers/notifications",
            },
            {
              title: "Privacy & Consent",
              url: "/dashboard/settings/customers/privacy",
            },
            {
              title: "Custom Fields",
              url: "/dashboard/settings/customers/custom-fields",
            },
          ],
        },
        {
          title: "Customer Portal",
          url: "/dashboard/settings/customer-portal",
        },
        {
          title: "Tags",
          url: "/dashboard/settings/tags",
        },
      ],
    },
    {
      label: "Finances",
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
        {
          title: "Finance",
          url: "/dashboard/settings/finance",
          items: [
            {
              title: "Overview",
              url: "/dashboard/settings/finance",
            },
            {
              title: "Bank Accounts",
              url: "/dashboard/settings/finance/bank-accounts",
            },
            {
              title: "Virtual Buckets",
              url: "/dashboard/settings/finance/virtual-buckets",
            },
            {
              title: "Consumer Financing",
              url: "/dashboard/settings/finance/consumer-financing",
            },
            {
              title: "Business Financing",
              url: "/dashboard/settings/finance/business-financing",
            },
            {
              title: "Bookkeeping",
              url: "/dashboard/settings/finance/bookkeeping",
            },
            {
              title: "Accounting",
              url: "/dashboard/settings/finance/accounting",
            },
            {
              title: "Debit Cards",
              url: "/dashboard/settings/finance/debit-cards",
            },
            {
              title: "Gas Cards",
              url: "/dashboard/settings/finance/gas-cards",
            },
            {
              title: "Gift Cards",
              url: "/dashboard/settings/finance/gift-cards",
            },
          ],
        },
      ],
    },
    {
      label: "Reporting",
      items: [
        {
          title: "Reporting Settings",
          url: "/dashboard/settings/reporting",
          items: [
            {
              title: "Overview",
              url: "/dashboard/settings/reporting",
            },
            {
              title: "Report Templates",
              url: "/dashboard/settings/reporting/templates",
            },
            {
              title: "Scheduled Reports",
              url: "/dashboard/settings/reporting/scheduled",
            },
            {
              title: "Distribution",
              url: "/dashboard/settings/reporting/distribution",
            },
            {
              title: "Metrics & KPIs",
              url: "/dashboard/settings/reporting/metrics",
            },
            {
              title: "Dashboards",
              url: "/dashboard/settings/reporting/dashboards",
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
          title: "Lead Sources",
          url: "/dashboard/settings/lead-sources",
        },
      ],
    },
    {
      label: "Automation",
      items: [
        {
          title: "Automation Settings",
          url: "/dashboard/settings/automation",
          items: [
            {
              title: "Overview",
              url: "/dashboard/settings/automation",
            },
            {
              title: "Workflows",
              url: "/dashboard/settings/automation/workflows",
            },
            {
              title: "Triggers & Actions",
              url: "/dashboard/settings/automation/triggers",
            },
            {
              title: "AI Automation",
              url: "/dashboard/settings/automation/ai",
            },
            {
              title: "Conditional Logic",
              url: "/dashboard/settings/automation/logic",
            },
            {
              title: "Data Filters",
              url: "/dashboard/settings/automation/filters",
            },
          ],
        },
      ],
    },
    {
      label: "System",
      items: [
        {
          title: "Data Import/Export",
          url: "/dashboard/settings/data-import-export",
        },
        {
          title: "Integrations",
          url: "/dashboard/settings/integrations",
        },
        {
          title: "QuickBooks",
          url: "/dashboard/settings/quickbooks",
        },
      ],
    },
    ...(process.env.NODE_ENV === "development"
      ? [
          {
            label: "Development",
            items: [
              {
                title: "Developer Settings",
                url: "/dashboard/settings/development",
                icon: Bug,
                highlight: "yellow" as const,
              },
            ],
          },
        ]
      : []),
  ],
  jobDetails: [
    {
      label: undefined,
      items: [
        {
          title: "Back to Jobs",
          url: "/dashboard/work",
          icon: ArrowLeft,
        },
      ],
    },
    {
      label: "Overview",
      items: [
        {
          title: "Job Details",
          url: "#job-details",
          icon: ClipboardList,
        },
        {
          title: "Timeline",
          url: "#timeline",
          icon: Calendar,
        },
      ],
    },
    {
      label: "Related",
      items: [
        {
          title: "Property",
          url: "#property",
          icon: MapPin,
        },
        {
          title: "Customer",
          url: "#customer",
          icon: User,
        },
      ],
    },
    {
      label: "Financials",
      items: [
        {
          title: "Job Costing",
          url: "#costing",
          icon: DollarSign,
        },
        {
          title: "Profitability",
          url: "#profitability",
          icon: BarChart,
        },
        {
          title: "Invoices",
          url: "#invoices",
          icon: Receipt,
        },
        {
          title: "Estimates",
          url: "#estimates",
          icon: FileText,
        },
      ],
    },
    {
      label: "Activity",
      items: [
        {
          title: "Communications",
          url: "#communications",
          icon: MessageSquare,
        },
        {
          title: "Photo Gallery",
          url: "#photo-gallery",
          icon: Camera,
        },
        {
          title: "Documentation",
          url: "#documents",
          icon: Paperclip,
        },
      ],
    },
  ],
};

// Regex patterns for route matching
const JOB_DETAILS_PATTERN = /^\/dashboard\/work\/[^/]+$/;

// Function to determine current section based on pathname
function getCurrentSection(pathname: string): keyof typeof navigationSections {
  if (pathname === "/dashboard") {
    return "today";
  }
  if (pathname.startsWith("/dashboard/communication")) {
    return "communication";
  }
  // Check for job details page pattern: /dashboard/work/[id]
  if (pathname.match(JOB_DETAILS_PATTERN)) {
    return "jobDetails";
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

  // Use grouped navigation for settings, ai, work, customers, and jobDetails sections
  const useGroupedNav =
    currentSection === "settings" ||
    currentSection === "ai" ||
    currentSection === "work" ||
    currentSection === "customers" ||
    currentSection === "jobDetails";

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
