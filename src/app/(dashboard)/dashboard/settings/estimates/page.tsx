"use client";

/**
 * Settings > Estimates Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  Calendar,
  CheckCircle2,
  FileText,
  Hash,
  HelpCircle,
  Loader2,
  Mail,
  Palette,
  Save,
  Settings,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import {
  getEstimateSettings,
  updateEstimateSettings,
} from "@/actions/settings";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Constants
const SIMULATED_API_DELAY = 1500;
const DEFAULT_ESTIMATE_PREFIX = "EST";
const DEFAULT_NEXT_NUMBER = 2001;
const MAX_TERMS_LENGTH = 500;
const MAX_FOOTER_LENGTH = 300;

type EstimateSettings = {
  // Estimate Numbering
  autoGenerateNumbers: boolean;
  estimatePrefix: string;
  nextEstimateNumber: number;
  includeYearInNumber: boolean;
  resetNumberYearly: boolean;

  // Estimate Validity
  defaultValidityDays: number;
  showExpirationDate: boolean;
  autoExpireEstimates: boolean;
  sendExpirationReminder: boolean;
  reminderDaysBeforeExpiration: number;

  // Approval Workflow
  requireCustomerApproval: boolean;
  allowOnlineApproval: boolean;
  requireSignature: boolean;
  requireApprovalDeposit: boolean;
  approvalDepositPercent: number;
  autoConvertToInvoice: boolean;

  // Estimate Appearance
  showCompanyLogo: boolean;
  primaryColor: string;
  showLineItemDescriptions: boolean;
  showItemQuantity: boolean;
  showItemPrice: boolean;
  showSubtotal: boolean;
  showTaxBreakdown: boolean;
  showDiscounts: boolean;
  showOptionalItems: boolean;

  // Pricing Options
  allowMultiplePriceOptions: boolean;
  showGoodBetterBest: boolean;
  highlightRecommendedOption: boolean;
  showSavingsOnPackages: boolean;

  // Follow-up Settings
  autoSendFollowup: boolean;
  followupIntervalDays: number;
  maxFollowupAttempts: number;
  notifyOnCustomerView: boolean;
  trackEstimateViews: boolean;

  // Custom Messages
  defaultEstimateTerms: string;
  defaultEstimateFooter: string;
  approvalThankYouMessage: string;
};

export default function EstimatesSettingsPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<EstimateSettings>({
    // Estimate Numbering
    autoGenerateNumbers: true,
    estimatePrefix: DEFAULT_ESTIMATE_PREFIX,
    nextEstimateNumber: DEFAULT_NEXT_NUMBER,
    includeYearInNumber: true,
    resetNumberYearly: false,

    // Estimate Validity
    defaultValidityDays: 30,
    showExpirationDate: true,
    autoExpireEstimates: true,
    sendExpirationReminder: true,
    reminderDaysBeforeExpiration: 3,

    // Approval Workflow
    requireCustomerApproval: true,
    allowOnlineApproval: true,
    requireSignature: true,
    requireApprovalDeposit: false,
    approvalDepositPercent: 25,
    autoConvertToInvoice: true,

    // Estimate Appearance
    showCompanyLogo: true,
    primaryColor: "#10b981",
    showLineItemDescriptions: true,
    showItemQuantity: true,
    showItemPrice: true,
    showSubtotal: true,
    showTaxBreakdown: true,
    showDiscounts: true,
    showOptionalItems: true,

    // Pricing Options
    allowMultiplePriceOptions: true,
    showGoodBetterBest: true,
    highlightRecommendedOption: true,
    showSavingsOnPackages: true,

    // Follow-up Settings
    autoSendFollowup: true,
    followupIntervalDays: 7,
    maxFollowupAttempts: 3,
    notifyOnCustomerView: true,
    trackEstimateViews: true,

    // Custom Messages
    defaultEstimateTerms:
      "This estimate is valid for 30 days. Prices are subject to change after expiration date.",
    defaultEstimateFooter:
      "We look forward to working with you! Please let us know if you have any questions.",
    approvalThankYouMessage:
      "Thank you for approving this estimate! We'll get started on your project right away.",
  });

  // Load settings from database on mount
  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      try {
        const result = await getEstimateSettings();

        if (result.success && result.data) {
          setSettings((prev) => ({
            ...prev,
            estimatePrefix: result.data.estimate_number_prefix || "EST",
            nextEstimateNumber: result.data.next_estimate_number || 1,
            defaultValidityDays: result.data.default_valid_for_days || 30,
            showExpirationDate: result.data.show_expiry_date ?? true,
            defaultEstimateTerms: result.data.default_terms || "",
            requireCustomerApproval: result.data.require_approval ?? false,
            autoConvertToInvoice: result.data.auto_convert_to_job ?? false,
            sendExpirationReminder: result.data.send_reminder_enabled ?? true,
            reminderDaysBeforeExpiration:
              result.data.reminder_days_before_expiry ?? 7,
          }));
        }
      } catch (error) {
        toast.error("Failed to load estimate settings");
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, [toast]);

  const updateSetting = <K extends keyof EstimateSettings>(
    key: K,
    value: EstimateSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getEstimateNumberExample = () => {
    const year = new Date().getFullYear();
    const prefix = settings.estimatePrefix || DEFAULT_ESTIMATE_PREFIX;
    const number = settings.nextEstimateNumber;

    if (settings.includeYearInNumber) {
      return `${prefix}-${year}-${number.toString().padStart(5, "0")}`;
    }
    return `${prefix}-${number.toString().padStart(5, "0")}`;
  };

  async function handleSave() {
    startTransition(async () => {
      const formData = new FormData();

      formData.append("estimateNumberPrefix", settings.estimatePrefix);
      formData.append(
        "nextEstimateNumber",
        settings.nextEstimateNumber.toString()
      );
      formData.append(
        "defaultValidForDays",
        settings.defaultValidityDays.toString()
      );
      formData.append("showExpiryDate", settings.showExpirationDate.toString());
      formData.append("includeTermsAndConditions", "true");
      formData.append("defaultTerms", settings.defaultEstimateTerms);
      formData.append(
        "requireApproval",
        settings.requireCustomerApproval.toString()
      );
      formData.append(
        "autoConvertToJob",
        settings.autoConvertToInvoice.toString()
      );
      formData.append(
        "sendReminderEnabled",
        settings.sendExpirationReminder.toString()
      );
      formData.append(
        "reminderDaysBeforeExpiry",
        settings.reminderDaysBeforeExpiration.toString()
      );

      const result = await updateEstimateSettings(formData);

      if (result.success) {
        toast.success("Estimate settings saved successfully");
      } else {
        toast.error(result.error || "Failed to save estimate settings");
      }
    });
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-bold text-4xl tracking-tight">
            Price Quote Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure how your price quotes work and look
          </p>
        </div>

        <Separator />

        {/* Estimate Numbering */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Hash className="size-4" />
              Quote Numbering
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Control how quote numbers are generated automatically
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              How quote numbers are created for each new estimate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-Generate Quote Numbers
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically create the next quote number when you
                        create a new estimate
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  System creates quote numbers automatically (recommended)
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
                  Quote Prefix
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Letters that appear at the start of every quote number
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  className="mt-2"
                  disabled={!settings.autoGenerateNumbers}
                  onChange={(e) =>
                    updateSetting(
                      "estimatePrefix",
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="EST"
                  value={settings.estimatePrefix}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Example: "EST" for Estimate or "QUOTE"
                </p>
              </div>

              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Next Quote Number
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        The number that will be used for your next quote
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  className="mt-2"
                  disabled={!settings.autoGenerateNumbers}
                  onChange={(e) =>
                    updateSetting(
                      "nextEstimateNumber",
                      Number.parseInt(e.target.value, 10) || DEFAULT_NEXT_NUMBER
                    )
                  }
                  placeholder="2001"
                  type="number"
                  value={settings.nextEstimateNumber}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Starting point for numbering
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Include Year in Quote Number
                </Label>
                <p className="text-muted-foreground text-xs">
                  Adds the current year to quote numbers
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
                    Next quote will be:
                  </span>
                  <Badge className="font-mono" variant="secondary">
                    {getEstimateNumberExample()}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quote Validity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="size-4" />
              Quote Validity
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    How long quotes are valid before they expire
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              How long quotes stay valid before expiring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Quote Valid For How Many Days?
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Number of days before quote prices expire
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                className="mt-2"
                onChange={(e) =>
                  updateSetting(
                    "defaultValidityDays",
                    Number.parseInt(e.target.value, 10) || 30
                  )
                }
                placeholder="30"
                type="number"
                value={settings.defaultValidityDays}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                Example: After 30 days, customer needs a new quote
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Show Expiration Date on Quote
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Display when quote expires to create urgency
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Shows "Valid until [date]" on quote
                </p>
              </div>
              <Switch
                checked={settings.showExpirationDate}
                onCheckedChange={(checked) =>
                  updateSetting("showExpirationDate", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-Expire Old Quotes
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically mark quotes as expired after validity
                        period
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  System marks quotes expired automatically
                </p>
              </div>
              <Switch
                checked={settings.autoExpireEstimates}
                onCheckedChange={(checked) =>
                  updateSetting("autoExpireEstimates", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Send Expiration Reminder
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Remind customer before quote expires to encourage
                        decision
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Remind customer before quote expires
                </p>
              </div>
              <Switch
                checked={settings.sendExpirationReminder}
                onCheckedChange={(checked) =>
                  updateSetting("sendExpirationReminder", checked)
                }
              />
            </div>

            {settings.sendExpirationReminder && (
              <div>
                <Label className="font-medium text-sm">
                  Send Reminder How Many Days Before Expiration?
                </Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting(
                      "reminderDaysBeforeExpiration",
                      Number.parseInt(e.target.value, 10) || 3
                    )
                  }
                  placeholder="3"
                  type="number"
                  value={settings.reminderDaysBeforeExpiration}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Example: Remind customer 3 days before quote expires
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approval Workflow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="size-4" />
              Customer Approval
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    How customers accept your quotes and what happens next
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              How customers approve quotes and what happens next
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Customer Approval
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Customer must approve before you can start work
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customer must approve quote before work begins
                </p>
              </div>
              <Switch
                checked={settings.requireCustomerApproval}
                onCheckedChange={(checked) =>
                  updateSetting("requireCustomerApproval", checked)
                }
              />
            </div>

            {settings.requireCustomerApproval && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Allow Online Approval
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Customer can approve quote online with one click
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Customer can approve quote through customer portal
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowOnlineApproval}
                    onCheckedChange={(checked) =>
                      updateSetting("allowOnlineApproval", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Require Digital Signature
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Customer must sign quote with finger or mouse
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Customer draws signature to approve
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireSignature}
                    disabled={!settings.allowOnlineApproval}
                    onCheckedChange={(checked) =>
                      updateSetting("requireSignature", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Require Deposit on Approval
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Customer must pay deposit when they approve quote
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Customer pays deposit to approve quote
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireApprovalDeposit}
                    onCheckedChange={(checked) =>
                      updateSetting("requireApprovalDeposit", checked)
                    }
                  />
                </div>

                {settings.requireApprovalDeposit && (
                  <div>
                    <Label className="font-medium text-sm">
                      Deposit Percentage
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        onChange={(e) =>
                          updateSetting(
                            "approvalDepositPercent",
                            Number.parseInt(e.target.value, 10) || 25
                          )
                        }
                        placeholder="25"
                        type="number"
                        value={settings.approvalDepositPercent}
                      />
                      <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                        %
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground text-xs">
                      Example: 25% of $1,000 quote = $250 deposit
                    </p>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Auto-Convert to Invoice
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Automatically create invoice when quote is approved
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Create invoice automatically when approved
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoConvertToInvoice}
                    onCheckedChange={(checked) =>
                      updateSetting("autoConvertToInvoice", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pricing Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4" />
              Pricing Options
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Give customers multiple price options to choose from
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Offer multiple pricing tiers to increase sales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Multiple Price Options
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Let customers choose between different service levels
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Give customers choices (increases average sale by 35%)
                </p>
              </div>
              <Switch
                checked={settings.allowMultiplePriceOptions}
                onCheckedChange={(checked) =>
                  updateSetting("allowMultiplePriceOptions", checked)
                }
              />
            </div>

            {settings.allowMultiplePriceOptions && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Show Good / Better / Best Pricing
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Three tiers: Basic option, Mid-tier option, Premium
                            option
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Three pricing tiers: Basic, Standard, Premium
                    </p>
                  </div>
                  <Switch
                    checked={settings.showGoodBetterBest}
                    onCheckedChange={(checked) =>
                      updateSetting("showGoodBetterBest", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Highlight Recommended Option
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Mark one option as "Most Popular" or "Best Value"
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Mark one option as "Recommended"
                    </p>
                  </div>
                  <Switch
                    checked={settings.highlightRecommendedOption}
                    onCheckedChange={(checked) =>
                      updateSetting("highlightRecommendedOption", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Show Optional Add-ons
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Let customers add extra items to base quote
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Show optional extras customer can add
                    </p>
                  </div>
                  <Switch
                    checked={settings.showOptionalItems}
                    onCheckedChange={(checked) =>
                      updateSetting("showOptionalItems", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Show Savings on Packages
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Display "Save $X" or "20% off" on package deals
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Show how much customer saves with packages
                    </p>
                  </div>
                  <Switch
                    checked={settings.showSavingsOnPackages}
                    onCheckedChange={(checked) =>
                      updateSetting("showSavingsOnPackages", checked)
                    }
                  />
                </div>
              </>
            )}

            <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm">
                    Multiple Options Increase Sales
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Businesses that offer 3 pricing options close 35% more
                    quotes and have 22% higher average order values. Customers
                    prefer having choices!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Follow-up Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="size-4" />
              Follow-up Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Automatic reminders to customers who haven't responded
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Automated follow-ups for pending quotes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-Send Follow-ups
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically follow up if customer hasn't responded
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Remind customer if they haven't responded
                </p>
              </div>
              <Switch
                checked={settings.autoSendFollowup}
                onCheckedChange={(checked) =>
                  updateSetting("autoSendFollowup", checked)
                }
              />
            </div>

            {settings.autoSendFollowup && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="font-medium text-sm">
                    Follow-up Every How Many Days?
                  </Label>
                  <Input
                    className="mt-2"
                    onChange={(e) =>
                      updateSetting(
                        "followupIntervalDays",
                        Number.parseInt(e.target.value, 10) || 7
                      )
                    }
                    placeholder="7"
                    type="number"
                    value={settings.followupIntervalDays}
                  />
                  <p className="mt-1 text-muted-foreground text-xs">
                    Days between follow-up emails
                  </p>
                </div>

                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Maximum Follow-up Attempts
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Stop following up after this many tries
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    className="mt-2"
                    onChange={(e) =>
                      updateSetting(
                        "maxFollowupAttempts",
                        Number.parseInt(e.target.value, 10) || 3
                      )
                    }
                    placeholder="3"
                    type="number"
                    value={settings.maxFollowupAttempts}
                  />
                  <p className="mt-1 text-muted-foreground text-xs">
                    Stop after this many follow-ups
                  </p>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Track Quote Views
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Know when customer opens and views quote
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Track when customer opens quote
                </p>
              </div>
              <Switch
                checked={settings.trackEstimateViews}
                onCheckedChange={(checked) =>
                  updateSetting("trackEstimateViews", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Notify Me When Viewed
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Get notified when customer views quote (good time to
                        call!)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Get alert when customer views quote
                </p>
              </div>
              <Switch
                checked={settings.notifyOnCustomerView}
                disabled={!settings.trackEstimateViews}
                onCheckedChange={(checked) =>
                  updateSetting("notifyOnCustomerView", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Quote Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="size-4" />
              Quote Appearance
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    What information appears on your quote documents
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>What shows on the quote document</CardDescription>
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
                  <Label className="font-medium text-sm">Tax Breakdown</Label>
                  <p className="text-muted-foreground text-xs">
                    Show tax separately
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
                      Main color used for headers and accents on quote
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
                  placeholder="#10b981"
                  type="color"
                  value={settings.primaryColor}
                />
                <Badge variant="secondary">{settings.primaryColor}</Badge>
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                Color for headers and buttons on quote
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="size-4" />
              Custom Messages
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Personal messages that appear on quotes and emails
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Default messages on quotes and approval emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Quote Terms & Conditions
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Legal terms that appear at bottom of every quote
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                className="mt-2 min-h-[100px] resize-none"
                onChange={(e) =>
                  updateSetting("defaultEstimateTerms", e.target.value)
                }
                placeholder="This estimate is valid for 30 days..."
                value={settings.defaultEstimateTerms}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                {settings.defaultEstimateTerms.length} / {MAX_TERMS_LENGTH}{" "}
                characters
              </p>
            </div>

            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Quote Footer
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Short message at very bottom of quote
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                className="mt-2 min-h-[80px] resize-none"
                onChange={(e) =>
                  updateSetting("defaultEstimateFooter", e.target.value)
                }
                placeholder="We look forward to working with you!"
                value={settings.defaultEstimateFooter}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                {settings.defaultEstimateFooter.length} / {MAX_FOOTER_LENGTH}{" "}
                characters
              </p>
            </div>

            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Approval Thank You Message
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Email sent automatically when customer approves quote
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                className="mt-2 min-h-[80px] resize-none"
                onChange={(e) =>
                  updateSetting("approvalThankYouMessage", e.target.value)
                }
                placeholder="Thank you for approving this estimate..."
                value={settings.approvalThankYouMessage}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                Sent when customer approves quote
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button disabled={isPending} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isPending} onClick={handleSave}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Quote Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
