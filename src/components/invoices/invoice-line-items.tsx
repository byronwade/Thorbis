/**
 * Invoice Line Items Component
 *
 * Editable table of invoice line items with:
 * - Add/remove items
 * - Inline editing
 * - Automatic total calculation
 * - Support for various item types (labor, materials, services, etc.)
 */

"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils/format";

type LineItem = {
	description: string;
	quantity: number;
	unitPrice: number;
	total: number;
};

type InvoiceLineItemsProps = {
	lineItems: LineItem[];
	onUpdate: (items: LineItem[]) => void;
};

export function InvoiceLineItems({
	lineItems: initialItems,
	onUpdate,
}: InvoiceLineItemsProps) {
	const [items, setItems] = useState<LineItem[]>(
		initialItems.length > 0
			? initialItems
			: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
	);

	// Update item field
	const updateItem = (index: number, field: keyof LineItem, value: any) => {
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };

		// Recalculate total for this item
		if (field === "quantity" || field === "unitPrice") {
			newItems[index].total =
				newItems[index].quantity * newItems[index].unitPrice;
		}

		setItems(newItems);
		onUpdate(newItems);
	};

	// Add new line item
	const addItem = () => {
		const newItems = [
			...items,
			{ description: "", quantity: 1, unitPrice: 0, total: 0 },
		];
		setItems(newItems);
		onUpdate(newItems);
	};

	// Remove line item
	const removeItem = (index: number) => {
		if (items.length === 1) {
			// Keep at least one item
			const newItems = [
				{ description: "", quantity: 1, unitPrice: 0, total: 0 },
			];
			setItems(newItems);
			onUpdate(newItems);
		} else {
			const newItems = items.filter((_, i) => i !== index);
			setItems(newItems);
			onUpdate(newItems);
		}
	};

	// Format currency

	return (
		<Card className="mb-8 p-6">
			<div className="mb-4 flex items-center justify-between">
				<Label className="text-base font-semibold">Line Items</Label>
				<Button onClick={addItem} size="sm" variant="outline">
					<Plus className="mr-2 h-4 w-4" />
					Add Item
				</Button>
			</div>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[40%]">Description</TableHead>
							<TableHead className="w-[15%]">Quantity</TableHead>
							<TableHead className="w-[20%]">Unit Price</TableHead>
							<TableHead className="w-[20%] text-right">Total</TableHead>
							<TableHead className="w-[5%]" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((item, index) => (
							<TableRow key={index}>
								<TableCell>
									<Input
										className="border-0 p-2 focus-visible:ring-1"
										onChange={(e) =>
											updateItem(index, "description", e.target.value)
										}
										placeholder="e.g., HVAC Unit Installation, Labor, Materials"
										value={item.description}
									/>
								</TableCell>
								<TableCell>
									<Input
										className="border-0 p-2 focus-visible:ring-1"
										min="0"
										onChange={(e) =>
											updateItem(
												index,
												"quantity",
												Number.parseFloat(e.target.value) || 0,
											)
										}
										step="0.01"
										type="number"
										value={item.quantity}
									/>
								</TableCell>
								<TableCell>
									<div className="flex items-center">
										<span className="text-muted-foreground mr-1">$</span>
										<Input
											className="border-0 p-2 focus-visible:ring-1"
											min="0"
											onChange={(e) =>
												updateItem(
													index,
													"unitPrice",
													Number.parseFloat(e.target.value) || 0,
												)
											}
											step="0.01"
											type="number"
											value={item.unitPrice}
										/>
									</div>
								</TableCell>
								<TableCell className="text-right font-medium">
									{formatCurrency(item.total * 100, { decimals: 2 })}
								</TableCell>
								<TableCell>
									<Button
										className="h-8 w-8"
										onClick={() => removeItem(index)}
										size="icon"
										variant="ghost"
									>
										<Trash2 className="text-muted-foreground h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Helper text */}
			<div className="text-muted-foreground mt-4 text-sm">
				<p>
					Add line items for labor, materials, equipment, or services. Totals
					are calculated automatically.
				</p>
			</div>
		</Card>
	);
}
