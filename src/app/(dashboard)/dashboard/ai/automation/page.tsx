/**
 * Ai > Automation Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

import {
  ArrowRight,
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

export default function AIAutomationPage() {
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
            AI-Powered{" "}
            <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              Automation
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-foreground/60 text-xl leading-relaxed">
            Tell the AI what you want automated and it creates the workflow for
            you. No coding, no complex setup - just describe what should happen
            and the AI builds it.
          </p>
        </div>

        {/* Feature Categories */}
        <div className="mx-auto max-w-5xl space-y-8 pt-8">
          {/* AI Creates Automations */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Create Automations with Natural Language
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-purple-500/10">
                    <MessageSquare className="size-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      &quot;Send reminder 1 day before appointment&quot;
                    </h3>
                  </div>
                </div>
                <p className="mb-3 text-muted-foreground text-sm">
                  AI creates automation: When appointment scheduled → Wait until
                  24 hours before → Send SMS and email reminder → Log
                  confirmation
                </p>
                <div className="flex items-center gap-1 text-purple-600 text-xs dark:text-purple-400">
                  <Sparkles className="size-3" />
                  <span>Built in seconds, not hours</span>
                </div>
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <Bell className="size-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      &quot;Alert me when invoice unpaid 30 days&quot;
                    </h3>
                  </div>
                </div>
                <p className="mb-3 text-muted-foreground text-sm">
                  AI creates automation: When invoice created → Wait 30 days →
                  Check payment status → If unpaid, notify you → Create
                  follow-up task
                </p>
                <div className="flex items-center gap-1 text-blue-600 text-xs dark:text-blue-400">
                  <Zap className="size-3" />
                  <span>No manual tracking needed</span>
                </div>
              </div>

              <div className="rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-green-500/10">
                    <Users className="size-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      &quot;Auto-assign to nearest available tech&quot;
                    </h3>
                  </div>
                </div>
                <p className="mb-3 text-muted-foreground text-sm">
                  AI creates automation: When job approved → Find techs with
                  right skills → Check availability → Calculate distance →
                  Assign to best match → Notify tech
                </p>
                <div className="flex items-center gap-1 text-green-600 text-xs dark:text-green-400">
                  <TrendingUp className="size-3" />
                  <span>Saves 60% dispatch time</span>
                </div>
              </div>

              <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-orange-500/10">
                    <FileText className="size-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      &quot;Send invoice when job completed&quot;
                    </h3>
                  </div>
                </div>
                <p className="mb-3 text-muted-foreground text-sm">
                  AI creates automation: When job marked complete → Generate
                  invoice from work order → Email and SMS to customer → Log in
                  finance system
                </p>
                <div className="flex items-center gap-1 text-orange-600 text-xs dark:text-orange-400">
                  <Rocket className="size-3" />
                  <span>Get paid 3x faster</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Automation Features */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Pre-Built Smart Automations
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* AI-Powered Automation */}
              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-purple-500/5 to-transparent p-6 transition-all duration-300 hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-purple-500/10">
                    <Brain className="size-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">AI Assistant</h3>
                <p className="text-muted-foreground text-sm">
                  Chat with AI to create custom automations instantly - no
                  technical knowledge required
                </p>
              </div>

              {/* Smart Dispatch */}
              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-blue-500/5 to-transparent p-6 transition-all duration-300 hover:border-blue-500/20 hover:shadow-blue-500/10 hover:shadow-lg">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10">
                    <MapPin className="size-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">Smart Dispatch</h3>
                <p className="text-muted-foreground text-sm">
                  AI automatically assigns jobs to the best-fit technician based
                  on skills, location, and availability
                </p>
              </div>

              {/* Auto-Billing */}
              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-green-500/5 to-transparent p-6 transition-all duration-300 hover:border-green-500/20 hover:shadow-green-500/10 hover:shadow-lg">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-green-500/10">
                    <DollarSign className="size-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">
                  Auto-Billing & Collection
                </h3>
                <p className="text-muted-foreground text-sm">
                  Automatically generate invoices, send payment reminders, and
                  process collections on schedule
                </p>
              </div>

              {/* 24/7 AI Answering */}
              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-orange-500/5 to-transparent p-6 transition-all duration-300 hover:border-orange-500/20 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-orange-500/10">
                    <Phone className="size-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">
                  24/7 AI Answering
                </h3>
                <p className="text-muted-foreground text-sm">
                  AI handles incoming calls, books appointments, answers
                  questions - never miss a lead
                </p>
              </div>

              {/* Workflow Builder */}
              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-pink-500/5 to-transparent p-6 transition-all duration-300 hover:border-pink-500/20 hover:shadow-lg hover:shadow-pink-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-pink-500/10">
                    <Settings className="size-6 text-pink-600 dark:text-pink-400" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">
                  Visual Workflow Builder
                </h3>
                <p className="text-muted-foreground text-sm">
                  Drag-and-drop interface to create custom workflows with
                  triggers, conditions, and actions
                </p>
              </div>

              {/* Team Automation */}
              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-teal-500/5 to-transparent p-6 transition-all duration-300 hover:border-teal-500/20 hover:shadow-lg hover:shadow-teal-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-teal-500/10">
                    <Users className="size-6 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">Team Management</h3>
                <p className="text-muted-foreground text-sm">
                  Auto-assign tasks, track time, manage schedules, and process
                  payroll automatically
                </p>
              </div>
            </div>
          </div>

          {/* Smart Automation Examples */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Smart Automation Examples
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Job Assignment */}
              <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10">
                    <Wrench className="size-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-sm">Auto Job Assignment</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  When job approved → Find best tech by skills, location &
                  availability → Auto-assign & notify
                </p>
                <div className="flex items-center gap-1 text-blue-600 text-xs dark:text-blue-400">
                  <Sparkles className="size-3" />
                  <span>Saves 60% dispatch time</span>
                </div>
              </div>

              {/* Payment Follow-up */}
              <div className="rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-green-500/10">
                    <CreditCard className="size-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-sm">Payment Reminders</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Invoice unpaid 7 days → Send friendly reminder → Wait 7 days →
                  Send urgent notice → Create collection task
                </p>
                <div className="flex items-center gap-1 text-green-600 text-xs dark:text-green-400">
                  <TrendingUp className="size-3" />
                  <span>Collect 40% faster</span>
                </div>
              </div>

              {/* Review Request */}
              <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10">
                    <Smartphone className="size-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-sm">Review Request Flow</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Job completed → Wait 1 hour → Send review request via SMS →
                  Thank customer → Escalate low ratings
                </p>
                <div className="flex items-center gap-1 text-purple-600 text-xs dark:text-purple-400">
                  <Sparkles className="size-3" />
                  <span>5x more reviews</span>
                </div>
              </div>

              {/* Appointment Reminder */}
              <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-orange-500/10">
                    <Calendar className="size-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-sm">
                    Appointment Reminders
                  </h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Appointment scheduled → Send confirmation → 24 hours before →
                  SMS reminder → 2 hours before → Final reminder
                </p>
                <div className="flex items-center gap-1 text-orange-600 text-xs dark:text-orange-400">
                  <CheckCircle2 className="size-3" />
                  <span>Cut no-shows by 30%</span>
                </div>
              </div>

              {/* Lead Follow-up */}
              <div className="rounded-xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-pink-500/10">
                    <Mail className="size-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="font-semibold text-sm">
                    Lead Nurture Sequence
                  </h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  New lead → Send welcome email → Day 3: Follow-up call → Day 7:
                  Special offer → Day 14: Final outreach
                </p>
                <div className="flex items-center gap-1 text-pink-600 text-xs dark:text-pink-400">
                  <Rocket className="size-3" />
                  <span>Close 25% more leads</span>
                </div>
              </div>

              {/* Quality Check */}
              <div className="rounded-xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-teal-500/10">
                    <CheckCircle2 className="size-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="font-semibold text-sm">Quality Checks</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Job completed → Check photos uploaded → Verify invoice matches
                  work order → Alert if missing → Prevent payout
                </p>
                <div className="flex items-center gap-1 text-teal-600 text-xs dark:text-teal-400">
                  <Zap className="size-3" />
                  <span>100% documentation</span>
                </div>
              </div>

              {/* Schedule Optimization */}
              <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10">
                    <Calendar className="size-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-sm">
                    Schedule Optimization
                  </h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Every night → Analyze next day schedule → Optimize routes →
                  Group nearby jobs → Notify techs of changes
                </p>
                <div className="flex items-center gap-1 text-indigo-600 text-xs dark:text-indigo-400">
                  <TrendingUp className="size-3" />
                  <span>20% more jobs/day</span>
                </div>
              </div>

              {/* Customer Onboarding */}
              <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-yellow-500/10">
                    <Users className="size-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="font-semibold text-sm">Customer Onboarding</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  New customer → Send welcome pack → Add to CRM → Schedule
                  follow-up → Offer membership → Track engagement
                </p>
                <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                  <Sparkles className="size-3" />
                  <span>Higher retention</span>
                </div>
              </div>

              {/* Tech Performance */}
              <div className="rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10">
                    <TrendingUp className="size-4 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold text-sm">Performance Alerts</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Tech running late → Alert dispatcher → Notify next customer →
                  Offer reschedule option → Track pattern
                </p>
                <div className="flex items-center gap-1 text-red-600 text-xs dark:text-red-400">
                  <Bell className="size-3" />
                  <span>Proactive service</span>
                </div>
              </div>

              {/* Upsell Opportunities */}
              <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10">
                    <DollarSign className="size-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="font-semibold text-sm">Upsell Detection</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  HVAC repair booked → AI suggests maintenance plan → Notify
                  tech → Present options → Auto-add to quote
                </p>
                <div className="flex items-center gap-1 text-cyan-600 text-xs dark:text-cyan-400">
                  <Wallet className="size-3" />
                  <span>35% higher ticket</span>
                </div>
              </div>

              {/* Emergency Dispatch */}
              <div className="rounded-xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/10">
                    <Bell className="size-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="font-semibold text-sm">Emergency Response</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Urgent call received → Find nearest available tech → Auto-book
                  → Notify all parties → Premium pricing applied
                </p>
                <div className="flex items-center gap-1 text-rose-600 text-xs dark:text-rose-400">
                  <Rocket className="size-3" />
                  <span>5 minute response</span>
                </div>
              </div>

              {/* Warranty Tracking */}
              <div className="rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-transparent p-5 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10">
                    <FileText className="size-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-sm">Warranty Management</h3>
                </div>
                <p className="mb-3 text-muted-foreground text-xs">
                  Equipment installed → Track warranty period → 30 days before
                  expiry → Offer extended warranty → Auto-follow-up
                </p>
                <div className="flex items-center gap-1 text-violet-600 text-xs dark:text-violet-400">
                  <Briefcase className="size-3" />
                  <span>Never miss renewals</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Builder Section */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Custom Workflow Builder
            </h2>
            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-8">
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="text-left">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                      <Zap className="size-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold">Triggers</h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="size-3" />
                      Job status change
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="size-3" />
                      Payment received
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="size-3" />
                      Customer created
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="size-3" />
                      Time-based events
                    </li>
                  </ul>
                </div>

                <div className="text-left">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
                      <Settings className="size-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold">Conditions</h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="size-3" />
                      If/else logic
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="size-3" />
                      Customer filters
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="size-3" />
                      Value comparisons
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="size-3" />
                      Time windows
                    </li>
                  </ul>
                </div>

                <div className="text-left">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                      <Send className="size-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold">Actions</h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="size-3" />
                      Send notification
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="size-3" />
                      Update record
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="size-3" />
                      Create task
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="size-3" />
                      API call
                    </li>
                  </ul>
                </div>
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
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    AI-Powered Creation:
                  </span>{" "}
                  Just tell the AI what you want automated - it creates the
                  workflow for you in seconds, no coding or complex setup
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Smart Dispatch & Scheduling:
                  </span>{" "}
                  AI automatically assigns jobs to the best technician,
                  optimizes routes, and manages your schedule
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Financial Automation:
                  </span>{" "}
                  Auto-invoice, payment reminders, collections, and
                  reconciliation - get paid faster with zero manual work
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    24/7 AI Phone System:
                  </span>{" "}
                  AI handles incoming calls, books appointments, answers
                  questions, and captures leads - never miss business again
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Custom Workflows:
                  </span>{" "}
                  Visual drag-and-drop builder to create automations specific to
                  your business processes and requirements
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Team Management:
                  </span>{" "}
                  Automated time tracking, payroll processing, performance
                  monitoring, and task assignment
                </p>
              </div>
            </div>
          </div>

          {/* Quick Wins */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Quick Wins You&apos;ll Get
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-4 text-center">
                <div className="mb-2 font-bold text-3xl text-green-600 dark:text-green-400">
                  60%
                </div>
                <p className="text-muted-foreground text-sm">
                  Less time on scheduling
                </p>
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent p-4 text-center">
                <div className="mb-2 font-bold text-3xl text-blue-600 dark:text-blue-400">
                  3x
                </div>
                <p className="text-muted-foreground text-sm">
                  Faster payment collection
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent p-4 text-center">
                <div className="mb-2 font-bold text-3xl text-purple-600 dark:text-purple-400">
                  30%
                </div>
                <p className="text-muted-foreground text-sm">
                  Fewer missed appointments
                </p>
              </div>

              <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-4 text-center">
                <div className="mb-2 font-bold text-3xl text-orange-600 dark:text-orange-400">
                  24/7
                </div>
                <p className="text-muted-foreground text-sm">
                  Never miss a lead
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex items-center justify-center gap-2 pt-4 text-muted-foreground text-sm">
          <Rocket className="size-4" />
          <p>
            In the meantime, explore the platform and reach out if you need help
          </p>
        </div>
      </div>
    </div>
  );
}
