"use client";

/**
 * Settings > Customers > Privacy Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { HelpCircle, Loader2, Lock, Save, Shield, Trash2 } from "lucide-react";
import { getPrivacySettings, updatePrivacySettings } from "@/actions/settings";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettings } from "@/hooks/use-settings";
export default function PrivacyConsentPage() {
  const {
    settings,
    isLoading,
    isPending,
    hasUnsavedChanges,
    updateSetting,
    saveSettings,
  } = useSettings({
    getter: getPrivacySettings,
    setter: updatePrivacySettings,
    initialState: {
      requirePrivacyConsent: true,
      requireMarketingConsent: false,
      consentMethod: "checkbox",
      showConsentOnBooking: true,
      showConsentOnPortal: true,
      allowConsentWithdrawal: true,
      sendConsentConfirmation: true,
      trackConsentChanges: true,
      dataRetentionDays: 2555,
      deleteInactiveCustomers: false,
      inactivityPeriodDays: 730,
      anonymizeInsteadOfDelete: true,
      requireDeletionApproval: true,
      sendDeletionNotification: true,
      allowDataExport: true,
      exportFormat: "pdf",
      includeJobHistory: true,
      includePaymentHistory: true,
      includeDocuments: true,
      maskSensitiveData: true,
      maskCreditCards: true,
      maskSSN: true,
      logDataAccess: true,
      requireReasonForAccess: false,
      notifyCustomerOfAccess: false,
      enableGDPRCompliance: true,
      enableCCPACompliance: true,
      dataProtectionOfficer: "",
      dpoEmail: "",
      privacyPolicyUrl: "",
      termsOfServiceUrl: "",
    },
    settingsName: "privacy",
    transformLoad: (data) => ({
      dataRetentionDays: data.data_retention_years
        ? data.data_retention_years * 365
        : 2555,
      deleteInactiveCustomers: data.auto_delete_inactive_customers ?? false,
      inactivityPeriodDays: data.inactive_threshold_years
        ? data.inactive_threshold_years * 365
        : 730,
      requireMarketingConsent: data.require_marketing_consent ?? true,
      requirePrivacyConsent: data.require_data_processing_consent ?? true,
      privacyPolicyUrl: data.privacy_policy_url || "",
      termsOfServiceUrl: data.terms_of_service_url || "",
      allowDataExport: data.enable_data_export ?? true,
      enableGDPRCompliance: data.enable_right_to_deletion ?? true,
    }),
    transformSave: (settings) => {
      const formData = new FormData();
      formData.append(
        "dataRetentionYears",
        Math.floor(settings.dataRetentionDays / 365).toString()
      );
      formData.append(
        "autoDeleteInactiveCustomers",
        settings.deleteInactiveCustomers.toString()
      );
      formData.append(
        "inactiveThresholdYears",
        Math.floor(settings.inactivityPeriodDays / 365).toString()
      );
      formData.append(
        "requireMarketingConsent",
        settings.requireMarketingConsent.toString()
      );
      formData.append(
        "requireDataProcessingConsent",
        settings.requirePrivacyConsent.toString()
      );
      formData.append("privacyPolicyUrl", settings.privacyPolicyUrl);
      formData.append("termsOfServiceUrl", settings.termsOfServiceUrl);
      formData.append(
        "enableRightToDeletion",
        settings.enableGDPRCompliance.toString()
      );
      formData.append("enableDataExport", settings.allowDataExport.toString());
      return formData;
    },
  });

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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-4xl tracking-tight">
              Privacy & Consent
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure data privacy, GDPR compliance, and customer consent
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button disabled={isPending} onClick={() => saveSettings()}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>

        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div className="space-y-1">
              <p className="font-medium text-sm text-warning dark:text-warning">
                Legal Compliance Notice
              </p>
              <p className="text-muted-foreground text-sm">
                These settings help with GDPR and CCPA compliance but do not
                guarantee legal compliance. Consult with legal counsel to ensure
                your privacy practices meet all applicable regulations.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="size-4" />
              Customer Consent
            </CardTitle>
            <CardDescription>
              Manage how you collect and track customer consent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Privacy Policy Consent
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Require customers to accept privacy policy
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customers must accept before booking
                </p>
              </div>
              <Switch
                checked={settings.requirePrivacyConsent}
                onCheckedChange={(checked) =>
                  updateSetting("requirePrivacyConsent", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Marketing Consent
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Separate consent for marketing communications
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Separate opt-in for promotional emails
                </p>
              </div>
              <Switch
                checked={settings.requireMarketingConsent}
                onCheckedChange={(checked) =>
                  updateSetting("requireMarketingConsent", checked)
                }
              />
            </div>

            <Separator />

            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Consent Method
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">How consent is collected</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Select
                onValueChange={(value) => updateSetting("consentMethod", value)}
                value={settings.consentMethod}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="signature">Digital Signature</SelectItem>
                  <SelectItem value="both">Both Required</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Show Consent on Booking
                </Label>
                <p className="text-muted-foreground text-xs">
                  Display consent options during booking
                </p>
              </div>
              <Switch
                checked={settings.showConsentOnBooking}
                onCheckedChange={(checked) =>
                  updateSetting("showConsentOnBooking", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Show Consent in Portal
                </Label>
                <p className="text-muted-foreground text-xs">
                  Allow customers to manage consent in portal
                </p>
              </div>
              <Switch
                checked={settings.showConsentOnPortal}
                onCheckedChange={(checked) =>
                  updateSetting("showConsentOnPortal", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Allow Consent Withdrawal
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customers can withdraw consent at any time
                </p>
              </div>
              <Switch
                checked={settings.allowConsentWithdrawal}
                onCheckedChange={(checked) =>
                  updateSetting("allowConsentWithdrawal", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Send Consent Confirmation
                </Label>
                <p className="text-muted-foreground text-xs">
                  Email confirmation when consent is given/withdrawn
                </p>
              </div>
              <Switch
                checked={settings.sendConsentConfirmation}
                onCheckedChange={(checked) =>
                  updateSetting("sendConsentConfirmation", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Track Consent Changes
                </Label>
                <p className="text-muted-foreground text-xs">
                  Log all consent changes with timestamps
                </p>
              </div>
              <Switch
                checked={settings.trackConsentChanges}
                onCheckedChange={(checked) =>
                  updateSetting("trackConsentChanges", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trash2 className="size-4" />
              Data Retention & Deletion
            </CardTitle>
            <CardDescription>
              Configure data retention policies and deletion rules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Data Retention Period
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      How long to keep customer data (7 years = 2555 days)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  className="w-32"
                  min="30"
                  onChange={(e) =>
                    updateSetting("dataRetentionDays", Number(e.target.value))
                  }
                  type="number"
                  value={settings.dataRetentionDays}
                />
                <span className="text-muted-foreground text-sm">
                  days ({Math.round(settings.dataRetentionDays / 365)} years)
                </span>
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                Recommended: 7 years for tax and legal purposes
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-Delete Inactive Customers
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically delete customers with no activity
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Remove customers after inactivity period
                </p>
              </div>
              <Switch
                checked={settings.deleteInactiveCustomers}
                onCheckedChange={(checked) =>
                  updateSetting("deleteInactiveCustomers", checked)
                }
              />
            </div>

            {settings.deleteInactiveCustomers && (
              <div>
                <Label className="text-sm">Inactivity Period</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    className="w-32"
                    min="30"
                    onChange={(e) =>
                      updateSetting(
                        "inactivityPeriodDays",
                        Number(e.target.value)
                      )
                    }
                    type="number"
                    value={settings.inactivityPeriodDays}
                  />
                  <span className="text-muted-foreground text-sm">
                    days ({Math.round(settings.inactivityPeriodDays / 365)}{" "}
                    years)
                  </span>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Anonymize Instead of Delete
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Remove personal data but keep statistical records
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Keep anonymized data for reporting
                </p>
              </div>
              <Switch
                checked={settings.anonymizeInsteadOfDelete}
                onCheckedChange={(checked) =>
                  updateSetting("anonymizeInsteadOfDelete", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Require Deletion Approval
                </Label>
                <p className="text-muted-foreground text-xs">
                  Manager must approve data deletion requests
                </p>
              </div>
              <Switch
                checked={settings.requireDeletionApproval}
                onCheckedChange={(checked) =>
                  updateSetting("requireDeletionApproval", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Send Deletion Notification
                </Label>
                <p className="text-muted-foreground text-xs">
                  Notify customer when data is deleted
                </p>
              </div>
              <Switch
                checked={settings.sendDeletionNotification}
                onCheckedChange={(checked) =>
                  updateSetting("sendDeletionNotification", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Export & Portability</CardTitle>
            <CardDescription>
              Allow customers to export their data (GDPR Article 20)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Customer Data Export
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Let customers download their data
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customers can download their data
                </p>
              </div>
              <Switch
                checked={settings.allowDataExport}
                onCheckedChange={(checked) =>
                  updateSetting("allowDataExport", checked)
                }
              />
            </div>

            {settings.allowDataExport && (
              <>
                <Separator />

                <div>
                  <Label className="font-medium text-sm">Export Format</Label>
                  <Select
                    onValueChange={(value) =>
                      updateSetting("exportFormat", value)
                    }
                    value={settings.exportFormat}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                      <SelectItem value="all">All Formats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="font-medium text-sm">
                    Include in Export:
                  </Label>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Job History</Label>
                    <Switch
                      checked={settings.includeJobHistory}
                      onCheckedChange={(checked) =>
                        updateSetting("includeJobHistory", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Payment History</Label>
                    <Switch
                      checked={settings.includePaymentHistory}
                      onCheckedChange={(checked) =>
                        updateSetting("includePaymentHistory", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Uploaded Documents</Label>
                    <Switch
                      checked={settings.includeDocuments}
                      onCheckedChange={(checked) =>
                        updateSetting("includeDocuments", checked)
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
            <CardDescription>
              Configure data masking and access logging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Mask Sensitive Data
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Hide sensitive data in user interface
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Partially hide sensitive information
                </p>
              </div>
              <Switch
                checked={settings.maskSensitiveData}
                onCheckedChange={(checked) =>
                  updateSetting("maskSensitiveData", checked)
                }
              />
            </div>

            {settings.maskSensitiveData && (
              <div className="ml-6 space-y-3 border-l-2 pl-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Mask Credit Card Numbers</Label>
                  <Switch
                    checked={settings.maskCreditCards}
                    onCheckedChange={(checked) =>
                      updateSetting("maskCreditCards", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Mask SSN/Tax ID</Label>
                  <Switch
                    checked={settings.maskSSN}
                    onCheckedChange={(checked) =>
                      updateSetting("maskSSN", checked)
                    }
                  />
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Log Data Access
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Track who accesses customer data
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Track who views customer records
                </p>
              </div>
              <Switch
                checked={settings.logDataAccess}
                onCheckedChange={(checked) =>
                  updateSetting("logDataAccess", checked)
                }
              />
            </div>

            {settings.logDataAccess && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-sm">Require Reason for Access</Label>
                    <p className="text-muted-foreground text-xs">
                      Staff must specify reason when viewing data
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireReasonForAccess}
                    onCheckedChange={(checked) =>
                      updateSetting("requireReasonForAccess", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-sm">Notify Customer of Access</Label>
                    <p className="text-muted-foreground text-xs">
                      Email customer when data is accessed
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifyCustomerOfAccess}
                    onCheckedChange={(checked) =>
                      updateSetting("notifyCustomerOfAccess", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Settings</CardTitle>
            <CardDescription>
              Configure GDPR, CCPA, and other privacy regulations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable GDPR Compliance
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        EU General Data Protection Regulation
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Enable GDPR features and requirements
                </p>
              </div>
              <Switch
                checked={settings.enableGDPRCompliance}
                onCheckedChange={(checked) =>
                  updateSetting("enableGDPRCompliance", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable CCPA Compliance
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        California Consumer Privacy Act
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Enable CCPA features and requirements
                </p>
              </div>
              <Switch
                checked={settings.enableCCPACompliance}
                onCheckedChange={(checked) =>
                  updateSetting("enableCCPACompliance", checked)
                }
              />
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="font-medium text-sm">
                  Data Protection Officer
                </Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting("dataProtectionOfficer", e.target.value)
                  }
                  placeholder="John Doe"
                  value={settings.dataProtectionOfficer}
                />
              </div>

              <div>
                <Label className="font-medium text-sm">DPO Email Address</Label>
                <Input
                  className="mt-2"
                  onChange={(e) => updateSetting("dpoEmail", e.target.value)}
                  placeholder="dpo@company.com"
                  type="email"
                  value={settings.dpoEmail}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Privacy Policy URL
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Link to your privacy policy document
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting("privacyPolicyUrl", e.target.value)
                  }
                  placeholder="https://company.com/privacy"
                  type="url"
                  value={settings.privacyPolicyUrl}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Terms of Service URL
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Link to your terms of service document
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting("termsOfServiceUrl", e.target.value)
                  }
                  placeholder="https://company.com/terms"
                  type="url"
                  value={settings.termsOfServiceUrl}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
