/**
 * Invoice Options Sidebar - Right Sidebar
 *
 * Integrated with layout config system.
 * Comprehensive options for invoice customization:
 * - PDF layout templates
 * - Line items management
 * - Design/theme options
 * - Customer view settings
 * - Email/sharing options
 *
 * This component is rendered by the layout system and doesn't need props.
 */

"use client";

import {
  ChevronDown,
  Eye,
  FileText,
  Mail,
  Palette,
  Plus,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

// PDF Layout Templates
const PDF_LAYOUTS = [
  {
    id: "modern",
    name: "Modern Clean",
    description: "Minimalist design with clean lines",
    preview: "/templates/modern.png",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Traditional business invoice layout",
    preview: "/templates/professional.png",
  },
  {
    id: "contractor",
    name: "Contractor",
    description: "Optimized for construction/trade work",
    preview: "/templates/contractor.png",
  },
  {
    id: "service",
    name: "Service-Based",
    description: "Best for service businesses",
    preview: "/templates/service.png",
  },
  {
    id: "commercial",
    name: "Commercial",
    description: "Large commercial projects",
    preview: "/templates/commercial.png",
  },
  {
    id: "detailed",
    name: "Detailed Breakdown",
    description: "Itemized with material/labor breakdown",
    preview: "/templates/detailed.png",
  },
];

export function InvoiceOptionsSidebar() {
  const pathname = usePathname();
  const [selectedLayout, setSelectedLayout] = useState("modern");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showItemCodes, setShowItemCodes] = useState(false);
  const [showSubtotals, setShowSubtotals] = useState(true);
  const [brandingOpacity, setBrandingOpacity] = useState([80]);
  const [layoutOpen, setLayoutOpen] = useState(true);
  const [designOpen, setDesignOpen] = useState(false);
  const [itemsOpen, setItemsOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);

  // Get invoice ID from pathname
  const invoiceId = pathname.split("/").pop() || "";

  const handleLayoutChange = (layoutId: string) => {
    setSelectedLayout(layoutId);
    toast.success(`Layout changed to ${layoutId}`);
  };

  const handleAddLineItem = () => {
    // TODO: Implement via context or store
    toast.success("Add line item functionality coming soon");
  };

  return (
    <Sidebar collapsible="offcanvas" side="right" variant="sidebar">
      {/* Sidebar Header */}
      <SidebarHeader className="border-b">
        <div className="p-4">
          <h2 className="font-semibold text-lg">Invoice Options</h2>
          <p className="text-muted-foreground text-sm">
            Customize layout and design
          </p>
        </div>
      </SidebarHeader>

      {/* Scrollable Content */}
      <SidebarContent>
        <SidebarGroup>
          <div className="space-y-4 p-4">
            {/* PDF Layout Templates */}
            <Collapsible onOpenChange={setLayoutOpen} open={layoutOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  className="flex w-full justify-between p-0"
                  variant="ghost"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">PDF Layout</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${layoutOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <Select
                  onValueChange={handleLayoutChange}
                  value={selectedLayout}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {PDF_LAYOUTS.map((layout) => (
                      <SelectItem key={layout.id} value={layout.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{layout.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {layout.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Selected Layout Preview */}
                <Card className="p-3">
                  <div className="aspect-[8.5/11] rounded-sm border bg-muted" />
                  <p className="mt-2 text-center text-muted-foreground text-xs">
                    {
                      PDF_LAYOUTS.find((l) => l.id === selectedLayout)
                        ?.description
                    }
                  </p>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Design Options */}
            <Collapsible onOpenChange={setDesignOpen} open={designOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  className="flex w-full justify-between p-0"
                  variant="ghost"
                >
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span className="font-medium">Design</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${designOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-4">
                {/* Color Theme */}
                <div className="space-y-2">
                  <Label className="text-sm">Color Theme</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-purple-500",
                      "bg-red-500",
                      "bg-orange-500",
                      "bg-gray-500",
                    ].map((color) => (
                      <button
                        className={`h-8 w-8 rounded-md border-2 border-transparent hover:border-primary ${color}`}
                        key={color}
                        type="button"
                      />
                    ))}
                  </div>
                </div>

                {/* Logo/Branding */}
                <div className="space-y-2">
                  <Label className="text-sm">Logo Opacity</Label>
                  <Slider
                    className="w-full"
                    max={100}
                    min={0}
                    onValueChange={setBrandingOpacity}
                    step={10}
                    value={brandingOpacity}
                  />
                  <p className="text-muted-foreground text-xs">
                    {brandingOpacity[0]}%
                  </p>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <Label className="text-sm">Font Size</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Line Items Options */}
            <Collapsible onOpenChange={setItemsOpen} open={itemsOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  className="flex w-full justify-between p-0"
                  variant="ghost"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">Line Items</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${itemsOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Show Line Numbers</Label>
                  <Switch
                    checked={showLineNumbers}
                    onCheckedChange={setShowLineNumbers}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Show Item Codes</Label>
                  <Switch
                    checked={showItemCodes}
                    onCheckedChange={setShowItemCodes}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Show Subtotals</Label>
                  <Switch
                    checked={showSubtotals}
                    onCheckedChange={setShowSubtotals}
                  />
                </div>

                <Separator />

                <Button
                  className="w-full"
                  onClick={handleAddLineItem}
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Line Item
                </Button>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Customer View Options */}
            <Collapsible onOpenChange={setCustomerOpen} open={customerOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  className="flex w-full justify-between p-0"
                  variant="ghost"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">Customer View</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${customerOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Allow Online Payment</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Show Payment Methods</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Enable Comments</Label>
                  <Switch />
                </div>

                <Separator />

                <Button className="w-full" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Customer View
                </Button>

                <Button className="w-full" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Test Email
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer - Quick Actions */}
      <SidebarFooter className="border-t">
        <div className="space-y-2 p-4">
          <Button className="w-full" size="sm">
            Apply Changes
          </Button>
          <Button className="w-full" size="sm" variant="ghost">
            Reset to Default
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
