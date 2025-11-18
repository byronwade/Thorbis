"use client";

/**
 * Welcome Page Client Component
 *
 * Handles all interactive onboarding logic:
 * - Multi-step form with validation
 * - Team member management
 * - Bank account connection
 * - Payment processing
 *
 * Features:
 * - Beautiful, modern UI
 * - Smooth animations
 * - Real-time validation
 * - Progress persistence
 * - Mobile responsive
 */

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowLeft,
	ArrowRight,
	ArrowLeft as BackIcon,
	Building2,
	Check,
	CheckCircle,
	CreditCard,
	Edit,
	FileSpreadsheet,
	Loader2,
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
	{
		id: 1,
		title: "Company",
		icon: Building2,
		description: "Basic information",
	},
	{ id: 2, title: "Team", icon: Users, description: "Add members" },
	{ id: 3, title: "Banking", icon: CreditCard, description: "Connect account" },
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
	incompleteCompany: any | null;
	hasActiveCompany: boolean;
};

export function WelcomePageClient({
	user,
	incompleteCompany,
	hasActiveCompany,
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

	// Bank account state
	const [linkedBankAccounts, setLinkedBankAccounts] = useState(
		incompleteCompany?.onboardingProgress?.step3?.bankAccounts || 0,
	);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			orgName: incompleteCompany?.name || "",
			orgIndustry: incompleteCompany?.industry || "",
			orgSize: incompleteCompany?.size || "",
			orgPhone: incompleteCompany?.phone || "",
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

			// Load team members from saved progress
			if (incompleteCompany.onboardingProgress?.step2?.teamMembers) {
				setTeamMembers(incompleteCompany.onboardingProgress.step2.teamMembers);
			}

			// Load bank account count from saved progress
			if (incompleteCompany.onboardingProgress?.step3?.bankAccounts) {
				setLinkedBankAccounts(
					incompleteCompany.onboardingProgress.step3.bankAccounts,
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

	// Save progress for current step
	const saveStepProgress = async (
		step: number,
		data: Record<string, unknown>,
	) => {
		if (!companyId) {
			return;
		}

		try {
			await saveOnboardingStepProgress(companyId, step, data);
		} catch (_error) {
			// Don't block user progress if saving fails
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
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Failed to save company");
				}

				if (data.companyId) {
					setCompanyId(data.companyId);
				}

				// Save step 1 progress (will update currentStep to 2 in database)
				await saveStepProgress(1, {
					companyInfo: {
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
					},
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
				// Save step 2 progress (will update currentStep to 3 in database)
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
			if (linkedBankAccounts === 0) {
				toast.error("Please connect a bank account to continue");
				return;
			}

			setIsLoading(true);
			try {
				// Save step 3 progress (marks onboarding as ready for payment)
				await saveStepProgress(3, {
					bankAccounts: linkedBankAccounts,
					completed: true,
					completedAt: new Date().toISOString(),
				});

				// Proceed to payment
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
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Payment setup failed",
			);
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

	return (
		<div className="from-background via-background to-primary/5 flex min-h-screen flex-col bg-gradient-to-br">
			{/* Header */}
			<OnboardingHeader />

			{/* Main Content */}
			<div className="container mx-auto max-w-4xl flex-1 px-4 py-8 lg:py-12">
				{/* Welcome Banner (only for new users) */}
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

				{/* Back to Dashboard (for existing users) */}
				{hasActiveCompany && (
					<div className="mb-6">
						<Link href="/dashboard">
							<Button size="sm" variant="ghost">
								<BackIcon className="mr-2 size-4" />
								Back to Dashboard
							</Button>
						</Link>
					</div>
				)}

				{/* Progress Steps */}
				<div className="mb-8">
					<div className="relative flex items-center justify-between">
						{STEPS.map((step, index) => (
							<div className="flex flex-1 items-center" key={step.id}>
								<div className="flex flex-col items-center">
									<div
										className={cn(
											"relative z-10 flex size-14 items-center justify-center rounded-full border-2 transition-all duration-300",
											currentStep >= step.id
												? "border-primary bg-primary text-primary-foreground shadow-primary/30 scale-105 shadow-lg"
												: "border-muted-foreground/30 bg-background text-muted-foreground",
										)}
									>
										{currentStep > step.id ? (
											<Check className="size-6" />
										) : (
											<step.icon className="size-6" />
										)}
									</div>
									<div className="mt-3 text-center">
										<span
											className={cn(
												"block text-sm font-medium",
												currentStep >= step.id
													? "text-foreground"
													: "text-muted-foreground",
											)}
										>
											{step.title}
										</span>
										<span className="text-muted-foreground block text-xs">
											{step.description}
										</span>
									</div>
								</div>
								{index < STEPS.length - 1 && (
									<div className="flex-1 px-4">
										<div
											className={cn(
												"h-1 rounded-full transition-colors duration-300",
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

				{/* Content Card */}
				<Card className="shadow-2xl">
					<CardContent className="p-6 sm:p-8 lg:p-10">
						<Form {...form}>
							{/* Step 1: Company Info */}
							{currentStep === 1 && (
								<div className="fade-in-50 animate-in space-y-6 duration-300">
									<div>
										<h2 className="text-2xl font-semibold">
											Company Information
										</h2>
										<p className="text-muted-foreground mt-2">
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
													<FormLabel>Company Name *</FormLabel>
													<FormControl>
														<Input
															className="h-11"
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
											name="orgIndustry"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Industry *</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="h-11">
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
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="h-11">
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
														<Input
															className="h-11"
															placeholder="(555) 123-4567"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="sm:col-span-2">
											<Label>Business Address *</Label>
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
													<FormLabel>Website</FormLabel>
													<FormControl>
														<Input
															className="h-11"
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
													<FormLabel>Tax ID / EIN</FormLabel>
													<FormControl>
														<Input
															className="h-11"
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
								<div className="fade-in-50 animate-in space-y-6 duration-300">
									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<div>
											<h2 className="text-2xl font-semibold">Team Members</h2>
											<p className="text-muted-foreground mt-2">
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
													setTeamMembers((prev) => [...prev, newMember]);
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
												<div className="bg-primary/10 mb-4 rounded-full p-4">
													<Users className="text-primary size-12" />
												</div>
												<h3 className="mb-2 text-lg font-semibold">
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
																					setTeamMembers((prev) =>
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

							{/* Step 3: Bank Account */}
							{currentStep === 3 && (
								<div className="fade-in-50 animate-in space-y-6 duration-300">
									<div>
										<h2 className="text-2xl font-semibold">
											Connect Your Bank
										</h2>
										<p className="text-muted-foreground mt-2">
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
											<div className="bg-primary/10 mb-6 rounded-full p-6">
												<CreditCard className="text-primary size-12" />
											</div>
											<h3 className="mb-2 text-xl font-semibold">
												{linkedBankAccounts > 0
													? "Add Another Account"
													: "Connect Your Bank"}
											</h3>
											<p className="text-muted-foreground mb-8 max-w-md">
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
							<div className="mt-10 flex items-center justify-between gap-4 border-t pt-8">
								<div>
									{companyId && currentStep === 1 && !hasActiveCompany && (
										<Button
											className="text-muted-foreground"
											onClick={() => setArchiveDialogOpen(true)}
											size="sm"
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
										className="min-w-[150px]"
										disabled={
											isLoading ||
											(currentStep === 3 && linkedBankAccounts === 0)
										}
										onClick={handleNext}
										size="lg"
										type="button"
									>
										{isLoading ? (
											<>
												<Loader2 className="mr-2 size-4 animate-spin" />
												Processing...
											</>
										) : currentStep === 3 ? (
											<>
												Complete Setup
												<CheckCircle className="ml-2 size-4" />
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
				<p className="text-muted-foreground mt-8 text-center text-sm">
					Need help? Contact us at{" "}
					<a
						className="text-primary font-medium hover:underline"
						href="mailto:support@thorbis.com"
					>
						support@thorbis.com
					</a>
				</p>
			</div>

			{/* Dialogs */}
			{editingMember && (
				<TeamMemberEditDialog
					member={editingMember}
					onOpenChange={(open) => {
						if (!open) {
							setEditingMember(null);
						}
					}}
					onSave={(updatedMember) => {
						setTeamMembers((prev) =>
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
					setTeamMembers((prev) => [...prev, ...membersWithIds]);
					setBulkUploadOpen(false);
				}}
				onOpenChange={setBulkUploadOpen}
				open={bulkUploadOpen}
			/>

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
