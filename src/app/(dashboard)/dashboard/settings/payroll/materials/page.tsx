"use client";

/**
 * Settings > Payroll > Materials Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { Calculator, Layers, Save } from "lucide-react";
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
type MaterialSettings = {
  deductMaterialsFromPay: boolean;
  materialDeductionType: "gross" | "commission-only" | "net";
  largeJobMaterialThreshold: number;
  largeJobMaterialHandling: "deduct" | "split" | "company-covers";
  materialSplitPercentage: number;
  subcontractorCostsDeducted: boolean;
};

export default function MaterialsSettingsPage() {  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [settings, setSettings] = useState<MaterialSettings>({
    deductMaterialsFromPay: true,
    materialDeductionType: "commission-only",
    largeJobMaterialThreshold: 5000,
    largeJobMaterialHandling: "split",
    materialSplitPercentage: 50,
    subcontractorCostsDeducted: true,
  });

  const handleSettingChange = <K extends keyof MaterialSettings>(
    key: K,
    value: MaterialSettings[K]
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
              Material Cost Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure how material costs affect technician pay
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
                      <Label htmlFor="deduction-type">Deduction Method</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSettingChange(
                            "materialDeductionType",
                            value as MaterialSettings["materialDeductionType"]
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
                        {settings.materialDeductionType === "commission-only" &&
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
                              value as MaterialSettings["largeJobMaterialHandling"]
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
                            <SelectItem value="split">Split Cost</SelectItem>
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
                          Tech pays {settings.materialSplitPercentage}%, company
                          pays {100 - settings.materialSplitPercentage}%
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
      </div>
    </TooltipProvider>
  );
}
