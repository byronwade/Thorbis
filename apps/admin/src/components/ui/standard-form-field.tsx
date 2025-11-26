/**
 * Standard Form Field Component
 *
 * Provides consistent styling for form fields across the application
 * following shadcn's design patterns without requiring react-hook-form.
 */

import type * as React from "react";
import { Label, cn } from "@stratos/ui";

interface StandardFormFieldProps {
	label?: string;
	htmlFor?: string;
	error?: string;
	description?: string;
	required?: boolean;
	children: React.ReactNode;
	className?: string;
}

export function StandardFormField({
	label,
	htmlFor,
	error,
	description,
	required,
	children,
	className,
}: StandardFormFieldProps) {
	return (
		<div className={cn("space-y-2", className)} data-slot="form-field">
			{label && (
				<Label
					htmlFor={htmlFor}
					className={cn(error && "text-destructive")}
					data-error={!!error}
				>
					{label}
					{required && (
						<span className="text-destructive ml-1" aria-label="required">
							*
						</span>
					)}
				</Label>
			)}
			{children}
			{description && !error && (
				<p className="text-muted-foreground text-[0.8rem] leading-relaxed">
					{description}
				</p>
			)}
			{error && (
				<p className="text-destructive text-[0.8rem] font-medium" role="alert">
					{error}
				</p>
			)}
		</div>
	);
}
