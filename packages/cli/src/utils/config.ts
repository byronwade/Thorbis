import fs from "fs/promises";
import path from "path";

interface ThorbisConfig {
	registry?: {
		url: string;
		token?: string;
	};
	components?: {
		path: string;
		defaultVersion?: string;
	};
	ai?: {
		enabled: boolean;
		apiKey?: string;
	};
}

const DEFAULT_CONFIG: ThorbisConfig = {
	registry: {
		url: "https://registry.thorbis.io",
	},
	components: {
		path: "./src/components",
		defaultVersion: "0.1.0",
	},
	ai: {
		enabled: false,
	},
};

export async function loadConfig(): Promise<ThorbisConfig> {
	try {
		const configPath = path.join(process.cwd(), ".thorbisrc.json");
		const configFile = await fs.readFile(configPath, "utf-8");
		return { ...DEFAULT_CONFIG, ...JSON.parse(configFile) };
	} catch (error) {
		return DEFAULT_CONFIG;
	}
}

export async function saveConfig(config: ThorbisConfig): Promise<void> {
	const configPath = path.join(process.cwd(), ".thorbisrc.json");
	await fs.writeFile(configPath, JSON.stringify(config, null, 2));
}
