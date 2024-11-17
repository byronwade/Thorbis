import { logger } from "./logger";

/**
 * Gets detailed information about a DOM element
 */
export function getElementData(element: HTMLElement): Record<string, any> {
	try {
		const rect = element.getBoundingClientRect();
		return {
			tag: element.tagName.toLowerCase(),
			id: element.id || undefined,
			classes: Array.from(element.classList),
			text: element.textContent?.trim().substring(0, 100) || undefined,
			attributes: Object.fromEntries(
				Array.from(element.attributes)
					.filter((attr) => !attr.name.startsWith("data-"))
					.map((attr) => [attr.name, attr.value])
			),
			dimensions: {
				width: Math.round(rect.width),
				height: Math.round(rect.height),
			},
			position: {
				x: Math.round(rect.left),
				y: Math.round(rect.top),
			},
		};
	} catch (error) {
		logger.error("Failed to get element data", error);
		return {};
	}
}

/**
 * Finds the section of the page an element is in
 */
export function findPageSection(element: HTMLElement): string {
	const sections = ["header", "nav", "main", "article", "aside", "footer"];
	let current = element;

	while (current && current !== document.body) {
		const tag = current.tagName.toLowerCase();
		if (sections.includes(tag)) {
			return tag;
		}
		if (current.getAttribute("role") === "region") {
			return current.getAttribute("aria-label") || "region";
		}
		current = current.parentElement!;
	}

	return "unknown";
}
