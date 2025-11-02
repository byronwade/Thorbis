"use client";

import { AlertCircle, Building2, Check, CheckCircle2, CreditCard, Globe, Loader2, Mail, MapPin, Phone, Sparkles, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { createOrganization } from "@/actions/company";
import { createOrganizationCheckoutSession } from "@/actions/billing";
import { PaymentMethodSelector } from "@/components/billing/payment-method-selector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Organization Creation Wizard - Premium Design
 *
 * Enhanced with:
 * - Advanced animations and micro-interactions
 * - Drag-and-drop logo upload
 * - Real-time validation feedback
 * - Success states and progress indicators
 * - Enhanced visual polish
 * - Smooth transitions throughout
 */

// Note: Stripe is initialized in component state to handle async loading

type OrganizationCreationWizardProps = {
  existingCompaniesCount: number;
};

type FormSection = {
  id: string;
  title: string;
  description: string;
  icon: typeof Building2;
};

const FORM_SECTIONS: FormSection[] = [
  {
    id: "overview",
    title: "Overview",
    description: "Get started",
    icon: Sparkles,
  },
  {
    id: "business",
    title: "Business Details",
    description: "Organization information",
    icon: Building2,
  },
  {
    id: "contact",
    title: "Contact Information",
    description: "How to reach you",
    icon: Phone,
  },
  {
    id: "location",
    title: "Business Location",
    description: "Physical address",
    icon: MapPin,
  },
  {
    id: "payment",
    title: "Payment Setup",
    description: "Billing information",
    icon: CreditCard,
  },
];

export function OrganizationCreationWizard({
  existingCompaniesCount,
}: OrganizationCreationWizardProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [primaryOrgCustomerId, setPrimaryOrgCustomerId] = useState<string | undefined>(undefined);
  const [activeSection, setActiveSection] = useState("overview");
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [stripe, setStripe] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    confirmPricing: false,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPricingDetails, setShowPricingDetails] = useState(false);

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdditionalOrganization = existingCompaniesCount > 0;

  // Initialize Stripe on component mount
  useEffect(() => {
    const initStripe = async () => {
      const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      setStripe(stripeInstance);
    };
    initStripe();
  }, []);

  // Fetch primary organization's Stripe customer ID on mount
  useEffect(() => {
    async function fetchPrimaryOrgCustomer() {
      if (!isAdditionalOrganization) return;

      try {
        const response = await fetch("/api/payments/primary-customer");
        if (response.ok) {
          const data = await response.json();
          setPrimaryOrgCustomerId(data.customerId);
        }
      } catch (err) {
        console.error("Error fetching primary customer:", err);
      }
    }

    fetchPrimaryOrgCustomer();
  }, [isAdditionalOrganization]);

  // Scroll spy for active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of FORM_SECTIONS) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Real-time validation
  useEffect(() => {
    const errors: Record<string, string> = {};

    if (touchedFields.has("email") && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (touchedFields.has("website") && formData.website && formData.website.length > 0) {
      try {
        new URL(formData.website);
      } catch {
        errors.website = "Please enter a valid URL (e.g., https://example.com)";
      }
    }

    if (touchedFields.has("phone") && formData.phone && formData.phone.length > 0 && formData.phone.length < 10) {
      errors.phone = "Phone number should be at least 10 digits";
    }

    if (touchedFields.has("zipCode") && formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      errors.zipCode = "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)";
    }

    setFieldErrors(errors);
  }, [formData, touchedFields]);

  // Check section completion with animations
  useEffect(() => {
    const completed = new Set<string>();

    if (formData.name && formData.industry) {
      completed.add("business");
    }

    if (formData.phone || formData.email || formData.website) {
      completed.add("contact");
    }

    if (formData.address && formData.city && formData.state && formData.zipCode) {
      completed.add("location");
    }

    if (paymentMethodId && (!isAdditionalOrganization || formData.confirmPricing)) {
      completed.add("payment");
    }

    setCompletedSections(completed);
  }, [formData, paymentMethodId, isAdditionalOrganization]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
  };

  const handleLogoChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Logo file size must be less than 5MB");
      return;
    }

    setError(null);
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleLogoChange(files[0]);
    }
  }, []);

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Mark all fields as touched for validation
    setTouchedFields(new Set([
      "name", "industry", "email", "phone", "website",
      "address", "city", "state", "zipCode"
    ]));

    if (!formData.name.trim()) {
      setError("Organization name is required");
      scrollToSection("business");
      return;
    }

    if (!formData.industry) {
      setError("Please select an industry");
      scrollToSection("business");
      return;
    }

    if (Object.keys(fieldErrors).length > 0) {
      setError("Please fix the validation errors before submitting");
      return;
    }

    if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zipCode.trim()) {
      setError("Complete business address is required");
      scrollToSection("location");
      return;
    }

    if (!paymentMethodId) {
      setError("Please complete the payment information");
      scrollToSection("payment");
      return;
    }

    if (isAdditionalOrganization && !formData.confirmPricing) {
      setError("You must acknowledge the pricing for additional organizations");
      scrollToSection("payment");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("industry", formData.industry);
      data.append("phone", formData.phone.trim());
      data.append("email", formData.email.trim());
      data.append("website", formData.website.trim());
      data.append("address", formData.address.trim());
      data.append("address2", formData.address2.trim());
      data.append("city", formData.city.trim());
      data.append("state", formData.state.trim());
      data.append("zipCode", formData.zipCode.trim());
      data.append("country", formData.country);
      data.append("confirmPricing", formData.confirmPricing ? "true" : "false");

      if (logoFile) {
        data.append("logo", logoFile);
      }

      if (paymentMethodId) {
        data.append("paymentMethodId", paymentMethodId);
      }

      const result = await createOrganization(data);

      if (result.success && result.data) {
        const companyId = result.data;
        const checkoutResult = await createOrganizationCheckoutSession(companyId);

        if (checkoutResult.success && checkoutResult.url) {
          window.location.href = checkoutResult.url;
        } else {
          setError(
            checkoutResult.error ||
              "Organization created but failed to start billing setup. Please contact support."
          );
          setIsSubmitting(false);
        }
      } else {
        setError("success" in result && !result.success ? (result as any).error || "Failed to create organization" : "Failed to create organization");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      {/* Animated background pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Top gradient accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[280px_1fr] lg:gap-12 lg:px-8">
        {/* Sticky Sidebar Navigation */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <Link
                href="/dashboard/settings"
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <svg className="size-3 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
              <h2 className="text-lg font-semibold">Create Organization</h2>
              <p className="text-sm text-muted-foreground">
                {completedSections.size} of {FORM_SECTIONS.length - 1} sections completed
              </p>
            </div>

            {/* Progress */}
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 transition-all duration-700 ease-out"
                style={{ width: `${(completedSections.size / (FORM_SECTIONS.length - 1)) * 100}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {FORM_SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                const isCompleted = completedSections.has(section.id);

                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                        isActive
                          ? "scale-110 border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 group-hover:border-muted-foreground/50"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="size-3 animate-in zoom-in-50 duration-300" strokeWidth={3} />
                      ) : (
                        <Icon className="size-3" />
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className={cn("font-medium leading-none transition-colors", isActive && "text-primary")}>
                        {section.title}
                      </div>
                      <div className="text-xs text-muted-foreground">{section.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Completion indicator */}
            {completedSections.size === FORM_SECTIONS.length - 1 && (
              <div className="animate-in slide-in-from-bottom-2 rounded-lg border border-primary/20 bg-primary/5 p-4 duration-500">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/20">
                    <CheckCircle2 className="size-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary">Ready to submit!</p>
                    <p className="text-xs text-muted-foreground">All sections completed</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Mobile Header */}
          <div className="space-y-3 lg:hidden">
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to Settings
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Create Organization</h1>
            <p className="text-muted-foreground">
              Set up a new organization with its own team, customers, and settings.
            </p>

            {/* Mobile Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{completedSections.size} of {FORM_SECTIONS.length - 1}</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700"
                  style={{ width: `${(completedSections.size / (FORM_SECTIONS.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-2 border-2 duration-300">
                <AlertCircle className="size-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Overview Section */}
            <section
              ref={(el) => {
                sectionRefs.current.overview = el as HTMLDivElement | null;
              }}
              className="scroll-mt-24 space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">Welcome</h2>
                <p className="text-muted-foreground">
                  Let's set up your new organization. This should only take a few minutes.
                </p>
              </div>

              {isAdditionalOrganization && (
                <Card className="animate-in fade-in-50 slide-in-from-bottom-2 border-primary/20 bg-primary/5 p-6 shadow-sm duration-500">
                  <div className="flex gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                      <AlertCircle className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-primary">Additional Organization</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        You currently have <strong className="text-foreground">{existingCompaniesCount}</strong> organization{existingCompaniesCount !== 1 ? "s" : ""}.
                        Each additional organization costs <strong className="text-foreground">$100/month</strong>,
                        allowing you to manage multiple businesses separately.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </section>

            {/* Business Details Section */}
            <section
              ref={(el) => {
                sectionRefs.current.business = el as HTMLDivElement | null;
              }}
              className="scroll-mt-24 space-y-6"
            >
              <div className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <Building2 className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Business Details</h2>
                    <p className="text-sm text-muted-foreground">Basic information about your organization</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Organization Name */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Organization Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Smith HVAC Services"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    onBlur={() => handleFieldBlur("name")}
                    className={cn(
                      "h-11 text-base transition-all",
                      formData.name && "border-primary/50"
                    )}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be the primary name displayed across the platform
                  </p>
                </div>

                {/* Industry */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="industry" className="text-sm font-medium">
                    Industry <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
                    required
                  >
                    <SelectTrigger id="industry" className={cn("h-11 text-base transition-all", formData.industry && "border-primary/50")}>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="landscaping">Landscaping</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Logo Upload - Enhanced with drag & drop */}
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-medium">Business Logo (Optional)</Label>
                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border-2 border-dashed bg-muted/30 p-8 transition-all duration-300",
                      isDragging
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                        : "border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      {logoPreview ? (
                        <div className="relative size-24 overflow-hidden rounded-xl border shadow-md ring-2 ring-primary/10">
                          <img alt="Logo preview" className="size-full object-cover" src={logoPreview} />
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full border bg-destructive text-destructive-foreground shadow-sm transition-transform hover:scale-110"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex size-24 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-background/50 transition-colors group-hover:border-muted-foreground/50">
                          <Upload className={cn("size-10 transition-all", isDragging ? "scale-110 text-primary" : "text-muted-foreground/40")} />
                        </div>
                      )}
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <Input
                          ref={fileInputRef}
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLogoChange(e.target.files?.[0] || null)}
                          className="cursor-pointer border-0 bg-transparent p-0 text-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-primary-foreground file:transition-all hover:file:bg-primary/90 hover:file:shadow-md"
                        />
                        <p className="text-xs text-muted-foreground">
                          {isDragging ? "Drop your logo here..." : "PNG, JPG, or GIF (max 5MB) • Recommended: 512x512px"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information Section */}
            <section
              ref={(el) => {
                sectionRefs.current.contact = el as HTMLDivElement | null;
              }}
              className="scroll-mt-24 space-y-6"
            >
              <div className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <Phone className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Contact Information</h2>
                    <p className="text-sm text-muted-foreground">How customers can reach your business</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Business Phone
                  </Label>
                  <div className="relative">
                    <Phone className={cn(
                      "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 transition-colors",
                      formData.phone ? "text-primary" : "text-muted-foreground"
                    )} />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      onBlur={() => handleFieldBlur("phone")}
                      className={cn(
                        "h-11 pl-10 text-base transition-all",
                        formData.phone && !fieldErrors.phone && "border-primary/50",
                        fieldErrors.phone && "border-destructive"
                      )}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="animate-in slide-in-from-top-1 text-xs text-destructive duration-200">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Business Email
                  </Label>
                  <div className="relative">
                    <Mail className={cn(
                      "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 transition-colors",
                      formData.email ? "text-primary" : "text-muted-foreground"
                    )} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="info@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      onBlur={() => handleFieldBlur("email")}
                      className={cn(
                        "h-11 pl-10 text-base transition-all",
                        formData.email && !fieldErrors.email && "border-primary/50",
                        fieldErrors.email && "border-destructive"
                      )}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="animate-in slide-in-from-top-1 text-xs text-destructive duration-200">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Website */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="website" className="text-sm font-medium">
                    Website
                  </Label>
                  <div className="relative">
                    <Globe className={cn(
                      "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 transition-colors",
                      formData.website ? "text-primary" : "text-muted-foreground"
                    )} />
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://www.company.com"
                      value={formData.website}
                      onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                      onBlur={() => handleFieldBlur("website")}
                      className={cn(
                        "h-11 pl-10 text-base transition-all",
                        formData.website && !fieldErrors.website && "border-primary/50",
                        fieldErrors.website && "border-destructive"
                      )}
                    />
                  </div>
                  {fieldErrors.website && (
                    <p className="animate-in slide-in-from-top-1 text-xs text-destructive duration-200">{fieldErrors.website}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Business Location Section */}
            <section
              ref={(el) => {
                sectionRefs.current.location = el as HTMLDivElement | null;
              }}
              className="scroll-mt-24 space-y-6"
            >
              <div className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <MapPin className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Business Location</h2>
                    <p className="text-sm text-muted-foreground">Your organization's physical address</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Street Address */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Street Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Main St"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    className={cn("h-11 text-base transition-all", formData.address && "border-primary/50")}
                    required
                  />
                </div>

                {/* Address Line 2 */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address2" className="text-sm font-medium">
                    Address Line 2
                  </Label>
                  <Input
                    id="address2"
                    placeholder="Suite 100 (optional)"
                    value={formData.address2}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address2: e.target.value }))}
                    className="h-11 text-base"
                  />
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="San Francisco"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    className={cn("h-11 text-base transition-all", formData.city && "border-primary/50")}
                    required
                  />
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="state"
                    placeholder="CA"
                    value={formData.state}
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                    className={cn("h-11 text-base transition-all", formData.state && "border-primary/50")}
                    required
                  />
                </div>

                {/* ZIP Code */}
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-sm font-medium">
                    ZIP Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="zipCode"
                    placeholder="94102"
                    value={formData.zipCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
                    onBlur={() => handleFieldBlur("zipCode")}
                    className={cn(
                      "h-11 text-base transition-all",
                      formData.zipCode && !fieldErrors.zipCode && "border-primary/50",
                      fieldErrors.zipCode && "border-destructive"
                    )}
                    required
                  />
                  {fieldErrors.zipCode && (
                    <p className="animate-in slide-in-from-top-1 text-xs text-destructive duration-200">{fieldErrors.zipCode}</p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium">
                    Country
                  </Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger id="country" className="h-11 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Mexico">Mexico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Payment Setup Section */}
            <section
              ref={(el) => {
                sectionRefs.current.payment = el as HTMLDivElement | null;
              }}
              className="scroll-mt-24 space-y-6"
            >
              <div className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <CreditCard className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Payment Setup</h2>
                    <p className="text-sm text-muted-foreground">Secure billing information</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Payment Method */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Payment Method <span className="text-destructive">*</span>
                  </Label>
                  <Card className={cn(
                    "border-2 bg-muted/30 p-6 transition-all",
                    paymentMethodId && "border-primary/50 shadow-sm shadow-primary/5"
                  )}>
                    <PaymentMethodSelector
                      stripe={stripe}
                      customerId={primaryOrgCustomerId}
                      onPaymentMethodSelected={(id) => {
                        setPaymentMethodId(id);
                        setError(null);
                      }}
                      onError={(errorMsg) => setError(errorMsg)}
                    />
                  </Card>
                  <p className="text-xs text-muted-foreground">
                    🔒 Secured by Stripe • We never store your card details
                  </p>
                </div>

                {/* Pricing Acknowledgment */}
                {isAdditionalOrganization && (
                  <Card className={cn(
                    "border-2 border-primary/30 bg-primary/5 p-6 transition-all",
                    formData.confirmPricing && "shadow-sm shadow-primary/10"
                  )}>
                    <label className="flex cursor-pointer items-start gap-4">
                      <Checkbox
                        id="confirmPricing"
                        checked={formData.confirmPricing}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            confirmPricing: checked === true,
                          }))
                        }
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1.5">
                        <p className="font-medium leading-tight">
                          I understand the $100/month minimum charge
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          This charge will be added to your next billing cycle and allows you to manage this
                          organization separately with its own team, customers, jobs, and settings.
                        </p>
                      </div>
                    </label>
                  </Card>
                )}

                {/* Pricing Details Accordion */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-sm font-medium transition-all hover:bg-muted/50"
                    onClick={() => setShowPricingDetails(!showPricingDetails)}
                  >
                    <span>Pricing Details</span>
                    <svg
                      className={cn("size-4 transition-transform duration-300", showPricingDetails && "rotate-180")}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>

                  {showPricingDetails && (
                    <Card className="animate-in slide-in-from-top-2 border-2 p-6 shadow-sm duration-300">
                      <div className="space-y-6">
                        {/* Base Subscription */}
                        <div className="flex items-center justify-between rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-4 shadow-sm">
                          <div>
                            <p className="font-semibold">Base Subscription</p>
                            <p className="text-sm text-muted-foreground">Full platform access</p>
                          </div>
                          <p className="text-2xl font-bold text-primary">$100/mo</p>
                        </div>

                        {/* Usage Pricing */}
                        <div className="space-y-3">
                          <p className="text-sm font-medium">Usage-Based Pricing</p>
                          <div className="space-y-2 rounded-lg border bg-muted/20 p-3 text-sm">
                            <div className="flex justify-between hover:bg-muted/50 px-2 py-1 rounded transition-colors"><span className="text-muted-foreground">Team Members</span><span className="font-medium">$5.00/user</span></div>
                            <div className="flex justify-between hover:bg-muted/50 px-2 py-1 rounded transition-colors"><span className="text-muted-foreground">Customer Invoices</span><span className="font-medium">$0.15/invoice</span></div>
                            <div className="flex justify-between hover:bg-muted/50 px-2 py-1 rounded transition-colors"><span className="text-muted-foreground">Price Quotes</span><span className="font-medium">$0.10/quote</span></div>
                            <div className="flex justify-between hover:bg-muted/50 px-2 py-1 rounded transition-colors"><span className="text-muted-foreground">SMS Messages</span><span className="font-medium">$0.02/text</span></div>
                            <div className="flex justify-between hover:bg-muted/50 px-2 py-1 rounded transition-colors"><span className="text-muted-foreground">Emails</span><span className="font-medium">$0.005/email</span></div>
                          </div>
                        </div>

                        {/* What's Included */}
                        <div className="space-y-3">
                          <p className="text-sm font-medium">What's Included</p>
                          <div className="grid gap-2">
                            {[
                              "Separate team members and roles",
                              "Independent customer database",
                              "Dedicated scheduling and dispatch",
                              "Separate invoicing and payments",
                              "Custom branding and settings",
                            ].map((feature, index) => (
                              <div
                                key={feature}
                                className="flex items-center gap-2 text-sm rounded-lg hover:bg-muted/20 p-2 transition-colors"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </section>

            {/* Submit Actions - Enhanced sticky bar */}
            <div className="sticky bottom-0 -mx-6 -mb-12 border-t bg-background/95 px-6 py-4 shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 lg:-mx-8 lg:px-8">
              <div className="flex items-center justify-between">
                <Button asChild type="button" variant="ghost" size="lg" className="transition-all hover:bg-muted">
                  <Link href="/dashboard/settings">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={
                    isSubmitting ||
                    !formData.name.trim() ||
                    !formData.industry ||
                    !formData.address.trim() ||
                    !formData.city.trim() ||
                    !formData.state.trim() ||
                    !formData.zipCode.trim() ||
                    !paymentMethodId ||
                    (isAdditionalOrganization && !formData.confirmPricing) ||
                    Object.keys(fieldErrors).length > 0
                  }
                  className="group min-w-[180px] shadow-md transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Organization
                      <svg className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
