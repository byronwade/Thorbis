"use client";

/**
 * Advanced Welcome Page Client Component
 *
 * Complete onboarding experience with:
 * - 4-step wizard (Company, Team, Phone, Banking)
 * - Phone number purchase/porting
 * - Beautiful centered timeline
 * - Modern animations and design
 * - Progress persistence
 */

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowLeft,
	ArrowRight,
	Building2,
	Check,
	CheckCircle,
	CreditCard,
	Edit,
	FileSpreadsheet,
	Globe,
	Loader2,
	Phone,
	PhoneCall,
	PhoneIncoming,
	PhoneOff,
	Shield,
	Sparkles,
	Trash2,
	UserPlus,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createOrganizationCheckoutSession } from "@/actions/billing";
import {
	archiveIncompleteCompany,
	saveOnboardingStepProgress,
} from "@/actions/onboarding";
import { SmartAddressInput } from "@/components/customers/smart-address-input";
import { PlaidLinkButtonLazy as PlaidLinkButton } from "@/components/finance/plaid-link-button-lazy";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { TeamBulkUploadDialog } from "@/components/onboarding/team-bulk-upload-dialog";
import { TeamMemberEditDialog } from "@/components/onboarding/team-member-edit-dialog";
import { NumberPortingWizard } from "@/components/telnyx/number-porting-wizard";
import { PhoneNumberSearchModal } from "@/components/telnyx/phone-number-search-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import type { TeamMemberRow } from "@/lib/onboarding/team-bulk-upload";
import { cn } from "@/lib/utils";

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
	orgLegalName: z.string().min(2, "Legal name must be at least 2 characters"),
	orgDoingBusinessAs: z.string().optional(),
	orgIndustry: z.string().min(1, "Please select an industry"),
	orgSize: z.string().min(1, "Please select company size"),
	orgPhone: z.string().min(10, "Phone number must be at least 10 digits"),
	orgSupportEmail: z
		.string()
		.email("Please enter a valid email")
		.optional()
		.or(z.literal("")),
	orgSupportPhone: z
		.string()
		.min(10, "Support phone must be at least 10 digits"),
	orgBrandColor: z
		.string()
		.regex(/^#([0-9A-Fa-f]{6})$/, "Use a valid hex color (e.g. #3366FF)")
		.optional()
		.or(z.literal("")),
	orgEIN: z.string().regex(/^\d{2}-?\d{7}$/, "Enter EIN in 00-0000000 format"),
	orgAddress: z.string().min(5, "Address must be at least 5 characters"),
	orgCity: z.string().min(2, "City must be at least 2 characters"),
	orgState: z.string().min(2, "State must be at least 2 characters"),
	orgZip: z.string().min(5, "ZIP code must be at least 5 digits"),
	orgWebsite: z.string().optional(),
	orgTaxId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type IncompleteCompany = {
	id: string;
	name: string;
	industry: string;
	size: string;
	phone: string;
	email?: string | null;
	support_email?: string | null;
	support_phone?: string | null;
	legal_name?: string | null;
	doing_business_as?: string | null;
	brand_color?: string | null;
	ein?: string | null;
	address: string;
	city: string;
	state: string;
	zipCode: string;
	website: string;
	taxId: string;
	logo: string | null;
	onboardingProgress: Record<string, any>;
	currentStep: number;
	trialEndsAt?: string | null;
	subscriptionStatus?: string | null;
	hasPayment?: boolean;
};

// Advanced Step configuration
const STEPS = [
	{
		id: 1,
		title: "Company",
		icon: Building2,
		description: "Basic information",
	},
	{ id: 2, title: "Team", icon: Users, description: "Add members" },
	{ id: 3, title: "Phone", icon: Phone, description: "Setup number" },
	{ id: 4, title: "Banking", icon: CreditCard, description: "Connect account" },
];

type ExtendedTeamMember = TeamMemberRow & {
	id?: string;
	photoPreview?: string | null;
	photo?: File | null;
	isCurrentUser?: boolean;
};

type WelcomePageClientProps = {
	user: {
		id: string;
		email: string;
		name: string;
	};
	incompleteCompany: IncompleteCompany | null;
	hasActiveCompany: boolean;
	emailInfrastructure?: {
		domain: Record<string, unknown> | null;
		inboundRoute: Record<string, unknown> | null;
	} | null;
};

export function WelcomePageClientAdvanced({
	user,
	incompleteCompany,
	hasActiveCompany,
	emailInfrastructure,
}: WelcomePageClientProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [currentStep, setCurrentStep] = useState(
		incompleteCompany?.currentStep || 1,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [companyId, setCompanyId] = useState<string | null>(
		incompleteCompany?.id || null,
	);
	const [savedAddress, setSavedAddress] = useState<any>(null);
	const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

	// Team members state
	const [teamMembers, setTeamMembers] = useState<ExtendedTeamMember[]>([]);
	const [editingMember, setEditingMember] = useState<ExtendedTeamMember | null>(
		null,
	);
	const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

	// Phone number state
	const [phoneOption, setPhoneOption] = useState<
		"purchase" | "port" | "existing" | null
	>(incompleteCompany?.onboardingProgress?.step3?.phoneOption || null);
	const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(
		incompleteCompany?.onboardingProgress?.step3?.phoneNumber || null,
	);
	const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
	const [portingWizardOpen, setPortingWizardOpen] = useState(false);

	// Bank account state
	const [linkedBankAccounts, setLinkedBankAccounts] = useState(
		incompleteCompany?.onboardingProgress?.step4?.bankAccounts || 0,
	);

	const trialActive = Boolean(incompleteCompany?.hasPayment);
	const trialEndsAt = incompleteCompany?.trialEndsAt
		? new Date(incompleteCompany.trialEndsAt)
		: null;
	const formattedTrialEndsAt = trialEndsAt
		? trialEndsAt.toLocaleDateString(undefined, {
				month: "long",
				day: "numeric",
			})
		: null;
	const trialBannerTitle = trialActive ? "Trial Active" : "14-day free trial";
	const trialBannerDescription = trialActive
		? `Your team has full Thorbis access${formattedTrialEndsAt ? ` through ${formattedTrialEndsAt}` : ""}. Finish onboarding to unlock every workflow—no credit card required until you upgrade.`
		: "Finish the steps below to activate your 14-day free trial. We'll unlock the entire system immediately—no credit card required until you're ready.";

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			orgName: incompleteCompany?.name || "",
			orgLegalName:
				incompleteCompany?.legal_name || incompleteCompany?.name || "",
			orgDoingBusinessAs:
				incompleteCompany?.doing_business_as || incompleteCompany?.name || "",
			orgIndustry: incompleteCompany?.industry || "",
			orgSize: incompleteCompany?.size || "",
			orgPhone: incompleteCompany?.phone || "",
			orgSupportEmail:
				incompleteCompany?.support_email || incompleteCompany?.email || "",
			orgSupportPhone:
				incompleteCompany?.support_phone || incompleteCompany?.phone || "",
			orgBrandColor: incompleteCompany?.brand_color || "",
			orgEIN: incompleteCompany?.ein || incompleteCompany?.taxId || "",
			orgAddress: incompleteCompany?.address || "",
			orgCity: incompleteCompany?.city || "",
			orgState: incompleteCompany?.state || "",
			orgZip: incompleteCompany?.zipCode || "",
			orgWebsite: incompleteCompany?.website || "",
			orgTaxId: incompleteCompany?.taxId || "",
		},
	});

	// Load saved progress
	useEffect(() => {
		if (incompleteCompany) {
			setSavedAddress({
				address: incompleteCompany.address,
				city: incompleteCompany.city,
				state: incompleteCompany.state,
				zipCode: incompleteCompany.zipCode,
				country: "USA",
			});

			// Load team members
			if (incompleteCompany.onboardingProgress?.step2?.teamMembers) {
				setTeamMembers(incompleteCompany.onboardingProgress.step2.teamMembers);
			}

			// Load phone setup
			if (incompleteCompany.onboardingProgress?.step3) {
				setPhoneOption(incompleteCompany.onboardingProgress.step3.phoneOption);
				setSelectedPhoneNumber(
					incompleteCompany.onboardingProgress.step3.phoneNumber,
				);
			}

			// Load bank accounts
			if (incompleteCompany.onboardingProgress?.step4?.bankAccounts) {
				setLinkedBankAccounts(
					incompleteCompany.onboardingProgress.step4.bankAccounts,
				);
			}
		}
	}, [incompleteCompany]);

	// Auto-add current user as owner
	useEffect(() => {
		if (teamMembers.length === 0 && currentStep === 2) {
			const hasCurrentUser = teamMembers.some((m) => m.email === user.email);

			if (!hasCurrentUser) {
				const nameParts = user.name.split(" ");
				const newMember: ExtendedTeamMember = {
					id: crypto.randomUUID(),
					firstName: nameParts[0] || "Owner",
					lastName: nameParts.slice(1).join(" ") || "",
					email: user.email,
					role: "owner",
					phone: "",
					isCurrentUser: true,
				};
				setTeamMembers([newMember]);
			}
		}
	}, [currentStep, teamMembers, user]);

	// Save progress helper
	const saveStepProgress = async (
		step: number,
		data: Record<string, unknown>,
	) => {
		if (!companyId) {
			return;
		}

		try {
			await saveOnboardingStepProgress(companyId, step, data);
		} catch (_err) {
			// Silent fail - don't block user progress
		}
	};

	// Handle next
	const handleNext = async () => {
		if (currentStep === 1) {
			const isValid = await form.trigger();
			if (!isValid) {
				return;
			}

			setIsLoading(true);
			try {
				const values = form.getValues();

				const response = await fetch("/api/save-company", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						id: companyId,
						name: values.orgName,
						industry: values.orgIndustry,
						size: values.orgSize,
						phone: values.orgPhone,
						supportEmail: values.orgSupportEmail,
						supportPhone: values.orgSupportPhone,
						address: values.orgAddress,
						city: values.orgCity,
						state: values.orgState,
						zipCode: values.orgZip,
						website: values.orgWebsite,
						taxId: values.orgTaxId,
						legalName: values.orgLegalName,
						doingBusinessAs: values.orgDoingBusinessAs || values.orgName,
						brandColor: values.orgBrandColor,
						ein: values.orgEIN,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Failed to save company");
				}

				if (data.companyId) {
					setCompanyId(data.companyId);
				}

				await saveStepProgress(1, {
					companyInfo: values,
					completed: true,
					completedAt: new Date().toISOString(),
				});

				toast.success("Company information saved successfully");
				setCurrentStep(2);
			} catch (err) {
				toast.error(
					err instanceof Error ? err.message : "Failed to save company",
				);
			} finally {
				setIsLoading(false);
			}
		} else if (currentStep === 2) {
			setIsLoading(true);
			try {
				await saveStepProgress(2, {
					teamMembers,
					completed: true,
					completedAt: new Date().toISOString(),
				});

				toast.success("Team information saved successfully");
				setCurrentStep(3);
			} catch {
				toast.error("Failed to save team information");
			} finally {
				setIsLoading(false);
			}
		} else if (currentStep === 3) {
			// Phone setup - can skip
			setIsLoading(true);
			try {
				await saveStepProgress(3, {
					phoneOption,
					phoneNumber: selectedPhoneNumber,
					completed: true,
					completedAt: new Date().toISOString(),
				});

				toast.success("Phone setup saved successfully");
				setCurrentStep(4);
			} catch {
				toast.error("Failed to save phone information");
			} finally {
				setIsLoading(false);
			}
		} else if (currentStep === 4) {
			if (linkedBankAccounts === 0) {
				toast.error("Please connect a bank account to continue");
				return;
			}

			setIsLoading(true);
			try {
				await saveStepProgress(4, {
					bankAccounts: linkedBankAccounts,
					completed: true,
					completedAt: new Date().toISOString(),
				});

				await handlePayment();
			} catch {
				toast.error("Failed to save banking information");
				setIsLoading(false);
			}
		}
	};

	// Handle payment
	const handlePayment = async () => {
		if (!companyId) {
			return;
		}

		setIsLoading(true);
		try {
			const siteUrl =
				process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
			const result = await createOrganizationCheckoutSession(
				companyId,
				`${siteUrl}/dashboard?onboarding=complete`,
				`${siteUrl}/dashboard/welcome`,
				undefined,
			);

			if (result.success && result.url) {
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

	// Handle archive
	const handleArchive = async () => {
		if (!companyId) {
			return;
		}

		setIsLoading(true);
		try {
			await archiveIncompleteCompany(companyId);
			toast.success("Company setup has been cancelled");
			router.push("/dashboard");
		} catch {
			toast.error("Failed to cancel setup");
		} finally {
			setIsLoading(false);
			setArchiveDialogOpen(false);
		}
	};

	const emailInfra = emailInfrastructure ?? {
		domain: null,
		inboundRoute: null,
	};

	return (
		<div className="from-background via-background to-primary/5 flex min-h-screen flex-col bg-gradient-to-br">
			{/* Header */}
			<OnboardingHeader />

			{/* Main Content */}
			<div className="container mx-auto max-w-6xl flex-1 px-4 py-8 lg:py-12">
				{/* Welcome Banner */}
				{!hasActiveCompany && (
					<Card className="border-primary/20 from-primary/10 to-primary/5 mb-8 bg-gradient-to-r">
						<CardHeader>
							<div className="flex items-start gap-4">
								<div className="bg-primary/20 flex size-12 shrink-0 items-center justify-center rounded-full">
									<Sparkles className="text-primary size-6" />
								</div>
								<div className="flex-1">
									<CardTitle className="mb-2">Welcome to Thorbis!</CardTitle>
									<CardDescription className="text-base">
										Let's get your business set up in just a few steps. This
										will only take a few minutes.
									</CardDescription>
								</div>
							</div>
						</CardHeader>
					</Card>
				)}

				{/* Back to Dashboard */}
				{hasActiveCompany && (
					<div className="mb-6">
						<Link href="/dashboard">
							<Button size="sm" variant="ghost">
								<ArrowLeft className="mr-2 size-4" />
								Back to Dashboard
							</Button>
						</Link>
					</div>
				)}

				<Alert className="border-primary/30 bg-primary/5 mb-8">
					<div className="flex items-start gap-3">
						<div className="bg-primary/10 text-primary mt-1 rounded-full p-2">
							<Sparkles className="size-4" />
						</div>
						<div className="space-y-1">
							<AlertTitle className="font-semibold">
								{trialBannerTitle}
							</AlertTitle>
							<AlertDescription className="text-muted-foreground text-sm">
								{trialBannerDescription}
							</AlertDescription>
						</div>
					</div>
				</Alert>

				{/* Centered Progress Timeline */}
				<div className="mb-12">
					<div className="mx-auto max-w-4xl">
						<div className="relative flex items-center justify-center">
							{STEPS.map((step, index) => (
								<div className="flex flex-1 items-center" key={step.id}>
									<div className="flex w-full flex-col items-center">
										<div
											className={cn(
												"relative z-10 flex size-16 items-center justify-center rounded-full border-2 transition-all duration-300",
												currentStep >= step.id
													? "border-primary bg-primary text-primary-foreground shadow-primary/30 scale-110 shadow-lg"
													: "border-muted-foreground/30 bg-background text-muted-foreground hover:border-muted-foreground/50",
											)}
										>
											{currentStep > step.id ? (
												<Check className="size-7" />
											) : (
												<step.icon className="size-7" />
											)}
										</div>
										<div className="mt-4 text-center">
											<span
												className={cn(
													"block text-sm font-semibold",
													currentStep >= step.id
														? "text-foreground"
														: "text-muted-foreground",
												)}
											>
												{step.title}
											</span>
											<span className="text-muted-foreground mt-1 block text-xs">
												{step.description}
											</span>
										</div>
									</div>
									{index < STEPS.length - 1 && (
										<div className="flex-1 px-4">
											<div
												className={cn(
													"h-1 rounded-full transition-all duration-500",
													currentStep > step.id
														? "bg-primary"
														: "bg-muted-foreground/20",
												)}
											/>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				<Card className="border-primary/20 bg-primary/5 mx-auto mb-10 max-w-4xl border shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Globe className="text-primary size-5" />
							Email Automation
						</CardTitle>
						<CardDescription className="text-sm">
							Thorbis provisions Resend for both outbound sending and inbound
							routing automatically.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-6 md:grid-cols-2">
						<div className="border-primary/10 bg-background/80 rounded-lg border p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-semibold">Sending Domain</p>
									<p className="text-muted-foreground text-xs">
										{String(
											emailInfra.domain?.domain ?? "Pending provisioning",
										)}
									</p>
								</div>
								<Badge className="capitalize" variant="secondary">
									{String(emailInfra.domain?.status ?? "pending")}
								</Badge>
							</div>
							<p className="text-muted-foreground mt-2 text-xs">
								We’ll share DNS instructions once the domain is ready.
							</p>
						</div>
						<div className="border-primary/10 bg-background/80 rounded-lg border p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-semibold">Inbound Routing</p>
									<p className="text-muted-foreground text-xs">
										{String(
											emailInfra.inboundRoute?.route_address ??
												"Automatic reply capture pending",
										)}
									</p>
								</div>
								<Badge className="capitalize" variant="secondary">
									{String(emailInfra.inboundRoute?.status ?? "pending")}
								</Badge>
							</div>
							<p className="text-muted-foreground mt-2 text-xs">
								Customer replies will flow back into the Communications hub
								automatically.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Content Card */}
				<Card className="mx-auto max-w-4xl shadow-2xl">
					<CardContent className="p-8 lg:p-12">
						<Form {...form}>
							{/* Step 1: Company Info */}
							{currentStep === 1 && (
								<div className="fade-in-50 animate-in space-y-8 duration-300">
									<div>
										<h2 className="text-3xl font-bold">Company Information</h2>
										<p className="text-muted-foreground mt-3 text-lg">
											Tell us about your business so we can tailor the
											experience for you.
										</p>
									</div>

									<Separator />

									<div className="grid gap-6 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="orgName"
											render={({ field }) => (
												<FormItem className="sm:col-span-2">
													<FormLabel className="text-base">
														Company Name *
													</FormLabel>
													<FormControl>
														<Input
															className="h-12 text-base"
															placeholder="Acme HVAC Services"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="orgLegalName"
											render={({ field }) => (
												<FormItem className="sm:col-span-2">
													<FormLabel className="text-base">
														Legal Entity Name *
													</FormLabel>
													<FormControl>
														<Input
															className="h-12 text-base"
															placeholder="Legal name on EIN / IRS documents"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="orgDoingBusinessAs"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-base">
														Doing Business As
													</FormLabel>
													<FormControl>
														<Input
															className="h-12 text-base"
															placeholder="Brand name customers know"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="orgEIN"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-base">EIN *</FormLabel>
													<FormControl>
														<Input
															className="h-12 text-base"
															placeholder="87-1234567"
															{...field}
														/>
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
													<FormLabel className="text-base">
														Industry *
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="h-12 text-base">
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
											name="orgSupportEmail"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-base">
														Support Email *
													</FormLabel>
													<FormControl>
														<Input
															className="h-12 text-base"
															placeholder="support@yourcompany.com"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="orgSupportPhone"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-base">
														Support Phone *
													</FormLabel>
													<FormControl>
														<Input
															className="h-12 text-base"
															placeholder="(831) 555-1234"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="orgSize"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-base">
														Company Size *
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="h-12 text-base">
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
											name="orgBrandColor"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-base">
														Brand Color
													</FormLabel>
													<FormControl>
														<div className="flex items-center gap-3">
															<Input
																className="h-12 w-20 cursor-pointer rounded-md border"
																onChange={(event) =>
																	field.onChange(event.target.value)
																}
																type="color"
																value={field.value || "#3b82f6"}
															/>
															<Input
																className="h-12 flex-1 text-base"
																onChange={(event) =>
																	field.onChange(event.target.value)
																}
																placeholder="#3B82F6"
																value={field.value || ""}
															/>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="orgPhone"
											render={({ field }) => (
												<FormItem className="sm:col-span-2">
													<FormLabel className="text-base">
														Main Phone Number *
													</FormLabel>
													<FormControl>
														<Input
															className="h-12 text-base"
															placeholder="(555) 123-4567"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="sm:col-span-2">
											<Label className="text-base">Business Address *</Label>
											<SmartAddressInput
												initialAddress={savedAddress}
												onAddressChange={(address) => {
													form.setValue("orgAddress", address.address);
													form.setValue("orgCity", address.city);
													form.setValue("orgState", address.state);
													form.setValue("orgZip", address.zipCode);
												}}
												required
											/>
										</div>

										<FormField
											control={form.control}
											name="orgWebsite"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-base">Website</FormLabel>
													<FormControl>
														<Input
															className="h-12 text-base"
															placeholder="https://example.com"
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
													<FormLabel className="text-base">
														Tax ID / EIN
													</FormLabel>
													<FormControl>
														<Input
															className="h-12 text-base"
															placeholder="12-3456789"
															{...field}
														/>
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
								<div className="fade-in-50 animate-in space-y-8 duration-300">
									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<div>
											<h2 className="text-3xl font-bold">Team Members</h2>
											<p className="text-muted-foreground mt-3 text-lg">
												Add your team members. You're already included as the
												owner.
											</p>
										</div>
										<div className="flex gap-2">
											<Button
												onClick={() => setBulkUploadOpen(true)}
												size="sm"
												type="button"
												variant="outline"
											>
												<FileSpreadsheet className="mr-2 size-4" />
												Bulk Upload
											</Button>
											<Button
												onClick={() => {
													const newMember: ExtendedTeamMember = {
														id: crypto.randomUUID(),
														firstName: "",
														lastName: "",
														email: "",
														role: "technician",
														phone: "",
													};
													setTeamMembers((prev: ExtendedTeamMember[]) => [
														...prev,
														newMember,
													]);
													setEditingMember(newMember);
												}}
												size="sm"
												type="button"
											>
												<UserPlus className="mr-2 size-4" />
												Add Member
											</Button>
										</div>
									</div>

									<Separator />

									{teamMembers.length === 0 ? (
										<Card className="border-2 border-dashed">
											<CardContent className="flex flex-col items-center justify-center py-16 text-center">
												<div className="bg-primary/10 mb-4 rounded-full p-6">
													<Users className="text-primary size-12" />
												</div>
												<h3 className="mb-2 text-xl font-semibold">
													No Team Members Yet
												</h3>
												<p className="text-muted-foreground mb-6 max-w-md">
													Add your first team member to get started. You can
													always add more later.
												</p>
												<Button
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
													size="lg"
													type="button"
												>
													<UserPlus className="mr-2 size-4" />
													Add First Member
												</Button>
											</CardContent>
										</Card>
									) : (
										<div className="rounded-lg border">
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>Name</TableHead>
														<TableHead>Email</TableHead>
														<TableHead>Role</TableHead>
														<TableHead className="w-[100px] text-right">
															Actions
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{teamMembers.map((member) => (
														<TableRow key={member.id}>
															<TableCell className="font-medium">
																{member.firstName} {member.lastName}
																{member.isCurrentUser && (
																	<Badge className="ml-2" variant="outline">
																		You
																	</Badge>
																)}
															</TableCell>
															<TableCell>{member.email}</TableCell>
															<TableCell>
																<Badge
																	variant={
																		member.role === "owner"
																			? "default"
																			: "secondary"
																	}
																>
																	{member.role}
																</Badge>
															</TableCell>
															<TableCell className="text-right">
																<div className="flex justify-end gap-2">
																	<Button
																		onClick={() => setEditingMember(member)}
																		size="icon"
																		type="button"
																		variant="ghost"
																	>
																		<Edit className="size-4" />
																	</Button>
																	{member.role !== "owner" &&
																		!member.isCurrentUser && (
																			<Button
																				onClick={() => {
																					setTeamMembers(
																						(prev: ExtendedTeamMember[]) =>
																							prev.filter(
																								(m) => m.id !== member.id,
																							),
																					);
																				}}
																				size="icon"
																				type="button"
																				variant="ghost"
																			>
																				<Trash2 className="text-destructive size-4" />
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

							{/* Step 3: Phone Number Setup */}
							{currentStep === 3 && (
								<div className="fade-in-50 animate-in space-y-8 duration-300">
									<div>
										<h2 className="text-3xl font-bold">Phone Number Setup</h2>
										<p className="text-muted-foreground mt-3 text-lg">
											Set up your business phone number for calls, SMS, and
											VoIP.
										</p>
									</div>

									<Separator />

									{selectedPhoneNumber && (
										<Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
											<CheckCircle className="size-5 text-green-600 dark:text-green-400" />
											<AlertDescription className="text-green-900 dark:text-green-100">
												<span className="font-semibold">Success!</span> Phone
												number {selectedPhoneNumber} is configured
											</AlertDescription>
										</Alert>
									)}

									<div className="grid gap-4 sm:grid-cols-3">
										{/* Purchase New Number */}
										<Card
											className={cn(
												"cursor-pointer transition-all hover:shadow-lg",
												phoneOption === "purchase" &&
													"border-primary ring-primary/20 border-2 ring-2",
											)}
											onClick={() => {
												setPhoneOption("purchase");
												setPurchaseModalOpen(true);
											}}
										>
											<CardContent className="flex flex-col items-center justify-center p-8 text-center">
												<div className="bg-primary/10 mb-4 rounded-full p-4">
													<PhoneCall className="text-primary size-8" />
												</div>
												<h3 className="mb-2 text-lg font-semibold">
													Purchase New
												</h3>
												<p className="text-muted-foreground text-sm">
													Get a new phone number with your preferred area code
												</p>
												{phoneOption === "purchase" && selectedPhoneNumber && (
													<Badge className="mt-4" variant="outline">
														{selectedPhoneNumber}
													</Badge>
												)}
											</CardContent>
										</Card>

										{/* Port Existing Number */}
										<Card
											className={cn(
												"cursor-pointer transition-all hover:shadow-lg",
												phoneOption === "port" &&
													"border-primary ring-primary/20 border-2 ring-2",
											)}
											onClick={() => {
												setPhoneOption("port");
												setPortingWizardOpen(true);
											}}
										>
											<CardContent className="flex flex-col items-center justify-center p-8 text-center">
												<div className="bg-primary/10 mb-4 rounded-full p-4">
													<PhoneIncoming className="text-primary size-8" />
												</div>
												<h3 className="mb-2 text-lg font-semibold">
													Port Existing
												</h3>
												<p className="text-muted-foreground text-sm">
													Transfer your current phone number from another
													carrier
												</p>
												{phoneOption === "port" && (
													<Badge className="mt-4" variant="outline">
														Porting in progress
													</Badge>
												)}
											</CardContent>
										</Card>

										{/* Use Existing */}
										<Card
											className={cn(
												"cursor-pointer transition-all hover:shadow-lg",
												phoneOption === "existing" &&
													"border-primary ring-primary/20 border-2 ring-2",
											)}
											onClick={() => {
												setPhoneOption("existing");
												toast.success(
													"You can configure your existing phone system later in settings",
												);
											}}
										>
											<CardContent className="flex flex-col items-center justify-center p-8 text-center">
												<div className="bg-primary/10 mb-4 rounded-full p-4">
													<PhoneOff className="text-primary size-8" />
												</div>
												<h3 className="mb-2 text-lg font-semibold">
													Use Existing
												</h3>
												<p className="text-muted-foreground text-sm">
													Continue using your current phone system
												</p>
												{phoneOption === "existing" && (
													<Badge className="mt-4" variant="outline">
														Selected
													</Badge>
												)}
											</CardContent>
										</Card>
									</div>

									<Card className="border-primary/20 bg-primary/5">
										<CardContent className="flex gap-4 p-6">
											<Phone className="text-primary size-6 shrink-0" />
											<div className="space-y-2">
												<h4 className="font-semibold">Optional Step</h4>
												<p className="text-muted-foreground text-sm">
													You can skip this step and set up your phone number
													later in Settings → Communications. Phone features
													include calls, SMS, and VoIP capabilities.
												</p>
											</div>
										</CardContent>
									</Card>
								</div>
							)}

							{/* Step 4: Bank Account */}
							{currentStep === 4 && (
								<div className="fade-in-50 animate-in space-y-8 duration-300">
									<div>
										<h2 className="text-3xl font-bold">Connect Your Bank</h2>
										<p className="text-muted-foreground mt-3 text-lg">
											Connect your business bank account to receive payments and
											manage finances.
										</p>
									</div>

									<Separator />

									{linkedBankAccounts > 0 ? (
										<Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
											<CheckCircle className="size-5 text-green-600 dark:text-green-400" />
											<AlertDescription className="text-green-900 dark:text-green-100">
												<span className="font-semibold">Success!</span>{" "}
												{linkedBankAccounts} bank account
												{linkedBankAccounts > 1 ? "s" : ""} connected
											</AlertDescription>
										</Alert>
									) : null}

									<Card
										className={cn(
											"border-2 transition-all",
											linkedBankAccounts === 0 ? "border-dashed" : "",
										)}
									>
										<CardContent className="flex flex-col items-center justify-center py-16 text-center">
											<div className="bg-primary/10 mb-6 rounded-full p-8">
												<CreditCard className="text-primary size-16" />
											</div>
											<h3 className="mb-3 text-2xl font-bold">
												{linkedBankAccounts > 0
													? "Add Another Account"
													: "Connect Your Bank"}
											</h3>
											<p className="text-muted-foreground mb-8 max-w-md text-lg">
												Securely link your business bank account with Plaid.
												Your credentials are encrypted and never stored on our
												servers.
											</p>
											{companyId && (
												<PlaidLinkButton
													companyId={companyId}
													onSuccess={() => {
														setLinkedBankAccounts((prev: number) => prev + 1);
														toast.success(
															"Your bank account has been connected successfully!",
														);
													}}
													size="lg"
												>
													{linkedBankAccounts > 0
														? "Add Another Account"
														: "Connect Bank Account"}
												</PlaidLinkButton>
											)}
										</CardContent>
									</Card>

									<Card className="border-primary/20 bg-primary/5">
										<CardContent className="flex gap-4 p-6">
											<Shield className="text-primary size-6 shrink-0" />
											<div className="space-y-2">
												<h4 className="font-semibold">Bank-Level Security</h4>
												<p className="text-muted-foreground text-sm">
													We use Plaid, the same technology trusted by companies
													like Venmo, Robinhood, and Coinbase. Your data is
													encrypted with 256-bit encryption and never stored on
													our servers.
												</p>
											</div>
										</CardContent>
									</Card>
								</div>
							)}

							{/* Navigation */}
							<div className="mt-12 flex items-center justify-between gap-4 border-t pt-8">
								<div>
									{companyId && currentStep === 1 && !hasActiveCompany && (
										<Button
											onClick={() => setArchiveDialogOpen(true)}
											type="button"
											variant="ghost"
										>
											Cancel Setup
										</Button>
									)}
								</div>
								<div className="flex gap-3">
									{currentStep > 1 && (
										<Button
											disabled={isLoading}
											onClick={() => setCurrentStep((prev: number) => prev - 1)}
											size="lg"
											type="button"
											variant="outline"
										>
											<ArrowLeft className="mr-2 size-4" />
											Back
										</Button>
									)}
									<Button
										className="min-w-[180px]"
										disabled={
											isLoading ||
											(currentStep === 4 && linkedBankAccounts === 0)
										}
										onClick={handleNext}
										size="lg"
										type="button"
									>
										{isLoading ? (
											<>
												<Loader2 className="mr-2 size-5 animate-spin" />
												Processing...
											</>
										) : currentStep === 3 ? (
											<>
												{phoneOption ? "Continue" : "Skip for Now"}
												<ArrowRight className="ml-2 size-5" />
											</>
										) : currentStep === 4 ? (
											<>
												Complete Setup
												<CheckCircle className="ml-2 size-5" />
											</>
										) : (
											<>
												Continue
												<ArrowRight className="ml-2 size-5" />
											</>
										)}
									</Button>
								</div>
							</div>
						</Form>
					</CardContent>
				</Card>

				{/* Help Text */}
				<p className="text-muted-foreground mt-8 text-center">
					Need help? Contact us at{" "}
					<a
						className="text-primary font-medium hover:underline"
						href="mailto:support@thorbis.com"
					>
						support@thorbis.com
					</a>
				</p>
			</div>

			{/* Modals & Dialogs */}
			{editingMember && (
				<TeamMemberEditDialog
					member={editingMember}
					onOpenChange={(open) => {
						if (!open) {
							setEditingMember(null);
						}
					}}
					onSave={(updatedMember) => {
						setTeamMembers((prev: ExtendedTeamMember[]) =>
							prev.map((m) =>
								m.email === updatedMember.email ? updatedMember : m,
							),
						);
						setEditingMember(null);
					}}
					open={true}
				/>
			)}

			<TeamBulkUploadDialog
				onImport={(members: TeamMemberRow[]) => {
					const membersWithIds = members.map((member) => ({
						...member,
						id: crypto.randomUUID(),
					}));
					setTeamMembers((prev: ExtendedTeamMember[]) => [
						...prev,
						...membersWithIds,
					]);
					setBulkUploadOpen(false);
				}}
				onOpenChange={setBulkUploadOpen}
				open={bulkUploadOpen}
			/>

			{companyId && (
				<>
					<PhoneNumberSearchModal
						companyId={companyId}
						onOpenChange={setPurchaseModalOpen}
						onSuccess={(phoneNumber) => {
							setSelectedPhoneNumber(phoneNumber);
							setPhoneOption("purchase");
							setPurchaseModalOpen(false);
							toast.success(
								`Phone number ${phoneNumber} purchased successfully!`,
							);
						}}
						open={purchaseModalOpen}
					/>

					<NumberPortingWizard
						onOpenChange={setPortingWizardOpen}
						onSuccess={(phoneNumber) => {
							setSelectedPhoneNumber(phoneNumber);
							setPhoneOption("port");
							setPortingWizardOpen(false);
							toast.success(`Porting request submitted for ${phoneNumber}`);
						}}
						open={portingWizardOpen}
					/>
				</>
			)}

			<AlertDialog onOpenChange={setArchiveDialogOpen} open={archiveDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Cancel Company Setup?</AlertDialogTitle>
						<AlertDialogDescription>
							This will cancel your company setup. Your progress will be saved
							and you can resume later from where you left off.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Continue Setup</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={handleArchive}
						>
							Cancel Setup
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
