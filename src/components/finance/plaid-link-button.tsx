/**
 * Plaid Link Button Component
 *
 * Reusable button for linking bank accounts via Plaid Link
 */

"use client";

import { Building2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { createPlaidLinkToken, exchangePlaidToken } from "@/actions/plaid";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type PlaidLinkButtonProps = {
	companyId: string;
	onSuccess?: () => void;
	variant?: "default" | "outline" | "secondary" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
	children?: React.ReactNode;
};

export function PlaidLinkButton({
	companyId,
	onSuccess,
	variant = "default",
	size = "default",
	className,
	children,
}: PlaidLinkButtonProps) {
	const { toast } = useToast();
	const [linkToken, setLinkToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const hasInitialized = useRef(false);
	const componentId = useRef(`plaid-${Date.now()}-${Math.random()}`);

	// Fetch link token on mount (only once)
	useEffect(() => {
		if (hasInitialized.current) {
			return;
		}

		hasInitialized.current = true;

		async function fetchLinkToken() {
			try {
				const result = await createPlaidLinkToken(companyId);
				const errorMsg = result.success ? undefined : result.error || "Unknown error";

				if (result.success && result.data?.linkToken) {
					setLinkToken(result.data.linkToken);
				} else {
					toast.error(errorMsg || "Failed to initialize bank connection");
				}
			} catch (_error) {
    console.error("Error:", _error);
				toast.error("Failed to initialize bank connection");
			}
		}

		fetchLinkToken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [companyId, toast.error]);

	const { open, ready } = usePlaidLink({
		token: linkToken,
		onSuccess: async (publicToken, metadata) => {
			setIsLoading(true);
			try {
				const result = await exchangePlaidToken(publicToken, companyId, metadata);

				if (result.success && result.data) {
					toast.success(
						`Successfully linked ${result.data.accountsLinked} bank account${result.data.accountsLinked > 1 ? "s" : ""}`
					);
					onSuccess?.();
				} else {
					const errorMsg = result.success ? "Unknown error" : result.error || "Unknown error";
					toast.error(errorMsg);
				}
			} catch (_error) {
    console.error("Error:", _error);
				toast.error("Failed to link bank account");
			} finally {
				setIsLoading(false);
			}
		},
		onExit: (err, _metadata) => {
			if (err) {
				toast.error("Bank connection was cancelled or failed");
			}
		},
	});

	// Expose open function for debugging
	useEffect(() => {
		if (open && ready) {
			(window as any).plaidOpen = open;
			(window as any).plaidInfo = {
				ready,
				hasToken: !!linkToken,
				componentId: componentId.current,
			};
		}
	}, [open, ready, linkToken]);

	const handleClick = () => {
		if (ready && linkToken) {
			try {
				open();
			} catch (_error) {
    console.error("Error:", _error);
				toast.error("Failed to open bank connection dialog. Please refresh the page and try again.");
			}
		} else {
			toast.info("Bank connection is still initializing. Please wait a moment and try again.");
		}
	};

	return (
		<Button
			className={className}
			data-plaid-link-button
			disabled={!ready || isLoading}
			onClick={handleClick}
			size={size}
			type="button"
			variant={variant}
		>
			{isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Building2 className="mr-2 size-4" />}
			{children || "Connect Bank Account"}
		</Button>
	);
}
