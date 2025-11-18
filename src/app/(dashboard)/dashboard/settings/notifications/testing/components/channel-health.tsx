"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  MessageSquare,
  Bell,
  Smartphone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

interface ChannelStatus {
  channel: string;
  name: string;
  icon: React.ReactNode;
  status: "operational" | "degraded" | "down";
  apiStatus: "connected" | "disconnected" | "error";
  successRate: number; // 0-100
  lastChecked: Date;
  dailySent: number;
  dailyFailed: number;
  config: {
    apiKey: boolean;
    fromAddress?: string;
    messagingProfile?: string;
    serviceWorker?: boolean;
  };
  errors: string[];
}

export function ChannelHealth() {
  const [channels, setChannels] = useState<ChannelStatus[]>([
    {
      channel: "email",
      name: "Email (Resend)",
      icon: <Mail className="h-5 w-5" />,
      status: "operational",
      apiStatus: "connected",
      successRate: 98.5,
      lastChecked: new Date(),
      dailySent: 142,
      dailyFailed: 2,
      config: {
        apiKey: true,
        fromAddress: "noreply@stratos.com",
      },
      errors: [],
    },
    {
      channel: "sms",
      name: "SMS (Telnyx)",
      icon: <MessageSquare className="h-5 w-5" />,
      status: "degraded",
      apiStatus: "connected",
      successRate: 75.0,
      lastChecked: new Date(),
      dailySent: 45,
      dailyFailed: 15,
      config: {
        apiKey: true,
        messagingProfile: "profile_abc123",
      },
      errors: ["Some messages failing due to invalid phone numbers"],
    },
    {
      channel: "in_app",
      name: "In-App Notifications",
      icon: <Bell className="h-5 w-5" />,
      status: "operational",
      apiStatus: "connected",
      successRate: 100,
      lastChecked: new Date(),
      dailySent: 387,
      dailyFailed: 0,
      config: {
        apiKey: false, // Uses Supabase Realtime
      },
      errors: [],
    },
    {
      channel: "push",
      name: "Push Notifications",
      icon: <Smartphone className="h-5 w-5" />,
      status: "down",
      apiStatus: "error",
      successRate: 0,
      lastChecked: new Date(),
      dailySent: 0,
      dailyFailed: 0,
      config: {
        apiKey: false,
        serviceWorker: false,
      },
      errors: [
        "Service worker not configured",
        "VAPID keys not set",
        "No push subscriptions found",
      ],
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update last checked time
    setChannels((prev) =>
      prev.map((channel) => ({
        ...channel,
        lastChecked: new Date(),
      }))
    );

    setIsRefreshing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Channel Health</CardTitle>
            <CardDescription>
              Monitor the status and performance of all notification channels
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((channel) => (
            <ChannelStatusCard key={channel.channel} channel={channel} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ChannelStatusCard({ channel }: { channel: ChannelStatus }) {
  const statusConfig = {
    operational: {
      color: "bg-green-100 text-green-700 border-green-300",
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: "Operational",
    },
    degraded: {
      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
      icon: <AlertTriangle className="h-4 w-4" />,
      label: "Degraded",
    },
    down: {
      color: "bg-red-100 text-red-700 border-red-300",
      icon: <XCircle className="h-4 w-4" />,
      label: "Down",
    },
  };

  const { color, icon, label } = statusConfig[channel.status];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {channel.icon}
            <CardTitle className="text-base">{channel.name}</CardTitle>
          </div>
          <Badge variant="outline" className={`flex items-center gap-1 ${color}`}>
            {icon}
            {label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Success Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Success Rate (24h)</span>
            <span className="font-semibold">{channel.successRate.toFixed(1)}%</span>
          </div>
          <Progress value={channel.successRate} className="h-2" />
        </div>

        {/* Daily Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Sent Today</div>
            <div className="text-2xl font-bold">{channel.dailySent}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Failed Today</div>
            <div className="text-2xl font-bold text-red-600">{channel.dailyFailed}</div>
          </div>
        </div>

        {/* Configuration Status */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Configuration:</div>
          <div className="space-y-1 text-xs">
            <ConfigItem
              label="API Key"
              value={channel.config.apiKey}
              required
            />
            {channel.config.fromAddress && (
              <ConfigItem
                label="From Address"
                value={channel.config.fromAddress}
                isText
              />
            )}
            {channel.config.messagingProfile && (
              <ConfigItem
                label="Messaging Profile"
                value={channel.config.messagingProfile}
                isText
              />
            )}
            {channel.config.serviceWorker !== undefined && (
              <ConfigItem
                label="Service Worker"
                value={channel.config.serviceWorker}
                required
              />
            )}
          </div>
        </div>

        {/* Errors */}
        {channel.errors.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-red-600">Issues:</div>
            <ul className="space-y-1 text-xs text-red-600">
              {channel.errors.map((error, index) => (
                <li key={index} className="flex items-start gap-1">
                  <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Last Checked */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          Last checked: {channel.lastChecked.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

interface ConfigItemProps {
  label: string;
  value: boolean | string;
  required?: boolean;
  isText?: boolean;
}

function ConfigItem({ label, value, required, isText }: ConfigItemProps) {
  if (isText) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{label}:</span>
        <code className="bg-muted px-2 py-0.5 rounded">{value}</code>
      </div>
    );
  }

  const configured = value === true;

  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <Badge
        variant="outline"
        className={
          configured
            ? "bg-green-100 text-green-700 border-green-300"
            : "bg-red-100 text-red-700 border-red-300"
        }
      >
        {configured ? (
          <>
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Configured
          </>
        ) : (
          <>
            <XCircle className="h-3 w-3 mr-1" />
            Missing{required && " (Required)"}
          </>
        )}
      </Badge>
    </div>
  );
}
