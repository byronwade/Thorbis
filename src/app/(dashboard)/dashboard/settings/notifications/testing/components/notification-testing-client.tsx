"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Bell, Smartphone, CheckCircle2, AlertCircle, XCircle, Activity } from "lucide-react";
import {
  NOTIFICATION_REGISTRY,
  getImplementationStats,
  getNotificationsByChannel,
  getNotificationsByCategory,
  type NotificationChannel,
  type NotificationDefinition,
} from "../notification-registry";
import { NotificationTestCard } from "./notification-test-card";
import { DeliveryHistory } from "./delivery-history";
import { ChannelHealth } from "./channel-health";
import { cn } from "@/lib/utils";

export function NotificationTestingClient() {
  const [activeChannel, setActiveChannel] = useState<NotificationChannel | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const stats = getImplementationStats();

  // Filter notifications based on active channel and category
  const filteredNotifications = NOTIFICATION_REGISTRY.filter((notification) => {
    const matchesChannel = activeChannel === "all" || notification.channels[activeChannel] !== undefined;
    const matchesCategory = selectedCategory === "all" || notification.category === selectedCategory;
    return matchesChannel && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Notifications"
          value={stats.total}
          icon={<Activity className="h-4 w-4" />}
          description="Across all channels"
        />
        <StatsCard
          title="Email Templates"
          value={`${stats.byChannel.email.complete}/${stats.byChannel.email.total}`}
          icon={<Mail className="h-4 w-4" />}
          description={`${stats.byChannel.email.missing} missing`}
          status={stats.byChannel.email.complete === stats.byChannel.email.total ? "success" : "warning"}
        />
        <StatsCard
          title="SMS Types"
          value={`${stats.byChannel.sms.complete}/${stats.byChannel.sms.total}`}
          icon={<MessageSquare className="h-4 w-4" />}
          description={`${stats.byChannel.sms.missing} missing`}
          status={stats.byChannel.sms.complete === stats.byChannel.sms.total ? "success" : "error"}
        />
        <StatsCard
          title="Push Notifications"
          value={`${stats.byChannel.push.complete}/${stats.byChannel.push.total}`}
          icon={<Smartphone className="h-4 w-4" />}
          description={`${stats.byChannel.push.missing} missing`}
          status={stats.byChannel.push.complete === stats.byChannel.push.total ? "success" : "error"}
        />
      </div>

      {/* Channel Health Dashboard */}
      <ChannelHealth />

      {/* Channel Tabs */}
      <Tabs defaultValue="all" onValueChange={(value) => setActiveChannel(value as NotificationChannel | "all")}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email ({stats.byChannel.email.total})
          </TabsTrigger>
          <TabsTrigger value="sms">
            <MessageSquare className="h-4 w-4 mr-2" />
            SMS ({stats.byChannel.sms.total})
          </TabsTrigger>
          <TabsTrigger value="in_app">
            <Bell className="h-4 w-4 mr-2" />
            In-App ({stats.byChannel.in_app.total})
          </TabsTrigger>
          <TabsTrigger value="push">
            <Smartphone className="h-4 w-4 mr-2" />
            Push ({stats.byChannel.push.total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeChannel} className="space-y-4 mt-6">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
            </Badge>
            {Object.keys(stats.byCategory).map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => setSelectedCategory(category)}
              >
                {category} ({stats.byCategory[category]})
              </Badge>
            ))}
          </div>

          {/* Notification Test Cards */}
          {filteredNotifications.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredNotifications.map((notification) => (
                <NotificationTestCard
                  key={notification.id}
                  notification={notification}
                  activeChannel={activeChannel}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No notifications found for this filter</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Delivery History */}
      <DeliveryHistory channel={activeChannel === "all" ? undefined : activeChannel} />
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  status?: "success" | "warning" | "error";
}

function StatsCard({ title, value, icon, description, status }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {status && (
            <div className="flex items-center">
              {status === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {status === "warning" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
              {status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
