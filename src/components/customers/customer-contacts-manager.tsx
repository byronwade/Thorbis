"use client";

import { Mail, Phone, Plus, Star, Trash2, User, X } from "lucide-react";
import { useState } from "react";
import { addCustomerContact, deleteCustomerContact, updateCustomerContact } from "@/actions/customer-enhancements";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

/**
 * Customer Contacts Manager - Client Component
 *
 * Manages multiple contacts for business customers:
 * - Add/edit/delete contacts
 * - Set primary contact
 * - Mark billing and emergency contacts
 * - Contact preferences
 *
 * Power-user optimized for CSRs
 */

type Contact = {
	id: string;
	first_name: string;
	last_name: string;
	title?: string;
	email: string;
	phone: string;
	secondary_phone?: string;
	is_primary: boolean;
	is_billing_contact: boolean;
	is_emergency_contact: boolean;
	preferred_contact_method: string;
	notes?: string;
};

type CustomerContactsManagerProps = {
	customerId: string;
	initialContacts?: Contact[];
};

export function CustomerContactsManager({ customerId, initialContacts = [] }: CustomerContactsManagerProps) {
	const { toast } = useToast();
	const [contacts, setContacts] = useState<Contact[]>(initialContacts);
	const [showAddForm, setShowAddForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Form state
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		title: "",
		email: "",
		phone: "",
		secondaryPhone: "",
		isPrimary: contacts.length === 0,
		isBillingContact: contacts.length === 0,
		isEmergencyContact: false,
		preferredContactMethod: "email",
		notes: "",
	});

	const resetForm = () => {
		setFormData({
			firstName: "",
			lastName: "",
			title: "",
			email: "",
			phone: "",
			secondaryPhone: "",
			isPrimary: contacts.length === 0,
			isBillingContact: contacts.length === 0,
			isEmergencyContact: false,
			preferredContactMethod: "email",
			notes: "",
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
			formDataObj.set("firstName", formData.firstName);
			formDataObj.set("lastName", formData.lastName);
			formDataObj.set("title", formData.title);
			formDataObj.set("email", formData.email);
			formDataObj.set("phone", formData.phone);
			formDataObj.set("secondaryPhone", formData.secondaryPhone);
			formDataObj.set("isPrimary", formData.isPrimary ? "true" : "false");
			formDataObj.set("isBillingContact", formData.isBillingContact ? "true" : "false");
			formDataObj.set("isEmergencyContact", formData.isEmergencyContact ? "true" : "false");
			formDataObj.set("preferredContactMethod", formData.preferredContactMethod);
			formDataObj.set("notes", formData.notes);

			if (editingId) {
				const result = await updateCustomerContact(editingId, formDataObj);
				if (result.success) {
					// Update local state
					setContacts(
						contacts.map((c) =>
							c.id === editingId
								? {
										...c,
										first_name: formData.firstName,
										last_name: formData.lastName,
										title: formData.title,
										email: formData.email,
										phone: formData.phone,
										secondary_phone: formData.secondaryPhone,
										is_primary: formData.isPrimary,
										is_billing_contact: formData.isBillingContact,
										is_emergency_contact: formData.isEmergencyContact,
										preferred_contact_method: formData.preferredContactMethod,
										notes: formData.notes,
									}
								: c
						)
					);
					resetForm();
					toast.success("Contact updated successfully");
				} else {
					toast.error(result.error || "Failed to update contact");
				}
			} else {
				const result = await addCustomerContact(formDataObj);
				if (result.success) {
					// Add to local state
					const newContact: Contact = {
						id: result.data,
						first_name: formData.firstName,
						last_name: formData.lastName,
						title: formData.title,
						email: formData.email,
						phone: formData.phone,
						secondary_phone: formData.secondaryPhone,
						is_primary: formData.isPrimary,
						is_billing_contact: formData.isBillingContact,
						is_emergency_contact: formData.isEmergencyContact,
						preferred_contact_method: formData.preferredContactMethod,
						notes: formData.notes,
					};
					setContacts([...contacts, newContact]);
					resetForm();
					toast.success("Contact added successfully");
				} else {
					toast.error(result.error || "Failed to add contact");
				}
			}
		} catch (_error) {
			toast.error("An error occurred while saving the contact");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (contact: Contact) => {
		setFormData({
			firstName: contact.first_name,
			lastName: contact.last_name,
			title: contact.title || "",
			email: contact.email,
			phone: contact.phone,
			secondaryPhone: contact.secondary_phone || "",
			isPrimary: contact.is_primary,
			isBillingContact: contact.is_billing_contact,
			isEmergencyContact: contact.is_emergency_contact,
			preferredContactMethod: contact.preferred_contact_method,
			notes: contact.notes || "",
		});
		setEditingId(contact.id);
		setShowAddForm(true);
	};

	const handleDelete = async (contactId: string) => {
		if (!confirm("Are you sure you want to delete this contact?")) {
			return;
		}

		setIsLoading(true);
		try {
			const result = await deleteCustomerContact(contactId);
			if (result.success) {
				setContacts(contacts.filter((c) => c.id !== contactId));
				toast.success("Contact deleted successfully");
			} else {
				toast.error(result.error || "Failed to delete contact");
			}
		} catch (_error) {
			toast.error("An error occurred while deleting the contact");
		} finally {
			setIsLoading(false);
		}
	};

	const getInitials = (contact: Contact) => `${contact.first_name[0] || ""}${contact.last_name[0] || ""}`.toUpperCase();

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<User className="size-5 text-primary" />
						<CardTitle>Business Contacts</CardTitle>
					</div>
					<Badge variant="secondary">
						{contacts.length} contact{contacts.length !== 1 ? "s" : ""}
					</Badge>
				</div>
				<CardDescription>Manage multiple contacts for this business customer</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Existing Contacts */}
				{contacts.map((contact) => (
					<div className="rounded-lg border bg-muted/50 p-4" key={contact.id}>
						<div className="flex items-start justify-between gap-3">
							<div className="flex flex-1 items-start gap-3">
								<Avatar className="size-10">
									<AvatarFallback className={contact.is_primary ? "bg-primary text-primary-foreground" : ""}>
										{getInitials(contact)}
									</AvatarFallback>
								</Avatar>

								<div className="flex-1 space-y-1">
									<div className="flex items-center gap-2">
										<p className="font-semibold">
											{contact.first_name} {contact.last_name}
										</p>
										{contact.is_primary && (
											<Badge className="text-xs" variant="default">
												<Star className="mr-1 size-3" />
												Primary
											</Badge>
										)}
										{contact.is_billing_contact && (
											<Badge className="text-xs" variant="outline">
												Billing
											</Badge>
										)}
										{contact.is_emergency_contact && (
											<Badge className="text-xs" variant="destructive">
												Emergency
											</Badge>
										)}
									</div>

									{contact.title && <p className="text-muted-foreground text-sm">{contact.title}</p>}

									<div className="flex flex-wrap gap-3 text-sm">
										<a
											className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
											href={`tel:${contact.phone}`}
										>
											<Phone className="size-3" />
											{contact.phone}
										</a>
										<a
											className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
											href={`mailto:${contact.email}`}
										>
											<Mail className="size-3" />
											{contact.email}
										</a>
									</div>

									{contact.notes && <p className="text-muted-foreground text-xs">{contact.notes}</p>}
								</div>
							</div>

							{/* Actions */}
							<div className="flex gap-1">
								<Button
									className="h-8 px-2 text-xs"
									disabled={isLoading}
									onClick={() => handleEdit(contact)}
									size="sm"
									type="button"
									variant="ghost"
								>
									Edit
								</Button>
								<Button
									className="h-8 w-8 p-0 text-destructive hover:text-destructive"
									disabled={isLoading || contact.is_primary}
									onClick={() => handleDelete(contact.id)}
									size="sm"
									type="button"
									variant="ghost"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
						</div>
					</div>
				))}

				{/* Add/Edit Form */}
				{showAddForm ? (
					<form className="space-y-4 rounded-lg border bg-card p-4" onSubmit={handleSubmit}>
						<div className="flex items-center justify-between">
							<h4 className="font-semibold text-sm">{editingId ? "Edit Contact" : "Add New Contact"}</h4>
							<Button className="h-8 w-8 p-0" onClick={resetForm} size="sm" type="button" variant="ghost">
								<X className="size-4" />
							</Button>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs" htmlFor="firstName">
									First Name *
								</Label>
								<Input
									className="h-9"
									id="firstName"
									onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
									required
									value={formData.firstName}
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs" htmlFor="lastName">
									Last Name *
								</Label>
								<Input
									className="h-9"
									id="lastName"
									onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
									required
									value={formData.lastName}
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label className="text-xs" htmlFor="title">
								Title/Position
							</Label>
							<Input
								className="h-9"
								id="title"
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
								placeholder="Property Manager, Facilities Director, etc."
								value={formData.title}
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs" htmlFor="email">
									Email *
								</Label>
								<Input
									className="h-9"
									id="email"
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									required
									type="email"
									value={formData.email}
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs" htmlFor="phone">
									Phone *
								</Label>
								<Input
									className="h-9"
									id="phone"
									onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
									required
									type="tel"
									value={formData.phone}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs" htmlFor="secondaryPhone">
									Secondary Phone
								</Label>
								<Input
									className="h-9"
									id="secondaryPhone"
									onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
									type="tel"
									value={formData.secondaryPhone}
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs" htmlFor="preferredMethod">
									Preferred Contact
								</Label>
								<Select
									onValueChange={(value) => setFormData({ ...formData, preferredContactMethod: value })}
									value={formData.preferredContactMethod}
								>
									<SelectTrigger className="h-9" id="preferredMethod">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="email">Email</SelectItem>
										<SelectItem value="phone">Phone</SelectItem>
										<SelectItem value="sms">SMS</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Flags */}
						<div className="space-y-2 rounded-lg border bg-muted/50 p-3">
							<div className="flex items-center justify-between">
								<Label className="text-xs" htmlFor="isPrimary">
									Primary Contact
								</Label>
								<Switch
									checked={formData.isPrimary}
									id="isPrimary"
									onCheckedChange={(checked) => setFormData({ ...formData, isPrimary: checked })}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label className="text-xs" htmlFor="isBilling">
									Billing Contact
								</Label>
								<Switch
									checked={formData.isBillingContact}
									id="isBilling"
									onCheckedChange={(checked) => setFormData({ ...formData, isBillingContact: checked })}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label className="text-xs" htmlFor="isEmergency">
									Emergency Contact
								</Label>
								<Switch
									checked={formData.isEmergencyContact}
									id="isEmergency"
									onCheckedChange={(checked) => setFormData({ ...formData, isEmergencyContact: checked })}
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label className="text-xs" htmlFor="notes">
								Notes
							</Label>
							<Textarea
								className="text-sm"
								id="notes"
								onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
								placeholder="Additional notes about this contact..."
								rows={2}
								value={formData.notes}
							/>
						</div>

						<div className="flex gap-2">
							<Button className="flex-1" disabled={isLoading} size="sm" type="submit">
								{isLoading ? "Saving..." : editingId ? "Update Contact" : "Add Contact"}
							</Button>
							<Button disabled={isLoading} onClick={resetForm} size="sm" type="button" variant="ghost">
								Cancel
							</Button>
						</div>
					</form>
				) : (
					<Button className="w-full" onClick={() => setShowAddForm(true)} size="sm" type="button" variant="outline">
						<Plus className="mr-2 size-4" />
						Add Contact
					</Button>
				)}

				{contacts.length === 0 && !showAddForm && (
					<div className="py-6 text-center">
						<User className="mx-auto mb-2 size-8 text-muted-foreground opacity-50" />
						<p className="text-muted-foreground text-sm">No contacts added yet</p>
						<p className="text-muted-foreground text-xs">Add contacts for business customers</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
