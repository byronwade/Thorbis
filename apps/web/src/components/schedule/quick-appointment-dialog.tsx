"use client";

/**
 * QuickAppointmentDialog Component
 *
 * A streamlined dialog for quickly creating appointments from the dispatch map.
 * Triggered by clicking on the map canvas.
 *
 * Features:
 * - Pre-fills location from map click coordinates
 * - Customer autocomplete with nearby customer suggestions
 * - Technician assignment
 * - Date/time picker with smart defaults
 * - Job type/priority selection
 */

import { format } from "date-fns";
import {
	AlertTriangle,
	Calendar,
	Clock,
	Loader2,
	MapPin,
	User,
	Wrench,
} from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { createAppointment } from "@/actions/appointments";
import {
	CustomerAutocomplete,
	type CustomerOption,
} from "@/components/customers/customer-autocomplete";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Job types matching the backend schema
// Valid types: service_call, installation, maintenance, inspection, repair, estimate, follow_up, winterization, emergency
const JOB_TYPES = [
	{ value: "emergency", label: "Emergency / Urgent", color: "text-red-500" },
	{
		value: "follow_up",
		label: "Callback / Follow Up",
		color: "text-orange-500",
	},
	{
		value: "maintenance",
		label: "Maintenance / Recurring",
		color: "text-purple-500",
	},
	{
		value: "installation",
		label: "Install / New Work",
		color: "text-green-500",
	},
	{ value: "service_call", label: "Service Call", color: "text-blue-500" },
	{ value: "inspection", label: "Inspection", color: "text-slate-500" },
	{ value: "estimate", label: "Estimate", color: "text-amber-500" },
	{ value: "repair", label: "Repair", color: "text-cyan-500" },
	{ value: "winterization", label: "Winterization", color: "text-indigo-500" },
] as const;

const PRIORITIES = [
	{ value: "low", label: "Low", color: "text-slate-500" },
	{ value: "normal", label: "Normal", color: "text-blue-500" },
	{ value: "high", label: "High", color: "text-orange-500" },
	{ value: "urgent", label: "Urgent", color: "text-red-500" },
] as const;

const DURATIONS = [
	{ value: 30, label: "30 min" },
	{ value: 60, label: "1 hour" },
	{ value: 90, label: "1.5 hours" },
	{ value: 120, label: "2 hours" },
	{ value: 180, label: "3 hours" },
	{ value: 240, label: "4 hours" },
	{ value: 480, label: "Full day" },
] as const;

export type MapClickLocation = {
	lat: number;
	lng: number;
	address?: string;
};

export type TechnicianOption = {
	id: string;
	name: string;
	avatar?: string;
};

interface QuickAppointmentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	location?: MapClickLocation | null;
	technicians?: TechnicianOption[];
	nearbyCustomers?: CustomerOption[];
	onSuccess?: (appointmentId: string) => void;
	onCreateCustomer?: () => void;
	/** Pre-select a technician (e.g., from timeline double-click) */
	defaultTechnicianId?: string;
	/** Pre-fill date/time (e.g., from timeline double-click) */
	defaultDateTime?: Date;
	/** Pre-fill duration in minutes (e.g., from timeline drag-to-create) */
	defaultDuration?: number;
}

export function QuickAppointmentDialog({
	open,
	onOpenChange,
	location,
	technicians = [],
	nearbyCustomers = [],
	onSuccess,
	onCreateCustomer,
	defaultTechnicianId,
	defaultDateTime,
	defaultDuration,
}: QuickAppointmentDialogProps) {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	// Form state
	const [selectedCustomer, setSelectedCustomer] =
		useState<CustomerOption | null>(null);
	const [customerId, setCustomerId] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [jobType, setJobType] = useState<string>("service_call");
	const [priority, setPriority] = useState<string>("normal");
	const [technicianId, setTechnicianId] = useState<string>("");
	const [duration, setDuration] = useState<number>(60);
	const [notes, setNotes] = useState("");

	// Apply defaults when dialog opens
	useEffect(() => {
		if (open) {
			if (defaultTechnicianId) {
				setTechnicianId(defaultTechnicianId);
			}
			if (defaultDateTime) {
				// Ensure the time is not in the past (server rejects past appointments)
				const now = new Date();
				let adjustedTime = defaultDateTime;
				if (defaultDateTime < now) {
					// Move to the same time slot tomorrow, or next available hour if today
					adjustedTime = new Date();
					adjustedTime.setMinutes(0, 0, 0);
					adjustedTime.setHours(adjustedTime.getHours() + 1);
				}
				setScheduledStart(format(adjustedTime, "yyyy-MM-dd'T'HH:mm"));
			}
			if (defaultDuration) {
				// Snap to nearest valid duration option
				const validDurations = [30, 60, 90, 120, 180, 240, 480];
				const closest = validDurations.reduce((prev, curr) =>
					Math.abs(curr - defaultDuration) < Math.abs(prev - defaultDuration)
						? curr
						: prev,
				);
				setDuration(closest);
			}
		}
	}, [open, defaultTechnicianId, defaultDateTime, defaultDuration]);

	// Date/time - default to next available slot (next hour)
	const getDefaultDateTime = () => {
		const now = new Date();
		now.setMinutes(0, 0, 0);
		now.setHours(now.getHours() + 1);
		return now.toISOString().slice(0, 16);
	};
	const [scheduledStart, setScheduledStart] = useState(getDefaultDateTime());

	// Calculate end time based on duration
	const getScheduledEnd = useCallback(() => {
		const start = new Date(scheduledStart);
		start.setMinutes(start.getMinutes() + duration);
		return start.toISOString();
	}, [scheduledStart, duration]);

	// Handle customer selection
	const handleCustomerChange = (
		id: string | null,
		customer: CustomerOption | null,
	) => {
		setCustomerId(id);
		setSelectedCustomer(customer);
		// Auto-fill title if empty
		if (customer && !title) {
			const customerName =
				customer.display_name ||
				`${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
				customer.company_name ||
				"Customer";
			setTitle(`Service call - ${customerName}`);
		}
	};

	// Reset form
	const resetForm = useCallback(() => {
		setSelectedCustomer(null);
		setCustomerId(null);
		setTitle("");
		setJobType("service_call");
		setPriority("normal");
		setTechnicianId("");
		setDuration(60);
		setNotes("");
		setScheduledStart(getDefaultDateTime());
		setError(null);
	}, []);

	// Handle close
	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			resetForm();
		}
		onOpenChange(newOpen);
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!customerId) {
			setError("Please select a customer");
			return;
		}

		if (!title.trim()) {
			setError("Please enter a title");
			return;
		}

		startTransition(async () => {
			try {
				const formData = new FormData();
				formData.set("customerId", customerId);
				formData.set("title", title.trim());
				formData.set("scheduledStart", new Date(scheduledStart).toISOString());
				formData.set("scheduledEnd", getScheduledEnd());
				formData.set("type", jobType);
				formData.set("priority", priority);
				formData.set("category", "job_appointment");

				if (technicianId && technicianId !== "unassigned") {
					formData.set("assignedTo", technicianId);
				}

				if (notes.trim()) {
					formData.set("notes", notes.trim());
				}

				// Add location info to notes if available
				if (location?.address) {
					const existingNotes = notes.trim();
					const locationNote = `Location: ${location.address}`;
					formData.set(
						"notes",
						existingNotes
							? `${existingNotes}\n\n${locationNote}`
							: locationNote,
					);
				}

				const result = await createAppointment(formData);

				if (result.success && result.data) {
					onSuccess?.(result.data);
					handleOpenChange(false);
				} else {
					setError(result.error || "Failed to create appointment");
				}
			} catch (err) {
				console.error("Failed to create appointment:", err);
				setError("An unexpected error occurred");
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5 text-primary" />
						Quick Appointment
					</DialogTitle>
					<DialogDescription>
						{location?.address ? (
							<span className="flex items-center gap-1 text-sm">
								<MapPin className="h-3.5 w-3.5" />
								{location.address}
							</span>
						) : (
							"Create a new appointment from the dispatch map"
						)}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Customer Selection */}
					<div className="space-y-2">
						<Label htmlFor="customer">Customer *</Label>
						<CustomerAutocomplete
							value={customerId}
							onChange={handleCustomerChange}
							placeholder="Search or select customer..."
							showCreateNew
							onCreateNew={onCreateCustomer}
							showRecent
							recentCustomers={nearbyCustomers}
							error={error?.includes("customer")}
						/>
					</div>

					{/* Title */}
					<div className="space-y-2">
						<Label htmlFor="title">Title *</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g., AC Repair, Plumbing Inspection"
							className={cn(error?.includes("title") && "border-destructive")}
						/>
					</div>

					{/* Job Type & Priority */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="jobType">Job Type</Label>
							<Select value={jobType} onValueChange={setJobType}>
								<SelectTrigger id="jobType">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{JOB_TYPES.map((type) => (
										<SelectItem key={type.value} value={type.value}>
											<span
												className={cn("flex items-center gap-2", type.color)}
											>
												<Wrench className="h-3.5 w-3.5" />
												{type.label}
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="priority">Priority</Label>
							<Select value={priority} onValueChange={setPriority}>
								<SelectTrigger id="priority">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{PRIORITIES.map((p) => (
										<SelectItem key={p.value} value={p.value}>
											<span className={cn("flex items-center gap-2", p.color)}>
												{p.value === "urgent" && (
													<AlertTriangle className="h-3.5 w-3.5" />
												)}
												{p.label}
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Date/Time & Duration */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="scheduledStart">Date & Time</Label>
							<div className="relative">
								<Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="scheduledStart"
									type="datetime-local"
									value={scheduledStart}
									onChange={(e) => setScheduledStart(e.target.value)}
									className="pl-9"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="duration">Duration</Label>
							<Select
								value={duration.toString()}
								onValueChange={(v) => setDuration(Number(v))}
							>
								<SelectTrigger id="duration">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{DURATIONS.map((d) => (
										<SelectItem key={d.value} value={d.value.toString()}>
											{d.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Technician Assignment */}
					{technicians.length > 0 && (
						<div className="space-y-2">
							<Label htmlFor="technician">Assign Technician</Label>
							<Select value={technicianId} onValueChange={setTechnicianId}>
								<SelectTrigger id="technician">
									<SelectValue placeholder="Select technician (optional)" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="unassigned">Unassigned</SelectItem>
									{technicians.map((tech) => (
										<SelectItem key={tech.id} value={tech.id}>
											<span className="flex items-center gap-2">
												<User className="h-3.5 w-3.5" />
												{tech.name}
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					{/* Notes */}
					<div className="space-y-2">
						<Label htmlFor="notes">Notes</Label>
						<Textarea
							id="notes"
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Additional notes or instructions..."
							rows={2}
						/>
					</div>

					{/* Error Display */}
					{error && (
						<div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
							{error}
						</div>
					)}

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending || !customerId}>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								"Create Appointment"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
