"use client";

/**
 * Settings > Communications > Notifications Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { Bell, HelpCircle, Save, Smartphone } from "lucide-react";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default function NotificationsSettingsPage() {  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    // Customer Notifications
    sendJobConfirmation: true,
    sendDayBeforeReminder: true,
    sendOnTheWayAlert: true,
    onTheWayMinutes: 30,
    sendJobCompletionSummary: true,
    sendPaymentReceipt: true,

    // Internal Notifications
    notifyNewLeads: true,
    notifyNewLeadsEmail: "sales@yourcompany.com",
    notifyNewLeadsSMS: true,
    notifyJobScheduled: true,
    notifyJobCompleted: true,
    notifyPaymentReceived: true,
    notifyNegativeReview: true,

    // Team Notifications
    notifyTechnicianAssignment: true,
    notifyTechnicianJobUpdate: true,
    notifyOfficeOnArrival: true,
    notifyOfficeOnCompletion: true,
  });

  const updateSetting = (key: string, value: string | boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Notification Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Control customer and team notification preferences
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Smartphone className="h-4 w-4" />
              Customer Notifications
            </CardTitle>
            <CardDescription>
              Automatic updates sent to customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Job Confirmation
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Confirm when job is scheduled
                  </p>
                </div>
                <Switch
                  checked={settings.sendJobConfirmation}
                  onCheckedChange={(checked) =>
                    updateSetting("sendJobConfirmation", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Day-Before Reminder
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Remind customer 24 hours before job
                  </p>
                </div>
                <Switch
                  checked={settings.sendDayBeforeReminder}
                  onCheckedChange={(checked) =>
                    updateSetting("sendDayBeforeReminder", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    "On The Way" Alert
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Alert customer when tech is heading to their location
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Notify when technician is on the way
                  </p>
                </div>
                <Switch
                  checked={settings.sendOnTheWayAlert}
                  onCheckedChange={(checked) =>
                    updateSetting("sendOnTheWayAlert", checked)
                  }
                />
              </div>

              {settings.sendOnTheWayAlert && (
                <div className="ml-6">
                  <Label className="text-sm">Send alert when tech is:</Label>
                  <Select
                    onValueChange={(value) =>
                      updateSetting(
                        "onTheWayMinutes",
                        Number.parseInt(value, 10)
                      )
                    }
                    value={settings.onTheWayMinutes.toString()}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes away</SelectItem>
                      <SelectItem value="30">30 minutes away</SelectItem>
                      <SelectItem value="45">45 minutes away</SelectItem>
                      <SelectItem value="60">60 minutes away</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Job Completion Summary
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Send summary when job is complete
                  </p>
                </div>
                <Switch
                  checked={settings.sendJobCompletionSummary}
                  onCheckedChange={(checked) =>
                    updateSetting("sendJobCompletionSummary", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Payment Receipt</Label>
                  <p className="text-muted-foreground text-xs">
                    Email receipt when payment received
                  </p>
                </div>
                <Switch
                  checked={settings.sendPaymentReceipt}
                  onCheckedChange={(checked) =>
                    updateSetting("sendPaymentReceipt", checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              Internal Notifications
            </CardTitle>
            <CardDescription>Alerts for your team and managers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">New Leads</Label>
                  <p className="text-muted-foreground text-xs">
                    Alert when new lead comes in
                  </p>
                </div>
                <Switch
                  checked={settings.notifyNewLeads}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyNewLeads", checked)
                  }
                />
              </div>

              {settings.notifyNewLeads && (
                <div className="ml-6 space-y-3">
                  <div>
                    <Label className="text-sm">Email alerts to:</Label>
                    <Input
                      className="mt-2"
                      onChange={(e) =>
                        updateSetting("notifyNewLeadsEmail", e.target.value)
                      }
                      placeholder="sales@yourcompany.com"
                      type="email"
                      value={settings.notifyNewLeadsEmail}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Also send SMS</Label>
                    <Switch
                      checked={settings.notifyNewLeadsSMS}
                      onCheckedChange={(checked) =>
                        updateSetting("notifyNewLeadsSMS", checked)
                      }
                    />
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Job Scheduled</Label>
                  <p className="text-muted-foreground text-xs">
                    Alert when new job is scheduled
                  </p>
                </div>
                <Switch
                  checked={settings.notifyJobScheduled}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyJobScheduled", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Job Completed</Label>
                  <p className="text-muted-foreground text-xs">
                    Alert when job is completed
                  </p>
                </div>
                <Switch
                  checked={settings.notifyJobCompleted}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyJobCompleted", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Payment Received
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Alert when payment is received
                  </p>
                </div>
                <Switch
                  checked={settings.notifyPaymentReceived}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyPaymentReceived", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Negative Review
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Immediately alert manager when negative review posted
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Urgent alert for bad reviews
                  </p>
                </div>
                <Switch
                  checked={settings.notifyNegativeReview}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyNegativeReview", checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technician Notifications</CardTitle>
            <CardDescription>Alerts sent to field technicians</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-sm">Job Assignment</Label>
                <p className="text-muted-foreground text-xs">
                  Notify tech when assigned to job
                </p>
              </div>
              <Switch
                checked={settings.notifyTechnicianAssignment}
                onCheckedChange={(checked) =>
                  updateSetting("notifyTechnicianAssignment", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-sm">Job Updates</Label>
                <p className="text-muted-foreground text-xs">
                  Notify tech of job changes
                </p>
              </div>
              <Switch
                checked={settings.notifyTechnicianJobUpdate}
                onCheckedChange={(checked) =>
                  updateSetting("notifyTechnicianJobUpdate", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-sm">Tech Arrival Alert</Label>
                <p className="text-muted-foreground text-xs">
                  Notify office when tech arrives
                </p>
              </div>
              <Switch
                checked={settings.notifyOfficeOnArrival}
                onCheckedChange={(checked) =>
                  updateSetting("notifyOfficeOnArrival", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-sm">Tech Completion Alert</Label>
                <p className="text-muted-foreground text-xs">
                  Notify office when tech completes
                </p>
              </div>
              <Switch
                checked={settings.notifyOfficeOnCompletion}
                onCheckedChange={(checked) =>
                  updateSetting("notifyOfficeOnCompletion", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Bell className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p className="font-medium text-blue-700 text-sm dark:text-blue-400">
                Notification Best Practices
              </p>
              <p className="text-muted-foreground text-sm">
                Balance keeping customers informed with avoiding notification
                fatigue. Test notifications before enabling. Consider quiet
                hours for non-urgent alerts. Use SMS for time-sensitive updates
                and email for detailed information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
