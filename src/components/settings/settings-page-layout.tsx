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

import { Check, HelpCircle, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type SettingsPageLayoutProps = {
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
};

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
	const router = useRouter();
	// Standard loading state
	if (isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<Loader2 className="text-muted-foreground size-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-8 py-8">
			{/* STANDARD HEADER */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h1 className="text-4xl font-bold tracking-tight">{title}</h1>
						{helpText && (
							<Tooltip>
								<TooltipTrigger asChild>
									<button className="flex-shrink-0" type="button">
										<HelpCircle className="text-muted-foreground h-3.5 w-3.5" />
									</button>
								</TooltipTrigger>
								<TooltipContent className="max-w-xs">
									<p className="text-sm">{helpText}</p>
								</TooltipContent>
							</Tooltip>
						)}
					</div>
					{hasChanges && (
						<Badge className="bg-warning hover:bg-warning">
							Unsaved Changes
						</Badge>
					)}
				</div>
				<p className="text-muted-foreground text-lg">{description}</p>
			</div>

			{/* CONTENT (Cards, forms, etc.) - space-y-6 automatically applied to children */}
			<div className="space-y-6">{children}</div>

			{/* STICKY BOTTOM ACTION BAR */}
			<div className="bg-card sticky bottom-0 z-10 rounded-xl border p-6 shadow-lg">
				<div className="flex items-center justify-between">
					{/* Save status indicator */}
					<div className="flex items-center gap-3">
						{hasChanges ? (
							<>
								<div className="bg-warning dark:bg-warning/30 flex h-8 w-8 items-center justify-center rounded-full">
									<div className="bg-warning h-2 w-2 animate-pulse rounded-full" />
								</div>
								<div>
									<p className="text-sm font-medium">Unsaved Changes</p>
									<p className="text-muted-foreground text-xs">
										Save your changes or discard them
									</p>
								</div>
							</>
						) : (
							<>
								<div className="bg-success dark:bg-success/30 flex h-8 w-8 items-center justify-center rounded-full">
									<Check className="text-success dark:text-success h-4 w-4" />
								</div>
								<div>
									<p className="text-sm font-medium">All Changes Saved</p>
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
							disabled={isPending}
							onClick={onCancel || (() => router.refresh())}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isPending || !hasChanges}
							onClick={onSave}
							type="button"
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

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type SettingsInfoBannerProps = {
	/** Icon to display (Lucide icon component) */
	icon: LucideIcon;

	/** Banner title */
	title: string;

	/** Banner description/content */
	description: string;

	/** Variant color (default: blue) */
	variant?: "blue" | "amber" | "red" | "green";
};

export function SettingsInfoBanner({
	icon: Icon,
	title,
	description,
	variant = "blue",
}: SettingsInfoBannerProps) {
	const variantStyles = {
		blue: {
			card: "border-primary/50 bg-primary/5",
			icon: "text-primary",
			title: "text-primary dark:text-primary",
		},
		amber: {
			card: "border-warning/50 bg-warning/5",
			icon: "text-warning",
			title: "text-warning dark:text-warning",
		},
		red: {
			card: "border-destructive/50 bg-destructive/5",
			icon: "text-destructive",
			title: "text-destructive dark:text-destructive",
		},
		green: {
			card: "border-success/50 bg-success/5",
			icon: "text-success",
			title: "text-success dark:text-success",
		},
	};

	const styles = variantStyles[variant];

	return (
		<Card className={styles.card}>
			<CardContent className="flex items-start gap-3 pt-6">
				<Icon className={`mt-0.5 h-5 w-5 shrink-0 ${styles.icon}`} />
				<div className="space-y-1">
					<p className={`text-sm font-medium ${styles.title}`}>{title}</p>
					<p className="text-muted-foreground text-sm">{description}</p>
				</div>
			</CardContent>
		</Card>
	);
}
