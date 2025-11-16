/**
 * useDraggablePosition Hook
 *
 * Enables drag-to-move functionality for the call popover
 *
 * Features:
 * - Click and drag header to reposition
 * - Constrain to viewport boundaries
 * - Edge snapping (20px threshold)
 * - Position persistence via preferences store
 * - Visual feedback while dragging
 * - Touch support for mobile
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useCallPreferencesStore } from "@/lib/stores/call-preferences-store";

type Position = {
  x: number;
  y: number;
};

type UseDraggablePositionOptions = {
  width: number;
  height: number;
  snapThreshold?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onBeyondBounds?: (isBeyond: boolean) => void;
};

const DEFAULT_SNAP_THRESHOLD = 20;
const POP_OUT_THRESHOLD = 50; // pixels beyond window edge

export function useDraggablePosition(options: UseDraggablePositionOptions) {
  const {
    width,
    height,
    snapThreshold = DEFAULT_SNAP_THRESHOLD,
    onDragStart,
    onDragEnd,
    onBeyondBounds,
  } = options;

  const position = useCallPreferencesStore((state) => state.position);
  const setPosition = useCallPreferencesStore((state) => state.setPosition);

  const [isDragging, setIsDragging] = useState(false);
  // Lazy initialization to avoid SSR issues with window
  const [currentPosition, setCurrentPosition] = useState<Position>(() => {
    if (typeof window === "undefined") {
      return { x: 0, y: 0 };
    }
    return position === "default"
      ? { x: window.innerWidth - width - 24, y: 24 }
      : position;
  });

  const dragStartPosRef = useRef<Position>({ x: 0, y: 0 });
  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  // Update current position when width changes or store position changes
  useEffect(() => {
    if (!isDragging && typeof window !== "undefined") {
      if (position === "default") {
        const defaultPos = { x: window.innerWidth - width - 24, y: 24 };
        setCurrentPosition(defaultPos);
      } else {
        setCurrentPosition(position);
      }
    }
  }, [position, width, isDragging]);

  // Check if position is beyond window bounds (for pop-out detection)
  const checkBeyondBounds = useCallback((pos: Position): boolean => {
    if (typeof window === "undefined") {
      return false;
    }
    return (
      pos.x < -POP_OUT_THRESHOLD ||
      pos.y < -POP_OUT_THRESHOLD ||
      pos.x > window.innerWidth + POP_OUT_THRESHOLD ||
      pos.y > window.innerHeight + POP_OUT_THRESHOLD
    );
  }, []);

  // Constrain position to viewport with optional edge snapping
  const constrainPosition = useCallback(
    (pos: Position, allowBeyondBounds = false): Position => {
      if (typeof window === "undefined") {
        return pos;
      }

      let { x, y } = pos;

      if (!allowBeyondBounds) {
        // Hard constraints
        x = Math.max(0, Math.min(x, window.innerWidth - width));
        y = Math.max(0, Math.min(y, window.innerHeight - height));

        // Edge snapping
        if (x < snapThreshold) {
          x = 0;
        }
        if (y < snapThreshold) {
          y = 0;
        }
        if (window.innerWidth - x - width < snapThreshold) {
          x = window.innerWidth - width;
        }
        if (window.innerHeight - y - height < snapThreshold) {
          y = window.innerHeight - height;
        }
      }

      return { x, y };
    },
    [width, height, snapThreshold]
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (clientX: number, clientY: number, _element: HTMLElement) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartPosRef.current = { x: clientX, y: clientY };
      dragOffsetRef.current = {
        x: clientX - currentPosition.x,
        y: clientY - currentPosition.y,
      };

      onDragStart?.();
    },
    [currentPosition, onDragStart]
  );

  // Mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // Only start drag if clicking on drag handle area
      const target = e.target as HTMLElement;
      if (target.closest("[data-drag-handle]")) {
        e.preventDefault();
        // Find the draggable container (go up to the element with drag handlers)
        const container = e.currentTarget.closest(
          "[data-draggable-container]"
        ) as HTMLElement;
        if (container) {
          handleDragStart(e.clientX, e.clientY, container);
        }
      }
    },
    [handleDragStart]
  );

  // Touch events
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-drag-handle]")) {
        e.preventDefault();
        const touch = e.touches[0];
        const container = e.currentTarget.closest(
          "[data-draggable-container]"
        ) as HTMLElement;
        if (container) {
          handleDragStart(touch.clientX, touch.clientY, container);
        }
      }
    },
    [handleDragStart]
  );

  // Use refs for callbacks to prevent listener stacking (CRITICAL FIX)
  const constrainPositionRef = useRef(constrainPosition);
  const checkBeyondBoundsRef = useRef(checkBeyondBounds);
  const onBeyondBoundsRef = useRef(onBeyondBounds);
  const onDragEndRef = useRef(onDragEnd);
  const setPositionRef = useRef(setPosition);

  // Keep refs up to date
  useEffect(() => {
    constrainPositionRef.current = constrainPosition;
    checkBeyondBoundsRef.current = checkBeyondBounds;
    onBeyondBoundsRef.current = onBeyondBounds;
    onDragEndRef.current = onDragEnd;
    setPositionRef.current = setPosition;
  });

  // Handle dragging
  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) {
        return;
      }

      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Use requestAnimationFrame for smooth, performant updates
      animationFrameRef.current = requestAnimationFrame(() => {
        const newPos = {
          x: e.clientX - dragOffsetRef.current.x,
          y: e.clientY - dragOffsetRef.current.y,
        };

        // Check if beyond bounds for pop-out
        const isBeyond = checkBeyondBoundsRef.current(newPos);
        onBeyondBoundsRef.current?.(isBeyond);

        // Allow position beyond bounds while dragging (for pop-out)
        const constrainedPos = constrainPositionRef.current(newPos, true);

        // Update local state (no store update = fast)
        setCurrentPosition(constrainedPos);
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDraggingRef.current) {
        return;
      }

      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const finalPos = {
        x: e.clientX - dragOffsetRef.current.x,
        y: e.clientY - dragOffsetRef.current.y,
      };

      const isBeyond = checkBeyondBoundsRef.current(finalPos);

      if (!isBeyond) {
        // Normal drop - constrain and save (only save to store on drop, not during drag)
        const constrainedPos = constrainPositionRef.current(finalPos, false);

        setCurrentPosition(constrainedPos);
        setPositionRef.current(constrainedPos);
      }

      isDraggingRef.current = false;
      setIsDragging(false);
      onBeyondBoundsRef.current?.(false);
      onDragEndRef.current?.();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) {
        return;
      }

      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Use requestAnimationFrame for smooth, performant updates
      animationFrameRef.current = requestAnimationFrame(() => {
        const touch = e.touches[0];
        const newPos = {
          x: touch.clientX - dragOffsetRef.current.x,
          y: touch.clientY - dragOffsetRef.current.y,
        };

        const isBeyond = checkBeyondBoundsRef.current(newPos);
        onBeyondBoundsRef.current?.(isBeyond);

        const constrainedPos = constrainPositionRef.current(newPos, true);

        // Update local state (no store update = fast)
        setCurrentPosition(constrainedPos);
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDraggingRef.current) {
        return;
      }

      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const touch = e.changedTouches[0];
      const finalPos = {
        x: touch.clientX - dragOffsetRef.current.x,
        y: touch.clientY - dragOffsetRef.current.y,
      };

      const isBeyond = checkBeyondBoundsRef.current(finalPos);

      if (!isBeyond) {
        const constrainedPos = constrainPositionRef.current(finalPos, false);

        setCurrentPosition(constrainedPos);
        setPositionRef.current(constrainedPos);
      }

      isDraggingRef.current = false;
      setIsDragging(false);
      onBeyondBoundsRef.current?.(false);
      onDragEndRef.current?.();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);

      // Cleanup animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging]); // ✅ Only isDragging - uses refs for callbacks

  // Reset to default position
  const resetPosition = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    const defaultPos = { x: window.innerWidth - width - 24, y: 24 };
    setCurrentPosition(defaultPos);
    setPosition(defaultPos);
  }, [width, setPosition]);

  return {
    position: currentPosition,
    isDragging,
    handleMouseDown,
    handleTouchStart,
    resetPosition,
  };
}
