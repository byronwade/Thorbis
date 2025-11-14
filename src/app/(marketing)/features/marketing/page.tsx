import { ArrowDown, ArrowRight, CheckCircle2, Mail, MessageSquare, Phone, Star, Target, TrendingUp, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  generateBreadcrumbStructuredData,
  generateMetadata as generateSEOMetadata,
  generateServiceStructuredData,
  siteUrl,
} from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata = generateSEOMetadata({
  title: "Marketing Automation for Service Businesses | Thorbis",
  section: "Features",
  description:
    "Automated marketing campaigns that actually work. Nurture leads, boost reviews, and win back customers with intelligent automation built for service businesses.",
  path: "/features/marketing",
  keywords: [
    "service business marketing",
    "marketing automation",
    "review generation",
    "customer lifecycle marketing",
    "field service marketing",
  ],
});

export default function MarketingPage() {
  const serviceStructuredData = generateServiceStructuredData({
    name: "Marketing Automation",
    description:
      "Automated campaigns and review generation for service businesses",
    offers: [
      {
        price: "100",
        currency: "USD",
        description: "Included in Thorbis platform starting at $100/month",
      },
    ],
  });

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: "Home", url: siteUrl },
              { name: "Features", url: `${siteUrl}/features` },
              {
                name: "Marketing Automation",
                url: `${siteUrl}/features/marketing`,
              },
            ])
          ),
        }}
        id="marketing-breadcrumb-ld"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
        id="marketing-service-ld"
        type="application/ld+json"
      />

      {/* Hero Section with Funnel Visualization */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/10 via-background to-pink-500/10" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.15),_transparent_50%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 gap-1.5 px-3 py-1.5" variant="secondary">
              <Target className="size-3.5" />
              Lifecycle Marketing
            </Badge>
            <h1 className="mb-6 font-bold text-5xl tracking-tight sm:text-6xl lg:text-7xl">
              Marketing that runs itself
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Stop losing customers to competitors. Automated campaigns that nurture leads, 
              generate 5-star reviews, and bring customers back—all on autopilot.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild className="shadow-lg shadow-primary/20" size="lg">
                <Link href="/register">
                  Start Automating
                  <Zap className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">
                  See Campaign Examples
                </Link>
              </Button>
            </div>
          </div>

          {/* Customer Journey Funnel */}
          <div className="relative mx-auto mt-20 max-w-5xl">
            <div className="space-y-6">
              {/* Stage 1: New Lead */}
              <div className="relative">
                <div className="overflow-hidden rounded-2xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-transparent shadow-lg">
                  <div className="grid items-center gap-6 p-6 lg:grid-cols-[1fr_auto_2fr]">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-full bg-purple-500">
                          <Users className="size-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">New Lead</div>
                          <div className="text-muted-foreground text-sm">First contact</div>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="hidden size-6 text-purple-500 lg:block" />
                    <div className="space-y-2">
                      <div className="rounded-lg border bg-background/50 p-3">
                        <div className="mb-1 flex items-center gap-2 text-sm">
                          <Mail className="size-4 text-purple-500" />
                          <span className="font-semibold">Welcome Email</span>
                          <Badge className="ml-auto h-5 text-[10px]" variant="secondary">Instant</Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          "Thanks for reaching out! Here's what to expect..."
                        </p>
                      </div>
                      <div className="rounded-lg border bg-background/50 p-3">
                        <div className="mb-1 flex items-center gap-2 text-sm">
                          <MessageSquare className="size-4 text-purple-500" />
                          <span className="font-semibold">SMS Follow-Up</span>
                          <Badge className="ml-auto h-5 text-[10px]" variant="secondary">+2 hours</Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          "Still need help? Click here to schedule..."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mx-auto flex w-12 justify-center py-3">
                  <ArrowDown className="size-6 text-purple-500" />
                </div>
              </div>

              {/* Stage 2: Estimate Sent */}
              <div className="relative">
                <div className="overflow-hidden rounded-2xl border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-transparent shadow-lg">
                  <div className="grid items-center gap-6 p-6 lg:grid-cols-[1fr_auto_2fr]">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-full bg-blue-500">
                          <Target className="size-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">Estimate Sent</div>
                          <div className="text-muted-foreground text-sm">Proposal stage</div>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="hidden size-6 text-blue-500 lg:block" />
                    <div className="space-y-2">
                      <div className="rounded-lg border bg-background/50 p-3">
                        <div className="mb-1 flex items-center gap-2 text-sm">
                          <Mail className="size-4 text-blue-500" />
                          <span className="font-semibold">Proposal Reminder</span>
                          <Badge className="ml-auto h-5 text-[10px]" variant="secondary">+3 days</Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          "Just checking in on your estimate. Any questions?"
                        </p>
                      </div>
                      <div className="rounded-lg border bg-background/50 p-3">
                        <div className="mb-1 flex items-center gap-2 text-sm">
                          <Phone className="size-4 text-blue-500" />
                          <span className="font-semibold">Call Task Created</span>
                          <Badge className="ml-auto h-5 text-[10px]" variant="secondary">+7 days</Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Auto-assigned to sales rep for personal follow-up
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mx-auto flex w-12 justify-center py-3">
                  <ArrowDown className="size-6 text-blue-500" />
                </div>
              </div>

              {/* Stage 3: Job Completed */}
              <div className="relative">
                <div className="overflow-hidden rounded-2xl border-2 border-green-500/30 bg-gradient-to-r from-green-500/10 to-transparent shadow-lg">
                  <div className="grid items-center gap-6 p-6 lg:grid-cols-[1fr_auto_2fr]">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-full bg-green-500">
                          <CheckCircle2 className="size-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">Job Completed</div>
                          <div className="text-muted-foreground text-sm">Service delivered</div>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="hidden size-6 text-green-500 lg:block" />
                    <div className="space-y-2">
                      <div className="rounded-lg border bg-background/50 p-3">
                        <div className="mb-1 flex items-center gap-2 text-sm">
                          <Star className="size-4 text-green-500" />
                          <span className="font-semibold">Review Request</span>
                          <Badge className="ml-auto h-5 text-[10px]" variant="secondary">+1 day</Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          "How did we do? Leave a review and get 10% off next service"
                        </p>
                      </div>
                      <div className="rounded-lg border bg-background/50 p-3">
                        <div className="mb-1 flex items-center gap-2 text-sm">
                          <Mail className="size-4 text-green-500" />
                          <span className="font-semibold">Thank You Email</span>
                          <Badge className="ml-auto h-5 text-[10px]" variant="secondary">+3 days</Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          "Thanks for choosing us! Here are some maintenance tips..."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mx-auto flex w-12 justify-center py-3">
                  <ArrowDown className="size-6 text-green-500" />
                </div>
              </div>

              {/* Stage 4: Ongoing Customer */}
              <div className="relative">
                <div className="overflow-hidden rounded-2xl border-2 border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-transparent shadow-lg">
                  <div className="grid items-center gap-6 p-6 lg:grid-cols-[1fr_auto_2fr]">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-full bg-orange-500">
                          <TrendingUp className="size-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">Ongoing Customer</div>
                          <div className="text-muted-foreground text-sm">Retention mode</div>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="hidden size-6 text-orange-500 lg:block" />
                    <div className="space-y-2">
                      <div className="rounded-lg border bg-background/50 p-3">
                        <div className="mb-1 flex items-center gap-2 text-sm">
                          <MessageSquare className="size-4 text-orange-500" />
                          <span className="font-semibold">Seasonal Reminder</span>
                          <Badge className="ml-auto h-5 text-[10px]" variant="secondary">+6 months</Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          "Time for your spring AC tune-up! Book now and save 15%"
                        </p>
                      </div>
                      <div className="rounded-lg border bg-background/50 p-3">
                        <div className="mb-1 flex items-center gap-2 text-sm">
                          <Mail className="size-4 text-orange-500" />
                          <span className="font-semibold">Win-Back Campaign</span>
                          <Badge className="ml-auto h-5 text-[10px]" variant="secondary">+12 months</Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          "We miss you! Here's a special offer to come back..."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Metrics */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border bg-background p-4 text-center">
                <div className="mb-1 font-bold text-2xl text-primary">3.2x</div>
                <div className="text-muted-foreground text-sm">More Reviews</div>
              </div>
              <div className="rounded-xl border bg-background p-4 text-center">
                <div className="mb-1 font-bold text-2xl text-primary">42%</div>
                <div className="text-muted-foreground text-sm">Higher Conversion</div>
              </div>
              <div className="rounded-xl border bg-background p-4 text-center">
                <div className="mb-1 font-bold text-2xl text-primary">28%</div>
                <div className="text-muted-foreground text-sm">Repeat Business</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">4.8★</div>
              <div className="font-medium text-muted-foreground text-sm">
                Avg. Review Rating
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">3.2x</div>
              <div className="font-medium text-muted-foreground text-sm">
                More Reviews Generated
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">42%</div>
              <div className="font-medium text-muted-foreground text-sm">
                Higher Lead Conversion
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">$32K</div>
              <div className="font-medium text-muted-foreground text-sm">
                Avg. Annual Revenue Lift
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
              Pre-built campaigns that actually work
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Proven templates designed specifically for service businesses
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Review Generation */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-yellow-500/10 to-transparent">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-yellow-500/20">
                  <Star className="size-6 text-yellow-600" />
                </div>
                <CardTitle>Review Generation Engine</CardTitle>
                <CardDescription>
                  Turn happy customers into 5-star reviews automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      1
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Smart Timing</div>
                      <p className="text-muted-foreground text-xs">
                        Requests sent 24 hours after job completion when satisfaction is highest
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      2
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Multi-Platform</div>
                      <p className="text-muted-foreground text-xs">
                        Direct links to Google, Yelp, Facebook, and your preferred platforms
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      3
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Incentive Offers</div>
                      <p className="text-muted-foreground text-xs">
                        Optional discount codes to boost response rates (10-15% off next service)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      4
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Negative Feedback Filter</div>
                      <p className="text-muted-foreground text-xs">
                        Unhappy customers routed to private feedback form instead of public reviews
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
                  <div className="mb-2 font-semibold text-sm">Results</div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="font-bold text-xl text-yellow-600">3.2x</div>
                      <div className="text-muted-foreground text-xs">More Reviews</div>
                    </div>
                    <div>
                      <div className="font-bold text-xl text-yellow-600">4.8★</div>
                      <div className="text-muted-foreground text-xs">Avg. Rating</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lead Nurture */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-blue-500/10 to-transparent">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-500/20">
                  <Target className="size-6 text-blue-600" />
                </div>
                <CardTitle>Lead Nurture Sequences</CardTitle>
                <CardDescription>
                  Convert more estimates into booked jobs
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      1
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Instant Welcome</div>
                      <p className="text-muted-foreground text-xs">
                        Automated email/SMS within minutes of first contact with next steps
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      2
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Educational Content</div>
                      <p className="text-muted-foreground text-xs">
                        Share helpful tips, FAQs, and case studies to build trust
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      3
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Proposal Follow-Ups</div>
                      <p className="text-muted-foreground text-xs">
                        Automatic reminders at 3, 7, and 14 days with urgency messaging
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      4
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Sales Team Handoff</div>
                      <p className="text-muted-foreground text-xs">
                        Create tasks for personal outreach when automated touches don't convert
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
                  <div className="mb-2 font-semibold text-sm">Results</div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="font-bold text-xl text-blue-600">42%</div>
                      <div className="text-muted-foreground text-xs">Higher Conversion</div>
                    </div>
                    <div>
                      <div className="font-bold text-xl text-blue-600">14 days</div>
                      <div className="text-muted-foreground text-xs">Shorter Cycle</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Win-Back */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-purple-500/10 to-transparent">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-purple-500/20">
                  <TrendingUp className="size-6 text-purple-600" />
                </div>
                <CardTitle>Win-Back Campaigns</CardTitle>
                <CardDescription>
                  Reactivate dormant customers automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      1
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Inactivity Detection</div>
                      <p className="text-muted-foreground text-xs">
                        Automatically identifies customers who haven't booked in 6-12 months
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      2
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Personalized Offers</div>
                      <p className="text-muted-foreground text-xs">
                        Special "we miss you" discounts based on their service history
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      3
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Multi-Touch Sequence</div>
                      <p className="text-muted-foreground text-xs">
                        Email, SMS, and postcard series over 30 days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      4
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Urgency & Scarcity</div>
                      <p className="text-muted-foreground text-xs">
                        Limited-time offers and seasonal reminders to drive action
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
                  <div className="mb-2 font-semibold text-sm">Results</div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="font-bold text-xl text-purple-600">28%</div>
                      <div className="text-muted-foreground text-xs">Reactivation Rate</div>
                    </div>
                    <div>
                      <div className="font-bold text-xl text-purple-600">$8.2K</div>
                      <div className="text-muted-foreground text-xs">Avg. Recovered Revenue</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seasonal */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-green-500/10 to-transparent">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-green-500/20">
                  <Mail className="size-6 text-green-600" />
                </div>
                <CardTitle>Seasonal Campaigns</CardTitle>
                <CardDescription>
                  Fill your calendar during slow seasons
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      1
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Smart Scheduling</div>
                      <p className="text-muted-foreground text-xs">
                        Campaigns auto-trigger based on calendar (spring AC, fall furnace, etc.)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      2
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Service-Specific Targeting</div>
                      <p className="text-muted-foreground text-xs">
                        Only send to customers with relevant equipment (AC owners get AC reminders)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      3
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Early Bird Discounts</div>
                      <p className="text-muted-foreground text-xs">
                        Incentivize booking before peak season with special pricing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      4
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-sm">Maintenance Plans</div>
                      <p className="text-muted-foreground text-xs">
                        Promote recurring service agreements during campaign touchpoints
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                  <div className="mb-2 font-semibold text-sm">Results</div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="font-bold text-xl text-green-600">35%</div>
                      <div className="text-muted-foreground text-xs">Booking Increase</div>
                    </div>
                    <div>
                      <div className="font-bold text-xl text-green-600">18%</div>
                      <div className="text-muted-foreground text-xs">Plan Conversions</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t bg-muted/20 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
              Marketing automation that feels personal
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Powerful features that make every customer feel like your only customer
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="size-6 text-primary" />
                </div>
                <CardTitle>Smart Segmentation</CardTitle>
                <CardDescription>
                  Target the right customers with the right message
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Service history filtering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Geographic targeting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Behavior-based triggers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Custom audience builder</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="size-6 text-primary" />
                </div>
                <CardTitle>Multi-Channel Delivery</CardTitle>
                <CardDescription>
                  Reach customers wherever they are
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Email campaigns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>SMS text messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Direct mail postcards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>In-app notifications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-6 text-primary" />
                </div>
                <CardTitle>Personalization Engine</CardTitle>
                <CardDescription>
                  Dynamic content that adapts to each customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Name & address merge tags</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Service history references</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Equipment-specific content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Dynamic pricing & offers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="size-6 text-primary" />
                </div>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Track what's working and optimize campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Open & click rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Conversion tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Revenue attribution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>A/B testing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Star className="size-6 text-primary" />
                </div>
                <CardTitle>Review Management</CardTitle>
                <CardDescription>
                  Build your online reputation automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Multi-platform requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Negative feedback filtering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Review monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Response templates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="size-6 text-primary" />
                </div>
                <CardTitle>Workflow Automation</CardTitle>
                <CardDescription>
                  Set it and forget it marketing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Trigger-based campaigns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Time-delayed sequences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Conditional logic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Goal-based optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-8 sm:p-12">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary font-bold text-2xl text-primary-foreground">
                    DW
                  </div>
                  <div>
                    <div className="font-semibold text-lg">David Williams</div>
                    <div className="text-muted-foreground text-sm">Owner, Williams HVAC & Plumbing</div>
                  </div>
                </div>
                <blockquote className="text-lg leading-relaxed">
                  "Our Google reviews went from 47 to 312 in six months. The automated campaigns brought back 
                  $82K in dormant customers we thought were gone forever. Marketing used to be an afterthought—now 
                  it's our best salesperson."
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <Badge className="bg-yellow-500">312 Reviews</Badge>
                  <Badge variant="secondary">HVAC & Plumbing</Badge>
                  <Badge variant="secondary">Phoenix, AZ</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 py-20 text-white">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
            Start marketing on autopilot
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Join service businesses generating 3.2x more reviews and 42% higher conversions with Thorbis.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild className="bg-white text-purple-600 shadow-lg hover:bg-white/90" size="lg">
              <Link href="/register">
                Start Free Trial
                <Zap className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild className="border-white/20 bg-white/10 hover:bg-white/20" size="lg" variant="outline">
              <Link href="/contact">
                See Campaign Examples
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

