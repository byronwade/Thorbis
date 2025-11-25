"use client";

/**
 * PasswordInput - Password field with visibility toggle
 *
 * Provides a password input with a button to toggle between
 * visible and hidden text, improving UX while maintaining security.
 *
 * Features:
 * - Toggle visibility with Eye/EyeOff icons
 * - Proper ARIA labels for screen readers
 * - Keyboard accessible (tab to button, Enter/Space to toggle)
 * - Consistent styling with base Input component
 */

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type PasswordInputProps = Omit<
	React.ComponentProps<typeof Input>,
	"type"
>;

export function PasswordInput({
	className,
	...props
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="relative">
			<Input
				type={showPassword ? "text" : "password"}
				className={cn("pr-10", className)}
				{...props}
			/>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
				onClick={() => setShowPassword((prev) => !prev)}
				aria-label={showPassword ? "Hide password" : "Show password"}
			>
				{showPassword ? (
					<EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
				) : (
					<Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
				)}
				<span className="sr-only">
					{showPassword ? "Hide password" : "Show password"}
				</span>
			</Button>
		</div>
	);
}
