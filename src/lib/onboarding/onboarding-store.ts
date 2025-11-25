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
	| "data-import"
	| "integrations"
	| "phone"
	| "email"
	| "notifications"
	| "services"
	| "team"
	| "payments"
	| "billing"
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
	referralSource: string; // How did you hear about us?

	// Company profile & business verification
	// Basic info
	companyName: string;
	companyPhone: string;
	companyEmail: string;
	companyWebsite: string;
	companyLogo: string | null;
	timezone: string;

	// Business address
	companyAddress: string;
	companyCity: string;
	companyState: string;
	companyZip: string;
	companyCountry: string;

	// Mailing address (if different)
	mailingAddressSame: boolean;
	mailingAddress: string;
	mailingCity: string;
	mailingState: string;
	mailingZip: string;
	mailingCountry: string;

	// Business verification (for bank accounts, Plaid, payment processing)
	businessType: "sole_proprietor" | "llc" | "corporation" | "partnership" | "non_profit" | null;
	ein: string; // Employer Identification Number (Tax ID)
	stateOfIncorporation: string;
	dateEstablished: string;
	businessLicense: string;

	// Beneficial owner info (required for financial services compliance)
	ownerName: string;
	ownerTitle: string;
	ownerEmail: string;
	ownerPhone: string;
	ownerSSN: string; // Last 4 digits only
	ownerDOB: string;
	ownerAddress: string;
	ownerOwnershipPercent: number;

	// Additional business info (optional, for recommendations)
	yearsInBusiness: string;
	numberOfEmployees: string;
	annualRevenueRange: string;

	// Phone & SMS
	phoneSetupType: "new" | "port" | "skip" | null;
	phoneNumber: string;
	smsEnabled: boolean;

	// Number Porting (Telnyx)
	portingStatus: string;
	portingCarrier: string;
	portingAccountNumber: string;
	portingPin: string;
	portingBillingPhone: string;

	// Email
	emailSetupType: "platform" | "custom-domain" | "gmail" | "outlook" | "skip" | null;
	customDomain: string;
	dnsVerified: boolean;
	resendDomainId: string | null; // Resend domain ID for verification tracking

	// Notifications
	notifications: NotificationPreference[];
	quietHoursEnabled: boolean;
	quietHoursStart: string;
	quietHoursEnd: string;

	// Data Import (from competitor software)
	previousSoftware: string | null; // housecall-pro, jobber, servicetitan, etc.
	dataImportCompleted: Record<string, { recordCount: number; importedAt: string }> | null;
	importedCustomerCount: number;
	importedPriceBookCount: number;
	importedEquipmentCount: number;
	importedJobCount: number;

	// Integrations
	quickbooksConnected: boolean;
	quickbooksCompanyId: string | null;
	quickbooksLastSync: string | null;
	googleCalendarConnected: boolean;
	googleCalendarId: string | null;

	// Services
	services: ServiceItem[];
	servicesImportedFrom: string | null;

	// Team
	teamMembers: TeamMemberInvite[];
	teamInvites: { email: string; name: string; role: string }[];
	inviteMethod: "email" | "link" | "qr" | null;

	// Payments
	// Note: Stripe is NOT used for contractor payments - only for Thorbis platform billing
	// Contractors use: check capture, Plaid (ACH), card processing, cash tracking
	paymentSetupComplete: boolean;
	plaidConnected: boolean;
	acceptCards: boolean;
	acceptACH: boolean;
	acceptChecks: boolean;
	acceptCash: boolean;
	acceptCheckCapture: boolean;
	paymentMethods: string[];
	taxRate: string;
	paymentTerms: string;

	// Platform Billing (Stripe for Thorbis subscription)
	// Tracks selections that affect billing: phone numbers, Gmail, add-ons
	phonePortingCount: number; // Number of phone numbers being ported ($15 one-time each)
	newPhoneNumberCount: number; // Number of new phone numbers ($5 setup + $2/month each)
	gmailWorkspaceUsers: number; // Number of users needing Gmail Workspace ($6/user/month)
	profitRhinoEnabled: boolean; // Profit Rhino financing add-on ($149/month)

	// Stripe payment collection
	stripeCustomerId: string | null; // Stripe Customer ID after payment method collected
	stripePaymentMethodId: string | null; // Stripe Payment Method ID (card/bank)
	paymentMethodCollected: boolean; // Whether payment method has been saved
	trialEndsAt: string | null; // ISO date string when 14-day trial ends

	// Schedule
	workingDays: string[];
	startTime: string;
	endTime: string;
	serviceRadius: string;
	serviceAreaZips: string[];
	businessHours: Record<string, { enabled: boolean; start: string; end: string }> | null;
	bufferTime: string;
	emergencyService: boolean;

	// Reports
	preferredReports: string[];
	reportFrequency: "daily" | "weekly" | "monthly";
	dashboardWidgets: string[];
	scheduledReports: string[];

	// Settings
	autoReminders: boolean;
	requireJobPhotos: boolean;
	customerPortalEnabled: boolean;
	onlineBookingEnabled: boolean;
	gpsTrackingEnabled: boolean;

	// First Action
	firstActionType: "invoice" | "job" | "customer" | null;
	firstActionCompleted: boolean | string;

	// Completion
	onboardingCompleted: boolean;
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

export const STEP_CONFIG: Record<OnboardingStep, {
	title: string;
	shortTitle: string;
	phase: number;
	required: boolean;
	estimatedMinutes: number;
}> = {
	welcome: { title: "Welcome", shortTitle: "Start", phase: 1, required: true, estimatedMinutes: 1 },
	company: { title: "Company Details", shortTitle: "Company", phase: 1, required: true, estimatedMinutes: 2 },
	"data-import": { title: "Import Data", shortTitle: "Import", phase: 1, required: false, estimatedMinutes: 5 },
	integrations: { title: "Connect Apps", shortTitle: "Apps", phase: 1, required: false, estimatedMinutes: 2 },
	phone: { title: "Phone & SMS", shortTitle: "Phone", phase: 2, required: false, estimatedMinutes: 3 },
	email: { title: "Email Setup", shortTitle: "Email", phase: 2, required: false, estimatedMinutes: 2 },
	notifications: { title: "Notifications", shortTitle: "Alerts", phase: 2, required: false, estimatedMinutes: 2 },
	services: { title: "Services & Pricing", shortTitle: "Services", phase: 3, required: false, estimatedMinutes: 3 },
	team: { title: "Team Setup", shortTitle: "Team", phase: 3, required: false, estimatedMinutes: 2 },
	payments: { title: "Payment Processing", shortTitle: "Payments", phase: 3, required: false, estimatedMinutes: 3 },
	billing: { title: "Platform Subscription", shortTitle: "Billing", phase: 3, required: false, estimatedMinutes: 3 },
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
	referralSource: "",

	// Basic info
	companyName: "",
	companyPhone: "",
	companyEmail: "",
	companyWebsite: "",
	companyLogo: null,
	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York",

	// Business address
	companyAddress: "",
	companyCity: "",
	companyState: "",
	companyZip: "",
	companyCountry: "US",

	// Mailing address
	mailingAddressSame: true,
	mailingAddress: "",
	mailingCity: "",
	mailingState: "",
	mailingZip: "",
	mailingCountry: "US",

	// Business verification
	businessType: null,
	ein: "",
	stateOfIncorporation: "",
	dateEstablished: "",
	businessLicense: "",

	// Beneficial owner info
	ownerName: "",
	ownerTitle: "Owner",
	ownerEmail: "",
	ownerPhone: "",
	ownerSSN: "",
	ownerDOB: "",
	ownerAddress: "",
	ownerOwnershipPercent: 100,

	// Additional business info
	yearsInBusiness: "",
	numberOfEmployees: "",
	annualRevenueRange: "",

	phoneSetupType: null,
	phoneNumber: "",
	smsEnabled: true,

	// Number Porting
	portingStatus: "",
	portingCarrier: "",
	portingAccountNumber: "",
	portingPin: "",
	portingBillingPhone: "",

	emailSetupType: null,
	customDomain: "",
	dnsVerified: false,
	resendDomainId: null,

	notifications: DEFAULT_NOTIFICATIONS,
	quietHoursEnabled: false,
	quietHoursStart: "22:00",
	quietHoursEnd: "07:00",

	// Data Import
	previousSoftware: null,
	dataImportCompleted: null,
	importedCustomerCount: 0,
	importedPriceBookCount: 0,
	importedEquipmentCount: 0,
	importedJobCount: 0,

	// Integrations
	quickbooksConnected: false,
	quickbooksCompanyId: null,
	quickbooksLastSync: null,
	googleCalendarConnected: false,
	googleCalendarId: null,

	services: [],
	servicesImportedFrom: null,

	teamMembers: [],
	teamInvites: [],
	inviteMethod: null,

	paymentSetupComplete: false,
	plaidConnected: false,
	acceptCards: true,
	acceptACH: true,
	acceptChecks: true,
	acceptCash: true,
	acceptCheckCapture: true,
	paymentMethods: [],
	taxRate: "",
	paymentTerms: "30",

	// Platform Billing - Stripe selections
	phonePortingCount: 0,
	newPhoneNumberCount: 0,
	gmailWorkspaceUsers: 0,
	profitRhinoEnabled: false,
	stripeCustomerId: null,
	stripePaymentMethodId: null,
	paymentMethodCollected: false,
	trialEndsAt: null,

	workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
	startTime: "08:00",
	endTime: "17:00",
	serviceRadius: "25",
	serviceAreaZips: [],
	businessHours: null,
	bufferTime: "15",
	emergencyService: false,

	preferredReports: ["revenue", "jobs", "customers"],
	reportFrequency: "weekly",
	dashboardWidgets: ["revenue", "jobs_today", "pending_invoices"],
	scheduledReports: [],

	autoReminders: true,
	requireJobPhotos: true,
	customerPortalEnabled: true,
	onlineBookingEnabled: false,
	gpsTrackingEnabled: false,

	firstActionType: null,
	firstActionCompleted: false,

	onboardingCompleted: false,
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
