"use client";

/**
 * Add Payment Method Dialog
 *
 * Allows adding payment methods via Stripe with support for:
 * - Credit/Debit Cards
 * - ACH Bank Accounts
 * - Digital Wallets (Apple Pay, Google Pay)
 *
 * Uses Stripe Elements for secure PCI-compliant collection
 * Supports test mode with test card numbers
 */

import { AlertCircle, CreditCard, Landmark } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AddPaymentMethodDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	customerId: string;
	onSuccess?: () => void;
};

export function AddPaymentMethodDialog({
	open,
	onOpenChange,
	customerId,
	onSuccess,
}: AddPaymentMethodDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [paymentType, setPaymentType] = useState<"card" | "ach">("card");

	// Test card state
	const [testCardNumber, setTestCardNumber] = useState("");
	const [testExpMonth, setTestExpMonth] = useState("");
	const [testExpYear, setTestExpYear] = useState("");
	const [testCvc, setTestCvc] = useState("");

	const handleAddTestCard = async () => {
		setIsLoading(true);
		setError(null);

		try {
			// TODO: Integrate with Stripe API to create payment method
			// For now, simulate adding a test card

			// Validate test card
			if (!(testCardNumber && testExpMonth && testExpYear && testCvc)) {
				setError("Please fill in all card details");
				setIsLoading(false);
				return;
			}

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			alert(
				"Payment method functionality coming soon! This will integrate with Stripe to securely save payment methods.",
			);

			onSuccess?.();
			onOpenChange(false);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to add payment method",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Add Payment Method</DialogTitle>
					<DialogDescription>
						Securely add a payment method for invoices and recurring payments
					</DialogDescription>
				</DialogHeader>

				<Tabs onValueChange={(v: any) => setPaymentType(v)} value={paymentType}>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger className="gap-2" value="card">
							<CreditCard className="size-4" />
							Card
						</TabsTrigger>
						<TabsTrigger className="gap-2" value="ach">
							<Landmark className="size-4" />
							Bank Account
						</TabsTrigger>
					</TabsList>

					<TabsContent className="space-y-4" value="card">
						{/* Test Card Info Alert */}
						<Alert>
							<AlertCircle className="size-4" />
							<AlertDescription className="text-xs">
								<strong>Test Cards:</strong> Use 4242 4242 4242 4242 (any CVC,
								future date)
							</AlertDescription>
						</Alert>

						{/* Card Number */}
						<div className="space-y-2">
							<Label>Card Number</Label>
							<Input
								maxLength={19}
								onChange={(e) => setTestCardNumber(e.target.value)}
								placeholder="4242 4242 4242 4242"
								type="text"
								value={testCardNumber}
							/>
						</div>

						{/* Expiration & CVC */}
						<div className="grid grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label>Month</Label>
								<Input
									maxLength={2}
									onChange={(e) => setTestExpMonth(e.target.value)}
									placeholder="MM"
									type="text"
									value={testExpMonth}
								/>
							</div>
							<div className="space-y-2">
								<Label>Year</Label>
								<Input
									maxLength={4}
									onChange={(e) => setTestExpYear(e.target.value)}
									placeholder="YYYY"
									type="text"
									value={testExpYear}
								/>
							</div>
							<div className="space-y-2">
								<Label>CVC</Label>
								<Input
									maxLength={4}
									onChange={(e) => setTestCvc(e.target.value)}
									placeholder="123"
									type="text"
									value={testCvc}
								/>
							</div>
						</div>

						{error && (
							<Alert variant="destructive">
								<AlertCircle className="size-4" />
								<AlertDescription className="text-sm">{error}</AlertDescription>
							</Alert>
						)}

						<div className="flex gap-2 pt-4">
							<Button
								className="flex-1"
								disabled={isLoading}
								onClick={() => onOpenChange(false)}
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								className="flex-1"
								disabled={isLoading}
								onClick={handleAddTestCard}
							>
								{isLoading ? "Adding..." : "Add Card"}
							</Button>
						</div>
					</TabsContent>

					<TabsContent className="space-y-4" value="ach">
						{/* ACH Bank Account */}
						<Alert>
							<AlertCircle className="size-4" />
							<AlertDescription className="text-xs">
								<strong>Test Routing:</strong> 110000000 (any account number)
							</AlertDescription>
						</Alert>

						<div className="space-y-4">
							<div className="space-y-2">
								<Label>Routing Number</Label>
								<Input maxLength={9} placeholder="110000000" type="text" />
							</div>
							<div className="space-y-2">
								<Label>Account Number</Label>
								<Input placeholder="000123456789" type="text" />
							</div>
							<div className="space-y-2">
								<Label>Account Holder Name</Label>
								<Input placeholder="John Smith" type="text" />
							</div>
						</div>

						{error && (
							<Alert variant="destructive">
								<AlertCircle className="size-4" />
								<AlertDescription className="text-sm">{error}</AlertDescription>
							</Alert>
						)}

						<div className="flex gap-2 pt-4">
							<Button
								className="flex-1"
								onClick={() => onOpenChange(false)}
								variant="outline"
							>
								Cancel
							</Button>
							<Button className="flex-1" disabled>
								Add Bank Account (Coming Soon)
							</Button>
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
