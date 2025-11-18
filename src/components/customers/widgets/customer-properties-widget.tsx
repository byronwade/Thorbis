/**
 * Customer Properties Widget - Progressive Loading
 *
 * Loads customer properties data only when visible in viewport.
 */

"use client";

import { Building2 } from "lucide-react";
import Link from "next/link";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { Button } from "@/components/ui/button";
import { useCustomerProperties } from "@/hooks/use-customer-360";

type CustomerPropertiesWidgetProps = {
	customerId: string;
	loadImmediately?: boolean;
};

export function CustomerPropertiesWidget({
	customerId,
	loadImmediately = false,
}: CustomerPropertiesWidgetProps) {
	return (
		<ProgressiveWidget
			title="Properties"
			icon={<Building2 className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const {
					data: properties,
					isLoading,
					error,
				} = useCustomerProperties(customerId, isVisible);

				if (isLoading) return <WidgetSkeleton rows={2} />;
				if (error)
					return (
						<div className="text-muted-foreground text-center text-sm">
							Failed to load properties
						</div>
					);
				if (!properties || properties.length === 0)
					return (
						<div className="text-muted-foreground text-center text-sm">
							No properties found
						</div>
					);

				return (
					<div className="space-y-3">
						{properties.map((property) => (
							<Link
								key={property.id}
								href={`/dashboard/properties/${property.id}`}
								className="hover:bg-accent block rounded-lg border p-3 transition-colors"
							>
								<div className="space-y-1">
									<p className="text-sm font-medium">
										{property.name || "Unnamed Property"}
									</p>
									<p className="text-muted-foreground text-xs">
										{[
											property.address,
											property.city,
											property.state,
											property.zip_code,
										]
											.filter(Boolean)
											.join(", ")}
									</p>
								</div>
							</Link>
						))}

						{properties.length >= 10 && (
							<Button variant="outline" size="sm" className="w-full" asChild>
								<Link href={`/dashboard/properties?customer=${customerId}`}>
									View All Properties
								</Link>
							</Button>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
