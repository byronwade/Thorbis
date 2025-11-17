/**
 * Equipment Page Content
 *
 * Comprehensive equipment details with collapsible sections
 * Matches job and customer detail page patterns
 */

"use client";

import {
	AlertTriangle,
	Calendar,
	Fuel,
	Gauge,
	MapPin,
	Package,
	ShieldCheck,
	Truck,
	User,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
	DetailPageContentLayout,
	type DetailPageHeaderConfig,
} from "@/components/layout/detail-page-content-layout";
import { DetailPageSurface } from "@/components/layout/detail-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	UnifiedAccordionContent,
	type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";

export type EquipmentData = {
	equipment: any;
	customer?: any;
	property?: any;
	servicePlan?: any;
	installJob?: any; // NEW: for lifecycle tracking
	lastServiceJob?: any; // NEW: for lifecycle tracking
	upcomingMaintenance?: any[]; // NEW: for lifecycle tracking
	serviceHistory?: any[];
	notes?: any[];
	activities?: any[];
	attachments?: any[];
};

export type EquipmentPageContentProps = {
	entityData: EquipmentData;
};

function _formatCurrency(cents: number | null | undefined): string {
	if (cents === null || cents === undefined) {
		return "$0.00";
	}
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(cents / 100);
}

function getStatusBadge(status: string, key?: string) {
	const variants: Record<string, { className: string; label: string }> = {
		active: {
			className: "bg-success text-white",
			label: "Active",
		},
		inactive: {
			className: "bg-secondary0 text-white",
			label: "Inactive",
		},
		retired: {
			className: "bg-warning text-white",
			label: "Retired",
		},
		replaced: {
			className: "bg-primary text-white",
			label: "Replaced",
		},
	};

	const config = variants[status] || {
		className: "bg-muted text-foreground",
		label: status,
	};

	return (
		<Badge className={config.className} key={key} variant="outline">
			{config.label}
		</Badge>
	);
}

function getConditionBadge(condition: string, key?: string) {
	const variants: Record<string, { className: string; label: string }> = {
		excellent: {
			className: "bg-success text-white",
			label: "Excellent",
		},
		good: {
			className: "bg-primary text-white",
			label: "Good",
		},
		fair: {
			className: "bg-warning text-white",
			label: "Fair",
		},
		poor: {
			className: "bg-warning text-white",
			label: "Poor",
		},
		needs_replacement: {
			className: "bg-destructive text-white",
			label: "Needs Replacement",
		},
	};

	const config = variants[condition] || {
		className: "bg-muted text-foreground",
		label: condition,
	};

	return (
		<Badge className={config.className} key={key} variant="outline">
			{config.label}
		</Badge>
	);
}

const classificationLabelMap = {
	equipment: "Equipment",
	tool: "Tool",
	vehicle: "Vehicle",
} as const;

function formatLabel(value?: string | null): string {
	if (!value) {
		return "N/A";
	}
	return value
		.toString()
		.replace(/[_-]+/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value?: string | null): string {
	if (!value) {
		return "N/A";
	}
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "N/A";
	}
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function formatNumber(value?: number | null, unit?: string): string {
	if (value === null || value === undefined || Number.isNaN(value)) {
		return "N/A";
	}
	const formatted = value.toLocaleString("en-US");
	return unit ? `${formatted} ${unit}` : formatted;
}

function getDaysUntil(value?: string | null): number | null {
	if (!value) {
		return null;
	}
	const target = new Date(value);
	if (Number.isNaN(target.getTime())) {
		return null;
	}
	const diffMs = target.getTime() - Date.now();
	return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function EquipmentPageContent({ entityData }: EquipmentPageContentProps) {
	const {
		equipment,
		customer,
		property,
		servicePlan,
		installJob, // NEW: for lifecycle tracking
		lastServiceJob, // NEW: for lifecycle tracking
		upcomingMaintenance = [], // NEW: for lifecycle tracking
		serviceHistory = [],
		notes = [],
		activities = [],
		attachments = [],
	} = entityData;

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const rawClassification =
		(equipment.classification as keyof typeof classificationLabelMap | undefined) ?? "equipment";
	const classificationKey: keyof typeof classificationLabelMap = classificationLabelMap[
		rawClassification
	]
		? rawClassification
		: "equipment";
	const classificationLabel =
		classificationLabelMap[classificationKey] || formatLabel(equipment.classification);
	const typeLabel = formatLabel(equipment.type);
	const assetCategoryLabel = equipment.asset_category
		? formatLabel(equipment.asset_category)
		: null;
	const assetSubcategoryLabel = equipment.asset_subcategory
		? formatLabel(equipment.asset_subcategory)
		: null;
	const isVehicle = classificationKey === "vehicle";
	const isTool = classificationKey === "tool";

	const toneStyles = {
		positive: "border-success/30 bg-success/10",
		warning: "border-warning/40 bg-warning/10",
		critical: "border-destructive/40 bg-destructive/10",
		info: "border-primary/30 bg-primary/10",
	} as const;

	const headerBadges = [
		getStatusBadge(equipment.status || "active", "status"),
		getConditionBadge(equipment.condition || "good", "condition"),
		<Badge className="bg-primary/10 text-primary" key="classification" variant="outline">
			{classificationLabel}
		</Badge>,
	];

	const equipmentIdentifier =
		equipment.equipment_number || equipment.asset_id || equipment.id?.slice(0, 8).toUpperCase();

	const equipmentName = equipment.name || `Equipment ${equipmentIdentifier ?? ""}`.trim();

	const subtitleSegments = [
		classificationLabel,
		typeLabel !== "N/A" && typeLabel !== "NA" ? typeLabel : null,
		equipment.manufacturer || null,
		equipment.model || null,
	].filter(Boolean);

	const headerSubtitle = subtitleSegments.length > 0 ? subtitleSegments.join(" • ") : undefined;

	const metadataItems = [] as NonNullable<DetailPageHeaderConfig["metadata"]>;

	metadataItems.push({
		label: "Equipment #",
		icon: <Package className="text-muted-foreground h-3.5 w-3.5" />,
		value: equipmentIdentifier ?? "Not assigned",
		helperText: classificationLabel,
	});

	metadataItems.push({
		label: "Status",
		icon: <ShieldCheck className="text-muted-foreground h-3.5 w-3.5" />,
		value: formatLabel(equipment.status) || "Active",
		helperText: formatLabel(equipment.condition),
	});

	metadataItems.push({
		label: "Installed",
		icon: <Calendar className="text-muted-foreground h-3.5 w-3.5" />,
		value: formatDate(equipment.install_date),
		helperText: equipment.installed_by ? `By ${equipment.installed_by}` : undefined,
	});

	if (equipment.serial_number) {
		metadataItems.push({
			label: "Serial Number",
			icon: <Wrench className="text-muted-foreground h-3.5 w-3.5" />,
			value: equipment.serial_number,
		});
	}

	if (customer) {
		metadataItems.push({
			label: "Customer",
			icon: <User className="text-muted-foreground h-3.5 w-3.5" />,
			value: (
				<Link
					className="text-foreground text-sm font-medium hover:underline"
					href={`/dashboard/customers/${customer.id}`}
				>
					{customer.display_name ||
						`${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
						"Unknown Customer"}
				</Link>
			),
			helperText: customer.email || customer.phone || undefined,
		});
	}

	if (property) {
		metadataItems.push({
			label: "Location",
			icon: <MapPin className="text-muted-foreground h-3.5 w-3.5" />,
			value: property.address || property.name || "Not assigned",
			helperText:
				`${property.city || ""}, ${property.state || ""} ${property.zip_code || ""}`.trim(),
		});
	}

	if (servicePlan) {
		metadataItems.push({
			label: "Service Plan",
			icon: <ShieldCheck className="text-muted-foreground h-3.5 w-3.5" />,
			value: (
				<Link
					className="text-foreground text-sm font-medium hover:underline"
					href={`/dashboard/work/maintenance-plans/${servicePlan.id}`}
				>
					{servicePlan.name || `Plan ${servicePlan.plan_number || servicePlan.id.slice(0, 8)}`}
				</Link>
			),
			helperText: servicePlan.status || undefined,
		});
	}

	const secondaryActions: ReactNode[] = [];

	if (customer) {
		secondaryActions.push(
			<Button asChild key="view-customer" size="sm" variant="outline">
				<Link href={`/dashboard/customers/${customer.id}`}>View Customer</Link>
			</Button>
		);
	}

	if (property) {
		secondaryActions.push(
			<Button asChild key="view-property" size="sm" variant="outline">
				<Link href={`/dashboard/work/properties/${property.id}`}>View Property</Link>
			</Button>
		);
	}

	const headerConfig: DetailPageHeaderConfig = {
		title: equipmentName,
		subtitle: headerSubtitle,
		badges: headerBadges,
		metadata: metadataItems,
		secondaryActions: secondaryActions.length > 0 ? secondaryActions : undefined,
	};

	const smartInsights = useMemo(() => {
		const insights: Array<{
			tone: "positive" | "warning" | "critical" | "info";
			title: string;
			description: string;
			icon?: ReactNode;
		}> = [];

		if (isVehicle) {
			if (
				typeof equipment.vehicle_odometer === "number" &&
				typeof equipment.vehicle_next_service_mileage === "number"
			) {
				const milesRemaining = equipment.vehicle_next_service_mileage - equipment.vehicle_odometer;
				if (Number.isFinite(milesRemaining)) {
					const tone = milesRemaining < 0 ? "critical" : milesRemaining <= 500 ? "warning" : "info";
					insights.push({
						tone,
						title:
							milesRemaining < 0
								? `Service overdue by ${formatNumber(Math.abs(milesRemaining), "mi")}`
								: `Service due in ${formatNumber(milesRemaining, "mi")}`,
						description: `Next service at ${formatNumber(
							equipment.vehicle_next_service_mileage,
							"mi"
						)}${equipment.next_service_due ? ` • ${formatDate(equipment.next_service_due)}` : ""}`,
						icon: <Gauge className="size-4" />,
					});
				}
			}

			const inspectionDays = getDaysUntil(equipment.vehicle_inspection_due);
			if (inspectionDays !== null) {
				const tone = inspectionDays < 0 ? "critical" : inspectionDays <= 14 ? "warning" : "info";
				insights.push({
					tone,
					title:
						inspectionDays < 0
							? `Inspection overdue by ${Math.abs(inspectionDays)} days`
							: `Inspection due in ${inspectionDays} days`,
					description: `Due ${formatDate(equipment.vehicle_inspection_due)}`,
					icon: <AlertTriangle className="size-4" />,
				});
			}

			const registrationDays = getDaysUntil(equipment.vehicle_registration_expiration);
			if (registrationDays !== null) {
				const tone =
					registrationDays < 0 ? "critical" : registrationDays <= 30 ? "warning" : "info";
				insights.push({
					tone,
					title:
						registrationDays < 0
							? `Registration expired ${Math.abs(registrationDays)} days ago`
							: `Registration expires in ${registrationDays} days`,
					description: `Renew by ${formatDate(equipment.vehicle_registration_expiration)}`,
					icon: <Truck className="size-4" />,
				});
			}

			if (equipment.vehicle_fuel_type) {
				insights.push({
					tone: "info",
					title: `${formatLabel(equipment.vehicle_fuel_type)} fuel`,
					description: "Fuel type captured for compliance and routing.",
					icon: <Fuel className="size-4" />,
				});
			}
		} else if (isTool) {
			const calibrationDays = getDaysUntil(equipment.tool_calibration_due);
			if (calibrationDays !== null) {
				const tone = calibrationDays < 0 ? "critical" : calibrationDays <= 14 ? "warning" : "info";
				insights.push({
					tone,
					title:
						calibrationDays < 0
							? `Calibration overdue by ${Math.abs(calibrationDays)} days`
							: `Calibration due in ${calibrationDays} days`,
					description: `Scheduled for ${formatDate(equipment.tool_calibration_due)}`,
					icon: <Gauge className="size-4" />,
				});
			}

			if (equipment.condition) {
				const tone =
					equipment.condition === "needs_replacement" || equipment.condition === "poor"
						? "warning"
						: "info";
				insights.push({
					tone,
					title: `Condition: ${formatLabel(equipment.condition)}`,
					description:
						equipment.condition === "needs_replacement"
							? "Plan replacement to avoid downtime."
							: "Equipment ready for deployment.",
					icon: <Wrench className="size-4" />,
				});
			}

			if (equipment.tool_serial) {
				insights.push({
					tone: "info",
					title: `Serial ${equipment.tool_serial}`,
					description: "Tracked for warranty and service history.",
				});
			}
		} else {
			const serviceDays = getDaysUntil(equipment.next_service_due);
			if (serviceDays !== null) {
				const tone = serviceDays < 0 ? "critical" : serviceDays <= 30 ? "warning" : "info";
				insights.push({
					tone,
					title:
						serviceDays < 0
							? `Service overdue by ${Math.abs(serviceDays)} days`
							: `Service due in ${serviceDays} days`,
					description: `Next scheduled for ${formatDate(equipment.next_service_due)}`,
					icon: <Gauge className="size-4" />,
				});
			}

			if (equipment.is_under_warranty && equipment.warranty_expiration) {
				const warrantyDays = getDaysUntil(equipment.warranty_expiration);
				if (warrantyDays !== null) {
					const tone = warrantyDays < 0 ? "warning" : warrantyDays <= 60 ? "warning" : "positive";
					insights.push({
						tone,
						title:
							warrantyDays < 0
								? "Warranty expired"
								: `Warranty active (${warrantyDays} days remaining)`,
						description: `Covers until ${formatDate(equipment.warranty_expiration)}`,
						icon: <ShieldCheck className="size-4" />,
					});
				}
			}
		}

		return insights;
	}, [
		equipment.condition,
		equipment.is_under_warranty,
		equipment.next_service_due,
		equipment.tool_calibration_due,
		equipment.tool_serial,
		equipment.vehicle_fuel_type,
		equipment.vehicle_inspection_due,
		equipment.vehicle_next_service_mileage,
		equipment.vehicle_odometer,
		equipment.vehicle_registration_expiration,
		isTool,
		isVehicle,
		equipment.warranty_expiration,
	]);

	const nextServiceDays = getDaysUntil(equipment.next_service_due);
	const warrantyDays = getDaysUntil(equipment.warranty_expiration);

	const lifecycleTiles = [
		{
			key: "install",
			label: "Install Date",
			value: formatDate(equipment.install_date),
			helperText: equipment.installed_by ? `Installed by ${equipment.installed_by}` : undefined,
			icon: <Calendar className="text-muted-foreground h-4 w-4" />,
		},
		{
			key: "last-service",
			label: "Last Service",
			value: formatDate(equipment.last_service_date),
			helperText: equipment.last_service_job_id ? "Linked job on record" : undefined,
			icon: <Wrench className="text-muted-foreground h-4 w-4" />,
		},
		{
			key: "next-service",
			label: "Next Service Due",
			value: formatDate(equipment.next_service_due),
			helperText:
				nextServiceDays !== null
					? nextServiceDays < 0
						? `${Math.abs(nextServiceDays)} days overdue`
						: `Due in ${nextServiceDays} days`
					: undefined,
			icon: <Gauge className="text-muted-foreground h-4 w-4" />,
		},
		{
			key: "warranty",
			label: "Warranty",
			value: equipment.is_under_warranty ? "Active" : "Expired",
			helperText:
				equipment.warranty_expiration && warrantyDays !== null
					? warrantyDays < 0
						? `Expired ${Math.abs(warrantyDays)} days ago`
						: `Expires in ${warrantyDays} days`
					: equipment.warranty_expiration
						? `Expires ${formatDate(equipment.warranty_expiration)}`
						: undefined,
			icon: <ShieldCheck className="text-muted-foreground h-4 w-4" />,
		},
	];

	const summarySurface =
		lifecycleTiles.length > 0 ? (
			<DetailPageSurface className="w-full" padding="lg" variant="muted">
				<div className="flex flex-col gap-4">
					<h3 className="text-foreground text-base font-semibold">Lifecycle Overview</h3>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
						{lifecycleTiles.map(({ key, label, value, helperText, icon }) => (
							<div className="border-border/40 bg-background rounded-lg border px-3 py-3" key={key}>
								<div className="flex items-center gap-3">
									{icon}
									<div className="flex flex-col">
										<span className="text-muted-foreground text-xs font-medium uppercase">
											{label}
										</span>
										<span className="text-sm font-semibold">{value}</span>
										{helperText ? (
											<span className="text-muted-foreground text-xs">{helperText}</span>
										) : null}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</DetailPageSurface>
		) : null;

	const smartInsightsSurface =
		smartInsights.length > 0 ? (
			<DetailPageSurface className="w-full" padding="lg" variant="muted">
				<div className="flex flex-col gap-3">
					<h3 className="text-foreground text-base font-semibold">Smart Insights</h3>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{smartInsights.map((insight) => (
							<div
								className={`rounded-md border p-3 text-sm ${toneStyles[insight.tone]}`}
								key={`${insight.title}-${insight.description}`}
							>
								<div className="flex items-start gap-3">
									{insight.icon && (
										<div className="text-muted-foreground mt-0.5">{insight.icon}</div>
									)}
									<div className="space-y-1">
										<p className="text-foreground font-medium">{insight.title}</p>
										<p className="text-muted-foreground text-xs">{insight.description}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</DetailPageSurface>
		) : null;

	const beforeContent =
		smartInsightsSurface || summarySurface ? (
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
				{smartInsightsSurface}
				{summarySurface}
			</div>
		) : null;

	const customSections = useMemo<UnifiedAccordionSection[]>(() => {
		const sections: UnifiedAccordionSection[] = [
			{
				id: "equipment-details",
				title: "Equipment Details",
				icon: <Package className="size-4" />,
				defaultOpen: true,
				content: (
					<UnifiedAccordionContent>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Equipment Number</Label>
								<Input readOnly value={equipment.equipment_number || equipment.id.slice(0, 8)} />
							</div>
							<div>
								<Label>Classification</Label>
								<Input readOnly value={classificationLabel} />
							</div>
							<div>
								<Label>Type</Label>
								<Input readOnly value={typeLabel !== "N/A" ? typeLabel : "Unspecified"} />
							</div>
							<div>
								<Label>Manufacturer</Label>
								<Input readOnly value={equipment.manufacturer || "N/A"} />
							</div>
							<div>
								<Label>Model</Label>
								<Input readOnly value={equipment.model || "N/A"} />
							</div>
							{equipment.serial_number && (
								<div>
									<Label>Serial Number</Label>
									<Input readOnly value={equipment.serial_number} />
								</div>
							)}
							{equipment.model_year && (
								<div>
									<Label>Model Year</Label>
									<Input readOnly value={equipment.model_year.toString()} />
								</div>
							)}
							{equipment.location && (
								<div>
									<Label>Location</Label>
									<Input readOnly value={equipment.location} />
								</div>
							)}
							{assetCategoryLabel && (
								<div>
									<Label>Asset Category</Label>
									<Input readOnly value={assetCategoryLabel} />
								</div>
							)}
							{assetSubcategoryLabel && (
								<div>
									<Label>Asset Subcategory</Label>
									<Input readOnly value={assetSubcategoryLabel} />
								</div>
							)}
							{equipment.capacity && (
								<div>
									<Label>Capacity</Label>
									<Input readOnly value={equipment.capacity} />
								</div>
							)}
							{equipment.efficiency && (
								<div>
									<Label>Efficiency</Label>
									<Input readOnly value={equipment.efficiency} />
								</div>
							)}
							{equipment.fuel_type && (
								<div>
									<Label>Fuel Type</Label>
									<Input readOnly value={equipment.fuel_type} />
								</div>
							)}
						</div>
					</UnifiedAccordionContent>
				),
			},
		];

		if (isVehicle) {
			const milesRemaining =
				typeof equipment.vehicle_next_service_mileage === "number" &&
				typeof equipment.vehicle_odometer === "number"
					? equipment.vehicle_next_service_mileage - equipment.vehicle_odometer
					: null;

			sections.push({
				id: "fleet-profile",
				title: "Fleet Profile",
				icon: <Truck className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Make</Label>
								<Input readOnly value={equipment.vehicle_make || "N/A"} />
							</div>
							<div>
								<Label>Model</Label>
								<Input readOnly value={equipment.vehicle_model || "N/A"} />
							</div>
							<div>
								<Label>Year</Label>
								<Input
									readOnly
									value={equipment.vehicle_year ? equipment.vehicle_year.toString() : "N/A"}
								/>
							</div>
							<div>
								<Label>VIN</Label>
								<Input readOnly value={equipment.vehicle_vin || "N/A"} />
							</div>
							<div>
								<Label>License / Unit</Label>
								<Input readOnly value={equipment.vehicle_license_plate || "N/A"} />
							</div>
							<div>
								<Label>Fuel Type</Label>
								<Input
									readOnly
									value={
										equipment.vehicle_fuel_type ? formatLabel(equipment.vehicle_fuel_type) : "N/A"
									}
								/>
							</div>
						</div>
					</UnifiedAccordionContent>
				),
			});

			sections.push({
				id: "fleet-service",
				title: "Service Metrics",
				icon: <Gauge className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Odometer</Label>
								<Input readOnly value={formatNumber(equipment.vehicle_odometer, "mi")} />
							</div>
							<div>
								<Label>Last Service Mileage</Label>
								<Input
									readOnly
									value={formatNumber(equipment.vehicle_last_service_mileage, "mi")}
								/>
							</div>
							<div>
								<Label>Next Service Mileage</Label>
								<Input
									readOnly
									value={formatNumber(equipment.vehicle_next_service_mileage, "mi")}
								/>
							</div>
							<div>
								<Label>Remaining Until Service</Label>
								<Input
									readOnly
									value={
										milesRemaining === null
											? "N/A"
											: milesRemaining < 0
												? `Past due by ${formatNumber(Math.abs(milesRemaining), "mi")}`
												: formatNumber(milesRemaining, "mi")
									}
								/>
							</div>
						</div>
					</UnifiedAccordionContent>
				),
			});

			sections.push({
				id: "fleet-compliance",
				title: "Compliance & Renewals",
				icon: <AlertTriangle className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Registration Expires</Label>
								<Input readOnly value={formatDate(equipment.vehicle_registration_expiration)} />
							</div>
							<div>
								<Label>Inspection Due</Label>
								<Input readOnly value={formatDate(equipment.vehicle_inspection_due)} />
							</div>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		if (isTool) {
			sections.push({
				id: "tool-profile",
				title: "Tool Profile",
				icon: <Wrench className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Tool Serial</Label>
								<Input readOnly value={equipment.tool_serial || "N/A"} />
							</div>
							<div>
								<Label>Primary Use</Label>
								<Input readOnly value={assetSubcategoryLabel || assetCategoryLabel || "N/A"} />
							</div>
						</div>
					</UnifiedAccordionContent>
				),
			});

			sections.push({
				id: "tool-calibration",
				title: "Calibration & Warranty",
				icon: <Gauge className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Calibration Due</Label>
								<Input readOnly value={formatDate(equipment.tool_calibration_due)} />
							</div>
							<div>
								<Label>Warranty Expires</Label>
								<Input readOnly value={formatDate(equipment.warranty_expiration)} />
							</div>
							<div>
								<Label>Condition</Label>
								<Input readOnly value={formatLabel(equipment.condition)} />
							</div>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		// NEW: Enhanced Installation Section with full job data
		if (equipment.install_date || equipment.installed_by || installJob) {
			sections.push({
				id: "installation",
				title: "Installation",
				icon: <Calendar className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								{equipment.install_date && (
									<div>
										<Label>Install Date</Label>
										<Input readOnly value={new Date(equipment.install_date).toLocaleDateString()} />
									</div>
								)}
								{equipment.installed_by && (
									<div>
										<Label>Installed By</Label>
										<Input readOnly value={equipment.installed_by} />
									</div>
								)}
							</div>

							{/* Install Job Card */}
							{installJob && (
								<div className="bg-card rounded-lg border p-4">
									<div className="flex items-start justify-between">
										<div>
											<Label className="mb-2 block">Install Job</Label>
											<h4 className="text-lg font-semibold">
												{installJob.title || `Job #${installJob.job_number}`}
											</h4>
											<p className="text-muted-foreground text-sm">#{installJob.job_number}</p>
											{installJob.completed_at && (
												<p className="text-muted-foreground mt-1 text-xs">
													Completed: {new Date(installJob.completed_at).toLocaleDateString()}
												</p>
											)}
											<div className="mt-2">
												<Badge variant="outline">{installJob.status}</Badge>
											</div>
										</div>
										<Button asChild size="sm" variant="outline">
											<Link href={`/dashboard/work/${installJob.id}`}>View Job</Link>
										</Button>
									</div>
								</div>
							)}
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		// NEW: Last Service Job Section
		if (lastServiceJob) {
			sections.push({
				id: "last-service",
				title: "Last Service",
				icon: <Wrench className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="bg-card rounded-lg border p-4">
							<div className="flex items-start justify-between">
								<div>
									<Label className="mb-2 block">Most Recent Service</Label>
									<h4 className="text-lg font-semibold">
										{lastServiceJob.title || `Job #${lastServiceJob.job_number}`}
									</h4>
									<p className="text-muted-foreground text-sm">#{lastServiceJob.job_number}</p>
									{lastServiceJob.completed_at && (
										<p className="text-muted-foreground mt-1 text-xs">
											Completed: {new Date(lastServiceJob.completed_at).toLocaleDateString()}
										</p>
									)}
									<div className="mt-2">
										<Badge variant="outline">{lastServiceJob.status}</Badge>
									</div>
								</div>
								<Button asChild size="sm" variant="outline">
									<Link href={`/dashboard/work/${lastServiceJob.id}`}>View Job</Link>
								</Button>
							</div>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		// NEW: Upcoming Maintenance Section
		if (upcomingMaintenance.length > 0) {
			sections.push({
				id: "upcoming-maintenance",
				title: "Upcoming Maintenance",
				icon: <Calendar className="size-4" />,
				count: upcomingMaintenance.length,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-3">
							{upcomingMaintenance.map((schedule: any) => (
								<div className="bg-card rounded-lg border p-4" key={schedule.id}>
									<div className="flex items-start justify-between">
										<div>
											<p className="font-medium">
												{new Date(schedule.scheduled_start).toLocaleDateString("en-US", {
													weekday: "long",
													month: "long",
													day: "numeric",
													year: "numeric",
												})}
											</p>
											<p className="text-muted-foreground text-sm">
												{new Date(schedule.scheduled_start).toLocaleTimeString("en-US", {
													hour: "numeric",
													minute: "2-digit",
												})}
											</p>
											{schedule.job && (
												<p className="text-muted-foreground mt-1 text-xs">
													{schedule.job.title || `Job #${schedule.job.job_number}`}
												</p>
											)}
											<div className="mt-2">
												<Badge variant="outline">{schedule.status}</Badge>
											</div>
										</div>
										<Button asChild size="sm" variant="outline">
											<Link href={`/dashboard/appointments/${schedule.id}`}>View</Link>
										</Button>
									</div>
								</div>
							))}
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		if (equipment.is_under_warranty || equipment.warranty_expiration) {
			sections.push({
				id: "warranty",
				title: "Warranty",
				icon: <ShieldCheck className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Under Warranty</Label>
								<Input readOnly value={equipment.is_under_warranty ? "Yes" : "No"} />
							</div>
							{equipment.warranty_expiration && (
								<div>
									<Label>Warranty Expiration</Label>
									<Input
										readOnly
										value={new Date(equipment.warranty_expiration).toLocaleDateString()}
									/>
								</div>
							)}
							{equipment.warranty_provider && (
								<div>
									<Label>Warranty Provider</Label>
									<Input readOnly value={equipment.warranty_provider} />
								</div>
							)}
							{equipment.warranty_notes && (
								<div className="md:col-span-2">
									<Label>Warranty Notes</Label>
									<p className="text-sm whitespace-pre-wrap">{equipment.warranty_notes}</p>
								</div>
							)}
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		if (serviceHistory.length > 0) {
			sections.push({
				id: "service-history",
				title: "Service History",
				icon: <Wrench className="size-4" />,
				count: serviceHistory.length,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-2">
							{serviceHistory.map((service: any) => (
								<div
									className="flex items-center justify-between rounded-lg border p-3"
									key={service.id}
								>
									<div>
										<p className="text-sm font-medium">{service.service_type || "Service"}</p>
										<p className="text-muted-foreground text-xs">
											{service.serviced_at
												? new Date(service.serviced_at).toLocaleDateString()
												: "Date unknown"}
										</p>
									</div>
									{service.job_id && (
										<Button asChild size="sm" variant="ghost">
											<Link href={`/dashboard/work/${service.job_id}`}>View Job</Link>
										</Button>
									)}
								</div>
							))}
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		if (equipment.last_service_date || equipment.next_service_due) {
			sections.push({
				id: "maintenance-schedule",
				title: "Maintenance Schedule",
				icon: <Calendar className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="grid gap-4 md:grid-cols-2">
							{equipment.last_service_date && (
								<div>
									<Label>Last Service</Label>
									<Input
										readOnly
										value={new Date(equipment.last_service_date).toLocaleDateString()}
									/>
								</div>
							)}
							{equipment.next_service_due && (
								<div>
									<Label>Next Service Due</Label>
									<Input
										readOnly
										value={new Date(equipment.next_service_due).toLocaleDateString()}
									/>
								</div>
							)}
							{equipment.service_interval_days && (
								<div>
									<Label>Service Interval</Label>
									<Input readOnly value={`${equipment.service_interval_days} days`} />
								</div>
							)}
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		if (customer) {
			sections.push({
				id: "customer-details",
				title: "Customer Details",
				icon: <User className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
							<div className="grid flex-1 gap-4 md:grid-cols-2">
								<div>
									<Label>Name</Label>
									<p className="text-sm">
										{customer.display_name ||
											`${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
											"Unknown"}
									</p>
								</div>
								<div>
									<Label>Email</Label>
									<p className="text-sm">{customer.email || "N/A"}</p>
								</div>
							</div>
							<Button asChild size="sm" variant="ghost">
								<Link href={`/dashboard/customers/${customer.id}`}>View Full Profile</Link>
							</Button>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		if (property) {
			sections.push({
				id: "property-location",
				title: "Property Location",
				icon: <MapPin className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-4">
							<div>
								<Label>Service Address</Label>
								<p className="text-sm">
									{property.address}
									{property.address2 && `, ${property.address2}`}
								</p>
								<p className="text-muted-foreground text-sm">
									{property.city}, {property.state} {property.zip_code}
								</p>
							</div>
							<Button asChild size="sm" variant="outline">
								<a
									href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
										`${property.address}, ${property.city}, ${property.state}`
									)}`}
									rel="noopener noreferrer"
									target="_blank"
								>
									<MapPin className="mr-2 size-4" />
									Open in Google Maps
								</a>
							</Button>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		return sections;
	}, [
		assetCategoryLabel,
		assetSubcategoryLabel,
		classificationLabel,
		equipment,
		customer,
		property,
		installJob,
		lastServiceJob,
		upcomingMaintenance,
		serviceHistory,
		isTool,
		isVehicle,
		typeLabel,
	]);

	const relatedItems = useMemo(() => {
		const items: any[] = [];

		if (customer) {
			items.push({
				id: `customer-${customer.id}`,
				type: "customer",
				title:
					customer.display_name ||
					`${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
					"Unknown Customer",
				subtitle: customer.email || customer.phone || undefined,
				href: `/dashboard/customers/${customer.id}`,
			});
		}

		if (property) {
			items.push({
				id: `property-${property.id}`,
				type: "property",
				title: property.address || property.name || "Property",
				subtitle: `${property.city || ""}, ${property.state || ""}`.trim() || undefined,
				href: `/dashboard/work/properties/${property.id}`,
			});
		}

		if (servicePlan) {
			items.push({
				id: `service-plan-${servicePlan.id}`,
				type: "service_plan",
				title: servicePlan.name || `Plan ${servicePlan.plan_number || servicePlan.id.slice(0, 8)}`,
				subtitle: servicePlan.status,
				href: `/dashboard/work/maintenance-plans/${servicePlan.id}`,
				badge: servicePlan.status
					? { label: servicePlan.status, variant: "outline" as const }
					: undefined,
			});
		}

		return items;
	}, [customer, property, servicePlan]);

	if (!mounted) {
		return <div className="flex-1 p-6">Loading...</div>;
	}

	return (
		<DetailPageContentLayout
			activities={activities}
			attachments={attachments}
			beforeContent={beforeContent}
			className="mx-auto w-full max-w-7xl"
			customSections={customSections}
			defaultOpenSection="equipment-details"
			header={headerConfig}
			notes={notes}
			relatedItems={relatedItems}
			showStandardSections={{
				activities: true,
				notes: true,
				attachments: true,
				relatedItems: true,
			}}
			storageKey="equipment-details"
		/>
	);
}
