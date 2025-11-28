"use client";

/**
 * Technician Route Tracking Map
 * 
 * Uber-style tracking view for a single technician showing:
 * - Real-time GPS location
 * - Route between jobs
 * - Job locations with status
 * - Travel time estimates
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
	estimateTravelTime,
} from "@/lib/schedule/route-optimization";
import { useGPSTrackingStore } from "@/lib/stores/gps-tracking-store";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Job, Technician } from "../schedule-types";
import {
	Clock,
	Navigation,
	RefreshCw,
} from "lucide-react";

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

type TechnicianRouteTrackingMapProps = {
	technicianId: string;
	className?: string;
};

export function TechnicianRouteTrackingMap({
	technicianId,
	className,
}: TechnicianRouteTrackingMapProps) {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<google.maps.Map | null>(null);
	const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(
		new Map(),
	);
	const polylinesRef = useRef<Map<string, google.maps.Polyline>>(new Map());
	const [isMapLoaded, setIsMapLoaded] = useState(false);
	const [mapError, setMapError] = useState<string | null>(null);
	const [lastGpsUpdate, setLastGpsUpdate] = useState<Date | null>(null);

	const { technicians, getJobsForTechnician } = useSchedule();
	const technician = useMemo(
		() => technicians.find((t) => t.id === technicianId),
		[technicians, technicianId],
	);
	const jobs = useMemo(
		() => getJobsForTechnician(technicianId).sort(
			(a, b) => a.startTime.getTime() - b.startTime.getTime(),
		),
		[getJobsForTechnician, technicianId],
	);

	const gpsLocation = useGPSTrackingStore((state) =>
		state.getLocation(technicianId),
	);

	// Initialize Google Maps
	useEffect(() => {
		const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
		if (!apiKey) {
			setMapError("Google Maps API key not configured");
			return;
		}

		if (!mapContainerRef.current || mapInstanceRef.current) return;

		let isMounted = true;

		const initMap = async () => {
			try {
				await loadGoogleMapsScript(apiKey);

				if (!isMounted || !mapContainerRef.current) return;

				const { Map } = (await google.maps.importLibrary(
					"maps",
				)) as google.maps.MapsLibrary;

				// Determine initial center
				let center: Coordinates = { lat: 34.0522, lng: -118.2437 }; // Default to LA
				
				if (gpsLocation) {
					center = gpsLocation.coordinates;
				} else if (jobs.length > 0) {
					const firstJobCoords = getJobCoordinates(jobs[0]);
					if (firstJobCoords) {
						center = firstJobCoords;
					}
				}

				const map = new Map(mapContainerRef.current, {
					center,
					zoom: 13,
					mapId: "TECHNICIAN_ROUTE_TRACKING",
					disableDefaultUI: false,
					zoomControl: true,
					mapTypeControl: false,
					streetViewControl: false,
					fullscreenControl: true,
				});

				mapInstanceRef.current = map;
				setIsMapLoaded(true);
			} catch (error) {
				if (isMounted) {
					console.error("Failed to load Google Maps:", error);
					setMapError(
						error instanceof Error ? error.message : "Failed to load map",
					);
				}
			}
		};

		void initMap();

		return () => {
			isMounted = false;
		};
	}, [gpsLocation, jobs]);

	// Subscribe to real-time GPS updates
	useEffect(() => {
		if (!technicianId) return;

		const supabase = createClient();
		const channel = supabase
			.channel(`technician-gps-${technicianId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "technician_locations",
					filter: `technician_id=eq.${technicianId}`,
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

						useGPSTrackingStore.getState().setLocation(technicianId, {
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
	}, [technicianId]);

	// Update markers and routes
	useEffect(() => {
		if (!mapInstanceRef.current || !isMapLoaded || !technician) return;

		const updateMarkers = async () => {
			const { AdvancedMarkerElement, PinElement } = (await google.maps.importLibrary(
				"marker",
			)) as google.maps.MarkerLibrary;

			// Clear existing markers
			for (const marker of markersRef.current.values()) {
				marker.map = null;
			}
			markersRef.current.clear();

			// Clear existing polylines
			for (const polyline of polylinesRef.current.values()) {
				polyline.setMap(null);
			}
			polylinesRef.current.clear();

			const map = mapInstanceRef.current;
			const bounds = new google.maps.LatLngBounds();
			const path: google.maps.LatLngLiteral[] = [];

			// Add technician GPS location marker
			if (gpsLocation) {
				const techPin = new PinElement({
					background: "#3b82f6",
					borderColor: "#1e40af",
					glyphColor: "#ffffff",
					scale: 1.2,
				});

				const techMarker = new AdvancedMarkerElement({
					map,
					position: gpsLocation.coordinates,
					title: `${technician.name} - Current Location`,
					content: techPin.element,
				});

				markersRef.current.set("technician", techMarker);
				bounds.extend(gpsLocation.coordinates);
				path.push(gpsLocation.coordinates);
			}

			// Add job location markers
			jobs.forEach((job, index) => {
				const coords = getJobCoordinates(job);
				if (!coords) return;

				const jobPin = new PinElement({
					background: job.status === "completed" ? "#10b981" : "#f59e0b",
					borderColor: job.status === "completed" ? "#059669" : "#d97706",
					glyphColor: "#ffffff",
					glyph: String(index + 1),
					scale: 1.0,
				});

				const jobMarker = new AdvancedMarkerElement({
					map,
					position: coords,
					title: `${job.customer?.name || job.title} - ${format(job.startTime, "h:mm a")}`,
					content: jobPin.element,
				});

				markersRef.current.set(`job-${job.id}`, jobMarker);
				bounds.extend(coords);
				path.push(coords);
			});

			// Draw route polyline
			if (path.length >= 2) {
				const polyline = new google.maps.Polyline({
					path,
					geodesic: true,
					strokeColor: "#3b82f6",
					strokeOpacity: 0.8,
					strokeWeight: 4,
					map,
				});

				polylinesRef.current.set("route", polyline);

				// Fit bounds to show all markers
				map.fitBounds(bounds, { padding: 50 });
			}
		};

		void updateMarkers();
	}, [isMapLoaded, technician, gpsLocation, jobs]);

	if (mapError) {
		return (
			<div className={cn("flex h-full items-center justify-center", className)}>
				<div className="text-center p-4">
					<p className="text-sm text-destructive mb-2">{mapError}</p>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setMapError(null);
							setIsMapLoaded(false);
							mapInstanceRef.current = null;
						}}
					>
						<RefreshCw className="mr-2 h-4 w-4" />
						Retry
					</Button>
				</div>
			</div>
		);
	}

	if (!technician) {
		return (
			<div className={cn("flex h-full items-center justify-center", className)}>
				<p className="text-sm text-muted-foreground">Technician not found</p>
			</div>
		);
	}

	// Calculate route statistics
	const routeStats = useMemo(() => {
		if (jobs.length === 0) return null;

		let totalDistance = 0;
		const segments: Array<{ from: string; to: string; distance: number; time: number }> = [];

		// Calculate from GPS location to first job
		if (gpsLocation && jobs.length > 0) {
			const firstJobCoords = getJobCoordinates(jobs[0]);
			if (firstJobCoords) {
				const distance = calculateHaversineDistance(
					gpsLocation.coordinates,
					firstJobCoords,
				);
				totalDistance += distance;
				segments.push({
					from: "Current Location",
					to: jobs[0].customer?.name || "Job 1",
					distance,
					time: estimateTravelTime(distance),
				});
			}
		}

		// Calculate between jobs
		for (let i = 0; i < jobs.length - 1; i++) {
			const fromCoords = getJobCoordinates(jobs[i]);
			const toCoords = getJobCoordinates(jobs[i + 1]);
			if (fromCoords && toCoords) {
				const distance = calculateHaversineDistance(fromCoords, toCoords);
				totalDistance += distance;
				segments.push({
					from: jobs[i].customer?.name || `Job ${i + 1}`,
					to: jobs[i + 1].customer?.name || `Job ${i + 2}`,
					distance,
					time: estimateTravelTime(distance),
				});
			}
		}

		const totalTime = segments.reduce((sum, seg) => sum + seg.time, 0);

		return {
			totalDistance,
			totalTime,
			segments,
		};
	}, [jobs, gpsLocation]);

	return (
		<div className={cn("relative h-full w-full", className)}>
			{/* Map Container */}
			<div ref={mapContainerRef} className="h-full w-full" />

			{/* Route Info Overlay */}
			{routeStats && (
				<Card className="absolute bottom-4 left-4 right-4 z-10 max-w-md">
					<CardContent className="p-4">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold text-sm">Route Summary</h3>
								<Badge variant="outline" className="text-xs">
									{jobs.length} {jobs.length === 1 ? "job" : "jobs"}
								</Badge>
							</div>

							<div className="grid grid-cols-2 gap-3 text-xs">
								<div>
									<p className="text-muted-foreground">Total Distance</p>
									<p className="font-semibold">
										{(routeStats.totalDistance / 1609.34).toFixed(1)} mi
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">Total Travel Time</p>
									<p className="font-semibold">
										{Math.round(routeStats.totalTime / 60)} min
									</p>
								</div>
							</div>

							{routeStats.segments.length > 0 && (
								<div className="space-y-2 border-t pt-3">
									<p className="text-xs font-medium text-muted-foreground">
										Route Segments
									</p>
									<div className="space-y-1.5 max-h-32 overflow-y-auto">
										{routeStats.segments.map((seg, idx) => (
											<div
												key={idx}
												className="flex items-center justify-between text-xs"
											>
												<div className="flex items-center gap-2 min-w-0 flex-1">
													<Navigation className="h-3 w-3 shrink-0 text-muted-foreground" />
													<span className="truncate">
														{seg.from} → {seg.to}
													</span>
												</div>
												<div className="flex items-center gap-3 shrink-0 ml-2">
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<span className="text-muted-foreground">
																	{(seg.distance / 1609.34).toFixed(1)} mi
																</span>
															</TooltipTrigger>
															<TooltipContent>
																Distance: {(seg.distance / 1609.34).toFixed(2)} miles
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<span className="text-muted-foreground">
																	<Clock className="inline h-3 w-3 mr-1" />
																	{Math.round(seg.time / 60)}m
																</span>
															</TooltipTrigger>
															<TooltipContent>
																Travel time: {Math.round(seg.time / 60)} minutes
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* GPS Status Indicator */}
			{gpsLocation && (
				<Card className="absolute top-4 right-4 z-10">
					<CardContent className="p-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
										<span className="text-xs font-medium">Live</span>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p className="text-xs">
										Last update: {lastGpsUpdate ? format(lastGpsUpdate, "h:mm:ss a") : "Never"}
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

