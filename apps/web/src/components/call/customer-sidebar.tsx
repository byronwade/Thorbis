"use client";

/**
 * Customer Sidebar Component - Enhanced for CSR Efficiency
 *
 * Left sidebar showing customer data, jobs, invoices, appointments, etc.
 *
 * Enhanced features:
 * - Alert banner for critical customer information
 * - Sticky stats bar always visible
 * - Previous call summary for context
 * - Quick actions panel
 * - Reorganized sections for faster access
 */

import {
	AlertCircle,
	Briefcase,
	Building2,
	Calendar,
	Facebook,
	FileText,
	Globe,
	Home,
	Lightbulb,
	Linkedin,
	Loader2,
	Mail,
	MapPin,
	Phone,
	Plus,
	Save,
	Twitter,
	User,
	Wrench,
	X,
} from "lucide-react";
import { useRef, useState } from "react";
import { updateCustomer } from "@/actions/customers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	StandardFormField,
	StandardFormRow,
} from "@/components/ui/standard-form-field";
import { Textarea } from "@/components/ui/textarea";
import {
	UnifiedAccordion,
	type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import type { CustomerCallData } from "@/types/call";
import { DEFAULT_CSR_REMINDERS } from "@/types/csr-reminders";

import { CustomerAlertBanner } from "./customer-alert-banner";
import { CustomerStatsBar } from "./customer-stats-bar";
import { PreviousCallSummary } from "./previous-call-summary";
import { QuickActionsPanel } from "./quick-actions-panel";
import { RecentCommunications } from "./recent-communications";
import { SmsQuickRepliesBar } from "./sms-quick-replies-bar";

type CustomerSidebarProps = {
	customerData: CustomerCallData | null;
	isLoading?: boolean;
	// Quick action handlers
	onCreateJob?: () => void;
	onScheduleAppointment?: () => void;
	onSendSMS?: () => void;
	onSendEmail?: () => void;
	onTakePayment?: () => void;
	onAddNote?: () => void;
	// SMS Quick Reply handler (for actually sending SMS)
	onSendSmsMessage?: (message: string, phoneNumber: string) => Promise<void>;
	// Previous call data
	previousCall?: {
		id: string;
		date: string;
		duration: number;
		disposition: string;
		csrName: string;
		notes?: string;
		topics?: string[];
		sentiment?: "positive" | "neutral" | "negative";
		followUpScheduled?: boolean;
		issueResolved?: boolean;
	} | null;
};

export function CustomerSidebar({
	customerData,
	isLoading,
	onCreateJob,
	onScheduleAppointment,
	onSendSMS,
	onSendEmail,
	onTakePayment,
	onAddNote,
	onSendSmsMessage,
	previousCall,
}: CustomerSidebarProps) {
	// TODO: Fetch CSR reminders from user settings/company settings
	// For now, use default reminders
	const csrReminders = DEFAULT_CSR_REMINDERS.filter((r) => r.enabled).sort(
		(a, b) => a.order - b.order,
	);

	// Calculate open balance from unpaid invoices
	const openBalance =
		customerData?.invoices
			.filter((inv) => inv.status === "unpaid" || inv.status === "overdue")
			.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;

	// Check if any invoices are overdue
	const hasOverdueInvoices =
		customerData?.invoices.some((inv) => inv.status === "overdue") || false;

	// Get last visit date from appointments or jobs
	const lastVisitDate =
		customerData?.jobs
			.filter((job) => job.status === "completed")
			.sort((a, b) => {
				const dateA = a.completed_at || a.updated_at || "";
				const dateB = b.completed_at || b.updated_at || "";
				return new Date(dateB).getTime() - new Date(dateA).getTime();
			})[0]?.completed_at || null;

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center p-6">
				<div className="text-center">
					<div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
					<p className="text-muted-foreground text-sm">
						Loading customer data...
					</p>
				</div>
			</div>
		);
	}

	if (!customerData) {
		return (
			<div className="flex h-full items-center justify-center p-6">
				<div className="text-center">
					<AlertCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
					<p className="text-foreground font-medium">No customer data</p>
					<p className="text-muted-foreground mt-1 text-sm">
						Customer information will appear here
					</p>
				</div>
			</div>
		);
	}

	const {
		customer,
		stats,
		jobs,
		invoices,
		estimates,
		appointments,
		properties,
		equipment,
		recentCommunications,
	} = customerData;

	// Format currency
	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);

	// Format date
	const formatDate = (date: string | null) => {
		if (!date) {
			return "N/A";
		}
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	// State for editable customer data
	const [phoneNumbers, setPhoneNumbers] = useState<string[]>(
		customer?.phone ? [customer.phone] : [""],
	);
	const [emailAddresses, setEmailAddresses] = useState<string[]>(
		customer?.email ? [customer.email] : [""],
	);

	// Add/remove phone numbers
	const addPhoneNumber = () => setPhoneNumbers([...phoneNumbers, ""]);
	const removePhoneNumber = (index: number) => {
		setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
	};
	const updatePhoneNumber = (index: number, value: string) => {
		const updated = [...phoneNumbers];
		updated[index] = value;
		setPhoneNumbers(updated);
	};

	// Add/remove email addresses
	const addEmailAddress = () => setEmailAddresses([...emailAddresses, ""]);
	const removeEmailAddress = (index: number) => {
		setEmailAddresses(emailAddresses.filter((_, i) => i !== index));
	};
	const updateEmailAddress = (index: number, value: string) => {
		const updated = [...emailAddresses];
		updated[index] = value;
		setEmailAddresses(updated);
	};

	// State for save operation
	const [isSaving, setIsSaving] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);

	// Save customer data
	const handleSaveCustomer = async () => {
		if (!customer?.id || !formRef.current) return;

		setIsSaving(true);
		try {
			const form = formRef.current;
			const formData = new FormData();

			// Get form values
			const firstName =
				(form.querySelector("#firstName") as HTMLInputElement)?.value || "";
			const lastName =
				(form.querySelector("#lastName") as HTMLInputElement)?.value || "";
			const companyName =
				(form.querySelector("#companyName") as HTMLInputElement)?.value || "";

			// Build FormData for updateCustomer action
			formData.append("firstName", firstName);
			formData.append("lastName", lastName);
			if (companyName) formData.append("companyName", companyName);

			// Use first phone and email from the arrays
			const primaryPhone = phoneNumbers.find((p) => p.trim()) || "";
			const primaryEmail = emailAddresses.find((e) => e.trim()) || "";
			formData.append("phone", primaryPhone);
			formData.append("email", primaryEmail);

			// Use customer's existing type or default
			formData.append("type", customer.type || "residential");

			const result = await updateCustomer(customer.id, formData);

			if (!result.success) {
				console.error("Failed to save customer:", result.error);
			}
		} catch (error) {
			console.error("Error saving customer:", error);
		} finally {
			setIsSaving(false);
		}
	};

	// Build sections array for UnifiedAccordion
	const sections: UnifiedAccordionSection[] = [
		// Customer Overview - Fully Editable
		{
			id: "overview",
			title: "Customer Overview",
			icon: <User className="h-4 w-4" />,
			actions: (
				<Button
					className="h-8 gap-1.5 px-3"
					disabled={isSaving}
					onClick={handleSaveCustomer}
					size="sm"
					variant="default"
				>
					{isSaving ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<Save className="h-3.5 w-3.5" />
					)}
					{isSaving ? "Saving..." : "Save"}
				</Button>
			),
			content: (
				<form ref={formRef} className="space-y-6 p-6" onSubmit={(e) => e.preventDefault()}>
					{/* Basic Information */}
					<div className="space-y-4">
						<h4 className="text-sm font-semibold">Basic Information</h4>

						<StandardFormRow cols={2}>
							<StandardFormField label="First Name" htmlFor="firstName">
								<Input
									defaultValue={customer?.first_name || ""}
									id="firstName"
									placeholder="Enter first name"
								/>
							</StandardFormField>
							<StandardFormField label="Last Name" htmlFor="lastName">
								<Input
									defaultValue={customer?.last_name || ""}
									id="lastName"
									placeholder="Enter last name"
								/>
							</StandardFormField>
						</StandardFormRow>

						<StandardFormField label="Company" htmlFor="companyName">
							<div className="relative">
								<Building2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
								<Input
									className="pl-9"
									defaultValue={customer?.company_name || ""}
									id="companyName"
									placeholder="Enter company name"
								/>
							</div>
						</StandardFormField>
					</div>

					{/* Contact Information */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h4 className="text-sm font-semibold">Contact Information</h4>
						</div>

						{/* Email Addresses */}
						<div className="space-y-2">
							<Label>Email Addresses</Label>
							{emailAddresses.map((email, index) => (
								<div className="flex gap-2" key={index}>
									<div className="relative flex-1">
										<Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
										<Input
											className="pl-9"
											onChange={(e) =>
												updateEmailAddress(index, e.target.value)
											}
											placeholder="email@example.com"
											type="email"
											value={email}
										/>
									</div>
									{emailAddresses.length > 1 && (
										<Button
											className="h-9 w-9"
											onClick={() => removeEmailAddress(index)}
											size="icon"
											variant="ghost"
										>
											<X className="h-4 w-4" />
										</Button>
									)}
								</div>
							))}
							<Button
								className="w-full"
								onClick={addEmailAddress}
								size="sm"
								variant="outline"
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Email
							</Button>
						</div>

						{/* Phone Numbers */}
						<div className="space-y-2">
							<Label>Phone Numbers</Label>
							{phoneNumbers.map((phone, index) => (
								<div className="flex gap-2" key={index}>
									<div className="relative flex-1">
										<Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
										<Input
											className="pl-9"
											onChange={(e) => updatePhoneNumber(index, e.target.value)}
											placeholder="(555) 123-4567"
											type="tel"
											value={phone}
										/>
									</div>
									{phoneNumbers.length > 1 && (
										<Button
											className="h-9 w-9"
											onClick={() => removePhoneNumber(index)}
											size="icon"
											variant="ghost"
										>
											<X className="h-4 w-4" />
										</Button>
									)}
								</div>
							))}
							<Button
								className="w-full"
								onClick={addPhoneNumber}
								size="sm"
								variant="outline"
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Phone
							</Button>
						</div>
					</div>

					{/* Address */}
					<div className="space-y-4">
						<h4 className="text-sm font-semibold">Address</h4>

						<StandardFormField label="Street Address" htmlFor="address">
							<div className="relative">
								<MapPin className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
								<Textarea
									className="min-h-[60px] pl-9"
									defaultValue={customer?.address || ""}
									id="address"
									placeholder="123 Main Street"
								/>
							</div>
						</StandardFormField>

						<StandardFormRow cols={3}>
							<StandardFormField label="City" htmlFor="city">
								<Input
									defaultValue={customer?.city || ""}
									id="city"
									placeholder="City"
								/>
							</StandardFormField>
							<StandardFormField label="State" htmlFor="state">
								<Input
									defaultValue={customer?.state || ""}
									id="state"
									placeholder="State"
								/>
							</StandardFormField>
							<StandardFormField label="ZIP Code" htmlFor="zipCode">
								<Input
									defaultValue={customer?.zip_code || ""}
									id="zipCode"
									placeholder="12345"
								/>
							</StandardFormField>
						</StandardFormRow>
					</div>

					{/* Enrichment Data */}
					{customer && (
						<div className="space-y-4">
							<h4 className="text-sm font-semibold">Enrichment Data</h4>

							<StandardFormField label="Website" htmlFor="website">
								<div className="relative">
									<Globe className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
									<Input
										className="pl-9"
										defaultValue=""
										id="website"
										placeholder="https://example.com"
										type="url"
									/>
								</div>
							</StandardFormField>

							<StandardFormRow cols={3}>
								<StandardFormField label="LinkedIn" htmlFor="linkedin">
									<div className="relative">
										<Linkedin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
										<Input
											className="pl-9"
											defaultValue=""
											id="linkedin"
											placeholder="Profile URL"
										/>
									</div>
								</StandardFormField>
								<StandardFormField label="Twitter" htmlFor="twitter">
									<div className="relative">
										<Twitter className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
										<Input
											className="pl-9"
											defaultValue=""
											id="twitter"
											placeholder="@username"
										/>
									</div>
								</StandardFormField>
								<StandardFormField label="Facebook" htmlFor="facebook">
									<div className="relative">
										<Facebook className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
										<Input
											className="pl-9"
											defaultValue=""
											id="facebook"
											placeholder="Profile URL"
										/>
									</div>
								</StandardFormField>
							</StandardFormRow>
						</div>
					)}
				</form>
			),
		},
		// Jobs
		{
			id: "jobs",
			title: "Jobs",
			icon: <Briefcase className="h-4 w-4" />,
			count: jobs.length,
			actions: (
				<Button
					className="h-8 gap-1.5 px-3"
					onClick={onCreateJob || (() => {})}
					size="sm"
					variant="outline"
				>
					<Plus className="mr-2 h-3.5 w-3.5" />
					New Job
				</Button>
			),
			content:
				jobs.length > 0 ? (
					<div className="space-y-2 p-6">
						{jobs.map((job) => (
							<div
								className="bg-muted/30 rounded-lg border p-3 text-sm"
								key={job.id}
							>
								<div className="mb-1 flex items-start justify-between">
									<span className="font-medium">
										{job.title || "Untitled Job"}
									</span>
									<Badge className="text-xs" variant="outline">
										{job.status}
									</Badge>
								</div>
								<p className="text-muted-foreground font-mono text-xs">
									#{job.job_number}
								</p>
								{job.financial?.total_amount && (
									<p className="mt-1 text-xs">
										{formatCurrency(job.financial.total_amount)}
									</p>
								)}
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center p-6 py-12 text-center">
						<Briefcase className="text-muted-foreground mb-4 h-12 w-12" />
						<p className="text-muted-foreground text-sm">No jobs found</p>
						<p className="text-muted-foreground text-xs">
							This customer has no jobs yet
						</p>
					</div>
				),
		},
		// Invoices
		{
			id: "invoices",
			title: "Invoices",
			icon: <FileText className="h-4 w-4" />,
			count: invoices.length,
			// Note: Invoice creation typically happens from a job context, not directly
			// For now, we don't show an action button here
			content:
				invoices.length > 0 ? (
					<div className="space-y-2 p-6">
						{invoices.map((invoice) => (
							<div
								className="bg-muted/30 rounded-lg border p-3 text-sm"
								key={invoice.id}
							>
								<div className="mb-1 flex items-start justify-between">
									<span className="font-medium">
										Invoice #{invoice.invoice_number}
									</span>
									<Badge
										className="text-xs"
										variant={
											invoice.status === "paid"
												? "default"
												: invoice.status === "unpaid"
													? "destructive"
													: "outline"
										}
									>
										{invoice.status}
									</Badge>
								</div>
								<p className="font-semibold">
									{formatCurrency(invoice.total_amount || 0)}
								</p>
								<p className="text-muted-foreground text-xs">
									Due: {formatDate(invoice.due_date)}
								</p>
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center p-6 py-12 text-center">
						<FileText className="text-muted-foreground mb-4 h-12 w-12" />
						<p className="text-muted-foreground text-sm">No invoices found</p>
						<p className="text-muted-foreground text-xs">
							This customer has no invoices yet
						</p>
					</div>
				),
		},
		// Appointments
		{
			id: "appointments",
			title: "Appointments",
			icon: <Calendar className="h-4 w-4" />,
			count: appointments.length,
			actions: (
				<Button
					className="h-8 gap-1.5 px-3"
					onClick={onScheduleAppointment || (() => {})}
					size="sm"
					variant="outline"
				>
					<Plus className="mr-2 h-3.5 w-3.5" />
					Schedule
				</Button>
			),
			content:
				appointments.length > 0 ? (
					<div className="space-y-2 p-6">
						{appointments.map((appointment) => {
							const appointmentDate =
								(appointment as { scheduled_start?: string }).scheduled_start ??
								(appointment as { scheduled_for?: string }).scheduled_for ??
								(appointment as { start_time?: string }).start_time ??
								(appointment as { scheduled_at?: string }).scheduled_at ??
								null;

							return (
								<div
									className="bg-muted/30 rounded-lg border p-3 text-sm"
									key={appointment.id}
								>
									<div className="mb-1 flex items-start justify-between">
										<span className="font-medium">
											{appointment.title || "Appointment"}
										</span>
										<Badge className="text-xs" variant="outline">
											{appointment.status}
										</Badge>
									</div>
									<p className="text-muted-foreground text-xs">
										{appointmentDate
											? formatDate(appointmentDate)
											: "Date to be scheduled"}
									</p>
								</div>
							);
						})}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center p-6 py-12 text-center">
						<Calendar className="text-muted-foreground mb-4 h-12 w-12" />
						<p className="text-muted-foreground text-sm">No appointments</p>
						<p className="text-muted-foreground text-xs">
							No scheduled appointments for this customer
						</p>
					</div>
				),
		},
		// Properties
		{
			id: "properties",
			title: "Properties",
			icon: <Home className="h-4 w-4" />,
			count: properties.length,
			// Note: Property linking is managed from the customer detail page
			// In call context, we display existing properties only
			content:
				properties.length > 0 ? (
					<div className="space-y-2 p-6">
						{properties.map((property) => (
							<div
								className="bg-muted/30 rounded-lg border p-3 text-sm"
								key={property.id}
							>
								<div className="mb-1 flex items-start gap-2">
									<MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
									<div className="flex-1">
										<p className="font-medium">{property.name || "Property"}</p>
										<p className="text-muted-foreground text-xs">
											{property.address}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center p-6 py-12 text-center">
						<Home className="text-muted-foreground mb-4 h-12 w-12" />
						<p className="text-muted-foreground text-sm">No properties</p>
						<p className="text-muted-foreground text-xs">
							No properties associated with this customer
						</p>
					</div>
				),
		},
		// Equipment
		{
			id: "equipment",
			title: "Equipment",
			icon: <Wrench className="h-4 w-4" />,
			count: equipment.length,
			// Note: Equipment management is handled from the customer detail page
			// In call context, we display existing equipment only
			content:
				equipment.length > 0 ? (
					<div className="space-y-2 p-6">
						{equipment.map((item) => (
							<div
								className="bg-muted/30 rounded-lg border p-3 text-sm"
								key={item.id}
							>
								<p className="font-medium">{item.name || "Equipment"}</p>
								{item.model && (
									<p className="text-muted-foreground text-xs">
										Model: {item.model}
									</p>
								)}
								{item.serial_number && (
									<p className="text-muted-foreground font-mono text-xs">
										S/N: {item.serial_number}
									</p>
								)}
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center p-6 py-12 text-center">
						<Wrench className="text-muted-foreground mb-4 h-12 w-12" />
						<p className="text-muted-foreground text-sm">No equipment</p>
						<p className="text-muted-foreground text-xs">
							No equipment associated with this customer
						</p>
					</div>
				),
		},
		// Notes
		{
			id: "notes",
			title: "Notes",
			icon: <FileText className="h-4 w-4" />,
			count: customer?.notes ? 1 : 0, // Count is 1 if notes exist (single text field)
			actions: (
				<Button
					className="h-8 gap-1.5 px-3"
					onClick={onAddNote || (() => {})}
					size="sm"
					variant="outline"
				>
					<Plus className="mr-2 h-3.5 w-3.5" />
					Add Note
				</Button>
			),
			content: (
				<div className="space-y-4 p-6">
					{/* Example notes - replace with actual data */}
					{customer?.notes ? (
						<div className="space-y-3">
							{/* Single note example */}
							<div className="bg-muted/30 rounded-lg border p-4">
								<div className="mb-2 flex items-start justify-between">
									<div className="flex-1">
										<p className="text-sm">{customer.notes}</p>
									</div>
								</div>
								<div className="text-muted-foreground flex items-center gap-2 text-xs">
									<User className="h-3 w-3" />
									<span>System</span>
									<span>•</span>
									<span>
										{formatDate(
											customer.created_at || new Date().toISOString(),
										)}
									</span>
								</div>
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<FileText className="text-muted-foreground mb-4 h-12 w-12" />
							<p className="text-muted-foreground text-sm">No notes yet</p>
							<p className="text-muted-foreground text-xs">
								Add notes about this customer
							</p>
							<Button
								className="mt-4"
								onClick={onAddNote || (() => {})}
								size="sm"
								variant="outline"
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Note
							</Button>
						</div>
					)}
				</div>
			),
		},
	];

	return (
		<div className="flex h-full flex-col">
			{/* Sticky Stats Bar - Always visible with Status Indicator */}
			{customer && stats && (
				<CustomerStatsBar
					stats={stats}
					openBalance={openBalance}
					lastVisitDate={lastVisitDate}
					hasOverdueInvoices={hasOverdueInvoices}
					showStatusIndicator={true}
				/>
			)}

			<ScrollArea className="flex-1">
				<div className="flex flex-col gap-4 p-4">
					{/* Customer Alert Banner - Critical info first */}
					{customerData && stats && (
						<CustomerAlertBanner
							customerData={customerData}
							stats={stats}
							onTakePayment={onTakePayment}
						/>
					)}

					{/* Previous Call Summary - Context for this call */}
					<PreviousCallSummary lastCall={previousCall ?? null} />

					{/* Quick Actions Panel */}
					<section className="border-border/60 bg-card overflow-hidden rounded-xl border p-4 shadow-sm">
						<QuickActionsPanel
							onCreateJob={onCreateJob || (() => {})}
							onScheduleAppointment={onScheduleAppointment || (() => {})}
							onSendSMS={onSendSMS || (() => {})}
							onSendEmail={onSendEmail || (() => {})}
							onTakePayment={onTakePayment}
							onAddNote={onAddNote || (() => {})}
							customerEmail={customer?.email}
							customerPhone={customer?.phone}
							hasOutstandingBalance={openBalance > 0}
							outstandingAmount={openBalance}
							layout="grid"
						/>
					</section>

					{/* SMS Quick Replies - Fast SMS during calls */}
					{customer?.phone && (
						<section className="border-border/60 bg-card overflow-hidden rounded-xl border p-4 shadow-sm">
							<SmsQuickRepliesBar
								customerPhone={customer.phone}
								customerFirstName={customer.first_name || undefined}
								customerName={
									customer.first_name && customer.last_name
										? `${customer.first_name} ${customer.last_name}`
										: customer.first_name || undefined
								}
								companyName={customer.company_name || undefined}
								onSendSms={onSendSmsMessage}
								disabled={!onSendSmsMessage}
							/>
						</section>
					)}

					{/* Recent Communications - Call context */}
					{recentCommunications && recentCommunications.length > 0 && (
						<section className="border-border/60 bg-card overflow-hidden rounded-xl border p-4 shadow-sm">
							<RecentCommunications
								communications={recentCommunications}
								customerId={customer?.id}
								maxItems={3}
								showViewAll={true}
							/>
						</section>
					)}

					{/* CSR Reminders - Condensed */}
					{csrReminders.length > 0 && (
						<section className="border-primary/20 bg-primary/5 overflow-hidden rounded-xl border shadow-sm">
							<div className="flex items-start gap-3 p-4">
								<div className="bg-primary/10 rounded-full p-2">
									<Lightbulb className="text-primary h-4 w-4" />
								</div>
								<div className="flex-1 space-y-2">
									<h3 className="text-foreground text-sm font-semibold">
										Call Reminders
									</h3>
									<ul className="text-muted-foreground space-y-1.5 text-xs">
										{csrReminders.map((reminder) => (
											<li className="flex items-start gap-2" key={reminder.id}>
												<span className="text-primary mt-0.5">•</span>
												<span>{reminder.text}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</section>
					)}

					{/* Customer Tags */}
					{customer && (customer.tags?.length > 0 || customer.customer_type) && (
						<section className="border-border/60 bg-card overflow-hidden rounded-xl border p-4 shadow-sm">
							<div className="space-y-2">
								<h4 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
									Customer Tags
								</h4>
								<div className="flex flex-wrap gap-1.5">
									{customer.customer_type && (
										<Badge className="text-xs" variant="secondary">
											{customer.customer_type === "residential"
												? "Residential"
												: customer.customer_type === "commercial"
													? "Commercial"
													: customer.customer_type}
										</Badge>
									)}
									{customer.tags?.map((tag: string) => (
										<Badge className="text-xs" key={tag} variant="secondary">
											{tag}
										</Badge>
									))}
								</div>
							</div>
						</section>
					)}

					{/* Customer Data Sections */}
					<section className="border-border/60 bg-card overflow-hidden rounded-xl border shadow-sm">
						<div className="flex flex-col gap-4 p-0">
							<UnifiedAccordion
								defaultOpenSection={null}
								enableReordering={false}
								sections={sections}
								storageKey="call-window-customer-sidebar"
							/>
						</div>
					</section>
				</div>
			</ScrollArea>
		</div>
	);
}
