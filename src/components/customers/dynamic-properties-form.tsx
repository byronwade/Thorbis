"use client";

/**
 * DynamicPropertiesForm Component
 *
 * Manages multiple properties/addresses for a customer
 * - Primary address (required)
 * - Additional properties (optional, can add multiple)
 * - Stores as JSON array in hidden input for server action
 */

import { MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SmartAddressInput } from "@/components/customers/smart-address-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Property = {
  id: string;
  name: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  propertyType: string;
  isPrimary: boolean;
  notes: string;
};

export function DynamicPropertiesForm() {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: "primary",
      name: "Primary Location",
      address: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      propertyType: "residential",
      isPrimary: true,
      notes: "",
    },
  ]);

  const addProperty = () => {
    setProperties([
      ...properties,
      {
        id: `property-${Date.now()}`,
        name: "",
        address: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
        propertyType: "residential",
        isPrimary: false,
        notes: "",
      },
    ]);
  };

  const removeProperty = (id: string) => {
    if (id === "primary") return; // Can't remove primary property
    setProperties(properties.filter((p) => p.id !== id));
  };

  const updateProperty = (
    id: string,
    field: keyof Property,
    value: string
  ) => {
    setProperties(
      properties.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  return (
    <div className="space-y-4">
      {properties.map((property, index) => (
        <div
          className="space-y-4 rounded-lg border bg-muted/30 p-6"
          key={property.id}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {property.isPrimary && (
                <Badge className="bg-primary/10 text-primary" variant="outline">
                  Primary
                </Badge>
              )}
              <MapPin className="size-4 text-muted-foreground" />
              <h3 className="font-semibold">
                {property.isPrimary
                  ? "Primary Address"
                  : `Additional Property ${index}`}
              </h3>
            </div>
            {!property.isPrimary && (
              <Button
                onClick={() => removeProperty(property.id)}
                size="sm"
                type="button"
                variant="ghost"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            )}
          </div>

          {!property.isPrimary && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${property.id}-name`}>
                  Property Name
                </Label>
                <Input
                  id={`${property.id}-name`}
                  onChange={(e) =>
                    updateProperty(property.id, "name", e.target.value)
                  }
                  placeholder="e.g., Warehouse, Store #2, Rental Property"
                  type="text"
                  value={property.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${property.id}-propertyType`}>
                  Property Type
                </Label>
                <Select
                  onValueChange={(value) =>
                    updateProperty(property.id, "propertyType", value)
                  }
                  value={property.propertyType}
                >
                  <SelectTrigger id={`${property.id}-propertyType`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="rental">Rental Property</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Use Smart Address Input */}
          <SmartAddressInput
            initialAddress={{
              address: property.address,
              address2: property.address2,
              city: property.city,
              state: property.state,
              zipCode: property.zipCode,
              country: property.country,
            }}
            label={property.isPrimary ? "Primary Address (Optional)" : "Property Address"}
            onAddressChange={(data) => {
              updateProperty(property.id, "address", data.address);
              updateProperty(property.id, "address2", data.address2 || "");
              updateProperty(property.id, "city", data.city);
              updateProperty(property.id, "state", data.state);
              updateProperty(property.id, "zipCode", data.zipCode);
              updateProperty(property.id, "country", data.country);
            }}
            required={false}
          />

          {!property.isPrimary && (
            <div className="space-y-2">
              <Label htmlFor={`${property.id}-notes`}>Property Notes</Label>
              <Textarea
                id={`${property.id}-notes`}
                onChange={(e) =>
                  updateProperty(property.id, "notes", e.target.value)
                }
                placeholder="Special access instructions, gate codes, etc."
                rows={2}
                value={property.notes}
              />
            </div>
          )}
        </div>
      ))}

      <Button
        className="w-full"
        onClick={addProperty}
        type="button"
        variant="outline"
      >
        <Plus className="mr-2 size-4" />
        Add Additional Property/Address
      </Button>

      {/* Hidden input to pass properties data to server action */}
      <input
        name="properties"
        type="hidden"
        value={JSON.stringify(properties)}
      />
    </div>
  );
}
