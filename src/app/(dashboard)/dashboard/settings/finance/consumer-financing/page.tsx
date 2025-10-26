"use client";

import { Calculator, CreditCard, Save } from "lucide-react";
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

export default function ConsumerFinancingSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    enabled: true,
    provider: "affirm",
    minimumAmount: 500,
    maximumAmount: 25_000,
    defaultTerm: 12,
    showOnInvoices: true,
    showOnEstimates: true,
    autoApproveUnder: 5000,
    requireDownPayment: true,
    downPaymentPercent: 10,
    applyServiceFee: false,
    serviceFeePercent: 3,
  });

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Consumer Financing
            </h1>
            <p className="mt-2 text-muted-foreground">
              Offer payment plans and financing options to customers
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>

        {/* Enable/Disable */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Consumer Financing
            </CardTitle>
            <CardDescription>
              Allow customers to finance large purchases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Consumer Financing</Label>
                <p className="text-muted-foreground text-sm">
                  Offer flexible payment plans to customers
                </p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => handleChange("enabled", checked)}
              />
            </div>

            {settings.enabled && (
              <>
                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="provider">Financing Provider</Label>
                  <Select
                    onValueChange={(value) => handleChange("provider", value)}
                    value={settings.provider}
                  >
                    <SelectTrigger id="provider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="affirm">Affirm</SelectItem>
                      <SelectItem value="klarna">Klarna</SelectItem>
                      <SelectItem value="afterpay">Afterpay</SelectItem>
                      <SelectItem value="paypal">PayPal Pay in 4</SelectItem>
                      <SelectItem value="greensky">GreenSky</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-xs">
                    Current provider: {settings.provider}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {settings.enabled && (
          <>
            {/* Financing Limits */}
            <Card>
              <CardHeader>
                <CardTitle>Financing Limits</CardTitle>
                <CardDescription>
                  Set minimum and maximum financing amounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="min-amount">Minimum Amount ($)</Label>
                    <Input
                      id="min-amount"
                      min={0}
                      onChange={(e) =>
                        handleChange(
                          "minimumAmount",
                          Number.parseInt(e.target.value)
                        )
                      }
                      type="number"
                      value={settings.minimumAmount}
                    />
                    <p className="text-muted-foreground text-xs">
                      Minimum purchase for financing
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-amount">Maximum Amount ($)</Label>
                    <Input
                      id="max-amount"
                      min={0}
                      onChange={(e) =>
                        handleChange(
                          "maximumAmount",
                          Number.parseInt(e.target.value)
                        )
                      }
                      type="number"
                      value={settings.maximumAmount}
                    />
                    <p className="text-muted-foreground text-xs">
                      Maximum financed amount
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="default-term">Default Term (months)</Label>
                  <Select
                    onValueChange={(value) =>
                      handleChange("defaultTerm", Number.parseInt(value))
                    }
                    value={settings.defaultTerm.toString()}
                  >
                    <SelectTrigger id="default-term">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="18">18 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>
                  Where to show financing options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show on Invoices</Label>
                    <p className="text-muted-foreground text-sm">
                      Display financing option on customer invoices
                    </p>
                  </div>
                  <Switch
                    checked={settings.showOnInvoices}
                    onCheckedChange={(checked) =>
                      handleChange("showOnInvoices", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show on Estimates</Label>
                    <p className="text-muted-foreground text-sm">
                      Display financing option on estimates
                    </p>
                  </div>
                  <Switch
                    checked={settings.showOnEstimates}
                    onCheckedChange={(checked) =>
                      handleChange("showOnEstimates", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Approval Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Approval Settings</CardTitle>
                <CardDescription>
                  Configure financing approval workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="auto-approve">Auto-Approve Under ($)</Label>
                  <Input
                    id="auto-approve"
                    min={0}
                    onChange={(e) =>
                      handleChange(
                        "autoApproveUnder",
                        Number.parseInt(e.target.value)
                      )
                    }
                    type="number"
                    value={settings.autoApproveUnder}
                  />
                  <p className="text-muted-foreground text-xs">
                    Automatically approve financing under this amount
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Down Payment</Label>
                    <p className="text-muted-foreground text-sm">
                      Request down payment before approval
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireDownPayment}
                    onCheckedChange={(checked) =>
                      handleChange("requireDownPayment", checked)
                    }
                  />
                </div>

                {settings.requireDownPayment && (
                  <div className="ml-6 space-y-2 border-l-2 pl-4">
                    <Label htmlFor="down-payment">Down Payment (%)</Label>
                    <Input
                      id="down-payment"
                      max={50}
                      min={0}
                      onChange={(e) =>
                        handleChange(
                          "downPaymentPercent",
                          Number.parseInt(e.target.value)
                        )
                      }
                      type="number"
                      value={settings.downPaymentPercent}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fees */}
            <Card>
              <CardHeader>
                <CardTitle>Service Fees</CardTitle>
                <CardDescription>
                  Configure fees for financing services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Apply Service Fee</Label>
                    <p className="text-muted-foreground text-sm">
                      Charge fee for financing service
                    </p>
                  </div>
                  <Switch
                    checked={settings.applyServiceFee}
                    onCheckedChange={(checked) =>
                      handleChange("applyServiceFee", checked)
                    }
                  />
                </div>

                {settings.applyServiceFee && (
                  <div className="ml-6 space-y-2 border-l-2 pl-4">
                    <Label htmlFor="service-fee">Service Fee (%)</Label>
                    <Input
                      id="service-fee"
                      max={10}
                      min={0}
                      onChange={(e) =>
                        handleChange(
                          "serviceFeePercent",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      step={0.5}
                      type="number"
                      value={settings.serviceFeePercent}
                    />
                    <p className="text-muted-foreground text-xs">
                      Added to financed amount
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Example Calculation */}
            <Card className="border-blue-500/50 bg-blue-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-base text-blue-700 dark:text-blue-400">
                    Example: $10,000 Service
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Service Total:
                    </span>
                    <span className="font-medium">$10,000.00</span>
                  </div>
                  {settings.requireDownPayment && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Down Payment ({settings.downPaymentPercent}%):
                      </span>
                      <span className="font-medium">
                        ${(10_000 * settings.downPaymentPercent) / 100}.00
                      </span>
                    </div>
                  )}
                  {settings.applyServiceFee && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Service Fee ({settings.serviceFeePercent}%):
                      </span>
                      <span className="font-medium">
                        ${(10_000 * settings.serviceFeePercent) / 100}.00
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Financed Amount:</span>
                    <span className="font-bold">
                      $
                      {(
                        10_000 *
                        (1 -
                          (settings.requireDownPayment
                            ? settings.downPaymentPercent / 100
                            : 0)) *
                        (1 +
                          (settings.applyServiceFee
                            ? settings.serviceFeePercent / 100
                            : 0))
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">
                      Monthly Payment ({settings.defaultTerm} months):
                    </span>
                    <span className="font-bold">
                      $
                      {(
                        (10_000 *
                          (1 -
                            (settings.requireDownPayment
                              ? settings.downPaymentPercent / 100
                              : 0)) *
                          (1 +
                            (settings.applyServiceFee
                              ? settings.serviceFeePercent / 100
                              : 0))) /
                        settings.defaultTerm
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
