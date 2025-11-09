/**
 * Modern Homepage - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - All static content rendered on server
 * - Optimized for Core Web Vitals and SEO
 * - Modern, clean design with smooth visual hierarchy
 */

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  DollarSign,
  MessageSquare,
  Phone,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ModernHomepage() {
  return (
    <div className="relative overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Animated gradient background */}
        <div className="-z-10 absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="pointer-events-none absolute top-0 left-1/4 size-[600px] animate-pulse rounded-full bg-primary/20 opacity-40 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 bottom-0 size-[600px] animate-pulse rounded-full bg-blue-500/20 opacity-40 blur-3xl delay-1000" />
        </div>

        <div className="container relative mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Trust badge */}
            <div className="mb-8 flex justify-center">
              <Badge
                className="gap-2 border-primary/20 bg-primary/5 px-4 py-2 text-sm backdrop-blur-sm"
                variant="secondary"
              >
                <Sparkles className="size-4 text-primary" />
                <span className="font-medium">
                  Trusted by 10,000+ service businesses
                </span>
              </Badge>
            </div>

            {/* Main headline */}
            <div className="mb-8 text-center">
              <h1 className="mb-6 font-extrabold text-5xl leading-tight tracking-tight md:text-6xl lg:text-7xl">
                <span className="block">Run Your Field Service</span>
                <span className="block bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                  Business Smarter
                </span>
              </h1>
              <p className="mx-auto mb-3 max-w-3xl text-foreground/80 text-xl leading-relaxed md:text-2xl">
                All-in-one platform for scheduling, invoicing, payments, and customer
                management. AI built in so every team member gets more done in less time.
              </p>
              <p className="mx-auto max-w-2xl text-muted-foreground text-base">
                Pricing is simple: $100/month base subscription with pay-as-you-go usage.
                Unlimited users, no contracts, cancel anytime.
              </p>
            </div>

            {/* Social proof */}
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
                        className="size-4 fill-yellow-500 text-yellow-500"
                        key={i}
                      />
                    ))}
                    <span className="ml-2 font-bold">4.9/5</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    from 1,247+ reviews
                  </p>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
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
                <Link href="/pricing">Compare plans</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <span>$100/mo base + pay-as-you-go usage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <span>Unlimited users included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <span>Setup in 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="relative mx-auto mt-20 max-w-6xl">
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/80 shadow-2xl backdrop-blur-sm">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 border-border border-b bg-muted/50 px-4 py-3">
                  <div className="flex gap-2">
                    <div className="size-3 rounded-full bg-red-500" />
                    <div className="size-3 rounded-full bg-yellow-500" />
                    <div className="size-3 rounded-full bg-green-500" />
                  </div>
                  <div className="ml-4 flex-1 rounded-md bg-background/50 px-3 py-1 text-muted-foreground text-xs">
                    app.thorbis.com/dashboard
                  </div>
                </div>

                {/* Dashboard mockup */}
                <div className="aspect-video w-full bg-gradient-to-br from-muted/30 to-muted/10 p-8">
                  <div className="grid h-full gap-4 md:grid-cols-4">
                    {[
                      { label: "Revenue", value: "$47.2K", change: "+12.5%" },
                      { label: "Jobs Today", value: "23", change: "+8%" },
                      { label: "Conversion", value: "68%", change: "+5%" },
                      { label: "Avg Ticket", value: "$892", change: "+15%" },
                    ].map((stat, i) => (
                      <div
                        className="rounded-lg border border-border/50 bg-background/80 p-4 shadow-sm"
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
        </div>
      </section>

      {/* KEY FEATURES SECTION */}
      <section className="border-border/50 border-y bg-background py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <Badge className="mb-4" variant="secondary">
                Everything You Need
              </Badge>
              <h2 className="mb-4 font-bold text-4xl md:text-5xl">
                One Platform.{" "}
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Endless Possibilities.
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-foreground/70 text-lg">
                All the tools you need to run and grow your field service
                business, all in one place.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Phone,
                  title: "AI Phone System",
                  description:
                    "24/7 AI assistant answers calls, books appointments, and handles customer questions automatically.",
                  color: "text-blue-500",
                },
                {
                  icon: BarChart3,
                  title: "Smart Scheduling",
                  description:
                    "Drag-and-drop scheduling with 4 view types, route optimization, and intelligent dispatch.",
                  color: "text-green-500",
                },
                {
                  icon: DollarSign,
                  title: "Invoicing & Payments",
                  description:
                    "Get paid faster with instant invoicing, online payments, and 0% processing fees.",
                  color: "text-yellow-500",
                },
                {
                  icon: MessageSquare,
                  title: "Customer Communication",
                  description:
                    "Automated SMS, email campaigns, review requests, and a self-service customer portal.",
                  color: "text-purple-500",
                },
                {
                  icon: TrendingUp,
                  title: "Business Intelligence",
                  description:
                    "Real-time dashboards, reports, and insights to make data-driven decisions.",
                  color: "text-red-500",
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description:
                    "Bank-level encryption, SOC 2 compliant, and regular security audits to protect your data.",
                  color: "text-indigo-500",
                },
              ].map((feature, i) => (
                <div
                  className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                  key={i}
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

      {/* BENEFITS SECTION */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <Badge className="mb-4" variant="secondary">
                Real Results
              </Badge>
              <h2 className="mb-4 font-bold text-4xl md:text-5xl">
                See the{" "}
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Difference
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-foreground/70 text-lg">
                Join thousands of businesses that have transformed their
                operations with Thorbis.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  metric: "+40%",
                  label: "Revenue Growth",
                  description: "vs industry average",
                  icon: TrendingUp,
                },
                {
                  metric: "8+ hrs",
                  label: "Time Saved",
                  description: "per week on average",
                  icon: Clock,
                },
                {
                  metric: "$468",
                  label: "Avg Job Value",
                  description: "+12.5% increase",
                  icon: DollarSign,
                },
                {
                  metric: "10,000+",
                  label: "Happy Customers",
                  description: "4.8★ app rating",
                  icon: Users,
                },
              ].map((benefit, i) => (
                <div
                  className="rounded-xl border border-border/50 bg-background p-6 text-center"
                  key={i}
                >
                  <div className="mb-4 flex justify-center">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <benefit.icon className="size-6 text-primary" />
                    </div>
                  </div>
                  <div className="mb-2 font-bold text-4xl text-primary">
                    {benefit.metric}
                  </div>
                  <div className="mb-1 font-semibold text-lg">
                    {benefit.label}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {benefit.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="border-border/50 border-y bg-background py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <Badge className="mb-4" variant="secondary">
                Customer Stories
              </Badge>
              <h2 className="mb-4 font-bold text-4xl md:text-5xl">
                Loved by{" "}
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Service Professionals
                </span>
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: "Sarah Johnson",
                  role: "HVAC Business Owner",
                  company: "Cool Air Solutions",
                  content:
                    "Thorbis transformed our business. We've increased revenue by 45% and cut admin time in half. The AI phone system alone has been a game-changer.",
                  rating: 5,
                },
                {
                  name: "Mike Rodriguez",
                  role: "Plumbing Contractor",
                  company: "Rapid Plumbing",
                  content:
                    "Best investment we've made. The scheduling system is intuitive, and our team loves the mobile app. Customer satisfaction is through the roof.",
                  rating: 5,
                },
                {
                  name: "Emily Chen",
                  role: "Electrical Services",
                  company: "Bright Electric",
                  content:
                    "The invoicing and payment features have revolutionized how we get paid. We're getting paid 3x faster, and the 0% processing fees saved us thousands.",
                  rating: 5,
                },
              ].map((testimonial, i) => (
                <div
                  className="rounded-xl border border-border/50 bg-card p-6"
                  key={i}
                >
                  <div className="mb-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        className="size-4 fill-yellow-500 text-yellow-500"
                        key={star}
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

      {/* FINAL CTA SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background py-24">
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4" variant="secondary">
              Get Started Today
            </Badge>
            <h2 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl">
              Ready to Transform{" "}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Your Business?
              </span>
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-foreground/70 text-xl">
              Join thousands of service businesses using Thorbis to grow faster,
              work smarter, and deliver exceptional customer experiences. It&apos;s just
              $100/month base plus pay-as-you-go usage—no per-user fees or long contracts.
            </p>
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
                <Link href="/pricing">Compare plans</Link>
              </Button>
            </div>
            <p className="mt-6 text-muted-foreground text-sm">
              $100/month base • Pay-as-you-go usage • No credit card required • 14-day free
              trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
