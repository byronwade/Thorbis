"use client";

export const dynamic = "force-dynamic";

import {
  AlertCircle,
  Bell,
  Bug,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe,
  Mail,
  Palette,
  Phone,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUIStore } from "@/lib/store";
import { usePageLayout } from "@/hooks/use-page-layout";

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

  const [showDevSettings, setShowDevSettings] = useState(false);
  const { setIncomingCall, addNotification, openModal } = useUIStore();

  // Dev tools handlers
  const handleTestIncomingCall = () => {
    setIncomingCall({
      number: "+1 (555) 123-4567",
      name: "Test Customer",
      avatar: "/placeholder-avatar.jpg",
    });
    addNotification({
      type: "info",
      message: "Test incoming call triggered",
      duration: 3000,
    });
  };

  const handleTestNotification = (
    type: "success" | "error" | "info" | "warning"
  ) => {
    const messages = {
      success: "Test success notification - Operation completed!",
      error: "Test error notification - Something went wrong!",
      info: "Test info notification - Here's some information.",
      warning: "Test warning notification - Please be careful!",
    };

    addNotification({
      type,
      message: messages[type],
      duration: 5000,
    });
  };

  const handleTestModal = () => {
    openModal("test-modal", { message: "This is a test modal" });
    addNotification({
      type: "info",
      message: "Test modal opened",
      duration: 3000,
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account, company, and business operations
          </p>
        </div>

        {/* Settings Categories */}
        <div className="space-y-8">
          {settingCategories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div className="space-y-4" key={category.title}>
                {/* Category Header */}
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <CategoryIcon className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{category.title}</h2>
                    <p className="text-muted-foreground text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Category Items */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {category.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                          <Link href={item.href}>
                            <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10">
                                      <ItemIcon className="size-4 text-muted-foreground group-hover:text-primary" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <CardTitle className="text-base">
                                          {item.title}
                                        </CardTitle>
                                        {item.badge && (
                                          <Badge
                                            className="text-xs"
                                            variant="secondary"
                                          >
                                            {item.badge}
                                          </Badge>
                                        )}
                                      </div>
                                      <CardDescription className="mt-1 line-clamp-2 text-xs">
                                        {item.description}
                                      </CardDescription>
                                    </div>
                                  </div>
                                  {item.status && (
                                    <div className="ml-2">
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
                              </CardHeader>
                            </Card>
                          </Link>
                        </TooltipTrigger>
                        {item.tooltip && (
                          <TooltipContent>
                            <p className="max-w-xs">{item.tooltip}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Developer Settings - Only show in development */}
        {process.env.NODE_ENV === "development" && (
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bug className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-amber-700 dark:text-amber-400">
                    Developer Settings
                  </CardTitle>
                </div>
                <Button
                  onClick={() => setShowDevSettings(!showDevSettings)}
                  size="sm"
                  variant="outline"
                >
                  {showDevSettings ? "Hide" : "Show"}
                </Button>
              </div>
              <CardDescription>
                Test UI components and features in development mode
              </CardDescription>
            </CardHeader>
            {showDevSettings && (
              <CardContent className="space-y-6">
                {/* Call Testing */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold text-sm">
                    <Phone className="h-4 w-4 text-green-500" />
                    Call System Testing
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleTestIncomingCall}
                      size="sm"
                      variant="outline"
                    >
                      Trigger Incoming Call
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Tests the incoming call notification overlay with controls
                  </p>
                </div>

                {/* Notification Testing */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold text-sm">
                    <Bell className="h-4 w-4 text-blue-500" />
                    Notification System Testing
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => handleTestNotification("success")}
                      size="sm"
                      variant="outline"
                    >
                      Success
                    </Button>
                    <Button
                      onClick={() => handleTestNotification("error")}
                      size="sm"
                      variant="outline"
                    >
                      Error
                    </Button>
                    <Button
                      onClick={() => handleTestNotification("info")}
                      size="sm"
                      variant="outline"
                    >
                      Info
                    </Button>
                    <Button
                      onClick={() => handleTestNotification("warning")}
                      size="sm"
                      variant="outline"
                    >
                      Warning
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Tests toast notifications with different states
                  </p>
                </div>

                {/* Modal Testing */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold text-sm">
                    <AlertCircle className="h-4 w-4 text-purple-500" />
                    Modal System Testing
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleTestModal}
                      size="sm"
                      variant="outline"
                    >
                      Open Test Modal
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Tests modal overlay system
                  </p>
                </div>

                {/* State Information */}
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="font-medium text-sm">Current Environment</p>
                  <p className="mt-1 text-muted-foreground text-xs">
                    NODE_ENV: {process.env.NODE_ENV}
                  </p>
                  <p className="mt-1 text-amber-600 text-xs dark:text-amber-400">
                    ⚠️ This section is only visible in development mode
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
