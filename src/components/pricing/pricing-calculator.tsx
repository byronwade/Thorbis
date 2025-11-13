"use client";

/**
 * Pricing Calculator - Interactive Client Component
 *
 * Features:
 * - $100/month base fee breakdown
 * - Pay-as-you-go pricing table with sliders
 * - Real-time cost calculation
 * - Business owner friendly explanations
 */

import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  Calculator,
  Calendar,
  CheckCircle2,
  Database,
  DollarSign,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Shield,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

/**
 * Pay-as-you-go pricing items
 *
 * All costs are based on real API pricing from providers (2025):
 * - Twilio Voice: $0.013-$0.03/min outbound, $0.0085-$0.022/min inbound
 * - Twilio SMS: $0.0075-$0.01 per message (US)
 * - SendGrid Email: ~$0.0004 per email
 * - Claude Sonnet 4: $3 input / $15 output per million tokens (~$0.00003/token avg)
 * - GPT-4o: $2.50 input / $10 output per million tokens (~$0.00002/token avg)
 * - Stripe: 2.9% + $0.30 per transaction
 * - GPU Servers: $2-4/hour for real-time AI processing (~$1,440-2,880/mo per dedicated server)
 *
 * All costs include 50% markup for profit margins
 *
 * WHY AI FEATURES ARE EXPENSIVE:
 * 1. Real-time Phone AI: Requires speech-to-text ($0.024/min) + AI inference + text-to-speech
 *    - Must respond in <100ms for natural conversation
 *    - Dedicated GPU servers running 24/7
 * 2. 24/7 Monitoring: Dedicated GPU server analyzing your business continuously
 *    - ~$100/mo in server costs per business
 *    - Can't share resources due to data privacy
 * 3. Advanced AI Models: Claude/GPT-4 cost 15-30x more than basic models
 *    - We use premium models for accuracy
 *    - Cheaper models make costly mistakes
 * 4. Multi-step Operations: Complex AI commands require multiple API calls
 *    - "Send invoice to John" = find customer + create invoice + send email + send SMS
 *    - Each step requires AI context + API calls
 */
const PRICING_ITEMS = [
  {
    id: "ai-phone-inbound",
    name: "AI Phone Calls (Inbound)",
    description:
      "AI answers customer calls, books appointments, answers questions",
    icon: Phone,
    unit: "per minute",
    cost: 0.15, // Twilio $0.015/min + AI processing ~$0.085/min (real-time processing) = $0.10 × 1.5 markup = $0.15
    defaultValue: 100,
    maxValue: 1000,
    step: 10,
    example: "~100 mins/month (5-10 calls)",
  },
  {
    id: "ai-phone-outbound",
    name: "AI Phone Calls (Outbound)",
    description: "AI calls customers for follow-ups, reminders, collections",
    icon: Phone,
    unit: "per minute",
    cost: 0.18, // Twilio $0.022/min + AI processing ~$0.098/min (real-time processing) = $0.12 × 1.5 markup = $0.18
    defaultValue: 50,
    maxValue: 500,
    step: 10,
    example: "~50 mins/month (10-15 calls)",
  },
  {
    id: "sms",
    name: "SMS Messages",
    description: "Appointment reminders, confirmations, follow-ups",
    icon: MessageSquare,
    unit: "per message",
    cost: 0.0135, // Twilio $0.009/msg × 1.5 markup = $0.0135
    defaultValue: 200,
    maxValue: 2000,
    step: 10,
    example: "~200 msgs/month",
  },
  {
    id: "email",
    name: "Transactional Emails",
    description: "Invoices, estimates, appointment confirmations",
    icon: Mail,
    unit: "per email",
    cost: 0.0006, // SendGrid $0.0004/email × 1.5 markup = $0.0006
    defaultValue: 500,
    maxValue: 5000,
    step: 50,
    example: "~500 emails/month",
  },
  {
    id: "email-marketing",
    name: "Marketing Emails",
    description: "Promotional campaigns, newsletters, customer follow-ups",
    icon: Mail,
    unit: "per email",
    cost: 0.0006, // SendGrid $0.0004/email × 1.5 markup = $0.0006
    defaultValue: 300,
    maxValue: 3000,
    step: 50,
    example: "~300 marketing emails/month",
  },
  {
    id: "ai-chat-assistant",
    name: "AI Chat Assistant (Website)",
    description: "24/7 website chatbot answering customer questions",
    icon: MessageSquare,
    unit: "per conversation",
    cost: 0.05, // ~1000 tokens avg × $0.00003/token × 1.5 markup = $0.05 (more realistic for back-and-forth)
    defaultValue: 100,
    maxValue: 1000,
    step: 10,
    example: "~100 conversations/month",
  },
  {
    id: "ai-document-analysis",
    name: "AI Document Analysis",
    description: "Analyze invoices, contracts, permits with AI",
    icon: Shield,
    unit: "per document",
    cost: 0.25, // ~5000 tokens avg (large documents) × $0.00003/token × 1.5 markup = $0.25
    defaultValue: 50,
    maxValue: 500,
    step: 10,
    example: "~50 documents/month",
  },
  {
    id: "ai-job-intelligence",
    name: "AI Job Intelligence",
    description:
      "Smart scheduling suggestions, pricing optimization, dispatch recommendations",
    icon: Shield,
    unit: "per analysis",
    cost: 0.08, // ~2000 tokens × $0.00004/token × 1.5 markup = $0.08 (needs context from multiple jobs)
    defaultValue: 100,
    maxValue: 1000,
    step: 10,
    example: "~100 analyses/month",
  },
  {
    id: "ai-system-control",
    name: "AI System Control & Commands",
    description:
      "Ask AI to do anything - send invoices, create quotes, update customers, etc.",
    icon: Bot,
    unit: "per command",
    cost: 0.12, // ~3000 tokens (complex multi-step operations) × $0.00004/token × 1.5 markup = $0.12
    defaultValue: 200,
    maxValue: 2000,
    step: 20,
    example: "~200 commands/month",
    note: "Complete system access via natural language",
  },
  {
    id: "ai-24-7-monitoring",
    name: "24/7 AI Business Monitoring",
    description:
      "AI watches for price changes, missing photos, errors, opportunities - constantly",
    icon: Bell,
    unit: "per business/month",
    cost: 50.0, // Dedicated server monitoring 24/7 (~$100/mo server cost × 0.5 allocation × 1.5 markup)
    defaultValue: 1,
    maxValue: 1,
    step: 1,
    example: "Always-on intelligent monitoring",
    note: "Requires dedicated GPU server running 24/7 to analyze your business continuously",
  },
  {
    id: "ai-voicemail-intelligence",
    name: "AI Voicemail Processing",
    description: "Transcribe, analyze urgency, extract info, auto-callback",
    icon: Phone,
    unit: "per voicemail",
    cost: 0.2, // Speech-to-text $0.024/min avg + AI analysis ~$0.10 + callback scheduling × 1.5 markup
    defaultValue: 50,
    maxValue: 500,
    step: 10,
    example: "~50 voicemails/month",
    note: "Expensive due to real-time speech processing + AI analysis",
  },
  {
    id: "ai-emergency-detection",
    name: "AI Emergency Call Detection",
    description:
      "Instantly detect emergencies, prioritize, dispatch nearest tech, alert managers",
    icon: AlertCircle,
    unit: "per call analyzed",
    cost: 0.08, // Real-time keyword detection + priority routing × 1.5 markup
    defaultValue: 100,
    maxValue: 1000,
    step: 10,
    example: "~100 calls analyzed/month",
    note: "Every call is analyzed in real-time for emergency keywords",
  },
  {
    id: "ai-call-analytics",
    name: "AI Call Analytics & Insights",
    description:
      "Track conversion rates, identify objections, measure sentiment, improve sales",
    icon: BarChart3,
    unit: "per call analyzed",
    cost: 0.1, // Conversation analysis + sentiment + insights generation × 1.5 markup
    defaultValue: 100,
    maxValue: 1000,
    step: 10,
    example: "~100 calls/month",
    note: "Advanced NLP analysis on every conversation",
  },
  {
    id: "ai-campaign-calling",
    name: "AI Marketing Campaigns (Outbound)",
    description:
      "AI calls customers for seasonal services, warranty renewals, maintenance reminders",
    icon: TrendingUp,
    unit: "per campaign call",
    cost: 0.25, // Outbound call + personalized pitch + conversation handling × 1.5 markup
    defaultValue: 50,
    maxValue: 500,
    step: 10,
    example: "~50 campaign calls/month",
    note: "Personalized conversations based on customer history",
  },
  {
    id: "ai-smart-invoicing",
    name: "AI Smart Invoicing",
    description:
      "AI detects billing errors, inconsistencies, missing line items before sending",
    icon: FileText,
    unit: "per invoice analyzed",
    cost: 0.06, // Document analysis + math verification × 1.5 markup
    defaultValue: 100,
    maxValue: 1000,
    step: 10,
    example: "~100 invoices/month",
    note: "Prevents costly billing mistakes",
  },
  {
    id: "ai-inventory-auto-order",
    name: "AI Inventory Auto-Ordering",
    description:
      "AI monitors stock levels, predicts needs, auto-orders from suppliers",
    icon: Zap,
    unit: "per order placed",
    cost: 0.15, // Inventory analysis + supplier API + order creation × 1.5 markup
    defaultValue: 20,
    maxValue: 200,
    step: 5,
    example: "~20 auto-orders/month",
    note: "Never run out of critical materials",
  },
  {
    id: "ai-cash-flow-optimization",
    name: "AI Cash Flow Optimization",
    description:
      "AI analyzes accounts, optimizes transfers, maximizes savings automatically",
    icon: DollarSign,
    unit: "per optimization",
    cost: 0.5, // Complex financial analysis + multi-account review + transfer execution × 1.5 markup
    defaultValue: 10,
    maxValue: 100,
    step: 5,
    example: "~10 optimizations/month",
    note: "Requires secure access to all banking data for analysis",
  },
  {
    id: "ai-customer-risk-analysis",
    name: "AI Customer Risk Analysis",
    description:
      "Identify no-show patterns, payment risks, recommend deposits/prepayment",
    icon: Shield,
    unit: "per customer analyzed",
    cost: 0.05, // Historical pattern analysis + risk scoring × 1.5 markup
    defaultValue: 100,
    maxValue: 1000,
    step: 10,
    example: "~100 customers/month",
    note: "Protects revenue from risky customers",
  },
];

export function PricingCalculator() {
  const [usage, setUsage] = useState<Record<string, number>>(
    PRICING_ITEMS.reduce(
      (acc, item) => {
        acc[item.id] = item.defaultValue;
        return acc;
      },
      {} as Record<string, number>
    )
  );

  // Calculate total usage costs
  const usageCosts = PRICING_ITEMS.map((item) => ({
    name: item.name,
    quantity: usage[item.id] || 0,
    unitCost: item.cost,
    total: (usage[item.id] || 0) * item.cost,
  }));

  const totalUsageCost = usageCosts.reduce((sum, item) => sum + item.total, 0);
  const baseFee = 100;
  const monthlyTotal = baseFee + totalUsageCost;

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative border-border/50 border-b bg-gradient-to-br from-primary/5 to-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
              <Calculator className="size-4 text-primary" />
              <span className="font-medium">Transparent Pricing</span>
            </div>
            <h1 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Simple, Honest Pricing
              </span>
              <br />
              You&apos;ll Actually Understand
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-foreground/70 text-xl">
              <strong>$100/month base</strong> + pay only for what you use.
              Calculate your exact monthly cost below. No surprises. No hidden
              fees. No per-user charges.
            </p>

            {/* Quick comparison */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <div className="mb-2 text-2xl">🏢</div>
                <p className="mb-1 font-bold">ServiceTitan</p>
                <p className="text-destructive text-sm dark:text-destructive">
                  $398/user/mo
                </p>
                <p className="text-muted-foreground text-xs">
                  5 users = $23,880/year
                </p>
              </div>
              <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
                <div className="mb-2 text-2xl">📱</div>
                <p className="mb-1 font-bold">Housecall Pro</p>
                <p className="text-sm text-warning dark:text-warning">
                  $289/user/mo
                </p>
                <p className="text-muted-foreground text-xs">
                  5 users = $17,340/year
                </p>
              </div>
              <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
                <div className="mb-2 text-2xl">⚡</div>
                <p className="mb-1 font-bold text-primary">Thorbis</p>
                <p className="text-primary text-sm">$100/mo + usage</p>
                <p className="text-muted-foreground text-xs">Unlimited users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Base Fee Breakdown */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center font-bold text-3xl">
              What&apos;s Included in the{" "}
              <span className="text-primary">$100/month Base Fee</span>
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  icon: Users,
                  title: "Unlimited Users",
                  description: "Add your entire team - no per-user fees ever",
                },
                {
                  icon: Calendar,
                  title: "Smart Scheduling",
                  description:
                    "4 view types: Timeline, Calendar, Map, Gantt Chart",
                },
                {
                  icon: DollarSign,
                  title: "Invoicing & Estimates",
                  description: "Create unlimited invoices and estimates",
                },
                {
                  icon: Phone,
                  title: "Mobile App",
                  description: "iOS & Android apps for field technicians",
                },
                {
                  icon: Database,
                  title: "QuickBooks Integration",
                  description: "Two-way sync with QuickBooks Online",
                },
                {
                  icon: Users,
                  title: "Customer Portal",
                  description: "White-label portal for customers",
                },
                {
                  icon: BarChart3,
                  title: "Reports & Analytics",
                  description: "Real-time dashboards and custom reports",
                },
                {
                  icon: Shield,
                  title: "Data Ownership",
                  description: "Export all data anytime, no fees",
                },
              ].map((feature, i) => (
                <div
                  className="flex items-start gap-3 rounded-xl border border-primary/10 bg-background p-4"
                  key={i}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-sm">
                      {feature.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Pricing Calculator */}
      <section className="border-border/50 border-y bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-bold text-3xl md:text-4xl">
                Pay-As-You-Go{" "}
                <span className="text-primary">Usage Calculator</span>
              </h2>
              <p className="mx-auto max-w-2xl text-foreground/70 text-lg">
                Adjust the sliders below to estimate your monthly costs based on
                actual usage. Most businesses pay{" "}
                <strong>$120-$150/month total</strong>.
              </p>
            </div>

            {/* Calculator card */}
            <div className="rounded-2xl border-2 border-primary/20 bg-background shadow-2xl">
              {/* Usage items with sliders */}
              <div className="p-6 md:p-8">
                <div className="space-y-8">
                  {PRICING_ITEMS.map((item) => {
                    const ItemIcon = item.icon;
                    const quantity = usage[item.id] || 0;
                    const cost = quantity * item.cost;

                    return (
                      <div
                        className="rounded-xl border border-primary/10 bg-muted/30 p-6"
                        key={item.id}
                      >
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              <ItemIcon className="size-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="mb-1 font-semibold">
                                {item.name}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                              <p className="mt-1 text-muted-foreground text-xs italic">
                                {item.example}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-2xl text-primary">
                              ${cost.toFixed(2)}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              ${item.cost.toFixed(3)} {item.unit}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Usage: <strong>{quantity}</strong>{" "}
                              {item.unit.replace("per ", "")}
                              {quantity !== 1 ? "s" : ""}
                            </span>
                            {item.note && (
                              <span className="rounded-full bg-success/10 px-2 py-0.5 text-success text-xs dark:text-success">
                                {item.note}
                              </span>
                            )}
                          </div>
                          <Slider
                            className="cursor-pointer"
                            max={item.maxValue}
                            onValueChange={([value]) =>
                              setUsage({ ...usage, [item.id]: value })
                            }
                            step={item.step}
                            value={[quantity]}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total calculation */}
              <div className="border-border/50 border-t bg-gradient-to-br from-primary/5 to-transparent p-6 md:p-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-muted-foreground">Base Fee</span>
                    <span className="font-semibold">${baseFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-muted-foreground">Usage Charges</span>
                    <span className="font-semibold">
                      ${totalUsageCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-border/50 border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-2xl">
                        Estimated Monthly Total
                      </span>
                      <span className="font-bold text-4xl text-primary">
                        ${monthlyTotal.toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-2 text-right text-muted-foreground text-sm">
                      ${(monthlyTotal * 12).toFixed(2)}/year • Unlimited users
                      included
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-success/20 bg-success/5 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                    <div>
                      <p className="mb-1 font-semibold text-success dark:text-success">
                        You&apos;re saving $
                        {(23_880 - monthlyTotal * 12).toFixed(0)}/year vs
                        ServiceTitan (5 users)
                      </p>
                      <p className="text-muted-foreground text-xs">
                        That&apos;s enough for 2 new technicians, marketing
                        budget, or equipment upgrades.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/register">
                      Start Free Trial - No Credit Card Required
                      <ArrowRight className="ml-2 size-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Usage breakdown */}
            <div className="mt-8 rounded-xl border border-primary/10 bg-background p-6">
              <h3 className="mb-4 font-semibold text-lg">
                Detailed Cost Breakdown
              </h3>
              <div className="space-y-2">
                {usageCosts.map((item, i) => (
                  <div
                    className="flex items-center justify-between text-sm"
                    key={i}
                  >
                    <span className="text-muted-foreground">
                      {item.name} ({item.quantity} × ${item.unitCost.toFixed(3)}
                      )
                    </span>
                    <span className="font-semibold">
                      ${item.total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison with competitors */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center font-bold text-3xl md:text-4xl">
              How We Compare to{" "}
              <span className="text-primary">The Competition</span>
            </h2>

            <div className="overflow-hidden rounded-2xl border-2 border-primary/20 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-semibold">Feature</th>
                      <th className="p-4 text-center font-semibold">
                        ServiceTitan
                      </th>
                      <th className="p-4 text-center font-semibold">
                        Housecall Pro
                      </th>
                      <th className="bg-primary/5 p-4 text-center font-semibold text-primary">
                        Thorbis
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      {
                        feature: "Per-User Pricing",
                        st: "$398/user/mo",
                        hcp: "$289/user/mo",
                        thorbis: "Unlimited users",
                      },
                      {
                        feature: "Base Monthly Fee",
                        st: "Varies",
                        hcp: "Varies",
                        thorbis: "$100/mo flat",
                      },
                      {
                        feature: "5 Users Annual Cost",
                        st: "$23,880",
                        hcp: "$17,340",
                        thorbis: "$1,440-$1,800*",
                      },
                      {
                        feature: "Setup Fees",
                        st: "$2,000-$5,000",
                        hcp: "$1,000+",
                        thorbis: "$0",
                      },
                      {
                        feature: "Contract Length",
                        st: "2-3 years",
                        hcp: "1 year",
                        thorbis: "None",
                      },
                      {
                        feature: "Payment Processing Fees",
                        st: "3.5%+",
                        hcp: "2.9%+",
                        thorbis: "2.9% + $0.30",
                      },
                      {
                        feature: "AI Assistant",
                        st: false,
                        hcp: false,
                        thorbis: true,
                      },
                      {
                        feature: "24/7 AI Phone System",
                        st: false,
                        hcp: false,
                        thorbis: true,
                      },
                      {
                        feature: "Data Export",
                        st: "$500-$2,000",
                        hcp: "$500+",
                        thorbis: "Free",
                      },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 text-center">
                          {typeof row.st === "boolean" ? (
                            row.st ? (
                              <CheckCircle2 className="mx-auto size-5 text-success dark:text-success" />
                            ) : (
                              <XCircle className="mx-auto size-5 text-destructive dark:text-destructive" />
                            )
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              {row.st}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof row.hcp === "boolean" ? (
                            row.hcp ? (
                              <CheckCircle2 className="mx-auto size-5 text-success dark:text-success" />
                            ) : (
                              <XCircle className="mx-auto size-5 text-destructive dark:text-destructive" />
                            )
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              {row.hcp}
                            </span>
                          )}
                        </td>
                        <td className="bg-primary/5 p-4 text-center">
                          {typeof row.thorbis === "boolean" ? (
                            row.thorbis ? (
                              <CheckCircle2 className="mx-auto size-5 text-primary" />
                            ) : (
                              <XCircle className="mx-auto size-5 text-muted-foreground" />
                            )
                          ) : (
                            <span className="font-semibold text-primary text-sm">
                              {row.thorbis}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-border/50 border-t bg-muted/30 p-4 text-center text-muted-foreground text-xs">
                *Based on typical usage patterns
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-border/50 border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-center font-bold text-3xl">
              Pricing Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Why do you charge per-usage instead of per-user?",
                  a: "Because it's fair. Why should you pay $398/user when most users don't use the system 24/7? Our model charges for actual value delivered, not seat licenses.",
                },
                {
                  q: "What happens if I go over my estimated usage?",
                  a: "Nothing scary. You simply pay for the extra usage at the same transparent rates. Set spending limits in your dashboard if you want hard caps.",
                },
                {
                  q: "Are there any hidden fees?",
                  a: "Absolutely not. What you see is what you pay. No setup fees, no cancellation fees, no data export fees, no BS.",
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes. One click cancellation. No questions asked. You keep all your data forever.",
                },
                {
                  q: "Do you offer discounts for annual payments?",
                  a: "Not currently. We keep pricing simple and honest. $100/month + usage is our standard rate for everyone.",
                },
              ].map((faq, i) => (
                <div
                  className="rounded-xl border border-primary/10 bg-background p-6"
                  key={i}
                >
                  <h3 className="mb-2 font-semibold">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-bold text-3xl md:text-4xl">
              Ready to Save <span className="text-primary">$20,000+/year?</span>
            </h2>
            <p className="mb-8 text-foreground/70 text-xl">
              Start your free trial today. No credit card required. No sales
              calls. Cancel anytime.
            </p>
            <div className="flex justify-center">
              <Button asChild className="h-14 px-12" size="lg">
                <Link href="/register">
                  Start Free Trial Now
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
