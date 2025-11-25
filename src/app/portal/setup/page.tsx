/**
 * Portal Setup Page - Customer portal account setup
 *
 * Features:
 * - Token validation
 * - Password creation
 * - Account activation
 * - Auto-login after setup
 */

import { AlertCircle, CheckCircle2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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
import { PasswordInput } from "@/components/ui/password-input";
import { StandardFormField } from "@/components/ui/standard-form-field";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
	searchParams: Promise<{ token?: string }>;
};

/**
 * Portal Setup Page - Server Component
 *
 * Handles customer portal account setup from invitation link
 */
export default async function PortalSetupPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const token = params.token;

	// Validate token exists
	if (!token) {
		return <InvalidTokenUI message="No invitation token provided" />;
	}

	// Decode and validate token
	let customerId: string;
	let timestamp: number;

	try {
		const decoded = Buffer.from(token, "base64url").toString("utf-8");
		const parts = decoded.split(":");
		customerId = parts[0] || "";
		timestamp = Number.parseInt(parts[1] || "0", 10);

		// Check if token is expired (7 days = 168 hours)
		const expirationTime = timestamp + 168 * 60 * 60 * 1000;
		if (Date.now() > expirationTime) {
			return (
				<InvalidTokenUI message="This invitation link has expired. Please request a new invitation." />
			);
		}
	} catch {
		return <InvalidTokenUI message="Invalid invitation token" />;
	}

	// Fetch customer data
	const supabase = await createClient();

	if (!supabase) {
		return notFound();
	}
	const { data: customer } = await supabase
		.from("customers")
		.select("id, email, display_name, portal_enabled, user_id")
		.eq("id", customerId)
		.is("deleted_at", null)
		.single();

	if (!customer) {
		return (
			<InvalidTokenUI message="Customer not found or invitation has been revoked" />
		);
	}

	// Check if already set up
	if (customer.user_id) {
		return (
			<div className="from-background via-background to-muted flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<div className="bg-success mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
							<CheckCircle2 className="text-success size-8" />
						</div>
						<CardTitle className="text-2xl">Account Already Set Up</CardTitle>
						<CardDescription>
							Your portal account is already active. You can sign in below.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild className="w-full" size="lg">
							<Link href="/portal/login">Sign In to Portal</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Server action for setup form
	async function handleSetup(formData: FormData) {
		"use server";

		const password = formData.get("password") as string;
		const confirmPassword = formData.get("confirmPassword") as string;

		// Validate passwords match
		if (password !== confirmPassword) {
			// TODO: Return error to client
			return;
		}

		// Validate password strength
		if (password.length < 8) {
			// TODO: Return error to client
			return;
		}

		const supabase = await createClient();

		if (!supabase) {
			return notFound();
		}

		// Re-fetch customer data within server action
		const { data: customerData } = await supabase
			.from("customers")
			.select("id, email, display_name")
			.eq("id", customerId)
			.is("deleted_at", null)
			.single();

		if (!customerData) {
			return;
		}

		// Create Supabase auth user
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email: customerData.email,
			password,
			options: {
				data: {
					display_name: customerData.display_name,
					customer_id: customerData.id,
					role: "customer",
				},
			},
		});

		if (authError || !authData.user) {
			return;
		}

		// Link user to customer record
		const { error: updateError } = await supabase
			.from("customers")
			.update({ user_id: authData.user.id })
			.eq("id", customerData.id);

		if (updateError) {
			return;
		}

		// Redirect to portal dashboard
		redirect("/portal/dashboard");
	}

	return (
		<div className="from-background via-background to-muted flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
						<Lock className="text-primary size-8" />
					</div>
					<CardTitle className="text-2xl">Set Up Your Portal Account</CardTitle>
					<CardDescription>
						Welcome, {customer.display_name}! Create a password to access your
						customer portal.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={handleSetup} className="space-y-6">
						{/* Display customer email */}
						<StandardFormField label="Email Address" htmlFor="email">
							<div className="relative">
								<Mail className="text-muted-foreground absolute top-3 left-3 size-4" />
								<Input
									className="bg-muted pl-10"
									disabled
									id="email"
									readOnly
									type="email"
									value={customer.email}
								/>
							</div>
							<p className="text-muted-foreground text-xs">
								You'll use this email to sign in to your portal
							</p>
						</StandardFormField>

						{/* Display customer name */}
						<StandardFormField label="Full Name" htmlFor="name">
							<div className="relative">
								<User className="text-muted-foreground absolute top-3 left-3 size-4" />
								<Input
									className="bg-muted pl-10"
									disabled
									id="name"
									readOnly
									type="text"
									value={customer.display_name}
								/>
							</div>
						</StandardFormField>

						{/* Password input */}
						<StandardFormField
							label="Create Password"
							htmlFor="password"
							required
						>
							<PasswordInput
								id="password"
								minLength={8}
								name="password"
								placeholder="Enter a secure password"
								required
							/>
							<p className="text-muted-foreground text-xs">
								Must be at least 8 characters
							</p>
						</StandardFormField>

						{/* Confirm password */}
						<StandardFormField
							label="Confirm Password"
							htmlFor="confirmPassword"
							required
						>
							<PasswordInput
								id="confirmPassword"
								minLength={8}
								name="confirmPassword"
								placeholder="Re-enter your password"
								required
							/>
						</StandardFormField>

						{/* Security notice */}
						<div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
							<div className="flex gap-3">
								<Lock className="text-primary size-5" />
								<div className="space-y-1">
									<p className="text-sm font-medium">Secure & Private</p>
									<p className="text-muted-foreground text-xs">
										Your password is encrypted and secure. We never share your
										information.
									</p>
								</div>
							</div>
						</div>

						{/* Submit button */}
						<Button className="w-full" size="lg" type="submit">
							Create Account & Sign In
						</Button>

						{/* Help text */}
						<p className="text-muted-foreground text-center text-sm">
							Need help?{" "}
							<a
								className="text-primary underline"
								href="mailto:support@thorbis.com"
							>
								Contact Support
							</a>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

/**
 * Invalid Token UI Component
 */
function InvalidTokenUI({ message }: { message: string }) {
	return (
		<div className="from-background via-background to-muted flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="bg-destructive/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
						<AlertCircle className="text-destructive size-8" />
					</div>
					<CardTitle className="text-2xl">Invalid Invitation</CardTitle>
					<CardDescription>{message}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground text-center text-sm">
						If you believe this is an error, please contact our support team.
					</p>
					<Button asChild className="w-full" size="lg" variant="outline">
						<a href="mailto:support@thorbis.com">Contact Support</a>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
