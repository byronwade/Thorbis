"use client";

import { MessageSquare, Phone, Save } from "lucide-react";
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

export function TwilioSettings() {
  const [isSaving, setIsSaving] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="size-5" />
            Phone Settings
          </CardTitle>
          <CardDescription>Configure voice calling options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone-number">Business Phone Number</Label>
            <Input
              defaultValue="+1 (555) 123-4567"
              id="phone-number"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Call Recording</Label>
              <p className="text-muted-foreground text-sm">
                Record all incoming and outgoing calls
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Voicemail</Label>
              <p className="text-muted-foreground text-sm">
                Enable voicemail for missed calls
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="size-5" />
            SMS Settings
          </CardTitle>
          <CardDescription>Configure text messaging options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable SMS</Label>
              <p className="text-muted-foreground text-sm">
                Send and receive text messages
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-reply</Label>
              <p className="text-muted-foreground text-sm">
                Send automatic replies to incoming messages
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button disabled={isSaving} onClick={() => setIsSaving(true)}>
          <Save className="mr-2 size-4" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
