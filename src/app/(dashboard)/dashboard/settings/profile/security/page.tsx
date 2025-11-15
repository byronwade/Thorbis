"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Globe,
  HelpCircle,
  Key,
  LogOut,
  Mail,
  Monitor,
  Shield,
  Smartphone,
  Trash2,
  User,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SecurityFeature = {
  title: string;
  description: string;
  status: "enabled" | "disabled";
  icon: typeof Key;
  href?: string;
  actionText?: string;
  tooltip: string;
};

const securityFeatures: SecurityFeature[] = [
  {
    title: "Password",
    description: "Last changed 3 months ago",
    status: "enabled",
    icon: Key,
    href: "/dashboard/settings/profile/security/password",
    actionText: "Change",
    tooltip: "Use a strong, unique password with at least 12 characters",
  },
  {
    title: "Two-Factor Authentication",
    description: "Protect your account with 2FA",
    status: "disabled",
    icon: Smartphone,
    href: "/dashboard/settings/profile/security/2fa",
    actionText: "Enable",
    tooltip:
      "Add an extra layer of security by requiring a code from your phone",
  },
  {
    title: "Email Verification",
    description: "john@example.com is verified",
    status: "enabled",
    icon: Mail,
    tooltip: "Your email is verified and can be used for account recovery",
  },
  {
    title: "Recovery Email",
    description: "Add a backup email for account recovery",
    status: "disabled",
    icon: Mail,
    actionText: "Add Email",
    tooltip: "Backup email helps you recover access if needed",
  },
];

type LoginActivity = {
  id: string;
  device: string;
  location: string;
  time: string;
  ip: string;
  status: "success" | "failed";
};

const recentActivity: LoginActivity[] = [
  {
    id: "1",
    device: "Chrome on MacOS",
    location: "San Francisco, CA",
    time: "2 hours ago",
    ip: "192.168.1.1",
    status: "success",
  },
  {
    id: "2",
    device: "iPhone 14 Pro",
    location: "San Francisco, CA",
    time: "Yesterday at 3:42 PM",
    ip: "192.168.1.100",
    status: "success",
  },
  {
    id: "3",
    device: "Chrome on Windows",
    location: "Unknown location",
    time: "3 days ago",
    ip: "203.0.113.0",
    status: "failed",
  },
  {
    id: "4",
    device: "Safari on iPad",
    location: "Oakland, CA",
    time: "1 week ago",
    ip: "192.168.1.50",
    status: "success",
  },
];

type TrustedDevice = {
  id: string;
  name: string;
  type: "desktop" | "mobile" | "tablet";
  lastActive: string;
  current: boolean;
};

const trustedDevices: TrustedDevice[] = [
  {
    id: "1",
    name: "MacBook Pro - Chrome",
    type: "desktop",
    lastActive: "Active now",
    current: true,
  },
  {
    id: "2",
    name: "iPhone 14 Pro",
    type: "mobile",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: "3",
    name: "iPad Air - Safari",
    type: "tablet",
    lastActive: "1 week ago",
    current: false,
  },
];

function getDeviceIcon(type: string) {
  switch (type) {
    case "mobile":
      return Smartphone;
    case "tablet":
      return Monitor;
    default:
      return Monitor;
  }
}

export default function SecurityPage() {
  return (
    <TooltipProvider>
      <SettingsPageLayout
        description="Manage how you sign in and keep your account secure."
        helpText="Keep your account protected with strong passwords, MFA, and regular reviews of login activity."
        saveButtonText="Save security settings"
        title="Security"
      >
        <div className="space-y-8">
          <div className="rounded-xl border bg-card p-8 shadow-sm">
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-xl">Authentication</h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="flex items-center justify-center"
                      type="button"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Control how you sign in to your account and add extra
                      layers of security.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-muted-foreground text-sm">
                Control how you sign in to your account
              </p>
            </div>

            <div className="space-y-4">
              {securityFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    className="flex items-center justify-between gap-6 rounded-lg border bg-card p-4 transition-all hover:border-primary/50"
                    key={feature.title}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">
                            {feature.title}
                          </p>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button">
                                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-sm">{feature.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {feature.status === "enabled" ? (
                        <Badge className="bg-success" variant="default">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Not Enabled</Badge>
                      )}
                      {feature.actionText && (
                        <Button asChild size="sm" variant="outline">
                          <Link href={feature.href || "#"}>
                            {feature.actionText}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-semibold text-xl">Trusted Devices</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="flex items-center justify-center"
                        type="button"
                      >
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        Devices where you're currently signed in. Remove any
                        devices you don't recognize.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-muted-foreground text-sm">
                  Devices where you're currently signed in
                </p>
              </div>

              <div className="space-y-3">
                {trustedDevices.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.type);
                  return (
                    <div
                      className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4 transition-all hover:border-primary/50"
                      key={device.id}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <DeviceIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">
                              {device.name}
                            </p>
                            {device.current && (
                              <Badge className="bg-success" variant="default">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            {device.lastActive}
                          </p>
                        </div>
                      </div>
                      {!device.current && (
                        <Button size="sm" type="button" variant="ghost">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-semibold text-xl">Recent Activity</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="flex items-center justify-center"
                        type="button"
                      >
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        Recent sign-in attempts on your account. Check for any
                        suspicious activity.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-muted-foreground text-sm">
                  Recent sign-in attempts on your account
                </p>
              </div>

              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-all hover:border-primary/50"
                    key={activity.id}
                  >
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                        activity.status === "success"
                          ? "bg-success dark:bg-success/30"
                          : "bg-destructive dark:bg-destructive/30"
                      }`}
                    >
                      {activity.status === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-success dark:text-success" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive dark:text-destructive" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">
                            {activity.device}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {activity.location}
                          </p>
                        </div>
                        <Badge variant="outline">{activity.ip}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                    <Button size="sm" type="button" variant="ghost">
                      <LogOut className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-8 shadow-sm">
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-xl">Account Recovery</h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="flex items-center justify-center"
                      type="button"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Add recovery options to regain access if you forget your
                      password.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-muted-foreground text-sm">
                Add recovery options to help regain access
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-sm">Recovery Email</p>
                </div>
                <p className="text-muted-foreground text-sm">
                  Add a backup email to recover your account.
                </p>
                <Button className="mt-4" size="sm" variant="outline">
                  Add Email
                </Button>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-sm">Backup Codes</p>
                </div>
                <p className="text-muted-foreground text-sm">
                  Save single-use backup codes in case you lose access to your
                  authenticator.
                </p>
                <Button className="mt-4" size="sm" variant="outline">
                  Download Codes
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-8 shadow-sm">
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-xl">Session Controls</h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="flex items-center justify-center"
                      type="button"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Sign out of other active sessions and protect your
                      account.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-muted-foreground text-sm">
                Manage where you're currently signed in
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out of All Sessions
              </Button>
              <Button type="button" variant="ghost">
                <Clock className="mr-2 h-4 w-4" />
                View Session History
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-8 shadow-sm">
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-xl">API Access</h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="flex items-center justify-center"
                      type="button"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Manage API keys used to integrate Thorbis with other
                      systems.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-muted-foreground text-sm">
                Manage keys used for third-party integrations
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">
                      Thorbis Production Key
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Created Sep 10, 2024 • Last used 2 hours ago
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" type="button" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" type="button" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">Sandbox Key</p>
                    <p className="text-muted-foreground text-xs">
                      Created Aug 22, 2024 • Last used 5 days ago
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" type="button" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" type="button" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button type="button">
                <Key className="mr-2 h-4 w-4" />
                Generate New API Key
              </Button>
            </div>
          </div>
        </div>
      </SettingsPageLayout>
    </TooltipProvider>
  );
}
