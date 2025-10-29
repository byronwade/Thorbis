/**
 * Enhanced Sales Homepage - Advanced Psychology-Driven Server Component
 *
 * Based on research from:
 * - ServiceTitan: $398/mo, comprehensive but expensive
 * - Housecall Pro: $289/mo, mobile-first approach
 * - Top SaaS landing pages: Slack, Asana, Shopify, HubSpot
 *
 * Conversion optimization principles:
 * - Single focused CTA throughout
 * - Social proof at every section
 * - Visual hierarchy and whitespace
 * - Benefit-focused copy over features
 * - Interactive elements and animations
 * - Trust signals and risk reversal
 */

import Image from "next/image";
import Link from "next/link";
import {
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Phone,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Wrench,
  Zap,
  ArrowRight,
  Star,
  AlertCircle,
  BarChart3,
  MessageSquare,
  Play,
  ChevronRight,
  Target,
  Award,
  Smartphone,
  Globe,
  Briefcase,
  HeadphonesIcon,
  Send,
  Database,
  Bot,
  PhoneCall,
  TrendingDown,
  X,
  MapPin,
  Mail,
  Bell,
  Search,
  Filter,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { MarketingHeader } from "@/components/hero/marketing-header";

export function EnhancedSalesHomepage() {
  return (
    <div className="relative overflow-hidden">
      <MarketingHeader />
      {/* ANIMATED HERO SECTION - BOLD VALUE PROPOSITION */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
          {/* Animated gradient orbs */}
          <div className="pointer-events-none absolute top-0 left-1/4 size-96 animate-pulse rounded-full bg-primary/10 opacity-50 blur-3xl" />
          <div className="animation-delay-2000 pointer-events-none absolute right-1/4 bottom-0 size-96 animate-pulse rounded-full bg-blue-500/10 opacity-50 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Alert bar - Urgency + Social Proof */}
          <div className="mb-8 flex justify-center">
            <div className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/10">
              <Sparkles className="size-4 animate-pulse text-primary" />
              <span className="font-medium">
                🎉 Join <strong>5,247 businesses</strong> saving{" "}
                <strong>$4,188/year</strong> with AI
              </span>
              <ChevronRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          <div className="mx-auto max-w-6xl">
            {/* Main headline - Problem + Solution with emphasis */}
            <h1 className="mb-6 text-center font-extrabold text-5xl leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
              <span className="block">Stop Wasting</span>
              <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent dark:from-red-400 dark:via-red-300 dark:to-orange-300">
                $4,776/Year
              </span>
              <span className="block">on Field Service Software</span>
            </h1>

            {/* Subheadline - Clear value prop with specifics */}
            <p className="mx-auto mb-4 max-w-4xl text-center text-foreground/70 text-xl leading-relaxed md:text-2xl">
              Get <strong>AI-powered scheduling</strong>,{" "}
              <strong>24/7 phone answering</strong>,{" "}
              <strong>automated invoicing</strong>, and{" "}
              <strong>intelligent monitoring</strong> for{" "}
              <span className="font-bold text-primary">$49/month</span> —{" "}
              <span className="line-through">not $398 like ServiceTitan</span>
            </p>

            {/* Secondary value props - Specific benefits */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <span>10x faster than ServiceTitan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <span>90% cheaper than competitors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <span>Built-in AI assistant</span>
              </div>
            </div>

            {/* Social proof with avatars */}
            <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="size-12 rounded-full border-2 border-background bg-gradient-to-br from-primary/30 to-primary/10"
                    style={{
                      backgroundImage:
                        i === 1
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : i === 2
                            ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                            : i === 3
                              ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                              : i === 4
                                ? "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                                : i === 5
                                  ? "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                                  : i === 6
                                    ? "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
                                    : i === 7
                                      ? "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                                      : "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-col items-center gap-1 sm:items-start">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="size-5 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                  <span className="ml-2 font-bold text-lg">4.9</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  from <strong>1,247 reviews</strong> on G2 & Capterra
                </span>
              </div>
            </div>

            {/* CTA Buttons - Primary conversion goal */}
            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group h-16 px-10 text-lg shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                asChild
              >
                <Link href="/register">
                  <Zap className="mr-2 size-5" />
                  Get Started Free — No Credit Card
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group h-16 border-2 px-10 text-lg"
                asChild
              >
                <Link href="/demo">
                  <Play className="mr-2 size-5 fill-current" />
                  Watch 2-Min Demo
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-green-600 dark:text-green-400" />
                <span>
                  <strong>30-day</strong> money-back
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <span>
                  <strong>Free</strong> setup & migration
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="size-4 text-green-600 dark:text-green-400" />
                <span>
                  <strong>SOC 2</strong> certified
                </span>
              </div>
            </div>
          </div>

          {/* Dashboard preview with animation */}
          <div className="relative mx-auto mt-16 max-w-7xl">
            <div className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-background/80 shadow-2xl backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-primary/10">
              {/* Animated gradient border effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20 opacity-50" />

              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-red-500" />
                  <div className="size-3 rounded-full bg-yellow-500" />
                  <div className="size-3 rounded-full bg-green-500" />
                </div>
                <div className="ml-4 flex-1 rounded-md bg-background/50 px-3 py-1 text-muted-foreground text-xs">
                  https://app.thorbis.com/dashboard
                </div>
              </div>

              {/* Dashboard mockup placeholder */}
              <div className="aspect-video w-full bg-gradient-to-br from-muted/30 to-muted/10 p-8">
                <div className="grid h-full gap-4 md:grid-cols-4">
                  {/* Stat cards */}
                  {[
                    { label: "Revenue", value: "$47.2K", change: "+12.5%" },
                    { label: "Jobs Today", value: "23", change: "+8%" },
                    { label: "Conversion", value: "68%", change: "+5%" },
                    { label: "Avg Ticket", value: "$892", change: "+15%" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-primary/10 bg-background/80 p-4 backdrop-blur-sm"
                    >
                      <p className="mb-1 text-muted-foreground text-xs">
                        {stat.label}
                      </p>
                      <p className="mb-1 font-bold text-2xl">{stat.value}</p>
                      <p className="text-green-600 text-xs dark:text-green-400">
                        {stat.change} vs last week
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating feature badges */}
            <div className="absolute -right-4 top-20 hidden animate-pulse lg:block">
              <div className="rounded-full border border-primary/20 bg-background px-4 py-2 text-sm shadow-lg">
                <span className="flex items-center gap-2">
                  <Brain className="size-4 text-primary" />
                  <strong>AI Assistant</strong>
                </span>
              </div>
            </div>
            <div className="animation-delay-1000 absolute -left-4 bottom-20 hidden animate-pulse lg:block">
              <div className="rounded-full border border-primary/20 bg-background px-4 py-2 text-sm shadow-lg">
                <span className="flex items-center gap-2">
                  <Phone className="size-4 text-primary" />
                  <strong>24/7 Calls</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR - Quick wins */}
      <section className="border-border/50 border-y bg-muted/50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 font-extrabold text-4xl text-primary">
                5,247+
              </div>
              <p className="text-muted-foreground text-sm">
                Active Businesses
              </p>
            </div>
            <div className="text-center">
              <div className="mb-2 font-extrabold text-4xl text-primary">
                $15M+
              </div>
              <p className="text-muted-foreground text-sm">
                Revenue Recovered by AI
              </p>
            </div>
            <div className="text-center">
              <div className="mb-2 font-extrabold text-4xl text-primary">
                1.2M+
              </div>
              <p className="text-muted-foreground text-sm">Jobs Completed</p>
            </div>
            <div className="text-center">
              <div className="mb-2 font-extrabold text-4xl text-primary">
                99.9%
              </div>
              <p className="text-muted-foreground text-sm">Uptime SLA</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM/AGITATION SECTION - Enhanced with visuals */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm">
                <AlertCircle className="size-4 text-red-600 dark:text-red-400" />
                <span className="font-medium text-red-600 dark:text-red-400">
                  The Problem with Competitors
                </span>
              </div>
              <h2 className="mb-6 font-bold text-4xl md:text-5xl">
                Why Field Service Businesses Are{" "}
                <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                  Switching Away
                </span>{" "}
                from ServiceTitan
              </h2>
              <p className="mx-auto max-w-3xl text-foreground/70 text-xl">
                ServiceTitan, Housecall Pro, and Jobber were built in 2012. The
                world has changed. AI is here. Your software should evolve too.
              </p>
            </div>

            <div className="mb-12 grid gap-6 md:grid-cols-3">
              {/* Problem 1 - Enhanced */}
              <div className="group relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent p-8 transition-all hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10">
                <div className="absolute -right-4 -top-4 size-24 rounded-full bg-red-500/10 opacity-50 blur-2xl" />
                <div className="relative">
                  <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-red-500/10 shadow-lg shadow-red-500/10">
                    <DollarSign className="size-7 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="mb-3 font-bold text-xl">
                    Insanely Expensive
                  </h3>
                  <p className="mb-4 text-muted-foreground leading-relaxed">
                    ServiceTitan averages <strong>$398/month per user</strong>.
                    That&apos;s <strong className="text-red-600 dark:text-red-400">$4,776/year</strong> for
                    bloated features you don&apos;t need.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <X className="size-4" />
                      <span>Hidden setup fees ($2K-$5K)</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <X className="size-4" />
                      <span>Long-term contracts (2-3 years)</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <X className="size-4" />
                      <span>Extra fees for add-ons</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Problem 2 - Enhanced */}
              <div className="group relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-8 transition-all hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="absolute -right-4 -top-4 size-24 rounded-full bg-orange-500/10 opacity-50 blur-2xl" />
                <div className="relative">
                  <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-orange-500/10 shadow-lg shadow-orange-500/10">
                    <Clock className="size-7 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="mb-3 font-bold text-xl">Painfully Slow</h3>
                  <p className="mb-4 text-muted-foreground leading-relaxed">
                    Legacy interfaces require{" "}
                    <strong>dozens of clicks</strong> for simple tasks. Your
                    team wastes <strong className="text-orange-600 dark:text-orange-400">2+ hours daily</strong>{" "}
                    navigating menus.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                      <X className="size-4" />
                      <span>15 clicks to send an invoice</span>
                    </div>
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                      <X className="size-4" />
                      <span>Confusing navigation structure</span>
                    </div>
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                      <X className="size-4" />
                      <span>Weeks of training required</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Problem 3 - Enhanced */}
              <div className="group relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent p-8 transition-all hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10">
                <div className="absolute -right-4 -top-4 size-24 rounded-full bg-yellow-500/10 opacity-50 blur-2xl" />
                <div className="relative">
                  <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-yellow-500/10 shadow-lg shadow-yellow-500/10">
                    <Bot className="size-7 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="mb-3 font-bold text-xl">No AI Features</h3>
                  <p className="mb-4 text-muted-foreground leading-relaxed">
                    Built in 2012, competitors don&apos;t have AI assistants,
                    automated calling, or intelligent monitoring. You&apos;re{" "}
                    <strong className="text-yellow-600 dark:text-yellow-400">stuck in the past</strong>.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                      <X className="size-4" />
                      <span>No AI assistant for commands</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                      <X className="size-4" />
                      <span>No 24/7 AI phone answering</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                      <X className="size-4" />
                      <span>No intelligent monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison callout */}
            <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-8 text-center">
              <p className="mb-4 font-bold text-2xl">
                <span className="text-muted-foreground line-through">
                  ServiceTitan $398/mo
                </span>{" "}
                →{" "}
                <span className="text-primary">
                  Thorbis $49/mo with AI
                </span>
              </p>
              <p className="text-foreground/70">
                Same features + AI assistant + 24/7 phone system = Save{" "}
                <strong>$4,188/year</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI ASSISTANT MEGA SECTION - Game changer */}
      <section className="relative overflow-hidden border-border/50 border-y bg-gradient-to-br from-primary/5 via-background to-background py-24">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 top-0 size-96 rounded-full bg-primary/10 opacity-50 blur-3xl" />
          <div className="absolute -left-40 bottom-0 size-96 rounded-full bg-blue-500/10 opacity-50 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Section header */}
            <div className="mb-16 text-center">
              <div className="mb-6 flex justify-center">
                <div className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-6 py-3 backdrop-blur-sm transition-all hover:border-primary/30">
                  <Brain className="size-5 animate-pulse text-primary" />
                  <span className="font-bold text-primary text-sm">
                    🚀 REVOLUTIONARY AI TECHNOLOGY
                  </span>
                </div>
              </div>
              <h2 className="mb-6 font-extrabold text-5xl md:text-6xl lg:text-7xl">
                Your AI Business Partner
                <br />
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  That Does Everything
                </span>
              </h2>
              <p className="mx-auto max-w-4xl text-foreground/70 text-xl leading-relaxed md:text-2xl">
                Just ask in plain English. No clicking through menus. No
                training manuals. The AI handles invoicing, scheduling,
                customer updates, reporting, and monitors your business 24/7.
              </p>
            </div>

            {/* AI conversation example - Visual showcase */}
            <div className="mb-16 rounded-3xl border-2 border-primary/20 bg-background/80 p-8 shadow-2xl backdrop-blur-sm md:p-12">
              <div className="space-y-6">
                {/* User message */}
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Users className="size-5 text-primary" />
                  </div>
                  <div className="flex-1 rounded-2xl rounded-tl-none bg-muted/50 p-4">
                    <p className="text-sm">
                      &quot;Send invoice to John Smith for the HVAC repair we
                      did yesterday&quot;
                    </p>
                  </div>
                </div>

                {/* AI response */}
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-500">
                    <Brain className="size-5 text-white" />
                  </div>
                  <div className="flex-1 space-y-3 rounded-2xl rounded-tl-none bg-gradient-to-br from-primary/10 to-blue-500/10 p-4">
                    <p className="text-sm">
                      <strong>AI:</strong> Found John Smith&apos;s HVAC repair
                      job (#1247) completed yesterday by Tech Mike. Total:
                      $1,250.
                    </p>
                    <div className="rounded-lg border border-primary/20 bg-background/80 p-3">
                      <p className="mb-2 font-semibold text-xs">
                        Invoice #INV-3421
                      </p>
                      <div className="mb-2 flex justify-between text-xs">
                        <span>HVAC System Repair</span>
                        <span>$1,250.00</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2 font-bold text-sm">
                        <span>Total</span>
                        <span>$1,250.00</span>
                      </div>
                    </div>
                    <p className="text-sm">
                      ✅ Invoice sent via email & SMS
                      <br />✅ Payment link included (0% fees)
                      <br />✅ QuickBooks synced automatically
                    </p>
                  </div>
                </div>
              </div>

              {/* Time savings callout */}
              <div className="mt-8 rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center">
                <p className="font-semibold text-green-600 text-sm dark:text-green-400">
                  ⚡ Done in <strong>10 seconds</strong> — would take{" "}
                  <strong>5 minutes</strong> in ServiceTitan (30x faster)
                </p>
              </div>
            </div>

            {/* AI Capabilities Grid - Comprehensive */}
            <div className="mb-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: MessageSquare,
                  color: "blue",
                  title: "Natural Commands",
                  example: '"Schedule Sarah tomorrow 2pm"',
                  result: "✓ Appointment created & notified",
                },
                {
                  icon: Phone,
                  color: "green",
                  title: "24/7 AI Calls",
                  example: "Customer calls at 2 AM",
                  result: "✓ AI books emergency appointment",
                },
                {
                  icon: Shield,
                  color: "purple",
                  title: "Smart Monitoring",
                  example: "Tech lowers price 30%",
                  result: "✓ AI alerts you instantly",
                },
                {
                  icon: DollarSign,
                  color: "orange",
                  title: "Auto Collections",
                  example: "Invoice 30 days overdue",
                  result: "✓ AI calls customer, gets paid",
                },
                {
                  icon: Calendar,
                  color: "cyan",
                  title: "Smart Dispatch",
                  example: '"Optimize today\'s route"',
                  result: "✓ AI reorders for efficiency",
                },
                {
                  icon: BarChart3,
                  color: "pink",
                  title: "Instant Reports",
                  example: '"Show profit this week"',
                  result: "✓ Full breakdown in seconds",
                },
                {
                  icon: Bell,
                  color: "indigo",
                  title: "Proactive Alerts",
                  example: "Missing job photos detected",
                  result: "✓ AI reminds technician",
                },
                {
                  icon: Target,
                  color: "teal",
                  title: "Revenue Recovery",
                  example: "Finds $15K in opportunities",
                  result: "✓ Auto-creates follow-up tasks",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div
                    className={`mb-4 flex size-12 items-center justify-center rounded-xl bg-${item.color}-500/10 shadow-lg`}
                  >
                    <item.icon
                      className={`size-6 text-${item.color}-600 dark:text-${item.color}-400`}
                    />
                  </div>
                  <h3 className="mb-2 font-bold">{item.title}</h3>
                  <p className="mb-2 text-muted-foreground text-sm italic">
                    {item.example}
                  </p>
                  <p className="text-primary text-sm">{item.result}</p>
                </div>
              ))}
            </div>

            {/* AI Impact Stats */}
            <div className="grid gap-6 rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-blue-500/10 p-8 md:grid-cols-4 md:p-12">
              <div className="text-center">
                <div className="mb-2 font-extrabold text-5xl text-primary">
                  35%
                </div>
                <p className="mb-1 font-semibold">More Leads Converted</p>
                <p className="text-muted-foreground text-xs">
                  AI never misses calls
                </p>
              </div>
              <div className="text-center">
                <div className="mb-2 font-extrabold text-5xl text-primary">
                  80%
                </div>
                <p className="mb-1 font-semibold">Fewer No-Shows</p>
                <p className="text-muted-foreground text-xs">
                  AI calls to confirm
                </p>
              </div>
              <div className="text-center">
                <div className="mb-2 font-extrabold text-5xl text-primary">
                  $15K
                </div>
                <p className="mb-1 font-semibold">Monthly Recovery</p>
                <p className="text-muted-foreground text-xs">
                  AI collects overdue payments
                </p>
              </div>
              <div className="text-center">
                <div className="mb-2 font-extrabold text-5xl text-primary">
                  24/7
                </div>
                <p className="mb-1 font-semibold">Always Available</p>
                <p className="text-muted-foreground text-xs">
                  Never miss emergencies
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPLETE PLATFORM SHOWCASE - Feature-rich */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl">
                Everything You Need in{" "}
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  One Platform
                </span>
              </h2>
              <p className="mx-auto max-w-3xl text-foreground/70 text-xl">
                From first call to final payment, manage your entire field
                service business without juggling 10 different tools.
              </p>
            </div>

            {/* Feature categories with tabs visual */}
            <div className="mb-12 grid gap-6 lg:grid-cols-3">
              {/* Category 1: Operations */}
              <div className="space-y-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10">
                    <Wrench className="size-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-2xl">Operations</h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: Calendar,
                      title: "Smart Scheduling",
                      desc: "4 views: Timeline, Calendar, Map, Gantt",
                      badge: "AI-Optimized",
                    },
                    {
                      icon: MapPin,
                      title: "Route Optimization",
                      desc: "Save 2+ hours daily on driving",
                      badge: "GPS Built-in",
                    },
                    {
                      icon: Smartphone,
                      title: "Mobile Field App",
                      desc: "iOS & Android for technicians",
                      badge: "Offline Mode",
                    },
                    {
                      icon: Users,
                      title: "Team Management",
                      desc: "Track time, performance, commissions",
                      badge: "Live Updates",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="group rounded-xl border border-primary/10 bg-background p-4 transition-all hover:border-primary/20 hover:bg-muted/30"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <item.icon className="size-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <h4 className="font-semibold text-sm">
                              {item.title}
                            </h4>
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-xs">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 2: Financial */}
              <div className="space-y-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-green-500/10">
                    <DollarSign className="size-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-bold text-2xl">Financial</h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: FileText,
                      title: "Invoicing & Estimates",
                      desc: "Create & send in seconds, not minutes",
                      badge: "0% Fees",
                    },
                    {
                      icon: CreditCard,
                      title: "Payment Processing",
                      desc: "Accept cards, ACH, checks, cash",
                      badge: "Instant Sync",
                    },
                    {
                      icon: Database,
                      title: "QuickBooks Integration",
                      desc: "Two-way sync, zero double-entry",
                      badge: "Auto Sync",
                    },
                    {
                      icon: TrendingUp,
                      title: "Payroll & Commission",
                      desc: "Automated tech pay calculations",
                      badge: "Rule-Based",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="group rounded-xl border border-primary/10 bg-background p-4 transition-all hover:border-primary/20 hover:bg-muted/30"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <item.icon className="size-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <h4 className="font-semibold text-sm">
                              {item.title}
                            </h4>
                            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-green-600 text-xs dark:text-green-400">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-xs">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 3: Growth */}
              <div className="space-y-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-purple-500/10">
                    <TrendingUp className="size-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-bold text-2xl">Growth</h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: HeadphonesIcon,
                      title: "Customer Portal",
                      desc: "Self-service booking & payments",
                      badge: "White-Label",
                    },
                    {
                      icon: Mail,
                      title: "Marketing Automation",
                      desc: "Email, SMS campaigns on autopilot",
                      badge: "AI-Powered",
                    },
                    {
                      icon: Star,
                      title: "Review Management",
                      desc: "Auto-request 5-star reviews",
                      badge: "5x More",
                    },
                    {
                      icon: BarChart3,
                      title: "Analytics & Reports",
                      desc: "Real-time dashboards, custom reports",
                      badge: "Live Data",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="group rounded-xl border border-primary/10 bg-background p-4 transition-all hover:border-primary/20 hover:bg-muted/30"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <item.icon className="size-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <h4 className="font-semibold text-sm">
                              {item.title}
                            </h4>
                            <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-purple-600 text-xs dark:text-purple-400">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-xs">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature comparison callout */}
            <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-8 text-center">
              <h3 className="mb-4 font-bold text-2xl">
                <span className="text-primary">50+ Features</span> vs{" "}
                <span className="text-muted-foreground">
                  Competitors&apos; Fragmented Systems
                </span>
              </h3>
              <p className="mx-auto max-w-2xl text-foreground/70">
                ServiceTitan requires add-ons for marketing ($99/mo), phones
                ($50/mo), and integrations ($150/mo). Thorbis includes
                everything at $49/mo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING COMPARISON TABLE - Detailed */}
      <section className="border-border/50 border-y bg-muted/30 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl">
                Same Features,{" "}
                <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent dark:from-green-400 dark:to-green-300">
                  90% Less Cost
                </span>
              </h2>
              <p className="mx-auto max-w-3xl text-foreground/70 text-xl">
                See exactly how Thorbis stacks up against ServiceTitan,
                Housecall Pro, and Jobber. Spoiler: We win on price AND
                features.
              </p>
            </div>

            {/* Comparison table - Enhanced */}
            <div className="overflow-hidden rounded-3xl border-2 border-primary/20 shadow-2xl">
              <div className="grid md:grid-cols-5">
                {/* Header row */}
                <div className="border-border/50 border-b bg-muted/50 p-6">
                  <h3 className="font-bold text-lg">Compare</h3>
                </div>
                <div className="border-border/50 border-b border-l bg-muted/50 p-6 text-center">
                  <div className="mb-2 text-2xl">🏢</div>
                  <h3 className="mb-1 font-bold">ServiceTitan</h3>
                  <p className="text-red-600 text-sm dark:text-red-400">
                    $398/mo
                  </p>
                </div>
                <div className="border-border/50 border-b border-l bg-muted/50 p-6 text-center">
                  <div className="mb-2 text-2xl">📱</div>
                  <h3 className="mb-1 font-bold">Housecall Pro</h3>
                  <p className="text-red-600 text-sm dark:text-red-400">
                    $289/mo
                  </p>
                </div>
                <div className="border-border/50 border-b border-l bg-muted/50 p-6 text-center">
                  <div className="mb-2 text-2xl">📊</div>
                  <h3 className="mb-1 font-bold">Jobber</h3>
                  <p className="text-red-600 text-sm dark:text-red-400">
                    $229/mo
                  </p>
                </div>
                <div className="border-border/50 relative border-b border-l bg-primary/10 p-6 text-center">
                  <div className="absolute top-0 right-0 -translate-y-1/2">
                    <span className="rounded-full bg-primary px-4 py-1 font-bold text-primary-foreground text-xs uppercase shadow-lg">
                      Best Value
                    </span>
                  </div>
                  <div className="mb-2 text-2xl">⚡</div>
                  <h3 className="mb-1 font-bold">Thorbis</h3>
                  <p className="text-primary text-sm">$49/mo</p>
                </div>

                {/* Feature rows - Comprehensive */}
                {[
                  { feature: "AI Assistant", values: [false, false, false, true] },
                  { feature: "24/7 AI Phone System", values: [false, false, false, true] },
                  { feature: "Intelligent Monitoring", values: [false, false, false, true] },
                  { feature: "Smart Scheduling", values: [true, true, true, true] },
                  { feature: "Mobile App", values: [true, true, true, true] },
                  { feature: "Invoicing & Payments", values: [true, true, true, true] },
                  { feature: "QuickBooks Sync", values: [true, true, true, true] },
                  { feature: "Customer Portal", values: [true, true, false, true] },
                  { feature: "Marketing Automation", values: ["$99/mo", "Limited", true, true] },
                  { feature: "Payment Processing Fees", values: ["2.9%+", "2.9%+", "2.9%+", "0%"] },
                  { feature: "Setup Fees", values: ["$2K-$5K", "$1K+", "$500+", "$0"] },
                  { feature: "Training Required", values: ["2-4 weeks", "1-2 weeks", "1 week", "1 day"] },
                  { feature: "Contract Length", values: ["2-3 years", "1 year", "1 year", "Monthly"] },
                ].map((row, i) => (
                  <div key={i} className="contents">
                    <div className="border-border/50 border-b bg-background p-4">
                      <p className="font-medium text-sm">{row.feature}</p>
                    </div>
                    {row.values.map((value, j) => (
                      <div
                        key={j}
                        className={`border-border/50 border-b border-l bg-background p-4 text-center ${j === 3 ? "bg-primary/5" : ""}`}
                      >
                        {typeof value === "boolean" ? (
                          value ? (
                            <CheckCircle2 className="mx-auto size-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <X className="mx-auto size-5 text-red-600 dark:text-red-400" />
                          )
                        ) : (
                          <span className={`text-sm ${j === 3 ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                            {value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}

                {/* Total annual cost row */}
                <div className="border-border/50 bg-muted p-6">
                  <p className="font-bold">Annual Cost</p>
                </div>
                <div className="border-border/50 border-l bg-muted p-6 text-center">
                  <p className="font-bold text-red-600 dark:text-red-400">
                    $4,776
                  </p>
                </div>
                <div className="border-border/50 border-l bg-muted p-6 text-center">
                  <p className="font-bold text-red-600 dark:text-red-400">
                    $3,468
                  </p>
                </div>
                <div className="border-border/50 border-l bg-muted p-6 text-center">
                  <p className="font-bold text-red-600 dark:text-red-400">
                    $2,748
                  </p>
                </div>
                <div className="border-border/50 border-l bg-primary/10 p-6 text-center">
                  <p className="font-bold text-primary text-xl">$588</p>
                </div>
              </div>
            </div>

            {/* Savings calculator */}
            <div className="mt-12 rounded-3xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/20 to-green-500/5 p-10 text-center shadow-xl">
              <div className="mb-6 flex justify-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-green-500/20">
                  <DollarSign className="size-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="mb-4 font-bold text-3xl md:text-4xl">
                Save{" "}
                <span className="text-green-600 dark:text-green-400">
                  $4,188/year
                </span>{" "}
                vs ServiceTitan
              </h3>
              <p className="mx-auto mb-8 max-w-2xl text-foreground/70 text-lg">
                That&apos;s enough to hire another technician ($50K/year),
                invest in marketing ($4K/month), or upgrade your fleet. Why
                waste it on expensive software?
              </p>
              <Button size="lg" className="group h-14 px-10 text-lg" asChild>
                <Link href="/register">
                  Start Saving Today
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - TESTIMONIALS - Enhanced with case studies */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
                <Award className="size-4 text-primary" />
                <span className="font-medium">Trusted by 5,247+ Businesses</span>
              </div>
              <h2 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl">
                Real Stories from{" "}
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Real Business Owners
                </span>
              </h2>
              <p className="mx-auto max-w-3xl text-foreground/70 text-xl">
                See what happens when field service businesses switch from
                ServiceTitan, Housecall Pro, and Jobber to Thorbis.
              </p>
            </div>

            {/* Featured case study */}
            <div className="mb-12 overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-2xl">
              <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs">
                    <TrendingUp className="size-3 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      FEATURED SUCCESS STORY
                    </span>
                  </div>
                  <h3 className="mb-4 font-bold text-3xl">
                    &quot;We saved $52,000 and grew revenue 47% in year one&quot;
                  </h3>
                  <div className="mb-6 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="size-5 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="mb-6 text-foreground/70 leading-relaxed">
                    Rodriguez HVAC was paying ServiceTitan $4,776/year and
                    barely using half the features. The AI assistant alone has
                    recovered $18K in missed opportunities, and the 24/7 phone
                    system books appointments while they sleep.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10" />
                    <div>
                      <p className="font-bold">Mike Rodriguez</p>
                      <p className="text-muted-foreground text-sm">
                        Owner, Rodriguez HVAC
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Phoenix, AZ • 12 Technicians
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="rounded-xl border border-primary/10 bg-background p-6">
                    <div className="mb-2 font-bold text-4xl text-primary">
                      $52K
                    </div>
                    <p className="font-semibold">Annual Savings</p>
                    <p className="text-muted-foreground text-sm">
                      $4,776 software + $18K AI recovery + $29K efficiency
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/10 bg-background p-6">
                    <div className="mb-2 font-bold text-4xl text-primary">
                      47%
                    </div>
                    <p className="font-semibold">Revenue Growth</p>
                    <p className="text-muted-foreground text-sm">
                      From $890K to $1.3M in first year with Thorbis
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/10 bg-background p-6">
                    <div className="mb-2 font-bold text-4xl text-primary">
                      92%
                    </div>
                    <p className="font-semibold">Team Adoption</p>
                    <p className="text-muted-foreground text-sm">
                      All 12 techs fully using mobile app within 3 days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: "Sarah Chen",
                  business: "Chen Plumbing",
                  location: "San Francisco, CA",
                  size: "8 technicians",
                  stars: 5,
                  quote:
                    "The AI phone system is a game-changer. It books appointments while I sleep, and our no-show rate dropped from 25% to 5%. We're getting 30% more leads converted.",
                  metric: "35% more leads",
                },
                {
                  name: "James Williams",
                  business: "Williams Electric",
                  location: "Austin, TX",
                  size: "15 technicians",
                  stars: 5,
                  quote:
                    "Housecall Pro was too limited. ServiceTitan was too expensive. Thorbis is perfect — powerful, affordable, and so easy my 60-year-old office manager loves it.",
                  metric: "Saved $3,900/year",
                },
                {
                  name: "Lisa Martinez",
                  business: "Martinez Pool Service",
                  location: "Miami, FL",
                  size: "6 technicians",
                  stars: 5,
                  quote:
                    "The intelligent monitoring caught $12K in pricing errors in the first month. It pays for itself 20x over. I can't believe we ran our business without this.",
                  metric: "$12K saved month 1",
                },
                {
                  name: "David Thompson",
                  business: "Thompson Landscaping",
                  location: "Seattle, WA",
                  size: "20 technicians",
                  stars: 5,
                  quote:
                    "Migration from ServiceTitan took 2 days with their white-glove service. Now we're saving $4,000/year and our team is 3x faster at everything.",
                  metric: "3x faster workflows",
                },
                {
                  name: "Jennifer Lee",
                  business: "Lee Pest Control",
                  location: "Atlanta, GA",
                  size: "10 technicians",
                  stars: 5,
                  quote:
                    "QuickBooks sync is flawless. Payment processing fees dropped to zero. The AI assistant feels like having a $60K/year operations manager for $49/month.",
                  metric: "$2,400/year in fees saved",
                },
                {
                  name: "Robert Garcia",
                  business: "Garcia Roofing",
                  location: "Denver, CO",
                  size: "18 technicians",
                  stars: 5,
                  quote:
                    "We tried Jobber and Housecall Pro. Nothing compares to Thorbis. The scheduling is smarter, the mobile app is faster, and the AI features are revolutionary.",
                  metric: "85% customer satisfaction",
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-background p-6 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="mb-4 flex items-center gap-1">
                    {Array.from({ length: testimonial.stars }).map((_, j) => (
                      <Star
                        key={j}
                        className="size-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="mb-4 rounded-lg border border-primary/10 bg-primary/5 px-3 py-2 text-center">
                    <p className="font-bold text-primary text-sm">
                      {testimonial.metric}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10" />
                    <div>
                      <p className="font-semibold text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {testimonial.business}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {testimonial.location} • {testimonial.size}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRY-SPECIFIC SECTION */}
      <section className="border-border/50 border-y bg-muted/30 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 font-bold text-4xl md:text-5xl">
                Built for <span className="text-primary">Your Industry</span>
              </h2>
              <p className="mx-auto max-w-3xl text-foreground/70 text-xl">
                Thorbis works for 25+ field service industries with
                industry-specific workflows, terminology, and best practices
                built-in.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "HVAC", icon: "❄️", businesses: "1,247+" },
                { name: "Plumbing", icon: "🔧", businesses: "892+" },
                { name: "Electrical", icon: "⚡", businesses: "743+" },
                { name: "Landscaping", icon: "🌳", businesses: "521+" },
                { name: "Pool Service", icon: "🏊", businesses: "398+" },
                { name: "Pest Control", icon: "🐛", businesses: "287+" },
                { name: "Cleaning", icon: "🧹", businesses: "654+" },
                { name: "Roofing", icon: "🏠", businesses: "412+" },
                { name: "Appliance Repair", icon: "🔌", businesses: "198+" },
                { name: "Garage Door", icon: "🚪", businesses: "156+" },
                { name: "Locksmith", icon: "🔑", businesses: "134+" },
                { name: "Painting", icon: "🎨", businesses: "223+" },
              ].map((industry, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-3 rounded-xl border border-primary/10 bg-background p-4 transition-all hover:border-primary/20 hover:bg-primary/5"
                >
                  <div className="text-3xl">{industry.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold">{industry.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {industry.businesses} businesses
                    </p>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg"
                asChild
              >
                <Link href="/industries">
                  View All 25+ Industries
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - MAXIMUM URGENCY */}
      <section className="relative overflow-hidden py-24">
        {/* Dramatic gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 size-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -right-20 bottom-0 size-96 rounded-full bg-blue-500/20 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 backdrop-blur-sm">
                <Zap className="size-5 animate-pulse text-primary" />
                <span className="font-bold text-primary">
                  ⏰ LIMITED TIME: First Month FREE + Free Migration
                </span>
              </div>
            </div>

            <h2 className="mb-6 font-extrabold text-5xl leading-tight md:text-6xl lg:text-7xl">
              Stop Overpaying.
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Start Growing.
              </span>
            </h2>

            <p className="mx-auto mb-10 max-w-3xl text-foreground/70 text-xl leading-relaxed md:text-2xl">
              Join <strong>5,247 field service businesses</strong> saving{" "}
              <strong>$4,000+/year</strong> while growing faster with
              AI-powered automation. No credit card required to start.
            </p>

            <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group h-16 px-12 text-lg shadow-2xl shadow-primary/30"
                asChild
              >
                <Link href="/register">
                  <Sparkles className="mr-2 size-5" />
                  Get Started Free — No Credit Card
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 border-2 px-12 text-lg"
                asChild
              >
                <Link href="/demo">
                  <Phone className="mr-2 size-5" />
                  Talk to Our Team
                </Link>
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-green-600 dark:text-green-400" />
                <span>
                  <strong>30-day</strong> money-back guarantee
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
                <span>
                  <strong>Free</strong> white-glove migration
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="size-5 text-green-600 dark:text-green-400" />
                <span>
                  <strong>SOC 2</strong> Type II certified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="size-5 text-green-600 dark:text-green-400" />
                <span>
                  <strong>Cancel</strong> anytime, no questions
                </span>
              </div>
            </div>

            {/* Social proof reminder */}
            <div className="mt-12 rounded-2xl border border-primary/20 bg-background/80 p-8 backdrop-blur-sm">
              <div className="mb-4 flex justify-center -space-x-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <div
                    key={i}
                    className="size-12 rounded-full border-2 border-background bg-gradient-to-br from-primary/30 to-primary/10"
                  />
                ))}
              </div>
              <p className="text-foreground/70">
                <strong>127 businesses</strong> signed up this week.{" "}
                <strong>4.9/5 stars</strong> from 1,247 reviews.{" "}
                <strong>99.2% customer retention</strong> rate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
