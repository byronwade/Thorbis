/**
 * Google Local Services Ads Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle,
  DollarSign,
  ExternalLink,
  Phone,
  Search,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const revalidate = 3600; // Revalidate every hour

const benefits = [
  {
    icon: Star,
    title: "Top of Search Results",
    description:
      "LSA ads appear above organic results and traditional Google Ads, giving you prime visibility",
  },
  {
    icon: BadgeCheck,
    title: "Google Screened Badge",
    description:
      "Build trust with the Google Screened badge showing you've passed background and license checks",
  },
  {
    icon: DollarSign,
    title: "Pay Per Lead Only",
    description:
      "Only pay when customers contact you directly - no wasted spend on clicks that don't convert",
  },
  {
    icon: Phone,
    title: "Direct Phone Calls",
    description:
      "Customers can call you directly from the ad, and you get their contact information",
  },
  {
    icon: Shield,
    title: "Google Guarantee",
    description:
      "Jobs get up to $2,000 Google guarantee, giving customers confidence to choose you",
  },
  {
    icon: Users,
    title: "Review Integration",
    description:
      "Your Google reviews are prominently displayed, helping you stand out from competitors",
  },
];

const tradeCosts = [
  { trade: "HVAC", cost: "$25-45", demand: "High" },
  { trade: "Plumbing", cost: "$20-40", demand: "High" },
  { trade: "Electrical", cost: "$20-35", demand: "High" },
  { trade: "Garage Door", cost: "$15-30", demand: "Medium" },
  { trade: "Locksmith", cost: "$15-25", demand: "Medium" },
  { trade: "Appliance Repair", cost: "$15-30", demand: "Medium" },
];

export default function LocalServicesPage() {
  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <div>
        <Button asChild size="sm" variant="ghost">
          <Link href="/dashboard/tools">
            <ArrowLeft className="mr-2 size-4" />
            Back to Tools
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/15 to-green-500/5">
            <BadgeCheck className="size-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-4xl tracking-tight">
                Google Local Services Ads
              </h1>
              <Badge variant="default">Recommended</Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              Get Google Screened and appear at the very top of local search results. Only
              pay for leads that contact you directly.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
              <TrendingUp className="size-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-bold text-2xl">3-5x</p>
            <p className="text-muted-foreground text-sm">Better ROI vs Google Ads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Phone className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-bold text-2xl">20-50</p>
            <p className="text-muted-foreground text-sm">Leads per month average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Star className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-bold text-2xl">35%</p>
            <p className="text-muted-foreground text-sm">Average booking rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
              <DollarSign className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-bold text-2xl">$20-45</p>
            <p className="text-muted-foreground text-sm">Cost per lead range</p>
          </CardContent>
        </Card>
      </div>

      {/* What are LSAs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">What are Local Services Ads?</CardTitle>
          <CardDescription>
            Google's premium advertising program for home service professionals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Google Local Services Ads (LSA) is a pay-per-lead advertising platform designed
            specifically for home service professionals. Unlike traditional Google Ads where
            you pay for clicks, LSAs only charge you when a customer contacts you directly
            through your ad - either by calling or messaging.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            To participate in LSAs, you must pass Google's screening process which includes
            background checks, license verification, and insurance validation. Once approved,
            you receive the "Google Screened" or "Google Guaranteed" badge, which appears on
            your ads and significantly increases customer trust.
          </p>

          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 size-5 text-green-600 dark:text-green-400" />
              <div className="space-y-1">
                <p className="font-medium text-sm">Top Placement Guaranteed</p>
                <p className="text-muted-foreground text-sm">
                  LSAs appear at the very top of Google search results, above both organic
                  results and traditional Google Ads. This premium placement can
                  dramatically increase your visibility and lead volume.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Why Use Local Services Ads?</CardTitle>
          <CardDescription>
            Key advantages over traditional advertising
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div className="flex gap-4" key={benefit.title}>
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cost by Trade */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Typical Cost Per Lead by Trade</CardTitle>
          <CardDescription>
            Estimated lead costs vary by service type and market
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tradeCosts.map((trade) => (
              <div
                className="flex items-center justify-between rounded-lg border p-4"
                key={trade.trade}
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <Search className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{trade.trade}</p>
                    <p className="text-muted-foreground text-sm">
                      {trade.demand} demand market
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{trade.cost}</p>
                  <p className="text-muted-foreground text-xs">per lead</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="flex items-start gap-3">
              <DollarSign className="mt-0.5 size-5 text-blue-600 dark:text-blue-400" />
              <div className="space-y-1">
                <p className="font-medium text-sm">Competitive Markets</p>
                <p className="text-muted-foreground text-sm">
                  Costs are typically higher in major metropolitan areas and during peak
                  seasons. You can set weekly budgets to control spending and pause ads
                  anytime.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">How to Get Started</CardTitle>
          <CardDescription>
            The screening and setup process typically takes 5-10 business days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                1
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Create Your Account</h3>
                <p className="text-muted-foreground">
                  Sign up at ads.google.com/local-services-ads and provide basic business
                  information including name, address, phone, and service areas.
                </p>
                <Button asChild size="sm" variant="outline">
                  <a
                    href="https://ads.google.com/local-services-ads"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Start Application
                    <ExternalLink className="ml-2 size-3" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                2
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Complete Background Checks</h3>
                <p className="text-muted-foreground">
                  Google will run background checks on business owners and field workers.
                  This ensures customer safety and earns you the Google Screened badge.
                </p>
                <div className="space-y-2 pl-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Business owner background check</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Employee background checks (if applicable)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Valid driver's license verification</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                3
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Verify License & Insurance</h3>
                <p className="text-muted-foreground">
                  Upload copies of your business license and insurance certificates. Google
                  will verify these documents are current and meet minimum requirements.
                </p>
                <div className="space-y-2 pl-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Current business/trade license</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>General liability insurance ($1M+ recommended)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Workers compensation (if you have employees)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                4
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Set Your Budget & Services</h3>
                <p className="text-muted-foreground">
                  Choose which services to advertise, set your weekly budget, and define
                  your service area. Start conservative and scale up as you see results.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                5
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Go Live & Track Leads</h3>
                <p className="text-muted-foreground">
                  Once approved, your ads go live immediately. Track all leads in the Local
                  Services app, respond quickly, and dispute any invalid leads.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Best Practices for Success</CardTitle>
          <CardDescription>
            Tips to maximize your LSA performance and ROI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Respond Immediately</h4>
                <p className="text-muted-foreground text-sm">
                  Answer LSA calls within 30 seconds and reply to messages within 15
                  minutes. Fast response times improve your ranking and booking rate.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Collect Reviews</h4>
                <p className="text-muted-foreground text-sm">
                  Your star rating and review count directly impact ad placement. Ask every
                  satisfied customer to leave a Google review.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Dispute Invalid Leads</h4>
                <p className="text-muted-foreground text-sm">
                  You can dispute leads that are spam, wrong service area, or outside your
                  offerings. Google typically approves legitimate disputes within 48 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Optimize Your Profile</h4>
                <p className="text-muted-foreground text-sm">
                  Add photos, detailed service descriptions, business hours, and special
                  offers. Complete profiles get more clicks and better quality leads.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Manage Your Budget</h4>
                <p className="text-muted-foreground text-sm">
                  Set weekly budgets you're comfortable with. You can pause ads during slow
                  periods or when you're fully booked, then turn them back on when needed.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Additional Resources</CardTitle>
          <CardDescription>Learn more about Local Services Ads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
              href="https://support.google.com/localservices"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Shield className="mt-1 size-5 text-muted-foreground" />
              <div className="flex-1">
                <h4 className="font-medium">LSA Help Center</h4>
                <p className="text-muted-foreground text-sm">
                  Official Google support documentation
                </p>
              </div>
              <ExternalLink className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </a>

            <a
              className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
              href="https://ads.google.com/local-services-ads/pricing"
              rel="noopener noreferrer"
              target="_blank"
            >
              <DollarSign className="mt-1 size-5 text-muted-foreground" />
              <div className="flex-1">
                <h4 className="font-medium">Pricing Calculator</h4>
                <p className="text-muted-foreground text-sm">
                  Estimate costs for your service and area
                </p>
              </div>
              <ExternalLink className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Need Help? */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-xl">Need Help Getting Set Up?</CardTitle>
          <CardDescription>
            We can help you complete the screening process and optimize your LSA campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/help">
              Contact Support
              <ExternalLink className="ml-2 size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
