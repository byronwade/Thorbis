"use client";

/**
 * Standard Settings Page Layout Template
 *
 * This component provides a consistent layout pattern for ALL settings pages.
 * Every settings page MUST use this exact layout structure with zero deviations.
 *
 * Features:
 * - text-4xl title with optional tooltip
 * - Sticky bottom action bar with save status indicator
 * - Consistent spacing (space-y-8 py-8 wrapper, space-y-6 for content)
 * - Standardized loading state
 * - Unsaved changes badge in header
 *
 * @example
 * ```tsx
 * <SettingsPageLayout
 *   title="Email Settings"
 *   description="Configure your email address, signature, and tracking"
 *   helpText="Settings that control how emails are sent from your account"
 *   hasChanges={hasUnsavedChanges}
 *   isPending={isPending}
 *   onSave={handleSave}
 *   onCancel={() => window.location.reload()}
 *   saveButtonText="Save Email Settings"
 * >
 *   <Card>...</Card>
 *   <Card>...</Card>
 * </SettingsPageLayout>
 * ```
 */

import { ReactNode } from "react";
import { Loader2, Save, Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SettingsPageLayoutProps {
  /** Page title (displayed as text-4xl) */
  title: string;

  /** Page description (displayed below title) */
  description: string;

  /** Optional help text shown in tooltip next to title */
  helpText?: string;

  /** Whether there are unsaved changes */
  hasChanges?: boolean;

  /** Whether save operation is in progress */
  isPending?: boolean;

  /** Whether page is loading initial data */
  isLoading?: boolean;

  /** Save button click handler */
  onSave?: () => void;

  /** Cancel button click handler */
  onCancel?: () => void;

  /** Custom save button text (default: "Save Settings") */
  saveButtonText?: string;

  /** Page content (Cards, forms, etc.) */
  children: ReactNode;
}

export function SettingsPageLayout({
  title,
  description,
  helpText,
  hasChanges = false,
  isPending = false,
  isLoading = false,
  onSave,
  onCancel,
  saveButtonText = "Save Settings",
  children,
}: SettingsPageLayoutProps) {
  // Standard loading state
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      {/* STANDARD HEADER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-4xl tracking-tight">{title}</h1>
            {helpText && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="flex-shrink-0">
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{helpText}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {hasChanges && (
            <Badge className="bg-amber-600 hover:bg-amber-700">
              Unsaved Changes
            </Badge>
          )}
        </div>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>

      {/* CONTENT (Cards, forms, etc.) - space-y-6 automatically applied to children */}
      <div className="space-y-6">
        {children}
      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="sticky bottom-0 z-10 rounded-xl border bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Save status indicator */}
          <div className="flex items-center gap-3">
            {hasChanges ? (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Unsaved Changes</p>
                  <p className="text-muted-foreground text-xs">
                    Save your changes or discard them
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">All Changes Saved</p>
                  <p className="text-muted-foreground text-xs">
                    Your settings are up to date
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel || (() => window.location.reload())}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSave}
              disabled={isPending || !hasChanges}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  {saveButtonText}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Standard Info Banner Component
 *
 * Use this for helpful tips, warnings, or important information within settings pages.
 * Always use the blue variant unless showing errors/warnings.
 *
 * @example
 * ```tsx
 * <SettingsInfoBanner
 *   icon={Mail}
 *   title="Email Best Practices"
 *   description="Use a professional email address and keep your signature concise."
 * />
 * ```
 */

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SettingsInfoBannerProps {
  /** Icon to display (Lucide icon component) */
  icon: LucideIcon;

  /** Banner title */
  title: string;

  /** Banner description/content */
  description: string;

  /** Variant color (default: blue) */
  variant?: "blue" | "amber" | "red" | "green";
}

export function SettingsInfoBanner({
  icon: Icon,
  title,
  description,
  variant = "blue",
}: SettingsInfoBannerProps) {
  const variantStyles = {
    blue: {
      card: "border-blue-500/50 bg-blue-500/5",
      icon: "text-blue-500",
      title: "text-blue-700 dark:text-blue-400",
    },
    amber: {
      card: "border-amber-500/50 bg-amber-500/5",
      icon: "text-amber-500",
      title: "text-amber-700 dark:text-amber-400",
    },
    red: {
      card: "border-red-500/50 bg-red-500/5",
      icon: "text-red-500",
      title: "text-red-700 dark:text-red-400",
    },
    green: {
      card: "border-green-500/50 bg-green-500/5",
      icon: "text-green-500",
      title: "text-green-700 dark:text-green-400",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card className={styles.card}>
      <CardContent className="flex items-start gap-3 pt-6">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${styles.icon}`} />
        <div className="space-y-1">
          <p className={`font-medium text-sm ${styles.title}`}>{title}</p>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
