"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Bot,
	Shield,
	Phone,
	Mail,
	MessageSquare,
	DollarSign,
	Calendar,
	Users,
	Sparkles,
	AlertTriangle,
	Info,
	Save,
	Brain,
	Building2,
	Truck,
	Bell,
	Home,
	Wrench,
	BarChart3,
	Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type PermissionMode = "autonomous" | "ask_permission" | "manual_only" | "disabled";

interface AISettings {
	id?: string;
	permission_mode: PermissionMode;
	action_permissions: Record<string, PermissionMode>;
	preferred_model: string;
	model_temperature: number;
	proactive_customer_outreach: boolean;
	proactive_financial_advice: boolean;
	proactive_scheduling_suggestions: boolean;
	can_make_calls: boolean;
	can_send_sms: boolean;
	can_send_emails: boolean;
	can_create_invoices: boolean;
	can_create_appointments: boolean;
	can_create_customers: boolean;
	can_update_customers: boolean;
	can_archive_customers: boolean;
	can_move_funds: boolean;
	can_manage_buckets: boolean;
	max_transaction_amount: number;
	active_hours_start: string;
	active_hours_end: string;
	active_days: number[];
	notify_on_action: boolean;
	notification_email: string | null;
	notification_sms: string | null;
	custom_system_prompt: string | null;
	company_context: string | null;
	// New capability flags
	can_email_team: boolean;
	can_sms_team: boolean;
	can_email_vendors: boolean;
	can_sms_vendors: boolean;
	can_schedule_reminders: boolean;
	can_access_detailed_reports: boolean;
	can_access_properties: boolean;
	can_access_equipment: boolean;
}

const defaultSettings: AISettings = {
	permission_mode: "ask_permission",
	action_permissions: {
		communication: "ask_permission",
		financial: "ask_permission",
		scheduling: "ask_permission",
		customer: "ask_permission",
		reporting: "autonomous",
		system: "disabled",
		team: "ask_permission",
		vendor: "ask_permission",
		notification: "ask_permission",
		property: "autonomous",
		equipment: "autonomous",
	},
	preferred_model: "claude-3-5-sonnet-20241022",
	model_temperature: 0.7,
	proactive_customer_outreach: false,
	proactive_financial_advice: false,
	proactive_scheduling_suggestions: false,
	can_make_calls: false,
	can_send_sms: false,
	can_send_emails: false,
	can_create_invoices: false,
	can_create_appointments: false,
	can_create_customers: false,
	can_update_customers: false,
	can_archive_customers: false,
	can_move_funds: false,
	can_manage_buckets: false,
	max_transaction_amount: 10000, // $100 in cents
	active_hours_start: "08:00",
	active_hours_end: "18:00",
	active_days: [1, 2, 3, 4, 5],
	notify_on_action: true,
	notification_email: null,
	notification_sms: null,
	custom_system_prompt: null,
	company_context: null,
	// New capability defaults
	can_email_team: false,
	can_sms_team: false,
	can_email_vendors: false,
	can_sms_vendors: false,
	can_schedule_reminders: false,
	can_access_detailed_reports: true,
	can_access_properties: true,
	can_access_equipment: true,
};

const permissionModeLabels: Record<PermissionMode, { label: string; description: string; color: string }> = {
	autonomous: {
		label: "Autonomous",
		description: "AI can take actions without asking",
		color: "bg-green-500",
	},
	ask_permission: {
		label: "Ask Permission",
		description: "AI asks before taking actions",
		color: "bg-yellow-500",
	},
	manual_only: {
		label: "Manual Only",
		description: "AI only responds when asked",
		color: "bg-blue-500",
	},
	disabled: {
		label: "Disabled",
		description: "AI cannot take any actions",
		color: "bg-gray-500",
	},
};

const models = [
	{ id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
	{ id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", provider: "Anthropic" },
	{ id: "claude-3-opus-20240229", name: "Claude 3 Opus", provider: "Anthropic" },
	{ id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
	{ id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
];

export function AISettingsData() {
	const [settings, setSettings] = useState<AISettings>(defaultSettings);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [companyId, setCompanyId] = useState<string | null>(null);

	useEffect(() => {
		loadSettings();
	}, []);

	async function loadSettings() {
		setLoading(true);
		const supabase = createClient();

		// Get current user's company
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) {
			setLoading(false);
			return;
		}

		const { data: membership } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!membership) {
			setLoading(false);
			return;
		}

		setCompanyId(membership.company_id);

		// Load existing settings
		const { data } = await supabase
			.from("ai_agent_settings")
			.select("*")
			.eq("company_id", membership.company_id)
			.single();

		if (data) {
			setSettings({
				...defaultSettings,
				...data,
				action_permissions: data.action_permissions || defaultSettings.action_permissions,
			});
		}

		setLoading(false);
	}

	async function saveSettings() {
		if (!companyId) return;

		setSaving(true);
		const supabase = createClient();

		const { error } = await supabase
			.from("ai_agent_settings")
			.upsert({
				company_id: companyId,
				...settings,
				updated_at: new Date().toISOString(),
			}, { onConflict: "company_id" });

		if (error) {
			toast.error("Failed to save settings");
		} else {
			toast.success("AI settings saved successfully");
		}

		setSaving(false);
	}

	function updateSetting<K extends keyof AISettings>(key: K, value: AISettings[K]) {
		setSettings((prev) => ({ ...prev, [key]: value }));
	}

	function updateActionPermission(category: string, mode: PermissionMode) {
		setSettings((prev) => ({
			...prev,
			action_permissions: {
				...prev.action_permissions,
				[category]: mode,
			},
		}));
	}

	if (loading) {
		return <div className="p-6">Loading...</div>;
	}

	return (
		<div className="space-y-6 p-6 max-w-4xl">
			<div>
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<Bot className="size-6" />
					AI Assistant Settings
				</h1>
				<p className="text-muted-foreground mt-1">
					Configure how the AI assistant manages your business
				</p>
			</div>

			<Alert>
				<Info className="size-4" />
				<AlertDescription>
					The AI assistant can help manage customers, schedule appointments, send communications,
					and provide business insights. Configure permissions below to control what actions it can take.
				</AlertDescription>
			</Alert>

			<Tabs defaultValue="permissions" className="space-y-6">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="permissions">
						<Shield className="size-4 mr-2" />
						Permissions
					</TabsTrigger>
					<TabsTrigger value="capabilities">
						<Sparkles className="size-4 mr-2" />
						Capabilities
					</TabsTrigger>
					<TabsTrigger value="proactive">
						<Brain className="size-4 mr-2" />
						Proactive
					</TabsTrigger>
					<TabsTrigger value="advanced">
						<Bot className="size-4 mr-2" />
						Advanced
					</TabsTrigger>
				</TabsList>

				{/* PERMISSIONS TAB */}
				<TabsContent value="permissions" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Global Permission Mode</CardTitle>
							<CardDescription>
								Choose how the AI should behave when taking actions
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-3">
								{(Object.entries(permissionModeLabels) as [PermissionMode, typeof permissionModeLabels[PermissionMode]][]).map(([mode, info]) => (
									<div
										key={mode}
										className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
											settings.permission_mode === mode
												? "border-primary bg-primary/5"
												: "hover:bg-muted/50"
										}`}
										onClick={() => updateSetting("permission_mode", mode)}
									>
										<div className="flex items-center gap-3">
											<div className={`size-3 rounded-full ${info.color}`} />
											<div>
												<div className="font-medium">{info.label}</div>
												<div className="text-sm text-muted-foreground">
													{info.description}
												</div>
											</div>
										</div>
										{settings.permission_mode === mode && (
											<Badge variant="secondary">Active</Badge>
										)}
									</div>
								))}
							</div>

							{settings.permission_mode === "autonomous" && (
								<Alert variant="destructive">
									<AlertTriangle className="size-4" />
									<AlertDescription>
										In Autonomous mode, the AI can take actions without asking.
										Make sure to configure capability limits below.
									</AlertDescription>
								</Alert>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Per-Category Permissions</CardTitle>
							<CardDescription>
								Override permissions for specific action categories
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{[
									{ key: "communication", label: "Communication", icon: MessageSquare, desc: "Emails, SMS, calls to customers" },
									{ key: "team", label: "Team Communication", icon: Building2, desc: "Emails, SMS to team members" },
									{ key: "vendor", label: "Vendor Communication", icon: Truck, desc: "Emails, SMS to vendors" },
									{ key: "financial", label: "Financial", icon: DollarSign, desc: "Invoices, payments, funds" },
									{ key: "scheduling", label: "Scheduling", icon: Calendar, desc: "Appointments, jobs" },
									{ key: "notification", label: "Reminders & Notifications", icon: Bell, desc: "Schedule and send reminders" },
									{ key: "customer", label: "Customer Management", icon: Users, desc: "Create, update customers" },
									{ key: "property", label: "Property Access", icon: Home, desc: "Search and view properties" },
									{ key: "equipment", label: "Equipment Access", icon: Wrench, desc: "Search equipment, maintenance" },
									{ key: "reporting", label: "Reporting", icon: BarChart3, desc: "Analytics, insights, reports" },
								].map((cat) => (
									<div key={cat.key} className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<cat.icon className="size-5 text-muted-foreground" />
											<div>
												<div className="font-medium">{cat.label}</div>
												<div className="text-sm text-muted-foreground">{cat.desc}</div>
											</div>
										</div>
										<Select
											value={settings.action_permissions[cat.key] || settings.permission_mode}
											onValueChange={(value) => updateActionPermission(cat.key, value as PermissionMode)}
										>
											<SelectTrigger className="w-40">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="autonomous">Autonomous</SelectItem>
												<SelectItem value="ask_permission">Ask Permission</SelectItem>
												<SelectItem value="manual_only">Manual Only</SelectItem>
												<SelectItem value="disabled">Disabled</SelectItem>
											</SelectContent>
										</Select>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* CAPABILITIES TAB */}
				<TabsContent value="capabilities" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<MessageSquare className="size-5" />
								Communication Capabilities
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<Mail className="size-4" />
										Send Emails
									</Label>
									<p className="text-sm text-muted-foreground">
										Allow AI to send emails to customers
									</p>
								</div>
								<Switch
									checked={settings.can_send_emails}
									onCheckedChange={(v) => updateSetting("can_send_emails", v)}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<MessageSquare className="size-4" />
										Send SMS
									</Label>
									<p className="text-sm text-muted-foreground">
										Allow AI to send text messages
									</p>
								</div>
								<Switch
									checked={settings.can_send_sms}
									onCheckedChange={(v) => updateSetting("can_send_sms", v)}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<Phone className="size-4" />
										Make Calls
									</Label>
									<p className="text-sm text-muted-foreground">
										Allow AI to initiate phone calls
									</p>
								</div>
								<Switch
									checked={settings.can_make_calls}
									onCheckedChange={(v) => updateSetting("can_make_calls", v)}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Building2 className="size-5" />
								Team Communication
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<Mail className="size-4" />
										Email Team Members
									</Label>
									<p className="text-sm text-muted-foreground">
										Allow AI to send emails to team members
									</p>
								</div>
								<Switch
									checked={settings.can_email_team}
									onCheckedChange={(v) => updateSetting("can_email_team", v)}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<MessageSquare className="size-4" />
										SMS Team Members
									</Label>
									<p className="text-sm text-muted-foreground">
										Allow AI to send text messages to team members
									</p>
								</div>
								<Switch
									checked={settings.can_sms_team}
									onCheckedChange={(v) => updateSetting("can_sms_team", v)}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Truck className="size-5" />
								Vendor Communication
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<Mail className="size-4" />
										Email Vendors
									</Label>
									<p className="text-sm text-muted-foreground">
										Allow AI to send emails to vendors/suppliers
									</p>
								</div>
								<Switch
									checked={settings.can_email_vendors}
									onCheckedChange={(v) => updateSetting("can_email_vendors", v)}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<MessageSquare className="size-4" />
										SMS Vendors
									</Label>
									<p className="text-sm text-muted-foreground">
										Allow AI to send text messages to vendors
									</p>
								</div>
								<Switch
									checked={settings.can_sms_vendors}
									onCheckedChange={(v) => updateSetting("can_sms_vendors", v)}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<DollarSign className="size-5" />
								Financial Capabilities
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Create Invoices</Label>
									<p className="text-sm text-muted-foreground">
										Allow AI to create new invoices
									</p>
								</div>
								<Switch
									checked={settings.can_create_invoices}
									onCheckedChange={(v) => updateSetting("can_create_invoices", v)}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Move Funds</Label>
									<p className="text-sm text-muted-foreground">
										Allow AI to transfer to virtual buckets
									</p>
								</div>
								<Switch
									checked={settings.can_move_funds}
									onCheckedChange={(v) => updateSetting("can_move_funds", v)}
								/>
							</div>
							{settings.can_move_funds && (
								<div className="pl-4 border-l-2">
									<Label>Maximum Transaction Amount</Label>
									<div className="flex items-center gap-2 mt-1">
										<span className="text-muted-foreground">$</span>
										<Input
											type="number"
											className="w-32"
											value={settings.max_transaction_amount / 100}
											onChange={(e) =>
												updateSetting("max_transaction_amount", Number(e.target.value) * 100)
											}
										/>
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Calendar className="size-5" />
								Scheduling Capabilities
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Create Appointments</Label>
									<p className="text-sm text-muted-foreground">
										Allow AI to schedule appointments
									</p>
								</div>
								<Switch
									checked={settings.can_create_appointments}
									onCheckedChange={(v) => updateSetting("can_create_appointments", v)}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<Bell className="size-4" />
										Schedule Reminders
									</Label>
									<p className="text-sm text-muted-foreground">
										Allow AI to schedule and send reminders
									</p>
								</div>
								<Switch
									checked={settings.can_schedule_reminders}
									onCheckedChange={(v) => updateSetting("can_schedule_reminders", v)}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="size-5" />
								Customer Management
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Create Customers</Label>
									<p className="text-sm text-muted-foreground">
										Allow AI to add new customers
									</p>
								</div>
								<Switch
									checked={settings.can_create_customers}
									onCheckedChange={(v) => updateSetting("can_create_customers", v)}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Update Customers</Label>
									<p className="text-sm text-muted-foreground">
										Allow AI to modify customer info
									</p>
								</div>
								<Switch
									checked={settings.can_update_customers}
									onCheckedChange={(v) => updateSetting("can_update_customers", v)}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BarChart3 className="size-5" />
								Data Access
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<BarChart3 className="size-4" />
										Detailed Reports
									</Label>
									<p className="text-sm text-muted-foreground">
										Job costing, revenue breakdown, AR aging reports
									</p>
								</div>
								<Switch
									checked={settings.can_access_detailed_reports}
									onCheckedChange={(v) => updateSetting("can_access_detailed_reports", v)}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<Home className="size-4" />
										Property Data
									</Label>
									<p className="text-sm text-muted-foreground">
										Search and view property information
									</p>
								</div>
								<Switch
									checked={settings.can_access_properties}
									onCheckedChange={(v) => updateSetting("can_access_properties", v)}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<Wrench className="size-4" />
										Equipment Data
									</Label>
									<p className="text-sm text-muted-foreground">
										Search equipment and maintenance schedules
									</p>
								</div>
								<Switch
									checked={settings.can_access_equipment}
									onCheckedChange={(v) => updateSetting("can_access_equipment", v)}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* PROACTIVE TAB */}
				<TabsContent value="proactive" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Proactive Features</CardTitle>
							<CardDescription>
								Enable AI to proactively help with business operations
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Customer Outreach</Label>
									<p className="text-sm text-muted-foreground">
										Suggest follow-ups for inactive customers, send reminders
									</p>
								</div>
								<Switch
									checked={settings.proactive_customer_outreach}
									onCheckedChange={(v) => updateSetting("proactive_customer_outreach", v)}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Financial Advice</Label>
									<p className="text-sm text-muted-foreground">
										Alert on overdue invoices, suggest collections, budget advice
									</p>
								</div>
								<Switch
									checked={settings.proactive_financial_advice}
									onCheckedChange={(v) => updateSetting("proactive_financial_advice", v)}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Scheduling Suggestions</Label>
									<p className="text-sm text-muted-foreground">
										Optimize routes, suggest appointment times, prevent conflicts
									</p>
								</div>
								<Switch
									checked={settings.proactive_scheduling_suggestions}
									onCheckedChange={(v) => updateSetting("proactive_scheduling_suggestions", v)}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Action Notifications</CardTitle>
							<CardDescription>
								Get notified when the AI takes actions
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Enable Notifications</Label>
									<p className="text-sm text-muted-foreground">
										Receive alerts when AI performs actions
									</p>
								</div>
								<Switch
									checked={settings.notify_on_action}
									onCheckedChange={(v) => updateSetting("notify_on_action", v)}
								/>
							</div>
							{settings.notify_on_action && (
								<>
									<div className="space-y-2">
										<Label>Notification Email</Label>
										<Input
											type="email"
											placeholder="your@email.com"
											value={settings.notification_email || ""}
											onChange={(e) => updateSetting("notification_email", e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label>Notification SMS</Label>
										<Input
											type="tel"
											placeholder="+1 (555) 555-5555"
											value={settings.notification_sms || ""}
											onChange={(e) => updateSetting("notification_sms", e.target.value)}
										/>
									</div>
								</>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* ADVANCED TAB */}
				<TabsContent value="advanced" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>AI Model Settings</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label>Preferred Model</Label>
								<Select
									value={settings.preferred_model}
									onValueChange={(v) => updateSetting("preferred_model", v)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{models.map((model) => (
											<SelectItem key={model.id} value={model.id}>
												{model.name} ({model.provider})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Temperature (Creativity): {settings.model_temperature}</Label>
								<input
									type="range"
									min="0"
									max="1"
									step="0.1"
									className="w-full"
									value={settings.model_temperature}
									onChange={(e) => updateSetting("model_temperature", Number(e.target.value))}
								/>
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>Precise</span>
									<span>Creative</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Custom Instructions</CardTitle>
							<CardDescription>
								Provide additional context or instructions for the AI
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label>Business Context</Label>
								<Textarea
									placeholder="Describe your business, services, and any specific terminology..."
									className="min-h-24"
									value={settings.company_context || ""}
									onChange={(e) => updateSetting("company_context", e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label>Custom System Prompt</Label>
								<Textarea
									placeholder="Additional instructions for the AI (advanced)..."
									className="min-h-24"
									value={settings.custom_system_prompt || ""}
									onChange={(e) => updateSetting("custom_system_prompt", e.target.value)}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Active Hours</CardTitle>
							<CardDescription>
								When can the AI take autonomous actions
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label>Start Time</Label>
									<Input
										type="time"
										value={settings.active_hours_start}
										onChange={(e) => updateSetting("active_hours_start", e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label>End Time</Label>
									<Input
										type="time"
										value={settings.active_hours_end}
										onChange={(e) => updateSetting("active_hours_end", e.target.value)}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<div className="flex justify-end">
				<Button onClick={saveSettings} disabled={saving}>
					<Save className="size-4 mr-2" />
					{saving ? "Saving..." : "Save Settings"}
				</Button>
			</div>
		</div>
	);
}
