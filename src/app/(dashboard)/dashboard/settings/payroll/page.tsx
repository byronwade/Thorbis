"use client";

export const dynamic = "force-dynamic";

import {
  AlertCircle,
  BadgeDollarSign,
  Calculator,
  Calendar,
  Clock,
  Info,
  Layers,
  Save,
  TrendingUp,
  Wallet,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePageLayout } from "@/hooks/use-page-layout";

type CommissionTier = {
  min: number;
  max: number | null;
  rate: number;
};

type PayrollSettings = {
  // Commission Structure
  commissionEnabled: boolean;
  commissionType: "flat" | "tiered" | "performance" | "hybrid";
  flatCommissionRate: number;
  tieredCommissions: CommissionTier[];
  commissionPayoutTiming: "same-period" | "next-period" | "monthly";
  commissionMinimumThreshold: number;
  commissionCap: number;
  commissionCapEnabled: boolean;

  // Material & Job Costs
  deductMaterialsFromPay: boolean;
  materialDeductionType: "gross" | "commission-only" | "net";
  largeJobMaterialThreshold: number;
  largeJobMaterialHandling: "deduct" | "split" | "company-covers";
  materialSplitPercentage: number;
  subcontractorCostsDeducted: boolean;

  // Callbacks & Service Issues
  callbackPayDeduction: boolean;
  callbackDeductionAmount: number;
  callbackDeductionType: "flat" | "percentage";
  warrantyWorkPaid: boolean;
  warrantyWorkRate: number;
  chargebackEnabled: boolean;
  chargebackMaxAmount: number;

  // Bonuses & Incentives
  performanceBonusEnabled: boolean;
  performanceBonusType: "monthly" | "quarterly" | "annual";
  customerSatisfactionBonus: boolean;
  customerSatisfactionThreshold: number;
  customerSatisfactionAmount: number;
  safetyBonusEnabled: boolean;
  safetyBonusAmount: number;
  referralBonusEnabled: boolean;
  referralBonusAmount: number;

  // Overtime & Premium Pay
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

  // Pay Rate Rules
  minimumHourlyRate: number;
  apprenticePayScale: boolean;
  apprenticeLevels: number;
  apprenticeStartingPercent: number;
  leadTechnicianPremium: boolean;
  leadTechnicianPremiumAmount: number;
  certificationPay: boolean;
  certificationPayIncrease: number;

  // Payroll Timing
  payrollFrequency: "weekly" | "biweekly" | "semimonthly" | "monthly";
  payPeriodStartDay: number; // 0 = Sunday
  payDayOfWeek: number;
  payDayOfMonth: number;
  processingDaysBeforePayday: number;

  // Deductions & Expenses
  uniformDeduction: boolean;
  uniformDeductionAmount: number;
  toolRentalDeduction: boolean;
  toolRentalAmount: number;
  vehicleUseDeduction: boolean;
  vehicleDeductionAmount: number;
  gpsUnitDeduction: boolean;
  gpsDeductionAmount: number;

  // Reimbursements
  mileageReimbursement: boolean;
  mileageRate: number;
  toolPurchaseReimbursement: boolean;
  toolReimbursementLimit: number;
  cellPhoneStipend: boolean;
  cellPhoneStipendAmount: number;

  // Advanced Settings
  commissionOnServicePlans: boolean;
  commissionOnMaintenanceAgreements: boolean;
  maintenanceAgreementCommissionRate: number;
  splitCommissionMultipleTechs: boolean;
  helperCommissionPercent: number;
  leadCommissionPercent: number;

  // Reporting & Compliance
  automaticPayStubs: boolean;
  payStubDeliveryMethod: "email" | "print" | "portal" | "all";
  detailedCommissionBreakdown: boolean;
  requirePayrollApproval: boolean;
  payrollApprovalWorkflow: "single" | "dual" | "sequential";
};

export default function PayrollSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [settings, setSettings] = useState<PayrollSettings>({
    // Commission Structure
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

    // Material & Job Costs
    deductMaterialsFromPay: true,
    materialDeductionType: "commission-only",
    largeJobMaterialThreshold: 5000,
    largeJobMaterialHandling: "split",
    materialSplitPercentage: 50,
    subcontractorCostsDeducted: true,

    // Callbacks & Service Issues
    callbackPayDeduction: true,
    callbackDeductionAmount: 50,
    callbackDeductionType: "flat",
    warrantyWorkPaid: true,
    warrantyWorkRate: 75,
    chargebackEnabled: true,
    chargebackMaxAmount: 500,

    // Bonuses & Incentives
    performanceBonusEnabled: true,
    performanceBonusType: "monthly",
    customerSatisfactionBonus: true,
    customerSatisfactionThreshold: 4.5,
    customerSatisfactionAmount: 100,
    safetyBonusEnabled: true,
    safetyBonusAmount: 250,
    referralBonusEnabled: true,
    referralBonusAmount: 500,

    // Overtime & Premium Pay
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

    // Pay Rate Rules
    minimumHourlyRate: 18,
    apprenticePayScale: true,
    apprenticeLevels: 4,
    apprenticeStartingPercent: 60,
    leadTechnicianPremium: true,
    leadTechnicianPremiumAmount: 5,
    certificationPay: true,
    certificationPayIncrease: 2.5,

    // Payroll Timing
    payrollFrequency: "biweekly",
    payPeriodStartDay: 1, // Monday
    payDayOfWeek: 5, // Friday
    payDayOfMonth: 15,
    processingDaysBeforePayday: 2,

    // Deductions & Expenses
    uniformDeduction: false,
    uniformDeductionAmount: 0,
    toolRentalDeduction: false,
    toolRentalAmount: 0,
    vehicleUseDeduction: false,
    vehicleDeductionAmount: 0,
    gpsUnitDeduction: false,
    gpsDeductionAmount: 0,

    // Reimbursements
    mileageReimbursement: true,
    mileageRate: 0.67,
    toolPurchaseReimbursement: true,
    toolReimbursementLimit: 1000,
    cellPhoneStipend: true,
    cellPhoneStipendAmount: 75,

    // Advanced Settings
    commissionOnServicePlans: true,
    commissionOnMaintenanceAgreements: true,
    maintenanceAgreementCommissionRate: 15,
    splitCommissionMultipleTechs: true,
    helperCommissionPercent: 30,
    leadCommissionPercent: 70,

    // Reporting & Compliance
    automaticPayStubs: true,
    payStubDeliveryMethod: "email",
    detailedCommissionBreakdown: true,
    requirePayrollApproval: true,
    payrollApprovalWorkflow: "dual",
  });

  const handleSettingChange = <K extends keyof PayrollSettings>(
    key: K,
    value: PayrollSettings[K]
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
    const lastTier =
      settings.tieredCommissions[settings.tieredCommissions.length - 1];
    const newTier: CommissionTier = {
      min: lastTier.max || 0,
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
              Payroll Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure commission structures, deductions, bonuses, and payroll
              policies
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button onClick={handleSave} size="lg">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>

        {/* Warning Banner */}
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div className="space-y-1">
              <p className="font-medium text-amber-700 text-sm dark:text-amber-400">
                Important: Payroll Policy Configuration
              </p>
              <p className="text-muted-foreground text-sm">
                These settings define company-wide payroll policies. Changes
                affect how all technicians are compensated. Individual employee
                rates and overrides are managed in their profile pages.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Settings Tabs */}
        <Tabs className="w-full" defaultValue="commission">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7">
            <TabsTrigger value="commission">Commission</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="callbacks">Callbacks</TabsTrigger>
            <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
            <TabsTrigger value="overtime">Overtime</TabsTrigger>
            <TabsTrigger value="deductions">Deductions</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          {/* Commission Settings */}
          <TabsContent className="space-y-6" value="commission">
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
                              value as PayrollSettings["commissionType"]
                            )
                          }
                          value={settings.commissionType}
                        >
                          <SelectTrigger id="commission-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flat">
                              Flat Percentage
                            </SelectItem>
                            <SelectItem value="tiered">
                              Tiered Structure
                            </SelectItem>
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
                              value as PayrollSettings["commissionPayoutTiming"]
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
                            <SelectItem value="monthly">
                              Monthly Payout
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-muted-foreground text-xs">
                          When commissions are paid out
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="min-threshold">
                          Minimum Threshold ($)
                        </Label>
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
                          <Label htmlFor="cap-amount">
                            Maximum Commission ($)
                          </Label>
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
                            handleSettingChange(
                              "commissionOnServicePlans",
                              checked
                            )
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
          </TabsContent>

          {/* Material Costs */}
          <TabsContent className="space-y-6" value="materials">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Material &amp; Job Cost Handling
                </CardTitle>
                <CardDescription>
                  Configure how material costs affect technician pay
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="deduct-materials">
                        Deduct Materials from Pay
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        Subtract material costs from technician compensation
                      </p>
                    </div>
                    <Switch
                      checked={settings.deductMaterialsFromPay}
                      id="deduct-materials"
                      onCheckedChange={(checked) =>
                        handleSettingChange("deductMaterialsFromPay", checked)
                      }
                    />
                  </div>

                  {settings.deductMaterialsFromPay && (
                    <>
                      <div className="ml-6 space-y-4 border-l-2 pl-4">
                        <div className="space-y-2">
                          <Label htmlFor="deduction-type">
                            Deduction Method
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              handleSettingChange(
                                "materialDeductionType",
                                value as PayrollSettings["materialDeductionType"]
                              )
                            }
                            value={settings.materialDeductionType}
                          >
                            <SelectTrigger id="deduction-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gross">
                                Deduct from Gross Pay
                              </SelectItem>
                              <SelectItem value="commission-only">
                                Deduct from Commission Only
                              </SelectItem>
                              <SelectItem value="net">
                                Deduct from Net (After Commission)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-muted-foreground text-xs">
                            {settings.materialDeductionType === "gross" &&
                              "Materials deducted before any calculations"}
                            {settings.materialDeductionType ===
                              "commission-only" &&
                              "Commission calculated on (revenue - materials)"}
                            {settings.materialDeductionType === "net" &&
                              "Materials deducted after commission calculated"}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-medium text-sm">
                          Large Job Material Handling
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="large-job-threshold">
                              Large Job Threshold ($)
                            </Label>
                            <Input
                              id="large-job-threshold"
                              min={0}
                              onChange={(e) =>
                                handleSettingChange(
                                  "largeJobMaterialThreshold",
                                  Number.parseFloat(e.target.value)
                                )
                              }
                              step={100}
                              type="number"
                              value={settings.largeJobMaterialThreshold}
                            />
                            <p className="text-muted-foreground text-xs">
                              Material cost that triggers special handling
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="large-job-handling">
                              Handling Method
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                handleSettingChange(
                                  "largeJobMaterialHandling",
                                  value as PayrollSettings["largeJobMaterialHandling"]
                                )
                              }
                              value={settings.largeJobMaterialHandling}
                            >
                              <SelectTrigger id="large-job-handling">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="deduct">
                                  Full Deduction
                                </SelectItem>
                                <SelectItem value="split">
                                  Split Cost
                                </SelectItem>
                                <SelectItem value="company-covers">
                                  Company Covers
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {settings.largeJobMaterialHandling === "split" && (
                          <div className="ml-6 space-y-2 border-l-2 pl-4">
                            <Label htmlFor="split-percent">
                              Technician Responsibility (%)
                            </Label>
                            <Input
                              className="max-w-xs"
                              id="split-percent"
                              max={100}
                              min={0}
                              onChange={(e) =>
                                handleSettingChange(
                                  "materialSplitPercentage",
                                  Number.parseFloat(e.target.value)
                                )
                              }
                              step={5}
                              type="number"
                              value={settings.materialSplitPercentage}
                            />
                            <p className="text-muted-foreground text-xs">
                              Tech pays {settings.materialSplitPercentage}%,
                              company pays{" "}
                              {100 - settings.materialSplitPercentage}%
                            </p>
                          </div>
                        )}

                        <Card className="border-blue-500/50 bg-blue-500/5">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                              <Calculator className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                              <div className="text-sm">
                                <p className="font-medium">Example:</p>
                                <ul className="mt-2 space-y-1 text-muted-foreground">
                                  <li>Job Revenue: $10,000</li>
                                  <li>Material Cost: $6,000 (Large Job)</li>
                                  <li>Commission Rate: 10%</li>
                                  <li className="pt-2 font-medium text-foreground">
                                    {settings.largeJobMaterialHandling ===
                                      "deduct" &&
                                      "Technician Pays: $6,000 materials, Earns: 10% of $4,000 = $400"}
                                    {settings.largeJobMaterialHandling ===
                                      "split" &&
                                      `Technician Pays: ${settings.materialSplitPercentage}% of $6,000 = $${(6000 * settings.materialSplitPercentage) / 100}, Earns: 10% of $10,000 = $1,000`}
                                    {settings.largeJobMaterialHandling ===
                                      "company-covers" &&
                                      "Company Pays Materials, Technician Earns: 10% of $10,000 = $1,000"}
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Deduct Subcontractor Costs</Label>
                    <p className="text-muted-foreground text-sm">
                      Subtract subcontractor expenses from commission
                    </p>
                  </div>
                  <Switch
                    checked={settings.subcontractorCostsDeducted}
                    onCheckedChange={(checked) =>
                      handleSettingChange("subcontractorCostsDeducted", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Callbacks & Issues */}
          <TabsContent className="space-y-6" value="callbacks">
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
          </TabsContent>

          {/* Bonuses & Incentives */}
          <TabsContent className="space-y-6" value="bonuses">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Bonuses &amp; Incentives
                </CardTitle>
                <CardDescription>
                  Configure performance bonuses and rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Performance Bonuses</Label>
                      <p className="text-muted-foreground text-sm">
                        Award bonuses based on performance metrics
                      </p>
                    </div>
                    <Switch
                      checked={settings.performanceBonusEnabled}
                      onCheckedChange={(checked) =>
                        handleSettingChange("performanceBonusEnabled", checked)
                      }
                    />
                  </div>

                  {settings.performanceBonusEnabled && (
                    <div className="ml-6 space-y-2 border-l-2 pl-4">
                      <Label htmlFor="bonus-frequency">Bonus Frequency</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSettingChange(
                            "performanceBonusType",
                            value as PayrollSettings["performanceBonusType"]
                          )
                        }
                        value={settings.performanceBonusType}
                      >
                        <SelectTrigger
                          className="max-w-xs"
                          id="bonus-frequency"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Customer Satisfaction Bonus</Label>
                      <p className="text-muted-foreground text-sm">
                        Bonus for maintaining high customer ratings
                      </p>
                    </div>
                    <Switch
                      checked={settings.customerSatisfactionBonus}
                      onCheckedChange={(checked) =>
                        handleSettingChange(
                          "customerSatisfactionBonus",
                          checked
                        )
                      }
                    />
                  </div>

                  {settings.customerSatisfactionBonus && (
                    <div className="ml-6 grid gap-4 border-l-2 pl-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="satisfaction-threshold">
                          Minimum Rating
                        </Label>
                        <Input
                          id="satisfaction-threshold"
                          max={5}
                          min={0}
                          onChange={(e) =>
                            handleSettingChange(
                              "customerSatisfactionThreshold",
                              Number.parseFloat(e.target.value)
                            )
                          }
                          step={0.1}
                          type="number"
                          value={settings.customerSatisfactionThreshold}
                        />
                        <p className="text-muted-foreground text-xs">
                          Out of 5.0 stars
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="satisfaction-amount">
                          Bonus Amount ($)
                        </Label>
                        <Input
                          id="satisfaction-amount"
                          min={0}
                          onChange={(e) =>
                            handleSettingChange(
                              "customerSatisfactionAmount",
                              Number.parseFloat(e.target.value)
                            )
                          }
                          step={10}
                          type="number"
                          value={settings.customerSatisfactionAmount}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Safety Bonus</Label>
                      <p className="text-muted-foreground text-sm">
                        Reward accident-free periods
                      </p>
                    </div>
                    <Switch
                      checked={settings.safetyBonusEnabled}
                      onCheckedChange={(checked) =>
                        handleSettingChange("safetyBonusEnabled", checked)
                      }
                    />
                  </div>

                  {settings.safetyBonusEnabled && (
                    <div className="ml-6 space-y-2 border-l-2 pl-4">
                      <Label htmlFor="safety-amount">
                        Safety Bonus Amount ($)
                      </Label>
                      <Input
                        className="max-w-xs"
                        id="safety-amount"
                        min={0}
                        onChange={(e) =>
                          handleSettingChange(
                            "safetyBonusAmount",
                            Number.parseFloat(e.target.value)
                          )
                        }
                        step={25}
                        type="number"
                        value={settings.safetyBonusAmount}
                      />
                      <p className="text-muted-foreground text-xs">
                        Paid quarterly for zero accidents
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Employee Referral Bonus</Label>
                      <p className="text-muted-foreground text-sm">
                        Bonus for referring new hires
                      </p>
                    </div>
                    <Switch
                      checked={settings.referralBonusEnabled}
                      onCheckedChange={(checked) =>
                        handleSettingChange("referralBonusEnabled", checked)
                      }
                    />
                  </div>

                  {settings.referralBonusEnabled && (
                    <div className="ml-6 space-y-2 border-l-2 pl-4">
                      <Label htmlFor="referral-amount">
                        Referral Bonus Amount ($)
                      </Label>
                      <Input
                        className="max-w-xs"
                        id="referral-amount"
                        min={0}
                        onChange={(e) =>
                          handleSettingChange(
                            "referralBonusAmount",
                            Number.parseFloat(e.target.value)
                          )
                        }
                        step={50}
                        type="number"
                        value={settings.referralBonusAmount}
                      />
                      <p className="text-muted-foreground text-xs">
                        Paid after new hire completes 90 days
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overtime & Premium Pay */}
          <TabsContent className="space-y-6" value="overtime">
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
                        value as PayrollSettings["overtimeCalculationMethod"]
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
                      <SelectItem value="both">
                        Both (California Rule)
                      </SelectItem>
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
                        <Label htmlFor="oncall-rate">
                          On-Call Rate ($/hour)
                        </Label>
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
          </TabsContent>

          {/* Deductions & Reimbursements */}
          <TabsContent className="space-y-6" value="deductions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Deductions &amp; Reimbursements
                </CardTitle>
                <CardDescription>
                  Configure equipment deductions and expense reimbursements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Equipment Deductions</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardContent className="space-y-3 pt-6">
                        <div className="flex items-center justify-between">
                          <Label>Uniform Fee</Label>
                          <Switch
                            checked={settings.uniformDeduction}
                            onCheckedChange={(checked) =>
                              handleSettingChange("uniformDeduction", checked)
                            }
                          />
                        </div>
                        {settings.uniformDeduction && (
                          <Input
                            min={0}
                            onChange={(e) =>
                              handleSettingChange(
                                "uniformDeductionAmount",
                                Number.parseFloat(e.target.value)
                              )
                            }
                            placeholder="$/pay period"
                            step={5}
                            type="number"
                            value={settings.uniformDeductionAmount}
                          />
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="space-y-3 pt-6">
                        <div className="flex items-center justify-between">
                          <Label>Tool Rental</Label>
                          <Switch
                            checked={settings.toolRentalDeduction}
                            onCheckedChange={(checked) =>
                              handleSettingChange(
                                "toolRentalDeduction",
                                checked
                              )
                            }
                          />
                        </div>
                        {settings.toolRentalDeduction && (
                          <Input
                            min={0}
                            onChange={(e) =>
                              handleSettingChange(
                                "toolRentalAmount",
                                Number.parseFloat(e.target.value)
                              )
                            }
                            placeholder="$/pay period"
                            step={5}
                            type="number"
                            value={settings.toolRentalAmount}
                          />
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="space-y-3 pt-6">
                        <div className="flex items-center justify-between">
                          <Label>Vehicle Use Fee</Label>
                          <Switch
                            checked={settings.vehicleUseDeduction}
                            onCheckedChange={(checked) =>
                              handleSettingChange(
                                "vehicleUseDeduction",
                                checked
                              )
                            }
                          />
                        </div>
                        {settings.vehicleUseDeduction && (
                          <Input
                            min={0}
                            onChange={(e) =>
                              handleSettingChange(
                                "vehicleDeductionAmount",
                                Number.parseFloat(e.target.value)
                              )
                            }
                            placeholder="$/pay period"
                            step={5}
                            type="number"
                            value={settings.vehicleDeductionAmount}
                          />
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="space-y-3 pt-6">
                        <div className="flex items-center justify-between">
                          <Label>GPS Unit Fee</Label>
                          <Switch
                            checked={settings.gpsUnitDeduction}
                            onCheckedChange={(checked) =>
                              handleSettingChange("gpsUnitDeduction", checked)
                            }
                          />
                        </div>
                        {settings.gpsUnitDeduction && (
                          <Input
                            min={0}
                            onChange={(e) =>
                              handleSettingChange(
                                "gpsDeductionAmount",
                                Number.parseFloat(e.target.value)
                              )
                            }
                            placeholder="$/pay period"
                            step={5}
                            type="number"
                            value={settings.gpsDeductionAmount}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Reimbursements</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mileage Reimbursement</Label>
                        <p className="text-muted-foreground text-sm">
                          Reimburse personal vehicle use
                        </p>
                      </div>
                      <Switch
                        checked={settings.mileageReimbursement}
                        onCheckedChange={(checked) =>
                          handleSettingChange("mileageReimbursement", checked)
                        }
                      />
                    </div>

                    {settings.mileageReimbursement && (
                      <div className="ml-6 space-y-2 border-l-2 pl-4">
                        <Label htmlFor="mileage-rate">
                          Mileage Rate ($/mile)
                        </Label>
                        <Input
                          className="max-w-xs"
                          id="mileage-rate"
                          min={0}
                          onChange={(e) =>
                            handleSettingChange(
                              "mileageRate",
                              Number.parseFloat(e.target.value)
                            )
                          }
                          step={0.01}
                          type="number"
                          value={settings.mileageRate}
                        />
                        <p className="text-muted-foreground text-xs">
                          IRS standard rate is $0.67/mile (2024)
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Tool Purchase Reimbursement</Label>
                        <p className="text-muted-foreground text-sm">
                          Reimburse for required tool purchases
                        </p>
                      </div>
                      <Switch
                        checked={settings.toolPurchaseReimbursement}
                        onCheckedChange={(checked) =>
                          handleSettingChange(
                            "toolPurchaseReimbursement",
                            checked
                          )
                        }
                      />
                    </div>

                    {settings.toolPurchaseReimbursement && (
                      <div className="ml-6 space-y-2 border-l-2 pl-4">
                        <Label htmlFor="tool-limit">Annual Limit ($)</Label>
                        <Input
                          className="max-w-xs"
                          id="tool-limit"
                          min={0}
                          onChange={(e) =>
                            handleSettingChange(
                              "toolReimbursementLimit",
                              Number.parseFloat(e.target.value)
                            )
                          }
                          step={100}
                          type="number"
                          value={settings.toolReimbursementLimit}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Cell Phone Stipend</Label>
                        <p className="text-muted-foreground text-sm">
                          Monthly allowance for phone use
                        </p>
                      </div>
                      <Switch
                        checked={settings.cellPhoneStipend}
                        onCheckedChange={(checked) =>
                          handleSettingChange("cellPhoneStipend", checked)
                        }
                      />
                    </div>

                    {settings.cellPhoneStipend && (
                      <div className="ml-6 space-y-2 border-l-2 pl-4">
                        <Label htmlFor="phone-stipend">
                          Monthly Amount ($)
                        </Label>
                        <Input
                          className="max-w-xs"
                          id="phone-stipend"
                          min={0}
                          onChange={(e) =>
                            handleSettingChange(
                              "cellPhoneStipendAmount",
                              Number.parseFloat(e.target.value)
                            )
                          }
                          step={5}
                          type="number"
                          value={settings.cellPhoneStipendAmount}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll Schedule */}
          <TabsContent className="space-y-6" value="schedule">
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
                          value as PayrollSettings["payrollFrequency"]
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
                        <Label htmlFor="period-start">
                          Pay Period Start Day
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleSettingChange(
                              "payPeriodStartDay",
                              Number.parseInt(value)
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
                              Number.parseInt(value)
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
                            Number.parseInt(value)
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
                          Number.parseInt(e.target.value)
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
                      <Label htmlFor="approval-workflow">
                        Approval Workflow
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleSettingChange(
                            "payrollApprovalWorkflow",
                            value as PayrollSettings["payrollApprovalWorkflow"]
                          )
                        }
                        value={settings.payrollApprovalWorkflow}
                      >
                        <SelectTrigger
                          className="max-w-xs"
                          id="approval-workflow"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">
                            Single Approver
                          </SelectItem>
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
                          value as PayrollSettings["payStubDeliveryMethod"]
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
                        <SelectItem value="portal">
                          Employee Portal Only
                        </SelectItem>
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
                        handleSettingChange(
                          "detailedCommissionBreakdown",
                          checked
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button (sticky at bottom) */}
        {hasUnsavedChanges && (
          <div className="sticky bottom-4 flex justify-end">
            <Button onClick={handleSave} size="lg">
              <Save className="mr-2 h-4 w-4" />
              Save All Changes
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
