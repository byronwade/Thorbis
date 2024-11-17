import { createClient } from "@vercel/edge-config";

const config = createClient(process.env.EDGE_CONFIG_ID!);

export async function getFeatureFlag(flag: string): Promise<boolean> {
	try {
		const value = await config.get<boolean>(flag);
		return value ?? false;
	} catch {
		return false;
	}
}
