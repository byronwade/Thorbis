"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createVendor, updateVendor } from "@/actions/vendors";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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

type VendorFormData = {
	name: string;
	display_name: string;
	vendor_number: string;
	email: string;
	phone: string;
	secondary_phone: string;
	website: string;
	address: string;
	address2: string;
	city: string;
	state: string;
	zip_code: string;
	country: string;
	tax_id: string;
	payment_terms: string;
	credit_limit: string;
	preferred_payment_method: string;
	category: string;
	status: "active" | "inactive";
	notes: string;
	internal_notes: string;
};

type VendorFormProps = {
	vendor?: {
		id: string;
		name: string;
		display_name: string;
		vendor_number: string;
		email: string | null;
		phone: string | null;
		secondary_phone: string | null;
		website: string | null;
		address: string | null;
		address2: string | null;
		city: string | null;
		state: string | null;
		zip_code: string | null;
		country: string | null;
		tax_id: string | null;
		payment_terms: string | null;
		credit_limit: number | null;
		preferred_payment_method: string | null;
		category: string | null;
		status: "active" | "inactive";
		notes: string | null;
		internal_notes: string | null;
	};
	mode?: "create" | "edit";
};

export function VendorForm({ vendor, mode = "create" }: VendorFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<VendorFormData>({
		name: vendor?.name || "",
		display_name: vendor?.display_name || "",
		vendor_number: vendor?.vendor_number || "",
		email: vendor?.email || "",
		phone: vendor?.phone || "",
		secondary_phone: vendor?.secondary_phone || "",
		website: vendor?.website || "",
		address: vendor?.address || "",
		address2: vendor?.address2 || "",
		city: vendor?.city || "",
		state: vendor?.state || "",
		zip_code: vendor?.zip_code || "",
		country: vendor?.country || "USA",
		tax_id: vendor?.tax_id || "",
		payment_terms: vendor?.payment_terms || "net_30",
		credit_limit: vendor?.credit_limit
			? (vendor.credit_limit / 100).toString()
			: "0",
		preferred_payment_method: vendor?.preferred_payment_method || "",
		category: vendor?.category || "",
		status: vendor?.status || "active",
		notes: vendor?.notes || "",
		internal_notes: vendor?.internal_notes || "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		// Client-side validation
		if (!formData.name.trim()) {
			setError("Vendor name is required");
			setIsLoading(false);
			return;
		}

		if (!formData.display_name.trim()) {
			setError("Display name is required");
			setIsLoading(false);
			return;
		}

		// Create FormData for server action
		const serverFormData = new FormData();
		serverFormData.append("name", formData.name);
		serverFormData.append("display_name", formData.display_name);
		if (mode === "create" || formData.vendor_number) {
			serverFormData.append("vendor_number", formData.vendor_number);
		}
		if (formData.email) {
			serverFormData.append("email", formData.email);
		}
		if (formData.phone) {
			serverFormData.append("phone", formData.phone);
		}
		if (formData.secondary_phone) {
			serverFormData.append("secondary_phone", formData.secondary_phone);
		}
		if (formData.website) {
			serverFormData.append("website", formData.website);
		}
		if (formData.address) {
			serverFormData.append("address", formData.address);
		}
		if (formData.address2) {
			serverFormData.append("address2", formData.address2);
		}
		if (formData.city) {
			serverFormData.append("city", formData.city);
		}
		if (formData.state) {
			serverFormData.append("state", formData.state);
		}
		if (formData.zip_code) {
			serverFormData.append("zip_code", formData.zip_code);
		}
		if (formData.country) {
			serverFormData.append("country", formData.country);
		}
		if (formData.tax_id) {
			serverFormData.append("tax_id", formData.tax_id);
		}
		if (formData.payment_terms) {
			serverFormData.append("payment_terms", formData.payment_terms);
		}
		if (formData.credit_limit) {
			serverFormData.append("credit_limit", formData.credit_limit);
		}
		if (formData.preferred_payment_method) {
			serverFormData.append(
				"preferred_payment_method",
				formData.preferred_payment_method,
			);
		}
		if (formData.category) {
			serverFormData.append("category", formData.category);
		}
		serverFormData.append("status", formData.status);
		if (formData.notes) {
			serverFormData.append("notes", formData.notes);
		}
		if (formData.internal_notes) {
			serverFormData.append("internal_notes", formData.internal_notes);
		}

		try {
			const result =
				mode === "create"
					? await createVendor(serverFormData)
					: vendor
						? await updateVendor(vendor.id, serverFormData)
						: { success: false, error: "Vendor ID required for edit" };

			if (result.success) {
				const vendorId = "data" in result ? result.data : vendor?.id;
				router.push(`/dashboard/inventory/vendors/${vendorId}`);
				// Server Action handles revalidation automatically
			} else {
				setError(result.error || "Failed to save vendor");
				setIsLoading(false);
			}
		} catch (_err) {
			setError("An unexpected error occurred. Please try again.");
			setIsLoading(false);
		}
	};

	return (
		<form className="space-y-6" onSubmit={handleSubmit}>
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Basic Information */}
			<div className="space-y-4">
				<h3 className="font-medium text-lg">Basic Information</h3>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="name">
							Vendor Name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="name"
							onChange={(e) => {
								setFormData({ ...formData, name: e.target.value });
								if (!formData.display_name) {
									setFormData({
										...formData,
										name: e.target.value,
										display_name: e.target.value,
									});
								}
							}}
							placeholder="Acme Supply Co."
							required
							value={formData.name}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="display_name">
							Display Name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="display_name"
							onChange={(e) =>
								setFormData({ ...formData, display_name: e.target.value })
							}
							placeholder="Acme Supply Co."
							required
							value={formData.display_name}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="vendor_number">Vendor Number</Label>
						<Input
							disabled={mode === "edit"}
							id="vendor_number"
							onChange={(e) =>
								setFormData({ ...formData, vendor_number: e.target.value })
							}
							placeholder="Auto-generated if left blank"
							value={formData.vendor_number}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="category">Category</Label>
						<Select
							onValueChange={(value) =>
								setFormData({ ...formData, category: value })
							}
							value={formData.category}
						>
							<SelectTrigger id="category">
								<SelectValue placeholder="Select category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="supplier">Supplier</SelectItem>
								<SelectItem value="distributor">Distributor</SelectItem>
								<SelectItem value="manufacturer">Manufacturer</SelectItem>
								<SelectItem value="service_provider">
									Service Provider
								</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="status">Status</Label>
						<Select
							onValueChange={(value: "active" | "inactive") =>
								setFormData({ ...formData, status: value })
							}
							value={formData.status}
						>
							<SelectTrigger id="status">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Contact Information */}
			<div className="space-y-4">
				<h3 className="font-medium text-lg">Contact Information</h3>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							placeholder="vendor@example.com"
							type="email"
							value={formData.email}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone">Phone</Label>
						<Input
							id="phone"
							onChange={(e) =>
								setFormData({ ...formData, phone: e.target.value })
							}
							placeholder="(555) 123-4567"
							type="tel"
							value={formData.phone}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="secondary_phone">Secondary Phone</Label>
						<Input
							id="secondary_phone"
							onChange={(e) =>
								setFormData({ ...formData, secondary_phone: e.target.value })
							}
							placeholder="(555) 123-4567"
							type="tel"
							value={formData.secondary_phone}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="website">Website</Label>
						<Input
							id="website"
							onChange={(e) =>
								setFormData({ ...formData, website: e.target.value })
							}
							placeholder="https://example.com"
							type="url"
							value={formData.website}
						/>
					</div>
				</div>
			</div>

			{/* Address */}
			<div className="space-y-4">
				<h3 className="font-medium text-lg">Address</h3>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2 md:col-span-2">
						<Label htmlFor="address">Street Address</Label>
						<Input
							id="address"
							onChange={(e) =>
								setFormData({ ...formData, address: e.target.value })
							}
							placeholder="123 Main St"
							value={formData.address}
						/>
					</div>
					<div className="space-y-2 md:col-span-2">
						<Label htmlFor="address2">Address Line 2</Label>
						<Input
							id="address2"
							onChange={(e) =>
								setFormData({ ...formData, address2: e.target.value })
							}
							placeholder="Suite 100"
							value={formData.address2}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="city">City</Label>
						<Input
							id="city"
							onChange={(e) =>
								setFormData({ ...formData, city: e.target.value })
							}
							placeholder="Anytown"
							value={formData.city}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="state">State</Label>
						<Input
							id="state"
							onChange={(e) =>
								setFormData({ ...formData, state: e.target.value })
							}
							placeholder="ST"
							value={formData.state}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="zip_code">ZIP Code</Label>
						<Input
							id="zip_code"
							onChange={(e) =>
								setFormData({ ...formData, zip_code: e.target.value })
							}
							placeholder="12345"
							value={formData.zip_code}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="country">Country</Label>
						<Input
							id="country"
							onChange={(e) =>
								setFormData({ ...formData, country: e.target.value })
							}
							value={formData.country}
						/>
					</div>
				</div>
			</div>

			{/* Business Information */}
			<div className="space-y-4">
				<h3 className="font-medium text-lg">Business Information</h3>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="tax_id">Tax ID</Label>
						<Input
							id="tax_id"
							onChange={(e) =>
								setFormData({ ...formData, tax_id: e.target.value })
							}
							placeholder="12-3456789"
							value={formData.tax_id}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="payment_terms">Payment Terms</Label>
						<Select
							onValueChange={(value) =>
								setFormData({ ...formData, payment_terms: value })
							}
							value={formData.payment_terms}
						>
							<SelectTrigger id="payment_terms">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="net_15">Net 15</SelectItem>
								<SelectItem value="net_30">Net 30</SelectItem>
								<SelectItem value="net_60">Net 60</SelectItem>
								<SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
								<SelectItem value="custom">Custom</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="credit_limit">Credit Limit ($)</Label>
						<Input
							id="credit_limit"
							onChange={(e) =>
								setFormData({ ...formData, credit_limit: e.target.value })
							}
							placeholder="0"
							type="number"
							value={formData.credit_limit}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="preferred_payment_method">
							Preferred Payment Method
						</Label>
						<Select
							onValueChange={(value) =>
								setFormData({
									...formData,
									preferred_payment_method: value,
								})
							}
							value={formData.preferred_payment_method}
						>
							<SelectTrigger id="preferred_payment_method">
								<SelectValue placeholder="Select method" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="check">Check</SelectItem>
								<SelectItem value="ach">ACH</SelectItem>
								<SelectItem value="credit_card">Credit Card</SelectItem>
								<SelectItem value="wire">Wire Transfer</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Notes */}
			<div className="space-y-4">
				<h3 className="font-medium text-lg">Notes</h3>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="notes">Public Notes</Label>
						<Textarea
							id="notes"
							onChange={(e) =>
								setFormData({ ...formData, notes: e.target.value })
							}
							placeholder="Notes visible to team members..."
							rows={4}
							value={formData.notes}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="internal_notes">Internal Notes</Label>
						<Textarea
							id="internal_notes"
							onChange={(e) =>
								setFormData({ ...formData, internal_notes: e.target.value })
							}
							placeholder="Private notes only visible to admins..."
							rows={4}
							value={formData.internal_notes}
						/>
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="flex justify-end gap-3">
				<Button onClick={() => router.back()} type="button" variant="outline">
					Cancel
				</Button>
				<Button disabled={isLoading} type="submit">
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{mode === "create" ? "Create Vendor" : "Save Changes"}
				</Button>
			</div>
		</form>
	);
}
