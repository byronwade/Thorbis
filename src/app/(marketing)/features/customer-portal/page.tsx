import { Calendar, CheckCircle2, CreditCard, FileText, MessageSquare, Phone, Shield, Smartphone, Star, Users, Zap } from "lucide-react";
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
  title: "Branded Customer Portal - Self-Service Hub | Thorbis",
  section: "Features",
  description:
    "Give customers 24/7 self-service access. Book appointments, pay invoices, track jobs, and communicate—all from a branded portal that makes you look professional.",
  path: "/features/customer-portal",
  keywords: [
    "customer portal",
    "self-service booking",
    "customer self-service",
    "online booking portal",
    "service business portal",
  ],
});

export default function CustomerPortalPage() {
  const serviceStructuredData = generateServiceStructuredData({
    name: "Customer Portal",
    description:
      "Branded self-service booking, payments, and job updates",
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
                name: "Customer Portal",
                url: `${siteUrl}/features/customer-portal`,
              },
            ])
          ),
        }}
        id="customer-portal-breadcrumb-ld"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
        id="customer-portal-service-ld"
        type="application/ld+json"
      />

      {/* Hero Section with Portal Preview */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/10 via-background to-blue-500/10" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.15),_transparent_50%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge className="mb-6 gap-1.5 px-3 py-1.5" variant="secondary">
                <Users className="size-3.5" />
                Self-Service Portal
              </Badge>
              <h1 className="mb-6 font-bold text-5xl tracking-tight sm:text-6xl lg:text-7xl">
                Your customers' command center
              </h1>
              <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                A beautiful, branded portal where customers can book, pay, and track jobs 24/7. 
                Reduce phone calls, speed up payments, and look more professional—all at once.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button asChild className="shadow-lg shadow-primary/20" size="lg">
                  <Link href="/register">
                    Launch Your Portal
                    <Zap className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/contact">
                    See Live Demo
                  </Link>
                </Button>
              </div>

              {/* Key Benefits */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="size-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">65% Fewer Calls</div>
                    <div className="text-muted-foreground text-xs">Self-service booking</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="size-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">2x Faster Payment</div>
                    <div className="text-muted-foreground text-xs">One-click pay</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Portal Preview */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border-2 border-border/50 bg-background shadow-2xl">
                {/* Portal Header */}
                <div className="border-b border-border/50 bg-gradient-to-r from-primary/10 to-transparent px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
                        <span className="font-bold text-primary-foreground text-xl">R</span>
                      </div>
                      <div>
                        <div className="font-semibold">Rodriguez HVAC</div>
                        <div className="text-muted-foreground text-xs">Customer Portal</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                        <span className="font-semibold text-xs">SJ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Portal Navigation */}
                <div className="flex border-b border-border/50 bg-muted/20">
                  <button className="border-b-2 border-primary bg-primary/5 px-4 py-3 font-medium text-sm" type="button">
                    Dashboard
                  </button>
                  <button className="px-4 py-3 text-muted-foreground text-sm transition-colors hover:bg-muted/40" type="button">
                    Appointments
                  </button>
                  <button className="px-4 py-3 text-muted-foreground text-sm transition-colors hover:bg-muted/40" type="button">
                    Invoices
                  </button>
                  <button className="px-4 py-3 text-muted-foreground text-sm transition-colors hover:bg-muted/40" type="button">
                    History
                  </button>
                </div>

                {/* Portal Content */}
                <div className="p-6">
                  {/* Welcome Message */}
                  <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <div className="mb-2 font-semibold text-sm">Welcome back, Sarah!</div>
                    <p className="text-muted-foreground text-xs">
                      Your next maintenance is due in 3 weeks. Book now and save 10%.
                    </p>
                    <Button className="mt-3" size="sm">
                      Schedule Maintenance
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="mb-6">
                    <div className="mb-3 font-semibold text-sm">Quick Actions</div>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 transition-all hover:border-primary/50 hover:bg-primary/5" type="button">
                        <Calendar className="size-6 text-primary" />
                        <span className="font-medium text-xs">Book Service</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 transition-all hover:border-primary/50 hover:bg-primary/5" type="button">
                        <CreditCard className="size-6 text-primary" />
                        <span className="font-medium text-xs">Pay Invoice</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 transition-all hover:border-primary/50 hover:bg-primary/5" type="button">
                        <MessageSquare className="size-6 text-primary" />
                        <span className="font-medium text-xs">Contact Us</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 transition-all hover:border-primary/50 hover:bg-primary/5" type="button">
                        <FileText className="size-6 text-primary" />
                        <span className="font-medium text-xs">View History</span>
                      </button>
                    </div>
                  </div>

                  {/* Upcoming Appointment */}
                  <div className="mb-4">
                    <div className="mb-3 font-semibold text-sm">Upcoming Appointment</div>
                    <div className="rounded-lg border bg-background p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <div className="mb-1 font-semibold text-sm">AC Maintenance</div>
                          <div className="text-muted-foreground text-xs">
                            Tomorrow, 2:00 PM - 4:00 PM
                          </div>
                        </div>
                        <Badge className="bg-green-500" variant="secondary">
                          Confirmed
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Users className="size-3" />
                        <span>Tech: Mike Rodriguez</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button className="flex-1" size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button className="flex-1" size="sm" variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Outstanding Invoice */}
                  <div>
                    <div className="mb-3 font-semibold text-sm">Outstanding Balance</div>
                    <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <div className="mb-1 font-semibold text-sm">Invoice #2847</div>
                          <div className="text-muted-foreground text-xs">
                            Due: Jan 15, 2024
                          </div>
                        </div>
                        <div className="font-bold text-lg">$621.36</div>
                      </div>
                      <Button className="mt-3 w-full" size="sm">
                        <CreditCard className="mr-2 size-4" />
                        Pay Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -right-4 top-1/4 hidden rounded-xl border border-primary/50 bg-background p-4 shadow-2xl lg:block">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary">
                    <Smartphone className="size-3 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-sm">Mobile-First</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Looks perfect on any device
                </p>
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
              <div className="mb-2 font-bold text-4xl text-primary">65%</div>
              <div className="font-medium text-muted-foreground text-sm">
                Fewer Phone Calls
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">2x</div>
              <div className="font-medium text-muted-foreground text-sm">
                Faster Payments
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">24/7</div>
              <div className="font-medium text-muted-foreground text-sm">
                Self-Service Access
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">4.9★</div>
              <div className="font-medium text-muted-foreground text-sm">
                Customer Satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Service Features */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
              Everything customers need, nothing they don't
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              A clean, intuitive interface that makes self-service actually work
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Online Booking */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="size-6 text-primary" />
                </div>
                <CardTitle>24/7 Online Booking</CardTitle>
                <CardDescription>
                  Let customers schedule appointments anytime, anywhere
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6 space-y-4">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-3 font-semibold text-sm">Real-Time Availability</div>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• See open slots instantly</li>
                      <li>• Tech availability synced live</li>
                      <li>• Service duration estimates</li>
                      <li>• Preferred tech selection</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-3 font-semibold text-sm">Smart Scheduling</div>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• Service-specific questions</li>
                      <li>• Equipment history pre-filled</li>
                      <li>• Automatic confirmations</li>
                      <li>• Calendar integration</li>
                    </ul>
                  </div>
                </div>
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <div className="mb-1 font-semibold text-sm">Impact</div>
                  <p className="text-muted-foreground text-xs">
                    Customers book 65% more often when they can do it themselves, 
                    and 40% of bookings happen outside business hours.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Portal */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-green-500/5 to-transparent">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-green-500/10">
                  <CreditCard className="size-6 text-green-600" />
                </div>
                <CardTitle>One-Click Payments</CardTitle>
                <CardDescription>
                  Get paid faster with instant payment options
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6 space-y-4">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-3 font-semibold text-sm">Instant Payment</div>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• One-click from email/SMS</li>
                      <li>• Saved payment methods</li>
                      <li>• Apple Pay & Google Pay</li>
                      <li>• Automatic receipts</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-3 font-semibold text-sm">Payment Plans</div>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• Flexible payment options</li>
                      <li>• Automatic installments</li>
                      <li>• Payment reminders</li>
                      <li>• Balance tracking</li>
                    </ul>
                  </div>
                </div>
                <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                  <div className="mb-1 font-semibold text-sm">Impact</div>
                  <p className="text-muted-foreground text-xs">
                    Customers pay 2x faster through the portal, and you collect 
                    92% of invoices within 7 days vs. 45 days with traditional billing.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Service History */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-blue-500/5 to-transparent">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <FileText className="size-6 text-blue-600" />
                </div>
                <CardTitle>Complete Service History</CardTitle>
                <CardDescription>
                  Every job, invoice, and interaction in one place
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6 space-y-4">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-3 font-semibold text-sm">Job Records</div>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• Complete work history</li>
                      <li>• Before/after photos</li>
                      <li>• Service reports</li>
                      <li>• Warranty information</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-3 font-semibold text-sm">Equipment Tracking</div>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• Equipment age & model</li>
                      <li>• Maintenance schedules</li>
                      <li>• Parts replaced</li>
                      <li>• Service recommendations</li>
                    </ul>
                  </div>
                </div>
                <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
                  <div className="mb-1 font-semibold text-sm">Impact</div>
                  <p className="text-muted-foreground text-xs">
                    Customers who can see their history are 3x more likely to 
                    book maintenance and 2x more likely to accept upsells.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Communication Hub */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-purple-500/5 to-transparent">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <MessageSquare className="size-6 text-purple-600" />
                </div>
                <CardTitle>Direct Messaging</CardTitle>
                <CardDescription>
                  Two-way communication without phone tag
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6 space-y-4">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-3 font-semibold text-sm">Real-Time Chat</div>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• Ask questions anytime</li>
                      <li>• Photo sharing</li>
                      <li>• Notification alerts</li>
                      <li>• Message history</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-3 font-semibold text-sm">Job Updates</div>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• Tech on the way alerts</li>
                      <li>• Job completion notices</li>
                      <li>• Estimate approvals</li>
                      <li>• Review requests</li>
                    </ul>
                  </div>
                </div>
                <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
                  <div className="mb-1 font-semibold text-sm">Impact</div>
                  <p className="text-muted-foreground text-xs">
                    Portal messaging reduces phone calls by 65% and improves 
                    customer satisfaction scores by 28%.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t bg-muted/20 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
              Built for modern customers
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Every feature designed to delight your customers and save your team time
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Smartphone className="size-6 text-primary" />
                </div>
                <CardTitle>Mobile-First Design</CardTitle>
                <CardDescription>
                  Perfect experience on any device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Responsive layout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Touch-optimized</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Fast loading</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Offline support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="size-6 text-primary" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Bank-level security for customer data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>256-bit encryption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Two-factor authentication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>PCI compliant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>GDPR ready</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Star className="size-6 text-primary" />
                </div>
                <CardTitle>Your Branding</CardTitle>
                <CardDescription>
                  Fully customizable to match your brand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Custom logo & colors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Your domain name</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Custom messaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>White-label option</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="size-6 text-primary" />
                </div>
                <CardTitle>Smart Notifications</CardTitle>
                <CardDescription>
                  Keep customers informed automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Appointment reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Tech on the way alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Payment confirmations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Service reminders</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-6 text-primary" />
                </div>
                <CardTitle>Document Library</CardTitle>
                <CardDescription>
                  All important files in one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Invoices & receipts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Service reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Warranty documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Maintenance guides</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-6 text-primary" />
                </div>
                <CardTitle>Family Accounts</CardTitle>
                <CardDescription>
                  Multiple users, one account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Multiple properties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Shared access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Permission controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Unified billing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-8 sm:p-12">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary font-bold text-2xl text-primary-foreground">
                    KM
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Karen Martinez</div>
                    <div className="text-muted-foreground text-sm">Owner, Martinez Plumbing</div>
                  </div>
                </div>
                <blockquote className="text-lg leading-relaxed">
                  "Our phone used to ring 200 times a day with 'when can you come?' and 'did you get my payment?' 
                  Now customers book and pay themselves through the portal. Our office staff went from 3 people to 1, 
                  and customer satisfaction is at an all-time high."
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <Badge className="bg-cyan-500">65% Fewer Calls</Badge>
                  <Badge variant="secondary">Plumbing</Badge>
                  <Badge variant="secondary">Miami, FL</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-cyan-500 via-blue-500 to-cyan-500 py-20 text-white">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
            Launch your customer portal today
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Join service businesses reducing calls by 65% and getting paid 2x faster with Thorbis.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild className="bg-white text-cyan-600 shadow-lg hover:bg-white/90" size="lg">
              <Link href="/register">
                Start Free Trial
                <Zap className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild className="border-white/20 bg-white/10 hover:bg-white/20" size="lg" variant="outline">
              <Link href="/contact">
                See Live Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

