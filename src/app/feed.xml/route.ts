/**
 * Atom Feed Route (Alternative format)
 *
 * Accessible at /feed.xml
 * Some feed readers prefer Atom format over RSS 2.0
 */

// Route config must be defined directly (can't re-export)
export const dynamic = "force-static";
export const revalidate = 3600;

// Re-export the GET handler
export { GET } from "../feed/route";
