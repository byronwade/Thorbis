/**
 * Invoice Property Widget - Progressive Loading
 *
 * Displays property details for the job linked to this invoice.
 * Loads data only when widget becomes visible.
 */

"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { useInvoiceProperty } from "@/hooks/use-invoice-360";

type InvoicePropertyWidgetProps = {
	propertyId: string | null;
	loadImmediately?: boolean;
};

export function InvoicePropertyWidget({
	propertyId,
	loadImmediately = false,
}: InvoicePropertyWidgetProps) {
	if (!propertyId) {
		return (
			<ProgressiveWidget
				title="Service Location"
				icon={<Home className="h-5 w-5" />}
				loadImmediately={true}
			>
				<div className="text-muted-foreground text-center text-sm">
					No property linked to this invoice
				</div>
			</ProgressiveWidget>
		);
	}

	return (
		<ProgressiveWidget
			title="Service Location"
			icon={<Home className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const { data: property, isLoading, error } = useInvoiceProperty(propertyId, isVisible);

				if (isLoading) return <WidgetSkeleton rows={3} />;
				if (error)
					return (
						<div className="text-muted-foreground text-center text-sm">
							Failed to load property details
						</div>
					);
				if (!property)
					return (
						<div className="text-muted-foreground text-center text-sm">Property not found</div>
					);

				return (
					<Link
						href={`/dashboard/properties/${property.id}`}
						className="hover:bg-accent block rounded-lg border p-4 transition-colors"
					>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">{property.name || "Property"}</span>
								<span className="text-muted-foreground text-xs">View Details →</span>
							</div>
							{property.address && (
								<p className="text-muted-foreground text-sm">{property.address}</p>
							)}
							{(property.city || property.state || property.zip_code) && (
								<p className="text-muted-foreground text-xs">
									{[property.city, property.state, property.zip_code].filter(Boolean).join(", ")}
								</p>
							)}
						</div>
					</Link>
				);
			}}
		</ProgressiveWidget>
	);
}
