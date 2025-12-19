"use client";

import { useMutation } from "convex/react";
import { AlertCircle, Building2, Loader2, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { signUp } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

export function ConvexSignupForm() {
	const createCompany = useMutation(api.companies.create);
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTo = searchParams?.get("redirectTo") ?? "/onboarding";

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// Password strength calculation
	const passwordStrength = useMemo(() => {
		if (!password) return { score: 0, label: "", color: "" };

		let score = 0;
		if (password.length >= 8) score += 25;
		if (password.length >= 12) score += 10;
		if (/[A-Z]/.test(password)) score += 20;
		if (/[a-z]/.test(password)) score += 15;
		if (/\d/.test(password)) score += 15;
		if (/[^A-Za-z0-9]/.test(password)) score += 15;
		score = Math.min(score, 100);

		if (score >= 80) return { score, label: "Strong", color: "bg-emerald-500" };
		if (score >= 50) return { score, label: "Good", color: "bg-amber-500" };
		if (score >= 25) return { score, label: "Weak", color: "bg-orange-500" };
		return { score, label: "Very weak", color: "bg-red-500" };
	}, [password]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		const companyName = formData.get("companyName") as string;
		const email = formData.get("email") as string;
		const termsAccepted = formData.get("terms") === "on";

		// Validation
		if (!termsAccepted) {
			setError("Please accept the Terms of Service and Privacy Policy");
			setIsLoading(false);
			return;
		}

		if (!companyName.trim()) {
			setError("Company name is required");
			setIsLoading(false);
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			setIsLoading(false);
			return;
		}

		try {
			console.log("Attempting signup with:", { email, name });
			const result = await signUp.email({
				email,
				password,
				name,
			});

			console.log("Signup result:", result);

			if (result.error) {
				console.error("Signup error:", result.error);
				setError(result.error.message || "Sign up failed. Please try again.");
				setIsLoading(false);
				return;
			}

			// Create company after successful signup
			try {
				await createCompany({
					name: companyName.trim(),
				});
			} catch (companyError) {
				console.error("Failed to create company:", companyError);
			}

			router.push(redirectTo);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Sign up failed. Please try again.";
			setError(message);
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md">
			{/* Logo */}
			<div className="mb-8 flex items-center justify-center gap-2">
				<Image
					alt="Thorbis"
					height={40}
					width={40}
					src="/ThorbisLogo.webp"
					className="size-10"
				/>
				<span className="text-2xl font-bold tracking-tight">Thorbis</span>
			</div>

			<Card className="border-0 shadow-xl">
				<CardHeader className="space-y-1 pb-4">
					<CardTitle className="text-2xl font-bold text-center">
						Create your account
					</CardTitle>
					<CardDescription className="text-center">
						Start your 14-day free trial. No credit card required.
					</CardDescription>
				</CardHeader>

				<CardContent>
					{error && (
						<Alert variant="destructive" className="mb-6">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Name Field */}
						<div className="space-y-2">
							<Label htmlFor="name">Full name</Label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="name"
									name="name"
									placeholder="John Smith"
									required
									disabled={isLoading}
									className="pl-10"
									autoComplete="name"
								/>
							</div>
						</div>

						{/* Company Field */}
						<div className="space-y-2">
							<Label htmlFor="companyName">Company name</Label>
							<div className="relative">
								<Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="companyName"
									name="companyName"
									placeholder="Acme Plumbing LLC"
									required
									disabled={isLoading}
									className="pl-10"
									autoComplete="organization"
								/>
							</div>
						</div>

						{/* Email Field */}
						<div className="space-y-2">
							<Label htmlFor="email">Work email</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="you@company.com"
									required
									disabled={isLoading}
									className="pl-10"
									autoComplete="email"
								/>
							</div>
						</div>

						{/* Password Field */}
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<PasswordInput
								id="password"
								name="password"
								placeholder="Create a strong password"
								required
								disabled={isLoading}
								minLength={8}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="new-password"
							/>
							{password && (
								<div className="space-y-1.5">
									<div className="flex gap-1">
										{[...Array(4)].map((_, i) => (
											<div
												key={i}
												className={cn(
													"h-1 flex-1 rounded-full transition-colors",
													i < Math.ceil(passwordStrength.score / 25)
														? passwordStrength.color
														: "bg-muted"
												)}
											/>
										))}
									</div>
									<p className="text-xs text-muted-foreground">
										Password strength:{" "}
										<span
											className={cn(
												"font-medium",
												passwordStrength.score >= 80
													? "text-emerald-600"
													: passwordStrength.score >= 50
														? "text-amber-600"
														: "text-red-600"
											)}
										>
											{passwordStrength.label}
										</span>
									</p>
								</div>
							)}
						</div>

						{/* Confirm Password Field */}
						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm password</Label>
							<PasswordInput
								id="confirmPassword"
								name="confirmPassword"
								placeholder="Repeat your password"
								required
								disabled={isLoading}
								minLength={8}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								autoComplete="new-password"
							/>
							{confirmPassword && password !== confirmPassword && (
								<p className="text-xs text-red-600">Passwords do not match</p>
							)}
						</div>

						{/* Terms Checkbox */}
						<div className="flex items-start gap-3 pt-2">
							<Checkbox
								id="terms"
								name="terms"
								required
								disabled={isLoading}
								className="mt-0.5"
							/>
							<Label
								htmlFor="terms"
								className="text-sm font-normal leading-snug text-muted-foreground"
							>
								I agree to the{" "}
								<Link
									href="/legal/terms"
									className="text-foreground underline-offset-4 hover:underline"
								>
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link
									href="/legal/privacy"
									className="text-foreground underline-offset-4 hover:underline"
								>
									Privacy Policy
								</Link>
							</Label>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full"
							size="lg"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating account...
								</>
							) : (
								"Get started free"
							)}
						</Button>
					</form>
				</CardContent>

				<CardFooter className="flex-col gap-4 pt-0">
					<div className="relative w-full">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-card px-2 text-muted-foreground">
								Already have an account?
							</span>
						</div>
					</div>
					<Button variant="outline" className="w-full" asChild>
						<Link href="/login">Sign in</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
