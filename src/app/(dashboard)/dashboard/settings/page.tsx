"use client";

export const dynamic = "force-dynamic";

import {
  AlertCircle,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  HelpCircle,
  Mail,
  MessageSquare,
  Package,
  Palette,
  Search,
  Settings2,
  Shield,
  Sparkles,
  User,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { usePageLayout } from "@/hooks/use-page-layout";
import { useUIStore } from "@/lib/store";

type SettingCategory = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  items: SettingItem[];
};

type SettingItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  status?: "complete" | "incomplete" | "warning";
  tooltip?: string;
};

const settingCategories: SettingCategory[] = [
  {
    title: "Account",
    description: "Manage your personal account settings and preferences",
    icon: User,
    items: [
      {
        title: "Personal Information",
        description: "Update your name, email, phone, and profile details",
        href: "/dashboard/settings/profile/personal",
        icon: User,
        status: "complete",
        tooltip: "Keep your contact information up to date",
      },
      {
        title: "Security",
        description: "Password, two-factor authentication, and login activity",
        href: "/dashboard/settings/profile/security",
        icon: Shield,
        status: "warning",
        tooltip: "Secure your account with strong authentication",
      },
      {
        title: "Notifications",
        description: "Email, push, and in-app notification preferences",
        href: "/dashboard/settings/profile/notifications",
        icon: Bell,
        tooltip: "Control how and when you receive updates",
      },
      {
        title: "Preferences",
        description: "Theme, language, timezone, and display settings",
        href: "/dashboard/settings/profile/preferences",
        icon: Palette,
        tooltip: "Customize your app experience",
      },
    ],
  },
  {
    title: "Company",
    description: "Business profile, team management, and billing",
    icon: Building2,
    items: [
      {
        title: "Company Profile",
        description: "Business name, address, logo, and contact details",
        href: "/dashboard/settings/company",
        icon: Building2,
        tooltip: "Your company information as it appears to customers",
      },
      {
        title: "Billing & Subscription",
        description: "Plans, payment methods, and invoices",
        href: "/dashboard/settings/billing",
        icon: CreditCard,
        tooltip: "Manage your subscription and billing information",
      },
      {
        title: "Team & Permissions",
        description: "Add team members and manage access levels",
        href: "/dashboard/settings/team",
        icon: Users,
        tooltip: "Control who has access to what in your account",
      },
    ],
  },
  {
    title: "Operations",
    description: "Configure how your field service business runs",
    icon: Settings2,
    items: [
      {
        title: "Booking Settings",
        description: "Availability, scheduling rules, and booking windows",
        href: "/dashboard/settings/booking",
        icon: Globe,
        tooltip: "Control when and how customers can book appointments",
      },
      {
        title: "Job Configuration",
        description: "Job types, statuses, and workflow settings",
        href: "/dashboard/settings/jobs",
        icon: Wrench,
        tooltip: "Customize job workflows to match your business",
      },
      {
        title: "Customer Intake",
        description: "Lead capture forms and qualification criteria",
        href: "/dashboard/settings/customer-intake",
        icon: FileText,
        tooltip: "Streamline how you collect customer information",
      },
      {
        title: "Customer Portal",
        description: "Self-service portal settings and branding",
        href: "/dashboard/settings/customer-portal",
        icon: Globe,
        tooltip: "Let customers view appointments and invoices online",
      },
    ],
  },
  {
    title: "Financial",
    description: "Pricing, invoicing, and payment settings",
    icon: CreditCard,
    items: [
      {
        title: "Invoice Settings",
        description: "Templates, terms, and payment options",
        href: "/dashboard/settings/invoices",
        icon: FileText,
        tooltip: "Configure how invoices are generated and sent",
      },
      {
        title: "Estimate Settings",
        description: "Quote templates and approval workflows",
        href: "/dashboard/settings/estimates",
        icon: FileText,
        tooltip: "Set up estimate templates and expiration rules",
      },
      {
        title: "Price Book",
        description: "Services, parts, labor rates, and packages",
        href: "/dashboard/settings/pricebook",
        icon: CreditCard,
        tooltip: "Maintain your catalog of services and pricing",
      },
      {
        title: "Service Plans",
        description: "Recurring maintenance plans and memberships",
        href: "/dashboard/settings/service-plans",
        icon: Sparkles,
        tooltip: "Create subscription-based service offerings",
      },
      {
        title: "Payroll Settings",
        description: "Time tracking, overtime, PTO, and compliance",
        href: "/dashboard/settings/payroll",
        icon: CreditCard,
        tooltip: "Configure payroll processing and employee compensation",
      },
    ],
  },
  {
    title: "Marketing",
    description: "Customer communication and outreach tools",
    icon: Sparkles,
    items: [
      {
        title: "Marketing Center",
        description: "Campaigns, promotions, and customer outreach",
        href: "/dashboard/settings/marketing",
        icon: Sparkles,
        tooltip: "Grow your business with marketing automation",
      },
      {
        title: "Communications",
        description: "Email templates, SMS settings, and messaging",
        href: "/dashboard/settings/communications",
        icon: Mail,
        tooltip: "Configure automated customer communications",
      },
    ],
  },
  {
    title: "Integrations",
    description: "Connect with external tools and services",
    icon: Zap,
    items: [
      {
        title: "Integration Hub",
        description: "Connect apps and automate workflows",
        href: "/dashboard/settings/integrations",
        icon: Zap,
        tooltip: "Integrate with your existing business tools",
      },
      {
        title: "QuickBooks",
        description: "Sync invoices, payments, and accounting data",
        href: "/dashboard/settings/quickbooks",
        icon: FileText,
        badge: "Popular",
        tooltip: "Two-way sync with QuickBooks Online",
      },
    ],
  },
];

export default function SettingsOverviewPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [poSystemEnabled, setPoSystemEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter settings based on search query
  const filteredCategories = settingCategories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="space-y-8">
      {/* Header with Profile Section - Google Account Style */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-4xl tracking-tight">Settings</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>
        </div>

        {/* Search Bar - Google Account Style */}
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
          <Input
            className="h-12 pl-10 text-base"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search settings..."
            type="search"
            value={searchQuery}
          />
        </div>
      </div>

      {/* Purchase Order System Toggle - Featured Setting */}
      {!searchQuery && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                  <Package className="size-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl">
                    Purchase Order System
                  </CardTitle>
                  <CardDescription className="text-base">
                    Automatically manage material orders for jobs, estimates,
                    and invoices
                  </CardDescription>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Switch
                  checked={poSystemEnabled}
                  onCheckedChange={setPoSystemEnabled}
                />
              </div>
            </div>
          </CardHeader>
          {poSystemEnabled && (
            <CardContent className="pt-0">
              <Button asChild className="w-full sm:w-auto" variant="default">
                <Link href="/dashboard/settings/purchase-orders">
                  Configure PO Settings
                  <ChevronRight className="ml-2 size-4" />
                </Link>
              </Button>
            </CardContent>
          )}
        </Card>
      )}

      {/* Settings Categories - Card-based Layout */}
      <div className="space-y-10">
        {filteredCategories.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <div className="space-y-4" key={category.title}>
              {/* Category Header - Material Design Style */}
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

              {/* Category Items - Clean Card Grid */}
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
                              {item.status && (
                                <div>
                                  {item.status === "complete" && (
                                    <CheckCircle2 className="size-4 text-green-500" />
                                  )}
                                  {item.status === "warning" && (
                                    <AlertCircle className="size-4 text-yellow-500" />
                                  )}
                                  {item.status === "incomplete" && (
                                    <AlertCircle className="size-4 text-muted-foreground" />
                                  )}
                                </div>
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

        {searchQuery && filteredCategories.length === 0 && (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center space-y-3 text-center">
              <Search className="size-12 text-muted-foreground/50" />
              <div>
                <p className="font-medium text-lg">No settings found</p>
                <p className="text-muted-foreground text-sm">
                  Try searching with different keywords
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Looking for Something Else? - Google Account Style */}
      {!searchQuery && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="size-5" />
              Looking for something else?
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/dashboard/help">
                <HelpCircle className="mr-2 size-4" />
                See help options
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/feedback">
                <MessageSquare className="mr-2 size-4" />
                Send feedback
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
