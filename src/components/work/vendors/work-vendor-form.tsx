"use client";

import {
  AlertCircle,
  Building2,
  ExternalLink,
  Loader2,
  Search,
  Tag as TagIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createVendor, updateVendor } from "@/actions/vendors";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import type { VendorSelect } from "@/lib/validations/database-schemas";

type CompanySuggestion = {
  name: string;
  domain?: string;
  logo?: string;
  description?: string;
};

type CustomFieldsState = {
  account_manager_name: string;
  account_manager_email: string;
  procurement_portal_url: string;
  emergency_line: string;
  preferred_carrier: string;
  typical_lead_time_days: string;
  preferred_brands: string;
  notes_private: string;
};

type VendorFormState = {
  name: string;
  display_name: string;
  vendor_number: string;
  email: string;
  phone: string;
  secondary_phone: string;
  website: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  tax_id: string;
  payment_terms: string;
  credit_limit: string;
  preferred_payment_method: string;
  category: string;
  status: "active" | "inactive";
  notes: string;
  internal_notes: string;
};

type WorkVendorFormProps = {
  vendor?: VendorSelect | null;
  mode?: "create" | "edit";
};

const paymentTerms = [
  { value: "due_on_receipt", label: "Due on Receipt" },
  { value: "net_15", label: "Net 15" },
  { value: "net_30", label: "Net 30" },
  { value: "net_60", label: "Net 60" },
  { value: "custom", label: "Custom" },
];

const paymentMethods = [
  { value: "ach", label: "ACH" },
  { value: "check", label: "Check" },
  { value: "credit_card", label: "Credit Card" },
  { value: "wire", label: "Wire Transfer" },
];

const vendorCategories = [
  { value: "supplier", label: "Supplier" },
  { value: "distributor", label: "Distributor" },
  { value: "manufacturer", label: "Manufacturer" },
  { value: "service_provider", label: "Service Provider" },
  { value: "other", label: "Other" },
];

const statusOptions: Array<{ value: "active" | "inactive"; label: string }> = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function WorkVendorForm({
  vendor,
  mode = "create",
}: WorkVendorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<VendorFormState>({
    name: vendor?.name ?? "",
    display_name: vendor?.display_name ?? "",
    vendor_number: vendor?.vendor_number ?? "",
    email: vendor?.email ?? "",
    phone: vendor?.phone ?? "",
    secondary_phone: vendor?.secondary_phone ?? "",
    website: vendor?.website ?? "",
    address: vendor?.address ?? "",
    address2: vendor?.address2 ?? "",
    city: vendor?.city ?? "",
    state: vendor?.state ?? "",
    zip_code: vendor?.zip_code ?? "",
    country: vendor?.country ?? "USA",
    tax_id: vendor?.tax_id ?? "",
    payment_terms: vendor?.payment_terms ?? "net_30",
    credit_limit: vendor?.credit_limit
      ? (vendor.credit_limit / 100).toString()
      : "0",
    preferred_payment_method: vendor?.preferred_payment_method ?? "",
    category: vendor?.category ?? "",
    status: (vendor?.status as "active" | "inactive") ?? "active",
    notes: vendor?.notes ?? "",
    internal_notes: vendor?.internal_notes ?? "",
  });
  const [tags, setTags] = useState<string[]>(vendor?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [customFields, setCustomFields] = useState<CustomFieldsState>({
    account_manager_name:
      (vendor?.custom_fields as Record<string, string> | null)
        ?.account_manager_name || "",
    account_manager_email:
      (vendor?.custom_fields as Record<string, string> | null)
        ?.account_manager_email || "",
    procurement_portal_url:
      (vendor?.custom_fields as Record<string, string> | null)
        ?.procurement_portal_url || "",
    emergency_line:
      (vendor?.custom_fields as Record<string, string> | null)
        ?.emergency_line || "",
    preferred_carrier:
      (vendor?.custom_fields as Record<string, string> | null)
        ?.preferred_carrier || "",
    typical_lead_time_days: String(
      (vendor?.custom_fields as Record<string, string | number> | null)
        ?.typical_lead_time_days ?? ""
    ),
    preferred_brands:
      (vendor?.custom_fields as Record<string, string> | null)
        ?.preferred_brands || "",
    notes_private:
      (vendor?.custom_fields as Record<string, string> | null)?.notes_private ||
      "",
  });
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResults, setLookupResults] = useState<CompanySuggestion[]>([]);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) {
      return;
    }
    setTags((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleInputChange = (
    field: keyof VendorFormState,
    value: VendorFormState[keyof VendorFormState]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomFieldChange = (
    field: keyof CustomFieldsState,
    value: string
  ) => {
    setCustomFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCompanyLookup = async () => {
    if (!lookupQuery.trim()) {
      setLookupError("Enter a vendor name or domain to search.");
      return;
    }

    try {
      setIsLookupLoading(true);
      setLookupError(null);
      const response = await fetch(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(lookupQuery.trim())}`
      );
      if (!response.ok) {
        throw new Error("Directory lookup failed. Try again shortly.");
      }
      const payload = (await response.json()) as CompanySuggestion[];
      setLookupResults(payload.slice(0, 6));
    } catch (err) {
      setLookupError(
        err instanceof Error
          ? err.message
          : "Unable to reach company directory."
      );
    } finally {
      setIsLookupLoading(false);
    }
  };

  const applySuggestion = (suggestion: CompanySuggestion) => {
    handleInputChange("name", suggestion.name || formData.name);
    handleInputChange("display_name", suggestion.name || formData.display_name);
    if (suggestion.domain) {
      handleInputChange("website", `https://${suggestion.domain}`);
      const normalizedTag = suggestion.domain.split(".")[0];
      setTags((prev) =>
        prev.includes(normalizedTag) ? prev : [...prev, normalizedTag]
      );
      setCustomFields((prev) => ({
        ...prev,
        procurement_portal_url:
          prev.procurement_portal_url || `https://${suggestion.domain}`,
      }));
    }
    if (!formData.notes && suggestion.description) {
      handleInputChange("notes", suggestion.description);
    }
  };

  const isFormValid = useMemo(
    () => Boolean(formData.name.trim() && formData.display_name.trim()),
    [formData.display_name, formData.name]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) {
      setError("Vendor name and display name are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("display_name", formData.display_name.trim());
    if (formData.vendor_number) {
      payload.append("vendor_number", formData.vendor_number.trim());
    }
    if (formData.email) {
      payload.append("email", formData.email.trim());
    }
    if (formData.phone) {
      payload.append("phone", formData.phone.trim());
    }
    if (formData.secondary_phone) {
      payload.append("secondary_phone", formData.secondary_phone.trim());
    }
    if (formData.website) {
      payload.append("website", formData.website.trim());
    }
    if (formData.address) {
      payload.append("address", formData.address.trim());
    }
    if (formData.address2) {
      payload.append("address2", formData.address2.trim());
    }
    if (formData.city) {
      payload.append("city", formData.city.trim());
    }
    if (formData.state) {
      payload.append("state", formData.state.trim());
    }
    if (formData.zip_code) {
      payload.append("zip_code", formData.zip_code.trim());
    }
    if (formData.country) {
      payload.append("country", formData.country.trim());
    }
    if (formData.tax_id) {
      payload.append("tax_id", formData.tax_id.trim());
    }
    payload.append("payment_terms", formData.payment_terms);
    if (formData.credit_limit) {
      payload.append("credit_limit", formData.credit_limit);
    }
    if (formData.preferred_payment_method) {
      payload.append(
        "preferred_payment_method",
        formData.preferred_payment_method
      );
    }
    if (formData.category) {
      payload.append("category", formData.category);
    }
    payload.append("status", formData.status);
    if (formData.notes) {
      payload.append("notes", formData.notes);
    }
    if (formData.internal_notes) {
      payload.append("internal_notes", formData.internal_notes);
    }

    if (tags.length) {
      payload.append("tags", JSON.stringify(tags));
    }

    const cleanedCustomFields = Object.fromEntries(
      Object.entries(customFields)
        .map(([key, value]) => [key, value.trim()])
        .filter(([, value]) => value !== "")
    );

    if (cleanedCustomFields.typical_lead_time_days) {
      cleanedCustomFields.typical_lead_time_days = String(
        Number(cleanedCustomFields.typical_lead_time_days)
      );
    }

    if (Object.keys(cleanedCustomFields).length > 0) {
      payload.append("custom_fields", JSON.stringify(cleanedCustomFields));
    }

    try {
      const result =
        mode === "create"
          ? await createVendor(payload)
          : vendor
            ? await updateVendor(vendor.id, payload)
            : { success: false, error: "Vendor ID is required to edit." };

      if (!result.success) {
        setError(result.error || "Unable to save vendor.");
        setIsSubmitting(false);
        return;
      }

      const vendorId =
        mode === "create" && "data" in result
          ? (result.data as string | undefined)
          : vendor?.id;

      if (vendorId) {
        router.push(`/dashboard/work/vendors/${vendorId}`);
      } else {
        router.push("/dashboard/work/vendors");
      }
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unexpected error. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            Company Lookup
          </CardTitle>
          <CardDescription>
            Pull public info from Clearbit to reduce manual entry. Choose a
            company to prefill the basics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              aria-label="Search vendor directory"
              onChange={(event) => setLookupQuery(event.target.value)}
              placeholder="Ferguson, Winsupply, etc."
              value={lookupQuery}
            />
            <Button
              className="md:w-40"
              disabled={isLookupLoading}
              onClick={handleCompanyLookup}
              type="button"
            >
              {isLookupLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching…
                </>
              ) : (
                "Lookup"
              )}
            </Button>
          </div>
          {lookupError && (
            <p className="text-destructive text-sm">{lookupError}</p>
          )}
          {lookupResults.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              {lookupResults.map((suggestion) => (
                <button
                  className="flex items-center justify-between rounded-lg border bg-card p-3 text-left transition hover:border-primary"
                  key={`${suggestion.name}-${suggestion.domain}`}
                  onClick={() => applySuggestion(suggestion)}
                  type="button"
                >
                  <div>
                    <p className="font-medium">{suggestion.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {suggestion.domain || "Domain unavailable"}
                    </p>
                  </div>
                  <TagIcon className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Core Profile</CardTitle>
          <CardDescription>Names, codes, and categorization.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Vendor Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                onChange={(event) =>
                  handleInputChange("name", event.target.value)
                }
                placeholder="Ferguson Enterprises"
                required
                value={formData.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_name">
                Display Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="display_name"
                onChange={(event) =>
                  handleInputChange("display_name", event.target.value)
                }
                placeholder="Ferguson Plumbing Supply"
                required
                value={formData.display_name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor_number">Vendor Number</Label>
              <Input
                id="vendor_number"
                onChange={(event) =>
                  handleInputChange("vendor_number", event.target.value)
                }
                placeholder="VND-2025-PL-004"
                value={formData.vendor_number}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                onChange={(event) =>
                  handleInputChange("website", event.target.value)
                }
                placeholder="https://vendor.com"
                type="url"
                value={formData.website}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                onValueChange={(value) => handleInputChange("category", value)}
                value={formData.category || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {vendorCategories.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Select
                onValueChange={(value) =>
                  handleInputChange("payment_terms", value)
                }
                value={formData.payment_terms}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentTerms.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                onValueChange={(value: "active" | "inactive") =>
                  handleInputChange("status", value)
                }
                value={formData.status}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  className="flex items-center gap-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                  key={tag}
                >
                  <TagIcon className="h-3 w-3" />
                  {tag}
                  <button
                    aria-label={`Remove ${tag}`}
                    className="ml-1 text-muted-foreground text-xs hover:text-destructive"
                    onClick={() => removeTag(tag)}
                    type="button"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag (e.g., copper, hydronics)"
                value={tagInput}
              />
              <Button onClick={addTag} type="button" variant="outline">
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contacts & Communication</CardTitle>
            <CardDescription>Primary contacts for procurement.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                onChange={(event) =>
                  handleInputChange("email", event.target.value)
                }
                placeholder="purchasing@vendor.com"
                type="email"
                value={formData.email}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Main Phone</Label>
                <Input
                  id="phone"
                  onChange={(event) =>
                    handleInputChange("phone", event.target.value)
                  }
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_phone">Secondary / After-hours</Label>
                <Input
                  id="secondary_phone"
                  onChange={(event) =>
                    handleInputChange("secondary_phone", event.target.value)
                  }
                  placeholder="+1 (555) 987-6543"
                  value={formData.secondary_phone}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax_id">Tax ID</Label>
              <Input
                id="tax_id"
                onChange={(event) =>
                  handleInputChange("tax_id", event.target.value)
                }
                placeholder="XX-XXXXXXX"
                value={formData.tax_id}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Procurement Controls</CardTitle>
            <CardDescription>
              Terms, limits, and payment routing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="credit_limit">Credit Limit (USD)</Label>
              <Input
                id="credit_limit"
                min={0}
                onChange={(event) =>
                  handleInputChange(
                    "credit_limit",
                    event.target.value.replace(/[^0-9.]/g, "")
                  )
                }
                type="number"
                value={formData.credit_limit}
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred Payment Method</Label>
              <Select
                onValueChange={(value) =>
                  handleInputChange("preferred_payment_method", value)
                }
                value={formData.preferred_payment_method || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logistics & Ship-to</CardTitle>
          <CardDescription>
            Warehouse or fulfillment locations for this vendor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                onChange={(event) =>
                  handleInputChange("address", event.target.value)
                }
                placeholder="123 Supply Chain Way"
                value={formData.address}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address2">Suite / Building</Label>
              <Input
                id="address2"
                onChange={(event) =>
                  handleInputChange("address2", event.target.value)
                }
                placeholder="Suite 200"
                value={formData.address2}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                onChange={(event) =>
                  handleInputChange("city", event.target.value)
                }
                value={formData.city}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State / Region</Label>
              <Input
                id="state"
                onChange={(event) =>
                  handleInputChange("state", event.target.value)
                }
                value={formData.state}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip_code">Postal Code</Label>
              <Input
                id="zip_code"
                onChange={(event) =>
                  handleInputChange("zip_code", event.target.value)
                }
                value={formData.zip_code}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                onChange={(event) =>
                  handleInputChange("country", event.target.value)
                }
                value={formData.country}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portal & Escalations</CardTitle>
            <CardDescription>
              Store account manager contacts, portal links, and escalation
              paths.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="account_manager_name">Account Manager</Label>
                <Input
                  id="account_manager_name"
                  onChange={(event) =>
                    handleCustomFieldChange(
                      "account_manager_name",
                      event.target.value
                    )
                  }
                  placeholder="Jane Smith"
                  value={customFields.account_manager_name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_manager_email">Manager Email</Label>
                <Input
                  id="account_manager_email"
                  onChange={(event) =>
                    handleCustomFieldChange(
                      "account_manager_email",
                      event.target.value
                    )
                  }
                  placeholder="jane.smith@vendor.com"
                  type="email"
                  value={customFields.account_manager_email}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="procurement_portal_url">Procurement Portal</Label>
              <Input
                id="procurement_portal_url"
                onChange={(event) =>
                  handleCustomFieldChange(
                    "procurement_portal_url",
                    event.target.value
                  )
                }
                placeholder="https://portal.vendor.com"
                value={customFields.procurement_portal_url}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="preferred_carrier">Preferred Carrier</Label>
                <Input
                  id="preferred_carrier"
                  onChange={(event) =>
                    handleCustomFieldChange(
                      "preferred_carrier",
                      event.target.value
                    )
                  }
                  placeholder="UPS Freight, Old Dominion, etc."
                  value={customFields.preferred_carrier}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="typical_lead_time_days">
                  Typical Lead Time (days)
                </Label>
                <Input
                  id="typical_lead_time_days"
                  min={0}
                  onChange={(event) =>
                    handleCustomFieldChange(
                      "typical_lead_time_days",
                      event.target.value
                    )
                  }
                  type="number"
                  value={customFields.typical_lead_time_days}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_brands">Preferred Brands / Lines</Label>
              <Input
                id="preferred_brands"
                onChange={(event) =>
                  handleCustomFieldChange(
                    "preferred_brands",
                    event.target.value
                  )
                }
                placeholder="Uponor, Delta, Milwaukee"
                value={customFields.preferred_brands}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_line">
                Emergency / After-hours Line
              </Label>
              <Input
                id="emergency_line"
                onChange={(event) =>
                  handleCustomFieldChange("emergency_line", event.target.value)
                }
                placeholder="+1 (555) 444-1212"
                value={customFields.emergency_line}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes & Internal Briefing</CardTitle>
            <CardDescription>
              External notes are visible on POs. Internal notes stay private.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Customer-facing Notes</Label>
              <Textarea
                id="notes"
                onChange={(event) =>
                  handleInputChange("notes", event.target.value)
                }
                placeholder="Add delivery instructions, key contacts, or pricing agreements."
                rows={4}
                value={formData.notes}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internal_notes">Internal Notes</Label>
              <Textarea
                id="internal_notes"
                onChange={(event) =>
                  handleInputChange("internal_notes", event.target.value)
                }
                placeholder="Escalation steps, rebate schedules, sensitive information."
                rows={4}
                value={formData.internal_notes}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes_private">Escalation / Private Notes</Label>
              <Textarea
                id="notes_private"
                onChange={(event) =>
                  handleCustomFieldChange("notes_private", event.target.value)
                }
                placeholder="List executive contacts or special approvals."
                rows={3}
                value={customFields.notes_private}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button asChild type="button" variant="ghost">
          <Link href="/dashboard/work/vendors">Cancel</Link>
        </Button>
        <Button disabled={isSubmitting || !isFormValid} type="submit">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Vendor
            </>
          ) : mode === "create" ? (
            <>
              <Building2 className="mr-2 h-4 w-4" />
              Create Vendor
            </>
          ) : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
