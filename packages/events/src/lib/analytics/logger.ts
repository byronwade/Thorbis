type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
	private readonly DEBUG_MODE = process.env.NODE_ENV === "development";
	private logBuffer: Array<{ level: LogLevel; message: string; data?: any }> = [];
	private readonly BUFFER_SIZE = 100;

	constructor() {
		if (this.DEBUG_MODE) {
			console.log("🐛 Analytics Debug Mode Enabled");
		}
	}

	debug(message: string, data?: any) {
		this.log("debug", message, data);
	}

	info(message: string, data?: any) {
		this.log("info", message, data);
	}

	warn(message: string, data?: any) {
		this.log("warn", message, data);
	}

	error(message: string, data?: any) {
		this.log("error", message, data);
	}

	private log(level: LogLevel, message: string, data?: any) {
		const logEntry = { level, message, data, timestamp: new Date().toISOString() };

		// Add to buffer
		this.logBuffer.push(logEntry);
		if (this.logBuffer.length > this.BUFFER_SIZE) {
			this.logBuffer.shift();
		}

		// Console output in debug mode
		if (this.DEBUG_MODE) {
			const emoji = this.getLogEmoji(level);
			console[level](`${emoji} ${message}`, data || "");
		}
	}

	private getLogEmoji(level: LogLevel): string {
		switch (level) {
			case "debug":
				return "🐛";
			case "info":
				return "📊";
			case "warn":
				return "⚠️";
			case "error":
				return "❌";
		}
	}

	getLogs() {
		return [...this.logBuffer];
	}

	clearLogs() {
		this.logBuffer = [];
	}
}

export const logger = new Logger();
