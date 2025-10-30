"use client";

/**
 * Settings > Customers > Preferences Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { HelpCircle, Save, UserCircle } from "lucide-react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default function CustomerPreferencesPage() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    requireCustomerApproval: true,
    allowCustomerNotes: true,
    allowCustomerDocuments: true,
    maxDocumentSize: 10,
    allowedDocumentTypes: ".pdf,.jpg,.png",
    requirePhoneNumber: true,
    requireEmailAddress: true,
    requireBillingAddress: true,
    requireServiceAddress: false,
    allowSameAddressForBilling: true,
    customerNumberFormat: "auto",
    customerNumberPrefix: "CUST",
    customerNumberStarting: 1000,
    allowDuplicateCustomers: false,
    mergeDuplicatesAutomatically: false,
    matchCriteria: "email",
    trackCustomerHistory: true,
    historyRetentionDays: 365,
    allowCustomerFeedback: true,
    sendFeedbackRequestAfterJob: true,
    feedbackRequestDelay: 24,
    allowAnonymousFeedback: false,
    displayCustomerSince: true,
    displayLifetimeValue: true,
    displayJobCount: true,
    displayLastServiceDate: true,
  });

  const updateSetting = (key: string, value: string | boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Customer Preferences
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure customer account settings and requirements
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserCircle className="h-4 w-4" />
              Customer Account Requirements
            </CardTitle>
            <CardDescription>
              Set required fields for customer accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Require Phone Number
                </Label>
                <p className="text-muted-foreground text-xs">
                  Make phone number mandatory
                </p>
              </div>
              <Switch
                checked={settings.requirePhoneNumber}
                onCheckedChange={(checked) =>
                  updateSetting("requirePhoneNumber", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Require Email Address
                </Label>
                <p className="text-muted-foreground text-xs">
                  Make email address mandatory
                </p>
              </div>
              <Switch
                checked={settings.requireEmailAddress}
                onCheckedChange={(checked) =>
                  updateSetting("requireEmailAddress", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Require Billing Address
                </Label>
                <p className="text-muted-foreground text-xs">
                  Make billing address mandatory
                </p>
              </div>
              <Switch
                checked={settings.requireBillingAddress}
                onCheckedChange={(checked) =>
                  updateSetting("requireBillingAddress", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Require Service Address
                </Label>
                <p className="text-muted-foreground text-xs">
                  Make service address mandatory
                </p>
              </div>
              <Switch
                checked={settings.requireServiceAddress}
                onCheckedChange={(checked) =>
                  updateSetting("requireServiceAddress", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Same Address For Billing
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Allow using service address as billing address
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Option to use same address for both
                </p>
              </div>
              <Switch
                checked={settings.allowSameAddressForBilling}
                onCheckedChange={(checked) =>
                  updateSetting("allowSameAddressForBilling", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Numbering</CardTitle>
            <CardDescription>
              Configure customer ID format and numbering
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Number Format
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      How customer numbers are generated
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Select
                onValueChange={(value) =>
                  updateSetting("customerNumberFormat", value)
                }
                value={settings.customerNumberFormat}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-Increment</SelectItem>
                  <SelectItem value="prefix">Prefix + Number</SelectItem>
                  <SelectItem value="date">Date-Based</SelectItem>
                  <SelectItem value="manual">Manual Entry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.customerNumberFormat === "prefix" && (
              <>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="font-medium text-sm">Prefix</Label>
                    <Input
                      className="mt-2"
                      onChange={(e) =>
                        updateSetting("customerNumberPrefix", e.target.value)
                      }
                      placeholder="CUST"
                      value={settings.customerNumberPrefix}
                    />
                    <p className="mt-1 text-muted-foreground text-xs">
                      Example: CUST-1000
                    </p>
                  </div>

                  <div>
                    <Label className="font-medium text-sm">
                      Starting Number
                    </Label>
                    <Input
                      className="mt-2"
                      min="1"
                      onChange={(e) =>
                        updateSetting(
                          "customerNumberStarting",
                          Number(e.target.value)
                        )
                      }
                      type="number"
                      value={settings.customerNumberStarting}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Duplicate Detection</CardTitle>
            <CardDescription>
              Prevent and manage duplicate customer records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Duplicate Customers
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Allow creating customer with same contact info
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Warn when creating similar customers
                </p>
              </div>
              <Switch
                checked={settings.allowDuplicateCustomers}
                onCheckedChange={(checked) =>
                  updateSetting("allowDuplicateCustomers", checked)
                }
              />
            </div>

            {!settings.allowDuplicateCustomers && (
              <>
                <Separator />

                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Match Criteria
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Which field to use for duplicate detection
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      updateSetting("matchCriteria", value)
                    }
                    value={settings.matchCriteria}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Address</SelectItem>
                      <SelectItem value="phone">Phone Number</SelectItem>
                      <SelectItem value="both">Email or Phone</SelectItem>
                      <SelectItem value="name">Name + Address</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Merge Duplicates Automatically
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Automatically merge duplicate records when found
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Combine duplicate records into one
                    </p>
                  </div>
                  <Switch
                    checked={settings.mergeDuplicatesAutomatically}
                    onCheckedChange={(checked) =>
                      updateSetting("mergeDuplicatesAutomatically", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Data</CardTitle>
            <CardDescription>
              Configure customer notes, documents, and history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Allow Customer Notes
                </Label>
                <p className="text-muted-foreground text-xs">
                  Add notes to customer profiles
                </p>
              </div>
              <Switch
                checked={settings.allowCustomerNotes}
                onCheckedChange={(checked) =>
                  updateSetting("allowCustomerNotes", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Allow Customer Documents
                </Label>
                <p className="text-muted-foreground text-xs">
                  Upload files to customer profiles
                </p>
              </div>
              <Switch
                checked={settings.allowCustomerDocuments}
                onCheckedChange={(checked) =>
                  updateSetting("allowCustomerDocuments", checked)
                }
              />
            </div>

            {settings.allowCustomerDocuments && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="font-medium text-sm">
                    Max Document Size
                  </Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      className="w-24"
                      min="1"
                      onChange={(e) =>
                        updateSetting("maxDocumentSize", Number(e.target.value))
                      }
                      type="number"
                      value={settings.maxDocumentSize}
                    />
                    <span className="text-muted-foreground text-sm">MB</span>
                  </div>
                </div>

                <div>
                  <Label className="font-medium text-sm">
                    Allowed File Types
                  </Label>
                  <Input
                    className="mt-2"
                    onChange={(e) =>
                      updateSetting("allowedDocumentTypes", e.target.value)
                    }
                    placeholder=".pdf,.jpg,.png"
                    value={settings.allowedDocumentTypes}
                  />
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Track Customer History
                </Label>
                <p className="text-muted-foreground text-xs">
                  Record all customer interactions and changes
                </p>
              </div>
              <Switch
                checked={settings.trackCustomerHistory}
                onCheckedChange={(checked) =>
                  updateSetting("trackCustomerHistory", checked)
                }
              />
            </div>

            {settings.trackCustomerHistory && (
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  History Retention Period
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        How long to keep customer history records
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    className="w-24"
                    min="30"
                    onChange={(e) =>
                      updateSetting(
                        "historyRetentionDays",
                        Number(e.target.value)
                      )
                    }
                    type="number"
                    value={settings.historyRetentionDays}
                  />
                  <span className="text-muted-foreground text-sm">days</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Feedback</CardTitle>
            <CardDescription>
              Configure customer review and feedback requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Allow Customer Feedback
                </Label>
                <p className="text-muted-foreground text-xs">
                  Enable feedback and review system
                </p>
              </div>
              <Switch
                checked={settings.allowCustomerFeedback}
                onCheckedChange={(checked) =>
                  updateSetting("allowCustomerFeedback", checked)
                }
              />
            </div>

            {settings.allowCustomerFeedback && (
              <>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Send Request After Job Completion
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Automatically request feedback after jobs
                    </p>
                  </div>
                  <Switch
                    checked={settings.sendFeedbackRequestAfterJob}
                    onCheckedChange={(checked) =>
                      updateSetting("sendFeedbackRequestAfterJob", checked)
                    }
                  />
                </div>

                {settings.sendFeedbackRequestAfterJob && (
                  <div>
                    <Label className="font-medium text-sm">Request Delay</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        className="w-24"
                        min="0"
                        onChange={(e) =>
                          updateSetting(
                            "feedbackRequestDelay",
                            Number(e.target.value)
                          )
                        }
                        type="number"
                        value={settings.feedbackRequestDelay}
                      />
                      <span className="text-muted-foreground text-sm">
                        hours after job
                      </span>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Allow Anonymous Feedback
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Allow feedback without customer identification
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Accept feedback without customer login
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowAnonymousFeedback}
                    onCheckedChange={(checked) =>
                      updateSetting("allowAnonymousFeedback", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Profile Display</CardTitle>
            <CardDescription>
              Choose what information to show on customer profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Display Customer Since Date
                </Label>
                <p className="text-muted-foreground text-xs">
                  Show when customer was created
                </p>
              </div>
              <Switch
                checked={settings.displayCustomerSince}
                onCheckedChange={(checked) =>
                  updateSetting("displayCustomerSince", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Display Lifetime Value
                </Label>
                <p className="text-muted-foreground text-xs">
                  Show total revenue from customer
                </p>
              </div>
              <Switch
                checked={settings.displayLifetimeValue}
                onCheckedChange={(checked) =>
                  updateSetting("displayLifetimeValue", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">Display Job Count</Label>
                <p className="text-muted-foreground text-xs">
                  Show total number of jobs
                </p>
              </div>
              <Switch
                checked={settings.displayJobCount}
                onCheckedChange={(checked) =>
                  updateSetting("displayJobCount", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Display Last Service Date
                </Label>
                <p className="text-muted-foreground text-xs">
                  Show date of most recent job
                </p>
              </div>
              <Switch
                checked={settings.displayLastServiceDate}
                onCheckedChange={(checked) =>
                  updateSetting("displayLastServiceDate", checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
