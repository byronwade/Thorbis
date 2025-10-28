"use client";

/**
 * Settings > Payroll > Schedule Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { Calendar, Save } from "lucide-react";
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
type ScheduleSettings = {
  payrollFrequency: "weekly" | "biweekly" | "semimonthly" | "monthly";
  payPeriodStartDay: number;
  payDayOfWeek: number;
  payDayOfMonth: number;
  processingDaysBeforePayday: number;
  requirePayrollApproval: boolean;
  payrollApprovalWorkflow: "single" | "dual" | "sequential";
  automaticPayStubs: boolean;
  payStubDeliveryMethod: "email" | "print" | "portal" | "all";
  detailedCommissionBreakdown: boolean;
};

export default function ScheduleSettingsPage() {  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [settings, setSettings] = useState<ScheduleSettings>({
    payrollFrequency: "biweekly",
    payPeriodStartDay: 1,
    payDayOfWeek: 5,
    payDayOfMonth: 15,
    processingDaysBeforePayday: 2,
    requirePayrollApproval: true,
    payrollApprovalWorkflow: "dual",
    automaticPayStubs: true,
    payStubDeliveryMethod: "email",
    detailedCommissionBreakdown: true,
  });

  const handleSettingChange = <K extends keyof ScheduleSettings>(
    key: K,
    value: ScheduleSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // TODO: Implement save logic
    setHasUnsavedChanges(false);
  };

  const getDayName = (day: number) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day];
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Payroll Schedule &amp; Processing
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure payroll timing and approval workflow
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
              <Calendar className="h-5 w-5 text-primary" />
              Payroll Schedule &amp; Processing
            </CardTitle>
            <CardDescription>
              Configure payroll timing and approval workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pay-frequency">Pay Frequency</Label>
                <Select
                  onValueChange={(value) =>
                    handleSettingChange(
                      "payrollFrequency",
                      value as ScheduleSettings["payrollFrequency"]
                    )
                  }
                  value={settings.payrollFrequency}
                >
                  <SelectTrigger id="pay-frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">
                      Weekly (52 pay periods)
                    </SelectItem>
                    <SelectItem value="biweekly">
                      Bi-weekly (26 pay periods)
                    </SelectItem>
                    <SelectItem value="semimonthly">
                      Semi-monthly (24 pay periods)
                    </SelectItem>
                    <SelectItem value="monthly">
                      Monthly (12 pay periods)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(settings.payrollFrequency === "weekly" ||
                settings.payrollFrequency === "biweekly") && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="period-start">Pay Period Start Day</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSettingChange(
                          "payPeriodStartDay",
                          Number.parseInt(value, 10)
                        )
                      }
                      value={settings.payPeriodStartDay.toString()}
                    >
                      <SelectTrigger id="period-start">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 7 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {getDayName(i)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pay-day">Pay Day</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSettingChange(
                          "payDayOfWeek",
                          Number.parseInt(value, 10)
                        )
                      }
                      value={settings.payDayOfWeek.toString()}
                    >
                      <SelectTrigger id="pay-day">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 7 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {getDayName(i)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {settings.payrollFrequency === "semimonthly" && (
                <div className="space-y-2">
                  <Label htmlFor="pay-day-month">Pay Days of Month</Label>
                  <Input
                    disabled
                    id="pay-day-month"
                    value="15th and Last day of month"
                  />
                </div>
              )}

              {settings.payrollFrequency === "monthly" && (
                <div className="space-y-2">
                  <Label htmlFor="pay-day-month">Pay Day of Month</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSettingChange(
                        "payDayOfMonth",
                        Number.parseInt(value, 10)
                      )
                    }
                    value={settings.payDayOfMonth.toString()}
                  >
                    <SelectTrigger id="pay-day-month">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                          {i + 1 === 1
                            ? "st"
                            : i + 1 === 2
                              ? "nd"
                              : i + 1 === 3
                                ? "rd"
                                : "th"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="processing-days">
                  Processing Days Before Payday
                </Label>
                <Input
                  id="processing-days"
                  max={7}
                  min={0}
                  onChange={(e) =>
                    handleSettingChange(
                      "processingDaysBeforePayday",
                      Number.parseInt(e.target.value, 10)
                    )
                  }
                  type="number"
                  value={settings.processingDaysBeforePayday}
                />
                <p className="text-muted-foreground text-xs">
                  Time needed to review and approve payroll
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Payroll Approval</Label>
                  <p className="text-muted-foreground text-sm">
                    Payroll must be approved before processing
                  </p>
                </div>
                <Switch
                  checked={settings.requirePayrollApproval}
                  onCheckedChange={(checked) =>
                    handleSettingChange("requirePayrollApproval", checked)
                  }
                />
              </div>

              {settings.requirePayrollApproval && (
                <div className="ml-6 space-y-2 border-l-2 pl-4">
                  <Label htmlFor="approval-workflow">Approval Workflow</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSettingChange(
                        "payrollApprovalWorkflow",
                        value as ScheduleSettings["payrollApprovalWorkflow"]
                      )
                    }
                    value={settings.payrollApprovalWorkflow}
                  >
                    <SelectTrigger className="max-w-xs" id="approval-workflow">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Approver</SelectItem>
                      <SelectItem value="dual">
                        Dual Approval (Any Order)
                      </SelectItem>
                      <SelectItem value="sequential">
                        Sequential (Manager → Admin)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium text-sm">Pay Stub Settings</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic Pay Stubs</Label>
                  <p className="text-muted-foreground text-sm">
                    Generate pay stubs automatically
                  </p>
                </div>
                <Switch
                  checked={settings.automaticPayStubs}
                  onCheckedChange={(checked) =>
                    handleSettingChange("automaticPayStubs", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paystub-delivery">Delivery Method</Label>
                <Select
                  onValueChange={(value) =>
                    handleSettingChange(
                      "payStubDeliveryMethod",
                      value as ScheduleSettings["payStubDeliveryMethod"]
                    )
                  }
                  value={settings.payStubDeliveryMethod}
                >
                  <SelectTrigger className="max-w-xs" id="paystub-delivery">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Only</SelectItem>
                    <SelectItem value="print">Print Only</SelectItem>
                    <SelectItem value="portal">Employee Portal Only</SelectItem>
                    <SelectItem value="all">All Methods</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Detailed Commission Breakdown</Label>
                  <p className="text-muted-foreground text-sm">
                    Show job-by-job commission details
                  </p>
                </div>
                <Switch
                  checked={settings.detailedCommissionBreakdown}
                  onCheckedChange={(checked) =>
                    handleSettingChange("detailedCommissionBreakdown", checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
