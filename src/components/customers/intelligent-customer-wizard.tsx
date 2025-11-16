"use client";

/**
 * Intelligent Customer Wizard - Mobile-First Multi-Step Form
 *
 * Smart features:
 * - Progressive disclosure with 4 focused steps
 * - Fixed minimum height to prevent layout shift
 * - Mobile-optimized with touch-friendly controls
 * - Context-aware fields (show/hide based on customer type)
 * - Real-time validation feedback
 * - Quick templates for common customer types
 *
 * Performance optimizations:
 * - Client component for interactivity
 * - Optimistic UI updates
 * - Form state management with useState
 */

import {
	AlertCircle,
	ArrowLeft,
	ArrowRight,
	Building2,
	CheckCircle2,
	CreditCard,
	Factory,
	Home,
	MapPin,
	Sparkles,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCustomer } from "@/actions/customers";
import { SmartAddressInput } from "@/components/customers/smart-address-input";
import { SmartContactInput } from "@/components/customers/smart-contact-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type CustomerType = "residential" | "commercial" | "industrial";

type WizardStep = 1 | 2 | 3 | 4;

type CustomerData = {
	// Step 1: Quick Start
	type: CustomerType;
	companyName: string;
	industry: string;

	// Step 2: Contact
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	preferredContactMethod: string;

	// Step 3: Location
	address: string;
	address2: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;

	// Step 4: Business Details
	paymentTerms: string;
	creditLimit: string;
	taxExempt: boolean;
	taxExemptNumber: string;
	billingEmail: string;
	source: string;
	tags: string;
	notes: string;
	internalNotes: string;
};

const CUSTOMER_TEMPLATES = {
	residential: {
		name: "Homeowner",
		icon: Home,
		description: "Homeowners & individuals",
		defaults: {
			type: "residential" as CustomerType,
			paymentTerms: "due_on_receipt",
			creditLimit: "0",
			industry: "residential",
		},
	},
	commercial: {
		name: "Business",
		icon: Building2,
		description: "Businesses & offices",
		defaults: {
			type: "commercial" as CustomerType,
			paymentTerms: "net_30",
			creditLimit: "10000",
			industry: "commercial",
		},
	},
	industrial: {
		name: "Industrial",
		icon: Factory,
		description: "Factories & warehouses",
		defaults: {
			type: "industrial" as CustomerType,
			paymentTerms: "net_30",
			creditLimit: "50000",
			industry: "industrial",
		},
	},
};

const STEP_INFO = {
	1: {
		title: "Customer Type",
		icon: Building2,
		description: "Choose customer type",
	},
	2: {
		title: "Contact Info",
		icon: User,
		description: "Who should we contact?",
	},
	3: {
		title: "Location",
		icon: MapPin,
		description: "Where do we provide service?",
	},
	4: {
		title: "Business Details",
		icon: CreditCard,
		description: "Payment & billing info",
	},
};

export function IntelligentCustomerWizard() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState<WizardStep>(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<string[]>([]);

	const [customerData, setCustomerData] = useState<CustomerData>({
		type: "residential",
		companyName: "",
		industry: "",
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		preferredContactMethod: "email",
		address: "",
		address2: "",
		city: "",
		state: "",
		zipCode: "",
		country: "USA",
		paymentTerms: "due_on_receipt",
		creditLimit: "0",
		taxExempt: false,
		taxExemptNumber: "",
		billingEmail: "",
		source: "",
		tags: "",
		notes: "",
		internalNotes: "",
	});

	const updateField = <K extends keyof CustomerData>(field: K, value: CustomerData[K]) => {
		setCustomerData((prev) => ({ ...prev, [field]: value }));
	};

	// Apply template defaults
	const applyTemplate = (template: keyof typeof CUSTOMER_TEMPLATES) => {
		const templateData = CUSTOMER_TEMPLATES[template].defaults;
		setCustomerData((prev) => ({ ...prev, ...templateData }));
		setCurrentStep(2); // Move to next step
	};

	// Validate current step
	const validateStep = (step: WizardStep): boolean => {
		const newErrors: string[] = [];

		switch (step) {
			case 1:
				if (!customerData.type) {
					newErrors.push("Customer type is required");
				}
				if (customerData.type !== "residential" && !customerData.companyName) {
					newErrors.push("Company name is required for business customers");
				}
				break;
			case 2:
				if (!customerData.firstName) {
					newErrors.push("First name is required");
				}
				if (!customerData.lastName) {
					newErrors.push("Last name is required");
				}
				if (!customerData.email) {
					newErrors.push("Email is required");
				}
				if (!customerData.phone) {
					newErrors.push("Phone is required");
				}
				break;
			case 3:
				// Address is optional
				break;
			case 4:
				// Business details are optional
				break;
		}

		setErrors(newErrors);
		return newErrors.length === 0;
	};

	const nextStep = () => {
		if (validateStep(currentStep)) {
			setCurrentStep((prev) => Math.min(prev + 1, 4) as WizardStep);
			setErrors([]);
		}
	};

	const prevStep = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1) as WizardStep);
		setErrors([]);
	};

	const handleSubmit = async () => {
		if (!validateStep(4)) {
			return;
		}

		setIsSubmitting(true);
		setErrors([]);

		try {
			const formData = new FormData();

			// Basic info
			formData.append("type", customerData.type);
			formData.append("companyName", customerData.companyName);

			// Contact info
			const contact = {
				id: "primary",
				firstName: customerData.firstName,
				lastName: customerData.lastName,
				email: customerData.email,
				phone: customerData.phone,
				role: "primary",
				isPrimary: true,
			};
			formData.append("contacts", JSON.stringify([contact]));

			// Primary property (if address provided)
			if (customerData.address || customerData.city) {
				const property = {
					id: "primary",
					name: "Primary Location",
					address: customerData.address,
					address2: customerData.address2,
					city: customerData.city,
					state: customerData.state,
					zipCode: customerData.zipCode,
					country: customerData.country,
					propertyType: customerData.type,
					isPrimary: true,
					notes: "",
				};
				formData.append("properties", JSON.stringify([property]));
			} else {
				formData.append("properties", JSON.stringify([]));
			}

			// Business details
			formData.append("preferredContactMethod", customerData.preferredContactMethod);
			formData.append("paymentTerms", customerData.paymentTerms);
			formData.append("creditLimit", customerData.creditLimit);
			formData.append("taxExempt", customerData.taxExempt ? "on" : "");
			formData.append("taxExemptNumber", customerData.taxExemptNumber);
			formData.append("billingEmail", customerData.billingEmail);
			formData.append("source", customerData.source);
			formData.append("tags", customerData.tags);
			formData.append("notes", customerData.notes);
			formData.append("internalNotes", customerData.internalNotes);

			const result = await createCustomer(formData);

			if (result.success) {
				router.push("/dashboard/customers");
			} else {
				setErrors([result.error || "Failed to create customer"]);
			}
		} catch (_error) {
			setErrors(["An unexpected error occurred"]);
		} finally {
			setIsSubmitting(false);
		}
	};

	const progress = (currentStep / 4) * 100;
	const StepIcon = STEP_INFO[currentStep].icon;

	return (
		<div className="container mx-auto max-w-4xl space-y-6 px-4 py-6 md:py-8">
			{/* Header */}
			<div className="space-y-2 text-center md:text-left">
				<div className="flex items-center justify-center gap-2 md:justify-start">
					<Sparkles className="size-6 text-primary" />
					<h1 className="font-bold text-2xl tracking-tight md:text-3xl">Add New Customer</h1>
				</div>
				<p className="text-muted-foreground text-sm md:text-base">Quick 4-step process to get started</p>
			</div>

			{/* Progress Bar */}
			<div className="space-y-3">
				<div className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-2">
						<StepIcon className="size-4 text-primary md:size-5" />
						<span className="font-medium">Step {currentStep} of 4</span>
					</div>
					<span className="text-muted-foreground">{Math.round(progress)}%</span>
				</div>
				<Progress className="h-2" value={progress} />
				<p className="text-center text-muted-foreground text-xs md:text-left md:text-sm">
					{STEP_INFO[currentStep].description}
				</p>
			</div>

			{/* Error Display */}
			{errors.length > 0 && (
				<Alert variant="destructive">
					<AlertCircle className="size-4" />
					<AlertDescription>
						<ul className="list-inside list-disc space-y-1">
							{errors.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</AlertDescription>
				</Alert>
			)}

			{/* Step Content - Fixed min-height to prevent jumping */}
			<Card>
				<CardContent className="min-h-[400px] p-4 md:min-h-[500px] md:p-8">
					{/* Step 1: Quick Start & Templates */}
					{currentStep === 1 && (
						<div className="flex h-full flex-col space-y-6">
							<div className="space-y-2 text-center md:text-left">
								<h2 className="font-semibold text-xl md:text-2xl">Choose Customer Type</h2>
								<p className="text-muted-foreground text-sm">Select a template to get started quickly</p>
							</div>

							{/* Quick Templates */}
							<div className="grid flex-1 gap-3 sm:grid-cols-3 md:gap-4">
								{Object.entries(CUSTOMER_TEMPLATES).map(([key, template]) => {
									const Icon = template.icon;
									const isSelected = customerData.type === key;

									return (
										<button
											className={`group relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 p-4 text-center transition-all hover:shadow-md active:scale-95 md:p-6 ${
												isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50"
											}`}
											key={key}
											onClick={() => applyTemplate(key as keyof typeof CUSTOMER_TEMPLATES)}
											type="button"
										>
											<div className={`rounded-lg p-2 md:p-3 ${isSelected ? "bg-primary/10" : "bg-muted"}`}>
												<Icon className={`size-6 md:size-8 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
											</div>
											<div className="space-y-1">
												<h3 className="font-semibold text-base md:text-lg">{template.name}</h3>
												<p className="text-muted-foreground text-xs">{template.description}</p>
											</div>
											{isSelected && (
												<Badge className="absolute top-2 right-2 text-xs" variant="default">
													<CheckCircle2 className="mr-1 size-3" />
													Selected
												</Badge>
											)}
										</button>
									);
								})}
							</div>

							{/* Company Name (for non-residential) */}
							{customerData.type !== "residential" && (
								<div className="space-y-4 rounded-lg border bg-muted/30 p-4 md:p-6">
									<div className="space-y-2">
										<Label htmlFor="companyName">
											Company Name <span className="text-destructive">*</span>
										</Label>
										<Input
											id="companyName"
											onChange={(e) => updateField("companyName", e.target.value)}
											placeholder="ABC Corporation"
											type="text"
											value={customerData.companyName}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="industry">Industry (Optional)</Label>
										<Select onValueChange={(value) => updateField("industry", value)} value={customerData.industry}>
											<SelectTrigger id="industry">
												<SelectValue placeholder="Select industry" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="retail">Retail</SelectItem>
												<SelectItem value="healthcare">Healthcare</SelectItem>
												<SelectItem value="hospitality">Hospitality</SelectItem>
												<SelectItem value="manufacturing">Manufacturing</SelectItem>
												<SelectItem value="education">Education</SelectItem>
												<SelectItem value="real_estate">Real Estate</SelectItem>
												<SelectItem value="technology">Technology</SelectItem>
												<SelectItem value="other">Other</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Step 2: Contact Information */}
					{currentStep === 2 && (
						<div className="flex h-full flex-col space-y-6">
							<div className="space-y-2 text-center md:text-left">
								<h2 className="font-semibold text-xl md:text-2xl">Primary Contact</h2>
								<p className="text-muted-foreground text-sm">Who should we contact about this account?</p>
							</div>

							<div className="flex-1 space-y-6">
								<SmartContactInput
									initialContact={{
										firstName: customerData.firstName,
										lastName: customerData.lastName,
										email: customerData.email,
										phone: customerData.phone,
									}}
									onContactChange={(data) => {
										updateField("firstName", data.firstName);
										updateField("lastName", data.lastName);
										updateField("email", data.email);
										updateField("phone", data.phone);
									}}
									showAiHelper={true}
								/>

								<div className="space-y-2">
									<Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
									<Select
										onValueChange={(value) => updateField("preferredContactMethod", value)}
										value={customerData.preferredContactMethod}
									>
										<SelectTrigger id="preferredContactMethod">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="email">Email</SelectItem>
											<SelectItem value="phone">Phone Call</SelectItem>
											<SelectItem value="sms">Text Message (SMS)</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					)}

					{/* Step 3: Location */}
					{currentStep === 3 && (
						<div className="flex h-full flex-col space-y-6">
							<div className="space-y-2 text-center md:text-left">
								<h2 className="font-semibold text-xl md:text-2xl">Service Location</h2>
								<p className="text-muted-foreground text-sm">
									Where will we provide service? (Optional - can add later)
								</p>
							</div>

							<div className="flex-1">
								<SmartAddressInput
									initialAddress={{
										address: customerData.address,
										address2: customerData.address2,
										city: customerData.city,
										state: customerData.state,
										zipCode: customerData.zipCode,
										country: customerData.country,
									}}
									label="Primary Service Address"
									onAddressChange={(data) => {
										updateField("address", data.address);
										updateField("address2", data.address2 || "");
										updateField("city", data.city);
										updateField("state", data.state);
										updateField("zipCode", data.zipCode);
										updateField("country", data.country);
									}}
									required={false}
								/>
							</div>

							<div className="rounded-lg border bg-muted/50 p-4 text-center">
								<p className="text-muted-foreground text-sm">
									💡 Tip: You can skip this and add addresses later from the customer profile
								</p>
							</div>
						</div>
					)}

					{/* Step 4: Business Details */}
					{currentStep === 4 && (
						<div className="flex h-full flex-col space-y-6">
							<div className="space-y-2 text-center md:text-left">
								<h2 className="font-semibold text-xl md:text-2xl">Business Details</h2>
								<p className="text-muted-foreground text-sm">Optional billing and account information</p>
							</div>

							<div className="flex-1 space-y-6 overflow-y-auto">
								<div className="grid gap-4 md:gap-6 lg:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="paymentTerms">Payment Terms</Label>
										<Select
											onValueChange={(value) => updateField("paymentTerms", value)}
											value={customerData.paymentTerms}
										>
											<SelectTrigger id="paymentTerms">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
												<SelectItem value="net_15">Net 15</SelectItem>
												<SelectItem value="net_30">Net 30</SelectItem>
												<SelectItem value="net_60">Net 60</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="creditLimit">Credit Limit ($)</Label>
										<Input
											id="creditLimit"
											min="0"
											onChange={(e) => updateField("creditLimit", e.target.value)}
											placeholder="0"
											type="number"
											value={customerData.creditLimit}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="billingEmail">Billing Email</Label>
										<Input
											id="billingEmail"
											onChange={(e) => updateField("billingEmail", e.target.value)}
											placeholder="billing@example.com"
											type="email"
											value={customerData.billingEmail}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="source">How did they find us?</Label>
										<Select onValueChange={(value) => updateField("source", value)} value={customerData.source}>
											<SelectTrigger id="source">
												<SelectValue placeholder="Select source" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="referral">Referral</SelectItem>
												<SelectItem value="google">Google Search</SelectItem>
												<SelectItem value="facebook">Facebook</SelectItem>
												<SelectItem value="yelp">Yelp</SelectItem>
												<SelectItem value="direct">Direct</SelectItem>
												<SelectItem value="other">Other</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2 lg:col-span-2">
										<Label htmlFor="tags">Tags (Optional)</Label>
										<Input
											id="tags"
											onChange={(e) => updateField("tags", e.target.value)}
											placeholder="VIP, priority, recurring"
											type="text"
											value={customerData.tags}
										/>
									</div>
								</div>

								<div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
									<input
										checked={customerData.taxExempt}
										className="mt-1 size-4 rounded border-border"
										id="taxExempt"
										onChange={(e) => updateField("taxExempt", e.target.checked)}
										type="checkbox"
									/>
									<div className="flex-1">
										<Label className="font-medium" htmlFor="taxExempt">
											Tax Exempt Customer
										</Label>
										<p className="text-muted-foreground text-xs">Check if this customer is exempt from sales tax</p>
									</div>
								</div>

								{customerData.taxExempt && (
									<div className="space-y-2">
										<Label htmlFor="taxExemptNumber">Tax Exempt Number</Label>
										<Input
											id="taxExemptNumber"
											onChange={(e) => updateField("taxExemptNumber", e.target.value)}
											placeholder="EX-12345"
											type="text"
											value={customerData.taxExemptNumber}
										/>
									</div>
								)}

								<div className="space-y-2">
									<Label htmlFor="notes">Customer Notes (Optional)</Label>
									<Textarea
										className="resize-none"
										id="notes"
										onChange={(e) => updateField("notes", e.target.value)}
										placeholder="Special instructions, preferences, or other information..."
										rows={3}
										value={customerData.notes}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="internalNotes">Internal Notes (Staff Only, Optional)</Label>
									<Textarea
										className="resize-none"
										id="internalNotes"
										onChange={(e) => updateField("internalNotes", e.target.value)}
										placeholder="Internal notes not visible to customer..."
										rows={2}
										value={customerData.internalNotes}
									/>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Navigation - Sticky on mobile */}
			<div className="-mx-4 sticky bottom-0 z-10 border-t bg-background p-4 shadow-lg md:relative md:mx-0 md:border-0 md:p-0 md:shadow-none">
				<div className="flex items-center justify-between gap-3">
					<Button
						className="flex-1 sm:flex-none"
						disabled={currentStep === 1}
						onClick={prevStep}
						size="lg"
						type="button"
						variant="outline"
					>
						<ArrowLeft className="mr-2 size-4" />
						<span className="hidden sm:inline">Previous</span>
						<span className="sm:hidden">Back</span>
					</Button>

					<Button
						className="sm:hidden"
						onClick={() => router.push("/dashboard/customers")}
						size="lg"
						type="button"
						variant="ghost"
					>
						Cancel
					</Button>

					{currentStep < 4 ? (
						<Button className="flex-1 sm:flex-none" onClick={nextStep} size="lg" type="button">
							<span className="hidden sm:inline">Next Step</span>
							<span className="sm:hidden">Next</span>
							<ArrowRight className="ml-2 size-4" />
						</Button>
					) : (
						<Button
							className="flex-1 sm:flex-none"
							disabled={isSubmitting}
							onClick={handleSubmit}
							size="lg"
							type="button"
						>
							{isSubmitting ? (
								"Creating..."
							) : (
								<>
									<CheckCircle2 className="mr-2 size-4" />
									Create Customer
								</>
							)}
						</Button>
					)}
				</div>

				<Button
					className="mt-3 hidden w-full sm:block"
					onClick={() => router.push("/dashboard/customers")}
					type="button"
					variant="ghost"
				>
					Cancel
				</Button>
			</div>
		</div>
	);
}
