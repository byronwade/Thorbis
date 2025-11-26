"use client";

/**
 * Services Step - Pricebook Setup Options
 *
 * Three paths:
 * 1. Auto-setup with industry templates
 * 2. Import from ProfitRhino
 * 3. Start blank / skip
 */

import {
	Check,
	CheckCircle2,
	Clock,
	DollarSign,
	ExternalLink,
	FileSpreadsheet,
	Loader2,
	Package,
	Pencil,
	Plus,
	SkipForward,
	Trash2,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	INDUSTRIES,
	useOnboardingStore,
} from "@/lib/onboarding/onboarding-store";
import { cn } from "@/lib/utils";

type PricebookSetupOption = "templates" | "profitrhino" | "blank";

const SETUP_OPTIONS: {
	id: PricebookSetupOption;
	title: string;
	subtitle: string;
	icon: React.ElementType;
	badge?: string;
}[] = [
	{
		id: "templates",
		title: "Quick Setup",
		subtitle: "Start with industry templates",
		icon: Zap,
		badge: "Recommended",
	},
	{
		id: "profitrhino",
		title: "Import from ProfitRhino",
		subtitle: "Connect your existing pricebook",
		icon: FileSpreadsheet,
	},
	{
		id: "blank",
		title: "Start Blank",
		subtitle: "Add services manually later",
		icon: SkipForward,
	},
];

// Industry-specific service templates
const SERVICE_TEMPLATES: Record<
	string,
	{ name: string; price: string; duration: string }[]
> = {
	hvac: [
		{ name: "HVAC Diagnostic", price: "89", duration: "60" },
		{ name: "AC Tune-Up", price: "129", duration: "90" },
		{ name: "Furnace Tune-Up", price: "129", duration: "90" },
		{ name: "Filter Replacement", price: "49", duration: "15" },
		{ name: "Emergency Service Call", price: "149", duration: "60" },
	],
	plumbing: [
		{ name: "Plumbing Diagnostic", price: "79", duration: "60" },
		{ name: "Drain Cleaning", price: "149", duration: "60" },
		{ name: "Water Heater Flush", price: "129", duration: "90" },
		{ name: "Faucet Repair", price: "119", duration: "45" },
		{ name: "Toilet Repair", price: "139", duration: "60" },
	],
	electrical: [
		{ name: "Electrical Diagnostic", price: "89", duration: "60" },
		{ name: "Outlet Installation", price: "129", duration: "45" },
		{ name: "Switch Replacement", price: "99", duration: "30" },
		{ name: "Ceiling Fan Installation", price: "199", duration: "90" },
		{ name: "Panel Inspection", price: "149", duration: "60" },
	],
	roofing: [
		{ name: "Roof Inspection", price: "149", duration: "90" },
		{ name: "Emergency Tarp", price: "299", duration: "120" },
		{ name: "Leak Repair", price: "349", duration: "180" },
		{ name: "Gutter Cleaning", price: "149", duration: "90" },
		{ name: "Shingle Replacement", price: "199", duration: "120" },
	],
	landscaping: [
		{ name: "Lawn Mowing", price: "45", duration: "45" },
		{ name: "Hedge Trimming", price: "89", duration: "60" },
		{ name: "Leaf Cleanup", price: "129", duration: "90" },
		{ name: "Mulching", price: "199", duration: "120" },
		{ name: "Spring Cleanup", price: "249", duration: "180" },
	],
	cleaning: [
		{ name: "Standard Clean", price: "149", duration: "120" },
		{ name: "Deep Clean", price: "249", duration: "240" },
		{ name: "Move-In/Out Clean", price: "349", duration: "300" },
		{ name: "Office Cleaning", price: "199", duration: "180" },
		{ name: "Post-Construction", price: "449", duration: "480" },
	],
	locksmith: [
		{ name: "Service Call", price: "89", duration: "30" },
		{ name: "Lockout Service", price: "129", duration: "45" },
		{ name: "Lock Rekey", price: "99", duration: "30" },
		{ name: "Lock Replacement", price: "179", duration: "60" },
		{ name: "Emergency Service", price: "199", duration: "60" },
	],
	default: [
		{ name: "Service Call", price: "89", duration: "60" },
		{ name: "Diagnostic Fee", price: "75", duration: "30" },
		{ name: "Standard Repair", price: "149", duration: "90" },
		{ name: "Emergency Service", price: "199", duration: "60" },
		{ name: "Maintenance Visit", price: "129", duration: "60" },
	],
};

export function ServicesStep() {
	const { data, updateData } = useOnboardingStore();
	const [setupOption, setSetupOption] = useState<PricebookSetupOption | null>(
		data.services.length > 0 ? "templates" : null,
	);
	const [isConnecting, setIsConnecting] = useState(false);

	const templates =
		SERVICE_TEMPLATES[data.industry] || SERVICE_TEMPLATES.default;
	const industryLabel =
		INDUSTRIES.find((i) => i.value === data.industry)?.label || "your industry";

	const handleSetupOption = async (option: PricebookSetupOption) => {
		setSetupOption(option);

		if (option === "templates" && data.services.length === 0) {
			// Auto-add all templates
			const newServices = templates.map((t, i) => ({
				id: `service-${Date.now()}-${i}`,
				...t,
				category: "service",
			}));
			updateData({
				services: newServices,
				servicesImportedFrom: data.industry || "default",
			});
		} else if (option === "blank") {
			updateData({
				services: [],
				servicesImportedFrom: null,
			});
		}
	};

	const handleProfitRhinoConnect = async () => {
		setIsConnecting(true);
		// Simulate OAuth redirect
		await new Promise((resolve) => setTimeout(resolve, 1500));
		// In production, this would redirect to ProfitRhino OAuth
		setIsConnecting(false);
		// For now, show it's not connected
	};

	const addService = (service?: {
		name: string;
		price: string;
		duration: string;
	}) => {
		const newService = service || { name: "", price: "", duration: "60" };
		updateData({
			services: [
				...data.services,
				{ id: `service-${Date.now()}`, ...newService, category: "service" },
			],
		});
	};

	const updateService = (
		id: string,
		updates: Partial<(typeof data.services)[0]>,
	) => {
		updateData({
			services: data.services.map((s) =>
				s.id === id ? { ...s, ...updates } : s,
			),
		});
	};

	const removeService = (id: string) => {
		updateData({
			services: data.services.filter((s) => s.id !== id),
		});
	};

	// Show option selection if no choice made yet
	if (!setupOption) {
		return (
			<div className="space-y-10">
				{/* Header */}
				<div className="space-y-2">
					<h2 className="text-2xl font-semibold">Set up your pricebook</h2>
					<p className="text-muted-foreground">
						Your pricebook powers estimates and invoices. How would you like to
						get started?
					</p>
				</div>

				{/* Setup Options */}
				<div className="space-y-3">
					{SETUP_OPTIONS.map((option) => {
						const Icon = option.icon;
						return (
							<button
								key={option.id}
								type="button"
								onClick={() => handleSetupOption(option.id)}
								className={cn(
									"relative w-full flex items-center gap-4 rounded-lg p-4 text-left transition-all",
									"bg-muted/40 hover:bg-muted/60",
								)}
							>
								{option.badge && (
									<span className="absolute top-2 right-2 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
										{option.badge}
									</span>
								)}
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0">
									<Icon className="h-5 w-5" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-medium">{option.title}</p>
									<p className="text-sm text-muted-foreground">
										{option.subtitle}
									</p>
								</div>
							</button>
						);
					})}
				</div>

				{/* Preview of templates */}
				<div className="space-y-3">
					<p className="text-sm font-medium text-muted-foreground">
						Quick Setup includes {templates.length} {industryLabel} services:
					</p>
					<div className="flex flex-wrap gap-2">
						{templates.slice(0, 4).map((t, i) => (
							<span key={i} className="text-xs bg-muted/60 px-2 py-1 rounded">
								{t.name} · ${t.price}
							</span>
						))}
						{templates.length > 4 && (
							<span className="text-xs text-muted-foreground px-2 py-1">
								+{templates.length - 4} more
							</span>
						)}
					</div>
				</div>
			</div>
		);
	}

	// ProfitRhino connection flow
	if (setupOption === "profitrhino") {
		return (
			<div className="space-y-10">
				{/* Header */}
				<div className="space-y-2">
					<button
						onClick={() => setSetupOption(null)}
						className="text-sm text-muted-foreground hover:text-foreground"
					>
						← Back to options
					</button>
					<h2 className="text-2xl font-semibold">Connect ProfitRhino</h2>
					<p className="text-muted-foreground">
						Import your existing pricebook from ProfitRhino with one click.
					</p>
				</div>

				<div className="space-y-6">
					<div className="rounded-lg bg-muted/40 p-6 space-y-4">
						<div className="flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
								<span className="text-xl font-bold text-orange-500">PR</span>
							</div>
							<div>
								<p className="font-medium">ProfitRhino Integration</p>
								<p className="text-sm text-muted-foreground">
									Sync services, pricing & categories
								</p>
							</div>
						</div>

						<div className="space-y-2 text-sm">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 text-green-500" />
								<span>Import all services and pricing</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 text-green-500" />
								<span>Keep pricebooks in sync automatically</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 text-green-500" />
								<span>Flat-rate pricing support</span>
							</div>
						</div>
					</div>

					<Button
						onClick={handleProfitRhinoConnect}
						disabled={isConnecting}
						className="w-full"
					>
						{isConnecting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Connecting...
							</>
						) : (
							<>
								<ExternalLink className="mr-2 h-4 w-4" />
								Connect ProfitRhino Account
							</>
						)}
					</Button>

					<p className="text-xs text-muted-foreground text-center">
						You'll be redirected to ProfitRhino to authorize access. Don't have
						ProfitRhino?{" "}
						<button
							onClick={() => handleSetupOption("templates")}
							className="text-primary hover:underline"
						>
							Use our templates instead
						</button>
					</p>
				</div>
			</div>
		);
	}

	// Blank state - skip
	if (setupOption === "blank") {
		return (
			<div className="space-y-10">
				{/* Header */}
				<div className="space-y-2">
					<button
						onClick={() => setSetupOption(null)}
						className="text-sm text-muted-foreground hover:text-foreground"
					>
						← Back to options
					</button>
					<h2 className="text-2xl font-semibold">
						Start with a blank pricebook
					</h2>
					<p className="text-muted-foreground">
						You can add services anytime from Settings → Pricebook.
					</p>
				</div>

				<div className="rounded-lg bg-muted/40 p-6 space-y-4">
					<div className="flex items-center gap-3">
						<CheckCircle2 className="h-6 w-6 text-green-500" />
						<div>
							<p className="font-medium">No services added</p>
							<p className="text-sm text-muted-foreground">
								You can create estimates with custom line items, or add services
								later.
							</p>
						</div>
					</div>
				</div>

				<div className="space-y-3">
					<p className="text-sm text-muted-foreground">
						Changed your mind? You can still:
					</p>
					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleSetupOption("templates")}
						>
							<Zap className="mr-1 h-4 w-4" />
							Use Templates
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleSetupOption("profitrhino")}
						>
							<FileSpreadsheet className="mr-1 h-4 w-4" />
							Connect ProfitRhino
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// Templates selected - show editable list
	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="space-y-2">
				<button
					onClick={() => setSetupOption(null)}
					className="text-sm text-muted-foreground hover:text-foreground"
				>
					← Back to options
				</button>
				<h2 className="text-2xl font-semibold">Your pricebook</h2>
				<p className="text-muted-foreground">
					We've added {data.services.length} {industryLabel} services. Edit
					prices or add more.
				</p>
			</div>

			{/* Success banner */}
			<div className="rounded-lg bg-green-500/10 p-4 flex items-center gap-3">
				<CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
				<div className="flex-1">
					<p className="font-medium text-green-700 dark:text-green-400">
						{data.services.length} services added
					</p>
					<p className="text-sm text-muted-foreground">
						Customize prices below or continue to the next step
					</p>
				</div>
			</div>

			{/* Services List */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium text-muted-foreground">
						Services
					</span>
					<Button variant="outline" size="sm" onClick={() => addService()}>
						<Plus className="mr-1 h-4 w-4" />
						Add Service
					</Button>
				</div>

				<div className="space-y-2">
					{data.services.map((service) => (
						<div
							key={service.id}
							className="flex items-center gap-3 rounded-lg bg-muted/40 p-3"
						>
							<div className="flex-1 grid gap-2 sm:grid-cols-3">
								<Input
									placeholder="Service name"
									value={service.name}
									onChange={(e) =>
										updateService(service.id, { name: e.target.value })
									}
									className="h-9"
								/>
								<div className="relative">
									<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="0.00"
										value={service.price}
										onChange={(e) =>
											updateService(service.id, { price: e.target.value })
										}
										className="pl-8 h-9"
									/>
								</div>
								<Select
									value={service.duration}
									onValueChange={(v) =>
										updateService(service.id, { duration: v })
									}
								>
									<SelectTrigger className="h-9">
										<Clock className="mr-2 h-4 w-4" />
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="15">15 min</SelectItem>
										<SelectItem value="30">30 min</SelectItem>
										<SelectItem value="45">45 min</SelectItem>
										<SelectItem value="60">1 hour</SelectItem>
										<SelectItem value="90">1.5 hours</SelectItem>
										<SelectItem value="120">2 hours</SelectItem>
										<SelectItem value="180">3 hours</SelectItem>
										<SelectItem value="240">4 hours</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="h-9 w-9 text-muted-foreground hover:text-destructive"
								onClick={() => removeService(service.id)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
			</div>

			{/* Pro tip */}
			<p className="text-xs text-muted-foreground">
				Tip: You can add materials, equipment, and more detailed pricing in
				Settings → Pricebook
			</p>
		</div>
	);
}
