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

import { Plus, Star, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
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
  triggerAdd?: number;
};

export function CustomerContactsTable({
  customerId,
  triggerAdd,
}: CustomerContactsTableProps) {
  const [contacts, setContacts] = useState<CustomerContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [itemToArchive, setItemToArchive] = useState<string | null>(null);

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
  }, [loadContacts]);

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
    if (!(formData.firstName && formData.lastName)) {
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
    const result = await removeCustomerContact(contactId);
    if (result.success) {
      loadContacts();
    } else {
      alert(result.error || "Failed to remove contact");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground text-sm">
        Loading contacts...
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
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={6}>
                  <div className="flex flex-col items-center gap-2">
                    <User className="size-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground text-sm">
                      No additional contacts
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    {contact.first_name} {contact.last_name}
                    {contact.is_primary && (
                      <Star
                        className="ml-1 inline-block size-3 text-warning"
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
                      onClick={() => {
                        setItemToArchive(contact.id);
                        setIsArchiveDialogOpen(true);
                      }}
                      size="sm"
                      variant="ghost"
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
              <Label className="font-medium text-sm">Contact Roles</Label>
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
              <Button className="flex-1" onClick={handleAddContact}>
                <Plus className="mr-2 size-4" />
                Add Contact
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
              onClick={async () => {
                if (itemToArchive) {
                  await handleRemoveContact(itemToArchive);
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
