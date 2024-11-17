"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

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

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				setError("Invalid credentials");
				return;
			}

			router.push("/admin");
		} catch (err) {
			setError("An error occurred during sign in");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="mx-auto max-w-sm space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Login</h1>
					<p className="text-gray-500">Choose your preferred login method</p>
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
							<span className="bg-background px-2 text-muted-foreground">Or continue with</span>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
						</div>
						<div className="space-y-2">
							<Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
						</div>
						<Button type="submit" className="w-full">
							Login
						</Button>
					</form>

					<div className="text-center text-sm">
						Don&apos;t have an account?{" "}
						<Link href="/signup" className="text-primary hover:underline">
							Sign up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
