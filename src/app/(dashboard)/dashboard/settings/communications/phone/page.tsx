"use client";

import { HelpCircle, Phone, Save } from "lucide-react";
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

export default function PhoneSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    businessPhoneNumber: "(555) 123-4567",
    enableCallRecording: true,
    callRecordingDisclosure: true,
    enableVoicemail: true,
    voicemailGreeting:
      "Thank you for calling. We're unable to take your call right now. Please leave a message and we'll get back to you as soon as possible.",
    forwardAfterHours: false,
    forwardToNumber: "",
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
              Phone & Voice Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure phone system and voicemail settings
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
              <Phone className="h-4 w-4" />
              Business Phone
            </CardTitle>
            <CardDescription>
              Main business phone number configuration
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call Recording</CardTitle>
            <CardDescription>
              Record calls for training and quality assurance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <>
                <Separator />
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
                            Play "This call may be recorded" message (required
                            by law in most states)
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
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voicemail</CardTitle>
            <CardDescription>
              Voicemail greeting and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <>
                <Separator />
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
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call Forwarding</CardTitle>
            <CardDescription>
              Forward calls outside business hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <>
                <Separator />
                <div>
                  <Label className="font-medium text-sm">
                    Forward To Number
                  </Label>
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
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p className="font-medium text-blue-700 text-sm dark:text-blue-400">
                Phone System Best Practices
              </p>
              <p className="text-muted-foreground text-sm">
                Always disclose call recording when enabled. Keep voicemail
                greetings professional and concise. Update greetings for
                holidays and special hours. Consider using call forwarding for
                after-hours emergencies.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
