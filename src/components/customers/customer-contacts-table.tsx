"use client";

/**
 * Customer Contacts Table - Server Actions + useOptimistic (React 19)
 *
 * Performance optimizations:
 * - useOptimistic for instant UI feedback
 * - Server Actions for mutations with auto-revalidation
 * - No external state management needed
 *
 * Manages multiple contacts for a customer with:
 * - Multiple emails and phone numbers
 * - Contact titles and roles
 * - Primary/billing/emergency flags
 * - Add/edit/remove functionality
 */

import { Plus, Star, Trash2, User } from "lucide-react";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import {
	addCustomerContact,
	type CustomerContact,
	getCustomerContacts,
	removeCustomerContact,
} from "@/actions/customer-contacts";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type CustomerContactsTableProps = {
	customerId: string;
	initialContacts?: CustomerContact[];
	triggerAdd?: number;
};

export function CustomerContactsTable({
	customerId,
	initialContacts = [],
	triggerAdd,
}: CustomerContactsTableProps) {
	// Local UI state
	const [showAddDialog, setShowAddDialog] = useState(false);
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [itemToArchive, setItemToArchive] = useState<string | null>(null);

	// Form state (local to dialog)
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		title: "",
		email: "",
		phone: "",
		secondaryPhone: "",
		isPrimary: false,
		isBillingContact: false,
		isEmergencyContact: false,
	});

	// Data state
	const [contacts, setContacts] = useState<CustomerContact[]>(initialContacts);
	const [isLoading, setIsLoading] = useState(initialContacts.length === 0);
	const [error, setError] = useState<string | null>(null);

	const [isPending, startTransition] = useTransition();
	const [optimisticContacts, updateOptimisticContacts] = useOptimistic(
		contacts,
		(state, update: CustomerContact | { id: string; action: "delete" }) => {
			if ("action" in update && update.action === "delete") {
				return state.filter((contact) => contact.id !== update.id);
			}
			return [...state, update as CustomerContact];
		},
	);

	// Load contacts on mount
	useEffect(() => {
		const loadContacts = async () => {
			setIsLoading(true);
			setError(null);

			const result = await getCustomerContacts(customerId);

			if (!result.success) {
				setError(result.error || "Failed to fetch contacts");
			} else {
				setContacts(result.data || []);
			}

			setIsLoading(false);
		};

		if (initialContacts.length === 0) {
			loadContacts();
		}
	}, [customerId, initialContacts.length]);

	// Respond to external trigger
	useEffect(() => {
		if (triggerAdd && triggerAdd > 0) {
			setShowAddDialog(true);
		}
	}, [triggerAdd]);

	// Handlers
	const handleAddContact = async () => {
		if (!(formData.firstName && formData.lastName)) {
			toast.error("First name and last name are required");
			return;
		}

		const tempContact: CustomerContact = {
			id: `temp-${Date.now()}`,
			customer_id: customerId,
			company_id: "",
			first_name: formData.firstName,
			last_name: formData.lastName,
			title: formData.title || null,
			email: formData.email || null,
			phone: formData.phone || null,
			secondary_phone: formData.secondaryPhone || null,
			is_primary: formData.isPrimary,
			is_billing_contact: formData.isBillingContact,
			is_emergency_contact: formData.isEmergencyContact,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			deleted_at: null,
		};

		startTransition(async () => {
			updateOptimisticContacts(tempContact);

			const result = await addCustomerContact({
				customerId,
				firstName: formData.firstName,
				lastName: formData.lastName,
				title: formData.title || undefined,
				email: formData.email || undefined,
				phone: formData.phone || undefined,
				secondaryPhone: formData.secondaryPhone || undefined,
				isPrimary: formData.isPrimary,
				isBillingContact: formData.isBillingContact,
				isEmergencyContact: formData.isEmergencyContact,
			});

			if (result.success) {
				toast.success("Contact added successfully");
				// Reset form
				setFormData({
					firstName: "",
					lastName: "",
					title: "",
					email: "",
					phone: "",
					secondaryPhone: "",
					isPrimary: false,
					isBillingContact: false,
					isEmergencyContact: false,
				});
				setShowAddDialog(false);
				// Refresh contacts
				const refreshResult = await getCustomerContacts(customerId);
				if (refreshResult.success) {
					setContacts(refreshResult.data || []);
				}
			} else {
				toast.error(result.error || "Failed to add contact");
				// Revert optimistic update
				setContacts((prev) => prev.filter((c) => c.id !== tempContact.id));
			}
		});
	};

	const handleRemoveContact = async (contactId: string) => {
		startTransition(async () => {
			updateOptimisticContacts({ id: contactId, action: "delete" });

			const result = await removeCustomerContact(contactId);

			if (result.success) {
				toast.success("Contact archived successfully");
			} else {
				toast.error(result.error || "Failed to remove contact");
			}

			// Refresh contacts
			const refreshResult = await getCustomerContacts(customerId);
			if (refreshResult.success) {
				setContacts(refreshResult.data || []);
			}
		});
	};

	// Loading skeleton
	if (isLoading && contacts.length === 0) {
		return (
			<div className="space-y-4">
				<div className="rounded-lg border p-4">
					<Skeleton className="mb-4 h-8 w-full" />
					<Skeleton className="mb-2 h-12 w-full" />
					<Skeleton className="mb-2 h-12 w-full" />
					<Skeleton className="h-12 w-full" />
				</div>
			</div>
		);
	}

	// Error state
	if (error && contacts.length === 0) {
		return (
			<div className="border-destructive/50 bg-destructive/10 flex min-h-[400px] items-center justify-center rounded-lg border p-8">
				<div className="text-center">
					<p className="text-destructive mb-2 font-semibold">
						Failed to load contacts
					</p>
					<p className="text-muted-foreground text-sm">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Contacts Table */}
			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Title</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>Role</TableHead>
							<TableHead className="w-[80px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{optimisticContacts.length === 0 ? (
							<TableRow>
								<TableCell className="h-24 text-center" colSpan={6}>
									<div className="flex flex-col items-center gap-2">
										<User className="text-muted-foreground/50 size-8" />
										<p className="text-muted-foreground text-sm">
											No additional contacts
										</p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							optimisticContacts.map((contact) => {
								const isTemp = contact.id.startsWith("temp-");
								return (
									<TableRow
										key={contact.id}
										style={{ opacity: isTemp ? 0.5 : 1 }}
									>
										<TableCell className="font-medium">
											{contact.first_name} {contact.last_name}
											{contact.is_primary && (
												<Star
													className="text-warning ml-1 inline-block size-3"
													fill="currentColor"
												/>
											)}
										</TableCell>
										<TableCell className="text-sm">
											{contact.title || "—"}
										</TableCell>
										<TableCell className="text-sm">
											{contact.email ? (
												<a
													className="text-primary hover:underline"
													href={`mailto:${contact.email}`}
												>
													{contact.email}
												</a>
											) : (
												"—"
											)}
										</TableCell>
										<TableCell className="text-sm">
											{contact.phone ? (
												<a
													className="text-primary hover:underline"
													href={`tel:${contact.phone}`}
												>
													{contact.phone}
												</a>
											) : (
												"—"
											)}
										</TableCell>
										<TableCell>
											<div className="flex flex-wrap gap-1">
												{contact.is_billing_contact && (
													<Badge className="text-xs" variant="secondary">
														Billing
													</Badge>
												)}
												{contact.is_emergency_contact && (
													<Badge className="text-xs" variant="destructive">
														Emergency
													</Badge>
												)}
											</div>
										</TableCell>
										<TableCell>
											<Button
												className="size-8 p-0"
												disabled={isPending || isTemp}
												onClick={() => {
													setItemToArchive(contact.id);
													setIsArchiveDialogOpen(true);
												}}
												size="sm"
												variant="ghost"
											>
												<Trash2 className="text-destructive size-4" />
											</Button>
										</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</div>

			{/* Add Contact Dialog */}
			<Dialog onOpenChange={setShowAddDialog} open={showAddDialog}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Add Contact</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label>First Name *</Label>
								<Input
									onChange={(e) =>
										setFormData({ ...formData, firstName: e.target.value })
									}
									placeholder="John"
									value={formData.firstName}
								/>
							</div>
							<div className="space-y-2">
								<Label>Last Name *</Label>
								<Input
									onChange={(e) =>
										setFormData({ ...formData, lastName: e.target.value })
									}
									placeholder="Smith"
									value={formData.lastName}
								/>
							</div>
							<div className="space-y-2">
								<Label>Title</Label>
								<Input
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									placeholder="Mr., Ms., Dr., etc."
									value={formData.title}
								/>
							</div>
							<div className="space-y-2">
								<Label>Email</Label>
								<Input
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									placeholder="john@example.com"
									type="email"
									value={formData.email}
								/>
							</div>
							<div className="space-y-2">
								<Label>Phone</Label>
								<Input
									onChange={(e) =>
										setFormData({ ...formData, phone: e.target.value })
									}
									placeholder="(555) 123-4567"
									type="tel"
									value={formData.phone}
								/>
							</div>
							<div className="space-y-2">
								<Label>Secondary Phone</Label>
								<Input
									onChange={(e) =>
										setFormData({ ...formData, secondaryPhone: e.target.value })
									}
									placeholder="(555) 987-6543"
									type="tel"
									value={formData.secondaryPhone}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-medium">Contact Roles</Label>
							<div className="flex flex-wrap gap-4">
								<div className="flex items-center space-x-2">
									<Checkbox
										checked={formData.isPrimary}
										id="isPrimary"
										onCheckedChange={(checked) =>
											setFormData({ ...formData, isPrimary: !!checked })
										}
									/>
									<label className="cursor-pointer text-sm" htmlFor="isPrimary">
										Primary Contact
									</label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										checked={formData.isBillingContact}
										id="isBilling"
										onCheckedChange={(checked) =>
											setFormData({ ...formData, isBillingContact: !!checked })
										}
									/>
									<label className="cursor-pointer text-sm" htmlFor="isBilling">
										Billing Contact
									</label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										checked={formData.isEmergencyContact}
										id="isEmergency"
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												isEmergencyContact: !!checked,
											})
										}
									/>
									<label
										className="cursor-pointer text-sm"
										htmlFor="isEmergency"
									>
										Emergency Contact
									</label>
								</div>
							</div>
						</div>

						<div className="flex gap-2 pt-4">
							<Button
								className="flex-1"
								onClick={() => setShowAddDialog(false)}
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								className="flex-1"
								disabled={isPending}
								onClick={handleAddContact}
							>
								<Plus className="mr-2 size-4" />
								{isPending ? "Adding..." : "Add Contact"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Archive Contact Dialog */}
			<AlertDialog
				onOpenChange={setIsArchiveDialogOpen}
				open={isArchiveDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Archive Contact?</AlertDialogTitle>
						<AlertDialogDescription>
							This contact will be archived and can be restored within 90 days.
							After 90 days, it will be permanently deleted.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={() => {
								if (itemToArchive) {
									handleRemoveContact(itemToArchive);
								}
							}}
						>
							Archive
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
