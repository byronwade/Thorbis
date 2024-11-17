export function getElementData(element: HTMLElement): Record<string, any> {
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
}
