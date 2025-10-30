"use client";

/**
 * Layout Customizer - Client Component
 *
 * Provides UI for customizing the job details widget layout:
 * - Switch between industry presets
 * - Reset to defaults
 * - Display widget count
 *
 * Note: Widget addition is now handled via AddWidgetDropdown in the sidebar navigation.
 */

import {
  Blocks,
  Grid3x3,
  LayoutGrid,
  RotateCcw,
  Settings2,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ALL_PRESETS } from "@/lib/presets/job-layout-presets";
import { useJobDetailsLayoutStore } from "@/lib/stores/job-details-layout-store";

// ============================================================================
// Props Types
// ============================================================================

type LayoutCustomizerProps = {
  isEditMode?: boolean;
};

// ============================================================================
// Layout Customizer Component
// ============================================================================

export function LayoutCustomizer({
  isEditMode = false,
}: LayoutCustomizerProps = {}) {
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  const industry = useJobDetailsLayoutStore((state) => state.industry);
  const widgets = useJobDetailsLayoutStore((state) => state.widgets);
  const loadPreset = useJobDetailsLayoutStore((state) => state.loadPreset);
  const resetToDefault = useJobDetailsLayoutStore(
    (state) => state.resetToDefault
  );

  // ============================================================================
  // Handlers
  // ============================================================================

  function handleLoadPreset(presetId: string) {
    const preset = ALL_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      loadPreset(preset);
      setIsPresetsOpen(false);
    }
  }

  function handleReset() {
    if (
      confirm(
        "Reset layout to default? This will remove all customizations and restore the general contractor layout."
      )
    ) {
      resetToDefault();
    }
  }

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="flex items-center gap-2">
      {/* Preset Selector */}
      <Dialog onOpenChange={setIsPresetsOpen} open={isPresetsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <LayoutGrid className="mr-2 size-4" />
            Presets
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Layout Presets</DialogTitle>
            <DialogDescription>
              Choose a pre-configured layout optimized for your industry
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-4">
            <div className="grid gap-4 md:grid-cols-2">
              {ALL_PRESETS.map((preset) => (
                <button
                  className="group relative overflow-hidden rounded-lg border p-4 text-left transition-all hover:border-primary hover:shadow-md"
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset.id)}
                  type="button"
                >
                  {/* Current badge */}
                  {industry === preset.industry ? (
                    <Badge className="absolute top-2 right-2" variant="default">
                      Current
                    </Badge>
                  ) : null}

                  <div className="mb-2 flex items-center gap-2">
                    <Grid3x3 className="size-5 text-muted-foreground" />
                    <h3 className="font-semibold">{preset.name}</h3>
                  </div>
                  <p className="mb-3 text-muted-foreground text-sm">
                    {preset.description}
                  </p>

                  {/* Widget count */}
                  <div className="flex items-center gap-2 text-xs">
                    <Blocks className="size-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {preset.widgets.length} widgets
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Note: Add Widget moved to sidebar dropdown menu */}

      <Separator className="h-8" orientation="vertical" />

      {/* Reset */}
      <Button onClick={handleReset} size="sm" variant="ghost">
        <RotateCcw className="mr-2 size-4" />
        Reset
      </Button>

      {/* Widget Count Badge */}
      <Badge className="ml-auto" variant="secondary">
        {widgets.length} widget{widgets.length !== 1 ? "s" : ""}
      </Badge>
    </div>
  );
}

/**
 * Compact Layout Customizer for Toolbar
 */
export function CompactLayoutCustomizer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          <Settings2 className="mr-2 size-4" />
          Customize Layout
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Layout Customization</SheetTitle>
          <SheetDescription>
            Customize your job details page layout
          </SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <LayoutCustomizer />
        </div>
      </SheetContent>
    </Sheet>
  );
}
