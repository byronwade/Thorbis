/**
 * Validated Address Input Component
 *
 * Address input with real-time validation using Google Address Validation API
 * - Autocomplete suggestions (via Places API)
 * - Real-time validation
 * - USPS standardization
 * - Geocoding
 */

"use client";

import {
	AlertTriangle,
	Check,
	ChevronDown,
	Loader2,
	MapPin,
	X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type ValidationResult = {
	isValid: boolean;
	confidence: "high" | "medium" | "low";
	formattedAddress: string | null;
	components: {
		addressLines: string[];
		city: string | null;
		state: string | null;
		postalCode: string | null;
		country: string | null;
	} | null;
	geocode: {
		lat: number;
		lng: number;
		placeId: string | null;
	} | null;
	usps: {
		standardized: {
			firstAddressLine?: string;
			city?: string;
			state?: string;
			zipCode?: string;
			zipCodeExtension?: string;
		} | null;
		carrierRoute: string | null;
		county: string | null;
	} | null;
	corrections: string[];
	warnings: string[];
};

interface ValidatedAddressInputProps {
	value?: string;
	onChange?: (value: string) => void;
	onValidated?: (result: ValidationResult | null) => void;
	onComponentsExtracted?: (components: {
		address1: string;
		address2?: string;
		city: string;
		state: string;
		zip: string;
		lat?: number;
		lng?: number;
	}) => void;
	placeholder?: string;
	label?: string;
	required?: boolean;
	disabled?: boolean;
	className?: string;
	validateOnBlur?: boolean;
	showValidationStatus?: boolean;
	regionCode?: string;
}

export function ValidatedAddressInput({
	value = "",
	onChange,
	onValidated,
	onComponentsExtracted,
	placeholder = "Enter address...",
	label,
	required = false,
	disabled = false,
	className,
	validateOnBlur = true,
	showValidationStatus = true,
	regionCode = "US",
}: ValidatedAddressInputProps) {
	const [inputValue, setInputValue] = useState(value);
	const [isValidating, setIsValidating] = useState(false);
	const [validationResult, setValidationResult] =
		useState<ValidationResult | null>(null);
	const [showSuggestion, setShowSuggestion] = useState(false);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const lastValidatedRef = useRef<string>("");

	// Update input value when prop changes
	useEffect(() => {
		if (value !== inputValue) {
			setInputValue(value);
		}
	}, [value]);

	// Validate address
	const validateAddress = useCallback(
		async (address: string) => {
			if (!address || address.length < 10) {
				setValidationResult(null);
				onValidated?.(null);
				return;
			}

			// Don't re-validate the same address
			if (address === lastValidatedRef.current) {
				return;
			}

			setIsValidating(true);

			try {
				const response = await fetch(
					`/api/address/validate?address=${encodeURIComponent(address)}&regionCode=${regionCode}`,
				);

				if (!response.ok) {
					throw new Error("Validation failed");
				}

				const result: ValidationResult = await response.json();
				setValidationResult(result);
				lastValidatedRef.current = address;
				onValidated?.(result);

				// Show suggestion if we have a corrected address
				if (
					result.formattedAddress &&
					result.formattedAddress.toLowerCase() !== address.toLowerCase()
				) {
					setShowSuggestion(true);
				}

				// Extract components if valid
				if (result.isValid && result.components && onComponentsExtracted) {
					const uspsStd = result.usps?.standardized;
					onComponentsExtracted({
						address1:
							uspsStd?.firstAddressLine ||
							result.components.addressLines[0] ||
							"",
						address2: result.components.addressLines[1],
						city: uspsStd?.city || result.components.city || "",
						state: uspsStd?.state || result.components.state || "",
						zip: uspsStd?.zipCode || result.components.postalCode || "",
						lat: result.geocode?.lat,
						lng: result.geocode?.lng,
					});
				}
			} catch (error) {
				console.error("Address validation error:", error);
				setValidationResult(null);
				onValidated?.(null);
			} finally {
				setIsValidating(false);
			}
		},
		[regionCode, onValidated, onComponentsExtracted],
	);

	// Debounced validation
	const debouncedValidate = useCallback(
		(address: string) => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}

			debounceTimerRef.current = setTimeout(() => {
				validateAddress(address);
			}, 500);
		},
		[validateAddress],
	);

	// Handle input change
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		onChange?.(newValue);
		setShowSuggestion(false);

		// Clear validation if input is cleared
		if (!newValue) {
			setValidationResult(null);
			onValidated?.(null);
		}
	};

	// Handle blur
	const handleBlur = () => {
		if (validateOnBlur && inputValue) {
			validateAddress(inputValue);
		}
	};

	// Accept suggested address
	const acceptSuggestion = () => {
		if (validationResult?.formattedAddress) {
			setInputValue(validationResult.formattedAddress);
			onChange?.(validationResult.formattedAddress);
			setShowSuggestion(false);
			lastValidatedRef.current = validationResult.formattedAddress;
		}
	};

	// Dismiss suggestion
	const dismissSuggestion = () => {
		setShowSuggestion(false);
	};

	// Validation status indicator
	const renderValidationStatus = () => {
		if (!showValidationStatus) return null;

		if (isValidating) {
			return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
		}

		if (!validationResult) return null;

		if (validationResult.isValid) {
			return (
				<div className="flex items-center gap-1">
					<Check className="h-4 w-4 text-green-600" />
					{validationResult.confidence === "high" && (
						<Badge variant="outline" className="text-xs text-green-600">
							Verified
						</Badge>
					)}
				</div>
			);
		}

		return (
			<div className="flex items-center gap-1">
				<AlertTriangle className="h-4 w-4 text-amber-500" />
				<Badge variant="outline" className="text-xs text-amber-600">
					Unverified
				</Badge>
			</div>
		);
	};

	return (
		<div className={cn("space-y-2", className)}>
			{label && (
				<Label htmlFor="address-input">
					{label}
					{required && <span className="text-destructive ml-1">*</span>}
				</Label>
			)}

			<div className="relative">
				<div className="relative flex items-center">
					<MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
					<Input
						id="address-input"
						value={inputValue}
						onChange={handleInputChange}
						onBlur={handleBlur}
						placeholder={placeholder}
						disabled={disabled}
						className="pl-9 pr-24"
					/>
					<div className="absolute right-3 flex items-center gap-2">
						{renderValidationStatus()}
					</div>
				</div>

				{/* Suggestion Banner */}
				{showSuggestion && validationResult?.formattedAddress && (
					<div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-md">
						<div className="flex items-start justify-between gap-2">
							<div className="flex-1">
								<p className="text-sm font-medium text-blue-800 dark:text-blue-200">
									Suggested Address
								</p>
								<p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
									{validationResult.formattedAddress}
								</p>
								{validationResult.corrections.length > 0 && (
									<p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
										Corrections: {validationResult.corrections.join(", ")}
									</p>
								)}
							</div>
							<div className="flex gap-1">
								<Button
									size="sm"
									variant="ghost"
									className="h-7 text-blue-700 hover:text-blue-800 hover:bg-blue-100"
									onClick={acceptSuggestion}
								>
									<Check className="h-4 w-4" />
								</Button>
								<Button
									size="sm"
									variant="ghost"
									className="h-7 text-blue-700 hover:text-blue-800 hover:bg-blue-100"
									onClick={dismissSuggestion}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				)}

				{/* Warnings */}
				{validationResult?.warnings && validationResult.warnings.length > 0 && (
					<div className="mt-2 text-xs text-amber-600 space-y-1">
						{validationResult.warnings.map((warning, i) => (
							<p key={i} className="flex items-center gap-1">
								<AlertTriangle className="h-3 w-3" />
								{warning}
							</p>
						))}
					</div>
				)}

				{/* Geocode Info (optional debug) */}
				{validationResult?.geocode && validationResult.isValid && (
					<div className="mt-1 text-xs text-muted-foreground">
						{validationResult.usps?.county && (
							<span>{validationResult.usps.county} County • </span>
						)}
						<span>
							{validationResult.geocode.lat.toFixed(4)},{" "}
							{validationResult.geocode.lng.toFixed(4)}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * Structured Address Form
 * For when you need separate fields for each component
 */
interface StructuredAddressFormProps {
	value?: {
		address1: string;
		address2?: string;
		city: string;
		state: string;
		zip: string;
	};
	onChange?: (value: {
		address1: string;
		address2?: string;
		city: string;
		state: string;
		zip: string;
		lat?: number;
		lng?: number;
		validated?: boolean;
	}) => void;
	disabled?: boolean;
	className?: string;
}

export function StructuredAddressForm({
	value = { address1: "", city: "", state: "", zip: "" },
	onChange,
	disabled = false,
	className,
}: StructuredAddressFormProps) {
	const [address1, setAddress1] = useState(value.address1);
	const [address2, setAddress2] = useState(value.address2 || "");
	const [city, setCity] = useState(value.city);
	const [state, setState] = useState(value.state);
	const [zip, setZip] = useState(value.zip);
	const [isValidating, setIsValidating] = useState(false);
	const [isValid, setIsValid] = useState<boolean | null>(null);

	// Validate full address
	const validateFullAddress = async () => {
		if (!address1 || !city || !state || !zip) return;

		setIsValidating(true);

		try {
			const fullAddress = `${address1}, ${city}, ${state} ${zip}`;
			const response = await fetch("/api/address/validate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					structured: {
						addressLines: address2 ? [address1, address2] : [address1],
						city,
						state,
						postalCode: zip,
					},
				}),
			});

			if (!response.ok) throw new Error("Validation failed");

			const result: ValidationResult = await response.json();
			setIsValid(result.isValid);

			// Auto-fill with standardized values
			if (result.isValid && result.usps?.standardized) {
				const std = result.usps.standardized;
				if (std.firstAddressLine) setAddress1(std.firstAddressLine);
				if (std.city) setCity(std.city);
				if (std.state) setState(std.state);
				if (std.zipCode)
					setZip(
						std.zipCodeExtension
							? `${std.zipCode}-${std.zipCodeExtension}`
							: std.zipCode,
					);
			}

			onChange?.({
				address1: result.usps?.standardized?.firstAddressLine || address1,
				address2: address2 || undefined,
				city: result.usps?.standardized?.city || city,
				state: result.usps?.standardized?.state || state,
				zip: result.usps?.standardized?.zipCode || zip,
				lat: result.geocode?.lat,
				lng: result.geocode?.lng,
				validated: result.isValid,
			});
		} catch (error) {
			console.error("Validation error:", error);
			setIsValid(false);
		} finally {
			setIsValidating(false);
		}
	};

	return (
		<div className={cn("space-y-4", className)}>
			<div className="space-y-2">
				<Label htmlFor="address1">Street Address</Label>
				<Input
					id="address1"
					value={address1}
					onChange={(e) => setAddress1(e.target.value)}
					placeholder="123 Main St"
					disabled={disabled}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="address2">Apt, Suite, Unit (optional)</Label>
				<Input
					id="address2"
					value={address2}
					onChange={(e) => setAddress2(e.target.value)}
					placeholder="Apt 4B"
					disabled={disabled}
				/>
			</div>

			<div className="grid grid-cols-6 gap-4">
				<div className="col-span-3 space-y-2">
					<Label htmlFor="city">City</Label>
					<Input
						id="city"
						value={city}
						onChange={(e) => setCity(e.target.value)}
						placeholder="City"
						disabled={disabled}
					/>
				</div>

				<div className="col-span-1 space-y-2">
					<Label htmlFor="state">State</Label>
					<Input
						id="state"
						value={state}
						onChange={(e) => setState(e.target.value.toUpperCase())}
						placeholder="FL"
						maxLength={2}
						disabled={disabled}
					/>
				</div>

				<div className="col-span-2 space-y-2">
					<Label htmlFor="zip">ZIP Code</Label>
					<Input
						id="zip"
						value={zip}
						onChange={(e) => setZip(e.target.value)}
						placeholder="12345"
						disabled={disabled}
					/>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{isValid === true && (
						<Badge variant="outline" className="text-green-600">
							<Check className="h-3 w-3 mr-1" />
							Address Verified
						</Badge>
					)}
					{isValid === false && (
						<Badge variant="outline" className="text-amber-600">
							<AlertTriangle className="h-3 w-3 mr-1" />
							Could not verify
						</Badge>
					)}
				</div>

				<Button
					variant="outline"
					size="sm"
					onClick={validateFullAddress}
					disabled={
						disabled || isValidating || !address1 || !city || !state || !zip
					}
				>
					{isValidating ? (
						<>
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							Validating...
						</>
					) : (
						<>
							<Check className="h-4 w-4 mr-2" />
							Verify Address
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
