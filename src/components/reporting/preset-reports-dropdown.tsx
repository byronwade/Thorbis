"use client";

/**
 * Preset Reports Dropdown - Client Component
 *
 * Displays all preset reports in a compact dropdown menu
 * Organized by category with search functionality
 */

import { ChevronRight, FileBarChart, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type PresetReport = {
  title: string;
  href: string;
  badge?: string;
};

type ReportCategory = {
  label: string;
  items: PresetReport[];
};

const presetReports: ReportCategory[] = [
  {
    label: "Quick Access",
    items: [
      { title: "Overview", href: "/dashboard/reporting" },
      { title: "Executive Dashboard", href: "/dashboard/reporting/executive", badge: "Premium" },
      { title: "Custom Reports Builder", href: "/dashboard/reporting/custom" },
    ],
  },
  {
    label: "AI & Intelligence",
    items: [
      { title: "AI Performance Metrics", href: "/dashboard/reporting/ai/performance", badge: "New" },
      { title: "Conversation Analytics", href: "/dashboard/reporting/ai/conversations" },
      { title: "Sentiment Analysis", href: "/dashboard/reporting/ai/sentiment" },
      { title: "AI Response Quality", href: "/dashboard/reporting/ai/quality" },
      { title: "Training Data Insights", href: "/dashboard/reporting/ai/training" },
      { title: "AI Cost Analysis", href: "/dashboard/reporting/ai/costs" },
      { title: "Automation Success Rate", href: "/dashboard/reporting/ai/automation" },
    ],
  },
  {
    label: "Communication Analytics",
    items: [
      { title: "Phone Call Reports", href: "/dashboard/reporting/communication/calls", badge: "Popular" },
      { title: "Call Duration & Volume", href: "/dashboard/reporting/communication/call-metrics" },
      { title: "Call Recordings", href: "/dashboard/reporting/communication/call-recordings" },
      { title: "Text Message Analytics", href: "/dashboard/reporting/communication/sms" },
      { title: "Email Campaigns", href: "/dashboard/reporting/communication/email" },
      { title: "Email Metrics", href: "/dashboard/reporting/communication/email-metrics" },
      { title: "Support Tickets", href: "/dashboard/reporting/communication/tickets" },
      { title: "Response Times", href: "/dashboard/reporting/communication/response-time" },
      { title: "Customer Satisfaction", href: "/dashboard/reporting/communication/satisfaction" },
      { title: "Channel Performance", href: "/dashboard/reporting/communication/channels" },
    ],
  },
  {
    label: "Financial Reports",
    items: [
      { title: "Profit & Loss", href: "/dashboard/reporting/finance/profit-loss", badge: "Essential" },
      { title: "Revenue Analysis", href: "/dashboard/reporting/finance/revenue" },
      { title: "Expense Breakdown", href: "/dashboard/reporting/finance/expenses" },
      { title: "Cash Flow", href: "/dashboard/reporting/finance/cash-flow" },
      { title: "Invoice Aging", href: "/dashboard/reporting/finance/invoice-aging" },
      { title: "Payment Analytics", href: "/dashboard/reporting/finance/payments" },
      { title: "Tax Reports", href: "/dashboard/reporting/finance/tax" },
      { title: "Budget vs Actual", href: "/dashboard/reporting/finance/budget" },
      { title: "Job Profitability", href: "/dashboard/reporting/finance/job-profitability" },
      { title: "Customer LTV", href: "/dashboard/reporting/finance/ltv" },
      { title: "Accounts Receivable", href: "/dashboard/reporting/finance/ar" },
      { title: "Accounts Payable", href: "/dashboard/reporting/finance/ap" },
    ],
  },
  {
    label: "Operations & Jobs",
    items: [
      { title: "Job Performance", href: "/dashboard/reporting/operations/jobs", badge: "Popular" },
      { title: "Service Types", href: "/dashboard/reporting/operations/service-types" },
      { title: "Completion Rates", href: "/dashboard/reporting/operations/completion" },
      { title: "Schedule Efficiency", href: "/dashboard/reporting/operations/schedule" },
      { title: "Dispatch Analytics", href: "/dashboard/reporting/operations/dispatch" },
      { title: "Route Optimization", href: "/dashboard/reporting/operations/routes" },
      { title: "Equipment Usage", href: "/dashboard/reporting/operations/equipment" },
      { title: "Materials Usage", href: "/dashboard/reporting/operations/materials" },
      { title: "Inventory Turnover", href: "/dashboard/reporting/operations/inventory" },
      { title: "Warranty Claims", href: "/dashboard/reporting/operations/warranty" },
    ],
  },
  {
    label: "Team Performance",
    items: [
      { title: "Technician Leaderboard", href: "/dashboard/reporting/team/leaderboard", badge: "Popular" },
      { title: "Individual Performance", href: "/dashboard/reporting/team/individual" },
      { title: "Team Productivity", href: "/dashboard/reporting/team/productivity" },
      { title: "Revenue Per Tech", href: "/dashboard/reporting/team/revenue" },
      { title: "Jobs Completed", href: "/dashboard/reporting/team/jobs-completed" },
      { title: "Customer Ratings", href: "/dashboard/reporting/team/ratings" },
      { title: "Time Tracking", href: "/dashboard/reporting/team/time-tracking" },
      { title: "Attendance", href: "/dashboard/reporting/team/attendance" },
      { title: "Training", href: "/dashboard/reporting/team/training" },
      { title: "Certifications", href: "/dashboard/reporting/team/certifications" },
      { title: "Commissions", href: "/dashboard/reporting/team/commission" },
      { title: "Bonuses", href: "/dashboard/reporting/team/bonus" },
    ],
  },
  {
    label: "Customer Analytics",
    items: [
      { title: "Acquisition", href: "/dashboard/reporting/customers/acquisition" },
      { title: "Retention", href: "/dashboard/reporting/customers/retention" },
      { title: "Churn Analysis", href: "/dashboard/reporting/customers/churn" },
      { title: "Segments", href: "/dashboard/reporting/customers/segments" },
      { title: "Service History", href: "/dashboard/reporting/customers/service-history" },
      { title: "Repeat Business", href: "/dashboard/reporting/customers/repeat" },
      { title: "Referrals", href: "/dashboard/reporting/customers/referrals" },
      { title: "Geography", href: "/dashboard/reporting/customers/geography" },
      { title: "Demographics", href: "/dashboard/reporting/customers/demographics" },
    ],
  },
  {
    label: "Marketing & Growth",
    items: [
      { title: "Campaigns", href: "/dashboard/reporting/marketing/campaigns", badge: "New" },
      { title: "Lead Generation", href: "/dashboard/reporting/marketing/leads" },
      { title: "Conversions", href: "/dashboard/reporting/marketing/conversion" },
      { title: "ROI Analysis", href: "/dashboard/reporting/marketing/roi" },
      { title: "Website Analytics", href: "/dashboard/reporting/marketing/website" },
      { title: "Social Media", href: "/dashboard/reporting/marketing/social" },
      { title: "Reviews", href: "/dashboard/reporting/marketing/reviews" },
      { title: "Ad Performance", href: "/dashboard/reporting/marketing/ads" },
      { title: "SEO Rankings", href: "/dashboard/reporting/marketing/seo" },
    ],
  },
  {
    label: "Scheduling & Dispatch",
    items: [
      { title: "Utilization", href: "/dashboard/reporting/schedule/utilization" },
      { title: "First-Time Fix", href: "/dashboard/reporting/schedule/first-time-fix" },
      { title: "Callbacks", href: "/dashboard/reporting/schedule/callbacks" },
      { title: "Travel Time", href: "/dashboard/reporting/schedule/travel-time" },
      { title: "Same-Day Bookings", href: "/dashboard/reporting/schedule/same-day" },
      { title: "Appointment Types", href: "/dashboard/reporting/schedule/appointment-types" },
      { title: "No-Shows", href: "/dashboard/reporting/schedule/no-shows" },
      { title: "Rescheduling", href: "/dashboard/reporting/schedule/rescheduling" },
    ],
  },
  {
    label: "Maintenance & Agreements",
    items: [
      { title: "Active Agreements", href: "/dashboard/reporting/maintenance/active" },
      { title: "Renewals", href: "/dashboard/reporting/maintenance/renewals" },
      { title: "Revenue", href: "/dashboard/reporting/maintenance/revenue" },
      { title: "Schedule", href: "/dashboard/reporting/maintenance/schedule" },
      { title: "Preventive", href: "/dashboard/reporting/maintenance/preventive" },
      { title: "Profitability", href: "/dashboard/reporting/maintenance/profitability" },
    ],
  },
  {
    label: "Inventory & Materials",
    items: [
      { title: "Stock Levels", href: "/dashboard/reporting/inventory/stock" },
      { title: "Costs", href: "/dashboard/reporting/inventory/costs" },
      { title: "Reorder Trends", href: "/dashboard/reporting/inventory/reorder" },
      { title: "Suppliers", href: "/dashboard/reporting/inventory/suppliers" },
      { title: "Part Usage", href: "/dashboard/reporting/inventory/usage" },
      { title: "Dead Stock", href: "/dashboard/reporting/inventory/dead-stock" },
    ],
  },
  {
    label: "Compliance & Safety",
    items: [
      { title: "Licensing", href: "/dashboard/reporting/compliance/licensing" },
      { title: "Insurance", href: "/dashboard/reporting/compliance/insurance" },
      { title: "Certifications", href: "/dashboard/reporting/compliance/certifications" },
      { title: "Safety Incidents", href: "/dashboard/reporting/compliance/safety" },
      { title: "OSHA", href: "/dashboard/reporting/compliance/osha" },
      { title: "Audits", href: "/dashboard/reporting/compliance/audits" },
    ],
  },
  {
    label: "Advanced Analytics",
    items: [
      { title: "Predictive Insights", href: "/dashboard/reporting/analytics/predictive", badge: "Premium" },
      { title: "Trends", href: "/dashboard/reporting/analytics/trends" },
      { title: "Seasonality", href: "/dashboard/reporting/analytics/seasonality" },
      { title: "Forecasting", href: "/dashboard/reporting/analytics/forecasting" },
      { title: "Benchmarks", href: "/dashboard/reporting/analytics/benchmarks" },
      { title: "What-If Analysis", href: "/dashboard/reporting/analytics/what-if" },
    ],
  },
  {
    label: "Export & Sharing",
    items: [
      { title: "Scheduled Reports", href: "/dashboard/reporting/export/scheduled" },
      { title: "Templates", href: "/dashboard/reporting/export/templates" },
      { title: "Data Export", href: "/dashboard/reporting/export/data" },
      { title: "Share", href: "/dashboard/reporting/export/share" },
      { title: "History", href: "/dashboard/reporting/export/history" },
    ],
  },
];

export function PresetReportsDropdown() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter reports based on search
  const filteredReports = presetReports.map((category) => ({
    ...category,
    items: category.items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.items.length > 0);

  const handleNavigate = (href: string) => {
    router.push(href);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-md px-2 py-2",
            "text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          type="button"
        >
          <div className="flex items-center gap-2">
            <FileBarChart className="h-4 w-4" />
            <span>Browse Preset Reports</span>
          </div>
          <ChevronRight className={cn("h-4 w-4 transition-transform", open && "rotate-90")} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[320px]" align="start" side="right">
        {/* Search */}
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-9 pl-8"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <DropdownMenuSeparator />

        {/* Report Categories */}
        <ScrollArea className="h-[400px]">
          {filteredReports.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No reports found
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredReports.map((category) => (
                <div key={category.label} className="relative flex w-full min-w-0 flex-col p-2">
                  {/* Match SidebarGroupLabel styling */}
                  <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs text-muted-foreground font-medium">
                    {category.label}
                  </div>
                  {/* Report items */}
                  <div className="flex flex-col gap-0.5">
                    {category.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <button
                          key={item.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md p-2 text-left outline-hidden transition-all",
                            "focus-visible:ring-2 focus-visible:ring-ring",
                            "hover:bg-accent hover:text-accent-foreground",
                            "h-[30px] w-full border border-transparent text-[0.8rem] font-medium",
                            isActive && "bg-accent border-accent font-medium text-accent-foreground"
                          )}
                          onClick={() => handleNavigate(item.href)}
                          type="button"
                        >
                          <span className="flex-1 truncate">{item.title}</span>
                          {item.badge && (
                            <span
                              className="ml-auto flex size-2 rounded-full bg-blue-500"
                              title={item.badge}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <DropdownMenuSeparator />
        <div className="p-2 text-center text-xs text-muted-foreground">
          {presetReports.reduce((sum, cat) => sum + cat.items.length, 0)} preset reports available
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
