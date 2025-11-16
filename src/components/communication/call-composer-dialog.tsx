"use client";

import { Loader2, PhoneCall } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { makeCall } from "@/actions/telnyx";
import type { CommunicationRecord, CompanyPhone } from "@/components/communication/communication-page-client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type CallComposerDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	companyId: string;
	companyPhones: CompanyPhone[];
	contactName?: string;
	contactNumber?: string;
	customerId?: string;
	jobId?: string;
	propertyId?: string;
	invoiceId?: string;
	estimateId?: string;
	onCallCreated: (record: CommunicationRecord) => void;
};

export function CallComposerDialog({
	open,
	onOpenChange,
	companyId,
	companyPhones,
	contactName,
	contactNumber,
	customerId,
	jobId,
	propertyId,
	invoiceId,
	estimateId,
	onCallCreated,
}: CallComposerDialogProps) {
	const { toast } = useToast();
	const [toNumber, setToNumber] = useState(contactNumber || "");
	const [fromNumber, setFromNumber] = useState(companyPhones[0]?.number || "");
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		if (contactNumber) {
			setToNumber(contactNumber);
		}
	}, [contactNumber]);

	const canCall = useMemo(
		() => Boolean(toNumber.trim() && fromNumber && companyPhones.length > 0),
		[toNumber, fromNumber, companyPhones]
	);

	const handleStartCall = () => {
		if (!canCall || isPending) {
			return;
		}
		const normalizedTo = toNumber.replace(/\D/g, "");
		if (!normalizedTo) {
			toast.error("Enter a valid phone number to call.");
			return;
		}

		startTransition(async () => {
			const result = await makeCall({
				to: normalizedTo,
				from: fromNumber,
				companyId,
				customerId,
				jobId,
				propertyId,
				invoiceId,
				estimateId,
			});

			if (!(result.success && result.data)) {
				const errorMessage =
					"error" in result && typeof result.error === "string" ? result.error : "Failed to start call";
				toast.error(errorMessage);
				return;
			}

			onCallCreated(result.data as CommunicationRecord);
			onOpenChange(false);
			if (result.callControlId) {
				const width = 420;
				const height = 720;
				window.open(
					`/call-window?callId=${encodeURIComponent(result.callControlId)}`,
					"_blank",
					`width=${width},height=${height},noopener`
				);
			}
			toast.success("Call started");
		});
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<PhoneCall className="size-5" />
						Start Call
					</DialogTitle>
					<DialogDescription>
						{contactName ? `Call ${contactName}` : "Dial out using your Telnyx-powered number"}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-2">
					<div className="space-y-2">
						<Label>To</Label>
						<Input onChange={(e) => setToNumber(e.target.value)} placeholder="+1 (555) 123-4567" value={toNumber} />
					</div>

					<div className="space-y-2">
						<Label>From</Label>
						<Select disabled={companyPhones.length === 0} onValueChange={setFromNumber} value={fromNumber}>
							<SelectTrigger>
								<SelectValue placeholder="Select a company line" />
							</SelectTrigger>
							<SelectContent>
								{companyPhones.map((phone) => (
									<SelectItem key={phone.id} value={phone.number}>
										{phone.label ?? phone.number}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{companyPhones.length === 0 && (
							<p className="text-muted-foreground text-xs">Add a company phone number first.</p>
						)}
					</div>
				</div>

				<div className="flex justify-end gap-2 pt-2">
					<Button onClick={() => onOpenChange(false)} type="button" variant="outline">
						Cancel
					</Button>
					<Button disabled={!canCall || isPending} onClick={handleStartCall} type="button">
						{isPending ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Dialing...
							</>
						) : (
							"Start Call"
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
