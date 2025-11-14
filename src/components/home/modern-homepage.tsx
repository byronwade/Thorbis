/**
 * Modern Homepage - Server Component
 *
 * Intentionally server-rendered for maximal performance.
 * Heavy emphasis on credibility, lifestyle imagery, and
 * psychological triggers focused on trade business owners.
 */

import {
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  ClipboardList,
  Clock,
  Crown,
  DollarSign,
  Globe,
  Handshake,
  Layers,
  LineChart,
  MessageSquare,
  Phone,
  PlayCircle,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ModernHomepage() {
  const tradeBadges = [
    "HVAC",
    "Plumbing",
    "Electrical",
    "Roofing",
    "Garage Door",
    "Renovation",
  ] as const;

  const heroStats = [
    {
      label: "Call pickup",
      value: "92%",
      change: "answered by Dispatch AI",
      detail: "within 7 rings",
    },
    {
      label: "Jobs auto-booked",
      value: "14",
      change: "per night average",
      detail: "while you sleep",
    },
    {
      label: "Crew utilization",
      value: "87%",
      change: "+12 pts vs last month",
      detail: "route board optimized",
    },
    {
      label: "Cash collected",
      value: "$58.4K",
      change: "same-day payouts",
      detail: "0% processing fees",
    },
  ] as const;

  const heroCallouts = [
    { label: "Owner time freed daily", value: "53 minutes" },
    { label: "Customer rating", value: "4.9 ★" },
  ] as const;

  const trustSignals = [
    "Done-for-you onboarding from veteran trade operators",
    "Unlimited crew logins included in the flat $100 base",
    "AI receptionist answers every after-hours call",
    "Data always belongs to you—export anytime",
  ] as const;

  const persuasionDrivers = [
    {
      icon: Brain,
      label: "Certainty",
      title: "Margin guardrails on every ticket",
      description:
        "Live job costing exposes labor, material, and equipment creep before it kills profit.",
      proof: "Know your exact margin before the truck heads back.",
    },
    {
      icon: Target,
      label: "Control",
      title: "Dispatch board built for chaos",
      description:
        "Drag-and-drop routes, route heatmaps, and AI slot suggestions keep six trucks moving like one.",
      proof: "Visualize the entire day at once with zero spreadsheets.",
    },
    {
      icon: ShieldCheck,
      label: "Trust",
      title: "Promises backed by guarantees",
      description:
        "21-day performance lift or walk away, no lock-in. Keep the playbooks we build for you.",
      proof: "Risk-free adoption with concierge setup.",
    },
  ] as const;

  const visualStories = [
    {
      src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
      alt: "Crew installing a rooftop unit at sunrise",
      badge: "Field reality",
      caption:
        "Offline-ready checklists, annotated photos, and signatures captured even when service drops.",
    },
    {
      src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
      alt: "Dispatcher coordinating jobs with a homeowner",
      badge: "Control tower",
      caption:
        "Dispatch AI qualifies leads, books them, and drops them on the board with playbook-driven notes.",
    },
  ] as const;

  const aiHighlights = [
    {
      icon: Bot,
      title: "Dispatch AI",
      description:
        "Answers calls, qualifies homeowners, and drops jobs straight onto the board with custom scripts.",
    },
    {
      icon: Layers,
      title: "Playbook automation",
      description:
        "Trigger workflows for permits, parts pulls, memberships, and follow-ups without manual double-entry.",
    },
    {
      icon: Zap,
      title: "Revenue copilots",
      description:
        "Suggests upsell menus, financing, and review requests the second a job is marked complete.",
    },
    {
      icon: Globe,
      title: "Anywhere visibility",
      description:
        "Stream real-time job costing, crew status, and cash flow metrics to any device in the shop or truck.",
    },
  ] as const;

  const tradeFeatures = [
    {
      icon: ClipboardList,
      title: "Job-winning estimates",
      description:
        "Present good/better/best options, attach allowances, and capture approvals in the field or over text.",
      color: "text-primary",
    },
    {
      icon: Phone,
      title: "AI-powered office",
      description:
        "Dispatch AI answers every call, qualifies the job, and books it directly onto the board—no missed leads.",
      color: "text-success",
    },
    {
      icon: Wrench,
      title: "Crew-first mobile app",
      description:
        "Technicians see routes, checklists, equipment history, and capture photos even when service drops.",
      color: "text-warning",
    },
    {
      icon: DollarSign,
      title: "Cash flow control",
      description:
        "Track labor, material, equipment, and markups in real time. Send invoices with 0% processing fees.",
      color: "text-accent-foreground",
    },
    {
      icon: MessageSquare,
      title: "Customer experience",
      description:
        "Automated SMS and email updates, reputation boosts, and a branded homeowner portal make you look premium.",
      color: "text-destructive",
    },
    {
      icon: Shield,
      title: "Safety & compliance",
      description:
        "Store permits, inspection photos, and job packets so crews always have the right paperwork.",
      color: "text-primary",
    },
  ] as const;

  const jobFlow = [
    {
      stage: "Before the job",
      title: "Book & price in minutes",
      icon: Phone,
      bullets: [
        "AI dispatcher qualifies leads and books the slot instantly",
        "Trade-specific templates keep estimates tight and branded",
        "Route board auto-builds profitable days with drive time",
      ],
    },
    {
      stage: "On the job",
      title: "Keep every truck in sync",
      icon: Wrench,
      bullets: [
        "Crew app shows checklists, parts, and equipment history",
        "Attach photos, videos, and signatures even offline",
        "Job costing updates live as labor hours roll in",
      ],
    },
    {
      stage: "After the job",
      title: "Get paid & rebook fast",
      icon: DollarSign,
      bullets: [
        "Invoice and payment links send automatically when work wraps",
        "Review requests and maintenance plans trigger on autopilot",
        "Same-day payouts with no processing fees or lock-in",
      ],
    },
  ] as const;

  const comparisonPoints = [
    {
      claim: "Pricing fairness",
      thorbis: "Unlimited logins + AI receptionist for a $100 base and usage.",
      others: "Per-seat fees, surprise add-ons, and yearly contracts.",
    },
    {
      claim: "After-hours coverage",
      thorbis: "Dispatch AI books no-heat calls overnight with scripts you control.",
      others: "Forwarding to voicemail and hoping for the best.",
    },
    {
      claim: "Implementation",
      thorbis: "Trade operators build your board, imports, and automations in 24 hours.",
      others: "Self-serve onboarding videos and weeks of DIY cleanup.",
    },
    {
      claim: "Data ownership",
      thorbis: "Export everything anytime—customers, jobs, invoices—no penalty.",
      others: "Lock-in contracts and paywalls around your own data.",
    },
  ] as const;

  const incumbentIntel = [
    {
      name: "ServiceTitan",
      summary: "Enterprise-first bundles like Marketing Pro add heavy overhead.",
      takeaway:
        "Thorbis includes lifecycle marketing, review boosts, and advanced reporting in the flat base so you are not upsold feature-by-feature.",
      source: {
        label: "ServiceTitan Marketing Pro brochure",
        href: "https://community.servicetitan.com/bdamv94262/attachments/bdamv94262/lead_generation/11/1/Marketing%20Pro_Full%20Suite_OnePage.pdf",
      },
    },
    {
      name: "Housecall Pro",
      summary: "Highlights 100M+ jobs and a 35% average revenue lift after year one.",
      takeaway:
        "Thorbis matches the growth focus but layers on 0% processing, Dispatch AI, and multi-division controls built for bigger crews.",
      source: {
        label: "Housecall Pro marketing claims",
        href: "https://www.housecallpro.com/",
      },
    },
    {
      name: "Status quo tools",
      summary: "Spreadsheets, whiteboards, and bolt-on CRMs bury owners in admin.",
      takeaway:
        "Thorbis unifies quoting, dispatch, cash flow, and customer comms so information moves once and mirrors the field.",
      source: {
        label: "Trade operator interviews",
        href: "/case-studies",
      },
    },
  ] as const;

  const ownerWins = [
    {
      metric: "15 hrs",
      label: "Admin saved each week",
      description: "Scheduling, payroll, and paperwork run automatically.",
      icon: Clock,
    },
    {
      metric: "+38%",
      label: "Average ticket lift",
      description: "Upsell menus, memberships, and financing built in.",
      icon: TrendingUp,
    },
    {
      metric: "3x",
      label: "Faster cash collection",
      description: "Instant payouts with 0% processing fees and auto reminders.",
      icon: DollarSign,
    },
    {
      metric: "98%",
      label: "Customer happiness",
      description: "Proactive updates and portals keep homeowners informed.",
      icon: Users,
    },
  ] as const;

  const testimonialQuotes = [
    {
      name: "Sarah Johnson",
      role: "Owner",
      company: "Northwind Mechanical (HVAC)",
      content:
        "Dispatch AI books no-heat calls at midnight, and the board is clean when I wake up. We ditched three tools in a week.",
      rating: 5,
    },
    {
      name: "Mike Rodriguez",
      role: "Master Plumber",
      company: "Rapid Rooter Plumbing",
      content:
        "Every tech uses the field app for photos, notes, and options. Job costing per phase keeps our margins honest.",
      rating: 5,
    },
    {
      name: "Deja Patel",
      role: "Operations Director",
      company: "Voltline Electric",
      content:
        "Invoices fire the moment crews mark jobs complete, and we get paid the same day. Homeowners rave about the updates.",
      rating: 5,
    },
  ] as const;

  const guaranteeHighlights = [
    "White-glove import of customers, equipment, and memberships at no cost.",
    "21-day performance lift or cancel and keep every workflow we configured.",
    "Dedicated trade strategist monitors first 30 days and coaches your office staff.",
  ] as const;

  const buyerDestinations = [
    {
      title: "See pricing & ROI",
      description: "Model your usage, fees, and payout schedule.",
      icon: DollarSign,
      href: "/pricing",
    },
    {
      title: "Explore industries",
      description: "Find HVAC, plumbing, electrical, roofing, and more playbooks.",
      icon: Globe,
      href: "/industries",
    },
    {
      title: "Watch a product tour",
      description: "20-minute control-tower walkthrough on demand.",
      icon: PlayCircle,
      href: "/webinars",
    },
    {
      title: "Study customer wins",
      description: "Deep dives on dispatch cleanups and cash acceleration.",
      icon: BookOpen,
      href: "/case-studies",
    },
  ] as const;

  const faqItems = [
    {
      question: "How long before we see value?",
      answer:
        "Most shops are live within 24 hours with our operator-led onboarding. Dispatch AI and automated invoicing usually unlock the first measurable wins inside week one.",
    },
    {
      question: "Do we need to change payment processors?",
      answer:
        "No. Thorbis routes payouts to your existing accounts and waives processing fees. You can also keep legacy terminals for edge cases while enjoying instant digital payouts.",
    },
    {
      question: "Can Thorbis handle multiple divisions or locations?",
      answer:
        "Yes. Crews, revenue centers, and service areas can be segmented with permissions, dashboards, and reporting filters built for multi-division shops.",
    },
    {
      question: "What happens if we leave?",
      answer:
        "You own your data forever. Export customers, jobs, equipment, invoices, and automations anytime in open formats with zero penalties.",
    },
  ] as const;

  return (
    <div className="relative overflow-hidden">
      <section className="relative min-h-screen overflow-hidden">
        <div className="-z-10 absolute inset-0">
          <Image
            alt="Technician calibrating HVAC unit on a rooftop"
            className="object-cover opacity-20"
            fill
            priority
            sizes="100vw"
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1800&q=80"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.45),_transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background" />
          <div className="pointer-events-none absolute left-1/4 top-0 size-[600px] animate-pulse rounded-full bg-primary/25 opacity-50 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 bottom-0 size-[600px] animate-pulse rounded-full bg-primary/20 opacity-40 blur-3xl delay-1000" />
        </div>

        <div className="container relative mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex justify-center">
              <Badge
                className="gap-2 border-primary/20 bg-primary/5 px-4 py-2 text-sm backdrop-blur-sm"
                variant="secondary"
              >
                <Sparkles className="size-4 text-primary" />
                <span className="font-medium">
                  Built with trade operators for HVAC, plumbing, electrical &
                  more
                </span>
              </Badge>
            </div>

            <div className="mb-8 text-center">
              <h1 className="mb-6 font-extrabold text-5xl leading-tight tracking-tight md:text-6xl lg:text-7xl">
                <span className="block">Own The Day.</span>
                <span className="block bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                  Grow Without Chaos.
                </span>
              </h1>
              <p className="mx-auto mb-3 max-w-3xl text-foreground/80 text-xl leading-relaxed md:text-2xl">
                Thorbis runs dispatch, quoting, payments, and after-hours calls
                from one control tower, so owners who still wear the tool belt
                can scale like a franchise.
              </p>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                $100/month base plus pay-as-you-go usage. Unlimited users,
                AI-powered office staff, and data you own. No contracts, no
                per-seat fees.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
                {tradeBadges.map((trade) => (
                  <span
                    className="rounded-full border border-border/60 bg-background/70 px-4 py-2 font-medium text-foreground/80 shadow-sm"
                    key={trade}
                  >
                    {trade}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <div className="flex items-center gap-2">
                <div className="-space-x-2 flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      className="size-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-primary/20"
                      key={i}
                    />
                  ))}
                </div>
                <div className="ml-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        className="size-4 fill-yellow-500 text-warning"
                        key={i}
                      />
                    ))}
                    <span className="ml-2 font-bold">4.9/5</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    from 1,247+ trades reviews
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                className="group h-14 px-8 text-lg shadow-lg shadow-primary/20"
                size="lg"
              >
                <Link href="/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-14 border-2 px-8 text-lg"
                size="lg"
                variant="outline"
              >
                <Link href="/pricing">See trade pricing</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm">
              {trustSignals.map((signal) => (
                <div className="flex items-center gap-2" key={signal}>
                  <CheckCircle2 className="size-4 text-success" />
                  <span>{signal}</span>
                </div>
              ))}
            </div>

            <div className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                {heroStats.map((stat) => (
                  <div
                    className="rounded-2xl border border-border/50 bg-background/80 p-5 shadow-sm backdrop-blur"
                    key={stat.label}
                  >
                    <p className="text-muted-foreground text-xs">{stat.label}</p>
                    <p className="font-bold text-3xl">{stat.value}</p>
                    <p className="text-success text-xs dark:text-success">
                      {stat.change}
                    </p>
                    <p className="text-muted-foreground text-xs">{stat.detail}</p>
                  </div>
                ))}
              </div>
              <div className="relative">
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/40 to-primary/10 blur-3xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/90 shadow-2xl">
                  <Image
                    alt="Thorbis dispatch board showing six HVAC routes"
                    className="h-auto w-full rounded-[inherit] border border-border/40 object-cover"
                    height={900}
                    priority
                    src="/hero.png"
                    width={1400}
                  />
                  <div className="absolute inset-x-6 bottom-6 grid gap-3 rounded-2xl border border-border/50 bg-background/90 p-4 shadow-lg backdrop-blur">
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Control tower insights
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {heroCallouts.map((callout) => (
                        <div key={callout.label}>
                          <p className="text-muted-foreground text-xs">
                            {callout.label}
                          </p>
                          <p className="font-semibold text-lg">
                            {callout.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-border/50 border-y bg-muted/20 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <Badge className="mb-4" variant="secondary">
              FAQ
            </Badge>
            <h2 className="mb-4 font-bold text-4xl md:text-5xl">
              Answers for busy owners
            </h2>
            <p className="mx-auto max-w-3xl text-foreground/70 text-lg">
              We captured the top objections trade owners raise after evaluating
              ServiceTitan, Housecall Pro, and generic CRMs.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-4xl space-y-4">
            {faqItems.map((item) => (
              <div
                className="rounded-2xl border border-border/60 bg-background p-6 text-left shadow-sm"
                key={item.question}
              >
                <p className="font-semibold text-xl">{item.question}</p>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-background py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <Badge className="mb-4" variant="secondary">
              Dive deeper
            </Badge>
            <h2 className="mb-4 font-bold text-4xl md:text-5xl">
              Everything a buying committee needs
            </h2>
            <p className="mx-auto max-w-3xl text-foreground/70 text-lg">
              Compare pricing, study industry playbooks, or watch an on-demand
              walkthrough without talking to sales. Each page was refreshed for
              trade owners doing serious diligence.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {buyerDestinations.map((destination) => (
              <Link
                className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 text-left transition-all hover:border-primary/60 hover:shadow-lg"
                href={destination.href}
                key={destination.title}
              >
                <div>
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <destination.icon className="size-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-2xl group-hover:text-primary">
                    {destination.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {destination.description}
                  </p>
                </div>
                <p className="mt-6 text-primary text-sm font-semibold">
                  Explore &rarr;
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-muted/10 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <Badge className="mb-4" variant="secondary">
              Market research
            </Badge>
            <h2 className="mb-4 font-bold text-4xl md:text-5xl">
              We studied the incumbents so you don&apos;t have to
            </h2>
            <p className="mx-auto max-w-3xl text-foreground/70 text-lg">
              ServiceTitan leans enterprise, Housecall Pro leans DIY websites,
              and spreadsheets keep you stuck reacting. Thorbis blends the best
              ideas—without the add-on upsells, per-seat fees, or DIY headache.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {incumbentIntel.map((intel) => (
              <div
                className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm"
                key={intel.name}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {intel.name}
                </p>
                <h3 className="mb-2 mt-3 font-semibold text-xl">
                  {intel.summary}
                </h3>
                <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
                  {intel.takeaway}
                </p>
                <Link
                  className="text-primary text-sm underline underline-offset-2"
                  href={intel.source.href}
                  rel="noopener noreferrer"
                  target={intel.source.href.startsWith("http") ? "_blank" : undefined}
                >
                  {intel.source.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-border/40 border-y bg-gradient-to-b from-background via-background/60 to-background py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center lg:text-left">
              <Badge className="mb-4" variant="secondary">
                AI control center
              </Badge>
              <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <h2 className="mb-4 font-bold text-4xl md:text-5xl">
                    Automation you can actually trust
                  </h2>
                  <p className="mb-6 text-foreground/70 text-lg">
                    Housecall Pro talks about AI teams. ServiceTitan sells
                    Marketing Pro bundles. Thorbis bakes the same capabilities
                    into the base platform so every shop, not just enterprise,
                    gets dispatch, marketing, and cash flow copilots on day one.
                  </p>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 size-4 text-primary" />
                      Dispatch AI books urgent calls in the same board your
                      humans use—no outside integrations.
                    </p>
                    <p className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 size-4 text-primary" />
                      Playbooks enforce safety checklists, permit tasks, and job
                      costing guardrails automatically.
                    </p>
                    <p className="flex items-start gap-3">
                      <TrendingUp className="mt-0.5 size-4 text-primary" />
                      Revenue insights flag idle crews, low conversion zones, and
                      cash delays so you can course-correct live.
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {aiHighlights.map((highlight) => (
                    <div
                      className="rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm backdrop-blur"
                      key={highlight.title}
                    >
                      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                        <highlight.icon className="size-6 text-primary" />
                      </div>
                      <h3 className="mb-2 font-semibold text-xl">
                        {highlight.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-border/40 bg-gradient-to-b from-background via-background to-muted/30 py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_60%)]" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <Badge className="mb-4" variant="secondary">
              Psychology-backed proof
            </Badge>
            <h2 className="mb-4 font-bold text-4xl md:text-5xl">
              Owners Move When Risk Is Gone
            </h2>
            <p className="mx-auto max-w-3xl text-foreground/70 text-lg">
              We speak to the levers that matter: certainty on margins, total
              control of the board, and trust that someone has your back if it
              doesn&apos;t work.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {persuasionDrivers.map((driver) => (
              <div
                className="rounded-2xl border border-border/60 bg-card/90 p-6 shadow-sm backdrop-blur transition-all hover:border-primary/60 hover:shadow-lg"
                key={driver.title}
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <driver.icon className="size-6 text-primary" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {driver.label}
                </p>
                <h3 className="mb-2 font-semibold text-2xl">{driver.title}</h3>
                <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
                  {driver.description}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {driver.proof}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <Badge className="mb-4" variant="secondary">
                  Visual proof
                </Badge>
                <h2 className="mb-4 font-bold text-4xl md:text-5xl">
                  See The Platform In The Field
                </h2>
                <p className="mb-8 text-foreground/70 text-lg">
                  Lifestyle proof sells: let owners see crews, dispatchers, and
                  the product in action—then show how those moments tie back to
                  revenue and peace of mind.
                </p>
                <div className="space-y-4 rounded-2xl border border-border/60 bg-muted/30 p-6 text-sm leading-relaxed text-muted-foreground">
                  <p className="flex items-start gap-3">
                    <Crown className="mt-1 size-4 text-primary" />
                    Own the narrative with high-end visuals and concrete stats.
                  </p>
                  <p className="flex items-start gap-3">
                    <LineChart className="mt-1 size-4 text-primary" />
                    Tie every scene to growth: faster calls, tighter routes,
                    and cash collected.
                  </p>
                  <p className="flex items-start gap-3">
                    <Handshake className="mt-1 size-4 text-primary" />
                    Back it with guarantees and concierge humans, not just
                    software.
                  </p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {visualStories.map((visual) => (
                  <div
                    className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg"
                    key={visual.alt}
                  >
                    <Image
                      alt={visual.alt}
                      className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      height={600}
                      src={visual.src}
                      width={900}
                    />
                    <div className="space-y-2 border-t border-border/60 bg-background/90 p-6 backdrop-blur">
                      <Badge variant="secondary">{visual.badge}</Badge>
                      <p className="text-foreground font-semibold">
                        {visual.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-border/50 border-y bg-background py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <Badge className="mb-4" variant="secondary">
                Trade-built workflows
              </Badge>
              <h2 className="mb-4 font-bold text-4xl md:text-5xl">
                Crew-Ready Tools For Owners On The Go
              </h2>
              <p className="mx-auto max-w-2xl text-foreground/70 text-lg">
                Replace paper, whiteboards, and stitched-together apps with one
                system designed alongside HVAC, plumbing, electrical, and
                specialty contractors.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tradeFeatures.map((feature) => (
                <div
                  className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                  key={feature.title}
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon
                      className={`size-6 ${feature.color} transition-transform group-hover:scale-110`}
                    />
                  </div>
                  <h3 className="mb-2 font-semibold text-xl">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/20 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <Badge className="mb-4" variant="secondary">
              Field-proven workflow
            </Badge>
            <h2 className="mb-4 font-bold text-4xl md:text-5xl">
              Every Phase Of The Job, In One Place
            </h2>
            <p className="mx-auto max-w-2xl text-foreground/70 text-lg">
              Whether you&apos;re in the truck or in the office, Thorbis keeps
              the same playbook visible to everyone so nothing slips between
              estimate and final payment.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {jobFlow.map((stage) => (
              <div
                className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm"
                key={stage.title}
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <stage.icon className="size-6 text-primary" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {stage.stage}
                </p>
                <h3 className="mb-4 font-semibold text-2xl">
                  {stage.title}
                </h3>
                <ul className="space-y-3">
                  {stage.bullets.map((bullet) => (
                    <li
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                      key={bullet}
                    >
                      <CheckCircle2 className="mt-0.5 size-4 text-success" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border/50 border-y bg-background py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <Badge className="mb-4" variant="secondary">
              Proof over promises
            </Badge>
            <h2 className="mb-6 font-bold text-4xl md:text-5xl">
              Why Trade Owners Switch From Legacy Systems
            </h2>
            <p className="mx-auto max-w-3xl text-foreground/70 text-lg">
              Strip away the marketing—here&apos;s how Thorbis wins when owners
              compare us against the usual suspects.
            </p>
          </div>
          <div className="mt-12 overflow-hidden rounded-3xl border border-border/60 bg-card">
            <div className="grid gap-0 md:grid-cols-2">
              {comparisonPoints.map((point) => (
                <div
                  className="border-border/60 border-t p-6 text-sm md:border-l"
                  key={point.claim}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {point.claim}
                  </p>
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Thorbis
                      </p>
                      <p className="text-foreground text-base">{point.thorbis}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Other tools
                      </p>
                      <p className="text-muted-foreground text-base">
                        {point.others}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <Badge className="mb-4" variant="secondary">
                Owner outcomes
              </Badge>
              <h2 className="mb-4 font-bold text-4xl md:text-5xl">
                Numbers That Make Trade Owners Smile
              </h2>
              <p className="mx-auto max-w-2xl text-foreground/70 text-lg">
                See what happens when every truck, call, and invoice moves
                through the same playbook.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {ownerWins.map((win) => (
                <div
                  className="rounded-xl border border-border/50 bg-background p-6 text-center"
                  key={win.label}
                >
                  <div className="mb-4 flex justify-center">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <win.icon className="size-6 text-primary" />
                    </div>
                  </div>
                  <div className="mb-2 font-bold text-4xl text-primary">
                    {win.metric}
                  </div>
                  <div className="mb-1 font-semibold text-lg">
                    {win.label}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {win.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-border/50 border-y bg-background py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <Badge className="mb-4" variant="secondary">
                Customer stories
              </Badge>
              <h2 className="mb-4 font-bold text-4xl md:text-5xl">
                Crew-Tested By Real Tradespeople
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonialQuotes.map((testimonial) => (
                <div
                  className="rounded-xl border border-border/50 bg-card p-6"
                  key={testimonial.name}
                >
                  <div className="mb-4 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, index) => (
                      <Star
                        className="size-4 fill-yellow-500 text-warning"
                        key={index}
                      />
                    ))}
                  </div>
                  <p className="mb-6 text-muted-foreground leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-muted-foreground text-sm">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background py-24">
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4" variant="secondary">
              Risk-free switch
            </Badge>
            <h2 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl">
              Give Your Crews A System That Works
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-foreground/70 text-xl">
              HVAC, plumbing, electrical, roofing, and specialty contractors
              trust Thorbis to keep phones answered, trucks dispatched, and cash
              collected without babysitting software.
            </p>
            <div className="mb-10 space-y-3 text-left text-sm text-muted-foreground sm:text-base">
              {guaranteeHighlights.map((highlight) => (
                <p className="flex items-start gap-3" key={highlight}>
                  <CheckCircle2 className="mt-0.5 size-4 text-success" />
                  <span>{highlight}</span>
                </p>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                className="group h-14 px-8 text-lg shadow-lg shadow-primary/20"
                size="lg"
              >
                <Link href="/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-14 border-2 px-8 text-lg"
                size="lg"
                variant="outline"
              >
                <Link href="/pricing">Talk with a trade expert</Link>
              </Button>
            </div>
            <p className="mt-6 text-muted-foreground text-sm">
              Working system in 24 hours • Unlimited users • Trade-focused
              onboarding • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


