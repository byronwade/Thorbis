"use client";

/**
 * Customer Badges Component - React Query Refactored
 *
 * Performance optimizations:
 * - Uses React Query for automatic caching and refetching
 * - Optimistic updates for instant UI feedback
 * - Automatic background refetching
 * - Intelligent cache invalidation
 *
 * Displays badges at the top of the customer profile:
 * - Custom badges
 * - Premade badges (DO NOT SERVICE, VIP, etc.)
 * - Auto-generated badges (past due, payment status)
 * - Dropdown to add new badges
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useState } from "react";
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
	const queryClient = useQueryClient();

	// Local UI state
	const [showCustomDialog, setShowCustomDialog] = useState(false);
	const [customLabel, setCustomLabel] = useState("");
	const [customVariant, setCustomVariant] = useState<string>("default");

	// React Query: Fetch badges
	const {
		data: badges,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["customer-badges", customerId],
		queryFn: async () => {
			const result = await getCustomerBadges(customerId);
			if (!result.success) {
				throw new Error(result.error || "Failed to fetch badges");
			}
			return result.data || [];
		},
		staleTime: 60 * 1000, // 1 minute
		refetchOnWindowFocus: true,
	});

	// React Query: Add badge mutation
	const addBadgeMutation = useMutation({
		mutationFn: async (badge: {
			label: string;
			variant: string;
			badgeType: string;
			icon?: string;
		}) => {
			const result = await addCustomerBadge({
				customerId,
				...badge,
			});
			if (!result.success) {
				throw new Error(result.error || "Failed to add badge");
			}
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["customer-badges", customerId],
			});
			toast.success("Badge added successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	// React Query: Remove badge mutation with optimistic update
	const removeBadgeMutation = useMutation({
		mutationFn: async (badgeId: string) => {
			const result = await removeCustomerBadge(badgeId, customerId);
			if (!result.success) {
				throw new Error(result.error || "Failed to remove badge");
			}
			return result;
		},
		onMutate: async (badgeId) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({
				queryKey: ["customer-badges", customerId],
			});

			// Snapshot previous value
			const previousBadges = queryClient.getQueryData([
				"customer-badges",
				customerId,
			]);

			// Optimistically remove badge
			queryClient.setQueryData(
				["customer-badges", customerId],
				(old: CustomerBadge[] | undefined) =>
					old ? old.filter((badge) => badge.id !== badgeId) : old,
			);

			return { previousBadges };
		},
		onError: (error: Error, _badgeId, context) => {
			// Rollback on error
			if (context?.previousBadges) {
				queryClient.setQueryData(
					["customer-badges", customerId],
					context.previousBadges,
				);
			}
			toast.error(error.message);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["customer-badges", customerId],
			});
		},
	});

	// React Query: Generate auto badges mutation
	const generateAutoBadgesMutation = useMutation({
		mutationFn: async () => {
			const result = await generateAutoBadges(customerId);
			if (!result.success) {
				throw new Error(result.error || "Failed to generate badges");
			}
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["customer-badges", customerId],
			});
			toast.success("Auto badges generated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	// Handlers
	const handleAddPremadeBadge = (premade: (typeof PREMADE_BADGES)[0]) => {
		addBadgeMutation.mutate({
			label: premade.label,
			variant: premade.variant,
			badgeType: "premade",
			icon: premade.icon,
		});
	};

	const handleAddCustomBadge = () => {
		if (!customLabel.trim()) {
			toast.error("Badge label is required");
			return;
		}
		addBadgeMutation.mutate({
			label: customLabel,
			variant: customVariant,
			badgeType: "custom",
		});
		setCustomLabel("");
		setCustomVariant("default");
		setShowCustomDialog(false);
	};

	const handleRemoveBadge = (badgeId: string) => {
		removeBadgeMutation.mutate(badgeId);
	};

	const handleGenerateAuto = () => {
		generateAutoBadgesMutation.mutate();
	};

	// Loading skeleton
	if (isLoading) {
		return (
			<div className="flex gap-2 px-8 py-6">
				<Skeleton className="h-6 w-24 rounded-full" />
				<Skeleton className="h-6 w-32 rounded-full" />
				<Skeleton className="h-6 w-28 rounded-full" />
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="flex items-center gap-2 px-8 py-6">
				<AlertTriangle className="size-4 text-destructive" />
				<p className="text-destructive text-sm">
					Failed to load badges: {error.message}
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-wrap items-center gap-2 px-8 py-6">
			{/* Display Badges */}
			{badges?.length === 0 && (
				<p className="text-muted-foreground text-sm">
					No badges yet — add badges to highlight important customer attributes
				</p>
			)}
			{badges?.map((badge) => {
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
								disabled={removeBadgeMutation.isPending}
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
								disabled={addBadgeMutation.isPending}
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
						disabled={generateAutoBadgesMutation.isPending}
						onClick={handleGenerateAuto}
					>
						<LayoutGrid className="mr-2 size-4" />
						<span className="text-sm">
							{generateAutoBadgesMutation.isPending
								? "Generating..."
								: "Generate Auto Badges"}
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
							<Button
								className="flex-1"
								disabled={addBadgeMutation.isPending}
								onClick={handleAddCustomBadge}
							>
								<Plus className="mr-2 size-4" />
								{addBadgeMutation.isPending ? "Adding..." : "Add Badge"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
