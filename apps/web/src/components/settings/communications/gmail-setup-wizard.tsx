"use client";

/**
 * Google Workspace Setup Wizard
 *
 * Multi-step wizard to connect Google Workspace and configure:
 * 1. OAuth connection (connect Google account)
 * 2. Select workspace emails to sync (support@, sales@, billing@, etc.)
 * 3. Assign team member permissions
 * 4. Test and verify connection
 */

import {
	AlertTriangle,
	ArrowLeft,
	ArrowRight,
	CheckCircle2,
	ExternalLink,
	Inbox,
	Loader2,
	Mail,
	Settings,
	Shield,
	TestTube2,
	Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface GmailSetupWizardProps {
	companyId: string;
	onComplete?: () => void;
}

type Step = 1 | 2 | 3 | 4;

const STEPS = [
	{
		number: 1,
		title: "Connect Google Workspace",
		description: "Authorize access to your Gmail account",
		icon: Mail,
	},
	{
		number: 2,
		title: "Select Email Addresses",
		description: "Choose which workspace emails to sync",
		icon: Inbox,
	},
	{
		number: 3,
		title: "Assign Permissions",
		description: "Set up team access to email categories",
		icon: Shield,
	},
	{
		number: 4,
		title: "Test Connection",
		description: "Verify everything is working",
		icon: TestTube2,
	},
] as const;

const EMAIL_CATEGORIES = [
	{
		id: "support" as const,
		name: "Support",
		description: "Customer support and help requests",
		placeholder: "support@yourcompany.com",
	},
	{
		id: "sales" as const,
		name: "Sales",
		description: "Sales inquiries and leads",
		placeholder: "sales@yourcompany.com",
	},
	{
		id: "billing" as const,
		name: "Billing",
		description: "Invoices and payment-related emails",
		placeholder: "billing@yourcompany.com",
	},
	{
		id: "general" as const,
		name: "General",
		description: "General company emails",
		placeholder: "info@yourcompany.com",
	},
] as const;

export function GmailSetupWizard({
	companyId,
	onComplete,
}: GmailSetupWizardProps) {
	const [currentStep, setCurrentStep] = useState<Step>(1);
	const [loading, setLoading] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [gmailEmail, setGmailEmail] = useState("");
	const [selectedEmails, setSelectedEmails] = useState<
		Partial<Record<(typeof EMAIL_CATEGORIES)[number]["id"], string>>
	>({});

	const handleOAuthConnect = async () => {
		setLoading(true);
		try {
			// Redirect to OAuth flow
			const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
			const redirectUri = `${window.location.origin}/api/auth/gmail/callback`;
			const scopes = [
				"https://www.googleapis.com/auth/gmail.readonly",
				"https://www.googleapis.com/auth/gmail.send",
			].join(" ");

			const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent&state=${companyId}`;

			window.location.href = authUrl;
		} catch (error) {
			console.error("OAuth connection failed:", error);
			toast.error("Failed to connect to Google Workspace");
			setLoading(false);
		}
	};

	const handleTestConnection = async () => {
		setLoading(true);
		try {
			// Test Gmail API connection
			const response = await fetch("/api/gmail/test-connection", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ companyId }),
			});

			const result = await response.json();

			if (result.success) {
				toast.success("Connection test successful!");
				if (onComplete) {
					onComplete();
				}
			} else {
				toast.error(result.error || "Connection test failed");
			}
		} catch (error) {
			console.error("Connection test failed:", error);
			toast.error("Failed to test connection");
		} finally {
			setLoading(false);
		}
	};

	const handleNext = () => {
		if (currentStep < 4) {
			setCurrentStep((currentStep + 1) as Step);
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep((currentStep - 1) as Step);
		}
	};

	const canProceed = () => {
		switch (currentStep) {
			case 1:
				return isConnected && gmailEmail.length > 0;
			case 2:
				return Object.values(selectedEmails).some(
					(email) => email && email.length > 0,
				);
			case 3:
				return true; // Permissions are optional
			case 4:
				return true;
			default:
				return false;
		}
	};

	return (
		<div className="space-y-6">
			{/* Progress Steps */}
			<div className="flex items-center justify-between">
				{STEPS.map((step, idx) => {
					const Icon = step.icon;
					const isActive = currentStep === step.number;
					const isCompleted = currentStep > step.number;

					return (
						<div key={step.number} className="flex items-center flex-1">
							<div className="flex flex-col items-center gap-2 flex-1">
								<div
									className={cn(
										"h-10 w-10 rounded-full flex items-center justify-center transition-all",
										isActive && "bg-primary text-primary-foreground",
										isCompleted && "bg-green-500 text-white",
										!isActive &&
											!isCompleted &&
											"bg-muted text-muted-foreground",
									)}
								>
									{isCompleted ? (
										<CheckCircle2 className="h-5 w-5" />
									) : (
										<Icon className="h-5 w-5" />
									)}
								</div>
								<div className="text-center">
									<p
										className={cn(
											"text-sm font-medium",
											isActive && "text-primary",
											isCompleted && "text-green-600",
											!isActive && !isCompleted && "text-muted-foreground",
										)}
									>
										{step.title}
									</p>
									<p className="text-xs text-muted-foreground hidden sm:block">
										{step.description}
									</p>
								</div>
							</div>
							{idx < STEPS.length - 1 && (
								<Separator
									className={cn(
										"flex-1 max-w-24",
										isCompleted && "bg-green-500",
										!isCompleted && "bg-muted",
									)}
								/>
							)}
						</div>
					);
				})}
			</div>

			{/* Step Content */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{React.createElement(STEPS[currentStep - 1].icon, {
							className: "h-5 w-5",
						})}
						{STEPS[currentStep - 1].title}
					</CardTitle>
					<CardDescription>
						{STEPS[currentStep - 1].description}
					</CardDescription>
				</CardHeader>

				<CardContent className="min-h-[400px]">
					{/* Step 1: OAuth Connection */}
					{currentStep === 1 && (
						<div className="space-y-6">
							<Alert>
								<Settings className="h-4 w-4" />
								<AlertTitle>Before you begin</AlertTitle>
								<AlertDescription>
									<ul className="list-disc list-inside space-y-1 text-sm mt-2">
										<li>
											You need admin access to your Google Workspace account
										</li>
										<li>
											Make sure you're signed into the correct Google account
										</li>
										<li>We'll request read and send permissions for Gmail</li>
										<li>You can revoke access at any time</li>
									</ul>
								</AlertDescription>
							</Alert>

							{isConnected ? (
								<div className="flex flex-col items-center justify-center p-8 space-y-4">
									<div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
										<CheckCircle2 className="h-8 w-8 text-green-600" />
									</div>
									<div className="text-center">
										<p className="font-semibold text-lg">
											Connected Successfully!
										</p>
										<p className="text-sm text-muted-foreground">
											{gmailEmail}
										</p>
									</div>
									<Badge variant="secondary" className="gap-1">
										<CheckCircle2 className="h-3 w-3" />
										Google Workspace Connected
									</Badge>
								</div>
							) : (
								<div className="flex flex-col items-center justify-center p-8 space-y-6">
									<div className="text-center max-w-md">
										<h3 className="font-semibold text-lg mb-2">
											Connect Your Google Workspace
										</h3>
										<p className="text-sm text-muted-foreground">
											Click the button below to authorize Stratos to access your
											Gmail account. You'll be redirected to Google's secure
											login page.
										</p>
									</div>
									<Button
										size="lg"
										onClick={handleOAuthConnect}
										disabled={loading}
									>
										{loading && (
											<Loader2 className="h-5 w-5 mr-2 animate-spin" />
										)}
										<Mail className="h-5 w-5 mr-2" />
										Connect Google Workspace
									</Button>
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Shield className="h-4 w-4" />
										Secured by Google OAuth 2.0
									</div>
								</div>
							)}
						</div>
					)}

					{/* Step 2: Select Email Addresses */}
					{currentStep === 2 && (
						<div className="space-y-6">
							<Alert>
								<Inbox className="h-4 w-4" />
								<AlertTitle>Configure Email Categories</AlertTitle>
								<AlertDescription>
									Enter the Gmail addresses for each category. These will be
									synced to your company inbox and accessible to assigned team
									members.
								</AlertDescription>
							</Alert>

							<div className="space-y-4">
								{EMAIL_CATEGORIES.map((category) => (
									<div key={category.id} className="space-y-2">
										<div className="flex items-start gap-2">
											<Checkbox
												id={category.id}
												checked={!!selectedEmails[category.id]}
												onCheckedChange={(checked) => {
													if (checked) {
														setSelectedEmails({
															...selectedEmails,
															[category.id]: "",
														});
													} else {
														const updated = { ...selectedEmails };
														delete updated[category.id];
														setSelectedEmails(updated);
													}
												}}
											/>
											<div className="flex-1 space-y-2">
												<Label htmlFor={category.id} className="cursor-pointer">
													<span className="font-semibold">{category.name}</span>
													<p className="text-sm text-muted-foreground font-normal">
														{category.description}
													</p>
												</Label>
												{selectedEmails[category.id] !== undefined && (
													<Input
														placeholder={category.placeholder}
														value={selectedEmails[category.id] || ""}
														onChange={(e) =>
															setSelectedEmails({
																...selectedEmails,
																[category.id]: e.target.value,
															})
														}
														className="mt-2"
													/>
												)}
											</div>
										</div>
										{category.id !==
											EMAIL_CATEGORIES[EMAIL_CATEGORIES.length - 1].id && (
											<Separator className="mt-4" />
										)}
									</div>
								))}
							</div>
						</div>
					)}

					{/* Step 3: Assign Permissions */}
					{currentStep === 3 && (
						<div className="space-y-6">
							<Alert>
								<Users className="h-4 w-4" />
								<AlertTitle>Team Access (Optional)</AlertTitle>
								<AlertDescription>
									Configure which team members can access each email category.
									You can skip this step and configure permissions later in team
									settings.
								</AlertDescription>
							</Alert>

							<div className="text-center p-8">
								<Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
								<p className="text-sm text-muted-foreground mb-4">
									Team permission management will be available after setup is
									complete.
								</p>
								<Button variant="outline" size="sm" asChild>
									<a href="/dashboard/settings/team/email-permissions">
										<ExternalLink className="h-4 w-4 mr-2" />
										Learn About Email Permissions
									</a>
								</Button>
							</div>
						</div>
					)}

					{/* Step 4: Test Connection */}
					{currentStep === 4 && (
						<div className="space-y-6">
							<Alert>
								<TestTube2 className="h-4 w-4" />
								<AlertTitle>Test Your Gmail Connection</AlertTitle>
								<AlertDescription>
									We'll verify that we can successfully connect to your Gmail
									account and sync emails.
								</AlertDescription>
							</Alert>

							<div className="space-y-4">
								<div className="grid gap-4 md:grid-cols-2">
									<Card>
										<CardHeader>
											<CardTitle className="text-sm">
												Connected Account
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="font-mono text-sm">
												{gmailEmail || "Not connected"}
											</p>
										</CardContent>
									</Card>
									<Card>
										<CardHeader>
											<CardTitle className="text-sm">
												Email Categories
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm">
												{Object.keys(selectedEmails).length} categories
												configured
											</p>
										</CardContent>
									</Card>
								</div>

								<div className="flex flex-col items-center justify-center p-8">
									<Button
										size="lg"
										onClick={handleTestConnection}
										disabled={loading}
									>
										{loading && (
											<Loader2 className="h-5 w-5 mr-2 animate-spin" />
										)}
										<TestTube2 className="h-5 w-5 mr-2" />
										Test Connection Now
									</Button>
								</div>
							</div>
						</div>
					)}
				</CardContent>

				<CardFooter className="flex justify-between">
					<Button
						variant="outline"
						onClick={handleBack}
						disabled={currentStep === 1 || loading}
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back
					</Button>

					{currentStep < 4 ? (
						<Button onClick={handleNext} disabled={!canProceed() || loading}>
							Next
							<ArrowRight className="h-4 w-4 ml-2" />
						</Button>
					) : (
						<Button onClick={() => onComplete?.()} disabled={loading}>
							<CheckCircle2 className="h-4 w-4 mr-2" />
							Complete Setup
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
