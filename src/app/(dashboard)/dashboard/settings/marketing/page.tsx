"use client";

export const dynamic = "force-dynamic";

import {
  BarChart3,
  Gift,
  HelpCircle,
  Loader2,
  Mail,
  MessageSquare,
  Save,
  Share2,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { usePageLayout } from "@/hooks/use-page-layout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Constants
const SIMULATED_API_DELAY = 1500;
const MAX_MESSAGE_LENGTH = 500;
const DEFAULT_REVIEW_DELAY_DAYS = 7;
const DEFAULT_REFERRAL_REWARD = 50;

type MarketingSettings = {
  // Review Requests
  enableReviewRequests: boolean;
  autoSendReviewRequests: boolean;
  reviewRequestDelayDays: number;
  onlyRequestAfterPositiveExperience: boolean;
  reviewPlatforms: string[]; // "google" | "yelp" | "facebook" | "bbb"
  reviewRequestMessage: string;

  // Referral Program
  enableReferralProgram: boolean;
  referralRewardType: "credit" | "cash" | "discount";
  referralRewardAmount: number;
  referralMinimumPurchase: number;
  referrerReward: number;
  autoApplyReferralRewards: boolean;
  referralLandingPageEnabled: boolean;

  // Email Campaigns
  enableEmailMarketing: boolean;
  sendSeasonalCampaigns: boolean;
  sendMaintenanceReminders: boolean;
  maintenanceReminderMonths: number;
  sendBirthdayOffers: boolean;
  birthdayDiscountPercent: number;
  sendAnniversaryOffers: boolean;
  sendWinbackCampaigns: boolean;
  winbackInactiveDays: number;

  // SMS Marketing
  enableSMSMarketing: boolean;
  sendAppointmentReminders: boolean;
  appointmentReminderHours: number;
  sendPromotionalSMS: boolean;
  smsOptInRequired: boolean;
  smsFrequencyLimit: number; // per month

  // Promotions
  enablePromotions: boolean;
  showPromotionsOnWebsite: boolean;
  showPromotionsInPortal: boolean;
  allowPromoCodes: boolean;
  stackablePromotions: boolean;

  // Social Media
  enableSocialSharing: boolean;
  shareCompletedJobs: boolean;
  shareReviews: boolean;
  socialPlatforms: string[]; // "facebook" | "instagram" | "twitter" | "linkedin"

  // Analytics
  trackMarketingROI: boolean;
  trackLeadSources: boolean;
  enableUTMTracking: boolean;
  googleAnalyticsEnabled: boolean;
  googleAnalyticsId: string;
  facebookPixelEnabled: boolean;
  facebookPixelId: string;
};

export default function MarketingCenterPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [settings, setSettings] = useState<MarketingSettings>({
    // Review Requests
    enableReviewRequests: true,
    autoSendReviewRequests: true,
    reviewRequestDelayDays: DEFAULT_REVIEW_DELAY_DAYS,
    onlyRequestAfterPositiveExperience: true,
    reviewPlatforms: ["google", "yelp"],
    reviewRequestMessage:
      "We'd love to hear about your experience! Your feedback helps us improve and helps other customers find us.",

    // Referral Program
    enableReferralProgram: true,
    referralRewardType: "credit",
    referralRewardAmount: DEFAULT_REFERRAL_REWARD,
    referralMinimumPurchase: 100,
    referrerReward: DEFAULT_REFERRAL_REWARD,
    autoApplyReferralRewards: true,
    referralLandingPageEnabled: true,

    // Email Campaigns
    enableEmailMarketing: true,
    sendSeasonalCampaigns: true,
    sendMaintenanceReminders: true,
    maintenanceReminderMonths: 6,
    sendBirthdayOffers: true,
    birthdayDiscountPercent: 10,
    sendAnniversaryOffers: true,
    sendWinbackCampaigns: true,
    winbackInactiveDays: 365,

    // SMS Marketing
    enableSMSMarketing: true,
    sendAppointmentReminders: true,
    appointmentReminderHours: 24,
    sendPromotionalSMS: false,
    smsOptInRequired: true,
    smsFrequencyLimit: 4,

    // Promotions
    enablePromotions: true,
    showPromotionsOnWebsite: true,
    showPromotionsInPortal: true,
    allowPromoCodes: true,
    stackablePromotions: false,

    // Social Media
    enableSocialSharing: true,
    shareCompletedJobs: false,
    shareReviews: true,
    socialPlatforms: ["facebook", "instagram"],

    // Analytics
    trackMarketingROI: true,
    trackLeadSources: true,
    enableUTMTracking: true,
    googleAnalyticsEnabled: false,
    googleAnalyticsId: "",
    facebookPixelEnabled: false,
    facebookPixelId: "",
  });

  const updateSetting = <K extends keyof MarketingSettings>(
    key: K,
    value: MarketingSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const togglePlatform = (
    settingKey: "reviewPlatforms" | "socialPlatforms",
    platform: string
  ) => {
    const current = settings[settingKey] as string[];
    const updated = current.includes(platform)
      ? current.filter((p) => p !== platform)
      : [...current, platform];
    updateSetting(settingKey, updated as any);
  };

  async function handleSave() {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_API_DELAY));
    console.log("Marketing settings update request:", settings);
    setIsSubmitting(false);
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Marketing Center
          </h1>
          <p className="mt-2 text-muted-foreground">
            Grow your business with reviews, referrals, and campaigns
          </p>
        </div>

        <Separator />

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Active Features
                  </p>
                  <p className="mt-1 font-bold text-2xl">
                    {
                      [
                        settings.enableReviewRequests,
                        settings.enableReferralProgram,
                        settings.enableEmailMarketing,
                        settings.enableSMSMarketing,
                      ].filter(Boolean).length
                    }
                    /4
                  </p>
                </div>
                <Zap className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Review Platforms
                  </p>
                  <p className="mt-1 font-bold text-2xl">
                    {settings.reviewPlatforms.length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Email Campaigns
                  </p>
                  <p className="mt-1 font-bold text-2xl">
                    {
                      [
                        settings.sendSeasonalCampaigns,
                        settings.sendMaintenanceReminders,
                        settings.sendBirthdayOffers,
                        settings.sendAnniversaryOffers,
                        settings.sendWinbackCampaigns,
                      ].filter(Boolean).length
                    }
                  </p>
                </div>
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Social Channels
                  </p>
                  <p className="mt-1 font-bold text-2xl">
                    {settings.socialPlatforms.length}
                  </p>
                </div>
                <Share2 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Review Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4" />
              Review Requests
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Automatically ask happy customers to leave reviews
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Get more 5-star reviews on Google, Yelp, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Review Requests
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Ask customers to leave reviews after completing jobs
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Ask customers for reviews automatically
                </p>
              </div>
              <Switch
                checked={settings.enableReviewRequests}
                onCheckedChange={(checked) =>
                  updateSetting("enableReviewRequests", checked)
                }
              />
            </div>

            {settings.enableReviewRequests && (
              <>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Auto-Send Review Requests
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Automatically email review request after job
                            completion
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Send automatically after job completes
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoSendReviewRequests}
                    onCheckedChange={(checked) =>
                      updateSetting("autoSendReviewRequests", checked)
                    }
                  />
                </div>

                {settings.autoSendReviewRequests && (
                  <div>
                    <Label className="font-medium text-sm">
                      Wait How Many Days After Job?
                    </Label>
                    <Input
                      className="mt-2"
                      onChange={(e) =>
                        updateSetting(
                          "reviewRequestDelayDays",
                          Number.parseInt(e.target.value) ||
                            DEFAULT_REVIEW_DELAY_DAYS
                        )
                      }
                      placeholder="7"
                      type="number"
                      value={settings.reviewRequestDelayDays}
                    />
                    <p className="mt-1 text-muted-foreground text-xs">
                      Example: Wait 7 days after job to send review request
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Only Ask Happy Customers
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            First ask customer if they're happy. Only send to
                            public reviews if they say yes.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Pre-screen with private feedback first
                    </p>
                  </div>
                  <Switch
                    checked={settings.onlyRequestAfterPositiveExperience}
                    onCheckedChange={(checked) =>
                      updateSetting(
                        "onlyRequestAfterPositiveExperience",
                        checked
                      )
                    }
                  />
                </div>

                <Separator />

                <div>
                  <Label className="mb-3 flex items-center gap-2 font-medium text-sm">
                    Review Platforms
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Where you want customers to leave reviews
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { id: "google", name: "Google Business", icon: "🔍" },
                      { id: "yelp", name: "Yelp", icon: "🍽️" },
                      { id: "facebook", name: "Facebook", icon: "📘" },
                      { id: "bbb", name: "Better Business Bureau", icon: "🏢" },
                    ].map((platform) => (
                      <div
                        className="flex items-center justify-between rounded-lg border p-3"
                        key={platform.id}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{platform.icon}</span>
                          <span className="text-sm">{platform.name}</span>
                        </div>
                        <Switch
                          checked={settings.reviewPlatforms.includes(
                            platform.id
                          )}
                          onCheckedChange={() =>
                            togglePlatform("reviewPlatforms", platform.id)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Review Request Message
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Personal message in review request email
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Textarea
                    className="mt-2 min-h-[100px] resize-none"
                    onChange={(e) =>
                      updateSetting("reviewRequestMessage", e.target.value)
                    }
                    placeholder="We'd love to hear about your experience..."
                    value={settings.reviewRequestMessage}
                  />
                  <p className="mt-1 text-muted-foreground text-xs">
                    {settings.reviewRequestMessage.length} /{" "}
                    {MAX_MESSAGE_LENGTH} characters
                  </p>
                </div>

                <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-sm">
                        Reviews Drive Business Growth
                      </p>
                      <p className="text-muted-foreground text-xs">
                        88% of customers check reviews before choosing a
                        service. Businesses with 4+ stars get 3x more leads.
                        Just 10 more reviews can increase revenue by 15%.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Referral Program */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Referral Program
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Reward customers who send you new business
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Turn happy customers into your sales team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Referral Program
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Reward customers for referring friends and family
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Reward customers for referrals
                </p>
              </div>
              <Switch
                checked={settings.enableReferralProgram}
                onCheckedChange={(checked) =>
                  updateSetting("enableReferralProgram", checked)
                }
              />
            </div>

            {settings.enableReferralProgram && (
              <>
                <Separator />

                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Reward Type
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          How you'll reward the new customer
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      updateSetting(
                        "referralRewardType",
                        value as MarketingSettings["referralRewardType"]
                      )
                    }
                    value={settings.referralRewardType}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">
                        Account Credit - Credit on their account
                      </SelectItem>
                      <SelectItem value="cash">
                        Cash - Cash or check payment
                      </SelectItem>
                      <SelectItem value="discount">
                        Discount - Percentage off their next service
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-muted-foreground text-xs">
                    What the referred customer receives
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      New Customer Reward
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Amount given to the NEW customer
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="relative mt-2">
                      <span className="-translate-y-1/2 absolute top-1/2 left-3 text-muted-foreground text-sm">
                        {settings.referralRewardType === "discount" ? "%" : "$"}
                      </span>
                      <Input
                        className="pl-8"
                        onChange={(e) =>
                          updateSetting(
                            "referralRewardAmount",
                            Number.parseFloat(e.target.value) ||
                              DEFAULT_REFERRAL_REWARD
                          )
                        }
                        placeholder="50"
                        type="number"
                        value={settings.referralRewardAmount}
                      />
                    </div>
                    <p className="mt-1 text-muted-foreground text-xs">
                      What the new customer gets
                    </p>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Referrer Reward
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Amount given to the EXISTING customer who referred
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="relative mt-2">
                      <span className="-translate-y-1/2 absolute top-1/2 left-3 text-muted-foreground text-sm">
                        $
                      </span>
                      <Input
                        className="pl-8"
                        onChange={(e) =>
                          updateSetting(
                            "referrerReward",
                            Number.parseFloat(e.target.value) ||
                              DEFAULT_REFERRAL_REWARD
                          )
                        }
                        placeholder="50"
                        type="number"
                        value={settings.referrerReward}
                      />
                    </div>
                    <p className="mt-1 text-muted-foreground text-xs">
                      What the referrer gets
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Minimum Purchase Required
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          New customer must spend at least this much
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="relative mt-2">
                    <span className="-translate-y-1/2 absolute top-1/2 left-3 text-muted-foreground text-sm">
                      $
                    </span>
                    <Input
                      className="pl-8"
                      onChange={(e) =>
                        updateSetting(
                          "referralMinimumPurchase",
                          Number.parseFloat(e.target.value) || 100
                        )
                      }
                      placeholder="100"
                      type="number"
                      value={settings.referralMinimumPurchase}
                    />
                  </div>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Minimum purchase to qualify for referral rewards
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Auto-Apply Rewards
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Automatically give rewards when referral completes
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Apply rewards automatically
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoApplyReferralRewards}
                    onCheckedChange={(checked) =>
                      updateSetting("autoApplyReferralRewards", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Referral Landing Page
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Public page where customers can share referral links
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Shareable referral page
                    </p>
                  </div>
                  <Switch
                    checked={settings.referralLandingPageEnabled}
                    onCheckedChange={(checked) =>
                      updateSetting("referralLandingPageEnabled", checked)
                    }
                  />
                </div>

                <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <Gift className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-sm">
                        Referrals Close at 70% Rate
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Referred customers have a 70% close rate vs 13% from
                        cold leads. They spend 25% more and stay 18% longer.
                        Referral programs are the highest ROI marketing.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Email Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4" />
              Email Campaigns
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Automated emails to stay in touch with customers
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Stay top-of-mind with automated email campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Email Marketing
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Turn on automated email campaigns
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Send automated marketing emails
                </p>
              </div>
              <Switch
                checked={settings.enableEmailMarketing}
                onCheckedChange={(checked) =>
                  updateSetting("enableEmailMarketing", checked)
                }
              />
            </div>

            {settings.enableEmailMarketing && (
              <>
                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="font-medium text-sm">
                        Seasonal Campaigns
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Spring tune-up, winter prep, holiday specials
                      </p>
                    </div>
                    <Switch
                      checked={settings.sendSeasonalCampaigns}
                      onCheckedChange={(checked) =>
                        updateSetting("sendSeasonalCampaigns", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="font-medium text-sm">
                        Maintenance Reminders
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Remind customers when maintenance is due
                      </p>
                    </div>
                    <Switch
                      checked={settings.sendMaintenanceReminders}
                      onCheckedChange={(checked) =>
                        updateSetting("sendMaintenanceReminders", checked)
                      }
                    />
                  </div>

                  {settings.sendMaintenanceReminders && (
                    <div className="ml-6">
                      <Label className="text-sm">Send reminder every:</Label>
                      <Select
                        onValueChange={(value) =>
                          updateSetting(
                            "maintenanceReminderMonths",
                            Number.parseInt(value)
                          )
                        }
                        value={settings.maintenanceReminderMonths.toString()}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 months</SelectItem>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="font-medium text-sm">
                        Birthday Offers
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Send special discount on customer's birthday
                      </p>
                    </div>
                    <Switch
                      checked={settings.sendBirthdayOffers}
                      onCheckedChange={(checked) =>
                        updateSetting("sendBirthdayOffers", checked)
                      }
                    />
                  </div>

                  {settings.sendBirthdayOffers && (
                    <div className="ml-6">
                      <Label className="text-sm">Birthday Discount</Label>
                      <div className="relative mt-2">
                        <Input
                          onChange={(e) =>
                            updateSetting(
                              "birthdayDiscountPercent",
                              Number.parseInt(e.target.value) || 10
                            )
                          }
                          placeholder="10"
                          type="number"
                          value={settings.birthdayDiscountPercent}
                        />
                        <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                          %
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="font-medium text-sm">
                        Anniversary Offers
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Thank customers on their first service anniversary
                      </p>
                    </div>
                    <Switch
                      checked={settings.sendAnniversaryOffers}
                      onCheckedChange={(checked) =>
                        updateSetting("sendAnniversaryOffers", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="font-medium text-sm">
                        Win-Back Campaigns
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Re-engage customers who haven't used you recently
                      </p>
                    </div>
                    <Switch
                      checked={settings.sendWinbackCampaigns}
                      onCheckedChange={(checked) =>
                        updateSetting("sendWinbackCampaigns", checked)
                      }
                    />
                  </div>

                  {settings.sendWinbackCampaigns && (
                    <div className="ml-6">
                      <Label className="text-sm">
                        Consider inactive after (days):
                      </Label>
                      <Input
                        className="mt-2"
                        onChange={(e) =>
                          updateSetting(
                            "winbackInactiveDays",
                            Number.parseInt(e.target.value) || 365
                          )
                        }
                        placeholder="365"
                        type="number"
                        value={settings.winbackInactiveDays}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* SMS Marketing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4" />
              SMS Marketing
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Text message reminders and promotions
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Text messages have 98% open rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable SMS Marketing
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Send text messages to customers
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Send text messages to customers
                </p>
              </div>
              <Switch
                checked={settings.enableSMSMarketing}
                onCheckedChange={(checked) =>
                  updateSetting("enableSMSMarketing", checked)
                }
              />
            </div>

            {settings.enableSMSMarketing && (
              <>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Appointment Reminders
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Reduce no-shows with text reminders
                    </p>
                  </div>
                  <Switch
                    checked={settings.sendAppointmentReminders}
                    onCheckedChange={(checked) =>
                      updateSetting("sendAppointmentReminders", checked)
                    }
                  />
                </div>

                {settings.sendAppointmentReminders && (
                  <div>
                    <Label className="text-sm">
                      Send reminder how many hours before?
                    </Label>
                    <Input
                      className="mt-2"
                      onChange={(e) =>
                        updateSetting(
                          "appointmentReminderHours",
                          Number.parseInt(e.target.value) || 24
                        )
                      }
                      placeholder="24"
                      type="number"
                      value={settings.appointmentReminderHours}
                    />
                    <p className="mt-1 text-muted-foreground text-xs">
                      Example: Send 24 hours before appointment
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Promotional SMS
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Send marketing offers via text
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Send promotional offers via SMS
                    </p>
                  </div>
                  <Switch
                    checked={settings.sendPromotionalSMS}
                    onCheckedChange={(checked) =>
                      updateSetting("sendPromotionalSMS", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Require Opt-In
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Customer must agree to receive texts (required by
                            law)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Customer must consent to SMS
                    </p>
                  </div>
                  <Switch
                    checked={settings.smsOptInRequired}
                    onCheckedChange={(checked) =>
                      updateSetting("smsOptInRequired", checked)
                    }
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    SMS Frequency Limit
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Maximum promotional texts per customer per month
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    className="mt-2"
                    onChange={(e) =>
                      updateSetting(
                        "smsFrequencyLimit",
                        Number.parseInt(e.target.value) || 4
                      )
                    }
                    placeholder="4"
                    type="number"
                    value={settings.smsFrequencyLimit}
                  />
                  <p className="mt-1 text-muted-foreground text-xs">
                    Max promotional texts per month (prevents spam)
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Analytics & Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Analytics & Tracking
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Measure what's working and what's not
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Track performance and return on investment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Track Marketing ROI
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        See how much revenue each campaign generates
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Calculate return on marketing spend
                </p>
              </div>
              <Switch
                checked={settings.trackMarketingROI}
                onCheckedChange={(checked) =>
                  updateSetting("trackMarketingROI", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Track Lead Sources
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Know where each customer came from
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Track where customers found you
                </p>
              </div>
              <Switch
                checked={settings.trackLeadSources}
                onCheckedChange={(checked) =>
                  updateSetting("trackLeadSources", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  UTM Tracking
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Track which ads and links drive the most business
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Track campaign performance
                </p>
              </div>
              <Switch
                checked={settings.enableUTMTracking}
                onCheckedChange={(checked) =>
                  updateSetting("enableUTMTracking", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Google Analytics
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Track website visitors and conversions
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Track website traffic
                </p>
              </div>
              <Switch
                checked={settings.googleAnalyticsEnabled}
                onCheckedChange={(checked) =>
                  updateSetting("googleAnalyticsEnabled", checked)
                }
              />
            </div>

            {settings.googleAnalyticsEnabled && (
              <div>
                <Label className="text-sm">Google Analytics ID</Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting("googleAnalyticsId", e.target.value)
                  }
                  placeholder="G-XXXXXXXXXX"
                  value={settings.googleAnalyticsId}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Your GA4 measurement ID
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Facebook Pixel
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Track conversions from Facebook ads
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Track Facebook ad performance
                </p>
              </div>
              <Switch
                checked={settings.facebookPixelEnabled}
                onCheckedChange={(checked) =>
                  updateSetting("facebookPixelEnabled", checked)
                }
              />
            </div>

            {settings.facebookPixelEnabled && (
              <div>
                <Label className="text-sm">Facebook Pixel ID</Label>
                <Input
                  className="mt-2"
                  onChange={(e) =>
                    updateSetting("facebookPixelId", e.target.value)
                  }
                  placeholder="1234567890123456"
                  value={settings.facebookPixelId}
                />
                <p className="mt-1 text-muted-foreground text-xs">
                  Your Facebook Pixel ID
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button disabled={isSubmitting} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={handleSave}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Marketing Settings
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
