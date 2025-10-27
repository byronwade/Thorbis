"use client";

export const dynamic = "force-dynamic";

import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Edit,
  Gift,
  HelpCircle,
  Loader2,
  Package,
  Plus,
  Repeat,
  Save,
  Settings,
  Star,
  Trash2,
  Users,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePageLayout } from "@/hooks/use-page-layout";

// Constants
const SIMULATED_API_DELAY = 1500;
const _MAX_DESCRIPTION_LENGTH = 500;
const DEFAULT_BILLING_DAY = 1;

type ServicePlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  billingInterval: "monthly" | "quarterly" | "annually";
  visits: number;
  priority: boolean;
  discountPercent: number;
  benefits: string[];
  active: boolean;
  subscribers: number;
};

type ServicePlanSettings = {
  // General Settings
  enableServicePlans: boolean;
  allowCustomerSignup: boolean;
  requirePaymentMethod: boolean;
  sendWelcomeEmail: boolean;
  sendRenewalReminders: boolean;
  reminderDaysBeforeRenewal: number;

  // Billing Settings
  billingDay: number; // 1-28
  autoRenew: boolean;
  gracePeriodDays: number;
  retryFailedPayments: boolean;
  retryAttempts: number;
  retryIntervalDays: number;

  // Service Settings
  priorityScheduling: boolean;
  allowRolloverVisits: boolean;
  maxRolloverVisits: number;
  sendAppointmentReminders: boolean;
  autoScheduleVisits: boolean;

  // Member Benefits
  memberDiscount: number;
  waiveTripFees: boolean;
  waiveDiagnosticFees: boolean;
  partsDiscount: number;
  referralBonus: number;

  // Cancellation Policy
  allowCancellation: boolean;
  noticePeriodDays: number;
  refundUnusedVisits: boolean;
  cancellationFee: number;
};

export default function ServicePlansPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_showAddPlan, setShowAddPlan] = useState(false);

  const [settings, setSettings] = useState<ServicePlanSettings>({
    // General Settings
    enableServicePlans: true,
    allowCustomerSignup: true,
    requirePaymentMethod: true,
    sendWelcomeEmail: true,
    sendRenewalReminders: true,
    reminderDaysBeforeRenewal: 30,

    // Billing Settings
    billingDay: DEFAULT_BILLING_DAY,
    autoRenew: true,
    gracePeriodDays: 7,
    retryFailedPayments: true,
    retryAttempts: 3,
    retryIntervalDays: 3,

    // Service Settings
    priorityScheduling: true,
    allowRolloverVisits: true,
    maxRolloverVisits: 2,
    sendAppointmentReminders: true,
    autoScheduleVisits: false,

    // Member Benefits
    memberDiscount: 15,
    waiveTripFees: true,
    waiveDiagnosticFees: true,
    partsDiscount: 10,
    referralBonus: 50,

    // Cancellation Policy
    allowCancellation: true,
    noticePeriodDays: 30,
    refundUnusedVisits: true,
    cancellationFee: 0,
  });

  // Sample service plans
  const [plans] = useState<ServicePlan[]>([
    {
      id: "1",
      name: "Basic Care Plan",
      description: "Essential maintenance to keep your system running smoothly",
      price: 199,
      billingInterval: "annually",
      visits: 2,
      priority: false,
      discountPercent: 10,
      benefits: [
        "2 annual maintenance visits",
        "10% discount on repairs",
        "No trip charges",
        "Priority scheduling",
      ],
      active: true,
      subscribers: 124,
    },
    {
      id: "2",
      name: "Premium Care Plan",
      description:
        "Comprehensive coverage with priority service and bigger savings",
      price: 349,
      billingInterval: "annually",
      visits: 4,
      priority: true,
      discountPercent: 15,
      benefits: [
        "4 annual maintenance visits",
        "15% discount on repairs",
        "No trip or diagnostic charges",
        "Priority emergency service",
        "Free filter replacements",
        "$50 referral bonus",
      ],
      active: true,
      subscribers: 87,
    },
    {
      id: "3",
      name: "Monthly Maintenance",
      description: "Pay monthly for peace of mind protection",
      price: 29,
      billingInterval: "monthly",
      visits: 2,
      priority: false,
      discountPercent: 10,
      benefits: [
        "2 annual visits",
        "10% repair discount",
        "No trip charges",
        "Cancel anytime",
      ],
      active: true,
      subscribers: 203,
    },
  ]);

  const updateSetting = <K extends keyof ServicePlanSettings>(
    key: K,
    value: ServicePlanSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getBillingIntervalLabel = (interval: string) => {
    const labels: Record<string, string> = {
      monthly: "Monthly",
      quarterly: "Quarterly",
      annually: "Annually",
    };
    return labels[interval] || interval;
  };

  const _totalSubscribers = plans.reduce(
    (sum, plan) => sum + plan.subscribers,
    0
  );
  const activeSubscribers = plans
    .filter((plan) => plan.active)
    .reduce((sum, plan) => sum + plan.subscribers, 0);
  const monthlyRevenue = plans.reduce((sum, plan) => {
    const monthlyPrice =
      plan.billingInterval === "monthly"
        ? plan.price
        : plan.billingInterval === "quarterly"
          ? plan.price / 3
          : plan.price / 12;
    return sum + monthlyPrice * plan.subscribers;
  }, 0);

  async function handleSave() {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_API_DELAY));
    setIsSubmitting(false);
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Service Plans</h1>
            <p className="mt-2 text-muted-foreground">
              Recurring maintenance plans and memberships
            </p>
          </div>
          <Button onClick={() => setShowAddPlan(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Service Plan
          </Button>
        </div>

        <Separator />

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Active Members
                  </p>
                  <p className="mt-1 font-bold text-2xl">{activeSubscribers}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Monthly Revenue
                  </p>
                  <p className="mt-1 font-bold text-2xl">
                    ${monthlyRevenue.toFixed(0)}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Plans</p>
                  <p className="mt-1 font-bold text-2xl">
                    {plans.filter((p) => p.active).length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              General Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    How service plans work and who can sign up
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Basic settings for service plan program
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Service Plans
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Turn service plan feature on or off completely
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Turn on recurring maintenance plans
                </p>
              </div>
              <Switch
                checked={settings.enableServicePlans}
                onCheckedChange={(checked) =>
                  updateSetting("enableServicePlans", checked)
                }
              />
            </div>

            {settings.enableServicePlans && (
              <>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Allow Customer Self-Signup
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Let customers sign up for plans through customer
                            portal
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Customers can join through portal
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowCustomerSignup}
                    onCheckedChange={(checked) =>
                      updateSetting("allowCustomerSignup", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Require Payment Method
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Customer must save credit card to sign up
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Must have card on file to join
                    </p>
                  </div>
                  <Switch
                    checked={settings.requirePaymentMethod}
                    onCheckedChange={(checked) =>
                      updateSetting("requirePaymentMethod", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Send Welcome Email
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Email customer when they join a plan
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Welcome new members via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.sendWelcomeEmail}
                    onCheckedChange={(checked) =>
                      updateSetting("sendWelcomeEmail", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Send Renewal Reminders
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Remind customer before plan renews
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Remind before renewal date
                    </p>
                  </div>
                  <Switch
                    checked={settings.sendRenewalReminders}
                    onCheckedChange={(checked) =>
                      updateSetting("sendRenewalReminders", checked)
                    }
                  />
                </div>

                {settings.sendRenewalReminders && (
                  <div>
                    <Label className="font-medium text-sm">
                      Send Reminder How Many Days Before Renewal?
                    </Label>
                    <Input
                      className="mt-2"
                      onChange={(e) =>
                        updateSetting(
                          "reminderDaysBeforeRenewal",
                          Number.parseInt(e.target.value, 10) || 30
                        )
                      }
                      placeholder="30"
                      type="number"
                      value={settings.reminderDaysBeforeRenewal}
                    />
                    <p className="mt-1 text-muted-foreground text-xs">
                      Example: Remind 30 days before plan renews
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Billing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4" />
              Billing Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">When and how customers are charged</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Payment timing and failed payment handling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Billing Day of Month
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Day of month to charge monthly plans
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                className="mt-2"
                max="28"
                min="1"
                onChange={(e) =>
                  updateSetting(
                    "billingDay",
                    Number.parseInt(e.target.value, 10) || DEFAULT_BILLING_DAY
                  )
                }
                placeholder="1"
                type="number"
                value={settings.billingDay}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                Example: Charge on the 1st of each month (1-28)
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-Renew Plans
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically renew and charge when plan expires
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Automatically renew at end of term
                </p>
              </div>
              <Switch
                checked={settings.autoRenew}
                onCheckedChange={(checked) =>
                  updateSetting("autoRenew", checked)
                }
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Grace Period (Days)
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Days after failed payment before canceling benefits
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                className="mt-2"
                onChange={(e) =>
                  updateSetting(
                    "gracePeriodDays",
                    Number.parseInt(e.target.value, 10) || 7
                  )
                }
                placeholder="7"
                type="number"
                value={settings.gracePeriodDays}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                Keep benefits active for this many days after payment fails
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Retry Failed Payments
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically try charging again if payment fails
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Try charging card again if it fails
                </p>
              </div>
              <Switch
                checked={settings.retryFailedPayments}
                onCheckedChange={(checked) =>
                  updateSetting("retryFailedPayments", checked)
                }
              />
            </div>

            {settings.retryFailedPayments && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="font-medium text-sm">Retry Attempts</Label>
                  <Input
                    className="mt-2"
                    onChange={(e) =>
                      updateSetting(
                        "retryAttempts",
                        Number.parseInt(e.target.value, 10) || 3
                      )
                    }
                    placeholder="3"
                    type="number"
                    value={settings.retryAttempts}
                  />
                  <p className="mt-1 text-muted-foreground text-xs">
                    How many times to retry
                  </p>
                </div>

                <div>
                  <Label className="font-medium text-sm">
                    Days Between Retries
                  </Label>
                  <Input
                    className="mt-2"
                    onChange={(e) =>
                      updateSetting(
                        "retryIntervalDays",
                        Number.parseInt(e.target.value, 10) || 3
                      )
                    }
                    placeholder="3"
                    type="number"
                    value={settings.retryIntervalDays}
                  />
                  <p className="mt-1 text-muted-foreground text-xs">
                    Wait this long between attempts
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Service Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    How maintenance visits are scheduled and tracked
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Scheduling and visit management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Priority Scheduling
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Service plan members get scheduled before non-members
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Members get priority scheduling
                </p>
              </div>
              <Switch
                checked={settings.priorityScheduling}
                onCheckedChange={(checked) =>
                  updateSetting("priorityScheduling", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Rollover Visits
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Unused visits carry over to next billing period
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Unused visits carry over to next period
                </p>
              </div>
              <Switch
                checked={settings.allowRolloverVisits}
                onCheckedChange={(checked) =>
                  updateSetting("allowRolloverVisits", checked)
                }
              />
            </div>

            {settings.allowRolloverVisits && (
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Maximum Rollover Visits
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Most visits that can carry over
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting(
                      "maxRolloverVisits",
                      Number.parseInt(e.target.value, 10) || 2
                    )
                  }
                  placeholder="2"
                  type="number"
                  value={settings.maxRolloverVisits}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Example: Can carry over up to 2 visits
                </p>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Send Appointment Reminders
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Remind members about upcoming maintenance visits
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Remind members of scheduled visits
                </p>
              </div>
              <Switch
                checked={settings.sendAppointmentReminders}
                onCheckedChange={(checked) =>
                  updateSetting("sendAppointmentReminders", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-Schedule Maintenance
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically schedule visits at regular intervals
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Automatically schedule recurring visits
                </p>
              </div>
              <Switch
                checked={settings.autoScheduleVisits}
                onCheckedChange={(checked) =>
                  updateSetting("autoScheduleVisits", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Member Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gift className="h-4 w-4" />
              Member Benefits
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Perks and discounts for service plan members
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Discounts and perks for plan members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Member Discount on Repairs
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Percentage off all repair work for members
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="relative mt-2">
                <Input
                  onChange={(e) =>
                    updateSetting(
                      "memberDiscount",
                      Number.parseFloat(e.target.value) || 15
                    )
                  }
                  placeholder="15"
                  type="number"
                  value={settings.memberDiscount}
                />
                <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                  %
                </span>
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                Example: 15% off all repairs for members
              </p>
            </div>

            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Parts Discount
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Additional discount on parts and materials
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="relative mt-2">
                <Input
                  onChange={(e) =>
                    updateSetting(
                      "partsDiscount",
                      Number.parseFloat(e.target.value) || 10
                    )
                  }
                  placeholder="10"
                  type="number"
                  value={settings.partsDiscount}
                />
                <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                  %
                </span>
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                Discount on replacement parts
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Waive Trip Fees
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        No trip charge for service plan members
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  No trip charges for members
                </p>
              </div>
              <Switch
                checked={settings.waiveTripFees}
                onCheckedChange={(checked) =>
                  updateSetting("waiveTripFees", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Waive Diagnostic Fees
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        No charge for diagnosing problems
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Free diagnostics for members
                </p>
              </div>
              <Switch
                checked={settings.waiveDiagnosticFees}
                onCheckedChange={(checked) =>
                  updateSetting("waiveDiagnosticFees", checked)
                }
              />
            </div>

            <Separator />

            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Referral Bonus
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Credit given when member refers someone who joins
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="relative mt-2">
                <span className="-translate-y-1/2 absolute top-1/2 left-3 text-muted-foreground text-sm">
                  $
                </span>
                <Input
                  className="pl-8"
                  onChange={(e) =>
                    updateSetting(
                      "referralBonus",
                      Number.parseFloat(e.target.value) || 50
                    )
                  }
                  placeholder="50"
                  type="number"
                  value={settings.referralBonus}
                />
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                Credit when member refers new member
              </p>
            </div>

            <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
              <div className="flex items-start gap-3">
                <Star className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm">
                    Benefits Drive Enrollment
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Service plans with 15%+ discounts and waived fees have 3x
                    higher enrollment rates. Members stay 4x longer than
                    one-time customers.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Repeat className="h-4 w-4" />
              Cancellation Policy
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    What happens when customer wants to cancel
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              How customers can cancel their plans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Cancellation
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Let customers cancel their service plan
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customers can cancel their plan
                </p>
              </div>
              <Switch
                checked={settings.allowCancellation}
                onCheckedChange={(checked) =>
                  updateSetting("allowCancellation", checked)
                }
              />
            </div>

            {settings.allowCancellation && (
              <>
                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Notice Period (Days)
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          How many days before renewal customer must cancel
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    className="mt-2"
                    onChange={(e) =>
                      updateSetting(
                        "noticePeriodDays",
                        Number.parseInt(e.target.value, 10) || 30
                      )
                    }
                    placeholder="30"
                    type="number"
                    value={settings.noticePeriodDays}
                  />
                  <p className="mt-1 text-muted-foreground text-xs">
                    Example: Must cancel 30 days before renewal
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Refund Unused Visits
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Refund prorated amount for unused maintenance visits
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Refund for visits not used
                    </p>
                  </div>
                  <Switch
                    checked={settings.refundUnusedVisits}
                    onCheckedChange={(checked) =>
                      updateSetting("refundUnusedVisits", checked)
                    }
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Cancellation Fee
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          One-time fee charged when customer cancels
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="relative mt-2">
                    <span className="-translate-y-1/2 absolute top-1/2 left-3 text-muted-foreground text-sm">
                      $
                    </span>
                    <Input
                      className="pl-8"
                      onChange={(e) =>
                        updateSetting(
                          "cancellationFee",
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0"
                      type="number"
                      value={settings.cancellationFee}
                    />
                  </div>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Fee charged when canceling (0 for no fee)
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Active Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Service Plans</CardTitle>
            <CardDescription>Plans customers can choose from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {plans.map((plan) => (
              <div
                className="flex items-start justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                key={plan.id}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{plan.name}</h4>
                    {!plan.active && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                    {plan.priority && (
                      <Badge variant="default">
                        <Star className="mr-1 h-3 w-3" />
                        Priority
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                  <div className="mt-3 space-y-1">
                    {plan.benefits.map((benefit, index) => (
                      <div
                        className="flex items-center gap-2 text-xs"
                        key={index}
                      >
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">
                      {plan.subscribers} subscribers
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {plan.visits} visits per year
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-2xl">
                      ${plan.price}
                      <span className="font-normal text-muted-foreground text-sm">
                        /
                        {getBillingIntervalLabel(plan.billingInterval)
                          .toLowerCase()
                          .slice(0, -2)}
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {plan.discountPercent}% off repairs
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button disabled={isSubmitting} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={handleSave}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Service Plan Settings
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
