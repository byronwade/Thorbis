"use client";

import { HelpCircle, Mail, Save } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePageLayout } from "@/hooks/use-page-layout";

const MAX_SIGNATURE_LENGTH = 300;

export default function EmailSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    companyEmail: "info@yourcompany.com",
    replyToEmail: "support@yourcompany.com",
    emailFromName: "Your Company",
    emailSignature:
      "Thank you for your business!\n\nYour Company Team\n(555) 123-4567\nwww.yourcompany.com",
    includeLogoInEmails: true,
    trackEmailOpens: true,
    trackEmailClicks: true,
  });

  const updateSetting = (key: string, value: string | boolean) => {
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
              Email Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure your email address, signature, and tracking
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
              <Mail className="h-4 w-4" />
              Email Identity
            </CardTitle>
            <CardDescription>
              How your emails appear to customers
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Signature</CardTitle>
            <CardDescription>
              Signature appended to all outgoing emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 font-medium text-sm">
                Signature Content
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Tracking</CardTitle>
            <CardDescription>
              Monitor email engagement and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <Separator />

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

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p className="font-medium text-blue-700 text-sm dark:text-blue-400">
                Email Best Practices
              </p>
              <p className="text-muted-foreground text-sm">
                Use a professional email address with your domain name. Keep
                signatures concise and include contact information. Enable
                tracking to understand customer engagement. Test emails before
                sending to large groups.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
