"use client";

/**
 * ActionButton - Stateful Async Action Button
 *
 * A button component that handles async actions with automatic loading/success/error states.
 * Works with Server Actions and async functions that return ActionResult.
 *
 * Features:
 * - Automatic loading state during action execution
 * - Success animation with auto-reset
 * - Error state with shake animation
 * - Disabled state when loading
 * - Icon transitions
 * - Toast notifications (optional)
 *
 * @example
 * <ActionButton
 *   onClick={async () => {
 *     const result = await deleteCustomer(customerId);
 *     return result;
 *   }}
 *   successText="Deleted!"
 *   variant="destructive"
 * >
 *   Delete Customer
 * </ActionButton>
 *
 * @example
 * // With toast notifications
 * <ActionButton
 *   onClick={async () => await approveInvoice(invoiceId)}
 *   showToast
 *   successText="Approved"
 * >
 *   Approve Invoice
 * </ActionButton>
 */

import { AlertCircle, Check, Loader2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActionResult<T = void> =
	| {
			success: true;
			data: T;
			message?: string;
	  }
	| {
			success: false;
			error: string;
			code?: string;
			details?: Record<string, any>;
	  };

type BaseButtonProps = React.ComponentProps<typeof Button>;

export interface ActionButtonProps extends Omit<BaseButtonProps, "onClick" | "onError"> {
	/**
	 * Async action to execute when button is clicked
	 * Should return an ActionResult
	 */
	onClick: () => Promise<ActionResult<any>>;

	/**
	 * Loading text to show while executing
	 */
	loadingText?: string;

	/**
	 * Success text to show on successful execution
	 */
	successText?: string;

	/**
	 * Show success state for this duration (ms)
	 */
	successDuration?: number;

	/**
	 * Custom loading icon
	 */
	loadingIcon?: React.ReactNode;

	/**
	 * Custom success icon
	 */
	successIcon?: React.ReactNode;

	/**
	 * Custom error icon
	 */
	errorIcon?: React.ReactNode;

	/**
	 * Show toast notifications for success/error
	 */
	showToast?: boolean;

	/**
	 * Callback fired when action completes successfully
	 */
	onSuccess?: (data: any) => void;

	/**
	 * Callback fired when action fails
	 */
	onError?: (error: string) => void;
}

export function ActionButton({
	children,
	onClick,
	loadingText,
	successText,
	successDuration = 2000,
	loadingIcon,
	successIcon,
	errorIcon,
	showToast = false,
	onSuccess,
	onError,
	className,
	disabled,
	...props
}: ActionButtonProps) {
	const [isLoading, setIsLoading] = React.useState(false);
	const [showSuccess, setShowSuccess] = React.useState(false);
	const [showError, setShowError] = React.useState(false);

	// Reset success state after duration
	React.useEffect(() => {
		if (showSuccess) {
			const timeout = setTimeout(() => {
				setShowSuccess(false);
			}, successDuration);
			return () => clearTimeout(timeout);
		}
	}, [showSuccess, successDuration]);

	// Auto-clear error state after a delay
	React.useEffect(() => {
		if (showError) {
			const timeout = setTimeout(() => {
				setShowError(false);
			}, 3000);
			return () => clearTimeout(timeout);
		}
	}, [showError]);

	const handleClick = async () => {
		try {
			setIsLoading(true);
			setShowError(false);
			setShowSuccess(false);

			const result = await onClick();

			if (result.success) {
				setShowSuccess(true);
				if (showToast) {
					toast.success(result.message || successText || "Action completed successfully");
				}
				onSuccess?.(result.data);
			} else {
				setShowError(true);
				if (showToast) {
					toast.error(result.error || "Action failed");
				}
				onError?.(result.error);
			}
		} catch (error) {
			setShowError(true);
			const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
			if (showToast) {
				toast.error(errorMessage);
			}
			onError?.(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const isDisabled = disabled || isLoading || showSuccess;

	return (
		<Button
			className={cn(
				"transition-all duration-200",
				showSuccess && "bg-success hover:bg-success dark:bg-success dark:hover:bg-success",
				showError && "animate-shake bg-destructive",
				className
			)}
			disabled={isDisabled}
			onClick={handleClick}
			type="button"
			{...props}
		>
			{isLoading ? (
				<>
					{loadingIcon || <Loader2 className="mr-2 size-4 animate-spin" />}
					{loadingText || children}
				</>
			) : showSuccess ? (
				<>
					{successIcon || <Check className="mr-2 size-4" />}
					{successText || "Success!"}
				</>
			) : showError ? (
				<>
					{errorIcon || <AlertCircle className="mr-2 size-4" />}
					Error
				</>
			) : (
				children
			)}
		</Button>
	);
}

/**
 * ConfirmActionButton - Action Button with Confirmation Dialog
 *
 * Extends ActionButton with a confirmation step before executing the action.
 * Useful for destructive actions like delete.
 *
 * @example
 * <ConfirmActionButton
 *   onClick={async () => await deleteCustomer(customerId)}
 *   confirmTitle="Delete Customer?"
 *   confirmDescription="This action cannot be undone."
 *   variant="destructive"
 * >
 *   Delete
 * </ConfirmActionButton>
 */
export interface ConfirmActionButtonProps extends ActionButtonProps {
	/**
	 * Title for the confirmation dialog
	 */
	confirmTitle?: string;

	/**
	 * Description for the confirmation dialog
	 */
	confirmDescription?: string;

	/**
	 * Text for the confirm button
	 */
	confirmText?: string;

	/**
	 * Text for the cancel button
	 */
	cancelText?: string;
}

export function ConfirmActionButton({
	confirmTitle = "Are you sure?",
	confirmDescription = "This action cannot be undone.",
	confirmText = "Continue",
	cancelText = "Cancel",
	onClick,
	...props
}: ConfirmActionButtonProps) {
	const [showConfirm, setShowConfirm] = React.useState(false);

	const handleConfirmedAction = async () => {
		setShowConfirm(false);
		return onClick();
	};

	return (
		<>
			<ActionButton
				{...props}
				onClick={async () => {
					setShowConfirm(true);
					// Return a pending promise that will be resolved when user confirms
					return new Promise((resolve) => {
						// This will be handled by the dialog
						resolve({ success: true, data: undefined });
					});
				}}
			/>

			{/* TODO: Implement confirmation dialog component */}
			{showConfirm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 dark:bg-background/80">
					<div className="max-w-md rounded-lg border bg-background p-6 shadow-lg">
						<h2 className="mb-2 font-semibold text-lg">{confirmTitle}</h2>
						<p className="mb-4 text-muted-foreground">{confirmDescription}</p>
						<div className="flex justify-end gap-2">
							<Button onClick={() => setShowConfirm(false)} variant="outline">
								{cancelText}
							</Button>
							<ActionButton {...props} onClick={handleConfirmedAction}>
								{confirmText}
							</ActionButton>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
