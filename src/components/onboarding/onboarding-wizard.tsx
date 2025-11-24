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
 */

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { completeOnboardingWizard } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import {
	useOnboardingStore,
	STEP_CONFIG,
	type OnboardingStep,
} from "@/lib/onboarding/onboarding-store";
import {
	WalkthroughSlideshow,
	type WalkthroughSlide,
} from "@/components/onboarding/info-cards/walkthrough-slide";

// Step Components
import { WelcomeStep } from "@/components/onboarding/steps/welcome-step";
import { CompanyStep } from "@/components/onboarding/steps/company-step";
import { PhoneStep } from "@/components/onboarding/steps/phone-step";
import { EmailStep } from "@/components/onboarding/steps/email-step";
import { NotificationsStep } from "@/components/onboarding/steps/notifications-step";
import { ServicesStep } from "@/components/onboarding/steps/services-step";
import { TeamStep } from "@/components/onboarding/steps/team-step";
import { PaymentsStep } from "@/components/onboarding/steps/payments-step";
import { ScheduleStep } from "@/components/onboarding/steps/schedule-step";
import { ReportsStep } from "@/components/onboarding/steps/reports-step";
import { SettingsStep } from "@/components/onboarding/steps/settings-step";
import { FirstActionStep } from "@/components/onboarding/steps/first-action-step";
import { CompleteStep } from "@/components/onboarding/steps/complete-step";

import {
	ChevronLeft,
	ChevronRight,
	Rocket,
	Check,
	Phone,
	Wrench,
	Calendar,
	Loader2,
} from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const STEP_ORDER: OnboardingStep[] = [
	"welcome",
	"company",
	"phone",
	"email",
	"notifications",
	"services",
	"team",
	"payments",
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
			description: "Great job setting up your company! Now let's configure how you'll communicate with customers.",
			icon: <Phone className="h-8 w-8" />,
			bullets: ["Phone & SMS setup", "Email configuration", "Notification preferences"],
		},
	],
	3: [
		{
			id: "phase-3",
			title: "Building Your Business",
			description: "Communication is ready! Let's set up the core of your business - services, team, and payments.",
			icon: <Wrench className="h-8 w-8" />,
			bullets: ["Service catalog & pricing", "Team invitations", "Payment processing"],
		},
	],
	4: [
		{
			id: "phase-4",
			title: "Optimizing Operations",
			description: "Your business core is configured! Now let's optimize how you work day-to-day.",
			icon: <Calendar className="h-8 w-8" />,
			bullets: ["Business hours", "Dashboard widgets", "Key settings"],
		},
	],
	5: [
		{
			id: "phase-5",
			title: "Ready for Launch!",
			description: "Almost there! Let's do one quick action to make sure everything works perfectly.",
			icon: <Rocket className="h-8 w-8" />,
			bullets: ["Take your first action", "See your dashboard"],
		},
	],
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function OnboardingWizard() {
	const router = useRouter();
	const {
		data,
		currentStep,
		setCurrentStep,
		completedSteps,
		skippedSteps,
		completeStep,
		updateData,
	} = useOnboardingStore();

	// Walkthrough state
	const [showWalkthrough, setShowWalkthrough] = useState(false);
	const [walkthroughSlides, setWalkthroughSlides] = useState<WalkthroughSlide[]>([]);
	const [pendingNavigation, setPendingNavigation] = useState<OnboardingStep | null>(null);
	const [isCompleting, setIsCompleting] = useState(false);
	const [completeError, setCompleteError] = useState<string | null>(null);

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
		0
	);

	// Check if we should show a phase walkthrough
	const checkPhaseTransition = useCallback((nextStep: OnboardingStep) => {
		const nextConfig = STEP_CONFIG[nextStep];
		const nextPhase = nextConfig.phase;

		if (nextPhase > currentPhase && PHASE_WALKTHROUGHS[nextPhase]) {
			setWalkthroughSlides(PHASE_WALKTHROUGHS[nextPhase]);
			setPendingNavigation(nextStep);
			setShowWalkthrough(true);
			return true;
		}
		return false;
	}, [currentPhase]);

	// Navigation validation
	// TODO: Remove isDev bypass before production
	const isDev = process.env.NODE_ENV === "development";
	const canProceed = useMemo(() => {
		// Bypass validation in development for testing
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
	}, [currentStepIndex, currentStep, completeStep, setCurrentStep, checkPhaseTransition]);

	const goBack = useCallback(() => {
		const prevIndex = currentStepIndex - 1;
		if (prevIndex >= 0) {
			setCurrentStep(STEP_ORDER[prevIndex]);
		}
	}, [currentStepIndex, setCurrentStep]);

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
				error instanceof Error ? error.message : "An unexpected error occurred"
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

			<div className="min-h-screen bg-background flex flex-col">
				{/* Minimal Header - No borders */}
				<header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-14 sm:h-16">
							{/* Left: Phase info */}
							<div className="flex items-center gap-2 sm:gap-4 min-w-0">
								<span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
									{isLastStep ? "Complete" : PHASE_LABELS[currentPhase]}
								</span>
								<span className="hidden sm:inline text-muted-foreground/40">·</span>
								<span className="hidden sm:inline text-sm text-muted-foreground truncate">
									{currentConfig.title}
								</span>
							</div>

							{/* Right: Progress */}
							<div className="flex items-center gap-2 sm:gap-4">
								{!isLastStep && (
									<span className="hidden sm:inline text-sm text-muted-foreground">
										~{remainingMinutes} min left
									</span>
								)}
								<span className="text-xs sm:text-sm font-medium tabular-nums">
									{currentStepIndex + 1}/{STEP_ORDER.length}
								</span>
							</div>
						</div>

						{/* Progress Bar - Thin line */}
						<div className="h-0.5 bg-muted/50">
							<div
								className="h-full bg-primary transition-all duration-300 ease-out"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				</header>

				{/* Step Progress Dots - Mobile friendly */}
				<div className="bg-muted/20">
					<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
						<div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
							{STEP_ORDER.map((step, index) => {
								const isActive = step === currentStep;
								const isCompleted = completedSteps.includes(step);
								const isPast = index < currentStepIndex;

								return (
									<button
										key={step}
										type="button"
										onClick={() => {
											if (isCompleted || isPast) {
												setCurrentStep(step);
											}
										}}
										disabled={!isCompleted && !isPast}
										className={cn(
											"relative flex items-center justify-center transition-all duration-200",
											isActive ? "w-6 h-6 sm:w-8 sm:h-8" : "w-2 h-2 sm:w-3 sm:h-3",
											isActive && "rounded-full bg-primary text-primary-foreground",
											isCompleted && !isActive && "rounded-full bg-primary/20 hover:bg-primary/30 cursor-pointer",
											!isActive && !isCompleted && !isPast && "rounded-full bg-muted",
											isPast && !isCompleted && "rounded-full bg-muted-foreground/30"
										)}
										title={STEP_CONFIG[step].title}
									>
										{isActive && (
											<span className="text-[10px] sm:text-xs font-medium">{index + 1}</span>
										)}
										{isCompleted && !isActive && (
											<Check className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-primary" />
										)}
									</button>
								);
							})}
						</div>
					</div>
				</div>

				{/* Main Content - Fully responsive */}
				<main className="flex-1">
					<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
						<div className="w-full max-w-3xl mx-auto">
							{currentStep === "welcome" && <WelcomeStep />}
							{currentStep === "company" && <CompanyStep />}
							{currentStep === "phone" && <PhoneStep />}
							{currentStep === "email" && <EmailStep />}
							{currentStep === "notifications" && <NotificationsStep />}
							{currentStep === "services" && <ServicesStep />}
							{currentStep === "team" && <TeamStep />}
							{currentStep === "payments" && <PaymentsStep />}
							{currentStep === "schedule" && <ScheduleStep />}
							{currentStep === "reports" && <ReportsStep />}
							{currentStep === "settings" && <SettingsStep />}
							{currentStep === "first-action" && <FirstActionStep />}
							{currentStep === "complete" && <CompleteStep />}
						</div>
					</div>
				</main>

				{/* Footer Navigation - No borders, responsive */}
				<footer className="sticky bottom-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16 sm:h-20 gap-2">
							{/* Back Button */}
							<div className="w-20 sm:w-32">
								{!isFirstStep && (
									<Button
										variant="ghost"
										onClick={goBack}
										size="sm"
										className="gap-1 sm:gap-2"
									>
										<ChevronLeft className="h-4 w-4" />
										<span className="hidden sm:inline">Back</span>
									</Button>
								)}
							</div>

							{/* Center: Optional skip hint */}
							<div className="flex-1 text-center">
								{!STEP_CONFIG[currentStep].required && !isLastStep && (
									<span className="text-xs sm:text-sm text-muted-foreground">
										Optional
									</span>
								)}
							</div>

							{/* Forward Actions */}
							<div className="flex justify-end gap-2 sm:gap-3">
								{completeError && (
									<p className="hidden sm:block text-sm text-destructive mr-2">{completeError}</p>
								)}

								{isLastStep ? (
									<Button
										onClick={handleComplete}
										disabled={isCompleting}
										size="sm"
										className="gap-1 sm:gap-2"
									>
										{isCompleting ? (
											<>
												<Loader2 className="h-4 w-4 animate-spin" />
												<span className="hidden sm:inline">Saving...</span>
											</>
										) : (
											<>
												<span className="sm:hidden">Done</span>
												<span className="hidden sm:inline">Go to Dashboard</span>
												<Rocket className="h-4 w-4" />
											</>
										)}
									</Button>
								) : (
									<>
										{!STEP_CONFIG[currentStep].required && (
											<Button
												variant="ghost"
												onClick={goNext}
												size="sm"
												className="hidden sm:inline-flex"
											>
												Skip
											</Button>
										)}
										<Button
											onClick={goNext}
											disabled={!canProceed}
											size="sm"
											className="gap-1 sm:gap-2"
										>
											<span className="sm:hidden">Next</span>
											<span className="hidden sm:inline">Continue</span>
											<ChevronRight className="h-4 w-4" />
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
