/**
 * Plaid Link Button - Lazy Loaded Wrapper
 *
 * Performance optimization:
 * - Dynamically imports react-plaid-link library (150KB)
 * - Only loads when user initiates bank connection
 * - Shows loading state during import
 */

"use client";

import { Building2, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const PlaidLinkButton = dynamic(
	() =>
		import("./plaid-link-button").then((mod) => ({
			default: mod.PlaidLinkButton,
		})),
	{
		loading: () => (
			<Button disabled type="button">
				<Loader2 className="mr-2 size-4 animate-spin" />
				Loading...
			</Button>
		),
		ssr: false, // Plaid Link requires browser environment
	},
);

type PlaidLinkButtonLazyProps = {
	companyId: string;
	onSuccess?: () => void;
	variant?: "default" | "outline" | "secondary" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
	children?: React.ReactNode;
};

export function PlaidLinkButtonLazy(props: PlaidLinkButtonLazyProps) {
	return <PlaidLinkButton {...props} />;
}
