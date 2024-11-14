"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/thorbis/components/ui/button";
import { Input } from "@/thorbis/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleGitHubSignIn = async () => {
		try {
			const result = await signIn("github", {
				callbackUrl: "/admin",
				redirect: true,
				scope: "repo admin:repo_hook user user:email read:org write:repo_hook",
			});

			// Note: This code might not run due to the redirect
			if (result?.error) {
				setError("Failed to sign in with GitHub");
			}
		} catch (error) {
			setError("An error occurred during sign in");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			const response = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					password: formData.password,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to sign up");
			}

			// Automatically sign in after successful signup
			await signIn("credentials", {
				email: formData.email,
				password: formData.password,
				redirect: false,
			});

			router.push("/admin");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="mx-auto max-w-sm space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Create an Account</h1>
					<p className="text-gray-500">Enter your details to get started</p>
				</div>

				<div className="space-y-4">
					<Button onClick={handleGitHubSignIn} className="w-full" variant="outline">
						Continue with GitHub
					</Button>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
						</div>
					</div>

					{error && <div className="text-sm text-red-500 text-center">{error}</div>}

					<form onSubmit={handleSubmit} className="space-y-4">
						<Input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
						<Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
						<Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
						<Input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
						<Button type="submit" className="w-full">
							Sign Up
						</Button>
					</form>

					<div className="text-center text-sm">
						Already have an account?{" "}
						<Link href="/login" className="text-primary hover:underline">
							Sign in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
