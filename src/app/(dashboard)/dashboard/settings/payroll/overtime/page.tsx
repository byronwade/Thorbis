"use client";

/**
 * Settings > Payroll > Overtime Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { Clock, Save } from "lucide-react";
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
import { TooltipProvider } from "@/components/ui/tooltip";
type OvertimeSettings = {
  overtimeCalculationMethod: "daily" | "weekly" | "both";
  dailyOvertimeThreshold: number;
  weeklyOvertimeThreshold: number;
  overtimeRate: number;
  doubleTimeEnabled: boolean;
  doubleTimeThreshold: number;
  doubleTimeRate: number;
  weekendPremium: boolean;
  weekendPremiumRate: number;
  holidayPremium: boolean;
  holidayPremiumRate: number;
  onCallPay: boolean;
  onCallPayRate: number;
};

export default function OvertimeSettingsPage() {  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [settings, setSettings] = useState<OvertimeSettings>({
    overtimeCalculationMethod: "weekly",
    dailyOvertimeThreshold: 8,
    weeklyOvertimeThreshold: 40,
    overtimeRate: 1.5,
    doubleTimeEnabled: false,
    doubleTimeThreshold: 12,
    doubleTimeRate: 2.0,
    weekendPremium: false,
    weekendPremiumRate: 1.25,
    holidayPremium: true,
    holidayPremiumRate: 2.0,
    onCallPay: true,
    onCallPayRate: 5,
  });

  const handleSettingChange = <K extends keyof OvertimeSettings>(
    key: K,
    value: OvertimeSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // TODO: Implement save logic
    setHasUnsavedChanges(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Overtime &amp; Premium Pay
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure overtime rules and premium pay rates
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button onClick={handleSave} size="lg">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Overtime &amp; Premium Pay
            </CardTitle>
            <CardDescription>
              Configure overtime rules and premium pay rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="overtime-method">
                Overtime Calculation Method
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSettingChange(
                    "overtimeCalculationMethod",
                    value as OvertimeSettings["overtimeCalculationMethod"]
                  )
                }
                value={settings.overtimeCalculationMethod}
              >
                <SelectTrigger id="overtime-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Overtime</SelectItem>
                  <SelectItem value="weekly">Weekly Overtime</SelectItem>
                  <SelectItem value="both">Both (California Rule)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                {settings.overtimeCalculationMethod === "daily" &&
                  "Overtime after X hours in a single day"}
                {settings.overtimeCalculationMethod === "weekly" &&
                  "Overtime after X hours in a week"}
                {settings.overtimeCalculationMethod === "both" &&
                  "Whichever comes first: daily or weekly threshold"}
              </p>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
              {(settings.overtimeCalculationMethod === "daily" ||
                settings.overtimeCalculationMethod === "both") && (
                <div className="space-y-2">
                  <Label htmlFor="daily-threshold">
                    Daily Overtime Threshold (hours)
                  </Label>
                  <Input
                    id="daily-threshold"
                    max={24}
                    min={1}
                    onChange={(e) =>
                      handleSettingChange(
                        "dailyOvertimeThreshold",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    step={0.5}
                    type="number"
                    value={settings.dailyOvertimeThreshold}
                  />
                </div>
              )}

              {(settings.overtimeCalculationMethod === "weekly" ||
                settings.overtimeCalculationMethod === "both") && (
                <div className="space-y-2">
                  <Label htmlFor="weekly-threshold">
                    Weekly Overtime Threshold (hours)
                  </Label>
                  <Input
                    id="weekly-threshold"
                    max={168}
                    min={1}
                    onChange={(e) =>
                      handleSettingChange(
                        "weeklyOvertimeThreshold",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    step={1}
                    type="number"
                    value={settings.weeklyOvertimeThreshold}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="overtime-rate">
                  Overtime Rate (multiplier)
                </Label>
                <Input
                  id="overtime-rate"
                  max={5}
                  min={1}
                  onChange={(e) =>
                    handleSettingChange(
                      "overtimeRate",
                      Number.parseFloat(e.target.value)
                    )
                  }
                  step={0.1}
                  type="number"
                  value={settings.overtimeRate}
                />
                <p className="text-muted-foreground text-xs">
                  {settings.overtimeRate}x regular rate
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Double Time</Label>
                  <p className="text-muted-foreground text-sm">
                    Extra premium for excessive hours
                  </p>
                </div>
                <Switch
                  checked={settings.doubleTimeEnabled}
                  onCheckedChange={(checked) =>
                    handleSettingChange("doubleTimeEnabled", checked)
                  }
                />
              </div>

              {settings.doubleTimeEnabled && (
                <div className="ml-6 grid gap-4 border-l-2 pl-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="double-threshold">
                      Double Time Threshold (hours/day)
                    </Label>
                    <Input
                      id="double-threshold"
                      max={24}
                      min={1}
                      onChange={(e) =>
                        handleSettingChange(
                          "doubleTimeThreshold",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      step={0.5}
                      type="number"
                      value={settings.doubleTimeThreshold}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="double-rate">
                      Double Time Rate (multiplier)
                    </Label>
                    <Input
                      id="double-rate"
                      max={5}
                      min={1.5}
                      onChange={(e) =>
                        handleSettingChange(
                          "doubleTimeRate",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      step={0.1}
                      type="number"
                      value={settings.doubleTimeRate}
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium text-sm">Premium Pay</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekend Premium</Label>
                    <p className="text-muted-foreground text-sm">
                      Extra pay for weekend work
                    </p>
                  </div>
                  <Switch
                    checked={settings.weekendPremium}
                    onCheckedChange={(checked) =>
                      handleSettingChange("weekendPremium", checked)
                    }
                  />
                </div>

                {settings.weekendPremium && (
                  <div className="ml-6 space-y-2 border-l-2 pl-4">
                    <Label htmlFor="weekend-rate">
                      Weekend Rate (multiplier)
                    </Label>
                    <Input
                      className="max-w-xs"
                      id="weekend-rate"
                      max={5}
                      min={1}
                      onChange={(e) =>
                        handleSettingChange(
                          "weekendPremiumRate",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      step={0.05}
                      type="number"
                      value={settings.weekendPremiumRate}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Holiday Premium</Label>
                    <p className="text-muted-foreground text-sm">
                      Extra pay for holiday work
                    </p>
                  </div>
                  <Switch
                    checked={settings.holidayPremium}
                    onCheckedChange={(checked) =>
                      handleSettingChange("holidayPremium", checked)
                    }
                  />
                </div>

                {settings.holidayPremium && (
                  <div className="ml-6 space-y-2 border-l-2 pl-4">
                    <Label htmlFor="holiday-rate">
                      Holiday Rate (multiplier)
                    </Label>
                    <Input
                      className="max-w-xs"
                      id="holiday-rate"
                      max={5}
                      min={1}
                      onChange={(e) =>
                        handleSettingChange(
                          "holidayPremiumRate",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      step={0.1}
                      type="number"
                      value={settings.holidayPremiumRate}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>On-Call Pay</Label>
                    <p className="text-muted-foreground text-sm">
                      Compensation for on-call availability
                    </p>
                  </div>
                  <Switch
                    checked={settings.onCallPay}
                    onCheckedChange={(checked) =>
                      handleSettingChange("onCallPay", checked)
                    }
                  />
                </div>

                {settings.onCallPay && (
                  <div className="ml-6 space-y-2 border-l-2 pl-4">
                    <Label htmlFor="oncall-rate">On-Call Rate ($/hour)</Label>
                    <Input
                      className="max-w-xs"
                      id="oncall-rate"
                      min={0}
                      onChange={(e) =>
                        handleSettingChange(
                          "onCallPayRate",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      step={0.5}
                      type="number"
                      value={settings.onCallPayRate}
                    />
                    <p className="text-muted-foreground text-xs">
                      Flat hourly rate while on call
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
