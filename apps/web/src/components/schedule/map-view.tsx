"use client";

/**
 * Schedule Map View
 *
 * Interactive map showing:
 * - Job locations with status indicators
 * - Technician real-time locations with GPS tracking
 * - Routes between jobs with polylines
 * - Traffic conditions
 * - Click technician to open Focus Panel
 *
 * Uses Google Maps API when available, with fallback to static display
 * Integrates with Supabase realtime for live GPS updates
 */

import {
	Battery,
	Car,
	ChevronDown,
	ChevronUp,
	Clock,
	Focus,
	Layers,
	MapPin,
	Navigation,
	Pause,
	Play,
	RefreshCw,
	Route,
	Signal,
	User,
	Users,
	Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSchedule } from "@/hooks/use-schedule";
import {
	type Coordinates,
	calculateHaversineDistance,
	getJobCoordinates,
	getSmartDispatchRecommendations,
	getTechnicianCoordinates,
	type SmartDispatchRecommendation,
} from "@/lib/schedule/route-optimization";
import {
	formatLocationAge,
	useGPSTrackingStore,
} from "@/lib/stores/gps-tracking-store";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Job, Technician } from "./schedule-types";

// ============================================================================
// Types
// ============================================================================

type MapViewProps = {
	className?: string;
	onJobSelect?: (job: Job) => void;
	onTechnicianSelect?: (tech: Technician) => void;
	onTechnicianFocus?: (techId: string) => void;
	showFocusPanel?: boolean;
};

type MapMarker = {
	id: string;
	type: "job" | "technician";
	coordinates: Coordinates;
	data: Job | Technician;
	status?: string;
	color: string;
};

// ============================================================================
// Job Status Colors
// ============================================================================

const JOB_STATUS_COLORS: Record<string, string> = {
	scheduled: "#3b82f6", // blue
	dispatched: "#f59e0b", // amber
	arrived: "#10b981", // green
	"in-progress": "#8b5cf6", // purple
	completed: "#6b7280", // gray
	cancelled: "#ef4444", // red
	closed: "#6b7280", // gray
};

const TECHNICIAN_STATUS_COLORS: Record<string, string> = {
	available: "#10b981", // green
	"on-job": "#3b82f6", // blue
	"on-break": "#f59e0b", // amber
	offline: "#6b7280", // gray
};

// ============================================================================
// Component
// ============================================================================

export function MapView({
	className,
	onJobSelect,
	onTechnicianSelect,
	onTechnicianFocus,
	showFocusPanel = false,
}: MapViewProps) {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<google.maps.Map | null>(null);
	const markersRef = useRef<
		Map<string, google.maps.marker.AdvancedMarkerElement>
	>(new Map());
	const polylinesRef = useRef<Map<string, google.maps.Polyline>>(new Map());
	const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);

	const [isMapLoaded, setIsMapLoaded] = useState(false);
	const [showJobsList, setShowJobsList] = useState(false);
	const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
	const [isLiveTracking, setIsLiveTracking] = useState(true);
	const [lastGpsUpdate, setLastGpsUpdate] = useState<Date | null>(null);

	const { jobs, technicians } = useSchedule();
	const getJobsByTechnician = useScheduleStore(
		(state) => state.getJobsByTechnician,
	);
	const {
		locations,
		mapView,
		showTraffic,
		showRoutes,
		setMapView,
		toggleTraffic,
		toggleRoutes,
		fitBoundsToLocations,
	} = useGPSTrackingStore();

	// Convert jobs and technicians to markers
	const markers = useMemo(() => {
		const result: MapMarker[] = [];

		// Add job markers
		const jobsArray = Array.from(jobs.values());
		for (const job of jobsArray) {
			const coords = getJobCoordinates(job);
			if (coords) {
				result.push({
					id: `job-${job.id}`,
					type: "job",
					coordinates: coords,
					data: job,
					status: job.status,
					color: JOB_STATUS_COLORS[job.status] || "#6b7280",
				});
			}
		}

		// Add technician markers
		const techsArray = Array.from(technicians.values());
		for (const tech of techsArray) {
			const coords = getTechnicianCoordinates(tech);
			if (coords) {
				result.push({
					id: `tech-${tech.id}`,
					type: "technician",
					coordinates: coords,
					data: tech,
					status: tech.status,
					color: TECHNICIAN_STATUS_COLORS[tech.status] || "#6b7280",
				});
			}
		}

		return result;
	}, [jobs, technicians]);

	// Initialize Google Maps
	useEffect(() => {
		const initMap = async () => {
			if (!mapContainerRef.current || !window.google?.maps) return;

			try {
				const { Map } = (await google.maps.importLibrary(
					"maps",
				)) as google.maps.MapsLibrary;

				const map = new Map(mapContainerRef.current, {
					center: mapView.center,
					zoom: mapView.zoom,
					mapId: "schedule-map",
					disableDefaultUI: false,
					zoomControl: true,
					mapTypeControl: false,
					streetViewControl: false,
					fullscreenControl: true,
				});

				mapInstanceRef.current = map;
				setIsMapLoaded(true);

				// Listen for map changes
				map.addListener("center_changed", () => {
					const center = map.getCenter();
					if (center) {
						setMapView({
							center: { lat: center.lat(), lng: center.lng() },
						});
					}
				});

				map.addListener("zoom_changed", () => {
					const zoom = map.getZoom();
					if (zoom !== undefined) {
						setMapView({ zoom });
					}
				});
			} catch (error) {
				console.error("Failed to initialize Google Maps:", error);
			}
		};

		// Check if Google Maps is loaded
		if (window.google?.maps) {
			initMap();
		} else {
			// Wait for Google Maps to load
			const checkGoogle = setInterval(() => {
				if (window.google?.maps) {
					clearInterval(checkGoogle);
					initMap();
				}
			}, 100);

			return () => clearInterval(checkGoogle);
		}
	}, [mapView.center, mapView.zoom, setMapView]);

	// Update markers when data changes
	useEffect(() => {
		if (!mapInstanceRef.current || !isMapLoaded) return;

		const updateMarkers = async () => {
			const { AdvancedMarkerElement, PinElement } =
				(await google.maps.importLibrary(
					"marker",
				)) as google.maps.MarkerLibrary;

			const map = mapInstanceRef.current;
			if (!map) return;

			// Remove old markers
			for (const [id, marker] of markersRef.current) {
				if (!markers.find((m) => m.id === id)) {
					marker.map = null;
					markersRef.current.delete(id);
				}
			}

			// Add or update markers
			for (const marker of markers) {
				let existingMarker = markersRef.current.get(marker.id);

				if (!existingMarker) {
					// Create pin element
					const pin = new PinElement({
						background: marker.color,
						borderColor:
							marker.type === "technician" ? "#ffffff" : marker.color,
						glyphColor: "#ffffff",
						scale: marker.type === "technician" ? 1.2 : 1,
					});

					// Add icon for technician
					if (marker.type === "technician") {
						const icon = document.createElement("div");
						icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>`;
						pin.glyph = icon;
					}

					existingMarker = new AdvancedMarkerElement({
						map,
						position: marker.coordinates,
						content: pin.element,
						title:
							marker.type === "job"
								? (marker.data as Job).title
								: (marker.data as Technician).name,
					});

					// Add click handler
					existingMarker.addListener("click", () => {
						setSelectedMarkerId(marker.id);
						if (marker.type === "job") {
							onJobSelect?.(marker.data as Job);
						} else {
							const tech = marker.data as Technician;
							onTechnicianSelect?.(tech);
							// Trigger focus panel on double-click or if focus callback provided
							onTechnicianFocus?.(tech.id);
						}
					});

					markersRef.current.set(marker.id, existingMarker);
				} else {
					// Update position
					existingMarker.position = marker.coordinates;
				}
			}
		};

		updateMarkers();
	}, [
		markers,
		isMapLoaded,
		onJobSelect,
		onTechnicianSelect,
		onTechnicianFocus,
	]);

	// Subscribe to real-time GPS updates
	useEffect(() => {
		if (!isLiveTracking) return;

		const supabase = createClient();
		const channel = supabase
			.channel("gps-locations")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "technician_locations",
				},
				(payload) => {
					if (payload.new && typeof payload.new === "object") {
						const data = payload.new as {
							technician_id: string;
							lat: number;
							lng: number;
							accuracy: number;
							heading?: number;
							speed?: number;
							battery_level?: number;
							updated_at: string;
						};

						// Update GPS tracking store
						useGPSTrackingStore.getState().setLocation(data.technician_id, {
							technicianId: data.technician_id,
							coordinates: { lat: data.lat, lng: data.lng },
							accuracy: data.accuracy,
							heading: data.heading,
							speed: data.speed,
							timestamp: new Date(data.updated_at),
							status: "active",
							batteryLevel: data.battery_level,
						});

						setLastGpsUpdate(new Date());
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [isLiveTracking]);

	// Draw route polylines for each technician
	useEffect(() => {
		if (!mapInstanceRef.current || !isMapLoaded || !showRoutes) {
			// Clear polylines if routes disabled
			for (const polyline of polylinesRef.current.values()) {
				polyline.setMap(null);
			}
			polylinesRef.current.clear();
			return;
		}

		const map = mapInstanceRef.current;
		const techColors = [
			"#3b82f6",
			"#10b981",
			"#f59e0b",
			"#8b5cf6",
			"#ef4444",
			"#ec4899",
			"#14b8a6",
			"#f97316",
		];

		// Get jobs grouped by technician
		const techsArray = Array.from(technicians.values());
		const existingPolylineIds = new Set(polylinesRef.current.keys());

		techsArray.forEach((tech, index) => {
			const techJobs = getJobsByTechnician(tech.id)
				.filter((job) => {
					const today = new Date();
					const jobDate = new Date(job.startTime);
					return (
						jobDate.getFullYear() === today.getFullYear() &&
						jobDate.getMonth() === today.getMonth() &&
						jobDate.getDate() === today.getDate()
					);
				})
				.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

			const polylineId = `route-${tech.id}`;
			existingPolylineIds.delete(polylineId);

			if (techJobs.length < 2) {
				// Not enough jobs for a route
				const existing = polylinesRef.current.get(polylineId);
				if (existing) {
					existing.setMap(null);
					polylinesRef.current.delete(polylineId);
				}
				return;
			}

			// Build path from jobs
			const path: google.maps.LatLngLiteral[] = [];

			// Start from technician's current location if available
			const gpsLocation = locations.get(tech.id);
			if (gpsLocation) {
				path.push(gpsLocation.coordinates);
			}

			for (const job of techJobs) {
				const coords = getJobCoordinates(job);
				if (coords) {
					path.push(coords);
				}
			}

			if (path.length < 2) return;

			const color = techColors[index % techColors.length];
			let polyline = polylinesRef.current.get(polylineId);

			if (!polyline) {
				polyline = new google.maps.Polyline({
					path,
					geodesic: true,
					strokeColor: color,
					strokeOpacity: 0.8,
					strokeWeight: 3,
					map,
				});
				polylinesRef.current.set(polylineId, polyline);
			} else {
				polyline.setPath(path);
			}
		});

		// Clean up removed polylines
		for (const id of existingPolylineIds) {
			const polyline = polylinesRef.current.get(id);
			if (polyline) {
				polyline.setMap(null);
				polylinesRef.current.delete(id);
			}
		}
	}, [technicians, locations, isMapLoaded, showRoutes, getJobsByTechnician]);

	// Toggle traffic layer
	useEffect(() => {
		if (!mapInstanceRef.current || !isMapLoaded) return;

		if (showTraffic) {
			if (!trafficLayerRef.current) {
				trafficLayerRef.current = new google.maps.TrafficLayer();
			}
			trafficLayerRef.current.setMap(mapInstanceRef.current);
		} else if (trafficLayerRef.current) {
			trafficLayerRef.current.setMap(null);
		}
	}, [showTraffic, isMapLoaded]);

	// Handle fit to bounds
	const handleFitBounds = useCallback(() => {
		if (!mapInstanceRef.current || markers.length === 0) return;

		const bounds = new google.maps.LatLngBounds();
		for (const marker of markers) {
			bounds.extend(marker.coordinates);
		}

		mapInstanceRef.current.fitBounds(bounds, 50);
	}, [markers]);

	// Stats
	const stats = useMemo(() => {
		const jobsArray = Array.from(jobs.values());
		const techsArray = Array.from(technicians.values());

		const activeGpsLocations = Array.from(locations.values()).filter(
			(loc) => loc.status === "active",
		).length;

		return {
			totalJobs: jobsArray.length,
			inProgress: jobsArray.filter((j) => j.status === "in-progress").length,
			scheduled: jobsArray.filter((j) => j.status === "scheduled").length,
			dispatched: jobsArray.filter((j) => j.status === "dispatched").length,
			availableTechs: techsArray.filter((t) => t.status === "available").length,
			activeTechs: techsArray.filter((t) => t.status === "on-job").length,
			totalTechs: techsArray.length,
			activeGpsLocations,
		};
	}, [jobs, technicians, locations]);

	return (
		<div className={cn("relative flex h-full flex-col", className)}>
			{/* Map Controls */}
			<div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
				<Card className="w-auto">
					<CardContent className="flex items-center gap-2 p-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="ghost" size="icon" onClick={handleFitBounds}>
										<Navigation className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Fit all markers</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={showTraffic ? "secondary" : "ghost"}
										size="icon"
										onClick={toggleTraffic}
									>
										<Car className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Toggle traffic</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={showRoutes ? "secondary" : "ghost"}
										size="icon"
										onClick={toggleRoutes}
									>
										<Route className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Toggle routes</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="ghost" size="icon">
										<Layers className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Map layers</TooltipContent>
							</Tooltip>

							<div className="h-4 w-px bg-border" />

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={isLiveTracking ? "secondary" : "ghost"}
										size="icon"
										onClick={() => setIsLiveTracking(!isLiveTracking)}
									>
										{isLiveTracking ? (
											<Signal className="h-4 w-4 text-green-500 dark:text-green-400" />
										) : (
											<Pause className="h-4 w-4" />
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									{isLiveTracking ? "Live tracking ON" : "Live tracking OFF"}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</CardContent>
				</Card>

				{/* Live GPS Status */}
				{isLiveTracking && (
					<Card className="mt-2">
						<CardContent className="p-2">
							<div className="flex items-center gap-2 text-xs">
								<div className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
								<span className="text-muted-foreground">Live GPS</span>
								{lastGpsUpdate && (
									<span className="text-muted-foreground">
										• Updated {formatLocationAge(lastGpsUpdate)}
									</span>
								)}
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Stats Panel */}
			<div className="absolute right-4 top-4 z-10">
				<Card className="w-64">
					<CardHeader className="p-3 pb-2">
						<CardTitle className="flex items-center gap-2 text-sm font-medium">
							<MapPin className="h-4 w-4" />
							Today&apos;s Overview
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 p-3 pt-0">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Jobs</span>
							<div className="flex items-center gap-2">
								<Badge variant="secondary" className="font-mono">
									{stats.totalJobs}
								</Badge>
							</div>
						</div>
						<div className="flex flex-wrap gap-1">
							{stats.scheduled > 0 && (
								<Badge
									variant="outline"
									className="text-xs border-blue-500 dark:border-blue-400"
								>
									{stats.scheduled} scheduled
								</Badge>
							)}
							{stats.dispatched > 0 && (
								<Badge
									variant="outline"
									className="text-xs border-amber-500 dark:border-amber-400"
								>
									{stats.dispatched} dispatched
								</Badge>
							)}
							{stats.inProgress > 0 && (
								<Badge
									variant="outline"
									className="text-xs border-purple-500 dark:border-purple-400"
								>
									{stats.inProgress} in progress
								</Badge>
							)}
						</div>

						<div className="border-t pt-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Technicians</span>
								<Badge variant="secondary" className="font-mono">
									{stats.totalTechs}
								</Badge>
							</div>
							<div className="mt-1 flex flex-wrap gap-1">
								{stats.availableTechs > 0 && (
									<Badge
										variant="outline"
										className="text-xs border-green-500 dark:border-green-400"
									>
										{stats.availableTechs} available
									</Badge>
								)}
								{stats.activeTechs > 0 && (
									<Badge
										variant="outline"
										className="text-xs border-blue-500 dark:border-blue-400"
									>
										{stats.activeTechs} on job
									</Badge>
								)}
							</div>
						</div>

						{/* GPS Tracking Stats */}
						{stats.activeGpsLocations > 0 && (
							<div className="border-t pt-2">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground flex items-center gap-1">
										<Signal className="h-3 w-3" />
										GPS Tracking
									</span>
									<Badge variant="secondary" className="font-mono">
										{stats.activeGpsLocations}/{stats.totalTechs}
									</Badge>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Jobs List Panel */}
			<div className="absolute bottom-4 left-4 right-4 z-10">
				<Card>
					<CardHeader
						className="cursor-pointer p-3"
						onClick={() => setShowJobsList(!showJobsList)}
					>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2 text-sm font-medium">
								<Clock className="h-4 w-4" />
								Today&apos;s Jobs ({stats.totalJobs})
							</CardTitle>
							{showJobsList ? (
								<ChevronDown className="h-4 w-4" />
							) : (
								<ChevronUp className="h-4 w-4" />
							)}
						</div>
					</CardHeader>
					{showJobsList && (
						<CardContent className="max-h-48 overflow-auto p-3 pt-0">
							<div className="space-y-2">
								{Array.from(jobs.values())
									.slice(0, 10)
									.map((job) => (
										<div
											key={job.id}
											className={cn(
												"flex items-center justify-between rounded-md border p-2 text-sm",
												"cursor-pointer hover:bg-muted/50",
												selectedMarkerId === `job-${job.id}` && "bg-muted",
											)}
											onClick={() => {
												setSelectedMarkerId(`job-${job.id}`);
												onJobSelect?.(job);
												const coords = getJobCoordinates(job);
												if (coords && mapInstanceRef.current) {
													mapInstanceRef.current.panTo(coords);
													mapInstanceRef.current.setZoom(15);
												}
											}}
										>
											<div className="flex items-center gap-2">
												<div
													className={cn(
														"h-2 w-2 rounded-full",
														job.status === "scheduled" && "bg-blue-500",
														job.status === "dispatched" && "bg-amber-500",
														job.status === "arrived" && "bg-green-500",
														job.status === "in-progress" && "bg-purple-500",
														job.status === "completed" && "bg-gray-500",
														job.status === "cancelled" && "bg-red-500",
														job.status === "closed" && "bg-gray-500",
														!job.status && "bg-gray-500",
													)}
												/>
												<span className="font-medium">{job.title}</span>
											</div>
											<div className="flex items-center gap-2 text-muted-foreground">
												<span>{job.customer?.name}</span>
												<Badge variant="outline" className="text-xs">
													{job.status}
												</Badge>
											</div>
										</div>
									))}
							</div>
						</CardContent>
					)}
				</Card>
			</div>

			{/* Map Container */}
			<div
				ref={mapContainerRef}
				className="h-full w-full bg-muted"
				style={{ minHeight: "400px" }}
			>
				{!isMapLoaded && (
					<div className="flex h-full items-center justify-center">
						<div className="text-center">
							<RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
							<p className="mt-2 text-sm text-muted-foreground">
								Loading map...
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default MapView;
