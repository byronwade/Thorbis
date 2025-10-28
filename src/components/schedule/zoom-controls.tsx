"use client"

import { Minus, Plus, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useViewStore } from "@/stores/view-store"

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
  const { zoom, setZoom, zoomIn, zoomOut, resetZoom } = useViewStore()

  // Calculate zoom level description
  const getZoomDescription = (zoomLevel: number): string => {
    if (zoomLevel < 50) return "Year/Quarter"
    if (zoomLevel < 100) return "Monthly"
    if (zoomLevel < 200) return "Weekly"
    if (zoomLevel < 400) return "Daily"
    return "Hourly"
  }

  const handleSliderChange = (value: number[]) => {
    setZoom(value[0])
  }

  return (
    <div className="flex items-center gap-2">
      {/* Zoom Out Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={zoomOut}
        disabled={zoom <= 5}
        className="h-8 w-8"
        title="Zoom Out"
      >
        <Minus className="h-4 w-4" />
      </Button>

      {/* Zoom Slider */}
      <div className="flex items-center gap-2 w-32">
        <Slider
          value={[zoom]}
          min={5}
          max={500}
          step={5}
          onValueChange={handleSliderChange}
          className="flex-1"
          title={`Zoom: ${Math.round(zoom)}%`}
        />
      </div>

      {/* Zoom In Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={zoomIn}
        disabled={zoom >= 500}
        className="h-8 w-8"
        title="Zoom In"
      >
        <Plus className="h-4 w-4" />
      </Button>

      {/* Zoom Level Indicator */}
      <div className="flex items-center gap-2 px-2 py-1 rounded-md border bg-muted/50 min-w-[140px]">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          {getZoomDescription(zoom)}
        </span>
      </div>

      {/* Reset Zoom Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={resetZoom}
        className="h-8 px-2 text-xs"
        title="Reset to 100%"
      >
        {Math.round(zoom)}%
      </Button>
    </div>
  )
}
