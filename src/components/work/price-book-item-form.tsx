"use client";

import { Calculator, DollarSign, Loader2, Plus, Save, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPriceBookItem } from "@/actions/pricebook";
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
import { useToast } from "@/hooks/use-toast";

type ItemType = "service" | "material" | "equipment";

export type CategoryOption = {
	id: string;
	name: string;
	fullPath: string;
};

export type SupplierOption = {
	id: string;
	label: string;
};

type FormState = {
	itemType: ItemType;
	name: string;
	sku: string;
	description: string;
	categoryId: string;
	subcategory: string;
	cost: string;
	price: string;
	markupPercent: string;
	unit: string;
	minimumQuantity: string;
	isActive: boolean;
	isTaxable: boolean;
	supplierId: string;
	supplierSku: string;
	tags: string[];
	notes: string;
	priceTier: "standard" | "good" | "better" | "best";
	isFlatRate: boolean;
	laborHours: string;
	imageUrl: string;
};

const itemTypeOptions: { label: string; value: ItemType }[] = [
	{ label: "Service", value: "service" },
	{ label: "Material", value: "material" },
	{ label: "Equipment", value: "equipment" },
];

const unitOptions = [
	"each",
	"job",
	"hour",
	"linear_ft",
	"sq_ft",
	"lb",
	"gal",
	"set",
	"unit",
];

const priceTierOptions: FormState["priceTier"][] = [
	"standard",
	"good",
	"better",
	"best",
];

const createInitialState = (
	defaultCategoryId: string,
	overrides?: Partial<FormState>,
): FormState => ({
	itemType: "service",
	name: "",
	sku: "",
	description: "",
	categoryId: defaultCategoryId,
	subcategory: "",
	cost: "",
	price: "",
	markupPercent: "",
	unit: "each",
	minimumQuantity: "0",
	isActive: true,
	isTaxable: true,
	supplierId: "",
	supplierSku: "",
	tags: [],
	notes: "",
	priceTier: "standard",
	isFlatRate: false,
	laborHours: "",
	imageUrl: "",
	...overrides,
});

type PriceBookItemFormProps = {
	categories: CategoryOption[];
	suppliers: SupplierOption[];
	initialData?: Partial<FormState>;
};

const toNumber = (value: string) => Number.parseFloat(value || "0") || 0;

export function PriceBookItemForm({
	categories,
	suppliers,
	initialData,
}: PriceBookItemFormProps) {
	const router = useRouter();
	const { toast } = useToast();
	const formRef = useRef<HTMLFormElement>(null);
	const isEditing = Boolean(initialData);
	const defaultCategoryId = initialData?.categoryId || categories[0]?.id || "";
	const [formState, setFormState] = useState<FormState>(() =>
		createInitialState(defaultCategoryId, initialData),
	);
	const [tagInput, setTagInput] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const hasCategories = categories.length > 0;
	const selectedCategory = useMemo(
		() => categories.find((category) => category.id === formState.categoryId),
		[categories, formState.categoryId],
	);

	const calculateMarkup = (cost: string, price: string) => {
		const costValue = toNumber(cost);
		const priceValue = toNumber(price);
		if (costValue > 0 && priceValue > 0) {
			return (((priceValue - costValue) / costValue) * 100).toFixed(1);
		}
		return "";
	};

	const calculatePrice = (cost: string, markup: string) => {
		const costValue = toNumber(cost);
		const markupValue = toNumber(markup);
		if (costValue > 0 && markupValue > 0) {
			return (costValue * (1 + markupValue / 100)).toFixed(2);
		}
		return "";
	};

	const handleCostChange = (value: string) => {
		setFormState((prev) => {
			const next = { ...prev, cost: value };
			if (prev.price) {
				next.markupPercent = calculateMarkup(value, prev.price);
			} else if (prev.markupPercent) {
				next.price = calculatePrice(value, prev.markupPercent);
			}
			return next;
		});
	};

	const handlePriceChange = (value: string) => {
		setFormState((prev) => ({
			...prev,
			price: value,
			markupPercent: calculateMarkup(prev.cost, value),
		}));
	};

	const handleMarkupChange = (value: string) => {
		setFormState((prev) => ({
			...prev,
			markupPercent: value,
			price: calculatePrice(prev.cost, value),
		}));
	};

	const handleLaborCalculation = (calculation: {
		total: number;
		suggestedPrice: number;
		suggestedMarkup: number;
		description?: string;
	}) => {
		setFormState((prev) => ({
			...prev,
			cost: (calculation.total / 100).toFixed(2),
			price: (calculation.suggestedPrice / 100).toFixed(2),
			markupPercent: (
				(calculation.suggestedMarkup / calculation.total) *
				100
			).toFixed(1),
			name: prev.name || calculation.description || "Labor Service",
			itemType: "service",
		}));
	};

	const handleAddTag = () => {
		const value = tagInput.trim();
		if (value && !formState.tags.includes(value)) {
			setFormState((prev) => ({ ...prev, tags: [...prev.tags, value] }));
			setTagInput("");
		}
	};

	const handleRemoveTag = (tag: string) => {
		setFormState((prev) => ({
			...prev,
			tags: prev.tags.filter((existing) => existing !== tag),
		}));
	};

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

	const profitMargin =
		formState.cost && formState.price
			? ((toNumber(formState.price) - toNumber(formState.cost)) /
					toNumber(formState.price || "1")) *
				100
			: 0;

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!(hasCategories && formState.categoryId)) {
			setError("Add at least one category before creating price book items.");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const payload = new FormData();
			payload.append("itemType", formState.itemType);
			payload.append("name", formState.name.trim());
			payload.append("sku", formState.sku.trim());
			payload.append("description", formState.description);
			payload.append("categoryId", formState.categoryId);
			payload.append("subcategory", formState.subcategory);
			payload.append("unit", formState.unit);
			payload.append("cost", toNumber(formState.cost).toString());
			payload.append("price", toNumber(formState.price).toString());
			payload.append(
				"markupPercent",
				toNumber(formState.markupPercent).toString(),
			);
			payload.append("minimumQuantity", formState.minimumQuantity || "0");
			payload.append("isActive", String(formState.isActive));
			payload.append("isTaxable", String(formState.isTaxable));
			if (formState.supplierId) {
				payload.append("supplierId", formState.supplierId);
			}
			payload.append("supplierSku", formState.supplierSku);
			payload.append("tags", JSON.stringify(formState.tags));
			payload.append("notes", formState.notes);
			payload.append("priceTier", formState.priceTier);
			payload.append("isFlatRate", String(formState.isFlatRate));
			payload.append("laborHours", formState.laborHours);
			payload.append("imageUrl", formState.imageUrl);

			const result = await createPriceBookItem(payload);

			if (!result.success) {
				setError(result.error || "Failed to create price book item.");
				setIsSubmitting(false);
				return;
			}

			toast.success("Price book item created.");
			router.push(`/dashboard/work/pricebook/${result.data}`);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Something went wrong while saving the item.",
			);
			setIsSubmitting(false);
		}
	};

	return (
		<form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
			<div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="font-semibold text-sm">Keyboard Shortcuts</p>
					<p className="text-muted-foreground text-xs">
						⌘/Ctrl + S to save • Esc to cancel
					</p>
				</div>
				<Button asChild size="sm" variant="ghost">
					<Link href="/dashboard/work/pricebook">Back to Price Book</Link>
				</Button>
			</div>

			{error && (
				<div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-destructive text-sm">
					{error}
				</div>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Basic Information</CardTitle>
					<CardDescription>
						Tell technicians and CSRs what this item is used for
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{!hasCategories && (
						<div className="rounded-lg border border-amber-300 border-dashed bg-amber-50/60 p-4 text-amber-900 text-sm">
							Add at least one category in the Price Book before creating items.
						</div>
					)}
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="itemType">Item Type</Label>
							<Select
								disabled={!hasCategories}
								onValueChange={(value: ItemType) =>
									setFormState((prev) => ({ ...prev, itemType: value }))
								}
								value={formState.itemType}
							>
								<SelectTrigger id="itemType">
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent>
									{itemTypeOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="sku">SKU / Code</Label>
							<Input
								disabled={!hasCategories}
								id="sku"
								maxLength={120}
								onChange={(event) =>
									setFormState((prev) => ({
										...prev,
										sku: event.target.value,
									}))
								}
								placeholder="e.g., HVAC-MAINT-ANNUAL"
								required
								value={formState.sku}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="name">Item Name</Label>
						<Input
							disabled={!hasCategories}
							id="name"
							onChange={(event) =>
								setFormState((prev) => ({
									...prev,
									name: event.target.value,
								}))
							}
							placeholder="e.g., Annual HVAC Tune-Up"
							required
							value={formState.name}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							disabled={!hasCategories}
							id="description"
							onChange={(event) =>
								setFormState((prev) => ({
									...prev,
									description: event.target.value,
								}))
							}
							placeholder="Add talking points, scope of work, or inclusions..."
							value={formState.description}
						/>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="categoryId">
								Category{" "}
								{selectedCategory && (
									<span className="text-muted-foreground text-xs">
										({selectedCategory.fullPath})
									</span>
								)}
							</Label>
							<Select
								disabled={!hasCategories}
								onValueChange={(value) =>
									setFormState((prev) => ({ ...prev, categoryId: value }))
								}
								value={formState.categoryId}
							>
								<SelectTrigger id="categoryId">
									<SelectValue placeholder="Select category" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem key={category.id} value={category.id}>
											{category.fullPath}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="subcategory">Subcategory (optional)</Label>
							<Input
								disabled={!hasCategories}
								id="subcategory"
								onChange={(event) =>
									setFormState((prev) => ({
										...prev,
										subcategory: event.target.value,
									}))
								}
								placeholder="e.g., Heating • Maintenance"
								value={formState.subcategory}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<CardTitle>Pricing</CardTitle>
							<CardDescription>
								Track cost, selling price, and markup for consistency
							</CardDescription>
						</div>
						{formState.itemType === "service" && (
							<LaborCalculatorModal
								onAddLabor={handleLaborCalculation}
								trigger={
									<Button size="sm" type="button" variant="outline">
										<Calculator className="mr-2 size-4" />
										Labor calculator
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
									disabled={!hasCategories}
									id="cost"
									onChange={(event) => handleCostChange(event.target.value)}
									placeholder="0.00"
									required
									step="0.01"
									type="number"
									value={formState.cost}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="price">Price</Label>
							<div className="relative">
								<DollarSign className="absolute top-3 left-3 size-4 text-muted-foreground" />
								<Input
									className="pl-9"
									disabled={!hasCategories}
									id="price"
									onChange={(event) => handlePriceChange(event.target.value)}
									placeholder="0.00"
									required
									step="0.01"
									type="number"
									value={formState.price}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="markupPercent">Markup %</Label>
							<Input
								disabled={!hasCategories}
								id="markupPercent"
								onChange={(event) => handleMarkupChange(event.target.value)}
								placeholder="0"
								step="0.1"
								type="number"
								value={formState.markupPercent}
							/>
						</div>
					</div>

					{formState.cost && formState.price && (
						<div className="rounded-lg border bg-muted/20 p-4 text-sm">
							<div className="grid gap-3 sm:grid-cols-3">
								<div>
									<p className="text-muted-foreground text-xs">
										Profit per unit
									</p>
									<p className="font-semibold text-emerald-600 dark:text-emerald-400">
										$
										{(
											toNumber(formState.price) - toNumber(formState.cost)
										).toFixed(2)}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground text-xs">Profit margin</p>
									<p className="font-semibold text-emerald-600 dark:text-emerald-400">
										{profitMargin.toFixed(1)}%
									</p>
								</div>
								<div>
									<p className="text-muted-foreground text-xs">
										Markup over cost
									</p>
									<p className="font-semibold">
										{formState.markupPercent || "0"}%
									</p>
								</div>
							</div>
						</div>
					)}

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="unit">Unit</Label>
							<Select
								disabled={!hasCategories}
								onValueChange={(value) =>
									setFormState((prev) => ({ ...prev, unit: value }))
								}
								value={formState.unit}
							>
								<SelectTrigger id="unit">
									<SelectValue placeholder="Select unit" />
								</SelectTrigger>
								<SelectContent>
									{unitOptions.map((unit) => (
										<SelectItem key={unit} value={unit}>
											{unit}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="minimumQuantity">Minimum quantity</Label>
							<Input
								disabled={!hasCategories}
								id="minimumQuantity"
								min="0"
								onChange={(event) =>
									setFormState((prev) => ({
										...prev,
										minimumQuantity: event.target.value,
									}))
								}
								type="number"
								value={formState.minimumQuantity}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Supplier Details</CardTitle>
					<CardDescription>
						Optional metadata for purchasing and vendor integrations
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="supplierId">Supplier (optional)</Label>
							<Select
								disabled={!suppliers.length}
								onValueChange={(value) =>
									setFormState((prev) => ({ ...prev, supplierId: value }))
								}
								value={formState.supplierId}
							>
								<SelectTrigger id="supplierId">
									<SelectValue
										placeholder={
											suppliers.length
												? "Select supplier"
												: "No suppliers connected"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{suppliers.map((supplier) => (
										<SelectItem key={supplier.id} value={supplier.id}>
											{supplier.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="supplierSku">Supplier SKU</Label>
							<Input
								id="supplierSku"
								onChange={(event) =>
									setFormState((prev) => ({
										...prev,
										supplierSku: event.target.value,
									}))
								}
								placeholder="Vendor item code"
								value={formState.supplierSku}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Pricing Strategy & Notes</CardTitle>
					<CardDescription>
						Control visibility, tiers, flat-rate behavior, and documentation
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="priceTier">Price Tier</Label>
							<Select
								onValueChange={(value: FormState["priceTier"]) =>
									setFormState((prev) => ({ ...prev, priceTier: value }))
								}
								value={formState.priceTier}
							>
								<SelectTrigger id="priceTier">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{priceTierOptions.map((tier) => (
										<SelectItem key={tier} value={tier}>
											{tier === "standard"
												? "Standard"
												: tier.charAt(0).toUpperCase() + tier.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="imageUrl">Image URL</Label>
							<Input
								id="imageUrl"
								onChange={(event) =>
									setFormState((prev) => ({
										...prev,
										imageUrl: event.target.value,
									}))
								}
								placeholder="https://example.com/image.jpg"
								type="url"
								value={formState.imageUrl}
							/>
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="flex items-center justify-between rounded-lg border bg-muted/20 p-4">
							<div className="space-y-0.5">
								<Label htmlFor="isActive">Active</Label>
								<p className="text-muted-foreground text-xs">
									Hide inactive items from estimates/invoices
								</p>
							</div>
							<Switch
								checked={formState.isActive}
								id="isActive"
								onCheckedChange={(checked) =>
									setFormState((prev) => ({ ...prev, isActive: checked }))
								}
							/>
						</div>

						<div className="flex items-center justify-between rounded-lg border bg-muted/20 p-4">
							<div className="space-y-0.5">
								<Label htmlFor="isTaxable">Taxable</Label>
								<p className="text-muted-foreground text-xs">
									Apply sales tax when invoiced
								</p>
							</div>
							<Switch
								checked={formState.isTaxable}
								id="isTaxable"
								onCheckedChange={(checked) =>
									setFormState((prev) => ({ ...prev, isTaxable: checked }))
								}
							/>
						</div>

						<div className="flex items-center justify-between rounded-lg border bg-muted/20 p-4">
							<div className="space-y-0.5">
								<Label htmlFor="isFlatRate">Flat Rate</Label>
								<p className="text-muted-foreground text-xs">
									Mark service as flat-rate (labor+materials included)
								</p>
							</div>
							<Switch
								checked={formState.isFlatRate}
								id="isFlatRate"
								onCheckedChange={(checked) =>
									setFormState((prev) => ({ ...prev, isFlatRate: checked }))
								}
							/>
						</div>

						{formState.itemType === "service" && (
							<div className="space-y-2">
								<Label htmlFor="laborHours">Labor Hours (optional)</Label>
								<Input
									id="laborHours"
									min="0"
									onChange={(event) =>
										setFormState((prev) => ({
											...prev,
											laborHours: event.target.value,
										}))
									}
									placeholder="e.g., 1.5"
									step="0.1"
									type="number"
									value={formState.laborHours}
								/>
							</div>
						)}
					</div>

					<div className="space-y-2">
						<Label>Tags</Label>
						<div className="flex gap-2">
							<Input
								onChange={(event) => setTagInput(event.target.value)}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										event.preventDefault();
										handleAddTag();
									}
								}}
								placeholder="Seasonal, premium, add-on..."
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
						{formState.tags.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{formState.tags.map((tag) => (
									<Badge key={tag} variant="secondary">
										{tag}
										<button
											className="ml-1.5 rounded-sm hover:bg-background/60"
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
				</CardContent>
			</Card>

			{/* Submit Actions */}
			<div className="flex items-center justify-end gap-3">
				<Button
					disabled={isSubmitting}
					onClick={() => router.back()}
					type="button"
					variant="outline"
				>
					Cancel
				</Button>
				<Button disabled={isSubmitting} type="submit">
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 size-4 animate-spin" />
							Saving...
						</>
					) : (
						<>
							<Save className="mr-2 size-4" />
							{isEditing ? "Update Item" : "Create Item"}
						</>
					)}
				</Button>
			</div>
		</form>
	);
}
