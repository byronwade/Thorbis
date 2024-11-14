import { BaseTracker } from "./BaseTracker";

export class NetworkTracker extends BaseTracker {
	private originalFetch!: typeof fetch;
	private originalXHR!: typeof XMLHttpRequest.prototype.open;

	private handleNetworkChange = (status: "online" | "offline") => {
		this.trackEvent("network_status", {
			status,
			timestamp: Date.now(),
		});
	};

	initialize() {
		if (typeof window !== "undefined") {
			this.originalFetch = window.fetch;
			this.originalXHR = XMLHttpRequest.prototype.open;
			this.trackFetch();
			this.trackXHR();
			this.trackNetworkStatus();
		}
	}

	private trackFetch() {
		window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
			const startTime = performance.now();
			const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

			try {
				const response = await this.originalFetch.call(window, input, init);
				this.trackRequest({
					type: "fetch",
					url,
					method: init?.method || "GET",
					status: response.status,
					duration: performance.now() - startTime,
					success: response.ok,
				});
				return response;
			} catch (error) {
				this.trackRequest({
					type: "fetch",
					url,
					method: init?.method || "GET",
					duration: performance.now() - startTime,
					success: false,
					error: error instanceof Error ? error.message : String(error),
				});
				throw error;
			}
		};
	}

	private trackXHR() {
		const originalOpen = XMLHttpRequest.prototype.open;
		XMLHttpRequest.prototype.open = function (method: string, url: string | URL, async: boolean = true, username?: string | null, password?: string | null) {
			const startTime = performance.now();

			this.addEventListener("load", () => {
				const duration = performance.now() - startTime;
				const tracker = NetworkTracker.prototype.trackRequest.bind(this);
				tracker({
					type: "xhr",
					url: String(url),
					method,
					status: this.status,
					duration,
					success: this.status >= 200 && this.status < 300,
				});
			});

			this.addEventListener("error", () => {
				const duration = performance.now() - startTime;
				const tracker = NetworkTracker.prototype.trackRequest.bind(this);
				tracker({
					type: "xhr",
					url: String(url),
					method,
					duration,
					success: false,
					error: "Network error",
				});
			});

			return originalOpen.call(this, method, url, async, username || null, password || null);
		};
	}

	private trackNetworkStatus() {
		window.addEventListener("online", () => this.handleNetworkChange("online"));
		window.addEventListener("offline", () => this.handleNetworkChange("offline"));
	}

	private trackRequest(data: { type: "fetch" | "xhr"; url: string; method: string; status?: number; duration: number; success: boolean; error?: string }) {
		this.trackEvent("network_request", {
			...data,
			timestamp: Date.now(),
		});
	}

	destroy(): void {
		if (this.originalFetch) {
			window.fetch = this.originalFetch;
		}
		if (this.originalXHR) {
			XMLHttpRequest.prototype.open = this.originalXHR;
		}
		window.removeEventListener("online", () => this.handleNetworkChange("online"));
		window.removeEventListener("offline", () => this.handleNetworkChange("offline"));
	}
}
