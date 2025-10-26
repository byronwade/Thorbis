"use client";

import { HelpCircle, MessageSquare, Save } from "lucide-react";
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

export default function SMSSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    smsEnabled: true,
    smsPhoneNumber: "(555) 123-4567",
    smsFromName: "YourCo",
    includeUnsubscribeLink: true,
    autoRespondToSMS: true,
    smsAutoResponseMessage:
      "Thanks for texting! We'll respond during business hours (Mon-Fri 8am-5pm). For emergencies, call us at (555) 123-4567.",
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
              SMS & Text Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure text message communications
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
              <MessageSquare className="h-4 w-4" />
              SMS Configuration
            </CardTitle>
            <CardDescription>
              Enable and configure text messaging
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
              </>
            )}
          </CardContent>
        </Card>

        {settings.smsEnabled && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Auto-Response</CardTitle>
                <CardDescription>
                  Automatically reply to incoming text messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <>
                    <Separator />
                    <div>
                      <Label className="font-medium text-sm">
                        Auto-Response Message
                      </Label>
                      <Textarea
                        className="mt-2 min-h-[80px] resize-none"
                        onChange={(e) =>
                          updateSetting(
                            "smsAutoResponseMessage",
                            e.target.value
                          )
                        }
                        placeholder="Thanks for texting! We'll respond during business hours..."
                        value={settings.smsAutoResponseMessage}
                      />
                      <p className="mt-1 text-muted-foreground text-xs">
                        Sent immediately when customer texts
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
                  SMS compliance and opt-out requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            <Card className="border-orange-500/50 bg-orange-500/5">
              <CardContent className="flex items-start gap-3 pt-6">
                <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                <div className="space-y-1">
                  <p className="font-medium text-orange-700 text-sm dark:text-orange-400">
                    SMS Compliance Requirements
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Always include opt-out instructions in marketing messages.
                    Honor unsubscribe requests immediately. Don't send messages
                    late at night or early morning. Keep messages concise and
                    relevant. Follow TCPA (Telephone Consumer Protection Act)
                    regulations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
