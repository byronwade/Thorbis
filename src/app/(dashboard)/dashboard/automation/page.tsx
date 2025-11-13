/**
 * Automation Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

import {
  Bell,
  Brain,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Lightbulb,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Rocket,
  Send,
  Settings,
  Smartphone,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";
export const revalidate = 900; // Revalidate every 15 minutes

export default function AutomationPage() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-auto py-12">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-6xl space-y-12 text-center">
        {/* Status badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-6 py-3 text-sm backdrop-blur-sm">
            <Clock className="mr-2 size-4" />
            <span className="font-medium">Coming Soon</span>
          </div>
        </div>

        {/* Icon with gradient background */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl" />
            <div className="relative flex size-32 items-center justify-center rounded-full border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
              <Zap className="size-16 text-primary" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Main heading with gradient */}
        <div className="space-y-4">
          <h1 className="font-bold text-5xl tracking-tight md:text-6xl">
            Automation{" "}
            <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              Center
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-foreground/60 text-xl leading-relaxed">
            Intelligent automation that runs your business on autopilot - from
            first call to final payment, powered by AI and smart workflows
          </p>
        </div>

        {/* Feature Categories */}
        <div className="mx-auto max-w-5xl space-y-8 pt-8">
          {/* Core Automation Features */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Core Automation Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* AI-Powered Automation */}
              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-purple-500/5 to-transparent p-6 transition-all duration-300 hover:border-border/20 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent/10">
                    <Brain className="size-6 text-accent-foreground dark:text-accent-foreground" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">AI Assistant</h3>
                <p className="text-muted-foreground text-sm">
                  AI-powered sidekick that runs reports, dispatches jobs, and
                  guides workflows through natural language
                </p>
              </div>

              {/* Smart Dispatch */}
              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-blue-500/5 to-transparent p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-blue-500/10 hover:shadow-lg">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="size-6 text-primary dark:text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">Smart Dispatch</h3>
                <p className="text-muted-foreground text-sm">
                  Automatically assign jobs based on skills, location, and
                  availability with optimized routing
                </p>
              </div>

              {/* Financial Automation */}
              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-green-500/5 to-transparent p-6 transition-all duration-300 hover:border-success/20 hover:shadow-green-500/10 hover:shadow-lg">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-success/10">
                    <DollarSign className="size-6 text-success dark:text-success" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">Auto-Billing</h3>
                <p className="text-muted-foreground text-sm">
                  Generate invoices, auto-charge cards on file, and send payment
                  reminders automatically
                </p>
              </div>

              {/* Customer Communication */}
              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-orange-500/5 to-transparent p-6 transition-all duration-300 hover:border-warning/20 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-warning/10">
                    <MessageSquare className="size-6 text-warning dark:text-warning" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">
                  24/7 AI Answering
                </h3>
                <p className="text-muted-foreground text-sm">
                  AI phone system answers calls, books appointments, and routes
                  inquiries automatically
                </p>
              </div>

              {/* Workflow Builder */}
              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-pink-500/5 to-transparent p-6 transition-all duration-300 hover:border-border/20 hover:shadow-lg hover:shadow-pink-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent/10">
                    <Settings className="size-6 text-accent-foreground dark:text-accent-foreground" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">Workflow Builder</h3>
                <p className="text-muted-foreground text-sm">
                  Visual builder with triggers, conditions, and actions - create
                  any automation you need
                </p>
              </div>

              {/* Team Automation */}
              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-cyan-500/5 to-transparent p-6 transition-all duration-300 hover:border-cyan-500/20 hover:shadow-cyan-500/10 hover:shadow-lg">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-cyan-500/10">
                    <Users className="size-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">Team Management</h3>
                <p className="text-muted-foreground text-sm">
                  Auto-assign based on skills, track certifications, and
                  automate payroll calculations
                </p>
              </div>
            </div>
          </div>

          {/* Smart Automation Examples */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Smart Automation Examples
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Job & Dispatch Automations */}
              <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-blue-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <Wrench className="size-4 text-primary dark:text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Auto Job Assignment</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  When job approved → Find best tech by skills, location &
                  availability → Auto-assign & notify
                </p>
                <div className="flex items-center gap-1 text-primary text-xs dark:text-primary">
                  <Sparkles className="size-3" />
                  <span>Saves 60% dispatch time</span>
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-blue-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="size-4 text-primary dark:text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Route Optimization</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Daily at 7am → Analyze all jobs → Optimize routes → Send
                  schedule to techs
                </p>
                <div className="flex items-center gap-1 text-primary text-xs dark:text-primary">
                  <Sparkles className="size-3" />
                  <span>+2-3 jobs per tech/day</span>
                </div>
              </div>

              {/* Financial Automations */}
              <div className="rounded-xl border border-success/20 bg-gradient-to-br from-green-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-success/10">
                    <FileText className="size-4 text-success dark:text-success" />
                  </div>
                  <h3 className="font-semibold text-sm">
                    Auto-Invoice Generation
                  </h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Job completed + signature → Generate invoice → Sync QuickBooks
                  → Email customer
                </p>
                <div className="flex items-center gap-1 text-success text-xs dark:text-success">
                  <Sparkles className="size-3" />
                  <span>40% faster billing</span>
                </div>
              </div>

              <div className="rounded-xl border border-success/20 bg-gradient-to-br from-green-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-success/10">
                    <CreditCard className="size-4 text-success dark:text-success" />
                  </div>
                  <h3 className="font-semibold text-sm">Auto-Charge Card</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Invoice due → Auto-charge saved card → Send receipt → Update
                  accounting
                </p>
                <div className="flex items-center gap-1 text-success text-xs dark:text-success">
                  <Sparkles className="size-3" />
                  <span>Reduce unpaid by 75%</span>
                </div>
              </div>

              <div className="rounded-xl border border-success/20 bg-gradient-to-br from-green-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-success/10">
                    <Bell className="size-4 text-success dark:text-success" />
                  </div>
                  <h3 className="font-semibold text-sm">Payment Reminders</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Invoice 7 days overdue → Send email → 14 days → Send SMS → 30
                  days → Escalate
                </p>
                <div className="flex items-center gap-1 text-success text-xs dark:text-success">
                  <Sparkles className="size-3" />
                  <span>Improve cash flow</span>
                </div>
              </div>

              {/* Customer Communication */}
              <div className="rounded-xl border border-warning/20 bg-gradient-to-br from-orange-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-warning/10">
                    <Phone className="size-4 text-warning dark:text-warning" />
                  </div>
                  <h3 className="font-semibold text-sm">AI Call Answering</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Customer calls → AI answers 24/7 → Books appointment → Creates
                  job → Confirms via SMS
                </p>
                <div className="flex items-center gap-1 text-warning text-xs dark:text-warning">
                  <Sparkles className="size-3" />
                  <span>Never miss a lead</span>
                </div>
              </div>

              <div className="rounded-xl border border-warning/20 bg-gradient-to-br from-orange-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-warning/10">
                    <Smartphone className="size-4 text-warning dark:text-warning" />
                  </div>
                  <h3 className="font-semibold text-sm">
                    Appointment Reminders
                  </h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  24 hours before job → Send SMS reminder → Request confirmation
                  → Update schedule
                </p>
                <div className="flex items-center gap-1 text-warning text-xs dark:text-warning">
                  <Sparkles className="size-3" />
                  <span>Cut no-shows by 30%</span>
                </div>
              </div>

              <div className="rounded-xl border border-warning/20 bg-gradient-to-br from-orange-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-warning/10">
                    <Mail className="size-4 text-warning dark:text-warning" />
                  </div>
                  <h3 className="font-semibold text-sm">Post-Job Follow-up</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Job completed → Wait 2 hours → Send thank you + survey +
                  payment link + review request
                </p>
                <div className="flex items-center gap-1 text-warning text-xs dark:text-warning">
                  <Sparkles className="size-3" />
                  <span>Boost satisfaction</span>
                </div>
              </div>

              {/* Team & Operations */}
              <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10">
                    <Briefcase className="size-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="font-semibold text-sm">
                    Skill-Based Assignment
                  </h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  HVAC job created → Filter techs by HVAC cert + EPA license →
                  Check availability → Assign
                </p>
                <div className="flex items-center gap-1 text-cyan-600 text-xs dark:text-cyan-400">
                  <Sparkles className="size-3" />
                  <span>Quality assurance</span>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10">
                    <Wallet className="size-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="font-semibold text-sm">Auto Payroll</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Timesheet submitted → Calculate hours + overtime → Apply rates
                  → Sync payroll system
                </p>
                <div className="flex items-center gap-1 text-cyan-600 text-xs dark:text-cyan-400">
                  <Sparkles className="size-3" />
                  <span>Save 80% admin time</span>
                </div>
              </div>

              {/* Marketing & Recurring */}
              <div className="rounded-xl border border-border/20 bg-gradient-to-br from-purple-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-accent/10">
                    <Calendar className="size-4 text-accent-foreground dark:text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold text-sm">Recurring Service</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Service 11 months old → Generate quote → Email customer →
                  Auto-schedule if approved
                </p>
                <div className="flex items-center gap-1 text-accent-foreground text-xs dark:text-accent-foreground">
                  <Sparkles className="size-3" />
                  <span>Increase recurring revenue</span>
                </div>
              </div>

              <div className="rounded-xl border border-border/20 bg-gradient-to-br from-purple-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-accent/10">
                    <TrendingUp className="size-4 text-accent-foreground dark:text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold text-sm">Smart Marketing</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Schedule full → Throttle ad spend • Schedule has gaps → Launch
                  campaign automatically
                </p>
                <div className="flex items-center gap-1 text-accent-foreground text-xs dark:text-accent-foreground">
                  <Sparkles className="size-3" />
                  <span>Optimize ad spend</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Builder */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Custom Workflow Builder
            </h2>
            <div className="rounded-2xl border border-border/20 bg-gradient-to-br from-pink-500/10 to-transparent p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-accent/10">
                  <Settings className="size-8 text-accent-foreground dark:text-accent-foreground" />
                </div>
                <div className="text-left">
                  <h3 className="mb-1 font-semibold text-xl">
                    Build Any Automation
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Visual drag-and-drop builder with unlimited possibilities
                  </p>
                </div>
              </div>

              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-accent/10">
                    <Zap className="size-5 text-accent-foreground dark:text-accent-foreground" />
                  </div>
                  <h4 className="mb-1 font-semibold text-sm">Triggers</h4>
                  <p className="text-muted-foreground text-xs">
                    Job created, status changed, invoice sent, time-based, and
                    more
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-accent/10">
                    <CheckCircle2 className="size-5 text-accent-foreground dark:text-accent-foreground" />
                  </div>
                  <h4 className="mb-1 font-semibold text-sm">Conditions</h4>
                  <p className="text-muted-foreground text-xs">
                    If/then logic, field comparisons, custom rules with multiple
                    conditions
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-accent/10">
                    <Send className="size-5 text-accent-foreground dark:text-accent-foreground" />
                  </div>
                  <h4 className="mb-1 font-semibold text-sm">Actions</h4>
                  <p className="text-muted-foreground text-xs">
                    Send notifications, update records, create tasks, call
                    webhooks
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-accent/10 px-3 py-1">
                  50+ Templates
                </span>
                <span className="rounded-full bg-accent/10 px-3 py-1">
                  Zapier Integration
                </span>
                <span className="rounded-full bg-accent/10 px-3 py-1">
                  2000+ App Connections
                </span>
                <span className="rounded-full bg-accent/10 px-3 py-1">
                  No Code Required
                </span>
              </div>
            </div>
          </div>

          {/* Integration Ecosystem */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Integration Ecosystem
            </h2>
            <div className="grid gap-4 text-xs sm:grid-cols-4 md:grid-cols-6">
              <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card/30 p-3">
                <div className="flex size-8 items-center justify-center rounded bg-muted">
                  <span className="font-semibold text-xs">QB</span>
                </div>
                <span className="text-muted-foreground">QuickBooks</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card/30 p-3">
                <div className="flex size-8 items-center justify-center rounded bg-muted">
                  <MessageSquare className="size-4" />
                </div>
                <span className="text-muted-foreground">Twilio</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card/30 p-3">
                <div className="flex size-8 items-center justify-center rounded bg-muted">
                  <CreditCard className="size-4" />
                </div>
                <span className="text-muted-foreground">Stripe</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card/30 p-3">
                <div className="flex size-8 items-center justify-center rounded bg-muted">
                  <Mail className="size-4" />
                </div>
                <span className="text-muted-foreground">Email</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card/30 p-3">
                <div className="flex size-8 items-center justify-center rounded bg-muted">
                  <Calendar className="size-4" />
                </div>
                <span className="text-muted-foreground">Google Cal</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card/30 p-3">
                <div className="flex size-8 items-center justify-center rounded bg-muted">
                  <Zap className="size-4" />
                </div>
                <span className="text-muted-foreground">Zapier</span>
              </div>
            </div>
          </div>

          {/* What to Expect */}
          <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-8">
            <div className="mb-6 flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Lightbulb className="size-8 text-primary" />
              </div>
            </div>
            <h2 className="mb-4 font-semibold text-2xl">What to Expect</h2>
            <div className="mx-auto max-w-3xl space-y-3 text-left text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    AI-Powered Intelligence:
                  </span>{" "}
                  Natural language commands to run reports, dispatch
                  technicians, and automate decisions - like having a virtual
                  operations manager
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Smart Job Assignment:
                  </span>{" "}
                  Automatically match jobs to the best technician based on
                  skills, certifications, location, and real-time availability
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Auto-Billing & Collections:
                  </span>{" "}
                  Generate invoices instantly, auto-charge cards on file, and
                  send escalating payment reminders - improve cash flow by 40%
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    24/7 Customer Communication:
                  </span>{" "}
                  AI answers phones, books appointments, sends SMS reminders,
                  and follows up after jobs - never miss a lead
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Custom Workflow Builder:
                  </span>{" "}
                  Visual drag-and-drop interface to create any automation with
                  triggers, conditions, and actions - no coding required
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Integration Ecosystem:
                  </span>{" "}
                  Connect with 2000+ apps via Zapier, QuickBooks, Stripe,
                  Twilio, and more - your entire business connected
                </p>
              </div>
            </div>
          </div>

          {/* Quick Wins */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Quick Wins - Ready in Weeks
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <FileText className="size-5 text-success dark:text-success" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Auto-Invoice</h3>
                  <p className="text-muted-foreground text-xs">
                    On job completion
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                  <Smartphone className="size-5 text-warning dark:text-warning" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">SMS Reminders</h3>
                  <p className="text-muted-foreground text-xs">
                    24hr before jobs
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="size-5 text-primary dark:text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Follow-up Surveys</h3>
                  <p className="text-muted-foreground text-xs">
                    Post-job feedback
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Bell className="size-5 text-accent-foreground dark:text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Payment Alerts</h3>
                  <p className="text-muted-foreground text-xs">
                    Overdue reminders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex items-center justify-center gap-2 pt-4 text-muted-foreground text-sm">
          <Rocket className="size-4" />
          <p>Powerful automation is coming soon to save you hours every day</p>
        </div>
      </div>
    </div>
  );
}
