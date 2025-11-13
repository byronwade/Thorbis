"use client";

/**
 * Reporting Sidebar Navigation - Client Component
 *
 * Features:
 * - Collapsible preset report groups
 * - Custom reports with delete on hover (like AI chat)
 * - Active state management
 * - Mobile responsive
 */

import { ChevronRight, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  reportingSelectors,
  useReportingStore,
} from "@/lib/stores/reporting-store";

type ReportItem = {
  title: string;
  href: string;
  badge?: string;
};

type ReportGroup = {
  label: string;
  items: ReportItem[];
  defaultOpen?: boolean;
};

// Preset report groups
const presetReportGroups: ReportGroup[] = [
  {
    label: "Quick Access",
    items: [
      { title: "Overview", href: "/dashboard/reporting" },
      {
        title: "Executive Dashboard",
        href: "/dashboard/reporting/executive",
        badge: "Premium",
      },
      { title: "Custom Reports", href: "/dashboard/reporting/custom" },
    ],
    defaultOpen: true,
  },
  {
    label: "AI & Intelligence",
    items: [
      {
        title: "AI Performance Metrics",
        href: "/dashboard/reporting/ai/performance",
        badge: "New",
      },
      {
        title: "Conversation Analytics",
        href: "/dashboard/reporting/ai/conversations",
      },
      {
        title: "Sentiment Analysis",
        href: "/dashboard/reporting/ai/sentiment",
      },
      { title: "AI Response Quality", href: "/dashboard/reporting/ai/quality" },
      {
        title: "Training Data Insights",
        href: "/dashboard/reporting/ai/training",
      },
      { title: "AI Cost Analysis", href: "/dashboard/reporting/ai/costs" },
      {
        title: "Automation Success Rate",
        href: "/dashboard/reporting/ai/automation",
      },
    ],
    defaultOpen: false,
  },
  {
    label: "Communication Analytics",
    items: [
      {
        title: "Phone Call Reports",
        href: "/dashboard/reporting/communication/calls",
        badge: "Popular",
      },
      {
        title: "Call Duration & Volume",
        href: "/dashboard/reporting/communication/call-metrics",
      },
      {
        title: "Call Recordings",
        href: "/dashboard/reporting/communication/call-recordings",
      },
      {
        title: "Text Message Analytics",
        href: "/dashboard/reporting/communication/sms",
      },
      {
        title: "Email Campaigns",
        href: "/dashboard/reporting/communication/email",
      },
      {
        title: "Email Open & Click Rates",
        href: "/dashboard/reporting/communication/email-metrics",
      },
      {
        title: "Support Ticket Analysis",
        href: "/dashboard/reporting/communication/tickets",
      },
      {
        title: "Response Time Metrics",
        href: "/dashboard/reporting/communication/response-time",
      },
      {
        title: "Customer Satisfaction",
        href: "/dashboard/reporting/communication/satisfaction",
      },
      {
        title: "Channel Performance",
        href: "/dashboard/reporting/communication/channels",
      },
    ],
    defaultOpen: false,
  },
  {
    label: "Financial Reports",
    items: [
      {
        title: "Profit & Loss",
        href: "/dashboard/reporting/finance/profit-loss",
        badge: "Essential",
      },
      {
        title: "Revenue Analysis",
        href: "/dashboard/reporting/finance/revenue",
      },
      {
        title: "Expense Breakdown",
        href: "/dashboard/reporting/finance/expenses",
      },
      {
        title: "Cash Flow Reports",
        href: "/dashboard/reporting/finance/cash-flow",
      },
      {
        title: "Invoice Aging",
        href: "/dashboard/reporting/finance/invoice-aging",
      },
      {
        title: "Payment Analytics",
        href: "/dashboard/reporting/finance/payments",
      },
      { title: "Tax Reports", href: "/dashboard/reporting/finance/tax" },
      {
        title: "Budget vs Actual",
        href: "/dashboard/reporting/finance/budget",
      },
      {
        title: "Job Profitability",
        href: "/dashboard/reporting/finance/job-profitability",
      },
      {
        title: "Customer Lifetime Value",
        href: "/dashboard/reporting/finance/ltv",
      },
      { title: "Accounts Receivable", href: "/dashboard/reporting/finance/ar" },
      { title: "Accounts Payable", href: "/dashboard/reporting/finance/ap" },
    ],
    defaultOpen: false,
  },
  {
    label: "Operations & Jobs",
    items: [
      {
        title: "Job Performance",
        href: "/dashboard/reporting/operations/jobs",
        badge: "Popular",
      },
      {
        title: "Service Type Analysis",
        href: "/dashboard/reporting/operations/service-types",
      },
      {
        title: "Completion Rates",
        href: "/dashboard/reporting/operations/completion",
      },
      {
        title: "Schedule Efficiency",
        href: "/dashboard/reporting/operations/schedule",
      },
      {
        title: "Dispatch Analytics",
        href: "/dashboard/reporting/operations/dispatch",
      },
      {
        title: "Route Optimization",
        href: "/dashboard/reporting/operations/routes",
      },
      {
        title: "Equipment Utilization",
        href: "/dashboard/reporting/operations/equipment",
      },
      {
        title: "Materials Usage",
        href: "/dashboard/reporting/operations/materials",
      },
      {
        title: "Inventory Turnover",
        href: "/dashboard/reporting/operations/inventory",
      },
      {
        title: "Warranty Claims",
        href: "/dashboard/reporting/operations/warranty",
      },
    ],
    defaultOpen: false,
  },
  {
    label: "Team Performance",
    items: [
      {
        title: "Technician Leaderboard",
        href: "/dashboard/reporting/team/leaderboard",
        badge: "Popular",
      },
      {
        title: "Individual Performance",
        href: "/dashboard/reporting/team/individual",
      },
      {
        title: "Team Productivity",
        href: "/dashboard/reporting/team/productivity",
      },
      {
        title: "Revenue Per Technician",
        href: "/dashboard/reporting/team/revenue",
      },
      {
        title: "Jobs Completed",
        href: "/dashboard/reporting/team/jobs-completed",
      },
      { title: "Customer Ratings", href: "/dashboard/reporting/team/ratings" },
      {
        title: "Time Tracking",
        href: "/dashboard/reporting/team/time-tracking",
      },
      {
        title: "Attendance & Availability",
        href: "/dashboard/reporting/team/attendance",
      },
      {
        title: "Training Completion",
        href: "/dashboard/reporting/team/training",
      },
      {
        title: "Certifications",
        href: "/dashboard/reporting/team/certifications",
      },
      {
        title: "Commission Reports",
        href: "/dashboard/reporting/team/commission",
      },
      { title: "Bonus Tracking", href: "/dashboard/reporting/team/bonus" },
    ],
    defaultOpen: false,
  },
  {
    label: "Customer Analytics",
    items: [
      {
        title: "Customer Acquisition",
        href: "/dashboard/reporting/customers/acquisition",
      },
      {
        title: "Retention Rates",
        href: "/dashboard/reporting/customers/retention",
      },
      { title: "Churn Analysis", href: "/dashboard/reporting/customers/churn" },
      {
        title: "Customer Segments",
        href: "/dashboard/reporting/customers/segments",
      },
      {
        title: "Service History",
        href: "/dashboard/reporting/customers/service-history",
      },
      {
        title: "Repeat Business",
        href: "/dashboard/reporting/customers/repeat",
      },
      {
        title: "Referral Sources",
        href: "/dashboard/reporting/customers/referrals",
      },
      {
        title: "Customer Geography",
        href: "/dashboard/reporting/customers/geography",
      },
      {
        title: "Demographics",
        href: "/dashboard/reporting/customers/demographics",
      },
    ],
    defaultOpen: false,
  },
  {
    label: "Marketing & Growth",
    items: [
      {
        title: "Campaign Performance",
        href: "/dashboard/reporting/marketing/campaigns",
        badge: "New",
      },
      {
        title: "Lead Generation",
        href: "/dashboard/reporting/marketing/leads",
      },
      {
        title: "Lead Conversion",
        href: "/dashboard/reporting/marketing/conversion",
      },
      { title: "ROI Analysis", href: "/dashboard/reporting/marketing/roi" },
      {
        title: "Website Analytics",
        href: "/dashboard/reporting/marketing/website",
      },
      {
        title: "Social Media Metrics",
        href: "/dashboard/reporting/marketing/social",
      },
      {
        title: "Review Analysis",
        href: "/dashboard/reporting/marketing/reviews",
      },
      { title: "Ad Performance", href: "/dashboard/reporting/marketing/ads" },
      { title: "SEO Rankings", href: "/dashboard/reporting/marketing/seo" },
    ],
    defaultOpen: false,
  },
  {
    label: "Scheduling & Dispatch",
    items: [
      {
        title: "Schedule Utilization",
        href: "/dashboard/reporting/schedule/utilization",
      },
      {
        title: "First-Time Fix Rate",
        href: "/dashboard/reporting/schedule/first-time-fix",
      },
      {
        title: "Callback Analysis",
        href: "/dashboard/reporting/schedule/callbacks",
      },
      {
        title: "Travel Time Analysis",
        href: "/dashboard/reporting/schedule/travel-time",
      },
      {
        title: "Same-Day Bookings",
        href: "/dashboard/reporting/schedule/same-day",
      },
      {
        title: "Appointment Types",
        href: "/dashboard/reporting/schedule/appointment-types",
      },
      { title: "No-Show Rate", href: "/dashboard/reporting/schedule/no-shows" },
      {
        title: "Rescheduling Trends",
        href: "/dashboard/reporting/schedule/rescheduling",
      },
    ],
    defaultOpen: false,
  },
  {
    label: "Maintenance & Agreements",
    items: [
      {
        title: "Active Agreements",
        href: "/dashboard/reporting/maintenance/active",
      },
      {
        title: "Renewal Rates",
        href: "/dashboard/reporting/maintenance/renewals",
      },
      {
        title: "Service Plan Revenue",
        href: "/dashboard/reporting/maintenance/revenue",
      },
      {
        title: "Maintenance Schedule",
        href: "/dashboard/reporting/maintenance/schedule",
      },
      {
        title: "Preventive Maintenance",
        href: "/dashboard/reporting/maintenance/preventive",
      },
      {
        title: "Agreement Profitability",
        href: "/dashboard/reporting/maintenance/profitability",
      },
    ],
    defaultOpen: false,
  },
  {
    label: "Inventory & Materials",
    items: [
      { title: "Stock Levels", href: "/dashboard/reporting/inventory/stock" },
      { title: "Material Costs", href: "/dashboard/reporting/inventory/costs" },
      {
        title: "Reorder Trends",
        href: "/dashboard/reporting/inventory/reorder",
      },
      {
        title: "Supplier Performance",
        href: "/dashboard/reporting/inventory/suppliers",
      },
      { title: "Part Usage", href: "/dashboard/reporting/inventory/usage" },
      {
        title: "Dead Stock Analysis",
        href: "/dashboard/reporting/inventory/dead-stock",
      },
    ],
    defaultOpen: false,
  },
  {
    label: "Compliance & Safety",
    items: [
      {
        title: "Licensing Status",
        href: "/dashboard/reporting/compliance/licensing",
      },
      {
        title: "Insurance Coverage",
        href: "/dashboard/reporting/compliance/insurance",
      },
      {
        title: "Certification Tracking",
        href: "/dashboard/reporting/compliance/certifications",
      },
      {
        title: "Safety Incidents",
        href: "/dashboard/reporting/compliance/safety",
      },
      {
        title: "OSHA Compliance",
        href: "/dashboard/reporting/compliance/osha",
      },
      {
        title: "Audit Reports",
        href: "/dashboard/reporting/compliance/audits",
      },
    ],
    defaultOpen: false,
  },
  {
    label: "Advanced Analytics",
    items: [
      {
        title: "Predictive Insights",
        href: "/dashboard/reporting/analytics/predictive",
        badge: "Premium",
      },
      {
        title: "Trend Analysis",
        href: "/dashboard/reporting/analytics/trends",
      },
      {
        title: "Seasonality Reports",
        href: "/dashboard/reporting/analytics/seasonality",
      },
      {
        title: "Forecasting",
        href: "/dashboard/reporting/analytics/forecasting",
      },
      {
        title: "Benchmark Comparisons",
        href: "/dashboard/reporting/analytics/benchmarks",
      },
      {
        title: "What-If Analysis",
        href: "/dashboard/reporting/analytics/what-if",
      },
    ],
    defaultOpen: false,
  },
  {
    label: "Export & Sharing",
    items: [
      {
        title: "Scheduled Reports",
        href: "/dashboard/reporting/export/scheduled",
      },
      {
        title: "Report Templates",
        href: "/dashboard/reporting/export/templates",
      },
      { title: "Data Export", href: "/dashboard/reporting/export/data" },
      { title: "Share Reports", href: "/dashboard/reporting/export/share" },
      { title: "Report History", href: "/dashboard/reporting/export/history" },
    ],
    defaultOpen: false,
  },
];

export function ReportingSidebarNav() {
  const pathname = usePathname();
  const customReports = useReportingStore(reportingSelectors.customReports);
  const { deleteCustomReport, setIsCreatingReport } = useReportingStore();

  const handleDeleteReport = (e: React.MouseEvent, reportId: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteCustomReport(reportId);
  };

  const handleCreateReport = () => {
    // In real app, this would open a modal or navigate to report builder
    setIsCreatingReport(true);
    console.log("Create new report");
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Preset Reports - Collapsible Groups */}
      {presetReportGroups.map((group, index) => (
        <Collapsible defaultOpen={group.defaultOpen} key={group.label}>
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="group/collapsible flex w-full items-center justify-between rounded-md px-2 py-1.5 font-medium text-xs transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                {group.label}
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <span className="flex-1 truncate">{item.title}</span>
                          {item.badge && (
                            <span
                              className="ml-auto flex size-2 rounded-full bg-primary"
                              title={item.badge}
                            />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      ))}

      {/* Custom Reports Section */}
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center justify-between">
          <span>My Custom Reports</span>
          <button
            className="flex h-5 w-5 items-center justify-center rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleCreateReport}
            title="Create new report"
            type="button"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </SidebarGroupLabel>
        <SidebarMenu>
          {customReports.length === 0 ? (
            <div className="px-2 py-4 text-center text-muted-foreground text-xs">
              No custom reports yet
            </div>
          ) : (
            customReports.map((report) => {
              const isActive = pathname === report.href;
              return (
                <SidebarMenuItem key={report.id}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={report.href}>
                      <span className="flex-1 truncate text-left">
                        {report.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuAction
                    aria-label="Delete report"
                    onClick={(e) => handleDeleteReport(e, report.id)}
                    showOnHover
                    title="Delete report"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              );
            })
          )}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  );
}
