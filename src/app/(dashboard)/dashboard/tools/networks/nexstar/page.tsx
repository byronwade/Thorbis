/**
 * Nexstar Network Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  DollarSign,
  ExternalLink,
  GraduationCap,
  Network,
  TrendingUp,
  Users,
  Wrench,
  Zap,
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
    icon: GraduationCap,
    title: "World-Class Training",
    description:
      "Access to Nexstar University with courses on sales, operations, leadership, and technical skills",
  },
  {
    icon: Users,
    title: "Peer Groups",
    description:
      "Connect with 20-25 non-competing contractors to share best practices and solve challenges together",
  },
  {
    icon: TrendingUp,
    title: "Business Coaching",
    description:
      "One-on-one coaching from industry experts to help you reach your revenue and profit goals",
  },
  {
    icon: DollarSign,
    title: "Financial Benchmarking",
    description:
      "Compare your KPIs against top performers and identify areas for improvement",
  },
  {
    icon: Wrench,
    title: "Vendor Discounts",
    description:
      "Exclusive pricing on tools, equipment, vehicles, and services through group purchasing power",
  },
  {
    icon: Network,
    title: "National Network",
    description:
      "Join 950+ members across North America and leverage collective knowledge and resources",
  },
];

const services = [
  {
    title: "HVAC",
    members: "400+",
  },
  {
    title: "Plumbing",
    members: "300+",
  },
  {
    title: "Electrical",
    members: "200+",
  },
  {
    title: "All Trades",
    members: "50+",
  },
];

export default function NexstarPage() {
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
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/15 to-blue-500/5">
            <Network className="size-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-4xl tracking-tight">Nexstar Network</h1>
              <Badge variant="default">Premium</Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              The largest and most successful network of residential and light commercial
              contractors in North America
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-bold text-2xl">950+</p>
            <p className="text-muted-foreground text-sm">Member Companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
              <DollarSign className="size-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-bold text-2xl">$2.5B+</p>
            <p className="text-muted-foreground text-sm">Combined Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Award className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-bold text-2xl">45+</p>
            <p className="text-muted-foreground text-sm">Years of Excellence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
              <TrendingUp className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-bold text-2xl">25%</p>
            <p className="text-muted-foreground text-sm">Avg. Revenue Growth</p>
          </CardContent>
        </Card>
      </div>

      {/* What is Nexstar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">What is Nexstar Network?</CardTitle>
          <CardDescription>
            A proven business development organization for home service contractors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Nexstar Network is a member-owned business development organization that helps
            residential and light commercial service contractors improve their businesses
            through proven best practices, peer networking, and ongoing education. Founded
            in 1992, Nexstar has grown to become the largest and most successful network of
            its kind in North America.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Members gain access to world-class training, one-on-one coaching, peer group
            meetings, vendor partnerships, and a community of successful contractors who
            share the same challenges and goals. The result? Member companies consistently
            outperform industry averages in revenue growth, profit margins, and customer
            satisfaction.
          </p>

          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="flex items-start gap-3">
              <Award className="mt-0.5 size-5 text-blue-600 dark:text-blue-400" />
              <div className="space-y-1">
                <p className="font-medium text-sm">Proven Results</p>
                <p className="text-muted-foreground text-sm">
                  Nexstar members report an average 25% increase in revenue and 30%
                  improvement in net profit margins within their first two years of
                  membership.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Member Benefits</CardTitle>
          <CardDescription>
            What you get with Nexstar membership
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
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Membership Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Membership Programs</CardTitle>
          <CardDescription>Nexstar serves multiple trade specialties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card className="transition-all hover:border-primary/50 hover:shadow-md" key={service.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Users className="size-4" />
                    {service.members} members
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training & Education */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Nexstar University</CardTitle>
          <CardDescription>
            Comprehensive training programs for every role in your company
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Nexstar University offers over 40 courses covering technical skills, sales
            training, customer service, leadership development, and business operations.
            Training is available online, in-person, and at regional events throughout the
            year.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Technical Training</h4>
                <p className="text-muted-foreground text-sm">
                  Advanced HVAC, plumbing, and electrical skills
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Sales Mastery</h4>
                <p className="text-muted-foreground text-sm">
                  Consultative selling and closing techniques
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Customer Service</h4>
                <p className="text-muted-foreground text-sm">
                  Creating exceptional customer experiences
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Leadership Development</h4>
                <p className="text-muted-foreground text-sm">
                  Building and managing high-performance teams
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peer Groups */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Peer Group Meetings</CardTitle>
          <CardDescription>
            Connect with non-competing contractors and share best practices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Nexstar organizes members into peer groups of 20-25 non-competing contractors
            from similar markets and company sizes. Groups meet quarterly to discuss
            challenges, share financials, and learn from each other's successes and
            failures.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Open Book Management</h4>
                <p className="text-muted-foreground text-sm">
                  Share actual P&Ls and financials in a confidential setting to identify
                  opportunities
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Company Visits</h4>
                <p className="text-muted-foreground text-sm">
                  Tour member companies to see best practices in action and get ideas for
                  your business
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 size-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Mastermind Problem Solving</h4>
                <p className="text-muted-foreground text-sm">
                  Bring your toughest challenges and get input from contractors who've
                  faced similar issues
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Partners */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Vendor Partnerships</CardTitle>
          <CardDescription>
            Exclusive discounts and preferred pricing through group buying power
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Nexstar has negotiated exclusive deals with leading vendors in the home services
            industry, saving members thousands of dollars annually on vehicles, tools,
            equipment, software, and services.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
              <Zap className="size-5 text-primary" />
              <span className="font-medium">Equipment & Tools</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
              <Wrench className="size-5 text-primary" />
              <span className="font-medium">Vehicles & Fleet</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
              <BookOpen className="size-5 text-primary" />
              <span className="font-medium">Software & Technology</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
              <DollarSign className="size-5 text-primary" />
              <span className="font-medium">Financial Services</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Investment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Membership Investment</CardTitle>
          <CardDescription>
            Pricing varies based on company size and revenue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Nexstar membership fees are based on your company's annual revenue, typically
            ranging from $20,000 to $50,000+ per year. While this is a significant
            investment, most members report achieving ROI within the first 6-12 months
            through increased revenue, improved margins, and vendor savings.
          </p>

          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <div className="flex items-start gap-3">
              <DollarSign className="mt-0.5 size-5 text-green-600 dark:text-green-400" />
              <div className="space-y-1">
                <p className="font-medium text-sm">ROI Example</p>
                <p className="text-muted-foreground text-sm">
                  A $2M company paying $25K in annual dues typically sees $75-100K in
                  additional profit from improved margins, plus $10-15K in vendor savings,
                  resulting in a 3-4x return on investment.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Join */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">How to Join Nexstar</CardTitle>
          <CardDescription>
            Membership is by application and interview
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                1
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Attend an Event</h3>
                <p className="text-muted-foreground">
                  Start by attending a Nexstar event or webinar to learn more about the
                  network and meet current members.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                2
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Submit Application</h3>
                <p className="text-muted-foreground">
                  Complete the membership application and provide business financial
                  information for review.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                3
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Interview Process</h3>
                <p className="text-muted-foreground">
                  Participate in phone and in-person interviews to ensure Nexstar is a good
                  fit for your business goals.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                4
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Onboarding</h3>
                <p className="text-muted-foreground">
                  New members go through a comprehensive onboarding process including
                  training, peer group assignment, and coach matching.
                </p>
              </div>
            </div>
          </div>

          <Button asChild className="w-full" size="lg">
            <a
              href="https://www.nexstarnetwork.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Visit Nexstar Website
              <ExternalLink className="ml-2 size-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Learn More</CardTitle>
          <CardDescription>Additional Nexstar resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
              href="https://www.nexstarnetwork.com/success-stories"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Award className="mt-1 size-5 text-muted-foreground" />
              <div className="flex-1">
                <h4 className="font-medium">Member Success Stories</h4>
                <p className="text-muted-foreground text-sm">
                  Read case studies from contractors who transformed their businesses
                </p>
              </div>
              <ExternalLink className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </a>

            <a
              className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
              href="https://www.nexstarnetwork.com/events"
              rel="noopener noreferrer"
              target="_blank"
            >
              <BookOpen className="mt-1 size-5 text-muted-foreground" />
              <div className="flex-1">
                <h4 className="font-medium">Upcoming Events</h4>
                <p className="text-muted-foreground text-sm">
                  View calendar of training events and conferences
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
          <CardTitle className="text-xl">Questions About Nexstar?</CardTitle>
          <CardDescription>
            We can help you evaluate if Nexstar is right for your business
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
