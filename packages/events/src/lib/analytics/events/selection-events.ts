import { analytics } from "../core/analytics";
import { logger } from "../utils/logger";
import { getElementData } from "../utils/dom";

let lastSelection: Selection | null = null;
const SELECTION_THRESHOLD = 2; // Minimum characters to track

export function initSelectionTracking() {
	if (typeof window === "undefined") return;

	document.addEventListener("selectionchange", handleSelectionChange);
	document.addEventListener("mouseup", handleMouseUp); // For mouse selections
	document.addEventListener("keyup", handleKeyUp); // For keyboard selections

	logger.debug("Selection tracking initialized");
}

function handleSelectionChange() {
	lastSelection = window.getSelection();
}

function handleMouseUp() {
	trackSelection("mouse");
}

function handleKeyUp(event: KeyboardEvent) {
	// Check if it's a selection-related key (Shift + Arrow keys)
	if (event.shiftKey && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
		trackSelection("keyboard");
	}
}

async function trackSelection(method: "mouse" | "keyboard") {
	if (!lastSelection) return;

	const selectedText = lastSelection.toString().trim();
	if (selectedText.length < SELECTION_THRESHOLD) return;

	try {
		const range = lastSelection.getRangeAt(0);
		const container = range.commonAncestorContainer.parentElement;
		if (!container) return;

		const elementData = getElementData(container);

		await analytics.track("text_selection", {
			text: selectedText,
			length: selectedText.length,
			element: elementData,
			method,
			context: {
				beforeSelection: range.startContainer.textContent?.slice(Math.max(0, range.startOffset - 50), range.startOffset),
				afterSelection: range.endContainer.textContent?.slice(range.endOffset, range.endOffset + 50),
			},
			position: {
				start: range.startOffset,
				end: range.endOffset,
			},
			timestamp: Date.now(),
			path: window.location.pathname,
		});

		logger.debug("Text selection tracked", {
			text: selectedText.slice(0, 50) + (selectedText.length > 50 ? "..." : ""),
			length: selectedText.length,
			method,
		});
	} catch (error) {
		logger.error("Failed to track text selection", error);
	}
}
