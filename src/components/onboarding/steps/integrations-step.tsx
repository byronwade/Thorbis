"use client";

/**
 * Integrations Step - Connect External Apps
 *
 * Based on competitor research (FieldPulse, Housecall Pro):
 * - QuickBooks integration during onboarding (FieldPulse highlight)
 * - Google Calendar sync for scheduling
 * - Reduces setup friction by connecting early
 *
 * Key insight: FieldPulse offers "QuickBooks cleanup" as premium feature
 * because existing QuickBooks data can be messy. We highlight this benefit.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	CheckCircle2,
	ExternalLink,
	ArrowRight,
	Sparkles,
	AlertCircle,
	RefreshCw,
	Clock,
	DollarSign,
	Calendar,
	FileText,
	Users,
	Zap,
} from "lucide-react";

// Integration options
const INTEGRATIONS = [
	{
		id: "quickbooks",
		name: "QuickBooks",
		description: "Sync invoices, payments, and customer data automatically",
		logo: "/integrations/quickbooks-logo.svg",
		popular: true,
		benefits: [
			"Invoices sync automatically to QuickBooks",
			"Customer data stays in sync",
			"Payment reconciliation made easy",
			"No more double data entry",
		],
		fields: ["Invoices", "Payments", "Customers", "Products/Services"],
		setupTime: "2 minutes",
		category: "accounting",
	},
	{
		id: "google-calendar",
		name: "Google Calendar",
		description: "Sync job schedules to your Google Calendar",
		logo: "/integrations/google-calendar-logo.svg",
		popular: true,
		benefits: [
			"See all jobs on your Google Calendar",
			"Technicians get schedule updates",
			"Prevent double-booking",
			"Works with mobile devices",
		],
		fields: ["Jobs", "Appointments", "Schedules"],
		setupTime: "1 minute",
		category: "calendar",
	},
	{
		id: "stripe",
		name: "Stripe",
		description: "Accept credit card payments from customers",
		logo: "/integrations/stripe-logo.svg",
		popular: false,
		benefits: [
			"Accept all major credit cards",
			"Secure payment processing",
			"Automatic payment receipts",
			"ACH bank transfers",
		],
		fields: ["Payments", "Invoices"],
		setupTime: "5 minutes",
		category: "payments",
		note: "Set up in Payments step",
	},
];

// Integration sync info cards
const SYNC_BENEFITS = [
	{
		icon: DollarSign,
		title: "Save 5+ hours/week",
		description: "No more manually entering data in multiple systems",
	},
	{
		icon: RefreshCw,
		title: "Real-time sync",
		description: "Data updates automatically across all connected apps",
	},
	{
		icon: AlertCircle,
		title: "Reduce errors",
		description: "Eliminate typos and missed entries from manual data entry",
	},
];

export function IntegrationsStep() {
	const { data, updateData } = useOnboardingStore();
	const [connectingId, setConnectingId] = useState<string | null>(null);

	// Simulate OAuth connection (in production, this would redirect to OAuth flow)
	const handleConnect = async (integrationId: string) => {
		setConnectingId(integrationId);

		// Simulate OAuth flow
		await new Promise((r) => setTimeout(r, 2000));

		if (integrationId === "quickbooks") {
			updateData({
				quickbooksConnected: true,
				quickbooksCompanyId: "qb_demo_12345",
				quickbooksLastSync: new Date().toISOString(),
			});
		} else if (integrationId === "google-calendar") {
			updateData({
				googleCalendarConnected: true,
				googleCalendarId: "primary",
			});
		}

		setConnectingId(null);
	};

	const handleDisconnect = (integrationId: string) => {
		if (integrationId === "quickbooks") {
			updateData({
				quickbooksConnected: false,
				quickbooksCompanyId: null,
				quickbooksLastSync: null,
			});
		} else if (integrationId === "google-calendar") {
			updateData({
				googleCalendarConnected: false,
				googleCalendarId: null,
			});
		}
	};

	const isConnected = (integrationId: string) => {
		if (integrationId === "quickbooks") return data.quickbooksConnected;
		if (integrationId === "google-calendar") return data.googleCalendarConnected;
		return false;
	};

	const connectedCount = [data.quickbooksConnected, data.googleCalendarConnected].filter(
		Boolean
	).length;

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="text-center space-y-3">
				<h1 className="text-3xl font-semibold tracking-tight">
					Connect Your Apps
				</h1>
				<p className="text-muted-foreground text-lg max-w-lg mx-auto">
					Link the tools you already use. Everything stays in sync automatically.
				</p>
			</div>

			{/* Benefits bar */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{SYNC_BENEFITS.map((benefit) => {
					const Icon = benefit.icon;
					return (
						<div
							key={benefit.title}
							className="flex items-center gap-3 p-3 rounded-lg bg-muted/40"
						>
							<div className="p-2 rounded-full bg-primary/10">
								<Icon className="h-4 w-4 text-primary" />
							</div>
							<div>
								<p className="font-medium text-sm">{benefit.title}</p>
								<p className="text-xs text-muted-foreground">{benefit.description}</p>
							</div>
						</div>
					);
				})}
			</div>

			{/* Integration Cards */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-medium">Available Integrations</h2>
					{connectedCount > 0 && (
						<Badge variant="secondary" className="bg-green-100 text-green-800">
							{connectedCount} connected
						</Badge>
					)}
				</div>

				<div className="grid gap-4">
					{INTEGRATIONS.map((integration) => {
						const connected = isConnected(integration.id);
						const isConnecting = connectingId === integration.id;

						return (
							<Card
								key={integration.id}
								className={cn(
									"transition-all",
									connected && "border-green-500 bg-green-50/50 dark:bg-green-950/20"
								)}
							>
								<CardContent className="p-6">
									<div className="flex items-start gap-4">
										{/* Logo placeholder */}
										<div
											className={cn(
												"w-12 h-12 rounded-lg flex items-center justify-center",
												connected
													? "bg-green-100 dark:bg-green-900"
													: "bg-muted"
											)}
										>
											{connected ? (
												<CheckCircle2 className="h-6 w-6 text-green-600" />
											) : integration.id === "quickbooks" ? (
												<FileText className="h-6 w-6 text-green-700" />
											) : integration.id === "google-calendar" ? (
												<Calendar className="h-6 w-6 text-blue-600" />
											) : (
												<DollarSign className="h-6 w-6 text-purple-600" />
											)}
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<h3 className="font-semibold">{integration.name}</h3>
												{integration.popular && (
													<Badge variant="secondary" className="text-xs">
														Popular
													</Badge>
												)}
												{connected && (
													<Badge className="bg-green-100 text-green-800 border-green-200">
														Connected
													</Badge>
												)}
											</div>
											<p className="text-sm text-muted-foreground mt-1">
												{integration.description}
											</p>

											{/* Benefits list */}
											{!connected && (
												<div className="mt-3 grid grid-cols-2 gap-2">
													{integration.benefits.slice(0, 4).map((benefit, i) => (
														<div
															key={i}
															className="flex items-center gap-2 text-sm text-muted-foreground"
														>
															<CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
															<span>{benefit}</span>
														</div>
													))}
												</div>
											)}

											{/* Synced fields */}
											{connected && (
												<div className="mt-3 flex flex-wrap gap-2">
													<span className="text-sm text-muted-foreground">Syncing:</span>
													{integration.fields.map((field) => (
														<Badge key={field} variant="outline" className="text-xs">
															{field}
														</Badge>
													))}
												</div>
											)}

											{/* Note for deferred integrations */}
											{integration.note && (
												<p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
													<Clock className="h-3 w-3" />
													{integration.note}
												</p>
											)}
										</div>

										{/* Action button */}
										<div className="flex flex-col gap-2">
											{integration.note ? (
												<Button variant="outline" size="sm" disabled>
													Later
												</Button>
											) : connected ? (
												<>
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleDisconnect(integration.id)}
													>
														Disconnect
													</Button>
													<span className="text-xs text-muted-foreground text-center">
														<Clock className="h-3 w-3 inline mr-1" />
														Just now
													</span>
												</>
											) : (
												<Button
													size="sm"
													onClick={() => handleConnect(integration.id)}
													disabled={isConnecting}
												>
													{isConnecting ? (
														<>
															<RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
															Connecting...
														</>
													) : (
														<>
															Connect
															<ArrowRight className="h-3.5 w-3.5 ml-1" />
														</>
													)}
												</Button>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>

			{/* QuickBooks specific tip */}
			{!data.quickbooksConnected && (
				<Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
					<CardContent className="p-6">
						<div className="flex items-start gap-4">
							<div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
								<Sparkles className="h-6 w-6 text-green-600" />
							</div>
							<div className="flex-1">
								<h3 className="font-semibold text-green-900 dark:text-green-100">
									Why connect QuickBooks now?
								</h3>
								<p className="text-sm text-green-700 dark:text-green-300 mt-1">
									Connecting early means all your Thorbis invoices and payments will
									automatically appear in QuickBooks from day one. No catch-up needed later.
								</p>
								<ul className="mt-3 space-y-1">
									<li className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-500" />
										Import existing customers from QuickBooks
									</li>
									<li className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-500" />
										Sync products/services to your price book
									</li>
									<li className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-500" />
										Automatic payment reconciliation
									</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Skip message */}
			<div className="text-center text-sm text-muted-foreground">
				<p>
					Don't use any of these apps? No problem - you can skip this step and
					connect integrations later from <span className="font-medium">Settings &gt; Integrations</span>.
				</p>
			</div>
		</div>
	);
}
