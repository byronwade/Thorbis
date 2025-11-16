"use client";

/**
 * Settings > Pricebook Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
	DollarSign,
	HelpCircle,
	Loader2,
	Package,
	Percent,
	Plus,
	Receipt,
	Save,
	Trash2,
	TrendingUp,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getPricebookSettings, updatePricebookSettings } from "@/actions/settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Constants
const _SIMULATED_API_DELAY = 1500;
const DEFAULT_MARKUP_PERCENT = 50;
const DEFAULT_MAX_DISCOUNT = 20;
const DEFAULT_LOW_STOCK_THRESHOLD = 10;
const PERCENTAGE_MULTIPLIER = 100;

type LaborRate = {
	id: string;
	description: string;
	hourlyCost: number;
	hourlyPrice: number;
	defaultFlatRate: number;
	isDefault: boolean;
};

type MaterialMarkup = {
	id: string;
	name: string;
	costFrom: number;
	costTo: number | null;
	markupPercent: number;
	profitPercent: number;
};

type TaxRate = {
	id: string;
	name: string;
	rate: number;
	applyToLabor: boolean;
	applyToMaterials: boolean;
	isDefault: boolean;
};

type PriceBookSettings = {
	// Pricing Model
	pricingModel: "flat_rate" | "hourly" | "both";

	// Pricing Strategy
	defaultMarkupPercent: number;
	useMarkupPricing: boolean;
	roundPrices: boolean;
	roundToNearest: number; // 1, 5, 10, 25, 50, 100
	showCostToTechs: boolean;
	requireApprovalForDiscounts: boolean;
	maxDiscountPercent: number;

	// Item Management
	requireDescription: boolean;
	requireCost: boolean;
	trackInventory: boolean;
	warnLowStock: boolean;
	lowStockThreshold: number;

	// Pricing Tiers
	enableTieredPricing: boolean;
	tierNames: string[];
	tierMultipliers: number[];

	// Tax Settings
	enableTax: boolean;
	defaultTaxRate: number;
	taxLabel: string;
	includeTaxInPrice: boolean;
};

export default function PriceBookSettingsPage() {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [isLoading, setIsLoading] = useState(true);
	const [_isSubmitting, _setIsSubmitting] = useState(false);

	const [laborRates, setLaborRates] = useState<LaborRate[]>([
		{
			id: "1",
			description: "Default",
			hourlyCost: 278.0,
			hourlyPrice: 350.0,
			defaultFlatRate: 0,
			isDefault: true,
		},
		{
			id: "2",
			description: "Overtime - Default",
			hourlyCost: 0.0,
			hourlyPrice: 609.0,
			defaultFlatRate: 0,
			isDefault: false,
		},
		{
			id: "3",
			description: "Overtime - Property Management",
			hourlyCost: 0.0,
			hourlyPrice: 277.5,
			defaultFlatRate: 0,
			isDefault: false,
		},
		{
			id: "4",
			description: "Property Management",
			hourlyCost: 60.0,
			hourlyPrice: 185.0,
			defaultFlatRate: 0,
			isDefault: false,
		},
		{
			id: "5",
			description: "Break Even - May 2025",
			hourlyCost: 278.0,
			hourlyPrice: 350.0,
			defaultFlatRate: 0,
			isDefault: false,
		},
	]);

	const [materialMarkups, setMaterialMarkups] = useState<MaterialMarkup[]>([
		{
			id: "1",
			name: "Markup 1",
			costFrom: 0.01,
			costTo: 1.0,
			markupPercent: 400.0,
			profitPercent: 80.0,
		},
		{
			id: "2",
			name: "Markup 2",
			costFrom: 1.01,
			costTo: 5.0,
			markupPercent: 300.0,
			profitPercent: 75.0,
		},
		{
			id: "3",
			name: "Markup 3",
			costFrom: 5.01,
			costTo: 10.0,
			markupPercent: 250.0,
			profitPercent: 71.43,
		},
		{
			id: "4",
			name: "Markup 4",
			costFrom: 10.01,
			costTo: 25.0,
			markupPercent: 200.0,
			profitPercent: 66.67,
		},
		{
			id: "5",
			name: "Markup 5",
			costFrom: 25.01,
			costTo: 50.0,
			markupPercent: 150.0,
			profitPercent: 60.0,
		},
		{
			id: "6",
			name: "Markup 6",
			costFrom: 50.01,
			costTo: 75.0,
			markupPercent: 125.0,
			profitPercent: 55.56,
		},
		{
			id: "7",
			name: "Markup 7",
			costFrom: 75.01,
			costTo: 100.0,
			markupPercent: 100.0,
			profitPercent: 50.0,
		},
		{
			id: "8",
			name: "Markup 8",
			costFrom: 100.01,
			costTo: 300.0,
			markupPercent: 75.0,
			profitPercent: 42.86,
		},
		{
			id: "9",
			name: "Markup 9",
			costFrom: 300.01,
			costTo: 500.0,
			markupPercent: 60.0,
			profitPercent: 37.5,
		},
		{
			id: "10",
			name: "Markup 10",
			costFrom: 500.01,
			costTo: null,
			markupPercent: 50.0,
			profitPercent: 33.33,
		},
	]);

	const [_taxRates, setTaxRates] = useState<TaxRate[]>([
		{
			id: "1",
			name: "Sales Tax",
			rate: 8.5,
			applyToLabor: true,
			applyToMaterials: true,
			isDefault: true,
		},
	]);

	const [settings, setSettings] = useState<PriceBookSettings>({
		// Pricing Model
		pricingModel: "both", // flat_rate, hourly, or both

		// Pricing Strategy
		defaultMarkupPercent: DEFAULT_MARKUP_PERCENT,
		useMarkupPricing: true,
		roundPrices: true,
		roundToNearest: 5,
		showCostToTechs: false,
		requireApprovalForDiscounts: true,
		maxDiscountPercent: DEFAULT_MAX_DISCOUNT,

		// Item Management
		requireDescription: true,
		requireCost: true,
		trackInventory: false,
		warnLowStock: true,
		lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,

		// Pricing Tiers
		enableTieredPricing: true,
		tierNames: ["Standard", "Premium", "Emergency"],
		tierMultipliers: [1.0, 1.25, 1.5],

		// Tax Settings
		enableTax: true,
		defaultTaxRate: 8.5,
		taxLabel: "Sales Tax",
		includeTaxInPrice: false,
	});

	// Load settings from database on mount
	useEffect(() => {
		async function loadSettings() {
			setIsLoading(true);
			try {
				const result = await getPricebookSettings();

				if (result.success && result.data) {
					setSettings((prev) => ({
						...prev,
						showCostToTechs: result.data.show_cost_prices ?? true,
						defaultMarkupPercent: result.data.markup_default_percentage ?? 50,
						requireDescription: result.data.require_categories ?? true,
						// Other fields can be extended as needed
					}));
				}
			} catch (_error) {
				toast.error("Failed to load pricebook settings");
			} finally {
				setIsLoading(false);
			}
		}

		loadSettings();
	}, [toast]);

	const updateSetting = <K extends keyof PriceBookSettings>(key: K, value: PriceBookSettings[K]) => {
		setSettings((prev) => ({ ...prev, [key]: value }));
	};

	// Labor Rate handlers
	const addLaborRate = () => {
		const newRate: LaborRate = {
			id: Math.random().toString(),
			description: "",
			hourlyCost: 0,
			hourlyPrice: 0,
			defaultFlatRate: 0,
			isDefault: false,
		};
		setLaborRates((prev) => [...prev, newRate]);
	};

	const removeLaborRate = (id: string) => {
		setLaborRates((prev) => prev.filter((rate) => rate.id !== id));
	};

	const updateLaborRate = (id: string, field: keyof LaborRate, value: string | number | boolean) => {
		setLaborRates((prev) => prev.map((rate) => (rate.id === id ? { ...rate, [field]: value } : rate)));
	};

	// Material Markup handlers
	const addMaterialMarkup = () => {
		if (materialMarkups.length >= 100) {
			return; // Max 100 tiers
		}
		const lastMarkup = materialMarkups.at(-1);
		const newMarkup: MaterialMarkup = {
			id: Math.random().toString(),
			name: `Markup ${materialMarkups.length + 1}`,
			costFrom: lastMarkup?.costTo ? lastMarkup.costTo + 0.01 : 0.01,
			costTo: null,
			markupPercent: 50.0,
			profitPercent: 33.33,
		};
		// Update previous last markup to have a costTo if it was null
		if (lastMarkup && lastMarkup.costTo === null) {
			setMaterialMarkups((prev) =>
				prev.map((markup, index) =>
					index === prev.length - 1 ? { ...markup, costTo: newMarkup.costFrom - 0.01 } : markup
				)
			);
		}
		setMaterialMarkups((prev) => [...prev, newMarkup]);
	};

	const removeMaterialMarkup = (id: string) => {
		setMaterialMarkups((prev) => {
			const filtered = prev.filter((markup) => markup.id !== id);
			// Update last markup to have null costTo
			const lastMarkup = filtered.at(-1);
			if (lastMarkup) {
				lastMarkup.costTo = null;
			}
			return filtered;
		});
	};

	const updateMaterialMarkup = (id: string, field: keyof MaterialMarkup, value: string | number | null) => {
		setMaterialMarkups((prev) =>
			prev.map((markup) => {
				if (markup.id === id) {
					const updated = { ...markup, [field]: value };
					// Auto-calculate profit percent when markup percent changes
					if (field === "markupPercent" && typeof value === "number") {
						updated.profitPercent = Number(((value / (100 + value)) * 100).toFixed(2));
					}
					return updated;
				}
				return markup;
			})
		);
	};

	// Tax Rate handlers
	const _addTaxRate = () => {
		const newTaxRate: TaxRate = {
			id: Math.random().toString(),
			name: "",
			rate: 0,
			applyToLabor: true,
			applyToMaterials: true,
			isDefault: false,
		};
		setTaxRates((prev) => [...prev, newTaxRate]);
	};

	const _removeTaxRate = (id: string) => {
		setTaxRates((prev) => prev.filter((tax) => tax.id !== id));
	};

	const _updateTaxRate = (id: string, field: keyof TaxRate, value: string | number | boolean) => {
		setTaxRates((prev) => prev.map((tax) => (tax.id === id ? { ...tax, [field]: value } : tax)));
	};

	async function handleSave() {
		startTransition(async () => {
			const formData = new FormData();
			formData.append("showCostPrices", settings.showCostToTechs.toString());
			formData.append("markupDefaultPercentage", settings.defaultMarkupPercent.toString());
			formData.append("requireCategories", settings.requireDescription.toString());
			formData.append("allowCustomItems", "true");
			formData.append("showItemCodes", "true");
			formData.append("showItemDescriptions", "true");

			const result = await updatePricebookSettings(formData);

			if (result.success) {
				toast.success("Pricebook settings saved successfully");
			} else {
				toast.error(result.error || "Failed to save pricebook settings");
			}
		});
	}

	const examplePrice = 100;

	if (isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<Loader2 className="size-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<TooltipProvider>
			<div className="space-y-6">
				{/* Header */}
				<div>
					<h1 className="font-bold text-4xl tracking-tight">Price Book Settings</h1>
					<p className="mt-2 text-muted-foreground">Configure pricing rules, markup, discounts, and tax calculation</p>
				</div>

				<Separator />

				{/* Pricing Model Selection */}
				<Card className="border-primary/50 bg-primary/5">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<DollarSign className="size-4" />
							Pricing Model
							<Tooltip>
								<TooltipTrigger>
									<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent>
									<p className="max-w-xs">Choose how your shop prices services: flat rate, hourly, or both</p>
								</TooltipContent>
							</Tooltip>
						</CardTitle>
						<CardDescription>
							This determines which pricing sections are enabled and visible throughout the system
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<Label className="font-medium text-sm">How does your shop price services?</Label>
								<Select
									onValueChange={(value) => updateSetting("pricingModel", value as "flat_rate" | "hourly" | "both")}
									value={settings.pricingModel}
								>
									<SelectTrigger className="mt-2">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="flat_rate">Flat Rate Only - Fixed prices per service</SelectItem>
										<SelectItem value="hourly">Hourly Only - Time and materials</SelectItem>
										<SelectItem value="both">Both - Flat rate and hourly pricing</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="rounded-lg border bg-background p-4">
								<p className="mb-2 font-medium text-sm">
									{settings.pricingModel === "flat_rate" && "Flat Rate Pricing"}
									{settings.pricingModel === "hourly" && "Hourly Pricing"}
									{settings.pricingModel === "both" && "Hybrid Pricing Model"}
								</p>
								<p className="text-muted-foreground text-xs">
									{settings.pricingModel === "flat_rate" &&
										"Your shop uses fixed prices for services. Labor rates and hourly pricing will be hidden. Flat rate pricing provides predictable costs for customers and can increase profitability."}
									{settings.pricingModel === "hourly" &&
										"Your shop charges by the hour plus materials. Flat rate options will be hidden. Hourly pricing is ideal for unpredictable jobs or when customers prefer detailed time tracking."}
									{settings.pricingModel === "both" &&
										"Your shop offers both pricing models. All pricing options will be available. This gives you flexibility to choose the best pricing method for each type of job."}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Labor Rates - Only show if hourly or both */}
				{(settings.pricingModel === "hourly" || settings.pricingModel === "both") && (
					<Card>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div>
									<CardTitle className="flex items-center gap-2 text-base">
										<DollarSign className="size-4" />
										Labor Rates
									</CardTitle>
									<CardDescription>Set hourly costs and pricing for different labor types</CardDescription>
								</div>
								<Button onClick={addLaborRate} size="sm" variant="outline">
									<Plus className="mr-2 size-4" />
									Add Rate
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Description</TableHead>
											<TableHead className="text-right">Hourly Cost</TableHead>
											<TableHead className="text-right">Hourly Price</TableHead>
											<TableHead className="text-right">Default Flat Rate</TableHead>
											<TableHead className="w-[100px]">Default</TableHead>
											<TableHead className="w-[80px]" />
										</TableRow>
									</TableHeader>
									<TableBody>
										{laborRates.map((rate) => (
											<TableRow key={rate.id}>
												<TableCell>
													<Input
														className="min-w-[200px]"
														onChange={(e) => updateLaborRate(rate.id, "description", e.target.value)}
														placeholder="e.g., Default"
														value={rate.description}
													/>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex items-center justify-end gap-1">
														<span className="text-muted-foreground">$</span>
														<Input
															className="w-28 text-right"
															min="0"
															onChange={(e) => updateLaborRate(rate.id, "hourlyCost", Number(e.target.value))}
															step="0.01"
															type="number"
															value={rate.hourlyCost}
														/>
													</div>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex items-center justify-end gap-1">
														<span className="text-muted-foreground">$</span>
														<Input
															className="w-28 text-right"
															min="0"
															onChange={(e) => updateLaborRate(rate.id, "hourlyPrice", Number(e.target.value))}
															step="0.01"
															type="number"
															value={rate.hourlyPrice}
														/>
													</div>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex items-center justify-end gap-1">
														<span className="text-muted-foreground">$</span>
														<Input
															className="w-28 text-right"
															min="0"
															onChange={(e) => updateLaborRate(rate.id, "defaultFlatRate", Number(e.target.value))}
															step="0.01"
															type="number"
															value={rate.defaultFlatRate}
														/>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex justify-center">
														{rate.isDefault && <Badge variant="secondary">Default</Badge>}
													</div>
												</TableCell>
												<TableCell>
													<Button onClick={() => removeLaborRate(rate.id)} size="sm" variant="ghost">
														<Trash2 className="size-4" />
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Material Markups */}
				<Card>
					<CardHeader>
						<div className="flex items-start justify-between">
							<div>
								<CardTitle className="flex items-center gap-2">
									Material Markups
									<Tooltip>
										<TooltipTrigger>
											<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">Define markup percentages based on material cost ranges</p>
										</TooltipContent>
									</Tooltip>
								</CardTitle>
								<CardDescription>
									Set tiered markup percentages based on material cost (up to 100 tiers)
								</CardDescription>
							</div>
							<Button disabled={materialMarkups.length >= 100} onClick={addMaterialMarkup} size="sm" variant="outline">
								<Plus className="mr-2 size-4" />
								Add Tier ({materialMarkups.length}/100)
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Markups</TableHead>
										<TableHead className="text-right">Cost From</TableHead>
										<TableHead className="text-right">Cost To</TableHead>
										<TableHead className="text-right">Markup %</TableHead>
										<TableHead className="text-right">Profit %</TableHead>
										<TableHead className="w-[80px]" />
									</TableRow>
								</TableHeader>
								<TableBody>
									{materialMarkups.map((markup) => (
										<TableRow key={markup.id}>
											<TableCell>
												<span className="font-medium">{markup.name}</span>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-1">
													<span className="text-muted-foreground">$</span>
													<Input
														className="w-28 text-right"
														min="0"
														onChange={(e) => updateMaterialMarkup(markup.id, "costFrom", Number(e.target.value))}
														step="0.01"
														type="number"
														value={markup.costFrom}
													/>
												</div>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-1">
													<span className="text-muted-foreground">$</span>
													{markup.costTo !== null ? (
														<Input
															className="w-28 text-right"
															min="0"
															onChange={(e) => updateMaterialMarkup(markup.id, "costTo", Number(e.target.value))}
															step="0.01"
															type="number"
															value={markup.costTo}
														/>
													) : (
														<span className="w-28 pr-3 text-right">—</span>
													)}
												</div>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-1">
													<Input
														className="w-28 text-right"
														min="0"
														onChange={(e) => updateMaterialMarkup(markup.id, "markupPercent", Number(e.target.value))}
														step="0.01"
														type="number"
														value={markup.markupPercent}
													/>
													<span className="text-muted-foreground">%</span>
												</div>
											</TableCell>
											<TableCell className="text-right">
												<span className="text-muted-foreground">{markup.profitPercent.toFixed(2)}%</span>
											</TableCell>
											<TableCell>
												<Button onClick={() => removeMaterialMarkup(markup.id)} size="sm" variant="ghost">
													<Trash2 className="size-4" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						<div className="mt-4 rounded-lg bg-muted p-4">
							<p className="font-medium text-sm">Markup Calculation</p>
							<p className="mt-1 text-muted-foreground text-xs">Profit % = (Markup % ÷ (100 + Markup %)) × 100</p>
							<p className="mt-2 text-muted-foreground text-xs">
								Example: A $10 item with 150% markup sells for $25 ($10 cost + $15 markup), yielding 60% profit margin
								($15 profit ÷ $25 sale price).
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Pricing Strategy */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<DollarSign className="size-4" />
							Pricing Strategy
							<Tooltip>
								<TooltipTrigger>
									<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent>
									<p className="max-w-xs">How you calculate prices for your services and products</p>
								</TooltipContent>
							</Tooltip>
						</CardTitle>
						<CardDescription>Configure how selling prices are calculated from costs</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<Label className="flex items-center gap-2 font-medium text-sm">
									Use Markup Pricing
									<Tooltip>
										<TooltipTrigger>
											<HelpCircle className="h-3 w-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">Automatically calculate selling price from cost + markup percentage</p>
										</TooltipContent>
									</Tooltip>
								</Label>
								<p className="text-muted-foreground text-xs">Calculate price by adding markup % to cost</p>
							</div>
							<Switch
								checked={settings.useMarkupPricing}
								onCheckedChange={(checked) => updateSetting("useMarkupPricing", checked)}
							/>
						</div>

						{settings.useMarkupPricing && (
							<div>
								<Label className="flex items-center gap-2 font-medium text-sm">
									Default Markup Percentage
									<Tooltip>
										<TooltipTrigger>
											<HelpCircle className="h-3 w-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">How much to add on top of cost when creating new items</p>
										</TooltipContent>
									</Tooltip>
								</Label>
								<div className="relative mt-2">
									<Input
										onChange={(e) =>
											updateSetting("defaultMarkupPercent", Number.parseFloat(e.target.value) || DEFAULT_MARKUP_PERCENT)
										}
										placeholder="50"
										type="number"
										value={settings.defaultMarkupPercent}
									/>
									<span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">%</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Example: $100 cost + {settings.defaultMarkupPercent}% markup = $
									{examplePrice + (examplePrice * settings.defaultMarkupPercent) / PERCENTAGE_MULTIPLIER} selling price
								</p>
							</div>
						)}

						<Separator />

						<div className="flex items-center justify-between">
							<div className="flex-1">
								<Label className="flex items-center gap-2 font-medium text-sm">
									Round Prices
									<Tooltip>
										<TooltipTrigger>
											<HelpCircle className="h-3 w-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">Round prices to nice numbers ($95 instead of $94.37)</p>
										</TooltipContent>
									</Tooltip>
								</Label>
								<p className="text-muted-foreground text-xs">Make prices easier to read and remember</p>
							</div>
							<Switch
								checked={settings.roundPrices}
								onCheckedChange={(checked) => updateSetting("roundPrices", checked)}
							/>
						</div>

						{settings.roundPrices && (
							<div>
								<Label className="font-medium text-sm">Round to Nearest</Label>
								<Select
									onValueChange={(value) => updateSetting("roundToNearest", Number.parseInt(value, 10))}
									value={settings.roundToNearest.toString()}
								>
									<SelectTrigger className="mt-2">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1">$1 (e.g., $95.00)</SelectItem>
										<SelectItem value="5">$5 (e.g., $95.00)</SelectItem>
										<SelectItem value="10">$10 (e.g., $90.00)</SelectItem>
										<SelectItem value="25">$25 (e.g., $100.00)</SelectItem>
										<SelectItem value="50">$50 (e.g., $100.00)</SelectItem>
										<SelectItem value="100">$100 (e.g., $100.00)</SelectItem>
									</SelectContent>
								</Select>
								<p className="mt-1 text-muted-foreground text-xs">Prices will round to nearest selected amount</p>
							</div>
						)}

						<Separator />

						<div className="flex items-center justify-between">
							<div className="flex-1">
								<Label className="flex items-center gap-2 font-medium text-sm">
									Show Cost to Technicians
									<Tooltip>
										<TooltipTrigger>
											<HelpCircle className="h-3 w-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">Let field technicians see what items cost you</p>
										</TooltipContent>
									</Tooltip>
								</Label>
								<p className="text-muted-foreground text-xs">Technicians can see item costs in the field</p>
							</div>
							<Switch
								checked={settings.showCostToTechs}
								onCheckedChange={(checked) => updateSetting("showCostToTechs", checked)}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex-1">
								<Label className="flex items-center gap-2 font-medium text-sm">
									Require Approval for Discounts
									<Tooltip>
										<TooltipTrigger>
											<HelpCircle className="h-3 w-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">Manager must approve when technician gives discount</p>
										</TooltipContent>
									</Tooltip>
								</Label>
								<p className="text-muted-foreground text-xs">Manager approval needed for discounts</p>
							</div>
							<Switch
								checked={settings.requireApprovalForDiscounts}
								onCheckedChange={(checked) => updateSetting("requireApprovalForDiscounts", checked)}
							/>
						</div>

						{settings.requireApprovalForDiscounts && (
							<div>
								<Label className="flex items-center gap-2 font-medium text-sm">
									Maximum Discount Without Approval
									<Tooltip>
										<TooltipTrigger>
											<HelpCircle className="h-3 w-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">Technicians can give this much discount without asking</p>
										</TooltipContent>
									</Tooltip>
								</Label>
								<div className="relative mt-2">
									<Input
										onChange={(e) =>
											updateSetting("maxDiscountPercent", Number.parseInt(e.target.value, 10) || DEFAULT_MAX_DISCOUNT)
										}
										placeholder="20"
										type="number"
										value={settings.maxDiscountPercent}
									/>
									<span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">%</span>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									Discounts above {settings.maxDiscountPercent}% require manager approval
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Pricing Tiers - Only show if flat_rate or both */}
				{(settings.pricingModel === "flat_rate" || settings.pricingModel === "both") && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<TrendingUp className="size-4" />
								Pricing Tiers
								<Tooltip>
									<TooltipTrigger>
										<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
									</TooltipTrigger>
									<TooltipContent>
										<p className="max-w-xs">Offer different price levels (standard, emergency, premium)</p>
									</TooltipContent>
								</Tooltip>
							</CardTitle>
							<CardDescription>Different price levels for different service situations</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<Label className="flex items-center gap-2 font-medium text-sm">
										Enable Tiered Pricing
										<Tooltip>
											<TooltipTrigger>
												<HelpCircle className="h-3 w-3 text-muted-foreground" />
											</TooltipTrigger>
											<TooltipContent>
												<p className="max-w-xs">Charge different prices for regular vs emergency work</p>
											</TooltipContent>
										</Tooltip>
									</Label>
									<p className="text-muted-foreground text-xs">Different prices for different service levels</p>
								</div>
								<Switch
									checked={settings.enableTieredPricing}
									onCheckedChange={(checked) => updateSetting("enableTieredPricing", checked)}
								/>
							</div>

							{settings.enableTieredPricing && (
								<>
									<Separator />
									<div className="space-y-3">
										{settings.tierNames.map((tierName, index) => (
											<div className="grid grid-cols-2 gap-4" key={tierName}>
												<div>
													<Label className="text-sm">Tier {index + 1} Name</Label>
													<Input
														className="mt-2"
														onChange={(e) => {
															const newNames = [...settings.tierNames];
															newNames[index] = e.target.value;
															updateSetting("tierNames", newNames);
														}}
														placeholder="Standard"
														value={tierName}
													/>
												</div>
												<div>
													<Label className="flex items-center gap-2 text-sm">
														Price Multiplier
														<Tooltip>
															<TooltipTrigger>
																<HelpCircle className="h-3 w-3 text-muted-foreground" />
															</TooltipTrigger>
															<TooltipContent>
																<p className="max-w-xs">Multiply base price by this number</p>
															</TooltipContent>
														</Tooltip>
													</Label>
													<div className="relative mt-2">
														<Input
															onChange={(e) => {
																const newMultipliers = [...settings.tierMultipliers];
																newMultipliers[index] = Number.parseFloat(e.target.value) || 1.0;
																updateSetting("tierMultipliers", newMultipliers);
															}}
															placeholder="1.0"
															step="0.05"
															type="number"
															value={settings.tierMultipliers[index]}
														/>
														<span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
															×
														</span>
													</div>
												</div>
											</div>
										))}
									</div>

									<div className="rounded-lg border bg-muted/50 p-4">
										<p className="mb-2 font-medium text-sm">Pricing Example:</p>
										<div className="space-y-1 text-sm">
											<p className="text-muted-foreground">Base price: ${examplePrice}.00</p>
											{settings.tierNames.map((tierName, index) => (
												<p key={tierName}>
													{tierName}: ${(examplePrice * settings.tierMultipliers[index]).toFixed(2)}
												</p>
											))}
										</div>
									</div>
								</>
							)}
						</CardContent>
					</Card>
				)}

				{/* Item Management Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<Package className="size-4" />
							Item Management Rules
							<Tooltip>
								<TooltipTrigger>
									<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent>
									<p className="max-w-xs">Rules for adding and managing items in price book</p>
								</TooltipContent>
							</Tooltip>
						</CardTitle>
						<CardDescription>Requirements and tracking rules for price book items</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<Label className="flex items-center gap-2 font-medium text-sm">
									Require Description
									<Tooltip>
										<TooltipTrigger>
											<HelpCircle className="h-3 w-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">Force users to add description when creating items</p>
										</TooltipContent>
									</Tooltip>
								</Label>
								<p className="text-muted-foreground text-xs">Every item must have a description</p>
							</div>
							<Switch
								checked={settings.requireDescription}
								onCheckedChange={(checked) => updateSetting("requireDescription", checked)}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex-1">
								<Label className="flex items-center gap-2 font-medium text-sm">
									Require Cost
									<Tooltip>
										<TooltipTrigger>
											<HelpCircle className="h-3 w-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">Must enter what item costs you before setting price</p>
										</TooltipContent>
									</Tooltip>
								</Label>
								<p className="text-muted-foreground text-xs">Must enter cost before saving item</p>
							</div>
							<Switch
								checked={settings.requireCost}
								onCheckedChange={(checked) => updateSetting("requireCost", checked)}
							/>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<div className="flex-1">
								<Label className="flex items-center gap-2 font-medium text-sm">
									Track Inventory
									<Tooltip>
										<TooltipTrigger>
											<HelpCircle className="h-3 w-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">Keep track of how many of each item you have in stock</p>
										</TooltipContent>
									</Tooltip>
								</Label>
								<p className="text-muted-foreground text-xs">Track quantity on hand for each item</p>
							</div>
							<Switch
								checked={settings.trackInventory}
								onCheckedChange={(checked) => updateSetting("trackInventory", checked)}
							/>
						</div>

						{settings.trackInventory && (
							<>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<Label className="flex items-center gap-2 font-medium text-sm">
											Warn on Low Stock
											<Tooltip>
												<TooltipTrigger>
													<HelpCircle className="h-3 w-3 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													<p className="max-w-xs">Alert when inventory gets below threshold</p>
												</TooltipContent>
											</Tooltip>
										</Label>
										<p className="text-muted-foreground text-xs">Alert when stock is running low</p>
									</div>
									<Switch
										checked={settings.warnLowStock}
										onCheckedChange={(checked) => updateSetting("warnLowStock", checked)}
									/>
								</div>

								{settings.warnLowStock && (
									<div>
										<Label className="font-medium text-sm">Low Stock Threshold</Label>
										<Input
											className="mt-2"
											onChange={(e) =>
												updateSetting(
													"lowStockThreshold",
													Number.parseInt(e.target.value, 10) || DEFAULT_LOW_STOCK_THRESHOLD
												)
											}
											placeholder="10"
											type="number"
											value={settings.lowStockThreshold}
										/>
										<p className="mt-1 text-muted-foreground text-xs">
											Alert when quantity falls below {settings.lowStockThreshold} units
										</p>
									</div>
								)}
							</>
						)}
					</CardContent>
				</Card>

				{/* Tax Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<Receipt className="size-4" />
							Tax Settings
							<Tooltip>
								<TooltipTrigger>
									<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent>
									<p className="max-w-xs">Configure sales tax for your products and services</p>
								</TooltipContent>
							</Tooltip>
						</CardTitle>
						<CardDescription>Configure how tax is calculated and displayed</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<Label className="flex items-center gap-2 font-medium text-sm">
									Enable Tax Calculation
									<Tooltip>
										<TooltipTrigger>
											<HelpCircle className="h-3 w-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">Automatically calculate and add tax to taxable items</p>
										</TooltipContent>
									</Tooltip>
								</Label>
								<p className="text-muted-foreground text-xs">Add tax to invoices and estimates</p>
							</div>
							<Switch checked={settings.enableTax} onCheckedChange={(checked) => updateSetting("enableTax", checked)} />
						</div>

						{settings.enableTax && (
							<>
								<Separator />

								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<Label className="flex items-center gap-2 font-medium text-sm">
											Default Tax Rate
											<Tooltip>
												<TooltipTrigger>
													<HelpCircle className="h-3 w-3 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													<p className="max-w-xs">Standard tax rate for your location</p>
												</TooltipContent>
											</Tooltip>
										</Label>
										<div className="relative mt-2">
											<Input
												onChange={(e) => updateSetting("defaultTaxRate", Number.parseFloat(e.target.value) || 0)}
												placeholder="8.5"
												step="0.1"
												type="number"
												value={settings.defaultTaxRate}
											/>
											<span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">%</span>
										</div>
									</div>

									<div>
										<Label className="flex items-center gap-2 font-medium text-sm">
											Tax Label
											<Tooltip>
												<TooltipTrigger>
													<HelpCircle className="h-3 w-3 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													<p className="max-w-xs">Name shown on invoices (e.g., Sales Tax, VAT, GST)</p>
												</TooltipContent>
											</Tooltip>
										</Label>
										<Input
											className="mt-2"
											onChange={(e) => updateSetting("taxLabel", e.target.value)}
											placeholder="Sales Tax"
											value={settings.taxLabel}
										/>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex-1">
										<Label className="flex items-center gap-2 font-medium text-sm">
											Tax Included in Price
											<Tooltip>
												<TooltipTrigger>
													<HelpCircle className="h-3 w-3 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													<p className="max-w-xs">
														Price shown includes tax (common in EU) vs. tax added at checkout (common in US)
													</p>
												</TooltipContent>
											</Tooltip>
										</Label>
										<p className="text-muted-foreground text-xs">
											{settings.includeTaxInPrice
												? "Prices include tax (tax-inclusive)"
												: "Tax added to price (tax-exclusive)"}
										</p>
									</div>
									<Switch
										checked={settings.includeTaxInPrice}
										onCheckedChange={(checked) => updateSetting("includeTaxInPrice", checked)}
									/>
								</div>

								<div className="rounded-lg border bg-muted/50 p-4">
									<p className="mb-2 flex items-center gap-2 font-medium text-sm">
										<Percent className="size-4" />
										Tax Calculation Example
									</p>
									<div className="space-y-1 text-sm">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Item Price:</span>
											<span className="font-medium">${examplePrice}.00</span>
										</div>
										{settings.includeTaxInPrice ? (
											<>
												<div className="flex justify-between">
													<span className="text-muted-foreground">Tax (included):</span>
													<span className="text-muted-foreground">
														$
														{(
															(examplePrice * settings.defaultTaxRate) /
															(PERCENTAGE_MULTIPLIER + settings.defaultTaxRate)
														).toFixed(2)}
													</span>
												</div>
												<Separator />
												<div className="flex justify-between pt-1">
													<span className="font-medium">Total:</span>
													<span className="font-bold">${examplePrice}.00</span>
												</div>
											</>
										) : (
											<>
												<div className="flex justify-between">
													<span className="text-muted-foreground">
														{settings.taxLabel} ({settings.defaultTaxRate}%):
													</span>
													<span className="text-muted-foreground">
														${((examplePrice * settings.defaultTaxRate) / PERCENTAGE_MULTIPLIER).toFixed(2)}
													</span>
												</div>
												<Separator />
												<div className="flex justify-between pt-1">
													<span className="font-medium">Total:</span>
													<span className="font-bold">
														$
														{(examplePrice + (examplePrice * settings.defaultTaxRate) / PERCENTAGE_MULTIPLIER).toFixed(
															2
														)}
													</span>
												</div>
											</>
										)}
									</div>
								</div>
							</>
						)}
					</CardContent>
				</Card>

				{/* Save Button */}
				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline">
						Reset to Defaults
					</Button>
					<Button disabled={isPending} onClick={handleSave}>
						{isPending ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Save className="mr-2 size-4" />
								Save Price Book Settings
							</>
						)}
					</Button>
				</div>
			</div>
		</TooltipProvider>
	);
}
