"use client";

import {
	AlertCircle,
	CheckCircle2,
	Eye,
	EyeOff,
	ImageUp,
	Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { signInWithOAuth, signUp } from "@/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function RegisterForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [avatarError, setAvatarError] = useState<string | null>(null);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(
		() => () => {
			if (avatarPreview) {
				URL.revokeObjectURL(avatarPreview);
			}
		},
		[avatarPreview],
	);

	const passwordScore = useMemo(() => {
		let score = 0;
		if (password.length >= 8) {
			score += 30;
		}
		if (/[A-Z]/.test(password)) {
			score += 20;
		}
		if (/[a-z]/.test(password)) {
			score += 20;
		}
		if (/\d/.test(password)) {
			score += 20;
		}
		if (/[^A-Za-z0-9]/.test(password)) {
			score += 10;
		}
		return Math.min(score, 100);
	}, [password]);

	const passwordStrengthLabel = useMemo(() => {
		if (passwordScore >= 80) {
			return "Strong";
		}
		if (passwordScore >= 60) {
			return "Good";
		}
		if (passwordScore >= 40) {
			return "Fair";
		}
		return "Weak";
	}, [passwordScore]);

	const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		setAvatarError(null);

		if (!file) {
			if (avatarPreview) {
				URL.revokeObjectURL(avatarPreview);
			}
			setAvatarPreview(null);
			return;
		}

		if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
			setAvatarError("Please upload a JPG, PNG, or WebP image.");
			event.target.value = "";
			return;
		}

		if (file.size > MAX_AVATAR_BYTES) {
			setAvatarError("Profile images must be smaller than 5MB.");
			event.target.value = "";
			return;
		}

		if (avatarPreview) {
			URL.revokeObjectURL(avatarPreview);
		}
		setAvatarPreview(URL.createObjectURL(file));
	};

	const handleOAuthSignup = async (provider: "google" | "facebook") => {
		setIsLoading(true);
		setError(null);
		setSuccessMessage(null);

		try {
			const result = await signInWithOAuth(provider);
			if (result && !result.success && result.error) {
				setError(result.error);
				setIsLoading(false);
			}
		} catch (caughtError) {
			if (
				caughtError instanceof Error &&
				caughtError.message === "NEXT_REDIRECT"
			) {
				return;
			}
			setError(
				caughtError instanceof Error
					? caughtError.message
					: "Unable to start OAuth signup right now.",
			);
			setIsLoading(false);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setAvatarError(null);
		setSuccessMessage(null);

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setIsLoading(true);

		try {
			const formData = new FormData(event.currentTarget);
			const result = await signUp(formData);

			if (!result.success) {
				setError(result.error || "Unable to create your account right now.");
				setIsLoading(false);
				return;
			}

			const confirmationMessage =
				(result.data?.message as string | undefined) ||
				"Account created! Please check your inbox to verify your email.";

			setSuccessMessage(confirmationMessage);
			event.currentTarget.reset();
			setPassword("");
			setConfirmPassword("");
			if (avatarPreview) {
				URL.revokeObjectURL(avatarPreview);
			}
			setAvatarPreview(null);
			setIsLoading(false);
		} catch (caughtError) {
			setError(
				caughtError instanceof Error
					? caughtError.message
					: "Something went wrong. Please try again.",
			);
			setIsLoading(false);
		}
	};

	return (
		<div className="flex w-full max-w-2xl flex-col gap-6">
			{/* Logo */}
			<div className="flex items-center gap-3">
				<Image
					alt="Thorbis Logo"
					className="size-8.5"
					height={34}
					src="/ThorbisLogo.webp"
					width={34}
				/>
				<span className="text-xl font-semibold">Thorbis</span>
			</div>

			{/* Welcome Text */}
			<div>
				<h2 className="mb-1.5 text-2xl font-semibold">Create your account</h2>
				<p className="text-muted-foreground">
					Join thousands of field service teams streamlining their operations
				</p>
			</div>

			{/* Error Alert */}
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Success Alert */}
			{successMessage && (
				<Alert className="border-green-500/40 text-green-600 dark:text-green-400">
					<CheckCircle2 className="h-4 w-4" />
					<AlertDescription>{successMessage}</AlertDescription>
				</Alert>
			)}

			{/* Social Sign Up Button */}

			<Button
				className="w-full"
				disabled={isLoading}
				onClick={() => handleOAuthSignup("google")}
				type="button"
				variant="outline"
			>
				{isLoading ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<svg aria-hidden="true" className="mr-2 h-4 w-4" viewBox="0 0 24 24">
						<path
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							fill="#4285F4"
						/>
						<path
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							fill="#34A853"
						/>
						<path
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							fill="#FBBC05"
						/>
						<path
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							fill="#EA4335"
						/>
					</svg>
				)}
				Sign up with Google
			</Button>

			{/* Divider */}
			<div className="flex items-center gap-4">
				<Separator className="flex-1" />
				<p className="text-muted-foreground text-sm">Or sign up with Email</p>
				<Separator className="flex-1" />
			</div>

			{/* Registration Form */}
			<form
				className="grid gap-6 md:grid-cols-2"
				encType="multipart/form-data"
				onSubmit={handleSubmit}
			>
				<div className="space-y-1">
					<Label htmlFor="name">Full name*</Label>
					<Input
						autoComplete="name"
						disabled={isLoading}
						id="name"
						name="name"
						placeholder="Byron Wade"
						required
					/>
				</div>

				<div className="space-y-1">
					<Label htmlFor="companyName">Company name (optional)</Label>
					<Input
						autoComplete="organization"
						disabled={isLoading}
						id="companyName"
						name="companyName"
						placeholder="Test Plumbing Co."
					/>
				</div>

				<div className="space-y-1">
					<Label htmlFor="email">Work email*</Label>
					<Input
						autoComplete="email"
						disabled={isLoading}
						id="email"
						name="email"
						placeholder="you@company.com"
						required
						type="email"
					/>
				</div>

				<div className="space-y-1">
					<Label htmlFor="phone">Mobile phone*</Label>
					<Input
						autoComplete="tel"
						disabled={isLoading}
						id="phone"
						inputMode="tel"
						name="phone"
						pattern="^[0-9+()\\s-]{10,}$"
						placeholder="+1 (831) 555-0199"
						required
						type="tel"
					/>
					<p className="text-muted-foreground text-xs">
						We’ll text urgent dispatch alerts and MFA codes here.
					</p>
				</div>

				<div className="space-y-1">
					<Label htmlFor="password">Password*</Label>
					<div className="relative">
						<Input
							autoComplete="new-password"
							className="pr-11"
							disabled={isLoading}
							id="password"
							minLength={8}
							name="password"
							onChange={(event) => setPassword(event.target.value)}
							placeholder="••••••••••••••••"
							required
							type={showPassword ? "text" : "password"}
							value={password}
						/>
						<Button
							className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
							disabled={isLoading}
							onClick={() => setShowPassword((prev) => !prev)}
							size="sm"
							type="button"
							variant="ghost"
						>
							{showPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
							<span className="sr-only">
								{showPassword ? "Hide password" : "Show password"}
							</span>
						</Button>
					</div>
					<div className="flex items-center justify-between text-xs">
						<span className="text-muted-foreground">Password strength</span>
						<span
							className={cn(
								"font-medium",
								passwordScore >= 80
									? "text-green-600"
									: passwordScore >= 60
										? "text-amber-500"
										: "text-red-500",
							)}
						>
							{passwordStrengthLabel}
						</span>
					</div>
					<div className="bg-muted h-1.5 rounded-full">
						<div
							className={cn(
								"h-full rounded-full transition-all",
								passwordScore >= 80
									? "bg-green-500"
									: passwordScore >= 60
										? "bg-amber-500"
										: "bg-red-500",
							)}
							style={{ width: `${passwordScore}%` }}
						/>
					</div>
				</div>

				<div className="space-y-1">
					<Label htmlFor="confirmPassword">Confirm password*</Label>
					<div className="relative">
						<Input
							autoComplete="new-password"
							className="pr-11"
							disabled={isLoading}
							id="confirmPassword"
							minLength={8}
							name="confirmPassword"
							onChange={(event) => setConfirmPassword(event.target.value)}
							placeholder="Repeat your password"
							required
							type={showConfirmPassword ? "text" : "password"}
							value={confirmPassword}
						/>
						<Button
							className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
							disabled={isLoading}
							onClick={() => setShowConfirmPassword((prev) => !prev)}
							size="sm"
							type="button"
							variant="ghost"
						>
							{showConfirmPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
							<span className="sr-only">
								{showConfirmPassword ? "Hide password" : "Show password"}
							</span>
						</Button>
					</div>
				</div>

				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="avatar">Profile image (optional)</Label>
					<div className="border-border/70 flex flex-col gap-4 rounded-2xl border border-dashed p-4 sm:flex-row sm:items-center">
						<div className="border-border/80 relative size-20 shrink-0 overflow-hidden rounded-full border">
							{avatarPreview ? (
								<Image
									alt="Avatar preview"
									className="object-cover"
									fill
									sizes="80px"
									src={avatarPreview}
									unoptimized
								/>
							) : (
								<div className="bg-muted text-muted-foreground flex size-full items-center justify-center">
									<ImageUp className="h-6 w-6" />
								</div>
							)}
						</div>
						<div className="flex w-full flex-col gap-2">
							<Input
								accept={ACCEPTED_IMAGE_TYPES.join(",")}
								aria-describedby="avatar-helper"
								disabled={isLoading}
								id="avatar"
								name="avatar"
								onChange={handleAvatarChange}
								type="file"
							/>
							<p className="text-muted-foreground text-xs" id="avatar-helper">
								JPG, PNG, or WebP — up to 5MB.
							</p>
							{avatarError && (
								<p className="text-destructive text-xs" role="status">
									{avatarError}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Terms & Submit */}
				<div className="space-y-4 md:col-span-2">
					<div className="flex items-center gap-3">
						<Checkbox disabled={isLoading} id="terms" name="terms" required />
						<Label className="text-sm" htmlFor="terms">
							I agree to the{" "}
							<Link className="hover:underline" href="/legal/terms">
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link className="hover:underline" href="/legal/privacy">
								Privacy Policy
							</Link>
						</Label>
					</div>

					<Button className="w-full" disabled={isLoading} type="submit">
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating account...
							</>
						) : (
							"Create account"
						)}
					</Button>
					<p className="text-muted-foreground text-center text-sm">
						14-day free trial • No credit card required
					</p>
				</div>
			</form>

			{/* Sign In Link */}
			<p className="text-muted-foreground text-center">
				Already have an account?{" "}
				<Link className="text-foreground hover:underline" href="/login">
					Sign in
				</Link>
			</p>
		</div>
	);
}
