"use client";

export const dynamic = "force-dynamic";

import {
  Bell,
  Calendar,
  CreditCard,
  Eye,
  FileText,
  Globe,
  HelpCircle,
  Loader2,
  Lock,
  MessageSquare,
  Palette,
  Save,
  Shield,
  Star,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePageLayout } from "@/hooks/use-page-layout";

// Constants
const SIMULATED_API_DELAY = 1500;

type CustomerPortalSettings = {
  // Portal Access
  enableCustomerPortal: boolean;
  requireAccountActivation: boolean;
  allowSelfRegistration: boolean;
  requireEmailVerification: boolean;

  // What Customers Can See
  viewJobHistory: boolean;
  viewInvoices: boolean;
  viewEstimates: boolean;
  viewPaymentHistory: boolean;
  viewScheduledAppointments: boolean;
  viewServiceAgreements: boolean;

  // What Customers Can Do
  bookAppointments: boolean;
  rescheduleAppointments: boolean;
  cancelAppointments: number; // hours notice required
  requestServices: boolean;
  payInvoicesOnline: boolean;
  approveEstimates: boolean;
  uploadDocuments: boolean;
  messageTeam: boolean;

  // Communication
  enablePortalNotifications: boolean;
  notifyOnNewInvoice: boolean;
  notifyOnAppointmentUpdate: boolean;
  notifyOnMessageReceived: boolean;

  // Branding
  portalName: string;
  customDomain: string;
  brandingColor: string;
  showCompanyLogo: boolean;
  customWelcomeMessage: string;

  // Features
  enableReviews: boolean;
  enableReferrals: boolean;
  showServiceHistory: boolean;
  showMaintenanceReminders: boolean;
};

export default function CustomerPortalPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<CustomerPortalSettings>({
    // Access
    enableCustomerPortal: true,
    requireAccountActivation: true,
    allowSelfRegistration: true,
    requireEmailVerification: true,

    // View Permissions
    viewJobHistory: true,
    viewInvoices: true,
    viewEstimates: true,
    viewPaymentHistory: true,
    viewScheduledAppointments: true,
    viewServiceAgreements: true,

    // Actions
    bookAppointments: true,
    rescheduleAppointments: true,
    cancelAppointments: 24,
    requestServices: true,
    payInvoicesOnline: true,
    approveEstimates: true,
    uploadDocuments: true,
    messageTeam: true,

    // Communication
    enablePortalNotifications: true,
    notifyOnNewInvoice: true,
    notifyOnAppointmentUpdate: true,
    notifyOnMessageReceived: true,

    // Branding
    portalName: "My Services Portal",
    customDomain: "",
    brandingColor: "#3b82f6",
    showCompanyLogo: true,
    customWelcomeMessage:
      "Welcome to your customer portal! View your service history, pay invoices, and book appointments.",

    // Features
    enableReviews: true,
    enableReferrals: true,
    showServiceHistory: true,
    showMaintenanceReminders: true,
  });

  const updateSetting = <K extends keyof CustomerPortalSettings>(
    key: K,
    value: CustomerPortalSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function handleSave() {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_API_DELAY));
    setIsSubmitting(false);
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Customer Portal Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Give customers 24/7 access to their account, jobs, and invoices
            </p>
          </div>
          <Badge
            className={`text-base ${settings.enableCustomerPortal ? "bg-green-500" : "bg-gray-500"}`}
          >
            {settings.enableCustomerPortal
              ? "Portal Active"
              : "Portal Disabled"}
          </Badge>
        </div>

        <Separator />

        {/* Portal Access */}
        <Card className={settings.enableCustomerPortal ? "" : "opacity-60"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="h-4 w-4" />
              Portal Access & Security
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>
                    Control who can access the customer portal and how they sign
                    in
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Control how customers access their portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-base">
                  <Globe className="h-4 w-4" />
                  Enable Customer Portal
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Turn the entire customer portal on or off. When off,
                        customers cannot log in.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-sm">
                  Let customers access their account online
                </p>
              </div>
              <Switch
                checked={settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("enableCustomerPortal", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Account Activation
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        You must manually approve each customer before they can
                        log in
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Manually approve each customer
                </p>
              </div>
              <Switch
                checked={settings.requireAccountActivation}
                disabled={!settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("requireAccountActivation", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Self-Registration
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Let new customers create their own accounts without
                        contacting you
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customers can sign up themselves
                </p>
              </div>
              <Switch
                checked={settings.allowSelfRegistration}
                disabled={!settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("allowSelfRegistration", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <Shield className="h-3.5 w-3.5" />
                  Require Email Verification
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Customer must click link in email to verify their email
                        address
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Verify email before login
                </p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                disabled={!settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("requireEmailVerification", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* What Customers Can See */}
        <Card className={settings.enableCustomerPortal ? "" : "opacity-60"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4" />
              What Customers Can See
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>
                    Choose what information customers can view in the portal
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Information visible to customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5" />
                    Job History
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Past service jobs
                  </p>
                </div>
                <Switch
                  checked={settings.viewJobHistory}
                  disabled={!settings.enableCustomerPortal}
                  onCheckedChange={(checked) =>
                    updateSetting("viewJobHistory", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 text-sm">
                    <FileText className="h-3.5 w-3.5" />
                    Invoices
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    All their bills
                  </p>
                </div>
                <Switch
                  checked={settings.viewInvoices}
                  disabled={!settings.enableCustomerPortal}
                  onCheckedChange={(checked) =>
                    updateSetting("viewInvoices", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 text-sm">
                    <FileText className="h-3.5 w-3.5" />
                    Estimates
                  </Label>
                  <p className="text-muted-foreground text-xs">Price quotes</p>
                </div>
                <Switch
                  checked={settings.viewEstimates}
                  disabled={!settings.enableCustomerPortal}
                  onCheckedChange={(checked) =>
                    updateSetting("viewEstimates", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-3.5 w-3.5" />
                    Payment History
                  </Label>
                  <p className="text-muted-foreground text-xs">Past payments</p>
                </div>
                <Switch
                  checked={settings.viewPaymentHistory}
                  disabled={!settings.enableCustomerPortal}
                  onCheckedChange={(checked) =>
                    updateSetting("viewPaymentHistory", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5" />
                    Scheduled Jobs
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Upcoming appointments
                  </p>
                </div>
                <Switch
                  checked={settings.viewScheduledAppointments}
                  disabled={!settings.enableCustomerPortal}
                  onCheckedChange={(checked) =>
                    updateSetting("viewScheduledAppointments", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 text-sm">
                    <FileText className="h-3.5 w-3.5" />
                    Service Agreements
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Contracts & plans
                  </p>
                </div>
                <Switch
                  checked={settings.viewServiceAgreements}
                  disabled={!settings.enableCustomerPortal}
                  onCheckedChange={(checked) =>
                    updateSetting("viewServiceAgreements", checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Customers Can Do */}
        <Card className={settings.enableCustomerPortal ? "" : "opacity-60"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              What Customers Can Do
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Actions customers can take in the portal</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Actions customers can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <Calendar className="h-3.5 w-3.5" />
                  Book New Appointments
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Let customers schedule new service appointments online
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Schedule new services
                </p>
              </div>
              <Switch
                checked={settings.bookAppointments}
                disabled={!settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("bookAppointments", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Reschedule Appointments
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Allow customers to change appointment times themselves
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Change appointment times
                </p>
              </div>
              <Switch
                checked={settings.rescheduleAppointments}
                disabled={!settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("rescheduleAppointments", checked)
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Cancel Appointments
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      How much advance notice required for customers to cancel
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  className="w-24"
                  disabled={!settings.enableCustomerPortal}
                  max={72}
                  min={0}
                  onChange={(e) =>
                    updateSetting("cancelAppointments", Number(e.target.value))
                  }
                  type="number"
                  value={settings.cancelAppointments}
                />
                <span className="text-muted-foreground text-sm">
                  hours notice required
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Request Services
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Submit service requests for you to review
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Submit service requests
                </p>
              </div>
              <Switch
                checked={settings.requestServices}
                disabled={!settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("requestServices", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <CreditCard className="h-3.5 w-3.5" />
                  Pay Invoices Online
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Accept credit card payments through the portal
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Accept card payments
                </p>
              </div>
              <Switch
                checked={settings.payInvoicesOnline}
                disabled={!settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("payInvoicesOnline", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <FileText className="h-3.5 w-3.5" />
                  Approve Estimates
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Customers can approve price quotes online
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Approve price quotes
                </p>
              </div>
              <Switch
                checked={settings.approveEstimates}
                disabled={!settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("approveEstimates", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Upload Documents
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Customers can upload photos, PDFs, and other files
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Share files with you
                </p>
              </div>
              <Switch
                checked={settings.uploadDocuments}
                disabled={!settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("uploadDocuments", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Message Your Team
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Built-in messaging to communicate with customers
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Built-in messaging
                </p>
              </div>
              <Switch
                checked={settings.messageTeam}
                disabled={!settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("messageTeam", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Portal Features */}
        <Card className={settings.enableCustomerPortal ? "" : "opacity-60"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4" />
              Portal Features
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Extra features to enhance customer experience</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Additional portal capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <Star className="h-3.5 w-3.5" />
                  Enable Reviews & Ratings
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Let customers leave reviews and ratings after service
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Collect customer feedback
                </p>
              </div>
              <Switch
                checked={settings.enableReviews}
                disabled={!settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("enableReviews", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <Users className="h-3.5 w-3.5" />
                  Enable Referral Program
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Customers can refer friends and track their referrals
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customer referrals
                </p>
              </div>
              <Switch
                checked={settings.enableReferrals}
                disabled={!settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("enableReferrals", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <Calendar className="h-3.5 w-3.5" />
                  Show Service History Timeline
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Visual timeline of all past services
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Visual service timeline
                </p>
              </div>
              <Switch
                checked={settings.showServiceHistory}
                disabled={!settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("showServiceHistory", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <Bell className="h-3.5 w-3.5" />
                  Show Maintenance Reminders
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Remind customers when service is due (like annual
                        maintenance)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Proactive service reminders
                </p>
              </div>
              <Switch
                checked={settings.showMaintenanceReminders}
                disabled={!settings.enableCustomerPortal}
                onCheckedChange={(checked) =>
                  updateSetting("showMaintenanceReminders", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card className={settings.enableCustomerPortal ? "" : "opacity-60"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" />
              Portal Branding
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Customize how the portal looks with your branding</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Customize the portal appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Portal Name
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        What customers see at the top of the portal
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  disabled={!settings.enableCustomerPortal}
                  onChange={(e) => updateSetting("portalName", e.target.value)}
                  placeholder="My Services Portal"
                  value={settings.portalName}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Brand Color
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Primary color used throughout the portal
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex gap-2">
                  <Input
                    className="w-24"
                    disabled={!settings.enableCustomerPortal}
                    onChange={(e) =>
                      updateSetting("brandingColor", e.target.value)
                    }
                    type="color"
                    value={settings.brandingColor}
                  />
                  <Input
                    disabled={!settings.enableCustomerPortal}
                    onChange={(e) =>
                      updateSetting("brandingColor", e.target.value)
                    }
                    value={settings.brandingColor}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Custom Domain (Optional)
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Use your own domain like portal.yourcompany.com instead of
                      stratos.com
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                disabled={!settings.enableCustomerPortal}
                onChange={(e) => updateSetting("customDomain", e.target.value)}
                placeholder="portal.yourcompany.com"
                value={settings.customDomain}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Welcome Message
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Message shown when customers log into the portal
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                className="min-h-[100px] resize-none"
                disabled={!settings.enableCustomerPortal}
                onChange={(e) =>
                  updateSetting("customWelcomeMessage", e.target.value)
                }
                placeholder="Welcome to your portal..."
                value={settings.customWelcomeMessage}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Reset to Defaults
          </Button>
          <Button disabled={isSubmitting} onClick={handleSave} type="button">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Portal Settings
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
