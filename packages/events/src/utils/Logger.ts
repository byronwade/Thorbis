export class Logger {
	private static instance: Logger;
	private container: HTMLElement | null = null;
	private updateInterval: number = 1000;
	private lastUpdate: number = 0;

	private constructor() {
		if (typeof window !== "undefined") {
			this.initializeContainer();
		}
	}

	private initializeContainer() {
		if (typeof document === "undefined") return;

		this.container = document.createElement("div");
		this.container.id = "thorbis-logger";
		this.container.style.cssText = `
			position: fixed;
			bottom: 20px;
			right: 20px;
			max-width: 400px;
			max-height: 600px;
			overflow: auto;
			background: rgba(0, 0, 0, 0.8);
			color: #fff;
			font-family: monospace;
			padding: 15px;
			border-radius: 8px;
			z-index: 9999;
			font-size: 12px;
		`;
		document.body.appendChild(this.container);
	}

	public log(data: any) {
		if (!this.container || typeof window === "undefined") return;

		const now = Date.now();
		if (now - this.lastUpdate < this.updateInterval) return;

		this.lastUpdate = now;
		this.container.innerHTML = this.formatData(data);
	}

	private formatData(data: any): string {
		if (typeof data === "object") {
			return Object.entries(data)
				.map(([key, value]) => this.formatSection(key, value))
				.join("");
		}
		return String(data);
	}

	private formatSection(key: string, value: any): string {
		if (Array.isArray(value)) {
			return `
				<div class="section">
					<h3>${key}</h3>
					${value.map((item) => `<div>${JSON.stringify(item)}</div>`).join("")}
				</div>
			`;
		}
		return `
			<div class="section">
				<h3>${key}</h3>
				<div>${JSON.stringify(value, null, 2)}</div>
			</div>
		`;
	}

	static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}
		return Logger.instance;
	}

	public destroy() {
		if (this.container && typeof document !== "undefined") {
			document.body.removeChild(this.container);
			this.container = null;
		}
	}
}
