"use client";

/**
 * Generic Action Dialog Component
 *
 * Reusable dialog for admin actions with:
 * - Form fields
 * - Reason input (required for critical actions)
 * - Loading states
 * - Error handling
 * - Success feedback
 */

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export type FormField = {
	name: string;
	label: string;
	type: "text" | "textarea" | "select" | "number" | "date" | "datetime-local";
	placeholder?: string;
	required?: boolean;
	options?: { value: string; label: string }[];
	defaultValue?: string;
};

interface ActionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	fields?: FormField[];
	requireReason?: boolean;
	actionLabel?: string;
	onSubmit: (data: Record<string, string>) => Promise<{ success: boolean; error?: string }>;
	isDestructive?: boolean;
}

export function ActionDialog({
	open,
	onOpenChange,
	title,
	description,
	fields = [],
	requireReason = true,
	actionLabel = "Submit",
	onSubmit,
	isDestructive = false,
}: ActionDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<Record<string, string>>({});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await onSubmit(formData);

			if (result.success) {
				toast.success("Action completed successfully");
				onOpenChange(false);
				setFormData({});
			} else {
				toast.error(result.error || "Action failed");
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const renderField = (field: FormField) => {
		const value = formData[field.name] || field.defaultValue || "";

		switch (field.type) {
			case "textarea":
				return (
					<Textarea
						id={field.name}
						placeholder={field.placeholder}
						value={value}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
						}
						required={field.required}
						disabled={isLoading}
						rows={3}
					/>
				);

			case "select":
				return (
					<Select
						value={value}
						onValueChange={(val) =>
							setFormData((prev) => ({ ...prev, [field.name]: val }))
						}
						required={field.required}
						disabled={isLoading}
					>
						<SelectTrigger>
							<SelectValue placeholder={field.placeholder || "Select..."} />
						</SelectTrigger>
						<SelectContent>
							{field.options?.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				);

			case "number":
				return (
					<Input
						id={field.name}
						type="number"
						placeholder={field.placeholder}
						value={value}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
						}
						required={field.required}
						disabled={isLoading}
					/>
				);

			case "date":
			case "datetime-local":
				return (
					<Input
						id={field.name}
						type={field.type}
						value={value}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
						}
						required={field.required}
						disabled={isLoading}
					/>
				);

			default:
				return (
					<Input
						id={field.name}
						type="text"
						placeholder={field.placeholder}
						value={value}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
						}
						required={field.required}
						disabled={isLoading}
					/>
				);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{fields.map((field) => (
							<div key={field.name} className="space-y-2">
								<Label htmlFor={field.name}>
									{field.label}
									{field.required && <span className="text-red-500 ml-1">*</span>}
								</Label>
								{renderField(field)}
							</div>
						))}

						{requireReason && (
							<div className="space-y-2">
								<Label htmlFor="reason">
									Reason <span className="text-red-500 ml-1">*</span>
								</Label>
								<Textarea
									id="reason"
									placeholder="Explain why you're making this change (required for audit trail)"
									value={formData.reason || ""}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, reason: e.target.value }))
									}
									required
									disabled={isLoading}
									rows={3}
								/>
								<p className="text-xs text-muted-foreground">
									This will be logged in the audit trail
								</p>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							variant={isDestructive ? "destructive" : "default"}
							disabled={isLoading}
						>
							{isLoading ? "Processing..." : actionLabel}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
