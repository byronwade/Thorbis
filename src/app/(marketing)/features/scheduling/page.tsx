import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Route,
  TrendingUp,
  Truck,
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
  title: "Smart Scheduling & Dispatch Software | Thorbis",
  section: "Features",
  description:
    "Intelligent scheduling and dispatch that optimizes routes, maximizes technician utilization, and keeps customers happy. Real-time updates, drag-and-drop boards, and automated routing.",
  path: "/features/scheduling",
  keywords: [
    "field service scheduling",
    "dispatch software",
    "route optimization",
    "technician scheduling",
    "service board management",
  ],
});

export default function SchedulingPage() {
  const serviceStructuredData = generateServiceStructuredData({
    name: "Scheduling & Dispatch",
    description:
      "Smart routing and real-time crew coordination for service businesses",
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
                name: "Scheduling & Dispatch",
                url: `${siteUrl}/features/scheduling`,
              },
            ])
          ),
        }}
        id="scheduling-breadcrumb-ld"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
        id="scheduling-service-ld"
        type="application/ld+json"
      />

      {/* Hero Section with Board Visualization */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="-z-10 absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 gap-1.5 px-3 py-1.5" variant="secondary">
              <Calendar className="size-3.5" />
              Intelligent Scheduling
            </Badge>
            <h1 className="mb-6 font-bold text-5xl tracking-tight sm:text-6xl lg:text-7xl">
              Schedule smarter, dispatch faster
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Drag-and-drop scheduling boards with AI-powered route
              optimization. Keep every truck profitable and every customer
              happy.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild className="shadow-lg shadow-primary/20" size="lg">
                <Link href="/register">
                  Start 14-day Free Trial
                  <Zap className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">See Live Demo</Link>
              </Button>
            </div>
          </div>

          {/* Interactive Dispatch Board Preview */}
          <div className="relative mx-auto mt-16 max-w-6xl">
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl">
              {/* Board Header */}
              <div className="flex items-center justify-between border-border/50 border-b bg-muted/30 px-6 py-4">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-lg">Today's Schedule</h3>
                  <Badge variant="secondary">12 Jobs • 4 Techs</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <MapPin className="mr-2 size-3.5" />
                    Map View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Route className="mr-2 size-3.5" />
                    Optimize Routes
                  </Button>
                </div>
              </div>

              {/* Dispatch Board */}
              <div className="grid grid-cols-4 gap-4 p-6">
                {/* Tech Column 1 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-blue-500 font-semibold text-white text-xs">
                      MJ
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Mike Johnson</div>
                      <div className="text-muted-foreground text-xs">
                        3 jobs • 85% util
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <Clock className="size-3 text-green-600" />
                        <span className="font-semibold text-xs">
                          8:00 AM - 10:00 AM
                        </span>
                      </div>
                      <div className="font-medium text-sm">AC Repair</div>
                      <div className="text-muted-foreground text-xs">
                        123 Oak St
                      </div>
                    </div>
                    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <Clock className="size-3 text-yellow-600" />
                        <span className="font-semibold text-xs">
                          11:00 AM - 1:00 PM
                        </span>
                      </div>
                      <div className="font-medium text-sm">Maintenance</div>
                      <div className="text-muted-foreground text-xs">
                        456 Elm St
                      </div>
                    </div>
                    <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <Clock className="size-3 text-blue-600" />
                        <span className="font-semibold text-xs">
                          2:00 PM - 4:00 PM
                        </span>
                      </div>
                      <div className="font-medium text-sm">Installation</div>
                      <div className="text-muted-foreground text-xs">
                        789 Pine St
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tech Column 2 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-purple-500 font-semibold text-white text-xs">
                      SR
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">
                        Sarah Rodriguez
                      </div>
                      <div className="text-muted-foreground text-xs">
                        4 jobs • 92% util
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <Clock className="size-3 text-green-600" />
                        <span className="font-semibold text-xs">
                          8:30 AM - 10:30 AM
                        </span>
                      </div>
                      <div className="font-medium text-sm">Inspection</div>
                      <div className="text-muted-foreground text-xs">
                        321 Maple Ave
                      </div>
                    </div>
                    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <Clock className="size-3 text-yellow-600" />
                        <span className="font-semibold text-xs">
                          11:30 AM - 12:30 PM
                        </span>
                      </div>
                      <div className="font-medium text-sm">Quick Fix</div>
                      <div className="text-muted-foreground text-xs">
                        654 Cedar Ln
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tech Column 3 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-orange-500 font-semibold text-white text-xs">
                      TC
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Tom Chen</div>
                      <div className="text-muted-foreground text-xs">
                        2 jobs • 68% util
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <Clock className="size-3 text-green-600" />
                        <span className="font-semibold text-xs">
                          9:00 AM - 12:00 PM
                        </span>
                      </div>
                      <div className="font-medium text-sm">System Install</div>
                      <div className="text-muted-foreground text-xs">
                        987 Birch Dr
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unassigned Column */}
                <div className="space-y-3">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="font-semibold text-sm">Unassigned</div>
                    <div className="text-muted-foreground text-xs">
                      3 jobs pending
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="cursor-move rounded-lg border-2 border-border border-dashed p-3 transition-colors hover:border-primary hover:bg-primary/5">
                      <div className="mb-1 flex items-center gap-2">
                        <Badge
                          className="h-5 text-[10px]"
                          variant="destructive"
                        >
                          URGENT
                        </Badge>
                      </div>
                      <div className="font-medium text-sm">Emergency Call</div>
                      <div className="text-muted-foreground text-xs">
                        147 Walnut St
                      </div>
                    </div>
                    <div className="cursor-move rounded-lg border-2 border-border border-dashed p-3 transition-colors hover:border-primary hover:bg-primary/5">
                      <div className="font-medium text-sm">Estimate</div>
                      <div className="text-muted-foreground text-xs">
                        258 Spruce Ct
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="-left-4 absolute top-1/4 hidden rounded-xl border border-border/50 bg-background p-4 shadow-xl lg:block">
              <div className="mb-2 font-semibold text-muted-foreground text-xs">
                Today's Metrics
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-green-500" />
                  <span className="text-sm">85% Utilization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Route className="size-4 text-blue-500" />
                  <span className="text-sm">124 mi saved</span>
                </div>
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
              <div className="mb-2 font-bold text-4xl text-primary">35%</div>
              <div className="font-medium text-muted-foreground text-sm">
                More Jobs Per Day
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">
                2.5 hrs
              </div>
              <div className="font-medium text-muted-foreground text-sm">
                Saved Per Tech Daily
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">90%</div>
              <div className="font-medium text-muted-foreground text-sm">
                On-Time Arrival Rate
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">$18K</div>
              <div className="font-medium text-muted-foreground text-sm">
                Avg. Monthly Savings
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
              Built for modern dispatch teams
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Everything you need to run a profitable, efficient service
              operation
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Route className="size-6 text-primary" />
                </div>
                <CardTitle>AI Route Optimization</CardTitle>
                <CardDescription>
                  Automatically plan the most efficient routes based on traffic,
                  job duration, and tech skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Real-time traffic integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Multi-stop optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Fuel cost calculations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="size-6 text-primary" />
                </div>
                <CardTitle>Drag-and-Drop Boards</CardTitle>
                <CardDescription>
                  Intuitive visual scheduling with real-time updates and
                  conflict detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Color-coded job types</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Capacity warnings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Quick reassignment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-6 text-primary" />
                </div>
                <CardTitle>Smart Tech Matching</CardTitle>
                <CardDescription>
                  Assign jobs based on skills, certifications, location, and
                  availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Skill-based routing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Certification tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Performance scoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="size-6 text-primary" />
                </div>
                <CardTitle>Live GPS Tracking</CardTitle>
                <CardDescription>
                  See exactly where every tech is in real-time with ETA updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Real-time location updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Automatic ETA notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Geofence alerts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="size-6 text-primary" />
                </div>
                <CardTitle>Automated Reminders</CardTitle>
                <CardDescription>
                  Keep customers informed with automatic SMS and email
                  notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>24-hour advance reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>"On the way" notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Completion confirmations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Truck className="size-6 text-primary" />
                </div>
                <CardTitle>Capacity Planning</CardTitle>
                <CardDescription>
                  Forecast demand and optimize crew size for maximum
                  profitability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Utilization analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Demand forecasting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Overtime alerts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary/90 py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
            Ready to optimize your dispatch?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
            Join service businesses running 35% more jobs per day with Thorbis
            scheduling.
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
              <Link href="/contact">See It In Action</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
