"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MessageSquare,
  Bell,
  Smartphone,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  RotateCw,
} from "lucide-react";
import { type NotificationChannel } from "../notification-registry";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface DeliveryHistoryProps {
  channel?: NotificationChannel;
}

// Mock data - replace with actual API call
const getMockDeliveryHistory = (channel?: NotificationChannel) => {
  const allHistory = [
    {
      id: "1",
      notificationName: "Welcome Email",
      channel: "email" as NotificationChannel,
      recipient: "test@example.com",
      status: "sent" as const,
      sentAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      attempts: 1,
      errorMessage: null,
    },
    {
      id: "2",
      notificationName: "Appointment Confirmation",
      channel: "sms" as NotificationChannel,
      recipient: "+1 (555) 123-4567",
      status: "failed" as const,
      sentAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      attempts: 3,
      errorMessage: "Invalid phone number format",
    },
    {
      id: "3",
      notificationName: "Job Completion",
      channel: "in_app" as NotificationChannel,
      recipient: "user_123",
      status: "sent" as const,
      sentAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      attempts: 1,
      errorMessage: null,
    },
    {
      id: "4",
      notificationName: "Payment Received",
      channel: "email" as NotificationChannel,
      recipient: "customer@example.com",
      status: "pending" as const,
      sentAt: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
      attempts: 0,
      errorMessage: null,
    },
    {
      id: "5",
      notificationName: "Technician En Route",
      channel: "push" as NotificationChannel,
      recipient: "device_xyz",
      status: "sent" as const,
      sentAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      attempts: 1,
      errorMessage: null,
    },
  ];

  return channel ? allHistory.filter((h) => h.channel === channel) : allHistory;
};

export function DeliveryHistory({ channel }: DeliveryHistoryProps) {
  const [history, setHistory] = useState(getMockDeliveryHistory(channel));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setHistory(getMockDeliveryHistory(channel));
    setIsRefreshing(false);
  };

  const handleRetry = async (id: string) => {
    console.log("Retrying notification:", id);
    // TODO: Implement retry logic
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Delivery History</CardTitle>
            <CardDescription>
              Recent notification sends {channel && `for ${channel} channel`}
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Notification</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No delivery history found
                    {channel && ` for ${channel} channel`}
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.notificationName}</TableCell>
                    <TableCell>
                      <ChannelBadge channel={item.channel} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{item.recipient}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} errorMessage={item.errorMessage} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDistanceToNow(item.sentAt, { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-center">{item.attempts}</TableCell>
                    <TableCell>
                      {item.status === "failed" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRetry(item.id)}
                        >
                          <RotateCw className="h-4 w-4 mr-1" />
                          Retry
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {history.length > 0 && (
          <div className="mt-4 text-xs text-muted-foreground text-center">
            Showing {history.length} recent notifications
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChannelBadge({ channel }: { channel: NotificationChannel }) {
  const config = {
    email: { icon: <Mail className="h-3 w-3" />, color: "bg-blue-100 text-blue-700" },
    sms: { icon: <MessageSquare className="h-3 w-3" />, color: "bg-green-100 text-green-700" },
    in_app: { icon: <Bell className="h-3 w-3" />, color: "bg-purple-100 text-purple-700" },
    push: { icon: <Smartphone className="h-3 w-3" />, color: "bg-orange-100 text-orange-700" },
  };

  const { icon, color } = config[channel];

  return (
    <Badge variant="secondary" className={`flex items-center gap-1 w-fit ${color}`}>
      {icon}
      <span className="capitalize">{channel.replace("_", "-")}</span>
    </Badge>
  );
}

interface StatusBadgeProps {
  status: "sent" | "pending" | "failed";
  errorMessage?: string | null;
}

function StatusBadge({ status, errorMessage }: StatusBadgeProps) {
  const config = {
    sent: {
      icon: <CheckCircle2 className="h-3 w-3" />,
      color: "bg-green-100 text-green-700 border-green-300",
      label: "Sent",
    },
    pending: {
      icon: <Clock className="h-3 w-3" />,
      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
      label: "Pending",
    },
    failed: {
      icon: <XCircle className="h-3 w-3" />,
      color: "bg-red-100 text-red-700 border-red-300",
      label: "Failed",
    },
  };

  const { icon, color, label } = config[status];

  return (
    <div className="flex flex-col gap-1">
      <Badge variant="outline" className={`flex items-center gap-1 w-fit ${color}`}>
        {icon}
        <span>{label}</span>
      </Badge>
      {errorMessage && (
        <p className="text-xs text-red-600 max-w-xs truncate" title={errorMessage}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
