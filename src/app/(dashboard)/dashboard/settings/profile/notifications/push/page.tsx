"use client";

/**
 * Settings > Profile > Notifications > Push Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  ArrowLeft,
  Bell,
  Clock,
  MapPin,
  Monitor,
  Settings,
  Smartphone,
  Tablet,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
export default function PushNotificationsPage() {
  // Call layout config after mount to avoid SSR issues
  useEffect(() => {
    // Config is set through usePageLayout's useEffect
  }, []);  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/settings/profile/notifications">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Push Notifications
          </h1>
          <p className="text-muted-foreground">
            Manage push notifications on your devices
          </p>
        </div>
      </div>

      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Connected Devices
          </CardTitle>
          <CardDescription>
            Manage push notifications for each of your devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">iPhone 13</div>
                  <div className="text-muted-foreground text-sm">
                    Stratos Mobile App
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Last active 2 hours ago
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <span className="text-sm">Enabled</span>
                </div>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <Monitor className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">MacBook Pro</div>
                  <div className="text-muted-foreground text-sm">
                    Chrome Browser
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Last active now
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <span className="text-sm">Enabled</span>
                </div>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <Tablet className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">iPad Pro</div>
                  <div className="text-muted-foreground text-sm">
                    Safari Browser
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Last active 1 day ago
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch />
                  <span className="text-sm">Disabled</span>
                </div>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Push Notifications</div>
              <div className="text-muted-foreground text-sm">
                Allow this website to send push notifications
              </div>
            </div>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Browser Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Types
          </CardTitle>
          <CardDescription>
            Choose which types of notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <Volume2 className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <div className="font-medium">Critical Alerts</div>
                  <div className="text-muted-foreground text-sm">
                    Security issues and emergency notifications
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Badge variant="destructive">Always</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Job Updates</div>
                  <div className="text-muted-foreground text-sm">
                    New assignments, changes, and reminders
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Badge variant="secondary">High</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <Volume2 className="h-4 w-4 text-green-600" />
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
                <Badge variant="secondary">High</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium">Schedule Reminders</div>
                  <div className="text-muted-foreground text-sm">
                    Upcoming appointments and deadlines
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Badge variant="outline">Normal</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <VolumeX className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">System Updates</div>
                  <div className="text-muted-foreground text-sm">
                    Maintenance and feature updates
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch />
                <Badge variant="outline">Low</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sound & Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Sound & Appearance</CardTitle>
          <CardDescription>
            Customize the look and sound of push notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Notification Sounds</div>
              <div className="text-muted-foreground text-sm">
                Play sounds when notifications arrive
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Show Previews</div>
              <div className="text-muted-foreground text-sm">
                Show notification content on lock screen
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Badge App Icon</div>
              <div className="text-muted-foreground text-sm">
                Show unread count on app icons
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Group Notifications</div>
              <div className="text-muted-foreground text-sm">
                Group similar notifications together
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Auto-Hide</div>
              <div className="text-muted-foreground text-sm">
                Automatically dismiss notifications after 5 seconds
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quiet Hours
          </CardTitle>
          <CardDescription>
            Set times when push notifications are muted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Enable Quiet Hours</div>
              <div className="text-muted-foreground text-sm">
                Mute push notifications during specified hours
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="font-medium text-sm">Start Time</label>
              <div className="flex items-center gap-2">
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="22:00"
                  type="time"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium text-sm">End Time</label>
              <div className="flex items-center gap-2">
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="08:00"
                  type="time"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-medium text-sm">Allow Critical Alerts</label>
            <div className="mb-2 text-muted-foreground text-sm">
              Security and emergency notifications will still be delivered
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Test Notification */}
      <Card>
        <CardHeader>
          <CardTitle>Test Notifications</CardTitle>
          <CardDescription>
            Send a test notification to verify your settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button>
              <Bell className="mr-2 h-4 w-4" />
              Send Test Notification
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
