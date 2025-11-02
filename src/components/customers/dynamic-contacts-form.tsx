"use client";

/**
 * DynamicContactsForm Component
 *
 * Manages multiple contacts for a customer with add/remove functionality
 * - Primary contact (required)
 * - Additional contacts (optional, can add multiple)
 * - Stores as JSON array in hidden input for server action
 */

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SmartContactInput } from "@/components/customers/smart-contact-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isPrimary: boolean;
};

export function DynamicContactsForm() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "primary",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "primary",
      isPrimary: true,
    },
  ]);

  const addContact = () => {
    setContacts([
      ...contacts,
      {
        id: `contact-${Date.now()}`,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "billing",
        isPrimary: false,
      },
    ]);
  };

  const removeContact = (id: string) => {
    if (id === "primary") return; // Can't remove primary contact
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const updateContact = (id: string, field: keyof Contact, value: string) => {
    setContacts(
      contacts.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    );
  };

  return (
    <div className="space-y-4">
      {contacts.map((contact, index) => (
        <div
          className="space-y-4 rounded-lg border bg-muted/30 p-6"
          key={contact.id}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {contact.isPrimary && (
                <Badge className="bg-primary/10 text-primary" variant="outline">
                  Primary
                </Badge>
              )}
              <h3 className="font-semibold">
                {contact.isPrimary ? "Primary Contact" : `Additional Contact ${index}`}
              </h3>
            </div>
            {!contact.isPrimary && (
              <Button
                onClick={() => removeContact(contact.id)}
                size="sm"
                type="button"
                variant="ghost"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            )}
          </div>

          {/* Use Smart Input for Primary Contact */}
          {contact.isPrimary ? (
            <SmartContactInput
              initialContact={{
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                phone: contact.phone,
              }}
              onContactChange={(data) => {
                updateContact(contact.id, "firstName", data.firstName);
                updateContact(contact.id, "lastName", data.lastName);
                updateContact(contact.id, "email", data.email);
                updateContact(contact.id, "phone", data.phone);
              }}
              showAiHelper={true}
            />
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`${contact.id}-firstName`}>
                    First Name
                  </Label>
                  <Input
                    id={`${contact.id}-firstName`}
                    onChange={(e) =>
                      updateContact(contact.id, "firstName", e.target.value)
                    }
                    placeholder="John"
                    type="text"
                    value={contact.firstName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${contact.id}-lastName`}>
                    Last Name
                  </Label>
                  <Input
                    id={`${contact.id}-lastName`}
                    onChange={(e) =>
                      updateContact(contact.id, "lastName", e.target.value)
                    }
                    placeholder="Smith"
                    type="text"
                    value={contact.lastName}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`${contact.id}-email`}>Email</Label>
                  <Input
                    id={`${contact.id}-email`}
                    onChange={(e) =>
                      updateContact(contact.id, "email", e.target.value)
                    }
                    placeholder="john@example.com"
                    type="email"
                    value={contact.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${contact.id}-phone`}>Phone</Label>
                  <Input
                    id={`${contact.id}-phone`}
                    onChange={(e) =>
                      updateContact(contact.id, "phone", e.target.value)
                    }
                    placeholder="(555) 123-4567"
                    type="tel"
                    value={contact.phone}
                  />
                </div>
              </div>
            </>
          )}

          {!contact.isPrimary && (
            <div className="space-y-2">
              <Label htmlFor={`${contact.id}-role`}>Role</Label>
              <Select
                onValueChange={(value) =>
                  updateContact(contact.id, "role", value)
                }
                value={contact.role}
              >
                <SelectTrigger id={`${contact.id}-role`}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="billing">Billing Contact</SelectItem>
                  <SelectItem value="technical">Technical Contact</SelectItem>
                  <SelectItem value="operations">Operations Contact</SelectItem>
                  <SelectItem value="emergency">Emergency Contact</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      ))}

      <Button
        className="w-full"
        onClick={addContact}
        type="button"
        variant="outline"
      >
        <Plus className="mr-2 size-4" />
        Add Additional Contact
      </Button>

      {/* Hidden input to pass contacts data to server action */}
      <input
        name="contacts"
        type="hidden"
        value={JSON.stringify(contacts)}
      />
    </div>
  );
}
