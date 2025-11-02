"use client";

import { Loader2, Save, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProperty } from "@/actions/properties";
import { cn } from "@/lib/utils";

/**
 * Inline Property Form - Quick Property Creation
 *
 * Features:
 * - Minimal required fields (address, city, state, zip)
 * - Optional property name, access notes, gate code
 * - Linked to selected customer
 * - Server Action integration
 * - Auto-collapse after successful creation
 */

type PropertyFormData = {
  customerId: string;
  name: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  accessNotes: string;
  gateCode: string;
};

type InlinePropertyFormProps = {
  customerId: string;
  customerName: string;
  onSuccess: (property: any) => void;
  onCancel: () => void;
  className?: string;
};

export function InlinePropertyForm({
  customerId,
  customerName,
  onSuccess,
  onCancel,
  className,
}: InlinePropertyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<PropertyFormData>({
    customerId,
    name: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    accessNotes: "",
    gateCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Create FormData for server action
    const serverFormData = new FormData();
    serverFormData.append("customerId", customerId);
    serverFormData.append("name", formData.name || formData.address); // Use address as name if not provided
    serverFormData.append("address", formData.address);
    if (formData.address2) serverFormData.append("address2", formData.address2);
    serverFormData.append("city", formData.city);
    serverFormData.append("state", formData.state);
    serverFormData.append("zipCode", formData.zipCode);
    if (formData.accessNotes) serverFormData.append("notes", formData.accessNotes);

    const result = await createProperty(serverFormData);

    if (result.success && result.data) {
      // Construct property object
      const newProperty = {
        id: result.data,
        customer_id: customerId,
        name: formData.name || formData.address,
        address: formData.address,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        access_notes: formData.accessNotes,
        gate_code: formData.gateCode,
        customers: null, // Will be populated if needed
      };
      onSuccess(newProperty);
    } else {
      setErrors({ submit: (result as any).error || "Failed to create property" });
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof PropertyFormData, value: string) => {
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
        "rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-4",
        className
      )}
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Add Property for {customerName}</h3>
          <p className="text-muted-foreground text-xs">
            Create a service location for this customer
          </p>
        </div>
        <Button onClick={onCancel} size="sm" type="button" variant="ghost">
          <X className="size-4" />
        </Button>
      </div>

      {errors.submit && (
        <div className="rounded-md bg-destructive/10 p-3">
          <p className="text-destructive text-sm">{errors.submit}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="inline-prop-name">Property Name (Optional)</Label>
        <Input
          id="inline-prop-name"
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Main Office, Home, Warehouse, etc."
          value={formData.name}
        />
        <p className="text-muted-foreground text-xs">
          If blank, address will be used as the name
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inline-prop-address">
          Street Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="inline-prop-address"
          onChange={(e) => updateField("address", e.target.value)}
          placeholder="123 Main Street"
          value={formData.address}
        />
        {errors.address && (
          <p className="text-destructive text-xs">{errors.address}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="inline-prop-address2">Unit / Suite (Optional)</Label>
        <Input
          id="inline-prop-address2"
          onChange={(e) => updateField("address2", e.target.value)}
          placeholder="Apt 4B, Suite 200, etc."
          value={formData.address2}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="inline-prop-city">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="inline-prop-city"
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="Los Angeles"
            value={formData.city}
          />
          {errors.city && (
            <p className="text-destructive text-xs">{errors.city}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inline-prop-state">
            State <span className="text-destructive">*</span>
          </Label>
          <Input
            id="inline-prop-state"
            maxLength={2}
            onChange={(e) => updateField("state", e.target.value.toUpperCase())}
            placeholder="CA"
            value={formData.state}
          />
          {errors.state && (
            <p className="text-destructive text-xs">{errors.state}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inline-prop-zip">
            ZIP Code <span className="text-destructive">*</span>
          </Label>
          <Input
            id="inline-prop-zip"
            onChange={(e) => updateField("zipCode", e.target.value)}
            placeholder="90210"
            value={formData.zipCode}
          />
          {errors.zipCode && (
            <p className="text-destructive text-xs">{errors.zipCode}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inline-prop-access">Access Notes (Optional)</Label>
        <Textarea
          id="inline-prop-access"
          onChange={(e) => updateField("accessNotes", e.target.value)}
          placeholder="Gate code, parking instructions, special access requirements..."
          rows={2}
          value={formData.accessNotes}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inline-prop-gate">Gate Code (Optional)</Label>
        <Input
          id="inline-prop-gate"
          onChange={(e) => updateField("gateCode", e.target.value)}
          placeholder="#1234"
          value={formData.gateCode}
        />
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
          Create Property
        </Button>
      </div>
    </form>
  );
}
