"use client";

/**
 * Settings > Schedule > Calendar Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { Calendar, HelpCircle, Loader2, Save } from "lucide-react";
import {
  getCalendarSettings,
  updateCalendarSettings,
} from "@/actions/settings";
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
import { useSettings } from "@/hooks/use-settings";
export default function CalendarSettingsPage() {
  const {
    settings,
    isLoading,
    isPending,
    hasUnsavedChanges,
    updateSetting,
    saveSettings,
  } = useSettings({
    getter: getCalendarSettings,
    setter: updateCalendarSettings,
    initialState: {
      timeZone: "America/New_York",
      firstDayOfWeek: "sunday",
      timeFormat: "12",
      dateFormat: "MM/DD/YYYY",
      businessHoursStart: "08:00",
      businessHoursEnd: "17:00",
      defaultAppointmentDuration: 60,
      timeSlotInterval: 15,
      showWeekends: true,
      showCanceledJobs: false,
      colorCodeByStatus: true,
      colorCodeByTechnician: false,
    },
    settingsName: "calendar",
    transformLoad: (data) => ({
      firstDayOfWeek: data.start_day_of_week === 0 ? "sunday" : "monday",
      timeSlotInterval: data.time_slot_duration_minutes ?? 30,
      showWeekends: true,
      colorCodeByStatus: data.show_job_status_colors ?? true,
      colorCodeByTechnician: data.show_technician_colors ?? true,
    }),
    transformSave: (settings) => {
      const formData = new FormData();
      formData.append("defaultView", "week");
      formData.append(
        "startDayOfWeek",
        settings.firstDayOfWeek === "sunday" ? "0" : "1"
      );
      formData.append(
        "timeSlotDurationMinutes",
        settings.timeSlotInterval.toString()
      );
      formData.append(
        "showTechnicianColors",
        settings.colorCodeByTechnician.toString()
      );
      formData.append(
        "showJobStatusColors",
        settings.colorCodeByStatus.toString()
      );
      formData.append("showTravelTime", "true");
      formData.append("showCustomerName", "true");
      formData.append("showJobType", "true");
      formData.append("syncWithGoogleCalendar", "false");
      formData.append("syncWithOutlook", "false");
      return formData;
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
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-4xl tracking-tight">
              Calendar Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure calendar view, business hours, and time zones
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button disabled={isPending} onClick={() => saveSettings()}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              General Settings
            </CardTitle>
            <CardDescription>
              Time zone, date formats, and regional preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                Time Zone
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      All appointments and schedules use this time zone
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Select
                onValueChange={(value) => updateSetting("timeZone", value)}
                value={settings.timeZone}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">
                    Eastern Time (ET)
                  </SelectItem>
                  <SelectItem value="America/Chicago">
                    Central Time (CT)
                  </SelectItem>
                  <SelectItem value="America/Denver">
                    Mountain Time (MT)
                  </SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    Pacific Time (PT)
                  </SelectItem>
                  <SelectItem value="America/Phoenix">Arizona (MST)</SelectItem>
                  <SelectItem value="America/Anchorage">
                    Alaska Time (AKT)
                  </SelectItem>
                  <SelectItem value="Pacific/Honolulu">
                    Hawaii Time (HST)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>First Day of Week</Label>
                <Select
                  onValueChange={(value) =>
                    updateSetting("firstDayOfWeek", value)
                  }
                  value={settings.firstDayOfWeek}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Sunday</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Time Format</Label>
                <Select
                  onValueChange={(value) => updateSetting("timeFormat", value)}
                  value={settings.timeFormat}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12-hour (1:00 PM)</SelectItem>
                    <SelectItem value="24">24-hour (13:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div>
              <Label>Date Format</Label>
              <Select
                onValueChange={(value) => updateSetting("dateFormat", value)}
                value={settings.dateFormat}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">
                    MM/DD/YYYY (12/31/2024)
                  </SelectItem>
                  <SelectItem value="DD/MM/YYYY">
                    DD/MM/YYYY (31/12/2024)
                  </SelectItem>
                  <SelectItem value="YYYY-MM-DD">
                    YYYY-MM-DD (2024-12-31)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
            <CardDescription>
              Default operating hours for scheduling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Start Time</Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting("businessHoursStart", e.target.value)
                  }
                  type="time"
                  value={settings.businessHoursStart}
                />
              </div>

              <div>
                <Label>End Time</Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting("businessHoursEnd", e.target.value)
                  }
                  type="time"
                  value={settings.businessHoursEnd}
                />
              </div>
            </div>

            <p className="text-muted-foreground text-xs">
              These are default hours - individual technicians can have
              different schedules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Defaults</CardTitle>
            <CardDescription>
              Default duration and time slot settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Default Duration (minutes)</Label>
                <Select
                  onValueChange={(value) =>
                    updateSetting(
                      "defaultAppointmentDuration",
                      Number.parseInt(value, 10)
                    )
                  }
                  value={settings.defaultAppointmentDuration.toString()}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Time Slot Interval</Label>
                <Select
                  onValueChange={(value) =>
                    updateSetting(
                      "timeSlotInterval",
                      Number.parseInt(value, 10)
                    )
                  }
                  value={settings.timeSlotInterval.toString()}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-1 text-muted-foreground text-xs">
                  Spacing between available appointment times
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display Options</CardTitle>
            <CardDescription>Customize calendar appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label>Show Weekends</Label>
                <p className="text-muted-foreground text-xs">
                  Display Saturday and Sunday on calendar
                </p>
              </div>
              <Switch
                checked={settings.showWeekends}
                onCheckedChange={(checked) =>
                  updateSetting("showWeekends", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label>Show Canceled Jobs</Label>
                <p className="text-muted-foreground text-xs">
                  Display canceled appointments on calendar
                </p>
              </div>
              <Switch
                checked={settings.showCanceledJobs}
                onCheckedChange={(checked) =>
                  updateSetting("showCanceledJobs", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label>Color Code by Status</Label>
                <p className="text-muted-foreground text-xs">
                  Use colors to indicate job status
                </p>
              </div>
              <Switch
                checked={settings.colorCodeByStatus}
                onCheckedChange={(checked) =>
                  updateSetting("colorCodeByStatus", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label>Color Code by Technician</Label>
                <p className="text-muted-foreground text-xs">
                  Assign unique colors to each technician
                </p>
              </div>
              <Switch
                checked={settings.colorCodeByTechnician}
                onCheckedChange={(checked) =>
                  updateSetting("colorCodeByTechnician", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p className="font-medium text-blue-700 text-sm dark:text-blue-400">
                Calendar Best Practices
              </p>
              <p className="text-muted-foreground text-sm">
                Set realistic appointment durations to avoid overbooking. Use
                color coding to quickly identify job types or technicians. Keep
                business hours updated to reflect seasonal changes. Consider
                blocking lunch hours or common break times.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
