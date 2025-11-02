/**
 * Email Verification Page - Verify user email with custom token
 *
 * Features:
 * - Validates verification token from URL
 * - Shows success/error messages
 * - Redirects to login after successful verification
 * - Option to resend verification email
 */

import { redirect } from "next/navigation";
import { Suspense } from "react";
import { verifyEmail } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function VerifyEmailContent({ token }: { token: string }) {
  // Verify the email token
  const result = await verifyEmail(token);

  if (!result.success) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Verification Failed</CardTitle>
          <CardDescription>
            {result.error || "Unable to verify your email address"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Your verification link may have expired or already been used. You
            can request a new verification email from the login page.
          </p>
          <div className="flex gap-2">
            <Button asChild className="w-full">
              <a href="/login">Go to Login</a>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <a href="/register">Sign Up Again</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success - show success message and redirect to login
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Email Verified! ✓</CardTitle>
        <CardDescription>
          Your email has been successfully verified
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
          <p className="text-green-900 text-sm dark:text-green-100">
            {result.data?.message ||
              "Your account is now active. You can sign in to get started!"}
          </p>
        </div>

        <p className="text-muted-foreground text-sm">
          Verified email: <strong>{result.data?.email}</strong>
        </p>

        <Button asChild className="w-full">
          <a href="/login">Continue to Login</a>
        </Button>
      </CardContent>
    </Card>
  );
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/login?error=missing_token");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense
        fallback={
          <Card className="mx-auto w-full max-w-md">
            <CardHeader>
              <CardTitle>Verifying Email...</CardTitle>
              <CardDescription>
                Please wait while we verify your email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-8">
                <div className="size-8 animate-spin rounded-full border-primary border-b-2" />
              </div>
            </CardContent>
          </Card>
        }
      >
        <VerifyEmailContent token={token} />
      </Suspense>
    </div>
  );
}
