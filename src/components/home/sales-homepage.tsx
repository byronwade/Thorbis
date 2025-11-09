/**
 * Sales Homepage - Psychology-Driven Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - All static marketing content rendered on server
 * - Optimized for Core Web Vitals and SEO
 *
 * Psychology principles:
 * - Urgency: Limited-time pricing, competitor comparison
 * - Social proof: Stats, testimonials, case studies
 * - Value demonstration: ROI calculator, feature showcase
 * - Risk reversal: 30-day money-back, no setup fees
 * - Authority: Industry leadership, certifications
 */

import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  MessageSquare,
  Phone,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export function SalesHomepage() {
  return (
    <div className="relative">
      {/* HERO SECTION - BOLD VALUE PROPOSITION */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Gradient background */}
        <div className="-z-10 absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="-z-10 absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

        <div className="container relative mx-auto px-4 py-20 sm:px-6 lg:px-8">
          {/* Alert bar - Urgency */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles className="size-4 text-primary" />
              <span className="font-medium">
                Join 5,000+ service businesses growing with AI
              </span>
            </div>
          </div>

          <div className="mx-auto max-w-5xl text-center">
            {/* Main headline - Problem + Solution */}
            <h1 className="mb-6 font-extrabold text-5xl leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Stop Losing Money to{" "}
              <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent dark:from-red-400 dark:to-red-300">
                Expensive Software
              </span>
              <br />
              Start Growing with{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                AI-Powered Thorbis
              </span>
            </h1>

            {/* Subheadline - Value prop */}
            <p className="mx-auto mb-8 max-w-3xl text-foreground/70 text-xl leading-relaxed md:text-2xl">
              The complete field service management platform with built-in AI
              assistant. Do in <strong>10 seconds</strong> what takes{" "}
              <strong>10 minutes</strong> in ServiceTitan. Pay a simple{" "}
              <strong>$100/month base with pay-as-you-go usage</strong> instead of{" "}
              <strong>$398/month contracts</strong>. We never lock you in—cancel anytime and keep your data.
            </p>

            {/* Social proof */}
            <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="-space-x-2 flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    className="size-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-primary/10"
                    key={i}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="size-4 fill-yellow-500 text-yellow-500" />
                <Star className="size-4 fill-yellow-500 text-yellow-500" />
                <Star className="size-4 fill-yellow-500 text-yellow-500" />
                <Star className="size-4 fill-yellow-500 text-yellow-500" />
                <Star className="size-4 fill-yellow-500 text-yellow-500" />
                <span className="ml-2 font-semibold">4.9/5</span>
                <span className="text-muted-foreground">(1,247 reviews)</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild className="group h-14 px-8 text-lg" size="lg">
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-14 px-8 text-lg"
                size="lg"
                variant="outline"
              >
                <Link href="/pricing">
                  <CreditCard className="mr-2 size-5" />
                  See pricing
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <span>No lock-in contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Dashboard preview image */}
          <div className="relative mx-auto mt-16 max-w-6xl">
            <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-background/80 shadow-2xl backdrop-blur-sm">
              <div className="-z-10 absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <div className="aspect-video w-full bg-muted/30" />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM/AGITATION SECTION */}
      <section className="border-border/50 border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 font-bold text-3xl md:text-4xl">
              Tired of Overpaying for Complicated Software?
            </h2>
            <p className="mb-12 text-foreground/70 text-xl leading-relaxed">
              ServiceTitan, Housecall Pro, and Jobber charge{" "}
              <strong>$300-$500/month</strong> and require expensive training,
              long contracts, and hidden fees. You deserve better.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Problem 1 */}
              <div className="rounded-xl border border-red-500/20 bg-background p-6">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-red-500/10">
                  <DollarSign className="size-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">
                  Expensive Monthly Fees
                </h3>
                <p className="text-muted-foreground text-sm">
                  ServiceTitan averages <strong>$398/month</strong> per user.
                  That&apos;s <strong>$4,776/year</strong> for features you
                  don&apos;t need.
                </p>
              </div>

              {/* Problem 2 */}
              <div className="rounded-xl border border-orange-500/20 bg-background p-6">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-orange-500/10">
                  <Clock className="size-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">Slow & Clunky</h3>
                <p className="text-muted-foreground text-sm">
                  Simple tasks take <strong>dozens of clicks</strong>. Your
                  office staff wastes <strong>2+ hours daily</strong> navigating
                  menus.
                </p>
              </div>

              {/* Problem 3 */}
              <div className="rounded-xl border border-yellow-500/20 bg-background p-6">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-yellow-500/10">
                  <AlertCircle className="size-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">No AI Features</h3>
                <p className="text-muted-foreground text-sm">
                  Legacy platforms don&apos;t have AI assistants, automated
                  calling, or intelligent monitoring. You&apos;re stuck in 2015.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI ASSISTANT HERO FEATURE */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Section header */}
            <div className="mb-12 text-center">
              <div className="mb-4 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm backdrop-blur-sm">
                  <Brain className="size-4 text-primary" />
                  <span className="font-medium">
                    Game-Changing AI Assistant
                  </span>
                </div>
              </div>
              <h2 className="mb-4 font-bold text-4xl md:text-5xl">
                Your AI Business Partner That{" "}
                <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  Does Everything
                </span>
              </h2>
              <p className="mx-auto max-w-3xl text-foreground/70 text-xl">
                Just ask. The AI assistant sends invoices, schedules jobs,
                updates customers, generates reports, and monitors your business
                24/7 - all through natural conversation.
              </p>
            </div>

            {/* AI Capabilities Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* AI Feature 1 */}
              <div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-blue-500/5 to-transparent p-6 transition-all hover:border-blue-500/20 hover:shadow-blue-500/10 hover:shadow-lg">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <MessageSquare className="size-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">
                  Natural Language Commands
                </h3>
                <p className="text-muted-foreground text-sm">
                  &quot;Send invoice to John&quot; - Done. No clicking through 5
                  menus. Just ask and it happens.
                </p>
              </div>

              {/* AI Feature 2 */}
              <div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-green-500/5 to-transparent p-6 transition-all hover:border-green-500/20 hover:shadow-green-500/10 hover:shadow-lg">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-green-500/10">
                  <Phone className="size-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">
                  24/7 AI Phone System
                </h3>
                <p className="text-muted-foreground text-sm">
                  AI answers calls, books appointments, and follows up with
                  customers - even at 2 AM. Never miss a lead.
                </p>
              </div>

              {/* AI Feature 3 */}
              <div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-purple-500/5 to-transparent p-6 transition-all hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <Shield className="size-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">
                  Intelligent Monitoring
                </h3>
                <p className="text-muted-foreground text-sm">
                  AI watches for price changes, missing photos, billing errors -
                  and alerts you before they cost money.
                </p>
              </div>

              {/* AI Feature 4 */}
              <div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-orange-500/5 to-transparent p-6 transition-all hover:border-orange-500/20 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-orange-500/10">
                  <DollarSign className="size-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">
                  Auto Payment Recovery
                </h3>
                <p className="text-muted-foreground text-sm">
                  AI calls customers with overdue invoices and collects
                  payments. Recover <strong>$15K+/month</strong> automatically.
                </p>
              </div>

              {/* AI Feature 5 */}
              <div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-cyan-500/5 to-transparent p-6 transition-all hover:border-cyan-500/20 hover:shadow-cyan-500/10 hover:shadow-lg">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Calendar className="size-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">Smart Scheduling</h3>
                <p className="text-muted-foreground text-sm">
                  &quot;Schedule Sarah tomorrow at 2pm&quot; - AI finds the best
                  tech, creates the appointment, notifies everyone.
                </p>
              </div>

              {/* AI Feature 6 */}
              <div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-pink-500/5 to-transparent p-6 transition-all hover:border-pink-500/20 hover:shadow-lg hover:shadow-pink-500/10">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-pink-500/10">
                  <BarChart3 className="size-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">
                  Instant Reporting
                </h3>
                <p className="text-muted-foreground text-sm">
                  &quot;What&apos;s my profit today?&quot; - AI calculates
                  revenue, costs, and shows breakdown in seconds.
                </p>
              </div>
            </div>

            {/* AI ROI Stats */}
            <div className="mt-12 grid gap-6 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-8 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 font-bold text-3xl text-primary">35%</div>
                <p className="text-muted-foreground text-sm">
                  More leads converted
                </p>
              </div>
              <div className="text-center">
                <div className="mb-2 font-bold text-3xl text-primary">80%</div>
                <p className="text-muted-foreground text-sm">Fewer no-shows</p>
              </div>
              <div className="text-center">
                <div className="mb-2 font-bold text-3xl text-primary">$15K</div>
                <p className="text-muted-foreground text-sm">
                  Monthly recovery
                </p>
              </div>
              <div className="text-center">
                <div className="mb-2 font-bold text-3xl text-primary">24/7</div>
                <p className="text-muted-foreground text-sm">
                  Never miss a call
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPLETE PLATFORM FEATURES */}
      <section className="border-border/50 border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-bold text-4xl md:text-5xl">
                Everything You Need to{" "}
                <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  Run & Grow
                </span>
              </h2>
              <p className="mx-auto max-w-3xl text-foreground/70 text-xl">
                From scheduling to invoicing, payroll to marketing - one
                complete platform with zero integration hassles.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-xl border border-primary/10 bg-background p-6">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Smart Scheduling</h3>
                <p className="mb-3 text-muted-foreground text-sm">
                  4 view types: Timeline, Calendar, Map, Gantt Chart. Drag-drop
                  dispatch with AI optimization.
                </p>
                <div className="flex items-center gap-1 text-primary text-xs">
                  <CheckCircle2 className="size-3" />
                  <span>Route optimization built-in</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl border border-primary/10 bg-background p-6">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Invoicing & Payments</h3>
                <p className="mb-3 text-muted-foreground text-sm">
                  Create invoices in seconds. Accept credit cards, ACH, checks.{" "}
                  <strong>0% payment fees</strong>.
                </p>
                <div className="flex items-center gap-1 text-primary text-xs">
                  <CheckCircle2 className="size-3" />
                  <span>QuickBooks sync included</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl border border-primary/10 bg-background p-6">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Customer Portal</h3>
                <p className="mb-3 text-muted-foreground text-sm">
                  Customers book online, view invoices, pay bills, and track
                  technicians in real-time.
                </p>
                <div className="flex items-center gap-1 text-primary text-xs">
                  <CheckCircle2 className="size-3" />
                  <span>Reduce admin calls by 60%</span>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="rounded-xl border border-primary/10 bg-background p-6">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Mobile Field App</h3>
                <p className="mb-3 text-muted-foreground text-sm">
                  Technicians view jobs, create invoices, capture photos, and
                  collect payments on-site.
                </p>
                <div className="flex items-center gap-1 text-primary text-xs">
                  <CheckCircle2 className="size-3" />
                  <span>iOS & Android apps</span>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="rounded-xl border border-primary/10 bg-background p-6">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Payroll & Commission</h3>
                <p className="mb-3 text-muted-foreground text-sm">
                  Automated commission tracking. Integration with QuickBooks
                  Payroll. Pay techs faster.
                </p>
                <div className="flex items-center gap-1 text-primary text-xs">
                  <CheckCircle2 className="size-3" />
                  <span>Save 5+ hours weekly</span>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="rounded-xl border border-primary/10 bg-background p-6">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Marketing Automation</h3>
                <p className="mb-3 text-muted-foreground text-sm">
                  Automated review requests, email campaigns, SMS reminders, and
                  Facebook/Google ads tracking.
                </p>
                <div className="flex items-center gap-1 text-primary text-xs">
                  <CheckCircle2 className="size-3" />
                  <span>Get 5x more 5-star reviews</span>
                </div>
              </div>

              {/* Feature 7 */}
              <div className="rounded-xl border border-primary/10 bg-background p-6">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Wrench className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Equipment & Maintenance</h3>
                <p className="mb-3 text-muted-foreground text-sm">
                  Track equipment, service history, warranties. Auto-schedule
                  recurring maintenance.
                </p>
                <div className="flex items-center gap-1 text-primary text-xs">
                  <CheckCircle2 className="size-3" />
                  <span>Never miss a maintenance</span>
                </div>
              </div>

              {/* Feature 8 */}
              <div className="rounded-xl border border-primary/10 bg-background p-6">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Analytics & Reporting</h3>
                <p className="mb-3 text-muted-foreground text-sm">
                  Real-time dashboards, custom reports, KPI tracking. Know your
                  numbers instantly.
                </p>
                <div className="flex items-center gap-1 text-primary text-xs">
                  <CheckCircle2 className="size-3" />
                  <span>Data-driven decisions</span>
                </div>
              </div>

              {/* Feature 9 */}
              <div className="rounded-xl border border-primary/10 bg-background p-6">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">QuickBooks Integration</h3>
                <p className="mb-3 text-muted-foreground text-sm">
                  Two-way sync with QuickBooks Online. Invoices, payments, and
                  expenses sync automatically.
                </p>
                <div className="flex items-center gap-1 text-primary text-xs">
                  <CheckCircle2 className="size-3" />
                  <span>No double-entry bookkeeping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING COMPARISON - SOCIAL PROOF */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-bold text-4xl md:text-5xl">
                Same Features,{" "}
                <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent dark:from-green-400 dark:to-green-300">
                  90% Less Cost
                </span>
              </h2>
              <p className="mx-auto max-w-3xl text-foreground/70 text-xl">
                Why pay $4,776/year for ServiceTitan when Thorbis gives you more
                for just $1,200/year plus pay-as-you-go usage?
              </p>
            </div>

            {/* Comparison table */}
            <div className="overflow-hidden rounded-2xl border border-primary/10">
              <div className="grid md:grid-cols-4">
                {/* Header row */}
                <div className="border-border/50 border-b bg-muted/50 p-6">
                  <h3 className="font-semibold">Features</h3>
                </div>
                <div className="border-border/50 border-b border-l bg-muted/50 p-6 text-center">
                  <h3 className="font-semibold">ServiceTitan</h3>
                  <p className="mt-1 text-muted-foreground text-sm">$398/mo</p>
                </div>
                <div className="border-border/50 border-b border-l bg-muted/50 p-6 text-center">
                  <h3 className="font-semibold">Housecall Pro</h3>
                  <p className="mt-1 text-muted-foreground text-sm">$289/mo</p>
                </div>
                <div className="relative border-border/50 border-b border-l bg-primary/5 p-6 text-center">
                  <div className="-translate-y-1/2 absolute top-0 right-0 translate-x-0">
                    <span className="rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground text-xs">
                      BEST VALUE
                    </span>
                  </div>
                  <h3 className="font-semibold">Thorbis</h3>
                  <p className="mt-1 text-primary text-sm">$100/mo + usage</p>
                </div>

                {/* AI Assistant */}
                <div className="border-border/50 border-b bg-background p-6">
                  <p className="font-medium text-sm">AI Assistant</p>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-red-600 dark:text-red-400">✗</span>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-red-600 dark:text-red-400">✗</span>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>

                {/* 24/7 AI Phone System */}
                <div className="border-border/50 border-b bg-background p-6">
                  <p className="font-medium text-sm">24/7 AI Phone System</p>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-red-600 dark:text-red-400">✗</span>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-red-600 dark:text-red-400">✗</span>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>

                {/* Scheduling */}
                <div className="border-border/50 border-b bg-background p-6">
                  <p className="font-medium text-sm">Smart Scheduling</p>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>

                {/* Invoicing */}
                <div className="border-border/50 border-b bg-background p-6">
                  <p className="font-medium text-sm">Invoicing & Payments</p>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>

                {/* QuickBooks Sync */}
                <div className="border-border/50 border-b bg-background p-6">
                  <p className="font-medium text-sm">QuickBooks Sync</p>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>
                <div className="border-border/50 border-b border-l bg-background p-6 text-center">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>

                {/* Payment Processing Fees */}
                <div className="border-border/50 bg-background p-6">
                  <p className="font-medium text-sm">Payment Processing Fees</p>
                </div>
                <div className="border-border/50 border-l bg-background p-6 text-center">
                  <span className="text-muted-foreground text-sm">2.9%+</span>
                </div>
                <div className="border-border/50 border-l bg-background p-6 text-center">
                  <span className="text-muted-foreground text-sm">2.9%+</span>
                </div>
                <div className="border-border/50 border-l bg-background p-6 text-center">
                  <span className="font-semibold text-primary text-sm">0%</span>
                </div>
              </div>
            </div>

            {/* Savings calculator */}
            <div className="mt-12 rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-8 text-center">
              <h3 className="mb-4 font-bold text-2xl">
                Save{" "}
                <span className="text-green-600 dark:text-green-400">
                  $4,188/year
                </span>{" "}
                by Switching to Thorbis
              </h3>
              <p className="mb-6 text-foreground/70">
                That&apos;s enough to hire another technician, buy new tools, or
                invest in marketing. Why waste it on expensive software?
              </p>
              <Button asChild className="group" size="lg">
                <Link href="/register">
                  Start Saving Now
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - TESTIMONIALS */}
      <section className="border-border/50 border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-bold text-4xl md:text-5xl">
                Join 5,000+ Growing Businesses
              </h2>
              <p className="mx-auto max-w-3xl text-foreground/70 text-xl">
                See what real business owners say about switching from
                ServiceTitan and Housecall Pro to Thorbis.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Testimonial 1 */}
              <div className="rounded-xl border border-primary/10 bg-background p-6">
                <div className="mb-4 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      className="size-4 fill-yellow-500 text-yellow-500"
                      key={i}
                    />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed">
                  &quot;We were paying ServiceTitan $398/month and barely using
                  half the features. Switched to Thorbis and saved $4,000/year.
                  The AI assistant alone is worth 10x the price.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10" />
                  <div>
                    <p className="font-semibold text-sm">Mike Rodriguez</p>
                    <p className="text-muted-foreground text-xs">
                      Rodriguez HVAC, Phoenix AZ
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="rounded-xl border border-primary/10 bg-background p-6">
                <div className="mb-4 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      className="size-4 fill-yellow-500 text-yellow-500"
                      key={i}
                    />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed">
                  &quot;The AI phone system books appointments while I sleep.
                  We&apos;re getting 30% more leads and our no-show rate dropped
                  from 25% to 5%. This is the future.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10" />
                  <div>
                    <p className="font-semibold text-sm">Sarah Chen</p>
                    <p className="text-muted-foreground text-xs">
                      Chen Plumbing, San Francisco CA
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="rounded-xl border border-primary/10 bg-background p-6">
                <div className="mb-4 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      className="size-4 fill-yellow-500 text-yellow-500"
                      key={i}
                    />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed">
                  &quot;Housecall Pro was too limited. ServiceTitan was too
                  expensive. Thorbis is the perfect middle ground - powerful,
                  affordable, and incredibly easy to use.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10" />
                  <div>
                    <p className="font-semibold text-sm">James Williams</p>
                    <p className="text-muted-foreground text-xs">
                      Williams Electric, Austin TX
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRY-SPECIFIC */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-bold text-4xl md:text-5xl">
                Built for Your Industry
              </h2>
              <p className="mx-auto max-w-3xl text-foreground/70 text-xl">
                Thorbis works for 25+ field service industries with
                industry-specific features and workflows.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "HVAC",
                "Plumbing",
                "Electrical",
                "Landscaping",
                "Pool Service",
                "Pest Control",
                "Cleaning",
                "Roofing",
              ].map((industry) => (
                <div
                  className="flex items-center gap-3 rounded-lg border border-primary/10 bg-background p-4 transition-colors hover:bg-muted/50"
                  key={industry}
                >
                  <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  <span className="font-medium">{industry}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button asChild size="lg" variant="outline">
                <Link href="/industries">
                  View All 25+ Industries
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - URGENCY */}
      <section className="border-border/50 border-y bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm backdrop-blur-sm">
                <Zap className="size-4 text-primary" />
                <span className="font-medium">
                  Limited Time: First Month Free
                </span>
              </div>
            </div>

            <h2 className="mb-6 font-extrabold text-4xl md:text-5xl">
              Stop Overpaying. Start Growing.
            </h2>
            <p className="mb-8 text-foreground/70 text-xl">
              Join 5,000+ field service businesses saving $4,000+/year while
              growing faster with AI-powered automation.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild className="group h-14 px-8 text-lg" size="lg">
                <Link href="/register">
                  Get Started Free - No Credit Card
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-14 px-8 text-lg"
                size="lg"
                variant="outline"
              >
                <Link href="/pricing">
                  <CreditCard className="mr-2 size-5" />
                  See pricing
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <span>Free setup & migration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
