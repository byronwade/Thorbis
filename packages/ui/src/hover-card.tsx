"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import type * as React from "react";
import { useState } from "react";

import { cn } from "./utils";

/**
 * HoverCard with keyboard accessibility
 * Opens on hover for mouse users and on focus for keyboard users
 */
function HoverCard({
	children,
	...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
	const [open, setOpen] = useState(false);

	return (
		<HoverCardPrimitive.Root
			data-slot="hover-card"
			open={open}
			onOpenChange={setOpen}
			openDelay={200}
			closeDelay={100}
			{...props}
		>
			{children}
		</HoverCardPrimitive.Root>
	);
}

function HoverCardTrigger({
	children,
	...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
	return (
		<HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props}>
			{children}
		</HoverCardPrimitive.Trigger>
	);
}

function HoverCardContent({
	className,
	align = "center",
	sideOffset = 4,
	...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
	return (
		<HoverCardPrimitive.Portal data-slot="hover-card-portal">
			<HoverCardPrimitive.Content
				data-slot="hover-card-content"
				align={align}
				sideOffset={sideOffset}
				className={cn("hover-card-content", className)}
				{...props}
			/>
		</HoverCardPrimitive.Portal>
	);
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
