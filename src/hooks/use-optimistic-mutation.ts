/**
 * Optimistic Mutation Hook
 *
 * Provides optimistic UI updates for Server Actions and mutations
 *
 * Features:
 * - Immediate UI feedback before server response
 * - Automatic rollback on error
 * - Loading states
 * - Error handling
 *
 * Performance benefits:
 * - Perceived 0ms latency for user actions
 * - Better UX with instant feedback
 * - Reduced loading spinners
 */

"use client";

import { useCallback, useState, useTransition } from "react";

type OptimisticState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

export function useOptimisticMutation<TData, TVariables>(
  mutationFn: (
    variables: TVariables
  ) => Promise<{ success: boolean; data?: TData; error?: string }>,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: string) => void;
    onSettled?: () => void;
  }
) {
  const [state, setState] = useState<OptimisticState<TData>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const [isPending, startTransition] = useTransition();

  const mutate = useCallback(
    async (variables: TVariables, optimisticData?: Partial<TData>) => {
      // Clear previous error
      setState((prev) => ({ ...prev, error: null, isLoading: true }));

      // Optimistically update UI if optimistic data provided
      if (optimisticData) {
        setState((prev) => ({
          ...prev,
          data: { ...(prev.data || {}), ...optimisticData } as TData,
        }));
      }

      try {
        // Execute mutation in transition for better UX
        startTransition(async () => {
          const result = await mutationFn(variables);

          if (result.success && result.data) {
            setState({
              data: result.data,
              isLoading: false,
              error: null,
            });
            options?.onSuccess?.(result.data);
          } else {
            // Rollback optimistic update on error
            setState({
              data: null,
              isLoading: false,
              error: result.error || "An error occurred",
            });
            options?.onError?.(result.error || "An error occurred");
          }

          options?.onSettled?.();
        });
      } catch (error) {
        // Rollback optimistic update on error
        setState({
          data: null,
          isLoading: false,
          error: error instanceof Error ? error.message : "An error occurred",
        });
        options?.onError?.(
          error instanceof Error ? error.message : "An error occurred"
        );
        options?.onSettled?.();
      }
    },
    [mutationFn, options, startTransition]
  );

  return {
    ...state,
    isPending,
    mutate,
  };
}

/**
 * Optimistic List Hook
 *
 * For managing lists with optimistic updates (add/update/delete)
 */
export function useOptimisticList<T extends { id: string }>(
  initialData: T[] = []
) {
  const [items, setItems] = useState<T[]>(initialData);
  const [isPending, startTransition] = useTransition();

  const addItem = useCallback(
    (item: T, serverAction: () => Promise<void>) => {
      // Optimistically add item
      setItems((prev) => [...prev, item]);

      // Execute server action
      startTransition(async () => {
        try {
          await serverAction();
        } catch (error) {
          // Rollback on error
          setItems((prev) => prev.filter((i) => i.id !== item.id));
          console.error("Failed to add item:", error);
        }
      });
    },
    [startTransition]
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<T>, serverAction: () => Promise<void>) => {
      // Store original for rollback
      let original: T | undefined;

      // Optimistically update item
      setItems((prev) => {
        const index = prev.findIndex((item) => item.id === id);
        if (index === -1) return prev;

        original = prev[index];
        const updated = [...prev];
        updated[index] = { ...prev[index], ...updates };
        return updated;
      });

      // Execute server action
      startTransition(async () => {
        try {
          await serverAction();
        } catch (error) {
          // Rollback on error
          if (original) {
            setItems((prev) => {
              const index = prev.findIndex((item) => item.id === id);
              if (index === -1) return prev;
              const reverted = [...prev];
              reverted[index] = original!;
              return reverted;
            });
          }
          console.error("Failed to update item:", error);
        }
      });
    },
    [startTransition]
  );

  const deleteItem = useCallback(
    (id: string, serverAction: () => Promise<void>) => {
      // Store original for rollback
      let original: T | undefined;
      let originalIndex: number;

      // Optimistically delete item
      setItems((prev) => {
        originalIndex = prev.findIndex((item) => item.id === id);
        if (originalIndex === -1) return prev;

        original = prev[originalIndex];
        return prev.filter((item) => item.id !== id);
      });

      // Execute server action
      startTransition(async () => {
        try {
          await serverAction();
        } catch (error) {
          // Rollback on error
          if (original) {
            setItems((prev) => {
              const restored = [...prev];
              restored.splice(originalIndex, 0, original!);
              return restored;
            });
          }
          console.error("Failed to delete item:", error);
        }
      });
    },
    [startTransition]
  );

  return {
    items,
    setItems,
    isPending,
    addItem,
    updateItem,
    deleteItem,
  };
}
