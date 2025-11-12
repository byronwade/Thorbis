"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Check,
  CreditCard,
  Phone,
  Shield,
  Users,
  Loader2,
  Upload,
  X,
  Edit,
  Trash2,
  FileSpreadsheet,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createOrganizationCheckoutSession } from "@/actions/billing";
import {
  archiveIncompleteCompany,
  saveOnboardingProgress,
  saveOnboardingStepProgress,
} from "@/actions/onboarding";
import { searchPhoneNumbers } from "@/actions/telnyx";
import { SmartAddressInput } from "@/components/customers/smart-address-input";
import { PlaidLinkButton } from "@/components/finance/plaid-link-button";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { TeamMemberEditDialog } from "@/components/onboarding/team-member-edit-dialog";
import { TeamBulkUploadDialog } from "@/components/onboarding/team-bulk-upload-dialog";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { TeamMemberRow } from "@/lib/onboarding/team-bulk-upload";
import { createClient } from "@/lib/supabase/client";

// Constants
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

// Form Schema
const formSchema = z.object({
  orgName: z.string().min(2, "Company name must be at least 2 characters"),
  orgIndustry: z.string().min(1, "Please select an industry"),
  orgSize: z.string().min(1, "Please select company size"),
  orgPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  orgAddress: z.string().min(5, "Address must be at least 5 characters"),
  orgCity: z.string().min(2, "City must be at least 2 characters"),
  orgState: z.string().min(2, "State must be at least 2 characters"),
  orgZip: z.string().min(5, "ZIP code must be at least 5 digits"),
  orgWebsite: z.string().optional(),
  orgTaxId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Step configuration
const STEPS = [
  { id: 1, title: "Company Info", icon: Building2, description: "Basic details about your business" },
  { id: 2, title: "Team", icon: Users, description: "Add your team members" },
  { id: 3, title: "Bank Account", icon: CreditCard, description: "Connect your bank" },
  { id: 4, title: "Complete", icon: CheckCircle, description: "Finalize setup" },
];

export default function WelcomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [savedAddress, setSavedAddress] = useState<any>(null);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  // Team members state
  type ExtendedTeamMember = TeamMemberRow & {
    id?: string;
    photoPreview?: string | null;
    photo?: File | null;
    isCurrentUser?: boolean;
  };
  
  const [teamMembers, setTeamMembers] = useState<ExtendedTeamMember[]>([]);
  const [editingMember, setEditingMember] = useState<ExtendedTeamMember | null>(null);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  // Bank account state
  const [linkedBankAccounts, setLinkedBankAccounts] = useState(0);
  const [bankAccountOption, setBankAccountOption] = useState<"existing" | null>(null);

  // Phone number state
  const [phoneNumberOption, setPhoneNumberOption] = useState<"purchase" | "port" | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [availableNumbers, setAvailableNumbers] = useState<any[]>([]);

  const form = useForm<FormValues>({
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
    },
  });

  // Load saved progress
  useEffect(() => {
    async function loadProgress() {
      try {
        const response = await fetch("/api/get-incomplete-company");
        if (response.ok) {
          const data = await response.json();
          if (data.company) {
            // Fill form
            form.setValue("orgName", data.company.name);
            form.setValue("orgIndustry", data.company.industry);
            form.setValue("orgSize", data.company.size);
            form.setValue("orgPhone", data.company.phone);
            form.setValue("orgAddress", data.company.address);
            form.setValue("orgCity", data.company.city);
            form.setValue("orgState", data.company.state);
            form.setValue("orgZip", data.company.zipCode);
            form.setValue("orgWebsite", data.company.website || "");
            form.setValue("orgTaxId", data.company.taxId || "");

            setSavedAddress({
              address: data.company.address,
              city: data.company.city,
              state: data.company.state,
              zipCode: data.company.zipCode,
              country: "USA",
            });

            setCompanyId(data.company.id);

            if (data.company.logo) {
              setLogoPreview(data.company.logo);
            }

            // Load team members
            if (data.company.onboardingProgress?.step2?.teamMembers) {
              setTeamMembers(data.company.onboardingProgress.step2.teamMembers);
            }

            // Auto-add current user as owner
            const supabase = await createClient();
            if (!supabase) return data;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return data;
            
            if (user && data.company.onboardingProgress?.step2?.teamMembers) {
              const hasCurrentUser = data.company.onboardingProgress.step2.teamMembers.some(
                (member: ExtendedTeamMember) => member.email === user.email
              );

              if (!hasCurrentUser) {
                const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Owner";
                const nameParts = fullName.split(" ");
                const newMember: ExtendedTeamMember = {
                  id: crypto.randomUUID(),
                  firstName: nameParts[0] || "Owner",
                  lastName: nameParts.slice(1).join(" ") || "",
                  email: user.email || "",
                  role: "owner",
                  phone: user.user_metadata?.phone || "",
                  isCurrentUser: true,
                };
                setTeamMembers((prev) => [newMember, ...prev]);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    }

    loadProgress();
  }, [form]);

  // Auto-add current user if no team members
  useEffect(() => {
    if (teamMembers.length === 0 && currentStep === 2) {
      async function addCurrentUser() {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Owner";
          const nameParts = fullName.split(" ");
          const newMember: ExtendedTeamMember = {
            id: crypto.randomUUID(),
            firstName: nameParts[0] || "Owner",
            lastName: nameParts.slice(1).join(" ") || "",
            email: user.email || "",
            role: "owner",
            phone: user.user_metadata?.phone || "",
            isCurrentUser: true,
          };
          setTeamMembers([newMember]);
        }
      }

      addCurrentUser();
    }
  }, [currentStep, teamMembers.length]);

  // Save progress
  const saveProgress = async () => {
    if (!companyId) return;

    await saveOnboardingStepProgress(companyId, {
      step2: { teamMembers },
    });
  };

  // Handle next
  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger();
      if (!isValid) return;

      setIsLoading(true);
      try {
        const values = form.getValues();
        
        // Save or update company
        const response = await fetch("/api/save-company", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: companyId,
            name: values.orgName,
            industry: values.orgIndustry,
            size: values.orgSize,
            phone: values.orgPhone,
            address: values.orgAddress,
            city: values.orgCity,
            state: values.orgState,
            zipCode: values.orgZip,
            website: values.orgWebsite,
            taxId: values.orgTaxId,
            logo: logoPreview,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to save company");
        }

        if (data.companyId) {
          setCompanyId(data.companyId);
        }

        setCurrentStep(2);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save company"
        );
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 2) {
      await saveProgress();
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (linkedBankAccounts === 0) {
        toast.error("Please connect a bank account to continue");
        return;
      }
      
      // Proceed to payment
      await handlePayment();
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (!companyId) return;

    setIsLoading(true);
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const result = await createOrganizationCheckoutSession(
        companyId,
        `${siteUrl}/dashboard?onboarding=complete`,
        `${siteUrl}/dashboard/welcome`,
        undefined
      );

      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        toast.error(result.error || "Failed to create payment session");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Payment setup failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle archive
  const handleArchive = async () => {
    if (!companyId) return;

    setIsLoading(true);
    try {
      await archiveIncompleteCompany(companyId);
      toast.success("Company archived successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to archive company");
    } finally {
      setIsLoading(false);
      setArchiveDialogOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-muted/20">
      <OnboardingHeader />

      <div className="container mx-auto max-w-3xl flex-1 px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="relative flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "relative z-10 flex size-12 items-center justify-center rounded-full border-2 transition-all",
                      currentStep >= step.id
                        ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "border-muted-foreground/30 bg-background text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="size-5" />
                    ) : (
                      <step.icon className="size-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-center font-medium text-xs",
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 flex-1 transition-colors",
                      currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <Card className="border-2 shadow-xl">
          <CardContent className="p-6 sm:p-8">
            <Form {...form}>
              {/* Step 1: Company Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-semibold text-2xl">Company Information</h2>
                    <p className="mt-1 text-muted-foreground text-sm">
                      Tell us about your business
                    </p>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="orgName"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme HVAC Services" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orgIndustry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {INDUSTRIES.map((industry) => (
                                <SelectItem key={industry.value} value={industry.value}>
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
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COMPANY_SIZES.map((size) => (
                                <SelectItem key={size.value} value={size.value}>
                                  {size.label}
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
                      name="orgPhone"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="sm:col-span-2">
                      <Label>Address *</Label>
                      <SmartAddressInput
                        savedAddress={savedAddress}
                        onAddressChange={(address) => {
                          form.setValue("orgAddress", address.address);
                          form.setValue("orgCity", address.city);
                          form.setValue("orgState", address.state);
                          form.setValue("orgZip", address.zipCode);
                        }}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="orgWebsite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-2xl">Team Members</h2>
                      <p className="mt-1 text-muted-foreground text-sm">
                        Add your team (you're already included as owner)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setBulkUploadOpen(true)}
                      >
                        <FileSpreadsheet className="mr-2 size-4" />
                        Bulk Upload
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          const newMember: ExtendedTeamMember = {
                            id: crypto.randomUUID(),
                            firstName: "",
                            lastName: "",
                            email: "",
                            role: "technician",
                            phone: "",
                          };
                          setTeamMembers((prev) => [...prev, newMember]);
                          setEditingMember(newMember);
                        }}
                      >
                        <UserPlus className="mr-2 size-4" />
                        Add Member
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {teamMembers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
                      <Users className="mb-4 size-12 text-muted-foreground" />
                      <p className="mb-2 font-medium">No team members yet</p>
                      <p className="mb-4 text-muted-foreground text-sm">
                        Add your first team member to get started
                      </p>
                      <Button
                        type="button"
                        onClick={() => {
                          const newMember: ExtendedTeamMember = {
                            id: crypto.randomUUID(),
                            firstName: "",
                            lastName: "",
                            email: "",
                            role: "technician",
                            phone: "",
                          };
                          setTeamMembers([newMember]);
                          setEditingMember(newMember);
                        }}
                      >
                        <UserPlus className="mr-2 size-4" />
                        Add First Member
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {teamMembers.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell className="font-medium">
                                {member.firstName} {member.lastName}
                              </TableCell>
                              <TableCell>{member.email}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={member.role === "owner" ? "default" : "secondary"}
                                >
                                  {member.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingMember(member)}
                                  >
                                    <Edit className="size-4" />
                                  </Button>
                                  {member.role !== "owner" && !member.isCurrentUser && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setTeamMembers((prev) =>
                                          prev.filter((m) => m.id !== member.id)
                                        );
                                      }}
                                    >
                                      <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Bank Account */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-semibold text-2xl">Bank Account Setup</h2>
                    <p className="mt-1 text-muted-foreground text-sm">
                      Connect your bank to receive payments
                    </p>
                  </div>

                  <Separator />

                  {linkedBankAccounts > 0 && (
                    <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                      <CheckCircle className="size-4 text-green-600" />
                      <AlertDescription className="text-green-600 dark:text-green-400">
                        <strong>Success!</strong> {linkedBankAccounts} bank account{linkedBankAccounts > 1 ? "s" : ""} connected
                      </AlertDescription>
                    </Alert>
                  )}

                  {linkedBankAccounts === 0 ? (
                    <Card className="border-dashed border-2">
                      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 rounded-full bg-primary/10 p-4">
                          <CreditCard className="size-8 text-primary" />
                        </div>
                        <h3 className="mb-2 font-medium text-lg">Connect Your Bank</h3>
                        <p className="mb-6 max-w-md text-muted-foreground text-sm">
                          Securely link your business bank account with Plaid. Bank-level encryption keeps your data safe.
                        </p>
                        {companyId && (
                          <PlaidLinkButton
                            companyId={companyId}
                            onSuccess={() => {
                              setLinkedBankAccounts((prev) => prev + 1);
                              toast.success("Bank account connected successfully!");
                            }}
                            size="lg"
                          />
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      {companyId && (
                        <PlaidLinkButton
                          companyId={companyId}
                          onSuccess={() => {
                            setLinkedBankAccounts((prev) => prev + 1);
                            toast.success("Additional bank account connected!");
                          }}
                          variant="outline"
                        >
                          Add Another Account
                        </PlaidLinkButton>
                      )}
                    </div>
                  )}

                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex gap-3">
                      <Shield className="size-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Bank-Level Security</p>
                        <p className="text-muted-foreground text-xs">
                          Your credentials are encrypted and never stored on our servers. We use Plaid, trusted by leading financial institutions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between gap-4 border-t pt-6">
                <div>
                  {companyId && currentStep === 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setArchiveDialogOpen(true)}
                      className="text-muted-foreground"
                    >
                      Cancel Setup
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      disabled={isLoading}
                    >
                      <ArrowLeft className="mr-2 size-4" />
                      Back
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading || (currentStep === 3 && linkedBankAccounts === 0)}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Processing...
                      </>
                    ) : currentStep === 3 ? (
                      <>
                        Complete & Pay
                        <ArrowRight className="ml-2 size-4" />
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="mt-6 text-center text-muted-foreground text-sm">
          Need help? Contact us at{" "}
          <a href="mailto:support@thorbis.com" className="text-primary hover:underline">
            support@thorbis.com
          </a>
        </p>
      </div>

      {/* Dialogs */}
      {editingMember && (
        <TeamMemberEditDialog
          member={editingMember}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingMember(null);
          }}
          onSave={(updatedMember) => {
            setTeamMembers((prev) =>
              prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
            );
            setEditingMember(null);
          }}
        />
      )}

      <TeamBulkUploadDialog
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        onUpload={(members) => {
          const membersWithIds = members.map((member) => ({
            ...member,
            id: crypto.randomUUID(),
          }));
          setTeamMembers((prev) => [...prev, ...membersWithIds]);
          setBulkUploadOpen(false);
        }}
      />

      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Company Setup?</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive your incomplete company setup. You can resume later, but all progress will be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Setup</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel Setup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
