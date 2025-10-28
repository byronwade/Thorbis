/**
 * Hero Content - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static hero content rendered on server
 * - Removed unused useEffect and useRef imports
 * - MagicCard (client component) rendered as child
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 */

import Link from "next/link";
import {
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MagicCard } from "@/components/ui/magic-card";

export function HeroContent() {
  const kpiData = [
    {
      title: "Revenue Growth",
      value: "+40%",
      change: "vs last year",
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
      change: "4.8★ rating",
      icon: Users,
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="flex flex-col px-4 pt-16 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center rounded-full border border-border bg-muted px-4 py-2 text-foreground text-sm backdrop-blur-sm">
          <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-primary" />
          Trusted by 10,000+ field service professionals
        </div>

        <h1 className="mb-6 font-bold text-5xl text-white leading-tight md:text-6xl lg:text-7xl">
          Everything to run and grow
          <br />
          <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            your field service business
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-foreground text-xl leading-relaxed">
          Save time, increase revenue by 40%, and build a top reputation—all
          with Stratos field management software.
        </p>

        {/* Trust stats */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-6 text-foreground/80 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl text-primary">4.8★</span>
            <span>App Store Rating</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl text-white">5M+</span>
            <span>Jobs Completed</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl text-white">8+</span>
            <span>Hours Saved Weekly</span>
          </div>
        </div>

        <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            className="group rounded-lg bg-primary px-8 py-6 font-semibold text-lg text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-105 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            size="lg"
          >
            <Link href="/dashboard">
              Start Free Trial
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Button>
          <Button
            asChild
            className="group rounded-lg border border-border bg-white/5 px-8 py-6 font-semibold text-lg text-white backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20"
            size="lg"
            variant="outline"
          >
            <Link href="/demo">
              Book a Demo
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Button>
        </div>

        {/* No credit card badge */}
        <p className="mb-12 text-center text-foreground/60 text-sm">
          No credit card required • 14-day free trial • Cancel anytime
        </p>

        {/* Industry badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-foreground/70 text-sm">
          <span className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <span className="text-primary">⚡</span> HVAC
          </span>
          <span className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <span className="text-primary">🔧</span> Plumbing
          </span>
          <span className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <span className="text-primary">💡</span> Electrical
          </span>
          <span className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <span className="text-primary">🏗️</span> Contractors
          </span>
          <span className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <span className="text-primary">🧹</span> Cleaning
          </span>
          <span className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <span className="text-primary">🔨</span> Handyman
          </span>
        </div>
      </div>

      {/* Dashboard Preview Image */}
      <div className="relative mt-24 w-full">
        <AspectRatio className="max-w-[95vw]" ratio={21 / 9}>
          <MagicCard
            className="h-full w-full rounded-lg"
            data-magic-card=""
            gradientOpacity={0.5}
          >
            <img
              alt="Stratos Dashboard"
              className="h-full w-full rounded-lg object-cover object-top shadow-lg"
              src="/hero.png"
              style={{ position: "relative", zIndex: 10 }}
            />
          </MagicCard>
        </AspectRatio>
      </div>
    </div>
  );
}
