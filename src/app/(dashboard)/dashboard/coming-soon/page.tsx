/**
 * Coming Soon Features Collection Page - Server Component
 *
 * A comprehensive showcase of all upcoming features including:
 * - AI Assistant with complete system control
 * - AI Phone System (inbound & outbound calling)
 * - Payroll Management
 * - Business & Consumer Financing
 * - Marketing & Review Management
 * - Training & Certification Programs
 * - Advanced Analytics & Reports
 * - Inventory Management
 */

import {
  BarChart3,
  Bell,
  Brain,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Database,
  DollarSign,
  FileText,
  GraduationCap,
  Lightbulb,
  LineChart,
  Megaphone,
  MessageSquare,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Rocket,
  Send,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="relative space-y-16 overflow-auto py-12">
      {/* Background gradient blobs */}
      <div className="-z-10 pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Main content */}
      <div className="mx-auto w-full max-w-7xl space-y-16 text-center">
        {/* Hero Section */}
        <div className="space-y-8">
          {/* Status badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-6 py-3 backdrop-blur-sm">
              <Clock className="mr-2 size-4" />
              <span className="font-medium">Coming Soon</span>
            </div>
          </div>

          {/* Icon with gradient background */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl" />
              <div className="relative flex size-32 items-center justify-center rounded-full border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
                <Sparkles className="size-16 text-primary" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="font-bold text-5xl tracking-tight md:text-6xl">
              Upcoming{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-extrabold text-transparent dark:from-blue-400 dark:to-purple-400">
                Features
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-foreground/60 text-xl leading-relaxed">
              Powerful new features coming to Thorbis - from AI automation and
              intelligent calling to comprehensive payroll, training, and
              financial management.
            </p>
          </div>
        </div>

        {/* Feature Showcase Grid */}
        <div className="space-y-16 pt-8">
          {/* 1. AI ASSISTANT */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <Brain className="size-8 text-primary dark:text-primary" />
                <h2 className="font-bold text-3xl">AI Assistant</h2>
              </div>
              <p className="text-muted-foreground">
                Complete system control through natural conversation
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-blue-500/5 to-transparent p-5 text-left transition-all duration-300 hover:border-primary/20 hover:shadow-blue-500/10 hover:shadow-lg">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <MessageSquare className="size-6 text-primary dark:text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-base">
                  Natural Commands
                </h3>
                <p className="text-muted-foreground text-sm">
                  "Send invoice to John" - AI handles everything automatically
                </p>
              </div>

              <div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-green-500/5 to-transparent p-5 text-left transition-all duration-300 hover:border-success/20 hover:shadow-green-500/10 hover:shadow-lg">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-success/10">
                    <Bell className="size-6 text-success dark:text-success" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-base">
                  24/7 Monitoring
                </h3>
                <p className="text-muted-foreground text-sm">
                  Catches errors, inconsistencies, and problems before they cost
                  you money
                </p>
              </div>

              <div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-purple-500/5 to-transparent p-5 text-left transition-all duration-300 hover:border-border/20 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent/10">
                    <Database className="size-6 text-accent-foreground dark:text-accent-foreground" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-base">
                  Full System Access
                </h3>
                <p className="text-muted-foreground text-sm">
                  Create, update, search, analyze - anything you can do, AI can
                  do
                </p>
              </div>

              <div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-orange-500/5 to-transparent p-5 text-left transition-all duration-300 hover:border-warning/20 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-warning/10">
                    <Zap className="size-6 text-warning dark:text-warning" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-base">
                  Smart Automation
                </h3>
                <p className="text-muted-foreground text-sm">
                  Auto-orders inventory, transfers funds, sends reminders
                  automatically
                </p>
              </div>
            </div>
          </div>

          {/* 2. AI PHONE SYSTEM */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <Phone className="size-8 text-accent-foreground dark:text-accent-foreground" />
                <h2 className="font-bold text-3xl">AI Phone System</h2>
              </div>
              <p className="text-muted-foreground">
                Intelligent inbound & outbound calling - never miss a lead or
                follow-up
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-cyan-500/5 to-transparent p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-cyan-500/10">
                    <PhoneIncoming className="size-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      24/7 Call Handling
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      Never miss a lead
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  AI answers every call, books appointments, quotes pricing, and
                  escalates when needed
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-blue-500/5 to-transparent p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <PhoneOutgoing className="size-6 text-primary dark:text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Proactive Outreach
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      Auto follow-ups
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  AI calls customers with quotes, appointment reminders, and
                  payment collections automatically
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-purple-500/5 to-transparent p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-accent/10">
                    <PhoneCall className="size-6 text-accent-foreground dark:text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Campaign Calling</h3>
                    <p className="text-muted-foreground text-xs">
                      Targeted outreach
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Automated calling campaigns for seasonal services, warranty
                  renewals, and maintenance
                </p>
              </div>
            </div>
          </div>

          {/* 3. PAYROLL */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <DollarSign className="size-8 text-success dark:text-success" />
                <h2 className="font-bold text-3xl">Payroll Management</h2>
              </div>
              <p className="text-muted-foreground">
                Complete payroll solution with time tracking and compliance
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Employee Management</span>
                <span className="text-center text-muted-foreground text-xs">
                  Profiles, roles & pay rates
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Time Tracking</span>
                <span className="text-center text-muted-foreground text-xs">
                  Timesheets & approvals
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Pay Runs</span>
                <span className="text-center text-muted-foreground text-xs">
                  Automated processing
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Tax Compliance</span>
                <span className="text-center text-muted-foreground text-xs">
                  W-2s, 1099s & reporting
                </span>
              </div>
            </div>
          </div>

          {/* 4. FINANCING */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <CreditCard className="size-8 text-accent-foreground dark:text-accent-foreground" />
                <h2 className="font-bold text-3xl">Financing Solutions</h2>
              </div>
              <p className="text-muted-foreground">
                Business loans and consumer financing - increase close rates
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-blue-500/5 to-transparent p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="size-6 text-primary dark:text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Business Financing
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Fund your growth
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="size-4 text-primary dark:text-primary" />
                    Term loans & lines of credit
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="size-4 text-primary dark:text-primary" />
                    Equipment financing
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="size-4 text-primary dark:text-primary" />
                    SBA loans & merchant cash advances
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-green-500/5 to-transparent p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-success/10">
                    <UserCheck className="size-6 text-success dark:text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Consumer Financing
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Help customers say yes
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="size-4 text-success dark:text-success" />
                    Instant approvals for customers
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="size-4 text-success dark:text-success" />
                    Flexible payment plans
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="size-4 text-success dark:text-success" />
                    Increase average ticket size
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 5. MARKETING */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <Megaphone className="size-8 text-accent-foreground dark:text-accent-foreground" />
                <h2 className="font-bold text-3xl">Marketing Center</h2>
              </div>
              <p className="text-muted-foreground">
                Lead management, reviews, campaigns, and multi-channel marketing
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-pink-500/5 to-transparent p-5 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-accent/10">
                  <Target className="size-5 text-accent-foreground dark:text-accent-foreground" />
                </div>
                <h3 className="mb-2 font-semibold">Lead Management</h3>
                <p className="text-muted-foreground text-sm">
                  Capture, score, and nurture leads automatically
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-yellow-500/5 to-transparent p-5 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-warning/10">
                  <Star className="size-5 text-warning dark:text-warning" />
                </div>
                <h3 className="mb-2 font-semibold">Review Management</h3>
                <p className="text-muted-foreground text-sm">
                  Monitor and respond to Google, Facebook, Yelp reviews
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-blue-500/5 to-transparent p-5 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Send className="size-5 text-primary dark:text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Campaigns</h3>
                <p className="text-muted-foreground text-sm">
                  Multi-channel campaigns via email, SMS, and direct mail
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-green-500/5 to-transparent p-5 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-success/10">
                  <LineChart className="size-5 text-success dark:text-success" />
                </div>
                <h3 className="mb-2 font-semibold">Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  Track ROI, conversion rates, and campaign performance
                </p>
              </div>
            </div>
          </div>

          {/* 6. TRAINING */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <GraduationCap className="size-8 text-primary dark:text-primary" />
                <h2 className="font-bold text-3xl">Training Center</h2>
              </div>
              <p className="text-muted-foreground">
                System training, sales courses, Nextstar content, and trade
                certifications
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-blue-500/5 to-transparent p-5 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="size-5 text-primary dark:text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">System Training</h3>
                <p className="text-muted-foreground text-sm">
                  Master Thorbis with video tutorials and guides
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-purple-500/5 to-transparent p-5 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-accent/10">
                  <Star className="size-5 text-accent-foreground dark:text-accent-foreground" />
                </div>
                <h3 className="mb-2 font-semibold">Nextstar</h3>
                <p className="text-muted-foreground text-sm">
                  Exclusive content from the premier coaching organization
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-orange-500/5 to-transparent p-5 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-warning/10">
                  <Wrench className="size-5 text-warning dark:text-warning" />
                </div>
                <h3 className="mb-2 font-semibold">Trade Certs</h3>
                <p className="text-muted-foreground text-sm">
                  Journeyman & Master programs for HVAC, Plumbing, Electrical
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-green-500/5 to-transparent p-5 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-success/10">
                  <Upload className="size-5 text-success dark:text-success" />
                </div>
                <h3 className="mb-2 font-semibold">Company Training</h3>
                <p className="text-muted-foreground text-sm">
                  Upload your own videos and create custom curricula
                </p>
              </div>
            </div>
          </div>

          {/* 7. ANALYTICS & REPORTS */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <BarChart3 className="size-8 text-accent-foreground dark:text-accent-foreground" />
                <h2 className="font-bold text-3xl">Advanced Analytics</h2>
              </div>
              <p className="text-muted-foreground">
                Real-time dashboards, custom reports, and business intelligence
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Performance Metrics</span>
                <span className="text-center text-muted-foreground text-xs">
                  KPIs, trends & forecasting
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Custom Reports</span>
                <span className="text-center text-muted-foreground text-xs">
                  Build & save reports
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <LineChart className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Data Visualization</span>
                <span className="text-center text-muted-foreground text-xs">
                  Charts, graphs & dashboards
                </span>
              </div>
            </div>
          </div>

          {/* 8. INVENTORY */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <Briefcase className="size-8 text-warning dark:text-warning" />
                <h2 className="font-bold text-3xl">Inventory Management</h2>
              </div>
              <p className="text-muted-foreground">
                Track stock, manage vendors, and automate purchase orders
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Database className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Stock Tracking</span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bell className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Low Stock Alerts</span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Purchase Orders</span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Vendor Management</span>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-8">
            <div className="mb-6 flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Lightbulb className="size-8 text-primary" />
              </div>
            </div>
            <h2 className="mb-4 font-semibold text-2xl">Stay Tuned</h2>
            <p className="mx-auto max-w-2xl text-foreground/60 leading-relaxed">
              These features are in active development and will be rolling out
              progressively. In the meantime, explore the platform and reach out
              if you have questions or need assistance.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <Rocket className="size-4" />
              <p>Building the future of field service management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
