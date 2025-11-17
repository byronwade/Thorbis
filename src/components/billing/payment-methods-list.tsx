"use client";

/**
 * Payment Methods List - Client Component
 *
 * Displays user's saved payment methods with:
 * - Default payment method indicator
 * - Payment method details (last4, brand, etc.)
 * - Actions (set as default, remove)
 * - Apple Pay / Google Pay indicators
 *
 * Client-side features:
 * - Interactive list with actions
 * - Optimistic updates
 * - Delete confirmation
 */

import { Circle, CreditCard, Smartphone, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type PaymentMethod = {
	id: string;
	stripePaymentMethodId: string;
	type: "card" | "apple_pay" | "google_pay" | "paypal" | "amazon_pay" | "klarna" | "link";
	brand?: string;
	last4?: string;
	expMonth?: number;
	expYear?: number;
	walletType?: string;
	displayName: string;
	isDefault: boolean;
	isDefaultForSubscription: boolean;
	createdAt: string;
};

type PaymentMethodsListProps = {
	/** List of payment methods */
	paymentMethods: PaymentMethod[];
	/** Callback when a payment method is set as default */
	onSetDefault?: (id: string) => Promise<void>;
	/** Callback when a payment method is set as default for subscriptions */
	onSetDefaultSubscription?: (id: string) => Promise<void>;
	/** Callback when a payment method is removed */
	onRemove?: (id: string) => Promise<void>;
};

/**
 * Get icon for payment method type
 */
function getPaymentMethodIcon(type: string, _brand?: string) {
	if (type === "apple_pay") {
		return <Smartphone className="size-4" />;
	}
	if (type === "google_pay") {
		return <Smartphone className="size-4" />;
	}
	return <CreditCard className="size-4" />;
}

/**
 * Format payment method display text
 */
function formatPaymentMethodText(method: PaymentMethod): string {
	if (method.type === "apple_pay") {
		return "Apple Pay";
	}
	if (method.type === "google_pay") {
		return "Google Pay";
	}
	if (method.type === "card") {
		return `${method.brand?.toUpperCase()} •••• ${method.last4}`;
	}
	return method.displayName;
}

/**
 * Payment Methods List Component
 */
export function PaymentMethodsList({
	paymentMethods,
	onSetDefault,
	onSetDefaultSubscription,
	onRemove,
}: PaymentMethodsListProps) {
	const [isUpdating, setIsUpdating] = useState<string | null>(null);

	const handleSetDefault = async (id: string) => {
		setIsUpdating(id);
		try {
			await onSetDefault?.(id);
		} finally {
			setIsUpdating(null);
		}
	};

	const handleSetDefaultSubscription = async (id: string) => {
		setIsUpdating(id);
		try {
			await onSetDefaultSubscription?.(id);
		} finally {
			setIsUpdating(null);
		}
	};

	const handleRemove = async (id: string) => {
		setIsUpdating(id);
		try {
			await onRemove?.(id);
		} finally {
			setIsUpdating(null);
		}
	};

	if (paymentMethods.length === 0) {
		return (
			<Card className="p-8 text-center">
				<CreditCard className="text-muted-foreground mx-auto size-12" />
				<h3 className="mt-4 text-lg font-semibold">No payment methods</h3>
				<p className="text-muted-foreground mt-2 text-sm">Add a payment method to get started</p>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{paymentMethods.map((method) => (
				<Card className="p-4" key={method.id}>
					<div className="flex items-center justify-between">
						{/* Left side: Icon, name, badges */}
						<div className="flex items-center gap-3">
							{getPaymentMethodIcon(method.type, method.brand)}
							<div>
								<div className="flex items-center gap-2">
									<span className="font-medium">{formatPaymentMethodText(method)}</span>
									{method.isDefault && (
										<Badge className="text-xs" variant="default">
											Default
										</Badge>
									)}
									{method.isDefaultForSubscription && (
										<Badge className="text-xs" variant="secondary">
											Default for subscriptions
										</Badge>
									)}
								</div>
								{method.type === "card" && method.expMonth && method.expYear && (
									<p className="text-muted-foreground text-sm">
										Expires {String(method.expMonth).padStart(2, "0")}/{method.expYear}
									</p>
								)}
								<p className="text-muted-foreground text-xs">
									Added {new Date(method.createdAt).toLocaleDateString()}
								</p>
							</div>
						</div>

						{/* Right side: Actions */}
						<div className="flex items-center gap-2">
							{/* Set as default for one-time payments */}
							{!method.isDefault && (
								<Button
									disabled={isUpdating === method.id}
									onClick={() => handleSetDefault(method.id)}
									size="sm"
									variant="ghost"
								>
									<Circle className="mr-2 size-4" />
									Set as default
								</Button>
							)}

							{/* Set as default for subscriptions */}
							{!method.isDefaultForSubscription && (
								<Button
									disabled={isUpdating === method.id}
									onClick={() => handleSetDefaultSubscription(method.id)}
									size="sm"
									variant="ghost"
								>
									<Circle className="mr-2 size-4" />
									Default for subscriptions
								</Button>
							)}

							{/* Remove payment method */}
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button disabled={isUpdating === method.id} size="sm" variant="ghost">
										<Trash2 className="text-destructive size-4" />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Remove payment method?</AlertDialogTitle>
										<AlertDialogDescription>
											This will remove {formatPaymentMethodText(method)} from your account. This
											action cannot be undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
											onClick={() => handleRemove(method.id)}
										>
											Remove
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}
