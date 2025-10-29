"use client";

/**
 * Invoice Sidebar Right - Client Component
 *
 * Right-positioned sidebar for invoice customization that matches
 * the left app-sidebar design using shadcn/ui Sidebar component.
 *
 * Features:
 * - Template presets
 * - Color customization
 * - Typography settings
 * - Layout controls
 *
 * Performance optimizations:
 * - Zustand for state management
 * - Selective re-renders with shallow selectors
 * - Uses established sidebar patterns
 */

import { Layout, Palette, RotateCcw, Settings2, Sparkles, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Slider } from "@/components/ui/slider";
import {
  type FontFamily,
  INVOICE_PRESETS,
  type SpacingMode,
  useInvoiceLayoutStore,
} from "@/lib/stores/invoice-layout-store";

// ============================================================================
// Invoice Sidebar Right Component
// ============================================================================

export function InvoiceSidebarRight() {
  const customization = useInvoiceLayoutStore((state) => state.customization);
  const loadPreset = useInvoiceLayoutStore((state) => state.loadPreset);
  const updateColors = useInvoiceLayoutStore((state) => state.updateColors);
  const updateTypography = useInvoiceLayoutStore(
    (state) => state.updateTypography
  );
  const updateSpacing = useInvoiceLayoutStore((state) => state.updateSpacing);
  const updateLogo = useInvoiceLayoutStore((state) => state.updateLogo);
  const updateLogoPosition = useInvoiceLayoutStore(
    (state) => state.updateLogoPosition
  );
  const updateLogoSize = useInvoiceLayoutStore((state) => state.updateLogoSize);
  const updateBorderSettings = useInvoiceLayoutStore(
    (state) => state.updateBorderSettings
  );
  const resetToDefault = useInvoiceLayoutStore((state) => state.resetToDefault);

  return (
    <Sidebar collapsible="offcanvas" side="right" variant="inset">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="rounded-lg bg-primary/10 p-2">
            <Settings2 className="size-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Customize Invoice</span>
            <span className="text-muted-foreground text-xs">
              Design & Layout
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Templates Group */}
        <SidebarGroup>
          <div className="flex items-center gap-2 px-2">
            <Sparkles className="size-4 text-muted-foreground" />
            <SidebarGroupLabel>Templates</SidebarGroupLabel>
          </div>
          <div className="space-y-2 px-2">
            {INVOICE_PRESETS.map((preset) => (
              <button
                className={`group relative w-full overflow-hidden rounded-lg border p-3 text-left transition-all hover:border-primary hover:shadow-md ${
                  customization.template === preset.template
                    ? "border-primary bg-primary/5 shadow-md"
                    : "hover:bg-accent/50"
                }`}
                key={preset.id}
                onClick={() => loadPreset(preset)}
                type="button"
              >
                {customization.template === preset.template ? (
                  <div className="absolute top-2 right-2 rounded-full bg-primary p-1">
                    <svg
                      className="size-3 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ) : null}
                <div className="font-medium text-sm">{preset.name}</div>
                <div className="mt-1 text-muted-foreground text-xs leading-relaxed">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Colors Group */}
        <SidebarGroup>
          <div className="flex items-center gap-2 px-2">
            <Palette className="size-4 text-muted-foreground" />
            <SidebarGroupLabel>Colors</SidebarGroupLabel>
          </div>
          <div className="space-y-3 px-2">
            <div>
              <Label className="text-xs" htmlFor="primary-color">
                Primary Color
              </Label>
              <Input
                className="h-9"
                id="primary-color"
                onChange={(e) => updateColors({ primary: e.target.value })}
                type="color"
                value={customization.colors.primary}
              />
            </div>

            <div>
              <Label className="text-xs" htmlFor="accent-color">
                Accent Color
              </Label>
              <Input
                className="h-9"
                id="accent-color"
                onChange={(e) => updateColors({ accent: e.target.value })}
                type="color"
                value={customization.colors.accent}
              />
            </div>

            <div>
              <Label className="text-xs" htmlFor="text-color">
                Text Color
              </Label>
              <Input
                className="h-9"
                id="text-color"
                onChange={(e) => updateColors({ text: e.target.value })}
                type="color"
                value={customization.colors.text}
              />
            </div>

            <div>
              <Label className="text-xs" htmlFor="text-light-color">
                Secondary Text
              </Label>
              <Input
                className="h-9"
                id="text-light-color"
                onChange={(e) => updateColors({ textLight: e.target.value })}
                type="color"
                value={customization.colors.textLight}
              />
            </div>

            <div>
              <Label className="text-xs" htmlFor="background-color">
                Background
              </Label>
              <Input
                className="h-9"
                id="background-color"
                onChange={(e) => updateColors({ background: e.target.value })}
                type="color"
                value={customization.colors.background}
              />
            </div>

            <div>
              <Label className="text-xs" htmlFor="border-color">
                Border Color
              </Label>
              <Input
                className="h-9"
                id="border-color"
                onChange={(e) => updateColors({ border: e.target.value })}
                type="color"
                value={customization.colors.border}
              />
            </div>
          </div>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Typography Group */}
        <SidebarGroup>
          <div className="flex items-center gap-2 px-2">
            <Type className="size-4 text-muted-foreground" />
            <SidebarGroupLabel>Typography</SidebarGroupLabel>
          </div>
          <div className="space-y-3 px-2">
            <div>
              <Label className="text-xs" htmlFor="heading-font">
                Heading Font
              </Label>
              <Select
                onValueChange={(value) =>
                  updateTypography({ headingFont: value as FontFamily })
                }
                value={customization.typography.headingFont}
              >
                <SelectTrigger className="h-9" id="heading-font">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geist-sans">Geist Sans</SelectItem>
                  <SelectItem value="geist-mono">Geist Mono</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs" htmlFor="body-font">
                Body Font
              </Label>
              <Select
                onValueChange={(value) =>
                  updateTypography({ bodyFont: value as FontFamily })
                }
                value={customization.typography.bodyFont}
              >
                <SelectTrigger className="h-9" id="body-font">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geist-sans">Geist Sans</SelectItem>
                  <SelectItem value="geist-mono">Geist Mono</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs" htmlFor="heading-size">
                Heading Size
              </Label>
              <Slider
                className="mt-2"
                id="heading-size"
                max={3}
                min={1}
                onValueChange={([value]) =>
                  updateTypography({ headingSize: value })
                }
                step={0.1}
                value={[customization.typography.headingSize]}
              />
              <span className="text-muted-foreground text-xs">
                {customization.typography.headingSize.toFixed(1)}rem
              </span>
            </div>

            <div>
              <Label className="text-xs" htmlFor="body-size">
                Body Size
              </Label>
              <Slider
                className="mt-2"
                id="body-size"
                max={1.5}
                min={0.75}
                onValueChange={([value]) =>
                  updateTypography({ bodySize: value })
                }
                step={0.05}
                value={[customization.typography.bodySize]}
              />
              <span className="text-muted-foreground text-xs">
                {customization.typography.bodySize.toFixed(2)}rem
              </span>
            </div>
          </div>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Layout Group */}
        <SidebarGroup>
          <div className="flex items-center gap-2 px-2">
            <Layout className="size-4 text-muted-foreground" />
            <SidebarGroupLabel>Layout Settings</SidebarGroupLabel>
          </div>
          <div className="space-y-3 px-2">
            <div>
              <Label className="text-xs" htmlFor="spacing">
                Spacing
              </Label>
              <Select
                onValueChange={(value) => updateSpacing(value as SpacingMode)}
                value={customization.spacing}
              >
                <SelectTrigger className="h-9" id="spacing">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="relaxed">Relaxed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <Label className="text-xs" htmlFor="logo-url">
                Logo URL
              </Label>
              <Input
                className="h-9"
                id="logo-url"
                onChange={(e) => updateLogo(e.target.value)}
                placeholder="https://example.com/logo.png"
                type="url"
                value={customization.logo || ""}
              />
            </div>

            <div>
              <Label className="text-xs" htmlFor="logo-position">
                Logo Position
              </Label>
              <Select
                onValueChange={(value) =>
                  updateLogoPosition(value as "left" | "center" | "right")
                }
                value={customization.logoPosition}
              >
                <SelectTrigger className="h-9" id="logo-position">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs" htmlFor="logo-size">
                Logo Size
              </Label>
              <Slider
                className="mt-2"
                id="logo-size"
                max={200}
                min={60}
                onValueChange={([value]) => updateLogoSize(value)}
                step={10}
                value={[customization.logoSize]}
              />
              <span className="text-muted-foreground text-xs">
                {customization.logoSize}px
              </span>
            </div>

            <Separator />

            <div>
              <Label className="text-xs" htmlFor="border-radius">
                Border Radius
              </Label>
              <Slider
                className="mt-2"
                id="border-radius"
                max={24}
                min={0}
                onValueChange={([value]) =>
                  updateBorderSettings(
                    customization.showBorder,
                    value,
                    customization.shadowEnabled
                  )
                }
                step={1}
                value={[customization.borderRadius]}
              />
              <span className="text-muted-foreground text-xs">
                {customization.borderRadius}px
              </span>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="p-2">
          <Button
            className="w-full gap-2"
            onClick={() => resetToDefault()}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="size-4" />
            Reset to Default
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
