"use client";

/**
 * Transfer Call Modal - Client Component
 *
 * Allows transferring an active call to another number
 */

import { ArrowRightLeft, Phone } from "lucide-react";
import { useState } from "react";
import { transferActiveCall } from "@/actions/telnyx";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TransferCallModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	callControlId: string | null;
	fromNumber: string;
	onTransferSuccess: () => void;
};

export function TransferCallModal({
	open,
	onOpenChange,
	callControlId,
	fromNumber,
	onTransferSuccess,
}: TransferCallModalProps) {
	const [destinationNumber, setDestinationNumber] = useState("");
	const [isTransferring, setIsTransferring] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleTransfer = async () => {
		if (!callControlId) {
			setError("No active call to transfer");
			return;
		}

		if (!destinationNumber) {
			setError("Please enter a destination number");
			return;
		}

		// Basic phone number validation
		const phoneRegex = /^\+?[1-9]\d{1,14}$/;
		if (!phoneRegex.test(destinationNumber.replace(/[-()\s]/g, ""))) {
			setError("Please enter a valid phone number");
			return;
		}

		setIsTransferring(true);
		setError(null);

		try {
			const result = await transferActiveCall({
				callControlId,
				to: destinationNumber,
				from: fromNumber,
			});

			if (result.success) {
				onTransferSuccess();
				onOpenChange(false);
				setDestinationNumber("");
			} else {
				setError(result.error || "Failed to transfer call");
			}
		} catch (_err) {
			setError("An unexpected error occurred");
		} finally {
			setIsTransferring(false);
		}
	};

	const handleClose = () => {
		if (!isTransferring) {
			onOpenChange(false);
			setDestinationNumber("");
			setError(null);
		}
	};

	return (
		<Dialog onOpenChange={handleClose} open={open}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<ArrowRightLeft className="size-5" />
						Transfer Call
					</DialogTitle>
					<DialogDescription>
						Enter the phone number you want to transfer this call to.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="destination">Destination Phone Number</Label>
						<div className="relative">
							<Phone className="text-muted-foreground absolute top-3 left-3 size-4" />
							<Input
								autoFocus
								className="pl-10"
								disabled={isTransferring}
								id="destination"
								onChange={(e) => setDestinationNumber(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleTransfer()}
								placeholder="+1 (555) 123-4567"
								value={destinationNumber}
							/>
						</div>
						<p className="text-muted-foreground text-xs">
							Enter number with country code (e.g., +1 for US)
						</p>
					</div>

					{error && (
						<div className="border-destructive bg-destructive/10 text-destructive rounded-lg border p-3 text-sm">
							<p>{error}</p>
						</div>
					)}

					<div className="bg-muted/50 rounded-lg border p-3">
						<p className="text-sm font-medium">
							What happens when you transfer?
						</p>
						<ul className="text-muted-foreground mt-2 space-y-1 text-xs">
							<li>• The caller will be connected to the destination number</li>
							<li>• You will be disconnected from the call</li>
							<li>• The caller won't need to dial again</li>
							<li>• Call charges may apply to the destination</li>
						</ul>
					</div>
				</div>

				<DialogFooter className="sm:space-x-2">
					<Button
						disabled={isTransferring}
						onClick={handleClose}
						variant="outline"
					>
						Cancel
					</Button>
					<Button
						disabled={isTransferring || !destinationNumber}
						onClick={handleTransfer}
					>
						{isTransferring ? (
							<>
								<div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
								Transferring...
							</>
						) : (
							<>
								<ArrowRightLeft className="mr-2 size-4" />
								Transfer Call
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
