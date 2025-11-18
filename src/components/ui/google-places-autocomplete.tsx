"use client";

import { Loader2, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PlaceResult = {
	address: string;
	address2?: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	lat: number;
	lon: number;
	formattedAddress: string;
};

type GooglePlacesAutocompleteProps = {
	onPlaceSelect: (place: PlaceResult) => void;
	placeholder?: string;
	className?: string;
	autoFocus?: boolean;
};

// Global state to track script loading
let isScriptLoading = false;
let isScriptLoaded = false;
const loadCallbacks: (() => void)[] = [];

function loadGoogleMapsScript(apiKey: string): Promise<void> {
	return new Promise((resolve, reject) => {
		// Already loaded
		if (isScriptLoaded || window.google?.maps?.places) {
			isScriptLoaded = true;
			resolve();
			return;
		}

		// Currently loading, queue callback
		if (isScriptLoading) {
			loadCallbacks.push(resolve);
			return;
		}

		// Check if script element already exists
		const existingScript = document.querySelector(
			'script[src^="https://maps.googleapis.com/maps/api/js"]',
		);

		if (existingScript) {
			// Script exists but might not be loaded yet
			isScriptLoading = true;
			existingScript.addEventListener("load", () => {
				isScriptLoaded = true;
				isScriptLoading = false;
				resolve();
				loadCallbacks.forEach((cb) => cb());
				loadCallbacks.length = 0;
			});
			return;
		}

		// Start loading
		isScriptLoading = true;
		const script = document.createElement("script");
		script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
		script.async = true;
		script.defer = true;

		script.onload = () => {
			isScriptLoaded = true;
			isScriptLoading = false;
			resolve();
			loadCallbacks.forEach((cb) => cb());
			loadCallbacks.length = 0;
		};

		script.onerror = () => {
			isScriptLoading = false;
			reject(new Error("Failed to load Google Places"));
		};

		document.head.appendChild(script);
	});
}

export function GooglePlacesAutocomplete({
	onPlaceSelect,
	placeholder = "Search for an address...",
	className,
	autoFocus = false,
}: GooglePlacesAutocompleteProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

	useEffect(() => {
		const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

		if (!apiKey) {
			setError("Google Places API key not configured");
			return;
		}

		// Load script and initialize autocomplete
		loadGoogleMapsScript(apiKey)
			.then(() => {
				initAutocomplete();
			})
			.catch(() => {
				setError("Failed to load Google Places");
			});

		// Cleanup only the autocomplete instance, not the script
		return () => {
			if (autocompleteRef.current) {
				google.maps.event.clearInstanceListeners(autocompleteRef.current);
			}
		};
	}, [initAutocomplete]);

	const initAutocomplete = () => {
		if (!(inputRef.current && window.google?.maps?.places)) {
			return;
		}

		// Clear existing instance if any
		if (autocompleteRef.current) {
			google.maps.event.clearInstanceListeners(autocompleteRef.current);
		}

		const autocomplete = new window.google.maps.places.Autocomplete(
			inputRef.current,
			{
				types: ["address"],
				componentRestrictions: { country: "us" }, // Restrict to US addresses
				fields: ["address_components", "formatted_address", "geometry"],
			},
		);

		// Store reference
		autocompleteRef.current = autocomplete;

		autocomplete.addListener("place_changed", () => {
			setIsLoading(true);
			const place = autocomplete.getPlace();

			if (!place.address_components) {
				setError("No address details found");
				setIsLoading(false);
				return;
			}

			// Parse address components
			const addressComponents = place.address_components;
			let streetNumber = "";
			let route = "";
			let city = "";
			let state = "";
			let zipCode = "";
			let country = "USA";

			for (const component of addressComponents) {
				const types = component.types;

				if (types.includes("street_number")) {
					streetNumber = component.long_name;
				}
				if (types.includes("route")) {
					route = component.long_name;
				}
				if (types.includes("locality")) {
					city = component.long_name;
				}
				if (types.includes("administrative_area_level_1")) {
					state = component.short_name;
				}
				if (types.includes("postal_code")) {
					zipCode = component.long_name;
				}
				if (types.includes("country")) {
					country = component.long_name;
				}
			}

			const result: PlaceResult = {
				address: `${streetNumber} ${route}`.trim(),
				city,
				state,
				zipCode,
				country,
				lat: place.geometry?.location?.lat() || 0,
				lon: place.geometry?.location?.lng() || 0,
				formattedAddress: place.formatted_address || "",
			};
			setIsLoading(false);
			onPlaceSelect(result);
		});
	};

	if (error) {
		return (
			<div className="border-destructive/50 bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg border p-3 text-sm">
				<MapPin className="h-4 w-4" />
				<span>{error}</span>
			</div>
		);
	}

	return (
		<div className="relative">
			<Input
				autoFocus={autoFocus}
				className={cn("pl-9", className)}
				placeholder={placeholder}
				ref={inputRef}
				type="text"
			/>
			<MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
			{isLoading && (
				<Loader2 className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
			)}
		</div>
	);
}

// Type declarations for Google Maps API
declare global {
	type Window = {
		google?: {
			maps?: {
				places?: {
					Autocomplete: any;
					AutocompleteService: any;
					PlacesService: any;
				};
			};
		};
	};
}
