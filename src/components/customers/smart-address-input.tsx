"use client";

/**
 * SmartAddressInput Component
 *
 * AI-powered address input with autocomplete
 * - Google Places API autocomplete
 * - Auto-fills all address fields (street, city, state, zip)
 * - Fallback to manual entry if autocomplete unavailable
 * - Progressive disclosure of advanced fields
 */

import { Check, Loader2, MapPin, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isGoogleMapsLoaded, loadGoogleMapsScript } from "@/lib/utils/load-google-maps";

type AddressData = {
	address: string;
	address2?: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
};

type SmartAddressInputProps = {
	onAddressChange: (address: AddressData) => void;
	initialAddress?: AddressData;
	label?: string;
	required?: boolean;
};

export function SmartAddressInput({
	onAddressChange,
	initialAddress,
	label = "Address",
	required = false,
}: SmartAddressInputProps) {
	const [address, setAddress] = useState<AddressData>({
		address: initialAddress?.address || "",
		address2: initialAddress?.address2 || "",
		city: initialAddress?.city || "",
		state: initialAddress?.state || "",
		zipCode: initialAddress?.zipCode || "",
		country: initialAddress?.country || "USA",
	});
	const [isAutocompleteLoaded, setIsAutocompleteLoaded] = useState(false);
	const [isManualMode, setIsManualMode] = useState(false);
	const [showAdvanced, setShowAdvanced] = useState(false);
	const autocompleteInputRef = useRef<HTMLInputElement>(null);
	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

	// Load Google Places API using singleton loader
	useEffect(() => {
		const loadGooglePlaces = async () => {
			// Check if Google Maps is already loaded
			if (isGoogleMapsLoaded()) {
				setIsAutocompleteLoaded(true);
				return;
			}

			// If API key is not available, fallback to manual mode
			const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
			if (!apiKey) {
				setIsManualMode(true);
				return;
			}

			try {
				// Use singleton loader to prevent multiple script loads
				await loadGoogleMapsScript();
				setIsAutocompleteLoaded(true);
			} catch (_error) {
    console.error("Error:", _error);
				setIsManualMode(true);
			}
		};

		loadGooglePlaces();
	}, []);

	// Initialize autocomplete when loaded
	useEffect(() => {
		if (isAutocompleteLoaded && autocompleteInputRef.current && !isManualMode) {
			autocompleteRef.current = new google.maps.places.Autocomplete(autocompleteInputRef.current, {
				types: ["address"],
				componentRestrictions: { country: "us" },
			});

			autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
		}
	}, [isAutocompleteLoaded, isManualMode, handlePlaceSelect]);

	const handlePlaceSelect = () => {
		const place = autocompleteRef.current?.getPlace();
		if (!place?.address_components) {
			return;
		}

		const newAddress: AddressData = {
			address: "",
			address2: "",
			city: "",
			state: "",
			zipCode: "",
			country: "USA",
		};

		// Extract address components
		place.address_components.forEach((component) => {
			const types = component.types;

			if (types.includes("street_number")) {
				newAddress.address = component.long_name;
			}
			if (types.includes("route")) {
				newAddress.address = `${newAddress.address} ${component.long_name}`.trim();
			}
			if (types.includes("locality")) {
				newAddress.city = component.long_name;
			}
			if (types.includes("administrative_area_level_1")) {
				newAddress.state = component.short_name;
			}
			if (types.includes("postal_code")) {
				newAddress.zipCode = component.long_name;
			}
			if (types.includes("country")) {
				newAddress.country = component.long_name;
			}
		});

		setAddress(newAddress);
		onAddressChange(newAddress);
		setShowAdvanced(true);
	};

	const handleManualChange = (field: keyof AddressData, value: string) => {
		const updated = { ...address, [field]: value };
		setAddress(updated);
		onAddressChange(updated);
	};

	if (isManualMode) {
		// Manual fallback mode
		return (
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="address">
						{label} {required && <span className="text-destructive">*</span>}
					</Label>
					<Input
						id="address"
						onChange={(e) => handleManualChange("address", e.target.value)}
						placeholder="123 Main St"
						required={required}
						value={address.address || ""}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="address2">Apartment, suite, etc. (Optional)</Label>
					<Input
						id="address2"
						onChange={(e) => handleManualChange("address2", e.target.value)}
						placeholder="Apt 4B"
						value={address.address2 || ""}
					/>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<div className="space-y-2">
						<Label htmlFor="city">City</Label>
						<Input
							id="city"
							onChange={(e) => handleManualChange("city", e.target.value)}
							placeholder="San Francisco"
							value={address.city || ""}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="state">State</Label>
						<Input
							id="state"
							onChange={(e) => handleManualChange("state", e.target.value)}
							placeholder="CA"
							value={address.state || ""}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="zipCode">ZIP Code</Label>
						<Input
							id="zipCode"
							onChange={(e) => handleManualChange("zipCode", e.target.value)}
							placeholder="94103"
							value={address.zipCode || ""}
						/>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label htmlFor="autocomplete-address">
						{label} {required && <span className="text-destructive">*</span>}
					</Label>
					{isAutocompleteLoaded && (
						<div className="flex items-center gap-1 text-success text-xs">
							<Check className="size-3" />
							<span>Smart autocomplete enabled</span>
						</div>
					)}
					{!isAutocompleteLoaded && (
						<div className="flex items-center gap-1 text-muted-foreground text-xs">
							<Loader2 className="size-3 animate-spin" />
							<span>Loading autocomplete...</span>
						</div>
					)}
				</div>

				<div className="relative">
					<Search className="absolute top-3 left-3 size-4 text-muted-foreground" />
					<Input
						className="pl-10"
						id="autocomplete-address"
						placeholder="Start typing an address..."
						ref={autocompleteInputRef}
						required={required}
					/>
				</div>
				<p className="text-muted-foreground text-xs">
					Type to search, or{" "}
					<button className="text-primary underline" onClick={() => setShowAdvanced(!showAdvanced)} type="button">
						enter manually
					</button>
				</p>
			</div>

			{/* Show filled fields after autocomplete or manual toggle */}
			{(showAdvanced || address.address) && (
				<div className="space-y-4 rounded-lg border bg-muted/20 p-4">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<MapPin className="size-4" />
						<span className="font-medium">Address Details</span>
					</div>

					<div className="space-y-2">
						<Label htmlFor="address-street">Street Address</Label>
						<Input
							id="address-street"
							onChange={(e) => handleManualChange("address", e.target.value)}
							placeholder="123 Main St"
							value={address.address || ""}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="address-line2">Apartment, suite, etc.</Label>
						<Input
							id="address-line2"
							onChange={(e) => handleManualChange("address2", e.target.value)}
							placeholder="Apt 4B"
							value={address.address2 || ""}
						/>
					</div>

					<div className="grid gap-4 md:grid-cols-3">
						<div className="space-y-2">
							<Label htmlFor="address-city">City</Label>
							<Input
								id="address-city"
								onChange={(e) => handleManualChange("city", e.target.value)}
								placeholder="San Francisco"
								value={address.city || ""}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="address-state">State</Label>
							<Input
								id="address-state"
								onChange={(e) => handleManualChange("state", e.target.value)}
								placeholder="CA"
								value={address.state || ""}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="address-zip">ZIP Code</Label>
							<Input
								id="address-zip"
								onChange={(e) => handleManualChange("zipCode", e.target.value)}
								placeholder="94103"
								value={address.zipCode || ""}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Hidden inputs for form submission */}
			<input name="address" type="hidden" value={address.address || ""} />
			<input name="address2" type="hidden" value={address.address2 || ""} />
			<input name="city" type="hidden" value={address.city || ""} />
			<input name="state" type="hidden" value={address.state || ""} />
			<input name="zipCode" type="hidden" value={address.zipCode || ""} />
			<input name="country" type="hidden" value={address.country || "USA"} />
		</div>
	);
}
