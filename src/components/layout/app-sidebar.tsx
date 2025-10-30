"use client";

import {
  Archive,
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpFromLine,
  BadgeCheck,
  BarChart,
  Book,
  BookOpen,
  Box,
  Briefcase,
  Bug,
  Building2,
  Calculator,
  Calendar,
  Camera,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  FileEdit,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Globe,
  GraduationCap,
  Hash,
  Home,
  Inbox,
  List,
  Mail,
  MailOpen,
  MapPin,
  Megaphone,
  MessageSquare,
  Package,
  Palette,
  Paperclip,
  Phone,
  QrCode,
  Receipt,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Target,
  Ticket,
  Trash,
  TrendingUp,
  Trophy,
  User,
  UserPlus,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NavChatHistory } from "@/components/layout/nav-chat-history";
import { NavFlexible } from "@/components/layout/nav-flexible";
import { NavGrouped } from "@/components/layout/nav-grouped";
import { NavMain } from "@/components/layout/nav-main";
import { ReportingSidebarNav } from "@/components/reporting/reporting-sidebar-nav-v2";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { JobDetailsNav } from "@/components/work/job-details/job-details-nav";
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
      label: "Inbox",
      items: [
        {
          title: "All Messages",
          url: "/dashboard/communication",
          icon: Inbox,
        },
        {
          title: "Unread",
          url: "/dashboard/communication/unread",
          icon: MailOpen,
        },
        {
          title: "Starred",
          url: "/dashboard/communication/starred",
          icon: Star,
        },
        {
          title: "Archive",
          url: "/dashboard/communication/archive",
          icon: Archive,
        },
        {
          title: "Trash",
          url: "/dashboard/communication/trash",
          icon: Trash,
        },
        {
          title: "Spam",
          url: "/dashboard/communication/spam",
          icon: ShieldAlert,
        },
      ],
    },
    {
      label: "Teams",
      items: [
        {
          title: "General",
          url: "/dashboard/communication/teams/general",
          icon: Hash,
        },
        {
          title: "Sales",
          url: "/dashboard/communication/teams/sales",
          icon: Hash,
        },
        {
          title: "Support",
          url: "/dashboard/communication/teams/support",
          icon: Hash,
        },
        {
          title: "Technicians",
          url: "/dashboard/communication/teams/technicians",
          icon: Hash,
        },
        {
          title: "Management",
          url: "/dashboard/communication/teams/management",
          icon: Hash,
        },
      ],
    },
    {
      label: "Channels",
      items: [
        {
          title: "Email",
          url: "/dashboard/communication/email",
          icon: Mail,
        },
        {
          title: "Phone & VoIP",
          url: "/dashboard/communication/calls",
          icon: Phone,
        },
        {
          title: "SMS & Text",
          url: "/dashboard/communication/sms",
          icon: MessageSquare,
        },
        {
          title: "Support Tickets",
          url: "/dashboard/communication/tickets",
          icon: Ticket,
        },
      ],
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
          title: "Schedule",
          url: "/dashboard/work/schedule",
          icon: Calendar,
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
          title: "Contracts",
          url: "/dashboard/work/contracts",
          icon: FileSignature,
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
      label: "Overview",
      items: [
        {
          title: "Banking",
          url: "/dashboard/finance",
          icon: Building2,
        },
        {
          title: "Cash Flow",
          url: "/dashboard/finance/cash-flow",
          icon: TrendingUp,
        },
        {
          title: "Payments",
          url: "/dashboard/finance/payments",
          icon: CreditCard,
        },
        {
          title: "Reports",
          url: "/dashboard/finance/reports",
          icon: FileText,
        },
      ],
    },
    {
      label: "Expenses",
      items: [
        {
          title: "Expenses",
          url: "/dashboard/finance/expenses",
          icon: Receipt,
        },
        {
          title: "Debit Cards",
          url: "/dashboard/finance/debit-cards",
          icon: CreditCard,
        },
        {
          title: "Credit Cards",
          url: "/dashboard/finance/credit-cards",
          icon: CreditCard,
        },
      ],
    },
    {
      label: "Bookkeeping",
      items: [
        {
          title: "Bookkeeping",
          url: "/dashboard/finance/bookkeeping",
          icon: Book,
        },
        {
          title: "Bank Reconciliation",
          url: "/dashboard/finance/bank-reconciliation",
          icon: CheckCircle2,
        },
        {
          title: "Journal Entries",
          url: "/dashboard/finance/journal-entries",
          icon: FileEdit,
        },
      ],
    },
    {
      label: "Accounting",
      items: [
        {
          title: "Accounting",
          url: "/dashboard/finance/accounting",
          icon: Calculator,
        },
        {
          title: "Chart of Accounts",
          url: "/dashboard/finance/chart-of-accounts",
          icon: List,
        },
        {
          title: "General Ledger",
          url: "/dashboard/finance/general-ledger",
          icon: BookOpen,
        },
        {
          title: "Accounts Receivable",
          url: "/dashboard/finance/accounts-receivable",
          icon: ArrowDownToLine,
        },
        {
          title: "Accounts Payable",
          url: "/dashboard/finance/accounts-payable",
          icon: ArrowUpFromLine,
        },
        {
          title: "QuickBooks",
          url: "/dashboard/finance/quickbooks",
          icon: Building2,
        },
      ],
    },
    {
      label: "Payroll & Taxes",
      items: [
        {
          title: "Payroll",
          url: "/dashboard/finance/payroll",
          icon: Users,
        },
        {
          title: "Taxes",
          url: "/dashboard/finance/tax",
          icon: FileText,
        },
      ],
    },
    {
      label: "Financing",
      items: [
        {
          title: "Business Financing",
          url: "/dashboard/finance/business-financing",
          icon: Building2,
        },
        {
          title: "Consumer Financing",
          url: "/dashboard/finance/consumer-financing",
          icon: Users,
        },
      ],
    },
    {
      label: "Planning",
      items: [
        {
          title: "Budget",
          url: "/dashboard/finance/budget",
          icon: Target,
        },
      ],
    },
  ],
  reporting: [
    {
      label: "Sections",
      items: [
        {
          title: "Overview",
          url: "/dashboard/reporting",
          icon: BarChart,
        },
        {
          title: "Executive Dashboard",
          url: "/dashboard/reporting/executive",
          icon: TrendingUp,
        },
        {
          title: "AI Insights",
          url: "/dashboard/reporting/ai",
          icon: Sparkles,
        },
        {
          title: "Communication",
          url: "/dashboard/reporting/communication",
          icon: MessageSquare,
        },
        {
          title: "Finance",
          url: "/dashboard/reporting/finance",
          icon: DollarSign,
        },
        {
          title: "Operations",
          url: "/dashboard/reporting/operations",
          icon: Wrench,
        },
        {
          title: "Team Performance",
          url: "/dashboard/reporting/team",
          icon: Users,
        },
        {
          title: "Custom Reports",
          url: "/dashboard/reporting/custom",
          icon: FileEdit,
        },
      ],
    },
    {
      label: "AI & Intelligence",
      items: [
        {
          title: "AI Performance Metrics",
          url: "/dashboard/reporting/ai/performance",
          icon: Sparkles,
        },
        {
          title: "Conversation Analytics",
          url: "/dashboard/reporting/ai/conversations",
          icon: MessageSquare,
        },
        {
          title: "Sentiment Analysis",
          url: "/dashboard/reporting/ai/sentiment",
          icon: Target,
        },
        {
          title: "AI Response Quality",
          url: "/dashboard/reporting/ai/quality",
          icon: BadgeCheck,
        },
        {
          title: "Training Data Insights",
          url: "/dashboard/reporting/ai/training",
          icon: BookOpen,
        },
        {
          title: "AI Cost Analysis",
          url: "/dashboard/reporting/ai/costs",
          icon: DollarSign,
        },
        {
          title: "Automation Success Rate",
          url: "/dashboard/reporting/ai/automation",
          icon: Zap,
        },
      ],
    },
    {
      label: "Communication Analytics",
      items: [
        {
          title: "Phone Call Reports",
          url: "/dashboard/reporting/communication/calls",
          icon: Phone,
        },
        {
          title: "Call Duration & Volume",
          url: "/dashboard/reporting/communication/call-metrics",
          icon: BarChart,
        },
        {
          title: "Call Recordings",
          url: "/dashboard/reporting/communication/call-recordings",
          icon: Archive,
        },
        {
          title: "Text Message Analytics",
          url: "/dashboard/reporting/communication/sms",
          icon: MessageSquare,
        },
        {
          title: "Email Campaigns",
          url: "/dashboard/reporting/communication/email",
          icon: Mail,
        },
        {
          title: "Email Open & Click Rates",
          url: "/dashboard/reporting/communication/email-metrics",
          icon: BarChart,
        },
        {
          title: "Support Ticket Analysis",
          url: "/dashboard/reporting/communication/tickets",
          icon: Ticket,
        },
        {
          title: "Response Time Metrics",
          url: "/dashboard/reporting/communication/response-time",
          icon: Clock,
        },
        {
          title: "Customer Satisfaction",
          url: "/dashboard/reporting/communication/satisfaction",
          icon: Star,
        },
        {
          title: "Channel Performance",
          url: "/dashboard/reporting/communication/channels",
          icon: TrendingUp,
        },
      ],
    },
    {
      label: "Financial Reports",
      items: [
        {
          title: "Profit & Loss",
          url: "/dashboard/reporting/finance/profit-loss",
          icon: DollarSign,
        },
        {
          title: "Revenue Analysis",
          url: "/dashboard/reporting/finance/revenue",
          icon: TrendingUp,
        },
        {
          title: "Expense Breakdown",
          url: "/dashboard/reporting/finance/expenses",
          icon: Receipt,
        },
        {
          title: "Cash Flow Reports",
          url: "/dashboard/reporting/finance/cash-flow",
          icon: ArrowUpFromLine,
        },
        {
          title: "Invoice Aging",
          url: "/dashboard/reporting/finance/invoice-aging",
          icon: FileText,
        },
        {
          title: "Payment Analytics",
          url: "/dashboard/reporting/finance/payments",
          icon: CreditCard,
        },
        {
          title: "Tax Reports",
          url: "/dashboard/reporting/finance/tax",
          icon: FileSpreadsheet,
        },
        {
          title: "Budget vs Actual",
          url: "/dashboard/reporting/finance/budget",
          icon: Target,
        },
        {
          title: "Job Profitability",
          url: "/dashboard/reporting/finance/job-profitability",
          icon: BarChart,
        },
        {
          title: "Customer Lifetime Value",
          url: "/dashboard/reporting/finance/ltv",
          icon: Users,
        },
        {
          title: "Accounts Receivable",
          url: "/dashboard/reporting/finance/ar",
          icon: ArrowDownToLine,
        },
        {
          title: "Accounts Payable",
          url: "/dashboard/reporting/finance/ap",
          icon: ArrowUpFromLine,
        },
      ],
    },
    {
      label: "Operations & Jobs",
      items: [
        {
          title: "Job Performance",
          url: "/dashboard/reporting/operations/jobs",
          icon: ClipboardList,
        },
        {
          title: "Service Type Analysis",
          url: "/dashboard/reporting/operations/service-types",
          icon: Wrench,
        },
        {
          title: "Completion Rates",
          url: "/dashboard/reporting/operations/completion",
          icon: CheckCircle2,
        },
        {
          title: "Schedule Efficiency",
          url: "/dashboard/reporting/operations/schedule",
          icon: Calendar,
        },
        {
          title: "Dispatch Analytics",
          url: "/dashboard/reporting/operations/dispatch",
          icon: MapPin,
        },
        {
          title: "Route Optimization",
          url: "/dashboard/reporting/operations/routes",
          icon: MapPin,
        },
        {
          title: "Equipment Utilization",
          url: "/dashboard/reporting/operations/equipment",
          icon: Box,
        },
        {
          title: "Materials Usage",
          url: "/dashboard/reporting/operations/materials",
          icon: Package,
        },
        {
          title: "Inventory Turnover",
          url: "/dashboard/reporting/operations/inventory",
          icon: Archive,
        },
        {
          title: "Warranty Claims",
          url: "/dashboard/reporting/operations/warranty",
          icon: ShieldCheck,
        },
      ],
    },
    {
      label: "Team Performance",
      items: [
        {
          title: "Technician Leaderboard",
          url: "/dashboard/reporting/team/leaderboard",
          icon: Trophy,
        },
        {
          title: "Individual Performance",
          url: "/dashboard/reporting/team/individual",
          icon: User,
        },
        {
          title: "Team Productivity",
          url: "/dashboard/reporting/team/productivity",
          icon: TrendingUp,
        },
        {
          title: "Revenue Per Technician",
          url: "/dashboard/reporting/team/revenue",
          icon: DollarSign,
        },
        {
          title: "Jobs Completed",
          url: "/dashboard/reporting/team/jobs-completed",
          icon: CheckCircle2,
        },
        {
          title: "Customer Ratings",
          url: "/dashboard/reporting/team/ratings",
          icon: Star,
        },
        {
          title: "Time Tracking",
          url: "/dashboard/reporting/team/time-tracking",
          icon: Clock,
        },
        {
          title: "Attendance & Availability",
          url: "/dashboard/reporting/team/attendance",
          icon: Calendar,
        },
        {
          title: "Training Completion",
          url: "/dashboard/reporting/team/training",
          icon: GraduationCap,
        },
        {
          title: "Certifications",
          url: "/dashboard/reporting/team/certifications",
          icon: BadgeCheck,
        },
        {
          title: "Commission Reports",
          url: "/dashboard/reporting/team/commission",
          icon: DollarSign,
        },
        {
          title: "Bonus Tracking",
          url: "/dashboard/reporting/team/bonus",
          icon: Star,
        },
      ],
    },
    {
      label: "Customer Analytics",
      items: [
        {
          title: "Customer Acquisition",
          url: "/dashboard/reporting/customers/acquisition",
          icon: Users,
        },
        {
          title: "Retention Rates",
          url: "/dashboard/reporting/customers/retention",
          icon: TrendingUp,
        },
        {
          title: "Churn Analysis",
          url: "/dashboard/reporting/customers/churn",
          icon: ArrowDownToLine,
        },
        {
          title: "Customer Segments",
          url: "/dashboard/reporting/customers/segments",
          icon: List,
        },
        {
          title: "Service History",
          url: "/dashboard/reporting/customers/service-history",
          icon: ClipboardList,
        },
        {
          title: "Repeat Business",
          url: "/dashboard/reporting/customers/repeat",
          icon: TrendingUp,
        },
        {
          title: "Referral Sources",
          url: "/dashboard/reporting/customers/referrals",
          icon: Users,
        },
        {
          title: "Customer Geography",
          url: "/dashboard/reporting/customers/geography",
          icon: MapPin,
        },
        {
          title: "Demographics",
          url: "/dashboard/reporting/customers/demographics",
          icon: BarChart,
        },
      ],
    },
    {
      label: "Marketing & Growth",
      items: [
        {
          title: "Campaign Performance",
          url: "/dashboard/reporting/marketing/campaigns",
          icon: Megaphone,
        },
        {
          title: "Lead Generation",
          url: "/dashboard/reporting/marketing/leads",
          icon: Target,
        },
        {
          title: "Lead Conversion",
          url: "/dashboard/reporting/marketing/conversion",
          icon: TrendingUp,
        },
        {
          title: "ROI Analysis",
          url: "/dashboard/reporting/marketing/roi",
          icon: DollarSign,
        },
        {
          title: "Website Analytics",
          url: "/dashboard/reporting/marketing/website",
          icon: BarChart,
        },
        {
          title: "Social Media Metrics",
          url: "/dashboard/reporting/marketing/social",
          icon: MessageSquare,
        },
        {
          title: "Review Analysis",
          url: "/dashboard/reporting/marketing/reviews",
          icon: Star,
        },
        {
          title: "Ad Performance",
          url: "/dashboard/reporting/marketing/ads",
          icon: Megaphone,
        },
        {
          title: "SEO Rankings",
          url: "/dashboard/reporting/marketing/seo",
          icon: TrendingUp,
        },
      ],
    },
    {
      label: "Scheduling & Dispatch",
      items: [
        {
          title: "Schedule Utilization",
          url: "/dashboard/reporting/schedule/utilization",
          icon: Calendar,
        },
        {
          title: "First-Time Fix Rate",
          url: "/dashboard/reporting/schedule/first-time-fix",
          icon: CheckCircle2,
        },
        {
          title: "Callback Analysis",
          url: "/dashboard/reporting/schedule/callbacks",
          icon: Phone,
        },
        {
          title: "Travel Time Analysis",
          url: "/dashboard/reporting/schedule/travel-time",
          icon: MapPin,
        },
        {
          title: "Same-Day Bookings",
          url: "/dashboard/reporting/schedule/same-day",
          icon: Calendar,
        },
        {
          title: "Appointment Types",
          url: "/dashboard/reporting/schedule/appointment-types",
          icon: ClipboardList,
        },
        {
          title: "No-Show Rate",
          url: "/dashboard/reporting/schedule/no-shows",
          icon: X,
        },
        {
          title: "Rescheduling Trends",
          url: "/dashboard/reporting/schedule/rescheduling",
          icon: Calendar,
        },
      ],
    },
    {
      label: "Maintenance & Agreements",
      items: [
        {
          title: "Active Agreements",
          url: "/dashboard/reporting/maintenance/active",
          icon: FileText,
        },
        {
          title: "Renewal Rates",
          url: "/dashboard/reporting/maintenance/renewals",
          icon: TrendingUp,
        },
        {
          title: "Service Plan Revenue",
          url: "/dashboard/reporting/maintenance/revenue",
          icon: DollarSign,
        },
        {
          title: "Maintenance Schedule",
          url: "/dashboard/reporting/maintenance/schedule",
          icon: Calendar,
        },
        {
          title: "Preventive Maintenance",
          url: "/dashboard/reporting/maintenance/preventive",
          icon: Shield,
        },
        {
          title: "Agreement Profitability",
          url: "/dashboard/reporting/maintenance/profitability",
          icon: BarChart,
        },
      ],
    },
    {
      label: "Inventory & Materials",
      items: [
        {
          title: "Stock Levels",
          url: "/dashboard/reporting/inventory/stock",
          icon: Package,
        },
        {
          title: "Material Costs",
          url: "/dashboard/reporting/inventory/costs",
          icon: DollarSign,
        },
        {
          title: "Reorder Trends",
          url: "/dashboard/reporting/inventory/reorder",
          icon: TrendingUp,
        },
        {
          title: "Supplier Performance",
          url: "/dashboard/reporting/inventory/suppliers",
          icon: Building2,
        },
        {
          title: "Part Usage",
          url: "/dashboard/reporting/inventory/usage",
          icon: BarChart,
        },
        {
          title: "Dead Stock Analysis",
          url: "/dashboard/reporting/inventory/dead-stock",
          icon: Trash,
        },
      ],
    },
    {
      label: "Compliance & Safety",
      items: [
        {
          title: "Licensing Status",
          url: "/dashboard/reporting/compliance/licensing",
          icon: BadgeCheck,
        },
        {
          title: "Insurance Coverage",
          url: "/dashboard/reporting/compliance/insurance",
          icon: Shield,
        },
        {
          title: "Certification Tracking",
          url: "/dashboard/reporting/compliance/certifications",
          icon: GraduationCap,
        },
        {
          title: "Safety Incidents",
          url: "/dashboard/reporting/compliance/safety",
          icon: ShieldAlert,
        },
        {
          title: "OSHA Compliance",
          url: "/dashboard/reporting/compliance/osha",
          icon: ShieldCheck,
        },
        {
          title: "Audit Reports",
          url: "/dashboard/reporting/compliance/audits",
          icon: FileText,
        },
      ],
    },
    {
      label: "Advanced Analytics",
      items: [
        {
          title: "Predictive Insights",
          url: "/dashboard/reporting/analytics/predictive",
          icon: Sparkles,
        },
        {
          title: "Trend Analysis",
          url: "/dashboard/reporting/analytics/trends",
          icon: TrendingUp,
        },
        {
          title: "Seasonality Reports",
          url: "/dashboard/reporting/analytics/seasonality",
          icon: Calendar,
        },
        {
          title: "Forecasting",
          url: "/dashboard/reporting/analytics/forecasting",
          icon: BarChart,
        },
        {
          title: "Benchmark Comparisons",
          url: "/dashboard/reporting/analytics/benchmarks",
          icon: Target,
        },
        {
          title: "What-If Analysis",
          url: "/dashboard/reporting/analytics/what-if",
          icon: Calculator,
        },
      ],
    },
    {
      label: "Export & Sharing",
      items: [
        {
          title: "Scheduled Reports",
          url: "/dashboard/reporting/export/scheduled",
          icon: Calendar,
        },
        {
          title: "Report Templates",
          url: "/dashboard/reporting/export/templates",
          icon: FileText,
        },
        {
          title: "Data Export",
          url: "/dashboard/reporting/export/data",
          icon: ArrowDownToLine,
        },
        {
          title: "Share Reports",
          url: "/dashboard/reporting/export/share",
          icon: Users,
        },
        {
          title: "Report History",
          url: "/dashboard/reporting/export/history",
          icon: Archive,
        },
      ],
    },
  ],
  marketing: [
    {
      label: "Overview",
      items: [
        {
          title: "Marketing Dashboard",
          url: "/dashboard/marketing",
          icon: Megaphone,
        },
        {
          title: "Campaign Performance",
          url: "/dashboard/marketing/performance",
          icon: TrendingUp,
        },
        {
          title: "Lead Analytics",
          url: "/dashboard/marketing/analytics",
          icon: BarChart,
        },
      ],
    },
    {
      label: "Lead Sources",
      items: [
        {
          title: "All Leads",
          url: "/dashboard/marketing/leads",
          icon: Users,
        },
        {
          title: "Thumbtack",
          url: "/dashboard/marketing/leads/thumbtack",
          icon: Target,
        },
        {
          title: "Angi (Angie's List)",
          url: "/dashboard/marketing/leads/angi",
          icon: CheckCircle2,
        },
        {
          title: "Google Local Services",
          url: "/dashboard/marketing/leads/google-local",
          icon: Search,
        },
        {
          title: "Yelp",
          url: "/dashboard/marketing/leads/yelp",
          icon: Star,
        },
        {
          title: "HomeAdvisor",
          url: "/dashboard/marketing/leads/homeadvisor",
          icon: Home,
        },
        {
          title: "Website Leads",
          url: "/dashboard/marketing/leads/website",
          icon: Globe,
        },
      ],
    },
    {
      label: "Paid Advertising",
      items: [
        {
          title: "Google Ads",
          url: "/dashboard/marketing/ads/google",
          icon: Search,
          items: [
            {
              title: "Campaigns",
              url: "/dashboard/marketing/ads/google/campaigns",
            },
            {
              title: "Performance Max",
              url: "/dashboard/marketing/ads/google/performance-max",
            },
            {
              title: "Search Ads",
              url: "/dashboard/marketing/ads/google/search",
            },
            {
              title: "Local Services Ads",
              url: "/dashboard/marketing/ads/google/local-services",
            },
            {
              title: "Analytics & Reports",
              url: "/dashboard/marketing/ads/google/analytics",
            },
          ],
        },
        {
          title: "Facebook & Instagram Ads",
          url: "/dashboard/marketing/ads/facebook",
          icon: Camera,
          items: [
            {
              title: "Campaigns",
              url: "/dashboard/marketing/ads/facebook/campaigns",
            },
            {
              title: "Ad Sets",
              url: "/dashboard/marketing/ads/facebook/ad-sets",
            },
            {
              title: "Creative Library",
              url: "/dashboard/marketing/ads/facebook/creative",
            },
            {
              title: "Audience Targeting",
              url: "/dashboard/marketing/ads/facebook/audiences",
            },
            {
              title: "Performance",
              url: "/dashboard/marketing/ads/facebook/performance",
            },
          ],
        },
        {
          title: "Nextdoor Ads",
          url: "/dashboard/marketing/ads/nextdoor",
          icon: MapPin,
        },
        {
          title: "Bing Ads",
          url: "/dashboard/marketing/ads/bing",
          icon: Search,
        },
      ],
    },
    {
      label: "Organic Marketing",
      items: [
        {
          title: "Google Business Profile",
          url: "/dashboard/marketing/organic/google-business",
          icon: Search,
        },
        {
          title: "SEO Management",
          url: "/dashboard/marketing/organic/seo",
          icon: TrendingUp,
        },
        {
          title: "Content Marketing",
          url: "/dashboard/marketing/organic/content",
          icon: FileText,
        },
        {
          title: "Blog Posts",
          url: "/dashboard/marketing/organic/blog",
          icon: BookOpen,
        },
      ],
    },
    {
      label: "Social Media",
      items: [
        {
          title: "Social Hub",
          url: "/dashboard/marketing/social",
          icon: MessageSquare,
        },
        {
          title: "Facebook",
          url: "/dashboard/marketing/social/facebook",
          icon: MessageSquare,
        },
        {
          title: "Instagram",
          url: "/dashboard/marketing/social/instagram",
          icon: Camera,
        },
        {
          title: "LinkedIn",
          url: "/dashboard/marketing/social/linkedin",
          icon: Briefcase,
        },
        {
          title: "X (Twitter)",
          url: "/dashboard/marketing/social/twitter",
          icon: Hash,
        },
        {
          title: "Post Scheduler",
          url: "/dashboard/marketing/social/scheduler",
          icon: Calendar,
        },
      ],
    },
    {
      label: "Review Management",
      items: [
        {
          title: "All Reviews",
          url: "/dashboard/marketing/reviews",
          icon: Star,
        },
        {
          title: "Google Reviews",
          url: "/dashboard/marketing/reviews/google",
          icon: Search,
        },
        {
          title: "Yelp Reviews",
          url: "/dashboard/marketing/reviews/yelp",
          icon: Star,
        },
        {
          title: "Facebook Reviews",
          url: "/dashboard/marketing/reviews/facebook",
          icon: MessageSquare,
        },
        {
          title: "Angi Reviews",
          url: "/dashboard/marketing/reviews/angi",
          icon: CheckCircle2,
        },
        {
          title: "Thumbtack Reviews",
          url: "/dashboard/marketing/reviews/thumbtack",
          icon: Target,
        },
        {
          title: "Review Requests",
          url: "/dashboard/marketing/reviews/requests",
          icon: Mail,
        },
        {
          title: "Review Responses",
          url: "/dashboard/marketing/reviews/responses",
          icon: MessageSquare,
        },
      ],
    },
    {
      label: "Email Marketing",
      items: [
        {
          title: "Email Campaigns",
          url: "/dashboard/marketing/email/campaigns",
          icon: Mail,
        },
        {
          title: "Newsletters",
          url: "/dashboard/marketing/email/newsletters",
          icon: MailOpen,
        },
        {
          title: "Email Templates",
          url: "/dashboard/marketing/email/templates",
          icon: FileText,
        },
        {
          title: "Subscriber Lists",
          url: "/dashboard/marketing/email/lists",
          icon: List,
        },
        {
          title: "Automation Workflows",
          url: "/dashboard/marketing/email/automation",
          icon: Zap,
        },
      ],
    },
    {
      label: "Customer Outreach",
      items: [
        {
          title: "Outreach Dashboard",
          url: "/dashboard/marketing/outreach",
          icon: Megaphone,
        },
        {
          title: "Seasonal Campaigns",
          url: "/dashboard/marketing/outreach/seasonal",
          icon: Calendar,
        },
        {
          title: "Referral Program",
          url: "/dashboard/marketing/outreach/referrals",
          icon: Users,
        },
        {
          title: "Loyalty Program",
          url: "/dashboard/marketing/outreach/loyalty",
          icon: Trophy,
        },
        {
          title: "Promotions & Offers",
          url: "/dashboard/marketing/outreach/promotions",
          icon: Tag,
        },
      ],
    },
    {
      label: "Lead Management",
      items: [
        {
          title: "Lead Pipeline",
          url: "/dashboard/marketing/lead-pipeline",
          icon: ClipboardList,
        },
        {
          title: "Lead Scoring",
          url: "/dashboard/marketing/lead-scoring",
          icon: Target,
        },
        {
          title: "Lead Assignment",
          url: "/dashboard/marketing/lead-assignment",
          icon: UserPlus,
        },
        {
          title: "Lead Nurturing",
          url: "/dashboard/marketing/lead-nurturing",
          icon: TrendingUp,
        },
      ],
    },
    {
      label: "Marketing Tools",
      items: [
        {
          title: "Landing Pages",
          url: "/dashboard/marketing/tools/landing-pages",
          icon: FileText,
        },
        {
          title: "QR Codes",
          url: "/dashboard/marketing/tools/qr-codes",
          icon: QrCode,
        },
        {
          title: "Marketing Materials",
          url: "/dashboard/marketing/tools/materials",
          icon: Package,
        },
        {
          title: "Brand Assets",
          url: "/dashboard/marketing/tools/brand-assets",
          icon: Palette,
        },
      ],
    },
  ],
  shop: [
    {
      label: "Categories",
      items: [
        {
          title: "All Products",
          url: "/dashboard/shop",
          icon: ShoppingCart,
          badge: "8",
        },
        {
          title: "Payment Hardware",
          url: "/dashboard/shop?category=hardware",
          icon: CreditCard,
          badge: "3",
        },
        {
          title: "Uniforms & Apparel",
          url: "/dashboard/shop?category=apparel",
          icon: User,
          badge: "1",
        },
        {
          title: "Tools & Equipment",
          url: "/dashboard/shop?category=tools",
          icon: Wrench,
          badge: "1",
        },
        {
          title: "Office Supplies",
          url: "/dashboard/shop?category=supplies",
          icon: Paperclip,
          badge: "1",
        },
        {
          title: "Marketing Materials",
          url: "/dashboard/shop?category=marketing",
          icon: Megaphone,
          badge: "2",
        },
      ],
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
          title: "Thorbis Assistant",
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
          title: "Automation",
          url: "/dashboard/ai/automation",
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
          title: "Teams & Channels",
          url: "/dashboard/settings/teams-channels",
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
  ],
  tools: [
    {
      label: "Marketing & Social",
      items: [
        {
          title: "Google Business Profile",
          url: "/tools/marketing/google-business",
          icon: Search,
        },
        {
          title: "Local Services Ads",
          url: "/tools/marketing/local-services",
          icon: BadgeCheck,
        },
        {
          title: "Social Media Setup",
          url: "/tools/marketing/social-media",
          icon: Megaphone,
        },
        {
          title: "Facebook Business",
          url: "/tools/marketing/facebook",
          icon: MessageSquare,
        },
        {
          title: "Instagram for Business",
          url: "/tools/marketing/instagram",
          icon: Camera,
        },
        {
          title: "X (Twitter) Business",
          url: "/tools/marketing/twitter",
          icon: Hash,
        },
        {
          title: "LinkedIn Company Page",
          url: "/tools/marketing/linkedin",
          icon: Users,
        },
      ],
    },
    {
      label: "Business Setup",
      items: [
        {
          title: "Business Registration",
          url: "/tools/business/registration",
          icon: Briefcase,
        },
        {
          title: "Licensing & Permits",
          url: "/tools/business/licensing",
          icon: FileText,
        },
        {
          title: "Insurance Providers",
          url: "/tools/business/insurance",
          icon: Shield,
        },
        {
          title: "Banking & Payroll",
          url: "/tools/business/banking",
          icon: DollarSign,
        },
        {
          title: "Legal Resources",
          url: "/tools/business/legal",
          icon: ShieldCheck,
        },
      ],
    },
    {
      label: "Financing & Growth",
      items: [
        {
          title: "Consumer Financing",
          url: "/tools/financing/consumer",
          icon: Receipt,
        },
        {
          title: "Business Loans",
          url: "/tools/financing/business-loans",
          icon: DollarSign,
        },
        {
          title: "Equipment Financing",
          url: "/tools/financing/equipment",
          icon: Wrench,
        },
        {
          title: "Credit Card Processing",
          url: "/tools/financing/credit-card",
          icon: Receipt,
        },
      ],
    },
    {
      label: "Industry Networks",
      items: [
        {
          title: "Nexstar Network",
          url: "/tools/networks/nexstar",
          icon: Users,
        },
        {
          title: "Service Nation Alliance",
          url: "/tools/networks/service-nation",
          icon: Users,
        },
        {
          title: "ACCA (HVAC)",
          url: "/tools/networks/acca",
          icon: Zap,
        },
        {
          title: "PHCC (Plumbing)",
          url: "/tools/networks/phcc",
          icon: Wrench,
        },
        {
          title: "NECA (Electrical)",
          url: "/tools/networks/neca",
          icon: Zap,
        },
      ],
    },
    {
      label: "Training & Certification",
      items: [
        {
          title: "Trade Certifications",
          url: "/tools/training/certifications",
          icon: BadgeCheck,
        },
        {
          title: "OSHA Training",
          url: "/tools/training/osha",
          icon: ShieldCheck,
        },
        {
          title: "EPA Certification",
          url: "/tools/training/epa",
          icon: Shield,
        },
        {
          title: "Business Management",
          url: "/tools/training/business",
          icon: GraduationCap,
        },
      ],
    },
    {
      label: "Resources & Tools",
      items: [
        {
          title: "Industry News",
          url: "/tools/resources/news",
          icon: BookOpen,
        },
        {
          title: "Calculators & Estimators",
          url: "/tools/resources/calculators",
          icon: Wrench,
        },
        {
          title: "Vendor Directories",
          url: "/tools/resources/vendors",
          icon: Package,
        },
        {
          title: "Emergency Services",
          url: "/tools/resources/emergency",
          icon: Phone,
        },
      ],
    },
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
  if (pathname.startsWith("/dashboard/customers")) {
    return "customers";
  }
  if (pathname.startsWith("/dashboard/finance")) {
    return "finance";
  }
  if (pathname.startsWith("/dashboard/reporting")) {
    return "reporting";
  }
  if (pathname.startsWith("/dashboard/marketing")) {
    return "marketing";
  }
  if (pathname.startsWith("/dashboard/shop")) {
    return "shop";
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
  if (pathname.startsWith("/tools")) {
    return "tools";
  }

  return "today";
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const currentSection = getCurrentSection(pathname);
  const navItems = navigationSections[currentSection];
  const [showWhatsNew, setShowWhatsNew] = useState(true);

  // Chat store for AI section
  const { cleanupDuplicateChats } = useChatStore();

  // Clean up any duplicate chats on mount
  useEffect(() => {
    cleanupDuplicateChats();
  }, [cleanupDuplicateChats]);

  const isAISection = currentSection === "ai";
  const isReportingSection = currentSection === "reporting";
  const isJobDetailsSection = currentSection === "jobDetails";

  // Use grouped navigation for settings, ai, work, customers, communication, finance, marketing, shop, tools, and jobDetails sections
  const useGroupedNav =
    currentSection === "settings" ||
    currentSection === "ai" ||
    currentSection === "work" ||
    currentSection === "customers" ||
    currentSection === "communication" ||
    currentSection === "finance" ||
    currentSection === "marketing" ||
    currentSection === "shop" ||
    currentSection === "tools" ||
    currentSection === "jobDetails";

  // Check if page has custom sidebar config
  // Custom sidebar config is no longer used - removed with layout refactor
  const hasCustomConfig = false;
  const sidebarConfig: any = undefined;

  return (
    <Sidebar collapsible="offcanvas" variant="inset" {...props}>
      <SidebarContent>
        {isReportingSection ? (
          // Use custom collapsible navigation for reporting
          <ReportingSidebarNav />
        ) : isJobDetailsSection ? (
          // Use dynamic widget navigation for job details (uses NavGrouped internally)
          <JobDetailsNav />
        ) : hasCustomConfig ? (
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
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
