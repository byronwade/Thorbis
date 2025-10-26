"use client";

import {
  Save,
  TrendingUp,
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

type BonusSettings = {
  performanceBonusEnabled: boolean;
  performanceBonusType: "monthly" | "quarterly" | "annual";
  customerSatisfactionBonus: boolean;
  customerSatisfactionThreshold: number;
  customerSatisfactionAmount: number;
  safetyBonusEnabled: boolean;
  safetyBonusAmount: number;
  referralBonusEnabled: boolean;
  referralBonusAmount: number;
};

export default function BonusesSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [settings, setSettings] = useState<BonusSettings>({
    performanceBonusEnabled: true,
    performanceBonusType: "monthly",
    customerSatisfactionBonus: true,
    customerSatisfactionThreshold: 4.5,
    customerSatisfactionAmount: 100,
    safetyBonusEnabled: true,
    safetyBonusAmount: 250,
    referralBonusEnabled: true,
    referralBonusAmount: 500,
  });

  const handleSettingChange = <K extends keyof BonusSettings>(
    key: K,
    value: BonusSettings[K]
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
              Bonuses &amp; Incentives
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure performance bonuses and rewards
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
                        value as BonusSettings["performanceBonusType"]
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
      </div>
    </TooltipProvider>
  );
}
