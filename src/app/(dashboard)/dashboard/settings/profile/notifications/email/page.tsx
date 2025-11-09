/**
 * Settings > Profile > Notifications > Email Page
 *
 * Sub-page of notifications - uses same data
 */

import {
  Archive,
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/actions/settings";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/use-settings";

export default function EmailPreferencesPage() {
  const {
    settings,
    isLoading,
    isPending,
    hasUnsavedChanges,
    updateSetting,
    saveSettings,
  } = useSettings({
    getter: getNotificationPreferences,
    setter: updateNotificationPreferences,
    initialState: {
      emailNewJobs: true,
      emailJobUpdates: true,
      emailMentions: true,
      emailMessages: true,
    },
    settingsName: "email notifications",
    transformLoad: (data) => ({
      emailNewJobs: data.email_new_jobs ?? true,
      emailJobUpdates: data.email_job_updates ?? true,
      emailMentions: data.email_mentions ?? true,
      emailMessages: data.email_messages ?? true,
    }),
    transformSave: (s) => {
      const fd = new FormData();
      fd.append("emailNewJobs", s.emailNewJobs.toString());
      fd.append("emailJobUpdates", s.emailJobUpdates.toString());
      fd.append("emailMentions", s.emailMentions.toString());
      fd.append("emailMessages", s.emailMessages.toString());
      fd.append("pushNewJobs", "true");
      fd.append("pushJobUpdates", "true");
      fd.append("pushMentions", "true");
      fd.append("pushMessages", "true");
      fd.append("smsUrgentJobs", "false");
      fd.append("smsScheduleChanges", "false");
      fd.append("inAppAll", "true");
      fd.append("digestEnabled", "false");
      fd.append("digestFrequency", "daily");
      return fd;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/settings/profile/notifications">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-bold text-4xl tracking-tight">
            Email Preferences
          </h1>
          <p className="text-muted-foreground">
            Control how and when you receive email notifications
          </p>
        </div>
      </div>

      {/* Email Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-sm">Total Emails</span>
            </div>
            <div className="font-bold text-2xl">247</div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Archive className="h-4 w-4 text-green-500" />
              <span className="font-medium text-sm">Read Rate</span>
            </div>
            <div className="font-bold text-2xl">68%</div>
            <p className="text-muted-foreground text-xs">Average open rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-sm">Unsubscribe Rate</span>
            </div>
            <div className="font-bold text-2xl">2.1%</div>
            <p className="text-muted-foreground text-xs">Below industry avg</p>
          </CardContent>
        </Card>
      </div>

      {/* Email Delivery Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Email Delivery
          </CardTitle>
          <CardDescription>
            Configure how emails are delivered to your inbox
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Email Notifications</div>
              <div className="text-muted-foreground text-sm">
                Receive email notifications for important updates
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-2">
            <label className="font-medium text-sm">Email Frequency</label>
            <Select defaultValue="immediate">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Smart Filtering</div>
              <div className="text-muted-foreground text-sm">
                Automatically filter and prioritize important emails
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Auto-Archive</div>
              <div className="text-muted-foreground text-sm">
                Automatically archive read notification emails after 30 days
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Email Types */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Job & Schedule Emails
            </CardTitle>
            <CardDescription>
              Emails related to job assignments, scheduling, and work updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">New Job Assignments</div>
                    <div className="text-muted-foreground text-sm">
                      When jobs are assigned to you
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Badge variant="secondary">High Priority</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Schedule Changes</div>
                    <div className="text-muted-foreground text-sm">
                      When job times or dates change
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Badge variant="secondary">High Priority</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Job Updates</div>
                    <div className="text-muted-foreground text-sm">
                      Status changes and completion notices
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Badge variant="outline">Normal</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Customer Communication
            </CardTitle>
            <CardDescription>
              Emails from customers and client interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Customer Messages</div>
                    <div className="text-muted-foreground text-sm">
                      Direct messages from customers
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Badge variant="secondary">High Priority</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                    <CreditCard className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium">Payment Notifications</div>
                    <div className="text-muted-foreground text-sm">
                      Payment status and reminders
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Badge variant="outline">Normal</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Security & System
            </CardTitle>
            <CardDescription>
              Security alerts and important system notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium">Security Alerts</div>
                    <div className="text-muted-foreground text-sm">
                      Login attempts and security events
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Badge variant="destructive">Critical</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                    <Mail className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">Account Changes</div>
                    <div className="text-muted-foreground text-sm">
                      Password changes and account updates
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Badge variant="secondary">High Priority</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Management */}
      <Card>
        <CardHeader>
          <CardTitle>Email Management</CardTitle>
          <CardDescription>
            Manage your email subscriptions and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Marketing Emails</div>
              <div className="text-muted-foreground text-sm">
                Product updates, tips, and promotional content
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Weekly Reports</div>
              <div className="text-muted-foreground text-sm">
                Weekly summary of your account activity
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Tips & Tutorials</div>
              <div className="text-muted-foreground text-sm">
                Helpful guides and best practices
              </div>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="font-medium text-sm">Email Format</label>
            <Select defaultValue="html">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="html">Rich HTML</SelectItem>
                <SelectItem value="text">Plain Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Unsubscribe from All</div>
              <div className="text-muted-foreground text-sm">
                Stop receiving all marketing and promotional emails
              </div>
            </div>
            <Button size="sm" variant="destructive">
              <Trash2 className="mr-2 size-4" />
              Unsubscribe All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Email Template Preview</CardTitle>
          <CardDescription>
            See how your emails will look in your inbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border bg-gray-50 p-4 dark:bg-gray-900/50">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-medium text-white text-xs">
                  S
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-medium text-sm">Thorbis</span>
                    <Badge className="text-xs" variant="secondary">
                      Job Update
                    </Badge>
                  </div>
                  <div className="mb-1 font-medium text-sm">
                    New job assigned: Kitchen Repair
                  </div>
                  <div className="mb-2 text-muted-foreground text-xs">
                    A new job has been assigned to you. Please review the
                    details and confirm your availability.
                  </div>
                  <div className="text-muted-foreground text-xs">
                    2 minutes ago • noreply@stratos.com
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button size="sm" variant="outline">
                View Sample Email
              </Button>
              <Button size="sm" variant="outline">
                Test Email Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
