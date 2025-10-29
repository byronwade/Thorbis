/**
 * Dashboard Hero - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static hero content rendered on server
 * - Reduced JavaScript bundle size
 */

import Link from "next/link";
import {
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  Calendar,
  CheckCircle2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DashboardHero() {
  const kpiData = [
    {
      title: "Revenue Growth",
      value: "+40%",
      change: "vs industry average",
      icon: TrendingUp,
      changeType: "positive" as const,
    },
    {
      title: "Time Saved",
      value: "8+ hrs",
      change: "per week average",
      icon: Clock,
      changeType: "positive" as const,
    },
    {
      title: "Avg Job Value",
      value: "$468",
      change: "+12.5% increase",
      icon: DollarSign,
      changeType: "positive" as const,
    },
    {
      title: "Happy Customers",
      value: "10,000+",
      change: "4.8★ app rating",
      icon: Users,
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-8 px-4 pt-16 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header Section - Dashboard Style */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="gap-1.5" variant="secondary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Live Demo Available
            </Badge>
          </div>

          <h1 className="font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl">
            Your Field Service Business
            <br />
            <span className="text-muted-foreground">At a Glance</span>
          </h1>

          <p className="max-w-3xl text-lg text-muted-foreground">
            See how Thorbis gives you complete visibility and control over every
            aspect of your field service operations—from scheduling to payments.
          </p>
        </div>

        {/* KPI Cards Grid - Like Dashboard */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">{kpi.title}</CardTitle>
                <kpi.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="font-bold text-2xl">{kpi.value}</div>
                <p
                  className={cn(
                    "font-medium text-xs",
                    kpi.changeType === "positive" &&
                      "text-green-600 dark:text-green-400"
                  )}
                >
                  {kpi.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTAs */}
        <div className="mb-12 flex flex-col items-start gap-4 sm:flex-row">
          <Button asChild className="group h-auto px-6 py-3" size="lg">
            <Link href="/dashboard">
              Start Free Trial
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild className="group h-auto" size="lg" variant="outline">
            <Link href="/demo">
              Book a Demo
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Trust Indicators - Dashboard Style */}
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-green-500" />
            <span>14-day free trial</span>
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
      </div>

      {/* Dashboard Preview Section */}
      <div className="mx-auto w-full max-w-7xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-xl">Live Dashboard Preview</h2>
              <p className="text-muted-foreground text-sm">
                Real-time data and insights at your fingertips
              </p>
            </div>
            <Badge variant="secondary">Interactive Demo</Badge>
          </div>

          {/* Dashboard Preview Card */}
          <Card className="overflow-hidden">
            <div className="aspect-video w-full bg-gradient-to-br from-muted/50 to-muted">
              <div className="flex size-full flex-col items-center justify-center gap-4 p-8">
                <div className="rounded-full bg-primary/10 p-6">
                  <Calendar className="size-12 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="mb-2 font-semibold text-xl">
                    See Your Business in Action
                  </h3>
                  <p className="text-muted-foreground">
                    Schedule a personalized demo to see how Thorbis works
                    <br />
                    for businesses like yours
                  </p>
                </div>
                <Button asChild className="group mt-4">
                  <Link href="/demo">
                    Watch Demo
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Industry Badges - Dashboard Pills Style */}
      <div className="mx-auto w-full max-w-7xl">
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">Built for:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: "⚡", label: "HVAC" },
              { icon: "🔧", label: "Plumbing" },
              { icon: "💡", label: "Electrical" },
              { icon: "🏗️", label: "Contractors" },
              { icon: "🧹", label: "Cleaning" },
              { icon: "🔨", label: "Handyman" },
            ].map((industry, index) => (
              <Badge key={index} className="gap-2 px-4 py-2" variant="outline">
                <span>{industry.icon}</span>
                <span>{industry.label}</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
