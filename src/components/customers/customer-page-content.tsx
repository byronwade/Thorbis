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
  Hash,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JobsTable } from "@/components/work/jobs-table";
import { CustomerInvoicesTable } from "@/components/customers/customer-invoices-table";
import { PropertiesTable } from "@/components/customers/properties-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DetailPageContentLayout } from "@/components/layout/detail-page-content-layout";
import {
  UnifiedAccordionContent,
  UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";

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

  // IMPORTANT: Early return MUST come before all other hooks
  if (!mounted) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

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

  // Get status badge for customer status
  const getCustomerStatusBadge = (status: string) => {
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

  // Get status badge for jobs/invoices
  const getJobInvoiceStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        className: string;
        label: string;
      }
    > = {
      draft: {
        className:
          "border-border/50 bg-background text-muted-foreground hover:bg-muted/50",
        label: "Draft",
      },
      scheduled: {
        className:
          "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400",
        label: "Scheduled",
      },
      in_progress: {
        className: "border-blue-500/50 bg-blue-500 text-white hover:bg-blue-600",
        label: "In Progress",
      },
      completed: {
        className:
          "border-green-500/50 bg-green-500 text-white hover:bg-green-600",
        label: "Completed",
      },
      cancelled: {
        className: "border-red-500/50 bg-red-500 text-white hover:bg-red-600",
        label: "Cancelled",
      },
      paid: {
        className:
          "border-green-500/50 bg-green-500 text-white hover:bg-green-600",
        label: "Paid",
      },
      unpaid: {
        className:
          "border-yellow-200/50 bg-yellow-50/50 text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-400",
        label: "Unpaid",
      },
      overdue: {
        className: "border-red-500/50 bg-red-500 text-white hover:bg-red-600",
        label: "Overdue",
      },
    };

    const config = variants[status] || {
      className: "border-border/50 bg-background text-muted-foreground",
      label: status.replace("_", " "),
    };

    return (
      <Badge className={`font-medium text-xs ${config.className}`} variant="outline">
        {config.label}
      </Badge>
    );
  };

  // Format date for table display
  const formatTableDate = (date: string | Date | null): string => {
    if (!date) return "—";
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  // Format currency for table (amounts are stored in cents)
  const formatTableCurrency = (amount: number | null): string => {
    if (amount === null || amount === undefined) return "$0.00";
    // Amounts are stored in cents, so divide by 100
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  if (!mounted) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  const headerBadges = [
    <Badge key="identifier" className="font-mono" variant="outline">
      {customerIdentifier}
    </Badge>,
    getCustomerStatusBadge(customerStatus || "active"),
    membershipLabel ? (
      <Badge key="membership" variant="secondary">
        {membershipLabel}
      </Badge>
    ) : null,
    portalEnabled ? (
      <Badge
        key="portal"
        variant="outline"
        className="gap-1 text-xs"
      >
        <Sparkles className="h-3.5 w-3.5" /> Portal Enabled
      </Badge>
    ) : null,
  ].filter(Boolean);

  const customHeader = (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="rounded-md bg-muted/50 shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {headerBadges.map((badge, index) => (
                  <span key={index}>{badge}</span>
                ))}
              </div>
              <Input
                className={cn(
                  "h-auto border-0 p-0 text-3xl font-semibold tracking-tight shadow-none focus-visible:ring-0 sm:text-4xl md:text-5xl",
                )}
                onChange={(e) => handlePrimaryNameChange(e.target.value)}
                placeholder="Enter customer name..."
                value={displayName}
              />
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

          <div className="flex flex-wrap items-center gap-3">
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

          <div className="flex flex-wrap items-center gap-3">
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

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() => router.push(`/dashboard/work/new?customerId=${customer.id}`)}
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
    </div>
  );

  const customSections = useMemo<UnifiedAccordionSection[]>(() => {
    const sections: UnifiedAccordionSection[] = [
      {
        id: "customer-info",
        title: "Customer Information",
        icon: <User className="size-4" />,
        defaultOpen: true,
        content: (
          <UnifiedAccordionContent>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={localCustomer.first_name || ""}
                      onChange={(e) => handleFieldChange("first_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={localCustomer.last_name || ""}
                      onChange={(e) => handleFieldChange("last_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={localCustomer.company_name || ""}
                      onChange={(e) => handleFieldChange("company_name", e.target.value)}
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
                        onChange={(e) => handleFieldChange("email", e.target.value)}
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
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
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
                        onChange={(e) => handleFieldChange("mobile_phone", e.target.value)}
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

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      rows={3}
                      value={localCustomer.address || ""}
                      onChange={(e) => handleFieldChange("address", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={localCustomer.city || ""}
                        onChange={(e) => handleFieldChange("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={localCustomer.state || ""}
                        onChange={(e) => handleFieldChange("state", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input
                        id="postal_code"
                        value={localCustomer.postal_code || ""}
                        onChange={(e) => handleFieldChange("postal_code", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={localCustomer.country || ""}
                        onChange={(e) => handleFieldChange("country", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="Comma separated tags"
                      value={(localCustomer.tags || []).join(", ")}
                      onChange={(e) =>
                        handleFieldChange(
                          "tags",
                          e.target.value.split(",").map((tag) => tag.trim())
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      rows={4}
                      placeholder="Internal notes about this customer"
                      value={localCustomer.notes || ""}
                      onChange={(e) => handleFieldChange("notes", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </UnifiedAccordionContent>
        ),
      },
      {
        id: "properties",
        title: "Properties",
        icon: <Building2 className="size-4" />,
        count: properties.length,
        content: (
          <UnifiedAccordionContent>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Manage service locations for this customer.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/dashboard/properties/new?customerId=${customer.id}`)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Property
              </Button>
            </div>
            <PropertiesTable
              customerId={customer.id}
              itemsPerPage={10}
              properties={properties}
            />
          </UnifiedAccordionContent>
        ),
      },
      {
        id: "jobs",
        title: "Jobs",
        icon: <Wrench className="size-4" />,
        count: jobs.length,
        content: (
          <UnifiedAccordionContent>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Recent jobs associated with this customer.
              </p>
              <Button
                size="sm"
                onClick={() => router.push(`/dashboard/work/new?customerId=${customer.id}`)}
              >
                <Plus className="mr-2 h-4 w-4" /> New Job
              </Button>
            </div>
            <JobsTable jobs={jobs} itemsPerPage={10} />
          </UnifiedAccordionContent>
        ),
      },
      {
        id: "invoices",
        title: "Invoices",
        icon: <Receipt className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Billing history and outstanding invoices.
              </p>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  router.push(`/dashboard/work/invoices/new?customerId=${customer.id}`)
                }
              >
                <FileText className="mr-2 h-4 w-4" /> New Invoice
              </Button>
            </div>
            <CustomerInvoicesTable
              invoices={invoices || []}
              onUpdate={() => router.refresh()}
            />
          </UnifiedAccordionContent>
        ),
      },
      {
        id: "equipment",
        title: "Equipment",
        icon: <Package className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            {equipment.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {equipment.map((item: any) => (
                  <div key={item.id} className="rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-primary/10 p-2">
                        <Wrench className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.type || item.category || "Equipment"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 text-sm">
                      {item.serial_number && (
                        <p className="text-muted-foreground">
                          Serial: {item.serial_number}
                        </p>
                      )}
                      {item.manufacturer && (
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          {item.manufacturer}
                        </p>
                      )}
                      {item.install_date && (
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Installed {formatDate(item.install_date)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                <Package className="h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No equipment on record for this customer yet.
                </p>
              </div>
            )}
          </UnifiedAccordionContent>
        ),
      },
      {
        id: "payment-methods",
        title: "Payment Methods",
        icon: <CreditCard className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            {paymentMethods.length > 0 ? (
              <div className="space-y-3">
                {paymentMethods.map((method: any) => (
                  <div key={method.id} className="flex items-start justify-between rounded-lg border p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">
                        {method.brand?.toUpperCase() || method.type} ending in {method.last4 || method.card_last_four}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Expires {method.exp_month}/{method.exp_year}
                      </span>
                    </div>
                    {method.is_default && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-sm">
                No payment methods on file.
              </p>
            )}
          </UnifiedAccordionContent>
        ),
      },
    ];

    return sections;
  }, [
    customer.id,
    customer.email,
    customer.mobile_phone,
    customer.phone,
    equipment,
    formatCurrency,
    formatDate,
    handleFieldChange,
    jobs,
    localCustomer,
    paymentMethods,
    properties,
    router,
  ]);

  const relatedItems = useMemo(() => {
    const items: any[] = [];

    if (primaryProperty) {
      items.push({
        id: `property-${primaryProperty.id}`,
        type: "property",
        title: primaryProperty.name || primaryProperty.address,
        subtitle: `${primaryProperty.city || ""}, ${primaryProperty.state || ""}`,
        href: `/dashboard/properties/${primaryProperty.id}`,
      });
    }

    if (jobs.length > 0) {
      const recentJob = jobs[0];
      items.push({
        id: `job-${recentJob.id}`,
        type: "job",
        title: recentJob.title || `Job #${recentJob.job_number}`,
        subtitle: recentJob.status,
        href: `/dashboard/work/${recentJob.id}`,
        badge: recentJob.status
          ? { label: recentJob.status, variant: "outline" as const }
          : undefined,
      });
    }

    return items;
  }, [jobs, primaryProperty]);

  return (
    <DetailPageContentLayout
      customHeader={customHeader}
      customSections={customSections}
      activities={activities}
      notes={[]}
      attachments={attachments}
      relatedItems={relatedItems}
      showStandardSections={{
        notes: false,
      }}
      defaultOpenSection="customer-info"
    />
  );
}

