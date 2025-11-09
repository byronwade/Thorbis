/**
 * Job Page Content - Comprehensive Single Page View
 * All details visible with collapsible sections - like ServiceTitan/HouseCall Pro
 */

"use client";

import {
  Activity,
  AlertCircle,
  Building2,
  Calendar,
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Edit2,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Plus,
  Receipt,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { updateJob } from "@/actions/jobs";
import { findOrCreateProperty } from "@/actions/properties";
import { EmailDialog } from "@/components/communication/email-dialog";
import { SMSDialog } from "@/components/communication/sms-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CollapsibleActionButton,
  CollapsibleDataSection,
} from "@/components/ui/collapsible-data-section";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { InlinePhotoUploader } from "./InlinePhotoUploader";
import { JobAppointmentsTable } from "./job-appointments-table";
import { JobEnrichmentInline } from "./job-enrichment-inline";
import { JobEstimatesTable } from "./job-estimates-table";
import { JobInvoicesTable } from "./job-invoices-table";
import { JobPurchaseOrdersTable } from "./job-purchase-orders-table";
import { JobQuickActions } from "./job-quick-actions";
import { TravelTime } from "./travel-time";
import { PropertyLocationVisual } from "./widgets/property-location-visual";

type JobPageContentProps = {
  jobData: any;
  metrics: any;
};

export function JobPageContent({ jobData, metrics }: JobPageContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [localJob, setLocalJob] = useState({
    ...jobData.job,
    priority: jobData.job.priority || "medium", // Ensure default priority
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Prevent hydration mismatch by only rendering Radix components after mount
  useEffect(() => {
    setMounted(true);
  }, []);

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
    companyPhones = [],
  } = jobData;

  // Local state for optimistic updates
  const [customer, setCustomer] = useState(initialCustomer);
  const [property, setProperty] = useState(initialProperty);

  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [propertySearchQuery, setPropertySearchQuery] = useState("");
  const [propertyDropdownMode, setPropertyDropdownMode] = useState<
    "search" | "add"
  >("search");
  const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false);
  const [isUpdatingProperty, setIsUpdatingProperty] = useState(false);
  const [isCreatePropertyDialogOpen, setIsCreatePropertyDialogOpen] =
    useState(false);
  const [isCreatingProperty, setIsCreatingProperty] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Communication dialog states
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);

  // Get call management from UI store
  const setIncomingCall = useUIStore((state) => state.setIncomingCall);

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
        toast.success("Customer updated successfully", {
          id: "customer-update",
        });
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
        toast.success("Property updated successfully", {
          id: "property-update",
        });
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
        toast.error(
          "error" in result ? result.error : "Failed to create property"
        );
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
        toast.error(
          "error" in result ? result.error : "Failed to create property"
        );
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
    return (
      name.includes(query) || address.includes(query) || city.includes(query)
    );
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
        if (formData.has("title"))
          updatedJob.title = formData.get("title") as string;
        if (formData.has("description"))
          updatedJob.description = formData.get("description") as string;
        if (formData.has("status"))
          updatedJob.status = formData.get("status") as string;
        if (formData.has("priority"))
          updatedJob.priority = formData.get("priority") as string;
        if (formData.has("jobType"))
          updatedJob.job_type = formData.get("jobType") as string;
        if (formData.has("notes"))
          updatedJob.notes = formData.get("notes") as string;
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

  const formatRelativeTime = (date: string | Date | null) => {
    if (!date) {
      return "—";
    }
    const value =
      typeof date === "string" || typeof date === "number"
        ? new Date(date)
        : date;

    if (!value || Number.isNaN(value.getTime())) {
      return "—";
    }

    const diffMs = value.getTime() - Date.now();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (Math.abs(diffMinutes) < 60) {
      return rtf.format(diffMinutes, "minute");
    }

    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) {
      return rtf.format(diffHours, "hour");
    }

    const diffDays = Math.round(diffHours / 24);
    if (Math.abs(diffDays) < 30) {
      return rtf.format(diffDays, "day");
    }

    const diffMonths = Math.round(diffDays / 30);
    if (Math.abs(diffMonths) < 12) {
      return rtf.format(diffMonths, "month");
    }

    const diffYears = Math.round(diffMonths / 12);
    return rtf.format(diffYears, "year");
  };

  const customerDetailPath = customer
    ? `/dashboard/customers/${customer.id}`
    : null;

  const parseMaybeJson = (value: unknown) => {
    if (!value) {
      return null;
    }
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }
    if (typeof value === "object") {
      return value as Record<string, unknown>;
    }
    return null;
  };

  const customerTags = useMemo<string[]>(() => {
    if (!customer?.tags) {
      return [];
    }

    if (Array.isArray(customer.tags)) {
      return customer.tags.filter(Boolean);
    }

    if (typeof customer.tags === "string") {
      try {
        const parsed = JSON.parse(customer.tags);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
        if (typeof parsed === "string") {
          return parsed
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        }
      } catch {
        return customer.tags
          .split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean);
      }
    }

    return [];
  }, [customer?.tags]);

  const customerMetadata = useMemo<Record<string, any>>(() => {
    const parsed = parseMaybeJson(customer?.metadata);
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, any>)
      : {};
  }, [customer?.metadata]);

  const communicationPreferences = useMemo<Record<
    string,
    boolean
  > | null>(() => {
    const parsed = parseMaybeJson(customer?.communication_preferences);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, boolean>;
    }
    return null;
  }, [customer?.communication_preferences]);

  const membershipLabel = useMemo(() => {
    const fromMetadata =
      customerMetadata.membershipTier ||
      customerMetadata.membership_level ||
      customerMetadata.membership ||
      customerMetadata.plan;

    if (fromMetadata) {
      return fromMetadata;
    }

    const vipTag = customerTags.find((tag) =>
      ["vip", "member", "plan", "tier", "priority"].some((keyword) =>
        tag.toLowerCase().includes(keyword)
      )
    );

    return vipTag ?? null;
  }, [customerMetadata, customerTags]);

  const outstandingBalance =
    customer?.outstanding_balance ?? customer?.outstandingBalance ?? 0;

  const accountHealth = useMemo(() => {
    if (!customer) {
      return {
        tone: "neutral",
        label: "No customer",
        description: "",
      };
    }

    if ((customer.status || "").toLowerCase() === "blocked") {
      return {
        tone: "destructive",
        label: "Credit Hold",
        description: "Account is blocked until balance issues are resolved.",
      };
    }

    if (outstandingBalance > 0) {
      return {
        tone: "warning",
        label: "Balance Due",
        description: `${formatCurrency(outstandingBalance)} outstanding`,
      };
    }

    if ((customer.status || "").toLowerCase() === "inactive") {
      return {
        tone: "warning",
        label: "Inactive",
        description: "Customer marked inactive. Reactivate to schedule work.",
      };
    }

    return {
      tone: "positive",
      label: "In Good Standing",
      description: "No outstanding balances or restrictions.",
    };
  }, [customer, outstandingBalance]);

  const toneClasses = {
    positive:
      "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
    warning:
      "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200",
    destructive:
      "border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200",
    neutral:
      "border-muted bg-muted/40 text-muted-foreground dark:border-muted/30 dark:bg-muted/20 dark:text-muted-foreground",
  } as const;

  const accountToneClass =
    toneClasses[accountHealth.tone as keyof typeof toneClasses] ??
    toneClasses.neutral;

  const paymentTermsRaw =
    customer?.payment_terms ?? customer?.paymentTerms ?? "due_on_receipt";

  const normalizedPaymentTerms = paymentTermsRaw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char: string) => char.toUpperCase());

  const creditLimit = customer?.credit_limit ?? customer?.creditLimit ?? 0;

  const openInvoices = useMemo(() => {
    const list = Array.isArray(invoices) ? invoices : [];
    return list.filter((invoice: any) => {
      const status = (invoice?.status || "").toLowerCase();
      return ["sent", "viewed", "partial", "overdue"].includes(status);
    });
  }, [invoices]);

  const overdueInvoices = useMemo(() => {
    const now = Date.now();
    return openInvoices.filter((invoice: any) => {
      const status = (invoice?.status || "").toLowerCase();
      if (status === "overdue") {
        return true;
      }
      const due =
        invoice?.due_date ??
        invoice?.dueDate ??
        invoice?.due_on ??
        invoice?.dueOn;
      if (!due) {
        return false;
      }
      const dueDate = new Date(due);
      return !Number.isNaN(dueDate.getTime()) && dueDate.getTime() < now;
    });
  }, [openInvoices]);

  const totalOutstanding = useMemo(
    () =>
      openInvoices.reduce((sum: number, invoice: any) => {
        const balance = invoice?.balance_amount ?? invoice?.balanceAmount ?? 0;
        return sum + (balance || 0);
      }, 0),
    [openInvoices]
  );

  const nextDueInvoice = useMemo(() => {
    const withDates = openInvoices
      .map((invoice: any) => {
        const due =
          invoice?.due_date ??
          invoice?.dueDate ??
          invoice?.due_on ??
          invoice?.dueOn;
        const dueDate = due ? new Date(due) : null;
        return {
          invoice,
          dueDate,
        };
      })
      .filter((item) => item.dueDate && !Number.isNaN(item.dueDate.getTime()))
      .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime());

    return withDates[0]?.invoice ?? null;
  }, [openInvoices]);

  const upcomingVisits = useMemo(() => {
    const list = Array.isArray(schedules) ? schedules : [];
    const now = Date.now();

    return list
      .map((schedule: any) => {
        const start =
          schedule?.start_time ??
          schedule?.startTime ??
          schedule?.start_at ??
          schedule?.startAt;
        const startDate = start ? new Date(start) : null;
        return {
          schedule,
          startDate,
        };
      })
      .filter(
        ({ startDate }) =>
          startDate &&
          !Number.isNaN(startDate.getTime()) &&
          startDate.getTime() > now
      )
      .sort((a, b) => a.startDate!.getTime() - b.startDate!.getTime())
      .map(({ schedule }) => schedule);
  }, [schedules]);

  const nextVisit = upcomingVisits[0] ?? null;

  const lastCommunication = communications?.[0] ?? null;

  const communicationChannels = useMemo(() => {
    if (!communicationPreferences) {
      return null;
    }

    const channels: Array<{ key: string; label: string; enabled: boolean }> = [
      {
        key: "email",
        label: "Email",
        enabled:
          communicationPreferences.email ??
          communicationPreferences.Email ??
          true,
      },
      {
        key: "sms",
        label: "SMS",
        enabled:
          communicationPreferences.sms ?? communicationPreferences.SMS ?? false,
      },
      {
        key: "phone",
        label: "Phone",
        enabled:
          communicationPreferences.phone ??
          communicationPreferences.Phone ??
          false,
      },
    ];

    return channels;
  }, [communicationPreferences]);

  const preferredContact =
    customer?.preferred_contact_method ??
    customer?.preferredContactMethod ??
    (typeof communicationPreferences?.preferred === "string"
      ? communicationPreferences?.preferred
      : null) ??
    "email";

  const normalizedPreferredContact = preferredContact
    ? preferredContact.replace(/_/g, " ")
    : "Not set";

  const customerSource =
    customer?.source ??
    customerMetadata?.source ??
    customerMetadata?.acquiredVia ??
    "—";

  const portalEnabled =
    customer?.portal_enabled ?? customer?.portalEnabled ?? false;

  const lastPortalLogin =
    customer?.portal_last_login_at ?? customer?.portalLastLoginAt ?? null;

  const customerSince = customer?.created_at ?? customer?.createdAt ?? null;

  const lastInvoiceDate =
    customer?.last_invoice_date ?? customer?.lastInvoiceDate ?? null;

  const lastPaymentDate =
    customer?.last_payment_date ?? customer?.lastPaymentDate ?? null;

  const lastJobDate = customer?.last_job_date ?? customer?.lastJobDate ?? null;

  const averageJobValue =
    customer?.average_job_value ?? customer?.averageJobValue ?? 0;

  const totalRevenue = customer?.total_revenue ?? customer?.totalRevenue ?? 0;

  const totalJobs = customer?.total_jobs ?? customer?.totalJobs ?? 0;

  const outstandingInvoicesCount = openInvoices.length;
  const overdueInvoicesCount = overdueInvoices.length;

  const internalNotes =
    customer?.internal_notes ?? customer?.internalNotes ?? "";

  const assignedTeamMembers = useMemo(() => {
    if (!Array.isArray(teamAssignments) || teamAssignments.length === 0) {
      return [];
    }

    const seen = new Set<string>();

    return teamAssignments
      .map((assignment: any) => {
        const teamMember = assignment?.team_member || assignment?.teamMember;
        if (!teamMember) {
          return null;
        }

        const user =
          teamMember.users ||
          teamMember.user ||
          assignment?.user ||
          assignment?.assigned_user;

        const memberId = teamMember.id ?? assignment.id;

        if (!memberId || seen.has(memberId)) {
          return null;
        }

        seen.add(memberId);

        return {
          id: memberId,
          userId: user?.id ?? teamMember.user_id ?? assignment.user_id ?? null,
          name:
            user?.name ??
            teamMember.name ??
            teamMember.display_name ??
            "Team member",
          title:
            teamMember.job_title ??
            assignment.job_title ??
            assignment.role ??
            user?.job_title ??
            null,
          avatar:
            user?.avatar ??
            user?.avatar_url ??
            user?.profile_image_url ??
            teamMember.avatar ??
            null,
          email: user?.email ?? teamMember.email ?? null,
        };
      })
      .filter(Boolean);
  }, [teamAssignments]);

  const primaryAddressLine = [
    customer?.address,
    customer?.city,
    customer?.state,
    customer?.zip_code ?? customer?.zipCode,
  ]
    .filter(Boolean)
    .join(", ");

  const secondaryPhone =
    customer?.secondary_phone ?? customer?.secondaryPhone ?? null;

  const billingEmail =
    customer?.billing_email ??
    customer?.billingEmail ??
    customer?.email ??
    null;

  const lastCommunicationAt =
    lastCommunication?.created_at ?? lastCommunication?.createdAt ?? null;

  const lastCommunicationChannel =
    lastCommunication?.channel ??
    lastCommunication?.type ??
    lastCommunication?.medium ??
    null;

  const nextInvoiceDueDate =
    nextDueInvoice?.due_date ??
    nextDueInvoice?.dueDate ??
    nextDueInvoice?.due_on ??
    nextDueInvoice?.dueOn ??
    null;

  const nextInvoiceBalance =
    nextDueInvoice?.balance_amount ?? nextDueInvoice?.balanceAmount ?? 0;

  const customerStatusLabel = (customer?.status || "active").replace(/_/g, " ");

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
            <div className="mb-6">
              <JobEnrichmentInline
                enrichmentData={jobData.enrichmentData}
                jobId={jobData.job.id}
                property={
                  jobData.property
                    ? {
                        address: jobData.property.address,
                        city: jobData.property.city,
                        state: jobData.property.state,
                        zip_code: jobData.property.zip_code,
                        lat: jobData.property.lat,
                        lon: jobData.property.lon,
                      }
                    : undefined
                }
              />
            </div>

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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {/* Status */}
              {mounted ? (
                <Select
                  onValueChange={(value) => handleFieldChange("status", value)}
                  value={localJob.status || undefined}
                >
                  <SelectTrigger className="inline-flex h-auto items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm shadow-none transition-colors hover:bg-accent hover:text-accent-foreground focus:ring-0 [&>span]:flex [&>span]:items-center [&>span]:gap-2">
                    <SelectValue placeholder="Set status...">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">
                          {localJob.status || "Set status..."}
                        </span>
                      </div>
                    </SelectValue>
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
              ) : (
                <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">{localJob.status || "—"}</span>
                </div>
              )}

              {/* Priority */}
              {mounted ? (
                <Select
                  onValueChange={(value) =>
                    handleFieldChange("priority", value)
                  }
                  value={localJob.priority || undefined}
                >
                  <SelectTrigger className="inline-flex h-auto items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm shadow-none transition-colors hover:bg-accent hover:text-accent-foreground focus:ring-0 [&>span]:flex [&>span]:items-center [&>span]:gap-2">
                    <SelectValue placeholder="Set priority...">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">
                          {localJob.priority || "Set priority..."}
                        </span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">
                    {localJob.priority || "—"}
                  </span>
                </div>
              )}

              {/* Job Type */}
              <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                <Wrench className="h-4 w-4" />
                <Input
                  className="h-auto w-auto min-w-[100px] border-0 bg-transparent p-0 font-medium shadow-none focus-visible:ring-0"
                  onChange={(e) =>
                    handleFieldChange("service_type", e.target.value)
                  }
                  placeholder="Enter type..."
                  value={localJob.service_type || localJob.job_type || ""}
                />
              </div>

              {/* Assigned To */}
              {assignedUser && (
                <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{assignedUser.name}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-muted-foreground text-sm">
                Description:
              </span>
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
          <JobQuickActions currentStatus={job.status} jobId={job.id} />
        </div>

        {/* All Sections - Collapsible */}
        <div className="mx-auto w-full max-w-7xl px-6 py-8">
          <div suppressHydrationWarning>
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
              <AccordionItem
                className="rounded-lg border bg-card shadow-sm"
                value="customer"
              >
                <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <AccordionTrigger className="flex-1 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">
                        Customer & Property Details
                      </span>
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
                              className="h-8 px-3 text-xs"
                              disabled={isUpdatingCustomer}
                              size="sm"
                              variant="secondary"
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
                                  {filteredCustomers
                                    .slice(0, 50)
                                    .map((c: any) => (
                                      <CommandItem
                                        className="cursor-pointer"
                                        key={c.id}
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
                                            {c.company_name ||
                                              c.email ||
                                              c.phone}
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
                                className="h-8 px-3 text-xs"
                                disabled={isUpdatingProperty || !customer}
                                size="sm"
                                variant="secondary"
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
                                    setPropertyDropdownMode(
                                      value as "search" | "add"
                                    )
                                  }
                                  value={propertyDropdownMode}
                                >
                                  <TabsList className="w-full rounded-none border-b">
                                    <TabsTrigger
                                      className="flex-1"
                                      value="search"
                                    >
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
                                            No properties found for this
                                            customer
                                          </div>
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {filteredProperties.map((p: any) => (
                                            <CommandItem
                                              className="cursor-pointer"
                                              key={p.id}
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
                                        Select an address from the dropdown to
                                        automatically create and assign the
                                        property
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
                                    setPropertyDropdownMode(
                                      value as "search" | "add"
                                    )
                                  }
                                  value={propertyDropdownMode}
                                >
                                  <TabsList className="w-full rounded-none border-b">
                                    <TabsTrigger
                                      className="flex-1"
                                      value="search"
                                    >
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
                                            No properties found for this
                                            customer
                                          </div>
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {filteredProperties.map((p: any) => (
                                            <CommandItem
                                              className="cursor-pointer"
                                              key={p.id}
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
                                        Select an address from the dropdown to
                                        automatically create and assign the
                                        property
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
                          className="h-8 px-3 text-destructive text-xs hover:bg-destructive/10 hover:text-destructive"
                          disabled={isUpdatingCustomer}
                          onClick={handleRemoveCustomer}
                          size="sm"
                          variant="secondary"
                        >
                          <X className="mr-1.5 h-3.5 w-3.5" />
                          Remove
                        </Button>
                      </>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="h-8 px-3 text-xs"
                            size="sm"
                            variant="secondary"
                          >
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
                                {filteredCustomers
                                  .slice(0, 50)
                                  .map((c: any) => (
                                    <CommandItem
                                      className="cursor-pointer"
                                      key={c.id}
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
                <AccordionContent className="p-0">
                  <div className="flex flex-col gap-0 lg:flex-row">
                    {/* Customer Info */}
                    {customer ? (
                      <div className="flex min-w-0 flex-1 flex-col divide-y divide-border/40">
                        {/* Header with Avatar and Key Info */}
                        <div className="flex items-start justify-between gap-6 p-6">
                          <div className="flex min-w-0 items-start gap-4">
                            <div className="flex size-14 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xl">
                              {customer.first_name?.[0]}
                              {customer.last_name?.[0]}
                            </div>
                            <div className="min-w-0 space-y-1.5">
                              {customerDetailPath ? (
                                <Link
                                  className="block font-semibold text-foreground text-lg transition-colors hover:text-primary"
                                  href={customerDetailPath}
                                >
                                  {customer.first_name} {customer.last_name}
                                </Link>
                              ) : (
                                <span className="block font-semibold text-foreground text-lg">
                                  {customer.first_name} {customer.last_name}
                                </span>
                              )}
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                  className="h-6 rounded-full px-2.5 font-medium text-[11px] capitalize"
                                  variant="outline"
                                >
                                  {customerStatusLabel}
                                </Badge>
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-medium text-[11px]",
                                    accountToneClass
                                  )}
                                  title={accountHealth.description}
                                >
                                  <ShieldCheck className="h-3 w-3" />
                                  {accountHealth.label}
                                </span>
                                {membershipLabel && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-[11px] text-primary">
                                    <Sparkles className="h-3 w-3" />
                                    {membershipLabel}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {customerDetailPath && (
                            <Button
                              asChild
                              className="flex-shrink-0"
                              size="sm"
                              variant="outline"
                            >
                              <Link
                                className="flex items-center gap-1.5"
                                href={customerDetailPath}
                              >
                                View Profile
                                <ChevronRight className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          )}
                        </div>

                        {/* Key Stats Bar */}
                        <div className="grid grid-cols-4 divide-x divide-border/40 bg-muted/20 px-6 py-4">
                          <div className="px-3 first:pl-0 last:pr-0">
                            <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                              Lifetime Value
                            </div>
                            <div className="mt-1 font-bold text-foreground text-lg">
                              {formatCurrency(totalRevenue)}
                            </div>
                            <div className="mt-0.5 text-muted-foreground text-xs">
                              {totalJobs} job{totalJobs === 1 ? "" : "s"} ·{" "}
                              {formatCurrency(averageJobValue)} avg
                            </div>
                          </div>
                          <div className="px-3 first:pl-0 last:pr-0">
                            <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                              Balance Due
                            </div>
                            <div
                              className={cn(
                                "mt-1 font-bold text-lg",
                                outstandingBalance > 0
                                  ? "text-orange-600"
                                  : "text-foreground"
                              )}
                            >
                              {formatCurrency(outstandingBalance)}
                            </div>
                            <div className="mt-0.5 text-muted-foreground text-xs">
                              {overdueInvoicesCount > 0
                                ? `${overdueInvoicesCount} overdue`
                                : normalizedPaymentTerms}
                            </div>
                          </div>
                          <div className="px-3 first:pl-0 last:pr-0">
                            <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                              Credit Limit
                            </div>
                            <div className="mt-1 font-bold text-foreground text-lg">
                              {creditLimit > 0
                                ? formatCurrency(creditLimit)
                                : "None"}
                            </div>
                            <div className="mt-0.5 text-muted-foreground text-xs">
                              {creditLimit > 0 && outstandingBalance > 0
                                ? `${Math.round((outstandingBalance / creditLimit) * 100)}% used`
                                : creditLimit > 0
                                  ? "Available"
                                  : "Cash only"}
                            </div>
                          </div>
                          <div className="px-3 first:pl-0 last:pr-0">
                            <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                              Customer Since
                            </div>
                            <div className="mt-1 font-bold text-foreground text-lg">
                              {customerSince
                                ? formatRelativeTime(customerSince)
                                : "—"}
                            </div>
                            <div className="mt-0.5 text-muted-foreground text-xs capitalize">
                              via {customerSource}
                            </div>
                          </div>
                        </div>

                        {/* Contact Information with Quick Actions */}
                        <div className="space-y-4 p-6">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                              Contact
                            </div>
                            {/* Quick Action Buttons */}
                            <div className="flex items-center gap-1.5">
                              {customer.email && (
                                <Button
                                  className="h-7 w-7 p-0"
                                  onClick={() => setIsEmailDialogOpen(true)}
                                  size="sm"
                                  title="Send Email"
                                  variant="outline"
                                >
                                  <Mail className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {customer.phone && (
                                <>
                                  <Button
                                    className="h-7 w-7 p-0"
                                    onClick={() => {
                                      setIncomingCall({
                                        number: customer.phone,
                                        name: `${customer.first_name} ${customer.last_name}`,
                                        avatar: customer.avatar_url,
                                      });
                                    }}
                                    size="sm"
                                    title="Call"
                                    variant="outline"
                                  >
                                    <Phone className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    className="h-7 w-7 p-0"
                                    onClick={() => setIsSMSDialogOpen(true)}
                                    size="sm"
                                    title="Send Text Message"
                                    variant="outline"
                                  >
                                    <MessageSquare className="h-3.5 w-3.5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          <dl className="grid gap-3">
                            {customer.email && (
                              <div className="flex items-center gap-2.5">
                                <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <dt className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
                                    Email
                                  </dt>
                                  <dd className="truncate font-medium text-foreground text-sm">
                                    {customer.email}
                                  </dd>
                                </div>
                              </div>
                            )}
                            {customer.phone && (
                              <div className="flex items-center gap-2.5">
                                <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <dt className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
                                    Phone
                                  </dt>
                                  <dd className="font-medium text-foreground text-sm">
                                    {customer.phone}
                                  </dd>
                                </div>
                              </div>
                            )}
                            {secondaryPhone && (
                              <div className="flex items-center gap-2.5">
                                <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <dt className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
                                    Alt Phone
                                  </dt>
                                  <dd className="font-medium text-foreground text-sm">
                                    {secondaryPhone}
                                  </dd>
                                </div>
                              </div>
                            )}
                            {billingEmail &&
                              billingEmail !== customer.email && (
                                <div className="flex items-center gap-2.5">
                                  <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                                    <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <dt className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
                                      Billing Email
                                    </dt>
                                    <dd className="truncate font-medium text-foreground text-sm">
                                      {billingEmail}
                                    </dd>
                                  </div>
                                </div>
                              )}
                          </dl>
                        </div>

                        {/* Account Details */}
                        <div className="space-y-4 p-6">
                          <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                            Account Details
                          </div>
                          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                              <dt className="text-muted-foreground text-xs">
                                Portal Access
                              </dt>
                              <dd className="mt-1 font-medium text-foreground text-sm">
                                {portalEnabled ? (
                                  <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-200">
                                    <Globe className="h-3.5 w-3.5" />
                                    Enabled
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    Disabled
                                  </span>
                                )}
                              </dd>
                              {portalEnabled && lastPortalLogin && (
                                <dd className="mt-0.5 text-muted-foreground text-xs">
                                  Last login{" "}
                                  {formatRelativeTime(lastPortalLogin)}
                                </dd>
                              )}
                            </div>
                            <div>
                              <dt className="text-muted-foreground text-xs">
                                Preferred Contact
                              </dt>
                              <dd className="mt-1 font-medium text-foreground text-sm capitalize">
                                {normalizedPreferredContact}
                              </dd>
                              {communicationChannels && (
                                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                                  {communicationChannels.map(
                                    (channel) =>
                                      channel.enabled && (
                                        <span
                                          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-[10px] text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
                                          key={channel.key}
                                        >
                                          {channel.label}
                                        </span>
                                      )
                                  )}
                                </dd>
                              )}
                            </div>
                            <div>
                              <dt className="text-muted-foreground text-xs">
                                Last Activity
                              </dt>
                              <dd className="mt-1 font-medium text-foreground text-sm">
                                {lastJobDate
                                  ? formatRelativeTime(lastJobDate)
                                  : "No activity"}
                              </dd>
                              {nextVisit && (
                                <dd className="mt-0.5 text-muted-foreground text-xs">
                                  Next:{" "}
                                  {formatRelativeTime(
                                    nextVisit.start_time ??
                                      nextVisit.startTime ??
                                      nextVisit.start_at ??
                                      nextVisit.startAt
                                  )}
                                </dd>
                              )}
                            </div>
                          </dl>
                        </div>

                        {/* Team & Tags */}
                        {(assignedTeamMembers.length > 0 ||
                          customerTags.length > 0) && (
                          <div className="space-y-4 p-6">
                            {assignedTeamMembers.length > 0 && (
                              <div className="space-y-2">
                                <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                                  Assigned Team
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {assignedTeamMembers
                                    .filter(Boolean)
                                    .map((member) => (
                                      <Link
                                        className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 font-medium text-foreground text-xs transition-colors hover:border-primary/50 hover:bg-primary/5"
                                        href={
                                          member?.id
                                            ? `/dashboard/settings/team/${member.id}`
                                            : "/dashboard/settings/team"
                                        }
                                        key={member?.id || "unknown"}
                                      >
                                        <Avatar className="h-6 w-6 border border-white/10 bg-muted">
                                          {member?.avatar ? (
                                            <AvatarImage
                                              alt={
                                                member?.name || "Team Member"
                                              }
                                              src={member.avatar}
                                            />
                                          ) : (
                                            <AvatarFallback className="text-[10px]">
                                              {member?.name
                                                ?.split(" ")
                                                .map((part: string) => part[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase() || "TM"}
                                            </AvatarFallback>
                                          )}
                                        </Avatar>
                                        {member?.name || "Unknown"}
                                      </Link>
                                    ))}
                                </div>
                              </div>
                            )}
                            {customerTags.length > 0 && (
                              <div className="space-y-2">
                                <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                                  Tags
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {customerTags.slice(0, 8).map((tag) => (
                                    <span
                                      className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2.5 py-0.5 font-medium text-[11px] text-muted-foreground capitalize"
                                      key={tag}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {customerTags.length > 8 && (
                                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-medium text-[11px] text-muted-foreground">
                                      +{customerTags.length - 8}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Internal Notes */}
                        {(internalNotes || customer?.notes) && (
                          <div className="space-y-2 bg-muted/20 p-6">
                            <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                              Internal Notes
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {internalNotes || customer?.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-border/60 border-dashed bg-muted/20 py-12 text-center">
                        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
                          <User className="size-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                          No customer assigned
                        </p>
                        <p className="mt-1 text-muted-foreground text-xs">
                          Assign a customer to unlock profile insights.
                        </p>
                      </div>
                    )}

                    {/* Divider between Customer and Property */}
                    {customer && property && (
                      <div className="hidden h-auto w-px bg-border/40 lg:block" />
                    )}

                    {/* Property Info */}
                    {property ? (
                      <div className="flex min-w-0 flex-1 flex-col divide-y divide-border/40 lg:w-96">
                        {/* Property Header */}
                        <div className="flex items-center justify-between gap-4 p-6">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                              <MapPin className="size-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-foreground text-sm">
                                {property.name || "Service Location"}
                              </div>
                              {property.property_type && (
                                <div className="mt-0.5 text-muted-foreground text-xs capitalize">
                                  {property.property_type}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Location Visualization - Maps, Street View, Earth */}
                        <div className="p-6">
                          <PropertyLocationVisual property={property} />
                        </div>

                        {/* Property Details */}
                        {(property.square_footage || property.year_built) && (
                          <div className="space-y-3 p-6">
                            <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                              Property Details
                            </div>
                            <dl className="grid gap-3">
                              {property.square_footage && (
                                <div className="flex items-center justify-between">
                                  <dt className="text-muted-foreground text-xs">
                                    Square Footage
                                  </dt>
                                  <dd className="font-semibold text-foreground text-sm tabular-nums">
                                    {property.square_footage.toLocaleString()}
                                    <span className="ml-1 font-normal text-muted-foreground text-xs">
                                      sq ft
                                    </span>
                                  </dd>
                                </div>
                              )}
                              {property.year_built && (
                                <div className="flex items-center justify-between">
                                  <dt className="text-muted-foreground text-xs">
                                    Year Built
                                  </dt>
                                  <dd className="font-semibold text-foreground text-sm tabular-nums">
                                    {property.year_built}
                                  </dd>
                                </div>
                              )}
                            </dl>
                          </div>
                        )}

                        {/* Access Notes */}
                        {property.notes && (
                          <div className="space-y-2 bg-muted/20 p-6">
                            <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                              Access Instructions
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {property.notes}
                            </p>
                          </div>
                        )}

                        {/* Equipment Link */}
                        {equipment.length > 0 && (
                          <div className="p-6">
                            <button
                              className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background px-4 py-3 text-left font-medium text-sm transition-colors hover:border-primary/50 hover:bg-muted/40"
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
                              <span className="flex items-center gap-2">
                                <Wrench className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {equipment.length} piece
                                  {equipment.length === 1 ? "" : "s"} at this
                                  location
                                </span>
                              </span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </button>
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
                                className="h-8 px-3 text-xs"
                                disabled={!customer}
                                size="sm"
                                variant="secondary"
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
                                    setPropertyDropdownMode(
                                      value as "search" | "add"
                                    )
                                  }
                                  value={propertyDropdownMode}
                                >
                                  <TabsList className="w-full rounded-none border-b">
                                    <TabsTrigger
                                      className="flex-1"
                                      value="search"
                                    >
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
                                            No properties found for this
                                            customer
                                          </div>
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {filteredProperties.map((p: any) => (
                                            <CommandItem
                                              className="cursor-pointer"
                                              key={p.id}
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
                                        Select an address from the dropdown to
                                        automatically create and assign the
                                        property
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
              <CollapsibleDataSection
                actions={
                  <CollapsibleActionButton
                    icon={<Plus className="h-3.5 w-3.5" />}
                    onClick={() => {
                      // TODO: Open appointment creation dialog or navigate to schedule page
                      router.push(`/dashboard/schedule/new?jobId=${job.id}`);
                    }}
                  >
                    Add Appointment
                  </CollapsibleActionButton>
                }
                count={schedules.length}
                fullWidthContent={true}
                icon={<Calendar className="h-5 w-5" />}
                title="Appointments"
                value="appointments"
              >
                <JobAppointmentsTable appointments={schedules} />
              </CollapsibleDataSection>

              {/* JOB TASKS & CHECKLIST */}
              <AccordionItem
                className="rounded-lg border bg-card shadow-sm"
                value="tasks"
              >
                <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <AccordionTrigger className="flex-1 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">
                        Job Tasks & Checklist
                      </span>
                      <Badge className="ml-1 text-xs" variant="secondary">
                        {tasks.length}
                      </Badge>
                      {tasks.length > 0 && (
                        <Badge className="text-xs" variant="outline">
                          {tasks.filter((t: any) => t.is_completed).length}/
                          {tasks.length} Complete
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
                          category === null
                            ? !t.category
                            : t.category === category
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
                                      task.is_completed &&
                                        "bg-gray-50 opacity-75"
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
                                        {task.is_completed &&
                                          task.completed_at && (
                                            <span className="flex items-center gap-1">
                                              <CheckCircle className="h-3 w-3 text-green-600" />
                                              Completed{" "}
                                              {formatDate(task.completed_at)}
                                            </span>
                                          )}
                                        {!task.is_completed &&
                                          task.due_date && (
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
                        <Button
                          className="h-8 px-3 text-xs"
                          size="sm"
                          variant="secondary"
                        >
                          <Plus className="mr-1.5 h-3.5 w-3.5" />
                          Add Task
                        </Button>
                      </div>
                    )}

                    {/* Quick Actions */}
                    {tasks.length > 0 && (
                      <div className="flex gap-2 border-t pt-4">
                        <Button
                          className="h-8 px-3 text-xs"
                          size="sm"
                          variant="secondary"
                        >
                          <Plus className="mr-1.5 h-3.5 w-3.5" />
                          Add Task
                        </Button>
                        <Button
                          className="h-8 px-3 text-xs"
                          size="sm"
                          variant="secondary"
                        >
                          Load Template
                        </Button>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* INVOICES */}
              <CollapsibleDataSection
                actions={
                  <CollapsibleActionButton
                    icon={<Plus className="h-3.5 w-3.5" />}
                    onClick={() => {
                      // TODO: Open invoice creation dialog
                      console.log("Create invoice");
                    }}
                  >
                    Create Invoice
                  </CollapsibleActionButton>
                }
                count={invoices.length}
                fullWidthContent={true}
                icon={<FileText className="h-5 w-5" />}
                title="Invoices"
                value="invoices"
              >
                <JobInvoicesTable invoices={invoices} />
              </CollapsibleDataSection>

              {/* ESTIMATES */}
              <CollapsibleDataSection
                actions={
                  <CollapsibleActionButton
                    icon={<Plus className="h-3.5 w-3.5" />}
                    onClick={() => {
                      // TODO: Open estimate creation dialog
                      console.log("Create estimate");
                    }}
                  >
                    Create Estimate
                  </CollapsibleActionButton>
                }
                count={estimates.length}
                fullWidthContent={true}
                icon={<Receipt className="h-5 w-5" />}
                title="Estimates"
                value="estimates"
              >
                <JobEstimatesTable estimates={estimates} />
              </CollapsibleDataSection>

              {/* PURCHASE ORDERS */}
              <CollapsibleDataSection
                actions={
                  <CollapsibleActionButton
                    icon={<Plus className="h-3.5 w-3.5" />}
                    onClick={() => {
                      // TODO: Open PO creation dialog
                      console.log("Create PO");
                    }}
                  >
                    Create PO
                  </CollapsibleActionButton>
                }
                count={purchaseOrders.length}
                fullWidthContent={true}
                icon={<Package className="h-5 w-5" />}
                title="Purchase Orders"
                value="purchase-orders"
              >
                <JobPurchaseOrdersTable purchaseOrders={purchaseOrders} />
              </CollapsibleDataSection>

              {/* PHOTOS & DOCUMENTS */}
              <AccordionItem
                className={cn(
                  "rounded-lg border bg-card shadow-sm transition-colors",
                  isDraggingOver && "border-primary bg-primary/5"
                )}
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
                value="photos"
              >
                <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <AccordionTrigger className="flex-1 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <Camera className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">
                        Photos & Documents
                      </span>
                      <Badge className="ml-1 text-xs" variant="secondary">
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
                        className="h-8 px-3 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowUploader(true);
                        }}
                        size="sm"
                        variant="secondary"
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
                        companyId={job.company_id}
                        jobId={job.id}
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
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="mb-2 font-semibold text-lg">
                            No photos uploaded yet
                          </h3>
                          <p className="mb-4 text-muted-foreground text-sm">
                            Upload photos to document the job progress
                          </p>
                          <Button
                            onClick={() => setShowUploader(true)}
                            size="sm"
                            variant="secondary"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Photos
                          </Button>
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
                                className="h-8 px-2"
                                size="sm"
                                variant="secondary"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="mb-2 font-semibold text-lg">
                            No documents uploaded yet
                          </h3>
                          <p className="mb-4 text-muted-foreground text-sm">
                            Upload documents, receipts, or other files related
                            to this job
                          </p>
                          <Button
                            onClick={() => setShowUploader(true)}
                            size="sm"
                            variant="secondary"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Document
                          </Button>
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
              <AccordionItem
                className="rounded-lg border bg-card shadow-sm"
                value="activity"
              >
                <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <AccordionTrigger className="flex-1 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">
                        Activity & Communications
                      </span>
                      <Badge className="ml-1 text-xs" variant="secondary">
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
                                    <Badge
                                      className="text-xs"
                                      variant="outline"
                                    >
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
                                  {item.description ||
                                    item.body ||
                                    "Activity logged"}
                                </p>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                          <Activity className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 font-semibold text-lg">
                          No activity or communications yet
                        </h3>
                        <p className="text-muted-foreground text-sm">
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
                      <span className="font-medium text-sm">
                        Equipment Serviced on This Job
                      </span>
                      <Badge className="ml-1 text-xs" variant="secondary">
                        {jobEquipment.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                </div>
                <AccordionContent className="px-6 pb-6">
                  {jobEquipment.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Wrench className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="mb-2 font-semibold text-lg">
                        No equipment has been added to this job yet
                      </h3>
                      <p className="mb-4 text-muted-foreground text-sm">
                        Equipment serviced on this job will appear here
                      </p>
                      <Button
                        onClick={() => {
                          // TODO: Open equipment selection dialog
                          console.log("Add equipment");
                        }}
                        size="sm"
                        variant="secondary"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Equipment
                      </Button>
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
                                <Badge variant="secondary">
                                  {je.service_type}
                                </Badge>
                              </div>
                              <div className="space-y-1 text-muted-foreground text-sm">
                                <p>
                                  {je.equipment?.manufacturer}{" "}
                                  {je.equipment?.model}
                                  {je.equipment?.serial_number &&
                                    ` • SN: ${je.equipment.serial_number}`}
                                </p>
                              </div>
                            </div>
                          </div>

                          {je.work_performed && (
                            <div className="text-sm">
                              <span className="font-medium">
                                Work Performed:
                              </span>
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
                        <span className="font-medium text-sm">
                          Customer Equipment at Property
                        </span>
                        <Badge className="ml-1 text-xs" variant="secondary">
                          {equipment.length}
                        </Badge>
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
          </div>

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
                Add a new property for {customer?.first_name}{" "}
                {customer?.last_name}
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

        {/* Communication Dialogs */}
        {customer && customer.email && (
          <EmailDialog
            customerEmail={customer.email}
            customerId={customer.id}
            customerName={`${customer.first_name} ${customer.last_name}`}
            onOpenChange={setIsEmailDialogOpen}
            open={isEmailDialogOpen}
          />
        )}

        {customer && customer.phone && (
          <SMSDialog
            companyId={job.company_id}
            companyPhones={companyPhones}
            customerId={customer.id}
            customerName={`${customer.first_name} ${customer.last_name}`}
            customerPhone={customer.phone}
            onOpenChange={setIsSMSDialogOpen}
            open={isSMSDialogOpen}
          />
        )}
      </div>
    </>
  );
}
