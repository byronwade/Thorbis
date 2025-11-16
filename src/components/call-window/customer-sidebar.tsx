"use client";

/**
 * Customer Sidebar Component
 *
 * Left sidebar showing customer data, jobs, invoices, appointments, etc.
 * Uses the same CollapsibleDataSection component as job details pages.
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
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { UnifiedAccordion, type UnifiedAccordionSection } from "@/components/ui/unified-accordion";
import type { CustomerCallData } from "@/types/call-window";
import { DEFAULT_CSR_REMINDERS } from "@/types/csr-reminders";

type CustomerSidebarProps = {
	customerData: CustomerCallData | null;
	isLoading?: boolean;
};

export function CustomerSidebar({ customerData, isLoading }: CustomerSidebarProps) {
	// TODO: Fetch CSR reminders from user settings/company settings
	// For now, use default reminders
	const csrReminders = DEFAULT_CSR_REMINDERS.filter((r) => r.enabled).sort((a, b) => a.order - b.order);

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center p-6">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
					<p className="text-muted-foreground text-sm">Loading customer data...</p>
				</div>
			</div>
		);
	}

	if (!customerData) {
		return (
			<div className="flex h-full items-center justify-center p-6">
				<div className="text-center">
					<AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
					<p className="font-medium text-foreground">No customer data</p>
					<p className="mt-1 text-muted-foreground text-sm">Customer information will appear here</p>
				</div>
			</div>
		);
	}

	const { customer, stats, jobs, invoices, estimates, appointments, properties, equipment } = customerData;

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
	const [phoneNumbers, setPhoneNumbers] = useState<string[]>(customer?.phone ? [customer.phone] : [""]);
	const [emailAddresses, setEmailAddresses] = useState<string[]>(customer?.email ? [customer.email] : [""]);

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

	// Save customer data
	const handleSaveCustomer = async () => {
		// TODO: Implement save logic
	};

	// Build sections array for UnifiedAccordion
	const sections: UnifiedAccordionSection[] = [
		// Customer Overview - Fully Editable
		{
			id: "overview",
			title: "Customer Overview",
			icon: <User className="h-4 w-4" />,
			actions: (
				<Button className="h-8 gap-1.5 px-3" onClick={handleSaveCustomer} size="sm" variant="default">
					<Save className="h-3.5 w-3.5" />
					Save
				</Button>
			),
			content: (
				<div className="space-y-6 p-6">
					{/* Basic Information */}
					<div className="space-y-4">
						<h4 className="font-semibold text-sm">Basic Information</h4>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="firstName">First Name</Label>
								<Input defaultValue={customer?.first_name || ""} id="firstName" placeholder="Enter first name" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last Name</Label>
								<Input defaultValue={customer?.last_name || ""} id="lastName" placeholder="Enter last name" />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="company">Company</Label>
							<div className="relative">
								<Building2 className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
								<Input
									className="pl-9"
									defaultValue={customer?.company_name || ""}
									id="company"
									placeholder="Enter company name"
								/>
							</div>
						</div>
					</div>

					{/* Contact Information */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h4 className="font-semibold text-sm">Contact Information</h4>
						</div>

						{/* Email Addresses */}
						<div className="space-y-2">
							<Label>Email Addresses</Label>
							{emailAddresses.map((email, index) => (
								<div className="flex gap-2" key={index}>
									<div className="relative flex-1">
										<Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
										<Input
											className="pl-9"
											onChange={(e) => updateEmailAddress(index, e.target.value)}
											placeholder="email@example.com"
											type="email"
											value={email}
										/>
									</div>
									{emailAddresses.length > 1 && (
										<Button className="h-9 w-9" onClick={() => removeEmailAddress(index)} size="icon" variant="ghost">
											<X className="h-4 w-4" />
										</Button>
									)}
								</div>
							))}
							<Button className="w-full" onClick={addEmailAddress} size="sm" variant="outline">
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
										<Phone className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
										<Input
											className="pl-9"
											onChange={(e) => updatePhoneNumber(index, e.target.value)}
											placeholder="(555) 123-4567"
											type="tel"
											value={phone}
										/>
									</div>
									{phoneNumbers.length > 1 && (
										<Button className="h-9 w-9" onClick={() => removePhoneNumber(index)} size="icon" variant="ghost">
											<X className="h-4 w-4" />
										</Button>
									)}
								</div>
							))}
							<Button className="w-full" onClick={addPhoneNumber} size="sm" variant="outline">
								<Plus className="mr-2 h-4 w-4" />
								Add Phone
							</Button>
						</div>
					</div>

					{/* Address */}
					<div className="space-y-4">
						<h4 className="font-semibold text-sm">Address</h4>

						<div className="space-y-2">
							<Label htmlFor="address">Street Address</Label>
							<div className="relative">
								<MapPin className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
								<Textarea
									className="min-h-[60px] pl-9"
									defaultValue={customer?.address || ""}
									id="address"
									placeholder="123 Main Street"
								/>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-3">
							<div className="space-y-2">
								<Label htmlFor="city">City</Label>
								<Input defaultValue={customer?.city || ""} id="city" placeholder="City" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="state">State</Label>
								<Input defaultValue={customer?.state || ""} id="state" placeholder="State" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="zipCode">ZIP Code</Label>
								<Input defaultValue={customer?.zip_code || ""} id="zipCode" placeholder="12345" />
							</div>
						</div>
					</div>

					{/* Enrichment Data */}
					{customer && (
						<div className="space-y-4">
							<h4 className="font-semibold text-sm">Enrichment Data</h4>

							<div className="space-y-2">
								<Label htmlFor="website">Website</Label>
								<div className="relative">
									<Globe className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
									<Input className="pl-9" defaultValue="" id="website" placeholder="https://example.com" type="url" />
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-3">
								<div className="space-y-2">
									<Label htmlFor="linkedin">LinkedIn</Label>
									<div className="relative">
										<Linkedin className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
										<Input className="pl-9" defaultValue="" id="linkedin" placeholder="Profile URL" />
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="twitter">Twitter</Label>
									<div className="relative">
										<Twitter className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
										<Input className="pl-9" defaultValue="" id="twitter" placeholder="@username" />
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="facebook">Facebook</Label>
									<div className="relative">
										<Facebook className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
										<Input className="pl-9" defaultValue="" id="facebook" placeholder="Profile URL" />
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			),
		},
		// Jobs
		{
			id: "jobs",
			title: "Jobs",
			icon: <Briefcase className="h-4 w-4" />,
			count: jobs.length,
			actions: (
				<Button className="h-8 gap-1.5 px-3" onClick={() => {}} size="sm" variant="outline">
					<Plus className="mr-2 h-3.5 w-3.5" />
					Link Job
				</Button>
			),
			content:
				jobs.length > 0 ? (
					<div className="space-y-2 p-6">
						{jobs.map((job) => (
							<div className="rounded-lg border bg-muted/30 p-3 text-sm" key={job.id}>
								<div className="mb-1 flex items-start justify-between">
									<span className="font-medium">{job.title || "Untitled Job"}</span>
									<Badge className="text-xs" variant="outline">
										{job.status}
									</Badge>
								</div>
								<p className="font-mono text-muted-foreground text-xs">#{job.job_number}</p>
								{job.total_amount && <p className="mt-1 text-xs">{formatCurrency(job.total_amount)}</p>}
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center p-6 py-12 text-center">
						<Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
						<p className="text-muted-foreground text-sm">No jobs found</p>
						<p className="text-muted-foreground text-xs">This customer has no jobs yet</p>
					</div>
				),
		},
		// Invoices
		{
			id: "invoices",
			title: "Invoices",
			icon: <FileText className="h-4 w-4" />,
			count: invoices.length,
			actions: (
				<Button className="h-8 gap-1.5 px-3" onClick={() => {}} size="sm" variant="outline">
					<Plus className="mr-2 h-3.5 w-3.5" />
					Link Invoice
				</Button>
			),
			content:
				invoices.length > 0 ? (
					<div className="space-y-2 p-6">
						{invoices.map((invoice) => (
							<div className="rounded-lg border bg-muted/30 p-3 text-sm" key={invoice.id}>
								<div className="mb-1 flex items-start justify-between">
									<span className="font-medium">Invoice #{invoice.invoice_number}</span>
									<Badge
										className="text-xs"
										variant={
											invoice.status === "paid" ? "default" : invoice.status === "unpaid" ? "destructive" : "outline"
										}
									>
										{invoice.status}
									</Badge>
								</div>
								<p className="font-semibold">{formatCurrency(invoice.total_amount || 0)}</p>
								<p className="text-muted-foreground text-xs">Due: {formatDate(invoice.due_date)}</p>
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center p-6 py-12 text-center">
						<FileText className="mb-4 h-12 w-12 text-muted-foreground" />
						<p className="text-muted-foreground text-sm">No invoices found</p>
						<p className="text-muted-foreground text-xs">This customer has no invoices yet</p>
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
				<Button className="h-8 gap-1.5 px-3" onClick={() => {}} size="sm" variant="outline">
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
								<div className="rounded-lg border bg-muted/30 p-3 text-sm" key={appointment.id}>
									<div className="mb-1 flex items-start justify-between">
										<span className="font-medium">{appointment.title || "Appointment"}</span>
										<Badge className="text-xs" variant="outline">
											{appointment.status}
										</Badge>
									</div>
									<p className="text-muted-foreground text-xs">
										{appointmentDate ? formatDate(appointmentDate) : "Date to be scheduled"}
									</p>
								</div>
							);
						})}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center p-6 py-12 text-center">
						<Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
						<p className="text-muted-foreground text-sm">No appointments</p>
						<p className="text-muted-foreground text-xs">No scheduled appointments for this customer</p>
					</div>
				),
		},
		// Properties
		{
			id: "properties",
			title: "Properties",
			icon: <Home className="h-4 w-4" />,
			count: properties.length,
			actions: (
				<Button className="h-8 gap-1.5 px-3" onClick={() => {}} size="sm" variant="outline">
					<Plus className="mr-2 h-3.5 w-3.5" />
					Link Property
				</Button>
			),
			content:
				properties.length > 0 ? (
					<div className="space-y-2 p-6">
						{properties.map((property) => (
							<div className="rounded-lg border bg-muted/30 p-3 text-sm" key={property.id}>
								<div className="mb-1 flex items-start gap-2">
									<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
									<div className="flex-1">
										<p className="font-medium">{property.name || "Property"}</p>
										<p className="text-muted-foreground text-xs">{property.address}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center p-6 py-12 text-center">
						<Home className="mb-4 h-12 w-12 text-muted-foreground" />
						<p className="text-muted-foreground text-sm">No properties</p>
						<p className="text-muted-foreground text-xs">No properties associated with this customer</p>
					</div>
				),
		},
		// Equipment
		{
			id: "equipment",
			title: "Equipment",
			icon: <Wrench className="h-4 w-4" />,
			count: equipment.length,
			actions: (
				<Button className="h-8 gap-1.5 px-3" onClick={() => {}} size="sm" variant="outline">
					<Plus className="mr-2 h-3.5 w-3.5" />
					Add Equipment
				</Button>
			),
			content:
				equipment.length > 0 ? (
					<div className="space-y-2 p-6">
						{equipment.map((item) => (
							<div className="rounded-lg border bg-muted/30 p-3 text-sm" key={item.id}>
								<p className="font-medium">{item.name || "Equipment"}</p>
								{item.model && <p className="text-muted-foreground text-xs">Model: {item.model}</p>}
								{item.serial_number && (
									<p className="font-mono text-muted-foreground text-xs">S/N: {item.serial_number}</p>
								)}
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center p-6 py-12 text-center">
						<Wrench className="mb-4 h-12 w-12 text-muted-foreground" />
						<p className="text-muted-foreground text-sm">No equipment</p>
						<p className="text-muted-foreground text-xs">No equipment associated with this customer</p>
					</div>
				),
		},
		// Notes
		{
			id: "notes",
			title: "Notes",
			icon: <FileText className="h-4 w-4" />,
			count: 0, // TODO: Get actual notes count
			actions: (
				<Button className="h-8 gap-1.5 px-3" onClick={() => {}} size="sm" variant="outline">
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
							<div className="rounded-lg border bg-muted/30 p-4">
								<div className="mb-2 flex items-start justify-between">
									<div className="flex-1">
										<p className="text-sm">{customer.notes}</p>
									</div>
								</div>
								<div className="flex items-center gap-2 text-muted-foreground text-xs">
									<User className="h-3 w-3" />
									<span>System</span>
									<span>•</span>
									<span>{formatDate(customer.created_at || new Date().toISOString())}</span>
								</div>
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<FileText className="mb-4 h-12 w-12 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">No notes yet</p>
							<p className="text-muted-foreground text-xs">Add notes about this customer</p>
							<Button className="mt-4" onClick={() => {}} size="sm" variant="outline">
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
		<ScrollArea className="h-full">
			<div className="flex flex-col gap-4 p-4">
				{/* CSR Reminders */}
				{csrReminders.length > 0 && (
					<section className="overflow-hidden rounded-xl border border-primary/20 bg-primary/5 shadow-sm">
						<div className="flex items-start gap-3 p-4">
							<div className="rounded-full bg-primary/10 p-2">
								<Lightbulb className="h-4 w-4 text-primary" />
							</div>
							<div className="flex-1 space-y-2">
								<h3 className="font-semibold text-foreground text-sm">Call Reminders</h3>
								<ul className="space-y-1.5 text-muted-foreground text-xs">
									{csrReminders.map((reminder) => (
										<li className="flex items-start gap-2" key={reminder.id}>
											<span className="mt-0.5 text-primary">•</span>
											<span>{reminder.text}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</section>
				)}

				{/* Customer Stats & Tags */}
				{customer && (
					<section className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
						<div className="space-y-4 p-4">
							{/* Customer Tags */}
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Customer Tags</h4>
									<Button className="h-6 px-2 text-xs" onClick={() => {}} size="sm" variant="ghost">
										<Plus className="mr-1 h-3 w-3" />
										Add
									</Button>
								</div>
								<div className="flex flex-wrap gap-1.5">
									{/* TODO: Fetch real tags from customer data */}
									<Badge className="text-xs" variant="secondary">
										VIP
									</Badge>
									<Badge className="text-xs" variant="secondary">
										Recurring
									</Badge>
									<Badge className="cursor-pointer text-xs hover:bg-muted" variant="outline">
										<Plus className="mr-1 h-3 w-3" />
										Add Tag
									</Badge>
								</div>
							</div>

							{/* Customer Stats */}
							<div className="space-y-2">
								<h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Customer Stats</h4>
								<div className="grid grid-cols-4 gap-2">
									<div className="rounded-lg border bg-muted/20 p-2.5 text-center">
										<p className="text-[10px] text-muted-foreground uppercase tracking-wide">Revenue</p>
										<p className="mt-0.5 font-bold text-foreground text-sm">{formatCurrency(stats.totalRevenue)}</p>
									</div>
									<div className="rounded-lg border bg-muted/20 p-2.5 text-center">
										<p className="text-[10px] text-muted-foreground uppercase tracking-wide">Active</p>
										<p className="mt-0.5 font-bold text-foreground text-sm">{stats.activeJobs}</p>
									</div>
									<div className="rounded-lg border bg-muted/20 p-2.5 text-center">
										<p className="text-[10px] text-muted-foreground uppercase tracking-wide">Invoices</p>
										<p className="mt-0.5 font-bold text-foreground text-sm">{stats.openInvoices}</p>
									</div>
									<div className="rounded-lg border bg-muted/20 p-2.5 text-center">
										<p className="text-[10px] text-muted-foreground uppercase tracking-wide">Since</p>
										<p className="mt-0.5 font-bold text-foreground text-sm">
											{stats.customerSince ? new Date(stats.customerSince).getFullYear() : "N/A"}
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>
				)}

				{/* Customer Data Sections */}
				<section className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
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
	);
}
