/**
 * Marketing Coming Soon Page - Server Component
 * Shown in production while features are being built and tested
 */

import {
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  Facebook,
  Lightbulb,
  LineChart,
  Mail,
  Megaphone,
  MessageSquare,
  Rocket,
  Search,
  Send,
  Share2,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export function MarketingComingSoon() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-auto py-12">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-6xl space-y-12 text-center">
        {/* Status badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-6 py-3 text-sm backdrop-blur-sm">
            <Clock className="mr-2 size-4" />
            <span className="font-medium">Coming Soon</span>
          </div>
        </div>

        {/* Icon with gradient background */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl" />
            <div className="relative flex size-32 items-center justify-center rounded-full border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
              <Megaphone className="size-16 text-primary" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Main heading with gradient */}
        <div className="space-y-4">
          <h1 className="font-bold text-5xl tracking-tight md:text-6xl">
            Marketing{" "}
            <span className="bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text font-extrabold text-transparent dark:from-pink-400 dark:to-pink-300">
              Center
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-foreground/60 text-xl leading-relaxed">
            A comprehensive marketing suite to grow your business with
            integrated tools for lead management, review monitoring, campaign
            automation, and multi-channel marketing.
          </p>
        </div>

        {/* Feature Categories */}
        <div className="mx-auto max-w-5xl space-y-8 pt-8">
          {/* Primary Features */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Core Marketing Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-pink-500/5 to-transparent p-6 transition-all duration-300 hover:border-border/20 hover:shadow-lg hover:shadow-pink-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent/10">
                    <Users className="size-6 text-accent-foreground dark:text-accent-foreground" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">Lead Management</h3>
                <p className="text-muted-foreground text-sm">
                  Capture, track, and nurture leads from all channels with
                  automated scoring and qualification
                </p>
              </div>

              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-yellow-500/5 to-transparent p-6 transition-all duration-300 hover:border-warning/20 hover:shadow-lg hover:shadow-yellow-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-warning/10">
                    <Star className="size-6 text-warning dark:text-warning" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">
                  Review Management
                </h3>
                <p className="text-muted-foreground text-sm">
                  Monitor and respond to reviews across Google, Facebook, and
                  Yelp from a single dashboard
                </p>
              </div>

              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-blue-500/5 to-transparent p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-blue-500/10 hover:shadow-lg">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <Send className="size-6 text-primary dark:text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">Campaigns</h3>
                <p className="text-muted-foreground text-sm">
                  Create and automate multi-channel marketing campaigns via
                  email, SMS, and direct mail
                </p>
              </div>

              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-green-500/5 to-transparent p-6 transition-all duration-300 hover:border-success/20 hover:shadow-green-500/10 hover:shadow-lg">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-success/10">
                    <Target className="size-6 text-success dark:text-success" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">
                  Customer Outreach
                </h3>
                <p className="text-muted-foreground text-sm">
                  Targeted outreach to customers with personalized messaging and
                  automated follow-ups
                </p>
              </div>
            </div>
          </div>

          {/* Lead Management Features */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Lead Management Tools
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-6 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Search className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Lead Capture</h3>
                <p className="text-muted-foreground text-sm">
                  Capture leads from website forms, phone calls, and online ads
                  automatically
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-6 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Lead Scoring</h3>
                <p className="text-muted-foreground text-sm">
                  Automatically score and prioritize leads based on behavior and
                  engagement
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-6 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Lead Nurturing</h3>
                <p className="text-muted-foreground text-sm">
                  Automated nurture sequences to convert leads into paying
                  customers
                </p>
              </div>
            </div>
          </div>

          {/* Review Management */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">Review Management</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-warning/20 bg-gradient-to-br from-yellow-500/10 to-transparent p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-warning/10">
                    <Star className="size-6 text-warning dark:text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Multi-Platform Monitoring
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Real-time tracking
                    </p>
                  </div>
                </div>
                <p className="mb-3 text-muted-foreground text-sm">
                  Monitor reviews from Google, Facebook, Yelp, and more from a
                  single unified dashboard
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-xs">
                    <Search className="size-3" />
                    Google Business
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-xs">
                    <Facebook className="size-3" />
                    Facebook
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-xs">
                    <Star className="size-3" />
                    Yelp
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-blue-500/10 to-transparent p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <MessageSquare className="size-6 text-primary dark:text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Smart Responses</h3>
                    <p className="text-muted-foreground text-sm">
                      AI-powered replies
                    </p>
                  </div>
                </div>
                <p className="mb-3 text-muted-foreground text-sm">
                  AI-suggested responses and templates for quick, professional
                  replies to all reviews
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs">
                    Auto-Response
                  </span>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs">
                    Templates
                  </span>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs">
                    AI Suggestions
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Tools */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">Campaign Management</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Email Campaigns</span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">SMS Marketing</span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Send className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Direct Mail</span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Share2 className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Social Media</span>
              </div>
            </div>
          </div>

          {/* Analytics & Reporting */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Analytics & Insights
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-6 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <LineChart className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Campaign Performance</h3>
                <p className="text-muted-foreground text-sm">
                  Track ROI, conversion rates, and engagement across all
                  campaigns
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-6 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Lead Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  Understand lead sources, conversion funnels, and customer
                  journey
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-6 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Award className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Reputation Score</h3>
                <p className="text-muted-foreground text-sm">
                  Monitor your online reputation with real-time scoring and
                  alerts
                </p>
              </div>
            </div>
          </div>

          {/* What to Expect */}
          <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-8">
            <div className="mb-6 flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Lightbulb className="size-8 text-primary" />
              </div>
            </div>
            <h2 className="mb-4 font-semibold text-2xl">What to Expect</h2>
            <div className="mx-auto max-w-3xl space-y-3 text-left text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Lead Management:
                  </span>{" "}
                  Capture leads from all sources, score automatically, and
                  convert with intelligent nurturing sequences
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Review Management:
                  </span>{" "}
                  Monitor and respond to reviews across Google, Facebook, and
                  Yelp from one dashboard
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Multi-Channel Campaigns:
                  </span>{" "}
                  Create email, SMS, and direct mail campaigns with
                  drag-and-drop builder and automation
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Customer Outreach:
                  </span>{" "}
                  Targeted campaigns for maintenance reminders, special offers,
                  and customer re-engagement
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Analytics & ROI:
                  </span>{" "}
                  Track campaign performance, lead conversion rates, and
                  marketing ROI in real-time
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Reputation Management:
                  </span>{" "}
                  Real-time alerts for new reviews with AI-powered response
                  suggestions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex items-center justify-center gap-2 pt-4 text-muted-foreground text-sm">
          <Rocket className="size-4" />
          <p>
            In the meantime, explore the platform and reach out if you need help
          </p>
        </div>
      </div>
    </div>
  );
}
