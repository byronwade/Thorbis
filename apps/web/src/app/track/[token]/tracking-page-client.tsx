"use client";

/**
 * Customer Tracking Page Client Component
 *
 * Real-time tracking view for customers showing:
 * - Technician info and photo
 * - Live ETA countdown
 * - Optional map with technician location
 * - Status updates
 */

import {
	Car,
	CheckCircle2,
	Clock,
	MapPin,
	Phone,
	RefreshCw,
	User,
	XCircle,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { TrackingLinkPublicView } from "@/lib/customer-tracking/types";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type TrackingPageClientProps = {
	initialData: TrackingLinkPublicView;
	token: string;
};

// ============================================================================
// Component
// ============================================================================

export function TrackingPageClient({
	initialData,
	token,
}: TrackingPageClientProps) {
	const [data, setData] = useState(initialData);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [countdown, setCountdown] = useState(data.etaMinutes || 0);
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<google.maps.Map | null>(null);
	const techMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
		null,
	);

	// Refresh data periodically
	const refreshData = useCallback(async () => {
		setIsRefreshing(true);
		try {
			const response = await fetch(`/api/track/${token}`);
			if (response.ok) {
				const newData = await response.json();
				setData(newData);
				if (newData.etaMinutes) {
					setCountdown(newData.etaMinutes);
				}
			}
		} catch (error) {
			console.error("Failed to refresh tracking data:", error);
		} finally {
			setIsRefreshing(false);
		}
	}, [token]);

	// Auto-refresh every 30 seconds for active status
	useEffect(() => {
		if (data.status !== "active") return;

		const interval = setInterval(refreshData, 30000);
		return () => clearInterval(interval);
	}, [data.status, refreshData]);

	// Countdown timer
	useEffect(() => {
		if (data.status !== "active" || !countdown) return;

		const timer = setInterval(() => {
			setCountdown((prev) => Math.max(0, prev - 1));
		}, 60000); // Update every minute

		return () => clearInterval(timer);
	}, [data.status, countdown]);

	// Initialize map
	useEffect(() => {
		if (
			!mapContainerRef.current ||
			!window.google?.maps ||
			!data.technicianLocation
		) {
			return;
		}

		const initMap = async () => {
			const { Map } = (await google.maps.importLibrary(
				"maps",
			)) as google.maps.MapsLibrary;
			const { AdvancedMarkerElement } = (await google.maps.importLibrary(
				"marker",
			)) as google.maps.MarkerLibrary;

			const map = new Map(mapContainerRef.current!, {
				center: data.technicianLocation,
				zoom: 14,
				mapId: "tracking-map",
				disableDefaultUI: true,
				zoomControl: true,
				gestureHandling: "cooperative",
			});

			mapRef.current = map;

			// Add technician marker
			const markerContent = document.createElement("div");
			markerContent.className = "relative";
			markerContent.innerHTML = `
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg ring-4 ring-white">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
						<circle cx="7" cy="17" r="2"/>
						<path d="M9 17h6"/>
						<circle cx="17" cy="17" r="2"/>
					</svg>
				</div>
				<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-blue-500"></div>
			`;

			techMarkerRef.current = new AdvancedMarkerElement({
				map,
				position: data.technicianLocation,
				content: markerContent,
				title: data.technicianName,
			});
		};

		if (window.google?.maps) {
			initMap();
		}
	}, [data.technicianLocation, data.technicianName]);

	// Update marker position when location changes
	useEffect(() => {
		if (techMarkerRef.current && data.technicianLocation) {
			techMarkerRef.current.position = data.technicianLocation;
			mapRef.current?.panTo(data.technicianLocation);
		}
	}, [data.technicianLocation]);

	const statusConfig = {
		pending: {
			icon: Clock,
			color: "text-blue-500",
			bgColor: "bg-blue-50",
		},
		active: {
			icon: Car,
			color: "text-amber-500",
			bgColor: "bg-amber-50",
		},
		arrived: {
			icon: MapPin,
			color: "text-green-500",
			bgColor: "bg-green-50",
		},
		completed: {
			icon: CheckCircle2,
			color: "text-green-500",
			bgColor: "bg-green-50",
		},
		cancelled: {
			icon: XCircle,
			color: "text-red-500",
			bgColor: "bg-red-50",
		},
		expired: {
			icon: XCircle,
			color: "text-gray-500",
			bgColor: "bg-gray-50",
		},
	};

	const status = statusConfig[data.status] || statusConfig.pending;
	const StatusIcon = status.icon;

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
			{/* Header */}
			<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto flex items-center justify-between px-4 py-3">
					<div className="flex items-center gap-3">
						{data.companyLogo ? (
							<Image
								src={data.companyLogo}
								alt={data.companyName}
								width={40}
								height={40}
								className="rounded-lg"
							/>
						) : (
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<span className="text-lg font-bold text-primary">
									{data.companyName.charAt(0)}
								</span>
							</div>
						)}
						<div>
							<h1 className="font-semibold">{data.companyName}</h1>
							<p className="text-xs text-muted-foreground">
								Appointment Tracking
							</p>
						</div>
					</div>
					{data.companyPhone && (
						<Button variant="outline" size="sm" asChild>
							<a href={`tel:${data.companyPhone}`}>
								<Phone className="mr-2 h-4 w-4" />
								Call
							</a>
						</Button>
					)}
				</div>
			</header>

			<main className="container mx-auto max-w-lg space-y-4 px-4 py-6">
				{/* Status Card */}
				<Card>
					<CardContent className="pt-6">
						<div
							className={cn(
								"mx-auto flex h-16 w-16 items-center justify-center rounded-full",
								status.bgColor,
							)}
						>
							<StatusIcon className={cn("h-8 w-8", status.color)} />
						</div>
						<p className="mt-4 text-center text-lg font-medium">
							{data.statusMessage}
						</p>
						<p className="mt-1 text-center text-sm text-muted-foreground">
							Last updated: {data.lastUpdate}
						</p>
					</CardContent>
				</Card>

				{/* ETA Card (only show if active) */}
				{data.status === "active" && countdown > 0 && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Estimated Arrival
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-baseline justify-center gap-2">
								<span className="text-5xl font-bold tabular-nums">
									{countdown}
								</span>
								<span className="text-xl text-muted-foreground">min</span>
							</div>
							{data.estimatedArrival && (
								<p className="mt-2 text-center text-sm text-muted-foreground">
									Arriving around {data.estimatedArrival}
								</p>
							)}
							{data.distanceRemainingMiles && (
								<p className="mt-1 text-center text-xs text-muted-foreground">
									{data.distanceRemainingMiles.toFixed(1)} miles away
								</p>
							)}
							<div className="mt-4">
								<Progress value={Math.max(0, 100 - countdown * 2)} />
							</div>
						</CardContent>
					</Card>
				)}

				{/* Map (only show if location available) */}
				{data.technicianLocation && data.status === "active" && (
					<Card className="overflow-hidden">
						<div
							ref={mapContainerRef}
							className="h-48 w-full bg-muted"
							style={{ minHeight: "200px" }}
						>
							{!window.google?.maps && (
								<div className="flex h-full items-center justify-center">
									<p className="text-sm text-muted-foreground">
										Loading map...
									</p>
								</div>
							)}
						</div>
					</Card>
				)}

				{/* Technician Card */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Your Technician
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-4">
							<Avatar className="h-16 w-16">
								{data.technicianPhoto && (
									<AvatarImage
										src={data.technicianPhoto}
										alt={data.technicianName}
									/>
								)}
								<AvatarFallback className="bg-primary/10 text-lg">
									{data.technicianName
										.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="text-lg font-semibold">{data.technicianName}</p>
								{data.technicianStatus && (
									<Badge variant="secondary" className="mt-1">
										{data.technicianStatus === "en-route"
											? "On the way"
											: data.technicianStatus === "arriving-soon"
												? "Almost there"
												: data.technicianStatus === "arrived"
													? "Has arrived"
													: "Working on your service"}
									</Badge>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Appointment Details */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Appointment Details
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-start gap-3">
							<Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
							<div>
								<p className="font-medium">{data.appointmentDate}</p>
								<p className="text-sm text-muted-foreground">
									{data.scheduledWindow}
								</p>
							</div>
						</div>
						{data.serviceType && (
							<div className="flex items-start gap-3">
								<User className="mt-0.5 h-4 w-4 text-muted-foreground" />
								<p className="font-medium">{data.serviceType}</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Refresh Button */}
				{data.status === "active" && (
					<Button
						variant="outline"
						className="w-full"
						onClick={refreshData}
						disabled={isRefreshing}
					>
						{isRefreshing ? (
							<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<RefreshCw className="mr-2 h-4 w-4" />
						)}
						Refresh Status
					</Button>
				)}
			</main>

			{/* Footer */}
			<footer className="border-t bg-muted/30 py-4 text-center">
				<p className="text-xs text-muted-foreground">
					Powered by Stratos Field Service
				</p>
			</footer>
		</div>
	);
}
