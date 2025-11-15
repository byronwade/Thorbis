import {
  Bot,
  Calendar,
  CheckCircle2,
  MessageSquare,
  Phone,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  generateBreadcrumbStructuredData,
  generateMetadata as generateSEOMetadata,
  generateServiceStructuredData,
  siteUrl,
} from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata = generateSEOMetadata({
  title: "AI Dispatch Assistant - 24/7 Call Handling | Thorbis",
  section: "Features",
  description:
    "Never miss a call again. Thorbis AI Assistant answers every call, qualifies leads, and books jobs automatically - even after hours. Reduce missed opportunities by 98%.",
  path: "/features/ai-assistant",
  keywords: [
    "ai answering service",
    "field service virtual agent",
    "24/7 dispatch assistant",
    "automated call handling",
    "service business automation",
  ],
});

export default function AIAssistantPage() {
  const serviceStructuredData = generateServiceStructuredData({
    name: "AI Service Assistant",
    description:
      "24/7 intelligent call handling and booking automation for service businesses",
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
                name: "AI Assistant",
                url: `${siteUrl}/features/ai-assistant`,
              },
            ])
          ),
        }}
        id="ai-assistant-breadcrumb-ld"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
        id="ai-assistant-service-ld"
        type="application/ld+json"
      />

      {/* Hero Section - Conversational Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background py-20 sm:py-32">
        <div className="-z-10 absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.1),_transparent_50%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 gap-1.5 px-3 py-1.5" variant="secondary">
              <Sparkles className="size-3.5" />
              AI-Powered
            </Badge>
            <h1 className="mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text font-bold text-5xl text-transparent tracking-tight sm:text-6xl lg:text-7xl">
              Your AI dispatcher that never sleeps
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Answer every call, qualify every lead, and book every
              job—automatically. Thorbis AI handles customer conversations 24/7
              so you never miss an opportunity.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild className="shadow-lg shadow-primary/20" size="lg">
                <Link href="/register">
                  Start 14-day Free Trial
                  <Zap className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">
                  <Phone className="mr-2 size-4" />
                  Talk to Sales
                </Link>
              </Button>
            </div>

            {/* Live Demo Visualization */}
            <div className="relative mx-auto mt-16 max-w-3xl">
              <div className="overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl">
                <div className="flex items-center gap-2 border-border/50 border-b bg-muted/30 px-4 py-3">
                  <div className="size-3 rounded-full bg-red-500" />
                  <div className="size-3 rounded-full bg-yellow-500" />
                  <div className="size-3 rounded-full bg-green-500" />
                  <span className="ml-2 font-medium text-muted-foreground text-xs">
                    Live AI Conversation
                  </span>
                </div>
                <div className="space-y-4 p-6">
                  {/* Customer Message */}
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Phone className="size-4 text-muted-foreground" />
                    </div>
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                      <p className="text-sm">
                        Hi, my AC stopped working and it's 95 degrees. Can
                        someone come today?
                      </p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start justify-end gap-3">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-primary-foreground">
                      <p className="text-sm">
                        I understand that's urgent! I can get a technician to
                        you today. What's your address so I can check
                        availability in your area?
                      </p>
                    </div>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Bot className="size-4 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Customer Message */}
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Phone className="size-4 text-muted-foreground" />
                    </div>
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                      <p className="text-sm">123 Oak Street, Austin TX 78701</p>
                    </div>
                  </div>

                  {/* AI Response with Booking */}
                  <div className="flex items-start justify-end gap-3">
                    <div className="max-w-[80%] space-y-3 rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-primary-foreground">
                      <p className="text-sm">
                        Perfect! I have a technician available at 2:30 PM today.
                        The diagnostic fee is $89. Would that work for you?
                      </p>
                      <div className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-3">
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar className="size-3.5" />
                          <span className="font-semibold">
                            Today at 2:30 PM
                          </span>
                        </div>
                        <div className="mt-1 text-xs opacity-90">
                          Tech: Mike Johnson • Est. arrival: 2:30-3:00 PM
                        </div>
                      </div>
                    </div>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Bot className="size-4 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="-right-4 -top-4 absolute flex items-center gap-2 rounded-full border border-green-500/50 bg-green-500/10 px-4 py-2 backdrop-blur-sm">
                <div className="size-2 animate-pulse rounded-full bg-green-500" />
                <span className="font-semibold text-green-700 text-xs dark:text-green-400">
                  Live & Booking
                </span>
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
              <div className="mb-2 font-bold text-4xl text-primary">98%</div>
              <div className="font-medium text-muted-foreground text-sm">
                Call Answer Rate
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">3 min</div>
              <div className="font-medium text-muted-foreground text-sm">
                Avg. Booking Time
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">24/7</div>
              <div className="font-medium text-muted-foreground text-sm">
                Always Available
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-primary">40%</div>
              <div className="font-medium text-muted-foreground text-sm">
                Less Admin Work
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
              Everything your AI assistant can do
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              From first contact to booked appointment, Thorbis AI handles the
              entire customer journey
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="size-6 text-primary" />
                </div>
                <CardTitle>Intelligent Call Routing</CardTitle>
                <CardDescription>
                  Automatically identifies caller intent and routes to the right
                  workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Emergency vs. routine service detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Service area validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Existing customer recognition</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="size-6 text-primary" />
                </div>
                <CardTitle>Smart Scheduling</CardTitle>
                <CardDescription>
                  Books appointments based on tech availability, location, and
                  job type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Real-time availability checks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Travel time optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Automated confirmations & reminders</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <CardTitle>Natural Conversations</CardTitle>
                <CardDescription>
                  Sounds human, understands context, and adapts to your brand
                  voice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Custom greetings and scripts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Multi-turn conversation handling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Sentiment analysis & escalation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="size-6 text-primary" />
                </div>
                <CardTitle>Lead Qualification</CardTitle>
                <CardDescription>
                  Captures key details and scores leads automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Budget and timeline questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Property type and service history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Automatic lead scoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Bot className="size-6 text-primary" />
                </div>
                <CardTitle>CRM Integration</CardTitle>
                <CardDescription>
                  Every interaction logged with full transcripts and context
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Automatic contact creation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Call transcripts and summaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Activity timeline updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="size-6 text-primary" />
                </div>
                <CardTitle>Multi-Channel Support</CardTitle>
                <CardDescription>
                  Works across phone, SMS, web chat, and email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Unified conversation history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Channel-specific optimizations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Seamless handoffs between channels</span>
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
            Stop missing calls. Start booking more jobs.
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
            Join hundreds of service businesses using Thorbis AI to capture
            every opportunity.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              className="bg-background text-foreground shadow-lg hover:bg-background/90"
              size="lg"
            >
              <Link href="/register">
                Get Started Free
                <Zap className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20"
              size="lg"
              variant="outline"
            >
              <Link href="/contact">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
