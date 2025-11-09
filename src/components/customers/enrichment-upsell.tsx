/**
 * Enrichment Upsell Component
 *
 * Show premium features and upgrade prompts for enrichment tiers
 */

"use client";

import { Check, Crown, Lock, Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EnrichmentUpsellProps {
  currentTier: "free" | "pro" | "enterprise";
  usageCount: number;
  usageLimit: number | null;
  showFullFeatures?: boolean;
}

export function EnrichmentUpsell({
  currentTier,
  usageCount,
  usageLimit,
  showFullFeatures = false,
}: EnrichmentUpsellProps) {
  const usagePercentage = usageLimit
    ? Math.min((usageCount / usageLimit) * 100, 100)
    : 0;

  const isLimitReached = usageLimit && usageCount >= usageLimit;

  const tierFeatures = {
    free: {
      name: "Free",
      limit: "50 enrichments/month",
      features: [
        "Basic person data",
        "Email verification",
        "Company information",
        "7-day cache",
      ],
      locked: [
        "Social media profiles",
        "Property valuations",
        "Business reviews",
        "Priority support",
      ],
    },
    pro: {
      name: "Pro",
      limit: "500 enrichments/month",
      price: "$49/month",
      features: [
        "Everything in Free",
        "Social media profiles",
        "Property valuations",
        "Business reviews & ratings",
        "1-day cache refresh",
        "Email support",
      ],
      locked: [
        "Unlimited enrichments",
        "Real-time updates",
        "Priority support",
      ],
    },
    enterprise: {
      name: "Enterprise",
      limit: "Unlimited enrichments",
      price: "$199/month",
      features: [
        "Everything in Pro",
        "Unlimited enrichments",
        "Real-time updates",
        "Custom data sources",
        "Priority support",
        "Dedicated account manager",
      ],
      locked: [],
    },
  };

  const currentFeatures = tierFeatures[currentTier];

  if (showFullFeatures) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Object.entries(tierFeatures).map(([tier, features]) => {
          const isCurrent = tier === currentTier;
          const isPremium = tier !== "free";

          return (
            <Card
              className={isCurrent ? "border-primary shadow-lg" : ""}
              key={tier}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {tier === "enterprise" && (
                      <Crown className="h-5 w-5 text-yellow-500" />
                    )}
                    {tier === "pro" && (
                      <Zap className="h-5 w-5 text-blue-500" />
                    )}
                    {features.name}
                  </CardTitle>
                  {isCurrent && <Badge>Current</Badge>}
                </div>
                <CardDescription>
                  <div className="mt-2 font-bold text-2xl">
                    {"price" in features ? features.price : "Free"}
                  </div>
                  <div className="text-sm">{features.limit}</div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {features.features.map((feature, index) => (
                  <div className="flex items-center gap-2" key={index}>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                {features.locked.map((feature, index) => (
                  <div
                    className="flex items-center gap-2 text-muted-foreground"
                    key={index}
                  >
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                {!isCurrent && (
                  <Button asChild className="w-full">
                    <Link href="/dashboard/settings/subscriptions">
                      {isPremium ? "Upgrade" : "Downgrade"}
                    </Link>
                  </Button>
                )}
                {isCurrent && (
                  <Button className="w-full" disabled variant="outline">
                    Current Plan
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  }

  // Compact usage banner
  return (
    <Card className={isLimitReached ? "border-destructive" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" />
            Enrichment Usage
          </CardTitle>
          <Badge variant={isLimitReached ? "destructive" : "secondary"}>
            {currentFeatures.name}
          </Badge>
        </div>
        <CardDescription>
          {usageLimit ? (
            <>
              {usageCount} of {usageLimit} enrichments used this month
            </>
          ) : (
            <>Unlimited enrichments</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {usageLimit && <Progress className="h-2" value={usagePercentage} />}

        {isLimitReached && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">
                  Enrichment limit reached
                </p>
                <p className="mt-1 text-muted-foreground text-sm">
                  Upgrade to continue enriching customer data
                </p>
              </div>
            </div>
          </div>
        )}

        {currentTier === "free" && usagePercentage > 70 && (
          <div className="rounded-lg border bg-accent p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Unlock more enrichments</p>
                <p className="mt-1 text-muted-foreground text-sm">
                  Upgrade to Pro for 500 enrichments/month + social profiles
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {(isLimitReached ||
        (currentTier !== "enterprise" && usagePercentage > 70)) && (
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/dashboard/settings/subscriptions">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
