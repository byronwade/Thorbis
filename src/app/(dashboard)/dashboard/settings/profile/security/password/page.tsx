"use client";

/**
 * Settings > Profile > Security > Password Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Key,
  Shield,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Constants
const MIN_PASSWORD_LENGTH = 8;
const VERY_WEAK_PASSWORD_LENGTH = 4;
const FAIR_THRESHOLD = 60;
const GOOD_THRESHOLD = 80;

// Regex patterns for password validation
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
      )
      .regex(
        UPPERCASE_REGEX,
        "Password must contain at least one uppercase letter"
      )
      .regex(
        LOWERCASE_REGEX,
        "Password must contain at least one lowercase letter"
      )
      .regex(NUMBER_REGEX, "Password must contain at least one number")
      .regex(
        SPECIAL_CHAR_REGEX,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function PasswordPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = form.watch("newPassword");

  const passwordRequirements = [
    {
      text: `At least ${MIN_PASSWORD_LENGTH} characters`,
      met: newPassword.length >= MIN_PASSWORD_LENGTH,
    },
    {
      text: "Contains uppercase letter",
      met: UPPERCASE_REGEX.test(newPassword),
    },
    {
      text: "Contains lowercase letter",
      met: LOWERCASE_REGEX.test(newPassword),
    },
    { text: "Contains number", met: NUMBER_REGEX.test(newPassword) },
    {
      text: "Contains special character",
      met: SPECIAL_CHAR_REGEX.test(newPassword),
    },
  ];

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) {
      return { score: 0, label: "Enter password", color: "bg-gray-200" };
    }
    if (password.length < VERY_WEAK_PASSWORD_LENGTH) {
      return { score: 20, label: "Very Weak", color: "bg-red-500" };
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return { score: 40, label: "Weak", color: "bg-red-400" };
    }

    const POINTS_PER_REQUIREMENT = 20;

    const score =
      passwordRequirements.filter((req) => req.met).length *
      POINTS_PER_REQUIREMENT;
    if (score < FAIR_THRESHOLD) {
      return { score, label: "Fair", color: "bg-yellow-500" };
    }
    if (score < GOOD_THRESHOLD) {
      return { score, label: "Good", color: "bg-blue-500" };
    }
    return { score, label: "Strong", color: "bg-green-500" };
  };

  const strength = getPasswordStrength(newPassword);

  function onSubmit(_values: PasswordFormData) {}

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
          <h1 className="font-bold text-3xl tracking-tight">Change Password</h1>
          <p className="text-muted-foreground">
            Update your password to keep your account secure
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Password Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Update Password
            </CardTitle>
            <CardDescription>
              Choose a strong password that you haven't used before
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your current password"
                            type={showCurrentPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            className="-translate-y-1/2 absolute top-1/2 right-2 h-7 w-7"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your new password"
                            type={showNewPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            className="-translate-y-1/2 absolute top-1/2 right-2 h-7 w-7"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>

                      {/* Password Strength Indicator */}
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            Password Strength
                          </span>
                          <span
                            className={`font-medium text-sm ${
                              strength.score < FAIR_THRESHOLD
                                ? "text-red-500"
                                : strength.score < GOOD_THRESHOLD
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }`}
                          >
                            {strength.label}
                          </span>
                        </div>
                        <Progress className="h-2" value={strength.score} />
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Confirm your new password"
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            className="-translate-y-1/2 absolute top-1/2 right-2 h-7 w-7"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Password Requirements */}
                <div className="space-y-3">
                  <Label className="font-medium text-sm">
                    Password Requirements
                  </Label>
                  <div className="space-y-2">
                    {passwordRequirements.map((requirement, index) => (
                      <div
                        className="flex items-center gap-2"
                        key={`req-${index}`}
                      >
                        {requirement.met ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-300" />
                        )}
                        <span
                          className={`text-sm ${
                            requirement.met
                              ? "text-green-700 dark:text-green-300"
                              : "text-gray-500"
                          }`}
                        >
                          {requirement.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit">
                    <Shield className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                  <Button asChild type="button" variant="outline">
                    <Link href="/dashboard/settings/profile/security">
                      Cancel
                    </Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Security Tips
            </CardTitle>
            <CardDescription>
              Best practices for password security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                <div className="text-sm">
                  Use a unique password for this account
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                <div className="text-sm">
                  Combine letters, numbers, and symbols
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="mt-0.5 h-4 w-4 text-red-500" />
                <div className="text-sm">Avoid common words or patterns</div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="mt-0.5 h-4 w-4 text-red-500" />
                <div className="text-sm">
                  Don't reuse passwords from other sites
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                <div className="text-sm">Consider using a password manager</div>
              </div>
            </div>

            <Separator />

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="font-medium text-blue-800 text-sm dark:text-blue-200">
                Last changed 30 days ago
              </div>
              <div className="text-blue-600 text-sm dark:text-blue-300">
                Password age is within recommended range
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Password Changes</CardTitle>
          <CardDescription>
            History of password updates for security auditing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="font-medium">Password Changed</div>
                <div className="text-muted-foreground text-sm">30 days ago</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm">Strong</div>
                <div className="text-muted-foreground text-xs">
                  12 characters
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="font-medium">Password Changed</div>
                <div className="text-muted-foreground text-sm">90 days ago</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm">Good</div>
                <div className="text-muted-foreground text-xs">
                  10 characters
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="font-medium">Password Changed</div>
                <div className="text-muted-foreground text-sm">
                  150 days ago
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm">Fair</div>
                <div className="text-muted-foreground text-xs">
                  8 characters
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
