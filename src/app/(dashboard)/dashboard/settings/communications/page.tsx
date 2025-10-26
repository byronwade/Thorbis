"use client";

import {
  Bell,
  HelpCircle,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Save,
  Settings,
  Smartphone,
  Volume2,
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
import { Textarea } from "@/components/ui/textarea";
import {
import { usePageLayout } from "@/hooks/use-page-layout";
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Constants
const SIMULATED_API_DELAY = 1500;
const MAX_SIGNATURE_LENGTH = 300;
const DEFAULT_BUSINESS_HOURS_START = "08:00";
const DEFAULT_BUSINESS_HOURS_END = "17:00";

type CommunicationSettings = {
  // Email Settings
  companyEmail: string;
  replyToEmail: string;
  emailFromName: string;
  emailSignature: string;
  includeLogoInEmails: boolean;
  trackEmailOpens: boolean;
  trackEmailClicks: boolean;

  // SMS Settings
  smsEnabled: boolean;
  smsPhoneNumber: string;
  smsFromName: string;
  includeUnsubscribeLink: boolean;
  autoRespondToSMS: boolean;
  smsAutoResponseMessage: string;

  // Phone Settings
  businessPhoneNumber: string;
  enableCallRecording: boolean;
  callRecordingDisclosure: boolean;
  enableVoicemail: boolean;
  voicemailGreeting: string;
  forwardAfterHours: boolean;
  forwardToNumber: string;

  // Notification Preferences
  notifyNewLeads: boolean;
  notifyNewLeadsEmail: string;
  notifyNewLeadsSMS: boolean;
  notifyJobScheduled: boolean;
  notifyJobCompleted: boolean;
  notifyPaymentReceived: boolean;
  notifyNegativeReview: boolean;

  // Team Notifications
  notifyTechnicianAssignment: boolean;
  notifyTechnicianJobUpdate: boolean;
  notifyOfficeOnArrival: boolean;
  notifyOfficeOnCompletion: boolean;

  // Customer Notifications
  sendJobConfirmation: boolean;
  sendDayBeforeReminder: boolean;
  sendOnTheWayAlert: boolean;
  onTheWayMinutes: number;
  sendJobCompletionSummary: boolean;
  sendPaymentReceipt: boolean;

  // Quiet Hours
  enableQuietHours: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  quietHoursTimeZone: string;

  // Templates
  useEmailTemplates: boolean;
  useSMSTemplates: boolean;
  allowCustomTemplates: boolean;
};

export default function CommunicationsSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [settings, setSettings] = useState<CommunicationSettings>({
    // Email Settings
    companyEmail: "info@yourcompany.com",
    replyToEmail: "support@yourcompany.com",
    emailFromName: "Your Company",
    emailSignature:
      "Thank you for your business!\n\nYour Company Team\n(555) 123-4567\nwww.yourcompany.com",
    includeLogoInEmails: true,
    trackEmailOpens: true,
    trackEmailClicks: true,

    // SMS Settings
    smsEnabled: true,
    smsPhoneNumber: "(555) 123-4567",
    smsFromName: "YourCo",
    includeUnsubscribeLink: true,
    autoRespondToSMS: true,
    smsAutoResponseMessage:
      "Thanks for texting! We'll respond during business hours (Mon-Fri 8am-5pm). For emergencies, call us at (555) 123-4567.",

    // Phone Settings
    businessPhoneNumber: "(555) 123-4567",
    enableCallRecording: true,
    callRecordingDisclosure: true,
    enableVoicemail: true,
    voicemailGreeting:
      "Thank you for calling. We're unable to take your call right now. Please leave a message and we'll get back to you as soon as possible.",
    forwardAfterHours: false,
    forwardToNumber: "",

    // Notification Preferences
    notifyNewLeads: true,
    notifyNewLeadsEmail: "sales@yourcompany.com",
    notifyNewLeadsSMS: true,
    notifyJobScheduled: true,
    notifyJobCompleted: true,
    notifyPaymentReceived: true,
    notifyNegativeReview: true,

    // Team Notifications
    notifyTechnicianAssignment: true,
    notifyTechnicianJobUpdate: true,
    notifyOfficeOnArrival: true,
    notifyOfficeOnCompletion: true,

    // Customer Notifications
    sendJobConfirmation: true,
    sendDayBeforeReminder: true,
    sendOnTheWayAlert: true,
    onTheWayMinutes: 30,
    sendJobCompletionSummary: true,
    sendPaymentReceipt: true,

    // Quiet Hours
    enableQuietHours: true,
    quietHoursStart: "21:00",
    quietHoursEnd: "08:00",
    quietHoursTimeZone: "America/New_York",

    // Templates
    useEmailTemplates: true,
    useSMSTemplates: true,
    allowCustomTemplates: true,
  });

  const updateSetting = <K extends keyof CommunicationSettings>(
    key: K,
    value: CommunicationSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  async function handleSave() {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_API_DELAY));
    console.log("Communication settings update request:", settings);
    setIsSubmitting(false);
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Communications Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            How you communicate with customers and your team
          </p>
        </div>

        <Separator />

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <p className="mt-1 font-bold text-2xl">
                    {settings.trackEmailOpens ? "Tracking" : "Basic"}
                  </p>
                </div>
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">SMS</p>
                  <p className="mt-1 font-bold text-2xl">
                    {settings.smsEnabled ? "Active" : "Inactive"}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Phone</p>
                  <p className="mt-1 font-bold text-2xl">
                    {settings.enableCallRecording ? "Recording" : "Standard"}
                  </p>
                </div>
                <Phone className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Notifications</p>
                  <p className="mt-1 font-bold text-2xl">
                    {
                      [
                        settings.notifyNewLeads,
                        settings.notifyJobScheduled,
                        settings.notifyJobCompleted,
                        settings.notifyPaymentReceived,
                      ].filter(Boolean).length
                    }
                    /4
                  </p>
                </div>
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4" />
              Email Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    How emails appear when sent to customers
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Configure your email address and signature
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  From Email Address
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Email address that appears in "From" field
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting("companyEmail", e.target.value)
                  }
                  placeholder="info@yourcompany.com"
                  type="email"
                  value={settings.companyEmail}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Shows in customer's inbox
                </p>
              </div>

              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Reply-To Email
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Where customer replies go</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting("replyToEmail", e.target.value)
                  }
                  placeholder="support@yourcompany.com"
                  type="email"
                  value={settings.replyToEmail}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Where replies are sent
                </p>
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                From Name
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Name shown in inbox (usually your company name)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                className="mt-2"
                onChange={(e) => updateSetting("emailFromName", e.target.value)}
                placeholder="Your Company"
                value={settings.emailFromName}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                Example: "Your Company" &lt;info@yourcompany.com&gt;
              </p>
            </div>

            <Separator />

            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Email Signature
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Appears at bottom of all emails</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                className="mt-2 min-h-[120px] resize-none font-mono text-sm"
                onChange={(e) =>
                  updateSetting("emailSignature", e.target.value)
                }
                placeholder="Thank you for your business!..."
                value={settings.emailSignature}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                {settings.emailSignature.length} / {MAX_SIGNATURE_LENGTH}{" "}
                characters
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Include Company Logo
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Show your logo at top of emails
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Display logo in email header
                </p>
              </div>
              <Switch
                checked={settings.includeLogoInEmails}
                onCheckedChange={(checked) =>
                  updateSetting("includeLogoInEmails", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Track Email Opens
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Know when customer opens your email
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  See when emails are opened
                </p>
              </div>
              <Switch
                checked={settings.trackEmailOpens}
                onCheckedChange={(checked) =>
                  updateSetting("trackEmailOpens", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Track Link Clicks
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Know when customer clicks links in email
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  See which links get clicked
                </p>
              </div>
              <Switch
                checked={settings.trackEmailClicks}
                onCheckedChange={(checked) =>
                  updateSetting("trackEmailClicks", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* SMS Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4" />
              SMS Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Text message configuration</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Configure text message communications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable SMS
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Turn text messaging on or off</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Send and receive text messages
                </p>
              </div>
              <Switch
                checked={settings.smsEnabled}
                onCheckedChange={(checked) =>
                  updateSetting("smsEnabled", checked)
                }
              />
            </div>

            {settings.smsEnabled && (
              <>
                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      SMS Phone Number
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Number used to send texts</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      className="mt-2"
                      onChange={(e) =>
                        updateSetting("smsPhoneNumber", e.target.value)
                      }
                      placeholder="(555) 123-4567"
                      type="tel"
                      value={settings.smsPhoneNumber}
                    />
                    <p className="mt-1 text-muted-foreground text-xs">
                      Number customers see texts from
                    </p>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      From Name
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Short name shown in text messages (max 11
                            characters)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      className="mt-2"
                      maxLength={11}
                      onChange={(e) =>
                        updateSetting("smsFromName", e.target.value)
                      }
                      placeholder="YourCo"
                      value={settings.smsFromName}
                    />
                    <p className="mt-1 text-muted-foreground text-xs">
                      Sender name (11 chars max)
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Auto-Respond to SMS
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Send automatic reply when customer texts you
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Reply automatically to incoming texts
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoRespondToSMS}
                    onCheckedChange={(checked) =>
                      updateSetting("autoRespondToSMS", checked)
                    }
                  />
                </div>

                {settings.autoRespondToSMS && (
                  <div>
                    <Label className="font-medium text-sm">
                      Auto-Response Message
                    </Label>
                    <Textarea
                      className="mt-2 min-h-[80px] resize-none"
                      onChange={(e) =>
                        updateSetting("smsAutoResponseMessage", e.target.value)
                      }
                      placeholder="Thanks for texting! We'll respond during business hours..."
                      value={settings.smsAutoResponseMessage}
                    />
                    <p className="mt-1 text-muted-foreground text-xs">
                      Sent immediately when customer texts
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Include Unsubscribe Link
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Add "Reply STOP to unsubscribe" (required by law for
                            marketing texts)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Add unsubscribe instructions (required)
                    </p>
                  </div>
                  <Switch
                    checked={settings.includeUnsubscribeLink}
                    onCheckedChange={(checked) =>
                      updateSetting("includeUnsubscribeLink", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Phone Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="h-4 w-4" />
              Phone Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Phone system and call handling</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Configure phone and voicemail settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Business Phone Number
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Main phone number for your business
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                className="mt-2"
                onChange={(e) =>
                  updateSetting("businessPhoneNumber", e.target.value)
                }
                placeholder="(555) 123-4567"
                type="tel"
                value={settings.businessPhoneNumber}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                Displayed to customers
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Call Recording
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Record phone calls for training and quality
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Record calls for quality and training
                </p>
              </div>
              <Switch
                checked={settings.enableCallRecording}
                onCheckedChange={(checked) =>
                  updateSetting("enableCallRecording", checked)
                }
              />
            </div>

            {settings.enableCallRecording && (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Recording Disclosure
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Play "This call may be recorded" message (required by
                          law in most states)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Notify caller that call is recorded
                  </p>
                </div>
                <Switch
                  checked={settings.callRecordingDisclosure}
                  onCheckedChange={(checked) =>
                    updateSetting("callRecordingDisclosure", checked)
                  }
                />
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Voicemail
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Allow callers to leave voicemail messages
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Allow callers to leave messages
                </p>
              </div>
              <Switch
                checked={settings.enableVoicemail}
                onCheckedChange={(checked) =>
                  updateSetting("enableVoicemail", checked)
                }
              />
            </div>

            {settings.enableVoicemail && (
              <div>
                <Label className="font-medium text-sm">
                  Voicemail Greeting
                </Label>
                <Textarea
                  className="mt-2 min-h-[80px] resize-none"
                  onChange={(e) =>
                    updateSetting("voicemailGreeting", e.target.value)
                  }
                  placeholder="Thank you for calling. We're unable to take your call..."
                  value={settings.voicemailGreeting}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Message played when call goes to voicemail
                </p>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Forward After Hours
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Forward calls to another number outside business hours
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Forward to on-call phone after hours
                </p>
              </div>
              <Switch
                checked={settings.forwardAfterHours}
                onCheckedChange={(checked) =>
                  updateSetting("forwardAfterHours", checked)
                }
              />
            </div>

            {settings.forwardAfterHours && (
              <div>
                <Label className="font-medium text-sm">Forward To Number</Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting("forwardToNumber", e.target.value)
                  }
                  placeholder="(555) 987-6543"
                  type="tel"
                  value={settings.forwardToNumber}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  On-call or emergency contact number
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Smartphone className="h-4 w-4" />
              Customer Notifications
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Automatic updates sent to customers
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Keep customers updated automatically
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Job Confirmation
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Confirm when job is scheduled
                  </p>
                </div>
                <Switch
                  checked={settings.sendJobConfirmation}
                  onCheckedChange={(checked) =>
                    updateSetting("sendJobConfirmation", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Day-Before Reminder
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Remind customer 24 hours before job
                  </p>
                </div>
                <Switch
                  checked={settings.sendDayBeforeReminder}
                  onCheckedChange={(checked) =>
                    updateSetting("sendDayBeforeReminder", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    "On The Way" Alert
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Alert customer when tech is heading to their location
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Notify when technician is on the way
                  </p>
                </div>
                <Switch
                  checked={settings.sendOnTheWayAlert}
                  onCheckedChange={(checked) =>
                    updateSetting("sendOnTheWayAlert", checked)
                  }
                />
              </div>

              {settings.sendOnTheWayAlert && (
                <div className="ml-6">
                  <Label className="text-sm">Send alert when tech is:</Label>
                  <Select
                    onValueChange={(value) =>
                      updateSetting("onTheWayMinutes", Number.parseInt(value))
                    }
                    value={settings.onTheWayMinutes.toString()}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes away</SelectItem>
                      <SelectItem value="30">30 minutes away</SelectItem>
                      <SelectItem value="45">45 minutes away</SelectItem>
                      <SelectItem value="60">60 minutes away</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Job Completion Summary
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Send summary when job is complete
                  </p>
                </div>
                <Switch
                  checked={settings.sendJobCompletionSummary}
                  onCheckedChange={(checked) =>
                    updateSetting("sendJobCompletionSummary", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Payment Receipt</Label>
                  <p className="text-muted-foreground text-xs">
                    Email receipt when payment received
                  </p>
                </div>
                <Switch
                  checked={settings.sendPaymentReceipt}
                  onCheckedChange={(checked) =>
                    updateSetting("sendPaymentReceipt", checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Internal Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              Internal Notifications
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Alerts sent to your team</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Alerts for your team and managers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">New Leads</Label>
                  <p className="text-muted-foreground text-xs">
                    Alert when new lead comes in
                  </p>
                </div>
                <Switch
                  checked={settings.notifyNewLeads}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyNewLeads", checked)
                  }
                />
              </div>

              {settings.notifyNewLeads && (
                <div className="ml-6 space-y-3">
                  <div>
                    <Label className="text-sm">Email alerts to:</Label>
                    <Input
                      className="mt-2"
                      onChange={(e) =>
                        updateSetting("notifyNewLeadsEmail", e.target.value)
                      }
                      placeholder="sales@yourcompany.com"
                      type="email"
                      value={settings.notifyNewLeadsEmail}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Also send SMS</Label>
                    <Switch
                      checked={settings.notifyNewLeadsSMS}
                      onCheckedChange={(checked) =>
                        updateSetting("notifyNewLeadsSMS", checked)
                      }
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Job Scheduled</Label>
                  <p className="text-muted-foreground text-xs">
                    Alert when new job is scheduled
                  </p>
                </div>
                <Switch
                  checked={settings.notifyJobScheduled}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyJobScheduled", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">Job Completed</Label>
                  <p className="text-muted-foreground text-xs">
                    Alert when job is completed
                  </p>
                </div>
                <Switch
                  checked={settings.notifyJobCompleted}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyJobCompleted", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Payment Received
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Alert when payment is received
                  </p>
                </div>
                <Switch
                  checked={settings.notifyPaymentReceived}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyPaymentReceived", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Negative Review
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Immediately alert manager when negative review posted
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Urgent alert for bad reviews
                  </p>
                </div>
                <Switch
                  checked={settings.notifyNegativeReview}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyNegativeReview", checked)
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="font-medium text-sm">Technician Notifications</p>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-sm">Job Assignment</Label>
                  <p className="text-muted-foreground text-xs">
                    Notify tech when assigned to job
                  </p>
                </div>
                <Switch
                  checked={settings.notifyTechnicianAssignment}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyTechnicianAssignment", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-sm">Job Updates</Label>
                  <p className="text-muted-foreground text-xs">
                    Notify tech of job changes
                  </p>
                </div>
                <Switch
                  checked={settings.notifyTechnicianJobUpdate}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyTechnicianJobUpdate", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-sm">Tech Arrival Alert</Label>
                  <p className="text-muted-foreground text-xs">
                    Notify office when tech arrives
                  </p>
                </div>
                <Switch
                  checked={settings.notifyOfficeOnArrival}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyOfficeOnArrival", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-sm">Tech Completion Alert</Label>
                  <p className="text-muted-foreground text-xs">
                    Notify office when tech completes
                  </p>
                </div>
                <Switch
                  checked={settings.notifyOfficeOnCompletion}
                  onCheckedChange={(checked) =>
                    updateSetting("notifyOfficeOnCompletion", checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Volume2 className="h-4 w-4" />
              Quiet Hours
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Don't send non-urgent messages during these hours
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Respect customer's time by limiting notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Quiet Hours
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Don't send marketing messages during late night/early
                        morning
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Block non-urgent messages at night
                </p>
              </div>
              <Switch
                checked={settings.enableQuietHours}
                onCheckedChange={(checked) =>
                  updateSetting("enableQuietHours", checked)
                }
              />
            </div>

            {settings.enableQuietHours && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-sm">Quiet Hours Start</Label>
                    <Input
                      className="mt-2"
                      onChange={(e) =>
                        updateSetting("quietHoursStart", e.target.value)
                      }
                      type="time"
                      value={settings.quietHoursStart}
                    />
                    <p className="mt-1 text-muted-foreground text-xs">
                      Start blocking messages at
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm">Quiet Hours End</Label>
                    <Input
                      className="mt-2"
                      onChange={(e) =>
                        updateSetting("quietHoursEnd", e.target.value)
                      }
                      type="time"
                      value={settings.quietHoursEnd}
                    />
                    <p className="mt-1 text-muted-foreground text-xs">
                      Resume messages at
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm">Time Zone</Label>
                  <Select
                    onValueChange={(value) =>
                      updateSetting("quietHoursTimeZone", value)
                    }
                    value={settings.quietHoursTimeZone}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time (ET)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time (MT)
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time (PT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm">
                    <strong>Note:</strong> Emergency and appointment-related
                    messages will still be sent during quiet hours.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Message Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Message Templates
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Pre-written messages for common situations
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Save time with pre-written messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Use Email Templates
                </Label>
                <p className="text-muted-foreground text-xs">
                  Pre-written emails for common situations
                </p>
              </div>
              <Switch
                checked={settings.useEmailTemplates}
                onCheckedChange={(checked) =>
                  updateSetting("useEmailTemplates", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">Use SMS Templates</Label>
                <p className="text-muted-foreground text-xs">
                  Pre-written text messages
                </p>
              </div>
              <Switch
                checked={settings.useSMSTemplates}
                onCheckedChange={(checked) =>
                  updateSetting("useSMSTemplates", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Custom Templates
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Let team members create their own templates
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Team can create custom templates
                </p>
              </div>
              <Switch
                checked={settings.allowCustomTemplates}
                onCheckedChange={(checked) =>
                  updateSetting("allowCustomTemplates", checked)
                }
              />
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
            Save Communication Settings
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
