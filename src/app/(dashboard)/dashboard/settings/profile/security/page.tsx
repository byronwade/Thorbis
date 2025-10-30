/**
 * Settings > Profile > Security Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const revalidate = 3600; // Revalidate every 1 hour

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
      <div className="space-y-8 py-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-4xl tracking-tight">Security</h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex items-center justify-center rounded-full hover:bg-muted"
                  type="button"
                >
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="font-semibold">Account Security</p>
                <p className="mt-2 text-sm">
                  Keep your account secure with strong passwords, two-factor
                  authentication, and monitoring of login activity.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage how you sign in and keep your account secure
          </p>
        </div>

        {/* Authentication Section */}
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
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Control how you sign in to your account and add extra layers
                    of security.
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
                        <p className="font-semibold text-sm">{feature.title}</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
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
                      <Badge className="bg-green-600" variant="default">
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

        {/* Trusted Devices & Login Activity */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Trusted Devices */}
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
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
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
                          <p className="font-semibold text-sm">{device.name}</p>
                          {device.current && (
                            <Badge className="bg-green-600" variant="default">
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

          {/* Login Activity */}
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
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
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
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}
                  >
                    {activity.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{activity.device}</p>
                      <Badge
                        variant={
                          activity.status === "success"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {activity.status === "success" ? "Success" : "Failed"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {activity.location}
                    </p>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span>{activity.ip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold text-xl">Advanced</h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex items-center justify-center"
                    type="button"
                  >
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Additional security and account management options.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-muted-foreground text-sm">
              Additional security and account options
            </p>
          </div>

          <div className="space-y-4">
            {/* Sign Out All Sessions */}
            <div className="flex items-center justify-between gap-6 rounded-lg border bg-card p-4 transition-all hover:border-primary/50">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <LogOut className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">Sign Out Everywhere</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          Sign out from all devices except this one. Use if you
                          suspect unauthorized access.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    End all other active sessions
                  </p>
                </div>
              </div>
              <Button size="sm" type="button" variant="outline">
                Sign Out All
              </Button>
            </div>

            {/* Download Backup Codes */}
            <div className="flex items-center justify-between gap-6 rounded-lg border bg-card p-4 transition-all hover:border-primary/50">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Download className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">Backup Codes</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          Download one-time backup codes to access your account
                          if you lose your 2FA device.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Download codes for emergency access
                  </p>
                </div>
              </div>
              <Button size="sm" type="button" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>

            {/* Account Recovery */}
            <div className="flex items-center justify-between gap-6 rounded-lg border bg-card p-4 transition-all hover:border-primary/50">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">Account Recovery</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          Set up recovery options to regain access if you forget
                          your password.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Configure recovery email and phone
                  </p>
                </div>
              </div>
              <Button size="sm" type="button" variant="outline">
                Configure
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-8 shadow-sm dark:border-red-900/50 dark:bg-red-950/20">
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-red-600 dark:text-red-500" />
              <h2 className="font-semibold text-red-900 text-xl dark:text-red-100">
                Danger Zone
              </h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex items-center justify-center"
                    type="button"
                  >
                    <HelpCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Permanent account deletion. This action cannot be undone and
                    all your data will be lost forever.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-red-800 text-sm dark:text-red-200">
              Irreversible and destructive actions
            </p>
          </div>

          <div className="flex items-center justify-between gap-6 rounded-lg border-2 border-red-300 bg-card p-4 dark:border-red-800">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-100 dark:bg-red-900/30">
                <UserX className="h-5 w-5 text-red-600 dark:text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">Delete Account</p>
                <p className="text-muted-foreground text-xs">
                  Permanently delete your account and all data
                </p>
              </div>
            </div>
            <Button size="sm" type="button" variant="destructive">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
