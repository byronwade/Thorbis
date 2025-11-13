"use client";

/**
 * Settings > Communications > Email Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Real database integration with server actions
 */

import { HelpCircle, Loader2, Mail, Save } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getEmailSettings, updateEmailSettings } from "@/actions/settings";
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

const MAX_SIGNATURE_LENGTH = 300;

export default function EmailSettingsPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    smtpFromEmail: "",
    smtpFromName: "",
    defaultSignature: "",
    autoCcEmail: "",
    emailLogoUrl: "",
    trackOpens: true,
    trackClicks: true,
  });

  // Load settings from database on mount
  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      try {
        const result = await getEmailSettings();

        if (result.success && result.data) {
          setSettings({
            smtpFromEmail: result.data.smtp_from_email || "",
            smtpFromName: result.data.smtp_from_name || "",
            defaultSignature: result.data.default_signature || "",
            autoCcEmail: result.data.auto_cc_email || "",
            emailLogoUrl: result.data.email_logo_url || "",
            trackOpens: result.data.track_opens ?? true,
            trackClicks: result.data.track_clicks ?? true,
          });
        }
      } catch (error) {
        toast.error("Failed to load email settings");
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, [toast]);

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("smtpFromEmail", settings.smtpFromEmail);
      formData.append("smtpFromName", settings.smtpFromName);
      formData.append("defaultSignature", settings.defaultSignature);
      formData.append("autoCcEmail", settings.autoCcEmail);
      formData.append("emailLogoUrl", settings.emailLogoUrl);
      formData.append("trackOpens", settings.trackOpens.toString());
      formData.append("trackClicks", settings.trackClicks.toString());

      const result = await updateEmailSettings(formData);

      if (result.success) {
        setHasUnsavedChanges(false);
        toast.success("Email settings saved successfully");
      } else {
        toast.error(result.error || "Failed to save email settings");
      }
    });
  };

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
              Email Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure your email address, signature, and tracking
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button disabled={isPending} onClick={handleSave}>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="size-4" />
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
                    updateSetting("smtpFromEmail", e.target.value)
                  }
                  placeholder="info@yourcompany.com"
                  type="email"
                  value={settings.smtpFromEmail}
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
                  onChange={(e) => updateSetting("autoCcEmail", e.target.value)}
                  placeholder="support@yourcompany.com"
                  type="email"
                  value={settings.autoCcEmail}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Auto CC address for all emails
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
                onChange={(e) => updateSetting("smtpFromName", e.target.value)}
                placeholder="Your Company"
                value={settings.smtpFromName}
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
                  updateSetting("defaultSignature", e.target.value)
                }
                placeholder="Thank you for your business!..."
                value={settings.defaultSignature}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                {settings.defaultSignature.length} / {MAX_SIGNATURE_LENGTH}{" "}
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
                checked={!!settings.emailLogoUrl}
                onCheckedChange={(checked) =>
                  updateSetting("emailLogoUrl", checked ? "default-logo" : "")
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
                checked={settings.trackOpens}
                onCheckedChange={(checked) =>
                  updateSetting("trackOpens", checked)
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
                checked={settings.trackClicks}
                onCheckedChange={(checked) =>
                  updateSetting("trackClicks", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="space-y-1">
              <p className="font-medium text-primary text-sm dark:text-primary">
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
