"use client";

/**
 * Comprehensive Onboarding Flow - Multi-Step Setup
 *
 * Steps:
 * 1. Database/Port Forwarding Setup (automated)
 * 2. Company Details (comprehensive)
 * 3. Team Members
 * 4. Billing/Payment (required)
 * 5. Complete
 *
 * Blocks access to dashboard until all steps complete and payment made
 */

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  Check,
  CheckCircle,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  HelpCircle,
  Info,
  Loader2,
  Phone,
  Search,
  Shield,
  Sparkles,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createOrganizationCheckoutSession } from "@/actions/billing";
import {
  archiveIncompleteCompany,
  portOnboardingPhoneNumber,
  saveOnboardingProgress,
  saveOnboardingStepProgress,
} from "@/actions/onboarding";
import { searchPhoneNumbers } from "@/actions/telnyx";
import { SmartAddressInput } from "@/components/customers/smart-address-input";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

// Industry options
const INDUSTRIES = [
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "pest-control", label: "Pest Control" },
  { value: "locksmith", label: "Locksmith" },
  { value: "appliance-repair", label: "Appliance Repair" },
  { value: "garage-door", label: "Garage Door" },
  { value: "landscaping", label: "Landscaping" },
  { value: "pool-service", label: "Pool Service" },
  { value: "cleaning", label: "Cleaning" },
  { value: "roofing", label: "Roofing" },
  { value: "painting", label: "Painting" },
  { value: "handyman", label: "Handyman" },
  { value: "other", label: "Other" },
];

const COMPANY_SIZES = [
  { value: "1-5", label: "1-5 employees" },
  { value: "6-10", label: "6-10 employees" },
  { value: "11-25", label: "11-25 employees" },
  { value: "26-50", label: "26-50 employees" },
  { value: "51-100", label: "51-100 employees" },
  { value: "100+", label: "100+ employees" },
];

const PRICING = {
  baseFee: 100,
  features: [
    "Unlimited users",
    "Smart scheduling (4 views)",
    "Invoicing & estimates",
    "Mobile app (iOS & Android)",
    "QuickBooks integration",
    "Customer portal",
    "Reports & analytics",
    "Data ownership & export",
  ],
  usageBased: {
    teamMembers: {
      price: 5,
      unit: "per user/month",
      description: "Active team members",
    },
    phoneNumbers: {
      price: 2,
      unit: "per number/month",
      description: "Business phone numbers (local or toll-free)",
    },
    storage: { price: 0.5, unit: "per GB/month", description: "File storage" },
    invoices: {
      price: 0.15,
      unit: "per invoice",
      description: "Customer invoices sent",
    },
    estimates: {
      price: 0.1,
      unit: "per quote",
      description: "Price quotes/estimates",
    },
    sms: { price: 0.02, unit: "per text", description: "SMS messages sent" },
    emails: {
      price: 0.005,
      unit: "per email",
      description: "Transactional emails",
    },
    phoneCalls: {
      price: 0.02,
      unit: "per minute",
      description: "Phone call minutes",
    },
    videoCalls: {
      price: 0.05,
      unit: "per minute",
      description: "Video call minutes",
    },
    payments: {
      price: 0.29,
      unit: "per payment",
      description: "Payments collected (+ 2.9%)",
    },
  },
};

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const formSchema = z.object({
  // Step 1: Company Details
  orgName: z.string().min(2, "Organization name must be at least 2 characters"),
  orgIndustry: z.string().min(1, "Please select an industry"),
  orgSize: z.string().min(1, "Please select company size"),
  orgPhone: z.string().min(10, "Valid phone number is required"),
  orgAddress: z.string().min(5, "Business address is required"),
  orgCity: z.string().min(2, "City is required"),
  orgState: z.string().min(2, "State is required"),
  orgZip: z.string().min(5, "ZIP code is required"),
  orgWebsite: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  orgTaxId: z.string().optional(),

  // Step 3: Team Members
  teamMembers: z
    .array(
      z.object({
        email: z.string().email("Invalid email"),
        firstName: z.string().min(1, "First name required"),
        lastName: z.string().min(1, "Last name required"),
        role: z.string().optional(),
      })
    )
    .optional(),

  // Step 4: Billing (payment required)
  paymentMethodId: z.string().optional(), // Stripe payment method
});

export default function WelcomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<
    Array<{ email: string; firstName: string; lastName: string; role?: string }>
  >([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  } | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [savedAddress, setSavedAddress] = useState<{
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [phoneNumberOption, setPhoneNumberOption] = useState<
    "purchase" | "port" | null
  >(null);
  const [purchasingNumber, setPurchasingNumber] = useState(false);
  const [portingNumber, setPortingNumber] = useState(false);
  const [portingSuccess, setPortingSuccess] = useState(false);
  const [portingError, setPortingError] = useState<string | null>(null);
  const [portingValidationErrors, setPortingValidationErrors] = useState<
    Record<string, string>
  >({});

  // Phone number purchase state
  const [areaCode, setAreaCode] = useState("");
  const [numberType, setNumberType] = useState<"local" | "toll-free">("local");
  const [availableNumbers, setAvailableNumbers] = useState<any[]>([]);
  const [searchingNumbers, setSearchingNumbers] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  // Porting state
  const [portingData, setPortingData] = useState({
    phoneNumber: "",
    currentCarrier: "",
    accountNumber: "",
    accountPin: "",
    addressLine1: "",
    city: "",
    state: "",
    zipCode: "",
    authorizedPerson: "",
    authorizedEmail: "",
  });

  // Provider information with links to find account PIN
  const phoneProviders = [
    {
      name: "Verizon",
      value: "verizon",
      pinHelpUrl: "https://www.verizon.com/support/account-pin-faq/",
      accountHelpUrl: "https://www.verizon.com/support/account-number/",
    },
    {
      name: "AT&T",
      value: "att",
      pinHelpUrl: "https://www.att.com/support/article/account-pin/",
      accountHelpUrl: "https://www.att.com/support/article/account-number/",
    },
    {
      name: "T-Mobile",
      value: "tmobile",
      pinHelpUrl: "https://www.t-mobile.com/support/account/account-pin",
      accountHelpUrl: "https://www.t-mobile.com/support/account/account-number",
    },
    {
      name: "Spectrum",
      value: "spectrum",
      pinHelpUrl: "https://www.spectrum.com/support/voice/account-pin",
      accountHelpUrl: "https://www.spectrum.com/support/account/account-number",
    },
    {
      name: "Dialpad",
      value: "dialpad",
      pinHelpUrl: "https://help.dialpad.com/en/articles/porting-your-number",
      accountHelpUrl:
        "https://help.dialpad.com/en/articles/porting-your-number",
    },
    {
      name: "RingCentral",
      value: "ringcentral",
      pinHelpUrl: "https://support.ringcentral.com/article/port-number.html",
      accountHelpUrl:
        "https://support.ringcentral.com/article/port-number.html",
    },
    {
      name: "Other",
      value: "other",
      pinHelpUrl: null,
      accountHelpUrl: null,
    },
  ];

  const [otherCarrierName, setOtherCarrierName] = useState("");
  const selectedProvider = phoneProviders.find(
    (p) => p.value === portingData.currentCarrier.toLowerCase()
  );
  const isOtherCarrier =
    !phoneProviders.some(
      (p) => p.value === portingData.currentCarrier.toLowerCase()
    ) && portingData.currentCarrier !== "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgName: "",
      orgIndustry: "",
      orgSize: "",
      orgPhone: "",
      orgAddress: "",
      orgCity: "",
      orgState: "",
      orgZip: "",
      orgWebsite: "",
      orgTaxId: "",
      teamMembers: [],
    },
  });

  // Load saved company data if active company has incomplete onboarding
  // Check if company is already fully set up - redirect away if so
  useEffect(() => {
    fetch("/api/check-onboarding-status")
      .then((res) => res.json())
      .then((data) => {
        // If company is fully set up (has payment), redirect to dashboard
        if (data.companyId && data.hasPayment) {
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        console.error("Error checking onboarding status:", error);
        // Don't redirect on error - allow user to stay on welcome page
      });
  }, [router]);

  useEffect(() => {
    async function loadSavedCompanyData() {
      try {
        const response = await fetch("/api/get-incomplete-company");
        if (response.ok) {
          const data = await response.json();
          if (data.company) {
            // Pre-fill form with saved company data
            form.setValue("orgName", data.company.name);
            form.setValue("orgIndustry", data.company.industry);
            form.setValue("orgSize", data.company.size);
            form.setValue("orgPhone", data.company.phone);
            form.setValue("orgAddress", data.company.address);
            form.setValue("orgCity", data.company.city);
            form.setValue("orgState", data.company.state);
            form.setValue("orgZip", data.company.zipCode);

            // Set saved address for SmartAddressInput component
            setSavedAddress({
              address: data.company.address,
              city: data.company.city,
              state: data.company.state,
              zipCode: data.company.zipCode,
              country: "USA",
            });
            form.setValue("orgWebsite", data.company.website);
            form.setValue("orgTaxId", data.company.taxId);

            // Set company ID so we know we're updating, not creating
            setCompanyId(data.company.id);

            // Load logo if exists
            if (data.company.logo) {
              setLogoPreview(data.company.logo);
            }

            // Load saved progress for other steps
            if (data.company.onboardingProgress) {
              const progress = data.company.onboardingProgress;

              // Load step 2 (team members) if saved
              if (progress.step2 && progress.step2.teamMembers) {
                setTeamMembers(
                  progress.step2.teamMembers as typeof teamMembers
                );
              }

              // Load step 3 (phone number) if saved
              if (progress.step3) {
                const step3Data = progress.step3 as Record<string, unknown>;
                if (
                  step3Data.option === "purchase" &&
                  step3Data.selectedNumber
                ) {
                  setPhoneNumberOption("purchase");
                  setSelectedNumber(step3Data.selectedNumber as string);
                } else if (
                  step3Data.option === "port" &&
                  step3Data.portingData
                ) {
                  setPhoneNumberOption("port");
                  setPortingData(step3Data.portingData as typeof portingData);
                }
              }

              // Load step 4 (notifications) if saved
              // Add notification state loading here when implemented

              // Set current step based on saved progress
              const savedStep = progress.currentStep || 2;
              setCurrentStep(savedStep as Step);
            } else {
              // Since step 1 is complete, advance to step 2
              setCurrentStep(2);
            }
          }
        }
      } catch (error) {
        console.error("Error loading saved company data:", error);
      }
    }
    loadSavedCompanyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Fetch user info on mount for phone auto-fill
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch("/api/get-current-user-info");
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
          // Auto-fill phone if available and not already set
          if (data.phone && !form.getValues("orgPhone")) {
            form.setValue("orgPhone", data.phone);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
    fetchUserInfo();
  }, [form]);

  const handleArchiveCompany = async () => {
    if (!companyId) return;

    setIsLoading(true);
    try {
      const result = await archiveIncompleteCompany(companyId);
      if (result.success) {
        toast.success(
          "Company archived. You can restore it later from Settings > Archive."
        );

        // Check if user has other companies
        const response = await fetch("/api/get-user-companies");
        if (response.ok) {
          const companies = await response.json();

          if (companies && companies.length > 0) {
            // User has other companies - switch to the first one and go to dashboard
            const { switchCompany } = await import("@/actions/company-context");
            const result = await switchCompany(companies[0].id);
            if (result.success) {
              router.push("/dashboard");
            } else {
              toast.error("Failed to switch company");
            }
          } else {
            // No other companies - reset form and stay on welcome page to create new one
            form.reset();
            setCompanyId(null);
            setLogoPreview(null);
            setLogoFile(null);
            setSavedAddress(null);
            setCurrentStep(1);
            router.refresh();
          }
        } else {
          // Fallback: reset form and stay on welcome page
          form.reset();
          setCompanyId(null);
          setLogoPreview(null);
          setLogoFile(null);
          setSavedAddress(null);
          setCurrentStep(1);
          router.refresh();
        }
      } else {
        toast.error(result.error || "Failed to archive company");
      }
    } catch (error) {
      console.error("Error archiving company:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await form.trigger([
        "orgName",
        "orgIndustry",
        "orgSize",
        "orgPhone",
        "orgAddress",
        "orgCity",
        "orgState",
        "orgZip",
      ]);

      // If valid, save progress (create company with logo)
      if (isValid) {
        setIsLoading(true);
        try {
          const formData = new FormData();
          formData.append("orgName", form.getValues("orgName"));
          formData.append("orgIndustry", form.getValues("orgIndustry"));
          formData.append("orgSize", form.getValues("orgSize"));
          formData.append("orgPhone", form.getValues("orgPhone"));
          formData.append("orgAddress", form.getValues("orgAddress"));
          formData.append("orgCity", form.getValues("orgCity"));
          formData.append("orgState", form.getValues("orgState"));
          formData.append("orgZip", form.getValues("orgZip"));
          formData.append("orgWebsite", form.getValues("orgWebsite") || "");
          formData.append("orgTaxId", form.getValues("orgTaxId") || "");

          if (logoFile) {
            formData.append("logo", logoFile);
          }

          const result = await saveOnboardingProgress(
            formData,
            companyId || undefined
          );
          if (result.success && result.companyId) {
            setCompanyId(result.companyId);
            // Only show success toast if this is a new company (not updating)
            if (!companyId) {
              toast.success(
                "Company information saved! You can continue later from your company dropdown."
              );
            }
            setCurrentStep(2); // Move to team members step
            // Trigger custom event to refresh company dropdown in real-time
            window.dispatchEvent(new Event("refresh-companies"));
            // Also refresh the page to update all server components
            router.refresh();
          } else {
            console.error("Failed to save company:", result.error);
            // If company not found or archived, reset state
            if (
              result.error?.includes("Company not found") ||
              result.error?.includes("archived")
            ) {
              setCompanyId(null);
              setCurrentStep(1);
              toast.error("Company not found. Please try again.");
            } else {
              toast.error(result.error || "Failed to save company information");
            }
          }
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : "An unexpected error occurred"
          );
        } finally {
          setIsLoading(false);
        }
        return; // Don't advance step here, wait for save to complete
      }
    } else if (currentStep === 2) {
      // Team members are optional, so always valid
      // Save progress before advancing
      if (!companyId) {
        toast.error("Company not found. Please go back and complete step 1.");
        return;
      }

      setIsLoading(true);
      try {
        const result = await saveOnboardingStepProgress(companyId, 2, {
          teamMembers: teamMembers.filter(
            (m) => m.email || m.firstName || m.lastName
          ),
        });
        if (result.success) {
          setCurrentStep(3);
        } else {
          console.error("Failed to save step 2:", result.error);
          // If company not found, reset and go back to step 1
          if (result.error?.includes("Company not found")) {
            setCompanyId(null);
            setCurrentStep(1);
            toast.error("Company not found. Please complete step 1 again.");
          } else {
            toast.error(result.error || "Failed to save progress");
          }
        }
      } catch (err) {
        console.error("Error saving step 2:", err);
        toast.error("Failed to save progress");
      } finally {
        setIsLoading(false);
      }
      return;
    } else if (currentStep === 3) {
      // Phone number step - save progress before advancing
      if (!companyId) {
        toast.error("Company not found. Please go back and complete step 1.");
        return;
      }

      setIsLoading(true);
      try {
        const phoneData: Record<string, unknown> = {};
        if (phoneNumberOption === "purchase" && selectedNumber) {
          phoneData.option = "purchase";
          phoneData.selectedNumber = selectedNumber;
        } else if (phoneNumberOption === "port" && portingData.phoneNumber) {
          phoneData.option = "port";
          phoneData.portingData = portingData;
        } else {
          phoneData.option = "skip";
        }

        const result = await saveOnboardingStepProgress(
          companyId,
          3,
          phoneData
        );
        if (result.success) {
          setCurrentStep(4);
        } else {
          console.error("Failed to save step 3:", result.error);
          // If company not found, reset and go back to step 1
          if (result.error?.includes("Company not found")) {
            setCompanyId(null);
            setCurrentStep(1);
            toast.error("Company not found. Please complete step 1 again.");
          } else {
            toast.error(result.error || "Failed to save progress");
          }
        }
      } catch (err) {
        console.error("Error saving step 3:", err);
        toast.error("Failed to save progress");
      } finally {
        setIsLoading(false);
      }
      return;
    } else if (currentStep === 4) {
      // Notification settings - save progress before advancing
      if (!companyId) {
        toast.error("Company not found. Please go back and complete step 1.");
        return;
      }

      setIsLoading(true);
      try {
        // Get notification settings from form/switches (you'll need to add state for these)
        const notificationData = {
          // Add notification settings here when implemented
          saved: true,
        };

        const result = await saveOnboardingStepProgress(
          companyId,
          4,
          notificationData
        );
        if (result.success) {
          setCurrentStep(5);
        } else {
          console.error("Failed to save step 4:", result.error);
          // If company not found, reset and go back to step 1
          if (result.error?.includes("Company not found")) {
            setCompanyId(null);
            setCurrentStep(1);
            toast.error("Company not found. Please complete step 1 again.");
          } else {
            toast.error(result.error || "Failed to save progress");
          }
        }
      } catch (err) {
        console.error("Error saving step 4:", err);
        toast.error("Failed to save progress");
      } finally {
        setIsLoading(false);
      }
      return;
    } else if (currentStep === 5) {
      // Payment step - will be handled in submit
      isValid = true;
    }

    if (isValid && currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep === 3 && phoneNumberOption) {
      // If in phone number sub-step, go back to selection screen
      setPhoneNumberOption(null);
      setAvailableNumbers([]);
      setSelectedNumber(null);
      setPurchaseError(null);
      setPortingData({
        phoneNumber: "",
        currentCarrier: "",
        accountNumber: "",
        accountPin: "",
        addressLine1: "",
        city: "",
        state: "",
        zipCode: "",
        authorizedPerson: "",
        authorizedEmail: "",
      });
      setPortingError(null);
      setPortingValidationErrors({});
      setPortingSuccess(false);
    } else if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const addTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      { email: "", firstName: "", lastName: "", role: "" },
    ]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handlePayment = async () => {
    if (!companyId) {
      toast.error(
        "Company not created. Please go back and complete previous steps."
      );
      return;
    }

    setIsLoading(true);
    try {
      // If a phone number was selected, save it to be purchased after payment
      if (selectedNumber && phoneNumberOption === "purchase") {
        // Store the selected number in the company metadata or pass it to checkout
        // For now, we'll handle it after payment via webhook or return URL
        // The number will be purchased when payment is confirmed
      }

      const siteUrl = window.location.origin;
      const result = await createOrganizationCheckoutSession(
        companyId,
        `${siteUrl}/dashboard?onboarding=complete`,
        `${siteUrl}/dashboard/welcome`,
        phoneNumberOption === "purchase"
          ? selectedNumber || undefined
          : undefined
      );

      if (result.success && result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url;
      } else {
        toast.error(result.error || "Failed to create payment session");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment setup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8 flex items-center justify-center gap-2">
      {[1, 2, 3, 4, 5, 6].map((step) => (
        <div className="flex items-center" key={step}>
          <div
            className={`flex size-10 items-center justify-center rounded-full font-semibold text-sm transition-all ${
              currentStep >= step
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > step ? <Check className="size-5" /> : step}
          </div>
          {step < 6 && (
            <div
              className={`mx-2 h-0.5 w-12 transition-colors ${
                currentStep > step ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const handleStep2Submit = () => {
    handleNext();
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Onboarding Header */}
      <OnboardingHeader />

      <div className="container mx-auto max-w-4xl flex-1 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-bold text-3xl tracking-tight">
            Welcome to Thorbis
          </h1>
          <p className="text-lg text-muted-foreground">
            Let's set up your organization in just a few steps
          </p>
        </div>

        {renderStepIndicator()}

        <Card>
          <CardContent className="p-6 sm:p-8">
            <Form {...form}>
              <form className="space-y-6">
                {/* Step 1: Company Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="size-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-xl">
                          Company Information
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          Tell us about your business
                        </p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="orgName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Acme HVAC Services"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Company Logo Upload */}
                    <div className="space-y-2">
                      <FormLabel>Company Logo (Optional)</FormLabel>
                      <div className="flex items-center gap-4">
                        {logoPreview ? (
                          <div className="relative">
                            <img
                              alt="Logo preview"
                              className="size-20 rounded-lg border object-cover"
                              src={logoPreview}
                            />
                            <Button
                              className="-right-2 -top-2 absolute size-6 rounded-full p-0"
                              onClick={() => {
                                setLogoFile(null);
                                setLogoPreview(null);
                              }}
                              size="icon"
                              type="button"
                              variant="destructive"
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <div className="flex size-20 items-center justify-center rounded-lg border border-dashed">
                            <Building2 className="size-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <Input
                            accept="image/*"
                            className="cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setLogoFile(file);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setLogoPreview(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            type="file"
                          />
                          <FormDescription>
                            Upload your company logo (max 5MB). This will appear
                            on invoices and customer communications.
                          </FormDescription>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="orgIndustry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry *</FormLabel>
                            <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {INDUSTRIES.map((industry) => (
                                  <SelectItem
                                    key={industry.value}
                                    value={industry.value}
                                  >
                                    {industry.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="orgSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Size *</FormLabel>
                            <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {COMPANY_SIZES.map((size) => (
                                  <SelectItem
                                    key={size.value}
                                    value={size.value}
                                  >
                                    {size.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="orgPhone"
                      render={({ field }) => {
                        const isAutoFilled =
                          userInfo?.phone && field.value === userInfo.phone;
                        return (
                          <FormItem>
                            <FormLabel>Business Phone *</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                {isAutoFilled && (
                                  <div className="flex items-center gap-2 text-primary text-xs">
                                    <Sparkles className="size-3" />
                                    <span>Auto-filled from your profile</span>
                                  </div>
                                )}
                                <Input
                                  placeholder="+1 (555) 123-4567"
                                  type="tel"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              {isAutoFilled
                                ? "Pre-filled with your phone number. You can change it if needed."
                                : "This will be displayed on invoices and estimates"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    {/* Address Autocomplete - SmartAddressInput handles all address fields */}
                    <div className="space-y-2">
                      <FormLabel>Business Address *</FormLabel>
                      <SmartAddressInput
                        initialAddress={
                          savedAddress || {
                            address: form.getValues("orgAddress") || "",
                            city: form.getValues("orgCity") || "",
                            state: form.getValues("orgState") || "",
                            zipCode: form.getValues("orgZip") || "",
                            country: "USA",
                          }
                        } // Force re-render when companyId changes
                        key={companyId || "new"}
                        label=""
                        onAddressChange={(addressData) => {
                          // Update all address fields when autocomplete fills them
                          form.setValue("orgAddress", addressData.address, {
                            shouldValidate: true,
                          });
                          form.setValue("orgCity", addressData.city, {
                            shouldValidate: true,
                          });
                          form.setValue("orgState", addressData.state, {
                            shouldValidate: true,
                          });
                          form.setValue("orgZip", addressData.zipCode, {
                            shouldValidate: true,
                          });
                        }}
                        required
                      />
                      <FormDescription>
                        Start typing to search for your address, or enter
                        manually
                      </FormDescription>
                      {/* Show validation errors for address fields */}
                      {form.formState.errors.orgAddress && (
                        <p className="font-medium text-destructive text-sm">
                          {form.formState.errors.orgAddress.message}
                        </p>
                      )}
                      {form.formState.errors.orgCity && (
                        <p className="font-medium text-destructive text-sm">
                          {form.formState.errors.orgCity.message}
                        </p>
                      )}
                      {form.formState.errors.orgState && (
                        <p className="font-medium text-destructive text-sm">
                          {form.formState.errors.orgState.message}
                        </p>
                      )}
                      {form.formState.errors.orgZip && (
                        <p className="font-medium text-destructive text-sm">
                          {form.formState.errors.orgZip.message}
                        </p>
                      )}
                    </div>

                    {/* Hidden fields for form submission - populated by SmartAddressInput */}
                    <FormField
                      control={form.control}
                      name="orgAddress"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input type="hidden" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orgCity"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input type="hidden" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orgState"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input type="hidden" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orgZip"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input type="hidden" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="orgWebsite"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com"
                                type="url"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="orgTaxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax ID / EIN</FormLabel>
                            <FormControl>
                              <Input placeholder="12-3456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Team Members */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="size-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-xl">Team Members</h2>
                        <p className="text-muted-foreground text-sm">
                          Invite your team (optional - you can add more later)
                        </p>
                      </div>
                    </div>

                    {teamMembers.map((member, index) => (
                      <Card className="p-4" key={index}>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Input
                            onChange={(e) =>
                              updateTeamMember(
                                index,
                                "firstName",
                                e.target.value
                              )
                            }
                            placeholder="First Name"
                            value={member.firstName}
                          />
                          <Input
                            onChange={(e) =>
                              updateTeamMember(
                                index,
                                "lastName",
                                e.target.value
                              )
                            }
                            placeholder="Last Name"
                            value={member.lastName}
                          />
                          <Input
                            onChange={(e) =>
                              updateTeamMember(index, "email", e.target.value)
                            }
                            placeholder="Email"
                            type="email"
                            value={member.email}
                          />
                          <div className="flex gap-2">
                            <Input
                              onChange={(e) =>
                                updateTeamMember(index, "role", e.target.value)
                              }
                              placeholder="Role (optional)"
                              value={member.role || ""}
                            />
                            <Button
                              onClick={() => removeTeamMember(index)}
                              size="icon"
                              type="button"
                              variant="outline"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Button
                      className="w-full"
                      onClick={addTeamMember}
                      type="button"
                      variant="outline"
                    >
                      <UserPlus className="mr-2 size-4" />
                      Add Team Member
                    </Button>
                  </div>
                )}

                {/* Step 3: Phone Number Setup */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                        <Phone className="size-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-xl">
                          Phone Number Setup{" "}
                          <span className="font-normal text-base text-muted-foreground">
                            (Optional)
                          </span>
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          Set up a phone number for your business
                          communications. You can configure this later in
                          settings.
                        </p>
                      </div>
                    </div>

                    {phoneNumberOption ? (
                      phoneNumberOption === "purchase" ? (
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Purchase New Number
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Select a phone number for your business
                            </p>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Area Code (optional)</Label>
                              <Input
                                maxLength={3}
                                onChange={(e) => setAreaCode(e.target.value)}
                                placeholder="831"
                                value={areaCode}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Number Type</Label>
                              <Select
                                onValueChange={(v: "local" | "toll-free") =>
                                  setNumberType(v)
                                }
                                value={numberType}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="local">Local</SelectItem>
                                  <SelectItem value="toll-free">
                                    Toll-Free
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <Button
                            className="w-full"
                            disabled={searchingNumbers}
                            onClick={async () => {
                              setSearchingNumbers(true);
                              setPurchaseError(null);
                              try {
                                const result = await searchPhoneNumbers({
                                  areaCode: areaCode || undefined,
                                  numberType,
                                  features: ["voice", "sms"],
                                  limit: 10,
                                });
                                if (result.success && result.data) {
                                  setAvailableNumbers(result.data);
                                  if (result.data.length === 0) {
                                    setPurchaseError(
                                      "No numbers found. Try a different area code or number type."
                                    );
                                  }
                                } else {
                                  setPurchaseError(
                                    result.error ||
                                      "Failed to search numbers. Please try again."
                                  );
                                  setAvailableNumbers([]);
                                }
                              } catch (error) {
                                setPurchaseError(
                                  "Failed to search numbers. Please try again."
                                );
                                setAvailableNumbers([]);
                              } finally {
                                setSearchingNumbers(false);
                              }
                            }}
                            type="button"
                          >
                            {searchingNumbers ? (
                              <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Searching available numbers...
                              </>
                            ) : (
                              <>
                                <Search className="mr-2 size-4" />
                                Search Available Numbers
                              </>
                            )}
                          </Button>

                          {purchaseError && (
                            <Alert variant="destructive">
                              <AlertCircle className="size-4" />
                              <AlertDescription>
                                {purchaseError}
                              </AlertDescription>
                            </Alert>
                          )}

                          {availableNumbers.length > 0 && (
                            <div className="space-y-3">
                              <Label className="font-semibold text-base">
                                Available Numbers
                              </Label>
                              <div className="grid gap-3">
                                {availableNumbers.map((num: any) => (
                                  <Card
                                    className={`cursor-pointer transition-all ${
                                      selectedNumber === num.phone_number
                                        ? "border-primary bg-primary/5 shadow-md"
                                        : "hover:border-primary/50 hover:shadow-sm"
                                    }`}
                                    key={num.phone_number}
                                    onClick={() => {
                                      setSelectedNumber(num.phone_number);
                                      setPurchaseError(null);
                                    }}
                                  >
                                    <CardContent className="flex items-center justify-between p-4">
                                      <div className="flex items-center gap-3">
                                        {selectedNumber === num.phone_number ? (
                                          <CheckCircle className="size-5 text-primary" />
                                        ) : (
                                          <div className="size-5 rounded-full border-2 border-muted-foreground/30" />
                                        )}
                                        <div>
                                          <div className="font-semibold text-lg">
                                            {num.phone_number}
                                          </div>
                                          <div className="text-muted-foreground text-sm">
                                            ${num.monthly_cost || "2.00"}/month
                                            • Includes voice & SMS
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedNumber && (
                            <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
                              <CheckCircle className="size-4 text-green-600 dark:text-green-400" />
                              <AlertDescription className="text-green-800 dark:text-green-200">
                                <strong>Number selected:</strong>{" "}
                                {selectedNumber} will be purchased automatically
                                when you complete payment.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {portingSuccess ? (
                            <div className="space-y-6 text-center">
                              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <h3 className="mb-2 font-semibold text-xl">
                                  Port Request Submitted!
                                </h3>
                                <p className="text-muted-foreground">
                                  Your request to port{" "}
                                  <strong>{portingData.phoneNumber}</strong> has
                                  been successfully submitted.
                                </p>
                              </div>
                              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
                                <Info className="size-4 text-blue-600 dark:text-blue-400" />
                                <AlertDescription className="text-blue-800 dark:text-blue-200">
                                  <strong>What happens next:</strong> We'll
                                  process your request and coordinate with your
                                  current carrier. Porting typically takes 7-10
                                  business days. You'll receive email updates at{" "}
                                  {portingData.authorizedEmail}.
                                </AlertDescription>
                              </Alert>
                            </div>
                          ) : (
                            <>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  Port Existing Number
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  Transfer your current business number to
                                  Thorbis
                                </p>
                              </div>

                              <Alert>
                                <Info className="size-4" />
                                <AlertDescription>
                                  <strong>Important:</strong> Keep your current
                                  service active until the port is complete
                                  (7-10 business days). All information must
                                  match your current carrier's records exactly,
                                  or the port may be rejected.
                                </AlertDescription>
                              </Alert>

                              {portingError && (
                                <Alert variant="destructive">
                                  <AlertCircle className="size-4" />
                                  <AlertDescription>
                                    {portingError}
                                  </AlertDescription>
                                </Alert>
                              )}

                              <div className="space-y-6">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-base">
                                      Phone Number & Carrier Information
                                    </CardTitle>
                                    <CardDescription>
                                      Details about the number you want to port
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="porting-phone">
                                        Phone Number to Port *
                                      </Label>
                                      <Input
                                        className={
                                          portingValidationErrors.phoneNumber
                                            ? "border-destructive"
                                            : ""
                                        }
                                        id="porting-phone"
                                        onChange={(e) => {
                                          setPortingData({
                                            ...portingData,
                                            phoneNumber: e.target.value,
                                          });
                                          if (
                                            portingValidationErrors.phoneNumber
                                          ) {
                                            setPortingValidationErrors({
                                              ...portingValidationErrors,
                                              phoneNumber: "",
                                            });
                                          }
                                        }}
                                        placeholder="(831) 430-6011"
                                        value={portingData.phoneNumber}
                                      />
                                      {portingValidationErrors.phoneNumber && (
                                        <p className="text-destructive text-sm">
                                          {portingValidationErrors.phoneNumber}
                                        </p>
                                      )}
                                      <p className="text-muted-foreground text-xs">
                                        Enter the full phone number including
                                        area code
                                      </p>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="porting-carrier">
                                        Current Carrier/Provider *
                                      </Label>
                                      <Select
                                        onValueChange={(value) => {
                                          if (value === "other") {
                                            setPortingData({
                                              ...portingData,
                                              currentCarrier: otherCarrierName,
                                            });
                                          } else {
                                            setPortingData({
                                              ...portingData,
                                              currentCarrier: value,
                                            });
                                            setOtherCarrierName("");
                                          }
                                          if (
                                            portingValidationErrors.currentCarrier
                                          ) {
                                            setPortingValidationErrors({
                                              ...portingValidationErrors,
                                              currentCarrier: "",
                                            });
                                          }
                                        }}
                                        value={
                                          phoneProviders.some(
                                            (p) =>
                                              p.value ===
                                              portingData.currentCarrier.toLowerCase()
                                          )
                                            ? portingData.currentCarrier.toLowerCase()
                                            : isOtherCarrier
                                              ? "other"
                                              : ""
                                        }
                                      >
                                        <SelectTrigger
                                          className={
                                            portingValidationErrors.currentCarrier
                                              ? "border-destructive"
                                              : ""
                                          }
                                          id="porting-carrier"
                                        >
                                          <SelectValue placeholder="Select your carrier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {phoneProviders.map((provider) => (
                                            <SelectItem
                                              key={provider.value}
                                              value={provider.value}
                                            >
                                              {provider.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      {portingValidationErrors.currentCarrier && (
                                        <p className="text-destructive text-sm">
                                          {
                                            portingValidationErrors.currentCarrier
                                          }
                                        </p>
                                      )}
                                      {selectedProvider &&
                                        selectedProvider.value !== "other" && (
                                          <div className="flex flex-wrap gap-2 text-xs">
                                            {selectedProvider.pinHelpUrl && (
                                              <a
                                                className="flex items-center gap-1 text-primary hover:underline"
                                                href={
                                                  selectedProvider.pinHelpUrl
                                                }
                                                rel="noopener noreferrer"
                                                target="_blank"
                                              >
                                                Find Account PIN
                                                <ExternalLink className="size-3" />
                                              </a>
                                            )}
                                            {selectedProvider.accountHelpUrl && (
                                              <>
                                                <span className="text-muted-foreground">
                                                  •
                                                </span>
                                                <a
                                                  className="flex items-center gap-1 text-primary hover:underline"
                                                  href={
                                                    selectedProvider.accountHelpUrl
                                                  }
                                                  rel="noopener noreferrer"
                                                  target="_blank"
                                                >
                                                  Find Account Number
                                                  <ExternalLink className="size-3" />
                                                </a>
                                              </>
                                            )}
                                          </div>
                                        )}
                                      {isOtherCarrier && (
                                        <Input
                                          className={
                                            portingValidationErrors.currentCarrier
                                              ? "border-destructive"
                                              : ""
                                          }
                                          onChange={(e) => {
                                            setPortingData({
                                              ...portingData,
                                              currentCarrier: e.target.value,
                                            });
                                            setOtherCarrierName(e.target.value);
                                            if (
                                              portingValidationErrors.currentCarrier
                                            ) {
                                              setPortingValidationErrors({
                                                ...portingValidationErrors,
                                                currentCarrier: "",
                                              });
                                            }
                                          }}
                                          placeholder="Enter carrier name"
                                          value={portingData.currentCarrier}
                                        />
                                      )}
                                      <p className="text-muted-foreground text-xs">
                                        Select your current phone service
                                        provider
                                      </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                      <div className="space-y-2">
                                        <Label htmlFor="porting-account">
                                          Account Number *
                                        </Label>
                                        <Input
                                          className={
                                            portingValidationErrors.accountNumber
                                              ? "border-destructive"
                                              : ""
                                          }
                                          id="porting-account"
                                          onChange={(e) => {
                                            setPortingData({
                                              ...portingData,
                                              accountNumber: e.target.value,
                                            });
                                            if (
                                              portingValidationErrors.accountNumber
                                            ) {
                                              setPortingValidationErrors({
                                                ...portingValidationErrors,
                                                accountNumber: "",
                                              });
                                            }
                                          }}
                                          placeholder="Usually 10-15 digits"
                                          value={portingData.accountNumber}
                                        />
                                        {portingValidationErrors.accountNumber && (
                                          <p className="text-destructive text-sm">
                                            {
                                              portingValidationErrors.accountNumber
                                            }
                                          </p>
                                        )}
                                        <p className="text-muted-foreground text-xs">
                                          Found on your bill - NOT your phone
                                          number
                                        </p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="porting-pin">
                                          Account PIN/Password *
                                        </Label>
                                        <Input
                                          className={
                                            portingValidationErrors.accountPin
                                              ? "border-destructive"
                                              : ""
                                          }
                                          id="porting-pin"
                                          onChange={(e) => {
                                            setPortingData({
                                              ...portingData,
                                              accountPin: e.target.value,
                                            });
                                            if (
                                              portingValidationErrors.accountPin
                                            ) {
                                              setPortingValidationErrors({
                                                ...portingValidationErrors,
                                                accountPin: "",
                                              });
                                            }
                                          }}
                                          placeholder="4-8 digits typically"
                                          type="password"
                                          value={portingData.accountPin}
                                        />
                                        {portingValidationErrors.accountPin && (
                                          <p className="text-destructive text-sm">
                                            {portingValidationErrors.accountPin}
                                          </p>
                                        )}
                                        <p className="text-muted-foreground text-xs">
                                          Set when you opened the account - call
                                          carrier if unknown
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-base">
                                      Service Address
                                    </CardTitle>
                                    <CardDescription>
                                      Must match billing address on file with
                                      your carrier exactly
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <Alert
                                      className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20"
                                      variant="default"
                                    >
                                      <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
                                      <AlertDescription className="text-amber-800 text-sm dark:text-amber-200">
                                        <strong>Critical:</strong> Address must
                                        match exactly as shown on your bill.
                                        Even small differences (like "St" vs
                                        "Street") will cause rejection.
                                      </AlertDescription>
                                    </Alert>

                                    <div className="space-y-2">
                                      <Label htmlFor="porting-address">
                                        Street Address *
                                      </Label>
                                      <Input
                                        className={
                                          portingValidationErrors.addressLine1
                                            ? "border-destructive"
                                            : ""
                                        }
                                        id="porting-address"
                                        onChange={(e) => {
                                          setPortingData({
                                            ...portingData,
                                            addressLine1: e.target.value,
                                          });
                                          if (
                                            portingValidationErrors.addressLine1
                                          ) {
                                            setPortingValidationErrors({
                                              ...portingValidationErrors,
                                              addressLine1: "",
                                            });
                                          }
                                        }}
                                        placeholder="123 Main Street"
                                        value={portingData.addressLine1}
                                      />
                                      {portingValidationErrors.addressLine1 && (
                                        <p className="text-destructive text-sm">
                                          {portingValidationErrors.addressLine1}
                                        </p>
                                      )}
                                      <p className="text-muted-foreground text-xs">
                                        Match the format on your bill exactly
                                        (including abbreviations)
                                      </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-3">
                                      <div className="space-y-2">
                                        <Label htmlFor="porting-city">
                                          City *
                                        </Label>
                                        <Input
                                          className={
                                            portingValidationErrors.city
                                              ? "border-destructive"
                                              : ""
                                          }
                                          id="porting-city"
                                          onChange={(e) => {
                                            setPortingData({
                                              ...portingData,
                                              city: e.target.value,
                                            });
                                            if (portingValidationErrors.city) {
                                              setPortingValidationErrors({
                                                ...portingValidationErrors,
                                                city: "",
                                              });
                                            }
                                          }}
                                          placeholder="Monterey"
                                          value={portingData.city}
                                        />
                                        {portingValidationErrors.city && (
                                          <p className="text-destructive text-sm">
                                            {portingValidationErrors.city}
                                          </p>
                                        )}
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="porting-state">
                                          State *
                                        </Label>
                                        <Input
                                          className={
                                            portingValidationErrors.state
                                              ? "border-destructive"
                                              : ""
                                          }
                                          id="porting-state"
                                          maxLength={2}
                                          onChange={(e) => {
                                            setPortingData({
                                              ...portingData,
                                              state:
                                                e.target.value.toUpperCase(),
                                            });
                                            if (portingValidationErrors.state) {
                                              setPortingValidationErrors({
                                                ...portingValidationErrors,
                                                state: "",
                                              });
                                            }
                                          }}
                                          placeholder="CA"
                                          value={portingData.state}
                                        />
                                        {portingValidationErrors.state && (
                                          <p className="text-destructive text-sm">
                                            {portingValidationErrors.state}
                                          </p>
                                        )}
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="porting-zip">
                                          ZIP Code *
                                        </Label>
                                        <Input
                                          className={
                                            portingValidationErrors.zipCode
                                              ? "border-destructive"
                                              : ""
                                          }
                                          id="porting-zip"
                                          maxLength={10}
                                          onChange={(e) => {
                                            setPortingData({
                                              ...portingData,
                                              zipCode: e.target.value,
                                            });
                                            if (
                                              portingValidationErrors.zipCode
                                            ) {
                                              setPortingValidationErrors({
                                                ...portingValidationErrors,
                                                zipCode: "",
                                              });
                                            }
                                          }}
                                          placeholder="93940"
                                          value={portingData.zipCode}
                                        />
                                        {portingValidationErrors.zipCode && (
                                          <p className="text-destructive text-sm">
                                            {portingValidationErrors.zipCode}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-base">
                                      Authorized Person
                                    </CardTitle>
                                    <CardDescription>
                                      Account holder information for
                                      authorization
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                      <div className="space-y-2">
                                        <Label htmlFor="porting-person">
                                          Full Name of Account Holder *
                                        </Label>
                                        <Input
                                          className={
                                            portingValidationErrors.authorizedPerson
                                              ? "border-destructive"
                                              : ""
                                          }
                                          id="porting-person"
                                          onChange={(e) => {
                                            setPortingData({
                                              ...portingData,
                                              authorizedPerson: e.target.value,
                                            });
                                            if (
                                              portingValidationErrors.authorizedPerson
                                            ) {
                                              setPortingValidationErrors({
                                                ...portingValidationErrors,
                                                authorizedPerson: "",
                                              });
                                            }
                                          }}
                                          placeholder="John Smith"
                                          value={portingData.authorizedPerson}
                                        />
                                        {portingValidationErrors.authorizedPerson && (
                                          <p className="text-destructive text-sm">
                                            {
                                              portingValidationErrors.authorizedPerson
                                            }
                                          </p>
                                        )}
                                        <p className="text-muted-foreground text-xs">
                                          Must match the name on the account
                                          with your current carrier
                                        </p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="porting-email">
                                          Email Address *
                                        </Label>
                                        <Input
                                          className={
                                            portingValidationErrors.authorizedEmail
                                              ? "border-destructive"
                                              : ""
                                          }
                                          id="porting-email"
                                          onChange={(e) => {
                                            setPortingData({
                                              ...portingData,
                                              authorizedEmail: e.target.value,
                                            });
                                            if (
                                              portingValidationErrors.authorizedEmail
                                            ) {
                                              setPortingValidationErrors({
                                                ...portingValidationErrors,
                                                authorizedEmail: "",
                                              });
                                            }
                                          }}
                                          placeholder="john@example.com"
                                          type="email"
                                          value={portingData.authorizedEmail}
                                        />
                                        {portingValidationErrors.authorizedEmail && (
                                          <p className="text-destructive text-sm">
                                            {
                                              portingValidationErrors.authorizedEmail
                                            }
                                          </p>
                                        )}
                                        <p className="text-muted-foreground text-xs">
                                          We'll send porting status updates to
                                          this email
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Alert>
                                  <Info className="size-4" />
                                  <AlertDescription>
                                    <strong>Timeline:</strong> Porting typically
                                    takes 7-10 business days. You'll receive
                                    email updates at each stage. Keep your
                                    current service active until the port is
                                    complete.
                                  </AlertDescription>
                                </Alert>

                                {/* Documentation & FAQ */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                      <HelpCircle className="size-4" />
                                      Help & Documentation
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                      <h4 className="font-semibold text-sm">
                                        Documentation
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        <a
                                          className="flex items-center gap-1 text-primary text-sm hover:underline"
                                          href="https://developers.telnyx.com/docs/v2/numbers/porting"
                                          rel="noopener noreferrer"
                                          target="_blank"
                                        >
                                          Telnyx Porting Guide
                                          <ExternalLink className="size-3" />
                                        </a>
                                        <span className="text-muted-foreground">
                                          •
                                        </span>
                                        <a
                                          className="flex items-center gap-1 text-primary text-sm hover:underline"
                                          href="https://support.telnyx.com/en/articles/porting-your-number"
                                          rel="noopener noreferrer"
                                          target="_blank"
                                        >
                                          Porting FAQ
                                          <ExternalLink className="size-3" />
                                        </a>
                                      </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                      <h4 className="font-semibold text-sm">
                                        Frequently Asked Questions
                                      </h4>
                                      <Accordion
                                        className="w-full"
                                        collapsible
                                        type="single"
                                      >
                                        <AccordionItem value="faq-1">
                                          <AccordionTrigger className="py-2 text-sm">
                                            How long does porting take?
                                          </AccordionTrigger>
                                          <AccordionContent className="text-muted-foreground text-sm">
                                            Porting typically takes 7-10
                                            business days. The exact timeline
                                            depends on your current carrier's
                                            processing time. You'll receive
                                            email updates at each stage of the
                                            process.
                                          </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="faq-2">
                                          <AccordionTrigger className="py-2 text-sm">
                                            What if I don't know my account PIN?
                                          </AccordionTrigger>
                                          <AccordionContent className="text-muted-foreground text-sm">
                                            If you selected your carrier above,
                                            use the "Find Account PIN" link.
                                            Otherwise, contact your current
                                            carrier's customer service. They can
                                            help you retrieve or reset your PIN.
                                            This is required for porting
                                            authorization.
                                          </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="faq-3">
                                          <AccordionTrigger className="py-2 text-sm">
                                            Why does my address need to match
                                            exactly?
                                          </AccordionTrigger>
                                          <AccordionContent className="text-muted-foreground text-sm">
                                            Carriers verify porting requests by
                                            matching information exactly as it
                                            appears on your account. Even small
                                            differences (like "St" vs "Street")
                                            can cause rejection. Check your most
                                            recent bill for the exact format.
                                          </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="faq-4">
                                          <AccordionTrigger className="py-2 text-sm">
                                            Can I cancel my current service
                                            before porting?
                                          </AccordionTrigger>
                                          <AccordionContent className="text-muted-foreground text-sm">
                                            No. You must keep your current
                                            service active until the port is
                                            complete. Canceling before the port
                                            completes will cause the port to
                                            fail and you may lose your number.
                                          </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="faq-5">
                                          <AccordionTrigger className="py-2 text-sm">
                                            What happens if my port is rejected?
                                          </AccordionTrigger>
                                          <AccordionContent className="text-muted-foreground text-sm">
                                            If your port is rejected, we'll
                                            notify you via email with the
                                            reason. Common reasons include
                                            incorrect account information or
                                            address mismatch. You can correct
                                            the information and resubmit the
                                            request.
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </>
                          )}
                        </div>
                      )
                    ) : (
                      <>
                        <Alert>
                          <Info className="size-4" />
                          <AlertDescription>
                            Choose to purchase a new number for $2/month or port
                            your existing business number. This step is optional
                            and can be completed later in Settings →
                            Communications.
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                          <Card
                            className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                            onClick={() => setPhoneNumberOption("purchase")}
                          >
                            <CardContent className="flex items-center gap-4 p-6">
                              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                                <Phone className="size-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="mb-1 text-lg">
                                  Purchase New Number
                                </CardTitle>
                                <CardDescription>
                                  Get a new local or toll-free number for
                                  $2/month. Includes voice and SMS capabilities.
                                </CardDescription>
                              </div>
                              <ArrowRight className="size-5 text-muted-foreground" />
                            </CardContent>
                          </Card>

                          <Card
                            className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                            onClick={() => setPhoneNumberOption("port")}
                          >
                            <CardContent className="flex items-center gap-4 p-6">
                              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                                <Upload className="size-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="mb-1 text-lg">
                                  Port Existing Number
                                </CardTitle>
                                <CardDescription>
                                  Transfer your current business number. Takes
                                  7-10 business days. No porting fees.
                                </CardDescription>
                              </div>
                              <ArrowRight className="size-5 text-muted-foreground" />
                            </CardContent>
                          </Card>

                          <Button
                            className="w-full"
                            onClick={async () => {
                              // Save the skip choice to onboarding progress
                              if (companyId) {
                                try {
                                  await saveOnboardingStepProgress(
                                    companyId,
                                    3,
                                    {
                                      option: "skip",
                                    }
                                  );
                                } catch (err) {
                                  console.error(
                                    "Failed to save skip choice:",
                                    err
                                  );
                                }
                              }
                              setCurrentStep(4);
                            }}
                            type="button"
                            variant="outline"
                          >
                            Continue without phone number
                            <ArrowRight className="ml-2 size-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 4: Notification Settings */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                        <Bell className="size-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-xl">
                          Notification Preferences
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          Configure how you want to receive notifications
                        </p>
                      </div>
                    </div>

                    {/* Warning if phone number was skipped */}
                    {!phoneNumberOption && (
                      <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
                        <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
                        <AlertDescription className="text-amber-800 dark:text-amber-200">
                          <strong className="font-semibold">
                            Phone Number Not Configured
                          </strong>
                          <p className="mt-2 text-sm">
                            You've chosen to continue without setting up a phone
                            number. Please note that many features will be
                            disabled or limited without phone number
                            capabilities:
                          </p>
                          <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
                            <li>SMS notifications and text messaging</li>
                            <li>Voice calls and call routing</li>
                            <li>Two-factor authentication via SMS</li>
                            <li>Customer communication via phone</li>
                            <li>Automated appointment reminders via phone</li>
                          </ul>
                          <p className="mt-2 text-sm">
                            You can add a phone number later in{" "}
                            <strong>Settings → Communications</strong>, but we
                            recommend setting one up now to unlock the full
                            functionality of Thorbis.
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Notification settings will be added here */}
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Email Notifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>New Jobs</Label>
                              <p className="text-muted-foreground text-sm">
                                Get notified when new jobs are created
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Job Updates</Label>
                              <p className="text-muted-foreground text-sm">
                                Notifications when jobs are updated
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Payment Received</Label>
                              <p className="text-muted-foreground text-sm">
                                When customers make payments
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>SMS Notifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Urgent Jobs</Label>
                              <p className="text-muted-foreground text-sm">
                                SMS alerts for urgent jobs
                              </p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Schedule Changes</Label>
                              <p className="text-muted-foreground text-sm">
                                When appointments are rescheduled
                              </p>
                            </div>
                            <Switch />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Step 5: Billing */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                        <CreditCard className="size-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-xl">
                          Payment Required
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          Complete payment to activate your account
                        </p>
                      </div>
                    </div>

                    <Alert>
                      <Shield className="size-4" />
                      <AlertDescription>
                        <strong>Payment Required:</strong> You must complete
                        payment before accessing the dashboard. Subscription
                        includes base fee + usage-based charges.
                      </AlertDescription>
                    </Alert>

                    {/* Base Subscription */}
                    <Card className="border-2 border-primary/20 bg-primary/5">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-2xl">
                              Base Subscription
                            </CardTitle>
                            <CardDescription>
                              Platform access and core features
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-4xl">
                              ${PRICING.baseFee}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              per month
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          {PRICING.features.map((feature, idx) => (
                            <div className="flex items-center gap-2" key={idx}>
                              <CheckCircle2 className="size-4 text-primary" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Usage-Based Pricing Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Usage-Based Charges</CardTitle>
                        <CardDescription>
                          Pay only for what you use. Charges are billed monthly
                          based on actual usage.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="rounded-lg border bg-muted/50 p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <div>
                                <div className="font-semibold">
                                  Phone Numbers
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  {PRICING.usageBased.phoneNumbers.description}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">
                                  ${PRICING.usageBased.phoneNumbers.price}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {PRICING.usageBased.phoneNumbers.unit}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            {Object.entries(PRICING.usageBased)
                              .filter(([key]) => key !== "phoneNumbers")
                              .map(([key, item]: [string, any]) => (
                                <div
                                  className="flex items-start justify-between rounded-lg border p-3"
                                  key={key}
                                >
                                  <div className="flex-1">
                                    <div className="font-medium text-sm capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                      {item.description}
                                    </div>
                                  </div>
                                  <div className="ml-4 text-right">
                                    <div className="font-semibold text-sm">
                                      ${item.price}
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                      {item.unit}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>

                          <Alert className="mt-4">
                            <Info className="size-4" />
                            <AlertDescription className="text-sm">
                              <strong>Example Monthly Bill:</strong> Base ($100)
                              + 1 Phone Number ($2) + 3 Team Members ($15) + 50
                              Invoices ($7.50) = ~$124.50/month
                            </AlertDescription>
                          </Alert>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Step 6: Complete */}
                {currentStep === 6 && (
                  <div className="space-y-6 text-center">
                    <CheckCircle2 className="mx-auto size-16 text-green-500" />
                    <h2 className="font-semibold text-2xl">Setup Complete!</h2>
                    <p className="text-muted-foreground">
                      Your organization is ready. Redirecting to dashboard...
                    </p>
                  </div>
                )}

                {/* Navigation */}
                {currentStep < 6 && (
                  <div className="flex items-center justify-between pt-6">
                    <Button
                      disabled={currentStep === 1 || isLoading}
                      onClick={handleBack}
                      type="button"
                      variant="outline"
                    >
                      <ArrowLeft className="mr-2 size-4" />
                      Back
                    </Button>

                    <div className="flex items-center gap-3">
                      {companyId && (
                        <Button
                          disabled={isLoading}
                          onClick={() => setShowDeleteConfirm(true)}
                          type="button"
                          variant="outline"
                        >
                          Archive Company
                        </Button>
                      )}

                      {currentStep === 2 ? (
                        <Button
                          disabled={isLoading}
                          onClick={handleStep2Submit}
                          type="button"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              Continue
                              <ArrowRight className="ml-2 size-4" />
                            </>
                          )}
                        </Button>
                      ) : currentStep === 3 ? (
                        <Button
                          disabled={isLoading || portingNumber}
                          onClick={async () => {
                            // Handle porting submission if in port mode and not yet submitted
                            if (
                              phoneNumberOption === "port" &&
                              !portingSuccess &&
                              portingData.phoneNumber
                            ) {
                              // Validate all fields
                              const errors: Record<string, string> = {};

                              if (!portingData.phoneNumber.trim()) {
                                errors.phoneNumber = "Phone number is required";
                              } else if (
                                portingData.phoneNumber.replace(/\D/g, "")
                                  .length < 10
                              ) {
                                errors.phoneNumber =
                                  "Please enter a valid phone number";
                              }

                              if (!portingData.currentCarrier.trim()) {
                                errors.currentCarrier =
                                  "Current carrier is required";
                              }

                              if (!portingData.accountNumber.trim()) {
                                errors.accountNumber =
                                  "Account number is required";
                              }

                              if (!portingData.accountPin.trim()) {
                                errors.accountPin = "Account PIN is required";
                              }

                              if (!portingData.addressLine1.trim()) {
                                errors.addressLine1 =
                                  "Street address is required";
                              }

                              if (!portingData.city.trim()) {
                                errors.city = "City is required";
                              }

                              if (!portingData.state.trim()) {
                                errors.state = "State is required";
                              } else if (portingData.state.length !== 2) {
                                errors.state =
                                  "State must be 2 letters (e.g., CA)";
                              }

                              if (!portingData.zipCode.trim()) {
                                errors.zipCode = "ZIP code is required";
                              } else if (portingData.zipCode.length < 5) {
                                errors.zipCode =
                                  "Please enter a valid ZIP code";
                              }

                              if (!portingData.authorizedPerson.trim()) {
                                errors.authorizedPerson =
                                  "Authorized person name is required";
                              }

                              if (!portingData.authorizedEmail.trim()) {
                                errors.authorizedEmail =
                                  "Email address is required";
                              } else if (
                                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                  portingData.authorizedEmail
                                )
                              ) {
                                errors.authorizedEmail =
                                  "Please enter a valid email address";
                              }

                              if (Object.keys(errors).length > 0) {
                                setPortingValidationErrors(errors);
                                setPortingError(
                                  "Please correct the errors below"
                                );
                                return;
                              }

                              setPortingNumber(true);
                              setPortingError(null);
                              setPortingValidationErrors({});

                              try {
                                const formData = new FormData();
                                Object.entries(portingData).forEach(
                                  ([key, value]) => {
                                    if (value) formData.append(key, value);
                                  }
                                );

                                const result =
                                  await portOnboardingPhoneNumber(formData);
                                if (result.success) {
                                  // Save progress after successful porting
                                  if (companyId) {
                                    try {
                                      await saveOnboardingStepProgress(
                                        companyId,
                                        3,
                                        {
                                          option: "port",
                                          portingData,
                                        }
                                      );
                                    } catch (saveErr) {
                                      console.error(
                                        "Failed to save porting progress:",
                                        saveErr
                                      );
                                    }
                                  }
                                  setPortingSuccess(true);
                                  toast.success(
                                    "Porting request submitted successfully!"
                                  );
                                  // Don't advance yet - let user see success message, they can click Continue again
                                  return;
                                }
                                setPortingError(
                                  result.error ||
                                    "Failed to submit porting request. Please try again."
                                );
                                setPortingNumber(false);
                                return;
                              } catch (error) {
                                setPortingError(
                                  "An unexpected error occurred. Please try again."
                                );
                                setPortingNumber(false);
                                return;
                              }
                            }
                            // If porting was successful, or for purchase/skip, proceed with normal flow
                            if (
                              portingSuccess ||
                              phoneNumberOption !== "port"
                            ) {
                              handleNext();
                            }
                          }}
                          type="button"
                        >
                          {portingNumber ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin" />
                              Submitting...
                            </>
                          ) : phoneNumberOption === "port" && portingSuccess ? (
                            <>
                              Continue to Next Step
                              <ArrowRight className="ml-2 size-4" />
                            </>
                          ) : (
                            <>
                              Continue
                              <ArrowRight className="ml-2 size-4" />
                            </>
                          )}
                        </Button>
                      ) : currentStep === 4 ? (
                        <Button
                          disabled={isLoading}
                          onClick={handleNext}
                          type="button"
                        >
                          Continue
                          <ArrowRight className="ml-2 size-4" />
                        </Button>
                      ) : currentStep === 5 ? (
                        <Button
                          disabled={isLoading}
                          onClick={handlePayment}
                          type="button"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Proceed to Payment
                              <CreditCard className="ml-2 size-4" />
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          disabled={isLoading}
                          onClick={handleNext}
                          type="button"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 ctrl:size-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              Continue
                              <ArrowRight className="ml-2 size-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Help */}
        <div className="mt-8 text-center text-muted-foreground text-sm">
          <p>
            Need help?{" "}
            <a
              className="font-medium text-primary hover:underline"
              href="mailto:support@thorbis.com"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>

      {/* Archive Confirmation Dialog */}
      <AlertDialog onOpenChange={setShowDeleteConfirm} open={showDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Incomplete Company?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this company? The company will be
              hidden from your company list, but you can restore it later from
              Settings &gt; Archive. Archived companies are permanently deleted
              after 90 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
              onClick={handleArchiveCompany}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Archiving...
                </>
              ) : (
                <>Archive Company</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
