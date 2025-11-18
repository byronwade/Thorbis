"use client";

/**
 * Customer Badges Component - Server Actions + useOptimistic (React 19)
 *
 * Performance optimizations:
 * - useOptimistic for instant UI feedback
 * - Server Actions for mutations with auto-revalidation
 * - No external state management needed
 *
 * Displays badges at the top of the customer profile:
 * - Custom badges
 * - Premade badges (DO NOT SERVICE, VIP, etc.)
 * - Auto-generated badges (past due, payment status)
 * - Dropdown to add new badges
 */

import {
	AlertTriangle,
	Calendar,
	FileCheck,
	Heart,
	LayoutGrid,
	Plus,
	Receipt,
	ShieldCheck,
	Star,
	UserPlus,
	X,
} from "lucide-react";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import {
	addCustomerBadge,
	generateAutoBadges,
	getCustomerBadges,
	removeCustomerBadge,
} from "@/actions/customer-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type CustomerBadge, PREMADE_BADGES } from "@/types/customer-badges";

type CustomerBadgesProps = {
	customerId: string;
	initialBadges?: CustomerBadge[];
};

const ICON_MAP: Record<string, any> = {
	AlertTriangle,
	Star,
	Calendar,
	Receipt,
	ShieldCheck,
	FileCheck,
	Heart,
	UserPlus,
};

export function CustomerBadges({
	customerId,
	initialBadges = [],
}: CustomerBadgesProps) {
	// Local UI state
	const [showCustomDialog, setShowCustomDialog] = useState(false);
	const [customLabel, setCustomLabel] = useState("");
	const [customVariant, setCustomVariant] = useState<string>("default");

	// Data state
	const [badges, setBadges] = useState<CustomerBadge[]>(initialBadges);
	const [isLoading, setIsLoading] = useState(initialBadges.length === 0);
	const [error, setError] = useState<string | null>(null);

	const [isPending, startTransition] = useTransition();
	const [optimisticBadges, updateOptimisticBadges] = useOptimistic(
		badges,
		(state, update: CustomerBadge | { id: string; action: "delete" }) => {
			if ("action" in update && update.action === "delete") {
				return state.filter((badge) => badge.id !== update.id);
			}
			return [...state, update as CustomerBadge];
		},
	);

	// Load badges on mount
	useEffect(() => {
		const loadBadges = async () => {
			setIsLoading(true);
			setError(null);

			const result = await getCustomerBadges(customerId);

			if (!result.success) {
				setError(result.error || "Failed to fetch badges");
			} else {
				setBadges(result.data || []);
			}

			setIsLoading(false);
		};

		if (initialBadges.length === 0) {
			loadBadges();
		}
	}, [customerId, initialBadges.length]);

	// Handlers
	const handleAddPremadeBadge = async (premade: (typeof PREMADE_BADGES)[0]) => {
		const tempBadge: CustomerBadge = {
			id: `temp-${Date.now()}`,
			customer_id: customerId,
			company_id: "",
			label: premade.label,
			variant: premade.variant,
			badge_type: "premade",
			icon: premade.icon,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		startTransition(async () => {
			updateOptimisticBadges(tempBadge);

			const result = await addCustomerBadge({
				customerId,
				label: premade.label,
				variant: premade.variant,
				badgeType: "premade",
				icon: premade.icon,
			});

			if (result.success) {
				toast.success("Badge added successfully");
				// Refresh badges
				const refreshResult = await getCustomerBadges(customerId);
				if (refreshResult.success) {
					setBadges(refreshResult.data || []);
				}
			} else {
				toast.error(result.error || "Failed to add badge");
				// Revert optimistic update
				setBadges((prev) => prev.filter((b) => b.id !== tempBadge.id));
			}
		});
	};

	const handleAddCustomBadge = async () => {
		if (!customLabel.trim()) {
			toast.error("Badge label is required");
			return;
		}

		const tempBadge: CustomerBadge = {
			id: `temp-${Date.now()}`,
			customer_id: customerId,
			company_id: "",
			label: customLabel,
			variant: customVariant,
			badge_type: "custom",
			icon: undefined,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		startTransition(async () => {
			updateOptimisticBadges(tempBadge);

			const result = await addCustomerBadge({
				customerId,
				label: customLabel,
				variant: customVariant,
				badgeType: "custom",
			});

			if (result.success) {
				toast.success("Badge added successfully");
				setCustomLabel("");
				setCustomVariant("default");
				setShowCustomDialog(false);
				// Refresh badges
				const refreshResult = await getCustomerBadges(customerId);
				if (refreshResult.success) {
					setBadges(refreshResult.data || []);
				}
			} else {
				toast.error(result.error || "Failed to add badge");
				// Revert optimistic update
				setBadges((prev) => prev.filter((b) => b.id !== tempBadge.id));
			}
		});
	};

	const handleRemoveBadge = async (badgeId: string) => {
		startTransition(async () => {
			updateOptimisticBadges({ id: badgeId, action: "delete" });

			const result = await removeCustomerBadge(badgeId, customerId);

			if (!result.success) {
				toast.error(result.error || "Failed to remove badge");
			}

			// Refresh badges
			const refreshResult = await getCustomerBadges(customerId);
			if (refreshResult.success) {
				setBadges(refreshResult.data || []);
			}
		});
	};

	const handleGenerateAuto = async () => {
		startTransition(async () => {
			const result = await generateAutoBadges(customerId);

			if (result.success) {
				toast.success("Auto badges generated");
				// Refresh badges
				const refreshResult = await getCustomerBadges(customerId);
				if (refreshResult.success) {
					setBadges(refreshResult.data || []);
				}
			} else {
				toast.error(result.error || "Failed to generate badges");
			}
		});
	};

	// Loading skeleton
	if (isLoading && badges.length === 0) {
		return (
			<div className="flex gap-2 px-8 py-6">
				<Skeleton className="h-6 w-24 rounded-full" />
				<Skeleton className="h-6 w-32 rounded-full" />
				<Skeleton className="h-6 w-28 rounded-full" />
			</div>
		);
	}

	// Error state
	if (error && badges.length === 0) {
		return (
			<div className="flex items-center gap-2 px-8 py-6">
				<AlertTriangle className="text-destructive size-4" />
				<p className="text-destructive text-sm">
					Failed to load badges: {error}
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-wrap items-center gap-2 px-8 py-6">
			{/* Display Badges */}
			{optimisticBadges.length === 0 && (
				<p className="text-muted-foreground text-sm">
					No badges yet — add badges to highlight important customer attributes
				</p>
			)}
			{optimisticBadges.map((badge) => {
				const Icon = badge.icon ? ICON_MAP[badge.icon] : null;
				const isTemp = badge.id.startsWith("temp-");
				return (
					<div className="group relative" key={badge.id}>
						<Badge
							className={cn(
								"gap-1.5 pr-7 text-xs font-medium",
								badge.badge_type === "auto_generated" && "opacity-90",
								isTemp && "opacity-50",
							)}
							variant={badge.variant as any}
						>
							{Icon && <Icon className="size-3.5" />}
							{badge.label}
							<button
								className="hover:bg-background/20 absolute top-1/2 right-1.5 -translate-y-1/2 rounded-sm p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
								disabled={isPending || isTemp}
								onClick={() => handleRemoveBadge(badge.id)}
								title="Remove badge"
								type="button"
							>
								<X className="size-3" />
							</button>
						</Badge>
					</div>
				);
			})}

			{/* Add Badge Dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="gap-1.5 text-xs" size="sm" variant="outline">
						<Plus className="size-3.5" />
						Add Badge
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-64">
					<DropdownMenuLabel className="text-xs">
						Premade Badges
					</DropdownMenuLabel>
					{PREMADE_BADGES.map((premade) => {
						const Icon = ICON_MAP[premade.icon];
						return (
							<DropdownMenuItem
								className="cursor-pointer"
								disabled={isPending}
								key={premade.label}
								onClick={() => handleAddPremadeBadge(premade)}
							>
								{Icon && <Icon className="mr-2 size-4" />}
								<span className="text-sm">{premade.label}</span>
							</DropdownMenuItem>
						);
					})}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer"
						onClick={() => setShowCustomDialog(true)}
					>
						<Plus className="mr-2 size-4" />
						<span className="text-sm">Custom Badge</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer"
						disabled={isPending}
						onClick={handleGenerateAuto}
					>
						<LayoutGrid className="mr-2 size-4" />
						<span className="text-sm">
							{isPending ? "Generating..." : "Generate Auto Badges"}
						</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Custom Badge Dialog */}
			<Dialog onOpenChange={setShowCustomDialog} open={showCustomDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle className="text-lg">Add Custom Badge</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 pt-4">
						<div className="space-y-2">
							<Label className="text-sm font-medium">Badge Label</Label>
							<Input
								className="text-sm"
								onChange={(e) => setCustomLabel(e.target.value)}
								placeholder="e.g., Preferred Vendor"
								value={customLabel}
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-sm font-medium">Badge Style</Label>
							<Select onValueChange={setCustomVariant} value={customVariant}>
								<SelectTrigger className="text-sm">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem className="text-sm" value="default">
										Default (Gray)
									</SelectItem>
									<SelectItem className="text-sm" value="success">
										Success (Green)
									</SelectItem>
									<SelectItem className="text-sm" value="warning">
										Warning (Yellow)
									</SelectItem>
									<SelectItem className="text-sm" value="destructive">
										Destructive (Red)
									</SelectItem>
									<SelectItem className="text-sm" value="secondary">
										Secondary (Blue)
									</SelectItem>
									<SelectItem className="text-sm" value="outline">
										Outline
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex gap-2 pt-2">
							<Button
								className="flex-1"
								onClick={() => setShowCustomDialog(false)}
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								className="flex-1"
								disabled={isPending}
								onClick={handleAddCustomBadge}
							>
								<Plus className="mr-2 size-4" />
								{isPending ? "Adding..." : "Add Badge"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
