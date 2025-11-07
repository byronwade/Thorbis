"use client";

/**
 * Customer Contacts Table
 *
 * Manages multiple contacts for a customer with:
 * - Multiple emails and phone numbers
 * - Contact titles and roles
 * - Primary/billing/emergency flags
 * - Add/edit/remove functionality
 */

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getCustomerContacts,
  addCustomerContact,
  removeCustomerContact,
  type CustomerContact,
} from "@/actions/customer-contacts";
import { User, Mail, Phone, Plus, Trash2, Star } from "lucide-react";

interface CustomerContactsTableProps {
  customerId: string;
  triggerAdd?: number;
}

export function CustomerContactsTable({ customerId, triggerAdd }: CustomerContactsTableProps) {
  const [contacts, setContacts] = useState<CustomerContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Form state
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

  useEffect(() => {
    loadContacts();
  }, [customerId]);

  // Respond to external trigger
  useEffect(() => {
    if (triggerAdd && triggerAdd > 0) {
      setShowAddDialog(true);
    }
  }, [triggerAdd]);

  const loadContacts = async () => {
    setIsLoading(true);
    const result = await getCustomerContacts(customerId);
    if (result.success) {
      setContacts(result.data || []);
    }
    setIsLoading(false);
  };

  const handleAddContact = async () => {
    if (!formData.firstName || !formData.lastName) {
      alert("First name and last name are required");
      return;
    }

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
      loadContacts();
    } else {
      alert(result.error || "Failed to add contact");
    }
  };

  const handleRemoveContact = async (contactId: string) => {
    if (!confirm("Remove this contact?")) return;

    const result = await removeCustomerContact(contactId);
    if (result.success) {
      loadContacts();
    } else {
      alert(result.error || "Failed to remove contact");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground text-sm">Loading contacts...</div>;
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
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <User className="size-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground text-sm">No additional contacts</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    {contact.first_name} {contact.last_name}
                    {contact.is_primary && (
                      <Star className="ml-1 inline-block size-3 text-warning" fill="currentColor" />
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{contact.title || "—"}</TableCell>
                  <TableCell className="text-sm">
                    {contact.email ? (
                      <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                        {contact.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {contact.phone ? (
                      <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                        {contact.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contact.is_billing_contact && (
                        <Badge variant="secondary" className="text-xs">Billing</Badge>
                      )}
                      {contact.is_emergency_contact && (
                        <Badge variant="destructive" className="text-xs">Emergency</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveContact(contact.id)}
                      className="size-8 p-0"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Contact Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Smith"
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Mr., Ms., Dr., etc."
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary Phone</Label>
                <Input
                  type="tel"
                  value={formData.secondaryPhone}
                  onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                  placeholder="(555) 987-6543"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Contact Roles</Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPrimary"
                    checked={formData.isPrimary}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPrimary: !!checked })}
                  />
                  <label htmlFor="isPrimary" className="cursor-pointer text-sm">
                    Primary Contact
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isBilling"
                    checked={formData.isBillingContact}
                    onCheckedChange={(checked) => setFormData({ ...formData, isBillingContact: !!checked })}
                  />
                  <label htmlFor="isBilling" className="cursor-pointer text-sm">
                    Billing Contact
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isEmergency"
                    checked={formData.isEmergencyContact}
                    onCheckedChange={(checked) => setFormData({ ...formData, isEmergencyContact: !!checked })}
                  />
                  <label htmlFor="isEmergency" className="cursor-pointer text-sm">
                    Emergency Contact
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleAddContact} className="flex-1">
                <Plus className="mr-2 size-4" />
                Add Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
