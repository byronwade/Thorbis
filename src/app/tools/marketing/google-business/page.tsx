/**
 * Google Business Profile Guide - Server Component
 *
 * Performance optimizations:
 * - Server Component by default
 * - ISR with 1 day revalidation
 */

import {
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  Image,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const revalidate = 86_400; // Revalidate daily

export default function GoogleBusinessProfilePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-500/5">
            <Search className="size-6 text-primary dark:text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-3xl tracking-tight">
                Google Business Profile
              </h1>
              <Badge variant="secondary">Essential</Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              Claim and optimize your Google Business listing to appear in local
              searches
            </p>
          </div>
        </div>
      </div>

      {/* Why It Matters */}
      <Card className="border-primary/20 bg-gradient-to-br from-blue-500/10 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            Why Google Business Profile Matters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            Google Business Profile (formerly Google My Business) is the #1 most
            important online marketing tool for local trade businesses.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-success" />
              <div>
                <p className="font-semibold text-sm">
                  Show up in "near me" searches
                </p>
                <p className="text-muted-foreground text-xs">
                  46% of all Google searches are for local businesses
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-success" />
              <div>
                <p className="font-semibold text-sm">Appear on Google Maps</p>
                <p className="text-muted-foreground text-xs">
                  Free visibility when customers search your service area
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-success" />
              <div>
                <p className="font-semibold text-sm">
                  Build trust with reviews
                </p>
                <p className="text-muted-foreground text-xs">
                  93% of consumers read online reviews before hiring
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-success" />
              <div>
                <p className="font-semibold text-sm">100% Free</p>
                <p className="text-muted-foreground text-xs">
                  No cost to claim and maintain your profile
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5" />
            Getting Started - Step by Step
          </CardTitle>
          <CardDescription>
            Follow these steps to claim and optimize your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                1
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Claim Your Business</h3>
                <p className="text-muted-foreground text-sm">
                  Go to{" "}
                  <Link
                    className="text-primary hover:underline"
                    href="https://business.google.com"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    business.google.com
                  </Link>{" "}
                  and search for your business name. If it exists, claim it. If
                  not, create a new listing.
                </p>
                <p className="text-muted-foreground text-sm">
                  Google will verify your business via postcard (5-7 days),
                  phone, email, or instant verification if eligible.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                2
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Complete Your Profile 100%</h3>
                <p className="text-muted-foreground text-sm">
                  Businesses with complete profiles receive 7x more clicks. Fill
                  out every section:
                </p>
                <ul className="ml-4 list-disc space-y-1 text-muted-foreground text-sm">
                  <li>
                    <strong>Business name, address, phone</strong> (NAP - must
                    match your website)
                  </li>
                  <li>
                    <strong>Category:</strong> Select primary (HVAC, Plumbing,
                    Electrician) + 9 additional categories
                  </li>
                  <li>
                    <strong>Service areas:</strong> List all cities/zip codes
                    you serve
                  </li>
                  <li>
                    <strong>Hours:</strong> Regular hours + special hours
                    (holidays)
                  </li>
                  <li>
                    <strong>Website & booking link</strong>
                  </li>
                  <li>
                    <strong>Business description</strong> (750 characters max)
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                3
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Add High-Quality Photos</h3>
                <p className="text-muted-foreground text-sm">
                  Businesses with photos receive 42% more requests for
                  directions and 35% more clicks to their website.
                </p>
                <ul className="ml-4 list-disc space-y-1 text-muted-foreground text-sm">
                  <li>
                    <strong>Logo:</strong> Square, 250x250px minimum
                  </li>
                  <li>
                    <strong>Cover photo:</strong> 1024x576px, showcases your
                    work
                  </li>
                  <li>
                    <strong>Team photos:</strong> Your technicians, trucks,
                    uniforms
                  </li>
                  <li>
                    <strong>Work photos:</strong> Before/after, completed
                    projects (20-50 photos)
                  </li>
                  <li>
                    <strong>Interior/exterior:</strong> Office, shop, warehouse
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                4
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Add Services & Products</h3>
                <p className="text-muted-foreground text-sm">
                  List specific services you offer with descriptions and pricing
                  (if applicable):
                </p>
                <ul className="ml-4 list-disc space-y-1 text-muted-foreground text-sm">
                  <li>AC Installation, Repair, Maintenance</li>
                  <li>Emergency 24/7 Service</li>
                  <li>Water Heater Installation</li>
                  <li>Electrical Panel Upgrades</li>
                  <li>Include starting prices when possible ("From $89")</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                5
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Get Reviews & Respond</h3>
                <p className="text-muted-foreground text-sm">
                  Reviews are the #1 ranking factor for local search. Aim for
                  50+ reviews with 4.5+ star average.
                </p>
                <ul className="ml-4 list-disc space-y-1 text-muted-foreground text-sm">
                  <li>
                    Ask every happy customer for a review (via text/email)
                  </li>
                  <li>Respond to ALL reviews within 24-48 hours</li>
                  <li>
                    Thank positive reviewers, address negative reviews
                    professionally
                  </li>
                  <li>
                    Never offer incentives for reviews (against Google policy)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="size-5 text-primary" />
              <CardTitle className="text-base">Google Q&A</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Customers can ask questions directly on your profile. Monitor and
              answer within 24 hours. Seed with FAQs like "Do you offer
              emergency service?" and "What areas do you serve?"
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Phone className="size-5 text-primary" />
              <CardTitle className="text-base">Click-to-Call Button</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Mobile users can call directly from your profile. Track call
              volume in insights. Make sure your phone number is correct and
              answered during business hours.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              <CardTitle className="text-base">
                Directions & Service Area
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Customers get directions to your location. For service area
              businesses, hide your address and show service cities instead
              (better for privacy and broader reach).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Image className="size-5 text-primary" />
              <CardTitle className="text-base">Photo Posts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Share updates, promotions, completed projects as posts. Photos
              stay for 7 days, events show until the date passes. Post weekly
              for best results.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="size-5 text-primary" />
              <CardTitle className="text-base">Review Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Get notifications for new reviews. Responding increases trust and
              shows you care. Use templates for faster responses but personalize
              each one.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              <CardTitle className="text-base">
                Business Hours & Attributes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Add attributes like "24/7 Emergency Service", "Licensed &
              Insured", "Free Estimates". Update special hours for holidays to
              avoid frustrated customers.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pro Tips */}
      <Card className="border-warning/20 bg-gradient-to-br from-amber-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-5" />
            Pro Tips for Maximum Visibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Post Weekly</h4>
              <p className="text-muted-foreground text-sm">
                Share project photos, promotions, tips. Posts expire after 7
                days so stay active.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">
                Use Google My Business App
              </h4>
              <p className="text-muted-foreground text-sm">
                Get notifications instantly, respond to reviews on the go, add
                photos from job sites.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Monitor Insights Weekly</h4>
              <p className="text-muted-foreground text-sm">
                Track views, clicks, calls, direction requests. See what search
                terms bring customers.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Consistent NAP</h4>
              <p className="text-muted-foreground text-sm">
                Name, Address, Phone must match exactly across website,
                citations, social media.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Keywords in Description</h4>
              <p className="text-muted-foreground text-sm">
                Include your services and service area naturally. "HVAC repair
                and installation serving [City, City]"
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Video Content</h4>
              <p className="text-muted-foreground text-sm">
                Add 30-second videos of your team, your work, customer
                testimonials. Video performs better than photos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
        <CardHeader>
          <CardTitle>Ready to Get Started?</CardTitle>
          <CardDescription>
            Setting up your Google Business Profile takes 30-60 minutes and can
            generate leads for years.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link
              href="https://business.google.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Claim Your Business
              <ExternalLink className="ml-2 size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tools/marketing/local-services">
              Next: Google Local Services Ads →
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
