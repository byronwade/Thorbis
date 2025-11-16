"use client";

import { Loader2, PackageOpen, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPurchaseOrder } from "@/actions/purchase-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type VendorOption = {
	id: string;
	name: string;
	email?: string | null;
	phone?: string | null;
};

type JobOption = {
	id: string;
	label: string;
};

type LinkedOption = {
	id: string;
	number: string;
	title?: string | null;
};

type PriceBookItemOption = {
	id: string;
	name: string;
	sku?: string | null;
	unit?: string | null;
	description?: string | null;
	price: number;
};

type LineItem = {
	id: string;
	description: string;
	quantity: number;
	unitPrice: number;
	total: number;
	sku?: string | null;
	priceBookItemId?: string;
	unit?: string | null;
};

const createEmptyLineItem = (): LineItem => ({
	id: crypto.randomUUID(),
	description: "",
	quantity: 1,
	unitPrice: 0,
	total: 0,
});

const PO_STATUSES = [
	"draft",
	"pending_approval",
	"approved",
	"ordered",
	"partially_received",
	"received",
	"cancelled",
] as const;

const PRIORITIES = ["low", "normal", "high", "urgent"] as const;

type PurchaseOrderFormProps = {
	vendors: VendorOption[];
	jobs: JobOption[];
	estimates: LinkedOption[];
	invoices: LinkedOption[];
	priceBookItems: PriceBookItemOption[];
	defaults?: {
		vendorId?: string;
		jobId?: string;
		estimateId?: string;
		invoiceId?: string;
	};
};

export function PurchaseOrderForm({
	vendors,
	jobs,
	estimates,
	invoices,
	priceBookItems,
	defaults,
}: PurchaseOrderFormProps) {
	const router = useRouter();
	const { toast } = useToast();
	const formRef = useRef<HTMLFormElement>(null);
	const [vendorId, setVendorId] = useState(defaults?.vendorId || "");
	const [vendorName, setVendorName] = useState("");
	const [vendorEmail, setVendorEmail] = useState("");
	const [vendorPhone, setVendorPhone] = useState("");
	const [title, setTitle] = useState("");
	const [poNumber, _setPoNumber] = useState("");
	const [status, _setStatus] = useState<(typeof PO_STATUSES)[number]>("draft");
	const [priority, _setPriority] = useState<(typeof PRIORITIES)[number]>("normal");
	const [jobId, setJobId] = useState(defaults?.jobId || "");
	const [estimateId, setEstimateId] = useState(defaults?.estimateId || "");
	const [invoiceId, setInvoiceId] = useState(defaults?.invoiceId || "");
	const [expectedDelivery, setExpectedDelivery] = useState("");
	const [deliveryAddress, setDeliveryAddress] = useState("");
	const [shippingAmount, setShippingAmount] = useState("0.00");
	const [taxAmount, setTaxAmount] = useState("0.00");
	const [lineItems, setLineItems] = useState<LineItem[]>([createEmptyLineItem()]);
	const [notes, setNotes] = useState("");
	const [internalNotes, setInternalNotes] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isCatalogOpen, setIsCatalogOpen] = useState(false);

	const selectedVendor = vendors.find((vendor) => vendor.id === vendorId);

	useEffect(() => {
		if (selectedVendor) {
			setVendorName(selectedVendor.name);
			setVendorEmail(selectedVendor.email || "");
			setVendorPhone(selectedVendor.phone || "");
		}
	}, [selectedVendor]);

	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "s") {
				event.preventDefault();
				formRef.current?.requestSubmit();
			}
			if (event.key === "Escape") {
				event.preventDefault();
				router.back();
			}
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [router]);

	const subtotal = useMemo(() => lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0), [lineItems]);

	const total = subtotal + (Number.parseFloat(shippingAmount || "0") || 0) + (Number.parseFloat(taxAmount || "0") || 0);

	const updateLineItem = (id: string, updates: Partial<Omit<LineItem, "id">>) => {
		setLineItems((prev) =>
			prev.map((item) =>
				item.id === id
					? {
							...item,
							...updates,
							total: (updates.quantity ?? item.quantity) * (updates.unitPrice ?? item.unitPrice),
						}
					: item
			)
		);
	};

	const addLineItem = () => {
		setLineItems((prev) => [...prev, createEmptyLineItem()]);
	};

	const removeLineItem = (id: string) => {
		setLineItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
	};

	const addLineFromCatalog = (item: PriceBookItemOption) => {
		setLineItems((prev) => [
			...prev,
			{
				id: crypto.randomUUID(),
				description: `${item.name}${item.sku ? ` (${item.sku})` : ""}`,
				quantity: 1,
				unitPrice: (item.price || 0) / 100,
				total: (item.price || 0) / 100,
				sku: item.sku,
				priceBookItemId: item.id,
				unit: item.unit,
			},
		]);
		setIsCatalogOpen(false);
	};

	const toCents = (value: string | number) => Math.round((Number(value) || 0) * 100);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!vendorName.trim()) {
			setError("Vendor name is required.");
			return;
		}

		if (!lineItems.every((item) => item.description && item.quantity > 0)) {
			setError("Each line item requires a description and quantity.");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const payload = new FormData();

			if (vendorId) {
				payload.append("vendor_id", vendorId);
			}
			payload.append("vendor", vendorName.trim());
			payload.append("vendor_email", vendorEmail);
			payload.append("vendor_phone", vendorPhone);
			payload.append("title", title.trim() || "Purchase Order");
			if (poNumber) {
				payload.append("po_number", poNumber.trim());
			}
			payload.append("status", status);
			payload.append("priority", priority);
			if (jobId) {
				payload.append("job_id", jobId);
			}
			if (estimateId) {
				payload.append("estimate_id", estimateId);
			}
			if (invoiceId) {
				payload.append("invoice_id", invoiceId);
			}
			if (expectedDelivery) {
				payload.append("expected_delivery", expectedDelivery);
			}
			payload.append("delivery_address", deliveryAddress);
			payload.append("shipping_amount", toCents(shippingAmount).toString());
			payload.append("tax_amount", toCents(taxAmount).toString());

			const formattedLineItems = lineItems.map((item) => ({
				description: item.description,
				quantity: item.quantity,
				unit_price: toCents(item.unitPrice),
				total: toCents(item.total),
				sku: item.sku,
				unit: item.unit,
				price_book_item_id: item.priceBookItemId,
			}));

			payload.append("line_items", JSON.stringify(formattedLineItems));
			payload.append("subtotal", toCents(subtotal).toString());
			payload.append("total_amount", toCents(total).toString());
			payload.append("notes", notes);
			payload.append("internal_notes", internalNotes);

			const result = await createPurchaseOrder(payload);

			if (!result.success) {
				setError(result.error || "Failed to create purchase order.");
				setIsSubmitting(false);
				return;
			}

			toast.success("Purchase order created.");
			router.push(`/dashboard/work/purchase-orders/${result.data}`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong while creating the purchase order.");
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Command className="hidden" data-state={isCatalogOpen ? "open" : "closed"} />
			<form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
				<div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="font-semibold text-sm">Keyboard Shortcuts</p>
						<p className="text-muted-foreground text-xs">⌘/Ctrl + S to save • Esc to cancel</p>
					</div>
					<div className="flex gap-2">
						<Button onClick={() => setIsCatalogOpen(true)} size="sm" type="button" variant="outline">
							<PackageOpen className="mr-2 size-4" />
							Add from Price Book
						</Button>
						<Button asChild size="sm" variant="ghost">
							<Link href="/dashboard/work/purchase-orders">Back to Purchase Orders</Link>
						</Button>
					</div>
				</div>

				{error && (
					<div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-destructive text-sm">
						{error}
					</div>
				)}

				<Card>
					<CardHeader>
						<CardTitle>Vendor</CardTitle>
						<CardDescription>Select or enter vendor details for this purchase order</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="vendorSelect">Vendor</Label>
								<Select onValueChange={setVendorId} value={vendorId}>
									<SelectTrigger id="vendorSelect">
										<SelectValue placeholder="Select vendor" />
									</SelectTrigger>
									<SelectContent className="max-h-[260px]">
										{vendors.map((vendor) => (
											<SelectItem key={vendor.id} value={vendor.id}>
												{vendor.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="vendorName">Vendor Name</Label>
								<Input
									id="vendorName"
									onChange={(event) => setVendorName(event.target.value)}
									placeholder="e.g., Ferguson Plumbing"
									required
									value={vendorName}
								/>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="vendorEmail">Vendor Email</Label>
								<Input
									id="vendorEmail"
									onChange={(event) => setVendorEmail(event.target.value)}
									placeholder="contact@vendor.com"
									type="email"
									value={vendorEmail}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="vendorPhone">Vendor Phone</Label>
								<Input
									id="vendorPhone"
									onChange={(event) => setVendorPhone(event.target.value)}
									placeholder="(555) 555-5555"
									value={vendorPhone}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Links & Metadata</CardTitle>
						<CardDescription>Associate this PO with jobs, estimates, and invoices</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="jobSelect">Linked Job</Label>
								<Select onValueChange={setJobId} value={jobId}>
									<SelectTrigger id="jobSelect">
										<SelectValue placeholder="Optional" />
									</SelectTrigger>
									<SelectContent className="max-h-[260px]">
										{jobs.map((job) => (
											<SelectItem key={job.id} value={job.id}>
												{job.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="estimateSelect">Linked Estimate</Label>
								<Select onValueChange={setEstimateId} value={estimateId}>
									<SelectTrigger id="estimateSelect">
										<SelectValue placeholder="Optional" />
									</SelectTrigger>
									<SelectContent className="max-h-[260px]">
										{estimates.map((estimate) => (
											<SelectItem key={estimate.id} value={estimate.id}>
												{estimate.number} {estimate.title && `• ${estimate.title}`}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="invoiceSelect">Linked Invoice</Label>
								<Select onValueChange={setInvoiceId} value={invoiceId}>
									<SelectTrigger id="invoiceSelect">
										<SelectValue placeholder="Optional" />
									</SelectTrigger>
									<SelectContent className="max-h-[260px]">
										{invoices.map((invoice) => (
											<SelectItem key={invoice.id} value={invoice.id}>
												{invoice.number} {invoice.title && `• ${invoice.title}`}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="poTitle">PO Title</Label>
								<Input
									id="poTitle"
									onChange={(event) => setTitle(event.target.value)}
									placeholder="e.g., Rooftop RTU Replacement"
									required
									value={title}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Line Items</CardTitle>
						<CardDescription>Cost lines that will appear on the purchase order</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{lineItems.map((item) => (
							<div className="rounded-lg border p-4" key={item.id}>
								<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
									<div className="flex-1 space-y-2">
										<Label>Description</Label>
										<Textarea
											onChange={(event) =>
												updateLineItem(item.id, {
													description: event.target.value,
												})
											}
											placeholder="Material description"
											required
											value={item.description}
										/>
									</div>
									<Button
										className="self-start"
										disabled={lineItems.length === 1}
										onClick={() => removeLineItem(item.id)}
										size="sm"
										type="button"
										variant="ghost"
									>
										<Trash2 className="size-4" />
									</Button>
								</div>

								<div className="mt-4 grid gap-4 sm:grid-cols-3">
									<div className="space-y-2">
										<Label>Quantity</Label>
										<Input
											min="1"
											onChange={(event) =>
												updateLineItem(item.id, {
													quantity: Number.parseInt(event.target.value || "1", 10),
												})
											}
											type="number"
											value={item.quantity}
										/>
									</div>
									<div className="space-y-2">
										<Label>Unit Price</Label>
										<Input
											min="0"
											onChange={(event) =>
												updateLineItem(item.id, {
													unitPrice: Number.parseFloat(event.target.value || "0") || 0,
												})
											}
											step="0.01"
											type="number"
											value={item.unitPrice}
										/>
									</div>
									<div className="space-y-2">
										<Label>Line Total</Label>
										<Input disabled readOnly value={item.total.toFixed(2)} />
									</div>
								</div>
							</div>
						))}

						<Button onClick={addLineItem} size="sm" type="button" variant="outline">
							<Plus className="mr-2 size-4" />
							Add Line Item
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Totals & Delivery</CardTitle>
						<CardDescription>Shipping, tax, expected delivery, and address</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-3">
							<div className="space-y-2">
								<Label>Subtotal</Label>
								<Input disabled readOnly value={`$${subtotal.toFixed(2)}`} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="taxAmount">Tax</Label>
								<Input
									id="taxAmount"
									min="0"
									onChange={(event) => setTaxAmount(event.target.value)}
									step="0.01"
									type="number"
									value={taxAmount}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="shippingAmount">Shipping</Label>
								<Input
									id="shippingAmount"
									min="0"
									onChange={(event) => setShippingAmount(event.target.value)}
									step="0.01"
									type="number"
									value={shippingAmount}
								/>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="expectedDelivery">Expected delivery</Label>
								<Input
									id="expectedDelivery"
									onChange={(event) => setExpectedDelivery(event.target.value)}
									type="date"
									value={expectedDelivery}
								/>
							</div>
							<div className="space-y-2">
								<Label>Total</Label>
								<Input disabled readOnly value={`$${total.toFixed(2)}`} />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="deliveryAddress">Delivery address</Label>
							<Textarea
								id="deliveryAddress"
								onChange={(event) => setDeliveryAddress(event.target.value)}
								placeholder="e.g., 123 Service Rd, Suite 200"
								value={deliveryAddress}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Notes</CardTitle>
						<CardDescription>Customer-facing notes and internal comments</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="notes">Notes</Label>
							<Textarea
								id="notes"
								onChange={(event) => setNotes(event.target.value)}
								placeholder="Special instructions for vendor..."
								value={notes}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="internalNotes">Internal notes</Label>
							<Textarea
								id="internalNotes"
								onChange={(event) => setInternalNotes(event.target.value)}
								placeholder="Internal comments, approvals, etc."
								value={internalNotes}
							/>
						</div>
					</CardContent>
				</Card>

				<div className="flex items-center justify-end gap-3 pb-8">
					<Button disabled={isSubmitting} onClick={() => router.back()} type="button" variant="outline">
						Cancel
					</Button>
					<Button disabled={isSubmitting} type="submit">
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Saving
							</>
						) : (
							<>
								<Save className="mr-2 size-4" />
								Create Purchase Order
							</>
						)}
					</Button>
				</div>
			</form>

			<CommandDialog onOpenChange={setIsCatalogOpen} open={isCatalogOpen}>
				<CommandInput placeholder="Search price book items..." />
				<CommandList>
					<CommandEmpty>No items found.</CommandEmpty>
					<CommandGroup heading="Price Book">
						{priceBookItems.map((item) => (
							<CommandItem key={item.id} onSelect={() => addLineFromCatalog(item)}>
								<div className="flex flex-col">
									<span className="font-medium text-sm">{item.name}</span>
									<span className="text-muted-foreground text-xs">
										{item.sku || "Uncoded"} • Unit ${((item.price || 0) / 100).toFixed(2)}
									</span>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
