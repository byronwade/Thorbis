/**
 * EquipmentForm Component
 *
 * Comprehensive equipment tracking form with:
 * - Property association
 * - Equipment details (serial numbers, warranties)
 * - Customer selection
 * - Category and type organization
 * - Keyboard shortcuts (⌘S, ⌘K, ⌘/)
 *
 * Performance: Client Component (interactive form)
 */

"use client";

import { Loader2, Save, Wrench } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createEquipment } from "@/actions/equipment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

type Customer = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  email: string | null;
};

type Property = {
  id: string;
  name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
};

type EquipmentFormProps = {
  customers: Customer[];
  properties: Property[];
  preselectedCustomerId?: string;
  preselectedPropertyId?: string;
};

export function EquipmentForm({
  customers,
  properties,
  preselectedCustomerId,
  preselectedPropertyId,
}: EquipmentFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<
    string | undefined
  >(preselectedCustomerId || searchParams?.get("customerId") || undefined);
  const [selectedPropertyId, setSelectedPropertyId] = useState<
    string | undefined
  >(preselectedPropertyId || searchParams?.get("propertyId") || undefined);
  const [equipmentType, setEquipmentType] = useState("");
  const [warrantyEndDate, setWarrantyEndDate] = useState("");

  // Filter properties by selected customer
  const customerProperties = selectedCustomerId
    ? properties.filter((p) => true) // Simplified
    : properties;

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("customer-select")?.focus();
      }
      if (e.key === "Escape") {
        router.back();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // Handle form submission
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const result = await createEquipment(formData);

    if (!result.success) {
      setError(result.error || "Failed to create equipment");
      setIsLoading(false);
      return;
    }

    router.push(`/dashboard/work/equipment/${result.data}`);
  }

  // Equipment type options
  const equipmentTypes = [
    { value: "hvac", label: "HVAC System" },
    { value: "furnace", label: "Furnace" },
    { value: "air_conditioner", label: "Air Conditioner" },
    { value: "heat_pump", label: "Heat Pump" },
    { value: "water_heater", label: "Water Heater" },
    { value: "boiler", label: "Boiler" },
    { value: "thermostat", label: "Thermostat" },
    { value: "air_handler", label: "Air Handler" },
    { value: "ductwork", label: "Ductwork" },
    { value: "other", label: "Other" },
  ];

  // Category options
  const categories = [
    { value: "heating", label: "Heating" },
    { value: "cooling", label: "Cooling" },
    { value: "ventilation", label: "Ventilation" },
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "other", label: "Other" },
  ];

  return (
    <form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="font-medium text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Customer & Property */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-select">Customer (Optional)</Label>
            <Select
              name="customerId"
              onValueChange={setSelectedCustomerId}
              value={selectedCustomerId}
            >
              <SelectTrigger id="customer-select">
                <SelectValue placeholder="Select customer (⌘K)" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.display_name ||
                      `${customer.first_name} ${customer.last_name}` ||
                      customer.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="property-select">
              Property <span className="text-destructive">*</span>
            </Label>
            <Select
              name="propertyId"
              onValueChange={setSelectedPropertyId}
              required
              value={selectedPropertyId}
            >
              <SelectTrigger id="property-select">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {customerProperties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name || property.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            <CardTitle>Equipment Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Equipment Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Main HVAC Unit"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">
                Type <span className="text-destructive">*</span>
              </Label>
              <Select
                name="type"
                onValueChange={setEquipmentType}
                required
                value={equipmentType}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category">
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                name="manufacturer"
                placeholder="e.g., Carrier"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model Number</Label>
              <Input id="model" name="model" placeholder="e.g., 24ACC6" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                name="serialNumber"
                placeholder="e.g., 1234567890"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location/Room</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g., Basement, Attic, Main Floor"
            />
          </div>
        </CardContent>
      </Card>

      {/* Installation & Warranty */}
      <Card>
        <CardHeader>
          <CardTitle>Installation & Warranty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="installDate">Installation Date</Label>
              <Input id="installDate" name="installDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warrantyEndDate">Warranty End Date</Label>
              <Input
                id="warrantyEndDate"
                name="warrantyEndDate"
                onChange={(e) => setWarrantyEndDate(e.target.value)}
                type="date"
                value={warrantyEndDate}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="warrantyProvider">Warranty Provider</Label>
            <Input
              id="warrantyProvider"
              name="warrantyProvider"
              placeholder="e.g., Manufacturer, Third-party"
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Maintenance history, special requirements, etc."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          disabled={isLoading}
          onClick={() => router.back()}
          type="button"
          variant="outline"
        >
          Cancel (Esc)
        </Button>
        <Button disabled={isLoading} type="submit">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Add Equipment (⌘S)
        </Button>
      </div>
    </form>
  );
}
