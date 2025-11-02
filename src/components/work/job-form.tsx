"use client";

import { Briefcase, Calendar, Loader2, MapPin, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createJob } from "@/actions/jobs";
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
import { AddPropertyDialog } from "@/components/work/add-property-dialog";

/**
 * Job Form Component - Client Component
 *
 * Performance optimizations:
 * - Only this form is client-side, parent page is Server Component
 * - Uses Server Actions for form submission (no client-side fetch)
 * - Pre-populated dropdowns from server-fetched data
 *
 * Features:
 * - Create new jobs with customer and property selection
 * - Optional scheduling and assignment
 * - Priority and job type classification
 * - Server-side validation via Zod schemas
 */

type JobFormProps = {
  customers: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company_name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  }>;
  properties: Array<{
    id: string;
    name?: string;
    address: string;
    city: string;
    state: string;
    customer_id: string;
    customers: {
      first_name: string;
      last_name: string;
    } | null;
  }>;
  teamMembers: Array<{
    user_id: string;
    users: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
    } | null;
  }>;
  preselectedCustomerId?: string;
  preselectedPropertyId?: string;
};

export function JobForm({
  customers,
  properties,
  teamMembers,
  preselectedCustomerId,
  preselectedPropertyId,
}: JobFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(
    preselectedCustomerId
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>(
    preselectedPropertyId
  );

  // Local properties state (combines server props + newly created)
  const [localProperties, setLocalProperties] = useState(properties);

  // Get selected customer's address data
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const customerAddress = selectedCustomer
    ? {
        address: selectedCustomer.address,
        city: selectedCustomer.city,
        state: selectedCustomer.state,
        zip_code: selectedCustomer.zip_code,
      }
    : undefined;

  // Filter properties by selected customer and add customer's primary address if exists
  const filteredProperties = selectedCustomerId
    ? (() => {
        const customerProperties = localProperties.filter(
          (p) => p.customer_id === selectedCustomerId
        );

        // If customer has an address in their profile, add it as a virtual property option
        if (
          selectedCustomer?.address &&
          selectedCustomer?.city &&
          selectedCustomer?.state
        ) {
          // Create a virtual property from customer's address
          const customerAddressProperty = {
            id: `customer-address-${selectedCustomerId}`, // Special ID to identify customer's address
            name: "Primary Address (Customer Profile)",
            address: selectedCustomer.address,
            city: selectedCustomer.city,
            state: selectedCustomer.state,
            customer_id: selectedCustomerId,
            customers: {
              first_name: selectedCustomer.first_name,
              last_name: selectedCustomer.last_name,
            },
          };

          // Return customer address first, then other properties
          return [customerAddressProperty, ...customerProperties];
        }

        return customerProperties;
      })()
    : localProperties;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const propertyId = formData.get("propertyId") as string;

    // If using customer's address (virtual property), create a real property first
    if (propertyId?.startsWith("customer-address-") && selectedCustomer) {
      const { createProperty } = await import("@/actions/properties");

      // Create property from customer's address
      const propertyFormData = new FormData();
      propertyFormData.set("customerId", selectedCustomerId!);
      propertyFormData.set("name", "Primary Location");
      propertyFormData.set("address", selectedCustomer.address || "");
      propertyFormData.set("city", selectedCustomer.city || "");
      propertyFormData.set("state", selectedCustomer.state || "");
      propertyFormData.set("zipCode", selectedCustomer.zip_code || "");

      const propertyResult = await createProperty(propertyFormData);

      if (!propertyResult.success) {
        setError(propertyResult.error || "Failed to create property");
        setIsLoading(false);
        return;
      }

      // Replace the virtual property ID with the real one
      formData.set("propertyId", propertyResult.data);
    }

    const result = await createJob(formData);

    if (!result.success) {
      setError(result.error || "Failed to create job");
      setIsLoading(false);
      return;
    }

    router.push(`/dashboard/work/jobs/${result.data}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-destructive text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Customer & Property Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              <CardTitle>Location</CardTitle>
            </div>
            <CardDescription>Select the customer and property for this job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer</Label>
              <Select
                defaultValue={preselectedCustomerId}
                name="customerId"
                onValueChange={setSelectedCustomerId}
              >
                <SelectTrigger id="customerId">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.first_name} {customer.last_name}
                      {customer.company_name && ` (${customer.company_name})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!selectedCustomerId && (
                <p className="text-muted-foreground text-xs">
                  Select a customer to see their properties
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="propertyId">Service Location *</Label>
                {selectedCustomerId &&
                  filteredProperties.length === 0 &&
                  !selectedCustomer?.address && (
                    <AddPropertyDialog
                      customerId={selectedCustomerId}
                      customerAddress={customerAddress}
                      onPropertyCreated={(propertyId, propertyData) => {
                        // Add new property to local state
                        setLocalProperties((prev) => [...prev, propertyData]);
                        // Auto-select the newly created property
                        setSelectedPropertyId(propertyId);
                      }}
                    />
                  )}
              </div>
              <Select
                value={selectedPropertyId}
                disabled={!selectedCustomerId}
                name="propertyId"
                required
                onValueChange={setSelectedPropertyId}
              >
                <SelectTrigger id="propertyId">
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {filteredProperties.length === 0 ? (
                    <div className="p-2 text-center text-muted-foreground text-sm">
                      No properties found for this customer
                    </div>
                  ) : (
                    filteredProperties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name || property.address} - {property.city}, {property.state}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedCustomerId && selectedCustomer?.address && (
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground text-xs">
                    Need a different location?
                  </p>
                  <AddPropertyDialog
                    customerId={selectedCustomerId}
                    customerAddress={customerAddress}
                    onPropertyCreated={(propertyId, propertyData) => {
                      // Add new property to local state
                      setLocalProperties((prev) => [...prev, propertyData]);
                      // Auto-select the newly created property
                      setSelectedPropertyId(propertyId);
                    }}
                    trigger={
                      <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs">
                        Add another location
                      </Button>
                    }
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="size-5 text-primary" />
              <CardTitle>Job Details</CardTitle>
            </div>
            <CardDescription>Describe the work to be performed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Annual HVAC Maintenance"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Detailed description of the job requirements"
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select defaultValue="service" name="jobType">
                  <SelectTrigger id="jobType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="installation">Installation</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select defaultValue="medium" name="priority" required>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheduling (Optional) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              <CardTitle>Schedule (Optional)</CardTitle>
            </div>
            <CardDescription>Set the scheduled date and time for this job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="scheduledStart">Scheduled Start</Label>
                <Input
                  id="scheduledStart"
                  name="scheduledStart"
                  type="datetime-local"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledEnd">Scheduled End</Label>
                <Input
                  id="scheduledEnd"
                  name="scheduledEnd"
                  type="datetime-local"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment (Optional) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="size-5 text-primary" />
              <CardTitle>Assignment (Optional)</CardTitle>
            </div>
            <CardDescription>Assign a technician to this job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned Technician</Label>
              <Select name="assignedTo">
                <SelectTrigger id="assignedTo">
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => {
                    const user = member.users;
                    if (!user) return null;
                    return (
                      <SelectItem key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Internal Notes</CardTitle>
            <CardDescription>Add any additional notes or instructions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Internal notes, special instructions, etc."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button
            disabled={isLoading}
            onClick={() => router.back()}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Create Job
          </Button>
        </div>
      </div>
    </form>
  );
}
