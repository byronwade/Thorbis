"use client";

/**
 * Settings > Invoices Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  AlertCircle,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Hash,
  HelpCircle,
  Loader2,
  Mail,
  Palette,
  Save,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Constants
const SIMULATED_API_DELAY = 1500;
const DEFAULT_INVOICE_PREFIX = "INV";
const DEFAULT_NEXT_NUMBER = 1001;
const MAX_TERMS_LENGTH = 500;
const MAX_FOOTER_LENGTH = 300;

type InvoiceSettings = {
  // Invoice Numbering
  autoGenerateNumbers: boolean;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  includeYearInNumber: boolean;
  resetNumberYearly: boolean;

  // Payment Terms
  defaultPaymentTerms: string; // "net15" | "net30" | "net60" | "due-on-receipt" | "custom"
  customTermsDays: number;
  lateFeeEnabled: boolean;
  lateFeePercent: number;
  lateFeeGracePeriodDays: number;

  // Payment Methods
  acceptCash: boolean;
  acceptCheck: boolean;
  acceptCreditCard: boolean;
  acceptACH: boolean;
  acceptOnlinePayments: boolean;
  requireDepositPercent: number;
  requireDepositEnabled: boolean;

  // Invoice Appearance
  showCompanyLogo: boolean;
  primaryColor: string;
  showLineItemDescriptions: boolean;
  showItemQuantity: boolean;
  showItemPrice: boolean;
  showSubtotal: boolean;
  showTaxBreakdown: boolean;
  showDiscounts: boolean;

  // Tax Settings
  defaultTaxRate: number;
  taxLabel: string;
  includeTaxInPrices: boolean;
  showTaxId: boolean;

  // Automatic Actions
  autoSendOnCompletion: boolean;
  sendReminderBeforeDue: boolean;
  reminderDaysBeforeDue: number;
  sendOverdueReminders: boolean;
  overdueReminderIntervalDays: number;
  autoApplyLateFees: boolean;

  // Custom Messages
  defaultInvoiceTerms: string;
  defaultInvoiceFooter: string;
  thankYouMessage: string;
};

export default function InvoiceSettingsPage() {  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<InvoiceSettings>({
    // Invoice Numbering
    autoGenerateNumbers: true,
    invoicePrefix: DEFAULT_INVOICE_PREFIX,
    nextInvoiceNumber: DEFAULT_NEXT_NUMBER,
    includeYearInNumber: true,
    resetNumberYearly: false,

    // Payment Terms
    defaultPaymentTerms: "net30",
    customTermsDays: 30,
    lateFeeEnabled: true,
    lateFeePercent: 1.5,
    lateFeeGracePeriodDays: 3,

    // Payment Methods
    acceptCash: true,
    acceptCheck: true,
    acceptCreditCard: true,
    acceptACH: true,
    acceptOnlinePayments: true,
    requireDepositPercent: 50,
    requireDepositEnabled: false,

    // Invoice Appearance
    showCompanyLogo: true,
    primaryColor: "#3b82f6",
    showLineItemDescriptions: true,
    showItemQuantity: true,
    showItemPrice: true,
    showSubtotal: true,
    showTaxBreakdown: true,
    showDiscounts: true,

    // Tax Settings
    defaultTaxRate: 8.5,
    taxLabel: "Sales Tax",
    includeTaxInPrices: false,
    showTaxId: true,

    // Automatic Actions
    autoSendOnCompletion: true,
    sendReminderBeforeDue: true,
    reminderDaysBeforeDue: 3,
    sendOverdueReminders: true,
    overdueReminderIntervalDays: 7,
    autoApplyLateFees: false,

    // Custom Messages
    defaultInvoiceTerms:
      "Payment is due within 30 days of invoice date. Late payments may incur additional fees.",
    defaultInvoiceFooter: "Thank you for your business!",
    thankYouMessage:
      "We appreciate your prompt payment. Please contact us if you have any questions.",
  });

  const updateSetting = <K extends keyof InvoiceSettings>(
    key: K,
    value: InvoiceSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getInvoiceNumberExample = () => {
    const year = new Date().getFullYear();
    const prefix = settings.invoicePrefix || DEFAULT_INVOICE_PREFIX;
    const number = settings.nextInvoiceNumber;

    if (settings.includeYearInNumber) {
      return `${prefix}-${year}-${number.toString().padStart(5, "0")}`;
    }
    return `${prefix}-${number.toString().padStart(5, "0")}`;
  };

  const getPaymentTermsLabel = () => {
    switch (settings.defaultPaymentTerms) {
      case "net15":
        return "Net 15 - Payment due in 15 days";
      case "net30":
        return "Net 30 - Payment due in 30 days";
      case "net60":
        return "Net 60 - Payment due in 60 days";
      case "due-on-receipt":
        return "Due on Receipt - Payment due immediately";
      case "custom":
        return `Custom - Payment due in ${settings.customTermsDays} days`;
      default:
        return "Net 30 - Payment due in 30 days";
    }
  };

  async function handleSave() {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_API_DELAY));
    setIsSubmitting(false);
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Invoice Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure how your invoices look and work
          </p>
        </div>

        <Separator />

        {/* Invoice Numbering */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Hash className="h-4 w-4" />
              Invoice Numbering
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Control how invoice numbers are generated automatically
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              How invoice numbers are created for each new invoice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-Generate Invoice Numbers
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically create the next invoice number when you
                        create a new invoice
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  System creates invoice numbers automatically (recommended)
                </p>
              </div>
              <Switch
                checked={settings.autoGenerateNumbers}
                onCheckedChange={(checked) =>
                  updateSetting("autoGenerateNumbers", checked)
                }
              />
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Invoice Prefix
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Letters that appear at the start of every invoice number
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  className="mt-2"
                  disabled={!settings.autoGenerateNumbers}
                  onChange={(e) =>
                    updateSetting("invoicePrefix", e.target.value.toUpperCase())
                  }
                  placeholder="INV"
                  value={settings.invoicePrefix}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Example: "INV" for Invoice
                </p>
              </div>

              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Next Invoice Number
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        The number that will be used for your next invoice
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  className="mt-2"
                  disabled={!settings.autoGenerateNumbers}
                  onChange={(e) =>
                    updateSetting(
                      "nextInvoiceNumber",
                      Number.parseInt(e.target.value, 10) || DEFAULT_NEXT_NUMBER
                    )
                  }
                  placeholder="1001"
                  type="number"
                  value={settings.nextInvoiceNumber}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Starting point for numbering
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Include Year in Invoice Number
                </Label>
                <p className="text-muted-foreground text-xs">
                  Adds the current year to invoice numbers
                </p>
              </div>
              <Switch
                checked={settings.includeYearInNumber}
                disabled={!settings.autoGenerateNumbers}
                onCheckedChange={(checked) =>
                  updateSetting("includeYearInNumber", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Reset Number Every Year
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Start back at number 1 on January 1st each year
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Counter resets to 1 at the start of each year
                </p>
              </div>
              <Switch
                checked={settings.resetNumberYearly}
                disabled={!settings.autoGenerateNumbers}
                onCheckedChange={(checked) =>
                  updateSetting("resetNumberYearly", checked)
                }
              />
            </div>

            {settings.autoGenerateNumbers && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">
                    Next invoice will be:
                  </span>
                  <Badge className="font-mono" variant="secondary">
                    {getInvoiceNumberExample()}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Payment Terms
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    When customers need to pay and what happens if they're late
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              When payment is due and late fee policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Default Payment Terms
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      How many days customers have to pay after receiving the
                      invoice
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Select
                onValueChange={(value) =>
                  updateSetting(
                    "defaultPaymentTerms",
                    value as InvoiceSettings["defaultPaymentTerms"]
                  )
                }
                value={settings.defaultPaymentTerms}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="due-on-receipt">
                    Due on Receipt - Pay immediately
                  </SelectItem>
                  <SelectItem value="net15">
                    Net 15 - Pay within 15 days
                  </SelectItem>
                  <SelectItem value="net30">
                    Net 30 - Pay within 30 days
                  </SelectItem>
                  <SelectItem value="net60">
                    Net 60 - Pay within 60 days
                  </SelectItem>
                  <SelectItem value="custom">
                    Custom - Set your own days
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-muted-foreground text-xs">
                {getPaymentTermsLabel()}
              </p>
            </div>

            {settings.defaultPaymentTerms === "custom" && (
              <div>
                <Label className="font-medium text-sm">
                  Custom Payment Days
                </Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting(
                      "customTermsDays",
                      Number.parseInt(e.target.value, 10) || 30
                    )
                  }
                  placeholder="30"
                  type="number"
                  value={settings.customTermsDays}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Number of days customers have to pay
                </p>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Late Fees
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Charge extra if customers pay after the due date
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Charge a fee when invoices are paid late
                </p>
              </div>
              <Switch
                checked={settings.lateFeeEnabled}
                onCheckedChange={(checked) =>
                  updateSetting("lateFeeEnabled", checked)
                }
              />
            </div>

            {settings.lateFeeEnabled && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Late Fee Percentage
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Percent of invoice amount charged as late fee
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        onChange={(e) =>
                          updateSetting(
                            "lateFeePercent",
                            Number.parseFloat(e.target.value) || 1.5
                          )
                        }
                        placeholder="1.5"
                        step="0.1"
                        type="number"
                        value={settings.lateFeePercent}
                      />
                      <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                        %
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground text-xs">
                      Example: 1.5% of $1,000 = $15 late fee
                    </p>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Grace Period (Days)
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Extra days after due date before charging late fee
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      className="mt-2"
                      onChange={(e) =>
                        updateSetting(
                          "lateFeeGracePeriodDays",
                          Number.parseInt(e.target.value, 10) || 3
                        )
                      }
                      placeholder="3"
                      type="number"
                      value={settings.lateFeeGracePeriodDays}
                    />
                    <p className="mt-1 text-muted-foreground text-xs">
                      Days after due date before late fee applies
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Auto-Apply Late Fees
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Automatically add late fee to invoice after grace
                            period
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      System automatically adds late fee after grace period
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoApplyLateFees}
                    onCheckedChange={(checked) =>
                      updateSetting("autoApplyLateFees", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4" />
              Payment Methods
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Ways customers can pay you for this invoice
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Which payment methods you accept from customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Cash</Label>
                  <p className="text-muted-foreground text-xs">
                    Accept cash payments
                  </p>
                </div>
                <Switch
                  checked={settings.acceptCash}
                  onCheckedChange={(checked) =>
                    updateSetting("acceptCash", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Check</Label>
                  <p className="text-muted-foreground text-xs">
                    Accept paper checks
                  </p>
                </div>
                <Switch
                  checked={settings.acceptCheck}
                  onCheckedChange={(checked) =>
                    updateSetting("acceptCheck", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Credit Card</Label>
                  <p className="text-muted-foreground text-xs">
                    Visa, Mastercard, Amex
                  </p>
                </div>
                <Switch
                  checked={settings.acceptCreditCard}
                  onCheckedChange={(checked) =>
                    updateSetting("acceptCreditCard", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    ACH / Bank Transfer
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Direct bank-to-bank transfer (usually lower fees)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Direct bank transfer
                  </p>
                </div>
                <Switch
                  checked={settings.acceptACH}
                  onCheckedChange={(checked) =>
                    updateSetting("acceptACH", checked)
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Online Payments
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Let customers pay instantly through the customer portal
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customers can pay online through the portal
                </p>
              </div>
              <Switch
                checked={settings.acceptOnlinePayments}
                onCheckedChange={(checked) =>
                  updateSetting("acceptOnlinePayments", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Deposit
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Require customers to pay a percentage upfront before
                        work starts
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Ask for partial payment before starting work
                </p>
              </div>
              <Switch
                checked={settings.requireDepositEnabled}
                onCheckedChange={(checked) =>
                  updateSetting("requireDepositEnabled", checked)
                }
              />
            </div>

            {settings.requireDepositEnabled && (
              <div>
                <Label className="font-medium text-sm">
                  Deposit Percentage
                </Label>
                <div className="relative mt-2">
                  <Input
                    onChange={(e) =>
                      updateSetting(
                        "requireDepositPercent",
                        Number.parseInt(e.target.value, 10) || 50
                      )
                    }
                    placeholder="50"
                    type="number"
                    value={settings.requireDepositPercent}
                  />
                  <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                    %
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  Example: 50% of $1,000 invoice = $500 deposit required
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4" />
              Tax Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    How sales tax appears on your invoices
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Sales tax rate and how it appears on invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                        Your local sales tax percentage
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
                <p className="mt-1 text-muted-foreground text-xs">
                  Example: 8.5% tax on $100 = $8.50
                </p>
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
                        What to call the tax on invoices
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  className="mt-2"
                  onChange={(e) => updateSetting("taxLabel", e.target.value)}
                  placeholder="Sales Tax"
                  value={settings.taxLabel}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Example: "Sales Tax" or "GST"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Include Tax in Prices
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Show prices with tax already included (vs adding tax at
                        end)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Prices shown already include tax
                </p>
              </div>
              <Switch
                checked={settings.includeTaxInPrices}
                onCheckedChange={(checked) =>
                  updateSetting("includeTaxInPrices", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Show Tax Breakdown
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Show separate line for tax amount on invoice
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Display tax as separate line item
                </p>
              </div>
              <Switch
                checked={settings.showTaxBreakdown}
                onCheckedChange={(checked) =>
                  updateSetting("showTaxBreakdown", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Show Tax ID Number
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Display your business tax ID on invoices (required in
                        some states)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Display your tax ID number on invoices
                </p>
              </div>
              <Switch
                checked={settings.showTaxId}
                onCheckedChange={(checked) =>
                  updateSetting("showTaxId", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" />
              Invoice Appearance
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    What information appears on your invoice documents
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              What shows on the invoice document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Company Logo</Label>
                  <p className="text-muted-foreground text-xs">
                    Show logo at top
                  </p>
                </div>
                <Switch
                  checked={settings.showCompanyLogo}
                  onCheckedChange={(checked) =>
                    updateSetting("showCompanyLogo", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Item Descriptions
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Show what each item is
                  </p>
                </div>
                <Switch
                  checked={settings.showLineItemDescriptions}
                  onCheckedChange={(checked) =>
                    updateSetting("showLineItemDescriptions", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Quantities</Label>
                  <p className="text-muted-foreground text-xs">
                    Show how many of each item
                  </p>
                </div>
                <Switch
                  checked={settings.showItemQuantity}
                  onCheckedChange={(checked) =>
                    updateSetting("showItemQuantity", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Item Prices</Label>
                  <p className="text-muted-foreground text-xs">
                    Show price per item
                  </p>
                </div>
                <Switch
                  checked={settings.showItemPrice}
                  onCheckedChange={(checked) =>
                    updateSetting("showItemPrice", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Subtotal</Label>
                  <p className="text-muted-foreground text-xs">
                    Show total before tax
                  </p>
                </div>
                <Switch
                  checked={settings.showSubtotal}
                  onCheckedChange={(checked) =>
                    updateSetting("showSubtotal", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Discounts</Label>
                  <p className="text-muted-foreground text-xs">
                    Show any discounts applied
                  </p>
                </div>
                <Switch
                  checked={settings.showDiscounts}
                  onCheckedChange={(checked) =>
                    updateSetting("showDiscounts", checked)
                  }
                />
              </div>
            </div>

            <Separator />

            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Primary Color
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Main color used for headers and accents on invoice
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="mt-2 flex items-center gap-3">
                <Input
                  className="max-w-[200px]"
                  onChange={(e) =>
                    updateSetting("primaryColor", e.target.value)
                  }
                  placeholder="#3b82f6"
                  type="color"
                  value={settings.primaryColor}
                />
                <Badge variant="secondary">{settings.primaryColor}</Badge>
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                Color for headers and buttons on invoice
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Automatic Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Automatic Actions
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Things the system does automatically to help you get paid
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Automated reminders and follow-ups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-Send When Job Complete
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically email invoice to customer when you mark
                        job as complete
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Send invoice immediately when job is marked complete
                </p>
              </div>
              <Switch
                checked={settings.autoSendOnCompletion}
                onCheckedChange={(checked) =>
                  updateSetting("autoSendOnCompletion", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Send Payment Reminder
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Remind customer before invoice is due
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Friendly reminder before payment is due
                </p>
              </div>
              <Switch
                checked={settings.sendReminderBeforeDue}
                onCheckedChange={(checked) =>
                  updateSetting("sendReminderBeforeDue", checked)
                }
              />
            </div>

            {settings.sendReminderBeforeDue && (
              <div>
                <Label className="font-medium text-sm">
                  Send Reminder How Many Days Before Due Date?
                </Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting(
                      "reminderDaysBeforeDue",
                      Number.parseInt(e.target.value, 10) || 3
                    )
                  }
                  placeholder="3"
                  type="number"
                  value={settings.reminderDaysBeforeDue}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Example: Send reminder 3 days before payment is due
                </p>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Send Overdue Reminders
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically remind customer when payment is late
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Keep reminding customer until they pay
                </p>
              </div>
              <Switch
                checked={settings.sendOverdueReminders}
                onCheckedChange={(checked) =>
                  updateSetting("sendOverdueReminders", checked)
                }
              />
            </div>

            {settings.sendOverdueReminders && (
              <div>
                <Label className="font-medium text-sm">
                  Send Overdue Reminder Every How Many Days?
                </Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting(
                      "overdueReminderIntervalDays",
                      Number.parseInt(e.target.value, 10) || 7
                    )
                  }
                  placeholder="7"
                  type="number"
                  value={settings.overdueReminderIntervalDays}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Example: Send reminder every 7 days until paid
                </p>
              </div>
            )}

            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm">
                    Reminders Help You Get Paid Faster
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Studies show that automatic payment reminders can reduce
                    late payments by up to 60%. Most customers simply forget and
                    appreciate the friendly reminder.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4" />
              Custom Messages
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Personal messages that appear on invoices and emails
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Default messages on invoices and payment emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Invoice Terms & Conditions
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Legal terms that appear at bottom of every invoice
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                className="mt-2 min-h-[100px] resize-none"
                onChange={(e) =>
                  updateSetting("defaultInvoiceTerms", e.target.value)
                }
                placeholder="Payment is due within 30 days..."
                value={settings.defaultInvoiceTerms}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                {settings.defaultInvoiceTerms.length} / {MAX_TERMS_LENGTH}{" "}
                characters
              </p>
            </div>

            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Invoice Footer
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Short message at very bottom of invoice
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                className="mt-2 min-h-[80px] resize-none"
                onChange={(e) =>
                  updateSetting("defaultInvoiceFooter", e.target.value)
                }
                placeholder="Thank you for your business!"
                value={settings.defaultInvoiceFooter}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                {settings.defaultInvoiceFooter.length} / {MAX_FOOTER_LENGTH}{" "}
                characters
              </p>
            </div>

            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Payment Thank You Message
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Email sent automatically when customer pays
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                className="mt-2 min-h-[80px] resize-none"
                onChange={(e) =>
                  updateSetting("thankYouMessage", e.target.value)
                }
                placeholder="We appreciate your prompt payment..."
                value={settings.thankYouMessage}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                Sent when customer completes payment
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button disabled={isSubmitting} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={handleSave}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Invoice Settings
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
