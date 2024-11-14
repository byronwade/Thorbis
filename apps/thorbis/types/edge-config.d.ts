declare module "@vercel/edge-config" {
	export interface EdgeConfigClient {
		get<T = unknown>(key: string): Promise<T>;
		set<T = unknown>(key: string, value: T): Promise<void>;
		getAll(): Promise<Record<string, unknown>>;
	}

	export function createClient(token: string): EdgeConfigClient;
}
