"use client";

/**
 * Onboarding Wizard - Comprehensive 14-Step Setup
 *
 * World-class onboarding experience across 5 phases:
 * - Phase 1: Getting Started (Welcome, Company, Profile)
 * - Phase 2: Communication (Phone, Email, Notifications)
 * - Phase 3: Business Setup (Services, Team, Payments)
 * - Phase 4: Operations (Schedule, Reports, Settings)
 * - Phase 5: Launch (First Action, Complete)
 *
 * Uses wizard pattern with:
 * - Zustand for persistent state
 * - iPhone-style walkthroughs
 * - Progressive disclosure by business size
 * - Educational tooltips and info cards
 */

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { completeOnboardingWizard } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { ProfileStep } from "@/components/onboarding/steps/profile-step";
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
	Globe,
	Check,
	Sparkles,
	Building2,
	User,
	Phone,
	Mail,
	Bell,
	Wrench,
	Users,
	CreditCard,
	Calendar,
	BarChart3,
	Settings,
	Zap,
	PartyPopper,
} from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const STEP_ORDER: OnboardingStep[] = [
	"welcome",
	"company",
	"profile",
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

const STEP_ICONS: Record<OnboardingStep, React.ElementType> = {
	welcome: Sparkles,
	company: Building2,
	profile: User,
	phone: Phone,
	email: Mail,
	notifications: Bell,
	services: Wrench,
	team: Users,
	payments: CreditCard,
	schedule: Calendar,
	reports: BarChart3,
	settings: Settings,
	"first-action": Zap,
	complete: PartyPopper,
};

const PHASE_NAMES = [
	"Getting Started",
	"Communication",
	"Business Setup",
	"Operations",
	"Launch",
];

// Phase transition walkthroughs
const PHASE_WALKTHROUGHS: Record<number, WalkthroughSlide[]> = {
	2: [
		{
			title: "Time to Connect with Customers",
			description: "Great job setting up your profile! Now let's configure how you'll communicate with customers.",
			icon: Phone,
			highlight: "Next up: Phone, Email, and Notifications",
		},
	],
	3: [
		{
			title: "Building Your Business",
			description: "Communication is ready! Let's set up the core of your business - services, team, and payments.",
			icon: Wrench,
			highlight: "Next up: Services, Team, and Payments",
		},
	],
	4: [
		{
			title: "Optimizing Operations",
			description: "Your business core is configured! Now let's optimize how you work day-to-day.",
			icon: Calendar,
			highlight: "Next up: Schedule, Reports, and Settings",
		},
	],
	5: [
		{
			title: "Ready for Launch!",
			description: "Almost there! Let's do one quick action to make sure everything works perfectly.",
			icon: Rocket,
			highlight: "Final step: Take your first action",
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
		markStepCompleted,
		updateData,
	} = useOnboardingStore();

	// Walkthrough state
	const [showWalkthrough, setShowWalkthrough] = React.useState(false);
	const [walkthroughSlides, setWalkthroughSlides] = React.useState<WalkthroughSlide[]>([]);
	const [pendingNavigation, setPendingNavigation] = React.useState<OnboardingStep | null>(null);

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
	const canProceed = useMemo(() => {
		const config = STEP_CONFIG[currentStep];
		if (!config.required) return true;

		switch (currentStep) {
			case "welcome":
				return !!data.companySize && !!data.industry;
			case "company":
				return !!data.companyName;
			case "profile":
				return !!data.userName;
			default:
				return true;
		}
	}, [currentStep, data]);

	const goNext = useCallback(() => {
		const nextIndex = currentStepIndex + 1;
		if (nextIndex < STEP_ORDER.length) {
			markStepCompleted(currentStep);
			const nextStep = STEP_ORDER[nextIndex];

			// Check for phase transition walkthrough
			if (!checkPhaseTransition(nextStep)) {
				setCurrentStep(nextStep);
			}
		}
	}, [currentStepIndex, currentStep, markStepCompleted, setCurrentStep, checkPhaseTransition]);

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

	const [isCompleting, setIsCompleting] = useState(false);
	const [completeError, setCompleteError] = useState<string | null>(null);

	const handleComplete = useCallback(async () => {
		setIsCompleting(true);
		setCompleteError(null);

		try {
			// Call server action to mark onboarding as complete
			const result = await completeOnboardingWizard({
				path: data.path,
				industry: data.industry,
				companyName: data.companyName,
				userName: data.userName,
				phoneSetupType: data.phoneSetupType,
				emailSetupType: data.emailSetupType,
				services: data.services,
				teamInvites: data.teamInvites,
				paymentSetupComplete: data.paymentSetupComplete,
				completedSteps: completedSteps,
				skippedSteps: skippedSteps,
			});

			if (!result.success) {
				setCompleteError(result.error || "Failed to complete onboarding");
				setIsCompleting(false);
				return;
			}

			// Mark onboarding as completed in local state
			updateData({ onboardingCompleted: true });

			// Navigate to dashboard
			router.push("/dashboard");
		} catch (error) {
			setCompleteError(
				error instanceof Error ? error.message : "An unexpected error occurred"
			);
			setIsCompleting(false);
		}
	}, [data, completedSteps, skippedSteps, updateData, router]);

	// Get steps for current phase for mini progress
	const phaseSteps = STEP_ORDER.filter(
		(step) => STEP_CONFIG[step].phase === currentPhase
	);
	const phaseProgress = phaseSteps.indexOf(currentStep);

	return (
		<>
			{/* Phase Transition Walkthrough */}
			{showWalkthrough && (
				<WalkthroughSlideshow
					slides={walkthroughSlides}
					onComplete={handleWalkthroughComplete}
				/>
			)}

			<div className="flex h-full flex-col bg-background">
				{/* Header with Progress */}
				<div className="bg-background/80 backdrop-blur-xl sticky top-0 z-40 border-b">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
						<div className="flex items-center gap-4 mb-4">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
								<Globe className="h-5 w-5" />
							</div>
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<h1 className="text-lg font-semibold">
										{isLastStep ? "You're All Set!" : `Phase ${currentPhase}: ${PHASE_NAMES[currentPhase - 1]}`}
									</h1>
								</div>
								<p className="text-sm text-muted-foreground">
									{currentConfig.title}
									{!isLastStep && ` • ~${remainingMinutes} min remaining`}
								</p>
							</div>
						</div>

						{/* Main Progress Bar */}
						<div className="space-y-2">
							<Progress value={progress} className="h-2" />
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>Step {currentStepIndex + 1} of {STEP_ORDER.length}</span>
								<span>{Math.round(progress)}% complete</span>
							</div>
						</div>

						{/* Phase Steps Indicator */}
						<div className="flex items-center justify-center gap-1.5 mt-3 overflow-x-auto pb-1">
							{STEP_ORDER.map((step, index) => {
								const Icon = STEP_ICONS[step];
								const config = STEP_CONFIG[step];
								const isActive = step === currentStep;
								const isCompleted = completedSteps.includes(step);
								const isSamePhase = config.phase === currentPhase;

								return (
									<button
										key={step}
										type="button"
										onClick={() => {
											if (isCompleted || index < currentStepIndex) {
												setCurrentStep(step);
											}
										}}
										disabled={!isCompleted && index > currentStepIndex}
										title={config.title}
										className={cn(
											"flex items-center justify-center rounded-full transition-all",
											isSamePhase ? "h-8 w-8" : "h-6 w-6",
											isActive && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
											isCompleted && !isActive && "bg-green-500 text-white cursor-pointer hover:bg-green-600",
											!isActive && !isCompleted && "bg-muted text-muted-foreground",
											!isSamePhase && "hidden sm:flex"
										)}
									>
										{isCompleted && !isActive ? (
											<Check className={cn(isSamePhase ? "h-4 w-4" : "h-3 w-3")} />
										) : (
											<Icon className={cn(isSamePhase ? "h-4 w-4" : "h-3 w-3")} />
										)}
									</button>
								);
							})}
						</div>
					</div>
				</div>

				{/* Step Content */}
				<div className="flex-1 overflow-y-auto">
					<div className="p-4 sm:p-6 max-w-4xl mx-auto">
						{currentStep === "welcome" && <WelcomeStep />}
						{currentStep === "company" && <CompanyStep />}
						{currentStep === "profile" && <ProfileStep />}
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

				{/* Footer Navigation */}
				<div className="bg-background/80 backdrop-blur-xl sticky bottom-0 z-40 border-t">
					<div className="flex items-center justify-between max-w-4xl mx-auto px-4 sm:px-6 py-4">
						<Button
							variant="outline"
							onClick={goBack}
							disabled={isFirstStep}
							className={cn(isFirstStep && "invisible")}
						>
							<ChevronLeft className="mr-2 h-4 w-4" />
							Back
						</Button>

						<div className="flex flex-col items-end gap-2">
							{completeError && (
								<p className="text-sm text-destructive">{completeError}</p>
							)}
							<div className="flex gap-3">
							{isLastStep ? (
								<Button onClick={handleComplete} size="lg" disabled={isCompleting}>
									{isCompleting ? (
										<>
											<span className="mr-2 h-4 w-4 animate-spin">⏳</span>
											Completing...
										</>
									) : (
										<>
											<Rocket className="mr-2 h-4 w-4" />
											Go to Dashboard
										</>
									)}
								</Button>
							) : (
								<>
									{!STEP_CONFIG[currentStep].required && (
										<Button variant="ghost" onClick={goNext}>
											Skip
										</Button>
									)}
									<Button onClick={goNext} disabled={!canProceed}>
										{currentStepIndex === STEP_ORDER.length - 2 ? (
											<>
												Finish Setup
												<PartyPopper className="ml-2 h-4 w-4" />
											</>
										) : (
											<>
												Continue
												<ChevronRight className="ml-2 h-4 w-4" />
											</>
										)}
									</Button>
								</>
							)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

// Need React import for useState (already imported above)
import React from "react";
