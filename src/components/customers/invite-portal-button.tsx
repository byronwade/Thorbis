"use client";

/**
 * Invite to Portal Button - Client Component
 *
 * Allows staff to invite customers to access the portal
 * - Shows "Invite to Portal" button if not invited
 * - Shows "Invited" badge if already invited
 * - Calls inviteToPortal server action
 * - Shows success/error toast notifications
 */

import { Check, KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { inviteToPortal } from "@/actions/customers";
import { Button } from "@/components/ui/button";

type InvitePortalButtonProps = {
	customerId: string;
	customerName: string;
	portalEnabled: boolean;
	portalInvitedAt: string | null;
};

export function InvitePortalButton({
	customerId,
	customerName,
	portalEnabled,
	portalInvitedAt,
}: InvitePortalButtonProps) {
	const [isInviting, setIsInviting] = useState(false);
	const [isInvited, setIsInvited] = useState(portalEnabled);

	async function handleInvite() {
		setIsInviting(true);

		try {
			const result = await inviteToPortal(customerId);

			if (result.success) {
				setIsInvited(true);
			} else {
				alert(result.error || "Failed to send portal invitation");
			}
		} catch (_error) {
			alert("An unexpected error occurred");
		} finally {
			setIsInviting(false);
		}
	}

	if (isInvited) {
		return (
			<Button className="w-full" disabled variant="outline">
				<Check className="mr-2 size-4 text-success" />
				Portal Invited
			</Button>
		);
	}

	return (
		<Button className="w-full" disabled={isInviting} onClick={handleInvite} variant="outline">
			{isInviting ? (
				<>
					<Loader2 className="mr-2 size-4 animate-spin" />
					Sending Invitation...
				</>
			) : (
				<>
					<KeyRound className="mr-2 size-4" />
					Invite to Portal
				</>
			)}
		</Button>
	);
}
