/**
 * Better Auth Configuration for Convex
 * Provides authentication config for server-side validation
 */
import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";
import type { AuthConfig } from "convex/server";

export default {
	providers: [getAuthConfigProvider()],
} satisfies AuthConfig;

export const authConfig = {
	providers: [getAuthConfigProvider()],
} satisfies AuthConfig;
