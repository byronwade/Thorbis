import { BaseTracker } from "./BaseTracker";

export class ErrorTracker extends BaseTracker {
	private errorCount: Record<string, number> = {};
	private originalConsoleError: typeof console.error = console.error;
	private handleError = (event: any) => {
		this.trackError({
			type: "js_error",
			message: event.message,
			stack: event.error?.stack,
			source: event.filename,
			line: event.lineno,
			column: event.colno,
		});
	};

	private handleRejection = (event: PromiseRejectionEvent) => {
		this.trackError({
			type: "promise_rejection",
			message: event.reason?.message || String(event.reason),
			stack: event.reason?.stack,
			source: "promise",
		});
	};

	private handleResourceError = (event: Event) => {
		const target = event.target as HTMLElement;
		if (target instanceof HTMLImageElement) {
			this.trackError({
				type: "resource_error",
				message: `Failed to load image`,
				source: target.src,
				element: this.getElementData(target),
			});
		} else if (target instanceof HTMLScriptElement) {
			this.trackError({
				type: "resource_error",
				message: `Failed to load script`,
				source: target.src,
				element: this.getElementData(target),
			});
		} else if (target instanceof HTMLLinkElement) {
			this.trackError({
				type: "resource_error",
				message: `Failed to load link`,
				source: target.href,
				element: this.getElementData(target),
			});
		}
	};

	initialize(): void {
		window.addEventListener("error", this.handleError);
		window.addEventListener("unhandledrejection", this.handleRejection);
		document.addEventListener("error", this.handleResourceError, true);
		this.setupConsoleErrorTracking();
	}

	private setupConsoleErrorTracking(): void {
		console.error = (...args: any[]) => {
			this.trackError({
				type: "console_error",
				message: args.map((arg) => String(arg)).join(" "),
				timestamp: Date.now(),
			});
			this.originalConsoleError.apply(console, args);
		};
	}

	private trackError(error: any): void {
		const errorKey = `${error.type}:${error.message}`;
		this.errorCount[errorKey] = (this.errorCount[errorKey] || 0) + 1;

		this.trackEvent("error", {
			...error,
			occurrences: this.errorCount[errorKey],
			url: window.location.href,
			timestamp: Date.now(),
		});
	}

	destroy(): void {
		window.removeEventListener("error", this.handleError);
		window.removeEventListener("unhandledrejection", this.handleRejection);
		document.removeEventListener("error", this.handleResourceError, true);
		console.error = this.originalConsoleError;
	}
}
