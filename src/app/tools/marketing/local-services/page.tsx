/**
 * Google Local Services Ads Guide - Server Component
 */

import {
  AlertCircle,
  BadgeCheck,
  CheckCircle,
  DollarSign,
  ExternalLink,
  Shield,
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

export default function LocalServicesAdsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/15 to-green-500/5">
            <BadgeCheck className="size-6 text-success dark:text-success" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-3xl tracking-tight">
                Google Local Services Ads
              </h1>
              <Badge variant="secondary">Recommended</Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              Get verified and appear at the very top of Google search results
            </p>
          </div>
        </div>
      </div>

      {/* Why It Matters */}
      <Card className="border-success/20 bg-gradient-to-br from-green-500/10 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            Why Local Services Ads Are Worth It
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            Google Local Services Ads (LSA) appear ABOVE regular Google Ads and
            organic results. You get the coveted "Google Screened" or "Google
            Guaranteed" badge.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-success" />
              <div>
                <p className="font-semibold text-sm">Top of Search Results</p>
                <p className="text-muted-foreground text-xs">
                  Appear above all other ads and organic listings
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-success" />
              <div>
                <p className="font-semibold text-sm">Pay Per Lead Only</p>
                <p className="text-muted-foreground text-xs">
                  No wasted ad spend - only pay for actual customer contacts
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-success" />
              <div>
                <p className="font-semibold text-sm">Google Screened Badge</p>
                <p className="text-muted-foreground text-xs">
                  Instantly builds trust and credibility with customers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-success" />
              <div>
                <p className="font-semibold text-sm">Higher Conversion Rates</p>
                <p className="text-muted-foreground text-xs">
                  LSA leads convert 30-40% better than regular ads
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Local Services Ads Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                1
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Customer Searches</h3>
                <p className="text-muted-foreground text-sm">
                  When someone searches "plumber near me" or "emergency
                  electrician [city]", your ad appears at the top with your
                  photo, reviews, and "Google Screened" badge.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                2
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Customer Contacts You</h3>
                <p className="text-muted-foreground text-sm">
                  They can call directly, message you, or book an appointment.
                  You receive instant notifications on your phone.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                3
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">You Pay Per Lead</h3>
                <p className="text-muted-foreground text-sm">
                  Only charged when a customer contacts you (not for impressions
                  or clicks). Typical costs: $15-$50 per lead depending on trade
                  and location.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                4
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Dispute Invalid Leads</h3>
                <p className="text-muted-foreground text-sm">
                  If a lead is spam, wrong service, or outside your area, you
                  can dispute it and get a credit. Google typically approves
                  70-80% of disputes.
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
            <Shield className="size-5" />
            Qualification & Setup Process
          </CardTitle>
          <CardDescription>Requirements to get Google Screened</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Required Documentation:</h4>
              <ul className="ml-4 list-disc space-y-1 text-muted-foreground text-sm">
                <li>
                  <strong>Business license:</strong> Current state/city
                  contractor license
                </li>
                <li>
                  <strong>Insurance:</strong> General liability ($1-2M) and
                  workers compensation
                </li>
                <li>
                  <strong>Background check:</strong> Owner and key employees
                  (takes 3-5 business days)
                </li>
                <li>
                  <strong>Business verification:</strong> EIN, business
                  documents
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Available Trades:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">HVAC</Badge>
                <Badge variant="outline">Plumbing</Badge>
                <Badge variant="outline">Electrical</Badge>
                <Badge variant="outline">Appliance Repair</Badge>
                <Badge variant="outline">Garage Door</Badge>
                <Badge variant="outline">Locksmith</Badge>
                <Badge variant="outline">Water Damage</Badge>
                <Badge variant="outline">Cleaning</Badge>
                <Badge variant="outline">Pest Control</Badge>
                <Badge variant="outline">Handyman</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Setup Timeline:</h4>
              <ul className="ml-4 list-disc space-y-1 text-muted-foreground text-sm">
                <li>Week 1: Submit application and documents</li>
                <li>Week 2: Background checks complete</li>
                <li>Week 3: Profile review and approval</li>
                <li>Week 4: Go live and start receiving leads</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="size-5" />
              Cost Per Lead (Average)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm">HVAC</span>
                <span className="font-semibold text-sm">$25-$45</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm">Plumbing</span>
                <span className="font-semibold text-sm">$20-$40</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm">Electrical</span>
                <span className="font-semibold text-sm">$30-$50</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm">Appliance Repair</span>
                <span className="font-semibold text-sm">$15-$30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Emergency Services</span>
                <span className="font-semibold text-sm">+20-30%</span>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground text-xs">
              Prices vary by location. Urban areas typically cost more.
              Emergency/24-7 leads cost 20-30% more.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="size-5" />
              ROI & Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-sm">Average Conversion Rate</p>
                <p className="font-bold text-2xl text-success">30-40%</p>
                <p className="text-muted-foreground text-xs">
                  Of leads that contact you become paying customers
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm">Average ROI</p>
                <p className="font-bold text-2xl text-success">3-5x</p>
                <p className="text-muted-foreground text-xs">
                  For every $1 spent, generate $3-5 in revenue
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm">Response Time Impact</p>
                <p className="text-muted-foreground text-xs">
                  Responding within 5 minutes increases booking rate by 400%.
                  Use auto-responders and phone forwarding.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pro Tips */}
      <Card className="border-warning/20 bg-gradient-to-br from-amber-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-5" />
            Pro Tips for Maximum Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Set Your Budget Wisely</h4>
              <p className="text-muted-foreground text-sm">
                Start with $500-1000/week. Google will pause ads when budget is
                reached. Increase based on ROI.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Respond FAST</h4>
              <p className="text-muted-foreground text-sm">
                Within 5 minutes if possible. Set up call forwarding to your
                cell phone. Use text auto-responders.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Get More Reviews</h4>
              <p className="text-muted-foreground text-sm">
                Your Google reviews from Business Profile show in LSA. 4.5+
                stars with 50+ reviews performs best.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Dispute Invalid Leads</h4>
              <p className="text-muted-foreground text-sm">
                Spam, wrong service area, wrong service type - dispute within 30
                days. Be honest but don't abuse it.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">
                Optimize Your Service Area
              </h4>
              <p className="text-muted-foreground text-sm">
                Target profitable zip codes. Exclude areas too far away. Adjust
                weekly based on lead quality.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Track Everything</h4>
              <p className="text-muted-foreground text-sm">
                Use a CRM or spreadsheet. Track lead cost, booking rate, average
                ticket, ROI per service area.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
        <CardHeader>
          <CardTitle>Ready to Get Google Screened?</CardTitle>
          <CardDescription>
            Application takes 20-30 minutes. Approval typically within 2-3
            weeks.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link
              href="https://ads.google.com/local-services-ads"
              rel="noopener noreferrer"
              target="_blank"
            >
              Apply Now
              <ExternalLink className="ml-2 size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tools/marketing/facebook">
              Next: Facebook Business →
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
