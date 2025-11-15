"use client";

import {
  AlertTriangle,
  HelpCircle,
  Phone,
  Settings as SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { getSmsSettings, updateSmsSettings } from "@/actions/settings";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { useSettings } from "@/hooks/use-settings";
import {
  DEFAULT_SMS_SETTINGS,
  mapSmsSettings,
  type SmsSettingsState,
} from "./sms-config";

interface SmsSettingsClientProps {
  initialSettings: Partial<SmsSettingsState> | null;
}

export function SmsSettingsClient({ initialSettings }: SmsSettingsClientProps) {
  const {
    settings,
    isLoading,
    isPending,
    hasUnsavedChanges,
    updateSetting,
    saveSettings,
    reload,
  } = useSettings<SmsSettingsState>({
    getter: getSmsSettings,
    setter: updateSmsSettings,
    initialState: DEFAULT_SMS_SETTINGS,
    settingsName: "sms",
    prefetchedData: initialSettings ?? undefined,
    transformLoad: (data) => mapSmsSettings(data),
    transformSave: (state) => {
      const formData = new FormData();
      formData.append("provider", state.provider);
      formData.append("providerApiKey", state.providerApiKey);
      formData.append("senderNumber", state.senderNumber);
      formData.append("autoReplyEnabled", state.autoReplyEnabled.toString());
      formData.append("autoReplyMessage", state.autoReplyMessage);
      formData.append("optOutMessage", state.optOutMessage);
      formData.append("includeOptOut", state.includeOptOut.toString());
      formData.append("consentRequired", state.consentRequired.toString());
      return formData;
    },
  });

  const handleSave = useCallback(() => {
    void saveSettings();
  }, [saveSettings]);

  const handleCancel = useCallback(() => {
    void reload();
  }, [reload]);

  return (
    <TooltipProvider>
      <SettingsPageLayout
        description="Configure SMS sending numbers, auto-responses, and compliance defaults."
        hasChanges={hasUnsavedChanges}
        helpText="Applies to all outbound text messages and automation."
        isLoading={isLoading}
        isPending={isPending}
        onCancel={handleCancel}
        onSave={handleSave}
        saveButtonText="Save SMS settings"
        title="SMS & Text"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard/settings/communications">
                    Communications
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>SMS</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button asChild variant="ghost">
            <Link href="/dashboard/settings/communications">
              <SettingsIcon className="mr-2 size-4" />
              Back to communications
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="size-4" />
              Sender Identity
            </CardTitle>
            <CardDescription>Number and name customers see</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  SMS phone number
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="size-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Provisioned number used to send all texts.
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  className="mt-2"
                  onChange={(event) =>
                    updateSetting("senderNumber", event.target.value)
                  }
                  placeholder="(555) 123-4567"
                  type="tel"
                  value={settings.senderNumber}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Must match an active Telnyx or Twilio number.
                </p>
              </div>
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Provider
                </Label>
                <select
                  className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  onChange={(event) =>
                    updateSetting(
                      "provider",
                      event.target.value as SmsSettingsState["provider"]
                    )
                  }
                  value={settings.provider}
                >
                  <option value="telnyx">Telnyx</option>
                  <option value="twilio">Twilio</option>
                  <option value="other">Other</option>
                </select>
                <Input
                  className="mt-3"
                  onChange={(event) =>
                    updateSetting("providerApiKey", event.target.value)
                  }
                  placeholder="Provider API key"
                  type="password"
                  value={settings.providerApiKey}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Stored securely; leave blank to keep existing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auto-response</CardTitle>
            <CardDescription>
              Automatically reply when a customer texts you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">Enable auto-response</p>
                <p className="text-muted-foreground text-xs">
                  Sends an immediate acknowledgment outside business hours.
                </p>
              </div>
              <Switch
                checked={settings.autoReplyEnabled}
                onCheckedChange={(checked) =>
                  updateSetting("autoReplyEnabled", checked)
                }
              />
            </div>

            {settings.autoReplyEnabled && (
              <>
                <Separator />
                <div>
                  <Label className="font-medium text-sm">
                    Auto-response message
                  </Label>
                  <Textarea
                    className="mt-2 min-h-[120px] resize-none"
                    onChange={(event) =>
                      updateSetting("autoReplyMessage", event.target.value)
                    }
                    placeholder="Thanks for texting! We’ll respond during business hours."
                    value={settings.autoReplyMessage}
                  />
                  <p className="mt-1 text-muted-foreground text-xs">
                    Sent once per conversation when an incoming SMS is received.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance</CardTitle>
            <CardDescription>
              Required messaging disclosures and consent tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Include opt-out instructions
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="size-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Automatically append “Reply STOP to unsubscribe”.
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Required for promotional messaging in most regions.
                </p>
              </div>
              <Switch
                checked={settings.includeOptOut}
                onCheckedChange={(checked) =>
                  updateSetting("includeOptOut", checked)
                }
              />
            </div>

            <Separator />

            <div>
              <Label className="font-medium text-sm">Opt-out message</Label>
              <Textarea
                className="mt-2 min-h-[80px] resize-none"
                onChange={(event) =>
                  updateSetting("optOutMessage", event.target.value)
                }
                value={settings.optOutMessage}
              />
              <p className="mt-1 text-muted-foreground text-xs">
                Displayed after any outgoing SMS when opt-out instructions are
                enabled.
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Consent required</p>
                <p className="text-muted-foreground text-xs">
                  Only send messages to contacts with documented consent.
                </p>
              </div>
              <Switch
                checked={settings.consentRequired}
                onCheckedChange={(checked) =>
                  updateSetting("consentRequired", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertTriangle className="size-5 text-warning" />
            <div className="space-y-1">
              <p className="font-semibold text-sm text-warning">
                Compliance reminder
              </p>
              <p className="text-muted-foreground text-sm">
                Follow TCPA/CTIA guidelines: honor STOP requests immediately,
                keep quiet hours, and collect explicit consent before sending
                marketing texts. Configure opt-outs and consent policies here so
                Thorbis can enforce them automatically.
              </p>
            </div>
          </CardContent>
        </Card>
      </SettingsPageLayout>
    </TooltipProvider>
  );
}

export default SmsSettingsClient;
