import { BaseTracker } from "./BaseTracker";

export class FormTracker extends BaseTracker {
	private formInteractions: Map<
		string,
		{
			startTime: number;
			initialValues: Record<string, string>;
		}
	> = new Map();

	initialize() {
		this.trackFormInteractions();
		this.trackFormSubmissions();
		this.trackFormAbandonment();
	}

	private trackFormInteractions() {
		document.addEventListener("focusin", this.handleFocusIn);
		document.addEventListener("input", this.handleInput);
	}

	private handleFocusIn = (e: FocusEvent) => {
		const target = e.target as HTMLElement;
		if (this.isFormElement(target)) {
			const formId = this.getFormIdentifier(target);
			this.formInteractions.set(formId, {
				startTime: Date.now(),
				initialValues: this.getFormValues(target),
			});
		}
	};

	private handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		if (this.isFormElement(target)) {
			this.trackEvent("form_input", {
				element: this.getElementData(target),
				value: {
					length: target.value.length,
					type: target.type,
				},
			});
		}
	};

	private trackFormSubmissions() {
		document.addEventListener("submit", this.handleSubmit);
	}

	private handleSubmit = (e: SubmitEvent) => {
		const form = e.target as HTMLFormElement;
		const formId = this.getFormIdentifier(form);
		const interaction = this.formInteractions.get(formId);

		if (interaction) {
			const duration = Date.now() - interaction.startTime;
			this.trackEvent("form_submit", {
				element: this.getElementData(form),
				duration,
				fields: this.getFormFieldCount(form),
			});
			this.formInteractions.delete(formId);
		}
	};

	private trackFormAbandonment() {
		document.addEventListener("focusout", this.handleFocusOut);
	}

	private handleFocusOut = (e: FocusEvent) => {
		const target = e.target as HTMLElement;
		if (this.isFormElement(target)) {
			const formId = this.getFormIdentifier(target);
			const interaction = this.formInteractions.get(formId);

			if (interaction) {
				const currentValues = this.getFormValues(target);
				const hasChanges = this.detectValueChanges(interaction.initialValues, currentValues);

				if (hasChanges) {
					this.trackEvent("form_abandonment", {
						element: this.getElementData(target),
						duration: Date.now() - interaction.startTime,
					});
				}
			}
		}
	};

	private isFormElement(element: HTMLElement): boolean {
		return element.tagName === "INPUT" || element.tagName === "TEXTAREA" || element.tagName === "SELECT";
	}

	private getFormIdentifier(element: HTMLElement): string {
		const form = element.closest("form");
		return form ? form.id || form.getAttribute("name") || this.generateFormId(form) : this.generateFormId(element);
	}

	private generateFormId(element: HTMLElement): string {
		return `form_${element.tagName.toLowerCase()}_${Date.now()}`;
	}

	private getFormValues(element: HTMLElement): Record<string, string> {
		const form = element.closest("form");
		if (!form) return {};

		const values: Record<string, string> = {};
		const inputs = Array.from(form.querySelectorAll("input, textarea, select"));
		inputs.forEach((input) => {
			if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
				if (input.name) {
					values[input.name] = input.value;
				}
			}
		});
		return values;
	}

	private getFormFieldCount(form: HTMLFormElement): number {
		return form.querySelectorAll("input, textarea, select").length;
	}

	private detectValueChanges(initial: Record<string, string>, current: Record<string, string>): boolean {
		return Object.keys(current).some((key) => current[key] !== initial[key] && current[key].length > 0);
	}

	destroy(): void {
		document.removeEventListener("focusin", this.handleFocusIn);
		document.removeEventListener("submit", this.handleSubmit);
		document.removeEventListener("focusout", this.handleFocusOut);
		document.removeEventListener("input", this.handleInput);
	}
}
