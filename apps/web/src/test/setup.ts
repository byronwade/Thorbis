/**
 * Vitest Test Setup
 * Global test configuration and mocks
 */

import { vi } from "vitest";

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

// Mock Supabase service client
vi.mock("@/lib/supabase/service-client", () => ({
	createServiceSupabaseClient: vi.fn(() => ({
		from: vi.fn(() => ({
			select: vi.fn(() => ({
				eq: vi.fn(() => ({
					eq: vi.fn(() => ({
						single: vi.fn(() => Promise.resolve({ data: null, error: null })),
						order: vi.fn(() => ({
							limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
						})),
					})),
					order: vi.fn(() => ({
						limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
					})),
					single: vi.fn(() => Promise.resolve({ data: null, error: null })),
					gte: vi.fn(() => ({
						lte: vi.fn(() => Promise.resolve({ data: [], error: null })),
					})),
					in: vi.fn(() => ({
						order: vi.fn(() => Promise.resolve({ data: [], error: null })),
					})),
				})),
				single: vi.fn(() => Promise.resolve({ data: null, error: null })),
			})),
			insert: vi.fn(() => ({
				select: vi.fn(() => ({
					single: vi.fn(() =>
						Promise.resolve({ data: { id: "test-id" }, error: null })
					),
				})),
			})),
			upsert: vi.fn(() => Promise.resolve({ data: null, error: null })),
			update: vi.fn(() => ({
				eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
			})),
		})),
		rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
		storage: {
			from: vi.fn(() => ({
				list: vi.fn(() => Promise.resolve({ data: [], error: null })),
			})),
		},
	})),
}));

// Mock createClient from @/lib/supabase/server
vi.mock("@/lib/supabase/server", () => ({
	createClient: vi.fn(() =>
		Promise.resolve({
			from: vi.fn(() => ({
				select: vi.fn(() => ({
					eq: vi.fn(() => ({
						single: vi.fn(() => Promise.resolve({ data: null, error: null })),
					})),
				})),
			})),
		})
	),
}));

// Global test utilities
export const createMockSupabaseResponse = <T>(data: T) => ({
	data,
	error: null,
});

export const createMockSupabaseError = (message: string) => ({
	data: null,
	error: { message, code: "ERROR" },
});
