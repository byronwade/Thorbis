/**
 * Google Business Profile Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle,
  ExternalLink,
  MapPin,
  MessageSquare,
  Search,
  Star,
  Users,
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

export const revalidate = 3600; // Revalidate every hour

export default function GoogleBusinessPage() {
  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <div>
        <Button asChild size="sm" variant="ghost">
          <Link href="/dashboard/tools">
            <ArrowLeft className="mr-2 size-4" />
            Back to Tools
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/15 to-blue-500/5">
            <Search className="size-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-4xl tracking-tight">
                Google Business Profile
              </h1>
              <Badge variant="default">Essential</Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              Claim and optimize your Google Business listing to appear in local searches
              and attract more customers
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BadgeCheck className="size-5 text-primary" />
              Claim Your Profile
            </CardTitle>
            <CardDescription>
              Start by claiming or creating your business profile on Google
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a
                href="https://www.google.com/business/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Get Started
                <ExternalLink className="ml-2 size-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="size-5" />
              Verify Your Location
            </CardTitle>
            <CardDescription>
              Complete verification to appear in Google Maps and local search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <a
                href="https://support.google.com/business/answer/7107242"
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn How
                <ExternalLink className="ml-2 size-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="size-5" />
              Optimize Your Listing
            </CardTitle>
            <CardDescription>
              Follow best practices to rank higher in local search results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="#optimization-tips">
                View Tips
                <ExternalLink className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Why It Matters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Why Google Business Profile Matters</CardTitle>
          <CardDescription>
            Your Google Business Profile is often the first thing potential customers see
            when searching for services in your area
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                <Search className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Appear in Local Search</h3>
                <p className="text-muted-foreground text-sm">
                  Show up when customers search for services like yours in your area
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                <MapPin className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Get Found on Maps</h3>
                <p className="text-muted-foreground text-sm">
                  Be visible to customers navigating Google Maps looking for help
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
                <Star className="size-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Build Trust with Reviews</h3>
                <p className="text-muted-foreground text-sm">
                  Collect and display customer reviews to build credibility
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                <Users className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Connect with Customers</h3>
                <p className="text-muted-foreground text-sm">
                  Answer questions, share updates, and respond to reviews
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 size-5 text-blue-600 dark:text-blue-400" />
              <div className="space-y-1">
                <p className="font-medium text-sm">Did you know?</p>
                <p className="text-muted-foreground text-sm">
                  Businesses with complete Google Business Profiles are 2.7x more likely
                  to be considered reputable by consumers and get 70% more location visits
                  than businesses without one.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup Steps */}
      <Card id="optimization-tips">
        <CardHeader>
          <CardTitle className="text-2xl">Setup & Optimization Guide</CardTitle>
          <CardDescription>
            Follow these steps to create and optimize your Google Business Profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                1
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Claim or Create Your Profile</h3>
                <p className="text-muted-foreground">
                  Search for your business on Google to see if a profile already exists. If
                  it does, claim it. If not, create a new one.
                </p>
                <Button asChild size="sm" variant="outline">
                  <a
                    href="https://www.google.com/business/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Start Here
                    <ExternalLink className="ml-2 size-3" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                2
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Complete Your Profile</h3>
                <p className="text-muted-foreground">
                  Fill out all information fields including business name, address, phone,
                  website, hours, and services.
                </p>
                <div className="space-y-2 pl-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Business name, category, and service area</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Phone number, website, and business hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Business description (750 characters max)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Services offered with detailed descriptions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                3
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Verify Your Business</h3>
                <p className="text-muted-foreground">
                  Google will send a verification code by mail, phone, or email. Complete
                  this step to activate your profile.
                </p>
                <Button asChild size="sm" variant="outline">
                  <a
                    href="https://support.google.com/business/answer/7107242"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Verification Guide
                    <ExternalLink className="ml-2 size-3" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                4
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Add Photos & Videos</h3>
                <p className="text-muted-foreground">
                  Upload high-quality photos of your team, trucks, completed work, and
                  office. Businesses with photos get 42% more requests for directions.
                </p>
                <div className="space-y-2 pl-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Logo and cover photo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Team photos and work trucks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Before/after project photos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Interior/exterior of your office</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                5
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Collect & Respond to Reviews</h3>
                <p className="text-muted-foreground">
                  Ask satisfied customers to leave reviews. Always respond professionally
                  to all reviews, both positive and negative.
                </p>
                <Button asChild size="sm" variant="outline">
                  <a
                    href="https://support.google.com/business/answer/3474122"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Review Best Practices
                    <ExternalLink className="ml-2 size-3" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                6
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Post Regular Updates</h3>
                <p className="text-muted-foreground">
                  Share news, offers, events, and helpful tips. Posts appear in search
                  results and keep your profile active.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Additional Resources</CardTitle>
          <CardDescription>
            Learn more about maximizing your Google Business Profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
              href="https://support.google.com/business/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageSquare className="mt-1 size-5 text-muted-foreground" />
              <div className="flex-1">
                <h4 className="font-medium">Google Business Help Center</h4>
                <p className="text-muted-foreground text-sm">
                  Official documentation and troubleshooting guides
                </p>
              </div>
              <ExternalLink className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </a>

            <a
              className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
              href="https://www.google.com/business/resources/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Star className="mt-1 size-5 text-muted-foreground" />
              <div className="flex-1">
                <h4 className="font-medium">Best Practices Guide</h4>
                <p className="text-muted-foreground text-sm">
                  Tips for optimizing your profile and ranking higher
                </p>
              </div>
              <ExternalLink className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Need Help? */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-xl">Need Help Setting This Up?</CardTitle>
          <CardDescription>
            Our team can help you claim, verify, and optimize your Google Business Profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/help">
              Contact Support
              <ExternalLink className="ml-2 size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
