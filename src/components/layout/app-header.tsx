import { getUserProfile } from "@/lib/auth/user-data";
import { AppHeaderClient } from "./app-header-client";

/**
 * AppHeader - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches user data BEFORE rendering (eliminates loading flash)
 * - Uses cached getUserProfile() with RLS security
 * - Passes data to minimal client component for interactivity only
 * - Better SEO and initial page load performance
 *
 * Why Server Component?
 * - Dashboard is always protected (user always logged in via middleware)
 * - No need for client-side loading states or auth checks
 * - Faster initial render with server-fetched data
 * - Smaller JavaScript bundle (auth logic stays on server)
 */

export async function AppHeader() {
  // Fetch user profile on server (cached with React cache())
  // This runs on server BEFORE sending HTML to client
  const userProfile = await getUserProfile();

  // If no user, this should never happen because dashboard is protected by middleware
  // But we handle it gracefully anyway
  if (!userProfile) {
    return null; // Middleware will redirect to login
  }

  // Pass server-fetched data to client component for interactivity
  // Client component only handles interactive parts (mobile menu, active nav state)
  return <AppHeaderClient userProfile={userProfile} />;
}
