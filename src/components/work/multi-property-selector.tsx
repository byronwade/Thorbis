"use client";

import { Building2, MapPin, Plus, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
 * Multi-Property Selector - Client Component
 *
 * Allows selecting multiple properties for a job:
 * - Primary service location
 * - Secondary/related properties
 * - Work scope per property
 * - Estimated hours per property
 *
 * Use case: Jobs that span multiple locations (e.g., apartment complex, multiple storefronts)
 */

type Property = {
	id: string;
	name?: string;
	address: string;
	city: string;
	state: string;
	customer_id: string;
};

type SelectedProperty = {
	id: string;
	property: Property;
	role: "primary" | "secondary" | "related";
	isPrimary: boolean;
	workDescription?: string;
	estimatedHours?: number;
};

type MultiPropertySelectorProps = {
	properties: Property[];
	customerId?: string;
	initialSelected?: SelectedProperty[];
	onChange?: (selected: SelectedProperty[]) => void;
};

export function MultiPropertySelector({
	properties,
	customerId,
	initialSelected = [],
	onChange,
}: MultiPropertySelectorProps) {
	const [selectedProperties, setSelectedProperties] =
		useState<SelectedProperty[]>(initialSelected);
	const [showAddProperty, setShowAddProperty] = useState(
		initialSelected.length === 0,
	);

	// Filter properties by customer if provided
	const filteredProperties = customerId
		? properties.filter((p) => p.customer_id === customerId)
		: properties;

	const addProperty = (propertyId: string) => {
		const property = filteredProperties.find((p) => p.id === propertyId);
		if (!property) {
			return;
		}

		// Check if already added
		if (selectedProperties.some((sp) => sp.id === propertyId)) {
			return;
		}

		const newProperty: SelectedProperty = {
			id: propertyId,
			property,
			role: selectedProperties.length === 0 ? "primary" : "secondary",
			isPrimary: selectedProperties.length === 0,
		};

		const updated = [...selectedProperties, newProperty];
		setSelectedProperties(updated);
		onChange?.(updated);
		setShowAddProperty(false);
	};

	const removeProperty = (propertyId: string) => {
		const updated = selectedProperties.filter((sp) => sp.id !== propertyId);

		// If removing primary, set first remaining as primary
		if (updated.length > 0 && !updated.some((sp) => sp.isPrimary)) {
			updated[0].isPrimary = true;
			updated[0].role = "primary";
		}

		setSelectedProperties(updated);
		onChange?.(updated);
	};

	const setPrimary = (propertyId: string) => {
		const updated = selectedProperties.map((sp) => ({
			...sp,
			isPrimary: sp.id === propertyId,
			role: sp.id === propertyId ? ("primary" as const) : sp.role,
		}));

		setSelectedProperties(updated);
		onChange?.(updated);
	};

	const updatePropertyRole = (
		propertyId: string,
		role: SelectedProperty["role"],
	) => {
		const updated = selectedProperties.map((sp) =>
			sp.id === propertyId ? { ...sp, role } : sp,
		);

		setSelectedProperties(updated);
		onChange?.(updated);
	};

	const updateWorkDescription = (propertyId: string, description: string) => {
		const updated = selectedProperties.map((sp) =>
			sp.id === propertyId ? { ...sp, workDescription: description } : sp,
		);

		setSelectedProperties(updated);
		onChange?.(updated);
	};

	const updateEstimatedHours = (propertyId: string, hours: number) => {
		const updated = selectedProperties.map((sp) =>
			sp.id === propertyId ? { ...sp, estimatedHours: hours } : sp,
		);

		setSelectedProperties(updated);
		onChange?.(updated);
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Building2 className="text-primary size-5" />
						<CardTitle>Service Locations</CardTitle>
					</div>
					<Badge variant="secondary">
						{selectedProperties.length} location
						{selectedProperties.length !== 1 ? "s" : ""}
					</Badge>
				</div>
				<CardDescription>
					Add multiple properties if job spans multiple locations
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Selected Properties */}
				{selectedProperties.map((selected) => (
					<div className="bg-muted/50 rounded-lg border p-4" key={selected.id}>
						<div className="space-y-3">
							{/* Property Header */}
							<div className="flex items-start justify-between gap-3">
								<div className="flex flex-1 items-start gap-3">
									<MapPin
										className={`mt-1 size-5 ${selected.isPrimary ? "text-primary" : "text-muted-foreground"}`}
									/>

									<div className="flex-1">
										<div className="flex items-center gap-2">
											<p className="font-semibold">
												{selected.property.name || selected.property.address}
											</p>
											{selected.isPrimary && (
												<Badge className="text-xs" variant="default">
													<Star className="mr-1 size-3" />
													Primary
												</Badge>
											)}
										</div>

										<p className="text-muted-foreground mt-1 text-sm">
											{selected.property.address}, {selected.property.city},{" "}
											{selected.property.state}
										</p>
									</div>
								</div>

								{/* Actions */}
								<div className="flex gap-1">
									{!selected.isPrimary && (
										<Button
											className="h-8 w-8 p-0"
											onClick={() => setPrimary(selected.id)}
											size="sm"
											type="button"
											variant="ghost"
										>
											<Star className="size-4" />
										</Button>
									)}
									{selectedProperties.length > 1 && (
										<Button
											className="text-destructive hover:text-destructive h-8 w-8 p-0"
											onClick={() => removeProperty(selected.id)}
											size="sm"
											type="button"
											variant="ghost"
										>
											<Trash2 className="size-4" />
										</Button>
									)}
								</div>
							</div>

							{/* Property Details */}
							<div className="grid gap-3 md:grid-cols-2">
								<div className="space-y-1.5">
									<Label
										className="text-xs"
										htmlFor={`property-role-${selected.id}`}
									>
										Property Role
									</Label>
									<Select
										onValueChange={(value: any) =>
											updatePropertyRole(selected.id, value)
										}
										value={selected.role}
									>
										<SelectTrigger
											className="h-9"
											id={`property-role-${selected.id}`}
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="primary">Primary Location</SelectItem>
											<SelectItem value="secondary">
												Secondary Location
											</SelectItem>
											<SelectItem value="related">Related Property</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-1.5">
									<Label className="text-xs" htmlFor={`hours-${selected.id}`}>
										Est. Hours
									</Label>
									<Input
										className="h-9"
										id={`hours-${selected.id}`}
										min="0"
										onChange={(e) =>
											updateEstimatedHours(
												selected.id,
												Number.parseFloat(e.target.value),
											)
										}
										placeholder="0"
										step="0.5"
										type="number"
										value={selected.estimatedHours || ""}
									/>
								</div>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs" htmlFor={`work-${selected.id}`}>
									Work Scope at This Location
								</Label>
								<Textarea
									className="text-sm"
									id={`work-${selected.id}`}
									onChange={(e) =>
										updateWorkDescription(selected.id, e.target.value)
									}
									placeholder="Describe work to be performed at this property..."
									rows={2}
									value={selected.workDescription || ""}
								/>
							</div>
						</div>

						{/* Hidden inputs for form submission */}
						<input
							name={`property_${selected.id}_role`}
							type="hidden"
							value={selected.role}
						/>
						<input
							name={`property_${selected.id}_isPrimary`}
							type="hidden"
							value={selected.isPrimary ? "true" : "false"}
						/>
						<input
							name={`property_${selected.id}_workDescription`}
							type="hidden"
							value={selected.workDescription || ""}
						/>
						<input
							name={`property_${selected.id}_estimatedHours`}
							type="hidden"
							value={selected.estimatedHours || 0}
						/>
					</div>
				))}

				{/* Add Property */}
				{showAddProperty ? (
					<div className="space-y-3 rounded-lg border border-dashed p-4">
						<div className="flex items-center justify-between">
							<Label>Add Service Location</Label>
							<Button
								className="h-8 w-8 p-0"
								onClick={() => setShowAddProperty(false)}
								size="sm"
								type="button"
								variant="ghost"
							>
								<X className="size-4" />
							</Button>
						</div>

						<Select onValueChange={addProperty}>
							<SelectTrigger>
								<SelectValue placeholder="Select a property..." />
							</SelectTrigger>
							<SelectContent>
								{filteredProperties
									.filter(
										(p) => !selectedProperties.some((sp) => sp.id === p.id),
									)
									.map((property) => (
										<SelectItem key={property.id} value={property.id}>
											{property.name || property.address} - {property.city},{" "}
											{property.state}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>
				) : (
					<Button
						className="w-full"
						disabled={!customerId}
						onClick={() => setShowAddProperty(true)}
						size="sm"
						type="button"
						variant="outline"
					>
						<Plus className="mr-2 size-4" />
						Add Another Location
					</Button>
				)}

				{!customerId && (
					<p className="text-muted-foreground text-xs">
						Select a customer first to add properties
					</p>
				)}

				{/* Hidden inputs for property IDs */}
				<input
					name="propertyIds"
					type="hidden"
					value={selectedProperties.map((sp) => sp.id).join(",")}
				/>
				<input
					name="primaryPropertyId"
					type="hidden"
					value={selectedProperties.find((sp) => sp.isPrimary)?.id || ""}
				/>
			</CardContent>
		</Card>
	);
}
