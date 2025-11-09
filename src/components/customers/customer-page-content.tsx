/**
 * Customer Page Content - Comprehensive Single Page View
 * Matches job details page structure with collapsible sections
 */

"use client";

import {
  Activity,
  AlertCircle,
  Building2,
  Calendar,
  Camera,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Plus,
  Receipt,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Wrench,
  Edit2,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { CollapsibleActionButton, CollapsibleDataSection } from "@/components/ui/collapsible-data-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type CustomerPageContentProps = {
  customerData: any;
  metrics: any;
};

export function CustomerPageContent({ customerData, metrics }: CustomerPageContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [localCustomer, setLocalCustomer] = useState(customerData.customer);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Prevent hydration mismatch by only rendering Radix components after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    customer,
    properties = [],
    jobs = [],
    invoices = [],
    activities = [],
    equipment = [],
    attachments = [],
    paymentMethods = [],
    enrichmentData,
  } = customerData;

  // Handle field changes
  const handleFieldChange = (field: string, value: any) => {
    setLocalCustomer((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const customerStatus =
    (localCustomer?.status || customer?.status || "active")?.toLowerCase();

  const displayName = useMemo(() => {
    const explicitName =
      localCustomer?.display_name ||
      localCustomer?.company_name ||
      customer?.display_name ||
      customer?.company_name;

    if (explicitName && explicitName.trim().length > 0) {
      return explicitName.trim();
    }

    const firstName = localCustomer?.first_name || customer?.first_name;
    const lastName = localCustomer?.last_name || customer?.last_name;
    const composed = [firstName, lastName].filter(Boolean).join(" ").trim();

    if (composed.length > 0) {
      return composed;
    }

    return localCustomer?.email || customer?.email || "Unnamed Customer";
  }, [customer, localCustomer]);

  const handlePrimaryNameChange = (value: string) => {
    const trimmed = value;

    if (localCustomer?.company_name || customer?.company_name) {
      handleFieldChange("company_name", trimmed);
      return;
    }

    if (localCustomer?.display_name || customer?.display_name) {
      handleFieldChange("display_name", trimmed);
      return;
    }

    const cleaned = trimmed.trim();

    if (!cleaned) {
      handleFieldChange("first_name", "");
      handleFieldChange("last_name", "");
      return;
    }

    const parts = cleaned.split(/\s+/);
    if (parts.length === 1) {
      handleFieldChange("first_name", parts[0]);
      handleFieldChange("last_name", "");
    } else {
      handleFieldChange("first_name", parts.slice(0, -1).join(" "));
      handleFieldChange("last_name", parts[parts.length - 1]);
    }
  };

  const customerIdentifier = useMemo(() => {
    const candidate =
      customer?.customer_number ??
      customer?.account_number ??
      customer?.reference_id ??
      customer?.external_id;

    if (candidate) {
      return `#${candidate}`;
    }

    if (customer?.id) {
      return `#${customer.id.slice(0, 8).toUpperCase()}`;
    }

    return "#CUSTOMER";
  }, [customer]);

  const primaryEmail = localCustomer?.email || customer?.email || null;
  const primaryPhone =
    localCustomer?.phone ||
    localCustomer?.mobile_phone ||
    customer?.phone ||
    customer?.mobile_phone ||
    null;

  const primaryProperty = useMemo(() => {
    if (properties.length > 0) {
      return properties[0];
    }
    return null;
  }, [properties]);

  const customerSince =
    localCustomer?.created_at ??
    customer?.created_at ??
    customer?.createdAt ??
    null;

  const outstandingBalance =
    metrics?.outstandingBalance ??
    customer?.outstanding_balance ??
    customer?.outstandingBalance ??
    0;

  const membershipLabel =
    localCustomer?.membership_tier ??
    localCustomer?.membership ??
    localCustomer?.plan ??
    customer?.membership_tier ??
    customer?.membership ??
    customer?.plan ??
    null;

  const portalEnabled =
    localCustomer?.portal_enabled ??
    customer?.portal_enabled ??
    customer?.portalEnabled ??
    false;

  const defaultAccordionSections = useMemo(
    () => [
      "customer-info",
      "properties",
      "jobs",
      "invoices",
      "equipment",
      "payment-methods",
      "activity",
    ],
    []
  );

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement save customer action
      toast.success("Customer updated successfully");
      setHasChanges(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error("Failed to update customer");
    } finally {
      setIsSaving(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: string }> = {
      active: { label: "Active", variant: "default" },
      inactive: { label: "Inactive", variant: "secondary" },
      lead: { label: "Lead", variant: "outline" },
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <Badge variant={config.variant as any}>
        {config.label}
      </Badge>
    );
  };

  if (!mounted) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  return (
    <div className="flex-1">
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-3">
            <Badge className="h-6 font-mono text-xs" variant="outline">
              {customerIdentifier}
            </Badge>
          </div>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <Input
                className="h-auto border-0 p-0 font-bold text-5xl tracking-tight shadow-none focus-visible:ring-0 md:text-6xl"
                onChange={(e) => handlePrimaryNameChange(e.target.value)}
                placeholder="Enter customer name..."
                value={displayName}
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {getStatusBadge(customerStatus || "active")}
                {membershipLabel && (
                  <Badge variant="secondary">{membershipLabel}</Badge>
                )}
                {portalEnabled && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Sparkles className="h-3.5 w-3.5" />
                    Portal Enabled
                  </Badge>
                )}
              </div>
            </div>
            {hasChanges && (
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setLocalCustomer(customer);
                    setHasChanges(false);
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {primaryEmail && (
              <a
                className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                href={`mailto:${primaryEmail}`}
              >
                <Mail className="h-4 w-4" />
                <span className="font-medium">{primaryEmail}</span>
              </a>
            )}
            {primaryPhone && (
              <a
                className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                href={`tel:${primaryPhone}`}
              >
                <Phone className="h-4 w-4" />
                <span className="font-medium">{primaryPhone}</span>
              </a>
            )}
            {primaryProperty && (
              <Link
                className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                href={`/dashboard/properties/${primaryProperty.id}`}
              >
                <MapPin className="h-4 w-4" />
                <span className="font-medium">
                  {primaryProperty.name || primaryProperty.address}
                </span>
              </Link>
            )}
            {customerSince && (
              <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  Customer since {formatDate(customerSince)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Total Jobs
                </span>
                <span className="font-medium">
                  {metrics?.totalJobs ?? jobs.length}
                </span>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
              <Building2 className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Properties
                </span>
                <span className="font-medium">
                  {metrics?.totalProperties ?? properties.length}
                </span>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
              <FileText className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Outstanding
                </span>
                <span className="font-medium">
                  {formatCurrency(outstandingBalance)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() =>
                router.push(`/dashboard/work/new?customerId=${customer.id}`)
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              New Job
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                router.push(`/dashboard/work/invoices/new?customerId=${customer.id}`)
              }
            >
              <FileText className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                router.push(`/dashboard/properties/new?customerId=${customer.id}`)
              }
            >
              <Building2 className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div suppressHydrationWarning>
          <Accordion
            className="space-y-3"
            defaultValue={defaultAccordionSections}
            type="multiple"
          >
            <CollapsibleDataSection
              value="customer-info"
              title="Customer Information"
              icon={<User />}
              badge={getStatusBadge(customerStatus || "active")}
            >
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={localCustomer.first_name || ""}
                        onChange={(e) =>
                          handleFieldChange("first_name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={localCustomer.last_name || ""}
                        onChange={(e) =>
                          handleFieldChange("last_name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        value={localCustomer.company_name || ""}
                        onChange={(e) =>
                          handleFieldChange("company_name", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="flex gap-2">
                        <Input
                          id="email"
                          type="email"
                          value={localCustomer.email || ""}
                          onChange={(e) =>
                            handleFieldChange("email", e.target.value)
                          }
                        />
                        {customer.email && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={`mailto:${customer.email}`}>
                              <Mail className="size-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <div className="flex gap-2">
                        <Input
                          id="phone"
                          type="tel"
                          value={localCustomer.phone || ""}
                          onChange={(e) =>
                            handleFieldChange("phone", e.target.value)
                          }
                        />
                        {customer.phone && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={`tel:${customer.phone}`}>
                              <Phone className="size-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="mobile_phone">Mobile Phone</Label>
                      <div className="flex gap-2">
                        <Input
                          id="mobile_phone"
                          type="tel"
                          value={localCustomer.mobile_phone || ""}
                          onChange={(e) =>
                            handleFieldChange("mobile_phone", e.target.value)
                          }
                        />
                        {customer.mobile_phone && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={`tel:${customer.mobile_phone}`}>
                              <Phone className="size-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleDataSection>

            <CollapsibleDataSection
              value="properties"
              title="Properties"
              icon={<Building2 />}
              badge={<Badge variant="secondary">{properties.length}</Badge>}
              fullWidthContent
              actions={
                <CollapsibleActionButton
                  icon={<Plus className="h-3.5 w-3.5" />}
                  onClick={() =>
                    router.push(`/dashboard/properties/new?customerId=${customer.id}`)
                  }
                >
                  Add Property
                </CollapsibleActionButton>
              }
            >
              {properties.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Jobs</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property: any) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {property.name || property.address}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {property.city}, {property.state} {property.zip_code}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {property.property_type || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {
                            jobs.filter(
                              (j: any) => j.property_id === property.id
                            ).length
                          }
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/dashboard/properties/${property.id}`}>
                              View <ChevronRight className="ml-1 size-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Building2 className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No properties yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Add a property to track service locations for this customer
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/dashboard/properties/new?customerId=${customer.id}`
                      )
                    }
                  >
                    <Plus className="mr-2 size-4" />
                    Add First Property
                  </Button>
                </div>
              )}
            </CollapsibleDataSection>

            <CollapsibleDataSection
              value="jobs"
              title="Jobs"
              icon={<Wrench />}
              badge={<Badge variant="secondary">{jobs.length}</Badge>}
              fullWidthContent
              actions={
                <CollapsibleActionButton
                  icon={<Plus className="h-3.5 w-3.5" />}
                  onClick={() =>
                    router.push(`/dashboard/work/new?customerId=${customer.id}`)
                  }
                >
                  New Job
                </CollapsibleActionButton>
              }
            >
              {jobs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job #</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.slice(0, 10).map((job: any) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-mono text-sm">
                          #{job.job_number || job.id.slice(0, 8)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {job.title || "Untitled Job"}
                        </TableCell>
                        <TableCell>
                          <Badge>{job.status}</Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(job.total_amount || 0)}</TableCell>
                        <TableCell>{formatDate(job.created_at)}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/dashboard/work/${job.id}`}>
                              View <ChevronRight className="ml-1 size-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Wrench className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No jobs yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Create a new job to start tracking work for this customer
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/work/new?customerId=${customer.id}`)
                    }
                  >
                    <Plus className="mr-2 size-4" />
                    Create First Job
                  </Button>
                </div>
              )}
            </CollapsibleDataSection>

            <CollapsibleDataSection
              value="invoices"
              title="Invoices"
              icon={<Receipt />}
              badge={<Badge variant="secondary">{invoices.length}</Badge>}
              fullWidthContent
              actions={
                <CollapsibleActionButton
                  icon={<Plus className="h-3.5 w-3.5" />}
                  onClick={() =>
                    router.push(
                      `/dashboard/work/invoices/new?customerId=${customer.id}`
                    )
                  }
                >
                  New Invoice
                </CollapsibleActionButton>
              }
            >
              {invoices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.slice(0, 10).map((invoice: any) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono text-sm">
                          #{invoice.invoice_number || invoice.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <Badge>{invoice.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(invoice.total_amount || 0)}
                        </TableCell>
                        <TableCell>{formatDate(invoice.due_date)}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/dashboard/work/invoices/${invoice.id}`}>
                              View <ChevronRight className="ml-1 size-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Receipt className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No invoices yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Create an invoice to bill this customer
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/dashboard/work/invoices/new?customerId=${customer.id}`
                      )
                    }
                  >
                    <Plus className="mr-2 size-4" />
                    Create First Invoice
                  </Button>
                </div>
              )}
            </CollapsibleDataSection>

            <CollapsibleDataSection
              value="equipment"
              title="Equipment"
              icon={<Package />}
              badge={<Badge variant="secondary">{equipment.length}</Badge>}
              fullWidthContent
            >
              {equipment.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Serial Number</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipment.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.manufacturer || "N/A"}</TableCell>
                        <TableCell>{item.model || "N/A"}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.serial_number || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No equipment on record for this customer yet.
                </p>
              )}
            </CollapsibleDataSection>

            <CollapsibleDataSection
              value="payment-methods"
              title="Payment Methods"
              icon={<CreditCard />}
              badge={<Badge variant="secondary">{paymentMethods.length}</Badge>}
            >
              {paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((method: any) => {
                    const brand =
                      method?.brand ??
                      method?.card_brand ??
                      method?.card_brand_name ??
                      method?.type;
                    const formattedBrand =
                      typeof brand === "string" && brand.length > 0
                        ? brand.toUpperCase()
                        : "CARD";
                    const last4 =
                      method?.last4 ??
                      method?.card?.last4 ??
                      method?.card_last4 ??
                      "••••";
                    const expMonth =
                      method?.exp_month ?? method?.card?.exp_month ?? null;
                    const expYear =
                      method?.exp_year ?? method?.card?.exp_year ?? null;
                    const formattedExpiration =
                      expMonth && expYear
                        ? `${String(expMonth).padStart(2, "0")}/${expYear}`
                        : "Unknown";
                    const key =
                      method?.id ??
                      `${formattedBrand}-${last4}-${formattedExpiration}`;

                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <CreditCard className="size-6 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {formattedBrand} ****{last4}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Expires {formattedExpiration}
                            </p>
                          </div>
                        </div>
                        {method?.is_default && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No payment methods on file.
                </p>
              )}
            </CollapsibleDataSection>

            <CollapsibleDataSection
              value="activity"
              title="Activity Timeline"
              icon={<Activity />}
              badge={<Badge variant="secondary">{activities.length}</Badge>}
            >
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.slice(0, 20).map((activity: any, index: number) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="relative">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                          <Activity className="size-4 text-primary" />
                        </div>
                        {index < activities.length - 1 && (
                          <div className="absolute left-4 top-8 h-full w-px bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.created_at)}
                          {activity.user &&
                            ` by ${activity.user.name || activity.user.email}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No activity recorded yet
                </p>
              )}
            </CollapsibleDataSection>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

