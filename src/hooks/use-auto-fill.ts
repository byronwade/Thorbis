/**
 * useAutoFill Hook
 *
 * Manages auto-filling form fields from AI extraction data
 *
 * Features:
 * - Confidence-based auto-population (>80% auto-fills, 60-80% suggests, <60% skips)
 * - Manual override tracking
 * - Field state management (ai-filled, suggested, user-entered)
 * - Approval/rejection of AI suggestions
 */

import { useCallback, useEffect, useState } from "react";
import {
	type FieldState,
	type FormData,
	getDataSyncManager,
} from "@/lib/call-window/data-sync-manager";
import { useAIExtraction } from "./use-ai-extraction";

export type FieldVisualState = "empty" | "ai-filled" | "ai-suggested" | "user-entered" | "synced";

export function useAutoFill(formType: "customer" | "job" | "appointment") {
	const { extractedData, isExtracting } = useAIExtraction();
	const [formData, setFormData] = useState<Record<string, FieldState>>({});
	const syncManager = getDataSyncManager();

	// Subscribe to data sync manager updates
	useEffect(() => {
		const unsubscribe = syncManager.subscribe((data: FormData) => {
			setFormData(data[formType]);
		});

		// Initial load
		setFormData(syncManager.getFormData(formType));

		return () => {
			unsubscribe();
		};
	}, [syncManager, formType]);

	// Sync AI extraction data to sync manager
	useEffect(() => {
		if (extractedData && !isExtracting) {
			syncManager.syncFromAIExtraction(extractedData);
		}
	}, [extractedData, isExtracting, syncManager]);

	/**
	 * Get field value and state
	 */
	const getField = useCallback(
		(fieldName: string): { value: any; state: FieldVisualState; confidence?: number } => {
			const field = formData[fieldName];

			if (!field) {
				return { value: "", state: "empty" };
			}

			let state: FieldVisualState;
			if (field.source === "user") {
				state = "user-entered";
			} else if (field.source === "synced") {
				state = "synced";
			} else if (field.source === "ai") {
				// Determine if it's a suggestion or auto-filled
				state = (field.confidence || 0) < 80 ? "ai-suggested" : "ai-filled";
			} else {
				state = "empty";
			}

			return {
				value: field.value,
				state,
				confidence: field.confidence,
			};
		},
		[formData]
	);

	/**
	 * Update field value from user input
	 */
	const updateField = useCallback(
		(fieldName: string, value: any) => {
			syncManager.updateFromUser(formType, fieldName, value);
		},
		[syncManager, formType]
	);

	/**
	 * Approve an AI suggestion
	 */
	const approveField = useCallback(
		(fieldName: string) => {
			syncManager.approveAISuggestion(formType, fieldName);
		},
		[syncManager, formType]
	);

	/**
	 * Reject an AI suggestion
	 */
	const rejectField = useCallback(
		(fieldName: string) => {
			syncManager.rejectAISuggestion(formType, fieldName);
		},
		[syncManager, formType]
	);

	/**
	 * Get all form values as a plain object
	 */
	const getFormValues = useCallback(() => {
		const values: Record<string, any> = {};
		Object.entries(formData).forEach(([key, field]) => {
			values[key] = field.value;
		});
		return values;
	}, [formData]);

	/**
	 * Get fields by state
	 */
	const getFieldsByState = useCallback(
		(state: FieldVisualState) =>
			Object.entries(formData)
				.filter(([_, field]) => {
					if (state === "ai-filled") {
						return field.source === "ai" && (field.confidence || 0) >= 80;
					}
					if (state === "ai-suggested") {
						return field.source === "ai" && (field.confidence || 0) < 80;
					}
					if (state === "user-entered") {
						return field.source === "user";
					}
					if (state === "synced") {
						return field.source === "synced";
					}
					return false;
				})
				.map(([key]) => key),
		[formData]
	);

	/**
	 * Approve all AI suggestions
	 */
	const approveAll = useCallback(() => {
		const aiFields = getFieldsByState("ai-filled").concat(getFieldsByState("ai-suggested"));
		aiFields.forEach((fieldName) => {
			syncManager.approveAISuggestion(formType, fieldName);
		});
	}, [getFieldsByState, syncManager, formType]);

	/**
	 * Reject all AI suggestions
	 */
	const rejectAll = useCallback(() => {
		const aiFields = getFieldsByState("ai-filled").concat(getFieldsByState("ai-suggested"));
		aiFields.forEach((fieldName) => {
			syncManager.rejectAISuggestion(formType, fieldName);
		});
	}, [getFieldsByState, syncManager, formType]);

	return {
		getField,
		updateField,
		approveField,
		rejectField,
		getFormValues,
		getFieldsByState,
		approveAll,
		rejectAll,
		isExtracting,
	};
}
