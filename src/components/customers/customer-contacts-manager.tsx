"use client";

import { Mail, Phone, Plus, Star, Trash2, User, X } from "lucide-react";
import { useState } from "react";
import { addCustomerContact, deleteCustomerContact, updateCustomerContact } from "@/actions/customer-enhancements";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

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

export function CustomerContactsManager({
  customerId,
  initialContacts = [],
}: CustomerContactsManagerProps) {
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
          setContacts(contacts.map(c => c.id === editingId ? {
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
          } : c));
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
    } catch (error) {
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
    if (!confirm("Are you sure you want to delete this contact?")) return;

    setIsLoading(true);
    try {
      const result = await deleteCustomerContact(contactId);
      if (result.success) {
        setContacts(contacts.filter(c => c.id !== contactId));
        toast.success("Contact deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete contact");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the contact");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (contact: Contact) => {
    return `${contact.first_name[0] || ""}${contact.last_name[0] || ""}`.toUpperCase();
  };

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
        <CardDescription>
          Manage multiple contacts for this business customer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Contacts */}
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="rounded-lg border bg-muted/50 p-4"
          >
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
                      <Badge variant="default" className="text-xs">
                        <Star className="mr-1 size-3" />
                        Primary
                      </Badge>
                    )}
                    {contact.is_billing_contact && (
                      <Badge variant="outline" className="text-xs">
                        Billing
                      </Badge>
                    )}
                    {contact.is_emergency_contact && (
                      <Badge variant="destructive" className="text-xs">
                        Emergency
                      </Badge>
                    )}
                  </div>

                  {contact.title && (
                    <p className="text-muted-foreground text-sm">{contact.title}</p>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm">
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="size-3" />
                      {contact.phone}
                    </a>
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Mail className="size-3" />
                      {contact.email}
                    </a>
                  </div>

                  {contact.notes && (
                    <p className="text-muted-foreground text-xs">{contact.notes}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(contact)}
                  disabled={isLoading}
                  className="h-8 px-2 text-xs"
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(contact.id)}
                  disabled={isLoading || contact.is_primary}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Add/Edit Form */}
        {showAddForm ? (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">
                {editingId ? "Edit Contact" : "Add New Contact"}
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="h-8 w-8 p-0"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs">Title/Position</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Property Manager, Facilities Director, etc."
                className="h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="secondaryPhone" className="text-xs">Secondary Phone</Label>
                <Input
                  id="secondaryPhone"
                  type="tel"
                  value={formData.secondaryPhone}
                  onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="preferredMethod" className="text-xs">Preferred Contact</Label>
                <Select
                  value={formData.preferredContactMethod}
                  onValueChange={(value) => setFormData({ ...formData, preferredContactMethod: value })}
                >
                  <SelectTrigger id="preferredMethod" className="h-9">
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
                <Label htmlFor="isPrimary" className="text-xs">Primary Contact</Label>
                <Switch
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPrimary: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isBilling" className="text-xs">Billing Contact</Label>
                <Switch
                  id="isBilling"
                  checked={formData.isBillingContact}
                  onCheckedChange={(checked) => setFormData({ ...formData, isBillingContact: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isEmergency" className="text-xs">Emergency Contact</Label>
                <Switch
                  id="isEmergency"
                  checked={formData.isEmergencyContact}
                  onCheckedChange={(checked) => setFormData({ ...formData, isEmergencyContact: checked })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                placeholder="Additional notes about this contact..."
                className="text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Saving..." : editingId ? "Update Contact" : "Add Contact"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetForm}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="w-full"
          >
            <Plus className="mr-2 size-4" />
            Add Contact
          </Button>
        )}

        {contacts.length === 0 && !showAddForm && (
          <div className="py-6 text-center">
            <User className="mx-auto mb-2 size-8 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-sm">
              No contacts added yet
            </p>
            <p className="text-muted-foreground text-xs">
              Add contacts for business customers
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
