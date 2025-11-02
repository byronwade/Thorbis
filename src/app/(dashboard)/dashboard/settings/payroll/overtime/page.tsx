"use client";

/**
 * Overtime Settings Page - Client Component
 *
 * Configure overtime rules, rate multipliers, and approval workflows
 */

import { Clock, AlertTriangle, DollarSign, Calendar, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getOvertimeSettings, updateOvertimeSettings } from "@/actions/settings";

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
        <h1 className="text-4xl font-bold tracking-tight">Overtime Settings</h1>
        <p className="text-muted-foreground">
          Configure overtime rules, multipliers, and approval workflows for field technicians
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
                  <Label htmlFor="overtimeEnabled">Enable Overtime Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Track and calculate overtime pay for technicians
                  </p>
                </div>
                <Switch
                  id="overtimeEnabled"
                  name="overtimeEnabled"
                  defaultChecked={settings?.overtime_enabled ?? true}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyThresholdHours">Daily Overtime Threshold (hours)</Label>
                  <Input
                    id="dailyThresholdHours"
                    name="dailyThresholdHours"
                    type="number"
                    step="0.25"
                    min="0"
                    defaultValue={settings?.daily_threshold_hours ?? 8}
                    placeholder="8.00"
                  />
                  <p className="text-xs text-muted-foreground">
                    Hours worked in a day before overtime kicks in
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weeklyThresholdHours">Weekly Overtime Threshold (hours)</Label>
                  <Input
                    id="weeklyThresholdHours"
                    name="weeklyThresholdHours"
                    type="number"
                    step="0.25"
                    min="0"
                    defaultValue={settings?.weekly_threshold_hours ?? 40}
                    placeholder="40.00"
                  />
                  <p className="text-xs text-muted-foreground">
                    Hours worked in a week before overtime kicks in
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consecutiveDaysThreshold">Consecutive Days Threshold</Label>
                <Input
                  id="consecutiveDaysThreshold"
                  name="consecutiveDaysThreshold"
                  type="number"
                  min="1"
                  defaultValue={settings?.consecutive_days_threshold ?? 7}
                  placeholder="7"
                />
                <p className="text-xs text-muted-foreground">
                  Number of consecutive days worked before triggering special overtime
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
                  <Label htmlFor="dailyOvertimeMultiplier">Daily Overtime Multiplier</Label>
                  <Input
                    id="dailyOvertimeMultiplier"
                    name="dailyOvertimeMultiplier"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    defaultValue={settings?.daily_overtime_multiplier ?? 1.5}
                    placeholder="1.5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Pay multiplier for daily overtime (e.g., 1.5 = time and a half)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weeklyOvertimeMultiplier">Weekly Overtime Multiplier</Label>
                  <Input
                    id="weeklyOvertimeMultiplier"
                    name="weeklyOvertimeMultiplier"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    defaultValue={settings?.weekly_overtime_multiplier ?? 1.5}
                    placeholder="1.5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Pay multiplier for weekly overtime
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="doubleTimeEnabled">Enable Double Time</Label>
                    <p className="text-sm text-muted-foreground">
                      Pay double time after extended hours
                    </p>
                  </div>
                  <Switch
                    id="doubleTimeEnabled"
                    name="doubleTimeEnabled"
                    defaultChecked={settings?.double_time_enabled ?? false}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doubleTimeMultiplier">Double Time Multiplier</Label>
                    <Input
                      id="doubleTimeMultiplier"
                      name="doubleTimeMultiplier"
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      defaultValue={settings?.double_time_multiplier ?? 2.0}
                      placeholder="2.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doubleTimeAfterHours">Double Time After (hours)</Label>
                    <Input
                      id="doubleTimeAfterHours"
                      name="doubleTimeAfterHours"
                      type="number"
                      step="0.25"
                      min="0"
                      defaultValue={settings?.double_time_after_hours ?? 12}
                      placeholder="12.00"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="doubleTimeOnSeventhDay">Double Time on 7th Consecutive Day</Label>
                    <p className="text-sm text-muted-foreground">
                      Pay double time for work on the 7th consecutive day
                    </p>
                  </div>
                  <Switch
                    id="doubleTimeOnSeventhDay"
                    name="doubleTimeOnSeventhDay"
                    defaultChecked={settings?.double_time_on_seventh_day ?? false}
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
                  <Label htmlFor="weekendOvertimeEnabled">Enable Weekend Overtime Rates</Label>
                  <p className="text-sm text-muted-foreground">
                    Apply different rates for weekend work
                  </p>
                </div>
                <Switch
                  id="weekendOvertimeEnabled"
                  name="weekendOvertimeEnabled"
                  defaultChecked={settings?.weekend_overtime_enabled ?? false}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="saturdayMultiplier">Saturday Multiplier</Label>
                  <Input
                    id="saturdayMultiplier"
                    name="saturdayMultiplier"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    defaultValue={settings?.saturday_multiplier ?? 1.5}
                    placeholder="1.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sundayMultiplier">Sunday Multiplier</Label>
                  <Input
                    id="sundayMultiplier"
                    name="sundayMultiplier"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    defaultValue={settings?.sunday_multiplier ?? 2.0}
                    placeholder="2.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="holidayMultiplier">Holiday Multiplier</Label>
                  <Input
                    id="holidayMultiplier"
                    name="holidayMultiplier"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    defaultValue={settings?.holiday_multiplier ?? 2.5}
                    placeholder="2.5"
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
                  <Label htmlFor="requireOvertimeApproval">Require Overtime Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Managers must approve overtime before payment
                  </p>
                </div>
                <Switch
                  id="requireOvertimeApproval"
                  name="requireOvertimeApproval"
                  defaultChecked={settings?.require_overtime_approval ?? true}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoCalculateOvertime">Auto-Calculate Overtime</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically calculate overtime based on hours worked
                  </p>
                </div>
                <Switch
                  id="autoCalculateOvertime"
                  name="autoCalculateOvertime"
                  defaultChecked={settings?.auto_calculate_overtime ?? true}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trackByJob">Track Overtime by Job</Label>
                  <p className="text-sm text-muted-foreground">
                    Track overtime hours per job
                  </p>
                </div>
                <Switch
                  id="trackByJob"
                  name="trackByJob"
                  defaultChecked={settings?.track_by_job ?? true}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trackByDay">Track Overtime by Day</Label>
                  <p className="text-sm text-muted-foreground">
                    Track overtime hours per day
                  </p>
                </div>
                <Switch
                  id="trackByDay"
                  name="trackByDay"
                  defaultChecked={settings?.track_by_day ?? true}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyApproachingOvertime">Notify Approaching Overtime</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert technicians when approaching overtime threshold
                  </p>
                </div>
                <Switch
                  id="notifyApproachingOvertime"
                  name="notifyApproachingOvertime"
                  defaultChecked={settings?.notify_approaching_overtime ?? true}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overtimeThresholdNotificationHours">Notification Threshold (hours)</Label>
                <Input
                  id="overtimeThresholdNotificationHours"
                  name="overtimeThresholdNotificationHours"
                  type="number"
                  step="0.25"
                  min="0"
                  defaultValue={settings?.overtime_threshold_notification_hours ?? 7.5}
                  placeholder="7.5"
                />
                <p className="text-xs text-muted-foreground">
                  Send notification when technician reaches this many hours
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyManagersOnOvertime">Notify Managers on Overtime</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert managers when technicians enter overtime
                  </p>
                </div>
                <Switch
                  id="notifyManagersOnOvertime"
                  name="notifyManagersOnOvertime"
                  defaultChecked={settings?.notify_managers_on_overtime ?? true}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={isPending}>
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
