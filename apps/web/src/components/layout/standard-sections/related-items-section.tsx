"use client";

import { Link as LinkIcon } from "lucide-react";
import {
	type EntityType,
	RelatedEntityCard,
	RelatedEntityCardGrid,
} from "@/components/work/shared/related-entity-card";
import { UnifiedAccordionContent } from "@/components/ui/unified-accordion";

/**
 * Related item data structure
 * Supports both legacy string types and enhanced EntityType
 */
export type RelatedItem = {
	id: string;
	/** Entity type - used for icon and color styling */
	type: EntityType | string;
	/** Display title */
	title: string;
	/** Optional subtitle */
	subtitle?: string;
	/** Link to entity detail page */
	href: string;
	/** Optional status badge */
	badge?: {
		label: string;
		variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
	};
	/** Optional secondary info (e.g., amount, date) */
	secondaryInfo?: string;
};

/**
 * Map common type strings to EntityType
 */
function normalizeEntityType(type: string): EntityType {
	const typeMap: Record<string, EntityType> = {
		job: "job",
		jobs: "job",
		customer: "customer",
		customers: "customer",
		estimate: "estimate",
		estimates: "estimate",
		invoice: "invoice",
		invoices: "invoice",
		contract: "contract",
		contracts: "contract",
		payment: "payment",
		payments: "payment",
		appointment: "appointment",
		appointments: "appointment",
		equipment: "equipment",
		vendor: "vendor",
		vendors: "vendor",
		"purchase-order": "purchase-order",
		"purchase_order": "purchase-order",
		purchaseorder: "purchase-order",
		"service-agreement": "service-agreement",
		"service_agreement": "service-agreement",
		serviceagreement: "service-agreement",
		"maintenance-plan": "maintenance-plan",
		"maintenance_plan": "maintenance-plan",
		maintenanceplan: "maintenance-plan",
		material: "material",
		materials: "material",
		property: "property",
		properties: "property",
		"team-member": "team-member",
		"team_member": "team-member",
		teammember: "team-member",
		user: "team-member",
	};

	return typeMap[type.toLowerCase()] || "job";
}

type RelatedItemsSectionProps = {
	relatedItems: RelatedItem[];
};

/**
 * RelatedItemsSection - Displays related entities in a prominent card grid
 *
 * Uses RelatedEntityCard components for consistent styling with type-specific
 * icons, colors, and status badges. Provides easy navigation between related entities.
 */
export function RelatedItemsSection({
	relatedItems,
}: RelatedItemsSectionProps) {
	if (!relatedItems || relatedItems.length === 0) {
		return (
			<UnifiedAccordionContent>
				<div className="flex h-32 items-center justify-center">
					<div className="text-center">
						<LinkIcon className="text-muted-foreground/50 mx-auto size-8" />
						<p className="text-muted-foreground mt-2 text-sm">
							No related items
						</p>
					</div>
				</div>
			</UnifiedAccordionContent>
		);
	}

	// Determine column count based on item count
	const columns = relatedItems.length === 1 ? 1 : relatedItems.length <= 4 ? 2 : 2;

	return (
		<UnifiedAccordionContent>
			<RelatedEntityCardGrid columns={columns as 1 | 2 | 3}>
				{relatedItems.map((item) => (
					<RelatedEntityCard
						href={item.href}
						key={item.id}
						secondaryInfo={item.secondaryInfo}
						size="md"
						status={item.badge ? {
							label: item.badge.label,
							variant: item.badge.variant,
						} : undefined}
						subtitle={item.subtitle}
						title={item.title}
						type={normalizeEntityType(item.type)}
					/>
				))}
			</RelatedEntityCardGrid>
		</UnifiedAccordionContent>
	);
}
