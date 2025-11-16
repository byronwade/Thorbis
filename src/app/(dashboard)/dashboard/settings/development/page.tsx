"use client";

/**
 * Development Settings Page - Enhanced with Simulations
 *
 * Comprehensive developer tools for testing and debugging the application.
 * Includes role switcher, communication simulations, and debugging utilities.
 *
 * Features:
 * - Role switching for testing different user experiences
 * - Incoming call simulation (with WebRTC integration)
 * - SMS/Email simulation
 * - Voicemail simulation
 * - Test customer data generation
 * - State inspection tools
 * - Cross-tab sync testing
 * - Performance monitoring
 *
 * Client-side features:
 * - Role state management with Zustand
 * - Interactive simulation triggers
 * - Real-time state updates
 */

import {
	AlertTriangle,
	Code,
	Database,
	Mail,
	MessageSquare,
	Monitor,
	Phone,
	RefreshCw,
	TestTube,
	User,
	Users,
	Voicemail,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { SettingsInfoBanner, SettingsPageLayout } from "@/components/settings/settings-page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCommunicationNotificationsStore } from "@/lib/stores/communication-notifications-store";
import { useRoleStore } from "@/lib/stores/role-store";
import { ROLE_CONFIGS, USER_ROLES, type UserRole } from "@/types/roles";

export default function DevelopmentSettingsPage() {
	const currentRole = useRoleStore((state) => state.role);
	const setRole = useRoleStore((state) => state.setRole);
	const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
	const [hasChanges, setHasChanges] = useState(false);

	// Simulation state
	const [simulationCustomerName, setSimulationCustomerName] = useState("John Smith");
	const [simulationPhone, setSimulationPhone] = useState("+1 (555) 123-4567");
	const [simulationEmail, setSimulationEmail] = useState("john.smith@example.com");
	const [simulationMessage, setSimulationMessage] = useState("Hi, I have a question about my recent order.");
	const [_simulationCallStatus, _setSimulationCallStatus] = useState<"incoming" | "missed" | "completed">("incoming");

	// Communication simulation actions
	const showCallToast = useCommunicationNotificationsStore((state) => state.showCallToast);
	const showSMSToast = useCommunicationNotificationsStore((state) => state.showSMSToast);
	const showEmailToast = useCommunicationNotificationsStore((state) => state.showEmailToast);
	const showVoicemailToast = useCommunicationNotificationsStore((state) => state.showVoicemailToast);

	// Handle role selection
	const handleRoleChange = (role: UserRole) => {
		setSelectedRole(role);
		setHasChanges(role !== currentRole);
	};

	// Apply role change
	const handleSave = () => {
		setRole(selectedRole);
		setHasChanges(false);
		// Reload page to trigger dashboard update
		window.location.reload();
	};

	// Cancel changes
	const handleCancel = () => {
		setSelectedRole(currentRole);
		setHasChanges(false);
	};

	// Get role config for display
	const currentRoleConfig = ROLE_CONFIGS[currentRole];
	const _selectedRoleConfig = ROLE_CONFIGS[selectedRole];

	// Development-only roles for testing (exclude ADMIN)
	const testRoles: UserRole[] = [
		USER_ROLES.OWNER,
		USER_ROLES.MANAGER,
		USER_ROLES.DISPATCHER,
		USER_ROLES.TECHNICIAN,
		USER_ROLES.CSR,
	];

	// Simulation handlers
	const handleSimulateIncomingCall = () => {
		showCallToast(simulationCustomerName, simulationPhone, "incoming", {
			timestamp: new Date().toISOString(),
			duration: 0,
		});

		// Also trigger the actual incoming call notification popup
		if (typeof window !== "undefined") {
			// Dispatch custom event to trigger IncomingCallNotification
			window.dispatchEvent(
				new CustomEvent("simulate-incoming-call", {
					detail: {
						name: simulationCustomerName,
						number: simulationPhone,
						avatar: undefined,
					},
				})
			);
		}
	};

	const handleSimulateOutgoingCall = () => {
		// Trigger the outgoing call popup (shows as active call)
		if (typeof window !== "undefined") {
			window.dispatchEvent(
				new CustomEvent("simulate-outgoing-call", {
					detail: {
						name: simulationCustomerName,
						number: simulationPhone,
						avatar: undefined,
					},
				})
			);
		}
	};

	const handleSimulateMissedCall = () => {
		showCallToast(simulationCustomerName, simulationPhone, "missed", {
			timestamp: new Date().toISOString(),
		});
	};

	const handleSimulateCompletedCall = () => {
		showCallToast(simulationCustomerName, simulationPhone, "completed", {
			timestamp: new Date().toISOString(),
			duration: "3:45",
		});
	};

	const handleSimulateSMS = () => {
		showSMSToast(simulationCustomerName, simulationPhone, simulationMessage);
	};

	const handleSimulateEmail = () => {
		showEmailToast(simulationCustomerName, simulationEmail, "Question about order");
	};

	const handleSimulateVoicemail = () => {
		showVoicemailToast(simulationCustomerName, simulationPhone, 45);
	};

	const handleSimulateMultiple = () => {
		// Simulate a realistic burst of communications
		setTimeout(() => handleSimulateIncomingCall(), 0);
		setTimeout(() => handleSimulateSMS(), 2000);
		setTimeout(() => handleSimulateEmail(), 4000);
		setTimeout(() => handleSimulateVoicemail(), 6000);
	};

	return (
		<SettingsPageLayout
			description="Developer tools for testing, debugging, and simulating application features."
			hasChanges={hasChanges}
			helpText="These settings are for development and testing purposes only. Changes here do not affect production behavior."
			onCancel={handleCancel}
			onSave={handleSave}
			saveButtonText="Apply Role Change"
			title="Development Settings"
		>
			{/* Warning Banner */}
			<SettingsInfoBanner
				description="These settings are only available in development mode and should not be used in production. Some features may trigger notifications across all open tabs."
				icon={AlertTriangle}
				title="Development Mode Only"
				variant="amber"
			/>

			{/* Current Role Display */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User className="h-5 w-5" />
						Current Role
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<p className="font-semibold text-lg">{currentRoleConfig.label}</p>
								<Badge className="capitalize" variant={currentRole === USER_ROLES.OWNER ? "default" : "secondary"}>
									{currentRole}
								</Badge>
							</div>
							<p className="text-muted-foreground text-sm">{currentRoleConfig.description}</p>
						</div>
						<div className="rounded-full bg-primary/10 p-3">
							<User className="h-6 w-6 text-primary" />
						</div>
					</div>

					{/* Dashboard Features Preview */}
					<div className="space-y-2">
						<Label className="text-muted-foreground text-xs">Dashboard Features</Label>
						<div className="flex flex-wrap gap-2">
							{currentRoleConfig.dashboardFeatures.map((feature) => (
								<Badge key={feature} variant="outline">
									{feature}
								</Badge>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Role Switcher */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<RefreshCw className="h-5 w-5" />
						Role Switcher
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground text-sm">
						Switch between different user roles to test the dashboard views and permissions. The page will reload to
						apply changes.
					</p>

					<RadioGroup
						className="space-y-3"
						onValueChange={(value) => handleRoleChange(value as UserRole)}
						value={selectedRole}
					>
						{testRoles.map((role) => {
							const config = ROLE_CONFIGS[role];
							const isSelected = selectedRole === role;
							const isCurrent = currentRole === role;

							return (
								<div
									className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
										isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
									}`}
									key={role}
								>
									<RadioGroupItem className="mt-1" id={role} value={role} />
									<div className="flex-1 space-y-1">
										<div className="flex items-center gap-2">
											<Label className="cursor-pointer font-semibold text-base" htmlFor={role}>
												{config.label}
											</Label>
											{isCurrent && (
												<Badge className="text-xs" variant="default">
													Current
												</Badge>
											)}
										</div>
										<p className="text-muted-foreground text-sm">{config.description}</p>
										{/* Dashboard Features for Selected Role */}
										{isSelected && selectedRole !== currentRole && (
											<div className="mt-3 space-y-2">
												<Label className="text-muted-foreground text-xs">Will switch to features:</Label>
												<div className="flex flex-wrap gap-1.5">
													{config.dashboardFeatures.map((feature) => (
														<Badge key={feature} variant="outline">
															{feature}
														</Badge>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</RadioGroup>
				</CardContent>
			</Card>

			<Separator />

			{/* Communication Simulations */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Phone className="h-5 w-5" />
						Communication Simulations
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-muted-foreground text-sm">
						Simulate incoming communications to test notification systems, UI components, and cross-tab synchronization.
						These will trigger real notifications across all open tabs.
					</p>

					{/* Simulation Data */}
					<div className="space-y-4 rounded-lg border bg-muted/30 p-4">
						<h4 className="font-semibold text-sm">Simulation Data</h4>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="sim-name">Customer Name</Label>
								<Input
									id="sim-name"
									onChange={(e) => setSimulationCustomerName(e.target.value)}
									placeholder="John Smith"
									value={simulationCustomerName}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="sim-phone">Phone Number</Label>
								<Input
									id="sim-phone"
									onChange={(e) => setSimulationPhone(e.target.value)}
									placeholder="+1 (555) 123-4567"
									value={simulationPhone}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="sim-email">Email Address</Label>
								<Input
									id="sim-email"
									onChange={(e) => setSimulationEmail(e.target.value)}
									placeholder="john.smith@example.com"
									type="email"
									value={simulationEmail}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="sim-message">Message Content</Label>
								<Input
									id="sim-message"
									onChange={(e) => setSimulationMessage(e.target.value)}
									placeholder="Hi, I have a question..."
									value={simulationMessage}
								/>
							</div>
						</div>
					</div>

					{/* Call Simulations */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Phone className="h-4 w-4 text-primary" />
							<h4 className="font-semibold text-sm">Phone Call Simulations</h4>
						</div>
						<p className="text-muted-foreground text-xs">
							Simulate calls to test the calling popup interface. Incoming calls show the incoming call view, outgoing
							calls show the active call view.
						</p>
						<div className="grid gap-2 sm:grid-cols-2">
							<Button className="w-full" onClick={handleSimulateIncomingCall} size="sm" variant="outline">
								<Phone className="mr-2 h-4 w-4" />
								Simulate Incoming Call
							</Button>
							<Button className="w-full" onClick={handleSimulateOutgoingCall} size="sm" variant="outline">
								<Phone className="mr-2 h-4 w-4" />
								Simulate Outgoing Call
							</Button>
						</div>
						<div className="grid gap-2 sm:grid-cols-2">
							<Button className="w-full" onClick={handleSimulateMissedCall} size="sm" variant="outline">
								<Phone className="mr-2 h-4 w-4 text-destructive" />
								Missed Call Toast
							</Button>
							<Button className="w-full" onClick={handleSimulateCompletedCall} size="sm" variant="outline">
								<Phone className="mr-2 h-4 w-4 text-success" />
								Completed Call Toast
							</Button>
						</div>
					</div>

					{/* Voicemail Simulation */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Voicemail className="h-4 w-4 text-primary" />
							<h4 className="font-semibold text-sm">Voicemail Simulation</h4>
						</div>
						<Button className="w-full" onClick={handleSimulateVoicemail} size="sm" variant="outline">
							<Voicemail className="mr-2 h-4 w-4" />
							New Voicemail (45s)
						</Button>
					</div>

					{/* SMS Simulation */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<MessageSquare className="h-4 w-4 text-primary" />
							<h4 className="font-semibold text-sm">SMS Simulation</h4>
						</div>
						<Button className="w-full" onClick={handleSimulateSMS} size="sm" variant="outline">
							<MessageSquare className="mr-2 h-4 w-4" />
							Incoming Text Message
						</Button>
					</div>

					{/* Email Simulation */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Mail className="h-4 w-4 text-primary" />
							<h4 className="font-semibold text-sm">Email Simulation</h4>
						</div>
						<Button className="w-full" onClick={handleSimulateEmail} size="sm" variant="outline">
							<Mail className="mr-2 h-4 w-4" />
							Incoming Email
						</Button>
					</div>

					<Separator />

					{/* Multiple Simulations */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Zap className="h-4 w-4 text-warning" />
							<h4 className="font-semibold text-sm">Bulk Simulation (Stress Test)</h4>
						</div>
						<Button className="w-full" onClick={handleSimulateMultiple} size="sm" variant="default">
							<Zap className="mr-2 h-4 w-4" />
							Simulate Multiple Communications
						</Button>
						<p className="text-muted-foreground text-xs">
							Simulates call, SMS, email, and voicemail in sequence (2s intervals). Tests notification handling under
							load.
						</p>
					</div>
				</CardContent>
			</Card>

			{/* State Inspection Tools */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Monitor className="h-5 w-5" />
						State Inspection
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground text-sm">Tools for inspecting application state and debugging issues.</p>

					<div className="grid gap-3 sm:grid-cols-2">
						<Button onClick={() => {}} size="sm" variant="outline">
							<Database className="mr-2 h-4 w-4" />
							Log Store State
						</Button>

						<Button
							onClick={() => {
								localStorage.clear();
								sessionStorage.clear();
								window.location.reload();
							}}
							size="sm"
							variant="outline"
						>
							<RefreshCw className="mr-2 h-4 w-4" />
							Clear All Storage
						</Button>

						<Button
							onClick={() => {
								if (typeof window !== "undefined") {
									const _info = {
										userAgent: navigator.userAgent,
										viewport: {
											width: window.innerWidth,
											height: window.innerHeight,
										},
										storage: {
											localStorageSize: Object.keys(localStorage).length,
											sessionStorageSize: Object.keys(sessionStorage).length,
										},
										performance: (performance as any).memory
											? {
													usedJSHeapSize: `${((performance as any).memory.usedJSHeapSize / 1_048_576).toFixed(2)} MB`,
													totalJSHeapSize: `${((performance as any).memory.totalJSHeapSize / 1_048_576).toFixed(2)} MB`,
												}
											: "Not available",
									};
								}
							}}
							size="sm"
							variant="outline"
						>
							<TestTube className="mr-2 h-4 w-4" />
							Log Browser Info
						</Button>

						<Button
							onClick={() => {
								window.open("/dashboard", "_blank");
							}}
							size="sm"
							variant="outline"
						>
							<Users className="mr-2 h-4 w-4" />
							Open Second Tab
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Additional Dev Tools Info */}
			<SettingsInfoBanner
				description="Role changes are persisted in localStorage under the key 'thorbis_dev_role'. Communication simulations trigger real notifications and will sync across all open tabs. Clear your browser storage to reset to defaults."
				icon={Code}
				title="Technical Details"
				variant="blue"
			/>
		</SettingsPageLayout>
	);
}
