"use client";

import { Building2, Home, MapPin, Package, Plus, Star, Trash2, Truck, X } from "lucide-react";
import { useState } from "react";
import { addCustomerAddress, deleteCustomerAddress, updateCustomerAddress } from "@/actions/customer-enhancements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

/**
 * Customer Addresses Manager - Client Component
 *
 * Manages multiple addresses per customer:
 * - Billing, shipping, service, mailing addresses
 * - Default address per type
 * - Directions and access notes
 * - Gate codes and parking instructions
 */

type Address = {
	id: string;
	address_type: string;
	is_default: boolean;
	label?: string;
	address_line1: string;
	address_line2?: string;
	city: string;
	state: string;
	zip_code: string;
	country: string;
	directions?: string;
	access_notes?: string;
	parking_instructions?: string;
	gate_code?: string;
};

type CustomerAddressesManagerProps = {
	customerId: string;
	initialAddresses?: Address[];
};

const ADDRESS_TYPE_ICONS = {
	billing: Building2,
	shipping: Truck,
	service: Home,
	mailing: Package,
	other: MapPin,
};

const ADDRESS_TYPE_COLORS = {
	billing: "bg-primary text-primary dark:bg-primary dark:text-primary",
	shipping: "bg-success text-success dark:bg-success dark:text-success",
	service: "bg-accent text-accent-foreground dark:bg-accent dark:text-accent-foreground",
	mailing: "bg-warning text-warning dark:bg-warning dark:text-warning",
	other: "bg-muted text-foreground dark:bg-foreground dark:text-muted-foreground",
};

export function CustomerAddressesManager({ customerId, initialAddresses = [] }: CustomerAddressesManagerProps) {
	const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
	const [showAddForm, setShowAddForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const [formData, setFormData] = useState({
		addressType: "service" as const,
		isDefault: false,
		label: "",
		addressLine1: "",
		addressLine2: "",
		city: "",
		state: "",
		zipCode: "",
		country: "USA",
		directions: "",
		accessNotes: "",
		parkingInstructions: "",
		gateCode: "",
	});

	const resetForm = () => {
		setFormData({
			addressType: "service",
			isDefault: false,
			label: "",
			addressLine1: "",
			addressLine2: "",
			city: "",
			state: "",
			zipCode: "",
			country: "USA",
			directions: "",
			accessNotes: "",
			parkingInstructions: "",
			gateCode: "",
		});
		setShowAddForm(false);
		setEditingId(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const formDataObj = new FormData();
			formDataObj.set("customerId", customerId);
			formDataObj.set("addressType", formData.addressType);
			formDataObj.set("isDefault", formData.isDefault ? "true" : "false");
			formDataObj.set("label", formData.label);
			formDataObj.set("addressLine1", formData.addressLine1);
			formDataObj.set("addressLine2", formData.addressLine2);
			formDataObj.set("city", formData.city);
			formDataObj.set("state", formData.state);
			formDataObj.set("zipCode", formData.zipCode);
			formDataObj.set("country", formData.country);
			formDataObj.set("directions", formData.directions);
			formDataObj.set("accessNotes", formData.accessNotes);
			formDataObj.set("parkingInstructions", formData.parkingInstructions);
			formDataObj.set("gateCode", formData.gateCode);

			if (editingId) {
				const result = await updateCustomerAddress(editingId, formDataObj);
				if (result.success) {
					setAddresses(
						addresses.map((a) =>
							a.id === editingId
								? {
										...a,
										address_type: formData.addressType,
										is_default: formData.isDefault,
										label: formData.label,
										address_line1: formData.addressLine1,
										address_line2: formData.addressLine2,
										city: formData.city,
										state: formData.state,
										zip_code: formData.zipCode,
										country: formData.country,
										directions: formData.directions,
										access_notes: formData.accessNotes,
										parking_instructions: formData.parkingInstructions,
										gate_code: formData.gateCode,
									}
								: a
						)
					);
					resetForm();
				} else {
					alert(result.error || "Failed to update address");
				}
			} else {
				const result = await addCustomerAddress(formDataObj);
				if (result.success) {
					const newAddress: Address = {
						id: result.data,
						address_type: formData.addressType,
						is_default: formData.isDefault,
						label: formData.label,
						address_line1: formData.addressLine1,
						address_line2: formData.addressLine2,
						city: formData.city,
						state: formData.state,
						zip_code: formData.zipCode,
						country: formData.country,
						directions: formData.directions,
						access_notes: formData.accessNotes,
						parking_instructions: formData.parkingInstructions,
						gate_code: formData.gateCode,
					};
					setAddresses([...addresses, newAddress]);
					resetForm();
				} else {
					alert(result.error || "Failed to add address");
				}
			}
		} catch (_error) {
			alert("An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (address: Address) => {
		setFormData({
			addressType: address.address_type as any,
			isDefault: address.is_default,
			label: address.label || "",
			addressLine1: address.address_line1,
			addressLine2: address.address_line2 || "",
			city: address.city,
			state: address.state,
			zipCode: address.zip_code,
			country: address.country,
			directions: address.directions || "",
			accessNotes: address.access_notes || "",
			parkingInstructions: address.parking_instructions || "",
			gateCode: address.gate_code || "",
		});
		setEditingId(address.id);
		setShowAddForm(true);
	};

	const handleDelete = async (addressId: string) => {
		if (!confirm("Are you sure you want to delete this address?")) {
			return;
		}

		setIsLoading(true);
		try {
			const result = await deleteCustomerAddress(addressId);
			if (result.success) {
				setAddresses(addresses.filter((a) => a.id !== addressId));
			} else {
				alert(result.error || "Failed to delete address");
			}
		} catch (_error) {
			alert("An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const getTypeIcon = (type: string) => {
		const Icon = ADDRESS_TYPE_ICONS[type as keyof typeof ADDRESS_TYPE_ICONS] || MapPin;
		return Icon;
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<MapPin className="size-5 text-primary" />
						<CardTitle>Addresses</CardTitle>
					</div>
					<Badge variant="secondary">
						{addresses.length} address{addresses.length !== 1 ? "es" : ""}
					</Badge>
				</div>
				<CardDescription>Manage billing, shipping, and service locations</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Existing Addresses */}
				{addresses.map((address) => {
					const TypeIcon = getTypeIcon(address.address_type);
					return (
						<div className="rounded-lg border bg-muted/50 p-4" key={address.id}>
							<div className="flex items-start justify-between gap-3">
								<div className="flex flex-1 items-start gap-3">
									<TypeIcon className="mt-0.5 size-5 text-muted-foreground" />

									<div className="flex-1 space-y-1">
										<div className="flex items-center gap-2">
											{address.label && <p className="font-semibold">{address.label}</p>}
											<Badge
												className={`text-xs capitalize ${
													ADDRESS_TYPE_COLORS[address.address_type as keyof typeof ADDRESS_TYPE_COLORS]
												}`}
												variant="outline"
											>
												{address.address_type}
											</Badge>
											{address.is_default && (
												<Badge className="text-xs" variant="default">
													<Star className="mr-1 size-3" />
													Default
												</Badge>
											)}
										</div>

										<p className="text-sm">
											{address.address_line1}
											{address.address_line2 && `, ${address.address_line2}`}
										</p>
										<p className="text-muted-foreground text-sm">
											{address.city}, {address.state} {address.zip_code}
										</p>

										{address.directions && (
											<p className="text-muted-foreground text-xs">
												<strong>Directions:</strong> {address.directions}
											</p>
										)}

										{address.gate_code && (
											<p className="text-muted-foreground text-xs">
												<strong>Gate Code:</strong> {address.gate_code}
											</p>
										)}

										{address.parking_instructions && (
											<p className="text-muted-foreground text-xs">
												<strong>Parking:</strong> {address.parking_instructions}
											</p>
										)}
									</div>
								</div>

								{/* Actions */}
								<div className="flex gap-1">
									<Button
										className="h-8 px-2 text-xs"
										disabled={isLoading}
										onClick={() => handleEdit(address)}
										size="sm"
										type="button"
										variant="ghost"
									>
										Edit
									</Button>
									<Button
										className="h-8 w-8 p-0 text-destructive hover:text-destructive"
										disabled={isLoading}
										onClick={() => handleDelete(address.id)}
										size="sm"
										type="button"
										variant="ghost"
									>
										<Trash2 className="size-4" />
									</Button>
								</div>
							</div>
						</div>
					);
				})}

				{/* Add/Edit Form */}
				{showAddForm ? (
					<form className="space-y-4 rounded-lg border bg-card p-4" onSubmit={handleSubmit}>
						<div className="flex items-center justify-between">
							<h4 className="font-semibold text-sm">{editingId ? "Edit Address" : "Add New Address"}</h4>
							<Button className="h-8 w-8 p-0" onClick={resetForm} size="sm" type="button" variant="ghost">
								<X className="size-4" />
							</Button>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs" htmlFor="addressType">
									Address Type *
								</Label>
								<Select
									onValueChange={(value: any) => setFormData({ ...formData, addressType: value })}
									value={formData.addressType}
								>
									<SelectTrigger className="h-9" id="addressType">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="billing">Billing</SelectItem>
										<SelectItem value="shipping">Shipping</SelectItem>
										<SelectItem value="service">Service</SelectItem>
										<SelectItem value="mailing">Mailing</SelectItem>
										<SelectItem value="other">Other</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs" htmlFor="label">
									Label
								</Label>
								<Input
									className="h-9"
									id="label"
									onChange={(e) => setFormData({ ...formData, label: e.target.value })}
									placeholder="Main Office, Warehouse, etc."
									value={formData.label}
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label className="text-xs" htmlFor="addressLine1">
								Street Address *
							</Label>
							<Input
								className="h-9"
								id="addressLine1"
								onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
								placeholder="123 Main St"
								required
								value={formData.addressLine1}
							/>
						</div>

						<div className="space-y-1.5">
							<Label className="text-xs" htmlFor="addressLine2">
								Apt, Suite, Unit
							</Label>
							<Input
								className="h-9"
								id="addressLine2"
								onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
								placeholder="Suite 100"
								value={formData.addressLine2}
							/>
						</div>

						<div className="grid grid-cols-3 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs" htmlFor="city">
									City *
								</Label>
								<Input
									className="h-9"
									id="city"
									onChange={(e) => setFormData({ ...formData, city: e.target.value })}
									required
									value={formData.city}
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs" htmlFor="state">
									State *
								</Label>
								<Input
									className="h-9"
									id="state"
									maxLength={2}
									onChange={(e) => setFormData({ ...formData, state: e.target.value })}
									placeholder="CA"
									required
									value={formData.state}
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs" htmlFor="zipCode">
									ZIP *
								</Label>
								<Input
									className="h-9"
									id="zipCode"
									onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
									required
									value={formData.zipCode}
								/>
							</div>
						</div>

						{/* Service-specific fields */}
						{formData.addressType === "service" && (
							<>
								<div className="space-y-1.5">
									<Label className="text-xs" htmlFor="directions">
										Directions
									</Label>
									<Textarea
										className="text-sm"
										id="directions"
										onChange={(e) => setFormData({ ...formData, directions: e.target.value })}
										placeholder="Turn left after the red barn, driveway on right..."
										rows={2}
										value={formData.directions}
									/>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-1.5">
										<Label className="text-xs" htmlFor="gateCode">
											Gate Code
										</Label>
										<Input
											className="h-9"
											id="gateCode"
											onChange={(e) => setFormData({ ...formData, gateCode: e.target.value })}
											placeholder="#1234"
											value={formData.gateCode}
										/>
									</div>
									<div className="space-y-1.5">
										<Label className="text-xs" htmlFor="parking">
											Parking
										</Label>
										<Input
											className="h-9"
											id="parking"
											onChange={(e) =>
												setFormData({
													...formData,
													parkingInstructions: e.target.value,
												})
											}
											placeholder="Park in driveway"
											value={formData.parkingInstructions}
										/>
									</div>
								</div>

								<div className="space-y-1.5">
									<Label className="text-xs" htmlFor="accessNotes">
										Access Notes
									</Label>
									<Textarea
										className="text-sm"
										id="accessNotes"
										onChange={(e) => setFormData({ ...formData, accessNotes: e.target.value })}
										placeholder="Use side entrance, call before arrival, etc."
										rows={2}
										value={formData.accessNotes}
									/>
								</div>
							</>
						)}

						<div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
							<Label className="text-xs" htmlFor="isDefault">
								Set as default {formData.addressType} address
							</Label>
							<Switch
								checked={formData.isDefault}
								id="isDefault"
								onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
							/>
						</div>

						<div className="flex gap-2">
							<Button className="flex-1" disabled={isLoading} size="sm" type="submit">
								{isLoading ? "Saving..." : editingId ? "Update Address" : "Add Address"}
							</Button>
							<Button disabled={isLoading} onClick={resetForm} size="sm" type="button" variant="ghost">
								Cancel
							</Button>
						</div>
					</form>
				) : (
					<Button className="w-full" onClick={() => setShowAddForm(true)} size="sm" type="button" variant="outline">
						<Plus className="mr-2 size-4" />
						Add Address
					</Button>
				)}

				{addresses.length === 0 && !showAddForm && (
					<div className="py-6 text-center">
						<MapPin className="mx-auto mb-2 size-8 text-muted-foreground opacity-50" />
						<p className="text-muted-foreground text-sm">No addresses added yet</p>
						<p className="text-muted-foreground text-xs">Add billing, shipping, or service addresses</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
