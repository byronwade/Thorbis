import { BaseTracker } from "./BaseTracker";

export class SearchTracker extends BaseTracker {
	private searchInputs: Set<HTMLInputElement> = new Set();

	initialize(): void {
		this.detectSearchInputs();
		this.trackSearchInteractions();
	}

	private detectSearchInputs(): void {
		const inputs = document.querySelectorAll('input[type="search"], input[placeholder*="search" i]');
		inputs.forEach((input) => {
			if (input instanceof HTMLInputElement) {
				this.searchInputs.add(input);
			}
		});

		// Monitor DOM changes for dynamically added search inputs
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node instanceof HTMLInputElement && (node.type === "search" || node.placeholder?.toLowerCase().includes("search"))) {
						this.searchInputs.add(node);
					}
				});
			});
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}

	private trackSearchInteractions(): void {
		document.addEventListener("input", (e) => {
			const target = e.target as HTMLInputElement;
			if (this.searchInputs.has(target)) {
				this.trackEvent("search_input", {
					query: target.value,
					timestamp: Date.now(),
					element: this.getElementData(target),
				});
			}
		});

		document.addEventListener("submit", (e) => {
			const target = e.target as HTMLFormElement;
			const searchInput = target.querySelector('input[type="search"]');
			if (searchInput instanceof HTMLInputElement) {
				this.trackEvent("search_submit", {
					query: searchInput.value,
					timestamp: Date.now(),
					element: this.getElementData(searchInput),
				});
			}
		});
	}

	destroy(): void {
		this.searchInputs.clear();
	}
}
