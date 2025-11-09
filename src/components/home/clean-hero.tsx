/**
 * Clean Hero Section - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static hero content rendered on server
 * - Reduced JavaScript bundle size
 */

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CleanHero() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-16 pb-16 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="secondary">
            <span className="relative mr-2 flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Self-serve onboarding
          </Badge>
        </div>
        <h1 className="font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl">
          Field Service Management Software
        </h1>
        <p className="text-lg text-muted-foreground">
          Complete visibility and control over your field operations for a $100/month base
          subscription with pay-as-you-go usage—unlimited users, no contracts.
        </p>
      </div>

      {/* Stats Grid - Same as dashboard KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground text-sm">
              Revenue Growth
            </p>
            <div className="font-bold text-2xl">+40%</div>
            <p className="font-medium text-green-600 text-xs dark:text-green-400">
              vs industry average
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground text-sm">
              Time Saved
            </p>
            <div className="font-bold text-2xl">8+ hrs</div>
            <p className="font-medium text-green-600 text-xs dark:text-green-400">
              per week average
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground text-sm">
              Avg Job Value
            </p>
            <div className="font-bold text-2xl">$468</div>
            <p className="font-medium text-green-600 text-xs dark:text-green-400">
              +12.5% increase
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground text-sm">
              Happy Customers
            </p>
            <div className="font-bold text-2xl">10,000+</div>
            <p className="font-medium text-green-600 text-xs dark:text-green-400">
              4.8★ app rating
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild className="group" size="lg">
          <Link href="/register">
            Start Free Trial
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <Button asChild className="group" size="lg" variant="outline">
          <Link href="/pricing">
            Compare plans
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-green-500" />
          <span>$100/mo base + pay-as-you-go usage</span>
        </div>
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

      {/* Dashboard Preview */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-semibold text-xl">Live Dashboard Preview</h2>
          <p className="text-muted-foreground text-sm">
            Real-time data and insights at your fingertips
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <div className="aspect-video w-full bg-muted/50">
            <div className="flex size-full items-center justify-center p-8">
              <div className="text-center">
                <div className="mb-4 text-6xl">📊</div>
                <h3 className="mb-2 font-semibold text-xl">
                  See Your Business in Action
                </h3>
                <p className="text-muted-foreground">
                  Create your account to explore Thorbis with real data in minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Badges */}
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
            <Badge className="gap-2" key={index} variant="outline">
              <span>{industry.icon}</span>
              <span>{industry.label}</span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
