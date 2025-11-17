/**
 * useResizable Hook
 *
 * Custom hook for drag-to-resize functionality with snap points
 *
 * Features:
 * - Drag left edge to resize width
 * - Snap points at common widths (600px, 800px, 1000px, 1200px)
 * - Min/max width constraints (420px - 1400px)
 * - Persists width to preferences store
 * - Smooth resize animation
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useCallPreferencesStore } from "@/lib/stores/call-preferences-store";

type UseResizableOptions = {
	minWidth?: number;
	maxWidth?: number;
	snapPoints?: number[];
	snapThreshold?: number;
};

const DEFAULT_SNAP_POINTS = [600, 800, 1000, 1200];
const DEFAULT_MIN_WIDTH = 420;
const DEFAULT_MAX_WIDTH = 1400;
const DEFAULT_SNAP_THRESHOLD = 30;

export function useResizable(options: UseResizableOptions = {}) {
	const {
		minWidth = DEFAULT_MIN_WIDTH,
		maxWidth = DEFAULT_MAX_WIDTH,
		snapPoints = DEFAULT_SNAP_POINTS,
		snapThreshold = DEFAULT_SNAP_THRESHOLD,
	} = options;

	const width = useCallPreferencesStore((state) => state.popoverWidth);
	const setPopoverWidth = useCallPreferencesStore((state) => state.setPopoverWidth);

	const [isResizing, setIsResizing] = useState(false);
	const [tempWidth, setTempWidth] = useState(width);
	const startXRef = useRef(0);
	const startWidthRef = useRef(width);

	// Update temp width when store width changes
	useEffect(() => {
		if (!isResizing) {
			setTempWidth(width);
		}
	}, [width, isResizing]);

	// Handle mouse down on resize handle
	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			setIsResizing(true);
			startXRef.current = e.clientX;
			startWidthRef.current = tempWidth;
		},
		[tempWidth]
	);

	// Handle mouse move during resize
	useEffect(() => {
		if (!isResizing) {
			return;
		}

		const handleMouseMove = (e: MouseEvent) => {
			const deltaX = startXRef.current - e.clientX; // Inverted because resizing from right edge
			let newWidth = startWidthRef.current + deltaX;

			// Apply min/max constraints
			newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

			// Apply snap points
			for (const snapPoint of snapPoints) {
				if (Math.abs(newWidth - snapPoint) < snapThreshold) {
					newWidth = snapPoint;
					break;
				}
			}

			setTempWidth(newWidth);
		};

		const handleMouseUp = () => {
			setIsResizing(false);
			setPopoverWidth(tempWidth);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isResizing, minWidth, maxWidth, snapPoints, snapThreshold, tempWidth, setPopoverWidth]);

	// Handle touch events for mobile
	const handleTouchStart = useCallback(
		(e: React.TouchEvent) => {
			e.preventDefault();
			setIsResizing(true);
			startXRef.current = e.touches[0].clientX;
			startWidthRef.current = tempWidth;
		},
		[tempWidth]
	);

	useEffect(() => {
		if (!isResizing) {
			return;
		}

		const handleTouchMove = (e: TouchEvent) => {
			const deltaX = startXRef.current - e.touches[0].clientX;
			let newWidth = startWidthRef.current + deltaX;

			newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

			for (const snapPoint of snapPoints) {
				if (Math.abs(newWidth - snapPoint) < snapThreshold) {
					newWidth = snapPoint;
					break;
				}
			}

			setTempWidth(newWidth);
		};

		const handleTouchEnd = () => {
			setIsResizing(false);
			setPopoverWidth(tempWidth);
		};

		document.addEventListener("touchmove", handleTouchMove);
		document.addEventListener("touchend", handleTouchEnd);

		return () => {
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleTouchEnd);
		};
	}, [isResizing, minWidth, maxWidth, snapPoints, snapThreshold, tempWidth, setPopoverWidth]);

	return {
		width: isResizing ? tempWidth : width,
		isResizing,
		handleMouseDown,
		handleTouchStart,
		setWidth: setPopoverWidth,
	};
}
