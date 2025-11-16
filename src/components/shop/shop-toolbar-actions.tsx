/**
 * Shop Toolbar Actions - Client Component
 *
 * Client-side features:
 * - Shopping cart button with counter
 * - Interactive toolbar actions
 */

"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShopToolbarActions() {
	return (
		<div className="flex items-center gap-1">
			<Button size="sm" variant="default">
				<ShoppingCart className="mr-2 size-4" />
				<span className="hidden sm:inline">Cart (0)</span>
				<span className="sm:hidden">(0)</span>
			</Button>
		</div>
	);
}
