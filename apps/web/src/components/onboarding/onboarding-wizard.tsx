"use client";

/**
 * Onboarding Wizard - Clean, Minimalist Design
 *
 * World-class onboarding experience across 5 phases:
 * - Phase 1: Getting Started (Welcome, Company)
 * - Phase 2: Communication (Phone, Email, Notifications)
 * - Phase 3: Business Setup (Services, Team, Payments)
 * - Phase 4: Operations (Schedule, Reports, Settings)
 * - Phase 5: Launch (First Action, Complete)
 *
 * Features:
 * - Auto-save progress with visual indicator
 * - Multi-company support with context banner
 * - Contextual help tooltips
 * - Improved skip step UX
 * - Error boundary for graceful failures
 */

import {
	AlertTriangle,
	Calendar,
	ChevronLeft,
	ChevronRight,
	Loader2,
	Phone,
	RefreshCw,
	Rocket,
	Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, {
	Component,
	type ErrorInfo,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { completeOnboardingWizard } from "@/actions/onboarding";
import {
	type WalkthroughSlide,
	WalkthroughSlideshow,
} from "@/components/onboarding/info-cards/walkthrough-slide";
import {
	AutoSaveIndicator,
	CompanyContextBanner,
	SkipConfirmation,
} from "@/components/onboarding/progress-banner";
import { CompanyStep } from "@/components/onboarding/steps/company-step";
import { CompleteStep } from "@/components/onboarding/steps/complete-step";
import { DataImportStep } from "@/components/onboarding/steps/data-import-step";
import { EmailStep } from "@/components/onboarding/steps/email-step";
import { FirstActionStep } from "@/components/onboarding/steps/first-action-step";
import { IntegrationsStep } from "@/components/onboarding/steps/integrations-step";
import { NotificationsStep } from "@/components/onboarding/steps/notifications-step";
import { PaymentCollectionStep } from "@/components/onboarding/steps/payment-collection-step";
import { PaymentsStep } from "@/components/onboarding/steps/payments-step";
import { PhoneStep } from "@/components/onboarding/steps/phone-step";
import { ReportsStep } from "@/components/onboarding/steps/reports-step";
import { ScheduleStep } from "@/components/onboarding/steps/schedule-step";
import { ServicesStep } from "@/components/onboarding/steps/services-step";
import { SettingsStep } from "@/components/onboarding/steps/settings-step";
import { TeamStep } from "@/components/onboarding/steps/team-step";
// Step Components
import { WelcomeStep } from "@/components/onboarding/steps/welcome-step";
import { Button } from "@/components/ui/button";
import {
	type OnboardingStep,
	STEP_CONFIG,
	useOnboardingStore,
} from "@/lib/onboarding/onboarding-store";
import { cn } from "@/lib/utils";

// =============================================================================
// ERROR BOUNDARY
// =============================================================================

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

class OnboardingErrorBoundary extends Component<
	{ children: ReactNode; onReset: () => void },
	ErrorBoundaryState
> {
	constructor(props: { children: ReactNode; onReset: () => void }) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Onboarding error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen bg-background flex items-center justify-center p-4">
					<div className="max-w-md w-full text-center space-y-4">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
							<AlertTriangle className="h-8 w-8 text-destructive" />
						</div>
						<h2 className="text-xl font-semibold">Something went wrong</h2>
						<p className="text-muted-foreground text-sm">
							Don't worry - your progress has been saved. Try refreshing the
							page.
						</p>
						<div className="flex justify-center gap-3 pt-2">
							<Button
								variant="outline"
								onClick={() => {
									this.setState({ hasError: false, error: null });
									this.props.onReset();
								}}
							>
								<RefreshCw className="h-4 w-4 mr-2" />
								Try again
							</Button>
							<Button onClick={() => window.location.reload()}>
								Refresh page
							</Button>
						</div>
						{process.env.NODE_ENV === "development" && this.state.error && (
							<pre className="mt-4 text-left text-xs bg-muted p-3 rounded overflow-auto max-h-32">
								{this.state.error.message}
							</pre>
						)}
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

// =============================================================================
// CONSTANTS
// =============================================================================

const STEP_ORDER: OnboardingStep[] = [
	"welcome",
	"company",
	"data-import",
	"integrations",
	"phone",
	"email",
	"notifications",
	"services",
	"team",
	"payments",
	"billing",
	"schedule",
	"reports",
	"settings",
	"first-action",
	"complete",
];

const PHASE_LABELS: Record<number, string> = {
	1: "Getting Started",
	2: "Communication",
	3: "Business Setup",
	4: "Operations",
	5: "Launch",
};

// Phase transition walkthroughs
const PHASE_WALKTHROUGHS: Record<number, WalkthroughSlide[]> = {
	2: [
		{
			id: "phase-2",
			title: "Time to Connect with Customers",
			description:
				"Great job setting up your company! Now let's configure how you'll communicate with customers.",
			icon: <Phone className="h-8 w-8" />,
			bullets: [
				"Phone & SMS setup",
				"Email configuration",
				"Notification preferences",
			],
		},
	],
	3: [
		{
			id: "phase-3",
			title: "Building Your Business",
			description:
				"Communication is ready! Let's set up the core of your business - services, team, and payments.",
			icon: <Wrench className="h-8 w-8" />,
			bullets: [
				"Service catalog & pricing",
				"Team invitations",
				"Payment processing",
			],
		},
	],
	4: [
		{
			id: "phase-4",
			title: "Optimizing Operations",
			description:
				"Your business core is configured! Now let's optimize how you work day-to-day.",
			icon: <Calendar className="h-8 w-8" />,
			bullets: ["Business hours", "Dashboard widgets", "Key settings"],
		},
	],
	5: [
		{
			id: "phase-5",
			title: "Ready for Launch!",
			description:
				"Almost there! Let's do one quick action to make sure everything works perfectly.",
			icon: <Rocket className="h-8 w-8" />,
			bullets: ["Take your first action", "See your dashboard"],
		},
	],
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

// Skip step consequences for UX
const SKIP_CONSEQUENCES: Partial<Record<OnboardingStep, string[]>> = {
	phone: [
		"You won't have a business phone number",
		"Customers can't call or text through the platform",
		"No SMS appointment reminders",
	],
	email: [
		"Emails will come from noreply@thorbis.com",
		"May have lower deliverability",
		"Less professional appearance",
	],
	services: [
		"You'll need to add services manually later",
		"No pre-built pricing templates",
	],
	team: [
		"Team members won't have access yet",
		"You can invite them later from Settings",
	],
	payments: ["Can't accept online payments", "Manual payment tracking only"],
	schedule: [
		"Default business hours (9-5, Mon-Fri)",
		"No service area defined",
	],
};

function OnboardingWizardInner() {
	const router = useRouter();
	const {
		data,
		currentStep,
		setCurrentStep,
		completedSteps,
		skippedSteps,
		completeStep,
		skipStep,
		updateData,
		isSaving,
	} = useOnboardingStore();

	// Walkthrough state
	const [showWalkthrough, setShowWalkthrough] = useState(false);
	const [walkthroughSlides, setWalkthroughSlides] = useState<
		WalkthroughSlide[]
	>([]);
	const [pendingNavigation, setPendingNavigation] =
		useState<OnboardingStep | null>(null);
	const [isCompleting, setIsCompleting] = useState(false);
	const [completeError, setCompleteError] = useState<string | null>(null);

	// Skip confirmation state
	const [showSkipConfirm, setShowSkipConfirm] = useState(false);

	// Auto-save state
	const [lastSaved, setLastSaved] = useState<Date | null>(null);

	// Track saves
	useEffect(() => {
		if (!isSaving) {
			setLastSaved(new Date());
		}
	}, [isSaving, data]);

	const currentStepIndex = STEP_ORDER.indexOf(currentStep);
	const currentConfig = STEP_CONFIG[currentStep];
	const currentPhase = currentConfig.phase;
	const progress = ((currentStepIndex + 1) / STEP_ORDER.length) * 100;
	const isLastStep = currentStep === "complete";
	const isFirstStep = currentStep === "welcome";

	// Calculate time estimate
	const remainingSteps = STEP_ORDER.slice(currentStepIndex);
	const remainingMinutes = remainingSteps.reduce(
		(acc, step) => acc + STEP_CONFIG[step].estimatedMinutes,
		0,
	);

	// Check if we should show a phase walkthrough
	const checkPhaseTransition = useCallback(
		(nextStep: OnboardingStep) => {
			const nextConfig = STEP_CONFIG[nextStep];
			const nextPhase = nextConfig.phase;

			if (nextPhase > currentPhase && PHASE_WALKTHROUGHS[nextPhase]) {
				setWalkthroughSlides(PHASE_WALKTHROUGHS[nextPhase]);
				setPendingNavigation(nextStep);
				setShowWalkthrough(true);
				return true;
			}
			return false;
		},
		[currentPhase],
	);

	// Navigation validation
	// Development bypass - only active when NODE_ENV === "development"
	// This is automatically disabled in production builds
	const isDev = process.env.NODE_ENV === "development";
	const canProceed = useMemo(() => {
		// Bypass validation in development for easier testing
		if (isDev) return true;

		const config = STEP_CONFIG[currentStep];
		if (!config.required) return true;

		switch (currentStep) {
			case "welcome":
				return !!data.path && !!data.industry;
			case "company":
				return !!data.companyName;
			default:
				return true;
		}
	}, [currentStep, data, isDev]);

	const goNext = useCallback(() => {
		const nextIndex = currentStepIndex + 1;
		if (nextIndex < STEP_ORDER.length) {
			completeStep(currentStep);
			const nextStep = STEP_ORDER[nextIndex];

			if (!checkPhaseTransition(nextStep)) {
				setCurrentStep(nextStep);
			}
		}
	}, [
		currentStepIndex,
		currentStep,
		completeStep,
		setCurrentStep,
		checkPhaseTransition,
	]);

	const goBack = useCallback(() => {
		const prevIndex = currentStepIndex - 1;
		if (prevIndex >= 0) {
			setCurrentStep(STEP_ORDER[prevIndex]);
		}
	}, [currentStepIndex, setCurrentStep]);

	// Handle skip with confirmation for important steps
	const handleSkipRequest = useCallback(() => {
		const hasConsequences = SKIP_CONSEQUENCES[currentStep];
		if (hasConsequences && hasConsequences.length > 0) {
			setShowSkipConfirm(true);
		} else {
			// No consequences, skip directly
			skipStep(currentStep);
			goNext();
		}
	}, [currentStep, skipStep, goNext]);

	const handleSkipConfirm = useCallback(() => {
		setShowSkipConfirm(false);
		skipStep(currentStep);
		goNext();
	}, [currentStep, skipStep, goNext]);

	const handleWalkthroughComplete = useCallback(() => {
		setShowWalkthrough(false);
		if (pendingNavigation) {
			setCurrentStep(pendingNavigation);
			setPendingNavigation(null);
		}
	}, [pendingNavigation, setCurrentStep]);

	const handleComplete = useCallback(async () => {
		setIsCompleting(true);
		setCompleteError(null);

		try {
			const result = await completeOnboardingWizard({
				path: data.path,
				industry: data.industry,
				companyName: data.companyName,
				phoneSetupType: data.phoneSetupType,
				emailSetupType: data.emailSetupType,
				services: data.services,
				teamInvites: data.teamMembers,
				paymentSetupComplete: data.paymentSetupComplete,
				completedSteps: completedSteps,
				skippedSteps: skippedSteps,
			});

			if (!result.success) {
				setCompleteError(result.error || "Failed to complete onboarding");
				setIsCompleting(false);
				return;
			}

			updateData({ onboardingCompleted: true });
			router.push("/dashboard");
		} catch (error) {
			setCompleteError(
				error instanceof Error ? error.message : "An unexpected error occurred",
			);
			setIsCompleting(false);
		}
	}, [data, completedSteps, skippedSteps, updateData, router]);

	return (
		<>
			{/* Phase Transition Walkthrough */}
			{showWalkthrough && (
				<WalkthroughSlideshow
					slides={walkthroughSlides}
					onComplete={handleWalkthroughComplete}
				/>
			)}

			{/* Skip Confirmation Modal */}
			{showSkipConfirm && (
				<SkipConfirmation
					stepName={currentConfig.title}
					consequences={SKIP_CONSEQUENCES[currentStep]}
					onSkip={handleSkipConfirm}
					onCancel={() => setShowSkipConfirm(false)}
				/>
			)}

			<div className="flex-1 flex flex-col">
				{/* Progress Header - Only shown after payment collected */}
				{data.paymentMethodCollected && (
					<div className="sticky top-14 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
						<div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
							<div className="flex items-center justify-between h-12">
								{/* Left: Step name */}
								<span className="text-sm text-muted-foreground truncate">
									{currentConfig.title}
								</span>

								{/* Center: Progress bar */}
								<div className="flex items-center gap-3 flex-1 max-w-xs mx-6">
									<div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
										<div
											className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
											style={{ width: `${progress}%` }}
										/>
									</div>
									<span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
										{Math.round(progress)}%
									</span>
								</div>

								{/* Right: Save status */}
								<div className="flex items-center gap-3">
									<AutoSaveIndicator
										isSaving={isSaving}
										lastSaved={lastSaved}
									/>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Main Content */}
				<main className="flex-1">
					<div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
						{currentStep === "welcome" && <WelcomeStep />}
						{currentStep === "company" && <CompanyStep />}
						{currentStep === "data-import" && <DataImportStep />}
						{currentStep === "integrations" && <IntegrationsStep />}
						{currentStep === "phone" && <PhoneStep />}
						{currentStep === "email" && <EmailStep />}
						{currentStep === "notifications" && <NotificationsStep />}
						{currentStep === "services" && <ServicesStep />}
						{currentStep === "team" && <TeamStep />}
						{currentStep === "payments" && <PaymentsStep />}
						{currentStep === "billing" && <PaymentCollectionStep />}
						{currentStep === "schedule" && <ScheduleStep />}
						{currentStep === "reports" && <ReportsStep />}
						{currentStep === "settings" && <SettingsStep />}
						{currentStep === "first-action" && <FirstActionStep />}
						{currentStep === "complete" && <CompleteStep />}
					</div>
				</main>

				{/* Minimal Footer Navigation */}
				<footer className="sticky bottom-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40">
					<div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
						<div className="flex items-center justify-between h-16 gap-4">
							{/* Back */}
							{!isFirstStep ? (
								<Button variant="ghost" onClick={goBack} size="sm">
									<ChevronLeft className="h-4 w-4 mr-1" />
									Back
								</Button>
							) : (
								<div />
							)}

							{/* Forward Actions */}
							<div className="flex items-center gap-2">
								{completeError && (
									<p className="text-sm text-destructive mr-2">
										{completeError}
									</p>
								)}

								{isLastStep ? (
									<Button onClick={handleComplete} disabled={isCompleting}>
										{isCompleting ? (
											<>
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
												Saving...
											</>
										) : (
											<>
												Go to Dashboard
												<Rocket className="h-4 w-4 ml-2" />
											</>
										)}
									</Button>
								) : (
									<>
										{!STEP_CONFIG[currentStep].required && (
											<Button
												variant="ghost"
												onClick={handleSkipRequest}
												size="sm"
												className="text-muted-foreground"
											>
												Skip
											</Button>
										)}
										<Button onClick={goNext} disabled={!canProceed}>
											Continue
											<ChevronRight className="h-4 w-4 ml-1" />
										</Button>
									</>
								)}
							</div>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
}

// =============================================================================
// EXPORTED COMPONENT (with error boundary)
// =============================================================================

export function OnboardingWizard() {
	const { resetOnboarding } = useOnboardingStore();

	return (
		<OnboardingErrorBoundary onReset={() => {}}>
			<OnboardingWizardInner />
		</OnboardingErrorBoundary>
	);
}
