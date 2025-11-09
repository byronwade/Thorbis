/**
 * Line Items Editor - Sidebar Component
 *
 * Compact inline-editable list for managing invoice line items.
 * Features:
 * - Quick add/edit/delete
 * - Inline contentEditable fields
 * - Drag-to-reorder
 * - Price book integration
 * - Real-time total calculation
 */

"use client";

import { FileText, GripVertical, Plus, Search, Trash2 } from "lucide-react";
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
import { InlineCurrency } from "./inline-editable/inline-currency";
import { InlineNumber } from "./inline-editable/inline-number";
import { InlineText } from "./inline-editable/inline-text";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // in cents
  amount: number; // in cents
}

interface LineItemsEditorProps {
  invoiceId: string;
  lineItems: LineItem[];
  subtotal: number;
  onUpdate?: () => void;
}

export function LineItemsEditor({
  invoiceId,
  lineItems: initialLineItems = [],
  subtotal,
  onUpdate,
}: LineItemsEditorProps) {
  const [lineItems, setLineItems] = useState<LineItem[]>(initialLineItems);
  const [priceBookOpen, setPriceBookOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock price book (TODO: Replace with real query)
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

  // Calculate subtotal
  const calculatedSubtotal = lineItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // Format currency
  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  // Add item
  const handleAddItem = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  // Add from price book
  const handleAddFromPriceBook = (item: (typeof priceBookItems)[0]) => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: item.name,
      quantity: 1,
      unitPrice: item.price,
      amount: item.price,
    };
    setLineItems([...lineItems, newItem]);
    setPriceBookOpen(false);
    setSearchQuery("");
  };

  // Update item
  const handleUpdateItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        // Auto-calculate amount
        if (field === "quantity" || field === "unitPrice") {
          updated.amount = updated.quantity * updated.unitPrice;
        }

        return updated;
      })
    );

    // TODO: Call server action to save
    if (onUpdate) onUpdate();
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
    if (onUpdate) onUpdate();
  };

  return (
    <div className="flex h-full flex-col p-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="mb-3 font-semibold text-sm">Line Items</h3>
        <div className="flex gap-2">
          <Button className="flex-1 gap-2" onClick={handleAddItem} size="sm">
            <Plus className="size-4" />
            Add Item
          </Button>
          <Popover onOpenChange={setPriceBookOpen} open={priceBookOpen}>
            <PopoverTrigger asChild>
              <Button className="gap-2" size="sm" variant="outline">
                <Search className="size-4" />
                Price Book
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
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
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Line Items List */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {lineItems.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-center">
              <FileText className="mx-auto mb-2 size-8 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No line items yet</p>
              <p className="text-muted-foreground text-xs">
                Click Add Item to start
              </p>
            </div>
          </div>
        ) : (
          lineItems.map((item, index) => (
            <div
              className="group relative rounded-lg border bg-card p-3 hover:border-primary/50"
              key={item.id}
            >
              {/* Drag Handle */}
              <div className="-left-2 absolute top-3 opacity-0 group-hover:opacity-100">
                <GripVertical className="size-4 cursor-move text-muted-foreground" />
              </div>

              {/* Delete Button */}
              <button
                className="-right-2 -top-2 absolute flex size-6 items-center justify-center rounded-full border bg-background opacity-0 transition-opacity hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                onClick={() => handleDeleteItem(item.id)}
              >
                <Trash2 className="size-3" />
              </button>

              {/* Item Number */}
              <div className="mb-2 text-muted-foreground text-xs">
                #{index + 1}
              </div>

              {/* Description */}
              <InlineText
                className="mb-2 font-medium text-sm"
                isEditable={true}
                onUpdate={(val) =>
                  handleUpdateItem(item.id, "description", val)
                }
                placeholder="Item description"
                value={item.description}
              />

              {/* Quantity × Rate = Amount */}
              <div className="flex items-center gap-2 text-xs">
                <InlineNumber
                  className="w-12 text-center"
                  decimals={0}
                  isEditable={true}
                  onUpdate={(val) => handleUpdateItem(item.id, "quantity", val)}
                  value={item.quantity}
                />
                <span className="text-muted-foreground">×</span>
                <InlineCurrency
                  className="flex-1 text-right"
                  isEditable={true}
                  onUpdate={(val) =>
                    handleUpdateItem(item.id, "unitPrice", val)
                  }
                  value={item.unitPrice}
                />
                <span className="text-muted-foreground">=</span>
                <span className="w-20 text-right font-mono font-semibold tabular-nums">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals Summary */}
      <div className="mt-4 space-y-2 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-mono font-semibold tabular-nums">
            {formatCurrency(calculatedSubtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold text-sm">Total</span>
          <span className="font-bold font-mono text-base tabular-nums">
            {formatCurrency(calculatedSubtotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
