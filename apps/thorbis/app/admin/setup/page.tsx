"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

type HostingProvider = "vercel" | "netlify" | null;
type DatabaseProvider = "supabase" | "mongodb" | null;

interface SiteConfig {
	siteName: string;
	siteDescription: string;
	adminEmail: string;
	timezone: string;
	databasePrefix: string;
}

interface ServiceCardProps {
	name: string;
	description: string;
	logo: string;
	isConnected: boolean;
	onClick: () => void;
}

function ServiceCard({ name, description, logo, isConnected, onClick }: ServiceCardProps) {
	return (
		<button onClick={onClick} className={`group relative flex flex-col items-start gap-2 rounded-lg border bg-card p-6 text-left transition-all hover:border-foreground/50 ${isConnected ? "border-primary" : "border-border"}`}>
			<div className="flex w-full justify-between">
				<Image src={logo} alt={`${name} logo`} width={40} height={40} className="rounded-md" />
				{isConnected && <span className="text-sm font-medium text-primary">Connected</span>}
			</div>
			<div>
				<h3 className="font-semibold">{name}</h3>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
		</button>
	);
}

function ConnectedGitHubCard({ user }: { user: any }) {
	return (
		<Card className="border-primary">
			<CardHeader>
				<div className="flex items-center space-x-4">
					<Avatar className="h-12 w-12">
						<AvatarImage src={user.image} alt={user.name} />
						<AvatarFallback>{user.name?.[0]}</AvatarFallback>
					</Avatar>
					<div>
						<CardTitle>{user.name}</CardTitle>
						<CardDescription>{user.email}</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground">GitHub account successfully connected. You can proceed to the next step.</p>
			</CardContent>
		</Card>
	);
}

function VercelTokenInput({ onSuccess }: { onSuccess: () => void }) {
	const [token, setToken] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	// Check for existing integration on mount
	useEffect(() => {
		const checkExistingIntegration = async () => {
			try {
				const testResponse = await fetch("/api/integrations/vercel/test");
				const testData = await testResponse.json();

				if (testData.status === "success") {
					onSuccess();
				}
			} catch (error) {
				// Silently fail - user will need to input token
			}
		};

		checkExistingIntegration();
	}, [onSuccess]);

	const handleSubmit = async () => {
		setIsSubmitting(true);
		setError("");

		try {
			const response = await fetch("/api/integrations/vercel/store", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to connect Vercel account");
			}

			const testResponse = await fetch("/api/integrations/vercel/test", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const testData = await testResponse.json();
			console.log(
				"Full Vercel API Response:",
				JSON.stringify(
					{
						user: testData.user,
						teams: testData.teams,
						projects: testData.projects,
						status: testData.status,
						timestamp: testData.timestamp,
						raw: testData,
					},
					null,
					2
				)
			);

			onSuccess();
		} catch (error: any) {
			console.error("Error storing token:", error);
			setError(error.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Connect Vercel</CardTitle>
				<CardDescription>
					Enter your Vercel personal access token to connect your account.{" "}
					<a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
						Generate a token here
					</a>
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="vercelToken">Vercel Token</Label>
					<Input id="vercelToken" type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Enter your Vercel personal access token" />
					{error && <p className="text-sm text-destructive">{error}</p>}
				</div>
				<Button onClick={handleSubmit} disabled={!token || isSubmitting}>
					{isSubmitting ? "Connecting..." : "Connect Vercel"}
				</Button>
			</CardContent>
		</Card>
	);
}

export default function OnboardingProcess() {
	const { data: session, status } = useSession();
	const [step, setStep] = useState(1);
	const [connectedServices, setConnectedServices] = useState({
		github: false,
		hosting: null as HostingProvider,
		database: null as DatabaseProvider,
	});
	const [siteConfig, setSiteConfig] = useState<SiteConfig>({
		siteName: "",
		siteDescription: "",
		adminEmail: "",
		timezone: "",
		databasePrefix: "th_",
	});
	const [showAdvanced, setShowAdvanced] = useState(false);
	const router = useRouter();

	// Check for existing GitHub connection
	useEffect(() => {
		if (session?.user) {
			setConnectedServices((prev) => ({
				...prev,
				github: true,
			}));
		}
	}, [session]);

	const handleOAuth = async (service: string) => {
		try {
			if (service === "github") {
				await signIn("github", {
					callbackUrl: "/admin",
					redirect: true,
				});
			} else if (service === "vercel") {
				await signIn("vercel", {
					callbackUrl: "/admin",
					redirect: true,
					scope: "user team read write deploy",
				});
			}
		} catch (error) {
			console.error("OAuth error:", error);
			// Handle error (show toast, etc.)
		}
	};

	const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setSiteConfig((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const isConfigValid = () => {
		return Object.values(siteConfig).every((value) => value.trim() !== "");
	};

	const handleComplete = async () => {
		try {
			const response = await fetch("/api/site-config", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(siteConfig),
			});

			if (!response.ok) {
				throw new Error("Failed to save site configuration");
			}

			// Handle successful completion
			router.push("/dashboard"); // or wherever you want to redirect
		} catch (error) {
			console.error("Error saving site config:", error);
			// Handle error (show toast, etc.)
		}
	};

	return (
		<div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
			<div className="mx-auto max-w-7xl space-y-8">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">Connect Your Services</h1>
					<p className="text-muted-foreground">Complete these steps to set up your development environment.</p>
				</div>

				{step === 1 && (
					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Step 1: GitHub Integration</h2>
						{session?.user ? (
							<ConnectedGitHubCard user={session.user} />
						) : (
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								<ServiceCard name="GitHub" description="Connect your GitHub account to manage repositories and deployments." logo="https://placehold.co/40x40?text=GitHub" isConnected={connectedServices.github} onClick={() => handleOAuth("github")} />
							</div>
						)}
					</div>
				)}

				{step === 2 && (
					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Step 2: Hosting Provider</h2>
						{!connectedServices.hosting ? (
							<VercelTokenInput onSuccess={() => setConnectedServices((prev) => ({ ...prev, hosting: "vercel" }))} />
						) : (
							<Card className="border-primary">
								<CardHeader>
									<CardTitle>Vercel Connected</CardTitle>
									<CardDescription>Your Vercel account has been successfully connected.</CardDescription>
								</CardHeader>
							</Card>
						)}
					</div>
				)}

				{step === 3 && (
					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Step 3: Database Provider</h2>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							<ServiceCard name="Supabase" description="Open source Firebase alternative with powerful PostgreSQL database." logo="https://placehold.co/40x40?text=Supabase" isConnected={connectedServices.database === "supabase"} onClick={() => handleOAuth("supabase")} />
							<ServiceCard name="MongoDB" description="Modern developer data platform with powerful NoSQL database." logo="https://placehold.co/40x40?text=MongoDB" isConnected={connectedServices.database === "mongodb"} onClick={() => handleOAuth("mongodb")} />
						</div>
					</div>
				)}

				{step === 4 && (
					<Card>
						<CardHeader>
							<CardTitle>Site Configuration</CardTitle>
							<CardDescription>Set up your website&apos;s basic information.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="siteName">Site Name</Label>
								<Input id="siteName" name="siteName" value={siteConfig.siteName} onChange={handleConfigChange} placeholder="My Awesome Site" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="siteDescription">Site Description</Label>
								<Textarea id="siteDescription" name="siteDescription" value={siteConfig.siteDescription} onChange={handleConfigChange} placeholder="A brief description of your site" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="adminEmail">Admin Email</Label>
								<Input id="adminEmail" name="adminEmail" type="email" value={siteConfig.adminEmail} onChange={handleConfigChange} placeholder="admin@example.com" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="timezone">Timezone</Label>
								<Input id="timezone" name="timezone" value={siteConfig.timezone} onChange={handleConfigChange} placeholder="UTC+0" />
							</div>
							<Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
								<CollapsibleTrigger asChild>
									<Button variant="link" className="p-0 h-auto">
										{showAdvanced ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
										Advanced Database Settings
									</Button>
								</CollapsibleTrigger>
								<CollapsibleContent className="space-y-2 mt-2">
									<Label htmlFor="databasePrefix">Database Table Prefix</Label>
									<Input id="databasePrefix" name="databasePrefix" value={siteConfig.databasePrefix} onChange={handleConfigChange} placeholder="th_" />
									<p className="text-sm text-muted-foreground">This prefix will be added to all database table names.</p>
								</CollapsibleContent>
							</Collapsible>
						</CardContent>
					</Card>
				)}

				<div className="flex justify-between">
					{step > 1 && (
						<Button variant="outline" onClick={() => setStep(step - 1)}>
							Previous
						</Button>
					)}
					<Button onClick={step < 4 ? () => setStep(step + 1) : handleComplete} disabled={step === 1 && !connectedServices.github} className="ml-auto">
						{step < 4 ? "Next" : "Complete Setup"}
					</Button>
				</div>
			</div>
		</div>
	);
}
