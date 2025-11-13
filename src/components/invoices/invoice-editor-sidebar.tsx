/**
 * Invoice Editor Sidebar
 *
 * Right-side floating panel with all edit controls:
 * - Add sections (line items, tax, shipping)
 * - Price book search
 * - PDF export
 * - Customization
 *
 * Clean midday.ai-inspired design:
 * - Minimal, icon-focused
 * - Collapsible
 * - Only visible in edit mode
 */

"use client";

import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Download,
  Package,
  Palette,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface InvoiceEditorSidebarProps {
  editor: any;
  onAddLineItem: () => void;
  onAddTax: () => void;
  onAddShipping: () => void;
  onGeneratePDF?: () => void;
}

export function InvoiceEditorSidebar({
  editor,
  onAddLineItem,
  onAddTax,
  onAddShipping,
  onGeneratePDF,
}: InvoiceEditorSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [priceBookOpen, setPriceBookOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock price book (TODO: Replace with real data)
  const priceBookItems = [
    { id: "1", name: "HVAC Service Call", sku: "HVAC-001", price: 12_500 },
    { id: "2", name: "Plumbing Inspection", sku: "PLU-001", price: 8500 },
    {
      id: "3",
      name: "Electrical Wiring (per hour)",
      sku: "ELE-001",
      price: 9500,
    },
    { id: "4", name: "Labor - Standard Rate", sku: "LAB-STD", price: 7500 },
  ];

  const handleAddFromPriceBook = (item: (typeof priceBookItems)[0]) => {
    // This will be implemented to add item to line items block
    onAddLineItem();
    setPriceBookOpen(false);
    setSearchQuery("");
  };

  if (isCollapsed) {
    return (
      <div className="fixed top-32 right-4 z-50">
        <Button
          className="shadow-lg"
          onClick={() => setIsCollapsed(false)}
          size="sm"
          variant="outline"
        >
          <ChevronLeft className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-32 right-4 z-50 w-64 space-y-2 rounded-lg border bg-card p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Edit Invoice</h3>
        <Button
          className="size-6 p-0"
          onClick={() => setIsCollapsed(true)}
          size="sm"
          variant="ghost"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <Separator />

      {/* Add Content Section */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          Add Content
        </p>

        {/* Add Line Item */}
        <Button
          className="w-full justify-start gap-2"
          onClick={onAddLineItem}
          size="sm"
          variant="outline"
        >
          <Plus className="size-4" />
          Add Line Item
        </Button>

        {/* Price Book */}
        <Popover onOpenChange={setPriceBookOpen} open={priceBookOpen}>
          <PopoverTrigger asChild>
            <Button
              className="w-full justify-start gap-2"
              size="sm"
              variant="outline"
            >
              <Search className="size-4" />
              Price Book
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0" side="left">
            <Command>
              <CommandInput
                onValueChange={setSearchQuery}
                placeholder="Search price book..."
                value={searchQuery}
              />
              <CommandList>
                <CommandEmpty>No items found.</CommandEmpty>
                <CommandGroup>
                  {priceBookItems
                    .filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((item) => (
                      <CommandItem
                        className="cursor-pointer"
                        key={item.id}
                        onSelect={() => handleAddFromPriceBook(item)}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-muted-foreground text-xs">
                              {item.sku}
                            </p>
                          </div>
                          <span className="font-semibold text-sm">
                            ${(item.price / 100).toFixed(2)}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Add Tax */}
        <Button
          className="w-full justify-start gap-2"
          onClick={onAddTax}
          size="sm"
          variant="outline"
        >
          <DollarSign className="size-4" />
          Add Tax
        </Button>

        {/* Add Shipping */}
        <Button
          className="w-full justify-start gap-2"
          onClick={onAddShipping}
          size="sm"
          variant="outline"
        >
          <Package className="size-4" />
          Add Shipping
        </Button>
      </div>

      <Separator />

      {/* PDF Export */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          Export
        </p>
        <Button
          className="w-full justify-start gap-2"
          onClick={onGeneratePDF}
          size="sm"
          variant="default"
        >
          <Download className="size-4" />
          Export PDF
        </Button>
      </div>

      <Separator />

      {/* Customization */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          Customize
        </p>
        <Button
          className="w-full justify-start gap-2"
          size="sm"
          variant="outline"
        >
          <Palette className="size-4" />
          Design Settings
        </Button>
      </div>
    </div>
  );
}
