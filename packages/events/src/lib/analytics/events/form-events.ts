import { analytics } from "../core";
import { logger } from "../utils/logger";
import { getElementData } from "../utils/dom";

interface FormInteraction {
	fieldName: string;
	fieldType: string;
	startTime: number;
	endTime?: number;
	interactions: number;
	isValid?: boolean;
	hasValue?: boolean;
}

interface FormSession {
	formId: string;
	startTime: number;
	endTime?: number;
	fields: Map<string, FormInteraction>;
	isSubmitted: boolean;
	totalInteractions: number;
}

const activeForms = new Map<string, FormSession>();

export function initFormTracking() {
	if (typeof window === "undefined") return;

	// Track form interactions
	document.addEventListener("focusin", handleFieldFocus);
	document.addEventListener("focusout", handleFieldBlur);
	document.addEventListener("input", handleFieldInput);
	document.addEventListener("submit", handleFormSubmit);
	document.addEventListener("reset", handleFormReset);

	// Track form abandonment
	window.addEventListener("beforeunload", handlePageLeave);

	logger.debug("Form tracking initialized");
}

function getFormIdentifier(form: HTMLFormElement): string {
	return form.id || form.name || `form_${form.action}_${form.method}`;
}

function handleFieldFocus(event: FocusEvent) {
	const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
	if (!isFormField(field)) return;

	const form = field.closest("form");
	if (!form) return;

	const formId = getFormIdentifier(form);
	let formSession = activeForms.get(formId);

	if (!formSession) {
		formSession = {
			formId,
			startTime: Date.now(),
			fields: new Map(),
			isSubmitted: false,
			totalInteractions: 0,
		};
		activeForms.set(formId, formSession);
	}

	const fieldInteraction: FormInteraction = {
		fieldName: field.name || field.id,
		fieldType: field.type || field.tagName.toLowerCase(),
		startTime: Date.now(),
		interactions: 0,
		isValid: field.validity?.valid,
		hasValue: !!field.value,
	};

	formSession.fields.set(fieldInteraction.fieldName, fieldInteraction);
	trackFormFieldInteraction("focus", field, formSession);
}

function handleFieldBlur(event: FocusEvent) {
	const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
	if (!isFormField(field)) return;

	const form = field.closest("form");
	if (!form) return;

	const formId = getFormIdentifier(form);
	const formSession = activeForms.get(formId);
	if (!formSession) return;

	const fieldInteraction = formSession.fields.get(field.name || field.id);
	if (fieldInteraction) {
		fieldInteraction.endTime = Date.now();
		fieldInteraction.isValid = field.validity?.valid;
		fieldInteraction.hasValue = !!field.value;
		trackFormFieldInteraction("blur", field, formSession);
	}
}

function handleFieldInput(event: Event) {
	const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
	if (!isFormField(field)) return;

	const form = field.closest("form");
	if (!form) return;

	const formId = getFormIdentifier(form);
	const formSession = activeForms.get(formId);
	if (!formSession) return;

	const fieldInteraction = formSession.fields.get(field.name || field.id);
	if (fieldInteraction) {
		fieldInteraction.interactions++;
		formSession.totalInteractions++;
		trackFormFieldInteraction("input", field, formSession);
	}
}

async function handleFormSubmit(event: SubmitEvent) {
	const form = event.target as HTMLFormElement;
	const formId = getFormIdentifier(form);
	const formSession = activeForms.get(formId);

	if (formSession) {
		formSession.isSubmitted = true;
		formSession.endTime = Date.now();
		await trackFormCompletion(form, formSession);
		activeForms.delete(formId);
	}
}

function handleFormReset(event: Event) {
	const form = event.target as HTMLFormElement;
	const formId = getFormIdentifier(form);
	activeForms.delete(formId);

	analytics.track("form_reset", {
		formId,
		timestamp: Date.now(),
	});
}

async function handlePageLeave() {
	// Track all unsubmitted forms as abandoned
	for (const [formId, session] of activeForms.entries()) {
		if (!session.isSubmitted) {
			await trackFormAbandonment(formId, session);
		}
	}
}

async function trackFormFieldInteraction(type: "focus" | "blur" | "input", field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, session: FormSession) {
	const fieldInteraction = session.fields.get(field.name || field.id);
	if (!fieldInteraction) return;

	await analytics.track("form_field_interaction", {
		formId: session.formId,
		field: getElementData(field),
		interactionType: type,
		fieldMetrics: {
			name: fieldInteraction.fieldName,
			type: fieldInteraction.fieldType,
			timeSpent: fieldInteraction.endTime ? fieldInteraction.endTime - fieldInteraction.startTime : Date.now() - fieldInteraction.startTime,
			interactions: fieldInteraction.interactions,
			isValid: fieldInteraction.isValid,
			hasValue: fieldInteraction.hasValue,
		},
		formMetrics: {
			totalTimeSpent: Date.now() - session.startTime,
			totalInteractions: session.totalInteractions,
			fieldsInteracted: session.fields.size,
		},
		timestamp: Date.now(),
	});
}

async function trackFormCompletion(form: HTMLFormElement, session: FormSession) {
	await analytics.track("form_completion", {
		formId: session.formId,
		element: getElementData(form),
		metrics: {
			totalTimeSpent: session.endTime! - session.startTime,
			totalInteractions: session.totalInteractions,
			fieldsInteracted: session.fields.size,
			fieldMetrics: Array.from(session.fields.values()).map((field) => ({
				name: field.fieldName,
				type: field.fieldType,
				timeSpent: field.endTime ? field.endTime - field.startTime : 0,
				interactions: field.interactions,
				isValid: field.isValid,
				hasValue: field.hasValue,
			})),
		},
		timestamp: Date.now(),
	});
}

async function trackFormAbandonment(formId: string, session: FormSession) {
	await analytics.track("form_abandonment", {
		formId,
		metrics: {
			timeSpentBeforeAbandonment: Date.now() - session.startTime,
			totalInteractions: session.totalInteractions,
			fieldsInteracted: session.fields.size,
			lastInteractedField: Array.from(session.fields.values()).sort((a, b) => (b.endTime || 0) - (a.endTime || 0))[0]?.fieldName,
			completionPercentage: calculateFormCompletionPercentage(session),
		},
		timestamp: Date.now(),
	});
}

function calculateFormCompletionPercentage(session: FormSession): number {
	const filledFields = Array.from(session.fields.values()).filter((f) => f.hasValue).length;
	return Math.round((filledFields / session.fields.size) * 100);
}

function isFormField(element: Element): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
	const validTags = ["INPUT", "TEXTAREA", "SELECT"];
	return validTags.includes(element.tagName);
}
