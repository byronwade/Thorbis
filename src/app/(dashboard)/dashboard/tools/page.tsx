/**
 * Tools Hub Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 */

import {
  Briefcase,
  Building2,
  ChevronRight,
  DollarSign,
  ExternalLink,
  Facebook,
  GraduationCap,
  Instagram,
  Landmark,
  Linkedin,
  Megaphone,
  Network,
  Search,
  Shield,
  TrendingUp,
  Twitter,
  Users,
  Wrench,
  Zap,
  BookOpen,
  Calculator,
  AlertTriangle,
  Building,
  CreditCard,
  FileText,
  BadgeCheck,
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

type ResourceCategory = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  items: ResourceItem[];
};

type ResourceItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  external?: boolean;
  popular?: boolean;
};

const resourceCategories: ResourceCategory[] = [
  {
    title: "Marketing & Social Media",
    description: "Establish your online presence and attract more customers",
    icon: Megaphone,
    items: [
      {
        title: "Google Business Profile",
        description: "Claim and optimize your Google Business listing to appear in local searches",
        href: "/dashboard/tools/marketing/google-business",
        icon: Search,
        badge: "Essential",
        popular: true,
      },
      {
        title: "Google Local Services Ads",
        description: "Get verified and appear at the top of Google search results",
        href: "/dashboard/tools/marketing/local-services",
        icon: BadgeCheck,
        badge: "Recommended",
        popular: true,
      },
      {
        title: "Facebook Business",
        description: "Set up a professional Facebook page and run targeted ads",
        href: "/dashboard/tools/marketing/facebook",
        icon: Facebook,
        popular: true,
      },
      {
        title: "Instagram for Business",
        description: "Showcase your work and connect with customers visually",
        href: "/dashboard/tools/marketing/instagram",
        icon: Instagram,
      },
      {
        title: "X (Twitter) Business",
        description: "Share updates and engage with your community",
        href: "/dashboard/tools/marketing/twitter",
        icon: Twitter,
      },
      {
        title: "LinkedIn Company Page",
        description: "Build professional network and attract commercial clients",
        href: "/dashboard/tools/marketing/linkedin",
        icon: Linkedin,
      },
    ],
  },
  {
    title: "Business Setup & Legal",
    description: "Essential resources for starting and running your business",
    icon: Briefcase,
    items: [
      {
        title: "Business Registration",
        description: "Register your business entity, EIN, and legal structure",
        href: "/dashboard/tools/business/registration",
        icon: Building2,
        badge: "Required",
      },
      {
        title: "Licensing & Permits",
        description: "State and local license requirements for trade contractors",
        href: "/dashboard/tools/business/licensing",
        icon: FileText,
        badge: "Required",
      },
      {
        title: "Business Insurance",
        description: "General liability, workers comp, and commercial auto insurance",
        href: "/dashboard/tools/business/insurance",
        icon: Shield,
        badge: "Essential",
        popular: true,
      },
      {
        title: "Banking & Payroll",
        description: "Business banking, payroll services, and accounting software",
        href: "/dashboard/tools/business/banking",
        icon: Landmark,
      },
      {
        title: "Legal Resources",
        description: "Contracts, liability waivers, and legal templates",
        href: "/dashboard/tools/business/legal",
        icon: FileText,
      },
    ],
  },
  {
    title: "Financing & Payment Processing",
    description: "Help customers pay and grow your business capital",
    icon: DollarSign,
    items: [
      {
        title: "Consumer Financing",
        description: "Offer customer financing through Wisetack, GreenSky, or Synchrony",
        href: "/dashboard/tools/financing/consumer",
        icon: CreditCard,
        badge: "Popular",
        popular: true,
      },
      {
        title: "Business Loans & Lines of Credit",
        description: "Working capital loans, equipment financing, and SBA loans",
        href: "/dashboard/tools/financing/business-loans",
        icon: TrendingUp,
      },
      {
        title: "Equipment Financing",
        description: "Finance trucks, tools, and equipment for your business",
        href: "/dashboard/tools/financing/equipment",
        icon: Wrench,
      },
      {
        title: "Credit Card Processing",
        description: "Accept payments with Square, Stripe, or merchant services",
        href: "/dashboard/tools/financing/credit-card",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Industry Networks & Associations",
    description: "Join professional groups and grow your business network",
    icon: Users,
    items: [
      {
        title: "Nexstar Network",
        description: "The largest network of home service contractors in North America",
        href: "/dashboard/tools/networks/nexstar",
        icon: Network,
        badge: "Premium",
        popular: true,
      },
      {
        title: "Service Nation Alliance",
        description: "Business coaching and peer group network for contractors",
        href: "/dashboard/tools/networks/service-nation",
        icon: Users,
        badge: "Premium",
      },
      {
        title: "ACCA - HVAC Excellence",
        description: "Air Conditioning Contractors of America trade association",
        href: "/dashboard/tools/networks/acca",
        icon: Zap,
      },
      {
        title: "PHCC - Plumbing & HVAC",
        description: "Plumbing-Heating-Cooling Contractors Association",
        href: "/dashboard/tools/networks/phcc",
        icon: Wrench,
      },
      {
        title: "NECA - Electrical",
        description: "National Electrical Contractors Association",
        href: "/dashboard/tools/networks/neca",
        icon: Zap,
      },
    ],
  },
  {
    title: "Training & Certification",
    description: "Professional development and industry certifications",
    icon: GraduationCap,
    items: [
      {
        title: "Trade Certifications",
        description: "State licensing, master certifications, and specialty credentials",
        href: "/dashboard/tools/training/certifications",
        icon: BadgeCheck,
      },
      {
        title: "OSHA Safety Training",
        description: "Workplace safety certifications and compliance training",
        href: "/dashboard/tools/training/osha",
        icon: AlertTriangle,
        badge: "Required",
      },
      {
        title: "EPA Certifications",
        description: "EPA 608 refrigerant handling and environmental certifications",
        href: "/dashboard/tools/training/epa",
        icon: Shield,
      },
      {
        title: "Business Management Training",
        description: "Operations, sales, customer service, and leadership courses",
        href: "/dashboard/tools/training/business",
        icon: GraduationCap,
      },
    ],
  },
  {
    title: "Resources & Calculators",
    description: "Helpful tools and industry information",
    icon: BookOpen,
    items: [
      {
        title: "Industry News & Blogs",
        description: "Stay updated with trade publications and industry trends",
        href: "/dashboard/tools/resources/news",
        icon: BookOpen,
      },
      {
        title: "Pricing Calculators",
        description: "Job cost estimators, material calculators, and pricing tools",
        href: "/dashboard/tools/resources/calculators",
        icon: Calculator,
      },
      {
        title: "Vendor Directories",
        description: "Find suppliers, wholesalers, and equipment dealers",
        href: "/dashboard/tools/resources/vendors",
        icon: Building,
      },
      {
        title: "Emergency Services Info",
        description: "After-hours support, emergency dispatch, and on-call resources",
        href: "/dashboard/tools/resources/emergency",
        icon: AlertTriangle,
      },
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-4xl tracking-tight">Tools & Resources</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Everything you need to grow your trade business
            </p>
          </div>
        </div>
      </div>

      {/* Featured Resources */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/15">
                <Search className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">Google Business</CardTitle>
                <CardDescription className="text-sm">
                  Get found in local searches
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/tools/marketing/google-business">
                Get Started
                <ChevronRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-green-500/15">
                <CreditCard className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">Consumer Financing</CardTitle>
                <CardDescription className="text-sm">
                  Help customers afford big jobs
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/tools/financing/consumer">
                Explore Options
                <ChevronRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/15">
                <Network className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">Industry Networks</CardTitle>
                <CardDescription className="text-sm">
                  Join professional groups
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/tools/networks/nexstar">
                Learn More
                <ChevronRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Resource Categories */}
      <div className="space-y-10">
        {resourceCategories.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <div className="space-y-4" key={category.title}>
              {/* Category Header */}
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5">
                  <CategoryIcon className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-xl tracking-tight">
                    {category.title}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Category Items */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link href={item.href} key={item.href}>
                      <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-lg">
                        <CardHeader className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/50 transition-colors group-hover:bg-primary/10">
                              <ItemIcon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                            </div>
                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <Badge className="text-xs" variant="secondary">
                                  {item.badge}
                                </Badge>
                              )}
                              {item.popular && (
                                <Badge className="text-xs" variant="default">
                                  Popular
                                </Badge>
                              )}
                              {item.external && (
                                <ExternalLink className="size-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <CardTitle className="flex items-center justify-between text-base">
                              {item.title}
                              <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                            </CardTitle>
                            <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                              {item.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Section */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="size-5" />
            Need Help Getting Started?
          </CardTitle>
          <CardDescription>
            Our team can help you set up any of these resources for your business
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/help">
              Contact Support
              <ChevronRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/schedule-demo">
              Schedule a Demo
              <ChevronRight className="ml-2 size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
