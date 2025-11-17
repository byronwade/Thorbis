/**
 * Job Creation Store - Zustand State Management
 *
 * Manages multi-step job creation workflow state including:
 * - Customer selection and inline creation
 * - Property selection and inline creation
 * - Job details and AI-suggested values
 * - Scheduling and technician assignment
 * - Form draft persistence to localStorage
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Types
export type JobCreationStep =
	| "customer"
	| "property"
	| "description"
	| "details"
	| "scheduling"
	| "review";

export type CustomerData = {
	id?: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	companyName?: string;
	type: "residential" | "commercial" | "industrial";
};

export type PropertyData = {
	id?: string;
	customerId?: string;
	name?: string;
	address: string;
	address2?: string;
	city: string;
	state: string;
	zipCode: string;
	accessNotes?: string;
	gateCode?: string;
};

export type JobData = {
	title: string;
	description: string;
	jobType?: "service" | "installation" | "repair" | "maintenance" | "inspection" | "consultation";
	priority: "low" | "medium" | "high" | "urgent";
	scheduledStart?: string;
	scheduledEnd?: string;
	assignedTo?: string;
	notes?: string;
};

export type AIsuggestions = {
	title?: string;
	description?: string;
	jobType?: string;
	priority?: string;
	equipment?: string[];
	categories?: string[];
	confidence?: number;
};

type JobCreationStore = {
	// Workflow state
	currentStep: JobCreationStep;
	completedSteps: JobCreationStep[];
	isCreatingInline: "customer" | "property" | null;

	// Data state
	customer: CustomerData | null;
	property: PropertyData | null;
	job: Partial<JobData>;
	aiSuggestions: AIsuggestions;
	templateId: string | null;

	// UI state
	isLoadingAI: boolean;
	isSaving: boolean;
	errors: Record<string, string>;
	recentCustomers: string[]; // customer IDs

	// Actions - Navigation
	setCurrentStep: (step: JobCreationStep) => void;
	markStepCompleted: (step: JobCreationStep) => void;
	goToNextStep: () => void;
	goToPreviousStep: () => void;

	// Actions - Data
	setCustomer: (customer: CustomerData | null) => void;
	setProperty: (property: PropertyData | null) => void;
	updateJob: (job: Partial<JobData>) => void;
	setAISuggestions: (suggestions: AIsuggestions) => void;
	setTemplateId: (templateId: string | null) => void;

	// Actions - Inline Creation
	startInlineCreation: (type: "customer" | "property") => void;
	cancelInlineCreation: () => void;

	// Actions - UI
	setLoadingAI: (loading: boolean) => void;
	setSaving: (saving: boolean) => void;
	setError: (field: string, error: string) => void;
	clearError: (field: string) => void;
	clearAllErrors: () => void;

	// Actions - History
	addRecentCustomer: (customerId: string) => void;

	// Actions - Reset
	reset: () => void;
	resetForNewJob: () => void; // Keep customer but clear job details
};

const STEP_ORDER: JobCreationStep[] = [
	"customer",
	"property",
	"description",
	"details",
	"scheduling",
	"review",
];

const initialState = {
	currentStep: "customer" as JobCreationStep,
	completedSteps: [] as JobCreationStep[],
	isCreatingInline: null as "customer" | "property" | null,
	customer: null as CustomerData | null,
	property: null as PropertyData | null,
	job: {
		priority: "medium" as const,
	} as Partial<JobData>,
	aiSuggestions: {} as AIsuggestions,
	templateId: null as string | null,
	isLoadingAI: false,
	isSaving: false,
	errors: {} as Record<string, string>,
	recentCustomers: [] as string[],
};

export const useJobCreationStore = create<JobCreationStore>()(
	devtools(
		persist(
			(set, get) => ({
				...initialState,

				// Navigation Actions
				setCurrentStep: (step) => set({ currentStep: step }),

				markStepCompleted: (step) =>
					set((state) => ({
						completedSteps: state.completedSteps.includes(step)
							? state.completedSteps
							: [...state.completedSteps, step],
					})),

				goToNextStep: () => {
					const { currentStep, completedSteps } = get();
					const currentIndex = STEP_ORDER.indexOf(currentStep);

					if (currentIndex < STEP_ORDER.length - 1) {
						const nextStep = STEP_ORDER[currentIndex + 1];

						set({
							currentStep: nextStep,
							completedSteps: completedSteps.includes(currentStep)
								? completedSteps
								: [...completedSteps, currentStep],
						});
					}
				},

				goToPreviousStep: () => {
					const { currentStep } = get();
					const currentIndex = STEP_ORDER.indexOf(currentStep);

					if (currentIndex > 0) {
						set({ currentStep: STEP_ORDER[currentIndex - 1] });
					}
				},

				// Data Actions
				setCustomer: (customer) =>
					set({
						customer,
						property: null, // Reset property when customer changes
						errors: {},
					}),

				setProperty: (property) =>
					set({
						property,
						errors: {},
					}),

				updateJob: (jobUpdate) =>
					set((state) => ({
						job: { ...state.job, ...jobUpdate },
					})),

				setAISuggestions: (suggestions) =>
					set({
						aiSuggestions: suggestions,
					}),

				setTemplateId: (templateId) => set({ templateId }),

				// Inline Creation Actions
				startInlineCreation: (type) =>
					set({
						isCreatingInline: type,
					}),

				cancelInlineCreation: () =>
					set({
						isCreatingInline: null,
					}),

				// UI Actions
				setLoadingAI: (loading) => set({ isLoadingAI: loading }),

				setSaving: (saving) => set({ isSaving: saving }),

				setError: (field, error) =>
					set((state) => ({
						errors: { ...state.errors, [field]: error },
					})),

				clearError: (field) =>
					set((state) => {
						const { [field]: _, ...rest } = state.errors;
						return { errors: rest };
					}),

				clearAllErrors: () => set({ errors: {} }),

				// History Actions
				addRecentCustomer: (customerId) =>
					set((state) => ({
						recentCustomers: [
							customerId,
							...state.recentCustomers.filter((id) => id !== customerId),
						].slice(0, 10), // Keep last 10
					})),

				// Reset Actions
				reset: () => set(initialState),

				resetForNewJob: () =>
					set((state) => ({
						...initialState,
						customer: state.customer, // Keep customer
						property: state.property, // Keep property
						recentCustomers: state.recentCustomers, // Keep history
					})),
			}),
			{
				name: "job-creation-storage",
				partialize: (state) => ({
					// Only persist these fields
					recentCustomers: state.recentCustomers,
					// Draft state for recovery
					customer: state.customer,
					property: state.property,
					job: state.job,
					currentStep: state.currentStep,
				}),
				// PERFORMANCE: Skip hydration to prevent SSR mismatches
				// Allows Next.js to generate static pages without Zustand errors
				skipHydration: true,
			}
		),
		{ name: "JobCreationStore" }
	)
);

// Selectors for better performance
export const useCurrentStep = () => useJobCreationStore((state) => state.currentStep);
export const useCustomer = () => useJobCreationStore((state) => state.customer);
export const useProperty = () => useJobCreationStore((state) => state.property);
export const useJobData = () => useJobCreationStore((state) => state.job);
export const useAISuggestions = () => useJobCreationStore((state) => state.aiSuggestions);
export const useIsLoadingAI = () => useJobCreationStore((state) => state.isLoadingAI);
export const useErrors = () => useJobCreationStore((state) => state.errors);
