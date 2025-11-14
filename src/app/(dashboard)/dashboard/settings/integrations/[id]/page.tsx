"use client";

/**
 * Settings > Integrations > [Id] Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Power,
  Save,
  Settings,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { integrations } from "@/lib/data/integrations";
import { cn } from "@/lib/utils";
import { GoogleCalendarSettings } from "./settings/google-calendar";
import { HubSpotSettings } from "./settings/hubspot";
// Import integration-specific settings components
import { QuickBooksSettings } from "./settings/quickbooks-online";
import { SlackSettings } from "./settings/slack";
import { StripeSettings } from "./settings/stripe";
import { TwilioSettings } from "./settings/twilio";
import { ZapierSettings } from "./settings/zapier";

// Map integration IDs to their settings components
const integrationSettingsMap: Record<string, React.ComponentType> = {
  "quickbooks-online": QuickBooksSettings,
  stripe: StripeSettings,
  twilio: TwilioSettings,
  slack: SlackSettings,
  hubspot: HubSpotSettings,
  "google-calendar": GoogleCalendarSettings,
  zapier: ZapierSettings,
};

// Constants
const DISCONNECT_TIMEOUT_MS = 1500;

export default function IntegrationSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const integrationId = params?.id as string;

  const integration = integrations.find((i) => i.id === integrationId);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  if (!integration) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto mb-4 size-12 text-destructive" />
          <h3 className="mb-2 font-semibold text-lg">Integration not found</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            The integration you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/dashboard/settings/integrations">
              Back to Integrations
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (!integration.isConnected) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 font-semibold text-lg">Not connected</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            This integration is not connected yet. Connect it first to access
            settings.
          </p>
          <Button asChild>
            <Link href="/dashboard/settings/integrations">
              Back to Integrations
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const SpecificSettings = integrationSettingsMap[integration.id];

  const handleDisconnect = () => {
    setIsDisconnecting(true);
    // Simulate API call
    setTimeout(() => {
      setIsDisconnecting(false);
      router.push("/dashboard/settings/integrations");
    }, DISCONNECT_TIMEOUT_MS);
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/settings/integrations">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex flex-1 items-center gap-4">
          <Avatar className="size-16 rounded-lg">
            <AvatarImage src={integration.icon} />
            <AvatarFallback
              className={cn("rounded-lg text-lg text-white", integration.color)}
            >
              {integration.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-2xl tracking-tight">
                {integration.name}
              </h1>
              <Badge className="bg-success text-success hover:bg-success dark:bg-success dark:text-success">
                <CheckCircle2 className="mr-1 size-3" />
                Connected
              </Badge>
            </div>
            <p className="text-muted-foreground">{integration.description}</p>
          </div>
          {integration.website && (
            <Button asChild size="sm" variant="outline">
              <Link
                href={integration.website}
                rel="noopener noreferrer"
                target="_blank"
              >
                Visit Website
                <ExternalLink className="ml-2 size-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Integration-specific settings */}
      {SpecificSettings ? (
        <SpecificSettings />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="size-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Configure how {integration.name} integrates with Thorbis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Default settings for integrations without specific settings pages */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Integration</Label>
                  <p className="text-muted-foreground text-sm">
                    Activate this integration to sync data
                  </p>
                </div>
                <Switch checked defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-sync</Label>
                  <p className="text-muted-foreground text-sm">
                    Automatically sync data every hour
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Send Notifications</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive notifications for sync events
                  </p>
                </div>
                <Switch />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="notes">Integration Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this integration..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline">
                Cancel
              </Button>
              <Button size="sm">
                <Save className="mr-2 size-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Power className="size-5" />
            Connection Status
          </CardTitle>
          <CardDescription>
            Manage your connection to {integration.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <p className="font-medium text-sm">Status</p>
              <p className="text-muted-foreground text-xs">
                Connected and syncing
              </p>
            </div>
            <Badge className="bg-success text-success hover:bg-success">
              Active
            </Badge>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <p className="font-medium text-sm">Last Sync</p>
              <p className="text-muted-foreground text-xs">2 minutes ago</p>
            </div>
            <Button size="sm" variant="outline">
              Sync Now
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <p className="font-medium text-sm">API Key</p>
              <p className="font-mono text-muted-foreground text-xs">
                sk_live_••••••••••••3xY9
              </p>
            </div>
            <Button size="sm" variant="outline">
              Regenerate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="size-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions for this integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="space-y-1">
              <p className="font-medium text-sm">Disconnect Integration</p>
              <p className="text-muted-foreground text-xs">
                This will stop all data syncing and remove the connection
              </p>
            </div>
            <Button
              disabled={isDisconnecting}
              onClick={handleDisconnect}
              size="sm"
              variant="destructive"
            >
              {isDisconnecting ? "Disconnecting..." : "Disconnect"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
