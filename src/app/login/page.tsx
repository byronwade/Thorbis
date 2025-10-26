"use client";

import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    // TODO: Implement authentication
  };

  return (
    <div className="h-full w-full">
      <div className="h-dvh lg:grid lg:grid-cols-2">
        {/* Login Form Side */}
        <div className="flex h-full items-center justify-center space-y-6 px-6 py-12 sm:px-6 md:px-8">
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

          <div className="flex w-full max-w-lg flex-col gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <svg
                aria-labelledby="stratos-logo-title"
                className="size-8.5"
                fill="none"
                height="1em"
                viewBox="0 0 328 329"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title id="stratos-logo-title">Stratos Logo</title>
                <rect
                  className="dark:fill-white"
                  fill="black"
                  height="328"
                  rx="164"
                  width="328"
                  y="0.5"
                />
                <path
                  className="dark:stroke-black"
                  d="M165.018 72.3008V132.771C165.018 152.653 148.9 168.771 129.018 168.771H70.2288"
                  stroke="white"
                  strokeWidth="20"
                />
                <path
                  className="dark:stroke-black"
                  d="M166.627 265.241L166.627 204.771C166.627 184.889 182.744 168.771 202.627 168.771L261.416 168.771"
                  stroke="white"
                  strokeWidth="20"
                />
                <line
                  className="dark:stroke-black"
                  stroke="white"
                  strokeWidth="20"
                  x1="238.136"
                  x2="196.76"
                  y1="98.8184"
                  y2="139.707"
                />
                <line
                  className="dark:stroke-black"
                  stroke="white"
                  strokeWidth="20"
                  x1="135.688"
                  x2="94.3128"
                  y1="200.957"
                  y2="241.845"
                />
                <line
                  className="dark:stroke-black"
                  stroke="white"
                  strokeWidth="20"
                  x1="133.689"
                  x2="92.5566"
                  y1="137.524"
                  y2="96.3914"
                />
                <line
                  className="dark:stroke-black"
                  stroke="white"
                  strokeWidth="20"
                  x1="237.679"
                  x2="196.547"
                  y1="241.803"
                  y2="200.671"
                />
              </svg>
              <span className="font-semibold text-xl">Stratos</span>
            </div>

            {/* Welcome Text */}
            <div>
              <h2 className="mb-1.5 font-semibold text-2xl">Welcome Back</h2>
              <p className="text-muted-foreground">
                Welcome back! Access your field service dashboard:
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <Button
                className="grow"
                onClick={() => {
                  // TODO: Implement Google OAuth
                }}
                variant="outline"
              >
                Login with Google
              </Button>
              <Button
                className="grow"
                onClick={() => {
                  // TODO: Implement Facebook OAuth
                }}
                variant="outline"
              >
                Login with Facebook
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <p className="text-muted-foreground text-sm">
                Or sign in with Email
              </p>
              <Separator className="flex-1" />
            </div>

            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label htmlFor="email">Email address*</Label>
                <Input
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  type="email"
                  value={email}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password*</Label>
                <div className="relative">
                  <Input
                    className="pr-9"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <Button
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
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
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={rememberMe}
                    id="rememberMe"
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                  />
                  <Label className="text-sm" htmlFor="rememberMe">
                    Remember Me
                  </Label>
                </div>
                <Link
                  className="text-sm hover:underline"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button className="w-full" type="submit">
                Sign in to Stratos
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-muted-foreground">
              New to Stratos?{" "}
              <Link
                className="text-foreground hover:underline"
                href="/register"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Space-themed Right Side */}
        <div className="h-screen bg-muted p-5 max-lg:hidden">
          <Card className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border border-none bg-primary py-8 text-card-foreground shadow-sm">
            <CardHeader className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-6 px-8 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
              <CardTitle className="font-bold text-4xl text-primary-foreground xl:text-5xl/15.5">
                Welcome back to Stratos!
              </CardTitle>
              <p className="text-primary-foreground text-xl">
                Your field service operations command center awaits. Sign in to
                manage your team, jobs, and customer communications.
              </p>
            </CardHeader>

            {/* Decorative Space Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Space Background Image */}
              <div
                className="absolute inset-0 bg-center bg-cover opacity-20"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&h=800&fit=crop&crop=center')`,
                }}
              />

              {/* Floating Space Elements */}
              <div className="absolute top-20 right-20 h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-xl" />
              <div
                className="absolute bottom-32 left-16 h-24 w-24 animate-pulse rounded-full bg-gradient-to-br from-cyan-400/15 to-indigo-600/15 blur-lg"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute top-1/2 left-1/4 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-pink-400/10 to-violet-600/10 blur-md"
                style={{ animationDelay: "2s" }}
              />

              {/* Stars */}
              <div className="absolute top-16 left-20 h-1 w-1 animate-pulse rounded-full bg-white" />
              <div
                className="absolute top-32 right-32 h-1 w-1 animate-pulse rounded-full bg-white"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute right-16 bottom-20 h-1 w-1 animate-pulse rounded-full bg-white"
                style={{ animationDelay: "1.5s" }}
              />
              <div
                className="absolute top-1/3 left-1/2 h-1 w-1 animate-pulse rounded-full bg-white"
                style={{ animationDelay: "2.5s" }}
              />
            </div>

            {/* Decorative SVG */}
            <svg
              aria-hidden="true"
              className="-left-50 pointer-events-none absolute bottom-30 size-130 text-secondary/10"
              fill="none"
              height="1em"
              viewBox="0 0 128 128"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M63.6734 24.8486V49.3899C63.6734 57.4589 57.1322 64.0001 49.0632 64.0001H25.2041"
                stroke="currentColor"
                strokeWidth="8.11681"
              />
              <path
                d="M64.3266 103.152L64.3266 78.6106C64.3266 70.5416 70.8678 64.0003 78.9368 64.0003L102.796 64.0004"
                stroke="currentColor"
                strokeWidth="8.11681"
              />
              <line
                stroke="currentColor"
                strokeWidth="8.11681"
                x1="93.3468"
                x2="76.555"
                y1="35.6108"
                y2="52.205"
              />
              <line
                stroke="currentColor"
                strokeWidth="8.11681"
                x1="51.7697"
                x2="34.9778"
                y1="77.0624"
                y2="93.6567"
              />
              <line
                stroke="currentColor"
                strokeWidth="8.11681"
                x1="50.9584"
                x2="34.2651"
                y1="51.3189"
                y2="34.6256"
              />
              <line
                stroke="currentColor"
                strokeWidth="8.11681"
                x1="93.1625"
                x2="76.4692"
                y1="93.6397"
                y2="76.9464"
              />
            </svg>

            <CardContent className="relative z-10 mx-8 h-62 overflow-hidden rounded-2xl px-0">
              {/* Card Content Overlay */}
              <div className="absolute top-0 right-0 flex size-15 items-center justify-center rounded-2xl bg-card/80 backdrop-blur-sm">
                <svg
                  aria-hidden="true"
                  className="size-15"
                  fill="none"
                  height="1em"
                  viewBox="0 0 128 128"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M63.6734 24.8486V49.3899C63.6734 57.4589 57.1322 64.0001 49.0632 64.0001H25.2041"
                    stroke="currentColor"
                    strokeWidth="8.11681"
                  />
                  <path
                    d="M64.3266 103.152L64.3266 78.6106C64.3266 70.5416 70.8678 64.0003 78.9368 64.0003L102.796 64.0004"
                    stroke="currentColor"
                    strokeWidth="8.11681"
                  />
                  <line
                    stroke="currentColor"
                    strokeWidth="8.11681"
                    x1="93.3468"
                    x2="76.555"
                    y1="35.6108"
                    y2="52.205"
                  />
                  <line
                    stroke="currentColor"
                    strokeWidth="8.11681"
                    x1="51.7697"
                    x2="34.9778"
                    y1="77.0624"
                    y2="93.6567"
                  />
                  <line
                    stroke="currentColor"
                    strokeWidth="8.11681"
                    x1="50.9584"
                    x2="34.2651"
                    y1="51.3189"
                    y2="34.6256"
                  />
                  <line
                    stroke="currentColor"
                    strokeWidth="8.11681"
                    x1="93.1625"
                    x2="76.4692"
                    y1="93.6397"
                    y2="76.9464"
                  />
                </svg>
              </div>

              <div className="flex flex-col gap-5 rounded-2xl bg-card/60 p-6 backdrop-blur-sm">
                <p className="line-clamp-2 pr-12 font-bold text-3xl">
                  Access Your Field Operations Hub
                </p>
                <p className="line-clamp-2 text-lg">
                  Streamline your field service operations with Stratos. Manage
                  technicians, schedule jobs, and track performance all in one
                  place.
                </p>
                <div className="-space-x-4 flex self-end">
                  <Avatar className="ring-2 ring-background">
                    <AvatarImage
                      alt="Field Technician"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
                    />
                    <AvatarFallback>FT</AvatarFallback>
                  </Avatar>
                  <Avatar className="ring-2 ring-background">
                    <AvatarImage
                      alt="Operations Manager"
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=64&h=64&fit=crop&crop=face"
                    />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <Avatar className="ring-2 ring-background">
                    <AvatarImage
                      alt="Customer Service"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
                    />
                    <AvatarFallback>CS</AvatarFallback>
                  </Avatar>
                  <Avatar className="ring-2 ring-background">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      +2.5K
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
