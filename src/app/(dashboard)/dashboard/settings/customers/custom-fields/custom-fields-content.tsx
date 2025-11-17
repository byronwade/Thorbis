"use client";

/**
 * Custom Fields Content - Client Component
 *
 * Client-side features:
 * - Interactive form state management
 * - Field CRUD operations
 * - Real-time validation
 */

import { HelpCircle, Plus, Save, Tag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
	createCustomField,
	deleteCustomField,
	updateCustomField,
} from "@/actions/settings/customers";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

type CustomField = {
	id: string;
	company_id?: string;
	field_name: string;
	field_key: string;
	field_type:
		| "text"
		| "number"
		| "date"
		| "boolean"
		| "select"
		| "multi_select"
		| "textarea";
	field_options?: string[] | null;
	is_required: boolean;
	show_in_list: boolean;
	display_order: number;
	is_active: boolean;
	created_at?: string;
	updated_at?: string;
};

type Props = {
	initialFields: CustomField[];
};

export function CustomFieldsContent({ initialFields }: Props) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const { toast } = useToast();
	const [customFields, setCustomFields] =
		useState<CustomField[]>(initialFields);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	const addCustomField = () => {
		const newField: CustomField = {
			id: `temp-${Date.now()}`,
			field_name: "",
			field_key: "",
			field_type: "text",
			is_required: false,
			show_in_list: false,
			display_order: customFields.length,
			is_active: true,
		};
		setCustomFields((prev) => [...prev, newField]);
		setHasUnsavedChanges(true);
	};

	const removeField = async (id: string) => {
		if (id.startsWith("temp-")) {
			setCustomFields((prev) => prev.filter((field) => field.id !== id));
			setHasUnsavedChanges(true);
			return;
		}

		startTransition(async () => {
			const result = await deleteCustomField(id);
			if (result.success) {
				toast.success("Custom field deleted successfully");
				setCustomFields((prev) => prev.filter((field) => field.id !== id));
				// Server Action handles revalidation automatically
			} else {
				toast.error(result.error || "Failed to delete custom field");
			}
		});
	};

	const updateField = (
		id: string,
		key: keyof CustomField,
		value: string | boolean | string[] | number,
	) => {
		setCustomFields((prev) =>
			prev.map((field) => {
				if (field.id === id) {
					const updated = { ...field, [key]: value };
					// Auto-generate field_key from field_name
					if (key === "field_name" && typeof value === "string") {
						updated.field_key = value
							.toLowerCase()
							.replace(/\s+/g, "_")
							.replace(/[^a-z0-9_]/g, "");
					}
					return updated;
				}
				return field;
			}),
		);
		setHasUnsavedChanges(true);
	};

	const handleSave = async () => {
		startTransition(async () => {
			let hasErrors = false;

			for (const field of customFields) {
				if (!(field.field_name && field.field_key)) {
					toast.error("Field name is required for all custom fields");
					hasErrors = true;
					break;
				}

				const formData = new FormData();
				formData.append("fieldName", field.field_name);
				formData.append("fieldKey", field.field_key);
				formData.append("fieldType", field.field_type);
				formData.append("isRequired", String(field.is_required));
				formData.append("showInList", String(field.show_in_list));
				formData.append("displayOrder", String(field.display_order));
				formData.append("isActive", String(field.is_active));

				if (field.field_options && field.field_options.length > 0) {
					formData.append("fieldOptions", JSON.stringify(field.field_options));
				}

				let result;
				if (field.id.startsWith("temp-")) {
					result = await createCustomField(formData);
				} else {
					result = await updateCustomField(field.id, formData);
				}

				if (!result.success) {
					toast.error(result.error || "Failed to save custom field");
					hasErrors = true;
					break;
				}
			}

			if (!hasErrors) {
				toast.success("Custom fields saved successfully");
				setHasUnsavedChanges(false);
				// Server Action handles revalidation automatically
			}
		});
	};

	return (
		<TooltipProvider>
			<div className="space-y-6">
				<div className="flex items-start justify-between">
					<div>
						<h1 className="font-bold text-3xl tracking-tight">Custom Fields</h1>
						<p className="mt-2 text-muted-foreground">
							Add custom fields to collect additional customer information
						</p>
					</div>
					{hasUnsavedChanges && (
						<Button disabled={isPending} onClick={handleSave}>
							<Save className="mr-2 size-4" />
							{isPending ? "Saving..." : "Save Changes"}
						</Button>
					)}
				</div>

				<Card>
					<CardHeader>
						<div className="flex items-start justify-between">
							<div>
								<CardTitle className="flex items-center gap-2 text-base">
									<Tag className="size-4" />
									Customer Custom Fields
								</CardTitle>
								<CardDescription>
									Create custom fields to capture business-specific information
								</CardDescription>
							</div>
							<Button
								disabled={isPending}
								onClick={addCustomField}
								size="sm"
								variant="outline"
							>
								<Plus className="mr-2 size-4" />
								Add Field
							</Button>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{customFields.map((field, index) => (
							<div key={field.id}>
								<div className="space-y-4 rounded-lg border p-4">
									<div className="flex items-start justify-between">
										<div className="flex-1 space-y-4">
											<div className="grid gap-4 sm:grid-cols-2">
												<div>
													<Label className="font-medium text-sm">
														Field Name
													</Label>
													<Input
														className="mt-2"
														disabled={isPending}
														onChange={(e) =>
															updateField(
																field.id,
																"field_name",
																e.target.value,
															)
														}
														placeholder="e.g., Gate Code"
														value={field.field_name}
													/>
												</div>

												<div>
													<Label className="flex items-center gap-2 font-medium text-sm">
														Field Type
														<Tooltip>
															<TooltipTrigger>
																<HelpCircle className="h-3 w-3 text-muted-foreground" />
															</TooltipTrigger>
															<TooltipContent>
																<p className="max-w-xs">
																	Type of input for this field
																</p>
															</TooltipContent>
														</Tooltip>
													</Label>
													<Select
														disabled={isPending}
														onValueChange={(value) =>
															updateField(
																field.id,
																"field_type",
																value as CustomField["field_type"],
															)
														}
														value={field.field_type}
													>
														<SelectTrigger className="mt-2">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="text">Text</SelectItem>
															<SelectItem value="number">Number</SelectItem>
															<SelectItem value="date">Date</SelectItem>
															<SelectItem value="boolean">Boolean</SelectItem>
															<SelectItem value="select">Dropdown</SelectItem>
															<SelectItem value="multi_select">
																Multi-Select
															</SelectItem>
															<SelectItem value="textarea">
																Text Area
															</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</div>

											{(field.field_type === "select" ||
												field.field_type === "multi_select") && (
												<div>
													<Label className="flex items-center gap-2 text-sm">
														Options (comma-separated)
														<Tooltip>
															<TooltipTrigger>
																<HelpCircle className="h-3 w-3 text-muted-foreground" />
															</TooltipTrigger>
															<TooltipContent>
																<p className="max-w-xs">
																	Separate options with commas
																</p>
															</TooltipContent>
														</Tooltip>
													</Label>
													<Input
														className="mt-2"
														disabled={isPending}
														onChange={(e) =>
															updateField(
																field.id,
																"field_options",
																e.target.value.split(",").map((s) => s.trim()),
															)
														}
														placeholder="Option 1, Option 2, Option 3"
														value={field.field_options?.join(", ") || ""}
													/>
													<div className="mt-2 flex flex-wrap gap-2">
														{field.field_options?.map((option, i) => (
															<Badge key={i} variant="secondary">
																{option}
															</Badge>
														))}
													</div>
												</div>
											)}

											<Separator />

											<div className="grid gap-3 sm:grid-cols-3">
												<div className="flex items-center justify-between">
													<div className="flex-1">
														<Label className="text-sm">Required</Label>
														<p className="text-muted-foreground text-xs">
															Customer must fill
														</p>
													</div>
													<Switch
														checked={field.is_required}
														disabled={isPending}
														onCheckedChange={(checked) =>
															updateField(field.id, "is_required", checked)
														}
													/>
												</div>

												<div className="flex items-center justify-between">
													<div className="flex-1">
														<Label className="text-sm">Show in List</Label>
														<p className="text-muted-foreground text-xs">
															Display in tables
														</p>
													</div>
													<Switch
														checked={field.show_in_list}
														disabled={isPending}
														onCheckedChange={(checked) =>
															updateField(field.id, "show_in_list", checked)
														}
													/>
												</div>

												<div className="flex items-center justify-between">
													<div className="flex-1">
														<Label className="text-sm">Active</Label>
														<p className="text-muted-foreground text-xs">
															Enable this field
														</p>
													</div>
													<Switch
														checked={field.is_active}
														disabled={isPending}
														onCheckedChange={(checked) =>
															updateField(field.id, "is_active", checked)
														}
													/>
												</div>
											</div>
										</div>

										<Button
											className="ml-4"
											disabled={isPending}
											onClick={() => removeField(field.id)}
											size="sm"
											variant="ghost"
										>
											<Trash2 className="size-4" />
										</Button>
									</div>
								</div>

								{index < customFields.length - 1 && (
									<Separator className="my-4" />
								)}
							</div>
						))}

						{customFields.length === 0 && (
							<div className="rounded-lg border border-dashed py-12 text-center">
								<Tag className="mx-auto h-12 w-12 text-muted-foreground" />
								<p className="mt-4 font-medium">No Custom Fields</p>
								<p className="mt-1 text-muted-foreground text-sm">
									Click "Add Field" to create your first custom field
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Field Examples</CardTitle>
						<CardDescription>
							Common custom fields for field service businesses
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="rounded-lg border p-3">
								<p className="font-medium text-sm">Property Information</p>
								<ul className="mt-2 space-y-1 text-muted-foreground text-xs">
									<li>• Gate code or access instructions</li>
									<li>• Parking instructions</li>
									<li>• Property square footage</li>
									<li>• Year built</li>
								</ul>
							</div>

							<div className="rounded-lg border p-3">
								<p className="font-medium text-sm">Service Details</p>
								<ul className="mt-2 space-y-1 text-muted-foreground text-xs">
									<li>• Equipment brand/model</li>
									<li>• Previous service provider</li>
									<li>• Service history</li>
									<li>• Warranty information</li>
								</ul>
							</div>

							<div className="rounded-lg border p-3">
								<p className="font-medium text-sm">Customer Preferences</p>
								<ul className="mt-2 space-y-1 text-muted-foreground text-xs">
									<li>• Preferred contact method</li>
									<li>• Best time to call</li>
									<li>• Language preference</li>
									<li>• Special instructions</li>
								</ul>
							</div>

							<div className="rounded-lg border p-3">
								<p className="font-medium text-sm">Safety & Access</p>
								<ul className="mt-2 space-y-1 text-muted-foreground text-xs">
									<li>• Pet information</li>
									<li>• Alarm system details</li>
									<li>• Emergency contact</li>
									<li>• Special access requirements</li>
								</ul>
							</div>

							<div className="rounded-lg border p-3">
								<p className="font-medium text-sm">Business Information</p>
								<ul className="mt-2 space-y-1 text-muted-foreground text-xs">
									<li>• Referral source</li>
									<li>• Customer type (residential/commercial)</li>
									<li>• Tax ID/business license</li>
									<li>• PO number requirements</li>
								</ul>
							</div>

							<div className="rounded-lg border p-3">
								<p className="font-medium text-sm">Scheduling</p>
								<ul className="mt-2 space-y-1 text-muted-foreground text-xs">
									<li>• Preferred technician</li>
									<li>• Availability windows</li>
									<li>• Recurring service frequency</li>
									<li>• Seasonal service preferences</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-primary/50 bg-primary/5">
					<CardContent className="flex items-start gap-3 pt-6">
						<Tag className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
						<div className="space-y-1">
							<p className="font-medium text-primary text-sm dark:text-primary">
								Custom Field Best Practices
							</p>
							<p className="text-muted-foreground text-sm">
								Keep custom fields focused and relevant to avoid overwhelming
								customers during booking. Use dropdown menus instead of text
								fields when possible for easier reporting. Limit required fields
								to only essential information. Review and remove unused custom
								fields quarterly to maintain a clean customer experience.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</TooltipProvider>
	);
}
