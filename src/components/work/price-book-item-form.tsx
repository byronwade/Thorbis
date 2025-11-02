"use client";

/**
 * Price Book Item Form - Client Component
 *
 * Features:
 * - Add/Edit price book items
 * - Real-time markup calculation
 * - Category and supplier selection
 * - Image upload support
 * - Tags management
 * - Form validation
 */

import { Calculator, DollarSign, Package, Plus, Save, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LaborCalculatorModal } from "@/components/work/labor-calculator-modal";

type FormData = {
  itemType: "service" | "material" | "package";
  name: string;
  sku: string;
  description: string;
  category: string;
  subcategory: string;
  cost: string;
  price: string;
  markupPercent: string;
  unit: string;
  minimumQuantity: string;
  isActive: boolean;
  isTaxable: boolean;
  supplierName: string;
  supplierSku: string;
  tags: string[];
  notes: string;
};

const defaultFormData: FormData = {
  itemType: "service",
  name: "",
  sku: "",
  description: "",
  category: "HVAC",
  subcategory: "",
  cost: "",
  price: "",
  markupPercent: "",
  unit: "each",
  minimumQuantity: "1",
  isActive: true,
  isTaxable: true,
  supplierName: "",
  supplierSku: "",
  tags: [],
  notes: "",
};

export function PriceBookItemForm({
  initialData,
  itemId,
}: {
  initialData?: Partial<FormData>;
  itemId?: string;
}) {
  const [formData, setFormData] = useState<FormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate markup when cost or price changes
  const calculateMarkup = (cost: string, price: string) => {
    const costNum = Number.parseFloat(cost) || 0;
    const priceNum = Number.parseFloat(price) || 0;
    if (costNum > 0 && priceNum > 0) {
      const markup = ((priceNum - costNum) / costNum) * 100;
      return markup.toFixed(1);
    }
    return "";
  };

  // Calculate price when cost or markup changes
  const calculatePrice = (cost: string, markup: string) => {
    const costNum = Number.parseFloat(cost) || 0;
    const markupNum = Number.parseFloat(markup) || 0;
    if (costNum > 0 && markupNum > 0) {
      const price = costNum * (1 + markupNum / 100);
      return price.toFixed(2);
    }
    return "";
  };

  const handleCostChange = (value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, cost: value };
      if (prev.price) {
        newData.markupPercent = calculateMarkup(value, prev.price);
      } else if (prev.markupPercent) {
        newData.price = calculatePrice(value, prev.markupPercent);
      }
      return newData;
    });
  };

  const handlePriceChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      price: value,
      markupPercent: calculateMarkup(prev.cost, value),
    }));
  };

  const handleMarkupChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      markupPercent: value,
      price: calculatePrice(prev.cost, value),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleLaborCalculation = (calculation: any) => {
    // Convert cents to dollars for form display
    const costInDollars = (calculation.total / 100).toFixed(2);
    const priceInDollars = (calculation.suggestedPrice / 100).toFixed(2);
    const markup = (
      (calculation.suggestedMarkup / calculation.total) *
      100
    ).toFixed(1);

    setFormData((prev) => ({
      ...prev,
      cost: costInDollars,
      price: priceInDollars,
      markupPercent: markup,
      // Auto-populate name if empty and description is provided
      name: prev.name || calculation.description || "Labor Service",
      // Set to service type if not already
      itemType: "service",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Save to database
    console.log("Form data:", formData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    // Navigate back to price book
    window.location.href = "/dashboard/work/pricebook";
  };

  const categories = ["HVAC", "Plumbing", "Electrical", "General"];
  const units = [
    "each",
    "hour",
    "per ft",
    "linear_ft",
    "sq_ft",
    "lb",
    "gal",
    "set",
  ];
  const suppliers = [
    "",
    "Ferguson",
    "Fastenal",
    "Grainger",
    "HD Supply",
    "Pace",
    "Winsupply",
  ];

  const profitMargin =
    formData.cost && formData.price
      ? ((Number.parseFloat(formData.price) -
          Number.parseFloat(formData.cost)) /
          Number.parseFloat(formData.price)) *
        100
      : 0;

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the basic details for this price book item
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="itemType">Item Type</Label>
              <Select
                onValueChange={(value: any) =>
                  setFormData((prev) => ({ ...prev, itemType: value }))
                }
                value={formData.itemType}
              >
                <SelectTrigger id="itemType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="package">Package</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU / Item Code</Label>
              <Input
                id="sku"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sku: e.target.value }))
                }
                placeholder="e.g., SVC-001"
                required
                value={formData.sku}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., HVAC System Inspection"
              required
              value={formData.name}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              className="min-h-[100px]"
              id="description"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Detailed description of the service or material..."
              value={formData.description}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
                value={formData.category}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory (Optional)</Label>
              <Input
                id="subcategory"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subcategory: e.target.value,
                  }))
                }
                placeholder="e.g., Inspection"
                value={formData.subcategory}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>
                Set cost, price, and markup for this item
              </CardDescription>
            </div>
            {formData.itemType === "service" && (
              <LaborCalculatorModal
                onAddLabor={handleLaborCalculation}
                trigger={
                  <Button size="sm" type="button" variant="outline">
                    <Calculator className="mr-2 size-4" />
                    Calculate Labor
                  </Button>
                }
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <div className="relative">
                <DollarSign className="absolute top-3 left-3 size-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  id="cost"
                  onChange={(e) => handleCostChange(e.target.value)}
                  placeholder="0.00"
                  required
                  step="0.01"
                  type="number"
                  value={formData.cost}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <DollarSign className="absolute top-3 left-3 size-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  id="price"
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="0.00"
                  required
                  step="0.01"
                  type="number"
                  value={formData.price}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="markupPercent">Markup %</Label>
              <Input
                id="markupPercent"
                onChange={(e) => handleMarkupChange(e.target.value)}
                placeholder="0"
                step="0.1"
                type="number"
                value={formData.markupPercent}
              />
            </div>
          </div>

          {formData.cost && formData.price && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-xs">
                    Profit per Unit
                  </p>
                  <p className="font-semibold text-green-600 dark:text-green-500">
                    $
                    {(
                      Number.parseFloat(formData.price) -
                      Number.parseFloat(formData.cost)
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Profit Margin</p>
                  <p className="font-semibold text-green-600 dark:text-green-500">
                    {profitMargin.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Markup</p>
                  <p className="font-semibold">
                    {formData.markupPercent || "0"}%
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, unit: value }))
                }
                value={formData.unit}
              >
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumQuantity">Minimum Quantity</Label>
              <Input
                id="minimumQuantity"
                min="1"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minimumQuantity: e.target.value,
                  }))
                }
                required
                type="number"
                value={formData.minimumQuantity}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Information */}
      {formData.itemType === "material" && (
        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
            <CardDescription>
              Link this material to a supplier (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="supplierName">Supplier</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, supplierName: value }))
                  }
                  value={formData.supplierName}
                >
                  <SelectTrigger id="supplierName">
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier || "none"} value={supplier}>
                        {supplier || "None"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplierSku">Supplier SKU (Optional)</Label>
                <Input
                  id="supplierSku"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      supplierSku: e.target.value,
                    }))
                  }
                  placeholder="Supplier's item code"
                  value={formData.supplierSku}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Options */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Options</CardTitle>
          <CardDescription>Configure status, tags, and notes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active</Label>
              <p className="text-muted-foreground text-xs">
                Make this item available for use
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              id="isActive"
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isTaxable">Taxable</Label>
              <p className="text-muted-foreground text-xs">
                Apply tax to this item when invoiced
              </p>
            </div>
            <Switch
              checked={formData.isTaxable}
              id="isTaxable"
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isTaxable: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag..."
                value={tagInput}
              />
              <Button
                onClick={handleAddTag}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus className="size-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      className="ml-1.5 rounded-sm hover:bg-accent"
                      onClick={() => handleRemoveTag(tag)}
                      type="button"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              className="min-h-[80px]"
              id="notes"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Add internal notes about this item..."
              value={formData.notes}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button asChild type="button" variant="outline">
          <a href="/dashboard/work/pricebook">Cancel</a>
        </Button>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <>
              <Package className="mr-2 size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              {itemId ? "Update Item" : "Create Item"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
