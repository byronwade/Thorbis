"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { type NotificationDefinition, type NotificationChannel } from "../notification-registry";

interface NotificationTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: NotificationDefinition;
  channel: NotificationChannel;
}

export function NotificationTestDialog({
  open,
  onOpenChange,
  notification,
  channel,
}: NotificationTestDialogProps) {
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const getPlaceholder = () => {
    switch (channel) {
      case "email":
        return "test@example.com";
      case "sms":
        return "+1 (555) 123-4567";
      case "push":
        return "Device ID or subscription endpoint";
      case "in_app":
        return "User ID";
      default:
        return "";
    }
  };

  const getRecipientLabel = () => {
    switch (channel) {
      case "email":
        return "Email Address";
      case "sms":
        return "Phone Number";
      case "push":
        return "Device/Subscription";
      case "in_app":
        return "User ID";
      default:
        return "Recipient";
    }
  };

  const handleSendTest = async () => {
    if (!recipient.trim()) {
      setResult({ success: false, message: "Please enter a recipient" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Call the test API endpoint
      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificationId: notification.id,
          channel,
          recipient,
          testData: notification.testData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          message: data.message || `Test ${channel} notification sent successfully to ${recipient}`,
        });

        // Reset form after success
        setTimeout(() => {
          setRecipient("");
          setResult(null);
          onOpenChange(false);
        }, 2000);
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to send test notification",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to send test notification",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Test Notification</DialogTitle>
          <DialogDescription>
            Send a test {channel} notification for &quot;{notification.name}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">{getRecipientLabel()}</Label>
            <Input
              id="recipient"
              placeholder={getPlaceholder()}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              {channel === "email" && "Enter an email address to receive the test notification"}
              {channel === "sms" && "Enter a phone number in E.164 format (+1234567890)"}
              {channel === "push" && "Enter a push subscription endpoint or device ID"}
              {channel === "in_app" && "Enter a user ID to receive the in-app notification"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Test Data Preview</Label>
            <Textarea
              value={JSON.stringify(notification.testData, null, 2)}
              readOnly
              className="font-mono text-xs h-32"
            />
            <p className="text-xs text-muted-foreground">
              This data will be used to populate the notification template
            </p>
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSendTest} disabled={loading || !recipient.trim()}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Test
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
