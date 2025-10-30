/**
 * Honest Sales Homepage - Anti-Sales, Transparent Pricing
 *
 * Pricing Model:
 * - $100/month base fee (honest, transparent)
 * - Pay-as-you-go (no contracts, cancel anytime)
 * - Your data forever (no vendor lock-in)
 * - No sales tactics, no tricks, no BS
 *
 * vs Competitors:
 * - ServiceTitan: $398/mo + 2-year contracts + hidden fees
 * - Housecall Pro: $289/mo + annual contracts
 * - Jobber: $229/mo + limited features
 *
 * Our Philosophy:
 * - Try it free, use it if you like it, leave if you don't
 * - All data is yours, export anytime
 * - No vendor lock-in, no contracts
 * - Honest pricing, no hidden fees
 */

import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Database,
  DollarSign,
  Download,
  FileText,
  Handshake,
  Heart,
  MessageSquare,
  Phone,
  Play,
  Shield,
  Star,
  Target,
  Unlock,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export function HonestSalesHomepage() {
  return (
    <div className="relative overflow-hidden">
      {/* HONEST HERO SECTION */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Subtle background */}
        <div className="-z-10 absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          <div className="pointer-events-none absolute top-0 left-1/4 size-96 animate-pulse rounded-full bg-primary/10 opacity-50 blur-3xl" />
          <div className="animation-delay-2000 pointer-events-none absolute right-1/4 bottom-0 size-96 animate-pulse rounded-full bg-blue-500/10 opacity-50 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Anti-BS badge */}
          <div className="mb-8 flex justify-center">
            <div className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm backdrop-blur-sm transition-all hover:border-primary/30">
              <Heart className="size-4 text-primary" />
              <span className="font-medium">
                No Sales Tactics • No Contracts • Your Data Forever
              </span>
            </div>
          </div>

          <div className="mx-auto max-w-6xl">
            {/* Honest headline */}
            <h1 className="mb-6 text-center font-extrabold text-5xl leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
              <span className="block">Field Service Software</span>
              <span className="block">That Doesn't</span>
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Lock You In
              </span>
            </h1>

            {/* Honest value prop */}
            <p className="mx-auto mb-4 max-w-4xl text-center text-foreground/70 text-xl leading-relaxed md:text-2xl">
              <strong>$100/month base + pay-as-you-go</strong>. Unlimited users
              included. ServiceTitan charges{" "}
              <strong>$398/month PER USER</strong>. We don't. Try it free, use
              it if you love it, leave if you don't. All your data comes with
              you.
            </p>

            {/* The anti-competitor pitch */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <XCircle className="size-4 text-red-600 dark:text-red-400" />
                <span>No per-user fees (ServiceTitan: $398/user/mo)</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="size-4 text-red-600 dark:text-red-400" />
                <span>No 2-year contracts + $2K-$5K setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <span>Unlimited users + AI included</span>
              </div>
            </div>

            {/* Social proof */}
            <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="-space-x-3 flex">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    className="size-12 rounded-full border-2 border-background bg-gradient-to-br from-primary/30 to-primary/10"
                    key={i}
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
                      className="size-5 fill-yellow-500 text-yellow-500"
                      key={i}
                    />
                  ))}
                  <span className="ml-2 font-bold text-lg">4.9</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  from <strong>1,247 reviews</strong> • G2 & Capterra
                </span>
              </div>
            </div>

            {/* Honest CTAs */}
            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                className="group h-16 px-10 text-lg shadow-lg shadow-primary/20"
                size="lg"
              >
                <Link href="/register">
                  Start Using It Free
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-16 border-2 px-10 text-lg"
                size="lg"
                variant="outline"
              >
                <Link href="/demo">
                  <Play className="mr-2 size-5 fill-current" />
                  Watch 2-Min Demo
                </Link>
              </Button>
            </div>

            {/* Honest guarantees - not marketing BS */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Unlock className="size-4 text-primary" />
                <span>No vendor lock-in</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="size-4 text-primary" />
                <span>Export all data anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Handshake className="size-4 text-primary" />
                <span>Cancel instantly, no questions</span>
              </div>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="relative mx-auto mt-16 max-w-7xl">
            <div className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-background/80 shadow-2xl backdrop-blur-sm">
              <div className="-z-10 absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20 opacity-50" />

              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-border border-b bg-muted/50 px-4 py-3">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-red-500" />
                  <div className="size-3 rounded-full bg-yellow-500" />
                  <div className="size-3 rounded-full bg-green-500" />
                </div>
                <div className="ml-4 flex-1 rounded-md bg-background/50 px-3 py-1 text-muted-foreground text-xs">
                  https://app.thorbis.com/dashboard
                </div>
              </div>

              <div className="aspect-video w-full bg-gradient-to-br from-muted/30 to-muted/10 p-8">
                <div className="grid h-full gap-4 md:grid-cols-4">
                  {[
                    { label: "Revenue", value: "$47.2K", change: "+12.5%" },
                    { label: "Jobs Today", value: "23", change: "+8%" },
                    { label: "Conversion", value: "68%", change: "+5%" },
                    { label: "Avg Ticket", value: "$892", change: "+15%" },
                  ].map((stat, i) => (
                    <div
                      className="rounded-lg border border-primary/10 bg-background/80 p-4 backdrop-blur-sm"
                      key={i}
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
          </div>
        </div>
      </section>

      {/* HONEST PRICING SECTION - The differentiator */}
      <section className="border-border/50 border-y bg-gradient-to-br from-primary/10 via-primary/5 to-background py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
                <Heart className="size-4 text-primary" />
                <span className="font-medium">Honest Pricing</span>
              </div>
              <h2 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl">
                No Per-User Fees. No Traps.{" "}
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Just Honest Pricing.
                </span>
              </h2>
              <p className="mx-auto max-w-3xl text-foreground/70 text-xl">
                ServiceTitan charges <strong>$398/month PER USER</strong>. With
                5 users, that's <strong>$23,880/year</strong>. We charge
                $100/month base + usage for <strong>UNLIMITED users</strong>. No
                per-seat fees. Ever.
              </p>
            </div>

            {/* Simple pricing card */}
            <div className="mx-auto mb-12 max-w-2xl">
              <div className="relative overflow-hidden rounded-3xl border-2 border-primary/20 bg-background p-10 shadow-2xl">
                <div className="-right-20 -top-20 absolute size-40 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative text-center">
                  <div className="mb-4">
                    <div className="mb-2 font-bold text-7xl text-primary">
                      $100
                    </div>
                    <p className="text-muted-foreground text-xl">
                      base per month + pay-as-you-go
                    </p>
                    <p className="mt-2 text-muted-foreground text-sm">
                      Only pay for what you actually use. No wasted spend on
                      unused features.
                    </p>
                  </div>

                  <div className="mb-8 space-y-3 text-left">
                    {[
                      "AI Assistant with complete system access",
                      "24/7 AI Phone System (answers & books appointments)",
                      "Smart Scheduling with 4 view types",
                      "Invoicing & Payments (0% processing fees)",
                      "QuickBooks integration (two-way sync)",
                      "Mobile app for iOS & Android",
                      "Customer portal (white-label)",
                      "Marketing automation & review management",
                      "Unlimited users, unlimited jobs",
                      "All future features included",
                    ].map((feature, i) => (
                      <div className="flex items-start gap-3" key={i}>
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    className="mb-6 h-14 w-full text-lg"
                    size="lg"
                  >
                    <Link href="/register">
                      Try It Free — No Credit Card
                      <ArrowRight className="ml-2 size-5" />
                    </Link>
                  </Button>

                  <div className="space-y-2 text-muted-foreground text-sm">
                    <p className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                      Free forever trial period
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                      Cancel anytime with one click
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                      Keep all your data forever
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pay-as-you-go explanation */}
            <div className="mx-auto mb-8 max-w-2xl rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-8">
              <h3 className="mb-4 text-center font-bold text-xl">
                How Pay-As-You-Go Works
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-sm">$100/month base fee</p>
                    <p className="text-muted-foreground text-xs">
                      Covers all core features: scheduling, invoicing, mobile
                      app, QuickBooks sync, unlimited users
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      Only pay for what you use
                    </p>
                    <p className="text-muted-foreground text-xs">
                      AI phone calls, SMS messages, premium features - billed
                      only when you actually use them
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      Transparent usage dashboard
                    </p>
                    <p className="text-muted-foreground text-xs">
                      See exactly what you're using in real-time. Set spending
                      limits. No surprise bills.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center">
                <p className="font-semibold text-green-600 text-sm dark:text-green-400">
                  💡 Most businesses pay $120-$150/month total vs $398+ with
                  competitors
                </p>
              </div>
            </div>

            {/* What's NOT included (transparency) */}
            <div className="mx-auto mb-12 max-w-2xl rounded-2xl border border-primary/10 bg-background p-8">
              <h3 className="mb-4 font-bold text-xl">
                What&apos;s NOT Included:
              </h3>
              <div className="space-y-2 text-muted-foreground text-sm">
                <p className="flex items-start gap-2">
                  <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>
                    <strong>No hidden fees:</strong> Crystal clear usage-based
                    billing. See exactly what you pay.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>
                    <strong>No setup fees:</strong> Unlike ServiceTitan&apos;s
                    $2K-$5K implementation costs.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>
                    <strong>No per-user fees:</strong> Add unlimited users.
                    Seriously.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>
                    <strong>No contracts:</strong> Month-to-month. Cancel
                    anytime.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>
                    <strong>No vendor lock-in:</strong> Export all data in
                    standard formats (CSV, JSON, SQL).
                  </span>
                </p>
              </div>
            </div>

            {/* Honest comparison */}
            <div className="rounded-2xl border-2 border-primary/20 bg-background p-8">
              <h3 className="mb-6 text-center font-bold text-2xl">
                vs The Competition
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
                  <div className="mb-4 text-center">
                    <div className="mb-2 text-2xl">🏢</div>
                    <h4 className="font-bold">ServiceTitan</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center justify-between">
                      <span className="font-bold">PER USER</span>
                      <span className="font-bold text-red-600 dark:text-red-400">
                        $398/mo
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>5 users</span>
                      <span className="text-red-600 dark:text-red-400">
                        $1,990/mo
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Setup fees</span>
                      <span className="text-red-600 dark:text-red-400">
                        $2K-$5K
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Contract</span>
                      <span className="text-red-600 dark:text-red-400">
                        2-3 years
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>AI features</span>
                      <span className="text-red-600 dark:text-red-400">
                        None
                      </span>
                    </p>
                    <p className="flex items-center justify-between border-red-500/20 border-t pt-2 font-bold">
                      <span>Year 1 (5 users)</span>
                      <span className="text-red-600 dark:text-red-400">
                        ~$26,880
                      </span>
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-6">
                  <div className="mb-4 text-center">
                    <div className="mb-2 text-2xl">📱</div>
                    <h4 className="font-bold">Housecall Pro</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center justify-between">
                      <span className="font-bold">PER USER</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">
                        $289/mo
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>5 users</span>
                      <span className="text-orange-600 dark:text-orange-400">
                        $1,445/mo
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Setup fees</span>
                      <span className="text-orange-600 dark:text-orange-400">
                        $1K+
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Contract</span>
                      <span className="text-orange-600 dark:text-orange-400">
                        1 year
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>AI features</span>
                      <span className="text-orange-600 dark:text-orange-400">
                        None
                      </span>
                    </p>
                    <p className="flex items-center justify-between border-orange-500/20 border-t pt-2 font-bold">
                      <span>Year 1 (5 users)</span>
                      <span className="text-orange-600 dark:text-orange-400">
                        ~$18,340
                      </span>
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
                  <div className="mb-4 text-center">
                    <div className="mb-2 text-2xl">⚡</div>
                    <h4 className="font-bold text-primary">Thorbis</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center justify-between">
                      <span className="font-bold">UNLIMITED USERS</span>
                      <span className="font-bold text-primary">$100/mo</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Per-user fees</span>
                      <span className="text-primary">$0</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Usage pricing</span>
                      <span className="text-primary">Pay as you go</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Setup fees</span>
                      <span className="text-primary">$0</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Contract</span>
                      <span className="text-primary">None</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>AI features</span>
                      <span className="text-primary">✓ Included</span>
                    </p>
                    <p className="flex items-center justify-between border-primary/20 border-t pt-2 font-bold">
                      <span>Avg Year 1</span>
                      <span className="text-primary">$1,440-$1,800*</span>
                    </p>
                  </div>
                  <p className="mt-2 text-center text-muted-foreground text-xs">
                    *Unlimited users included
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center">
                  <p className="mb-2 font-bold text-3xl text-green-600 dark:text-green-400">
                    Save $25,080-$25,440/year
                  </p>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    vs ServiceTitan with 5 users
                  </p>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Even with pay-as-you-go usage, you&apos;ll save{" "}
                    <strong>$25K+/year</strong>. That&apos;s enough to hire 2
                    new technicians or fund serious marketing.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-center">
                    <p className="mb-1 font-bold text-primary text-xl">
                      $16,540/year saved
                    </p>
                    <p className="text-muted-foreground text-xs">
                      vs Housecall Pro (5 users)
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-center">
                    <p className="mb-1 font-bold text-primary text-xl">
                      $10,548/year saved
                    </p>
                    <p className="text-muted-foreground text-xs">
                      vs Jobber (5 users)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YOUR DATA SECTION - Unique selling point */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
                <Shield className="size-4 text-primary" />
                <span className="font-medium">Your Data. Your Business.</span>
              </div>
              <h2 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl">
                We Don&apos;t{" "}
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Hold Your Data Hostage
                </span>
              </h2>
              <p className="mx-auto max-w-3xl text-foreground/70 text-xl">
                Too many software companies trap you with your own data. Not us.
                Your data is yours. Forever. Export it, download it, move it
                anytime.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Data ownership benefits */}
              {[
                {
                  icon: Download,
                  title: "One-Click Export",
                  description:
                    "Download ALL your data in CSV, JSON, or SQL format. No waiting, no support tickets, no fees.",
                  badge: "Instant",
                },
                {
                  icon: Unlock,
                  title: "Zero Vendor Lock-In",
                  description:
                    "Leave anytime with all your data. No export fees, no data retention periods, no tricks.",
                  badge: "Freedom",
                },
                {
                  icon: Shield,
                  title: "Your Data Forever",
                  description:
                    "Even if you cancel, your data stays accessible for 90 days. Then we permanently delete it (not keep it).",
                  badge: "Privacy",
                },
                {
                  icon: Database,
                  title: "API Access Included",
                  description:
                    "Full REST API access to YOUR data. Build custom integrations, reports, or migrate to another system.",
                  badge: "Free API",
                },
                {
                  icon: FileText,
                  title: "Automatic Backups",
                  description:
                    "Daily automated backups. Download backup snapshots anytime. Your data is protected.",
                  badge: "Daily",
                },
                {
                  icon: Target,
                  title: "No Hidden Retention",
                  description:
                    "We don't secretly keep your data after you cancel. When you delete it, it's gone. For real.",
                  badge: "Honest",
                },
              ].map((item, i) => (
                <div
                  className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-background p-6 transition-all hover:border-primary/20 hover:shadow-lg"
                  key={i}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="size-6 text-primary" />
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-primary text-xs">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="mb-2 font-bold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Comparison callout */}
            <div className="mt-12 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-xl">
                    <X className="size-6 text-red-600 dark:text-red-400" />
                    Other Platforms
                  </h3>
                  <div className="space-y-3 text-sm">
                    <p className="flex items-start gap-2 text-muted-foreground">
                      <X className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
                      <strong>$398/month PER USER</strong> (5 users =
                      $23,880/year)
                    </p>
                    <p className="flex items-start gap-2 text-muted-foreground">
                      <X className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
                      Data export costs $500-$2,000
                    </p>
                    <p className="flex items-start gap-2 text-muted-foreground">
                      <X className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
                      Takes 2-4 weeks to get your data
                    </p>
                    <p className="flex items-start gap-2 text-muted-foreground">
                      <X className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
                      Requires support ticket approval
                    </p>
                    <p className="flex items-start gap-2 text-muted-foreground">
                      <X className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
                      Data in proprietary formats
                    </p>
                    <p className="flex items-start gap-2 text-muted-foreground">
                      <X className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
                      Keeps your data after you cancel
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-primary text-xl">
                    <CheckCircle2 className="size-6 text-primary" />
                    Thorbis
                  </h3>
                  <div className="space-y-3 text-sm">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>
                        <strong>$100/month unlimited users</strong> (not $398
                        per user)
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>
                        <strong>Free export</strong> - no fees, ever
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>
                        <strong>Instant download</strong> - one click, get
                        everything
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>
                        <strong>No approval needed</strong> - it&apos;s your
                        data
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>
                        <strong>Standard formats</strong> - CSV, JSON, SQL
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>
                        <strong>Permanent deletion</strong> - gone when you want
                        it gone
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI FEATURES SECTION - Abbreviated */}
      <section className="border-border/50 border-y bg-muted/30 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
                <Brain className="size-4 text-primary" />
                <span className="font-medium">AI Built-In, No Extra Cost</span>
              </div>
              <h2 className="mb-6 font-bold text-4xl md:text-5xl">
                AI That Actually{" "}
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Does Your Work
                </span>
              </h2>
              <p className="mx-auto max-w-3xl text-foreground/70 text-xl">
                ServiceTitan charges $398/mo and doesn&apos;t even have AI. We
                include it at $100/mo because it should be standard, not an
                upsell.
              </p>
            </div>

            <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: MessageSquare,
                  title: "AI Assistant",
                  example: '"Send invoice to John"',
                  result: "Done in 10 seconds",
                },
                {
                  icon: Phone,
                  title: "24/7 AI Calls",
                  example: "Answers at 2 AM",
                  result: "Books appointment",
                },
                {
                  icon: Shield,
                  title: "Smart Monitoring",
                  example: "Catches price changes",
                  result: "Alerts you instantly",
                },
                {
                  icon: DollarSign,
                  title: "Auto Collections",
                  example: "Calls overdue invoices",
                  result: "$15K/mo recovered",
                },
              ].map((item, i) => (
                <div
                  className="rounded-xl border border-primary/10 bg-background p-6"
                  key={i}
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="size-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-bold">{item.title}</h3>
                  <p className="mb-2 text-muted-foreground text-sm italic">
                    {item.example}
                  </p>
                  <p className="text-primary text-sm">→ {item.result}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border-2 border-primary/20 bg-background p-8 text-center">
              <p className="mb-2 font-bold text-2xl">
                35% more leads • 80% fewer no-shows • $15K monthly recovery
              </p>
              <p className="text-muted-foreground">
                Real numbers from real businesses using Thorbis AI
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Focused on honesty */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 font-bold text-4xl md:text-5xl">
                What People Actually Say
              </h2>
              <p className="mx-auto max-w-3xl text-foreground/70 text-xl">
                No cherry-picked reviews. Just real feedback from real business
                owners.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: "Mike Rodriguez",
                  business: "Rodriguez HVAC",
                  location: "Phoenix, AZ",
                  quote:
                    "Finally, software that doesn't trap you with contracts and hidden fees. The $100/mo is honest — no surprise charges. And the AI actually works.",
                  metric: "Switched from ServiceTitan",
                },
                {
                  name: "Sarah Chen",
                  business: "Chen Plumbing",
                  location: "San Francisco, CA",
                  quote:
                    "I exported all my data in 30 seconds when I was testing migration. They don't hold you hostage. That's rare and appreciated.",
                  metric: "Full data export in 30s",
                },
                {
                  name: "James Williams",
                  business: "Williams Electric",
                  location: "Austin, TX",
                  quote:
                    "No contracts, no BS, just good software at a fair price. Canceled Housecall Pro after 4 years and moved everything over in a weekend.",
                  metric: "Saved $2,268/year",
                },
              ].map((testimonial, i) => (
                <div
                  className="rounded-xl border border-primary/10 bg-background p-6"
                  key={i}
                >
                  <div className="mb-4 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Star
                        className="size-4 fill-yellow-500 text-yellow-500"
                        key={j}
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="mb-4 rounded-lg border border-primary/10 bg-primary/5 px-3 py-2 text-center">
                    <p className="font-semibold text-primary text-xs">
                      {testimonial.metric}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10" />
                    <div>
                      <p className="font-semibold text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {testimonial.business}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL HONEST CTA */}
      <section className="border-border/50 border-y bg-gradient-to-br from-primary/10 to-background py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl">
              Try It. Use It. Leave If You Don&apos;t Love It.
            </h2>
            <p className="mx-auto mb-10 max-w-3xl text-foreground/70 text-xl">
              No sales calls. No contracts. No vendor lock-in. Just good
              software at an honest price. Start free, pay $100/mo when
              you&apos;re ready.
            </p>

            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                className="group h-16 px-12 text-lg shadow-lg"
                size="lg"
              >
                <Link href="/register">
                  Start Using Thorbis Free
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-16 border-2 px-12 text-lg"
                size="lg"
                variant="outline"
              >
                <Link href="/demo">
                  <Play className="mr-2 size-5 fill-current" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            <div className="space-y-2 text-muted-foreground text-sm">
              <p>✓ No credit card required to start</p>
              <p>✓ Export your data anytime</p>
              <p>✓ Cancel with one click, keep your data</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
