/**
 * Consumer Financing Resource Page - Server Component
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
  CreditCard,
  DollarSign,
  ExternalLink,
  Percent,
  Shield,
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

const financingProviders = [
  {
    name: "Wisetack",
    description: "Point-of-sale financing with instant approval and flexible terms",
    features: [
      "Instant approval decisions",
      "Flexible payment plans (3-84 months)",
      "Mobile-friendly application",
      "Contractor gets paid immediately",
    ],
    website: "https://www.wisetack.com",
    badge: "Popular",
  },
  {
    name: "GreenSky",
    description: "Trusted by contractors nationwide with competitive rates",
    features: [
      "No upfront costs for contractors",
      "Multiple plan options",
      "Fast approval process",
      "Marketing support included",
    ],
    website: "https://www.greensky.com",
    badge: "Trusted",
  },
  {
    name: "Synchrony HOME",
    description: "Large network with strong brand recognition",
    features: [
      "Deferred interest plans available",
      "High approval rates",
      "Digital and in-store applications",
      "Dedicated contractor support",
    ],
    website: "https://www.synchrony.com/home",
  },
  {
    name: "Mosaic",
    description: "Solar and home improvement financing specialist",
    features: [
      "Fast online application",
      "Competitive interest rates",
      "No prepayment penalties",
      "Real-time status updates",
    ],
    website: "https://www.joinmosaic.com",
  },
  {
    name: "Goodleap",
    description: "Technology-driven financing platform",
    features: [
      "Quick approval process",
      "Low monthly payments",
      "Multiple financing options",
      "Contractor portal access",
    ],
    website: "https://www.goodleap.com",
  },
  {
    name: "ServiceFinance",
    description: "Specialized in home services and repairs",
    features: [
      "Pre-qualification options",
      "Flexible loan amounts",
      "Quick funding",
      "Dedicated account management",
    ],
    website: "https://www.servicefinance.com",
  },
];

export default function ConsumerFinancingPage() {
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
            <CreditCard className="size-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-4xl tracking-tight">Consumer Financing</h1>
              <Badge variant="default">Popular</Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              Help customers afford big jobs with flexible financing options. Increase your
              average ticket size and close more sales.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
              <TrendingUp className="size-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-semibold">Increase Sales</p>
            <p className="text-muted-foreground text-sm">
              Convert more quotes into jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <DollarSign className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-semibold">Bigger Tickets</p>
            <p className="text-muted-foreground text-sm">
              Customers buy more with financing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Shield className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-semibold">Get Paid Fast</p>
            <p className="text-muted-foreground text-sm">
              You get paid upfront, no waiting
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Users className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-semibold">Happy Customers</p>
            <p className="text-muted-foreground text-sm">
              Manageable monthly payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Why Offer Financing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Why Offer Consumer Financing?</CardTitle>
          <CardDescription>
            Financing removes price as a barrier and helps customers say yes to the work
            they need
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                <Percent className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Close More Sales</h3>
                <p className="text-muted-foreground text-sm">
                  Studies show contractors offering financing close 30-40% more sales
                  compared to those who don't.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                <TrendingUp className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Larger Project Values</h3>
                <p className="text-muted-foreground text-sm">
                  Customers are more likely to approve additional work when they can
                  finance it over time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                <BadgeCheck className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Professional Image</h3>
                <p className="text-muted-foreground text-sm">
                  Offering financing options makes your business appear more established
                  and customer-focused.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
                <Shield className="size-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">No Risk to You</h3>
                <p className="text-muted-foreground text-sm">
                  You get paid by the financing company immediately. Customer payments are
                  between them and the lender.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <div className="flex items-start gap-3">
              <DollarSign className="mt-0.5 size-5 text-green-600 dark:text-green-400" />
              <div className="space-y-1">
                <p className="font-medium text-sm">Average Impact</p>
                <p className="text-muted-foreground text-sm">
                  Contractors report an average 35% increase in revenue and 25% higher
                  average ticket value after introducing consumer financing options.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financing Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Top Financing Providers</CardTitle>
          <CardDescription>
            Compare popular financing options for trade contractors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {financingProviders.map((provider) => (
              <Card className="group transition-all hover:border-primary/50 hover:shadow-md" key={provider.name}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {provider.name}
                        {provider.badge && (
                          <Badge className="text-xs" variant="secondary">
                            {provider.badge}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {provider.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {provider.features.map((feature) => (
                      <div className="flex items-start gap-2" key={feature}>
                        <CheckCircle className="mt-0.5 size-4 text-green-600 dark:text-green-400" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full" size="sm" variant="outline">
                    <a
                      href={provider.website}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Learn More
                      <ExternalLink className="ml-2 size-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">How to Get Started</CardTitle>
          <CardDescription>
            Setting up consumer financing is straightforward
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                1
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Choose a Provider</h3>
                <p className="text-muted-foreground">
                  Research the providers above and select one that fits your business. Many
                  contractors work with 2-3 providers to give customers options.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                2
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Complete Application</h3>
                <p className="text-muted-foreground">
                  Apply to become an authorized dealer. You'll need business information,
                  EIN, and basic financial details. Most approvals happen within 1-3 days.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                3
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Train Your Team</h3>
                <p className="text-muted-foreground">
                  Ensure your sales and customer service teams know how to present
                  financing options. Most providers offer training materials.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                4
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Promote It</h3>
                <p className="text-muted-foreground">
                  Add financing information to your website, proposals, and marketing
                  materials. Let customers know this option is available.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Best Practices</CardTitle>
          <CardDescription>Tips for success with consumer financing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Present Early</h4>
                <p className="text-muted-foreground text-sm">
                  Mention financing options during the initial phone call or quote, not
                  just when price becomes an objection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Show Monthly Payments</h4>
                <p className="text-muted-foreground text-sm">
                  Convert large job costs into manageable monthly payments in your quotes
                  (e.g., "$8,000 job or just $150/month").
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Streamline Applications</h4>
                <p className="text-muted-foreground text-sm">
                  Use mobile apps or tablets to help customers apply on-site. Instant
                  decisions keep momentum going.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Market the Option</h4>
                <p className="text-muted-foreground text-sm">
                  Add "Financing Available" badges to your truck wraps, yard signs,
                  website, and advertising materials.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Need Help? */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-xl">Need Help Getting Started?</CardTitle>
          <CardDescription>
            We can help you evaluate financing providers and set up your account
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
