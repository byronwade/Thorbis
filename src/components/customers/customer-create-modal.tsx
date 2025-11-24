"use client";

import { useState } from "react";
import { AlertCircle, Loader2, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Customer = Database["public"]["Tables"]["customers"]["Row"];

export interface CustomerOption {
	id: string;
	first_name: string | null;
	last_name: string | null;
	display_name: string | null;
	email: string | null;
	phone: string | null;
	company_name: string | null;
}

interface CustomerCreateModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCustomerCreated: (customer: CustomerOption) => void;
	initialEmail?: string;
	initialPhone?: string;
}

export function CustomerCreateModal({
	open,
	onOpenChange,
	onCustomerCreated,
	initialEmail,
	initialPhone,
}: CustomerCreateModalProps) {
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		display_name: "",
		email: initialEmail || "",
		phone: initialPhone || "",
		company_name: "",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [duplicateWarning, setDuplicateWarning] = useState<string | null>(
		null,
	);

	// Check for duplicates
	const checkDuplicates = async () => {
		if (!formData.email && !formData.phone) {
			setDuplicateWarning(null);
			return false;
		}

		const supabase = createClient();

		// Check for existing customer with same email or phone
		const { data: existing, error: checkError } = await supabase
			.from("customers")
			.select("id, first_name, last_name, email, phone, company_name")
			.or(
				`email.eq.${formData.email || ""},phone.eq.${formData.phone || ""}`,
			)
			.limit(1)
			.single();

		if (checkError && checkError.code !== "PGRST116") {
			// PGRST116 = no rows returned
			console.error("Duplicate check error:", checkError);
			return false;
		}

		if (existing) {
			const matchedBy = [];
			if (formData.email && existing.email === formData.email) {
				matchedBy.push("email");
			}
			if (formData.phone && existing.phone === formData.phone) {
				matchedBy.push("phone");
			}

			const existingName =
				existing.first_name && existing.last_name
					? `${existing.first_name} ${existing.last_name}`
					: existing.first_name ||
						existing.last_name ||
						existing.company_name ||
						"Unknown";

			setDuplicateWarning(
				`A customer named "${existingName}" already exists with matching ${matchedBy.join(" and ")}.`,
			);
			return true;
		}

		setDuplicateWarning(null);
		return false;
	};

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setError(null);

		// Clear duplicate warning when user modifies email/phone
		if (field === "email" || field === "phone") {
			setDuplicateWarning(null);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			// Validate at least one name field
			if (
				!formData.first_name.trim() &&
				!formData.last_name.trim() &&
				!formData.company_name.trim()
			) {
				setError("Please provide at least a first name, last name, or company name");
				setLoading(false);
				return;
			}

			// Check for duplicates
			const hasDuplicate = await checkDuplicates();
			if (hasDuplicate && duplicateWarning) {
				setLoading(false);
				return;
			}

			const supabase = createClient();

			// Get current user's company_id
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				setError("You must be logged in to create a customer");
				setLoading(false);
				return;
			}

			// Get user's profile to get company_id
			const { data: profile } = await supabase
				.from("profiles")
				.select("company_id")
				.eq("id", user.id)
				.single();

			if (!profile?.company_id) {
				setError("Could not determine your company. Please contact support.");
				setLoading(false);
				return;
			}

			// Create customer
			const { data: customer, error: createError } = await supabase
				.from("customers")
				.insert({
					company_id: profile.company_id,
					first_name: formData.first_name.trim() || null,
					last_name: formData.last_name.trim() || null,
					display_name: formData.display_name.trim() || null,
					email: formData.email.trim() || null,
					phone: formData.phone.trim() || null,
					company_name: formData.company_name.trim() || null,
				})
				.select()
				.single();

			if (createError) {
				console.error("Create customer error:", createError);
				setError(
					createError.message || "Failed to create customer. Please try again.",
				);
				setLoading(false);
				return;
			}

			// Success - return customer data and close modal
			onCustomerCreated({
				id: customer.id,
				first_name: customer.first_name,
				last_name: customer.last_name,
				display_name: customer.display_name,
				email: customer.email,
				phone: customer.phone,
				company_name: customer.company_name,
			});

			// Reset form
			setFormData({
				first_name: "",
				last_name: "",
				display_name: "",
				email: "",
				phone: "",
				company_name: "",
			});
			setDuplicateWarning(null);
			onOpenChange(false);
		} catch (err) {
			console.error("Unexpected error:", err);
			setError("An unexpected error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setFormData({
			first_name: "",
			last_name: "",
			display_name: "",
			email: initialEmail || "",
			phone: initialPhone || "",
			company_name: "",
		});
		setError(null);
		setDuplicateWarning(null);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
							<User className="text-primary size-5" />
						</div>
						<div>
							<DialogTitle>Create New Customer</DialogTitle>
							<DialogDescription>
								Add a new customer to your account
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="space-y-4 py-4">
						{/* Error Alert */}
						{error && (
							<Alert variant="destructive">
								<AlertCircle className="size-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{/* Duplicate Warning */}
						{duplicateWarning && (
							<Alert>
								<AlertCircle className="size-4" />
								<AlertDescription>{duplicateWarning}</AlertDescription>
							</Alert>
						)}

						{/* Name Fields */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="first_name">First Name</Label>
								<Input
									id="first_name"
									placeholder="John"
									value={formData.first_name}
									onChange={(e) => handleChange("first_name", e.target.value)}
									disabled={loading}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="last_name">Last Name</Label>
								<Input
									id="last_name"
									placeholder="Smith"
									value={formData.last_name}
									onChange={(e) => handleChange("last_name", e.target.value)}
									disabled={loading}
								/>
							</div>
						</div>

						{/* Display Name */}
						<div className="space-y-2">
							<Label htmlFor="display_name">
								Display Name <span className="text-muted-foreground text-xs">(optional)</span>
							</Label>
							<Input
								id="display_name"
								placeholder="How this customer should be displayed"
								value={formData.display_name}
								onChange={(e) => handleChange("display_name", e.target.value)}
								disabled={loading}
							/>
						</div>

						{/* Company Name */}
						<div className="space-y-2">
							<Label htmlFor="company_name">
								Company Name <span className="text-muted-foreground text-xs">(optional)</span>
							</Label>
							<Input
								id="company_name"
								placeholder="ABC Plumbing Co."
								value={formData.company_name}
								onChange={(e) => handleChange("company_name", e.target.value)}
								disabled={loading}
							/>
						</div>

						{/* Contact Fields */}
						<div className="space-y-2">
							<Label htmlFor="email">
								Email <span className="text-muted-foreground text-xs">(optional)</span>
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="john@example.com"
								value={formData.email}
								onChange={(e) => handleChange("email", e.target.value)}
								onBlur={checkDuplicates}
								disabled={loading}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">
								Phone <span className="text-muted-foreground text-xs">(optional)</span>
							</Label>
							<Input
								id="phone"
								type="tel"
								placeholder="(555) 123-4567"
								value={formData.phone}
								onChange={(e) => handleChange("phone", e.target.value)}
								onBlur={checkDuplicates}
								disabled={loading}
							/>
						</div>

						<p className="text-muted-foreground text-xs">
							At least one name field (first, last, or company) is required.
						</p>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading || !!duplicateWarning}>
							{loading ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Creating...
								</>
							) : (
								"Create Customer"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
