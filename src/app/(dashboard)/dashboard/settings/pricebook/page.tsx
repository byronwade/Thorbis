"use client";

import {
  DollarSign,
  HelpCircle,
  Loader2,
  Package,
  Percent,
  Receipt,
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
import {
import { usePageLayout } from "@/hooks/use-page-layout";
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Constants
const SIMULATED_API_DELAY = 1500;
const DEFAULT_MARKUP_PERCENT = 50;
const DEFAULT_MAX_DISCOUNT = 20;
const DEFAULT_LOW_STOCK_THRESHOLD = 10;
const PERCENTAGE_MULTIPLIER = 100;

type PriceBookSettings = {
  // Pricing Strategy
  defaultMarkupPercent: number;
  useMarkupPricing: boolean;
  roundPrices: boolean;
  roundToNearest: number; // 1, 5, 10, 25, 50, 100
  showCostToTechs: boolean;
  requireApprovalForDiscounts: boolean;
  maxDiscountPercent: number;

  // Item Management
  requireDescription: boolean;
  requireCost: boolean;
  trackInventory: boolean;
  warnLowStock: boolean;
  lowStockThreshold: number;

  // Pricing Tiers
  enableTieredPricing: boolean;
  tierNames: string[];
  tierMultipliers: number[];

  // Tax Settings
  enableTax: boolean;
  defaultTaxRate: number;
  taxLabel: string;
  includeTaxInPrice: boolean;
};

export default function PriceBookSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [settings, setSettings] = useState<PriceBookSettings>({
    // Pricing Strategy
    defaultMarkupPercent: DEFAULT_MARKUP_PERCENT,
    useMarkupPricing: true,
    roundPrices: true,
    roundToNearest: 5,
    showCostToTechs: false,
    requireApprovalForDiscounts: true,
    maxDiscountPercent: DEFAULT_MAX_DISCOUNT,

    // Item Management
    requireDescription: true,
    requireCost: true,
    trackInventory: false,
    warnLowStock: true,
    lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,

    // Pricing Tiers
    enableTieredPricing: true,
    tierNames: ["Standard", "Premium", "Emergency"],
    tierMultipliers: [1.0, 1.25, 1.5],

    // Tax Settings
    enableTax: true,
    defaultTaxRate: 8.5,
    taxLabel: "Sales Tax",
    includeTaxInPrice: false,
  });

  const updateSetting = <K extends keyof PriceBookSettings>(
    key: K,
    value: PriceBookSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  async function handleSave() {
    setIsSubmitting(true);
    await new Promise((resolve) => {
      setTimeout(resolve, SIMULATED_API_DELAY);
    });
    // TODO: Save price book settings to database/API
    setIsSubmitting(false);
  }

  const examplePrice = 100;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Price Book Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure pricing rules, markup, discounts, and tax calculation
          </p>
        </div>

        <Separator />

        {/* Pricing Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4" />
              Pricing Strategy
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    How you calculate prices for your services and products
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Configure how selling prices are calculated from costs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Use Markup Pricing
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically calculate selling price from cost + markup
                        percentage
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Calculate price by adding markup % to cost
                </p>
              </div>
              <Switch
                checked={settings.useMarkupPricing}
                onCheckedChange={(checked) =>
                  updateSetting("useMarkupPricing", checked)
                }
              />
            </div>

            {settings.useMarkupPricing && (
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Default Markup Percentage
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        How much to add on top of cost when creating new items
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="relative mt-2">
                  <Input
                    onChange={(e) =>
                      updateSetting(
                        "defaultMarkupPercent",
                        Number.parseFloat(e.target.value) ||
                          DEFAULT_MARKUP_PERCENT
                      )
                    }
                    placeholder="50"
                    type="number"
                    value={settings.defaultMarkupPercent}
                  />
                  <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                    %
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  Example: $100 cost + {settings.defaultMarkupPercent}% markup =
                  $
                  {examplePrice +
                    (examplePrice * settings.defaultMarkupPercent) /
                      PERCENTAGE_MULTIPLIER}{" "}
                  selling price
                </p>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Round Prices
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Round prices to nice numbers ($95 instead of $94.37)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Make prices easier to read and remember
                </p>
              </div>
              <Switch
                checked={settings.roundPrices}
                onCheckedChange={(checked) =>
                  updateSetting("roundPrices", checked)
                }
              />
            </div>

            {settings.roundPrices && (
              <div>
                <Label className="font-medium text-sm">Round to Nearest</Label>
                <Select
                  onValueChange={(value) =>
                    updateSetting("roundToNearest", Number.parseInt(value, 10))
                  }
                  value={settings.roundToNearest.toString()}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">$1 (e.g., $95.00)</SelectItem>
                    <SelectItem value="5">$5 (e.g., $95.00)</SelectItem>
                    <SelectItem value="10">$10 (e.g., $90.00)</SelectItem>
                    <SelectItem value="25">$25 (e.g., $100.00)</SelectItem>
                    <SelectItem value="50">$50 (e.g., $100.00)</SelectItem>
                    <SelectItem value="100">$100 (e.g., $100.00)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-1 text-muted-foreground text-xs">
                  Prices will round to nearest selected amount
                </p>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Show Cost to Technicians
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Let field technicians see what items cost you
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Technicians can see item costs in the field
                </p>
              </div>
              <Switch
                checked={settings.showCostToTechs}
                onCheckedChange={(checked) =>
                  updateSetting("showCostToTechs", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Approval for Discounts
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Manager must approve when technician gives discount
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Manager approval needed for discounts
                </p>
              </div>
              <Switch
                checked={settings.requireApprovalForDiscounts}
                onCheckedChange={(checked) =>
                  updateSetting("requireApprovalForDiscounts", checked)
                }
              />
            </div>

            {settings.requireApprovalForDiscounts && (
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Maximum Discount Without Approval
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Technicians can give this much discount without asking
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="relative mt-2">
                  <Input
                    onChange={(e) =>
                      updateSetting(
                        "maxDiscountPercent",
                        Number.parseInt(e.target.value, 10) ||
                          DEFAULT_MAX_DISCOUNT
                      )
                    }
                    placeholder="20"
                    type="number"
                    value={settings.maxDiscountPercent}
                  />
                  <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                    %
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  Discounts above {settings.maxDiscountPercent}% require manager
                  approval
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing Tiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Pricing Tiers
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Offer different price levels (standard, emergency, premium)
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Different price levels for different service situations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Tiered Pricing
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Charge different prices for regular vs emergency work
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Different prices for different service levels
                </p>
              </div>
              <Switch
                checked={settings.enableTieredPricing}
                onCheckedChange={(checked) =>
                  updateSetting("enableTieredPricing", checked)
                }
              />
            </div>

            {settings.enableTieredPricing && (
              <>
                <Separator />
                <div className="space-y-3">
                  {settings.tierNames.map((tierName, index) => (
                    <div className="grid grid-cols-2 gap-4" key={tierName}>
                      <div>
                        <Label className="text-sm">Tier {index + 1} Name</Label>
                        <Input
                          className="mt-2"
                          onChange={(e) => {
                            const newNames = [...settings.tierNames];
                            newNames[index] = e.target.value;
                            updateSetting("tierNames", newNames);
                          }}
                          placeholder="Standard"
                          value={tierName}
                        />
                      </div>
                      <div>
                        <Label className="flex items-center gap-2 text-sm">
                          Price Multiplier
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Multiply base price by this number
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <div className="relative mt-2">
                          <Input
                            onChange={(e) => {
                              const newMultipliers = [
                                ...settings.tierMultipliers,
                              ];
                              newMultipliers[index] =
                                Number.parseFloat(e.target.value) || 1.0;
                              updateSetting("tierMultipliers", newMultipliers);
                            }}
                            placeholder="1.0"
                            step="0.05"
                            type="number"
                            value={settings.tierMultipliers[index]}
                          />
                          <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                            ×
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="mb-2 font-medium text-sm">Pricing Example:</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      Base price: ${examplePrice}.00
                    </p>
                    {settings.tierNames.map((tierName, index) => (
                      <p key={tierName}>
                        {tierName}: $
                        {(
                          examplePrice * settings.tierMultipliers[index]
                        ).toFixed(2)}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Item Management Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4" />
              Item Management Rules
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Rules for adding and managing items in price book
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Requirements and tracking rules for price book items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Description
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Force users to add description when creating items
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Every item must have a description
                </p>
              </div>
              <Switch
                checked={settings.requireDescription}
                onCheckedChange={(checked) =>
                  updateSetting("requireDescription", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Cost
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Must enter what item costs you before setting price
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Must enter cost before saving item
                </p>
              </div>
              <Switch
                checked={settings.requireCost}
                onCheckedChange={(checked) =>
                  updateSetting("requireCost", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Track Inventory
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Keep track of how many of each item you have in stock
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Track quantity on hand for each item
                </p>
              </div>
              <Switch
                checked={settings.trackInventory}
                onCheckedChange={(checked) =>
                  updateSetting("trackInventory", checked)
                }
              />
            </div>

            {settings.trackInventory && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Warn on Low Stock
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Alert when inventory gets below threshold
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Alert when stock is running low
                    </p>
                  </div>
                  <Switch
                    checked={settings.warnLowStock}
                    onCheckedChange={(checked) =>
                      updateSetting("warnLowStock", checked)
                    }
                  />
                </div>

                {settings.warnLowStock && (
                  <div>
                    <Label className="font-medium text-sm">
                      Low Stock Threshold
                    </Label>
                    <Input
                      className="mt-2"
                      onChange={(e) =>
                        updateSetting(
                          "lowStockThreshold",
                          Number.parseInt(e.target.value, 10) ||
                            DEFAULT_LOW_STOCK_THRESHOLD
                        )
                      }
                      placeholder="10"
                      type="number"
                      value={settings.lowStockThreshold}
                    />
                    <p className="mt-1 text-muted-foreground text-xs">
                      Alert when quantity falls below{" "}
                      {settings.lowStockThreshold} units
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="h-4 w-4" />
              Tax Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Configure sales tax for your products and services
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Configure how tax is calculated and displayed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Tax Calculation
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically calculate and add tax to taxable items
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Add tax to invoices and estimates
                </p>
              </div>
              <Switch
                checked={settings.enableTax}
                onCheckedChange={(checked) =>
                  updateSetting("enableTax", checked)
                }
              />
            </div>

            {settings.enableTax && (
              <>
                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Default Tax Rate
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Standard tax rate for your location
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        onChange={(e) =>
                          updateSetting(
                            "defaultTaxRate",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="8.5"
                        step="0.1"
                        type="number"
                        value={settings.defaultTaxRate}
                      />
                      <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                        %
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Tax Label
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Name shown on invoices (e.g., Sales Tax, VAT, GST)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      className="mt-2"
                      onChange={(e) =>
                        updateSetting("taxLabel", e.target.value)
                      }
                      placeholder="Sales Tax"
                      value={settings.taxLabel}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Tax Included in Price
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Price shown includes tax (common in EU) vs. tax
                            added at checkout (common in US)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      {settings.includeTaxInPrice
                        ? "Prices include tax (tax-inclusive)"
                        : "Tax added to price (tax-exclusive)"}
                    </p>
                  </div>
                  <Switch
                    checked={settings.includeTaxInPrice}
                    onCheckedChange={(checked) =>
                      updateSetting("includeTaxInPrice", checked)
                    }
                  />
                </div>

                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="mb-2 flex items-center gap-2 font-medium text-sm">
                    <Percent className="h-4 w-4" />
                    Tax Calculation Example
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Item Price:</span>
                      <span className="font-medium">${examplePrice}.00</span>
                    </div>
                    {settings.includeTaxInPrice ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Tax (included):
                          </span>
                          <span className="text-muted-foreground">
                            $
                            {(
                              (examplePrice * settings.defaultTaxRate) /
                              (PERCENTAGE_MULTIPLIER + settings.defaultTaxRate)
                            ).toFixed(2)}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between pt-1">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold">${examplePrice}.00</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {settings.taxLabel} ({settings.defaultTaxRate}%):
                          </span>
                          <span className="text-muted-foreground">
                            $
                            {(
                              (examplePrice * settings.defaultTaxRate) /
                              PERCENTAGE_MULTIPLIER
                            ).toFixed(2)}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between pt-1">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold">
                            $
                            {(
                              examplePrice +
                              (examplePrice * settings.defaultTaxRate) /
                                PERCENTAGE_MULTIPLIER
                            ).toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Reset to Defaults
          </Button>
          <Button disabled={isSubmitting} onClick={handleSave}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Price Book Settings
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
