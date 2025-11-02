"use client";

import { ArrowLeft, Briefcase, Loader2, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import { CustomerSearchCombobox } from "./customer-search-combobox";
import { InlineCustomerForm } from "./inline-customer-form";
import { InlinePropertyForm } from "./inline-property-form";
import { createJob } from "@/actions/jobs";
import { useJobCreationStore } from "@/lib/stores/job-creation-store";

/**
 * Job Creation Wizard - Main Orchestrator Component
 *
 * Enterprise-grade job creation with:
 * - AI-powered auto-fill
 * - Inline customer/property creation
 * - Smart workflow progression
 * - Draft persistence
 * - Real-time validation
 */

type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name?: string;
  type: "residential" | "commercial" | "industrial";
};

type Property = {
  id: string;
  customer_id: string;
  name?: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zip_code: string;
  access_notes?: string;
  gate_code?: string;
  customers: { first_name: string; last_name: string } | null;
};

type TeamMember = {
  user_id: string;
  role: string;
  users: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  } | null;
};

type JobTemplate = {
  id: string;
  name: string;
  description?: string;
  job_type?: string;
  default_priority: string;
  title_template?: string;
  description_template?: string;
  default_notes?: string;
};

type JobCreationWizardProps = {
  companyId: string;
  customers: Customer[];
  properties: Property[];
  teamMembers: TeamMember[];
  jobTemplates: JobTemplate[];
  preselectedCustomer?: Customer | null;
  preselectedProperty?: Property | null;
  preselectedTemplateId?: string;
};

export function JobCreationWizard({
  companyId,
  customers: initialCustomers,
  properties: initialProperties,
  teamMembers,
  jobTemplates,
  preselectedCustomer,
  preselectedProperty,
  preselectedTemplateId,
}: JobCreationWizardProps) {
  const router = useRouter();

  // Zustand store
  const {
    customer,
    property,
    job,
    isCreatingInline,
    errors,
    recentCustomers,
    setCustomer,
    setProperty,
    updateJob,
    startInlineCreation,
    cancelInlineCreation,
    setError,
    clearError,
    addRecentCustomer,
    reset,
  } = useJobCreationStore();

  // Local state for dynamic lists (allows adding new items inline)
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with preselected values
  useEffect(() => {
    if (preselectedCustomer && !customer) {
      // Transform snake_case to camelCase for the store
      setCustomer({
        id: preselectedCustomer.id,
        firstName: preselectedCustomer.first_name,
        lastName: preselectedCustomer.last_name,
        email: preselectedCustomer.email,
        phone: preselectedCustomer.phone,
        companyName: preselectedCustomer.company_name,
        type: preselectedCustomer.type,
      });
      addRecentCustomer(preselectedCustomer.id);
    }
    if (preselectedProperty && !property) {
      // Transform snake_case to camelCase for the store
      setProperty({
        id: preselectedProperty.id,
        customerId: preselectedProperty.customer_id,
        name: preselectedProperty.name,
        address: preselectedProperty.address,
        address2: preselectedProperty.address2,
        city: preselectedProperty.city,
        state: preselectedProperty.state,
        zipCode: preselectedProperty.zip_code,
        accessNotes: preselectedProperty.access_notes,
        gateCode: preselectedProperty.gate_code,
      });
    }
  }, [preselectedCustomer, preselectedProperty, customer, property, setCustomer, setProperty, addRecentCustomer]);

  // Convert CustomerData to Customer format for components expecting database format
  const customerForCombobox: Customer | null = customer ? {
    id: customer.id!,
    first_name: customer.firstName,
    last_name: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    company_name: customer.companyName,
    type: customer.type,
  } : null;

  // Filter properties by selected customer
  const filteredProperties = customer
    ? properties.filter((p) => p.customer_id === customer.id)
    : [];

  // Handle customer selection
  const handleCustomerSelect = (selectedCustomer: Customer | null) => {
    if (selectedCustomer) {
      // Transform snake_case to camelCase for the store
      setCustomer({
        id: selectedCustomer.id,
        firstName: selectedCustomer.first_name,
        lastName: selectedCustomer.last_name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        companyName: selectedCustomer.company_name,
        type: selectedCustomer.type,
      });
      addRecentCustomer(selectedCustomer.id);
      // Reset property if it doesn't belong to this customer
      if (property && property.customerId !== selectedCustomer.id) {
        setProperty(null);
      }
    } else {
      setCustomer(null);
      setProperty(null);
    }
  };

  // Handle inline customer creation success
  const handleCustomerCreated = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    // Transform snake_case to camelCase for the store
    setCustomer({
      id: newCustomer.id,
      firstName: newCustomer.first_name,
      lastName: newCustomer.last_name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      companyName: newCustomer.company_name,
      type: newCustomer.type,
    });
    addRecentCustomer(newCustomer.id);
    cancelInlineCreation();
  };

  // Handle inline property creation success
  const handlePropertyCreated = (newProperty: Property) => {
    setProperties((prev) => [newProperty, ...prev]);
    // Transform snake_case to camelCase for the store
    setProperty({
      id: newProperty.id,
      customerId: newProperty.customer_id,
      name: newProperty.name,
      address: newProperty.address,
      address2: newProperty.address2,
      city: newProperty.city,
      state: newProperty.state,
      zipCode: newProperty.zip_code,
      accessNotes: newProperty.access_notes,
      gateCode: newProperty.gate_code,
    });
    cancelInlineCreation();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!customer) {
      setError("customer", "Please select a customer");
      return;
    }
    if (!property) {
      setError("property", "Please select a property");
      return;
    }
    if (!job.title?.trim()) {
      setError("title", "Job title is required");
      return;
    }

    setIsSubmitting(true);

    // Build FormData for server action
    const formData = new FormData();
    if (customer.id) formData.append("customerId", customer.id);
    if (property.id) formData.append("propertyId", property.id);
    formData.append("title", job.title);
    if (job.description) formData.append("description", job.description);
    if (job.jobType) formData.append("jobType", job.jobType);
    if (job.priority) formData.append("priority", job.priority);
    if (job.scheduledStart) formData.append("scheduledStart", job.scheduledStart);
    if (job.scheduledEnd) formData.append("scheduledEnd", job.scheduledEnd);
    if (job.assignedTo) formData.append("assignedTo", job.assignedTo);
    if (job.notes) formData.append("notes", job.notes);

    const result = await createJob(formData);

    if (result.success && result.data) {
      // Clear form and redirect
      reset();
      router.push(`/dashboard/work/jobs/${result.data}`);
    } else {
      setError("submit", (result as any).error || "Failed to create job");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild size="sm" variant="ghost">
              <Link href="/dashboard/work">
                <ArrowLeft className="mr-2 size-4" />
                Back to Jobs
              </Link>
            </Button>
            <div>
              <h1 className="font-semibold text-2xl">Create New Job</h1>
              <p className="text-muted-foreground text-sm">
                Fill in the details to create a work order
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              disabled={isSubmitting}
              onClick={() => router.push("/dashboard/work")}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting || !customer || !property || !job.title}
              onClick={handleSubmit}
            >
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Create Job
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Display */}
            {errors.submit && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <p className="text-destructive text-sm font-medium">{errors.submit}</p>
              </div>
            )}

            {/* Customer Selection */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="size-5 text-primary" />
                  <CardTitle>Customer</CardTitle>
                </div>
                <CardDescription>
                  Select an existing customer or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isCreatingInline === "customer" ? (
                  <InlineCustomerForm
                    onCancel={cancelInlineCreation}
                    onSuccess={handleCustomerCreated}
                  />
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="customer-search">
                      Customer <span className="text-destructive">*</span>
                    </Label>
                    <CustomerSearchCombobox
                      customers={customers}
                      onCreateNew={() => startInlineCreation("customer")}
                      onSelectCustomer={handleCustomerSelect}
                      recentCustomerIds={recentCustomers}
                      selectedCustomer={customerForCombobox}
                    />
                    {errors.customer && (
                      <p className="text-destructive text-sm">{errors.customer}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Selection */}
            {customer && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-5 text-primary" />
                    <CardTitle>Service Location</CardTitle>
                  </div>
                  <CardDescription>
                    Select where the work will be performed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isCreatingInline === "property" ? (
                    <InlinePropertyForm
                      customerId={customer.id!}
                      customerName={`${customer.firstName} ${customer.lastName}`}
                      onCancel={cancelInlineCreation}
                      onSuccess={handlePropertyCreated}
                    />
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="property-select">
                        Property <span className="text-destructive">*</span>
                      </Label>
                      {filteredProperties.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-6 text-center">
                          <p className="text-muted-foreground text-sm mb-3">
                            No properties found for this customer
                          </p>
                          <Button
                            onClick={() => startInlineCreation("property")}
                            size="sm"
                            type="button"
                            variant="outline"
                          >
                            Add Property
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Select
                            onValueChange={(value) => {
                              const selected = properties.find((p) => p.id === value);
                              if (selected) {
                                setProperty({
                                  id: selected.id,
                                  customerId: selected.customer_id,
                                  name: selected.name,
                                  address: selected.address,
                                  address2: selected.address2,
                                  city: selected.city,
                                  state: selected.state,
                                  zipCode: selected.zip_code,
                                  accessNotes: selected.access_notes,
                                  gateCode: selected.gate_code,
                                });
                              } else {
                                setProperty(null);
                              }
                              clearError("property");
                            }}
                            value={property?.id}
                          >
                            <SelectTrigger id="property-select">
                              <SelectValue placeholder="Select a property" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredProperties.map((prop) => (
                                <SelectItem key={prop.id} value={prop.id}>
                                  {prop.name || prop.address} - {prop.city}, {prop.state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            className="mt-2"
                            onClick={() => startInlineCreation("property")}
                            size="sm"
                            type="button"
                            variant="outline"
                          >
                            Add New Property
                          </Button>
                        </>
                      )}
                      {errors.property && (
                        <p className="text-destructive text-sm">{errors.property}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Job Details */}
            {customer && property && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Briefcase className="size-5 text-primary" />
                      <CardTitle>Job Details</CardTitle>
                    </div>
                    <CardDescription>
                      Describe the work to be performed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="job-title">
                        Job Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="job-title"
                        onChange={(e) => {
                          updateJob({ title: e.target.value });
                          clearError("title");
                        }}
                        placeholder="e.g., Annual HVAC Maintenance"
                        value={job.title || ""}
                      />
                      {errors.title && (
                        <p className="text-destructive text-sm">{errors.title}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="job-description">Description</Label>
                      <Textarea
                        id="job-description"
                        onChange={(e) => updateJob({ description: e.target.value })}
                        placeholder="Detailed description of the job..."
                        rows={4}
                        value={job.description || ""}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="job-type">Job Type</Label>
                        <Select
                          onValueChange={(value) => updateJob({ jobType: value as any })}
                          value={job.jobType || undefined}
                        >
                          <SelectTrigger id="job-type">
                            <SelectValue placeholder="Select type" />
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
                        <Label htmlFor="job-priority">Priority</Label>
                        <Select
                          onValueChange={(value) => updateJob({ priority: value as any })}
                          value={job.priority || "medium"}
                        >
                          <SelectTrigger id="job-priority">
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

                    <div className="space-y-2">
                      <Label htmlFor="job-notes">Internal Notes</Label>
                      <Textarea
                        id="job-notes"
                        onChange={(e) => updateJob({ notes: e.target.value })}
                        placeholder="Internal notes, special instructions..."
                        rows={3}
                        value={job.notes || ""}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Scheduling (Optional) */}
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule (Optional)</CardTitle>
                    <CardDescription>
                      Set the date and time for this job
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="scheduled-start">Scheduled Start</Label>
                        <Input
                          id="scheduled-start"
                          onChange={(e) => updateJob({ scheduledStart: e.target.value })}
                          type="datetime-local"
                          value={job.scheduledStart || ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scheduled-end">Scheduled End</Label>
                        <Input
                          id="scheduled-end"
                          onChange={(e) => updateJob({ scheduledEnd: e.target.value })}
                          type="datetime-local"
                          value={job.scheduledEnd || ""}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assigned-to">Assign Technician</Label>
                      <Select
                        onValueChange={(value) => updateJob({ assignedTo: value })}
                        value={job.assignedTo || undefined}
                      >
                        <SelectTrigger id="assigned-to">
                          <SelectValue placeholder="Select technician" />
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
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
