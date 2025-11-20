/**
 * Appointment Page Content
 *
 * Comprehensive appointment details with collapsible sections
 * Matches job and customer detail page patterns
 *
 * Sections:
 * - Appointment Info (date/time, duration, status, type)
 * - Customer Details (linked customer information)
 * - Property Location (service address with map)
 * - Job Details (linked job information)
 * - Team Assignments (assigned technicians)
 * - Travel & Route (travel time, directions, traffic)
 * - Checklist & Tasks (appointment checklist items)
 * - Notes (appointment-specific notes)
 * - Activity Log (appointment history)
 */

"use client";

import {
	Calendar,
	Clock,
	Mail,
	MapPin,
	Phone,
	Save,
	User,
	Users,
	Wrench,
	X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DetailPageContentLayout } from "@/components/layout/detail-page-content-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	StandardFormField,
	StandardFormRow,
} from "@/components/ui/standard-form-field";
import {
	UnifiedAccordionContent,
	type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";

export type AppointmentData = {
	appointment: any;
	customer?: any;
	property?: any;
	job?: any;
	teamAssignments?: any[];
	tasks?: any[];
	notes?: any[];
	activities?: any[];
};

export type AppointmentPageContentProps = {
	entityData: AppointmentData;
	metrics: any;
};

export function AppointmentPageContent({
	entityData,
}: AppointmentPageContentProps) {
	const [hasChanges, setHasChanges] = useState(false);
	const [isSaving, _setIsSaving] = useState(false);

	const {
		appointment,
		customer,
		property,
		job,
		teamAssignments = [],
		notes = [],
		activities = [],
	} = entityData;

	const appointmentStart = new Date(appointment.start_time);
	const appointmentEnd = new Date(appointment.end_time);
	const durationMinutes = Math.max(
		0,
		Math.floor(
			(appointmentEnd.getTime() - appointmentStart.getTime()) / (1000 * 60),
		),
	);

	const statusBadgeVariant =
		appointment.status === "confirmed"
			? "default"
			: appointment.status === "completed"
				? "secondary"
				: "outline";

	const headerBadges = [
		<Badge key="id" variant="outline">
			APT-{appointment.id.slice(0, 8).toUpperCase()}
		</Badge>,
		<Badge key="status" variant={statusBadgeVariant}>
			{appointment.status}
		</Badge>,
		appointment.appointment_type ? (
			<Badge key="type" variant="outline">
				{appointment.appointment_type}
			</Badge>
		) : null,
	].filter(Boolean);

	const customHeader = (
		<div className="px-2 sm:px-0">
			<div className="bg-muted/50 rounded-md shadow-sm">
				<div className="flex flex-col gap-4 p-4 sm:p-6">
					<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
						<div className="flex flex-col gap-4">
							<div className="flex flex-wrap items-center gap-2">
								{headerBadges}
							</div>
							<div className="flex flex-col gap-2">
								<h1 className="text-2xl font-semibold sm:text-3xl">
									{appointmentStart.toLocaleDateString("en-US", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</h1>
								<p className="text-muted-foreground text-sm sm:text-base">
									{appointmentStart.toLocaleTimeString("en-US", {
										hour: "numeric",
										minute: "2-digit",
									})}{" "}
									-{" "}
									{appointmentEnd.toLocaleTimeString("en-US", {
										hour: "numeric",
										minute: "2-digit",
									})}
								</p>
							</div>
						</div>

						{hasChanges && (
							<div className="flex flex-wrap gap-2">
								<Button
									onClick={() => setHasChanges(false)}
									size="sm"
									variant="ghost"
								>
									<X className="mr-2 size-4" />
									Cancel
								</Button>
								<Button disabled={isSaving} onClick={() => {}} size="sm">
									<Save className="mr-2 size-4" />
									{isSaving ? "Saving..." : "Save Changes"}
								</Button>
							</div>
						)}
					</div>

					{customer && (
						<div className="flex flex-wrap items-center gap-3">
							<Link
								className="border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
								href={`/dashboard/customers/${customer.id}`}
							>
								<User className="size-4" />
								{customer.first_name} {customer.last_name}
							</Link>

							{customer.email && (
								<a
									className="border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
									href={`mailto:${customer.email}`}
								>
									<Mail className="size-4" />
									{customer.email}
								</a>
							)}

							{customer.phone && (
								<a
									className="border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
									href={`tel:${customer.phone}`}
								>
									<Phone className="size-4" />
									{customer.phone}
								</a>
							)}
						</div>
					)}

					<div className="flex flex-wrap items-center gap-3">
						<div className="bg-muted inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm">
							<Clock className="text-muted-foreground size-4" />
							<span className="font-medium">{durationMinutes} minutes</span>
						</div>

						{teamAssignments.length > 0 && (
							<div className="bg-muted inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm">
								<Users className="text-muted-foreground size-4" />
								<span className="font-medium">
									{teamAssignments.length} team member
									{teamAssignments.length === 1 ? "" : "s"}
								</span>
							</div>
						)}

						{job && (
							<Link
								className="bg-muted hover:bg-muted/80 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-colors"
								href={`/dashboard/work/${job.id}`}
							>
								<Wrench className="text-muted-foreground size-4" />
								<span className="font-medium">Job #{job.job_number}</span>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);

	const customSections = useMemo<UnifiedAccordionSection[]>(() => {
		const sections: UnifiedAccordionSection[] = [
			{
				id: "appointment-info",
				title: "Appointment Information",
				icon: <Calendar className="size-4" />,
				defaultOpen: true,
				content: (
					<UnifiedAccordionContent>
						<StandardFormRow cols={2}>
							<StandardFormField label="Start Time" htmlFor="appt-start-time">
								<Input
									id="appt-start-time"
									readOnly
									type="datetime-local"
									value={new Date(appointment.start_time)
										.toISOString()
										.slice(0, 16)}
								/>
							</StandardFormField>
							<StandardFormField label="End Time" htmlFor="appt-end-time">
								<Input
									id="appt-end-time"
									readOnly
									type="datetime-local"
									value={new Date(appointment.end_time)
										.toISOString()
										.slice(0, 16)}
								/>
							</StandardFormField>
							<StandardFormField label="Status" htmlFor="appt-status">
								<Select value={appointment.status}>
									<SelectTrigger id="appt-status">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="scheduled">Scheduled</SelectItem>
										<SelectItem value="confirmed">Confirmed</SelectItem>
										<SelectItem value="in_progress">In Progress</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
										<SelectItem value="cancelled">Cancelled</SelectItem>
									</SelectContent>
								</Select>
							</StandardFormField>
							<StandardFormField label="Type" htmlFor="appt-type">
								<Input
									id="appt-type"
									readOnly
									value={appointment.appointment_type || "Service"}
								/>
							</StandardFormField>
						</StandardFormRow>
					</UnifiedAccordionContent>
				),
			},
		];

		if (customer) {
			sections.push({
				id: "customer-details",
				title: "Customer Details",
				icon: <User className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
							<div className="grid flex-1 gap-4 md:grid-cols-2">
								<div>
									<Label>Name</Label>
									<p className="text-sm">
										{customer.first_name} {customer.last_name}
									</p>
								</div>
								<div>
									<Label>Email</Label>
									<p className="text-sm">{customer.email || "N/A"}</p>
								</div>
								<div>
									<Label>Phone</Label>
									<p className="text-sm">{customer.phone || "N/A"}</p>
								</div>
								<div>
									<Label>Company</Label>
									<p className="text-sm">{customer.company_name || "N/A"}</p>
								</div>
							</div>
							<Button asChild size="sm" variant="ghost">
								<Link href={`/dashboard/customers/${customer.id}`}>
									View Full Profile
								</Link>
							</Button>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		if (property) {
			sections.push({
				id: "property-location",
				title: "Property Location",
				icon: <MapPin className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-4">
							<div>
								<Label>Service Address</Label>
								<p className="text-sm">
									{property.address}
									{property.address2 && `, ${property.address2}`}
								</p>
								<p className="text-muted-foreground text-sm">
									{property.city}, {property.state} {property.zip_code}
								</p>
							</div>
							<Button asChild size="sm" variant="outline">
								<a
									href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
										`${property.address}, ${property.city}, ${property.state}`,
									)}`}
									rel="noopener noreferrer"
									target="_blank"
								>
									<MapPin className="mr-2 size-4" />
									Open in Google Maps
								</a>
							</Button>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		sections.push({
			id: "team-assignments",
			title: "Team Assignments",
			icon: <Users className="size-4" />,
			count: teamAssignments.length,
			content: (
				<UnifiedAccordionContent>
					<div className="space-y-3">
						{teamAssignments.length > 0 ? (
							teamAssignments.map((assignment: any) => (
								<div
									className="flex items-center gap-4 rounded-lg border p-4"
									key={assignment.id}
								>
									<Avatar>
										<AvatarImage src={assignment.user?.avatar} />
										<AvatarFallback>
											{assignment.user?.name
												?.split(" ")
												.map((n: string) => n[0])
												.join("")
												.toUpperCase() || "TM"}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<p className="font-medium">
											{assignment.user?.name || "Unknown"}
										</p>
										<p className="text-muted-foreground text-sm">
											{assignment.role || "Technician"}
										</p>
									</div>
									<Badge variant="outline">
										{assignment.status || "assigned"}
									</Badge>
								</div>
							))
						) : (
							<p className="text-muted-foreground text-center text-sm">
								No team members assigned
							</p>
						)}
					</div>
				</UnifiedAccordionContent>
			),
		});

		if (job) {
			sections.push({
				id: "job-details",
				title: "Job Details",
				icon: <Wrench className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
							<div className="grid flex-1 gap-4 md:grid-cols-2">
								<div>
									<Label>Job Number</Label>
									<p className="text-sm">#{job.job_number}</p>
								</div>
								<div>
									<Label>Title</Label>
									<p className="text-sm">{job.title}</p>
								</div>
								<div>
									<Label>Status</Label>
									<Badge variant="outline">{job.status}</Badge>
								</div>
								<div>
									<Label>Priority</Label>
									<Badge variant="outline">{job.priority}</Badge>
								</div>
							</div>
							<Button asChild size="sm" variant="ghost">
								<Link href={`/dashboard/work/${job.id}`}>View Full Job</Link>
							</Button>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		return sections;
	}, [appointment, customer, job, property, teamAssignments]);

	const relatedItems = useMemo(() => {
		const items: any[] = [];

		if (customer) {
			items.push({
				id: `customer-${customer.id}`,
				type: "customer",
				title: `${customer.first_name} ${customer.last_name}`,
				subtitle: customer.email || customer.phone || undefined,
				href: `/dashboard/customers/${customer.id}`,
			});
		}

		if (property) {
			items.push({
				id: `property-${property.id}`,
				type: "property",
				title: property.address,
				subtitle: `${property.city}, ${property.state}`,
				href: `/dashboard/work/properties/${property.id}`,
			});
		}

		if (job) {
			items.push({
				id: `job-${job.id}`,
				type: "job",
				title: job.title || `Job #${job.job_number}`,
				subtitle: job.status,
				href: `/dashboard/work/${job.id}`,
				badge: job.status
					? { label: job.status, variant: "outline" as const }
					: undefined,
			});
		}

		return items;
	}, [customer, property, job]);

	return (
		<DetailPageContentLayout
			activities={activities}
			customHeader={customHeader}
			customSections={customSections}
			defaultOpenSection="appointment-info"
			notes={notes}
			relatedItems={relatedItems}
			showStandardSections={{
				attachments: false,
			}}
		/>
	);
}
