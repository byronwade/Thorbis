"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createOrganizationCheckoutSession } from "@/actions/billing";
import { createOrganization } from "@/actions/company";
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
  const [primaryOrgCustomerId, setPrimaryOrgCustomerId] = useState<
    string | undefined
  >(undefined);
  const [activeSection, setActiveSection] = useState("overview");
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set()
  );
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
      const stripeInstance = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
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
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
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

    if (
      touchedFields.has("email") &&
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      errors.email = "Please enter a valid email address";
    }

    if (
      touchedFields.has("website") &&
      formData.website &&
      formData.website.length > 0
    ) {
      try {
        new URL(formData.website);
      } catch {
        errors.website = "Please enter a valid URL (e.g., https://example.com)";
      }
    }

    if (
      touchedFields.has("phone") &&
      formData.phone &&
      formData.phone.length > 0 &&
      formData.phone.length < 10
    ) {
      errors.phone = "Phone number should be at least 10 digits";
    }

    if (
      touchedFields.has("zipCode") &&
      formData.zipCode &&
      !/^\d{5}(-\d{4})?$/.test(formData.zipCode)
    ) {
      errors.zipCode =
        "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)";
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

    if (
      formData.address &&
      formData.city &&
      formData.state &&
      formData.zipCode
    ) {
      completed.add("location");
    }

    if (
      paymentMethodId &&
      (!isAdditionalOrganization || formData.confirmPricing)
    ) {
      completed.add("payment");
    }

    setCompletedSections(completed);
  }, [formData, paymentMethodId, isAdditionalOrganization]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
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
    setTouchedFields(
      new Set([
        "name",
        "industry",
        "email",
        "phone",
        "website",
        "address",
        "city",
        "state",
        "zipCode",
      ])
    );

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

    if (
      !(
        formData.address.trim() &&
        formData.city.trim() &&
        formData.state.trim() &&
        formData.zipCode.trim()
      )
    ) {
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
        const checkoutResult =
          await createOrganizationCheckoutSession(companyId);

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
        setError(
          "success" in result && !result.success
            ? (result as any).error || "Failed to create organization"
            : "Failed to create organization"
        );
        setIsSubmitting(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
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
                className="group inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
                href="/dashboard/settings"
              >
                <svg
                  className="group-hover:-translate-x-0.5 size-3 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 19l-7-7 7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Back
              </Link>
              <h2 className="font-semibold text-lg">Create Organization</h2>
              <p className="text-muted-foreground text-sm">
                {completedSections.size} of {FORM_SECTIONS.length - 1} sections
                completed
              </p>
            </div>

            {/* Progress */}
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 transition-all duration-700 ease-out"
                style={{
                  width: `${(completedSections.size / (FORM_SECTIONS.length - 1)) * 100}%`,
                }}
              />
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {FORM_SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                const isCompleted = completedSections.has(section.id);

                return (
                  <button
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
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
                        <Check
                          className="zoom-in-50 size-3 animate-in duration-300"
                          strokeWidth={3}
                        />
                      ) : (
                        <Icon className="size-3" />
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div
                        className={cn(
                          "font-medium leading-none transition-colors",
                          isActive && "text-primary"
                        )}
                      >
                        {section.title}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {section.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Completion indicator */}
            {completedSections.size === FORM_SECTIONS.length - 1 && (
              <div className="slide-in-from-bottom-2 animate-in rounded-lg border border-primary/20 bg-primary/5 p-4 duration-500">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/20">
                    <CheckCircle2 className="size-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-primary text-sm">
                      Ready to submit!
                    </p>
                    <p className="text-muted-foreground text-xs">
                      All sections completed
                    </p>
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
              className="inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
              href="/dashboard/settings"
            >
              ← Back to Settings
            </Link>
            <h1 className="font-bold text-3xl tracking-tight">
              Create Organization
            </h1>
            <p className="text-muted-foreground">
              Set up a new organization with its own team, customers, and
              settings.
            </p>

            {/* Mobile Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {completedSections.size} of {FORM_SECTIONS.length - 1}
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700"
                  style={{
                    width: `${(completedSections.size / (FORM_SECTIONS.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <Alert
                className="slide-in-from-top-2 animate-in border-2 duration-300"
                variant="destructive"
              >
                <AlertCircle className="size-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Overview Section */}
            <section
              className="scroll-mt-24 space-y-6"
              ref={(el) => {
                sectionRefs.current.overview = el as HTMLDivElement | null;
              }}
            >
              <div className="space-y-1">
                <h2 className="font-semibold text-2xl tracking-tight">
                  Welcome
                </h2>
                <p className="text-muted-foreground">
                  Let's set up your new organization. This should only take a
                  few minutes.
                </p>
              </div>

              {isAdditionalOrganization && (
                <Card className="fade-in-50 slide-in-from-bottom-2 animate-in border-primary/20 bg-primary/5 p-6 shadow-sm duration-500">
                  <div className="flex gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                      <AlertCircle className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-primary">
                        Additional Organization
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        You currently have{" "}
                        <strong className="text-foreground">
                          {existingCompaniesCount}
                        </strong>{" "}
                        organization{existingCompaniesCount !== 1 ? "s" : ""}.
                        Each additional organization costs{" "}
                        <strong className="text-foreground">$100/month</strong>,
                        allowing you to manage multiple businesses separately.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </section>

            {/* Business Details Section */}
            <section
              className="scroll-mt-24 space-y-6"
              ref={(el) => {
                sectionRefs.current.business = el as HTMLDivElement | null;
              }}
            >
              <div className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <Building2 className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-2xl tracking-tight">
                      Business Details
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Basic information about your organization
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Organization Name */}
                <div className="space-y-2 sm:col-span-2">
                  <Label className="font-medium text-sm" htmlFor="name">
                    Organization Name{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    className={cn(
                      "h-11 text-base transition-all",
                      formData.name && "border-primary/50"
                    )}
                    id="name"
                    onBlur={() => handleFieldBlur("name")}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Smith HVAC Services"
                    required
                    value={formData.name}
                  />
                  <p className="text-muted-foreground text-xs">
                    This will be the primary name displayed across the platform
                  </p>
                </div>

                {/* Industry */}
                <div className="space-y-2 sm:col-span-2">
                  <Label className="font-medium text-sm" htmlFor="industry">
                    Industry <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, industry: value }))
                    }
                    required
                    value={formData.industry}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-11 text-base transition-all",
                        formData.industry && "border-primary/50"
                      )}
                      id="industry"
                    >
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
                  <Label className="font-medium text-sm">
                    Business Logo (Optional)
                  </Label>
                  <div
                    className={cn(
                      "group relative overflow-hidden rounded-xl border-2 border-dashed bg-muted/30 p-8 transition-all duration-300",
                      isDragging
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                        : "border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/50"
                    )}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      {logoPreview ? (
                        <div className="relative size-24 overflow-hidden rounded-xl border shadow-md ring-2 ring-primary/10">
                          <img
                            alt="Logo preview"
                            className="size-full object-cover"
                            src={logoPreview}
                          />
                          <button
                            className="-right-2 -top-2 absolute flex size-6 items-center justify-center rounded-full border bg-destructive text-destructive-foreground shadow-sm transition-transform hover:scale-110"
                            onClick={removeLogo}
                            type="button"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex size-24 items-center justify-center rounded-xl border-2 border-muted-foreground/30 border-dashed bg-background/50 transition-colors group-hover:border-muted-foreground/50">
                          <Upload
                            className={cn(
                              "size-10 transition-all",
                              isDragging
                                ? "scale-110 text-primary"
                                : "text-muted-foreground/40"
                            )}
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <Input
                          accept="image/*"
                          className="cursor-pointer border-0 bg-transparent p-0 text-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2.5 file:font-medium file:text-primary-foreground file:text-sm file:transition-all hover:file:bg-primary/90 hover:file:shadow-md"
                          id="logo"
                          onChange={(e) =>
                            handleLogoChange(e.target.files?.[0] || null)
                          }
                          ref={fileInputRef}
                          type="file"
                        />
                        <p className="text-muted-foreground text-xs">
                          {isDragging
                            ? "Drop your logo here..."
                            : "PNG, JPG, or GIF (max 5MB) • Recommended: 512x512px"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information Section */}
            <section
              className="scroll-mt-24 space-y-6"
              ref={(el) => {
                sectionRefs.current.contact = el as HTMLDivElement | null;
              }}
            >
              <div className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <Phone className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-2xl tracking-tight">
                      Contact Information
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      How customers can reach your business
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Phone */}
                <div className="space-y-2">
                  <Label className="font-medium text-sm" htmlFor="phone">
                    Business Phone
                  </Label>
                  <div className="relative">
                    <Phone
                      className={cn(
                        "-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 transition-colors",
                        formData.phone
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <Input
                      className={cn(
                        "h-11 pl-10 text-base transition-all",
                        formData.phone &&
                          !fieldErrors.phone &&
                          "border-primary/50",
                        fieldErrors.phone && "border-destructive"
                      )}
                      id="phone"
                      onBlur={() => handleFieldBlur("phone")}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="(555) 123-4567"
                      type="tel"
                      value={formData.phone}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="slide-in-from-top-1 animate-in text-destructive text-xs duration-200">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="font-medium text-sm" htmlFor="email">
                    Business Email
                  </Label>
                  <div className="relative">
                    <Mail
                      className={cn(
                        "-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 transition-colors",
                        formData.email
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <Input
                      className={cn(
                        "h-11 pl-10 text-base transition-all",
                        formData.email &&
                          !fieldErrors.email &&
                          "border-primary/50",
                        fieldErrors.email && "border-destructive"
                      )}
                      id="email"
                      onBlur={() => handleFieldBlur("email")}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="info@company.com"
                      type="email"
                      value={formData.email}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="slide-in-from-top-1 animate-in text-destructive text-xs duration-200">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Website */}
                <div className="space-y-2 sm:col-span-2">
                  <Label className="font-medium text-sm" htmlFor="website">
                    Website
                  </Label>
                  <div className="relative">
                    <Globe
                      className={cn(
                        "-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 transition-colors",
                        formData.website
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <Input
                      className={cn(
                        "h-11 pl-10 text-base transition-all",
                        formData.website &&
                          !fieldErrors.website &&
                          "border-primary/50",
                        fieldErrors.website && "border-destructive"
                      )}
                      id="website"
                      onBlur={() => handleFieldBlur("website")}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      placeholder="https://www.company.com"
                      type="url"
                      value={formData.website}
                    />
                  </div>
                  {fieldErrors.website && (
                    <p className="slide-in-from-top-1 animate-in text-destructive text-xs duration-200">
                      {fieldErrors.website}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Business Location Section */}
            <section
              className="scroll-mt-24 space-y-6"
              ref={(el) => {
                sectionRefs.current.location = el as HTMLDivElement | null;
              }}
            >
              <div className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <MapPin className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-2xl tracking-tight">
                      Business Location
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Your organization's physical address
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Street Address */}
                <div className="space-y-2 sm:col-span-2">
                  <Label className="font-medium text-sm" htmlFor="address">
                    Street Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    className={cn(
                      "h-11 text-base transition-all",
                      formData.address && "border-primary/50"
                    )}
                    id="address"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="123 Main St"
                    required
                    value={formData.address}
                  />
                </div>

                {/* Address Line 2 */}
                <div className="space-y-2 sm:col-span-2">
                  <Label className="font-medium text-sm" htmlFor="address2">
                    Address Line 2
                  </Label>
                  <Input
                    className="h-11 text-base"
                    id="address2"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address2: e.target.value,
                      }))
                    }
                    placeholder="Suite 100 (optional)"
                    value={formData.address2}
                  />
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label className="font-medium text-sm" htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    className={cn(
                      "h-11 text-base transition-all",
                      formData.city && "border-primary/50"
                    )}
                    id="city"
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder="San Francisco"
                    required
                    value={formData.city}
                  />
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label className="font-medium text-sm" htmlFor="state">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    className={cn(
                      "h-11 text-base transition-all",
                      formData.state && "border-primary/50"
                    )}
                    id="state"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    placeholder="CA"
                    required
                    value={formData.state}
                  />
                </div>

                {/* ZIP Code */}
                <div className="space-y-2">
                  <Label className="font-medium text-sm" htmlFor="zipCode">
                    ZIP Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    className={cn(
                      "h-11 text-base transition-all",
                      formData.zipCode &&
                        !fieldErrors.zipCode &&
                        "border-primary/50",
                      fieldErrors.zipCode && "border-destructive"
                    )}
                    id="zipCode"
                    onBlur={() => handleFieldBlur("zipCode")}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        zipCode: e.target.value,
                      }))
                    }
                    placeholder="94102"
                    required
                    value={formData.zipCode}
                  />
                  {fieldErrors.zipCode && (
                    <p className="slide-in-from-top-1 animate-in text-destructive text-xs duration-200">
                      {fieldErrors.zipCode}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label className="font-medium text-sm" htmlFor="country">
                    Country
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, country: value }))
                    }
                    value={formData.country}
                  >
                    <SelectTrigger className="h-11 text-base" id="country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">
                        United States
                      </SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Mexico">Mexico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Payment Setup Section */}
            <section
              className="scroll-mt-24 space-y-6"
              ref={(el) => {
                sectionRefs.current.payment = el as HTMLDivElement | null;
              }}
            >
              <div className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <CreditCard className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-2xl tracking-tight">
                      Payment Setup
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Secure billing information
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Payment Method */}
                <div className="space-y-2">
                  <Label className="font-medium text-sm">
                    Payment Method <span className="text-destructive">*</span>
                  </Label>
                  <Card
                    className={cn(
                      "border-2 bg-muted/30 p-6 transition-all",
                      paymentMethodId &&
                        "border-primary/50 shadow-primary/5 shadow-sm"
                    )}
                  >
                    <PaymentMethodSelector
                      customerId={primaryOrgCustomerId}
                      onError={(errorMsg) => setError(errorMsg)}
                      onPaymentMethodSelected={(id) => {
                        setPaymentMethodId(id);
                        setError(null);
                      }}
                      stripe={stripe}
                    />
                  </Card>
                  <p className="text-muted-foreground text-xs">
                    🔒 Secured by Stripe • We never store your card details
                  </p>
                </div>

                {/* Pricing Acknowledgment */}
                {isAdditionalOrganization && (
                  <Card
                    className={cn(
                      "border-2 border-primary/30 bg-primary/5 p-6 transition-all",
                      formData.confirmPricing && "shadow-primary/10 shadow-sm"
                    )}
                  >
                    <label className="flex cursor-pointer items-start gap-4">
                      <Checkbox
                        checked={formData.confirmPricing}
                        className="mt-1"
                        id="confirmPricing"
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            confirmPricing: checked === true,
                          }))
                        }
                      />
                      <div className="flex-1 space-y-1.5">
                        <p className="font-medium leading-tight">
                          I understand the $100/month minimum charge
                        </p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          This charge will be added to your next billing cycle
                          and allows you to manage this organization separately
                          with its own team, customers, jobs, and settings.
                        </p>
                      </div>
                    </label>
                  </Card>
                )}

                {/* Pricing Details Accordion */}
                <div className="space-y-3">
                  <Button
                    className="w-full justify-between font-medium text-sm transition-all hover:bg-muted/50"
                    onClick={() => setShowPricingDetails(!showPricingDetails)}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    <span>Pricing Details</span>
                    <svg
                      className={cn(
                        "size-4 transition-transform duration-300",
                        showPricingDetails && "rotate-180"
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 9l-7 7-7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </Button>

                  {showPricingDetails && (
                    <Card className="slide-in-from-top-2 animate-in border-2 p-6 shadow-sm duration-300">
                      <div className="space-y-6">
                        {/* Base Subscription */}
                        <div className="flex items-center justify-between rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-4 shadow-sm">
                          <div>
                            <p className="font-semibold">Base Subscription</p>
                            <p className="text-muted-foreground text-sm">
                              Full platform access
                            </p>
                          </div>
                          <p className="font-bold text-2xl text-primary">
                            $100/mo
                          </p>
                        </div>

                        {/* Usage Pricing */}
                        <div className="space-y-3">
                          <p className="font-medium text-sm">
                            Usage-Based Pricing
                          </p>
                          <div className="space-y-2 rounded-lg border bg-muted/20 p-3 text-sm">
                            <div className="flex justify-between rounded px-2 py-1 transition-colors hover:bg-muted/50">
                              <span className="text-muted-foreground">
                                Team Members
                              </span>
                              <span className="font-medium">$5.00/user</span>
                            </div>
                            <div className="flex justify-between rounded px-2 py-1 transition-colors hover:bg-muted/50">
                              <span className="text-muted-foreground">
                                Customer Invoices
                              </span>
                              <span className="font-medium">$0.15/invoice</span>
                            </div>
                            <div className="flex justify-between rounded px-2 py-1 transition-colors hover:bg-muted/50">
                              <span className="text-muted-foreground">
                                Price Quotes
                              </span>
                              <span className="font-medium">$0.10/quote</span>
                            </div>
                            <div className="flex justify-between rounded px-2 py-1 transition-colors hover:bg-muted/50">
                              <span className="text-muted-foreground">
                                SMS Messages
                              </span>
                              <span className="font-medium">$0.02/text</span>
                            </div>
                            <div className="flex justify-between rounded px-2 py-1 transition-colors hover:bg-muted/50">
                              <span className="text-muted-foreground">
                                Emails
                              </span>
                              <span className="font-medium">$0.005/email</span>
                            </div>
                          </div>
                        </div>

                        {/* What's Included */}
                        <div className="space-y-3">
                          <p className="font-medium text-sm">What's Included</p>
                          <div className="grid gap-2">
                            {[
                              "Separate team members and roles",
                              "Independent customer database",
                              "Dedicated scheduling and dispatch",
                              "Separate invoicing and payments",
                              "Custom branding and settings",
                            ].map((feature, index) => (
                              <div
                                className="flex items-center gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-muted/20"
                                key={feature}
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
            <div className="-mx-6 -mb-12 lg:-mx-8 sticky bottom-0 border-t bg-background/95 px-6 py-4 shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 lg:px-8">
              <div className="flex items-center justify-between">
                <Button
                  asChild
                  className="transition-all hover:bg-muted"
                  size="lg"
                  type="button"
                  variant="ghost"
                >
                  <Link href="/dashboard/settings">Cancel</Link>
                </Button>
                <Button
                  className="group min-w-[180px] shadow-md transition-all hover:shadow-lg hover:shadow-primary/20"
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
                  size="lg"
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Organization
                      <svg
                        className="ml-2 size-4 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
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
