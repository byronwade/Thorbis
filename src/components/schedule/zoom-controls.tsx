"use client";

import { Calendar, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useViewStore } from "@/lib/stores/view-store";

/**
 * Zoom Controls Component
 *
 * Provides continuous zoom functionality with:
 * - Zoom slider (5% - 500%)
 * - Zoom in/out buttons
 * - Reset to 100% button
 * - Visual indicator of current zoom level
 * - Auto-adjusts time granularity
 */

export function ZoomControls() {
	const { zoom, setZoom, zoomIn, zoomOut, resetZoom } = useViewStore();

	// Calculate zoom level description
	const getZoomDescription = (zoomLevel: number): string => {
		if (zoomLevel < 50) {
			return "Year/Quarter";
		}
		if (zoomLevel < 100) {
			return "Monthly";
		}
		if (zoomLevel < 200) {
			return "Weekly";
		}
		if (zoomLevel < 400) {
			return "Daily";
		}
		return "Hourly";
	};

	const handleSliderChange = (value: number[]) => {
		setZoom(value[0]);
	};

	return (
		<div className="flex items-center gap-2">
			{/* Zoom Out Button */}
			<Button className="h-8 w-8" disabled={zoom <= 5} onClick={zoomOut} size="icon" title="Zoom Out" variant="ghost">
				<Minus className="h-4 w-4" />
			</Button>

			{/* Zoom Slider */}
			<div className="flex w-32 items-center gap-2">
				<Slider
					className="flex-1"
					max={500}
					min={5}
					onValueChange={handleSliderChange}
					step={5}
					title={`Zoom: ${Math.round(zoom)}%`}
					value={[zoom]}
				/>
			</div>

			{/* Zoom In Button */}
			<Button className="h-8 w-8" disabled={zoom >= 500} onClick={zoomIn} size="icon" title="Zoom In" variant="ghost">
				<Plus className="h-4 w-4" />
			</Button>

			{/* Zoom Level Indicator */}
			<div className="flex min-w-[140px] items-center gap-2 rounded-md border bg-muted/50 px-2 py-1">
				<Calendar className="h-3.5 w-3.5 text-muted-foreground" />
				<span className="font-medium text-muted-foreground text-xs">{getZoomDescription(zoom)}</span>
			</div>

			{/* Reset Zoom Button */}
			<Button className="h-8 px-2 text-xs" onClick={resetZoom} size="sm" title="Reset to 100%" variant="ghost">
				{Math.round(zoom)}%
			</Button>
		</div>
	);
}
