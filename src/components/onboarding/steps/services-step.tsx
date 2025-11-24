"use client";

/**
 * Services Step - Pricebook Quick Setup
 *
 * Features:
 * - Industry-specific templates for quick setup
 * - Manual service addition
 * - Import from spreadsheet
 */

import { useState } from "react";
import { useOnboardingStore, INDUSTRIES } from "@/lib/onboarding/onboarding-store";
import { InfoCard } from "@/components/onboarding/info-cards/walkthrough-slide";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
	Wrench,
	Plus,
	Trash2,
	Sparkles,
	FileSpreadsheet,
	CheckCircle2,
	Clock,
	DollarSign,
	Package,
	Zap,
} from "lucide-react";

// Industry-specific service templates
const SERVICE_TEMPLATES: Record<string, { name: string; price: string; duration: string }[]> = {
	hvac: [
		{ name: "HVAC Diagnostic", price: "89", duration: "60" },
		{ name: "AC Tune-Up", price: "129", duration: "90" },
		{ name: "Furnace Tune-Up", price: "129", duration: "90" },
		{ name: "Filter Replacement", price: "49", duration: "15" },
		{ name: "Emergency Service Call", price: "149", duration: "60" },
		{ name: "Thermostat Installation", price: "199", duration: "60" },
	],
	plumbing: [
		{ name: "Plumbing Diagnostic", price: "79", duration: "60" },
		{ name: "Drain Cleaning", price: "149", duration: "60" },
		{ name: "Water Heater Flush", price: "129", duration: "90" },
		{ name: "Faucet Repair", price: "119", duration: "45" },
		{ name: "Toilet Repair", price: "139", duration: "60" },
		{ name: "Emergency Service Call", price: "149", duration: "60" },
	],
	electrical: [
		{ name: "Electrical Diagnostic", price: "89", duration: "60" },
		{ name: "Outlet Installation", price: "129", duration: "45" },
		{ name: "Switch Replacement", price: "99", duration: "30" },
		{ name: "Ceiling Fan Installation", price: "199", duration: "90" },
		{ name: "Panel Inspection", price: "149", duration: "60" },
		{ name: "Emergency Service Call", price: "149", duration: "60" },
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
	const [showImport, setShowImport] = useState(false);

	const templates = SERVICE_TEMPLATES[data.industry] || SERVICE_TEMPLATES.default;
	const industryLabel = INDUSTRIES.find((i) => i.value === data.industry)?.label || "your industry";

	const addService = (service?: { name: string; price: string; duration: string }) => {
		const newService = service || { name: "", price: "", duration: "60" };
		updateData({
			services: [
				...data.services,
				{ id: `service-${Date.now()}`, ...newService, category: "service" },
			],
		});
	};

	const updateService = (id: string, updates: Partial<typeof data.services[0]>) => {
		updateData({
			services: data.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
		});
	};

	const removeService = (id: string) => {
		updateData({
			services: data.services.filter((s) => s.id !== id),
		});
	};

	const addAllTemplates = () => {
		const newServices = templates.map((t, i) => ({
			id: `service-${Date.now()}-${i}`,
			...t,
			category: "service",
		}));
		updateData({
			services: [...data.services, ...newServices],
			servicesImportedFrom: data.industry || "default",
		});
	};

	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h2 className="text-xl font-semibold">Set up your services</h2>
				<p className="text-sm text-muted-foreground">
					Your pricebook powers estimates, invoices, and scheduling. Start with templates or add your own.
				</p>
			</div>

			{/* Info Card */}
			<InfoCard
				icon={<Sparkles className="h-5 w-5" />}
				title="Create professional quotes in seconds"
				description="Once your services are set up, you can build estimates and invoices by simply selecting items from your pricebook."
				variant="tip"
			/>

			{/* Quick Add Templates */}
			{data.services.length === 0 && (
				<div className="rounded-xl bg-primary/5 ring-1 ring-primary/20 p-5 space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Zap className="h-5 w-5 text-primary" />
							<h3 className="font-semibold">Quick Start: {industryLabel} Templates</h3>
						</div>
						<Button onClick={addAllTemplates} size="sm">
							<Plus className="mr-1 h-4 w-4" />
							Add All ({templates.length})
						</Button>
					</div>
					<div className="grid gap-2 sm:grid-cols-2">
						{templates.map((template, i) => (
							<button
								key={i}
								type="button"
								onClick={() => addService(template)}
								className="flex items-center justify-between rounded-lg bg-background p-3 text-left hover:ring-1 hover:ring-primary/30 transition-all"
							>
								<div className="flex items-center gap-2">
									<Package className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm font-medium">{template.name}</span>
								</div>
								<Badge variant="secondary">${template.price}</Badge>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Services List */}
			{data.services.length > 0 && (
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<h3 className="font-semibold">{data.services.length} Services</h3>
						<Button variant="outline" size="sm" onClick={() => addService()}>
							<Plus className="mr-1 h-4 w-4" />
							Add Service
						</Button>
					</div>

					{data.services.map((service) => (
						<div
							key={service.id}
							className="flex items-center gap-3 rounded-xl bg-muted/30 p-4"
						>
							<div className="flex-1 grid gap-3 sm:grid-cols-3">
								<Input
									placeholder="Service name"
									value={service.name}
									onChange={(e) => updateService(service.id, { name: e.target.value })}
								/>
								<div className="relative">
									<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="0.00"
										value={service.price}
										onChange={(e) => updateService(service.id, { price: e.target.value })}
										className="pl-8"
									/>
								</div>
								<Select
									value={service.duration}
									onValueChange={(v) => updateService(service.id, { duration: v })}
								>
									<SelectTrigger>
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
								className="text-muted-foreground hover:text-destructive"
								onClick={() => removeService(service.id)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}

					{/* Add more from templates */}
					{data.servicesImportedFrom !== data.industry && data.services.length > 0 && (
						<Button
							variant="outline"
							className="w-full"
							onClick={addAllTemplates}
						>
							<Package className="mr-2 h-4 w-4" />
							Add {industryLabel} Templates
						</Button>
					)}
				</div>
			)}

			{/* Import Option */}
			<div className="rounded-xl bg-muted/30 p-4">
				<button
					type="button"
					onClick={() => setShowImport(!showImport)}
					className="w-full flex items-center justify-between"
				>
					<div className="flex items-center gap-3">
						<FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
						<div className="text-left">
							<p className="font-medium">Import from spreadsheet</p>
							<p className="text-sm text-muted-foreground">
								Upload a CSV or Excel file with your existing services
							</p>
						</div>
					</div>
					<Badge variant="outline">Coming Soon</Badge>
				</button>
			</div>

			{/* Empty State */}
			{data.services.length === 0 && (
				<p className="text-sm text-muted-foreground text-center">
					You can skip this step and add services later from your Pricebook settings.
				</p>
			)}
		</div>
	);
}
