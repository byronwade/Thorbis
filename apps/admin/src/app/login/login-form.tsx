"use client";

import { AlertCircle, Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/auth/better-auth/auth-client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StandardFormField } from "@/components/ui/standard-form-field";

export function AdminLoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const errorParam = searchParams?.get("error");

	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isRateLimited, setIsRateLimited] = useState(false);
	const [error, setError] = useState<string | null>(
		errorParam === "unauthorized"
			? "Access denied. Admin access is restricted to Thorbis employees."
			: errorParam === "use_admin"
				? "Thorbis employees must use this admin dashboard. Please sign in here."
				: null
	);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setIsRateLimited(false);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			// Use Better Auth for authentication
			const result = await signIn.email({
				email,
				password,
			});

			if (result.error) {
				setError(result.error.message || "Authentication failed. Please check your credentials.");
				setIsLoading(false);
				return;
			}

			// Redirect to admin dashboard on success
			router.push("/dashboard");
		} catch (err) {
			const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
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
				<span className="rounded-md bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-500 ring-1 ring-inset ring-orange-500/20">
					Admin
				</span>
			</div>

			{/* Welcome Text */}
			<div>
				<h2 className="mb-1.5 text-2xl font-semibold">Admin Access</h2>
				<p className="text-muted-foreground">
					Sign in to access the Stratos admin panel:
				</p>
			</div>

			{/* Error Alert */}
			{error && (
				<Alert variant="destructive">
					{isRateLimited ? (
						<ShieldAlert className="h-4 w-4" />
					) : (
						<AlertCircle className="h-4 w-4" />
					)}
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Info Notice */}
			<div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
				<p className="text-sm text-blue-500">
					Admin access is restricted to Thorbis employees with @thorbis.com email addresses.
				</p>
			</div>

			{/* Divider */}
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
						placeholder="you@thorbis.com"
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

				{/* Submit Button */}
				<Button className="w-full" disabled={isLoading} type="submit">
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Signing in...
						</>
					) : (
						"Sign in to Admin"
					)}
				</Button>
			</form>

			{/* Footer */}
			<p className="text-muted-foreground text-center text-sm">
				Need help?{" "}
				<a
					className="text-foreground hover:underline"
					href="mailto:support@thorbis.com"
				>
					Contact Support
				</a>
			</p>
		</div>
	);
}
