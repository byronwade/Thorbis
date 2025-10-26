"use client";

import {
  Bell,
  HelpCircle,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
import { usePageLayout } from "@/hooks/use-page-layout";
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NotificationSettings = {
  email: {
    marketing: boolean;
    updates: boolean;
    security: boolean;
    jobs: boolean;
    invoices: boolean;
    messages: boolean;
  };
  push: {
    newJobs: boolean;
    jobUpdates: boolean;
    messages: boolean;
    payments: boolean;
    teamActivity: boolean;
  };
  sms: {
    criticalAlerts: boolean;
    appointments: boolean;
    payments: boolean;
  };
  inApp: {
    allNotifications: boolean;
    sound: boolean;
    desktop: boolean;
  };
};

export default function NotificationsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      marketing: false,
      updates: true,
      security: true,
      jobs: true,
      invoices: true,
      messages: true,
    },
    push: {
      newJobs: true,
      jobUpdates: true,
      messages: true,
      payments: true,
      teamActivity: false,
    },
    sms: {
      criticalAlerts: true,
      appointments: true,
      payments: false,
    },
    inApp: {
      allNotifications: true,
      sound: true,
      desktop: true,
    },
  });

  const updateSetting = (
    category: keyof NotificationSettings,
    setting: string,
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Notifications</h1>
          <p className="mt-2 text-muted-foreground">
            Manage how and when you receive notifications
          </p>
        </div>

        <Separator />

        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4" />
              Email Notifications
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Control which emails you receive from Stratos
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Choose which email notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Job Notifications
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Receive emails when new jobs are assigned or updated
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  New job assignments and status changes
                </p>
              </div>
              <Switch
                checked={settings.email.jobs}
                onCheckedChange={(checked) =>
                  updateSetting("email", "jobs", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Invoice Alerts
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Get notified about invoice creations and payments
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Invoice sent, paid, and overdue notifications
                </p>
              </div>
              <Switch
                checked={settings.email.invoices}
                onCheckedChange={(checked) =>
                  updateSetting("email", "invoices", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Messages
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Email notifications for new messages and replies
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customer messages and team communications
                </p>
              </div>
              <Switch
                checked={settings.email.messages}
                onCheckedChange={(checked) =>
                  updateSetting("email", "messages", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Security Alerts
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Important security notifications (recommended)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Login attempts, password changes, and security warnings
                </p>
              </div>
              <Switch
                checked={settings.email.security}
                onCheckedChange={(checked) =>
                  updateSetting("email", "security", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Product Updates
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Learn about new features and improvements
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  New features, updates, and tips
                </p>
              </div>
              <Switch
                checked={settings.email.updates}
                onCheckedChange={(checked) =>
                  updateSetting("email", "updates", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Marketing Emails
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Promotional content and special offers
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Promotions, webinars, and industry insights
                </p>
              </div>
              <Switch
                checked={settings.email.marketing}
                onCheckedChange={(checked) =>
                  updateSetting("email", "marketing", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Smartphone className="h-4 w-4" />
              Push Notifications
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Real-time notifications on your mobile device
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Get instant alerts on your mobile device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">New Jobs</Label>
                <p className="text-muted-foreground text-xs">
                  When a new job is assigned to you
                </p>
              </div>
              <Switch
                checked={settings.push.newJobs}
                onCheckedChange={(checked) =>
                  updateSetting("push", "newJobs", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">Job Updates</Label>
                <p className="text-muted-foreground text-xs">
                  Status changes and customer updates
                </p>
              </div>
              <Switch
                checked={settings.push.jobUpdates}
                onCheckedChange={(checked) =>
                  updateSetting("push", "jobUpdates", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">Messages</Label>
                <p className="text-muted-foreground text-xs">
                  New messages from customers or team
                </p>
              </div>
              <Switch
                checked={settings.push.messages}
                onCheckedChange={(checked) =>
                  updateSetting("push", "messages", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">Payments</Label>
                <p className="text-muted-foreground text-xs">
                  Payment received and processing updates
                </p>
              </div>
              <Switch
                checked={settings.push.payments}
                onCheckedChange={(checked) =>
                  updateSetting("push", "payments", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">Team Activity</Label>
                <p className="text-muted-foreground text-xs">
                  When team members take actions
                </p>
              </div>
              <Switch
                checked={settings.push.teamActivity}
                onCheckedChange={(checked) =>
                  updateSetting("push", "teamActivity", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* SMS Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4" />
              SMS Notifications
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Text messages for critical updates</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Receive text messages for urgent notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Critical Alerts
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        System issues and urgent security alerts
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  System issues and security alerts (recommended)
                </p>
              </div>
              <Switch
                checked={settings.sms.criticalAlerts}
                onCheckedChange={(checked) =>
                  updateSetting("sms", "criticalAlerts", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">Appointments</Label>
                <p className="text-muted-foreground text-xs">
                  Appointment reminders and changes
                </p>
              </div>
              <Switch
                checked={settings.sms.appointments}
                onCheckedChange={(checked) =>
                  updateSetting("sms", "appointments", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">Payment Reminders</Label>
                <p className="text-muted-foreground text-xs">
                  Payment due and overdue reminders
                </p>
              </div>
              <Switch
                checked={settings.sms.payments}
                onCheckedChange={(checked) =>
                  updateSetting("sms", "payments", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* In-App Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              In-App Notifications
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Notifications while using the app</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Control notification behavior within the app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">All Notifications</Label>
                <p className="text-muted-foreground text-xs">
                  Show all in-app notifications
                </p>
              </div>
              <Switch
                checked={settings.inApp.allNotifications}
                onCheckedChange={(checked) =>
                  updateSetting("inApp", "allNotifications", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">Sound</Label>
                <p className="text-muted-foreground text-xs">
                  Play sound for new notifications
                </p>
              </div>
              <Switch
                checked={settings.inApp.sound}
                disabled={!settings.inApp.allNotifications}
                onCheckedChange={(checked) =>
                  updateSetting("inApp", "sound", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Desktop Notifications
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Show notifications even when app is in background
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  System notifications when app is minimized
                </p>
              </div>
              <Switch
                checked={settings.inApp.desktop}
                disabled={!settings.inApp.allNotifications}
                onCheckedChange={(checked) =>
                  updateSetting("inApp", "desktop", checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
