"use client";

/**
 * Overtime Settings Page - Client Component
 *
 * Configure overtime rules, rate multipliers, and approval workflows
 */

import {
  AlertTriangle,
  Calendar,
  Clock,
  DollarSign,
  Loader2,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import {
  getOvertimeSettings,
  updateOvertimeSettings,
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function OvertimeSettingsPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      const result = await getOvertimeSettings();
      if (result.success) {
        setSettings(result.data);
      }
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateOvertimeSettings(formData);
      if (result.success) {
        toast.success("Overtime settings updated successfully");
      } else {
        toast.error(result.error || "Failed to update settings");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-4xl tracking-tight">Overtime Settings</h1>
        <p className="text-muted-foreground">
          Configure overtime rules, multipliers, and approval workflows for
          field technicians
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                General Overtime Settings
              </CardTitle>
              <CardDescription>
                Enable overtime tracking and set basic thresholds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="overtimeEnabled">
                    Enable Overtime Tracking
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Track and calculate overtime pay for technicians
                  </p>
                </div>
                <Switch
                  defaultChecked={settings?.overtime_enabled ?? true}
                  id="overtimeEnabled"
                  name="overtimeEnabled"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyThresholdHours">
                    Daily Overtime Threshold (hours)
                  </Label>
                  <Input
                    defaultValue={settings?.daily_threshold_hours ?? 8}
                    id="dailyThresholdHours"
                    min="0"
                    name="dailyThresholdHours"
                    placeholder="8.00"
                    step="0.25"
                    type="number"
                  />
                  <p className="text-muted-foreground text-xs">
                    Hours worked in a day before overtime kicks in
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weeklyThresholdHours">
                    Weekly Overtime Threshold (hours)
                  </Label>
                  <Input
                    defaultValue={settings?.weekly_threshold_hours ?? 40}
                    id="weeklyThresholdHours"
                    min="0"
                    name="weeklyThresholdHours"
                    placeholder="40.00"
                    step="0.25"
                    type="number"
                  />
                  <p className="text-muted-foreground text-xs">
                    Hours worked in a week before overtime kicks in
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consecutiveDaysThreshold">
                  Consecutive Days Threshold
                </Label>
                <Input
                  defaultValue={settings?.consecutive_days_threshold ?? 7}
                  id="consecutiveDaysThreshold"
                  min="1"
                  name="consecutiveDaysThreshold"
                  placeholder="7"
                  type="number"
                />
                <p className="text-muted-foreground text-xs">
                  Number of consecutive days worked before triggering special
                  overtime
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rate Multipliers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Overtime Rate Multipliers
              </CardTitle>
              <CardDescription>
                Set pay rate multipliers for different types of overtime
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyOvertimeMultiplier">
                    Daily Overtime Multiplier
                  </Label>
                  <Input
                    defaultValue={settings?.daily_overtime_multiplier ?? 1.5}
                    id="dailyOvertimeMultiplier"
                    max="5"
                    min="1"
                    name="dailyOvertimeMultiplier"
                    placeholder="1.5"
                    step="0.1"
                    type="number"
                  />
                  <p className="text-muted-foreground text-xs">
                    Pay multiplier for daily overtime (e.g., 1.5 = time and a
                    half)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weeklyOvertimeMultiplier">
                    Weekly Overtime Multiplier
                  </Label>
                  <Input
                    defaultValue={settings?.weekly_overtime_multiplier ?? 1.5}
                    id="weeklyOvertimeMultiplier"
                    max="5"
                    min="1"
                    name="weeklyOvertimeMultiplier"
                    placeholder="1.5"
                    step="0.1"
                    type="number"
                  />
                  <p className="text-muted-foreground text-xs">
                    Pay multiplier for weekly overtime
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="doubleTimeEnabled">
                      Enable Double Time
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Pay double time after extended hours
                    </p>
                  </div>
                  <Switch
                    defaultChecked={settings?.double_time_enabled ?? false}
                    id="doubleTimeEnabled"
                    name="doubleTimeEnabled"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doubleTimeMultiplier">
                      Double Time Multiplier
                    </Label>
                    <Input
                      defaultValue={settings?.double_time_multiplier ?? 2.0}
                      id="doubleTimeMultiplier"
                      max="5"
                      min="1"
                      name="doubleTimeMultiplier"
                      placeholder="2.0"
                      step="0.1"
                      type="number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doubleTimeAfterHours">
                      Double Time After (hours)
                    </Label>
                    <Input
                      defaultValue={settings?.double_time_after_hours ?? 12}
                      id="doubleTimeAfterHours"
                      min="0"
                      name="doubleTimeAfterHours"
                      placeholder="12.00"
                      step="0.25"
                      type="number"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="doubleTimeOnSeventhDay">
                      Double Time on 7th Consecutive Day
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Pay double time for work on the 7th consecutive day
                    </p>
                  </div>
                  <Switch
                    defaultChecked={
                      settings?.double_time_on_seventh_day ?? false
                    }
                    id="doubleTimeOnSeventhDay"
                    name="doubleTimeOnSeventhDay"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekend & Holiday Rates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekend & Holiday Overtime
              </CardTitle>
              <CardDescription>
                Configure special rates for weekends and holidays
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekendOvertimeEnabled">
                    Enable Weekend Overtime Rates
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Apply different rates for weekend work
                  </p>
                </div>
                <Switch
                  defaultChecked={settings?.weekend_overtime_enabled ?? false}
                  id="weekendOvertimeEnabled"
                  name="weekendOvertimeEnabled"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="saturdayMultiplier">
                    Saturday Multiplier
                  </Label>
                  <Input
                    defaultValue={settings?.saturday_multiplier ?? 1.5}
                    id="saturdayMultiplier"
                    max="5"
                    min="1"
                    name="saturdayMultiplier"
                    placeholder="1.5"
                    step="0.1"
                    type="number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sundayMultiplier">Sunday Multiplier</Label>
                  <Input
                    defaultValue={settings?.sunday_multiplier ?? 2.0}
                    id="sundayMultiplier"
                    max="5"
                    min="1"
                    name="sundayMultiplier"
                    placeholder="2.0"
                    step="0.1"
                    type="number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="holidayMultiplier">Holiday Multiplier</Label>
                  <Input
                    defaultValue={settings?.holiday_multiplier ?? 2.5}
                    id="holidayMultiplier"
                    max="5"
                    min="1"
                    name="holidayMultiplier"
                    placeholder="2.5"
                    step="0.1"
                    type="number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval & Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Approval & Tracking Settings
              </CardTitle>
              <CardDescription>
                Configure approval workflows and tracking preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireOvertimeApproval">
                    Require Overtime Approval
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Managers must approve overtime before payment
                  </p>
                </div>
                <Switch
                  defaultChecked={settings?.require_overtime_approval ?? true}
                  id="requireOvertimeApproval"
                  name="requireOvertimeApproval"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoCalculateOvertime">
                    Auto-Calculate Overtime
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Automatically calculate overtime based on hours worked
                  </p>
                </div>
                <Switch
                  defaultChecked={settings?.auto_calculate_overtime ?? true}
                  id="autoCalculateOvertime"
                  name="autoCalculateOvertime"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trackByJob">Track Overtime by Job</Label>
                  <p className="text-muted-foreground text-sm">
                    Track overtime hours per job
                  </p>
                </div>
                <Switch
                  defaultChecked={settings?.track_by_job ?? true}
                  id="trackByJob"
                  name="trackByJob"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trackByDay">Track Overtime by Day</Label>
                  <p className="text-muted-foreground text-sm">
                    Track overtime hours per day
                  </p>
                </div>
                <Switch
                  defaultChecked={settings?.track_by_day ?? true}
                  id="trackByDay"
                  name="trackByDay"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyApproachingOvertime">
                    Notify Approaching Overtime
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Alert technicians when approaching overtime threshold
                  </p>
                </div>
                <Switch
                  defaultChecked={settings?.notify_approaching_overtime ?? true}
                  id="notifyApproachingOvertime"
                  name="notifyApproachingOvertime"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overtimeThresholdNotificationHours">
                  Notification Threshold (hours)
                </Label>
                <Input
                  defaultValue={
                    settings?.overtime_threshold_notification_hours ?? 7.5
                  }
                  id="overtimeThresholdNotificationHours"
                  min="0"
                  name="overtimeThresholdNotificationHours"
                  placeholder="7.5"
                  step="0.25"
                  type="number"
                />
                <p className="text-muted-foreground text-xs">
                  Send notification when technician reaches this many hours
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyManagersOnOvertime">
                    Notify Managers on Overtime
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Alert managers when technicians enter overtime
                  </p>
                </div>
                <Switch
                  defaultChecked={settings?.notify_managers_on_overtime ?? true}
                  id="notifyManagersOnOvertime"
                  name="notifyManagersOnOvertime"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Overtime Settings"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
