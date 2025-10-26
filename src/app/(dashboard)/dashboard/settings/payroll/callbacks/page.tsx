"use client";

import {
  AlertCircle,
  Save,
} from "lucide-react";
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
import { usePageLayout } from "@/hooks/use-page-layout";

type CallbackSettings = {
  callbackPayDeduction: boolean;
  callbackDeductionAmount: number;
  callbackDeductionType: "flat" | "percentage";
  warrantyWorkPaid: boolean;
  warrantyWorkRate: number;
  chargebackEnabled: boolean;
  chargebackMaxAmount: number;
};

export default function CallbacksSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [settings, setSettings] = useState<CallbackSettings>({
    callbackPayDeduction: true,
    callbackDeductionAmount: 50,
    callbackDeductionType: "flat",
    warrantyWorkPaid: true,
    warrantyWorkRate: 75,
    chargebackEnabled: true,
    chargebackMaxAmount: 500,
  });

  const handleSettingChange = <K extends keyof CallbackSettings>(
    key: K,
    value: CallbackSettings[K]
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
              Callbacks &amp; Service Issues
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure deductions for callbacks and warranty work
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
              <AlertCircle className="h-5 w-5 text-primary" />
              Callbacks &amp; Service Issues
            </CardTitle>
            <CardDescription>
              Configure deductions for callbacks and warranty work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Callback Pay Deduction</Label>
                  <p className="text-muted-foreground text-sm">
                    Deduct from pay for service callbacks
                  </p>
                </div>
                <Switch
                  checked={settings.callbackPayDeduction}
                  onCheckedChange={(checked) =>
                    handleSettingChange("callbackPayDeduction", checked)
                  }
                />
              </div>

              {settings.callbackPayDeduction && (
                <div className="ml-6 grid gap-4 border-l-2 pl-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="callback-type">Deduction Type</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSettingChange(
                          "callbackDeductionType",
                          value as "flat" | "percentage"
                        )
                      }
                      value={settings.callbackDeductionType}
                    >
                      <SelectTrigger id="callback-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat">Flat Amount</SelectItem>
                        <SelectItem value="percentage">
                          Percentage of Job
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="callback-amount">
                      {settings.callbackDeductionType === "flat"
                        ? "Deduction Amount ($)"
                        : "Deduction Percentage (%)"}
                    </Label>
                    <Input
                      id="callback-amount"
                      max={
                        settings.callbackDeductionType === "percentage"
                          ? 100
                          : undefined
                      }
                      min={0}
                      onChange={(e) =>
                        handleSettingChange(
                          "callbackDeductionAmount",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      step={
                        settings.callbackDeductionType === "flat" ? 5 : 1
                      }
                      type="number"
                      value={settings.callbackDeductionAmount}
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Pay for Warranty Work</Label>
                  <p className="text-muted-foreground text-sm">
                    Compensate technicians for warranty repairs
                  </p>
                </div>
                <Switch
                  checked={settings.warrantyWorkPaid}
                  onCheckedChange={(checked) =>
                    handleSettingChange("warrantyWorkPaid", checked)
                  }
                />
              </div>

              {settings.warrantyWorkPaid && (
                <div className="ml-6 space-y-2 border-l-2 pl-4">
                  <Label htmlFor="warranty-rate">
                    Warranty Work Rate (% of normal)
                  </Label>
                  <Input
                    className="max-w-xs"
                    id="warranty-rate"
                    max={100}
                    min={0}
                    onChange={(e) =>
                      handleSettingChange(
                        "warrantyWorkRate",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    step={5}
                    type="number"
                    value={settings.warrantyWorkRate}
                  />
                  <p className="text-muted-foreground text-xs">
                    Technician earns {settings.warrantyWorkRate}% of their
                    normal rate
                  </p>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Chargebacks</Label>
                  <p className="text-muted-foreground text-sm">
                    Deduct cost of failed work or customer complaints
                  </p>
                </div>
                <Switch
                  checked={settings.chargebackEnabled}
                  onCheckedChange={(checked) =>
                    handleSettingChange("chargebackEnabled", checked)
                  }
                />
              </div>

              {settings.chargebackEnabled && (
                <div className="ml-6 space-y-2 border-l-2 pl-4">
                  <Label htmlFor="chargeback-max">
                    Maximum Chargeback ($)
                  </Label>
                  <Input
                    className="max-w-xs"
                    id="chargeback-max"
                    min={0}
                    onChange={(e) =>
                      handleSettingChange(
                        "chargebackMaxAmount",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    step={50}
                    type="number"
                    value={settings.chargebackMaxAmount}
                  />
                  <p className="text-muted-foreground text-xs">
                    Maximum amount that can be charged back per incident
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
