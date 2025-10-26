"use client";

export const dynamic = "force-dynamic";

import {
  Building,
  FileText,
  HelpCircle,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserPlus,
  Users,
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { usePageLayout } from "@/hooks/use-page-layout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Constants
const SIMULATED_API_DELAY = 1500;
const MAX_CUSTOM_FIELDS = 20;

type CustomerIntakeSettings = {
  // Required Fields
  requireFirstName: boolean;
  requireLastName: boolean;
  requireEmail: boolean;
  requirePhone: boolean;
  requireAddress: boolean;
  requirePropertyType: boolean;

  // Optional Contact Fields
  collectSecondaryPhone: boolean;
  collectCompanyName: boolean;
  collectPreferredContactMethod: boolean;
  collectBestTimeToCall: boolean;

  // Property Details
  collectPropertyDetails: boolean;
  requirePropertyAccess: boolean;
  collectParkingInfo: boolean;
  collectPetInfo: boolean;

  // Communication Preferences
  sendWelcomeEmail: boolean;
  sendSMSConfirmation: boolean;
  collectMarketingPreferences: boolean;
  requireServiceAgreement: boolean;

  // Custom welcome message
  welcomeMessage: string;
  customIntakeInstructions: string;
};

type CustomField = {
  id: string;
  label: string;
  fieldType: "text" | "email" | "phone" | "select" | "textarea";
  required: boolean;
  enabled: boolean;
};

export default function CustomerIntakePage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<CustomerIntakeSettings>({
    // Required
    requireFirstName: true,
    requireLastName: true,
    requireEmail: true,
    requirePhone: true,
    requireAddress: true,
    requirePropertyType: false,

    // Optional Contact
    collectSecondaryPhone: true,
    collectCompanyName: true,
    collectPreferredContactMethod: true,
    collectBestTimeToCall: true,

    // Property
    collectPropertyDetails: true,
    requirePropertyAccess: true,
    collectParkingInfo: true,
    collectPetInfo: true,

    // Communication
    sendWelcomeEmail: true,
    sendSMSConfirmation: true,
    collectMarketingPreferences: true,
    requireServiceAgreement: false,

    welcomeMessage:
      "Welcome! We're excited to serve you. Our team is committed to providing excellent service.",
    customIntakeInstructions:
      "Please provide as much detail as possible to help us serve you better.",
  });

  const [customFields] = useState<CustomField[]>([
    {
      id: "1",
      label: "How did you hear about us?",
      fieldType: "select",
      required: false,
      enabled: true,
    },
    {
      id: "2",
      label: "Gate/Access Code",
      fieldType: "text",
      required: false,
      enabled: true,
    },
    {
      id: "3",
      label: "Special Instructions",
      fieldType: "textarea",
      required: false,
      enabled: true,
    },
  ]);

  const updateSetting = <K extends keyof CustomerIntakeSettings>(
    key: K,
    value: CustomerIntakeSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function handleSave() {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_API_DELAY));
    // eslint-disable-next-line no-console
    console.log("Customer intake settings update:", settings);
    setIsSubmitting(false);
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Customer Intake Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Control what information you collect when adding new customers
          </p>
        </div>

        <Separator />

        {/* Required Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserPlus className="h-4 w-4" />
              Required Customer Information
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>
                    Information that MUST be provided before a customer can be
                    added to your system
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Information that must be collected for all customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <Users className="h-3.5 w-3.5" />
                  Require First Name
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Customer must provide their first name (always
                        recommended)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customer's given name
                </p>
              </div>
              <Switch
                checked={settings.requireFirstName}
                onCheckedChange={(checked) =>
                  updateSetting("requireFirstName", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <Users className="h-3.5 w-3.5" />
                  Require Last Name
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Customer must provide their last name (always
                        recommended)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customer's family name
                </p>
              </div>
              <Switch
                checked={settings.requireLastName}
                onCheckedChange={(checked) =>
                  updateSetting("requireLastName", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <Mail className="h-3.5 w-3.5" />
                  Require Email Address
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Email needed for sending invoices, receipts, and
                        appointment confirmations
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  For invoices and confirmations
                </p>
              </div>
              <Switch
                checked={settings.requireEmail}
                onCheckedChange={(checked) =>
                  updateSetting("requireEmail", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <Phone className="h-3.5 w-3.5" />
                  Require Phone Number
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Phone needed to contact customer about appointments and
                        send text reminders
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Primary contact number
                </p>
              </div>
              <Switch
                checked={settings.requirePhone}
                onCheckedChange={(checked) =>
                  updateSetting("requirePhone", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <MapPin className="h-3.5 w-3.5" />
                  Require Service Address
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Address where service will be performed (needed for
                        scheduling and routing)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Where work will be done
                </p>
              </div>
              <Switch
                checked={settings.requireAddress}
                onCheckedChange={(checked) =>
                  updateSetting("requireAddress", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <Home className="h-3.5 w-3.5" />
                  Require Property Type
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Whether it's residential, commercial, multi-unit, etc.
                        (helps with scheduling)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Residential, commercial, etc.
                </p>
              </div>
              <Switch
                checked={settings.requirePropertyType}
                onCheckedChange={(checked) =>
                  updateSetting("requirePropertyType", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Optional Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="h-4 w-4" />
              Optional Contact Information
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Extra contact details that are helpful but not required</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Additional contact fields (optional for customers)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Collect Secondary Phone Number
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Alternate phone number (like work number or spouse's
                        phone)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Backup contact number
                </p>
              </div>
              <Switch
                checked={settings.collectSecondaryPhone}
                onCheckedChange={(checked) =>
                  updateSetting("collectSecondaryPhone", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  <Building className="h-3.5 w-3.5" />
                  Collect Company Name
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Business name for commercial customers
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  For business customers
                </p>
              </div>
              <Switch
                checked={settings.collectCompanyName}
                onCheckedChange={(checked) =>
                  updateSetting("collectCompanyName", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Collect Preferred Contact Method
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        How customer prefers to be contacted (phone, email,
                        text)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Phone, email, or text
                </p>
              </div>
              <Switch
                checked={settings.collectPreferredContactMethod}
                onCheckedChange={(checked) =>
                  updateSetting("collectPreferredContactMethod", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Collect Best Time to Call
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        When customer is usually available for calls (morning,
                        afternoon, evening)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customer's availability
                </p>
              </div>
              <Switch
                checked={settings.collectBestTimeToCall}
                onCheckedChange={(checked) =>
                  updateSetting("collectBestTimeToCall", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Home className="h-4 w-4" />
              Property Details
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>
                    Information about the property where service will be
                    performed
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Collect details about service location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Collect Property Details
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Square footage, number of bedrooms, age of home, etc.
                        (helps with quoting)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Size, age, features, etc.
                </p>
              </div>
              <Switch
                checked={settings.collectPropertyDetails}
                onCheckedChange={(checked) =>
                  updateSetting("collectPropertyDetails", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Property Access Info
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Gate codes, lockbox codes, where equipment is located,
                        etc.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Gate codes, lockbox info
                </p>
              </div>
              <Switch
                checked={settings.requirePropertyAccess}
                onCheckedChange={(checked) =>
                  updateSetting("requirePropertyAccess", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Collect Parking Information
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Where technicians can park (especially important for
                        restricted areas)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Where to park service vehicle
                </p>
              </div>
              <Switch
                checked={settings.collectParkingInfo}
                onCheckedChange={(checked) =>
                  updateSetting("collectParkingInfo", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Collect Pet Information
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Does customer have pets? Important for technician safety
                        and planning
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Pets on property (safety)
                </p>
              </div>
              <Switch
                checked={settings.collectPetInfo}
                onCheckedChange={(checked) =>
                  updateSetting("collectPetInfo", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Communication Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4" />
              Communication & Onboarding
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>How you communicate with new customers</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Automated messages and agreements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Send Welcome Email
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically email new customers with welcome message
                        and next steps
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Greet new customers via email
                </p>
              </div>
              <Switch
                checked={settings.sendWelcomeEmail}
                onCheckedChange={(checked) =>
                  updateSetting("sendWelcomeEmail", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Send SMS Confirmation
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Text message confirming they're in your system
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Text confirmation message
                </p>
              </div>
              <Switch
                checked={settings.sendSMSConfirmation}
                onCheckedChange={(checked) =>
                  updateSetting("sendSMSConfirmation", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Collect Marketing Preferences
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Ask if customer wants to receive promotional emails and
                        special offers
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Opt-in for promotions
                </p>
              </div>
              <Switch
                checked={settings.collectMarketingPreferences}
                onCheckedChange={(checked) =>
                  updateSetting("collectMarketingPreferences", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Service Agreement
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Customer must accept your terms of service before being
                        added
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Must accept terms of service
                </p>
              </div>
              <Switch
                checked={settings.requireServiceAgreement}
                onCheckedChange={(checked) =>
                  updateSetting("requireServiceAgreement", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Custom Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              Custom Messages
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Personalize the messages new customers see</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Customize messages shown to new customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Welcome Message
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Message shown when customer is first added to your system
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                className="min-h-[100px] resize-none"
                onChange={(e) =>
                  updateSetting("welcomeMessage", e.target.value)
                }
                placeholder="Welcome! We're excited to serve you..."
                value={settings.welcomeMessage}
              />
              <p className="text-muted-foreground text-xs">
                {settings.welcomeMessage.length} characters
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Intake Instructions
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Instructions shown at the top of customer intake form
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                className="min-h-[100px] resize-none"
                onChange={(e) =>
                  updateSetting("customIntakeInstructions", e.target.value)
                }
                placeholder="Please provide as much detail as possible..."
                value={settings.customIntakeInstructions}
              />
              <p className="text-muted-foreground text-xs">
                {settings.customIntakeInstructions.length} characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Fields */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" />
                  Custom Fields
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>
                        Add your own custom questions to the customer intake
                        form
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription>
                  Custom questions for your business ({customFields.length}/
                  {MAX_CUSTOM_FIELDS})
                </CardDescription>
              </div>
              <Button disabled={customFields.length >= MAX_CUSTOM_FIELDS}>
                Add Custom Field
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customFields.map((field) => (
                <div
                  className="flex items-center justify-between rounded-lg border p-4"
                  key={field.id}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{field.label}</p>
                      {field.required && (
                        <span className="text-red-500 text-xs">*</span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Type: {field.fieldType}
                    </p>
                  </div>
                  <Switch checked={field.enabled} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Reset to Defaults
          </Button>
          <Button disabled={isSubmitting} onClick={handleSave} type="button">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Intake Settings
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
