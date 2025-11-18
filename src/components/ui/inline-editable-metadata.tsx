"use client";

/**
 * Inline Editable Metadata Component
 *
 * Reusable component for inline editing of metadata fields in detail page headers
 * Supports text, number, email, phone, date, and select inputs
 */

import { Check, Edit2, X } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type EditableMetadataField = {
	label: string;
	icon?: ReactNode;
	value: string | number;
	helperText?: ReactNode;
	editable?: boolean;
	fieldType?: "text" | "email" | "phone" | "number" | "date" | "select";
	selectOptions?: Array<{ label: string; value: string }>;
	onSave?: (newValue: string) => Promise<boolean>;
	placeholder?: string;
};

type InlineEditableMetadataProps = {
	field: EditableMetadataField;
	className?: string;
};

export function InlineEditableMetadata({
	field,
	className,
}: InlineEditableMetadataProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(String(field.value));
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		if (!field.onSave || editValue === String(field.value)) {
			setIsEditing(false);
			return;
		}

		setIsSaving(true);
		try {
			const success = await field.onSave(editValue);
			if (success) {
				setIsEditing(false);
			}
		} catch (_error) {
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setEditValue(String(field.value));
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSave();
		} else if (e.key === "Escape") {
			handleCancel();
		}
	};

	return (
		<div className={cn("flex items-start gap-2", className)}>
			<div className="flex-1 space-y-0.5">
				<div className="flex items-center gap-2">
					{field.icon && (
						<span className="text-muted-foreground">{field.icon}</span>
					)}
					<span className="text-muted-foreground text-xs">{field.label}</span>
				</div>

				{isEditing ? (
					<div className="flex items-center gap-2">
						{field.fieldType === "select" && field.selectOptions ? (
							<Select onValueChange={setEditValue} value={editValue}>
								<SelectTrigger className="h-8 w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{field.selectOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : (
							<Input
								autoFocus
								className="h-8 flex-1"
								disabled={isSaving}
								onChange={(e) => setEditValue(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder={field.placeholder}
								type={field.fieldType || "text"}
								value={editValue}
							/>
						)}
						<Button
							className="h-8 w-8 p-0"
							disabled={isSaving}
							onClick={handleSave}
							size="sm"
							variant="ghost"
						>
							<Check className="text-success size-4" />
						</Button>
						<Button
							className="h-8 w-8 p-0"
							disabled={isSaving}
							onClick={handleCancel}
							size="sm"
							variant="ghost"
						>
							<X className="text-destructive size-4" />
						</Button>
					</div>
				) : (
					<div className="group flex items-center gap-2">
						<span className="text-sm font-medium">
							{field.value || (
								<span className="text-muted-foreground italic">Not set</span>
							)}
						</span>
						{field.editable && field.onSave && (
							<Button
								className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
								onClick={() => setIsEditing(true)}
								size="sm"
								variant="ghost"
							>
								<Edit2 className="size-3" />
							</Button>
						)}
					</div>
				)}

				{field.helperText && !isEditing && (
					<p className="text-muted-foreground text-xs">{field.helperText}</p>
				)}
			</div>
		</div>
	);
}
