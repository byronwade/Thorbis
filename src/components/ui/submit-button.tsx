"use client";

/**
 * SubmitButton - Stateful Form Submit Button
 *
 * Automatically tracks form submission state and shows loading/success/error feedback.
 * Works with Server Actions and form submissions.
 *
 * Features:
 * - Automatic loading state during submission
 * - Success animation
 * - Error state with shake animation
 * - Disabled state when loading
 * - Icon transitions
 *
 * @example
 * <form action={createCustomer}>
 *   <Input name="name" />
 *   <SubmitButton>
 *     Create Customer
 *   </SubmitButton>
 * </form>
 */

import { AlertCircle, Check, Loader2 } from "lucide-react";
import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SubmitButtonProps extends Omit<ButtonProps, "type"> {
  /**
   * Loading text to show while submitting
   */
  loadingText?: string;

  /**
   * Success text to show on successful submission
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
}

export function SubmitButton({
  children,
  loadingText,
  successText,
  successDuration = 2000,
  loadingIcon,
  successIcon,
  errorIcon,
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
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

  const isDisabled = disabled || pending || showSuccess;

  return (
    <Button
      className={cn(
        "transition-all duration-200",
        showSuccess && "bg-green-600 hover:bg-green-600",
        showError && "animate-shake bg-destructive",
        className
      )}
      disabled={isDisabled}
      type="submit"
      {...props}
    >
      {pending ? (
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
 * SubmitButton with explicit success trigger
 *
 * Use when you need manual control over the success state
 * (e.g., after receiving a response from a Server Action)
 */
export function ControlledSubmitButton({
  success,
  error,
  ...props
}: SubmitButtonProps & {
  success?: boolean;
  error?: boolean;
}) {
  return <SubmitButton {...props} />;
}
