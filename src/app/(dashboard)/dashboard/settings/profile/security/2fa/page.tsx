"use client";

export const dynamic = "force-dynamic";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Copy,
  Download,
  Key,
  QrCode,
  RefreshCw,
  Shield,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageLayout } from "@/hooks/use-page-layout";

export default function TwoFactorAuthPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [setupStep, setSetupStep] = useState<"setup" | "verify" | "complete">(
    "setup"
  );
  const [verificationCode, setVerificationCode] = useState("");

  const backupCodes = [
    "A1B2C3D4",
    "E5F6G7H8",
    "I9J0K1L2",
    "M3N4O5P6",
    "Q7R8S9T0",
    "U1V2W3X4",
    "Y5Z6A7B8",
    "C9D0E1F2",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/settings/profile/security">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Two-Factor Authentication
          </h1>
          <p className="text-muted-foreground">
            Add an extra layer of security to your account
          </p>
        </div>
      </div>

      {/* Setup Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Setup Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-sm">Download App</span>
            </div>
            <div className="h-0.5 w-8 bg-green-500" />
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  setupStep === "setup"
                    ? "animate-pulse bg-blue-500"
                    : setupStep === "verify"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
              >
                {setupStep === "setup" ? (
                  <QrCode className="h-4 w-4 text-white" />
                ) : setupStep === "verify" ? (
                  <Key className="h-4 w-4 text-white" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-white" />
                )}
              </div>
              <span className="font-medium text-sm">
                {setupStep === "setup"
                  ? "Scan QR Code"
                  : setupStep === "verify"
                    ? "Enter Code"
                    : "Complete"}
              </span>
            </div>
            <div
              className={`h-0.5 w-8 ${setupStep === "complete" ? "bg-green-500" : "bg-gray-200"}`}
            />
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  setupStep === "complete" ? "bg-green-500" : "bg-gray-200"
                }`}
              >
                <CheckCircle
                  className={`h-4 w-4 ${setupStep === "complete" ? "text-white" : "text-gray-400"}`}
                />
              </div>
              <span
                className={`font-medium text-sm ${setupStep === "complete" ? "text-green-600" : "text-gray-400"}`}
              >
                Backup Codes
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {setupStep === "setup" && (
        <div className="grid gap-8 md:grid-cols-2">
          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Setup Instructions
              </CardTitle>
              <CardDescription>
                Follow these steps to enable 2FA on your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 font-medium text-sm text-white">
                    1
                  </div>
                  <div>
                    <div className="font-medium">
                      Download an authenticator app
                    </div>
                    <div className="mt-1 text-muted-foreground text-sm">
                      Install Google Authenticator, Authy, or similar app on
                      your phone
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 font-medium text-sm text-white">
                    2
                  </div>
                  <div>
                    <div className="font-medium">Scan the QR code</div>
                    <div className="mt-1 text-muted-foreground text-sm">
                      Open your authenticator app and scan the code shown
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 font-medium text-sm text-white">
                    3
                  </div>
                  <div>
                    <div className="font-medium">Enter verification code</div>
                    <div className="mt-1 text-muted-foreground text-sm">
                      Enter the 6-digit code from your app to verify setup
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    Recommended Apps
                  </span>
                </div>
                <div className="mt-2 flex gap-2">
                  <Badge variant="secondary">Google Authenticator</Badge>
                  <Badge variant="secondary">Authy</Badge>
                  <Badge variant="secondary">Microsoft Authenticator</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Scan QR Code
              </CardTitle>
              <CardDescription>
                Scan this code with your authenticator app
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-4">
                <div className="grid h-full w-full grid-cols-8 gap-0.5 rounded bg-gradient-to-br from-black to-gray-800 p-2">
                  {/* QR Code Pattern Simulation */}
                  <div className="bg-white" />
                  <div className="bg-black" />
                  <div className="bg-white" />
                  <div className="bg-black" />
                  <div className="bg-white" />
                  <div className="bg-black" />
                  <div className="bg-white" />
                  <div className="bg-black" />

                  <div className="bg-black" />
                  <div className="bg-white" />
                  <div className="bg-black" />
                  <div className="bg-white" />
                  <div className="bg-black" />
                  <div className="bg-white" />
                  <div className="bg-black" />
                  <div className="bg-white" />

                  <div className="col-span-8 row-span-2 bg-white" />

                  <div className="col-span-2 bg-black" />
                  <div className="col-span-2 bg-white" />
                  <div className="bg-black" />
                  <div className="col-span-2 bg-white" />
                  <div className="bg-black" />

                  <div className="col-span-8 bg-white" />

                  <div className="bg-black" />
                  <div className="col-span-2 bg-white" />
                  <div className="col-span-2 bg-black" />
                  <div className="col-span-2 bg-white" />
                  <div className="bg-black" />

                  <div className="col-span-8 row-span-2 bg-white" />

                  <div className="col-span-8 bg-black" />
                </div>
              </div>

              <div className="space-y-2 text-center">
                <p className="rounded bg-gray-100 px-3 py-1 font-mono text-sm dark:bg-gray-800">
                  Stratos:john@example.com
                </p>
                <Button size="sm" variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate Code
                </Button>
              </div>

              <Button onClick={() => setSetupStep("verify")}>
                I've Scanned the Code
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {setupStep === "verify" && (
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Enter Verification Code
            </CardTitle>
            <CardDescription>
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                className="text-center font-mono text-lg"
                id="verificationCode"
                maxLength={6}
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, ""))
                }
                placeholder="000000"
                value={verificationCode}
              />
            </div>

            <div className="text-center">
              <p className="mb-4 text-muted-foreground text-sm">
                Can't see the code? Check your authenticator app.
              </p>
              <Button
                className="w-full"
                onClick={() => setSetupStep("complete")}
              >
                Verify Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {setupStep === "complete" && (
        <div className="space-y-8">
          {/* Success Message */}
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 text-lg dark:text-green-200">
                    Two-Factor Authentication Enabled!
                  </h3>
                  <p className="text-green-600 dark:text-green-300">
                    Your account is now more secure
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup Codes */}
          <Card>
            <CardHeader>
              <CardTitle>Save Your Backup Codes</CardTitle>
              <CardDescription>
                Save these backup codes in a safe place. You can use them to
                access your account if you lose your phone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {backupCodes.map((code, index) => (
                  <div
                    className="rounded border bg-gray-50 p-3 text-center font-mono text-sm dark:bg-gray-800"
                    key={index}
                  >
                    {code}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download Codes
                </Button>
                <Button className="flex-1" variant="outline">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Codes
                </Button>
              </div>

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600" />
                  <div className="text-sm">
                    <div className="font-medium text-yellow-800 dark:text-yellow-200">
                      Important Security Notice
                    </div>
                    <div className="mt-1 text-yellow-700 dark:text-yellow-300">
                      Each backup code can only be used once. Store them
                      securely and treat them like passwords.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 2FA Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Use Two-Factor Authentication?</CardTitle>
          <CardDescription>
            Benefits of enabling 2FA on your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div className="font-medium">Enhanced Security</div>
              <div className="text-muted-foreground text-sm">
                Protects against unauthorized access even if your password is
                compromised
              </div>
            </div>

            <div className="space-y-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="font-medium">Industry Standard</div>
              <div className="text-muted-foreground text-sm">
                Recommended by security experts and required by many
                organizations
              </div>
            </div>

            <div className="space-y-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Smartphone className="h-6 w-6 text-purple-600" />
              </div>
              <div className="font-medium">Easy to Use</div>
              <div className="text-muted-foreground text-sm">
                Simply enter a code from your phone when signing in
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
