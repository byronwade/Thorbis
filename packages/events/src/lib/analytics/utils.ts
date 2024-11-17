/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, wait: number): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;
	return function (...args: Parameters<T>) {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), wait);
	};
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, wait: number): (...args: Parameters<T>) => void {
	let lastCall = 0;
	return function (...args: Parameters<T>) {
		const now = Date.now();
		if (now - lastCall >= wait) {
			fn(...args);
			lastCall = now;
		}
	};
}

/**
 * Determines the device type based on user agent and screen size
 */
export function getDeviceType(): string {
	const ua = navigator.userAgent;
	if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		return "tablet";
	}
	if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
		return "mobile";
	}
	return "desktop";
}

/**
 * Finds the section of the page an element is in
 */
export function findPageSection(element: HTMLElement): string {
	const sections = ["header", "nav", "main", "article", "aside", "footer"];
	let current = element;

	while (current && current !== document.body) {
		const tag = current.tagName.toLowerCase();
		if (sections.includes(tag)) {
			return tag;
		}
		if (current.getAttribute("role") === "region") {
			return current.getAttribute("aria-label") || "region";
		}
		current = current.parentElement!;
	}

	return "unknown";
}

/**
 * Type guard for checking if an element is an HTMLElement
 */
export function isHTMLElement(element: Element): element is HTMLElement {
	return element instanceof HTMLElement;
}

/**
 * Extracts UTM parameters from the current URL
 */
export function getUtmParams(): Record<string, string> {
	const params: Record<string, string> = {};
	const urlParams = new URLSearchParams(window.location.search);

	["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((param) => {
		const value = urlParams.get(param);
		if (value) params[param] = value;
	});

	return params;
}

/**
 * Calculates the velocity of a mouse event
 */
export function calculateVelocity(e: MouseEvent): number {
	const now = Date.now();
	const timeDelta = now - (e as any).lastTimestamp || 0;
	const distance = Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2));
	(e as any).lastTimestamp = now;
	return timeDelta > 0 ? distance / timeDelta : 0;
}
