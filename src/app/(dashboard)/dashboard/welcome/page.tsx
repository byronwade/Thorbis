"use client";

/**
 * Onboarding Welcome Page - Dashboard Style
 *
 * Features:
 * - Real industry dropdown
 * - Actual pricing data from pricing calculator
 * - Dashboard-consistent design
 * - Multi-step wizard
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Loader2,
	Building2,
	CreditCard,
	Check,
	ArrowRight,
	ArrowLeft,
	Phone,
	MapPin,
	Briefcase,
	Users,
	CheckCircle2,
	Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { completeOnboarding } from "@/actions/onboarding";

// Industry options for field service businesses
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

// Pricing from pricing calculator component
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
};

type Step = 1 | 2 | 3;

const formSchema = z.object({
	orgName: z.string().min(2, "Organization name must be at least 2 characters"),
	orgIndustry: z.string().min(1, "Please select an industry"),
	orgSize: z.string().min(1, "Please select company size"),
	orgPhone: z.string().min(10, "Valid phone number is required"),
	orgAddress: z.string().min(5, "Business address is required"),
	cardNumber: z.string().min(13, "Card number is required").optional(),
	cardExpiry: z.string().min(4, "Expiry is required").optional(),
	cardCvc: z.string().min(3, "CVC is required").optional(),
});

export default function WelcomePage() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState<Step>(1);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			orgName: "",
			orgIndustry: "",
			orgSize: "",
			orgPhone: "",
			orgAddress: "",
			cardNumber: "",
			cardExpiry: "",
			cardCvc: "",
		},
	});

	const handleNext = async () => {
		let isValid = false;

		if (currentStep === 1) {
			isValid = await form.trigger(["orgName", "orgIndustry", "orgSize"]);
		} else if (currentStep === 2) {
			isValid = await form.trigger(["orgPhone", "orgAddress"]);
		}

		if (isValid && currentStep < 3) {
			setCurrentStep((prev) => (prev + 1) as Step);
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep((prev) => (prev - 1) as Step);
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		setError(null);

		try {
			const formData = new FormData();
			formData.append("orgName", values.orgName);
			formData.append("orgIndustry", values.orgIndustry);
			formData.append("orgSize", values.orgSize);
			formData.append("orgPhone", values.orgPhone);
			formData.append("orgAddress", values.orgAddress);

			const result = await completeOnboarding(formData);

			if (result.success) {
				router.push("/dashboard");
			} else {
				setError(result.error || "Failed to complete onboarding");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const renderStepIndicator = () => (
		<div className="mb-8 flex items-center justify-center gap-2">
			{[1, 2, 3].map((step) => (
				<div key={step} className="flex items-center">
					<div
						className={`flex size-10 items-center justify-center rounded-full font-semibold text-sm transition-all ${
							currentStep >= step
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground"
						}`}
					>
						{currentStep > step ? <Check className="size-5" /> : step}
					</div>
					{step < 3 && (
						<div
							className={`mx-2 h-0.5 w-16 transition-colors ${
								currentStep > step ? "bg-primary" : "bg-muted"
							}`}
						/>
					)}
				</div>
			))}
		</div>
	);

	return (
		<div className="container mx-auto max-w-4xl py-8">
			{/* Header with Logo */}
			<div className="mb-8 text-center">
				<div className="mb-6 flex justify-center">
					<div className="flex items-center gap-3">
						<div className="flex size-12 items-center justify-center rounded-xl bg-primary">
							<span className="text-2xl font-bold text-primary-foreground">T</span>
						</div>
						<span className="text-2xl font-bold">Thorbis</span>
					</div>
				</div>
				<h1 className="mb-2 font-bold text-3xl tracking-tight">Welcome to Thorbis</h1>
				<p className="text-muted-foreground text-lg">Let's set up your organization in just a few steps</p>
			</div>

			{renderStepIndicator()}

			<Card>
				<CardContent className="p-6 sm:p-8">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Step 1: Business Information */}
							{currentStep === 1 && (
								<div className="space-y-6">
									<div>
										<div className="mb-4 flex items-center gap-3">
											<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
												<Building2 className="size-6 text-primary" />
											</div>
											<div>
												<h2 className="font-semibold text-xl">Business Information</h2>
												<p className="text-muted-foreground text-sm">
													Tell us about your company
												</p>
											</div>
										</div>
									</div>

									<FormField
										control={form.control}
										name="orgName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Company Name</FormLabel>
												<FormControl>
													<Input placeholder="Acme HVAC Services" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-6 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="orgIndustry"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Industry</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
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
													<FormLabel>Company Size</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
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
									</div>
								</div>
							)}

							{/* Step 2: Contact Details */}
							{currentStep === 2 && (
								<div className="space-y-6">
									<div>
										<div className="mb-4 flex items-center gap-3">
											<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
												<Phone className="size-6 text-primary" />
											</div>
											<div>
												<h2 className="font-semibold text-xl">Contact Information</h2>
												<p className="text-muted-foreground text-sm">
													How can customers reach you?
												</p>
											</div>
										</div>
									</div>

									<FormField
										control={form.control}
										name="orgPhone"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Business Phone</FormLabel>
												<FormControl>
													<Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
												</FormControl>
												<FormDescription>
													This will be displayed on invoices and estimates
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="orgAddress"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Business Address</FormLabel>
												<FormControl>
													<Input placeholder="123 Main St, City, State 12345" {...field} />
												</FormControl>
												<FormDescription>
													Your main office or service address
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}

							{/* Step 3: Billing & Plan */}
							{currentStep === 3 && (
								<div className="space-y-6">
									<div>
										<div className="mb-4 flex items-center gap-3">
											<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
												<CreditCard className="size-6 text-primary" />
											</div>
											<div>
												<h2 className="font-semibold text-xl">Choose Your Plan</h2>
												<p className="text-muted-foreground text-sm">
													Start your 14-day free trial
												</p>
											</div>
										</div>
									</div>

									{/* Pricing Card */}
									<Card className="border-2 border-primary/20 bg-primary/5">
										<CardHeader>
											<div className="flex items-center justify-between">
												<div>
													<CardTitle className="text-2xl">Professional Plan</CardTitle>
													<CardDescription>Everything you need to grow</CardDescription>
												</div>
												<div className="text-right">
													<div className="font-bold text-4xl">${PRICING.baseFee}</div>
													<div className="text-muted-foreground text-sm">per month</div>
												</div>
											</div>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid gap-3 sm:grid-cols-2">
												{PRICING.features.map((feature, idx) => (
													<div key={idx} className="flex items-center gap-2">
														<CheckCircle2 className="size-4 text-primary" />
														<span className="text-sm">{feature}</span>
													</div>
												))}
											</div>

											<Separator />

											<div className="flex items-center justify-center gap-2 rounded-lg bg-background p-3">
												<Shield className="size-4 text-primary" />
												<span className="text-sm">
													14-day free trial • No credit card required today • Cancel anytime
												</span>
											</div>
										</CardContent>
									</Card>

									{/* Payment Form Placeholder */}
									<div className="space-y-4">
										<FormField
											control={form.control}
											name="cardNumber"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Card Number (Optional)</FormLabel>
													<FormControl>
														<Input placeholder="4242 4242 4242 4242" {...field} />
													</FormControl>
													<FormDescription>
														You can add payment later during your free trial
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid gap-4 sm:grid-cols-2">
											<FormField
												control={form.control}
												name="cardExpiry"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Expiry (Optional)</FormLabel>
														<FormControl>
															<Input placeholder="MM/YY" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="cardCvc"
												render={({ field }) => (
													<FormItem>
														<FormLabel>CVC (Optional)</FormLabel>
														<FormControl>
															<Input placeholder="123" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>

									{error && (
										<div className="rounded-lg bg-destructive/10 p-4 text-destructive text-sm">
											{error}
										</div>
									)}
								</div>
							)}

							{/* Navigation */}
							<div className="flex items-center justify-between pt-6">
								<Button
									type="button"
									variant="outline"
									onClick={handleBack}
									disabled={currentStep === 1 || isLoading}
								>
									<ArrowLeft className="mr-2 size-4" />
									Back
								</Button>

								{currentStep === 3 ? (
									<Button type="submit" disabled={isLoading}>
										{isLoading ? (
											<>
												<Loader2 className="mr-2 size-4 animate-spin" />
												Setting up...
											</>
										) : (
											<>
												Complete Setup
												<CheckCircle2 className="ml-2 size-4" />
											</>
										)}
									</Button>
								) : (
									<Button type="button" onClick={handleNext}>
										Continue
										<ArrowRight className="ml-2 size-4" />
									</Button>
								)}
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			{/* Help */}
			<div className="mt-8 text-center text-muted-foreground text-sm">
				<p>
					Need help?{" "}
					<a href="mailto:support@thorbis.com" className="font-medium text-primary hover:underline">
						Contact our support team
					</a>
				</p>
			</div>
		</div>
	);
}
