"use client";

import { BadgeDollarSign, Info, Save } from "lucide-react";
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

type CommissionTier = {
  min: number;
  max: number | null;
  rate: number;
};

type CommissionSettings = {
  commissionEnabled: boolean;
  commissionType: "flat" | "tiered" | "performance" | "hybrid";
  flatCommissionRate: number;
  tieredCommissions: CommissionTier[];
  commissionPayoutTiming: "same-period" | "next-period" | "monthly";
  commissionMinimumThreshold: number;
  commissionCap: number;
  commissionCapEnabled: boolean;
  commissionOnServicePlans: boolean;
  commissionOnMaintenanceAgreements: boolean;
  maintenanceAgreementCommissionRate: number;
  splitCommissionMultipleTechs: boolean;
  helperCommissionPercent: number;
  leadCommissionPercent: number;
};

export default function CommissionSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [settings, setSettings] = useState<CommissionSettings>({
    commissionEnabled: true,
    commissionType: "tiered",
    flatCommissionRate: 10,
    tieredCommissions: [
      { min: 0, max: 5000, rate: 5 },
      { min: 5000, max: 10_000, rate: 7.5 },
      { min: 10_000, max: null, rate: 10 },
    ],
    commissionPayoutTiming: "same-period",
    commissionMinimumThreshold: 100,
    commissionCap: 0,
    commissionCapEnabled: false,
    commissionOnServicePlans: true,
    commissionOnMaintenanceAgreements: true,
    maintenanceAgreementCommissionRate: 15,
    splitCommissionMultipleTechs: true,
    helperCommissionPercent: 30,
    leadCommissionPercent: 70,
  });

  const handleSettingChange = <K extends keyof CommissionSettings>(
    key: K,
    value: CommissionSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleTierChange = (
    index: number,
    field: keyof CommissionTier,
    value: number | null
  ) => {
    const newTiers = [...settings.tieredCommissions];
    newTiers[index] = { ...newTiers[index], [field]: value };
    handleSettingChange("tieredCommissions", newTiers);
  };

  const addCommissionTier = () => {
    const lastTier = settings.tieredCommissions.at(-1);
    const newTier: CommissionTier = {
      min: lastTier?.max || 0,
      max: null,
      rate: 0,
    };
    handleSettingChange("tieredCommissions", [
      ...settings.tieredCommissions,
      newTier,
    ]);
  };

  const removeTier = (index: number) => {
    if (settings.tieredCommissions.length > 1) {
      const newTiers = settings.tieredCommissions.filter((_, i) => i !== index);
      handleSettingChange("tieredCommissions", newTiers);
    }
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
              Commission Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure how technician commissions are calculated
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
              <BadgeDollarSign className="h-5 w-5 text-primary" />
              Commission Structure
            </CardTitle>
            <CardDescription>
              Configure how technician commissions are calculated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="commission-enabled">
                  Enable Commission Pay
                </Label>
                <p className="text-muted-foreground text-sm">
                  Pay technicians commission on sales and services
                </p>
              </div>
              <Switch
                checked={settings.commissionEnabled}
                id="commission-enabled"
                onCheckedChange={(checked) =>
                  handleSettingChange("commissionEnabled", checked)
                }
              />
            </div>

            {settings.commissionEnabled && (
              <>
                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="commission-type">Commission Type</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSettingChange(
                          "commissionType",
                          value as CommissionSettings["commissionType"]
                        )
                      }
                      value={settings.commissionType}
                    >
                      <SelectTrigger id="commission-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat">Flat Percentage</SelectItem>
                        <SelectItem value="tiered">Tiered Structure</SelectItem>
                        <SelectItem value="performance">
                          Performance Based
                        </SelectItem>
                        <SelectItem value="hybrid">
                          Hybrid (Base + Commission)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-muted-foreground text-xs">
                      How commission percentages are determined
                    </p>
                  </div>

                  {settings.commissionType === "flat" && (
                    <div className="space-y-2">
                      <Label htmlFor="flat-rate">Commission Rate (%)</Label>
                      <Input
                        id="flat-rate"
                        max={100}
                        min={0}
                        onChange={(e) =>
                          handleSettingChange(
                            "flatCommissionRate",
                            Number.parseFloat(e.target.value)
                          )
                        }
                        step={0.5}
                        type="number"
                        value={settings.flatCommissionRate}
                      />
                      <p className="text-muted-foreground text-xs">
                        All sales earn this percentage
                      </p>
                    </div>
                  )}

                  {settings.commissionType === "tiered" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Commission Tiers</Label>
                        <Button
                          onClick={addCommissionTier}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          + Add Tier
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {settings.tieredCommissions.map((tier, index) => (
                          <Card key={index}>
                            <CardContent className="grid gap-4 pt-6 md:grid-cols-4">
                              <div className="space-y-2">
                                <Label>From ($)</Label>
                                <Input
                                  disabled={index > 0}
                                  min={0}
                                  onChange={(e) =>
                                    handleTierChange(
                                      index,
                                      "min",
                                      Number.parseFloat(e.target.value)
                                    )
                                  }
                                  step={100}
                                  type="number"
                                  value={tier.min}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>To ($)</Label>
                                <Input
                                  disabled={
                                    index ===
                                    settings.tieredCommissions.length - 1
                                  }
                                  min={tier.min}
                                  onChange={(e) =>
                                    handleTierChange(
                                      index,
                                      "max",
                                      e.target.value
                                        ? Number.parseFloat(e.target.value)
                                        : null
                                    )
                                  }
                                  placeholder="No limit"
                                  step={100}
                                  type="number"
                                  value={tier.max || ""}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Rate (%)</Label>
                                <Input
                                  max={100}
                                  min={0}
                                  onChange={(e) =>
                                    handleTierChange(
                                      index,
                                      "rate",
                                      Number.parseFloat(e.target.value)
                                    )
                                  }
                                  step={0.5}
                                  type="number"
                                  value={tier.rate}
                                />
                              </div>
                              <div className="flex items-end">
                                {settings.tieredCommissions.length > 1 && (
                                  <Button
                                    className="w-full"
                                    onClick={() => removeTier(index)}
                                    size="sm"
                                    type="button"
                                    variant="destructive"
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <Card className="border-blue-500/50 bg-blue-500/5">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-3">
                            <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                            <div className="text-sm">
                              <p className="font-medium">Tier Example:</p>
                              <ul className="mt-2 space-y-1 text-muted-foreground">
                                {settings.tieredCommissions.map(
                                  (tier, index) => (
                                    <li key={index}>
                                      ${tier.min.toLocaleString()} -{" "}
                                      {tier.max
                                        ? `$${tier.max.toLocaleString()}`
                                        : "∞"}
                                      : {tier.rate}% commission
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="commission-timing">
                      Commission Payout Timing
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleSettingChange(
                          "commissionPayoutTiming",
                          value as CommissionSettings["commissionPayoutTiming"]
                        )
                      }
                      value={settings.commissionPayoutTiming}
                    >
                      <SelectTrigger id="commission-timing">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="same-period">
                          Same Pay Period
                        </SelectItem>
                        <SelectItem value="next-period">
                          Next Pay Period
                        </SelectItem>
                        <SelectItem value="monthly">Monthly Payout</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-muted-foreground text-xs">
                      When commissions are paid out
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min-threshold">Minimum Threshold ($)</Label>
                    <Input
                      id="min-threshold"
                      min={0}
                      onChange={(e) =>
                        handleSettingChange(
                          "commissionMinimumThreshold",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      step={10}
                      type="number"
                      value={settings.commissionMinimumThreshold}
                    />
                    <p className="text-muted-foreground text-xs">
                      Minimum sale amount to earn commission
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="commission-cap">
                        Enable Commission Cap
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        Set maximum commission per pay period
                      </p>
                    </div>
                    <Switch
                      checked={settings.commissionCapEnabled}
                      id="commission-cap"
                      onCheckedChange={(checked) =>
                        handleSettingChange("commissionCapEnabled", checked)
                      }
                    />
                  </div>

                  {settings.commissionCapEnabled && (
                    <div className="ml-6 space-y-2 border-l-2 pl-4">
                      <Label htmlFor="cap-amount">Maximum Commission ($)</Label>
                      <Input
                        id="cap-amount"
                        min={0}
                        onChange={(e) =>
                          handleSettingChange(
                            "commissionCap",
                            Number.parseFloat(e.target.value)
                          )
                        }
                        step={100}
                        type="number"
                        value={settings.commissionCap}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-sm">
                    Special Commission Rules
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Service Plans &amp; Memberships</Label>
                      <p className="text-muted-foreground text-sm">
                        Pay commission on recurring service plans
                      </p>
                    </div>
                    <Switch
                      checked={settings.commissionOnServicePlans}
                      onCheckedChange={(checked) =>
                        handleSettingChange("commissionOnServicePlans", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Agreements</Label>
                      <p className="text-muted-foreground text-sm">
                        Commission on maintenance contract sales
                      </p>
                    </div>
                    <Switch
                      checked={settings.commissionOnMaintenanceAgreements}
                      onCheckedChange={(checked) =>
                        handleSettingChange(
                          "commissionOnMaintenanceAgreements",
                          checked
                        )
                      }
                    />
                  </div>

                  {settings.commissionOnMaintenanceAgreements && (
                    <div className="ml-6 space-y-2 border-l-2 pl-4">
                      <Label htmlFor="maintenance-rate">
                        Maintenance Agreement Rate (%)
                      </Label>
                      <Input
                        className="max-w-xs"
                        id="maintenance-rate"
                        max={100}
                        min={0}
                        onChange={(e) =>
                          handleSettingChange(
                            "maintenanceAgreementCommissionRate",
                            Number.parseFloat(e.target.value)
                          )
                        }
                        step={0.5}
                        type="number"
                        value={settings.maintenanceAgreementCommissionRate}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Split Commission (Multiple Techs)</Label>
                      <p className="text-muted-foreground text-sm">
                        Divide commission when multiple techs work a job
                      </p>
                    </div>
                    <Switch
                      checked={settings.splitCommissionMultipleTechs}
                      onCheckedChange={(checked) =>
                        handleSettingChange(
                          "splitCommissionMultipleTechs",
                          checked
                        )
                      }
                    />
                  </div>

                  {settings.splitCommissionMultipleTechs && (
                    <div className="ml-6 grid gap-4 border-l-2 pl-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="lead-percent">
                          Lead Technician (%)
                        </Label>
                        <Input
                          id="lead-percent"
                          max={100}
                          min={0}
                          onChange={(e) =>
                            handleSettingChange(
                              "leadCommissionPercent",
                              Number.parseFloat(e.target.value)
                            )
                          }
                          step={5}
                          type="number"
                          value={settings.leadCommissionPercent}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="helper-percent">
                          Helper/Assistant (%)
                        </Label>
                        <Input
                          id="helper-percent"
                          max={100}
                          min={0}
                          onChange={(e) =>
                            handleSettingChange(
                              "helperCommissionPercent",
                              Number.parseFloat(e.target.value)
                            )
                          }
                          step={5}
                          type="number"
                          value={settings.helperCommissionPercent}
                        />
                      </div>
                      {settings.leadCommissionPercent +
                        settings.helperCommissionPercent !==
                        100 && (
                        <p className="text-destructive text-xs md:col-span-2">
                          Warning: Percentages should total 100%
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
