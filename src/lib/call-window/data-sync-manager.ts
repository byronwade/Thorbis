/**
 * Data Sync Manager
 *
 * Coordinates data flow between:
 * - AI extraction results
 * - Call window forms
 * - Main application pages
 *
 * Tracks which fields are AI-filled vs user-edited to handle conflicts
 */

import type { AIExtractedData } from "@/hooks/use-ai-extraction";

export type FieldSource = "ai" | "user" | "synced";

export type FieldState = {
	value: any;
	source: FieldSource;
	confidence?: number;
	timestamp: number;
};

export type FormData = {
	customer: Record<string, FieldState>;
	job: Record<string, FieldState>;
	appointment: Record<string, FieldState>;
};

export class DataSyncManager {
	private formData: FormData = {
		customer: {},
		job: {},
		appointment: {},
	};

	private readonly listeners: Set<(data: FormData) => void> = new Set();

	/**
	 * Update a field from AI extraction
	 */
	updateFromAI(formType: keyof FormData, fieldName: string, value: any, confidence: number) {
		// Only update if field is not user-edited, or confidence is very high
		const existing = this.formData[formType][fieldName];
		const shouldUpdate = !existing || (existing.source === "user" ? confidence > 90 : true);

		if (shouldUpdate && value != null) {
			this.formData[formType][fieldName] = {
				value,
				source: "ai",
				confidence,
				timestamp: Date.now(),
			};
			this.notifyListeners();
		}
	}

	/**
	 * Update a field from user input
	 */
	updateFromUser(formType: keyof FormData, fieldName: string, value: any) {
		this.formData[formType][fieldName] = {
			value,
			source: "user",
			timestamp: Date.now(),
		};
		this.notifyListeners();
	}

	/**
	 * Approve an AI suggestion (convert from ai to user source)
	 */
	approveAISuggestion(formType: keyof FormData, fieldName: string) {
		const field = this.formData[formType][fieldName];
		if (field && field.source === "ai") {
			this.formData[formType][fieldName] = {
				...field,
				source: "user",
				timestamp: Date.now(),
			};
			this.notifyListeners();
		}
	}

	/**
	 * Reject an AI suggestion (clear the field)
	 */
	rejectAISuggestion(formType: keyof FormData, fieldName: string) {
		delete this.formData[formType][fieldName];
		this.notifyListeners();
	}

	/**
	 * Get current value for a field
	 */
	getField(formType: keyof FormData, fieldName: string): FieldState | undefined {
		return this.formData[formType][fieldName];
	}

	/**
	 * Get all data for a form type
	 */
	getFormData(formType: keyof FormData): Record<string, FieldState> {
		return this.formData[formType];
	}

	/**
	 * Get all data (for syncing to main app)
	 */
	getAllData(): FormData {
		return this.formData;
	}

	/**
	 * Set data from external source (main app sync)
	 */
	setFromSync(data: Partial<FormData>) {
		Object.entries(data).forEach(([formType, fields]) => {
			Object.entries(fields).forEach(([fieldName, fieldState]) => {
				// Only sync if local field doesn't exist or is older
				const existing = this.formData[formType as keyof FormData][fieldName];
				if (!existing || existing.timestamp < (fieldState as FieldState).timestamp) {
					this.formData[formType as keyof FormData][fieldName] = {
						...(fieldState as FieldState),
						source: "synced",
					};
				}
			});
		});
		this.notifyListeners();
	}

	/**
	 * Subscribe to data changes
	 */
	subscribe(listener: (data: FormData) => void) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	/**
	 * Notify all listeners of data changes
	 */
	private notifyListeners() {
		this.listeners.forEach((listener) => listener(this.formData));
	}

	/**
	 * Clear all data
	 */
	clear() {
		this.formData = {
			customer: {},
			job: {},
			appointment: {},
		};
		this.notifyListeners();
	}

	/**
	 * Map AI extraction data to form fields
	 */
	syncFromAIExtraction(data: AIExtractedData) {
		// Customer info
		if (data.customerInfo.name) {
			// Split name into first and last
			const nameParts = data.customerInfo.name.trim().split(" ");
			const firstName = nameParts[0];
			const lastName = nameParts.slice(1).join(" ");

			this.updateFromAI("customer", "firstName", firstName, data.customerInfo.confidence);
			if (lastName) {
				this.updateFromAI("customer", "lastName", lastName, data.customerInfo.confidence);
			}
		}
		if (data.customerInfo.email) {
			this.updateFromAI("customer", "email", data.customerInfo.email, data.customerInfo.confidence);
		}
		if (data.customerInfo.phone) {
			this.updateFromAI("customer", "phone", data.customerInfo.phone, data.customerInfo.confidence);
		}
		if (data.customerInfo.company) {
			this.updateFromAI(
				"customer",
				"company",
				data.customerInfo.company,
				data.customerInfo.confidence
			);
		}
		if (data.customerInfo.address.street) {
			this.updateFromAI(
				"customer",
				"address",
				data.customerInfo.address.street,
				data.customerInfo.confidence
			);
		}
		if (data.customerInfo.address.city) {
			this.updateFromAI(
				"customer",
				"city",
				data.customerInfo.address.city,
				data.customerInfo.confidence
			);
		}
		if (data.customerInfo.address.state) {
			this.updateFromAI(
				"customer",
				"state",
				data.customerInfo.address.state,
				data.customerInfo.confidence
			);
		}
		if (data.customerInfo.address.zipCode) {
			this.updateFromAI(
				"customer",
				"zipCode",
				data.customerInfo.address.zipCode,
				data.customerInfo.confidence
			);
		}

		// Job details
		if (data.jobDetails.title) {
			this.updateFromAI("job", "title", data.jobDetails.title, data.jobDetails.confidence);
		}
		if (data.jobDetails.description) {
			this.updateFromAI(
				"job",
				"description",
				data.jobDetails.description,
				data.jobDetails.confidence
			);
		}
		if (data.jobDetails.urgency) {
			this.updateFromAI("job", "priority", data.jobDetails.urgency, data.jobDetails.confidence);
		}
		if (data.jobDetails.type) {
			this.updateFromAI("job", "jobType", data.jobDetails.type, data.jobDetails.confidence);
		}
		if (data.jobDetails.estimatedDuration) {
			this.updateFromAI(
				"job",
				"estimatedDuration",
				data.jobDetails.estimatedDuration,
				data.jobDetails.confidence
			);
		}

		// Appointment needs
		if (data.appointmentNeeds.preferredDate) {
			this.updateFromAI(
				"appointment",
				"date",
				data.appointmentNeeds.preferredDate,
				data.appointmentNeeds.confidence
			);
		}
		if (data.appointmentNeeds.preferredTime) {
			this.updateFromAI(
				"appointment",
				"time",
				data.appointmentNeeds.preferredTime,
				data.appointmentNeeds.confidence
			);
		}
		if (data.appointmentNeeds.duration) {
			this.updateFromAI(
				"appointment",
				"duration",
				data.appointmentNeeds.duration,
				data.appointmentNeeds.confidence
			);
		}
		if (data.appointmentNeeds.specialRequirements) {
			this.updateFromAI(
				"appointment",
				"notes",
				data.appointmentNeeds.specialRequirements,
				data.appointmentNeeds.confidence
			);
		}
	}
}

// Singleton instance
let instance: DataSyncManager | null = null;

export function getDataSyncManager(): DataSyncManager {
	if (!instance) {
		instance = new DataSyncManager();
	}
	return instance;
}
