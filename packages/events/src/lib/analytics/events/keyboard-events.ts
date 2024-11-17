import { analytics } from "../core/analytics";
import { logger } from "../utils/logger";
import { getElementData } from "../utils/dom";

// Common keyboard shortcuts to track
const SHORTCUTS = new Map([
	// Navigation shortcuts
	["ctrl+f", "find"],
	["ctrl+g", "find-next"],
	["ctrl+h", "history"],
	["ctrl+j", "downloads"],
	["ctrl+l", "location"],
	["ctrl+p", "print"],
	["ctrl+s", "save"],
	["ctrl+w", "close-tab"],
	["ctrl+t", "new-tab"],
	["ctrl+shift+t", "reopen-tab"],
	// Edit shortcuts
	["ctrl+c", "copy"],
	["ctrl+v", "paste"],
	["ctrl+x", "cut"],
	["ctrl+z", "undo"],
	["ctrl+y", "redo"],
	["ctrl+a", "select-all"],
]);

let lastKeyPressTime = 0;
const KEY_COMBO_TIMEOUT = 1000; // Time window for key combinations
let currentCombo: string[] = [];

export function initKeyboardTracking() {
	if (typeof window === "undefined") return;

	document.addEventListener("keydown", handleKeyDown);
	document.addEventListener("keyup", handleKeyUp);
	document.addEventListener("copy", handleCopy);
	document.addEventListener("paste", handlePaste);
	document.addEventListener("cut", handleCut);
	window.addEventListener("blur", resetKeyboardState);
	window.addEventListener("beforeprint", handleBeforePrint);
	window.addEventListener("afterprint", handleAfterPrint);

	logger.debug("Keyboard tracking initialized");
}

function handleKeyDown(event: KeyboardEvent) {
	const now = Date.now();
	const target = event.target as HTMLElement;

	// Track key combinations
	if (event.ctrlKey || event.metaKey || event.altKey) {
		const combo = getKeyCombo(event);
		if (!currentCombo.includes(combo)) {
			currentCombo.push(combo);
		}

		// Check if it's a known shortcut
		const shortcutName = SHORTCUTS.get(combo.toLowerCase());
		if (shortcutName) {
			trackShortcut(shortcutName, combo, target, event);

			// Prevent default for certain shortcuts to capture their data
			if (["copy", "cut", "paste"].includes(shortcutName)) {
				// Don't prevent these as we'll capture them in their specific handlers
			} else if (shortcutName === "print") {
				// Let print happen naturally, we'll capture in beforeprint event
			} else {
				// Other shortcuts we might want to track
				trackShortcutContext(shortcutName, target, event);
			}
		}
	}

	// Track typing speed and patterns
	if (now - lastKeyPressTime < 1000) {
		// Only track if within 1 second of last press
		trackKeyboardMetrics(event, now - lastKeyPressTime, target);
	}

	lastKeyPressTime = now;
}

function handleKeyUp(event: KeyboardEvent) {
	setTimeout(() => {
		currentCombo = [];
	}, KEY_COMBO_TIMEOUT);
}

function resetKeyboardState() {
	currentCombo = [];
	lastKeyPressTime = 0;
}

function getKeyCombo(event: KeyboardEvent): string {
	const parts: string[] = [];
	if (event.ctrlKey) parts.push("ctrl");
	if (event.altKey) parts.push("alt");
	if (event.shiftKey) parts.push("shift");
	if (event.metaKey) parts.push("meta");
	parts.push(event.key.toLowerCase());
	return parts.join("+");
}

async function trackShortcut(name: string, combo: string, target: HTMLElement, event: KeyboardEvent) {
	try {
		await analytics.track("keyboard_shortcut", {
			name,
			combo,
			element: getElementData(target),
			timestamp: Date.now(),
			path: window.location.pathname,
		});

		logger.debug("Keyboard shortcut tracked", { name, combo });
	} catch (error) {
		logger.error("Failed to track keyboard shortcut", error);
	}
}

async function trackKeyboardMetrics(event: KeyboardEvent, timeSinceLastKey: number, target: HTMLElement) {
	try {
		await analytics.track("keyboard_metrics", {
			key: event.key,
			isSpecialKey: event.ctrlKey || event.altKey || event.metaKey,
			timeSinceLastKey,
			element: getElementData(target),
			context: {
				isTyping: target.tagName === "INPUT" || target.tagName === "TEXTAREA",
				fieldType: (target as HTMLInputElement).type,
				fieldName: (target as HTMLInputElement).name,
			},
			timestamp: Date.now(),
			path: window.location.pathname,
		});

		logger.debug("Keyboard metrics tracked", {
			key: event.key,
			timeSinceLastKey: `${timeSinceLastKey}ms`,
		});
	} catch (error) {
		logger.error("Failed to track keyboard metrics", error);
	}
}

async function handleCopy(event: ClipboardEvent) {
	try {
		const selection = window.getSelection()?.toString().trim();
		const target = event.target as HTMLElement;

		await analytics.track("clipboard_operation", {
			type: "copy",
			content: selection?.substring(0, 100),
			contentLength: selection?.length,
			element: getElementData(target),
			context: {
				isPassword: (target as HTMLInputElement)?.type === "password",
				isInput: target.tagName === "INPUT" || target.tagName === "TEXTAREA",
				fieldName: (target as HTMLInputElement)?.name,
			},
			timestamp: Date.now(),
			path: window.location.pathname,
		});

		logger.debug("Copy operation tracked", {
			contentLength: selection?.length,
			element: target.tagName,
		});
	} catch (error) {
		logger.error("Failed to track copy operation", error);
	}
}

async function handlePaste(event: ClipboardEvent) {
	try {
		const target = event.target as HTMLElement;
		const pastedData = event.clipboardData?.getData("text");

		await analytics.track("clipboard_operation", {
			type: "paste",
			contentLength: pastedData?.length,
			element: getElementData(target),
			context: {
				isPassword: (target as HTMLInputElement)?.type === "password",
				isInput: target.tagName === "INPUT" || target.tagName === "TEXTAREA",
				fieldName: (target as HTMLInputElement)?.name,
				contentType: event.clipboardData?.types.join(", "),
			},
			timestamp: Date.now(),
			path: window.location.pathname,
		});

		logger.debug("Paste operation tracked", {
			contentLength: pastedData?.length,
			element: target.tagName,
		});
	} catch (error) {
		logger.error("Failed to track paste operation", error);
	}
}

async function handleCut(event: ClipboardEvent) {
	try {
		const selection = window.getSelection()?.toString().trim();
		const target = event.target as HTMLElement;

		await analytics.track("clipboard_operation", {
			type: "cut",
			content: selection?.substring(0, 100),
			contentLength: selection?.length,
			element: getElementData(target),
			context: {
				isPassword: (target as HTMLInputElement)?.type === "password",
				isInput: target.tagName === "INPUT" || target.tagName === "TEXTAREA",
				fieldName: (target as HTMLInputElement)?.name,
			},
			timestamp: Date.now(),
			path: window.location.pathname,
		});

		logger.debug("Cut operation tracked", {
			contentLength: selection?.length,
			element: target.tagName,
		});
	} catch (error) {
		logger.error("Failed to track cut operation", error);
	}
}

function handleBeforePrint() {
	analytics.track("print_operation", {
		status: "started",
		timestamp: Date.now(),
		path: window.location.pathname,
		context: {
			title: document.title,
			url: window.location.href,
		},
	});
}

function handleAfterPrint() {
	analytics.track("print_operation", {
		status: "completed",
		timestamp: Date.now(),
		path: window.location.pathname,
	});
}

async function trackShortcutContext(name: string, target: HTMLElement, event: KeyboardEvent) {
	const contextData: Record<string, any> = {
		target: getElementData(target),
	};

	// Add context based on shortcut type
	switch (name) {
		case "find":
		case "find-next":
			contextData.searchQuery = (document as any).getSelection()?.toString();
			break;
		case "save":
			contextData.pageTitle = document.title;
			contextData.url = window.location.href;
			break;
		case "select-all":
			contextData.selectedContent = {
				length: document.getSelection()?.toString().length,
				type: target.tagName,
			};
			break;
		// Add more context for other shortcuts as needed
	}

	await analytics.track("shortcut_context", {
		name,
		...contextData,
		timestamp: Date.now(),
		path: window.location.pathname,
	});
}
