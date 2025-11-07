"use client";

import { Building2, MapPin, Plus, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

/**
 * Multi-Property Selector - Client Component
 *
 * Allows selecting multiple properties for a job:
 * - Primary service location
 * - Secondary/related properties
 * - Work scope per property
 * - Estimated hours per property
 *
 * Use case: Jobs that span multiple locations (e.g., apartment complex, multiple storefronts)
 */

type Property = {
  id: string;
  name?: string;
  address: string;
  city: string;
  state: string;
  customer_id: string;
};

type SelectedProperty = {
  id: string;
  property: Property;
  role: "primary" | "secondary" | "related";
  isPrimary: boolean;
  workDescription?: string;
  estimatedHours?: number;
};

type MultiPropertySelectorProps = {
  properties: Property[];
  customerId?: string;
  initialSelected?: SelectedProperty[];
  onChange?: (selected: SelectedProperty[]) => void;
};

export function MultiPropertySelector({
  properties,
  customerId,
  initialSelected = [],
  onChange,
}: MultiPropertySelectorProps) {
  const [selectedProperties, setSelectedProperties] = useState<SelectedProperty[]>(initialSelected);
  const [showAddProperty, setShowAddProperty] = useState(initialSelected.length === 0);

  // Filter properties by customer if provided
  const filteredProperties = customerId
    ? properties.filter((p) => p.customer_id === customerId)
    : properties;

  const addProperty = (propertyId: string) => {
    const property = filteredProperties.find((p) => p.id === propertyId);
    if (!property) return;

    // Check if already added
    if (selectedProperties.some((sp) => sp.id === propertyId)) {
      return;
    }

    const newProperty: SelectedProperty = {
      id: propertyId,
      property,
      role: selectedProperties.length === 0 ? "primary" : "secondary",
      isPrimary: selectedProperties.length === 0,
    };

    const updated = [...selectedProperties, newProperty];
    setSelectedProperties(updated);
    onChange?.(updated);
    setShowAddProperty(false);
  };

  const removeProperty = (propertyId: string) => {
    const updated = selectedProperties.filter((sp) => sp.id !== propertyId);

    // If removing primary, set first remaining as primary
    if (updated.length > 0 && !updated.some((sp) => sp.isPrimary)) {
      updated[0].isPrimary = true;
      updated[0].role = "primary";
    }

    setSelectedProperties(updated);
    onChange?.(updated);
  };

  const setPrimary = (propertyId: string) => {
    const updated = selectedProperties.map((sp) => ({
      ...sp,
      isPrimary: sp.id === propertyId,
      role: sp.id === propertyId ? "primary" as const : sp.role,
    }));

    setSelectedProperties(updated);
    onChange?.(updated);
  };

  const updatePropertyRole = (propertyId: string, role: SelectedProperty["role"]) => {
    const updated = selectedProperties.map((sp) =>
      sp.id === propertyId ? { ...sp, role } : sp
    );

    setSelectedProperties(updated);
    onChange?.(updated);
  };

  const updateWorkDescription = (propertyId: string, description: string) => {
    const updated = selectedProperties.map((sp) =>
      sp.id === propertyId ? { ...sp, workDescription: description } : sp
    );

    setSelectedProperties(updated);
    onChange?.(updated);
  };

  const updateEstimatedHours = (propertyId: string, hours: number) => {
    const updated = selectedProperties.map((sp) =>
      sp.id === propertyId ? { ...sp, estimatedHours: hours } : sp
    );

    setSelectedProperties(updated);
    onChange?.(updated);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            <CardTitle>Service Locations</CardTitle>
          </div>
          <Badge variant="secondary">
            {selectedProperties.length} location{selectedProperties.length !== 1 ? "s" : ""}
          </Badge>
        </div>
        <CardDescription>
          Add multiple properties if job spans multiple locations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Properties */}
        {selectedProperties.map((selected) => (
          <div
            key={selected.id}
            className="rounded-lg border bg-muted/50 p-4"
          >
            <div className="space-y-3">
              {/* Property Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-1 items-start gap-3">
                  <MapPin className={`mt-1 size-5 ${selected.isPrimary ? "text-primary" : "text-muted-foreground"}`} />

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {selected.property.name || selected.property.address}
                      </p>
                      {selected.isPrimary && (
                        <Badge variant="default" className="text-xs">
                          <Star className="mr-1 size-3" />
                          Primary
                        </Badge>
                      )}
                    </div>

                    <p className="mt-1 text-muted-foreground text-sm">
                      {selected.property.address}, {selected.property.city}, {selected.property.state}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  {!selected.isPrimary && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPrimary(selected.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Star className="size-4" />
                    </Button>
                  )}
                  {selectedProperties.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProperty(selected.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Property Details */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`property-role-${selected.id}`} className="text-xs">
                    Property Role
                  </Label>
                  <Select
                    value={selected.role}
                    onValueChange={(value: any) => updatePropertyRole(selected.id, value)}
                  >
                    <SelectTrigger id={`property-role-${selected.id}`} className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary Location</SelectItem>
                      <SelectItem value="secondary">Secondary Location</SelectItem>
                      <SelectItem value="related">Related Property</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`hours-${selected.id}`} className="text-xs">
                    Est. Hours
                  </Label>
                  <Input
                    id={`hours-${selected.id}`}
                    type="number"
                    min="0"
                    step="0.5"
                    value={selected.estimatedHours || ""}
                    onChange={(e) => updateEstimatedHours(selected.id, Number.parseFloat(e.target.value))}
                    placeholder="0"
                    className="h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`work-${selected.id}`} className="text-xs">
                  Work Scope at This Location
                </Label>
                <Textarea
                  id={`work-${selected.id}`}
                  value={selected.workDescription || ""}
                  onChange={(e) => updateWorkDescription(selected.id, e.target.value)}
                  placeholder="Describe work to be performed at this property..."
                  rows={2}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Hidden inputs for form submission */}
            <input type="hidden" name={`property_${selected.id}_role`} value={selected.role} />
            <input type="hidden" name={`property_${selected.id}_isPrimary`} value={selected.isPrimary ? "true" : "false"} />
            <input type="hidden" name={`property_${selected.id}_workDescription`} value={selected.workDescription || ""} />
            <input type="hidden" name={`property_${selected.id}_estimatedHours`} value={selected.estimatedHours || 0} />
          </div>
        ))}

        {/* Add Property */}
        {showAddProperty ? (
          <div className="space-y-3 rounded-lg border border-dashed p-4">
            <div className="flex items-center justify-between">
              <Label>Add Service Location</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAddProperty(false)}
                className="h-8 w-8 p-0"
              >
                <X className="size-4" />
              </Button>
            </div>

            <Select onValueChange={addProperty}>
              <SelectTrigger>
                <SelectValue placeholder="Select a property..." />
              </SelectTrigger>
              <SelectContent>
                {filteredProperties
                  .filter((p) => !selectedProperties.some((sp) => sp.id === p.id))
                  .map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name || property.address} - {property.city}, {property.state}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddProperty(true)}
            className="w-full"
            disabled={!customerId}
          >
            <Plus className="mr-2 size-4" />
            Add Another Location
          </Button>
        )}

        {!customerId && (
          <p className="text-muted-foreground text-xs">
            Select a customer first to add properties
          </p>
        )}

        {/* Hidden inputs for property IDs */}
        <input
          type="hidden"
          name="propertyIds"
          value={selectedProperties.map((sp) => sp.id).join(",")}
        />
        <input
          type="hidden"
          name="primaryPropertyId"
          value={selectedProperties.find((sp) => sp.isPrimary)?.id || ""}
        />
      </CardContent>
    </Card>
  );
}
