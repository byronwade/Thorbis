/**
 * Job Page Content - Comprehensive Single Page View
 * All details visible with collapsible sections - like ServiceTitan/HouseCall Pro
 */

"use client";

import {
  Activity,
  Building2,
  Calendar,
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  Receipt,
  Save,
  User,
  Wrench,
  X,
  Edit2,
} from "lucide-react";
import { JobEnrichmentInline } from "./job-enrichment-inline";
import { TravelTime } from "./travel-time";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateJob } from "@/actions/jobs";
import { findOrCreateProperty } from "@/actions/properties";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GooglePlacesAutocomplete } from "@/components/ui/google-places-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { JobAppointmentsTable } from "./job-appointments-table";
import { JobEstimatesTable } from "./job-estimates-table";
import { JobInvoicesTable } from "./job-invoices-table";
import { JobNotesTable } from "./job-notes-table";
import { JobPurchaseOrdersTable } from "./job-purchase-orders-table";
import { JobQuickActions } from "./job-quick-actions";
import { InlinePhotoUploader } from "./InlinePhotoUploader";

type JobPageContentProps = {
  jobData: any;
  metrics: any;
};

export function JobPageContent({ jobData, metrics }: JobPageContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [localJob, setLocalJob] = useState({
    ...jobData.job,
    priority: jobData.job.priority || "medium", // Ensure default priority
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const {
    job,
    customer: initialCustomer,
    property: initialProperty,
    assignedUser,
    teamAssignments,
    timeEntries,
    invoices,
    estimates,
    payments,
    purchaseOrders,
    tasks,
    photos,
    documents,
    signatures,
    activities,
    communications,
    equipment,
    jobEquipment = [],
    jobMaterials = [],
    jobNotes = [],
    schedules = [],
    allCustomers = [],
    allProperties = [],
  } = jobData;

  // Local state for optimistic updates
  const [customer, setCustomer] = useState(initialCustomer);
  const [property, setProperty] = useState(initialProperty);

  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [propertySearchQuery, setPropertySearchQuery] = useState("");
  const [propertyDropdownMode, setPropertyDropdownMode] = useState<"search" | "add">("search");
  const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false);
  const [isUpdatingProperty, setIsUpdatingProperty] = useState(false);
  const [isCreatePropertyDialogOpen, setIsCreatePropertyDialogOpen] = useState(false);
  const [isCreatingProperty, setIsCreatingProperty] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Filter properties by customer for property dialog
  const availableProperties = customer?.id
    ? allProperties.filter((p: any) => p.customer_id === customer.id)
    : [];


  // Handle field changes
  const handleFieldChange = (field: string, value: any) => {
    setLocalJob({ ...localJob, [field]: value });
    setHasChanges(true);
  };

  // Handle customer change
  const handleCustomerChange = async (newCustomerId: string | null) => {
    if (newCustomerId === customer?.id) {
      return;
    }

    // Store original values for rollback
    const originalCustomer = customer;
    const originalProperty = property;

    // Optimistic update - update UI immediately
    const newCustomer = newCustomerId
      ? allCustomers.find((c: any) => c.id === newCustomerId)
      : null;
    setCustomer(newCustomer);

    // Check if property needs to be cleared
    let shouldClearProperty = false;
    if (!newCustomerId) {
      // Customer removed - clear property
      shouldClearProperty = true;
    } else if (property?.id) {
      // Customer changed - clear property if it doesn't belong to new customer
      const propertyBelongsToCustomer = allProperties.some(
        (p: any) => p.id === property.id && p.customer_id === newCustomerId
      );
      if (!propertyBelongsToCustomer) {
        shouldClearProperty = true;
      }
    }

    if (shouldClearProperty) {
      setProperty(null);
    }

    // Show loading toast
    toast.loading("Updating customer...", { id: "customer-update" });

    try {
      const formData = new FormData();
      formData.append("customerId", newCustomerId || "");
      
      if (shouldClearProperty) {
        formData.append("propertyId", "");
      }

      const result = await updateJob(job.id, formData);
      if (result.success) {
        toast.success("Customer updated successfully", { id: "customer-update" });
        // Refresh in background to get latest data
        router.refresh();
      } else {
        // Rollback on error
        setCustomer(originalCustomer);
        setProperty(originalProperty);
        toast.error(result.error || "Failed to update customer", {
          id: "customer-update",
        });
      }
    } catch (error) {
      // Rollback on error
      setCustomer(originalCustomer);
      setProperty(originalProperty);
      toast.error("Failed to update customer", { id: "customer-update" });
    }
  };

  // Handle property change
  const handlePropertyChange = async (newPropertyId: string | null) => {
    if (newPropertyId === property?.id) {
      return;
    }

    // Store original for rollback
    const originalProperty = property;

    // Optimistic update - update UI immediately
    const newProperty = newPropertyId
      ? allProperties.find((p: any) => p.id === newPropertyId)
      : null;
    setProperty(newProperty);

    // Show loading toast
    toast.loading("Updating property...", { id: "property-update" });

    try {
      const formData = new FormData();
      formData.append("propertyId", newPropertyId || "");
      
      const result = await updateJob(job.id, formData);
      if (result.success) {
        toast.success("Property updated successfully", { id: "property-update" });
        router.refresh();
      } else {
        // Rollback on error
        setProperty(originalProperty);
        toast.error(result.error || "Failed to update property", {
          id: "property-update",
        });
      }
    } catch (error) {
      // Rollback on error
      setProperty(originalProperty);
      toast.error("Failed to update property", { id: "property-update" });
    }
  };

  // Handle remove customer
  const handleRemoveCustomer = async () => {
    // Store original for rollback
    const originalCustomer = customer;
    const originalProperty = property;

    // Optimistic update - clear immediately
    setCustomer(null);
    setProperty(null);

    // Show loading toast
    toast.loading("Removing customer...", { id: "customer-remove" });

    try {
      const formData = new FormData();
      formData.append("customerId", "");
      formData.append("propertyId", ""); // Also remove property since properties are linked to customers
      
      const result = await updateJob(job.id, formData);
      if (result.success) {
        toast.success("Customer and property removed successfully", {
          id: "customer-remove",
        });
        router.refresh();
      } else {
        // Rollback on error
        setCustomer(originalCustomer);
        setProperty(originalProperty);
        toast.error(result.error || "Failed to remove customer", {
          id: "customer-remove",
        });
      }
    } catch (error) {
      // Rollback on error
      setCustomer(originalCustomer);
      setProperty(originalProperty);
      toast.error("Failed to remove customer", { id: "customer-remove" });
    }
  };

  // Handle create new property from Google Places
  const handlePlaceSelect = async (place: {
    address: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    lat: number;
    lon: number;
    formattedAddress: string;
  }) => {
    console.log("[JobPage] handlePlaceSelect called with:", place);
    
    if (!customer?.id) {
      console.error("[JobPage] No customer selected");
      toast.error("Please select a customer first");
      return;
    }

    console.log("[JobPage] Creating property for customer:", customer.id);
    
    // Store original property for rollback
    const originalProperty = property;
    
    // Create optimistic property object
    const optimisticProperty = {
      id: "temp-" + Date.now(),
      customer_id: customer.id,
      company_id: customer.company_id,
      name: place.formattedAddress,
      address: place.address,
      address2: place.address2,
      city: place.city,
      state: place.state,
      zip_code: place.zipCode,
      country: place.country,
      lat: place.lat,
      lon: place.lon,
    };

    // Optimistically update UI immediately - feels instant!
    setProperty(optimisticProperty as any);
    setPropertyDropdownMode("search");
    setIsUpdatingProperty(false);
    
    // Show success immediately
    toast.success("Property added!", { duration: 2000 });

    // Create property in background (fast because no blocking geocoding)
    try {
      const formData = new FormData();
      formData.append("customerId", customer.id);
      formData.append("name", place.formattedAddress);
      formData.append("address", place.address);
      formData.append("address2", place.address2 || "");
      formData.append("city", place.city);
      formData.append("state", place.state);
      formData.append("zipCode", place.zipCode);
      formData.append("country", place.country);
      // Pass coordinates from Google Places - no need to geocode again!
      formData.append("lat", place.lat.toString());
      formData.append("lon", place.lon.toString());

      const result = await findOrCreateProperty(formData);
      if (result.success && result.data) {
        // Update job with new property
        const jobFormData = new FormData();
        jobFormData.append("propertyId", result.data);
        
        const updateResult = await updateJob(job.id, jobFormData);
        if (updateResult.success) {
          // Silently refresh to get real data from server
          router.refresh();
        } else {
          // Rollback on error
          setProperty(originalProperty);
          toast.error(updateResult.error || "Failed to assign property to job");
        }
      } else {
        // Rollback on error
        setProperty(originalProperty);
        toast.error('error' in result ? result.error : "Failed to create property");
      }
    } catch (error) {
      // Rollback on error
      setProperty(originalProperty);
      toast.error("Failed to create property");
    }
  };

  // Handle create new property (from dialog)
  const handleCreateProperty = async () => {
    if (!customer?.id) {
      toast.error("Please select a customer first");
      return;
    }

    setIsCreatingProperty(true);
    try {
      const formData = new FormData();
      formData.append("customerId", customer.id);
      formData.append("name", newProperty.name);
      formData.append("address", newProperty.address);
      formData.append("address2", newProperty.address2);
      formData.append("city", newProperty.city);
      formData.append("state", newProperty.state);
      formData.append("zipCode", newProperty.zipCode);

      const result = await findOrCreateProperty(formData);
      if (result.success && result.data) {
        // Update job with new property
        const jobFormData = new FormData();
        jobFormData.append("propertyId", result.data);
        
        const updateResult = await updateJob(job.id, jobFormData);
        if (updateResult.success) {
          toast.success("Property created and assigned successfully");
          setIsCreatePropertyDialogOpen(false);
          setNewProperty({
            name: "",
            address: "",
            address2: "",
            city: "",
            state: "",
            zipCode: "",
          });
          router.refresh();
        } else {
          toast.error(updateResult.error || "Failed to assign property to job");
        }
      } else {
        toast.error('error' in result ? result.error : "Failed to create property");
      }
    } catch (error) {
      toast.error("Failed to create property");
    } finally {
      setIsCreatingProperty(false);
    }
  };

  // Filter customers based on search
  const filteredCustomers = allCustomers.filter((c: any) => {
    if (!customerSearchQuery) return true;
    const query = customerSearchQuery.toLowerCase();
    const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
    const phone = c.phone?.toLowerCase() || "";
    const email = c.email?.toLowerCase() || "";
    const company = c.company_name?.toLowerCase() || "";
    return (
      fullName.includes(query) ||
      phone.includes(query) ||
      email.includes(query) ||
      company.includes(query)
    );
  });

  // Filter properties based on search
  const filteredProperties = availableProperties.filter((p: any) => {
    if (!propertySearchQuery) return true;
    const query = propertySearchQuery.toLowerCase();
    const name = p.name?.toLowerCase() || "";
    const address = p.address?.toLowerCase() || "";
    const city = p.city?.toLowerCase() || "";
    return name.includes(query) || address.includes(query) || city.includes(query);
  });

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      if (localJob.title !== jobData.job.title) {
        formData.append("title", localJob.title);
      }
      if (localJob.description !== jobData.job.description) {
        formData.append("description", localJob.description || "");
      }
      if (localJob.status !== jobData.job.status) {
        formData.append("status", localJob.status);
      }
      if (localJob.priority !== jobData.job.priority) {
        formData.append("priority", localJob.priority || "medium");
      }
      if (localJob.job_type !== jobData.job.job_type) {
        formData.append("jobType", localJob.job_type || "");
      }
      if (localJob.notes !== jobData.job.notes) {
        formData.append("notes", localJob.notes || "");
      }

      const result = await updateJob(jobData.job.id, formData);
      if (result.success) {
        toast.success("Changes saved successfully");
        setHasChanges(false);
        // Update local state immediately with the saved values
        const updatedJob = { ...localJob };
        if (formData.has("title")) updatedJob.title = formData.get("title") as string;
        if (formData.has("description")) updatedJob.description = formData.get("description") as string;
        if (formData.has("status")) updatedJob.status = formData.get("status") as string;
        if (formData.has("priority")) updatedJob.priority = formData.get("priority") as string;
        if (formData.has("jobType")) updatedJob.job_type = formData.get("jobType") as string;
        if (formData.has("notes")) updatedJob.notes = formData.get("notes") as string;
        setLocalJob(updatedJob);
        // Force router refresh to get latest data from server
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save changes");
      }
    } catch (_error) {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  const formatDate = (date: string | null) => {
    if (!date) {
      return "Not set";
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatHours = (hours: number) => `${hours.toFixed(1)}h`;

  const formatTime = (date: string | null) => {
    if (!date) {
      return "Not set";
    }
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) {
      return "-";
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    }
    if (hours > 0) {
      return `${hours}h`;
    }
    return `${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "approved":
      case "completed":
        return "default";
      case "sent":
      case "scheduled":
      case "confirmed":
        return "secondary";
      case "in_progress":
        return "default";
      case "overdue":
      case "cancelled":
      case "no_show":
        return "destructive";
      case "rescheduled":
        return "outline";
      case "draft":
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <>
      {/* Page Header - Not Fixed */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Title and Header Section */}
          <div className="mb-8">
            {/* Job Number Badge */}
            <div className="mb-3">
              <Badge className="h-6 font-mono text-xs" variant="outline">
                #{job.job_number}
              </Badge>
            </div>

            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Large Job Title */}
                <Input
                  className="h-auto border-0 p-0 font-bold text-5xl tracking-tight shadow-none focus-visible:ring-0 md:text-6xl"
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  placeholder="Enter job title..."
                  value={localJob.title}
                />
              </div>

              {/* Save Button */}
              {hasChanges && (
                <Button
                  className="mt-2"
                  disabled={isSaving}
                  onClick={handleSave}
                  size="default"
                  variant="default"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>

            {/* Operational Intelligence - Inline */}
            {jobData.enrichmentData && (
              <div className="mb-6">
                <JobEnrichmentInline enrichmentData={jobData.enrichmentData} />
              </div>
            )}

            {/* Customer and Property Links */}
            {(customer || property) && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {customer && (
                      <Link
                    className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        href={`/dashboard/customers/${customer.id}`}
                      >
                    <User className="h-4 w-4" />
                    <span className="font-medium">
                        {customer.first_name} {customer.last_name}
                    </span>
                      </Link>
                  )}
                  {property && (
                      <Link
                    className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        href={`/dashboard/properties/${property.id}`}
                      >
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">
                        {property.name || property.address}
                    </span>
                      </Link>
                  )}
                </div>
                
                {/* Travel Time - Important for CSR */}
                {property && <TravelTime property={property} />}
              </div>
              )}
            </div>

            {/* Job Details - Inline Editable */}
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Status:</span>
                  <Select
                    onValueChange={(value) =>
                      handleFieldChange("status", value)
                    }
                    value={localJob.status || undefined}
                  >
                    <SelectTrigger className="h-auto border-0 bg-transparent p-0 shadow-none hover:underline focus:ring-0">
                      <SelectValue placeholder="Set status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Priority:</span>
                  <Select
                    onValueChange={(value) =>
                      handleFieldChange("priority", value)
                    }
                    value={localJob.priority || undefined}
                  >
                    <SelectTrigger className="h-auto border-0 bg-transparent p-0 shadow-none hover:underline focus:ring-0">
                      <SelectValue placeholder="Set priority..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Job Type */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Type:</span>
                  <Input
                    className="h-auto w-auto min-w-[150px] border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                    onChange={(e) =>
                      handleFieldChange("service_type", e.target.value)
                    }
                    placeholder="Enter type..."
                    value={localJob.service_type || localJob.job_type || ""}
                  />
                </div>

                {/* Assigned To */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Assigned:</span>
                  <span className="text-sm">
                    {assignedUser
                      ? `${assignedUser.name || "Unassigned"}`
                      : "Unassigned"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-muted-foreground text-sm">Description:</span>
                <Textarea
                  className="min-h-[80px] resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  placeholder="Add a description..."
                  value={localJob.description || ""}
                />
              </div>
          </div>

          {/* Core Actions - Arrive, Close */}
          <JobQuickActions
            currentStatus={job.status}
            jobId={job.id}
          />
      </div>

      {/* All Sections - Collapsible */}
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <Accordion
          className="space-y-3"
          defaultValue={[
            "customer",
            "appointments",
            "equipment-serviced",
            "invoices",
            "estimates",
            "purchase-orders",
            "tasks",
          ]}
          type="multiple"
        >
          {/* CUSTOMER & PROPERTY */}
          <AccordionItem className="rounded-lg border bg-card shadow-sm" value="customer">
            <div className="flex items-center justify-between gap-4 px-6 py-3.5">
              <AccordionTrigger className="flex-1 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">Customer & Property Details</span>
                </div>
              </AccordionTrigger>
              <div
                className="flex shrink-0 items-center gap-2"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                {customer ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          disabled={isUpdatingCustomer}
                          size="sm"
                          variant="ghost"
                          className="h-8 px-3 text-xs"
                        >
                          <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                          Change
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-[400px] p-0"
                      >
                        <Command shouldFilter={false}>
                          <CommandInput
                            onValueChange={setCustomerSearchQuery}
                            placeholder="Search customers..."
                            value={customerSearchQuery}
                          />
                          <CommandList>
                            <CommandEmpty>
                              <div className="py-6 text-center text-muted-foreground text-sm">
                                No customers found
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              {filteredCustomers.slice(0, 50).map((c: any) => (
                                <CommandItem
                                  key={c.id}
                                  className="cursor-pointer"
                                  onSelect={() => {
                                    handleCustomerChange(c.id);
                                    setCustomerSearchQuery("");
                                  }}
                                  value={`${c.first_name} ${c.last_name} ${c.email} ${c.phone} ${c.company_name || ""}`}
                                >
                                  <div className="flex flex-1 flex-col">
                                    <span className="font-medium">
                                      {c.first_name} {c.last_name}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                      {c.company_name || c.email || c.phone}
                                    </span>
                                  </div>
                                  {c.id === customer?.id && (
                                    <CheckCircle className="ml-2 h-4 w-4 text-primary" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                        <DropdownMenuSeparator />
                        <div className="p-2">
                          <Button
                            className="w-full"
                            disabled={isUpdatingCustomer}
                            onClick={handleRemoveCustomer}
                            size="sm"
                            variant="destructive"
                          >
                            <X className="mr-2 h-3 w-3" />
                            Remove Customer
                          </Button>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {property ? (
                      <DropdownMenu
                        modal={false}
                        onOpenChange={(open) => {
                          if (!open) setPropertyDropdownMode("search");
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            disabled={isUpdatingProperty || !customer}
                            size="sm"
                            variant="ghost"
                            className="h-8 px-3 text-xs"
                          >
                            <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                            Change Property
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[500px] p-0"
                          onInteractOutside={(e) => {
                            // Don't close if interacting with Google Places autocomplete
                            const target = e.target as HTMLElement;
                            if (target.closest(".pac-container")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          {customer ? (
                            <Tabs
                              onValueChange={(value) =>
                                setPropertyDropdownMode(value as "search" | "add")
                              }
                              value={propertyDropdownMode}
                            >
                              <TabsList className="w-full rounded-none border-b">
                                <TabsTrigger className="flex-1" value="search">
                                  Search Existing
                                </TabsTrigger>
                                <TabsTrigger className="flex-1" value="add">
                                  Add New Address
                                </TabsTrigger>
                              </TabsList>
                              
                              <TabsContent className="m-0" value="search">
                                <Command shouldFilter={false}>
                                  <CommandInput
                                    onValueChange={setPropertySearchQuery}
                                    placeholder="Search properties..."
                                    value={propertySearchQuery}
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      <div className="py-6 text-center text-muted-foreground text-sm">
                                        No properties found for this customer
                                      </div>
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {filteredProperties.map((p: any) => (
                                        <CommandItem
                                          key={p.id}
                                          className="cursor-pointer"
                                          onSelect={() => {
                                            handlePropertyChange(p.id);
                                            setPropertySearchQuery("");
                                          }}
                                          value={`${p.name || p.address} ${p.city} ${p.state}`}
                                        >
                                          <div className="flex flex-1 flex-col">
                                            <span className="font-medium">
                                              {p.name || p.address}
                                            </span>
                                            <span className="text-muted-foreground text-xs">
                                              {p.city}, {p.state}
                                            </span>
                                          </div>
                                          {p.id === property?.id && (
                                            <CheckCircle className="ml-2 h-4 w-4 text-primary" />
                                          )}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </TabsContent>
                              
                              <TabsContent className="m-0 p-4" value="add">
                                <div className="space-y-3">
                                  <div>
                                    <Label className="mb-2 text-sm">
                                      Search for address using Google Places
                                    </Label>
                                    <GooglePlacesAutocomplete
                                      autoFocus
                                      onPlaceSelect={handlePlaceSelect}
                                      placeholder="Start typing an address..."
                                    />
                                  </div>
                                  <p className="text-muted-foreground text-xs">
                                    Select an address from the dropdown to automatically
                                    create and assign the property
                                  </p>
                                </div>
                              </TabsContent>
                            </Tabs>
                          ) : (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                              Please assign a customer first
                            </div>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <DropdownMenu
                        modal={false}
                        onOpenChange={(open) => {
                          if (!open) setPropertyDropdownMode("search");
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            disabled={!customer}
                            size="sm"
                            variant="outline"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Property
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[500px] p-0"
                          onInteractOutside={(e) => {
                            // Don't close if interacting with Google Places autocomplete
                            const target = e.target as HTMLElement;
                            if (target.closest(".pac-container")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          {customer ? (
                            <Tabs
                              onValueChange={(value) =>
                                setPropertyDropdownMode(value as "search" | "add")
                              }
                              value={propertyDropdownMode}
                            >
                              <TabsList className="w-full rounded-none border-b">
                                <TabsTrigger className="flex-1" value="search">
                                  Search Existing
                                </TabsTrigger>
                                <TabsTrigger className="flex-1" value="add">
                                  Add New Address
                                </TabsTrigger>
                              </TabsList>
                              
                              <TabsContent className="m-0" value="search">
                                <Command shouldFilter={false}>
                                  <CommandInput
                                    onValueChange={setPropertySearchQuery}
                                    placeholder="Search properties..."
                                    value={propertySearchQuery}
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      <div className="py-6 text-center text-muted-foreground text-sm">
                                        No properties found for this customer
                                      </div>
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {filteredProperties.map((p: any) => (
                                        <CommandItem
                                          key={p.id}
                                          className="cursor-pointer"
                                          onSelect={() => {
                                            handlePropertyChange(p.id);
                                            setPropertySearchQuery("");
                                          }}
                                          value={`${p.name || p.address} ${p.city} ${p.state}`}
                                        >
                                          <div className="flex flex-1 flex-col">
                                            <span className="font-medium">
                                              {p.name || p.address}
                                            </span>
                                            <span className="text-muted-foreground text-xs">
                                              {p.city}, {p.state}
                                            </span>
                                          </div>
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </TabsContent>
                              
                              <TabsContent className="m-0 p-4" value="add">
                                <div className="space-y-3">
                                  <div>
                                    <Label className="mb-2 text-sm">
                                      Search for address using Google Places
                                    </Label>
                                    <GooglePlacesAutocomplete
                                      autoFocus
                                      onPlaceSelect={handlePlaceSelect}
                                      placeholder="Start typing an address..."
                                    />
                                  </div>
                                  <p className="text-muted-foreground text-xs">
                                    Select an address from the dropdown to automatically
                                    create and assign the property
                                  </p>
                                </div>
                              </TabsContent>
                            </Tabs>
                          ) : (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                              Please assign a customer first
                            </div>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <Button
                      disabled={isUpdatingCustomer}
                      onClick={handleRemoveCustomer}
                      size="sm"
                      variant="ghost"
                      className="h-8 px-3 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="mr-1.5 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        Add Customer
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-[400px] p-0"
                    >
                      <Command shouldFilter={false}>
                        <CommandInput
                          onValueChange={setCustomerSearchQuery}
                          placeholder="Search customers..."
                          value={customerSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>
                            <div className="py-6 text-center text-muted-foreground text-sm">
                              No customers found
                            </div>
                          </CommandEmpty>
                          <CommandGroup>
                            {filteredCustomers.slice(0, 50).map((c: any) => (
                              <CommandItem
                                key={c.id}
                                className="cursor-pointer"
                                onSelect={() => {
                                  handleCustomerChange(c.id);
                                  setCustomerSearchQuery("");
                                }}
                                value={`${c.first_name} ${c.last_name} ${c.email} ${c.phone} ${c.company_name || ""}`}
                              >
                                <div className="flex flex-1 flex-col">
                                  <span className="font-medium">
                                    {c.first_name} {c.last_name}
                                  </span>
                                  <span className="text-muted-foreground text-xs">
                                    {c.company_name || c.email || c.phone}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            <AccordionContent className="p-4">
              <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                {/* Customer Info */}
                {customer ? (
                  <div className="flex min-w-0 flex-1 flex-col gap-[22px]">
                    {/* Customer Header with Avatar */}
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                        {customer.first_name?.[0]}
                        {customer.last_name?.[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {customer.first_name} {customer.last_name}
                        </p>
                        {customer.company_name && (
                          <p className="truncate text-muted-foreground text-xs">
                            {customer.company_name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contact Info - Compact */}
                    <dl className="space-y-4">
                      {customer.email && (
                        <div className="flex flex-col">
                          <dt className="mb-1 text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            Email
                          </dt>
                          <dd>
                            <a
                              className="inline-flex items-center gap-1.5 text-foreground text-sm hover:underline"
                              href={`mailto:${customer.email}`}
                            >
                              <Mail className="size-3.5 flex-shrink-0 text-muted-foreground" />
                              <span className="truncate">{customer.email}</span>
                            </a>
                          </dd>
                        </div>
                      )}

                      {customer.phone && (
                        <div className="flex flex-col">
                          <dt className="mb-1 text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            Phone
                          </dt>
                          <dd>
                            <a
                              className="inline-flex items-center gap-1.5 text-foreground text-sm hover:underline"
                              href={`tel:${customer.phone}`}
                            >
                              <Phone className="size-3.5 flex-shrink-0 text-muted-foreground" />
                              {customer.phone}
                            </a>
                          </dd>
                        </div>
                      )}

                      {customer.address && (
                        <div className="flex flex-col">
                          <dt className="mb-1 text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            Billing Address
                          </dt>
                          <dd className="text-sm leading-relaxed">
                            {customer.address}
                            {customer.city && <>, {customer.city}</>}
                            {customer.state && <>, {customer.state}</>}
                            {customer.zip && <> {customer.zip}</>}
                          </dd>
                        </div>
                      )}
                    </dl>

                    {/* Metrics Grid - Compact */}
                    <div className="grid grid-cols-3 gap-4 rounded-md border bg-muted/30 p-4">
                      <div>
                        <div className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
                          Revenue
                        </div>
                        <div className="mt-1 font-semibold tabular-nums">
                          {formatCurrency(customer.total_revenue || 0)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
                          Jobs
                        </div>
                        <div className="mt-1 font-semibold tabular-nums">
                          {customer.total_jobs || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
                          Balance
                        </div>
                        <div className="mt-1 font-semibold tabular-nums text-orange-600">
                          {formatCurrency(customer.outstanding_balance || 0)}
                        </div>
                      </div>
                    </div>

                    {/* Equipment Badge */}
                    {equipment.length > 0 && (
                      <button
                        className="flex items-center justify-between rounded-md border border-border bg-background p-3 text-left transition-colors hover:bg-muted/50"
                        onClick={() => {
                          const equipmentSection = document.querySelector(
                            '[value="equipment"]'
                          );
                          equipmentSection?.scrollIntoView({
                            behavior: "smooth",
                          });
                        }}
                        type="button"
                      >
                        <div className="flex items-center gap-2">
                          <Wrench className="size-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="font-medium">
                              {equipment.length}
                            </span>{" "}
                            Equipment at Property
                          </span>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                    <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
                      <User className="size-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      No customer assigned
                    </p>
                  </div>
                )}

                {/* Divider between Customer and Property */}
                {customer && property && (
                  <div className="hidden h-auto w-px bg-border lg:block" />
                )}

                {/* Property Info */}
                {property ? (
                  <div className="flex min-w-0 flex-1 flex-col gap-[22px]">
                    {/* Property Header with Icon */}
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                        <MapPin className="size-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {property.name || "Service Location"}
                        </p>
                        <p className="truncate text-muted-foreground text-xs">
                          {property.property_type ? (
                            <span className="capitalize">
                              {property.property_type}
                            </span>
                          ) : (
                            "Property"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Address - Compact */}
                    <dl className="space-y-4">
                      <div className="flex flex-col">
                        <dt className="mb-1 text-muted-foreground text-xs font-medium uppercase tracking-wide">
                          Address
                        </dt>
                        <dd className="text-sm leading-relaxed">
                          {property.address}
                          {property.address2 && (
                            <>
                              <br />
                              {property.address2}
                            </>
                          )}
                          <br />
                          {property.city}, {property.state} {property.zip_code}
                        </dd>
                      </div>

                      {property.notes && (
                        <div className="flex flex-col">
                          <dt className="mb-1 text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            Access Instructions
                          </dt>
                          <dd className="text-sm leading-relaxed">
                            {property.notes}
                          </dd>
                        </div>
                      )}
                    </dl>

                    {/* Property Metrics - Compact Grid */}
                    {(property.square_footage ||
                      property.year_built ||
                      property.property_type) && (
                      <div className="grid grid-cols-3 gap-4 rounded-md border bg-muted/30 p-4">
                        {property.square_footage && (
                          <div>
                            <div className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
                              Size
                            </div>
                            <div className="mt-1 font-semibold tabular-nums">
                              {property.square_footage.toLocaleString()}
                              <span className="ml-1 text-muted-foreground text-[10px] font-normal">
                                sq ft
                              </span>
                            </div>
                          </div>
                        )}
                        {property.year_built && (
                          <div>
                            <div className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
                              Built
                            </div>
                            <div className="mt-1 font-semibold tabular-nums">
                              {property.year_built}
                            </div>
                          </div>
                        )}
                        {property.lat && property.lon && (
                          <div>
                            <div className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
                              Coords
                            </div>
                            <div className="mt-1 text-[11px] leading-tight tabular-nums">
                              {property.lat.toFixed(4)},
                              <br />
                              {property.lon.toFixed(4)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  customer && (
                    <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
                        <MapPin className="size-6 text-muted-foreground" />
                      </div>
                      <p className="mb-4 text-muted-foreground text-sm">
                        No property assigned
                      </p>
                      <DropdownMenu
                        modal={false}
                        onOpenChange={(open) => {
                          if (!open) setPropertyDropdownMode("search");
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            disabled={!customer}
                            size="sm"
                            variant="ghost"
                            className="h-8 px-3 text-xs"
                          >
                            <Plus className="mr-1.5 h-3.5 w-3.5" />
                            Add Property
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="center"
                          className="w-[500px] p-0"
                          onInteractOutside={(e) => {
                            // Don't close if interacting with Google Places autocomplete
                            const target = e.target as HTMLElement;
                            if (target.closest(".pac-container")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          {customer ? (
                            <Tabs
                              onValueChange={(value) =>
                                setPropertyDropdownMode(value as "search" | "add")
                              }
                              value={propertyDropdownMode}
                            >
                              <TabsList className="w-full rounded-none border-b">
                                <TabsTrigger className="flex-1" value="search">
                                  Search Existing
                                </TabsTrigger>
                                <TabsTrigger className="flex-1" value="add">
                                  Add New Address
                                </TabsTrigger>
                              </TabsList>
                              
                              <TabsContent className="m-0" value="search">
                                <Command shouldFilter={false}>
                                  <CommandInput
                                    onValueChange={setPropertySearchQuery}
                                    placeholder="Search properties..."
                                    value={propertySearchQuery}
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      <div className="py-6 text-center text-muted-foreground text-sm">
                                        No properties found for this customer
              </div>
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {filteredProperties.map((p: any) => (
                                        <CommandItem
                                          key={p.id}
                                          className="cursor-pointer"
                                          onSelect={() => {
                                            handlePropertyChange(p.id);
                                            setPropertySearchQuery("");
                                          }}
                                          value={`${p.name || p.address} ${p.city} ${p.state}`}
                                        >
                                          <div className="flex flex-1 flex-col">
                                            <span className="font-medium">
                                              {p.name || p.address}
                      </span>
                                            <span className="text-muted-foreground text-xs">
                                              {p.city}, {p.state}
                      </span>
                    </div>
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </TabsContent>
                              
                              <TabsContent className="m-0 p-4" value="add">
                                <div className="space-y-3">
                        <div>
                                    <Label className="mb-2 text-sm">
                                      Search for address using Google Places
                          </Label>
                                    <GooglePlacesAutocomplete
                                      autoFocus
                                      onPlaceSelect={handlePlaceSelect}
                                      placeholder="Start typing an address..."
                                    />
                        </div>
                                  <p className="text-muted-foreground text-xs">
                                    Select an address from the dropdown to automatically
                                    create and assign the property
                          </p>
                        </div>
                              </TabsContent>
                            </Tabs>
                          ) : (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                              Please assign a customer first
                    </div>
                )}
                        </DropdownMenuContent>
                      </DropdownMenu>
              </div>
                  )
                          )}
                        </div>

            </AccordionContent>
          </AccordionItem>


          {/* APPOINTMENTS */}
          <CollapsibleSection
            actions={
              <Button
                onClick={() => {
                  // TODO: Open appointment creation dialog or navigate to schedule page
                  router.push(`/dashboard/schedule/new?jobId=${job.id}`);
                }}
                size="sm"
                variant="ghost"
                className="h-8 px-3 text-xs"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Appointment
              </Button>
            }
            count={schedules.length}
            fullWidthContent
            icon={<Calendar className="h-5 w-5" />}
            title="Appointments"
            value="appointments"
          >
            <JobAppointmentsTable appointments={schedules} />
          </CollapsibleSection>

          {/* JOB TASKS & CHECKLIST */}
          <AccordionItem className="rounded-lg border bg-card shadow-sm" value="tasks">
            <div className="flex items-center justify-between gap-4 px-6 py-3.5">
              <AccordionTrigger className="flex-1 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">Job Tasks & Checklist</span>
                  <Badge variant="secondary" className="ml-1 text-xs">{tasks.length}</Badge>
                  {tasks.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {tasks.filter((t: any) => t.is_completed).length}/{tasks.length} Complete
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6">
                {/* Progress Bar */}
                {tasks.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium">Overall Progress</span>
                      <span className="text-muted-foreground">
                        {Math.round(
                          (tasks.filter((t: any) => t.is_completed).length /
                            tasks.length) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{
                          width: `${(tasks.filter((t: any) => t.is_completed).length / tasks.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Tasks grouped by category */}
                {tasks.length > 0 ? (
                  [
                    "Pre-Job",
                    "On-Site",
                    "Post-Job",
                    "Safety",
                    "Quality",
                    null,
                  ].map((category) => {
                    const categoryTasks = tasks.filter((t: any) =>
                      category === null ? !t.category : t.category === category
                    );

                    if (categoryTasks.length === 0) {
                      return null;
                    }

                    return (
                      <div key={category || "uncategorized"}>
                        <h4 className="mb-3 font-semibold text-muted-foreground text-sm uppercase">
                          {category || "Other Tasks"}
                        </h4>
                        <div className="space-y-2">
                          {categoryTasks.map((task: any) => {
                            const assignedUser = Array.isArray(
                              task.assigned_user
                            )
                              ? task.assigned_user[0]
                              : task.assigned_user;

                            return (
                              <div
                                className={cn(
                                  "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                                  task.is_completed && "bg-gray-50 opacity-75"
                                )}
                                key={task.id}
                              >
                                {/* Checkbox */}
                                <div className="flex items-center pt-0.5">
                                  <input
                                    checked={task.is_completed}
                                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500"
                                    onChange={() => {}}
                                    type="checkbox"
                                  />
                                </div>

                                {/* Task Content */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <p
                                        className={cn(
                                          "font-medium",
                                          task.is_completed &&
                                            "text-muted-foreground line-through"
                                        )}
                                      >
                                        {task.title}
                                        {task.is_required && (
                                          <Badge
                                            className="ml-2 text-xs"
                                            variant="destructive"
                                          >
                                            Required
                                          </Badge>
                                        )}
                                      </p>
                                      {task.description && (
                                        <p className="mt-1 text-muted-foreground text-sm">
                                          {task.description}
                                        </p>
                                      )}
                                    </div>

                                    {/* Assigned User */}
                                    {assignedUser && (
                                      <div className="flex items-center gap-1">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={assignedUser.avatar}
                                          />
                                          <AvatarFallback className="text-xs">
                                            {assignedUser.name
                                              ?.substring(0, 2)
                                              .toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                      </div>
                                    )}
                                  </div>

                                  {/* Task Meta */}
                                  <div className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                                    {task.is_completed && task.completed_at && (
                                      <span className="flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        Completed{" "}
                                        {formatDate(task.completed_at)}
                                      </span>
                                    )}
                                    {!task.is_completed && task.due_date && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Due {formatDate(task.due_date)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <CheckCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="mb-2 text-muted-foreground text-sm">
                      No tasks added yet
                    </p>
                    <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Add Task
                    </Button>
                  </div>
                )}

                {/* Quick Actions */}
                {tasks.length > 0 && (
                  <div className="flex gap-2 border-t pt-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-3 text-xs"
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Add Task
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-3 text-xs"
                    >
                      Load Template
                    </Button>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* INVOICES */}
          <CollapsibleSection
            actions={
              <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Create Invoice
              </Button>
            }
            count={invoices.length}
            fullWidthContent
            icon={<FileText className="h-5 w-5" />}
            title="Invoices"
            value="invoices"
          >
            <JobInvoicesTable invoices={invoices} />
          </CollapsibleSection>

          {/* ESTIMATES */}
          <CollapsibleSection
            actions={
              <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Create Estimate
              </Button>
            }
            count={estimates.length}
            fullWidthContent
            icon={<Receipt className="h-5 w-5" />}
            title="Estimates"
            value="estimates"
          >
            <JobEstimatesTable estimates={estimates} />
          </CollapsibleSection>

          {/* PURCHASE ORDERS */}
          <CollapsibleSection
            actions={
              <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Create PO
              </Button>
            }
            count={purchaseOrders.length}
            fullWidthContent
            icon={<Package className="h-5 w-5" />}
            title="Purchase Orders"
            value="purchase-orders"
          >
            <JobPurchaseOrdersTable purchaseOrders={purchaseOrders} />
          </CollapsibleSection>

          {/* PHOTOS & DOCUMENTS */}
          <AccordionItem 
            className={cn(
              "rounded-lg border bg-card shadow-sm transition-colors",
              isDraggingOver && "border-primary bg-primary/5"
            )} 
            value="photos"
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDraggingOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDraggingOver(false);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDraggingOver(false);
              setShowUploader(true);
              // The InlinePhotoUploader will handle the files
            }}
          >
            <div className="flex items-center justify-between gap-4 px-6 py-3.5">
              <AccordionTrigger className="flex-1 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <Camera className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">Photos & Documents</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {photos.length + documents.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              {!showUploader && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUploader(true);
                    }}
                    size="sm"
                    variant="ghost"
                    className="h-8 px-3 text-xs"
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Upload
                  </Button>
                </div>
              )}
            </div>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6">
                {/* Inline Uploader */}
                {showUploader && (
                  <InlinePhotoUploader
                    jobId={job.id}
                    companyId={job.company_id}
                    onCancel={() => setShowUploader(false)}
                    onUploadComplete={() => {
                      setShowUploader(false);
                      router.refresh();
                    }}
                  />
                )}

                {/* Photo Categories */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold">
                      Photos by Category ({photos.length})
                    </h4>
                  </div>
                  {photos.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-4">
                    {[
                      "before",
                      "during",
                      "after",
                      "issue",
                      "equipment",
                      "completion",
                      "other",
                    ].map((category) => {
                      const count = photos.filter(
                        (p: any) => p.category === category
                      ).length;
                      return (
                        <div
                          className="rounded-lg border p-4 text-center"
                          key={category}
                        >
                          <p className="font-medium text-muted-foreground text-xs uppercase">
                            {category}
                          </p>
                          <p className="font-bold text-3xl">{count}</p>
                        </div>
                      );
                    })}
                  </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Camera className="mx-auto mb-3 h-12 w-12 text-muted-foreground opacity-50" />
                      <p className="mb-2 text-muted-foreground text-sm">
                        No photos uploaded yet
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Upload photos to document the job progress
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Documents */}
                <div>
                  <h4 className="mb-3 font-semibold">
                    Documents ({documents.length})
                  </h4>
                  {documents.length > 0 ? (
                    <div className="space-y-2">
                      {documents.map((doc: any) => (
                        <div
                          className="flex items-center justify-between rounded-lg border p-3"
                          key={doc.id}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doc.file_name}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground opacity-50" />
                      <p className="mb-2 text-muted-foreground text-sm">
                        No documents uploaded yet
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Upload documents, receipts, or other files related to this job
                    </p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Signatures */}
                <div>
                  <h4 className="mb-3 font-semibold">Signatures</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium text-sm">
                          Customer Signature
                        </p>
                        {signatures.find(
                          (s: any) => s.signature_type === "customer"
                        ) ? (
                          <Badge variant="default">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Signed
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </div>
                      {signatures.find(
                        (s: any) => s.signature_type === "customer"
                      ) && (
                        <p className="text-muted-foreground text-xs">
                          Signed{" "}
                          {formatDate(
                            signatures.find(
                              (s: any) => s.signature_type === "customer"
                            ).signed_at
                          )}
                        </p>
                      )}
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium text-sm">
                          Technician Signature
                        </p>
                        {signatures.find(
                          (s: any) => s.signature_type === "technician"
                        ) ? (
                          <Badge variant="default">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Signed
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </div>
                      {signatures.find(
                        (s: any) => s.signature_type === "technician"
                      ) && (
                        <p className="text-muted-foreground text-xs">
                          Signed{" "}
                          {formatDate(
                            signatures.find(
                              (s: any) => s.signature_type === "technician"
                            ).signed_at
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ACTIVITY & COMMUNICATIONS */}
          <AccordionItem className="rounded-lg border bg-card shadow-sm" value="activity">
            <div className="flex items-center justify-between gap-4 px-6 py-3.5">
              <AccordionTrigger className="flex-1 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">Activity & Communications</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {activities.length + communications.length}
                  </Badge>
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3">
                {/* Combined timeline */}
                {activities.length > 0 || communications.length > 0 ? (
                  [...activities, ...communications]
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .slice(0, 20)
                  .map((item: any) => {
                    const user = Array.isArray(item.user)
                      ? item.user[0]
                      : item.user;
                    const isComm = item.type || item.subject; // Communications have type or subject

                    return (
                      <div
                        className="flex gap-3 rounded-lg border p-3"
                        key={item.id}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="text-xs">
                            {user?.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {user?.name || "System"}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {formatDate(item.created_at)}
                            </span>
                            {isComm && item.type && (
                              <Badge className="text-xs" variant="outline">
                                {item.type.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          {item.subject && (
                            <p className="mb-1 font-medium text-sm">
                              {item.subject}
                            </p>
                          )}
                          <p className="text-muted-foreground text-sm">
                            {item.description || item.body || "Activity logged"}
                          </p>
                        </div>
                      </div>
                    );
                    })
                ) : (
                  <div className="py-8 text-center">
                    <Activity className="mx-auto mb-3 h-12 w-12 text-muted-foreground opacity-50" />
                    <p className="mb-2 text-muted-foreground text-sm">
                      No activity or communications yet
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Activity logs and communications will appear here
                    </p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* EQUIPMENT SERVICED */}
          <AccordionItem
            className="rounded-lg border bg-card shadow-sm"
            value="equipment-serviced"
          >
            <div className="flex items-center justify-between gap-4 px-6 py-3.5">
              <AccordionTrigger className="flex-1 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <Wrench className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">Equipment Serviced on This Job</span>
                  <Badge variant="secondary" className="ml-1 text-xs">{jobEquipment.length}</Badge>
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent className="px-6 pb-6">
              {jobEquipment.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Wrench className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-4 text-muted-foreground text-sm">
                    No equipment has been added to this job yet
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Equipment serviced on this job will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobEquipment.map((je: any) => (
                    <div
                      className="space-y-3 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                      key={je.id}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h4 className="font-semibold">
                              {je.equipment?.name}
                            </h4>
                            <Badge variant="secondary">{je.service_type}</Badge>
                          </div>
                          <div className="space-y-1 text-muted-foreground text-sm">
                            <p>
                              {je.equipment?.manufacturer} {je.equipment?.model}
                              {je.equipment?.serial_number &&
                                ` • SN: ${je.equipment.serial_number}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {je.work_performed && (
                        <div className="text-sm">
                          <span className="font-medium">Work Performed:</span>
                          <p className="mt-1 text-muted-foreground">
                            {je.work_performed}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {je.condition_before && (
                          <div>
                            <span className="mr-2 text-muted-foreground">
                              Before:
                            </span>
                            <Badge variant="outline">
                              {je.condition_before}
                            </Badge>
                          </div>
                        )}
                        {je.condition_after && (
                          <div>
                            <span className="mr-2 text-muted-foreground">
                              After:
                            </span>
                            <Badge variant="default">
                              {je.condition_after}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* CUSTOMER EQUIPMENT AT PROPERTY */}
          {equipment.length > 0 && (
            <AccordionItem
              className="rounded-lg border bg-card shadow-sm"
              value="equipment"
            >
              <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                <AccordionTrigger className="flex-1 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm">Customer Equipment at Property</span>
                    <Badge variant="secondary" className="ml-1 text-xs">{equipment.length}</Badge>
                  </div>
                </AccordionTrigger>
              </div>
              <AccordionContent className="px-6 pb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Serial #</TableHead>
                      <TableHead>Last Service</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipment.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.manufacturer || "N/A"}</TableCell>
                        <TableCell>{item.model || "N/A"}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.serial_number || "N/A"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.last_service_date
                            ? formatDate(item.last_service_date)
                            : "Never"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {/* Spacer for bottom padding */}
        <div className="h-24" />
      </div>

      {/* Create Property Dialog */}
      <Dialog
        onOpenChange={setIsCreatePropertyDialogOpen}
        open={isCreatePropertyDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Property</DialogTitle>
            <DialogDescription>
              Add a new property for {customer?.first_name} {customer?.last_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="property-name">Property Name</Label>
              <Input
                id="property-name"
                onChange={(e) =>
                  setNewProperty({ ...newProperty, name: e.target.value })
                }
                placeholder="Main Residence"
                value={newProperty.name}
              />
    </div>
            
            <div className="grid gap-2">
              <Label htmlFor="property-address">
                Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="property-address"
                onChange={(e) =>
                  setNewProperty({ ...newProperty, address: e.target.value })
                }
                placeholder="123 Main St"
                required
                value={newProperty.address}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="property-address2">Address Line 2</Label>
              <Input
                id="property-address2"
                onChange={(e) =>
                  setNewProperty({ ...newProperty, address2: e.target.value })
                }
                placeholder="Apt 4B"
                value={newProperty.address2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="property-city">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="property-city"
                  onChange={(e) =>
                    setNewProperty({ ...newProperty, city: e.target.value })
                  }
                  placeholder="New York"
                  required
                  value={newProperty.city}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="property-state">
                  State <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="property-state"
                  onChange={(e) =>
                    setNewProperty({ ...newProperty, state: e.target.value })
                  }
                  placeholder="NY"
                  required
                  value={newProperty.state}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="property-zip">
                ZIP Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="property-zip"
                onChange={(e) =>
                  setNewProperty({ ...newProperty, zipCode: e.target.value })
                }
                placeholder="10001"
                required
                value={newProperty.zipCode}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              disabled={isCreatingProperty}
              onClick={() => setIsCreatePropertyDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={
                isCreatingProperty ||
                !newProperty.address ||
                !newProperty.city ||
                !newProperty.state ||
                !newProperty.zipCode
              }
              onClick={handleCreateProperty}
            >
              {isCreatingProperty ? "Creating..." : "Create Property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
}
