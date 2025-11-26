"use client";

/**
 * Uber-Style Dispatch Map View
 *
 * Full-screen map interface for real-time fleet dispatch with:
 * - Technician GPS tracking with animated markers
 * - Job locations with status indicators
 * - Route visualization between stops
 * - Floating collapsible technician sidebar
 * - Bottom drawer for selection details
 * - Real-time updates via Supabase
 */

import type React from "react";
import {
	Component,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

// ============================================================================
// Map Error Boundary - Catches errors without DOM reconciliation issues
// ============================================================================

interface MapErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

class MapErrorBoundary extends Component<
	{ children: React.ReactNode; fallback?: React.ReactNode },
	MapErrorBoundaryState
> {
	constructor(props: {
		children: React.ReactNode;
		fallback?: React.ReactNode;
	}) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): MapErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Map error caught:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div className="flex h-full w-full items-center justify-center bg-muted">
						<div className="text-center max-w-md p-6">
							<div className="mx-auto h-12 w-12 text-amber-500 mb-4">⚠️</div>
							<h3 className="text-lg font-semibold mb-2">Map Error</h3>
							<p className="text-sm text-muted-foreground mb-4">
								{this.state.error?.message ||
									"An error occurred while loading the map."}
							</p>
							<button
								onClick={() => this.setState({ hasError: false, error: null })}
								className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
							>
								Try Again
							</button>
						</div>
					</div>
				)
			);
		}

		return this.props.children;
	}
}

import {
	AlertCircle,
	AlertTriangle,
	Battery,
	BatteryLow,
	BatteryMedium,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Clock,
	CloudRain,
	Locate,
	MapPin,
	Navigation,
	Phone,
	Plus,
	RefreshCw,
	Route,
	Search,
	Signal,
	Sun,
	Thermometer,
	User,
	Users,
	X,
	Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { CustomerOption } from "@/components/customers/customer-autocomplete";
import {
	type MapClickLocation,
	QuickAppointmentDialog,
	type TechnicianOption,
} from "@/components/schedule/quick-appointment-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	type Route as GoogleRoute,
	googleRoutesService,
} from "@/lib/services/google-routes-service";
import { googleWeatherService } from "@/lib/services/google-weather-service";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
	findNearbyEntities,
	reverseGeocode,
} from "@/lib/utils/find-nearby-entities";

// ============================================================================
// Google Maps Script Loader
// ============================================================================

let isMapScriptLoaded = false;
let isMapScriptLoading = false;
const mapLoadCallbacks: (() => void)[] = [];

function loadGoogleMapsScript(apiKey: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (isMapScriptLoaded || window.google?.maps) {
			isMapScriptLoaded = true;
			resolve();
			return;
		}

		if (isMapScriptLoading) {
			mapLoadCallbacks.push(resolve);
			return;
		}

		const existingScript = document.querySelector(
			'script[src*="maps.googleapis.com"]',
		);

		if (existingScript) {
			isMapScriptLoading = true;
			existingScript.addEventListener("load", () => {
				isMapScriptLoaded = true;
				isMapScriptLoading = false;
				resolve();
				mapLoadCallbacks.forEach((cb) => cb());
				mapLoadCallbacks.length = 0;
			});
			return;
		}

		isMapScriptLoading = true;
		const script = document.createElement("script");
		script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`;
		script.async = true;
		script.defer = true;

		script.onload = () => {
			isMapScriptLoaded = true;
			isMapScriptLoading = false;
			resolve();
			mapLoadCallbacks.forEach((cb) => cb());
			mapLoadCallbacks.length = 0;
		};

		script.onerror = () => {
			isMapScriptLoading = false;
			reject(new Error("Failed to load Google Maps"));
		};

		document.head.appendChild(script);
	});
}

// ============================================================================
// Types
// ============================================================================

type Technician = {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	avatar?: string;
	role: string;
	status: string;
};

type GPSLocation = {
	id: string;
	technician_id: string;
	lat: number;
	lng: number;
	accuracy?: number;
	heading?: number;
	speed?: number;
	battery_level?: number;
	status?: string;
	updated_at: string;
	company_id: string;
};

type Customer = {
	id: string;
	display_name: string;
	phone?: string;
	address?: string;
	city?: string;
	state?: string;
	zip_code?: string;
	lat?: number;
	lon?: number;
};

type Property = {
	id: string;
	address?: string;
	city?: string;
	state?: string;
	zip_code?: string;
	lat?: number;
	lon?: number;
};

type Job = {
	id: string;
	title: string;
	job_type?: string;
	priority?: string;
	status: string;
	total_amount?: number;
	customer?: Customer;
	property?: Property;
};

type Appointment = {
	id: string;
	scheduled_start: string;
	scheduled_end?: string;
	status: string;
	assigned_technician_ids?: string[];
	job?: Job;
};

type DispatchMapViewProps = {
	technicians: Technician[];
	gpsLocations: GPSLocation[];
	appointments: Appointment[];
	unassignedJobs: Job[];
	companyId: string;
	defaultCenter?: { address: string };
};

type TechnicianWithLocation = Technician & {
	gpsLocation?: GPSLocation;
	appointments: Appointment[];
	currentJob?: Job;
	nextJob?: Job;
	// Route optimization data
	etaToNextJob?: {
		durationMinutes: number;
		distanceKm: number;
		arrivalTime: string;
	};
	optimizedRoute?: GoogleRoute;
};

type WeatherData = {
	temperature: number;
	condition: string;
	icon: string;
	alerts: Array<{ headline: string; severity: string }>;
};

// ============================================================================
// Status Colors
// ============================================================================

const TECH_STATUS_COLORS: Record<
	string,
	{ bg: string; text: string; border: string }
> = {
	available: {
		bg: "bg-emerald-500",
		text: "text-emerald-500",
		border: "border-emerald-500",
	},
	active: {
		bg: "bg-emerald-500",
		text: "text-emerald-500",
		border: "border-emerald-500",
	},
	"on-job": {
		bg: "bg-blue-500",
		text: "text-blue-500",
		border: "border-blue-500",
	},
	"in-transit": {
		bg: "bg-amber-500",
		text: "text-amber-500",
		border: "border-amber-500",
	},
	"on-break": {
		bg: "bg-orange-500",
		text: "text-orange-500",
		border: "border-orange-500",
	},
	offline: {
		bg: "bg-gray-400",
		text: "text-gray-400",
		border: "border-gray-400",
	},
	inactive: {
		bg: "bg-gray-400",
		text: "text-gray-400",
		border: "border-gray-400",
	},
};

const JOB_STATUS_COLORS: Record<string, string> = {
	pending: "#f59e0b",
	scheduled: "#3b82f6",
	dispatched: "#8b5cf6",
	"in-progress": "#10b981",
	completed: "#6b7280",
	cancelled: "#ef4444",
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
	emergency: { bg: "bg-red-500/20", text: "text-red-500" },
	high: { bg: "bg-orange-500/20", text: "text-orange-500" },
	normal: { bg: "bg-blue-500/20", text: "text-blue-500" },
	low: { bg: "bg-gray-500/20", text: "text-gray-500" },
};

// ============================================================================
// Helper Functions
// ============================================================================

function getInitials(name: string): string {
	if (!name) return "??";
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function formatLocationAge(date: Date | string): string {
	const now = new Date();
	const then = typeof date === "string" ? new Date(date) : date;
	const diffMs = now.getTime() - then.getTime();
	const diffMins = Math.floor(diffMs / 60000);

	if (diffMins < 1) return "Just now";
	if (diffMins === 1) return "1 min ago";
	if (diffMins < 60) return `${diffMins} mins ago`;

	const diffHours = Math.floor(diffMins / 60);
	if (diffHours === 1) return "1 hour ago";
	if (diffHours < 24) return `${diffHours} hours ago`;

	return "Over a day ago";
}

function getJobAddress(job: Job): string {
	const property = job.property;
	const customer = job.customer;

	if (property?.address) {
		return `${property.address}, ${property.city || ""} ${property.state || ""}`.trim();
	}
	if (customer?.address) {
		return `${customer.address}, ${customer.city || ""} ${customer.state || ""}`.trim();
	}
	return "No address";
}

function getJobCoordinates(job: Job): { lat: number; lng: number } | null {
	if (job.property?.lat && job.property?.lon) {
		return { lat: job.property.lat, lng: job.property.lon };
	}
	if (job.customer?.lat && job.customer?.lon) {
		return { lat: job.customer.lat, lng: job.customer.lon };
	}
	return null;
}

// ============================================================================
// Technician Sidebar Item Component
// ============================================================================

function TechnicianListItem({
	tech,
	isSelected,
	onClick,
}: {
	tech: TechnicianWithLocation;
	isSelected: boolean;
	onClick: () => void;
}) {
	const statusColor =
		TECH_STATUS_COLORS[tech.status] || TECH_STATUS_COLORS.offline;
	const hasGps = !!tech.gpsLocation;
	const batteryLevel = tech.gpsLocation?.battery_level;

	return (
		<div
			className={cn(
				"flex items-center gap-3 p-3 cursor-pointer transition-all",
				"hover:bg-accent/50 border-b border-border/50",
				isSelected && "bg-accent",
			)}
			onClick={onClick}
		>
			{/* Avatar with status indicator */}
			<div className="relative">
				<Avatar className="h-10 w-10">
					<AvatarImage src={tech.avatar || undefined} />
					<AvatarFallback className="bg-muted text-sm">
						{getInitials(tech.name)}
					</AvatarFallback>
				</Avatar>
				<div
					className={cn(
						"absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background",
						statusColor.bg,
					)}
				/>
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<span className="font-medium text-sm truncate">{tech.name}</span>
					{hasGps && (
						<Signal className="h-3 w-3 text-emerald-500 flex-shrink-0" />
					)}
				</div>
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					{tech.currentJob ? (
						<span className="truncate">{tech.currentJob.title}</span>
					) : tech.nextJob ? (
						<span className="truncate">Next: {tech.nextJob.title}</span>
					) : (
						<span>No jobs scheduled</span>
					)}
				</div>
				{/* ETA to next job */}
				{tech.etaToNextJob && tech.nextJob && (
					<div className="flex items-center gap-1 text-xs text-blue-500 mt-0.5">
						<Navigation className="h-3 w-3" />
						<span>
							{tech.etaToNextJob.durationMinutes} min (
							{tech.etaToNextJob.distanceKm.toFixed(1)} km)
						</span>
					</div>
				)}
			</div>

			{/* Right side indicators */}
			<div className="flex flex-col items-end gap-1">
				<Badge
					variant="outline"
					className={cn(
						"text-[10px] px-1.5 py-0",
						statusColor.border,
						statusColor.text,
					)}
				>
					{tech.status === "on-job" ? "On Job" : tech.status}
				</Badge>
				{batteryLevel !== undefined && batteryLevel !== null && (
					<div className="flex items-center gap-1 text-xs text-muted-foreground">
						{batteryLevel < 20 ? (
							<BatteryLow className="h-3 w-3 text-red-500" />
						) : batteryLevel < 50 ? (
							<BatteryMedium className="h-3 w-3 text-amber-500" />
						) : (
							<Battery className="h-3 w-3 text-emerald-500" />
						)}
						<span>{Math.round(batteryLevel)}%</span>
					</div>
				)}
			</div>
		</div>
	);
}

// ============================================================================
// Bottom Detail Drawer Component
// ============================================================================

function DetailDrawer({
	tech,
	onClose,
	onNavigate,
}: {
	tech: TechnicianWithLocation | null;
	onClose: () => void;
	onNavigate: () => void;
}) {
	if (!tech) return null;

	const statusColor =
		TECH_STATUS_COLORS[tech.status] || TECH_STATUS_COLORS.offline;

	return (
		<div className="absolute bottom-0 left-0 right-0 z-20 bg-background border-t shadow-lg animate-in slide-in-from-bottom duration-300">
			<div className="max-w-4xl mx-auto p-4">
				{/* Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center gap-4">
						<div className="relative">
							<Avatar className="h-14 w-14">
								<AvatarImage src={tech.avatar || undefined} />
								<AvatarFallback className="text-lg">
									{getInitials(tech.name)}
								</AvatarFallback>
							</Avatar>
							<div
								className={cn(
									"absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background",
									statusColor.bg,
								)}
							/>
						</div>
						<div>
							<h3 className="text-lg font-semibold">{tech.name}</h3>
							<div className="flex items-center gap-3 text-sm text-muted-foreground">
								<span className="capitalize">
									{tech.role?.replace(/_/g, " ")}
								</span>
								{tech.gpsLocation && (
									<span className="flex items-center gap-1">
										<Signal className="h-3 w-3 text-emerald-500" />
										{formatLocationAge(tech.gpsLocation.updated_at)}
									</span>
								)}
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm" onClick={onNavigate}>
							<User className="h-4 w-4 mr-2" />
							View Schedule
						</Button>
						{tech.phone && (
							<Button variant="outline" size="sm" asChild>
								<a href={`tel:${tech.phone}`}>
									<Phone className="h-4 w-4 mr-2" />
									Call
								</a>
							</Button>
						)}
						<Button variant="ghost" size="icon" onClick={onClose}>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Today's Schedule */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Stats */}
					<Card className="bg-muted/30">
						<CardContent className="p-4">
							<div className="text-sm text-muted-foreground mb-1">
								Today&apos;s Jobs
							</div>
							<div className="text-2xl font-bold">
								{tech.appointments.length}
							</div>
							<div className="text-xs text-muted-foreground">
								{
									tech.appointments.filter((a) => a.status === "completed")
										.length
								}{" "}
								completed
							</div>
						</CardContent>
					</Card>

					{/* Current/Next Job */}
					<Card className="md:col-span-2 bg-muted/30">
						<CardContent className="p-4">
							{tech.currentJob ? (
								<>
									<div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
										<Zap className="h-3 w-3" />
										Current Job
									</div>
									<div className="font-medium">{tech.currentJob.title}</div>
									<div className="text-sm text-muted-foreground flex items-center gap-1">
										<MapPin className="h-3 w-3" />
										{getJobAddress(tech.currentJob)}
									</div>
								</>
							) : tech.nextJob ? (
								<>
									<div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
										<Clock className="h-3 w-3" />
										Next Job
									</div>
									<div className="font-medium">{tech.nextJob.title}</div>
									<div className="text-sm text-muted-foreground flex items-center gap-1">
										<MapPin className="h-3 w-3" />
										{getJobAddress(tech.nextJob)}
									</div>
								</>
							) : (
								<div className="text-muted-foreground">
									No upcoming jobs scheduled
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

// ============================================================================
// Unassigned Jobs Panel Component
// ============================================================================

function UnassignedJobsPanel({
	jobs,
	isOpen,
	onToggle,
	onJobSelect,
}: {
	jobs: Job[];
	isOpen: boolean;
	onToggle: () => void;
	onJobSelect: (job: Job) => void;
}) {
	if (jobs.length === 0) return null;

	return (
		<div className="absolute top-4 right-4 z-10">
			<Card
				className={cn(
					"transition-all duration-300",
					isOpen ? "w-80" : "w-auto",
				)}
			>
				<CardHeader
					className="p-3 cursor-pointer hover:bg-accent/50"
					onClick={onToggle}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<AlertCircle className="h-4 w-4 text-amber-500" />
							<span className="text-sm font-medium">
								Unassigned ({jobs.length})
							</span>
						</div>
						<ChevronDown
							className={cn(
								"h-4 w-4 transition-transform",
								isOpen && "rotate-180",
							)}
						/>
					</div>
				</CardHeader>
				{isOpen && (
					<CardContent className="p-0">
						<ScrollArea className="max-h-64">
							{jobs.slice(0, 10).map((job) => {
								const priorityColor = PRIORITY_COLORS[job.priority || "normal"];
								return (
									<div
										key={job.id}
										className="p-3 border-t cursor-pointer hover:bg-accent/50"
										onClick={() => onJobSelect(job)}
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1 min-w-0">
												<div className="font-medium text-sm truncate">
													{job.title}
												</div>
												<div className="text-xs text-muted-foreground truncate">
													{job.customer?.display_name}
												</div>
											</div>
											{job.priority && (
												<Badge
													variant="outline"
													className={cn(
														"text-[10px]",
														priorityColor?.bg,
														priorityColor?.text,
													)}
												>
													{job.priority}
												</Badge>
											)}
										</div>
									</div>
								);
							})}
						</ScrollArea>
					</CardContent>
				)}
			</Card>
		</div>
	);
}

// ============================================================================
// Main Component
// ============================================================================

function DispatchMapViewInner({
	technicians,
	gpsLocations,
	appointments,
	unassignedJobs,
	companyId,
}: DispatchMapViewProps) {
	const router = useRouter();
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<google.maps.Map | null>(null);
	const markersRef = useRef<
		Map<string, google.maps.marker.AdvancedMarkerElement>
	>(new Map());
	const polylinesRef = useRef<Map<string, google.maps.Polyline>>(new Map());
	const mapClickHandlerRef = useRef<
		((event: google.maps.MapMouseEvent) => void) | null
	>(null);

	const [isMapLoaded, setIsMapLoaded] = useState(false);
	const [mapError, setMapError] = useState<string | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);
	const [showUnassigned, setShowUnassigned] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [liveLocations, setLiveLocations] = useState<Map<string, GPSLocation>>(
		new Map(gpsLocations.map((loc) => [loc.technician_id, loc])),
	);

	// Quick appointment dialog state
	const [showQuickAppointment, setShowQuickAppointment] = useState(false);
	const [clickedLocation, setClickedLocation] =
		useState<MapClickLocation | null>(null);
	const [nearbyCustomers, setNearbyCustomers] = useState<CustomerOption[]>([]);

	// Weather and ETA state
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [technicianETAs, setTechnicianETAs] = useState<
		Map<
			string,
			{ durationMinutes: number; distanceKm: number; arrivalTime: string }
		>
	>(new Map());
	const [isOptimizingRoutes, setIsOptimizingRoutes] = useState(false);

	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

	// Transform technicians to TechnicianOption format for dialog
	const technicianOptions: TechnicianOption[] = useMemo(
		() =>
			technicians.map((tech) => ({
				id: tech.id,
				name: tech.name,
				avatar: tech.avatar,
			})),
		[technicians],
	);

	// Handle map click for quick appointment creation
	const handleMapClick = useCallback(
		async (event: google.maps.MapMouseEvent) => {
			if (!event.latLng) return;

			const lat = event.latLng.lat();
			const lng = event.latLng.lng();

			// Try to reverse geocode the location
			const address = await reverseGeocode({ lat, lng });

			setClickedLocation({
				lat,
				lng,
				address: address || undefined,
			});

			// Find nearby customers from unassigned jobs
			const customersWithLocation: Array<
				CustomerOption & { lat?: number; lng?: number }
			> = [];
			for (const job of unassignedJobs) {
				if (job.customer) {
					const coords =
						job.property?.lat && job.property?.lon
							? { lat: job.property.lat, lng: job.property.lon }
							: job.customer?.lat && job.customer?.lon
								? { lat: job.customer.lat, lng: job.customer.lon }
								: null;

					if (coords) {
						customersWithLocation.push({
							id: job.customer.id,
							display_name: job.customer.display_name,
							phone: job.customer.phone || undefined,
							lat: coords.lat,
							lng: coords.lng,
						});
					}
				}
			}

			// Find nearby customers within 5 miles
			const nearby = findNearbyEntities({ lat, lng }, customersWithLocation, 5);

			// Deduplicate and take top 5
			const uniqueCustomers = new Map<string, CustomerOption>();
			for (const customer of nearby) {
				if (!uniqueCustomers.has(customer.id)) {
					uniqueCustomers.set(customer.id, {
						id: customer.id,
						display_name: customer.display_name,
						phone: customer.phone,
					});
				}
			}
			setNearbyCustomers(Array.from(uniqueCustomers.values()).slice(0, 5));

			// Open the dialog
			setShowQuickAppointment(true);
		},
		[unassignedJobs],
	);

	// Keep the ref in sync with the latest handler
	useEffect(() => {
		mapClickHandlerRef.current = handleMapClick;
	}, [handleMapClick]);

	// Merge technicians with GPS locations and appointments
	const techniciansWithData = useMemo<TechnicianWithLocation[]>(() => {
		return technicians.map((tech) => {
			const gpsLocation = liveLocations.get(tech.id);
			const techAppointments = appointments.filter((apt) =>
				apt.assigned_technician_ids?.includes(tech.id),
			);

			// Sort by scheduled start
			techAppointments.sort(
				(a, b) =>
					new Date(a.scheduled_start).getTime() -
					new Date(b.scheduled_start).getTime(),
			);

			// Find current job (in-progress) and next job
			const currentApt = techAppointments.find(
				(apt) => apt.status === "in-progress" || apt.status === "arrived",
			);
			const nextApt = techAppointments.find(
				(apt) => apt.status === "scheduled" || apt.status === "dispatched",
			);

			// Get ETA for this technician
			const etaToNextJob = technicianETAs.get(tech.id);

			return {
				...tech,
				gpsLocation,
				appointments: techAppointments,
				currentJob: currentApt?.job,
				nextJob: nextApt?.job,
				etaToNextJob,
			};
		});
	}, [technicians, liveLocations, appointments, technicianETAs]);

	// Filter technicians by search
	const filteredTechnicians = useMemo(() => {
		if (!searchQuery.trim()) return techniciansWithData;
		const query = searchQuery.toLowerCase();
		return techniciansWithData.filter(
			(tech) =>
				tech.name?.toLowerCase().includes(query) ||
				tech.currentJob?.title?.toLowerCase().includes(query) ||
				tech.nextJob?.title?.toLowerCase().includes(query),
		);
	}, [techniciansWithData, searchQuery]);

	// Get selected technician
	const selectedTech = useMemo(
		() => techniciansWithData.find((t) => t.id === selectedTechId) || null,
		[techniciansWithData, selectedTechId],
	);

	// Initialize Google Maps
	useEffect(() => {
		if (!apiKey) {
			setMapError("Google Maps API key not configured");
			return;
		}

		let isMounted = true;

		const initMap = async () => {
			try {
				await loadGoogleMapsScript(apiKey);

				if (!isMounted || !mapContainerRef.current) return;

				const { Map } = (await google.maps.importLibrary(
					"maps",
				)) as google.maps.MapsLibrary;

				// Default center (San Francisco)
				const center = { lat: 37.7749, lng: -122.4194 };

				const map = new Map(mapContainerRef.current, {
					center,
					zoom: 11,
					mapId: "dispatch-map",
					disableDefaultUI: true,
					zoomControl: true,
					fullscreenControl: true,
					styles: [
						{
							featureType: "poi",
							elementType: "labels",
							stylers: [{ visibility: "off" }],
						},
					],
				});

				mapInstanceRef.current = map;
				setIsMapLoaded(true);

				// Add click listener for quick appointment creation
				// Using ref indirection so the listener doesn't need to be recreated when handler changes
				map.addListener("click", (event: google.maps.MapMouseEvent) => {
					if (mapClickHandlerRef.current) {
						mapClickHandlerRef.current(event);
					}
				});
			} catch (error) {
				if (isMounted) {
					setMapError(
						error instanceof Error ? error.message : "Failed to load map",
					);
				}
			}
		};

		initMap();

		return () => {
			isMounted = false;
			// Clean up markers
			for (const marker of markersRef.current.values()) {
				try {
					marker.map = null;
				} catch (e) {
					// Ignore cleanup errors
				}
			}
			markersRef.current.clear();
			// Clean up polylines
			for (const polyline of polylinesRef.current.values()) {
				try {
					polyline.setMap(null);
				} catch (e) {
					// Ignore cleanup errors
				}
			}
			polylinesRef.current.clear();
			// Clear map instance
			mapInstanceRef.current = null;
			// Clear the container to prevent React DOM issues
			if (mapContainerRef.current) {
				mapContainerRef.current.innerHTML = "";
			}
		};
	}, [apiKey]);

	// Update markers
	useEffect(() => {
		if (!mapInstanceRef.current || !isMapLoaded) return;

		const updateMarkers = async () => {
			try {
				const { AdvancedMarkerElement } = (await google.maps.importLibrary(
					"marker",
				)) as google.maps.MarkerLibrary;

				const map = mapInstanceRef.current;
				if (!map) return;

				const currentMarkerIds = new Set<string>();

				// Add technician markers
				for (const tech of techniciansWithData) {
					const gps = tech.gpsLocation;
					if (!gps) continue;

					const markerId = `tech-${tech.id}`;
					currentMarkerIds.add(markerId);

					const position = { lat: Number(gps.lat), lng: Number(gps.lng) };
					const statusColor =
						TECH_STATUS_COLORS[tech.status] || TECH_STATUS_COLORS.offline;

					let marker = markersRef.current.get(markerId);

					if (!marker) {
						// Create custom marker element
						const markerEl = document.createElement("div");
						markerEl.className = "relative cursor-pointer";
						markerEl.innerHTML = `
							<div class="relative">
								<div class="w-10 h-10 rounded-full bg-white shadow-lg border-2 ${statusColor.border.replace("border-", "border-")} flex items-center justify-center overflow-hidden">
									${
										tech.avatar
											? `<img src="${tech.avatar}" class="w-full h-full object-cover" />`
											: `<span class="text-sm font-medium text-gray-700">${getInitials(tech.name)}</span>`
									}
								</div>
								<div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${statusColor.bg} border-2 border-white"></div>
							</div>
						`;

						marker = new AdvancedMarkerElement({
							map,
							position,
							content: markerEl,
							title: tech.name,
						});

						marker.addListener("click", () => {
							setSelectedTechId(tech.id);
							setSelectedJob(null);
						});

						markersRef.current.set(markerId, marker);
					} else {
						marker.position = position;
					}
				}

				// Add job markers for appointments
				for (const apt of appointments) {
					if (!apt.job) continue;
					const coords = getJobCoordinates(apt.job);
					if (!coords) continue;

					const markerId = `job-${apt.job.id}`;
					currentMarkerIds.add(markerId);

					const color =
						JOB_STATUS_COLORS[apt.status] || JOB_STATUS_COLORS.pending;

					let marker = markersRef.current.get(markerId);

					if (!marker) {
						const markerEl = document.createElement("div");
						markerEl.className = "cursor-pointer";
						markerEl.innerHTML = `
							<div class="w-6 h-6 rounded-full shadow-md flex items-center justify-center" style="background-color: ${color}">
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
									<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
									<circle cx="12" cy="10" r="3"/>
								</svg>
							</div>
						`;

						marker = new AdvancedMarkerElement({
							map,
							position: coords,
							content: markerEl,
							title: apt.job.title,
						});

						marker.addListener("click", () => {
							setSelectedJob(apt.job!);
							setSelectedTechId(null);
						});

						markersRef.current.set(markerId, marker);
					}
				}

				// Remove old markers
				for (const [id, marker] of markersRef.current) {
					if (!currentMarkerIds.has(id)) {
						marker.map = null;
						markersRef.current.delete(id);
					}
				}
			} catch (error) {
				console.error("Error updating markers:", error);
			}
		};

		updateMarkers();
	}, [techniciansWithData, appointments, isMapLoaded]);

	// Draw route polylines for each technician
	useEffect(() => {
		if (!mapInstanceRef.current || !isMapLoaded) return;

		const map = mapInstanceRef.current;
		const colors = [
			"#3b82f6",
			"#10b981",
			"#f59e0b",
			"#8b5cf6",
			"#ef4444",
			"#ec4899",
		];

		// Clear existing polylines
		for (const polyline of polylinesRef.current.values()) {
			polyline.setMap(null);
		}
		polylinesRef.current.clear();

		// Draw routes for each technician
		techniciansWithData.forEach((tech, index) => {
			if (!tech.gpsLocation || tech.appointments.length === 0) return;

			const path: google.maps.LatLngLiteral[] = [];

			// Start from technician's current location
			path.push({
				lat: Number(tech.gpsLocation.lat),
				lng: Number(tech.gpsLocation.lng),
			});

			// Add each job location
			for (const apt of tech.appointments) {
				if (!apt.job) continue;
				const coords = getJobCoordinates(apt.job);
				if (coords) {
					path.push(coords);
				}
			}

			if (path.length < 2) return;

			const polyline = new google.maps.Polyline({
				path,
				geodesic: true,
				strokeColor: colors[index % colors.length],
				strokeOpacity: 0.7,
				strokeWeight: 3,
				map,
			});

			polylinesRef.current.set(`route-${tech.id}`, polyline);
		});
	}, [techniciansWithData, isMapLoaded]);

	// Subscribe to real-time GPS updates
	useEffect(() => {
		const supabase = createClient();

		const channel = supabase
			.channel("dispatch-gps-updates")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "technician_locations",
					filter: `company_id=eq.${companyId}`,
				},
				(payload) => {
					if (payload.new && typeof payload.new === "object") {
						const data = payload.new as GPSLocation;
						setLiveLocations((prev) => {
							const next = new Map(prev);
							next.set(data.technician_id, data);
							return next;
						});
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [companyId]);

	// Fetch weather for the map center
	useEffect(() => {
		const fetchWeather = async () => {
			// Get first technician with GPS as reference point
			const firstTechWithGps = techniciansWithData.find((t) => t.gpsLocation);
			if (!firstTechWithGps?.gpsLocation) return;

			try {
				const weatherData = await googleWeatherService.getWeatherData(
					firstTechWithGps.gpsLocation.lat,
					firstTechWithGps.gpsLocation.lng,
				);
				if (weatherData) {
					setWeather({
						temperature: weatherData.current.temperature,
						condition: weatherData.current.conditions,
						icon: weatherData.current.icon,
						alerts: weatherData.alerts,
					});
				}
			} catch (error) {
				console.error("Error fetching weather:", error);
			}
		};

		fetchWeather();
		// Refresh weather every 10 minutes
		const interval = setInterval(fetchWeather, 10 * 60 * 1000);
		return () => clearInterval(interval);
	}, [techniciansWithData]);

	// Fetch ETAs for technicians with GPS to their next job
	useEffect(() => {
		const fetchETAs = async () => {
			const etaPromises: Promise<void>[] = [];
			const newETAs = new Map<
				string,
				{ durationMinutes: number; distanceKm: number; arrivalTime: string }
			>();

			for (const tech of techniciansWithData) {
				if (!tech.gpsLocation || !tech.nextJob) continue;

				const jobCoords = getJobCoordinates(tech.nextJob);
				if (!jobCoords) continue;

				const promise = (async () => {
					try {
						const eta = await googleRoutesService.getETA(
							{ lat: tech.gpsLocation!.lat, lon: tech.gpsLocation!.lng },
							{ lat: jobCoords.lat, lon: jobCoords.lng },
						);
						if (eta) {
							newETAs.set(tech.id, {
								durationMinutes: eta.durationMinutes,
								distanceKm: eta.distanceKm,
								arrivalTime: eta.arrivalTime,
							});
						}
					} catch (error) {
						console.error(`Error fetching ETA for tech ${tech.id}:`, error);
					}
				})();
				etaPromises.push(promise);
			}

			await Promise.all(etaPromises);
			if (newETAs.size > 0) {
				setTechnicianETAs(newETAs);
			}
		};

		// Only fetch if we have technicians with GPS
		if (techniciansWithData.some((t) => t.gpsLocation && t.nextJob)) {
			fetchETAs();
			// Refresh ETAs every 2 minutes
			const interval = setInterval(fetchETAs, 2 * 60 * 1000);
			return () => clearInterval(interval);
		}
	}, [techniciansWithData]);

	// Optimize all routes for technicians
	const handleOptimizeRoutes = useCallback(async () => {
		setIsOptimizingRoutes(true);
		try {
			const map = mapInstanceRef.current;
			if (!map) return;

			// Clear existing polylines
			for (const polyline of polylinesRef.current.values()) {
				polyline.setMap(null);
			}
			polylinesRef.current.clear();

			const colors = [
				"#3b82f6",
				"#10b981",
				"#f59e0b",
				"#8b5cf6",
				"#ef4444",
				"#ec4899",
			];

			// Get optimized routes for each technician
			for (let i = 0; i < techniciansWithData.length; i++) {
				const tech = techniciansWithData[i];
				if (!tech.gpsLocation || tech.appointments.length === 0) continue;

				// Build stops array
				const stops: Array<{
					lat: number;
					lon: number;
					address?: string;
					jobId?: string;
				}> = [{ lat: tech.gpsLocation.lat, lon: tech.gpsLocation.lng }];

				for (const apt of tech.appointments) {
					if (!apt.job) continue;
					const coords = getJobCoordinates(apt.job);
					if (coords) {
						stops.push({
							lat: coords.lat,
							lon: coords.lng,
							address: getJobAddress(apt.job),
							jobId: apt.job.id,
						});
					}
				}

				if (stops.length < 2) continue;

				try {
					// Get optimized multi-stop route from Google
					const optimizedRoute = await googleRoutesService.getMultiStopRoute(
						stops,
						true,
					);
					if (optimizedRoute && optimizedRoute.polyline) {
						// Decode the polyline and draw it
						const decodedPath = google.maps.geometry?.encoding?.decodePath(
							optimizedRoute.polyline,
						);
						if (decodedPath) {
							const polyline = new google.maps.Polyline({
								path: decodedPath,
								geodesic: true,
								strokeColor: colors[i % colors.length],
								strokeOpacity: 0.8,
								strokeWeight: 4,
								map,
							});
							polylinesRef.current.set(`route-${tech.id}`, polyline);
						}
					}
				} catch (error) {
					console.error(`Error optimizing route for tech ${tech.id}:`, error);
					// Fall back to straight lines
					const path = stops.map((s) => ({ lat: s.lat, lng: s.lon }));
					const polyline = new google.maps.Polyline({
						path,
						geodesic: true,
						strokeColor: colors[i % colors.length],
						strokeOpacity: 0.7,
						strokeWeight: 3,
						map,
					});
					polylinesRef.current.set(`route-${tech.id}`, polyline);
				}
			}
		} catch (error) {
			console.error("Error optimizing routes:", error);
		} finally {
			setIsOptimizingRoutes(false);
		}
	}, [techniciansWithData]);

	// Fit bounds to all markers
	const handleFitBounds = useCallback(() => {
		if (!mapInstanceRef.current) return;

		const bounds = new google.maps.LatLngBounds();
		let hasPoints = false;

		for (const tech of techniciansWithData) {
			if (tech.gpsLocation) {
				bounds.extend({
					lat: Number(tech.gpsLocation.lat),
					lng: Number(tech.gpsLocation.lng),
				});
				hasPoints = true;
			}
		}

		for (const apt of appointments) {
			if (apt.job) {
				const coords = getJobCoordinates(apt.job);
				if (coords) {
					bounds.extend(coords);
					hasPoints = true;
				}
			}
		}

		if (hasPoints) {
			mapInstanceRef.current.fitBounds(bounds, 50);
		}
	}, [techniciansWithData, appointments]);

	// Center on selected technician
	useEffect(() => {
		if (!mapInstanceRef.current || !selectedTech?.gpsLocation) return;
		mapInstanceRef.current.panTo({
			lat: Number(selectedTech.gpsLocation.lat),
			lng: Number(selectedTech.gpsLocation.lng),
		});
		mapInstanceRef.current.setZoom(15);
	}, [selectedTech]);

	// Count technicians with GPS
	const techsWithGps = techniciansWithData.filter((t) => t.gpsLocation).length;

	return (
		<div className="relative h-full w-full overflow-hidden">
			{/* Floating Sidebar */}
			<div
				className={cn(
					"absolute top-4 left-4 bottom-4 z-10 transition-all duration-300",
					sidebarOpen ? "w-80" : "w-12",
				)}
			>
				<Card className="h-full flex flex-col overflow-hidden">
					{/* Sidebar Header */}
					<CardHeader className="p-3 border-b flex-shrink-0">
						<div className="flex items-center justify-between">
							{sidebarOpen ? (
								<>
									<div className="flex items-center gap-2">
										<Users className="h-4 w-4" />
										<span className="font-medium">Technicians</span>
										<Badge variant="secondary" className="text-xs">
											{technicians.length}
										</Badge>
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8"
										onClick={() => setSidebarOpen(false)}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
								</>
							) : (
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8"
									onClick={() => setSidebarOpen(true)}
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
							)}
						</div>
					</CardHeader>

					{sidebarOpen && (
						<>
							{/* Search */}
							<div className="p-3 border-b">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										placeholder="Search technicians..."
										className="pl-9"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
							</div>

							{/* Technician List */}
							<ScrollArea className="flex-1">
								{filteredTechnicians.length > 0 ? (
									filteredTechnicians.map((tech) => (
										<TechnicianListItem
											key={tech.id}
											tech={tech}
											isSelected={selectedTechId === tech.id}
											onClick={() => {
												setSelectedTechId(tech.id);
												setSelectedJob(null);
											}}
										/>
									))
								) : technicians.length === 0 ? (
									<div className="p-4 text-center">
										<AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
										<p className="text-sm font-medium">No technicians found</p>
										<p className="text-xs text-muted-foreground mt-1">
											Add technicians to your team to see them here
										</p>
									</div>
								) : (
									<div className="p-4 text-center text-sm text-muted-foreground">
										No results for &quot;{searchQuery}&quot;
									</div>
								)}
							</ScrollArea>

							{/* Live Status */}
							<div className="p-3 border-t bg-muted/30">
								<div className="flex items-center justify-between text-xs">
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
										<span className="text-muted-foreground">
											Live GPS Tracking
										</span>
									</div>
									<span className="text-muted-foreground">
										{techsWithGps}/{technicians.length} active
									</span>
								</div>
							</div>
						</>
					)}
				</Card>
			</div>

			{/* Weather Widget */}
			{weather && (
				<div className="absolute top-4 left-[21rem] z-10">
					<Card className="p-3 bg-background/95 backdrop-blur shadow-lg">
						<div className="flex items-center gap-3">
							{weather.condition.toLowerCase().includes("rain") ||
							weather.condition.toLowerCase().includes("storm") ? (
								<CloudRain className="h-5 w-5 text-blue-500" />
							) : weather.condition.toLowerCase().includes("cloud") ? (
								<CloudRain className="h-5 w-5 text-gray-500" />
							) : (
								<Sun className="h-5 w-5 text-amber-500" />
							)}
							<div>
								<div className="flex items-center gap-2">
									<span className="font-semibold">
										{Math.round(weather.temperature)}°F
									</span>
									<span className="text-sm text-muted-foreground">
										{weather.condition}
									</span>
								</div>
								{weather.alerts.length > 0 && (
									<div className="flex items-center gap-1 text-xs text-amber-600">
										<AlertTriangle className="h-3 w-3" />
										<span>{weather.alerts[0].headline}</span>
									</div>
								)}
							</div>
						</div>
					</Card>
				</div>
			)}

			{/* Map Controls */}
			<div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="secondary"
								size="icon"
								className="shadow-lg"
								onClick={handleOptimizeRoutes}
								disabled={isOptimizingRoutes}
							>
								{isOptimizingRoutes ? (
									<RefreshCw className="h-4 w-4 animate-spin" />
								) : (
									<Route className="h-4 w-4" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left">
							<p className="font-medium">Optimize Routes</p>
							<p className="text-xs text-muted-foreground">
								Get optimal routes for all technicians
							</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="secondary"
								size="icon"
								className="shadow-lg"
								onClick={() => setShowQuickAppointment(true)}
							>
								<Plus className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left">
							<p className="font-medium">Quick Appointment</p>
							<p className="text-xs text-muted-foreground">
								Or click anywhere on map
							</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="secondary"
								size="icon"
								className="shadow-lg"
								onClick={handleFitBounds}
							>
								<Locate className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left">Fit all markers</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			{/* Unassigned Jobs Panel */}
			<UnassignedJobsPanel
				jobs={unassignedJobs}
				isOpen={showUnassigned}
				onToggle={() => setShowUnassigned(!showUnassigned)}
				onJobSelect={(job) => {
					setSelectedJob(job);
					setSelectedTechId(null);
					const coords = getJobCoordinates(job);
					if (coords && mapInstanceRef.current) {
						mapInstanceRef.current.panTo(coords);
						mapInstanceRef.current.setZoom(15);
					}
				}}
			/>

			{/* Map Container - Wrapper isolates Google Maps DOM from React reconciliation */}
			<div className="h-full w-full bg-muted relative">
				{/* Google Maps renders here - suppressHydrationWarning prevents React from trying to reconcile Google's DOM changes */}
				<div
					ref={mapContainerRef}
					className="absolute inset-0"
					suppressHydrationWarning
				/>
				{/* Overlay for loading/error states */}
				{!isMapLoaded && !mapError && (
					<div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
						<div className="text-center">
							<RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
							<p className="mt-2 text-sm text-muted-foreground">
								Loading map...
							</p>
						</div>
					</div>
				)}
				{mapError && (
					<div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
						<div className="text-center max-w-md">
							<AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
							<h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
							<p className="text-sm text-muted-foreground mb-4">{mapError}</p>
							<p className="text-xs text-muted-foreground">
								Please ensure the Google Maps API key is configured in your
								environment variables.
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Bottom Detail Drawer */}
			<DetailDrawer
				tech={selectedTech}
				onClose={() => setSelectedTechId(null)}
				onNavigate={() => {
					if (selectedTech) {
						router.push(`/dashboard/schedule/technician/${selectedTech.id}`);
					}
				}}
			/>

			{/* Quick Appointment Dialog - triggered by map click */}
			<QuickAppointmentDialog
				open={showQuickAppointment}
				onOpenChange={setShowQuickAppointment}
				location={clickedLocation}
				technicians={technicianOptions}
				nearbyCustomers={nearbyCustomers}
				onSuccess={(appointmentId) => {
					// Could optionally center map on new appointment or show toast
					console.log("Appointment created:", appointmentId);
				}}
				onCreateCustomer={() => {
					// Open customer creation flow - navigate to customer creation page
					router.push("/dashboard/customers/new");
				}}
			/>
		</div>
	);
}

// ============================================================================
// Export with Error Boundary Wrapper
// ============================================================================

export function DispatchMapView(props: DispatchMapViewProps) {
	return (
		<MapErrorBoundary>
			<DispatchMapViewInner {...props} />
		</MapErrorBoundary>
	);
}
