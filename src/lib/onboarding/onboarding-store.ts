/**
 * Onboarding State Management
 *
 * Zustand store for managing the entire onboarding flow.
 * Persists progress so users can resume where they left off.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

// =============================================================================
// TYPES
// =============================================================================

export type OnboardingPath = "solo" | "small" | "growing" | "enterprise";

export type OnboardingStep =
	| "welcome"
	| "company"
	| "profile"
	| "phone"
	| "email"
	| "notifications"
	| "services"
	| "team"
	| "payments"
	| "schedule"
	| "reports"
	| "settings"
	| "first-action"
	| "complete";

export interface TeamMemberInvite {
	id: string;
	name: string;
	email: string;
	role: "admin" | "manager" | "technician" | "office";
}

export interface ServiceItem {
	id: string;
	name: string;
	price: string;
	duration: string;
	category: string;
}

export interface NotificationPreference {
	category: string;
	push: boolean;
	email: boolean;
	sms: boolean;
}

export interface OnboardingData {
	// Path selection
	path: OnboardingPath | null;
	teamSize: string;
	industry: string;

	// Company profile
	companyName: string;
	companyPhone: string;
	companyEmail: string;
	companyAddress: string;
	companyCity: string;
	companyState: string;
	companyZip: string;
	companyLogo: string | null;
	timezone: string;

	// User profile
	userName: string;
	userEmail: string;
	userPhone: string;
	userPhoto: string | null;
	userRole: string;

	// Phone & SMS
	phoneSetupType: "new" | "port" | "skip" | null;
	phoneNumber: string;
	smsEnabled: boolean;
	portingStatus: string;

	// Email
	emailSetupType: "existing" | "custom-domain" | "gmail" | "outlook" | "skip" | null;
	customDomain: string;
	dnsVerified: boolean;

	// Notifications
	notifications: NotificationPreference[];
	quietHoursEnabled: boolean;
	quietHoursStart: string;
	quietHoursEnd: string;

	// Services
	services: ServiceItem[];
	servicesImportedFrom: string | null;

	// Team
	teamMembers: TeamMemberInvite[];
	inviteMethod: "email" | "link" | "qr" | null;

	// Payments
	paymentSetupComplete: boolean;
	stripeConnected: boolean;
	acceptCards: boolean;
	acceptACH: boolean;
	acceptChecks: boolean;
	acceptCash: boolean;

	// Schedule
	workingDays: string[];
	startTime: string;
	endTime: string;
	serviceRadius: string;
	serviceAreaZips: string[];

	// Reports
	preferredReports: string[];
	reportFrequency: "daily" | "weekly" | "monthly";
	dashboardWidgets: string[];

	// Settings
	autoReminders: boolean;
	requireJobPhotos: boolean;
	customerPortalEnabled: boolean;
	onlineBookingEnabled: boolean;
	gpsTrackingEnabled: boolean;

	// First Action
	firstActionType: "invoice" | "job" | "customer" | null;
	firstActionCompleted: boolean;
}

export interface OnboardingState {
	// Current progress
	currentStep: OnboardingStep;
	completedSteps: OnboardingStep[];
	skippedSteps: OnboardingStep[];

	// All data
	data: OnboardingData;

	// UI state
	isLoading: boolean;
	isSaving: boolean;
	showWalkthrough: boolean;
	walkthroughSeen: Record<string, boolean>;

	// Actions
	setCurrentStep: (step: OnboardingStep) => void;
	completeStep: (step: OnboardingStep) => void;
	skipStep: (step: OnboardingStep) => void;
	updateData: (updates: Partial<OnboardingData>) => void;
	setLoading: (loading: boolean) => void;
	setSaving: (saving: boolean) => void;
	markWalkthroughSeen: (id: string) => void;
	setShowWalkthrough: (show: boolean) => void;
	resetOnboarding: () => void;
	getProgress: () => number;
	canProceed: () => boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const STEPS_ORDER: OnboardingStep[] = [
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

export const STEP_CONFIG: Record<OnboardingStep, {
	title: string;
	shortTitle: string;
	phase: number;
	required: boolean;
	estimatedMinutes: number;
}> = {
	welcome: { title: "Welcome", shortTitle: "Start", phase: 1, required: true, estimatedMinutes: 1 },
	company: { title: "Company Details", shortTitle: "Company", phase: 1, required: true, estimatedMinutes: 2 },
	profile: { title: "Your Profile", shortTitle: "Profile", phase: 1, required: true, estimatedMinutes: 1 },
	phone: { title: "Phone & SMS", shortTitle: "Phone", phase: 2, required: false, estimatedMinutes: 3 },
	email: { title: "Email Setup", shortTitle: "Email", phase: 2, required: false, estimatedMinutes: 2 },
	notifications: { title: "Notifications", shortTitle: "Alerts", phase: 2, required: false, estimatedMinutes: 2 },
	services: { title: "Services & Pricing", shortTitle: "Services", phase: 3, required: false, estimatedMinutes: 3 },
	team: { title: "Team Setup", shortTitle: "Team", phase: 3, required: false, estimatedMinutes: 2 },
	payments: { title: "Payment Processing", shortTitle: "Payments", phase: 3, required: false, estimatedMinutes: 3 },
	schedule: { title: "Schedule", shortTitle: "Schedule", phase: 4, required: false, estimatedMinutes: 2 },
	reports: { title: "Reports & Dashboard", shortTitle: "Reports", phase: 4, required: false, estimatedMinutes: 2 },
	settings: { title: "Important Settings", shortTitle: "Settings", phase: 4, required: false, estimatedMinutes: 2 },
	"first-action": { title: "Your First Action", shortTitle: "Try It", phase: 5, required: false, estimatedMinutes: 2 },
	complete: { title: "All Set!", shortTitle: "Done", phase: 5, required: true, estimatedMinutes: 1 },
};

export const INDUSTRIES = [
	{ value: "hvac", label: "HVAC" },
	{ value: "plumbing", label: "Plumbing" },
	{ value: "electrical", label: "Electrical" },
	{ value: "roofing", label: "Roofing" },
	{ value: "landscaping", label: "Landscaping" },
	{ value: "cleaning", label: "Cleaning Services" },
	{ value: "pest-control", label: "Pest Control" },
	{ value: "appliance", label: "Appliance Repair" },
	{ value: "garage-door", label: "Garage Door" },
	{ value: "locksmith", label: "Locksmith" },
	{ value: "general-contractor", label: "General Contractor" },
	{ value: "other", label: "Other" },
];

export const COMPANY_SIZES = [
	{ value: "solo", label: "Solo Operator" },
	{ value: "small", label: "Small Team" },
	{ value: "growing", label: "Growing Business" },
	{ value: "enterprise", label: "Enterprise" },
];

export const DEFAULT_NOTIFICATIONS: NotificationPreference[] = [
	{ category: "new_booking", push: true, email: true, sms: false },
	{ category: "job_updates", push: true, email: false, sms: false },
	{ category: "payment_received", push: true, email: true, sms: false },
	{ category: "customer_messages", push: true, email: true, sms: true },
	{ category: "daily_summary", push: false, email: true, sms: false },
	{ category: "weekly_report", push: false, email: true, sms: false },
];

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialData: OnboardingData = {
	path: null,
	teamSize: "",
	industry: "",

	companyName: "",
	companyPhone: "",
	companyEmail: "",
	companyAddress: "",
	companyCity: "",
	companyState: "",
	companyZip: "",
	companyLogo: null,
	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York",

	userName: "",
	userEmail: "",
	userPhone: "",
	userPhoto: null,
	userRole: "owner",

	phoneSetupType: null,
	phoneNumber: "",
	smsEnabled: true,
	portingStatus: "",

	emailSetupType: null,
	customDomain: "",
	dnsVerified: false,

	notifications: DEFAULT_NOTIFICATIONS,
	quietHoursEnabled: false,
	quietHoursStart: "22:00",
	quietHoursEnd: "07:00",

	services: [],
	servicesImportedFrom: null,

	teamMembers: [],
	inviteMethod: null,

	paymentSetupComplete: false,
	stripeConnected: false,
	acceptCards: true,
	acceptACH: true,
	acceptChecks: true,
	acceptCash: true,

	workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
	startTime: "08:00",
	endTime: "17:00",
	serviceRadius: "25",
	serviceAreaZips: [],

	preferredReports: ["revenue", "jobs", "customers"],
	reportFrequency: "weekly",
	dashboardWidgets: ["revenue", "jobs_today", "pending_invoices"],

	autoReminders: true,
	requireJobPhotos: true,
	customerPortalEnabled: true,
	onlineBookingEnabled: false,
	gpsTrackingEnabled: false,

	firstActionType: null,
	firstActionCompleted: false,
};

// =============================================================================
// STORE
// =============================================================================

export const useOnboardingStore = create<OnboardingState>()(
	persist(
		(set, get) => ({
			currentStep: "welcome",
			completedSteps: [],
			skippedSteps: [],
			data: initialData,
			isLoading: false,
			isSaving: false,
			showWalkthrough: true,
			walkthroughSeen: {},

			setCurrentStep: (step) => set({ currentStep: step }),

			completeStep: (step) =>
				set((state) => ({
					completedSteps: state.completedSteps.includes(step)
						? state.completedSteps
						: [...state.completedSteps, step],
					skippedSteps: state.skippedSteps.filter((s) => s !== step),
				})),

			skipStep: (step) =>
				set((state) => ({
					skippedSteps: state.skippedSteps.includes(step)
						? state.skippedSteps
						: [...state.skippedSteps, step],
				})),

			updateData: (updates) =>
				set((state) => ({
					data: { ...state.data, ...updates },
				})),

			setLoading: (loading) => set({ isLoading: loading }),

			setSaving: (saving) => set({ isSaving: saving }),

			markWalkthroughSeen: (id) =>
				set((state) => ({
					walkthroughSeen: { ...state.walkthroughSeen, [id]: true },
				})),

			setShowWalkthrough: (show) => set({ showWalkthrough: show }),

			resetOnboarding: () =>
				set({
					currentStep: "welcome",
					completedSteps: [],
					skippedSteps: [],
					data: initialData,
					walkthroughSeen: {},
				}),

			getProgress: () => {
				const { completedSteps, skippedSteps } = get();
				const totalSteps = STEPS_ORDER.length - 1; // Exclude 'complete'
				const finishedSteps = completedSteps.length + skippedSteps.length;
				return Math.round((finishedSteps / totalSteps) * 100);
			},

			canProceed: () => {
				const { currentStep, data } = get();
				switch (currentStep) {
					case "welcome":
						return !!data.path;
					case "company":
						return data.companyName.trim().length > 0;
					case "profile":
						return data.userName.trim().length > 0;
					default:
						return true; // Most steps are optional
				}
			},
		}),
		{
			name: "thorbis-onboarding",
			partialize: (state) => ({
				currentStep: state.currentStep,
				completedSteps: state.completedSteps,
				skippedSteps: state.skippedSteps,
				data: state.data,
				walkthroughSeen: state.walkthroughSeen,
			}),
		}
	)
);

// =============================================================================
// HELPERS
// =============================================================================

export function getNextStep(currentStep: OnboardingStep): OnboardingStep | null {
	const currentIndex = STEPS_ORDER.indexOf(currentStep);
	if (currentIndex === -1 || currentIndex === STEPS_ORDER.length - 1) {
		return null;
	}
	return STEPS_ORDER[currentIndex + 1];
}

export function getPreviousStep(currentStep: OnboardingStep): OnboardingStep | null {
	const currentIndex = STEPS_ORDER.indexOf(currentStep);
	if (currentIndex <= 0) {
		return null;
	}
	return STEPS_ORDER[currentIndex - 1];
}

export function getStepIndex(step: OnboardingStep): number {
	return STEPS_ORDER.indexOf(step);
}

export function isStepComplete(step: OnboardingStep, completedSteps: OnboardingStep[]): boolean {
	return completedSteps.includes(step);
}

export function getEstimatedTimeRemaining(currentStep: OnboardingStep): number {
	const currentIndex = STEPS_ORDER.indexOf(currentStep);
	let totalMinutes = 0;
	for (let i = currentIndex; i < STEPS_ORDER.length; i++) {
		totalMinutes += STEP_CONFIG[STEPS_ORDER[i]].estimatedMinutes;
	}
	return totalMinutes;
}
