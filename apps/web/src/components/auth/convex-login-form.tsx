"use client";

import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StandardFormField } from "@/components/ui/standard-form-field";
import { signIn } from "@/lib/auth/auth-client";

export function ConvexLoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTo = searchParams?.get("redirectTo") ?? "/dashboard";
	const errorParam = searchParams?.get("error");

	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(errorParam || null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			const result = await signIn.email({
				email,
				password,
			});

			if (result.error) {
				setError(result.error.message || "Sign in failed. Please check your credentials.");
				setIsLoading(false);
				return;
			}

			// Successful sign in - redirect
			router.push(redirectTo);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Sign in failed. Please check your credentials.";
			setError(message);
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

			{/* Divider - OAuth removed for now, can add later */}
			<div className="flex items-center gap-4">
				<Separator className="flex-1" />
				<p className="text-muted-foreground text-sm">Sign in with Email</p>
				<Separator className="flex-1" />
			</div>

			{/* Login Form */}
			<form className="space-y-4" onSubmit={handleSubmit}>
				<StandardFormField label="Email address" htmlFor="email" required>
					<Input
						disabled={isLoading}
						id="email"
						name="email"
						placeholder="Enter your email address"
						required
						type="email"
					/>
				</StandardFormField>

				<StandardFormField label="Password" htmlFor="password" required>
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
				</StandardFormField>

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
