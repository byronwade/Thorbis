"use client";

/**
 * Customer Badges Component
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
import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";
import { type CustomerBadge, PREMADE_BADGES } from "@/types/customer-badges";

type CustomerBadgesProps = {
	customerId: string;
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

export function CustomerBadges({ customerId }: CustomerBadgesProps) {
	const [badges, setBadges] = useState<CustomerBadge[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showCustomDialog, setShowCustomDialog] = useState(false);
	const [customLabel, setCustomLabel] = useState("");
	const [customVariant, setCustomVariant] = useState<string>("default");

	// Load badges
	useEffect(() => {
		loadBadges();
	}, [loadBadges]);

	const loadBadges = async () => {
		setIsLoading(true);
		const result = await getCustomerBadges(customerId);
		if (result.success) {
			setBadges(result.data || []);
		}
		setIsLoading(false);
	};

	const handleAddPremadeBadge = async (premade: (typeof PREMADE_BADGES)[0]) => {
		const result = await addCustomerBadge({
			customerId,
			label: premade.label,
			variant: premade.variant,
			badgeType: "premade",
			icon: premade.icon,
		});

		if (result.success) {
			loadBadges();
		}
	};

	const handleAddCustomBadge = async () => {
		if (!customLabel.trim()) {
			return;
		}

		const result = await addCustomerBadge({
			customerId,
			label: customLabel,
			variant: customVariant as any,
			badgeType: "custom",
		});

		if (result.success) {
			setCustomLabel("");
			setCustomVariant("default");
			setShowCustomDialog(false);
			loadBadges();
		}
	};

	const handleRemoveBadge = async (badgeId: string) => {
		const result = await removeCustomerBadge(badgeId, customerId);
		if (result.success) {
			loadBadges();
		}
	};

	const handleGenerateAuto = async () => {
		const result = await generateAutoBadges(customerId);
		if (result.success) {
			loadBadges();
		}
	};

	if (isLoading) {
		return (
			<div className="flex gap-2 px-8 py-6">
				<div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
				<div className="h-6 w-32 animate-pulse rounded-full bg-muted" />
			</div>
		);
	}

	return (
		<div className="flex flex-wrap items-center gap-2 px-8 py-6">
			{/* Display Badges */}
			{badges.length === 0 && (
				<p className="text-muted-foreground text-sm">
					No badges yet — add badges to highlight important customer attributes
				</p>
			)}
			{badges.map((badge) => {
				const Icon = badge.icon ? ICON_MAP[badge.icon] : null;
				return (
					<div className="group relative" key={badge.id}>
						<Badge
							className={cn(
								"gap-1.5 pr-7 font-medium text-xs",
								badge.badge_type === "auto_generated" && "opacity-90",
							)}
							variant={badge.variant as any}
						>
							{Icon && <Icon className="size-3.5" />}
							{badge.label}
							<button
								className="-translate-y-1/2 absolute top-1/2 right-1.5 rounded-sm p-0.5 opacity-0 transition-opacity hover:bg-background/20 group-hover:opacity-100"
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
						onClick={handleGenerateAuto}
					>
						<LayoutGrid className="mr-2 size-4" />
						<span className="text-sm">Generate Auto Badges</span>
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
							<Label className="font-medium text-sm">Badge Label</Label>
							<Input
								className="text-sm"
								onChange={(e) => setCustomLabel(e.target.value)}
								placeholder="e.g., Preferred Vendor"
								value={customLabel}
							/>
						</div>
						<div className="space-y-2">
							<Label className="font-medium text-sm">Badge Style</Label>
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
							<Button className="flex-1" onClick={handleAddCustomBadge}>
								<Plus className="mr-2 size-4" />
								Add Badge
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
