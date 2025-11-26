"use client";

/**
 * Transfer Call Modal
 *
 * Allows users to transfer an active call to another extension or number.
 * This is a stub implementation - full functionality to be added when call
 * transfer features are implemented.
 */

import { Phone, PhoneForwarded, Search, User, X } from "lucide-react";
import { useState } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TransferCallModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	callControlId: string | null;
	fromNumber: string;
	onTransferSuccess: () => void;
}

type TransferType = "blind" | "attended";

export function TransferCallModal({
	open,
	onOpenChange,
	callControlId,
	fromNumber,
	onTransferSuccess,
}: TransferCallModalProps) {
	const [transferType, setTransferType] = useState<TransferType>("blind");
	const [targetNumber, setTargetNumber] = useState("");
	const [isTransferring, setIsTransferring] = useState(false);

	const handleTransfer = async () => {
		if (!callControlId || !targetNumber.trim()) {
			return;
		}

		setIsTransferring(true);

		try {
			// TODO: Implement actual call transfer via Telnyx API
			// For now, simulate a transfer
			await new Promise((resolve) => setTimeout(resolve, 1000));

			onTransferSuccess();
			onOpenChange(false);
			setTargetNumber("");
		} catch (error) {
			console.error("Failed to transfer call:", error);
		} finally {
			setIsTransferring(false);
		}
	};

	const handleClose = () => {
		if (!isTransferring) {
			onOpenChange(false);
			setTargetNumber("");
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<PhoneForwarded className="size-5 text-primary" />
						Transfer Call
					</DialogTitle>
					<DialogDescription>
						Transfer the current call from {fromNumber || "unknown"} to another
						number or extension.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					{/* Transfer Type Selection */}
					<div className="grid gap-2">
						<Label htmlFor="transfer-type">Transfer Type</Label>
						<Select
							value={transferType}
							onValueChange={(value: TransferType) => setTransferType(value)}
						>
							<SelectTrigger id="transfer-type">
								<SelectValue placeholder="Select transfer type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="blind">
									<div className="flex items-center gap-2">
										<Phone className="size-4" />
										<div>
											<div className="font-medium">Blind Transfer</div>
											<div className="text-muted-foreground text-xs">
												Transfer immediately without announcement
											</div>
										</div>
									</div>
								</SelectItem>
								<SelectItem value="attended">
									<div className="flex items-center gap-2">
										<User className="size-4" />
										<div>
											<div className="font-medium">Attended Transfer</div>
											<div className="text-muted-foreground text-xs">
												Speak with recipient before transferring
											</div>
										</div>
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Target Number Input */}
					<div className="grid gap-2">
						<Label htmlFor="target-number">Transfer To</Label>
						<div className="relative">
							<Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
							<Input
								id="target-number"
								className="pl-9"
								placeholder="Enter number or search contacts..."
								value={targetNumber}
								onChange={(e) => setTargetNumber(e.target.value)}
								disabled={isTransferring}
							/>
						</div>
						<p className="text-muted-foreground text-xs">
							Enter a phone number, extension, or search for a team member
						</p>
					</div>

					{/* Quick Transfer Options - Placeholder for team members */}
					<div className="grid gap-2">
						<Label className="text-muted-foreground text-xs uppercase">
							Quick Transfer
						</Label>
						<div className="text-muted-foreground rounded-md border border-dashed p-4 text-center text-sm">
							Team member quick transfer options will appear here
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={handleClose}
						disabled={isTransferring}
					>
						Cancel
					</Button>
					<Button
						onClick={handleTransfer}
						disabled={!targetNumber.trim() || isTransferring || !callControlId}
						className={cn(isTransferring && "cursor-wait")}
					>
						{isTransferring ? (
							<>
								<Phone className="mr-2 size-4 animate-pulse" />
								Transferring...
							</>
						) : (
							<>
								<PhoneForwarded className="mr-2 size-4" />
								Transfer Call
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
