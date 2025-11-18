"use client";

import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn, signInWithOAuth } from "@/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function LoginForm() {
	const searchParams = useSearchParams();
	const redirectTo = searchParams?.get("redirectTo");
	const errorParam = searchParams?.get("error");

	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	// Preserve querystring errors for user-friendly messaging
	const [error, setError] = useState<string | null>(errorParam || null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const formData = new FormData(e.currentTarget);

			// Add redirectTo if present
			if (redirectTo) {
				formData.append("redirectTo", redirectTo);
			}

			const result = await signIn(formData);

			if (!result.success && result.error) {
				setError(result.error);
				setIsLoading(false);
			}
			// If successful, the server action will redirect
		} catch (caughtError) {
			if (
				caughtError instanceof Error &&
				caughtError.message === "NEXT_REDIRECT"
			) {
				return;
			}

			setError("An unexpected error occurred. Please try again.");
			setIsLoading(false);
		}
	};

	const handleOAuthLogin = async (provider: "google" | "facebook") => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await signInWithOAuth(provider);

			if (result && !result.success && result.error) {
				// If result exists and has an error, show it
				setError(result.error);
				setIsLoading(false);
			}
			// If successful, the server action will redirect to OAuth provider
			// Keep loading spinner active during redirect
		} catch (caughtError) {
			// Ignore NEXT_REDIRECT errors - these are expected during successful OAuth
			if (
				caughtError instanceof Error &&
				caughtError.message === "NEXT_REDIRECT"
			) {
				return; // Let the redirect happen, keep loading state
			}

			if (caughtError instanceof Error) {
				setError(
					caughtError.message ||
						"An unexpected error occurred. Please try again.",
				);
			} else {
				setError("An unexpected error occurred. Please try again.");
			}
			setIsLoading(false);
		}
	};

	return (
		<div className="flex w-full max-w-lg flex-col gap-6">
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
				<h2 className="mb-1.5 text-2xl font-semibold">Welcome Back</h2>
				<p className="text-muted-foreground">
					Welcome back! Access your field service dashboard:
				</p>
			</div>

			{/* Error Alert */}
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Social Login Button */}
			<Button
				className="w-full"
				disabled={isLoading}
				onClick={() => handleOAuthLogin("google")}
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
				Login with Google
			</Button>

			{/* Divider */}
			<div className="flex items-center gap-4">
				<Separator className="flex-1" />
				<p className="text-muted-foreground text-sm">Or sign in with Email</p>
				<Separator className="flex-1" />
			</div>

			{/* Login Form */}
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div className="space-y-1">
					<Label htmlFor="email">Email address*</Label>
					<Input
						disabled={isLoading}
						id="email"
						name="email"
						placeholder="Enter your email address"
						required
						type="email"
					/>
				</div>

				<div className="space-y-1">
					<Label htmlFor="password">Password*</Label>
					<div className="relative">
						<Input
							className="pr-9"
							disabled={isLoading}
							id="password"
							name="password"
							placeholder="••••••••••••••••"
							required
							type={showPassword ? "text" : "password"}
						/>
						<Button
							className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
							disabled={isLoading}
							onClick={() => setShowPassword(!showPassword)}
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
				</div>

				{/* Remember Me & Forgot Password */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Checkbox disabled={isLoading} id="rememberMe" name="rememberMe" />
						<Label className="text-sm" htmlFor="rememberMe">
							Remember Me
						</Label>
					</div>
					<Link className="text-sm hover:underline" href="/forgot-password">
						Forgot Password?
					</Link>
				</div>

				{/* Submit Button */}
				<Button className="w-full" disabled={isLoading} type="submit">
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Signing in...
						</>
					) : (
						"Sign in to Thorbis"
					)}
				</Button>
			</form>

			{/* Sign Up Link */}
			<p className="text-muted-foreground text-center">
				New to Thorbis?{" "}
				<Link className="text-foreground hover:underline" href="/register">
					Create an account
				</Link>
			</p>
		</div>
	);
}
