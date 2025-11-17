/**
 * Google Maps Script Loader - Singleton Pattern
 *
 * Prevents multiple script loads by tracking loading state
 * and reusing existing script tags
 */

type LoadCallback = () => void;
type ErrorCallback = () => void;

let isLoading = false;
let isLoaded = false;
const loadCallbacks: LoadCallback[] = [];
const errorCallbacks: ErrorCallback[] = [];

/**
 * Load Google Maps JavaScript API with Places library
 *
 * Uses singleton pattern to ensure script is only loaded once
 * even if multiple components try to load it simultaneously
 */
export function loadGoogleMapsScript(): Promise<void> {
	return new Promise((resolve, reject) => {
		// If already loaded, resolve immediately
		if (isLoaded && typeof window !== "undefined" && (window as any).google?.maps) {
			resolve();
			return;
		}

		// If currently loading, add to callbacks queue
		if (isLoading) {
			loadCallbacks.push(() => resolve());
			errorCallbacks.push(() => reject(new Error("Failed to load Google Maps")));
			return;
		}

		// Check if script tag already exists
		const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');

		if (existingScript) {
			// Script tag exists, wait for it to load
			isLoading = true;
			const checkLoaded = setInterval(() => {
				if (typeof window !== "undefined" && (window as any).google?.maps) {
					clearInterval(checkLoaded);
					isLoading = false;
					isLoaded = true;
					resolve();
					// Notify waiting callbacks
					loadCallbacks.forEach((cb) => cb());
					loadCallbacks.length = 0;
					errorCallbacks.length = 0;
				}
			}, 100);

			// Timeout after 10 seconds
			setTimeout(() => {
				clearInterval(checkLoaded);
				if (!isLoaded) {
					isLoading = false;
					reject(new Error("Google Maps script load timeout"));
					errorCallbacks.forEach((cb) => cb());
					errorCallbacks.length = 0;
					loadCallbacks.length = 0;
				}
			}, 10_000);
			return;
		}

		// Start loading
		isLoading = true;
		const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

		if (!apiKey) {
			isLoading = false;
			reject(new Error("Google Maps API key not configured"));
			return;
		}

		try {
			const script = document.createElement("script");
			script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
			script.async = true;
			script.defer = true;

			script.onload = () => {
				isLoading = false;
				isLoaded = true;
				resolve();
				// Notify waiting callbacks
				loadCallbacks.forEach((cb) => cb());
				loadCallbacks.length = 0;
				errorCallbacks.length = 0;
			};

			script.onerror = () => {
				isLoading = false;
				const error = new Error("Failed to load Google Maps script");
				reject(error);
				// Notify waiting callbacks
				errorCallbacks.forEach((cb) => cb());
				errorCallbacks.length = 0;
				loadCallbacks.length = 0;
			};

			document.head.appendChild(script);
		} catch (error) {
			isLoading = false;
			reject(error);
		}
	});
}

/**
 * Check if Google Maps is already loaded
 */
export function isGoogleMapsLoaded(): boolean {
	return typeof window !== "undefined" && !!(window as any).google?.maps && isLoaded;
}
