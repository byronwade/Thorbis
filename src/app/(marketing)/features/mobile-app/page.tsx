import { Camera, CheckCircle2, Cloud, FileText, MapPin, Smartphone, Wifi, WifiOff, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  generateBreadcrumbStructuredData,
  generateMetadata as generateSEOMetadata,
  generateServiceStructuredData,
  siteUrl,
} from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata = generateSEOMetadata({
  title: "Mobile Field Service App - Offline-First | Thorbis",
  section: "Features",
  description:
    "Empower your technicians with a mobile app that works anywhere. Offline checklists, photo capture, digital signatures, and instant sync when back online.",
  path: "/features/mobile-app",
  keywords: [
    "field service mobile app",
    "offline field app",
    "technician mobile software",
    "field service app",
    "mobile work orders",
  ],
});

export default function MobileAppPage() {
  const serviceStructuredData = generateServiceStructuredData({
    name: "Mobile Field App",
    description:
      "Offline-first mobile experience for field technicians",
    offers: [
      {
        price: "100",
        currency: "USD",
        description: "Included in Thorbis platform starting at $100/month",
      },
    ],
  });

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: "Home", url: siteUrl },
              { name: "Features", url: `${siteUrl}/features` },
              {
                name: "Mobile Field App",
                url: `${siteUrl}/features/mobile-app`,
              },
            ])
          ),
        }}
        id="mobile-app-breadcrumb-ld"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
        id="mobile-app-service-ld"
        type="application/ld+json"
      />

      {/* Hero Section - Mobile-First Design */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge className="mb-6 gap-1.5 px-3 py-1.5" variant="secondary">
                <Smartphone className="size-3.5" />
                Mobile-First
              </Badge>
              <h1 className="mb-6 font-bold text-5xl tracking-tight sm:text-6xl lg:text-7xl">
                Your office in every technician's pocket
              </h1>
              <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                Everything your field team needs to complete jobs, capture data, and get paid—even without internet. 
                Works offline, syncs automatically.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button asChild className="shadow-lg shadow-primary/20" size="lg">
                  <Link href="/register">
                    Start Free Trial
                    <Zap className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/contact">
                    Request Demo
                  </Link>
                </Button>
              </div>

              {/* App Store Badges */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Badge className="gap-2 px-4 py-2" variant="secondary">
                  <Smartphone className="size-4" />
                  iOS & Android
                </Badge>
                <Badge className="gap-2 px-4 py-2" variant="secondary">
                  <WifiOff className="size-4" />
                  Works Offline
                </Badge>
                <Badge className="gap-2 px-4 py-2" variant="secondary">
                  <Cloud className="size-4" />
                  Auto-Sync
                </Badge>
              </div>
            </div>

            {/* Mobile Phone Mockup */}
            <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative overflow-hidden rounded-[3rem] border-8 border-foreground/10 bg-background shadow-2xl">
                  <div className="aspect-[9/19.5]">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between bg-background px-6 py-3">
                      <span className="text-xs">9:41 AM</span>
                      <div className="flex items-center gap-1">
                        <Wifi className="size-3" />
                        <span className="text-xs">100%</span>
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="bg-gradient-to-b from-primary/5 to-background p-4">
                      {/* Job Card */}
                      <div className="mb-4 overflow-hidden rounded-2xl border bg-background shadow-lg">
                        <div className="border-b bg-primary/5 px-4 py-3">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-semibold text-sm">AC Repair</span>
                            <Badge className="h-5 text-[10px]" variant="secondary">
                              In Progress
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <MapPin className="size-3" />
                            <span>123 Oak Street, Austin TX</span>
                          </div>
                        </div>

                        <div className="space-y-3 p-4">
                          {/* Checklist Items */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="flex size-5 items-center justify-center rounded-full bg-green-500">
                                <CheckCircle2 className="size-3 text-white" />
                              </div>
                              <span className="text-sm line-through opacity-60">
                                Inspect unit
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex size-5 items-center justify-center rounded-full bg-green-500">
                                <CheckCircle2 className="size-3 text-white" />
                              </div>
                              <span className="text-sm line-through opacity-60">
                                Check refrigerant
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="size-5 rounded-full border-2 border-border" />
                              <span className="font-medium text-sm">
                                Replace filter
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="size-5 rounded-full border-2 border-border" />
                              <span className="text-sm">Test system</span>
                            </div>
                          </div>

                          {/* Photo Grid */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="aspect-square rounded-lg bg-muted" />
                            <div className="aspect-square rounded-lg bg-muted" />
                            <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border">
                              <Camera className="size-4 text-muted-foreground" />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <button className="rounded-lg border bg-background px-3 py-2 text-xs font-medium transition-colors hover:bg-accent" type="button">
                              <Camera className="mx-auto mb-1 size-4" />
                              Add Photo
                            </button>
                            <button className="rounded-lg border bg-background px-3 py-2 text-xs font-medium transition-colors hover:bg-accent" type="button">
                              <FileText className="mx-auto mb-1 size-4" />
                              Get Signature
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Complete Button */}
                      <button className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground text-sm shadow-lg" type="button">
                        Complete Job
                      </button>
                    </div>
                  </div>
                </div>

                {/* Offline Indicator */}
                <div className="absolute -right-4 top-20 flex items-center gap-2 rounded-full border border-orange-500/50 bg-orange-500/10 px-4 py-2 backdrop-blur-sm">
                  <WifiOff className="size-4 text-orange-600 dark:text-orange-400" />
                  <span className="font-semibold text-orange-700 text-xs dark:text-orange-400">
                    Offline Mode
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">100%</div>
              <div className="font-medium text-muted-foreground text-sm">
                Offline Capable
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">45 min</div>
              <div className="font-medium text-muted-foreground text-sm">
                Faster Job Completion
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">95%</div>
              <div className="font-medium text-muted-foreground text-sm">
                Tech Adoption Rate
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">Zero</div>
              <div className="font-medium text-muted-foreground text-sm">
                Paperwork Delays
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
              Built for the field, not the office
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Every feature designed for technicians working in basements, on rooftops, and everywhere in between
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <WifiOff className="size-6 text-primary" />
                </div>
                <CardTitle>True Offline Mode</CardTitle>
                <CardDescription>
                  Complete jobs, capture data, and process payments without internet connectivity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>All job data cached locally</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Automatic sync when online</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Conflict resolution</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Camera className="size-6 text-primary" />
                </div>
                <CardTitle>Photo Documentation</CardTitle>
                <CardDescription>
                  Capture before/after photos with automatic organization and cloud backup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Unlimited photo storage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Auto-compression & upload</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Photo annotations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-6 text-primary" />
                </div>
                <CardTitle>Digital Signatures</CardTitle>
                <CardDescription>
                  Get customer approval instantly with legally binding digital signatures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Touch or stylus support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Timestamp & GPS stamping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Instant PDF generation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle2 className="size-6 text-primary" />
                </div>
                <CardTitle>Smart Checklists</CardTitle>
                <CardDescription>
                  Customizable checklists that ensure nothing gets missed on every job
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Job-type specific templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Required vs. optional items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Conditional logic</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="size-6 text-primary" />
                </div>
                <CardTitle>GPS Navigation</CardTitle>
                <CardDescription>
                  One-tap navigation to job sites with real-time traffic updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Google Maps integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Turn-by-turn directions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Arrival notifications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Smartphone className="size-6 text-primary" />
                </div>
                <CardTitle>Mobile Payments</CardTitle>
                <CardDescription>
                  Accept credit cards, checks, and cash right from the mobile app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Tap-to-pay support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Digital receipts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Split payments</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary/90 py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
            Empower your field team today
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
            Give your technicians the tools they need to work faster, smarter, and more professionally.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild className="bg-background text-foreground shadow-lg hover:bg-background/90" size="lg">
              <Link href="/register">
                Start Free Trial
                <Zap className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild className="border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20" size="lg" variant="outline">
              <Link href="/contact">
                See Mobile Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

