"use client";

/**
 * Email Permissions Manager Component
 *
 * Allows admins/owners to manage email category permissions for team members.
 * Displays current permissions and provides toggle controls for read/send/assign.
 *
 * Features:
 * - View all permission categories
 * - Toggle individual permissions (read, send, assign)
 * - Visual indicators for granted/denied permissions
 * - Automatic permission grants for roles (owner/admin = all, csr = support)
 * - Cannot revoke "personal" category (always granted)
 */

import {
	AlertCircle,
	CheckCircle2,
	CreditCard,
	Lock,
	Mail,
	Megaphone,
	Shield,
	ShoppingCart,
	User,
} from "lucide-react";
import { useState, useTransition } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

export type EmailCategory =
	| "personal"
	| "support"
	| "sales"
	| "billing"
	| "marketing"
	| "all";

interface EmailPermission {
	category: EmailCategory;
	canRead: boolean;
	canSend: boolean;
	canAssign: boolean;
}

interface EmailPermissionsManagerProps {
	teamMemberId: string;
	teamMemberName: string;
	teamMemberRole: string;
	permissions: EmailPermission[];
	onUpdate?: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const CATEGORY_METADATA: Record<
	EmailCategory,
	{
		label: string;
		description: string;
		icon: React.ElementType;
		color: string;
	}
> = {
	personal: {
		label: "Personal",
		description: "User's own Gmail inbox",
		icon: User,
		color: "text-blue-500",
	},
	support: {
		label: "Support",
		description: "Customer support and help emails",
		icon: Shield,
		color: "text-green-500",
	},
	sales: {
		label: "Sales",
		description: "Sales, quotes, and proposals",
		icon: ShoppingCart,
		color: "text-purple-500",
	},
	billing: {
		label: "Billing",
		description: "Invoices, payments, and billing",
		icon: CreditCard,
		color: "text-amber-500",
	},
	marketing: {
		label: "Marketing",
		description: "Campaigns and newsletters",
		icon: Megaphone,
		color: "text-pink-500",
	},
	all: {
		label: "All Access",
		description: "Full access to all email categories",
		icon: Mail,
		color: "text-red-500",
	},
};

// =============================================================================
// COMPONENT
// =============================================================================

export function EmailPermissionsManager({
	teamMemberId,
	teamMemberName,
	teamMemberRole,
	permissions,
	onUpdate,
}: EmailPermissionsManagerProps) {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Helper to check if category is locked (can't be modified)
	const isCategoryLocked = (category: EmailCategory): boolean => {
		// Personal is always granted
		if (category === "personal") return true;

		// Owners/admins always have "all"
		if (
			category === "all" &&
			(teamMemberRole === "owner" || teamMemberRole === "admin")
		) {
			return true;
		}

		return false;
	};

	// Helper to get permission for category
	const getPermission = (category: EmailCategory): EmailPermission => {
		return (
			permissions.find((p) => p.category === category) || {
				category,
				canRead: false,
				canSend: false,
				canAssign: false,
			}
		);
	};

	// Handle permission toggle
	const handleToggle = async (
		category: EmailCategory,
		action: "read" | "send" | "assign",
		currentValue: boolean,
	) => {
		setError(null);
		setSuccess(null);

		// Build new permission state
		const permission = getPermission(category);
		const newPermission = {
			...permission,
			[`can${action.charAt(0).toUpperCase() + action.slice(1)}`]: !currentValue,
		};

		startTransition(async () => {
			try {
				const response = await fetch("/api/email/permissions", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						teamMemberId,
						category,
						canRead: newPermission.canRead,
						canSend: newPermission.canSend,
						canAssign: newPermission.canAssign,
					}),
				});

				const result = await response.json();

				if (!response.ok) {
					throw new Error(result.error || "Failed to update permission");
				}

				setSuccess(
					`Permission updated for ${CATEGORY_METADATA[category].label}`,
				);
				onUpdate?.();
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to update permission",
				);
			}
		});
	};

	// Handle revoke category
	const handleRevoke = async (category: EmailCategory) => {
		setError(null);
		setSuccess(null);

		if (
			!confirm(
				`Revoke all ${CATEGORY_METADATA[category].label} permissions for ${teamMemberName}?`,
			)
		) {
			return;
		}

		startTransition(async () => {
			try {
				const response = await fetch("/api/email/permissions", {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						teamMemberId,
						category,
					}),
				});

				const result = await response.json();

				if (!response.ok) {
					throw new Error(result.error || "Failed to revoke permission");
				}

				setSuccess(`Revoked ${CATEGORY_METADATA[category].label} permissions`);
				onUpdate?.();
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to revoke permission",
				);
			}
		});
	};

	return (
		<div className="space-y-4">
			{/* Header */}
			<div>
				<h3 className="text-lg font-semibold">Email Permissions</h3>
				<p className="text-muted-foreground text-sm">
					Manage what email categories {teamMemberName} can access
				</p>
			</div>

			{/* Error Alert */}
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="size-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Success Alert */}
			{success && (
				<Alert className="border-success/50 text-success">
					<CheckCircle2 className="size-4" />
					<AlertTitle>Success</AlertTitle>
					<AlertDescription>{success}</AlertDescription>
				</Alert>
			)}

			{/* Permission Cards */}
			<div className="space-y-3">
				{(Object.keys(CATEGORY_METADATA) as EmailCategory[]).map((category) => {
					const permission = getPermission(category);
					const metadata = CATEGORY_METADATA[category];
					const Icon = metadata.icon;
					const isLocked = isCategoryLocked(category);
					const hasAnyPermission =
						permission.canRead || permission.canSend || permission.canAssign;

					return (
						<Card key={category} className={cn(isLocked && "bg-muted/30")}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-3">
										<div
											className={cn("rounded-lg bg-muted p-2", metadata.color)}
										>
											<Icon className="size-4" />
										</div>
										<div>
											<CardTitle className="flex items-center gap-2 text-base">
												{metadata.label}
												{isLocked && <Lock className="size-3" />}
												{hasAnyPermission && !isLocked && (
													<Badge variant="secondary">Granted</Badge>
												)}
											</CardTitle>
											<CardDescription>{metadata.description}</CardDescription>
										</div>
									</div>
								</div>
							</CardHeader>

							<CardContent className="space-y-3">
								{/* Read Permission */}
								<div className="flex items-center justify-between">
									<Label className="text-sm" htmlFor={`${category}-read`}>
										Can Read
									</Label>
									<Switch
										checked={permission.canRead}
										disabled={isPending || isLocked}
										id={`${category}-read`}
										onCheckedChange={() =>
											handleToggle(category, "read", permission.canRead)
										}
									/>
								</div>

								{/* Send Permission */}
								<div className="flex items-center justify-between">
									<Label className="text-sm" htmlFor={`${category}-send`}>
										Can Send
									</Label>
									<Switch
										checked={permission.canSend}
										disabled={isPending || isLocked}
										id={`${category}-send`}
										onCheckedChange={() =>
											handleToggle(category, "send", permission.canSend)
										}
									/>
								</div>

								{/* Assign Permission */}
								<div className="flex items-center justify-between">
									<Label className="text-sm" htmlFor={`${category}-assign`}>
										Can Assign
									</Label>
									<Switch
										checked={permission.canAssign}
										disabled={isPending || isLocked}
										id={`${category}-assign`}
										onCheckedChange={() =>
											handleToggle(category, "assign", permission.canAssign)
										}
									/>
								</div>

								{/* Revoke Button */}
								{hasAnyPermission && !isLocked && (
									<Button
										className="w-full"
										disabled={isPending}
										onClick={() => handleRevoke(category)}
										size="sm"
										variant="ghost"
									>
										Revoke All {metadata.label} Permissions
									</Button>
								)}

								{/* Locked Message */}
								{isLocked && (
									<p className="text-muted-foreground text-xs">
										{category === "personal"
											? "Personal permissions are always granted"
											: "Automatically granted based on role"}
									</p>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
