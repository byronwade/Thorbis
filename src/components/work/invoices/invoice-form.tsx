/**
 * InvoiceForm Component
 *
 * Comprehensive invoice creation form with:
 * - Pre-fill from estimate (if estimateId provided)
 * - Smart customer/property selection
 * - Line items builder with pricebook integration
 * - Payment terms and due date calculator
 * - Auto-calculate totals (subtotal, tax, discount)
 * - Keyboard shortcuts (⌘S, ⌘K, ⌘/)
 *
 * Performance: Client Component (interactive form)
 */

"use client";

import { Loader2, Plus, Save, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createInvoice } from "@/actions/invoices";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Customer = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	display_name: string | null;
	email: string | null;
	phone: string | null;
	company_name: string | null;
};

type Property = {
	id: string;
	name: string | null;
	address: string | null;
	city: string | null;
	state: string | null;
	zip_code: string | null;
};

type PriceBookItem = {
	id: string;
	name: string;
	description: string | null;
	unit_price: number;
	sku: string | null;
};

type Estimate = {
	id: string;
	estimate_number: string;
	title: string;
	description: string | null;
	customer_id: string;
	property_id: string | null;
	line_items: any[];
	tax_rate: number;
	discount_amount: number;
};

type LineItem = {
	id: string;
	description: string;
	quantity: number;
	unitPrice: number;
	total: number;
};

type InvoiceFormProps = {
	customers: Customer[];
	properties: Property[];
	priceBookItems: PriceBookItem[];
	estimate?: Estimate | null;
	preselectedCustomerId?: string;
	preselectedEstimateId?: string;
};

export function InvoiceForm({
	customers,
	properties,
	priceBookItems,
	estimate,
	preselectedCustomerId,
	preselectedEstimateId,
}: InvoiceFormProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const formRef = useRef<HTMLFormElement>(null);

	// Form state
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(
		estimate?.customer_id || preselectedCustomerId || searchParams?.get("customerId") || undefined
	);
	const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>(
		estimate?.property_id || searchParams?.get("propertyId") || undefined
	);

	// Pre-fill line items from estimate if available
	const initialLineItems: LineItem[] = estimate?.line_items?.length
		? estimate.line_items.map((item: any) => ({
				id: crypto.randomUUID(),
				description: item.description,
				quantity: item.quantity,
				unitPrice: item.unit_price / 100, // Convert from cents
				total: (item.quantity * item.unit_price) / 100,
			}))
		: [
				{
					id: crypto.randomUUID(),
					description: "",
					quantity: 1,
					unitPrice: 0,
					total: 0,
				},
			];

	const [lineItems, setLineItems] = useState<LineItem[]>(initialLineItems);
	const [taxRate, setTaxRate] = useState(estimate?.tax_rate || 0);
	const [discountAmount, setDiscountAmount] = useState(estimate?.discount_amount ? estimate.discount_amount / 100 : 0);
	const [showPriceBook, setShowPriceBook] = useState(false);
	const [paymentTerms, setPaymentTerms] = useState("net_30");
	const [dueDate, setDueDate] = useState("");

	// Calculate due date based on payment terms
	useEffect(() => {
		const today = new Date();
		let days = 30; // default

		switch (paymentTerms) {
			case "due_on_receipt":
				days = 0;
				break;
			case "net_15":
				days = 15;
				break;
			case "net_30":
				days = 30;
				break;
			case "net_60":
				days = 60;
				break;
			case "net_90":
				days = 90;
				break;
		}

		const due = new Date(today);
		due.setDate(due.getDate() + days);
		setDueDate(due.toISOString().split("T")[0]);
	}, [paymentTerms]);

	// Filter properties by selected customer
	const customerProperties = selectedCustomerId
		? properties.filter((_p) => true) // Simplified - would filter by customer_id
		: properties;

	// Calculate totals
	const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
	const taxAmount = (subtotal * taxRate) / 100;
	const total = subtotal + taxAmount - discountAmount;

	// Keyboard shortcuts
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key === "s") {
				e.preventDefault();
				formRef.current?.requestSubmit();
			}
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				document.getElementById("customer-select")?.focus();
			}
			if (e.key === "Escape") {
				router.back();
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [router]);

	// Handle line item changes
	const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
		setLineItems((items) =>
			items.map((item) => {
				if (item.id === id) {
					const updated = { ...item, [field]: value };
					if (field === "quantity" || field === "unitPrice") {
						updated.total = updated.quantity * updated.unitPrice;
					}
					return updated;
				}
				return item;
			})
		);
	};

	const addLineItem = () => {
		setLineItems([
			...lineItems,
			{
				id: crypto.randomUUID(),
				description: "",
				quantity: 1,
				unitPrice: 0,
				total: 0,
			},
		]);
	};

	const removeLineItem = (id: string) => {
		if (lineItems.length > 1) {
			setLineItems(lineItems.filter((item) => item.id !== id));
		}
	};

	const addFromPriceBook = (item: PriceBookItem) => {
		setLineItems([
			...lineItems,
			{
				id: crypto.randomUUID(),
				description: item.name,
				quantity: 1,
				unitPrice: item.unit_price / 100,
				total: item.unit_price / 100,
			},
		]);
		setShowPriceBook(false);
	};

	// Handle form submission
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		formData.set("lineItems", JSON.stringify(lineItems));
		formData.set("taxRate", taxRate.toString());
		formData.set("discountAmount", discountAmount.toString());
		formData.set("dueDate", dueDate);

		if (preselectedEstimateId) {
			formData.set("estimateId", preselectedEstimateId);
		}

		const result = await createInvoice(formData);

		if (!result.success) {
			setError(result.error || "Failed to create invoice");
			setIsLoading(false);
			return;
		}

		router.push(`/dashboard/work/invoices/${result.data}`);
	}

	return (
		<form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
			{/* Error Display */}
			{error && (
				<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
					<p className="font-medium text-destructive text-sm">{error}</p>
				</div>
			)}

			{/* Estimate Info (if pre-filled) */}
			{estimate && (
				<Card className="border-blue-200 bg-blue-50/50">
					<CardContent className="pt-6">
						<p className="text-muted-foreground text-sm">
							📋 Converting from <strong>{estimate.estimate_number}</strong>: {estimate.title}
						</p>
					</CardContent>
				</Card>
			)}

			{/* Customer Selection */}
			<Card>
				<CardHeader>
					<CardTitle>Customer & Property</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="customer-select">
							Customer <span className="text-destructive">*</span>
						</Label>
						<Select name="customerId" onValueChange={setSelectedCustomerId} required value={selectedCustomerId}>
							<SelectTrigger id="customer-select">
								<SelectValue placeholder="Select customer (⌘K)" />
							</SelectTrigger>
							<SelectContent>
								{customers.map((customer) => (
									<SelectItem key={customer.id} value={customer.id}>
										{customer.display_name || `${customer.first_name} ${customer.last_name}` || customer.email}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{selectedCustomerId && (
						<div className="space-y-2">
							<Label htmlFor="property-select">Property (Optional)</Label>
							<Select name="propertyId" onValueChange={setSelectedPropertyId} value={selectedPropertyId}>
								<SelectTrigger id="property-select">
									<SelectValue placeholder="Select property" />
								</SelectTrigger>
								<SelectContent>
									{customerProperties.map((property) => (
										<SelectItem key={property.id} value={property.id}>
											{property.name || property.address}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Invoice Details */}
			<Card>
				<CardHeader>
					<CardTitle>Invoice Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">
							Title <span className="text-destructive">*</span>
						</Label>
						<Input
							defaultValue={estimate?.title}
							id="title"
							name="title"
							placeholder="e.g., HVAC System Installation"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							defaultValue={estimate?.description || ""}
							id="description"
							name="description"
							placeholder="Additional details"
							rows={3}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="paymentTerms">Payment Terms</Label>
							<Select name="paymentTerms" onValueChange={setPaymentTerms} value={paymentTerms}>
								<SelectTrigger id="paymentTerms">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
									<SelectItem value="net_15">Net 15</SelectItem>
									<SelectItem value="net_30">Net 30</SelectItem>
									<SelectItem value="net_60">Net 60</SelectItem>
									<SelectItem value="net_90">Net 90</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="dueDate">Due Date</Label>
							<Input id="dueDate" onChange={(e) => setDueDate(e.target.value)} type="date" value={dueDate} />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Line Items */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Line Items</CardTitle>
						<div className="flex gap-2">
							<Button onClick={() => setShowPriceBook(!showPriceBook)} size="sm" type="button" variant="outline">
								Price Book
							</Button>
							<Button onClick={addLineItem} size="sm" type="button" variant="outline">
								<Plus className="mr-2 h-4 w-4" />
								Add Item
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{showPriceBook && (
						<div className="mb-4 rounded-lg border bg-muted/50 p-4">
							<div className="mb-2 flex items-center justify-between">
								<h4 className="font-medium">Price Book</h4>
								<Button onClick={() => setShowPriceBook(false)} size="sm" type="button" variant="ghost">
									<X className="h-4 w-4" />
								</Button>
							</div>
							<div className="space-y-2">
								{priceBookItems.map((item) => (
									<button
										className="w-full rounded-md border bg-background p-3 text-left hover:bg-accent"
										key={item.id}
										onClick={() => addFromPriceBook(item)}
										type="button"
									>
										<div className="flex justify-between">
											<div>
												<p className="font-medium">{item.name}</p>
												{item.description && <p className="text-muted-foreground text-sm">{item.description}</p>}
											</div>
											<p className="font-medium">${(item.unit_price / 100).toFixed(2)}</p>
										</div>
									</button>
								))}
							</div>
						</div>
					)}

					<div className="space-y-3">
						{lineItems.map((item) => (
							<div className="grid grid-cols-12 gap-3 rounded-lg border p-3" key={item.id}>
								<div className="col-span-5">
									<Input
										onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
										placeholder="Description"
										value={item.description}
									/>
								</div>
								<div className="col-span-2">
									<Input
										min="0.01"
										onChange={(e) => updateLineItem(item.id, "quantity", Number.parseFloat(e.target.value) || 0)}
										placeholder="Qty"
										step="0.01"
										type="number"
										value={item.quantity}
									/>
								</div>
								<div className="col-span-2">
									<Input
										min="0"
										onChange={(e) => updateLineItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
										placeholder="Price"
										step="0.01"
										type="number"
										value={item.unitPrice}
									/>
								</div>
								<div className="col-span-2">
									<Input className="bg-muted" disabled value={`$${item.total.toFixed(2)}`} />
								</div>
								<div className="col-span-1 flex items-center justify-center">
									<Button
										disabled={lineItems.length === 1}
										onClick={() => removeLineItem(item.id)}
										size="sm"
										type="button"
										variant="ghost"
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Pricing & Totals */}
			<Card>
				<CardHeader>
					<CardTitle>Pricing</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="taxRate">Tax Rate (%)</Label>
							<Input
								id="taxRate"
								max="100"
								min="0"
								onChange={(e) => setTaxRate(Number.parseFloat(e.target.value) || 0)}
								step="0.01"
								type="number"
								value={taxRate}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="discountAmount">Discount ($)</Label>
							<Input
								id="discountAmount"
								min="0"
								onChange={(e) => setDiscountAmount(Number.parseFloat(e.target.value) || 0)}
								step="0.01"
								type="number"
								value={discountAmount}
							/>
						</div>
					</div>

					<div className="space-y-2 rounded-lg border bg-muted/50 p-4">
						<div className="flex justify-between text-sm">
							<span>Subtotal:</span>
							<span>${subtotal.toFixed(2)}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span>Tax ({taxRate}%):</span>
							<span>${taxAmount.toFixed(2)}</span>
						</div>
						{discountAmount > 0 && (
							<div className="flex justify-between text-green-600 text-sm">
								<span>Discount:</span>
								<span>-${discountAmount.toFixed(2)}</span>
							</div>
						)}
						<div className="flex justify-between border-t pt-2 font-bold text-lg">
							<span>Total Due:</span>
							<span>${total.toFixed(2)}</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Terms & Notes */}
			<Card>
				<CardHeader>
					<CardTitle>Terms & Notes</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="terms">Terms & Conditions</Label>
						<Textarea id="terms" name="terms" placeholder="Payment terms, late fees, etc." rows={3} />
					</div>

					<div className="space-y-2">
						<Label htmlFor="notes">Internal Notes</Label>
						<Textarea id="notes" name="notes" placeholder="Notes for internal use" rows={2} />
					</div>
				</CardContent>
			</Card>

			{/* Actions */}
			<div className="flex justify-end gap-3">
				<Button disabled={isLoading} onClick={() => router.back()} type="button" variant="outline">
					Cancel (Esc)
				</Button>
				<Button disabled={isLoading} type="submit">
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					<Save className="mr-2 h-4 w-4" />
					Create Invoice (⌘S)
				</Button>
			</div>
		</form>
	);
}
