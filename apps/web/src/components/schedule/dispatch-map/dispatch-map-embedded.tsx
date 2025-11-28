"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DispatchMapView } from "@/app/(dashboard)/dashboard/schedule/dispatch-map/dispatch-map-view";
import { DispatchMapSkeleton } from "@/components/schedule/dispatch-map/map-skeleton";
import {
	fetchDispatchMapData,
	type DispatchMapData,
} from "@/lib/dispatch-map-data";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { createClient } from "@/lib/supabase/client";

export function DispatchMapEmbedded() {
	const companyId = useScheduleStore((state) => state.companyId);
	const [data, setData] = useState<DispatchMapData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const activeControllerRef = useRef<AbortController | null>(null);

	const loadMapData = useCallback(
		async (signal: AbortSignal) => {
			if (!companyId || signal.aborted) return;

			setIsLoading(true);
			setError(null);

			try {
				const supabase = createClient();
				if (!supabase) {
					throw new Error("Unable to initialize database client.");
				}

				const mapData = await fetchDispatchMapData(supabase, companyId);
				if (signal.aborted) return;
				setData(mapData);
			} catch (err) {
				if (signal.aborted) return;
				setError(
					err instanceof Error
						? err.message
						: "Unable to load dispatch map data.",
				);
			} finally {
				if (signal.aborted) return;
				setIsLoading(false);
			}
		},
		[companyId],
	);

	const startFetch = useCallback(() => {
		if (!companyId) return;
		const controller = new AbortController();
		activeControllerRef.current?.abort();
		activeControllerRef.current = controller;
		void loadMapData(controller.signal);
	}, [companyId, loadMapData]);

	useEffect(() => {
		startFetch();
		return () => activeControllerRef.current?.abort();
	}, [startFetch]);

	if (!companyId) {
		return (
			<div className="flex h-full items-center justify-center bg-muted/30">
				<p className="text-sm text-muted-foreground">
					Select a company to view the dispatch map.
				</p>
			</div>
		);
	}

	if (isLoading && !data) {
		return <DispatchMapSkeleton />;
	}

	if (error && !data) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-3 bg-muted/30 p-4 text-center">
				<p className="text-sm text-muted-foreground">{error}</p>
				<button
					className="text-primary text-sm font-medium underline underline-offset-4"
					onClick={startFetch}
					type="button"
				>
					Try again
				</button>
			</div>
		);
	}

	if (!data) {
		return <DispatchMapSkeleton />;
	}

	return (
		<div className="relative h-full w-full">
			<DispatchMapView {...data} />
			{isLoading && (
				<div className="pointer-events-none absolute inset-0 bg-background/40" />
			)}
		</div>
	);
}
