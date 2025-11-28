"use client";

/**
 * Progress Banner - Save indicator and progress persistence message
 *
 * Shows users that their progress is automatically saved, reducing anxiety
 * about losing data if they need to step away.
 */

import {
	ArrowLeft,
	Check,
	Cloud,
	CloudOff,
	Info,
	Loader2,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	STEP_CONFIG,
	useOnboardingStore,
} from "@/lib/onboarding/onboarding-store";
import { cn } from "@/lib/utils";

interface ProgressBannerProps {
	/** Whether data is currently being saved */
	isSaving?: boolean;
	/** Last saved timestamp */
	lastSaved?: Date | null;
	/** Show the banner */
	show?: boolean;
	/** Callback to dismiss */
	onDismiss?: () => void;
	className?: string;
}

function ProgressBanner({
	isSaving = false,
	lastSaved,
	show = true,
	onDismiss,
	className,
}: ProgressBannerProps) {
	const [dismissed, setDismissed] = useState(false);

	if (!show || dismissed) return null;

	const handleDismiss = () => {
		setDismissed(true);
		onDismiss?.();
	};

	return (
		<div
			className={cn(
				"fixed bottom-24 left-1/2 -translate-x-1/2 z-50",
				"bg-background/95 backdrop-blur border rounded-full shadow-lg",
				"px-4 py-2 flex items-center gap-3",
				"animate-in slide-in-from-bottom-4 fade-in duration-300",
				className,
			)}
		>
			{isSaving ? (
				<>
					<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
					<span className="text-sm text-muted-foreground">Saving...</span>
				</>
			) : (
				<>
					<Cloud className="h-4 w-4 text-green-500" />
					<span className="text-sm text-muted-foreground">
						Progress saved
						{lastSaved && (
							<span className="hidden sm:inline">
								{" "}
								· {formatTimeAgo(lastSaved)}
							</span>
						)}
					</span>
				</>
			)}
			<Button
				variant="ghost"
				size="icon"
				className="h-6 w-6 -mr-1"
				onClick={handleDismiss}
			>
				<X className="h-3.5 w-3.5" />
			</Button>
		</div>
	);
}

/**
 * Auto-save indicator - Shows in the header
 */
interface AutoSaveIndicatorProps {
	isSaving?: boolean;
	lastSaved?: Date | null;
	error?: string | null;
}

export function AutoSaveIndicator({
	isSaving = false,
	lastSaved,
	error,
}: AutoSaveIndicatorProps) {
	if (error) {
		return (
			<div className="flex items-center gap-1.5 text-destructive">
				<CloudOff className="h-3.5 w-3.5" />
				<span className="text-xs">Save failed</span>
			</div>
		);
	}

	if (isSaving) {
		return (
			<div className="flex items-center gap-1.5 text-muted-foreground">
				<Loader2 className="h-3.5 w-3.5 animate-spin" />
				<span className="text-xs">Saving...</span>
			</div>
		);
	}

	if (lastSaved) {
		return (
			<div className="flex items-center gap-1.5 text-muted-foreground">
				<Check className="h-3.5 w-3.5 text-green-500" />
				<span className="text-xs">Saved</span>
			</div>
		);
	}

	return null;
}

/**
 * Welcome Back Banner - Shows when user returns to incomplete onboarding
 */
interface WelcomeBackBannerProps {
	companyName?: string;
	currentStep?: string;
	progress?: number;
	onContinue?: () => void;
	onStartFresh?: () => void;
}

function WelcomeBackBanner({
	companyName,
	currentStep,
	progress = 0,
	onContinue,
	onStartFresh,
}: WelcomeBackBannerProps) {
	const stepConfig = currentStep
		? STEP_CONFIG[currentStep as keyof typeof STEP_CONFIG]
		: null;

	return (
		<div className="bg-muted/30 border rounded-lg p-4 mb-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="space-y-1">
					<h3 className="font-medium flex items-center gap-2">
						<Info className="h-4 w-4 text-primary" />
						Welcome back{companyName ? `, ${companyName}` : ""}!
					</h3>
					<p className="text-sm text-muted-foreground">
						Your progress was saved. You're {progress}% through setup
						{stepConfig && ` - last on "${stepConfig.title}"`}.
					</p>
				</div>
				<div className="flex items-center gap-2">
					{onStartFresh && (
						<Button variant="ghost" size="sm" onClick={onStartFresh}>
							Start fresh
						</Button>
					)}
					{onContinue && (
						<Button size="sm" onClick={onContinue}>
							Continue setup
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

/**
 * Multi-Company Context Banner - Shows when user has multiple companies
 */
interface CompanyContextBannerProps {
	/** Current company being set up */
	currentCompanyName?: string;
	/** Other company user has access to */
	activeCompanyName?: string;
	/** Callback to switch to active company */
	onSwitchToActive?: () => void;
	/** Whether this is a new company setup */
	isNewCompany?: boolean;
}

export function CompanyContextBanner({
	currentCompanyName,
	activeCompanyName,
	onSwitchToActive,
	isNewCompany = false,
}: CompanyContextBannerProps) {
	if (!activeCompanyName || !isNewCompany) return null;

	return (
		<div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<div className="space-y-0.5">
					<p className="text-sm font-medium text-amber-700 dark:text-amber-400">
						Setting up: {currentCompanyName || "New Company"}
					</p>
					<p className="text-xs text-amber-600/80 dark:text-amber-400/70">
						Complete setup to access this company's dashboard
					</p>
				</div>
				{onSwitchToActive && activeCompanyName && (
					<Button
						variant="outline"
						size="sm"
						onClick={onSwitchToActive}
						className="border-amber-500/30 hover:bg-amber-500/10"
					>
						<ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
						Back to {activeCompanyName}
					</Button>
				)}
			</div>
		</div>
	);
}

/**
 * Step Info Card - Shows additional context for complex steps
 */
interface StepInfoCardProps {
	title: string;
	description: string;
	bullets?: string[];
	variant?: "info" | "warning" | "success";
	className?: string;
}

function StepInfoCard({
	title,
	description,
	bullets,
	variant = "info",
	className,
}: StepInfoCardProps) {
	const variants = {
		info: "bg-primary/5 border-primary/20 text-primary",
		warning:
			"bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
		success:
			"bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400",
	};

	return (
		<div className={cn("rounded-lg border p-4", variants[variant], className)}>
			<h4 className="font-medium text-sm mb-1">{title}</h4>
			<p className="text-sm opacity-80 mb-2">{description}</p>
			{bullets && bullets.length > 0 && (
				<ul className="space-y-1">
					{bullets.map((bullet, i) => (
						<li key={i} className="text-sm opacity-70 flex items-start gap-2">
							<span className="mt-1.5 h-1 w-1 rounded-full bg-current flex-shrink-0" />
							{bullet}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

/**
 * Skip Step Confirmation - Better UX for skipping optional steps
 */
interface SkipConfirmationProps {
	stepName: string;
	consequences?: string[];
	onSkip: () => void;
	onCancel: () => void;
}

export function SkipConfirmation({
	stepName,
	consequences = [],
	onSkip,
	onCancel,
}: SkipConfirmationProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
			<div className="bg-background border rounded-lg shadow-lg p-6 max-w-md mx-4">
				<h3 className="font-semibold text-lg mb-2">Skip {stepName}?</h3>
				<p className="text-muted-foreground text-sm mb-4">
					You can configure this later in Settings.
				</p>
				{consequences.length > 0 && (
					<div className="bg-muted/50 rounded-md p-3 mb-4">
						<p className="text-sm font-medium mb-2">If you skip this step:</p>
						<ul className="space-y-1">
							{consequences.map((item, i) => (
								<li
									key={i}
									className="text-sm text-muted-foreground flex items-start gap-2"
								>
									<span className="text-amber-500">•</span>
									{item}
								</li>
							))}
						</ul>
					</div>
				)}
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={onCancel}>
						Go back
					</Button>
					<Button variant="secondary" onClick={onSkip}>
						Skip for now
					</Button>
				</div>
			</div>
		</div>
	);
}

// Helper function
function formatTimeAgo(date: Date): string {
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

	if (seconds < 60) return "just now";
	if (seconds < 120) return "1 minute ago";
	if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
	if (seconds < 7200) return "1 hour ago";
	if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
	return "yesterday";
}
