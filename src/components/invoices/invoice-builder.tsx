"use client";

/**
 * Invoice Builder - Client Component
 *
 * Custom block-based invoice editor with improved design.
 * Provides full control over invoice layout and customization.
 *
 * Features:
 * - Drag-and-drop blocks
 * - Inline editing
 * - Real-time preview
 * - Custom styling
 * - Professional design
 */

import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  ChevronDown,
  CreditCard,
  GripVertical,
  Hash,
  Mail,
  MapPin,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  type FontFamily,
  useInvoiceLayoutStore,
} from "@/lib/stores/invoice-layout-store";

// ============================================================================
// Price Book - Preset Items
// ============================================================================

interface PriceBookItem {
  id: string;
  name: string;
  description: string;
  rate: number;
  category: string;
}

const DEFAULT_PRICE_BOOK: PriceBookItem[] = [
  {
    id: "pb_1",
    name: "Consulting Services",
    description: "Professional consulting services",
    rate: 150.0,
    category: "Services",
  },
  {
    id: "pb_2",
    name: "Project Management",
    description: "Project management and coordination",
    rate: 125.0,
    category: "Services",
  },
  {
    id: "pb_3",
    name: "Design Work",
    description: "UI/UX design and mockups",
    rate: 100.0,
    category: "Design",
  },
  {
    id: "pb_4",
    name: "Development (Hourly)",
    description: "Software development services",
    rate: 175.0,
    category: "Development",
  },
  {
    id: "pb_5",
    name: "Website Hosting",
    description: "Monthly website hosting service",
    rate: 29.99,
    category: "Hosting",
  },
  {
    id: "pb_6",
    name: "Support & Maintenance",
    description: "Ongoing support and maintenance",
    rate: 75.0,
    category: "Support",
  },
  {
    id: "pb_7",
    name: "Custom Feature",
    description: "Custom feature development",
    rate: 500.0,
    category: "Development",
  },
  {
    id: "pb_8",
    name: "Training Session",
    description: "Team training and onboarding",
    rate: 200.0,
    category: "Training",
  },
];

// ============================================================================
// Font Mapping & Currency Formatting
// ============================================================================

/**
 * Maps FontFamily type to CSS font-family values
 * Supports all professional fonts with system fallbacks
 */
function getFontFamily(font: FontFamily): string {
  const fontMap: Record<FontFamily, string> = {
    "geist-sans":
      "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
    "geist-mono": "var(--font-geist-mono), ui-monospace, monospace",
    inter: "Inter, ui-sans-serif, system-ui, sans-serif",
    roboto: "Roboto, ui-sans-serif, system-ui, sans-serif",
    "open-sans": "'Open Sans', ui-sans-serif, system-ui, sans-serif",
    lato: "Lato, ui-sans-serif, system-ui, sans-serif",
    montserrat: "Montserrat, ui-sans-serif, system-ui, sans-serif",
    playfair: "'Playfair Display', ui-serif, Georgia, serif",
    merriweather: "Merriweather, ui-serif, Georgia, serif",
    "source-sans": "'Source Sans Pro', ui-sans-serif, system-ui, sans-serif",
    helvetica: "Helvetica, Arial, sans-serif",
    arial: "Arial, Helvetica, sans-serif",
  };
  return fontMap[font];
}

/**
 * Formats currency based on user settings
 */
function formatCurrency(
  amount: number,
  symbol: string,
  position: "before" | "after",
  showCode: boolean,
  currencyCode: string
): string {
  const formattedAmount = amount.toFixed(2);
  const codeStr = showCode ? ` ${currencyCode}` : "";

  if (position === "before") {
    return `${symbol}${formattedAmount}${codeStr}`;
  }
  return `${formattedAmount}${symbol}${codeStr}`;
}

// ============================================================================
// Types
// ============================================================================

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceBlock {
  id: string;
  type: "header" | "billTo" | "lineItems" | "totals" | "notes" | "paymentTerms";
  data: Record<string, unknown>;
}

interface InvoiceBuilderProps {
  invoice: {
    id: string;
    invoiceNumber: string;
    invoiceDate: string;
    customerName: string;
    customerEmail: string;
    customerAddress: string;
    customerCity: string;
    customerPhone: string;
    companyName: string;
    companyAddress: string;
    companyCity: string;
    companyPhone: string;
    companyEmail: string;
    lineItems: LineItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    notes: string;
    paymentTerms: string;
  };
}

// ============================================================================
// Sortable Block Wrapper
// ============================================================================

function SortableBlock({
  id,
  children,
  isDragging,
}: {
  id: string;
  children: React.ReactNode;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={`group relative ${isDragging ? "opacity-50" : ""}`}
      ref={setNodeRef}
      style={style}
    >
      <button
        className="-left-10 absolute top-4 z-10 cursor-grab rounded-lg border bg-card p-1.5 opacity-0 shadow-sm transition-all hover:bg-accent hover:shadow-md active:cursor-grabbing group-hover:opacity-100"
        type="button"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4 text-muted-foreground" />
      </button>
      {children}
    </div>
  );
}

// ============================================================================
// Invoice Builder Component
// ============================================================================

export function InvoiceBuilder({ invoice }: InvoiceBuilderProps) {
  const customization = useInvoiceLayoutStore((state) => state.customization);
  const { colors, typography, spacing } = customization;

  // Initialize blocks from invoice data
  const [blocks, setBlocks] = useState<InvoiceBlock[]>([
    {
      id: "header",
      type: "header",
      data: {
        companyName: invoice.companyName,
        companyAddress: invoice.companyAddress,
        companyPhone: invoice.companyPhone,
        companyEmail: invoice.companyEmail,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
      },
    },
    {
      id: "billTo",
      type: "billTo",
      data: {
        name: invoice.customerName,
        address: invoice.customerAddress,
        city: invoice.customerCity,
        email: invoice.customerEmail,
        phone: invoice.customerPhone,
      },
    },
    {
      id: "lineItems",
      type: "lineItems",
      data: {
        items: invoice.lineItems,
      },
    },
    {
      id: "totals",
      type: "totals",
      data: {
        subtotal: invoice.subtotal,
        taxRate: invoice.taxRate,
        taxAmount: invoice.taxAmount,
        total: invoice.total,
      },
    },
    {
      id: "notes",
      type: "notes",
      data: {
        text: invoice.notes,
      },
    },
    {
      id: "paymentTerms",
      type: "paymentTerms",
      data: {
        text: invoice.paymentTerms,
      },
    },
  ]);

  const [lineItems, setLineItems] = useState<LineItem[]>(invoice.lineItems);
  const [taxRate, setTaxRate] = useState<number>(invoice.taxRate || 8.5);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [priceBookOpen, setPriceBookOpen] = useState(false);

  // Fix hydration mismatch: Only render DndContext after client-side mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  // Update block data
  const updateBlockData = (blockId: string, data: Record<string, unknown>) => {
    setBlocks((items) =>
      items.map((item) =>
        item.id === blockId
          ? { ...item, data: { ...item.data, ...data } }
          : item
      )
    );
  };

  // Add line item from price book
  const addFromPriceBook = (priceBookItem: PriceBookItem) => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: priceBookItem.description,
      quantity: 1,
      rate: priceBookItem.rate,
      amount: priceBookItem.rate,
    };
    setLineItems([...lineItems, newItem]);
  };

  // Add blank line item
  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  // Remove line item
  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  // Update line item
  const updateLineItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Recalculate amount
          if (field === "quantity" || field === "rate") {
            updated.amount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const spacingClass =
    spacing === "compact" ? "p-8" : spacing === "relaxed" ? "p-12" : "p-10";

  const shadowClass = customization.shadowEnabled ? "shadow-lg" : "shadow-sm";

  // Prevent hydration mismatch by only rendering drag-and-drop on client
  if (!isMounted) {
    return (
      <div
        className="mx-auto max-w-5xl space-y-8"
        style={{
          fontFamily: getFontFamily(typography.bodyFont),
          fontSize: `${typography.bodySize}rem`,
          lineHeight: typography.lineHeight,
        }}
      >
        {/* Loading placeholder during hydration */}
        <div className="text-center text-muted-foreground">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={(event) => setActiveId(event.active.id as string)}
    >
      <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
        <div
          className="relative mx-auto max-w-5xl space-y-8"
          style={{
            fontFamily: getFontFamily(typography.bodyFont),
            fontSize: `${typography.bodySize}rem`,
            lineHeight: typography.lineHeight,
          }}
        >
          {/* Watermark Overlay */}
          {customization.watermarkEnabled && customization.watermarkText && (
            <div
              className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
              style={{
                opacity: customization.watermarkOpacity / 100,
              }}
            >
              <div
                className="select-none font-bold uppercase tracking-widest"
                style={{
                  fontSize: "6rem",
                  color: colors.textLight,
                  transform:
                    customization.watermarkPosition === "diagonal"
                      ? "rotate(-45deg)"
                      : "none",
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                {customization.watermarkText}
              </div>
            </div>
          )}
          {blocks.map((block) => (
            <SortableBlock
              id={block.id}
              isDragging={activeId === block.id}
              key={block.id}
            >
              <div
                className={`${spacingClass} ${shadowClass} rounded-lg border transition-all hover:shadow-xl`}
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  borderRadius: `${customization.borderRadius}px`,
                  borderWidth: customization.showBorder ? "1px" : "0",
                }}
              >
                {/* Header Block */}
                {block.type === "header" ? (
                  <div className="space-y-8">
                    <div className="flex items-start justify-between gap-8">
                      {/* Company Info */}
                      <div className="flex-1 space-y-4">
                        <Input
                          className="border-0 bg-transparent p-0 font-bold leading-tight tracking-tight focus-visible:ring-0"
                          onChange={(e) =>
                            updateBlockData(block.id, {
                              companyName: e.target.value,
                            })
                          }
                          placeholder="Company Name"
                          style={{
                            fontFamily: getFontFamily(typography.headingFont),
                            fontSize: "2.25rem",
                            color: colors.primary,
                          }}
                          value={block.data.companyName as string}
                        />
                        <div
                          className="space-y-2"
                          style={{
                            color: colors.textLight,
                            fontSize: "0.9375rem",
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <MapPin className="size-4 flex-shrink-0" />
                            <Input
                              className="border-0 bg-transparent p-0 focus-visible:ring-0"
                              onChange={(e) =>
                                updateBlockData(block.id, {
                                  companyAddress: e.target.value,
                                })
                              }
                              placeholder="Company Address"
                              style={{
                                color: colors.textLight,
                                fontSize: "0.9375rem",
                              }}
                              value={block.data.companyAddress as string}
                            />
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Phone className="size-4 flex-shrink-0" />
                            <Input
                              className="border-0 bg-transparent p-0 focus-visible:ring-0"
                              onChange={(e) =>
                                updateBlockData(block.id, {
                                  companyPhone: e.target.value,
                                })
                              }
                              placeholder="Company Phone"
                              style={{
                                color: colors.textLight,
                                fontSize: "0.9375rem",
                              }}
                              value={block.data.companyPhone as string}
                            />
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Mail className="size-4 flex-shrink-0" />
                            <Input
                              className="border-0 bg-transparent p-0 focus-visible:ring-0"
                              onChange={(e) =>
                                updateBlockData(block.id, {
                                  companyEmail: e.target.value,
                                })
                              }
                              placeholder="Company Email"
                              style={{
                                color: colors.textLight,
                                fontSize: "0.9375rem",
                              }}
                              type="email"
                              value={block.data.companyEmail as string}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Invoice Info */}
                      <div className="shrink-0 text-right">
                        <div
                          className="mb-3 inline-flex items-center gap-2.5 rounded-lg px-5 py-2.5"
                          style={{
                            backgroundColor: `${colors.primary}10`,
                          }}
                        >
                          <Hash
                            className="size-4"
                            style={{ color: colors.primary }}
                          />
                          <Input
                            className="border-0 bg-transparent p-0 text-right font-bold focus-visible:ring-0"
                            onChange={(e) =>
                              updateBlockData(block.id, {
                                invoiceNumber: e.target.value,
                              })
                            }
                            placeholder="INV-001"
                            style={{
                              fontFamily: getFontFamily(typography.headingFont),
                              fontSize: "1.125rem",
                              color: colors.primary,
                              width: "120px",
                            }}
                            value={block.data.invoiceNumber as string}
                          />
                        </div>
                        <div
                          className="flex items-center justify-end gap-2.5"
                          style={{
                            color: colors.textLight,
                            fontSize: "0.9375rem",
                          }}
                        >
                          <Calendar className="size-4 flex-shrink-0" />
                          <Input
                            className="border-0 bg-transparent p-0 text-right focus-visible:ring-0"
                            onChange={(e) =>
                              updateBlockData(block.id, {
                                invoiceDate: e.target.value,
                              })
                            }
                            style={{
                              color: colors.textLight,
                              fontSize: "0.9375rem",
                              width: "110px",
                            }}
                            type="date"
                            value={block.data.invoiceDate as string}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Bill To Block */}
                {block.type === "billTo" ? (
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <div
                        className="rounded-lg p-2"
                        style={{ backgroundColor: `${colors.accent}10` }}
                      >
                        <MapPin
                          className="size-5"
                          style={{ color: colors.accent }}
                        />
                      </div>
                      <h3
                        className="font-semibold"
                        style={{
                          fontFamily: getFontFamily(typography.headingFont),
                          fontSize: "1.125rem",
                          color: colors.primary,
                        }}
                      >
                        Bill To
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <Input
                        className="border-0 bg-transparent p-0 font-semibold focus-visible:ring-0"
                        onChange={(e) =>
                          updateBlockData(block.id, { name: e.target.value })
                        }
                        placeholder="Customer Name"
                        style={{
                          color: colors.text,
                          fontSize: "1.0625rem",
                        }}
                        value={block.data.name as string}
                      />
                      <div
                        className="space-y-2"
                        style={{
                          color: colors.textLight,
                          fontSize: "0.9375rem",
                        }}
                      >
                        <Input
                          className="border-0 bg-transparent p-0 focus-visible:ring-0"
                          onChange={(e) =>
                            updateBlockData(block.id, {
                              address: e.target.value,
                            })
                          }
                          placeholder="Street Address"
                          style={{
                            color: colors.textLight,
                            fontSize: "0.9375rem",
                          }}
                          value={block.data.address as string}
                        />
                        <Input
                          className="border-0 bg-transparent p-0 focus-visible:ring-0"
                          onChange={(e) =>
                            updateBlockData(block.id, { city: e.target.value })
                          }
                          placeholder="City, State ZIP"
                          style={{
                            color: colors.textLight,
                            fontSize: "0.9375rem",
                          }}
                          value={block.data.city as string}
                        />
                        <div className="flex items-center gap-2.5">
                          <Mail className="size-4 flex-shrink-0" />
                          <Input
                            className="border-0 bg-transparent p-0 focus-visible:ring-0"
                            onChange={(e) =>
                              updateBlockData(block.id, {
                                email: e.target.value,
                              })
                            }
                            placeholder="customer@example.com"
                            style={{
                              color: colors.textLight,
                              fontSize: "0.9375rem",
                            }}
                            type="email"
                            value={block.data.email as string}
                          />
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Phone className="size-4 flex-shrink-0" />
                          <Input
                            className="border-0 bg-transparent p-0 focus-visible:ring-0"
                            onChange={(e) =>
                              updateBlockData(block.id, {
                                phone: e.target.value,
                              })
                            }
                            placeholder="(555) 123-4567"
                            style={{
                              color: colors.textLight,
                              fontSize: "0.9375rem",
                            }}
                            type="tel"
                            value={block.data.phone as string}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Line Items Block - Minimalistic */}
                {block.type === "lineItems" ? (
                  <div>
                    {/* Header with Quick Add */}
                    <div className="mb-4 flex items-center justify-between">
                      <h3
                        className="font-medium"
                        style={{
                          fontFamily: getFontFamily(typography.headingFont),
                          fontSize: "0.875rem",
                          color: colors.textLight,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Items
                      </h3>

                      {/* Quick Add Menu */}
                      <div className="flex items-center gap-2">
                        <Popover
                          onOpenChange={setPriceBookOpen}
                          open={priceBookOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              className="h-8 gap-1 text-xs"
                              size="sm"
                              style={{
                                borderColor: colors.border,
                                color: colors.text,
                              }}
                              variant="outline"
                            >
                              <Plus className="size-3" />
                              Quick Add
                              <ChevronDown className="size-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-80 p-0">
                            <Command>
                              <CommandInput placeholder="Search price book..." />
                              <CommandList>
                                <CommandEmpty>No items found.</CommandEmpty>
                                {Object.entries(
                                  DEFAULT_PRICE_BOOK.reduce(
                                    (acc, item) => {
                                      if (!acc[item.category])
                                        acc[item.category] = [];
                                      acc[item.category].push(item);
                                      return acc;
                                    },
                                    {} as Record<string, PriceBookItem[]>
                                  )
                                ).map(([category, items]) => (
                                  <CommandGroup
                                    heading={category}
                                    key={category}
                                  >
                                    {items.map((pbItem) => (
                                      <CommandItem
                                        key={pbItem.id}
                                        onSelect={() => {
                                          addFromPriceBook(pbItem);
                                          setPriceBookOpen(false);
                                        }}
                                      >
                                        <div className="flex w-full items-center justify-between">
                                          <div className="flex-1">
                                            <div className="font-medium">
                                              {pbItem.name}
                                            </div>
                                            <div className="text-muted-foreground text-xs">
                                              {pbItem.description}
                                            </div>
                                          </div>
                                          <div className="font-semibold text-sm">
                                            {formatCurrency(
                                              pbItem.rate,
                                              customization.currencySymbol,
                                              customization.currencyPosition,
                                              false,
                                              customization.currency
                                            )}
                                          </div>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                ))}
                                <CommandSeparator />
                                <CommandGroup>
                                  <CommandItem
                                    onSelect={() => {
                                      addLineItem();
                                      setPriceBookOpen(false);
                                    }}
                                  >
                                    <Plus className="mr-2 size-4" />
                                    <span>Add blank item</span>
                                  </CommandItem>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Minimal Table */}
                    {lineItems.length > 0 ? (
                      <div
                        className="overflow-hidden rounded-md border"
                        style={{ borderColor: colors.border }}
                      >
                        <table className="w-full">
                          <thead>
                            <tr
                              className="border-b text-xs"
                              style={{
                                borderColor: colors.border,
                                backgroundColor: `${colors.background}`,
                              }}
                            >
                              <th
                                className="px-3 py-2 text-left font-medium"
                                style={{ color: colors.textLight }}
                              >
                                Description
                              </th>
                              <th
                                className="w-20 px-3 py-2 text-center font-medium"
                                style={{ color: colors.textLight }}
                              >
                                Qty
                              </th>
                              <th
                                className="w-28 px-3 py-2 text-right font-medium"
                                style={{ color: colors.textLight }}
                              >
                                Rate
                              </th>
                              <th
                                className="w-32 px-3 py-2 text-right font-medium"
                                style={{ color: colors.textLight }}
                              >
                                Amount
                              </th>
                              <th className="w-10" />
                            </tr>
                          </thead>
                          <tbody>
                            {lineItems.map((item) => (
                              <tr
                                className="group border-b transition-colors hover:bg-accent/5"
                                key={item.id}
                                style={{ borderColor: colors.border }}
                              >
                                <td className="px-3 py-2">
                                  <Input
                                    className="h-8 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                                    onChange={(e) =>
                                      updateLineItem(
                                        item.id,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Item description"
                                    style={{ color: colors.text }}
                                    value={item.description}
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <Input
                                    className="h-8 border-0 bg-transparent p-0 text-center text-sm focus-visible:ring-0"
                                    min={1}
                                    onChange={(e) =>
                                      updateLineItem(
                                        item.id,
                                        "quantity",
                                        Number.parseFloat(e.target.value) || 0
                                      )
                                    }
                                    style={{ color: colors.text }}
                                    type="number"
                                    value={item.quantity}
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <Input
                                    className="h-8 border-0 bg-transparent p-0 text-right text-sm focus-visible:ring-0"
                                    min={0}
                                    onChange={(e) =>
                                      updateLineItem(
                                        item.id,
                                        "rate",
                                        Number.parseFloat(e.target.value) || 0
                                      )
                                    }
                                    step={0.01}
                                    style={{ color: colors.text }}
                                    type="number"
                                    value={item.rate}
                                  />
                                </td>
                                <td
                                  className="px-3 py-2 text-right font-semibold text-sm"
                                  style={{ color: colors.text }}
                                >
                                  {formatCurrency(
                                    item.amount,
                                    customization.currencySymbol,
                                    customization.currencyPosition,
                                    customization.showCurrencyCode,
                                    customization.currency
                                  )}
                                </td>
                                <td className="px-1 py-2 text-center">
                                  <Button
                                    className="size-6 opacity-0 transition-opacity group-hover:opacity-100"
                                    onClick={() => removeLineItem(item.id)}
                                    size="icon"
                                    variant="ghost"
                                  >
                                    <X
                                      className="size-3"
                                      style={{ color: colors.textLight }}
                                    />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center rounded-md border border-dashed py-12 text-center"
                        style={{ borderColor: colors.border }}
                      >
                        <div
                          className="mb-2 rounded-full p-2"
                          style={{ backgroundColor: `${colors.primary}10` }}
                        >
                          <Plus
                            className="size-5"
                            style={{ color: colors.primary }}
                          />
                        </div>
                        <p
                          className="mb-3 font-medium text-sm"
                          style={{ color: colors.text }}
                        >
                          No items added yet
                        </p>
                        <p
                          className="mb-4 text-xs"
                          style={{ color: colors.textLight }}
                        >
                          Use Quick Add to select from price book
                        </p>
                        <Button
                          className="gap-1"
                          onClick={() => setPriceBookOpen(true)}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="size-3" />
                          Quick Add
                        </Button>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Totals Block */}
                {block.type === "totals" ? (
                  <div className="ml-auto max-w-sm space-y-5">
                    <div className="flex items-center justify-between py-2.5">
                      <span
                        className="font-medium"
                        style={{
                          color: colors.textLight,
                          fontSize: "0.9375rem",
                        }}
                      >
                        Subtotal
                      </span>
                      <span
                        className="font-semibold"
                        style={{
                          color: colors.text,
                          fontSize: "1.0625rem",
                        }}
                      >
                        {formatCurrency(
                          subtotal,
                          customization.currencySymbol,
                          customization.currencyPosition,
                          customization.showCurrencyCode,
                          customization.currency
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium"
                          style={{
                            color: colors.textLight,
                            fontSize: "0.9375rem",
                          }}
                        >
                          Tax
                        </span>
                        <div className="flex items-center gap-1">
                          <span
                            style={{
                              color: colors.textLight,
                              fontSize: "0.9375rem",
                            }}
                          >
                            (
                          </span>
                          <Input
                            className="border-0 bg-transparent p-0 text-center focus-visible:ring-0"
                            max={100}
                            min={0}
                            onChange={(e) =>
                              setTaxRate(Number.parseFloat(e.target.value) || 0)
                            }
                            step={0.1}
                            style={{
                              color: colors.textLight,
                              fontSize: "0.9375rem",
                              width: "45px",
                            }}
                            type="number"
                            value={taxRate}
                          />
                          <span
                            style={{
                              color: colors.textLight,
                              fontSize: "0.9375rem",
                            }}
                          >
                            %)
                          </span>
                        </div>
                      </div>
                      <span
                        className="font-semibold"
                        style={{
                          color: colors.text,
                          fontSize: "1.0625rem",
                        }}
                      >
                        {formatCurrency(
                          taxAmount,
                          customization.currencySymbol,
                          customization.currencyPosition,
                          customization.showCurrencyCode,
                          customization.currency
                        )}
                      </span>
                    </div>

                    {/* VAT Section (if enabled) */}
                    {customization.vatEnabled && customization.vatRate && (
                      <>
                        <div className="flex items-center justify-between gap-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-medium"
                              style={{
                                color: colors.textLight,
                                fontSize: "0.9375rem",
                              }}
                            >
                              VAT
                            </span>
                            <span
                              style={{
                                color: colors.textLight,
                                fontSize: "0.9375rem",
                              }}
                            >
                              ({customization.vatRate}%)
                            </span>
                            {customization.vatNumber && (
                              <span
                                className="text-xs"
                                style={{
                                  color: colors.textLight,
                                  fontSize: "0.75rem",
                                }}
                              >
                                {customization.vatNumber}
                              </span>
                            )}
                          </div>
                          <span
                            className="font-semibold"
                            style={{
                              color: colors.text,
                              fontSize: "1.0625rem",
                            }}
                          >
                            {formatCurrency(
                              subtotal * (customization.vatRate / 100),
                              customization.currencySymbol,
                              customization.currencyPosition,
                              customization.showCurrencyCode,
                              customization.currency
                            )}
                          </span>
                        </div>
                      </>
                    )}

                    <div
                      className="border-t-2"
                      style={{ borderColor: colors.primary }}
                    />
                    <div
                      className="flex items-center justify-between rounded-lg p-5"
                      style={{
                        backgroundColor: `${colors.primary}10`,
                      }}
                    >
                      <span
                        className="font-bold"
                        style={{
                          fontFamily: getFontFamily(typography.headingFont),
                          color: colors.primary,
                          fontSize: "1.125rem",
                        }}
                      >
                        Total
                      </span>
                      <span
                        className="font-bold"
                        style={{
                          fontFamily: getFontFamily(typography.headingFont),
                          color: colors.primary,
                          fontSize: "1.5rem",
                        }}
                      >
                        {formatCurrency(
                          customization.vatEnabled && customization.vatRate
                            ? total + subtotal * (customization.vatRate / 100)
                            : total,
                          customization.currencySymbol,
                          customization.currencyPosition,
                          customization.showCurrencyCode,
                          customization.currency
                        )}
                      </span>
                    </div>

                    {/* Payment Features (QR Code & Payment Link) */}
                    {(customization.qrCodeEnabled ||
                      customization.paymentLinkEnabled) && (
                      <div
                        className="mt-6 space-y-4 border-t pt-6"
                        style={{ borderColor: colors.border }}
                      >
                        {customization.paymentLinkEnabled &&
                          customization.paymentLinkURL && (
                            <div className="text-center">
                              <a
                                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors hover:opacity-80"
                                href={customization.paymentLinkURL}
                                rel="noopener noreferrer"
                                style={{
                                  backgroundColor: colors.primary,
                                  color: "white",
                                }}
                                target="_blank"
                              >
                                <CreditCard className="size-4" />
                                Pay Online
                              </a>
                            </div>
                          )}

                        {customization.qrCodeEnabled &&
                          customization.qrCodeData && (
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className="flex size-32 items-center justify-center rounded-lg border-2"
                                style={{ borderColor: colors.border }}
                              >
                                <div
                                  className="text-center text-xs"
                                  style={{ color: colors.textLight }}
                                >
                                  [QR Code]
                                  <br />
                                  {customization.qrCodeType}
                                </div>
                              </div>
                              <span
                                className="text-xs"
                                style={{ color: colors.textLight }}
                              >
                                Scan to pay
                              </span>
                            </div>
                          )}
                      </div>
                    )}

                    {/* Digital Signature */}
                    {customization.digitalSignatureEnabled &&
                      customization.digitalSignatureImage && (
                        <div
                          className="mt-6 border-t pt-6"
                          style={{ borderColor: colors.border }}
                        >
                          <div className="space-y-2">
                            <span
                              className="font-medium text-xs"
                              style={{ color: colors.textLight }}
                            >
                              Authorized Signature
                            </span>
                            <div>
                              <img
                                alt="Digital Signature"
                                className="h-16 object-contain"
                                src={customization.digitalSignatureImage}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                ) : null}

                {/* Notes Block */}
                {block.type === "notes" ? (
                  <div>
                    <h3
                      className="mb-4 font-semibold"
                      style={{
                        fontFamily: getFontFamily(typography.headingFont),
                        fontSize: `${typography.headingSize}rem`,
                        color: colors.primary,
                      }}
                    >
                      Notes
                    </h3>
                    <Textarea
                      className="min-h-[120px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
                      onChange={(e) =>
                        updateBlockData(block.id, { text: e.target.value })
                      }
                      placeholder="Additional notes or payment instructions..."
                      style={{ color: colors.text }}
                      value={block.data.text as string}
                    />
                  </div>
                ) : null}

                {/* Payment Terms Block */}
                {block.type === "paymentTerms" ? (
                  <div>
                    <h3
                      className="mb-4 font-semibold"
                      style={{
                        fontFamily: getFontFamily(typography.headingFont),
                        fontSize: `${typography.headingSize}rem`,
                        color: colors.primary,
                      }}
                    >
                      Payment Terms
                    </h3>
                    <Textarea
                      className="min-h-[100px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
                      onChange={(e) =>
                        updateBlockData(block.id, { text: e.target.value })
                      }
                      placeholder="Payment due within 30 days. Late payments may incur additional fees..."
                      style={{ color: colors.text }}
                      value={block.data.text as string}
                    />
                  </div>
                ) : null}
              </div>
            </SortableBlock>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
