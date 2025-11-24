"use client";

/**
 * Comprehensive Appointment Creation Form
 *
 * Industry Best Practices from ServiceTitan & HouseCallPro:
 * - Event/Meeting/Job type selection
 * - Exact time vs time window scheduling (default 2hr windows)
 * - Skills-based technician assignment
 * - File uploads (photos/videos/documents)
 * - Custom tags and special requirements
 * - Priority levels and customer notifications
 * - Smart defaults and auto-population
 */

import { addMinutes, format } from "date-fns";
import {
	AlertCircle,
	Bell,
	Briefcase,
	CalendarClock,
	CalendarIcon,
	Clock,
	FileText,
	Loader2,
	Mail,
	MapPin,
	Phone,
	Tag,
	Upload,
	User,
	Users,
	Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createAppointment } from "@/actions/appointments";
import { CustomerAutocomplete, type CustomerOption } from "@/components/customers/customer-autocomplete";
import { CustomerCreateModal } from "@/components/customers/customer-create-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	StandardFormField,
	StandardFormRow,
} from "@/components/ui/standard-form-field";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface AppointmentCreateFormProps {
	jobId?: string | null;
	customerId?: string | null;
	propertyId?: string | null;
	customers: any[];
	properties: any[];
	jobs: any[];
	teamMembers: any[];
}

type AppointmentTypeOption = "job" | "event" | "meeting";
type TimeMode = "exact" | "window";
type PriorityLevel = "normal" | "high" | "urgent" | "emergency";

export function AppointmentCreateFormV2({
	jobId: initialJobId,
	customerId: initialCustomerId,
	propertyId: initialPropertyId,
	customers,
	properties,
	jobs,
	teamMembers,
}: AppointmentCreateFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Primary appointment type
	const [appointmentType, setAppointmentType] = useState<AppointmentTypeOption>(
		initialJobId ? "job" : "event",
	);

	// Form state
	const [jobId, setJobId] = useState(initialJobId || "");
	const [customerId, setCustomerId] = useState(initialCustomerId || "");
	const [propertyId, setPropertyId] = useState(initialPropertyId || "");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	// Customer creation modal state
	const [isCreateCustomerModalOpen, setIsCreateCustomerModalOpen] = useState(false);

	// Time scheduling
	const [timeMode, setTimeMode] = useState<TimeMode>("window");
	const [date, setDate] = useState<Date>();
	const [startTime, setStartTime] = useState("09:00");
	const [windowDuration, setWindowDuration] = useState("120"); // Default 2 hours
	const [exactDuration, setExactDuration] = useState("60"); // For exact time mode

	// Assignment & Priority
	const [assignedTo, setAssignedTo] = useState<string[]>([]);
	const [priority, setPriority] = useState<PriorityLevel>("normal");
	const [status, setStatus] = useState("scheduled");

	// Service details
	const [category, setCategory] = useState("job_appointment");
	const [serviceType, setServiceType] = useState("service_call");
	const [estimatedHours, setEstimatedHours] = useState("1");
	const [teamSize, setTeamSize] = useState("1");

	// Additional features
	const [specialRequirements, setSpecialRequirements] = useState("");
	const [toolsNeeded, setToolsNeeded] = useState<string[]>([]);
	const [customerNotifications, setCustomerNotifications] = useState(true);
	const [sendReminder, setSendReminder] = useState(true);
	const [tags, setTags] = useState<string[]>([]);
	const [attachments, setAttachments] = useState<File[]>([]);

	// Get linked job with full details
	const linkedJob = jobId ? jobs.find((j) => j.id === jobId) : null;

	// Filter properties by selected customer
	const filteredProperties = customerId
		? properties.filter((p) => p.customer_id === customerId)
		: properties;

	// Calculate end time based on mode
	const calculateEndTime = useMemo(() => {
		if (!date || !startTime) return null;

		const startDateTime = new Date(date);
		const [hours, minutes] = startTime.split(":");
		startDateTime.setHours(parseInt(hours), parseInt(minutes));

		const duration =
			timeMode === "window"
				? parseInt(windowDuration)
				: parseInt(exactDuration);

		return addMinutes(startDateTime, duration);
	}, [date, startTime, timeMode, windowDuration, exactDuration]);

	// Smart technician suggestions based on skills and location
	const suggestedTechnicians = useMemo(() => {
		// TODO: Implement skills-based filtering when we have technician skills data
		// For now, return all team members
		return teamMembers;
	}, [teamMembers, serviceType, propertyId]);

	// Auto-populate from job if jobId is provided
	useEffect(() => {
		if (jobId) {
			const job = jobs.find((j) => j.id === jobId);
			if (job) {
				setTitle(job.title || "Service Appointment");
				setDescription(job.description || "");
				setCustomerId(job.customer_id);
				setPropertyId(job.property_id);
				setAppointmentType("job");
				setCategory("job_appointment");
			}
		}
	}, [jobId, jobs]);

	// Auto-populate property when customer changes
	useEffect(() => {
		if (customerId && filteredProperties.length === 1) {
			setPropertyId(filteredProperties[0].id);
		}
	}, [customerId, filteredProperties]);

	// Smart defaults based on appointment type
	useEffect(() => {
		if (appointmentType === "event") {
			setCategory("event");
			setTimeMode("exact");
		} else if (appointmentType === "meeting") {
			setCategory("meeting");
			setTimeMode("exact");
			setExactDuration("30"); // Meetings default to 30 min
		} else {
			setCategory("job_appointment");
			setTimeMode("window"); // Jobs default to time windows
		}
	}, [appointmentType]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!customerId || !propertyId || !date || !title) {
			toast.error("Please fill in all required fields");
			return;
		}

		setIsSubmitting(true);

		try {
			const startDateTime = new Date(date);
			const [hours, minutes] = startTime.split(":");
			startDateTime.setHours(parseInt(hours), parseInt(minutes));

			const duration =
				timeMode === "window"
					? parseInt(windowDuration)
					: parseInt(exactDuration);
			const endDateTime = addMinutes(startDateTime, duration);

			const formData = new FormData();
			formData.append("title", title);
			formData.append("description", description);
			formData.append("customerId", customerId);
			formData.append("propertyId", propertyId);
			formData.append("scheduledStart", startDateTime.toISOString());
			formData.append("scheduledEnd", endDateTime.toISOString());
			formData.append("category", category);
			formData.append("type", serviceType);
			formData.append("appointmentType", appointmentType);
			formData.append("timeMode", timeMode);
			formData.append("priority", priority);
			formData.append("status", status);

			if (jobId) {
				formData.append("jobId", jobId);
			}

			// Add team assignments
			if (assignedTo.length > 0) {
				formData.append("assignedTo", JSON.stringify(assignedTo));
			}

			// Add additional metadata
			const metadata = {
				estimatedHours,
				teamSize,
				specialRequirements,
				toolsNeeded,
				sendReminder,
				customerNotifications,
				tags,
				timeMode,
				windowDuration: timeMode === "window" ? windowDuration : null,
			};
			formData.append("metadata", JSON.stringify(metadata));

			// TODO: Handle file uploads when backend supports it
			// attachments.forEach((file) => {
			//   formData.append("attachments[]", file);
			// });

			const result = await createAppointment(formData);

			if (result.success && result.data) {
				toast.success("Appointment created successfully");
				if (jobId) {
					router.push(`/dashboard/work/${jobId}`);
				} else {
					router.push("/dashboard/work/appointments");
				}
			} else {
				toast.error(result.error || "Failed to create appointment");
			}
		} catch (error) {
			console.error("Error creating appointment:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-4">
			{/* Appointment Type Selector - Prominent at Top */}
			<Card className="border-2">
				<CardHeader className="pb-4">
					<CardTitle className="text-lg flex items-center gap-2">
						<CalendarClock className="h-5 w-5 text-primary" />
						What type of appointment is this?
					</CardTitle>
					<CardDescription>
						Select the primary purpose of this appointment
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						<button
							type="button"
							onClick={() => setAppointmentType("job")}
							className={`p-4 rounded-lg border-2 text-left transition-all ${
								appointmentType === "job"
									? "border-primary bg-primary/5"
									: "border-border hover:border-primary/50"
							}`}
						>
							<div className="flex items-start gap-3">
								<Briefcase
									className={`h-5 w-5 mt-0.5 ${appointmentType === "job" ? "text-primary" : "text-muted-foreground"}`}
								/>
								<div>
									<p className="font-semibold">Job Appointment</p>
									<p className="text-xs text-muted-foreground mt-1">
										Schedule work for an existing job
									</p>
								</div>
							</div>
						</button>

						<button
							type="button"
							onClick={() => setAppointmentType("meeting")}
							className={`p-4 rounded-lg border-2 text-left transition-all ${
								appointmentType === "meeting"
									? "border-primary bg-primary/5"
									: "border-border hover:border-primary/50"
							}`}
						>
							<div className="flex items-start gap-3">
								<Users
									className={`h-5 w-5 mt-0.5 ${appointmentType === "meeting" ? "text-primary" : "text-muted-foreground"}`}
								/>
								<div>
									<p className="font-semibold">Meeting</p>
									<p className="text-xs text-muted-foreground mt-1">
										Customer consultation or team meeting
									</p>
								</div>
							</div>
						</button>

						<button
							type="button"
							onClick={() => setAppointmentType("event")}
							className={`p-4 rounded-lg border-2 text-left transition-all ${
								appointmentType === "event"
									? "border-primary bg-primary/5"
									: "border-border hover:border-primary/50"
							}`}
						>
							<div className="flex items-start gap-3">
								<CalendarIcon
									className={`h-5 w-5 mt-0.5 ${appointmentType === "event" ? "text-primary" : "text-muted-foreground"}`}
								/>
								<div>
									<p className="font-semibold">Event</p>
									<p className="text-xs text-muted-foreground mt-1">
										Training, demo, or company event
									</p>
								</div>
							</div>
						</button>
					</div>
				</CardContent>
			</Card>

			{/* Job Details Card - Shown when linked to a job */}
			{linkedJob && (
				<Card className="border-primary/50 bg-primary/5">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Briefcase className="h-5 w-5 text-primary" />
								<CardTitle className="text-base">
									Linked to Job #{linkedJob.job_number}
								</CardTitle>
							</div>
							<Badge variant="secondary" className="text-xs">
								{linkedJob.status}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground font-medium">
									Job Title
								</p>
								<p className="text-sm font-semibold">{linkedJob.title}</p>
								{linkedJob.description && (
									<p className="text-xs text-muted-foreground line-clamp-2">
										{linkedJob.description}
									</p>
								)}
							</div>

							{linkedJob.customer && (
								<div className="space-y-1">
									<div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
										<User className="h-3.5 w-3.5" />
										<span>Customer</span>
									</div>
									<p className="text-sm font-semibold">
										{linkedJob.customer.display_name ||
											`${linkedJob.customer.first_name} ${linkedJob.customer.last_name}`}
									</p>
									<div className="space-y-0.5">
										{linkedJob.customer.email && (
											<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
												<Mail className="h-3 w-3" />
												<span className="truncate">
													{linkedJob.customer.email}
												</span>
											</div>
										)}
										{linkedJob.customer.phone && (
											<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
												<Phone className="h-3 w-3" />
												<span>{linkedJob.customer.phone}</span>
											</div>
										)}
									</div>
								</div>
							)}

							{linkedJob.property && (
								<div className="space-y-1">
									<div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
										<MapPin className="h-3.5 w-3.5" />
										<span>Property</span>
									</div>
									<p className="text-sm font-semibold">
										{linkedJob.property.address}
									</p>
									<p className="text-xs text-muted-foreground">
										{linkedJob.property.city}, {linkedJob.property.state}{" "}
										{linkedJob.property.zip_code}
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Basic Information */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-base">Appointment Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<StandardFormField label="Title" htmlFor="title" required>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder={
									appointmentType === "job"
										? "e.g., Annual HVAC Maintenance"
										: appointmentType === "meeting"
											? "e.g., Customer Consultation"
											: "e.g., Team Training Session"
								}
								required
								className="h-9"
							/>
						</StandardFormField>

						{appointmentType === "job" && (
							<StandardFormRow cols={3}>
								<StandardFormField
									label="Service Category"
									htmlFor="category"
									required
								>
									<Select value={category} onValueChange={setCategory}>
										<SelectTrigger id="category" className="h-9">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="job_appointment">
												Job Appointment
											</SelectItem>
											<SelectItem value="estimate_appointment">
												Estimate Appointment
											</SelectItem>
											<SelectItem value="follow_up">Follow-up Visit</SelectItem>
											<SelectItem value="recurring_service">
												Recurring Service
											</SelectItem>
										</SelectContent>
									</Select>
								</StandardFormField>

								<StandardFormField
									label="Service Type"
									htmlFor="serviceType"
									required
								>
									<Select value={serviceType} onValueChange={setServiceType}>
										<SelectTrigger id="serviceType" className="h-9">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="service_call">Service Call</SelectItem>
											<SelectItem value="installation">Installation</SelectItem>
											<SelectItem value="maintenance">Maintenance</SelectItem>
											<SelectItem value="inspection">Inspection</SelectItem>
											<SelectItem value="repair">Repair</SelectItem>
											<SelectItem value="estimate">Estimate</SelectItem>
											<SelectItem value="winterization">
												Winterization
											</SelectItem>
											<SelectItem value="emergency">Emergency</SelectItem>
										</SelectContent>
									</Select>
								</StandardFormField>

								<StandardFormField label="Priority" htmlFor="priority">
									<Select
										value={priority}
										onValueChange={(val) => setPriority(val as PriorityLevel)}
									>
										<SelectTrigger id="priority" className="h-9">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="normal">Normal</SelectItem>
											<SelectItem value="high">High</SelectItem>
											<SelectItem value="urgent">Urgent</SelectItem>
											<SelectItem value="emergency">
												<span className="flex items-center gap-2">
													<AlertCircle className="h-3.5 w-3.5 text-red-500" />
													Emergency
												</span>
											</SelectItem>
										</SelectContent>
									</Select>
								</StandardFormField>
							</StandardFormRow>
						)}

						<StandardFormField label="Description" htmlFor="description">
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Additional details about this appointment..."
								rows={3}
								className="resize-none text-sm"
							/>
						</StandardFormField>
					</CardContent>
				</Card>

				{/* Time Scheduling - Enhanced with Window Support */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-base flex items-center gap-2">
							<Clock className="h-4 w-4" />
							Schedule
						</CardTitle>
						<CardDescription>
							Choose exact time or a time window for better flexibility
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Time Mode Toggle */}
						<div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
							<div className="space-y-0.5">
								<Label className="text-sm font-medium">Scheduling Mode</Label>
								<p className="text-xs text-muted-foreground">
									{timeMode === "exact"
										? "Specific start time (better for meetings)"
										: "Arrival window (better for field service)"}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<span
									className={`text-xs ${timeMode === "exact" ? "font-medium" : "text-muted-foreground"}`}
								>
									Exact Time
								</span>
								<Switch
									checked={timeMode === "window"}
									onCheckedChange={(checked) =>
										setTimeMode(checked ? "window" : "exact")
									}
								/>
								<span
									className={`text-xs ${timeMode === "window" ? "font-medium" : "text-muted-foreground"}`}
								>
									Time Window
								</span>
							</div>
						</div>

						<StandardFormRow cols={timeMode === "window" ? 3 : 3}>
							<StandardFormField label="Date" htmlFor="date" required>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className="w-full justify-start text-left font-normal h-9 text-sm"
										>
											<CalendarIcon className="mr-2 h-3.5 w-3.5" />
											{date ? format(date, "PPP") : "Pick a date"}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={date}
											onSelect={setDate}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</StandardFormField>

							<StandardFormField
								label={timeMode === "window" ? "Window Start" : "Start Time"}
								htmlFor="start-time"
								required
							>
								<Input
									id="start-time"
									type="time"
									value={startTime}
									onChange={(e) => setStartTime(e.target.value)}
									required
									className="h-9"
								/>
							</StandardFormField>

							<StandardFormField
								label={
									timeMode === "window"
										? "Window Duration"
										: "Duration (minutes)"
								}
								htmlFor="duration"
								required
							>
								{timeMode === "window" ? (
									<Select
										value={windowDuration}
										onValueChange={setWindowDuration}
									>
										<SelectTrigger id="duration" className="h-9">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="15">15 minutes</SelectItem>
											<SelectItem value="30">30 minutes</SelectItem>
											<SelectItem value="60">1 hour</SelectItem>
											<SelectItem value="120">2 hours (recommended)</SelectItem>
											<SelectItem value="240">4 hours</SelectItem>
											<SelectItem value="480">8 hours (all day)</SelectItem>
										</SelectContent>
									</Select>
								) : (
									<Input
										id="duration"
										type="number"
										value={exactDuration}
										onChange={(e) => setExactDuration(e.target.value)}
										min="15"
										step="15"
										required
										className="h-9"
									/>
								)}
							</StandardFormField>
						</StandardFormRow>

						{/* Time Window Visual Display */}
						{calculateEndTime && (
							<div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
								<div className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-2">
										<Clock className="h-4 w-4 text-primary" />
										<span className="font-medium">
											{timeMode === "window"
												? "Arrival Window:"
												: "Scheduled Time:"}
										</span>
									</div>
									<div className="font-semibold">
										{format(
											new Date(
												date!.setHours(
													parseInt(startTime.split(":")[0]),
													parseInt(startTime.split(":")[1]),
												),
											),
											"h:mm a",
										)}
										{" - "}
										{format(calculateEndTime, "h:mm a")}
										{timeMode === "window" && (
											<span className="text-xs text-muted-foreground ml-2">
												(
												{windowDuration === "120"
													? "2 hr"
													: windowDuration === "60"
														? "1 hr"
														: windowDuration === "240"
															? "4 hr"
															: windowDuration === "480"
																? "8 hr"
																: `${windowDuration} min`}{" "}
												window)
											</span>
										)}
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Customer & Location */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-base">Customer & Location</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<StandardFormRow cols={2}>
							<div>
								<CustomerAutocomplete
									value={customerId}
									onChange={(newCustomerId) => setCustomerId(newCustomerId || "")}
									placeholder="Search for customer..."
									label="Customer"
									disabled={!!linkedJob}
									showRecent={true}
									showCreateNew={true}
									onCreateNew={() => setIsCreateCustomerModalOpen(true)}
									error={!customerId && !!linkedJob}
								/>
							</div>

							<StandardFormField label="Property" htmlFor="property" required>
								<Select
									value={propertyId}
									onValueChange={setPropertyId}
									disabled={!customerId || !!linkedJob}
									required
								>
									<SelectTrigger id="property" className="h-9">
										<SelectValue placeholder="Select property" />
									</SelectTrigger>
									<SelectContent>
										{filteredProperties.map((property) => (
											<SelectItem key={property.id} value={property.id}>
												{property.address}, {property.city}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</StandardFormField>
						</StandardFormRow>
					</CardContent>
				</Card>

				{/* Team Assignment - Enhanced with Multi-select */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-base flex items-center gap-2">
							<Users className="h-4 w-4" />
							Team Assignment
						</CardTitle>
						<CardDescription>
							{appointmentType === "job"
								? "Assign technicians based on skills and location"
								: "Select team members for this appointment"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<StandardFormRow cols={appointmentType === "job" ? 3 : 2}>
							<StandardFormField
								label={appointmentType === "job" ? "Technician" : "Team Member"}
								htmlFor="assignedTo"
							>
								<Select
									value={assignedTo[0]}
									onValueChange={(value) => setAssignedTo(value ? [value] : [])}
								>
									<SelectTrigger id="assignedTo" className="h-9">
										<SelectValue placeholder="Select team member (optional)" />
									</SelectTrigger>
									<SelectContent>
										{suggestedTechnicians.map((member) => (
											<SelectItem key={member.id} value={member.id}>
												{member.full_name || member.email}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</StandardFormField>

							{appointmentType === "job" && (
								<>
									<StandardFormField
										label="Est. Hours"
										htmlFor="estimatedHours"
									>
										<Input
											id="estimatedHours"
											type="number"
											value={estimatedHours}
											onChange={(e) => setEstimatedHours(e.target.value)}
											min="0.5"
											step="0.5"
											className="h-9"
										/>
									</StandardFormField>

									<StandardFormField label="Team Size" htmlFor="teamSize">
										<Select value={teamSize} onValueChange={setTeamSize}>
											<SelectTrigger id="teamSize" className="h-9">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="1">1 technician</SelectItem>
												<SelectItem value="2">2 technicians</SelectItem>
												<SelectItem value="3">3 technicians</SelectItem>
												<SelectItem value="4">4+ technicians</SelectItem>
											</SelectContent>
										</Select>
									</StandardFormField>
								</>
							)}

							<StandardFormField label="Status" htmlFor="status">
								<Select value={status} onValueChange={setStatus}>
									<SelectTrigger id="status" className="h-9">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="scheduled">Scheduled</SelectItem>
										<SelectItem value="confirmed">Confirmed</SelectItem>
										<SelectItem value="pending">Pending</SelectItem>
									</SelectContent>
								</Select>
							</StandardFormField>
						</StandardFormRow>

						{appointmentType === "job" && (
							<StandardFormField
								label="Special Requirements / Tools Needed"
								htmlFor="specialRequirements"
							>
								<Textarea
									id="specialRequirements"
									value={specialRequirements}
									onChange={(e) => setSpecialRequirements(e.target.value)}
									placeholder="e.g., Ladder truck required, asbestos certification needed, bilingual technician..."
									rows={2}
									className="resize-none text-sm"
								/>
							</StandardFormField>
						)}
					</CardContent>
				</Card>

				{/* Customer Notifications */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-base flex items-center gap-2">
							<Bell className="h-4 w-4" />
							Customer Notifications
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label
									htmlFor="customerNotifications"
									className="text-sm font-medium"
								>
									Send Confirmation
								</Label>
								<p className="text-xs text-muted-foreground">
									Email/SMS confirmation to customer after booking
								</p>
							</div>
							<Switch
								id="customerNotifications"
								checked={customerNotifications}
								onCheckedChange={setCustomerNotifications}
							/>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="sendReminder" className="text-sm font-medium">
									Send Reminder
								</Label>
								<p className="text-xs text-muted-foreground">
									Reminder 24 hours before scheduled time
								</p>
							</div>
							<Switch
								id="sendReminder"
								checked={sendReminder}
								onCheckedChange={setSendReminder}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Actions */}
				<div className="flex items-center justify-between gap-2 pt-2">
					<Button
						type="button"
						variant="ghost"
						onClick={() => router.back()}
						disabled={isSubmitting}
						size="sm"
					>
						Cancel
					</Button>
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="text-xs">
							{appointmentType === "job"
								? "Job Appointment"
								: appointmentType === "meeting"
									? "Meeting"
									: "Event"}
						</Badge>
						<Button type="submit" disabled={isSubmitting} size="default">
							{isSubmitting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{isSubmitting ? "Creating..." : "Create Appointment"}
						</Button>
					</div>
				</div>
			</form>

			{/* Customer Creation Modal */}
			<CustomerCreateModal
				open={isCreateCustomerModalOpen}
				onOpenChange={setIsCreateCustomerModalOpen}
				onCustomerCreated={(customer: CustomerOption) => {
					// Set the newly created customer as selected
					setCustomerId(customer.id);
					// Close the modal
					setIsCreateCustomerModalOpen(false);
					// Show success message
					toast.success("Customer created successfully");
				}}
			/>
		</div>
	);
}
