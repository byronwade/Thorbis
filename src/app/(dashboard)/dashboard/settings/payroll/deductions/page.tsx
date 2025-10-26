"use client";

import { Save, Wallet } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePageLayout } from "@/hooks/use-page-layout";

type DeductionSettings = {
  uniformDeduction: boolean;
  uniformDeductionAmount: number;
  toolRentalDeduction: boolean;
  toolRentalAmount: number;
  vehicleUseDeduction: boolean;
  vehicleDeductionAmount: number;
  gpsUnitDeduction: boolean;
  gpsDeductionAmount: number;
  mileageReimbursement: boolean;
  mileageRate: number;
  toolPurchaseReimbursement: boolean;
  toolReimbursementLimit: number;
  cellPhoneStipend: boolean;
  cellPhoneStipendAmount: number;
};

export default function DeductionsSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [settings, setSettings] = useState<DeductionSettings>({
    uniformDeduction: false,
    uniformDeductionAmount: 0,
    toolRentalDeduction: false,
    toolRentalAmount: 0,
    vehicleUseDeduction: false,
    vehicleDeductionAmount: 0,
    gpsUnitDeduction: false,
    gpsDeductionAmount: 0,
    mileageReimbursement: true,
    mileageRate: 0.67,
    toolPurchaseReimbursement: true,
    toolReimbursementLimit: 1000,
    cellPhoneStipend: true,
    cellPhoneStipendAmount: 75,
  });

  const handleSettingChange = <K extends keyof DeductionSettings>(
    key: K,
    value: DeductionSettings[K]
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
              Deductions &amp; Reimbursements
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure equipment deductions and expense reimbursements
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
                          handleSettingChange("toolRentalDeduction", checked)
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
                          handleSettingChange("vehicleUseDeduction", checked)
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
                    <Label htmlFor="mileage-rate">Mileage Rate ($/mile)</Label>
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
                      handleSettingChange("toolPurchaseReimbursement", checked)
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
                    <Label htmlFor="phone-stipend">Monthly Amount ($)</Label>
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
      </div>
    </TooltipProvider>
  );
}
