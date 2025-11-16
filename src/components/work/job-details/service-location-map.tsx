"use client";

import { MapPin, Maximize2, Store } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

type Supplier = {
	name: string;
	distance: number;
	lat: number;
	lon: number;
};

type ServiceLocationMapProps = {
	address: {
		street: string;
		city: string;
		state: string;
		zipCode: string;
		full: string;
	};
	lat: number;
	lon: number;
	nearbySuppliers?: Supplier[];
};

// Global state for Google Maps script loading
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

		const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');

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

export function ServiceLocationMap({ address, lat, lon, nearbySuppliers = [] }: ServiceLocationMapProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const compactMapRef = useRef<HTMLDivElement>(null);
	const expandedMapRef = useRef<HTMLDivElement>(null);
	const compactMapInstance = useRef<google.maps.Map | null>(null);
	const expandedMapInstance = useRef<google.maps.Map | null>(null);

	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

	// Initialize compact map
	useEffect(() => {
		if (!apiKey) {
			setError("Google Maps API key not configured");
			setIsLoading(false);
			return;
		}

		// Skip if already initialized
		if (compactMapInstance.current) {
			setIsLoading(false);
			return;
		}

		let isMounted = true;
		let timeoutId: NodeJS.Timeout | null = null;
		const MAX_RETRIES = 50; // 5 seconds max (50 * 100ms)
		let retryCount = 0;

		const attemptInit = () => {
			if (!isMounted) {
				return;
			}

			if (!compactMapRef.current) {
				retryCount++;
				if (retryCount >= MAX_RETRIES) {
					setError("Failed to initialize map");
					setIsLoading(false);
					return;
				}
				timeoutId = setTimeout(attemptInit, 100);
				return;
			}
			loadGoogleMapsScript(apiKey)
				.then(() => {
					if (!isMounted) {
						return;
					}
					if (compactMapRef.current && !compactMapInstance.current) {
						initMap(compactMapRef.current, false);
					}
				})
				.catch((_err) => {
					if (!isMounted) {
						return;
					}
					setError("Failed to load Google Maps");
				})
				.finally(() => {
					if (!isMounted) {
						return;
					}
					setIsLoading(false);
				});
		};

		attemptInit();

		// Cleanup function
		return () => {
			isMounted = false;
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [apiKey, initMap]);

	// Initialize expanded map when dialog opens
	useEffect(() => {
		if (isExpanded && expandedMapRef.current && !expandedMapInstance.current) {
			initMap(expandedMapRef.current, true);
		}
	}, [isExpanded, initMap]);

	const initMap = (container: HTMLDivElement, isExpanded: boolean) => {
		if (!window.google?.maps) {
			return;
		}
		const map = new google.maps.Map(container, {
			center: { lat, lng: lon },
			zoom: isExpanded ? 13 : 12,
			mapTypeControl: false,
			streetViewControl: false,
			fullscreenControl: isExpanded,
		});

		// Add job location marker (red)
		new google.maps.Marker({
			position: { lat, lng: lon },
			map,
			title: address.full,
			icon: {
				path: google.maps.SymbolPath.CIRCLE,
				scale: 8,
				fillColor: "#ef4444",
				fillOpacity: 1,
				strokeColor: "#f3f7fd",
				strokeWeight: 2,
			},
			label: {
				text: "📍",
				fontSize: "18px",
			},
		});

		// Add supplier markers (blue)
		const bounds = new google.maps.LatLngBounds();
		bounds.extend({ lat, lng: lon });

		for (const supplier of nearbySuppliers) {
			const marker = new google.maps.Marker({
				position: { lat: supplier.lat, lng: supplier.lon },
				map,
				title: supplier.name,
				icon: {
					path: google.maps.SymbolPath.CIRCLE,
					scale: 6,
					fillColor: "#3b82f6",
					fillOpacity: 0.8,
					strokeColor: "#f3f7fd",
					strokeWeight: 2,
				},
			});

			// Info window for suppliers
			const infoWindow = new google.maps.InfoWindow({
				content: `
          <div style="padding: 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${supplier.name}</div>
            <div style="font-size: 12px; color: #666;">
              ${(supplier.distance / 1000).toFixed(1)} km away
            </div>
          </div>
        `,
			});

			marker.addListener("click", () => {
				infoWindow.open(map, marker);
			});

			bounds.extend({ lat: supplier.lat, lng: supplier.lon });
		}

		// Fit map to show all markers
		if (nearbySuppliers.length > 0) {
			map.fitBounds(bounds);
		}

		if (isExpanded) {
			expandedMapInstance.current = map;
		} else {
			compactMapInstance.current = map;
		}
	};

	if (error) {
		return (
			<div className="flex items-center gap-2 rounded-lg border border-muted p-4 text-muted-foreground text-sm">
				<MapPin className="h-4 w-4" />
				<span>Map unavailable: {error}</span>
			</div>
		);
	}

	return (
		<>
			{/* Compact Map Card */}
			<div className="group relative overflow-hidden rounded-lg border bg-card">
				{/* Map Container */}
				<div className="relative h-[180px] w-full">
					<div className="h-full w-full" ref={compactMapRef} />
					{isLoading && <Skeleton className="absolute inset-0 h-full w-full" />}

					{/* Overlay Info */}
					<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<div className="mb-1 flex items-center gap-2">
									<MapPin className="h-4 w-4 text-white" />
									<span className="font-semibold text-sm text-white">Service Location</span>
									{nearbySuppliers.length > 0 && (
										<Badge className="h-5 bg-primary/80 text-[10px] text-white" variant="secondary">
											<Store className="mr-1 h-3 w-3" />
											{nearbySuppliers.length} suppliers
										</Badge>
									)}
								</div>
								<p className="text-white/90 text-xs">{address.street}</p>
								<p className="text-white/80 text-xs">
									{address.city}, {address.state} {address.zipCode}
								</p>
							</div>
							<Button
								className="h-8 w-8 bg-card/90 hover:bg-card"
								onClick={() => setIsExpanded(true)}
								size="icon"
								variant="ghost"
							>
								<Maximize2 className="h-4 w-4 text-foreground" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Expanded Map Dialog */}
			<Dialog onOpenChange={setIsExpanded} open={isExpanded}>
				<DialogContent className="max-w-4xl p-0">
					<DialogHeader className="border-b p-4">
						<DialogTitle className="flex items-center gap-2">
							<MapPin className="h-5 w-5 text-primary" />
							Service Location Map
						</DialogTitle>
						<div className="mt-2 text-muted-foreground text-sm">
							<p className="font-medium text-foreground">{address.street}</p>
							<p>
								{address.city}, {address.state} {address.zipCode}
							</p>
						</div>
					</DialogHeader>

					{/* Map */}
					<div className="h-[600px] w-full" ref={expandedMapRef} />

					{/* Legend */}
					<div className="border-t p-4">
						<div className="flex items-center gap-6 text-sm">
							<div className="flex items-center gap-2">
								<div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive">
									<MapPin className="h-4 w-4 text-white" />
								</div>
								<span>Service Location</span>
							</div>
							{nearbySuppliers.length > 0 && (
								<div className="flex items-center gap-2">
									<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
										<Store className="h-4 w-4 text-white" />
									</div>
									<span>Nearby Suppliers ({nearbySuppliers.length})</span>
								</div>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
