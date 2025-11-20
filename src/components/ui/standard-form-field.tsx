/**
 * Standard Form Field Component
 *
 * Provides consistent styling for form fields across the application
 * following shadcn's design patterns without requiring react-hook-form.
 *
 * Uses semantic color tokens from the theme:
 * - text-destructive: Error states and required indicators
 * - text-muted-foreground: Helper text and descriptions
 * - All colors are theme-aware (light/dark mode support)
 *
 * Use this for forms that don't use react-hook-form but need consistent styling.
 * For forms with react-hook-form, use the full Form components from @/components/ui/form
 */

import type * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface StandardFormFieldProps {
	label?: string;
	htmlFor?: string;
	error?: string;
	description?: string;
	required?: boolean;
	children: React.ReactNode;
	className?: string;
}

/**
 * StandardFormField - Consistent form field wrapper
 *
 * Follows shadcn's form patterns with semantic color tokens.
 * All colors use CSS variables for automatic light/dark mode support.
 *
 * @example
 * <StandardFormField label="Email" htmlFor="email" error={errors.email} required>
 *   <Input id="email" type="email" />
 * </StandardFormField>
 *
 * @example With description
 * <StandardFormField
 *   label="Password"
 *   htmlFor="password"
 *   description="Must be at least 8 characters"
 * >
 *   <Input id="password" type="password" />
 * </StandardFormField>
 */
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

/**
 * StandardFormRow - Grid layout for form fields
 *
 * @example
 * <StandardFormRow cols={2}>
 *   <StandardFormField label="First Name">
 *     <Input />
 *   </StandardFormField>
 *   <StandardFormField label="Last Name">
 *     <Input />
 *   </StandardFormField>
 * </StandardFormRow>
 */
interface StandardFormRowProps {
	children: React.ReactNode;
	cols?: 1 | 2 | 3 | 4;
	className?: string;
}

export function StandardFormRow({
	children,
	cols = 2,
	className,
}: StandardFormRowProps) {
	return (
		<div
			className={cn(
				"grid gap-4",
				{
					"sm:grid-cols-2": cols === 2,
					"sm:grid-cols-2 lg:grid-cols-3": cols === 3,
					"sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4": cols === 4,
				},
				className,
			)}
		>
			{children}
		</div>
	);
}

/**
 * StandardFormSection - Section wrapper with optional title
 *
 * @example
 * <StandardFormSection title="Personal Information">
 *   <StandardFormRow>
 *     ...fields
 *   </StandardFormRow>
 * </StandardFormSection>
 */
interface StandardFormSectionProps {
	title?: string;
	description?: string;
	children: React.ReactNode;
	className?: string;
}

export function StandardFormSection({
	title,
	description,
	children,
	className,
}: StandardFormSectionProps) {
	return (
		<div className={cn("space-y-4", className)}>
			{(title || description) && (
				<div className="space-y-1">
					{title && <h3 className="text-lg font-medium">{title}</h3>}
					{description && (
						<p className="text-muted-foreground text-sm">{description}</p>
					)}
				</div>
			)}
			{children}
		</div>
	);
}
