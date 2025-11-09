/**
 * useResizableMulti Hook
 *
 * Multi-directional resize functionality with snap points
 *
 * Features:
 * - Resize from any edge (top, right, bottom, left)
 * - Resize from corners (diagonal resizing)
 * - Snap points at common sizes
 * - Min/max width and height constraints
 * - Persists size to preferences store
 * - Adjusts position when resizing from top/left
 *
 * Performance optimizations:
 * - Uses requestAnimationFrame for smooth resizing
 * - Debounced store updates
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useCallPreferencesStore } from "@/lib/stores/call-preferences-store";

export type ResizeDirection = "n" | "e" | "s" | "w" | "ne" | "se" | "sw" | "nw";

type UseResizableMultiOptions = {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  snapPoints?: number[];
  snapThreshold?: number;
  onResize?: (width: number, height: number, x: number, y: number) => void;
};

const DEFAULT_SNAP_POINTS = [600, 800, 1000, 1200];
const DEFAULT_MIN_WIDTH = 420;
const DEFAULT_MAX_WIDTH = 1400;
const DEFAULT_MIN_HEIGHT = 400;
const DEFAULT_MAX_HEIGHT = 2000;
const DEFAULT_SNAP_THRESHOLD = 30;

export function useResizableMulti(
  currentPosition: { x: number; y: number },
  currentHeight: number,
  options: UseResizableMultiOptions = {}
) {
  const {
    minWidth = DEFAULT_MIN_WIDTH,
    maxWidth = DEFAULT_MAX_WIDTH,
    minHeight = DEFAULT_MIN_HEIGHT,
    maxHeight = DEFAULT_MAX_HEIGHT,
    snapPoints = DEFAULT_SNAP_POINTS,
    snapThreshold = DEFAULT_SNAP_THRESHOLD,
    onResize,
  } = options;

  const width = useCallPreferencesStore((state) => state.popoverWidth);
  const setPopoverWidth = useCallPreferencesStore(
    (state) => state.setPopoverWidth
  );
  const setPosition = useCallPreferencesStore((state) => state.setPosition);

  const [isResizing, setIsResizing] = useState(false);
  const [activeDirection, setActiveDirection] =
    useState<ResizeDirection | null>(null);

  // Local state for instant updates during resize (no store latency)
  const [localState, setLocalState] = useState({
    width,
    height: currentHeight,
    x: currentPosition.x,
    y: currentPosition.y,
  });

  const startRef = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
  });
  const animationFrameRef = useRef<number | null>(null);
  const isResizingRef = useRef(false);

  // Apply snap to value
  const applySnap = useCallback(
    (value: number): number => {
      for (const snapPoint of snapPoints) {
        if (Math.abs(value - snapPoint) < snapThreshold) {
          return snapPoint;
        }
      }
      return value;
    },
    [snapPoints, snapThreshold]
  );

  // Sync local state with props when not resizing
  useEffect(() => {
    if (!isResizing) {
      setLocalState({
        width,
        height: currentHeight,
        x: currentPosition.x,
        y: currentPosition.y,
      });
    }
  }, [width, currentHeight, currentPosition, isResizing]);

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, direction: ResizeDirection) => {
      e.preventDefault();
      e.stopPropagation();

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      isResizingRef.current = true;
      setIsResizing(true);
      setActiveDirection(direction);

      startRef.current = {
        x: clientX,
        y: clientY,
        width: localState.width,
        height: localState.height,
        posX: localState.x,
        posY: localState.y,
      };
    },
    [localState]
  );

  // Calculate new dimensions based on direction
  const calculateResize = useCallback(
    (deltaX: number, deltaY: number, direction: ResizeDirection) => {
      const {
        width: startWidth,
        height: startHeight,
        posX: startPosX,
        posY: startPosY,
      } = startRef.current;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      // Handle horizontal resizing
      if (direction.includes("e")) {
        // Resize from right edge (width increases with mouse movement right)
        newWidth = startWidth + deltaX;
      } else if (direction.includes("w")) {
        // Resize from left edge (width increases with mouse movement left, position adjusts)
        newWidth = startWidth - deltaX;
        newX = startPosX + deltaX;
      }

      // Handle vertical resizing
      if (direction.includes("s")) {
        // Resize from bottom edge (height increases with mouse movement down)
        newHeight = startHeight + deltaY;
      } else if (direction.includes("n")) {
        // Resize from top edge (height increases with mouse movement up, position adjusts)
        newHeight = startHeight - deltaY;
        newY = startPosY + deltaY;
      }

      // Apply constraints
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

      // Apply snap points (only to width for now)
      newWidth = applySnap(newWidth);

      // If we hit min/max constraints, adjust position back
      if (direction.includes("w")) {
        const actualWidthChange = newWidth - startWidth;
        newX = startPosX - actualWidthChange;
      }
      if (direction.includes("n")) {
        const actualHeightChange = newHeight - startHeight;
        newY = startPosY - actualHeightChange;
      }

      return { width: newWidth, height: newHeight, x: newX, y: newY };
    },
    [minWidth, maxWidth, minHeight, maxHeight, applySnap]
  );

  // Use refs for callbacks to prevent listener stacking (CRITICAL FIX)
  const calculateResizeRef = useRef(calculateResize);
  const onResizeRef = useRef(onResize);
  const setPopoverWidthRef = useRef(setPopoverWidth);
  const setPositionRef = useRef(setPosition);
  const localStateRef = useRef(localState);

  // Keep refs up to date
  useEffect(() => {
    calculateResizeRef.current = calculateResize;
    onResizeRef.current = onResize;
    setPopoverWidthRef.current = setPopoverWidth;
    setPositionRef.current = setPosition;
    localStateRef.current = localState;
  });

  // Handle resize move
  useEffect(() => {
    if (!(isResizing && activeDirection)) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isResizingRef.current) return;

      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Use requestAnimationFrame for smooth, performant updates
      animationFrameRef.current = requestAnimationFrame(() => {
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - startRef.current.x;
        const deltaY = clientY - startRef.current.y;

        const newState = calculateResizeRef.current(
          deltaX,
          deltaY,
          activeDirection
        );

        // Update local state (no store update = fast)
        setLocalState(newState);
        localStateRef.current = newState;

        // Trigger callback for other updates (like height state in parent)
        onResizeRef.current?.(
          newState.width,
          newState.height,
          newState.x,
          newState.y
        );
      });
    };

    const handleEnd = () => {
      if (!isResizingRef.current) return;

      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Save to store once at the end (prevents lag during resize)
      const currentState = localStateRef.current;
      setPopoverWidthRef.current(currentState.width);
      setPositionRef.current({ x: currentState.x, y: currentState.y });

      isResizingRef.current = false;
      setIsResizing(false);
      setActiveDirection(null);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove);
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);

      // Cleanup animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isResizing, activeDirection]); // ✅ Stable dependencies only

  // Create handle props for each direction
  const createHandleProps = useCallback(
    (direction: ResizeDirection) => ({
      onMouseDown: (e: React.MouseEvent) => handleResizeStart(e, direction),
      onTouchStart: (e: React.TouchEvent) => handleResizeStart(e, direction),
    }),
    [handleResizeStart]
  );

  return {
    // State - always use local state for instant updates
    width: localState.width,
    height: localState.height,
    position: { x: localState.x, y: localState.y },
    isResizing,
    activeDirection,

    // Handle props generators
    handleNorth: createHandleProps("n"),
    handleEast: createHandleProps("e"),
    handleSouth: createHandleProps("s"),
    handleWest: createHandleProps("w"),
    handleNorthEast: createHandleProps("ne"),
    handleSouthEast: createHandleProps("se"),
    handleSouthWest: createHandleProps("sw"),
    handleNorthWest: createHandleProps("nw"),
  };
}
