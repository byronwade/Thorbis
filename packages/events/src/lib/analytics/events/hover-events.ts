import { analytics } from "../core/analytics";
import { logger } from "../utils/logger";
import { getElementData } from "../utils/dom";

let hoverStartTime: number | null = null;
let hoverElement: HTMLElement | null = null;
const HOVER_THRESHOLD = 500; // 500ms threshold for hover

// Elements that typically contain meaningful content
const CONTENT_ELEMENTS = new Set(["IMG", "VIDEO", "P", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "A", "BUTTON", "ARTICLE", "SECTION", "FIGURE", "FIGCAPTION", "BLOCKQUOTE", "CODE", "PRE", "LI", "TD", "TH", "LABEL", "INPUT", "TEXTAREA"]);

function isContentElement(element: HTMLElement): boolean {
	// Check if element is in our content elements list
	if (CONTENT_ELEMENTS.has(element.tagName)) {
		// For text elements, ensure they have content
		if (["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "BUTTON", "LABEL", "INPUT", "TEXTAREA", "LI", "UL", "OL"].includes(element.tagName)) {
			const content = element.textContent;
			return content ? content.trim().length > 0 : false;
		}
		// For images, ensure they have src or alt
		if (element.tagName === "IMG") {
			const img = element as HTMLImageElement;
			return !!(img.src || img.alt);
		}
		// For inputs, ensure they have a value or placeholder
		if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
			const input = element as HTMLInputElement;
			return !!(input.value || input.placeholder);
		}
		return true;
	}

	// Check for elements with specific roles
	const role = element.getAttribute("role");
	if (role && ["button", "link", "heading", "article", "contentinfo"].includes(role)) {
		return true;
	}

	// Check for elements with aria-label
	if (element.getAttribute("aria-label")) {
		return true;
	}

	return false;
}

export function initHoverTracking() {
	if (typeof window === "undefined") return;

	document.addEventListener("mouseover", handleMouseOver);
	document.addEventListener("mouseout", handleMouseOut);

	logger.debug("Hover tracking initialized");
}

function handleMouseOver(event: MouseEvent) {
	const target = event.target as HTMLElement;
	if (!target || hoverStartTime || !isContentElement(target)) return;

	hoverStartTime = Date.now();
	hoverElement = target;
}

function handleMouseOut() {
	if (!hoverStartTime || !hoverElement) return;

	const hoverDuration = Date.now() - hoverStartTime;
	if (hoverDuration >= HOVER_THRESHOLD) {
		trackHover(hoverElement, hoverDuration);
	}

	hoverStartTime = null;
	hoverElement = null;
}

async function trackHover(element: HTMLElement, duration: number) {
	try {
		const elementData = getElementData(element);
		const content = element.textContent;

		await analytics.track("hover", {
			element: elementData,
			duration,
			content: content ? content.trim().substring(0, 100) : undefined,
			tagName: element.tagName.toLowerCase(),
			hasImage: element.tagName === "IMG",
			hasVideo: element.tagName === "VIDEO",
			isInteractive: ["A", "BUTTON", "INPUT", "TEXTAREA"].includes(element.tagName),
			timestamp: Date.now(),
			path: window.location.pathname,
		});

		logger.debug("Hover tracked", {
			element: element.tagName,
			duration: `${duration}ms`,
			content: content ? content.trim().substring(0, 50) : undefined,
		});
	} catch (error) {
		logger.error("Failed to track hover", error);
	}
}
