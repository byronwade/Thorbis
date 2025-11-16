"use client";

import { Loader2, Save, X } from "lucide-react";
import { useState } from "react";
import { createCustomer } from "@/actions/customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Inline Customer Form - Quick Customer Creation
 *
 * Features:
 * - Minimal required fields for fast entry
 * - Inline validation
 * - Optimistic UI updates
 * - Server Action integration
 * - Auto-collapse after successful creation
 */

type CustomerFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  type: "residential" | "commercial" | "industrial";
};

type InlineCustomerFormProps = {
  onSuccess: (customer: any) => void;
  onCancel: () => void;
  className?: string;
};

export function InlineCustomerForm({
  onSuccess,
  onCancel,
  className,
}: InlineCustomerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    type: "residential",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Create FormData for server action
    const serverFormData = new FormData();
    serverFormData.append("firstName", formData.firstName);
    serverFormData.append("lastName", formData.lastName);
    serverFormData.append("email", formData.email);
    serverFormData.append("phone", formData.phone);
    serverFormData.append("type", formData.type);
    if (formData.companyName) {
      serverFormData.append("companyName", formData.companyName);
    }

    const result = await createCustomer(serverFormData);

    if (result.success && result.data) {
      // Construct customer object from created data
      const newCustomer = {
        id: result.data,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.companyName,
        type: formData.type,
      };
      onSuccess(newCustomer);
    } else {
      setErrors({
        submit: (result as any).error || "Failed to create customer",
      });
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <form
      className={cn(
        "space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4",
        className
      )}
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Create New Customer</h3>
        <Button onClick={onCancel} size="sm" type="button" variant="ghost">
          <X className="size-4" />
        </Button>
      </div>

      {errors.submit && (
        <div className="rounded-md bg-destructive/10 p-3">
          <p className="text-destructive text-sm">{errors.submit}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="inline-first-name">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="inline-first-name"
            onChange={(e) => updateField("firstName", e.target.value)}
            placeholder="John"
            value={formData.firstName}
          />
          {errors.firstName && (
            <p className="text-destructive text-xs">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inline-last-name">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="inline-last-name"
            onChange={(e) => updateField("lastName", e.target.value)}
            placeholder="Smith"
            value={formData.lastName}
          />
          {errors.lastName && (
            <p className="text-destructive text-xs">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inline-email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="inline-email"
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="john.smith@example.com"
          type="email"
          value={formData.email}
        />
        {errors.email && (
          <p className="text-destructive text-xs">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="inline-phone">
          Phone <span className="text-destructive">*</span>
        </Label>
        <Input
          id="inline-phone"
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder="(555) 123-4567"
          type="tel"
          value={formData.phone}
        />
        {errors.phone && (
          <p className="text-destructive text-xs">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="inline-company-name">Company Name (Optional)</Label>
        <Input
          id="inline-company-name"
          onChange={(e) => updateField("companyName", e.target.value)}
          placeholder="Acme Inc."
          value={formData.companyName}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inline-type">
          Customer Type <span className="text-destructive">*</span>
        </Label>
        <Select
          onValueChange={(value) =>
            updateField("type", value as CustomerFormData["type"])
          }
          value={formData.type}
        >
          <SelectTrigger id="inline-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="industrial">Industrial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          disabled={isLoading}
          onClick={onCancel}
          size="sm"
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button disabled={isLoading} size="sm" type="submit">
          {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
          <Save className="mr-2 size-4" />
          Create Customer
        </Button>
      </div>
    </form>
  );
}
