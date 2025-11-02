"use client";

import { useState } from "react";
import { Loader2, MapPin, Plus } from "lucide-react";
import { createProperty, getCustomerProperties } from "@/actions/properties";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
 * AddPropertyDialog - Client Component
 *
 * Client-side features:
 * - Dialog state management
 * - Form submission handling
 * - Property creation for customers
 *
 * Usage:
 * - Embedded in JobForm when no properties exist for selected customer
 * - Can also be used standalone in customer detail pages
 */

type AddPropertyDialogProps = {
  customerId: string;
  onPropertyCreated?: (propertyId: string, propertyData: any) => void;
  trigger?: React.ReactNode;
  customerAddress?: {
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  };
};

export function AddPropertyDialog({
  customerId,
  onPropertyCreated,
  trigger,
  customerAddress,
}: AddPropertyDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("customerId", customerId); // Ensure customerId is set

    const result = await createProperty(formData);

    if (!result.success) {
      setError(result.error || "Failed to create property");
      setIsLoading(false);
      return;
    }

    // Fetch the newly created property details
    const propertiesResult = await getCustomerProperties(customerId);

    if (propertiesResult.success && propertiesResult.data) {
      // Find the newly created property
      const newProperty = propertiesResult.data.find(p => p.id === result.data);

      if (newProperty) {
        // Notify parent component with full property data
        onPropertyCreated?.(result.data, newProperty);
      }
    }

    setOpen(false);
    setIsLoading(false);
    // Reset form
    event.currentTarget.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline" size="sm">
            <Plus className="mr-2 size-4" />
            Add Property
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            <DialogTitle>Add New Property</DialogTitle>
          </div>
          <DialogDescription>
            Add a new service location for this customer. All fields marked with * are
            required.
            {customerAddress?.address && (
              <span className="mt-2 block font-medium text-green-600">
                ✓ Address fields pre-filled from customer profile
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" key={customerId}>
          {/* Error Display */}
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Property Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Property Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Main Office, Home, Warehouse #1"
              defaultValue={customerAddress?.address ? `Primary Location` : undefined}
              required
              disabled={isLoading}
            />
            <p className="text-muted-foreground text-xs">
              A friendly name to identify this location
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Main Street"
              defaultValue={customerAddress?.address}
              required
              disabled={isLoading}
            />
            {customerAddress?.address && (
              <p className="text-muted-foreground text-xs">
                Pre-filled from customer profile
              </p>
            )}
          </div>

          {/* Address Line 2 */}
          <div className="space-y-2">
            <Label htmlFor="address2">Address Line 2 (Optional)</Label>
            <Input
              id="address2"
              name="address2"
              placeholder="Suite 100, Apt 4B, etc."
              disabled={isLoading}
            />
          </div>

          {/* City, State, ZIP */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                placeholder="San Francisco"
                defaultValue={customerAddress?.city}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                name="state"
                placeholder="CA"
                maxLength={2}
                defaultValue={customerAddress?.state}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                name="zipCode"
                placeholder="94102"
                defaultValue={customerAddress?.zip_code}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Select name="propertyType" disabled={isLoading}>
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Select property type (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Square Footage & Year Built */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="squareFootage">Square Footage</Label>
              <Input
                id="squareFootage"
                name="squareFootage"
                type="number"
                placeholder="2500"
                min="0"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                name="yearBuilt"
                type="number"
                placeholder="2010"
                min="1800"
                max={new Date().getFullYear() + 5}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any additional information about this property..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 size-4" />
                  Create Property
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
