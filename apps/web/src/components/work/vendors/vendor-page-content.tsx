"use client";

import {
	Activity,
	Building2,
	FileText,
	Link2,
	Mail,
	Paperclip,
	Phone,
	Plus,
	Receipt,
	Save,
	ShoppingCart,
	TrendingUp,
	User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { type EntityTag, updateEntityTags } from "@/actions/entity-tags";
import { linkPurchaseOrderToVendor, updateVendor } from "@/actions/vendors";
import { DetailPageContentLayout } from "@/components/layout/detail-page-content-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	StandardFormField,
	StandardFormRow,
} from "@/components/ui/standard-form-field";
import { Textarea } from "@/components/ui/textarea";
import type { UnifiedAccordionSection } from "@/components/ui/unified-accordion";
import { EntityTags } from "@/components/work/entity-tags";
import { formatCurrency, formatDate } from "@/lib/formatters";

export type VendorData = {
	vendor: any;
	purchaseOrders?: any[];
	activities?: any[];
	notes?: any[];
	attachments?: any[];
	contacts?: any[];
	relatedJobs?: any[];
};

export type VendorPageContentProps = {
	entityData: VendorData;
	metrics?: {
		totalSpend?: number;
		openPOCount?: number;
		openPOValue?: number;
		averageOrderValue?: number;
		lastOrderDate?: string | null;
		onTimeDeliveryRate?: number;
	};
	searchData?: {
		availablePurchaseOrders?: any[];
		availableContacts?: any[];
	};
};

export function VendorPageContent({
	entityData,
	metrics = {},
	searchData = {},
}: VendorPageContentProps) {
	const router = useRouter();
	const {
		vendor: initialVendor,
		purchaseOrders = [],
		activities = [],
		notes = [],
		attachments = [],
		contacts = [],
		relatedJobs = [],
	} = entityData;
	const { availablePurchaseOrders = [], availableContacts = [] } = searchData;

	const [vendor, setVendor] = useState(initialVendor);
	const [hasChanges, setHasChanges] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isPOSearchOpen, setIsPOSearchOpen] = useState(false);
	const [isContactSearchOpen, setIsContactSearchOpen] = useState(false);
	const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
	const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);
	const [poSearchQuery, setPOSearchQuery] = useState("");
	const [contactSearchQuery, setContactSearchQuery] = useState("");
	const [isLinkingPO, setIsLinkingPO] = useState(false);

	const [tags, setTags] = useState<EntityTag[]>(
		Array.isArray(initialVendor.tags) ? initialVendor.tags : [],
	);

	const handleTagsUpdate = async (entityId: string, newTags: EntityTag[]) => {
		const result = await updateEntityTags("vendor", entityId, newTags);
		if (result.success) {
			setTags(newTags);
			toast.success("Tags updated");
		} else {
			toast.error(result.error || "Failed to update tags");
		}
		return result;
	};

	const handleFieldChange = useCallback((field: string, value: any) => {
		setVendor((prev: any) => ({ ...prev, [field]: value }));
		setHasChanges(true);
	}, []);

	const handleLinkPurchaseOrder = async (purchaseOrderId: string) => {
		setIsLinkingPO(true);
		try {
			const result = await linkPurchaseOrderToVendor(
				purchaseOrderId,
				vendor.id,
			);

			if (result.success) {
				toast.success("Purchase order linked successfully");
				setIsPOSearchOpen(false);
				setPOSearchQuery("");
				// Server Action handles revalidation automatically
			} else {
				toast.error(result.error || "Failed to link purchase order");
			}
		} catch (_error) {
			toast.error("Failed to link purchase order");
		} finally {
			setIsLinkingPO(false);
		}
	};

	const handleSave = useCallback(async () => {
		if (!hasChanges) {
			return;
		}

		setIsSaving(true);
		const previousState = { ...vendor };

		try {
			const formData = new FormData();
			formData.append("name", vendor.name);
			formData.append("display_name", vendor.display_name);
			formData.append("vendor_number", vendor.vendor_number);
			if (vendor.email) {
				formData.append("email", vendor.email);
			}
			if (vendor.phone) {
				formData.append("phone", vendor.phone);
			}
			if (vendor.secondary_phone) {
				formData.append("secondary_phone", vendor.secondary_phone);
			}
			if (vendor.website) {
				formData.append("website", vendor.website);
			}
			if (vendor.address) {
				formData.append("address", vendor.address);
			}
			if (vendor.address2) {
				formData.append("address2", vendor.address2);
			}
			if (vendor.city) {
				formData.append("city", vendor.city);
			}
			if (vendor.state) {
				formData.append("state", vendor.state);
			}
			if (vendor.zip_code) {
				formData.append("zip_code", vendor.zip_code);
			}
			if (vendor.country) {
				formData.append("country", vendor.country);
			}
			if (vendor.tax_id) {
				formData.append("tax_id", vendor.tax_id);
			}
			if (vendor.payment_terms) {
				formData.append("payment_terms", vendor.payment_terms);
			}
			if (vendor.credit_limit) {
				formData.append("credit_limit", (vendor.credit_limit / 100).toString());
			}
			if (vendor.preferred_payment_method) {
				formData.append(
					"preferred_payment_method",
					vendor.preferred_payment_method,
				);
			}
			if (vendor.category) {
				formData.append("category", vendor.category);
			}
			formData.append("status", vendor.status);
			if (vendor.notes) {
				formData.append("notes", vendor.notes);
			}
			if (vendor.internal_notes) {
				formData.append("internal_notes", vendor.internal_notes);
			}

			const result = await updateVendor(vendor.id, formData);

			if (result.success) {
				toast.success("Vendor updated successfully");
				setHasChanges(false);
				// Server Action handles revalidation automatically
			} else {
				setVendor(previousState);
				setHasChanges(false);
				toast.error(result.error || "Failed to save changes");
			}
		} catch (_error) {
			setVendor(previousState);
			setHasChanges(false);
			toast.error("Failed to save changes");
		} finally {
			setIsSaving(false);
		}
	}, [vendor, hasChanges, router]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Cmd+S or Ctrl+S: Save
			if ((e.metaKey || e.ctrlKey) && e.key === "s" && hasChanges) {
				e.preventDefault();
				handleSave();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [hasChanges, handleSave]);

	// Calculate vendor stats
	const totalSpend = metrics.totalSpend || 0;
	const openPOCount = metrics.openPOCount || 0;
	const openPOValue = metrics.openPOValue || 0;
	const averageOrderValue = metrics.averageOrderValue || 0;
	const onTimeDeliveryRate = metrics.onTimeDeliveryRate || 0;

	// Build sections
	const sections: UnifiedAccordionSection[] = [
		// Vendor Information
		{
			id: "vendor-info",
			title: "Vendor Information",
			icon: <Building2 className="size-4" />,
			actions: hasChanges ? (
				<Badge
					className="bg-amber-100 text-amber-900 dark:bg-amber-500/20"
					variant="outline"
				>
					<Save className="mr-1 size-3" />
					Unsaved
				</Badge>
			) : undefined,
			content: (
				<div className="space-y-6 p-6">
					<StandardFormRow cols={2}>
						{/* Basic Info */}
						<div className="space-y-4">
							<StandardFormField label="Vendor Name" htmlFor="name" required>
								<Input
									id="name"
									onChange={(e) => handleFieldChange("name", e.target.value)}
									value={vendor.name || ""}
								/>
							</StandardFormField>

							<StandardFormField label="Display Name" htmlFor="display_name">
								<Input
									id="display_name"
									onChange={(e) =>
										handleFieldChange("display_name", e.target.value)
									}
									value={vendor.display_name || ""}
								/>
							</StandardFormField>

							<StandardFormField label="Category" htmlFor="category">
								<Select
									onValueChange={(value) =>
										handleFieldChange("category", value)
									}
									value={vendor.category || ""}
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
							</StandardFormField>

							<StandardFormField label="Status" htmlFor="status">
								<Select
									onValueChange={(value) => handleFieldChange("status", value)}
									value={vendor.status || "active"}
								>
									<SelectTrigger id="status">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="inactive">Inactive</SelectItem>
									</SelectContent>
								</Select>
							</StandardFormField>
						</div>

						{/* Contact Info */}
						<div className="space-y-4">
							<StandardFormField label="Email" htmlFor="email">
								<Input
									id="email"
									onChange={(e) => handleFieldChange("email", e.target.value)}
									type="email"
									value={vendor.email || ""}
								/>
							</StandardFormField>

							<StandardFormField label="Phone" htmlFor="phone">
								<Input
									id="phone"
									onChange={(e) => handleFieldChange("phone", e.target.value)}
									type="tel"
									value={vendor.phone || ""}
								/>
							</StandardFormField>

							<StandardFormField
								label="Secondary Phone"
								htmlFor="secondary_phone"
							>
								<Input
									id="secondary_phone"
									onChange={(e) =>
										handleFieldChange("secondary_phone", e.target.value)
									}
									type="tel"
									value={vendor.secondary_phone || ""}
								/>
							</StandardFormField>

							<StandardFormField label="Website" htmlFor="website">
								<Input
									id="website"
									onChange={(e) => handleFieldChange("website", e.target.value)}
									type="url"
									value={vendor.website || ""}
								/>
							</StandardFormField>
						</div>
					</StandardFormRow>

					{/* Address */}
					<div className="space-y-4 border-t pt-6">
						<h3 className="font-medium">Address</h3>
						<StandardFormRow cols={2}>
							<StandardFormField label="Street Address" htmlFor="address">
								<Input
									id="address"
									onChange={(e) => handleFieldChange("address", e.target.value)}
									value={vendor.address || ""}
								/>
							</StandardFormField>

							<StandardFormField label="Address Line 2" htmlFor="address2">
								<Input
									id="address2"
									onChange={(e) =>
										handleFieldChange("address2", e.target.value)
									}
									value={vendor.address2 || ""}
								/>
							</StandardFormField>

							<StandardFormField label="City" htmlFor="city">
								<Input
									id="city"
									onChange={(e) => handleFieldChange("city", e.target.value)}
									value={vendor.city || ""}
								/>
							</StandardFormField>

							<StandardFormField label="State" htmlFor="state">
								<Input
									id="state"
									onChange={(e) => handleFieldChange("state", e.target.value)}
									value={vendor.state || ""}
								/>
							</StandardFormField>

							<StandardFormField label="ZIP Code" htmlFor="zip_code">
								<Input
									id="zip_code"
									onChange={(e) =>
										handleFieldChange("zip_code", e.target.value)
									}
									value={vendor.zip_code || ""}
								/>
							</StandardFormField>

							<StandardFormField label="Country" htmlFor="country">
								<Input
									id="country"
									onChange={(e) => handleFieldChange("country", e.target.value)}
									value={vendor.country || "USA"}
								/>
							</StandardFormField>
						</StandardFormRow>
					</div>

					{/* Business Info */}
					<div className="space-y-4 border-t pt-6">
						<h3 className="font-medium">Business Information</h3>
						<StandardFormRow cols={2}>
							<StandardFormField label="Tax ID" htmlFor="tax_id">
								<Input
									id="tax_id"
									onChange={(e) => handleFieldChange("tax_id", e.target.value)}
									value={vendor.tax_id || ""}
								/>
							</StandardFormField>

							<StandardFormField label="Payment Terms" htmlFor="payment_terms">
								<Select
									onValueChange={(value) =>
										handleFieldChange("payment_terms", value)
									}
									value={vendor.payment_terms || "net_30"}
								>
									<SelectTrigger id="payment_terms">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="net_15">Net 15</SelectItem>
										<SelectItem value="net_30">Net 30</SelectItem>
										<SelectItem value="net_60">Net 60</SelectItem>
										<SelectItem value="due_on_receipt">
											Due on Receipt
										</SelectItem>
										<SelectItem value="custom">Custom</SelectItem>
									</SelectContent>
								</Select>
							</StandardFormField>

							<StandardFormField label="Credit Limit" htmlFor="credit_limit">
								<Input
									id="credit_limit"
									min="0"
									onChange={(e) =>
										handleFieldChange(
											"credit_limit",
											Math.round(
												Number.parseFloat(e.target.value || "0") * 100,
											),
										)
									}
									step="0.01"
									type="number"
									value={((vendor.credit_limit || 0) / 100).toFixed(2)}
								/>
							</StandardFormField>

							<StandardFormField
								label="Preferred Payment Method"
								htmlFor="preferred_payment_method"
							>
								<Select
									onValueChange={(value) =>
										handleFieldChange("preferred_payment_method", value)
									}
									value={vendor.preferred_payment_method || ""}
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
							</StandardFormField>
						</StandardFormRow>
					</div>

					{/* Notes */}
					<div className="space-y-4 border-t pt-6">
						<StandardFormField
							label="Notes"
							htmlFor="notes"
							description="Customer-facing notes"
						>
							<Textarea
								id="notes"
								onChange={(e) => handleFieldChange("notes", e.target.value)}
								placeholder="Customer-facing notes..."
								rows={3}
								value={vendor.notes || ""}
							/>
						</StandardFormField>

						<StandardFormField
							label="Internal Notes"
							htmlFor="internal_notes"
							description="Private team notes"
						>
							<Textarea
								id="internal_notes"
								onChange={(e) =>
									handleFieldChange("internal_notes", e.target.value)
								}
								placeholder="Private team notes..."
								rows={3}
								value={vendor.internal_notes || ""}
							/>
						</StandardFormField>
					</div>

					{/* Save Button */}
					{hasChanges && (
						<div className="flex items-center justify-end gap-2 border-t pt-6">
							<Button disabled={isSaving} onClick={handleSave} size="sm">
								{isSaving ? (
									<>
										<Save className="mr-2 size-4 animate-pulse" />
										Saving...
									</>
								) : (
									<>
										<Save className="mr-2 size-4" />
										Save Changes (⌘S)
									</>
								)}
							</Button>
						</div>
					)}
				</div>
			),
		},

		// Purchase Orders
		{
			id: "purchase-orders",
			title: "Purchase Orders",
			icon: <Receipt className="size-4" />,
			count: purchaseOrders.length,
			actions: (
				<Button
					onClick={() => setIsPOSearchOpen(true)}
					size="sm"
					variant="outline"
				>
					<Plus className="mr-2 size-3.5" />
					Link PO
				</Button>
			),
			content: (
				<div className="space-y-4 p-6">
					{purchaseOrders.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Receipt className="text-muted-foreground mb-4 size-12" />
							<p className="text-muted-foreground text-sm">
								No purchase orders yet
							</p>
							<Button asChild className="mt-4" size="sm" variant="outline">
								<Link
									href={`/dashboard/work/purchase-orders/new?vendorId=${vendor.id}`}
								>
									Create Purchase Order
								</Link>
							</Button>
						</div>
					) : (
						<div className="space-y-3">
							{purchaseOrders.map((po: any) => (
								<Link
									className="hover:bg-muted/50 block rounded-lg border p-4 transition-colors"
									href={`/dashboard/work/purchase-orders/${po.id}`}
									key={po.id}
								>
									<div className="flex items-start justify-between">
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<p className="font-medium">{po.po_number}</p>
												<Badge variant="outline">{po.status}</Badge>
											</div>
											<p className="text-muted-foreground text-sm">
												{po.title}
											</p>
											{po.expected_delivery && (
												<p className="text-muted-foreground text-xs">
													Expected: {formatDate(po.expected_delivery)}
												</p>
											)}
										</div>
										<div className="text-right">
											<p className="font-medium">
												{formatCurrency(po.total_amount)}
											</p>
											<p className="text-muted-foreground text-xs">
												{formatDate(po.created_at)}
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>
			),
		},

		// Performance Metrics
		{
			id: "performance",
			title: "Performance Metrics",
			icon: <TrendingUp className="size-4" />,
			content: (
				<div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm">Total Spend</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-bold">{formatCurrency(totalSpend)}</p>
							<p className="text-muted-foreground text-xs">All-time</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm">Open POs</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-bold">{openPOCount}</p>
							<p className="text-muted-foreground text-xs">
								{formatCurrency(openPOValue)} value
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm">Avg Order Value</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-bold">
								{formatCurrency(averageOrderValue)}
							</p>
							<p className="text-muted-foreground text-xs">
								Per purchase order
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm">Last Order</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-bold">
								{metrics.lastOrderDate
									? formatDate(metrics.lastOrderDate, { preset: "short" })
									: "Never"}
							</p>
							<p className="text-muted-foreground text-xs">Most recent PO</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm">On-Time Delivery</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-bold">{onTimeDeliveryRate}%</p>
							<p className="text-muted-foreground text-xs">
								Delivery performance
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm">Orders (12mo)</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-bold">{purchaseOrders.length}</p>
							<p className="text-muted-foreground text-xs">Last 12 months</p>
						</CardContent>
					</Card>
				</div>
			),
		},

		// Related Jobs
		{
			id: "related-jobs",
			title: "Related Jobs",
			icon: <ShoppingCart className="size-4" />,
			count: relatedJobs.length,
			content: (
				<div className="space-y-4 p-6">
					{relatedJobs.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<ShoppingCart className="text-muted-foreground mb-4 size-12" />
							<p className="text-muted-foreground text-sm">
								No jobs linked to this vendor yet
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{relatedJobs.map((job: any) => (
								<Link
									className="hover:bg-muted/50 block rounded-lg border p-4 transition-colors"
									href={`/dashboard/work/${job.id}`}
									key={job.id}
								>
									<div className="flex items-start justify-between">
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<p className="font-medium">{job.job_number}</p>
												<Badge variant="outline">{job.status}</Badge>
											</div>
											<p className="text-muted-foreground text-sm">
												{job.title}
											</p>
										</div>
										<p className="text-muted-foreground text-xs">
											{formatDate(job.created_at)}
										</p>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>
			),
		},

		// Contacts
		{
			id: "contacts",
			title: "Contacts",
			icon: <User className="size-4" />,
			count: contacts.length,
			actions: (
				<Button
					onClick={() => setIsContactSearchOpen(true)}
					size="sm"
					variant="outline"
				>
					<Plus className="mr-2 size-3.5" />
					Link Contact
				</Button>
			),
			content: (
				<div className="space-y-4 p-6">
					{contacts.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<User className="text-muted-foreground mb-4 size-12" />
							<p className="text-muted-foreground text-sm">
								No contacts added yet
							</p>
							<Button className="mt-4" size="sm" variant="outline">
								Add Contact
							</Button>
						</div>
					) : (
						<div className="grid gap-4 md:grid-cols-2">
							{contacts.map((contact: any) => (
								<Card key={contact.id}>
									<CardHeader className="pb-3">
										<CardTitle className="text-base">
											{contact.first_name} {contact.last_name}
										</CardTitle>
										{contact.title && (
											<p className="text-muted-foreground text-sm">
												{contact.title}
											</p>
										)}
									</CardHeader>
									<CardContent className="space-y-2">
										{contact.email && (
											<a
												className="text-primary flex items-center gap-2 text-sm hover:underline"
												href={`mailto:${contact.email}`}
											>
												<Mail className="size-3" />
												{contact.email}
											</a>
										)}
										{contact.phone && (
											<a
												className="text-primary flex items-center gap-2 text-sm hover:underline"
												href={`tel:${contact.phone}`}
											>
												<Phone className="size-3" />
												{contact.phone}
											</a>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			),
		},
	];

	// Add standard sections with custom actions
	const standardSections: UnifiedAccordionSection[] = [
		{
			id: "notes",
			title: "Notes",
			icon: <FileText className="size-4" />,
			count: notes.length,
			actions: (
				<Button
					onClick={() => setIsNoteDialogOpen(true)}
					size="sm"
					variant="outline"
				>
					<Plus className="mr-2 size-3.5" />
					Add Note
				</Button>
			),
			content: (
				<div className="space-y-4 p-6">
					{notes.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<FileText className="text-muted-foreground mb-4 size-12" />
							<p className="text-muted-foreground text-sm">No notes yet</p>
						</div>
					) : (
						<div className="space-y-3">
							{notes.map((note: any) => (
								<div className="rounded-lg border p-4" key={note.id}>
									<p className="text-sm">{note.content}</p>
									<p className="text-muted-foreground mt-2 text-xs">
										{formatDate(note.created_at)}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			),
		},
		{
			id: "attachments",
			title: "Attachments",
			icon: <Paperclip className="size-4" />,
			count: attachments.length,
			actions: (
				<Button
					onClick={() => setIsAttachmentDialogOpen(true)}
					size="sm"
					variant="outline"
				>
					<Plus className="mr-2 size-3.5" />
					Upload
				</Button>
			),
			content: (
				<div className="space-y-4 p-6">
					{attachments.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Paperclip className="text-muted-foreground mb-4 size-12" />
							<p className="text-muted-foreground text-sm">
								No attachments yet
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{attachments.map((attachment: any) => (
								<div className="rounded-lg border p-4" key={attachment.id}>
									<p className="text-sm font-medium">{attachment.filename}</p>
									<p className="text-muted-foreground text-xs">
										{formatDate(attachment.created_at)}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			),
		},
		{
			id: "activity-log",
			title: "Activity Log",
			icon: <Activity className="size-4" />,
			count: activities.length,
			content: (
				<div className="space-y-4 p-6">
					{activities.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Activity className="text-muted-foreground mb-4 size-12" />
							<p className="text-muted-foreground text-sm">No activity yet</p>
						</div>
					) : (
						<div className="space-y-3">
							{activities.map((activity: any) => (
								<div className="rounded-lg border p-4" key={activity.id}>
									<p className="text-sm">{activity.action}</p>
									<p className="text-muted-foreground text-xs">
										{formatDate(activity.created_at)}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			),
		},
	];

	// Combine custom and standard sections
	const allSections = [...sections, ...standardSections];

	return (
		<>
			<DetailPageContentLayout
				customHeader={
					<div className="space-y-4">
						{/* Title and Status */}
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<h1 className="text-3xl font-bold tracking-tight">
									{vendor.display_name || vendor.name}
								</h1>
								<Badge
									variant={vendor.status === "active" ? "default" : "secondary"}
								>
									{vendor.status}
								</Badge>
							</div>
							<p className="text-muted-foreground">
								{vendor.vendor_number} • {vendor.category || "Vendor"}
							</p>

							{/* Tags */}
							<EntityTags
								entityId={vendor.id}
								entityType="vendor"
								onUpdateTags={handleTagsUpdate}
								tags={tags}
							/>
						</div>
					</div>
				}
				customSections={allSections}
				defaultOpenSection="vendor-info"
				showStandardSections={{
					activities: false,
					notes: false,
					attachments: false,
					relatedItems: false,
				}}
				storageKey="vendor-details"
			/>

			{/* Purchase Order Search Dialog */}
			<CommandDialog onOpenChange={setIsPOSearchOpen} open={isPOSearchOpen}>
				<CommandInput
					onValueChange={setPOSearchQuery}
					placeholder="Search purchase orders by number, title, or amount..."
					value={poSearchQuery}
				/>
				<CommandList>
					<CommandEmpty>
						<div className="flex flex-col items-center gap-3 py-6">
							<Receipt className="text-muted-foreground size-12" />
							<div className="text-center">
								<p className="text-sm font-medium">No purchase orders found</p>
								<p className="text-muted-foreground text-xs">
									Try a different search or create a new one
								</p>
							</div>
						</div>
					</CommandEmpty>

					<CommandGroup heading="Quick Actions">
						<CommandItem
							asChild
							className="p-0 hover:bg-transparent data-[selected=true]:bg-transparent"
						>
							<Link
								className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/12 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-emerald-500/40 transition-all hover:border-emerald-500/60 hover:bg-emerald-500/18"
								href={`/dashboard/work/purchase-orders/new?vendorId=${vendor.id}`}
								onClick={() => setIsPOSearchOpen(false)}
							>
								<div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/40">
									<Plus className="size-4 text-white" />
								</div>
								<div className="flex flex-col">
									<span className="text-sm font-semibold text-emerald-100">
										Create New Purchase Order
									</span>
									<span className="text-xs text-emerald-100/70">
										Start a new PO for this vendor
									</span>
								</div>
							</Link>
						</CommandItem>
					</CommandGroup>

					{availablePurchaseOrders.length > 0 && (
						<>
							<CommandSeparator />
							<CommandGroup
								heading={`Available Purchase Orders (${
									availablePurchaseOrders.filter(
										(po: any) =>
											!poSearchQuery ||
											po.po_number
												?.toLowerCase()
												.includes(poSearchQuery.toLowerCase()) ||
											po.title
												?.toLowerCase()
												.includes(poSearchQuery.toLowerCase()),
									).length
								})`}
							>
								{availablePurchaseOrders
									.filter(
										(po: any) =>
											!poSearchQuery ||
											po.po_number
												?.toLowerCase()
												.includes(poSearchQuery.toLowerCase()) ||
											po.title
												?.toLowerCase()
												.includes(poSearchQuery.toLowerCase()),
									)
									.slice(0, 8)
									.map((po: any) => {
										const statusColors: Record<string, string> = {
											draft:
												"bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
											pending_approval:
												"bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
											approved:
												"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
											ordered:
												"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
											partially_received:
												"bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
										};

										return (
											<CommandItem
												className="px-2 py-3"
												disabled={isLinkingPO}
												key={po.id}
												onSelect={() => handleLinkPurchaseOrder(po.id)}
											>
												<div className="flex w-full items-start gap-3">
													<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm dark:from-slate-800 dark:to-slate-900">
														<Receipt className="size-5 text-slate-600 dark:text-slate-400" />
													</div>
													<div className="flex min-w-0 flex-1 flex-col gap-1.5">
														<div className="flex items-center gap-2">
															<span className="truncate text-sm leading-none font-semibold">
																{po.po_number || po.title || "Untitled"}
															</span>
															<Badge
																className={`shrink-0 px-2 py-0.5 text-[10px] leading-none font-medium ${statusColors[po.status] || statusColors.draft}`}
																variant="outline"
															>
																{po.status?.replace(/_/g, " ")}
															</Badge>
														</div>
														<div className="flex items-center gap-2">
															<span className="text-foreground text-sm font-semibold tabular-nums">
																{formatCurrency(po.total_amount || 0)}
															</span>
															<span className="text-muted-foreground">•</span>
															<span className="text-muted-foreground text-xs">
																{formatDate(po.created_at, { preset: "short" })}
															</span>
														</div>
													</div>
													<div className="text-muted-foreground flex shrink-0 items-center gap-1.5">
														<Link2 className="size-4" />
													</div>
												</div>
											</CommandItem>
										);
									})}
							</CommandGroup>
						</>
					)}
				</CommandList>
			</CommandDialog>

			{/* Contact Search Dialog */}
			<CommandDialog
				onOpenChange={setIsContactSearchOpen}
				open={isContactSearchOpen}
			>
				<CommandInput
					onValueChange={setContactSearchQuery}
					placeholder="Search contacts by name, email, or company..."
					value={contactSearchQuery}
				/>
				<CommandList>
					<CommandEmpty>
						<div className="flex flex-col items-center gap-3 py-6">
							<User className="text-muted-foreground size-12" />
							<div className="text-center">
								<p className="text-sm font-medium">No contacts found</p>
								<p className="text-muted-foreground text-xs">
									Try a different search or create a new contact
								</p>
							</div>
						</div>
					</CommandEmpty>

					<CommandGroup heading="Quick Actions">
						<CommandItem
							className="p-0 hover:bg-transparent data-[selected=true]:bg-transparent"
							onSelect={() => {
								toast.success("Contact creation coming soon");
								setIsContactSearchOpen(false);
							}}
						>
							<div className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/12 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-blue-500/40 transition-all hover:border-blue-500/60 hover:bg-blue-500/18">
								<div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/40">
									<Plus className="size-4 text-white" />
								</div>
								<div className="flex flex-col">
									<span className="text-sm font-semibold text-blue-100">
										Create New Contact
									</span>
									<span className="text-xs text-blue-100/70">
										Add a new contact for this vendor
									</span>
								</div>
							</div>
						</CommandItem>
					</CommandGroup>

					{availableContacts.length > 0 && (
						<>
							<CommandSeparator />
							<CommandGroup
								heading={`Available Contacts (${
									availableContacts.filter(
										(contact: any) =>
											!contactSearchQuery ||
											contact.name
												?.toLowerCase()
												.includes(contactSearchQuery.toLowerCase()) ||
											contact.email
												?.toLowerCase()
												.includes(contactSearchQuery.toLowerCase()) ||
											contact.company_name
												?.toLowerCase()
												.includes(contactSearchQuery.toLowerCase()),
									).length
								})`}
							>
								{availableContacts
									.filter(
										(contact: any) =>
											!contactSearchQuery ||
											contact.name
												?.toLowerCase()
												.includes(contactSearchQuery.toLowerCase()) ||
											contact.email
												?.toLowerCase()
												.includes(contactSearchQuery.toLowerCase()) ||
											contact.company_name
												?.toLowerCase()
												.includes(contactSearchQuery.toLowerCase()),
									)
									.slice(0, 8)
									.map((contact: any) => (
										<CommandItem
											className="px-2 py-3"
											key={contact.id}
											onSelect={() => {
												toast.success("Contact linking coming soon");
												setIsContactSearchOpen(false);
											}}
										>
											<div className="flex w-full items-start gap-3">
												<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 shadow-sm dark:from-blue-900/50 dark:to-blue-950">
													<User className="size-5 text-blue-600 dark:text-blue-400" />
												</div>
												<div className="flex min-w-0 flex-1 flex-col gap-1.5">
													<span className="truncate text-sm leading-none font-semibold">
														{contact.name}
													</span>
													{(contact.title || contact.company_name) && (
														<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
															{contact.title && (
																<span className="font-medium">
																	{contact.title}
																</span>
															)}
															{contact.title && contact.company_name && (
																<span>•</span>
															)}
															{contact.company_name && (
																<span>{contact.company_name}</span>
															)}
														</div>
													)}
													{contact.email && (
														<div className="flex items-center gap-1.5">
															<Mail className="text-muted-foreground size-3" />
															<span className="text-muted-foreground truncate text-xs">
																{contact.email}
															</span>
														</div>
													)}
													{contact.phone && (
														<div className="flex items-center gap-1.5">
															<Phone className="text-muted-foreground size-3" />
															<span className="text-muted-foreground text-xs">
																{contact.phone}
															</span>
														</div>
													)}
												</div>
												<div className="text-muted-foreground flex shrink-0 items-center gap-1.5">
													<Link2 className="size-4" />
												</div>
											</div>
										</CommandItem>
									))}
							</CommandGroup>
						</>
					)}
				</CommandList>
			</CommandDialog>

			{/* Add Note Dialog */}
			<Dialog onOpenChange={setIsNoteDialogOpen} open={isNoteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Note</DialogTitle>
						<DialogDescription>
							Add a note about this vendor for your team.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<Textarea placeholder="Enter note content..." rows={4} />
					</div>
					<DialogFooter>
						<Button
							onClick={() => setIsNoteDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							onClick={() => {
								toast.success("Note functionality coming soon");
								setIsNoteDialogOpen(false);
							}}
						>
							<Save className="mr-2 size-4" />
							Save Note
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Upload Attachment Dialog */}
			<Dialog
				onOpenChange={setIsAttachmentDialogOpen}
				open={isAttachmentDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Upload Attachment</DialogTitle>
						<DialogDescription>
							Upload documents, contracts, or files related to this vendor.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="rounded-2xl border border-dashed border-white/15 bg-zinc-900/70 p-10 text-center shadow-inner shadow-black/40 transition-colors hover:border-white/25 hover:bg-zinc-900/80">
							<Paperclip className="mx-auto mb-4 size-12 text-zinc-400" />
							<p className="text-sm text-zinc-300">
								Drag and drop files here or click to browse
							</p>
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={() => setIsAttachmentDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							onClick={() => {
								toast.success("Upload functionality coming soon");
								setIsAttachmentDialogOpen(false);
							}}
						>
							Upload
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
