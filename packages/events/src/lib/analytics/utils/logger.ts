type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
	private level: LogLevel = "debug";
	private enabled: boolean = true;

	constructor() {
		if (process.env.NODE_ENV === "development") {
			this.level = "debug";
			console.log("🔍 Analytics Logger initialized in debug mode");
		}
	}

	setLevel(level: LogLevel) {
		this.level = level;
		console.log(`🔧 Logger level set to: ${level}`);
	}

	enable() {
		this.enabled = true;
		console.log("📊 Analytics logging enabled");
	}

	disable() {
		this.enabled = false;
		console.log("🚫 Analytics logging disabled");
	}

	debug(message: string, ...args: any[]) {
		if (this.enabled && this.shouldLog("debug")) {
			console.group(`🔍 DEBUG: ${message}`);
			if (args.length) console.log(...args);
			console.groupEnd();
		}
	}

	info(message: string, ...args: any[]) {
		if (this.enabled && this.shouldLog("info")) {
			console.group(`ℹ️ INFO: ${message}`);
			if (args.length) console.log(...args);
			console.groupEnd();
		}
	}

	warn(message: string, ...args: any[]) {
		if (this.enabled && this.shouldLog("warn")) {
			console.group(`⚠️ WARNING: ${message}`);
			if (args.length) console.log(...args);
			console.groupEnd();
		}
	}

	error(message: string, ...args: any[]) {
		if (this.enabled && this.shouldLog("error")) {
			console.group(`❌ ERROR: ${message}`);
			if (args.length) console.log(...args);
			console.groupEnd();
		}
	}

	private shouldLog(level: LogLevel): boolean {
		const levels: LogLevel[] = ["debug", "info", "warn", "error"];
		return levels.indexOf(level) >= levels.indexOf(this.level);
	}
}

export const logger = new Logger();
