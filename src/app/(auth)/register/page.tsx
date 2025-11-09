"use client";

import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
import { signInWithOAuth, signUp } from "@/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createHowToSchema } from "@/lib/seo/structured-data";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const howToSchema = createHowToSchema({
    name: "Create a Thorbis account",
    description:
      "Sign up for Thorbis in three simple steps to start managing your field operations.",
    steps: [
      {
        name: "Enter your contact information",
        text: "Provide your name and business email so we can set up your workspace.",
      },
      {
        name: "Create a secure password",
        text: "Use at least eight characters with uppercase, lowercase, and a number for security.",
      },
      {
        name: "Accept terms and create account",
        text: "Agree to the Thorbis terms, privacy policy, and fees to finalize your account.",
      },
    ],
    supplies: ["Business email address"],
    tools: ["Thorbis web app"],
    totalTime: "PT5M",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData(e.currentTarget);
      console.log("📝 Submitting signup form...");

      const result = await signUp(formData);
      console.log("📨 Signup result:", result);

      if (!result.success && result.error) {
        console.error("❌ Signup error:", result.error);
        setError(result.error);
        setIsLoading(false);
      } else if (result.success && result.data?.requiresEmailConfirmation) {
        console.log("📧 Email confirmation required");
        setSuccess(result.data.message);
        setIsLoading(false);
      } else if (result.success) {
        console.log("✅ Signup successful, should redirect...");
        // Server action should redirect
      }
      // If successful and no email confirmation required, the server action will redirect
    } catch (err) {
      console.error("💥 Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signInWithOAuth(provider);

      // If result is undefined, the redirect is happening (success case)
      // If result exists and has an error, show it
      if (result && !result.success && result.error) {
        setError(result.error);
        setIsLoading(false);
      }
      // If successful, the server action will redirect to OAuth provider
      // Keep loading spinner active during redirect
    } catch (err) {
      // Ignore NEXT_REDIRECT errors - these are expected during successful OAuth
      if (err instanceof Error && err.message === "NEXT_REDIRECT") {
        return; // Let the redirect happen, keep loading state
      }

      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background md:items-center md:justify-center">
      <Script
        id="register-howto-schema"
        strategy="afterInteractive"
        type="application/ld+json"
      >
        {JSON.stringify(howToSchema)}
      </Script>

      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="pointer-events-none absolute top-0 left-1/4 size-[600px] animate-pulse rounded-full bg-primary/10 opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 bottom-0 size-[600px] animate-pulse rounded-full bg-blue-500/10 opacity-40 blur-3xl delay-1000" />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <Link
          className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          href="/"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Home</span>
        </Link>
      </div>

      {/* Centered Content - Full width on mobile, centered on desktop */}
      <div className="w-full px-4 py-12 sm:px-6 md:w-auto md:max-w-md lg:px-8">
        <div className="flex w-full flex-col gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                alt="Thorbis Logo"
                className="size-8.5"
                height={34}
                src="/ThorbisLogo.webp"
                width={34}
              />
              <span className="font-semibold text-xl">Thorbis</span>
            </div>

            {/* Welcome Text */}
            <div>
              <h2 className="mb-1.5 font-semibold text-2xl">
                Create Your Account
              </h2>
              <p className="text-muted-foreground">
                Join thousands of field service professionals using Thorbis
              </p>
            </div>

            {/* Error/Success Alerts */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 backdrop-blur-sm">
                {/* Animated background effect */}
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5" />

                {/* Content */}
                <div className="relative flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">Check Your Email</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {success}
                    </p>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <div className="h-1 w-1 animate-pulse rounded-full bg-blue-500" />
                      <span>Didn't receive it? Check your spam folder</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Registration Button */}
            <Button
              className="w-full"
              disabled={isLoading}
              onClick={() => handleOAuthSignUp("google")}
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Sign up with Google
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <p className="text-muted-foreground text-sm">or</p>
              <Separator className="flex-1" />
            </div>

            {/* Registration Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="space-y-1">
                <Label htmlFor="username">Name*</Label>
                <Input
                  disabled={isLoading}
                  id="username"
                  name="name"
                  placeholder="Enter your name"
                  required
                  type="text"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="userEmail">Email address*</Label>
                <Input
                  disabled={isLoading}
                  id="userEmail"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  type="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password">Password*</Label>
                <div className="relative">
                  <Input
                    className="pr-9"
                    disabled={isLoading}
                    id="password"
                    name="password"
                    placeholder="••••••••••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                  />
                  <Button
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    disabled={isLoading}
                    onClick={() => setShowPassword(!showPassword)}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  Must be 8+ characters with uppercase, lowercase, and number
                </p>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-3">
                <Checkbox
                  disabled={isLoading}
                  id="rememberMe"
                  name="terms"
                  required
                />
                <Label className="text-sm" htmlFor="rememberMe">
                  I agree to all Terms, Privacy Policy and Fees
                </Label>
              </div>

              {/* Submit Button */}
              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-muted-foreground">
              Already have an account?{" "}
              <Link className="text-foreground hover:underline" href="/login">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


