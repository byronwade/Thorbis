"use client";

import { Loader2, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { createProperty, getCustomerProperties } from "@/actions/properties";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/**
 * AddPropertyDialog - Client Component
 *
 * Client-side features:
 * - Dialog state management
 * - Form submission handling
 * - Property creation for customers
 *
 * Usage:
 * - Embedded in JobForm when no properties exist for selected customer
 * - Can also be used standalone in customer detail pages
 */

type AddPropertyDialogProps = {
	customerId: string;
	onPropertyCreated?: (propertyId: string, propertyData: any) => void;
	trigger?: React.ReactNode;
	customerAddress?: {
		address?: string;
		city?: string;
		state?: string;
		zip_code?: string;
	};
};

export function AddPropertyDialog({
	customerId,
	onPropertyCreated,
	trigger,
	customerAddress,
}: AddPropertyDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(event.currentTarget);
		formData.set("customerId", customerId); // Ensure customerId is set

		const result = await createProperty(formData);

		if (!result.success) {
			setError(result.error || "Failed to create property");
			setIsLoading(false);
			return;
		}

		// Fetch the newly created property details
		const propertiesResult = await getCustomerProperties(customerId);

		if (propertiesResult.success && propertiesResult.data) {
			// Find the newly created property
			const newProperty = propertiesResult.data.find(
				(p) => p.id === result.data,
			);

			if (newProperty) {
				// Notify parent component with full property data
				onPropertyCreated?.(result.data, newProperty);
			}
		}

		setOpen(false);
		setIsLoading(false);
		// Reset form
		event.currentTarget.reset();
	}

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				{trigger || (
					<Button size="sm" type="button" variant="outline">
						<Plus className="mr-2 size-4" />
						Add Property
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
				<DialogHeader>
					<div className="flex items-center gap-2">
						<MapPin className="size-5 text-primary" />
						<DialogTitle>Add New Property</DialogTitle>
					</div>
					<DialogDescription>
						Add a new service location for this customer. All fields marked with
						* are required.
						{customerAddress?.address && (
							<span className="mt-2 block font-medium text-success">
								✓ Address fields pre-filled from customer profile
							</span>
						)}
					</DialogDescription>
				</DialogHeader>

				<form className="space-y-4" key={customerId} onSubmit={handleSubmit}>
					{/* Error Display */}
					{error && (
						<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
							<p className="text-destructive text-sm">{error}</p>
						</div>
					)}

					{/* Property Name */}
					<div className="space-y-2">
						<Label htmlFor="name">Property Name *</Label>
						<Input
							defaultValue={
								customerAddress?.address ? "Primary Location" : undefined
							}
							disabled={isLoading}
							id="name"
							name="name"
							placeholder="e.g., Main Office, Home, Warehouse #1"
							required
						/>
						<p className="text-muted-foreground text-xs">
							A friendly name to identify this location
						</p>
					</div>

					{/* Address */}
					<div className="space-y-2">
						<Label htmlFor="address">Street Address *</Label>
						<Input
							defaultValue={customerAddress?.address}
							disabled={isLoading}
							id="address"
							name="address"
							placeholder="123 Main Street"
							required
						/>
						{customerAddress?.address && (
							<p className="text-muted-foreground text-xs">
								Pre-filled from customer profile
							</p>
						)}
					</div>

					{/* Address Line 2 */}
					<div className="space-y-2">
						<Label htmlFor="address2">Address Line 2 (Optional)</Label>
						<Input
							disabled={isLoading}
							id="address2"
							name="address2"
							placeholder="Suite 100, Apt 4B, etc."
						/>
					</div>

					{/* City, State, ZIP */}
					<div className="grid gap-4 md:grid-cols-3">
						<div className="space-y-2">
							<Label htmlFor="city">City *</Label>
							<Input
								defaultValue={customerAddress?.city}
								disabled={isLoading}
								id="city"
								name="city"
								placeholder="San Francisco"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="state">State *</Label>
							<Input
								defaultValue={customerAddress?.state}
								disabled={isLoading}
								id="state"
								maxLength={2}
								name="state"
								placeholder="CA"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="zipCode">ZIP Code *</Label>
							<Input
								defaultValue={customerAddress?.zip_code}
								disabled={isLoading}
								id="zipCode"
								name="zipCode"
								placeholder="94102"
								required
							/>
						</div>
					</div>

					{/* Property Type */}
					<div className="space-y-2">
						<Label htmlFor="propertyType">Property Type</Label>
						<Select disabled={isLoading} name="propertyType">
							<SelectTrigger id="propertyType">
								<SelectValue placeholder="Select property type (optional)" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="residential">Residential</SelectItem>
								<SelectItem value="commercial">Commercial</SelectItem>
								<SelectItem value="industrial">Industrial</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Square Footage & Year Built */}
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="squareFootage">Square Footage</Label>
							<Input
								disabled={isLoading}
								id="squareFootage"
								min="0"
								name="squareFootage"
								placeholder="2500"
								type="number"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="yearBuilt">Year Built</Label>
							<Input
								disabled={isLoading}
								id="yearBuilt"
								max={new Date().getFullYear() + 5}
								min="1800"
								name="yearBuilt"
								placeholder="2010"
								type="number"
							/>
						</div>
					</div>

					{/* Notes */}
					<div className="space-y-2">
						<Label htmlFor="notes">Notes</Label>
						<Textarea
							disabled={isLoading}
							id="notes"
							name="notes"
							placeholder="Any additional information about this property..."
							rows={3}
						/>
					</div>

					{/* Form Actions */}
					<div className="flex justify-end gap-3 pt-4">
						<Button
							disabled={isLoading}
							onClick={() => setOpen(false)}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
						<Button disabled={isLoading} type="submit">
							{isLoading ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Creating...
								</>
							) : (
								<>
									<Plus className="mr-2 size-4" />
									Create Property
								</>
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
