"use client";

export const dynamic = "force-dynamic";

import {
  AlertCircle,
  Bell,
  Bug,
  CheckCircle2,
  Phone,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePageLayout } from "@/hooks/use-page-layout";
import { useUIStore } from "@/lib/store";

export default function DevelopmentSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [testResults, setTestResults] = useState<
    Array<{ type: string; message: string; timestamp: Date }>
  >([]);
  const { setIncomingCall, addNotification, openModal } = useUIStore();

  // Dev tools handlers
  const handleTestIncomingCall = () => {
    setIncomingCall({
      number: "+1 (555) 123-4567",
      name: "Test Customer",
      avatar: "/placeholder-avatar.jpg",
    });
    addNotification({
      type: "info",
      message: "Test incoming call triggered",
      duration: 3000,
    });
    setTestResults((prev) => [
      ...prev,
      {
        type: "call",
        message: "Incoming call notification triggered",
        timestamp: new Date(),
      },
    ]);
  };

  const handleTestNotification = (
    type: "success" | "error" | "info" | "warning"
  ) => {
    const messages = {
      success: "Test success notification - Operation completed!",
      error: "Test error notification - Something went wrong!",
      info: "Test info notification - Here's some information.",
      warning: "Test warning notification - Please be careful!",
    };

    addNotification({
      type,
      message: messages[type],
      duration: 5000,
    });
    setTestResults((prev) => [
      ...prev,
      {
        type: `notification-${type}`,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} notification triggered`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleTestModal = () => {
    openModal("test-modal", { message: "This is a test modal" });
    addNotification({
      type: "info",
      message: "Test modal opened",
      duration: 3000,
    });
    setTestResults((prev) => [
      ...prev,
      {
        type: "modal",
        message: "Test modal opened",
        timestamp: new Date(),
      },
    ]);
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-yellow-500/10">
            <Bug className="size-6 text-yellow-600 dark:text-yellow-500" />
          </div>
          <div>
            <h1 className="font-bold text-4xl tracking-tight">
              Developer Settings
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">
              Test UI components and trigger events in development mode
            </p>
          </div>
        </div>
      </div>

      {/* Environment Info */}
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
            <AlertCircle className="size-5" />
            Current Environment
          </CardTitle>
          <CardDescription>
            This section is only visible in development mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              NODE_ENV: {process.env.NODE_ENV}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            These tools are only available when running the application in
            development mode and will not be visible in production.
          </p>
        </CardContent>
      </Card>

      {/* Call System Testing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Phone className="size-5 text-green-500" />
            <CardTitle>Call System Testing</CardTitle>
          </div>
          <CardDescription>
            Tests the incoming call notification overlay with controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleTestIncomingCall} variant="outline">
              <Phone className="mr-2 size-4" />
              Trigger Incoming Call
            </Button>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-medium text-sm">What this tests:</p>
            <ul className="mt-2 space-y-1 text-muted-foreground text-sm">
              <li>• Incoming call notification overlay</li>
              <li>• Call control buttons (answer, decline, hold)</li>
              <li>• Caller information display</li>
              <li>• Auto-dismiss functionality</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Notification System Testing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-blue-500" />
            <CardTitle>Notification System Testing</CardTitle>
          </div>
          <CardDescription>
            Tests toast notifications with different states
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleTestNotification("success")}
              variant="outline"
            >
              <CheckCircle2 className="mr-2 size-4 text-green-500" />
              Success
            </Button>
            <Button
              onClick={() => handleTestNotification("error")}
              variant="outline"
            >
              <XCircle className="mr-2 size-4 text-red-500" />
              Error
            </Button>
            <Button
              onClick={() => handleTestNotification("info")}
              variant="outline"
            >
              <AlertCircle className="mr-2 size-4 text-blue-500" />
              Info
            </Button>
            <Button
              onClick={() => handleTestNotification("warning")}
              variant="outline"
            >
              <AlertCircle className="mr-2 size-4 text-yellow-500" />
              Warning
            </Button>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-medium text-sm">What this tests:</p>
            <ul className="mt-2 space-y-1 text-muted-foreground text-sm">
              <li>• Toast notification appearance</li>
              <li>• Different notification types (success, error, info, warning)</li>
              <li>• Auto-dismiss timing</li>
              <li>• Notification stacking</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Modal System Testing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 text-purple-500" />
            <CardTitle>Modal System Testing</CardTitle>
          </div>
          <CardDescription>Tests modal overlay system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleTestModal} variant="outline">
              <AlertCircle className="mr-2 size-4" />
              Open Test Modal
            </Button>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-medium text-sm">What this tests:</p>
            <ul className="mt-2 space-y-1 text-muted-foreground text-sm">
              <li>• Modal overlay appearance</li>
              <li>• Modal backdrop click behavior</li>
              <li>• Modal close functionality</li>
              <li>• Focus management</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Test Results Log */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Test Results Log</CardTitle>
              <Button onClick={clearTestResults} size="sm" variant="outline">
                Clear Log
              </Button>
            </div>
            <CardDescription>
              Recent test events triggered from this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testResults
                .slice()
                .reverse()
                .map((result, index) => (
                  <div
                    className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3"
                    key={index}
                  >
                    <div className="mt-0.5">
                      {result.type === "call" && (
                        <Phone className="size-4 text-green-500" />
                      )}
                      {result.type.startsWith("notification-success") && (
                        <CheckCircle2 className="size-4 text-green-500" />
                      )}
                      {result.type.startsWith("notification-error") && (
                        <XCircle className="size-4 text-red-500" />
                      )}
                      {result.type.startsWith("notification-info") && (
                        <AlertCircle className="size-4 text-blue-500" />
                      )}
                      {result.type.startsWith("notification-warning") && (
                        <AlertCircle className="size-4 text-yellow-500" />
                      )}
                      {result.type === "modal" && (
                        <AlertCircle className="size-4 text-purple-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{result.message}</p>
                      <p className="text-muted-foreground text-xs">
                        {result.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
