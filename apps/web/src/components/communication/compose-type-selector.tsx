"use client";

import { Mail, MessageSquare, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface ComposeTypeSelectorProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/**
 * ComposeTypeSelector - Dialog for selecting message type to compose
 *
 * Allows users to choose between composing an email or SMS message
 * from the unified communication hub.
 */
export function ComposeTypeSelector({
	open,
	onOpenChange,
}: ComposeTypeSelectorProps) {
	const router = useRouter();

	const handleSelectEmail = () => {
		onOpenChange(false);
		router.push("/dashboard/communication/email?compose=true");
	};

	const handleSelectSms = () => {
		onOpenChange(false);
		// Dispatch event to open SMS recipient selector
		window.dispatchEvent(
			new CustomEvent("open-recipient-selector", {
				detail: { type: "sms" },
			}),
		);
		router.push("/dashboard/communication/sms");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>New Message</DialogTitle>
					<DialogDescription>
						Choose the type of message you want to send.
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-2 gap-4 py-4">
					<button
						type="button"
						onClick={handleSelectEmail}
						className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20">
							<Mail className="h-6 w-6 text-primary" />
						</div>
						<div className="text-center">
							<h3 className="font-medium">Email</h3>
							<p className="text-xs text-muted-foreground">
								Send an email message
							</p>
						</div>
					</button>

					<button
						type="button"
						onClick={handleSelectSms}
						className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 group-hover:bg-green-500/20">
							<MessageSquare className="h-6 w-6 text-green-500" />
						</div>
						<div className="text-center">
							<h3 className="font-medium">Text Message</h3>
							<p className="text-xs text-muted-foreground">Send an SMS/MMS</p>
						</div>
					</button>
				</div>

				<div className="flex justify-end">
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
