/**
 * New Job Page (Legacy Route)
 * Redirects to /dashboard/work/new for consistency
 */

import { redirect } from "next/navigation";

export default function JobsNewPage() {
	redirect("/dashboard/work/new");
}
