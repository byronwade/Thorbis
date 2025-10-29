"use client";

import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    // TODO: Implement authentication
  };

  return (
    <div className="h-full w-full">
      <div className="h-dvh lg:grid lg:grid-cols-2">
        {/* Registration Form Side */}
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
              <Image
                src="/ThorbisLogo.webp"
                alt="Thorbis Logo"
                width={34}
                height={34}
                className="size-8.5"
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

            {/* Social Registration Button */}
            <Button
              className="w-full"
              onClick={() => {
                // TODO: Implement Google OAuth
              }}
              variant="outline"
            >
              Login with Google
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
                  id="username"
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your name"
                  required
                  type="text"
                  value={formData.name}
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="userEmail">Email address*</Label>
                <Input
                  id="userEmail"
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  required
                  type="email"
                  value={formData.email}
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password">Password*</Label>
                <div className="relative">
                  <Input
                    className="pr-9"
                    id="password"
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="••••••••••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
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

              {/* Terms Checkbox */}
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={formData.agreeToTerms}
                  id="rememberMe"
                  onCheckedChange={(checked) =>
                    handleInputChange("agreeToTerms", checked)
                  }
                />
                <Label className="text-sm" htmlFor="rememberMe">
                  I agree to all Term, privacy Policy and Fees
                </Label>
              </div>

              {/* Submit Button */}
              <Button className="w-full" type="submit">
                Create Account
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

        {/* Space-themed Right Side */}
        <div className="h-screen bg-muted p-5 max-lg:hidden">
          <Card className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border border-none bg-primary py-8 text-card-foreground shadow-sm">
            <CardHeader className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-6 px-8 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
              <CardTitle className="font-bold text-4xl text-primary-foreground lg:text-5xl/15.5">
                Join the Field Service Revolution
              </CardTitle>
              <p className="text-primary-foreground text-xl">
                Transform your field operations with Thorbis. Join thousands of
                contractors who have streamlined their businesses and improved
                customer satisfaction.
              </p>
            </CardHeader>

            {/* Decorative Space Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Space Background Image */}
              <div
                className="absolute inset-0 bg-center bg-cover opacity-20"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&h=800&fit=crop&crop=center')`,
                }}
              />

              {/* Floating Space Elements */}
              <div className="absolute top-20 right-20 h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-purple-400/20 to-pink-600/20 blur-xl" />
              <div
                className="absolute bottom-32 left-16 h-24 w-24 animate-pulse rounded-full bg-gradient-to-br from-green-400/15 to-blue-600/15 blur-lg"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute top-1/2 left-1/4 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-600/10 blur-md"
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
                  Start Your Free Trial Today
                </p>
                <p className="line-clamp-2 text-lg">
                  Get started with Thorbis for free. No credit card required.
                  Experience the power of modern field service management.
                </p>
                <div className="-space-x-4 flex self-end">
                  <Avatar className="ring-2 ring-background">
                    <AvatarImage
                      alt="Business Owner"
                      src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=64&h=64&fit=crop&crop=face"
                    />
                    <AvatarFallback>BO</AvatarFallback>
                  </Avatar>
                  <Avatar className="ring-2 ring-background">
                    <AvatarImage
                      alt="Field Manager"
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
                    />
                    <AvatarFallback>FM</AvatarFallback>
                  </Avatar>
                  <Avatar className="ring-2 ring-background">
                    <AvatarImage
                      alt="Operations Lead"
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face"
                    />
                    <AvatarFallback>OL</AvatarFallback>
                  </Avatar>
                  <Avatar className="ring-2 ring-background">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      +10K
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
