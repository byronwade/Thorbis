import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  DollarSign,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  generateBreadcrumbStructuredData,
  generateMetadata as generateSEOMetadata,
  generateServiceStructuredData,
  siteUrl,
} from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata = generateSEOMetadata({
  title: "Service Business CRM & Sales Pipeline | Thorbis",
  section: "Features",
  description:
    "Close more deals with intelligent CRM built for service businesses. Track every customer interaction, manage proposals, automate follow-ups, and forecast revenue with precision.",
  path: "/features/crm",
  keywords: [
    "service business crm",
    "field service sales",
    "customer relationship management",
    "sales pipeline software",
    "contractor crm",
  ],
});

export default function CRMPage() {
  const serviceStructuredData = generateServiceStructuredData({
    name: "CRM & Sales",
    description:
      "Customer intelligence and pipeline management for service businesses",
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
                name: "CRM & Sales",
                url: `${siteUrl}/features/crm`,
              },
            ])
          ),
        }}
        id="crm-breadcrumb-ld"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
        id="crm-service-ld"
        type="application/ld+json"
      />

      {/* Hero Section with Pipeline Visualization */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="-z-10 absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="-z-10 absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.15),_transparent_50%)]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 gap-1.5 px-3 py-1.5" variant="secondary">
              <Target className="size-3.5" />
              Sales Intelligence
            </Badge>
            <h1 className="mb-6 font-bold text-5xl tracking-tight sm:text-6xl lg:text-7xl">
              Turn leads into loyal customers
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              A CRM that actually understands service businesses. Track every
              touchpoint, automate follow-ups, and close more deals with
              intelligent insights.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild className="shadow-lg shadow-primary/20" size="lg">
                <Link href="/register">
                  Start 14-day Free Trial
                  <Zap className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">
                  <Phone className="mr-2 size-4" />
                  Talk to Sales
                </Link>
              </Button>
            </div>
          </div>

          {/* Sales Pipeline Visualization */}
          <div className="relative mx-auto mt-20 max-w-6xl">
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl">
              {/* Pipeline Header */}
              <div className="flex items-center justify-between border-border/50 border-b bg-gradient-to-r from-primary/5 to-transparent px-6 py-4">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-lg">Sales Pipeline</h3>
                  <Badge variant="secondary">$247K in pipeline</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <BarChart3 className="mr-2 size-3.5" />
                    Analytics
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="mr-2 size-3.5" />
                    Reports
                  </Button>
                </div>
              </div>

              {/* Pipeline Stages */}
              <div className="grid grid-cols-5 gap-4 p-6">
                {/* Stage 1: New Leads */}
                <div className="space-y-3">
                  <div className="rounded-lg bg-blue-500/10 p-3">
                    <div className="mb-1 font-semibold text-sm">New Leads</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-2xl">12</span>
                      <span className="text-muted-foreground text-xs">
                        $48K
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="group cursor-pointer rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 transition-all hover:border-blue-500/50 hover:shadow-md">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex size-8 items-center justify-center rounded-full bg-blue-500/20 font-semibold text-blue-600 text-xs">
                          JD
                        </div>
                        <Badge className="h-5 text-[10px]" variant="secondary">
                          Hot
                        </Badge>
                      </div>
                      <div className="mb-1 font-semibold text-sm">
                        John's HVAC Install
                      </div>
                      <div className="mb-2 text-muted-foreground text-xs">
                        Residential • $12,500
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Phone className="size-3" />
                        <span>Called 2 days ago</span>
                      </div>
                    </div>

                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex size-8 items-center justify-center rounded-full bg-blue-500/20 font-semibold text-blue-600 text-xs">
                          SM
                        </div>
                      </div>
                      <div className="mb-1 font-semibold text-sm">
                        Smith Property
                      </div>
                      <div className="mb-2 text-muted-foreground text-xs">
                        Commercial • $8,200
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Mail className="size-3" />
                        <span>Email sent today</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage 2: Qualified */}
                <div className="space-y-3">
                  <div className="rounded-lg bg-purple-500/10 p-3">
                    <div className="mb-1 font-semibold text-sm">Qualified</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-2xl">8</span>
                      <span className="text-muted-foreground text-xs">
                        $67K
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-3">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex size-8 items-center justify-center rounded-full bg-purple-500/20 font-semibold text-purple-600 text-xs">
                          AB
                        </div>
                        <Badge className="h-5 text-[10px]" variant="secondary">
                          Warm
                        </Badge>
                      </div>
                      <div className="mb-1 font-semibold text-sm">
                        Anderson Plumbing
                      </div>
                      <div className="mb-2 text-muted-foreground text-xs">
                        Multi-unit • $24,000
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <MessageSquare className="size-3" />
                        <span>Meeting scheduled</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage 3: Proposal Sent */}
                <div className="space-y-3">
                  <div className="rounded-lg bg-yellow-500/10 p-3">
                    <div className="mb-1 font-semibold text-sm">
                      Proposal Sent
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-2xl">5</span>
                      <span className="text-muted-foreground text-xs">
                        $82K
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex size-8 items-center justify-center rounded-full bg-yellow-500/20 font-semibold text-xs text-yellow-600">
                          TC
                        </div>
                        <Badge className="h-5 bg-green-500 text-[10px]">
                          Viewed
                        </Badge>
                      </div>
                      <div className="mb-1 font-semibold text-sm">
                        Tech Center Remodel
                      </div>
                      <div className="mb-2 text-muted-foreground text-xs">
                        Commercial • $45,000
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <FileText className="size-3" />
                        <span>Opened 3 times</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage 4: Negotiation */}
                <div className="space-y-3">
                  <div className="rounded-lg bg-orange-500/10 p-3">
                    <div className="mb-1 font-semibold text-sm">
                      Negotiation
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-2xl">3</span>
                      <span className="text-muted-foreground text-xs">
                        $38K
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex size-8 items-center justify-center rounded-full bg-orange-500/20 font-semibold text-orange-600 text-xs">
                          MW
                        </div>
                        <Badge className="h-5 text-[10px]" variant="secondary">
                          90%
                        </Badge>
                      </div>
                      <div className="mb-1 font-semibold text-sm">
                        Metro Warehouse
                      </div>
                      <div className="mb-2 text-muted-foreground text-xs">
                        Industrial • $28,500
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <DollarSign className="size-3" />
                        <span>Final pricing review</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage 5: Closed Won */}
                <div className="space-y-3">
                  <div className="rounded-lg bg-green-500/10 p-3">
                    <div className="mb-1 font-semibold text-sm">Closed Won</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-2xl">2</span>
                      <span className="text-muted-foreground text-xs">
                        $12K
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-full bg-green-500">
                          <CheckCircle2 className="size-4 text-white" />
                        </div>
                      </div>
                      <div className="mb-1 font-semibold text-sm">
                        Davis Residence
                      </div>
                      <div className="mb-2 text-muted-foreground text-xs">
                        Residential • $7,800
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <CheckCircle2 className="size-3" />
                        <span>Signed today</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pipeline Footer Stats */}
              <div className="grid grid-cols-4 gap-4 border-border/50 border-t bg-muted/20 px-6 py-4">
                <div>
                  <div className="text-muted-foreground text-xs">Win Rate</div>
                  <div className="font-semibold text-lg">67%</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">
                    Avg. Deal Size
                  </div>
                  <div className="font-semibold text-lg">$8,233</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">
                    Sales Cycle
                  </div>
                  <div className="font-semibold text-lg">14 days</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Forecast</div>
                  <div className="font-semibold text-lg">$165K</div>
                </div>
              </div>
            </div>

            {/* Floating AI Insight */}
            <div className="-right-4 absolute top-1/4 hidden max-w-xs rounded-xl border border-primary/50 bg-background p-4 shadow-2xl lg:block">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-full bg-primary">
                  <TrendingUp className="size-3 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sm">AI Insight</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Tech Center Remodel has viewed proposal 3 times.
                <span className="font-medium text-foreground">
                  {" "}
                  Recommend follow-up call today
                </span>{" "}
                for 85% close probability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">67%</div>
              <div className="font-medium text-muted-foreground text-sm">
                Higher Win Rate
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">
                14 days
              </div>
              <div className="font-medium text-muted-foreground text-sm">
                Avg. Sales Cycle
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">3.2x</div>
              <div className="font-medium text-muted-foreground text-sm">
                More Follow-Ups
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">$42K</div>
              <div className="font-medium text-muted-foreground text-sm">
                Avg. Monthly Revenue Lift
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Intelligence Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
              Know your customers better than they know themselves
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Every interaction, every job, every dollar—all in one place with
              AI-powered insights
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Customer 360 Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-6 text-primary" />
                </div>
                <CardTitle>360° Customer View</CardTitle>
                <CardDescription>
                  Complete customer history at your fingertips
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <div className="mb-1 font-semibold">Sarah Johnson</div>
                        <div className="text-muted-foreground text-sm">
                          123 Oak Street, Austin TX
                        </div>
                      </div>
                      <Badge variant="secondary">VIP</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="font-semibold text-lg">$18.2K</div>
                        <div className="text-muted-foreground text-xs">
                          Lifetime Value
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-lg">14</div>
                        <div className="text-muted-foreground text-xs">
                          Total Jobs
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-lg">3 yrs</div>
                        <div className="text-muted-foreground text-xs">
                          Customer Since
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>Complete interaction timeline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>Equipment & service history</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>Payment & billing records</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>Communication preferences</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="size-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Smart recommendations that drive revenue
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-full bg-green-500">
                        <ArrowRight className="size-3 text-white" />
                      </div>
                      <span className="font-semibold text-sm">
                        Upsell Opportunity
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Customer's AC unit is 12 years old. Recommend system
                      replacement during next maintenance visit.
                    </p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>Predictive maintenance alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>Cross-sell recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>Churn risk detection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>Optimal contact timing</span>
                    </li>
                  </ul>
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
              Everything you need to close more deals
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Built specifically for service businesses, not adapted from
              generic CRM software
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="size-6 text-primary" />
                </div>
                <CardTitle>Visual Sales Pipeline</CardTitle>
                <CardDescription>
                  Drag-and-drop deals through stages with real-time forecasting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Customizable pipeline stages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Win probability scoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Revenue forecasting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Deal aging alerts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-6 text-primary" />
                </div>
                <CardTitle>Smart Proposals</CardTitle>
                <CardDescription>
                  Create professional proposals in minutes with tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Branded proposal templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>View & engagement tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Digital signatures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Automatic follow-up reminders</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="size-6 text-primary" />
                </div>
                <CardTitle>Automated Follow-Ups</CardTitle>
                <CardDescription>
                  Never let a lead go cold with intelligent automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Email & SMS sequences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Task automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Trigger-based workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Personalized messaging</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="size-6 text-primary" />
                </div>
                <CardTitle>Commercial Accounts</CardTitle>
                <CardDescription>
                  Manage complex B2B relationships and contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Multi-location management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Contact hierarchies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Contract tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Account-level reporting</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="size-6 text-primary" />
                </div>
                <CardTitle>Communication Hub</CardTitle>
                <CardDescription>
                  All customer interactions in one unified timeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Call logging & recording</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Email integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>SMS conversations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Internal notes & mentions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="size-6 text-primary" />
                </div>
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>
                  Data-driven insights to optimize your sales process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Win/loss analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Sales cycle metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Team performance dashboards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Revenue attribution</span>
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
                    MR
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Mike Rodriguez</div>
                    <div className="text-muted-foreground text-sm">
                      Owner, Rodriguez HVAC
                    </div>
                  </div>
                </div>
                <blockquote className="text-lg leading-relaxed">
                  "We went from closing 1 in 4 estimates to 2 in 3 after
                  switching to Thorbis CRM. The AI insights tell us exactly when
                  to follow up, and the proposal tracking shows us which
                  customers are serious. Our revenue is up 42% year-over-year."
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <Badge variant="secondary">HVAC</Badge>
                  <Badge variant="secondary">12 Technicians</Badge>
                  <Badge variant="secondary">Austin, TX</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary/90 py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
            Start closing more deals today
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
            Join service businesses increasing their win rate by 67% with
            Thorbis CRM.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              className="bg-background text-foreground shadow-lg hover:bg-background/90"
              size="lg"
            >
              <Link href="/register">
                Start 14-day Free Trial
                <Zap className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20"
              size="lg"
              variant="outline"
            >
              <Link href="/contact">See CRM Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
