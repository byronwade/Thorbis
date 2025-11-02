/**
 * Toast Hook - Wrapper around Sonner
 *
 * Provides a consistent interface for displaying toast notifications
 * across the application with success, error, loading, and promise states.
 *
 * @example
 * const { toast } = useToast();
 *
 * // Success
 * toast.success("Customer created successfully!");
 *
 * // Error
 * toast.error("Failed to save changes");
 *
 * // Loading
 * const id = toast.loading("Saving...");
 * toast.success("Saved!", { id });
 *
 * // Promise
 * toast.promise(createCustomer(data), {
 *   loading: "Creating customer...",
 *   success: "Customer created!",
 *   error: "Failed to create customer"
 * });
 */

import { toast as sonnerToast } from "sonner";

export function useToast() {
  return {
    toast: {
      success: (message: string, options?: any) =>
        sonnerToast.success(message, {
          duration: 3000,
          ...options,
        }),

      error: (message: string, options?: any) =>
        sonnerToast.error(message, {
          duration: 5000,
          ...options,
        }),

      loading: (message: string, options?: any) =>
        sonnerToast.loading(message, options),

      info: (message: string, options?: any) =>
        sonnerToast.info(message, {
          duration: 3000,
          ...options,
        }),

      warning: (message: string, options?: any) =>
        sonnerToast.warning(message, {
          duration: 4000,
          ...options,
        }),

      promise: <T>(
        promise: Promise<T>,
        messages: {
          loading: string;
          success: string | ((data: T) => string);
          error: string | ((error: any) => string);
        }
      ) => sonnerToast.promise(promise, messages),

      dismiss: (id?: string | number) => {
        sonnerToast.dismiss(id);
      },

      // Shorthand for Server Action responses
      fromActionResult: (result: {
        success: boolean;
        error?: string;
        message?: string;
      }) => {
        if (result.success) {
          sonnerToast.success(
            result.message || "Operation completed successfully"
          );
        } else {
          sonnerToast.error(result.error || "Operation failed");
        }
      },
    },
  };
}
