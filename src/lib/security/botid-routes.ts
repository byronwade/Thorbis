type BotIdMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "*";

export type BotIdProtectedRoute = {
  path: string;
  method: BotIdMethod;
};

/**
 * Shared BotID configuration for client instrumentation and (future) tooling.
 *
 * Keep this list in sync with any server actions or API routes that call {@link checkBotId}.
 */
export const botIdProtectedRoutes = [
  // Auth API fallbacks (legacy / future API routes)
  { path: "/api/auth/signup", method: "POST" },
  { path: "/api/auth/signin", method: "POST" },
  { path: "/api/auth/forgot-password", method: "POST" },
  { path: "/api/auth/reset-password", method: "POST" },

  // App Router pages that submit auth server actions
  { path: "/login", method: "POST" },
  { path: "/register", method: "POST" },
  { path: "/forgot-password", method: "POST" },
  { path: "/reset-password", method: "POST" },
] satisfies BotIdProtectedRoute[];
