"use client";

/**
 * Standard Settings Coming Soon Component
 *
 * This component follows the EXACT same layout pattern as all other settings pages.
 * Uses the same header (text-4xl), spacing (space-y-8 py-8), and card structure.
 *
 * Features:
 * - Matches standard settings page layout exactly
 * - No sticky bottom bar (no save action needed)
 * - Consistent spacing and typography
 * - Standard info banner at bottom
 */

import { ArrowLeft, Clock, HelpCircle, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SettingsComingSoonProps {
  /** Icon to display in the coming soon card */
  icon: LucideIcon;

  /** Page title (displayed as text-4xl to match standard) */
  title: string;

  /** Page description */
  description: string;

  /** Optional help text shown in tooltip next to title */
  helpText?: string;

  /** Link to navigate back (default: /dashboard/settings) */
  backLink?: string;

  /** Label for back button (default: Back to Settings) */
  backLabel?: string;
}

export function SettingsComingSoon({
  icon: Icon,
  title,
  description,
  helpText,
  backLink = "/dashboard/settings",
  backLabel = "Back to Settings",
}: SettingsComingSoonProps) {
  return (
    <div className="space-y-8 py-8">
      {/* STANDARD HEADER (matches all other settings pages) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-4xl tracking-tight">{title}</h1>
            {helpText && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex-shrink-0" type="button">
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{helpText}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>

      {/* CONTENT - space-y-6 for sections (matches standard) */}
      <div className="space-y-6">
        {/* Coming Soon Card */}
        <Card className="border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
              <div className="relative flex size-20 items-center justify-center rounded-full border border-primary/20 bg-primary/5">
                <Icon className="size-10 text-primary" strokeWidth={1.5} />
              </div>
            </div>

            {/* Coming Soon Badge */}
            <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
              <Clock className="mr-2 size-4" />
              <span className="font-medium">Coming Soon</span>
            </div>

            {/* Message */}
            <h2 className="mb-2 font-semibold text-2xl">
              This Feature is Under Development
            </h2>
            <p className="mb-8 max-w-md text-muted-foreground">
              We're working hard to bring you powerful {title.toLowerCase()}{" "}
              capabilities. Check back soon for updates!
            </p>

            {/* Back Button */}
            <Button asChild variant="outline">
              <Link href={backLink}>
                <ArrowLeft className="mr-2 size-4" />
                {backLabel}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Standard Info Banner (matches other settings pages) */}
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="space-y-1">
              <p className="font-medium text-primary text-sm dark:text-primary">
                Want to be notified when this feature launches?
              </p>
              <p className="text-muted-foreground text-sm">
                Contact support to get added to our early access list for{" "}
                {title.toLowerCase()}. We'll notify you as soon as it's
                available.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NO STICKY BOTTOM BAR for Coming Soon pages (no save action needed) */}
    </div>
  );
}
