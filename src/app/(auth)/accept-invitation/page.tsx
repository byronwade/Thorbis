/**
 * Accept Team Invitation Page
 *
 * Allows invited users to accept invitations via magic link
 */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertCircle,
	CheckCircle,
	Eye,
	EyeOff,
	Loader2,
	User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { acceptTeamInvitation } from "@/actions/accept-invitation";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useToast } from "@/hooks/use-toast";

const formSchema = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		email: z.string().email("Invalid email address"),
		phone: z.string().optional(),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[0-9]/, "Password must contain at least one number"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
		photo: z.instanceof(File).optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type FormData = z.infer<typeof formSchema>;

function AcceptInvitationContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [tokenValid, setTokenValid] = useState(false);
	const [tokenError, setTokenError] = useState<string | null>(null);
	const [invitationData, setInvitationData] = useState<{
		email: string;
		firstName: string;
		lastName: string;
		phone?: string;
		companyName: string;
		role: string;
	} | null>(null);
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			password: "",
			confirmPassword: "",
		},
	});

	const token = searchParams?.get("token");

	// Verify token on mount
	useEffect(() => {
		async function verifyToken() {
			if (!token) {
				setTokenError("No invitation token provided");
				setIsLoading(false);
				return;
			}

			try {
				// Verify token and get invitation details
				const response = await fetch(
					`/api/verify-invitation?token=${encodeURIComponent(token)}`,
				);

				if (!response.ok) {
					throw new Error("Failed to verify invitation");
				}

				const data = await response.json();

				if (!data.valid) {
					setTokenError(data.error || "Invalid invitation token");
					setIsLoading(false);
					return;
				}

				// Set invitation data
				setInvitationData(data.invitation);
				setTokenValid(true);

				// Pre-fill form
				form.setValue("email", data.invitation.email);
				form.setValue("firstName", data.invitation.firstName);
				form.setValue("lastName", data.invitation.lastName);
				if (data.invitation.phone) {
					form.setValue("phone", data.invitation.phone);
				}
			} catch (_error) {
				setTokenError("Failed to verify invitation. Please try again.");
			} finally {
				setIsLoading(false);
			}
		}

		verifyToken();
	}, [token, form]);

	const onSubmit = async (data: FormData) => {
		if (!token) {
			toast.error("No invitation token provided");
			return;
		}

		setIsSubmitting(true);

		try {
			const formData = new FormData();
			formData.append("token", token);
			formData.append("firstName", data.firstName);
			formData.append("lastName", data.lastName);
			formData.append("email", data.email);
			formData.append("phone", data.phone || "");
			formData.append("password", data.password);
			if (data.photo) {
				formData.append("photo", data.photo);
			}

			const result = await acceptTeamInvitation(formData);

			if (result.success) {
				toast.success("Invitation accepted! Logging you in...");
				// Redirect to dashboard after a short delay
				setTimeout(() => {
					router.push("/dashboard");
				}, 1500);
			} else {
				toast.error(result.error || "Failed to accept invitation");
			}
		} catch (_error) {
			toast.error("An unexpected error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Photo size must be less than 5MB");
				return;
			}

			form.setValue("photo", file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPhotoPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
				<Card className="w-full max-w-md">
					<CardContent className="flex flex-col items-center gap-4 pt-6">
						<Loader2 className="size-8 animate-spin text-primary" />
						<p className="text-muted-foreground">Verifying invitation...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!tokenValid || tokenError) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-center">Invalid Invitation</CardTitle>
						<CardDescription className="text-center">
							This invitation link is invalid or has expired
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Alert variant="destructive">
							<AlertCircle className="size-4" />
							<AlertDescription>
								{tokenError || "The invitation token is invalid"}
							</AlertDescription>
						</Alert>
						<div className="mt-6 space-y-2 text-center text-sm">
							<p>
								If you believe this is an error, please contact the person who
								invited you.
							</p>
							<Button
								className="mt-4 w-full"
								onClick={() => router.push("/login")}
								variant="outline"
							>
								Go to Login
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle>Accept Team Invitation</CardTitle>
					<CardDescription>
						You've been invited to join{" "}
						<strong>{invitationData?.companyName}</strong> as a{" "}
						<strong>{invitationData?.role}</strong>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
							{/* Profile Photo */}
							<div className="flex items-center gap-4">
								{photoPreview ? (
									<div className="relative">
										<img
											alt="Profile preview"
											className="size-20 rounded-full border object-cover"
											src={photoPreview}
										/>
										<Button
											className="-right-1 -top-1 absolute size-6 rounded-full p-0"
											onClick={() => {
												form.setValue("photo", undefined);
												setPhotoPreview(null);
											}}
											size="icon"
											type="button"
											variant="destructive"
										>
											×
										</Button>
									</div>
								) : (
									<div className="flex size-20 items-center justify-center rounded-full border border-dashed">
										<User className="size-8 text-muted-foreground" />
									</div>
								)}
								<div className="flex-1">
									<Input
										accept="image/*"
										className="cursor-pointer"
										onChange={handlePhotoChange}
										type="file"
									/>
									<p className="mt-1 text-muted-foreground text-xs">
										Profile photo (optional, max 5MB)
									</p>
								</div>
							</div>

							{/* Name Fields */}
							<div className="grid gap-4 sm:grid-cols-2">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name *</FormLabel>
											<FormControl>
												<Input placeholder="John" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name *</FormLabel>
											<FormControl>
												<Input placeholder="Doe" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Email and Phone */}
							<div className="grid gap-4 sm:grid-cols-2">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email *</FormLabel>
											<FormControl>
												<Input
													disabled
													placeholder="john@example.com"
													type="email"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												This email cannot be changed
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone (Optional)</FormLabel>
											<FormControl>
												<Input
													placeholder="+1 (555) 123-4567"
													type="tel"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Password */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password *</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													placeholder="••••••••"
													type={showPassword ? "text" : "password"}
													{...field}
												/>
												<Button
													className="absolute top-0 right-0 h-full px-3"
													onClick={() => setShowPassword(!showPassword)}
													size="sm"
													type="button"
													variant="ghost"
												>
													{showPassword ? (
														<EyeOff className="size-4" />
													) : (
														<Eye className="size-4" />
													)}
												</Button>
											</div>
										</FormControl>
										<FormDescription>
											At least 8 characters with uppercase, lowercase, and a
											number
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Confirm Password */}
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password *</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													placeholder="••••••••"
													type={showConfirmPassword ? "text" : "password"}
													{...field}
												/>
												<Button
													className="absolute top-0 right-0 h-full px-3"
													onClick={() =>
														setShowConfirmPassword(!showConfirmPassword)
													}
													size="sm"
													type="button"
													variant="ghost"
												>
													{showConfirmPassword ? (
														<EyeOff className="size-4" />
													) : (
														<Eye className="size-4" />
													)}
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button className="w-full" disabled={isSubmitting} type="submit">
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 size-4 animate-spin" />
										Creating Account...
									</>
								) : (
									<>
										<CheckCircle className="mr-2 size-4" />
										Accept Invitation & Create Account
									</>
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}

export default function AcceptInvitationPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
					<Card className="w-full max-w-md">
						<CardContent className="flex flex-col items-center gap-4 pt-6">
							<Loader2 className="size-8 animate-spin text-primary" />
							<p className="text-muted-foreground">Loading...</p>
						</CardContent>
					</Card>
				</div>
			}
		>
			<AcceptInvitationContent />
		</Suspense>
	);
}
