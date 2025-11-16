"use client";

import { Calendar, ChevronRight, Clock, Mail, MapPin, Navigation, Pencil, Phone } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Job, Property } from "@/lib/db/schema";
import { JobEnrichmentInline } from "./job-enrichment-inline";
import { TravelTime } from "./travel-time";

/**
 * Permanent Job Header - Client Component
 *
 * Inspired by ServiceTitan and Housecall Pro
 * Displays all critical job information at top of page:
 * - Job identification (number, title, type)
 * - Customer contact (name, phone, email)
 * - Service location with map integration
 * - Appointment details with assigned technician
 * - Status, priority, and quick actions
 *
 * Performance:
 * - Client component for interactive quick actions
 * - Minimal bundle impact
 * - Optimized for CSR/dispatcher workflow
 */

type Customer = {
	id: string;
	first_name: string;
	last_name: string;
	email?: string;
	phone?: string;
	company_name?: string;
};

type AssignedUser = {
	id: string;
	name?: string;
	email?: string;
	avatar?: string;
};

type JobHeaderPermanentProps = {
	job: Job;
	customer?: Customer;
	property?: Property;
	assignedUser?: AssignedUser;
	teamAssignments?: any[];
	allCustomers?: any[]; // All customers from job_customers
	allProperties?: any[]; // All properties from job_properties
	enrichmentData?: any; // Job enrichment data
};

export function JobHeaderPermanent({
	job,
	customer,
	property,
	assignedUser,
	teamAssignments = [],
	allCustomers = [],
	allProperties = [],
	enrichmentData,
}: JobHeaderPermanentProps) {
	// Status configuration
	const statusConfig = {
		quoted: {
			label: "Quoted",
			color: "bg-muted text-foreground dark:bg-foreground dark:text-muted-foreground",
		},
		scheduled: {
			label: "Scheduled",
			color: "bg-accent text-accent-foreground dark:bg-accent dark:text-accent-foreground",
		},
		in_progress: {
			label: "In Progress",
			color: "bg-primary text-primary dark:bg-primary dark:text-primary",
		},
		completed: {
			label: "Completed",
			color: "bg-success text-success dark:bg-success dark:text-success",
		},
		cancelled: {
			label: "Cancelled",
			color: "bg-destructive text-destructive dark:bg-destructive dark:text-destructive",
		},
	};

	const priorityConfig = {
		low: {
			label: "Low",
			color: "bg-muted text-foreground dark:bg-foreground dark:text-muted-foreground",
		},
		medium: {
			label: "Medium",
			color: "bg-warning text-warning dark:bg-warning dark:text-warning",
		},
		high: {
			label: "High",
			color: "bg-warning text-warning dark:bg-warning dark:text-warning",
		},
		urgent: {
			label: "Urgent",
			color: "bg-destructive text-destructive dark:bg-destructive dark:text-destructive",
		},
	};

	// Get full address
	const fullAddress = property
		? `${property.address}${property.address2 ? `, ${property.address2}` : ""}, ${property.city}, ${property.state} ${property.zip_code || property.zipCode || ""}`
		: null;

	// Build Google Maps URL - prefer coordinates if available
	const getDirectionsUrl = () => {
		if (!property) {
			return null;
		}

		if (property.lat && property.lon) {
			return `https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.lon}`;
		}

		if (fullAddress) {
			return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
		}

		return null;
	};

	const directionsUrl = getDirectionsUrl();

	// Get customer display name
	const customerName = customer ? `${customer.first_name} ${customer.last_name}` : "Unknown Customer";

	const customerInitials = customer
		? `${customer.first_name[0] || ""}${customer.last_name[0] || ""}`.toUpperCase()
		: "??";

	// Format next appointment
	const nextAppointment = job.scheduledStart ? new Date(String(job.scheduledStart)) : null;
	const appointmentEnd = job.scheduledEnd ? new Date(String(job.scheduledEnd)) : null;

	const formatDate = (date: Date) =>
		new Intl.DateTimeFormat("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(date);

	const formatTime = (date: Date) =>
		new Intl.DateTimeFormat("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		}).format(date);

	// Get time window from notes if available
	const timeWindow = String(job.notes || "").match(/\[Scheduling\] Customer preferred time window: (\w+)/)?.[1];

	// Calculate duration
	const duration =
		nextAppointment && appointmentEnd
			? Math.round((appointmentEnd.getTime() - nextAppointment.getTime()) / (1000 * 60 * 60))
			: null;

	// Map URL for navigation

	return (
		<div className="space-y-4">
			{/* Main Header Card */}
			<Card>
				<CardContent className="p-6">
					<div className="grid gap-6 md:grid-cols-[1fr,auto,auto]">
						{/* Left Section - Job & Customer Info */}
						<div className="space-y-4">
							{/* Job Number and Title */}
							<div>
								<div className="flex items-center gap-3">
									<h1 className="font-bold text-2xl tracking-tight">{job.jobNumber}</h1>
									<Badge className="text-xs capitalize" variant="outline">
										{job.jobType || "service"}
									</Badge>
								</div>
								<p className="mt-1 text-lg text-muted-foreground">{job.title}</p>
							</div>

							{/* Customer */}
							<div className="flex items-start gap-3">
								<Avatar className="size-10">
									<AvatarFallback className="bg-primary text-primary-foreground">{customerInitials}</AvatarFallback>
								</Avatar>
								<div className="flex-1 space-y-1">
									<div className="flex items-center gap-2">
										<Link className="font-semibold hover:underline" href={`/dashboard/customers/${customer?.id}`}>
											{customerName}
										</Link>
										{customer?.company_name && (
											<span className="text-muted-foreground text-sm">({customer.company_name})</span>
										)}
										{allCustomers.length > 1 && (
											<Badge className="text-xs" variant="secondary">
												+{allCustomers.length - 1} more
											</Badge>
										)}
									</div>
									<div className="flex flex-wrap gap-3 text-sm">
										{customer?.phone && (
											<a
												className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
												href={`tel:${customer.phone}`}
											>
												<Phone className="size-3.5" />
												{customer.phone}
											</a>
										)}
										{customer?.email && (
											<a
												className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
												href={`mailto:${customer.email}`}
											>
												<Mail className="size-3.5" />
												{customer.email}
											</a>
										)}
									</div>
								</div>
							</div>

							{/* Service Address */}
							{property && (
								<div className="space-y-3">
									<div className="flex items-start gap-2">
										<MapPin className="mt-0.5 size-4 text-muted-foreground" />
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<p className="text-sm">
													<Link className="hover:underline" href={`/dashboard/work/properties/${property.id}`}>
														{property.name || property.address}
													</Link>
												</p>
												{allProperties.length > 1 && (
													<Badge className="text-xs" variant="outline">
														+{allProperties.length - 1} location
														{allProperties.length > 2 ? "s" : ""}
													</Badge>
												)}
											</div>
											<p className="text-muted-foreground text-xs">
												{property.address}
												{property.address2 && `, ${property.address2}`}
												<br />
												{property.city}, {property.state} {property.zip_code || property.zipCode}
											</p>
											{directionsUrl && (
												<Button asChild className="mt-2 h-8 gap-1.5 text-xs" size="sm" variant="outline">
													<a href={directionsUrl} rel="noopener noreferrer" target="_blank">
														<Navigation className="size-3.5" />
														Get Directions
													</a>
												</Button>
											)}
										</div>
									</div>

									{/* Travel Time */}
									<TravelTime property={property} />
								</div>
							)}

							{/* Operational Intelligence - Inline */}
							<JobEnrichmentInline
								enrichmentData={enrichmentData}
								jobId={job.id}
								property={
									property
										? {
												address: property.address ?? undefined,
												city: property.city ?? undefined,
												state: property.state ?? undefined,
												zip_code: property.zip_code ?? undefined,
												lat: property.lat ?? undefined,
												lon: property.lon ?? undefined,
											}
										: undefined
								}
							/>
						</div>

						{/* Center Section - Appointment Card */}
						<div className="md:min-w-[300px]">
							{nextAppointment ? (
								<Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-sm">
											<Calendar className="size-4" />
											Next Appointment
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{/* Date & Time */}
										<div>
											<p className="font-semibold">{formatDate(nextAppointment)}</p>
											<div className="mt-1 flex items-center gap-2 text-sm">
												<Clock className="size-3.5 text-muted-foreground" />
												<span>
													{formatTime(nextAppointment)}
													{appointmentEnd && ` - ${formatTime(appointmentEnd)}`}
												</span>
												{duration && (
													<Badge className="text-xs" variant="outline">
														{duration}h
													</Badge>
												)}
											</div>
											{timeWindow && <p className="mt-1 text-muted-foreground text-xs">Window: {timeWindow}</p>}
										</div>

										{/* Assigned Technician */}
										{assignedUser && (
											<div className="flex items-center gap-2">
												<Avatar className="size-6">
													<AvatarImage src={assignedUser.avatar} />
													<AvatarFallback className="bg-primary/20 text-xs">
														{assignedUser.name?.[0]?.toUpperCase() || "?"}
													</AvatarFallback>
												</Avatar>
												<span className="text-sm">{assignedUser.name || assignedUser.email}</span>
											</div>
										)}

										{teamAssignments.length > 1 && (
											<p className="text-muted-foreground text-xs">
												+{teamAssignments.length - 1} more team member
												{teamAssignments.length > 2 ? "s" : ""}
											</p>
										)}
									</CardContent>
								</Card>
							) : (
								<Card className="border-dashed">
									<CardContent className="flex min-h-[140px] items-center justify-center p-6">
										<div className="text-center">
											<Calendar className="mx-auto mb-2 size-8 text-muted-foreground opacity-50" />
											<p className="mb-2 text-muted-foreground text-sm">No appointment scheduled</p>
											<Button size="sm" variant="outline">
												<Calendar className="mr-2 size-4" />
												Schedule Now
											</Button>
										</div>
									</CardContent>
								</Card>
							)}
						</div>

						{/* Right Section - Status & Badges */}
						<div className="flex flex-col gap-2 md:items-end">
							{/* Status Badge */}
							<Badge
								className={`px-3 py-1.5 font-semibold text-sm ${
									statusConfig[job.status as keyof typeof statusConfig]?.color || statusConfig.quoted.color
								}`}
							>
								{statusConfig[job.status as keyof typeof statusConfig]?.label || job.status}
							</Badge>

							{/* Priority Badge */}
							<Badge
								className={`px-2 py-1 text-xs ${
									priorityConfig[job.priority as keyof typeof priorityConfig]?.color || priorityConfig.medium.color
								}`}
								variant="outline"
							>
								{priorityConfig[job.priority as keyof typeof priorityConfig]?.label || job.priority} Priority
							</Badge>

							{/* Financial Summary */}
							{job.totalAmount && job.totalAmount > 0 && (
								<div className="mt-2 rounded-lg border bg-muted/50 p-2 text-right">
									<p className="text-muted-foreground text-xs">Total</p>
									<p className="font-bold">${((job.totalAmount || 0) / 100).toLocaleString()}</p>
									{job.paidAmount && job.paidAmount > 0 && (
										<p className="text-xs">
											<span className="text-success">${((job.paidAmount || 0) / 100).toLocaleString()} paid</span>
										</p>
									)}
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Quick Actions Bar */}
			<div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3">
				<Button asChild size="sm" variant="outline">
					<Link href={`/dashboard/work/${job.id}/edit`}>
						<Pencil className="mr-2 size-4" />
						Edit Job
					</Link>
				</Button>

				{customer?.phone && (
					<Button asChild size="sm" variant="outline">
						<a href={`tel:${customer.phone}`}>
							<Phone className="mr-2 size-4" />
							Call Customer
						</a>
					</Button>
				)}

				{customer?.email && (
					<Button asChild size="sm" variant="outline">
						<a href={`mailto:${customer.email}`}>
							<Mail className="mr-2 size-4" />
							Email Customer
						</a>
					</Button>
				)}

				{directionsUrl && (
					<Button asChild size="sm" variant="outline">
						<a href={directionsUrl} rel="noopener noreferrer" target="_blank">
							<Navigation className="mr-2 size-4" />
							Get Directions
						</a>
					</Button>
				)}

				{!nextAppointment && (
					<Button size="sm" variant="outline">
						<Calendar className="mr-2 size-4" />
						Schedule Appointment
					</Button>
				)}

				{job.status === "scheduled" && (
					<Button size="sm" variant="default">
						<Clock className="mr-2 size-4" />
						Start Job
					</Button>
				)}

				{job.status === "in_progress" && (
					<Button size="sm" variant="default">
						<ChevronRight className="mr-2 size-4" />
						Complete Job
					</Button>
				)}
			</div>
		</div>
	);
}
